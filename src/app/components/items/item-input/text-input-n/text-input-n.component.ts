import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { InputFormatMaskPipe } from 'src/app/pipes/input-format-mask.pipe';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { SuperPage } from 'src/app/pages/super/super.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { DateInputNComponent } from '../date-input-n/date-input-n.component';
import { cd } from '@fullcalendar/core/internal-common';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { DisableWheelOnNumberDirective } from 'src/app/directives/disable-wheel-on-number.directive';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { IonicModule} from '@ionic/angular/standalone';

@Component({
standalone : true,
changeDetection: ChangeDetectionStrategy.OnPush,
imports:[DateInputNComponent, DisableWheelOnNumberDirective, STANDALONE_IMPORTS],
  selector: 'app-text-input-n',
  templateUrl: './text-input-n.component.html',
  styleUrls: ['./text-input-n.component.scss'],
})
export class TextInputNComponent implements OnInit {

  @Input() button: any;
  @Input() textinput: any;
  @Input() frame_type: any;
  @Input() wscp: any;
  @Input() parentComponent: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() frameSeqId:any
  plt: any = 'browser';

  itemval: any;
  col1 = 3;
  col2 = 9;
  developerModeData: any;
  inputType = 'password';
  iconName = 'eye-off';
  vadidateMsg = "";
  lovObj: any;
  placeholder = '';
  postEventFlag: boolean = true;
  myFlag: boolean = true;
  isSingleClick: boolean = true;
  timer: any;

  object_mast: any;

  dimensionItem: any;
  passwordFlag = false;
  passwordEye = false;
  dont_run_post: boolean = false;
  // isClickable:boolean = false;

  isFirst: boolean = false;



  constructor(public globalObjects: GlobalObjectsService, private formatMastPipe: InputFormatMaskPipe,
    public events: Events, public modalCtrl: ModalController, public platform: Platform, private processData: ProcessDataService,
    public lhs_lib: LhsLibService, public popoverController: PopoverController, public dataService: DataService, private cdr: ChangeDetectorRef,private cdEngine: CdEngineService) {
    if (this.globalObjects.itemFlag) {
      return applyLoggingDecorator(this, "text-input-n")
    }
  }

