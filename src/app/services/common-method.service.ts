import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { GlobalObjectsService } from './global-objects.service';
import { DataService } from './data.service';
import { LhsLibService } from './lhs-lib.service';
import { DatePipe, isPlatformServer } from '@angular/common';
import * as Excel from "exceljs/dist/exceljs.min.js";

import { ProcessDataService } from './process-data.service';
import { Events } from './events';
import { ColumnFilterLayoutComponent } from '../components/layout/column-filter/column-filter.component';
import { PopoverController } from '@ionic/angular/standalone';
@Injectable({
  providedIn: 'root'
})
export class CommonMethodService {

  private _datePipe: DatePipe | null = null;
  private _globalObjects: GlobalObjectsService | null = null;
  private _dataService: DataService | null = null;
  private _lhs_lib: LhsLibService | null = null;
  private _processData: ProcessDataService | null = null;

  private get datePipe(): DatePipe {
    if (!this._datePipe) {
      this._datePipe = this.injector.get(DatePipe);
    }
    return this._datePipe;
  }

  private get globalObjects(): GlobalObjectsService {
    if (!this._globalObjects) {
      this._globalObjects = this.injector.get(GlobalObjectsService);
    }
    return this._globalObjects;
  }

  private get dataService(): DataService {
    if (!this._dataService) {
      this._dataService = this.injector.get(DataService);
    }
    return this._dataService;
  }

  private get lhs_lib(): LhsLibService {
    if (!this._lhs_lib) {
      this._lhs_lib = this.injector.get(LhsLibService);
    }
    return this._lhs_lib;
  }

  private get processData(): ProcessDataService {
    if (!this._processData) {
      this._processData = this.injector.get(ProcessDataService);
    }
    return this._processData;
  }

  constructor(private injector: Injector, @Inject(PLATFORM_ID) private platformId: Object,private events: Events,private popoverController: PopoverController) { }
  /*start export functionality */

