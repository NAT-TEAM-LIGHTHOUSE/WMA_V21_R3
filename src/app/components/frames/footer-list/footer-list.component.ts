import { Component, OnInit,Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-footer-list',
  templateUrl: './footer-list.component.html',
  styleUrls: ['./footer-list.component.scss'],
  imports : [STANDALONE_IMPORTS]
})
export class FooterListComponent implements OnInit {
  footerArr = [];
  @Input() frame: any = {};

  constructor(public popoverController: PopoverController,
    public sanitizer: DomSanitizer,public globalObjects: GlobalObjectsService) {
      if(this.globalObjects.frameFlag){
        return applyLoggingDecorator(this,"footer-list-frame")
      }
     }

  ngOnInit() {
    let frameLevel4;
    frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    let footArr = [];
    for (let itemGroup of frameLevel4) {
      for (let item of itemGroup.Level5) {      
          footArr.push(item);
      }
    }

    this.footerArr = footArr.reverse();
    this.getImg(0);
  }

  getImg(i){
    if(i >= this.footerArr.length){}else{
        let item = this.footerArr[i];
        var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + item.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme;
        this.getBase64ImageFromUrl(val).then((res: any) => {
          item.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
          this.getImg(i+1);
        });
      }

  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {

      this.globalObjects.converToBase64(blob).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  closePopover(item){
    let obj = {
      data : item,
      role : "itemClick"
    }
    this.popoverController.dismiss(obj);
  }

  onImgError(event) {
    event.target.src = '../../../../assets/imgs/no_image.png'
  }
}
