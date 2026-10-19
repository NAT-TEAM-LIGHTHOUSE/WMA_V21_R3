import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, Directive, ElementRef, ChangeDetectorRef } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
// import { FormatMaskPipe } from 'src/app/pipes/format-mask.pipe';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';

import { SqlLiteService } from 'src/app/services/sql-lite.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { ProcessDataService } from 'src/app/services/process-data.service';
// import { browser } from 'protractor';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ColumnfilterPipe } from 'src/app/pipes/column-filter';
import { FilterColumnDataPipe } from 'src/app/pipes/filter-column-data.pipe';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';
import { ParaTextComponent } from '../../items/item-display/para-text/para-text.component';
import { FrameCanvasFilterComponent } from '../frame-canvas-filter/frame-canvas-filter.component';
import { ButtonNComponent } from '../../items/item-display/button-n/button-n.component';
import { DownloadDocComponent } from '../../items/item-display/download-doc/download-doc.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormatMaskPipe } from 'src/app/pipes/format-mask-pipe';
// import { FilterColumnDataPipe } from 'src/app/pipes/filter-column-data.pipe';

declare var $: any;




@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,ItemsComponent,ParaTextComponent,FrameCanvasFilterComponent,ButtonNComponent,DownloadDocComponent,FormatMaskPipe,DragDropModule],
  selector: 'app-frame-table',
  templateUrl: './frame-table.component.html',
  styleUrls: ['./frame-table.component.scss'],
})
export class FrameTableComponent implements OnInit {

  @ViewChild('tableBody') table2Body: any;
  @ViewChild("parentDiv") parentDiv: any;

  @Input() frame: any = {};
  //frametable: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  flagtoruncanvasfilter: boolean;
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  current_page_parameter: any = {};
  thead: any = {};
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  searchText: any;
  tableRows = [];
  barcodedata: any;
  stickyhead: { position: string; top: string; "z-index": string; };
  filterFormData: any = [];
  sepKey = [];
  pdfheads = [];
  clickShare: boolean = false;
  switchFlag: boolean = false;



  setStrIndex: any = { "width": "20px", "max-width": "20px", "min-width": "15px" };
  disSetId: any;
  clickedHead = [];
  tdWidthh = {};
  tblWidth: any

  public toggleFilter: boolean = false;
  public show: boolean = false;
  public show_filter: boolean = false;
  public horizontal_table: any = 'Show';
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;

  loading: boolean = false;

  loadMoreFlag: string;
  summaryRow: any[];

  addRowBtn: any;
  deleteRowBtn: any;
  cB: any;
  developerModeData: any;
  footerRowFlag: boolean = false;

  calculate: boolean = false;

  colSpan: number = 0;
  subscribeRefreshFlag = false;

  scrollClass = "";
  item_slno_count: number = 1;
  displayDataLen = 50;

  tableData = [];

  filterAbleData = [];
  searchFlag: boolean = false;
  graphFlag: boolean = false;
  pdfFlag: boolean = false;
  excelFlag: boolean = false;
  enablefunnel: boolean = false;
  canvasfilter: any = false;
  item_search_flag: boolean = false;
  tdFlag: boolean = true;

  jsFilter: any;
  advanceFilter: any;
  excelheads: any = {};
  pdfHeading: any;
  getcanvasWCP: boolean = false;
  filter: boolean = false;
  tab: any;
  jsonTableData = [];
  loadingCount = 0;
  callingObjectArr: any = [];
  refreshing = false;
  ddArrayList = [];
  ddCount = 0;

  childFrame: boolean = false;
  ExcelHeading: any;
  excelHeading: any;
  thFlag: boolean = true;
  tHWidth: any
  thWidth: any;

  plt: any = 'browser';

  resizeFlag: boolean = true;

  apexNgStyleFlag: boolean = false;
  apexNgStyle;
  order_by_str;
  controlBreakArr: any = [];
  whereStrFlag: boolean = false;
  controlBreakFlag: boolean = false;
  groupFlag: boolean = false;
  pivotTable: boolean = false;
  freezeColArr = [];
  funArr = [];
  controlBreakHead = [];
  dragedDiv = [];
  isLocked: boolean = false;
  summaryFlag: any;
  id: any;
  freezId: string = '';
  isSearching: number;
  @ViewChild('myTable') myTable: ElementRef;
  activeRow: any;

