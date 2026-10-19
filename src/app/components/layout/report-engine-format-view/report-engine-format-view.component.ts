import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { AngularMyDatePickerDirective, IAngularMyDpOptions } from 'angular-mydatepicker';
import { timeStamp } from 'console';
import { ApexSearchPipe } from 'src/app/pipes/apex-search.pipe';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS,NgSelectModule],
  selector: 'app-report-engine-format-view',
  templateUrl: './report-engine-format-view.component.html',
  styleUrls: ['./report-engine-format-view.component.scss'],
  providers: [DatePipe],
})
export class ReportEngineFormatViewComponent implements OnInit {

  @ViewChild('ngSelect') ngSelect: NgSelectComponent;
  @ViewChild('dp') myDp: AngularMyDatePickerDirective;
  @Output() viewByColumn: any = new EventEmitter<any>();
  @Output() columnFilter: any = new EventEmitter<any>();
  @Output() groupBy: any = new EventEmitter<any>();
  @Output() controlBr: any = new EventEmitter<any>();
  @Output() aggregate: any = new EventEmitter<any>();
  @Output() clearAll: any = new EventEmitter<any>();

  @Output() emitPass: any = new EventEmitter<any>();

  frame: any;
  columnData: any = [];
  // allitem: any;
  newRow = [];

  // allitem:any=[];
  @Input() reportEngineData: any = [];

  databack: any = [];
  @Input() shuffle;
  isDatePickerOpen = false;


  operators: any = ['=', '>', '<', '>=', '<=', '<>', 'is null', 'is not null', 'like', 'not like', 'in', 'not in', 'begin with', 'end with'];

  selectedDate: string | null = null;
  formattedDate: string | null = '';

  constructor(public popOverCtrl: PopoverController, public pipemys: ApexSearchPipe, private datePipe: DatePipe, private modalService: NgbModal,
    private cdr: ChangeDetectorRef, public globalObjects: GlobalObjectsService, private modalGlobal: CanvasModalService, private lhslib: LhsLibService) {
    if (this.globalObjects.layoutFlag) {
      return applyLoggingDecorator(this, "report-engine-format-view")
    }
  }


  ngOnInit() {

    this.frame = this.lhslib.get_frame_config('ADV_FILTER');
    let frame = this.lhslib.get_frame_config('All_COL');
    if (frame) {
      for (let frameData of frame.Level4) {
        for (let tableData of frameData.Level5) {
          if (tableData.prompt_name) {
            if (!tableData.item_name.includes("WMA_")) {
              this.columnData.push(tableData);
            }
          }
        }
      }
    }
    // console.log(this.columnData);



    if (this.frame.tableRows) {
      for (let framedata of this.frame.tableRows) {
        for (let data of framedata) {
          for (let item of data.Level5) {
            console.log(item.item_db_name);
            if (item.item_db_name == "FILTER_CLAUSE") {
              item.newdatatype = item.datatype;
            }
          }
        }
      }
      this.frame.previuseTableRows = JSON.parse(JSON.stringify(this.frame.tableRows))
      console.log(this.frame.tableRows)
    }
    // let dispColFrame = this.lhslib.get_frame_config('DISP_COL');
    // if(dispColFrame.iskeyFIlterFlagDataToggle){
    //   this.addKeyFilterFlag()
    // }
   
  }

  setDate(datas, value) {
    let datevalue = this.globalObjects.formatDate(value, "dd-MMM-yyyy");
    datas.value = datevalue;
    console.log(datevalue);
  }

  onPopoverDismiss(item: any) {
    item.isOpen = false;
    item.event = null;
  }
  onDateChange(ev, item, dp?) {
    item.value = this.globalObjects.formatDate(ev.year + "-" + ev.month + "-" + ev.day, "dd-MMM-yyyy");
    item.isOpen = false
  }



  openDatePickerModal() {
    const modalRef = this.modalService.open('datePickerModal', { centered: true });
  }

  // presentPopover(e, item) {
  //   this.popover.event = e;
  //   item.isOpen = true;
  // }
  presentPopover(event: Event, item: any) {
    item.isOpen = true;
    item.event = event;
  }


  openDatePicker() {
    this.isDatePickerOpen = true;
  }

  closeDatePicker() {
    this.isDatePickerOpen = false;
  }

