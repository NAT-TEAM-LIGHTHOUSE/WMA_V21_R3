import { Component, Directive, HostListener, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular/standalone';
import { FileHandle } from 'src/app/directives/drag-drop.directive';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { Events } from 'src/app/services/events';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { CanvasItemSearchPipe } from 'src/app/pipes/canvas-item-search.pipe';
import { ItemsComponent } from '../../items/items.component';
import { FocusDirective } from 'src/app/directives/focus-directive';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { MergeLevel5Pipe } from 'src/app/pipes/merge-level5-pipe';

// @Directive({
//   standalone: true,
//   selector: "[focusDirCan]"
// })
// export class FocusDirective {
//   constructor() { }

//   @HostListener("keyup.enter")
//   onKeyupEnter(event) {
//     let nextEl = this.findNextTabStop(document.activeElement);
//     nextEl.focus();
//   }

//   findNextTabStop(el) {
//     let universe = document.querySelectorAll(
//       "input,select,ion-button"
//     );
//     let list = Array.prototype.filter.call(universe, (item) => {
//       return item.tabIndex >= "0";
//     });
//     let index = list.indexOf(el);
//     index++;
//     while (index < list.length) {
//       if (!list[index].readOnly && !list[index].disabled && list[index].type != 'hidden') {
//         return list[index];
//       } else {
//         index++;
//       }
//     }
//     return list[0];
//   }
// }


@Component({
  standalone: true,
  imports: [STANDALONE_IMPORTS, ItemsComponent, CanvasItemSearchPipe, FocusDirective,MergeLevel5Pipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-frame-canvas',
  templateUrl: './frame-canvas.component.html',
  styleUrls: ['./frame-canvas.component.scss'],
})
export class FrameCanvasComponent implements OnInit {


  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  tableview = [];
  item_slno_count: number = 1;
  current_page_parameter: any = {};
  wscp: any = {};
  callingObjectArr: any = [];
  tableData: any;
  colSize: any = [];
  checkCardItem = false;
  firstEmptyframe: any;
  developerModeData: any;
  subscribeRefreshFlag = false;
  searchText: any;
  jsonTableData = [];
  tableRows = [];
  new_kpi = 1;
  month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sepr", "Oct", "Nov", "Dec"];
  files: any = [];
  searchFlag: any = false;
  sepKey = [];
  itemsDivider = [];
  canvasRows = [];
  containerRows = [];
  refreshing = false;
  activeItem: any;
  childFrame: boolean = false;
  isSeeMore: boolean = false
  isRunning: boolean = false
  isCanvasFooter: boolean = false
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, public lhs_lib: LhsLibService,
    private cdr: ChangeDetectorRef, public platform: Platform,
    public loadingController: LoadingController, private events: Events, public modalController: ModalController, private cdEngine: CdEngineService) {
    this.userDetails = this.globalObjects.userDetails;
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "frame-canvas-frame")
    }
  }
  ngOnDestroy(): void {
    this.cdEngine.unregister(this.frame.apps_page_frame_seqid);
  }
  ngOnInit() {
    this.cdEngine.register(this.frame.apps_page_frame_seqid, this.cdr);
    for (let tableData of this.frame.tableRows) {
      for (let itemGroup of tableData) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.item_name == "WMA_FRAME_STATUS") {
              item.value = 'D';
            }
          }
        }
      }
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;

    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split(";") : [];
    for (let x of frameFilterFlag) {
      if (x.toUpperCase() === 'SEARCH_BAR') {
        this.searchFlag = true;
      }
    } 

    if (this.frame.collapse == undefined) {
      if (this.frame.apps_frame_sub_type && this.frame.apps_frame_sub_type.toLowerCase().indexOf('collapse') > -1) {
        //   this.frame.collapse = false;
        //   this.frame.showCollapse = true;
        // } else {
        //   this.frame.collapse = true;
        //   this.frame.showCollapse = false;
        // }
        this.frame.collapse = true;
        this.frame.showCollapse = false;
      } else {
        this.frame.collapse = false;
        this.frame.showCollapse = true;
      }
    }

    let parentSeqIdArr = [];
    this.sepKey = [];
    for (let itemGroup of this.frame.Level4) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if ((Object.keys(this.globalObjects.devItemName).length > 0) && this.globalObjects.devItemName[item.item_name]) {
            item.value = this.globalObjects.devItemName[item.item_name];
          }
          let childItem = [];
          if (item.popup_parent_item_seqid) {
            item.item_visible_flag = 'F';

            let par = parentSeqIdArr.find(x => x.parentKey == item.popup_parent_item_seqid);

            if (par) {
              childItem = par.childItems
              childItem.push(item);
              par.childItems = childItem;
            } else {
              childItem.push(item);
              let obj = {
                parentKey: item.popup_parent_item_seqid,
                childItems: childItem
              }
              parentSeqIdArr.push(obj);
            }
          }
          if (item.item_position_divider) {
            let ids = item.item_position_divider.split(",");
            for (let id of ids) {
              this.itemsDivider.push(id);
            }
          }
        }

        if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_type == 'FRAME_SEPARATOR') {
          this.sepKey.push(itemGroup);
          if (itemGroup.Level5[0].item_sub_type == 'FOOTER_BUTTON') {
            this.isCanvasFooter = true
          }
        }

        itemGroup.groupCol = [];
        if (itemGroup.design_control_type) {
          itemGroup.groupCol = itemGroup.design_control_type.split('-');
          this.colSize = itemGroup.groupCol;
          let index = 0;
          for (let itm of itemGroup.Level5) {
            if (itm.item_visible_flag == 'T') {
              let col = itemGroup.groupCol[index];
              itm.promptCol = (1.5 * 12 / parseFloat(col));
              index++;
            }
          }
        }
        else if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          let invisibleCnt = 0;
          for (let item of itemGroup.Level5) {
            if (item.item_visible_flag != 'T') {
              invisibleCnt++;
            }
          }
          if (this.frame.design_control_type) {
            let frameCol = 12 / parseFloat(this.frame.design_control_type);
            let count = itemGroup.Level5.length - invisibleCnt;
            for (let itm of itemGroup.Level5) {

              let col = (12 / count);
              itm.promptCol = (1.5 * (frameCol * 12) / col);

            }
          } else {
            let count = itemGroup.Level5.length - invisibleCnt;
            for (let itm of itemGroup.Level5) {

              let col = (12 / count);
              itm.promptCol = (1.5 * 12 / col);

            }
          }
        }
      }
    }

    for (let itemGroup of this.frame.Level4) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          for (let p of parentSeqIdArr) {
            if (p.parentKey == item.apps_item_seqid) {
              item.childItems = p.childItems
            }
          }
        }
      }
    }

    this.developerModeData = {
      ws_seq_id: "",
      frame_seq_id: this.frame.apps_page_frame_seqid
    }
    this.frame.checkCardItem = 'F';
    if (this.frame.canvasRows) {
      this.isRunning = this.running(this.frame.canvasRows[0])
    }
  }



  itemClickedKpi(event, i, x) {
    let z = 0;
    for (let y of this.colSize) {
      z += i;
    }
    let rowindex = z + x;
    let tableRows = [];
    let tableKey = [];
    if (this.tableData.length > 0) {
      tableKey = Object.keys(this.tableData[0]);
    }
    for (let table of this.tableData) {

      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                item.value = table[key]
              }
            }
          }
        }
      }
      tableRows.push(frameLevel4);
    }
    let wsdp = [];
    let wsdpcl = [];
    let col = {};
    for (let itemGroup of tableRows[rowindex]) {
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
    wsdp.push(col);
    wsdpcl.push(col);
    event.wsdpcl = wsdpcl;
    event.wsdp = wsdp;
    event.callingObjectArr = this.frame.callingObjectArr;
    event.itemIndex = rowindex;
    event.wsdpcl = [];
    event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);

    this.emitPass.emit(event);
  }

  itemValueChange(event, rowindex) {


    // console.log(`comes in itemValueChange of items component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,event.item_name);
    if (this.childFrame) {
      this.setParentJson(event);
    }

    return new Promise((resolve, reject) => {


      if (event.postEvent) {

        this.itemClicked1(event, rowindex)
      }

      if (event.on_blur) {
        this.onItemBlur(event, rowindex);
      }


      //////  for change super events /////
      if (((!event.click_events_str && event.itemClicked != 'pre') || event.itemClicked == 'post' || event.itemClicked == 'load') && this.frame.tableRows && this.frame.tableRows.length > 0) {
        event.wsdpcl = [];
        // let newEvent = JSON.parse(JSON.stringify(event))
        // let newEvent = event;
        // newEvent.changeEvent = true;
        // newEvent.tabRows = this.frame.tableRows[rowindex];
        event.itemIndex = rowindex;
        event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);

        this.emitPass.emit(event);
      }
      ////*******/////////  */


      if (event.dependent_column_str) {
        // this.wsdp = [];
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
                  if (item.item_type == 'DD') {
                    let evName = "testDD" + item.apps_item_seqid;
                    this.events.publish(evName);
                  }
                }
                if (item.formula_str) {
                  item.value = this.globalObjects.autoCalculation(item.formula_str, this.frame.tableRows[rowindex]);
                }
                if (item.pre_event_plsql_text) {
                  item.value = this.globalObjects.setValueOnCondition(item.pre_event_plsql_text, this.frame.tableRows[rowindex]);
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
        if ((event.dependent_column_sql && event.value) || (event.item_type == 'BT' && event.dependent_column_sql)) {
          this.getDependentData(event, rowindex).then(res => {
            if (res === "success") {
              if (event.post_text_validate_plsql) {
                this.PostTextValidatePlsql(event, rowindex);
              }
            }
            resolve("");
          });
        } else if (event.post_text_validate_plsql && event.value) {
          this.PostTextValidatePlsql(event, rowindex);
          resolve("");
        } else {
          resolve("");
        }
      } else {
        resolve("");
      }
    })
  }


  setParentJson(event) {
    let parentData = this.lhs_lib.getParentJson(this.frame.apps_page_frame_seqid);
    if (parentData && parseFloat(this.frame.apps_page_no) > 100) {
      parentData[this.wscp_send_input.clicked_index][event.item_name] = event.value;
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
      if (this.wsdp.length > 0 && event.wsdp.length > 0) {
        newWsdp.push(Object.assign(this.wsdp[0], event.wsdp[0]));
      } else {
        if (this.wsdp.length > 0) {
          newWsdp = this.wsdp
        } if (event.wsdp.length > 0) {
          newWsdp = event.wsdp
        }
      }

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": newWsdp
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
                  if (item.item_name == "PHOTO") {
                    this.events.publish("DISPLAY_PHOTO", "LHS")
                  }
                  if (item.item_type == 'D' && item.item_sub_type == "D" && !(this.platform.is('android') || this.platform.is('ios'))) {
                    let d = this.globalObjects.formatDate(item.value, 'yyyy-MM-dd');
                    item.Dvalue = { isRange: false, singleDate: { jsDate: new Date(d) } };
                    item.value = item.Dvalue.singleDate.date.day + "-" + this.month[item.Dvalue.singleDate.date.month - 1] + "-" + item.Dvalue.singleDate.date.year;

                    if (item.value.indexOf('Sepr')) {
                      item.value = (item.value).replace('Sepr', 'Sep')

                    }


                  }
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

  itemClicked(event, i) {
    delete this.frame['executing_index'];
    this.activeItem = event;
    this.activeItem.activeIndex = i;

    // console.log(`comes in itemClicked of items component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,event.item_name);
    if (event.enterEvent) {
      event.itemIndex = i;

      this.emitPass.emit(event);
    }
    else {
      this.itemValueChange(event, i).then(res => {
        this.itemClicked1(event, i);
      })
    }
  }

  itemClicked1(event, i) {


    // console.log(`comes in itemClicked1 of items component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,event.item_name);
    var rowindex;

    rowindex = i;
    event.callingObjectArr = this.frame.callingObjectArr;
    event.itemIndex = rowindex;

    let isValid = true;


    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = event.indexcount;

    if ((event.click_events_str && event.click_events_str.indexOf("addItem") > -1) || (event.click_events_str && event.click_events_str.indexOf("addMirrorItem") > -1)) {
      let frameLevel4: any = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]));
      let theaddata: any = [];
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            item.item_default_value = "";
            let temp = item.design_control_type;
            item.design_control_type = item.design_control_type_auto_card;
            item.design_control_type_auto_card = temp;

            temp = item.display_setting_str;
            item.display_setting_str = item.display_setting_str_auto_card;
            item.display_setting_str_auto_card = temp;

            temp = item.item_visible_flag;
            item.item_visible_flag = item.flag_auto_card;
            item.flag_auto_card = temp;

            item.temp_item_type = item.item_type

            if (item.item_type != "BT") {
              item.item_type = "TEXT";
            }
            if (item.item_name == "SLNO") {
              item.value = this.item_slno_count;
              this.item_slno_count = this.item_slno_count + 1;
            }
            if (item.value) {

              item.isValid = true;
            }
            if (item.isValid !== undefined && !item.isValid) {
              isValid = item.isValid;
            }

            if (item.session_hold_flag == 'T') {
              if (this.sessionObj) {
                this.sessionObj[item.item_name] = item.value
              } else {
                this.sessionObj = {};
                this.sessionObj[item.item_name] = item.value
              }
            }
            if (item.item_visible_flag == 'T') {
              theaddata.push(item.prompt_name);
            }
          }
        }
      }

      let checkValidFrame = false;

      if (event.click_events_str.indexOf("checkValidFrame") > -1) {
        let arr = event.click_events_str.split("#");
        let frmseq = arr[event.click_events_str.indexOf("checkValidFrame")].split("~")[1];
        if (this.frame.apps_page_frame_seqid == frmseq) {
          checkValidFrame = true;
        }
      }
      if (checkValidFrame && !isValid) {
        for (let itemGroup of this.frame.tableRows[rowindex]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.isValid !== undefined && !item.isValid) {
                item.touched = true;
              }
            }
          }
        }
        this.globalObjects.clickedbutton = false;
        this.globalObjects.presentAlert("Please correct all the errors and enter valid input")
      }
      else {
        if (event.click_events_str.indexOf("checkValidFrame") > -1) {
          let arr = event.click_events_str.split("#");
          arr.splice([event.click_events_str.indexOf("checkValidFrame")], 1);
          event.click_events_str = arr.join("#");
        }
      }

      if (isValid) {
        if (event.click_events_str.indexOf('itemAddFrom') > -1) { } else {
          this.frame.tableRows[rowindex] = JSON.parse(JSON.stringify(this.frame.Level4))
        }
        for (let itemGroup of this.frame.tableRows[rowindex]) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.session_hold_flag == 'T') {
                if (this.sessionObj) {
                  item.value = this.sessionObj[item.item_name];
                }
              }
            }
          }
        }
        event.tHead = theaddata;
        event.ADD_ITEM = frameLevel4;
        event.wsdpcl = [];
        event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);

        this.emitPass.emit(event);
      }

    } else {

      event.wsdp = [];
      if (this.frame.tableRows) {
        for (let framedata of this.frame.tableRows) {
          let col = {};
          for (let itemGroup of framedata) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                let value;
                if (item.codeOfValues) {
                  value = item.codeOfValues
                } else if (item.value) {
                  value = item.value
                } else {
                  value = ""
                }
                if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                  col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                } else {
                  col[item.apps_item_seqid] = item.value;
                }
                if (item.session_hold_flag == 'T') {
                  if (this.sessionObj) {
                    this.sessionObj[item.item_name] = value
                  } else {
                    this.sessionObj = {};
                    this.sessionObj[item.item_name] = value
                  }
                }
                if (item.isValid !== undefined && !item.isValid) {
                  isValid = item.isValid;
                }
              }
            }
          }
          event.sessionObj = this.sessionObj
          event.wsdp.push(col);
        }
        //--------------------------
        if (this.frame.tableRows.length > 1) {
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
          event.wsdpcl = [];
          event.wsdpcl.push(col);
        }
        //--------------------------
      } else {
        let col = {};
        for (let itemGroup of this.frame.Level4) {
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
              if (item.isValid !== undefined && !item.isValid) {
                isValid = item.isValid
              }
            }
          }
        }
        event.wsdp.push(col);
      }

      event.wsdpcl = [];
      event.wsdpcl[0] = this.lhs_lib.getWsdpcl(this.frame.tableRows[rowindex], event.itemIndex);
      // console.log(`emit pass from  itemClicked1 of canvas component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,event.item_name);
      this.emitPass.emit(event);
    }
  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: null,
      frame_seq_id: this.frame.apps_page_frame_seqid
    }
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

  onItemBlur(event, rowindex) {
    if (event.on_blur) {

      if (this.frame.tableRows) {
        this.globalObjects.onBlurEvent(event, event.on_blur, this.frame.tableRows[rowindex]);
      }
    }
  }

  closeMods() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    this.globalObjects.popoverFlag = 'M';
    this.globalObjects.breadCrumpsArray.pop();
  }

  openMods() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    // this.ngOnInit();
  }

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.searchText = res;
    });
  }


  toggleFrame() {
    this.frame.collapse = !this.frame.collapse;
    // this.cdr.detectChanges();
  }

  openHardcodeObject() {
    let event = {
      aliases: null,
      app_js1_text: null,
      app_js2_text: null,
      app_plsql1_text: null,
      app_plsql2_text: null,
      apps_frame_seqno: "1",
      apps_icon_name: null,
      apps_item_seqid: "WMABLD01-I-51",
      apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
      apps_page_no: "1",
      callingObjectArr: [],
      calling_call_para: null,
      calling_frame_seqid_str: null,
      calling_mode: null,
      calling_object_code: "WMABLD02",
      calling_object_load_events_str: null,
      calling_pageno: null,
      calling_parameter_str: null,
      calling_tcode: null,
      calling_tnature: null,
      click_events_str: "get_object_config",
      column_width: null,
      css_class: null,
      data_required_flag: "F",
      datatype: "VARCHAR2",
      db_table_name: null,
      dependent_column_sql: null,
      dependent_column_str: null,
      design_control_type: null,
      design_control_type_auto_card: null,
      display_setting_str: null,
      display_setting_str_auto_card: null,
      flag: "M",
      flag_auto_card: null,
      format_mask: null,
      formula_str: null,
      frame_alias: null,
      from_value: null,
      group_no_str: null,
      indexCount: 0,
      indexcount: 0,
      input_pattern: null,
      itemIndex: 0,
      itemPKey: "",
      item_db_name: null,
      item_default_value: null,
      object_code: "WMABLD01",
      post_events_str: null,
      post_text_validate_plsql: null,
      rightClickFlag: false,
      search: "",
      session_hold_flag: null,
      summary_flag: null,
      template_apps_item_seqid: null,
      to_value: null,
      tool_tip: null,
      wscp: {
        apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
        apps_working_mode: "P",
        calling_parameter_str: null,
        click_events_str: "get_object_config",
        flag: null,
        object_code: "WMABLD01",
        service_type: "get_object_config",
        harcodeFrameId: "MEED0083-F-2"
      },
      wsdp: [],
      wsdpcl: []
    }

    this.emitPass.emit(event);
  }


  toggleSep(item) {
    if (item.sepCollapse == "SHOW") {
      item.sepCollapse = "HIDE"
      for (let itemGroup of item.containerRowss) {
        for (let i of itemGroup.Level5) {
          console.log(i.value);
        }
      }
    } else {
      item.sepCollapse = "SHOW"
    }
    // this.cdr.detectChanges();
  }


  toggleItm(itm, index) {
    for (let i = 0; i < itm.Level5.length; i++) {
      if (i == index) {
        itm.Level5[i].sepFrame = 'SHOW';
      } else {
        itm.Level5[i].sepFrame = 'HIDE';
      }
    }
    // this.cdr.detectChanges();
  }


  fun1() {
    console.log("this is frame table data" + this.frame)
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


  isShown: boolean = true;
  buttonText: string = "Show";
  newClassAdded: boolean = false;
  toggleClass() {
    this.isShown = !this.isShown;
    this.buttonText = this.isShown ? "Hide" : "Show";
    this.newClassAdded = this.isShown;
    this.frame.canvasRows.length
  }

  seeMorekpi() {
    this.isSeeMore = !this.isSeeMore
  }
  running(tabledata) {
    let i = 0;
    if (tabledata) {
      for (let framedata of tabledata) {
        for (let itemGroup of framedata.Level5) {
          if (itemGroup.item_visible_flag == "T") {
            i++;
            if (i > 8) {
              return true
            }
          }
        }
      }
    }
  }

  onRightClick(event, tableData) {

    event.preventDefault();
    event.stopPropagation();
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
}
