import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import {  ModalController } from '@ionic/angular/standalone';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { Events } from 'src/app/services/events';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
declare var google;
@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-scattechart',
  templateUrl: './frame-scattechart.component.html',
  styleUrls: ['./frame-scattechart.component.scss'],
})
export class FrameScattechartComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  callingObjectArr: any[];
  tableData: any;
  chart_div:any;
  userDetails: any;
  grapharray:any=[];
  scatteChart:any;
  scatteChartFlag:boolean=true;
  scatteChartValue:any;
  subscribeRefreshFlag = false;
  developerModeData: any;
  constructor( public globalObjects: GlobalObjectsService, private dataService: DataService, private events:Events, 
    public lhs_lib: LhsLibService,public modalController: ModalController) {
    this.userDetails = globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-scattechart")
    }
   }

   ngOnDestroy()
{
  let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toLowerCase().toString().replace(/-/g, "_")) + this.globalObjects.refreshId;
  this.events.unsubscribe(name);
  let aliasName = "refreshFrame" + ((this.frame.frame_alias ? this.frame.frame_alias : "").toLowerCase() + this.globalObjects.refreshId);
  this.events.unsubscribe(aliasName);
}
   ngOnInit() {

        let name = "refreshFrame" + ((this.frame.apps_page_frame_seqid).toLowerCase().toString().replace(/-/g, "_")) + this.globalObjects.refreshId;

    if (!this.subscribeRefreshFlag) {
      this.events.subscribe(name, res => {
        for (let f of res.refreshFrame) {
          if (f.key && f.key.toLowerCase() == this.frame.apps_page_frame_seqid.toLowerCase() && f.val == 'T') {
            f.val = 'F';
            this.wscp_send_input = res.wscp;
            this.wsdp = res.wsdp;
        
            if(f.jsonData){
              this.populateDataFromJson();
            }else{
              this.frame.tableRows = [];
              this.ngOnInit();
            }
          }
        }

      })
      this.subscribeRefreshFlag = true;
    }


    let aliasName = "refreshFrame" + ((this.frame.frame_alias ? this.frame.frame_alias : "").toLowerCase() + this.globalObjects.refreshId);
  
      this.events.subscribe(aliasName, res => {
        for (let f of res.refreshFrame) {
          if ((f.key.toLowerCase() == (this.frame.frame_alias && this.frame.frame_alias.toLowerCase())) && f.val == 'T') {
            f.val = 'F';
            this.wscp_send_input = res.wscp;
            this.wsdp = res.wsdp;
        
            if(f.jsonData){
              this.populateDataFromJson();
            }else{
              this.frame.tableRows = [];
              this.ngOnInit();
            }
          }
        }

      })
     



    this.developerModeData = {
      ws_seq_id: "",
      frame_seq_id:this.frame.apps_page_frame_seqid
    }

    this.getData();
    this.scatteChart = this.frame.design_control_type;
    if(this.scatteChart){
      this.scatteChartFlag = true;
    }else{
      this.scatteChartFlag = false;
      this.scatteChartValue = this.scatteChart;
    }
    //console.log("hello");
  }
 


  getData() {
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.object_code = this.frame.object_code;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;
    wscp.apps_item_seqid = this.wscp_send_input.apps_item_seqid;
   
    if (this.sessionObj) {
      for (var key in this.sessionObj) {
        wscp[key] = this.sessionObj[key];
      }
    }
    
  
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl
    }
    
  
    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        let tableRows = [];
        let objData = this.globalObjects.setPageInfo(data.responseData);
  
        // For Getting *CALLING_OBJECT_CODE* from Frame //
        this.callingObjectArr = this.globalObjects.getCallingObjectCodeArr(objData.Level1);
        // For Getting *CALLING_OBJECT_CODE* from Frame //
  
        let tableData = objData.Level1;
        this.tableData = tableData;
        let itemData: any;
  
        let tableKey = [];
          if (tableData.length > 0) {
            tableKey = Object.keys(tableData[0]);
          }
          let promptName = [];
          let i = 0;
          for (let table of tableData) {
            
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
            this.chart_div=frameLevel4[0].apps_page_frame_seqid;
            let colRow = [];
            let barRows = [];
            for (let itemGroup of frameLevel4) {
              i++;
              for (let item of itemGroup.Level5) {
                for (let key of tableKey) {
                  if ((item.item_name) && (item.item_name.toUpperCase() == key.toUpperCase())) {
                    item.value = table[key]
                    if(isNaN(item.value)){
                      barRows.push(item.value);
                    }else{
                    barRows.push(parseInt(item.value));
                    }
                    colRow.push(item.prompt_name);
                  }
                }
              }
            }
          //  barRows[0].color = "gold";
            promptName.push(colRow);
            tableRows[0] = promptName[0];
            tableRows.push(barRows);
          }
            
          this.grapharray = tableRows;
  
          //console.log(this.frame)
          if(this.grapharray.length>0){
            this.drawChart();

          }
         
        }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
      //console.log(err);
    })
  }
  drawChart() {
//console.log(this.grapharray)
    var data = google.visualization.arrayToDataTable(this.grapharray);

    var options = {
      
      // hAxis: {t},
      // vAxis: {title: 'Weight', minValue: 0, maxValue: 15},
      // legend: 'none'
    };
      setTimeout(() => {
        let element=document.getElementById(this.chart_div);
        var chart = new google.visualization.ScatterChart(element);
        chart.draw(data, options);
      } ,3000);
    

    


}

