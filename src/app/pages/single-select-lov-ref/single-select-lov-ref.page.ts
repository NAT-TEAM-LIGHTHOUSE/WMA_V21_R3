import { Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { JsonListingPage } from '../json-listing/json-listing.page';
import { IonInput, ModalController, Platform, PopoverController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-single-select-lov-ref',
  templateUrl: './single-select-lov-ref.page.html',
  styleUrls: ['./single-select-lov-ref.page.scss'],
})
export class SingleSelectLovRefPage implements OnInit {
  @ViewChild('autofocus') searchbar: IonInput;
  @ViewChild("singleTbody") singleTbody: any;
  @ViewChild("parentDiv") parentDiv: any;
  paramValue:any
  clickShare: any
  searchText: any;
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


  constructor(private modalCtrl: ModalController, public popoverCtrl: PopoverController,
    public platform: Platform,  public renderer: Renderer2, public lhs_lib: LhsLibService,
    public dataService: DataService, public globalObjects: GlobalObjectsService, private pipemy: SearchfilterPipe, 
    private sqlServ: SqlLiteService,private canvasModal:CanvasModalService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"single-select-lov-ref-page")
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

  selectedLovValue(event) {
    if (!this.lovItemSeq) {
      this.lovItemSeq = 0;
    }

    if (this.singleTbody.nativeElement && this.singleTbody.nativeElement.children && this.singleTbody.nativeElement.children.length > 0) {
      var ul = this.parentDiv.nativeElement;
      var el = this.singleTbody.nativeElement.children[this.lovItemSeq];

      var elRect = el.getBoundingClientRect(),
        parRect = ul.getBoundingClientRect();
      var elementHeight = elRect.height;
      if (event.keyCode == 38) {
        event.preventDefault();

        if ((elRect.top) <= (parRect.top + 70) + elementHeight) {
          if (parRect.top + elementHeight >= elRect.top)
            ul.scrollTop = ul.scrollTop - (((parRect.top + 70) + elementHeight) - (elRect.top));
          else
            ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 70) - elRect.top);
        }


        this.lovItemSeq != 0 && this.lovItemSeq < this.limitedRecords.length ? this.lovItemSeq-- : this.lovItemSeq = 0;
      } else if (event.keyCode == 40) {
        event.preventDefault();
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

        } else {
          this.lovItemSeq = 0;
          ul.scrollTop = 0
        }
      } else if (event.keyCode == 13) {
        if (this.lovinput.click_events_str && this.lovinput.click_events_str.indexOf("open_multi_lov") > -1) {
          event.preventDefault()
          event.stopPropagation();
        } else {
          this.setLOVValues(this.limitedRecords[this.lovItemSeq]);
        }
      }
    }
  }

  ngOnInit() {
    this.lovinput=this.paramValue
    if (this.lovinput.objectList) {
      this.objectList = this.lovinput.objectList;
      this.Object_code = this.lovinput.objectList[0];
      this.lovinput.objectList = "";
      this.searchText = this.lovinput.value;
      this.generateLov();
    } else {
      this.searchText = this.lovinput.value;
      this.getPageInfo("get_lov_data");
    }
  }

  sppeak() {}

  refreshBtn() {
    this.keyList = [];
    this.lovHead = [];
    this.object_arr = [];
    this.Object_code = [];
    this.objectList = null;
    this.getPageInfo("refresh_lov");
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

  SelectAll() {
    let vals = this.pipemy.transform(this.objectList, this.searchText);
    this.objectList = vals;
    if (this.SelAll == true) {
      for (var i = 0; i < this.objectList.length; i++) {
        this.objectList[i]['checked'] = false;
      }
    }
    if (this.SelAll == false) {
      for (var i = 0; i < this.objectList.length; i++) {
        this.objectList[i]['checked'] = true;
      }
    }
  }

  setmultiLOVvalue(lov) {
    let values = [];
    let codeOfValues = [];
    let items = [];
    let data1 = [];
    for (let item of lov) {
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

  getPageInfo(serviceType) {
    if (this.globalObjects.networkStatus) {
      this.globalObjects.showLoading();
    }
    this.wscp.service_type = serviceType;
    this.wscp.apps_page_no = this.lovinput.apps_page_no;
    this.wscp.apps_page_frame_seqid = this.lovinput.apps_page_frame_seqid;
    this.wscp.apps_item_seqid = this.lovinput.apps_item_seqid;
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.wscp["object_code"] = this.lovinput.object_code;
    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": this.wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }

    //------------------- Getting OFFLINE LOV SAVE ---------------------------------------------------//



    let objectKey = this.wscp.object_code + "_LOV_" + this.wscp.apps_item_seqid;
    if (this.wscp.object_code && this.wscp.apps_working_mode === 'I') {
      this.sqlServ.getById(objectKey, 'item_master').then(data => {
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

            if (data.responseStatus == "success") {
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
              this.generateLov();

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

        let data: any = res;
        if (data.responseStatus == "success") {
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
        } else {
          alert(data.responseMsg);
        }
      }).catch(err => {
        this.globalObjects.presentToast("4 Something went wrong please try again later!");
      })
    }
  }

  generateLov() {
    this.itemNameList = [];
    let checkedKey;
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
      if (codedata[1].toLowerCase() != 'item_visible_flag') {
        let head;
        if (coldata) {
          head = coldata.find(x => x.indexOf("item_visible_flag") > -1);
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

        let wheredataArr = [];
        for (let c of coldata) {
          let k = c.split("~");

          if (k[0] == "display_setting_str" || k[0] == "item_visible_flag" || k[0] == "filter_flag") {
            if (k[0] == "display_setting_str") {
              val.display_setting_str = k[1];
            } else if (k[0] == "item_visible_flag") {
              val.item_visible_flag = k[1];
            } else if (k[0] == "filter_flag") {
              val.filter_flag = k[1];
            }
          } else {
            val.key = code;
          }
        }
        val.searchCol = "";
        this.keyList.push(val);
      }
    }

    if(this.lovinput.head){
      this.lovHead = this.lovinput.head;
    }

    if (this.lovinput.codeOfValues != undefined && this.lovinput.lType == "M") {
      var checkInput = [];

      checkInput = typeof (this.lovinput.codeOfValues) == 'string' ? (this.lovinput.codeOfValues.includes(",") ? this.lovinput.codeOfValues.split(",") : [this.lovinput.codeOfValues]) : this.lovinput.codeOfValues;

      if (this.lovinput.lov_return_column_str) {
        let retArr = this.lovinput.lov_return_column_str.split(";");
        let key = "";
        for (let l of retArr) {
          let name = l ? l.toLowerCase().split("lov.")[1].trim() : "";
          let itName = l ? l.toLowerCase().split(":=")[0] : "";
          itName = itName.includes(".") ? itName.split(".")[1].trim() : itName;
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

        for (let object of this.objectList) {
          for (let checkObject of checkInput) {
            if (checkObject && object && object[key] && checkObject.trim() == object[key].trim()) {
              object['checked'] = true;
            }
          }
        }

      } else {
        for (let object of this.objectList) {
          for (let key of this.keyList) {
            for (let checkObject of checkInput) {
              if (checkObject && object && object[key.key] && checkObject.trim() == object[key.key].trim()) {
                object['checked'] = true;
              }
            }
          }
        }
      }

    }
    this.l_current_page = 1;

    if (this.searchText) {
      this.noChange(this.searchText);
    } else {
      this.paginate(this.l_current_page);
    }

  }

  paginate(num) {
    if (num == 1) {
      this.limitedRecords = [];
    }
    let to = this.noOfRecords * num;
    let from = to - this.noOfRecords;

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
    this.l_current_page = num;
    this.l_total_remain_pages = Math.ceil((data.length) / this.noOfRecords);
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

  getParsedJson(json) {
    if(!json){
      return {}
    }
    try {
      if (typeof(json) == "string") {
        return JSON.parse(json);
      }
      if (typeof(json) == 'object' && json != null) {
        return json;
      }
    } catch (err) {
      console.error("error violation", err)
      return
    }
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

  noChange(val) {

    if (this.objectList) {
      if (val) {
        let vals = this.pipemy.transform(this.objectList, this.searchText);
        if (vals) {
          this.filterableData = vals;
        }
      } else {
        this.filterableData = this.objectList;
      }
      this.paginate(1);
    }

  }


  filterColumn(key, str) {
    if (str) {
      let vals = this.objectList.filter(x => x[key] && x[key].toLowerCase().includes(str.toLowerCase()));
      if (vals) {
        this.filterableData = vals;
      } else {
        this.filterableData = [];
      }
    } else {
      this.filterableData = this.objectList;
    }
    this.paginate(1);
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

}

