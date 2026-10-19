// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { AngularMyDatePickerDirective } from 'angular-mydatepicker';
import { ApexSearchPipe } from 'src/app/pipes/apex-search.pipe';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { DataService } from 'src/app/services/data.service';
// import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
standalone: true,
imports : [NgSelectModule,NgbDatepickerModule,STANDALONE_IMPORTS],
  selector: 'app-apex-action-filter',
  templateUrl: './apex-action-filter.page.html',
  styleUrls: ['./apex-action-filter.page.scss'],
})
export class ApexActionFilterPage implements OnInit {

  @ViewChild('ngSelect') ngSelect: NgSelectComponent;
  @ViewChild('dp') myDp: AngularMyDatePickerDirective;
  @Output() viewByColumn: any = new EventEmitter<any>();
  @Output() columnFilter: any = new EventEmitter<any>();
  @Output() groupBy: any = new EventEmitter<any>();
  @Output() controlBr: any = new EventEmitter<any>();
  @Output() aggregate: any = new EventEmitter<any>();
  @Output() clearAll: any = new EventEmitter<any>();
  @Input() frame: any;
  databack: any = [];
  @Input() shuffle;
  // selectedColumnString:any;
  columnName: any;
  framefromapexCompo: any;
  thead: any = [];
  description: any;
  frames: any = {};

  operatorName: any;
  tRows: any;
  expressionQuery: any = [];
  operators: any = ['=', '>', '<', '>=', '<=', '<>', 'is null', 'is not null', 'like', 'not like', 'in', 'not in', 'begin with', 'end with'];
  apexThead = [];
  apexAggriHead = [];
  noOfRecords;
  test: any;
  dbFunction: any = ["!=", ">=", "<=", ">", "<", "ABS", "ADD MONTH", "BETWEEN", "CASE", "CEIL", "CURRENT_DATE", "CURRENT_TIMESTAMP",
    "DECODE", "ELSE", "END", "EXP", "GREATEST", "IN", "INITCAP", "INSTR", "IS", "LAST_DAY", "LIST", "LENGTH", "LIKE", "LOG", "LPAD",
  ];

  functions = [
    { name: 'Sum', value: 'S' },
    { name: 'Average', value: 'A' },
    { name: 'Count', value: 'C' },
    { name: 'Minimum', value: 'M' },
    { name: 'Maximum', value: 'X' }
  ];

  // controlBreakArr: any = [{ coloumns: "", status: "Enabled" }]
  controlBreakArr: any = []
  aggregateFun: any = [{ fun: "S", coloumns: {} }]
  orderFormat: any = ['asc', 'desc'];
  formatRows: any = [{ coloumns: {}, ordFormat: "asc", nullPosition: "" }];
  nullValue: any = ['nulls first', 'nulls last'];
  rowsFilter: any = [{ coloumns: {}, operators: "like", description: "" }];

  formatActnflag: boolean = false;
  rowsInpage = ["1", "5", "10", "20", "25", "50", "100", "1000", "ALL"];
  rowPerPage;
  tableHeads: any = [];
  isCheck: boolean = false;
  selectedOptions: any;
  isWrapCheck:boolean=false;
  isCheckGroup = false

