import { Component, Input, OnInit } from '@angular/core';
import { format } from 'path';
import { FormatMaskPipe } from 'src/app/pipes/format-mask-pipe';
// import { FormatMaskPipe } from 'src/app/pipes/format-mask.pipe';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { Events } from 'src/app/services/events';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS,FormatMaskPipe],
  selector: 'app-doubleclick',
  templateUrl: './doubleclick.component.html',
  styleUrls: ['./doubleclick.component.scss'],
})
export class DoubleclickComponent implements OnInit {

  @Input() frame: any = {};
  @Input() isopen: any = {};
  @Input() e: any = {};
  @Input() index: any = {};
  @Input() rowCount: number;
  @Input() displayDataLen: number
  @Input() page: number
  @Input() parentDiv: any
  @Input() table2Body: any

  @Input() only_show: boolean = false;

  constructor(private events: Events, private commonMethod: CommonMethodService) { }

  ngOnInit() {
    if (!this.only_show) {
      this.frame.rowCount = this.frame.from_record + this.index
    } else {
      this.frame.rowCount = this.frame.active_row;
    }
  }



  backword() {

    if (!this.only_show) {
      if (this.frame.from_record == this.frame.rowCount) {
        this.paginate(this.frame.current_page_no - 1);
        this.parentDiv.nativeElement.scrollTop = this.parentDiv.nativeElement.scrollHeight;
      } else {
        this.tableScrollEffect("backword")
      }

      this.frame.rowCount--;
      this.events.publish(`rowcountSubscribe#${this.frame.apps_page_frame_seqid}`, this.rowCount)

      let activeRow = this.frame.searchableData ? this.frame.searchableData[this.frame.rowCount][0] : this.frame.tableRows[this.frame.rowCount][0]
      if (activeRow.Level5.length > 0) {
        this.frame.active_row = activeRow.Level5[0].indexcount;
      }
    } else {
      if (this.frame.active_row > 0) {
        this.frame.active_row--;
        this.frame.rowCount--;
      }
    }
  }


  forword() {

    if (!this.only_show) {
      this.frame.rowCount++;
      this.events.publish(`rowcountSubscribe#${this.frame.apps_page_frame_seqid}`, this.rowCount)
      if (this.frame.searchableData) {
        let activeRow = this.frame.searchableData[this.frame.rowCount][0]
        if (activeRow.Level5.length > 0) {
          this.frame.active_row = activeRow.Level5[0].indexcount;
        }
      } else if (this.frame.active_row < this.frame.tableRows.length - 1) {
        this.frame.active_row = this.frame.active_row + 1;
      }

      if (this.frame.to_record == this.frame.rowCount) {
        this.paginate(this.frame.current_page_no + 1);
        this.parentDiv.nativeElement.scrollTop = 0;
      } else {
        this.tableScrollEffect("forward")
      }
    } else {
      if (this.frame.active_row < this.frame.tableRows.length - 1) {
        this.frame.active_row = this.frame.active_row + 1;
        this.frame.rowCount++;
      }
    }


  }
  paginate(a_current_page) {
    this.page = a_current_page
    this.events.publish(`PageNumberSubscribe#${this.frame.apps_page_frame_seqid}`, this.page)
    this.commonMethod.paginate(a_current_page, this.frame, this.displayDataLen)
  }

  tableScrollEffect(direction) {
    let children: any = this.table2Body.nativeElement.children && this.table2Body.nativeElement.children.length > 0 ? this.table2Body.nativeElement.children : [];
    let el = this.table2Body.nativeElement.children[this.frame.active_row];
    for (let c of children) {
      if (c.className.includes("trow-active")) {
        el = c;
      }
    }
    var ul = this.parentDiv.nativeElement;
    var elRect = el.getBoundingClientRect(),
      parRect = ul.getBoundingClientRect();
    if (elRect && parRect) {
      var elementHeight = elRect.height;
      if (direction == "forward") {
        if (!(elRect.top >= parRect.top && elRect.bottom <= parRect.bottom - 40 && elRect.bottom + elementHeight <= parRect.bottom - 40)) {
          if (parRect.height > elRect.bottom)
            ul.scrollTop = ul.scrollTop + (parRect.height - elRect.bottom);
          else
            ul.scrollTop = ul.scrollTop + elRect.height + (elRect.bottom - parRect.bottom + 40);
        }
      } else {
        if ((elRect.top) <= (parRect.top + 40) + elementHeight) {
          if (parRect.top + elementHeight >= elRect.top)
            ul.scrollTop = ul.scrollTop - (((parRect.top + 40) + elementHeight) - (elRect.top));
          else
            ul.scrollTop = ul.scrollTop - (elRect.height + (parRect.top + 40) - elRect.top);
        }
      }
    }
  }
}
