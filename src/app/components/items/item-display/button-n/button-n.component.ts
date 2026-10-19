import { Component, Input, OnInit, Output, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';

import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button-n',
  templateUrl: './button-n.component.html',
  styleUrls: ['./button-n.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class ButtonNComponent implements OnInit {

  @Input() button: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitClear: EventEmitter<any> = new EventEmitter<any>();
  @Input() frameSeqId:any
  click_events_str_arr = [];
  secondstring: any;
  head: any = [];
  body: any = [];
  tableBody: any = [];
  developerModeData: any;
  platformFlag: any = 'android';
  baseImg: any = "";
  constructor(private globalobjects: GlobalObjectsService, public modalController: ModalController, private sqlServ: SqlLiteService, public sanitizer: DomSanitizer,
    public globalObjects: GlobalObjectsService, public platform: Platform, public events: Events, private cdEngine: CdEngineService, private cdr: ChangeDetectorRef) {
    if (this.platform.is('ios')) {
      this.platformFlag = 'ios';
    }
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"button-n")
    }

  }

  ngOnInit() {
    this.cdEngineCall(true);
    if (this.button.apps_icon_name) {
      var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.button.apps_icon_name + '&appTheme=' + this.globalObjects.appTheme;

      if (this.button.item_sub_type == 'ICON_LABLE_BOUNDRY' || this.button.item_sub_type == 'ICON_LABLE_LARGE') {
        this.sqlServ.getImageFromLocal(this.button, val).then((res: any) => {
          this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
        });
      }
    }

    if (this.button.display_setting_str) {
      let keys = Object.keys(this.button.display_setting_str);
      let obj = {};
      let flag = false;
      for (let k of keys) {
        if (!(k.includes("--"))) {
          obj['--' + k] = this.button.display_setting_str[k];
          flag = true;
        }
      }

        this.button.display_setting_str = {...obj,...this.button.display_setting_str};
    }
  }


  ngAfterContentChecked() {
    this.globalobjects.clickedbutton = false;
  }

  buttonClick() {
    this.button.rightClickFlag = false;
    this.emitPass.emit(this.button);
    this.globalobjects.clickedbutton = true;
  }

  onRightClick(event) {
    event.preventDefault();
    this.button.rightClickFlag = true;
    this.emitPass.emit(this.button);
  }

  buttonClickClear() {
    this.emitClear.emit(this.button);
  }
  updateStatus(status) {

  }

  readFile(event) {
    this.button.files = event.target.files;
    this.emitPass.emit(this.button);
  }

  converToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: this.button.apps_page_frame_seqid,
      item_seq_id: this.button.apps_item_seqid
    }
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.button,
        runEvents: this.button.runEvents
      }
    });
    return await modal.present();

  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
  }
  ishover(e) {
    if (e.click_events_str) {
      return true;
    } else {
      return false;
    }
  }
 
  @HostListener("keydown.space", ['$event'])
  onKeyupCaps(event) {
    event.preventDefault();
    this.buttonClick();
  }

  cdEngineCall(isRegister: boolean) {
    let id = this.button.apps_item_seqid + '_' + this.button.indexcount+'#'+this.frameSeqId;
    if(isRegister){
      this.cdEngine.register(id, this.cdr);
    }else{
       this.cdEngine.unregister(id,this.cdr);
    }
  }
   ngOnDestroy(): void {
     this.cdEngineCall(false);
  }
}
