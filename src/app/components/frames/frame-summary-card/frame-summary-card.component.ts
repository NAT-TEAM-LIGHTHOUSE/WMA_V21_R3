import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { TableSearchPipe } from 'src/app/pipes/table-search.pipe';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FrameCanvasFilterComponent } from '../frame-canvas-filter/frame-canvas-filter.component';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,TableSearchPipe,FrameCanvasFilterComponent],
  selector: 'app-frame-summary-card',
  templateUrl: './frame-summary-card.component.html',
  styleUrls: ['./frame-summary-card.component.scss'],
})
export class FrameSummaryCardComponent implements OnInit,OnDestroy {

  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wsdpcl: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() resforgraph: any = {};
  flagtoruncanvasfilter: boolean;
  userDetails: any;
  current_page_parameter: any = {};
  filterFormData: any = [];
  resData: any;
  l_total_rows: number;
  l_current_page: number;
  c_from_row: number;
  c_to_row: number;
  l_total_remain_pages: number;
  l_where_str: any;
  tableRows = [];
  thead: any = {};
  callingObjectArr: any = [];
  displayTableRow: any = [];
  flagforgraph: boolean = false;

  orderByParam: any = {};
  tbodyHeight: any;
  navCtrl: any;

  loadMoreFlag: string;
  summaryRow: any[];
  pdfHeading: any;
  public show: boolean = false;
  public show_filter: any = 'dontshow';
  public horizontal_table: any = 'Show';
  graphFlag: any = false;
  searchFlag: any = false;
  pdfFlag: any = false;
  getcanvasWCP: boolean = false;
  tablerowsfilter: any;

  filter: boolean = false;
  toggleFilter: boolean = false;
  colSize: any = [];
  developerModeData: any;
  subscribeRefreshFlag = false;
  constructor(private processData : ProcessDataService,public globalObjects: GlobalObjectsService, private events: Events, public modalController: ModalController) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-summary-card")
    }
  }
  
ngOnDestroy() {
  this.events.unsubscribe("skipFilter");
}
  ngOnInit() {

    this.events.subscribe("skipFilter", () => {
      this.filter = false;
      this.toggleFilter = false;
    });

    for (let itemGroup of this.frame.Level4) {
      itemGroup.groupCol = [];
      if (itemGroup.design_control_type) {
        itemGroup.groupCol = itemGroup.design_control_type.split('-');
        this.colSize = itemGroup.groupCol;
      }
    }

    let frameFilterFlag = this.frame.frame_filter_flag;
    if (frameFilterFlag) {
      if (frameFilterFlag.indexOf("S") > -1) {
        this.searchFlag = true;
      }
      if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1 || frameFilterFlag.indexOf("A") > -1) {
        this.filter = true;
      }
    }

    let theaddata: any = [];
    this.current_page_parameter = this.globalObjects.current_page_parameter;

    for (let itemGroup of this.frame.Level4) {
      let filterFlag = false;
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_filter_flag) {
          filterFlag = true;
        }
        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F' ||
          (this.current_page_parameter.MODE && (itemMast.item_visible_flag && (itemMast.item_visible_flag.indexOf(this.current_page_parameter.MODE) > -1)))
        ) { } else {
          theaddata.push(itemMast.prompt_name);
        }
      }
      if (filterFlag) {
        this.filterFormData.push(JSON.parse(JSON.stringify(itemGroup)));
      }
    }
    this.thead = theaddata;
  }

  filterToggle() {
    if (this.show_filter == 'show') {
      this.show_filter = 'dontshow';
    }
    else {
      this.show_filter = 'show';
      let frameFilterFlag = this.frame.frame_filter_flag;
      if (frameFilterFlag) {

        if (frameFilterFlag.indexOf("C") > -1 || frameFilterFlag.indexOf("J") > -1 || frameFilterFlag.indexOf("A") > -1) {
          this.toggleFilter = true;
        }
      }
    }
  }

  getdataFromcanvasFilter(event) {
    this.getcanvasWCP = true;
    let array = [];
    this.filter = false;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;

    array = event.where_str;

    this.l_where_str = [];
    if (array.length > 0) {
      for (let data of array) {
        this.l_where_str += data + "  ";
      }
    }
    else {
      this.l_where_str = "";
    }
    this.frame.l_where_str = this.l_where_str;
  }


  getFilterParameter(event) {
    this.l_where_str = event.where_str;
    this.frame.flagtoclosefilter = event.flagtoclosefilter;
    this.getdataFromcanvasFilter(event);
  }

  
  paginate(a_current_page){
    this.frame.page_no = a_current_page;
    let to = a_current_page*this.frame.display_no_of_records;
    let from = to - this.frame.display_no_of_records;
    this.processData.populateRows(this.frame.apps_page_frame_seqid,this.frame.tableData,from,to,a_current_page);
  }

  goToLast(num) {
    this.frame.page_no = num;
    let to = num*this.frame.display_no_of_records;
    let from = to - this.frame.display_no_of_records;
    this.processData.populateRows(this.frame.apps_page_frame_seqid,this.frame.tableData,from,to,num);
  }

  goFirst(num) {
    this.frame.page_no = num;
    let to = num*this.frame.display_no_of_records;
    let from = to - this.frame.display_no_of_records;
    this.processData.populateRows(this.frame.apps_page_frame_seqid,this.frame.tableData,from,to,num);
  }

  verticaldata() {
    this.frame.verticalTable = this.globalObjects.transpose(this.frame.tableRows);
  }

  itemClicked(event, rowsdata, i) {
    event.callingObjectArr = this.callingObjectArr;
    event.wsdp = [];
    let col = {};
    delete this.frame['executing_index'];
    var rowindex;
    for (let dataRow of rowsdata) {
      if (dataRow[0].item_name == "ROWNUMBER") {
        rowindex = dataRow[0].value - 1;
      }
    }
    if (!rowindex) {
      rowindex = i;
    }
    for (let itemGroup of this.frame.tableRows[i]) {
      if (itemGroup) {
        for (let item of itemGroup) {
          col[item.apps_item_seqid] = item.value
        }
      }
    }
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    event.itemIndex = rowindex;
    this.emitPass.emit(event);
  }

  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData:this.frame
      }
    });
    return await modal.present();
  }

}
