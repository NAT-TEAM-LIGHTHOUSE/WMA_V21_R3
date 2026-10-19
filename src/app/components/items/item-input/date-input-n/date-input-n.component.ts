import { Component, EventEmitter, Input, OnInit, Output, ViewChild, Injector, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular/standalone';

import {
  NgbTimeStruct,
  NgbDateStruct,
  NgbPopoverConfig,
  NgbPopover,
  NgbDatepicker,
  NgbDatepickerConfig
} from "@ng-bootstrap/ng-bootstrap";
import { noop } from "rxjs";
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DatePicker } from '@capacitor-community/date-picker';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { Events } from 'src/app/services/events';
import { DateTimeModel } from 'src/app/services/date-time.modal';
import { format, parseISO } from 'date-fns';
import { DataService } from 'src/app/services/data.service';
import { DatePopupPage } from 'src/app/pages/date-popup/date-popup.page';
import { DateModel } from 'src/app/services/date.model';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';

@Component({
standalone : true,
// changeDetection: ChangeDetectionStrategy.OnPush,
imports : [STANDALONE_IMPORTS],
  selector: 'app-date-input-n',
  templateUrl: './date-input-n.component.html',
  styleUrls: ['./date-input-n.component.scss'],
})
export class DateInputNComponent implements OnInit {

  @Input() dateinput: any;
  @Input() frame_type: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnBlur: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() frameSeqId:any
  @ViewChild('tableDatetime') tableDatetime;
  @ViewChild('popovr') popovr;
  inputDatetimeFormat = "M/d/yyyy H:mm:ss"; // FOR BROWSER
  dateTimeFormat: any;  //FOR ANDROID & IOS
  from_value: any = '1950';
  to_value: any = '2051';
  col1 = 3;
  dp: NgbDatepicker
  col2 = 9;
  minDate: any = { year: 1900, month: 1, day: 1 };
  maxDate: any = { year: 3000, month: 12, day: 31 };
  platformValue: any;
  developerModeData: any;
  public datetimeModel: DateTimeModel = new DateTimeModel();
  public dateModel: DateModel = new DateModel();
  // dateModel1: NgbDateStruct = {
  //   "year": new Date().getFullYear(),
  //   "month": new Date().getMonth() + 1,
  //   "day":new Date().getDate(),
  // }

  dateModel1: NgbDateStruct;
  isOpen = false;
  hourStep = 1;
  minuteStep = 1;
  secondStep = 30;
  seconds = true;
  roleMsg = '';
  private firstTimeAssign = false;

  private onTouched: () => void = noop;
  // private onChanges: (_: any) => void = noop;
  public onChanges: any = (_) => { /*Empty*/ }


  symbolArr = [",", ".", "~", " ", "-", "=", ":", "/"];
  monthArr = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  formatMask = "DD-MM-YYYY";
  formatSymbol = "-";
  formatMaskArr = ["DD", "MM", "YYYY"]
  timeMask = "";
  timeMeridiem = " AM";
  processing = false;

  mainFormatMask: any;

  calenderFlag: boolean = false;

  runPost: boolean = false;

  seqId: any;

  displayValue = new Date().toISOString();
  timeM = " AM";

  frame: any;


  /**
   * Date picker from ng boottrap is used here reference link:
   * https://stackblitz.com/edit/angular-datetimepicker?file=src%2Fapp%2Fdate-time-picker%2Fdate-time-picker.component.ts
   *
   */
  constructor(private platform: Platform, private config: NgbPopoverConfig, private inj: Injector,
    private popoverController: PopoverController, private cdr: ChangeDetectorRef,
    public globalObjects: GlobalObjectsService, public modalCtrl: ModalController,
    private events: Events, private lhs_lib: LhsLibService, public dataService: DataService,private cdEngine: CdEngineService ) {
    config.autoClose = "outside";
    config.placement = "auto";
    if (this.globalObjects.itemFlag) {
      return applyLoggingDecorator(this, "date-input-n")
    }
  }

