import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IonSelect, Platform, PopoverController } from '@ionic/angular/standalone';
import { AlertMsgBoxesPage } from 'src/app/pages/alert-msg-boxes/alert-msg-boxes.page';
import { ApexActionFilterPage } from 'src/app/pages/apex-action-filter/apex-action-filter.page';
import { ApexSearchPipe } from 'src/app/pipes/apex-search.pipe';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
// import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,ApexActionFilterPage],
  selector: 'app-frame-apexfilter',
  templateUrl: './frame-apexfilter.component.html',
  styleUrls: ['./frame-apexfilter.component.scss'],
})
export class FrameApexfilterComponent implements OnInit {
  @ViewChild(ApexActionFilterPage) ApexActionFilterPage!: ApexActionFilterPage;
  @Output() fromapexFilter: EventEmitter<any> = new EventEmitter<any>();
  @Input() frame: any = {};
  @Input() frametable: any = {};
  @Input() theadData: any = {};
  @Output() page: any = new EventEmitter<any>();
  searchText: any;
  actionName: any = "Actions";
  columnName: any = {};
  // tRows: any = [];
  frameheads: any = [];
  actionIcon: any = ['refresh', 'journal', 'funnel', 'menu', 'grid', 'locate']
  dataMode: any = ['Conditional Filter', 'Group By', 'Column','Function'];
  flagFirst: boolean = true;
  group1 = [];
  dragarrayHeads: any;
  columnsData: any = [];
  flagforfreeze: boolean;
  frameheadsFreeze: any;
  formatAction: any = ['Control Break', 'Row per page'];

  showList: boolean = true;
  showColList: boolean = true;

  platformVal = "";
  icon = "";

  appliedFilters = [];
  frameData: any
  shuffle: any = "Conditional Filter"
  @ViewChild('mySelect') selectRef: IonSelect;
  @ViewChild("selectColumn") selectColumn: IonSelect;

  constructor(private processData:ProcessDataService,private globalObject:GlobalObjectsService,
    public pipemys: ApexSearchPipe, public popoverController: PopoverController, public platform: Platform, private modalGlobal: CanvasModalService, private events:Events
  ) {
    this.columnName.prompt_name = "All Columns";

    if (this.platform.is("android") || this.platform.is("ios")) {
      this.platformVal = "mobile";
    } else {
      this.platformVal = "browser";
    }

    if(this.globalObject.frameFlag){
      return applyLoggingDecorator(this,"frame-apexfilter-frame")
    }
  }

  ngOnInit() {
    let apexHeads = [];
    let apexAggriHead = [];
    let thead = [];
    for (let itemGroup of this.frame.Level4) {
      if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
        for (let itemMast of itemGroup.Level5) {
          if (itemMast.item_type!="FRAME_BUTTON_ICON" && (itemMast.prompt_name!=null || itemMast.tool_tip!=null) && itemMast.item_type!="BUTTON" && itemMast.item_name!="WMA_FRAME_STATUS" && itemMast.item_name!="WMA_RECORD_STATUS" && itemMast.item_name!="WMA_RECORD_INDEX") {
            let obj = {
              prompt_name: itemMast.prompt_name ? itemMast.prompt_name :itemMast.tool_tip,
              item_name: itemMast.item_name,
              aliases: itemMast.aliases,
              datatype: itemMast.datatype ? itemMast.datatype.toLowerCase() : itemMast.datatype,
              item_db_name:itemMast.item_db_name,
              item_visible_flag:itemMast.item_visible_flag,
            }
            apexHeads.push(obj);
            apexAggriHead.push(obj);
            thead.push(obj);
          }
        }
      }

    }

    this.frame.apexAggriHead = apexAggriHead;
    this.frame.apextheads = thead;
    this.frame.apextheaders = apexHeads;
    this.theadData = thead


