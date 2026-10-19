import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ParaTextComponent } from '../../items/item-display/para-text/para-text.component';
import { ButtonNComponent } from '../../items/item-display/button-n/button-n.component';
import { DownloadDocComponent } from '../../items/item-display/download-doc/download-doc.component';

@Component({
  selector: 'app-table-group-filter',
  templateUrl: './table-group-filter.component.html',
  styleUrls: ['./table-group-filter.component.scss'],
  imports:[STANDALONE_IMPORTS,ParaTextComponent,ButtonNComponent,DownloadDocComponent]
})
export class TableGroupFilterComponent implements OnInit {
  @Input() groupFlag: any;
  @Input() frame: any;
  @Input() gpRHead: any;
  @Input() isNotSort: any;
  @Input() controlBreakArr: any;
  @Input() groupInnerHeader: any;
  @Input() controlBreakHead: any;
  @Input() current_page_parameter: any;
  @Input() tableData: any;
  @Output() dbClickpopoverEmit: any = new EventEmitter<any>();
  @Output() itemClickEmit: any = new EventEmitter<any>();
  innerGroupClickSort=[];
  groupClickSort=[];
  constructor() { }

  ngOnInit() {
console.log("this.tableData - ",this.tableData)
console.log("this.controlBreakArr - ",this.controlBreakArr);


  }

