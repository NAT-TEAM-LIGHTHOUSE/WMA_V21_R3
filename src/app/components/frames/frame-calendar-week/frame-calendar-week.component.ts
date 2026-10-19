import { Subject } from "rxjs";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from "src/app/services/global-objects.service";
import { DataService } from "src/app/services/data.service";
import { Events } from "src/app/services/events";
import { LhsLibService } from "src/app/services/lhs-lib.service";
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { colors } from "src/app/demo-utils/colors";
import { applyLoggingDecorator } from "src/app/services/decorator-application";
import { STANDALONE_IMPORTS } from "src/app/shared_modules/ionic.imports";



@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-calendar-week',
  templateUrl: './frame-calendar-week.component.html',
  styleUrls: ['./frame-calendar-week.component.scss'],
})
export class FrameCalendarWeekComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  view: string = 'month';
  calenderData: any = [];
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  eventss: any = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      // actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      // actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      // actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ]
  actions: CalendarEventAction[] = [
    {
      label: '<img height="22px"  padding-left="10px" src="./../assets/imgs/edit.png">',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<img height="22px"  padding-left="10px" src="./../assets/imgs/delete.png">',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.eventss = this.eventss.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];


  modalData: {
    action: string;
    event: CalendarEvent;
  };
  elevants: any = [];
  developerModeData: any;
  userDetails: any;
  activeDayIsOpen: boolean = true;
  constructor(public globalservice: GlobalObjectsService, private dataService: DataService, private events: Events, private lhs_lib: LhsLibService) {
    this.userDetails = this.globalservice.getLocallData("userDetails");
    if(this.globalservice.frameFlag){
      return applyLoggingDecorator(this,"frame-calender-week-frame")
    }
  }

  ngOnInit() {
    //console.log(subDays(startOfDay(new Date()), 1));
    //console.log( addDays(new Date(), 1),);
    //console.log(addHours(new Date(), 2));
    this.getData();

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }



  getData() {
    let wscp: any = {};

    wscp.service_type = this.frame.on_frame_load_str ? (this.frame.on_frame_load_str.includes(";") ? this.frame.on_frame_load_str.split(";")[0] : this.frame.on_frame_load_str) : "";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    //wscp.service_type = "get_populate_data";
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    // wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {

      this.globalservice.hideLoading();
      let data: any = res;
      this.calenderData = [];
      this.elevants = [];
      //console.log("data response", data.responseStatus)
      if (data.responseStatus == "success") {
        // Developer Mode Loging
        if (data.responseData.Level1_Keys.length > 0) {
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          };
        }
        //Developer Mode Loging
        let trows = [];
        let objData = this.globalservice.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = Object.keys(tableData[0])

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
          // this.elevants = frameLevel4[0].apps_page_frame_seqid;
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                  item.value = table[key]
                }
              }
            }
          }
          trows.push(frameLevel4);
        }
        this.calenderData = trows;
        this.frame.tableRows = trows;
        this.frame.object_code = "";
        //console.log(" this.frame.tableRows", this.calenderData)
        for (let datedesc of this.calenderData) {
          let objevent: any = {
            start: 0,
            end: 0,
            title: '',
            color: colors.yellow,
            actions: this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
          }
          let datedesccopy = JSON.parse(JSON.stringify(datedesc));
          for (let objectOfdate of datedesccopy) {
            //  //console.log(objectOfdate.Level5[0])
            if (objectOfdate.Level5[0].item_name == 'START_DATE') {
              let da = startOfDay(new Date(objectOfdate.Level5[0].value));
              objevent.start = da;
            }
            if (objectOfdate.Level5[0].item_name == 'END_DATE') {
              let da2 = endOfDay(new Date(objectOfdate.Level5[0].value));
              objevent.end = da2;
            }

            if (objectOfdate.Level5[0].item_name == 'TITLE') {
              objevent['title'] = objectOfdate.Level5[0].value;
            }

          }
          objevent['lhsitem'] = datedesccopy;
          this.elevants.push(objevent);
        }
      }
    }).catch(err => {
      this.globalservice.hideLoading();
      this.globalservice.presentToast("1.5 Something went wrong please try again later!");
    })

  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next(event);
  }
  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    if (action == 'Clicked') {
      let framerows = event['lhsitem'];
      for (let rows of framerows) {
        if (rows.Level5[0].item_name == 'TITLE') {
          this.emitPass.emit(rows.Level5[0]);
          break;
        }
      }

    }
    if (action == 'Edited') {

    }
    if (action == 'Deleted') {

    }
    //console.log(event);
    //  alert(JSON.stringify(this.modalData))
  }

  async populateDataFromJson() {


    if (this.globalservice.allFrameJsonData.length > 0) {
      for (let g of this.globalservice.allFrameJsonData) {
        if ((g.frame_name == this.frame.apps_page_frame_seqid || (this.frame.frame_alias ? (g.frame_name ? g.frame_name.toLowerCase() : g.frame_name) == this.frame.frame_alias.toLowerCase() : false))) {
          for (let p of g.paraData) {



            if (p.paraType == 'IV') {
              for (let i of p.frameData) {
                let str = "";
                let val = [];
                // let rowIndex = i.key ? i.key-1 : 0;
                // let rowIndex = i.key ? i.key : 0;
                // let rowIndex = i.key ? parseInt(i.key)-1 : 0;
                let rowIndex = i.key;

                for (let im of i.items) {
                  str = str + im.item_name + ",";
                  val.push(im.para_value);
                }

                let valObj = {
                  rowData: val,
                  pageNo: this.frame.apps_page_no
                }
                let itemName = g.frame_name + "[" + str + "]";
                this.lhs_lib.set_row_values(itemName, valObj, rowIndex);

              }
            }

            if (p.paraType == 'SC') {
              for (let i of p.frameData) {
                for (let im of i.items) {
                  let name = g.frame_name + "." + im.item_name;
                  // let index = im.row_slno ? parseInt(im.row_slno) - 1 : 0;
                  let index = i.key;
                  this.lhs_lib.set_item_config(name, im.para_name, im.para_value, index);
                }
                // this.lhs_lib.set_rows_source_config(g.frame_name, i.items, 0);
              }
            }

            if (p.paraType == 'FSC') {
              for (let i of p.frameData) {
                //console.log(i);

                for (let im of i.items) {
                  this.lhs_lib.set_frame_config(im.frame_name, im.para_name, im.para_value);
                }
                // this.lhs_lib.set_rows_source_config(g.frame_name, i.items, 0);
              }
            }


          }
        }
      }
    }

    //   if(this.frame.apps_page_frame_seqid.indexOf("PARA") > -1){
    //     this.events.publish("setVal");
    //  }
    // let tableData = [];
    // for (let g of this.globalObjects.allFrameJsonData) {
    //   if (g.paraType == 'IV') {
    //     for (let p of g.paraData) {
    //       if ((this.frame.apps_page_frame_seqid == p.frame_name) || (this.frame.frame_alias == p.frame_name)) {
    //         tableData = p.frameData;
    //         this.jsonTableData = p.frameData;
    //       }
    //     }
    //   }
    // }
    // if(tableData.length > 0){

    //   for (let t of tableData) {
    //     let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    //     for (let itemGroup of frameLevel4) {
    //       for (let item of itemGroup.Level5) {

    //         for (let i of t.items) {
    //           if (item.item_name.toUpperCase() == i.item_name.toUpperCase()) {
    //             item.value = i.para_value
    //           }
    //         }
    //       }
    //     }
    //     this.tableRows.push(frameLevel4);
    //   }
    //   this.frame.tableRows = this.tableRows;
    //   //console.log(tableData);
    // }

    //this.events.publish("setVal");

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

}
