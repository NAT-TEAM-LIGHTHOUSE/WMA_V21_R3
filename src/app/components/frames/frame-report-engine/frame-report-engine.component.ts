import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { ReportEngineModelComponent } from '../../layout/report-engine-model/report-engine-model.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ReportEngineTemplateSaveComponent } from '../../layout/report-engine-template-save/report-engine-template-save.component';
import { ReportEngineFormatViewComponent } from '../../layout/report-engine-format-view/report-engine-format-view.component';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { ModalController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { ReportEngineAddcolumnComponent } from 'src/app/pages/report-engine-addcolumn/report-engine-addcolumn.component';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ScrollingModule } from '@angular/cdk/scrolling';
@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,ScrollingModule,DragDropModule],
  selector: 'app-frame-report-engine',
  templateUrl: './frame-report-engine.component.html',
  styleUrls: ['./frame-report-engine.component.scss'],
})
export class FrameReportEngineComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() object_mast: any = {};
  flagtoruncanvasfilter: boolean;
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  developerModeData: any;
  tableRows = [];
  selectItemListframeEngine: any = [];
  setReportModelData: any = [];
  @Input() tableRowsAllColFrame = [];
  advFilterFrame: any;
  selectedItemList = [];

  adv_filter_tableRows = [];
  constructor(private processData: ProcessDataService, private modalGlobal: CanvasModalService, private lhs_lib: LhsLibService,
    private modalController: ModalController, public globalObjects: GlobalObjectsService, private cdr: ChangeDetectorRef) {
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "frame-report-engine")
    }
  }

  ngOnInit() {
    this.advFilterFrame = this.lhs_lib.get_frame_config('ADV_FILTER');
    console.log(this.advFilterFrame);
    if (this.advFilterFrame.tablRows) {

    } else {
      this.advFilterFrame.tableRows = [];
      // alert(this.advFilterFrame.tableRows);

    }
    console.log(this.advFilterFrame);
    console.log(this.frame);
    // this.cleardisplayRows
    // this.clear();
    // this.keyFIlterFlagData()

  }

  keyFIlterFlagData() {
    let frame = this.lhs_lib.get_frame_config('ALL_COL');
    let ALL_COLframeData = JSON.parse(JSON.stringify(frame.Level4))

    let dispColFrame = this.lhs_lib.get_frame_config('DISP_COL');
    if (!dispColFrame.tableRows) {
      dispColFrame.tableRows = []
    }
    dispColFrame.iskeyFIlterFlagDataToggle=true
    let dispColFrameData = []
    for (let frameData of ALL_COLframeData) {
      for (let item of frameData.Level5) {
        if (item.item_filter_flag) {
          if (item.item_filter_flag.toUpperCase() == "KEY_ENGINE_FILTER") {
            let isAdd = false
            if (dispColFrame.tableRows.length > 0) {
              isAdd = this.isAddOnDISP_COL(item, dispColFrame.tableRows)
            }
            if (!isAdd) {
              item.cb_select = "Y";
              item.item_visible_flag = 'T';
              let DISP_COLframeData = this.dis_colFrameData(dispColFrame.Level4, item)
              dispColFrameData.push(DISP_COLframeData);
            }
          }
        }
      }
    }
    if (dispColFrameData.length > 0) {
      dispColFrame.tableRows = [...dispColFrameData, ...dispColFrame.tableRows];
    }

  }
  isAddOnDISP_COL(item, dispColFrameData) {
    let isPresent = false
    for (let framedata of dispColFrameData) {
      for (let itemGroup of framedata) {
        for (let section of itemGroup.Level5) {
          if (section.item_name == 'ITEM_NAME') {
            if (section.value == item.item_name) {
              return true
            }
          }
        }
      }
    }
    return isPresent
  }
  dis_colFrameData(frameData, item) {
    let DISP_COLframeData: any = JSON.parse(JSON.stringify(frameData));
    for (let FilterData of DISP_COLframeData) {
      for (let disitem of FilterData.Level5) {
        for (let itm of Object.keys(item)) {
          if (itm == (disitem.item_name.toLowerCase())) {
            disitem.value = item[itm] ? item[itm] : "";
            if (item.datatype.includes("VARCHAR")) {
              disitem.newdatatype = "VARCHAR";
              console.log("datatype : " + disitem.newdatatype);
            } else {
              disitem.newdatatype = item.datatype;
              console.log("datatype : " + disitem.newdatatype);

            }
          }
        }
        if (disitem.item_name == 'CB_SELECT') {
          disitem.value = 'N';
        }
      }
    }
    return DISP_COLframeData
  }
  // ngOnChanges() {
  //   console.log(this.frame);
  // }
  // iskeyFIlterFlagDataToggle = false
  keyFIlterFlagDataToggle() {

    // this.iskeyFIlterFlagDataToggle = true
    this.keyFIlterFlagData()
  }

  report_filter_addcolumn(event: any) {
    // let component = FrameRelationalTableFilterComponent
    let component = ReportEngineAddcolumnComponent
    let componentProps = {
      frame: this.frame,
      theadData: this.frame.apextheads
    }
    let id = "report_filter_addcolumn"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((detail) => {
      // alert("user role");
      if (detail.data) {
        // this.getdataFromcanvasApex(detail.data)
        // this.wsdpcl=this.lhs_lib.getDpcl();
        // this.itemClicked(value.data);
      }
    })
  }


  report_filter_column(val) {
    console.log(this.object_mast);
    let frameData;
    for (let frameGrp of this.object_mast.Level2) {
      for (let frme of frameGrp.Level3) {
        if (frme.frame_alias == val) {
          frameData = frme;
        }
      }
    }
    // onItemSelect(ite)

    console.log("frame alieas : ", frameData);
    let component = ReportEngineModelComponent
    let componentProps = {
      frame: frameData,
      reportEngineData: this.globalObjects.selectItemListframeEngine,
      object: this.object_mast,
      setReportModelData: this.setReportModelData,
      no_back: true
    }
    let id = "report_filter_column"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {
      console.log("table rows all col data filte report engine ", value);
      // if(this.advFilterFrame.tableRows){
      //   for(let tdata of this.advFilterFrame.tableRows[0]){
      //     let flag=false;
      //     for(let rowdata of tdata.Level5){
      //       if(rowdata.item_name.toLowerCase()=="prompt_name"){
      //         if(!rowdata.value || rowdata.value==""){
      //           this.advFilterFrame.tableRows.splice(0, 1);
      //           flag=true;
      //           break;
      //         }
      //       }
      //     }
      //     if(flag){
      //       break;
      //     }

      //   }
      // }
      // this.tableRowsAllColFrame=value.data.frameTableRows;

      this.remove_adv_filter_row();
      if (this.advFilterFrame.tableRows) {
        this.adv_filter_tableRows = this.advFilterFrame.tableRows
      }
    })
  }
  ngOnDestroy() {
    // this.selectItemListframeEngine = [];
  }
  report_Advanced_filter(frameName) {

    console.log(this.object_mast);
    let frameData;
    // for (let frameGrp of this.object_mast.Level2) {
    //   for (let frme of frameGrp.Level3) {
    //     if (frme.frame_alias == frameName) {
    //       frameData = frme;
    //     }
    //   }
    // }

    console.log("frame alieas adv filter : ", frameData);
    let component = ReportEngineFormatViewComponent

    let id = "report_filter_column"
    let cssClass = ""
    let componentProps = { no_back: true }
    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {
      console.log(value.data)
      // }
    })
  }
  report_filter() {
    let component = ReportEngineModelComponent
    let componentProps = {
      selectItemListframeEngine: this.selectItemListframeEngine
    }
    let id = "report_filter"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {

    })
  }


  itemClicked(event) {
    this.emitPass.emit(event);
  }


  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: this.frame.apps_page_frame_seqid,
      item_seq_id: this.frame.apps_item_seqid
    };
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.frame,
        // runEvents: item.runEvents
      }
    });
    return await modal.present();
  }

  filter_save() {
    let component = ReportEngineTemplateSaveComponent
    let componentProps = {}
    let id = "report_template_save"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {

    })
  }

  report_format_view(event) {
    let component = ReportEngineFormatViewComponent
    let componentProps = {}
    let id = "report_format_view"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((value) => {

    })
  }
  report_increase_height(event) {
    let component = ReportEngineFormatViewComponent
    let componentProps = {}
    let id = "report_increase_height"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((value) => {

    })
  }

  report_tablefilter() {
    let component = ReportEngineFormatViewComponent
    let componentProps = {}
    let id = "report_tablefilter"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {

    })
  }
  report_sortby() {
    let component = ReportEngineFormatViewComponent
    let componentProps = {}
    let id = "report_sortby"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {

    })
  }
  report_subtotal() {
    let component = ReportEngineFormatViewComponent
    let componentProps = {}
    let id = "report_subtotal"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {

    })
  }
  report_formula_column() {
    let component = ReportEngineFormatViewComponent
    let componentProps = {}
    let id = "report_formula_column"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {

    })
  }

  drop(event: CdkDragDrop<string[]>, frame: any) {
        // 1. Get the rock-solid previous index saved in the drag data attributes
    const truePreviousIndex = event.item.data;

    // 2. Compute how many steps the CDK *thinks* it moved in the visible DOM window
    const domesticIndexShift = event.currentIndex - event.previousIndex;

    // 3. Extrapolate the true absolute target destination index 
    const trueCurrentIndex = truePreviousIndex + domesticIndexShift;

    // 3. Move the item safely within your main immutable data array
    // moveItemInArray(this.items, adjustedPreviousIndex, adjustedCurrentIndex);
    // for (let frameGrp of this.object_mast.Level2) {
    //   for (let frme of frameGrp.Level3) {
    //     if (frme.frame_alias == "DISP_COL") {
    //        // 4. Safely swap items using the absolute array coordinates
    //       if (trueCurrentIndex >= 0 && trueCurrentIndex < frme.tableRows.length) {
    //         moveItemInArray(frme.tableRows, truePreviousIndex, trueCurrentIndex);
    //         // 4. Force a data re-render on your data source
    //         frme.tableRows = [...frme.tableRows];
    //       }
    //     }
    //   }
    // }
    if (trueCurrentIndex >= 0 && trueCurrentIndex < frame.tableRows.length) {
      // 3. Move the item safely within your main immutable data array
       moveItemInArray(frame.tableRows, truePreviousIndex, trueCurrentIndex);
      // 4. Force a data re-render on your data source
      frame.tableRows = [...frame.tableRows];
    }
  }


  // moveUp(index: number, frame: any) {

  //   // for (let frameGrp of this.object_mast.Level2) {
  //   //   for (let frme of frameGrp.Level3) {
  //   //     if (frme.frame_alias == "DISP_COL") {
  //   //       if (index > 0) {
  //   //         const temp = frme.tableRows[index - 1];
  //   //         frme.tableRows[index - 1] = frme.tableRows[index];
  //   //         frme.tableRows[index] = temp;
  //   //         // CRITICAL: Virtual scroll will not update without this line
  //   //         frme.tableRows = [...frme.tableRows]; 
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //   if (index > 0) {
  //     const temp = frame.tableRows[index - 1];
  //     frame.tableRows[index - 1] = frame.tableRows[index];
  //     frame.tableRows[index] = temp;
  //     // CRITICAL: Virtual scroll will not update without this line
  //     frame.tableRows = [...frame.tableRows];
  //   }


  // }

  // Move Row UP
  moveUp(index: number, frame: any) {
    if (index > 0) {
      // Moves item from current index to (index - 1)
      moveItemInArray(frame.tableRows, index, index - 1);
      
      // Force Angular/Virtual Scroll to see the array change
      frame.tableRows = [...frame.tableRows];
    }
  }
  setChecked(item,event) {
    // alert(item.isChecked);
    // console.log("item checed : ",item);

    // if (item.isChecked) {
    //   item.value = 'Y';
    // } else {
    //   item.value = 'N';
    // }

    if (event.detail.checked) {
      item.value = 'Y';
    } else {
      item.value = 'N';
    }
  }
  // moveDown(index: number, frame: any) {

  //   // for (let frameGrp of this.object_mast.Level2) {
  //   //   for (let frme of frameGrp.Level3) {
  //   //     if (frme.frame_alias == "DISP_COL") {
  //   //       if (index < this.frame.tableRows.length - 1) {
  //   //         const temp = frme.tableRows[index + 1];
  //   //         frme.tableRows[index + 1] = frme.tableRows[index];
  //   //         frme.tableRows[index] = temp;
  //   //          // CRITICAL: Virtual scroll will not update without this line
  //   //         frme.tableRows = [...frme.tableRows]; 
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //   if (index < frame.tableRows.length - 1) {
  //     const temp = frame.tableRows[index + 1];
  //     frame.tableRows[index + 1] = frame.tableRows[index];
  //     frame.tableRows[index] = temp;
  //     // CRITICAL: Virtual scroll will not update without this line
  //     frame.tableRows = [...frame.tableRows];
  //   }
  // }

  // Move Row DOWN
