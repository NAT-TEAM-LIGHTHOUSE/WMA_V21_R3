import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular/standalone';
import { TableSearchPipe } from 'src/app/pipes/table-search.pipe';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FrameCanvasFilterComponent } from '../frame-canvas-filter/frame-canvas-filter.component';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,TableSearchPipe,FrameCanvasFilterComponent],
  selector: 'app-frame-summary-card-detail',
  templateUrl: './frame-summary-card-detail.component.html',
  styleUrls: ['./frame-summary-card-detail.component.scss'],
})
export class FrameSummaryCardDetailComponent implements OnInit,OnDestroy {

  @Input() frame: any = {};
  @Input() resforgraph: any = {};

  tablerowsfilter:any;
  flagtoruncanvasfilter: boolean;
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitForPdf: EventEmitter<any> = new EventEmitter<any>();
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
  flagforgraph: boolean = false;

  filterFormData: any = [];


  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;

  loadMoreFlag: string;
  summaryRow: any[];
  pdfHeading: any;

  show_filter: any = 'dontshow';
  graphFlag: any = false;
  searchFlag: any = false;
  pdfFlag: any = false;
  getcanvasWCP: boolean = false;
  filter:boolean = false;
  toggleFilter:boolean =false;


  callingObjectArr: any = [];
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, private lhs_lib:LhsLibService
    , public loadingController: LoadingController, public modalCtrl: ModalController, private events: Events) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.tbodyHeight = (document.body.clientHeight - 210) + 'px';
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-summary-card-detail")
    }
  }

  ngOnDestroy(): void {
    this.events.unsubscribe("skipFilter");
    let bullName = "wmaBultins" + this.frame.apps_page_frame_seq_id;
    this.events.unsubscribe(bullName);
  }
  ngOnInit() {
    this.events.subscribe("skipFilter", () => {
      this.filter = false;
      this.toggleFilter = false;
    });

  let bullName = "wmaBultins" + this.frame.apps_page_frame_seq_id;
  this.events.unsubscribe(bullName);
  this.events.subscribe(bullName, res => {
    if(res.evFlag == "T"){
      res.evFlag = "F";
      this.parseBuiltins(res.key);
    }
  })

    let frameFilterFlag = this.frame.frame_filter_flag;
    if (frameFilterFlag) {
      if (frameFilterFlag.indexOf("S") > -1) {
        this.searchFlag = true;
      }
      if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1  || frameFilterFlag.indexOf("A") > -1) {
        this.filter = true;
      }
    }

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
          theaddata.push(itemMast);
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }

    }
    this.thead = theaddata;
    this.parseBuiltins(0);
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
      this.paginate(1,service_type,key)
    }else{
      if(service_type){
        this.globalObjects.bulitinsEvent(service_type, key, this.frame.apps_page_frame_seqid,this.frame.on_frame_load_str);
      }
    }
  }

  getdataFromcanvasFilter(event) {
    this.getcanvasWCP = true;
    let array = [];
    this.filter = false;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;

    array = event.where_str;

    this.l_where_str = [];
    if(array.length > 0){
      for (let data of array) {
        this.l_where_str += data + "  ";
      }
    }
    else{
      this.l_where_str = "";
    }
    this.frame.l_where_str=this.l_where_str;
    this.paginate(1);
  }

  filterToggle() {
    if (this.show_filter == 'show') {
      this.show_filter = 'dontshow';
    }
    else {
      this.show_filter = 'show';
      let frameFilterFlag = this.frame.frame_filter_flag;
    if (frameFilterFlag) {

      if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1 || frameFilterFlag.indexOf("A") > -1) {
        this.toggleFilter = true;
      }

    }
    }
  }


  itemValueChange(event, rowindex) {
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
                col[item.apps_item_seqid] = item.value
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
  }

  getDependentData(event, rowindex) {
    this.globalObjects.showLoading();
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

      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {

        let data: any = res;
        if (data.responseStatus == "success") {
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
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }


    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {

      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
       
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
          alert(objData.Level1[0].message);
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

      this.globalObjects.presentToast("1.11 Something went wrong please try again later!");
    })
  }

  paginate(a_current_page:number,service_type?, bull_Key?) {
    let l_total_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
    let L_total_pages = this.l_total_rows / this.frame.no_of_records;

    if (a_current_page < 1) {
      a_current_page = 1;
      this.tableRows = [];
    } else if (a_current_page > l_total_pages) {
      a_current_page = l_total_pages;
    }

    let l_from_row: number = null;
    let l_to_row: number = null;

    if (l_total_pages > 0 && a_current_page == 1) {
      this.tableRows = [];
      l_to_row = Math.ceil(this.l_total_rows / L_total_pages);
    }
    else {
      l_to_row = Math.ceil(this.l_total_rows / L_total_pages) * a_current_page;
    }

    l_from_row = Math.ceil((l_to_row - this.frame.no_of_records)) + 1;

    this.c_from_row = l_from_row;
    this.c_to_row = l_to_row;
    this.getData(l_from_row, l_to_row, a_current_page, service_type, bull_Key);
  }



  getData(a_from_row: number, a_to_row: number, a_currentPage: number,service_type?,bull_Key?) {
    this.globalObjects.showLoading();
    let wscp: any = {};
    wscp.object_code = this.frame.object_code;
    wscp.service_type = service_type ? service_type : this.frame.on_frame_load_str ;
    wscp.from_row = String(a_from_row);
    wscp.to_row = String(a_to_row);
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;

    if (this.l_where_str && this.getcanvasWCP) {
      wscp.where_str = this.l_where_str;
    } else if (this.l_where_str && this.filter) {
      wscp.where_str = this.l_where_str.join(" ");
    } else if (this.l_where_str && this.flagtoruncanvasfilter) {
      wscp.where_str = this.l_where_str;
    } else {
      wscp.where_str = null;
    }

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      let data: any = res;
      this.resforgraph = data;

      this.resforgraph.Level4 = JSON.parse(JSON.stringify(this.frame.Level4));
      this.resforgraph.flag = this.frame.flag;
      if (data.responseStatus && data.responseStatus.includes("success")) {
        // Developer Mode Loging

        let objData;
        if (data.responseStatus.toLowerCase().includes("-rc")) {

          objData.Level1 = this.globalObjects.setPageInfoNoS2U(data.responseData);

        } else {
          objData = this.globalObjects.setPageInfo(data.responseData);
        }

        // For Getting *CALLING_OBJECT_CODE* from Frame //
        this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //

        let tableData = objData.Level1;
        if (tableData && tableData.length > 0) {
          let tableKey = Object.keys(tableData[0])
          this.l_total_rows = tableData[0].TOTAL_ROWS;
          for (let table of tableData) {
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                for (let key of tableKey) {
                  if (item.item_name.toUpperCase() == key.toUpperCase()) {
                    item.value = table[key];
                  }
                }
              }
            }
            this.tableRows.push(frameLevel4);
          }

          if (this.frame.flagtoclosefilter) {
            this.show_filter = "show";
            this.filterToggle();
          }

          var lastRow: any = [];
          var maxMinNum = [];
          var avg = [];
          for (let i = 0; i < this.thead.length; i++) {
            for (let itemDataArr of this.tableRows) {
              for (let item of itemDataArr) {
                if (item.Level5[0].summary_flag == 'SUM' || item.Level5[0].summary_flag == 'COUNT' || item.Level5[0].summary_flag == 'AVG' || item.Level5[0].summary_flag == 'MAX' || item.Level5[0].summary_flag == 'MIN') {
                  if (item.Level5[0].summary_flag == 'SUM' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (lastRow[i]) {
                      lastRow[i] = "Sum : " + (parseFloat(lastRow[i].split(":")[1]) + parseFloat(item.Level5[0].value)).toFixed(2);
                    }
                    else {
                      lastRow[i] = "Sum : " + parseFloat(item.Level5[0].value);
                    }
                  }
                  else if (item.Level5[0].summary_flag == 'AVG' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (item.Level5[0].value) {
                      avg.push(parseFloat(item.Level5[0].value));
                      var sum = 0;
                      for (var j = 0; j < avg.length; j++) {
                        sum += parseInt(avg[j], 10); //don't forget to add the base
                      }
                      lastRow[i] = "Average: " + sum / avg.length;
                    }
                  }
                  else if (item.Level5[0].summary_flag == 'COUNT' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (lastRow[i]) {
                      lastRow[i] = "Count : " + Math.round(parseFloat(lastRow[i].split(":")[1])) + parseFloat(item.Level5[0].value);
                    }
                    else {
                      lastRow[i] = "Count :" + 1;
                    }
                  }
                  else if (item.Level5[0].summary_flag == 'MAX' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (item.Level5[0].value) {
                      maxMinNum.push(parseFloat(item.Level5[0].value));
                      lastRow[i] = "Max : " + Math.max.apply(null, maxMinNum);
                    }
                  }
                  else if (item.Level5[0].summary_flag == 'MIN' && item.Level5[0].prompt_name == this.thead[i]) {
                    if (item.Level5[0].value) {
                      maxMinNum.push(parseFloat(item.Level5[0].value));
                      lastRow[i] = "Min : " + Math.min.apply(null, maxMinNum);
                    }
                  }
                }
                else {
                  if (lastRow[i]) {

                  }
                  else {
                    lastRow[i] = "";
                  }

                }
              }
            }
          }
          this.summaryRow = lastRow;
        }
        // -----------------Ranjeet coding for sorting----------------
        let finalDisplayTable = []

        for (let data of this.tableRows) {
          let finalTableRow: any = [];
          let finalDataRow = [];
          for (let temp of data) {
            if (temp.Level5) {
              for (let d of temp.Level5) {
                if (d.item_visible_flag == 'F' && d.item_name != "ROWNUMBER") {
                }
                else {
                  finalDataRow.push(temp.Level5);
                }
              }
            }
          }
          finalTableRow = finalDataRow;
          finalDisplayTable.push(finalTableRow);
        }
        this.frame.tableRows = finalDisplayTable;
        // ---------------------------------------------------------------

        this.verticaldata();
        this.pdfHeading = this.frame.apps_page_frame_name;

        this.l_current_page = a_currentPage;
        if (this.l_current_page == 1) {
          this.c_to_row = Math.ceil(this.l_total_rows / (this.l_total_rows / this.frame.no_of_records));
          if (this.frame.no_of_records > 0) {
            this.l_total_remain_pages = Math.ceil(this.l_total_rows / this.frame.no_of_records);
          } else {
            this.l_total_remain_pages = 1;
          }
          this.c_from_row = Math.ceil((this.c_to_row - this.frame.no_of_records)) + 1;
          this.loadMoreFlag = "false";
        }
      }
      this.parseBuiltins(bull_Key + 1);
    }).catch(err => {
      this.parseBuiltins(bull_Key + 1);
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
    })
  }

  verticaldata() {
    this.frame.verticalTable = this.globalObjects.transpose(this.frame.tableRows);
  }

  itemClicked(event,rowsdata, i) {
    event.callingObjectArr = this.callingObjectArr;
    event.wsdp = [];
    let col = {};
    delete this.frame['executing_index'];
    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow[0].item_name == "ROWNUMBER") {
        rowindex = dataRow[0].value - 1;
      }
    }
    if(!rowindex){
      rowindex = i;
    }
    for (let itemGroup of this.frame.tableRows[i]) {
      if (itemGroup) {
        for (let item of itemGroup) {
          col[item.apps_item_seqid] = item.value
        }
      }
    }
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    event.itemIndex = rowindex;

    this.emitPass.emit(event);
  }



  //-------table order by start
  thClick(th, i) {
    this.orderByParam.th = th;
    this.orderByParam.index = i;
    if (this.orderByParam.direction > 0) {
      this.orderByParam.direction = -1;
    } else {
      this.orderByParam.direction = 1;
    }

    this.frame.tableRows = this.frame.tableRows.sort((a, b) => {
      if (a[i][0].datatype == 'NUMBER') {
        a[i][0].value = a[i][0].value ? a[i][0].value : 0;
        b[i][0].value = b[i][0].value ? b[i][0].value : 0;
        if (parseFloat(a[i][0].value) < parseFloat(b[i][0].value)) {
          return -1 * this.orderByParam.direction;
        } else if (parseFloat(a[i][0].value) > parseFloat(b[i][0].value)) {
          return 1 * this.orderByParam.direction;
        } else {
          return 0;
        }
      }
      else {
        a[i][0].value = a[i][0].value ? a[i][0].value : "";
        b[i][0].value = b[i][0].value ? b[i][0].value : "";
        if (a[i][0].value < b[i][0].value) {
          return -1 * this.orderByParam.direction;
        } else if (a[i][0].value > b[i][0].value) {
          return 1 * this.orderByParam.direction;
        } else {
          return 0;
        }
      }
    });
  }
  //-------table order by end

  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
    this.getdataFromcanvasFilter(event);
  }

  updateScroll(scrollOne: HTMLElement, scrollTwo: HTMLElement, scrollThree: HTMLElement, flag: any) {
    // do logic and set
    if (flag === 3) {
      scrollTwo.scrollLeft = scrollThree.scrollLeft;
      scrollOne.scrollLeft = scrollThree.scrollLeft;
    }
    else if (flag === 2) {
      scrollOne.scrollLeft = scrollTwo.scrollLeft;
      scrollThree.scrollLeft = scrollTwo.scrollLeft;
    }
    else if (flag === 1) {
      scrollTwo.scrollLeft = scrollOne.scrollLeft;
      scrollThree.scrollLeft = scrollOne.scrollLeft;
    }
  }
 
  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.searchText = res;
    });
  }

  openbarcodescanner() {
    this.globalObjects.barcodescanner().then(res => {
      this.searchText = res;
    });
  }

  doInfinite(infiniteScroll): Promise<any> {
    return new Promise(() => {
      setTimeout(() => {
        this.paginate(this.l_current_page + 1);
        infiniteScroll.complete();
      }, 900);
    })
  }

  goToLast(lastRow, l_current_page) {
    this.l_current_page = l_current_page;
    this.tableRows = [];
    this.getData(1, lastRow, l_current_page);
  }

  downloadPDF() {
    let data: any = [];
    let count: number = 0;
    let array: any = [];
    array[0] = [];
    array[0] = (JSON.parse(JSON.stringify(this.thead)))
    for (let trows of this.frame.tableRows) {
      count++;
      for (let trows2 of trows) {
        data.push(trows2[0].value);
      }
      array[count] = [];
      array[count] = (JSON.parse(JSON.stringify(data)));
      data = [];

    }
    let headerdata: any;

    headerdata = JSON.parse(JSON.stringify(array));
    this.globalObjects.downloadPdf('',headerdata, this.pdfHeading, []);
  }

  opengraph() {
    this.flagforgraph = true;
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
}
