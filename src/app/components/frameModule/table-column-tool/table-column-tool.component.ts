import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { ColumnFilterLayoutComponent } from '../../layout/column-filter/column-filter.component';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';


@Component({
standalone : true,
  selector: 'app-table-column-tool',
  templateUrl: './table-column-tool.component.html',
  styleUrls: ['./table-column-tool.component.scss'],
  imports:[STANDALONE_IMPORTS]
})
export class TableColumnToolComponent implements OnInit {
  @Input() item: any = {};
  @Input() frame: any = {};
  @Input() isNotSort: boolean = false
  @Input() itemSortName: string = ''
  @Input() clickedHead: any = []
  @Output() clickedHeadChange = new EventEmitter();
  @Output() tablecolumnFilterrEmitPass = new EventEmitter();
  @Output() activetabshow = new EventEmitter();
  constructor(private commonMethod: CommonMethodService) { }

  ngOnInit() {}

  tablecolumnFilterr(event){
    this.tablecolumnFilterrEmitPass.emit(event)
  }

  // soting column
async thClick(th, type, item?, radioOn?,name?) {
    if (item) {
      item.sortClick = true
    }

    if (this.clickedHead.length > 0) {
      let obj: any = {};
      obj = this.clickedHead.find(x => x.th == th);
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
          item: item
        }
      }

      if (this.clickedHead.length > 1) {

        if (this.clickedHead[1].th == obj.th) {
          this.clickedHead[1] = obj;
        } else {
          let newArr = [];
          delete this.clickedHead[0].item['sortClick']
          newArr[0] = this.clickedHead[1];
          newArr[1] = obj;
          this.clickedHead = newArr;
        }

      } else {
        if (this.clickedHead[0].th == obj.th) {
          this.clickedHead[0] = obj;
        } else {
          this.clickedHead[1] = obj;
        }
      }

    } else {
      let obj = {
        th: th,
        direction: 1,
        type: type,
        item: item
      }
      this.clickedHead.push(obj);
    }
   await this.commonMethod.thClick1(this.clickedHead, this.frame, this.frame.displayDataLen);
   
    if (radioOn) {
      this.clickedHead.pop()
    }
    
    this.clickedHeadChange.emit(this.clickedHead)
    this.activetabshow.emit();
  }

}
