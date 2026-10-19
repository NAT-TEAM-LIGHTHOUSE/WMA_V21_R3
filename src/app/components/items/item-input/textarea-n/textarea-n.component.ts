import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonTextarea, ModalController, Platform, PopoverController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
// import { FormatMaskPipe } from 'src/app/pipes/format-mask.pipe';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { isHidden } from '@amcharts/amcharts4/.internal/core/utils/DOM';
import { SuperPage } from 'src/app/pages/super/super.page';
import { TextrichModelComponent } from 'src/app/pages/textrich-model/textrich-model.component';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { DateInputNComponent } from '../date-input-n/date-input-n.component';
import { FormatMaskPipe } from 'src/app/pipes/format-mask-pipe';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,DateInputNComponent],
  selector: 'app-textarea-n',
  templateUrl: './textarea-n.component.html',
  styleUrls: ['./textarea-n.component.scss'],
})
export class TextareaNComponent implements OnInit,OnDestroy {
  @Input() frame: any ;
  @Input() button: any;
  @Input() textarea: any;
  @Input() frame_type: any;
  @Input() wscp: any;
  @Input() parentComponent: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(IonTextarea, { static: false }) ionTextarea: IonTextarea;
  @ViewChild('myTextarea', { static: false }) myTextarea: ElementRef;

  @ViewChild('textInputname', { static: false }) textInputname: IonTextarea;



  autoPolulateText: any[] = [];
  autoPolulateText1 = ['tte', 'ttr', 'ttw'];
  itemval: any;
  hasFired = false;
  col1 = 3;
  col2 = 9;
  developerModeData: any;
  inputType = 'password';
  iconName = 'eye-off';
  vadidateMsg = "";
  lovObj: any;
  placeholder = '';

  eventList:any;
  private textBoxListener: EventListener;


  constructor(public globalObjects: GlobalObjectsService, private formatMastPipe: FormatMaskPipe,
    public events: Events, public modalCtrl: ModalController, public platform: Platform,
    public lhs_lib: LhsLibService, public popoverController: PopoverController, private modalGlobal: CanvasModalService) {
    if (this.globalObjects.itemFlag) {
      return applyLoggingDecorator(this, "textarea-n")
    }
  }
  ngOnDestroy(): void {
    let id = 'mailbody' + this.textarea.apps_item_seqid;
    let element = document.getElementById(id);

    if (element && this.textBoxListener) {
      element.removeEventListener("keyup", this.textBoxListener);
    }
  }

  ngOnInit() {

    this.frame = this.lhs_lib.get_frame_config(this.textarea.apps_page_frame_seqid);
    if ((this.textarea.data_required_flag && this.textarea.data_required_flag == 'T') || ((this.textarea.prompt_name && this.textarea.prompt_name[this.textarea.prompt_name.length - 1]) == '*')) {
      if (this.textarea.value) {
        this.textarea.isValid = true;
      } else {
        this.textarea.isValid = false;
      }
    } else {
      this.textarea.isValid = true;
    }

    if (this.textarea.datatype != 'DATE' && this.textarea.datatype != 'DATETIME' && this.textarea.datatype != 'TIME'
      && this.textarea.value && this.textarea.format_mask) {
      this.textarea.value = this.formatMastPipe.transform(this.textarea.value, this.textarea.format_mask)
    }

    if (this.textarea.position && (this.textarea.position.indexOf("column") > -1)) {
      let arr = this.textarea.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    } else if (this.textarea.promptCol) {
      this.col1 = this.textarea.promptCol;
      this.col2 = (12 - parseFloat(this.textarea.promptCol));
    }

    if (this.textarea.item_enable_flag == 'F') {
      if (this.textarea.item_sub_type == 'BROWSER1') {
        let obj: any = this.getParsedJson(this.textarea.display_setting_str);
        obj.border = "1px solid";
        obj["box-shadow"] = "rgb(228 240 255) 5px 6px 20px inset";
        this.textarea.display_setting_str = obj;
      } else {
        let obj = this.getParsedJson(this.textarea.display_setting_str);
        obj["background-color"] = "rgb(243, 243, 243)";
        this.textarea.display_setting_str = obj;
      }
    }

    if (this.textarea.calling_parameter_str && this.textarea.calling_parameter_str.indexOf("LOV") > -1) {
      let strArr = this.textarea.calling_parameter_str.split("~");
      for (let x of strArr) {
        if (x.indexOf("LOV") > -1) {
          this.lovObj = x;
        }
      }
    }

    if (this.textarea.item_sub_type_child == 'UPPER') {
      let val = new RegExp(/^[A-Z]+$/);
      this.textarea.input_pattern = val;
      this.textarea.tool_tip = "Only Uppercase";
    }
    if (this.textarea.item_sub_type_child == 'LOWER') {
      let val = new RegExp(/^[a-z]+$/);
      this.textarea.input_pattern = val;
      this.textarea.tool_tip = "Only Lowercase Allowed";
    }
    if (this.textarea.item_sub_type_child == 'PHONE') {
      let val = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
      this.textarea.input_pattern = val;
      this.textarea.tool_tip = "Invalid phone number";
    }
    if (this.textarea.item_sub_type_child == 'EMAIL') {
      let val = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      this.textarea.input_pattern = val;
      this.textarea.tool_tip = "Invalid Email address";
    }
    if (this.textarea.item_sub_type == 'TEXT_BOX') {
      this.itemval = this.textarea.value;

      setTimeout(() => {
        let id = 'mailbody' + this.textarea.apps_item_seqid;
        let element = document.getElementById(id);

        if (element) {
          this.textBoxListener = () => {
            this.textarea.value = element.innerHTML;
          };
          element.addEventListener("keyup", this.textBoxListener);
        }
      }, 1000);
    }

    if (this.textarea.tool_tip && (this.platform.is('ios') || this.platform.is('android'))) {
      this.placeholder = this.textarea.tool_tip
    }
    
  }


