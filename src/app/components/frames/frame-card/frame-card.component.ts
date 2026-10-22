import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, Directive, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { ModalController, Platform, IonInfiniteScroll,  PopoverController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Events } from 'src/app/services/events';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { left } from '@popperjs/core';
import { CardButtonModalComponent } from '../../layout/card-button-modal/card-button-modal.component';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { FrameApexfilterComponent } from '../frame-apexfilter/frame-apexfilter.component';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { DatePipe } from '@angular/common';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FrameCanvasFilterComponent } from '../frame-canvas-filter/frame-canvas-filter.component';
import { TableToolsComponent } from '../../frameModule/table-tools/table-tools.component';
import { ItemsModule } from '../../items/items.module';
import { FramesModule } from '../frames.module';
import { CanvasItemSearchPipe } from 'src/app/pipes/canvas-item-search.pipe';
import { ItemsComponent } from '../../items/items.component';
import { FocusDirective } from 'src/app/directives/focus-directive';
import { MergeLevel5Pipe } from 'src/app/pipes/merge-level5-pipe';


// @Directive({
//   selector: "[focusDirCard]"
// })
// export class FocusDirectiveCard {
//   constructor(private globalObjects: GlobalObjectsService) {
//     if (this.globalObjects.frameFlag) {
//       return applyLoggingDecorator(this, "FocusDirectiveCard-frame-card-frame")
//     }
//   }

//   @HostListener("keyup.enter") onKeyupEnter() {
//     var nextEl = this.findNextTabStop(document.activeElement);
//     nextEl.focus();
//   }

//   findNextTabStop(el) {
//     var universe = document.querySelectorAll(
//       "input,select,ion-button"
//     );
//     var list = Array.prototype.filter.call(universe, (item) => {
//       return item.tabIndex >= "0";
//     });
//     var index = list.indexOf(el);
//     index++;
//     while (index < list.length) {
//       if (!list[index].readOnly && !list[index].disabled) {
//         return list[index];
//       } else {
//         index++;
//       }
//     }
//     return list[0];
//   }
// }

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,MergeLevel5Pipe,FrameCanvasFilterComponent,TableToolsComponent,ScrollingModule,CanvasItemSearchPipe,ItemsComponent,FocusDirective],
  selector: 'app-frame-card',
  templateUrl: './frame-card.component.html',
  styleUrls: ['./frame-card.component.scss'],

})
export class FrameCardComponent implements OnInit {
  item: any;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() searchGlobalemit: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  dataList: any;

  itemSize = 100;
  sizeFlag = true;

  @ViewChildren(CdkVirtualScrollViewport) viewPorts: QueryList<CdkVirtualScrollViewport>;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  // @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  @Input() sessionObj: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass1: EventEmitter<any> = new EventEmitter<any>();

  sepKey = [];
  cardHeight = { 'height': '100vh' };

  listLength: number;
  thead: any = [];
  thead2: any = [];
  dispalyss: any = { "color": "red", "text-yellow": "pink" };
  userDetails: any;
  l_total_rows: number;
  l_current_page: number = 1;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_totalPage: number;
  l_where_str: any;
  filterFormData: any = [];
  l_card_title: any;
  tablerowsfilter: any;
  wscp: any = {};
  loadMoreFlag: boolean;
  searchFlag: any = false;
  canvasfilter: any = false;
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  scrollFlag: boolean = false;
  tableRows: any = [];
  flagtoruncanvasfilter: boolean;
  noRecordMessage = "There are no records to show..";
  getcanvasWCP: boolean = false;
  cardtitleFlag: boolean = true;
  filter: boolean = false;
  toggleFilter: boolean = false;

  callingObjectArr = [];
  colSize: any = [];
  footer_flag: boolean = false;
  right_flag: boolean = false;
  left_flag: boolean = false;
  enablefunnel: boolean = false;

  headerarr: any = [];
  footerArr: any = [];
  cardRightArray: any = [];
  cardLeftArray: any = [];

  totalData: any = [];
  fromRowLocal: number = 0;
  toRowLocal: number = 50;
  total_Pages: number;
  currentPage: number = 1;
  noOfCard: number = 50;
  developerModeData: any;
  switchFlag: boolean = false;
  mikeStyle: any;

  filterAbleData = [];

  searchText: any;

