import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';

import { DeveloperModeLogPage } from '../developer-mode-log/developer-mode-log.page';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { ModalController, PopoverController } from '@ionic/angular/standalone';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({

  selector: 'app-new-alert-msg-boxes',
  templateUrl: './new-alert-msg-boxes.page.html',
  styleUrls: ['./new-alert-msg-boxes.page.scss'],
  standalone: true,
  imports: [NewAlertMsgBoxesPage, STANDALONE_IMPORTS]
})
export class NewAlertMsgBoxesPage implements OnInit, AfterViewInit {

  @Input() type: any = "MI";
  @Input() msg: any;
  @Input() btArr: any;
  @Input() item: any = {};

  @ViewChildren('actionBtn', { read: ElementRef })
  actionBtns!: QueryList<ElementRef>;
  constructor(private popOverCtrl: PopoverController, public modalCtrl: ModalController, public globalObjects: GlobalObjectsService) {
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "new-alert-msg-boxes-page")
    }
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    setTimeout(() => {
      const firstBtn = this.actionBtns?.first?.nativeElement;
      firstBtn?.focus();
    }, 100);
  }

  ngOnInit() {
    console.log(this.btArr);
    console.log(`msg : ${this.msg}, type : ${this.type}, item : ${this.item}`)
  }



  dismiss(b) {
    this.popOverCtrl.dismiss(b.value);
  }

  close() {
    this.popOverCtrl.dismiss();
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
