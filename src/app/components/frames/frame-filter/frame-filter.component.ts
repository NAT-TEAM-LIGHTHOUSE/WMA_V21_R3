import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';


@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-frame-filter',
  templateUrl: './frame-filter.component.html',
  styleUrls: ['./frame-filter.component.scss'],
})
export class FrameFilterComponent implements OnInit,OnDestroy {
  @Input() frameData: any;
  @Input() frame: any;
  @Input() sFilter: any = [];
  @Input() wscp: any = {};
  @Output() emitFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() emittoframeCanvasFilter: EventEmitter<any> = new EventEmitter<any>();
  selectdate: any;
  l_from_date: Date;
  l_to_date: Date;
  searchText: unknown;
  level4Data = [];

  constructor(public globalObjects: GlobalObjectsService, public event: Events) {
    this.selectdate = 1;
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-filter")
    }
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.frameData.level4Data = this.frameData.level4Data ?? JSON.parse(JSON.stringify(this.frameData.Level4));
    for (let itemGroup of this.frameData.level4Data) {
      for (let item of itemGroup.Level5) {
        item.item_type = item.item_filter_flag;
        if(item.item_filter_flag=='FDT'){
          item.canvasflag=true;
        }
      }
    }

  }

  filerDataWithoutAliases(flagtoclosefilter) {
    let wsdp = [];
    let key = {};
    let query;
    let multilevelitemarray = [];
    for (let itemGroup of this.frameData.level4Data) {
      for (let item of itemGroup.Level5) {
        let obj:any = {};

        let value;
        if (item.codeOfValues) {
          key[item.apps_item_seqid] = item.codeOfValues;
          value = item.codeOfValues
        } else if (item.value) {
          key[item.apps_item_seqid] = item.value;
          value = item.value
        }

        let colName: any = "";

        if (item.item_db_name) {
          colName = item.item_db_name
        } else {
          colName = item.item_name
        }

        //------------------------------------
        if (item.item_sub_type == 'M' && (value)) {
          let valuearr = value.split(",");
          obj['key'] = colName;
          let values = "";
          for (let val of valuearr) {
            values = values ? values + " || " + "val.toLowerCase() == '" + val.toLowerCase() + "'" :"val.toLowerCase() == '" + val.toLowerCase() + "'";
          }
          obj['value'] = values;
        } else if (!item.item_sub_type && (value) && item.aliases) {
          query = " and  " + item.aliases + "." + colName + " in (";

          query = query + "'" + value + "',";

          query = query.substring(0, query.length - 1);
          query = query + ")";
        } else {
            if(value){
              query = " and " + colName + "=" + "'" + value + "'";
            }
        }
        if (Object.keys(obj).length > 0) {
          multilevelitemarray.push(obj);
        }
        //------------------------------------
      }
    }
    wsdp.push(key);
    let event:any = {};
    event.showFilter = flagtoclosefilter;
    event.where_Arr = multilevelitemarray;
    this.emittoframeCanvasFilter.emit(event);
  }

  clearFilter(flagtoclosefilter) {
    let event:any = {};
    event.showFilter = flagtoclosefilter;
    event.where_Arr = [];
    this.frameData.level4Data = JSON.parse(JSON.stringify(this.frameData.Level4));
    this.emittoframeCanvasFilter.emit(event);
  }

  filerData() {
    let wsdp = [];
    let key = {};
    let query;
    let multilevelitemarray = [];
    for (let itemGroup of this.frameData.level4Data) {

      for (let item of itemGroup.Level5) {
        query = null;

        let value;
        if (item.codeOfValues) {
          key[item.apps_item_seqid] = item.codeOfValues;
          value = item.codeOfValues
        } else if (item.value) {
          key[item.apps_item_seqid] = item.value;
          value = item.value
        }

        let colName: any = "";

        if (item.item_db_name) {
          colName = item.item_db_name
        } else {
          colName = item.item_name
        }

        //------------------------------------
        if (item.item_sub_type == 'ASON_DATE' && (value)) {
          query = " and " + item.aliases + "." + colName + item.dateType + " to_date('" + value + "','dd-mon-rrrr')";
        } else if (item.item_sub_type == 'BETWEEN_DATE' && (item.from_date) && (item.to_date)) {
          query = " and " + item.aliases + "." + colName + " between " + "to_date('" + item.from_date + "','dd-mon-rrrr') and to_date('" + item.to_date + "','dd-mon-rrrr')";
        } else if (item.item_sub_type == 'M' && (value)) {
          let valuearr = value.split(",");
          query = " and " + item.aliases + "." + colName + " in (";
          for (let val of valuearr) {
            query = query + "'" + val + "',";
          }
          query = query.substring(0, query.length - 1);
          query = query + ")";
        } else {
          if (value) {
            query = " and " + item.aliases + "." + colName + "=" + "'" + value + "'";
          }
        }
        if (query) {
          multilevelitemarray.push(query);
        }
        //------------------------------------
      }
    }
    wsdp.push(key);

    let event:any = {};
    event.where_str = multilevelitemarray;
    event.wsdp = multilevelitemarray;
    this.emitFilter.emit(event);

  }

  openMike() {
    this.globalObjects.speechdata = '';
    this.globalObjects.startListening().then(res => {
      this.searchText = res;
    });
  }

  openbarcodescanner() {
    this.globalObjects.barcodescanner().then(res => {
      this.searchText = res;
    });
  }
}