  // onDateChange(event: any) {
  //   const date = new Date(event.detail.value);
  //   this.formattedDate = this.datePipe.transform(date, 'dd MMM yyyy');
  // }

  confirmDate() {
    this.closeDatePicker();
  }
  head = []



  openLovAdvFil(itemName, btn, frame, i) {



    frame.active_row = i;

    console.log("adv fil ", this.frame);
    let allitem = this.lhslib.get_item('all_col.' + itemName, 0);
    let item = this.lhslib.get_item('adv_filter.FILTER_CLAUSE', i);

    if (item) {
      item.displayReportEngineFlag = false;
      if (allitem) {
        item.lov_code = allitem.lov_code;

        /***** added  this line to set only on particular frame item not all item*/
        let str = allitem.lov_return_column_str;
        item.lov_return_column_str = str ? str.toLowerCase().replaceAll(":all_col.", ":adv_filter.") : "";
        /***** added  this line to set only on particular frame item not all item*/



        // item.lov_return_column_str = allitem.lov_return_column_str;
        // item.datatype = allitem.datatype;
        // item.click_events_str = allitem.click_events_str ? allitem.click_events_str : "open_multi_lov();";
        item.itemClicked = "pre";
        if (btn == "EQ") {
          if (!item.lov_code) {
            alert("list of values not defined")
            return;
          } else {
            item.engineLovType = btn;
            // if(item.click_events_str){
            if (!item.tempClick_events_str) {
              item.tempClick_events_str = item.click_events_str;
            }
            // }
            item.click_events_str = "open_multi_lov();";
          }

        } else {
          item.engineLovType = btn
          if (item.tempClick_events_str != undefined) {
            item.click_events_str = item.tempClick_events_str;
          } else {
            item.click_events_str = item.click_events_str;
          }
        }
      }
      item.indexcount = i;
      this.modalGlobal.popDismiss(item, 'notDismiss');
    }
    // alert("check");
  }



  setFrameData(dataitem, itemValue) {

    let item = this.columnData.find(a => a.item_name == itemValue);


    if (item) {
      for (let advData of dataitem) {
        for (let disitem of advData.Level5) {
          for (let itm of Object.keys(item)) {
            if (itm == (disitem.item_name.toLowerCase())) {
              disitem.value = item[itm] ? item[itm] : "";
            }
          }
          if (disitem.item_name == "FILTER_CLAUSE") {
            disitem.datatype = item.datatype;
            disitem.newdatatype = item.datatype;
            disitem.lov_code = item.lov_code;
            disitem.lov_return_column_str = item.lov_return_column_str;
            // disitem.click_events_str = item.click_events_str;
            disitem.filterErrorFlag = false;
          }
        }
      }
    }
    console.log("dataitem : ", dataitem);

  }
  addNewTableRow() {
    if (this.frame) {
      let item = JSON.parse(JSON.stringify(this.frame.Level4));
      for (let itm of item) {
        for (let data of itm.Level5) {
          if (data.item_name == "FILTER_OPERATOR") {
            data.value = "in";
          }
          if (data.item_name == "FILTER_CLAUSE") {
            data.newdatatype = data.datatype;
          }
        }
      }
      console.log(item);
      if (!this.frame.tableRows) {
        this.frame.tableRows = [];
      }
      this.frame.tableRows.push(item);
    }
    console.log("adv frame", this.frame.tableRows);
  }


  addDuplicateField(itm, i) {
    let item = JSON.parse(JSON.stringify(itm));
    for (let itm of item) {
      for (let data of itm.Level5) {
        if (data.item_name == "FILTER_CLAUSE") {
          // data.value = "";
          delete data["value"];
          data.filterErrorFlag = false;
        }
        if (data.item_name == "ITEM_NAME") {
          // data.value = "";
          data.filterErrorFlag = false;
        }
      }
    }
    this.frame.tableRows.splice(i + 1, 0, item)
  }
  // this.newRow = item;

  rmFieldValue(itm, i) {
    this.frame.tableRows.splice(i, 1);
  }

