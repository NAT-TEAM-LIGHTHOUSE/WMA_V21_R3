import { Component, HostListener, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { IonInput, ModalController, NavParams, Platform, PopoverController } from '@ionic/angular/standalone';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';

import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { JsonListingPage } from '../json-listing/json-listing.page';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

declare var $: any;

@Component({
  standalone: true,
  imports: [...STANDALONE_IMPORTS],
  selector: 'app-single-select-lov',
  templateUrl: './single-select-lov.page.html',
  styleUrls: ['./single-select-lov.page.scss'],
})

export class SingleSelectLovPage implements OnInit {

  @ViewChild('autofocus') searchbar: IonInput;
  @ViewChild("singleTbody") singleTbody: any;
  @ViewChild("parentDiv") parentDiv: any;
  paramValue: any;
  clickShare: any;
  searchText: any = "";
  lovinput: any;
  selectinput: any;
  SelAll: boolean = false;
  object_arr: any = [];
  Object_code: any = [];
  objectList: any[];
  userDetails: any;
  wscp: any = {};
  wsdp: any = [];
  wsdpcl: any = [];
  type = "";
  keyList = [];
  lovHead = [];
  itemvalue = {};
  prompt_name;
  prev_wscp: any = {};
  isChecked: boolean;
  orderByParam: any = {};
  noOfRecords: number = 100;
  limitedRecords = [];
  l_current_page: number = 1;
  l_total_remain_pages: any;
  filterableData: any;
  itemNameList = [];
  lovItemSeq: any = 0;

  selectedChips = [];

  loading: boolean = false;

  withoutDataImg: boolean = false;


  constructor(private modalCtrl: ModalController, public popoverCtrl: PopoverController,
    public platform: Platform, public renderer: Renderer2, public lhs_lib: LhsLibService, private processData: ProcessDataService,
    public dataService: DataService, public globalObjects: GlobalObjectsService, private pipemy: SearchfilterPipe, private sqlServ: SqlLiteService, private canvasModal: CanvasModalService) {
    this.ionViewWillEnter();
    this.userDetails = JSON.parse(JSON.stringify(this.globalObjects.userDetails));
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "single-select-lov")
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      if (this.searchbar) { this.searchbar.setFocus() }
    }, 300);
  }

  @HostListener('document:keydown.control.enter', ['$event'])
  onCtrlEnterHandler(event: KeyboardEvent) {
    if (this.lovinput.click_events_str && this.lovinput.click_events_str.indexOf("open_multi_lov") > -1) {
      this.setmultiLOVvalue(this.objectList)
    }
  }

  @HostListener("keydown.ArrowDown", ['$event'])
  arrowDown(event) {
    this.selectedLovValue(event)
  }


  @HostListener("keydown.ArrowUp", ['$event'])
  arrowUp(event) {
    this.selectedLovValue(event)
  }

  @HostListener("keydown.enter", ['$event'])
  enterKey(event) {
    this.selectedLovValue(event)
  }

  @HostListener("keydown.escape", ['$event'])
    closeLovesc(){
       if (this.lovinput.lov_type == 'LP') {
      this.popoverCtrl.dismiss("", "dismiss");

    } else {
      // this.canvasModal.popDismiss()
      const canvas: any = document.querySelectorAll("#sigleMultiLov")
      const event: any = new Event('click');
      let dispatchCanvas = canvas[canvas.length - 1]
      event.isOffcanvasClose = true
      dispatchCanvas.dispatchEvent(event)
    }
    }

  selectedLovValue(event) {
    if (!this.lovItemSeq) {
      this.lovItemSeq = 0;
    }

    if (this.singleTbody.nativeElement && this.singleTbody.nativeElement.children && this.singleTbody.nativeElement.children.length > 0) {
      var ul = this.parentDiv.nativeElement;
      var el = this.singleTbody.nativeElement.children[this.lovItemSeq];
      let tbodyNative = this.singleTbody.nativeElement.children
      var elRect = el.getBoundingClientRect(),
        parRect = ul.getBoundingClientRect();
      var elementHeight = elRect.height;
      if (event.keyCode == 38) {
        event.preventDefault();

        if (this.rowIndex > this.fromRecord) {
          if ((elRect.top) <= (parRect.top + 70) + elementHeight) {
            if (parRect.top + elementHeight >= elRect.top)
              ul.scrollTop = ul.scrollTop - (((parRect.top + 70) + elementHeight) - (elRect.top));
            else
              ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 70) - elRect.top);
          }
          this.rowIndex -= 1
          this.lovItemSeq != 0 && this.lovItemSeq < this.limitedRecords.length ? this.lovItemSeq-- : this.lovItemSeq = 0;
        } else {
          if (this.fromRecord > 0) {
            this.paginate(this.l_current_page - 1);
            // this.rowIndex=this.toRecord-1
            ul.scrollTop = this.parentDiv.nativeElement.scrollHeight;
            this.lovItemSeq = this.limitedRecords.length - 1
            tbodyNative[tbodyNative.length - 1].focus();
            this.rowIndex = this.toRecord - 1
          }

        }
      } else if (event.keyCode == 40) {
        event.preventDefault();
        if (this.rowIndex < ((this.filterableData && this.filterableData.length > 0) ? this.filterableData.length - 1 : this.objectList.length - 1)) {

          if (this.limitedRecords.length - 1 > this.lovItemSeq) {

            var s = this.lovItemSeq;

            if (s === -1) return;
            if (!(elRect.top >= parRect.top &&
              elRect.bottom <= parRect.bottom &&
              elRect.bottom + elementHeight <= parRect.bottom)) {
              if (parRect.height > elRect.bottom)
                ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
              else
                ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom);
            }

            this.lovItemSeq++;
            this.rowIndex += 1
          } else {
            this.lovItemSeq = 0;
            ul.scrollTop = 0
            ul.scrollTop = 0;

            this.paginate(this.l_current_page + 1);
            tbodyNative[0].focus()
          }

        }

        console.log(this.fromRecord, this.toRecord)
      } else if (event.keyCode == 13) {
        if (this.lovinput.click_events_str && this.lovinput.click_events_str.toLowerCase().indexOf("open_multi_lov") > -1) {
          event.preventDefault()
          event.stopPropagation();
        } else {
          this.setLOVValues(this.limitedRecords[this.lovItemSeq]);
        }
      }
    }
  }

  ngOnInit() {
    this.lovinput = this.paramValue
    if (this.lovinput.objectList) {
      this.objectList = this.lovinput.objectList;
      this.Object_code = this.lovinput.objectList[0];

      if (this.lovinput.head) {
        this.Object_code = this.lovinput.head;
      }
      this.lovinput.objectList = "";
      if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'M_BROWSER' || this.lovinput.item_sub_type == 'M_BROWSER1' || this.lovinput.item_sub_type == 'M_BROWSER2' || this.lovinput.item_sub_type == 'LIST_COMBO_BOX') {
      } else {
        if (this.lovinput.validateFlag) {
          this.searchText = this.lovinput.value ? this.lovinput.value : this.searchText;
        }
      }
      this.generateLov();
    } else {
      if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'M_BROWSER' || this.lovinput.item_sub_type == 'M_BROWSER1' || this.lovinput.item_sub_type == 'M_BROWSER2' || this.lovinput.item_sub_type == 'LIST_COMBO_BOX') {
      } else {
        if (this.lovinput.validateFlag) {
          this.searchText = this.lovinput.value ? this.lovinput.value : this.searchText;
        }
      }

      if (!this.lovinput.without_data) {
        this.getPageInfo("get_lov_data");
      } else {
        this.withoutDataImg = true;
      }
    }



    if (this.lovinput.Ditems) {
      this.selectedChips = this.lovinput.Ditems;
    }
    // this.keyList = this.keyList.map(key => ({
    //   ...key,
    //   search: '%%' 
    // }));

  }

  sppeak() {

  }

  refreshBtn() {
    this.keyList = [];
    this.lovHead = [];
    this.object_arr = [];
    this.Object_code = [];
    this.objectList = null;
    this.selectedChips = [];
    this.pageNumber = []
    this.SelAll = false;

    this.withoutDataImg = false;

    if (this.lovinput.validateFlag) {
      let itm = this.lhs_lib.get_item(this.lovinput.apps_page_frame_seqid + '.' + this.lovinput.item_name, this.lovinput.indexcount);
      if (itm) {
        this.lovinput.value = this.searchText;
        itm.value = this.searchText;
      }
      this.wsdpcl = this.lhs_lib.getDpcl(this.lovinput.calling_frame_seqid_str,null,true);
      this.getPageInfo("validate_lov");
    } else {
      // this.searchText = '';
      this.filterableData = null;
      this.getPageInfo("refresh_lov");
    }
  }



  setLOVValues(item) {

    let values = ""
    let codeOfValues = ""

    if (this.keyList.length > 1) {
      if (values == '' || values == null) {
        values = item[this.keyList[1].key];
        codeOfValues = item[this.keyList[0].key];
      } else {
        values = values + "," + item[this.keyList[1].key];
        codeOfValues = codeOfValues + "," + item[this.keyList[0].key];
      }
    } else {
      if (values == '' || values == null) {
        values = item[this.keyList[0].key];
        codeOfValues = item[this.keyList[0].key];
      } else {
        values = values + "," + item[this.keyList[0].key];
        codeOfValues = codeOfValues + "," + item[this.keyList[0].key];
      }
    }
    let data = [];
    for (let itemName of this.itemNameList) {
      for (let key of this.keyList) {
        if (key.key) {
          let orKey = key.key.split("#")[0].split("~")[1];
          if (orKey.toLowerCase() == itemName.toLowerCase()) {
            let obj: any = {};
            obj.key = itemName;
            obj.value = item[key.key]
            data.push(obj);
          }
        }
      }

    }
    let result: any = {};
    result.value = values;
    result.codeOfValues = codeOfValues;
    result.data = data;
    let items = item;
    result.item = items;

    if (this.lovinput.lov_type == 'LP') {
      this.popoverCtrl.dismiss(result);
      this.popoverCtrl.dismiss(items);
    } else {
      this.canvasModal.popDismiss(result);
    }
  }
  objectlistData

  SelectAll() {
    this.objectlistData = this.objectList
    let vals = this.pipemy.transform(this.objectList, this.searchText);
    this.objectList = vals;
    if (this.SelAll == true) {

      for (var i = 0; i < this.objectList.length; i++) {
        this.objectList[i]['checked'] = false;
        if (this.searchText) {
          this.multiCheck(this.objectList[i]);
        }
        if (!this.searchText) {
          this.selectedChips = [];
        }
      }
    }
    if (this.SelAll == false) {
      for (var i = 0; i < this.objectList.length; i++) {

        this.objectList[i]['checked'] = true;
        if (this.searchText) {
          this.multiCheck(this.objectList[i]);
        }

      }

      if (!this.searchText) {
        this.selectedChips = this.objectList;
      }
    }
    this.objectList = this.objectlistData
    this.paginate(this.l_current_page);
  }
  setmultiLOVvalue(lov) {
    let values = [];
    let codeOfValues = [];
    let items = [];
    let data1 = [];
    for (let item of this.selectedChips) {
      if (item.checked) {
        values.push(item[this.keyList[1].key]);
        codeOfValues.push(item[this.keyList[0].key]);
        this.isChecked = false;
        let data = [];
        for (let itemName of this.itemNameList) {
          for (let key of this.keyList) {
            if (key.key) {
              let orKey = key.key.split("#")[0].split("~")[1];
              if (orKey.toLowerCase() == itemName.toLowerCase()) {
                let obj: any = {};
                obj.key = itemName;
                obj.value = item[key.key]
                data.push(obj);
              }
            }
          }

        }
        items.push(item);
        data1.push(data)
      }
    }
    let strArr = [];
    for (let l of items) {
      for (let k in l) {
        if (k != "checked" && k != "isChecked" && k != "Level2") {
          if (strArr.length > 0) {
            let glob = strArr.find(x => x.key == k);
            if (glob) {
              glob.value = glob.value + "," + l[glob.key];
            } else {
              let data = {
                key: k,
                value: l[k]
              }
              strArr.push(data);
            }
          } else {
            let data = {
              key: k,
              value: l[k]
            }
            strArr.push(data);
          }
        }
      }
    }



    if (data1.length <= 0) {
      let data = [];
      for (let lo of this.keyList) {
        let obj: any = {};
        if (lo.key) {
          obj.key = lo.key.split("#")[0].split("~")[1];
          obj.value = "";
          data.push(obj);
        }
      }
      data1.push(data);
    }

    let sItem = items.length > 0 ? JSON.parse(JSON.stringify(items[0])) : "";
    for (let str of strArr) {
      if (sItem[str.key]) {
        sItem[str.key] = str.value
      }
    }



    let result: any = {};
    result.value = values;
    result.data = data1;
    result.codeOfValues = codeOfValues;
    result.isChecked = this.isChecked;
    result.item = sItem;
    result.Ditems = items;
    if (this.lovinput.lov_type == 'LP') {
      this.popoverCtrl.dismiss(result);
    } else {
      this.canvasModal.popDismiss(result);
    }
  }

  multiCheck(item) {

    if (item) {
      if (item.checked) {
        if (!this.selectedChips.find(x => x.row_index_no == item.row_index_no)) {
          this.selectedChips.push(item)
        }

      } else {
        this.selectedChips = this.selectedChips.filter(x => x.row_index_no != item.row_index_no);
      }
    }

    console.log(item);

  }

  getPageInfo(serviceType) {
    if (this.globalObjects.networkStatus) {
      this.globalObjects.showLoading();
    }

    this.loading = true;
    this.wscp.service_type = serviceType;
    this.wscp.apps_page_no = this.lovinput.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.lovinput.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.lovinput.apps_item_seqid;
    // this.userDetails = this.globalObjects.userDetails;
    this.wscp["object_code"] = this.lovinput.object_code;
    let wscp = JSON.parse(JSON.stringify(this.wscp));

    if (serviceType == "refresh_lov") {
      wscp.lov_search = this.searchText;
    }

    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }

    //------------------- Getting OFFLINE LOV SAVE ---------------------------------------------------//


    let objectKey = this.wscp.object_code + "_LOV_" + this.wscp.apps_item_seqid;

    if (this.wscp.object_code && this.wscp.apps_working_mode === 'I') {
      this.sqlServ.getById(objectKey, 'item_master').then(data => {
        this.loading = false;
        if ((data.resStatus == 'Success') && !this.globalObjects.networkStatus) {
          let objData: any = JSON.parse(data.resData.itemData);
          this.objectList = objData.Level1;
          this.Object_code = objData.Level1[0];

          this.generateLov();
        }
        else {

          let index = this.lovinput.itemIndex ? this.lovinput.itemIndex : (this.lovinput.indexCount ? this.lovinput.indexCount : this.lovinput.indexcount);
          let itm = this.lhs_lib.get_item(this.lovinput.apps_item_seqid, index);
          if (itm) {
            itm.requestData = reqData;
          }
          this.dataService.postData("S2U", reqData).then(res => {

            let data: any = res;
            if (data.responseStatus && data.responseStatus.includes("success")) {



              if (data.responseStatus.toLowerCase().includes("-rc")) {
                this.noS2uLov(data);
              } else {

                this.object_arr = data.responseData
                let objData = this.globalObjects.setPageInfo(data.responseData);
                this.objectList = objData.Level1;
                this.Object_code = objData.Level1[0];
                delete this.Object_code['Level2'];
                //-------------------OFFLINE LOV SAVE ---------------------------------------------------//

                if (this.searchText) {
                  this.noChange(this.searchText);
                }


                let offlineObjectCode: any;
                if (objData && this.wscp.apps_working_mode == 'I') {
                  if (reqData.wscp) {
                    if (reqData.wscp.object_code) {
                      offlineObjectCode = reqData.wscp.object_code + "_LOV_" + reqData.wscp.apps_item_seqid;
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

                //-------------------OFFLINE LOV SAVE ---------------------------------------------------//
                // this.objectList = this.object_arr.Level1;


                this.generateLov();
              }

            } else {
              alert(data.responseMsg);
            }
          }).catch(err => {

            this.globalObjects.presentToast("4 Something went wrong please try again later!");
          })
        }
      }, err => this.globalObjects.presentAlert('ERR PDB: ' + err))
    } else {

      let index = this.lovinput.itemIndex ? this.lovinput.itemIndex : (this.lovinput.indexCount ? this.lovinput.indexCount : this.lovinput.indexcount);
      let itm = this.lhs_lib.get_item(this.lovinput.apps_item_seqid, index);
      if (itm) {
        itm.requestData = reqData;
      }
      this.dataService.postData("S2U", reqData).then(res => {

        this.loading = false;

        let data: any = res;

        if (data.responseStatus && data.responseStatus.includes("success")) {
          if (data.responseStatus.toLowerCase().includes("-rc")) {
            this.noS2uLov(data);
          } else {
            this.object_arr = data.responseData
            let objData = this.globalObjects.setPageInfo(data.responseData);
            this.objectList = objData.Level1;
            this.Object_code = objData.Level1[0];
            delete this.Object_code['Level2'];
            //-------------------OFFLINE LOV SAVE ---------------------------------------------------//

            if (this.searchText) {
              this.noChange(this.searchText);
            }
            //-------------------OFFLINE LOV SAVE ---------------------------------------------------//
            this.generateLov();
          }
        } else {
          alert(data.responseMsg);
        }
      }).catch(err => {
        this.globalObjects.presentToast("4 Something went wrong please try again later!");
      })
    }
  }

  noS2uLov(data) {
    let p_head;
    if (data.responseHead) {


      let { tableData, p_head } = this.lhs_lib.generateDataForLov(this.lovinput, data);

      let head = p_head ? p_head.split(",") : [];

      let headArr = [];
      for (let code of head) {
        let data = {
          th: code.split("~")[0],
          code: code
        }
        headArr.push(data)
      }

      // this.lovinput.objectList = tableData;

      this.objectList = tableData;
      this.Object_code = head.reduce((a, v) => ({ ...a, [v]: "" }), {});;
      this.lovinput.objectList = "";
      if (this.lovinput.item_sub_type == 'M' || this.lovinput.item_sub_type == 'M_BROWSER' || this.lovinput.item_sub_type == 'M_BROWSER1' || this.lovinput.item_sub_type == 'M_BROWSER2' || this.lovinput.item_sub_type == 'LIST_COMBO_BOX') {

      } else {
        if (this.lovinput.validateFlag) {
          this.searchText = this.lovinput.value ? this.lovinput.value : this.searchText;
        }
      }

      this.generateLov();
    }
  }



  generateLov() {
    this.itemNameList = [];
    let checkedKey;
    delete this.Object_code['Level2'];
    for (let code in this.Object_code) {
      if (code.indexOf("CB_SELECT") > -1) {
        checkedKey = code;
      }
      let coldata = code.split("#");
      let codedata;
      if (coldata) {
        codedata = coldata[0].split("~");
      } else {
        codedata = code[0].split("~");
      }
      this.itemNameList.push(codedata[1]);
      if (codedata[1].toLowerCase() != 'v') {
        let head;
        if (coldata) {
          head = coldata.find(x => x.split("~")[0] == 'v');
        }

        if (head) {
          let itmVisi = head.split("~")[1];
          if (itmVisi == 'F') { } else {
            let data = {
              th: codedata[0],
              code: code
            }
            this.lovHead.push(data);
          }
        } else {
          let data = {
            th: codedata[0],
            code: code
          }
          this.lovHead.push(data);
        }



        let val: any = {};

        for (let c of coldata) {
          let k = c.split("~");

          if (k[0] && (k[0].toLowerCase() == "d" || k[0].toLowerCase() == "v" || k[0].toLowerCase() == "f")) {
            if (k[0].toLowerCase() == "d") {
              val.display_setting_str = k[1];
            } else if (k[0].toLowerCase() == "v") {
              val.item_visible_flag = k[1];
            } else if (k[0].toLowerCase() == "f") {
              val.filter_flag = k[1];
            }
          } else {
            val.key = code;
          }
        }
        // val.searchCol = "";
        // if(val.item_visible_flag == 'T'){
        val.searchCol = '%%';
        val.initialChange = true;
        // }
        this.keyList.push(val);
        // console.log(this.keyList)
      }
    }

    if ((this.lovinput.codeOfValues != undefined || this.lovinput.value != undefined) && this.lovinput.lType == "M") {
      var checkInput = [];

      let valStr = (this.lovinput.codeOfValues ?? this.lovinput.value);
      checkInput = typeof (valStr) == 'string' ? (valStr.includes("^") ? valStr.split("^") : [valStr]) : valStr;

      if (this.lovinput.lov_return_column_str) {
        let retArr = this.lovinput.lov_return_column_str.split(";");
        let key = "";
        for (let l of retArr) {
          let name = l ? l.toLowerCase().split("lov.")[1].trim() : "";
          let itName = l ? l.toLowerCase().split(":=")[0] : "";
          itName = itName.includes(".") ? itName.split(".")[1].trim().replaceAll(":", "") : itName.replaceAll(":", "");
          if (name && (itName.toLowerCase() == this.lovinput.item_name.toLowerCase())) {
            for (let keys of this.keyList) {
              let mKey = keys.key ? keys.key.split("#")[0].split("~")[1] : "";
              if (mKey && mKey.toLowerCase() == name.toLowerCase()) {
                key = keys.key;
                break;
              }
            }
          }
        }

        let i = 0;
        for (let object of this.objectList) {
          object['row_index_no'] = i;
          for (let checkObject of checkInput) {
            if (checkObject && object && object[key] && checkObject.trim() == object[key].trim()) {
              object['checked'] = true;
              this.multiCheck(object);
            }
          }
          i++;
        }

      } else {
        let i = 0;
        for (let object of this.objectList) {
          object['row_index_no'] = i;
          for (let key of this.keyList) {
            for (let checkObject of checkInput) {
              if (checkObject && object && object[key.key] && checkObject.trim() == object[key.key].trim()) {
                object['checked'] = true;
                this.multiCheck(object);
              }
            }
          }
          i++;
        }
      }


    } else {
      let i = 0;
      for (let object of this.objectList) {
        object['row_index_no'] = i;
        i++;
      }
    }

    this.l_current_page = 1;

    if (this.searchText) {
      // this.debouncedSearch(this.searchText);
          this.noChange(this.searchText);
      if (this.lovinput.validateFlag && ((!this.filterableData || this.filterableData.length < 1) && this.objectList.length > 0)) {
        this.searchText = '';
        this.debouncedSearch(this.searchText);
      }
    } else {
      this.paginate(this.l_current_page);
    }
    this.pageNumberData()
  }
  pageNumberData() {
    this.pageNumber = []
    for (let i = 1; i <= this.l_total_remain_pages; i++) {
      this.pageNumber.push(i);
    }
  }
  page = 1
  selectShow: boolean = false;
  pageNumber = []
  paginate(num) {
    if (num == 1) {
      this.limitedRecords = [];
    }
    let to = this.noOfRecords * num;
    let from = to - this.noOfRecords;
    this.fromRecord = from
    this.toRecord = to
    let data = [];

    if (this.filterableData) {
      data = this.filterableData;
    } else {
      data = this.objectList;
    }

    if (to > data.length) {
      to = data.length;
    }

    this.limitedRecords = [];
    for (let i = from; i < to; i++) {
      data[i].lovCountRow = i; // add by arti
      this.limitedRecords.push(data[i]);
    }
    this.l_current_page = num;
    this.l_total_remain_pages = Math.ceil((data.length) / this.noOfRecords);
    this.page = num
    this.rowIndex = this.fromRecord
    this.lovItemSeq = 0
  }
  paginatePageNo(page) {
    this.paginate(page)
    this.lovItemSeq = 0
  }



  goToLast(last) {
    this.limitedRecords = [];

    let to = this.noOfRecords * last;
    let from = 0;

    for (let i = from; i < to; i++) {
      this.limitedRecords.push(this.objectList[i]);
    }
    this.l_current_page = last;
    this.l_total_remain_pages = Math.ceil((this.objectList.length) / this.noOfRecords);
  }

  closeLov() {

    if (this.lovinput.lov_type == 'LP') {
      this.popoverCtrl.dismiss("", "dismiss");

    } else {
      this.canvasModal.popDismiss()

    }

  }

  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.searchText = res;
    });
  }

  openbarcodescanner() {
    this.globalObjects.barcodescanner().then(res => {
      this.searchText = res;
    });
  }

  //-------table order by start
  thClick(th: string, i) {
    this.orderByParam.th = th;
    this.orderByParam.index = i;
    if (this.orderByParam.direction > 0) {
      this.orderByParam.direction = -1;
    } else {
      this.orderByParam.direction = 1;
    }

    this.objectList = this.objectList.sort((a, b) => {
      let d = a[th];
      // //console.log(d);
      a[th] = a[th] ? a[th] : "";
      b[th] = b[th] ? b[th] : "";
      if (a[th] < b[th]) {
        return -1 * this.orderByParam.direction;
      } else if (a[th] > b[th]) {
        return 1 * this.orderByParam.direction;
      } else {
        return 0;
      }

    });
    this.paginate(1);

  }

  debouncedSearch = this.debounce((value: string) => {
    this.noChange(value);
  }, 250);

  noChange(val) {
    this.SelAll = false
    // if (this.objectList) {

    //   if (val) {
    //     let vals = this.pipemy.transform(this.objectList, this.searchText);
    //     if (vals) {
    //       this.filterableData = vals;
    //       this.filterCount = this.filterableData.length;
    //       this.isFilterCount = true;
    //     } else {
    //       this.filterableData = this.objectList;
    //       this.filterCount = '';
    //       this.isFilterCount = false;
    //     }

    //   } else {
    //     this.filterableData = this.objectList;
    //     this.filterCount = ''
    //     this.isFilterCount = false
    //   }
    //   this.paginate(1);
    //   this.page = 1
    //   this.pageNumberData()
    // }
    // this.lovItemSeq = 0
    // // this.rowIndex = this.limitedRecords[0]?.row_index_no
    // this.rowIndex = 0
    this.filterColumn();
  }

  filterCount = ''
  isFilterCount: boolean = false
  filterColumn(key?, str?, initialKey?, clearData?) {
    // console.log("this is filtercol function"+initialKey)
    console.log("keyList - ",this.keyList)
    if (initialKey && initialKey.initialChange) {
      // console.log("this is filtercol function"+initialKey.initialChange)

      delete initialKey['initialChange'];
      // return;
    }
    // if (str) {
    //   let vals;
    //   if (str == "%%") {
    //     this.isFilterCount = false
    //   } else {
    //     this.isFilterCount = true
    //   }
    //   if (str.includes("%")) {
    //     // str = str.replaceAll("%", '');

    //     // vals = this.objectList.filter(x => x[key] && x[key].toLowerCase().includes(str.toLowerCase()));


    //     let strArr = str.split("%");
    //     // let regexPattern = strArr.map(part => part.toLowerCase()).join('.*');  // Join each part with '.*'

    //     let regexPattern = strArr.map(part => this.escapeRegExp(part.toLowerCase())).join('.*');  // Join each part with '.*'
    //     // Create a new RegExp object to match the entire string (case insensitive)
    //     let regex = new RegExp(`^${regexPattern}$`, 'i');  // 'i' flag for case-insensitive matching
    //     vals = this.objectList.filter(x => x[key] && x[key].toLowerCase().match(regex));
    //   } else {
    //     vals = this.objectList.filter(x => x[key] && (x[key].toLowerCase() == (str.toLowerCase())));

    //   }

    //   // let vals = this.objectList.filter(x => x[key] && x[key].toLowerCase().includes(str.toLowerCase()));


    //   if (vals) {
    //     this.filterableData = vals;
    //   } else {
    //     this.filterableData = [];
    //   }
    //   this.filterCount = this.filterableData.length

    // } else {
    //   this.filterableData = this.objectList;
    //   if (clearData) {
    //     clearData.el.value = "%%"
    //   }
    //   this.filterCount = ''
    //   this.isFilterCount = false
    // }

    let flag = false
      let filterData = this.objectList
    if(this.searchText){
      let vals = this.pipemy.transform(this.objectList, this.searchText);
        if (vals) {
          flag = true;
          filterData = vals;
          this.isFilterCount = true;
        } 
    }
  
    for (let keys of this.keyList) {
      if (keys.searchCol) {
        let val = keys.searchCol.replaceAll("%", "");
        if (val) {
          flag = true;
          let strArr = keys.searchCol.split("%");
          let regexPattern = strArr.map(part => this.escapeRegExp(part.toLowerCase())).join('.*');  // Join each part with '.*'
        // Create a new RegExp object to match the entire string (case insensitive)
        let regex = new RegExp(`^${regexPattern}$`, 'i');  // 'i' flag for case-insensitive matching
        filterData = filterData.filter(x => x[keys.key] && x[keys.key].toLowerCase().match(regex));
          // filterData = filterData.filter(x => x[key] && (x[key].toLowerCase() == (str.toLowerCase())));
        }
      }
    }
    if(flag){
       this.filterableData = filterData;
        this.isFilterCount = true
    }else{
      this.filterableData = this.objectList;
    }
     if (clearData) {
        clearData.el.value = "%%"
      }
    this.filterCount = this.filterableData.length
    this.paginate(1);
    this.pageNumberData()
    this.lovItemSeq = 0
    if (this.limitedRecords.length) {
      // this.rowIndex = this.limitedRecords[0].row_index_no
      this.rowIndex = 0
    }
  }
  //-------table order by end


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: JsonListingPage,
      componentProps: { value: this.objectList }
    });
    modal.present();
  }


  spaceDown(event) {
    event.preventDefault()
    event.stopPropagation();
    this.limitedRecords[this.lovItemSeq].checked = !this.limitedRecords[this.lovItemSeq].checked
  }

  @HostListener('keydown.PageDown', ['$event'])
  pageDown(event: KeyboardEvent) {
    event.preventDefault();
    if (this.l_current_page > 1) {
      this.paginate(this.l_current_page - 1);
    }
  }

  @HostListener('keydown.PageUp', ['$event'])
  pageUp(event: KeyboardEvent) {
    event.preventDefault();
    if (this.l_current_page < this.l_total_remain_pages) {
      this.paginate(this.l_current_page + 1);
    }
  }

  rowsPage: any = [10, 20, 30, 50, 100]
  fromRecord = 0
  toRecord = 0
  rowsPerPage() {
    this.page = 1
    console.log("Row Page", this.noOfRecords)
    let to = this.noOfRecords;
    let from = 0;
    this.fromRecord = from
    this.toRecord = to
    let data = [];

    if (this.filterableData) {
      data = this.filterableData;
    } else {
      data = this.objectList;
    }

    if (to > data.length) {
      to = data.length;
    }

    this.limitedRecords = [];
    for (let i = from; i < to; i++) {
      this.limitedRecords.push(data[i]);
    }
    this.l_current_page = 1;
    this.l_total_remain_pages = Math.ceil((data.length) / this.noOfRecords);
    this.pageNumberData()
    this.rowIndex = this.fromRecord
    this.lovItemSeq = 0
  }
  rowIndex = 0
  lovRowClick(object, i) {
    this.lovItemSeq = i
    // this.rowIndex = object.row_index_no
    // this.rowIndex = i;
    this.rowIndex = object.lovCountRow;
  }
  // Escape special regex characters in a string
  escapeRegExp(string) {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); // Escape special characters
  }

  debounce(fn: Function, delay: number) {
    let timer: any;

    return function (...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }
}

