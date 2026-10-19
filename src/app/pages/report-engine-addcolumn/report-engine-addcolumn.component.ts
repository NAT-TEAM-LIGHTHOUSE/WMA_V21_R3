import { Component, OnInit } from '@angular/core';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-report-engine-addcolumn',
  templateUrl: './report-engine-addcolumn.component.html',
  styleUrls: ['./report-engine-addcolumn.component.scss'],
})
export class ReportEngineAddcolumnComponent implements OnInit {
  allColumnFrame :any;
  dispColFrame:any;
  allColLevel4:any;
  grpByArr:any;
  grpByFlag:boolean = false;
  datatype: any = 'VARCHAR';
  

  // activeDatatype: any = 'ALL';
  constructor(public lhslib : LhsLibService,public modalServ:CanvasModalService) { }

  ngOnInit() {
    // console.log("all col frame : ", this.frame);
    // this.allColLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));
    // let disp_frame = 
    // this.dispColFrame = this.lhs_lib.get_frame_config('DISP_COL');
    // this.advFilterFrame = this.lhs_lib.get_frame_config('ADV_FILTER');
    // if (this.allColumnFrame.tableRows) {
    //   for (let advData of this.allColumnFrame.tableRows) {
    //     for (let itemData of advData) {
    //       for (let disitem of itemData.Level5) {
    //         // if (disitem.item_name == "CB_SELECT" && disitem.value == true) {
    //         for (let itemdatas of advData) {
    //           for (let disitem_data of itemdatas.Level5) {
    //             if (disitem_data.item_name == "ITEM_NAME") {
    //               for (let frame_all_data of this.allColLevel4) {
    //                 for (let itm_all of frame_all_data.Level5) {

    //                   if (disitem_data.value == itm_all.item_name) {
    //                     itm_all.checked = true;
    //                   }

    //                 }
    //               }
    //             }
    //           }
    //         }
    //         continue;
    //         // }
    //       }
    //     }
    //   }

    // } 










    this.allColumnFrame = this.lhslib.get_frame_config('All_COL');
    this.dispColFrame = this.lhslib.get_frame_config('DISP_COL');
    console.log(this.allColumnFrame);
    this.allColLevel4 = JSON.parse(JSON.stringify(this.allColumnFrame.Level4));




    let grpArr: any = [];
    for (let itmGroup of this.allColLevel4) {
      for (let itm of itmGroup.Level5) {
        if (itm.group_no_str) {
          itm.item_enable_flag=false;
          grpArr.push(itm);
        }
      }
    }

    this.grpByArr = Object.values(grpArr.reduce((acc, curr) => {
      // const groupName = curr.group_no_str;
      // let groupName = curr.datatype;
      let groupName:any;
      if(curr.datatype.toUpperCase().includes("VARCHAR")){
        groupName="VARCHAR";
      }else if(curr.datatype.toUpperCase().includes("VARCHAR")){
        groupName="Date"
      }else{
        groupName=curr.datatype;
      }




      if (!acc[groupName]) {
        acc[groupName] = {
          groupname: groupName,
          groupnameARR: []
        };
      }
      acc[groupName].groupnameARR.push(curr);
      return acc;
    }, {}));



    console.log(this.grpByArr);

  }



  showItems(type){
    
      this.datatype = type;
      // this.grpByFlag = false;
 
  }
  addItem(){
    // this.dispColFrame.tableRows=[];
    if(this.dispColFrame.tableRows){
      
    }else{
      this.dispColFrame.tableRows=[];
    }

    let frameData: any = JSON.parse(JSON.stringify(this.dispColFrame.Level4));

    for(let grpData of this.grpByArr){
      for(let item of grpData.groupnameARR){
         if(item.new_item_name && item.new_filter_clause){
          this.setItemModelData(item,frameData);
          
         }
      }
    }

    this.modalServ.popDismiss();
  }


  // onItemSelect(item: any) {
  //   let ind = this.removeItemModelData(item);
  //   if (item.checked && ind == undefined) {
  //     // item.cb_select = "T";
  //     item.cb_select = "Y";
  //     item.item_visible_flag = 'T';
  //     this.setItemModelData(item);
  //   } else if (!item.checked) {
  //     this.dispColFrame.tableRows.splice(ind, 1);
  //   }
  // }

  setItemModelData(item,frameData) {
    // console.log("set item on change addcolumn" + item.prompt_name);
    let itemDatatype: any;
    let itemArr:any=[];
    // if(item.new_prompt_name && item.new_filter_clause){
      // let frameData: any = JSON.parse(JSON.stringify(this.dispColFrame.Level4));
      for (let advData of frameData) {
        for (let disitem of advData.Level5) {
          for (let itm of Object.keys(item)) {
            if (itm == (disitem.item_name.toLowerCase())) {
              // console.log(" item condition " + itm + " " + advitem.item_name+" datatype "+item.datatype);
              disitem.value = item[itm] ? item[itm] : "";
              if(item.datatype){
                if (item.datatype.includes("VARCHAR")) {
                  disitem.newdatatype = "VARCHAR";
                  // console.log("datatype : "+disitem.newdatatype);
                } else {
                  disitem.newdatatype = item.datatype;
                  // console.log("datatype : "+disitem.newdatatype);
                }
              }
          }
  
          if (disitem.item_name == 'ITEM_NAME') {
             disitem.value=item.new_item_name;
          }
          if (disitem.item_name == 'FILTER_CLAUSE') {
            disitem.value=item.new_filter_clause;
         }
          if (disitem.item_name == 'CB_SELECT') {
            disitem.isChecked = true;
            disitem.value = 'Y';
          }
          if(disitem.item_name=='CB_SELECT'){
            disitem.value='Y';
            console.log(disitem);
          }
        }
      }
    }
    this.dispColFrame.tableRows.push(frameData);

console.log(this.dispColFrame);

}
clearItem(){

}
}