  getDataForGraph(fileType, shareType, thisData) {
    let grapgRows = [];
    let wscp: any = {};
    wscp.service_type = "execute_query";
    wscp.from_row = "1";
    wscp.to_row = "1000000";
    wscp.apps_item_seqid = thisData.wscp_send_input.apps_item_seqid;
    wscp.apps_page_frame_seqid = thisData.frame.apps_page_frame_seqid;
    wscp.item_sub_type = thisData.wscp_send_input.item_sub_type;
    wscp.orignal_apps_item_seqid = thisData.wscp_send_input.orignal_apps_item_seqid;
    let wsdp = [];

    if (thisData.l_where_str) {
      wscp.where_str = thisData.l_where_str.join(" ");
    } else {
      wscp.where_str = null;
    }
    if (wscp.service_type == "execute_query") {

      wsdp = this.lhs_lib.getWsdp("").wsdp;
    } else {
      wsdp = thisData.wsdp;
    }

    var data = {
      wslp: thisData.userDetails,
      wscp: wscp,
      wsdp: thisData.wsdp,
      wsdpcl: thisData.wsdpcl
    };
    if (thisData.selectedExportDataType == 'allData') {
      grapgRows = thisData.frame.tableRows;
    } else {
      if (thisData.frame.searchableData) {
        grapgRows = thisData.frame.searchableData;
      } else {
        grapgRows = thisData.frame.tableRows;
      }
    }
     let printData=[]
    let print_org_filter:any=this.lhs_lib.get_item(":f.print_org_filter",'current_record')
    let print_period_filter:any=this.lhs_lib.get_item(":f.print_period_filter",'current_record')
    let print_other_filter:any=this.lhs_lib.get_item(":f.print_other_filter",'current_record')
    if(print_org_filter && print_org_filter.value){
      printData.push([print_org_filter.value])
    }
    if(print_period_filter && print_period_filter.value){
       printData.push([print_period_filter.value])
    }
    if(print_other_filter && print_other_filter.value){
      printData.push([print_other_filter.value])
    }
    thisData.printData=printData
    if (fileType == "pdf") {
      this.downloadPDF(grapgRows, shareType, thisData.summaryRow, thisData);
    } else if (fileType == "excel" || fileType == "csv") {
      this.downloadExcel(grapgRows, thisData,fileType);
    } else if (fileType == "print") {
      window.frames["print_frame"].document.write('<html><head><title>Table Contents</title>');
      window.frames["print_frame"].document.write('<style> body{font-family: Arial;font-size: 10pt;} table{border: 1px solid #ccc;border-collapse: collapse;} table thead{background: #5e656d !important;}');
      window.frames["print_frame"].document.write('table thead th{background: #5e656d !important;font-weight: bold;color:#000;border: 1px solid #ccc;font-size:17px;padding:5px;text-align:center;}  table tbody tr td{font-size:15px;color: #423f3f;padding: 4px 6px 10px 2px;text-align:center;border: 1px solid #ccc;} table tbody tr:nth-child(even){background-color: #f2f2f2;}</style>');
      window.frames["print_frame"].document.write('</head>');
      window.frames["print_frame"].document.write('<body>');
      // window.frames["print_frame"].document.body.innerHTML = document.getElementById(this.tab).innerHTML;
      window.frames["print_frame"].document.write('<body>');
      window.frames["print_frame"].document.write('</html>');
      window.frames["print_frame"].window.focus();
      window.frames["print_frame"].window.print();
    }
  }
  downloadPDF(dataRows, shareType, footer, thisData) {

    let grapgRows = this.generateGraphRows(dataRows);
    let data: any = [];
    let count: number = 0;
    let array: any = [];
    array[0] = [];
    array[0] = JSON.parse(JSON.stringify(thisData.pdfheads));
    let imageURlArr = [];
    for (let trows of grapgRows) {
      count++;

      let im = [];
      for (let trows2 of trows) {
        if (trows2.Level5) {
          if (trows2.Level5[0].item_visible_flag == "T") {
            if (trows2.Level5[0].item_type == 'BT' || trows2.Level5[0].item_type == 'DOWNLOAD_DOC' || trows2[0].item_type == 'BUTTON_ICON' || trows2[0].item_type == 'FRAME_BUTTON_ICON' || trows2[0].item_name == "WMA_RECORD_INDEX" || trows2[0].item_name == "WMA_FRAME_STATUS" || trows2[0].item_name == "WMA_RECORD_STATUS" || trows2[0].item_type =='RIGHT_CLICK' || trows2[0].item_type == 'FRAME_SEPARATOR') {
            } else {
              if (trows2.Level5[0].item_type == "DISPLAY_PHOTO") {
                if (trows2.Level5[0].value) {
                  im.push(trows2.Level5[0].value);
                } else {
                  im.push("");
                }
              } else {
                if (trows2.Level5[0].value && trows2.Level5[0].value.indexOf("@~@") > -1) {
                  let obj = { text: trows2[0].value.split("@~@")[0], fillColor: "#333" };
                  data.push(obj);
                } else {
                  data.push(trows2.Level5[0].value ?? "");
                }
              }
            }
          }
        } else {


          if (trows2[0].item_visible_flag == "T") {
            if (trows2[0].item_type == 'BT' || trows2[0].item_type == 'DOWNLOAD_DOC' || trows2[0].item_type == 'BUTTON_ICON' || trows2[0].item_type == 'FRAME_BUTTON_ICON' || trows2[0].item_type == 'FRAME_BUTTON_ICON' || trows2[0].item_name == "WMA_RECORD_INDEX" || trows2[0].item_name == "WMA_FRAME_STATUS" || trows2[0].item_name == "WMA_RECORD_STATUS" || trows2[0].item_type =='RIGHT_CLICK' || trows2[0].item_type == 'FRAME_SEPARATOR') {
            } else {
              if (trows2[0].item_type == "DISPLAY_PHOTO") {
                if (trows2[0].value) {
                  im.push(trows2[0].value);
                } else {
                  im.push("");
                }
              } else {
                if (trows2[0].value && trows2[0].value.indexOf("@~@") > -1) {
                  let obj = { text: trows2[0].value.split("@~@")[0], fillColor: "#333" };
                  data.push(obj);
                } else {
                  data.push(trows2[0]?.value ?? "");
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
    if (thisData.footerRowFlag) {
      foot = JSON.parse(JSON.stringify(footer));
    }
    //////////////////////////////////addded footer/////
    console.log(thisData.frame);
    let summaryRows: any = [];
    if (thisData.frame.summary_rows) {
      for (let itemGroup of thisData.frame.summary_rows) {
        if (itemGroup.Level5) {
          for (let input_item of itemGroup.Level5) {
          if(input_item.item_type == 'BT' || input_item.item_type == 'DISPLAY_PHOTO' || input_item.item_type == 'BUTTON_ICON' || input_item.item_type == 'DOWNLOAD_DOC' || input_item.item_type == 'FRAME_SEPARATOR' || input_item.item_type == 'FRAME_BUTTON_ICON' || input_item.item_type =='RIGHT_CLICK'){

            }else if ((input_item.item_visible_flag == 'T')) {

              // if(((!this.current_page_parameter.MODE) && (input_item.item_visible_flag && (input_item.item_visible_flag.indexOf(this.current_page_parameter.MODE)>-1)) )||input_item.item_visible_flag =='T' || !(input_item.item_type == 'ADD_ROW_BT') || !(input_item.item_type == 'DELETE_ROW_BT')){
              if (input_item.item_visible_flag == 'T') {
                console.log(input_item.summaryValue);
                if (input_item.summaryValue) {
                  summaryRows.push(input_item.summaryValue);
                } else {
                  summaryRows.push("");
                }
              }
            }
          }
        }

      }
      console.log(summaryRows);
      foot = summaryRows;
      console.log("foot data : " + foot);
    }
    ////////////////////////////////////////////////////

    let fileName = thisData.frame.apps_page_frame_name ? thisData.frame.apps_page_frame_name : thisData.excelHeading;
    if (shareType) {
      this.globalObjects.emailSendOfTableData(shareType, headerdata, fileName, foot,thisData.printData);
    } else {
      if (imageURlArr.length > 0) {
        this.getImages(imageURlArr, headerdata, fileName, foot,thisData.printData);
      } else {
        this.globalObjects.downloadPdf('', headerdata, fileName, foot,thisData.printData);
      }
    }
  }

    downloadExcel(grapgRows, thisData,fileTyle) {
    let tableData = [];
    for (let trows of grapgRows) {
      let data = [];
      for (let trows2 of trows) {
        if (trows2.Level5) {
          for (let item of trows2.Level5) {
            if (item.item_visible_flag == "T") {
              if (item.item_type == 'BT' || item.item_type == 'DISPLAY_PHOTO' || item.item_type == 'BUTTON_ICON' || item.item_type == 'DOWNLOAD_DOC' || item.item_type == 'FRAME_SEPARATOR' || item.item_type == 'FRAME_BUTTON_ICON' || item.item_type =='RIGHT_CLICK')  {
              } else {
                // data.push(item.value + "~" + item.datatype);
                if (item.format_mask) {
                  data.push(item.value + "@~@" + item.datatype + "@~@" + item.format_mask);
                } else {
                  data.push(item.value + "@~@" + item.datatype);
                }
              }
            }
            else {
              if (item.mirrored_items) {
                // data.push(item.value + "~" + item.datatype);
                if (item.format_mask) {
                  data.push(item.value + "@~@" + item.datatype + "@~@" + item.format_mask);
                } else {
                  data.push(item.value + "@~@" + item.datatype);
                }
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
    let addExtraCol=[]
  if(thisData.excelheads.length>0){
    for(let i=0;i<thisData.excelheads.length-1;i++){
      addExtraCol.push("")
    }
  }
    let titleRow = worksheet.addRow([thisData.frame.apps_page_frame_name ? thisData.frame.apps_page_frame_name : thisData.excelHeading,...addExtraCol]);
    titleRow.font = { size: 16, bold: true };
    titleRow.eachCell((cell, number) => {
      // cell.fill = {
      //   type: "pattern",
      //   pattern: "solid",
      //   // fgColor: { argb: " 29a3a3" }
      // };
      cell.font = {
        name: 'Arial',
        color: { argb: '000' },
        size: 14,
        bold: true
      };

    });
   
    if(thisData.printData){
      thisData.printData.forEach(d => {
      let row=worksheet.addRow(d)
      row.eachCell((cell, number) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffffff" }
        };
        })
      })
   }
   let subTitleRow = worksheet.addRow([
      "Print on : " + this.datePipe.transform(new Date(), "medium")
    ],...addExtraCol);
    subTitleRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffffff" }
      };


    });
     let blankRow=worksheet.addRow();
      blankRow.eachCell((cell, number) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffffff" }
        };
      })
    let headerRow = worksheet.addRow(thisData.excelheads);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffff99" }
      };
      cell.font = {
        name: 'Arial',
        color: { argb: '000' },

        size: 12,
      };
    });

    let rowIndex = 1;
    tableData.forEach(d => {
      let row = worksheet.addRow(d);
      if (rowIndex % 2 === 0) {
        row.eachCell((cell, number) => {
          let celldata = cell.value.toString();

          if (cell.value.toString().split("@~@")[1] == "NUMBER") {
            if (cell.value.toString().split("@~@")[0] == "") {
                cell.value="";
                cell.t = 'n';
                if (celldata.split("@~@")[2]) {
                  // cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                  cell.numFmt = this.numberFormateChange(celldata)
                }
            } else {
              // if(cell.value.toString().split("~")[0] && (typeof(cell.value.toString().split("~")[0])=='string')){
              //   cell.value=cell.value.toString().split("~")[0];
              // }else{
              //   cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
              // }




              if (cell.value.toString().split("@~@")[0] && (typeof (cell.value.toString().split("@~@")[0]) == 'string') && cell.value.split("@~@")[0] != "null" && cell.value.split("@~@")[0] != "undefined") {
                cell.value = +cell.value.split("@~@")[0];
                if (celldata.split("@~@")[2]) {
                  // cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                  cell.numFmt = this.numberFormateChange(celldata)

                }
              }else if(cell.value.split("@~@")[0] == "null" || cell.value.split("@~@")[0] == "undefined"){
                cell.value="";
                 cell.t = 'n';
                if (celldata.split("@~@")[2]) {
                  // cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                  cell.numFmt = this.numberFormateChange(celldata)
                }
              } else  {
                cell.value = parseFloat((cell.value.split("@~@")[0] != "null" && cell.value.split("@~@")[0] != "undefined") ? cell.value.split("@~@")[0] : "0");
                if (celldata.split("@~@")[2]) {
                  // cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                  cell.numFmt = this.numberFormateChange(celldata)
                }
              }
              // cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
            }
            // cell.alignment = { horizontal: "right" };
            // cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");

          } else  if(cell.value.toString().split("@~@")[1] == "DATE"){
           if( fileTyle=="csv"){
              cell.value = (cell.value.toString().split("@~@")[0] != "null" && cell.value.toString().split("@~@")[0] != "undefined") ? cell.value.toString().split("@~@")[0] : "";
              cell.value=`\t${cell.value}`;
            }else{
               this.dateFormateAddExcel(cell);
            }
            }
           else {
           
            cell.value = (cell.value.toString().split("@~@")[0] != "null" && cell.value.toString().split("@~@")[0] != "undefined") ? cell.value.toString().split("@~@")[0] : "";
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffff" }
          };
        });
      } else {
        row.eachCell((cell, number) => {
          let celldata = cell.value.toString();

          if (cell.value.toString().split("@~@")[1] == "NUMBER") {
            if (cell.value.toString().split("@~@")[0] == "") {
               cell.value="";
                cell.t = 'n';
                if (celldata.split("@~@")[2]) {
                  // cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                  cell.numFmt = this.numberFormateChange(celldata)
                }
            } else {
              // if(cell.value.toString().split("~")[0] && (typeof(cell.value.toString().split("~")[0])=='string')){
              //   cell.value=cell.value.toString().split("~")[0];
              // }else{              
              //   cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
              // }





              if (cell.value.toString().split("@~@")[0] && (typeof (cell.value.toString().split("@~@")[0]) == 'string') && cell.value.split("@~@")[0] != "null" && cell.value.split("@~@")[0] != "undefined") {
                cell.value = +cell.value.split("@~@")[0];
                if (celldata.split("@~@")[2]) {
                  // cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                  cell.numFmt = this.numberFormateChange(celldata)
                }
              } else if(cell.value.split("@~@")[0] == "null" || cell.value.split("@~@")[0] == "undefined"){
                cell.value="";
                cell.t = 'n';
                if (celldata.split("@~@")[2]) {
                  // cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                  cell.numFmt = this.numberFormateChange(celldata)
                }
              }
              else {
                cell.value = parseFloat((cell.value.split("@~@")[0] != "null" && cell.value.split("@~@")[0] != "undefined") ? cell.value.split("@~@")[0] : "0");
                if (celldata.split("@~@")[2]) {
                  // cell.value = this.formatMask(cell.value, celldata.toString().split("~")[2]);
                  cell.numFmt = this.numberFormateChange(celldata)
                }
              }


              // cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
            }
            //  cell.alignment = { horizontal: "right" };
            // cell.value = parseFloat((cell.value.toString().split("~")[0] != "null" && cell.value.toString().split("~")[0] != "undefined") ? cell.value.toString().split("~")[0] : "0");
          }else  if(cell.value.toString().split("@~@")[1] == "DATE"){
              if( fileTyle=="csv"){
              cell.value = (cell.value.toString().split("@~@")[0] != "null" && cell.value.toString().split("@~@")[0] != "undefined") ? cell.value.toString().split("@~@")[0] : "";
                cell.value=`\t${cell.value}`;
            }else{
               this.dateFormateAddExcel(cell);
            }
            }
           else {
            
            cell.value = (cell.value.toString().split("@~@")[0] != "null" && cell.value.toString().split("@~@")[0] != "undefined") ? cell.value.toString().split("@~@")[0] : "";
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
    if (thisData.footerRowFlag) {
      let f = JSON.parse(JSON.stringify(thisData.summaryRow));
      let footerrow = worksheet.addRow(f);
      footerrow.eachCell((cell, number) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffff99" }

        };
      })
    }
    //////////////////////////////////////////////summary row//////////////////////////////////////////
    console.log(thisData.frame);
    let summaryRows: any = [];
    // if(this.frame.summary_flag){
    //   if(this.frame.summary_rows){
    //     let f = this.frame.summary_rows;
    //     if(this.frame.tHead){
    //       for(let i=0;i<this.frame.tHead.length;i++){
    //         for(let data of f[i].Level5){
    //           if(data.summaryValue){
    //             if(data.item_visible_flag && data.item_visible_flag=="T"){
    //               if(data.format_mask){
    //                 summaryRows.push(this.formatMask(data.summaryValue,data.format_mask));

    //               }else{
    //                 summaryRows.push(data.summaryValue);

    //               }
    //             }
    //         }else{
    //           if(data.item_visible_flag && data.item_visible_flag=="T"){
    //               summaryRows.push("");
    //           }
    //         }
    //         }
    //       }
    //     }
    //       let footerrow = worksheet.addRow(summaryRows);
    //         footerrow.eachCell((cell, number) => {
    //           cell.fill = {
    //             type: "pattern",
    //             pattern: "solid",
    //             fgColor: { argb: "ffff99" }
    //           };
    //         })
    //       }
    // }
    //////////////////////////////////////////



    if (thisData.frame.summary_flag) {
      for (let itemGroup of thisData.frame.summary_rows) {
        if (itemGroup.Level5) {
          for (let input_item of itemGroup.Level5) {
            if(input_item.item_visible_flag == 'T'){
              if(input_item.item_type == 'BT' || input_item.item_type == 'DISPLAY_PHOTO' || input_item.item_type == 'BUTTON_ICON' || input_item.item_type == 'DOWNLOAD_DOC' || input_item.item_type == 'FRAME_SEPARATOR' || input_item.item_type == 'FRAME_BUTTON_ICON' || input_item.item_type =='RIGHT_CLICK'){
              }else if ((input_item.item_visible_flag == 'T')) {
                // if(((!this.current_page_parameter.MODE) && (input_item.item_visible_flag && (input_item.item_visible_flag.indexOf(this.current_page_parameter.MODE)>-1)) )||input_item.item_visible_flag =='T' || !(input_item.item_type == 'ADD_ROW_BT') || !(input_item.item_type == 'DELETE_ROW_BT')){                
                  console.log(input_item.summaryValue);
                  if (input_item.summaryValue) {
                    // summaryRows.push(input_item.summaryValue);
                    if (input_item.format_mask) {
                      summaryRows.push(this.formatMask(input_item.summaryValue, input_item.format_mask));
                    } else {
                      summaryRows.push(input_item.summaryValue);
                    }
                  } else {
                    summaryRows.push("");
                  }
                
              }
            }else{
              if (input_item.mirrored_items) {
                // data.push(item.value + "~" + item.datatype);
               if (input_item.summaryValue) {
                    // summaryRows.push(input_item.summaryValue);
                    if (input_item.format_mask) {
                      summaryRows.push(this.formatMask(input_item.summaryValue, input_item.format_mask));
                    } else {
                      summaryRows.push(input_item.summaryValue);
                    }
                  } else {
                    summaryRows.push("");
                  }
              } 
            }
          }
        }
      }
      let footerrow = worksheet.addRow(summaryRows);
      footerrow.eachCell((cell, number) => {
        cell.alignment = { horizontal: "right" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffff99" }
        };
      })
    }
    /////////////////////////////////////////////////summary row/////////

    for (let i = 4; i <= (tableData.length + 4); i++) {
      for (let l = 0; l < thisData.excelheads.length; l++) {

        worksheet.getCell(thisData.excelCol[l] + i).border = {
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
    var dateTime = date + ',' + time;

    let fileName = thisData.frame.apps_page_frame_name ? thisData.frame.apps_page_frame_name + "_" + dateTime + "_" : null;
    
    if(fileTyle=="csv"){
      workbook.csv.writeBuffer().then(data => {
      // Pass the buffer data to your download function
      this.globalObjects.downloadCsv(data, fileName); 
});
    }else{
      workbook.xlsx.writeBuffer().then(data => {
      this.globalObjects.downloadExcel(data, fileName);
    });
    }
  
  }

excelDateSerial(jsDate: Date): number {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's base date
  return (jsDate.getTime() - excelEpoch.getTime()) / (1000 * 60 * 60 * 24);
}

  numberFormateChange(celldata) {
    let celD = celldata.split("~")[2]
    if(celD.includes(".")){
      let maskInt = celD.split(".")[0].replaceAll("9", "#")
      let maskDec = celD.split(".")[1].replaceAll("9", "0")
      return `${maskInt}.${maskDec}`;
    }else{
      let maskInt=celD.replaceAll("9", "#");
      return maskInt;
    }
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
  async getImages(imgArr, headerdata, frame_name, foot,printData?) {
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
      this.globalObjects.downloadPdf('', headerdata, frame_name, foot,printData);
    }
  }

  /*End export functionality */

  /*Start filter fuctionality */
  async generateApexPage(a_current_page, frame, displayDataLen, filterAbleData, processData) {

    frame.page_no = a_current_page;
    let flag=false;
    let to = a_current_page * displayDataLen;
    let from = to - displayDataLen;
    let data = frame.tableData;
    if (frame.searchableRawData) {
      data = frame.searchableRawData;
    } else if (filterAbleData.length > 0) {
      data = filterAbleData;
    }
    if(data && data.length >0)
      {}else{
        flag=true
      }

    // if((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1)== 'A'){
      
    // }else{
    let tabledata=[]
    if(flag){
      for(let datalist of frame.canvasRows){
        let obj={}
        for(let data of datalist){
          for(let item of data.Level5){
            obj[item.item_name]=item.value==0 ?  '0' : item.value
          }
        }
        tabledata.push(obj)
      }
      console.log(tabledata)
      data=tabledata
    }
    if (data && data.length > from) {
      this.lhs_lib.object_mast._object_indexes = this.lhs_lib.buildItemIndexes(this.lhs_lib.object_mast);
      await processData.populateRows(frame.apps_page_frame_seqid, data, from, to, a_current_page);
   
      this.lhs_lib.refresh_frames();
    }
    
  }
  generateApexLevel4(frame, funArr, freezeColArr, thead) {
    let framelevel4 = [];
    frame.apexFrameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
    framelevel4 = frame.apexFrameLevel4;

    let coloumnHead = [];
    let funhead = [];
    let theaddata = [];
    let seqArr1 = [];
    let seqArr2 = [];
    let newArr = [];
    let visibleData = []

    for (let itemGroup of framelevel4) {
      for (let itemMast of itemGroup.Level5) {
        if (funArr) {
          for (let f of funArr) {
            if (f.coloumns && f.fun) {
              if (f.coloumns.item_name == itemMast.item_name) {
                funhead.push(itemMast.prompt_name)
                itemMast.summary_flag_group = f.fun;
              }
            }

          }
        }

        if (frame.ctrlBrkCond) {
          for (let c of frame.ctrlBrkCond) {
            if (c.coloumns) {
              if (c.coloumns.item_name == itemMast.item_name) {
                let val = coloumnHead.find(x => x == itemMast.prompt_name);
                if (val) { } else {
                  coloumnHead.push(itemMast.prompt_name);
                }
              }
            } else {
              if (c.itemName == itemMast.item_name) {
                coloumnHead.push(itemMast.prompt_name)
                itemMast.item_visible_flag = 'F';
              }
            }
          }
        }

        if (frame.visibleItems && frame.visibleItems.length > 0) {
          let visible = frame.visibleItems.find(x => x.item_name == itemMast.item_name);
          if (!visible) {
            if (itemMast.item_type != 'FRAME_BUTTON_ICON') {
              itemMast.item_visible_flag = 'F';
            }
          } else {
            itemMast.item_visible_flag = 'T';
            // itemMast.item_seqno=`0.${visible.item_seqno}`
            
            if (frame.columnsData && !frame.itIsSepratorFrame) {
              for (let a of frame.columnsData) {
                if (a.item_name == itemMast.item_name) {
                  itemMast.item_seqno = "0." + a.newSeqNo;
                }
              }
            }
          }


          visibleData.push(itemMast);
        }
        if (freezeColArr.length > 0) {
          for (let f of freezeColArr) {
            if (itemMast.prompt_name == f.prompt_name) {
              itemMast.freezeColumn = f.style;
            }
          }
        }

        if (itemMast.item_visible_flag == 'T') {
          if (itemMast.freezeColumn) {
            let obj = {
              prompt_name: itemMast.prompt_name,
              frezeStyle: itemMast.freezeColumn
            }
            theaddata.push(obj);
          } else {
            theaddata.push(itemMast.prompt_name);
          }
        }

      }
      if (visibleData.length > 0) {
        // if(itemMast.item_seqno && itemMast.item_seqno.toLowerCase() == 'item_seqno'){

        //  }
        newArr.push(itemGroup);
      }
    }
    // if(this.frame.visibleItems && this.frame.visibleItems.length > 0){
    //   this.lhs_lib.seqSort(newArr);
    // }


    //Code to arrange in sequence
    if (frame.ctrlBrkCond && frame.ctrlBrkCond.length > 0) {
      for (let c of frame.ctrlBrkCond) {
        for (let itemGroup of framelevel4) {
          for (let itemMast of itemGroup.Level5) {
            if (c.coloumns) {
              if (c.coloumns.item_name == itemMast.item_name) {
                seqArr1.push(itemGroup);
              }
            } else {
              if (c.itemName == itemMast.item_name) {
                seqArr1.push(itemGroup);
              }
            }
          }
        }
      }
      for (let itemGroup of framelevel4) {
        for (let itemMast of itemGroup.Level5) {
          let found = false;
          for (let c of seqArr1) {
            for (let item of c.Level5) {
              if (item.item_name == itemMast.item_name) {
                found = true;
              }
            }
          }
          if (!found) {
            seqArr2.push(itemGroup);
          }
        }
      }
      let seqArrFinal = seqArr1.concat(seqArr2);
      frame.apexFrameLevel4 = JSON.parse(JSON.stringify((seqArrFinal)));

    }


    if (freezeColArr && freezeColArr.length > 0) {
      let thead1 = [];
      let thead2 = [];
      for (let f of freezeColArr) {
        for (let itemGroup of framelevel4) {
          for (let itemMast of itemGroup.Level5) {
            if (itemMast.prompt_name == f.prompt_name) {
              seqArr1.push(itemGroup);
              if (itemMast.freezeColumn) {
                let obj = {
                  prompt_name: itemMast.prompt_name,
                  frezeStyle: itemMast.freezeColumn
                }
                thead1.push(obj);
              }
            }
          }
        }
      }
      for (let itemGroup of framelevel4) {
        for (let itemMast of itemGroup.Level5) {
          let found = false;
          for (let c of seqArr1) {
            for (let item of c.Level5) {
              if (item.item_name == itemMast.item_name) {
                found = true;
              }
            }
          }
          if (!found) {
            seqArr2.push(itemGroup);
            if (itemMast.item_visible_flag == 'T') {
              thead2.push(itemMast.prompt_name);
            }
          }
        }
      }
      let seqArrFinal = seqArr1.concat(seqArr2);
      frame.apexFrameLevel4 = JSON.parse(JSON.stringify((seqArrFinal)));
      theaddata = thead1.concat(thead2);
    }


    if (newArr.length > 0) {
      // this.lhs_lib.seqSort(newArr);
      if(frame.itIsSepratorFrame){
        this.seqSortData(newArr)
      }
       
      frame.apexFrameLevel4 = JSON.parse(JSON.stringify((newArr)));

    }


    thead = theaddata;


    frame.tHead = thead;
    frame.headers = JSON.parse(JSON.stringify((frame.apexFrameLevel4)));
      let  level4=[]
    if (frame.apexFrameLevel4 && frame.apexFrameLevel4.length > 0) {
          level4[0] = JSON.parse(JSON.stringify(frame.apexFrameLevel4))
          let sepdata = this.lhs_lib.seprateData(frame, level4)
          frame.headers = sepdata[0];
      }

  }


  // seqSortData(frameLevel4) {
  //   let level4 = frameLevel4;
  //   if (level4.length > 0) {
  //     level4.sort((a, b) => {
  //       // parseFloat
  //       console.log("a.Level5[0].item_seqno",a.Level5[0].item_seqno)
  //       if (parseFloat(a.Level5[0].item_seqno) < parseFloat(b.Level5[0].item_seqno)) {
  //         return -1;
  //       } else if (parseFloat(a.Level5[0].item_seqno) > parseFloat(b.Level5[0].item_seqno)) {
  //         return 1;
  //       } else {
  //         return 0
  //       }

  //     }

  //     )
  //   }

  // }


  seqSortData(frameLevel4: any[]) {
  if (!Array.isArray(frameLevel4) || frameLevel4.length === 0) return;

  frameLevel4.sort((a, b) => {
    const aStr = String(a?.Level5?.[0]?.item_seqno ?? '');
    const bStr = String(b?.Level5?.[0]?.item_seqno ?? '');

    const aNum = Number(aStr);
    const bNum = Number(bStr);

    // invalid values go last
    if (isNaN(aNum) && isNaN(bNum)) return 0;
    if (isNaN(aNum)) return 1;
    if (isNaN(bNum)) return -1;

    // 1️⃣ zero first
    if (aNum === 0 && bNum !== 0) return -1;
    if (bNum === 0 && aNum !== 0) return 1;

    const aIsDecimalBelow1 = aNum > 0 && aNum < 1;
    const bIsDecimalBelow1 = bNum > 0 && bNum < 1;

    // 2️⃣ decimals < 1 come before integers ≥ 1
    if (aIsDecimalBelow1 !== bIsDecimalBelow1) {
      return aIsDecimalBelow1 ? -1 : 1;
    }

    // 3️⃣ both decimals < 1 → decimal-length aware sort
    if (aIsDecimalBelow1 && bIsDecimalBelow1) {
      const aDecLen = aStr.split('.')[1]?.length ?? 0;
      const bDecLen = bStr.split('.')[1]?.length ?? 0;

      if (aDecLen !== bDecLen) {
        return aDecLen - bDecLen;
      }

      return aNum - bNum;
    }

    // 4️⃣ both integers ≥ 1 → normal numeric sort
    return aNum - bNum;
  });
}

  getitemSearch(frame, displayDataLen, conditionalFilterData, processData, data?) {
    if (((frame.tableData && frame.tableData.length > 0) || (frame.searchableData && frame.searchableData.length > 0))) {
      let data = this.filterColumna(frame, conditionalFilterData);
      frame.page_no = 1;
      let to = 1 * displayDataLen;
      let from = to - displayDataLen;

      frame.from_record = from;
      frame.to_record = to;
      frame.page_no = 1;
      frame.active_row = 0;
      processData.afterTableRows(frame);

      if (frame.searchableData) {
        delete frame['active_row'];
        if (frame.searchableData && frame.searchableData.length > 0) {
          for (let itemGrp of frame.searchableData[0]) {
            if (itemGrp.Level5.length > 0) {
              frame.active_row = itemGrp.Level5[0].indexcount;
              break;
            }
          }
        }
      } else {
        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let itemGrp of frame.tableRows[0]) {
            if (itemGrp.Level5.length > 0) {
              frame.active_row = itemGrp.Level5[0].indexcount;
              break;
            }
          }
        }
      }

    }
    return;
  }
  filterColumna(frame, conditionalFilterData) {
    let flag = false;
    let fillData = [];
    let fillRawData = [];
    let data = [];
    if (frame.searchableData) {
      data = frame.searchableData;
    } else {
      data = JSON.parse(JSON.stringify(frame.tableData));
    }
    // fillData = frame.tableRows;
    let fillRawDataTabledata = JSON.parse(JSON.stringify(frame.tableData));
    let fillRawDataTableRows = frame.tableRows;
    for (let c of conditionalFilterData) {
      if (c.operators == '=') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) == this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) == this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '>') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) > this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) > this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '>=') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) >= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) >= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '<') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) < this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) < this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '<=') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) <= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) <= this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == '<>') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) != this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => {
            if (this.evaluateValue(c.coloumns.datatype, x[c.coloumns.item_name]) != this.evaluateValue(c.coloumns.datatype, c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'is null') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => x[c.coloumns.item_name] == null);
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => x[c.coloumns.item_name] == null);
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'is not null') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => x[c.coloumns.item_name] != null);
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data

        } else {
          fillRawData = fillRawDataTabledata.filter(x => x[c.coloumns.item_name] != null);
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'like') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => ((x[c.coloumns.item_name] != null) && x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => ((x[c.coloumns.item_name] != null) && x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'not like') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => ((x[c.coloumns.item_name] == null) || !x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => ((x[c.coloumns.item_name] == null) || !x[c.coloumns.item_name].toLowerCase().includes((c.description).toLowerCase())));
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'not in') {
        flag = true;
        let str = "";
               if ((c.description).indexOf(",") > -1 || (c.description).indexOf("\n") > -1) {
                let condArr = c.description.split(/[\r\n,]+/);
        // if ((c.description).indexOf(",") > -1) {
        //   let condArr = c.description.split(',');
          let i = 0
          for (let cd of condArr) {
            i++;
            if (i < condArr.length) {
              if (c.coloumns.datatype == "number") {
                str = str + "x[c.coloumns.item_name] != '" + cd + "' && "
              } else {
                str = str + "x[c.coloumns.item_name].toLowerCase() != '" + cd.toLowerCase() + "' && "
              }
            } else {

              if (c.coloumns.datatype == "number") {
                str = str + "x[c.coloumns.item_name] != '" + cd + "'";
              } else {
                str = str + "x[c.coloumns.item_name].toLowerCase() != '" + cd.toLowerCase() + "'";
              }
            }
          }
        } else {
          if (c.coloumns.datatype == "number") {
            str = "x[c.coloumns.item_name].toLowerCase() != '" + c.description + "'";
          } else {
            str = "x[c.coloumns.item_name].toLowerCase() != '" + c.description.toLowerCase() + "'";
          }
        }

        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => (eval(str)));
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => (eval(str)));
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'in') {
        flag = true;
        let str = "";
          if ((c.description).indexOf(",") > -1 || (c.description).indexOf("\n") > -1) {
          let condArr = c.description.split(/[\r\n,]+/);
        // if ((c.description).indexOf(",") > -1) {
        //   let condArr = c.description.split(',')
          let i = 0
          for (let cd of condArr) {
            i++;
            if (i < condArr.length) {
              if (c.coloumns.datatype == "number") {
                str = str + "x[c.coloumns.item_name] == '" + cd + "' || "
              } else {
                str = str + "x[c.coloumns.item_name].toLowerCase() == '" + cd.toLowerCase() + "' || "
              }

            } else {
              if (c.coloumns.datatype == "number") {
                str = str + "x[c.coloumns.item_name] == '" + cd + "'";
              } else {
                str = str + "x[c.coloumns.item_name].toLowerCase() == '" + cd.toLowerCase() + "'";
              }

            }
          }
        } else {
          if (c.coloumns.datatype == "number") {
            str = "x[c.coloumns.item_name] == '" + c.description + "'";
          } else {
            str = "x[c.coloumns.item_name].toLowerCase() == '" + c.description.toLowerCase() + "'";
          }

        }

        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter(x => (eval(str)));
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter(x => (eval(str)));
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'begin with') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (x[c.coloumns.item_name].startsWith(c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (x[c.coloumns.item_name].startsWith(c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      } else if (c.operators == 'end with') {
        flag = true;
        if (fillRawData.length > 0) {
          fillRawData = fillRawData.filter((x: any) => {
            if (x[c.coloumns.item_name].endsWith(c.description)) return x;
          });
          let data = []
          this.searchColItem(fillData, c, data)
          fillData = data
        } else {
          fillRawData = fillRawDataTabledata.filter((x: any) => {
            if (x[c.coloumns.item_name].endsWith(c.description)) return x;
          });
          this.searchColItem(fillRawDataTableRows, c, fillData)
        }
      }

    }
    if (fillData.length > 0 || flag) { } else {
      fillData = frame.tableRows;
      fillRawData = JSON.parse(JSON.stringify(frame.tableData));
    }

    if (flag) {
      // frame.tableRows = [];
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

  searchColItem(tableRows, c, data) {
    for (let a of tableRows) {
      for (let d of a) {
        for (let b of d.Level5) {
          if (b.prompt_name == c.coloumns.prompt_name) {
            if (c.operators == 'like') {
              if (b.value && c.description) {
                if (b.value.toLowerCase().includes((c.description).toLowerCase())) {
                  data.push(a)
                }
              }
            } else if (c.operators == 'not like') {
              if (b.value && c.description) {
                if (!b.value.toLowerCase().includes((c.description).toLowerCase())) {
                  data.push(a)
                }
              } else {
                data.push(a)
              }
            } else if (c.operators == 'is null') {
              if (b.value == null) {
                data.push(a)
              }
            } else if (c.operators == 'is not null') {
              if (b.value != null) {
                data.push(a)
              }
            } else if (c.operators == 'begin with') {
              if (b.value && c.description) {
                if (b.value.startsWith(c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == 'end with') {
              if (b.value && c.description) {
                if (b.value.endsWith(c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '=') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) == this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }

            } else if (c.operators == '>') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) > this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '>=') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) >= this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '<') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) < this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '<=') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) <= this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == '<>') {
              if (b.value && c.description) {
                if (this.evaluateValue(c.coloumns.datatype, b.value) != this.evaluateValue(c.coloumns.datatype, c.description)) {
                  data.push(a)
                }
              }
            } else if (c.operators == 'not in') {
              let str = "";

              if ((c.description).indexOf(",") > -1 || (c.description).indexOf("\n") > -1) {
                let condArr = c.description.split(/[\r\n,]+/);
                let i = 0
                for (let cd of condArr) {
                  i++;
                  if (i < condArr.length) {
                    if (c.coloumns.datatype == "number") {
                      str = str + "b.value != '" + cd + "' && "
                    } else {
                      str = str + "b.value.toLowerCase() != '" + cd.toLowerCase() + "' && "
                    }
                  } else {

                    if (c.coloumns.datatype == "number") {
                      str = str + "b.value != '" + cd + "'";
                    } else {
                      str = str + "b.value.toLowerCase() != '" + cd.toLowerCase() + "'";
                    }
                  }
                }
              } else {
                if (c.coloumns.datatype == "number") {
                  str = "b.value.toLowerCase() != '" + c.description + "'";
                } else {
                  str = "b.value.toLowerCase() != '" + c.description.toLowerCase() + "'";
                }
              }
              if (eval(str)) {
                data.push(a)
              }
            } else if (c.operators == 'in') {
              let str = "";
              if ((c.description).indexOf(",") > -1 || (c.description).indexOf("\n") > -1) {
                let condArr =c.description.split(/[\r\n,]+/);
                let i = 0
                for (let cd of condArr) {
                  i++;
                  if (i < condArr.length) {
                    if (c.coloumns.datatype == "number") {
                      str = str + "b.value == '" + cd + "' || "
                    } else {
                      str = str + "b.value.toLowerCase() == '" + cd.toLowerCase() + "' || "
                    }

                  } else {
                    if (c.coloumns.datatype == "number") {
                      str = str + "b.value == '" + cd + "'";
                    } else {
                      str = str + "b.value.toLowerCase() == '" + cd.toLowerCase() + "'";
                    }

                  }
                }
              } else {
                if (c.coloumns.datatype == "number") {
                  str = "b.value == '" + c.description + "'";
                } else {
                  str = "b.value.toLowerCase() == '" + c.description.toLowerCase() + "'";
                }

              }
              if (eval(str)) {
                data.push(a)
              }
            }
          }
        }
      }

    }
  }
  evaluateValue(datatype, value) {
    if (datatype && datatype.toLowerCase() == 'date') {
      return new Date(value).getTime();
    } else if (datatype && datatype.toLowerCase() == 'number') {
      return parseFloat(value);
    } else {
      return isNaN(value) ? (value != null) ? value.toLowerCase() : null : parseFloat(value);
    }
  }

  /*End filter fuctionality */

  // 
  onItemBlur(event, rowindex, frame) {
    if (event.on_blur) {

      if (frame.tableRows) {
        this.globalObjects.onBlurEvent(event, event.on_blur, frame.tableRows[rowindex]);
      }
    }
  }

  /* Start for table column freeze */
  getAllSiblings(elem) {
    var siblings = [];
    siblings.push(elem);
    // Collect all previous siblings
    var prevSibling = elem.previousSibling;
    while (prevSibling !== null) {
      if (prevSibling.nodeType === 1) {
        siblings.push(prevSibling);
      }
      prevSibling = prevSibling.previousSibling;
    }
    return siblings;
  }

  locked($tabs, idFrame, frame, frameSeperator?, frameSeperatorInd?, item?) {
    let frameStyleFreeze = []
    if (isPlatformServer(this.platformId)) return;
    if (frame.showTd == 'SHOW') {
      const getFrameSep = document.getElementById(`${idFrame}#thead`)
      console.log(getFrameSep.children[1].children)
      let tr: any = getFrameSep.children[1].children
      let thInd: number = 0
      const entries = Object.entries(tr);
      for (let d of entries) {
        let a: any = d[1]
        if (a.id == `${idFrame}thead${$tabs}`) {
          thInd = Number(d[0])
        }
      }
      for (let d of entries) {
        let a: any = d[1]
        if (Number(d[0]) <= thInd) {
          a.classList.add("fixed-column");
          let value: any = 0
          let i = Number(d[0]) + 1
          if (i > 1) {
            let $margin = 2 * (i - 1);//2*
            value = a.style.left = $margin + '00px';
          }
          let stylesheet: any = document.styleSheets[0];
          for (let c of a.classList) {
            if (c.includes('freezeCss')) {
              stylesheet.insertRule(`.${c}{position: sticky !important;min-width: 200px !important;left: ${value} !important;z-index: 11 !important;background: #949494 !important;}`);
              frameStyleFreeze.push(`.${c}`)
              frame.frameStyleFreeze = frameStyleFreeze
            }
          }
        }
      }
      const elem: any = document.getElementById(`${idFrame}thead${$tabs}`);


      // Assuming 'elem' is the reference to element
      var allSiblings = this.getAllSiblings(elem);
      var reversedArray = allSiblings.slice().reverse();

      for (let [i, data] of reversedArray.entries()) {
        i += 1
        data.classList.add("fixed-column");
        let value: any = 0
        if (i > 1) {
          let $margin = 2 * (i - 1);//2*
          value = data.style.left = $margin + '00px';
        }
        let stylesheet: any = document.styleSheets[0];
        for (let c of data.classList) {
          if (c.includes('freezeCss')) {
            stylesheet.insertRule(`.${c}{position: sticky !important;min-width: 200px !important;left: ${value} !important;z-index: 11 !important;background: #949494 !important;}`);
            frameStyleFreeze.push(`.${c}`)
            frame.frameStyleFreeze = frameStyleFreeze
          }
        }
      }

    } else {
      const elem: any = document.getElementById(`${idFrame}thead${$tabs}`);


      // Assuming 'elem' is the reference to element
      var allSiblings = this.getAllSiblings(elem);
      var reversedArray = allSiblings.slice().reverse();

      for (let [i, data] of reversedArray.entries()) {
        i += 1
        data.classList.add("fixed-column");
        let value: any = 0
        if (i > 1) {
          let $margin = 2 * (i - 1);//2*
          value = data.style.left = $margin + '00px';
        }
        let stylesheet: any = document.styleSheets[0];
        for (let c of data.classList) {
          if (c.includes('freezeCss')) {
            stylesheet.insertRule(`.${c}{position: sticky !important;min-width: 200px !important;left: ${value} !important;z-index: 11 !important;background: #949494 !important;}`);
            frameStyleFreeze.push(`.${c}`)
            frame.frameStyleFreeze = frameStyleFreeze
          }
        }
      }
    }

    if (frameSeperator) {
      const elem: any = document.getElementById(`${item}thead${frameSeperatorInd}`);
      var allSiblings = this.getAllSiblings(elem);
      var reversedArray = allSiblings.slice().reverse();

      for (let [i, data] of reversedArray.entries()) {
        i += 1
        data.classList.add("fixed-column");
        let value: any = 0
        if (i > 1) {
          let $margin = 2 * (i - 1);//2*
          value = data.style.left = $margin + '00px';
        }
        let stylesheet: any = document.styleSheets[0];
        for (let c of data.classList) {
          if (c.includes('freezeCss')) {
            stylesheet.insertRule(`.${c}{position: sticky !important;min-width: 200px !important;left: ${value} !important;z-index: 11 !important;background: #949494 !important;}`);
            frameStyleFreeze.push(`.${c}`)
            frame.frameStyleFreeze = frameStyleFreeze
          }
        }
      }
    }
  }
  unlocked(idFrame, tab, frame, item_search_flagData) {
    var i: any;
    // var $tabs = 10;
    // if ($tabs >= 1) {
    //   for (i = 1; i <= $tabs; i++) {+
       if (isPlatformServer(this.platformId)) return;
    const container: any = document.getElementById(`${idFrame}thead${tab}`);
    if (container) {
      container.classList.remove("fixed-column");
      container.style.left = 'auto';
      let stylesheet: any = document.styleSheets[0];
      const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
      // for (let st of frame.frameStyleFreeze) {
      //   for (let i = 0; i < rules.length; i++) {
      //     if (rules[i].selectorText === st) {
      //       stylesheet.deleteRule(i);
      //     }
      //   }
      // }
      for (let st of frame.frameStyleFreeze) {
        for (let i = rules.length - 1; i >= 0; i--) {
          if (rules[i].selectorText === st) {
            stylesheet.deleteRule(i);
          }
        }
      }
    }
    //   }

    // }
    const getFrameSep = document.getElementById(`${idFrame}#thead`)
    let index = 0
    if (item_search_flagData) {
      index = 1
    }
    console.log(getFrameSep.children[index].children)
    let tr: any = getFrameSep.children[index].children
    const entries = Object.entries(tr);
    for (let d of entries) {
      let th: any = d[1]
      th.classList.remove("fixed-column");
      th.style.left = 'auto';
    }
  }

  autoFreeze(autoFreezeCount,frame) {
      let freezCount = 0
      for (let itemGroup of frame.headers) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_type != 'FRAME_SEPARATOR') {
          for (let item of itemGroup.Level5) {
            if (item.item_visible_flag == 'T' && item.item_type != 'FRAME_BUTTON_ICON') {
              if (freezCount < autoFreezeCount) {
                freezCount++
              }
            }
          }
        }
      }
      if (freezCount > 0) {
        this.locked(freezCount, frame.apps_page_frame_seqid,frame)
      }
  }

  /* End for table column freeze */

  /* Start for table column color */
  removeItemColor(item) {
       if (isPlatformServer(this.platformId)) return;
    let color = `.colorCss${item}`
    let stylesheet: any = document.styleSheets[0];
    const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].selectorText === color) {
        stylesheet.deleteRule(i);
      }
    }
  }
  classStyle(item, color, frame, frameStylevalue) {
       if (isPlatformServer(this.platformId)) return;
    // let frameStylevalue=[]
    let stylesheet: any = document.styleSheets[0];
    const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].selectorText === `.colorCss${item}`) {
        stylesheet.deleteRule(i)
      }
    }
    stylesheet.insertRule(`.colorCss${item}{background:${color} !important}`);
    console.log("style", stylesheet)
    frameStylevalue.push(`.colorCss${item}`)
    let frameStyleClass = [...new Set(frameStylevalue)]
    frame.frameStyle = frameStyleClass
  }
  /* End for table column color */

  /* Start for table column sorting */
 async thClick1(clickedHead, frame, displayDataLen):Promise<any> {

    let data = [];
    let tableRows = frame.tableRows;
    if (frame.searchableData) {
      tableRows = frame.searchableData
    }

    for (let tableDatas of tableRows) {
      let rowItem = this.lhs_lib.get_rows_item(tableDatas, 'WMA_RECORD_STATUS');
      let obj = {};
      if (!rowItem.extra_record) {
        for (let itemGroup of tableDatas) {
          for (let item of itemGroup.Level5) {
            obj[item.item_name] = item.value != undefined ? item.value.toString() : "";
          }
        }
        data.push(obj);
      }
    }
    for (let obj of clickedHead) {
      data = data.sort((a, b) => {

      if (obj.type == 'DATE' || obj.type == 'DATETIME') {

        let newA = JSON.parse(JSON.stringify(a[obj.th]));
        let newB = JSON.parse(JSON.stringify(b[obj.th]));

        // newA = newA ? new Date(newA).getTime() : "";
        // newB = newB ? new Date(newB).getTime() : "";

        newA = newA ? new Date(newA.split('-').reverse().join('-')).getTime() : "";
        newB = newB ? new Date(newB.split('-').reverse().join('-')).getTime() : "";

        if (newA < newB) {
          return -1 * obj.direction;
        } else if (newA > newB) {
          return 1 * obj.direction;
        } else {
          return 0;
        }

      } else if (obj.type == 'NUMBER') {
        let newA;
        let newB
        if (a[obj.th] && a[obj.th].includes(',')) {
          newA = JSON.parse(JSON.stringify(parseFloat(a[obj.th].replace(/,/g, ""))));
          newB = JSON.parse(JSON.stringify(parseFloat(b[obj.th].replace(/,/g, ""))));
        } else {
          newA = JSON.parse(JSON.stringify(parseFloat(a[obj.th])));
          newB = JSON.parse(JSON.stringify(parseFloat(b[obj.th])));
        }

        newA = newA ? newA : 0;
        newB = newB ? newB : 0;
        if (parseFloat(newA) < parseFloat(newB)) {
          return -1 * obj.direction;
        } else if (parseFloat(newA) > parseFloat(newB)) {
          return 1 * obj.direction;
        } else {
          return 0;
        }
      } else {
        a[obj.th] = a[obj.th] ? a[obj.th] : "";
        b[obj.th] = b[obj.th] ? b[obj.th] : "";
        if (a[obj.th] < b[obj.th]) {
          return -1 * obj.direction;
        } else if (a[obj.th] > b[obj.th]) {
          return 1 * obj.direction;
        } else {
          return 0;
        }
      }
      });
    }
    frame.page_no = 1;

    let to = 1 * displayDataLen;
    let from = to - displayDataLen;
    // frame.sortdata = data
   await this.processData.populateRows(frame.apps_page_frame_seqid, data, from, to, 1);
   return ;
    // this.cdr.detectChanges();
  }


  /* End for table column sorting */

  /* Start for search*/
  searchAllData(frame, displayDataLen) {
    this.processData.searchAllData(frame);
    frame.page_no = 1;
    let to = 1 * displayDataLen;
    let from = to - displayDataLen;
    this.processData.afterTableRows(frame);

    if (frame.searchableData) {
      delete frame['active_row'];
      if (frame.searchableData && frame.searchableData.length > 0) {
        for (let itemGrp of frame.searchableData[0]) {
          if (itemGrp.Level5.length > 0) {
            frame.active_row = itemGrp.Level5[0].indexcount;
            break;
          }
        }
      }
    } else {
      if (frame.tableRows && frame.tableRows.length > 0) {
        for (let itemGrp of frame.tableRows[0]) {
          if (itemGrp.Level5.length > 0) {
            frame.active_row = itemGrp.Level5[0].indexcount;
            break;
          }
        }
      }
    }
  }

  filterColumn(frame, displayDataLen, item?) {
    if (item && item.initialChange) {
      delete item['initialChange'];
      return;
    }
    if (((frame.tableData && frame.tableData.length > 0) || (frame.searchableData && frame.searchableData.length > 0) || (frame.tableRows && frame.tableRows.length > 0))) {
      this.processData.filterColumn(frame);
      frame.page_no = 1;
      let to = 1 * displayDataLen;
      let from = to - displayDataLen;

      frame.from_record = from;
      frame.to_record = to;
      frame.page_no = 1;
      frame.active_row = 0;
      this.processData.afterTableRows(frame);

      if (frame.searchableData) {
        delete frame['active_row'];
        if (frame.searchableData && frame.searchableData.length > 0) {
          for (let itemGrp of frame.searchableData[0]) {
            if (itemGrp.Level5.length > 0) {
              frame.active_row = itemGrp.Level5[0].indexcount;
              break;
            }
          }
        }
      } else {
        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let itemGrp of frame.tableRows[0]) {
            if (itemGrp.Level5.length > 0) {
              frame.active_row = itemGrp.Level5[0].indexcount;
              break;
            }
          }
        }
      }

    }
    return;
  }
  /* End for search*/