  apply() {
    let submitflag = true;
    // let item_nameflag=false;
    // let filter_ClauseFlag=false;
    if (this.frame) {
      for (let data of this.frame.tableRows) {
        let item_nameflag = true;
        let filter_ClauseFlag = true;
        let filter_NullFlag = true;


        for (let datas1 of data) {
          for (let item1 of datas1.Level5) {
            if (item1.item_name == "FILTER_OPERATOR") {
              if (item1.value == "is null" || item1.value == "is not null") {
                filter_NullFlag = false;
              }
            }
          }
        }

        if (filter_NullFlag) {
          for (let datas of data) {
            for (let item of datas.Level5) {
              if (item.item_name == "ITEM_NAME") {
                if (item.value == "" || item.value == undefined) {
                  item.filterErrorFlag = true;
                  alert("please enter the col value ");
                  submitflag = false;
                  item_nameflag = false;
                }
              }
              if (item.item_name == "FILTER_CLAUSE") {
                // if (item.value == "" || item.value == undefined) {
                if (item.value == undefined) {
                  item.filterErrorFlag = true;
                  alert("please enter the description value ");
                  submitflag = false;
                  filter_ClauseFlag = false;
                }
              }
            }
          }
        }
        if (!filter_NullFlag) {
          for (let datas of data) {
            for (let item of datas.Level5) {
              if (item.item_name == "FILTER_CLAUSE") {
                if (item.value == "" || item.value == undefined) {
                  item.filterErrorFlag = false;
                }
              }
            }
          }
        }


        console.log(item_nameflag + " " + filter_ClauseFlag);
        if (item_nameflag && filter_ClauseFlag) {
          for (let datas1 of data) {
            for (let item1 of datas1.Level5) {
              // if (item1.item_name == "WMA_RECORD_STATUS") {
              item1.frame_status = "dirty";
              // }
            }
          }
        }
        // }
      }
    }
    console.log("table rows : ", this.frame.tableRows);
    if (submitflag) {
      delete this.frame["previuseTableRows"]
      this.modalGlobal.popDismiss();
    }
  }



  clear() {
    delete this.frame["previuseTableRows"]
    this.frame.tableRows = [];
  }


  close() {
    this.frame.tableRows = this.frame.previuseTableRows
    delete this.frame["previuseTableRows"]
    this.modalGlobal.popDismiss();
  }

  applyAdvnceFilter(data, item) {
    item.displayReportEngineFlag = false;
    item.value = item.codeOfValues;
  }

  addKeyFilterFlag(){
    let frame = this.lhslib.get_frame_config('ALL_COL');
    let keyFIlterFlagData=[]
    for (let frameData of frame.Level4) {
      for (let item of frameData.Level5) {
        if (item.item_filter_flag) {
          if (item.item_filter_flag.toUpperCase() == "KEY_ENGINE_FILTER") {
           keyFIlterFlagData.push(item.item_name)
           
          }
        }
      }
    }
    if(this.frame.tableRows && this.frame.tableRows.length>0 && keyFIlterFlagData.length>0){
      let dataa=[]
      for(let data of this.frame.tableRows){
        for(let datas of data){
          for(let item_t of datas.Level5){
            for(let keyFilter of keyFIlterFlagData){

          
              if(item_t.item_name == 'ITEM_NAME' && item_t.value==keyFilter){
                dataa.push(keyFilter)
              }
            }
          }
        }
      }
      keyFIlterFlagData = keyFIlterFlagData.filter(item => !dataa.includes(item));
    }
    if(keyFIlterFlagData.length>0){
      for(let keyFilter of keyFIlterFlagData){
        this.addNewTableRowKey(keyFilter)
      }
    }
    
   
    // else{
    //            this.addNewTableRowKey(item.prompt_name)
    //         }
  }
   addNewTableRowKey(value) {
    if (this.frame) {
      let item = JSON.parse(JSON.stringify(this.frame.Level4));
      for (let itm of item) {
        for (let data of itm.Level5) {
          if (data.item_name == "FILTER_OPERATOR") {
            data.value = "in";
          }
          if (data.item_name == "FILTER_CLAUSE") {
            data.newdatatype = data.datatype;
          }
          if (data.item_name == "ITEM_NAME") {
            data.value = value;
          }
        }
      }
      console.log(item);
      this.setFrameData(item,value)
      if (!this.frame.tableRows) {
        this.frame.tableRows = [];
      }
      this.frame.tableRows.push(item);
      
    }
    console.log("adv frame", this.frame.tableRows);
  }

}