  itemClicked(item) {
    if (item.value) {
      this.textarea.oldValue = item.value;
    }
    this.textarea.itemClicked = 'pre';
    this.emitPass.emit(this.textarea)
  }

  onBlur(item, eventOrValue?: any) {
    // Prefer the raw value from the blur event to avoid stale ngModel timing
    let latestValue: any;
    if (typeof eventOrValue === 'string') {
      latestValue = eventOrValue;
    } else {
      latestValue = eventOrValue?.target?.value ?? eventOrValue?.detail?.value ?? this.textarea.value;
    }
    this.textarea.value = latestValue;
    if (item.datatype != 'DATE' && item.datatype != 'DATETIME' && item.datatype != 'TIME') {
      this.textarea.value = this.formatMastPipe.transform(this.textarea.value, this.textarea.format_mask)
    }
    var changeValue = this.getParsedJson(this.textarea.display_setting_str);

    if (this.textarea.value) {
      if (changeValue["text-transform"]) {
        if (changeValue["text-transform"] == 'uppercase') {
          this.textarea.value = (this.textarea.value).toUpperCase();
        }
        if (changeValue["text-transform"] == 'lowercase') {
          this.textarea.value = (this.textarea.value).toLowerCase();
        }
        if (changeValue["text-transform"] == 'capitalize') {
          if (this.textarea.value) {
            let text = "";
            let valarr = this.textarea.value.split(" ");
            for (let o of valarr) {
              text = text + " " + o.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            }
            this.textarea.value = text.replace(" ", "");
          }
        }
      }
    } else {
      this.clear();
    }
    this.validateInput();
    if (this.textarea.isValid) {
      this.textarea.blurValue = this.textarea.value;
      this.textarea.itemClicked = 'post';
      this.emitOnChange.emit(this.textarea);
    }

  }

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }

  openLov() {
    let event: any = {};
    event.keyCode = 120;
    this.checkKey(event)
  }

  removeValue(i) {
    if (this.textarea.item_enable_flag == 'T') {
      if (this.textarea.displayChips && this.textarea.displayChips.length > 0) {
        this.textarea.Dvalue ? this.textarea.Dvalue.splice(i, 1) : "";
        if (typeof (this.textarea.DcodeOfValues) == 'string') {
          this.textarea.DcodeOfValues = this.textarea.DcodeOfValues.split("^");
          this.textarea.DcodeOfValues.splice(i, 1)
        } else {
          if (this.textarea.DcodeOfValues) {
            this.textarea.DcodeOfValues.splice(i, 1)
          }
        }

        this.textarea.Ditems ? this.textarea.Ditems.splice(i, 1) : "";
        this.textarea.objLovData ? this.textarea.objLovData.splice(i, 1) : "";
        let covArr = typeof (this.textarea.codeOfValues) == 'string' ? this.textarea.codeOfValues.split("^") : this.textarea.codeOfValues;
        covArr.splice(i, 1);
        this.textarea.displayChips = covArr;
        this.textarea.codeOfValues = covArr;
        this.textarea.value = this.textarea.displayChips.join("^");
        if (this.textarea.objLovData) {
          this.setReturnData();
        } else {
          if (this.textarea.fromMulti) {
            this.set_objLovData(i);
          }
        }
      }
    }
  }



  set_objLovData(i) {
    let lov_return_key = this.textarea.lov_return_column_str.split(";");
    for (let retStr of lov_return_key) {
      if (retStr) {
        let obj: any = {};
        let values = [];
        if (retStr.indexOf("!=") > -1) {
          values = retStr.split("!=");
        } else {
          values = retStr.split(":=");
        }
        let name = values[0].includes(".") ? values[0].split(".")[1] : values[0];

        if (this.textarea.item_name != name) {
          let ind = this.textarea.itemIndex != undefined ? this.textarea.itemIndex : (this.textarea.indexcount ? this.textarea.indexcount : (this.textarea.indexCount ? this.textarea.indexCount : 0));
          let val = this.lhs_lib.get_item_value(values[0], ind);
          if (val && val.includes(",")) {
            let valArr = val.split(",");
            valArr.splice(i, 1);
            let newVal = valArr.join(",");

            this.lhs_lib.set_item_value(this.textarea, values[0], ind, newVal);
          } else {
            let newVal = "";
            this.lhs_lib.set_item_value(this.textarea, values[0], ind, newVal);
          }
        }
      }
    }
  }

  setReturnData() {

    let lov_return_key = this.textarea.lov_return_column_str.split(";");
    lov_return_key.pop();
    for (let retStr of lov_return_key) {
      let values = [];
      if (retStr.indexOf("!=") > -1) {
        values = retStr.split("!=");
      } else {
        values = retStr.split(":=");
      }
      let frameName;
      let key = [];
      if (values[0].indexOf(".") > -1) {
        key = values[0].split(".");
        if (key[0].indexOf(":") > -1) {
          frameName = key[0].split(":")[1];
        } else {
          frameName = key[0];
        }
      } else {
        if (values[0].indexOf(":") > -1) {
          frameName = values[0].split(":")[1];
        } else {
          frameName = values[0];
        }
      }

      if (this.textarea.fromMulti) {
        let finalObject = {};

        if (this.textarea.objLovData) {
          for (let val of this.textarea.objLovData) {
            for (let lVal of val) {

              if (finalObject[lVal.key]) {
                finalObject[lVal.key] = finalObject[lVal.key] + "," + lVal.value;
              } else {
                finalObject[lVal.key] = lVal.value;
              }
            }
          }
        }

        if (Object.keys(finalObject).length > 0) {
          for (let item in finalObject) {
            if (values[1] && values[1].indexOf(".") > -1) {
              values[1] = values[1].split(".")[1];
            }
            if (values[1].toUpperCase() == item.toUpperCase()) {
              this.lhs_lib.set_item_value(this.textarea, values[0], this.textarea.indexcount ? this.textarea.indexcount : this.textarea.indexCount, finalObject[item] ? finalObject[item] : "", false, true);
            }
          }
        } else {

          this.lhs_lib.set_item_value(this.textarea, values[0], this.textarea.indexcount ? this.textarea.indexcount : this.textarea.indexCount, "", false, true);
        }
      } else {
        if (this.textarea.objLovData) {

          for (let lVal of this.textarea.objLovData) {
            if (values[1] && values[1].indexOf(".") > -1) {
              values[1] = values[1].split(".")[1];
            }
            if (lVal.key.toLowerCase() == values[1].toLowerCase()) {
              this.lhs_lib.set_item_value(this.textarea, values[0], this.textarea.indexcount ? this.textarea.indexcount : this.textarea.indexCount, lVal.value, false, true);
            }
          }
        }
      }


    }
  }

  clear() {
    this.textarea.oldValue = "";
    this.textarea.value = "";
    this.textarea.Dvalue = "";
    this.textarea.DcodeOfValues = "";
    this.clearReturnData();
  }


  @HostListener("keyup.F9", ['$event'])
  checkKey(event, flag?) {
    if (this.textarea.item_enable_flag == 'T') {
      if (event.keyCode == 120 && this.textarea.lov_code || flag) {

        if (this.textarea.click_events_str && ((this.textarea.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) || this.textarea.click_events_str.toLowerCase().includes("open_lov_wd"))) {
          this.textarea.itemClicked = 'pre';
          this.emitPass.emit(this.textarea)
        } else {
          this.textarea.eventCode = 120
          this.textarea.lovEvent = {
            tempClickEntStr: JSON.stringify(this.textarea.click_event_str)
          }
          this.textarea.click_events_str = 'open_lov()';
          this.textarea.itemClicked = 'pre';
          this.emitPass.emit(this.textarea)
        }
      }
    }



  }

  // @HostListener("keypress", ['$event'])
  checkNumKey(event, flag?) {
    if (this.textarea.datatype && this.textarea.datatype.toUpperCase() == 'NUMBER') {
      var ASCIICode = (event.which) ? event.which : event.keyCode
      if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
        if (ASCIICode == 45 && !this.textarea.value) { }
        else if (ASCIICode == 45 && this.textarea.value.length == 0) { }
        else if (ASCIICode == 46 && this.textarea.value && (this.textarea.value.indexOf(".") <= -1)) {
        } else {
          return false;
        }
      }
    }
  }


  validateInput() {
    if ((this.textarea.data_required_flag && (this.textarea.data_required_flag == 'T' || (this.textarea.prompt_name && this.textarea.prompt_name[this.textarea.prompt_name.length - 1]) == '*'))) {
      if (this.textarea.value) {
        if (this.textarea.input_pattern) {
          let pattern = eval(this.textarea.input_pattern);
          this.textarea.isValid = pattern.test(this.textarea.value);
          if (!this.textarea.isValid) {
            this.textarea.vadidateMsg = this.textarea.tool_tip ? this.textarea.tool_tip : "Please enter valid " + this.textarea.prompt_name;
          }
        } else {
          this.textarea.isValid = true;
        }
      } else {
        this.textarea.isValid = false;
        this.textarea.vadidateMsg = this.textarea.tool_tip ? this.textarea.tool_tip : "Please enter " + this.textarea.prompt_name;
      }
    } else {
      this.textarea.isValid = true;
    }

  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: this.textarea.apps_page_frame_seqid,
      item_seq_id: this.textarea.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.textarea,
        runEvents: this.textarea.runEvents
      }
    });
    return await modal.present();
  }


  getParsedJson(json) {
    // this.globalObjects.getParsedJson(json)
    if (!json) {
      return {};
    }
    try {
      if (typeof (json) == "string") {
        return JSON.parse(json);
      }
      if (typeof (json) == 'object' && json != null) {
        return json;
      }
    } catch (err) {
      console.error("error violation", err)
      return
    }
  }



  checkLovChange() {
    this.validateInput();
  }

  clearReturnData() {
    if(this.textarea.lov_return_column_str){
      let lov_return_key = this.textarea.lov_return_column_str.split(";");
      lov_return_key.pop();
      for (let retStr of lov_return_key) {
        if (retStr.indexOf(":=") > -1) {
          let values = retStr.split(":=");
          this.lhs_lib.set_item_value(this.textarea, values[0], this.textarea.indexcount ? this.textarea.indexcount : this.textarea.indexCount, "", false, true);
        }
      }
    }
  }


  async openLovObject() {
    let rowindex;
    let wsdp = [];
    let col = {};
    if (this.textarea.indexcount) {
      rowindex = this.textarea.indexcount;
    } else {
      rowindex = 0;
    }
    if (this.parentComponent.frame.tableRows) {
      for (let itemGroup of this.parentComponent.frame.tableRows[rowindex]) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else if (item.value) {
              col[item.apps_item_seqid] = item.value
            } else {
              col[item.apps_item_seqid] = ""
            }
          }
        }
      }
    } else {
      for (let itemGroup of this.parentComponent.frame) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else if (item.value) {
              col[item.apps_item_seqid] = item.value
            } else {
              col[item.apps_item_seqid] = ""
            }
          }
        }
      }
    }
    wsdp.push(col);
    let newWsdp = [];
    if (this.parentComponent.wsdp && this.parentComponent.wsdp.length > 0) {
      newWsdp.push(Object.assign(this.parentComponent.wsdp[0], wsdp[0]));
    } else {
      newWsdp = wsdp;
    }
    let objCode;
    if (this.lovObj) {
      objCode = this.lovObj.split("=")[1];
    }
    this.wscp.click_events_str = "get_object_config";
    this.wscp.object_code = objCode;
    this.wscp.service_type = null;
    let lovT = "";
    if ((this.textarea.click_events_str && this.textarea.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) || (this.textarea.post_events_str && this.textarea.post_events_str.toLowerCase().indexOf('open_multi_lov') > -1)) {
      lovT = "M"
    }
    let wscp = {
      lovType: lovT,
      apps_item_seqid: this.wscp.apps_item_seqid,
      apps_page_frame_seqid: this.wscp.apps_page_frame_seqid,
      apps_working_mode: this.wscp.apps_working_mode,
      click_events_str: this.wscp.click_events_str,
      item_sub_type: this.textarea.item_sub_type,
      object_code: this.wscp.object_code,
      origin_apps_item_seqid: this.wscp.origin_apps_item_seqid,
      orignal_apps_item_seqid: this.wscp.orignal_apps_item_seqid,
      service_type: null,
      lov_code: this.textarea.lov_code,
      objLovData: this.textarea.objLovData
    }


    if (wscp.apps_item_seqid) { } else {
      wscp.apps_item_seqid = this.textarea.apps_item_seqid;
    }

    let data = {
      click_events_str: "get_object_config",
      isModal: "P",
      object_mast: [],
      wscpNav: wscp,
      wsdp: newWsdp
    }

    this.globalObjects.popoverFlag = 'P'



    const modal =
      await this.popoverController.create({
        component: SuperPage,
        id: "globalPopover",
        componentProps: data,
        backdropDismiss: true
      });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {

      this.lhs_lib.object_mast = this.parentComponent.cdr['_view'].parent.component.object_mast;

      if ((this.textarea.click_events_str && this.textarea.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) || (this.textarea.post_events_str && this.textarea.post_events_str.toLowerCase().indexOf('open_multi_lov') > -1)) {
        let values = [];
        let codeOfValues = [];
        this.textarea.isValid = true
        this.textarea.lovObjData = detail.data;
        this.textarea.objLovData = [];
        for (let l of detail.data) {
          if (l.apps_item_seqid == this.textarea.apps_item_seqid) {
            values.push(l.value.values);
            codeOfValues.push(l.value.codeOfValues)
            this.textarea.objLovData.push(l.returnData);
          }
        }


        this.textarea.codeOfValues = "";
        this.textarea.value = "";

        for (let item of codeOfValues) {
          this.textarea.codeOfValues = this.textarea.codeOfValues ? (this.textarea.codeOfValues + "," + item) : item;
        }
        for (let item of values) {
          this.textarea.value = this.textarea.value ? (this.textarea.value + "," + item) : item;
        }

      } else {
        this.textarea.objLovData = [];
        this.textarea.objLovData[0] = detail.data;
        if (!this.textarea.lov_return_column_str) {
          this.textarea.value = this.textarea.lovObjData[0].values;
          this.textarea.codeOfValues = this.textarea.lovObjData[0].codeOfValues;
        }
      }

    });

    await modal.present();

  }



  async ngAfterViewInit(): Promise<void> {
    await this.checkTextarea();
  }

  onFocus() {

    if (!this.globalObjects.focusArrow) {
      
      this.globalObjects.focusedItem = {}
      this.globalObjects.focusedItem.name = this.textarea.apps_page_frame_seqid + '.' + this.textarea.item_name;
      this.globalObjects.focusedItem.index = this.textarea.indexcount;

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement?.blur();
      }
    } else {
      // let name = this.textarea.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
      // let itm = this.lhs_lib.get_item(name, this.textarea.indexcount, true);
      // if (itm) {
      //   itm.frame_status = 'dirty';
      // }

      if (this.frame) {
        let tableRows = this.lhs_lib.get_rows(this.frame, this.textarea.indexcount);
        if (tableRows) {
          this.lhs_lib.make_row_dirty(this.textarea, tableRows);
        }
      }

      // this.globalObjects.focusedItem = "";
    }
  }

  async checkTextarea() {
    return this.ionTextarea.getInputElement().then((element) => {
      if (element.style.height == '0px') {
        return element.style.height = 'auto';
      }
      if (this.textarea.item_enable_flag == 'F') {
        element.style.minHeight = '75px';
      } else {
        element.style.minHeight = '';
      }
    })
  }



  textrichModel(event: any) {
    // const nativeTextarea = this.textInputname.getInputElement();
    // nativeTextarea.then((textInputname) => textInputname.blur());
    console.log(this.textInputname)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement?.blur();
    }
    // let component = FrameRelationalTableFilterComponent
    let component = TextrichModelComponent
    let componentProps = {
      frame: this.frame,
      theadData: this.frame.apextheads,
      textarea:this.textarea
    }
    let id = "globe_textEditor_model"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((detail) => {
      // alert("user role");
      // if (detail.data) {
      //   this.getdataFromcanvasApex(detail.data)
      //   // this.wsdpcl=this.lhs_lib.getDpcl();
      //   // this.itemClicked(value.data);
      // }
      
      this.lhs_lib.go_item(`${this.textarea.apps_page_frame_seqid}.${this.textarea.item_name}`,this.textarea.indexcount, true);
    })
  }

}

