import { Component, OnInit,Input,Output,EventEmitter} from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';
import { FrameFilterComponent } from '../frame-filter/frame-filter.component';
import { table } from 'console';
import { TableSearchPipe } from 'src/app/pipes/table-search.pipe';
import { FrameCanvasFilterComponent } from '../frame-canvas-filter/frame-canvas-filter.component';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,ItemsComponent,FrameFilterComponent,TableSearchPipe,FrameCanvasFilterComponent],
  selector: 'app-frame-summ-card',
  templateUrl: './frame-summ-card.component.html',
  styleUrls: ['./frame-summ-card.component.scss'],
})
export class FrameSummCardComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  wscp: any = {};
  thead: any = [];
  thead2: any = [];
  dispalyss: any = { "color": "red", "text-yellow": "pink" };
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  filterFormData: any = [];
  l_card_title: any;
  tablerowsfilter: any;
  searchFlag: any = false;
  canvasfilter: any = false;
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  callingObjectArr = [];
  noRecordMessage: any;
  getcanvasWCP: boolean = false;
  jsFilter: boolean = false;
  cFilter: boolean = false;
  jFilter: boolean = false;
  aFilter: boolean = false;
  advanceFilter: boolean = false;
  tableRows: any[];
  loadMoreFlag: boolean;
  colSize: any = [];
  developerModeData: any;
  subscribeRefreshFlag = false;

  constructor(public globalObjects: GlobalObjectsService, private lhs_lib : LhsLibService,private dataService: DataService, private modalCtrl: ModalController, private events: Events
  ) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-summ-card")
    }
  }

  ngOnInit() {

     
      if(this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1){
        this.frame.collapse = false;
        this.frame.showCollapse = true;
      }else{
        this.frame.collapse = true;
        this.frame.showCollapse = false;
      }
 
    let frameFilterFlag = this.frame.frame_filter_flag;
    if (frameFilterFlag) {
      if (frameFilterFlag.toUpperCase().indexOf("SEARCH_BAR") > -1) {
        this.searchFlag = true;
      }
      if (frameFilterFlag.toUpperCase().indexOf("C") > -1) {
        this.canvasfilter = true;
      }
      if (frameFilterFlag.toUpperCase().indexOf("J") > -1) {
        this.jsFilter = true;
      }
      if (frameFilterFlag.toUpperCase().indexOf("SMART_FILTER") > -1) {
        this.advanceFilter = true;
      }
    }
    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }
    }
  }

  filterToggle() {
    if (this.show_filter == 'show') {
      this.show_filter = 'dontshow';
    }
    else {
      this.show_filter = 'show';
    }
  }

  getdataFromcanvasFilter(event) {
    this.getcanvasWCP = true;
    let array = [];
    this.canvasfilter = false;
    this.advanceFilter = false;
    this.jFilter = false;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;

    array = event.event.where_str;

    this.l_where_str = [];
    for (let data of array) {
      this.l_where_str += data + "  ";
    }
    this.frame.l_where_str = this.l_where_str;
  }


  itemClicked(event, rowsdata, i) {
    var rowindex;
    delete this.frame['executing_index'];
    for (let dataRow of rowsdata) {
      if (dataRow.Level5[0].item_name == "ROWNUMBER") {
        rowindex = dataRow.Level5[0].value - 1;
      }
    }
    if (rowindex == undefined) {
      rowindex = i;
    }

    event.callingObjectArr = this.callingObjectArr;
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
    this.wscp = this.wscp_send_input;

    if (event.click_events_str == "editItem") {
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]))
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
      event.EDIT_ITEM = frameLevel4;
      this.emitPass.emit(event);
    } else if (event.click_events_str == "deleteItem") {
      this.frame.tableRows.splice(rowindex, 1);
    }
    else {
      event.wsdp = [];
      let col = {};
      for (let itemGroup of this.frame.tableRows[rowindex]) {
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
      event.wsdp.push(col);
    }
    event.itemIndex = rowindex;
    this.emitPass.emit(event);
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
          this.globalObjects.clickedbutton = false;
        }
      }

    }).catch(err => {
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
    })

  }

  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
  }

  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.tablerowsfilter = res;
    });
  }

  async showDeveloperData() {
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData:this.frame
      }
    });
    return await modal.present();
  }

  toggleFrame() {
    this.frame.collapse = !this.frame.collapse
  }

}
