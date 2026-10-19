import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import {  ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { Events } from 'src/app/services/events';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-frame-collaps',
  templateUrl: './frame-collaps.component.html',
  styleUrls: ['./frame-collaps.component.scss'],
})
export class frameCollapsComponent implements OnInit,OnDestroy {

  @Input() frame: any = {};
  @Input() wscp: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  framearray: any = [];
  userDetails: any;
  public show: boolean = false;
  text: string;
  public buttonName: any = 'ios-arrow-forward';
  data: any = [];
  l_total_rows: number;
  developerModeData: any;
  loading = false;
  itemsDivider = [];
  colSize: any = [];

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, public modalController: ModalController, private events:Events,private lhs_lib:LhsLibService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.text = 'Hello World';
    this.data = ['Mr.Jone 24/05/2019', 'Mr.Jone 24/05/2019'];
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-collaps")
    }
  }

  ngOnDestroy(): void {
    let bullName = "wmaBultins" + this.frame.apps_page_frame_seq_id;
    this.events.unsubscribe(bullName);
  }

  ngOnInit() {
    let bullName = "wmaBultins" + this.frame.apps_page_frame_seq_id;
    this.events.unsubscribe(bullName);
    this.events.subscribe(bullName, res => {
      if(res.evFlag == "T"){
        res.evFlag = "F";
        this.parseBuiltins(res.key);
      }
    })
	
    for (let itemGroup of this.frame.Level4) {
      for (let item of itemGroup.Level5) {
        if ((Object.keys(this.globalObjects.devItemName).length > 0) && this.globalObjects.devItemName[item.item_name]) {
          item.value = this.globalObjects.devItemName[item.item_name];
        }
       
        if (item.item_position_divider) {
          let ids = item.item_position_divider.split(",");
          for (let id of ids) {
            this.itemsDivider.push(id);
          }
        }
      }
    }

	  this.parseBuiltins(0);
  }

  toggle() {
    this.show = !this.show;
    if (this.show)
    this.buttonName = "ios-arrow-down";
    else{
      this.buttonName = "ios-arrow-forward";
    } 
  }

  parseBuiltins(i){
    let builtinsArr = [];
    if(this.frame.on_frame_load_str && this.frame.on_frame_load_str.indexOf(";") > -1){
      builtinsArr = this.frame.on_frame_load_str.split(";");
    }else{
      builtinsArr[0] = this.frame.on_frame_load_str;
    }

    if(builtinsArr[i]){
      this.executeBuiltins(builtinsArr[i],i);
    }else{
      this.populateDataFromJson();
    }
  }

  executeBuiltins(service_type,key){
    if(service_type == "itemwise_sql_populate_data" || service_type == "item_frame_sql_populate_data" || service_type == "execute_query" || service_type == "frame_sql_populate_data"){
      this.getData(service_type,key)
    }else{
      if(service_type){
        this.globalObjects.bulitinsEvent(service_type, key, this.frame.apps_page_frame_seqid,this.frame.on_frame_load_str);
      }
    }
  }

  getData(service_type?,bull_Key?) {
    this.loading = true;
    let wscp: any = {};
    wscp.object_code = this.frame.object_code;
    wscp.service_type = service_type ? service_type : this.frame.on_frame_load_str ;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;


    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }


    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
      
      this.loading = false;
      let data: any = res;



      if (data.responseStatus == "success") {
        if (data.responseData.Level1_Keys.length > 0) {
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          }
        }
        //Developer Mode Loging

        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        let tableKey = [];
        if (tableData.length > 0) {
          tableKey = Object.keys(tableData[0])
        }

        this.l_total_rows = tableData[0].TOTAL_ROWS;

        for (let table of tableData) {
          let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
          for (let itemGroup of frameLevel4) {
            for (let item of itemGroup.Level5) {
              for (let key of tableKey) {
                if (item.item_name.toUpperCase() == key.toUpperCase()) {
                  item.value = table[key]
                }
              }
            }
          }
          tableRows.push(frameLevel4);
        }

        this.frame.tableRows = tableRows;
        this.itemSeparation();
        this.setPromptColTableRows();
      }

      if (!this.frame.tableRows) {
        this.frame.tableRows = [];
        this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
      }

    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
    })

  }

  itemClicked(event, rowindex) {
    delete this.frame['executing_index'];
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
              if(item.value){
                col[item.apps_item_seqid] = item.value
              }else {
                col[item.apps_item_seqid] = ""
              }
            }
          }
        }
      }

      event.wsdp.push(col);
    }
    this.emitPass.emit(event);
  }

  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData:this.frame
      }
    });
    return await modal.present();

  }
  
  async populateDataFromJson() {


    if (this.globalObjects.allFrameJsonData.length > 0) {
      let i = 0;
      let index;
      for (let g of this.globalObjects.allFrameJsonData) {
        if ((g.frame_name == this.frame.apps_page_frame_seqid || (this.frame.frame_alias ? (g.frame_name ? g.frame_name.toLowerCase() : g.frame_name) == this.frame.frame_alias.toLowerCase() : false))) {
          index = i;
          for (let p of g.paraData) {

            

            if(p.paraType == 'IV'){
              for(let i of p.frameData){
                let str = "";
                let val = [];
                 let rowIndex = i.key;

                for(let im of i.items){
                  str = str + im.item_name + ",";
                  val.push(im.para_value);
                }

                let valObj = {
                  rowData:val,
                  pageNo:this.frame.apps_page_no
                }
                let itemName = g.frame_name + "[" + str + "]";
                this.lhs_lib.set_row_values(itemName,valObj,rowIndex);

              }
            }

            if(p.paraType == 'SC'){
              for(let i of p.frameData ){
                for (let im of i.items) {
                  let name = g.frame_name + "." + im.item_name;
                  let index = i.key;
                  this.lhs_lib.set_item_config(name,im.para_name,im.para_value,index);
                }
              }
            }

            if (p.paraType == 'FSC') {
              for (let i of p.frameData) {
                for (let im of i.items) {
                  this.lhs_lib.set_frame_config(im.frame_name,im.para_name,im.para_value);
                }
              }
            }
          }
        }
     i++
      }
      this.globalObjects.allFrameJsonData.splice(index,1);
    }

    if (!this.frame.tableRows || this.frame.tableRows.length <= 0) {
      let indexcount: number = -1;
      let tableRows = [];
      indexcount++;
      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          item.indexcount = JSON.parse(JSON.stringify(indexcount));
        }
      }
      tableRows.push(frameLevel4);

      this.frame.tableRows = tableRows;
     
    }
    this.itemSeparation();
   
  }

  itemSeparation() {
    if (this.itemsDivider && this.itemsDivider.length > 0) {
      if (this.frame.tableRows) {
        for (let tableData of this.frame.tableRows) {
          let sepItems = [];
          for (let itemGroup of tableData) {
            if (itemGroup.Level5) {
              let itemIndex = 0;
              for (let item of itemGroup.Level5) {
                for (let id of this.itemsDivider) {
                  if ((id == item.item_name || id == item.apps_item_seqid) && !item.prompt_name) {
                    sepItems.push(item);
                    itemGroup.Level5.splice(itemIndex, 1);
                    if (itemGroup.Level5 && itemGroup.Level5.length == 0) {
                      itemGroup.Level5 = undefined;
                    }
                  }
                }
                itemIndex++;
              }
            }
          }

          for (let itemGroup of tableData) {
            if (itemGroup.Level5) {
              let index = 0;
              let level5 = [];
              for (let item of itemGroup.Level5) {
                if (item.item_position_divider) {
                  level5.push(item);
                  let itemId = item.item_position_divider.split(",");
                  for (let id of itemId) {
                    for (let sepItem of sepItems) {
                      if (sepItem.item_name === id || sepItem.apps_item_seqid === id) {
                        sepItem.itemSeparator = {
                          "padding" :"1px 0px"
                        };
                        level5.push(sepItem);
                      }
                    }
                  }
                } else {
                  level5.push(item);
                }

                index++;
              }
              itemGroup.Level5 = level5;
              if (itemGroup.design_control_type) {
                itemGroup.groupCol = itemGroup.design_control_type.split('-');
                this.colSize = itemGroup.groupCol;
                let index = 0;
                for (let itm of itemGroup.Level5) {
                  if (itm.item_visible_flag == 'T') {
                    let col = itemGroup.groupCol[index];
                    itm.promptCol = (1.5 * 12 / parseFloat(col)) > 12 ? 12 : (1.5 * 12 / parseFloat(col));
                    index++;
                  }
                }
              }
              else if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                let invisibleCnt = 0;
                for (let item of itemGroup.Level5) {
                  if (item.item_visible_flag != 'T') {
                    invisibleCnt++;
                  }
                }
                if (this.frame.design_control_type) {
                  let frameCol = 12 / parseFloat(this.frame.design_control_type);
                  let count = itemGroup.Level5.length - invisibleCnt;
                  for (let itm of itemGroup.Level5) {

                    let col = (12 / count);
                    itm.promptCol = (1.5 * (frameCol * 12) / col) > 12 ? 12 : (1.5 * (frameCol * 12) / col);

                  }
                } else {
                  let count = itemGroup.Level5.length - invisibleCnt;
                  for (let itm of itemGroup.Level5) {

                    let col = (12 / count);
                    itm.promptCol = (1.5 * 12 / col) > 12 ? 12 : (1.5 * 12 / col);

                  }
                }

              }
            }
          }
        }
      } else {
        let sepItems = [];
        for (let itemGroup of this.frame.Level4) {
          if (itemGroup.Level5) {
            let itemIndex = 0;
            for (let item of itemGroup.Level5) {
              for (let id of this.itemsDivider) {
                if ((id == item.item_name || id == item.apps_item_seqid)  && !item.prompt_name) {
                  sepItems.push(item);
                  itemGroup.Level5.splice(itemIndex, 1);
                  if (itemGroup.Level5 && itemGroup.Level5.length == 0) {
                    itemGroup.Level5 = undefined;
                  }
                }
              }
              itemIndex++;
            }
          }
        }

        for (let itemGroup of this.frame.Level4) {
          if (itemGroup.Level5) {
            let index = 0;
            let level5 = [];
            for (let item of itemGroup.Level5) {
              if (item.item_position_divider) {
                level5.push(item);
                let itemId = item.item_position_divider.split(",");
                for (let id of itemId) {
                  for (let sepItem of sepItems) {
                    if (sepItem.item_name === id || sepItem.apps_item_seqid === id) {
                      sepItem.itemSeparator = {
                        "padding" :"1px 0px"
                      };
                      level5.push(sepItem);
                    }
                  }
                }
              } else {
                level5.push(item);
              }

              index++;
            }
            itemGroup.Level5 = level5;
            if (itemGroup.design_control_type) {
              itemGroup.groupCol = itemGroup.design_control_type.split('-');
              this.colSize = itemGroup.groupCol;
              let index = 0;
              for (let itm of itemGroup.Level5) {
                if (itm.item_visible_flag == 'T') {
                  let col = itemGroup.groupCol[index];
                  itm.promptCol = (1.5 * 12 / parseFloat(col));
                  index++;
                }
              }
            }
            else if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              let invisibleCnt = 0;
              for (let item of itemGroup.Level5) {
                if (item.item_visible_flag != 'T') {
                  invisibleCnt++;
                }
              }
              if (this.frame.design_control_type) {
                let frameCol = 12 / parseFloat(this.frame.design_control_type);
                let count = itemGroup.Level5.length - invisibleCnt;
                for (let itm of itemGroup.Level5) {

                  let col = (12 / count);
                  itm.promptCol = (1.5 * (frameCol * 12) / col);

                }
              } else {
                let count = itemGroup.Level5.length - invisibleCnt;
                for (let itm of itemGroup.Level5) {

                  let col = (12 / count);
                  itm.promptCol = (1.5 * 12 / col);

                }
              }

            }
          }
        }

      }

    }
  }

  setPromptColTableRows() {
    if(this.frame.tableRows){
    for (let framedata of this.frame.tableRows) {

      for (let itemGroup of framedata) {
    itemGroup.groupCol = [];
    if (itemGroup.design_control_type) {
      itemGroup.groupCol = itemGroup.design_control_type.split('-');
      this.colSize = itemGroup.groupCol;
      let index = 0;
      for (let itm of itemGroup.Level5) {
        if (itm.item_visible_flag == 'T') {
          let col = itemGroup.groupCol[index];
          itm.promptCol = (1.5 * 12 / parseFloat(col));
          index++;
        }
      }
    }
    else if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
      let invisibleCnt = 0;
      for (let item of itemGroup.Level5) {
        if (item.item_visible_flag != 'T') {
          invisibleCnt++;
        }
      }
      if (this.frame.design_control_type) {
        let frameCol = 12 / parseFloat(this.frame.design_control_type);
        let count = itemGroup.Level5.length - invisibleCnt;
        for (let itm of itemGroup.Level5) {

          let col = (12 / count);
          itm.promptCol = (1.5 * (frameCol * 12) / col);

        }
      } else {
        let count = itemGroup.Level5.length - invisibleCnt;
        for (let itm of itemGroup.Level5) {

          let col = (12 / count);
          itm.promptCol = (1.5 * 12 / col);

        }
      }
    }
  }
}
  }
  }

}