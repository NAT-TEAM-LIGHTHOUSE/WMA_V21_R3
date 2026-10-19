import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DeveloperModeLogPage } from '../developer-mode-log/developer-mode-log.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { saturate } from '@amcharts/amcharts4/.internal/core/utils/Colors';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-multi-alert-notification',
  templateUrl: './multi-alert-notification.page.html',
  styleUrls: ['./multi-alert-notification.page.scss'],
})
export class MultiAlertNotificationPage implements OnInit {

  alertMessage: any;
  @Input() item: any = {};
  type: any;

  danger = [];
  miMessage = [];
  warning = [];
  newWarning=[];
  constructor(private pop: PopoverController, public globalObjects : GlobalObjectsService,  public modalCtrl: ModalController,public lhs_lib : LhsLibService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"multi-alert-notification-page")
    }
   }

  ngOnInit() {
    for(let a of this.alertMessage){
      if(a.para_type == "MMS"){
        this.danger.push(a);
      } else if(a.para_type == "MMI"){
        this.miMessage.push(a);
      } else if(a.para_type == "MMWY"){
        this.warning.push(a);
      }else if( a.para_type == "MMWN"){
        this.newWarning.push(a);
      }
    }
  
  }

  
  @HostListener("document:keydown", ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
   
    switch (event.key) {
      case 'Enter':
        this.closeAlert();
        console.log("this is working");
        break;
     
    }
  }

  executeAlert(p) {
    let data = {
      statusType: p.para_type,
      value: p
    }

    if(p.para_type == "MMS"){
      this.globalObjects.alertFabFlag = true;
    this.globalObjects.alertFabData = this.alertMessage;
    }
    this.pop.dismiss(data);
  }


  executeNewAlert(p) {
    let data = {
      statusType: p.para_type,
      value: p
    }

    if(p.para_type == "MMYWS"){
      this.globalObjects.alertFabFlag = true;
    this.globalObjects.alertFabData = this.alertMessage;
    }
    this.pop.dismiss(data);
  }


  minimise(){
    this.globalObjects.alertFabFlag = true;
    this.globalObjects.alertFabData = this.alertMessage;

    this.pop.dismiss();
  }

  
  closeAlert(){
    this.globalObjects.alertFabFlag = false;
    this.globalObjects.alertFabData = [];


    let data:any = {};
    if(this.danger.length > 0){
      data.statusType = "MMS";
      data.value = {para_value : this.danger[0].para_value,row_slno:null};
      
    } else{
      data.statusType = "MMI";
      data.value = {};
    }

    this.pop.dismiss(data);
  }


  // closeAlert1(clicked) {
  //   let data = {
  //     statusType: this.warning,
  //     status: clicked,
  //     value: this.warning
  //   }
  //   this.pop.dismiss(data);
  // }

setFlag(p,status){
 
  this.lhs_lib.set_item_value({},p.para_name,0,status);
  if (status === 'Y') {
    p.active = 'Y'; 
  } else if (status === 'N') {
    p.active = 'N';  
  }

}


  async showDeveloperData() {
    this.item = {
      ws_seq_id: '',
      frame_seq_id: this.item.apps_page_frame_seqid,
      item_seq_id: this.item.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.item,
        requestData: this.item,
        runEvents: this.item.runEvents
      }
    });
    return await modal.present();
  }
}
