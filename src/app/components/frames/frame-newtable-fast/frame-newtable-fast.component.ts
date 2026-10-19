import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
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
import { ColumnFilterLayoutComponent } from '../../layout/column-filter/column-filter.component';
import { Events } from 'src/app/services/events';
import { FrameApexfilterComponent } from '../frame-apexfilter/frame-apexfilter.component';
import { PersonalisationFilterComponent } from 'src/app/pages/personalisation-filter/personalisation-filter.component';
import { FramePreviewComponent } from '../frame-preview/frame-preview.component';
import { WebdatarocksComponent } from 'src/app/demo-utils/pivot-table-webdatarocks/webdatarocks.component';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { DoubleclickComponent } from '../../layout/doubleclick/doubleclick.component';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';
import { TableToolsComponent } from '../../frameModule/table-tools/table-tools.component';
import { ParaTextComponent } from '../../items/item-display/para-text/para-text.component';
import { FrameAiDataComponent } from '../frame-ai-data/frame-ai-data.component';
import { PaginationComponent } from '../../frameModule/pagination/pagination.component';
import { FormatMaskPipe } from 'src/app/pipes/format-mask-pipe';
import { TableColumnToolComponent } from '../../frameModule/table-column-tool/table-column-tool.component';
import { FocusDirective } from 'src/app/directives/focus-directive';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
// import { FormatMaskPipe } from 'src/app/pipes/format-mask.pipe';