    this.frameheads = JSON.parse(JSON.stringify(thead));
    // this.frameData = JSON.parse((JSON.stringify(this.frame)))
    // this.frameData=structuredClone(this.frame);
  }

  createTable(data) {
    let apexFrameLevel4;
    apexFrameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

    let visibleItems: any = [];
    if(this.columnsData){
      this.columnsData.forEach((m,i) => {
        for (let x of this.frame.apextheaders) {
          if (x.item_name == m) {
            x.item_seqno=`${i+1}`;
            visibleItems.push(x);
          }
        }
      });
    }
   
    this.frame.visibleItems = visibleItems;
    let event: any = {};
    event.apex = true;
    event.visibleItems = visibleItems;
    event.reqData=data.reqData
    if(!data.clearFilter){
      this.modalGlobal.popDismiss(event,"column")
    }else{
      this.events.publish(`popupSubscribe#${this.frame.apps_page_frame_seqid}`,event)
    }
    
    this.actionName = '';
  }

  viewByColumns(event) {
    this.frame.columnsData= event.columnsAllData
    this.frame.selectedCols = event.columnsData;
    this.columnsData = [];

    if(event.columnsData){
      let data1 = event.columnsData;
      for (let o of data1) {
        this.columnsData.push(o.item_name);
      }
    }
    this.dropdwnColumn(event);
  }

  columnFilter(res) {
    let event: any = {};
    event.apex = true;
    
    if(res.clearFilter){
      let eventclear: any = {};
      eventclear.filteredData = [];
      eventclear.apex = true;
      this.events.publish(`popupSubscribe#${this.frame.apps_page_frame_seqid}`,eventclear)
    }else{
      event.filterCond = res.rowFilter;
      this.frame.filterAbleArr = event.filterCond;
      this.getFilteredData(event.filterCond);
    }
  }
  groupBy(res) {
   
    let event: any = {};
    event.apex = true;
  
    if(res=="clearFilter"){
      event.groupBy = '';
      this.events.publish(`popupSubscribe#${this.frame.apps_page_frame_seqid}`,event)
    }else{
      event.groupBy = res;
     
      if (this.frame.isCheck) {
        delete this.frame['isCheck']
      }
      this.frame.funcArr = res.funArr;
      this.frame.ctrlBrkCond = res.controlBr;
  
      let apply = this.appliedFilters.find(x => x.type == 'Group By');
      if (apply) {
      } else {
        let obj = {
          type: 'Group By',
          icon: this.icon
        }
        this.appliedFilters.push(obj);
      }
      this.modalGlobal.popDismiss(event, 'groupBy');
    }
  }
  async controlBr(res){ 
    let event: any = {};
    event.apex = true;
    if(res=="clearFilter"){
      event.ctrlBreakArr = '';
      this.events.publish(`popupSubscribe#${this.frame.apps_page_frame_seqid}`,event)
    }else{
      
        this.frame.isCheck = true
        this.frame.ctrlBrkCond = res.controlBr;
        this.frame.funcArr = res.funArr;
    
        let apply = this.appliedFilters.find(x => x.type == 'Control Break');
        if (apply) {
        } else {
          let obj = {
            type: 'Control Break',
            icon: this.icon
          }
          this.appliedFilters.push(obj);
        }
        if ((this.frame.searchableData && this.frame.searchableData.length > 10)||(this.frame.tableRows && this.frame.tableRows.length > 1000)) {
          event.isPdfdownloadCtrlBreakArr=res
          this.toggleExpandedView(event)
        }else{
          event.ctrlBreakArr = res;
          this.modalGlobal.popDismiss(event, 'controlBr');
        }
     
    }
  }

  aggregateFun(res){
    let event: any = {};
    event.apex = true;
    event.aggregateFun = res.aggregate;
    if(!res.clear){
      this.frame.aggregateFun = res.aggregate;
      this.modalGlobal.popDismiss(event, 'aggregateFun');
    }
    else{
      event.aggregateFunClear=true
      this.events.publish(`popupSubscribe#${this.frame.apps_page_frame_seqid}`,event)
    }
  }
 
  async presentPopover(ev, event) {
    this.ApexActionFilterPage.myMethod(ev, this.frame);

    // this.frameData = JSON.parse((JSON.stringify(this.frame)))
    this.shuffle = ev
  
  }

  dropdwnColumn(event) {
    this.createTable(event);
  }

  getMode(i, event, event2) {
    this.actionName = event;
    this.icon = this.actionIcon[i];
    if (this.actionName == 'Function' || this.actionName == 'Conditional Filter' || this.actionName == 'Control Break' || this.actionName == 'Group By' || this.actionName == 'Column') {
      this.presentPopover(this.actionName, event2);
    }else if (this.actionName == 'Refresh') {
      this.columnsData = [];
      this.frameheadsFreeze = [];
      this.frame.ctrlBrkCond = [];
      this.frame.funcArr = [];
      this.frame.filterAbleArr = [];
      this.frame.selectedCols = [];
      this.frame.apexFrameLevel4 = [];
      this.frame.funcArr = [];
      this.clear(0, 'All');
    }
  }

  clear(i, ev, type?) {
    this.page.emit()
    let event: any = {};
    event.apex = true;
    if (type && type == 'clear') {
      event.clear = 'One';
    }
    if (ev == 'groupBy') {
      this.frame.ctrlBrkCond.splice(i, 1);
      if ((this.frame.ctrlBrkCond && (this.frame.ctrlBrkCond.length > 0)) && (this.frame.funcArr && (this.frame.funcArr.length > 0))) {
        let data = {
          funArr: this.frame.funcArr,
          controlBr: this.frame.ctrlBrkCond
        }
        event.groupBy = data;
      } else {
        event.clear = 'groupBy';
        this.frame.funcArr = [];
        this.frame.ctrlBrkCond = [];
        let headArr = [];
        for (let itemGroup of this.frame.Level4) {
          for (let itemMast of itemGroup.Level5) {
            if (itemMast.item_visible_flag == 'T') {
              headArr.push(itemMast.prompt_name);
            }
          }
        }

        event.head = headArr;
      }
      this.modalGlobal.popDismiss(event, 'groupBy');
    } if (ev == 'filter') {
      this.frame.filterAbleArr.splice(i, 1);
      if (this.frame.filterAbleArr.length > 0) {
        this.getFilteredData(this.frame.filterAbleArr);
      } else {
        if (this.frame.ctrlBrkCond && this.frame.ctrlBrkCond.length > 0) {
          event.filteredData = [];
        } else {
          this.frame.filterAbleArr = [];
          event.filteredData = this.frame.tableData
          this.frame.ctrlBrkCond = [];
          event.clear = 'All';
        }
        this.modalGlobal.popDismiss(event, 'filter');
      }
    } if (ev == 'All') {
      event.clear = ev;
      this.frame.filterAbleArr = [];
      this.frame.ctrlBrkCond = [];
      this.frame.funcArr = [];
      this.frame.visibleItems = [];
      this.events.publish(`popupSubscribe#${this.frame.apps_page_frame_seqid}`,event)
    }

  }

  getFilteredData(condArr) {
    let event: any = {};
    event.filteredData = condArr;
    event.apex = true;
    this.modalGlobal.popDismiss(event, 'columnFilter');
  }
  isFrameSubTypeNew(x){
   if(this.frame.apps_frame_sub_type == 'NEW' && x=='Group By') {
     return false;
   }
   return true;
  }

  
  async toggleExpandedView(event) {
    let alertmessage = {
      para_type: "cbm",
      para_value: "Since the data contains more than 1000 rows. Do you want to download."
    }
    let popUp = await this.popoverController.create({
      component: AlertMsgBoxesPage,
      id: "msgPopover",
      backdropDismiss: false,
      componentProps: {
        alertMessage: alertmessage,
        type: "info"
      },
    });
    await popUp.present();

    await popUp.onDidDismiss().then(ress => {
      if (ress.data && ress.data == "Y") {
        // this.modalGlobal.popDismiss(event, 'controlBr');
        const canvas = document.querySelectorAll("#globe_typetable_filter")
        const events: any = new Event('click');
        let dispatchCanvas = canvas[canvas.length - 1]
        events.isGroupbyFilterPdf = event
        dispatchCanvas.dispatchEvent(events)
      } else {
      }
    })

  }

}
