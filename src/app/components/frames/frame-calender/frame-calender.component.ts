import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild,EventEmitter, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { CalendarComponent, CalendarMode } from 'ionic2-calendar/calendar';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-calender',
  templateUrl: './frame-calender.component.html',
  styleUrls: ['./frame-calender.component.scss'],
})
export class FrameCalenderComponent implements OnInit,OnDestroy {

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  filterFormData: any = [];
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  item_slno_count: number = 1;
  userDetails: any;
  current_page_parameter: any = {};
  collapseCard: boolean = false;
  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  minDate = new Date().toISOString();
  eventSource = [];
  viewTitle = [];
  eventarray = [];
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  
  
  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string,
    private globalObjects: GlobalObjectsService, private dataService: DataService, public events: Events, private lhs_lib:LhsLibService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.events.subscribe("reloadCal",() => {
      this.ngOnInit();
    })
    this.events.subscribe("runcalender", () => {
      this.ngOnInit();
    })
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-calender-frame")
    }
  }

  ngOnDestroy(): void {
    let bullName = "wmaBultins" + this.frame.apps_page_frame_seq_id;
    this.events.unsubscribe(bullName);
    this.events.unsubscribe("reloadCal")
  }

  ngOnInit() {
    let bullName = "wmaBultins" + this.frame.apps_page_frame_seq_id;
    this.events.unsubscribe(bullName);
    this.events.subscribe(bullName, res => {
      if(res.evFlag == "T"){
        res.evFlag = "F";
        this.parseBuiltins(res.key);
      }
    })
	
	  this.parseBuiltins(0);
    
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this.event.startTime = ""


    let frameFilterFlag = this.frame.frame_filter_flag;

    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }


        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {
          theaddata.push(itemMast.prompt_name);
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }
  }
  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  // Create the right event format and reload source
  addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }

    for (let x of this.frame.tableRows) {
      for (let y of x) {
        if (y.Level5[0].item_name == "TASK_DATE") {
          this.event.endTime = y.Level5[0].value;  
        }
        if (y.Level5[0].item_name == "ENTRY_DATE") {
          this.event.startTime = y.Level5[0].value;
        }
        if (y.Level5[0].item_name == "TASK_CATG") {
          this.event.desc = y.Level5[0].value
          eventCopy.desc = y.Level5[0].value;
        }
        if (y.Level5[0].item_name == "TASK_TYPE") {
          this.event.title = y.Level5[0].value
          eventCopy.title = y.Level5[0].value;
        }
      }

    }
    eventCopy = {
      title: this.event.title,
      startTime: new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;

      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }

    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
  }
  
  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();

  }
  onchange(event){
    this.calendar.currentDate = new Date(event);
  }
  clickevent(){
  }
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  
  async onEventSelected(event) {
    this.eventarray.push(event);

    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  // Time slot was clicked
  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  parseBuiltins(i){
    let builtinsArr = [];
    if(this.frame.on_frame_load_str && this.frame.on_frame_load_str.indexOf(";") > -1){
      builtinsArr = this.frame.on_frame_load_str.split(";");
    }else{
      builtinsArr[0] = this.frame.on_frame_load_str;
    }

    if(builtinsArr[i]){
      this.executeBuiltins(builtinsArr[i],i);
    }else{
      this.populateDataFromJson();
    }
  }

  executeBuiltins(service_type,key){
    if(service_type == "itemwise_sql_populate_data" || service_type == "item_frame_sql_populate_data" || service_type == "execute_query" || service_type == "frame_sql_populate_data"){
      this.getData(service_type,key)
    }else{
      if(service_type){
        this.globalObjects.bulitinsEvent(service_type, key, this.frame.apps_page_frame_seqid,this.frame.on_frame_load_str);
      }
    }
  }

  getData(service_type?,bull_Key?) {
    let wscp: any = {};
      wscp.object_code = this.frame.object_code;
      wscp.service_type = service_type ? service_type : this.frame.on_frame_load_str ;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        this.frame.tableRows = tableRows;
       this.getframeevent();
  }
  this.parseBuiltins(bull_Key + 1);
    }).catch(err => {
      this.parseBuiltins(bull_Key + 1);
      
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
    })
  
  }

  getframeevent(){

      let framearray=[];
      framearray=this.frame.tableRows;
     this.eventSource=[];
      let eventCopy1 = {
        title: '',
        startTime: '',
        endTime: '',
        allDay: this.event.allDay,
        desc: ''
      }
      
      for (let x of framearray) {
        for (let y of x) {  
          if (y.Level5[0].item_name == "TASK_DATE") {
          eventCopy1.endTime = y.Level5[0].value;  
          }
          if (y.Level5[0].item_name == "ENTRY_DATE") {
          eventCopy1.startTime = y.Level5[0].value;
          }
          if (y.Level5[0].item_name == "TASK_CATG") {
            eventCopy1.desc = y.Level5[0].value;
          }
          if (y.Level5[0].item_name == "TASK_TYPE") {
            eventCopy1.title = y.Level5[0].value;
          }
          
        }

      let  eventCopy = {
          title: eventCopy1.title,
          startTime: new Date(eventCopy1.startTime),
          endTime: new Date(eventCopy1.endTime),
          allDay: eventCopy1.allDay,
          desc: eventCopy1.desc
        }
          this.eventSource.push(eventCopy);
      }
    this.myCal.loadEvents();
   
  }


  PostTextValidatePlsql(event, rowindex) {

    let wscp: any = {};
    wscp.service_type = "PostTextValidatePlsql";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    wscp.apps_item_seqid = event.apps_item_seqid;
    wscp.apps_page_no = event.apps_page_no;
    wscp.object_code = event.object_code;

    var inputData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, inputData).then(res => {
      
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let keyValue = data.responseData;
        if (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q") {
          if (objData.Level1[0].message) {
            alert(objData.Level1[0].message);
          }
          this.globalObjects.clickedbutton = false;
          for (let itemGroup of this.frame.tableRows[rowindex]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (objData.Level1[0].item_name == item.item_name) {
                  item.value = "";
                  item.codeOfValues = "";
                }
              }
            }
          }
        } else if (objData.Level1[0].status == "L") {
          sessionStorage.setItem("PLSQL_L", objData.Level1[0].message);
        } else if (objData.Level1[0].status == "T") {
        } else {
          objData.Level1[0].status = "Q";
          this.globalObjects.clickedbutton = false;
        }
      }

    }).catch(err => {
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
    })

  }

  async populateDataFromJson() {
    if (this.globalObjects.allFrameJsonData.length > 0) {
      let i = 0;
      let index;
      for (let g of this.globalObjects.allFrameJsonData) {
        if ((g.frame_name == this.frame.apps_page_frame_seqid || (this.frame.frame_alias ? (g.frame_name ? g.frame_name.toLowerCase() : g.frame_name) == this.frame.frame_alias.toLowerCase() : false))) {
          index = i;
          for (let p of g.paraData) {

            

            if(p.paraType == 'IV'){
              for(let i of p.frameData){
                let str = "";
                let val = [];
                 let rowIndex = i.key;

                for(let im of i.items){
                  str = str + im.item_name + ",";
                  val.push(im.para_value);
                }

                let valObj = {
                  rowData:val,
                  pageNo:this.frame.apps_page_no
                }
                let itemName = g.frame_name + "[" + str + "]";
                this.lhs_lib.set_row_values(itemName,valObj,rowIndex);

              }
            }

            if(p.paraType == 'SC'){
              for(let i of p.frameData ){
                for (let im of i.items) {
                  let name = g.frame_name + "." + im.item_name;
                  let index = i.key;
                  this.lhs_lib.set_item_config(name,im.para_name,im.para_value,index);
                }
              }
            }

            if (p.paraType == 'FSC') {
              for (let i of p.frameData) {
                for (let im of i.items) {
                  this.lhs_lib.set_frame_config(im.frame_name,im.para_name,im.para_value);
                }
              }
            }
          }
        }
     i++
      }
      this.globalObjects.allFrameJsonData.splice(index,1);
    }

    if (!this.frame.tableRows || this.frame.tableRows.length <= 0) {
      let indexcount: number = -1;
      let tableRows = [];
      indexcount++;
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          item.indexcount = JSON.parse(JSON.stringify(indexcount));
        }
      }
      tableRows.push(frameLevel4);

      this.frame.tableRows = tableRows;
    }
   
  }

  onSubmit(form) {
    this.globalObjects.presentAlert(form.form.valid)
  }

}
