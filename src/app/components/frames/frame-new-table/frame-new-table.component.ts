import { DatePipe, isPlatformServer } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { IonInput, ModalController, Platform, PopoverController } from '@ionic/angular/standalone';
import { ApexActionFilterPage } from 'src/app/pages/apex-action-filter/apex-action-filter.page';
import { ColumnfilterPipe } from 'src/app/pipes/column-filter';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { Events } from 'src/app/services/events';

import { IonModal } from '@ionic/angular/standalone';
import { FrameApexfilterComponent } from '../frame-apexfilter/frame-apexfilter.component';
import { WebdatarocksComponent } from 'src/app/demo-utils/pivot-table-webdatarocks/webdatarocks.component';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { DoubleclickComponent } from '../../layout/doubleclick/doubleclick.component';
import { ChatAiService } from 'src/app/services/chat-ai.service';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { PaginationComponent } from '../../frameModule/pagination/pagination.component';
import { ItemsComponent } from '../../items/items.component';
import { TableToolsComponent } from '../../frameModule/table-tools/table-tools.component';
import { ParaTextComponent } from '../../items/item-display/para-text/para-text.component';
import { DownloadDocComponent } from '../../items/item-display/download-doc/download-doc.component';
import { ButtonNComponent } from '../../items/item-display/button-n/button-n.component';
import { FrameAiDataComponent } from '../frame-ai-data/frame-ai-data.component';
import { FormatMaskPipe } from 'src/app/pipes/format-mask-pipe';
import { TableColumnToolComponent } from '../../frameModule/table-column-tool/table-column-tool.component';
import { TableGroupFilterComponent } from '../../frameModule/table-group-filter/table-group-filter.component';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { MergeLevel5Pipe } from 'src/app/pipes/merge-level5-pipe';


