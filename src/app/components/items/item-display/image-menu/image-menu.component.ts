import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-image-menu',
  templateUrl: './image-menu.component.html',
  styleUrls: ['./image-menu.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class ImageMenuComponent implements OnInit {

  @Input() imageMenu: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  imgData:any;
  constructor(private dataService: DataService, private globalObject: GlobalObjectsService) {
    if(this.globalObject.itemFlag){
      return applyLoggingDecorator(this,"image-menu")
    }
   }

  ngOnInit() {
    let url = 'getImage?id='+this.imageMenu.apps_item_seqid+'&appTheme='+this.globalObject.appTheme;
      if(this.globalObject.presentImages.indexOf(this.imageMenu.apps_icon_name) > -1){
        this.imgData =  '../../../../../assets/imgs/example/' + this.imageMenu.apps_icon_name + '.jpg';
      }
      else{
        this.dataService.getData(url)
        .then(res => {
          var data: any = res;
          if(data != null){
            if (data.status == 'success') {
              this.imgData = 'data:image/png;base64,' + data.img;
            } else {
              this.imgData = '/assets/imgs/no_image.png';
            }
          }
          else{
            this.imgData = '/assets/imgs/no_image.png';
          }
        }, err => {
          this.imgData = null;
        })
      }
    }
  
  itemClicked(){
    this.emitPass.emit(this.imageMenu);
  }
}