  isClear: boolean = false
  selectAllColumnChecked = false
  columnsData = []
  unselectCheckbox:boolean=false
  constructor(public dataService: DataService, private globalObjects: GlobalObjectsService, private modalGlobal: CanvasModalService) {
    // if(this.globalObjects.pagesFlag){
    //   return applyLoggingDecorator(this,"apex-action-filter")
    // }
  }
  addElement(exp, i) {
    this.expressionQuery = this.expressionQuery + " " + exp;
    this.controlBreakArr;
  }
  filterApexThead=[]
  head = []
  ngOnInit() {
    this.thead = this.frame.apextheads;
    this.apexThead = this.frame.apextheaders;
    this.apexAggriHead = this.frame.apexAggriHead;
    this.frames = this.frame.tableRows;
    this.rowPerPage = this.frame.no_of_records;
    console.log('this.frames', this.frame)
    if (this.frame.visibleItems && this.frame.visibleItems.length > 0) {
      this.apexThead = this.frame.visibleItems;
    }
    if (this.shuffle == 'Group By' || this.shuffle == 'Function') {
      if (this.frame.aggregateFun) {
        this.aggregateFun = this.frame.aggregateFun

      } else if (this.frame.funcArr && this.frame.funcArr.length > 0) {
        this.aggregateFun = this.frame.funcArr
      } else {
        this.aggregateFun = [{ fun: "S", coloumns: {} }]
        this.onSelectFun("S", this.aggregateFun[0])
      }

    } else {
      this.aggregateFun = [];
    }
    let con;
    for (let r of this.rowsFilter) {
      if (con) {
        con = con + '&&' + r.coloumns + r.operators + r.description
      } else {
        con = r.coloumns + r.operators + r.description
      }
    }

    if (this.frame.ctrlBrkCond && this.frame.ctrlBrkCond.length > 0) {
      for (let c of this.frame.ctrlBrkCond) {
        for (let a of this.apexThead) {
          if (c.coloumns.item_name == a.item_name) {
            c.coloumns = a
            a.checked = true
          }
        }
      }
      this.controlBreakArr = this.frame.ctrlBrkCond;
      this.frame.ctrlBrkCond;
    }
    this.tableHeads=[]
    if (this.frame.selectedCols && this.frame.selectedCols.length > 0) {
      for (let col of this.frame.selectedCols) {
        this.tableHeads.push(col.id);
      }
    }

    if (this.frame.filterAbleArr && this.frame.filterAbleArr.length > 0) {
      for (let f of this.frame.filterAbleArr) {
        for (let a of this.apexThead) {
          if (f.coloumns.item_name == a.item_name) {
            f.coloumns = a
          }
        }
      }
      this.rowsFilter = this.frame.filterAbleArr;
    }

    if (this.frame.isCheck) {
      this.isCheck = true
    }

    if(this.shuffle == 'Column'){
      let columnDataRow=[]
      let seq=0
      if(!this.frame.columnsData){
        let id=0
        for(let i=0;i<this.frame.apextheads.length;i++){
             if(this.frame.apextheads[i].item_visible_flag=='T'){
            seq++;
            this.tableHeads.push(i)
          }
          columnDataRow.push({item_db_name:this.frame.apextheads[i].item_db_name,
            colName:this.frame.apextheads[i].prompt_name ? this.frame.apextheads[i].prompt_name :this.frame.apextheads[i].tool_tip,
            item_name:this.frame.apextheads[i].item_name,groupName:"",id:i,checked:this.frame.apextheads[i].item_visible_flag=='T' ? true :false,newSeqNo:this.frame.apextheads[i].item_visible_flag=='T' ? seq :''})
        }
        this.columnsData=columnDataRow
        if(seq==this.columnsData.length){
          this.selectAllColumnChecked=true
        }
      }else{
        this.columnsData=this.frame.columnsData
       if(this.columnsData[0].groupName=="Select All") {
        this.selectAllColumnChecked=true
       }else{
        this.selectAllColumnChecked=false
       }
       
      }
    }
    console.log("tableHeads : ", this.frame.apextheads)

    console.log("frame.columnsData : ", this.frame.columnsData)
    this.filterApexThead=this.apexThead
  }
  addFieldValue(ev) {
    if (ev == 'aggreFun') {
      let add = true;
      for (let r of this.aggregateFun) {
        if (!r.coloumns.item_name || !r.fun) {
          add = false;
        }
      }
      if (add) {
        let row = { fun: "S", coloumns: {} };
        this.aggregateFun.push(row);
        this.onSelectFun("S", row)
      } else {
        this.globalObjects.presentAlert("Please fill all fields to add new row.")
      }

    } else if (ev == 'formRows') {
      let row = { coloumns: {}, ordFormat: "asc", nullPosition: "" }
      this.formatRows.push(row)

    } else if (ev == 'rowsFil') {
      let add = true;
      for (let r of this.rowsFilter) {
        if(r.operators=="is null" || r.operators=="is not null"){
        }else if(!r.coloumns || !r.coloumns.item_name || !r.description) {
          add = false;
        }
      }
      if (add) {
        let row = { coloumns: {}, operators: "like", description: "" }
        this.rowsFilter.push(row)
      } else {
        this.globalObjects.presentAlert("Please fill all fields to add new row.")
      }

    } else if (ev == 'controlBr') {
      let add = true;
      for (let r of this.controlBreakArr) {
        if (!r.coloumns.item_name) {
          add = false;
        }
      }
      if (add) {
        let row = { coloumns: "", status: "Enabled" }
        this.controlBreakArr.push(row)
      } else {
        this.globalObjects.presentAlert("Please select column first.")
      }
    }
  }

