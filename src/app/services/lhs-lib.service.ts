import { Inject, Injectable, Injector, NgZone, PLATFORM_ID, QueryList } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { MsgBoxPage } from '../pages/msg-box/msg-box.page';

import { Events } from './events';
import { GlobalObjectsService } from './global-objects.service';
import { InputFormatMaskPipe } from '../pipes/input-format-mask.pipe';
import { SearchfilterPipe } from '../pipes/searchfilter.pipe';
import { ColumnfilterPipe } from '../pipes/column-filter';
import { ProcessDataService } from './process-data.service';
import { BatteryStatus } from '@awesome-cordova-plugins/battery-status/ngx';
import { FilterColumnDataPipe } from '../pipes/filter-column-data.pipe';
import { animationFrames, BehaviorSubject } from 'rxjs';
import { MyTabComponent } from '../pages/super-parent/my-tab/my-tab.component';
import { applyLoggingDecorator } from './decorator-application';
import { EncryptionService } from './encryption.service';
import { el, ro } from 'date-fns/locale';
import { NewAlertMsgBoxesPage } from '../pages/new-alert-msg-boxes/new-alert-msg-boxes.page';
import { isPlatformServer } from '@angular/common';
import { FormatMaskPipe } from '../pipes/format-mask-pipe';
import { SearchFilterRawPipe } from '../pipes/search-filter-raw-pipe';
import { CdEngineService } from './cd-engine-service.service';
import { MergeLevel5Pipe } from '../pipes/merge-level5-pipe';
// import { applyLoggingDecorator } from './decorator-application';

@Injectable({
  providedIn: 'root',
  // imports: [FormatMaskPipe,SearchFilterRawPipe]
})
export class LhsLibService {

  public object_mast: any;
  public homeTabobject_mast: any;
  public clickEvent: any;
  public dynamicTabs = [];
  public sys_current_item: any;
  public sys_current_frame: any;
  public sys_last_item: any;
  public sys_last_frame: any;
  public sys_last_rownumber: any;
  public sys_current_rownumber: any;
  public tabs: QueryList<MyTabComponent>;
  public isTab = false
  public adata = []
  public storeoldobj = []
  public myTab: any
  // public closeBreadCrumb: boolean = false
  public isTabclose: boolean = false

  public refreshFrameItems: any = {};
  public refreshFrames: any = {};
  public calculateFrames: any = {};



  private processDataServ: any;

  constructor(private globalObjects: GlobalObjectsService, private events: Events, private popOverCtrl: PopoverController, private batteryStatus: BatteryStatus, private pipemyRaw: SearchFilterRawPipe, private formatMastPipe: FormatMaskPipe, private formatMastNewPipe: InputFormatMaskPipe, private cdEngine: CdEngineService,
    private pipemy: SearchfilterPipe, private colFilter: ColumnfilterPipe, private colRawFilter: FilterColumnDataPipe, private encryptDecrypt: EncryptionService, @Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone, private mergelevel5: MergeLevel5Pipe) {

    if (!this.processDataServ) {
      this.processDataServ = new ProcessDataService(this, this.globalObjects, this.pipemy, this.pipemyRaw, this.cdEngine, this.colFilter, this.colRawFilter, this.formatMastNewPipe, this.ngZone);
    }

    if (this.globalObjects.serviceFlag) {
      return applyLoggingDecorator(this, "lhs-lib")
    }
  }


  setObjectMastTab() {
    if (isPlatformServer(this.platformId)) return;
    const tabGet: any = document.querySelectorAll('app-my-tab')
    for (let [index, tabTag] of tabGet.entries()) {
      if (!tabTag.childNodes[0].hasAttribute("hidden")) {
        for (let ar of this.adata) {
          if (ar.index == index) {
            ar.object = this.object_mast
          }
        }
      }
    }
  }

  get_active_object_mast() {
    if (isPlatformServer(this.platformId)) return;
    const tabGet: any = document.querySelectorAll('app-my-tab')
    for (let [index, tabTag] of tabGet.entries()) {
      if (!tabTag.childNodes[0].hasAttribute("hidden")) {
        for (let ar of this.adata) {
          if (ar.index == index) {
            return ar.object;
          }
        }
      }
    }
  }

  getActiveTabSuperid() {
    let activetab: any = ""
    activetab = this.dynamicTabs.find((tab) => tab.instance.active == true)
    if (activetab) {
      return activetab.instance.superId
    }
    else {
      return ''
    }
  }

  /**** Set Multiple Rows Values Start******/

  set_row_values(name, valuesarr, index) {
    let frameName;
    let rowIndex;
    if (name.indexOf(".") > -1) {
      rowIndex = parseInt(name.split(".")[1]) - 1;
      name = name.split(".")[0];
    }
    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    frameName = name.split("[")[0];
    let itemNameStr = name.split("[")[1];
    let itemNames = itemNameStr.split("]")[0];
    let itemArr = itemNames.replaceAll("'", "").split(",");

    if (index) { rowIndex = index; } else { rowIndex = 0; }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
          let flag = false;
          rowIndex = this.get_current_record(index, frame) ?? 0;

          let i = 0;
          let vals = [];
          let pageN;
          if (valuesarr.rowData) {
            vals = valuesarr.rowData;
            pageN = valuesarr.pageNo;
          } else {
            pageN = frame.apps_page_no;
            vals = eval(valuesarr);
          }

          if (frame.tableRows && frame.tableRows[rowIndex]) {

            // let itm = this.get_rows_item(frame.tableRows[rowIndex], 'WMA_RECORD_STATUS');


            for (let itemName of itemArr) {
              for (let itemGroup of frame.tableRows[rowIndex]) {

                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      this.make_row_dirty(null, frame.tableRows[rowIndex]);
                      item.value = vals[i];

                      // if (item.item_type == 'CHECK_BOX') {
                      //   // setTimeout(() => {
                      //   item.initialVal = true;
                      // }
                      if (item.value != undefined && item.value != null && item.value !== "") {
                        item.isValid = true;
                      }
                      // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
                      this.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frame.apps_page_frame_seqid] = "Y";

                      if (item.summary_flag) {
                        this.calculateFrames[frame.apps_page_frame_seqid] = "Y";
                      }

                      //For pipe detect
                      // itemGroup.Level5 = [...itemGroup.Level5];
                    }
                  }
                } else {
                  if (itemGroup && itemGroup.length > 0) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                        this.make_row_dirty(null, frame.tableRows[rowIndex]);
                        item.value = vals[i];
                        // if (item.item_type == 'CHECK_BOX') {
                        //   // setTimeout(() => {
                        //   item.initialVal = true;
                        // }
                        if (item.value != undefined && item.value != null && item.value !== "") {
                          item.isValid = true;
                        }
                        // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
                        this.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frame.apps_page_frame_seqid] = "Y";

