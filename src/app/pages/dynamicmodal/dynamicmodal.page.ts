import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-dynamicmodal',
  templateUrl: './dynamicmodal.page.html',
  styleUrls: ['./dynamicmodal.page.scss'],
})
export class DynamicmodalPage implements OnInit {

  modalData : any;
  heading:any= [];
  
  constructor(private modalCtrl: ModalController, public platform:Platform,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"dynamicmodal-page")
    }
  }

  ngOnInit() {
    if(this.modalData){
        this.heading = Object.keys(this.modalData.result[0]);
    }
  }

  selectValue(data){
     this.modalCtrl.dismiss(data);
  }

  closeLov() {
    this.modalCtrl.dismiss();
  }
}
