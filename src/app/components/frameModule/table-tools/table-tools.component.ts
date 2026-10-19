import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FrameApexfilterComponent } from '../../frames/frame-apexfilter/frame-apexfilter.component';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { WebdatarocksComponent } from 'src/app/demo-utils/pivot-table-webdatarocks/webdatarocks.component';
import { Events } from 'src/app/services/events';
import { DataService } from 'src/app/services/data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { isPlatformServer } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone : true,
  selector: 'app-table-tools',
  templateUrl: './table-tools.component.html',
  styleUrls: ['./table-tools.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  imports: [STANDALONE_IMPORTS]
})
export class TableToolsComponent implements OnInit {
  @Input() frame:any={}
    iframeUrl: SafeResourceUrl;
  @Input() tableData
  @Input() fileTyle
  @Output() fileTyleChange=new EventEmitter()
  @Input() toolsExport
  @Input() controlBreakArr
  @Output() controlBreakArrChange=new EventEmitter()
  @Input() summaryRow
  @Output() summaryRowChange=new EventEmitter()
  @Input() conditionalFilterData=[]
  @Output() conditionalFilterDataChange=new EventEmitter()
  @Input() displayDataLen
  @Input() funArr
  @Output() funArrChange=new EventEmitter()
  @Input() controlBreakFlag
  @Output() controlBreakFlagChange=new EventEmitter()
  @Input() groupFlag
  @Output() groupFlagChange=new EventEmitter()
  @Input() footerRowFlag
  @Output() footerRowFlagChange=new EventEmitter()
  @Input() filterAbleData
  @Output() filterAbleDataChange=new EventEmitter()
  @Input() thead
  @Output() theadChange=new EventEmitter()
  @Input() controlBreakHead
  @Output() controlBreakHeadChange=new EventEmitter()
  @Input() isAggrigate
  @Output() isAggrigateChange=new EventEmitter()
  @Input() freezeColArr
  @Output() freezeColArrChange=new EventEmitter()
  // @Input()  l_total_remain_pages
  // @Output() l_total_remain_pagesChange=new EventEmitter()
  
  @Input()  gpRHead
  @Output() gpRHeadChange=new EventEmitter()
  @Input()  groupHeadArr
  @Output() groupHeadArrChange=new EventEmitter()
  @Input()  dragedDiv
  @Output() dragedDivChange=new EventEmitter()
  @Input() groupInnerHeader
  @Output() groupInnerHeaderChange=new EventEmitter()
  @Input() tableRows
  @Output() emitPass=new EventEmitter()
  @Input() isSingleSelectRecord
  @Output() isSingleSelectRecordChange=new EventEmitter()
  @Input() isNotExport
  @Input() isNotExportPdf
  @Input() isNotExportExcel
  @Input() isNotExportCsv
  @Input() plt

/////////////////////ai variable/////////////
  @Input() isAIUsed
  @Output() isAIUsedChange=new EventEmitter()
  @Input() selectedText
  @Output() selectedTextChange=new EventEmitter()
  @Input() frametable
  @Output() frametableChange=new EventEmitter()
  @Input() isSelecting
  @Output() isSelectingChange=new EventEmitter()
  @Input() col9
  @Output() col9Change=new EventEmitter()

  @Input() rowCount=0
  @Output() rowCountChange=new EventEmitter()

  @Input() isResizable:boolean
  @Output() isResizableChange=new EventEmitter()
  @Input() page: Number
  @Output() pageChange = new EventEmitter();
  @Input() parentDiv: any
  @Output() aiInputData = new EventEmitter();



  controlBreakArrPreviousFilter=[]
  controlBreakHeadPreviousFilter=[]
// selectedText: string = '';
// frametable:any;
// // isAIUsed=false;  
// isSelecting:any;
// col9: any;
////////////////////////////////////
  selectedExportDataType="allData"
  clickShare: boolean = false;
  userDetails: any;
  constructor(public event: Events,private modalGlobal:CanvasModalService,private commonMethod:CommonMethodService,private processData:ProcessDataService,private globalObjects:GlobalObjectsService,private lhs_lib:LhsLibService,private events:Events,private dataservice:DataService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.popupSubscribe()

 this.userDetails=this.globalObjects.getLocallData('userDetails')

    this.event.subscribe(this.frame.apps_page_frame_seqid+"ai", () => {
      // console.log("coming from ai table"+this.frame.apps_page_frame_seqid+"ai")
      this.aifullScreen(this.frame,'0')
    });
    console.log(this.isResizable)
  }

  tablefilter(event: any, shuffle) {
      let component = FrameApexfilterComponent
      let componentProps = {
        frame: this.frame,
        theadData: this.frame.apextheads,
        shuffle: shuffle
      }
      let id = "globe_typetable_filter"
      let cssClass = "ios_height"
      let title = this.frame.apps_page_frame_name
      this.modalGlobal.openModal(component, componentProps, id, event, cssClass, "", "", "", title).then((detail) => {
        if (detail.data) {
          this.getdataFromcanvasApex(detail.data)
          console.log(detail.data);
        }
      })
  }
  fullScreenCss={
    display: 'block',
    border : "2px solid #2e6adf",
    backgroundColor : "var(--blue-new)",
    color : "#fff"
  }
  fullScreen(fullscreen_id: any, status) {
    if(status==1){
      // this.frame.fullScreen=true
      let displayDataLen=+ this.frame.displayDataLen
      if(this.frame.tableRows.length>30 && displayDataLen<30){
        this.frame.previousFullScreendisplayDataLen=this.frame.displayDataLen
        this.frame.displayDataLen=30
        this.displayDataChange()
      }
    }else{
      if(this.frame.previousFullScreendisplayDataLen){
        this.frame.displayDataLen=this.frame.previousFullScreendisplayDataLen
        delete this.frame['previousFullScreendisplayDataLen']
        this.displayDataChange()
      }
      // delete this.frame['fullScreen']
    }
    this.commonMethod.fullScreen(this.frame, status)
  }
 