  ngOnInit() {
    console.log( "dateinput value",this.dateinput);
    // this.cdEngineCall(true);
    this.seqId = this.dateinput.apps_item_seqid + this.dateinput.indexcount;

    this.frame = this.lhs_lib.get_frame_config(this.dateinput.apps_page_frame_seqid);

    if (this.dateinput.from_value && this.dateinput.to_value) {
      let currentDate = new Date(this.dateinput.from_value);
      let todate = new Date(this.dateinput.to_value);
      this.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
      this.maxDate = { year: todate.getFullYear(), month: todate.getMonth() + 1, day: todate.getDate() };
    } else if (this.dateinput.from_value) {
      let currentDate = new Date(this.dateinput.from_value);
      this.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    } else if (this.dateinput.to_value) {
      let currentDate = new Date(this.dateinput.to_value);
      this.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    }

    if (this.platform.is('android')) {
      this.platformValue = 'android';
    } else if (this.platform.is('ios')) {
      this.platformValue = 'ios';
    } else {
      this.platformValue = 'browser';
    }

    if (this.dateinput.position && (this.dateinput.position.indexOf("column") > -1)) {
      let arr = this.dateinput.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    } else if (this.dateinput.promptCol) {
      this.col1 = this.dateinput.promptCol;
      this.col2 = (12 - parseFloat(this.dateinput.promptCol));
    }

    if (this.dateinput.value) {
      let event = {
        target: {
          value: this.dateinput.value
        }
      }
      this.dateinput.isValid = true;
      this.onInputChange(event);
    }

    if (this.dateinput.datatype == 'DATETIME' || this.dateinput.datatype == 'TIME') {
      this.inputDatetimeFormat = "dd-MM-yyyy H:mm:ss"
    } else {
      this.inputDatetimeFormat = "dd-MM-yyyy"
    }

  }

  // Code for android date input start here

  onChange() {
    this.onFocus();
    if (this.dateinput.datatype == 'DATETIME' && this.platformValue == 'ios') {
      this.dateTimeFormat = this.globalObjects.formatDate(this.dateinput.value, "yyyy-MM-ddTHH:mm:ss");
      this.dateinput.value = this.globalObjects.formatDate(this.dateTimeFormat, "dd-MMM-yyyy HH:mm:ss");
      this.formatDate(this.dateinput.value);
    }
    else if (this.dateinput.datatype == 'DATE' && this.platformValue == 'android') {
      this.dateinput.value = this.globalObjects.formatDate(this.dateinput.value, "dd-MMM-yyyy");

      this.formatDate(this.dateinput.value);
    } else if (this.dateinput.datatype == 'DATETIME' && this.platformValue == 'android') {
      this.dateTimeFormat = this.globalObjects.formatDate(new Date(this.dateinput.displayDate), "yyyy-MM-ddTHH:mm:ss");
      this.dateinput.displayDate = this.globalObjects.formatDate(this.dateTimeFormat, "dd-MMM-yyyy HH:mm:ss");
      this.formatDate(this.dateinput.value);
    } else {
      this.formatDate(this.dateinput.value);
    }

    if (this.dateinput.displayDate && this.platformValue == 'browser') {

      if (this.dateinput.datatype == 'DATETIME') {
        this.dateTimeFormat = this.globalObjects.formatDate(new Date(this.dateinput.displayDate), "yyyy-MM-ddTHH:mm:ss");
        this.dateinput.displayDate = this.globalObjects.formatDate(this.dateTimeFormat, "dd-MMM-yyyy HH:mm:ss");
      }
      else if (this.dateinput.datatype == 'DATE') {
        this.dateinput.displayDate = this.globalObjects.formatDate(new Date(this.dateinput.displayDate), "dd-MMM-yyyy");
      }
      if (!this.processing) {
        this.processing = true;
        this.formatDate(this.dateinput.displayDate);
      }
    }

  }

  // showDateTimepicker(ev) {

  //   if (this.dateinput.item_enable_flag && (this.dateinput.item_enable_flag == 'T')) {
  //     this.datePicker.show({
  //       date: new Date(),
  //       mode: 'datetime',
  //       minDate: this.dateinput.from_value,
  //       maxDate: this.dateinput.to_value,
  //       is24Hour: true,
  //       androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //     }).then(
  //       date => {
  //         this.dateinput.value = "";
  //         var dateVal = "";
  //         dateVal = this.globalObjects.formatDate(date, 'dd-MMM-yyyy HH:mm:ss');
  //         this.dateinput.value = dateVal;
  //         this.onChange();
  //       },
  //       err => {
  //         //console.log('Error occurred while getting datetime: ' + err)
  //       }
  //     );
  //   }
  // }

