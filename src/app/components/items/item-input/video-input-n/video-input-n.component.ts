import { isPlatformServer } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output, PLATFORM_ID, Inject } from '@angular/core';
import {  ModalController, Platform } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-video-input-n',
  templateUrl: './video-input-n.component.html',
  styleUrls: ['./video-input-n.component.scss'],
})
export class VideoInputNComponent implements OnInit {

  @Input() videoInput: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  videoId = "testId";
  constructor(public modalCtrl: ModalController, public dataService: DataService, public platform: Platform,
    private events:Events,public globalObjects:GlobalObjectsService,@Inject(PLATFORM_ID) private platformId: Object) { 
      if(this.globalObjects.itemFlag){
        return applyLoggingDecorator(this,"video-input-n")
      }
    }

  ngOnInit() {

    this.videoId = Math.floor(100000 + Math.random() * 900000).toString();
  }

  selectFile(event){
    let file = event.target.files[0];
          if (isPlatformServer(this.platformId)) return;
    this.converToBase64(file).then((res:any)=>{
      this.videoInput.value = res.split(",")[1] + '~' + file.name;
      var URL = window.URL;;
      var fileURL = URL.createObjectURL(file)
      var videoNode = document.getElementById(this.videoId)
      videoNode.setAttribute("src", fileURL)
    })
  }

  captureVideo() {

    this.dataService.takeVideo().then((videoRes: any) => {
      var videoBase64: any;
      videoBase64 = videoRes.split(",")[1];
      let type = (videoRes.split(";")[0]).split(":")[1];

      this.videoInput.value = videoBase64;
            if (isPlatformServer(this.platformId)) return;
      this.base64ToArrayBuffer(videoBase64).then((res: any) => {
        let file = new Blob([res], { type: type });
        var URL = window.URL;;
        var fileURL = URL.createObjectURL(file)
        var videoNode = document.getElementById(this.videoId);
        videoNode.setAttribute("src", fileURL)
      });
    })
  }

  base64ToArrayBuffer(base64) {
          if (isPlatformServer(this.platformId)) return;
    return new Promise((resolve, reject) => {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      resolve(bytes);
    })
  }

  converToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  uploadVideo(){
    
  }

}
