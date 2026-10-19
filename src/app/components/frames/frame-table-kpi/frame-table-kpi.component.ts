import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { TableSearchPipe } from 'src/app/pipes/table-search.pipe';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';
import { FrameCanvasFilterComponent } from '../frame-canvas-filter/frame-canvas-filter.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,TableSearchPipe,ItemsComponent,FrameCanvasFilterComponent],
  selector: 'app-frame-table-kpi',
  templateUrl: './frame-table-kpi.component.html',
  styleUrls: ['./frame-table-kpi.component.scss'],
})
export class FrameTableKpiComponent implements OnInit,OnDestroy {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  getcanvasWCP: boolean = false;
  userDetails: any;
  current_page_parameter: any = {};
  filterFormData: any = [];

  resData: any;
  l_where_str: any;
  tableRows = [];
  jsFilter:any;
  advanceFilter:any;
  thead: any = {};
  flagforgraph:boolean=false;
  canvasfilter:any=false;
  show_filter:any='dontshow';
  callingObjectArr : any = [];

  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  
  searchText: any;
  
  loadMoreFlag: string;
  summaryRow: any[];
  pdfHeading: any;

  graphFlag: any = false;
  searchFlag: any = false;
  pdfFlag: any = false;
  excelFlag: any = false;
  filter: boolean = false;
  toggleFilter: boolean = false;
  developerModeData :any ;

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events,public modalController: ModalController, private lhs_lib:LhsLibService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-table-kpi")
    }

  }
 ngOnDestroy(): void {
  this.events.unsubscribe("skipFilter");
 }
  ngOnInit() {
    this.events.subscribe("skipFilter", () => {
      this.filter = false;
      this.toggleFilter = false;
    });
   

    let frameFilterFlag = this.frame.frame_filter_flag;
    if (frameFilterFlag) {
      if (frameFilterFlag.indexOf("S") > -1) {
        this.searchFlag = true;
      }
      if (frameFilterFlag.indexOf("G") > -1) {
        this.graphFlag = true;
      }
      if (frameFilterFlag.indexOf("P") > -1) {
        this.pdfFlag = true;
      }
      if (frameFilterFlag.indexOf("E") > -1) {
        this.excelFlag = true;
      }
      if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1 || frameFilterFlag.indexOf("A") > -1 || frameFilterFlag.indexOf("D&D") > -1) {
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
          theaddata.push(itemMast.prompt_name);
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

  paginate(a_current_page: number = 1, service_type?, bull_Key?) {
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

    let wscp: any = {};
    wscp.service_type = service_type ? service_type : this.frame.on_frame_load_str ;
    wscp.object_code = this.frame.object_code;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        this.resData = data.responseData;

        // Developer Mode Loging
        if(data.responseData.Level1_Keys.length > 0){
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          }
        }
      //Developer Mode Loging

        let objData = this.globalObjects.setPageInfo(data.responseData);

        // For Getting *CALLING_OBJECT_CODE* from Frame //
        this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //

        let tableData = objData.Level1;

        if (tableData && tableData.length > 0) {
          let tableKey = Object.keys(tableData[0])

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

          let finalDisplayTable = []

          for (let data of this.tableRows) {
            let finalTableRow: any = [];
            let finalDataRow = [];
            for (let temp of data) {
              if (temp.Level5) {
                  finalDataRow.push(temp.Level5); 
              }
            }
            finalTableRow = finalDataRow;
            finalDisplayTable.push(finalTableRow);
          }
          this.frame.tableRows = finalDisplayTable;
        }

      }

      this.l_current_page = a_currentPage;
      // vijay if current page =1 then 
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
      this.parseBuiltins(bull_Key + 1);
    })

  }


  itemClicked(event,rowsdata, i){
    let col = {};
    delete this.frame['executing_index'];
    for (let itemGroup of this.frame.tableRows[i]) {
      if (itemGroup) {
        for (let item of itemGroup) {
          if (item.codeOfValues) {
            col[item.apps_item_seqid] = item.codeOfValues
          } else {
            col[item.apps_item_seqid] = item.value
          }
        }
      }
    }
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;

    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow[0].item_name == "ROWNUMBER") {
        rowindex = dataRow[0].value - 1;
      }
    }
    if(!rowindex){
      rowindex = i;
    }

    event.wsdp = [];
      let cols = {};
      for (let itemGroup of this.frame.tableRows[rowindex]) {
        if (itemGroup) {
          for (let item of itemGroup) {
            if (item.codeOfValues) {
              cols[item.apps_item_seqid] = item.codeOfValues
            } else {
              cols[item.apps_item_seqid] = item.value
            }
          }
        }
      }

      event.wsdp.push(cols);
    event.callingObjectArr = this.callingObjectArr;
    event.itemIndex = rowindex;
    this.emitPass.emit(event);
  }


  
  getdataFromcanvasFilter(event) {
    this.getcanvasWCP = true;
    let array = [];
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
    this.paginate(1);
  }
  
  async showDeveloperData(){
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData:this.frame
      }
    });
    return await modal.present();
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