  ngOnInit() {

    this.cdEngineCall(true);
    // this.textinput.isclickable = true;
    if (this.textinput.input_pattern && (this.textinput.input_pattern.toLowerCase().includes("password") || this.textinput.input_pattern.toLowerCase().includes("masked_field"))) {
      this.passwordFlag = true;
      if (this.textinput.input_pattern.toLowerCase().includes("password")) {
        this.passwordEye = true;
      }
    }

    if ((this.textinput.data_required_flag && this.textinput.data_required_flag == 'T') || ((this.textinput.prompt_name && this.textinput.prompt_name[this.textinput.prompt_name.length - 1]) == '*')) {
      if (this.textinput.value != undefined && this.textinput.value != null && this.textinput.value !== "") {
        this.textinput.isValid = true;
      } else {
        this.textinput.isValid = false;
      }
    } else {
      this.textinput.isValid = true;
    }

    if (this.textinput.datatype != 'DATE' && this.textinput.datatype != 'DATETIME' && this.textinput.datatype != 'TIME'
      && this.textinput.value && this.textinput.format_mask && this.textinput.datatype != 'NUMBER') {
      this.textinput.value = this.formatMastPipe.transform(this.textinput.value, this.textinput).value;
    } else if (this.textinput.datatype == 'NUMBER' && this.textinput.value) {
      let val = this.formatMastPipe.transform(this.textinput.value, this.textinput).value;
      if (val) {
        let a = val.toString().replaceAll(",", "");
        val = a;
      }
      this.textinput.value = val;
    }

    if (this.textinput.lov_code && this.textinput.value && this.textinput.click_events_str && this.textinput.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) {
      this.textinput.codeOfValues = this.textinput.value;
      this.textinput.displayChips = this.textinput.value.split("^");
      this.textinput.fromMulti = true;
    }

    if (this.textinput.position && (this.textinput.position.indexOf("column") > -1)) {
      let arr = this.textinput.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    } else if (this.textinput.promptCol) {
      this.col1 = this.textinput.promptCol;
      this.col2 = (12 - parseFloat(this.textinput.promptCol));
    }

    if (this.textinput.item_enable_flag == 'F') {
      if (this.textinput.item_sub_type == 'BROWSER1') {
        let obj = this.textinput.display_setting_str;
        obj.border = "1px solid";
        obj["box-shadow"] = "rgb(228 240 255) 5px 6px 20px inset";
        this.textinput.display_setting_str = obj;
      } else {
        let obj = this.textinput.display_setting_str
        this.textinput.display_setting_str = obj;
      }
    }

    if (this.textinput.calling_parameter_str && this.textinput.calling_parameter_str.indexOf("LOV") > -1) {
      let strArr = this.textinput.calling_parameter_str.split("~");
      for (let x of strArr) {
        if (x.indexOf("LOV") > -1) {
          this.lovObj = x;
        }
      }
    }

    if (this.textinput.item_sub_type_child == 'UPPER') {
      let val = new RegExp(/^[A-Z]+$/);
      this.textinput.input_pattern = val;
      this.textinput.tool_tip = "Only Uppercase";
    }
    if (this.textinput.item_sub_type_child == 'LOWER') {
      let val = new RegExp(/^[a-z]+$/);
      this.textinput.input_pattern = val;
      this.textinput.tool_tip = "Only Lowercase Allowed";
    }
    if (this.textinput.item_sub_type_child == 'PHONE') {
      let val = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
      this.textinput.input_pattern = val;
      this.textinput.tool_tip = "Invalid phone number";
    }
    if (this.textinput.item_sub_type_child == 'EMAIL') {
      let val = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      this.textinput.input_pattern = val;
      this.textinput.tool_tip = "Invalid Email address";
    }

    if ((this.platform.is('ios') || this.platform.is('android'))) {
      this.plt = this.platform;
    }

    if (this.textinput.display_setting_str) {
      let str = typeof (this.textinput.display_setting_str) == 'string' ? JSON.stringify(this.textinput.display_setting_str) : this.textinput.display_setting_str;

      if ((str["dimension"] == 'T' || str["DIMENSION"] == 'T') && this.textinput.calling_object_code) {
        this.dimensionItem = JSON.parse(JSON.stringify(this.textinput));
        this.dimensionItem.item_enable_flag = "T"
        this.dimensionItem.click_events_str = this.textinput.orignal_click_events_str ? this.textinput.orignal_click_events_str : this.textinput.click_events_str;
      }

      this.textinput.display_setting_str = { ...this.textinput.display_setting_str };

      // delete this.textinput.display_setting_str['dimension'];
      // delete this.textinput.display_setting_str['DIMENSION'];


      if (this.frame_type == 'ENTRY_TABLE' || this.frame_type == 'ENTRY_TABLE_NEW' || this.frame_type == 'TABLE') {
        this.textinput.tableStyle = JSON.parse(JSON.stringify(this.textinput.display_setting_str));

        delete this.textinput.tableStyle['width'];
        delete this.textinput.tableStyle['min-width'];
        delete this.textinput.tableStyle['max-width'];
      }
       this.textinput.dimensionItem = this.dimensionItem;
    }

    if (this.textinput.tool_tip && (this.platform.is('ios') || this.platform.is('android'))) {
      this.placeholder = this.textinput.tool_tip
    }
  
  }