  toggleWrap() {
    this.frame.isTextWrapped = !this.frame.isTextWrapped;  // Toggle between wrap and no-wrap
  }
  /* start Export file */
  cancelExport() {
    this.clickShare = false;
  }
  confirmExport() {
    this.clickShare = false;
    if(this.controlBreakFlag || this.groupFlag){
      this.downloadPdf();
    }else{
      this.getDataForGraph(this.fileTyle, '')
      this.selectedExportDataType = "allData"
    }
  
  }
  getDataForGraph(fileType, shareType) {
    let exelHeads=[]
    let pdfHeads=[]
    let frameLevel4= this.frame.apexFrameLevel4  ? this.frame.apexFrameLevel4 : this.frame.Level4;
    for (let itemGroup of frameLevel4) {
      for (let itemMast of itemGroup.Level5) {
      
        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F') { } else {

          if (itemMast.item_type == 'BT' || itemMast.item_type == 'DISPLAY_PHOTO' || itemMast.item_type == 'DOWNLOAD_DOC' || itemMast.item_type == 'BUTTON_ICON' || itemMast.item_type == 'FRAME_SEPARATOR' || itemMast.item_type == 'FRAME_BUTTON_ICON' || itemMast.item_name.toLowerCase().includes("wma_") || itemMast.item_visible_flag != 'T'  || itemMast.item_type == 'RIGHT_CLICK') {

          } else {
            // if(!itemMast.prompt_name){
            //   if((this.frame.apps_page_frame_seqid).charAt((this.frame.apps_page_frame_seqid).length - 1) == 'A' ){
            //  exelHeads.push(itemMast.tool_tip);
            //   }else{
            //     exelHeads.push(itemMast.prompt_name);
            //   }
            // } else{
            //     exelHeads.push(itemMast.prompt_name);
            // }
            if(!itemMast.prompt_name){
              exelHeads.push(itemMast.tool_tip);
            } else{
              exelHeads.push(itemMast.prompt_name);
            }
            // exelHeads.push(itemMast.prompt_name);
          }

          if (itemMast.item_type == 'BT' || itemMast.item_type == 'DOWNLOAD_DOC' || itemMast.item_type == 'BUTTON_ICON' || itemMast.item_type == 'FRAME_SEPARATOR' || itemMast.item_type == 'FRAME_BUTTON_ICON' || itemMast.item_name.toLowerCase().includes("wma_") || itemMast.item_type == 'RIGHT_CLICK') {

          } else {
            // pdfHeads.push(itemMast.prompt_name ?? "");
             if(!itemMast.prompt_name){
              pdfHeads.push(itemMast.tool_tip);
            } else{
              pdfHeads.push(itemMast.prompt_name ?? "");
            }
          }
        }
        if (itemMast.item_visible_flag == 'F') {
          if (itemMast.mirrored_items) {
                  if(!itemMast.prompt_name){
              exelHeads.push(itemMast.tool_tip);
            } else{
              exelHeads.push(itemMast.prompt_name);
            }
          }
        }
      }
    }
    this.toolsExport.excelheads=exelHeads
    this.toolsExport.pdfheads=pdfHeads
    this.toolsExport.selectedExportDataType=this.selectedExportDataType
    this.commonMethod.getDataForGraph(fileType,shareType,this.toolsExport)
  }
  selectFile(type) {
    this.fileTyle = type
    this.fileTyleChange.emit(this.fileTyle)
  }
  getShare(event) {
    this.clickShare = false;
    this.getDataForGraph('pdf', event);
  }
  /* End Export file */
  /* start filter */
  isPdfdownloadCtrlBreakArr=false
  getdataFromcanvasApex(event: any) {
    this.frame.rowCount=0
    this.rowCountChange.emit(this.rowCount)
    if (event.visibleItems) {
      this.summaryRow = [];
      this.summaryRowChange.emit(this.summaryRow)
      this.frame.tableRows = [];

      if (this.controlBreakArr.length > 0) {
        this.controlBreakArr = [];
        this.controlBreakArrChange.emit(this.controlBreakArr)
        this.generateApexLevel4();

        if(this.frame.searchableRawData){
          this.displayData(0, this.frame.searchableRawData.length);
        }else{
          this.displayData(0, this.frame.tableData.length);
        }
      }
      else {
        this.generateApexLevel4();
        this.generateApexPage(1);
      }
      if(this.conditionalFilterData && this.conditionalFilterData.length>0){
        this.commonMethod.getitemSearch(this.frame,this.displayDataLen,this.conditionalFilterData,this.processData)
      }
       
      if (event.reqData) {
        // this.events.publish(event.reqData,"")

        let obj = {
          'reqData': event.reqData,
          'personalization': true
        }
        this.emitPass.emit(obj);

      }
    }
    else if (event.filteredData) {
    
      if (event.filteredData.length == 0) {
        this.clearData('filter')
      }else{
        this.conditionalFilterData=event.filteredData
        this.conditionalFilterDataChange.emit(this.conditionalFilterData)
        this.commonMethod.getitemSearch(this.frame,this.displayDataLen,this.conditionalFilterData,this.processData)
      }

      if (this.controlBreakArr.length > 0) {
        if(this.controlBreakArrPreviousFilter.length==0){
          this.controlBreakArrPreviousFilter=this.controlBreakArr
           this.controlBreakHeadPreviousFilter=this.controlBreakHead
        }
        this.controlBreakArr = [];
        this.controlBreakArrChange.emit(this.controlBreakArr)
        if (this.frame.isCheck) {
          this.controlBreakFlag = true
          this.controlBreakFlagChange.emit(this.controlBreakFlag)
        } else {
          this.groupFlag = true
          this.groupFlagChange.emit(this.groupFlag)
        }
        this.generateApexLevel4();
        if(this.frame.searchableRawData){
          this.displayData(0, this.frame.searchableRawData.length);
        }else{
          this.displayData(0, this.frame.tableData.length);
        }
   
        if (this.frame.visibleItems) {
          this.generateApexPage(1);
        }
      } else {
        if (this.frame.visibleItems) {
          this.generateApexLevel4();
          this.generateApexPage(1);
        }
      }


    }
    else if (event.funArr || event.groupBy) {

      if (event.groupBy) {
        this.funArr = event.groupBy.funArr;
        this.funArrChange.emit(this.funArr)
        this.controlBreakFlag = false;
        this.controlBreakFlagChange.emit(this.controlBreakFlag)
        this.groupFlag = true;
        this.groupFlagChange.emit(this.groupFlag)

      } else {

        this.funArr = event.funArr;
        this.funArrChange.emit(this.funArr)
        this.controlBreakFlag = false;
        this.controlBreakFlagChange.emit(this.controlBreakFlag)
      }
      this.generateApexLevel4();
     
      if(this.frame.searchableRawData){
        this.displayData(0, this.frame.searchableRawData.length);
      }else{
        this.displayData(0, this.frame.tableData.length);
      }
    } else if (event.noOfRecords) {

      this.displayDataLen = parseInt(event.noOfRecords);

      this.frame.tableRows = [];
      this.controlBreakArr = [];
      this.controlBreakArrChange.emit(this.controlBreakArr)
      this.generateApexPage(1);
    } else if (event.ctrlBreakArr) {
      this.funArr = event.ctrlBreakArr.funArr;
      this.funArrChange.emit(this.funArr)
      this.controlBreakFlag = true;
      this.controlBreakFlagChange.emit(this.controlBreakFlag)
      this.groupFlag = false;
      this.groupFlagChange.emit(this.groupFlag)
      this.generateApexLevel4();
      if(this.frame.searchableRawData){
        this.displayData(0, this.frame.searchableRawData.length);
      }else{
        this.displayData(0, this.frame.tableData.length);
      }
  
    } else if (event.isPdfdownloadCtrlBreakArr) {
      this.isPdfdownloadCtrlBreakArr=true
      // this.funArr = event.ctrlBreakArr.funArr;
      // this.funArrChange.emit(this.funArr)
      // this.controlBreakFlag = true;
      // this.controlBreakFlagChange.emit(this.controlBreakFlag)
      // this.groupFlag = false;
      // this.groupFlagChange.emit(this.groupFlag)
      // this.generateApexLevel4();
      if(this.frame.searchableRawData){
        this.displayData(0, this.frame.searchableRawData.length);
      }else{
        this.displayData(0, this.frame.tableData.length);
      }
      this.downloadPdf()
      this.isPdfdownloadCtrlBreakArr=false
        //    this.frame.ctrlBrkCond = [];
        // this.funArr = [];
        // this.frame.isCheck = false
        // this.funArrChange.emit(this.funArr)

        // this.frame.apexFrameLevel4 = [];
        // this.frame.tHead = this.thead;
        // this.controlBreakArr = [];
        // this.controlBreakArrChange.emit(this.controlBreakArr)
    }else if (event.searchTabData) {
      this.frame.searchTabData = event.searchTabData;
      this.controlBreakArr = [];
      this.controlBreakArrChange.emit(this.controlBreakArr)
      this.processData.populateRows(this.frame.apps_page_frame_seqid, this.tableData, 0, this.displayDataLen, 1);
    } else if (event.clear) {
      if (event.clear == 'groupBy') {
        this.groupFlag = false;
        this.groupFlagChange.emit(this.groupFlag)
        this.funArr = [];
        this.funArrChange.emit(this.funArr)
        this.frame.tableRows = [];
        delete this.frame['apexFrameLevel4'];
        // this.frame.headers = JSON.parse(JSON.stringify((this.frame.Level4)));
         let level4 = [];
        if (this.frame.Level4 && this.frame.Level4.length > 0) {
        level4[0] = JSON.parse(JSON.stringify(this.frame.Level4))
        let sepdata = this.lhs_lib.seprateData(this.frame, level4)
        this.frame.headers = sepdata[0];
        }
        this.frame.tHead = this.thead;
        this.controlBreakFlag = false;
        this.controlBreakFlagChange.emit(this.controlBreakFlag)
        if (event.head) {
          this.thead = event.head;
          this.theadChange.emit(this.thead)
          this.frame.tHead = this.thead;
        }
        this.frame.tableRows = [];
        this.controlBreakArr = [];
        this.controlBreakArrChange.emit(this.controlBreakArr)

        if (this.frame.visibleItems) {
          this.generateApexLevel4();
          this.generateApexPage(1);
        } else {
          this.generateApexPage(1);
        }
      } if (event.clear == 'All') {

        // this.frame.tableRows = [];

        // this.frame.apexFrameLevel4 = [];
        // this.frame.headers = JSON.parse(JSON.stringify((this.frame.Level4)));
         let level4 = [];
        if (this.frame.Level4 && this.frame.Level4.length > 0) {
        level4[0] = JSON.parse(JSON.stringify(this.frame.Level4))
        let sepdata = this.lhs_lib.seprateData(this.frame, level4)
        this.frame.headers = sepdata[0];
        }
        this.frame.tHead = this.thead;
        this.summaryRow = [];
        this.summaryRowChange.emit(this.summaryRow)
        this.funArr = [];
        this.funArrChange.emit(this.funArr)
        this.footerRowFlag = false;
        this.footerRowFlagChange.emit(this.footerRowFlag)

        if (event.clearData == 'Group') {
          this.ngOnInit();
       
          this.controlBreakArr = []
          this.controlBreakArrChange.emit(this.controlBreakArr)
          this.controlBreakHead = []
          this.controlBreakHeadChange.emit(this.controlBreakHead)
          if (this.frame.visibleItems) {
            this.generateApexLevel4();
            this.generateApexPage(1);
          }
        } else if (event.clearData == 'filter') {
          if (this.frame.isCheck) { delete this.frame['isCheck'] }
          this.filterAbleData = [];
          this.filterAbleDataChange.emit(this.filterAbleData)
          this.clear(0, 'filter')

        }
        else {
          if (this.frame.isCheck) { delete this.frame['isCheck'] }
          this.filterAbleData = [];
          this.filterAbleDataChange.emit(this.filterAbleData)
          this.controlBreakArr = [];
          this.controlBreakArrChange.emit(this.controlBreakArr)
          // this.clear(0, 'filter')
          
        }
      }
    } else if (event.freezeCol) {
      this.freezeColArr = event.freezeCol;
      this.freezeColArrChange.emit(this.freezeColArr)
      this.frame.tableRows = [];
      this.frame.controlBreakArr = [];
      this.generateApexLevel4();
      this.generateApexPage(1);
    } else if (event.showPivot) {

    } else if (event.aggregateFun) {
      if (event.aggregateFunClear) {
        this.frame.summary_flag = false
        this.funArr = this.frame.aggregateFun;
        this.funArrChange.emit(this.funArr)
        this.isAggrigate = true;
        this.isAggrigateChange.emit(this.isAggrigate)
        if (this.frame.apexFrameLevel4) {
          for (let itemGroup of this.frame.apexFrameLevel4) {

            for (let itemMast of itemGroup.Level5) {
              if (this.funArr) {
                for (let f of this.funArr) {
                  if (f.coloumns && f.fun) {
                    if (f.coloumns.item_name == itemMast.item_name) {
                      delete itemMast['summary_flag']
                    }
                  }

                }
              }
            }
          }
        } else {
          for (let itemGroup of this.frame.Level4) {

            for (let itemMast of itemGroup.Level5) {
              if (this.funArr) {
                for (let f of this.funArr) {
                  if (f.coloumns && f.fun) {
                    if (f.coloumns.item_name == itemMast.item_name) {
                      delete itemMast['summary_flag']
                    }
                  }

                }
              }
            }
          }
        }

        delete this.frame['aggregateFun']
      } else {
        this.funArr = event.aggregateFun;
        this.funArrChange.emit(this.funArr)
        this.isAggrigate = true;
        this.isAggrigateChange.emit(this.isAggrigate)
        if (this.frame.apexFrameLevel4) {
          for (let itemGroup of this.frame.apexFrameLevel4) {

            for (let itemMast of itemGroup.Level5) {
              if (this.funArr) {
                for (let f of this.funArr) {
                  if (f.coloumns && f.fun) {
                    if (itemMast.aggregateSummary) {
                      delete itemMast['summary_flag']
                    }
                    if (f.coloumns.item_name == itemMast.item_name) {
                      itemMast.aggregateSummary = true
                      itemMast.summary_flag = f.fun;
                      break;
                    }
                  }

                }
              }
            }
          }
        } else {
          for (let itemGroup of this.frame.Level4) {

            for (let itemMast of itemGroup.Level5) {
              if (this.funArr) {
                for (let f of this.funArr) {
                  if (f.coloumns && f.fun) {
                    if (itemMast.aggregateSummary) {
                      delete itemMast['summary_flag']
                    }
                    if (f.coloumns.item_name == itemMast.item_name) {
                      itemMast.aggregateSummary = true
                      itemMast.summary_flag = f.fun;
                      break;
                    }
                  }

                }
              }
            }
          }
        }

        this.frame.summary_flag = true
      }
      // this.processData.calculateData(this.frame.tableData,this.funArr)
      this.processData.calculateTableRows(this.frame)


    } else if (event.ctrlBreakArr == '' || event.groupBy == '') {
      this.clearData('Group')
    }

    if (event.headclasses) {
      this.frame.headclasses = event.headclasses;

    }
    if (event.headLength) {
      this.frame.freezLength = event.headLength;
    } else {
      this.frame.freezLength = 0;
    }
  }
  clearData(filter) {
    if (filter == 'Group') {
      this.frame.ctrlBrkCond = [];
      this.frame.funcArr = [];
      this.controlBreakArrPreviousFilter=[]
      this.controlBreakHeadPreviousFilter=[]
      this.groupFlag = false;
      this.groupFlagChange.emit(this.groupFlag)
      this.controlBreakFlag = false;
      this.controlBreakFlagChange.emit(this.controlBreakFlag)
      this.frame.apexFrameLevel4 = [];
      this.clear(0, 'All', filter);
      this.processData.calculateTableRows(this.frame)
    }
    else {
      this.frame.filterAbleArr = [];
      // this.frame.searchableData=[]
      this.conditionalFilterData=[]
      this.conditionalFilterDataChange.emit(this.conditionalFilterData)
      this.commonMethod.getitemSearch(this.frame, this.displayDataLen, this.conditionalFilterData, this.processData)
      if (this.controlBreakArr.length > 0) {
        this.controlBreakArr = [];
        this.controlBreakArrChange.emit(this.controlBreakArr)
        this.generateApexLevel4();
        this.displayData(0, this.frame.tableData.length);
        
      }
      
    }
    this.frame.rowCount=0
    this.rowCountChange.emit(this.rowCount)
    if(this.frame.visibleItems){
       this.generateApexPage(1);
    }
  }

  clear(i, ev, type?) {
    let event: any = {};
    event.apex = true;
    if (ev == 'groupBy') {
      // this.groupFlag=false
      // this.gpRHead=[]
      this.frame.ctrlBrkCond.splice(i, 1);
      if(this.frame.ctrlBrkCond && (this.frame.ctrlBrkCond.length == 0)){
        this.controlBreakArrPreviousFilter=[]
        this.controlBreakHeadPreviousFilter=[]
      }
      if ((this.frame.ctrlBrkCond && (this.frame.ctrlBrkCond.length > 0)) && (this.frame.funcArr && (this.frame.funcArr.length > 0))) {
        let data = {
          funArr: this.frame.funcArr,
          controlBr: this.frame.ctrlBrkCond
        }
        if (this.frame.isCheck) {
          event.ctrlBreakArr = data
        } else {
          event.groupBy = data;
        }
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
      this.getdataFromcanvasApex(event)

    } if (ev == 'filter') {
      if (this.frame.filterAbleArr && this.frame.filterAbleArr.length > 0) {
        this.frame.filterAbleArr.splice(i, 1);
      }
      if (this.frame.filterAbleArr && this.frame.filterAbleArr.length > 0) {
        // this.getFilteredData(this.frame.filterAbleArr);
        let event: any = {};
        event.filteredData = this.frame.filterAbleArr;
        event.apex = true;
        this.getdataFromcanvasApex(event)
      } else {
        if (this.frame.ctrlBrkCond && this.frame.ctrlBrkCond.length > 0) {
          event.filteredData = [];
        } else {
          this.frame.filterAbleArr = [];
          // event.filteredData = this.frame.tableData
          this.frame.ctrlBrkCond = [];
          event.clear = 'All';
        }

        this.frame.summary_flag = false
        this.funArr = this.frame.aggregateFun;
        this.funArrChange.emit(this.funArr)
        this.isAggrigate = true;
        this.isAggrigateChange.emit(this.isAggrigate)
        for (let itemGroup of this.frame.Level4) {

          for (let itemMast of itemGroup.Level5) {
            if (this.funArr) {
              for (let f of this.funArr) {
                if (f.coloumns && f.fun) {
                  if (f.coloumns.item_name == itemMast.item_name) {
                    delete itemMast['summary_flag']
                  }
                }

              }
            }
          }
        }

        delete this.frame['aggregateFun']
        this.processData.calculateTableRows(this.frame)
        this.getdataFromcanvasApex(event)
         if (this.frame.visibleItems) {
            this.generateApexLevel4();
            this.generateApexPage(1);
          }else{

            this.generateApexPage(1);
          }
      }
    } if (ev == 'All') {
      // delete this.frame ['columnsData']
      //  delete this.frame ['visibleItems']
      event.clear = ev;
      if (type == 'Group') {
        this.frame.ctrlBrkCond = [];
        this.frame.funcArr = [];
        this.controlBreakArrPreviousFilter=[]
        this.controlBreakHeadPreviousFilter=[]
        event.clearData = type

      }
      else {
        this.frame.filterAbleArr = [];

        event.clearData = type
      }
      this.getdataFromcanvasApex(event)
      this.generateApexPage(1);
    }

  }
  clearAllFilter() {
    this.frame.ctrlBrkCond = [];
    this.frame.funcArr = [];

    delete this.frame['apexFrameLevel4'];

    this.frame.filterAbleArr = [];

    this.frame.selectedCols = [];
   delete this.frame['visibleItems']
    delete this.frame['columnsData']
    this.controlBreakFlag = false;
    this.controlBreakFlagChange.emit(this.controlBreakFlag)
    this.groupFlag = false;
    this.groupFlagChange.emit(this.groupFlag)
    this.frame.controlBreakArr = [];
    this.controlBreakArrChange.emit(this.controlBreakArr)
    this.clear(0, 'All');
  }
  generateApexLevel4() {
    this.commonMethod.generateApexLevel4(this.frame, this.funArr, this.freezeColArr, this.thead);
    this.controlBreakArr = [];
    this.controlBreakArrChange.emit(this.controlBreakArr)
  }
  generateApexPage(a_current_page) {
    this.commonMethod.generateApexPage(a_current_page, this.frame, this.displayDataLen, this.filterAbleData, this.processData);
  }
  displayData(from, to) {

    let noOfRecords;
    noOfRecords = this.displayDataLen;


    // let l_total_pages: any = Math.ceil(this.l_total_rows / noOfRecords);

    // if (l_total_pages && l_total_pages == "Infinity" || isNaN(l_total_pages)) {
    //   this.l_total_remain_pages = 1;
    // } else {
    //   this.l_total_remain_pages = l_total_pages;
    // }

    this.globalObjects.switchTableData = [];
    this.globalObjects.switchSearchStr = "";


    if (this.controlBreakFlag || this.groupFlag || this.isPdfdownloadCtrlBreakArr) {
      let cbArr: any

      cbArr = this.frame.ctrlBrkCond;


      let ctrlStr = "";
      let i = 0;
      for (let c of cbArr) {
        i++;
        let col = c.coloumns.item_name;
        if (c.status == 'Enabled') {
          if (i < cbArr.length) {
            ctrlStr += "item." + col.toUpperCase() + ',';
          } else {
            ctrlStr += "item." + col.toUpperCase();
          }
        }
      }
      let tabdata = [];

      if (this.frame.searchableRawData && this.frame.searchableRawData.length > 0) {
        tabdata = this.frame.searchableRawData;
      } else {
        tabdata = this.tableData;
      }

      let data;
      if (this.frame.searchableRawData && this.frame.searchableRawData.length > 0) {
        data = this.frame.searchableRawData
      }
      else {
        data = this.frame.tableData
      }
      var tabRows = this.lhs_lib.groupBy(data, function (item) {
        let str = "[" + ctrlStr + "]";
        let arrStr = eval(str)
        return arrStr;
      });
      let tableKey = Object.keys(tabRows[0].items[0]);

      let levelRows = [];
      for (let t of tabRows) {
        let tableRows = [];
        let tableHead = [];
        for (let table of t.items) {
          let frameLevel4;
          if (this.frame.apexFrameLevel4 && this.frame.apexFrameLevel4.length > 0) {
            frameLevel4 = JSON.parse(JSON.stringify(this.frame.apexFrameLevel4));
          } else {
            frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
          }

          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key];

                  if (table[key] && (table[key].indexOf("~") > -1) && (table[key].indexOf("background-color") > -1)) {
                    let val = table[key].split("~");
                    let str = JSON.parse(val[1]);
                    item.value = val[0];
                    if (str["background-color"]) {
                      let obj = {
                        "background-color": str["background-color"]
                      };
                      item.tdStyle = JSON.stringify(obj);
                      delete str["background-color"];
                      item.display_setting_str = JSON.stringify(str);
                    }

                    else {
                      item.display_setting_str = val[1];
                    }
                  } else {
                    item.value = table[key];
                  }
                }
                if (item.display_setting_str) {
                  if (typeof (item.display_setting_str) == 'object') {
                    JSON.stringify(item.display_setting_str);
                  }
                  if (typeof (item.display_setting_str) == 'string') {
                    if (JSON.parse(item.display_setting_str)["background-color"] && JSON.parse(item.display_setting_str)["background-color"].indexOf("$") > -1) {
                      let str = JSON.parse(item.display_setting_str)
                      let obj = {
                        "background-color": str["background-color"]
                      };
                      item.tdStyle = JSON.stringify(obj);
                      delete str["background-color"];
                      item.display_setting_str = JSON.stringify(str);

                    }
                  }

                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }
        let obj = {
          key: t.key,
          items: tableRows
        }
        levelRows.push(obj);
      }

      let finalRows = levelRows;


      let ctrlArr = [];
      for (let c of cbArr) {
        let col = c.coloumns.item_name;
        let fun = {
          itemName: col,
          status: c.status
        }
        ctrlArr.push(fun);
      }
      let grpColumn = [];

      if (this.frame.apexFrameLevel4) {
        for (let c of ctrlArr) {
          for (let itemGroup of this.frame.apexFrameLevel4) {
            for (let itemMast of itemGroup.Level5) {
              if (c.itemName == itemMast.item_name) {
                itemMast.item_visible_flag = 'F';
              }
            }
          }
        }
      }

      for (let f of finalRows) {
        let heads = []
        for (let x of f.items) {
          for (let data1 of x) {
            for (let data2 of data1.Level5) {
              for (let c of ctrlArr) {
                if ((c.itemName == data2.item_name) && data2.item_visible_flag=="T" ) {
                  data2.item_visible_flag = 'F';
                  //  let grp = heads.find(x => x.value == data2.value);
                  let grp = heads.find(x =>(x.itemName ==c.itemName && x.value == data2.value));
                  if (grp) {
                  } else {

                    let obj = {
                      key: data2.prompt_name,
                      value: data2.value,
                      type: data2.datatype,
                      order: false,
                      itemName:c.itemName
                    }
                    heads.push(obj);
                  }
                 
                }
              }
            }
          }
        }
        f.keys = heads
      }
      grpColumn = finalRows
      let head = [];
      let groupHead = []
      for (let itemGroup of grpColumn[0].items[0]) {
        for (let itemMast of itemGroup.Level5) {
          if (itemMast.item_visible_flag == 'T' && itemMast.item_type != 'FRAME_BUTTON_ICON' && itemMast.item_type != 'RIGHT_CLICK') {
            head.push(itemMast.prompt_name)
            groupHead.push(itemMast)

          }
        }
      }

      let iG = 0;
      let brkflag = false;
      let globFlag = true;
      let globToItemFlag = false;
      for (let g of grpColumn) {
        let itemsArr = [];
        let glob = this.controlBreakArr.find(x => JSON.stringify(x.keys) == JSON.stringify(g.keys));
        for (let i of g.items) {
          if (iG == to) {
            brkflag = true;
            break;
          } else {
            if (iG >= from) {
              if (glob && globFlag) {
                itemsArr = glob.items;
                globFlag = false;
                globToItemFlag = true;
              }
              itemsArr.push(i);
            }
          }
          iG++
        }

        let summaryRow = this.calculateFunction(itemsArr, head);


        if (glob && globToItemFlag) {
          glob.items = itemsArr;
          glob.summRow = summaryRow ? summaryRow.summRows : [];
          glob.funRows = summaryRow ? summaryRow.funrow : [];
          globToItemFlag = false;
        } else {
          if (itemsArr.length > 0) {

            let obj = {
              keys: g.keys,
              items: itemsArr,
              summRow: summaryRow ? summaryRow.summRows : [],
              funRows: summaryRow ? summaryRow.funrow : [],
              rowsFlag: false
            }
            this.controlBreakArr.push(obj);
            this.controlBreakArrChange.emit(this.controlBreakArr)
          }
        }
        if (brkflag) {
          break;
        }
      }

      if (this.groupFlag) {

        for (let c of this.controlBreakArr) {
          let data = [];
          for (let a of c.keys) {
            data.push(a);
          }

          for (let f of c.funRows) {
            data.push(f);
          }
          c.pRHead = data;
        }
        this.gpRHead = this.controlBreakArr[0]
        this.gpRHeadChange.emit(this.gpRHead)
      }
      this.controlBreakHead = head;
      this.controlBreakHeadChange.emit(this.controlBreakHead)
      this.groupHeadArr = groupHead
      this.groupHeadArrChange.emit(this.groupHeadArr)
      this.dragedDiv = head;
      this.dragedDivChange.emit(this.dragedDiv)
      this.groupInnerHeader=this.gpRHead?.items[0]
      this.groupInnerHeaderChange.emit(this.groupInnerHeader)
   
      // if(!this.frame.controlBreakArrGrop){
      //   this.frame.controlBreakArrGrop=this.controlBreakArr
      // }

      console.log("this.groupHeadArr : ",this.gpRHead)
    } else {
      this.generateApexPage(1);
    }
  }
  calculateFunction(tablerows, heads) {
    console.log("calclate function");
    var lastRow: any = [];
    var maxMinNum = [];
    var avg = [];
    let funRowlist = []
    this.footerRowFlag = false;
    this.footerRowFlagChange.emit(this.footerRowFlag)
    let tableRows = [];
    if (tablerows) {
      tableRows = tablerows;
    } else {
      tableRows = this.tableRows;
    }

    let head = heads
    let funRowData = []
    for (let i = 0; i < head.length; i++) {
      for (let itemDataArr of tableRows) {
        for (let item of itemDataArr) {
          if (item.Level5) {
            let flag: any;
            if (item.Level5.length > 0 && item.Level5[0].summary_flag_group) {
              let deci: any;
              if (item.Level5[0].summary_flag_group.indexOf("#") > -1) {
                let summ = item.Level5[0].summary_flag_group.split("#");
                flag = summ[0];
                deci = summ[1];
              } else {
                flag = item.Level5[0].summary_flag_group;

              }
              if (flag == "S" || flag == "C" || flag == "A" || flag == "X" || flag == "M") {
                this.footerRowFlag = true;
                this.footerRowFlagChange.emit(this.footerRowFlag)
                if (flag == "S" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value == null) {
                    item.Level5[0].value = "0"
                  }
                  if (lastRow[i]) {
                    lastRow[i] = (parseFloat(lastRow[i]) + parseFloat(item.Level5[0].value.replace(/,/g, ""))).toFixed(deci);
                    funRowlist[i] = {
                      key: item.Level5[0].prompt_name,
                      value: lastRow[i],
                      type: item.Level5[0].datatype
                    }
                  } else {
                    lastRow[i] = parseFloat(item.Level5[0].value.replace(/,/g, "")).toFixed(deci);
                    funRowlist[i] = {
                      key: item.Level5[0].prompt_name,
                      value: lastRow[i],
                      type: item.Level5[0].datatype
                    }
                  }
                  // }
                } else if (flag == "X" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    lastRow[i] = Math.max.apply(null, maxMinNum).toFixed(deci);
                    funRowlist[i] = {
                      key: item.Level5[0].prompt_name,
                      value: lastRow[i],
                      type: item.Level5[0].datatype
                    }
                  }
                }
                else if (flag == "A" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    avg.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    var sum = 0;
                    for (var j = 0; j < avg.length; j++) {
                      sum += parseInt(avg[j], 10); //don't forget to add the base
                    }
                    lastRow[i] = (sum / avg.length).toFixed(deci);
                    funRowlist[i] = {
                      key: item.Level5[0].prompt_name,
                      value: lastRow[i],
                      type: item.Level5[0].datatype
                    }
                  }
                } else if (flag == "C" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (Math.round(parseFloat(lastRow[i])) + 1).toFixed(deci);
                      funRowlist[i] = {
                        key: item.Level5[0].prompt_name,
                        value: lastRow[i],
                        type: item.Level5[0].datatype
                      }
                    } else {
                      lastRow[i] = 1;
                      funRowlist[i] = {
                        key: item.Level5[0].prompt_name,
                        value: lastRow[i],
                        type: item.Level5[0].datatype
                      }
                    }
                  }
                } else if (flag == "M" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    lastRow[i] = Math.min.apply(null, maxMinNum).toFixed(deci);
                    funRowlist[i] = {
                      key: item.Level5[0].prompt_name,
                      value: lastRow[i],
                      type: item.Level5[0].datatype
                    }
                  }
                }
              }
            } else {
              if (lastRow[i]) {

              } else {
                lastRow[i] = "";
                funRowlist[i] = {
                  key: item.Level5[0].prompt_name,
                  value: lastRow[i],
                  type: item.Level5[0].datatype
                }
              }
            }
          } else {
            let flag: any;
            if (item.length > 0 && item[0].summary_flag) {

              let deci: any;
              if (item[0].summary_flag.indexOf("#") > -1) {
                let summ = item[0].summary_flag.split("#");
                flag = summ[0];
                deci = summ[1];
              } else {
                flag = item[0].summary_flag;
              }
              if (flag == "S" || flag == "C" || flag == "A" || flag == "X" || flag == "M") {
                this.footerRowFlag = true;
                this.footerRowFlagChange.emit(this.footerRowFlag)
                if (flag == "S" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (parseFloat(lastRow[i]) + parseFloat(item[0].value.replace(/,/g, ""))).toFixed(deci);
                      funRowlist[i] = {
                        key: item[0].prompt_name,
                        value: lastRow[i],
                        type: item.Level5[0].datatype
                      }
                    } else {
                      lastRow[i] = (parseFloat(item[0].value.replace(/,/g, ""))).toFixed(deci);
                      funRowlist[i] = {
                        key: item[0].prompt_name,
                        value: lastRow[i],
                        type: item.Level5[0].datatype
                      }
                    }
                  }
                } else if (flag == "A" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    avg.push(parseFloat(item[0].value.replace(/,/g, "")));
                    var sum = 0;
                    for (var j = 0; j < avg.length; j++) {
                      sum += parseInt(avg[j], 10); //don't forget to add the base
                    }
                    lastRow[i] = (sum / avg.length).toFixed(deci);
                    funRowlist[i] = {
                      key: item[0].prompt_name,
                      value: lastRow[i],
                      type: item.Level5[0].datatype
                    }
                  }
                } else if (flag == "C" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (Math.round(parseFloat(lastRow[i])) + 1);
                      funRowlist[i] = {
                        key: item[0].prompt_name,
                        value: lastRow[i],
                        type: item.Level5[0].datatype
                      }
                    } else {
                      lastRow[i] = 1;
                      funRowlist[i] = {
                        key: item[0].prompt_name,
                        value: lastRow[i],
                        type: item.Level5[0].datatype
                      }
                    }
                  }
                } else if (flag == "M" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    let strVal = (item[0].value).toString();
                    if (strVal.indexOf(",")) {
                      item[0].value = strVal.replace(/,/g, "")
                    }
                    maxMinNum.push(parseFloat(item[0].value));
                    lastRow[i] = (Math.min.apply(null, maxMinNum));
                    funRowlist[i] = {
                      key: item[0].prompt_name,
                      value: lastRow[i],
                      type: item.Level5[0].datatype
                    }
                  }
                } else if (flag == "X" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    let strVal = (item[0].value).toString();
                    if (strVal.indexOf(",")) {
                      item[0].value = strVal.replace(/,/g, "")
                    }
                    maxMinNum.push(parseFloat(item[0].value));
                    lastRow[i] = (Math.max.apply(null, maxMinNum));
                    funRowlist[i] = {
                      key: item[0].prompt_name,
                      value: lastRow[i],
                      type: item.Level5[0].datatype
                    }
                  }
                }
              }


            }
            else {
              if (lastRow[i]) {
              } else {
                lastRow[i] = "";
                funRowlist[i] = {
                  key: item[0].prompt_name,
                  value: lastRow[i],
                  type: item.Level5[0].datatype
                }
              }
            }
          }
        }
      }
    }

    for (let f of funRowlist) {
      if (f.key !== "WMA_RECORD_INDEX" && f.key !== "WMA_RECORD_STATUS") {
        let x = f.value;
        x = x.toString();
        let lastThree = x.substring(x.length - 3);
        let otherNumbers = x.substring(0, x.length - 3);

        if (otherNumbers != "") lastThree = "," + lastThree;
        f.value = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

        funRowData.push(f)
      }
    }
    let row: any = [];
    for (let td of lastRow) {
      let x = td;
      x = x.toString();
      if (x.indexOf(".") > -1) {
        let array = x.split(".");
        x = array[0];

        let lastThree = x.substring(x.length - 3);
        let otherNumbers = x.substring(0, x.length - 3);

        if (otherNumbers != "") lastThree = "," + lastThree;
        let val = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        row.push(val.toString() + "." + array[1]);
      } else {
        let lastThree = x.substring(x.length - 3);
        let otherNumbers = x.substring(0, x.length - 3);

        if (otherNumbers != "") lastThree = "," + lastThree;
        let val = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        row.push(val);
      }
    }

    if (this.frame.apexFrameLevel4 && this.frame.apexFrameLevel4.length > 0 && (this.controlBreakFlag || this.groupFlag) && this.footerRowFlag) {
      let obj: any = {
        summRows: row
      };
      if (this.groupFlag) {
        obj.funrow = funRowData
      }
      return obj;
    }
  }
  /* End filter */
  // Single record view
  singleSelectRecord() {
    this.isSingleSelectRecord = !this.isSingleSelectRecord
    this.isSingleSelectRecordChange.emit(this.isSingleSelectRecord)
  } 

  // switch to horizontal table
  onSwitchHorizontal() {
    if(this.frame.fullScreen){
      delete this.frame['fullScreen']
    }
    this.frame.temp_frame_type = this.frame.temp_frame_type ? this.frame.temp_frame_type : this.frame.apps_frame_type;
    this.frame.apps_frame_type = 'HORIZONTAL_TABLE';
    this.frame.changeFrameType = true;
    this.processData.afterTableRows(this.frame);
  }

  // Switch to card
  onSwitch() {
    if(this.frame.fullScreen){
      delete this.frame['fullScreen']
    }
    this.frame.temp_frame_type = this.frame.temp_frame_type ? this.frame.temp_frame_type : this.frame.apps_frame_type;
    this.frame.apps_frame_type = 'CARD';
    this.frame.changeFrameType = true;
    if (this.frame.temp_frame_sub_type) {
      this.frame.apps_frame_sub_type = this.frame.temp_frame_sub_type
    }
    this.processData.afterTableRows(this.frame);
  }

  // horizontal table to table
  horizontalToTable() {
    if(this.frame.fullScreen){
      delete this.frame['fullScreen']
    }
  
    if(this.frame.apps_frame_type == 'CARD'){
      if(this.frame.temp_frame_type){
        this.frame.apps_frame_type = this.frame.temp_frame_type;
      }else{
        this.frame.apps_frame_type ='ENTRY_TABLE'
        this.frame.temp_frame_sub_type=this.frame.apps_frame_sub_type
        this.frame.apps_frame_sub_type="BASIC"
      }
    }else{
      if(this.frame.temp_frame_type && (this.frame.apps_frame_type==this.frame.temp_frame_type)){
        delete this.frame['temp_frame_type']
      }
      let temp=this.frame.apps_frame_type
      this.frame.apps_frame_type = this.frame.temp_frame_type ? this.frame.temp_frame_type : 'ENTRY_TABLE';
      this.frame.temp_frame_type=this.frame.temp_frame_type ? this.frame.temp_frame_type :temp
    }
    this.processData.afterTableRows(this.frame);
  }

  // Pivot table
   openPivot(isnew?) {
      let component = WebdatarocksComponent
      let componentProps = {
        frame: this.frame,
        isnew:isnew ? true : false
        // theadData: this.frame.apextheads
      }
      let id = "globe_pivottable_filter"
      let cssClass = ""
      this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((detail) => {
        if (detail.data) {
          // this.getdataFromcanvasApex(detail.data)
        }
      })
    }
   
    popupSubscribe() {
      this.events.subscribe(`popupSubscribe#${this.frame.apps_page_frame_seqid}`, res => {
        this.getdataFromcanvasApex(res)
      });
    }
    ngOnDestroy() {
      this.events.unsubscribe(`popupSubscribe#${this.frame.apps_page_frame_seqid}`);
    }
     //////////////////////////////////////////ai////////////////////////
  aifullScreen(frametable: any, statusai) {
    
    this.frametable=JSON.parse(JSON.stringify(frametable));

    this.frametableChange.emit(this.frametable)
    let fullscreen_idai=frametable.apps_page_frame_seqid;

    if(statusai=='1'){ 
      this.col9="4";
      this.col9Change.emit(this.col9)
          this.isAIUsed=true;
          this.isAIUsedChange.emit(this.isAIUsed)
          if (isPlatformServer(this.platformId)) return;
        let elementai = document.getElementById(fullscreen_idai);
        
       elementai.classList.add("active_aiscreen");
       elementai.classList.add("active_table_gpt");

        elementai.classList.remove("deactive_aicreen");
       document.getElementById(fullscreen_idai+"aiscreen_btn1").style.display = "none";
       document.getElementById(fullscreen_idai+"aiscreen_btn2").style.display = "inherit";
       document.getElementById(fullscreen_idai+"aiscreen_btn2").style.border = "2px solid var(--blue-new)";
       document.getElementById(fullscreen_idai+"aiscreen_btn2").style.backgroundColor = "var(--blue-new)";
       document.getElementById(fullscreen_idai+"aiscreen_btn2").style.color = "#fff";

       let url="getGPTPrompt?page_frame_seqid="+this.frame.apps_page_frame_seqid + '&' + "use_type="+"";

       this.dataservice.getData(url).then((res:any)=>{
        console.log("res : ",res)
        let data=res.responseData;
        let dataemit=[]

        for(let d of data){
          let obj={
            [d.column_name]:d.column_value
          }
          dataemit.push(obj)
        }
        this.aiInputData.emit(dataemit)
       })
    }else{
      this.col9="";
      this.col9Change.emit(this.col9)
      if (isPlatformServer(this.platformId)) return;
      let elementai = document.getElementById(fullscreen_idai); 
    this.frametable="";
    this.frametableChange.emit(this.frametable)
    this.isAIUsed=false;
    this.isAIUsedChange.emit(this.isAIUsed)
       elementai.classList.remove("active_aiscreen");
       elementai.classList.remove("active_table_gpt");

       elementai.classList.add("deactive_aiscreen");
       document.getElementById(fullscreen_idai+"aiscreen_btn1").style.display = "inherit";
       document.getElementById(fullscreen_idai+"aiscreen_btn2").style.display = "none";
    }
  }
  

  removeAll(event){
    event.stopPropagation();
    if(this.frame.single_search){
      this.clear_search(this.frame.single_search,true)
    }

    if(this.frame.linked_search){
      for(let c of this.frame.linked_search){
        this.clear_search(c);
      }
    }
  }

  clear_search(obj,single?) {
    let event = {
      click_events_str:`search_item('${obj.to}','${obj.from}')`,
      indexcount:obj.indexcount,
      apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
      apps_item_seqid: '',
      singleClicked:single
    }
    this.emitPass.emit(event);
  }

  /////////////////////////////ai//////////////////////////////////////////////////////

