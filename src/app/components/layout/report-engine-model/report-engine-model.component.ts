import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { ReportEngineFormatViewComponent } from '../report-engine-format-view/report-engine-format-view.component';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
// import { ConsoleReporter } from 'jasmine';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlattenItemsPipe } from 'src/app/pipes/flatten-items-pipe';
@Component({
standalone : true,
imports:[NgSelectModule,...STANDALONE_IMPORTS,ScrollingModule,FlattenItemsPipe,DragDropModule],
  selector: 'app-report-engine-model',
  templateUrl: './report-engine-model.component.html',
  styleUrls: ['./report-engine-model.component.scss'],
  
})
export class ReportEngineModelComponent implements OnInit, AfterViewInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() object: any = {};
  flagtoruncanvasfilter: boolean;
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  tableRows = [];
  filterData: any;
  selectedItems: any[] = [];
  SelAll: boolean = false;
  filterableData: any;
  @Input() displayPhoto: any;
  developerModeData: any;
  itemappframeseqid: any;
  searchText = signal('');
  datatype: any = 'VARCHAR';
  selectItmReportEngineModelData: any = [];
  selectItemListframeEngine: any = [];
  // activeDatatype: any = 'VARCHAR';
  activeDatatype: any = 'ALL';

  setReportModelData: any = [];
  dispColFrame: any;
  allColLevel4: any;
  grpDataName: any;
  grpByArr: any = [];
  grpByFlag: any = false;
  functions = [
    { name: 'Sum', value: 'SUM', dataType: 'NUMBER' },
    { name: 'Average', value: 'AVERAGE', dataType: 'NUMBER' },
    { name: 'Count', value: 'COUNT', dataType: 'NUMBER,DATE,VARCHAR' },
    { name: 'Minimum', value: 'MIN', dataType: 'NUMBER,DATE' },
    { name: 'Maximum', value: 'MAX', dataType: 'NUMBER,DATE' }
  ]; selectAllCheckbox: any = {};
  selectAllflag: any = false;
  adv_filter_tableRows: any = [];
  searchableData: any = [];
  constructor(private processData: ProcessDataService, private modalServ: CanvasModalService, private modalController: ModalController,
    private pipemy: SearchfilterPipe, public globalObjects: GlobalObjectsService, private lhs_lib: LhsLibService, private cdr: ChangeDetectorRef) {
    if (this.globalObjects.layoutFlag) {
      return applyLoggingDecorator(this, "report-engine-model")
    }
  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    console.log("after view init");
  }

  advFilterFrame: any;
  ngOnInit() {
    console.log("all col frame : ", this.frame);
    this.allColLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    this.dispColFrame = this.lhs_lib.get_frame_config('DISP_COL');
    this.advFilterFrame = this.lhs_lib.get_frame_config('ADV_FILTER');
    if (this.dispColFrame.tableRows) {
      for (let advData of this.dispColFrame.tableRows) {
        for (let itemData of advData) {
          for (let disitem of itemData.Level5) {
            // if (disitem.item_name == "CB_SELECT" && disitem.value == true) {
            for (let itemdatas of advData) {
              for (let disitem_data of itemdatas.Level5) {
                if (disitem_data.item_name == "ITEM_NAME") {
                  for (let frame_all_data of this.allColLevel4) {
                    for (let itm_all of frame_all_data.Level5) {

                      if (disitem_data.value == itm_all.item_name) {
                        itm_all.checked = true;
                      }

                    }
                  }
                }
              }
            }
            continue;
            // }
          }
        }
      }

    } else {
      this.dispColFrame.tableRows = [];
    }



    let grpArr: any = [];
    for (let itmGroup of this.allColLevel4) {
      for (let itm of itmGroup.Level5) {
        if (itm.group_no_str) {
          grpArr.push(itm);
        }
      }
    }

    this.grpByArr = Object.values(grpArr.reduce((acc, curr) => {
      const groupName = curr.group_no_str;

      if (!acc[groupName]) {
        acc[groupName] = {
          groupname: groupName,
          groupnameARR: []
        };
      }
      acc[groupName].groupnameARR.push(curr);
      return acc;
    }, {}));
    this.toggleItm("ALL");
  }

  showGroupBy(item) {


    this.searchableData = [];




    this.grpByFlag = true;
    console.log("group name item", item);
    this.activeDatatype = item.groupname;
    this.grpDataName = item.groupname;
    this.checkAllDataSelectAll();
  }

  toggleItm(type) {
    this.grpByFlag = false;
    this.datatype = type;
    this.activeDatatype = type;
    this.checkAllDataSelectAll();
  }

  close() {
    this.modalServ.popDismiss();
  }

  apply() {
    let tableRowFiter = []
    for (let data of this.dispColFrame.tableRows) {
      let row = [];
      let addrowflag = false;
      for (let datas of data) {
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
            for (let datas1 of data) {
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
    }
    console.log("table row filter : ", tableRowFiter);
    this.setAdvanceFilterData(tableRowFiter);
    this.modalServ.popDismiss("", 'apply');
  }



  async showDeveloperData(item: any) {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: item.apps_page_frame_seqid,
      item_seq_id: item.apps_item_seqid
    };
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: item,
        runEvents: item.runEvents
      }
    });
    return await modal.present();
  }

  onItemSelect(item: any, ev?) {
    // this.selectAllCheckbox.checked=false;
    // alert(item.checked);
    if (!item.removeFromList) {
      if (ev && !ev.detail.checked && !item.checked) {
        this.selectAllCheckbox.checked = false;
      }
      let ind = this.removeItemModelData(item);
      if (item.checked && ind == undefined) {
        // item.cb_select = "T";
        item.cb_select = "Y";
        item.item_visible_flag = 'T';
        this.setItemModelData(item);
        // this.checkAllDataSelectAll();


      } else if (!item.checked) {
        // this.selectAllCheckbox.checked=false;
        if ( ind != undefined) {
          this.dispColFrame.tableRows.splice(ind, 1);
           this.dispColFrame.tableRows = [...this.dispColFrame.tableRows]; // CRITICAL VIRTUAL SCROLL RE-RENDER
        }

        // this.checkAllDataSelectAll();
      }
      // this.checkAllDataSelectAll();
    } else {
      delete item["removeFromList"]
    }
  }

  setItemModelData(item) {
    // console.log("set item on change" + item.prompt_name);
    let itemDatatype: any;
    let frameData: any = JSON.parse(JSON.stringify(this.dispColFrame.Level4));
    for (let advData of frameData) {
      for (let disitem of advData.Level5) {
        for (let itm of Object.keys(item)) {

          if (itm == (disitem.item_name.toLowerCase())) {
            // console.log(" item condition " + itm + " " + advitem.item_name+" datatype "+item.datatype);
            disitem.value = item[itm] ? item[itm] : "";
            if (item.datatype.includes("VARCHAR")) {
              disitem.newdatatype = "VARCHAR";
              // console.log("datatype : " + disitem.newdatatype);
            } else {
              disitem.newdatatype = item.datatype;
              // console.log("datatype : " + disitem.newdatatype);

            }
          }
        }

        if (disitem.item_name == 'CB_SELECT') {
          disitem.isChecked = true;
          disitem.value = 'Y';

          // console.log(disitem);
        }
        // if(disitem.item_name=='CB_SELECT'){
        //   disitem.value='Y';
        //   console.log(disitem);
        // }
      }
    }

    // this.dispColFrame.tableRows.push(frameData);
      // Fix: Instead of a hidden .push(), assign a brand new shallow array copy 
  this.dispColFrame.tableRows = [...this.dispColFrame.tableRows, frameData]; // CRITICAL VIRTUAL SCROLL RE-RENDER
    // console.log(this.dispColFrame);

  }

  removeItemModelData(item) {
    // console.log("remove item on change" + item.prompt_name);
    let i = 0;
    for (let advData of this.dispColFrame.tableRows) {
      for (let itemData of advData) {
        for (let disitem of itemData.Level5) {

          if (disitem.item_name == "ITEM_NAME" && disitem.value == item.item_name) {
            return i;
          }
        }
      }
      i++;
    }
  }




  ngOnDestroy() {
    // console.clear();
  }


  // drop(event: CdkDragDrop<any[]>) {
  //   for (let frameGrp of this.object.Level2) {
  //     for (let frme of frameGrp.Level3) {
  //       if (frme.frame_alias == "DISP_COL") {
  //         moveItemInArray(frme.tableRows, event.previousIndex, event.currentIndex);
  //       }
  //     }
  //   }
  // }

    drop(event: CdkDragDrop<string[]>) {
        // 1. Get the rock-solid previous index saved in the drag data attributes
    const truePreviousIndex = event.item.data;

    // 2. Compute how many steps the CDK *thinks* it moved in the visible DOM window
    const domesticIndexShift = event.currentIndex - event.previousIndex;

    // 3. Extrapolate the true absolute target destination index 
    const trueCurrentIndex = truePreviousIndex + domesticIndexShift;

    if (trueCurrentIndex >= 0 && trueCurrentIndex < this.dispColFrame.tableRows.length) {
      // 3. Move the item safely within your main immutable data array
       moveItemInArray(this.dispColFrame.tableRows, truePreviousIndex, trueCurrentIndex);
      // 4. Force a data re-render on your data source
      this.dispColFrame.tableRows = [...this.dispColFrame.tableRows];
    }
  }

  // moveUp(index: number) {
  //   for (let frameGrp of this.object.Level2) {
  //     for (let frme of frameGrp.Level3) {
  //       if (frme.frame_alias == "DISP_COL") {
  //         if (index > 0) {
  //           const temp = frme.tableRows[index - 1];
  //           frme.tableRows[index - 1] = frme.tableRows[index];
  //           frme.tableRows[index] = temp;
  //         }
  //       }
  //     }
  //   }
  // }


  // moveDown(index: number) {
  //   for (let frameGrp of this.object.Level2) {
  //     for (let frme of frameGrp.Level3) {
  //       if (frme.frame_alias == "DISP_COL") {
  //         if (index < frme.tableRows.length - 1) {
  //           const temp = frme.tableRows[index + 1];
  //           frme.tableRows[index + 1] = frme.tableRows[index];
  //           frme.tableRows[index] = temp;
  //         }
  //       }
  //     }
  //   }
  // }

  moveUp(index: number) {
    if (index > 0) {
      // Moves item from current index to (index - 1)
      moveItemInArray(this.dispColFrame.tableRows, index, index - 1);

      // Force Angular/Virtual Scroll to see the array change
      this.dispColFrame.tableRows = [...this.dispColFrame.tableRows];
    }
  }

  // Move Row DOWN
  moveDown(index: number) {
    if (index < this.dispColFrame.tableRows.length - 1) {
      // Moves item from current index to (index + 1)
      moveItemInArray(this.dispColFrame.tableRows, index, index + 1);

      // Force Angular/Virtual Scroll to see the array change
      this.dispColFrame.tableRows = [...this.dispColFrame.tableRows];
    }
  }
  removeItem(index: any, framedata) {
    // for (let frameGrp of this.object.Level2) {
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
    //     }
    //   }
    // }
    for (let itemGroup of this.dispColFrame.tableRows[index]) {
      for (let item of itemGroup.Level5) {
        if (item.item_name == "CB_SELECT") {
          item.value = 'N';
        }
      }
      break;
    }
    this.dispColFrame.tableRows.splice(index, 1);
     this.dispColFrame.tableRows = [...this.dispColFrame.tableRows]; // CRITICAL VIRTUAL SCROLL RE-RENDER

    //item_name
    let itemPromptName = ""

    for (let itemGroup of framedata) {
      for (let section of itemGroup.Level5) {
        if (section.item_name == 'PROMPT_NAME') {
          itemPromptName = section.value
        }
      }
    }
    for (let framedata of this.allColLevel4) {
      for (let item of framedata.Level5) {
        if (item.prompt_name == itemPromptName) {
          item.checked = false;
          // item.cb_select="N"
          item.removeFromList = true
        }
      }
    }
    this.selectAllCheckbox.checked = false
  }

  openLov(itemName, btn, frame, i) {
    frame.active_row = i;


    console.log("index  ", i + " item name " + itemName + "  btn " + btn);
    let allitem = this.lhs_lib.get_item('all_col.' + itemName, 0);
    let item = this.lhs_lib.get_item('disp_col.FILTER_CLAUSE', i);

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
      this.modalServ.popDismiss(item, 'notDismiss');
    }


  }

  searchItem(value) {
    this.searchableData = [];

    // for (let frameGroup of this.allColLevel4) {
    //   for (let itm of frameGroup.Level5) {
    //     if (event.detail.value.length > 0) {
    //       console.log("item prompt name ; ", itm.prompt_name)
    //       if (itm.prompt_name) {
    //         if ((itm.prompt_name).toLowerCase().includes((event.detail.value).toLowerCase())) {
    //           this.searchableData.push(itm);
    //         }
    //       }
    //     }
    //   }
    // }


    if (!this.grpByFlag) {
      // this.grpByFlag=false;

      for (let frameGroup of this.allColLevel4) {
        for (let itm of frameGroup.Level5) {
          if ((itm.datatype && itm.datatype.includes(this.datatype)) || this.datatype == 'ALL') {
            if (value.length > 0) {
              // console.log("item prompt name ; ", itm.prompt_name)
              if (itm.prompt_name) {
                if ((itm.prompt_name).toLowerCase().includes((value).toLowerCase())) {
                  this.searchableData.push(itm);
                }
              }
            }
          }
        }
      }
    }
    if (this.grpByFlag) {
      for (let grpData of this.grpByArr) {
        if (grpData.groupname == this.grpDataName) {
          for (let itm of grpData.groupnameARR) {
            if ((itm.prompt_name).toLowerCase().includes((value).toLowerCase())) {
              this.searchableData.push(itm);
            }
          }
        }
      }
    }
    // if(event.detail.value=="" || event.detail.value==null ||event.detail.value==undefined){
    //   this.grpByFlag=false;
    // }
    this.checkAllDataSelectAll();
    console.log("flag : " + this.grpByFlag);
  }



  clearAll() {
    for (let framedata of this.allColLevel4) {
      for (let item of framedata.Level5) {
        if (item.checked) {
          item.checked = false;
        }
      }
    }


    if (this.grpByArr && this.grpByArr.length > 0) {
      for (let group of this.grpByArr) {
        for (let item of group.groupnameARR) {
          if (item.checked) {
            item.checked = false;
          }
        }
      }
    }


    this.searchableData = [];


    if (this.dispColFrame) {
      this.dispColFrame.tableRows = [];
    }

    this.datatype = 'VARCHAR';
    this.activeDatatype = 'VARCHAR';
    this.grpByFlag = false;
  }

  clearthis() {
    for (let framedata of this.allColLevel4) {
      for (let item of framedata.Level5) {
        if ((item.datatype && item.datatype.includes(this.datatype)) || this.datatype === 'ALL') {
          if (item.checked) {
            item.checked = false;
          }
        }
      }
    }

    if (this.dispColFrame && this.dispColFrame.tableRows) {
      let remainingRows = [];

      for (let row of this.dispColFrame.tableRows) {
        let shouldKeep = true;

        for (let itemGroup of row) {
          for (let item of itemGroup.Level5) {
            if (item.item_name === 'ITEM_NAME') {
              let originalItem = this.findOriginalItem(item.value);
              if (originalItem &&
                ((originalItem.datatype && originalItem.datatype.includes(this.datatype)) ||
                  this.datatype === 'ALL')) {
                shouldKeep = false;
                break;
              }
            }
          }
          if (!shouldKeep) break;
        }

        if (shouldKeep) {
          remainingRows.push(row);
        }
      }

      this.dispColFrame.tableRows = remainingRows;
    }
  }

  private findOriginalItem(itemName: string) {
    for (let framedata of this.allColLevel4) {
      for (let item of framedata.Level5) {
        if (item.item_name === itemName) {
          return item;
        }
      }
    }
    return null;
  }
  addDuplicateField(itm, i) {
    let item = JSON.parse(JSON.stringify(itm));
    item.copied = true;
    this.dispColFrame.tableRows.splice(i + 1, 0, item)
  }
  setDropDownItem(framedata, value) {
    if (framedata.copied) {
      for (let itemGroup of framedata) {
        for (let item of itemGroup.Level5) {
          if (item.item_name == 'PROMPT_NAME') {
            item.value = item.value + "_" + value;
            console.log(item.value);
          }
          if (item.item_name == 'ITEM_NAME') {
            item.value = item.value + "_" + value;
            console.log(item.value);
          }
        }
      }
    }
  }
  setAdvanceFilterData(tableRowFiter: any) {
    console.log("table row fiter : ", tableRowFiter);











    // this.remove_adv_filter_row();
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
            // if (advitem.item_name == "WMA_RECORD_STATUS") {
            advitem.frame_status = "dirty";
            // }
          }
        }
        table_rows.push(frameData);
        console.log("table row created : ", table_rows);
        // this.set_adv_filter_values(table_rows);

      }


      this.advFilterFrame.tableRows = JSON.parse(JSON.stringify(table_rows));


      // this.set_adv_filter_values(table_rows);

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
      //       for(let trData of table_rows){
      //         // for(let tr of trData.Level5){
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





      // tabRows.push(table_rows[0]);
      // this.advFilterFrame.tableRows=tabRows;
    }
    console.log(this.advFilterFrame.tableRows);
  }

  removeAllSelectedData() {
    if (!this.grpByFlag && !this.searchableData.length) {
      for (let framedata of this.allColLevel4) {
        for (let item of framedata.Level5) {
          item.checked = false;
          this.onItemSelect(item)
        }
      }
    }
  }
  selectAllData() {

    let checkedstatus;
    if (this.selectAllCheckbox.checked) {
      checkedstatus = false;
    } else {
      checkedstatus = true;
    }

    if (this.grpByFlag) {

      if (this.grpByFlag && this.searchableData.length < 1) {
        for (let grpData of this.grpByArr) {
          if (grpData.groupname == this.grpDataName) {
            for (let item of grpData.groupnameARR) {
              if (!item.prompt_name.includes("WMA")) {
                if (checkedstatus) {
                  item.checked = true;
                  this.onItemSelect(item);
                } else {
                  item.checked = false;
                  this.onItemSelect(item);
                }

              }
            }
          }
        }
      }
    }

    if (!this.grpByFlag && this.searchableData.length < 1) {
      console.log("all data ");
      for (let framedata of this.allColLevel4) {
        for (let item of framedata.Level5) {
          if (((item.datatype && item.datatype.includes(this.datatype)) || this.datatype == 'ALL') && item.prompt_name) {
            if (!item.prompt_name.includes("WMA")) {
              if (checkedstatus) {
                item.checked = true;
                this.onItemSelect(item);
              } else {
                item.checked = false;
                this.onItemSelect(item);
              }
            }
          }
        }
      }
    }


    if (this.searchableData.length > 0) {
      for (let itm of this.searchableData) {
        if (!itm.prompt_name.includes("WMA")) {
          if (checkedstatus) {
            itm.checked = true;
            this.onItemSelect(itm);
          } else {
            itm.checked = false;
            this.onItemSelect(itm);
          }
        }
      }
    }
    // this.checkAllDataSelectAll();
    // alert(this.selectAllCheckbox.checked);

  }



  checkAllDataSelectAll() {
    console.log("check all data select all")
    let breakflag = false;
    if (!this.grpByFlag && this.searchableData.length < 1) {
      for (let framedata of this.allColLevel4) {
        for (let item of framedata.Level5) {
          if (item.checked && item.checked == true) {
            this.selectAllflag = true;
          } else {
            this.selectAllflag = false;
          }
        }
      }
    }

    // this.removeAllSelectedData();
    // if(this.grpByFlag){
    if (this.grpByFlag) {
      for (let grpData of this.grpByArr) {
        if (grpData.groupname == this.grpDataName) {
          for (let item of grpData.groupnameARR) {
            if (item.checked && item.checked == true) {
              if (!breakflag) {
                this.selectAllflag = true;
              } else {
                break;
              }
            } else {
              breakflag = true
              this.selectAllflag = false;
              break
            }
          }
        }
        if (breakflag) {
          break
        }
      }
    }
    // }

    if (!this.grpByFlag && this.searchableData.length < 1) {
      console.log("all data ");
      for (let framedata of this.allColLevel4) {
        for (let item of framedata.Level5) {
          if (((item.datatype && item.datatype.includes(this.datatype)) || this.datatype == 'ALL') && item.prompt_name) {
            // if(item.checked && item.checked==true){
            //   this.selectAllflag=true;
            // }else{
            //   this.selectAllflag=false;
            // }
            if (item.checked && item.checked == true) {
              if (!breakflag) {
                this.selectAllflag = true;
              } else {
                break;
              }
            } else {
              breakflag = true
              this.selectAllflag = false;
              break
            }
          }
        }
        if (breakflag) {
          break
        }
      }
    }
    if (this.searchableData.length > 0) {
      for (let itm of this.searchableData) {
        // if(itm.checked && itm.checked==true){
        //   this.selectAllflag=true;
        // }else{
        //   this.selectAllflag=false;
        // }
        if (itm.checked && itm.checked == true) {
          if (!breakflag) {
            this.selectAllflag = true;
          } else {
            break;
          }
        } else {
          breakflag = true
          this.selectAllflag = false;
          break
        }
      }
    }
    //  alert(this.selectAllflag);
    if (this.selectAllflag) {
      this.selectAllCheckbox.checked = true;
    } else {
      this.selectAllCheckbox.checked = false;
    }
  }
  remove_adv_filter_row() {

    if (this.advFilterFrame.tableRows) {
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

 onSearchChange(value){
    this.searchText.set(value);

  this.searchItem(value);
 }
 clearSearch(type: string,isgrp?) {
  if(isgrp){
    this.showGroupBy(type)
  }else{
    this.toggleItm(type);
  }
  this.searchText.set('');

  this.searchItem('');
 }
}