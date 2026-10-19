import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { MultileveltabsearchPipe } from 'src/app/pipes/multileveltabsearch.pipe';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';

import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS,MultileveltabsearchPipe],
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent implements OnInit, OnDestroy {

  @Input() selectinput: any;
  @Input() l_wscp: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() parentComponent: any;
  @Input() frame: any;
  item_sub_type = '';
  current_page_parameter: any = {};
  autoValue: any;
  developerModeData: any;
  searchText: any;
  //selectinput: any;
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

  constructor(public modalCtrl: ModalController,  public events: Events, public plt: Platform,
    public globalObjects: GlobalObjectsService, private dataService: DataService, private sqlServ: SqlLiteService,
    private pipemy: MultileveltabsearchPipe, private lhs_lib: LhsLibService,
    private pipemys: MultileveltabsearchPipe) {
    this.userDetails = JSON.parse(JSON.stringify(this.globalObjects.userDetails));
    if (this.globalObjects.itemFlag) {
      return applyLoggingDecorator(this, "select-input")
    }
  }

  ngOnDestroy(): void {
    let nameSeq = "refreshItem_" + this.selectinput.apps_item_seqid;
    let nameItem = "refreshItem_" + this.selectinput.item_name;
    this.events.unsubscribe(nameItem);
    this.events.unsubscribe(nameSeq);
    let evName = "testDD" + this.selectinput.apps_item_seqid;
    this.events.unsubscribe(evName);
  }
  ngOnInit() {
    console.log(this.frame);
    let nameSeq = "refreshItem_" + this.selectinput.apps_item_seqid;
    let nameItem = "refreshItem_" + this.selectinput.item_name;
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


    if (this.selectinput.position && (this.selectinput.position.indexOf("column") > -1)) {
      let arr = this.selectinput.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    } else if (this.selectinput.promptCol) {
      this.col1 = this.selectinput.promptCol;
      this.col2 = (12 - parseFloat(this.selectinput.promptCol));
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;
    this.selectinput.filterarray = [];
    if (this.selectinput.value && this.selectinput.dropdownList) {
      this.selectModel = this.selectinput.value;
    } else {
      this.selectModel = null;
    }
    if ((this.selectinput.data_required_flag && this.selectinput.data_required_flag == 'T') || ((this.selectinput.prompt_name && this.selectinput.prompt_name[this.selectinput.prompt_name.length - 1]) == '*')) {
      // if(this.selectinput.data_required_flag=='T'||(this.selectinput.prompt_name && this.selectinput.prompt_name[this.selectinput.prompt_name.length -1] =='*')){
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
        "top": "0px"
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

  arrowkeyLocation = 0;

  keyDown(event: KeyboardEvent) {

    if (this.plt.is('android') && this.plt.is('ios')) {
      let pipeLength = this.pipemy.transform(this.selectinput.dropdownList, this.autoValue);

      if (event.keyCode == 38) {  //up
        this.arrowkeyLocation--;

      }
      if (event.keyCode == 40) {   //down
        this.arrowkeyLocation++;

      }
      if (event.keyCode == 13) {   //enter
        this.getMode(pipeLength[this.arrowkeyLocation]);
        this.arrowkeyLocation = 0;
        this.selectinput.flag = false;
        this.fullList = false;
      }

      if (this.arrowkeyLocation > (pipeLength.length - 1)) {
        if (event.keyCode == 38) {//up
          this.arrowkeyLocation = 0;
        }
        if (event.keyCode == 40) {
          this.arrowkeyLocation = 0;

        }
      }
      if (this.arrowkeyLocation == -1) {
        if (event.keyCode == 38) { //up
          this.arrowkeyLocation = pipeLength.length - 1;
        }
      }
    }
  }

  getdata() {
    if (!this.selectinput.objectData) {
      this.globalObjects.showLoading();
      this.wscp.service_type = "get_lov_data";
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
      // //console.log(wsdp)
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
        "wsdp": this.wsdp

      }
      // reqData.wsdp = [ 
      //   {
      //     "itemType": "TEXT",
      //     "itemDefaultValue": "Y~Yes#N~No"
      //   }];

      let objectKey = this.wscp.object_code + "_DD_" + this.wscp.apps_item_seqid;
      this.sqlServ.getById(objectKey, 'item_master').then(data => {
        if ((data.resStatus == 'Success') && !this.globalObjects.networkStatus) {

          let objData: any = JSON.parse(data.resData.itemData);
          this.objectList = objData.Level1;
          // this.Object_code = objData.Level1;

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
            // //console.log("datavalue.................", datavalue)
          }
          this.selectinput['dropdownList'] = this.valuesList;
          if (this.selectinput.item_type == 'DD_BROWSER' && this.valuesList.length == 1) {
            this.selectinput.value = this.valuesList[0].val;
            this.selectinput.codeOfValues = this.valuesList[0].key;
          }

          if (this.selectinput.value) {

            this.selectModel = this.selectinput.value;
            this.selectinput.isValid = true;

            if (this.selectinput.item_sub_type == 'LIST_COMBO_BOX' || this.selectinput.item_sub_type == 'COMBO_BOX') {

              this.func();
            }

            if (this.selectinput.item_sub_type == 'CHECKBOX') {
              let arr = this.selectinput.value.split(",");

              for (let j = 0; j < this.selectinput.dropdownList.length; j++) {
                if (arr.indexOf(this.selectinput.dropdownList[j].val) > -1) {
                  this.selectinput.dropdownList[j].isChecked = true;
                }
              }
            }

          }


        }
        else {

          let index = this.selectinput.itemIndex ? this.selectinput.itemIndex : (this.selectinput.indexCount ? this.selectinput.indexCount : this.selectinput.indexcount);
          let itm = this.lhs_lib.get_item(this.selectinput.apps_item_seqid, index);
          if (itm) {
            itm.requestData = reqData;
          }

          this.dataService.postData("S2U", reqData).then(res => {
            let data: any = res;
            // //console.log("res...>>>>", res)
            if (data.responseStatus && data.responseStatus.includes("success")) {
              // Developer Mode Loging

              let objData;
              if (data.responseStatus.toLowerCase().includes("-rc")) {

                objData.Level1 = this.globalObjects.setPageInfoNoS2U(data.responseData);

              } else {
                objData = this.globalObjects.setPageInfo(data.responseData);
              }
              this.objectList = objData.Level1;
              this.selectinput.objectData = objData;
              //this.Object_code = objData.Level1;

              this.setDDListData();
            } else {
              if (this.selectinput['item_type'] == 'DD' && this.selectinput['item_default_value']) {
                if (this.selectinput['item_default_value'].indexOf('#') > -1) {
                  let dropVal: any = [];
                  dropVal = this.selectinput['item_default_value'].split('#');
                  // alert(dropVal)
                  let dropdownList = [];
                  for (let y of dropVal) {
                    let c = y.split("~");
                    let dVal: any = {};
                    dVal.key = c[0];
                    dVal.val = c[1];
                    dropdownList.push(dVal);
                    this.selectinput['dropdownList'] = dropdownList;

                    if (this.selectinput.value) {
                      this.selectModel = this.selectinput.value;

                      //  this.selectinput.isValid = true;
                      if (this.selectinput.item_sub_type == 'LIST_COMBO_BOX' || this.selectinput.item_sub_type == 'COMBO_BOX') {

                        this.func();
                      }
                      if (this.selectinput.item_sub_type == 'CHECKBOX') {
                        let arr = this.selectinput.value.split(",");

                        for (let j = 0; j < this.selectinput.dropdownList.length; j++) {
                          if (arr.indexOf(this.selectinput.dropdownList[j].val) > -1) {
                            this.selectinput.dropdownList[j].isChecked = true;
                          }
                        }
                      }
                    }
                  }
                  // //console.log("dropval--->" + JSON.stringify(dropdownList));
                }
              }
            }

          }).catch(err => {
            this.globalObjects.presentToast("44 Something went wrong please try again later!");
          })
        }

      })
    } else {
      this.setDDListData();
    }
  }

  onChangeFirst(value) {
    if (this.fullList) {
      this.fullList = false;
      this.selectinput.flag = false;
    }
    let val = this.selectinput.dropdownList.find(x => x.key == value);
    if (val || (this.selectinput.item_sub_type != 'LIST_COMBO_BOX')) {
      this.selectinput.blurError = "";
    }
    this.onChange(value);
  }

  onBlur(value) {
    setTimeout(() => {
      this.fullList = false;
      this.selectinput.flag = false;
      let val = this.selectinput.dropdownList.find(x => x.key == this.autoValue);
      if (val || (this.selectinput.item_sub_type != 'LIST_COMBO_BOX')) {
      } else {
        this.selectinput.blurError = "Please select proper ";
      }
    }, 1000);
  }

  fullListFun() {
    this.fullList = true;
    this.selectinput.flag = false;
    this.arrowkeyLocation = 0;
  }


  onChangeBrowser(event) {
    if (this.selectinput.msgError) {
      this.selectinput.msgError = "";
    }
    if (event.target.value) {
      this.selectinput.value = event.target.value;
    }
  }

  onChangeTlist(val, index) {
    this.onChange(val);
    this.arrowkeyLocation = index;
  }

  onChange(onChange) {
    if (onChange) {
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

      if (this.selectinput.item_sub_type == 'CHECKBOX') {
        if (onChange.isChecked == true) {
          this.selectinput.value = this.selectinput.value ? this.selectinput.value + "," + onChange.val : onChange.val;
        } else if (this.selectinput.value) {
          let valArr = this.selectinput.value.split(",");
          this.selectinput.value = null;
          for (let val of valArr) {
            if (val != onChange.val) {
              this.selectinput.value = this.selectinput.value ? this.selectinput.value + "," + val : val;
            }
          }
        }
      } else {
        this.selectinput.value = onChange;
      }


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
        if (this.selectinput.item_sub_type != 'CHECKBOX') {
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
        // let lov_RetArr : any = [];

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
      // //console.log(this.selectinput.value);


      // if (this.selectinput.value) {
      //   this.selectinput.isValid = true;
      // }
      this.selectinput.itemClicked = 'post';
      this.emitOnChange.emit(this.selectinput);
    }
  }


  getMode(event) {
    this.autoValue = event.key;
    this.selectinput.flag = false;
    this.fullList = false;
    this.onChangeFirst(event.val);
  }

  myFunction() {
    if (!this.fullList) {
      this.selectinput.flag = true;
    }
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
                this.lhs_lib.set_item_value(this.selectinput, values[0], this.selectinput.indexcount ? this.selectinput.indexcount : this.selectinput.indexCount, lVal.item[item]);
              }
            }
          }
        }
      }
    }
  }


  serchtextChange(event) {
    if (this.selectinput.item_sub_type == 'LIST_COMBO_BOX' || this.selectinput.item_sub_type == 'COMBO_BOX') {
      if (this.autoCompleteflag) {
        this.selectinput.dropdownList.filter(data => {
          if (event == data.val) {
            this.autoValue = data.key;
          }
        })
        this.onChange(this.autoValue)
        this.autoCompleteflag = false;
      }
    }
  }

  async func() {
    let res = await this.selectinput.dropdownList;
    if (res) {
      if (this.selectModel) {
        this.serchtextChange(this.selectModel);
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
        requestData: this.selectinput
      }
    });
    return await modal.present();
  }

  setDDListData() {
    //-------------------OFFLINE DROPDOWN SAVE ---------------------------------------------------//
    let offlineObjectCode: any;
    let objData = this.selectinput.objectData;
    if (objData && this.l_wscp.apps_working_mode == 'I') {
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
      // //console.log("datavalue.................", datavalue)
    }
    this.selectinput['dropdownList'] = this.valuesList;
    if (this.selectinput.item_type == 'DD_BROWSER' && this.valuesList.length == 1) {
      this.selectinput.value = this.valuesList[0].val;
      this.selectinput.codeOfValues = this.valuesList[0].key
    }

    if (this.selectinput.value) {

      this.selectModel = this.selectinput.value;
      this.selectinput.isValid = true;
      if (this.selectinput.item_sub_type == 'LIST_COMBO_BOX' || this.selectinput.item_sub_type == 'COMBO_BOX') {
        this.func();
      }

      if (this.selectinput.item_sub_type == 'CHECKBOX') {
        let arr = this.selectinput.value.split(",");

        for (let j = 0; j < this.selectinput.dropdownList.length; j++) {
          if (arr.indexOf(this.selectinput.dropdownList[j].val) > -1) {
            this.selectinput.dropdownList[j].isChecked = true;
          }
        }
      }

    }
  }

}

