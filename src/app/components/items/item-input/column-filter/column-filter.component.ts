import { Component, OnInit, Input} from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
})
export class ColumnFilterComponent implements OnInit {
 
  onColumnClick($event,object,i){}

  @Input() colFilter: any;
  @Input() parentComponent: any;
  @Input() itemData: any;
  @Input() item: any;
  wscp: any = {};
  map = new Map();
  ValuesSelect: any = [];
  Vlength: number;
  range: number = 0;
  indextoAdd: number = -1;
  keyValues: any = [];
  itemDataArr: any = [];
  current_page_parameter: any = {};
  constructor(private globalObjects: GlobalObjectsService, public modalCtrl: ModalController,
    public events: Events) {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"column-filter")
    }
  }

  ngOnDestroy() {}

  ngOnInit() {

    this.colFilter.item_sub_type = 'M';
    if (this.itemData) {
      this.getDepData();
    } else {
    }
    console.log(this.colFilter)
  }
  clearall( ) {

    for (let x of this.ValuesSelect) {
    
      if (x.isChecked) {
        x.isChecked = false;
      }
    }
    this.colFilter.value = "";
    this.colFilter.codeOfValues = "";
    this.ValuesSelect = [];
  }

  increaseRange() {
    this.range = 10 + this.range;
    if (this.range > this.Vlength) {
      this.range = this.Vlength
    }
  }

  getDepData() {
    let itemfilterData = JSON.parse(JSON.stringify(this.itemData))
    let mainData = [];
    for (let x of itemfilterData) {
      for (let y of x) {
        if (y.Level5[0].item_name == this.colFilter.item_name && y.Level5[0].value) {
          let dataObj = {
            key: y.Level5[0].item_name,
            value: y.Level5[0].value
          }

          if (!mainData.find(f => dataObj.value == f.value)) {
            mainData.push(dataObj);
          }
        }
      }
    }

    this.itemDataArr = mainData;

    let globArr = this.colFilter.value ? this.colFilter.value.split(",") : [];

    for (let g of globArr) {
      let globKey = this.itemDataArr.find(c => g == c.value);
      if (globKey) {
        globKey.isChecked = true;
        this.ValuesSelect.push(globKey);
      }
    }

    this.Vlength = this.itemDataArr.length;
    this.increaseRange();
    console.log( this.colFilter)
  }

  onSelect(event, val, i) {
    let valSelect = this.ValuesSelect.find(x => x.value == val.value);
    if (!valSelect) {
      val.isChecked = !val.isChecked
      val.index = i;
      this.ValuesSelect.push(val);
    } else {
      valSelect.isChecked = !valSelect.isChecked;
    }

    let datakey = [];
    let datavalue = [];
    for (let x of this.ValuesSelect) {
      if (x.isChecked) {
        datakey.push(x.value);
        datavalue.push(x.value);
      }
    }

    this.colFilter.value = datakey.toString();
    this.colFilter.codeOfValues = datavalue.toString();

  }

}