  rmFieldValue(i, ev) {
    if (ev == 'aggreFun') {
      this.aggregateFun.splice(i, 1);
    } else if (ev == 'formRows') {
      this.formatRows.splice(i, 1);
    } else if (ev == 'rowsFil') {
      this.rowsFilter.splice(i, 1);
    } else if (ev == 'controlBr') {
      this.controlBreakArr.splice(i, 1);
    }
  }


  createRow() {
    for (let r of this.rowsFilter) {
      if(r.operators=="is null" || r.operators=="is not null"){
      }else if (!r.coloumns || !r.coloumns.item_name || !r.description || !r.operators) {
        this.globalObjects.presentAlert("Please select column name, operators and description to apply filter.")
        return
      }
    }
    let obj = {
      rowFilter: this.rowsFilter
    }
    this.columnFilter.emit(obj)
  }

  createFunction() {
    for (let fun of this.aggregateFun) {
      if (Object.keys(fun.coloumns).length == 0) {
        this.globalObjects.presentAlert("Please fill all fields.")
        return
      }
    }
    let functionAggrigate = {
      aggregate: this.aggregateFun,
      clear: false
    }
    this.aggregate.emit(functionAggrigate)
  }

  createGroupBy() {
    if (this.controlBreakArr.length == 0) {
      this.globalObjects.presentAlert("Please select column name to apply group by.")
      return
    }
    if (this.aggregateFun.length > 1) {
      for (let fun of this.aggregateFun) {
        if (Object.keys(fun.coloumns).length == 0) {
          this.globalObjects.presentAlert("Please fill all fields.")
          return
        }
      }
    }

    let obj = {
      funArr: this.aggregateFun,
      controlBr: this.controlBreakArr
    }
    if (!this.isCheck) {
      this.groupBy.emit(obj)
    } else {
      this.controlBr.emit(obj)
    }
  }

  viewByColumns(reqData) {
    this.frame.columnsData = this.columnsData

    if (this.tableHeads && this.tableHeads.length > 0) {
      this.tableHeads = [...new Set(this.tableHeads)]
      let object = [];
      for (let id of this.tableHeads) {
        for (let i of this.frame.columnsData) {
          if (id == i.id) {
            // delete i['checked']
            object.push(i);
          }
        }
      }
      this.frame.selectedCols = object;
      let obj = {
        columnsData: this.frame.selectedCols,
        clearFilter: false,
        columnsAllData:this.columnsData,
        reqData:reqData
      }

      this.viewByColumn.emit(obj)
    } else {
      this.globalObjects.presentAlert("Please select column name to apply column filter.")
    }

  }


  cancel() {
    this.rowsFilter = [{ coloumns: {}, operators: "", description: "" }];
    this.formatRows = [{ coloumns: {}, ordFormat: "asc", nullPosition: "" }];
    this.aggregateFun = [{ fun: "S", coloumns: {} }];
    this.controlBreakArr = [{ coloumns: "", status: "Enabled" }]
    this.modalGlobal.popDismiss()
  }

