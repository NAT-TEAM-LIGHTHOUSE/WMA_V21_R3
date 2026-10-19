import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';
import { TableSearchPipe } from 'src/app/pipes/table-search.pipe';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent,TableSearchPipe],
  selector: 'app-frame-card-new',
  templateUrl: './frame-card-new.component.html',
  styleUrls: ['./frame-card-new.component.scss'],
})
export class FrameCardNewComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Input() sessionObj: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass1: EventEmitter<any> = new EventEmitter<any>();
  public show_filter: any = 'dontshow';
  userDetails: any;
  l_where_str: any;
  searchFlag : any;
  filter : any;
  developerModeData: any;
  switchFlag: boolean = false;
  viewFlag: boolean = false;
  
  searchText : any;

  enablefunnel : any;
  toggleFilter: boolean = false;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, public modalController: ModalController,
    public tableseach: SearchfilterPipe, public platform: Platform,private cdr: ChangeDetectorRef, private processData: ProcessDataService
    , public lhs_lib: LhsLibService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-card-new")
    }
  }

  ngOnInit() {
    for (let tableData of this.frame.canvasRows) {
      for (let itemGrp of tableData) {
        for (let item of itemGrp.Level5) {
          let item1 = tableData[0].Level5[0].value;
          console.log(item1);
        }

      }
    }

    if (this.frame.collapse == undefined) {
      if (this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1) {
        this.frame.collapse = false;
        this.frame.showCollapse = true;
      } else {
        this.frame.collapse = true;
        this.frame.showCollapse = false;
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

  itemClicked(event,row, j) {
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
    if (rowindex == undefined || this.frame.calenderflag) {
      rowindex = j;
    }
    if (event.click_events_str == "editItem" || event.click_events_str == "deleteItem") {
      rowindex = j;
    }

    this.frame.active_row = rowindex;

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

  viewAll(){
    if(!this.viewFlag){
      this.viewFlag = true;
    }else{
      this.viewFlag = false;
    }
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
    this.frame.apps_frame_type = 'TABLE';
    this.processData.populateRows(this.frame.apps_page_frame_seqid, this.frame.tableData);
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
    if(newFunc.name == 'searchAllData'){
      this.searchAllData();
    } 

    if(this.frame.searchableData){
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
  
}
