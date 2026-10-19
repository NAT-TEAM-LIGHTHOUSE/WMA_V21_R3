import { Component, OnInit,Input,Output,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController, ModalController, Platform, PopoverController } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { FooterListComponent } from '../footer-list/footer-list.component';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports : [STANDALONE_IMPORTS]
})
export class FooterComponent implements OnInit {

  
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
  baseImg: any;
  footerArr = [];

  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService, public lhs_lib: LhsLibService,
    public platform: Platform,
    public loadingController: LoadingController, public modalController: ModalController,
    public popoverController: PopoverController, private sqlServ: SqlLiteService, public sanitizer: DomSanitizer) {
      if(this.globalObjects.frameFlag){
        return applyLoggingDecorator(this,"footer-frame")
      }
     }

  ngOnInit() {
    this.refreshing = false;
    let frameLevel4;

    frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4));

    for (let itemGroup of frameLevel4) {
      for (let item of itemGroup.Level5) {
        this.footerArr.push(item);
      }
    }

    this.getImg(0);
  }

  getImg(i) {
    if (i >= this.footerArr.length) { } else {
      let item = this.footerArr[i];

      if (item.apps_icon_name) {
        var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + item.apps_icon_name + '&appTheme=' + this.globalObjects.appTheme;

        this.sqlServ.getImageFromLocal(item, val).then((res: any) => {
          item.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
          this.getImg(i + 1);
        });
      }else{
        this.getImg(i + 1);
      }
    }
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {

      this.globalObjects.converToBase64(blob).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

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
          if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
            col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
          } else {
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

  async openFooter(ev) {
    const popover = await this.popoverController.create({
      component: FooterListComponent,
      cssClass: 'footer-popover',
      translucent: true,

      event: ev,
      componentProps: {
        frame: this.frame,
      }
    });
    await popover.present();

    popover.onDidDismiss().then(res => {

      if (res.data && res.data.role && res.data.role == "itemClick") {
        this.itemClicked(res.data.data, this.frame.Level4, 0)
      }
    })
  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
  }

}
