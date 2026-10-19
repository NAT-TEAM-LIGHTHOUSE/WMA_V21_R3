import { ChangeDetectorRef, Component,EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonInfiniteScroll,  ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FrameCanvasFilterComponent } from '../frame-canvas-filter/frame-canvas-filter.component';
import { ItemsComponent } from '../../items/items.component';
import { TableSearchPipe } from 'src/app/pipes/table-search.pipe';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,FrameCanvasFilterComponent,ItemsComponent,TableSearchPipe],
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent implements OnInit {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  // @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  @Input() sessionObj: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass1: EventEmitter<any> = new EventEmitter<any>();
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

  displayFixedRecord: boolean = false;
  displayFixedrecordLength = 50;

  scrollTo = 120;
  items = [];
  toastCtrl: any;
  subscribeRefreshFlag = false;
  refreshing = false;

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, public modalController: ModalController,
    public tableseach: SearchfilterPipe, public platform: Platform, private processData: ProcessDataService
    , public lhs_lib: LhsLibService, private cdr: ChangeDetectorRef,) {

    this.items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"contact-card-frame")
    }
  }

  ngOnInit() {
    for (let itemGroup of this.frame.Level4) {
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
      } if (x.toUpperCase() === 'STC') {
        this.switchFlag = true;
      }
    }
    this.frame.headers = JSON.parse(JSON.stringify(this.frame.Level4));
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
    var rowindex;
    delete this.frame['executing_index'];
    for (let dataRow of this.frame.tableRows[j]) {
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

    event.callingObjectArr = this.frame.callingObjectArr;
    let col = {};
    for (let itemGroup of this.frame.tableRows[j]) {
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
      for (let itemGroup of this.frame.tableRows[j]) {
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
    event.itemIndex = rowindex;
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
        requestData:this.frame
      }
    });
    return await modal.present();
  }

  searchAllData() {
    let data = this.processData.searchAllData(this.frame);
    this.processData.populateRows(this.frame.apps_page_frame_seqid,data);
  }

  filterColumn(){
    let data = this.processData.filterColumn(this.frame);
    this.processData.populateRows(this.frame.apps_page_frame_seqid,data);
  }

  toggleFrame() {
    this.frame.collapse = !this.frame.collapse
    // this.cdr.detectChanges();
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
}