                        if (item.summary_flag) {
                          this.calculateFrames[frame.apps_page_frame_seqid] = "Y";
                        }
                        //For pipe detect
                        // itemGroup = [...itemGroup];
                      }
                    }
                  }
                }
              }

              i++
            }
          } else {
            flag = true;
            let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
            // let itm = this.get_rows_item(frameLevel4, 'WMA_RECORD_STATUS');


            for (let itemName of itemArr) {
              for (let itemGroup of frameLevel4) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      item.value = vals[i];
                      // if (item.item_type == 'CHECK_BOX') {
                      //   // setTimeout(() => {
                      //   item.initialVal = true;
                      // }
                      if (item.value != undefined && item.value != null && item.value !== "") {
                        item.isValid = true;
                      }

                      //For pipe detect
                      // itemGroup.Level5 = [...itemGroup.Level5];
                    }
                  }
                } else {
                  if (itemGroup && itemGroup.length > 0) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                        item.value = vals[i];
                        // if (item.item_type == 'CHECK_BOX') {
                        //   // setTimeout(() => {
                        //   item.initialVal = true;
                        // }
                        if (item.value != undefined && item.value != null && item.value !== "") {
                          item.isValid = true;
                        }
                        //For pipe detect
                        // itemGroup = [...itemGroup];
                      }
                    }
                  }
                }
              }
              i++
            }

            if (frameName) {
              this.make_row_dirty(null, frameLevel4);
              if (frame.tableRows) {
                frame.tableRows.push(frameLevel4);
              } else {
                frame.tableRows = [];
                frame.tableRows.push(frameLevel4);
              }
            }
          }
          if (flag) {
            this.processDataServ.afterTableRows(frame);
          }
        }

        // }
      }
    }


  }

  /**** Set Multiple Rows Values End******/

  /**** Get Multiple Rows Values Start******/

  get_row_values(name, index) {
    let frameName;
    let rowIndex;
    if (name.indexOf(".") > -1) {
      rowIndex = parseInt(name.split(".")[1]) - 1;
    }

    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } else if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    frameName = name.split("[")[0];
    let itemName = name.split("[")[1].replace("]", "");
    let itemNames = itemName.replace(")", "");
    let itemArr = itemNames.split(",");


    if (index) { rowIndex = index; } else { rowIndex = 0; }

    let rowsArr = [];
    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

          rowIndex = this.get_current_record(index, frame) ?? 0;

          if (frame.tableRows && frame.tableRows[rowIndex]) {
            for (let itemName of itemArr) {
              for (let itemGroup of frame.tableRows[rowIndex]) {

                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    // console.log("item_name :", item.item_name)
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      rowsArr.push(item.value);
                    }
                  }

                } else {
                  if (itemGroup && itemGroup.length > 0) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                        rowsArr.push(item.value);
                      }
                    }
                  }
                }
              }
            }
          }
          let obj = {
            pageNo: frame.apps_page_no,
            rowData: rowsArr
          }
          return obj;
        }
      }
    }


  }

  /**** Get Multiple Rows Values End******/

  /**** Set Item Value Start******/

  set_item_value(event?, name?, index?, value?, runEvent?, flag?, cleanOldValue?: boolean) {
    let frameName = '';
    let itemName;
    let itmIndex;

    let addItem = true;
    let p_flag = false;
    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.trim().split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    let rowData = this.get_name_index(itemName, frameName);

    if (!rowData) {
      if (itemName.toLowerCase() == 'scopeurl') {
        this.globalObjects.setScopeUrl(value);
        return this.globalObjects.setDataLocally('scopeUrl', value);
      }
      if ((itemName && (itemName.trim().toLowerCase().startsWith("p_") || itemName.trim().toLowerCase().startsWith("cp_")))) {
        p_flag = true;
      } else {
        return;
      }
    }



    // console.log("set_item ==========>>>>>>>>>>>>   " +name);
    let rowIndex;
    if (index) { rowIndex = index } else { index = 0; }



    if (!p_flag) {

      let itmArr = frameName ? [rowData] : rowData;

      for (let idx of itmArr) {
        let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

        if (frame.apps_page_frame_seqid && ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' && !frameName) && !(frame.apps_page_frame_seqid).toLowerCase().includes("-para")) { } else {

          rowIndex = this.get_current_record(index, frame) ?? 0;

          let tableRows = [];
          let frameId = frame.apps_page_frame_seqid;
          tableRows = frame.tableRows;

          if (!flag && !frame.auto_populate_default_where) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              if ((frame.edit_record_index == undefined && rowIndex > frame.tempRows.length - 1) || rowIndex == frame.edit_record_index ||
                (index && typeof (index) == 'string' && (index.toLowerCase().includes("current_record") || index.toLowerCase().includes("wma_record_index")))) {
                rowIndex = 0;
              } else {
                tableRows = frame.tempRows;
                frameId = frame.apps_page_frame_seqid + 'A';
              }
            }
          }

          // if (!flag && !frame.auto_populate_default_where) {
          //   if (frame.tempRows && frame.tempRows.length > 0) {
          //     if ((frame.edit_record_index == undefined && rowIndex > frame.tempRows.length - 1) || rowIndex == frame.edit_record_index) {
          //       rowIndex = 0;
          //     } else if (index && typeof (index) == 'string' && (index.toLowerCase().includes("current_record") || index.toLowerCase().includes("wma_record_index"))) {
          //       let itm = this.check_for_current_record(tableRows[0]);

          //       if (itm && (itm.value == 'D' || itm.frame_status == 'dirty')) {
          //         rowIndex = 0;
          //       } else {
          //         tableRows = frame.tempRows;
          //         frameId = frame.apps_page_frame_seqid + 'A';
          //         let tempFrame = this.get_frame_config(frameId);

          //         if (tempFrame) {
          //           rowIndex = tempFrame.active_row ?? 0;
          //         }
          //       }
          //     } else {
          //       tableRows = frame.tempRows;
          //       frameId = frame.apps_page_frame_seqid + 'A';
          //     }
          //   }
          // }

          // console.warn("index -- ", rowIndex, itemName, frameName);
          if (tableRows && tableRows[rowIndex]) {

            let itemGroup = tableRows[rowIndex][idx.level4Index];
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                  if (frameName) {
                    this.make_row_dirty(null, tableRows[rowIndex]);

                    let val = this.setValue(item, value, frame.apps_frame_type, frameId, event, runEvent, cleanOldValue);
                    //For pipe detect
                    // itemGroup.Level5 = [...itemGroup.Level5];
                    if (runEvent) {
                      if (!val) return null;
                      return { item, ...val }
                    }
                    return value;
                  } else {

                    this.make_row_dirty(null, tableRows[rowIndex]);
                    this.setValue(item, value, frame.apps_frame_type, frameId, event, runEvent, cleanOldValue);
                    // itemGroup.Level5 = [...itemGroup.Level5];
                  }
                  addItem = false;
                }
              }
            }
          } else {

            let newRecFlag: boolean = false;
            let frameLevel4 = [];
            let mainframe;

            frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));

            if (frameLevel4 && frameLevel4.length > 0) {

              let val;
              let ev;
              // for (let itemGroup of frame.Level4) {
              let itemGroup = frameLevel4[idx.level4Index];
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  // item.value = "";
                  if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {

                    this.make_row_dirty(null, frameLevel4);
                    val = this.setValue(item, value, frame.apps_frame_type, frame.apps_page_frame_seqid, event, runEvent, cleanOldValue);
                    ev = item;
                    newRecFlag = true;
                    addItem = false;
                    //For pipe detect
                    // itemGroup.Level5 = [...itemGroup.Level5];
                  }
                }
              } else {
                if (itemGroup && itemGroup.length > 0) {
                  for (let item of itemGroup) {
                    // item.value = "";
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {

                      this.make_row_dirty(null, frameLevel4);

                      val = this.setValue(item, value, frame.apps_frame_type, frame.apps_page_frame_seqid, event, runEvent, cleanOldValue);
                      ev = item;
                      newRecFlag = true;
                      addItem = false;
                      //For pipe detect
                      // itemGroup = [...itemGroup];
                    }
                  }
                }

              }

              if (newRecFlag) {
                if (frame.tableRows && frame.tableRows.length > 0) {
                  frame.tableRows.push(frameLevel4);
                  // this.setItemCount(frame.tableRows);
                  // this.getSepratorGrp(frame);
                  this.processDataServ.afterTableRows(frame);
                  if (mainframe) {
                    mainframe.tempRows = frame.tableRows;
                  }
                } else {
                  frame.tableRows = [];
                  frame.tableRows[0] = frameLevel4;
                  this.setItemCount(frame.tableRows, frame.apps_page_frame_seqid);
                  if (mainframe) {
                    mainframe.tempRows = frame.tableRows;
                  }
                  // this.getSepratorGrp(frame);
                  this.processDataServ.afterTableRows(frame);
                }

                if (runEvent) {
                  if (!val) return null;
                  return { item: ev, ...val }
                }

              }

            }
          }
        }

      }

    } else {

      let frame = this.get_frame_config(this.object_mast.object_code + '-PARA');

      if (frame) {
        let tableRows = frame.tableRows
        if (tableRows && tableRows[0]) {

          for (let itemGroup of tableRows[0]) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                  if (frameName) {
                    this.make_row_dirty(null, tableRows[rowIndex]);

                    let val = this.setValue(item, value, frame.apps_frame_type, frame.apps_page_frame_seqid, event, runEvent, cleanOldValue);
                    //For pipe detect
                    // itemGroup.Level5 = [...itemGroup.Level5];
                    if (runEvent) {
                      if (!val) return null;
                      return { item, ...val }
                    }
                    return value;
                  } else {
                    this.make_row_dirty(null, tableRows[rowIndex]);
                    let val = this.setValue(item, value, frame.apps_frame_type, frame.apps_page_frame_seqid, event, runEvent, cleanOldValue);
                    //For pipe detect
                    // itemGroup.Level5 = [...itemGroup.Level5];
                    if (runEvent) {
                      if (!val) return null;
                      return { item, ...val }
                    }
                  }
                  addItem = false;
                }
              }
            }
          }

        }
      }

    }

    if (addItem) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) && ((itemName.toUpperCase().startsWith("P_") > -1) || (frameName == this.object_mast.object_code + "-PARA"))) {

            let item = frame.tableRows && frame.tableRows.length > 0 ? this.get_rows_item(frame.tableRows[0], itemName) : "";

            if (item) {
              this.setValue(item, value, frame.apps_frame_type, frame.apps_page_frame_seqid);
              return;
            } else {
              if (frame.Level4 && frame.Level4.length > 0) {
                let itemGrp = JSON.parse(JSON.stringify(frame.Level4[0]));
                for (let item of itemGrp.Level5) {
                  item.item_default_value = "";
                  item.item_name = itemName?.toUpperCase();
                  item.prompt_name = itemName;
                  item.value = value;

                  // let itm = this.get_rows_item(frame.tableRows[0], 'WMA_RECORD_STATUS');
                  // if (itm) {
                  //   itm.frame_status = 'dirty';
                  // }

                  this.make_row_dirty(null, frame.tableRows[0]);

                  // if (item.mirrored_items) {
                  //   this.set_mirror_values(item);
                  // }

                  if (item.oldValue) {
                    item.oldValue = "";
                  }
                }

                if (frame.tableRows && frame.tableRows.length > 0) {
                  frame.tableRows[0].push(itemGrp);
                } else {
                  frame.tableRows = [];
                  frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4))

                  frame.tableRows[0].push(itemGrp);
                }
                addItem = false;
              }
            }
          }
        }
      }
    }

    if (addItem) {
      return "item not found";
    }
    return;
  }



  get_record_index(frame, value, cache_keys?) {

    let data = cache_keys ? cache_keys : {};

    let key = frame.apps_page_frame_seqid + '#' + value;
    if (data[key]) {
      return { cache_data: data, data: data[key] };
    }



    if (frame.tableRows && frame.tableRows.length > 0) {
      let idx = this.get_name_index('WMA_RECORD_INDEX', frame.apps_page_frame_seqid);
      for (let i = 0; i < frame.tableRows.length; i++) {
        let itemGroup = frame.tableRows[i][idx.level4Index];
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX' && item.value != undefined) {
              if (!data[frame.apps_page_frame_seqid + '#' + item.value]) {
                data[frame.apps_page_frame_seqid + '#' + item.value] = { index: i, frame: frame.apps_page_frame_seqid, noRecord: false };
              }

              if (item.value == value) {
                // return i;
                return { cache_data: data, data: { index: i, frame: frame.apps_page_frame_seqid, noRecord: false } };
              }
            }
          }
        }
      }
    }

    if (frame.tempRows && frame.tempRows.length > 0) {
      let tempframe = this.get_frame_config(frame.apps_page_frame_seqid + 'A');

      if (tempframe) {

        let idx = this.get_name_index('WMA_RECORD_INDEX', tempframe.apps_page_frame_seqid);
        for (let y = 0; y < tempframe.tableRows.length; y++) {
          let itemGroup = tempframe.tableRows[y][idx.level4Index];
          if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
            for (let item of itemGroup.Level5) {

              if (!data[frame.apps_page_frame_seqid + '#' + item.value]) {
                if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX' && item.value != undefined) {
                  data[frame.apps_page_frame_seqid + '#' + item.value] = { index: y, frame: tempframe.apps_page_frame_seqid, noRecord: false };
                }
              }
              if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX' && item.value == value) {
                return { cache_data: data, data: { index: y, frame: tempframe.apps_page_frame_seqid, noRecord: false } };
              }
            }
          }
        }
      }
    }

    return { cache_data: data, data: { index: null, frame: null, noRecord: true } }

  }

  set_value(frame, index, name, value, event?, runEvent?) {
    let frameName = '';
    let itemName;

    let addItem = true;
    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }
    if (frame.tableRows && frame.tableRows.length > 0) {
      for (let itemGroup of frame.tableRows[index]) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {

              // let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
              // let itm = this.get_item(name, item.itemIndex);
              // if (itm) {
              //   itm.frame_status = 'dirty';
              // }

              this.make_row_dirty(item, frame.tableRows[index]);
              this.setValue(item, value, frame.apps_frame_type, frame.apps_page_frame_seqid, event, runEvent);
              //For pipe detect
              // itemGroup.Level5 = [...itemGroup.Level5];
              return value;
            }
          }
        } else {
          if (itemGroup && itemGroup.length > 0) {
            for (let item of itemGroup) {
              if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {

                // let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
                // let itm = this.get_item(name, item.itemIndex);
                // if (itm) {
                //   itm.frame_status = 'dirty';
                // }

                this.make_row_dirty(item, frame.tableRows[index]);
                this.setValue(item, value, frame.apps_frame_type, frame.apps_page_frame_seqid, event, runEvent);
                //For pipe detect
                // itemGroup = [...itemGroup];
                return value;
              }
            }
          }
        }
      }
    }
  }

  set_frame_indexes(frame) {
    frame.records_per_page = frame.display_no_of_records ? frame.display_no_of_records : 50;
    frame.records_on_current_page = Math.min(frame.total_no_of_record, (frame.canvasRows ? frame.canvasRows.length : 0));
    frame.count_of_pages = frame.tableRows && frame.tableRows.length > 0 ? Math.ceil(frame.tableRows.length / frame.records_per_page) : 0;
    frame.current_page_no = frame.page_no;
    frame.current_page_first_record = Math.min(frame.from_record + 1, frame.total_no_of_record);
    frame.current_page_last_record = Math.min(frame.to_record, frame.total_no_of_record);
    const pageNumber = [];
    for (let i = 1; i <= frame.total_Pages; i++) {
      pageNumber.push(i);
    }
    frame.pageNumberList = pageNumber;

    // if (frame.display_no_of_records) {
    //   frame.rowsPage = frame.display_no_of_records;
    // }else{
    //   frame.rowsPage=50
    // }



    if (!frame.isClickedRowPerPageTable) {
      if (frame.tableRows.length <= 10) {
        frame.rowsPageList = [frame.tableRows.length]

      } else if (frame.tableRows.length <= 20) {
        frame.rowsPageList = [10, frame.tableRows.length]
      } else if (frame.tableRows.length <= 30) {
        frame.rowsPageList = [10, 20, frame.tableRows.length]
      } else if (frame.tableRows.length <= 50) {
        frame.rowsPageList = [10, 20, 30, frame.tableRows.length]
      } else if (frame.tableRows.length <= 100) {
        frame.rowsPageList = [10, 20, 30, 50, frame.tableRows.length]
      } else {
        frame.rowsPageList = [10, 20, 30, 50, 100]
      }

      if (frame.display_no_of_records) {
        let displayRecord = frame.display_no_of_records;
        let index
        for (let [i, rows] of frame.rowsPageList.entries()) {
          if (displayRecord == rows) {
            break;
          }
          else if (displayRecord < rows) {
            index = i
            break;
          }
        }
        if (index != undefined) {
          frame.rowsPageList.splice(index, 0, displayRecord);
        }


      }
    }
    frame.displayDataLen = frame.records_per_page
    if (!frame.display_no_of_records) {
      let row = frame.rowsPageList.find((v) => v == frame.displayDataLen)
      if (row == undefined && frame.tableData && frame.tableData.length > 0) {
        frame.displayDataLen = frame.rowsPageList[frame.rowsPageList.length - 1]
        // this.displayDataLenChange.emit(this.displayDataLen)
      } else if (row == undefined && frame.tableRows && frame.tableRows.length > 0) {
        frame.displayDataLen = frame.rowsPageList[frame.rowsPageList.length - 1]
        // this.displayDataLenChange.emit(this.displayDataLen)
      }
    }


  }

  set_mirror_values(mitem) {
    let mirror_item = [];
    if (mitem.mirrored_items.indexOf(";") > -1) {
      mirror_item = mitem.mirrored_items.split(";");
    } else {
      mirror_item[0] = mitem.mirrored_items;
    }

    for (let m of mirror_item) {
      //  this.set_item_value(item, m, 0, item.value);

      if (!m) {
        continue;
      }

      let name = m;

      let rowData = this.get_name_index(name, null);

      if (!rowData) {
        return null;
      }

      if (!Array.isArray(rowData)) {
        rowData = [rowData];
      }

      for (let idx of rowData) {
        let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]
        if (frame.apps_page_frame_seqid && (frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' && !(frame.apps_page_frame_seqid).toLowerCase().includes("-para")) { }
        else {

          if (frame.Level4 && frame.Level4.length > 0) {
            // for (let itemGroup of frame.Level4) {
            let itemGroup = frame.Level4[idx.level4Index];
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if (((name == item.apps_item_seqid) || (item.item_name && name && (name.toLowerCase() == item.item_name.toLowerCase())))) {
                  // item.value = mitem.value;
                  // flag = true;
                  // item.isValid = true;
                  // delete item['displaychips'];
                  // delete item['displayChips'];

                  // if (item.lov_code && item.value && item.click_events_str && item.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) {
                  //   item.codeOfValues = item.value;
                  //   item.displayChips = item.value.split("^");
                  //   item.fromMulti = true;
                  // }
                  //  this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount+'#'+frame.apps_page_frame_seqid);

                  this.setValue(item, mitem.value, frame.apps_frame_type, frame.apps_page_frame_seqid, null, false, null, true);
                  //For pipe detect
                  // itemGroup.Level5 = [...itemGroup.Level5];
                  break;
                }
              }
              // }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {

              // for (let itemGroup of tableData) {
              let itemGroup = tableData[idx.level4Index];
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (((name == item.apps_item_seqid) || (item.item_name && name && (name.toLowerCase() == item.item_name.toLowerCase())))) {
                    // item.value = mitem.value;
                    // item.isValid = true;
                    // delete item['displaychips'];
                    // delete item['displayChips'];

                    // if (item.lov_code && item.value && item.click_events_str && item.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) {
                    //   item.codeOfValues = item.value;
                    //   item.displayChips = item.value.split("^");
                    //   item.fromMulti = true;
                    // }
                    // // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
                    // this.refreshFrameItem[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frame.apps_page_frame_seqid] = "Y";

                    this.setValue(item, mitem.value, frame.apps_frame_type, frame.apps_page_frame_seqid, null, false, null, true);
                    //For pipe detect
                    // itemGroup.Level5 = [...itemGroup.Level5];
                    break;
                  }
                }
              }
            }

          }

        }
      }

    }
  }

  get_item_value(name?, index?, flag?) {
    let frameName;
    let itemName;
    let p_flag = false;

    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];

      if (name.indexOf("'") > -1) {
        itemName = name.split(".")[1].split("'")[0];
      } else {
        itemName = name.split(".")[1];
      }

    } else {
      if (name.indexOf("'") > -1) {
        itemName = name.split("'")[0];
      } else {
        itemName = name
      }
    }

    let rowIndex;
    if (index) { rowIndex = index } else { index = 0; }

    if (itemName.toLowerCase() == 'scopeurl') {
      return this.globalObjects.getLocallData('scopeUrl');
    }

    if (itemName.toLowerCase().substring(0, 2) == "g_") {

      if (this.object_mast.global_parameter_map.has(itemName.toUpperCase())) {
        return this.object_mast.global_parameter_map.get(itemName.toUpperCase());
      }

      let userDetails = this.globalObjects.userDetails;

      for (let usr in userDetails) {
        if (usr.toLowerCase() == itemName.toLowerCase()) {
          this.object_mast.global_parameter_map.set(itemName.toUpperCase(), userDetails[usr]);
          return userDetails[usr];
        }
      }

    } else {


      let rowData = this.get_name_index(itemName, frameName);

      if (!rowData) {
        if (itemName && itemName.trim().toLowerCase().startsWith("p_") || itemName.trim().toLowerCase().startsWith("cp_")) {
          p_flag = true;
        } else {
          return;
        }
      }


      if (!p_flag) {
        let idx = frameName ? rowData : rowData[0];
        let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

        if (frame.tableRows && frame.tableRows.length > 0) {

          rowIndex = this.get_current_record(index, frame) ?? 0;

          let tableRows = [];

          tableRows = frame.tableRows;
          if (!flag && !frame.auto_populate_default_where) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              if ((frame.edit_record_index == undefined && rowIndex > frame.tempRows.length - 1) || rowIndex == frame.edit_record_index ||
                (index && typeof (index) == 'string' && (index.toLowerCase().includes("current_record") || index.toLowerCase().includes("wma_record_index")))) {
                rowIndex = 0;
              } else {
                tableRows = frame.tempRows;
              }
            }
          }

          // if (!flag && !frame.auto_populate_default_where) {
          //   if (frame.tempRows && frame.tempRows.length > 0) {
          //     if ((frame.edit_record_index == undefined && rowIndex > frame.tempRows.length - 1) || rowIndex == frame.edit_record_index) {
          //       rowIndex = 0;
          //     } else if (index && typeof (index) == 'string' && (index.toLowerCase().includes("current_record") || index.toLowerCase().includes("wma_record_index"))) {
          //       let itm = this.check_for_current_record(tableRows[0]);

          //       if (itm && (itm.value == 'D' || itm.frame_status == 'dirty')) {
          //         rowIndex = 0;
          //       } else {
          //         tableRows = frame.tempRows;
          //         let frameId = frame.apps_page_frame_seqid + 'A';
          //         let tempFrame = this.get_frame_config(frameId);

          //         if (tempFrame) {
          //           rowIndex = tempFrame.active_row ?? 0;
          //         }
          //       }
          //     } else {
          //       tableRows = frame.tempRows;
          //       // frameId = frame.apps_page_frame_seqid + 'A';
          //     }
          //   }
          // }

          if (tableRows && tableRows[rowIndex]) {
            let itemGroup = tableRows[rowIndex][idx.level4Index];
            // for (let itemGroup of tableRows[rowIndex]) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                  let value;
                  if (item.datatype == "NUMBER") {
                    value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                    if (value) {
                      value = value.toString().replace(/,/g, "");
                      value = parseFloat(value);
                    } else {
                      value = 0;
                    }
                  } else {
                    value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                  }

                  if (name.indexOf("'") > -1) {
                    value = value + "'";
                  } else {
                    if (item.datatype == "NUMBER") {
                      if (value) {
                        value = parseFloat(value);
                      } else {
                        value = value;
                      }
                    } else {
                      value = value;
                    }
                  }

                  return value;
                }
              }
            }
            else {
              if (itemGroup && itemGroup.length > 0) {
                for (let item of itemGroup) {
                  if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                    let value;
                    if (item.datatype == "NUMBER") {
                      value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                      if (value) {
                        value = value.toString().replace(/,/g, "");
                        value = parseFloat(value);
                      } else {
                        value = 0;
                      }
                    } else {
                      value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                    }
                    if (name.indexOf("'") > -1) {
                      return value + "'";
                    } else {
                      return value;
                    }
                  }
                }
              }
            }
            // }

          } else {

            // for (let itemGroup of frame.tableRows[0]) {
            let itemGroup = tableRows[0][idx.level4Index];
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                  let value;
                  if (item.datatype == "NUMBER") {
                    value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                    if (value) {
                      value = value.toString().replace(/,/g, "");
                      value = parseFloat(value);
                    } else {
                      value = 0;
                    }
                  } else {
                    value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                  }

                  if (name.indexOf("'") > -1) {
                    value = value + "'";
                  } else {
                    if (item.datatype == "NUMBER") {
                      if (value) {
                        value = parseFloat(value);
                      } else {
                        value = value;
                      }
                    } else {
                      value = value;
                    }
                  }

                  return value;
                }
              }
            }
            else {
              if (itemGroup && itemGroup.length > 0) {
                for (let item of itemGroup) {
                  if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                    let value;
                    if (item.datatype == "NUMBER") {
                      value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                      if (value) {
                        value = value.toString().replace(/,/g, "");
                        value = parseFloat(value);
                      } else {
                        value = 0;
                      }
                    } else {
                      value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                    }

                    if (name.indexOf("'") > -1) {
                      return value + "'";
                    } else {
                      return value;
                    }
                  }
                }
              }
            }
            // }
          }
        } else {
          // for (let itemGroup of frame.Level4) {
          let itemGroup = frame.Level4[idx.level4Index];
          if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
            for (let item of itemGroup.Level5) {
              if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                if (item.datatype == "NUMBER") {
                  return 0;
                } else {
                  return "";
                }
              }
            }
          }
          // }
        }
      } else {
        let frame = this.get_frame_config(this.object_mast.object_code + '-PARA');

        if (frame) {
          let tableRows = frame.tableRows
          if (tableRows && tableRows[0]) {

            for (let itemGroup of tableRows[0]) {
              // let itemGroup = tableRows[0][idx.level4Index];
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                    let value;
                    if (item.datatype == "NUMBER") {
                      value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                      if (value) {
                        value = value.toString().replace(/,/g, "");
                        value = parseFloat(value);
                      } else {
                        value = 0;
                      }
                    } else {
                      value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                    }

                    if (name.indexOf("'") > -1) {
                      value = value + "'";
                    } else {
                      if (item.datatype == "NUMBER") {
                        if (value) {
                          value = parseFloat(value);
                        } else {
                          value = value;
                        }
                      } else {
                        value = value;
                      }
                    }

                    return value;
                  }
                }
              }
            }
          }
        }
      }


      // for (let object of this.object_mast.Level2) {
      //   for (let frame of object.Level3) {

      //   }
      // }
    }
    // }
    return;
  }

  /**** Get Item Config Start******/

  get_item_config(name, para, index) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    let rowIndex = index;
    if (rowIndex) { } else { rowIndex = 0; }

    let rowData = this.get_name_index(itemName, frameName);

    if (!rowData) {
      return null;
    }

    let idx = frameName ? rowData : rowData[0];
    let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]
    // .Level4[idx.level4Index];
    rowIndex = this.get_current_record(index, frame) ?? 0;

    if (frame.tableRows && frame.tableRows[rowIndex]) {
      // for (let itemGroup of frame.tableRows[rowIndex]) {
      let itemGroup = frame.tableRows[rowIndex][idx.level4Index];
      if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
        for (let item of itemGroup.Level5) {
          if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
            return item[para.toLowerCase().replace("'")];
          }
        }

      } else {
        if (itemGroup && itemGroup.length > 0) {
          for (let item of itemGroup) {
            if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
              return item[para.toLowerCase().replace("'")];
            }
          }
        }
      }
      // }
    } else {
      let framelevel4 = JSON.parse(JSON.stringify(frame.Level4))
      // for (let itemGroup of framelevel4) {
      let itemGroup = framelevel4[idx.level4Index];
      if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
        for (let item of itemGroup.Level5) {
          if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
            return item[para.toLowerCase().replace("'")];
          }
        }

      } else {
        if (itemGroup && itemGroup.length > 0) {
          for (let item of itemGroup) {
            if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
              return item[para.toLowerCase().replace("'")];

            }
          }
        }
      }
      // }

    }

  }

  /**** Get Item Config End******/

  get_item(name, index, flag?, execute_item_flag?) {
    let frameName;
    let itemName;
    let p_flag = false;

    if (!name) return;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      let nameArr = name.split(".");

      if (nameArr.length > 2) {
        frameName = nameArr[0];
        nameArr.splice(0, 1)
        itemName = nameArr.join(".");
      } else {
        frameName = nameArr[0];
        itemName = nameArr[1];
      }
    } else {
      itemName = name;
    }


    let rowData = this.get_name_index(itemName, frameName);

    if (!rowData) {
      if (itemName && itemName.trim().toLowerCase().startsWith("p_") || itemName.trim().toLowerCase().startsWith("cp_")) {
        p_flag = true;
      } else {
        return null;
      }
    }

    let rowIndex = index;
    if (rowIndex) { } else { rowIndex = 0; }

    if (!p_flag) {

      let idx = frameName ? rowData : rowData[0];
      let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]
      // .Level4[idx.level4Index];
      rowIndex = this.get_current_record(index, frame) ?? 0;

      let tableRows = [];


      // if (execute_item_flag) {
      //   if (!flag && !frame.auto_populate_default_where) {
      //     if (frame.tempRows && frame.tempRows.length > 0) {
      //       if ((frame.edit_record_index == undefined && rowIndex > frame.tempRows.length - 1) || rowIndex == frame.edit_record_index) {
      //         rowIndex = 0;
      //       } else if (index && typeof (index) == 'string' && (index.toLowerCase().includes("current_record") || index.toLowerCase().includes("wma_record_index"))) {
      //         let itm = this.check_for_current_record(tableRows[0]);

      //         if (itm && (itm.value == 'D' || itm.frame_status == 'dirty')) {
      //           rowIndex = 0;
      //         } else {
      //           tableRows = frame.tempRows;
      //           let tempFrame = this.get_frame_config(frame.apps_page_frame_seqid + 'A');

      //           if (tempFrame) {
      //             rowIndex = tempFrame.active_row ?? 0;
      //           }
      //         }
      //       } else {
      //         tableRows = frame.tempRows;
      //       }
      //     }
      //   }
      // } else {
      if (flag || frame.edit_record_index == undefined || (rowIndex == frame.edit_record_index) || (frame.tempRows && rowIndex > frame.tempRows.length - 1)) {
        tableRows = frame.tableRows;
        rowIndex = Math.min(rowIndex, (tableRows && tableRows.length > 0 ? tableRows.length - 1 : 0));
      } else {
        tableRows = frame.tempRows;
      }
      // }


      if (tableRows && tableRows[rowIndex]) {

        let itemGroup = tableRows[rowIndex][idx.level4Index];
        // for (let itemGroup of tableRows[rowIndex]) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {

              let item_mast = this.mergelevel5.itemMerge(item, frame.Level4)
              return item_mast;

            }
          }

        } else {
          if (itemGroup && itemGroup.length > 0) {
            for (let item of itemGroup) {
              if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {

                let item_mast = this.mergelevel5.itemMerge(item, frame.Level4)
                return item_mast;

              }
            }
          }
        }
        // }

      } else {
        let framelevel4 = JSON.parse(JSON.stringify(frame.Level4))
        // for (let itemGroup of framelevel4) {
        let itemGroup = framelevel4[idx.level4Index];
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
              return item;
            }
          }

        } else {
          if (itemGroup && itemGroup.length > 0) {
            for (let item of itemGroup) {
              if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
                return item;
              }
            }
          }
        }
      }
    } else {
      let frame = this.get_frame_config(this.object_mast.object_code + '-PARA');

      if (frame) {
        let tableRows = frame.tableRows
        if (tableRows && tableRows[0]) {

          for (let itemGroup of tableRows[0]) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {

                  // return item;
                  let item_mast = this.mergelevel5.itemMerge(item, frame.Level4)
                  return item_mast;
                }
              }

            } else {
              if (itemGroup && itemGroup.length > 0) {
                for (let item of itemGroup) {
                  if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
                    // return item;
                    let item_mast = this.mergelevel5.itemMerge(item, frame.Level4)
                    return item_mast;
                  }
                }
              }
            }
          }

        }
      }


    }
    // }



    // }
    return;
  }

  get_item_sep(name, index, flag?) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }


    // console.log("get_item ==========>>>>>>>>>>>>   " +name);
    let rowIndex = index;
    if (rowIndex) { } else { rowIndex = 0; }

    if (this.object_mast) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
            rowIndex = 0;

            let tableRows = frame.canvasRows;


            if (tableRows && tableRows[rowIndex]) {
              for (let itemGroup of tableRows[rowIndex]) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      return item;
                    }
                  }

                } else {
                  if (itemGroup && itemGroup.length > 0) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
                        return item;
                      }
                    }
                  }
                }
              }
            } else {
              let framelevel4 = JSON.parse(JSON.stringify(frame.Level4))
              for (let itemGroup of framelevel4) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      return item;
                    }
                  }

                } else {
                  if (itemGroup && itemGroup.length > 0) {
                    for (let item of itemGroup) {
                      if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
                        return item;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // }
    return;
  }

  get_level4_item(name) {
    let frameName;
    let itemName;
    if (!name) return;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      let nameArr = name.split(".");

      if (nameArr.length > 2) {
        frameName = nameArr[0];
        nameArr.splice(0, 1)
        itemName = nameArr.join(".");
      } else {
        frameName = nameArr[0];
        itemName = nameArr[1].replaceAll("&&", ".");
      }
    } else {
      itemName = name.replaceAll("&&", ".");
    }

    if (this.object_mast) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

            let framelevel4 = frame.Level4;
            for (let itemGroup of framelevel4) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                    return item;
                  }
                }
              } else {
                if (itemGroup && itemGroup.length > 0) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (itemName.toLowerCase() == item.item_name.toLowerCase())) {
                      return item;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }


  set_visible_flag(nameStr, val, index) {
    let nameArr = nameStr.split(",");

    for (let n of nameArr) {
      this.set_item_config(n, 'item_visible_flag', val, index);
    }
  }

  set_enable_flag(nameStr, val, index) {
    let nameArr = nameStr.split(",");

    for (let n of nameArr) {
      this.set_item_config(n, 'item_enable_flag', val, index);
    }
  }

  /**** Set Item Config Start******/

  // set_item_config(name, paraName, paraValue, index, flag?) {

  //   let frameName;
  //   let itemName;
  //   if (name.indexOf("::") > -1) {
  //     name = name.split("::")[1];
  //   } if (name.indexOf(":") > -1) {
  //     name = name.split(":")[1];
  //   }

  //   if (name.indexOf(".") > -1) {
  //     frameName = name.split(".")[0];
  //     itemName = name.split(".")[1];
  //   } else { itemName = name; }

  //   let rowIndex = index;

  //   if (rowIndex) {
  //     try {
  //       rowIndex = parseInt(rowIndex);
  //     } catch {
  //       rowIndex = rowIndex;
  //     }

  //   } else { rowIndex = 0; }

  //   if (paraName != 'objectData' && paraName != 'msgError') {
  //     paraName = paraName.toLowerCase();
  //   }

  //   if (paraName == 'display_setting_str' && (typeof (paraValue) == 'string')) {
  //     let strArr = paraValue.split(",");
  //     let obj = {};
  //     for (let s of strArr) {
  //       let keys = s.split(":");
  //       let key = keys[0]
  //       if (key.indexOf("{") > -1) {
  //         key = key.split("{")[1];
  //       }
  //       key = key.replace(/'/g, "");
  //       key = key.replace(/"/g, "");
  //       let val = keys[1];
  //       if (val.indexOf("}") > -1) {
  //         val = val.split("}")[0];
  //       }
  //       val = val.replace(/'/g, "");
  //       val = val.replace(/"/g, "");
  //       obj[key] = val;
  //     }
  //     paraValue = obj;
  //   }

  //   if (this.object_mast) {


  //     let rowData = this.get_name_index(itemName, frameName);

  //     if (!rowData) {
  //       return null;
  //     }

  //     if (!Array.isArray(rowData)) {
  //       rowData = [rowData];
  //     }

  //     let rowIndex = index;
  //     if (rowIndex) { } else { rowIndex = 0; }

  //     for (let idx of rowData) {
  //       let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

  //       if (frame.apps_page_frame_seqid && (frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' && (!frameName || !frame.frame_alias || (frame.frame_alias.toUpperCase() != frameName.toUpperCase()))) { } else {
  //         // if (frame.apps_page_frame_seqid && (frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A') { } else {



  //         let tableRows = [];
  //         tableRows = frame.tableRows ? frame.tableRows : [];

  //         if (paraName.toLowerCase() != 'item_visible_flag') {
  //           if (!flag && !frame.auto_populate_default_where) {
  //             if (frame.tempRows && frame.tempRows.length > 0) {
  //               if (frame.edit_record_index == undefined || rowIndex == frame.edit_record_index || frame.edit_record_index == frame.tempRows.length) {
  //                 rowIndex = 0;
  //               } else {
  //                 tableRows = frame.tempRows;
  //               }
  //             }
  //           }
  //         }


  //         if (index == null || index == undefined) {
  //           let frameLevel4 = frame.Level4;
  //           // for (let itemGroup of frameLevel4) {
  //           let itemGroup = frameLevel4[idx.level4Index];
  //           if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //             for (let item of itemGroup.Level5) {
  //               if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
  //                 this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
  //                 this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
  //               }
  //             }

  //           } else {
  //             if (itemGroup && itemGroup.length > 0) {
  //               for (let item of itemGroup) {
  //                 if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
  //                   this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
  //                   this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
  //                 }
  //               }
  //             }
  //           }
  //           // }
  //           if (paraName && paraName.toLowerCase() == 'item_seqno') {
  //             this.seqSort(frameLevel4);
  //           }
  //           ///////////////////////////new code 17 july 2024 start//////

  //           ///////////////////////////commented on 23 april 2026//////
  //           // if (frame.canvasRows && frame.canvasRows.length > 0) {

  //           //   for (let tableData of frame.canvasRows) {
  //           //     for (let itemGroup of tableData) {
  //           //       if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //           //         for (let item of itemGroup.Level5) {
  //           //           if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
  //           //             this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
  //           //             this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
  //           //           }
  //           //         }
  //           //       } else {
  //           //         if (itemGroup && itemGroup.length > 0) {
  //           //           for (let item of itemGroup) {
  //           //             if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
  //           //               this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
  //           //               this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
  //           //             }
  //           //           }
  //           //         }
  //           //       }

  //           //     }
  //           //     if (paraName && paraName.toLowerCase() == 'item_seqno') {
  //           //       this.seqSort(tableData);
  //           //     }
  //           //   }
  //           // }
  //           ///////////////////////////new code 17 july 2024 end//////


  //           if (frame.tableRows && frame.tableRows.length > 0) {

  //             for (let tableData of frame.tableRows) {
  //               // for (let itemGroup of tableData) {
  //               let itemGroup = tableData[idx.level4Index];
  //               if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                 for (let item of itemGroup.Level5) {
  //                   if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
  //                     this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
  //                     this.isSetDimension(item, paraName, frame.apps_page_frame_seqid);
  //                   }

  //                 }
  //               } else {
  //                 if (itemGroup && itemGroup.length > 0) {
  //                   for (let item of itemGroup) {
  //                     if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
  //                       this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
  //                       this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
  //                     }
  //                   }
  //                 }
  //               }
  //               // }
  //               if (paraName && paraName.toLowerCase() == 'item_seqno') {
  //                 this.seqSort(tableData);
  //               }
  //             }
  //           }


  //           if (frame.apps_frame_type == "ENTRY_TABLE" || frame.apps_frame_type == "TABLE" || frame.apps_frame_type == "HORIZONTAL_TABLE") {

  //             let level4 = [];
  //             if (frameLevel4 && frameLevel4.length > 0) {
  //               level4[0] = JSON.parse(JSON.stringify(frameLevel4))
  //               let sepdata = this.seprateData(frame, level4)
  //               frame.headers = sepdata[0];

  //             }

  //             if (frame.summary_flag) {
  //               let frameName = this.get_frame_config(frame.apps_page_frame_seqid);
  //               this.processDataServ.calculateTableRows(frameName);
  //             }


  //             //  frame.headers = JSON.parse(JSON.stringify(frameLevel4));;
  //             let tHead = [];
  //             for (let itemGroup of frameLevel4) {
  //               if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                 for (let item of itemGroup.Level5) {
  //                   if (item.item_visible_flag == "T") {
  //                     tHead.push(item.prompt_name)
  //                   }
  //                 }

  //               } else {
  //                 if (itemGroup && itemGroup.length > 0) {
  //                   for (let item of itemGroup) {
  //                     if (item.item_visible_flag == "T") {
  //                       tHead.push(item.prompt_name)
  //                     }
  //                   }
  //                 }
  //               }
  //             }

  //             frame.tHead = tHead;

  //           }

  //         } else {

  //           rowIndex = this.get_current_record(index, frame) ?? 0;
  //           if (tableRows && tableRows[rowIndex]) {

  //             if (tableRows && tableRows[rowIndex]) {
  //               // for (let itemGroup of tableRows[rowIndex]) {
  //               let itemGroup = tableRows[rowIndex][idx.level4Index];
  //               if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                 for (let item of itemGroup.Level5) {
  //                   if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
  //                     this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
  //                     this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
  //                   }
  //                 }
  //               } else {
  //                 if (itemGroup && itemGroup.length > 0) {
  //                   for (let item of itemGroup) {
  //                     if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
  //                       this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
  //                       this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }

  //     }

  //   }
  //   return;
  // }


  set_item_config(name, paraName, paraValue, index, flag?) {

    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else { itemName = name; }

    let rowIndex = index;

    if (rowIndex) {
      try {
        rowIndex = parseInt(rowIndex);
      } catch {
        rowIndex = rowIndex;
      }

    } else { rowIndex = 0; }

    if (paraName != 'objectData' && paraName != 'msgError') {
      paraName = paraName.toLowerCase();
    }

    if (paraName == 'display_setting_str' && (typeof (paraValue) == 'string')) {
      let strArr = paraValue.split(",");
      let obj = {};
      for (let s of strArr) {
        let keys = s.split(":");
        let key = keys[0]
        if (key.indexOf("{") > -1) {
          key = key.split("{")[1];
        }
        key = key.replace(/'/g, "");
        key = key.replace(/"/g, "");
        let val = keys[1];
        if (val.indexOf("}") > -1) {
          val = val.split("}")[0];
        }
        val = val.replace(/'/g, "");
        val = val.replace(/"/g, "");
        obj[key] = val;
      }
      paraValue = obj;
    }

    if (this.object_mast) {


      let rowIndex = index;
      if (rowIndex) { } else { rowIndex = 0; }

      if (itemName.toUpperCase() == "ALL") {

        let frame = this.get_frame_config(frameName);

        if (!frame) return;

        if (frame.apps_page_frame_seqid && (frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' && (!frameName || !frame.frame_alias || (frame.frame_alias.toUpperCase() != frameName.toUpperCase()))) { } else {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

            rowIndex = this.get_current_record(index, frame) ?? 0;

            let tableRows = [];
            tableRows = frame.tableRows ? frame.tableRows : [];
            let frameId = frame.apps_page_frame_seqid;
            if (paraName.toLowerCase() != 'item_visible_flag') {
              if (!flag && !frame.auto_populate_default_where) {
                if (frame.tempRows && frame.tempRows.length > 0) {
                  if (frame.edit_record_index == undefined || rowIndex == frame.edit_record_index || frame.edit_record_index == frame.tempRows.length) {
                    rowIndex = 0;
                  } else {
                    tableRows = frame.tempRows;
                    frameId = frame.apps_page_frame_seqid + 'A';
                  }
                }
              }
            } else {
              let isAssociateFrame = this.get_frame_config(frame.apps_page_frame_seqid + 'A');
              if (!isAssociateFrame) {
                index = null;
              }
            }

            if (tableRows && tableRows[rowIndex]) {

              if (tableRows && tableRows[rowIndex]) {
                for (let itemGroup of tableRows[rowIndex]) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if (frame && itemName.toUpperCase() == "ALL") {
                        this.set_config(name, item, paraName, paraValue, frameId)
                        this.isSetDimension(item, paraName, frameId)
                        //For pipe detect
                        // itemGroup.Level5 = [...itemGroup.Level5];
                      }
                    }
                  } else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {
                        if (frame && itemName.toUpperCase() == "ALL") {
                          this.set_config(name, item, paraName, paraValue, frameId)
                          this.isSetDimension(item, paraName, frameId)
                          //For pipe detect
                          // itemGroup = [...itemGroup];
                        }
                      }
                    }
                  }
                }
              }
            }

            if (index == null || index == undefined) {
              // let frameLevel4 = frame.Level4;
              let frameLevel4 = frame.apexFrameLevel4 ?? frame.Level4;
              for (let itemGroup of frameLevel4) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (frame && itemName.toUpperCase() == "ALL") {
                      this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                      this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                      //For pipe detect
                      // itemGroup.Level5 = [...itemGroup.Level5];
                    }
                  }

                } else {
                  if (itemGroup && itemGroup.length > 0) {
                    for (let item of itemGroup) {
                      if (frame && itemName.toUpperCase() == "ALL") {
                        this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                        this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                        //For pipe detect
                        // itemGroup = [...itemGroup];
                      }
                    }
                  }
                }
              }
              if (paraName && paraName.toLowerCase() == 'item_seqno') {
                this.seqSort(frameLevel4);
              }
              ///////////////////////////new code 17 july 2024 start//////
              if (frame.canvasRows && frame.canvasRows.length > 0) {

                for (let tableData of frame.canvasRows) {
                  for (let itemGroup of tableData) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if (frame && itemName.toUpperCase() == "ALL") {
                          this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                          this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                          //For pipe detect
                          // itemGroup.Level5 = [...itemGroup.Level5];
                        }
                      }
                    } else {
                      if (itemGroup && itemGroup.length > 0) {
                        for (let item of itemGroup) {
                          if (frame && itemName.toUpperCase() == "ALL") {
                            this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                            this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                            //For pipe detect
                            // itemGroup = [...itemGroup];
                          }
                        }
                      }
                    }

                  }
                  if (paraName && paraName.toLowerCase() == 'item_seqno') {
                    this.seqSort(tableData);
                  }
                }
              }
              ///////////////////////////new code 17 july 2024 end//////




              if (frame.tableRows && frame.tableRows.length > 0) {
                for (let tableData of frame.tableRows) {
                  for (let itemGroup of tableData) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if (frame && itemName.toUpperCase() == "ALL") {
                          this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                          this.isSetDimension(item, paraName, frame.apps_page_frame_seqid);
                          //For pipe detect
                          // itemGroup.Level5 = [...itemGroup.Level5];
                        }
                      }
                    } else {
                      if (itemGroup && itemGroup.length > 0) {
                        for (let item of itemGroup) {
                          if (frame && itemName.toUpperCase() == "ALL") {
                            this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                            this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                            //For pipe detect
                            // itemGroup = [...itemGroup];
                          }
                        }
                      }
                    }
                  }

                  if (paraName && paraName.toLowerCase() == 'item_seqno') {
                    this.seqSort(tableData);
                  }
                }
              }



              if ((frame.apps_frame_type == "ENTRY_TABLE" || frame.apps_frame_type == "TABLE" || frame.apps_frame_type == "HORIZONTAL_TABLE") && paraName && paraName.toLowerCase() != "calling_object_code") {
                // frame.headers = JSON.parse(JSON.stringify(frameLevel4));

                let level4 = [];
                if (frameLevel4 && frameLevel4.length > 0) {
                  level4[0] = JSON.parse(JSON.stringify(frameLevel4))
                  let sepdata = this.seprateData(frame, level4)
                  frame.headers = sepdata[0];

                }

                if (frame.summary_flag) {
                  // let frameName = this.get_frame_config(frame.apps_page_frame_seqid);
                  // this.processDataServ.calculateTableRows(frameName);

                  this.calculateFrames[frame.apps_page_frame_seqid] = "Y";
                }


                //  frame.headers = JSON.parse(JSON.stringify(frameLevel4));;
                let tHead = [];
                for (let itemGroup of frameLevel4) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if (item.item_visible_flag == "T") {
                        tHead.push(item.prompt_name)
                      }
                    }

                  } else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {
                        if (item.item_visible_flag == "T") {
                          tHead.push(item.prompt_name)
                        }
                      }
                    }
                  }
                }

                frame.tHead = tHead;

              }

            }
          }
        }



      } else {

        let rowData = this.get_name_index(itemName, frameName);

        if (!rowData) {
          return null;
        }

        if (!Array.isArray(rowData)) {
          rowData = [rowData];
        }
        for (let idx of rowData) {
          let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

          if (frame.apps_page_frame_seqid && (frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' && (!frameName || !frame.frame_alias || (frame.frame_alias.toUpperCase() != frameName.toUpperCase()))) { } else {
            // if (frame.apps_page_frame_seqid && (frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A') { } else {



            let tableRows = [];
            tableRows = frame.tableRows ? frame.tableRows : [];

            rowIndex = this.get_current_record(index, frame) ?? 0;

            if (paraName.toLowerCase() != 'item_visible_flag') {
              if (!flag && !frame.auto_populate_default_where) {
                if (frame.tempRows && frame.tempRows.length > 0) {
                  if (frame.edit_record_index == undefined || rowIndex == frame.edit_record_index || frame.edit_record_index == frame.tempRows.length) {
                    rowIndex = 0;
                  } else {
                    tableRows = frame.tempRows;
                  }
                }
              }
            } else {
              let isAssociateFrame = this.get_frame_config(frame.apps_page_frame_seqid + 'A');
              if (!isAssociateFrame) {
                index = null;
              }
            }


            if (index == null || index == undefined) {
              // let frameLevel4 = frame.Level4;
              let frameLevel4 = frame.apexFrameLevel4 ?? frame.Level4;
              // for (let itemGroup of frameLevel4) {
              let itemGroup = frameLevel4[idx.level4Index];
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                    this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                    this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                    //For pipe detect
                    // itemGroup.Level5 = [...itemGroup.Level5];
                  }
                }

              } else {
                if (itemGroup && itemGroup.length > 0) {
                  for (let item of itemGroup) {
                    if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                      this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                      this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                      //For pipe detect
                      // itemGroup = [...itemGroup];
                    }
                  }
                }
              }
              // }
              if (paraName && paraName.toLowerCase() == 'item_seqno') {
                this.seqSort(frameLevel4);
                this.object_mast._object_indexes = this.buildItemIndexes(this.object_mast);
              }
              ///////////////////////////new code 17 july 2024 start//////

              ///////////////////////////commented on 23 april 2026//////
              if (frame.canvasRows && frame.canvasRows.length > 0) {
                let flag = false;
                for (let tableData of frame.canvasRows) {
                  for (let itemGroup of tableData) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                          this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                          this.isSetDimension(item, paraName, frame.apps_page_frame_seqid);
                          //For pipe detect
                          // itemGroup.Level5 = [...itemGroup.Level5];
                          if (frameName) {
                            flag = true;
                            break;
                          }
                        }
                      }
                    } else {
                      if (itemGroup && itemGroup.length > 0) {
                        for (let item of itemGroup) {
                          if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                            this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                            this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                            //For pipe detect
                            // itemGroup = [...itemGroup];
                          }
                        }
                      }
                    }

                    if (flag) {
                      break;
                    }
                  }
                  if (paraName && paraName.toLowerCase() == 'item_seqno') {
                    this.seqSort(tableData);
                  }
                }
              }
              ///////////////////////////new code 17 july 2024 end//////


              if (frame.tableRows && frame.tableRows.length > 0) {

                for (let tableData of frame.tableRows) {
                  // for (let itemGroup of tableData) {
                  let itemGroup = tableData[idx.level4Index];
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                        this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                        this.isSetDimension(item, paraName, frame.apps_page_frame_seqid);
                        //For pipe detect
                        // itemGroup.Level5 = [...itemGroup.Level5];
                      }

                    }
                  } else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {
                        if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                          this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                          this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                          //For pipe detect
                          // itemGroup = [...itemGroup];
                        }
                      }
                    }
                  }
                  // }
                  if (paraName && paraName.toLowerCase() == 'item_seqno') {
                    this.seqSort(tableData);
                    this.object_mast._object_indexes = this.buildItemIndexes(this.object_mast);
                  }
                }
              }


              if (frame.apps_frame_type == "ENTRY_TABLE" || frame.apps_frame_type == "TABLE" || frame.apps_frame_type == "HORIZONTAL_TABLE") {

                let level4 = [];
                if (frameLevel4 && frameLevel4.length > 0) {
                  level4[0] = JSON.parse(JSON.stringify(frameLevel4))
                  let sepdata = this.seprateData(frame, level4)
                  frame.headers = sepdata[0];

                }

                if (frame.summary_flag) {
                  // let frameName = this.get_frame_config(frame.apps_page_frame_seqid);
                  // this.processDataServ.calculateTableRows(frameName);

                  this.calculateFrames[frame.apps_page_frame_seqid] = "Y";
                }


                //  frame.headers = JSON.parse(JSON.stringify(frameLevel4));;
                let tHead = [];
                for (let itemGroup of frameLevel4) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if (item.item_visible_flag == "T") {
                        tHead.push(item.prompt_name)
                      }
                    }

                  } else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {
                        if (item.item_visible_flag == "T") {
                          tHead.push(item.prompt_name)
                        }
                      }
                    }
                  }
                }

                frame.tHead = tHead;

              }

            } else {

              // rowIndex = this.get_current_record(index, frame) ?? 0;
              if (tableRows && tableRows[rowIndex]) {

                if (tableRows && tableRows[rowIndex]) {
                  // for (let itemGroup of tableRows[rowIndex]) {
                  let itemGroup = tableRows[rowIndex][idx.level4Index];
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                        this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                        this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                        //For pipe detect
                        // itemGroup.Level5 = [...itemGroup.Level5];
                      }
                    }
                  } else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {
                        if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                          this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                          this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                          //For pipe detect
                          // itemGroup = [...itemGroup];
                        }
                      }
                    }
                  }
                }
              }
            }
          }

        }
      }

    }
    return;
  }

  /**** Set Item Config End******/

  seqSort(frameLevel4) {
    // let level4 = frameLevel4;
    // if (level4.length > 0) {
    //   for (let l4i = 0; l4i < level4.length - 1; l4i++) {
    //     //  let n=level4[l4i].Level5.length
    //     //   if(n>1){
    //     //     for(let i=0;i<n-1;i++){
    //     //       for(let j=0;j<n-i-1;j++){
    //     //           if(parseInt(level4[l4i].Level5[j].item_seqno)>parseInt(level4[l4i].Level5[j+1].item_seqno)){
    //     //               [level4[l4i].Level5[j],level4[l4i].Level5[j+1]]=[level4[l4i].Level5[j+1],level4[l4i].Level5[j]]
    //     //           }
    //     //       }
    //     //   }
    //     //   }
    //     if (level4[l4i].Level5[0].item_seqno && level4[l4i + 1].Level5[0].item_seqno) {
    //       if (parseInt(level4[l4i].Level5[0].item_seqno) > parseInt(level4[l4i + 1].Level5[0].item_seqno)) {
    //         [level4[l4i], level4[l4i + 1]] = [level4[l4i + 1], level4[l4i]]
    //       }
    //     }
    //   }
    // }
    let level4 = frameLevel4;
    if (level4.length > 0) {
      level4.sort((a, b) => {
        // parseFloat
        if (parseFloat(a.Level5[0].item_seqno) < parseFloat(b.Level5?.[0].item_seqno)) {
          return -1;
        } else if (parseFloat(a.Level5[0].item_seqno) > parseFloat(b.Level5?.[0].item_seqno)) {
          return 1;
        } else {
          return 0
        }

      }

      )
    }
  }
  set_item_seq(frameName, itemName, paraValue) {
    let frame = this.get_frame_config(frameName);

    if (typeof (paraValue) != 'string') {
      paraValue.toString();
    }

    if (frame) {
      let level4 = frame.Level4;
      let moveItem;
      for (let itemGrp of level4) {
        for (let item of itemGrp.Level5) {
          if (item.item_name.toUpperCase() == itemName.toUpperCase()) {
            moveItem = JSON.parse(JSON.stringify(itemGrp))
          }
        }
      }

      if (moveItem) {
        let arr = [];
        let dontCheck = false;
        for (let itemGrp of level4) {
          let flag = true;
          let seqFlag = false;

          for (let item of itemGrp.Level5) {
            if (item.item_name.toUpperCase() == itemName.toUpperCase()) {
              flag = false;
            }

            if (parseFloat(item.item_seqno) > parseFloat(paraValue)) {
              seqFlag = true;
            }
          }

          if (seqFlag && !dontCheck) {
            arr.push(moveItem);
            dontCheck = true;
          }

          if (flag) {
            arr.push(itemGrp);
          }
        }

        frame.Level4 = arr;

        if (frame.summary_flag) {
          // let frameName = this.get_frame_config(frame.apps_page_frame_seqid);
          // this.processDataServ.calculateTableRows(frameName);

          this.calculateFrames[frame.apps_page_frame_seqid] = "Y";
        }
      }
    }
  }


  set_item_search(name, value) {
    let frameName;
    let itemName;

    name = name.replaceAll("'", "");
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    let frame = this.get_frame_config(frameName);

    if (frame) {
      let frameLevel4 = frame.headers;
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true) {
              return item["search"] = value;
            } else if (item.containerRowss && item.containerRowss.length > 0) {
              for (let cGrp of item.containerRowss) {
                for (let cItem of cGrp.Level5) {
                  if (itemName ? ((itemName == cItem.apps_item_seqid) || (cItem.item_name && itemName && (itemName.toLowerCase() == cItem.item_name.toLowerCase()))) : true) {
                    return cItem["search"] = value;
                  }
                }
              }
            }
          }
        }
      }
    }
  }



  get_item_search(name) {
    let frameName;
    let itemName;

    name = name.replaceAll("'", "");
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    let frame = this.get_frame_config(frameName);

    if (frame && frame.headers) {
      let frameLevel4 = frame.headers;
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true) {
              return item;
            } else if (item.containerRowss && item.containerRowss.length > 0) {
              for (let cGrp of item.containerRowss) {
                for (let cItem of cGrp.Level5) {
                  if (itemName ? ((itemName == cItem.apps_item_seqid) || (cItem.item_name && itemName && (itemName.toLowerCase() == cItem.item_name.toLowerCase()))) : true) {
                    return cItem;
                  }
                }
              }
            }
          }
        }
      }
    }

    return null;
  }

  /**** Set Multiple row Config Start******/

  set_rows_source_config(frameName, items, index) {

    let rowIndex;
    if (index) { rowIndex = index } else { index = 0; }

    if (this.object_mast) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {
            if (frame.tableRows && frame.tableRows.length > 0) {
              if (items.length > 1) {

                rowIndex = this.get_current_record(index, frame) ?? 0;
                if (frame.tableRows && frame.tableRows[rowIndex]) {
                  for (let itemGroup of frame.tableRows[rowIndex]) {
                    for (let itemName of items) {
                      if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                        for (let item of itemGroup.Level5) {
                          if (((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase())))) {
                            item[itemName.para_name] = itemName.para_value
                            // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
                            //For pipe detect
                            // itemGroup.Level5 = [...itemGroup.Level5];
                            this.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frame.apps_page_frame_seqid] = "Y";
                          }
                        }
                      } else {
                        if (itemGroup && itemGroup.length > 0) {
                          for (let item of itemGroup) {
                            if ((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase()))) {
                              item[itemName.para_name] = itemName.para_value
                              // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
                              //For pipe detect
                              // itemGroup = [...itemGroup];
                              this.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frame.apps_page_frame_seqid] = "Y";
                            }
                          }
                        }
                      }
                    }
                  }
                }

              }
            } else if (items.length == 1) {
              for (let tableData of frame.tableRows) {
                for (let itemGroup of tableData) {
                  for (let itemName of items) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if (((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase())))) {
                          item[itemName.para_name] = itemName.para_value
                          // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
                          //For pipe detect
                          // itemGroup.Level5 = [...itemGroup.Level5];
                          this.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frame.apps_page_frame_seqid] = "Y";
                        }
                      }
                    } else {
                      if (itemGroup && itemGroup.length > 0) {
                        for (let item of itemGroup) {
                          if ((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase()))) {
                            item[itemName.para_name] = itemName.para_value
                            // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
                            //For pipe detect
                            // itemGroup = [...itemGroup];
                            this.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frame.apps_page_frame_seqid] = "Y";
                          }
                        }
                      }
                    }
                  }
                }
              }
              return;
            } else {
              if (frame.Level4 && frame.Level4.length > 0) {
                let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
                for (let itemGroup of frameLevel4) {
                  for (let itemName of items) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if (((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase())))) {
                          item[itemName.para_name] = itemName.para_value
                          //For pipe detect
                          // itemGroup.Level5 = [...itemGroup.Level5];
                        }
                      }
                    } else {
                      if (itemGroup && itemGroup.length > 0) {
                        for (let item of itemGroup) {
                          if ((itemName.item_name == item.apps_item_seqid) || (item.item_name && itemName.item_name && (itemName.item_name.toLowerCase() == item.item_name.toLowerCase()))) {
                            item[itemName.para_name] = itemName.para_value
                            //For pipe detect
                            // itemGroup = [...itemGroup];
                          }
                        }
                      }
                    }
                  }
                }
                frame.tableRows = [];
                frame.tableRows[0] = frameLevel4;
                // this.cdEngine.detect(frame.apps_page_frame_seqid);
                this.refreshFrames[frame.apps_page_frame_seqid] = "Y";
              }
            }
          }
        }
      }
    }
  }

  /**** Set Multiple row Config End******/

  /****  Get Frame Config Start******/

  get_frame_config(name, type?, flag?) {
    let frameName;
    let itemName;

    if (!name) return null;

    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      frameName = name;
    }
    if (this.object_mast) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if (frameName && ((frame.apps_page_frame_seqid == frameName.toUpperCase()) || (frame.frame_alias && frame.frame_alias.toUpperCase() == frameName.toUpperCase()))) {
            if (type) {
              return this.get_seq_item(frame, type);
            } else {
              return frame;
            }
          }
        }
      }
    }


    if (flag) {
      this.msgbox({}, `Frame '${name}' not found`);
    }
    return null;
  }


  get_seq_item(frame, type) {
    if (type.toLowerCase() == 'first_item') {
      if (frame && frame.tableRows && frame.tableRows.length > 0) {
        for (let itemGroup of frame.tableRows[frame.active_row]) {
          for (let item of itemGroup.Level5) {
            if (item.item_visible_flag == 'T' && item.item_enable_flag == 'T') {
              return item.item_name;
            }
          }
        }
      }
    } else if (type.toLowerCase() == 'next_item') {
      this.onKeyupEnter();
    }
  }


  onKeyupEnter() {
    if (isPlatformServer(this.platformId)) return;
    var nextEl = this.findNextTabStop(document.activeElement);
    return nextEl;
    console.log(nextEl);
  }

  // @HostListener('keyup.tab', ['$event'])
  // onKeyupTab(event) {
  //   event.prevent();
  //   var nextEl = this.findNextTabStop(document.activeElement);
  //   nextEl.focus();
  // }

  findNextTabStop(el) {
    if (isPlatformServer(this.platformId)) return;
    var universe = document.querySelectorAll(
      "input,select"
    );
    var list = Array.prototype.filter.call(universe, (item) => {
      return item.tabIndex >= "0";
      //  return item.tabIndex;
    });
    var index = list.indexOf(el);
    index++;
    while (index < list.length) {
      if (!list[index].readOnly && !list[index].disabled && list[index].type != 'hidden') {
        return list[index];
      } else {
        index++;
      }
    }
    return list[0];
  }

  /****  Get Frame Config End******/
  /****  Set Frame Config Start******/

  set_frame_config(name, paraName, paraValue) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      frameName = name;
    }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if (!frameName || (frameName && ((frame.apps_page_frame_seqid == frameName.toUpperCase()) || (frame.frame_alias && (frame.frame_alias.toUpperCase() == frameName.toUpperCase()))))) {
          if (paraName.toLowerCase() == 'visible') {
            if (paraValue.toLowerCase() == 'f') {
              frame.temp_frame_type = frame.apps_frame_type != 'F' ? frame.apps_frame_type : frame.temp_frame_type;
              frame.apps_frame_type = 'F';
              // this.cdEngine.detect(frame.apps_page_frame_seqid);
              this.refreshFrames[frame.apps_page_frame_seqid] = "Y";
              if (frameName) {
                return;
              }
            } else {
              frame.apps_frame_type = frame.temp_frame_type != undefined ? frame.temp_frame_type : frame.apps_frame_type;
              delete frame['temp_frame_type'];
              if (frameName) {
                // this.cdEngine.detect(frame.apps_page_frame_seqid);
                this.refreshFrames[frame.apps_page_frame_seqid] = "Y";
                return;
              }
            }
          } else {
            if (frameName) {
              return frame[paraName.toLowerCase()] = paraValue;
            }
          }

        }
      }
    }
    return null;
  }

  /****  Set Frame Config End******/

  get_page_config(pageNum, paraName) {
    return this.object_mast.Level2[pageNum - 1][paraName.toLowerCase()];
  }

  set_page_config(pageNum, paraName, paraValue) {
    return this.object_mast.Level2[pageNum - 1][paraName.toLowerCase()] = paraValue;
  }

  ////**********************************  Aggrigation Functions Starts***********************////

  // sum(name) {
  //   let frameName;
  //   let itemName;
  //   if (name.indexOf("::") > -1) {
  //     name = name.split("::")[1];
  //   } if (name.indexOf(":") > -1) {
  //     name = name.split(":")[1];
  //   }

  //   if (name.indexOf(".") > -1) {
  //     frameName = name.split(".")[0];
  //     itemName = name.split(".")[1];
  //   } else {
  //     itemName = name;
  //   }

  //   if (this.object_mast) {
  //     let value = 0;
  //     for (let object of this.object_mast.Level2) {
  //       for (let frame of object.Level3) {
  //         if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

  //           if ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A') {
  //             let to = frame.apps_page_frame_seqid.slice(0, (frame.apps_page_frame_seqid.length - 1));
  //             let mainFrame = this.get_frame_config(to);
  //             if (mainFrame.edit_record_index != undefined || mainFrame.indexStr) {
  //               let editArr = [];
  //               editArr = mainFrame.indexStr ? mainFrame.indexStr.split(";") : [mainFrame.edit_record_index];
  //               for (let i = 0; i < frame.tableRows.length; i++) {
  //                 let isKey = editArr.find(x => x == i);
  //                 if (isKey == undefined || isKey == null) {
  //                   for (let itemGroup of frame.tableRows[i]) {
  //                     if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                       for (let item of itemGroup.Level5) {
  //                         if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                           // value = value + parseFloat((item.value).replace(/,/g, ""));

  //                           value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                         }
  //                       }

  //                     } else {
  //                       if (itemGroup && itemGroup.length > 0) {
  //                         for (let item of itemGroup) {
  //                           if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                             //  value = value + parseFloat((item.value).replace(/,/g, ""));

  //                             value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }

  //               if (mainFrame) {
  //                 if (mainFrame.tableRows && mainFrame.tableRows.length > 0) {
  //                   for (let tableData of mainFrame.tableRows) {
  //                     for (let itemGroup of tableData) {
  //                       if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                         for (let item of itemGroup.Level5) {
  //                           if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                             // value = value + parseFloat((item.value).replace(/,/g, ""));

  //                             value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                           }
  //                         }

  //                       } else {
  //                         if (itemGroup && itemGroup.length > 0) {
  //                           for (let item of itemGroup) {
  //                             if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                               //  value = value + parseFloat((item.value).replace(/,/g, ""));

  //                               value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }

  //             } else {
  //               if (frame.tableRows && frame.tableRows.length > 0) {
  //                 for (let tableData of frame.tableRows) {
  //                   for (let itemGroup of tableData) {
  //                     if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                       for (let item of itemGroup.Level5) {
  //                         if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                           // value = value + parseFloat((item.value).replace(/,/g, ""));

  //                           value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                         }
  //                       }

  //                     } else {
  //                       if (itemGroup && itemGroup.length > 0) {
  //                         for (let item of itemGroup) {
  //                           if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                             //  value = value + parseFloat((item.value).replace(/,/g, ""));

  //                             value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }


  //             }
  //           } else {

  //             if (frame.tableRows && frame.tableRows.length > 0) {
  //               for (let tableData of frame.tableRows) {
  //                 for (let itemGroup of tableData) {
  //                   if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                     for (let item of itemGroup.Level5) {
  //                       if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                         // value = value + parseFloat((item.value).replace(/,/g, ""));

  //                         value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                       }
  //                     }

  //                   } else {
  //                     if (itemGroup && itemGroup.length > 0) {
  //                       for (let item of itemGroup) {
  //                         if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                           //  value = value + parseFloat((item.value).replace(/,/g, ""));

  //                           value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }

  //             let to = frame.apps_page_frame_seqid.slice(0, (frame.apps_page_frame_seqid.length - 1));
  //             let mainFrame = this.get_frame_config(to);

  //             if (mainFrame) {

  //               if (mainFrame.tableRows && mainFrame.tableRows.length > 0) {
  //                 for (let tableData of mainFrame.tableRows) {
  //                   for (let itemGroup of tableData) {
  //                     if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                       for (let item of itemGroup.Level5) {
  //                         if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                           // value = value + parseFloat((item.value).replace(/,/g, ""));

  //                           value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                         }
  //                       }

  //                     } else {
  //                       if (itemGroup && itemGroup.length > 0) {
  //                         for (let item of itemGroup) {
  //                           if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                             //  value = value + parseFloat((item.value).replace(/,/g, ""));

  //                             value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }

  //           }
  //         }
  //         //}
  //       }
  //     }
  //     return value;
  //   }

  // }

  sum(name, where?) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast && frameName) {
      let value = 0;

      let rowData = this.get_name_index(itemName, frameName);

      if (!rowData) {
        return value;
      }

      let idx = frameName ? rowData : rowData[0];
      let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

      if (frame) {

        if (where) {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {

                  let cond = this.check_cond(frame.tempRows[i], where);

                  if (cond) {
                    let item = this.get_rows_item(frame.tempRows[i], itemName);
                    if (item) {
                      value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                    }
                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              let cond = this.check_cond(tableData, where);

              if (cond) {
                let item = this.get_rows_item(tableData, itemName)
                if (item) {
                  value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                }
              }
            }
          }

        } else {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {
                  // for (let itemGroup of frame.tempRows[i]) {
                  let itemGroup = frame.tempRows[i][idx.level4Index];
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                        // value = value + parseFloat((item.value).replace(/,/g, ""));
                        value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                      }
                    }
                  }
                  // }
                }
              }

            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              // for (let itemGroup of tableData) {
              let itemGroup = tableData[idx.level4Index];
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                    // value = value + parseFloat((item.value).replace(/,/g, ""));

                    value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                  }
                }

              }
            }
            // }
          }
        }

      }

      return value;
    } else {
      alert("Please enter frame_alias on aggrigate functions");
    }

  }


  ///***** chnage done on 7/7/2026 but comented */
  //   sum(name, where?) {
  //   let frameName;
  //   let itemName;
  //   if (name.indexOf("::") > -1) {
  //     name = name.split("::")[1];
  //   } if (name.indexOf(":") > -1) {
  //     name = name.split(":")[1];
  //   }

  //   if (name.indexOf(".") > -1) {
  //     frameName = name.split(".")[0];
  //     itemName = name.split(".")[1];
  //   } else {
  //     itemName = name;
  //   }

  //   if (this.object_mast && frameName) {
  //     let value = 0;

  //     let rowData = this.get_name_index(itemName, frameName);

  //     if (!rowData) {
  //       return value;
  //     }

  //     let idx = frameName ? rowData : rowData[0];
  //     let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index];
  //     let decimalVal = 0;

  //     if (frame) {

  //       if (where) {

  //         if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
  //           if (frame.tempRows && frame.tempRows.length > 0) {
  //             let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

  //             for (let i = 0; i < frame.tempRows.length; i++) {
  //               let isThere = editIndArr.find(x => x == i);

  //               if (isThere == undefined) {

  //                 let cond = this.check_cond(frame.tempRows[i], where);

  //                 if (cond) {
  //                   let item = this.get_rows_item(frame.tempRows[i], itemName);
  //                   if (item) {

  //                     let val = item.value ? (item.value).toString().replace(/,/g, "") : "0";
  //                     if (val.includes(".")) {
  //                       decimalVal = decimalVal > val.split(".")[1].length ? decimalVal : val.split(".")[1].length
  //                     }
  //                     value = value + parseFloat(val);
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }

  //         if (frame.tableRows && frame.tableRows.length > 0) {
  //           for (let tableData of frame.tableRows) {
  //             let cond = this.check_cond(tableData, where);

  //             if (cond) {
  //               let item = this.get_rows_item(tableData, itemName)
  //               if (item) {
  //                 let val = item.value ? (item.value).toString().replace(/,/g, "") : "0";
  //                 if (val.includes(".")) {
  //                   decimalVal = decimalVal > val.split(".")[1].length ? decimalVal : val.split(".")[1].length
  //                 }
  //                 value = value + parseFloat(val);
  //               }
  //             }
  //           }
  //         }

  //       } else {

  //         if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
  //           if (frame.tempRows && frame.tempRows.length > 0) {
  //             let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

  //             for (let i = 0; i < frame.tempRows.length; i++) {
  //               let isThere = editIndArr.find(x => x == i);

  //               if (isThere == undefined) {
  //                 // for (let itemGroup of frame.tempRows[i]) {
  //                 let itemGroup = frame.tempRows[i][idx.level4Index];
  //                 if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                   for (let item of itemGroup.Level5) {
  //                     if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                       // value = value + parseFloat((item.value).replace(/,/g, ""));

  //                       let val = item.value ? (item.value).toString().replace(/,/g, "") : "0";
  //                       if (val.includes(".")) {
  //                         decimalVal = decimalVal > val.split(".")[1].length ? decimalVal : val.split(".")[1].length
  //                       }

  //                       value = value + parseFloat(val);
  //                     }
  //                   }
  //                 }
  //                 // }
  //               }
  //             }

  //           }
  //         }

  //         if (frame.tableRows && frame.tableRows.length > 0) {
  //           for (let tableData of frame.tableRows) {
  //             // for (let itemGroup of tableData) {
  //             let itemGroup = tableData[idx.level4Index];
  //             if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //               for (let item of itemGroup.Level5) {
  //                 if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                   // value = value + parseFloat((item.value).replace(/,/g, ""));

  //                   let val = item.value ? (item.value).toString().replace(/,/g, "") : "0";
  //                   if (val.includes(".")) {
  //                     decimalVal = decimalVal > val.split(".")[1].length ? decimalVal : val.split(".")[1].length
  //                   }

  //                   value = value + parseFloat(val);
  //                 }
  //               }

  //             }
  //           }
  //           // }
  //         }
  //       }

  //     }

  //     return value.toFixed(decimalVal);
  //   } else {
  //     alert("Please enter frame_alias on aggrigate functions");
  //   }

  // }

  check_cond(tableRows, where?) {

    let cond;
    if (where.indexOf("and") > -1) {
      let conArr = [];
      conArr = where.split("and");

      for (let c of conArr) {

        let cArr = c.split("=");

        let val = this.get_rows_item(tableRows, cArr[0]);
        let val0 = val ? val.value : '';
        let val1;
        if (cArr[1] && cArr[1].includes(":")) {
          val1 = this.get_item_value(cArr[1], 'current_record', true);

        } else {
          val1 = cArr[1] ? cArr[1].replaceAll("'", "").trim() : cArr[1];
        }

        cArr[0] = val0 ? "'" + val0 + "'" : "''";
        cArr[1] = val1 ? "'" + val1 + "'" : "''";
        cond = cArr.join("==");

      }
      cond = conArr.join(" && ");
    } else {
      let cArr = where.split("=");

      let val = this.get_rows_item(tableRows, cArr[0]);
      let val0 = val ? val.value : '';
      let val1;
      if (cArr[1] && cArr[1].includes(":")) {
        val1 = this.get_item_value(cArr[1], 'current_record', true);

      } else {
        val1 = cArr[1] ? cArr[1].replaceAll("'", "").trim() : cArr[1];
      }

      cArr[0] = val0 ? "'" + val0 + "'" : "''";
      cArr[1] = val1 ? "'" + val1 + "'" : "''";
      cond = cArr.join("==");
    }

    return eval(cond);
  }

  count(name, where?) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast && frameName) {
      let value: number = 0;

      let rowData = this.get_name_index(itemName, frameName);

      if (!rowData) {
        return value;
      }

      let idx = frameName ? rowData : rowData[0];
      let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

      if (frame) {

        if (where) {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {

                  let cond = this.check_cond(frame.tempRows[i], where);

                  if (cond) {
                    let item = this.get_rows_item(frame.tempRows[i], itemName)
                    // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                    if (item) {
                      value = value + 1;
                    }
                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              let cond = this.check_cond(tableData, where);

              if (cond) {
                let item = this.get_rows_item(tableData, itemName)
                // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                if (item) {
                  value = value + 1;
                }
              }
            }
          }

        } else {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'HORIZONTAL_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if ((frame.tempRows && frame.tempRows.length > 0)) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);
              if (frame.tempRows && frame.tempRows.length > 0) {
                for (let i = 0; i < frame.tempRows.length; i++) {
                  let isThere = editIndArr.find(x => x == i);

                  if (isThere == undefined) {
                    // for (let itemGroup of frame.tempRows[i]) {
                    let itemGroup = frame.tempRows[i][idx.level4Index];
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {

                        if (item.extra_record) { continue; }

                        if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                          value = value + 1;
                        }
                      }

                    }
                    // }
                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              // for (let itemGroup of tableData) {
              let itemGroup = tableData[idx.level4Index];
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {

                  if (item.extra_record) { continue; }

                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                    value = value + 1;
                  }
                }

              }
              // }
            }
          }
        }
      }


      return value;
    } else {
      alert("Please enter frame_alias on aggrigate functions");
    }

  }

  count_d(name, where?) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    let count_d: Object = {};
    if (this.object_mast && frameName) {
      let value: number = 0;

      let rowData = this.get_name_index(itemName, frameName);

      if (!rowData) {
        return value;
      }

      let idx = frameName ? rowData : rowData[0];
      let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

      if (frame) {

        if (where) {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {

                  let cond = this.check_cond(frame.tempRows[i], where);

                  if (cond) {
                    let item = this.get_rows_item(frame.tempRows[i], itemName)
                    // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                    if (item) {
                      if (count_d[item.value]) { } else {
                        count_d[item.value] = 1;
                        value = value + 1;
                      }
                    }
                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              let cond = this.check_cond(tableData, where);

              if (cond) {
                let item = this.get_rows_item(tableData, itemName)
                // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                if (item) {
                  if (count_d[item.value]) { } else {
                    count_d[item.value] = 1;
                    value = value + 1;
                  }
                }
              }
            }
          }

        } else {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if ((frame.tempRows && frame.tempRows.length > 0)) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);
              if (frame.tempRows && frame.tempRows.length > 0) {
                for (let i = 0; i < frame.tempRows.length; i++) {
                  let isThere = editIndArr.find(x => x == i);

                  if (isThere == undefined) {
                    // for (let itemGroup of frame.tempRows[i]) {
                    let itemGroup = frame.tempRows[i][idx.level4Index];
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {

                          if (count_d[item.value]) { } else {
                            count_d[item.value] = 1;
                            value = value + 1;
                          }

                        }
                      }

                    }

                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              // for (let itemGroup of tableData) {
              let itemGroup = tableData[idx.level4Index];
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                    if (count_d[item.value]) { } else {
                      count_d[item.value] = 1;
                      value = value + 1;
                    }
                  }
                }

              }

            }
          }
        }
      }


      return value;
    } else {
      alert("Please enter frame_alias on aggrigate functions");
    }

  }

  // count(name) {
  //   let frameName;
  //   let itemName;
  //   if (name.indexOf("::") > -1) {
  //     name = name.split("::")[1];
  //   } if (name.indexOf(":") > -1) {
  //     name = name.split(":")[1];
  //   }

  //   if (name.indexOf(".") > -1) {
  //     frameName = name.split(".")[0];
  //     itemName = name.split(".")[1];
  //   } else {
  //     itemName = name;
  //   }

  //   if (this.object_mast) {
  //     let value: number = 0;
  //     for (let object of this.object_mast.Level2) {
  //       for (let frame of object.Level3) {
  //         if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

  //           if ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A') {

  //             if (frame.tableRows && frame.tableRows.length > 0) {
  //               for (let tableData of frame.tableRows) {
  //                 for (let itemGroup of tableData) {
  //                   if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                     for (let item of itemGroup.Level5) {
  //                       if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                         // let deleteFlag = this.get_rows_item(tableData, 'WMA_RECORD_STATUS');
  //                         // if (deleteFlag.value != 'D') {
  //                         //   value = value + 1;
  //                         // }

  //                         value = value + 1;
  //                       }
  //                     }

  //                   } else {
  //                     if (itemGroup && itemGroup.length > 0) {
  //                       for (let item of itemGroup) {
  //                         if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                           // let deleteFlag = this.get_rows_item(tableData, 'WMA_RECORD_STATUS');
  //                           // if (deleteFlag.value != 'D') {
  //                           //   value = value + 1;
  //                           // }

  //                           value = value + 1;
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }

  //             let to = frame.apps_page_frame_seqid.slice(0, (frame.apps_page_frame_seqid.length - 1));
  //             let mainFrame = this.get_frame_config(to);

  //             if (mainFrame && mainFrame.tableRows && mainFrame.tableRows.length > 0) {
  //               if (mainFrame.edit_record_index == undefined && mainFrame.indexStr == undefined) {
  //                 let deleteFlag = this.get_rows_item(mainFrame.tableRows[0], 'WMA_RECORD_STATUS');
  //                 if (deleteFlag.frame_status == "dirty") {
  //                   for (let tableData of mainFrame.tableRows) {
  //                     for (let itemGroup of tableData) {
  //                       if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                         for (let item of itemGroup.Level5) {
  //                           if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                             // let deleteFlag = this.get_rows_item(tableData, 'WMA_RECORD_STATUS');
  //                             // if (deleteFlag.value != 'D') {
  //                             //   value = value + 1;
  //                             // }

  //                             value = value + 1;
  //                           }
  //                         }

  //                       } else {
  //                         if (itemGroup && itemGroup.length > 0) {
  //                           for (let item of itemGroup) {
  //                             if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                               // let deleteFlag = this.get_rows_item(tableData, 'WMA_RECORD_STATUS');
  //                               // if (deleteFlag.value != 'D') {
  //                               //   value = value + 1;
  //                               // }

  //                               value = value + 1;
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }

  //             }

  //           } else {
  //             if (frame.tableRows && frame.tableRows.length > 0) {
  //               for (let tableData of frame.tableRows) {
  //                 for (let itemGroup of tableData) {
  //                   if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                     for (let item of itemGroup.Level5) {
  //                       if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                         // let deleteFlag = this.get_rows_item(tableData, 'WMA_RECORD_STATUS');
  //                         // if (deleteFlag.value != 'D') {
  //                         //   value = value + 1;
  //                         // }

  //                         value = value + 1;
  //                       }
  //                     }

  //                   } else {
  //                     if (itemGroup && itemGroup.length > 0) {
  //                       for (let item of itemGroup) {
  //                         if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                           // let deleteFlag = this.get_rows_item(tableData, 'WMA_RECORD_STATUS');
  //                           // if (deleteFlag.value != 'D') {
  //                           //   value = value + 1;
  //                           // }

  //                           value = value + 1;
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }

  //         }
  //       }
  //     }
  //     return value;
  //   }

  // }

  // avg(name) {
  //   let frameName;
  //   let itemName;
  //   if (name.indexOf("::") > -1) {
  //     name = name.split("::")[1];
  //   } if (name.indexOf(":") > -1) {
  //     name = name.split(":")[1];
  //   }

  //   if (name.indexOf(".") > -1) {
  //     frameName = name.split(".")[0];
  //     itemName = name.split(".")[1];
  //   } else {
  //     itemName = name;
  //   }

  //   if (this.object_mast) {
  //     let value = 0;
  //     let length = 0;
  //     for (let object of this.object_mast.Level2) {
  //       for (let frame of object.Level3) {
  //         if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

  //           if ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A') {
  //             let to = frame.apps_page_frame_seqid.slice(0, (frame.apps_page_frame_seqid.length - 1));
  //             let mainFrame = this.get_frame_config(to);
  //             if (mainFrame.edit_record_index != undefined || mainFrame.indexStr) {
  //               let editArr = [];
  //               editArr = mainFrame.indexStr ? mainFrame.indexStr.split(";") : [mainFrame.edit_record_index];
  //               for (let i = 0; i < frame.tableRows.length; i++) {
  //                 let isKey = editArr.find(x => x == i);
  //                 if (isKey == undefined || isKey == null) {
  //                   for (let itemGroup of frame.tableRows[i]) {

  //                     if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                       for (let item of itemGroup.Level5) {
  //                         if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                           value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                           length = frame.tableRows.length;
  //                         }
  //                       }

  //                     } else {
  //                       if (itemGroup && itemGroup.length > 0) {
  //                         for (let item of itemGroup) {
  //                           if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                             value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                             length = frame.tableRows.length;
  //                           }
  //                         }
  //                       }
  //                     }

  //                   }
  //                 }
  //               }

  //               if (mainFrame) {
  //                 if (mainFrame.tableRows && mainFrame.tableRows.length > 0) {
  //                   for (let tableData of mainFrame.tableRows) {
  //                     for (let itemGroup of tableData) {
  //                       if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                         for (let item of itemGroup.Level5) {
  //                           if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                             value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                             length = frame.tableRows.length;
  //                           }
  //                         }

  //                       } else {
  //                         if (itemGroup && itemGroup.length > 0) {
  //                           for (let item of itemGroup) {
  //                             if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                               value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                               length = frame.tableRows.length;
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }

  //             } else {
  //               if (frame.tableRows && frame.tableRows.length > 0) {
  //                 for (let tableData of frame.tableRows) {
  //                   for (let itemGroup of tableData) {
  //                     if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                       for (let item of itemGroup.Level5) {
  //                         if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                           value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                           length = frame.tableRows.length;
  //                         }
  //                       }

  //                     } else {
  //                       if (itemGroup && itemGroup.length > 0) {
  //                         for (let item of itemGroup) {
  //                           if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                             value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                             length = frame.tableRows.length;
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }



  //           } else {
  //             if (frame.tableRows && frame.tableRows.length > 0) {
  //               for (let tableData of frame.tableRows) {
  //                 for (let itemGroup of tableData) {
  //                   if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //                     for (let item of itemGroup.Level5) {
  //                       if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
  //                         value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                         length = frame.tableRows.length;
  //                       }
  //                     }

  //                   } else {
  //                     if (itemGroup && itemGroup.length > 0) {
  //                       for (let item of itemGroup) {
  //                         if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
  //                           value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
  //                           length = frame.tableRows.length;
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }

  //         }
  //       }
  //     }
  //     return value / length;
  //   }
  // }

  avg(name, where?) {
    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast && frameName) {
      let value = 0;
      let length = 0;

      let rowData = this.get_name_index(itemName, frameName);

      if (!rowData) {
        return value;
      }

      let idx = frameName ? rowData : rowData[0];
      let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

      if (frame) {

        if (where) {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {

                  let cond = this.check_cond(frame.tempRows[i], where);

                  if (cond) {
                    let item = this.get_rows_item(frame.tempRows[i], itemName)
                    // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                    if (item) {
                      value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                      length = length + 1
                    }
                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              let cond = this.check_cond(tableData, where);

              if (cond) {
                let item = this.get_rows_item(tableData, itemName)
                // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                if (item) {
                  value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                  length = length + 1
                }
              }
            }
          }

        } else {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {

              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {
                  // for (let itemGroup of frame.tempRows[i]) {
                  let itemGroup = frame.tempRows[i][idx.level4Index];
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {

                      if (item.extra_record) { continue; }

                      if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                        // value = value + parseFloat((item.value).replace(/,/g, ""));
                        value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                        length = length + 1
                      }
                    }
                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              for (let itemGroup of tableData) {
                let itemGroup = tableData[idx.level4Index];
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {

                    if (item.extra_record) { continue; }

                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                      value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                      // length = frame.tableRows.length;
                      length = length + 1
                    }
                  }

                }
              }
            }
          }
        }
      }

      return value / length;
    } else {
      alert("Please enter frame_alias on aggrigate functions");
    }
  }

  min(name, where?) {
    let frameName;
    let itemName;
    let type = "number";
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast && frameName) {

      let valueArr = [];


      let rowData = this.get_name_index(itemName, frameName);

      if (!rowData) {
        return null;
      }

      let idx = frameName ? rowData : rowData[0];
      let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

      if (frame) {

        if (where) {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {

                  let cond = this.check_cond(frame.tempRows[i], where);

                  if (cond) {
                    let item = this.get_rows_item(frame.tempRows[i], itemName)
                    // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                    if (item) {
                      if (item.value != undefined && item.value != null) {
                        type = item.datatype;

                        if (item.datatype && (item.datatype.toUpperCase() == 'DATE' || item.datatype.toUpperCase() == 'DATETIME')) {
                          valueArr.push(item.value);
                        } else {
                          valueArr.push(parseFloat((item.value).toString().replace(/,/g, "")));
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              let cond = this.check_cond(tableData, where);

              if (cond) {
                let item = this.get_rows_item(tableData, itemName)
                // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                if (item) {
                  if (item.value != undefined && item.value != null) {
                    type = item.datatype;

                    if (item.datatype && (item.datatype.toUpperCase() == 'DATE' || item.datatype.toUpperCase() == 'DATETIME')) {
                      valueArr.push(item.value);
                    } else {
                      valueArr.push(parseFloat((item.value).toString().replace(/,/g, "")));
                    }
                  }
                }
              }
            }
          }

        } else {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {
                  // for (let itemGroup of frame.tempRows[i]) {
                  let itemGroup = frame.tempRows[i][idx.level4Index];
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {

                      if (item.extra_record) { continue; }

                      if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                        // value = value + parseFloat((item.value).replace(/,/g, ""));
                        if (item.value != undefined && item.value != null) {
                          type = item.datatype;

                          if (item.datatype && (item.datatype.toUpperCase() == 'DATE' || item.datatype.toUpperCase() == 'DATETIME')) {
                            valueArr.push(item.value);
                          } else {
                            valueArr.push(parseFloat((item.value).toString().replace(/,/g, "")));
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          for (let tableData of frame.tableRows) {
            // for (let itemGroup of tableData) {
            let itemGroup = tableData[idx.level4Index];
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {

                if (item.extra_record) { continue; }

                if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                  if (item.value != undefined && item.value != null) {
                    type = item.datatype;

                    if (item.datatype && (item.datatype.toUpperCase() == 'DATE' || item.datatype.toUpperCase() == 'DATETIME')) {
                      valueArr.push(item.value);
                    } else {
                      valueArr.push(parseFloat((item.value).toString().replace(/,/g, "")));
                    }
                  }
                }
              }


            }
          }
        }
      }


      if (valueArr.length > 0) {

        if (type && (type.toUpperCase() == 'DATE' || type.toUpperCase() == 'DATETIME')) {

          let data = valueArr.sort((a, b) => {

            let newA = JSON.parse(JSON.stringify(a));
            let newB = JSON.parse(JSON.stringify(b));

            newA = newA ? new Date(newA).getTime() : "";
            newB = newB ? new Date(newB).getTime() : "";

            if (newA < newB) {
              return -1 * 1;
            } else if (newA > newB) {
              return 1 * 1;
            } else {
              return 0;
            }
          })

          return data[0];

        } else {
          return Math.min.apply(Math, valueArr);
        }
      } else {
        return null;
      }
    } else {
      alert("Please enter frame_alias on aggrigate functions");
    }

  }

  max(name, where?) {
    let frameName;
    let itemName;
    let type = "number";
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.object_mast && frameName) {
      let valueArr = [];

      let rowData = this.get_name_index(itemName, frameName);

      if (!rowData) {
        return null;
      }

      let idx = frameName ? rowData : rowData[0];
      let frame = this.object_mast.Level2[idx.level2Index].Level3[idx.level3Index]

      if (frame) {

        if (where) {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {
              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {

                  let cond = this.check_cond(frame.tempRows[i], where);

                  if (cond) {
                    let item = this.get_rows_item(frame.tempRows[i], itemName)
                    // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                    if (item) {
                      if (item.value) {
                        type = item.datatype;

                        if (item.datatype && (item.datatype.toUpperCase() == 'DATE' || item.datatype.toUpperCase() == 'DATETIME')) {
                          valueArr.push(item.value);
                        } else {
                          valueArr.push(parseFloat((item.value).toString().replace(/,/g, "")));
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let tableData of frame.tableRows) {
              let cond = this.check_cond(tableData, where);

              if (cond) {
                let item = this.get_rows_item(tableData, itemName)
                // value = value + (item.value ? parseFloat((item.value).toString().replace(/,/g, "")) : 0);
                if (item) {
                  if (item.value) {
                    type = item.datatype;

                    if (item.datatype && (item.datatype.toUpperCase() == 'DATE' || item.datatype.toUpperCase() == 'DATETIME')) {
                      valueArr.push(item.value);
                    } else {
                      valueArr.push(parseFloat((item.value).toString().replace(/,/g, "")));
                    }
                  }
                }
              }
            }
          }

        } else {

          if ((frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'CARD') || ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A')) {
            if (frame.tempRows && frame.tempRows.length > 0) {

              let editIndArr = frame.indexStr ? frame.indexStr.split(";") : (frame.edit_record_index != undefined ? [frame.edit_record_index] : []);

              for (let i = 0; i < frame.tempRows.length; i++) {
                let isThere = editIndArr.find(x => x == i);

                if (isThere == undefined) {
                  // for (let itemGroup of frame.tempRows[i]) {
                  let itemGroup = frame.tempRows[i][idx.level4Index];
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {

                      if (item.extra_record) { continue; }

                      if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                        // value = value + parseFloat((item.value).replace(/,/g, ""));
                        if (item.value) {
                          type = item.datatype;

                          if (item.datatype && (item.datatype.toUpperCase() == 'DATE' || item.datatype.toUpperCase() == 'DATETIME')) {
                            valueArr.push(item.value);
                          } else {
                            valueArr.push(parseFloat((item.value).toString().replace(/,/g, "")));
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let tableData of frame.tableRows) {
            // for (let itemGroup of tableData) {
            let itemGroup = tableData[idx.level4Index];
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {

                if (item.extra_record) { continue; }

                if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {
                  if (item.value) {
                    type = item.datatype;

                    if (item.datatype && (item.datatype.toUpperCase() == 'DATE' || item.datatype.toUpperCase() == 'DATETIME')) {
                      valueArr.push(item.value);
                    } else {
                      valueArr.push(parseFloat((item.value).toString().replace(/,/g, "")));
                    }
                  }
                }

              }
            }
          }
        }

      }


      if (valueArr.length > 0) {

        if (type && (type.toUpperCase() == 'DATE' || type.toUpperCase() == 'DATETIME')) {

          let data = valueArr.sort((a, b) => {

            let newA = JSON.parse(JSON.stringify(a));
            let newB = JSON.parse(JSON.stringify(b));

            newA = newA ? new Date(newA).getTime() : "";
            newB = newB ? new Date(newB).getTime() : "";

            if (newA < newB) {
              return -1 * -1;
            } else if (newA > newB) {
              return 1 * -1;
            } else {
              return 0;
            }
          })

          return data[0];

        } else {
          return Math.max.apply(Math, valueArr);
        }
      } else {
        return null;
      }
    } else {
      alert("Please enter frame_alias on aggrigate functions");
    }

  }

  go_item(name, index?, force?, send?) {

    // force = true to not run the click event on focus of input

    let frameName = "";
    let itemName = "";
    if (name.indexOf(".") > -1) {
      let nameArr = name.split(".");

      if (nameArr.length > 2) {
        frameName = nameArr[1];
        itemName = nameArr[2];
      } else {
        frameName = nameArr[0];
        itemName = nameArr[1];
      }
    } else {
      itemName = name;
    }

    let rowIndex = 0;

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : true)) {
          // if (frameName && !frame.collapse) {
          //   frame.collapse = true;
          // }
          rowIndex = this.get_current_record(index, frame) ?? 0;

          if (frame.apps_frame_type == 'ENTRY_TABLE' && frame.tableRows && frame.tableRows.length > 0 && frame.tableRows[rowIndex]) {
            frame.edited_row_id = rowIndex;
          }

          if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE') {
            let displayRecord = frame.display_no_of_records ? frame.display_no_of_records : 50
            if ((rowIndex < (frame.page_no ?? 1) * displayRecord) && (rowIndex >= (((frame.page_no ?? 1) * displayRecord) - displayRecord))) {
              if (index == undefined) {
                index = rowIndex - (((frame.page_no ?? 1) * displayRecord) - displayRecord);
              }
              // rowIndex = index;

              let item = this.get_item(frame.apps_page_frame_seqid + '.' + itemName, rowIndex ? rowIndex : null);
              if (item) item.isclickable = true;

              setTimeout(() => {
                if (isPlatformServer(this.platformId)) return;
                let container: any = document.querySelectorAll("#" + frame.apps_page_frame_seqid + "--" + (rowIndex ? rowIndex : 0));
                if (container) {
                  var universe: any = []
                  let tdArray = Array.from(container);
                  if (Array.isArray(tdArray)) {
                    for (let a of container) {
                      let universes = a.querySelectorAll(
                        "input,select,textarea,ion-input,ion-textarea"
                      );
                      if (universes) {
                        universes.forEach((el) => {
                          universe.push(el);  // Pushes the node itself
                        });
                      }


                    }
                  } else {
                    universe = container.querySelectorAll(
                      "input,select,textarea,ion-input,ion-textarea"
                    );
                  }
                  // var universe = container.querySelectorAll(
                  //   "input,select"
                  // );
                  // var list = Array.prototype.filter.call(universe, (item) => {
                  //   return item.tabIndex >= "0";
                  // });
                  // let el = list.find((el) => el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase());

                  // var universe: any = container.querySelectorAll(
                  //   "input,select,textarea,ion-input,ion-textarea"
                  // );
                  let list = Array.prototype.filter.call(universe, (item) => {
                    return (
                      item.tabIndex >= 0 ||
                      item.tagName === 'ION-TEXTAREA' ||
                      item.tagName === 'ION-INPUT'
                    );
                  });

                  let el = list.find((el) => (el && el.id.toLowerCase() == itemName.toLowerCase()) || (el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase()));

                  if (el) {

                    let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
                    let itm = this.get_item(name, rowIndex ? rowIndex : null);
                    //  let item = this.get_item(frame.apps_page_frame_seqid + '.' + itemName, rowIndex ? rowIndex : null);
                    // this.set_item_config(name, 'frame_status', 'dirty', rowIndex ? rowIndex : null);

                    if (send) {
                      return el;
                    }
                    setTimeout(() => {
                      if (itm) {
                        if (item && force) {
                          item.forcedFocus = force;
                        }
                        itm.frame_status = 'dirty';
                      }

                      // el.focus();

                      if (el.tagName === 'ION-TEXTAREA' || el.tagName === 'ION-INPUT') {
                        el.setFocus();   // Ionic way
                      } else {
                        el.focus();      // Native way
                      }

                      frame.active_row = rowIndex;
                      // el.setFocus();
                      if (frameName) {
                        this.cdEngine.detect(frame.apps_page_frame_seqid);
                        return;
                      }
                    }, 2)
                  }
                }
              }
              )
            }
          } else {
            let flag = false;
            if (frame.apps_frame_type == 'CANVAS') {
              let itemGet = this.get_item(frame.apps_page_frame_seqid + '.' + itemName, rowIndex ? rowIndex : null);
              if (itemGet && itemGet.isSeprated) {

                let itmGrp = this.get_sep_grp(itemGet.isSeprated.sepratorGprId, frame, rowIndex ?? 0);

                if (itmGrp && itmGrp.Level5) {
                  for (let item of itmGrp.Level5) {
                    if (item.apps_item_seqid == itemGet.isSeprated.sepratorId) {
                      if ((item.item_sub_type == 'COLLAPSE' && item.sepCollapse != 'SHOW') || ((item.item_sub_type == 'TAB_VERTICAL' || item.item_sub_type == 'TAB_HORIZONTAL') && item.sepFrame != 'SHOW')) {
                        flag = true;
                        item.item_sub_type == 'COLLAPSE' ? item.sepCollapse = 'SHOW' : item.sepFrame = 'SHOW';
                      } else {
                        break;
                      }
                    } else {
                      item.sepFrame = 'HIDE';
                    }
                  }
                }
              }
            }

            if (!flag) {
              this.focusItem(itemName, frameName, frame, rowIndex, send, force);
            } else {
              setTimeout(() => {
                this.focusItem(itemName, frameName, frame, rowIndex, send, force);
              }, 0);
            }

          }
          this.cdEngine.detect(frame.apps_page_frame_seqid);
        }
      }
    }
    return;
  }

  focusItem(itemName, frameName, frame, rowIndex, send, force) {
    if (isPlatformServer(this.platformId)) return;
    let container = document.querySelector("#" + frame.apps_page_frame_seqid);
    if (container) {
      // var universe: any = container.querySelectorAll(
      //   "input,select,textarea"
      // );

      var universe: any = container.querySelectorAll(
        "input,select,textarea,ion-input,ion-textarea"
      );
      var list = Array.prototype.filter.call(universe, (item) => {
        return (
          item.tabIndex >= 0 ||
          item.tagName === 'ION-TEXTAREA' ||
          item.tagName === 'ION-INPUT'
        );
      });
      let el = list.find((el) => (el && el.id.toLowerCase() == itemName.toLowerCase()) || (el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase()));
      if (el) {
        let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
        let itm = this.get_item(name, rowIndex ? rowIndex : null, true);
        let item = this.get_item(frame.apps_page_frame_seqid + '.' + itemName, rowIndex ? rowIndex : null, true);

        // this.set_item_config(name, 'frame_status', 'dirty', rowIndex ? rowIndex : null);

        if (send) {
          return el;
        }

        requestAnimationFrame(() => {
          if (itm) {
            if (item && force) {
              item.forcedFocus = force;
            }
            itm.frame_status = 'dirty';
          }

          if (!el.readOnly && !el.disabled && el.type != 'hidden') {

            // 🔥 KEY FIX
            if (el.tagName === 'ION-TEXTAREA' || el.tagName === 'ION-INPUT') {
              el.setFocus();   // Ionic way
            } else {
              el.focus();      // Native way
            }

          } else {
            el = this.findNextTabStop(el);

            if (el.tagName === 'ION-TEXTAREA' || el.tagName === 'ION-INPUT') {
              el.setFocus();
            } else {
              el.focus();
            }
          }

          frame.active_row = rowIndex ?? 0;

          if (frameName) {
            return;
          }
        });
        // requestAnimationFrame(() => {
        //   if (itm) {
        //     if (item && force) {
        //       item.forcedFocus = force;
        //     }
        //     itm.frame_status = 'dirty';
        //   }

        //   if (!el.readOnly && !el.disabled && el.type != 'hidden') {
        //     el.focus();
        //   } else {
        //     el = this.findNextTabStop(el);
        //     el.focus();
        //   }
        //   frame.active_row = rowIndex ?? 0;
        //   // if(!this.globalObjects.isMsg){
        //   //   this.globalObjects.raise = false;
        //   // }
        //   // el.setFocus();
        //   if (frameName) {
        //     return;
        //   }
        // })
      }
    }
  }

  get_sep_grp(id, frame, index) {
    if (frame && frame.canvasRows) {
      for (let grp of frame.canvasRows[index]) {
        if (id == grp.apps_item_seqid) {
          return grp;
        }
      }
    }
  }
  get_object_config() {
    return this.object_mast;
  }

  get_temp_data(tableRows) {
    let dataArr = [];
    for (let tableData of tableRows) {
      let col = {};
      let flag = false;
      for (let itemGroup of tableData) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          if (itemGroup.Level5) {
            for (let item of itemGroup.Level5) {
              if (item.extra_record) { flag = true; break; }
              col[item.item_name] = item.value;
            }
          }
        }
        if (flag) { break; }
      }
      if (!flag) {
        dataArr.push(col);
      }
      dataArr.push(col);
    }

    return dataArr;
  }




  execute_json(tableData, mainframe, where?, having?) {

    let returnData = [];
    let grpByName = [];
    let funArr = [];
    let ctrlStr = "";

    if (mainframe && tableData && mainframe.Level4.length > 0 && tableData.length > 0) {
      for (let itemGroup of mainframe.Level4) {
        for (let item of itemGroup.Level5) {
          if (item.item_default_value && item.item_name != "WMA_RECORD_STATUS" && item.item_name != "WMA_FRAME_STATUS" && item.item_name != "WMA_RECORD_INDEX") {

            if ((item.item_default_value.toLowerCase().indexOf("avg(") > -1) || (item.item_default_value.toLowerCase().indexOf("sum(") > -1) ||
              (item.item_default_value.toLowerCase().indexOf("min(") > -1) || (item.item_default_value.toLowerCase().indexOf("max(") > -1) ||
              (item.item_default_value.toLowerCase().indexOf("count(") > -1) || (item.item_default_value.toLowerCase().indexOf("count_d(") > -1)) {
              // let str = item.item_default_value.toUpperCase().split("(")[1].split(")")[0].replaceAll("'", "");
              // let fun;

              // if (item.item_default_value.toUpperCase().split("(")[0] == "AVG") {
              //   fun = "A";
              // } else if (item.item_default_value.toUpperCase().split("(")[0] == "SUM") {
              //   fun = "S"
              // } else if (item.item_default_value.toUpperCase().split("(")[0] == "MAX") {
              //   fun = "X"
              // } else if (item.item_default_value.toUpperCase().split("(")[0] == "MIN") {
              //   fun = "M"
              // } else if (item.item_default_value.toUpperCase().split("(")[0] == "COUNT") {
              //   fun = "C"
              // }

              let obj = {
                // funItemName: str.toUpperCase(),
                fun: item.item_default_value.toUpperCase(),
                dataType: item.datatype,
                item_name: item.item_name.toUpperCase(),
                summary_flag: item.summary_flag
              }

              funArr.push(obj);
            } else {
              grpByName.push(item.item_name.toUpperCase());
              if (ctrlStr) {
                ctrlStr = ctrlStr + ",item." + item.item_default_value.toUpperCase().replaceAll("'", "");
              } else {
                ctrlStr = "item." + item.item_default_value.toUpperCase().replaceAll("'", "");
              }
            }
          }
        }
      }

      var tabRows = this.groupBy(tableData, function (item) {
        let str = "[" + ctrlStr + "]";
        try {
          let arrStr = eval(str)
          return arrStr;
        } catch (err) {
          alert(err);
          eval(str);
          // return null;
        }
      }, where);

      let arr = [];

      for (let t of tabRows) {
        let dataObj = {};
        for (let g = 0; g < grpByName.length; g++) {
          dataObj[grpByName[g]] = t.key[g];
        }

        if (funArr.length > 0) {
          dataObj = this.doArthematic(funArr, t.items, tableData, dataObj);
        }
        arr.push(dataObj)
      }

      if (grpByName.length > 0 && arr.length > 0) {
        if (having) {
          let newArr = [];
          arr.forEach(o => {
            let cond = true;

            let namesArr = having.split(":");
            let newStr = "";
            for (let a of namesArr) {
              let name = a ? a.split(/[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/) : "";
              newStr = newStr != undefined ? newStr + a.replace(name[0], "'" + o[name[0]] + "'") + " " : "";
            }
            newStr = newStr.replaceAll(" and ", " && ").replaceAll(" AND ", " && ");
            newStr = newStr.replaceAll("=", " == ");
            cond = eval(newStr);


            if (cond) {
              newArr.push(o)
            }
          });

          arr = newArr;
        }

        for (let g of grpByName) {
          this.orderBy(arr, g);
        }
      }

      returnData = arr;
    }
    return returnData;

  }


  doArthematic(funArr, items, tableData, dataObj) {
    if (funArr && funArr.length > 0) {
      let count_d: Object = {};
      for (let f of JSON.parse(JSON.stringify(funArr))) {

        var specialStr = (f.fun).match(/^AVG\(([^)]+)\)|SUM\(([^)]+)\)|COUNT\(([^)]+)\)|COUNT_D\(([^)]+)\)|MAX\(([^)]+)\)|MIN\(([^)]+)\)/g);

        let funItemName = f.item_name;
        for (let sp of specialStr) {
          let tempValue = 0;

          let valueArr = [];
          if (sp.toUpperCase().includes('(')) {
            funItemName = sp.split("(")[1].split(")")[0].replaceAll("'", "")
          }
          let isNull = false
          for (let i of items) {
            if (i && i[funItemName]) {
              if (sp == "S" || sp.toUpperCase().includes('SUM')) {
                tempValue = i[funItemName] ? parseFloat(i[funItemName]) + tempValue : 0 + tempValue;
              }

              if (sp == "A" || sp.toUpperCase().includes('AVG')) {
                tempValue = tempValue + (i[funItemName] ? parseFloat((i[funItemName]).replace(/,/g, "")) : 0);
              }

              if ((sp == "M" || sp == "X" || sp.toUpperCase().includes('MAX') || sp.toUpperCase().includes('MIN')) && i[funItemName] != undefined && i[funItemName] != null) {
                if (f.dataType && f.dataType.toLowerCase() == "date") {
                  valueArr.push(i[funItemName] ? (new Date((i[funItemName]).toString().replace(/,/g, ""))) : "");
                } else {
                  valueArr.push(i[funItemName] ? (parseFloat((i[funItemName]).toString().replace(/,/g, ""))) : "");
                }
              }

              if (sp == "C" || sp.toUpperCase().includes('COUNT(')) {
                tempValue = tempValue + 1;
              }

              if (sp.toUpperCase().includes('COUNT_D(')) {
                if (count_d[i[funItemName]]) { } else {
                  count_d[i[funItemName]] = 1;
                }
              }

            } else {
              isNull = true
            }
          }

          if (Object.keys(count_d).length > 0) {
            tempValue = eval(Object.values(count_d).join("+"));
            count_d = {};
          }


          if (sp == "A" || sp.toUpperCase().includes('AVG')) {
            if (isNull) {
              tempValue = null;
            } else {
              tempValue = (tempValue / items.length);
            }

          }

          if (sp == "M" || sp.toUpperCase().includes('MIN')) {
            if (valueArr.length > 0) {
              if (f.dataType && f.dataType.toLowerCase() == "date") {
                let val = tableData.find(x => x[funItemName] && (new Date(x[funItemName]).toString() == new Date(Math.min.apply(null, valueArr)).toString()));
                tempValue = val[funItemName];
              } else {
                tempValue = Math.min.apply(Math, valueArr);
              }

            } else {
              tempValue = null;
            }
          }

          if (sp == "X" || sp.toUpperCase().includes('MAX')) {
            if (valueArr.length > 0) {
              if (f.dataType && f.dataType.toLowerCase() == "date") {
                let val = tableData.find(x => x[funItemName] && (new Date(x[funItemName]).toString() == new Date(Math.max.apply(null, valueArr)).toString()));
                tempValue = val[funItemName];
              } else {
                tempValue = Math.max.apply(Math, valueArr);
              }
            } else {
              tempValue = null;
            }
          }
          if (tempValue == null || tempValue == undefined) {
            f.fun = f.fun.replaceAll(sp, tempValue);
          } else {
            f.fun = f.fun.replaceAll(sp, "'" + tempValue + "'");
          }
        }

        let value = eval(f.fun);

        if (f.dataType && f.dataType.toLowerCase() == "number" && value && !f.summary_flag) {
          let str = value.toString();
          if (str && str.includes(".")) {
            if (items[0][funItemName] && items[0][funItemName].includes(".")) {
              let decStr = ((items[0][funItemName]).split(".")[1]).length;
              value = parseFloat(value).toFixed(decStr);
            } else {
              value = parseFloat(value).toFixed(2);
            }
          }
        }

        if (f.fun != "C" && f.dataType.toLowerCase() != "date") {
          // let val = value ? value.toString() : "0";
          // dataObj[f.item_name] = parseFloat(val).toString();
          if (value) {
            let val = value.toString();
            dataObj[f.item_name] = parseFloat(val).toString();
          } else {
            dataObj[f.item_name] = value;
          }
        } else {
          dataObj[f.item_name] = value.toString();
        }

      }
    }
    return dataObj;
  }


  orderBy(data, name) {

    data = data.sort((a, b) => {

      if (isNaN(a[name])) {

        a[name] = a[name] ? a[name] : "";
        b[name] = b[name] ? b[name] : "";
        if (a[name] < b[name]) {
          return -1 * 1;
        } else if (a[name] > b[name]) {
          return 1 * 1;
        } else {
          return 0;
        }

      } else {

        let newA;
        let newB
        if (a[name] && a[name].includes(',')) {
          newA = JSON.parse(JSON.stringify(parseFloat(a[name].replace(/,/g, ""))));
          newB = JSON.parse(JSON.stringify(parseFloat(b[name].replace(/,/g, ""))));
        } else {
          newA = JSON.parse(JSON.stringify(parseFloat(a[name])));
          newB = JSON.parse(JSON.stringify(parseFloat(b[name])));
        }

        // newA= parseFloat(a[i][0].value.replace(/,/g, ""));
        // newB= parseFloat(b[i][0].value.replace(/,/g, ""));

        newA = newA ? newA : 0;
        newB = newB ? newB : 0;
        if (parseFloat(newA) < parseFloat(newB)) {
          return -1 * 1;
        } else if (parseFloat(newA) > parseFloat(newB)) {
          return 1 * 1;
        } else {
          return 0;
        }
      }
    });


    //   console.log(data);
  }

  groupBy(array, f, where?) {
    var groups = {};
    for (let o of array) {
      let cond = true;
      if (where) {
        let namesArr = where.split(":");
        let newStr = "";
        for (let a of namesArr) {
          let name = a ? a.split(/[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/) : "";
          newStr = newStr != undefined ? newStr + a.replace(name[0], "'" + o[name[0]] + "'") + " " : "";
        }
        newStr = newStr.replaceAll(" and ", " && ").replaceAll(" AND ", " && ");
        newStr = newStr.replaceAll("=", "==");
        cond = eval(newStr);
      }

      if (cond) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      }
    };
    return Object.keys(groups).map(function (group) {
      let obj = {
        key: JSON.parse(group),
        items: groups[group]
      }
      return obj;
    })
  }

  getParentJson(frameName) {
    if (this.object_mast && this.object_mast.Level2 && this.object_mast.Level2.length > 0) {
      for (let object of this.object_mast.Level2) {
        let frame_list = object.Level3.filter(x => (x.frame_alias == frameName || x.apps_page_frame_seqid == frameName));
        if (frame_list && frame_list.length > 0) {
          for (let frame of frame_list) {
            if (frame.tableData && frame.tableData.length > 0) {
              return frame.tableData;
            }
          }
        }
      }
    }
  }

  getWsdp(frameName) {
    let wsdp = [];
    let wsdptp = [];
    let wsdpcl = [];
    if (this.object_mast && this.object_mast.Level2 && this.object_mast.Level2.length > 0) {

      // let objMast = JSON.parse(JSON.stringify(this.object_mast.Level2));
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frame.apps_page_frame_seqid == frameName) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : (frame.apps_frame_type != 'TABLE' && frame.apps_frame_type != 'CARD'
            && frame.apps_frame_type != 'TREE_TABLE' && frame.apps_frame_type != 'HORIZONTAL_TABLE'))) {

            if (frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) {

              let tableRows = [];
              if (frame.tableRows && frame.tableRows.length > 0) {
                tableRows = frame.tableRows;
              }

              let index = 0;
              for (let framedata of tableRows) {
                let col = {};
                let coltp = {};
                for (let itemGroup of framedata) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {

                      if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX') {
                        item.value = index;
                      }

                      if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                        item.value = item.value != undefined ? typeof (item.value) != 'object' && typeof (item.value) != 'number' ? item.value.replaceAll(',', '') : item.value : '';
                      }
                      if (item.codeOfValues) {
                        col[item.item_name] = item.codeOfValues;
                      } else if (item.value != undefined && item.value != null) {
                        col[item.item_name] = item.value;
                      } else {
                        col[item.item_name] = "";
                      }
                    }
                  } else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {

                        if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX') {
                          item.value = index;
                        }

                        if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                          item.value = item.value != undefined ? typeof (item.value) != 'object' && typeof (item.value) != 'number' ? item.value.replaceAll(',', '') : item.value : '';
                        }
                        if (item.codeOfValues) {
                          col[item.item_name] = item.codeOfValues;
                        } else if (item.value != undefined && item.value != null) {
                          col[item.item_name] = item.value;
                        } else {
                          col[item.item_name] = "";
                        }
                      }
                    }
                  }
                }
                wsdp.push(col);
                wsdptp.push(coltp);
                index++;
              }

              if (frameName) {
                let obj = {
                  wsdp: wsdp,
                  wsdptp: wsdptp,
                  wsdpcl: wsdpcl
                }
                return obj;
              }

            } else if (frame.apps_frame_type == 'ENTRY_TABLE' && (frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) != 'A') {

              let ind = frame.active_row ? frame.active_row : 0;
              let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
              let wmaRec = this.get_item(name, ind);
              if (wmaRec && wmaRec.frame_status && (wmaRec.frame_status).toLowerCase() == 'dirty') {

                // let tRows = frame.searchableData ? frame.searchableData : frame.tableRows;
                let dpclRec = {};
                if (frame.searchableData) {
                  dpclRec = this.getWsdpcl(frame.searchableData[ind], ind, true);
                } else {
                  dpclRec = this.getWsdpcl(frame.tableRows[ind], ind,);
                }

                wsdpcl.push(dpclRec);

              }


            } else if ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) != 'A') {

              let tableRows = [];

              if (frame.frame_alias) {
                let frame_list = [];
                this.object_mast.Level2.forEach(obj => {
                  obj.Level3.forEach(x => {
                    if (x.frame_alias == frame.frame_alias) {
                      frame_list.push(x);
                    }
                  });
                })
                if (frame_list && frame_list.length > 1) {
                  let concatArr = [];
                  let i = 0;
                  for (let f of frame_list) {
                    let tabRows = [];
                    if (f.tableRows) {
                      tabRows = f.tableRows;
                    }

                    if (tabRows.length < 1) {
                      tabRows[0] = JSON.parse(JSON.stringify(f.Level4));
                    }
                    if ((tabRows && tabRows.length > 0) || (f.tempRows && f.tempRows.length > 0)) {
                      let rowss = []
                      if (tabRows) {
                        rowss = tabRows;

                        if (f.tempRows && f.tempRows.length > 0) {
                          rowss = f.tempRows;
                        }
                        for (let r of rowss[0]) {
                          concatArr.push(r)
                        }
                        f.tempRows = [];

                        if (i > 0) {
                          f.concat_frame = true;
                        }
                        i++
                      }
                    }
                  }
                  tableRows[0] = concatArr;
                } else {
                  tableRows = frame.tableRows;

                  if (frame.tempRows && frame.tempRows.length > 0) {
                    tableRows = frame.tempRows;
                  }
                }

              } else {
                tableRows = frame.tableRows;

                if (frame.tempRows && frame.tempRows.length > 0) {
                  tableRows = frame.tempRows;
                }

                if ((!tableRows || (tableRows && tableRows.length < 1)) && (frame.Level4 && frame.Level4.length > 0)) {
                  tableRows = [];
                  // tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
                }
              }

              if (!frame.concat_frame) {
                let index = 0;
                if (tableRows && tableRows.length > 0) {

                  for (let framedata of tableRows) {
                    let col = {};
                    let coltp = {};

                    let dirtyItem = this.check_row_dirty(this.events, framedata);
                    if ((dirtyItem && dirtyItem.frame_status && (dirtyItem.frame_status).toLowerCase() == 'dirty') || ((frame.apps_frame_type == 'CANVAS' || frame.apps_frame_type == 'SYSTEM') && !frame.tempRows)) {

                      for (let itemGroup of framedata) {
                        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                          for (let item of itemGroup.Level5) {

                            if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX') {
                              item.value = index;
                            }

                            if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                              item.value = item.value != undefined ? typeof (item.value) != 'object' && typeof (item.value) != 'number' ? item.value.replaceAll(',', '') : item.value : '';
                            }
                            if (item.codeOfValues) {
                              col[item.apps_item_seqid] = item.codeOfValues;
                              coltp[item.item_name] = item.codeOfValues;
                            } else if (item.value != undefined && item.value != null) {
                              col[item.apps_item_seqid] = item.value;
                              coltp[item.item_name] = item.value;
                            } else {
                              col[item.apps_item_seqid] = "";
                              coltp[item.item_name] = "";
                            }
                          }
                        } else {
                          if (itemGroup && itemGroup.length > 0) {
                            for (let item of itemGroup) {

                              if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX') {
                                item.value = index;
                              }

                              if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                                item.value = item.value != undefined ? typeof (item.value) != 'object' && typeof (item.value) != 'number' ? item.value.replaceAll(',', '') : item.value : '';
                              }
                              if (item.codeOfValues) {
                                col[item.apps_item_seqid] = item.codeOfValues;
                                coltp[item.item_name] = item.codeOfValues;
                              } else if (item.value != undefined && item.value != null) {
                                col[item.apps_item_seqid] = item.value;
                                coltp[item.item_name] = item.value;
                              } else {
                                col[item.apps_item_seqid] = "";
                                coltp[item.item_name] = "";
                              }
                            }
                          }
                        }
                      }


                      if (frame.edit_record_index >= 0) {
                        let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS'
                        let wmaRec = this.get_item(name, 0);
                        if (index == frame.edit_record_index && wmaRec && wmaRec.frame_status && (wmaRec.frame_status).toLowerCase() == 'dirty') {
                        } else {
                          wsdp.push(col);
                          wsdptp.push(coltp);
                        }
                      } else {
                        wsdp.push(col);
                        wsdptp.push(coltp);
                      }

                      // if (frame.tableRows.length < 2 && (!frame.tempRows || frame.tempRows.length <= 0)) {
                      //   wsdpcl.push(col);
                      // }
                    }
                    index++;
                  }
                  if (frame.tempRows && frame.tempRows.length > 0) {

                    let ind = index;

                    if (frame.edit_record_index != undefined && typeof (frame.edit_record_index) == 'number') {
                      ind = frame.edit_record_index
                    }

                    let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
                    let wmaRec = this.get_item(name, 0);
                    if (wmaRec && wmaRec.frame_status && (wmaRec.frame_status).toLowerCase() == 'dirty') {
                      let dpclRec = this.getWsdpcl(frame.tableRows[0], ind);
                      wsdpcl.push(dpclRec);

                    }
                  }
                }


                if (frameName) {
                  let obj = {
                    wsdp: wsdp,
                    wsdptp: wsdptp,
                    wsdpcl: wsdpcl
                  }
                  return obj;

                }
              }
            }
          }
        }
      }
    }
    let obj = {
      wsdp: wsdp,
      wsdptp: wsdptp,
      wsdpcl: wsdpcl
    }
    return obj;
  }

  get_col(col, item, frame) {
    if (item.codeOfValues) {
      col[item.apps_item_seqid + '^' + item.item_name + '^' + frame.frame_alias + '^' + item.db_table_name + '^' + item.item_db_name + '^' + item.datatype] = item.codeOfValues;
    } else if (item.value != undefined && item.value != null) {
      if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
        col[item.apps_item_seqid + '^' + item.item_name + '^' + frame.frame_alias + '^' + item.db_table_name + '^' + item.item_db_name + '^' + item.datatype] = item.value != undefined ? item.value.toString().replaceAll(',', '') : '';
      } else {
        col[item.apps_item_seqid + '^' + item.item_name + '^' + frame.frame_alias + '^' + item.db_table_name + '^' + item.item_db_name + '^' + item.datatype] = typeof (item.value) != 'string' ? item.value.toString() : item.value;
      }
    } else {
      col[item.apps_item_seqid + '^' + item.item_name + '^' + frame.frame_alias + '^' + item.db_table_name + '^' + item.item_db_name + '^' + item.datatype] = "";
    }

    return col;
  }

  getDpcl(str?, flag?, get_working_mode_item?) {
    let arr = [];


    const getCol = (frame, tableRows, dirtyItem, index, inFlag) => {
      let col = {};
      let dirtyFlag = true;
      for (let itemGroup of tableRows) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {

          for (let item of itemGroup.Level5) {

            if ((item.apps_working_mode && item.apps_working_mode.includes("1")) && !get_working_mode_item) { continue; }
            if (item.apps_item_seqid && item.apps_item_seqid.toLowerCase().includes(".file") && (!str || !str.toLowerCase().includes("file"))) { continue; }



            if (item.item_name.toUpperCase() == 'WMA_RECORD_STATUS') {


              if (item.frame_status != 'dirty' && tableRows.length == 1) dirtyFlag = false;
              if (((frame.apps_frame_type == 'CANVAS' || frame.apps_frame_type == 'SYSTEM') && !frame.tempRows) && (!dirtyItem || (dirtyItem && (!dirtyItem.frame_status || (dirtyItem.frame_status).toLowerCase() != 'dirty')))) {
                item.value = 'Z';
              } else {
                if (!item.value || item.value.toUpperCase() != 'U' && item.value.toUpperCase() != 'D') {
                  item.value = 'I';
                }
              }
            }
            if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX' && (!inFlag || (!dirtyFlag && item.value == undefined))) {
              item.value = typeof (index) != 'string' ? index.toString() : index;
            }
            if (!flag) {

              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues;
                // coltp[item.item_name] = item.codeOfValues;
              } else if (item.value != undefined && item.value != null) {
                if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                  col[item.apps_item_seqid] = item.value != undefined ? item.value.toString().replaceAll(',', '') : '';
                  // coltp[item.item_name] = item.value ? item.value.toString().replaceAll(',', '') : '';
                } else {
                  col[item.apps_item_seqid] = typeof (item.value) != 'string' ? item.value.toString() : item.value;
                  // coltp[item.item_name] = item.value;
                }
              } else {
                col[item.apps_item_seqid] = "";
                // coltp[item.item_name] = "";
              }
            } else {
              col = this.get_col(col, item, frame);
            }


            if (item.input_pattern && item.input_pattern.toLowerCase().includes('masked_field') && col[item.apps_item_seqid]) {
              col[item.apps_item_seqid + '.ENC'] = this.encryptDecrypt.encryptData(col[item.apps_item_seqid]);
              delete col[item.apps_item_seqid];
            }
          }
        }
      }

      return col;
    }

    const checkCond = (frame, tableRows, where_cond, inFlag) => {

      if (where_cond.indexOf(" and ") > -1) {
        let conArr = [];
        conArr = where_cond.split(" and ");

        for (let c of conArr) {
          let cArr = c.split("=");
          let val1 = this.get_item_value(cArr[1], 'current_record', flag);

          cArr[1] = val1 ? "'" + val1 + "'" : "''";
          c = cArr.join("=");
        }
        where_cond = conArr.join(" and ");

      } else {
        let cArr = where_cond.split("=");
        let val1 = this.get_item_value(cArr[1], 'current_record', flag);
        if (val1 == '') return;
        cArr[1] = val1 ? "'" + val1 + "'" : "''";
        where_cond = cArr.join("=");
      }

      for (let i = 0; i < tableRows.length; i++) {

        let cond;
        if (where_cond.indexOf(" and ") > -1) {
          let conArr = [];
          conArr = where_cond.split(" and ");

          for (let c of conArr) {
            let cArr = c.split("=");
            let val0 = this.get_rows_item(tableRows[i], cArr[0]);
            cArr[0] = val0 ? "'" + val0?.value + "'" : "''";
            c = cArr.join("==");
          }

          cond = conArr.join(" && ");

        } else {
          let cArr = where_cond.split("=");

          let val0 = this.get_rows_item(tableRows[i], cArr[0]);
          cArr[0] = val0 ? "'" + val0?.value + "'" : "''";
          cond = cArr.join("==");
        }

        if (eval(cond)) {
          let dirtyItem = this.check_row_dirty(null, tableRows[i]);
          if (dirtyItem) {
            if (!dirtyItem.frame_status || dirtyItem?.frame_status.toLowerCase() != 'dirty') {
              dirtyItem = JSON.parse(JSON.stringify(dirtyItem));
              dirtyItem.frame_status = 'dirty';
            }
            arr.push(getCol(frame, tableRows[i], dirtyItem, i, inFlag));
          }
        }

      }

    }


    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {

        if (frame.app_working_mode && frame.app_working_mode.includes("1")) { continue; }
        let col = {};
        if (frame && frame.tableRows && frame.tableRows.length > 0) {

          if (frame.apps_page_frame_seqid == this.object_mast.object_code + "-PARA" && frame.tableRows) {

            for (let itemGroup of frame.tableRows[0]) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {

                for (let item of itemGroup.Level5) {

                  if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX') {
                    item.value = frame.edit_record_index != undefined ? frame.edit_record_index : frame.active_row;
                  }

                  if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                    item.value = item.value != undefined ? typeof (item.value) != 'object' && typeof (item.value) != 'number' ? item.value.replaceAll(',', '') : item.value : '';
                  }


                  if (item.codeOfValues) {
                    col[item.item_name] = item.codeOfValues;
                  } else if (item.value != undefined && item.value != null) {
                    col[item.item_name] = item.value;
                  } else {
                    col[item.item_name] = "";
                  }


                  if (item.input_pattern && item.input_pattern.toLowerCase().includes('masked_field') && col[item.apps_item_seqid]) {
                    col[item.apps_item_seqid + '.ENC'] = this.encryptDecrypt.encryptData(col[item.apps_item_seqid]);
                    delete col[item.apps_item_seqid];
                  }

                }
              }
            }
            arr.push(col);

          } else if (((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) != 'A') &&
            (!frame.call_frame_CB || (frame.apps_page_frame_seqid != frame.call_frame_CB && frame.frame_alias != frame.call_frame_CB))) {

            let current_index = this.getCurrentIndex(frame);
            let index = current_index;
            let tableRows = [];

            let inFlag = false;

            if (str) {
              let is = str.split("#").find(x => (x && ((x.toUpperCase() == frame.frame_alias?.toUpperCase()) || (x.toUpperCase() == frame.apps_page_frame_seqid))));
              if (is != undefined) {
                inFlag = true;
              }
            }



            tableRows = frame.tableRows;
            if (!frame.auto_populate_default_where) {
              if (frame.tempRows && frame.tempRows.length > 0) {

                let tempFrame = this.get_frame_config(frame.apps_page_frame_seqid + 'A');

                if (tempFrame) {
                  tempFrame = JSON.parse(JSON.stringify(tempFrame));
                  // tempFrame = this.deepClone(tempFrame);
                  this.remove_extra_record(tempFrame);

                  if (frame.edit_record_index == undefined || current_index == frame.edit_record_index) {
                    current_index = 0;
                    // let dirtyItem = this.get_rows_item(tableRows[current_index], 'WMA_RECORD_STATUS');
                    let dirtyItem = this.check_row_dirty(null, tableRows[current_index]);
                    if ((dirtyItem && dirtyItem.frame_status && (dirtyItem.frame_status).toLowerCase() == 'dirty') && frame.edit_record_index == undefined) {
                      index = tempFrame.tableRows.length;
                    }
                  } else {
                    tableRows = tempFrame.tableRows;
                  }
                }

              }
            }


            if (frame.deletedRows && frame.deletedRows.length > 0) {
              index = parseInt(index) + frame.deletedRows.length;
            }

            // let dirtyItem = this.get_rows_item(tableRows[current_index], 'WMA_RECORD_STATUS');
            let dirtyItem = this.check_row_dirty(null, tableRows[current_index]);
            if (((dirtyItem && dirtyItem.frame_status && (dirtyItem.frame_status).toLowerCase() == 'dirty')) || (frame.edit_record_index != undefined)
              || ((frame.apps_frame_type == 'CANVAS' || frame.apps_frame_type == 'SYSTEM') && !frame.tempRows)) {


              /// function ***checkCond*** is used for multi record associate frame with where clause like(Addon frame) type scinerio////

              if (frame.auto_populate_default_where && !inFlag) {
                checkCond(frame, tableRows, frame.auto_populate_default_where, inFlag);
              } else {
                if (tableRows[current_index]) {
                  col = getCol(frame, tableRows[current_index], dirtyItem, index, inFlag);
                  arr.push(col);
                }
              }

            } else if (frame.auto_populate_default_where && frame.tempRows?.length > 0 && !inFlag) {
              checkCond(frame, frame.tempRows, frame.auto_populate_default_where, inFlag);
            } else if (!frame.auto_populate_default_where && frame.tempRows?.length > 0) {


              // let tempFrame = this.get_frame_config(frame.apps_page_frame_seqid + 'A');

              // if (tempFrame) {
              //   let i = tempFrame.active_row;
              //   let dirtyItem = this.check_row_dirty(null, frame.tempRows[i]);

              //   if ((dirtyItem && dirtyItem.frame_status && (dirtyItem.frame_status).toLowerCase() == 'dirty')) {
              //     col = getCol(frame, frame.tempRows[i], dirtyItem, i, inFlag);
              //     arr.push(col);
              //   }
              // }

              let dirtyItem = this.check_row_dirty(null, frame.tempRows[0]);

              if ((dirtyItem && dirtyItem.frame_status && (dirtyItem.frame_status).toLowerCase() == 'dirty')) {
                col = getCol(frame, frame.tempRows[0], dirtyItem, index, inFlag);
                arr.push(col);
              }

            }
          } else {
            if (frame.call_frame_CB) {
              delete frame['callingItm_CB'];
              delete frame['call_frame_CB'];
            }
          }
        }
      }
    }

    return arr;
  }

  getDp(str, flag?, get_working_mode_item?) {
    let arr = [];
    let sqArr = str ? str.includes(";") ? str.split(";") : (str.includes("#") ? str.split("#") : [str]) : [];
    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {

        if (frame.app_working_mode && frame.app_working_mode.includes("1")) { continue; }

        for (let f of sqArr) {
          if ((f.toLowerCase() == frame.apps_page_frame_seqid.toLowerCase() || (frame.frame_alias && f.toLowerCase() == frame.frame_alias.toLowerCase())) &&
            (!frame.call_frame_CB || (frame.apps_page_frame_seqid != frame.call_frame_CB && frame.frame_alias != frame.call_frame_CB))) {

            let tableRows = [];
            let index = 0;
            if (frame.deletedRows && frame.deletedRows.length > 0) {
              // tableRows = frame.deletedRows;

              for (let rows of frame.deletedRows) {
                let col = {};
                for (let itemGroup of rows) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {

                    for (let item of itemGroup.Level5) {

                      if ((item.apps_working_mode && item.apps_working_mode.includes("1")) && !get_working_mode_item) { continue; }

                      if (item.apps_item_seqid && item.apps_item_seqid.toLowerCase().includes(".file") && (str && !str.toLowerCase().includes("file"))) { continue; }

                      if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                        item.value = item.value != undefined ? typeof (item.value) != 'object' && typeof (item.value) != 'number' ? item.value.replaceAll(',', '') : item.value : '';
                      }

                      if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX') {
                        item.value = typeof (index) != 'string' ? index.toString() : index;
                      }

                      if (flag) {
                        col = this.get_col(col, item, frame);
                      } else {
                        if (item.codeOfValues) {
                          col[item.apps_item_seqid] = item.codeOfValues;
                          // coltp[item.item_name] = item.codeOfValues;
                        } else if (item.value != undefined && item.value != null) {
                          if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                            col[item.apps_item_seqid] = item.value != undefined ? item.value.toString().replaceAll(',', '') : '';
                            // coltp[item.item_name] = item.value ? item.value.toString().replaceAll(',', '') : '';
                          } else {
                            col[item.apps_item_seqid] = typeof (item.value) != 'string' ? item.value.toString() : item.value;
                            // coltp[item.item_name] = item.value;
                          }
                        } else {
                          col[item.apps_item_seqid] = "";
                          // coltp[item.item_name] = "";
                        }
                      }

                      if (item.input_pattern && item.input_pattern.toLowerCase().includes('masked_field') && col[item.apps_item_seqid]) {
                        col[item.apps_item_seqid + '.ENC'] = this.encryptDecrypt.encryptData(col[item.apps_item_seqid]);
                        delete col[item.apps_item_seqid];
                      }
                    }
                  }
                }
                arr.push(col);
                index++;
              }
            }

            if (frame && frame.tempRows && frame.tempRows.length > 0) {
              tableRows = tableRows.concat(frame.tempRows);
            } else {
              tableRows = tableRows.concat(frame.tableRows);
            }

            let indexArr = frame.indexStr ? frame.indexStr.split(";") : (frame.executing_index != undefined ? [parseInt(frame.executing_index) + (frame.deletedRows && frame.deletedRows.length > 0 ? frame.deletedRows.length : 0)] :
              (frame.edit_record_index != undefined ? [parseInt(frame.edit_record_index)] : []));
            for (let i = 0; i < tableRows.length; i++) {

              let idEdited = indexArr.find(x => parseInt(x) == i);

              if (idEdited == undefined) {
                // let dirtyItem = this.get_rows_item(tableRows[i], 'WMA_RECORD_STATUS');
                let dirtyItem = this.check_row_dirty(null, tableRows[i]);
                if ((frame.apps_frame_sub_type == 'SINGLE_ROW' || frame.apps_frame_sub_type == 'SINGLE_ROW_BLANK' || frame.no_of_records == '1') && frame.auto_populate_default_where) {
                  // dirtyItem = this.get_rows_item(tableRows[0], 'WMA_RECORD_STATUS');
                  dirtyItem = this.check_row_dirty(null, tableRows[0]);
                }
                if ((dirtyItem && dirtyItem.frame_status && (dirtyItem.frame_status).toLowerCase() == 'dirty')) {
                  let col = {};
                  for (let itemGroup of tableRows[i]) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {

                      for (let item of itemGroup.Level5) {

                        if ((item.apps_working_mode && item.apps_working_mode.includes("1")) && !get_working_mode_item) { continue; }

                        if (item.apps_item_seqid && item.apps_item_seqid.toLowerCase().includes(".file") && (str && !str.toLowerCase().includes("file"))) { continue; }

                        if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                          item.value = item.value != undefined ? typeof (item.value) != 'object' && typeof (item.value) != 'number' ? item.value.replaceAll(',', '') : item.value : '';
                        }

                        if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX') {
                          item.value = typeof (index) != 'string' ? index.toString() : index;
                        }

                        if (item.item_name.toUpperCase() == 'WMA_RECORD_STATUS') {
                          if (((frame.apps_frame_type == 'CANVAS' || frame.apps_frame_type == 'SYSTEM') && !frame.tempRows) && (!dirtyItem || (dirtyItem && (!dirtyItem.frame_status || (dirtyItem.frame_status).toLowerCase() != 'dirty')))) {
                            item.value = 'Z';
                          } else {
                            if (!item.value || item.value.toUpperCase() != 'U' && item.value.toUpperCase() != 'D') {
                              item.value = 'I';
                            }
                          }
                        }

                        if (flag) {
                          col = this.get_col(col, item, frame);
                        } else {
                          if (item.codeOfValues) {
                            col[item.apps_item_seqid] = item.codeOfValues;
                            // coltp[item.item_name] = item.codeOfValues;
                          } else if (item.value != undefined && item.value != null) {
                            if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                              col[item.apps_item_seqid] = item.value != undefined ? item.value.toString().replaceAll(',', '') : '';
                              // coltp[item.item_name] = item.value ? item.value.toString().replaceAll(',', '') : '';
                            } else {
                              col[item.apps_item_seqid] = typeof (item.value) != 'string' ? item.value.toString() : item.value;
                              // coltp[item.item_name] = item.value;
                            }
                          } else {
                            col[item.apps_item_seqid] = "";
                            // coltp[item.item_name] = "";
                          }
                        }


                        if (item.input_pattern && item.input_pattern.toLowerCase().includes('masked_field') && col[item.apps_item_seqid]) {
                          col[item.apps_item_seqid + '.ENC'] = this.encryptDecrypt.encryptData(col[item.apps_item_seqid]);
                          delete col[item.apps_item_seqid];
                        }

                      }
                    }
                  }
                  arr.push(col);
                }
              }

              index++;
            }

            if (frame.indexStr || (frame.edit_record_index != undefined)) {
              if (frame.indexStr) {
                indexArr = frame.indexStr.split(";");
              } else if (frame.edit_record_index != undefined) {
                indexArr = [frame.edit_record_index]
              }

              if (frame.tableRows && frame.tableRows.length > 0 && indexArr.length > 0) {
                for (let fi = 0; fi < frame.tableRows.length; fi++) {
                  let newIndex = (frame.deletedRows ? frame.deletedRows.length : 0) + parseInt(indexArr[fi]);
                  let dpclRec = this.getWsdpcl(frame.tableRows[fi], newIndex.toString(), false, true, str);
                  arr.push(dpclRec);
                }
              }
            }

          }
        }

        if (frame.call_frame_CB && (frame.apps_page_frame_seqid == frame.call_frame_CB || frame.frame_alias == frame.call_frame_CB)) {

          let index = 0;

          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let framedata of frame.tableRows) {
              for (let itemGroup of framedata) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if ((item.apps_item_seqid == frame.callingItm_CB || item.item_name == frame.callingItm_CB) && item.value == frame.item_CB_value) {

                      let col = {};
                      let coltp = {};
                      for (let itmGrp of framedata) {
                        if (itmGrp.Level5 && itmGrp.Level5.length > 0) {
                          for (let itm of itmGrp.Level5) {
                            if ((itm.apps_working_mode && itm.apps_working_mode.includes("1")) && !get_working_mode_item) { continue; }

                            if (itm.item_name.toUpperCase() == 'WMA_RECORD_INDEX') {
                              itm.value = typeof (index) != 'string' ? index.toString() : index;
                            }


                            if (flag) {
                              col = this.get_col(col, itm, frame);
                            } else {

                              if (itm.codeOfValues) {
                                col[itm.apps_item_seqid] = itm.codeOfValues;
                                coltp[itm.item_name] = itm.codeOfValues;
                              } else if (itm.value != undefined && itm.value != null) {
                                if (itm.datatype && itm.datatype.toUpperCase() == 'NUMBER') {
                                  // col[itm.apps_item_seqid] = itm.value ? itm.value.toString().replaceAll(',', '') : '';
                                  // coltp[itm.item_name] = itm.value ? itm.value.toString().replaceAll(',', '') : '';
                                  col[itm.apps_item_seqid] = itm.value != undefined ? itm.value.toString().replaceAll(',', '') : '';
                                } else {
                                  col[itm.apps_item_seqid] = typeof (itm.value) != 'string' ? itm.value.toString() : itm.value;
                                  // coltp[itm.item_name] = itm.value;
                                }
                              } else {
                                col[itm.apps_item_seqid] = "";
                                coltp[itm.item_name] = "";
                              }
                            }

                            if (item.input_pattern && item.input_pattern.toLowerCase().includes('masked_field') && col[item.apps_item_seqid]) {
                              col[item.apps_item_seqid + '.ENC'] = this.encryptDecrypt.encryptData(col[item.apps_item_seqid]);
                              delete col[item.apps_item_seqid];
                            }
                          }
                        }
                      }

                      arr.push(col);
                      // wsdptp.push(coltp);
                      index++;

                    }
                  }
                }
              }
            }
          }


        }
      }
    }

    return arr;
  }


  app_clear_item(event?, name?, rowNum?) {
    if (event && event.item_name == name) {
      this.set_item_value(event, name, rowNum, "", null, null, true);
      event.item_name = null;
    } else {
      this.set_item_value(event, name, rowNum, "", null, null, true);
    }
  }

  get_f_items() {
    let str = "";
    if (this.object_mast && this.object_mast.Level2 && this.object_mast.Level2.length > 0) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {

          if (frame.tableRows && frame.tableRows.length > 0) {
            let tableRows = [];
            tableRows = frame.tableRows;

            if (frame.tempRows && frame.tempRows.length > 0) {
              tableRows = frame.tempRows;
            }

            for (let framedata of tableRows) {
              let col = {};
              let coltp = {};
              for (let itemGroup of framedata) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (item.item_name && item.item_name.substring(0, 2).toLowerCase() == "f_") {
                      str = str + "app_add_para(false,\"" + item.item_name.toLowerCase().replace("g_", "f_") + "\",\"" + (item.value ? item.value : "") + "\");";
                    }
                  }
                } else {
                  if (itemGroup && itemGroup.length > 0) {
                    for (let item of itemGroup) {
                      if (item.item_name && item.item_name.substring(0, 2).toLowerCase() == "f_") {
                        str = str + "app_add_para(false,\"" + item.item_name.toLowerCase().replace("g_", "f_") + "\",\"" + (item.value ? item.value : "") + "\");";
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return str;
  }

  ////////********** App Delet Record *********** */

  getWsdpcl(tableRowss, index?, searchable?, setFlag?, str?, get_working_mode_item?) {
    let tableRows = tableRowss;
    let col = {};
    if (tableRows) {
      for (let itemGroup of tableRows) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {

            if ((item.apps_working_mode && item.apps_working_mode.includes("1")) && !get_working_mode_item) { continue; }

            if (item.apps_item_seqid && item.apps_item_seqid.toLowerCase().includes(".file") && (str && !str.toLowerCase().includes("file"))) { continue; }

            if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
              item.value = item.value != undefined ? typeof (item.value) != 'object' && typeof (item.value) != 'number' ? item.value.replaceAll(',', '') : item.value : '';
            }

            if (item.item_name.toUpperCase() == 'WMA_RECORD_INDEX' && (item.value == undefined || setFlag)) {
              if (searchable) {
                let newInd = item.indexcount != undefined ? item.indexcount : (item.itemIndex ? item.itemIndex : (item.indexCount ? item.indexCount : 0));
                index = item.max_record ? item.max_record + newInd : newInd;
              }
              // console.log("mai yaha aaya tha =====>>>>>" , `pehle ye tha ${item.value} fir ye kiya ${index}`);
              item.value = index;

            }

            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues;
              // coltp[item.item_name] = item.codeOfValues;
            } else if (item.value != undefined && item.value != null) {
              if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                col[item.apps_item_seqid] = item.value != undefined ? item.value.toString().replaceAll(',', '') : '';
                // coltp[item.item_name] = item.value ? item.value.toString().replaceAll(',', '') : '';
              } else {
                col[item.apps_item_seqid] = typeof (item.value) != 'string' ? item.value.toString() : item.value;
                // coltp[item.item_name] = item.value;
              }
            } else {
              col[item.apps_item_seqid] = "";
              // coltp[item.item_name] = "";
            }
          }
        }
      }
    }
    return col;
  }


  getSepratorGrp(frame) {

    // this.itemSeparation(frame);
    let tableRows = [];

    let newRows = frame.searchableData ? frame.searchableData : frame.tableRows;

    if (newRows) {
      let from = 0;
      let to = newRows.length
      if (frame.from_record) {
        from = frame.from_record;
      }
      if (frame.to_record && newRows.length > frame.to_record) {
        to = frame.to_record;
      } else {
        to = newRows.length
      }

      for (let i = from; i < to; i++) {
        tableRows.push(newRows[i]);
      }
    } else {
      if (frame.apexFrameLevel4 && frame.apexFrameLevel4 > 0) {
        tableRows[0] = JSON.parse(JSON.stringify(frame.apexFrameLevel4));
      } else if (frame.Level4 && frame.Level4.length > 0) {
        tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
      }
    }

    if (frame.apps_frame_type.toUpperCase().includes("CARD") && tableRows.length > 0) {
      this.getCardData(frame, tableRows);
    }

    let tabRows = this.seprateData(frame, tableRows);

    if (tabRows && tabRows.length > 0) {
      if (!frame.headers || frame.headers.length < 1) {
        frame.headers = JSON.parse(JSON.stringify(tabRows[0]));
      }

    }

    if (frame.apps_frame_type == 'HORIZONTAL_TABLE') {
      frame.canvasRows = this.globalObjects.transpose(tabRows);

    } else {
      if (frame.apps_frame_type == 'CARD') {
        // frame.canvasRows = new BehaviorSubject<any[]>([]);
        frame.canvasRows = tabRows;
      } else {
        frame.canvasRows = tabRows;
      }
    }

    if (frame.apps_frame_type != 'HORIZONTAL_TABLE' && frame.apps_frame_type != 'ENTRY_TABLE' && frame.apps_frame_type != 'TABLE') {
      this.setPromptColTableRows(frame);
    }
    tableRows = []
  }


  seprateData(frame, tableRows) {
    let tabRows: any = [];
    let sepKey = [];
    let frameLvel4 = frame.apexFrameLevel4 ? frame.apexFrameLevel4 : frame.Level4
    for (let itemGroup of frameLvel4) {
      if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_type == 'FRAME_SEPARATOR') {
        if (frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'ENTRY_TABLE' || frame.temp_frame_type == 'TABLE' || frame.temp_frame_type == 'ENTRY_TABLE') {
          if (itemGroup.Level5[0].item_visible_flag == 'T') {
            sepKey.push(itemGroup);
            frame.showTd = "SHOW";
          }
        } else {
          sepKey.push(itemGroup);
          frame.showTd = "SHOW";
        }

      }
    }

    if (sepKey.length > 0 && tableRows) {
      frame.itIsSepratorFrame = true
      for (let tableData of tableRows) {

        let rows: any = [];
        let keyArr = this.deepClone(sepKey);

        for (let k of keyArr) {
          let grprows = [];
          let i = 0;
          for (let kGrp of k.Level5) {

            if (k.Level5 && k.Level5[0].item_sub_type == 'TAB_OPEN') {
              kGrp.sepFrame = "SHOW";
            } else {
              if (i == 0) {
                kGrp.sepFrame = "SHOW";
              } else {
                kGrp.sepFrame = "HIDE";
              }
            }

            kGrp.sepCollapse = "SHOW";
            if (kGrp.item_sub_type && kGrp.item_sub_type.toLowerCase() == "collapse") {
              kGrp.sepCollapse = "HIDE";
            }
            grprows = [];
            let sepItmArr = [];
            let a = 0;
            for (let itemGroup of tableData) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {

                // for (let item of itemGroup.Level5) {
                //   item.initialChange = true;
                // }

                if (itemGroup.Level5[0] && itemGroup.Level5[0].item_seqno && itemGroup.Level5[0].item_seqno.indexOf(".") > -1) {
                  if (itemGroup.Level5[0].item_seqno.split(".")[0] == kGrp.item_seqno) {
                    for (let item of itemGroup.Level5) {

                      if (kGrp.item_sub_type == 'TAB_VERTICAL' || kGrp.item_sub_type == 'TAB_HORIZONTAL' || kGrp.item_sub_type == 'COLLAPSE') {
                        item.isSeprated = {
                          sepratorId: kGrp.apps_item_seqid,
                          sepeatorName: kGrp.item_name,
                          sepratorGprId: k.apps_item_seqid
                        }
                      }

                    }

                    sepItmArr.push(itemGroup);
                  }

                  let no = sepKey.find(x => x.Level5.find(y => y.item_seqno == itemGroup.Level5[0].item_seqno.split(".")[0]));
                  // console.log(no);

                  if (no) { } else {
                    if (itemGroup.Level5[0].item_type != 'FRAME_SEPARATOR') {

                      if ((frame.apps_frame_type == 'ENTRY_TABLE' || frame.temp_frame_type == 'ENTRY_TABLE') && frame.showTd == "SHOW") {

                        for (let item of itemGroup.Level5) {
                          if (item.item_type != "FRAME_BUTTON_ICON") {
                            let val;
                            if (item.display_setting_str) {
                              if (typeof (item.display_setting_str) == 'object') {
                                val = item.display_setting_str['width'];
                              } else {
                                let strObj = JSON.parse(item.display_setting_str);
                                val = strObj['width'];
                              }
                            }

                            if (val) { } else {
                              val = 100 + "px";
                            }
                            if (item.item_visible_flag == 'T') {
                              let freezTd = {
                                "width": val,
                                "min-width": val,
                                "max-width": val,
                                "left": a + "px",
                                "z-index": "10",
                                "position": "sticky",
                                "top": "0"
                              }
                              // item.freezStyle = JSON.parse(JSON.stringify(freezTd));
                              item.freezStyle = { ...freezTd };
                              a = a + parseInt(val.replace("px", ""));

                            }
                          }
                        }
                      }

                      grprows.push(itemGroup);
                    }
                  }
                } else {

                  if ((frame.apps_frame_type == 'ENTRY_TABLE' || frame.temp_frame_type == 'ENTRY_TABLE') && frame.showTd == "SHOW") {

                    for (let item of itemGroup.Level5) {
                      if (item.item_type != "FRAME_BUTTON_ICON" && item.item_type != "FRAME_SEPARATOR") {
                        let val;
                        if (item.display_setting_str) {
                          if (typeof (item.display_setting_str) == 'object') {
                            val = item.display_setting_str['width'];
                          } else {
                            let strObj = JSON.parse(item.display_setting_str);
                            val = strObj['width'];
                          }
                        }

                        if (val) { } else {
                          val = 100 + "px";
                        }
                        if (item.item_visible_flag == 'T' && k.Level5[0].item_sub_type != 'TAB_OPEN') {
                          let freezTd = {
                            "width": val,
                            "min-width": val,
                            "max-width": val,
                            "left": a + "px",
                            "z-index": "10",
                            "position": "sticky",
                            "top": "0"
                          }
                          // item.freezStyle = JSON.parse(JSON.stringify(freezTd));
                          item.freezStyle = { ...freezTd };
                          a = a + parseInt(val.replace("px", ""));

                        }
                      }
                    }
                  }

                  grprows.push(itemGroup);
                }
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  let itm = itemGroup.Level5.find(x => x.item_name == kGrp.item_name);
                  if (itm) {
                    kGrp.value = itemGroup.Level5[0].value;
                  }
                }
              }
            }
            kGrp.containerRowss = sepItmArr;
            /* start For showing * on seperator promptname*/
            if (kGrp.sepCollapse == "HIDE") {
              let requireItem = false
              for (let sepItem of sepItmArr) {
                for (let item of sepItem.Level5) {
                  if (item.data_required_flag == "T") {
                    requireItem = true
                    break;
                  }
                }
                if (requireItem) {
                  kGrp.prompt_name = kGrp.prompt_name ? `${kGrp.prompt_name} *` : ''
                  break;
                }
              }
            }
            /* end For showing * on seperator promptname*/
            i++;
            let arr = []
            if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.temp_frame_type == 'ENTRY_TABLE') {
              for (let itemGrp of kGrp.containerRowss) {
                for (let i of itemGrp.Level5) {
                  if (i.item_visible_flag == 'T') {
                    arr.push(i);
                  }
                }

              }
              kGrp.colspan = arr.length;
            }
          }
          rows = grprows;
          // console.log(rows)
        }

        for (let g = 0; g < rows.length; g++) {

          let itmGrp = keyArr.find(k => rows[g].Level5 && rows[g].Level5.length > 0 && k.Level5 && k.Level5.length > 0 && rows[g].Level5[0].apps_item_seqid == k.Level5[0].apps_item_seqid);
          if (itmGrp) {
            let xx = tableData.find(k => rows[g].Level5 && rows[g].Level5.length > 0 && k.Level5 && k.Level5.length > 0 && rows[g].Level5[0].apps_item_seqid == k.Level5[0].apps_item_seqid);
            rows[g] = itmGrp;
            rows[g].Level5[0].indexcount = xx.Level5[0].indexcount;
          }
          if (tableData.running) {
            rows.running = true
          }
          if (tableData.runningBtn) {
            rows.runningBtn = true
          }
        }
        // divArr.push(sepRowArr);
        tabRows.push(rows);
        // frame.headers = JSON.parse(JSON.stringify(rows));
      }

    } else {
      tabRows = tableRows;
    }
    return tabRows;
  }

  getCardData(frame, tableRows) {

    frame.footerArr = [];
    frame.headerarr = [];
    frame.cardRightArray = [];
    frame.cardLeftArray = [];
    let hideItem = 0
    let showItem = 0
    let count = frame.apps_frame_sub_type == 'IMAGE' ? 5 : 4
    for (let frameLevel4 of tableRows) {
      let footerRow = [];
      let rightRow = [];
      let leftRow = [];
      let headerRow = [];
      let bodyRow = [];
      let rightClick = [];
      for (let itemGroup of frameLevel4) {
        let footerGrp = [];
        let headerGrp = [];
        let rightGrp = [];
        let leftGrp = [];
        let bodyGrp = [];
        let rightClickGrp = [];
        for (let item of itemGroup.Level5) {
          //start  Worked by arti
          if (item.item_visible_flag == 'F' || item.item_type == 'FRAME_BUTTON_ICON' || item.item_type == 'RIGHT_CLICK') {
            if (showItem < count) {
              hideItem++
            }
          } else {
            if (showItem < count) {
              showItem++
            }
          }
          // End 
          if ((item.position == 'CARD_FOOTER' || item.item_type == 'FRAME_BUTTON_ICON') && item.item_visible_flag == 'T') {
            frame.footer_flag = true;
            footerGrp.push(itemGroup);
            continue;
          }
          if ((item.item_sub_type == 'CARD_TITLE' || item.position == 'CARD_HEADER') && item.item_visible_flag == 'T') {
            frame.cardtitleFlag = true;
            headerGrp.push(itemGroup);
            continue;
          }
          if (item.position == 'CARD_RIGHT' && item.item_visible_flag == 'T') {
            frame.right_flag = true;
            rightGrp.push(itemGroup);
            continue;
          }
          if (item.position == 'CARD_LEFT' && item.item_visible_flag == 'T') {
            frame.left_flag = true;
            leftGrp.push(itemGroup);
            continue;
          }
          // if(item.item_type == 'RIGHT_CLICK'){
          //   rightClickGrp.push(itemGroup)
          //   continue;
          // }
          if (item.item_visible_flag == "T" && item.position != 'CARD_RIGHT' && item.position != 'CARD_LEFT' && item.position != 'CARD_FOOTER' && item.position != 'CARD_HEADER' && item.item_sub_type != 'CARD_TITLE' && item.item_type != 'FRAME_BUTTON_ICON') {
            bodyGrp.push(itemGroup)
          }


        }

        if (footerGrp.length > 0) {
          footerRow.push(footerGrp[0]);
        }
        if (rightGrp.length > 0) {
          rightRow.push(rightGrp[0]);
        }
        if (leftGrp.length > 0) {
          leftRow.push(leftGrp[0]);
        }
        if (headerGrp.length > 0) {
          headerRow.push(headerGrp[0]);
        }
        if (bodyGrp.length > 0) {
          bodyRow.push(bodyGrp[0])
        }
        // if(rightClickGrp.length > 0){
        //    rightClick.push(rightClickGrp[0])
        // }
      }

      if (bodyRow.length > 0) {
        for (let [index, framedata] of bodyRow.entries()) {
          for (let item of framedata.Level5) {
            if (index > 4) {
              frameLevel4.running = true
            }
          }
        }
        bodyRow = [];
      }

      if (footerRow.length > 0) {
        frame.footerArr ? frame.footerArr.push(footerRow) : frame.footerArr = [footerRow];
        let i = 0;
        for (let framedata of footerRow) {
          for (let itemGroup of framedata.Level5) {
            if (itemGroup.item_visible_flag == "T") {
              i++;
              if (i > 1) {
                frameLevel4.runningBtn = true
              }
            }
          }
        }
        footerRow = [];
      } if (headerRow.length > 0) {
        frame.headerarr ? frame.headerarr.push(headerRow) : frame.headerarr = [headerRow];
        headerRow = [];
      }
      if (rightRow.length > 0) {
        frame.cardRightArray ? frame.cardRightArray.push(rightRow) : (frame.cardRightArray = [rightRow]);
        rightRow = [];
      }
      if (leftRow.length > 0) {
        frame.cardLeftArray ? frame.cardLeftArray.push(leftRow) : frame.cardLeftArray = [leftRow];
        leftRow = [];
      }
    }
    frame.showCountData = hideItem + showItem
    console.log(frame.showCountData)
  }

  execute_events(item, event) {
    item.executed_item = true;
    if (event.returnId) {
      this.checkOriginItem(item, event);
    } else {
      this.events.publish("execute_item_events", item);
    }
  }

  checkOriginItem(item, event) {
    if (event) {
      let orItem = this.get_item(event.returnId, event.returnIndex);
      if (orItem) {
        item.returnId = orItem.apps_page_frame_seqid + "." + orItem.item_name;
        item.returnIndex = orItem.itemIndex;

        // delete event['returnId'];
        // delete event['returnIndex'];

        this.execute_events(item, orItem);
      }
    }
  }


  app_restore_record(event, frame_name?) {
    if (frame_name) { } else {
      frame_name = event.apps_page_frame_seqid;
    }

    let frame = this.get_frame_config(frame_name);

    if (frame && frame.restored_record) {
      frame.tableRows = JSON.parse(JSON.stringify(frame.restored_record));
      frame.restored_record = null;
    }
  }

  pass_frame_data(to, from, toItems, fromItems) {
    let arr = [];

    try {
      toItems = JSON.parse(toItems);
    } catch {
      toItems = toItems;
    }
    try {
      fromItems = JSON.parse(fromItems);
    } catch {
      fromItems = fromItems;
    }

    let frame = this.get_frame_config(from);
    if (frame && frame.tableRows.length > 0) {
      let index = 0;
      for (let tableData of frame.tableRows) {
        for (let itemGroup of tableData) {
          for (let item of itemGroup.Level5) {
            for (let i = 0; i < fromItems.length; i++) {
              if (item.item_name.toLowerCase() == fromItems[i].toLowerCase()) {
                let col: any = {};
                col.status = 'J';
                col.object_code = null;
                col.frame_name = to;
                col.row_slno = index;
                col.item_name = toItems[i];
                col.para_type = "IV";
                col.para_value = item.value;
                arr.push(col);
              }
            }
          }
        }
        index++;
      }
    }

    this.globalObjects.passDataArr.push({ frameName: to, data: arr })
    // console.log(arr);
  }

  app_copy_frame(from, jsonName, fromItems) {
    let arr = [];
    let fromItemsArr = [];
    if (fromItems.indexOf(",") > -1) {
      fromItemsArr = fromItems.split(",");
    } else {
      fromItemsArr[0] = fromItems;
    }

    let frame = this.get_frame_config(from);
    if (frame && frame.tableRows && frame.tableRows.length > 0) {
      let index = 0;
      for (let tableData of frame.tableRows) {
        for (let itemGroup of tableData) {
          for (let item of itemGroup.Level5) {
            for (let i = 0; i < fromItemsArr.length; i++) {
              if (item.item_name.toLowerCase() == fromItemsArr[i].toLowerCase()) {
                let col: any = {};
                col.status = 'J';
                col.object_code = null;
                col.frame_name = null;
                col.row_slno = index;
                col.item_name = item.item_name;
                col.para_type = "IV";
                col.para_value = item.value;
                arr.push(col);
              }
            }
          }
        }
        index++;
      }
    }

    let glob = this.globalObjects.copyDataArr.find(x => x.jsonName.toLowerCase() == jsonName.toLowerCase());

    if (glob) {
      glob.dataArr = arr;
    } else {
      this.globalObjects.copyDataArr.push({ jsonName: jsonName, dataArr: arr });
    }
    // console.log(arr);
  }

  app_paste_frame(to, jsonName, toItems) {
    let arr = [];
    let toItemsArr = []
    if (toItems.indexOf(",") > -1) {
      toItemsArr = toItems.split(",");
    } else {
      toItemsArr[0] = toItems;
    }

    let itemArr = [];

    for (let it of toItemsArr) {
      it = it.replaceAll("'", "");
      let obj = {
        toItem: it.split("=")[0],
        fromItem: it.split("=")[1]
      }

      itemArr.push(obj);
    }

    let index = 0;
    let spliceIndex;
    let flag = false;

    for (let data of this.globalObjects.copyDataArr) {
      if (data.jsonName.toLowerCase() == jsonName.toLowerCase()) {
        for (let item of data.dataArr) {
          for (let i = 0; i < itemArr.length; i++) {
            if (item.item_name.toLowerCase() == itemArr[i].fromItem.toLowerCase()) {
              item.frame_name = to;
              item.item_name = itemArr[i].toItem;
            }
          }
        }
        spliceIndex = index;
        flag = true;
        arr = JSON.parse(JSON.stringify(data.dataArr));
      }
      index++;
    }

    return arr;

    // this.events.publish("jsonData" + (this.globalObjects.pageEventId - 1), d);
    //this.globalObjects.copyDataArr.splice(spliceIndex,1);

  }

  go_next_item(item, index?) {


    let rowIndex = index ? index : (item.itemIndex ? item.itemIndex : item.indexcount ? item.indexcount : item.indexCount ? item.indexCount : 0);
    let frameName = item.apps_page_frame_seqid;
    let itemName = item.item_name;
    let newItem: any;

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : true)) {

          rowIndex = this.get_current_record(index, frame) ?? 0;

          if (frame.tableRows) {
            let found = false;
            for (let framedata of frame.tableRows) {
              for (let itemGroup of framedata) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (found && item.item_visible_flag != 'F' && item.item_enable_flag != 'F') {
                      newItem = item;
                      break;

                    }
                    if (item.item_name == itemName) {
                      found = true;
                    }
                  }
                  if (newItem) {
                    break
                  }
                } else if (itemGroup && itemGroup.length > 0) {
                  for (let item of itemGroup) {
                    if (found && item.item_visible_flag != 'F' && item.item_enable_flag != 'F') {
                      newItem = item;
                      break;
                    }
                    if (item.item_name == itemName) {
                      found = true;
                    }
                  }
                }
              }
              if (newItem) {
                break
              }
            }
          } else {
            let found = false;
            for (let itemGroup of frame.Level4) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (found && item.item_visible_flag != 'F' && item.item_enable_flag != 'F') {
                    newItem = item;
                    break;
                  }
                  if (item.item_name == itemName) {
                    found = true;
                  }
                }
              }
            }
          }

          if (newItem) {
            itemName = newItem.item_name;
            rowIndex = newItem.indexcount ? newItem.indexcount : newItem.indexCount ? newItem.indexCount : newItem.itemIndex ? newItem.itemIndex : 0;
          }

          if (frame.apps_frame_type == 'ENTRY_TABLE') {
            if (isPlatformServer(this.platformId)) return;
            let container = document.querySelector("#" + frame.apps_page_frame_seqid + (rowIndex ? rowIndex : ''));
            if (container) {
              var universe = container.querySelectorAll(
                "input,select"
              );
              var list = Array.prototype.filter.call(universe, function (item) {
                return item.tabIndex >= "0";
              });
              let el = list.find((el) => el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase());
              if (el) {
                el.focus();
                // el.setFocus();
              }
            }
          } else {
            if (isPlatformServer(this.platformId)) return;
            let container = document.querySelector("#" + frame.apps_page_frame_seqid);
            if (container) {
              var universe = container.querySelectorAll(
                "input,select"
              );
              var list = Array.prototype.filter.call(universe, function (item) {
                return item.tabIndex >= "0";
              });
              let el = list.find((el) => el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase());
              if (el) {
                el.focus();
                //  el.setFocus();
              }
            }

          }

        }
      }
    }
  }

  get_rows_item(rows, itemName) {

    if (itemName.indexOf("::") > -1) {
      itemName = itemName.split("::")[1];
    } if (itemName.indexOf(":") > -1) {
      itemName = itemName.split(":")[1];
    }
    let name;
    if (itemName.indexOf(".") > -1) {
      name = itemName.split(".")[1].trim();
    } else {
      name = itemName ? itemName.trim() : itemName;
    }

    if (rows && rows.length > 0) {
      let frame_name = rows[0].Level5[0].apps_page_frame_seqid;
      let idx = this.get_name_index(name, frame_name);

      if (idx) {
        // for (let itemGroup of rows) {
        let itemGroup = rows[idx.level4Index];
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if ((item.item_name && item.item_name.toUpperCase() == name.toUpperCase()) || (item.apps_item_seqid && item.apps_item_seqid.toUpperCase() == name.toUpperCase())) {
              return item;
            }
          }
        } else {
          if (itemGroup && itemGroup.length > 0) {
            for (let item of itemGroup) {
              if ((item.item_name && item.item_name.toUpperCase() == name.toUpperCase()) || (item.apps_item_seqid && item.apps_item_seqid.toUpperCase() == name.toUpperCase())) {
                return item;
              }
            }
          }
        }
      } else {

        let tRow = [];
        if (name.toUpperCase() == 'WMA_RECORD_STATUS') {
          tRow = JSON.parse(JSON.stringify(rows));
          tRow = tRow.reverse();
        } else {
          tRow = rows
        }

        for (let itemGroup of tRow) {
          if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
            for (let item of itemGroup.Level5) {
              if ((item.item_name && item.item_name.toUpperCase() == name.toUpperCase()) || (item.apps_item_seqid && item.apps_item_seqid.toUpperCase() == name.toUpperCase())) {
                return item;
              }
            }
          } else {
            if (itemGroup && itemGroup.length > 0) {
              for (let item of itemGroup) {
                if ((item.item_name && item.item_name.toUpperCase() == name.toUpperCase()) || (item.apps_item_seqid && item.apps_item_seqid.toUpperCase() == name.toUpperCase())) {
                  return item;
                }
              }
            }
          }
        }
      }
    }
    return;
  }

  setValue(item, value, frame_type, frameId, event?, runEvent?, clearOldValue?: boolean, from_mirror?) {

    if (item.datatype == "DATE" || item.datatype == "DATETIME") {
      item.displayDate = value;
    }

    item.value = value;
    item.assigned_value = item.value;
    if (value != undefined && value != null && value !== "") {
      item.isValid = true;
    }

    if (item.item_type == 'LIST_BOX' && item.dropdownList && item.dropdownList.length > 0 && item.value) {
      let is = item.dropdownList.find(x => x.val == item.value);
      if (!is) {
        item.value = "";
        item.msgError = `The Value for ${item.item_name} is not defined`;
      }
    } else if (item.item_type == 'LIST_BOX' && !item.value) {
      if (item.valueArr && item.valueArr.length > 0) {
        item.valueArr = [];
      }
    }

    if (item.item_type == 'CHECK_BOX') {
      setTimeout(() => {
        // requestAnimationFrame(() => {
        if (item.value == 'Y' || item.value == 1) {
          // item.initialVal = true;
          if (item.radioArray && item.radioArray.length > 0) {
            item.radioArray[0].isChecked = true
            item.radioArray[0].val = item.datatype && item.datatype == 'NUMBER' ? 1 : 'Y';
          }
          item.isChecked = true;
        } else if (item.value == 'N' || item.value == 0) {
          // setTimeout(() => {
          // item.initialVal = true;
          if (item.radioArray && item.radioArray.length > 0) {
            item.radioArray[0].isChecked = false;
            item.radioArray[0].val = item.datatype && item.datatype == 'NUMBER' ? 0 : 'N';
          }
          item.isChecked = false;

          if (item.item_type == 'CHECK_BOX' && item.item_name.toLowerCase().startsWith("sys_")) {
            let hItem = this.get_item_search(item.apps_page_frame_seqid + "." + item.item_name.toLowerCase().replace("sys_", ""));
            if (hItem.isChecked) {
              hItem.isChecked = false;
              hItem.noExecute = true;
              item.noExecute = true;
            }
          }
          // }, 1)
        }
        this.cdEngine.mark(item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frameId);
        // })
      }, 10);
    }

    if (item.item_type == 'FILE_UPLOAD' && item.item_sub_type == 'ATTACH' && !item.value) {
      item.value = "";
      item.imgData = null;
      item.files = [];
      delete item["file_name"]
      delete item["isFile"]
      delete item["isImage"]
    }

    if (item.item_type == 'LIST_BOX') {
      if (item.value && item.value.indexOf(',') > -1 && item.item_sub_type.indexOf('CB') > -1) {
        item.value = item.value.split(",");
        console.log(item.value)
      }
    }

    if (item.item_type == 'BAND' && item.item_sub_type == 'TARGET_KPI') {
      if (item.value) {
        if (item.value.indexOf('@') > -1) {
          item.val = item.value.split("@");
        }
      }
    }

    if (item.value && item.item_visible_flag == 'T' && (item.datatype == "DATE" || item.datatype == "DATETIME" || item.datatype == 'TIME')) {
      this.globalObjects.formatDate2(item.value, item);
    }

    if (item.mirrored_items && !from_mirror) {
      this.set_mirror_values(item);
    }

    if (item.oldValue && (runEvent || clearOldValue)) {
      item.oldValue = "";
    }
    if (item.datatype == 'NUMBER' && item.value && item.item_type == 'TEXT_INPUT') {
      let val = this.formatMastNewPipe.transform(item.value, item).value;
      if (val) {
        let a = val.toString().replaceAll(",", "");
        val = a;
      }
      item.value = val;
    } else {
      if (item.value && item.format_mask && item.datatype != 'DATE' && item.datatype != 'DATETIME' && item.datatype != 'TIME' && item.datatype != 'NUMBER') {
        if ((frame_type == 'TABLE' || frame_type == 'HORIZONTAL_TABLE' || frame_type == 'ENTRY_TABLE' || frame_type == 'FRAME_COLLAPSE' || frame_type == 'PLASTO_SUMMARY')
          && (item.item_visible_flag == 'T' || item.flag_auto_card == 'T')) { } else {
          item.value = this.formatMastPipe.transform(item.value, item.format_mask);
        }
      } else {
        if ((frame_type == 'TABLE' || frame_type == 'HORIZONTAL_TABLE' || frame_type == 'ENTRY_TABLE' || frame_type == 'FRAME_COLLAPSE' || frame_type == 'PLASTO_SUMMARY')
          && item.datatype == 'NUMBER' && item.item_visible_flag != 'T' && item.flag_auto_card != 'T')
          if (item.value && item.item_visible_flag != 'T' && (item.datatype == 'DATE' || item.datatype == 'DATETIME' || item.datatype == 'TIME')) {
            this.globalObjects.formatDate2(item.value, item);
          }
      }
    }

    if (!item.value) {

      delete item['displaychips'];
      delete item['displayChips'];

      item.codeOfValues = "";

      if (item.DcodeOfValues) {
        item.DcodeOfValues = null;
      }
      if (item.Ditems) {
        item.Ditems = null;
      }
      if (item.Dvalue) {
        item.Dvalue = null;
      }
      if (item.chips) {
        delete item['chips'];
      }

      if (item.item) {
        item.item = null;
      }
      if (item.objLovData) {
        item.objLovData = null;
      }
    }

    if (item.summary_flag) {

      this.calculateFrames[frameId] = "Y";
      // let frame = this.get_frame_config(item.apps_page_frame_seqid);
      // this.processDataServ.calculateTableRows(frame);
    }

    if (runEvent) {

      if ((((item.datatype != "DATE" && item.datatype != "DATETIME") && item.post_events_str && !event) || (event && event.item_name != item.item_name))) {
        if (item.item_type != "FILE_UPLOAD") {
          item.itemClicked = "post";
        }


        if (item.post_events_str && !item.value) {

          let events = item.post_events_str.split(";");
          let evArr = [];
          for (let ev of events) {
            if (!ev || ev.toLowerCase().includes("validate_lov")) {

            } else {
              evArr.push(ev.trim());
            }
          }
          if (evArr) {
            // item.some_post_events_str = str;
            // if (event) {
            //   item.returnId = event.apps_page_frame_seqid + "." + event.item_name;
            //   item.returnIndex = event.itemIndex;
            // }
            // this.execute_events(item, event);

            return { event_arr: evArr }
          }
        } else if (item.post_events_str) {

          let events = item.post_events_str.split(";");
          let evArr = [];
          for (let ev of events) {
            if (ev) {
              evArr.push(ev.trim());
            }
          }
          if (evArr) {
            // item.some_post_events_str = str;
            // if (event) {
            //   item.returnId = event.apps_page_frame_seqid + "." + event.item_name;
            //   item.returnIndex = event.itemIndex;
            // }
            // this.execute_events(item, event);

            return { event_arr: evArr }
          }
          // if (event) {
          //   item.returnId = event.apps_page_frame_seqid + "." + event.item_name;
          //   item.returnIndex = event.itemIndex;
          // }
          // this.execute_events(item, event);
        }

      }
    }
    // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frameId);
    this.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frameId] = "Y";
    this.refreshFrames[frameId] = "Y";
    return;
  }

  itemSeparation(frame) {
    this.prePopulateRows(frame);
    if (frame.itemsDivider && frame.itemsDivider.length > 0) {
      if (frame.tableRows) {
        for (let tableData of frame.tableRows) {
          let sepItems = [];
          for (let itemGroup of tableData) {
            if (itemGroup.Level5) {
              let itemIndex = 0;
              for (let item of itemGroup.Level5) {
                for (let id of frame.itemsDivider) {
                  if ((id == item.item_name || id == item.apps_item_seqid) && !item.prompt_name && (itemGroup.Level5 && itemGroup.Level5.length >= itemIndex)) {
                    sepItems.push(item);
                    itemGroup.Level5.splice(itemIndex, 1);
                    if (itemGroup.Level5 && itemGroup.Level5.length == 0) {
                      itemGroup.Level5 = [];
                    }
                  }
                }
                itemIndex++;
              }
            }
          }

          for (let itemGroup of tableData) {
            if (itemGroup.Level5) {
              let index = 0;
              let level5 = [];
              for (let item of itemGroup.Level5) {
                if (item.item_position_divider) {
                  level5.push(item);
                  let itemId = item.item_position_divider.split(",");
                  for (let id of itemId) {
                    for (let sepItem of sepItems) {
                      if (sepItem.item_name === id || sepItem.apps_item_seqid === id) {
                        sepItem.itemSeparator = {
                          "padding": "1px 0px"
                        };
                        level5.push(sepItem);
                      }
                    }
                  }
                } else {
                  level5.push(item);
                }

                index++;
              }
              itemGroup.Level5 = level5;
              if (itemGroup.design_control_type) {
                itemGroup.groupCol = itemGroup.design_control_type.split('-');

                let index = 0;
                for (let itm of itemGroup.Level5) {
                  if (itm.item_visible_flag == 'T') {
                    let col = itemGroup.groupCol[index];
                    itm.promptCol = (1.5 * 12 / parseFloat(col));
                  }
                  index++;
                }
              }
              else if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                let invisibleCnt = 0;
                for (let item of itemGroup.Level5) {
                  if (item.item_visible_flag != 'T') {
                    invisibleCnt++;
                  }
                }
                if (frame.design_control_type) {
                  let frameCol = 12 / parseFloat(frame.design_control_type);
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
        }
      } else {
        // for (let tableData of this.frame.tableRows) {
        let sepItems = [];
        for (let itemGroup of frame.Level4) {
          if (itemGroup.Level5) {
            let itemIndex = 0;
            for (let item of itemGroup.Level5) {
              for (let id of frame.itemsDivider) {
                if ((id == item.item_name || id == item.apps_item_seqid) && !item.prompt_name) {
                  sepItems.push(item);
                  itemGroup.Level5.splice(itemIndex, 1);
                  if (itemGroup.Level5 && itemGroup.Level5.length == 0) {
                    itemGroup.Level5 = [];
                  }
                }
              }
              itemIndex++;
            }
          }
        }

        for (let itemGroup of frame.Level4) {
          if (itemGroup.Level5) {
            let index = 0;
            let level5 = [];
            for (let item of itemGroup.Level5) {
              if (item.item_position_divider) {
                level5.push(item);
                let itemId = item.item_position_divider.split(",");
                for (let id of itemId) {
                  for (let sepItem of sepItems) {
                    if (sepItem.item_name === id || sepItem.apps_item_seqid === id) {
                      sepItem.itemSeparator = {
                        "padding": "1px 0px"
                      };
                      level5.push(sepItem);
                    }
                  }
                }
              } else {
                level5.push(item);
              }

              index++;
            }
            itemGroup.Level5 = level5;
            if (itemGroup.design_control_type) {
              itemGroup.groupCol = itemGroup.design_control_type.split('-');

              let index = 0;
              for (let itm of itemGroup.Level5) {
                if (itm.item_visible_flag == 'T') {
                  let col = itemGroup.groupCol[index];
                  itm.promptCol = (1.5 * 12 / parseFloat(col));
                }
                index++;
              }
            }
            else if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              let invisibleCnt = 0;
              for (let item of itemGroup.Level5) {
                if (item.item_visible_flag != 'T') {
                  invisibleCnt++;
                }
              }
              if (frame.design_control_type) {
                let frameCol = 12 / parseFloat(frame.design_control_type);
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

      }

    }
  }

  setPromptColTableRows(frame) {
    if (frame.canvasRows) {
      for (let framedata of frame.canvasRows) {

        for (let itemGroup of framedata) {
          itemGroup.groupCol = [];
          if (itemGroup.design_control_type) {
            itemGroup.groupCol = itemGroup.design_control_type.split('-');
            // this.colSize = itemGroup.groupCol;
            let index = 0;
            for (let itm of itemGroup.Level5) {
              if (itm.item_visible_flag == 'T') {
                let col = itemGroup.groupCol[index];
                itm.promptCol = (1.5 * 12 / parseFloat(col));
                if (itm.containerRowss && itm.containerRowss.length > 0) {
                  this.setPromptCol(frame, itm.containerRowss, itemGroup.groupCol[index])
                }
              }
              index++;
            }
          }
          else if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
            let invisibleCnt = 0;
            for (let item of itemGroup.Level5) {
              if (item.item_visible_flag != 'T') {
                invisibleCnt++;
              }
            }
            if (frame.design_control_type) {
              let frameCol = 12 / parseFloat(frame.design_control_type);
              let count = itemGroup.Level5.length - invisibleCnt;
              let index = 0;
              for (let itm of itemGroup.Level5) {

                let col = (12 / count);
                itm.promptCol = (1.5 * (frameCol * 12) / col);
                if (itm.containerRowss && itm.containerRowss.length > 0) {
                  this.setPromptCol(frame, itm.containerRowss, itemGroup.groupCol[index])
                }
                index++;
              }
            } else {
              let count = itemGroup.Level5.length - invisibleCnt;
              let index = 0;
              for (let itm of itemGroup.Level5) {

                let col = (12 / count);
                itm.promptCol = (1.5 * 12 / col);
                if (itm.containerRowss && itm.containerRowss.length > 0) {
                  let c = itemGroup.groupCol[index]
                  if (itemGroup.groupCol[index] == undefined) {
                    if (itm.item_sub_type != "TAB_HORIZONTAL" && itm.item_sub_type != "TAB_VERTICLE") {
                      c = col
                    }
                  }

                  this.setPromptCol(frame, itm.containerRowss, c);
                }
                index++;
              }
            }
          }
        }
      }
    }
  }

  setPromptCol(frame, containerRows, size) {

    for (let itemGroup of containerRows) {
      let invisibleCnt = 0;
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if (item.item_visible_flag != 'T') {
            invisibleCnt++;
          }
        }
      }

      itemGroup.groupCol = [];

      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-');

        if (frame.design_control_type) {

          let index = 0;
          for (let itm of itemGroup.Level5) {
            let frameCol = (12 / parseFloat(frame.design_control_type)) + (12 / parseFloat(size));
            let col = itemGroup.groupCol[index];
            itm.promptCol = (1.5 * (frameCol * 12) / parseFloat(col));
            index++;
          }
        } else {

          let index = 0;
          for (let itm of itemGroup.Level5) {
            if (itm.item_visible_flag == 'T') {
              let cnt = isNaN(12 / size) || (12 / size) == 0 ? 1 : 12 / size;
              let col = itemGroup.groupCol[index];
              itm.promptCol = (1.5 * 12 * cnt / parseFloat(col));
            }
            index++;
          }
        }
      }

      else if (!itemGroup.design_control_type && itemGroup.Level5 && itemGroup.Level5.length > 0) {
        let invisibleCnt = 0;
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.item_visible_flag != 'T' && item.item_type == 'FRAME_SEPARATOR') {
              invisibleCnt++;
            }
          }
        }

        if (frame.design_control_type) {
          let frameCol = (12 / parseFloat(frame.design_control_type)) + (12 / parseFloat(size));
          let count = itemGroup.Level5.length - invisibleCnt;
          for (let itm of itemGroup.Level5) {

            let col = (12 / count);
            itm.promptCol = (1.5 * (frameCol * 12) / col);

          }
        } else {

          let count = itemGroup.Level5.length - invisibleCnt;
          for (let itm of itemGroup.Level5) {
            let cnt = isNaN(12 / size) || (12 / size) == 0 ? 1 : 12 / size;
            let col = (12 / count);
            itm.promptCol = (1.5 * 12 * cnt / col);

          }
        }

      }
    }

  }

  prePopulateRows(frame) {
    frame.itemsDivider = [];
    for (let itemGroup of frame.Level4) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if (item.item_position_divider) {
            let ids = item.item_position_divider.split(",");
            for (let id of ids) {
              if (frame.itemsDivider) {
                frame.itemsDivider.push(id);
              } else {
                frame.itemsDivider = [];
                frame.itemsDivider.push(id);
              }
            }
          }
        }
      }
    }
  }

  async msgbox(event, msg, raise?, p0?, p1?, p2?, msgArr?) {
    return new Promise(async (resolve) => {
      // console.log(`comes in msgbox of lhs_lib component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `, event.item_name);
      if (event.rase || (raise && (raise.toLowerCase().includes('raise') || raise.toLowerCase().includes('rase')))) {
        console.log("raised=====>");
        this.globalObjects.isMsg = true;
        event.rase = true;
        event.isValid = false;
        event.forcedInvalid = true;
        let name = event.apps_page_frame_seqid ? `${event.apps_page_frame_seqid}.${event.item_name}` : `${event.item_name}`;
        let itm = this.get_item(name, event.indexcount);
        if (itm) {
          itm.rase = true;
          itm.isValid = false;
          itm.forcedInvalid = true;
        }
      }

      if (msg && typeof (msg) == 'string' && msg.toLowerCase().includes("amsg-")) {
        let name = msg.match("-")[1];
        let value = await this.get_item_value(`p_${name}`, 0);

        if (value) {
          let replaceArr = value.split(/:\s*(\S+)\s/g);

          for (let i = 0; i < replaceArr.length; i++) {
            value.replace(replaceArr[i], eval(`p${i}`));
          }
        }


        msg = value;
      }

      let popUp = await this.popOverCtrl.create({
        component: MsgBoxPage,
        componentProps: {
          msg: msg,
          msgArr: msgArr,
          item: event
        },
        cssClass: "modelalert-box",
        backdropDismiss: false,
      });

      popUp.onDidDismiss().then((res) => {

        if (res.role == 'focus') {

          // this.globalobjects.setFocus(true);
          this.go_item(res.data.name, res.data.index, true);

        } else {

          if (event.rase || (raise && (raise.toLowerCase().includes('raise') || raise.toLowerCase().includes('rase')))) {
            this.globalObjects.isMsg = true;
            event.rase = true;
            this.globalObjects.setFocus(true);
            event.isValid = false;
            event.forcedInvalid = true;
          }

          // if (event.rase && event.itemClicked == 'post') {
          this.globalObjects.isMsg = false;
          if (this.globalObjects.focusArrow) {
            // this.globalobjects.setFocus(true);
            this.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.itemIndex, true);
          }
        }

        resolve('');
      })
      await popUp.present();
    })
  }

  async app_confirm_msg(event, type, bt1, bt2, bt3, bt4, msg) {
    return new Promise(async (resolve) => {
      let btArr = [];
      if (bt1 && bt1.toLowerCase() != 'null') {
        let obj = {
          name: bt1,
          value: 1
        }
        btArr.push(obj);
      }

      if (bt2 && bt2.toLowerCase() != 'null') {
        let obj = {
          name: bt2,
          value: 2
        }
        btArr.push(obj);
      }

      if (bt3 && bt3.toLowerCase() != 'null') {
        let obj = {
          name: bt3,
          value: 3
        }
        btArr.push(obj);
      }

      if (bt4 && bt4.toLowerCase() != 'null') {
        let obj = {
          name: bt4,
          value: 4
        }
        btArr.push(obj);
      }

      this.globalObjects.confirmFlag = true;

      let popUp = await this.popOverCtrl.create({
        component: NewAlertMsgBoxesPage,
        componentProps: { type: type, msg: msg, btArr: btArr },
        cssClass: "modelalert-box",
        backdropDismiss: false,
      });

      popUp.onDidDismiss().then((res) => {
        resolve(res.data);
        //alert(res.data);
        // // this.globalobjects.setFocus(true);
        // this.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.itemIndex, true);
        // this.go_item(this.globalObjects.focusedItem, event.itemIndex, true);
      })
      await popUp.present();

      setTimeout(async () => {
        const btn = document.querySelector('.button2') as HTMLIonButtonElement;
        await btn?.focus();
      }, 100);
    })
  }

  get_frame_record(event, name) {
    let frame = this.get_frame_config(name);
    return frame.edit_record_index != undefined ? frame.edit_record_index : (frame.active_row ? frame.active_row : 0);
  }

  async app_last_record(frame_name, move?) {
    let frame = await this.get_frame_config(frame_name);
    if (frame) {

      let num_of_records = frame.tempRows || frame.total_no_of_record == undefined ? (frame.tableRows.length - (frame.extra_record_count ?? 0) - 1) : frame.total_no_of_record - 1;
      delete frame['executing_index'];
      if (move != undefined) {
        frame.active_row = num_of_records
        await this.go_perticular_record(frame, frame_name, frame.active_row, move);
      } else {
        frame.executing_index = num_of_records
        await this.go_perticular_record(frame, frame_name, frame.executing_index, move);
      }
    }
  }

  async app_first_record(frame_name, move?) {
    let frame = await this.get_frame_config(frame_name);
    if (frame) {
      delete frame['executing_index'];
      if (move != undefined) {
        frame.active_row = 0;
        await this.go_perticular_record(frame, frame_name, frame.active_row, move);
      } else {
        if (frame.tempRows) {
          frame.active_row = 0;
        }
        frame.executing_index = 0;
        await this.go_perticular_record(frame, frame_name, frame.executing_index, move);
      }
    }
  }

  async app_go_record(frame_name, index, move?) {
    let frame = await this.get_frame_config(frame_name);
    if (frame) {
      delete frame['executing_index'];
      if (move != undefined) {

        frame.active_row = index;
        await this.go_perticular_record(frame, frame_name, frame.active_row, move);
      } else {
        if (frame.tempRows) {
          frame.active_row = index;
        }
        frame.executing_index = index;
        await this.go_perticular_record(frame, frame_name, frame.executing_index, move);
      }
    }
  }

  async app_previous_record(frame_name, move?) {
    let frame = await this.get_frame_config(frame_name);
    if (frame.active_row > 0) {
      if (frame) {
        if (move != undefined) {

          frame.active_row = frame.active_row - 1;
          await this.go_perticular_record(frame, frame_name, frame.active_row, move);
        } else {
          frame.executing_index = frame.executing_index != undefined ? frame.executing_index - 1 : frame.active_row - 1;
          await this.go_perticular_record(frame, frame_name, frame.executing_index, move);
        }
      }
    }
  }

  async app_next_record(frame_name, move?) {
    let frame = await this.get_frame_config(frame_name);
    if (frame) {
      // delete frame['executing_index'];
      if (move != undefined) {

        frame.active_row = frame.active_row + 1;
        await this.go_perticular_record(frame, frame_name, frame.active_row, move);
      } else {
        frame.executing_index = frame.executing_index != undefined ? frame.executing_index + 1 : frame.active_row + 1;
        await this.go_perticular_record(frame, frame_name, frame.executing_index, move);
      }
    }
  }

  async go_perticular_record(frame, frame_name, index, move?) {
    let itmName = frame_name + ".WMA_RECORD_STATUS";
    let itm = await this.get_item(itmName, index);
    if (itm) {
      itm.frame_status = 'dirty';
    }

    for (let itemGroup of frame.Level4) {
      if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
        for (let item of itemGroup.Level5) {
          if (item.item_visible_flag == 'T' && item.item_enable_flag == 'T' && (item.item_type == 'TEXT_INPUT' || item.item_type == 'TEXT_AREA')) {
            let name = frame_name + "." + item.item_name;
            let displayRecord = frame.display_no_of_records ? frame.display_no_of_records : 50


            if ((index < frame.page_no * displayRecord) && (index >= ((frame.page_no * displayRecord) - displayRecord))) {
              await this.go_item(name, index, true);
            } else {
              if (move && move.toLowerCase() == 'move') {
                let pageNo = Math.ceil(index / displayRecord);
                if (!pageNo) {
                  pageNo = 1;
                }
                let to = pageNo * displayRecord;
                frame.from_record = to - displayRecord;
                frame.to_record = pageNo * displayRecord;
                frame.page_no = pageNo;

                this.getSepratorGrp(frame);
                this.go_item(name, index, true);

              }
            }

            return;
          }
        }
      }
    }

  }

  setItemDefaultValue(frame) {
    for (let itemGroup of frame.Level4) {
      for (let item of itemGroup.Level5) {
        if (item) {


          if (item.display_setting_str) {
            if (typeof (item.display_setting_str) === 'string') {
              try {
                if (item.display_setting_str.toLowerCase().indexOf('lov') > -1) {

                  item.lov_type = "LP";
                  let lovStr = item.display_setting_str.toLowerCase().split('lov')[1];
                  item.lov_size = JSON.parse(lovStr);
                  item.display_setting_str = item.display_setting_str.toLowerCase().split('lov')[0];
                }
                if (item.display_setting_str) {
                  item.display_setting_str = JSON.parse(item.display_setting_str);
                }
              } catch (e) {
                this.globalObjects.presentAlert("Error in display_setting_str format...");
              }
            }

            if (typeof (item.display_setting_str) === 'string') {
              item.display_setting_str = JSON.parse(item.display_setting_str);
            }

            let obj = {};
            let itmObj = {};
            for (let d in item.display_setting_str) {
              if (d.includes("prompt_")) {
                obj[d.replace("prompt_", "")] = item.display_setting_str[d];
              } else {
                itmObj[d] = item.display_setting_str[d];
              }
            }
            item.prompt_diplay_setting_str = obj;
          }




          if (item.item_default_value && frame.frame_type != 'TABLE' && item.item_type != 'BAND' && frame.apps_frame_sub_type != 'JSON') {
            for (let x in this.globalObjects.userDetails) {
              if (item.item_default_value.toUpperCase() == x.toUpperCase()) {
                item.value = this.globalObjects.userDetails[x];
              }
            }

            // var date = new Date(new Date().setHours(0, 0, 0, 0));
            var date = new Date(this.globalObjects.sysdateTime);

            // if (item.item_type == "T") {
            if (item.item_default_value.toUpperCase() == "USER_CODE") {
              item.value = this.globalObjects.userDetails.user_code;

            } else if (item.item_default_value.toUpperCase() == "LOGIN_ACC_CODE") {
              item.value = this.globalObjects.userDetails.login_acc_code;
            } else if (item.item_default_value.toUpperCase() == "LOGIN_ACC_NAME") {
              item.value = this.globalObjects.userDetails.login_acc_name;
            } else if (item.item_default_value.toUpperCase() == "DEVICE_ID") {
              if (this.globalObjects.device.uuid) {
                item.value = this.globalObjects.device.uuid;
              } else {
                item.value = "";
              }
            } else if (item.item_default_value.toUpperCase() == "ACC_YEAR") {
              item.value = this.globalObjects.userDetails.acc_year;
            } else if (item.item_default_value.toUpperCase() == "EMP_CODE") {
              item.value = this.globalObjects.userDetails.emp_code;
            } else if (item.item_default_value.toUpperCase() == "ENTITY_CODE") {
              item.value = this.globalObjects.userDetails.entity_code;
            } else if (item.item_default_value.toUpperCase() == "DIV_CODE") {
              item.value = this.globalObjects.userDetails.div_code;
            } else if (item.item_default_value.toUpperCase() == "PLSQL_L") {
              item.value = sessionStorage.getItem("PLSQL_L");
            } else if (item.item_default_value.toUpperCase() == "GEO_ORG_CODE") {
              item.value = this.globalObjects.userDetails.geo_org_code;
              // } else if (item.item_default_value == "DIV_CODE") {
              //   item.value = this.globalObjects.userDetails.division
            } else if (item.item_default_value.toUpperCase() == "LATITUDE") {
              item.value = this.globalObjects.latitude + "";
            } else if (item.item_default_value.toUpperCase() == "LONGITUDE") {
              item.value = this.globalObjects.longitude + "";
            } else if (item.item_default_value.toUpperCase() == "LOCATION") {

              this.globalObjects
                .geoCoderLocation(this.globalObjects.latitude, this.globalObjects.longitude)
                .then(res => {
                  item.value = res;
                }, (error) => {
                  // alert(JSON.stringify(error))
                });

            } else if (item.item_default_value.toUpperCase() == "SYSTIME") {
              item.value = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
            } else if (item.item_default_value == "INDEX") {

            } else if (item.item_default_value.toUpperCase() == "SYSDATETIME") {
              let valDT = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
                ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
              item.value = this.globalObjects.formatDate(valDT, "dd-MMM-yyyy HH:mm:ss");
            } else if (item.item_default_value.toUpperCase().includes('SYSDATE') && item.item_name.toLowerCase() != 'p_calling_parameter_str') {
              let val: any;
              let sysDate = item.item_default_value.split('SYSDATE');
              let tomDate = new Date(new Date(this.globalObjects.sysdateTime).setHours(0, 0, 0, 0));
              if (sysDate[1]) {
                tomDate.setDate(eval("tomDate.getDate()" + sysDate[1]));
              }
              val = new Date(tomDate);

              /* if (item.item_visible_flag == "T") { */
              // item.value = ("0" + date.getDate()).slice(-2)+ "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear();
              let valD = val.getFullYear() + "-" + ("0" + (val.getMonth() + 1)).slice(-2) + "-" +
                ("0" + val.getDate()).slice(-2);
              item.value = this.globalObjects.formatDate(valD, 'dd-MMM-yyyy');
              ///  item.value = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
              /*  }
               if (item.item_visible_flag == "F") {
                 item.value = ("0" + date.getDate()).slice(-2) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getFullYear();
               } */

            } else if (item.item_default_value == "BATTERY_STATUS") {
              const subscription = this.batteryStatus.onChange().subscribe(status => {
                item.value = status.level;
              });
              subscription.unsubscribe();
            } else {
              if (item.value) {
                /*null;*/
              } else {
                if (item.item_default_value.charAt(0) == 'G' && item.item_default_value.charAt(1) == '_') {
                  item.value = '';
                } else if (item.datatype != 'BLOB' && item.datatype != 'LONG_RAW' && item.datatype != 'BLOB_JAVA' && item.datatype != 'LONG_RAW_JAVA') {
                  item.value = item.item_default_value;
                }
              }
            }
          }


          if (item.item_sub_type == 'TOGGLE') {
            if (item.value) {

            } else {
              item.value = item.datatype && (item.datatype.toLowerCase() == 'number') ? "0" : 'N';
            }
          }

          if (item.value != undefined && item.value != null && item.value !== "") {
            item.isValid = true;
          }

        }
      }
    }
  }

  set_config(name, item, paraName, paraValue, frameId) {
    if (paraName.toLowerCase() == "display_setting_str") {
      let obj = {};
      for (let d in paraValue) {
        if (d.includes("prompt_")) {
          obj[d.replace("prompt_", "")] = paraValue[d];
        }
      }
      item.prompt_diplay_setting_str = obj;
    }
    if (paraName.toLowerCase() == "display_setting_str" && item.datatype == "NUMBER") {
      let value = JSON.parse(JSON.stringify(paraValue));
      value["text-align"] = "right";
      item[paraName.toLowerCase()] = value;
    } else if (paraName.toLowerCase() == "required_item" || paraName.toLowerCase() == "data_required_flag") {
      item.data_required_flag = paraValue;
      if (paraValue == 'T') {
        item.prompt_name = item.prompt_name ? ((item.prompt_name).charAt((item.prompt_name).length - 1) == "*" ? item.prompt_name : item.prompt_name + "*") : "";
      } else {
        item.prompt_name = (item.prompt_name && (item.prompt_name).charAt((item.prompt_name).length - 1) == "*") ? item.prompt_name.slice(0, (item.prompt_name.length - 1)) : item.prompt_name;
      }
      item.isValid = (paraValue == 'T' && (item.value == undefined || item.value == null) ? false : true);
    } else {
      if (paraName == "objectData" || paraName == 'msgError') {
        item[paraName] = paraValue;
      } else {
        if (paraName.toLowerCase() == 'click_events_str') {
          delete item['lovEvent'];
        }
        if (item.item_type == 'BUTTON' && paraName == 'display_setting_str') {
          let keys = Object.keys(paraValue);
          let obj = {};
          let flag = false;
          for (let k of keys) {
            if (!(k.includes("--"))) {
              obj['--' + k] = paraValue[k];
            }
            obj[k] = paraValue[k];
            flag = true;
          }

          item.display_setting_str = { ...item.display_setting_str, ...obj };

        } else {
          item[paraName.toLowerCase()] = paraValue;
        }

      }
      if (paraName.toLowerCase() == 'format_mask') {
        item.value = this.formatMastPipe.transform(item.value, item.format_mask)
      }
    }
    if (paraName) {
      if (paraName == 'input_pattern') {
        if (item.item_type == 'LIST_BOX' || item.item_type == 'CHECK_BOX' || item.item_type == 'RADIO_BUTTON') {
          let dropdownList = [];
          item['objectData'];
          if (item.input_pattern.indexOf("#") > -1) {
            let radioarr = [];
            if (item.input_pattern.indexOf(",") > -1) {
              radioarr = item.input_pattern.split(",");
            } else {
              radioarr[0] = item.input_pattern;
            }
            if (item.item_type == 'CHECK_BOX' || item.item_type == 'RADIO_BUTTON') {
              for (let item of radioarr) {
                let obj: any = {};
                obj.key = item.split("#")[1];
                obj.val = item.split("#")[0];
                obj.isChecked = false
                dropdownList.push(obj)
              }
              item.radioArray = dropdownList;
            } else {
              for (let item of radioarr) {
                let obj: any = {};
                obj.key = item.split("#")[1];
                obj.val = item.split("#")[0];
                obj.item = {
                  "Div Code~DEFAULT_CODE#display_setting_str~#item_visible_flag~#filter_flag~": item.split("#")[1],
                  "Div Name~DEFAULT_NAME#display_setting_str~#item_visible_flag~#filter_flag~": item.split("#")[0]
                }
                dropdownList.push(obj)
              }
              item.dropdownList = dropdownList;
            }
            // this.selectinput.value = "";

            if (item.value) {
              // item = item.value; //comment by arti - 28-10-2026
              // this.cdr.detectChanges();
            } else {
              // this.selectModel = this.selectinput.dropdownList[0].val;
              // this.selectinput.value = this.selectModel;
            }
          } else {
            // this.selectModel = this.selectinput.value;
          }
        }
      }
    }
    // console.log("set_config",item,paraName,paraValue)
    // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frameId);
    this.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frameId] = "Y";
    this.refreshFrames[frameId] = "Y";
    return;
  }

  setReturnData(event) {

    let lov_return_key = event.lov_return_column_str.split(";");

    let noItemList = "";

    let noLovField = "";

    let checkDimFlag = true;
    // let parentFrame = this.get_frame_config(event.apps_page_frame_seqid);
    // lov_return_key.pop();
    for (let retStr of lov_return_key) {
      let flag = true;

      if (retStr) {
        let values = [];
        if (retStr.indexOf("!=") > -1) {
          values = retStr.split("!=");

          let itemVal = this.get_item_value(values[0], 'current_record');

          if (itemVal === 0 || itemVal) {
            continue;
          }
        } else {
          values = retStr.split(":=");
        }

        let frameName;
        let key = [];
        if (values[0].indexOf(".") > -1) {
          key = values[0].split(".");
          if (key[0].indexOf(":") > -1) {
            frameName = key[0].split(":")[1];
          } else {
            frameName = key[0];
          }
        } else {
          if (values[0].indexOf(":") > -1) {
            frameName = values[0].split(":")[1];
          } else {
            frameName = values[0];
          }
        }

        if (event.fromMulti) {
          let finalObject = {};
          if (event.objLovData) {
            for (let val of event.objLovData) {
              for (let lVal of val) {

                if (finalObject[lVal.key]) {

                  let k;
                  if (values[1] && values[1].indexOf(".") > -1) {
                    k = values[1].split(".")[1];
                  }

                  if (k && lVal.key && k.toUpperCase() == lVal.key.toUpperCase()) {

                    let flag = false;
                    if (values[0] && values[0].indexOf(".") > -1) {
                      if (values[0].split(".")[1].toLowerCase() == event.item_name.toLowerCase()) {
                        flag = true;
                      }
                    } else if (values[0].replaceAll(":", "").toLowerCase() == event.item_name.toLowerCase()) {
                      flag = true;
                    }


                    if (flag) {
                      finalObject[lVal.key] = finalObject[lVal.key] + "^" + lVal.value;
                    } else {
                      finalObject[lVal.key] = finalObject[lVal.key] + "," + lVal.value;
                    }
                  }
                } else {
                  finalObject[lVal.key] = lVal.value;
                }
              }
            }
            for (let item in finalObject) {
              if (values[1] && values[1].indexOf(".") > -1) {
                values[1] = values[1].split(".")[1];
              }
              if (values[1] && item && values[1].toUpperCase() == item.toUpperCase()) {
                flag = false;
                if (values[0] && values[0].indexOf(".") > -1) {
                  if (values[0].split(".")[1].toLowerCase() == event.item_name.toLowerCase()) {
                    let gItem = this.get_item(values[0], 'current_record');
                    let chips = [];
                    if (finalObject[item].indexOf("^") > -1) {
                      chips = finalObject[item].split("^");
                    } else {
                      chips[0] = finalObject[item]
                    }

                    event.displayChips = chips;

                    if (gItem) {
                      event.value = finalObject[item];
                      gItem.DcodeOfValues = finalObject[item];
                      gItem.codeOfValues = finalObject[item];
                      gItem.isValid = true;
                    }

                    if (event.validateFlag) {
                      gItem.oldValue = event.value;
                      event.oldValue = event.value;
                      event.validateFlag = false;
                    }
                  }

                  this.set_item_config(values[0], 'msgError', '', 'current_record');
                  let ret = this.set_item_value(event, values[0], 'current_record', finalObject[item]);

                  if (ret == "item not found") {
                    noItemList = noItemList + values[0] + ", ";
                  }
                  // }
                } else {
                  if (values[0].replaceAll(":", "").toLowerCase() == event.item_name.toLowerCase()) {
                    let gItem = this.get_item(values[0], 'current_record');

                    let chips = [];
                    if (finalObject[item].indexOf("^") > -1) {
                      chips = finalObject[item].split("^");
                    } else {
                      chips[0] = finalObject[item]
                    }

                    event.displayChips = chips;

                    if (gItem) {
                      event.value = finalObject[item];
                      gItem.DcodeOfValues = finalObject[item];
                      gItem.codeOfValues = finalObject[item];

                      gItem.isValid = true;

                      if (event.validateFlag) {
                        gItem.oldValue = event.value;
                        event.oldValue = event.value;
                        event.validateFlag = false;
                      }

                    }
                  }

                  this.set_item_config(values[0], 'msgError', '', 'current_record');
                  let ret = this.set_item_value(event, values[0], 'current_record', finalObject[item]);
                  if (ret == "item not found") {
                    noItemList = noItemList + values[0] + ", ";
                  }

                }
                //   this.set_item_value(values[0], event.indexcount ? event.indexcount : event.indexCount, finalObject[item]);
                if (finalObject[item]) {
                  let chips = [];
                  if (finalObject[item].indexOf("^") > -1) {
                    chips = finalObject[item].split("^");
                  } else {
                    chips[0] = finalObject[item]
                  }
                  this.set_item_config(values[0], 'displayChips', chips, 'current_record');
                }
              }
            }


            if (flag) {
              noLovField = noLovField + values[1] + ",";
            }
          }



        } else {
          if (event.objLovData) {
            for (let lVal of event.objLovData) {
              if (values[1] && values[1].indexOf(".") > -1) {
                values[1] = values[1].split(".")[1];
              }
              if (lVal.key && values[1] && (lVal.key.toLowerCase() == values[1].toLowerCase())) {
                flag = false;
                if (values[0] && values[0].indexOf(".") > -1) {
                  if (values[0].split(".")[1].toLowerCase() == event.item_name.toLowerCase()) {
                    let gItem = this.get_item(values[0], 'current_record');
                    if (gItem) {
                      gItem.value = lVal.value;
                      event.value = lVal.value;
                      gItem.DcodeOfValues = lVal.value;
                      gItem.codeOfValues = lVal.value;

                      gItem.isValid = true;

                      if (event.validateFlag) {
                        gItem.oldValue = event.value;
                        event.oldValue = event.value;
                        event.validateFlag = false;
                      }

                      if (gItem.mirrored_items) {
                        this.set_mirror_values(gItem);
                      }

                      // this.check_hold(values[0], lVal.value);



                    }


                  } else {

                    this.set_item_config(values[0], 'msgError', '', 'current_record');
                    let ret = this.set_item_value(event, values[0], 'current_record', lVal.value);

                    if (ret == "item not found") {
                      noItemList = noItemList + values[0] + ", ";
                    } else {
                      // this.check_hold(values[0], lVal.value);


                    }
                  }
                } else {
                  if (values[0] && values[0].replaceAll(":", "").toLowerCase() == event.item_name.toLowerCase()) {
                    let gItem = this.get_item(values[0], 'current_record');
                    if (gItem) {
                      gItem.value = lVal.value;
                      event.value = lVal.value;
                      gItem.DcodeOfValues = lVal.value;
                      gItem.codeOfValues = lVal.value;

                      gItem.isValid = true;

                      if (event.validateFlag) {
                        gItem.oldValue = event.value;
                        event.oldValue = event.value;
                        event.validateFlag = false;
                      }

                      if (gItem.mirrored_items) {
                        this.set_mirror_values(gItem);
                      }
                      // this.check_hold(values[0], lVal.value);


                    }
                  } else {

                    this.set_item_config(values[0], 'msgError', '', 'current_record');
                    let ret = this.set_item_value(event, values[0], 'current_record', lVal.value);

                    if (ret == "item not found") {
                      noItemList = noItemList + values[0] + ", ";
                    } else {
                      // this.check_hold(values[0], lVal.value);


                    }
                  }
                }
              }
            }
            if (flag) {
              noLovField = noLovField + values[1] + ",";
            }
          }
        }
      }
    }

    // if (checkDimFlag) {
    this.check_dim_hold(event);
    // }

    if (noLovField) {
      let str = "Following lov coloumns not found :- " + noLovField;
      this.msgbox(event, str, "");
    } else if (noItemList) {
      let str = "Following return items not found :- " + noItemList;
      this.msgbox(event, str, "");
    }
  }

  get_hold_value(name, value) {
    let frameName = '';
    let itemName;

    let addItem = true;
    if (name && name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name && name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    let frame = this.get_frame_config("DIM_HOLD");

    if (frame) {
      if (frame.tableData && frame.tableData.length > 0) {
        let data = frame.tableData.find(x => (x['HOLD_COLUMN_NAME'] && x['HOLD_COLUMN_VALUE']) && x['HOLD_COLUMN_NAME']?.toUpperCase() == itemName?.toUpperCase() && x['HOLD_COLUMN_VALUE']?.toUpperCase() == value?.toUpperCase());
        if (data) {
          return data;
        }
      }

      return null;
    }
  }

  check_hold(name, value, fullName) {

    let gItem = this.get_item(fullName, 'current_record');
    let isHold = this.get_hold_value(name, value);
    if (isHold) {
      let str = `This master value has been put on hold by ${isHold.HOLDBY} since ${isHold.FROM_DATE} ${isHold.HOLD_REMARK ? 'for reason "' + isHold.HOLD_REMARK + '".' : '.'}`
      gItem.isValid = false;
      gItem.forcedInvalid = true;

      gItem.msgError = str
      this.msgbox(gItem, str, "raise");
    }
  }

  check_dim_hold(event) {

    let dim_distinct_str = this.get_item_value("p_dim_distinct_str", 0);
    if (!dim_distinct_str) return;
    let lov_return_key = event.lov_return_column_str.split(";");
    for (let retStr of lov_return_key) {
      if (retStr && retStr.includes(":=")) {
        let fullName = retStr.split(":=")[0];
        if (fullName) {
          let name = fullName.includes(".") ? fullName.split(".")[1].trim() : fullName.replaceAll(":", "").trim();
          let alternateName = name;
          if (eval('window.gajs_dim_name_for_db_item')) {
            let str = `window.gajs_dim_name_for_db_item(event,'${name}')`;
            alternateName = eval(str);
          }
          let dimArr = dim_distinct_str.split(";");

          if (dimArr.find(x => x.toLowerCase() == alternateName.toLowerCase())) {
            let value = this.get_item_value(fullName, event.indexcount);
            this.check_hold(alternateName, value, fullName);
          }
        }
      }
    }
  }

  setItemCount(tableRows, frame_id) {
    if (tableRows) {
      let index = 0;
      for (let framedata of tableRows) {
        for (let itemGroup of framedata) {
          for (let itm of itemGroup.Level5) {
            itm.indexcount = index;
            //For pipe detect
            // itemGroup.Level5 = [...itemGroup.Level5];
          }
        }
        index++;
      }
    }
    // return tableRows;
  }

  app_duplicate_record(event, frameName, items?) {
    let frame = this.get_frame_config(frameName);

    if (frame) {
      let itemsArr = [];
      if (items) {
        itemsArr = items.includes(",") ? items.split(",") : [items];
      }
      let level4 = JSON.parse(JSON.stringify(frame.tableRows[frame.tableRows.length - 1]));
      if (frame.tempRows && frame.tempRows.length > 0) {
        level4 = JSON.parse(JSON.stringify(frame.tempRows[frame.tempRows.length - 1]));
      }
      let col = {};
      for (let lgrp of level4) {
        for (let item of lgrp.Level5) {
          let isThere = itemsArr.find(x => x == item.item_name || item.apps_item_seqid == x);
          if (isThere || itemsArr.length <= 0) {
            col[item.item_name] = item.value;
          }
        }
      }

      if (Object.keys(col).length > 0) {
        frame.tableRows = [];
        frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));

        for (let lgrp of frame.tableRows[0]) {
          for (let item of lgrp.Level5) {
            if (item.item_name in col) {
              if (col[item.item_name] != undefined) {
                item.value = col[item.item_name];
              }
            }
          }
        }
      }

      this.processDataServ.afterTableRows(frame);
    }
    return;
  }

  // app_selected_record(event, frameName, itemName, val) {
  //   let frame = this.get_frame_config(frameName);
  //   let arr = [];
  //   if (frame) {
  //     if (frame.tableRows && frame.tableRows.length > 0) {
  //       for (let tableData of frame.tableRows) {
  //         for (let itemGroup of tableData) {
  //           if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
  //             for (let item of itemGroup.Level5) {
  //               if (item.item_name.toLowerCase() == itemName.toLowerCase() && (item.value && item.value.toLowerCase() == val.toLowerCase())) {
  //                 arr.push(tableData);
  //               }
  //             }
  //           }
  //         }
  //       }

  //     }
  //     if (arr.length > 0) {
  //       frame.tableRows = arr;
  //       new ProcessDataService(this, this.globalObjects, this.pipemy, this.colFilter, this.colRawFilter, this.pipemyRaw).afterTableRows(frame, 0, frame.tableRows.length, 1);
  //     }
  //   }
  //   return;
  // }

  async app_selected_record(event, frameName, itemName, val) {
    let frame = this.get_frame_config(frameName);
    let arr = [];
    if (frame) {
      let tableRows = frame.tempRows && frame.tempRows.length > 0 ? frame.tempRows : frame.tableRows;
      if (tableRows && tableRows.length > 0) {
        for (let tableData of tableRows) {
          let obj = {};
          let flag = false;
          for (let itemGroup of tableData) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {

                obj[item.item_name] = item.value != undefined ? item.value.toString() : "";
                if (item.item_name.toLowerCase() == itemName.toLowerCase() && (item.value && item.value.toLowerCase() == val.toLowerCase())) {
                  flag = true;
                }
              }
            }
          }
          if (flag) {
            arr.push(obj);
          }
        }

      }
      // if (arr.length > 0) {
      // frame.tableRows = arr;
      let tempFrame = this.get_frame_config(frame.apps_page_frame_seqid + "A");

      delete frame['tableRows'];
      delete frame['canvasRows'];
      delete frame['tableData'];
      delete frame['searchableData'];
      delete frame['searchableRawData'];
      if (tempFrame) {
        delete frame['tempRows'];
        delete tempFrame['tableRows'];
        delete tempFrame['tableData'];
        delete tempFrame['searchableData'];
        delete tempFrame['searchableRawData'];

        await this.processDataServ.single_row(frame, arr, frame.auto_populate_default_where);
      } else {

        await this.processDataServ.populateRows(frame.apps_page_frame_seqid, arr);
      }


      // }
    }
    return;
  }

  get_current_record(index, frame) {
    let rowIndex = index && typeof (index) == 'string' && (index.toLowerCase().includes("current_record") || index.toLowerCase().includes("wma_record_index")) ?
      frame.executing_index != undefined ? frame.executing_index : (frame.edit_record_index != undefined ? frame.edit_record_index : (frame.active_row ?? 0)) : index;
    return rowIndex;
  }

  getCurrentIndex(frame) {
    return frame.executing_index != undefined ? frame.executing_index : (frame.edit_record_index != undefined ? frame.edit_record_index : (frame.active_row != undefined ? frame.active_row : 0));
  }

  app_copy_record(event, frameName, items?, index?) {
    let frame = this.get_frame_config(frameName);
    let rowIndex = this.get_current_record(index, frame);
    if (frame && frame.tableRows && frame.tableRows[rowIndex]) {
      let level4 = JSON.parse(JSON.stringify(frame.tableRows[rowIndex]));
      let col = {};
      let itmArr = items ? items.includes(",") ? items.split(",") : [items] : [];
      for (let itmGrp of level4) {
        for (let item of itmGrp.Level5) {
          let isItem = itmArr.find(x => x.toLowerCase() == item.item_name.toLowerCase());
          if (isItem || itmArr.length == 0) {
            col[item.item_name.toLowerCase()] = item.value;
          }
        }
      }
      this.object_mast.copiedRecord = col;
    }

    return;
  }

  app_paste_record(event, frameName, items?, index?) {
    if (this.object_mast.copiedRecord) {
      let frame = this.get_frame_config(frameName);
      if (!frame.tableRows || frame.tableRows.length < 1) {
        frame.tableRows = [];
        frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
        this.processDataServ.afterTableRows(frame);
      }
      let rowIndex = this.get_current_record(index, frame);
      if (frame && frame.tableRows && frame.tableRows[rowIndex]) {
        let tableData = frame.tableRows[rowIndex];
        let itmArr = items ? items.includes(",") ? items.split(",") : [items] : [];
        let flag = false;
        for (let itemGrp of tableData) {
          for (let item of itemGrp.Level5) {
            let isItem;
            if (items && items.includes("=")) {
              isItem = itmArr.find(x => x.split("=")[0].toLowerCase() == item.item_name.toLowerCase());
            } else {
              isItem = itmArr.find(x => x.toLowerCase() == item.item_name.toLowerCase());
            }

            let name = isItem ? isItem.split("=")[1].toLowerCase() : (itmArr.length == 0 ? item.item_name.toLowerCase() : "");
            if (name in this.object_mast.copiedRecord) {
              item.value = this.object_mast.copiedRecord[name];
              flag = true;
            }
            // if (item.item_name == 'WMA_RECORD_STATUS') {
            item.frame_status = 'dirty';
            // }

          }
        }
        if (!flag) {
          this.msgbox(event, 'Items not found to paste', 'raise');
        }
      }
    } else {
      this.msgbox(event, 'There is no data to paste', 'raise');
    }

    return

  }



  app_collapse_frame(frameName) {
    let frame = this.get_frame_config(frameName);
    if (frame) {
      frame.collapse = false
      // this.cdEngine.detect(frame.apps_page_frame_seqid);
      this.refreshFrames[frame.apps_page_frame_seqid] = "Y";
    }
  }

  app_uncollapse_frame(frameName) {
    let frame = this.get_frame_config(frameName);
    if (frame) {
      frame.collapse = true
      // this.cdEngine.detect(frame.apps_page_frame_seqid);
      this.refreshFrames[frame.apps_page_frame_seqid] = "Y";
    }
  }

  app_collapse_item(itemName) {
    let item = this.get_item_sep(itemName, 0);
    if (item) {
      if (item.sepCollapse == "SHOW") {
        item.sepCollapse = "HIDE"
        this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + item.apps_page_frame_seqid);
      }
    }
  }

  app_uncollapse_item(itemName) {
    let item = this.get_item_sep(itemName, 0);
    if (item) {
      if (item.sepCollapse == "HIDE") {
        item.sepCollapse = "SHOW"
        this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + item.apps_page_frame_seqid);
      }
    }
  }

  set_row_config(name, paraName, paraValue, index, flag?) {

    let frameName;
    let itemName;

    let frame = this.get_frame_config(name);

    let rowIndex = index;

    if (rowIndex) {
      try {
        rowIndex = parseInt(rowIndex);
      } catch {
        rowIndex = rowIndex;
      }

    } else { rowIndex = 0; }

    if (paraName != 'objectData') {
      paraName = paraName.toLowerCase();
    }

    if (paraName == 'display_setting_str' && (typeof (paraValue) == 'string')) {
      let strArr = paraValue.split(",");
      let obj = {};
      for (let s of strArr) {
        let keys = s.split(":");
        let key = keys[0]
        if (key.indexOf("{") > -1) {
          key = key.split("{")[1];
        }
        key = key.replace(/'/g, "");
        key = key.replace(/"/g, "");
        let val = keys[1];
        if (val.indexOf("}") > -1) {
          val = val.split("}")[0];
        }
        val = val.replace(/'/g, "");
        val = val.replace(/"/g, "");
        obj[key] = val;
      }
      paraValue = obj;
    }

    rowIndex = this.get_current_record(index, frame) ?? 0;
    let tableRows = [];
    tableRows = frame.tableRows;
    if (!flag && !frame.auto_populate_default_where) {
      if (frame.tempRows && frame.tempRows.length > 0) {
        if (frame.edit_record_index == undefined || rowIndex == frame.edit_record_index) {
          rowIndex = 0;
        } else {
          tableRows = frame.tempRows;
        }
      }
    }

    if (tableRows && tableRows[rowIndex]) {
      if (tableRows && tableRows[rowIndex]) {
        for (let itemGroup of tableRows[rowIndex]) {
          if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
            for (let item of itemGroup.Level5) {
              this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
              //For pipe detect
              // itemGroup.Level5 = [...itemGroup.Level5];
            }
          } else {
            if (itemGroup && itemGroup.length > 0) {
              for (let item of itemGroup) {
                this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                //For pipe detect
                // itemGroup = [...itemGroup];

              }
            }
          }
        }
      }
    }

    if (index == null || index == undefined) {
      let frameLevel4 = frame.Level4;
      for (let itemGroup of frameLevel4) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
            //For pipe detect
            // itemGroup.Level5 = [...itemGroup.Level5];

          }

        } else {
          if (itemGroup && itemGroup.length > 0) {
            for (let item of itemGroup) {
              this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
              //For pipe detect
              // itemGroup = [...itemGroup];
            }
          }
        }
      }


      if (frame.canvasRows && frame.canvasRows.length > 0) {

        for (let tableData of frame.canvasRows) {
          for (let itemGroup of tableData) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)



                if (item.containerRowss && item.containerRowss.length > 0) {
                  for (let cGrp of item.containerRowss) {
                    for (let cItem of cGrp.Level5) {
                      this.set_config(name, cItem, paraName, paraValue, frame.apps_page_frame_seqid)

                    }
                  }
                }
                //For pipe detect
                // itemGroup.Level5 = [...itemGroup.Level5];
              }
            } else {
              if (itemGroup && itemGroup.length > 0) {
                for (let item of itemGroup) {
                  this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                  //For pipe detect
                  // itemGroup= [...itemGroup];
                }
              }
            }
          }
        }
      }

      if (frame.tableRows && frame.tableRows.length > 0) {

        for (let tableData of frame.tableRows) {
          for (let itemGroup of tableData) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                  this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                  this.isSetDimension(item, paraName, frame.apps_page_frame_seqid);
                  //For pipe detect
                  // itemGroup.Level5 = [...itemGroup.Level5];
                }

              }
            } else {
              if (itemGroup && itemGroup.length > 0) {
                for (let item of itemGroup) {
                  if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) : true)) {
                    this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid);
                    this.isSetDimension(item, paraName, frame.apps_page_frame_seqid)
                    //For pipe detect
                    // itemGroup= [...itemGroup];
                  }
                }
              }
            }
          }
          if (paraName && paraName.toLowerCase() == 'item_seqno') {
            this.seqSort(tableData);
            this.object_mast._object_indexes = this.buildItemIndexes(this.object_mast);
          }
        }

      }



      if (frame.apps_frame_type == "ENTRY_TABLE" || frame.apps_frame_type == "TABLE" || frame.apps_frame_type == "HORIZONTAL_TABLE") {

        let level4 = [];
        if (frameLevel4 && frameLevel4.length > 0) {
          level4[0] = JSON.parse(JSON.stringify(frameLevel4))
          let sepdata = this.seprateData(frame, level4)
          frame.headers = sepdata[0];

        }

        if (frame.summary_flag) {
          // let frameName = this.get_frame_config(frame.apps_page_frame_seqid);
          // this.processDataServ.calculateTableRows(frameName);

          this.calculateFrames[frame.apps_page_frame_seqid] = "Y";
        }
        let tHead = [];
        for (let itemGroup of frameLevel4) {
          if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
            for (let item of itemGroup.Level5) {
              if (item.item_visible_flag == "T") {
                tHead.push(item.prompt_name)
              }
            }

          } else {
            if (itemGroup && itemGroup.length > 0) {
              for (let item of itemGroup) {
                if (item.item_visible_flag == "T") {
                  tHead.push(item.prompt_name)
                }
              }
            }
          }
        }

        frame.tHead = tHead;

      }
    }


    return;
  }


  find(frameName, ...paras) {
    let frame = this.get_frame_config(frameName);

    if (frame && frame.tableRows) {
      let arr = [];
      for (let tableData of frame.tableRows) {
        let obj: {} = {};
        for (let itemGroup of tableData) {
          for (let item of itemGroup.Level5) {
            obj[item.item_name] = item.value;
          }
        }
        arr.push(obj);
      }

      let strArr = [];
      let count = 0;
      for (let obj of arr) {
        let str = "";
        for (let i = 0; i < paras.length; i += 2) {
          if (paras[i]) {
            if (paras[i + 1]) {
              if (i % 2 == 0) {
                str = "'" + obj[paras[i]] + "'";
              }
              str = str + " == " + "'" + paras[i + 1] + "'";
              strArr.push(str);
            }
          } else {
            if (paras[i + 1]) {
              let flag = true;
              for (let o of Object.values(obj)) {
                str = "'" + o + "'";
                str = str + " == " + "'" + paras[i + 1] + "'";
                if (eval(str)) {
                  strArr.push(true);
                  flag = false;
                  break;
                }
              }
              if (flag) {
                strArr.push(false);
              }
            }
          }
        }
        if (eval(strArr.join("&&"))) {
          count++;
        }
        strArr = [];
      }

      return count;
      // console.log(count);

    }
  }

  get_ass_Level4(frameName) {

    if (!frameName) { return []; }
    let tempFrame = this.get_frame_config(frameName);
    let frame = this.get_frame_config(frameName.slice(0, (frameName.length - 1)));
    let frameLevel4 = [];
    if (frame) {
      let i = -1;
      frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
      for (let itemGroup of frameLevel4) {
        i++;
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {

            item.item_name = item.item_name?.toUpperCase();

            let temp = item.design_control_type;
            item.design_control_type = item.design_control_type_auto_card;
            item.design_control_type_auto_card = temp;

            // temp = item.display_setting_str;
            // item.display_setting_str = item.display_setting_str_auto_card;
            // item.display_setting_str_auto_card = temp;


            if (!item.display_setting_str_auto_card && item.display_setting_str && (item.display_setting_str["dimension"] == 'T' || item.display_setting_str["DIMENSION"] == 'T')) {
              temp = item.display_setting_str;
              item.display_setting_str = { ...(item.display_setting_str || {}), dimension: "T" };
              item.display_setting_str_auto_card = temp;
            } else {
              temp = item.display_setting_str;
              item.display_setting_str = item.display_setting_str_auto_card;
              item.display_setting_str_auto_card = temp;
            }
            temp = item.item_visible_flag;
            item.item_visible_flag = item.flag_auto_card;
            item.flag_auto_card = temp;



            item.isAssociate = true;

            item.prompt_name = item.prompt_name && item.prompt_name.includes("*") ? item.prompt_name.replace("*", "") : item.prompt_name;

            if (item.item_type == 'LIST_BOX' && item.item_default_value) {
              item.temp_default_value = item.item_default_value;
              item.item_default_value = "";
            }
            item.item_default_value = "";

            item.temp_item_type = item.item_type;


            item.temp_enable_flag = item.item_enable_flag;
            item.item_enable_flag = 'T';
            if (item.item_type != "BT" && item.item_type != "TOGGLE" && item.item_type != "BUTTON_ICON" && item.item_type != "FRAME_BUTTON_ICON" && item.item_type != "BUTTON" && item.item_type != "FILE_UPLOAD") {
              item.item_type = "TEXT";
              item.temp_sub_type = item.item_sub_type;
              item.item_sub_type = 'TEXT_DISPLAY';
            }
          }
        }
      }
    }

    return frameLevel4;
  }

  bindColonValue(proc, from?, to?) {
    var bindVarLogic = proc.match(/:(.*?)[=,*,>,\s,<,+,/,%,-,(,;]/g);
    // var bindVarLogic = proc.match(/:[a-zA-Z0-9_.]+/g);
    //  alert(bindVarLogic);
    let bindData = "";
    if (bindVarLogic && bindVarLogic.length > 0) {
      for (var b = 0; b < bindVarLogic.length; b++) {
        let d = bindVarLogic[b].replaceAll(":", "").trim();
        // alert("get befo--->"+d);

        //console.log("d--->" + d);
        if (d && d !== "") {
          let x = d.match(/[a-z_.0-9]+/gi)
          if (x) {
            let v = x[0];
            let val
            if (v.toLowerCase() == 'from_record') {
              val = from ? from : '';
            } else if (v.toLowerCase() == 'to_record') {
              val = to ? to : '';
            } else {
              val = this.get_item_value(v, 'current_record');
            }
            bindData = d.replace(v, val ?? '');

            proc = proc.replaceAll(bindVarLogic[b], bindData);
          }
        }
      }

    }
    return proc;
  }

  generateDataForLov(item, data) {
    let p_head = "";
    if (data.responseHead) {

      for (let d of data.responseHead) {

        var key, keys = Object.keys(d);
        var n = keys.length;
        var ob: any = {};
        while (n--) {
          key = keys[n];
          ob[key.toLowerCase()] = d[key];
        }


        if (ob.para_type == 'PV' || ob.PARA_TYPE == 'PV') {
          let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
          this.set_item_value(item, name, ob.row_slno, ob.para_value);
        } else if (ob.para_type == 'IV' || ob.PARA_TYPE == 'IV') {

          if (ob.frame_name && ob.row_slno != null) {
            let frame = this.get_frame_config(ob.frame_name);
            if (frame) {
              let obj = this.get_record_index(frame, ob.row_slno).data;
              if (obj.noRecord) {
                continue;
              }
              let name = obj.frame ? obj.frame + "." + ob.item_name : ob.item_name;
              this.set_item_value(item, name, obj.index, ob.para_value, false, true);
            }
          } else {
            let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
            this.set_item_value(item, name, ob.row_slno, ob.para_value, false, true);
          }
        } else if (ob.para_type == 'RJ' || ob.PARA_TYPE == 'RJ') {
          p_head = ob.para_value ? ob.para_value.replaceAll("'", "") : "";
        }
      }


      // let p_head = this.get_item_value('P_LOV_HEADER', 0);
      data.responseData[0] = p_head ? p_head.split(",") : [];
      return { tableData: this.globalObjects.setPageInfoNoS2U(data.responseData), p_head };
    }
  }


  get_rights_items_str(frameName) {
    let frame = this.get_frame_config(frameName);

    let str = "";
    if (frame && frame.tableRows) {
      for (let tableData of frame.tableRows) {
        for (let itemGroup of tableData) {
          for (let item of itemGroup.Level5) {
            if (item.item_name && item.item_name.toLowerCase().includes("_rights")) {
              str = str + "this.app_add_para(false,\"" + item.item_name + "\",\"" + item.value + "\");";
            }
          }
        }
      }
    }
    return str;
  }

  remove_delete_null(frame, data) {
    if (data && data.length > 0 && frame) {
      for (let itemGroup of frame.Level4) {
        for (let item of itemGroup.Level5) {
          if (item.item_visible_flag_delete_null) {
            item.item_visible_flag = item.item_visible_flag_delete_null;
            delete item['item_visible_flag_delete_null'];
          }
          if (item && this.getParsedJson(item.display_setting_str).toLowerCase().includes("delete")) {
            let isData = data.filter(x =>
              x.hasOwnProperty(item.item_name) && (x[item.item_name] === null || x[item.item_name].trim() === ""));

            if (isData && isData.length == data.length) {
              delete frame['headers']
              data = data.map(({ [item.item_name]: _, ...rest }) => rest);
              item.item_visible_flag_delete_null = item.item_visible_flag;
              item.item_visible_flag = 'F';
            }
          }
        }
      }
    }

    return data;
  }

  getParsedJson(json) {
    if (!json) {
      return "";
    }
    try {
      if (typeof (json) == "string") {
        return json;
      }
      if (typeof (json) == 'object' && json != null) {
        return JSON.stringify(json);
      }
    } catch (err) {

      return "";
    }
  }


  get_distinct_str(tableData, name) {

    const distinctNames = [...new Set(tableData.map(item => item[name.toUpperCase()]))];
    return distinctNames.join(";");
  }


  get_log_obj(event, event_name) {
    let obj: any = {
      item_seq_id: event.apps_item_seqid,
      item_name: event.item_name,
      frame_seq_id: event.apps_page_frame_seqid,
      type: event.itemClicked,
      event_name: event_name,
      time: new Date(),
      isOpen: false,
      id: event.id,
      parentId: event.parentId,
    }

    let evs = event_name;

    if (evs.toLowerCase() == "app_plsql1_clob" || evs.toLowerCase() == "app_plsql2_clob" || evs.toLowerCase() == "app_plsql1_text" ||
      evs.toLowerCase() == "app_plsql2_text" || evs.toLowerCase() == "app_plsql1_text_force" ||
      evs.toLowerCase() == "app_plsql2_text_force" || evs.toLowerCase() == "app_js1_text" || evs.toLowerCase() == "app_js2_text"
      || evs.toLowerCase() == "app_js1_text_force" || evs.toLowerCase() == "app_js2_text_force") {
      obj.code = event[evs.replace('_force')];
    }

    return obj;
  }


  get_event_log_obj(name, frame_name, item_name, object_code, status, type, logEventslno?) {
    let remark = `BL:${status} - ${name}`
    // this.globalObjects.log_timestamp=parseFloat((this.globalObjects.log_timestamp + 0.01).toFixed(2));
    // let seq=this.globalObjects.log_timestamp
    let obj = {
      event_name: name,
      frame_name: frame_name,
      item_name: item_name,
      status: status,
      object_code: object_code,
      time: new Date(),
      WS_TYPE: type,
      WS_DETAIL: new Date(),
      LOG_EVENT_SLNO: logEventslno ? logEventslno : '',
      LOG_REMARK: remark,
    }

    this.globalObjects.events_log.push(obj)
  }



  remove_extra_record(frame, onlyTableRows?) {

    if (onlyTableRows) {
      if (frame && frame.tableRows && frame.tableRows.length > 0) {
        //  let totalRec = 0;
        //  if(frame.total_no_of_record!=undefined && frame.total_no_of_record==0 && frame.extra_record_count!=undefined && frame.extra_record_count==0){
        //     totalRec = 0;
        //  }else{
        //    totalRec = frame.tableRows.length - (frame.extra_record_count ?? 0);
        //  }

        let extra_count = frame.extra_record_count ?? 0;
        if (frame.tableRows.length == 1) {
          let dirtyItem = this.check_row_dirty("", frame.tableRows[0]);
          if (!dirtyItem || !dirtyItem.frame_status || dirtyItem.frame_status != 'dirty') {
            extra_count = 1;
          }
        }
        let totalRec = frame.tableRows.length - extra_count;
        // let totalRec = frame.tableRows.length - ((frame.extra_record_count && frame.extra_record_count!=0) ? frame.extra_record_count: 1);
        let rows = frame.tableRows.slice(0, totalRec);
        frame.tableRows = rows;
      }

    } else {
      if (frame && frame.tableRows && frame.tableRows.length > 0) {
        let rows = frame.tableRows.slice(0, frame.total_no_of_record);
        frame.tableRows = rows;
      }
    }

  }


  set_matrix_item_config(name, paraName, paraValue, index, flag?) {

    let frameName;
    let itemName;
    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else { itemName = name; }

    let rowIndex = index;

    if (rowIndex) {
      try {
        rowIndex = parseInt(rowIndex);
      } catch {
        rowIndex = rowIndex;
      }

    } else { rowIndex = 0; }

    if (paraName != 'objectData' && paraName != 'msgError') {
      paraName = paraName.toLowerCase();
    }

    if (paraName == 'display_setting_str' && (typeof (paraValue) == 'string')) {
      let strArr = paraValue.split(",");
      let obj = {};
      for (let s of strArr) {
        let keys = s.split(":");
        let key = keys[0]
        if (key.indexOf("{") > -1) {
          key = key.split("{")[1];
        }
        key = key.replace(/'/g, "");
        key = key.replace(/"/g, "");
        let val = keys[1];
        if (val.indexOf("}") > -1) {
          val = val.split("}")[0];
        }
        val = val.replace(/'/g, "");
        val = val.replace(/"/g, "");
        obj[key] = val;
      }
      paraValue = obj;
    }

    if (this.object_mast) {


      // if (paraName == 'item_seqno') {
      //   this.set_item_seq(frameName, itemName, paraValue);
      // }

      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {

          if (frame.apps_page_frame_seqid && (frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A') { } else {
            if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || ((frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase())) {

              rowIndex = this.get_current_record(index, frame) ?? 0;

              let tableRows = [];
              tableRows = frame.tableRows ? frame.tableRows : [];
              if (!flag && !frame.auto_populate_default_where) {
                if (frame.tempRows && frame.tempRows.length > 0) {
                  if (frame.edit_record_index == undefined || rowIndex == frame.edit_record_index || frame.edit_record_index == frame.tempRows.length) {
                    rowIndex = 0;
                  } else {
                    tableRows = frame.tempRows;
                  }
                }
              }

              if (tableRows && tableRows[rowIndex]) {

                if (tableRows && tableRows[rowIndex]) {
                  for (let itemGroup of tableRows[rowIndex]) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if (itemName && item.group_no_str && (itemName.toLowerCase() == item.group_no_str.toLowerCase())) {
                          this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                        }
                      }
                    } else {
                      if (itemGroup && itemGroup.length > 0) {
                        for (let item of itemGroup) {
                          if (itemName && item.group_no_str && (itemName.toLowerCase() == item.group_no_str.toLowerCase())) {
                            this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                          }
                        }
                      }
                    }
                  }
                }
              }

              // }

              if (index == null || index == undefined) {
                let frameLevel4 = frame.Level4;
                for (let itemGroup of frameLevel4) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if (itemName && item.group_no_str && (itemName.toLowerCase() == item.group_no_str.toLowerCase())) {
                        this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                      }
                    }

                  } else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {
                        if (itemName && item.group_no_str && (itemName.toLowerCase() == item.group_no_str.toLowerCase())) {
                          this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                        }
                      }
                    }
                  }
                }

                ///////////////////////////new code 17 july 2024 start//////
                if (frame.canvasRows && frame.canvasRows.length > 0) {

                  for (let tableData of frame.canvasRows) {
                    for (let itemGroup of tableData) {
                      if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                        for (let item of itemGroup.Level5) {
                          if (itemName && item.group_no_str && (itemName.toLowerCase() == item.group_no_str.toLowerCase())) {
                            this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                          }
                        }
                      } else {
                        if (itemGroup && itemGroup.length > 0) {
                          for (let item of itemGroup) {
                            if (itemName && item.group_no_str && (itemName.toLowerCase() == item.group_no_str.toLowerCase())) {
                              this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                            }
                          }
                        }
                      }

                    }

                  }
                }
                ///////////////////////////new code 17 july 2024 end//////


                if (frame.tableRows && frame.tableRows.length > 0) {

                  for (let tableData of frame.tableRows) {
                    for (let itemGroup of tableData) {
                      if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                        for (let item of itemGroup.Level5) {
                          if (itemName && item.group_no_str && (itemName.toLowerCase() == item.group_no_str.toLowerCase())) {
                            this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                          }
                          // if (item.containerRowss && item.containerRowss.length > 0) {
                          //   for (let cGrp of item.containerRowss) {
                          //     for (let cItem of cGrp.Level5) {
                          //       if ((frame && itemName.toUpperCase() == "ALL") || (itemName ? ((itemName == cItem.apps_item_seqid) || (cItem.item_name && itemName && (itemName.toLowerCase() == cItem.item_name.toLowerCase()))) : true)) {
                          //         this.set_config(name, cItem, paraName, paraValue)
                          //       }
                          //     }
                          //   }
                          // }
                        }
                      } else {
                        if (itemGroup && itemGroup.length > 0) {
                          for (let item of itemGroup) {
                            if (itemName && item.group_no_str && (itemName.toLowerCase() == item.group_no_str.toLowerCase())) {
                              this.set_config(name, item, paraName, paraValue, frame.apps_page_frame_seqid)
                            }
                          }
                        }
                      }
                    }

                  }
                }


                if (frame.apps_frame_type == "ENTRY_TABLE" || frame.apps_frame_type == "TABLE" || frame.apps_frame_type == "HORIZONTAL_TABLE") {
                  // frame.headers = JSON.parse(JSON.stringify(frameLevel4));

                  let level4 = [];
                  if (frameLevel4 && frameLevel4.length > 0) {
                    level4[0] = JSON.parse(JSON.stringify(frameLevel4))
                    let sepdata = this.seprateData(frame, level4)
                    frame.headers = sepdata[0];

                  }

                  if (frame.summary_flag) {
                    // let frameName = this.get_frame_config(frame.apps_page_frame_seqid);
                    // this.processDataServ.calculateTableRows(frameName);
                    this.calculateFrames[frame.apps_page_frame_seqid] = "Y";
                  }


                  //  frame.headers = JSON.parse(JSON.stringify(frameLevel4));;
                  let tHead = [];
                  for (let itemGroup of frameLevel4) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if (item.item_visible_flag == "T") {
                          tHead.push(item.prompt_name)
                        }
                      }

                    } else {
                      if (itemGroup && itemGroup.length > 0) {
                        for (let item of itemGroup) {
                          if (item.item_visible_flag == "T") {
                            tHead.push(item.prompt_name)
                          }
                        }
                      }
                    }
                  }

                  frame.tHead = tHead;

                }

              }
            }
          }
        }
      }
    }
    return;
  }
  encrypt_value(value: any) {
    if (value) {
      value = this.encryptDecrypt.encryptData(value);
      return value;
    }
  }

  get_name_index(itemName, frameName) {

    if (frameName) {
      return this.object_mast._object_indexes.byFrameAndItem[`${frameName?.toUpperCase()}__${itemName?.toUpperCase()}`];
    } else {
      return this.object_mast._object_indexes.byItemName[`${itemName?.toUpperCase()}`];
    }

    // return row;
  }

  deepClone(level4, flag?) {
    let frameLevel4 = [];

    for (let i = 0; i < level4.length; i++) {
      let itmGrp = { ...level4[i] };
      let level5 = [];
      for (let j = 0; j < level4[i].Level5.length; j++) {
        let itm = { ...level4[i].Level5[j] };
        level5.push(itm);
      }

      itmGrp.Level5 = [...level5];
      frameLevel4.push(itmGrp);
    }

    return frameLevel4;

  }


  make_row_dirty(ev, rowsdata?) {
    if (rowsdata) {
      for (let itemGroup of rowsdata) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.frame_status == 'dirty') return item;
            item.frame_status = 'dirty';
          }
        }
      }
    }
  }

  check_row_dirty(ev, rowsdata?) {
    if (rowsdata) {

      let itm = rowsdata[0]?.Level5[0];
      if (itm && itm.frame_status == 'dirty') {
        return itm;
      }

      for (let i = rowsdata.length - 1; i >= 0; i--) {
        let itemGroup = rowsdata[i];

        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {

            if (item.item_name == 'WMA_RECORD_STATUS') {
              if (item.frame_status == 'dirty') {
                this.make_row_dirty(ev, rowsdata);
              }
              return item;
            }
          }
        }
      }


    }
  }

  check_for_current_record(rowsdata?) {
    if (rowsdata) {

      for (let i = rowsdata.length - 1; i >= 0; i--) {
        let itemGroup = rowsdata[i];
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.item_name == 'WMA_FRAME_STATUS') {
              return item;
            }
          }
        }
      }


    }
  }

  get_rows(frame, index, flag?) {
    let rowIndex = index;
    if (rowIndex) { } else { rowIndex = 0; }

    rowIndex = this.get_current_record(index, frame) ?? 0;

    let tableRows = [];
    if (flag || frame.edit_record_index == undefined || (rowIndex == frame.edit_record_index) || (frame.tempRows && rowIndex > frame.tempRows.length - 1)) {
      tableRows = frame.tableRows;
      rowIndex = Math.min(rowIndex, (tableRows && tableRows.length > 0 ? tableRows.length - 1 : 0));
    } else {
      tableRows = frame.tempRows;
    }

    return tableRows && tableRows[rowIndex] ? tableRows[rowIndex] : JSON.parse(JSON.stringify(frame.Level4));

  }


  treeMenu(tabledata) {
    let data = this.getChild("step", "1", null, tabledata, null);
    this.makeParent(data, tabledata);
    return data;
  }

  makeParent(data, tableData) {
    for (let t of data.child) {
      let itmArr = t.menu_option_name.split("--");
      let id = itmArr[0];
      let name = itmArr[1];
      let a = this.getChild("parent_code", id, name, tableData, t.parent_code);
      t.childData = a;
      if (a.isParent) {
        this.makeParent(t.childData, tableData);
      }
    }
  }

  getChild(from, to, name, tableData, parentId) {
    let vals = tableData.filter(x => x[from] == to);

    if (vals && vals.length > 0) {
      return {
        isParent: true,
        id: to,
        name: name,
        child: vals,
        parentId: parentId
      }
    } else {
      return {
        isParent: false,
        id: to,
        name: name,
        child: [],
        parentId: parentId
      }
    }
  }

  // start for log data add by arti
  runFlowcall = false;
  stack: number[] = [];
  get_event_log_objs(name, frame_seqid, item_seqid, object_code, status, ws_type, log_name, seq?) {
    if (status == "start") {
      let obj = {
        name: log_name,
        slno: seq
      }
      this.globalObjects.log_event_slno_check_array.push(obj)
      this.get_event_log_obj(name, frame_seqid, item_seqid, object_code, status, ws_type, seq);
    } else {
      let logsData = this.globalObjects.log_event_slno_check_array.find((arr) => arr.name == log_name)
      this.get_event_log_obj(name, frame_seqid, item_seqid, object_code, status, ws_type, logsData ? logsData.slno : '');
      this.globalObjects.log_event_slno_check_array = this.globalObjects.log_event_slno_check_array.filter((arr) => arr.name != log_name)
    }
  }

  start(): string {
    // increment current level or start at root
    if (this.stack.length === 0) {
      this.stack.push(1);
    } else {
      this.stack[this.stack.length - 1]++;
    }
    // prepare child level for any nested calls
    this.stack.push(0);
    return this.seq();
  }

  end(): void {
    // leave child level
    if (this.stack.length > 0) this.stack.pop();
  }

  seq(): string {
    // join all non-zero levels (e.g., [1,0] -> "1")
    const parts = this.stack.filter((n, i) => !(i === this.stack.length - 1)); // drop the trailing 0
    return parts.join('.') || '1';
  }
  // end for log data add by arti


  activeTabIndex() {
    if (isPlatformServer(this.platformId)) return;
    const tabGet: any = document.querySelectorAll('app-my-tab')
    for (let [index, tabTag] of tabGet.entries()) {
      if (!tabTag.childNodes[0].hasAttribute("hidden")) {
        return index
      }
    }
  }



  is_record_present(frameName, index) {
    let frame = this.get_frame_config(frameName);

    if (frame) {

      if (!frame.searchableData) return 'T';

      for (let tableData of frame.searchableData) {
        for (let itemGrp of tableData) {
          if (itemGrp.Level5.length > 0) {
            if (itemGrp.Level5[0].indexcount == index) {
              return 'T';
            } else {
              break;
            }

          }
        }
      }

      return 'F';

    } else {
      return 'T';
    }
  }

  isSetDimension(item, paraname, frameId) {
    if (paraname == "calling_object_code") {
      if (item.dimensionItem) {
        this.set_config('', item.dimensionItem, paraname, item.calling_object_code, frameId);
      }

      if (item.display_setting_str) {
        let str = typeof (item.display_setting_str) == 'string' ? JSON.stringify(item.display_setting_str) : item.display_setting_str;

        if ((str["dimension"] == 'T' || str["DIMENSION"] == 'T') && item.calling_object_code) {
          let dimensionItem: any
          // this.events.publish(`dimension#${item.apps_page_frame_seqid}#${item.apps_item_seqid}`);
          dimensionItem = JSON.parse(JSON.stringify(item));
          dimensionItem.item_enable_flag = "T"
          dimensionItem.click_events_str = item.orignal_click_events_str ? item.orignal_click_events_str : item.click_events_str;
          item.dimensionItem = dimensionItem;
          this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frameId);
        }
      }
    }
  }


  buildItemIndexes(objectMast: any) {
    const indexes = {
      byFrameAndItem: {} as Record<string, any>,
      byItemName: {} as Record<string, any[]>,
      byAliases: {}
    };

    for (let l2 = 0; l2 < (objectMast?.Level2 || []).length; l2++) {
      const page = objectMast.Level2[l2];

      for (let l3 = 0; l3 < (page?.Level3 || []).length; l3++) {
        const frame = page.Level3[l3];

        const frameAlias = frame?.frame_alias || '';
        const frameSeqid = frame?.apps_page_frame_seqid || '';

        if ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' && !(frame.apps_page_frame_seqid.includes("PARA")) && (!frame.Level4 || frame.Level4.length < 1)) {
          frame.Level4 = this.get_ass_Level4(frame.apps_page_frame_seqid);
        }

        for (let l4 = 0; l4 < (frame?.Level4 || []).length; l4++) {
          const group = frame.Level4[l4];

          for (let l5 = 0; l5 < (group?.Level5 || []).length; l5++) {
            const item = group.Level5[l5];
            const itemName = item?.item_name;
            const itmSeq = item?.apps_item_seqid;

            if (!itemName) continue;

            const pos = {
              level2Index: l2,
              level3Index: l3,
              level4Index: l4,
              level5Index: l5,
              frameAlias,
              frameSeqid
            };

            let itmAlias = null;

            const aliasKey = `${frameAlias}__${itemName}`;
            const seqidKey = `${frameSeqid}__${itemName}`;

            const aliasKeyItSeq = `${frameAlias}__${itmSeq}`;
            const seqidKeyItSeq = `${frameSeqid}__${itmSeq}`;

            // if (item.aliases) {
            //   itmAlias = {
            //     level2Index: l2,
            //     level3Index: l3,
            //     level4Index: l4,
            //     level5Index: l5,
            //     frameAlias,
            //     frameSeqid,
            //     itemName
            //   };
            // }
            if (item.aliases && item.item_visible_flag == 'T' && item.item_enable_flag == 'T' && item.item_type != 'RIGHT_CLICK') {
              itmAlias = {
                frameSeqid,
                itemName
              };
            }

            // ✅ first match only, do not overwrite duplicate
            if (!indexes.byFrameAndItem[aliasKey]) {
              indexes.byFrameAndItem[aliasKey] = pos;
            }

            if (!indexes.byFrameAndItem[seqidKey]) {
              indexes.byFrameAndItem[seqidKey] = pos;
            }

            if (!indexes.byFrameAndItem[aliasKeyItSeq]) {
              indexes.byFrameAndItem[aliasKeyItSeq] = pos;
            }

            if (!indexes.byFrameAndItem[seqidKeyItSeq]) {
              indexes.byFrameAndItem[seqidKeyItSeq] = pos;
            }

            if (frame.apps_page_frame_seqid && ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A') && !(frame.apps_page_frame_seqid).toLowerCase().includes("-para")) { } else {

              // keep all for fallback/search
              if (!indexes.byItemName[itemName]) {
                indexes.byItemName[itemName] = [];
              }

              indexes.byItemName[itemName].push(pos);

              // keep all for fallback/search
              if (!indexes.byItemName[itmSeq]) {
                indexes.byItemName[itmSeq] = [];
              }

              indexes.byItemName[itmSeq].push(pos);
            }


            if (itmAlias) {
              let key = 'ALT_' + item.aliases.toUpperCase();
              // if (indexes.byAliases[key] && indexes.byAliases[key].page_no == frame.apps_page_no) {
              //   indexes.byAliases[key].value.push(itmAlias)
              // } else {
              //   indexes.byAliases[key] = {
              //     page_no: frame.apps_page_no,
              //     value: [itmAlias]
              //   }
              // }
              // 1. Ensure the key always starts with an array if it doesn't exist yet
              if (!indexes.byAliases[key]) {
                indexes.byAliases[key] = [];
              }

              // 2. Look through the array to see if we already have an object with this page_no
              const existingPage = indexes.byAliases[key].find(
                (item) => item.page_no === frame.apps_page_no
              );

              if (existingPage) {
                // IF MATCH FOUND: Push the alias into the existing page's value array
                existingPage.value.push(itmAlias);
              } else {
                // IF NO MATCH: Add a brand new page object to the array
                indexes.byAliases[key].push({
                  page_no: frame.apps_page_no,
                  value: [itmAlias]
                });
              }

            }

          }
        }
      }
    }

    return indexes;
  }

  refresh_frames() {

    if (this.calculateFrames && Object.keys(this.calculateFrames).length > 0) {
      let frameId = Object.keys(this.calculateFrames);
      for (let f of frameId) {
        // this.cdEngine.detect(f)
        let frame = this.get_frame_config(f);

        if (frame) {
          this.processDataServ.calculateTableRows(frame);
        }
      }
      this.calculateFrames = {}
    }
    if (this.refreshFrames && Object.keys(this.refreshFrames).length > 0) {
      let frameId = Object.keys(this.refreshFrames);
      for (let f of frameId) {
        // this.cdEngine.detect(f);
        //         let frame=this.get_frame_config(f)

        // if(frame.canvasRows){

        //   frame.canvasRows = frame.canvasRows.map(group => {
        //     return Object.keys(group)
        //       .filter(key => key !== 'Level5')
        //       .map(key => group[key]);
        //   });
        // }
        this.cdEngine.detect(f);
      }
      this.refreshFrames = {}
    }

    if (this.refreshFrameItems && Object.keys(this.refreshFrameItems).length > 0) {
      let itemId = Object.keys(this.refreshFrameItems);

      // let frameIds=[]
      // for (let f of itemId) {
      //   if(f.includes('#')){

      //     let frameItemSplit=f.split('#');
      //     frameIds.push(frameItemSplit[1])
      //   }else{
      //     frameIds.push(f)
      //   }
      // }
      // frameIds=[...new Set(frameIds)]

      // for(let frameid of frameIds){
      //    let frame=this.get_frame_config(frameid)

      //   if(frame && frame.canvasRows){

      //     frame.canvasRows = frame.canvasRows.map(group => {
      //       return Object.keys(group)
      //         .filter(key => key !== 'Level5')
      //         .map(key => group[key]);
      //     });
      //   }
      // }

      for (let f of itemId) {

        this.cdEngine.detect(f)
      }
      this.refreshFrameItems = {}
    }


  }

  get_shortkey_name(key) {
    return this.object_mast._object_indexes.byAliases[key];
  }

  go_item_from_alt(name, index?, force?, send?) {

    // force = true to not run the click event on focus of input

    let frameName = "";
    let itemName = "";
    if (name.indexOf(".") > -1) {
      let nameArr = name.split(".");

      if (nameArr.length > 2) {
        frameName = nameArr[1];
        itemName = nameArr[2];
      } else {
        frameName = nameArr[0];
        itemName = nameArr[1];
      }
    } else {
      itemName = name;
    }

    let rowIndex = 0;

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName.toUpperCase()) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : true)) {
          // if (frameName && !frame.collapse) {
          //   frame.collapse = true;
          // }
          rowIndex = this.get_current_record(index, frame) ?? 0;

          if (frame.apps_frame_type == 'ENTRY_TABLE' && frame.tableRows && frame.tableRows.length > 0 && frame.tableRows[rowIndex]) {
            frame.edited_row_id = rowIndex;
          }

          if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE') {
            let displayRecord = frame.display_no_of_records ? frame.display_no_of_records : 50
            if ((rowIndex < frame.page_no * displayRecord) && (rowIndex >= ((frame.page_no * displayRecord) - displayRecord))) {
              if (index == undefined) {
                index = rowIndex - ((frame.page_no * displayRecord) - displayRecord);
              }
              // rowIndex = index;

              let item = this.get_item(frame.apps_page_frame_seqid + '.' + itemName, rowIndex ? rowIndex : null);
              if (item) item.isclickable = true;

              setTimeout(() => {
                if (isPlatformServer(this.platformId)) return;
                let container: any = document.querySelectorAll("#" + frame.apps_page_frame_seqid + "--" + (rowIndex ? rowIndex : 0));
                if (container) {
                  var universe: any = []
                  let tdArray = Array.from(container);
                  if (Array.isArray(tdArray)) {
                    for (let a of container) {
                      let universes = a.querySelectorAll(
                        "input,select,textarea,ion-input,ion-textarea,ion-button,button"
                      );
                      if (universes) {
                        universes.forEach((el) => {
                          universe.push(el);  // Pushes the node itself
                        });
                      }


                    }
                  } else {
                    universe = container.querySelectorAll(
                      "input,select,textarea,ion-input,ion-textarea,ion-button,button"
                    );
                  }

                  let list = Array.prototype.filter.call(universe, (item) => {
                    return (
                      item.tabIndex >= 0 ||
                      item.tagName === 'ION-TEXTAREA' ||
                      item.tagName === 'ION-INPUT' ||
                      item.tagName === 'ION-BUTTON'
                    );
                  });

                  let el = list.find((el) => (el && el.id.toLowerCase() == itemName.toLowerCase()) || (el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase()));
                  // start -code by arti
                  if (!el) {
                    if (item.item_type == "BUTTON_ICON" || item.item_type == "FRAME_BUTTON_ICON" || item.item_type == "BUTTON") {
                      let name = item.apps_item_seqid + item.indexcount;
                      el = list.find((el) => (el && el.id.toLowerCase() == name.toLowerCase()) || (el.offsetParent && el.offsetParent.id.toLowerCase() == name.toLowerCase()));
                    }
                  }
                  // end -code by arti
                  if (el) {

                    let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
                    let itm = this.get_item(name, rowIndex ? rowIndex : null);

                    if (send) {
                      return el;
                    }
                    setTimeout(() => {
                      if (itm) {
                        if (item && force) {
                          item.forcedFocus = force;
                        }
                        itm.frame_status = 'dirty';
                      }

                      // el.focus();

                      if (el.tagName === 'ION-TEXTAREA' || el.tagName === 'ION-INPUT') {
                        el.setFocus();   // Ionic way
                      } else if (el.tagName === 'ION-BUTTON') {
                        //  Look inside the shadow root for the actual underlying button element
                        const nativeButton = el.shadowRoot?.querySelector('button') || el.querySelector('button');

                        if (nativeButton) {
                          nativeButton.focus();
                        } else {
                          el.focus(); // Fallback
                        }
                      } else {
                        el.focus();      // Native way
                      }

                      frame.active_row = rowIndex;
                      // el.setFocus();
                      if (frameName) {
                        this.cdEngine.detect(frame.apps_page_frame_seqid);
                        return;
                      }
                    }, 2)
                  }
                }
              }
              )
            }
          } else {
            let flag = false;
            if (frame.apps_frame_type == 'CANVAS') {
              let itemGet = this.get_item(frame.apps_page_frame_seqid + '.' + itemName, rowIndex ? rowIndex : null);
              if (itemGet && itemGet.isSeprated) {

                let itmGrp = this.get_sep_grp(itemGet.isSeprated.sepratorGprId, frame, rowIndex ?? 0);

                if (itmGrp && itmGrp.Level5) {
                  for (let item of itmGrp.Level5) {
                    if (item.apps_item_seqid == itemGet.isSeprated.sepratorId) {
                      if ((item.item_sub_type == 'COLLAPSE' && item.sepCollapse != 'SHOW') || ((item.item_sub_type == 'TAB_VERTICAL' || item.item_sub_type == 'TAB_HORIZONTAL') && item.sepFrame != 'SHOW')) {
                        flag = true;
                        item.item_sub_type == 'COLLAPSE' ? item.sepCollapse = 'SHOW' : item.sepFrame = 'SHOW';
                      } else {
                        break;
                      }
                    } else {
                      item.sepFrame = 'HIDE';
                    }
                  }
                }
              }
            }

            if (!flag) {
              this.focusItem_alt(itemName, frameName, frame, rowIndex, send, force);
            } else {
              setTimeout(() => {
                this.focusItem_alt(itemName, frameName, frame, rowIndex, send, force);
              }, 0);
            }

          }
          this.cdEngine.detect(frame.apps_page_frame_seqid);
        }
      }
    }
    return;
  }

  focusItem_alt(itemName, frameName, frame, rowIndex, send, force) {
    if (isPlatformServer(this.platformId)) return;
    let container = document.querySelector("#" + frame.apps_page_frame_seqid);
    if (container) {
      var universe: any = container.querySelectorAll(
        "input,select,textarea,ion-input,ion-textarea,ion-button,button",
      );
      var list = Array.prototype.filter.call(universe, (item) => {
        return (
          item.tabIndex >= 0 ||
          item.tagName === 'ION-TEXTAREA' ||
          item.tagName === 'ION-INPUT' ||
          item.tagName === 'ION-BUTTON'
        );
      });
      let el = list.find((el) => (el && el.id.toLowerCase() == itemName.toLowerCase()) || (el.offsetParent && el.offsetParent.id.toLowerCase() == itemName.toLowerCase()));

      // start -code by arti
      if (!el) {
        let item = this.get_item(frame.apps_page_frame_seqid + '.' + itemName, rowIndex ? rowIndex : null);
        if (item.item_type == "BUTTON_ICON" || item.item_type == "FRAME_BUTTON_ICON" || item.item_type == "BUTTON") {
          let name = item.apps_item_seqid + item.indexcount;
          el = list.find((el) => (el && el.id.toLowerCase() == name.toLowerCase()) || (el.offsetParent && el.offsetParent.id.toLowerCase() == name.toLowerCase()));
        }
      }
      // end -code by arti

      if (el) {
        let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
        let itm = this.get_item(name, rowIndex ? rowIndex : null, true);
        let item = this.get_item(frame.apps_page_frame_seqid + '.' + itemName, rowIndex ? rowIndex : null, true);

        // this.set_item_config(name, 'frame_status', 'dirty', rowIndex ? rowIndex : null);

        if (send) {
          return el;
        }

        requestAnimationFrame(() => {
          if (itm) {
            if (item && force) {
              item.forcedFocus = force;
            }
            itm.frame_status = 'dirty';
          }

          if (!el.readOnly && !el.disabled && el.type != 'hidden') {

            // 🔥 KEY FIX
            if (el.tagName === 'ION-TEXTAREA' || el.tagName === 'ION-INPUT') {
              el.setFocus();   // Ionic way
            } else if (el.tagName === 'ION-BUTTON') {
              //  Look inside the shadow root for the actual underlying button element
              const nativeButton = el.shadowRoot?.querySelector('button') || el.querySelector('button');

              if (nativeButton) {
                nativeButton.focus();
              } else {
                el.focus(); // Fallback
              }
            } else {
              el.focus();      // Native way
            }
          } else {
            el = this.findNextTabStop(el);

            if (el.tagName === 'ION-TEXTAREA' || el.tagName === 'ION-INPUT') {
              el.setFocus();
            } else if (el.tagName === 'ION-BUTTON') {
              //  Look inside the shadow root for the actual underlying button element
              const nativeButton = el.shadowRoot?.querySelector('button') || el.querySelector('button');

              if (nativeButton) {
                nativeButton.focus();
              } else {
                el.focus(); // Fallback
              }
            } else {
              el.focus();
            }
          }

          frame.active_row = rowIndex ?? 0;

          if (frameName) {
            return;
          }
        });
      }
    }
  }

  set_aliese_altkey(item, frameId, page_no) {
    if (item.aliases && item.item_type != 'RIGHT_CLICK') {
      let itmAlias = {
        frameSeqid: frameId,
        itemName: item.item_name
      };
      let key = 'ALT_' + item.aliases.toUpperCase();
      let getkey = this.object_mast._object_indexes.byAliases[key];
      if (item.item_visible_flag == 'T' && item.item_enable_flag == 'T') {
        if (getkey) {
          let keyvalue = getkey.find(list => list.page_no == page_no);
          if (keyvalue) {
            let val = keyvalue.value.filter(value => value.itemName == item.item_name && value.frameSeqid == frameId)
            if (val && val.length > 0) {
              return
            }
            keyvalue.value.push(itmAlias)
          } else {
            let key_obj = {
              page_no: page_no,
              value: [itmAlias]
            }
            this.object_mast._object_indexes.byAliases[key].push(key_obj)
          }
        } else {
          let key_obj = {
            page_no: page_no,
            value: [itmAlias]
          }
          if (!this.object_mast._object_indexes.byAliases[key]) {
            this.object_mast._object_indexes.byAliases[key] = [];
          }
          this.object_mast._object_indexes.byAliases[key].push(key_obj)
        }
      } else {
        if (getkey) {
          let keyvalue = getkey.find(list => list.page_no == page_no);
          keyvalue.value = keyvalue.value.filter(value => !(value.itemName == item.item_name && value.frameSeqid == frameId))
        }
      }

    }
    return;
  }
}