  displayFixedRecord: boolean = true;
  displayFixedrecordLength = 50;

  scrollTo = 120;
  items = [];
  toastCtrl: any;
  subscribeRefreshFlag = false;
  refreshing = false;
  childFrame: boolean = false;

  item_search_flag: boolean = false;
  plt: any = 'browser';
  isSeeAll: boolean = false
  excelheads: any = {};
  excelCol: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ', 'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ', 'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FU', 'FV', 'FW', 'FX', 'FY', 'FZ', 'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ', 'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GX', 'GY', 'GZ', 'HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'HG', 'HH', 'HI', 'HJ', 'HK', 'HL', 'HM', 'HN', 'HO', 'HP', 'HQ', 'HR', 'HS', 'HT', 'HU', 'HV', 'HW', 'HX', 'HY', 'HZ', 'IA', 'IB', 'IC', 'ID', 'IE', 'IF', 'IG', 'IH', 'II', 'IJ', 'IK', 'IL', 'IM', 'IN', 'IO', 'IP', 'IQ', 'IR', 'IS', 'IT', 'IU', 'IV', 'IW', 'IX', 'IY', 'IZ', 'JA', 'JB', 'JC', 'JD', 'JE', 'JF', 'JG', 'JH', 'JI', 'JJ', 'JK', 'JL', 'JM', 'JN', 'JO', 'JP', 'JQ', 'JR', 'JS', 'JT', 'JU', 'JV', 'JW', 'JX', 'JY', 'JZ', 'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'KG', 'KH', 'KI', 'KJ', 'KK', 'KL', 'KM', 'KN', 'KO', 'KP', 'KQ', 'KR', 'KS', 'KT', 'KU', 'KV', 'KW', 'KX', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LK', 'LL', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LT', 'LU', 'LV', 'LW', 'LX', 'LY', 'LZ', 'MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MI', 'MJ', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'NG', 'NH', 'NI', 'NJ', 'NK', 'NL', 'NM', 'NN', 'NO', 'NP', 'NQ', 'NR', 'NS', 'NT', 'NU', 'NV', 'NW', 'NX', 'NY', 'NZ', 'OA', 'OB', 'OC', 'OD', 'OE', 'OF', 'OG', 'OH', 'OI', 'OJ', 'OK', 'OL', 'OM', 'ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT', 'OU', 'OV', 'OW', 'OX', 'OY', 'OZ', 'PA', 'PB', 'PC', 'PD', 'PE', 'PF', 'PG', 'PH', 'PI', 'PJ', 'PK', 'PL', 'PM', 'PN', 'PO', 'PP', 'PQ', 'PR', 'PS', 'PT', 'PU', 'PV', 'PW', 'PX', 'PY', 'PZ', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG', 'QH', 'QI', 'QJ', 'QK', 'QL', 'QM', 'QN', 'QO', 'QP', 'QQ', 'QR', 'QS', 'QT', 'QU', 'QV', 'QW', 'QX', 'QY', 'QZ', 'RA', 'RB', 'RC', 'RD', 'RE', 'RF', 'RG', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RM', 'RN', 'RO', 'RP', 'RQ', 'RR', 'RS', 'RT', 'RU', 'RV', 'RW', 'RX', 'RY', 'RZ', 'SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SQ', 'SR', 'SS', 'ST', 'SU', 'SV', 'SW', 'SX', 'SY', 'SZ', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH', 'TI', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP', 'TQ', 'TR', 'TS', 'TT', 'TU', 'TV', 'TW', 'TX', 'TY', 'TZ', 'UA', 'UB', 'UC', 'UD', 'UE', 'UF', 'UG', 'UH', 'UI', 'UJ', 'UK', 'UL', 'UM', 'UN', 'UO', 'UP', 'UQ', 'UR', 'US', 'UT', 'UU', 'UV', 'UW', 'UX', 'UY', 'UZ', 'VA', 'VB', 'VC', 'VD', 'VE', 'VF', 'VG', 'VH', 'VI', 'VJ', 'VK', 'VL', 'VM', 'VN', 'VO', 'VP', 'VQ', 'VR', 'VS', 'VT', 'VU', 'VV', 'VW', 'VX', 'VY', 'VZ', 'WA', 'WB', 'WC', 'WD', 'WE', 'WF', 'WG', 'WH', 'WI', 'WJ', 'WK', 'WL', 'WM', 'WN', 'WO', 'WP', 'WQ', 'WR', 'WS', 'WT', 'WU', 'WV', 'WW', 'WX', 'WY', 'WZ', 'XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK', 'XL', 'XM', 'XN', 'XO', 'XP', 'XQ', 'XR', 'XS', 'XT', 'XU', 'XV', 'XW', 'XX', 'XY', 'XZ', 'YA', 'YB', 'YC', 'YD', 'YE', 'YF', 'YG', 'YH', 'YI', 'YJ', 'YK', 'YL', 'YM', 'YN', 'YO', 'YP', 'YQ', 'YR', 'YS', 'YT', 'YU', 'YV', 'YW', 'YX', 'YY', 'YZ', 'ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'ZF', 'ZG', 'ZH', 'ZI', 'ZJ', 'ZK', 'ZL', 'ZM', 'ZN', 'ZO', 'ZP', 'ZQ', 'ZR', 'ZS', 'ZT', 'ZU', 'ZV', 'ZW', 'ZX', 'ZY', 'ZZ']
  isNotTool: boolean = false
  isNotExport: boolean = false
  isNotExportPdf: boolean = false
  isNotExportExcel: boolean = false
   isNotExportCsv: boolean = false
  isOpenMoreOption = false
  fileTyle = "pdf"
  clickShare: boolean = false;
  selectedExportDataType = "selectData"
  summaryRow
  pdfheads = [];
  excelHeading: any;
  toolsExport: any
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events, public modalController: ModalController, private popoverController: PopoverController,
    public tableseach: SearchfilterPipe, public platform: Platform, private pipemy: SearchfilterPipe, private processData: ProcessDataService
    , public lhs_lib: LhsLibService, private cdr: ChangeDetectorRef, private canvasModal: CanvasModalService, private datePipe: DatePipe, private commonMethod: CommonMethodService) {

    // this.items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
    this.userDetails = this.globalObjects.userDetails;
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "frame-card-frame")
    }
  }


  ngOnInit() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.plt = this.platform;
    }

    for (let itemGroup of this.frame.Level4) {
      if (this.frame.apps_frame_sub_type == "IMAGE") {
        console.log("frame value : " + this.frame.Level4);
      }
      for (let item of itemGroup.Level5) {

        if (item.item_name == "WMA_FRAME_STATUS") {
          item.value = 'D';
        }
      }
    }

    if (this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1) {
      this.frame.collapse = false;
      this.frame.showCollapse = true;
    } else {
      this.frame.collapse = true;
      this.frame.showCollapse = false;
    }


    if (this.frame.display_no_of_records) {
      this.displayFixedrecordLength = parseFloat(this.frame.display_no_of_records);
      this.noOfCard = parseFloat(this.frame.no_of_records);
    }

    this.developerModeData = {
      ws_seq_id: "",
      frame_seq_id: this.frame.apps_page_frame_seqid
    }
    let exelHeads: any = [];
    let pdfHeads: any = [];
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      let hideBtnFlag = false;
      for (let itemMast of itemGroup.Level5) {

        if (itemMast.item_type == "ADD_ROW_BT" || itemMast.item_type == "DELETE_ROW_BT" || itemMast.item_name.toLowerCase().includes("wma_")) { }
        else {

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

      }
    }
    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split(";") : [];
    for (let x of frameFilterFlag) {
      if (x.toUpperCase() === 'SEARCH_BAR') {
        this.searchFlag = true;
        if (!this.frame.search) {
          this.frame.search = "";
        }
      }
      if (x.toUpperCase() === 'IS') {
        this.frame.item_search_flag = true;
      }
      if (x.toUpperCase() === 'C' || x.toUpperCase() === 'J' || x.toUpperCase() === 'SMART_FILTER' || x.toUpperCase() == 'D&D') {
        this.enablefunnel = true;
      }
      //  if (x.toUpperCase() === 'STC') {
      //   this.switchFlag = true;
      // }
      if (x.toUpperCase() === 'NO_TOOLS') {
        this.isNotTool = true
      }
      if (x.toUpperCase() === 'NO_EXPORT') {
        this.isNotExport = true
      }
      if (x.toUpperCase() === 'NO_EXPORT_PDF') {
        this.isNotExportPdf = true
        this.fileTyle = 'excel'
      }
      if (x.toUpperCase() === 'NO_EXPORT_EXCEL') {
        this.isNotExportExcel = true
      }
      if (x.toUpperCase() === 'NO_EXPORT_CSV') {
          this.isNotExportCsv = true
        }
    }

    if (this.frame.calenderflag) {
      this.processData.afterTableRows(this.frame);
      this.frame.loading = false;
    }

    this.frame.headers = JSON.parse(JSON.stringify(this.frame.Level4));
    if (this.frame.changeFrameType) {
      this.switchFlag = true;
    }
    this.pdfheads = pdfHeads;
    this.excelheads = exelHeads;
    // this.popupSubscribe()
  }



  filterToggle() {
    if (this.show_filter == 'show') {
      this.show_filter = 'dontshow';
    }
    else {
      this.show_filter = 'show';

      let frameFilterFlag = this.frame.frame_filter_flag.split(";");
      for (let x of frameFilterFlag) {

        if (x.toUpperCase() === 'C' || x.toUpperCase() === 'J' || x.toUpperCase() === 'SMART_FILTER' || x.toUpperCase() == 'D&D') {
          this.toggleFilter = true;
        }
      }
    }
    // this.cdr.detectChanges();
  }

  onSwitch() {
    if (this.frame.temp_frame_type) {
      this.frame.apps_frame_type = this.frame.temp_frame_type;
    } else {
      this.frame.apps_frame_type = 'ENTRY_TABLE'
      this.frame.temp_frame_sub_type = this.frame.apps_frame_sub_type
      this.frame.apps_frame_sub_type = "BASIC"
    }

    this.processData.afterTableRows(this.frame);
  }

  getdataFromcanvasFilter(event) {
    this.getcanvasWCP = true;
    let array = [];
    this.tableRows = [];
    this.headerarr = [];
    this.footerArr = [];
    this.cardRightArray = [];
    this.cardLeftArray = [];
    this.frame.tableRows = [];
    this.listLength = 0;
    this.scrollFlag = true;
    this.filter = false;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;

    array = event.where_str;

    this.l_where_str = [];
    if (array.length > 0) {
      for (let data of array) {
        this.l_where_str += data + "  ";
      }
    }
    else {
      this.l_where_str = "";
    }
    this.frame.l_where_str = this.l_where_str;
    this.fromRowLocal = 0;
    this.toRowLocal = this.noOfCard;
  }


  itemClicked(event, j) {
    var rowindex = event.indexcount;
    for (let dataRow of this.frame.tableRows[rowindex]) {
      for (let r of dataRow.Level5) {
        if (r.item_name == "ROWNUMBER") {
          rowindex = r.value - 1;
        }

        if (r.mirrored_items) {
          this.lhs_lib.set_mirror_values(r);
        }
      }
    }

    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = rowindex;
    if (rowindex == undefined || this.frame.calenderflag) {
      rowindex = j;
    }
    if (event.click_events_str == "editItem" || event.click_events_str == "deleteItem") {
      rowindex = j;
    }

    event.callingObjectArr = this.frame.callingObjectArr;
    let col = {};
    for (let itemGroup of this.frame.tableRows[rowindex]) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if (item.codeOfValues) {
            col[item.apps_item_seqid] = item.codeOfValues
          } else {
            col[item.apps_item_seqid] = item.value ? item.value.toString() : "";
          }
        }
      }
    }
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;

    if (event.click_events_str == "editItem") {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[j]))
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            let temp = item.design_control_type_auto_card;
            item.design_control_type_auto_card = item.design_control_type;
            item.design_control_type = temp;
            temp = item.display_setting_str_auto_card;
            item.display_setting_str_auto_card = item.display_setting_str;
            item.display_setting_str = temp;
            temp = item.flag_auto_card;
            item.flag_auto_card = item.item_visible_flag;
            item.item_visible_flag = temp;
            item.item_type = item.temp_item_type
          }
        }
      }
      this.frame.tableRows.splice(rowindex, 1);
      if (this.frame.addTableRows && this.frame.addTableRows.length > 0) {
        this.frame.addTableRows.splice(rowindex, 1);
      }
      event.EDIT_ITEM = frameLevel4;

      event.wsdpcl = [];
      event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);
      this.emitPass.emit(event);
    } else if (event.click_events_str == "deleteItem") {
      this.frame.tableRows.splice(rowindex, 1);
      if (this.frame.addTableRows && this.frame.addTableRows.length > 0) {
        this.frame.addTableRows.splice(rowindex, 1);
      }
    }
    else {
      event.wsdp = [];
      let col = {};
      for (let itemGroup of this.frame.tableRows[rowindex]) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {

            // item.click_events_str = item.orignal_click_events_str != undefined ? item.orignal_click_events_str : item.click_events_str;

            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else if (item.value) {
              if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
              } else {
                col[item.apps_item_seqid] = item.value;
              }
            } else {
              col[item.apps_item_seqid] = ""
            }
          }
        }
      }
      event.wsdp.push(col);
    }
    event.itemIndex = j;
    if (this.frame.calenderflag) {
      this.emitPass1.emit(event);
    } else {

      event.wsdpcl = [];
      event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);
      this.emitPass.emit(event);
    }
  }


  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
    this.getdataFromcanvasFilter(event);
  }

  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.frame.search = res;
    });
  }

  openbarcodescanner() {
    this.globalObjects.barcodescanner().then(res => {
      this.frame.search = res;
    });
  }


  itemValueChange(event, rowindex) {
    if (event.itemClicked == 'post' || event.itemClicked == 'load') {

      event.itemIndex = rowindex;
      event.wsdpcl = [];
      event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);
      this.emitPass.emit(event);
    }
    if (event.dependent_column_str) {
      let wsdp = [];
      let dependent_column_arr = event.dependent_column_str.split("#")
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
      if (event.dependent_column_sql && event.value) {
        this.getDependentData(event, rowindex).then(res => {
          if (res === "success") {
            if (event.post_text_validate_plsql) {
              this.PostTextValidatePlsql(event, rowindex);
            }
          }
        });
      } else if (event.post_text_validate_plsql && event.value) {
        this.PostTextValidatePlsql(event, rowindex);
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

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": event.wsdp
      }

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
        this.globalObjects.presentToast("1.6 Something went wrong please try again later!");
      })
    })
  }

  PostTextValidatePlsql(event, rowindex) {
    this.globalObjects.showLoading();
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
          this.globalObjects.clickedbutton = false;
        }
      }
    }).catch(err => {

      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
    })

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

  debounce(callback, delay = 1000) {
    var time;

    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }


  getSearchResult = this.debounce((newFunc) => {
    if (newFunc.name == 'searchAllData') {
      this.searchAllData();
    }

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

    // this.cdr.detectChanges();
  }, 1000);

  searchAllData() {
    let data = this.processData.searchAllData(this.frame);
    this.processData.populateRows(this.frame.apps_page_frame_seqid, data);
  }


  toggleFrame() {
    if (this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1) {
      this.frame.collapse = !this.frame.collapse
      // this.cdr.detectChanges();
    }
  }

  ngAfterViewChecked() {
    let height = document.getElementById('cardHeight');
    if (height) {
      if (this.sizeFlag) {
        if (height.clientHeight) {

          if (this.frame.display_no_of_records) {
            let screenheight = document.getElementById('super').clientHeight;
            let displayHeight = (height.clientHeight + 12) * parseFloat(this.frame.display_no_of_records);

            if (displayHeight < screenheight) {
              this.cardHeight.height = (displayHeight) + 'px';
            } else {
              this.cardHeight.height = '100vh';
            }
          } else {
            this.cardHeight.height = '100vh';
          }
          this.itemSize = (height.clientHeight + 15);
          this.sizeFlag = false;
        }
      }
    }
  }


  toggleCard(itm, index) {
    for (let i = 0; i < itm.Level5.length; i++) {
      if (i == index) {
        itm.Level5[i].sepFrame = 'SHOW';
      } else {
        itm.Level5[i].sepFrame = 'HIDE';
      }
    }
    // this.cdr.detectChanges();
  }

  toggleSep(item) {
    if (item.sepCollapse == "SHOW") {
      item.sepCollapse = "HIDE"
    } else {
      item.sepCollapse = "SHOW"
    }
    // this.cdr.detectChanges();
  }

  trackByFunction(index, item) {
    return item;
  }
  seeMore(rows, j) {
    if (!rows[j].isSeeMore) {
      rows[j].isSeeMore = true
    } else {
      delete rows[j]['isSeeMore']
    }
    // this.cdr.detectChanges();
  }

  async moreButton(containerRows, rowindex, ev: any) {
    const popover = await this.popoverController.create({
      component: CardButtonModalComponent,
      id: 'morebutton',
      event: ev,
      translucent: true,
      side: left,
      componentProps: {
        containerRows: containerRows,
        rowindex: rowindex
      }

    });
    popover.onDidDismiss().then((detail: any) => {
      console.log(detail)
      if (detail.data) {
        this.itemClicked(detail.data, rowindex)
      }
    })
    await popover.present();

  }
  SeeAllChanage() {
    this.isSeeAll = !this.isSeeAll
  }
  apexNgStyle
  apexNgStyleFlag
  order_by_str
  controlBreakArr = []
  whereStrFlag
  conditionalFilterData = []
  controlBreakFlag
  groupFlag
  funArr
  displayDataLen
  isAggrigate
  freezeColArr = []
  controlBreakHead
  footerRowFlag
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
    this.canvasModal.openModal(component, componentProps, id, event, cssClass, "", "", "", title).then((detail) => {
      if (detail.data) {
        //  console.log(detail.data);
        this.getdataFromcanvasApex(detail.data)
      }
    })
  }

  moreOption() {
    this.isOpenMoreOption = !this.isOpenMoreOption
    //  this.isTemplateOpen = false
    //  this.isFunctionOpen = false
    //  this.isColumnOpen = false
    this.toolsExport = {
      frame: this.frame,
      wscp_send_input: this.wscp_send_input,
      l_where_str: this.l_where_str,
      wsdp: this.wsdp,
      userDetails: this.userDetails,
      wsdpcl: this.wsdpcl,
      summaryRow: this.summaryRow,
      pdfheads: this.pdfheads,
      footerRowFlag: this.footerRowFlag,
      excelHeading: this.excelHeading,
      excelheads: this.excelheads,
      excelCol: this.excelCol
    }
  }

  getdataFromcanvasApex(event: any) {
    if (event.visibleItems) {
      this.frame.tableRows = [];

      this.commonMethod.generateApexLevel4(this.frame, this.funArr, this.freezeColArr, this.thead);
      this.commonMethod.generateApexPage(1, this.frame, this.displayFixedrecordLength, this.filterAbleData, this.processData);
      if (this.conditionalFilterData.length > 0) {
        this.commonMethod.getitemSearch(this.frame, this.displayFixedrecordLength, this.conditionalFilterData, this.processData)
      }

      if (event.reqData) {
        let obj = {
          'reqData': event.reqData,
          'personalization': true
        }
        this.emitPass.emit(obj);

      }
    }
    else if (event.filteredData) {
      if (event.filteredData.length == 0) {
        this.frame.filterAbleArr = [];
        this.conditionalFilterData = []
        this.commonMethod.getitemSearch(this.frame, this.displayFixedrecordLength, this.conditionalFilterData, this.processData)
      } else {
        this.conditionalFilterData = event.filteredData
        this.commonMethod.getitemSearch(this.frame, this.displayFixedrecordLength, this.conditionalFilterData, this.processData)
      }
      if (this.frame.visibleItems) {
        this.commonMethod.generateApexLevel4(this.frame, this.funArr, this.freezeColArr, this.thead);
        this.commonMethod.generateApexPage(1, this.frame, this.displayFixedrecordLength, this.filterAbleData, this.processData);
      }
    }
    else if (event.clear) {
      if (event.clear == 'All') {
        this.frame.headers = JSON.parse(JSON.stringify((this.frame.Level4)));
        this.frame.tHead = this.thead;
        this.funArr = [];
        this.footerRowFlag = false;

        if (event.clearData == 'filter') {
          if (this.frame.isCheck) { delete this.frame['isCheck'] }
          this.filterAbleData = [];
          this.clear(0, 'filter')

        }
        else {
          if (this.frame.isCheck) { delete this.frame['isCheck'] }
          this.filterAbleData = [];
          this.controlBreakArr = [];
          this.clear(0, 'filter')
        }
      }
    }
  }
  clear(i, ev, type?) {
    let event: any = {};
    event.apex = true;
    if (ev == 'filter') {
      if (this.frame.filterAbleArr && this.frame.filterAbleArr.length > 0) {
        this.frame.filterAbleArr.splice(i, 1);
      }
      if (this.frame.filterAbleArr && this.frame.filterAbleArr.length > 0) {
        let event: any = {};
        event.filteredData = this.frame.filterAbleArr;
        event.apex = true;
        this.getdataFromcanvasApex(event)
      } else {
        this.frame.filterAbleArr = [];
        event.filteredData = this.frame.tableData
        this.frame.ctrlBrkCond = [];
        event.clear = 'All';
        this.getdataFromcanvasApex(event)
      }
    } if (ev == 'All') {
      event.clear = ev;
      this.frame.filterAbleArr = [];
      event.clearData = type
      this.getdataFromcanvasApex(event)
    }
  }
  clearData() {
    this.frame.filterAbleArr = [];
    this.conditionalFilterData = []
    this.commonMethod.getitemSearch(this.frame, this.displayFixedrecordLength, this.conditionalFilterData, this.processData)
  }
  clearAllFilter() {

    this.frame.apexFrameLevel4 = [];
    this.frame.filterAbleArr = [];
    this.frame.selectedCols = [];
    this.frame.visibleItems = []
    delete this.frame['columnsData']
    this.clear(0, 'All');
  }
  // popupSubscribe() {
  //   this.events.subscribe(`popupSubscribe#${this.frame.apps_page_frame_seqid}`, res => {
  //     this.getdataFromcanvasApex(res)
  //   });
  // }
  // ngOnDestroy() {
  //   this.events.unsubscribe(`popupSubscribe#${this.frame.apps_page_frame_seqid}`);
  // }
  fullScreen(fullscreen_id: any, status) {
    this.commonMethod.fullScreen(fullscreen_id, status)
    return

    if (status == '1') {
      let element = document.getElementById(fullscreen_id);
      // Add a class to the element
      element.classList.add("active_fullscreen");
      element.classList.remove("deactive_fullscreen");
      document.getElementById(fullscreen_id + "fullscreen_btn1").style.display = "none";
      document.getElementById(fullscreen_id + "fullscreen_btn2").style.display = "inherit";
      document.getElementById(fullscreen_id + "fullscreen_btn2").style.border = "2px solid #2e6adf";
      console.log('active');
    } else {
      let element = document.getElementById(fullscreen_id);

      element.classList.remove("active_fullscreen");
      element.classList.add("deactive_fullscreen");

      document.getElementById(fullscreen_id + "fullscreen_btn1").style.display = "inherit";
      document.getElementById(fullscreen_id + "fullscreen_btn2").style.display = "none";

      console.log('active');
    }
  }

  selectFile(type) {
    this.fileTyle = type
  }
  cancelExport() {
    this.clickShare = false
  }
  confirmExport() {
    this.clickShare = false
    let obj = {
      frame: this.frame,
      wscp_send_input: this.wscp_send_input,
      l_where_str: this.l_where_str,
      wsdp: this.wsdp,
      userDetails: this.userDetails,
      wsdpcl: this.wsdpcl,
      selectedExportDataType: this.selectedExportDataType,
      summaryRow: this.summaryRow,
      pdfheads: this.pdfheads,
      footerRowFlag: this.footerRowFlag,
      excelHeading: this.excelHeading,
      excelheads: this.excelheads,
      excelCol: this.excelCol
    }
    this.commonMethod.getDataForGraph(this.fileTyle, '', obj)
    this.selectedExportDataType = "selectData"
  }


  getMode(i, ev, event2) {
    // this.presentPopover(ev, event2);
  }
  getShare(event) {
    this.clickShare = false;
    let obj = {
      frame: this.frame,
      wscp_send_input: this.wscp_send_input,
      l_where_str: this.l_where_str,
      wsdp: this.wsdp,
      userDetails: this.userDetails,
      wsdpcl: this.wsdpcl,
      selectedExportDataType: this.selectedExportDataType,
      summaryRow: this.summaryRow,
      pdfheads: this.pdfheads,
      footerRowFlag: this.footerRowFlag,
      excelHeading: this.excelHeading,
      excelheads: this.excelheads,
      excelCol: this.excelCol
    }
    this.commonMethod.getDataForGraph('pdf', event, obj)
    // this.getDataForGraph(this.fileTyle, '')
    this.selectedExportDataType = "selectData"
  }
  columnFilterEmitPass(event) {
    this.emitPass.emit(event)
  }
}