  constructor(public globalObjects: GlobalObjectsService, private events: Events, private formatMastPipe: FormatMaskPipe, private dataService: DataService, private datePipe: DatePipe, public lhs_lib: LhsLibService,
     public platform: Platform, public modalController: ModalController, private sqlServ: SqlLiteService, private pipemy: SearchfilterPipe, private processData: ProcessDataService,
    private lhsLib: LhsLibService, private loadingCtrl: LoadingController, private colFilter: ColumnfilterPipe, private colRawFilter: FilterColumnDataPipe, private cdr: ChangeDetectorRef) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");

    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-table")
    }
  }

  ngOnInit() {
    var iSpan = document.createElement('span');
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.plt = this.platform;
    }


    for (let itemGroup of this.frame.Level4) {
      for (let item of itemGroup.Level5) {
        if (item.item_name == "WMA_FRAME_STATUS") {
          item.value = 'D';
        }
      }
    }

    // this.frame.headers = JSON.parse(JSON.stringify(this.frame.Level4));

    this.developerModeData = {
      ws_seq_id: "",
      frame_seq_id: this.frame.apps_page_frame_seqid
    };


    if (this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1) {
      this.frame.collapse = false;
      this.frame.showCollapse = true;
    } else {
      this.frame.collapse = true;
      this.frame.showCollapse = false;
    }



    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this.wscp_send_input.apps_working_mode = this.wscp_send_input.apps_working_mode;

    this.tab = this.frame.apps_page_frame_seqid + this.globalObjects.refreshId;

    let exelHeads: any = [];
    let pdfHeads: any = [];

    if (this.frame.display_no_of_records) {
      this.displayDataLen = this.frame.display_no_of_records;
    }

    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      let hideBtnFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }




        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {

          if (itemMast.item_type == "ADD_ROW_BT" || itemMast.item_type == "DELETE_ROW_BT") { }
          else {
            if (!hideBtnFlag) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 1 && (itemGroup.Level5[0].item_type == 'BUTTON' || itemGroup.Level5[0].item_type == 'BUTTON_ICON')) {
                hideBtnFlag = true
              }

              if (itemMast.item_type == 'CHECK_BOX') {
                theaddata.push(itemMast.prompt_name);
              } else {
                theaddata.push(itemMast.prompt_name);
              }
            }
          }

          if (itemMast.item_type == 'BT' || itemMast.item_type == 'DISPLAY_PHOTO' || itemMast.item_type == 'DOWNLOAD_DOC' || itemMast.item_type == 'BUTTON_ICON' || itemMast.item_type == 'FRAME_SEPARATOR' || itemMast.item_type == 'FRAME_BUTTON_ICON') {

          } else {
            exelHeads.push(itemMast.prompt_name);
          }

          if (itemMast.item_type == 'BT' || itemMast.item_type == 'DOWNLOAD_DOC' || itemMast.item_type == 'BUTTON_ICON' || itemMast.item_type == 'FRAME_SEPARATOR' || itemMast.item_type == 'FRAME_BUTTON_ICON') {

          } else {
            pdfHeads.push(itemMast.prompt_name);
          }
        }
        if (itemMast.item_visible_flag == 'F') {
          if (itemMast.mirrored_items) {
            exelHeads.push(itemMast.prompt_name);
          }
        }


        if (itemMast.item_type == 'ADD_ROW_BT') {
          this.addRowBtn = itemMast;
        }
        if (itemMast.item_type == "DELETE_ROW_BT") {
          this.deleteRowBtn = itemMast;
        }
        if (itemMast.item_type == "CHECK_BOX" && itemMast.item_sub_type == 'SELECT_ALL') {
          this.cB = itemMast;
        }

        itemMast.indexCount = 0;

        if (itemMast.item_default_value == 'INDEX') {
          itemMast.value = 1;
        }

        if (itemMast.mirror_item_seqid) {
          let val = this.lhsLib.get_item_value(itemMast.mirror_item_seqid, 0);
          itemMast.value = val;
        }


        if (itemMast.item_type == "LIST_BOX") {
          this.ddArrayList.push(itemMast);
        }

        if (itemMast.summary_flag) {
          this.calculate = true;
        }

        if (!itemMast.search) {
          itemMast.search = "%%";
        }
      }

      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }
    }

    this.stickyhead = {
      "position": "sticky",
      "top": "-1px",
      "z-index": "9"
    }

    if (this.frame.frame_filter_flag && this.frame.frame_filter_flag.toUpperCase().indexOf("TABLE_SCROLL") > -1) {
      this.scrollClass = "table-scroll";
      this.stickyhead = {
        "position": "sticky",
        "top": "-1px",
        "z-index": "9"
      }
    }

    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split(";") : null;
    if (frameFilterFlag) {
      for (let x of frameFilterFlag) {
        if (x.toUpperCase() === 'SEARCH_BAR') {
          this.searchFlag = true;
          if (!this.frame.search) {
            this.frame.search = "";
          }
        }
        if (x.toUpperCase() === 'G') {
          this.graphFlag = true;
        }
        if (x.toUpperCase() === 'PDF') {
          this.pdfFlag = true;
        }
        if (x.toUpperCase() === 'IS') {
          this.item_search_flag = true;
        }
        if (x.toUpperCase() === 'EXCEL') {
          this.excelFlag = true;
        }
        if (x.toUpperCase() == 'C' || x.toUpperCase() == 'J' || x.toUpperCase() == 'SMART_FILTER' || x.toUpperCase() == 'D&D' || x.toUpperCase() == 'ACTION') {
          // this.filter=true;
          this.enablefunnel = true;
        }
        if (x.toUpperCase() === 'STC') {
          this.switchFlag = true;
        }
        if (x.toUpperCase() === 'NO_SORT') {
          this.frame.noSortFlag = true;
        }
        if (x.toUpperCase() === 'NO_PAGINATE') {
          this.frame.noPagination = true;
        }
        if (x.toUpperCase() === 'NO_DOWNLOAD') {
          this.frame.noDownload = true;
        }
      }
    }

    let level4 = [];
    if (this.frame.Level4 && this.frame.Level4.length > 0) {
      level4[0] = JSON.parse(JSON.stringify(this.frame.Level4))
      let sepdata = this.lhs_lib.seprateData(this.frame, level4)
      this.frame.headers = sepdata[0];
    }
    this.thead = theaddata;
    this.frame.tHead = this.thead;
    this.pdfheads = pdfHeads;
    this.excelheads = exelHeads;
    this.frame.rowsPerPage = this.displayDataLen;
    this.frame.active_row = 0;
  }

  onSwitch() {
    this.frame.apps_frame_type = 'CARD';
    this.processData.populateRows(this.frame.apps_page_frame_seqid, this.frame.tableData);
  }


  getdataFromcanvasFilter(event) {
    if (event.apex) {
      this.getdataFromcanvasApex(event);
    } else if (event.where_Arr) {
      this.filterFunc(event);
      this.show_filter = false;
    }

  }


  getdataFromcanvasApex(event) {

    //console.log(event);
    /* if (event.apex_show_col) {

      this.thead = event.thead;
      this.frame.tableRows = event.apex_show_col;
    } */
    if (event.ngStyle) {
      this.apexNgStyle = event.ngStyle;
      this.apexNgStyleFlag = true
    }
    else if (event.apex_orderBy_str) {
      this.getcanvasWCP = true;
      this.order_by_str = event.apex_orderBy_str;
      this.frame.order_by_str = this.order_by_str;
      this.controlBreakArr = [];
      this.whereStrFlag = true;
      this.generateApexPage(1);
    } else if (event.visibleItems) {
      // this.thead = event.thead;
      this.summaryRow = [];
      this.frame.tableRows = [];
      this.controlBreakArr = [];
      this.generateApexLevel4();
      this.generateApexPage(1);
    }
    // else if (event.apex_where_str) {
    //   this.getcanvasWCP = true;
    //   this.l_where_str = event.apex_where_str;
    //   this.frame.l_where_str = this.l_where_str;
    //   this.controlBreakArr = [];
    //   this.whereStrFlag = true;
    //   this.paginate(1);
    // }
    else if (event.filteredData) {
      this.summaryRow = [];
      this.frame.tableRows = [];
      this.controlBreakArr = [];
      this.filterAbleData = event.filteredData;
      if (this.filterAbleData.length > 0) {
        // this.displayData(0, this.displayDataLen, 1, event.filteredData);
        this.processData.populateRows(this.frame.apps_page_frame_seqid, event.filteredData, 0, this.displayDataLen, 1);
        // this.paginate(1);
      } else {
        this.tableRows = [];
        this.frame.tableRows = [];
      }
    }
    else if (event.funArr || event.groupBy) {

      if (event.groupBy) {
        this.funArr = event.groupBy.funArr;
        this.controlBreakFlag = false;
        this.groupFlag = true;

      } else {

        this.funArr = event.funArr;
        this.controlBreakFlag = false;
        // this.groupFlag = true;
      }
      this.generateApexLevel4();

      this.displayData(0, this.frame.tableData.length);
      // this.paginate(1);

    } else if (event.noOfRecords) {

      this.displayDataLen = parseInt(event.noOfRecords);

      this.frame.tableRows = [];
      this.controlBreakArr = [];
      this.generateApexPage(1);
    } else if (event.ctrlBreakArr) {
      // for(let c of event.ctrlBreakArr.controlBr){ 
      // event.ctrlBreakArr = c;
      // if (event.ctrlBreakArr.length > 0) {
      this.funArr = event.ctrlBreakArr.funArr;
      this.controlBreakFlag = true;
      this.groupFlag = false;
      // }
      // }
      // this.controlBreakArr = [];
      this.generateApexLevel4();
      // this.displayData(0, 50);
      this.displayData(0, this.frame.tableData.length);
    } else if (event.searchTabData) {
      this.frame.searchTabData = event.searchTabData;
      this.controlBreakArr = [];
      this.processData.populateRows(this.frame.apps_page_frame_seqid, this.tableData, 0, this.displayDataLen, 1);
    } else if (event.clear) {
      // this.frame.searchTabData = event.searchTabData;
      if (event.clear == 'groupBy') {
        this.groupFlag = false;
        this.funArr = [];
        this.frame.tableRows = [];
        this.frame.apexFrameLevel4 = [];
        this.frame.headers = JSON.parse(JSON.stringify((this.frame.Level4)));
        this.frame.tHead = this.thead;
        this.controlBreakFlag = false;
        if (event.head) {
          this.thead = event.head;
          this.frame.tHead = this.thead;
        }
        this.frame.tableRows = [];
        this.controlBreakArr = [];
        this.generateApexPage(1);
      } if (event.clear == 'All') {
        this.displayDataLen = 50;
        this.controlBreakFlag = false;
        this.groupFlag = false;
        this.frame.tableRows = [];
        this.frame.controlBreakArr = [];
        this.filterAbleData = [];
        this.frame.apexFrameLevel4 = [];
        this.frame.headers = JSON.parse(JSON.stringify((this.frame.Level4)));
        this.frame.tHead = this.thead;
        this.summaryRow = [];
        this.funArr = [];
        this.footerRowFlag = false;
        this.ngOnInit();
      }
      // this.displayData(0, this.displayDataLen, 1);
    } else if (event.freezeCol) {
      this.freezeColArr = event.freezeCol;
      this.frame.tableRows = [];
      this.frame.controlBreakArr = [];
      this.generateApexLevel4();
      this.generateApexPage(1);
    } else if (event.showPivot) {

    }

    if (event.headclasses) {
      this.frame.headclasses = event.headclasses;

    }
    if (event.headLength) {
      this.frame.freezLength = event.headLength;
    } else {
      this.frame.freezLength = 0;
      // this.paginate(1);
    }
  }



  generateApexLevel4() {
    let framelevel4 = [];
    this.frame.apexFrameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    framelevel4 = this.frame.apexFrameLevel4;

    let coloumnHead = [];
    let funhead = [];
    let theaddata = [];
    let seqArr1 = [];
    let seqArr2 = [];
    let newArr = [];
    let newSummaryRow = [];

    if (this.frame.visibleItems && this.frame.visibleItems.length > 0) {
      for (let v of this.frame.visibleItems) {
        for (let itemGroup of this.frame.apexFrameLevel4) {
          for (let item of itemGroup.Level5)
            if (item.item_name == v.item_name) {
              item.item_visible_flag = 'T';
              newArr.push(itemGroup);
            }
        }
      }
    }

    for (let itemGroup of framelevel4) {
      for (let itemMast of itemGroup.Level5) {

        for (let f of this.funArr) {
          if (f.coloumns.item_name == itemMast.item_name) {
            funhead.push(itemMast.prompt_name)
            itemMast.summary_flag_group = f.fun;
          }
        }


        if (this.frame.ctrlBrkCond) {
          for (let c of this.frame.ctrlBrkCond) {
            if (c.coloumns) {
              if (c.coloumns.item_name == itemMast.item_name) {
                let val = coloumnHead.find(x => x == itemMast.prompt_name);
                if (val) { } else {
                  coloumnHead.push(itemMast.prompt_name);
                }
              }
            } else {
              if (c.itemName == itemMast.item_name) {
                coloumnHead.push(itemMast.prompt_name)
                itemMast.item_visible_flag = 'F';
              }
            }
          }
        }

        if (this.frame.visibleItems && this.frame.visibleItems.length > 0) {
          let visible = this.frame.visibleItems.find(x => x.item_name == itemMast.item_name);
          if (!visible) {
            itemMast.item_visible_flag = 'F';
            newArr.push(itemGroup);
          }
        }
        if (this.freezeColArr.length > 0) {
          for (let f of this.freezeColArr) {
            if (itemMast.prompt_name == f.prompt_name) {
              itemMast.freezeColumn = f.style;
              // itemMast.freezeColumn = true
            }
          }
        }

        if (itemMast.item_visible_flag == 'T') {
          if (itemMast.freezeColumn) {
            let obj = {
              prompt_name: itemMast.prompt_name,
              frezeStyle: itemMast.freezeColumn
            }
            theaddata.push(obj);
          } else {
            theaddata.push(itemMast.prompt_name);
          }
        }

      }
    }


    //Code to arrange in sequence
    if (this.frame.ctrlBrkCond && this.frame.ctrlBrkCond.length > 0) {
      for (let c of this.frame.ctrlBrkCond) {
        for (let itemGroup of framelevel4) {
          for (let itemMast of itemGroup.Level5) {
            if (c.coloumns) {
              if (c.coloumns.item_name == itemMast.item_name) {
                seqArr1.push(itemGroup);
              }
            } else {
              if (c.itemName == itemMast.item_name) {
                seqArr1.push(itemGroup);
              }
            }
          }
        }
      }
      for (let itemGroup of framelevel4) {
        for (let itemMast of itemGroup.Level5) {
          let found = false;
          for (let c of seqArr1) {
            for (let item of c.Level5) {
              if (item.item_name == itemMast.item_name) {
                found = true;
              }
            }
          }
          if (!found) {
            seqArr2.push(itemGroup);
          }
        }
      }
      let seqArrFinal = seqArr1.concat(seqArr2);
      this.frame.apexFrameLevel4 = JSON.parse(JSON.stringify((seqArrFinal)));

    }


    if (this.freezeColArr && this.freezeColArr.length > 0) {
      let thead1 = [];
      let thead2 = [];
      for (let f of this.freezeColArr) {
        for (let itemGroup of framelevel4) {
          for (let itemMast of itemGroup.Level5) {
            if (itemMast.prompt_name == f.prompt_name) {
              seqArr1.push(itemGroup);
              if (itemMast.freezeColumn) {
                let obj = {
                  prompt_name: itemMast.prompt_name,
                  frezeStyle: itemMast.freezeColumn
                }
                thead1.push(obj);
              }
            }
          }
        }
      }
      for (let itemGroup of framelevel4) {
        for (let itemMast of itemGroup.Level5) {
          let found = false;
          for (let c of seqArr1) {
            for (let item of c.Level5) {
              if (item.item_name == itemMast.item_name) {
                found = true;
              }
            }
          }
          if (!found) {
            seqArr2.push(itemGroup);
            if (itemMast.item_visible_flag == 'T') {
              thead2.push(itemMast.prompt_name);
            }
          }
        }
      }
      let seqArrFinal = seqArr1.concat(seqArr2);
      this.frame.apexFrameLevel4 = JSON.parse(JSON.stringify((seqArrFinal)));
      theaddata = thead1.concat(thead2);
    }


    if (newArr.length > 0) {
      this.frame.apexFrameLevel4 = JSON.parse(JSON.stringify((newArr)));
    }


    //   if( this.frame.summary_rows && this.frame.summary_rows.length > 0){
    //     for(let itemGroup of this.frame.summary_rows){
    //       for(let item of itemGroup.Level5){
    //         if (this.frame.visibleItems && this.frame.visibleItems.length > 0) {
    //           let visible = this.frame.visibleItems.find(x => x.item_name == item.item_name);
    //           if (!visible) {
    //             item.item_visible_flag = 'F';
    //             newSummaryRow.push(itemGroup);
    //           }
    //         }      
    //         if(newSummaryRow && newSummaryRow.length > 0){
    //           this.frame.apexSummaryLevel4 = JSON.parse(JSON.stringify((newSummaryRow)));
    //         }
    //     }
    //   }
    // }



    this.thead = theaddata;
    // this.parentHead = coloumnHead;
    this.controlBreakArr = [];
    // this.frame.tableRows = [];
    this.frame.tHead = this.thead;
    this.frame.headers = JSON.parse(JSON.stringify((this.frame.apexFrameLevel4)));
    // this.frame.summary_rows = JSON.parse(JSON.stringify((this.frame.apexSummaryLevel4)));
  }


  displayData(from, to) {

    let noOfRecords;
    noOfRecords = this.displayDataLen;


    let l_total_pages: any = Math.ceil(this.l_total_rows / noOfRecords);

    if (l_total_pages && l_total_pages == "Infinity" || isNaN(l_total_pages)) {
      this.l_total_remain_pages = 1;
    } else {
      this.l_total_remain_pages = l_total_pages;
    }

    //  this.showLoading = true;
    this.globalObjects.switchTableData = [];
    this.globalObjects.switchSearchStr = "";


    if (this.controlBreakFlag || this.groupFlag) {
      let cbArr = this.frame.ctrlBrkCond;
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

      // for (let i = from; i < to; i++){
      //   this.showingTabelData.push(this.tableData[i])
      // }

      //console.log(ctrlStr);
      let tabdata = [];

      if (this.filterAbleData.length > 0) {
        tabdata = this.filterAbleData;
      } else {
        tabdata = this.tableData;
      }
      // if (this.frame.searchTabData && this.frame.searchTabData.length > 0) {
      //   tabdata = this.frame.searchTabData
      // } else {
      //   tabdata = this.tableData
      // }
      var tabRows = this.lhs_lib.groupBy(this.frame.tableData, function (item) {
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

          //  frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

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
                  if (item.display_setting_str) {
                    if (typeof (item.display_setting_str) == 'object') {
                      JSON.stringify(item.display_setting_str);
                    }
                    if ((item.display_setting_str)["background-color"] && typeof (item.display_setting_str) == 'string' && (item.display_setting_str)["background-color"].indexOf("$") > -1) {
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
        //  t.items = tableRows;
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
                if ((c.itemName == data2.item_name) && data2.value) {
                  data2.item_visible_flag = 'F';
                  let grp = heads.find(x => x.value == data2.value);
                  if (grp) {
                  } else {
                    let obj = {
                      key: data2.prompt_name,
                      value: data2.value
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
      //console.log(grpColumn);
      let head = [];
      for (let itemGroup of grpColumn[0].items[0]) {
        for (let itemMast of itemGroup.Level5) {
          if (itemMast.item_visible_flag == 'T') {
            head.push(itemMast.prompt_name)
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
        console.log("summaryRow", summaryRow)
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

      }
      //console.log(this.controlBreakArr);
      this.controlBreakHead = head;
      this.dragedDiv = head;
      // this.controlBreakArr = grpColumn;
    } else {
      this.generateApexPage(1);
    }

  }

  // getParsedJson(json) {
  //   // try {
  //   //   if (json) {
  //   //     return JSON.parse(json)
  //   //   } else {
  //   //     return {}
  //   //   }
  //   // } catch (err) {
  //   //   if (typeof json == 'object') {
  //   //     return json;
  //   //   } else {
  //   //     return {}
  //   //   }
  //   // }
  // }
  getParsedJson(json) {
    // this.globalObjects.getParsedJson(json)
    if(!json){
      return {}
    }
    try {
      if (typeof(json) == "string") {
        return JSON.parse(json);
      }
      if (typeof(json) == 'object' && json != null) {
        return json;
      }
    } catch (err) {
      console.error("error violation", err)
      return
    }
  }
  filterToggle() {
    if (this.show_filter) {
      this.show_filter = false;
    } else {
      this.show_filter = true;

      let frameFilterFlag = this.frame.frame_filter_flag.split(";");
      for (let x of frameFilterFlag) {
        if (x === 'C' || x === 'J' || x === 'SMART_FILTER' || x === 'ACTION' || x === 'D&D') {
          this.toggleFilter = true;
        } else {
          this.toggleFilter = true;
        }
      }
    }
    this.cdr.detectChanges();
  }


  itemValueChange(event, rowindex, rowsdata) {

    if (event.itemClicked == 'post' || event.itemClicked == 'load') {
      let col = {};
      if (this.frame.tableRows && this.frame.tableRows.length > 0) {
        for (let itemGroup of rowsdata) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues;
              } else {
                col[item.apps_item_seqid] = item.value ? item.value.toString() : "";
              }
            }
          }
        }
      }
      event.wsdpcl = [];
      event.wsdpcl.push(col);
      this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
      event.wscp = this.wscp_send_input;
      event.itemIndex = rowindex;
      event.wsdpcl = [];
      event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);
      this.emitPass.emit(event);
    }

    if (event.on_blur) {
      this.onItemBlur(event, rowindex);
    }
    if (event.dependent_column_str && (event.value || event.value == 0)) {
      let wsdp = [];
      let dependent_column_arr = event.dependent_column_str.split("#");
      if (this.frame.tableRows) {
        let col = {};
        for (let itemGroup of this.frame.tableRows[rowindex]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues
              } else {
                if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                  col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                } else {
                  col[item.apps_item_seqid] = item.value;
                }
              }
              if (dependent_column_arr.indexOf(item.apps_item_seqid) > -1) {
                item.codeOfValues = ""
                item.value = ""
              }
              if (item.formula_str) {
                item.value = this.globalObjects.autoCalculation(item.formula_str, this.frame.tableRows[rowindex])
              }
            }
          }
        }
        wsdp.push(col);
      } else {
        for (let itemGroup of this.frame.Level4) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (dependent_column_arr.indexOf(item.apps_item_seqid) > -1) {
                item.codeOfValues = ""
                item.value = ""
              }
            }
          }
        }
      }
      event.wsdp = wsdp;
      if (event.dependent_column_sql) {
        this.getDependentData(event, rowindex).then(res => {
          if (res === "success") {
            if (event.post_text_validate_plsql) {
              this.PostTextValidatePlsql(event, rowindex);
            }
          }
        });
      } else if (event.post_text_validate_plsql) {
        this.PostTextValidatePlsql(event, rowindex);
      }
    }

    if (this.calculate) {
      this.calculateTableData(this.tableData);
    }
    if (event.itemClicked == 'post' || event.itemClicked == 'load') { } else {
      if (event.click_events_str && ((event.click_events_str.indexOf("addItem") > -1) || (event.click_events_str.indexOf("open_lov") > -1))) {
        if (event.value || (event.click_events_str.indexOf("open_lov") > -1)) {
          this.itemClicked(event, this.frame.tableRows[rowindex], rowindex);
        }
      }
    }
  }


  onItemBlur(event, rowindex) {
    if (event.on_blur) {

      if (this.frame.tableRows) {
        this.globalObjects.onBlurEvent(event, event.on_blur, this.frame.tableRows[rowindex]);
      }
    }
  }

  getDependentData(event, rowindex) {
    return new Promise((resolve, reject) => {
      let wscp: any = {};
      wscp.service_type = "getDependentColumns";
      wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
      wscp.item_sub_type = this.wscp_send_input.item_sub_type;
      wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      wscp.apps_item_seqid = event.apps_item_seqid;
      wscp.apps_page_no = event.apps_page_no;
      wscp.object_code = event.object_code;

      let newWsdp = [];
      newWsdp.push(Object.assign(this.wsdp[0], event.wsdp[0]));

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": newWsdp
      }
      this.globalObjects.showLoading();
      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {

        let data: any = res;

        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData)
          if (objData && (objData.Level1.length > 0) && (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q")) {
            if (objData.Level1[0].message) {
              this.globalObjects.presentAlert(objData.Level1[0].message);
            }
          }
          resolve("success");
          let keyValue = data.responseData;
          for (let itemGroup of this.frame.tableRows[rowindex]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (keyValue.Level1_Keys.indexOf(item.item_name) > -1) {
                  item.value = keyValue.Values[0][keyValue.Level1_Keys.indexOf(item.item_name)]
                }
              }
            }
          }
        }
      }).catch(err => {
        //console.log("this.frame canvas err");


        this.globalObjects.presentToast("1.6 Something went wrong please try again later!");
        //console.log(err);
      })
    })
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

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }

    this.globalObjects.showLoading();

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {

      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let keyValue = data.responseData;
        // if (objData.Level1[0].status == "F") {
        //   alert(objData.Level1[0].message);
        //   for (let itemGroup of this.frame.tableRows[rowindex]) {
        //     if (itemGroup.Level5) {
        //       for (let item of itemGroup.Level5) {
        //         if (objData.Level1[0].item_name == item.item_name) {
        //           item.value = "";
        //           item.codeOfValues = "";
        //         }
        //       }
        //     }
        //   }
        // }
        if (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q") {
          if (objData.Level1[0].message) {
            this.globalObjects.presentAlert(objData.Level1[0].message);
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
          this.globalObjects.presentAlert(objData.Level1[0].message);
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
        }
      }
    }).catch(err => {

      this.globalObjects.presentToast("1.9 Something went wrong please try again later!");
      //console.log(err);
    })
    // }
  }



  // paginate(a_current_page) {
  //   this.frame.page_no = a_current_page;

  //   let to = a_current_page * this.displayDataLen;
  //   let from = to - this.displayDataLen;
  //   let data = this.frame.tableData;
  //   if (this.frame.searchableData) {
  //     data = this.frame.searchableData;
  //   }


  //   if (data.length > from) {
  //     this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, a_current_page);
  //   }
  // }

  // paginate(a_current_page) {
  //   this.frame.page_no = a_current_page;

  //   let to = a_current_page * this.displayDataLen;
  //   let from = to - this.displayDataLen;
  //   let data = this.frame.tableRows;
  //   if (this.frame.searchableData) {
  //     data = this.frame.searchableData;
  //   }

  //   if (data.length > from) {
  //     this.frame.from_record = from;
  //     this.frame.to_record = to;
  //     // this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, a_current_page);
  //     this.processData.afterTableRows(this.frame);
  //   }
  // }


  paginate(a_current_page) {
    this.frame.page_no = a_current_page;
    let to = a_current_page * this.displayDataLen;
    let from = to - this.displayDataLen;
    this.frame.from_record = from;
    this.frame.to_record = to;

    if (!this.frame.maximum_no_of_pages_navigated || this.frame.maximum_no_of_pages_navigated < a_current_page) {
      this.frame.maximum_no_of_pages_navigated = a_current_page;
    }
    this.frame.active_row = this.frame.from_record;
    this.processData.afterTableRows(this.frame, from, to, this.frame.page_no);
    this.cdr.detectChanges();
    // this.lhs_lib.getSepratorGrp(this.frame);
    // this.processData.populateRows(this.frame.apps_page_frame_seqid, this.frame.tableData, from, to, a_current_page);
  }

  generateApexPage(a_current_page) {

    this.frame.page_no = a_current_page;

    let to = a_current_page * this.displayDataLen;
    let from = to - this.displayDataLen;
    let data = this.frame.tableData;
    if (this.frame.searchableRawData) {
      data = this.frame.searchableRawData;
    }

    if (data.length > from) {
      this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, a_current_page);
    }
  }


  goToLast(num) {

    this.frame.page_no = num;

    let to = num * this.displayDataLen;
    let from = to - this.displayDataLen;

    let data = this.frame.tableData;
    if (this.frame.searchableData) {
      data = this.frame.searchableData;
    }


    this.processData.afterTableRows(this.frame, from, to, this.frame.page_no);
    // if (data.length > from) {
      // this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, num);
    // }
    this.cdr.detectChanges();

  }

  goFirst(num) {

    this.frame.page_no = num;

    let to = num * this.displayDataLen;
    let from = to - this.displayDataLen;

    let data = this.frame.tableData;
    if (this.frame.searchableData) {
      data = this.frame.searchableData;
    }
    this.processData.afterTableRows(this.frame, from, to, this.frame.page_no);
    this.cdr.detectChanges();
    // this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, num);
  }


  calculateData(tablerows) {
    var lastRow: any = [];
    var maxMinNum = [];
    var avg = [];
    this.footerRowFlag = false;
    let tableRows = [];

    if (tablerows) {
      tableRows = tablerows;
    } else {
      tableRows = this.tableRows;
    }

    for (let i = 0; i < this.thead.length; i++) {
      lastRow[i] = "";
    }

    for (let itemDataArr of tableRows) {
      for (let item of itemDataArr) {
        if (item.Level5[0].summary_flag) {
          let flag: any;
          let deci: any;
          if (item.Level5[0].summary_flag.indexOf('#') > -1) {
            let summ = item.Level5[0].summary_flag.split('#');
            flag = summ[0];
            deci = summ[1];
          } else {
            flag = item.Level5[0].summary_flag;
          }
          if (flag == 'S' || flag == 'C' || flag == 'A' || flag == 'X' || flag == 'M') {
            this.footerRowFlag = true;
            if (!item.Level5[0].value) {
              item.Level5[0].value = 0;
            }
            if (typeof (item.Level5[0].value) == "number") {
              item.Level5[0].value = JSON.stringify(item.Level5[0].value)
            }
            if (flag == 'S' && this.thead.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
              if (lastRow[this.thead.indexOf(item.Level5[0].prompt_name)]) {
                lastRow[this.thead.indexOf(item.Level5[0].prompt_name)] = (parseFloat(lastRow[this.thead.indexOf(item.Level5[0].prompt_name)]) + parseFloat(item.Level5[0].value.replace(/,/g, ''))).toFixed(deci);
              }
              else {
                lastRow[this.thead.indexOf(item.Level5[0].prompt_name)] = parseFloat(item.Level5[0].value.replace(/,/g, '')).toFixed(deci);
              }
            }
            else if (flag == 'A' && this.thead.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
              if (item.Level5[0].value) {
                avg.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
                lastRow[this.thead.indexOf(item.Level5[0].prompt_name)] = Math.max.apply(null, maxMinNum);
                var sum = 0;
                for (var j = 0; j < avg.length; j++) {
                  sum += parseInt(avg[j], 10); //don't forget to add the base
                }
                lastRow[this.thead.indexOf(item.Level5[0].prompt_name)] = (sum / avg.length).toFixed(deci);
              }
            }
            else if (flag == 'C' && this.thead.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
              if (lastRow[this.thead.indexOf(item.Level5[0].prompt_name)]) {
                lastRow[this.thead.indexOf(item.Level5[0].prompt_name)] = (Math.round(parseFloat(lastRow[this.thead.indexOf(item.Level5[0].prompt_name)].replace(/,/g, ''))) + 1).toFixed(deci);
              }
              else {
                lastRow[this.thead.indexOf(item.Level5[0].prompt_name)] = 1;
              }
            }
            else if (flag == 'M' && this.thead.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
              if (item.Level5[0].value) {
                maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
                lastRow[this.thead.indexOf(item.Level5[0].prompt_name)] = (Math.min.apply(null, maxMinNum)).toFixed(deci);
              }
            }
          } else if (flag == 'X' && this.thead.indexOf(item.Level5[0].prompt_name) > -1 && item.Level5[0].value) {
            if (item.Level5[0].value) {
              maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, '')));
              lastRow[this.thead.indexOf(item.Level5[0].prompt_name)] = Math.max.apply(null, maxMinNum).toFixed(deci);
            }
          }

        }
      }
    }

    lastRow.shift();
    return lastRow;
  }

  throttle(callback, delay = 500) {
    let timerFlag = null;
    let event = null;
    return (...args) => {
      if (timerFlag === null || (JSON.stringify(args[1] != event))) {
        event = JSON.stringify(args[1]);
        callback(...args);
        timerFlag = setTimeout(() => {
          timerFlag = null;
          event = null;
        }, delay);
      }
    };
  }

  itemClick = this.throttle((ev,event, rowsdata, j) => {

    ev.stopPropagation();
    let isValid = true;
    var rowindex;
    let itemPKey = "";

    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = event.indexcount;

    this.cdr.detectChanges();
    if (this.frame.apps_page_frame_seqid.split("-")[2].includes("A") && event.item_type != "BUTTON_ICON" && event.item_type != "BUTTON") {

      let item;
      let to = this.frame.apps_page_frame_seqid.slice(0, (this.frame.apps_page_frame_seqid.length - 1));

      for (let dataRow of this.frame.tableRows[this.frame.active_row]) {
        for (let r of dataRow.Level5) {
          if (r.item_name.toUpperCase() == "SYS_EDIT_RECORD") {
            item = JSON.parse(JSON.stringify(r));
          }
        }
      }

      if (item) { } else {
        // item.click_events_str = `app_edit_record('${to}','${this.frame.apps_page_frame_seqid}');app_execute_item('${to}.PB_ARP','click_events_str',0)`;
        item = JSON.parse(JSON.stringify(event));
        item.click_events_str = `app_edit_record('${to}','${this.frame.apps_page_frame_seqid}')`;
      }

      item.itemIndex = j;
      item.isAssociate = true;
      item.itemClicked = 'pre';
      this.emitPass.emit(item);

    } else {

      if (event.item_enable_flag != 'F') {

        if (typeof (rowsdata) != "number") {
          for (let dataRow of rowsdata) {
            if (dataRow.Level5) {
              for (let r of dataRow.Level5) {
                if (r.item_name == "DB_TABLE_PKEY") {
                  itemPKey = r.value;
                }
                if (r.mirrored_items) {
                  this.lhs_lib.set_mirror_values(r);
                }
              }
            }
          }
        }

        if (isNaN(rowindex)) {
          rowindex = j;
        }

        if (rowindex == undefined || this.frame.calenderflag) {
          rowindex = j;
        }

        ///////////////////////////////////////////////////////

        let col = {};
        if (this.frame.tableRows && this.frame.tableRows.length > 0) {
          for (let itemGroup of rowsdata) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {

                if (item.item_name == 'WMA_RECORD_INDEX' && item.value == undefined) {
                  item.value = rowindex;
                }


                if (item.codeOfValues) {
                  col[item.apps_item_seqid] = item.codeOfValues
                } else if (item.value) {
                  col[item.apps_item_seqid] = item.value
                } else {
                  col[item.apps_item_seqid] = ""
                }


                if (item.session_hold_flag == 'T') {
                  if (this.sessionObj) {
                    this.sessionObj[item.item_name] = item.value
                  } else {
                    this.sessionObj = {};
                    this.sessionObj[item.item_name] = item.value
                  }
                }

                if (event.item_enable_flag != 'F') {
                  if (event.item_type != 'BUTTON' && event.item_type != 'BT' && event.item_type != 'BUTTON_ICON' && !event.isAssociate && item.item_name == 'WMA_RECORD_STATUS') {
                    item.frame_status = 'dirty';
                  }
                }
              }
            }
          }
        }
        event.wsdpcl = [];
        event.wsdpcl.push(col);
        this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
        event.wscp = this.wscp_send_input;

        if (isValid) {
          event.sessionObj = this.sessionObj;
          event.itemIndex = rowindex;
          event.itemPKey = itemPKey;
          event.callingObjectArr = this.frame.callingObjectArr;
          // event.itemIndex = i;

          delete event['returnId'];
          delete event['returnIndex'];
          if (event.item_enable_flag != 'F') {
            this.emitPass.emit(event);
          }
        }
      }
    }

  })

  itemClicked(event, rowsdata, j) {

    let isValid = true;
    var rowindex;
    let itemPKey = "";

    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = event.indexcount;

    this.cdr.detectChanges();
    if (this.frame.apps_page_frame_seqid.split("-")[2].includes("A")) {

      let item;
      let to = this.frame.apps_page_frame_seqid.slice(0, (this.frame.apps_page_frame_seqid.length - 1));


      for (let dataRow of this.frame.tableRows[this.frame.active_row]) {
        for (let r of dataRow.Level5) {
          if (r.item_name.toUpperCase() == "SYS_EDIT_RECORD") {
            item = JSON.parse(JSON.stringify(r));
          }
        }
      }

      if (item) { } else {
        // item.click_events_str = `app_edit_record('${to}','${this.frame.apps_page_frame_seqid}');app_execute_item('${to}.PB_ARP','click_events_str',0)`;
        item = JSON.parse(JSON.stringify(event));
        item.click_events_str = `app_edit_record('${to}','${this.frame.apps_page_frame_seqid}')`;
      }

      item.itemIndex = j;
      item.isAssociate = true;
      item.itemClicked = 'pre';
      this.emitPass.emit(item);

    } else {

      if (event.item_enable_flag != 'F') {

        if (typeof (rowsdata) != "number") {
          for (let dataRow of rowsdata) {
            if (dataRow.Level5) {
              for (let r of dataRow.Level5) {
                if (r.item_name == "DB_TABLE_PKEY") {
                  itemPKey = r.value;
                }
                if (r.mirrored_items) {
                  this.lhs_lib.set_mirror_values(r);
                }
              }
            }
          }
        }

        if (isNaN(rowindex)) {
          rowindex = j;
        }

        if (this.frame.frame_alias == 'LOV') {
          let data = [];
          for (let dataRow of rowsdata) {
            if (dataRow.Level5) {
              for (let r of dataRow.Level5) {
                if (r.item_type == "CHECK_BOX" && r.item_visible_flag == 'T') {
                } else {
                  let obj = {
                    key: this.frame.frame_alias + '.' + r.item_name,
                    value: r.value
                  }
                  data.push(obj);
                }
              }
            }
          }

          event.lovData = data;

          event.wsdpcl = [];
          event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);
          this.emitPass.emit(event);
        }


        if (rowindex == undefined || this.frame.calenderflag) {
          rowindex = j;
        }

        ///////////////////////////////////////////////////////


        let col = {};
        if (this.frame.tableRows && this.frame.tableRows.length > 0) {
          for (let itemGroup of rowsdata) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {

                if (item.item_name == 'WMA_RECORD_INDEX' && item.value == undefined) {
                  item.value = rowindex;
                }

                if (item.codeOfValues) {
                  col[item.apps_item_seqid] = item.codeOfValues
                } else if (item.value) {
                  col[item.apps_item_seqid] = item.value
                } else {
                  col[item.apps_item_seqid] = ""
                }

                if (item.session_hold_flag == 'T') {
                  if (this.sessionObj) {
                    this.sessionObj[item.item_name] = item.value
                  } else {
                    this.sessionObj = {};
                    this.sessionObj[item.item_name] = item.value
                  }
                }

                if (event.item_enable_flag != 'F') {
                  if (event.item_type != 'BUTTON' && event.item_type != 'BT' && event.item_type != 'BUTTON_ICON' && !event.isAssociate && item.item_name == 'WMA_RECORD_STATUS') {
                    item.frame_status = 'dirty';
                  }
                }
              }
            }
          }
        }
        event.wsdpcl = [];
        event.wsdpcl.push(col);
        this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
        event.wscp = this.wscp_send_input;

      }


      if (isValid) {
        event.sessionObj = this.sessionObj;
        event.itemIndex = rowindex;
        event.itemPKey = itemPKey;
        event.callingObjectArr = this.frame.callingObjectArr;
        // event.itemIndex = i;

        delete event['returnId'];
        delete event['returnIndex'];
        if (event.item_enable_flag != 'F') {
          this.emitPass.emit(event);
        }
      }
    }
  }


  deleteRows(i) {
    if (this.frame.tableRows.length > 1) {
      this.frame.tableRows.splice(i, 1);
      let j = 0;
      for (let frameLevel4 of this.frame.tableRows) {
        for (let itemGroup of frameLevel4) {
          for (let itemMast of itemGroup.Level5) {
            itemMast.indexcount = j

          }
        }
        j++;
      }
    } else {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
      let flag = true;
      if (frameLevel4.length <= 2) {
        for (let itemGroup of frameLevel4) {
          for (let itemMast of itemGroup.Level5) {
            if (itemMast.item_type == "DELETE_ROW_BT") {
              flag = false;
            }

          }
        }
      }
      if (flag) {
        this.frame.tableRows[0] = frameLevel4;
      } else {
        this.frame.tableRows.splice(i, 1);
      }
    }
  }

  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.frame
      }
    });
    return await modal.present();
  }


  getDataForGraph(fileType, shareType) {
    let grapgRows = [];
    let wscp: any = {};
    wscp.service_type = "execute_query";
    wscp.from_row = "1";
    wscp.to_row = "1000000";
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    this.wscp["object_code"] = this.frame.object_code;



    let wsdp = [];

    if (this.l_where_str) {
      wscp.where_str = this.l_where_str.join(" ");
    } else {
      wscp.where_str = null;
    }
    if (wscp.service_type == "execute_query") {

      wsdp = this.lhs_lib.getWsdp("").wsdp;
    } else {
      wsdp = this.wsdp;
    }

    // if (this.sessionObj) {
    //   for (var key in this.sessionObj) {
    //     wscp[key] = this.sessionObj[key];
    //   }
    // }
    var data = {
      wslp: this.userDetails,
      wscp: wscp,
      wsdp: this.wsdp,
      wsdpcl: this.wsdpcl
    };

    // if (this.frame.on_frame_load_str) {
    //   let indexces = [];
    //   let l_url = "S2U";
    //   this.dataService.postData(l_url, data).then(res => {
    //     let data: any = res;
    //     if (data.responseStatus == "success") {
    //       let objData = this.globalObjects.setPageInfo(data.responseData);
    //       let tableData = objData.Level1;
    //       if (tableData && tableData.length > 0) {
    //         let tableKey = Object.keys(tableData[0]);
    //         this.l_total_rows = tableData[0].TOTAL_ROWS;
    //         for (let table of tableData) {
    //           let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

    //           for (let itemGroup of frameLevel4) {
    //             for (let item of itemGroup.Level5) {
    //               for (let key of tableKey) {
    //                 if (item.item_name.toUpperCase() == key.toUpperCase()) {
    //                   item.value = table[key];
    //                 }
    //               }
    //               if (!item.value) {
    //                 item.value = "";
    //               }
    //               if (item.item_type == 'BT') {
    //                 if (indexces.indexOf(this.thead.indexOf(item.prompt_name)) < 0) {
    //                   indexces.push(this.thead.indexOf(item.prompt_name));
    //                 }
    //               }
    //             }
    //           }
    //           grapgRows.push(frameLevel4);
    //         }
    //       }
    //     }
    //   }).then(() => {
    //     let lastRow = this.summaryRow;
    //     for (let i of indexces) {
    //       lastRow.slice(i, 1)
    //     }

    //     if (fileType == "pdf") {

    //       this.downloadPDF(grapgRows, shareType, this.summaryRow);
    //     } else if (fileType == "excel") {
    //       this.downloadExcel(grapgRows);
    //     } else if (fileType == "print") {

    //       window.frames["print_frame"].document.write('<html><head><title>Table Contents</title>');
    //       window.frames["print_frame"].document.write('<style> body{font-family: Arial;font-size: 10pt;} table{border: 1px solid #ccc;border-collapse: collapse;} table thead{background: #5e656d !important;}');
    //       window.frames["print_frame"].document.write('table thead th{background: #5e656d !important;font-weight: bold;color:#000;border: 1px solid #ccc;font-size:17px;padding:5px;text-align:center;}  table tbody tr td{font-size:15px;color: #423f3f;padding: 4px 6px 10px 2px;text-align:center;border: 1px solid #ccc;} table tbody tr:nth-child(even){background-color: #f2f2f2;}</style>');
    //       window.frames["print_frame"].document.write('</head>');
    //       window.frames["print_frame"].document.write('<body>');
    //       window.frames["print_frame"].document.body.innerHTML = document.getElementById(this.tab).innerHTML;
    //       window.frames["print_frame"].document.write('<body>');
    //       window.frames["print_frame"].document.write('</html>');
    //       window.frames["print_frame"].window.focus();
    //       window.frames["print_frame"].window.print();

    //     }

    //   });
    // } else {

    //   // grapgRows = this.frame.tableRows;
    //   let indexces = [];
    //   if (this.frame.tableData && this.frame.tableData.length > 0) {
    //     let tableKey = Object.keys(this.frame.tableData[0]);
    //     this.l_total_rows = this.frame.tableData[0].TOTAL_ROWS;
    //     for (let table of this.frame.tableData) {
    //       let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

    //       for (let itemGroup of frameLevel4) {
    //         for (let item of itemGroup.Level5) {
    //           for (let key of tableKey) {
    //             if (item.item_name.toUpperCase() == key.toUpperCase()) {
    //               item.value = table[key];
    //             }
    //           }
    //           if (!item.value) {
    //             item.value = "";
    //           }
    //           if (item.item_type == 'BT') {
    //             if (indexces.indexOf(this.thead.indexOf(item.prompt_name)) < 0) {
    //               indexces.push(this.thead.indexOf(item.prompt_name));
    //             }
    //           }
    //         }
    //       }
    //       grapgRows.push(frameLevel4);
    //     }
    //   }

    grapgRows = this.frame.tableRows;
    if (fileType == "pdf") {

      this.downloadPDF(grapgRows, shareType, this.summaryRow);
    } else if (fileType == "excel") {
      this.downloadExcel(grapgRows);
    } else if (fileType == "print") {

      // window.frames["print_frame"].document.write('<html><head><title>Table Contents</title>');
      // window.frames["print_frame"].document.write('<style> body{font-family: Arial;font-size: 10pt;} table{border: 1px solid #ccc;border-collapse: collapse;} table thead{background: #5e656d !important;}');
      // window.frames["print_frame"].document.write('table thead th{background: #5e656d !important;font-weight: bold;color:#000;border: 1px solid #ccc;font-size:17px;padding:5px;text-align:center;}  table tbody tr td{font-size:15px;color: #423f3f;padding: 4px 6px 10px 2px;text-align:center;border: 1px solid #ccc;} table tbody tr:nth-child(even){background-color: #f2f2f2;}</style>');
      // window.frames["print_frame"].document.write('</head>');
      // window.frames["print_frame"].document.write('<body>');
      // window.frames["print_frame"].document.body.innerHTML = document.getElementById(this.tab).innerHTML;
      // window.frames["print_frame"].document.write('<body>');
      // window.frames["print_frame"].document.write('</html>');
      // window.frames["print_frame"].window.focus();
      // window.frames["print_frame"].window.print();

    }
    // }


  }

  excelCol: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ', 'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ', 'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FU', 'FV', 'FW', 'FX', 'FY', 'FZ', 'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ', 'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GX', 'GY', 'GZ', 'HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'HG', 'HH', 'HI', 'HJ', 'HK', 'HL', 'HM', 'HN', 'HO', 'HP', 'HQ', 'HR', 'HS', 'HT', 'HU', 'HV', 'HW', 'HX', 'HY', 'HZ', 'IA', 'IB', 'IC', 'ID', 'IE', 'IF', 'IG', 'IH', 'II', 'IJ', 'IK', 'IL', 'IM', 'IN', 'IO', 'IP', 'IQ', 'IR', 'IS', 'IT', 'IU', 'IV', 'IW', 'IX', 'IY', 'IZ', 'JA', 'JB', 'JC', 'JD', 'JE', 'JF', 'JG', 'JH', 'JI', 'JJ', 'JK', 'JL', 'JM', 'JN', 'JO', 'JP', 'JQ', 'JR', 'JS', 'JT', 'JU', 'JV', 'JW', 'JX', 'JY', 'JZ', 'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'KG', 'KH', 'KI', 'KJ', 'KK', 'KL', 'KM', 'KN', 'KO', 'KP', 'KQ', 'KR', 'KS', 'KT', 'KU', 'KV', 'KW', 'KX', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LK', 'LL', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LT', 'LU', 'LV', 'LW', 'LX', 'LY', 'LZ', 'MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MI', 'MJ', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'NG', 'NH', 'NI', 'NJ', 'NK', 'NL', 'NM', 'NN', 'NO', 'NP', 'NQ', 'NR', 'NS', 'NT', 'NU', 'NV', 'NW', 'NX', 'NY', 'NZ', 'OA', 'OB', 'OC', 'OD', 'OE', 'OF', 'OG', 'OH', 'OI', 'OJ', 'OK', 'OL', 'OM', 'ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT', 'OU', 'OV', 'OW', 'OX', 'OY', 'OZ', 'PA', 'PB', 'PC', 'PD', 'PE', 'PF', 'PG', 'PH', 'PI', 'PJ', 'PK', 'PL', 'PM', 'PN', 'PO', 'PP', 'PQ', 'PR', 'PS', 'PT', 'PU', 'PV', 'PW', 'PX', 'PY', 'PZ', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG', 'QH', 'QI', 'QJ', 'QK', 'QL', 'QM', 'QN', 'QO', 'QP', 'QQ', 'QR', 'QS', 'QT', 'QU', 'QV', 'QW', 'QX', 'QY', 'QZ', 'RA', 'RB', 'RC', 'RD', 'RE', 'RF', 'RG', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RM', 'RN', 'RO', 'RP', 'RQ', 'RR', 'RS', 'RT', 'RU', 'RV', 'RW', 'RX', 'RY', 'RZ', 'SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SQ', 'SR', 'SS', 'ST', 'SU', 'SV', 'SW', 'SX', 'SY', 'SZ', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH', 'TI', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP', 'TQ', 'TR', 'TS', 'TT', 'TU', 'TV', 'TW', 'TX', 'TY', 'TZ', 'UA', 'UB', 'UC', 'UD', 'UE', 'UF', 'UG', 'UH', 'UI', 'UJ', 'UK', 'UL', 'UM', 'UN', 'UO', 'UP', 'UQ', 'UR', 'US', 'UT', 'UU', 'UV', 'UW', 'UX', 'UY', 'UZ', 'VA', 'VB', 'VC', 'VD', 'VE', 'VF', 'VG', 'VH', 'VI', 'VJ', 'VK', 'VL', 'VM', 'VN', 'VO', 'VP', 'VQ', 'VR', 'VS', 'VT', 'VU', 'VV', 'VW', 'VX', 'VY', 'VZ', 'WA', 'WB', 'WC', 'WD', 'WE', 'WF', 'WG', 'WH', 'WI', 'WJ', 'WK', 'WL', 'WM', 'WN', 'WO', 'WP', 'WQ', 'WR', 'WS', 'WT', 'WU', 'WV', 'WW', 'WX', 'WY', 'WZ', 'XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK', 'XL', 'XM', 'XN', 'XO', 'XP', 'XQ', 'XR', 'XS', 'XT', 'XU', 'XV', 'XW', 'XX', 'XY', 'XZ', 'YA', 'YB', 'YC', 'YD', 'YE', 'YF', 'YG', 'YH', 'YI', 'YJ', 'YK', 'YL', 'YM', 'YN', 'YO', 'YP', 'YQ', 'YR', 'YS', 'YT', 'YU', 'YV', 'YW', 'YX', 'YY', 'YZ', 'ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'ZF', 'ZG', 'ZH', 'ZI', 'ZJ', 'ZK', 'ZL', 'ZM', 'ZN', 'ZO', 'ZP', 'ZQ', 'ZR', 'ZS', 'ZT', 'ZU', 'ZV', 'ZW', 'ZX', 'ZY', 'ZZ']


  generateGraphRows(grapgRows) {
    let finalDisplayTable = [];

    for (let tab of grapgRows) {
      let finalTableRow: any = [];
      let finalDataRow = [];
      for (let temp of tab) {
        if (temp.Level5) {
          for (let d of temp.Level5) {
            let arr = [];
            arr.push(d)
            finalDataRow.push(arr);
          }
        }
      }
      finalTableRow = finalDataRow;

      finalDisplayTable.push(finalTableRow);
    }

    return finalDisplayTable;

  }

  downloadPDF(dataRows, shareType, footer) {

    let grapgRows = this.generateGraphRows(dataRows);
    let data: any = [];
    let count: number = 0;
    let array: any = [];
    array[0] = [];
    array[0] = JSON.parse(JSON.stringify(this.pdfheads));
    let imageURlArr = [];
    for (let trows of grapgRows) {
      count++;

      let im = [];
      for (let trows2 of trows) {
        if (trows2.Level5) {
          if (trows2.Level5[0].item_visible_flag == "T") {
            if (trows2.Level5[0].item_type == 'BT' || trows2.Level5[0].item_type == 'DOWNLOAD_DOC' || trows2[0].item_type == 'BUTTON_ICON' || trows2[0].item_type == 'FRAME_BUTTON_ICON') {
            } else {
              if (trows2.Level5[0].item_type == "DISPLAY_PHOTO") {
                if (trows2.Level5[0].value) {
                  // imageURlArr.push(trows2.Level5[0].value);
                  im.push(trows2.Level5[0].value);
                } else {
                  im.push("");
                  //  imageURlArr.push("");
                }
              } else {
                if (trows2.Level5[0].value && trows2.Level5[0].value.indexOf("~") > -1) {
                  let obj = { text: trows2[0].value.split("~")[0], fillColor: "#333" };
                  data.push(obj);
                } else {
                  data.push(trows2.Level5[0].value);
                }
              }
            }
          }
        } else {


          if (trows2[0].item_visible_flag == "T") {
            if (trows2[0].item_type == 'BT' || trows2[0].item_type == 'DOWNLOAD_DOC' || trows2[0].item_type == 'BUTTON_ICON' || trows2[0].item_type == 'FRAME_BUTTON_ICON') {
            } else {
              if (trows2[0].item_type == "DISPLAY_PHOTO") {
                if (trows2[0].value) {
                  // imageURlArr.push(trows2.Level5[0].value);
                  im.push(trows2[0].value);
                } else {
                  im.push("");
                  //  imageURlArr.push("");
                }
              } else {
                if (trows2[0].value && trows2[0].value.indexOf("~") > -1) {
                  let obj = { text: trows2[0].value.split("~")[0], fillColor: "#333" };
                  data.push(obj);
                } else {
                  data.push(trows2[0].value);
                }
              }
            }
          }


        }
      }

      if (im.length > 0) {
        imageURlArr.push(im);
      }
      array[count] = [];
      array[count] = JSON.parse(JSON.stringify(data));
      data = [];
    }

    //console.log(imageURlArr);

    let headerdata: any;

    headerdata = JSON.parse(JSON.stringify(array));
    let foot;
    if (this.footerRowFlag) {
      foot = JSON.parse(JSON.stringify(footer));
    }
    let fileName = this.frame.apps_page_frame_name ? this.frame.apps_page_frame_name : this.excelHeading;
    if (shareType) {
      this.globalObjects.emailSendOfTableData(shareType, headerdata, fileName, foot);
    } else {
      if (imageURlArr.length > 0) {
        this.getImages(imageURlArr, headerdata, fileName, foot);
      } else {
        this.globalObjects.downloadPdf('', headerdata, fileName, foot);
      }
    }
    //console.log(this.thead);
  }

  async getImages(imgArr, headerdata, frame_name, foot) {
    let temp1 = [];
    for (let i of imgArr) {
      if (i) {
        let url = 'getItemImage?query=' + encodeURIComponent(i);
        await this.dataService.getData(url)
          .then(res => {
            var data: any = res;
            if (data.status == 'success') {
              temp1.push({
                image: 'data:image/png;base64,' + data.img, width: 100,
                height: 100
              });
            } else {
              temp1.push("");
            }
          }, err => {
            temp1.push("");
          })
      } else {
        temp1.push("");
      }
    }
    let count = 1;
    for (let obj of temp1) {
      headerdata[count].push(obj);
      count++;
    }

    if (imgArr.length == temp1.length) {
      this.globalObjects.downloadPdf('', headerdata, frame_name, foot);
    }
  }


  downloadExcel(grapgRows) {
    let tableData = [];
    for (let trows of grapgRows) {
      let data = [];
      for (let trows2 of trows) {
        if (trows2.Level5) {
          for (let item of trows2.Level5) {
            if (item.item_visible_flag == "T") {
              if (item.item_type == 'BT' || item.item_type == 'DISPLAY_PHOTO' || item.item_type == 'BUTTON_ICON' || item.item_type == 'DOWNLOAD_DOC' || item.item_type == 'FRAME_SEPARATOR' || item.item_type == 'FRAME_BUTTON_ICON') {
              } else {
                data.push(item.value + "~" + item.datatype);
              }
            }
            else {
              if (item.mirrored_items) {
                data.push(item.value + "~" + item.datatype);
              }
            }
          }
        }
      }
      tableData.push(data);
    }
    const workbook = new Excel.Workbook();
    workbook.creator = "lhsapp";
    workbook.lastModifiedBy = "lhsapp";
    const worksheet = workbook.addWorksheet("Sheet1", {
      horizontalCentered: true,
      verticalCentered: true,
      paperSize: 9,
      orientation: "portrait",

      margins: { left: 0.3149606, right: 0.3149606, top: 0.3543307 }
    });
    worksheet.addRow([]);
    let titleRow = worksheet.addRow([this.excelHeading]);
    titleRow.font = { size: 16, bold: true };
    titleRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: " 29a3a3" }
        // bgColor: { argb: 'FF0000FF' }
      };
      cell.font = {
        name: 'Arial',
        color: { argb: '000' },
        size: 16,
        bold: true
      };

    });
    let subTitleRow = worksheet.addRow([
      "Date : " + this.datePipe.transform(new Date(), "medium")
    ]);
    subTitleRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffffff" }
        // bgColor: { argb: 'FF0000FF' }
      };


    });

    let headerRow = worksheet.addRow(this.excelheads);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffff99" }
        // bgColor: { argb: 'FF0000FF' }
      };
      cell.font = {
        name: 'Arial',
        color: { argb: '000' },

        size: 14,
      };
      // cell.border = {
      //   top: { style: "dotted" },
      //   left: { style: "dotted" },
      //   bottom: { style: "dotted" },
      //   right: { style: "dotted" }
      // };
    });

    let rowIndex = 1;
    tableData.forEach(d => {
      let row = worksheet.addRow(d);
      if (rowIndex % 2 === 0) {
        row.eachCell((cell, number) => {

          if (cell.value.toString().split("~")[1] == "NUMBER") {
            cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
          } else {
            cell.value = (cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "";
          }
          // if (isNaN(cell.value)) {

          // } else {
          //   cell.value = parseFloat(cell.value);
          // }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffff" }

            // pattern: v,
            // fgColor: { argb: "" }
            // bgColor: { argb: 'FFFF0000' }
          };
          // cell.border = {
          //   top: { style: "dotted" },
          //   left: { style: "dotted" },
          //   bottom: { style: "dotted" },
          //   right: { style: "dotted" }
          // };
        });
      } else {
        row.eachCell((cell, number) => {

          if (cell.value.toString().split("~")[1] == "NUMBER") {
            cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
          } else {
            cell.value = (cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "";
          }

          // if (isNaN(cell.value)) {
          // } else {
          //   cell.value = parseFloat(cell.value);
          // }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffff" }
            // type: v,
            // pattern: "solid",
            // fgColor: { argb: "" }
            // bgColor: { argb: '' }
          };
          // cell.border = {
          //   top: { style: "dotted" },
          //   left: { style: "dotted" },
          //   bottom: { style: "dotted" },
          //   right: { style: "dotted" }
          // };
        });
      }
      rowIndex++;
    });
    if (this.footerRowFlag) {
      let f = JSON.parse(JSON.stringify(this.summaryRow));
      let footerrow = worksheet.addRow(f);
      footerrow.eachCell((cell, number) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffff99" }
          // bgColor: { argb: 'FF0000FF' }
        };
      })
    }
    //   worksheet.eachRow({ includeEmpty: true },function(row, rowNumber){
    //     row.eachCell( function(cell, colNumber){
    //         if( rowNumber<tableData.length){
    //           row.getCell(colNumber).border = {
    //           top: { style: "dotted" },
    //           left: { style: "dotted" },
    //           bottom: { style: "dotted" },
    //           right: { style: "dotted" }
    //         };

    //         }

    //     });
    // });
    for (let i = 4; i <= (tableData.length + 4); i++) {
      for (let l = 0; l < this.excelheads.length; l++) {

        worksheet.getCell(this.excelCol[l] + i).border = {
          top: { style: "dotted" },
          left: { style: "dotted" },
          bottom: { style: "dotted" },
          right: { style: "dotted" },

        };

        // Excel.ValueType.Number
      }
    }

    var today = new Date();
    let date = this.globalObjects.formatDate(today, "dd-MMM-yyyy")
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ', ' + time;
    // worksheet.columns.forEach(column => {
    //   column.border = {
    //     top: { style: "thick" },
    //     left: { style: "thick" },
    //     bottom: { style: "thick" },
    //     right: { style: "thick" }
    //   };
    // });

    let fileName = this.frame.apps_page_frame_name ? this.frame.apps_page_frame_name + "[" + dateTime + "]" : null;
    workbook.xlsx.writeBuffer().then(data => {
      this.globalObjects.downloadExcel(data, fileName);
    });
  }


  // goToLast(num) {

  //   this.frame.page_no = num;

  //   let to = num * this.displayDataLen;
  //   let from = to - this.displayDataLen;

  //   let data = this.frame.tableData;
  //   if (this.frame.searchableData) {
  //     data = this.frame.searchableData;
  //   }


  //   if (data.length > from) {
  //     this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, num);
  //   }


  // }

  toggleFrame() {
    this.frame.collapse = !this.frame.collapse
    this.cdr.detectChanges();
  }

  searchAllData() {

    this.processData.searchAllData(this.frame);
    this.frame.page_no = 1;
    let to = 1 * this.displayDataLen;
    let from = to - this.displayDataLen;
    // this.frame.active_row = 0;
    this.processData.afterTableRows(this.frame, from, to, 1);

    if (this.frame.searchableData) {
      delete this.frame['active_row'];
      if (this.frame.searchableData && this.frame.searchableData.length > 0) {
        for (let itemGrp of this.frame.searchableData[0]) {
          if (itemGrp.Level5.length > 0) {
            this.frame.active_row = itemGrp.Level5[0].indexcount;
            break;
          }
        }
      }
    } else {
      if (this.frame.tableRows && this.frame.tableRows.length > 0) {
        for (let itemGrp of this.frame.tableRows[0]) {
          if (itemGrp.Level5.length > 0) {
            this.frame.active_row = itemGrp.Level5[0].indexcount;
            break;
          }
        }
      }
    }

    this.cdr.detectChanges();

    // this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, 1);
  }

  filterColumn(item?) {

    if (item && item.initialChange) { delete item['initialChange']; return; }
    if (((this.frame.tableData && this.frame.tableData.length > 0) || (this.frame.searchableData && this.frame.searchableData.length > 0))) {
      let data = this.processData.filterColumn(this.frame);
      this.frame.page_no = 1;
      let to = 1 * this.displayDataLen;
      let from = to - this.displayDataLen;

      this.frame.from_record = from;
      this.frame.to_record = to;
      this.frame.page_no = 1;
      // this.frame.active_row = 0;
      // if (!this.frame.noFilter) {
      this.processData.afterTableRows(this.frame);

      if (this.frame.searchableData) {
        delete this.frame['active_row'];
        if (this.frame.searchableData && this.frame.searchableData.length > 0) {
          for (let itemGrp of this.frame.searchableData[0]) {
            if (itemGrp.Level5.length > 0) {
              this.frame.active_row = itemGrp.Level5[0].indexcount;
              break;
            }
          }
        }
      } else {
        if (this.frame.tableRows && this.frame.tableRows.length > 0) {
          for (let itemGrp of this.frame.tableRows[0]) {
            if (itemGrp.Level5.length > 0) {
              this.frame.active_row = itemGrp.Level5[0].indexcount;
              break;
            }
          }
        }
      }

      this.cdr.detectChanges();
      // this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, 1);
      // }
    }
  }


  debounce(callback, delay = 1000, item?) {
    var time;

    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }


  getSearchResult = this.debounce((newFunc, delay, item?) => {
    if (newFunc) {
      if (newFunc.name == 'searchAllData') {
        this.searchAllData();
      } else if (newFunc.name == 'filterColumn') {
        this.filterColumn(item);
      }
    }

    this.cdr.detectChanges();
    // console.log('Number of API Calls : ' + numberOfApiCalls);
  });

  // filterColumn() {
  //   if ((this.frame.tableData && this.frame.tableData.length > 0) || (this.frame.searchableData && this.frame.searchableData.length > 0)) {
  //     this.processData.filterColumn(this.frame);
  //     this.frame.page_no = 1;
  //     let to = 1 * this.displayDataLen;
  //     let from = to - this.displayDataLen;
  //     this.frame.active_row = 0;
  //     this.processData.afterTableRows(this.frame, from, to, this.frame.page_no);
  //     // this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, 1);
  //   }
  // }


  // searchAllData() {
  //   let data = this.processData.searchAllData(this.frame);
  //   this.processData.populateRows(this.frame.apps_page_frame_seqid, data);
  // }

  // filterColumn() {
  //   if ((this.frame.tableData && this.frame.tableData.length > 0) || (this.frame.searchableData && this.frame.searchableData.length > 0)) {
  //     let data = this.processData.filterColumn(this.frame);
  //     this.frame.page_no = 1;
  //     let to = 1 * this.displayDataLen;
  //     let from = to - this.displayDataLen;
  //     this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, 1);
  //   }
  // }

  // goFirst(num) {

  //   this.frame.page_no = num;

  //   let to = num * this.displayDataLen;
  //   let from = to - this.displayDataLen;

  //   let data = this.frame.tableData;
  //   if (this.frame.searchableData) {
  //     data = this.frame.searchableData;
  //   }

  //   this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, num);
  // }

  getDDData(event) {
    this.wscp.service_type = "get_lov_data";
    this.wscp.apps_page_no = event.apps_page_no;
    this.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = event.apps_item_seqid;
    this.wscp.apps_working_mode = event.apps_working_mode;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.wscp["object_code"] = event.object_code;
    this.wsdp = [];
    let col = {};
    let rowindex;
    if (event.indexcount) {
      rowindex = event.indexcount;
    } else {
      rowindex = 0;
    }

    if (this.frame.tableRows && this.frame.tableRows.length > 0) {
      for (let itemGroup of this.frame.tableRows[rowindex]) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else {
              if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
              } else {
                col[item.apps_item_seqid] = item.value;
              }
            }
          }
        }
      }
    } else {
      for (let itemGroup of this.frame.Level4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else {
              if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
              } else {
                col[item.apps_item_seqid] = item.value;
              }
            }
          }
        }
      }
    }
    this.wsdp.push(col);

    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": this.wsdp
    }
    this.dataService.postData("S2U", reqData).then((res: any) => {
      if (res.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(res.responseData);
        event.objectData = objData;
      }
    })
  }

  getShare(event) {
    this.clickShare = false;
    this.getDataForGraph('pdf', event);
  }

  hideDeletedRecord(tableData) {
    let item = tableData.find(x => x.Level5 && x.Level5.find(y => y.item_name == 'WMA_RECORD_STATUS'));

    if (item && item.Level5 && item.Level5[0].value == "D") {
      return false;
    } else {
      return true;
    }
  }


  // toggleTable(x, index) {

  //   let tHWidth: any = document.getElementsByClassName('thWidth');
  //   // console.log(tHWidth);
  //   let width = tHWidth[0].clientWidth;
  //   if (this.thFlag) {
  //     for (let t of tHWidth) {
  //       if (width < t.clientWidth) {
  //         width = t.clientWidth;

  //         this.thWidth = {
  //           'min-width': width + 2 + 'px',
  //           'max-width': width + 2 + 'px',
  //           'width': width + 2 + 'px'
  //         }
  //       }
  //     }
  //     console.log(width);
  //     this.thFlag = false;
  //   }


  //   for (let rows of this.frame.canvasRows) {
  //     for (let i = 0; i < rows[x].Level5.length; i++) {
  //       if (i == index) {
  //         rows[x].Level5[i].sepFrame = 'SHOW';
  //       } else {
  //         rows[x].Level5[i].sepFrame = 'HIDE';
  //       }
  //     }
  //   }
  //   this.cdr.detectChanges();
  // }

  toggleTable(x, index, itm) {
    if (itm.item_sub_type == 'TAB_OPEN') { } else {
      let tHWidth: any = document.getElementsByClassName('thWidth');
      // console.log(tHWidth);
      if (tHWidth && tHWidth.length > 0) {
        let width = tHWidth[0].clientWidth;
        if (this.thFlag) {
          for (let t of tHWidth) {
            if (width < t.clientWidth) {
              width = t.clientWidth;

              this.thWidth = {
                'min-width': width + 2 + 'px',
                'max-width': width + 2 + 'px',
                'width': width + 2 + 'px'
              }
            }
          }
          this.thFlag = false;
        }
        this.thFlag = false;
      }

      for (let rows of this.frame.canvasRows) {
        for (let i = 0; i < rows[x].Level5.length; i++) {
          if (i == index) {
            rows[x].Level5[i].sepFrame = 'SHOW';
          } else {
            rows[x].Level5[i].sepFrame = 'HIDE';
          }
        }
      }

      for (let i = 0; i < this.frame.headers[x].Level5.length; i++) {
        if (i == index) {
          this.frame.headers[x].Level5[i].sepFrame = 'SHOW';
        } else {
          this.frame.headers[x].Level5[i].sepFrame = 'HIDE';
        }
      }

      if (this.frame.summary_rows && this.frame.summary_rows.length > 0) {

        for (let i = 0; i < this.frame.summary_rows[x].Level5.length; i++) {
          if (i == index) {
            this.frame.summary_rows[x].Level5[i].sepFrame = 'SHOW';
          } else {
            this.frame.summary_rows[x].Level5[i].sepFrame = 'HIDE';
          }
        }
      }
    }
    this.cdr.detectChanges();
  }

  orderByData() {

    if (this.clickedHead.length > 0) {
      for (let x of this.clickedHead) {
        this.thClick1(x);
      }
    } else {

      let frameLevel4 = [];
      frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
      let arr = []

      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          if (item.item_default_value && ((item.item_name.toLowerCase().indexOf("wma_record_status") > -1) || (item.item_default_value.toLowerCase().indexOf("avg") > -1) || (item.item_default_value.toLowerCase().indexOf("sum") > -1) ||
            (item.item_default_value.toLowerCase().indexOf("min") > -1) || (item.item_default_value.toLowerCase().indexOf("max") > -1) || (item.item_default_value.toLowerCase().indexOf("count") > -1))) {
          } else {
            if (item.item_default_value) {
              if (arr.length == 2) {
                arr.slice(0, 1);
              }
              let obj = {
                name: item.prompt_name,
                type: item.datatype
              }
              arr.push(obj);
            }
          }
        }
      }

      if (arr.length > 0) {
        // this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          for (let a of arr) {
            this.thClick(a.name, a.type);
          }
        }, 5);
      }

    }
  }

  thClick(th, type) {


    if (this.clickedHead.length > 0) {
      let obj: any = {};
      obj = this.clickedHead.find(x => x.th == th);
      if (obj) {
        if (obj.direction > 0) {
          obj.direction = -1;
        } else {
          obj.direction = 1;
        }
      } else {
        obj = {
          th: th,
          direction: 1
        }
      }

      if (this.clickedHead.length > 1) {

        if (this.clickedHead[1].th == obj.th) {
          this.clickedHead[1] = obj;
        } else {
          let newArr = [];
          newArr[0] = this.clickedHead[1];
          newArr[1] = obj;
          this.clickedHead = newArr;
        }

      } else {
        if (this.clickedHead[0].th == obj.th) {
          this.clickedHead[0] = obj;
        } else {
          this.clickedHead[1] = obj;
        }
      }



    } else {
      let obj = {
        th: th,
        direction: 1,
        type: type
      }
      this.clickedHead.push(obj);
    }

    for (let x of this.clickedHead) {
      this.thClick1(x);
    }
  }

  //-------table order by start
  thClick1(obj) {

    let data = [];
    let tableRows = this.frame.tableRows;
    if (this.frame.searchableData) {
      tableRows = this.frame.searchableData
    }

    for (let tableDatas of tableRows) {
      let rowItem = this.lhs_lib.get_rows_item(tableDatas, 'WMA_RECORD_STATUS');
      let obj = {};
      if (!rowItem.extra_record) {
        for (let itemGroup of tableDatas) {
          for (let item of itemGroup.Level5) {
            obj[item.item_name] = item.value != undefined ? item.value.toString() : "";
          }
        }
        data.push(obj);
      }
    }

    data = data.sort((a, b) => {

      if (obj.type == 'DATE' || obj.type == 'DATETIME') {

        let newA = JSON.parse(JSON.stringify(a[obj.th]));
        let newB = JSON.parse(JSON.stringify(b[obj.th]));


        // newA= parseFloat(a[i][0].value.replace(/,/g, ""));
        // newB= parseFloat(b[i][0].value.replace(/,/g, ""));

        newA = newA ? new Date(newA).getTime() : "";
        newB = newB ? new Date(newB).getTime() : "";

        if (newA < newB) {
          return -1 * obj.direction;
        } else if (newA > newB) {
          return 1 * obj.direction;
        } else {
          return 0;
        }

      } else if (obj.type == 'NUMBER') {
        let newA;
        let newB
        if (a[obj.th] && a[obj.th].includes(',')) {
          newA = JSON.parse(JSON.stringify(parseFloat(a[obj.th].replace(/,/g, ""))));
          newB = JSON.parse(JSON.stringify(parseFloat(b[obj.th].replace(/,/g, ""))));
        } else {
          newA = JSON.parse(JSON.stringify(parseFloat(a[obj.th])));
          newB = JSON.parse(JSON.stringify(parseFloat(b[obj.th])));
        }

        // newA= parseFloat(a[i][0].value.replace(/,/g, ""));
        // newB= parseFloat(b[i][0].value.replace(/,/g, ""));

        newA = newA ? newA : 0;
        newB = newB ? newB : 0;
        if (parseFloat(newA) < parseFloat(newB)) {
          return -1 * obj.direction;
        } else if (parseFloat(newA) > parseFloat(newB)) {
          return 1 * obj.direction;
        } else {
          return 0;
        }
      } else {
        a[obj.th] = a[obj.th] ? a[obj.th] : "";
        b[obj.th] = b[obj.th] ? b[obj.th] : "";
        if (a[obj.th] < b[obj.th]) {
          return -1 * obj.direction;
        } else if (a[obj.th] > b[obj.th]) {
          return 1 * obj.direction;
        } else {
          return 0;
        }
      }
    });

    this.frame.page_no = 1;

    let to = 1 * this.displayDataLen;
    let from = to - this.displayDataLen;

    this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, 1);
    this.cdr.detectChanges();
    // console.log(this.frame.tableData)
  }

  calculateTableData(tableData) {
    if (tableData && tableData.length > 0) {
      let rows = [];
      let tableKey = Object.keys(tableData[0]);
      for (let i = 0; i < tableData.length; i++) {

        let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if (item.item_name.toUpperCase() == key.toUpperCase()) {
                item.value = tableData[i][key];
              }
            }
          }
        }
        rows.push(frameLevel4);
      }
      this.summaryRow = this.calculateData(rows);
    }
  }

  colSize(item) {

    if (item.containerRowss && item.containerRowss.length > 0) {
      return item.containerRowss.length;
    } else {
      return 0;
    }
  }

  @HostListener("keydown.ArrowDown", ['$event'])
  arrowDown(event) {
    event.preventDefault();
    this.selectedTable2Row(event)
  }


  @HostListener("keydown.ArrowUp", ['$event'])
  arrowUp(event) {
    event.preventDefault();
    this.selectedTable2Row(event)
  }


  // selectedTable2Row(event) {

  //   if (this.table2Body.nativeElement && this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0) {
  //     if (!this.frame.active_row) {
  //       this.frame.active_row = 0;
  //     }


  //     // let rowIndex = this.frame.active_row;



  //     // let displayRecord = this.frame.display_no_of_records ? this.frame.display_no_of_records : 50;
  //     // if ((rowIndex < this.frame.page_no * displayRecord) && (rowIndex >= ((this.frame.page_no * displayRecord) - displayRecord))) {
  //     //   let index = rowIndex - ((this.frame.page_no * displayRecord) - displayRecord);
  //     //   rowIndex = index;
  //     // }

  //     var ul = this.parentDiv.nativeElement;
  //     let children: any = this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0 ? this.table2Body.nativeElement.children : [];
  //     let el = this.table2Body.nativeElement.children[this.frame.active_row];
  //     // if(!this.table2Body.nativeElement.id || this.table2Body.nativeElement.id == '' || this.table2Body.nativeElement.id == undefined){
  //     //  this.frame.active_row =  this.table2Body.nativeElement.lastElementChild.id
  //     // }


  //     let activeIdd = parseFloat(this.table2Body.nativeElement.lastElementChild.id.split('--')[1]) + 1
  //     let numm = this.table2Body.nativeElement.lastElementChild.id.split('--')[0]

  //     // if (!this.table2Body.nativeElement.firstElementChild.id || this.table2Body.nativeElement.firstElementChild.id == '' || this.table2Body.nativeElement.firstElementChild.id == undefined || this.table2Body.nativeElement.firstElementChild.id == null) {
  //     //   this.activeRow = activeIdd
  //     //   console.log(this.frame.active_row)
  //     // }
  //     for (let c of children) {
  //       if (c.className.includes("trow-active")) {
  //         el = c;
  //       }
  //     }


  //     var elRect = el.getBoundingClientRect(),
  //       parRect = ul.getBoundingClientRect();
  //     if (elRect && parRect) {
  //       var elementHeight = elRect.height;

  //       if (this.frame.apps_page_frame_seqid && (this.frame.apps_page_frame_seqid).charAt((this.frame.apps_page_frame_seqid).length - 1) == 'A' && !(this.frame.apps_page_frame_seqid).toLowerCase().includes("-para")) { } else {
  //         if (event.keyCode == 38) {
  //           if (this.frame.active_row > this.frame.from_record) {

  //           }
  //           else {
  //             if (this.frame.current_page_no > 1) {
  //               this.paginate(this.frame.current_page_no - 1);
  //             }
  //           }
  //           event.preventDefault();
  //           if ((elRect.top) <= (parRect.top + 40) + elementHeight) {
  //             if (parRect.top + elementHeight >= elRect.top)
  //               ul.scrollTop = ul.scrollTop - (((parRect.top + 40) + elementHeight) - (elRect.top));
  //             else
  //               ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 40) - elRect.top);
  //           }

  //           // this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? this.frame.active_row-- : this.frame.active_row = 0;
  //           this.frame.active_row = this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? el.previousElementSibling.id.split("--")[1] : this.frame.active_row = 0;

  //         } else

  //           if (event.keyCode == 40) {
  //             if (this.frame.active_row < this.frame.to_record - 1) {
  //             }
  //             else {
  //               this.paginate(this.frame.current_page_no + 1);
  //             }
  //             if (this.frame.tableRows.length - 1 > this.frame.active_row) {
  //               event.preventDefault();
  //               if (!(elRect.top >= parRect.top && elRect.bottom <= parRect.bottom - 40 && elRect.bottom + elementHeight <= parRect.bottom - 40)) {
  //                 if (parRect.height > elRect.bottom)
  //                   ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
  //                 else
  //                   ul.scrollTop = 0;
  //                 // ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom + 40);
  //               }


  //               // let activeId  = parseFloat(el.id.split('--')[1])  + 1;
  //               // let num = parseFloat(el.id.split('--')[1]) 
  //               // let lastActiveRow =  el.id.split('--')[0] + '-' + num
  //               // let previousId  = parseFloat( el.previousSibling.id.split('--')[1]) + 1;
  //               // let previousActiveRow =  el.id.split('--')[0] + '-' + previousId
  //               // console.log(lastActiveRow)
  //               // console.log(previousActiveRow)

  //               // if(lastActiveRow == previousActiveRow){
  //               //   this.frame.active_row = activeId
  //               //   console.log(this.frame.active_row)
  //               // }

  //               if (elRect) {
  //                 // if(el.id[el.id.length - 1] == 9){
  //                 //   this.frame.active_row = this.activeRow;
  //                 // }else{

  //                 // }
  //                 if (!el.nextElementSibling
  //                   || el.nextElementSibling == '' || el.nextElementSibling == undefined || el.nextElementSibling == null) {
  //                   this.frame.active_row = activeIdd
  //                   console.log(this.frame.active_row)
  //                 }else{
  //                   this.frame.active_row = parseFloat(el.nextElementSibling.id.split("--")[1]);
  //                 }


  //                 console.log( this.frame.active_row)
  //                 // this.frame.active_row++;
  //                 // if(!this.table2Body.nativeElement.id || this.table2Body.nativeElement.id == '' || this.table2Body.nativeElement.id == undefined){
  //                 // this.frame.active_row = this.activeRow
  //                 // }else{
  //                 //   this.frame.active_row = parseFloat(el.nextElementSibling.id.split("--")[1]);
  //                 // }
  //                 // if (el.id) {
  //                 //   this.frame.active_row = parseFloat(el.nextElementSibling.id.split("--")[1]);
  //                 // }

  //                 // if (!this.table2Body.nativeElement.id || this.table2Body.nativeElement.id == '' || this.table2Body.nativeElement.id == undefined) {
  //                 //   this.frame.active_row = this.activeRow
  //                 // }
  //               }
  //             }
  //             else {
  //               this.frame.active_row = 0;
  //               ul.scrollTop = 0;
  //             }

  //           }
  //       }
  //       //  else if (event.keyCode == 13) {
  //       //  // this.setLOVValues(this.limitedRecords[this.lovItemSeq]);
  //       // }
  //     }
  //     // this.frame.active_row = this.activeRow

  //     if (this.frame.tableRows && this.frame.tableRows.length > 0) {
  //       for (let dataRow of this.frame.tableRows[this.frame.active_row]) {
  //         if (dataRow.Level5) {
  //           for (let r of dataRow.Level5) {
  //             if (r.mirrored_items) {
  //               this.lhs_lib.set_mirror_values(r);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   this.cdr.detectChanges();

  // }


  // selectedTable2Row(event) {

  //   if (this.table2Body.nativeElement && this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0) {
  //     if (!this.frame.active_row) {
  //       this.frame.active_row = 0;
  //     }


  //     // let rowIndex = this.frame.active_row;



  //     // let displayRecord = this.frame.display_no_of_records ? this.frame.display_no_of_records : 50;
  //     // if ((rowIndex < this.frame.page_no * displayRecord) && (rowIndex >= ((this.frame.page_no * displayRecord) - displayRecord))) {
  //     //   let index = rowIndex - ((this.frame.page_no * displayRecord) - displayRecord);
  //     //   rowIndex = index;
  //     // }

  //     var ul = this.parentDiv.nativeElement;
  //     let children: any = this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0 ? this.table2Body.nativeElement.children : [];
  //     let activeIdd = parseFloat(this.table2Body.nativeElement.lastElementChild.id.split('--')[1]) + 1
  //     let el = this.table2Body.nativeElement.children[this.frame.active_row];
  //     for (let c of children) {
  //       if (c.className.includes("trow-active")) {
  //         el = c;
  //       }
  //     }

  //     var elRect = el.getBoundingClientRect(),
  //       parRect = ul.getBoundingClientRect();
  //     if (elRect && parRect) {
  //       var elementHeight = elRect.height;

  //       if (this.frame.apps_page_frame_seqid && (this.frame.apps_page_frame_seqid).charAt((this.frame.apps_page_frame_seqid).length - 1) == 'A' && !(this.frame.apps_page_frame_seqid).toLowerCase().includes("-para")) { } else {
  //         if (event.keyCode == 38) {
  //           if (this.frame.active_row > this.frame.from_record) {

  //           }
  //           else {
  //             if (this.frame.current_page_no > 1) {
  //               this.paginate(this.frame.current_page_no - 1);
  //             }
  //           }
  //           event.preventDefault();
  //           if ((elRect.top) <= (parRect.top + 40) + elementHeight) {
  //             if (parRect.top + elementHeight >= elRect.top)
  //               ul.scrollTop = ul.scrollTop - (((parRect.top + 40) + elementHeight) - (elRect.top));
  //             else
  //               ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 40) - elRect.top);
  //           }

  //           // this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? this.frame.active_row-- : this.frame.active_row = 0;
  //           this.frame.active_row = this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? el.previousElementSibling.id.split("--")[1] : this.frame.active_row = 0;

  //         } else 

  //           if (event.keyCode == 40) {
  //             if (this.frame.active_row < this.frame.to_record - 1) {
  //             }
  //             else {
  //               this.paginate(this.frame.current_page_no + 1);
  //             }
  //             if (this.frame.tableRows.length - 1 > this.frame.active_row) {
  //               event.preventDefault();
  //               if (!(elRect.top >= parRect.top && elRect.bottom <= parRect.bottom - 40 && elRect.bottom + elementHeight <= parRect.bottom - 40)) {
  //                 if (parRect.height > elRect.bottom)
  //                   ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
  //                 else
  //                 ul.scrollTop = 0;
  //                 if (!el.nextElementSibling
  //                   || el.nextElementSibling == '' || el.nextElementSibling == undefined || el.nextElementSibling == null) {
  //                   this.frame.active_row = activeIdd
  //                   console.log(this.frame.active_row)
  //                 }else{
  //                   this.frame.active_row = parseFloat(el.nextElementSibling.id.split("--")[1]);
  //                   console.log(this.frame.active_row)
  //                 }
  //                   ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom + 40);
  //               }
  //               if (elRect) {
  //                 // this.frame.active_row++;
  //                 if (!el.nextElementSibling
  //                   || el.nextElementSibling == '' || el.nextElementSibling == undefined || el.nextElementSibling == null) {
  //                   this.frame.active_row = activeIdd
  //                   console.log(this.frame.active_row)
  //                 }else{
  //                   this.frame.active_row = parseFloat(el.nextElementSibling.id.split("--")[1]);
  //                   console.log(this.frame.active_row)
  //                 }
  //               } 

  //             }
  //             else {
  //               this.frame.active_row = 0;
  //               ul.scrollTop = 0;
  //             }

  //           }
  //       }
  //       //  else if (event.keyCode == 13) {
  //       //  // this.setLOVValues(this.limitedRecords[this.lovItemSeq]);
  //       // }
  //     }

  //     if (this.frame.tableRows && this.frame.tableRows.length > 0) {
  //       for (let dataRow of this.frame.tableRows[this.frame.active_row]) {
  //         if (dataRow.Level5) {
  //           for (let r of dataRow.Level5) {
  //             if (r.mirrored_items) {
  //               this.lhs_lib.set_mirror_values(r);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   this.cdr.detectChanges();

  // }


  selectedTable2Row(event) {

    let doc = document.activeElement;
    let name = this.frame.apps_page_frame_seqid + "." + doc.id;

    if (this.table2Body && this.table2Body.nativeElement && this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0 || this.table2Body.nativeElement.children.length==this.frame.active_row) {
      if (!this.frame.active_row) {
        this.frame.active_row = 0;
      }

      // let rowIndex = this.frame.active_row;
      // let displayRecord = this.frame.display_no_of_records ? this.frame.display_no_of_records : 50;
      // if ((rowIndex < this.frame.page_no * displayRecord) && (rowIndex >= ((this.frame.page_no * displayRecord) - displayRecord))) {
      //   let index = rowIndex - ((this.frame.page_no * displayRecord) - displayRecord);
      //   rowIndex = index;
      // }

      // var ul = this.parentDiv.nativeElement;
      // var el = this.table2Body.nativeElement.children[rowIndex];

      // if (ul && el) {
      //   var elRect = el.getBoundingClientRect(),
      //     parRect = ul.getBoundingClientRect();
      //   var elementHeight = elRect.height;

      //   if (this.frame.apps_page_frame_seqid && (this.frame.apps_page_frame_seqid).charAt((this.frame.apps_page_frame_seqid).length - 1) == 'A' && !(this.frame.apps_page_frame_seqid).toLowerCase().includes("-para")) { } else {
      //     if (event.keyCode == 38) {
      //       event.preventDefault();
      //       if ((elRect.top) <= (parRect.top + 90) + elementHeight) {
      //         if (parRect.top + elementHeight >= elRect.top)
      //           ul.scrollTop = ul.scrollTop - (((parRect.top + 90) + elementHeight) - (elRect.top));
      //         else
      //           ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 90) - elRect.top);
      //       }

      //       this.frame.active_row = this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? el.id.split("--")[1] - 1 : this.frame.active_row = 0;
      //       this.lhs_lib.go_item(name, this.frame.active_row);
      //     } else if (event.keyCode == 40) {
      //       event.preventDefault();

      //       if (this.frame.tableRows.length - 1 > this.frame.active_row) {

      //         if (!(elRect.top >= parRect.top &&
      //           elRect.bottom <= parRect.bottom - 20 &&
      //           elRect.bottom + elementHeight <= parRect.bottom - 20)) {
      //           if (parRect.height > elRect.bottom)
      //             ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
      //           else
      //             ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom + 20);
      //         }

      //         if (elRect) {
      //           // this.frame.active_row++;
      //           this.frame.active_row = parseFloat(el.id.split("--")[1]) + 1;
      //         }

      //         this.lhs_lib.go_item(name, this.frame.active_row);
      //       } else {
      //         this.frame.active_row = 0;
      //         ul.scrollTop = 0;
      //         this.lhs_lib.go_item(name, this.frame.active_row);
      //       }
      //     }
      //     //  else if (event.keyCode == 13) {
      //     //  // this.setLOVValues(this.limitedRecords[this.lovItemSeq]);
      //     // }
      //   }
      // }

      let ul = this.parentDiv.nativeElement;
      let children: any = this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0 ? this.table2Body.nativeElement.children : [];
      let el = this.table2Body.nativeElement.children[this.frame.active_row];
      for (let c of children) {
        if (c.className.includes("trow-active")) {
          el = c;
        }
      }

      var elRect = el.getBoundingClientRect(),
        parRect = ul.getBoundingClientRect();
      if (elRect && parRect) {
        var elementHeight = elRect.height;

        if (this.frame.apps_page_frame_seqid && (this.frame.apps_page_frame_seqid).charAt((this.frame.apps_page_frame_seqid).length - 1) == 'A' && !(this.frame.apps_page_frame_seqid).toLowerCase().includes("-para")) { } else {
          if (event.keyCode == 38) {
            if (this.frame.active_row > this.frame.from_record) {
              event.preventDefault();
              if ((elRect.top) <= (parRect.top + 40) + elementHeight) {
                if (parRect.top + elementHeight >= elRect.top)
                  ul.scrollTop = ul.scrollTop - (((parRect.top + 40) + elementHeight) - (elRect.top));
                else
                  ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 40) - elRect.top);
              }

              // this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? this.frame.active_row-- : this.frame.active_row = 0;
              this.frame.active_row = this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? el.previousElementSibling.id.split("--")[1] : this.frame.active_row = 0;
            }
            else {
              if (this.frame.current_page_no > 1) {
                this.paginate(this.frame.current_page_no - 1);

              }
            }
          }
          else

            if (event.keyCode == 40) {
              if (this.frame.active_row < this.frame.to_record - 1) {
                if (this.frame.tableRows.length - 1 > this.frame.active_row) {
                  event.preventDefault();
                  if (!(elRect.top >= parRect.top && elRect.bottom <= parRect.bottom - 40 && elRect.bottom + elementHeight <= parRect.bottom - 40)) {
                    if (parRect.height > elRect.bottom)
                      ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
                    else
                      ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom + 40);
                  }
                  if (elRect) {
                    // this.frame.active_row++;
                    this.frame.active_row = parseFloat(el.nextElementSibling.id.split("--")[1]);
                  }
                }
                else {
                  this.frame.active_row = 0;
                  ul.scrollTop = 0;
                }

              }
              else {
                // this.paginate(this.frame.current_page_no + 1);
                ul.scrollTop = 0;
                // this.frame.active_row = 0;

              }

            }
        }

      }

      if (this.frame.tableRows && this.frame.tableRows.length > 0) {
        for (let dataRow of this.frame.tableRows[this.frame.active_row]) {
          if (dataRow.Level5) {
            for (let r of dataRow.Level5) {
              if (r.mirrored_items) {
                this.lhs_lib.set_mirror_values(r);
              }
            }
          }
        }
      }

      this.lhs_lib.go_item(name, this.frame.active_row, true);
    }

    this.cdr.detectChanges();
  }

  calculateFunction(tablerows, heads) {
    var lastRow: any = [];
    var maxMinNum = [];
    var avg = [];
    let funRowlist = []
    this.footerRowFlag = false;
    let tableRows = [];
    if (tablerows) {
      tableRows = tablerows;
    } else {
      tableRows = this.tableRows;
    }

    let funrow = [];
    let head = heads
    let funRowData = []
    for (let i = 0; i < head.length; i++) {
      for (let itemDataArr of tableRows) {
        for (let item of itemDataArr) {
          if (item.Level5) {
            let flag: any;
            let arow: {}
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
                if (flag == "S" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (parseFloat(lastRow[i]) + parseFloat(item.Level5[0].value.replace(/,/g, ""))).toFixed(deci);
                      funRowlist[i] = {
                        key: item.Level5[0].prompt_name,
                        value: lastRow[i]
                      }
                    } else {
                      lastRow[i] = parseFloat(item.Level5[0].value.replace(/,/g, "")).toFixed(deci);
                      funRowlist[i] = {
                        key: item.Level5[0].prompt_name,
                        value: lastRow[i]
                      }
                    }
                  }
                } else if (flag == "X" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    lastRow[i] = Math.max.apply(null, maxMinNum).toFixed(deci);
                    funRowlist[i] = {
                      key: item.Level5[0].prompt_name,
                      value: lastRow[i]
                    }
                  }
                }
                else if (flag == "A" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    avg.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    // lastRow[i] = Math.max.apply(null,maxMinNum);
                    var sum = 0;
                    for (var j = 0; j < avg.length; j++) {
                      sum += parseInt(avg[j], 10); //don't forget to add the base
                    }
                    lastRow[i] = (sum / avg.length).toFixed(deci);
                    funRowlist[i] = {
                      key: item.Level5[0].prompt_name,
                      value: lastRow[i]
                    }
                  }
                } else if (flag == "C" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (Math.round(parseFloat(lastRow[i])) + 1).toFixed(deci);
                      funRowlist[i] = {
                        key: item.Level5[0].prompt_name,
                        value: lastRow[i]
                      }
                    } else {
                      lastRow[i] = 1;
                      funRowlist[i] = {
                        key: item.Level5[0].prompt_name,
                        value: lastRow[i]
                      }
                    }
                  }
                } else if (flag == "M" && item.Level5[0].prompt_name == head[i]) {
                  if (item.Level5[0].value) {
                    maxMinNum.push(parseFloat(item.Level5[0].value.replace(/,/g, "")));
                    lastRow[i] = Math.min.apply(null, maxMinNum).toFixed(deci);
                    funRowlist[i] = {
                      key: item.Level5[0].prompt_name,
                      value: lastRow[i]
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
                  value: lastRow[i]
                }
              }
            }


            // if (this.groupFlag) {

            //   let func = this.funArr.find(x => x.coloumns.item_name == item.Level5[0].item_name);
            //   if (func && func.fun == flag) {
            //     let f = funrow.find(x => x.key == item.Level5[0].prompt_name);
            //     if (f) {
            //       if (lastRow[i]) {
            //         f.key = item.Level5[0].prompt_name;
            //         f.value = lastRow[i];
            //       }
            //     } else {
            //       let obj: any = {};
            //       if (lastRow[i]) {
            //         obj.key = item.Level5[0].prompt_name;
            //         obj.value = lastRow[i];
            //         funrow.push(obj);
            //       } else {
            //         obj.key = item.Level5[0].prompt_name;
            //         obj.value = "0";
            //         funrow.push(obj);
            //       }
            //     }
            //   }
            // }

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
                if (flag == "S" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (parseFloat(lastRow[i]) + parseFloat(item[0].value.replace(/,/g, ""))).toFixed(deci);
                      funRowlist[i] = {
                        key: item[0].prompt_name,
                        value: lastRow[i]
                      }
                    } else {
                      lastRow[i] = (parseFloat(item[0].value.replace(/,/g, ""))).toFixed(deci);
                      funRowlist[i] = {
                        key: item[0].prompt_name,
                        value: lastRow[i]
                      }
                    }
                  }
                } else if (flag == "A" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    avg.push(parseFloat(item[0].value.replace(/,/g, "")));
                    // lastRow[i] = Math.max.apply(null,maxMinNum);
                    var sum = 0;
                    for (var j = 0; j < avg.length; j++) {
                      sum += parseInt(avg[j], 10); //don't forget to add the base
                    }
                    lastRow[i] = (sum / avg.length).toFixed(deci);
                    funRowlist[i] = {
                      key: item[0].prompt_name,
                      value: lastRow[i]
                    }
                  }
                } else if (flag == "C" && item[0].prompt_name == heads[i]) {
                  if (item[0].value) {
                    if (lastRow[i]) {
                      lastRow[i] = (Math.round(parseFloat(lastRow[i])) + 1);
                      funRowlist[i] = {
                        key: item[0].prompt_name,
                        value: lastRow[i]
                      }
                    } else {
                      lastRow[i] = 1;
                      funRowlist[i] = {
                        key: item[0].prompt_name,
                        value: lastRow[i]
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
                      value: lastRow[i]
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
                      value: lastRow[i]
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
                  value: lastRow[i]
                }
              }
            }
            // if (this.groupFlag) {
            //   let func = this.funArr.find(x => x.coloumns.item_name == item[0].item_name);
            //   if (func && func.fun == flag) {
            //     let f = funrow.find(x => x.key == item[0].prompt_name);
            //     if (f) {
            //       if (lastRow[i]) {
            //         f.key = item[0].prompt_name;
            //         f.value = lastRow[i];
            //       }
            //     } else {
            //       let obj: any = {};
            //       if (lastRow[i]) {
            //         obj.key = item[0].prompt_name;
            //         obj.value = lastRow[i];
            //         funrow.push(obj);
            //       } else {
            //         obj.key = item[0].prompt_name;
            //         obj.value = "0";
            //         funrow.push(obj);
            //       }
            //     }
            //   }
            // }
          }
        }
      }
    }

    for (let f of funRowlist) {
      if (f.key !== "WMA_RECORD_INDEX") {
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

  drop(event: CdkDragDrop<string[]>) {
    let newHead = this.frame.apextheaders.find(x => x.prompt_name == this.controlBreakHead[event.previousIndex]);
    let obj = {
      coloumns: newHead,
      status: 'Enabled'
    }
    this.frame.ctrlBrkCond.push(obj);
    this.controlBreakArr = [];
    if (this.groupFlag) {
      let even: any = {};
      even.groupBy = {
        funArr: this.funArr
      }
      even.apex = true;
      this.getdataFromcanvasApex(even)
    } else {
      this.displayData(0, this.displayData);
    }
    //console.log(event);
  }

  // ngAfterViewChecked() {

  //   let table = document.getElementById('resizeCol');

  //   table.addEventListener('mousemove', (e) => {
  //     let log = document.querySelector('#log');
  //   // if (this.resizeFlag) {



  //   //   if (table) {
  //   //     console.log(table);

  //   //     // Query all headers
  //   //     const cols = table.querySelectorAll('th');

  //   //     // Loop over them
  //   //     [].forEach.call(cols, function (col) {
  //   //       // Create a resizer element
  //   //       const resizer = document.createElement('div');
  //   //       resizer.classList.add('resizer');

  //   //       // Set the height
  //   //       // resizer.style.height = `${table.offsetHeight}px`;

  //   //       // Add a resizer element to the column
  //   //       col.appendChild(resizer);


  //   //       // Will be implemented in the next section
  //   //       // createResizableColumn(col, resizer);
  //   //     });
  //   //   }

  //   //   this.resizeFlag = false
  //   // }

  // });
  //   }

  freezHeaderr(isTrue, i, itmName, freezIcon: string) {
    this.isLocked = !this.isLocked;
    let status: boolean = false;
    status = !status;
    let itm = [];
    for (let itemGroup of this.frame.headers) {
      for (let item of itemGroup.Level5) {
        for (let j = 0; j < itemGroup.Level5.length; j++) {
          itm.push(itemGroup.Level5[j]);
          console.log(itm);
          let w = document.getElementById(itmName);
          let leftCol = w.offsetLeft;
          if ((item.item_name === itmName) && this.isLocked) {

            item.headFreezCol = {
              "left": leftCol + "px",
              "z-index": "99999",
              "position": "sticky" + " " + "!" + "important",
              "padding": "0px 0px 0px 5px",
              // "margin": "auto"
            }
            item.freezCol = {
              "text-align": item.datatype == "NUMBER" ? "right" : '',
              "left": leftCol + "px",
              "z-index": "99999",
              "position": "sticky" + " " + "!" + "important",
              "padding": "0px 0px 0px 5px",
              // "margin": "auto",
            }

          } else {
            item.headFreezCol = {}
            console.log(item.headFreezCol)
            item.freezCol = {}
          }
        }


        // let w = document.getElementById(itmName);
        // let leftCol = w.offsetLeft;
        // if((item.item_name === itmName) &&  this.isLocked){

        //   item.headFreezCol = {
        //     "left": leftCol + "px",
        //     "z-index": "99999",
        //     "position": "sticky" + " " + "!" + "important",
        //     "padding": "0px 0px 0px 5px",
        //   }
        //   item.freezCol = { 
        //     "text-align": item.datatype == "NUMBER" ? "right" : '',
        //     "left": leftCol + "px",
        //     "z-index": "99999",
        //     "position": "sticky" + " " + "!" + "important",
        //     "padding": "0px 0px 0px 5px",
        //   }

        // }else{
        //   item.headFreezCol = {}
        //   console.log(item.headFreezCol)
        //   item.freezCol = { }
        // }
        if (isTrue) {
          item.isTrue = false;
        } else {
          item.isTrue = true;
        }
      }
    }
 
  }

  freezHeader(itemName, isFreez) {
    let headerFlag: boolean = false;
    let stylesheet;
    stylesheet = document.styleSheets[0];

    for (let itemGroup of this.frame.headers) {
      for (let item of itemGroup.Level5) {
        if (item.item_visible_flag == 'T') {
          if ((item.isFreez && isFreez) || headerFlag) {
            // stylesheet.insertRule(`.${item.item_name.toLowerCase()} {}`, 0);

            const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
            for (let i = 0; i < rules.length; i++) {
              let count = 0;
              if ((rules[i].selectorText === '.' + item.item_name.toLowerCase()) ||
                (rules[i].selectorText === 'tr:nth-child(even) td.' + item.item_name.toLowerCase()) || (rules[i].selectorText === 'tr:nth-child(odd) td.' + item.item_name.toLowerCase())) {
                stylesheet.deleteRule(i);
                count++;
                if (count == 3) {
                  break;
                }
              }
            }
            item.isFreez = false;
            delete item['headFreezCol'];
            delete item['freezCol'];
          } else {
            delete item['headFreezCol'];
            delete item['freezCol'];
            item.isFreez = true;

            setTimeout(() => {
              let w = document.getElementById(item.item_name);
              let leftCol = w.offsetLeft;
              let freezCol = `{ left: ${leftCol}px; padding: 0px 0px 0px 5px; }`;
              stylesheet.insertRule(`.${item.item_name.toLowerCase()} ${freezCol}`, 0);
              stylesheet.insertRule(`tr:nth-child(even) td.${item.item_name.toLowerCase()} {background-color: #eff6ff;position: sticky !important;z-index: 1 !important}`, 0);
              stylesheet.insertRule(`tr:nth-child(odd) td.${item.item_name.toLowerCase()} {background-color: #fff;position: sticky !important;z-index: 1 !important}`, 0);
              stylesheet.insertRule(`th.${item.item_name.toLowerCase()} {background-color: #fff;position: sticky !important;z-index: 99999 !important}`, 0);

            }, 1);
          }
          if ((item.item_name === itemName) && (!headerFlag)) {
            headerFlag = true;
            if (!isFreez) {
              break;
            }
          }
        }
      }
      if (headerFlag && (!isFreez)) {
        break;
      }
    }
    this.cdr.detectChanges();
  }

  filterFunc(event) {
    delete this.frame['searchableData'];
    if (event.where_Arr && event.where_Arr.length > 0) {
      for (let w of event.where_Arr) {
        if (this.frame.searchableData) {
          let data = this.colFilter.transform(this.frame.searchableData, w.key, w.value, w.value);
          this.frame.searchableData = data;
        } else {
          let data = this.colFilter.transform(this.frame.tableRows, w.key, w.value, w.value);
          this.frame.searchableData = data;
        }
        // console.log(data);
      }
    }
    this.processData.afterTableRows(this.frame, null, null, 1);
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    let stylesheet: any = document.styleSheets[0];
    if (this.frame.headers && this.frame.headers.length > 0) {
      for (let itemGroup of this.frame.headers) {
        for (let item of itemGroup.Level5) {
          if (item.item_visible_flag == 'T') {
            const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
            for (let i = 0; i < rules.length; i++) {
              let count = 0;
              if ((rules[i].selectorText === '.' + item.item_name.toLowerCase()) ||
                (rules[i].selectorText === 'tr:nth-child(even) td.' + item.item_name.toLowerCase()) || (rules[i].selectorText === 'tr:nth-child(odd) td.' + item.item_name.toLowerCase())) {
                stylesheet.deleteRule(i);
                count++;
                if (count == 3) {
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

 
  pageUp(event) {
    console.log(event);
    event.preventDefault();
    if (this.frame.page_no < this.frame.count_of_pages) {
      event.preventDefault();
      this.paginate(this.frame.page_no + 1);
    }
  }

  pageDown(event) {
    console.log(event);
    event.preventDefault();
    if (this.frame.page_no > 1) {
      this.paginate(this.frame.page_no - 1);
    }
  }

  cbEvent(name) {
    for (let itemGroup of this.frame.headers) {
      for (let item of itemGroup.Level5) {
        if (item.item_type == 'CHECK_BOX' && item.item_name.toLowerCase() == name.toLowerCase()) {
          for (let tableData of this.frame.tableRows) {
            for (let itemGroup_mast of tableData) {
              for (let item_mast of itemGroup_mast.Level5) {
                if (item_mast.item_type == 'CHECK_BOX' && item_mast.item_name == item.item_name) {
                  item_mast.touched = true;
                  // item.isChecked = this.cB.isChecked;
                  if (item.isChecked) {
                    item_mast.value = "Y";
                    item_mast.isValid = true;
                  } else {
                    item_mast.value = 'N'
                    item_mast.isValid = false;
                  }
                }
              }
            }
          }
        }
      }
    }
    this.cdr.detectChanges();
  }

  onEmitChange() {
    let event = {
      apps_item_seqid: null,
      apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
      calling_parameter_str: `app_add_para('P_CP_OBJECT_FRAME_CODE','${this.frame.apps_page_frame_seqid}');app_add_para('P_CP_OBJECT_CODE','${this.frame.object_code}')`,
      apps_page_no: "1",
      calling_object_code: "WMABLD57",
      click_events_str: "get_object_config",
      object_code: "WMABLD57",
      wsdp: [],
      wscp: {
        flag: 'M',
        object_code: 'WMABLD57'
      }
    }
    this.emitPass.emit(event);
  }

}

