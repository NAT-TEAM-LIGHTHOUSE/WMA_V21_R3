import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-frame-card-slider',
  templateUrl: './frame-card-slider.component.html',
  styleUrls: ['./frame-card-slider.component.scss'],
})
export class FrameCardSliderComponent implements OnInit {
  sliderConfig = {
    spaceBetween :10,
    slidesPerView:1.2
   }

   @Input() frame: any = {};
   @Input() wsdp: any = {};
   @Input() wscp_send_input: any = {};
   @Input() wsdpcl: any = {};

   @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
   thead: any = [];
   thead2: any = [];
   dispalyss: any = { "color": "red", "text-yellow": "pink" };
   userDetails: any;
   l_total_rows: number;
   l_current_page: number;
   c_from_row: number;
   c_to_row: number;
   l_total_remain_pages: number;
   l_where_str: any;
   filterFormData: any = [];
   l_card_title: any;
   tablerowsfilter: any;
   callingObjectArr : any = [];
   wscp: any = {};
   noRecordMessage: any;
   listLength: number;
   tableRows: any = [];

   public show: boolean = false;
   public show_filter: any = 'dontshow';
   public horizontal_table: any = 'Show';
   constructor(private globalObjects: GlobalObjectsService, private dataService: DataService){
      this.userDetails = this.globalObjects.getLocallData("userDetails");
      if(this.globalObjects.frameFlag){
        return applyLoggingDecorator(this,"frame-card-slider")
      }
   }

   ngOnInit() {}

   filterToggle() {
     if (this.show_filter == 'show') {
       this.show_filter = 'dontshow';
     }
     else {
       this.show_filter = 'show';
     }
   }

   itemClicked(event, rowsdata, i) {
    let col = {};
    for (let itemGroup of this.frame.tableRows[i]) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if (item.codeOfValues) {
            col[item.apps_item_seqid] = item.codeOfValues
          } else {
            col[item.apps_item_seqid] = item.value
          }
        }
      }
    }
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    this.wscp_send_input.apps_item_seqid = event.apps_item_seqid;
    event.wscp = this.wscp_send_input;

    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow.Level5[0].item_name == "ROWNUMBER") {
        rowindex = dataRow.Level5[0].value - 1;
      }
    }
    if(!rowindex){
      rowindex = i;
    }

    event.callingObjectArr = this.callingObjectArr;
    event.itemIndex = rowindex;
     if (event.click_events_str == "editItem") {
       let frameLevel4 = JSON.parse(JSON.stringify(this.frame.tableRows[rowindex]))
       for (let itemGroup of frameLevel4) {
         if (itemGroup.Level5) {
           for (let item of itemGroup.Level5) {
             let temp = item.design_control_type_auto_card;
             item.design_control_type_auto_card = item.design_control_type;
             item.design_control_type = temp;

             temp = item.display_setting_str_auto_card;
             item.display_setting_str_auto_card = item.display_setting_str;
             item.display_setting_str = temp;

             temp = item.flag_auto_card;
             item.flag_auto_card = item.item_visible_flag;
             item.item_visible_flag = temp;

             item.item_type = item.temp_item_type

           }
         }
       }
       this.frame.tableRows.splice(rowindex, 1);
       event.EDIT_ITEM = frameLevel4;
       this.emitPass.emit(event);
     } else if (event.click_events_str == "deleteItem") {
       this.frame.tableRows.splice(rowindex, 1);
     }
     else {
       event.wsdp = [];
       let col = {};
       for (let itemGroup of this.frame.tableRows[rowindex]) {
         if (itemGroup.Level5) {
           for (let item of itemGroup.Level5) {
             if (item.codeOfValues) {
               col[item.apps_item_seqid] = item.codeOfValues
             } else {
               col[item.apps_item_seqid] = item.value
             }
           }
         }
       }
       event.wsdp.push(col);
     }
     this.emitPass.emit(event);
   }

   itemValueChange(event, rowindex) {
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
      if (event.dependent_column_sql && event.value) {
        this.getDependentData(event, rowindex).then(res => {
          if (res === "success") {
            if (event.post_text_validate_plsql) {
              this.PostTextValidatePlsql(event, rowindex);
            }
          }
        });
      } else if (event.post_text_validate_plsql && event.value) {
        this.PostTextValidatePlsql(event, rowindex);
      }
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

      let newWsdp = [];
      newWsdp.push(Object.assign(this.wsdp[0], event.wsdp[0]));

      var data = {
        "wslp": this.userDetails,
        "wscp": wscp,
        "wsdp": newWsdp
      }

      let l_url = "S2U";
      this.dataService.postData(l_url, data).then(res => {
        let data: any = res;
        if (data.responseStatus == "success") {
          let objData = this.globalObjects.setPageInfo(data.responseData)
          if (objData && (objData.Level1.length > 0 ) && (objData.Level1[0].status == "F" || objData.Level1[0].status == "Q")) {
            if (objData.Level1[0].message) {
              this.globalObjects.presentAlert(objData.Level1[0].message);
            }}
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
    this.globalObjects.showLoading();
    let wscp: any = {};
    wscp.service_type = "PostTextValidatePlsql";
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    wscp.apps_item_seqid = event.apps_item_seqid;
    wscp.apps_page_no = event.apps_page_no;
    wscp.object_code = event.object_code;

    var inputData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": event.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, inputData).then(res => {

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
          this.globalObjects.clickedbutton = false;
        }
      }
    }).catch(err => {
      this.globalObjects.presentToast("1.7 Something went wrong please try again later!");
    })
  }

   getFilterParameter(event) {
     this.l_where_str = event.where_str;
     this.frame.flagtoclosefilter = event.flagtoclosefilter;
   }

   openMike() {
     this.globalObjects.speechdata = '';
     this.globalObjects.startListening().then(res => {
       this.tablerowsfilter = res;
     });
   }

   openbarcodescanner(){
     this.globalObjects.barcodescanner().then(res => {
     this.tablerowsfilter = res;
     });
   }
 }
