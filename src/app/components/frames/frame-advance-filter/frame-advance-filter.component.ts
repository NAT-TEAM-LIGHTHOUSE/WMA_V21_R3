import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';
import { ApexActionFilterPage } from 'src/app/pages/apex-action-filter/apex-action-filter.page';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ApexActionFilterPage],
  selector: 'app-frame-advance-filter',
  templateUrl: './frame-advance-filter.component.html',
  styleUrls: ['./frame-advance-filter.component.scss'],
})
export class FrameAdvanceFilterComponent implements OnInit {
  @Input() frame: any = {};
  @Output() passdataToframetable: EventEmitter<any> = new EventEmitter<any>();
  @Output() passdataToframeDepen: EventEmitter<any> = new EventEmitter<any>();
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  userDetails: any;
  advanceData: any = [];
  filterRows = [];
  filterRowIndex: any = 0;
  itemDataArr = [];
  globalArray = [];
  filterValue;
  ValuesSelect = [];
  selectedValues: any = [];
  selectedkey: any = [];
  mainData: [];

  tablerowsfilter: any;

  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService,
    public loadingController: LoadingController, public event: Events, private lhs_lib: LhsLibService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-advance-filter-frame")
    }
  }

  ngOnInit() {

     this.frame.level4Data = this.frame.level4Data ?? JSON.parse(JSON.stringify(this.frame.Level4));
    for (let x of this.frame.level4Data) {
      if (x.Level5[0].item_filter_flag) {
        x.Level5[0].item_type = x.Level5[0].item_filter_flag;
        this.advanceData.push(x);
      }
    }
    this.filterValue = this.advanceData[0].Level5[0].item_name;
    this.sendDataInputA(this.frame.tableData)
  }

  onClick(f, i) {
    this.filterRowIndex = i;
    this.filterValue = f;

    let itemfilterData = JSON.parse(JSON.stringify(this.filterRows))
    let mainData = [];
    for (let x of itemfilterData) {
      for (let y of x) {
        if (y.Level5[0].item_name == this.filterValue && y.Level5[0].value) {
          let dataObj = {
            key: y.Level5[0].item_name,
            value: y.Level5[0].value
          }
          mainData.push(dataObj);
        } 
      }
    }
    let finalList = [];
    mainData.forEach(m => {
      if (!finalList.find(f => m.value == f.value)) {
        finalList.push(m);
      }
      this.itemDataArr = finalList;
    })
    for(let items of this.frame.level4Data){
      for(let item of items.Level5){
            if(item.codeOfValues)
            {
             let data=item.codeOfValues.split(",")
             for(let i of this.itemDataArr){
              for(let d of data){
                if(d==i.value){
                  i.isChecked=true
                  this.ValuesSelect.push(i)
                }
              } 
             }
            }
        }
    }
  }

  onSelect(event, val, i) {

    let valSelect = this.ValuesSelect.find(x => x.value == val.value);
    if (!valSelect) {
      this.ValuesSelect.push(val)
    }
    let datakey = [];
    let datavalue = [];
    for (let x of this.ValuesSelect) {
      if (x.isChecked) {
        datakey.push(x.value);
        datavalue.push(x.value);
      }
    }
    let j = this.filterRowIndex;
    this.advanceData[j].Level5[0].value =datakey.toString()
    this.advanceData[j].Level5[0].codeOfValues = datavalue.toString();
  }


  sendFilteredData() {
    let query;
    let multilevelitemarray = [];
    for (let itemGroup of this.advanceData) {

      for (let item of itemGroup.Level5) {
        let obj:any = {};
        query = null;

        let value;
        if (item.codeOfValues) {
          value = item.codeOfValues
        } else if (item.value) {
          value = item.value
        }

        let colName: any = "";

        if (item.item_db_name) {
          colName = item.item_db_name
        } else {
          colName = item.item_name
        }

          if (value) {
            let valuearr = value.split(",");
            obj['key'] = colName;
            let values = "";
            for (let val of valuearr) {
              values = values ? values + " || " + "val.toLowerCase() == '" + val.toLowerCase() + "'" :"val.toLowerCase() == '" + val.toLowerCase() + "'";
            }
            obj['value'] = values;
          }
        if (Object.keys(obj).length > 0) {
          multilevelitemarray.push(obj);
        }
      }
    }
    let event:any = {};
    event.showFilter = true;
    event.where_Arr = multilevelitemarray;
    this.passdataToframeDepen.emit(event);
  }

  resetFilter() {
    let event:any = {};
    event.showFilter = false;
    event.where_Arr = [];
    for(let items of this.frame.level4Data){
      for(let item of items.Level5){
           delete item["codeOfValues"]
           item.value=""
      }
    }
    this.passdataToframeDepen.emit(event);
  }
  
  sendDataInputA(data) {
    let  tableData =data
    let tableDependentRows = [];
    let tableKey = [];
    if (tableData.length > 0) {
      tableKey = Object.keys(tableData[0]);
    }
    for (let table of tableData) {
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
      let frLevel4 = [];

      for (let f of frameLevel4) {
        if (f.Level5[0].item_filter_flag) {
          f.Level5[0].item_type = f.Level5[0].item_filter_flag;
          frLevel4.push(f);
        }
      }
      tableDependentRows.push(frLevel4);
     
    }
    this.filterRows = tableDependentRows;
    this.onClick(this.filterValue, this.filterRowIndex);
  }

}
