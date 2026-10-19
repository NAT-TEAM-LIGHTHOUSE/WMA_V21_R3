import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, OnDestroy, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';

@Component({
standalone : true,
changeDetection: ChangeDetectionStrategy.OnPush,
imports:[STANDALONE_IMPORTS,NgSelectModule],
  selector: 'app-select-input-n',
  templateUrl: './select-input-n.component.html',
  styleUrls: ['./select-input-n.component.scss'],
})
export class SelectInputNComponent implements OnInit, OnDestroy {

  @Input() selectinput: any;
  @Input() l_wscp: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() parentComponent: any;
  @Input() frame: any;
  @Input() frame_type: any;
  @Input() frameSeqId:any
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;

  event: any;

  item_sub_type = '';
  current_page_parameter: any = {};
  autoValue: any;
  developerModeData: any;
  searchText: any;
  object_arr: any = [];
  Object_code: any = [];
  objectList: any = [];
  userDetails: any;
  wscp: any = {};
  wsdp: any = [];
  keyList = [];
  valuesList = [];
  sessiovalue: any;
  selectModel: any;
  autoCompleteflag: boolean = true;
  fullList: boolean = false;
  subscribeRefreshFlag = false;
  col1 = 3;
  col2 = 9;
  select = 'abc'
  platformVal: any = 'browser';
  selectedInput: any;
  selectedValue: string = 'option2';
  constructor(public modalCtrl: ModalController, public events: Events, public platform: Platform, private ngZone: NgZone,
    public globalObjects: GlobalObjectsService, private dataService: DataService, private zone: NgZone,
    private sqlServ: SqlLiteService, public lhs_lib: LhsLibService, private cdr: ChangeDetectorRef, private cdEngine: CdEngineService) {
      this.userDetails = JSON.parse(JSON.stringify(this.globalObjects.userDetails));
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"select-input-n")
    }
  }

  ngOnInit() {
    this.cdEngineCall(true);
    this.selectedInput = this.select;
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.platformVal = 'mobile';
    } else {
      this.platformVal = 'browser';
    }

    let nameSeq = "refreshItem_" + this.selectinput.apps_item_seqid + '_' + this.selectinput.indexcount;
    let nameItem = "refreshItem_" + this.selectinput.item_name + '_' + this.selectinput.indexcount;
    if (!this.subscribeRefreshFlag) {
      this.events.unsubscribe(nameItem);
      this.events.subscribe((nameItem), res => {
        if (res.evFlag == "T") {
          res.evFlag = "F";
          this.selectinput.dropdownList = [];
          this.valuesList = [];
          this.selectModel = null;
          this.getdata();
        }
      })
      this.events.unsubscribe(nameSeq);
      this.events.subscribe((nameSeq), res => {
        if (res.evFlag == "T") {
          res.evFlag = "F";
          this.selectinput.dropdownList = [];
          this.valuesList = [];
          this.selectModel = null;
          this.getdata();
        }
      })
      this.subscribeRefreshFlag = true;
    }

    if (this.frame_type == 'ENTRY_TABLE' || this.frame_type == 'HORIZONTAL_TABLE' || this.frame_type == 'TABLE') {
      if (this.selectinput.item_sub_type && this.selectinput.item_sub_type.indexOf('CB') > -1) {
        this.selectinput.item_sub_type = 'DROP_DOWN_CB_BOX_TOP';
      } else if (this.selectinput.item_sub_type && this.selectinput.item_sub_type.indexOf('COMBO') > -1) {
        this.selectinput.item_sub_type = 'COMBO_BOX_TOP';

      } else if (this.selectinput.item_sub_type && this.selectinput.item_sub_type == 'DROP_DOWN_CHIP') {


      } else {
        this.selectinput.item_sub_type = 'DROP_DOWN_BOX_TOP';
      }
    }

    if (this.selectinput.position && (this.selectinput.position.indexOf("column") > -1)) {
      let arr = this.selectinput.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    } else if (this.selectinput.promptCol) {
      this.col1 = this.selectinput.promptCol;
      this.col2 = (12 - parseFloat(this.selectinput.promptCol));
    }

    if (this.selectinput.input_pattern) {
      let dropdownList = [];
      if (this.selectinput.input_pattern.indexOf("#") > -1) {
        let radioarr = [];
        if (this.selectinput.input_pattern.indexOf(",") > -1) {
          radioarr = this.selectinput.input_pattern.split(",");
        } else {
          radioarr[0] = this.selectinput.input_pattern;
        }
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
        this.selectinput.dropdownList = dropdownList;

        if (this.selectinput.value) {
          this.selectModel = this.selectinput.value;
        } else {
        }
      } else {
      }

    }
    else {
      if (!this.selectinput.lov_code) {
        if (this.selectinput.dropdownList && this.selectinput.dropdownList.length > 0) {
          this.selectinput.value = this.selectinput.dropdownList[0].val;
          this.selectModel = this.selectinput.value;
          this.selectinput.isValid = true;
          if (this.selectinput.item_sub_type.indexOf("DROP_DOWN_CB") > -1) {
            this.selectModel = this.selectinput.value.split(",");
          }
        }
      }
    }

    if (this.selectinput.value && this.selectinput.value.indexOf(',') > -1 && this.selectinput.item_sub_type.indexOf('CB') > -1) {
      let val = this.selectinput.value.split(",");
      console.log(val)
      this.selectinput.value = val.join();
    }

    if (this.selectinput.data_required_flag == 'T' || (this.selectinput.prompt_name && this.selectinput.prompt_name[this.selectinput.prompt_name.length - 1] == '*')) {
      this.selectinput.isValid = this.selectinput.value ? true : false;
    } else {
      this.selectinput.isValid = true;
    }

    let evName = "testDD" + this.selectinput.apps_item_seqid;
    this.events.unsubscribe(evName);
    this.events.subscribe(evName, () => {
      this.selectinput.dropdownList = [];
      this.valuesList = [];

      this.selectModel = null;
      this.getdata();
    })
    if (!this.selectModel && this.selectinput.position == 'floating' && this.selectinput.item_type != 'DD_BROWSER') {
      let obj = {
        "position": "absolute",
        "top": "10px",
      }

      this.selectinput.labelStyle = obj;

      let obj1 = {
        "margin-top": "25px"
      }
      this.selectinput.marginStyle = obj1;

    } else if (this.selectinput.item_type != 'DD_BROWSER') {
      let obj = {
        "position": "absolute",
        "top": "0px",
      }
      let obj1 = {
        "margin-top": "25px"
      }
      this.selectinput.marginStyle = obj1;
      this.selectinput.labelStyle = obj;
    }

    if (this.selectinput.on_load_events_str) {
      this.selectinput.itemClicked = 'load';
      this.emitOnChange.emit(this.selectinput);
    }

    
  }

  getdata() {
    if (!this.selectinput.objectData) {
      this.globalObjects.showLoading();
      this.wscp.service_type = "get_lov_data";
      this.wscp.lov_code = this.selectinput.lov_code;
      this.wscp.apps_page_no = this.selectinput.apps_page_no;
      this.wscp.apps_page_frame_seqid = this.selectinput.apps_page_frame_seqid;
      this.wscp.apps_item_seqid = this.selectinput.apps_item_seqid;
      this.wscp.apps_working_mode = this.selectinput.apps_working_mode;
      // this.userDetails = this.globalObjects.userDetails;
      this.wscp["object_code"] = this.selectinput.object_code;
      this.wsdp = [];
      let col = {};
      let rowindex;
      if (this.selectinput.indexcount) {
        rowindex = this.selectinput.indexcount;
      } else {
        rowindex = 0;
      }

      if (this.parentComponent) {
        if (this.parentComponent.frame.tableRows) {
          for (let itemGroup of this.parentComponent.frame.tableRows[rowindex]) {
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
        } else {
          for (let itemGroup of this.parentComponent.frame) {
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
        }
      } else {
        if (this.frame.tableRows) {
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
        } else {
          for (let itemGroup of this.frame) {
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
        }
      }
      this.wsdp.push(col);
      let newWsdp = [];
      if (this.parentComponent && this.parentComponent.wsdp && this.parentComponent.wsdp.length > 0) {
        newWsdp.push(Object.assign(this.parentComponent.wsdp[0], this.wsdp[0]));
      } else {
        newWsdp = this.wsdp;
      }
      let reqData: any = {};
      reqData = {
        "wslp": this.userDetails,
        "wscp": this.wscp,
        "wsdp": [],
        "wsdpcl": this.lhs_lib.getDpcl(this.selectinput.calling_frame_seqid_str,null,true)

      }
      let objectKey = this.wscp.object_code + "_DD_" + this.wscp.apps_item_seqid;
      this.sqlServ.getById(objectKey, 'item_master').then(data => {
        if ((data.resStatus == 'Success') && !this.globalObjects.networkStatus) {

          let objData: any = JSON.parse(data.resData.itemData);
          this.objectList = objData.Level1;

          for (let x of this.objectList) {
            let datavalue: any = {};
            let data1: any = [];
            for (let data in x) {
              let c = [];
              if (data != "Level2") {
                c = x[data];
                data1.push(c);
                datavalue.val = (data1[0]);
                datavalue.key = (data1[1]);
              }
            }
            datavalue.item = x;
            this.valuesList.push(datavalue);
          }
          this.selectinput['dropdownList'] = this.valuesList;
          if (this.selectinput.item_type == 'DD_BROWSER' && this.valuesList.length == 1) {
            this.selectinput.value = this.valuesList[0].val;
            this.selectinput.codeOfValues = this.valuesList[0].key;
          }

          if (this.selectinput.value) {

            this.selectModel = this.selectinput.value;
            this.selectinput.isValid = true;
            // this.ngZone.run(() => {
            //   this.cdr.detectChanges();
            // })
            if (this.selectinput.item_sub_type == 'DROP_DOWN_CB') {
              this.selectModel = this.selectinput.value.split(",");
            }
          }
          else {
            if (!this.selectinput.lov_code) {
              if (this.valuesList && this.valuesList.length > 0) {
                this.selectinput.value = this.valuesList[0].val;
                this.selectModel = this.selectinput.value;
                this.selectinput.isValid = true;
                // this.ngZone.run(() => {
                //   this.cdr.detectChanges();
                // })
              }
            }
          }
        }
        else {
          this.dataService.postData("S2U", reqData).then(async res => {

            let data: any = res;
            if (data.responseStatus && data.responseStatus.includes("success")) {
              // Developer Mode Loging

              let objData: any = {};
              if (data.responseStatus.toLowerCase().includes("-rc")) {

                // objData.Level1 = this.globalObjects.setPageInfoNoS2U(data.responseData);
                let {tableData} = this.lhs_lib.generateDataForLov(this.selectedInput,data);
                       
                objData.Level1 = tableData;

              } else {
                objData = this.globalObjects.setPageInfo(data.responseData);
              }

                this.objectList = objData.Level1;
                this.selectinput.objectData = objData;

                let name = this.selectinput.apps_page_frame_seqid + "." + this.selectinput.apps_item_seqid;
                let ind = this.selectinput.itemIndex != undefined ? this.selectinput.itemIndex : (this.selectinput.indexcount ? this.selectinput.indexcount : (this.selectinput.indexCount ? this.selectinput.indexCount : 0));
                // let tabItem = await this.lhs_lib.get_item(name, ind);
                // let leve4Item = await this.lhs_lib.get_rows_item(this.parentComponent.frame.Level4,this.selectinput.apps_item_seqid);

                // if (tabItem) {
                //   tabItem.objectData = objData;
                // }
                // if (leve4Item) {
                //   leve4Item.objectData = objData;
                // }
                if (objData && objData.Level1) {
                  this.lhs_lib.set_item_config(name, 'objectData', objData, null);
                } else {
                  this.lhs_lib.set_item_config(name, 'objectData', null, null);
                }
                // this.Object_code = objData.Level1;
                this.setDDListData();
              
            } else {
              if (this.selectinput['item_type'] == 'DD' && this.selectinput['input_pattern']) {
                if (this.selectinput['input_pattern'].indexOf('#') > -1) {
                  let dropVal: any = [];
                  dropVal = this.selectinput['input_pattern'].split('#');
                  let dropdownList = [];
                  for (let y of dropVal) {
                    let c = y.split("~");
                    let dVal: any = {};
                    dVal.key = c[0];
                    dVal.val = c[1];
                    dropdownList.push(dVal);
                    this.selectinput.dropdownList = dropdownList;

                    if (this.selectinput.value) {
                      this.selectModel = this.selectinput.value;
                      if (this.selectinput.item_sub_type == 'DROP_DOWN_CB') {
                        this.selectModel = this.selectinput.value.split(",");
                      }
                      // this.ngZone.run(() => {
                      //   this.cdr.detectChanges();
                      // })
                    }
                    else {
                    }
                  }
                }
              }
            }
            // this.ngZone.run(() => {
            //   this.cdr.detectChanges();
            // })
          }).catch(err => {
            this.globalObjects.presentToast("44 Something went wrong please try again later!");
          })
        }

      })
    } else {
      this.setDDListData();
    }
  }



  onChange(onChange) {
    if (!onChange) {
      onChange = "";
    }
    if (this.frame_type == 'ENTRY_TABLE' || this.frame_type == 'HORIZONTAL_TABLE' || this.frame_type == 'TABLE') {
      this.selectinput.value = onChange;
    }
    this.selectModel = this.selectinput.value;

    if (this.selectinput.msgError) {
      this.selectinput.msgError = "";
    }
    if (this.selectinput.item_sub_type == 'T_LIST') {
      this.selectinput.isValid = true;
    }

    if (this.selectinput.position == 'floating' && this.selectinput.item_type != 'DD_BROWSER') {

      let obj = {
        "position": "absolute",
        "top": "0px",
      }
      let obj1 = {
        "margin-top": "25px"
      }
      this.selectinput.marginStyle = obj1;
      this.selectinput.labelStyle = obj;
    }

    if (this.selectinput.item_sub_type.indexOf('CB') > -1) {
      this.selectinput.value = onChange.join();
    } else {
      this.selectinput.value = onChange;

    }


    // setTimeout(() => {
    //   this.zone.run(() => {
    //     this.cdr.detectChanges();
    //   });
    // }, 1);
    // console.log('val8')
    this.validateInput();

    let val: any;
    let ddArr = JSON.parse(JSON.stringify(this.selectinput));
    if (ddArr.value && typeof (ddArr.value) == 'object') {
      for (let x of ddArr.value) {
        if (val) {
          val = val + ',' + x;
        } else {
          val = x;
        }
      }
    }

    if (val) {
      this.selectinput.value = JSON.parse(JSON.stringify(val));
    } else {
      if (this.selectinput.item_sub_type.indexOf('CB') > -1) { }
      else {
        this.selectinput.value = onChange;
      }
    }
    let itemFlag = [];
    let tablerows = []
    tablerows = this.parentComponent ? this.parentComponent.frame.tableRows : this.frame.tableRows;

    for (let d of ddArr.dropdownList) {

      if (d.val == onChange) {
        for (let l in d.item) {
          let coldata;
          if (l.indexOf("#") > -1) {
            coldata = l.split("#")[0];
          } else {
            coldata = l;
          }
          if (coldata.toLowerCase().split("~")[1] == 'item_visible_flag') {
            let item = d.item[l].split('~');
            for (let a of item) {
              let flag = a.split('=');
              let obj = {
                key: flag[0],
                value: flag[1]
              }
              itemFlag.push(obj);
            }
          }
        }
      }
    }

    if (itemFlag.length > 0) {
      this.selectinput.itemFlagForVisible = itemFlag;
    }

    if (ddArr.lov_return_column_str) {
      if (ddArr.lov_return_column_str.indexOf(";") > -1) {
        this.setReturnData();
      }
      else {
        let lov_return_key = ddArr.lov_return_column_str.split("#");
        let tablerows = [];
        if (this.parentComponent) {
          if (this.parentComponent.frame.apps_frame_type == "ENTRY_TABLE") {
            tablerows[0] = this.parentComponent.frame.tableRows[ddArr.indexCount];
          } else {
            tablerows = this.parentComponent.frame.tableRows;
          }
        } else {
          if (this.frame.apps_frame_type == "ENTRY_TABLE") {
            tablerows[0] = this.frame.tableRows[ddArr.indexCount];
          } else {
            tablerows = this.frame.tableRows;
          }
        }

        if (tablerows) {
          for (let tabledata of tablerows) {
            for (let itemGroup of tabledata) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  for (let lovKey of lov_return_key) {
                    if (item.item_name && lovKey.toUpperCase() == item.item_name.toUpperCase()) {
                      for (let d of ddArr.dropdownList) {
                        if (d.val == onChange) {
                          for (let x in d.item) {
                            let k;
                            if (x.indexOf("#") > -1) {
                              k = x.split("#")[0];
                            } else {
                              k = x
                            }
                            if (item.item_name.toUpperCase() == k.toUpperCase().split("~")[1]) {

                              item.value = d.item[x];
                              if (item.item_type == "L") {
                                item.codeOfValues = d.item[x];
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  if (itemFlag.length > 0) {
                    for (let f of itemFlag) {
                      if (item.item_name.toUpperCase() == f.key.toUpperCase()) {
                        item.item_visible_flag = f.value;
                      }
                    }
                  }
                }
              }
            }
          }

        } else {
          for (let lovKey of lov_return_key) {
            if (ddArr.item_name && lovKey.toUpperCase() == ddArr.item_name.toUpperCase()) {
              for (let d of ddArr.dropdownList) {
                for (let x in d.item) {
                  let k;
                  if (x.indexOf("#") > -1) {
                    k = x.split("#")[0];
                  } else {
                    k = x
                  }
                  if (ddArr.item_name.toUpperCase() == k.toUpperCase().split("~")[1]) {
                    ddArr.value = d.item[x];
                    ddArr.codeOfValues = d.item[x]
                  }
                }
              }
            }
          }
        }
      }
    } else {
      if (itemFlag.length > 0) {
        if (tablerows) {
          for (let tabledata of tablerows) {
            for (let itemGroup of tabledata) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  for (let f of itemFlag) {
                    if (item.item_name.toUpperCase() == f.key.toUpperCase()) {
                      item.item_visible_flag = f.value;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    this.selectinput.itemClicked = 'post';
    this.emitOnChange.emit(this.selectinput);
  }

  setReturnData() {
    let lov_return_key = this.selectinput.lov_return_column_str.split(";");
    if (lov_return_key && lov_return_key[lov_return_key.length - 1] == "") {
      lov_return_key.pop();
    }
    for (let retStr of lov_return_key) {
      let values = [];
      if (retStr.indexOf("!=") > -1) {
        values = retStr.split("!=");
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

      if (values[1] && values[1].indexOf(".") > -1) {
        values[1] = values[1].split(".")[1];
      }
      for (let lVal of this.selectinput.dropdownList) {
        if (lVal.val == this.selectinput.value) {
          for (let item in lVal.item) {
            if (item != "Level2") {
              let itemName = item.split("~")[1].split("#")[0]
              if (itemName.toLowerCase() == values[1].toLowerCase()) {
                this.lhs_lib.set_item_value(this.selectinput, values[0], this.selectinput.indexcount ? this.selectinput.indexcount : this.selectinput.indexCount, lVal.item[item], false, true);

              }
            }
          }
        }
      }
    }
  }


  onClear() {
    this.selectinput.flag = false;
    this.selectinput.value = '';
    this.autoValue = '';
  }

  async showDeveloperData() {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: this.selectinput.apps_page_frame_seqid,
      item_seq_id: this.selectinput.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.selectinput,
        runEvents: this.selectinput.runEvents
      }
    });
    return await modal.present();
  }

  setDDListData() {
    //-------------------OFFLINE DROPDOWN SAVE ---------------------------------------------------//
    let offlineObjectCode: any;
    let objData = this.selectinput.objectData;
    if (objData && this.l_wscp && this.l_wscp.apps_working_mode == 'I') {
      if (this.userDetails) {
        if (this.wscp.object_code) {
          offlineObjectCode = this.wscp.object_code + "_DD_" + this.selectinput.apps_item_seqid;
        }
      }
      let pouchObjectKey = offlineObjectCode;

      var temp: any = {};
      var id = pouchObjectKey;
      this.sqlServ.getById(id, 'item_master').then((localData: any) => {
        temp.objData = JSON.stringify(objData);
        temp.id = id;

        if (localData.resStatus == 'Success') {
          temp.rev = localData.resData._rev;
          this.sqlServ.updateObjMast(temp, 'item_master').then(() => { })
        } else {
          this.sqlServ.postDataSql(temp, 'item_master');
        }
      })
    }

    //-------------------OFFLINE DROPDOWN SAVE ---------------------------------------------------//

    for (let x of this.selectinput.objectData.Level1) {
      let datavalue: any = {};
      let data1: any = [];
      for (let data in x) {
        let c = [];
        if (data != "Level2") {
          c = x[data];
          data1.push(c);
          datavalue.val = (data1[0]);
          datavalue.key = (data1[1]);
        }
      }
      datavalue.item = x;
      this.valuesList.push(datavalue);
    }
    this.selectinput['dropdownList'] = this.valuesList;
    if (this.selectinput.item_type == 'DD_BROWSER' && this.valuesList.length == 1) {
      this.selectinput.value = this.valuesList[0].val;
      this.selectinput.codeOfValues = this.valuesList[0].key
    }

    if (this.selectinput.value) {

      this.selectModel = this.selectinput.value;
      this.selectinput.isValid = true;
      if (this.selectinput.item_sub_type.indexOf("DROP_DOWN_CB") > -1) {
        this.selectModel = this.selectinput.value.split(",");
      }

      if (this.selectinput.item_sub_type.indexOf('CB') > -1) {
        this.selectModel = this.selectinput.value.split(",");
      }
    }
    else {
      if (!this.selectinput.lov_code) {
        if (this.valuesList && this.valuesList.length > 0) {
          if (!this.selectinput.lov_code) {
            this.selectinput.value = this.valuesList[0].val;
            this.selectModel = this.selectinput.value;
            this.selectinput.isValid = true;
            if (this.selectinput.item_sub_type.indexOf("DROP_DOWN_CB") > -1) {
              this.selectModel = this.selectinput.value.split(",");
            }
          }
        }
      }
    }

    this.cdr.detectChanges();

    //  setTimeout(() => {
    //   this.zone.run(() => {
    //     this.cdr.detectChanges();
    //   });
    // }, 1);
    // console.log('val14')
  }

  validateInput() {
    if (((this.selectinput.data_required_flag && this.selectinput.data_required_flag == 'T') || (this.selectinput.prompt_name && this.selectinput.prompt_name[this.selectinput.prompt_name.length - 1]) == '*')) {
      if (this.selectinput.value) {
        this.selectinput.isValid = true;
      } else {
        this.selectinput.isValid = false;
        this.selectinput.vadidateMsg = this.selectinput.tool_tip ? this.selectinput.tool_tip : "Please enter " + this.selectinput.prompt_name;
      }
    } else {
      this.selectinput.isValid = true;
    }
  }

  clearValue(ev) {
    if(this.selectinput.item_enable_flag=='T'){
      this.selectModel = "";
      this.selectinput.value = "";
    }

    console.log('clear event')
    console.log(this.selectModel);
  }

  itemClicked(item) {
    if (item.value) {
      this.selectinput.oldValue = item.value;
    }
    this.selectinput.itemClicked = 'pre';
    this.emitPass.emit(this.selectinput)
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

  clear() {
    this.selectModel = "";
    this.selectinput.value = "";
  }

  ngOnDestroy(): void {
    let evName = "testDD" + this.selectinput.apps_item_seqid;
    let nameSeq = "refreshItem_" + this.selectinput.apps_item_seqid + '_' + this.selectinput.indexcount;
    let nameItem = "refreshItem_" + this.selectinput.item_name + '_' + this.selectinput.indexcount;
    this.events.unsubscribe(nameItem);
    this.events.unsubscribe(nameSeq);
    this.events.unsubscribe(evName);
    this.cdEngineCall(false);
  }



  getSelectedLabel(value: any) {
    if(value == null || value == undefined) {
      return '';
    }else{
      if(this.selectinput.dropdownList && this.selectinput.dropdownList.length > 0){
         const selected = this.selectinput.dropdownList.find(opt => opt.val ? opt.val === value :"");
        return selected ? selected.key : '';
      }else{
        return '';
      }
 
    }

}

cdEngineCall(isRegister: boolean) {
    let id = this.selectinput.apps_item_seqid + '_' + this.selectinput.indexcount+'#'+this.frameSeqId;
    if(isRegister){
      this.cdEngine.register(id, this.cdr);
    }else{
      this.cdEngine.unregister(id,this.cdr);
    }
  }
}