@Component({
  standalone: true,
  imports: [STANDALONE_IMPORTS, PaginationComponent, ItemsComponent, TableToolsComponent, ParaTextComponent, DownloadDocComponent, ButtonNComponent, FrameAiDataComponent, FormatMaskPipe, TableColumnToolComponent, TableGroupFilterComponent,MergeLevel5Pipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-frame-new-table',
  templateUrl: './frame-new-table.component.html',
  styleUrls: ['./frame-new-table.component.scss'],
})
export class FrameNewTableComponent implements OnInit, AfterViewInit,DoCheck {
  @ViewChild('tableBody') table2Body: ElementRef;
  @ViewChild("parentDiv") parentDiv: ElementRef;
  @ViewChild("searchInput") searchInput: IonInput;
  @ViewChild('popover') popover;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Input() object_mast: any = {};
  @Input() page_no: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPassai: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() searchGlobalemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() personalize: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(IonModal) modal: IonModal;
  @Input() sessionObj: any = {};

    private longPressTimer: any;


  displayDataLen = 50
  current_page_parameter: any = {};
  thead: any = {};
  isOpen = false;
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  isModalOpen = false;
  l_total_remain_pages: number;
  l_where_str: any;
  canDismiss = false;
  dbindex: any;
  presentingElement = null;
  searchText: any;
  tableRows = [];
  datas: [];
  barcodedata: any;
  stickyhead: { position: string; top: string; "z-index": string; };
  filterFormData: any = [];
  sepKey = [];
  pdfheads = [];
  clickShare: boolean = false;
  switchFlag: boolean = false;
  selectShow: boolean = false;
  easyfilter2value: boolean = true;
  easyfilter2value1: boolean = true;
  dbdata = [];
  item: any;
  setStrIndex: any = { "width": "20px", "max-width": "20px", "min-width": "15px" };
  disSetId: any;
  clickedHead = [];
  groupClickSort = [];
  tdWidthh = {};
  tblWidth: any
  dataNotFound = false
  public toggleFilter: boolean = false;
  public show: boolean = false;
  public show_filter: boolean = false;
  public horizontal_table: any = 'Show';
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;
  is_: boolean = false;
  loading: boolean = false;
  inc_value = null;
  loadMoreFlag: string;
  summaryRow: any[];
  isleft: boolean = false;
  isright: boolean = false;
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
  // isTextWrapped: boolean = false;
  freezId: string = '';
  excelCol: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ', 'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ', 'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FU', 'FV', 'FW', 'FX', 'FY', 'FZ', 'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ', 'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GX', 'GY', 'GZ', 'HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'HG', 'HH', 'HI', 'HJ', 'HK', 'HL', 'HM', 'HN', 'HO', 'HP', 'HQ', 'HR', 'HS', 'HT', 'HU', 'HV', 'HW', 'HX', 'HY', 'HZ', 'IA', 'IB', 'IC', 'ID', 'IE', 'IF', 'IG', 'IH', 'II', 'IJ', 'IK', 'IL', 'IM', 'IN', 'IO', 'IP', 'IQ', 'IR', 'IS', 'IT', 'IU', 'IV', 'IW', 'IX', 'IY', 'IZ', 'JA', 'JB', 'JC', 'JD', 'JE', 'JF', 'JG', 'JH', 'JI', 'JJ', 'JK', 'JL', 'JM', 'JN', 'JO', 'JP', 'JQ', 'JR', 'JS', 'JT', 'JU', 'JV', 'JW', 'JX', 'JY', 'JZ', 'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'KG', 'KH', 'KI', 'KJ', 'KK', 'KL', 'KM', 'KN', 'KO', 'KP', 'KQ', 'KR', 'KS', 'KT', 'KU', 'KV', 'KW', 'KX', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LK', 'LL', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LT', 'LU', 'LV', 'LW', 'LX', 'LY', 'LZ', 'MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MI', 'MJ', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'NG', 'NH', 'NI', 'NJ', 'NK', 'NL', 'NM', 'NN', 'NO', 'NP', 'NQ', 'NR', 'NS', 'NT', 'NU', 'NV', 'NW', 'NX', 'NY', 'NZ', 'OA', 'OB', 'OC', 'OD', 'OE', 'OF', 'OG', 'OH', 'OI', 'OJ', 'OK', 'OL', 'OM', 'ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT', 'OU', 'OV', 'OW', 'OX', 'OY', 'OZ', 'PA', 'PB', 'PC', 'PD', 'PE', 'PF', 'PG', 'PH', 'PI', 'PJ', 'PK', 'PL', 'PM', 'PN', 'PO', 'PP', 'PQ', 'PR', 'PS', 'PT', 'PU', 'PV', 'PW', 'PX', 'PY', 'PZ', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG', 'QH', 'QI', 'QJ', 'QK', 'QL', 'QM', 'QN', 'QO', 'QP', 'QQ', 'QR', 'QS', 'QT', 'QU', 'QV', 'QW', 'QX', 'QY', 'QZ', 'RA', 'RB', 'RC', 'RD', 'RE', 'RF', 'RG', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RM', 'RN', 'RO', 'RP', 'RQ', 'RR', 'RS', 'RT', 'RU', 'RV', 'RW', 'RX', 'RY', 'RZ', 'SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SQ', 'SR', 'SS', 'ST', 'SU', 'SV', 'SW', 'SX', 'SY', 'SZ', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH', 'TI', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP', 'TQ', 'TR', 'TS', 'TT', 'TU', 'TV', 'TW', 'TX', 'TY', 'TZ', 'UA', 'UB', 'UC', 'UD', 'UE', 'UF', 'UG', 'UH', 'UI', 'UJ', 'UK', 'UL', 'UM', 'UN', 'UO', 'UP', 'UQ', 'UR', 'US', 'UT', 'UU', 'UV', 'UW', 'UX', 'UY', 'UZ', 'VA', 'VB', 'VC', 'VD', 'VE', 'VF', 'VG', 'VH', 'VI', 'VJ', 'VK', 'VL', 'VM', 'VN', 'VO', 'VP', 'VQ', 'VR', 'VS', 'VT', 'VU', 'VV', 'VW', 'VX', 'VY', 'VZ', 'WA', 'WB', 'WC', 'WD', 'WE', 'WF', 'WG', 'WH', 'WI', 'WJ', 'WK', 'WL', 'WM', 'WN', 'WO', 'WP', 'WQ', 'WR', 'WS', 'WT', 'WU', 'WV', 'WW', 'WX', 'WY', 'WZ', 'XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK', 'XL', 'XM', 'XN', 'XO', 'XP', 'XQ', 'XR', 'XS', 'XT', 'XU', 'XV', 'XW', 'XX', 'XY', 'XZ', 'YA', 'YB', 'YC', 'YD', 'YE', 'YF', 'YG', 'YH', 'YI', 'YJ', 'YK', 'YL', 'YM', 'YN', 'YO', 'YP', 'YQ', 'YR', 'YS', 'YT', 'YU', 'YV', 'YW', 'YX', 'YY', 'YZ', 'ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'ZF', 'ZG', 'ZH', 'ZI', 'ZJ', 'ZK', 'ZL', 'ZM', 'ZN', 'ZO', 'ZP', 'ZQ', 'ZR', 'ZS', 'ZT', 'ZU', 'ZV', 'ZW', 'ZX', 'ZY', 'ZZ']
  isSearch: boolean = false
  rowsPage: any = [10, 20, 30, 50, 100]
  rowPage = 10
  item_search_flagData: boolean = false
  selectedExportDataType = "selectData"
  groupInnerHeader: any
  innerGroupClickSort = []
  conditionalFilterData: any
  isNotSearch: boolean = false
  isNotSort: boolean = false
  isNotPaginate: boolean = false
  isNotExport: boolean = false
  isNotExportPdf: boolean = false
  isNotExportExcel: boolean = false
  isNotExportCsv: boolean = false
  isSingleSelectRecord: boolean = false
  isNotTool: boolean = false
  isSingleClick: boolean = true;
  timer: any;
  clickEvent: any
  /////////////////////ai variable/////////////
  selectedText: string = '';
  frametable: any;
  isAIUsed = false;
  isSelecting: any;
  col9: any;
  col6: any = '8';
  aiInputData: any
  ////////////////////////////////////
  isNotScroll: boolean = false
  constructor(public globalObjects: GlobalObjectsService, private events: Events, private dataService: DataService,
    private datePipe: DatePipe, private chatAiService: ChatAiService, public lhs_lib: LhsLibService, public platform: Platform, public modalController: ModalController, private processData: ProcessDataService,
    private lhsLib: LhsLibService, private colFilter: ColumnfilterPipe, private popoverController: PopoverController,
    private cdr: ChangeDetectorRef, private modalGlobal: CanvasModalService, private commonMethod: CommonMethodService, @Inject(PLATFORM_ID) private platformId: Object, private cdEngine: CdEngineService) {
    this.userDetails = this.globalObjects.userDetails;

    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "frame-newtable")
    }

  }


  page = 1

  isColumnOpen = false
  isTemplateOpen = false
  isFunctionOpen = false
  column = []
  rowCount: number = 0
  tabAtive: any = {}

  ngOnDestroy(): void {
    this.cdEngine.unregister(this.frame.apps_page_frame_seqid);
  }

 ngDoCheck() {
  // console.trace('FrameNewTable DoCheck');
}

  ngOnInit() {

    this.cdEngine.register(this.frame.apps_page_frame_seqid, this.cdr);
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.plt = this.platform;
    }
    this.isAIUsed = false;

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
      this.frame.collapse = true;
      this.frame.showCollapse = false;
    } else {
      this.frame.collapse = false;
      this.frame.showCollapse = true;
    }
    let theaddata: any = [];
    let exelHeads: any = [];
    let pdfHeads: any = [];

    if (this.frame.display_no_of_records) {
      this.displayDataLen = this.frame.display_no_of_records;
    }

    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      let hideBtnFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_name == "WMA_FRAME_STATUS") {
          itemMast.value = 'D';
        }
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }
        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))) { } else {

          if (itemMast.item_type == "ADD_ROW_BT" || itemMast.item_type == "DELETE_ROW_BT") { } else {
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

          if (itemMast.item_type == 'BT' || itemMast.item_type == 'DISPLAY_PHOTO' || itemMast.item_type == 'DOWNLOAD_DOC' || itemMast.item_type == 'BUTTON_ICON' || itemMast.item_type == 'FRAME_SEPARATOR' || itemMast.item_type == 'FRAME_BUTTON_ICON' || itemMast.item_name.toLowerCase().includes("wma_")) {

          } else {
            exelHeads.push(itemMast.prompt_name);
          }

          if (itemMast.item_type == 'BT' || itemMast.item_type == 'DOWNLOAD_DOC' || itemMast.item_type == 'BUTTON_ICON' || itemMast.item_type == 'FRAME_SEPARATOR' || itemMast.item_type == 'FRAME_BUTTON_ICON' || itemMast.item_name.toLowerCase().includes("wma_")) {

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
          this.frame.item_search_flag = true;
        }
        if (x.toUpperCase() === 'EXCEL') {
          this.excelFlag = true;
        }
        if (x.toUpperCase() == 'C' || x.toUpperCase() == 'J' || x.toUpperCase() == 'SMART_FILTER' || x.toUpperCase() == 'D&D' || x.toUpperCase() == 'ACTION') {
          this.enablefunnel = true;
        }
        // if (x.toUpperCase() === 'STC') {
        //   this.switchFlag = true;
        // }
        if (x.toUpperCase() === 'NO_SORT') {
          // this.frame.noSortFlag = true;
          this.isNotSort = true
        }
        if (x.toUpperCase() === 'NO_FOOTER') {
          // this.frame.noPagination = true;
          this.isNotPaginate = true
        }
        if (x.toUpperCase() === 'NO_DOWNLOAD') {
          this.frame.noDownload = true;
        }
        if (x.toUpperCase() === 'NO_SEARCH') {
          this.isNotSearch = true
        }
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
        if (x.toUpperCase() === 'WRAP') {
          this.frame.isTextWrapped = true
          // this.frame.isTextWrapped=true;
        }
        if (x.toUpperCase() === 'NO_SCROLL') {
          this.isNotScroll = true
        }
        if (x.includes('FREEZE_COL')) {

          let a = x.split("(")
          this.autoFreezeCount = a[1].replaceAll("(", "").replaceAll(")", "")
          this.autoFreezeFlag = true

        }
      }
    }

    let level4 = [];
    if (this.frame.apexFrameLevel4 && this.frame.apexFrameLevel4.length > 0) {
      this.frame.headers = this.frame.apexFrameLevel4
    } else {
      if (this.frame.Level4 && this.frame.Level4.length > 0) {
        level4[0] = JSON.parse(JSON.stringify(this.frame.Level4))
        let sepdata = this.lhs_lib.seprateData(this.frame, level4)
        this.frame.headers = sepdata[0];
      }
    }

    this.thead = theaddata;
    this.frame.tHead = this.thead;
    this.pdfheads = pdfHeads;
    this.excelheads = exelHeads;
    this.frame.rowsPerPage = this.frame.displayDataLen;
    this.frame.active_row = 0;
    // if (this.frame.frameStyle) {
    //   console.log("this.frame.frameStyle", this.frame.frameStyle)
    // }
    // console.log("this.frame.tableData", this.frame.tableData)
    // console.log("this.frame.tableRows", this.frame)
    this.frame.rowCount = 0

    // this.popupSubscribe()
  }

  //   @HostListener('document:keydown', ['$event'])
  //   handleKeyboardEvent(event: KeyboardEvent) {
  //     switch (event.key) {
  //     //   case 'ArrowUp':
  //     //     this.backword();
  //     //     break;
  //     //  case 'ArrowDown':
  //     //     this.forword();
  //     //     break;
  //       case 'ArrowLeft':
  //         this.backword();
  //         break;
  //       case 'ArrowRight':
  //         this.forword();
  //         break;
  //     }
  //  }
  autoFreezeFlag = false
  autoFreezeCount = 0
  ngAfterViewInit() {
    if (this.autoFreezeFlag) {
      this.commonMethod.autoFreeze(this.autoFreezeCount, this.frame)
    }
  }

  isOpenMoreOption = false
  toolsExport: any
  moreOption() {
    this.isOpenMoreOption = !this.isOpenMoreOption
    this.isTemplateOpen = false
    this.isFunctionOpen = false
    this.isColumnOpen = false

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

  isjsonFilterOption = false
  jsonFilter() {
    this.isjsonFilterOption = !this.isjsonFilterOption
    this.isTemplateOpen = false
    this.isFunctionOpen = false
    this.isColumnOpen = false
  }


  selectRowData = []
  selectRow(tableData, index) {
    this.selectRowData.push(tableData[index])
  }

  tabOpen(data) {
    console.log(this.frame)
    data == 'columns' ? (this.isColumnOpen = !this.isColumnOpen, this.isTemplateOpen = false, this.isFunctionOpen = false) :
      data == 'template' ? (this.isTemplateOpen = !this.isTemplateOpen, this.isColumnOpen = false, this.isFunctionOpen = false) :
        data == 'function' ? (this.isFunctionOpen = !this.isFunctionOpen, this.isColumnOpen = false, this.isTemplateOpen = false) :
          (this.isTemplateOpen = false, this.isFunctionOpen = false, this.isColumnOpen = false)

    console.log(this.frame)
  }
  asc = []
  ascending() {
    for (let tableData of this.frame.canvasRows) {
      for (let tableItem of tableData) {
        tableItem.Level5.sort((a, b) => (a.oldValue > b.oldValue ? -1 : 1));
      }

    }
    console.log(this.asc)
  }

  getdataFromcanvasFilter(event) {
    if (event.apex) {
      this.getdataFromcanvasApex(event);

    } else if (event.where_Arr) {
      this.filterFunc(event);
      this.show_filter = false;
    }
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
      }
    }
    this.processData.afterTableRows(this.frame, null, null, 1);
    this.cdr.detectChanges();
  }
  isAggrigate = false
  getdataFromcanvasApex(event: any) {
    // this.isOpenMoreOption = false
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
      this.summaryRow = [];
      this.frame.tableRows = [];

      if (this.controlBreakArr.length > 0) {
        this.controlBreakArr = [];
        this.generateApexLevel4();

        if (this.frame.searchableRawData) {
          this.displayData(0, this.frame.searchableRawData.length);
        } else {
          this.displayData(0, this.frame.tableData.length);
        }
      }
      else {
        this.generateApexLevel4();
        this.generateApexPage(1);
      }
      if (this.conditionalFilterData.length > 0) {
        this.commonMethod.getitemSearch(this.frame, this.frame.displayDataLen, this.conditionalFilterData, this.processData)
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
      // if (event.filteredData.length == 0) {
      //   this.clearData('filter')
      // } else {
      // this.summaryRow = [];
      // this.frame.tableRows = [];
      // this.filterAbleData = event.filteredData;
      // if(!this.frame.alltableData){
      //   this.frame.alltableData=this.frame.tableRows
      // }

      // this.processData.populateRows(this.frame.apps_page_frame_seqid, event.filteredData, '', '', 1);

      //   this.conditionalFilterData=event.filteredData
      //   this.getitemSearch()


      //   if (this.controlBreakArr.length > 0) {
      //     this.controlBreakArr = [];
      //     if (this.frame.isCheck) {
      //       this.controlBreakFlag = true
      //     } else {
      //       this.groupFlag = true
      //     }
      //     this.generateApexLevel4();
      //     if(this.frame.searchableRawData){
      //       this.displayData(0, this.frame.searchableRawData.length);
      //     }else{
      //       this.displayData(0, this.frame.tableData.length);
      //     }

      //     if (this.frame.visibleItems) {
      //       this.generateApexPage(1);
      //     }
      //   } else {
      //     this.groupFlag = true
      //   }
      //   this.generateApexLevel4();

      //   this.displayData(0, this.frame.tableData.length);
      //   if (this.frame.visibleItems) {
      //     this.generateApexPage(1);
      //   }
      // } else {
      //   if (this.frame.visibleItems) {
      //     this.generateApexLevel4();
      //     this.generateApexPage(1);
      //   }
      // }

      // }
      if (event.filteredData.length == 0) {
        this.clearData('filter')
      } else {
        this.conditionalFilterData = event.filteredData
        this.getitemSearch()
      }

      if (this.controlBreakArr.length > 0) {
        this.controlBreakArr = [];
        if (this.frame.isCheck) {
          this.controlBreakFlag = true
        } else {
          this.groupFlag = true
        }
        this.generateApexLevel4();
        if (this.frame.searchableRawData) {
          this.displayData(0, this.frame.searchableRawData.length);
        } else {
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
        this.controlBreakFlag = false;
        this.groupFlag = true;

      } else {

        this.funArr = event.funArr;
        this.controlBreakFlag = false;
      }
      this.generateApexLevel4();

      if (this.frame.searchableRawData) {
        this.displayData(0, this.frame.searchableRawData.length);
      } else {
        this.displayData(0, this.frame.tableData.length);
      }
    } else if (event.noOfRecords) {

      this.frame.displayDataLen = parseInt(event.noOfRecords);

      this.frame.tableRows = [];
      this.controlBreakArr = [];
      this.generateApexPage(1);
    } else if (event.ctrlBreakArr) {
      this.funArr = event.ctrlBreakArr.funArr;
      this.controlBreakFlag = true;
      this.groupFlag = false;
      this.generateApexLevel4();
      if (this.frame.searchableRawData) {
        this.displayData(0, this.frame.searchableRawData.length);
      } else {
        this.displayData(0, this.frame.tableData.length);
      }
    } else if (event.searchTabData) {
      this.frame.searchTabData = event.searchTabData;
      this.controlBreakArr = [];
      this.processData.populateRows(this.frame.apps_page_frame_seqid, this.tableData, 0, this.frame.displayDataLen, 1);
    } else if (event.clear) {
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

        if (this.frame.visibleItems) {
          this.generateApexLevel4();
          this.generateApexPage(1);
        } else {
          this.generateApexPage(1);
        }
      } if (event.clear == 'All') {

        // this.frame.tableRows = [];

        // this.frame.apexFrameLevel4 = [];
        this.frame.headers = JSON.parse(JSON.stringify((this.frame.Level4)));
        this.frame.tHead = this.thead;
        this.summaryRow = [];
        this.funArr = [];
        this.footerRowFlag = false;

        if (event.clearData == 'Group') {
          this.ngOnInit();

          this.controlBreakArr = []
          this.controlBreakHead = []

          if (this.frame.visibleItems) {
            this.generateApexLevel4();
            this.generateApexPage(1);
          }
        } else if (event.clearData == 'filter') {
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
    } else if (event.freezeCol) {
      this.freezeColArr = event.freezeCol;
      this.frame.tableRows = [];
      this.frame.controlBreakArr = [];
      this.generateApexLevel4();
      this.generateApexPage(1);
    } else if (event.showPivot) {

    } else if (event.aggregateFun) {
      if (event.aggregateFunClear) {
        this.frame.summary_flag = false
        this.funArr = this.frame.aggregateFun;
        this.isAggrigate = true;
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
        this.isAggrigate = true;
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
  aggregateFun() {
    console.log("Aggrigate func", this.tableRows)
    let data = this.calculateFunction(this.tableRows, this.thead)
    console.log(data)
  }
  generateApexPage(a_current_page) {
    this.commonMethod.generateApexPage(a_current_page, this.frame, this.frame.displayDataLen, this.filterAbleData, this.processData);
    return
    this.frame.page_no = a_current_page;

    let to = a_current_page * this.displayDataLen;
    let from = to - this.displayDataLen;
    let data = this.frame.tableData;
    if (this.frame.searchableRawData) {
      data = this.frame.searchableRawData;
    } else if (this.filterAbleData.length > 0) {
      data = this.filterAbleData;
    }

    if (data.length > from) {
      this.processData.populateRows(this.frame.apps_page_frame_seqid, data, from, to, a_current_page);
    }
  }
  generateApexLevel4() {
    this.commonMethod.generateApexLevel4(this.frame, this.funArr, this.freezeColArr, this.thead);
    this.controlBreakArr = [];
    return
    let framelevel4 = [];
    this.frame.apexFrameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    framelevel4 = this.frame.apexFrameLevel4;

    let coloumnHead = [];
    let funhead = [];
    let theaddata = [];
    let seqArr1 = [];
    let seqArr2 = [];
    let newArr = [];
    let visibleData = []
    // if (this.frame.visibleItems && this.frame.visibleItems.length > 0) {
    //   for (let v of this.frame.visibleItems) {
    //     for (let itemGroup of this.frame.apexFrameLevel4) {
    //       for (let item of itemGroup.Level5)
    //         if (item.item_name == v.item_name) {
    //           item.item_visible_flag = 'T';
    //           newArr.push(itemGroup);
    //         }
    //     }
    //   }
    // }

    for (let itemGroup of framelevel4) {
      for (let itemMast of itemGroup.Level5) {
        if (this.funArr) {
          for (let f of this.funArr) {
            if (f.coloumns && f.fun) {
              if (f.coloumns.item_name == itemMast.item_name) {
                funhead.push(itemMast.prompt_name)
                itemMast.summary_flag_group = f.fun;
              }
            }

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
            if (itemMast.item_type != 'FRAME_BUTTON_ICON') {
              itemMast.item_visible_flag = 'F';
            }
          } else {
            itemMast.item_visible_flag = 'T';
            // itemMast.item_seqno=`0.${visible.item_seqno}`
            if (this.frame.columnsData) {
              for (let a of this.frame.columnsData) {
                if (a.colName == itemMast.prompt_name) {
                  itemMast.item_seqno = "0." + a.newSeqNo;
                }
              }
            }
          }


          visibleData.push(itemMast);
        }
        if (this.freezeColArr.length > 0) {
          for (let f of this.freezeColArr) {
            if (itemMast.prompt_name == f.prompt_name) {
              itemMast.freezeColumn = f.style;
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
      if (visibleData.length > 0) {
        // if(itemMast.item_seqno && itemMast.item_seqno.toLowerCase() == 'item_seqno'){

        //  }
        newArr.push(itemGroup);
      }
    }
    // if(this.frame.visibleItems && this.frame.visibleItems.length > 0){
    //   this.lhs_lib.seqSort(newArr);
    // }


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
      // this.lhs_lib.seqSort(newArr);
      this.seqSortData(newArr)
      this.frame.apexFrameLevel4 = JSON.parse(JSON.stringify((newArr)));

    }


    this.thead = theaddata;

    this.controlBreakArr = [];
    this.frame.tHead = this.thead;
    this.frame.headers = JSON.parse(JSON.stringify((this.frame.apexFrameLevel4)));
  }
  groupHeadArr: any
  gpRHead: any
  displayData(from, to) {

    let noOfRecords;
    noOfRecords = this.frame.displayDataLen;


    let l_total_pages: any = Math.ceil(this.l_total_rows / noOfRecords);

    if (l_total_pages && l_total_pages == "Infinity" || isNaN(l_total_pages)) {
      this.l_total_remain_pages = 1;
    } else {
      this.l_total_remain_pages = l_total_pages;
    }

    this.globalObjects.switchTableData = [];
    this.globalObjects.switchSearchStr = "";


    if (this.controlBreakFlag || this.groupFlag) {
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
                if ((c.itemName == data2.item_name) && data2.value) {
                  data2.item_visible_flag = 'F';
                  let grp = heads.find(x => x.value == data2.value);
                  if (grp) {
                  } else {
                    let obj = {
                      key: data2.prompt_name,
                      value: data2.value,
                      type: data2.datatype,
                      order: false
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
          if (itemMast.item_visible_flag == 'T' && itemMast.item_type != 'FRAME_BUTTON_ICON') {
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
      }
      this.controlBreakHead = head;
      this.groupHeadArr = groupHead
      this.dragedDiv = head;
      this.groupInnerHeader = this.gpRHead.items[0]
      // if(!this.frame.controlBreakArrGrop){
      //   this.frame.controlBreakArrGrop=this.controlBreakArr
      // }

      console.log("this.groupHeadArr : ", this.gpRHead)
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
  getParsedJson(json) {
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


  getDataForGraph(fileType, shareType) {
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
    this.commonMethod.getDataForGraph(fileType, shareType, obj)
    return
  }
  cleanString(input) {
    console.log(input);
    return input.replace(/,+$/, '');
  }
  downloadPDF(dataRows, shareType, footer) {

    let grapgRows = this.generateGraphRows(dataRows);
    console.log(grapgRows);
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
                  im.push(trows2.Level5[0].value);
                } else {
                  im.push("");
                }
              } else {
                if (trows2.Level5[0].value && trows2.Level5[0].value.indexOf("~") > -1) {
                  // let obj = { text: trows2[0].value.split("~")[0], fillColor: "#333" };
                  if (trows2.Level5[0].format_mask) {
                    let format_mask_data = this.formatMask(trows2[0].value.split("~")[0], trows2.Level5[0].format_mask);
                    let obj = { text: format_mask_data, fillColor: "#333" };
                    data.push(obj);
                  } else {
                    let obj = { text: trows2[0].value.split("~")[0], fillColor: "#333" };

                    data.push(obj);
                  }

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
                  im.push(trows2[0].value);
                } else {
                  im.push("");
                }
              } else {
                // if (trows2[0].value && trows2[0].value.indexOf("~") > -1) {
                //   let obj = { text: trows2[0].value.split("~")[0], fillColor: "#333" };
                //   data.push(obj);
                // } else {
                //   data.push(trows2[0].value);
                // }




                if (trows2[0].value && trows2[0].value.indexOf("~") > -1) {
                  // let obj = { text: trows2[0].value.split("~")[0], fillColor: "#333" };
                  // data.push(obj);
                  if (trows2.Level5[0].format_mask) {
                    let format_mask_data = this.formatMask(trows2[0].value.split("~")[0], trows2.Level5[0].format_mask);
                    let obj = { text: format_mask_data, fillColor: "#333" };
                    data.push(obj);
                  } else {
                    let obj = { text: trows2[0].value.split("~")[0], fillColor: "#333" };
                    data.push(obj);
                  }


                } else {
                  // data.push(trows2[0].value);

                  if (trows2[0].format_mask) {
                    // console.log(trows2[0].format_mask);
                    let format_mask_data = this.formatMask(trows2[0].value, trows2[0].format_mask);
                    // let obj = { text: format_mask_data, fillColor: "#333" };
                    data.push(format_mask_data);
                  } else {
                    // let obj = { text: trows2[0].value.split("~")[0], fillColor: "#333" };
                    data.push(trows2[0].value);
                  }



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

    let headerdata: any;

    headerdata = JSON.parse(JSON.stringify(array));
    let foot;
    if (this.footerRowFlag) {
      foot = JSON.parse(JSON.stringify(footer));
    }
    ///////////////////////////////addded footer start
    console.log(this.frame);
    let summaryRows: any = [];
    if (this.frame.summary_rows) {
      for (let itemGroup of this.frame.summary_rows) {
        if (itemGroup.Level5) {
          for (let input_item of itemGroup.Level5) {
            if ((input_item.item_visible_flag == 'T') && (input_item.item_type != 'FRAME_BUTTON_ICON')) {
              if (input_item.item_visible_flag == 'T' || !(input_item.item_type == 'ADD_ROW_BT') || !(input_item.item_type == 'DELETE_ROW_BT')) {
                console.log(input_item.summaryValue);
                if (input_item.summaryValue) {
                  console.log(input_item.format_mask);
                  if (input_item.format_mask) {
                    summaryRows.push(this.formatMask(input_item.summaryValue, input_item.format_mask));
                  } else {
                    summaryRows.push(input_item.summaryValue);
                  }
                  // summaryRows.push(input_item.summaryValue);
                } else {
                  summaryRows.push("");
                }
              }
            }
          }
        }
      }
      console.log(summaryRows);
      foot = summaryRows;
      console.log("foot data : " + foot);
    }




    ///////////////////////////////addded footer


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
                if (item.format_mask) {
                  data.push(item.value + "~" + item.datatype + "~" + item.format_mask);
                } else {
                  data.push(item.value + "~" + item.datatype);
                }
              }
            }
            else {
              if (item.mirrored_items) {
                if (item.format_mask) {
                  data.push(item.value + "~" + item.datatype + "~" + item.format_mask);
                } else {
                  data.push(item.value + "~" + item.datatype);
                }
              }
            }
          }
        }
      }
      tableData.push(data);
    }
    // console.log("tabled ata ",tableData);
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
      };


    });

    let headerRow = worksheet.addRow(this.excelheads);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffff99" }
      };
      cell.font = {
        name: 'Arial',
        color: { argb: '000' },

        size: 14,
      };
    });

    let rowIndex = 1;
    tableData.forEach(d => {
      let row = worksheet.addRow(d);
      if (rowIndex % 2 === 0) {
        row.eachCell((cell, number) => {
          let celldata = cell.value.toString();
          if (cell.value.toString().split("~")[1] == "NUMBER") {
            if (cell.value.toString().split("~")[0] == "") {
              cell.value = ""
            } else {
              if (cell.value.toString().split("~")[0] && (typeof (cell.value.toString().split("~")[0]) == 'string')) {
                cell.value = cell.value.toString().split("~")[0];
                if (celldata.split("~")[2]) {
                  cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                }
              } else {
                cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
                if (celldata.split("~")[2]) {
                  cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                }
              }
            }
          } else {
            cell.value = (cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "";
          }

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffff" }

          };

        });
      } else {
        row.eachCell((cell, number) => {
          let celldata = cell.value.toString();
          if (cell.value.toString().split("~")[1] == "NUMBER") {
            if (cell.value.toString().split("~")[0] == "") {
              cell.value = ""
            } else {
              if (cell.value.toString().split("~")[0] && (typeof (cell.value.toString().split("~")[0]) == 'string')) {
                cell.value = cell.value.toString().split("~")[0];
                if (celldata.split("~")[2]) {
                  cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                }

              } else {
                cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");

                if (celldata.split("~")[2]) {
                  cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                }
              }
            }
          } else {
            cell.value = (cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "";
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffff" }
          };
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
        };
      })
    }
    //////////////////////////////////for summary rows//////////////////////
    console.log(this.frame);
    let summaryRows: any = [];
    // if(this.frame.summary_flag){
    //   if(this.frame.summary_rows){
    //     let f = this.frame.summary_rows;
    //     if(this.frame.tHead){
    //       for(let i=0;i<this.frame.summary_rows.length;i++){
    //         for(let data of f[i].Level5){
    //           if(data.summaryValue){
    //             if(data.item_visible_flag && data.item_visible_flag=="T"){
    //               if(data.format_mask){
    //                 summaryRows.push(this.formatMask(data.summaryValue,data.format_mask));

    //               }else{
    //                 summaryRows.push(data.summaryValue);

    //               }
    //             }
    //         }else{
    //           if(data.item_visible_flag && data.item_visible_flag=="T"){
    //               summaryRows.push("");
    //           }
    //         }
    //         }
    //       }
    //     }
    //       let footerrow = worksheet.addRow(summaryRows);
    //         footerrow.eachCell((cell, number) => {
    //           cell.fill = {
    //             type: "pattern",
    //             pattern: "solid",
    //             fgColor: { argb: "ffff99" }
    //           };
    //         })
    //       }
    // }

    ////////////////////////////////////////////////////////////////////////
    if (this.frame.summary_flag) {
      for (let itemGroup of this.frame.summary_rows) {
        if (itemGroup.Level5) {
          for (let input_item of itemGroup.Level5) {
            if ((input_item.item_visible_flag == 'T') && (input_item.item_type != 'FRAME_BUTTON_ICON')) {

              // if(((!this.current_page_parameter.MODE) && (input_item.item_visible_flag && (input_item.item_visible_flag.indexOf(this.current_page_parameter.MODE)>-1)) )||input_item.item_visible_flag =='T' || !(input_item.item_type == 'ADD_ROW_BT') || !(input_item.item_type == 'DELETE_ROW_BT')){
              if (input_item.item_visible_flag == 'T' || !(input_item.item_type == 'ADD_ROW_BT') || !(input_item.item_type == 'DELETE_ROW_BT')) {
                console.log(input_item.summaryValue);
                if (input_item.summaryValue) {
                  // summaryRows.push(input_item.summaryValue);
                  if (input_item.format_mask) {
                    summaryRows.push(this.formatMask(input_item.summaryValue, input_item.format_mask));
                  } else {
                    summaryRows.push(input_item.summaryValue);
                  }

                } else {
                  summaryRows.push("");
                }
              }
            }
          }
        }
      }
      let footerrow = worksheet.addRow(summaryRows);
      footerrow.eachCell((cell, number) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffff99" }
        };
      })
    }

    /////////////////////////////////for summary row end///////////////////

    for (let i = 4; i <= (tableData.length + 4); i++) {
      for (let l = 0; l < this.excelheads.length; l++) {

        worksheet.getCell(this.excelCol[l] + i).border = {
          top: { style: "dotted" },
          left: { style: "dotted" },
          bottom: { style: "dotted" },
          right: { style: "dotted" },

        };

      }
    }

    var today = new Date();
    let date = this.globalObjects.formatDate(today, "dd-MMM-yyyy")
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ', ' + time;

    let fileName = this.frame.apps_page_frame_name ? this.frame.apps_page_frame_name + "[" + dateTime + "]" : null;
    workbook.xlsx.writeBuffer().then(data => {
      this.globalObjects.downloadExcel(data, fileName);
    });
  }
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

  debounce(callback, delay = 1000, event?) {
    var time;

    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  // getSearchResult = this.debounce((newFunc) => {
  //   // getSearchResult = this.throttle((newFunc) => {
  //   if (newFunc) {
  //     if (newFunc.name == 'searchAllData') {
  //       console.log("serch data", this.frame)
  //       this.searchAllData();
  //     } else if (newFunc.name == 'filterColumn') {
  //       this.filterColumn();
  //     }
  //   }

  //   this.cdr.detectChanges();
  // }, 1000);

  getSearchResult = this.debounce((newFunc, delay, item?) => {
    console.log(this.page)
    if (newFunc) {
      if (newFunc == 'searchAllData') {
        this.searchAllData();
      } else if (newFunc == 'filterColumn') {
        this.filterColumn(item);
      }
    }

    this.cdr.detectChanges();
    // console.log('Number of API Calls : ' + numberOfApiCalls);
  });
  searchAllData() {
    this.page = 1
    this.frame.rowCount = 0
    this.commonMethod.searchAllData(this.frame, this.frame.displayDataLen)
    return
    this.processData.searchAllData(this.frame);
    this.frame.page_no = 1;
    let to = 1 * this.displayDataLen;
    let from = to - this.displayDataLen;
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

  }
  clearSearch() {
    this.frame.search = '';
    this.isSearch = !this.isSearch
    this.item_search_flagData = !this.item_search_flagData
    for (let itemGroup of this.frame.headers) {
      for (let input_item of itemGroup.Level5) {
        if (input_item.search) {
          input_item.search = "%%"
        }
      }
    }
    this.filterColumn();
  }


  throttle(callback, delay = 500) {
    let timerFlag = null;
    let event = null;
    return (...args) => {

      callback(...args);

      // if (timerFlag === null || (JSON.stringify(args[1] != event))) {
      //   event = JSON.stringify(args[1]);
      //   callback(...args);
      //   timerFlag = setTimeout(() => {
      //     timerFlag = null;
      //     event = null;
      //   }, delay);
      // }
    };
  }

  itemClicked = this.throttle((event, rowsdata, j) => {
    this.itemClick(event, rowsdata, j)
  })
  itemClick(event, rowsdata, j) {

    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = event.indexcount;
    if (event.item_type != "FRAME_BUTTON_ICON") {
      this.frame.rowCount = this.frame.from_record + j
    }
    if (!this.isSingleSelectRecord) {

      console.log("from itemClick");
      this.isSingleClick = true;
      this.clickEvent = event;
      clearTimeout(this.timer);
      this.timer = null;
      this.timer = setTimeout(() => {
        if (this.isSingleClick) {
          if (this.platform.is('ios') || this.platform.is('android')) { } else {
            event.singleClicked = true;
          }
          this.itemClickData(event, rowsdata, j)
        }
      }, 500);
    }
  }

  itemClickData(event, rowsdata, j) {
    if (event.item_type == "BUTTON" || event.item_type == "FRAME_BUTTON_ICON" || event.item_type == "BUTTON_ICON" || event.item_type == "DOWNLOAD_DOC" || event.item_type == "CHECK_BOX" || event.item_type == "RADIO_BUTTON") {
      delete event['singleClicked']
    }
    let isValid = true;
    var rowindex;
    let itemPKey = "";

    if (this.frame.apps_frame_sub_type == 'JSON') {
      if (!event.click_events_str) {
        event.click_events_str = `search_item('${this.frame.executed_from}.${event.item_default_value}','${this.frame.frame_alias}.${event.item_name}');`
      }
    }

    if (this.frame.apps_page_frame_seqid.split("-")[2].includes("A") &&
      event.item_type != "FRAME_BUTTON_ICON" && event.item_type != "BUTTON" && event.item_type != "FRAME_BUTTON_ICON" &&
      event.item_type != "BUTTON_ICON" && event.item_type != "DOWNLOAD_DOC" && event.item_type != "CHECK_BOX" && event.item_type != "RADIO_BUTTON") {

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
        item = JSON.parse(JSON.stringify(event));
        item.click_events_str = `app_edit_record('${to}','${this.frame.apps_page_frame_seqid}')`;
      }

      item.itemIndex = j;
      item.isAssociate = true;
      item.itemClicked = 'pre';
      this.emitPass.emit(item);

    } else {

      if (typeof (rowsdata) != "number") {
        if (this.frame.tableRows && this.frame.tableRows[event.indexcount]) {
          for (let dataRow of this.frame.tableRows[event.indexcount]) {
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
      }

      if (event.item_enable_flag != 'F') {



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

        // if(this.frame.apps_page_frame_seqid.split("-")[2].includes("A")){
        //   event.click_events_str = event.orignal_click_events_str != undefined ? event.orignal_click_events_str : event.click_events_str;
        // }


        let col = {};
        if (this.frame.tableRows && this.frame.tableRows.length > 0) {
          for (let itemGroup of rowsdata) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {

                // if(this.frame.apps_page_frame_seqid.split("-")[2].includes("A")){
                //   item.click_events_str = item.orignal_click_events_str != undefined ? item.orignal_click_events_str : item.click_events_str;
                // }

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
          delete event['returnId'];
          delete event['returnIndex'];
          if (event.item_enable_flag != 'F') {
            this.emitPass.emit(event);
          }
        }

      } else {
         this.lhs_lib.refresh_frames();
      }



    }
  }

  searchData() {
    this.isSearch = true
    // this.searchInput.setFocus();
    requestAnimationFrame(async () => {
      await this.searchInput.setFocus();
    });
    this.item_search_flagData = true
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
        this.globalObjects.presentToast("1.6 Something went wrong please try again later!");
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

    })

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
  onItemBlur(event, rowindex) {
    this.commonMethod.onItemBlur(event, rowindex, this.frame)
    return
    if (event.on_blur) {

      if (this.frame.tableRows) {
        this.globalObjects.onBlurEvent(event, event.on_blur, this.frame.tableRows[rowindex]);
      }
    }
  }
  // Pagination

  // goToPage(num) {
  //   this.frame.page_no = num;

  //   let to = num * this.displayDataLen;
  //   let from = to - this.displayDataLen;

  //   let data = this.frame.tableData;
  //   if (this.frame.searchableData) {
  //     data = this.frame.searchableData;
  //   }
  //   this.processData.afterTableRows(this.frame, from, to, this.frame.page_no);
  //   this.cdr.detectChanges();
  // }
  paginate(a_current_page) {

    this.page = a_current_page
    this.commonMethod.paginate(a_current_page, this.frame, this.frame.displayDataLen)
    this.cdr.detectChanges();
    return
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

  }
  // Developer mode
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

  // orderAl
  // isSearchItem: boolean = false
  // tablecolumnFilterDebounce(callback, delay = 500, event?) {
  //   var time;

  //   return (...args) => {
  //     clearTimeout(time);
  //     time = setTimeout(() => {
  //       callback(...args);
  //     }, delay);
  //   };
  // }
  // tablecolumnFilter = this.tablecolumnFilterDebounce(async (event, item, index, fremeSeq, FRAME_SEPARATOR?, fsInd?, itemSeq?,frame?) => {
  //   console.log("frame-",this.frame)
  //   const popover = await this.popoverController.create({
  //     component: ColumnFilterLayoutComponent,
  //     id: 'columnfilter',
  //     event: event,
  //     translucent: true,
  //     componentProps: { item: item, order: this.orderAl, index: index, fremeSeq: fremeSeq, frameSeprator: FRAME_SEPARATOR ? true : false,frame : this.frame.tableRows }

  //   });
  //   popover.onDidDismiss().then((details) => {
  //     if (details.data) {
  //       if (details.role == 'search') {
  //         item = details.data
  //         this.filterColumn(item)
  //         item.isSearchItem = true
  //       } else if (details.role == 'asorting') {
  //         this.orderAl = "asorting"
  //       } else if (details.role == 'dsorting') {
  //         this.orderAl = "dsorting"
  //       } else if (details.role == 'bgColor') {
  //         item.bgColor = details.data
  //         this.classStyle(item.apps_item_seqid, details.data)
  //       } else if (details.role == 'freezColumn') {
  //         if (details.data == "true") {
  //           item.freezColumnData = true
  //           this.locked(index, fremeSeq, FRAME_SEPARATOR, fsInd, itemSeq)
  //         } else {
  //           delete item['freezColumnData']
  //           this.unlocked(fremeSeq, index)
  //         }
  //       }
  //       else if (details.role == 'refresh') {
  //         delete item['bgColor']
  //         this.removeItemColor(item.apps_item_seqid)
  //       } else if (details.role == 'reset') {
  //         let searchValue = item.search.replaceAll(/%/g, "")
  //         if (searchValue) {
  //           item.search = `%%`
  //           delete item['isSearchItem']
  //           this.filterColumn(item)
  //           console.log("search")
  //         }
  //         if (item.bgColor) {
  //           delete item['bgColor']
  //           this.removeItemColor(item.apps_item_seqid)
  //           console.log("bgColor")
  //         }
  //         if (item.freezColumnData) {
  //           delete item['freezColumnData']
  //           this.unlocked(fremeSeq, index)
  //           console.log("freezColumnData")
  //         }
  //       }
  //     }

  //   })
  //   await popover.present();
  // });
  // isSearchItem: boolean = false;
  originalTableRows: any[] = []; // Backup of full unfiltered data
  activeColumnFilters: { [column: string]: string[] } = {}; // Track filters
  orderAl: string = ''; // Current sorting order (optional)
  isSearchItem: boolean = false; // Flag per column if needed

  // Debounce utility function
  tablecolumnFilterDebounce(callback, delay = 500) {
    let time;
    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }
  selectedColShow = []
  // tablecolumnFilter = this.tablecolumnFilterDebounce(async (
  //   event,
  //   item,
  //   index,
  //   fremeSeq,
  //   FRAME_SEPARATOR?,
  //   fsInd?,
  //   itemSeq?,
  //   frame?
  // ) => {
  //   // Save original table data if not already saved
  //   if (!this.originalTableRows.length) {
  //     this.originalTableRows = JSON.parse(JSON.stringify(this.frame.tableRows));
  //   }
  //   console.log(this.frame)
  //   // Open popover with filter component
  //   const popover = await this.popoverController.create({
  //     component: ColumnFilterLayoutComponent,
  //     id: 'columnfilter',
  //     event: event,
  //     translucent: true,
  //     componentProps: {
  //       item: item,
  //       order: this.orderAl,
  //       index: index,
  //       fremeSeq: fremeSeq,
  //       frameSeprator: FRAME_SEPARATOR ? true : false,
  //       frame: this.frame.searchableData ? this.frame.searchableData : this.frame.tableRows,
  //       selectedColShow: this.selectedColShow,
  //       frame_header: this.frame.headers[index - 1].Level5[0]
  //     }
  //   });

  //   popover.onDidDismiss().then((details) => {
  //     const data = details.data;

  //     if (!data) return;
  //     if (details.data) {
  //       if (details.role == 'filterApplied') {
  //         const filterResult = data;
  //         this.selectedColShow = filterResult.selectedColShow
  //         if (!this.frame.SelectedColFilter) {
  //           this.frame.SelectedColFilter = filterResult.SelectedData;
  //         } else {
  //           this.frame.SelectedColFilter = this.frame.SelectedColFilter.filter((itemSelect) => itemSelect.item_name !== item.item_name)
  //           this.frame.SelectedColFilter = [...this.frame.SelectedColFilter, ...filterResult.SelectedData]
  //         }
  //         this.commonMethod.filterColumnMultiFilter(this.frame, this.frame.displayDataLen)
  //         this.activeColumnFilters = {
  //           ...this.activeColumnFilters,
  //           [filterResult.column]: filterResult.selectedValues
  //         };

  //         // Mark item visually if needed
  //         item.isSearchItem = true;
  //       }
  //       if (details.role == 'search') {
  //         item = details.data
  //         this.filterColumn(item)
  //         item.isSearchItem = true
  //       } else if (details.role == 'asorting') {
  //         this.orderAl = "asorting"
  //       } else if (details.role == 'dsorting') {
  //         this.orderAl = "dsorting"
  //       } else if (details.role == 'bgColor') {
  //         item.bgColor = details.data
  //         this.classStyle(item.apps_item_seqid, details.data)
  //       } else if (details.role == 'freezColumn') {
  //         if (details.data == "true") {
  //           item.freezColumnData = true
  //           this.locked(index, fremeSeq, FRAME_SEPARATOR, fsInd, itemSeq)
  //         } else {
  //           delete item['freezColumnData']
  //           this.unlocked(fremeSeq, index)
  //         }
  //       }
  //       else if (details.role == 'refresh') {
  //         delete item['bgColor']
  //         this.removeItemColor(item.apps_item_seqid)
  //       } else if (details.role == 'reset') {
  //         let searchValue = item.search.replaceAll(/%/g, "")
  //         if (searchValue) {
  //           item.search = `%%`
  //           delete item['isSearchItem']
  //           this.filterColumn(item)
  //           console.log("search")
  //         }
  //         if (item.bgColor) {
  //           delete item['bgColor']
  //           this.removeItemColor(item.apps_item_seqid)
  //           console.log("bgColor")
  //         }
  //         if (item.freezColumnData) {
  //           delete item['freezColumnData']
  //           this.unlocked(fremeSeq, index)
  //           console.log("freezColumnData")
  //         }
  //         if (data.colSelect) {
  //           this.selectedColShow = data.selectedColShow
  //           if (item.SelectedData) {
  //             delete item['SelectedData'];
  //             delete item['isSearchItem'];
  //           }
  //           if (this.frame.SelectedColFilter) {
  //             this.frame.SelectedColFilter = this.frame.SelectedColFilter.filter((itemSelect) => itemSelect.item_name !== item.item_name)
  //           }

  //           this.frame.isColResent = true

  //           this.commonMethod.filterColumnMultiFilter(this.frame, this.frame.displayDataLen)
  //         }
  //       }
  //     }
  //   });



  //   await popover.present();
  // });

  tablecolumnFilter = this.tablecolumnFilterDebounce(async (
    event,
    item,
    index,
    fremeSeq,
    FRAME_SEPARATOR?,
    fsInd?,
    itemSeq?,
    frame?
  ) => {
    await this.commonMethod.tablecolumnFilter(this.frame, this.orderAl, this.originalTableRows, this.activeColumnFilters, this.selectedColShow, this.page, this.item_search_flagData, event, item, index, fremeSeq, FRAME_SEPARATOR, fsInd, itemSeq).then((data: any) => {
      if (data) {
        this.orderAl = data.orderAl;
        this.originalTableRows = data.originalTableRows;
        this.activeColumnFilters = data.activeColumnFilters;
        this.selectedColShow = data.selectedColShow;
        this.page = data.page;
      }
    })

  });


  removeItemColor(item) {
    this.commonMethod.removeItemColor(item)
    return
    let color = `.colorCss${item}`
    let stylesheet: any = document.styleSheets[0];
    const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].selectorText === color) {
        stylesheet.deleteRule(i);
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

  // @HostListener("keydown.ArrowDown", ['$event'])
  // arrowDown(event) {
  //   // event.preventDefault();
  //   this.selectedTable2Row(event)
  // }

  // @HostListener("keydown.ArrowUp", ['$event'])
  // arrowUp(event) {
  //   // event.preventDefault();
  //   this.selectedTable2Row(event)
  // }

  selectedTable2Row(event) {

    let doc = document.activeElement;
    let name = this.frame.apps_page_frame_seqid + "." + doc.id;

    if (this.table2Body && this.table2Body.nativeElement && this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0 || this.table2Body.nativeElement.children.length == this.frame.active_row) {
      if (!this.frame.active_row) {
        this.frame.active_row = 0;
      }


      var ul = this.parentDiv.nativeElement;
      let children: any = this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0 ? this.table2Body.nativeElement.children : [];
      let el = this.table2Body.nativeElement.children[this.frame.active_row];
      let tbodyNative = this.table2Body.nativeElement.children
      for (let c of children) {
        if (c.className.includes("trow-active")) {
          el = c;
        }
      }

      var elRect = el.getBoundingClientRect(),
        parRect = ul.getBoundingClientRect();
      if (elRect && parRect) {
        event.preventDefault();
        var elementHeight = elRect.height;
        if (this.frame.apps_page_frame_seqid && (this.frame.apps_page_frame_seqid).charAt((this.frame.apps_page_frame_seqid).length - 1) == 'A' && !(this.frame.apps_page_frame_seqid).toLowerCase().includes("-para")) { } else {
          if (event.keyCode == 38) {
            if (this.frame.rowCount > this.frame.from_record) {
              if ((elRect.top) <= (parRect.top + 40) + elementHeight) {
                if (parRect.top + elementHeight >= elRect.top)
                  ul.scrollTop = ul.scrollTop - (((parRect.top + 40) + elementHeight) - (elRect.top));
                else
                  ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 40) - elRect.top);
              }
              this.frame.active_row = this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? el.previousElementSibling.id.split("--")[1] : this.frame.active_row = 0;
              this.frame.rowCount = this.frame.rowCount - 1
            }
            else {
              if (this.frame.current_page_no > 1) {
                this.paginate(this.frame.current_page_no - 1);
                this.frame.active_row = this.frame.to_record - 1
                if (this.frame.searchableData) {
                  let rowActive = this.frame.searchableData[this.frame.active_row][0]
                  if (rowActive.Level5.length > 0) {
                    this.frame.active_row = rowActive.Level5[0].indexcount;
                  }
                }
                this.frame.rowCount = this.frame.to_record - 1
                ul.scrollTop = this.parentDiv.nativeElement.scrollHeight;
                tbodyNative[tbodyNative.length - 1].focus();
              }
            }
          }
          else

            if (event.keyCode == 40) {
              if (this.frame.rowCount != (this.frame.searchableData ? this.frame.searchableData.length - 1 : this.frame.tableData.length - 1)) {
                if (this.frame.rowCount < this.frame.to_record - 1) {
                  if (this.frame.tableRows.length - 1 > this.frame.active_row) {
                    if (!(elRect.top >= parRect.top && elRect.bottom <= parRect.bottom - 40 && elRect.bottom + elementHeight <= parRect.bottom - 40)) {
                      if (parRect.height > elRect.bottom)
                        ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
                      else
                        ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom + 40);
                    }
                    if (elRect) {
                      this.frame.active_row = parseFloat(el.nextElementSibling.id.split("--")[1]);
                      this.frame.rowCount = this.frame.rowCount + 1
                    }
                  }
                  else {
                    this.frame.active_row = 0;
                    ul.scrollTop = 0;
                    this.frame.rowCount = 0
                  }
                }
                else {
                  ul.scrollTop = 0;
                  this.paginate(this.frame.current_page_no + 1);
                  this.frame.rowCount = this.frame.from_record
                  tbodyNative[0].focus()
                }

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

        this.lhs_lib.refresh_frames();
      }
      this.lhs_lib.go_item(name, this.frame.active_row, true);
    }
  }
  filterColumn(item?) {
    this.page = 1
    this.frame.rowCount = 0
    if (item) {
      this.commonMethod.filterColumn(this.frame, this.frame.displayDataLen, item)
    } else {
      this.commonMethod.filterColumn(this.frame, this.frame.displayDataLen)
    }
    if (this.tabAtive && this.tabAtive.x && this.tabAtive.index && this.tabAtive.itm) {
      this.toggleTable(this.tabAtive.x, this.tabAtive.index, this.tabAtive.itm)
    }
    return
    if (item && item.initialChange) {
      delete item['initialChange'];
      return;
    }
    if (((this.frame.tableData && this.frame.tableData.length > 0) || (this.frame.searchableData && this.frame.searchableData.length > 0))) {
      let data = this.processData.filterColumn(this.frame);
      this.frame.page_no = 1;
      let to = 1 * this.displayDataLen;
      let from = to - this.displayDataLen;

      this.frame.from_record = from;
      this.frame.to_record = to;
      this.frame.page_no = 1;
      this.frame.active_row = 0;
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
    }
    return;
  }
  onChangePage() {
    this.paginate(this.page)
  }
  rowsPerPage() {
    this.page = 1
    this.frame.display_no_of_records = this.displayDataLen
    this.processData.afterTableRows(this.frame);
  }
  /* Freeze column */
  getAllSiblings(elem) {
    var siblings = [];
    siblings.push(elem);
    // Collect all previous siblings
    var prevSibling = elem.previousSibling;
    while (prevSibling !== null) {
      if (prevSibling.nodeType === 1) {
        siblings.push(prevSibling);
      }
      prevSibling = prevSibling.previousSibling;
    }
    return siblings;
  }
  frameStyleFreeze = []
  locked($tabs, idFrame, frameSeperator?, frameSeperatorInd?, item?) {
    this.commonMethod.locked($tabs, idFrame, this.frame, frameSeperator, frameSeperatorInd, item)
    return
    if (this.frame.showTd == 'SHOW') {
      const getFrameSep = document.getElementById(`${idFrame}#thead`)
      console.log(getFrameSep.children[1].children)
      let tr: any = getFrameSep.children[1].children
      let thInd: number = 0
      const entries = Object.entries(tr);
      for (let d of entries) {
        let a: any = d[1]
        if (a.id == `${idFrame}thead${$tabs}`) {
          thInd = Number(d[0])
        }
      }
      for (let d of entries) {
        let a: any = d[1]
        if (Number(d[0]) <= thInd) {
          a.classList.add("fixed-column");
          let value: any = 0
          let i = Number(d[0]) + 1
          if (i > 1) {
            let $margin = 2 * (i - 1);//2*
            value = a.style.left = $margin + '00px';
          }
          let stylesheet: any = document.styleSheets[0];
          for (let c of a.classList) {
            if (c.includes('freezeCss')) {
              stylesheet.insertRule(`.${c}{position: sticky !important;min-width: 200px !important;left: ${value} !important;z-index: 11 !important;background: #949494 !important;}`);
              this.frameStyleFreeze.push(`.${c}`)
              this.frame.frameStyleFreeze = this.frameStyleFreeze
            }
          }
        }
      }
      const elem: any = document.getElementById(`${idFrame}thead${$tabs}`);


      // Assuming 'elem' is the reference to element
      var allSiblings = this.getAllSiblings(elem);
      var reversedArray = allSiblings.slice().reverse();

      for (let [i, data] of reversedArray.entries()) {
        i += 1
        data.classList.add("fixed-column");
        let value: any = 0
        if (i > 1) {
          let $margin = 2 * (i - 1);//2*
          value = data.style.left = $margin + '00px';
        }
        let stylesheet: any = document.styleSheets[0];
        for (let c of data.classList) {
          if (c.includes('freezeCss')) {
            stylesheet.insertRule(`.${c}{position: sticky !important;min-width: 200px !important;left: ${value} !important;z-index: 11 !important;background: #949494 !important;}`);
            this.frameStyleFreeze.push(`.${c}`)
            this.frame.frameStyleFreeze = this.frameStyleFreeze
          }
        }
      }

    } else {
      const elem: any = document.getElementById(`${idFrame}thead${$tabs}`);


      // Assuming 'elem' is the reference to element
      var allSiblings = this.getAllSiblings(elem);
      var reversedArray = allSiblings.slice().reverse();

      for (let [i, data] of reversedArray.entries()) {
        i += 1
        data.classList.add("fixed-column");
        let value: any = 0
        if (i > 1) {
          let $margin = 2 * (i - 1);//2*
          value = data.style.left = $margin + '00px';
        }
        let stylesheet: any = document.styleSheets[0];
        for (let c of data.classList) {
          if (c.includes('freezeCss')) {
            stylesheet.insertRule(`.${c}{position: sticky !important;min-width: 200px !important;left: ${value} !important;z-index: 11 !important;background: #949494 !important;}`);
            this.frameStyleFreeze.push(`.${c}`)
            this.frame.frameStyleFreeze = this.frameStyleFreeze
          }
        }
      }
    }

    if (frameSeperator) {
      const elem: any = document.getElementById(`${item}thead${frameSeperatorInd}`);
      var allSiblings = this.getAllSiblings(elem);
      var reversedArray = allSiblings.slice().reverse();

      for (let [i, data] of reversedArray.entries()) {
        i += 1
        data.classList.add("fixed-column");
        let value: any = 0
        if (i > 1) {
          let $margin = 2 * (i - 1);//2*
          value = data.style.left = $margin + '00px';
        }
        let stylesheet: any = document.styleSheets[0];
        for (let c of data.classList) {
          if (c.includes('freezeCss')) {
            stylesheet.insertRule(`.${c}{position: sticky !important;min-width: 200px !important;left: ${value} !important;z-index: 11 !important;background: #949494 !important;}`);
            this.frameStyleFreeze.push(`.${c}`)
            this.frame.frameStyleFreeze = this.frameStyleFreeze
          }
        }
      }
    }
  }

  unlocked(idFrame, tab) {
    this.commonMethod.unlocked(idFrame, tab, this.frame, this.item_search_flagData);
    return;
    var i: any;
    // var $tabs = 10;
    // if ($tabs >= 1) {
    //   for (i = 1; i <= $tabs; i++) {
    const container: any = document.getElementById(`${idFrame}thead${tab}`);
    if (container) {
      container.classList.remove("fixed-column");
      container.style.left = 'auto';
      let stylesheet: any = document.styleSheets[0];
      const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
      for (let st of this.frame.frameStyleFreeze) {
        for (let i = 0; i < rules.length; i++) {
          if (rules[i].selectorText === st) {
            stylesheet.deleteRule(i);
          }
        }
      }
    }
    //   }

    // }
    const getFrameSep = document.getElementById(`${idFrame}#thead`)
    console.log(getFrameSep.children[0].children)
    let tr: any = getFrameSep.children[0].children
    const entries = Object.entries(tr);
    for (let d of entries) {
      let th: any = d[1]
      th.classList.remove("fixed-column");
      th.style.left = 'auto';
    }
  }
  /* color column */
  frameStylevalue = []
  classStyle(item, color) {
    this.commonMethod.classStyle(item, color, this.frame, this.frameStylevalue)
    return
    let stylesheet: any = document.styleSheets[0];
    const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].selectorText === `.colorCss${item}`) {
        stylesheet.deleteRule(i)
      }
    }
    stylesheet.insertRule(`.colorCss${item}{background:${color} !important}`);
    console.log("style", stylesheet)
    this.frameStylevalue.push(`.colorCss${item}`)
    let frameStyleClass = [...new Set(this.frameStylevalue)]
    this.frame.frameStyle = frameStyleClass
  }
  colSize(item) {
    let arr = [];
    for (let itemGrp of item.containerRowss) {
      for (let i of itemGrp.Level5) {
        if (i.item_visible_flag == 'T') {
          arr.push(i);
        }
      }

    }
    return arr.length;
  }
  toggleTable(x, index, itm) {
    if (itm.item_sub_type == 'TAB_OPEN') { } else {
      this.tabAtive = {
        x: x,
        index: index,
        itm: itm
      }
      let tHWidth: any = document.getElementsByClassName('thWidth');
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
  toggleFrame() {
    if (this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1) {
      this.frame.collapse = !this.frame.collapse
      this.cdr.detectChanges();
    }
  }
  FilterRefreresh() {
    this.page = 1

  }

  openPivot() {
    let component = WebdatarocksComponent
    let componentProps = {
      frame: this.frame,
      // theadData: this.frame.apextheads
    }
    let id = "globe_pivottable_filter"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((detail) => {
      if (detail.data) {
        // this.getdataFromcanvasApex(detail.data)
      }
    })
  }


  appliedFilters = [];
  icon = "";
  async presentPopover(ev, event) {
    let dta = {
      shuffle: ev,
      // frame: JSON.parse((JSON.stringify(this.frame))),
      frame: this.frame,

    }
    const popover = await this.popoverController.create({
      component: ApexActionFilterPage,
      event,
      animated: true,
      showBackdrop: true,
      componentProps: dta,
      cssClass: "modelalert-box",
    });
    popover.onDidDismiss().then((res: any) => {
      if (res.role == 'columnFilter') {
        let event: any = {};
        event.apex = true;
        event.filterCond = res.data;

        this.frame.filterAbleArr = event.filterCond;
        this.getFilteredData(event.filterCond);
      } else if (res.role == 'controlBr') {
        let ctrlObj = res.data;
        let event: any = {};
        event.apex = true;
        event.ctrlBreakArr = res.data;
        this.frame.isCheck = true
        this.frame.ctrlBrkCond = res.data.controlBr;
        this.frame.funcArr = res.data.funArr;

        let apply = this.appliedFilters.find(x => x.type == 'Control Break');
        if (apply) {
        } else {
          let obj = {
            type: 'Control Break',
            icon: this.icon
          }
          this.appliedFilters.push(obj);
        }

        this.getdataFromcanvasApex(event)
      } else if (res.role == 'groupBy') {

        let event: any = {};
        event.apex = true;
        event.groupBy = res.data;

        if (this.frame.isCheck) {
          delete this.frame['isCheck']
        }
        this.frame.funcArr = res.data.funArr;
        this.frame.ctrlBrkCond = res.data.controlBr;


        let apply = this.appliedFilters.find(x => x.type == 'Group By');
        if (apply) {
        } else {
          let obj = {
            type: 'Group By',
            icon: this.icon
          }
          this.appliedFilters.push(obj);
        }
        this.getdataFromcanvasApex(event)
      }
    });
    return await popover.present();

  }
  getMode(i, ev, event2) {
    // this.presentPopover(ev, event2);
  }
  getFilteredData(condArr) {
    // let filteredData = [];
    // for (let c of condArr) {

    //   if (c.operators == '=') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) == this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) == this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //     }
    //   } else if (c.operators == '>') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) > this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) > this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //     }
    //   } else if (c.operators == '>=') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) >= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) >= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //     }
    //   } else if (c.operators == '<') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) < this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) < this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //     }
    //   } else if (c.operators == '<=') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) <= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter((x: any) => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) <= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //     }
    //   } else if (c.operators == '<>') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter(x => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) != this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter(x => {
    //         if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) != this.evaluateValue(c.coloumns.datatype, c.description)) return x;
    //       });
    //     }
    //   } else if (c.operators == 'is null') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter(x => x[c.coloumns.item_name] == null);
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter(x => x[c.coloumns.item_name] == null);
    //     }
    //   } else if (c.operators == 'is not null') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter(x => x[c.coloumns.item_name] != null);
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter(x => x[c.coloumns.item_name] != null);
    //     }
    //   } else if (c.operators == 'like') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter(x => ((x[c.coloumns.item_name] != null) && x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter(x => ((x[c.coloumns.item_name] != null) && x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
    //     }
    //   } else if (c.operators == 'not like') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter(x => ((x[c.coloumns.item_name] == null) || !x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter(x => ((x[c.coloumns.item_name] == null) || !x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
    //     }
    //   } else if (c.operators == 'not in') {
    //     let str = "";
    //     if ((c.description).indexOf(",") > -1) {
    //       let condArr = c.description.split(',');
    //       let i = 0
    //       for (let c of condArr) {
    //         i++;
    //         if (i < condArr.length) {
    //           str = str + "x[c.coloumns.item_name].toLowerCase() != '" + c.toLowerCase() + "' && "
    //         } else {
    //           str = str + "x[c.coloumns.item_name].toLowerCase() != '" + c.toLowerCase() + "'";
    //         }
    //       }
    //     } else {
    //       str = "x[c.coloumns.item_name].toLowerCase() != '" + c.description.toLowerCase() + "'";
    //     }

    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter(x => (eval(str)));
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter(x => (eval(str)));
    //     }
    //   } else if (c.operators == 'in') {
    //     let str = "";
    //     if ((c.description).indexOf(",") > -1) {
    //       let condArr = c.description.split(',');
    //       let i = 0
    //       for (let c of condArr) {
    //         i++;
    //         if (i < condArr.length) {
    //           str = str + "x[c.coloumns.item_name].toLowerCase() == '" + c.toLowerCase() + "' || "
    //         } else {
    //           str = str + "x[c.coloumns.item_name].toLowerCase() == '" + c.toLowerCase() + "'";
    //         }
    //       }
    //     } else {
    //       str = "x[c.coloumns.item_name].toLowerCase() == '" + c.description.toLowerCase() + "'";
    //     }

    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter(x => (eval(str)));
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter(x => (eval(str)));
    //     }
    //   } else if (c.operators == 'begin with') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter((x: any) => {
    //         if (x[c.coloumns.item_name].startsWith(c.description)) return x;
    //       });
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter((x: any) => {
    //         if (x[c.coloumns.item_name].startsWith(c.description)) return x;
    //       });
    //     }
    //   } else if (c.operators == 'end with') {
    //     if (filteredData.length > 0) {
    //       let data = filteredData.filter((x: any) => {
    //         if (x[c.coloumns.item_name].endsWith(c.description)) return x;
    //       });
    //       filteredData = data;
    //     } else {
    //       filteredData = this.frame.tableData.filter((x: any) => {
    //         if (x[c.coloumns.item_name].endsWith(c.description)) return x;
    //       });
    //     }
    //   }


    // }
    let event: any = {};

    event.filteredData = condArr;
    event.apex = true;
    this.getdataFromcanvasApex(event)
  }
  evaluateValue(datatype, value) {
    if (datatype && datatype.toLowerCase() == 'date') {
      return new Date(value).getTime();
    } else if (datatype && datatype.toLowerCase() == 'number') {
      return parseFloat(value);
    } else {
      return isNaN(value) ? (value != null) ? value.toLowerCase() : null : parseFloat(value);
    }
  }
  clear(i, ev, type?) {
    let event: any = {};
    event.apex = true;
    if (ev == 'groupBy') {
      // this.groupFlag=false
      // this.gpRHead=[]
      this.frame.ctrlBrkCond.splice(i, 1);
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
          event.filteredData = this.frame.tableData
          this.frame.ctrlBrkCond = [];
          event.clear = 'All';
        }

        this.frame.summary_flag = false
        this.funArr = this.frame.aggregateFun;
        this.isAggrigate = true;

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
      }
    } if (ev == 'All') {
      // delete this.frame ['columnsData']
      //  delete this.frame ['visibleItems']
      event.clear = ev;
      if (type == 'Group') {
        this.frame.ctrlBrkCond = [];
        this.frame.funcArr = [];
        event.clearData = type

      }
      else {
        this.frame.filterAbleArr = [];

        event.clearData = type
      }
      this.getdataFromcanvasApex(event)
    }

  }
  clearData(filter) {
    if (filter == 'Group') {
      this.frame.ctrlBrkCond = [];
      this.frame.funcArr = [];
      this.groupFlag = false;
      this.controlBreakFlag = false;
      this.frame.apexFrameLevel4 = [];
      this.clear(0, 'All', filter);
      this.processData.calculateTableRows(this.frame)
    }
    else {
      this.frame.filterAbleArr = [];
      // this.frame.searchableData=[]
      this.conditionalFilterData = []
      this.commonMethod.getitemSearch(this.frame, this.frame.displayDataLen, this.conditionalFilterData, this.processData)
      if (this.controlBreakArr.length > 0) {
        this.controlBreakArr = [];
        this.generateApexLevel4();
        this.displayData(0, this.frame.tableData.length);

      }

    }

  }


  clearAllFilter() {

    this.frame.ctrlBrkCond = [];
    this.frame.funcArr = [];

    this.frame.apexFrameLevel4 = [];

    this.frame.filterAbleArr = [];

    this.frame.selectedCols = [];
    this.frame.visibleItems = []
    delete this.frame['columnsData']
    this.controlBreakFlag = false;
    this.groupFlag = false;
    this.frame.controlBreakArr = [];
    this.clear(0, 'All');
  }

  tablefilter(event: any, shuffle) {
    let component = FrameApexfilterComponent
    let componentProps = {
      frame: this.frame,
      theadData: this.frame.apextheads,
      shuffle: shuffle
    }
    let id = "globe_typetable_filter"
    let cssClass = ""
    let title = this.frame.apps_page_frame_name
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass, "", "", "", title).then((detail) => {
      if (detail.data) {
        this.getdataFromcanvasApex(detail.data)
        console.log(detail.data);
      }
    })
  }

  getShare(event) {
    this.clickShare = false;
    this.getDataForGraph('pdf', event);
  }


  dbClickpopover(isOpen: boolean, tableData, i) {


    if (this.isSingleSelectRecord) {
      let component = DoubleclickComponent
      let componentProps = {
        frame: this.frame,
        isopen: isOpen,
        tableData: tableData,
        index: i,
        rowCount: this.rowCount,
        displayDataLen: this.frame.displayDataLen,
        page: this.page,
        parentDiv: this.parentDiv,
        table2Body: this.table2Body
        // theadData: this.frame.apextheads
      }

      let id = "table_model"
      let cssClass = "table_modal"
      this.events.subscribe(`rowcountSubscribe#${this.frame.apps_page_frame_seqid}`, res => {
        this.rowCount = res
      });
      this.events.subscribe(`PageNumberSubscribe#${this.frame.apps_page_frame_seqid}`, res => {
        this.page = res
      });
      this.modalGlobal.openModal(component, componentProps, id, event, cssClass, "", "", "").then((detail) => {
        if (detail.data) {
          // this.getdataFromcanvasApex(detail.data)
        }
        this.events.unsubscribe(`rowcountSubscribe#${this.frame.apps_page_frame_seqid}`);
        this.events.unsubscribe(`PageNumberSubscribe#${this.frame.apps_page_frame_seqid}`);
      })
    } else {

      console.log("from dblClick");
      this.isSingleClick = false;
      clearTimeout(this.timer);
      this.timer = null;
      delete this.clickEvent['singleClicked']
      this.itemClickData(this.clickEvent, tableData, i)
    }
  }

  // this.isModalOpen = isOpen;
  // this.datas = tableData;




  toggleWrap() {
    this.frame.isTextWrapped = !this.frame.isTextWrapped;  // Toggle between wrap and no-wrap
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.inc_value = null;
  }

  tableOption = false;
  showCardOption() {
    this.tableOption = !this.tableOption;
  }

  // popupSubscribe() {
  //   this.events.subscribe(`popupSubscribe#${this.frame.apps_page_frame_seqid}`, res => {
  //     this.getdataFromcanvasApex(res)
  //   });
  // }
  // ngOnDestroy() {
  //   this.events.unsubscribe(`popupSubscribe#${this.frame.apps_page_frame_seqid}`);
  // }

  personalization() {
    // this.personalize.emit(this.frame.apps_page_frame_seqid)
    let event = {
      seqid: this.frame.apps_page_frame_seqid,
      openObject: true,
      object_code: "WERND418"
    }
    this.personalize.emit(event)
  }

  collapseSort(th, k, radioOn?) {

    if (!th.order) {
      th.order = true
    }

    // th=th
    let obj: any = {};
    if (this.groupClickSort.length > 0) {

      obj = this.groupClickSort.find(x => x.th.key == th.key);
      if (obj) {
        if (obj.direction > 0) {
          obj.direction = -1;
        } else {
          obj.direction = 1;
        }
      } else {
        obj = {
          th: th,
          direction: 1,

        }
      }

      if (this.groupClickSort.length > 1) {

        if (this.groupClickSort[1].th.key == obj.th.key) {
          this.groupClickSort[1] = obj;
        } else {
          let newArr = [];
          delete this.groupClickSort[0].th['order']
          newArr[0] = this.groupClickSort[1];
          newArr[1] = obj;
          this.groupClickSort = newArr;
        }

      } else {
        if (this.groupClickSort[0].th.key == obj.th.key) {
          this.groupClickSort[0] = obj;
        } else {
          this.groupClickSort[1] = obj;

        }
      }
    } else {
      let obj = {
        th: th,
        direction: 1,
        // type: type,
        // item: item
      }
      this.groupClickSort.push(obj);
    }

    for (let x of this.groupClickSort) {

      this.controlBreakArr.sort((a, b) => {

        if (a.pRHead[k].type == 'DATE' || a.pRHead[k].type == 'DATETIME') {
          let newA = JSON.parse(JSON.stringify(a.pRHead[k].value));
          let newB = JSON.parse(JSON.stringify(b.pRHead[k].value));
          newA = newA ? new Date(newA.split('-').reverse().join('-')).getTime() : "";
          newB = newB ? new Date(newB.split('-').reverse().join('-')).getTime() : "";
          if (newA < newB) {
            return -1 * x.direction;
          } else if (newA > newB) {
            return 1 * x.direction;
          } else {
            return 0;
          }
        }
        else if (a.pRHead[k].type == 'NUMBER' || a.pRHead[k].type == 'NUMBER') {
          let newA;
          let newB
          if (a.pRHead[k].value && a.pRHead[k].value.includes(',')) {
            newA = JSON.parse(JSON.stringify(parseFloat(a.pRHead[k].value.replace(/,/g, ""))));
            newB = JSON.parse(JSON.stringify(parseFloat(b.pRHead[k].value.replace(/,/g, ""))));
          } else {
            newA = JSON.parse(JSON.stringify(parseFloat(a.pRHead[k].value)));
            newB = JSON.parse(JSON.stringify(parseFloat(b.pRHead[k].value)));
          }

          newA = newA ? newA : 0;
          newB = newB ? newB : 0;
          if (parseFloat(newA) < parseFloat(newB)) {
            return -1 * x.direction;
          }
          else if (parseFloat(newA) > parseFloat(newB)) {
            return 1 * x.direction;
          } else {
            return 0
          }

        } else {
          const nameA = a.pRHead[k].value.toUpperCase(); // ignore upper and lowercase
          const nameB = b.pRHead[k].value.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1 * x.direction;// ascending: -1, descending: 1
          } else if (nameA > nameB) {
            return 1 * x.direction;; // ascending: 1, descending: -1
          } else {
            // names must be equal
            return 0;
          }
        }
      });


    }
    if (radioOn) {
      this.groupClickSort.pop()
    }
  }






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

  // aifullScreen(fullscreen_idai:any,statusai){
  //   if(statusai=='1'){     
  //         //ai screen
  //       let elementai = document.getElementById(fullscreen_idai);
  //     // Add a class to the element
  //      elementai.classList.add("active_aiscreen");
  //       elementai.classList.remove("deactive_aicreen");
  //      document.getElementById(fullscreen_idai+"aiscreen_btn1").style.display = "none";
  //      document.getElementById(fullscreen_idai+"aiscreen_btn2").style.display = "inherit";
  //      document.getElementById(fullscreen_idai+"aiscreen_btn2").style.border = "2px solid #2e6adf";


  //   }else{

  //     let elementai = document.getElementById(fullscreen_idai); 
  //    //ai screen 

  //      elementai.classList.remove("active_aiscreen");
  //      elementai.classList.add("deactive_aiscreen");
  //      document.getElementById(fullscreen_idai+"aiscreen_btn1").style.display = "inherit";
  //      document.getElementById(fullscreen_idai+"aiscreen_btn2").style.display = "none";


  //   }
  // }



  seqSortData(frameLevel4) {
    let level4 = frameLevel4;
    if (level4.length > 0) {
      level4.sort((a, b) => {
        // parseFloat
        if (parseFloat(a.Level5[0].item_seqno) < parseFloat(b.Level5[0].item_seqno)) {
          return -1;
        } else if (parseFloat(a.Level5[0].item_seqno) > parseFloat(b.Level5[0].item_seqno)) {
          return 1;
        } else {
          return 0
        }

      }

      )
    }

  }
  fileTyle = "pdf"
  selectFile(type) {
    this.fileTyle = type
  }
  cancelExport() {
    this.clickShare = false;
  }
  confirmExport() {
    this.clickShare = false;
    this.getDataForGraph(this.fileTyle, '')
    this.selectedExportDataType = "selectData"
  }

  collapseSortGroup(th, k, c, radioOn?) {
    if (!th.order) {
      th.order = true
    }

    let obj: any = {};
    if (this.innerGroupClickSort.length > 0) {

      obj = this.innerGroupClickSort.find(x => x.th.prompt_name == th.prompt_name);
      if (obj) {
        if (obj.direction > 0) {
          obj.direction = -1;
        } else {
          obj.direction = 1;
        }
      } else {
        obj = {
          th: th,
          direction: 1,

        }
      }

      if (this.innerGroupClickSort.length > 1) {

        if (this.innerGroupClickSort[1].th.prompt_name == obj.th.prompt_name) {
          this.innerGroupClickSort[1] = obj;
        } else {
          let newArr = [];
          delete this.innerGroupClickSort[0].th['order']
          newArr[0] = this.innerGroupClickSort[1];
          newArr[1] = obj;
          this.innerGroupClickSort = newArr;
        }

      } else {
        if (this.innerGroupClickSort[0].th.prompt_name == obj.th.prompt_name) {
          this.innerGroupClickSort[0] = obj;
        } else {
          this.innerGroupClickSort[1] = obj;

        }
      }
    } else {
      let obj = {
        th: th,
        direction: 1,
        // type: type,
        // item: item
      }
      this.innerGroupClickSort.push(obj);
    }

    for (let x of this.innerGroupClickSort) {

      c.items.sort((a, b) => {
        // console.log("a : ",a[k].Level5[0].value)
        // console.log("b : ",b[k].Level5[0].value)
        let first = a[k].Level5[0]
        let second = b[k].Level5[0]
        if (first.datatype == 'DATE' || first.datatype == 'DATETIME') {
          let newA = JSON.parse(JSON.stringify(first.value));
          let newB = JSON.parse(JSON.stringify(second.value));
          newA = newA ? new Date(newA.split('-').reverse().join('-')).getTime() : "";
          newB = newB ? new Date(newB.split('-').reverse().join('-')).getTime() : "";
          if (newA < newB) {
            return -1 * x.direction;
          } else if (newA > newB) {
            return 1 * x.direction;
          } else {
            return 0;
          }
        }
        else if (first.datatype == 'NUMBER' || first.datatype == 'NUMBER') {
          let newA;
          let newB
          if (first.value && first.value.includes(',')) {
            newA = JSON.parse(JSON.stringify(parseFloat(first.value.replace(/,/g, ""))));
            newB = JSON.parse(JSON.stringify(parseFloat(second.value.replace(/,/g, ""))));
          } else {
            newA = JSON.parse(JSON.stringify(parseFloat(first.value)));
            newB = JSON.parse(JSON.stringify(parseFloat(second.value)));
          }

          newA = newA ? newA : 0;
          newB = newB ? newB : 0;
          if (parseFloat(newA) < parseFloat(newB)) {
            return -1 * x.direction;
          }
          else if (parseFloat(newA) > parseFloat(newB)) {
            return 1 * x.direction;
          } else {
            return 0
          }

        } else {
          const nameA = first.value.toUpperCase(); // ignore upper and lowercase
          const nameB = second.value.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1 * x.direction;// ascending: -1, descending: 1
          } else if (nameA > nameB) {
            return 1 * x.direction;; // ascending: 1, descending: -1
          } else {
            // names must be equal
            return 0;
          }
        }
      });

    }
    if (radioOn) {
      this.innerGroupClickSort.pop()
    }
  }


  getitemSearch(data?) {
    //  for(let itemGroup of this.frame.headers) {
    //   for(let item of itemGroup.Level5){
    //     for(let a of this.conditionalFilterData){

    //       if(item.prompt_name==a.coloumns.prompt_name){

    //         if(!data){
    //           item.search=`%${a.description}%`
    //           item.operatorData
    //         }else{
    //           item.search=data
    //           this.conditionalFilterData=""
    //         }
    //       }
    //     }
    //   }
    //  }
    if (((this.frame.tableData && this.frame.tableData.length > 0) || (this.frame.searchableData && this.frame.searchableData.length > 0))) {
      let data = this.filterColumna(this.frame);
      this.frame.page_no = 1;
      let to = 1 * this.frame.displayDataLen;
      let from = to - this.frame.displayDataLen;

      this.frame.from_record = from;
      this.frame.to_record = to;
      this.frame.page_no = 1;
      this.frame.active_row = 0;
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

    }
    return;
  }
  filterColumna(frame) {
    let flag = false;
    let fillData = [];
    let fillRawData = [];
    let data = [];
    if (frame.searchableData) {
      data = frame.searchableData;
    } else {
      data = JSON.parse(JSON.stringify(frame.tableData));
    }
    // fillData = frame.tableRows;
    let fillRawDataTabledata = JSON.parse(JSON.stringify(frame.tableData));
    let fillRawDataTableRows = frame.tableRows;
    for (let c of this.conditionalFilterData) {
      if (c.operators == '=') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) == this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) == this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '>') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) > this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) > this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '>=') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) >= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) >= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '<') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) < this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) < this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '<=') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) <= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) <= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '<>') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) != this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) != this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'is null') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => x[c.coloumns.item_name] == null);
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => x[c.coloumns.item_name] == null);
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'is not null') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => x[c.coloumns.item_name] != null);
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data

        } else {
          fillRawData = fillRawDataTabledata.filter(x => x[c.coloumns.item_name] != null);
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'like') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => ((x[c.coloumns.item_name] != null) && x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => ((x[c.coloumns.item_name] != null) && x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'not like') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => ((x[c.coloumns.item_name] == null) || !x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => ((x[c.coloumns.item_name] == null) || !x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'not in') {
        flag = true;
        let str = "";
        if ((c.description).indexOf(",") > -1) {
          let condArr = c.description.split(',');
          let i = 0
          for (let c of condArr) {
            i++;
            if (i < condArr.length) {
              str = str + "x[c.coloumns.item_name].toLowerCase() != '" + c.toLowerCase() + "' && "
            } else {
              str = str + "x[c.coloumns.item_name].toLowerCase() != '" + c.toLowerCase() + "'";
            }
          }
        } else {
          str = "x[c.coloumns.item_name].toLowerCase() != '" + c.description.toLowerCase() + "'";
        }

        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => (eval(str)));
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => (eval(str)));
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'in') {
        flag = true;
        let str = "";
        if ((c.description).indexOf(",") > -1) {
          let condArr = c.description.split(',');
          let i = 0
          for (let c of condArr) {
            i++;
            if (i < condArr.length) {
              str = str + "x[c.coloumns.item_name].toLowerCase() == '" + c.toLowerCase() + "' || "
            } else {
              str = str + "x[c.coloumns.item_name].toLowerCase() == '" + c.toLowerCase() + "'";
            }
          }
        } else {
          str = "x[c.coloumns.item_name].toLowerCase() == '" + c.description.toLowerCase() + "'";
        }

        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => (eval(str)));
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => (eval(str)));
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'begin with') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (x[c.coloumns.item_name].startsWith(c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (x[c.coloumns.item_name].startsWith(c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'end with') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (x[c.coloumns.item_name].endsWith(c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (x[c.coloumns.item_name].endsWith(c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      }

    }
    if (fillData.length > 0 || flag) { } else {
      fillData = frame.tableRows;
      fillRawData = JSON.parse(JSON.stringify(frame.tableData));
    }

    if (flag) {
      // frame.tableRows = [];
      frame.canvasRows = [];
      delete frame['noFilter'];
      frame.searchableData = fillData;
      frame.searchableRawData = fillRawData;
      frame.active_row = undefined;
    } else {
      delete frame['searchableData'];
      delete frame['searchableRawData'];
      frame.noFilter = true;
    }
  }

  searchColItem(tableRows, c, data) {
    for (let a of tableRows) {
      for (let d of a) {
        for (let b of d.Level5) {
          if (b.prompt_name == c.coloumns.prompt_name) {
            if (c.operators == 'like') {
              if (b.value && c.description) {
                if (b.value.toLowerCase().includes((c.description).toLowerCase())) {
                  data.push(a)
                }
              }
            } else if (c.operators == 'not like') {
              if (b.value && c.description) {
                if (!b.value.toLowerCase().includes((c.description).toLowerCase())) {
                  data.push(a)
                }
              } else {
                data.push(a)
              }
            } else if (c.operators == 'is null') {
              if (b.value == null) {
                data.push(a)
              }
            } else if (c.operators == 'is not null') {
              if (b.value != null) {
                data.push(a)
              }
            } else if (c.operators == 'begin with') {
              if (b.value && c.description) {
                if (b.value.startsWith(c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == 'end with') {
              if (b.value && c.description) {
                if (b.value.endsWith(c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '=') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) == this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }

            } else if (c.operators == '>') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) > this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '>=') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) >= this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '<') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) < this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '<=') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) <= this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '<>') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) != this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == 'not in') {
              let str = "";
              if ((c.description).indexOf(",") > -1) {
                let condArr = c.description.split(',');
                let i = 0
                for (let c of condArr) {
                  i++;
                  if (i < condArr.length) {
                    str = str + "b.value.toLowerCase() != '" + c.toLowerCase() + "' && "
                  } else {
                    str = str + "b.value.toLowerCase() != '" + c.toLowerCase() + "'";
                  }
                }
              } else {
                str = "b.value.toLowerCase() != '" + c.description.toLowerCase() + "'";
              }
              if (eval(str)) {
                data.push(a)
              }
            } else if (c.operators == 'in') {
              let str = "";
              if ((c.description).indexOf(",") > -1) {
                let condArr = c.description.split(',');
                let i = 0
                for (let c of condArr) {
                  i++;
                  if (i < condArr.length) {
                    str = str + "b.value.toLowerCase() == '" + c.toLowerCase() + "' && "
                  } else {
                    str = str + "b.value.toLowerCase() == '" + c.toLowerCase() + "'";
                  }
                }
              } else {
                str = "b.value.toLowerCase() == '" + c.description.toLowerCase() + "'";
              }
              if (eval(str)) {
                data.push(a)
              }
            }
          }
        }
      }

    }
  }

  go_first_page() {
    this.paginate(1);
    this.lhs_lib.app_first_record(this.frame.apps_page_frame_seqid, 'move');
    this.parentDiv.nativeElement.scrollTop = 0;  // Scroll to top of the table
  }

  go_last_page() {
    this.paginate(this.frame.total_Pages);
    this.lhs_lib.app_last_record(this.frame.apps_page_frame_seqid, 'move');
    this.scrollToBottomIfLastPage();
  }

  clearInputColumn(item) {
    item.search = '%%'
    this.filterColumn(item);
  }

  singleSelectRecord() {
    this.isSingleSelectRecord = !this.isSingleSelectRecord
  }

  onSwitchHorizontal() {
    this.frame.temp_frame_type = this.frame.apps_frame_type;
    this.frame.apps_frame_type = 'HORIZONTAL_TABLE';
    this.frame.changeFrameType = true;
    this.processData.afterTableRows(this.frame);
  }

  onSwitch() {

    this.frame.temp_frame_type = this.frame.apps_frame_type;
    // this.frame.temp_frame_type = this.frame.apps_frame_type;
    this.frame.apps_frame_type = 'CARD';
    this.frame.changeFrameType = true;
    this.processData.afterTableRows(this.frame);
  }



  formatMask(value: number, mask: any): string {
    if (!value || !mask) return '';

    const numericValue = value.toString().replace(/[^\d.]/g, '');
    const [intPart, decPart] = numericValue.split('.');
    const [maskInt, maskDec] = mask.split('.');

    let formattedInt = '';
    const intMaskSections = maskInt.split(',');
    let index = intPart.length;

    for (let i = intMaskSections.length - 1; i >= 0; i--) {
      const sectionLength = intMaskSections[i].length;
      const section = intPart.substring(Math.max(0, index - sectionLength), index);
      formattedInt = section + (formattedInt ? ',' + formattedInt : '');
      index -= sectionLength;
      if (index <= 0) break;
    }

    if (index > 0) {
      formattedInt = intPart.substring(0, index) + ',' + formattedInt;
    }

    let formattedDec = '';
    if (maskDec) {
      const decLength = maskDec.length;
      formattedDec = (decPart || '').padEnd(decLength, '0').substring(0, decLength);
    }

    return formattedDec ? `${formattedInt}.${formattedDec}` : formattedInt;
  }




  // Scroll to the bottom if the current page is the last one
  private scrollToBottomIfLastPage() {
    const lastPage = Math.ceil(this.frame.tableData.length / this.frame.displayDataLen);
    if (this.page === lastPage) {
      // Scroll to the bottom of the table
      this.parentDiv.nativeElement.scrollTop = this.parentDiv.nativeElement.scrollHeight;
    }
  }
  //////////////////////////////////////////ai////////////////////////
  aifullScreen(frametable: any, statusai) {
    // console.log(frametable);
    this.frametable = JSON.parse(JSON.stringify(frametable));
    // this.chatAiService.setFrameData(frametable);
    let fullscreen_idai = frametable.apps_page_frame_seqid;
    // let tableidAi=fullscreen_idai+"table";

    if (statusai == '1') {
      this.col9 = "4";
      this.col6 = "8";
      this.isAIUsed = true;
      let elementai = document.getElementById(fullscreen_idai);
      // this.chatMessages.push({ sender: 'ai', text: '"Welcome to TableGPT! Explore table' });
      // let tableidAi=fullscreen_idai+"table";
      // const table = document.getElementById(tableidAi) as HTMLTableElement;
      // if (table) {
      //   this.chatAiService.complete_context = Array.from(table.rows)
      //     .map(row => Array.from(row.cells).map(cell => cell.innerText).join(', '))
      //     .join('\n');
      //     // this.chatAiService.complete_context=this.context;
      // } else {
      //   alert('No table found!');
      //   return;
      // }

      elementai.classList.add("active_aiscreen");
      elementai.classList.remove("deactive_aicreen");
      document.getElementById(fullscreen_idai + "aiscreen_btn1").style.display = "none";
      document.getElementById(fullscreen_idai + "aiscreen_btn2").style.display = "inherit";
      document.getElementById(fullscreen_idai + "aiscreen_btn2").style.border = "2px solid #2e6adf";
    } else {
      this.col9 = "";
      this.col6 = "";
      let elementai = document.getElementById(fullscreen_idai);
      //  this.chatMessages = [];
      //  tableidAi="";
      this.frametable = "";
      this.isAIUsed = false;
      //  this.chatAiService.complete_context="";
      elementai.classList.remove("active_aiscreen");
      elementai.classList.add("deactive_aiscreen");
      document.getElementById(fullscreen_idai + "aiscreen_btn1").style.display = "inherit";
      document.getElementById(fullscreen_idai + "aiscreen_btn2").style.display = "none";
    }
  }
  onMouseDown(event: MouseEvent): void {
    this.isSelecting = true;
    this.selectedText = "";
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isSelecting) {
      if (isPlatformServer(this.platformId)) return;
      this.selectedText = window.getSelection()?.toString().trim() || '';
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.isSelecting = false;
  }

  removeAll(event) {
    event.stopPropagation();
    if (this.frame.single_search) {
      this.clear_search(this.frame.single_search, true)
    }

    if (this.frame.linked_search) {
      for (let c of this.frame.linked_search) {
        this.clear_search(c);
      }
    }
  }


  openMike() {

    this.globalObjects.speechdata = '';

    this.globalObjects.startListening().then(res => {
      this.frame.search = res;
    });

  }

  clear_search(obj, single?) {
    let event = {
      click_events_str: `search_item('${obj.to}','${obj.from}')`,
      indexcount: obj.indexcount,
      apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
      apps_item_seqid: '',
      singleClicked: true
    }
    this.emitPass.emit(event);
  }

  /////////////////////////////ai//////////////////////////////////////////////////////

  columnFilterEmitPass(event) {
    this.emitPass.emit(event)
  }
  frameaiSize(event) {
    // alert(event.expand_flag);
    //console.log("event ai ",event.expand_flag);
    if (event.expand_flag == true) {
      this.col9 = 8;
      this.col6 = 4;
    } else {

      this.col9 = 4;
      this.col6 = 8;

    }
  }


  private startX = 0;
  private startWidth = 0;
  private currentColIndex = -1;
  isResizable = false; //
  isResizableChange(event) {
    this.isResizable = event
  }
  onMouseDownResize(event: MouseEvent, headerCell: HTMLElement, item) {
    if (!this.isResizable) return;

    this.startX = event.pageX;
    this.startWidth = headerCell.offsetWidth;
    // this.columnIndex = colIndex;

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.pageX - this.startX;
      const newWidth = this.startWidth + delta;

      // Apply new width dynamically to the internal `_resizedWidth` field
      item._resizedWidth = newWidth;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  autoResizeColumn(headerCell: HTMLElement, item) {
    const allHeaders = Array.from(document.querySelectorAll('thead th'));
    const colIndex = allHeaders.indexOf(headerCell);
    // const colKey = this.columns[colIndex].key;

    const headerContent = headerCell.querySelector('.header-content')?.textContent?.trim() || '';

    const cellContents = Array.from(document.querySelectorAll(`tbody td:nth-child(${colIndex + 1})`))
      .map(td => td.querySelector('.cell-content')?.textContent?.trim() || '');

    const allTexts = [headerContent, ...cellContents];

    const ruler = document.createElement('span');
    ruler.style.visibility = 'hidden';
    ruler.style.position = 'absolute';
    ruler.style.whiteSpace = 'nowrap';
    if (isPlatformServer(this.platformId)) return;
    ruler.style.font = window.getComputedStyle(headerCell).font;
    document.body.appendChild(ruler);

    let maxWidth = 0;
    for (const text of allTexts) {
      ruler.textContent = text;
      maxWidth = Math.max(maxWidth, ruler.offsetWidth);
    }

    document.body.removeChild(ruler);
    item._resizedWidth = maxWidth + 24; // padding + resizer
  }

  onRightClick(event, tableData) {

    event.preventDefault();
    event.stopPropagation();
    this.globalObjects.mouseEvent = event;

    let arr = [];
    let itm;

    if (tableData) {
      for (let itmGrp of tableData) {
        for (let item of itmGrp.Level5) {
          itm = item;
          if (item.item_type == 'RIGHT_CLICK') {
            arr.push(item)
          }
        }
      }
      delete this.frame['executing_index'];
      this.frame.old_active_row = this.frame.active_row;
      this.frame.active_row = itm.indexcount;
      itm.childItems = arr;
      if (arr.length > 0) {
        this.emitPass.emit(itm)
      }
    }
  }
  tableSummaryClick(name) {
    let item = this.lhs_lib.get_rows_item(this.frame.tableRows[0], "sum_" + name);
    if (item) {
      this.emitPass.emit(item);
    }
  }

  aiInputDataChange(event) {
    this.aiInputData = event;
  }
  handleDbClickPopover(event) {
    this.dbClickpopover(event.flag, event.tableData, event.rowindex)
  }
  handleItemClick(event) {
    this.itemClicked(event.item, event.tableData, event.rowindex)
  }
  activetabshow(){
    if (this.tabAtive && this.tabAtive.x && this.tabAtive.index && this.tabAtive.itm) {
      this.toggleTabTable(this.tabAtive.x, this.tabAtive.index, this.tabAtive.itm)
    }else{
      this.lhs_lib.refresh_frames();
    }

  }
  toggleTabTable(x, index, itm){
      if (itm.item_sub_type == 'TAB_OPEN') { } else {
      this.tabAtive = {
        x: x,
        index: index,
        itm: itm
      }
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

      this.lhs_lib.refresh_frames();

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
  }

  startLongPress(event: PointerEvent, tableData: any) {

    // Only handle touch devices
    if (event.pointerType !== 'touch') {
      return;
    }

    this.longPressTimer = setTimeout(() => {

      console.log('Long press detected');

      this.onRightClick(event, tableData);

    }, 600); // 600ms
  }

    cancelLongPress() {

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

  }

    getMaskedValue(value) {
    if (!value) return '';
    return '*'.repeat(value.length);
  }
}


