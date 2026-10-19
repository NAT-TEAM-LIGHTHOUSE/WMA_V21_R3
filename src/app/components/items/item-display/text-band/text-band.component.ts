import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-text-band',
  templateUrl: './text-band.component.html',
  styleUrls: ['./text-band.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class TextBandComponent implements OnInit {

  @Input() textband: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() frameSeqId:any
  tableValue: any;
  num: number;
  percent: any;
  Tab3Dnum: number;
  baseImg: any;
  text_bar_promptname = "";
  frame: any;
  targetItem: any;

  bgColor:any = "";

  constructor(public globalObjects: GlobalObjectsService, private modalController: ModalController,
    private barScanner: BarcodeScanner, private sqlServ: SqlLiteService, public sanitizer: DomSanitizer,
    private dataService: DataService, public lhs_lib: LhsLibService, private cdEngine: CdEngineService, private cdr: ChangeDetectorRef) {
    this.num = this.globalObjects.countforsummarycard;
    this.Tab3Dnum = this.globalObjects.colorcount;
    // if (this.globalObjects.itemFlag) {
    //   return applyLoggingDecorator(this, "text-band")
    // }
  }

  val: any = [];
  developerModeData: any;
  id;
  target : any;
  isIconVisible: boolean = true;


  ngOnInit() {
    this.cdEngineCall(true);
    if (this.textband.item_sub_type == 'DASH_KPI') {
    }
    if (this.textband.css_class) { } else {
      this.textband.css_class = 'blue';
    }

    if (this.textband.display_setting_str) {
      let str = typeof (this.textband.display_setting_str) == 'string' ? JSON.stringify(this.textband.display_setting_str) : this.textband.display_setting_str;

      if ((str["target"] == 'T' || str["TARGET"] == 'T')) {

        let itm = this.lhs_lib.get_item(`${this.textband.apps_page_frame_seqid}.T_${this.textband.item_name}`, this.textband.indexcount);

        if (itm) {
          this.targetItem = itm;
        } else {
          this.targetItem = JSON.parse(JSON.stringify(this.textband));
          this.targetItem.item_enable_flag = "T"
          this.targetItem.click_events_str = 'app_js1_text';
          this.targetItem.itemClicked = 'pre';
          this.targetItem.calling_parameter_str = 'popup(h=80vh,w=80%);';
          this.targetItem.app_js1_text = 'ajs_run_target_events();'
        }

      }

       if (str["color"]) {
        this.bgColor = str["color"];
       }
    }

    this.formatData();

    this.developerModeData = {
      frame_seq_id: this.textband.apps_page_frame_seqid,
      item_seq_id: this.textband.apps_item_seqid,
    };

    this.frame = this.lhs_lib.get_frame_config(this.textband.apps_page_frame_seqid);
  }


  onChangeData() {
    console.log(this.textband.value);
    this.formatData();
  }


  formatData() {
    if (this.textband.item_sub_type == 'KPI_LEFT') {

      if (this.textband.value && this.textband.value.indexOf("@") > -1) {
        this.textband.prompt_name = this.textband.value.split("@")[0];
        this.textband.value = this.textband.value.split("@")[1];
      }

      if (this.textband.datatype == 'NUMBER') {
        if (this.textband.value && this.textband.format_mask && !isNaN(parseFloat(this.textband.value))) {
          if (this.textband.format_mask.toLowerCase().indexOf('currency') > -1) {
            this.textband.value = parseFloat(this.textband.value).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
          } else {
            let mask = this.textband.format_mask.split(",");
            let str = "";
            let val = "";
            let i = 0;
            let value = this.textband.value;
            if (value.indexOf(".") > -1) {
              value = value.split(".")[0];
            }
            let itmLen = value.length;
            for (let m of mask) {
              i++
              if (itmLen > 0) {
                let num = mask[mask.length - i].length;
                if (itmLen < mask[mask.length - i].length) {
                  num = itmLen;
                }
                str = "(\\d{" + num + "})" + str;
                if (val == "") {
                  val = val + '$' + i;
                } else {
                  val = val + ',' + '$' + i;
                }
                itmLen = itmLen - mask[mask.length - i].length;
              }
            }
            let finalStr = '/' + str + '/'

            if (this.textband.value.indexOf(".") > -1) {
              let temp = value.replace(eval(finalStr), val);
              this.textband.value = temp + '.' + this.textband.value.split(".")[1];
            } else {
              this.textband.value = this.textband.value.replace(eval(finalStr), val);
            }
            this.textband.value = this.textband.value;
          }
        }
      }

    } else if (this.textband.item_sub_type == 'KPI_BAR_RECORDS') {

      let valArr = this.textband.value.split("@");
      if (valArr[0]) {
        this.text_bar_promptname = valArr[0];
      } else {
        this.text_bar_promptname = this.textband.prompt_name;
      }

      this.val = valArr[1].split("/");
      if (this.val[0]) {
        this.percent = (parseFloat(this.val[0]) / parseFloat(this.val[1])) * 100;

      }
      else {
        this.percent = 0;
        this.val[0] = 0;
      }

    } else {

      if (this.textband.value) {
        if (this.textband.value.indexOf('@') > -1) {
          this.textband.val = this.textband.value.split("@");
        }else{
          // this.val = this.textband.value
        }
      } else {
        this.textband.value = "";
      }
      if (this.textband.apps_icon_name) {

        if (this.textband.apps_icon_name.toLowerCase() == 'sys_icon') {
          this.baseImg = './assets/imgs/no_image.png';
        } else {
          var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.textband.apps_icon_name + '&appTheme=' + this.globalObjects.appTheme;

          this.sqlServ.getImageFromLocal(this.textband, val).then((res: any) => {
            console.log(this.baseImg+"app icon name ++++++++++++++++++++++++++++++++++")
            this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);

            this.cdr.detectChanges();
          });
        }
      }
    }

  }


  itemClick(event) {
    this.textband.rightClickFlag = false;
    this.textband.itemClicked = "pre";
    this.emitPass.emit(this.textband);
  }

  targetClick() {
    this.emitPass.emit(this.targetItem);
  }

  onRightClick(event) {
    event.preventDefault();
    this.textband.rightClickFlag = true;
    this.emitPass.emit(this.textband);
  }

  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.textband,
        runEvents: this.textband.runEvents
      }
    });
    return await modal.present();
  }


  refreshItem(event) {

    event.stopPropagation()



    this.isIconVisible = false;
    this.textband.loading = true
    this.textband.value = null;
    let wsdpcl = [];
    let userDetails = this.globalObjects.userDetails;
    let wscp: any = {};
    wscp.service_type = "itemwise_sql_populate_data";
    wscp.apps_item_seqid = this.textband.apps_item_seqid;
    wscp.apps_page_frame_seqid = this.textband.apps_page_frame_seqid;
    wscp.orignal_apps_item_seqid = this.textband.apps_item_seqid;
    wscp.object_code = this.frame.object_code;


    wscp.orignal_apps_page_frame_seqid = this.lhs_lib.object_mast?.holdWscp?.orignal_apps_page_frame_seqid;
    wscp.orignal_apps_item_seqid = this.lhs_lib.object_mast?.holdWscp?.orignal_apps_item_seqid;
    wscp.orignal_object_code = this.lhs_lib.object_mast?.holdWscp?.orignal_object_code;

    wscp.item_sub_type = this.textband.item_sub_type;
    let wsdp = [];
    wsdpcl = this.lhs_lib.getDpcl(event.calling_frame_seqid_str);
    let col = {};
    col[this.textband.apps_item_seqid] = "";
    wsdpcl.push(col);
    var reqData = {
      "wslp": userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": wsdpcl
    }
    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
      this.textband.loading = false;
      this.isIconVisible = true;
      let data: any = res;
      if (data.responseStatus && data.responseStatus.includes("success")) {


        if ((data.responseData.Level1_Keys && data.responseData.Level1_Keys.length > 0) || (Array.isArray(data.responseData) && data.responseData.length > 0)) {
          let objData: any = {};

          if (data.responseStatus.toLowerCase().includes("-rc")) {

            objData.Level1 = this.globalObjects.setPageInfoNoS2U(data.responseData);

          } else {
            objData = this.globalObjects.setPageInfo(data.responseData);
            // Developer Mode Loging
            if (data.responseData.Level1_Keys.length > 0) {
              let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
              let wsSewId = id ? data.responseData.Values[0][id] : "";
              this.developerModeData = {
                ws_seq_id: wsSewId,
                frame_seq_id: this.textband.apps_page_frame_seqid,
              }
            }

          }
          this.setData(objData.Level1, this.textband);
          if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
            this.globalObjects.presentAlert(objData.Level1[0].message);
          }
          else {
            // //console.log(objData);
          }

        }
        else {
        }

      } else {
        alert(data.responseMsg);
      }
    }, (err) => {
      this.textband.loading = false;
    })
  }


  setData(objData, event) {
    for (let ob of objData) {
      if (ob.para_type == 'IV') {
        let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;

        if (ob.frame_name) {
          let frame = this.lhs_lib.get_frame_config(ob.frame_name);

          if (frame.tempRows && frame.tempRows.length > 0) {
            if (ob.row_slno > frame.tempRows.length - 1) {
              let index = parseInt(ob.row_slno) - frame.tempRows.length;
              this.lhs_lib.set_value(frame, index, name, ob.para_value, event);
            } else {
              this.lhs_lib.set_value(frame, ob.row_slno, name, ob.para_value, event);
            }

          } else {
            this.lhs_lib.set_item_value(event, name, ob.row_slno, ob.para_value);
          }

        } else {
          this.lhs_lib.set_item_value(event, name, ob.row_slno, ob.para_value);
        }
      }
    }
  }


  img() {
    var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.textband.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme;
    return val

  }

  onImgError(event) {
    event.target.src = './assets/imgs/folders.png'
  }
  ishover(e) {
    if (e.click_events_str) {
      return true;
    } else {
      return false;
    }
  }

  barcodescanner(event) {

    return new Promise((resolve) => {

      let options: BarcodeScannerOptions = {
        torchOn: false,
        showTorchButton: true,
        prompt: "Point the camera at the barcode"
      };
      this.barScanner.scan(options).then(barcodeData => {
        this.textband.value = barcodeData.text;
        this.textband.isValid = true;

        if (this.textband.value) {


          this.emitPass.emit(this.textband);
          resolve("sucess");
        }

      }).catch(err => {

      });

    }).catch(err => {
      alert(err);
    })

  }


  // loading image


  toggleIcon() {

  }

  onTargetButtonClick(textband: any) {
    // Emit the textband object when target button is clicked
    textband.itemClicked = 'pre';
    this.emitPass.emit(textband);
  }

  cdEngineCall(isRegister: boolean) {
    let id = this.textband.apps_item_seqid + '_' + this.textband.indexcount+'#'+this.frameSeqId;
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

