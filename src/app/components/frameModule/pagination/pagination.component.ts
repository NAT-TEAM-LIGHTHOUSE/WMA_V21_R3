import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
    imports: [STANDALONE_IMPORTS]
})
export class PaginationComponent implements OnInit{
  @Input() frame: any = {};
  @Input() page: Number
  @Input() parentDiv: any
  @Output() pageChange = new EventEmitter();
  @Input() rowCount:number
  @Output() rowCountChange = new EventEmitter(); 

  selectShow: boolean = false;
  pagination: boolean = true;
  constructor(private processData: ProcessDataService, private lhs_lib: LhsLibService) { }

  ngOnInit() {



    let frameFilterFlag = this.frame.frame_filter_flag ? this.frame.frame_filter_flag.split(";") : null;
    if (frameFilterFlag) {
      for (let x of frameFilterFlag) {

        if (x.toUpperCase() == 'NO_PAGINATION') {
          this.pagination = false;
        }
      }
    }
  }

  rowsPerPage() {
    this.page = 1
    this.pageChange.emit(this.page)
    this.frame.isClickedRowPerPageTable=true
    this.frame.display_no_of_records = this.frame.displayDataLen
    this.processData.afterTableRows(this.frame);
    this.frame.rowCount=0
    this.rowCountChange.emit(this.rowCount)
    this.parentDiv.nativeElement.scrollTop = 0;
  }
  paginate(a_current_page) {
    this.page = a_current_page
    this.pageChange.emit(this.page)
    this.frame.page_no = a_current_page;
    let to = a_current_page * this.frame.displayDataLen;
    let from = to - this.frame.displayDataLen;
    this.frame.from_record = from;
    this.frame.to_record = to;

    if (!this.frame.maximum_no_of_pages_navigated || this.frame.maximum_no_of_pages_navigated < a_current_page) {
      this.frame.maximum_no_of_pages_navigated = a_current_page;
    }
    this.frame.active_row = this.frame.from_record;
    this.processData.afterTableRows(this.frame, from, to, this.frame.page_no);
    this.frame.rowCount=this.frame.from_record
    this.rowCountChange.emit(this.rowCount)
    this.parentDiv.nativeElement.scrollTop = 0;
  }
  go_first_page() {
    this.paginate(1);
    // this.lhs_lib.app_first_record(this.frame.apps_page_frame_seqid, 'move');
    this.parentDiv.nativeElement.scrollTop = 0;  // Scroll to top of the table
  }

  go_last_page() {
    this.paginate(this.frame.total_Pages);
    // this.lhs_lib.app_last_record(this.frame.apps_page_frame_seqid, 'move');
    let tableRows=this.frame.searchableData ? this.frame.searchableData : this.frame.tableRows
    if(this.frame.searchableData){
      if (tableRows && tableRows.length > 0) { 
          let activeRow=tableRows[tableRows.length-1][0]
          if(activeRow.Level5.length > 0){
            this.frame.active_row = activeRow.Level5[0].indexcount;
          }
      }
    }else{
      if (tableRows && tableRows.length > 0) { 
        let activeRow=tableRows[tableRows.length-1][0]
        if(activeRow.Level5.length > 0){
          this.frame.active_row = activeRow.Level5[0].indexcount;
        }
      }
    }
    this.frame.rowCount=this.frame.searchableData? this.frame.searchableData.length-1 : this.frame.tableData.length-1
    this.rowCountChange.emit(this.rowCount)
    this.scrollToBottomIfLastPage();
  }
  // Scroll to the bottom if the current page is the last one
  private scrollToBottomIfLastPage() {
    const lastPage = Math.ceil((this.frame.searchableData ? this.frame.searchableData.length :this.frame.tableData.length) / this.frame.displayDataLen);
    if (this.page === lastPage) {
      // Scroll to the bottom of the table
      this.parentDiv.nativeElement.scrollTop = this.parentDiv.nativeElement.scrollHeight;
    }
  }



}