filterColumnMultiFilter(frame,displayDataLen,item?) {
  if (item && item.initialChange) {
    delete item['initialChange'];
    return;
  }
  if (((frame.tableData && frame.tableData.length > 0) || (frame.searchableData && frame.searchableData.length > 0))) {
    let data = this.processData.multiFilter(frame);
    frame.page_no = 1;
    let to = 1 * displayDataLen;
    let from = to - displayDataLen;

    frame.from_record = from;
    frame.to_record = to;
    frame.page_no = 1;
    frame.active_row = 0;
    this.processData.afterTableRows(frame);

    if (frame.searchableData) {
      delete frame['active_row'];
      if (frame.searchableData && frame.searchableData.length > 0) {
        for (let itemGrp of frame.searchableData[0]) {
          if (itemGrp.Level5.length > 0) {
            frame.active_row = itemGrp.Level5[0].indexcount;
            break;
          }
        }
      }
    } else {
      if (frame.tableRows && frame.tableRows.length > 0) {
        for (let itemGrp of frame.tableRows[0]) {
          if (itemGrp.Level5.length > 0) {
            frame.active_row = itemGrp.Level5[0].indexcount;
            break;
          }
        }
      }
    }

  }
  return;
}
/* End for search*/




/* start table pagination pagination */
paginate(a_current_page,frame,displayDataLen) {
  frame.page_no = a_current_page;
  let to = a_current_page * displayDataLen;
  let from = to - displayDataLen;
  frame.from_record = from;
  frame.to_record = to;

    if (!frame.maximum_no_of_pages_navigated || frame.maximum_no_of_pages_navigated < a_current_page) {
      frame.maximum_no_of_pages_navigated = a_current_page;
    }
    frame.active_row = frame.from_record;
    this.processData.afterTableRows(frame, from, to, frame.page_no);
  }
  /* End table pagination pagination */
  /* Start full Screen */
  fullScreen(frame: any, status) {
    let fullscreen_id=frame.apps_page_frame_seqid;
       if (isPlatformServer(this.platformId)) return;
    if (status == '1') {
      frame.fullScreen=true
      let element = document.getElementById(fullscreen_id);
      // Add a class to the element
      element.classList.add("active_fullscreen");
      element.classList.remove("deactive_fullscreen");
      // document.getElementById(fullscreen_id + "fullscreen_btn1").style.display = "none";
      // document.getElementById(fullscreen_id + "fullscreen_btn2").style.display = "inherit";
      // document.getElementById(fullscreen_id + "fullscreen_btn2").style.border = "2px solid #2e6adf";
      // document.getElementById(fullscreen_id + "fullscreen_btn2").style.backgroundColor = "var(--blue-new)";
      // document.getElementById(fullscreen_id + "fullscreen_btn2").style.color = "#fff";

      console.log('active');
    } else {
      delete frame['fullScreen']
      let element = document.getElementById(fullscreen_id);

      element.classList.remove("active_fullscreen");
      element.classList.add("deactive_fullscreen");

      // document.getElementById(fullscreen_id + "fullscreen_btn1").style.display = "inherit";
      // document.getElementById(fullscreen_id + "fullscreen_btn2").style.display = "none";

      console.log('active');
    }
  }
  /*Start full Screen */


  dateFormateAddExcel(cell) {
    if (cell.value.split("~")[0] != "null" && cell.value.split("~")[0] != "undefined" && cell.value.split("~")[0] != "") {
      const rawDate = cell.value.toString().split("~")[0].trim(); // '06 Aug 2025'

      // Split date & time
      const [datePart, timePart] = rawDate.split(" ");

      // Step 2: Parse components safely
      const [dayStr, monthStr, yearStr] = datePart.split('-');
      const day = parseInt(dayStr);
      const year = parseInt(yearStr);
      const monthMap = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };

      let month: any = ""
      if (monthStr.length < 3) {
        month = monthStr - 1
      } else {
        month = monthStr ? monthMap[monthStr.toLowerCase()] : "";
      }

      // Step 3: Validate month
      if (month === undefined) {
        throw new Error(`Invalid month: ${monthStr}`);
      }

      let utcDate: any = ""
      if (timePart) {
        // ⏰ Parse time
        let hours = 0, minutes = 0, seconds = 0;
        const timeParts = timePart.split(':');
        hours = parseInt(timeParts[0] || "0");
        minutes = parseInt(timeParts[1] || "0");
        seconds = parseInt(timeParts[2] || "0");

        // Step 4: Create UTC date
        utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
        cell.numFmt = 'dd-mm-yyyy hh:mm:ss';// Custom Excel display format

      } else {
        // Step 4: Create UTC date
        utcDate = new Date(Date.UTC(year, month, day));
        cell.numFmt = 'dd-mmm-yyyy';// Custom Excel display format
      }

      // Step 5: Convert to Excel date serial number

      const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's base date

      const excelDate = (utcDate.getTime() - excelEpoch.getTime()) / (1000 * 60 * 60 * 24);

      // Step 6: Assign to worksheet cell
      cell.value = excelDate;       // Excel serial number
    } else {
      cell.value = "";
      cell.numFmt = 'dd-mm-yyyy hh:mm:ss';
    }
    cell.t = 'd';             // 'n' for number
  }
      /* color column */
  frameStylevalue = []
