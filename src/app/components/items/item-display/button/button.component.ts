import { Component, Input, OnInit ,EventEmitter, Output} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class ButtonComponent implements OnInit {

  @Input() button: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitClear: EventEmitter<any> = new EventEmitter<any>();
  click_events_str_arr = [];
  secondstring: any;
  head: any = [];
  body: any = [];
  tableBody: any = [];
  baseImg : any;
  developerModeData: any;
  ishover : any;
  platformFlag: any = 'android';
  constructor(private globalobjects: GlobalObjectsService, public modalController: ModalController,
    public globalObjects: GlobalObjectsService, public platform: Platform, public events: Events) {
    if (this.platform.is('ios')) {
      this.platformFlag = 'ios';
    }
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"button")
    }
  }

  ngOnInit() {

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
        requestData:this.button.requestData
      }
    });
    return await modal.present();

  }

  onImgError(event){


  }
}