  itemClicked1(item) {
    this.timer = null;
    // console.log(`comes in itemClicked1 and emit pass ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,this.textinput.item_name);
    if (!this.textinput.forcedFocus) {

      //**** commented this because of validate lov not working in some scenerios due to below code*/
      // if (item.value) {
      //   this.textinput.oldValue = item.value;
      // }
      //**** */

      this.textinput.itemClicked = 'pre';
      this.emitPass.emit(this.textinput);
    } else {
      delete this.textinput['forcedFocus'];
    }
  }

  itemClicked(item, from?) {


    // console.log(`comes in itemClicked and emit pass ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,this.textinput.item_name);
    if (this.globalObjects.focusArrow) {

      this.isSingleClick = true;

      if (this.timer) {
        return;
      }

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = null;

        if (this.isSingleClick) {
          console.log("comming from ", from, this.textinput.item_name);
          this.itemClicked1(item);
          this.isSingleClick = false;
        }
      }, 100);
    }
  }

  onBlur(item) {

    if (this.dont_run_post) {
      this.dont_run_post = false;
      return;
    }

    if (this.textinput.item_enable_flag == 'T') {

      if (this.textinput.summary_flag) {
        let frame = this.lhs_lib.get_frame_config(this.textinput.apps_page_frame_seqid);
        if (frame) {
          this.processData.calculateTableRows(frame);
        }
      }

      if (item.datatype != 'DATE' && item.datatype != 'DATETIME' && item.datatype != 'TIME') {
        delete this.textinput['forcedInvalid'];
        delete this.textinput['rase'];
      }
      // item.value = item.value ? item.value.trim() : "";
     item.value = item.value !== null && item.value !== undefined ? String(item.value).trim() : "";
      

      this.validateInput();

      if ((!item.value) && item.value != item.oldValue && item.oldValue) {
        this.clearValue();
      }

      if (item.datatype != 'DATE' && item.datatype != 'DATETIME' && item.datatype != 'TIME' && item.datatype != 'NUMBER') {
        let val = this.formatMastPipe.transform(this.textinput.value, this.textinput);
        if (val) {
          if (!val.isValid) {
            this.textinput.isValid = false;
            this.textinput.forcedInvalid = true;
            this.textinput.vadidateMsg = "Please enter valid format mask : " + this.textinput.format_mask;
          }
          this.textinput.value = val.value;
        }
      } else if (this.textinput.datatype == 'NUMBER' && this.textinput.value) {
        let val = this.formatMastPipe.transform(this.textinput.value, this.textinput)
        if (val) {
          let a = val.value.toString().replaceAll(",", "");
          val.value = a;

          if (!val.isValid) {
            this.textinput.isValid = false;
            this.textinput.forcedInvalid = true;
            this.textinput.vadidateMsg = "Please enter valid format mask : " + this.textinput.format_mask;
          }
          this.textinput.value = val.value;
        }
      }
      var changeValue = this.getParsedJson(this.textinput.display_setting_str);

      if (changeValue["text-transform"]) {
        if (changeValue["text-transform"] == 'uppercase') {
          this.textinput.value = (this.textinput.value).toUpperCase();
        }
        if (changeValue["text-transform"] == 'lowercase') {
          this.textinput.value = (this.textinput.value).toLowerCase();
        }
        if (changeValue["text-transform"] == 'capitalize') {
          if (this.textinput.value) {
            let text = "";
            let valarr = this.textinput.value.split(" ");
            for (let o of valarr) {
              text = text + " " + o.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            }
            this.textinput.value = text.replace(" ", "");
          }
        }
      }

      if (this.textinput.isValid && this.globalObjects.focusArrow) {
        this.textinput.blurValue = this.textinput.value;
        this.textinput.itemClicked = 'post';
        this.emitOnChange.emit(this.textinput);
        // this.cdr.detectChanges();
      } else {
        let event = JSON.parse(JSON.stringify(this.textinput));
        if (event.post_events_str) {
          let events = event.post_events_str.split(";");
          let str = "";
          for (let ev of events) {
            if (ev == "app_plsql1_clob_force" || ev == "app_plsql2_clob_force" || ev == "app_plsql1_text_force" || ev == "app_plsql2_text_force" || ev == "app_js1_text_force" || ev == "app_js2_text_force"
              || ev == "ora_plsql1_clob_force" || ev == "ora_plsql2_clob_force" || ev == "ora_plsql1_text_force" || ev == "ora_plsql2_text_force") {
              str = ev + ";";
            }
          }
          if (str) {
            // this.cdr.detectChanges();
            this.textinput.itemClicked = 'post';
            event.post_events_str = str;
            this.emitOnChange.emit(event);
          }
        }
      }
      // this.cdr.detectChanges();
    }
  }


  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }

  openLov() {
    if (!this.globalObjects.focusArrow) {
      this.globalObjects.focusedItem = {}
      this.globalObjects.focusedItem.name = this.textinput.apps_page_frame_seqid + '.' + this.textinput.item_name;
      this.globalObjects.focusedItem.index = this.textinput.indexcount;
    }

    let event: any = {};
    event.keyCode = 120;
    this.checkKey(event);

  }

  dblEvent() {
    // let event: any = {};
    // event.keyCode = 999;


    if (this.textinput.click_events_str && (this.textinput.click_events_str.toLowerCase().includes('open_lov()') || ((this.textinput.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) || this.textinput.click_events_str.toLowerCase().includes("open_lov_wd")))) {

    } else {

      if (this.textinput.lov_code && this.textinput.lov_code.toUpperCase() != 'SUPER_LOV') {
        this.textinput.lovEvent = {
          tempClickEntStr: this.textinput.click_events_str ? JSON.parse(JSON.stringify(this.textinput.click_events_str)) : null
        }

        if (this.textinput.click_events_str) {
          this.textinput.click_events_str = (this.textinput.click_events_str.trim().charAt((this.textinput.click_events_str).length - 1) == ';') ? this.textinput.click_events_str + 'open_lov();' : this.textinput.click_events_str + ';open_lov();'
        } else {
          this.textinput.click_events_str = 'open_lov();';
        }
      }

    }

    this.isSingleClick = false;
    clearTimeout(this.timer);
    this.timer = null;
    if (this.frame_type == 'ENTRY_TABLE' || this.frame_type == 'ENTRY_TABLE_NEW' || this.frame_type == 'HORIZONTAL_TABLE') {
      this.textinput.isDblClick = true;
    }
    this.itemClicked1(this.textinput);
    // this.checkKey(event);
  }

  removeValue(i) {
    if (this.textinput.item_enable_flag == 'T') {
      if (this.textinput.displayChips && this.textinput.displayChips.length > 0) {
        this.textinput.Dvalue ? this.textinput.Dvalue.splice(i, 1) : "";
        if (typeof (this.textinput.DcodeOfValues) == 'string') {
          this.textinput.DcodeOfValues = this.textinput.DcodeOfValues.split("^");
          this.textinput.DcodeOfValues.splice(i, 1)
        } else {
          if (this.textinput.DcodeOfValues) {
            this.textinput.DcodeOfValues.splice(i, 1)
          }
        }

        this.textinput.Ditems ? this.textinput.Ditems.splice(i, 1) : "";
        this.textinput.objLovData ? this.textinput.objLovData.splice(i, 1) : "";
        let covArr = typeof (this.textinput.codeOfValues) == 'string' ? this.textinput.codeOfValues.split("^") : this.textinput.codeOfValues;
        covArr.splice(i, 1);
        this.textinput.displayChips = covArr;
        this.textinput.codeOfValues = covArr;
        this.textinput.value = this.textinput.displayChips.join("^");
        if (this.textinput.objLovData) {
          this.setReturnData();
        } else {
          if (this.textinput.fromMulti) {
            this.set_objLovData(i);
          }
        }
      }
    }
  }

  clear() {
    this.dataService.terminateAllRequest();
    this.clearValue();
    this.lhs_lib.go_item(this.textinput.apps_page_frame_seqid + "." + this.textinput.item_name, this.textinput.indexcount, true);
  }

  clearValue() {
    this.globalObjects.focusArrow = true;
    delete this.textinput['forcedFocus'];
    this.events.publish("clearEvent");
    this.textinput.value = "";
    delete this.textinput['oldValue'];
    this.textinput.Dvalue = [];
    this.textinput.DcodeOfValues = [];
    this.textinput.Ditems = [];
    this.textinput.codeOfValues = "";
    delete this.textinput['lovValue'];
    this.textinput.displayChips = this.textinput.displayChips ? this.textinput.displayChips = [] : null;
    this.clearReturnData();

    this.lhs_lib.refresh_frames();
  }

  @HostListener("keyup.F9", ['$event'])

  checkKey(event, flag?) {

    if (this.textinput.item_enable_flag == 'T') {
      if (this.textinput.lov_code && this.textinput.lov_code.toUpperCase() == 'SUPER_LOV') {
        this.itemClicked1(this.textinput);
      } else {

        if ((event.keyCode == 120 || event.keyCode == 999) && this.textinput.lov_code || flag) {

          if (this.textinput.click_events_str && ((this.textinput.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) || this.textinput.click_events_str.toLowerCase().includes("open_lov_wd"))) {
            this.itemClicked1(this.textinput);
          } else {
            this.textinput.eventCode = 120
            this.textinput.lovEvent = {
              tempClickEntStr: this.textinput.click_events_str ? JSON.parse(JSON.stringify(this.textinput.click_events_str)) : null
            }

            if (this.textinput.click_events_str && this.textinput.click_events_str.toLowerCase().includes('open_lov()')) {

            } else {
              if (this.textinput.click_events_str) {
                this.textinput.click_events_str = (this.textinput.click_events_str.trim().charAt((this.textinput.click_events_str).length - 1) == ';') ? this.textinput.click_events_str + 'open_lov();' : this.textinput.click_events_str + ';open_lov();'
              } else {
                this.textinput.click_events_str = 'open_lov();';
              }
            }
            this.itemClicked1(this.textinput);
          }
        } else {
          if (event.keyCode == 999) {
            this.itemClicked1(this.textinput);
          }
        }
      }
    }
  }

  //  @HostListener("keypress", ['$event'])
  checkNumKey(event, flag?) {
    if (this.textinput.datatype && this.textinput.datatype.toUpperCase() == 'NUMBER') {
      var ASCIICode = (event.which) ? event.which : event.keyCode
      if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
        if (ASCIICode == 45 && !this.textinput.value) { }
        else if (ASCIICode == 45 && this.textinput.value.length == 0) { }
        else if (ASCIICode == 46 && this.textinput.value && (this.textinput.value.indexOf(".") <= -1)) { }
        else {
          return false;
        }
      }
    }
  }

  validateInput() {
    if ((this.textinput.data_required_flag && (this.textinput.data_required_flag == 'T' || (this.textinput.prompt_name && this.textinput.prompt_name[this.textinput.prompt_name.length - 1]) == '*'))) {
      if (this.textinput.value) {
        if (this.textinput.input_pattern) {
        } else {
          this.textinput.isValid = true;
        }
      } else {
        this.textinput.isValid = false;
        this.textinput.vadidateMsg = this.textinput.tool_tip ? this.textinput.tool_tip : "Please enter " + this.textinput.prompt_name;
      }
    } else {
      this.textinput.isValid = true;
    }


    if (this.textinput.value) {
      if (this.textinput.input_pattern && !this.textinput.input_pattern.toLowerCase().includes("password")) {
        try {
          let regex = this.get_regex(this.textinput.input_pattern);
          if ((this.textinput.value.includes(',') || this.textinput.value.includes(';')) && this.textinput.input_pattern == 'EMAIL') {
            let emailVal = [];
            emailVal = this.textinput.value.includes(',') ? this.textinput.value.split(",") : this.textinput.value.split(";")
            for (let val of emailVal) {
              let pattern = eval(regex);
              this.textinput.isValid = pattern.test(val);
              if (!this.textinput.isValid) {
                break;
              }
            }
          } else {
            if (typeof (regex) == 'boolean') {
              this.textinput.isValid = regex;
            } else {
              let pattern = eval(regex);
              this.textinput.isValid = pattern.test(this.textinput.value);
            }
          }
          if (!this.textinput.isValid) {
            this.textinput.forcedInvalid = true;
            this.textinput.vadidateMsg = this.textinput.tool_tip ? this.textinput.tool_tip : "Please enter valid " + this.textinput.prompt_name;
          }

        } catch {
          alert("Please enter valid format mask");
        }
      } else if (this.textinput.input_pattern && this.textinput.input_pattern.toLowerCase().includes("password")) {

        this.textinput.isValid = true;
        if (!this.textinput.isValid) {
          this.textinput.forcedInvalid = true;
          this.textinput.vadidateMsg = this.textinput.tool_tip ? this.textinput.tool_tip : "Please enter valid " + this.textinput.prompt_name;
        }

      } if (this.textinput.datatype == 'NUMBER') {
        if (this.textinput.from_value) {
          if (parseFloat(this.textinput.value) >= parseFloat(this.textinput.from_value)) { } else {
            this.textinput.isValid = false;
            this.textinput.forcedInvalid = true;
            this.textinput.vadidateMsg = this.textinput.prompt_name + "Should not be less than" + this.textinput.from_value + ".";
          }
        }

        if (this.textinput.to_value) {
          if (parseFloat(this.textinput.value) <= parseFloat(this.textinput.to_value)) { } else {
            this.textinput.isValid = false;
            this.textinput.forcedInvalid = true;
            this.textinput.vadidateMsg = this.textinput.prompt_name + "Should not be greater than" + this.textinput.to_value + ".";
          }
        }
      }
    }

  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: this.textinput.apps_page_frame_seqid,
      item_seq_id: this.textinput.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.textinput,
        runEvents: this.textinput.runEvents
      }
    });
    return await modal.present();
  }

  getParsedJson(json) {

    try {
      if (json) {

        if (this.frame_type != 'ENTRY_TABLE' && this.frame_type != 'ENTRY_TABLE_NEW' && this.frame_type != 'HORIZONTAL_TABLE') {
          return JSON.parse(json);
        } else {
          let jsonVal = {};
          let pJson = JSON.parse(json);
          for (let j in pJson) {
            if (j.includes('width')) {
            } else {
              jsonVal[j] = pJson[j];
            }
          }
          return jsonVal;
        }

      } else {
        return {}
      }
    } catch (err) {
      if (typeof json == 'object') {
        if (this.frame_type != 'ENTRY_TABLE' && this.frame_type != 'ENTRY_TABLE_NEW' && this.frame_type != 'HORIZONTAL_TABLE') {
          return json;
        } else {
          let jsonVal = {};
          let pJson = json;
          for (let j in pJson) {
            if (j.includes('width')) {
            } else {
              jsonVal[j] = pJson[j];
            }
          }
          return jsonVal;
        }
      } else {
        return {}
      }
    }
  }

  checkLovChange() {

    this.textinput.msgError = '';
    this.validateInput();
  }

  clearReturnData() {
    if (this.textinput.lov_return_column_str) {
      let lov_return_key = this.textinput.lov_return_column_str.split(";");
      lov_return_key.pop();
      for (let retStr of lov_return_key) {
        if (retStr.indexOf(":=") > -1) {
          let values = retStr.split(":=");
          this.lhs_lib.set_item_config(values[0], 'msgError', '', 'current_record');
          this.lhs_lib.set_item_value(this.textinput, values[0], this.textinput.indexcount ? this.textinput.indexcount : this.textinput.indexCount, "", false, true);
        }
      }
    }
  }

  async openLovObject() {
    let rowindex;
    let wsdp = [];
    let col = {};
    if (this.textinput.indexcount) {
      rowindex = this.textinput.indexcount;
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

    if (this.lhs_lib.get_object_config()) {
      this.object_mast = this.lhs_lib.get_object_config();
    }

    if ((this.textinput.click_events_str && this.textinput.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) || (this.textinput.post_events_str && this.textinput.post_events_str.toLowerCase().indexOf('open_multi_lov') > -1)) {
      lovT = "M"
    }

    let wscp = {
      lovType: lovT,
      apps_item_seqid: this.textinput.apps_item_seqid,
      apps_page_frame_seqid: this.textinput.apps_page_frame_seqid,
      apps_working_mode: this.wscp.apps_working_mode,
      click_events_str: this.textinput.click_events_str,
      item_sub_type: this.textinput.item_sub_type,
      object_code: this.wscp.object_code,
      origin_apps_item_seqid: this.wscp.origin_apps_item_seqid,
      orignal_apps_item_seqid: this.wscp.orignal_apps_item_seqid,
      service_type: null,
      lov_code: this.textinput.lov_code,
      objLovData: this.textinput.objLovData
    }

    if (wscp.apps_item_seqid) { } else {
      wscp.apps_item_seqid = this.textinput.apps_item_seqid;
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
        id: "globalPopover-new",
        componentProps: data,
        backdropDismiss: true
      });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {

      this.lhs_lib.object_mast = this.object_mast;
      if ((this.textinput.click_events_str && this.textinput.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) || (this.textinput.post_events_str && this.textinput.post_events_str.toLowerCase().indexOf('open_multi_lov') > -1)) {
        let values = [];
        let codeOfValues = [];
        this.textinput.isValid = true
        this.textinput.lovObjData = detail.data;
        this.textinput.objLovData = [];
        for (let l of detail.data) {
          if (l.apps_item_seqid == this.textinput.apps_item_seqid) {
            this.textinput.objLovData.push(l.value);
          }
        }
        this.textinput.codeOfValues = "";
        this.textinput.value = "";
      } else {
        this.textinput.objLovData = [];
        this.textinput.objLovData = detail.data;
        if (!this.textinput.lov_return_column_str) {
          this.textinput.value = this.textinput.lovObjData[0].values;
          this.textinput.codeOfValues = this.textinput.lovObjData[0].codeOfValues;
        }
      }
    });
    await modal.present();
  }

  set_objLovData(i) {
    let lov_return_key = this.textinput.lov_return_column_str.split(";");
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

        if (this.textinput.item_name != name) {
          let ind = this.textinput.itemIndex != undefined ? this.textinput.itemIndex : (this.textinput.indexcount ? this.textinput.indexcount : (this.textinput.indexCount ? this.textinput.indexCount : 0));
          let val = this.lhs_lib.get_item_value(values[0], ind);
          if (val && val.includes(",")) {
            let valArr = val.split(",");
            valArr.splice(i, 1);
            let newVal = valArr.join(",");

            this.lhs_lib.set_item_value(this.textinput, values[0], ind, newVal);
          } else {
            let newVal = "";
            this.lhs_lib.set_item_value(this.textinput, values[0], ind, newVal);
          }
        }
      }
    }
  }

  setReturnData() {

    let lov_return_key = this.textinput.lov_return_column_str.split(";");
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

      if (this.textinput.fromMulti) {
        let finalObject = {};

        if (this.textinput.objLovData) {
          for (let val of this.textinput.objLovData) {
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
              this.lhs_lib.set_item_value(this.textinput, values[0], this.textinput.indexcount ? this.textinput.indexcount : this.textinput.indexCount, finalObject[item] ? finalObject[item] : "", false, true);
            }
          }
        } else {

          this.lhs_lib.set_item_value(this.textinput, values[0], this.textinput.indexcount ? this.textinput.indexcount : this.textinput.indexCount, "", false, true);
        }
      } else {
        if (this.textinput.objLovData) {

          for (let lVal of this.textinput.objLovData) {
            if (values[1] && values[1].indexOf(".") > -1) {
              values[1] = values[1].split(".")[1];
            }
            if (lVal.key.toLowerCase() == values[1].toLowerCase()) {
              this.lhs_lib.set_item_value(this.textinput, values[0], this.textinput.indexcount ? this.textinput.indexcount : this.textinput.indexCount, lVal.value, false, true);
            }
          }
        }
      }
    }
  }

  onFocus() {

    // console.log(`comes in input ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,this.textinput.item_name);
    // delete this.textinput['forcedFocus'];
    if (!this.globalObjects.focusArrow) {
      console.log(this.textinput);
      this.globalObjects.focusedItem = {}
      this.globalObjects.focusedItem.name = this.textinput.apps_page_frame_seqid + '.' + this.textinput.item_name;
      this.globalObjects.focusedItem.index = this.textinput.indexcount;
      if (document.activeElement instanceof HTMLElement) {
        this.dont_run_post = true;
        document.activeElement?.blur();
      }
    } else {
      // // this.globalobjects.setFocus(true);
      // this.globalObjects.focusedItem = "";
      // if (!this.isSingleClick) {
      // this.globalObjects.focusedItem = "";
      if (!this.isFirst) {
        this.itemClicked(this.textinput, 'focus');
      }
      // }
    }
  }

  get_regex(type) {
    if (type.toUpperCase() == 'CAPS') {
      this.textinput.value = (this.textinput.value).toUpperCase();
      return true;
    } else if (type.toUpperCase() == 'INITCAPS') {
      if (this.textinput.value) {
        let text = "";
        let valarr = this.textinput.value.split(" ");
        for (let i = 0; i < valarr.length; i++) {
          text = text + " " + valarr[i].toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }
        this.textinput.value = text.replace(" ", "");
      }
      return true;
    } else if (type.toUpperCase() == 'LOWER') {
      this.textinput.value = (this.textinput.value).toLowerCase();
      return true;
    } else if (type.toUpperCase() == 'NUMBER') {
      this.textinput.value = (this.textinput.value).toLowerCase();
      return "/^-?[0-9]\\d*(\\.\\d+)?$/";
      return true;
    } else if (type.toUpperCase() == 'SENTENCE') {
      return "/^[A-Z][^\.:]*[\.]$/";
      return true;
    } else if (type.toUpperCase() == 'MOBILE') {
      return "/^[0-9]{10}$/";
      return true;
    } else if (type.toUpperCase() == 'EMAIL') {
      return `/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/`;
      return true;
    } else if (type.toUpperCase() == 'PNUMBER') {
      return `/^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$/`;
      return true;
    } else if (type.toUpperCase() == 'ALPHANUMERIC') {
      this.textinput.value = (this.textinput.value).toUpperCase();
      return `/^[A0-Z0\\.\\-]+$/`;
      return true;
    } else {
      return type;
    }
  }

  openDimension(event) {
    event.itemClicked = 'pre';
    this.emitPass.emit(event);
  }

  displayPass(textinput) {
    this.passwordFlag = this.passwordFlag ? false : true;
  }

  makeClickable(ele) {
    this.itemClicked(this.textinput);
    this.textinput.isclickable = true;
    let el = ele;
    setTimeout(() => {
      this.isFirst = true;
      el?.elementRef?.nativeElement?.previousElementSibling.focus();
      this.isFirst = false;
    }, 0);
  }

  cdEngineCall(isRegister: boolean) {
    let id = this.textinput.apps_item_seqid + '_' + this.textinput.indexcount+'#'+this.frameSeqId;
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