  // showtimepicker() {

  //   if (this.dateinput.item_enable_flag && (this.dateinput.item_enable_flag == 'T')) {
  //     this.datePicker.show({
  //       date: new Date(),
  //       mode: 'time',
  //       is24Hour: true,
  //       androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
  //     }).then(
  //       date => {
  //         this.dateinput.value = "";
  //         var dateVal = "";
  //         dateVal = this.globalObjects.formatDate(date, 'HH:mm:ss');
  //         this.dateinput.value = dateVal;
  //         this.onChange();
  //       },
  //       err => {
  //         //console.log('Error occurred while getting datetime: ' + err)

  //       }
  //     );
  //   }
  // }
async showDateTimepicker(ev: any) {

  if (
    this.dateinput.item_enable_flag &&
    this.dateinput.item_enable_flag === 'T'
  ) {

    // Save the existing value BEFORE opening picker
    const previousValue = this.dateinput.value;

    console.log('Previous date/time:', previousValue);

    try {

      const result: any = await DatePicker.present({
        mode: 'dateAndTime',

        // If you want picker to open with existing value,
        // use your existing date here.
        date: new Date().toISOString(),

        min: this.dateinput.from_value,
        max: this.dateinput.to_value,

        is24h: true,
        theme: 'dark'
      });

      console.log('DatePicker result:', result);

      // IMPORTANT:
      // Cancel can return {}
      if (
        !result ||
        !result.value
      ) {
        console.log('Cancel clicked');

        // Restore previous value
        this.dateinput.value = previousValue;

        console.log(
          'Restored previous date/time:',
          this.dateinput.value
        );

        return;
      }

      // Only execute this when a REAL date was selected
      console.log('OK clicked:', result);

      const dateVal = this.globalObjects.formatDate(
        result,
        'dd-MMM-yyyy HH:mm:ss'
      );

      // Make sure formatting produced a valid value
      if (dateVal) {
        this.dateinput.value = dateVal;
      } else {
        this.dateinput.value = previousValue;
        return;
      }

      this.onChange();

    } catch (err) {

      console.log('DatePicker cancelled/error:', err);

      // Restore previous value
      this.dateinput.value = previousValue;

      console.log(
        'Restored previous date/time:',
        this.dateinput.value
      );
    }
  }
}

