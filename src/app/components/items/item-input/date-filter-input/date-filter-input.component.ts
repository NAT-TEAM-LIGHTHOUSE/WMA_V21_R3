import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { AngularMyDatePickerDirective, IAngularMyDpOptions, IMyDateModel, IMyDate } from 'angular-mydatepicker';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DatePicker } from '@capacitor-community/date-picker';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports: [STANDALONE_IMPORTS],
  selector: 'app-date-filter-input',
  templateUrl: './date-filter-input.component.html',
  styleUrls: ['./date-filter-input.component.scss'],
})
export class DateFilterInputComponent implements OnInit {
  @ViewChild('dp1') myDp1: AngularMyDatePickerDirective;
  @ViewChild('dp2') myDp2: AngularMyDatePickerDirective;
  myDatePickerOptions1: IAngularMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    dateRange: false,
    
}
myDatePickerOptions2: IAngularMyDpOptions = {
  dateFormat: 'dd/mm/yyyy',
  dateRange: false,
  
}
  @Input() frame_type: any;
  @Input() dateinput: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  selectdate: any ;
  dropdownvalue: any;
  platformValue: any;
  dropdownList: any = [];
  ddDataList: any = [];
  customDateVar:any;
  dropDownDefoultItem: any ;
  flagfor
  public val1: any ;
  public val2: any ;
  public val1from: any ;
  public val2to: any ;


  constructor(public datepipe: DatePipe, private dataService: DataService,private events:Events,
   public globalservice: GlobalObjectsService ,public platform:Platform,
     private cdr: ChangeDetectorRef) {
      if(this.globalservice.itemFlag){
        return applyLoggingDecorator(this,"date-filter-input")
      }
      }

  ngOnInit() {
    this.dateinput.value="";
    if(this.dateinput.item_filter_flag=='FDT' && this.dateinput.canvasflag && this.dateinput.canvasflag==true){
      let foronlycanvasfilter="Custom Date";
      this.dropDownDefoultItem = foronlycanvasfilter;
    }else{
      this.dateinput.canvasflag=false;
      let data = this.dateinput.item_default_value ? this.dateinput.item_default_value.split('~') : '';
      this.dropDownDefoultItem = data!='' ? data[0] : '';
    
   
   
    if(this.dateinput.tool_tip =='DT'){
      this.dateinput.temp_from_date="";
      this.dateinput.temp_to_date="";
      this.dateinput.temp_from_date = data!='' ?this.globalservice.formatDate(data[1], 'dd-MMM-yyyy hh-mm-ss') : '';
      this.dateinput.temp_to_date = data!='' ? this.globalservice.formatDate(data[2], 'dd-MMM-yyyy hh-mm-ss') : '';
    }else{
      if(this.platform.is('android')){
        this.platformValue="android";
        this.dateinput.temp_from_date = data!='' ?this.globalservice.formatDate(data[1], 'dd-MMM-yyyy') : '';
        this.dateinput.temp_to_date = data!='' ? this.globalservice.formatDate(data[2], 'dd-MMM-yyyy') : '';
      }
      else if(this.platform.is('ios')){
        this.platformValue="ios";
        this.dateinput.temp_from_date = data!='' ?this.globalservice.formatDate(data[1], 'dd-MMM-yyyy') : '';
        this.dateinput.temp_to_date = data!='' ? this.globalservice.formatDate(data[2], 'dd-MMM-yyyy') : '';
      }
      else{
        this.platformValue="browser";
        let d1 = this.globalservice.formatDate(data[1], 'yyyy-MM-dd');
        let d2 = this.globalservice.formatDate(data[2], 'yyyy-MM-dd');
        this.val1={isRange: false, singleDate: {jsDate: new Date(d1)}};
        this.val2={isRange: false, singleDate: {jsDate: new Date(d2)}};
        this.dateinput.temp_from_date = data!='' ?this.globalservice.formatDate(this.val1, 'dd-MMM-yyyy') : '';
        this.dateinput.temp_to_date = data!='' ? this.globalservice.formatDate(this.val2, 'dd-MMM-yyyy') : '';
  
      }}
     
    }
    if(this.dateinput.item_default_value=="BETWEEN_NUMBER"){
      this.dateinput.from_date = "";
      this.dateinput.to_date = "";
    }
    
    this.current_page_parameter = this.globalservice.current_page_parameter;
  
    this.dateinput.dateType = "=";
  
    this.getDateFilterParam();
  }


  toggleCalendar1(): void {
    if(this.dateinput.item_enable_flag =="T"){

      // this.cdr.detectChanges();
      this.myDp1.toggleCalendar();
    }
   
  }
  
  toggleCalendar2(): void {
    if(this.dateinput.item_enable_flag =="T"){

      // this.cdr.detectChanges();
      this.myDp2.toggleCalendar();
    }
   
  }
  onChange(onChange) {
      this.emitOnChange.emit(this.dateinput)
  }


  codeSelected() {
    this.dateinput.from_date = this.getDateData(this.selectdate, "FROM_DATE");
    this.dateinput.to_date = this.getDateData(this.selectdate, "TO_DATE");
    this.dateinput.filter_type = this.selectdate;
  }

 async openfromdate() {
    if (this.dateinput.item_enable_flag && (!(this.dateinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.dateinput.item_enable_flag == 'T'))) {
      if (this.selectdate == this.customDateVar) {
        this.dateinput.from_date = null;
        // this.datePicker.show({
        //   date: new Date(),
        //   mode: 'date',
        //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        await DatePicker.present({
          date: new Date().toISOString() ,
          mode: 'date',
           theme: 'dark'
        }).then(
          date => {
            this.dateinput.value = "";
            var dateVal = "";
            var frmDate = "";
            
            dateVal = this.globalservice.formatDate(date, 'dd-MMM-yyyy');
            this.dateinput.from_date = dateVal;
            this.dateinput.value = dateVal;
          },
          err => {
          }
        );

      }
    }
  }

 async opentodate() {

    if (this.dateinput.item_enable_flag && (!(this.dateinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.dateinput.item_enable_flag == 'T'))) {
      if (this.selectdate == this.customDateVar) {
      this.dateinput.to_date = null;
      // this.datePicker.show({
      //   date: new Date(),
      //   mode: 'date',
      //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      await DatePicker.present({
          date: new Date().toISOString() ,
          mode: 'date',
           theme: 'dark'
      }).then(
        date => {
          this.dateinput.value = "";
          var dateVal = "";
          dateVal = this.globalservice.formatDate(date, 'dd-MMM-yyyy');
          this.dateinput.value = dateVal;
          this.dateinput.to_date = dateVal;

        },
        err => 
        {
        }
      );
      }
    }

  }

 async openToDateTime(){
    if (this.dateinput.item_enable_flag && (!(this.dateinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.dateinput.item_enable_flag == 'T'))) {
      if (this.selectdate == this.customDateVar) {
      this.dateinput.to_date = null;
      // this.datePicker.show({
      //   date: new Date(),
      //   mode: 'datetime',
      //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
       await DatePicker.present({
        date:new Date().toISOString(),
        mode:'dateAndTime',
          theme: 'dark'
      }).then(
        date => {
          this.dateinput.value = "";
          var dateVal = "";
          dateVal = this.globalservice.formatDate(date, 'dd-MMM-yyyy HH:mm:ss');
          this.dateinput.value = dateVal;
          this.dateinput.to_date = dateVal;

        },
        err => {
        }
      );
      }
    }
  }


  async openFromDateTime(){
    if (this.dateinput.item_enable_flag && (!(this.dateinput.item_enable_flag.indexOf(this.current_page_parameter.MODE) > -1) || (this.dateinput.item_enable_flag == 'T'))) {
      if (this.selectdate == this.customDateVar) {
        this.dateinput.from_date = null;
        // this.datePicker.show({
        //   date: new Date(),
        //   mode: 'datetime',
        //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        await DatePicker.present({
          date:new Date().toISOString(),
          mode:'dateAndTime',
          theme: 'dark'
        }).then(
          date => {
            this.dateinput.value = "";
            var dateVal = "";
            var frmDate = "";
            
            dateVal = this.globalservice.formatDate(date, 'dd-MMM-yyyy HH:mm:ss');
            this.dateinput.from_date = dateVal;
            this.dateinput.value = dateVal;
          },
          err => {
          }
        );

      }
    }
  }
  

  dateChanged(value) {
    if (value) {
      this.dateinput.value = this.globalservice.formatDate(value, 'dd-MMM-yyyy');
    } else {
      this.dateinput.value = null;
    }

  }

  toDateChanged(temp_date) {
    if (temp_date) {
      if(this.dateinput.tool_tip=='DT'){
        this.dateinput.to_date = this.globalservice.formatDate(temp_date, 'dd-MMM-yyyy HH:mm:ss');
      }else{
        if( this.platformValue=="browser"){
          let tmpDate =  temp_date.singleDate.date['month']  +'-'+ temp_date.singleDate.date['day'] +'-'+ temp_date.singleDate.date['year']
          let date = this.globalservice.formatDate(tmpDate, 'dd-MMM-yyyy');
          this.dateinput.to_date=date;

        }else{
          this.dateinput.to_date = this.globalservice.formatDate(temp_date, 'dd-MMM-yyyy');
        }
       
      }
    } else {
      this.dateinput.to_date = null;
    }
  }

  fromDateChanged(temp_date) {
       
    if (temp_date) {
      if(this.dateinput.tool_tip=='DT'){
        this.dateinput.from_date = this.globalservice.formatDate(temp_date, 'dd-MMM-yyyy HH:mm:ss');
      }else{
        if( this.platformValue=="browser"){
          let tmpDate =  temp_date.singleDate.date['month']  +'-'+ temp_date.singleDate.date['day'] +'-'+ temp_date.singleDate.date['year']
          let date = this.globalservice.formatDate(tmpDate, 'dd-MMM-yyyy');
          this.dateinput.from_date = date;
        }else{

          this.dateinput.from_date = this.globalservice.formatDate(temp_date, 'dd-MMM-yyyy');
        }
      }
    } else {
      this.dateinput.from_date = null;
    }
  }

  getDateFilterParam() {
    let url = "getDateFilterParam";
   
    this.dataService.getData(url).then(res => {
      let ddLList = [];
      let count:number=0;
      let data: any = res;
      this.ddDataList = data.responseData;
      let dropdownData = data.responseData;
      if (dropdownData.length > 0) {
        for (let d of dropdownData) {
          let dd: any = {};
          dd.value = d.SEQ;
          dd.name = d.PERIOD_TYPE;
          ddLList.push(dd);
          count++;
          if(d.FROM_DATE == null && d.TO_DATE == null){
            this.customDateVar=count;
            
          }
        }
        this.dropdownList = ddLList;
        this.dropdownList.filter((item)=>{
          if(item.name == this.dropDownDefoultItem){
            this.selectdate = item.value;
          }
        })
      }
    })
  }

  getDateData(key, mode) {
    if (key) {
      if (this.ddDataList.length > 0) {
        for (let d of this.ddDataList) {
          if (d.SEQ == key) {
            if (mode == 'FROM_DATE') {
              return d.FROM_DATE;
            }
            if (mode == 'TO_DATE') {
              return d.TO_DATE;
            }
          }
        }
      }
    }
  }

}