columnResizeTable(){
  this.isResizableChange.emit(!this.isResizable)
}

  displayDataChange(){
    this.page = 1
    this.pageChange.emit(this.page)
    this.frame.isClickedRowPerPageTable=true
    this.frame.display_no_of_records = this.frame.displayDataLen
    this.frame.rowCount=0
    this.processData.afterTableRows(this.frame);
    this.parentDiv.nativeElement.scrollTop = 0;
  }


 downloadPdf() {
 let title=this.frame.apps_page_frame_name
  let data=this.selectedExportDataType == "allData" ? (this.controlBreakArrPreviousFilter.length>0 ? this.controlBreakArrPreviousFilter: this.controlBreakArr) : this.controlBreakArr
   let datalist=[]
   let head=this.selectedExportDataType == "allData" ? (this.controlBreakArrPreviousFilter.length>0 ? this.controlBreakHeadPreviousFilter: this.controlBreakHead) :this.controlBreakHead
   datalist=[JSON.parse(JSON.stringify(head))]
    for(let d of data){
        let keyValue=[]
        for(let key of d.keys){
          keyValue.push(`${key.key}:${key.value}(${d.items.length})`)
        }
        datalist.push([{ text: keyValue.join(","), colSpan: head.length, bold: true }])
     
        for(let items of d.items){

          let getItem=[]
        for(let item of items){
          for(let i of item.Level5)
           if(i.item_visible_flag == 'T' && i.item_type != 'FRAME_BUTTON_ICON' && i.item_type != 'RIGHT_CLICK'){
              getItem.push(i.value??"")
            }
        }
        datalist.push(JSON.parse(JSON.stringify(getItem)))
      }
      if(d.summRow.length>0){
        datalist.push( JSON.parse(JSON.stringify(d.summRow.map(value => ({
          text: value || '',
          bold: true
        })))))
      }
    }
  
    let pagesize = 'A4'
    let pagemode = 'portrait';
    if (datalist[0].length > 8) {
      pagemode = 'landscape';
    }
    if (datalist[0].length > 12) {
      pagesize = 'A3'
    }

    if (datalist[0].length > 18) {
      pagesize = 'A2'
    }
    var today = new Date();
    let date = this.globalObjects.formatDate(today, "dd-MMM-yyyy")
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ', ' + time;
    var dateenow = `Print on : ${dateTime}`;

    var docDefinition = {
      pageSize: pagesize,
      pageOrientation: pagemode,
      pageMargins: [30, 20, 30, 20],
      content: [
        { text: title, style: 'title', alignment: 'center' },
        { text: '', style: 'subheader' },
        { text: dateenow, style: 'dating', alignment: 'right' },
        {
          table: {
            headerRows: 1, fontSize: 20,
            body: datalist, style: 'body',
          },
          style: 'table',
          layout: {

            orientation: 'landscape',
            hLineStyle: function (rowIndex, node) {
              return { dash: { length: 1, space: 1 } };
            },
            vLineStyle: function (rowIndex, node) {
              return { dash: { length: 1 } };
            },

            fillColor: function (rowIndex, node, columnIndex) {
              if (rowIndex == 0) {
                return '#ffff99';
              } else {

              }
            },
          }
        }
      ],
      styles: {
        title: {
          fontSize: 16,
          alignment: 'auto',
          bold: true,
          background: '#c2f0f0',
          padding: [0, 0, 10, 10],

        },
        table: {
          orientation: 'landscape',
          fontSize: 8,
          alignment: 'auto',
          width: 'auto'
        },

        body: {

          alignment: 'auto',
          width: 'auto'
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'green',
          width: 'auto'
        },
        dating: {
          bold: true,
          fontSize: 8,
          color: 'grey'
        }
      },
    }

    this.globalObjects.downloadPdf2("", docDefinition, title);
  }






}