import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {  ModalController } from '@ionic/angular/standalone';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-image-preview',
  templateUrl: './image-preview.page.html',
  styleUrls: ['./image-preview.page.scss'],
})
export class ImagePreviewPage implements OnInit {

  // @ViewChild(IonSlides) slides: IonSlides;
  @Input('img') img: any;

  sliderOpts = {
    zoom: true
  };

  constructor(private modalCtrl: ModalController,private socialSharing: SocialSharing, private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"image-privew-page")
    }
  }

  ngOnInit() {
    console.log(this.img);
   
    let val = this.img.split(':')[1];
    let type = val.split(';')[0];
    console.log(type);

      const imgBlob = new Blob([this.img], { type: type });
      console.log('imgBlob', imgBlob);
      const base64Image =  this.toBase64(imgBlob);
      console.log(base64Image)
  }

  ionViewDidEnter() {
    // this.slides.update();
  }

  async zoom(zoomIn: boolean) {
    // const slider = await this.slides.getSwiper();
    // const zoom = slider.zoom;
    // zoomIn ? zoom.in() : zoom.out();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  socialShare(){
    this.socialSharing.share(null, null , this.img, null);
  }
  
  async shareImage() {

    let val = this.img.split(':')[1];
    let type = val.split(';')[0];
    console.log(type);
    try {
      const imgBlob = new Blob([this.img], { type: type });
      console.log('imgBlob', imgBlob);
      const base64Image = await this.toBase64(imgBlob);
      const options = {
        files: [base64Image],
      };
      await this.socialSharing.shareWithOptions(options);
      console.log("options", options);
      console.log('base64Image', base64Image);
    } catch (error) {
      console.error(error);
    }
  }
  
  async toBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result.toString());
      };
      reader.onerror = reject;
    });
  } 
}
