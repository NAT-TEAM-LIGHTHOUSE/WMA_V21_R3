import {  Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';


@Component({
standalone : true,
imports:[STANDALONE_IMPORTS],
  selector: 'app-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
})
export class ColumnFilterLayoutComponent implements OnInit {

 item: any;
  
  columns: string[] = [];
  columnFilters: { [column: string]: Set<string> } = {};
  activeFilters: { [column: string]: string[] } = {};
  
  selectedColumn: string | null = null;
  columnValues: string[] = [];
  filteredColumnValues: string[] = []; // For search functionality
  
  sortByAZChecked: string;
  ase = false;
  des = false;
  frame: any;
  indexval: any;
  freezeval: boolean = false;
  fremeSeq: any;
  frameSeprator: boolean = false;
  searchValue: any;
  tableHeaders = [];
  tableData = [];
  selectColor: string;
  columnValueData=[]
  colData=[]
  columnSelecetdData=[]
  isValueChange=false
  isApplyFilter=false
  allselectCheck=true
  selectedColShow=[]
  frame_header:any=""
  indexJ:any=""
  constructor(
    private navParams: NavParams, 
    public popoverCtrl: PopoverController, 
    private globalObjects: GlobalObjectsService,private lhs_lib:LhsLibService
  ) {
    this.item = this.navParams.get('item');
    this.sortByAZChecked = this.navParams.get('order');
    this.indexval = this.navParams.get('index');
    this.fremeSeq = this.navParams.get('fremeSeq');
    this.frameSeprator = this.navParams.get('frameSeprator');
    this.frame = this.navParams.get('frame');
    this.selectedColShow=this.navParams.get('selectedColShow');
    this.frame_header=this.navParams.get('frame_header');
    this.indexJ=this.navParams.get('indexJ');
    if (this.globalObjects.layoutFlag) {
      return applyLoggingDecorator(this, "layout-column-filter");
    }
  }

  ngOnInit() {
    // this.extractColumns();
    console.log('indexJ',this.indexJ) 
     this.columnValueData=[]
    console.log('frame_header',this.frame_header)
    if(this.frame_header.SelectedData){
      this.allselectCheck=this.item.allselectCheck
      if(this.selectedColShow.length>0){
        this.selectColNested()
      }
      this.columnValueData=this.frame_header.SelectedData;
    }else{
      this.columnValueGet();
    }
    this.isApplyFilter=true
    //  this.columnValueGet();
    this.colData=this.columnValueData
    if (this.sortByAZChecked == 'asorting') {
      this.ase = true;
    } else if (this.sortByAZChecked == 'dsorting') {
      this.des = true;
    }
    
    let getid = document.getElementById(`${this.fremeSeq}thead${this.indexval}`);
    if (getid) {
      if (getid.classList.contains("fixed-column")) {
        this.freezeval = true;
      } else {
        this.freezeval = false;
      }
    }

    this.searchValue = this.item.search ? this.item.search.replaceAll(/%/g, "") : "";
    if (this.item.bgColor) {
      this.selectColor = this.item.bgColor;
    }
    console.log(this.selectedColShow)
    
  }

  // selected if nexted filter apply
  selectColNested(){
    let filtercolDta=this.selectedColShow.find((item)=>item.item_name==this.item.item_name)
    if(filtercolDta && filtercolDta.level2){
      this.filtercolDtaCall(filtercolDta,2)
    }
  }
  //get value of nexted filter apply
  filtercolDtaCall(col,index){
    if(!col[`level${index+1}`]){
      let level=col[`level${index}`]
      if(level[`level${index+1}`]){
        this.filtercolDtaCall(level,index+1)
      }else{

    
      
     let val=[]
        for(let f of this.frame){
         
          for (let item of f[this.indexval-1].Level5) {
          val=[...val,item.value]
          
        }
      }
      let val1= [...new Set(val)];
       let result = col[`level${index}`].filter(item => val1.includes(item.value));
      //  if(result.length>0){
      //   this.allselectCheck=false;
      //   for(let col of result){
      //     col.checked=false
      //   }
      //  }
     

      this.frame_header.SelectedData=result
        }
       
    }else{
      this.filtercolDtaCall(col,index+1)
    }
  }

  // add level on multiple filter added
  showColCheck(){
   
    if(this.selectedColShow.length>0){

      let isItemData=this.selectedColShow.filter((item)=>item.item_name==this.item.item_name)
      if(isItemData.length==0){
        let obj={
          item_name:this.item.item_name,
            colIndex:this.indexval-1,
          itemColValue:this.colData
        }
        this.selectedColShow=[...this.selectedColShow,obj]

        let filtercolDta=this.selectedColShow.filter((item)=>item.item_name!=this.item.item_name)
        if(filtercolDta.length>0){
          let frame=this.lhs_lib.get_frame_config(this.fremeSeq)
          if(frame.searchableData){
          
          for(let colData of filtercolDta){
            let columnValueData=[]
            for(let f of frame.searchableData){
              for (let item of f[colData.colIndex].Level5) {
                if(!item.value){
                
                }
                let obj={
                      item_name:item.item_name,
                      value:item.value,
                      checked:true
                    }
                columnValueData.push(obj)
              }
            }
            let values=Array.from(new Map(columnValueData.map(item => [item.value, item])).values());
            // colData.level2=values;
            this.colValue(colData,values,2)
          }
          
        }

        }
  
   
      } else if(isItemData.length>0){

      }
      else{
        // let obj={
        //   item_name:this.item.item_name,
        //   itemColValue:this.colData
        // }
        // if(!isItemData[0].level2){
        //   isItemData[0].level2=obj
        // }else if(!isItemData[0].level2[0].level3){
        //   isItemData[0].level2[0].level3=obj;
        // }
        

      }
    }else{
      let obj={
          item_name:this.item.item_name,
          colIndex:this.indexval-1,
          itemColValue:this.colData
        }
       this.selectedColShow=[...this.selectedColShow,obj]
    }
    
  } 

  // nested filter call

// create level and add value inside level
  colValue(colData,values,i){
    let level=`level${i}`
    let colLevel=colData[level]
    if(!colLevel){
      colData[level]=values;
      return;
    }
    this.colValue(colLevel,values,i+1)
  }

  // Get col value 
   columnValueGet(){
    
    for(let f of this.frame){
      if(this.item.isSeprated){
        for(let item_sep of f){
          for (let item of item_sep.Level5) {
            if(item.apps_item_seqid==this.item.apps_item_seqid){
              {
                 let obj={
                  item_name:item.item_name,
                  value:item.value,
                  checked:true

                }
            this.columnValueData.push(obj)
              }
          }
        }
        }
      }else{

          for (let item of f[this.indexval-1].Level5) {
            if(!item.value){
             
            }
            
            let obj={
                  item_name:item.item_name,
                  value:item.value,
                  checked:true

                }
            this.columnValueData.push(obj)
//              if(!item.value){
             
//             }
//             let obj={}
//             if(item.item_type == "FRAME_SEPARATOR"){
//               for(let item_sep of f[this.indexJ-1].Level5){
//                   obj={
//                   item_name:item_sep.item_name,
//                   value:item_sep.value,
//                   checked:true
// }
//                  this.columnValueData.push(obj)
//               }
             
//             }{
//               obj={
//                   item_name:item.item_name,
//                   value:item.value,
//                   checked:true

//                 }
//                  this.columnValueData.push(obj)
//             }
            
          }
        }
        } 
      this.columnValueData= Array.from(new Map(this.columnValueData.map(item => [item.value, item])).values());
      // if(this.item.SelectedData){
      //   for(let col of this.columnValueData){
      //   for(let itemCol of this.item.SelectedData) {
      //     if(itemCol.value==col.value){
      //       col.checked=true
      //     }
      //   }
      //   }
      // }
      
    }
 
    // On filter search col value
  onSearchChange() {
    // if (!this.searchValue || this.searchValue.trim() === '') {
    //   this.filteredColumnValues = [...this.columnValues];
    // } else {
    //   const searchTerm = this.searchValue.toLowerCase().trim();
    //   this.filteredColumnValues = this.columnValues.filter(value => 
    //     value.toLowerCase().includes(searchTerm)
    //   );
    // }
    this.columnValueData=this.colData
    if(this.searchValue.includes(',') || this.searchValue.includes('\n')){
      let searchArr=this.searchValue.split(/[\r\n,]+/).map(v=>v.trim()).filter(v=>v)
      this.columnValueData=this.columnValueData.filter(v=>v.value && searchArr.some(s=>v.value.toLowerCase().includes(s.toLowerCase())))
    }else{
      this.columnValueData=this.columnValueData.filter(v=>v.value && v.value.toLowerCase().includes(this.searchValue.toLowerCase()))
    }
    console.log(this.columnValueData)
  }


  // Reset all filters
  resetFilters() {
    // Clear active filters
    for (const col in this.activeFilters) {
      this.activeFilters[col] = [];
    }
    
    // Clear search
    this.searchValue = '';
    this.filteredColumnValues = [...this.columnValues];
    
    // Notify parent to reset

    this.popoverCtrl.dismiss({colSelect:true,selectedColShow:this.selectedColShow}, "reset");
  }

  // Method for handling other search results (color, freeze, etc.)
  getSearchResult(type: string, delay: number, event?: any) {
    setTimeout(() => {
      switch (type) {
        case 'colorColumn':
          // Handle color selection
          // if (event && event.detail && event.detail.value) {
          //   this.selectColor = event.detail.value;
          //   const colorResult = {
          //     type: 'color',
          //     value: this.selectColor
          //   };
          //   this.popoverCtrl.dismiss(colorResult, 'colorApplied');
          // }
              let color = event.target.value
        this.popoverCtrl.dismiss(color, "bgColor");

          break;
          
        case 'freezColumn':
          // Handle freeze column toggle
          this.freezeval = !this.freezeval;
          const freezeResult = {
            type: 'freeze',
            value: this.freezeval
          };
          this.popoverCtrl.dismiss(event.target.ariaChecked, 'freezColumn');
          break;
          
        case 'refresh':
          // Handle refresh
          this.selectColor = '';
          // this.resetFilters();
           this.popoverCtrl.dismiss(event, "refresh")
          break;

         case 'reset':
        this.popoverCtrl.dismiss(event, "reset");
      break;

      }
    }, delay);
  }

  // on check box select
  colValueSelect(items,event){
    if(event.detail.checked){
      items.checked=true
    }else{
      items.checked=false
    }
    let checkstatus=this.columnValueData.filter(item=>!item.checked)
    if(checkstatus.length>0){
       this.allselectCheck=false
    }else{
       this.allselectCheck=true
    }
     let checkstatuss=this.columnValueData.filter(item=>item.checked)
    if(checkstatuss.length>0){
      //  this.allselectCheck=false;
      this.isApplyFilter=true
    }else{
      //  this.allselectCheck=true
        this.isApplyFilter=false
    }
    // this.isValueChange=true
  }

  //Apply filter 
  applyFilters(){
   let data= this.colData.filter((v)=>v.checked)
    this.frame_header.SelectedData=this.colData
    let selectCol=this.selectedColShow.find((item)=>item.item_name==this.item.item_name)
    if(this.allselectCheck && selectCol){
      // this.selectedColShow.pop()
      for(let cols of this.selectedColShow){
        this.removeLevelOfCol(cols,2)
      }
      this.resetFilters();
      return;
    }
    this.showColCheck();
    this.item.allselectCheck=this.allselectCheck;
    console.log('this.selectedColShow',this.selectedColShow)
    this.popoverCtrl.dismiss({SelectedData:data,selectedColShow:this.selectedColShow}, "filterApplied");
  }

  // remove level and data from array if all col value select on if filter added
  removeLevelOfCol(col,index){
    if(!col[`level${index+1}`]){
      let level=col[`level${index}`]
      if(level && level[`level${index+1}`]){
        this.removeLevelOfCol(level,index+1)
      }else{
        if(col[`level${index}`]){
         delete col[`level${index}`]
        }else{
          let cols=this.selectedColShow.filter((item)=>item.item_name!=this.item.item_name);
          this.selectedColShow=cols;
        }
      }  
    }else{
      this.removeLevelOfCol(col,index+1)
    }
  }
  selectAll(event){
    // if(!this.isValueChange){
      if(!event.target.checked){
          this.columnValueData.map((item,i)=>{
            item.checked=true
            // this.allselectCheck=true
          })
        }else{
        this.columnValueData.map((item,i)=>{
            item.checked=false
            // this.allselectCheck=false
          })
        }
    // }
    // this.isValueChange=false
  }
}