 async showtimepicker() {

    if (this.dateinput.item_enable_flag && (this.dateinput.item_enable_flag == 'T')) {
      // this.datePicker.present({
      //   date: new Date(),
      //   mode: 'time',
      //   is24Hour: true,
      //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      await DatePicker.present({
      mode: 'time',
      date: new Date().toISOString(), // Must be an ISO string, not a Date object
      is24h: true,                    // 'is24Hour' changed to 'is24h'
      theme: 'dark'   
      }).then(
        date => {
          this.dateinput.value = "";
          var dateVal = "";
          dateVal = this.globalObjects.formatDate(date, 'HH:mm:ss');
          this.dateinput.value = dateVal;
          this.onChange();
        },
        err => {
          //console.log('Error occurred while getting datetime: ' + err)

        }
      );
    }
  }


  // getParsedJson(json) {
  //   try {
  //     if (json) {
  //       return JSON.parse(json)
  //     } else {
  //       return {}
  //     }
  //   } catch (err) {
  //     if (typeof json == 'object') {
  //       return json;
  //     } else {
  //       return {}
  //     }
  //   }
  // }

   async showDatepicker(ev) {

    if (this.dateinput.item_enable_flag && (this.dateinput.item_enable_flag == 'T')) {
      // this.datePicker.present({
      //   date: new Date(),
      //   mode: 'date',
      //   minDate: this.dateinput.from_value,
      //   maxDate: this.dateinput.to_value,
      //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      await DatePicker.present({
        mode: 'date',
        min: this.dateinput.from_value,
        max: this.dateinput.to_value, 
        date: new Date().toISOString(), // Must be an ISO string, not a Date object
        is24h: true,                    // 'is24Hour' changed to 'is24h'
        theme: 'dark'  
      }).then(
        date => {
          this.dateinput.value = "";
          var dateVal = "";
          dateVal = this.globalObjects.formatDate(date, 'dd-MMM-yyyy');
          this.dateinput.value = dateVal;

          this.onChange();
        },
        err => {
          //console.log('Error occurred while getting datetime: ', err)
        }
      );
    }
  }
  clear() {
    this.dataService.terminateAllRequest();
    this.runPost = false;
    this.clearValues();


    let index = this.dateinput.itemIndex ? this.dateinput.itemIndex : (this.dateinput.indexCount ? this.dateinput.indexCount : this.dateinput.indexcount);
    this.lhs_lib.go_item(this.dateinput.apps_page_frame_seqid + "." + this.dateinput.item_name, index, true);
  }


  clearValues() {
    this.dateinput.oldValue = "";
    this.dateinput.value = "";
    this.dateinput.displayDate = "";
    this.dateModel1 = {
      "year": null,
      "month": null,
      "day": null,
    };
    this.dateinput.isValid = false;
    this.datetimeModel = new DateTimeModel();


    this.globalObjects.focusArrow = true;
    delete this.dateinput['forcedFocus'];
    // this.events.publish("clearEvent");

    delete this.dateinput['oldValue'];

    // setTimeout(() => {
    // this.validateInput()
    // }, 0.5);
  }

  // Code for android date input start here

  // Code for browser date Input start Here
  onInputChange($event: any) {
    // const value = $event.target.value;
    // if (this.dateinput.datatype == 'DATETIME' || this.dateinput.datatype == 'TIME') {

    //   const dt = DateTimeModel.fromLocalString(value);
    //   if (dt) {
    //     this.datetimeModel = dt;
    //     this.setDateStringModel();
    //   } else if (value.trim() === "") {
    //     this.datetimeModel = new DateTimeModel();
    //     this.dateinput.displayDate = ""
    //     this.dateinput.value = "";
    //     this.onChanges(this.dateinput.displayDate);
    //   } else {
    //     this.onChanges(value);
    //   }

    // } else if (this.dateinput.datatype == 'DATE') {

    //   const dt = DateModel.fromLocalString(value);
    //   if (dt) {
    //     this.dateModel = dt;
    //     this.setDateStringModel();
    //   } else if (value.trim() === "") {
    //     this.dateModel = new DateModel();
    //     this.dateinput.value = "";
    //     this.onChanges(this.dateinput.displayDate);
    //   } else {
    //     this.onChanges(value);
    //   }
    // }

    // this.validateInput();

    if (!$event.target.value) {
      this.clearValues();
    }
    this.formatDate($event.target.value);


  }


  setDateStringModel() {
    var current = new Date();
    if (this.dateinput.datatype == 'TIME' && this.datetimeModel.hour != undefined && this.datetimeModel.minute != undefined) {
      let value = (this.datetimeModel.hour != undefined ? this.datetimeModel.hour : current.getHours()) + ":" + (this.datetimeModel.minute != undefined ? this.datetimeModel.minute : current.getMinutes()) + ":" + (this.datetimeModel.second != undefined ? this.datetimeModel.second : current.getSeconds());
      this.dateinput.displayDate = value
      this.dateinput.value = value;
      this.formatDate(this.dateinput.displayDate);
    }


    // if (!this.firstTimeAssign) {
    //   this.onChanges(this.dateinput.displayDate);
    // } else {
    //   if (this.dateinput.displayDate !== null) {
    //     this.firstTimeAssign = false;
    //   }
    // }
  }

  onDateChange(event, dp: NgbDatepicker) {

    this.calenderFlag = true;

    if (!this.processing) {
      this.processing = true;
      if (this.dateinput.datatype == 'DATETIME' || this.dateinput.datatype == 'TIME') {
        if (this.platformValue == 'browser') {
          const date = new DateTimeModel(event);

          if (!date) {
            // this.dateinput.value = this.dateinput.value;
            this.dateinput.displayDate = this.dateinput.displayDate;
            return;
          }

          if (!this.datetimeModel) {
            this.datetimeModel = date;
          }

          this.datetimeModel.year = date.year;
          this.datetimeModel.month = date.month;
          this.datetimeModel.day = date.day;

          let f: any = [];
          for (let i = 0; i < this.formatMaskArr.length; i++) {
            if (this.formatMaskArr[i].toUpperCase().indexOf('D') > -1) {
              f.push(date.day);
            } else if (this.formatMaskArr[i].toUpperCase().indexOf('M') > -1) {
              f.push(date.month);
            } else if ((this.formatMaskArr[i].toUpperCase().indexOf('Y') > -1) || (this.formatMaskArr[i].indexOf('R') > -1)) {
              f.push(date.year);
            }
          }
          var current = new Date();
          let value = f[0] + "-" + f[1] + "-" + f[2] + " " + (this.datetimeModel.hour ? this.datetimeModel.hour : current.getHours()) + ":" + (this.datetimeModel.minute ? this.datetimeModel.minute : current.getMinutes()) + ":" + (this.datetimeModel.second ? this.datetimeModel.second : current.getSeconds());

          // this.popover.close();
          this.isOpen = false;
          let index = this.dateinput.itemIndex ? this.dateinput.itemIndex : (this.dateinput.indexCount ? this.dateinput.indexCount : this.dateinput.indexcount);
          this.lhs_lib.go_item(this.dateinput.apps_page_frame_seqid + "." + this.dateinput.item_name, index, true);
          this.formatDate(value)

          const adjustedDate = new Date(this.datetimeModel.toString());
          if (this.datetimeModel.timeZoneOffset !== adjustedDate.getTimezoneOffset()) {
            this.datetimeModel.timeZoneOffset = adjustedDate.getTimezoneOffset();
          }
        } else {
          const formattedString = this.dateinput.datatype == 'TIME' ? format(parseISO(event.detail.value), 'kk:mm:ss') : format(parseISO(event.detail.value), 'dd-MM-yyyy kk:mm:ss');
          let value = formattedString;
          // this.popover.close();
          this.isOpen = false;
          let index = this.dateinput.itemIndex ? this.dateinput.itemIndex : (this.dateinput.indexCount ? this.dateinput.indexCount : this.dateinput.indexcount);
          this.lhs_lib.go_item(this.dateinput.apps_page_frame_seqid + "." + this.dateinput.item_name, index, true);
          this.formatDate(value)
        }
      } else {
        if (this.platformValue == 'browser') {
          const date = new DateModel(event);
          if (!date) {
            // this.dateinput.value = this.dateinput.value;
            //this.dateinput.displayDate = this.dateinput.displayDate;
            return;
          }
          if (!this.dateModel) {
            this.dateModel = date;
          }

          this.dateModel1 = {
            "year": date.year,
            "month": date.month,
            "day": date.day
          }

          let f: any = [];
          for (let i = 0; i < this.formatMaskArr.length; i++) {
            if (this.formatMaskArr[i].toUpperCase().indexOf('D') > -1) {
              f.push(date.day);
            } else if (this.formatMaskArr[i].toUpperCase().indexOf('M') > -1) {
              f.push(date.month);
            } else if ((this.formatMaskArr[i].toUpperCase().indexOf('Y') > -1) || (this.formatMaskArr[i].indexOf('R') > -1)) {
              f.push(date.year);
            }
          }

          let value = f[0] + "-" + f[1] + "-" + f[2];
          // this.popover.close();
          this.isOpen = false;
          let index = this.dateinput.itemIndex ? this.dateinput.itemIndex : (this.dateinput.indexCount ? this.dateinput.indexCount : this.dateinput.indexcount);
          this.lhs_lib.go_item(this.dateinput.apps_page_frame_seqid + "." + this.dateinput.item_name, index, true);
          this.formatDate(value)
        } else {
          const formattedString = format(parseISO(event.detail.value), 'dd-MM-yyyy');
          let value = formattedString;
          // this.popover.close();
          this.isOpen = false;
          let index = this.dateinput.itemIndex ? this.dateinput.itemIndex : (this.dateinput.indexCount ? this.dateinput.indexCount : this.dateinput.indexcount);
          this.lhs_lib.go_item(this.dateinput.apps_page_frame_seqid + "." + this.dateinput.item_name, index, true);
          this.formatDate(value);
        }

      }
    }
    // this.setDateStringModel();
  }

  onTimeChange(event: any) {
    let current = new Date();
    this.datetimeModel.hour = ((event.model.hour > 9) ? event.model.hour : 0 + '' + (isNaN(event.model.hour) ? 0 : event.model.hour));
    this.datetimeModel.minute = ((event.model.minute > 9) ? event.model.minute : 0 + '' + (isNaN(event.model.minute) ? 0 : event.model.minute));
    this.datetimeModel.second = ((event.model.second > 9) ? event.model.second : 0 + '' + (isNaN(event.model.second) ? 0 : event.model.second));
    this.setDateStringModel();
    this.validateInput();
  }

  inputBlur($event) {
    this.onTouched();
    // this.validateInput();
  }
  // Code for browser date Input end Here

  validateInput() {
    if ((this.dateinput.data_required_flag && (this.dateinput.data_required_flag == 'T' || (this.dateinput.prompt_name && this.dateinput.prompt_name[this.dateinput.prompt_name.length - 1]) == '*'))) {
      if (this.dateinput.value || this.dateinput.from_value || this.dateinput.to_value) {
        this.dateinput.from_value
        if (this.dateinput.input_pattern) {
        } else {
          this.dateinput.isValid = true;
        }
      } else {
        this.dateinput.isValid = false;
        this.dateinput.vadidateMsg = "Please enter " + this.dateinput.prompt_name;
      }
    } else {
      this.dateinput.isValid = true;
    }

    delete this.dateinput['forcedInvalid'];
    delete this.dateinput['rase'];

    // if (this.dateinput.data_required_flag == 'T' && !this.dateinput.value) {
    //   this.dateinput.isValid = false;
    // } else {
    //   this.dateinput.isValid = true;
    // }

    let dateFromVal = new Date(this.dateinput.from_value).getDate();
    let monthFromVAl = (new Date(this.dateinput.from_value).getMonth() + 1);
    let d1 = ((dateFromVal > 10) ? dateFromVal : '0' + dateFromVal);
    let m1 = ((monthFromVAl > 10) ? monthFromVAl : '0' + monthFromVAl);
    let dateToVal = new Date(this.dateinput.to_value).getDate()
    let monthToVAl = (new Date(this.dateinput.to_value).getMonth() + 1);
    let d2 = ((dateToVal > 10) ? dateToVal : '0' + dateToVal);
    let m2 = ((monthToVAl > 10) ? monthToVAl : '0' + monthToVAl);

    let dateValid = true;
    if (this.dateinput.from_value && this.dateinput.to_value) {
      let currentDate: any = "";
      let fromDate: any = "";
      let toDate: any = "";
      if (this.dateinput.value) {
        currentDate = new Date(this.dateinput.value).getTime();
        fromDate = new Date(this.dateinput.from_value).getTime();
        toDate = new Date(this.dateinput.to_value).getTime();
        if (currentDate < fromDate) {
          dateValid = false;
          this.dateinput.forcedInvalid = true;
          this.dateinput.vadidateMsg = this.dateinput.prompt_name + " Should not be less than " + d1
            + '-' + m1 + '-' + new Date(this.dateinput.from_value).getFullYear() + ".";
        }

        if (currentDate > toDate) {
          dateValid = false;
          this.dateinput.forcedInvalid = true;
          this.dateinput.vadidateMsg = this.dateinput.prompt_name + " Should not be greater than " + d2
            + '-' + m2 + '-' + new Date(this.dateinput.to_value).getFullYear() + ".";
        }
      }
    } else if (this.dateinput.from_value) {
      let currentDate: any = "";
      let fromDate: any = "";
      if (this.dateinput.value) {
        currentDate = new Date(this.dateinput.value).getTime();
        fromDate = new Date(this.dateinput.from_value).getTime();
        if (currentDate < fromDate) {
          dateValid = false;
          this.dateinput.forcedInvalid = true;
          this.dateinput.vadidateMsg = this.dateinput.prompt_name + " Should not be less than " + d1
            + '-' + m1 + '-' + new Date(this.dateinput.from_value).getFullYear() + ".";
        }
      }
    } else if (this.dateinput.to_value) {
      let currentDate: any = "";
      let toDate: any = "";
      if (this.dateinput.value) {
        currentDate = new Date(this.dateinput.value).getTime();
        toDate = new Date(this.dateinput.to_value).getTime();
        if (currentDate > toDate) {
          dateValid = false;
          this.dateinput.forcedInvalid = true;
          this.dateinput.vadidateMsg = this.dateinput.prompt_name + " Should not be greater than " + d2
            + '-' + m2 + '-' + new Date(this.dateinput.to_value).getFullYear() + ".";
        }
      }
    }

    // this.cdr.detectChanges();

    if (!dateValid) {
      this.dateinput.isValid = false;
    } else {
      this.processing = false;
      if (!this.runPost) { } else {
        if (this.globalObjects.focusArrow && !this.isOpen) {
          this.runPost = false;
          this.dateinput.itemClicked = 'post';
          this.emitOnChange.emit(this.dateinput);
        }
      }

    }
    // }
  }

  openDatePicker(pop) {
    this.onFocus();
    this.isOpen ? !this.isOpen : this.isOpen;
  }

  //For dynamic date value change
  dateChange() {
    if (!this.dateinput.value) {
      this.clearValues();
    }
    if (this.processing) {
      this.processing = false;
    } else {
      this.formatDate(this.dateinput.value);
    }
  }

  openIonicDate() {
    this.tableDatetime.open();
  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: this.dateinput.apps_page_frame_seqid,
      item_seq_id: this.dateinput.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.dateinput,
        runEvents: this.dateinput.runEvents
      }
    });
    return await modal.present();
  }

  noClick() {
    // let name = this.dateinput.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
    let index = this.dateinput.indexcount ? this.dateinput.indexcount : (this.dateinput.itemIndex ? this.dateinput.itemIndex : this.dateinput.indexCount);
    // let itm = this.lhs_lib.get_item(name, index, true);
    // if (itm) {
    //   this.lhs_lib.set_frame_config(this.dateinput.apps_page_frame_seqid, 'active_row', this.dateinput.indexcount);
    //   itm.frame_status = 'dirty';
    // }

    if (this.frame) {
      let tableRows = this.lhs_lib.get_rows(this.frame, index, true);
      if (tableRows) {
        this.lhs_lib.make_row_dirty(this.dateinput, tableRows);
        this.frame.active_row = this.dateinput.indexcount;
      }
    }

    this.dateinput.itemClicked = 'pre';
    this.emitPass.emit(this.dateinput);
  }

  onFocus() {
    // 
    // if (!this.globalObjects.focusArrow) {
    //   if (document.activeElement instanceof HTMLElement) {
    //     document.activeElement?.blur();
    //   }
    // }


    if (!this.globalObjects.focusArrow) {
      this.globalObjects.focusedItem = {};
      this.globalObjects.focusedItem.name = this.dateinput.apps_page_frame_seqid + '.' + this.dateinput.item_name;
      this.globalObjects.focusedItem.index = this.dateinput.indexcount;
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement?.blur();
      }
    } else {
      // let name = this.dateinput.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
      // let itm = this.lhs_lib.get_item(name, this.dateinput.indexcount);
      // if (itm) {
      //   itm.frame_status = 'dirty';
      // }

      if (this.frame) {
        let tableRows = this.lhs_lib.get_rows(this.frame, this.dateinput.indexcount);
        if (tableRows) {
          this.lhs_lib.make_row_dirty(this.dateinput, tableRows);
        }
      }

      // this.globalObjects.focusedItem = "";
    }
    this.runPost = true;
  }

  openCalendar(e: Event) {
    if (this.dateinput.item_enable_flag != 'F') {
      if (this.dateinput.value && this.platformValue == 'browser') {
        if (this.dateinput.datatype != 'TIME') {
          let dateModel1 = {
            "year": parseInt(this.dateinput.value.split("-")[2]),
            "month": this.monthArr.indexOf(this.dateinput.value.split("-")[1].toLowerCase()) + 1,
            "day": parseInt(this.dateinput.value.split("-")[0]),
          }

          this.displayValue = dateModel1["year"] + "-" + dateModel1["month"].toString().padStart(2, '0') + "-" + dateModel1["day"].toString().padStart(2, '0');
        }

        if (this.dateinput.datatype == 'DATETIME' || this.dateinput.datatype == 'TIME') {

          this.displayValue = this.dateinput.datatype == 'DATETIME' ? this.displayValue + "T" + this.dateinput.value.split(" ")[1] : this.dateinput.value;
        }
      } else {
        var current = new Date();
        if ((this.dateinput.value == '' || this.dateinput.value == undefined) && (this.dateinput.datatype == 'DATE' || this.dateinput.datatype == 'DATETIME' || this.dateinput.datatype == 'TIME')) {
          this.datetimeModel.hour = current.getHours();
          this.datetimeModel.minute = current.getMinutes();
          this.datetimeModel.second = current.getSeconds();
        }
      }
      // this.popovr.event = e;
      this.isOpen = true;

      this.presentPopover(e);

    }
  }


  async presentPopover(e: Event) {

    if (this.dateinput.from_value && this.dateinput.to_value) {
      let currentDate = new Date(this.dateinput.from_value);
      let todate = new Date(this.dateinput.to_value);
      this.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
      this.maxDate = { year: todate.getFullYear(), month: todate.getMonth() + 1, day: todate.getDate() };
    } else if (this.dateinput.from_value) {
      let currentDate = new Date(this.dateinput.from_value);
      this.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    } else if (this.dateinput.to_value) {
      let currentDate = new Date(this.dateinput.to_value);
      this.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    }


    const popover = await this.popoverController.create({
      component: DatePopupPage,
      id: 'date-popover',
      event: e,
      showBackdrop: false,
      componentProps: {
        platformValue: this.platformValue,
        dateinput: this.dateinput,
        dateModel1: this.dateModel1,
        minDate: this.minDate,
        maxDate: this.maxDate,
        datetimeModel: this.datetimeModel,
        seconds: this.seconds,
        hourStep: this.hourStep,
        minuteStep: this.minuteStep,
        secondStep: this.secondStep,
        displayValue: this.displayValue
      }
    });

    await popover.present();

    await popover.onDidDismiss().then((res) => {
      if (res.data && res.data.type == 'dateChange') {
        if (res.data.tp) {
          this.onTimeChange(res.data.tp);
        }

        // let name = this.dateinput.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
        let index = this.dateinput.itemIndex ? this.dateinput.itemIndex : (this.dateinput.indexCount ? this.dateinput.indexCount : this.dateinput.indexcount);
        // let itm = this.lhs_lib.get_item(name, index);
        // if (itm) {
        //   itm.frame_status = 'dirty';
        // }
        if (this.frame) {
          let tableRows = this.lhs_lib.get_rows(this.frame, index);
          if (tableRows) {
            this.lhs_lib.make_row_dirty(this.dateinput, tableRows);
          }
        }

        this.onDateChange(res.data.ev, res.data.dp);
      }

      if (res.data && res.data.type == 'timeChange') {
        // let name = this.dateinput.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
        let index = this.dateinput.itemIndex ? this.dateinput.itemIndex : (this.dateinput.indexCount ? this.dateinput.indexCount : this.dateinput.indexcount);
        // let itm = this.lhs_lib.get_item(name, index);
        // if (itm) {
        //   itm.frame_status = 'dirty';
        // }

        if (this.frame) {
          let tableRows = this.lhs_lib.get_rows(this.frame, index);
          if (tableRows) {
            this.lhs_lib.make_row_dirty(this.dateinput, tableRows);
          }
        }
        this.onTimeChange(res.data.tp);
      }

      if (!res.data && this.dateinput.datatype == 'TIME') {
        this.dChange()
        // let name = this.dateinput.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
        let index = this.dateinput.itemIndex ? this.dateinput.itemIndex : (this.dateinput.indexCount ? this.dateinput.indexCount : this.dateinput.indexcount);
        // let itm = this.lhs_lib.get_item(name, index);
        // if (itm) {
        //   itm.frame_status = 'dirty';
        // }

        if (this.frame) {
          let tableRows = this.lhs_lib.get_rows(this.frame, index);
          if (tableRows) {
            this.lhs_lib.make_row_dirty(this.dateinput, tableRows);
          }
        }
        this.onTimeChange(this.globalObjects.timeData);
        this.globalObjects.timeData = null;
      }

    })

  }


  async dismiss() {
    this.isOpen = false;
    this.setDateStringModel();
  }
  getParsedJson(json) {
    // this.globalObjects.getParsedJson(json)
    if (!json) {
      return {}
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


  dChange() {
    this.isOpen = false;
  }


  formatDate(value) {
    this.globalObjects.formatDate2(value, this.dateinput).then(() => {
      if ((this.dateinput.isValid || !this.dateinput.value)) {
        this.processing = false;
        if (!this.runPost) { } else {
          if (this.globalObjects.focusArrow && !this.isOpen) {
            this.runPost = false;
            this.dateinput.itemClicked = 'post';
            this.emitOnChange.emit(this.dateinput);
          }
        }
      }
    });
    // this.validateInput();
  }

  cdEngineCall(isRegister: boolean) {
    let id = this.dateinput.apps_item_seqid + '_' + this.dateinput.indexcount+'#'+this.frameSeqId;
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
