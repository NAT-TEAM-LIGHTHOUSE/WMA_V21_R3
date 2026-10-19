import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { cloneDeep } from 'lodash';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { ProcessDataService } from 'src/app/services/process-data.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { DatePipe, isPlatformServer } from '@angular/common';
import { Events } from 'src/app/services/events';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';
import { TreeTableModule } from 'primeng/treetable';
import { FormatMaskPipe } from 'src/app/pipes/format-mask-pipe';
// import { FormatMaskPipe } from 'src/app/pipes/format-mask.pipe';
export enum KeyCodes {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40
}

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent,TreeTableModule,FormatMaskPipe],
  selector: 'app-frame-tree-table',
  templateUrl: './frame-tree-table.component.html',
  styleUrls: ['./frame-tree-table.component.scss'],
})
export class FrameTreeTableComponent implements OnInit, OnDestroy {

  @ViewChild('treeBody') table2Body: any;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  wscp = {}
  userDetails: any;
  developerModeData: any;
  selectedNodes1: TreeNode[];
  loading: boolean = false;
  files: TreeNode[];
  level: any = 0;
  cols: any[] = [];
  frozenCols: any[] = [];
  scrollableCols: any[] = [];
  flag: boolean = true;
  selectedColumns: any[];
  selected: any;
  highlighted: any;
  status: boolean = false;
  colFlag: boolean = false;
  titleName: any
  files1: TreeNode[];
  selectedNode1: TreeNode;
  searchText: any;
  item_search_flag: boolean = false;
  searchFlag: boolean = false;
  styleObject = { 'max-height': '100%', 'overflow': 'hidden' };
  // colorArr = ["#e8f5ff", "#c3e3fd", "#9acef8", "#6eb8f5", "#8fe3ff", "#48CCCD", "#AAF0D1"];
  colorArr = {
    // "theme-blue": ["transparent", "#b5d2e7", "#9bc5e2", "#c5d9e1", " #aacde0", "#d5e7f559", " #b4cee094", "#aacedf47", " #d5e8f147", "#e9f8ff47", "#a5e2ff47"],
    "theme-blue": ["#ffffff", "#A4C3FF", "#C6D9FF", "#E2ECFF", " #eaf1fd", "#eff4ff", " #E2ECFF", "#e9f0fc", " #E2ECFF", "#e9f1ff", "#E2ECFF"],
    "theme-navyblue": ["#caf4e3", "#b6e4d2", "#a4d5c0", "#7ab59d", "#67a68c", "#3e876580", "#02592ea8"],
    "theme-dark": ["#ffffff", "#0f060675", "#200b0b9e", "#70757a9e", "#22222254", "#65000057", "#614500a3", "#1a212b91", "#4358528c"],
    "theme-maroon": ["#ffffff", "#e0373a73", "#ec4a48ba", "#eb7073a6", "#eaccccd9", "#9d101da1", "#830e1499"],
    "theme-grey": ["#ffffff", "#11111154", "#33333385", "#5555554f", "#999999a6", "#babfc8a8", "#d6d6d6c2", "#413d3e8f"],
    "theme-brown": ["#ffffff", "#d3a56ca6", "#cd8b5478", "#bc7e48b8", "#97623d57", "#fcc4937d", "#cb8f6b45", "#5d41387d", "#3c271e12"],
    "theme-dark-green": ["#ffffff", "#a8d9c6", "#b0dab2b3", "#bfe1c9", "#d5e59e", "#d5e59e99", "#36461f82", "#0f3a1e91", "#106037a1"]
  }
  isTreeRowShort: boolean = true;
  value = 0;
  divStyle = '';
  pdfheads = [];
  footerRowFlag: boolean = false;
  excelHeading: any;
  excelheads: any = {};
  summaryRow: any[];
  l_where_str: any;
  l_total_rows: number;
  thead: any = {};
  tab: any;
  selectedExportDataType = "selectData"
  fileTyle = "pdf"
  clickShare: boolean = false;
  width: number;
  height: number;
  selectedRow: any;
  plt: any = 'browser';
  isNotExport: boolean = false
  isNotExportPdf: boolean = false
  isNotExportExcel: boolean = false
  isNotExportCsv: boolean = false
   @ViewChild('tt') tt: any;
  constructor(public globalObjects: GlobalObjectsService, public modalController: ModalController, private processData: ProcessDataService, private event: Events, private commonMethod: CommonMethodService,
    private dataService: DataService, public platform: Platform, private lhs_lib: LhsLibService, private http: HttpClient, private datePipe: DatePipe,@Inject(PLATFORM_ID) private platformId: Object) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "frame-tree-table")
    }
  }

  ngOnDestroy(): void {
    this.event.unsubscribe(this.frame.apps_page_frame_seqid);
  }

  ngOnInit() {

    if (this.platform.is('android') || this.platform.is('ios')) {
      this.plt = this.platform;
    }

    this.frame.active_row = 0;
    let exelHeads: any = [];
    let pdfHeads: any = [];
    let theaddata: any = [];

    for (let itemGroup of this.frame.Level4) {
      this.frame.frameTableData = this.frame.tableData;

      for (let item of itemGroup.Level5) {
        let obj = item;
        obj.search = '';
        obj.field = item.item_name;
        obj.header = item.prompt_name;
        obj.freezCol = {}
        if (obj.item_visible_flag == 'T') {
          this.cols.push(obj);
           if (item.item_type == 'BT' || item.item_type == 'DISPLAY_PHOTO' || item.item_type == 'BUTTON_ICON' || item.item_type == 'DOWNLOAD_DOC' || item.item_type == 'FRAME_SEPARATOR' || item.item_type == 'FRAME_BUTTON_ICON' || item.item_type =='RIGHT_CLICK')  {
          }else{
            theaddata.push(item.prompt_name);
            pdfHeads.push(item.prompt_name);
          }
        }

        this.titleName = item.prompt_name
      }
    }
    this.selectedColumns = this.cols;


    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split(";") : null;
    if (frameFilterFlag) {
      for (let x of frameFilterFlag) {
        if (x.toUpperCase() === 'SEARCH_BAR') {
          this.searchFlag = true;
          if (!this.frame.search) {
            this.frame.search = "";
          }
        }

        if (x.toUpperCase() === 'IS') {
          this.item_search_flag = true;
          this.frame.item_search_flag = true;
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
    }


    this.developerModeData = {
      ws_seq_id: "",
      frame_seq_id: this.frame.apps_page_frame_seqid
    };
    this.thead = theaddata;
    this.frame.tHead = theaddata;
    this.pdfheads = pdfHeads;
    this.excelheads = theaddata;

    if (this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1) {
      this.frame.collapse = false;
      this.frame.showCollapse = true;
    } else {
      this.frame.collapse = true;
      this.frame.showCollapse = false;
    }

    if (this.frame.tableData) {
      let data = JSON.parse(JSON.stringify(this.frame.tableData));
      data = data.map((x, i) => {

        return { ...x, 'ROWNUMBER': i };
      });
      this.displayTreeTable(data);
    }
    this.event.unsubscribe(this.frame.apps_page_frame_seqid);
    this.event.subscribe(this.frame.apps_page_frame_seqid, () => {
      this.files = [];
      this.cols = [];
      this.ngOnInit();
    })
  }

  public getJSON() {
    let data = this.http.get("./assets/tableNew.json").subscribe(data => {
      data = data
      // This will print false.
    })
  }

  convertToHierarchy(arry: string | any[]) {
    var nodeObjects = this.createStructure(arry);
    for (var i = nodeObjects.length - 1; i >= 0; i--) {
      var currentNode = nodeObjects[i];
      if (currentNode.data.PARENT_CODE === "") {
        continue;
      }
      var PARENT_CODE = this.getParent(currentNode, nodeObjects);

      if (PARENT_CODE === null) {
        continue;
      }

      currentNode.isChild = true;
      PARENT_CODE.children.push(currentNode);
    }
    return nodeObjects;
  }

  // removeChilds(arr) {
  //   let oldArr = structuredClone(arr);
  //   let newArr = [];
  //   for (let a of oldArr) {
  //     if (!a.isChild) {
  //       newArr.push(a);
  //     }
  //   }
  //   return newArr;
  // }

  removeChilds(arr) {
    const oldArr = structuredClone(arr);
    return oldArr.filter(a => !a.isChild);
  }


  countChild(arry) {
    let funArr = [];
    for (let item of this.cols) {
      if (item.summary_flag) {
        this.frame.summary_flag = true;
        let sumArr = [];
        if (item.summary_flag.includes(';')) {
          sumArr = item.summary_flag.split(';')
        } else {
          sumArr[0] = item.summary_flag;
        }
        for (let s of sumArr) {
          let summFlag = s.includes("#") ? s.split("#")[0] : s;
          let decimal = s.includes("#") ? s.split("#")[1] : 0;
          if (summFlag == 'S' || summFlag == 'A' || summFlag == 'C' || summFlag == 'M' || summFlag == 'X') {
            let obj = {
              fun: summFlag,
              decimal: decimal,
              dataType: item.datatype,
              item_name: item.item_name.toUpperCase()
            }
            funArr.push(obj);
          }
        }
      }
    }

    if (funArr.length > 0 && this.frame.tableData) {
      let data = this.processData.calculateData(JSON.parse(JSON.stringify(this.frame.tableData)), funArr);
      if (data) {
        let keys = Object.keys(data);
        for (let col of this.cols) {
          for (let key of keys) {
            if (col.item_name == key) {
              col.summaryValue = data[key];
            }
          }
        }
      }
    }
  }

  createStructure(nodes: string | any[]) {
    var objects = [];
    for (var i = 0; i < nodes.length; i++) {
      objects.push({ data: nodes[i], children: [] });
    }
    return objects;
  }

  getParent(child: { data: any; children?: never[]; }, nodes: string | any[]) {
    var PARENT_CODE = null;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].data.CHILD_CODE === child.data.PARENT_CODE) {
        return nodes[i];
      }
    }
    return PARENT_CODE;
  }

  postOrder(root: any) {
    if (root.children) {
      root.children.forEach((child: any) => {
        root.DRAMT += this.postOrder(child);
      });
    }
    root.DRAMT = root.DRAMT + root.DRAMT;
    return root;
  }

  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.object_code = this.frame.object_code;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_working_mode = this.wscp_send_input.apps_working_mode;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.orignal_apps_item_seqid = this.wscp_send_input.orignal_apps_item_seqid;
    wscp.origin_apps_item_seqid = this.wscp_send_input.origin_apps_item_seqid;
    this.wscp = wscp;
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    let wsdp
    if (wscp.service_type == "execute_query") {

      wsdp = this.lhs_lib.getWsdp("").wsdp;
    } else {
      wsdp = this.wsdp;
    }

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": this.wsdpcl
    }

    let l_url = "S2U";
    let tableData: any;

    this.dataService.postData(l_url, reqData).then(res => {
      let data: any = res;

      if (data.responseStatus && data.responseStatus.includes("success")) {
        // Developer Mode Loging

        let objData;
        if (data.responseStatus.toLowerCase().includes("-rc")) {

          objData.Level1 = this.globalObjects.setPageInfoNoS2U(data.responseData);

        } else {

          //Developer Mode Loging
          objData = this.globalObjects.setPageInfo(data.responseData);
        }

        tableData = objData.Level1;
        this.frame.tableData = tableData;
        this.displayTreeTable(JSON.parse(JSON.stringify(this.frame.tableData)));
        console.log("Frame Tree Table Data", objData)
      }
    }).catch(err => {
      this.globalObjects.presentToast("1.5 Something went wrong please try again later!");
    })
  }

  collapseNodes(nodes: any) {
    for (let node of nodes) {
      node.expanded = false;
    }
  }

  expandNodes(nodes: any) {
    for (let node of nodes) {
      node.expanded = true;
    }
  }

  onExpandOneLevel() {
    console.log(this.files);
    if (this.level === 0) {
      this.expandNodes(this.files);
    }

    for (var i = 0, arr2 = Array(this.files.length); i < this.files.length; i++) {
      arr2[i] = this.files[i];
    }
    this.files = arr2;
  }

  onCollapseOneLevel() {
    if (this.level === 0) {
      this.collapseNodes(this.files);
    }
    for (var i = 0, arr2 = Array(this.files.length); i < this.files.length; i++) {
      arr2[i] = this.files[i];
    }
    this.files = arr2;
  }

  public expandAll(): void {
    const temp = cloneDeep(this.files);
    temp.forEach((node: TreeNode) => {
      this.expandCollapseRecursive(node, true);
    });
    this.files = temp;
  }

  public collapseAll(): void {
    const temp = cloneDeep(this.files);
    temp.forEach(node => {
      this.expandCollapseRecursive(node, false);
    });
    this.files = temp;
  }

  private expandCollapseRecursive(node: TreeNode, isExpand: boolean): void {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandCollapseRecursive(childNode, isExpand);
      });
    }
  }

  toObject(names: any, values: any) {
    var result = new Array;
    for (var i = 0; i < names.length; i++)
      result[names[i]] = values[i];
    return result;
  }

  displayTreeTable(data) {
    if (data && data.length > 0) {
      console.log(data);

      let i = 0;
      let res = data.map((d: any) => {
        i++;

        const getSum = (obj: { [x: string]: any; CHILD_CODE: any; }, prop: string) => {
          const children = data.filter(({ PARENT_CODE }: any) => PARENT_CODE === obj.CHILD_CODE)
          if (children.length === 0) return (typeof (obj[prop]) == 'string' ? obj[prop] : (obj[prop]).toString());
          return children.reduce((acc: string, c: { [x: string]: any; CHILD_CODE: any; }) => parseFloat(acc) + parseFloat(getSum(c, prop))

            , 0) + "#" + children.length
        }

        if (this.cols && this.cols.length > 0) {
          for (let i = 0; i < this.cols.length; i++) {
            if (this.cols[i].field.startsWith("COL")) {
              let result;
              if (d[this.cols[i].field]) {
                if (this.cols[i].summary_flag && this.cols[i].summary_flag.includes('PS')) {
                  result = getSum(d, this.cols[i].field).split("#");
                  d[this.cols[i].field] = Math.round(parseFloat(result[0]));
                  d["COUNT1"] = parseFloat(result[1]);
                } else {
                  result = d[this.cols[i].field];
                  d[this.cols[i].field] = Math.round(parseFloat(result));
                  d["COUNT1"] = parseFloat(result);
                }

              }
            }
          }
        }
        return {
          ...d
        }
      })
      // console.log("check display tree table data valueeeeeeeeeesssssss",res);
      let filesArr = this.convertToHierarchy(res);
      for (let obj of filesArr) {
        if (obj.children) {
          obj.children.reverse();
        }
        // this.files = this.removeChilds(filesArr);

      }
      this.files = this.removeChilds(filesArr);
      console.log(this.files);
      this.countChild(this.files);
    }
  }

  clickEvents(i, isTrue) {
    console.log(isTrue)
    let status: boolean = false;
    status = !status;
    let arr = [];
    for (let j = 0; j < this.cols.length; j++) {
      if (j <= i) {
        let w = document.getElementById("fixWidth" + j);
        let leftCol = w.offsetLeft;
        this.cols[j].headFreezCol = {
          "left": leftCol + "px",
          "z-index": "9999",
          "position": "sticky",
          "padding": "0px 0px 0px 5px",
          "margin": "auto"

        }
        this.cols[j].freezCol = {
          "text-align": this.cols[j].datatype == "NUMBER" ? "right" : '',
          "left": leftCol + "px",
          "z-index": "9999",
          "position": "sticky",
          "padding": "0px 0px 0px 5px",
          "margin": "auto",

        }
        if (isTrue) {
          this.cols[j].isTrue = false;
        } else {
          this.cols[j].isTrue = true;
        }
      } else {
        if (isTrue) {
          this.cols[j].isTrue = false;
        }
        if (this.cols[j].isTrue) {
          console.log(this.cols[j].isTrue)
        } else {
          this.cols[j].freezCol = {}
          this.cols[j].headFreezCol = {}
          this.cols[j].isTrue = false;
        }
      }
    }
    // this.cdr.detectChanges();
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

  toggleFrame() {
    this.frame.collapse = !this.frame.collapse
  }


  getBackground(index, rowData) {
    if (this.selectedRow == JSON.stringify(rowData)) {
      return 'background: #a2cdff';
    } else {
      if (index >= '1') {
        return 'background:' + this.colorArr[this.globalObjects.appTheme][index] + '!important';
      }
    }
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
            if (trows2.Level5[0].item_type == 'BT' || trows2.Level5[0].item_type == 'DOWNLOAD_DOC' || trows2[0].item_type == 'BUTTON_ICON') {
            } else {
              if (trows2.Level5[0].item_type == "DISPLAY_PHOTO") {
                if (trows2.Level5[0].value) {
                  im.push(trows2.Level5[0].value);
                } else {
                  im.push("");
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
            if (trows2[0].item_type == 'BT' || trows2[0].item_type == 'DOWNLOAD_DOC' || trows2[0].item_type == 'BUTTON_ICON') {
            } else {
              if (trows2[0].item_type == "DISPLAY_PHOTO") {
                if (trows2[0].value) {
                  im.push(trows2[0].value);
                } else {
                  im.push("");
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
              if (item.item_type == 'BT' || item.item_type == 'DISPLAY_PHOTO' || item.item_type == 'BUTTON_ICON' || item.item_type == 'DOWNLOAD_DOC' || item.item_type == 'FRAME_SEPARATOR') {
              } else {
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

          if (cell.value.toString().split("~")[1] == "NUMBER") {
            cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
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

          if (cell.value.toString().split("~")[1] == "NUMBER") {
            cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
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
  selectFile(type) {
    this.fileTyle = type
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

  getShare(event) {
    this.clickShare = false;
    this.getDataForGraph('pdf', event);
  }

  cancelExport() {
    this.clickShare = false
  }
  confirmExport() {
    this.clickShare = false
    this.getDataForGraph(this.fileTyle, '')
    this.selectedExportDataType = "selectData"
  }

  onResized(event) {
    console.log(event)
    if (event.delta < 0) {
      if (event.element.id) {
        let id = event.element.id.replace('fixWidth', '');
        let col = this.cols[parseFloat(id) + 1];
        if (col.isTrue) {
          let left = col.freezCol.left;
          let leftCol = left.replace('px', '');
          let remLeft = eval(leftCol + event.delta);
          col.freezCol.left = remLeft + 'px';
          col.headFreezCol.left = remLeft + 'px';
          this.cols;
          // this.cdr.detectChanges();
        }
      }
    }
  }

  fn() {
    let card = document.querySelector('p-element texstClass');
    console.log(card)

    card.addEventListener('dblclick', (e) => {
      card.classList.toggle('large');
    });
  }


  rowEvent(rowData) {
    this.selectedRow = JSON.stringify(rowData);
  }


  doubleClick(rowNode, rowData, field) {
    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = rowData['ROWNUMBER'];
    let event: any = {};
    let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))

    for (let itemGroup of frameLevel4) {
      for (let item of itemGroup.Level5) {
        if (item.item_name == field) {
          event = item;
        }
        if (rowData[item.item_name] != undefined) {
          item.value = rowData[item.item_name];
        }
      }
    }

    let col = {};
    if (frameLevel4 && frameLevel4.length > 0) {
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else if (item.value) {
              col[item.apps_item_seqid] = item.value
            } else {
              col[item.apps_item_seqid] = ""
            }
          }
        }
      }
    }
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.emitPass.emit(event);

  }

  keyUp(rowData) {
    this.selectedRow = JSON.stringify(rowData)
  }

  keyDown(e, rowNode) {
    var keynum;
       if (isPlatformServer(this.platformId)) return;
    if (window.event) { // IE
      keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera
      keynum = e.which;
    }

    if (e.keyCode == 39) {
      if (rowNode.node.children.length > 0) {
        e.preventDefault();
      }
    }
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
  keepTreeScroll() {
  const host = this.tt?.el?.nativeElement;

  const scrollBody =
    host?.querySelector('.p-treetable-wrapper') ||
    host?.querySelector('.p-treetable-scrollable-body');

  if (!scrollBody) return;

  const scrollTop = scrollBody.scrollTop;

  setTimeout(() => {
    scrollBody.scrollTop = scrollTop;
  }, 0);
}
}