async populateDataFromJson() {


  if(this.globalObjects.allFrameJsonData.length > 0){
    for (let g of this.globalObjects.allFrameJsonData) {
      if ((g.frame_name == this.frame.apps_page_frame_seqid || (this.frame.frame_alias ? (g.frame_name ? g.frame_name.toLowerCase() : g.frame_name) == this.frame.frame_alias.toLowerCase() : false))) {
        for (let p of g.paraData) {

          

          if(p.paraType == 'IV'){
            for(let i of p.frameData){
              let str = "";
              let val = [];
              // let rowIndex = i.key ? i.key-1 : 0;
                // let rowIndex = i.key ? i.key : 0;
                // let rowIndex = i.key ? parseInt(i.key)-1 : 0;
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
                  // let index = im.row_slno ? parseInt(im.row_slno) - 1 : 0;
                  let index = i.key;
                  this.lhs_lib.set_item_config(name,im.para_name,im.para_value,index);
                }
               // this.lhs_lib.set_rows_source_config(g.frame_name, i.items, 0);
            }
          }


        }
      }
    }
  }

//   if(this.frame.apps_page_frame_seqid.indexOf("PARA") > -1){
//     this.events.publish("setVal");
//  }
  // let tableData = [];
  // for (let g of this.globalObjects.allFrameJsonData) {
  //   if (g.paraType == 'IV') {
  //     for (let p of g.paraData) {
  //       if ((this.frame.apps_page_frame_seqid == p.frame_name) || (this.frame.frame_alias == p.frame_name)) {
  //         tableData = p.frameData;
  //         this.jsonTableData = p.frameData;
  //       }
  //     }
  //   }
  // }
  // if(tableData.length > 0){

  //   for (let t of tableData) {
  //     let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
  //     for (let itemGroup of frameLevel4) {
  //       for (let item of itemGroup.Level5) {

  //         for (let i of t.items) {
  //           if (item.item_name.toUpperCase() == i.item_name.toUpperCase()) {
  //             item.value = i.para_value
  //           }
  //         }
  //       }
  //     }
  //     this.tableRows.push(frameLevel4);
  //   }
  //   this.frame.tableRows = this.tableRows;
  //   //console.log(tableData);
  // }

  //this.events.publish("setVal");

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
}