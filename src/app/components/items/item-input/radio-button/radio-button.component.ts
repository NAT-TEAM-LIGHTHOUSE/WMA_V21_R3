import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [STANDALONE_IMPORTS],
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit, OnDestroy {

  @Input() radioButton: any = {};
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() frameSeqId: any
  selectModel: any;
  userDetails: any;
  objectList: any = [];
  col1 = 3;
  col2 = 9;
  subscribeRefreshFlag = false;
  developerModeData: any;
  constructor(private events: Events, public globalObjects: GlobalObjectsService, private dataService: DataService, private lhs_lib: LhsLibService,
    public modalCtrl: ModalController, private cdr: ChangeDetectorRef, private cdEngine: CdEngineService) {
    if (this.globalObjects.itemFlag) {
      return applyLoggingDecorator(this, "radio-button")
    }
  }



  ngOnDestroy(): void {
    this.cdEngineCall(false);
    let nameSeq = "refreshItem_" + this.radioButton.apps_item_seqid + '_' + this.radioButton.indexcount;
    let nameItem = "refreshItem_" + this.radioButton.item_name + '_' + this.radioButton.indexcount;
    this.events.unsubscribe(nameItem);
    this.events.unsubscribe(nameSeq);
  }
  ngOnInit() {
    this.cdEngineCall(true);
    if (this.radioButton.display_setting_str) {
      let keys = Object.keys(this.radioButton.display_setting_str);
      let obj = {};
      let str = "";
      for (let k of keys) {
        if (!(this.frame_type == 'TABLE' || this.frame_type == 'ENTRYTABLE') && !(k.includes("width") || k.includes("height"))) {

          let nk = "" + k;
          obj[nk] = this.radioButton.display_setting_str[k];
        }
      }
      this.radioButton.display_setting_str = obj;
    }

    let nameSeq = "refreshItem_" + this.radioButton.apps_item_seqid + '_' + this.radioButton.indexcount;
    let nameItem = "refreshItem_" + this.radioButton.item_name + '_' + this.radioButton.indexcount;
    if (!this.subscribeRefreshFlag) {
      this.events.unsubscribe(nameItem);
      this.events.subscribe((nameItem), res => {
        if (res.evFlag == "T") {
          res.evFlag = "F";
          this.radioButton.dropdownList = [];
          this.selectModel = null;
          this.getData();
        }
      })
      this.events.unsubscribe(nameSeq);
      this.events.subscribe((nameSeq), res => {
        if (res.evFlag == "T") {
          res.evFlag = "F";
          this.radioButton.dropdownList = [];
          this.selectModel = null;
          this.getData();
        }
      })
      this.subscribeRefreshFlag = true;
    }

    if (this.radioButton.position && (this.radioButton.position.indexOf("column") > -1)) {
      let arr = this.radioButton.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    } else if (this.radioButton.promptCol) {
      this.col1 = this.radioButton.promptCol;
      this.col2 = (12 - parseFloat(this.radioButton.promptCol));
    }


    if (this.radioButton.input_pattern) {
      let radioArray = [];
      let radioarr = this.radioButton.input_pattern.split(",");
      for (let item of radioarr) {
        let obj: any = {};
        obj.key = item.split("#")[1];
        obj.val = item.split("#")[0];
        obj.isChecked = false;
        radioArray.push(obj)
      }

      this.radioButton.radioArray = radioArray;

      if (radioArray && radioArray.length > 1) {

        if (this.radioButton.value) {

          this.radioButton.oldValue = JSON.parse(JSON.stringify(this.radioButton.value));

          this.selectModel = this.radioButton.value;
          if (this.radioButton.item_type == 'CHECK_BOX') {
            let valArr = [];
            if (this.radioButton.value.includes(",")) {

              valArr = this.radioButton.value.split(",");
            } else {
              valArr[0] = this.radioButton.value
            }
            this.radioButton.value = '';
            for (let val of valArr) {
              for (let i = 0; i < this.radioButton.radioArray.length; i++) {
                if (this.radioButton.radioArray[i].val == val) {
                  this.radioButton.value = this.radioButton.value ? this.radioButton.value + "," + this.radioButton.radioArray[i].val : this.radioButton.radioArray[i].val;
                  this.radioButton.radioArray[i].isChecked = true;
                }
              }
            }
          }

        } else {
        }

        this.validateInput();

      }
    }

    else {
      if (this.radioButton.radioArray && this.radioButton.radioArray.length > 1) {
        if (this.radioButton.item_type == 'CHECK_BOX') {

          if (this.radioButton.value) {
            let valArr = this.radioButton.value.split(",");
            this.radioButton.value = '';
            for (let val of valArr) {
              for (let i = 0; i < this.radioButton.radioArray.length; i++) {
                if (this.radioButton.radioArray[i].val == val) {
                  this.radioButton.value = this.radioButton.value ? this.radioButton.value + "," + this.radioButton.radioArray[i].val : this.radioButton.radioArray[i].val;
                  this.radioButton.radioArray[i].isChecked = true;
                }
              }
            }
          }

        } else if (this.radioButton.item_type == 'RADIO_BUTTON') {
          for (let i = 0; i < this.radioButton.radioArray.length; i++) {
            if (this.radioButton.radioArray[i].val == this.radioButton.value) {
              this.selectModel = this.radioButton.radioArray[i].val;

              this.radioButton.value = this.selectModel;
              this.validateInput();
            }
          }
        }
      } else {
        if (this.radioButton.item_type == 'CHECK_BOX') {
          let radioArray = [];
          let obj: any = {};
          obj.key = "";
          obj.val = this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "1" : 'Y';
          obj.isChecked = (this.radioButton.value == "1" || this.radioButton.value == "Y") ? true : false;
          radioArray.push(obj)

          this.radioButton.value = this.radioButton.value ? this.radioButton.value : this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "0" : 'N';
          this.radioButton.radioArray = radioArray;
        }
      }
    }

    if (this.radioButton.data_required_flag == 'T' && !this.radioButton.value) {
      this.radioButton.isValid = false;
    } else {
      this.radioButton.isValid = true;
    }

    if (this.radioButton.on_load_events_str) {
      this.radioButton.itemClicked = 'load';
      this.emitPass.emit(this.radioButton);
    }


    if (this.radioButton.value) {
      if (this.radioButton.value == "Y" || this.radioButton.value == "1") {
        // this.radioButton.initialVal = true;
        delete this.radioButton['initialVal'];
        this.radioButton.isChecked = true;
      }
    }

  }

  onChange(event) {
    if (this.radioButton.item_enable_flag != 'T') {
      return;
    }
    if (this.radioButton.item_type == 'CHECK_BOX') {
      // if (this.radioButton.initialVal) {
      //   delete this.radioButton['initialVal'];
      //   return;
      // }
      // this.radioButton.value = "";
      for (let obj of this.radioButton.radioArray) {
        if (obj.isChecked) {
          if (!this.radioButton.input_pattern) {
            this.radioButton.value = this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "1" : 'Y';
          } else {
            this.radioButton.value = this.radioButton.value ? this.radioButton.value + "," + obj.val : obj.val;
          }
          this.validateInput();
        } else {
          if (!this.radioButton.input_pattern) {
            this.radioButton.value = this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "0" : 'N';

          }
        }
      }
    } else {
      if (event.val) {
        this.radioButton.oldValue = this.radioButton.value;
        this.radioButton.value = event.val;
      }

      for (let i = 0; i < this.radioButton.radioArray.length; i++) {
        if (this.radioButton.radioArray[i].val == this.radioButton.value) {
          this.selectModel = this.radioButton.radioArray[i].val;

          this.radioButton.value = this.selectModel;
          // this.validateInput();
        }
      }

      this.validateInput();
    }

    // if(this.radioButton.value != undefined){
    //   this.radioButton.initialVal = true;
    // }
    this.radioButton.itemClicked = 'pre';
    this.emitPass.emit(this.radioButton);

  }



  validateInput() {
    if (this.radioButton.data_required_flag == 'T' && !this.radioButton.value) {
      this.radioButton.isValid = false;
    } else {
      this.radioButton.isValid = true;
    }
  }

  itemClick(event) {

    if (this.radioButton.radioArray && this.radioButton.radioArray.length > 1) {
      if (this.radioButton.item_type == 'CHECK_BOX') {

        if (this.radioButton.value) {
          let valArr = this.radioButton.value.split(",");
          this.radioButton.value = '';
          for (let val of valArr) {
            for (let i = 0; i < this.radioButton.radioArray.length; i++) {
              if (this.radioButton.radioArray[i].val == val) {
                this.radioButton.value = this.radioButton.value ? this.radioButton.value + "," + this.radioButton.radioArray[i].val : this.radioButton.radioArray[i].val;
                this.radioButton.radioArray[i].isChecked = true;
              }
            }
          }
        }

      } else if (this.radioButton.item_type == 'RADIO_BUTTON') {
        for (let i = 0; i < this.radioButton.radioArray.length; i++) {
          if (this.radioButton.radioArray[i].val == this.radioButton.value) {
            this.selectModel = this.radioButton.radioArray[i].val;

            this.radioButton.value = this.selectModel;
            this.validateInput();
          }
        }
      }
    } else {
      this.radioButton.isValid = this.radioButton.isChecked;
      if (this.radioButton.isChecked) {
        this.radioButton.isValid = true;
        this.radioButton.value = this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "1" : 'Y';

      } else {
        this.radioButton.isValid = false;
        this.radioButton.value = this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "0" : 'N';
      }
    }

    // if (this.radioButton.initialVal) {
    //   delete this.radioButton['initialVal'];
    //   return;
    // }

    if (this.radioButton.item_enable_flag == 'T') {
      this.radioButton.itemClicked = 'pre';
      this.emitPass.emit(this.radioButton);
    }

  }
  clicked() {
    // if (this.radioButton.initialVal) {
    //   delete this.radioButton['initialVal'];
    // }
  }

  itemClick1(event) {
    // if (this.radioButton.initialVal) {
    //   delete this.radioButton['initialVal'];
    //   return;
    // }

    if (this.radioButton.radioArray && this.radioButton.radioArray.length > 1) {
      if (this.radioButton.item_type == 'CHECK_BOX') {

        if (this.radioButton.value) {
          let valArr = this.radioButton.value.split(",");
          this.radioButton.value = '';
          for (let val of valArr) {
            for (let i = 0; i < this.radioButton.radioArray.length; i++) {
              if (this.radioButton.radioArray[i].val == val) {
                this.radioButton.value = this.radioButton.value ? this.radioButton.value + "," + this.radioButton.radioArray[i].val : this.radioButton.radioArray[i].val;
                this.radioButton.radioArray[i].isChecked = true;
              }
            }
          }
        }

      } else if (this.radioButton.item_type == 'RADIO_BUTTON') {
        for (let i = 0; i < this.radioButton.radioArray.length; i++) {
          if (this.radioButton.radioArray[i].val == this.radioButton.value) {
            this.selectModel = this.radioButton.radioArray[i].val;

            this.radioButton.value = this.selectModel;
            this.validateInput();
          }
        }
      }
    } else {
      this.radioButton.isValid = this.radioButton.isChecked;
      if (this.radioButton.isChecked) {
        this.radioButton.isValid = true;
        this.radioButton.value = this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "1" : 'Y';

      } else {
        this.radioButton.isValid = false;
        this.radioButton.value = this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "0" : 'N';
      }
    }

    if (this.radioButton.item_enable_flag == 'T') {
      this.radioButton.itemClicked = 'pre';
    }

  }

  valueChange() {
    if (this.radioButton.value == 'Y' || this.radioButton.value == '1') {
      this.radioButton.isChecked = true;
    } else {
      this.radioButton.isChecked = false;
      this.radioButton.value = this.radioButton.datatype && (this.radioButton.datatype.toLowerCase() == 'number') ? "0" : 'N';
    }

  }

  getData() {
    let wscp: any = {};
    wscp.service_type = "get_lov_data";
    wscp.lov_code = this.radioButton.lov_code;
    wscp.apps_page_no = this.radioButton.apps_page_no;
    wscp.apps_page_frame_seqid = this.radioButton.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.radioButton.apps_item_seqid;
    this.userDetails = this.globalObjects.userDetails;
    // this.userDetails["object_code"] = this.radioButton.object_code;
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": []
    }


    let index = this.radioButton.itemIndex ? this.radioButton.itemIndex : (this.radioButton.indexCount ? this.radioButton.indexCount : this.radioButton.indexcount);
    let itm = this.lhs_lib.get_item(this.radioButton.apps_item_seqid, index);
    if (itm) {
      itm.requestData = reqData;
    }

    this.dataService.postData("S2U", reqData).then(res => {

      let data: any = res;
      if (data.responseStatus && data.responseStatus.includes("success")) {
        // Developer Mode Loging

        let objData: any = {};
        if (data.responseStatus.toLowerCase().includes("-rc")) {

          let { tableData } = this.lhs_lib.generateDataForLov(this.radioButton, data);

          objData.Level1 = tableData;

        } else {
          objData = this.globalObjects.setPageInfo(data.responseData);
        }
        this.objectList = objData.Level1;

        let radioArray = [];
        for (let item of objData.Level1) {
          let obj: any = {};
          let keys = Object.keys(item);
          obj.val = item[keys[0]];
          obj.key = item[keys[1]];
          obj.isChecked = false;
          radioArray.push(obj)
        }
        this.radioButton.radioArray = radioArray;

        if (this.radioButton.value) {
          if (this.radioButton.item_type == 'CHECK_BOX') {
            for (let i = 0; i < this.radioButton.radioArray.length; i++) {
              if (this.radioButton.radioArray[i].val == this.radioButton.value) {
                this.radioButton.value = this.radioButton.value ? this.radioButton.value + "," + this.radioButton.radioArray[i].val : this.radioButton.radioArray[i].val;
                this.radioButton.radioArray[i].isChecked = true;
                this.validateInput();
              }
            }
          } else if (this.radioButton.item_type == 'RADIO_BUTTON') {
            for (let i = 0; i < this.radioButton.radioArray.length; i++) {
              if (this.radioButton.radioArray[i].val == this.radioButton.value) {
                this.selectModel = this.radioButton.radioArray[i].val;
                this.radioButton.value = this.selectModel;
                this.validateInput();
              }
            }
          }
        } else {
        }
      } else {
        alert(data.responseMsg);
      }
    }).catch(err => {

      this.globalObjects.presentToast("4 Something went wrong please try again later!");
    })

  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: this.radioButton.apps_page_frame_seqid,
      item_seq_id: this.radioButton.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.radioButton,
        runEvents: this.radioButton.runEvents
      }
    });
    return await modal.present();
  }
  cdEngineCall(isRegister: boolean) {
    let id = this.radioButton.apps_item_seqid + '_' + this.radioButton.indexcount + '#' + this.frameSeqId;
    if (isRegister) {
      this.cdEngine.register(id, this.cdr);
    } else {
      this.cdEngine.unregister(id, this.cdr);
    }
  }
}
