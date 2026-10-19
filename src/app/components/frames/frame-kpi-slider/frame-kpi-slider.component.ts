import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { LoadingController, ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-frame-kpi-slider',
  templateUrl: './frame-kpi-slider.component.html',
  styleUrls: ['./frame-kpi-slider.component.scss'],
})
export class FrameKpiSliderComponent implements OnInit {
  slideOpts:any;
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails:any;
  wscp: any;
  callingObjectArr: any[];
  tableData: any[];
  colSize: any[];
  noOfSlide:any;
  developerModeData :any ;

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, public modalController: ModalController,
    public loadingController: LoadingController) {

    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-kpi-slider")
    }
  }

  ngOnInit() {
    for (let itemGroup of this.frame.Level4) {
      itemGroup.groupCol = [];
      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-');
        this.colSize = itemGroup.groupCol;
      }
      
    }
    this.frame.tableRows = [];
    this.frame.tableRows[0] = JSON.parse(JSON.stringify(this.frame.Level4));
    this.getData();
  }


  getData() {

    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.object_code = this.frame.object_code;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_working_mode = this.wscp_send_input.apps_working_mode;
    wscp.item_sub_type = this.wscp_send_input.item_sub_type;
    this.wscp = wscp;
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    var reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }

    let l_url = "S2U";
    this.dataService.postData(l_url, reqData).then(res => {

      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);

        // Developer Mode Loging
        let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
        let wsSewId = id ? data.responseData.Values[0][id] : "";
        this.developerModeData = {
          ws_seq_id: wsSewId,
          frame_seq_id: reqData.wscp.apps_page_frame_seqid
        }
      //Developer Mode Loging

        // For Getting *CALLING_OBJECT_CODE* from Frame //
        this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //

        let tableData = objData.Level1;
        this.tableData = tableData;
          let itemData: any;
          for (let itemGrp of this.frame.Level4) {
            for (let item of itemGrp.Level5) {
              if (item.item_sub_type == 'KPI_PROMPT') {
                itemData = itemGrp;
                this.noOfSlide = item.to_value;
              }
            }
          }
      
          let tableKey = [];
          if (tableData.length > 0) {
            tableKey = Object.keys(tableData[0]);
          }
          for (let table of tableData) {
            let kpiValue;
            let kpiItem = itemData.Level5[0];
      
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                for (let key of tableKey) {
      
                  if ((item.item_sub_type == 'KPI_PROMPT' || item.item_sub_type == 'KPI_VALUE' || item.item_sub_type == 'KPI_MESSAGE') && item.item_visible_flag == 'T') {
                    if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                      if (kpiValue) {
                        kpiValue += "@" + table[key];
                        kpiItem.value = kpiValue;
                      } else {
                        kpiValue = table[key];
                        kpiItem.value = kpiValue;
                      }
                    }
                  } else {
                    if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase()) && item.item_visible_flag == 'T') {
                      item.value = table[key]
                    }
                  }
                }
              }
            }
      
            let framelvl4Arr = [];
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                if (item.value) {
                  framelvl4Arr.push(itemGroup);
                }
              }
            }
            tableRows.push(framelvl4Arr);
          }
          let i = tableRows.length - 1;
          tableRows[i].push(itemData);
        
          let finalRows = [];
          let count = 0;
          let rowsLength = -1;
          let newTabRows = [];
          let f = JSON.parse(JSON.stringify(tableRows));
          for (let x of f) {
            rowsLength++;
            for (let itemGroup of x) {
              for (let z of itemGroup.Level5) {
               
                if (z.item_sub_type == "KPI_PROMPT") {
                  count++;
                  newTabRows.push(itemGroup);
                  if(count == z.to_value || rowsLength == tableRows.length){
                    finalRows.push(newTabRows);
                    count = 0;
                    newTabRows = []
                  }
                }
              }
          }

        }

        let rowCount = 0;
        let itemCount = 0;
        let tabRowsArr = [];
        let SlideRowsArr = [];
        let finalSlides = [];
        for(let tabData of finalRows){
          for(let itemGroup of tabData){
            rowCount++;
            for(let z of itemGroup.Level5){
              itemCount++;
              tabRowsArr.push(z)
              if(itemCount == this.colSize.length || rowCount == tabData.length ){
                itemGroup.Level5 = tabRowsArr;
                SlideRowsArr.push(itemGroup);
                tabRowsArr = [];
                itemCount = 0;
              }
            }
          }
          finalSlides.push(SlideRowsArr);
          SlideRowsArr = [];
          rowCount = 0;
        }
          this.frame.tableRows = finalSlides;
      }
    })
  }

  itemClickedKpi(event, i, x,j) {
    delete this.frame['executing_index'];
    let z = 0;
    for(let y of this.colSize){
      z +=i;
    } 
    let k = j * this.colSize.length;
    let l = parseInt(event.to_value) * i;
    let rowindex = x + k + l;
    let tableRows = [];
    let tableKey = [];
    if (this.tableData.length > 0) {
      tableKey = Object.keys(this.tableData[0]);
    }
    for (let table of this.tableData) {

      let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          for (let key of tableKey) {
            if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
              item.value = table[key]
            }
          }
        }
      }
      tableRows.push(frameLevel4);
    }
    let wsdp = [];
    let wsdpcl = [];
    let col = {};
    for (let itemGroup of tableRows[rowindex]) {
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
    wsdp.push(col);
    wsdpcl.push(col);
    event.wsdpcl = wsdpcl;
    event.wsdp = wsdp;
    event.callingObjectArr = this.callingObjectArr;
    event.itemIndex = rowindex;
   this.emitPass.emit(event);
  }

  async showDeveloperData(){
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
}
