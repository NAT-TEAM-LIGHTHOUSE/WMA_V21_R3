import { Component, Input, OnInit, Output,EventEmitter, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular/standalone';
import { ImagePreviewPage } from 'src/app/pages/image-preview/image-preview.page';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
 imports :[...STANDALONE_IMPORTS],
  selector: 'app-item-image',
  templateUrl: './item-image.component.html',
  styleUrls: ['./item-image.component.scss'],
})
export class ItemImageComponent implements OnInit,OnDestroy {

  @Input() displayPhoto: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  imgData: any;
  @Input() styleCss: any;

  @Input() frame_type: any;
  @Input() frameSeqId:any
  constructor(private dataService: DataService, private modalCtrl: ModalController, public globalObjects: GlobalObjectsService,
    private events: Events, private sqlServ: SqlLiteService, public sanitizer: DomSanitizer,private lhs_lib: LhsLibService, private cdEngine: CdEngineService) {
    this.events.subscribe("DISPLAY_PHOTO", () => {
      this.showItemImage(this.displayPhoto);
    })
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"item-image")
    }
  }
ngOnDestroy(): void {
  this.events.unsubscribe("DISPLAY_PHOTO");
}
  ngOnInit() {
    if (this.displayPhoto.value) {
      if(this.displayPhoto.item_sub_type=='NAME_ALIAS'){
          this.getUserInitials();
      }else{
        this.showItemImage(this.displayPhoto);
      }
    
    } else {
      this.getIcon();
    }

    if(!this.displayPhoto.apps_icon_name){
      this.displayPhoto.apps_icon_name = "aperture";
    }
    if(!this.displayPhoto.css_class){
      this.displayPhoto.css_class = "bg-blue";
    }
  }

  showItemImage(displayPhoto) {
    this.imgData = '/assets/imgs/no_image.png';
    if (displayPhoto) {
      let url = 'getItemImage?query=' + encodeURIComponent(displayPhoto.value);
      if (displayPhoto.value) {
        this.dataService.getData(url)
          .then(res => {
            var data: any = res;
            if (data.status == 'success') {
              this.imgData = 'data:image/png;base64,' + data.img;
            } else {
              this.imgData = '/assets/imgs/no_image.png';
            }
          this.cdEngine.detect(this.frameSeqId);
          }, err => {
            this.imgData = null;
          })
      }
    }
  }


  downloadFile() {

  const base64 = this.imgData.split(',')[1];
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(null)
    .map((_, i) => byteCharacters.charCodeAt(i));

  const blob = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "image.png";
  a.click();

  URL.revokeObjectURL(url);


}



  getIcon() {

    if (this.displayPhoto.apps_icon_name) {
      var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.displayPhoto.apps_icon_name + '&appTheme=' + this.globalObjects.appTheme;

      this.sqlServ.getImageFromLocal(this.displayPhoto, val).then((res: any) => {
        this.imgData = this.sanitizer.bypassSecurityTrustUrl(res);
      });
    }
  }

  async photoview() {
    const modal = await this.modalCtrl.create({
      component: ImagePreviewPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img: this.imgData
      }
    });
    modal.present();
  }


  itemClick(event) {
    this.displayPhoto.itemClicked = 'pre';
    this.emitPass.emit(this.displayPhoto);
  }

  
  itemClicked(event){
    this.emitPass.emit(event);
  }

  getUserInitials(){
    let name = this.displayPhoto.value;
  // let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  // let initials:any = [...name.matchAll(rgx)] || [];
  let rgx = /(\p{L})\p{L}+/gu;
  let initials = [...(name?.matchAll(rgx) ?? [])];
  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
  console.log(initials);
  this.displayPhoto.userInitials=initials;
  }
}