moveDown(index: number, frame: any) {
  if (index < frame.tableRows.length - 1) {
    // Moves item from current index to (index + 1)
    moveItemInArray(frame.tableRows, index, index + 1);
    
    // Force Angular/Virtual Scroll to see the array change
    frame.tableRows = [...frame.tableRows];
  }
}
  removeItem(index: any, frame: any) {
    // this.selectItemListframeEngine[index].checked = false;
    // for (let frameGrp of this.object_mast.Level2) {
    //   for (let frme of frameGrp.Level3) {
    //     if (frme.frame_alias == "DISP_COL") {
    //       for (let itemGroup of frme.tableRows[index]) {
    //         for (let item of itemGroup.Level5) {
    //           if (item.item_name == "CB_SELECT") {
    //             item.value = 'N';
    //           }
    //         }
    //         break;
    //       }
    //       frme.tableRows.splice(index, 1);
    //       frme.tableRows = [...frme.tableRows]; 
    //     }
    //   }
    // }

    for (let itemGroup of frame.tableRows[index]) {
      for (let item of itemGroup.Level5) {
        if (item.item_name == "CB_SELECT") {
          item.value = 'N';
        }
      }
      break;
    }
    frame.tableRows.splice(index, 1);
    frame.tableRows = [...frame.tableRows]; 
  }







  openLov(itemName, btn, frame, i) {

    frame.active_row = i;
    let allitem = this.lhs_lib.get_item('all_col.' + itemName, 0);
    let item = this.lhs_lib.get_item('disp_col.FILTER_CLAUSE', i);
    item.displayReportEngineFlag = false;
    if (item) {
      if (allitem) {
        item.lov_code = allitem.lov_code;
        
        /***** added  this line to set only on particular frame item not all item*/
        let str = allitem.lov_return_column_str;
        item.lov_return_column_str = str ? str.toLowerCase().replaceAll(":all_col.", ":disp_col.") : "";
        /***** added  this line to set only on particular frame item not all item*/

        // item.datatype = allitem.datatype;
        // item.click_events_str = allitem.click_events_str ? allitem.click_events_str : "open_multi_lov();";
        item.itemClicked = "pre";
        if (btn == "EQ") {
          if (!item.lov_code) {
            alert("list of values not defined")
            return;
          } else {
            item.engineLovType = btn;
            // if(item.click_events_str){
            if (!item.tempClick_events_str) {
              item.tempClick_events_str = item.click_events_str;
            }
            // }
            item.click_events_str = "open_multi_lov();";
          }

        } else {
          item.engineLovType = btn
          if (item.tempClick_events_str != undefined) {
            item.click_events_str = item.tempClick_events_str;
          } else {
            item.click_events_str = item.click_events_str;
          }
        }
      }
      item.indexcount = i;
      this.emitPass.emit(item);
    }

    // alert("check");
    // this.applyAdvnceFilter();
  }


  rmFieldValue(i) {
    this.advFilterFrame.tableRows.splice(i, 1);
  }

  // clear() {
  //   this.selectItemListframeEngine = [];
  // }


  checkDisplayColData() {
    let displayframe: any;
    for (let frameGrp of this.object_mast.Level2) {
      for (let frme of frameGrp.Level3) {
        if (frme.frame_alias == "DISP_COL") {
          displayframe = frme;
        }
      }
    }
    console.log("display frame mast", displayframe);
  }

  cleardisplayRows() {
    let displayframe: any;
    for (let frameGrp of this.object_mast.Level2) {
      for (let frme of frameGrp.Level3) {
        if (frme.frame_alias == "DISP_COL") {
          if (frme.tableRows) {
            frme.tableRows = [];
          }
          displayframe = frme;
        }
      }
    }
    console.log("display initial table row check", displayframe);
  }


  applyAdvnceFilter(framedata, section) {
    console.log("framedata ", framedata);
    section.displayReportEngineFlag = false;
    let tableRowFiter = []
    // let dispColFrame = this.lhs_lib.get_frame_config('DISP_COL');

    // for (let data of dispColFrame.tableRows) {
    let row = [];
    let addrowflag = false;
    for (let datas of framedata) {
      for (let item of datas.Level5) {
        // if (item.item_name == "WMA_RECORD_STATUS") {
        item.frame_status = "dirty";
        // }
        if (item.item_name == "FILTER_CLAUSE") {
          if (item.codeOfValues && item.codeOfValues.length > 0) {
            item.value = item.codeOfValues;
            addrowflag = true;
          }
        }
        if (addrowflag) {
          for (let datas1 of framedata) {
            for (let itm of datas1.Level5) {
              row.push(itm);
            }
          }

        }
        addrowflag = false;
      }
    }
    if (row.length > 0) {
      tableRowFiter.push(row);
    }
    // }
    this.setAdvanceFilterData(tableRowFiter);
    // this.cdr.detectChanges()
  }


  setAdvanceFilterData(tableRowFiter: any) {
    // console.log("table row fiter : ", tableRowFiter);
    this.remove_adv_filter_row();
    // this.advFilterFrame.tableRows=[];
    // this.advFilterFrame.tableRows=JSON.parse(JSON.stringify(this.advFilterFrame.tableRows));
    if (this.advFilterFrame.tableRows) {
      console.log("table rows values : ", this.advFilterFrame.tableRows);
    }
    if (tableRowFiter.length > 0) {
      let table_rows = []
      for (let tableData of tableRowFiter) {
        let frameData = JSON.parse(JSON.stringify(this.advFilterFrame.Level4));
        for (let advData of frameData) {
          for (let advitem of advData.Level5) {

            for (let item of tableData) {
              if (item.item_name == advitem.item_name) {
                advitem.value = item.codeOfValues ? item.codeOfValues : item.value;
                // console.log("advitem value : ", advitem);
              }
            }

            if (advitem.item_name == 'FILTER_OPERATOR') {
              advitem.value = "in"
            }
            if (advitem.item_name == 'DATATYPE') {
              for (let frmadvData of frameData) {
                for (let datatypeitem of frmadvData.Level5) {
                  // console.log("data type : " + advitem.value);
                  datatypeitem.newdatatype = advitem.value;
                }
              }


            }
          }
        }
        table_rows.push(frameData);
      }
      // table_rows=JSON.parse(JSON.stringify(table_rows));



      this.set_adv_filter_values(table_rows);
      //         if(!this.advFilterFrame.tableRows){
      //         this.advFilterFrame.tableRows=[];
      //       }

      //       let tableRowValue=JSON.parse(JSON.stringify(table_rows));
      //       console.log("table row value : ",tableRowValue);
      //       // this.adv_filter_tableRows.push(tableRowValue[0]);


      //       // let tabRows=[];

      // console.log("value : ",this.adv_filter_tableRows);
      //  let tabRows:any=[];


      //       // tableRowData=JSON.parse(JSON.stringify(tableRowData));
      //       for(let i=0;i< this.adv_filter_tableRows.length;i++){
      //           let flag=false;
      //         for(let tabData of this.adv_filter_tableRows[i]){
      //           for(let tab of tabData.Level5){
      //           if(tab.item_name && tab.item_name.toLowerCase()=="item_name"){

      //               for(let trData of tableRowValue){
      //               for(let trVal of trData){
      //                 for(let tr of trVal.Level5){
      //                   if(tr.item_name && tr.item_name.toLowerCase()=="item_name"){
      //                 if(tab.value==tr.value){
      //                   console.log("tabRows "+tab.value,"table rows :"+tr.value);
      //                   this.adv_filter_tableRows.splice(i,1);
      //                     flag=true;
      //                   break
      //                 }
      //                 }
      //               }

      //           // }
      //           if(flag){
      //             break;
      //           }
      //           }
      //           if(flag){
      //             break;
      //           }
      //           }

      //         }
      //         if(flag){
      //           break;
      //         }
      //         }
      //         }
      //         if(flag){
      //           break;
      //         }
      //       }

      //       this.adv_filter_tableRows.push(tableRowValue[0]);
      //       // this.advFilterFrame.tableRows.push(JSON.parse(JSON.stringify(table_rows[0])));
      //       this.advFilterFrame.tableRows=[];
      //       this.advFilterFrame.tableRows=JSON.parse(JSON.stringify(this.adv_filter_tableRows));

      // this.cdr.detectChanges();
      //   let adv_fltr_tableRows= JSON.parse(JSON.stringify(this.advFilterFrame.tableRows));

      //   adv_fltr_tableRows.push(JSON.parse(JSON.stringify(table_rows)));
      //   // this.advFilterFrame.tableRows = table_rows;

      //   console.log("adv filter table row : ",adv_fltr_tableRows);

      //  let tableRowData:any=[];
      //  for(let row of this.adv_filter_tableRows){
      //   tableRowData.push(row[0])
      //  }

      //  console.log("table row data : ",tableRowData);
      //   this.adv_filter_tableRows.push(JSON.parse(JSON.stringify(table_rows)));
      //   // this.advFilterFrame.tableRows = table_rows;

      //   console.log("adv filter table row : ",this.adv_filter_tableRows);

      //  let tableRowData:any=[];
      //  for(let row of this.adv_filter_tableRows){
      //   tableRowData.push(row[0])
      //  }

      //  console.log("table row data : ",tableRowData);




















      //  let tabRows:any=[];
      //   if(!this.advFilterFrame.tableRows){
      //     this.advFilterFrame.tableRows=[];
      //   }

      //   tableRowData=JSON.parse(JSON.stringify(tableRowData));
      //   for(let i=0;i< tableRowData.length;i++){
      //       let flag=false;
      //     for(let tabData of tableRowData[i]){
      //       for(let tab of tabData.Level5){
      //       if(tab.item_name && tab.item_name.toLowerCase()=="item_name"){

      //           for(let trData of JSON.parse(JSON.stringify(table_rows))){
      //           for(let trVal of trData){
      //             for(let tr of trVal.Level5){
      //               if(tr.item_name && tr.item_name.toLowerCase()=="item_name"){
      //             if(tab.value==tr.value){
      //               console.log("tabRows "+tab.value,"table rows :"+tr.value);
      //               tableRowData.splice(i,1);
      //                 flag=true;
      //               break
      //             }
      //             }
      //           }

      //       // }
      //       if(flag){
      //         break;
      //       }
      //       }
      //       if(flag){
      //         break;
      //       }
      //       }

      //     }
      //     if(flag){
      //       break;
      //     }
      //     }
      //     }
      //     if(flag){
      //       break;
      //     }
      //   }











      //  console.log("row data : ",tableRowData);











      //  this.advFilterFrame.tableRows=tableRowData;

      //  console.log("this.adv filter : ",this.advFilterFrame.tableRows);







      // let tabRows:any=[];
      // if(!this.advFilterFrame.tableRows){
      //   this.advFilterFrame.tableRows=[];
      // }
      // tabRows=this.advFilterFrame.tableRows;
      // for(let i=0;i< tabRows.length;i++){
      //     let flag=false;
      //   // if(tabRows[i].prompt){
      //   for(let tabData of tabRows[i]){
      //     for(let tab of tabData.Level5){
      //     if(tab.item_name && tab.item_name.toLowerCase()=="item_name"){
      //       // for(let trData of table_rows){

      //         for(let trData of JSON.parse(JSON.stringify(table_rows))){
      //           // for(let tr of trData.Level5){
      //         for(let trVal of trData){
      //           for(let tr of trVal.Level5){
      //             if(tr.item_name && tr.item_name.toLowerCase()=="item_name"){
      //           if(tab.value==tr.value){
      //             console.log("tabRows "+tab.value,"table rows :"+tr.value);
      //             tabRows.splice(i,1);
      //               flag=true;
      //             break
      //           }
      //           }
      //         }

      //     // }
      //     if(flag){
      //       break;
      //     }
      //     }
      //     if(flag){
      //       break;
      //     }
      //     }

      //   }
      //   if(flag){
      //     break;
      //   }
      //   }
      //   }
      //   if(flag){
      //     break;
      //   }
      // }





      // // tabRows.push(table_rows[0]);
      // tabRows.push(JSON.parse(JSON.stringify(table_rows))[0]);

      // this.advFilterFrame.tableRows=tabRows;
      //  this.remove_adv_filter_row();

      console.log("this.adv filter : ", this.advFilterFrame.tableRows);
      console.log("table rows : ", table_rows);
    }
    // console.log(this.advFilterFrame);
  }

  remove_adv_filter_blank(framedata, section) {
    if (this.advFilterFrame.tableRows) {
      for (let tdataValue of this.advFilterFrame.tableRows) {
        let flag = false;

        for (let tdata of tdataValue) {
          // let flag=false;
          for (let rowdata of tdata.Level5) {
            if (rowdata.item_name.toLowerCase() == "filter_clause") {
              if (!rowdata.value || rowdata.value == "") {
                this.advFilterFrame.tableRows.splice(0, 1);
                flag = true;
                break;
              }
            }
          }
          if (flag) {
            break;
          }
        }
        if (flag) {
          break;
        }
      }
    }
  }


  remove_adv_filter_row() {

    if (this.advFilterFrame.tableRows && this.advFilterFrame.tableRows.length > 0) {
      for (let tdata of this.advFilterFrame.tableRows[0]) {
        let flag = false;
        for (let rowdata of tdata.Level5) {
          if (rowdata.item_name.toLowerCase() == "prompt_name") {
            if (!rowdata.value || rowdata.value == "") {
              this.advFilterFrame.tableRows.splice(0, 1);
              flag = true;
              break;
            }
          }
        }
        if (flag) {
          break;
        }

      }
    }
  }
  set_adv_filter_values(table_rows: any) {
    if (!this.advFilterFrame.tableRows) {
      this.advFilterFrame.tableRows = [];
    }

    let tableRowValue = JSON.parse(JSON.stringify(table_rows));
    console.log("table row value : ", tableRowValue);
    // this.adv_filter_tableRows.push(tableRowValue[0]);


    // let tabRows=[];

    console.log("value : ", this.adv_filter_tableRows);
    let tabRows: any = [];


    // tableRowData=JSON.parse(JSON.stringify(tableRowData));
    for (let i = 0; i < this.adv_filter_tableRows.length; i++) {
      let flag = false;
      for (let tabData of this.adv_filter_tableRows[i]) {
        for (let tab of tabData.Level5) {
          if (tab.item_name && tab.item_name.toLowerCase() == "item_name") {

            for (let trData of tableRowValue) {
              for (let trVal of trData) {
                for (let tr of trVal.Level5) {
                  if (tr.item_name && tr.item_name.toLowerCase() == "item_name") {
                    if (tab.value == tr.value) {
                      console.log("tabRows " + tab.value, "table rows :" + tr.value);
                      this.adv_filter_tableRows.splice(i, 1);
                      flag = true;
                      break
                    }
                  }
                }

                // }
                if (flag) {
                  break;
                }
              }
              if (flag) {
                break;
              }
            }

          }
          if (flag) {
            break;
          }
        }
      }
      if (flag) {
        break;
      }
    }

    this.adv_filter_tableRows.push(tableRowValue[0]);
    // this.advFilterFrame.tableRows.push(JSON.parse(JSON.stringify(table_rows[0])));
    this.advFilterFrame.tableRows = [];
    this.advFilterFrame.tableRows = JSON.parse(JSON.stringify(this.adv_filter_tableRows));
  }
  
}



