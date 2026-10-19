import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from '../developer-mode-log/developer-mode-log.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-alert-msg-boxes',
  templateUrl: './alert-msg-boxes.page.html',
  styleUrls: ['./alert-msg-boxes.page.scss'],
})
export class AlertMsgBoxesPage implements OnInit {
  popoverPopup: any;
  alertMessage: any;
  type: any;
  @Input() item: any = {};

  constructor(public popOverCtrl: PopoverController, public modalCtrl: ModalController,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"alert-msg-boxes")
    }
   }

  ngOnInit() {
  }

  @HostListener("document:keydown", ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
   
    switch (event.key) {
      case 'Enter':
        this.closeAlert(event);
        console.log("this is working");
        break;
     
    }
  }

  closeAlert(clicked) {
    let data = {
      statusType: this.alertMessage.para_type,
      status: clicked,
      value: this.alertMessage
    }
    this.popOverCtrl.dismiss(data);
  }

  async dismissClick() {
    await this.popOverCtrl.dismiss();
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
  async dismissClickEvent(flag) {
    await this.popOverCtrl.dismiss(flag);
  }
}