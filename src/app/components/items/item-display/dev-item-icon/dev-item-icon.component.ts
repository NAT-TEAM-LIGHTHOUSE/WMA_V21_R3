import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DevImageIconMastEditorPage } from 'src/app/pages/dev-image-icon-mast-editor/dev-image-icon-mast-editor.page';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { OverlayEventDetail } from '@ionic/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-dev-item-icon',
  templateUrl: './dev-item-icon.component.html',
  styleUrls: ['./dev-item-icon.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class DevItemIconComponent implements OnInit {

  @Input() menutab:any;
  imgUrl:any;
  imgData:any = [];
  
  constructor(public modalCtrl: ModalController,public globalObjects: GlobalObjectsService) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"dev-item-icon")
    }
  }

  ngOnInit() {
    if(this.globalObjects.devItemIcon && this.globalObjects.devItemIcon != "" && (this.globalObjects.devItemIcon.indexOf("#") > -1)){
      this.imgData = this.globalObjects.devItemIcon.split("#");
    }else{
      this.imgData[0] = "";
      this.imgData[1] = "";
    }
    this.imgUrl = this.globalObjects.getScopeUrl()+'getImage?id='+this.imgData[0]+'&appTheme='+this.globalObjects.appTheme;
  }

  img(){
    var val = this.imgUrl;
    return val
  }

  onImgError(event){
    event.target.src = './assets/imgs/no_image.png'
   }

  async itemClicked(){
    const iconModal = await this.modalCtrl.create({
      component: DevImageIconMastEditorPage,
      cssClass: 'my-custom-class',
      componentProps:{
        data: this.imgData[1]
      }
    });


    iconModal.onDidDismiss().then((res:OverlayEventDetail) =>{
        if(res.role == "backdrop"){}else{
          this.menutab.apps_icon_name = res.data.icon_name;
          this.imgUrl = res.data.img;
          this.img();
        }
    })
    return await iconModal.present();
  }

}
