import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,ItemsComponent,SearchfilterPipe],
  selector: 'app-frame-add-to-cart',
  templateUrl: './frame-add-to-cart.component.html',
  styleUrls: ['./frame-add-to-cart.component.scss'],
})
export class FrameAddToCartComponent implements OnInit, OnDestroy {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  current_page_parameter: any = {};
  thead: any = {};
  userDetails: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  searchText: any;
  tableRows = [];
  tablerowsfilter: any;
  barcodedata: any;

  filterFormData: any = [];

  setStrIndex: any = { "width": "20px", "max-width": "20px", "min-width": "15px" };
  disSetId: any;

  maincartRows = [];
  summCart: boolean = false;

  cartBtn = true;

  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;
  public showAddButton: Boolean = true;
  public showQunatityInput: Boolean = false;

  loadMoreFlag: string;
  summaryRow: any[];

  cartItems: boolean = false;

  subscribeRefreshFlag = false;
  frameRefreshframeSeqId=""
  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, private events: Events,private lhs_lib: LhsLibService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.events.subscribe("same_page", (res) => {
      this.wsdp = res;
    })
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "frame-add-to-cart")
    }
  }

  ngOnDestroy(): void {
    this.events.unsubscribe("same_page");
  }

  ngOnInit() {
    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;

    if (this.frame.Level4 && this.frame.Level4.length > 3) {
      for (let itemGroup of this.frame.Level4) {
        let filterFlag = false;
        for (let itemMast of itemGroup.Level5) {
          if (itemMast.item_filter_flag) {
            filterFlag = true;
          }
          if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
            (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
          ) { } else {
            let head = {
              prompt_name: itemMast.prompt_name,
              display_setting_str: itemMast.display_setting_str
            }
            theaddata.push(head);
          } if (itemMast.item_default_value) {
            itemMast.value = itemMast.item_default_value;
          }
        }
        if (filterFlag) {
          this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
        }

      }
      this.thead = theaddata;
    } else {
      this.showSumm();
    }
  }

  showSumm() {
    this.frame.tableRows = [];
    this.cartItems = true;
    if (this.globalObjects.cartSummaryPlain.length > 0) {
      let tableRows = [];
      this.frame.summcartArr = this.globalObjects.cartSummaryPlain;
      for (let row of this.globalObjects.cartSummaryPlain) {

        let rows = JSON.parse(JSON.stringify(row.cartRows));
        this.lhs_lib.make_row_dirty(null,rows);
        tableRows.push(rows);

        
      }
      this.frame.tableRows = tableRows;
    }
  }

  ShowQty(event, tabledata, r) {
    event.addBtn = false;
    event.value = 1;
    this.itemValueChange(event, tabledata, r);
    if(this.frameRefreshframeSeqId){
      this.refreshFrame(event);
    }
    
  }

  addToCartPage(event, tabledata, r) {
    var rowindex;
    for (let dataRow of tabledata) {
      if (dataRow.Level5[0].item_name == "ITEM_NAME") {
        rowindex = dataRow.Level5[0].value;
      }
    }
    if (this.frame.summcartArr?.length > 0) {

      let cartObj = this.frame.summcartArr.find(s => s.key == rowindex);
      if (cartObj) {
        if (event.value) {
          cartObj.key = rowindex;
          cartObj.cartRows = tabledata;
          this.globalObjects.cartSummaryPlain = this.frame.summcartArr;
        } else {
          let index = this.frame.summcartArr.indexOf(cartObj);
          this.frame.summcartArr.splice(index, 1);
          this.globalObjects.cartSummaryPlain = this.frame.summcartArr;

        }
      } else {
        let summObj = {
          key: rowindex,
          cartRows: tabledata
        }
        this.frame.summcartArr.push(summObj);
        this.globalObjects.cartSummaryPlain = this.frame.summcartArr;
      }

    } else {
      if (event.value) {
        let summObj = {
          key: rowindex,
          cartRows: tabledata
        }
        this.frame.summcartArr = [];
        this.frame.summcartArr.push(summObj);
      }
    }
    if (this.frame.apps_page_no == "3") {

    }

  }


  ShowAddButton() {
    document.getElementById("showAddButton").style.display = "block";
    document.getElementById("showQunatityInput").style.display = "none";
  }

  itemValueChange(event, tabledata, rowindex) {

    if (event.value < 0) {
      this.cartBtn = false;
    } else {
      this.cartBtn = true;
      if (event.dependent_column_str) {
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
                  col[item.apps_item_seqid] = item.value
                }
                if (dependent_column_arr.indexOf(item.apps_item_seqid) > -1) {
                  item.codeOfValues = ""
                  item.value = ""
                }
                if (item.formula_str) {
                  item.value = this.globalObjects.autoCalculation(item.formula_str, this.frame.tableRows[rowindex])
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
        if (event.dependent_column_sql) {
          this.getDependentData(event, rowindex).then(res => {
            if (res === "success") {
              if (event.post_text_validate_plsql) {
                this.PostTextValidatePlsql(event, rowindex);
              }
            }
          });
        } else if (event.post_text_validate_plsql) {
          this.PostTextValidatePlsql(event, rowindex);
        }
      }
      this.addToCartPage(event, tabledata, rowindex);
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

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": event.wsdp
      }
      this.globalObjects.showLoading();
      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {

        let data: any = res;

        if (data.responseStatus == "success") {
          resolve("success");
          let keyValue = data.responseData;
          for (let itemGroup of this.frame.tableRows[rowindex]) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if (keyValue.Level1_Keys.indexOf(item.item_name) > -1) {
                  item.value = keyValue.Values[0][keyValue.Level1_Keys.indexOf(item.item_name)]
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
    let wscp: any = {};
    wscp.service_type = "PostTextValidatePlsql";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    wscp.apps_item_seqid = event.apps_item_seqid;
    wscp.apps_page_no = event.apps_page_no;
    wscp.object_code = event.object_code;

    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }

    this.globalObjects.showLoading();

    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {

      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let keyValue = data.responseData;

        if (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q") {
          if (objData.Level1[0].message) {
            alert(objData.Level1[0].message);
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
          alert(objData.Level1[0].message);
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
        }
      }
    }).catch(err => {

      this.globalObjects.presentToast("1.9 Something went wrong please try again later!");
    })

  }

  itemClicked(event, i) {
    event.wsdp = [];
    let col = {};
    delete this.frame['executing_index'];
    for (let tabledata of this.frame.summcartArr) {
      for (let itemGroup of tabledata.cartRows) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.value) {
              col[item.apps_item_seqid] = item.value;
            }
          }
        }
      }
    }
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);

    this.emitPass.emit(event);
  }

  //-------table order by start

  decreaseNum(event, tabledata, i) {
    if (event.value > 1) {
      event.value = parseInt(event.value) - 1;
      
    } else {
      event.value = "";
      event.addBtn=true
    }
    this.itemValueChange(event, tabledata, i);
   this.refreshFrame(event);
  }

  increaseNum(event, tabledata, i) {
    if (event.value) {
      event.value = parseInt(event.value) + 1;
    } else {
      event.value = 1;
    }
    this.itemValueChange(event, tabledata, i);
    this.refreshFrame(event);
    
  }

  showSumCart() {

    if (this.frame.summcartArr.length > 0) {
      if (!this.cartBtn) {
        this.globalObjects.presentAlert('Please input correct Value');
      } else {

        this.globalObjects.cartSummaryPlain = this.frame.summcartArr;
        let event: any = this.globalObjects.get_dummy_item();
        event.click_events_str = "app_next_page()";
        this.emitPass.emit(event);
      }
    } else {
      this.globalObjects.presentAlert("Please Add Some Item");
    }
  }

  backToCart() {
    this.summCart = false;
    this.frame.tableRows = [];
    this.frame.tableRows = this.maincartRows;

  }

  refreshFrame(event){
    if (this.frameRefreshframeSeqId) {
      this.events.publish("refreshFrame_cartSummaryPlain", this.frameRefreshframeSeqId);
    } else if(event.click_events_str && event.click_events_str.includes("refreshFrame")) {
        let clickEventstr = ""
        if (event.click_events_str && event.click_events_str.indexOf(";") > -1) {
          event.click_events_arr = event.click_events_str.split(";");
          for (let clickEvent of event.click_events_arr) {
            if (clickEvent.includes("refreshFrame")) {
              clickEventstr = clickEvent;
            }
          }
        } else {
          clickEventstr = event.click_events_str
        }
        this.frameRefreshframeSeqId = event.click_events_str.split("_")[1];
        this.events.publish("refreshFrame_cartSummaryPlain", this.frameRefreshframeSeqId);
    }
  }
}