  addDuplicateField(r) {
    let item = JSON.parse(JSON.stringify(r));
    if (item.coloumns.item_name) {
      for (let name of this.apexThead) {
        if (item.coloumns.item_name == name.item_name) {
          item.coloumns = name;
        }
      }
    }
    this.rowsFilter.push(item);

  }

  public myMethod(sh, fram): void {
    this.shuffle = sh
    this.frame = fram
    this.ngOnInit()
  }
  // onSelectFun(fun, r) {
  //   this.apexAggriHead = []
  //   if (r.coloumns != "") {
  //     r.coloumns = {}
  //   }
  //   for (let a of this.frame.apexAggriHead) {
  //     if (a.datatype != 'number') {
  //       if (fun == 'C') {
  //         this.apexAggriHead.push(a)
  //       }
  //     }
  //     else {
  //       this.apexAggriHead.push(a)
  //     }
  //   }
  //   r.columnData = this.apexAggriHead
  //   // this.cdr.detectChanges();
  // }

  onSelectFun(fun: any, r: any) {

  const newColumnData = this.frame.apexAggriHead.filter((a: any) => {
    return a.datatype === 'number' || fun === 'C';
  });

  r.columnData = [...newColumnData];

  if (!r.coloumns) {
    r.coloumns = {};
  }

  // r.coloumns.item_name = '';

  // Important: replace the row reference
  const index = this.aggregateFun.indexOf(r);

  if (index !== -1) {
    this.aggregateFun[index] = {
      ...r,
      columnData: [...newColumnData],
      coloumns: {
        ...r.coloumns
        
      }
    };

    this.aggregateFun = [...this.aggregateFun];
  }
}
  clearFilter(shuffle) {

    if (shuffle == "Function") {
      let functionAggrigate = {
        aggregate: this.aggregateFun,
        clear: true
      }
      this.aggregate.emit(functionAggrigate)
    } else if (shuffle == "Conditional Filter") {
      let obj = {
        rowFilter: [],
        clearFilter: true
      }
      this.columnFilter.emit(obj)
    } else if (shuffle == "Group By") {
      if (!this.isCheck) {
        this.groupBy.emit('clearFilter')
      } else {
        this.controlBr.emit('clearFilter')
      }

    } else if (shuffle == "Column") {
      let obj = {
        columnsData: [],
        clearFilter: true
      }
      this.viewByColumn.emit(obj)
    }
  }

  clearThis(shuffle) {
    this.isCheckGroup = true
    if (shuffle == "Function") {
      this.aggregateFun = [{ fun: "S", coloumns: {} }]
      this.onSelectFun("S", this.aggregateFun[0])


    } else if (shuffle == "Conditional Filter") {
      this.rowsFilter = [{ coloumns: {}, operators: "like", description: "" }];
    } else if (shuffle == "Group By") {

      this.controlBreakArr = []
      for(let d of this.apexThead){
        if(d.checked){
          delete d['checked']
        }
      }
      this.aggregateFun = [{ fun: "S", coloumns: {} }]
      this.onSelectFun("S", this.aggregateFun[0])
      this.isCheck = false
    } else if (shuffle == "Column") {
      this.tableHeads = []
    }
    this.clearFilter(shuffle)
  }

  clear_All() {
    this.aggregateFun = [{ fun: "S", coloumns: {} }]
    this.onSelectFun("S", this.aggregateFun[0])
    this.rowsFilter = [{ coloumns: {}, operators: "like", description: "" }];
    this.controlBreakArr = []
    this.aggregateFun = [{ fun: "S", coloumns: {} }]
    this.onSelectFun("S", this.aggregateFun[0])
    this.isCheck = false
    this.tableHeads = []
    for(let d of this.apexThead){
      if(d.checked){
        delete d['checked']
      }
    }
    this.clearAll.emit()
  }