  collapseSort(th, k, radioOn?) {

    if (!th.order) {
      th.order = true
    }

    // th=th
    let obj: any = {};
    if (this.groupClickSort.length > 0) {

      obj = this.groupClickSort.find(x => x.th.key == th.key);
      if (obj) {
        if (obj.direction > 0) {
          obj.direction = -1;
        } else {
          obj.direction = 1;
        }
      } else {
        obj = {
          th: th,
          direction: 1,

        }
      }

      if (this.groupClickSort.length > 1) {

        if (this.groupClickSort[1].th.key == obj.th.key) {
          this.groupClickSort[1] = obj;
        } else {
          let newArr = [];
          delete this.groupClickSort[0].th['order']
          newArr[0] = this.groupClickSort[1];
          newArr[1] = obj;
          this.groupClickSort = newArr;
        }

      } else {
        if (this.groupClickSort[0].th.key == obj.th.key) {
          this.groupClickSort[0] = obj;
        } else {
          this.groupClickSort[1] = obj;

        }
      }
    } else {
      let obj = {
        th: th,
        direction: 1,
        // type: type,
        // item: item
      }
      this.groupClickSort.push(obj);
    }

    for (let x of this.groupClickSort) {

      this.controlBreakArr.sort((a, b) => {

        if (a.pRHead[k].type == 'DATE' || a.pRHead[k].type == 'DATETIME') {
          let newA = JSON.parse(JSON.stringify(a.pRHead[k].value));
          let newB = JSON.parse(JSON.stringify(b.pRHead[k].value));
          newA = newA ? new Date(newA.split('-').reverse().join('-')).getTime() : "";
          newB = newB ? new Date(newB.split('-').reverse().join('-')).getTime() : "";
          if (newA < newB) {
            return -1 * x.direction;
          } else if (newA > newB) {
            return 1 * x.direction;
          } else {
            return 0;
          }
        }
        else if (a.pRHead[k].type == 'NUMBER' || a.pRHead[k].type == 'NUMBER') {
          let newA;
          let newB
          if (a.pRHead[k].value && a.pRHead[k].value.includes(',')) {
            newA = JSON.parse(JSON.stringify(parseFloat(a.pRHead[k].value.replace(/,/g, ""))));
            newB = JSON.parse(JSON.stringify(parseFloat(b.pRHead[k].value.replace(/,/g, ""))));
          } else {
            newA = JSON.parse(JSON.stringify(parseFloat(a.pRHead[k].value)));
            newB = JSON.parse(JSON.stringify(parseFloat(b.pRHead[k].value)));
          }

          newA = newA ? newA : 0;
          newB = newB ? newB : 0;
          if (parseFloat(newA) < parseFloat(newB)) {
            return -1 * x.direction;
          }
          else if (parseFloat(newA) > parseFloat(newB)) {
            return 1 * x.direction;
          } else {
            return 0
          }

        } else {
          const nameA = a.pRHead[k].value?.toUpperCase(); // ignore upper and lowercase
          const nameB = b.pRHead[k].value?.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1 * x.direction;// ascending: -1, descending: 1
          } else if (nameA > nameB) {
            return 1 * x.direction;; // ascending: 1, descending: -1
          } else {
            // names must be equal
            return 0;
          }
        }
      });


    }
    if (radioOn) {
      this.groupClickSort.pop()
    }
  }

  collapseSortGroup(th, k, c, radioOn?) {
    if (!th.order) {
      th.order = true
    }

    let obj: any = {};
    if (this.innerGroupClickSort.length > 0) {

      obj = this.innerGroupClickSort.find(x => x.th.prompt_name == th.prompt_name);
      if (obj) {
        if (obj.direction > 0) {
          obj.direction = -1;
        } else {
          obj.direction = 1;
        }
      } else {
        obj = {
          th: th,
          direction: 1,

        }
      }

      if (this.innerGroupClickSort.length > 1) {

        if (this.innerGroupClickSort[1].th.prompt_name == obj.th.prompt_name) {
          this.innerGroupClickSort[1] = obj;
        } else {
          let newArr = [];
          delete this.innerGroupClickSort[0].th['order']
          newArr[0] = this.innerGroupClickSort[1];
          newArr[1] = obj;
          this.innerGroupClickSort = newArr;
        }

      } else {
        if (this.innerGroupClickSort[0].th.prompt_name == obj.th.prompt_name) {
          this.innerGroupClickSort[0] = obj;
        } else {
          this.innerGroupClickSort[1] = obj;

        }
      }
    } else {
      let obj = {
        th: th,
        direction: 1,
        // type: type,
        // item: item
      }
      this.innerGroupClickSort.push(obj);
    }

    for (let x of this.innerGroupClickSort) {

      c.items.sort((a, b) => {
        // console.log("a : ",a[k].Level5[0].value)
        // console.log("b : ",b[k].Level5[0].value)
        let first = a[k].Level5[0]
        let second = b[k].Level5[0]
        if (first.datatype == 'DATE' || first.datatype == 'DATETIME') {
          let newA = JSON.parse(JSON.stringify(first.value));
          let newB = JSON.parse(JSON.stringify(second.value));
          newA = newA ? new Date(newA.split('-').reverse().join('-')).getTime() : "";
          newB = newB ? new Date(newB.split('-').reverse().join('-')).getTime() : "";
          if (newA < newB) {
            return -1 * x.direction;
          } else if (newA > newB) {
            return 1 * x.direction;
          } else {
            return 0;
          }
        }
        else if (first.datatype == 'NUMBER' || first.datatype == 'NUMBER') {
          let newA;
          let newB
          if (first.value && first.value.includes(',')) {
            newA = JSON.parse(JSON.stringify(parseFloat(first.value.replace(/,/g, ""))));
            newB = JSON.parse(JSON.stringify(parseFloat(second.value.replace(/,/g, ""))));
          } else {
            newA = JSON.parse(JSON.stringify(parseFloat(first.value)));
            newB = JSON.parse(JSON.stringify(parseFloat(second.value)));
          }

          newA = newA ? newA : 0;
          newB = newB ? newB : 0;
          if (parseFloat(newA) < parseFloat(newB)) {
            return -1 * x.direction;
          }
          else if (parseFloat(newA) > parseFloat(newB)) {
            return 1 * x.direction;
          } else {
            return 0
          }

        } else {
          const nameA = first.value?.toUpperCase(); // ignore upper and lowercase
          const nameB = second.value.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1 * x.direction;// ascending: -1, descending: 1
          } else if (nameA > nameB) {
            return 1 * x.direction;; // ascending: 1, descending: -1
          } else {
            // names must be equal
            return 0;
          }
        }
      });

    }
    if (radioOn) {
      this.innerGroupClickSort.pop()
    }
  }
  dbClickpopover(flag,tableData,rowindex){
    this.dbClickpopoverEmit.emit({flag:flag,tableData:tableData,rowindex:rowindex})
  }
  itemClicked(item,tableData,rowindex,event){
    this.itemClickEmit.emit({item:item,tableData:tableData,rowindex:rowindex})
  }
}
