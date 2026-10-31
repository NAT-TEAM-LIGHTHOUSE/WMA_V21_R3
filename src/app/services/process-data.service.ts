import { Injectable, NgZone, signal } from '@angular/core';
import { ColumnfilterPipe } from '../pipes/column-filter';
import { SearchfilterPipe } from '../pipes/searchfilter.pipe';
import { GlobalObjectsService } from './global-objects.service';
import { LhsLibService } from './lhs-lib.service';
import { FilterColumnDataPipe } from '../pipes/filter-column-data.pipe';
import { InputFormatMaskPipe } from '../pipes/input-format-mask.pipe';
import { applyLoggingDecorator } from './decorator-application';
import { Subject } from 'rxjs';
import { PlsqlToJsService } from '../demo-utils/plsqlToJs/plsql-to-js.service';
import { SearchFilterRawPipe } from '../pipes/search-filter-raw-pipe';
import { CdEngineService } from './cd-engine-service.service';
import { Subscription } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {

  private stopProcessing$ = new Subject<void>();

  plsql = null;

  constructor(private lhs_lib: LhsLibService, private globalObject: GlobalObjectsService,
    private pipemy: SearchfilterPipe, private pipemyRaw: SearchFilterRawPipe, private cdEngine: CdEngineService,
    private colFilter: ColumnfilterPipe, private colRawFilter: FilterColumnDataPipe, private formatMastPipe: InputFormatMaskPipe, private ngZone: NgZone) {
    this.plsql = new PlsqlToJsService(this.globalObject);
    if (this.globalObject.serviceFlag) {
      return applyLoggingDecorator(this, "process-data-service")
    }
  }


  // populateRows(frameSeq, tableData, from?, to?, pageNo?) {

  //   let frame = this.lhs_lib.get_frame_config(frameSeq);
  //   let tableRows = [];


  //   if (this.globalObject.logFlag) {
  //     let name = "processing frame data";
  //     this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, null, frame.object_code, "start");
  //   }


  //   if ((tableData.length == 1) && (Object.keys(tableData[0])[0] == 'search_output') && !tableData[0]['search_output']) {
  //     frame.no_data = true;
  //   } else {

  //     delete frame['no_data'];

  //     if (frame.apps_frame_type == 'CANVAS-BORDERED') {
  //       tableRows = this.summCardRows(tableData, frame);
  //     } else if (frame.apps_frame_type == 'ORDER ENTRY') {
  //       this.addToCart(tableData, frame);
  //     } else {

  //       let toData = (frame.display_no_of_records ? frame.display_no_of_records : 50);
  //       toData = toData > tableData.length ? tableData.length : toData;
  //       frame.max_record = toData * (frame.page_no - 1);

  //       if (tableData && tableData.length > 0) {
  //         // frame.tableData = tableData;

  //         let flag = false;

  //         if (tableData[0]['WMA_RECORD_STATUS'] == "U") {
  //           flag = true;
  //         }

  //         // let tableKey = [];
  //         // if (tableData.length > 0) {
  //         //   tableKey = Object.keys(tableData[0]);
  //         // }

  //         let data = tableData;
  //         if (to > data.length) {
  //           to = data.length;
  //         }


  //         if (this.globalObject.logFlag) {
  //           let name = "entering in for loop";
  //           this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, null, frame.object_code, "start")
  //         }

  //         for (let i = 0; i < data.length; i++) {
  //           let frameLevel4;
  //           if (frame.apexFrameLevel4 && frame.apexFrameLevel4.length > 0) {
  //             frameLevel4 = JSON.parse(JSON.stringify(frame.apexFrameLevel4));
  //           } else {
  //             // frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
  //             // frameLevel4 = frame.Level4;
  //             frameLevel4 = this.lhs_lib.deepClone(frame.Level4);

  //           }

  //           for (let itemGroup of frameLevel4) {

  //             for (let item of itemGroup.Level5) {
  //               // for (let key of tableKey) {
  //               let key = item.item_name;
  //               if (data[i].hasOwnProperty(key)) {

  //                 // if (item.item_name.toUpperCase() == key.toUpperCase()) {
  //                 item.value = data[i][key] ? (data[i][key].toLowerCase().trim() == 'null' ? '' : data[i][key]) : '';

  //                 if (item.datatype != 'DATE' && item.datatype != 'DATETIME' && item.datatype != 'TIME'
  //                   && item.value && item.format_mask && item.datatype != 'NUMBER') {
  //                   item.value = this.formatMastPipe.transform(item.value, item).value;
  //                 } else if (item.datatype == 'NUMBER' && item.value) {
  //                   let val = this.formatMastPipe.transform(item.value, item).value;
  //                   if (val) {
  //                     let a = val.toString().replaceAll(",", "");
  //                     val = a;
  //                   }
  //                   item.value = val;
  //                 }

  //                 item.isValid = true;
  //                 if (flag) {
  //                   item.oldValue = item.value;
  //                 }

  //                 if (data[i][key] && (data[i][key].indexOf("~") > -1) && (data[i][key].indexOf("background-color") > -1)) {
  //                   let val = data[i][key].split("~");
  //                   let str = val[1].replaceAll("\"");
  //                   item.value = val[0];
  //                   if (str["background-color"]) {
  //                     let obj = {
  //                       "background-color": str["background-color"]
  //                     };
  //                     item.tdStyle = JSON.stringify(obj);
  //                     delete str["background-color"];
  //                     item.display_setting_str = JSON.stringify(str);
  //                   }

  //                   else {
  //                     item.display_setting_str = JSON.parse(val[1]);
  //                   }
  //                 }

  //                 item.no_default_value = true;
  //                 // }
  //               }

  //               if (item.item_name == 'WMA_RECORD_STATUS' && !frame.noDirty) {
  //                 item['frame_status'] = 'dirty';
  //               }

  //               item.indexcount = i;
  //               item.max_record = frame.max_record;

  //               if (['CHECK_BOX', 'SPECIAL'].includes(item.item_type) && (item.value == 'Y' || item.value == '1')) {
  //                 item.initialVal = true;
  //               }

  //               if (frame.callingObjectArr && frame.callingObjectArr.length > 0) {
  //                 let clickIndex = i;

  //                 let callingObjectCodeStr = frame.callingObjectArr[clickIndex].value;
  //                 if (callingObjectCodeStr) {
  //                   let codeValueJsonArr = this.globalObject.getCodeValueJsonArr(callingObjectCodeStr);
  //                   for (let codeValue of codeValueJsonArr) {
  //                     if (JSON.stringify(codeValue.head).toUpperCase() == JSON.stringify(item.item_name).toUpperCase()) {
  //                       item.calling_object_code = codeValue.objectCode;
  //                     }
  //                   }
  //                 }
  //               }

  //             }

  //           }
  //           tableRows.push(frameLevel4);
  //         }


  //         if (this.globalObject.logFlag) {
  //           let name = "entering in for loop";
  //           this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, null, frame.object_code, "end")
  //         }
  //         // delete frame['headers'];

  //         if (frame.searchableData) {
  //           frame.searchableData = tableRows;
  //         } else {
  //           frame.tableRows = tableRows;
  //         }

  //       } else {
  //         if ((!frame.tableRows || frame.tableRows.length > 1) && (frame.apps_frame_type != 'CARD') && (frame.apps_frame_sub_type != "GLOBAL_SEARCH_BODY")) {
  //           frame.tableRows = []
  //           frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
  //         } else if ((!frame.tableRows || tableData.length == 0) && (frame.apps_frame_sub_type == "GLOBAL_SEARCH_BODY" && frame.apps_frame_type == "SYSTEM")) {
  //           frame.no_data = true;
  //         }
  //       }
  //     }
  //   }

  //   delete frame['summary_rows'];
  //   frame.rowCount = 0
  //   if (frame.apps_frame_type == 'CHART') {
  //     tableRows = this.amChartData(tableData, frame);
  //   } else {
  //     if (this.globalObject.logFlag) {
  //       let name = "afterTableRows";
  //       this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, null, frame.object_code, "start")
  //     }
  //     this.afterTableRows(frame, from, to, pageNo);

  //     if (this.globalObject.logFlag) {
  //       let name = "afterTableRows";
  //       this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, null, frame.object_code, "end")
  //     }
  //   }

  //   if (this.globalObject.logFlag) {
  //     let name = "processing frame data";
  //     this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, null, frame.object_code, "end")
  //   }

  //   return;

  // }

  // stopProcessing() {
  //   this.stopProcessing$.next(); // Notify to stop processing
  //   this.stopProcessing$.complete(); // Clean up the subject
  // }

  

  // async populateRows(frameSeq, tableData, from?, to?, pageNo?, batchSize = 30): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       let frame = this.lhs_lib.get_frame_config(frameSeq);

  //       if (frame) {
  //         let tableRows = [];

  //         frame.tableRows = [];

  //         delete frame['canvasRows'];
  //         delete frame['searchableData'];
  //         delete frame['searchableRawData'];

  //         if (this.globalObject.logFlag) {
  //           let ws_type = "get data";
  //           // this.lhs_lib.get_event_log_obj("processing frame data", frame.apps_page_frame_seqid, null, frame.object_code, "start",ws_type);
  //           let log_name = `populateRows ${frameSeq}`;
  //           let status = "start";
  //           const seq = this.lhs_lib.start();
  //           this.lhs_lib.get_event_log_objs("processing frame data", frame.apps_page_frame_seqid, null, frame.object_code, status, ws_type, log_name, seq)
  //         }

  //         if ((tableData.length == 1) && (Object.keys(tableData[0])[0] == 'search_output') && !tableData[0]['search_output']) {
  //           frame.no_data = true;
  //           return;
  //         }

  //         delete frame['no_data'];
  //         delete frame['summary_rows'];
  //         frame.rowCount = 0

  //         if (frame.apps_frame_type == 'CANVAS-BORDERED') {
  //           tableRows = this.summCardRows(tableData, frame);
  //           resolve();
  //         } else if (frame.apps_frame_type == 'ORDER ENTRY') {
  //           frame.tableRows = this.addToCart(tableData, frame);
  //           resolve();
  //         } else {
  //           let toData = frame.display_no_of_records || 50;
  //           toData = Math.min(toData, tableData.length);
  //           frame.max_record = toData * (frame.page_no - 1);


  //           if (frame.apps_frame_type == 'TREE_MENU') {
  //             let data = this.lhs_lib.treeMenu(tableData);
  //             if (data) {
  //               frame.grpData = data.child;
  //               frame.filteredData = frame.grpData;
  //             }
  //           }

  //           if (!tableData || tableData.length === 0) {
  //             // return;

  //             if ((!frame.tableRows || frame.tableRows.length < 1) && (frame.apps_frame_type != 'CARD') && (frame.apps_frame_sub_type != "GLOBAL_SEARCH_BODY")) {
  //               frame.tableRows = []
  //               frame.tableRows[0] =frame.apexFrameLevel4?.length ? JSON.parse(JSON.stringify(frame.apexFrameLevel4)) : JSON.parse(JSON.stringify(frame.Level4));

  //               this.afterTableRows(frame);
  //             } else if ((!frame.tableRows || tableData.length == 0) && (frame.apps_frame_sub_type == "GLOBAL_SEARCH_BODY" && frame.apps_frame_type == "SYSTEM")) {
  //               frame.no_data = true;
  //             }

  //             resolve();
  //           } else {


  //             // batchSize = 50; // Process 50 rows at a time
  //             let index = 0;
  //             let i = 0;
  //             let isProcessing: boolean = true;

  //             this.stopProcessing$.subscribe(() => {
  //               isProcessing = false;
  //             });


  //             const add_css = (data, itm, css) => {
  //               let da = { itm: itm.toUpperCase(), css }
  //               if (data.runtime_added_css) {
  //                 data.runtime_added_css.push(da);
  //               } else {
  //                 data.runtime_added_css = [da];
  //               }
  //               return data;
  //             }

  //             const processBatch = () => {

  //               if (!isProcessing) return;

  //               let batchEnd = Math.min(index + batchSize, tableData.length);

  //               for (let i = index; i < batchEnd; i++) {
  //                 let data = {};
  //                 for (const key in tableData[i]) {
  //                   if (tableData[0].hasOwnProperty(key)) {
  //                     data[key.toUpperCase()] = tableData[i][key];
  //                   }
  //                 }


  //                 if (frame.css_class_frame) {
  //                   let code = this.plsql.getConvertedScript(frame.css_class_frame, true);

  //                   code = code.replaceAll('add_css(', 'add_css(data,');

  //                   let str = `((data) => {${code}})(tableData[i])`

  //                   let da = eval(str);
  //                   if (da) {
  //                     console.log(da);
  //                   }
  //                 }

  //                 let flag = false;

  //                 tableData[i].LROWINDEX = i;

  //                 if (data['WMA_RECORD_STATUS'] == "U") {
  //                   flag = true;
  //                 }
  //                 // let frameLevel4 = frame.apexFrameLevel4?.length ? this.lhs_lib.deepClone(frame.apexFrameLevel4) : this.lhs_lib.deepClone(frame.Level4);
  //                 let frameLevel4 = frame.apexFrameLevel4?.length ? JSON.parse(JSON.stringify(frame.apexFrameLevel4)) : JSON.parse(JSON.stringify(frame.Level4));

  //                 for (let itemGroup of frameLevel4) {

  //                   for (let item of itemGroup.Level5) {
  //                     // for (let key of tableKey) {
  //                     let key = item.item_name ? item.item_name.toUpperCase() : '';
  //                     if (data.hasOwnProperty(key)) {
  //                       // console.log(data[key],key);
  //                       // if (item.item_name.toUpperCase() == key.toUpperCase()) {
  //                       item.value = data ? (data[key]?.toLowerCase().trim() == 'null' ? '' : data[key]) : '';

  //                       if (item.datatype != 'DATE' && item.datatype != 'DATETIME' && item.datatype != 'TIME'
  //                         && item.value && item.format_mask && item.datatype != 'NUMBER') {
  //                         item.value = this.formatMastPipe.transform(item.value, item).value;
  //                       } else if (item.datatype == 'NUMBER' && item.value) {
  //                         let val = this.formatMastPipe.transform(item.value, item).value;
  //                         if (val) {
  //                           let a = val.toString().replaceAll(",", "");
  //                           val = a;
  //                         }
  //                         item.value = val;
  //                       }

  //                       item.isValid = true;
  //                       if (flag) {
  //                         item.oldValue = item.value;
  //                       }

  //                       if (data[key] && (data[key]?.indexOf("~") > -1) && (data[key]?.indexOf("background-color") > -1)) {
  //                         let val = data[key].split("~");
  //                         let str = val[1].replaceAll("\"");
  //                         item.value = val[0];
  //                         if (str["background-color"]) {
  //                           let obj = {
  //                             "background-color": str["background-color"]
  //                           };
  //                           item.tdStyle = JSON.stringify(obj);
  //                           delete str["background-color"];
  //                           item.display_setting_str = JSON.stringify(str);
  //                         }

  //                         else {
  //                           item.display_setting_str = JSON.parse(val[1]);
  //                         }
  //                       }

  //                       item.no_default_value = true;
  //                       // }
  //                     }

  //                     // if (item.item_name == 'WMA_RECORD_STATUS' && !frame.noDirty) {
  //                     //   item['frame_status'] = 'dirty';
  //                     // }

  //                     if (!frame.noDirty) {
  //                       item['frame_status'] = 'dirty';
  //                     }

  //                     item.indexcount = i;
  //                     item.max_record = frame.max_record;

  //                     if (['CHECK_BOX', 'SPECIAL'].includes(item.item_type) && (item.value == 'Y' || item.value == '1')) {
  //                       item.initialVal = true;
  //                       item.isChecked = true;
  //                     }

  //                     if (frame.callingObjectArr && frame.callingObjectArr.length > 0) {
  //                       let clickIndex = i;

  //                       let callingObjectCodeStr = frame.callingObjectArr[clickIndex].value;
  //                       if (callingObjectCodeStr) {
  //                         let codeValueJsonArr = this.globalObject.getCodeValueJsonArr(callingObjectCodeStr);
  //                         for (let codeValue of codeValueJsonArr) {
  //                           if (JSON.stringify(codeValue.head).toUpperCase() == JSON.stringify(item.item_name).toUpperCase()) {
  //                             item.calling_object_code = codeValue.objectCode;
  //                           }
  //                         }
  //                       }
  //                     }

  //                     if (tableData[i]['runtime_added_css']) {

  //                       for (let da of tableData[i]['runtime_added_css']) {
  //                         let itmN;
  //                         let css_class;

  //                         itmN = da.itm.split(",");
  //                         css_class = da.css
  //                         if (itmN && (itmN.find(x => x == item.item_name) || itmN == 'ALL') && css_class) {
  //                           let obj = JSON.parse(css_class.replaceAll("'", "\""));
  //                           item.display_setting_str = item.display_setting_str ? { ...item.display_setting_str, ...obj } : obj;
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }

  //                 tableRows.push(frameLevel4);
  //               }

  //               // frame.tableRows = [...tableRows]; // Update UI progressively
  //               index += batchSize;
  //               i++;

  //               frame.total_no_of_record = tableData.length;
  //               if (index < tableData.length) {
  //                 if (i < 5) {
  //                   frame.tableRows = tableRows;
  //                   this.displayChunks(frame, from, i <= 1);
  //                 } else {
  //                   batchSize = 100;
  //                 }

  //                 this.ngZone.run(() => {
  //                   if (!frame.temp_count || typeof frame.temp_count !== 'function') {
  //                     frame.temp_count = signal(frame.tableRows.length);
  //                   }

  //                   frame.temp_count.set(frame.tableRows.length);
  //                   // this.cdEngine.mark(frame.apps_page_frame_seqid)
  //                 });

  //                 // frame.temp_count = frame.tableRows.length;
  //                 // processBatch();
  //                 this.lhs_lib.refreshFrames[frame.apps_page_frame_seqid] = "Y";
  //                 setTimeout(processBatch, 0);

  //                 if (i <= 1) {
  //                   this.cdEngine.mark(frame.apps_page_frame_seqid);
  //                 }
  //                 // requestAnimationFrame(processBatch);
  //                 // Continue processing next batch asynchronously
  //               } else {

  //                 delete frame['temp_count'];
  //                 if (frame.apps_frame_type == 'CHART') {
  //                   tableRows = this.amChartData(tableData, frame);
  //                 } else {
  //                   frame.tableRows = tableRows;
  //                   this.afterTableRows(frame, from, to, pageNo);
  //                 }
  //                 if (this.globalObject.logFlag) {
  //                   let ws_type = "get data";
  //                   // this.lhs_lib.get_event_log_obj("processing frame data", frame.apps_page_frame_seqid, null, frame.object_code, "end",ws_type);
  //                   let log_name = `populateRows ${frameSeq}`;
  //                   let status = "end";
  //                   this.lhs_lib.end();
  //                   this.lhs_lib.get_event_log_objs("processing frame data", frame.apps_page_frame_seqid, null, frame.object_code, status, ws_type, log_name);
  //                 }
  //                 resolve();
  //               }
  //             };

  //             processBatch(); // Start processing
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       reject(err);
  //     }

  //   });
  // }


  displayChunks(frame, from, first) {
    this.lhs_lib.getSepratorGrp(frame);

    if (first) {
      console.log("first");
      if (!frame.searchableData) {
        this.lhs_lib.setItemCount(frame.tableRows,'');
      }

      // if (frame.apps_frame_sub_type == 'JSON') {
      //   frame.active_row = null;
      // } else 
      if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE' || (frame.temp_frame_type && frame.temp_frame_type == "ENTRY_TABLE")) {

        let tableRows = frame.searchableData ? frame.searchableData : frame.tableRows;

        if (frame.active_row != undefined && (frame.active_row <= frame.tableRows.length) && !frame.searchableData) {
          frame.active_row = frame.active_row == frame.tableRows.length ? frame.active_row - 1 : frame.active_row;


        } else if (frame.searchableData) {
          if (tableRows && tableRows.length > 0) {
            let activeRow = tableRows[from ?? 0][0]
            if (activeRow.Level5.length > 0) {
              frame.active_row = activeRow.Level5[0].indexcount;
            }
          }
        } else {
          if (tableRows && tableRows.length > 0) {
            for (let itemGrp of tableRows[0]) {
              if (itemGrp.Level5.length > 0) {
                frame.active_row = itemGrp.Level5[0].indexcount;
                break;
              }
            }
          }
        }
      }
    }
  }


  // Inject NgZone into your constructor if you haven't already:
  // constructor(private zone: NgZone, ...) {}

  stopProcessing() {
    this.stopProcessing$.next();
    this.stopProcessing$.complete();
  }

  async populateRows(frameSeq: any, tableData: any[], from?: any, to?: any, pageNo?: any, batchSize = 50): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        let frame = this.lhs_lib.get_frame_config(frameSeq);

        if (!frame) {
          resolve();
          return;
        }

        // Hard clear the previous collection to immediately free up browser RAM
        frame.tableRows = [];

        delete frame['canvasRows'];
        delete frame['searchableData'];
        delete frame['searchableRawData'];

        if (this.globalObject.logFlag) {
          let ws_type = "get data";
          let log_name = `populateRows ${frameSeq}`;
          let status = "start";
          const seq = this.lhs_lib.start();
          this.lhs_lib.get_event_log_objs("processing frame data", frame.apps_page_frame_seqid, null, frame.object_code, status, ws_type, log_name, seq);
        }

        // if (tableData && tableData.length === 1 && Object.keys(tableData) === 'search_output' && !tableData['search_output']) {
        //   frame.no_data = true;
        //   resolve();
        //   return;
        // }

        if ((tableData.length == 1) && (Object.keys(tableData[0])[0] == 'search_output') && !tableData[0]['search_output']) {
          frame.no_data = true;
          resolve();
          return;
        }
        delete frame['no_data'];
        delete frame['summary_rows'];
        frame.rowCount = 0;

        if (frame.apps_frame_type === 'CANVAS-BORDERED') {
          frame.tableRows = this.summCardRows(tableData, frame) || [];
          resolve();
        } else if (frame.apps_frame_type === 'ORDER ENTRY') {
          frame.tableRows = this.addToCart(tableData, frame) || [];
          resolve();
        } else {
          let toData = frame.display_no_of_records || 50;
          toData = Math.min(toData, tableData ? tableData.length : 0);
          frame.max_record = toData * (frame.page_no - 1);

          if (frame.apps_frame_type === 'TREE_MENU' && tableData) {
            let data = this.lhs_lib.treeMenu(tableData);
            if (data) {
              frame.grpData = data.child;
              frame.filteredData = frame.grpData;
            }
          }

          if (!tableData || tableData.length === 0) {
            if ((frame.apps_frame_type !== 'CARD') && (frame.apps_frame_sub_type !== "GLOBAL_SEARCH_BODY")) {
              frame.tableRows = [];
              if (frame.Level4) {
                frame.tableRows.push(JSON.parse(JSON.stringify(frame.Level4)));
              }
              this.afterTableRows(frame);
            } else if (frame.apps_frame_sub_type === "GLOBAL_SEARCH_BODY" && frame.apps_frame_type === "SYSTEM") {
              frame.no_data = true;
            }
            resolve();
          } else {
            frame.loading = true
            let index = 0;
            let i = 0;
            let isProcessing = true;
            const requiredKeys = [

            ];


            const stopSubscription: Subscription = this.stopProcessing$.subscribe(() => {
              isProcessing = false;
            });

            const add_css = (data: any, itm: string, css: any) => {
              let da = { itm: itm.toUpperCase(), css };
              if (data.runtime_added_css) {
                data.runtime_added_css.push(da);
              } else {
                data.runtime_added_css = [da];
              }
              return data;
            };

            // Cache PL/SQL converted string scripts outside loops to stop memory allocations
            let cachedScriptCode = '';
            if (frame.css_class_frame) {
              cachedScriptCode = this.plsql.getConvertedScript(frame.css_class_frame, true);
              cachedScriptCode = cachedScriptCode.replaceAll('add_css(', 'add_css(data,');
            }

            let baseStructure = frame.apexFrameLevel4?.length ? frame.apexFrameLevel4 : frame.Level4;
           
            const newStructure = [];


            for (let g = 0; g < baseStructure.length; g++) {
              const itemGroup = baseStructure[g];

              const newGroup = { ...itemGroup };
                // const newGroup :any= {};

              if (itemGroup.Level5) {
                newGroup.Level5 = [];

                for (let m = 0; m < itemGroup.Level5.length; m++) {
                  const baseItem = itemGroup.Level5[m];

                  newGroup.Level5[m] = {

                    'apps_item_seqid': baseItem['apps_item_seqid'],

                    // 'apps_page_no': baseItem['apps_page_no'],
                    'item_name': baseItem['item_name'],
                    'apps_page_frame_seqid': baseItem['apps_page_frame_seqid'],
                    'apps_working_mode': baseItem['apps_working_mode'],
                    'item_seqno': baseItem['item_seqno'],
                    'item_enable_flag': baseItem['item_enable_flag'],
                    'item_visible_flag': baseItem['item_visible_flag'],
                    'item_type': baseItem['item_type'],
                    'item_sub_type': baseItem['item_sub_type'],
                    'prompt_name': baseItem['prompt_name'],
                    'display_setting_str': baseItem['display_setting_str'],
                    'position':baseItem['position']
                  };

                  // for (const key of requiredKeys) {
                  //   newGroup.Level5[m][key] = baseItem[key];
                  // }
                }
              }

              newStructure.push(newGroup);
            }


            // 2. CRITICAL: Run the entire loop execution completely outside of Angular 20 tracking
            this.ngZone.runOutsideAngular(() => {

              // Local array variable holds data to stop Angular micro-tasks from firing on every loop
              let tempRowsArray: any[] = [];


              const processBatch = () => {
                try {
                  if (!isProcessing) {
                    stopSubscription.unsubscribe();
                    this.ngZone.run(() => resolve());
                    return;
                  }

                  let batchEnd = Math.min(index + batchSize, tableData.length);

                  for (let i = index; i < batchEnd; i++) {
                    let data: any = {};
                    for (const key in tableData[i]) {
                      if (tableData[i].hasOwnProperty(key)) {
                        data[key.toUpperCase()] = tableData[i][key];
                      }
                    }

                    if (cachedScriptCode) {
                      let str = `((data) => {${cachedScriptCode}})(tableData[i])`;
                      try {
                        let da = eval(str);
                        if (da) { console.log(da); }
                      } catch (e) {
                        console.error("Dynamic evaluation parsing script logic error", e);
                      }
                    }

                    let flag = false;
                    tableData[i].LROWINDEX = i;

                    if (data['WMA_RECORD_STATUS'] === "U") {
                      flag = true;
                    }

                    // 3. CRITICAL: Safely clone layout configurations without breaking circular reference limits
                    // let baseStructure = frame.apexFrameLevel4?.length ? frame.apexFrameLevel4 : frame.Level4;
                    let frameLevel4: any = [];

                    try {

                      // for (let g = 0; g < baseStructure.length; g++) {
                      //   const itemGroup = baseStructure[g];

                      //   const newGroup = { ...itemGroup };

                      //   if (itemGroup.Level5) {
                      //     newGroup.Level5 = [];

                      //     for (let m = 0; m < itemGroup.Level5.length; m++) {
                      //       const baseItem = itemGroup.Level5[m];

                      //       newGroup.Level5[m] = Object.fromEntries(
                      //         requiredKeys.map(key => [key, baseItem[key]])
                      //       );
                      //     }
                      //   }
                      // }
                      frameLevel4 = this.lhs_lib.deepClone(newStructure);
                      // frameLevel4 = newStructure;

                      // frameLevel4 = JSON.parse(JSON.stringify(baseStructure));

                      // for (let g = 0; g < newStructure.length; g++) {

                      //   const baseGroup = newStructure[g];

                      //   const rowGroup = Object.create(baseGroup);

                      //   if (baseGroup.Level5) {
                      //     rowGroup.Level5 = new Array(baseGroup.Level5.length);

                      //     for (let m = 0; m < baseGroup.Level5.length; m++) {

                      //       // Shares static properties through prototype
                      //       const rowItem = Object.create(baseGroup.Level5[m]);

                      //       // Dynamic properties are unique for this row
                      //       // rowItem.value = '';
                      //       // rowItem.oldValue = '';
                      //       // rowItem.isValid = true;
                      //       // rowItem.indexcount = i;
                      //       // rowItem.max_record = frame.max_record;

                      //       rowGroup.Level5[m] = rowItem;
                      //     }
                      //   }

                      //   frameLevel4[g] = rowGroup;
                      // }
                    } catch (e) {
                      //  frameLevel4 = JSON.parse(JSON.stringify(baseStructure));
                         frameLevel4 = JSON.parse(JSON.stringify(newStructure));
                    }

                    if (frameLevel4 && Array.isArray(frameLevel4)) {
                      for (let itemGroup of frameLevel4) {
                        if (itemGroup && itemGroup.Level5) {
                          for (let item of itemGroup.Level5) {
                            let key = item.item_name ? item.item_name.toUpperCase() : '';
                            if (data.hasOwnProperty(key)) {
                              item.value = data ? (data[key]?.toLowerCase().trim() === 'null' ? '' : data[key]) : '';

                              if (item.datatype !== 'DATE' && item.datatype !== 'DATETIME' && item.datatype !== 'TIME' && item.value && item.format_mask && item.datatype !== 'NUMBER') {
                                item.value = this.formatMastPipe.transform(item.value, item).value;
                              } else if (item.datatype === 'NUMBER' && item.value) {
                                let val = this.formatMastPipe.transform(item.value, item).value;
                                if (val) {
                                  val = val.toString().replaceAll(",", "");
                                }
                                item.value = val;
                              }

                              item.isValid = true;
                              if (flag) { item.oldValue = item.value; }

                              if (data[key] && (data[key]?.indexOf("~") > -1) && (data[key]?.indexOf("background-color") > -1)) {
                                let val = data[key].split("~");
                                let str = val[1] ? val[1].replaceAll("\"", "") : "";
                                item.value = val[0];
                                if (str && str["background-color"]) {
                                  let obj = { "background-color": str["background-color"] };
                                  item.tdStyle = JSON.stringify(obj);
                                  delete str["background-color"];
                                  item.display_setting_str = JSON.stringify(str);
                                } else if (val) {
                                  item.display_setting_str = JSON.parse(val[1]);
                                }
                              }

                              item.no_default_value = true;
                            }

                            if (!frame.noDirty) { item['frame_status'] = 'dirty'; }

                            item.indexcount = i;
                            item.max_record = frame.max_record;

                            if (['SPECIAL'].includes(item.item_type) && (item.value === 'Y' || item.value === '1')) {
                              item.initialVal = true;
                              item.isChecked = true;
                            }

                            if (frame.callingObjectArr && frame.callingObjectArr.length > 0) {
                              let clickIndex = i;
                              if (frame.callingObjectArr[clickIndex]) {
                                let callingObjectCodeStr = frame.callingObjectArr[clickIndex].value;
                                if (callingObjectCodeStr) {
                                  let codeValueJsonArr = this.globalObject.getCodeValueJsonArr(callingObjectCodeStr);
                                  if (codeValueJsonArr && codeValueJsonArr.length > 0) {
                                    for (let codeValue of codeValueJsonArr) {
                                      if (JSON.stringify(codeValue.head).toUpperCase() == JSON.stringify(item.item_name).toUpperCase()) {
                                        item.calling_object_code = codeValue.objectCode;
                                      }
                                    }
                                  }

                                }
                              }
                            }
                            if (tableData[i]['runtime_added_css']) {

                              for (let da of tableData[i]['runtime_added_css']) {
                                let itmN;
                                let css_class;

                                itmN = da.itm.split(",");
                                css_class = da.css
                                if (itmN && (itmN.find(x => x == item.item_name) || itmN == 'ALL') && css_class) {
                                  let obj = JSON.parse(css_class.replaceAll("'", "\""));
                                  item.display_setting_str = item.display_setting_str ? { ...item.display_setting_str, ...obj } : obj;
                                }
                              }
                            }
                          }
                        }
                      }
                      tempRowsArray[i] = frameLevel4;
                      // if(frame.apps_frame_type != 'TABLE'){

                        if (!frame.temp_count || typeof frame.temp_count !== 'function') {
                          frame.temp_count = signal(frame.tableRows.length);
                        }
  
                        frame.temp_count.set(frame.tableRows.length);
                      // }
                      if (i == 0) {
                        this.cdEngine.mark(frame.apps_page_frame_seqid);
                      }
                    }
                  }

                  // this.lhs_lib.refreshFrames[frame.apps_page_frame_seqid] = "Y";
                  // index = batchEnd;
                  // frame.total_no_of_record = tableData.length;
                  // if (index < tableData.length) {

                  //   // Pause execution frame for a microsecond to let Chrome clear memory  buffers
                  //   frame.loading = false
                  //     frame.tableRows = tempRowsArray;
                  //   this.displayChunks(frame, from,"");
                  //   this.ngZone.run(() => {
                  //   if (!frame.temp_count || typeof frame.temp_count !== 'function') {
                  //     frame.temp_count = signal(frame.tableRows.length);
                  //   }

                  //   frame.temp_count.set(frame.tableRows.length);
                  index += batchSize;
                  i++;

                  frame.total_no_of_record = tableData.length;
                  frame.loading = false;
                  if (index < tableData.length) {
                    if (i < 2) {
                     
                        frame.tableRows = tempRowsArray;
                      // if (frame.apps_frame_type != 'TABLE') {
                        this.displayChunks(frame, from, i <= 1);
                      //  }
                    } else if (i > 4) {
                      batchSize = 100;
                    }

                    this.ngZone.run(() => {
                      if (!frame.temp_count || typeof frame.temp_count !== 'function') {
                        frame.temp_count = signal(frame.tableRows.length);
                      }

                      frame.temp_count.set(frame.tableRows.length);
                      // this.cdEngine.mark(frame.apps_page_frame_seqid)
                    });

                    // frame.temp_count = frame.tableRows.length;
                    // processBatch();


                    // this.cdEngine.mark(frame.apps_page_frame_seqid)


                    // frame.temp_count = frame.tableRows.length;
                    // processBatch();
                    this.lhs_lib.refreshFrames[frame.apps_page_frame_seqid] = "Y";
                    setTimeout(processBatch, 0);
                    if (i <= 1) {
                      this.cdEngine.mark(frame.apps_page_frame_seqid);
                    }

                  } else {

                    stopSubscription.unsubscribe();
                    // 4. CRITICAL: Re-enter Angular context exactly ONCE when all calculations finish
                    this.ngZone.run(() => {
                      delete frame['temp_count'];
                      if (frame.apps_frame_type == 'CHART') {
                        this.amChartData(tableData, frame);
                      } else {
                        // if (frame.apps_frame_type != 'TABLE') {
                          frame.tableRows = tempRowsArray;
                        // if (frame.apps_frame_type != 'TABLE') {
                          this.afterTableRows(frame, from, to, pageNo);
                        // }
                        // }
                      }
                      frame.loading = false
                      // tempRowsArray.slice();
                      this.cdEngine.mark(frame.apps_page_frame_seqid);
                      tempRowsArray = null;
                      cachedScriptCode = '';
                      // tableData.slice();
                      tableData = null;
                      if (this.globalObject.logFlag) {
                        let ws_type = "get data";
                        // this.lhs_lib.get_event_log_obj("processing frame data", frame.apps_page_frame_seqid, null, frame.object_code, "end",ws_type);
                        let log_name = `populateRows ${frameSeq}`;
                        let status = "end";
                        this.lhs_lib.end();
                        this.lhs_lib.get_event_log_objs("processing frame data", frame.apps_page_frame_seqid, null, frame.object_code, status, ws_type, log_name);
                      }
                      resolve();
                    });
                  }
                } catch (e) {
                  this.ngZone.run(() => {
                    frame.loading = false;

                    stopSubscription.unsubscribe();
                    this.cdEngine.mark(frame.apps_page_frame_seqid);
                    console.log(e);
                  })
                }
              };
              // Kick off processing queue asynchronously
              setTimeout(processBatch, 0);
            });
          }
        }
      } catch (error) {
        reject(error);
      }
      // Placeholder definitions to keep compiler happy if defined down in the same class

    });
  }




  // afterTableRows(frame, from?, to?, pageNo?, dont_set_active?) {

  //   if (frame.tableRows) { } else {
  //     frame.tableRows = [];
  //   }

  //   if (!frame.Level4 || frame.Level4.length < 1) {
  //     frame.Level4 = this.lhs_lib.get_ass_Level4(frame.apps_page_frame_seqid);
  //   }


  //   if (!from && !to) {
  //     from = 0;
  //     if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE') {
  //       to = frame.display_no_of_records ? frame.display_no_of_records : 50;
  //       frame.page_no = 1;
  //       frame.active_row = dont_set_active ? frame.active_row : 0;
  //       frame.total_Pages = frame.searchableData ? Math.ceil(frame.searchableData.length / to) : (frame.tableRows && frame.tableRows.length > 0 ? Math.ceil(frame.tableRows.length / to) : 0);
  //       // frame.total_Pages = frame.searchableData ? Math.ceil(frame.searchableData.length / to) : (frame.tableData && frame.tableData.length > 0 ? Math.ceil(frame.tableData.length / to) : 0);
  //       frame.total_Pages = isNaN(frame.total_Pages) ? 1 : frame.total_Pages;
  //     } else {
  //       to = (frame.tableData && frame.tableData.length > 0 && frame.tableData.length > frame.tableRows.length) ? frame.tableData.length : frame.tableRows.length;
  //     }
  //   }

  //   frame.from_record = from;
  //   frame.to_record = to;

  //   // if (frame.apps_frame_type == 'TABLE' && frame.display_no_of_records) {
  //   //   if (parseInt(frame.display_no_of_records) >= 10) {
  //   //     frame.tableHeight = { 'height': '333px', 'max-height': '333px', 'min-height': '333px' };
  //   //   } else if (parseInt(frame.display_no_of_records) < 10) {
  //   //     frame.tableHeight = { 'height': '200px', 'max-height': '200px', 'min-height': '200px' };
  //   //   }
  //   // }
  //   if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE' || (frame.temp_frame_type && frame.temp_frame_type == "ENTRY_TABLE")) {
  //     let extra_count = 0;

  //     if (frame.display_no_of_records && parseInt(frame.display_no_of_records) > frame.tableRows.length && (frame.Level4 && frame.Level4.length > 0)) {
  //       frame.to_record = frame.display_no_of_records;
  //       let len = parseInt(frame.display_no_of_records) - frame.tableRows.length;


  //       let level4 = JSON.parse(JSON.stringify(frame.Level4));

  //       for (let i = 0; i < len; i++) {
  //         let rows = JSON.parse(JSON.stringify(level4));
  //         for (let itemGroup of rows) {
  //           for (let item of itemGroup.Level5) {
  //             item.item_enable_flag = 'F';
  //             item.extra_record = true;
  //             if (item.item_name == 'WMA_RECORD_STATUS') {
  //               delete item['frame_status'];
  //               if (item.item_visible_flag == "T") {
  //                 console.log("Table level4", item)
  //               }

  //               // item.item_name=''
  //             }
  //             item.item_default_value = '';
  //             item.value = '';

  //             if (item.display_setting_str) {
  //               let obj = item.display_setting_str;
  //               try {
  //                 obj = JSON.parse(obj);
  //               } catch {
  //                 obj = obj;
  //               }

  //               if (obj) {
  //                 obj["min-height"] = "22px";
  //                 obj["height"] = "26px";
  //               }
  //               item.display_setting_str = obj;
  //             } else {
  //               let obj: any = {};
  //               obj["min-height"] = "22px";
  //               obj["height"] = "26px";
  //               item.display_setting_str = obj;
  //             }
  //           }
  //         }
  //         frame.tableRows.push(rows);
  //       }
  //     }

  //     frame.extra_record_count = this.count_extra_record(frame.apps_page_frame_seqid);

  //     if ((frame.apps_frame_type == 'ENTRY_TABLE' || (frame.temp_frame_type && frame.temp_frame_type == "ENTRY_TABLE")) && (!frame.tableRows || frame.tableRows.length <= 0) && (frame.Level4 && frame.Level4.length > 0)) {
  //       frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
  //     }
  //   } else {
  //     frame.active_row = 0;
  //   }

  //   // if (!frame.summary_rows) {
  //   //   this.getSummaryRow(frame);
  //   // }
  //   this.calculateTableRows(frame);
  //   this.lhs_lib.getSepratorGrp(frame);

  //   if (!frame.searchableData) {
  //     this.lhs_lib.setItemCount(frame.tableRows);
  //   }

  //   if (!dont_set_active) {

  //     // if (frame.apps_frame_sub_type == 'JSON') {
  //     //   frame.active_row = null;
  //     // } else 
  //     if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE' || (frame.temp_frame_type && frame.temp_frame_type == "ENTRY_TABLE")) {

  //       let tableRows = frame.searchableData ? frame.searchableData : frame.tableRows;

  //       if (frame.active_row != undefined && (frame.active_row <= frame.tableRows.length) && !frame.searchableData) {
  //         frame.active_row = frame.active_row == frame.tableRows.length ? frame.active_row - 1 : frame.active_row;


  //       } else if (frame.searchableData) {
  //         if (tableRows && tableRows.length > 0) {
  //           let activeRow = tableRows[from ?? 0][0]
  //           if (activeRow.Level5.length > 0) {
  //             frame.active_row = activeRow.Level5[0].indexcount;
  //           }
  //         }
  //       } else {
  //         if (tableRows && tableRows.length > 0) {
  //           for (let itemGrp of tableRows[0]) {
  //             if (itemGrp.Level5.length > 0) {
  //               frame.active_row = itemGrp.Level5[0].indexcount;
  //               break;
  //             }
  //           }
  //         }
  //       }
  //     }

  //   }

  //   if (frame.tempRows && frame.tempRows.length > 0) {

  //     if (frame.edit_record_index != undefined) {
  //       frame.total_no_of_record = frame.tempRows.length;
  //     } else {

  //       let count = 0;
  //       // let itm = this.lhs_lib.get_rows_item(frame.tableRows[0], 'WMA_RECORD_STATUS');
  //       let itm = this.lhs_lib.check_row_dirty(null, frame.tableRows[0]);
  //       if (itm && itm.frame_status && itm.frame_status.toLowerCase() == 'dirty') {
  //         count = frame.tableRows.length
  //       }
  //       // let tempitm = this.lhs_lib.get_rows_item(frame.tempRows[0], 'WMA_RECORD_STATUS');
  //       let tempitm = this.lhs_lib.check_row_dirty(null, frame.tempRows[0]);
  //       if (tempitm && tempitm.frame_status && tempitm.frame_status.toLowerCase() == 'dirty') {
  //         // frame.total_no_of_record = frame.tempRows.length + 1;
  //         // count=frame.tableRows.length
  //         count = frame.tempRows.length + count
  //       } 

  //       frame.total_no_of_record = count
  //     }
  //     // else {
  //     //   let itm = this.lhs_lib.get_rows_item(frame.tableRows[0], 'WMA_RECORD_STATUS');
  //     //   let count = 0
  //     //   if (itm && itm.frame_status && itm.frame_status.toLowerCase() == 'dirty') {
  //     //     // frame.total_no_of_record = frame.tempRows.length + 1;
  //     //     count = frame.tableRows.length
  //     //     // frame.total_no_of_record=frame.tableRows.length
  //     //   }

  //     //   // else {
  //     //   //   frame.total_no_of_record = frame.tempRows.length;
  //     //   // }

  //     //   let tempitm = this.lhs_lib.get_rows_item(frame.tempRows[0], 'WMA_RECORD_STATUS');
  //     //   if (tempitm && tempitm.frame_status && tempitm.frame_status.toLowerCase() == 'dirty') {
  //     //     // frame.total_no_of_record = frame.tempRows.length + 1;
  //     //     // count=frame.tableRows.length
  //     //     count = frame.tempRows.length + count
  //     //   }

  //     //   frame.total_no_of_record = count
  //     // }




  //     frame.records_per_page = frame.display_no_of_records ? frame.display_no_of_records : 50;
  //     frame.records_on_current_page = frame.tempRows.length;
  //     frame.count_of_pages = 1;
  //     frame.current_page_no = frame.page_no;
  //     frame.current_page_first_record = 1;
  //     frame.current_page_last_record = frame.total_no_of_record;

  //   } else {
  //     frame.total_no_of_record = frame.tableRows.length - (frame.extra_record_count ?? 0);
  //     if (frame.tableRows && frame.tableRows.length > 0 && frame.total_no_of_record == 1) {
  //       // let itm = this.lhs_lib.get_rows_item(frame.tableRows[0], 'WMA_RECORD_STATUS');
  //       let itm = this.lhs_lib.check_row_dirty(null, frame.tableRows[0]);
  //       if (itm && (!itm.frame_status || itm.frame_status.toLowerCase() != 'dirty')) {
  //         frame.total_no_of_record = 0;
  //       }
  //     }

  //     this.lhs_lib.set_frame_indexes(frame);
  //   }


  //   if (frame.apps_frame_sub_type != 'JSON') {
  //     if (frame.tableRows && frame.tableRows.length > 0) {
  //       for (let dataRow of frame.tableRows[frame.active_row]) {
  //         if (dataRow.Level5) {
  //           for (let r of dataRow.Level5) {
  //             if (r.mirrored_items) {
  //               this.lhs_lib.set_mirror_values(r);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return;
  // }

  afterTableRows(frame, from?, to?, pageNo?, dont_set_active?) {

    if (frame.tableRows) { } else {
      frame.tableRows = [];
    }

    if (!frame.Level4 || frame.Level4.length < 1) {
      frame.Level4 = this.lhs_lib.get_ass_Level4(frame.apps_page_frame_seqid);
    }


    if (!from && !to) {
      from = 0;
      if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE') {
        to = frame.display_no_of_records ? frame.display_no_of_records : 50;
        frame.page_no = 1;
        frame.active_row = dont_set_active ? frame.active_row : 0;
        frame.total_Pages = frame.searchableData ? Math.ceil(frame.searchableData.length / to) : (frame.tableRows && frame.tableRows.length > 0 ? Math.ceil(frame.tableRows.length / to) : 0);
        // frame.total_Pages = frame.searchableData ? Math.ceil(frame.searchableData.length / to) : (frame.tableData && frame.tableData.length > 0 ? Math.ceil(frame.tableData.length / to) : 0);
        frame.total_Pages = isNaN(frame.total_Pages) ? 1 : frame.total_Pages;
      } else {
        to = (frame.tableData && frame.tableData.length > 0 && frame.tableData.length > frame.tableRows.length) ? frame.tableData.length : frame.tableRows.length;
      }
    }

    frame.from_record = from;
    frame.to_record = to;

    if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE' || (frame.temp_frame_type && frame.temp_frame_type == "ENTRY_TABLE")) {
      let extra_count = 0;
      let getlevel4 = frame.apexFrameLevel4 ??  frame?.Level4;
      if (frame.display_no_of_records && parseInt(frame.display_no_of_records) > frame.tableRows.length && (getlevel4.length > 0)) {
        frame.to_record = frame.display_no_of_records;
        let len = parseInt(frame.display_no_of_records) - frame.tableRows.length;


        let level4 = JSON.parse(JSON.stringify(getlevel4));

        for (let itemGroup of level4) {
          for (let item of itemGroup.Level5) {
            item.item_enable_flag = 'F';
            item.extra_record = true;
            delete item['frame_status'];

            item.item_default_value = '';
            item.value = '';

            if (item.display_setting_str) {
              let obj = item.display_setting_str;
              try {
                obj = JSON.parse(obj);
              } catch {
                obj = obj;
              }

              if (obj) {
                obj["min-height"] = "22px";
                obj["height"] = "26px";
              }
              item.display_setting_str = obj;
            } else {
              let obj: any = {};
              obj["min-height"] = "22px";
              obj["height"] = "26px";
              item.display_setting_str = obj;
            }
          }
        }

        for (let i = 0; i < len; i++) {
          let rows = level4;
          frame.tableRows.push(JSON.parse(JSON.stringify(rows)));
        }
      }

      frame.extra_record_count = this.count_extra_record(frame);

      if (((frame.apps_frame_type == 'ENTRY_TABLE' || (frame.temp_frame_type && frame.temp_frame_type == "ENTRY_TABLE")) && (!frame.tableRows || frame.tableRows.length <= 0) && (frame.Level4 && frame.Level4.length > 0)) || (frame.apps_frame_type == 'ENTRY_TABLE' && frame.extra_record_count && frame.extra_record_count == frame.tableRows.length)) {
        frame.tableRows[0] = JSON.parse(JSON.stringify(getlevel4));
      }
    } else {
      frame.active_row = 0;
    }

    // if (!frame.summary_rows) {
    //   this.getSummaryRow(frame);
    // }
    // this.calculateTableRows(frame);
    this.lhs_lib.calculateFrames[frame.apps_page_frame_seqid] = "Y";
    this.lhs_lib.getSepratorGrp(frame);

    if (!frame.searchableData) {
      this.lhs_lib.setItemCount(frame.tableRows, frame.apps_page_frame_seqid);
    }

    if (!dont_set_active) {

      // if (frame.apps_frame_sub_type == 'JSON') {
      //   frame.active_row = null;
      // } else 
      if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE' || (frame.temp_frame_type && frame.temp_frame_type == "ENTRY_TABLE")) {

        let tableRows = frame.searchableData ? frame.searchableData : frame.tableRows;

        if (frame.active_row != undefined && (frame.active_row <= frame.tableRows.length) && !frame.searchableData) {
          frame.active_row = frame.active_row == frame.tableRows.length ? frame.active_row - 1 : frame.active_row;


        } else if (frame.searchableData) {
          if (tableRows && tableRows.length > 0) {
            let activeRow = tableRows[from ?? 0][0]
            if (activeRow.Level5.length > 0) {
              frame.active_row = activeRow.Level5[0].indexcount;
            }
          }
        } else {
          if (tableRows && tableRows.length > 0) {
            for (let itemGrp of tableRows[0]) {
              if (itemGrp.Level5.length > 0) {
                frame.active_row = itemGrp.Level5[0].indexcount;
                break;
              }
            }
          }
        }
      }

    }

    if (frame.tempRows && frame.tempRows.length > 0) {

      if (frame.edit_record_index != undefined || frame.indexStr != undefined) {
        frame.total_no_of_record = frame.tempRows.length;
      } else {
        // let itm = this.lhs_lib.get_rows_item(frame.tableRows[0], 'WMA_RECORD_STATUS');
        let itm = this.lhs_lib.check_row_dirty(null, frame.tableRows[0]);
        let count = 0
        if (itm && itm.frame_status && itm.frame_status.toLowerCase() == 'dirty') {
          // frame.total_no_of_record = frame.tempRows.length + 1;
          count = frame.tableRows.length
          // frame.total_no_of_record=frame.tableRows.length
        }

        // else {
        //   frame.total_no_of_record = frame.tempRows.length;
        // }

        // let tempitm = this.lhs_lib.get_rows_item(frame.tempRows[0], 'WMA_RECORD_STATUS');
        let tempitm = this.lhs_lib.check_row_dirty(null, frame.tempRows[0]);
        if (tempitm && tempitm.frame_status && tempitm.frame_status.toLowerCase() == 'dirty') {
          // frame.total_no_of_record = frame.tempRows.length + 1;
          // count=frame.tableRows.length
          count = frame.tempRows.length + count
        }

        frame.total_no_of_record = count
      }

      frame.records_per_page = frame.display_no_of_records ? frame.display_no_of_records : 50;
      frame.records_on_current_page = frame.tempRows.length;
      frame.count_of_pages = 1;
      frame.current_page_no = frame.page_no;
      frame.current_page_first_record = 1;
      frame.current_page_last_record = frame.total_no_of_record;

    } else {
      frame.total_no_of_record = frame.tableRows.length - (frame.extra_record_count ?? 0);
      if (frame.tableRows && frame.tableRows.length > 0 && frame.total_no_of_record == 1) {
        // let itm = this.lhs_lib.get_rows_item(frame.tableRows[0], 'WMA_RECORD_STATUS');
        let itm = this.lhs_lib.check_row_dirty(null, frame.tableRows[0]);

        if (itm && (!itm.frame_status || itm.frame_status.toLowerCase() != 'dirty')) {
          frame.total_no_of_record = 0;
        }
      }

      this.lhs_lib.set_frame_indexes(frame);
    }


    if (frame.apps_frame_sub_type != 'JSON') {
      if (frame.tableRows && frame.tableRows.length > 0 && frame.tableRows[frame.active_row]) {
        for (let dataRow of frame.tableRows[frame.active_row]) {
          if (dataRow.Level5) {
            for (let r of dataRow.Level5) {
              if (r.mirrored_items) {
                this.lhs_lib.set_mirror_values(r);
              }
            }
          }
        }
      }
    }

    this.lhs_lib.refreshFrames[frame.apps_page_frame_seqid] = "Y";
    // this.cdEngine.detect(frame.apps_page_frame_seqid);
    return;
  }

  count_extra_record(frame) {
    // let frame = this.lhs_lib.get_frame_config(frameName);
    let count = 0;

    // let rev_row = JSON.parse
    if (frame && frame.tableRows) {
      for (let i = frame.tableRows.length - 1; i >= 0; i--) {
        let rows = frame.tableRows[i];
        let flag = false;
        for (let itemGroup of rows) {
          for (let item of itemGroup.Level5) {
            if (item && item.extra_record) {
              count++;
              flag = true;
              break;
            } else {
              return count;
            }
          }
          if (flag) {
            break;
          }
        }
      }
    }
    return count;
  }


  summCardRows(tableData, frame) {
    if (!tableData) { return };

    let tableRows = [];
    let tableKey = Object.keys(tableData[0])
    for (let table of tableData) {
      let frameLevel4 =frame.apexFrameLevel4 ? JSON.parse(JSON.stringify(frame.apexFrameLevel4)):JSON.parse(JSON.stringify(frame.Level4))
      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          for (let key of tableKey) {
            if (item.item_name && item.item_name.toUpperCase() == key.toUpperCase()) {
              item.value = table[key];
              if (item.value && item.value.indexOf("@") > -1) {
                item.prompt_name = item.value.split("@")[0];
                item.value = item.value.split("@")[1];
              }
            }
          }
        }
      }
      tableRows.push(frameLevel4);
    }
    return tableRows;
  }


  addToCart(tableData, frame) {

    let tableRows = [];

    if (tableData && tableData.length > 0) {
      let tableKey = Object.keys(tableData[0]);
      for (let table of tableData) {
        let frameLevel4 =frame.apexFrameLevel4 ? JSON.parse(JSON.stringify(frame.apexFrameLevel4)): JSON.parse(JSON.stringify(frame.Level4))
        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if (item.item_name.toUpperCase() == key.toUpperCase()) {
                item.value = table[key]
              }
              if (item.item_name == 'AQTYORDER') {
                item.addBtn = true;
              }
            }
          }
        }
        tableRows.push(frameLevel4);
      }

      return tableRows = tableRows;

    }
  }


  // searchAllData(frame) {

  //   delete frame['headerarr'];
  //   delete frame['footerArr'];
  //   delete frame['cardRightArray'];
  //   delete frame['cardLeftArray'];

  //   frame.tableRows = [];
  //   frame.canvasRows = [];

  //   if (frame.item_search_flag) {
  //     return this.filterColumn(frame);
  //   } else {

  //     let vals = [];
  //     return vals = this.pipemy.transform(frame.tableData, frame.search);

  //   }

  // }

  searchAllData(frame, flag?) {

    // delete frame['headerarr'];
    // delete frame['footerArr'];
    // delete frame['cardRightArray'];
    // delete frame['cardLeftArray'];

    // frame.tableRows = [];
    frame.canvasRows = [];

    if (frame.item_search_flag) {
      return this.filterColumn(frame);
    } else {

      let vals = [];
      if (frame.search) {
        if (!flag) {
          vals = this.pipemy.transform(frame.tableRows, frame.search);
          frame.searchableData = vals;
        }
        if (frame.apps_frame_type == 'CARD' || flag) {
          vals = this.pipemyRaw.transform(frame.tableData, frame.search);
          delete frame['searchableData'];
        }
        frame.active_row = undefined;
      } else {
        delete frame['searchableData'];
        vals = frame.tableRows;

        if (frame.apps_frame_type == 'CARD' || flag) {
          vals = frame.tableData;
        }
      }
      return vals;

    }

  }

  // filterColumn(frame) {

  //   delete frame['headerarr'];
  //   delete frame['footerArr'];
  //   delete frame['cardRightArray'];
  //   delete frame['cardLeftArray'];



  //   let flag = false;
  //   let fillData = [];
  //   let data = [];
  //   if (frame.searchableData) {
  //     data = frame.searchableData;
  //   } else {
  //     data = frame.tableData;
  //   }
  //   if (frame.search) {
  //     flag = true;
  //     fillData = this.pipemy.transform(frame.tableData, frame.search);
  //   } else {
  //     fillData = frame.tableData;
  //   }

  //   for (let itemGroup of frame.headers) {
  //     for (let input_item of itemGroup.Level5) {
  //       if (input_item.search) {
  //         let val = input_item.search.replaceAll("%", "");
  //         if (val) {
  //           flag = true;
  //           // fillData = fillData.filter(x => x[input_item.item_name] && x[input_item.item_name].toLowerCase().includes(input_item.search.toLowerCase()));
  //           fillData = this.colFilter.transform(fillData, input_item.item_name, input_item.search);
  //         }
  //       }
  //       if (input_item.containerRowss && input_item.containerRowss.length > 0) {
  //         for (let cGrp of input_item.containerRowss) {
  //           for (let cItem of cGrp.Level5) {
  //             if (cItem.search) {
  //               let val = cItem.search.replaceAll("%", "");
  //               if (val) {
  //                 flag = true;
  //                 // fillData = fillData.filter(x => x[input_item.item_name] && x[input_item.item_name].toLowerCase().includes(input_item.search.toLowerCase()));
  //                 fillData = this.colFilter.transform(fillData, cItem.item_name, cItem.search);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (fillData || flag) {
  //   } else {
  //     fillData = [];
  //   }

  //   if (flag) {
  //     frame.tableRows = [];
  //     frame.canvasRows = [];
  //     delete frame['noFilter'];
  //     frame.searchableData = fillData;
  //   } else {
  //     delete frame['searchableData'];
  //     frame.noFilter = true;
  //   }
  //   return fillData;

  // }

  filterColumn(frame, dont_set_active?) {
    let flag = false;
    let fillData = [];
    let fillRawData = [];
    let data = [];
    if (frame.searchableData) {
      data = frame.searchableData;
    } else {
      data = frame.tableData ? JSON.parse(JSON.stringify(frame.tableData)) : [];
    }
    if (frame.search) {
      flag = true;
      fillData = this.pipemy.transform(frame.tableRows, frame.search);
      fillRawData = this.pipemyRaw.transform(data, frame.search);
    } else {
      fillData = frame.tableRows;
      fillRawData = frame.tableData ? JSON.parse(JSON.stringify(frame.tableData)) : [];
    }

    for (let itemGroup of frame.headers) {
      for (let input_item of itemGroup.Level5) {
        if (input_item.search) {
          let val = input_item.search.replaceAll("%", "");
          if (val) {
            flag = true;
            // fillData = fillData.filter(x => x[input_item.item_name] && x[input_item.item_name].toLowerCase().includes(input_item.search.toLowerCase()));
            fillData = this.colFilter.transform(fillData, input_item.item_name, input_item.search);
            fillRawData = this.colRawFilter.transform(fillRawData, input_item.item_name, input_item.search);
          }
        }
        if (input_item.containerRowss && input_item.containerRowss.length > 0) {
          for (let cGrp of input_item.containerRowss) {
            for (let cItem of cGrp.Level5) {
              if (cItem.search) {
                let val = cItem.search.replaceAll("%", "");
                if (val) {
                  flag = true;
                  // fillData = fillData.filter(x => x[input_item.item_name] && x[input_item.item_name].toLowerCase().includes(input_item.search.toLowerCase()));
                  fillData = this.colFilter.transform(fillData, cItem.item_name, cItem.search);
                  fillRawData = this.colRawFilter.transform(fillRawData, input_item.item_name, input_item.search);
                }
              }
            }
          }
        }
      }
    }
    if (fillData || flag) { } else {
      fillData = frame.tableRows;
      fillRawData = frame.tableData ? JSON.parse(JSON.stringify(frame.tableData)) : [];;
    }

    if (flag) {
      // frame.tableRows = [];
      frame.canvasRows = [];
      delete frame['noFilter'];
      frame.searchableData = fillData;
      frame.searchableRawData = fillRawData;
      if (!dont_set_active) frame.active_row = undefined;
    } else {
      delete frame['searchableData'];
      delete frame['searchableRawData'];
      frame.noFilter = true;
    }

    this.afterTableRows(frame, undefined, undefined, undefined, dont_set_active);

    // let str = "";
    // if (frame.on_frame_load_str && frame.on_frame_load_str.indexOf('execute_json') > -1) {
    //   let strArr = frame.on_frame_load_str.split(";");
    //   for (let s of strArr) {
    //     if (s && s.toLowerCase().indexOf('execute_json') > -1 && s.toLowerCase().indexOf('no_relation') < 0) {
    //       if (str) {
    //         str = str + ";" + s;
    //       } else {
    //         str = s;
    //       }
    //     }
    //   }
    // }
    // if (str) {
    //   frame.relational_string = str;
    // }
    return fillRawData;

  }


  // multiFilter(frame, selectedCol) {
  //   let flag = false;
  //   let fillData = [];
  //   let fillRawData = [];
  //   let data = [];
  //   if (frame.searchableData) {
  //     data = frame.searchableData;
  //   } else {
  //     data = JSON.parse(JSON.stringify(frame.tableData));
  //   }
  //   if (frame.searchableData) {
  //     fillData = frame.searchableData;
  //     fillRawData = JSON.parse(JSON.stringify(frame.searchableRawData));
  //   } else {
  //     fillData = frame.tableRows;
  //     fillRawData = JSON.parse(JSON.stringify(frame.tableData));
  //   }



  //   // for (let itemGroup of frame.headers) {
  //   let afillData = []
  //   let afillRawData = []
  //   let aFlag = false
  //   for (let input_item of selectedCol) {
  //     let afillDataCol = this.colFilter.transform(fillData, input_item.item_name, input_item.search);
  //     let afillRawDataCol = this.colRawFilter.transform(fillRawData, input_item.item_name, input_item.search);
  //     afillData = [...afillData, ...afillDataCol]
  //     afillRawData = ([...afillRawData, ...afillRawDataCol])
  //     flag = true
  //     aFlag = true

  //     // if (input_item.containerRowss && input_item.containerRowss.length > 0) {
  //     //   for (let cGrp of input_item.containerRowss) {
  //     //     for (let cItem of cGrp.Level5) {
  //     //       if (cItem.search) {
  //     //         let val = cItem.search.replaceAll("%", "");
  //     //         if (val) {
  //     //           flag = true;
  //     //           // fillData = fillData.filter(x => x[input_item.item_name] && x[input_item.item_name].toLowerCase().includes(input_item.search.toLowerCase()));
  //     //           fillData = this.colFilter.transform(fillData, cItem.item_name, cItem.search);
  //     //           fillRawData = this.colRawFilter.transform(fillRawData, input_item.item_name, input_item.search);
  //     //         }
  //     //       }
  //     //     }
  //     //   }
  //     // }
  //     // }
  //   }
  //   if (aFlag) {
  //     fillData = afillData
  //     fillRawData = afillRawData
  //   }

  //   if (fillData || flag) { } else {
  //     fillData = frame.tableRows;
  //     fillRawData = JSON.parse(JSON.stringify(frame.tableData));
  //   }

  //   if (flag) {
  //     // frame.tableRows = [];
  //     frame.canvasRows = [];
  //     delete frame['noFilter'];
  //     frame.searchableData = fillData;
  //     frame.searchableRawData = fillRawData;
  //     frame.active_row = undefined;
  //   } else {
  //     delete frame['searchableData'];
  //     delete frame['searchableRawData'];
  //     frame.noFilter = true;
  //   }



  // }
  multiFilter(frame) {
    let flag = false;
    let fillData = [];
    let fillRawData = [];
    // if(frame.searchableData && !frame.isColResent){
    //   fillData = frame.searchableData;
    //   fillRawData = JSON.parse(JSON.stringify(frame.searchableRawData));
    // }else{
    fillData = frame.tableRows;
    fillRawData = JSON.parse(JSON.stringify(frame.tableData));
    // }
    if (frame.isColResent) {
      delete frame['isColResent']
    }
    let selectedCol = frame.SelectedColFilter ? frame.SelectedColFilter : []
    let cols = []
    for (let col of frame.SelectedColFilter) {
      cols = [...new Set([...cols, col.item_name])]
    }
    let afillData = []
    let afillRawData = []
    let aFlag = false
    for (let col of cols) {
      let atableRows = []
      let atableData = []
      for (let input_item of selectedCol) {
        if (col == input_item.item_name) {
          if (afillData.length > 0) {
            let afillDataCol = this.colFilter.transform(afillData, input_item.item_name, input_item.value);
            let afillRawDataCol = this.colRawFilter.transform(afillRawData, input_item.item_name, input_item.value);
            atableRows = [...atableRows, ...afillDataCol]
            atableData = ([...atableData, ...afillRawDataCol])
          } else {
            let afillDataCol = this.colFilter.transform(fillData, input_item.item_name, input_item.value);
            let afillRawDataCol = this.colRawFilter.transform(fillRawData, input_item.item_name, input_item.value);
            atableRows = [...atableRows, ...afillDataCol]
            atableData = ([...atableData, ...afillRawDataCol])
          }

          flag = true
          aFlag = true
        }
      }
      afillData = atableRows
      afillRawData = atableData
    }
    if (aFlag) {
      fillData = afillData
      fillRawData = afillRawData
    }

    if (fillData || flag) { } else {
      fillData = frame.tableRows;
      fillRawData = JSON.parse(JSON.stringify(frame.tableData));
    }

    if (flag) {
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

  amChartData(tableData, frame) {
    let tableRows = [];
    let tableKey = [];
    frame.chartData = [];

    if (tableData.length > 0) {
      tableKey = Object.keys(tableData[0]);
    }

    for (let table of tableData) {
      let obj: any = {}
      let frameLevel4 = frame.apexFrameLevel4 ? JSON.parse(JSON.stringify(frame.apexFrameLevel4)) : JSON.parse(JSON.stringify(frame.Level4));

      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          for (let key of tableKey) {
            if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase()) && (item.item_visible_flag == 'T')) {
              item.value = table[key];

              if (item.datatype == 'NUMBER') {
                obj[item.item_name] = item.value ? parseFloat(item.value) : 0;
              } else {
                obj[item.item_name] = item.value;
              }

              if ((item.item_name.indexOf("X") > -1) || (item.item_name.indexOf("Y") > -1) || (item.item_name.indexOf("D") > -1)) {

                if (item.item_default_value) {
                  if ((item.item_default_value.toLowerCase().indexOf("avg") > -1) || (item.item_default_value.toLowerCase().indexOf("sum") > -1)) {

                    let str = item.item_default_value.toUpperCase().split("(")[1].split(")")[0].replaceAll("'", "");
                    let name = this.lhs_lib.get_item(str, 0);

                    if (item.item_name == "Y1") {
                      obj["Y1_label"] = name.prompt_name;
                    } else if (item.item_name == "Y2") {
                      obj["Y2_label"] = name.prompt_name;
                    } else if (item.item_name == "Y3") {
                      obj["Y3_label"] = name.prompt_name;
                    } else if (item.item_name == "Y4") {
                      obj["Y4_label"] = name.prompt_name;
                    }

                  } else {
                    let name = this.lhs_lib.get_item(item.item_default_value, 0);
                    if (item.item_name == "X1") {
                      obj["X1_label"] = name.prompt_name;
                    } else if (item.item_name == "X2") {
                      obj["X2_label"] = name.prompt_name;
                    } else if (item.item_name == "X3") {
                      obj["X3_label"] = name.prompt_name;
                    } else if (item.item_name == "X4") {
                      obj["X4_label"] = name.prompt_name;
                    } else if (item.item_name == "D1") {
                      obj["D1_label"] = name.prompt_name;
                    } else if (item.item_name == "D2") {
                      obj["D2_label"] = name.prompt_name;
                    }
                  }
                } else {

                  if (item.item_name == "Y1") {
                    obj["Y1_label"] = item.prompt_name;
                  } else if (item.item_name == "Y2") {
                    obj["Y2_label"] = item.prompt_name;
                  } else if (item.item_name == "Y3") {
                    obj["Y3_label"] = item.prompt_name;
                  } else if (item.item_name == "Y4") {
                    obj["Y4_label"] = item.prompt_name;
                  } else if (item.item_name == "X1") {
                    obj["X1_label"] = item.prompt_name;
                  } else if (item.item_name == "X2") {
                    obj["X2_label"] = item.prompt_name;
                  } else if (item.item_name == "X3") {
                    obj["X3_label"] = item.prompt_name;
                  } else if (item.item_name == "X4") {
                    obj["X4_label"] = item.prompt_name;
                  } else if (item.item_name == "D1") {
                    obj["D1_label"] = item.prompt_name;
                  } else if (item.item_name == "D2") {
                    obj["D2_label"] = item.prompt_name;
                  }

                }
              }
            }
          }
        }
      }
      tableRows.push(frameLevel4);
      frame.chartData.push(obj);
    }
    return tableRows;

  }



  getSummaryRow(frame) {
    let funArr = [];
    for (let itemGroup of frame.Level4) {
      for (let item of itemGroup.Level5) {
        if (item.summary_flag) {
          frame.summary_flag = true;
          let summFlag = item.summary_flag.includes("#") ? item.summary_flag.split("#")[0] : item.summary_flag;
          let decimal = item.summary_flag.includes("#") ? item.summary_flag.split("#")[1] : 0;

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

    if (funArr.length > 0 && frame.tableData) {
      let data = this.calculateData(frame.tableData, funArr);

      if (data) {
        let tableKey = Object.keys(data);
        let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));

        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if (item.item_name.toUpperCase() == key.toUpperCase()) {
                item.summaryValue = data[key]
              }
            }
          }
        }

        let tableRows = [];
        tableRows[0] = frameLevel4
        if (frame.apps_frame_type == 'HORIZONTAL_TABLE') {
          let data = this.lhs_lib.seprateData(frame, tableRows)
          frame.summary_rows = this.globalObject.transpose(data);
        } else {
          frame.summary_rows = this.lhs_lib.seprateData(frame, tableRows)[0];
        }
      }
    }
  }


  calculateTableRows(frame) {

    let tableRows = frame.tableRows;

    if (frame.searchableData) {
      tableRows = frame.searchableData;
    }
    let summ_item = []
    if (tableRows && tableRows.length > 0) {
      let dataObj = {};
      let flag = false;
      let funArr = [];
      let level4
      if (frame.apexFrameLevel4 && frame.apexFrameLevel4.length > 0) {
        level4 =JSON.parse(JSON.stringify(frame.apexFrameLevel4));
      } else {
        level4 = frame.Level4;
      }
      // = JSON.parse(JSON.stringify(frame.Level4));
      for (let itemGroup of level4) {
        for (let item of itemGroup.Level5) {
          if (item.summary_flag) {
            let summFlag = item.summary_flag.includes("#") ? item.summary_flag.split("#")[0] : item.summary_flag;
            let decimal = item.summary_flag.includes("#") ? item.summary_flag.split("#")[1] : 0;
            if (summFlag == 'S' || summFlag == 'A' || summFlag == 'C' || summFlag == 'M' || summFlag == 'X' || summFlag.includes('W(')) {
              frame.summary_flag = true;
              let obj = {
                fun: summFlag,
                decimal: decimal,
                dataType: item.datatype,
                item_name: item.item_name.toUpperCase()
              }
              funArr.push(obj);
            }

          }
          if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE' || frame.apps_frame_type == 'HORIZONTAL_TABLE') {
            if (item.item_name.toLowerCase().startsWith("sum_")) {
              summ_item.push(item.item_name)
            }
          }

        }
      }

      const w = (itm) => {
        return itm;
      }

      if (funArr.length > 0) {
        // let sumVal = 0;
        // let avgVal = 0;
        // let avgCount = 0;
        // let minArr = [];
        // let maxArr = [];
        // let countVal = 0;

        let obj = {};
        for (let tabledata of tableRows) {
          for (let f of funArr) {

            let itmArr = [];
            if (f.fun && f.fun.toUpperCase().includes("W(")) {

              let itm = eval(f.fun.replace("W(", "w("));
              itmArr.push({
                fun: 'W',
                item_name: f.item_name,
                val: 0
              })

              itmArr.push({
                fun: 'W',
                item_name: itm,
                val: 0
              })


              console.log(f);
            } else {
              itmArr = [f];
            }

            for (let it of itmArr) {
              let rowData = this.lhs_lib.get_name_index(it.item_name, frame.apps_page_frame_seqid);
              let idx = rowData;
              // for (let itemGroup of tabledata) {
              if (idx) {
                let itemGroup = tabledata[idx.level4Index];
                for (let item of itemGroup.Level5) {
                  if (item.item_name.toLowerCase() == it.item_name.toLowerCase() && !item.extra_record) {
                    if (it.fun == "S") {
                      obj[item.item_name] = item.value ? Number((parseFloat(item.value) + (obj[item.item_name] ?? 0)).toFixed(it.decimal)) : 0 + (obj[item.item_name] ?? 0);
                    }
                    if (it.fun == "A" && item.value != undefined && item.value != null) {
                      if (!obj[item.item_name]) {
                        obj[item.item_name] = {
                          val: 0,
                          count: 0
                        };
                      }
                      obj[item.item_name].val = (obj[item.item_name].val ?? 0) + (item.value ? parseFloat((item.value).replace(/,/g, "")) : 0);
                      obj[item.item_name].count = obj[item.item_name].count + 1;
                      // avgCount = avgCount + 1;
                    }

                    if (it.fun == "M") {
                      if (it.dataType && it.dataType.toLowerCase() == "date") {
                        if (!obj[item.item_name]) {
                          obj[item.item_name] = [];
                        }
                        obj[item.item_name].push(item.value ? (new Date((item.value).toString().replace(/,/g, ""))) : "");
                      } else {
                        if (!obj[item.item_name]) {
                          obj[item.item_name] = [];
                        }
                        if(item.value != null || item.value != undefined){
                          obj[item.item_name].push(item.value ? (parseFloat((item.value).toString().replace(/,/g, ""))) : "");
                        }
                      }
                    }

                    if (it.fun == "X") {
                      if (it.dataType && it.dataType.toLowerCase() == "date") {
                        if (!obj[item.item_name]) {
                          obj[item.item_name] = [];
                        }
                        obj[item.item_name].push(item.value ? (new Date((item.value).toString().replace(/,/g, ""))) : "");
                      } else {
                        if (!obj[item.item_name]) {
                          obj[item.item_name] = [];
                        }
                        if(item.value != null || item.value != undefined){
                          obj[item.item_name].push(item.value ? (parseFloat((item.value).toString().replace(/,/g, ""))) : "");
                        }
                      }
                    }

                    if (it.fun == "C") {
                      if(obj[item.item_name]){
                        obj[item.item_name] = obj[item.item_name] + 1;
                      }else{
                        obj[item.item_name] = 1;
                      }
                     
                    }
                    if (it.fun == "W" && item.value != undefined && item.value != null) {
                      it.val = item.value;
                    }
                    break;
                  }
                }
              }
            }

            if (f.fun && f.fun.toUpperCase().includes("W(")) {
              let mul = itmArr[0].val * itmArr[1].val;
              f.mulSum = f.mulSum ? parseFloat(f.mulSum) + mul : mul;
              f.itm2Sum = f.itm2Sum ? f.itm2Sum + parseFloat(itmArr[1].val) : parseFloat(itmArr[1].val);
            }
          }
        }

        for (let f of funArr) {
          let value = 0;
          if (f.fun == "A") {
            // value = ((obj[f.item_name]?.val ?? 0) / (obj[f.item_name]?.count ?? 0));
            const val = obj[f.item_name]?.val ?? 0;
            const count = obj[f.item_name]?.count ?? 0;

            value = count !== 0 ? val / count : 0;
          } else if (f.fun == "M") {
            const arr = obj[f.item_name];

            const numbers = Array.isArray(arr)
              ? arr.filter(x => typeof x === 'number' && Number.isFinite(x))
              : [];

            value = numbers.length > 0 ? Math.min(...numbers) : 0;
            // value = Math.min.apply(Math, obj[f.item_name]);
          } else if (f.fun == "X") {
            const arr = obj[f.item_name];

            const numbers = Array.isArray(arr)
              ? arr.filter(x => typeof x === 'number' && Number.isFinite(x))
              : [];

            value = numbers.length > 0 ? Math.max(...numbers) : 0;
            // value = Math.max.apply(Math, obj[f.item_name]);
          } else if (f.fun == "C" || f.fun == "S") {
            value = obj[f.item_name] ?? 0;
          } else if (f.fun && f.fun.toUpperCase().includes("W(")) {
            console.log(f.mulSum, f.itm2Sum);
            value = f.mulSum / f.itm2Sum;
          }

          if (f.fun != "C" && f.dataType.toLowerCase() != "date") {
            if (f.decimal && f.decimal != 0) {
              dataObj[f.item_name] = this.preciseAddAndTruncate(value, f.decimal).toString();
            } else {
              dataObj[f.item_name] = value.toString();
            }

            flag = true;
          } else {
            dataObj[f.item_name] = value.toString();
            flag = true;
          }
        }
      }

      if (flag) {
        let tableKey = Object.keys(dataObj);
        let frameLevel4;
        if (frame.apexFrameLevel4 && frame.apexFrameLevel4.length > 0) {
          frameLevel4 = JSON.parse(JSON.stringify(frame.apexFrameLevel4));
        } else {
          frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
        }


        if (frameLevel4 && frameLevel4.length > 0) {
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.summaryValue = dataObj[key]
                }
              }
            }
          }

          let tableRows = [];
          tableRows[0] = frameLevel4;

          if (frame.apps_frame_type == 'HORIZONTAL_TABLE') {
            let data = this.lhs_lib.seprateData(frame, tableRows)
            // frame.summary_rows = this.globalObject.transpose(data);
            frame.summary_rows = this.lhs_lib.seprateData(frame, tableRows)[0];
          } else {
            frame.summary_rows = this.lhs_lib.seprateData(frame, tableRows)[0];
          }
        }
      }
      if (frame.summary_rows && frame.summary_rows.length > 0 && summ_item && summ_item.length > 0) {
        for (let itemGroup of frame.summary_rows) {
          for (let input_item of itemGroup.Level5) {
            if (input_item.containerRowss) {
              for (let containerRows of input_item.containerRowss) {
                for (let item of containerRows.Level5) {
                  for (let sum_item of summ_item) {
                    let summItem = sum_item.replace(/^sum_/i, "");
                    if (item.item_name == summItem) {
                      item.summItemStype = true
                    }
                  }
                }
              }
            } else {
              for (let sum_item of summ_item) {
                let summItem = sum_item.replace(/^sum_/i, "");
                if (input_item.item_name == summItem) {
                  input_item.summItemStyle = true
                }
              }
            }
          }
        }
      }
    } else {
      frame.summary_rows = [];
    }
  }

  preciseAddAndTruncate(value, decimals) {
    const [int, dec = ""] = value.toString().split(".");
    return int + "." + dec.padEnd(decimals, "0").slice(0, decimals);
  }

  calculateData(tableData, funArr) {
    let dataObj = {};
    for (let f of funArr) {
      let value = 0;
      let valueArr = [];
      for (let i of tableData) {
        if (i && i[f.item_name]) {
          if (f.fun == "S") {
            value = i[f.item_name] ? parseFloat(i[f.item_name]) + value : 0 + value;
          }
          if (f.fun == "A") {
            value = value + (i[f.item_name] ? parseFloat((i[f.item_name]).replace(/,/g, "")) : 0);
          }

          if (f.fun == "M" || "X") {
            if (f.dataType && f.dataType.toLowerCase() == "date") {
              valueArr.push(i[f.item_name] ? (new Date((i[f.item_name]).toString().replace(/,/g, ""))) : "");
            } else {
              valueArr.push(i[f.item_name] ? (parseFloat((i[f.item_name]).toString().replace(/,/g, ""))) : "");
            }
          }

          if (f.fun == "C") {
            value = value + 1;
          }

        }
      }

      if (f.fun == "A") {
        value = (value / tableData.length);
      }

      if (f.fun == "M") {

        if (valueArr.length > 0) {

          if (f.dataType && f.dataType.toLowerCase() == "date") {
            let val = tableData.find(x => x[f.item_name] && (new Date(x[f.item_name]).toString() == new Date(Math.min.apply(null, valueArr)).toString()));
            value = val[f.item_name];
          } else {
            value = Math.min.apply(Math, valueArr);
          }

        } else {
          value = null;
        }
      }

      if (f.fun == "X") {
        if (valueArr.length > 0) {
          if (f.dataType && f.dataType.toLowerCase() == "date") {
            let val = tableData.find(x => x[f.item_name] && (new Date(x[f.item_name]).toString() == new Date(Math.max.apply(null, valueArr)).toString()));
            value = val[f.item_name];
          } else {
            value = Math.max.apply(Math, valueArr);
          }
        } else {
          value = null;
        }
      }

      if (f.fun != "C" && f.dataType.toLowerCase() != "date") {
        let val = value ? value.toString() : "0";
        dataObj[f.item_name] = parseFloat(val).toFixed(f.decimal).toString();
      } else {
        dataObj[f.item_name] = value.toString();
      }

    }
    return dataObj;
  }


  async single_row(frame, tableData, wherStr?) {

    let data = [];
    let tabData = [];
    frame.noDirty = true;
    if (wherStr) {
      let whereArr = [];
      if (wherStr.indexOf("and") > -1) {
        whereArr = wherStr.replaceAll("'", "").split("and");
      } else {
        whereArr[0] = wherStr.replaceAll("'", "");
      }
      let arr = [];

      for (let w of whereArr) {
        if (w) {
          let cond = w.split("=");
          let name = "x." + cond[0].trim().toUpperCase().split(".")[1];
          let val = (cond[1].indexOf(".") > -1) ? this.lhs_lib.get_item_value(cond[1].trim(), 'current_record') : cond[1];
          let str = name + " == " + (val ? val : null);
          arr.push(str);
        }
      }

      let i = 0;
      let indexStr = "";
      let condStr = arr.join(" && ");
      for (let x of tableData) {

        if (eval(condStr)) {
          data.push(x);
          indexStr = indexStr ? indexStr + i + ";" : i + ";";
        } else {
          // tabData.push(x);
        }
        i++;
      }
      frame.indexStr = indexStr;
      frame.noDirty = true;

    } else {
      let i = 0;

      for (let x of tableData) {
        if (i > 0) {
          //  tabData.push(x);
        } else {
          data.push(x);
        }
        i++;
      }
      frame.edit_record_index = 0;
    }

    tabData = tableData;

    await this.populateRows(frame.apps_page_frame_seqid, data);
    let obj = {
      apps_frame_seq_id: frame.apps_page_frame_seqid,
      tableData: tabData,
      eventType: 'addRow'
    }
    this.addData(obj);
  }


  addData(event) {
    let fromFrame = this.lhs_lib.get_frame_config(event.apps_frame_seq_id);
    let toFrame = this.lhs_lib.get_frame_config(event.apps_frame_seq_id + 'A');

    let tableRows = [];
    let tableData = event.tableData;

    if (!toFrame || (toFrame.apps_frame_type == 'CARD' && !toFrame.Level4?.length && (!tableData || !tableData.length))) {
      return;
    }

    toFrame.tableRows = [];

    toFrame.tableData = tableData;
    let tableKey = [];
    if (tableData.length > 0) {
      tableKey = Object.keys(tableData[0]);
    }

    let indexcount: number = -1;
    let suufixItems = [];
    if (tableData) {
      for (let table of tableData) {
        indexcount++;
        let frameLevel4 = JSON.parse(JSON.stringify(fromFrame.Level4));

        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            for (let key of tableKey) {
              if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                item.value = table[key]
              }

              if (item.datatype != 'DATE' && item.datatype != 'DATETIME' && item.datatype != 'TIME'
                && item.value && item.format_mask && item.datatype != 'NUMBER') {
                item.value = this.formatMastPipe.transform(item.value, item).value;
              } else if (item.datatype == 'NUMBER' && item.value) {

                let val = this.formatMastPipe.transform(item.value, item).value;
                if (val) {
                  let a = val.toString().replaceAll(",", "");
                  val = a;
                }

                item.value = val;

              }
            }

            // if (item.item_name == 'WMA_RECORD_STATUS') {
            item['frame_status'] = 'dirty';
            // }

            //  item.item_default_value = "";
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

            if (item.item_type == 'LIST_BOX' && item.item_default_value) {
              item.temp_default_value = item.item_default_value;
              item.item_default_value = "";
            }
            item.item_default_value = "";

            item.item_enable_flag = item.temp_enable_flag ? item.temp_enable_flag : item.item_enable_flag;
            item.data_required_flag = item.temp_required_flag ? item.temp_required_flag : item.data_required_flag;

            item.temp_item_type = item.item_type;
            item.isAssociate = true;

            item.prompt_name = item.prompt_name && item.prompt_name.includes("*") ? item.prompt_name.replace("*", "") : item.prompt_name;



            if (item.value != undefined && item.value != null && item.value !== "") {
              item.isValid = true;
            }
            item.temp_enable_flag = item.item_enable_flag;
            item.item_enable_flag = 'T';

            item.temp_click_events_str = item.click_events_str
            item.click_events_str = item.orignal_click_events_str != undefined ? item.orignal_click_events_str : item.click_events_str;

            if (item.item_type != "BT" && item.item_type != "BUTTON_ICON" && item.item_type != "BUTTON" && item.item_type != "FILE_UPLOAD" && 
              item.item_type != "FRAME_BUTTON_ICON" && item.item_type != "RIGHT_CLICK" && item.item_type != "CHECK_BOX" && item.item_type != "RADIO_BUTTON") {
              item.item_type = "TEXT";
              item.temp_sub_type = item.item_sub_type;
              item.item_sub_type = 'TEXT_DISPLAY';


            }
            if ((item.item_type == 'SPECIAL') && (item.value == 'Y' || item.value == '1')) {
              item.initialVal = true;
            }
            item.indexcount = JSON.parse(JSON.stringify(indexcount));
          }
        }
        tableRows.push(frameLevel4);
        //  toFrame.headers = JSON.parse(JSON.stringify(frameLevel4));
        // if (!toFrame.Level4 || toFrame.Level4.length <= 1) {
        // }
      }
    }

    let frameLevel4 = JSON.parse(JSON.stringify(fromFrame.Level4));
    for (let itemGroup of frameLevel4) {
      for (let item of itemGroup.Level5) {

        // if (item.item_name == 'WMA_RECORD_STATUS') {
        //   item['frame_status'] = 'dirty';
        // }

        //  item.item_default_value = "";
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

        if (item.item_type == 'LIST_BOX' && item.item_default_value) {
          item.temp_default_value = item.item_default_value;
          item.item_default_value = "";
        }
        item.item_default_value = "";

        item.temp_item_type = item.item_type;
        item.isAssociate = true;

        item.prompt_name = item.prompt_name && item.prompt_name.includes("*") ? item.prompt_name.replace("*", "") : item.prompt_name;



        if (item.value != undefined && item.value != null && item.value !== "") {
          item.isValid = true;
        }

        item.temp_enable_flag = item.item_enable_flag;
        item.item_enable_flag = 'T';

        item.temp_click_events_str = item.click_events_str
        item.click_events_str = item.orignal_click_events_str != undefined ? item.orignal_click_events_str : item.click_events_str;


        if (item.item_type != "BT" && item.item_type != "BUTTON_ICON" && item.item_type != "BUTTON" && item.item_type != "FILE_UPLOAD" 
          && item.item_type != "FRAME_BUTTON_ICON"  && item.item_type != "RIGHT_CLICK" && item.item_type != "CHECK_BOX" && item.item_type != "RADIO_BUTTON") {
          item.item_type = "TEXT";
          item.temp_sub_type = item.item_sub_type;
          item.item_sub_type = 'TEXT_DISPLAY';
        }
        if ((item.item_type == 'SPECIAL') && (item.value == 'Y' || item.value == '1')) {
          item.initialVal = true;
        }
        item.indexcount = JSON.parse(JSON.stringify(indexcount));
        if (!item.search) {
          item.search = "%%";
        }
      }
    }

    toFrame.Level4 = JSON.parse(JSON.stringify(frameLevel4));
    let level4 = [];
    if (frameLevel4 && frameLevel4.length > 0) {
      level4[0] = JSON.parse(JSON.stringify(frameLevel4))
      let sepdata = this.lhs_lib.seprateData(toFrame, level4)
      toFrame.headers = sepdata[0];
    }

    if (toFrame) {
      toFrame.tableRows = tableRows;
    }

    fromFrame.tempRows = tableRows;

    // this.lhs_lib.getSepratorGrp(toFrame);
    // this.processData.setPromptColTableRows(toFrame);
    toFrame.active_row = 0;
    this.afterTableRows(toFrame);
  }

}