  apply(shuffle,senddata?) {
    if (shuffle == "Function") {
      this.createFunction()
    } else if (shuffle == "Conditional Filter") {
      this.createRow()
    } else if (shuffle == "Group By") {
      this.createGroupBy()
    } else if (shuffle == "Column") {
      this.viewByColumns(senddata)
    }
  }
  changevalue() {
    if (this.isCheckGroup == true) {
      this.isCheckGroup = false
    }
  }
  checkboxClick(event, d) {
    if (event.detail.checked) {
      d.checked = true
      this.controlBreakArr.push({ coloumns: d, status: "Enabled" })
    } else {
      this.controlBreakArr = this.controlBreakArr.filter((a: any) => a.coloumns.prompt_name != d.prompt_name)
      d.checked = false
    }

    console.log("controlBreakArr", this.controlBreakArr)
  }
  groupClearAll() {
    this.controlBreakArr = []
    this.apexThead.map((c, i) => delete c['checked'])
  }
  chipRemove(name, i) {
    this.controlBreakArr = this.controlBreakArr.filter((a: any) => a.coloumns.prompt_name != name)
    this.apexThead.map((c, i) => c.prompt_name == name && delete c['checked'])
  }

  personalizationColumn(event, d) {
    if (event.detail.checked) {
      d.checked = true
      this.tableHeads.push(d.id)
      this.columnsData.map((a) => a.item_name == d.item_name && (a.newSeqNo = this.tableHeads.length))
      if(this.tableHeads.length==this.columnsData.length){
        this.selectAllColumnChecked=true
      }
      // this.makeCheckBoxDataColumn(d,this.tableHeads.length);
    } else {
       if(this.selectAllColumnChecked){
        this.unselectCheckbox=true
        this.selectAllColumnChecked=false
      }
      this.tableHeads = this.tableHeads.filter((a: any) => a != d.id)
      d.checked = false
      this.columnsData.map((a) => a.item_name == d.item_name && (a.newSeqNo = ""))
      for (let [i, thead] of this.tableHeads.entries()) {
        for (let colData of this.columnsData) {
          if (thead == colData.id) {
            colData.newSeqNo = i + 1;
          }
        }
      }
     
    }
  }
  saveForFutureDataColumn() {
    console.log(this.columnsData);
    let selectedColumnString: any;
    for (let a of this.columnsData) {
      if (a.newSeqNo && a.checked) {
        if (selectedColumnString && selectedColumnString.length > 0) {
          selectedColumnString = selectedColumnString + "#" + a.item_name + "^" + a.newSeqNo;
        } else {
          selectedColumnString = a.item_name + "^" + a.newSeqNo;
        }
      }
    }
    if(this.frame.isTextWrapped){
      selectedColumnString=selectedColumnString+"#tablewrap"
    }
    console.log(selectedColumnString);
    let reqData: any;
    console.log(this.frame)
    reqData = {
      wslp: this.globalObjects.getLocallData('userDetails'),
      wscp: {
        apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
        service_type: "set_table_personalization",
        ref_cursor_mode: this.globalObjects.refCursorMode,
        platform: this.globalObjects.getLocallData('platformValue'),
        column_str: selectedColumnString
      },
      wsdp: [],
      wsdpcl: []
    }
    this.apply(this.shuffle,reqData);
  }



  selectAllColumn(event) {
    if(!this.unselectCheckbox){
      if (event.detail.checked) {
        this.selectAllColumnChecked = true
        this.columnsData.map((a) => { a.checked = true, a.groupName = "Select All"
           this.personalizationColumn( event, a)
         })
      } else {
        this.selectAllColumnChecked = false
        this.columnsData.map((a) => { a.checked = false, a.groupName = "", this.personalizationColumn( event, a)})
      }
      this.columnsData = [...this.columnsData];
    }else{
      this.unselectCheckbox=false
    }
    
  }