@Component({
  standalone: true,
  imports: [STANDALONE_IMPORTS, ItemsComponent, TableToolsComponent, ParaTextComponent, PaginationComponent, FrameAiDataComponent, FormatMaskPipe, TableColumnToolComponent, FocusDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-frame-newtable-fast',
  templateUrl: './frame-newtable-fast.component.html',
  styleUrls: ['./frame-newtable-fast.component.scss'],
})
export class FrameNewtableFastComponent implements OnInit, AfterViewInit {
  @ViewChild('tableBody') table2Body: ElementRef;
  @ViewChild("parentDiv") parentDiv: ElementRef;
  @ViewChild("searchInput") searchInput: IonInput;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Input() object_mast: any = {};
  @Input() page_no: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() searchGlobalemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() personalize: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  isTextWrapped: boolean = false;  // Initial state for wrapping text
  displayDataLen = 50
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
  easyfilter2value: boolean = true;
  easyfilter2value1: boolean = true;
  frametable: any;
  isAIUsed = false;
  item: any;
  aiInputData: any
  setStrIndex: any = { "width": "20px", "max-width": "20px", "min-width": "15px" };
  disSetId: any;
  clickedHead = [];
  tdWidthh = {};
  tblWidth: any
  isAggrigate: boolean = false
  public toggleFilter: boolean = false;
  public show: boolean = false;
  public show_filter: boolean = false;

  public horizontal_table: any = 'Show';
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;

  loading: boolean = false;
  col9: any;
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
  groupClickSort = [];
  dragedDiv = [];
  isLocked: boolean = false;
  summaryFlag: any;
  id: any;
  freezId: string = '';
  excelCol: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ', 'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ', 'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ', 'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FU', 'FV', 'FW', 'FX', 'FY', 'FZ', 'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ', 'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GX', 'GY', 'GZ', 'HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'HG', 'HH', 'HI', 'HJ', 'HK', 'HL', 'HM', 'HN', 'HO', 'HP', 'HQ', 'HR', 'HS', 'HT', 'HU', 'HV', 'HW', 'HX', 'HY', 'HZ', 'IA', 'IB', 'IC', 'ID', 'IE', 'IF', 'IG', 'IH', 'II', 'IJ', 'IK', 'IL', 'IM', 'IN', 'IO', 'IP', 'IQ', 'IR', 'IS', 'IT', 'IU', 'IV', 'IW', 'IX', 'IY', 'IZ', 'JA', 'JB', 'JC', 'JD', 'JE', 'JF', 'JG', 'JH', 'JI', 'JJ', 'JK', 'JL', 'JM', 'JN', 'JO', 'JP', 'JQ', 'JR', 'JS', 'JT', 'JU', 'JV', 'JW', 'JX', 'JY', 'JZ', 'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'KG', 'KH', 'KI', 'KJ', 'KK', 'KL', 'KM', 'KN', 'KO', 'KP', 'KQ', 'KR', 'KS', 'KT', 'KU', 'KV', 'KW', 'KX', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'LG', 'LH', 'LI', 'LJ', 'LK', 'LL', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LT', 'LU', 'LV', 'LW', 'LX', 'LY', 'LZ', 'MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MI', 'MJ', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'NG', 'NH', 'NI', 'NJ', 'NK', 'NL', 'NM', 'NN', 'NO', 'NP', 'NQ', 'NR', 'NS', 'NT', 'NU', 'NV', 'NW', 'NX', 'NY', 'NZ', 'OA', 'OB', 'OC', 'OD', 'OE', 'OF', 'OG', 'OH', 'OI', 'OJ', 'OK', 'OL', 'OM', 'ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT', 'OU', 'OV', 'OW', 'OX', 'OY', 'OZ', 'PA', 'PB', 'PC', 'PD', 'PE', 'PF', 'PG', 'PH', 'PI', 'PJ', 'PK', 'PL', 'PM', 'PN', 'PO', 'PP', 'PQ', 'PR', 'PS', 'PT', 'PU', 'PV', 'PW', 'PX', 'PY', 'PZ', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG', 'QH', 'QI', 'QJ', 'QK', 'QL', 'QM', 'QN', 'QO', 'QP', 'QQ', 'QR', 'QS', 'QT', 'QU', 'QV', 'QW', 'QX', 'QY', 'QZ', 'RA', 'RB', 'RC', 'RD', 'RE', 'RF', 'RG', 'RH', 'RI', 'RJ', 'RK', 'RL', 'RM', 'RN', 'RO', 'RP', 'RQ', 'RR', 'RS', 'RT', 'RU', 'RV', 'RW', 'RX', 'RY', 'RZ', 'SA', 'SB', 'SC', 'SD', 'SE', 'SF', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SQ', 'SR', 'SS', 'ST', 'SU', 'SV', 'SW', 'SX', 'SY', 'SZ', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH', 'TI', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TP', 'TQ', 'TR', 'TS', 'TT', 'TU', 'TV', 'TW', 'TX', 'TY', 'TZ', 'UA', 'UB', 'UC', 'UD', 'UE', 'UF', 'UG', 'UH', 'UI', 'UJ', 'UK', 'UL', 'UM', 'UN', 'UO', 'UP', 'UQ', 'UR', 'US', 'UT', 'UU', 'UV', 'UW', 'UX', 'UY', 'UZ', 'VA', 'VB', 'VC', 'VD', 'VE', 'VF', 'VG', 'VH', 'VI', 'VJ', 'VK', 'VL', 'VM', 'VN', 'VO', 'VP', 'VQ', 'VR', 'VS', 'VT', 'VU', 'VV', 'VW', 'VX', 'VY', 'VZ', 'WA', 'WB', 'WC', 'WD', 'WE', 'WF', 'WG', 'WH', 'WI', 'WJ', 'WK', 'WL', 'WM', 'WN', 'WO', 'WP', 'WQ', 'WR', 'WS', 'WT', 'WU', 'WV', 'WW', 'WX', 'WY', 'WZ', 'XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK', 'XL', 'XM', 'XN', 'XO', 'XP', 'XQ', 'XR', 'XS', 'XT', 'XU', 'XV', 'XW', 'XX', 'XY', 'XZ', 'YA', 'YB', 'YC', 'YD', 'YE', 'YF', 'YG', 'YH', 'YI', 'YJ', 'YK', 'YL', 'YM', 'YN', 'YO', 'YP', 'YQ', 'YR', 'YS', 'YT', 'YU', 'YV', 'YW', 'YX', 'YY', 'YZ', 'ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'ZF', 'ZG', 'ZH', 'ZI', 'ZJ', 'ZK', 'ZL', 'ZM', 'ZN', 'ZO', 'ZP', 'ZQ', 'ZR', 'ZS', 'ZT', 'ZU', 'ZV', 'ZW', 'ZX', 'ZY', 'ZZ']
  isSearch: boolean = false
  rowsPage: any = [10, 20, 30, 50, 100]
  rowPage = 10
  selectShow: boolean = false;
  item_search_flagData: boolean = false

  selectedExportDataType = "selectData"
  groupInnerHeader: any
  innerGroupClickSort = []
  isNotSearch: boolean = false
  isNotSort: boolean = false
  isNotPaginate: boolean = false
  lovEventFlag: boolean = false
  isNotTool: boolean = false
  isNotExport: boolean = false
  isNotExportPdf: boolean = false
  isNotExportExcel: boolean = false
  isNotExportCsv: boolean = false
  isSingleSelectRecord: boolean = false
  isNotScroll: boolean = false
  isSingleClick: boolean = true;
  timer: any;
  clickEvent: any
  conditionalFilterData: any
  fileTyle = "pdf"
  /////////////////////ai variable/////////////
  selectedText: string = '';
  isSelecting: any;
  ////////////////////////////////////
  constructor(public globalObjects: GlobalObjectsService, private events: Events, private dataService: DataService, public lhs_lib: LhsLibService, public platform: Platform, public modalController: ModalController, private processData: ProcessDataService,
    private lhsLib: LhsLibService, private cdr: ChangeDetectorRef, private modalGlobal: CanvasModalService, private commonMethod: CommonMethodService, private cdEngine: CdEngineService) {
    this.userDetails = this.globalObjects.userDetails;
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "frame-newtable2")
    }
  }
  page = 1

  isColumnOpen = false
  isTemplateOpen = false
  isFunctionOpen = false

  isRightItemsFlag = false;
  column = []
  rowCount: number = 0
  tabAtive: any = {}
  ngOnInit() {
    this.cdEngine.register(this.frame.apps_page_frame_seqid, this.cdr);
    this.frame.apps_frame_sub_type = 'NEW'
    this.frame.edited_row_id = 0;

    if (this.platform.is('android') || this.platform.is('ios')) {

      this.plt = this.platform;
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

    const part = this.frame?.apps_page_frame_seqid?.split('-')?.[2] ?? '';
    this.isAFrameMode = part.includes('A');



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

      let hideBtnFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_name == "WMA_FRAME_STATUS") {
          itemMast.value = 'D';
        }


        if (itemMast.item_type == 'RIGHT_CLICK') {
          this.isRightItemsFlag = true;
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
          // this.filter=true;
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
          this.frame.isTextWrapped = true;
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
        if (this.frame.apps_frame_type == 'ENTRY_TABLE' && this.frame.showTd == "SHOW") {
          for (let itemGroup of this.frame.headers) {
            for (let input_item of itemGroup.Level5) {
              if (input_item.freezStyle) {
                input_item.freezStyle["z-index"] = "10";
              }
            }
          }
        }

      }
    }

    this.thead = theaddata;
    this.frame.tHead = this.thead;
    this.pdfheads = pdfHeads;
    this.excelheads = exelHeads;
    this.frame.rowsPerPage = this.frame.displayDataLen;
    this.frame.active_row = 0;
    // this.popupSubscribe()
    this.frame.rowCount = 0
    // console.log("this.frame.tableRows", this.frame)



  }


  autoFreezeFlag = false
  autoFreezeCount = 0
  ngAfterViewInit() {
    if (this.autoFreezeFlag) {
      this.commonMethod.autoFreeze(this.autoFreezeCount, this.frame)
    }
  }


  // @HostListener('document:keydown', ['$event'])
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

  // groupHeadArr: any
  // gpRHead: any


  debounce(callback, delay = 500, event?) {
    var time;

    return (...args) => {
      console.log(args[0]);
      this.clickEvent = args[0];
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  getSearchResult = this.debounce((newFunc, delay, item?) => {
    if (newFunc) {
      if (newFunc == 'searchAllData') {
        this.searchAllData();
      } else if (newFunc == 'filterColumn') {
        this.filterColumn(item);
      }
    }
    this.cdr.detectChanges();
  });

  searchAllData() {
    this.page = 1
    this.frame.rowCount = 0
    this.commonMethod.searchAllData(this.frame, this.frame.displayDataLen)
    return
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
  itemClicked(event, rowsdata, j, isInput?) {

    //  this.itemClick(event, rowsdata, j);
    // console.log("comesss");

    this.frame.edited_row_id = event.indexcount;
    // if (event.item_type == 'TEXT_INPUT') {
    //   // this.preInputClick(event, rowsdata, j);

    this.lhs_lib.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.indexcount);
    // } else {
    this.itemClick(event, rowsdata, j);


    // }
  };


  preInputClick(event, rowsdata, j) {

    if (event.lovOpen) { return; }

    delete event['some_post_events_str'];
    delete event['returnId'];
    delete event['returnIndex'];

    if (event.item_type.toUpperCase() != 'TEXT_INPUT') {
      delete event['forcedInvalid'];
      delete event['rase'];

    }

    if (event.item_enable_flag != 'F') {
      if (event.item_type != 'BUTTON' && event.item_type != 'BT' && event.item_type != 'BUTTON_ICON' && !event.isAssociate) {
        let frame = this.frame
        if (frame && (frame.apps_frame_sub_type == 'SINGLE_ROW' || frame.apps_frame_sub_type == 'SINGLE_ROW_BLANK')) {

          let tableRows = this.lhs_lib.get_rows(frame, event.indexcount, true);
          if (tableRows) {
            this.lhs_lib.make_row_dirty(event, tableRows);
          }
        } else {

          if (event.frame_status != 'dirty') {
            let tableRows = this.lhs_lib.get_rows(frame, event.indexcount);
            if (tableRows) {
              this.lhs_lib.make_row_dirty(event, tableRows);
            }
          }
        }

        if (frame) {
          if (frame.tableRows && frame.tableRows.length > 0 && frame.total_no_of_record == 0) {
            frame.total_no_of_record = frame.tableRows.length - (frame.extra_record_count ?? 0);
            this.lhs_lib.set_frame_indexes(frame);
          }
        }
      }
    }

    if (event.item_enable_flag != 'F' || this.frame.apps_frame_type == 'ENTRY_TABLE' || this.frame.apps_frame_type == 'TABLE') {
      this.itemClick(event, rowsdata, j);
    }

  }


  preInputChange(event, rowindex, rowsdata) {
    console.log(event);
    if (event.lovOpen) { return; }
    if (event.codeOfValues) {
      event.codeOfValues = event.value;
    }

    delete event['some_post_events_str'];

    if (event.item_type.toUpperCase() != 'TEXT_INPUT') {
      delete event['forcedInvalid'];
      delete event['rase'];

    }

    event.msgError = "";
    delete event['returnId'];
    delete event['returnIndex'];
    if (event.item_enable_flag != 'F' || event.item_type == 'LIST_BOX') {
      if (event.itemClicked == 'post') {
        event.msgError = '';
        let olV = event.oldValue ? (typeof (event.oldValue) == 'number' ? event.oldValue : event.oldValue.toLowerCase()) : event.oldValue;
        let nlV = event.value ? (typeof (event.value) == 'number' ? event.value : event.value.toLowerCase()) : event.value;

        if (nlV != olV) {



          if (event.post_events_str && !event.value) {
            event.oldValue = event.value;
            let events = event.post_events_str.split(";");
            let str = "";
            for (let ev of events) {
              if (!ev || ev.toLowerCase().includes("validate_lov")) {

              } else {
                str = str + ev + ";";
              }
            }
            if (str) {
              event.some_post_events_str = str;
              this.itemValueChange(event, rowindex, rowsdata);
            }
          } else {
            delete event['some_post_events_str'];
            event.oldValue = event.value;
            this.itemValueChange(event, rowindex, rowsdata);
          }
        } else {
          if (event.post_events_str) {
            let events = event.post_events_str.split(";");
            let str = "";
            for (let evs of events) {
              if (evs.toLowerCase() == "app_plsql1_clob" || evs.toLowerCase() == "app_plsql2_clob" || evs.toLowerCase() == "app_plsql1_text" ||
                evs.toLowerCase() == "app_plsql2_text" || evs.toLowerCase() == "app_plsql1_text_force" ||
                evs.toLowerCase() == "app_plsql2_text_force" || evs.toLowerCase() == "app_js1_text" || evs.toLowerCase() == "app_js2_text"
                || evs.toLowerCase() == "app_js1_text_force" || evs.toLowerCase() == "app_js2_text_force" || (evs.toLowerCase().includes("validate_lov") && (event.validate_flag == 'T'))) {
                str = str + evs + ";";
              }
            }
            if (str) {
              event.some_post_events_str = str;
              this.itemValueChange(event, rowindex, rowsdata);
            }
          }
        }
      } else {
        delete event['some_post_events_str'];
        this.itemValueChange(event, rowindex, rowsdata);
      }
    }
  }






  itemClick(event, rowsdata, j) {
    if (event.extra_record) { return; }

    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = event.indexcount;
    this.cdEngine.detect(this.frame.apps_page_frame_seqid);
    console.log(this.frame.active_row);
    if (event.item_type != "FRAME_BUTTON_ICON") {
      this.frame.rowCount = this.frame.from_record + j
    }
    this.clickEvent = event;
    event.singleClicked = true
    if (!this.isSingleSelectRecord) {
      this.isSingleClick = true;


      if (event.item_type == "BUTTON" || event.item_type == "FRAME_BUTTON_ICON" || event.item_type == "BUTTON_ICON" || event.item_type == "DOWNLOAD_DOC" ||
        event.item_type == "CHECK_BOX" || event.item_type == "RADIO_BUTTON") {
        this.itemClickData(event, rowsdata, j)
      } else {
        this.timer = setTimeout(() => {
          if (this.isSingleClick) {
            this.itemClickData(event, rowsdata, j)

          }
        }, 100);
      }
    }
  }

  itemClickData(event, rowsdata, j) {
    if (event.item_type == "BUTTON" || event.item_type == "FRAME_BUTTON_ICON" || event.item_type == "BUTTON_ICON" || event.item_type == "DOWNLOAD_DOC" ||
      event.item_type == "CHECK_BOX" || event.item_type == "RADIO_BUTTON" || event.isDblClick) {
      delete event['singleClicked'];
      delete event['isDblClick'];
    }
    let isValid = true;
    var rowindex;
    let itemPKey = "";

    if (this.frame.apps_page_frame_seqid.split("-")[2].includes("A") && !event.dimensionItem &&
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

      if (event.dimensionItem) {
        event = JSON.parse(JSON.stringify(event));
        event = event.dimensionItem;
      }

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

        // if (this.frame.apps_page_frame_seqid.split("-")[2].includes("A")) {
        //   event.click_events_str = event.orignal_click_events_str != undefined ? event.orignal_click_events_str : event.click_events_str;
        // }

        let col = {};
        if (this.frame.tableRows && this.frame.tableRows.length > 0) {
          for (let itemGroup of rowsdata) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {

                // if (this.frame.apps_page_frame_seqid.split("-")[2].includes("A")) {
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
          console.log(" item.itemIndex :" + event.itemIndex)
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

    // if (this.calculate) {
    //   this.calculateTableData(this.tableData);
    // }
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
  }

  paginate(a_current_page) {
    this.page = a_current_page
    this.commonMethod.paginate(a_current_page, this.frame, this.frame.displayDataLen)
    // this.cdr.detectChanges();
    return
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

  orderAl

  originalTableRows: any[] = []; // Backup of full unfiltered data
  activeColumnFilters: { [column: string]: string[] } = {}; // Track filters
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


  // selectedTable2Row(event: Event) {
  //   const keyEvent = event as KeyboardEvent
  //   const key = keyEvent.key;
  //   const isUp = key === "ArrowUp" || (event as any).keyCode === 38;
  //   const isDown = key === "ArrowDown" || (event as any).keyCode === 40;
  //   if (!isUp && !isDown) return;

  //   // Skip frames ending with 'A' except "-para" (your original rule)
  //   const seq = this.frame?.apps_page_frame_seqid || "";
  //   if (seq && seq.charAt(seq.length - 1) === "A" && !seq.toLowerCase().includes("-para")) return;

  //   const tbody = this.table2Body?.nativeElement as HTMLElement | undefined;
  //   const container = this.parentDiv?.nativeElement as HTMLElement | undefined;
  //   if (!tbody || !container) return;

  //   const rows = Array.from(tbody.children) as HTMLElement[];
  //   if (!rows.length) return;

  //   event.preventDefault();

  //   // name used by go_item
  //   const doc = document.activeElement as HTMLElement | null;
  //   const name = `${this.frame.apps_page_frame_seqid}.${doc?.id || ""}`;

  //   // Helper: rowId from tr.id = frameSeq--indexcount
  //   const rowIdFromTr = (tr: HTMLElement | null): number => {
  //     const id = tr?.id || "";
  //     const n = Number(id.split("--")[1]);
  //     return Number.isFinite(n) ? n : 0;
  //   };

  //   // Find currently active row element WITHOUT scanning className
  //   const activeRowId = this.frame.active_row;
  //   const activeSuffix = `--${activeRowId}`;
  //   let activeEl = rows.find(r => (r.id || "").endsWith(activeSuffix)) || rows[0];

  //   // Keep previous for "only run heavy work when changed"
  //   const prevActive = this.frame.active_row;

  //   // Cheap "ensure visible" (no getBoundingClientRect)
  //   const ensureVisible = (rowEl: HTMLElement, topOffset = 40, bottomOffset = 40) => {
  //     const rowTop = rowEl.offsetTop;
  //     const rowBottom = rowTop + rowEl.offsetHeight;

  //     const viewTop = container.scrollTop + topOffset;
  //     const viewBottom = container.scrollTop + container.clientHeight - bottomOffset;

  //     if (rowTop < viewTop) {
  //       container.scrollTop = Math.max(0, rowTop - topOffset);
  //     } else if (rowBottom > viewBottom) {
  //       container.scrollTop = rowBottom - (container.clientHeight - bottomOffset);
  //     }
  //   };

  //   // Current DOM index
  //   let idx = rows.indexOf(activeEl);
  //   if (idx < 0) idx = 0;

  //   // -------- NAVIGATION --------
  //   if (isUp) {
  //     if (this.frame.rowCount > this.frame.from_record) {
  //       // move up within page
  //       idx = Math.max(0, idx - 1);
  //       const nextEl = rows[idx];

  //       this.frame.active_row = rowIdFromTr(nextEl);
  //       this.frame.rowCount = this.frame.rowCount - 1;

  //       nextEl.focus?.();
  //       ensureVisible(nextEl);
  //     } else {
  //       // prev page
  //       if (this.frame.current_page_no > 1) {
  //         this.paginate(this.frame.current_page_no - 1);

  //         // after DOM updates
  //         setTimeout(() => {
  //           const newRows = Array.from((this.table2Body.nativeElement as HTMLElement).children) as HTMLElement[];
  //           if (!newRows.length) return;

  //           this.frame.active_row = this.frame.to_record - 1;

  //           if (this.frame.searchableData) {
  //             const rowActive = this.frame.searchableData[this.frame.active_row]?.[0];
  //             const idc = rowActive?.Level5?.[0]?.indexcount;
  //             if (idc !== null && idc !== undefined) this.frame.active_row = idc;
  //           }

  //           this.frame.rowCount = this.frame.to_record - 1;

  //           container.scrollTop = container.scrollHeight;
  //           const lastEl = newRows[newRows.length - 1];
  //           lastEl.focus?.();

  //           // heavy work after page switch
  //           requestAnimationFrame(() => {
  //             this.runMirrorAndMaybeFocus(name);
  //           });
  //         }, 0);

  //         return;
  //       }
  //     }
  //   }

  //   if (isDown) {
  //     const lastIndex = this.frame.searchableData
  //       ? this.frame.searchableData.length - 1
  //       : this.frame.tableRows.length - 1;

  //     if (this.frame.rowCount !== lastIndex) {
  //       if (this.frame.rowCount < this.frame.to_record - 1) {
  //         // move down within page
  //         idx = Math.min(rows.length - 1, idx + 1);
  //         const nextEl = rows[idx];

  //         this.frame.active_row = rowIdFromTr(nextEl);
  //         this.frame.rowCount = this.frame.rowCount + 1;

  //         nextEl.focus?.();
  //         ensureVisible(nextEl);
  //       } else {
  //         // next page
  //         container.scrollTop = 0;
  //         this.paginate(this.frame.current_page_no + 1);
  //         this.frame.rowCount = this.frame.from_record;

  //         setTimeout(() => {
  //           const newRows = Array.from((this.table2Body.nativeElement as HTMLElement).children) as HTMLElement[];
  //           if (!newRows.length) return;

  //           const firstEl = newRows[0];
  //           this.frame.active_row = rowIdFromTr(firstEl);

  //           container.scrollTop = 0;
  //           firstEl.focus?.();

  //           requestAnimationFrame(() => {
  //             this.runMirrorAndMaybeFocus(name);
  //           });
  //         }, 0);

  //         return;
  //       }
  //     }
  //   }

  //   // -------- HEAVY WORK OUTSIDE KEYDOWN --------
  //   if (this.frame.active_row !== prevActive) {
  //     requestAnimationFrame(() => {
  //       this.runMirrorAndMaybeFocus(name);
  //     });
  //   }
  // }

  // // Extracted heavy part so it can be called from multiple places
  // private runMirrorAndMaybeFocus(name: string) {
  //   // Mirror values
  //   if (this.frame.tableRows && this.frame.tableRows.length > 0) {
  //     const activeRowData = this.frame.tableRows[this.frame.active_row];
  //     if (activeRowData) {
  //       for (const dataRow of activeRowData) {
  //         const level5 = dataRow?.Level5;
  //         if (Array.isArray(level5)) {
  //           for (const r of level5) {
  //             if (r?.mirrored_items) {
  //               this.lhs_lib.set_mirror_values(r);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   // Focus only when edited row matches active row
  //   // if (this.frame.edited_row_id == this.frame.active_row) {
  //   this.lhs_lib.go_item(name, this.frame.active_row);
  //   // }
  // }

   selectedTable2Row(event) {

    let doc: any = document.activeElement;
    if(doc.tagName=='TEXTAREA') {
     return     
    }

    let name = this.frame.apps_page_frame_seqid + "." + doc.id;
    let isInput = false;
    let index;

    if (doc.tagName == "INPUT" && !doc.readOnly && !doc.disabled && doc.type != 'hidden') {
      isInput = true;
      console.log(doc);
    }

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

              index = this.frame.active_row != 0 && this.frame.active_row < this.frame.tableRows.length ? el.previousElementSibling.id.split("--")[1] : this.frame.active_row = 0;
              if (!isInput) {
                this.frame.active_row = index;
              }
              this.frame.rowCount = this.frame.rowCount - 1
            }
            else {
              if (this.frame.current_page_no > 1) {
                this.paginate(this.frame.current_page_no - 1);
                index = this.frame.to_record - 1;
                if (!isInput) {
                  this.frame.active_row = index;
                }
                if (this.frame.searchableData) {
                  let rowActive = this.frame.searchableData[this.frame.active_row][0]
                  if (rowActive.Level5.length > 0) {
                    index = rowActive.Level5[0].indexcount;
                    if (!isInput) {
                      this.frame.active_row = index;
                    }
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
              if (this.frame.rowCount != (this.frame.searchableData ? this.frame.searchableData.length - 1 : this.frame.tableRows.length - 1)) {

                if (this.frame.rowCount < this.frame.to_record - 1) {
                  if (this.frame.tableRows.length - 1 > this.frame.active_row) {
                    if (!(elRect.top >= parRect.top && elRect.bottom <= parRect.bottom - 40 && elRect.bottom + elementHeight <= parRect.bottom - 40)) {
                      if (parRect.height > elRect.bottom)
                        ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
                      else
                        ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom + 40);
                    }
                    if (elRect) {
                      index = parseFloat(el.nextElementSibling.id.split("--")[1]);
                      if (!isInput) {
                        this.frame.active_row = index;
                      }
                      this.frame.rowCount = this.frame.rowCount + 1
                    }
                  }
                  else {
                    index = 0;
                    if (!isInput) {
                      this.frame.active_row = index;
                    }
                    ul.scrollTop = 0;
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

        if (!isInput) {
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

          this.lhs_lib.refresh_frames();
        }

        this.lhs_lib.go_item(name, index);

        // this.cdr.detectChanges();

      }


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
  }


  cbEvent(val, name) {

    let i = 0;
    let str = "";
    let item: any;

    let sys_item = this.lhs_lib.get_rows_item(this.frame.tableRows[0], "sys_" + name);

    let tableRows: any = this.frame.searchableData ? this.frame.searchableData : this.frame.tableRows;
    if (tableRows && tableRows.length > 0) {
      for (let tableData of tableRows) {
        for (let itemGroup_mast of tableData) {
          for (let item_mast of itemGroup_mast.Level5) {
            if (item_mast.item_type == 'CHECK_BOX' && item_mast.item_name == name && !item_mast.extra_record) {
              item_mast.touched = true;
              // item_mast.initialVal = true;


              if (!sys_item && item_mast.item_enable_flag == 'T') {
                if (val) {
                  item_mast.value = item_mast.datatype && (item_mast.datatype.toLowerCase() == 'number') ? "1" : 'Y';
                  item_mast.isValid = true;
                } else {
                  item_mast.value = item_mast.datatype && (item_mast.datatype.toLowerCase() == 'number') ? "0" : 'N';
                  item_mast.isValid = false;
                }

                if (item_mast.item_enable_flag == 'T' && item_mast.click_events_str) {

                  str = str + `app_execute_item('${this.frame.apps_page_frame_seqid}.${item_mast.item_name}','click_events_str', ${i},null,true);`
                }


                if (i < 1) {
                  item = JSON.parse(JSON.stringify(item_mast));
                }
              }
              this.cdEngine.detect(item_mast.apps_item_seqid + '_' + item_mast.indexcount + '#' + this.frame.apps_page_frame_seqid);
            }
          }
        }
        i++
      }
    }
    if (sys_item) {
      item = sys_item;
      if (val) {
        item.value = item.datatype && (item.datatype.toLowerCase() == 'number') ? "1" : 'Y';
        item.isValid = true;
      } else {
        item.value = item.datatype && (item.datatype.toLowerCase() == 'number') ? "0" : 'N';
        item.isValid = false;
      }
      item.itemClicked = 'pre';
    } else {

      if (str) {
        item.itemClicked = 'pre';
        item.click_events_str = str;
      } else {
        item = null;
      }
    }

    // this.cdr.detectChanges();

    if (item?.noExecute) {
      delete item['noExecute'];
      return;
    }

    if (item) {
      this.emitPass.emit(item);
    }

  }
  toggleFrame(COLLAPSE) {
    if (COLLAPSE == 'COLLAPSE') {
      this.frame.collapse = !this.frame.collapse
      // this.cdr.detectChanges();
    }
  }

  toggleTable(x, index, itm) {
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
    // this.cdr.detectChanges();
  }

  removeItemColor(item) {
    this.commonMethod.removeItemColor(item)
    return
  }
  appliedFilters = [];
  icon = "";



  isModalOpen = false
  datas: [];


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
      this.isSingleClick = false;
      clearTimeout(this.timer);
      delete this.clickEvent['singleClicked'];
      delete this.frame['executing_index'];
      this.frame.old_active_row = this.frame.active_row;
      this.frame.active_row = this.clickEvent.indexcount;
      if (this.clickEvent.item_type != "BUTTON" && this.clickEvent.item_type != "FRAME_BUTTON_ICON" &&
        this.clickEvent.item_type != "BUTTON_ICON" && this.clickEvent.item_type != "DOWNLOAD_DOC" &&
        this.clickEvent.item_type != "CHECK_BOX" && this.clickEvent.item_type != "RADIO_BUTTON") {
        this.itemClickData(this.clickEvent, tableData, i)
      }
    }
  }

  // @HostListener("keydown.ArrowLeft", ['$event'])
  backword() {
    if (this.frame.active_row > 0) {
      this.frame.active_row = this.frame.active_row - 1;

    }

  }

  //  @HostListener("keydown.ArrowLeft", ['$event'])
  forword() {
    if (this.frame.active_row < this.frame.tableRows.length - 1) {
      this.frame.active_row = this.frame.active_row + 1;

    }
  }

  ngOnDestroy() {
    this.events.unsubscribe(`rowcountSubscribe#${this.frame.apps_page_frame_seqid}`);
    this.events.unsubscribe(`PageNumberSubscribe#${this.frame.apps_page_frame_seqid}`);
    this.events.unsubscribe(`popupSubscribe#${this.frame.apps_page_frame_seqid}`);
    this.cdEngine.unregister(this.frame.apps_page_frame_seqid);
  }

  clearInputColumn(item) {
    item.search = '%%'
    this.filterColumn(item);
  }


  onSwitch() {

    this.frame.temp_frame_type = this.frame.apps_frame_type;
    // this.frame.temp_frame_type = this.frame.apps_frame_type;
    this.frame.apps_frame_type = 'CARD';
    this.frame.changeFrameType = true;
    if (this.frame.temp_frame_sub_type) {
      this.frame.apps_frame_sub_type = this.frame.temp_frame_sub_type
    }
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

  columnFilterEmitPass(event) {
    this.emitPass.emit(event)
  }


  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.frame.search = res;
    });
  }
  onRightClick(event, tableData) {

    event.preventDefault();
    event.stopPropagation();

    this.globalObjects.mouseEvent = event;

    if (tableData && this.isRightItemsFlag) {
      let arr = [];
      let itm;
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
      this.cdEngine.detect(this.frame.apps_page_frame_seqid);
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


  // Keep this in your EntryTable component class

  readonly EMPTY_STYLE: any = {};

  trackByCanvasRow = (_: number, tableData: any) =>
    tableData?.[0]?.Level5?.[0]?.indexcount ?? _;

  trackByItemGroup = (i: number, itemGroup: any) =>
    itemGroup?.Level5?.[0]?.apps_item_seqid ?? i;

  trackByInputItem = (i: number, input_item: any) =>
    input_item?.apps_item_seqid ?? input_item?.indexcount ?? i;


  private isAFrameMode = false;



  rowDomId(tableData: any) {
    // cache this on row vm if possible
    const idx = tableData?.[0]?.Level5?.[0]?.indexcount ?? 0;
    return `${this.frame.apps_page_frame_seqid}--${idx}`;
  }

  isActiveRow(tableData: any) {
    const idx = tableData?.[0]?.Level5?.[0]?.indexcount;
    return idx != null && this.frame.active_row === idx;
  }

  isFrameSeparator(g: any) {
    return g?.Level5?.[0]?.item_type === 'FRAME_SEPARATOR';
  }

  isTextCell(c: any) {
    const t = c?.item_type;
    let flag = t === 'TEXT' || t === 'TEXT_DISPLAY' || (t === 'TEXT_INPUT' && this.frame.active_row !== c.indexcount);
    return flag;
  }

  isCellVisible(c: any) {
    if (!c) return false;
    if (c.item_visible_flag !== 'T') return false;
    if (c.item_type === 'FRAME_BUTTON_ICON' || c.item_type === 'RIGHT_CLICK') return false;
    if (c.item_type === 'ADD_ROW_BT' || c.item_type === 'DELETE_ROW_BT') return false;

    const mode = this.current_page_parameter?.MODE;
    if (mode && (!c.item_visible_flag || c.item_visible_flag.indexOf(mode) === -1)) return false;

    return true;
  }

  cellStyle(c: any) {
    return c.freezStyle || c.display_setting_str || null;
  }

  cellClass(c: any, isApplyOn?) {
    // For best performance, cache by apps_item_seqid (otherwise new object each CD)
    return {
      'wrap-text': this.frame.isTextWrapped,
      'nowrap-text': !this.frame.isTextWrapped,
      'num-right': String(c.datatype).toUpperCase() === 'NUMBER',
      ['colorCss' + c.apps_item_seqid]: true,
      ['freezeCss' + c.apps_item_seqid]: true,
      'columnIsClickEventStr': (isApplyOn != 'header' && isApplyOn != 'footer') && (!!c.orignal_click_events_str && !this.isAFrameMode && !c.dimensionItem && (c.item_type === 'TEXT' || c.item_type === 'TEXT_DISPLAY')),
      'activetable_summaryspan': isApplyOn == 'footer' && c.summItemStyle
    };
  }
  titleToolTip(c: any) {
    return c.tool_tip || null;
  }
  isNotFormareMask(c: any) {
    if (c.datatype == 'DATE' || c.datatype == 'DATETIME' || c.datatype == 'TIME') {
      return true;
    }
    return false;
  }

  aiInputDataChange(event) {
    this.aiInputData = event;
  }
}



