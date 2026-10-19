import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { an } from '@fullcalendar/core/internal-common';
import { ModalController } from '@ionic/angular/standalone';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
// import { ConsoleReporter } from 'jasmine';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-personalisation-filter',
  templateUrl: './personalisation-filter.component.html',
  styleUrls: ['./personalisation-filter.component.scss'],
})
export class PersonalisationFilterComponent implements OnInit {
  frame: any;
  object_mast_level3: any = [];
  object_mast_level2: any = [];
  frame_area_group: any = [];
  columnsData = [];
  columnsDataFrame = [];
  allFlagchecked: any;
  perColumnAll_flag = true;
  swithtabflag






  kpiArray: any = [];
  pers_all_flag = false;


  kpiItemArray = [];
  OtherItemArray = [];

  constructor(private globalObjects: GlobalObjectsService, private modalGlobal: CanvasModalService) {
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "personalisation-filter-page")
    }
  }
  grpKey: any;
  ngOnInit() {
    // console.log(this.object_mast_level3);
    // thisallFlagchecked=false;
    console.log(this.object_mast_level2);
    this.kpiItemArray = [];
    this.OtherItemArray = [];
    this.swithtabflag = true;




    // this.frame_area_group = this.object_mast_level3.reduce((acc, curr) => {
    //   if (curr.frame_area) {
    //     acc[curr.frame_area] = acc[curr.frame_area] || [];
    //     acc[curr.frame_area].push(curr);
    //   }
    //   return acc;
    // }, {});


    this.frame_area_group = Array.isArray(this.object_mast_level2)
      ? this.object_mast_level2.reduce((acc, obj) => {
        if (Array.isArray(obj.Level3)) {
          obj.Level3.forEach(curr => {
            if (curr.frame_area) {
              acc[curr.frame_area] = acc[curr.frame_area] || [];
              acc[curr.frame_area].push(curr);
            }
          });
        }
        return acc;
      }, {} as Record<string, any[]>)
      : {};

    console.log(this.frame_area_group);


    // this.frame_area_group = this.object_mast_level3.reduce((acc, curr) => {
    //   if (curr.frame_area) {
    //     acc[curr.frame_area] = acc[curr.frame_area] || [];
    //     acc[curr.frame_area].push(curr);
    //   }
    //   // console.log(curr.frame_area);
    //   return acc;
    // }, {});// console.log(this.frame_area_group); 
    // this.frame_area_group[0]
    // const firstValue:any = Object.values(this.frame_area_group)[0];
    // firstValue.active=true;
    // this.grpKey=Object.keys(this.frame_area_group)[0];
    // console.log(this.frame_area_group);
    // console.log("personaliztion  ",this.frame);
    this.setFrameKpis();


    // let othercount=1;
    for (let key of Object.keys((this.frame_area_group))) {
      if (key != "KPIs") {
        let othercount = 1;
        for (let framedata of this.frame_area_group[key]) {
          framedata.perSlno = "";
          framedata.grpKey = key;
          if (framedata.apps_frame_visible != "F") {
            framedata.checked = true;
            framedata.perSlno = othercount;
            othercount++
            this.OtherItemArray.push(framedata);
          }
        }
      }
    }

    const firstValue: any = Object.values(this.frame_area_group)[0];
    firstValue.active = true;
    this.grpKey = Object.keys(this.frame_area_group)[0];

    this.setFrameAreaGroupKey(this.grpKey)

  }


  objectKeys(obj: any) {
    return Object.keys(obj);
  }



  setFrameAreaGroupKey(key) {
    this.swithtabflag = true;
    let check_all_flag = true;

    console.log(key);
    this.grpKey = key;
    for (let obj of Object.keys(this.frame_area_group)) {
      if (obj == key) {
        this.frame_area_group[key].active = true;
      } else {
        this.frame_area_group[obj].active = false;
      }
    }

    console.log(this.allFlagchecked);
    if (key == "KPIs") {
      for (let data of this.kpiArray) {
        //  data.checked=true;
        if (data.checked) {

        } else {
          this.allFlagchecked = false;
          check_all_flag = false;
          // this.pers_all_flag=false;
          this.frame_area_group[key].checked = false;


        }
      }
    }
    else {
      for (let data of this.frame_area_group[key]) {
        // data.checked=true;
        if (data.checked) {

        } else {
          this.allFlagchecked = false;
          check_all_flag = false;
          // this.pers_all_flag=false;

          this.frame_area_group[key].checked = false;
        }
      }
    }

    if (check_all_flag) {
      this.allFlagchecked = true;
      // this.pers_all_flag=true;
      this.frame_area_group[key].checked = true;
    }

  }




  setFrameKpis() {
    let count = 1;
    console.log("level 3 : ", this.object_mast_level3);
    let kpisItemArray = [];
    for (let frameData of this.object_mast_level2) {
      for (let framearr of frameData.Level3) {
        if (framearr.frame_area == 'KPIs') {
          console.log("framearr ", framearr.frame_group);
          for (let framedata of framearr.Level4) {
            for (let itemdata of framedata.Level5) {
              if (!itemdata.item_name.includes('WMA')) {
                itemdata.perSlno = "";
                if (itemdata.item_visible_flag != "F") {
                  itemdata.checked = true;
                  itemdata.perSlno = count
                  count++;
                  this.kpiItemArray.push(itemdata);
                }
                kpisItemArray.push(itemdata);

              }
            }
          }
        }
      }
    }
    // for(let )




    this.kpiArray = kpisItemArray;
    console.log("kpi array : ", this.kpiArray);
  }
  tableHeads: any = [];

  selectedColumnString: any;



  personalizationColumn(event, d) {
    if (this.swithtabflag) {
      return
    }
    if (event.detail.checked) {
      d.checked = true;
      this.kpiItemArray.push(d);
    } else {
      d.checked = false;
      if (this.kpiItemArray) {
        for (let i = 0; i < this.kpiItemArray.length; i++) {
          if (d.item_name == this.kpiItemArray[i].item_name) {
            this.kpiItemArray.splice(i, 1);
          }
        }
      }
      this.frame_area_group[this.grpKey].checked = false;

    }
    // console.log("column data : ",this.kpiItemArray);
    let count = 1;
    for (let kpi of this.kpiItemArray) {
      kpi.perSlno = "";
      if (kpi.checked) {
        kpi.perSlno = count
        count++;
      }
    }
    this.kpiItemArray = JSON.parse(JSON.stringify(this.kpiItemArray));
    for (let kpiitm of this.kpiArray) {
      kpiitm.perSlno = "";
      for (let itm of this.kpiItemArray) {
        if (kpiitm.item_name == itm.item_name) {
          kpiitm.perSlno = itm.perSlno;
          console.log(kpiitm.perSlno)
        }
      }
    }




  }
  tabStatus() {
    this.swithtabflag = false;
  }
  personalizationColumnFrame(event, d, grpKey) {
    console.log(d)
    if (this.swithtabflag) {
      return
    }


    if (event.detail.checked) {
      d.checked = true;
      this.OtherItemArray.push(d);

    } else {
      d.checked = false;
      this.allFlagchecked = false;
      if (this.OtherItemArray) {
        for (let i = 0; i < this.OtherItemArray.length; i++) {
          if (d.apps_page_frame_seqid == this.OtherItemArray[i].apps_page_frame_seqid) {
            this.OtherItemArray.splice(i, 1);
          }
        }
      }
      this.frame_area_group[this.grpKey].checked = false;

    }
    console.log("column data frame: ", this.OtherItemArray);





    let count = 1;
    for (let otheritem of this.OtherItemArray) {
      if (otheritem.grpKey == grpKey) {
        otheritem.perSlno = ""
        if (otheritem.checked) {
          otheritem.perSlno = count
          count++;
        }
      }


    }

    console.log("total other item : ", this.OtherItemArray);
    this.OtherItemArray = JSON.parse(JSON.stringify(this.OtherItemArray));

    for (let key of Object.keys((this.frame_area_group))) {
      if (key != "KPIs") {
        for (let framedata of this.frame_area_group[key]) {
          framedata.perSlno = "";
          for (let itm of this.OtherItemArray) {
            if (framedata.apps_page_frame_seqid == itm.apps_page_frame_seqid) {
              framedata.perSlno = itm.perSlno;
            }

          }
        }
      }
    }
  }

  saveForFutureDataColumn() {
    this.swithtabflag = true;
    this.columnsData = [];
    this.columnsDataFrame = [];

    // for(let kpidata of this.kpiArray){
    //   if(kpidata.checked){
    //     this.columnsData.push(kpidata);
    //   }
    // }

    // for(let key of  Object.keys((this.frame_area_group))){
    // if(key!="KPIs"){
    //   for(let framedata of this.frame_area_group[key]){
    //     if(framedata.checked){
    //       this.columnsDataFrame.push(framedata);
    //     }
    //   }
    // }
    // }

    for (let kpidata of this.kpiArray) {
      if (!kpidata.checked) {
        this.columnsData.push(kpidata);
      }
    }

    for (let key of Object.keys((this.frame_area_group))) {
      if (key != "KPIs") {
        for (let framedata of this.frame_area_group[key]) {
          if (!framedata.checked) {
            this.columnsDataFrame.push(framedata);
          }
        }
      }
    }


    // console.log(this.columnsData);
    let selectedColumnStringKpi: any = "";
    let selectedcolumnStringFrame: any = "";

    let reqData: any;

    for (let a of this.columnsData) {
      if (selectedColumnStringKpi.length < 1) {
        // selectedColumnStringKpi=a.apps_page_frame_seqid+"^"+a.item_name+"^"+a.perSlno;
        selectedColumnStringKpi = a.apps_page_frame_seqid + "^" + a.item_name;

      } else {
        // selectedColumnStringKpi=selectedColumnStringKpi+"#"+a.apps_page_frame_seqid+"^"+a.item_name+"^"+a.perSlno;
        selectedColumnStringKpi = selectedColumnStringKpi + "#" + a.apps_page_frame_seqid + "^" + a.item_name;

      }
    }
    selectedColumnStringKpi = "#" + selectedColumnStringKpi + "#";

    for (let a of this.columnsDataFrame) {
      if (selectedcolumnStringFrame.length < 1) {
        // selectedcolumnStringFrame=a.apps_page_frame_seqid+"^"+a.perSlno;
        selectedcolumnStringFrame = a.apps_page_frame_seqid;

      } else {
        // selectedcolumnStringFrame=selectedcolumnStringFrame+"#"+a.apps_page_frame_seqid+"^"+a.perSlno;
        selectedcolumnStringFrame = selectedcolumnStringFrame + "#" + a.apps_page_frame_seqid;

      }
    }
    selectedcolumnStringFrame = "#" + selectedcolumnStringFrame + "#";
    reqData = {
      wslp: this.globalObjects.getLocallData('userDetails'),
      wscp: {
        apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
        service_type: "set_frame_kpi_personalization",
        ref_cursor_mode: this.globalObjects.refCursorMode,
        platform: this.globalObjects.getLocallData('platformValue'),
        kpi_column_str: selectedColumnStringKpi,
        frame_column_str: selectedcolumnStringFrame
      },
      wsdp: [],
      wsdpcl: []
    }
    console.log(reqData)
    let data = {
      reqData: reqData
    }
    this.swithtabflag = true;
    this.columnsData = [];
    this.columnsDataFrame = [];
    this.modalGlobal.popDismiss(data, "perssonalize_close");




  }
  // personalizationcolAll(event:any,grpKey){
  //   // console.log("All",grpKey);
  //   if (event.detail.checked) {
  //     if(grpKey=="KPIs"){
  //       this.columnsData=[];
  //       console.log(this.kpiArray.length);
  //       for(let data of this.kpiArray){
  //        this.columnsData.push(data);
  //        data.checked=true;
  //       }
  //     }
  //     else {
  //       // this.columnsDataFrame=[];
  //       // console.log(this.kpiArray.length);
  //       // for(let data of this.frame_area_group[grpKey]){
  //       //  this.columnsDataFrame.push(data);
  //       //  data.checked=true;
  //       // }

  //      if(this.columnsDataFrame){
  //       // for(let data of this.frame_area_group[grpKey]){
  //       //   this.columnsDataFrame = this.columnsDataFrame.filter(item => item.apps_page_frame_seqid !== data.apps_page_frame_seqid);
  //       // }
  //       // this.columnsDataFrame = this.columnsDataFrame.filter(item =>
  //       //   !this.frame_area_group[grpKey].some(data => data.apps_page_frame_seqid === item.apps_page_frame_seqid)
  //       // );
  //       console.log("columns data frame : "+this.columnsDataFrame);
  //       for(let data of  this.frame_area_group[grpKey]){
  //         this.columnsDataFrame.push(data);
  //         data.checked=true;
  //        }

  //      }
  //     }
  //     // else if(grpKey=='TABLE'){
  //     //   // this.columnsDataFrame=[];
  //     //   // console.log(this.kpiArray.length);
  //     //   for(let data of this.frame_area_group[grpKey]){
  //     //     this.columnsDataFrame.push(data);
  //     //     data.checked=true;
  //     //    }
  //     // }
  //   }else{
  //     if(grpKey=="KPIs"){
  //       this.columnsData=[];
  //       for(let data of this.kpiArray){
  //       //  this.columnsData.push(data);
  //        data.checked=false;
  //       }
  //     }
  //     else if(grpKey=="CHART"){
  //       // this.columnsDataFrame=[];
  //       // this.columnsDataFrame=[];
  //       for(let data of this.frame_area_group[grpKey]){
  //         this.columnsDataFrame = this.columnsDataFrame.filter(item => item.apps_page_frame_seqid !== data.apps_page_frame_seqid);
  //       }
  //       for(let data of this.frame_area_group[grpKey]){
  //         data.checked=false;
  //        }
  //     }
  //     // else if(grpKey=='TABLE'){
  //     //   // this.columnsDataFrame=[];
  //     //   for(let data of this.frame_area_group[grpKey]){
  //     //     this.columnsDataFrame = this.columnsDataFrame.filter(item => item.apps_page_frame_seqid !== data.apps_page_frame_seqid);
  //     //   }
  //     //   for(let data of this.frame_area_group[grpKey]){
  //     //     data.checked=false;
  //     //    }
  //     // }
  //   }
  //   console.log("all kpi ",this.columnsDataFrame);
  // }

  // pers_all_flag=true;
  personalizationcolAll(event: any, grpKey) {
    // console.log("All",grpKey);
    // this.pers_all_flag=!this.pers_all_flag;
    // console.log("event.detail.checked"+this.pers_all_flag)
    this.swithtabflag = true;
    console.log("checked status : ", this.frame_area_group[grpKey].checked)
    if (!this.frame_area_group[grpKey].checked) {
      // if (this.pers_all_flag) {
      let count = 1;
      if (grpKey == "KPIs") {
        this.kpiItemArray = []
        for (let data of this.kpiArray) {
          data.checked = true;
          data.perSlno = count;
          this.kpiItemArray.push(data);
          count++
        }
      }
      else {
        this.OtherItemArray = this.OtherItemArray.filter(a => a.grpKey !== grpKey);
        for (let data of this.frame_area_group[grpKey]) {
          data.checked = true;
          data.perSlno = count;
          this.OtherItemArray.push(data);
          count++
        }
      }

    } else {
      if (grpKey == "KPIs") {
        for (let data of this.kpiArray) {
          data.checked = false;
          data.perSlno = "";
        }
        this.kpiItemArray = [];
      }
      else {
        for (let data of this.frame_area_group[grpKey]) {
          data.checked = false;
          data.perSlno = "";
        }
        this.OtherItemArray = this.OtherItemArray.filter(a => a.grpKey !== grpKey);
        console.log("item array : ", this.OtherItemArray);
      }
    }

    // console.log("all kpi ",this.columnsDataFrame);
  }






  resetDataColumn() {
    let reqData = {
      wslp: this.globalObjects.getLocallData('userDetails'),
      wscp: {
        apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
        service_type: "reset_frame_kpi_personalization",
        ref_cursor_mode: this.globalObjects.refCursorMode,
        platform: this.globalObjects.getLocallData('platformValue'),
      },
      wsdp: [],
      wsdpcl: []
    }
    console.log(reqData)
    let data = {
      reqData: reqData
    }
    // this.apply(this.shuffle,reqData);

    this.modalGlobal.popDismiss(data, "personalize_close");
  }
  cancelPersonalize() {
    this.modalGlobal.popDismiss()
  }

}
