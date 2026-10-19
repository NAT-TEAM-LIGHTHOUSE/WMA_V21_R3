import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-frame-addon',
  templateUrl: './frame-addon.component.html',
  styleUrls: ['./frame-addon.component.scss'],
})
export class FrameAddonComponent implements OnInit {

 
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() sessionObj: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  userDetails: any;
  showFrame: boolean = false;
  addonPram: any = [];
  TOTAL_AMT: any;
  loading: boolean = false;
  developerModeData: any;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService,public loadingController: LoadingController,public modalController: ModalController,
    private events:Events, private lhs_lib:LhsLibService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-addon")
    }
  }
  ngOnInit() {
    let keys
    if (this.sessionObj) {
      keys = Object.keys(this.sessionObj);  // returns ["person", "age"]

    }


    for (let itemGroup of this.frame.Level4) {
      itemGroup.groupCol = [];
      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-')
      }
      for (let item of itemGroup.Level5) {
        if (keys && keys.indexOf(item.item_name) > -1) {
          item.value = this.sessionObj[item.item_name];
        }
      }
    }
    this.frame.tableRows = [];
    this.frame.tableRows[0] = this.frame.Level4;
      this.events.unsubscribe(this.frame.apps_page_frame_seqid);
    this.events.subscribe(this.frame.apps_page_frame_seqid, (res) => {
      if(res=='refreshaddon'){
        this.refreshAddonNew();
      }else{
         this.getDataNew();
      }
    })
    this.developerModeData = {
           ws_seq_id: "",
      frame_seq_id: this.frame.apps_page_frame_seqid
          }
  }


  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str ;
    wscp.from_row = String(1);
    wscp.to_row = String(10);
    wscp.object_code = this.frame.object_code;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    if (this.wscp_send_input.prev_ws_seqid) {
      wscp.prev_ws_seqid = this.wscp_send_input.prev_ws_seqid;
    }
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    // wscp.single_frame_wsdp = true;
    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
 
      
      let data: any = res;
      if (data.responseStatus == "success") {

          // Developer Mode Loging
          let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
          let wsSewId = id ? data.responseData.Values[0][id] : "";
          this.developerModeData = {
            ws_seq_id: wsSewId,
            frame_seq_id: reqData.wscp.apps_page_frame_seqid
          }
          //Developer Mode Loging

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1[0];
        let count = 1;
        for (let i = 1; i < 20; i++) {
          let addon = {};
          if (tableData["ADDONNAME" + i]) {
            addon["ADDONNAME" + i] = tableData["ADDONNAME" + i];
            addon["AFCODE" + i] = tableData["AFCODE" + i];
            addon["AFRATE" + i] = tableData["AFRATE" + i];
            addon["AFRATEI" + i] = tableData["AFRATEI" + i];
            addon["AFRATEIDESC" + i] = tableData["AFRATEIDESC" + i];
            addon["AFLOGIC" + i] = tableData["AFLOGIC" + i];
            addon["AFIELD" + i] = "";
            this.addonPram.push(addon)
            count++;
          }
        }
        this.TOTAL_AMT = tableData.TOTAL_AMT;
        this.globalObjects.hideLoadingNew();

      // vijay

        this.getAddOnValue();
      }
      this.showFrame = true;

    }).catch(err => {
      this.showFrame = true;
      this.globalObjects.hideLoadingNew();
      this.globalObjects.presentToast("1.1 Something went wrong please try again later!");
    })
  }


  getAddOnValue() {
    let wscp: any = {};
    wscp.service_type = "getAddOnValue";
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": []
    }

    // wscp.single_frame_wsdp = true;
    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);

        if (objData.Level1[0].status == "F") {
          this.globalObjects.presentAlert(objData.Level1[0].message)
        }
        else if (objData.Level1[0].status == "Q") {
          this.globalObjects.presentAlert(objData.Level1[0].message);
        }

        let tableData = objData.Level1[0];
        let i = 1;
        for (let addon of this.addonPram) {
          addon["AFIELD" + i] = tableData["AFIELD" + i];
          i = i + 1;
        }
        this.TOTAL_AMT = tableData.DRAMT;
      }
    }).catch(err => {
      this.globalObjects.hideLoadingNew();
      this.globalObjects.presentToast("1.2 Something went wrong please try again later!");
    })
  }

  refreshAddon() {
    let wscp: any = {};
    wscp.service_type = "updateAddonFeilds";
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    // wscp.single_frame_wsdp = true;
    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.addonPram
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
     
      this.globalObjects.hideLoadingNew();
      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1[0];
        let i = 1;
        for (let addon of this.addonPram) {
          addon["AFIELD" + i] = tableData["AFIELD" + i];
          i = i + 1;
        }
        this.TOTAL_AMT = tableData.DRAMT;
      }
    }).catch(err => {
      this.globalObjects.hideLoadingNew();
      this.globalObjects.presentToast("1.3 Something went wrong please try again later!");
    })
  }


  itemClicked(event) {
    delete this.frame['executing_index'];
    event.click_events_str = "CLOSE_PAGE"
    this.emitPass.emit(event);
  }

  saveByProcedure() {
    let wscp: any = {};
    wscp.service_type = "insertProcessWebData";
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    let wsdp = [];

    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": wsdp
    }
    // wscp.single_frame_wsdp = true;

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {
       this.globalObjects.hideLoadingNew();
      let data: any = res;
      if (data.responseStatus == "success") {

        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1[0];
        if (tableData.vrno) {
          let msg = tableData.vrno.split("#");
          if (msg[0] == "T") {
            this.globalObjects.presentAlert("Data saved sucessfully VRNO : " + msg[1])
          } else {
            this.globalObjects.presentAlert(msg[1])
          }

        }
        this.itemClicked(data.responseData);
      }

    }).catch(err => {
       this.globalObjects.hideLoadingNew();
      this.globalObjects.presentToast("1.4 Something went wrong please try again later!");
    })
  }

  buttonClick() {
  }

  itemValueChange(event, rowindex) {
    if (this.frame.tableRows) {
      let col = {};
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
      this.wsdp.push(col);
    }
    this.addonPram = [];
    this.getData();
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
      this.showFrame = true;
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
  }

   getDataNew(){
    if(this.frame.tableData.length >0){

  
     let tableData =this.frame.tableData[0];
        let count = 1;
        for (let i = 1; i < 20; i++) {
          let addon = {};
          if (tableData["ADDONNAME" + i]) {
            addon["ADDONNAME" + i] = tableData["ADDONNAME" + i];
            addon["AFCODE" + i] = tableData["AFCODE" + i];
            addon["AFRATE" + i] = tableData["AFRATE" + i];
            addon["AFRATEI" + i] = tableData["AFRATEI" + i];
            addon["AFRATEIDESC" + i] = tableData["AFRATEIDESC" + i];
            addon["AFLOGIC" + i] = tableData["AFLOGIC" + i];
            addon["AFIELD" + i] = "";
            this.addonPram.push(addon)
            count++;
          }
        }
        this.TOTAL_AMT = tableData.TOTAL_AMT;
        this.globalObjects.hideLoadingNew();

     

        // this.getAddOnValue();
          }
         this.showFrame = true;
   }
  refreshAddonNew(){
    if(this.frame.tableData.length >0){
      let tableData=this.frame.tableData[0]
      let i = 1;
      for (let addon of this.addonPram) {
          addon["AFIELD" + i] = tableData["AFIELD" + i];
          i = i + 1;
      }
      this.TOTAL_AMT = tableData.DRAMT;
    }
  }
}