  resetPersonailzationColumn(shuffle) {
    this.tableHeads=[]
    if (this.frame.selectedCols && this.frame.selectedCols.length > 0) {
      for (let col of this.frame.selectedCols) {
        this.tableHeads.push(col.id);
      }
    }
    this.selectAllColumnChecked = false
    let columnDataRow=[]
    let seq=0
    for(let i=0;i<this.frame.apextheads.length;i++){
      if(this.frame.apextheads[i].item_visible_flag=='T'){
        seq++;
        this.tableHeads.push(i)
      }
      columnDataRow.push({colName:this.frame.apextheads[i].prompt_name,item_name:this.frame.apextheads[i].item_name,groupName:"",id:i,checked:this.frame.apextheads[i].item_visible_flag=='T' ? true :false,newSeqNo:this.frame.apextheads[i].item_visible_flag=='T' ? seq :''})
    }
    
    this.columnsData=columnDataRow
    if (this.frame.apexFrameLevel4) {
      delete this.frame['apexFrameLevel4']
      // delete this.frame['columnsData']
     
      this.clearThis(shuffle)
    }
    /////////////////////////////for reset data service////////////////
    console.log(this.columnsData);
    let reqData: any;
    console.log(this.frame)
    reqData = {
      wslp: this.globalObjects.getLocallData('userDetails'),
      wscp: {
        apps_page_frame_seqid: this.frame.apps_page_frame_seqid,
        service_type: "reset_table_personalization",
        ref_cursor_mode: this.globalObjects.refCursorMode,
        platform: this.globalObjects.getLocallData('platformValue'),
      },
      wsdp: [],
      wsdpcl: []
    }
    let obj = {
      reqData:reqData
    }

    this.viewByColumn.emit(obj)
    /////////////////////////////////////////////////////////
  }
  
/* start For date format by arti*/
  presentPopover(event: Event, item: any) {
    item.isOpen = true;
    item.event = event;
  }
  onPopoverDismiss(item: any) {
    item.isOpen = false;
    item.event = null;
  }
  onDateChange(ev, item, dp?) {
    item.description = this.globalObjects.formatDate(ev.year + "-" + ev.month + "-" + ev.day, "dd-MMM-yyyy");
    item.isOpen = false
  }
  /* end For date format by arti*/
  clearValue(r){
    r.description=""
    this.changevalue();
  }

  searchText: string = "";
  searchKeys: string[] = ["prompt_name"];

  
  applyFilter() {
    this.filterApexThead = this.transform(this.apexThead, this.searchText, this.searchKeys);
  }
  transform(records: any[], searchTerm: string, keys: string[] = []): any[] {
  if (!records || !searchTerm) return records;

  const lowerTerm = searchTerm.toLowerCase();

  return records.filter(record => {
    const values = keys.length
      ? keys.map(k => record?.[k])
      : this.flatten(record);

    return values.some(v =>
      String(v ?? '').toLowerCase().includes(lowerTerm)
    );
  });
}

private flatten(obj: any): string[] {
  let values: string[] = [];
  Object.values(obj).forEach(val => {
    if (val && typeof val === 'object') {
      values = values.concat(this.flatten(val));
    } else {
      values.push(String(val ?? ''));
    }
  });
  return values;
}
//  addDuplicateField_sum(r) {
//     let item = JSON.parse(JSON.stringify(r));
//     if (item.coloumns.item_name) {
//       for (let name of this.apexThead) {
//         if (item.coloumns.item_name == name.item_name) {
//           item.coloumns = name;
//         }
//       }
//     }
//     // this.rowsFilter.push(item);
//     this.aggregateFun.push(item);

//   }

addDuplicateField_sum(r: any) {

  const item = JSON.parse(JSON.stringify(r));

  if (!item.coloumns) {
    item.coloumns = {};
  }

  const selectedColumn = this.apexThead.find(
    x => x.item_name === item.coloumns.item_name
  );

  if (selectedColumn) {
    item.coloumns = JSON.parse(JSON.stringify(selectedColumn));
  }

  this.aggregateFun.push(item);
}
}