async tablecolumnFilter( frame,orderAl,originalTableRows,activeColumnFilters,selectedColShow,page,item_search_flagData,
  event,
  item,
  index,
  fremeSeq,
  FRAME_SEPARATOR?,
  fsInd?,
  itemSeq?,
 
): Promise<any>  {
  // Save original table data if not already saved
  if (!originalTableRows.length) {
    originalTableRows = JSON.parse(JSON.stringify(frame.tableRows));
  }
  console.log(frame)
  let obj ={
      item: item,
      order: orderAl,
      index: index,
      fremeSeq: fremeSeq,
      frameSeprator: FRAME_SEPARATOR ? true : false,
      frame: frame.searchableData ? frame.searchableData :frame.tableRows,
      selectedColShow:selectedColShow,
      frame_header:FRAME_SEPARATOR ? frame.headers[index-1].Level5[0].containerRowss[fsInd-1].Level5[0]:frame.headers[index-1].Level5[0]
    }
  // Open popover with filter component
  const popover = await this.popoverController.create({
    component: ColumnFilterLayoutComponent,
    id: 'columnfilter',
    event: event,
    translucent: true,
    componentProps: obj
  });

 await popover.present();

  // ✅ WAIT for dismiss
  const details = await popover.onDidDismiss();
  const data = details.data;

  if (!data) {
    return null;
  }

  if (details.role === 'filterApplied') {

    selectedColShow = data.selectedColShow;

    if (!frame.SelectedColFilter) {
      frame.SelectedColFilter = data.SelectedData;
    } else {
      frame.SelectedColFilter =
        frame.SelectedColFilter.filter(
          (itemSelect) => itemSelect.item_name !== item.item_name
        );

      frame.SelectedColFilter = [
        ...frame.SelectedColFilter,
        ...data.SelectedData
      ];
    }

    this.filterColumnMultiFilter(frame, frame.displayDataLen);

    activeColumnFilters = {
      ...activeColumnFilters,
      [data.column]: data.selectedValues
    };

    item.isSearchItem = true;
  }

  if (details.role == 'search') {
    item = details.data
    page = 1
    frame.rowCount = 0
    if (item) {
      this.filterColumn(frame, frame.displayDataLen, item)
    } else {
      this.filterColumn(frame,frame.displayDataLen)
    }
    item.isSearchItem = true
  } else if (details.role == 'asorting') {
    orderAl = "asorting"
  } else if (details.role == 'dsorting') {
    orderAl = "dsorting"
  } else if (details.role == 'bgColor') {
    item.bgColor = details.data
    // this.classStyle(item.apps_item_seqid, details.data)
    this.classStyle(item.apps_item_seqid, details.data, frame, this.frameStylevalue)
  } else if (details.role == 'freezColumn') {
    if (details.data == "true") {
      item.freezColumnData = true
      // this.locked(index, fremeSeq, FRAME_SEPARATOR, fsInd, itemSeq)
        this.locked(index, fremeSeq, frame, FRAME_SEPARATOR, fsInd, itemSeq)
    } else {
      delete item['freezColumnData']
      // this.unlocked(fremeSeq, index)
      this.unlocked(fremeSeq, index, frame, item_search_flagData);
    }
  }
  else if (details.role == 'refresh') {
    delete item['bgColor']
    this.removeItemColor(item.apps_item_seqid)
  } else if (details.role == 'reset') {
    let searchValue = item.search.replaceAll(/%/g, "")
    if (searchValue) {
      item.search = `%%`
      delete item['isSearchItem']
      // this.filterColumn(item)
        page = 1
    frame.rowCount = 0
    if (item) {
      this.filterColumn(frame, frame.displayDataLen, item)
    } else {
      this.filterColumn(frame,frame.displayDataLen)
    }
      console.log("search")
    }
    if (item.bgColor) {
      delete item['bgColor']
      this.removeItemColor(item.apps_item_seqid)
      console.log("bgColor")
    }
    if (item.freezColumnData) {
      delete item['freezColumnData']
      // this.unlocked(fremeSeq, index)
      this.unlocked(fremeSeq, index, frame, item_search_flagData);
      console.log("freezColumnData")
    }
    if (data.colSelect) {
      selectedColShow = data.selectedColShow;

      if (item.SelectedData) {
        delete item['SelectedData'];
        delete item['isSearchItem'];
      }

      if (frame.SelectedColFilter) {
        frame.SelectedColFilter =
          frame.SelectedColFilter.filter(
            (itemSelect) => itemSelect.item_name !== item.item_name
          );
      }

      frame.isColResent = true;
      this.filterColumnMultiFilter(frame, frame.displayDataLen);
    }
  }

  // ✅ NOW RETURN FROM MAIN FUNCTION
  return {
    orderAl,
    originalTableRows,
    activeColumnFilters,
    selectedColShow
  };
}
}
