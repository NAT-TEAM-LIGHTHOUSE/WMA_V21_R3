import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController, ModalController, Platform, PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  showFrame: boolean = true;
  item_slno_count: number = 1;
  current_page_parameter: any = {};
  wscp: any = {};
  callingObjectArr: any = [];
  tableData: any;
  colSize: any = [];
  checkCardItem = false;
  firstEmptyframe: any;
  developerModeData: any;
  subscribeRefreshFlag = false;
  searchText: any;
  jsonTableData = [];
  tableRows = [];
  files: any = [];
  searchFlag: any = false;
  loading: boolean = false;
  sepKey = [];
  itemsDivider = [];
  canvasRows = [];
  containerRows = [];
  refreshing = false;
  promptName: any;
  val: any

  constructor(public globalObjects: GlobalObjectsService, public lhs_lib: LhsLibService, public platform: Platform,
    public loadingController: LoadingController,  public modalController: ModalController,public popoverController: PopoverController) {
      if(this.globalObjects.frameFlag){
        return applyLoggingDecorator(this,"frame-header-bar")
      }
     }

  ngOnInit() {}

  itemClicked(event, rowsdata, i) {
    event.callingObjectArr = this.callingObjectArr;
    event.wsdp = [];
    let col = {};
    var rowindex;
    delete this.frame['executing_index'];
    if (rowindex == undefined) {
      rowindex = i;
    }
    for (let itemGroup of rowsdata) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {
          if(item.datatype && item.datatype.toUpperCase() == 'NUMBER'){
            col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',','') : '';
          }else{
            col[item.apps_item_seqid] = item.value;
          }
        }
      }
    }
    event.wsdp.push(col);
    event.wsdpcl = [];
    event.wsdpcl.push(col);
    event.itemIndex = rowindex;

    this.emitPass.emit(event);
  }

}
