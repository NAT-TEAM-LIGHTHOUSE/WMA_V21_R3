import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { IonAccordionGroup } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { DeveloperModeLogPage } from '../developer-mode-log/developer-mode-log.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-msg-box',
  templateUrl: './msg-box.page.html',
  styleUrls: ['./msg-box.page.scss'],
})
export class MsgBoxPage implements OnInit {

  @Input() msg:any;
  @Input() msgArr:any;
  @Input() item:any;
  @ViewChild('autofocus') searchbar: any;
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;

  constructor(private popOverCtrl : PopoverController,public lhs_lib: LhsLibService ,public globalObjects: GlobalObjectsService, public modalCtrl: ModalController) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"msg-box")
    }
   }

  ngOnInit() {
    // console.log(`comes in onInit of MsgBoxPage component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `);
  }  
  
  @HostListener("document:keydown", ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        this.close();
        console.log("this is working");
        break;
     
    }
  }


  // @HostListener("keyup.enter")
  close(){
    this.popOverCtrl.dismiss();
  }

  msgtoggleAccordion(){
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'msgModelb') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'msgModelb';
    }
  };

  async showDeveloperData() {
    let obj = {
      ws_seq_id: '',
      frame_seq_id: this.item.apps_page_frame_seqid,
      item_seq_id: this.item.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: obj,
        requestData: this.item,
        runEvents: this.item.runEvents
      }
    });
    return await modal.present();
  }

  go(name,index){
    // this.lhs_lib.go_item(name,index,true);
    this.globalObjects.focusArrow = name;
    this.popOverCtrl.dismiss({name,index},"focus");
  }
}
