import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import * as bootstrap from 'bootstrap';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { CreateMemoComponent } from '../../layout/create-memo/create-memo.component';
import { FrameIntegrationComponentComponent } from '../frame-integration-component/frame-integration-component.component';
import { FrameDashboardDefaultComponent } from '../frame-dashboard-default/frame-dashboard-default.component';
import { SerchNewGlobalComponent } from '../../layout/serch-new-global/serch-new-global.component';
import { FrameReportEngineComponent } from '../frame-report-engine/frame-report-engine.component';
import { NotificationlinkComponent } from '../../layout/notificationlink/notificationlink.component';
import { FormTabsComponent } from '../../layout/form-tabs/form-tabs.component';
import { NoteslinkComponent } from '../../layout/noteslink/noteslink.component';
import { ItemsComponent } from '../../items/items.component';
import { FrameDesktopClendarComponent } from '../frame-desktop-clendar/frame-desktop-clendar.component';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,CreateMemoComponent,FrameIntegrationComponentComponent,FrameDashboardDefaultComponent,SerchNewGlobalComponent,FrameReportEngineComponent,NotificationlinkComponent,FormTabsComponent,NoteslinkComponent,ItemsComponent,FrameDesktopClendarComponent],
  selector: 'app-frame-system',
  templateUrl: './frame-system.component.html',
  styleUrls: ['./frame-system.component.scss'],
})
export class FrameSystemComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
   @Output() quickLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Input() wscp: any = {};
  @Input() object_mast: any = {};
  // @Input() button: any;
  flagtoruncanvasfilter: boolean;
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  tableRows = [];
  filterData: any;
  @Input() displayPhoto: any;
  imgData: any;
  searchText: any;
  objectList: any[];
  developerModeData: any;
  object_text:any = "";
  htmltag:SafeHtml;
  content:SafeHtml;

  constructor(private dataService: DataService, public navCtrl: NavController, public globalObjects: GlobalObjectsService, private processData: ProcessDataService,
    private modalCtrl: ModalController, private lhs_lib: LhsLibService,private sanitizer: DomSanitizer,@Inject(PLATFORM_ID) private platformId: Object) {
    this.content = this.sanitizer.bypassSecurityTrustHtml(`htmltag`);
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-system")
    }
  }


  ngOnInit() {

    // if(this.frame.apps_frame_sub_type == 'RELATED_LINKS'){

    //   for(let obj of this.frame.tableRows){
    //     for(let frm of obj){
    //       for(let item of frm.Level5){
    //         console.log(item.prompt_name);
    //       }
    //     }
    //   }
    // }


    if (this.frame.apps_frame_sub_type == 'OBJECT_INFO') {
      let val = this.lhs_lib.get_item_value("P_ABOUT_PAGE", 0);

      if (val) {
        this.object_text = val;
      }

      let html = this.lhs_lib.get_item_value("P_ABOUT_PAGE_HTML",0);

      if(html){
        console.log(html)
        this.htmltag = this.sanitizer.bypassSecurityTrustHtml(html);
      }
    }
  }

 ngAfterViewInit(): void {
   if (isPlatformServer(this.platformId) || !isPlatformBrowser(this.platformId)) return
    const popoverTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );

    // popoverTriggerList.forEach((el: any) => {
    //      if (isPlatformServer(this.platformId) || !isPlatformBrowser(this.platformId)) return
    //   new bootstrap.Popover(el);
    // });
  }
  
  routerSuper() {
    this.navCtrl.navigateRoot('super');
  }

  getImage(item) {
    if (item.blobImg) {
      item.blobImg;
    } else if (item.value) {
      let url = 'getItemImage?query=' + encodeURIComponent(item.value);
      this.dataService.getData(url)
        .then(res => {
          var data: any = res;
          if (data.status == 'success') {
            item.blobImg = 'data:image/png;base64,' + '.png';
          } else {
            item.blobImg = '/assets/imgs/no_image.png';
          }

        }, err => {
          item.blobImg = '/assets/imgs/no_image.png';

        })

    } else {
      item.blobImg = '/assets/imgs/no_image.png';
    }

  }

  showItemImage(displayPhoto) {
    this.imgData = '/assets/imgs/no_image.png';
    if (displayPhoto) {
      let url = 'getItemImage?query=' + encodeURIComponent(displayPhoto.value);
      if (displayPhoto.value) {
        this.dataService.getData(url)
          .then(res => {
            var data: any = res;
            if (data.status == 'success') {
              this.imgData = 'data:image/png;base64,' + data.img;
            } else {
              this.imgData = '/assets/imgs/no_image.png';
            }
          }, err => {
            this.imgData = null;
          })
      }
    }
  }
  


      quickLinks() {
    // if(this.isLeftBarOnMobile){
      // this.canvasModal.popDismiss("","quickLinks")
    // }else{
      this.quickLinksemit.emit();
    // }
   
  }
  itemClicked(event) {
    delete this.frame['executing_index'];
    this.frame.old_active_row = this.frame.active_row;
    this.frame.active_row = event.indexcount;
    this.emitPass.emit(event);
  }
  
  async showDeveloperData(item) {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: item.apps_page_frame_seqid,
      item_seq_id: item.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: item,
        runEvents: item.runEventsa
      }
    });
    return await modal.present();
  }


  async showDeveloperData1() {
    this.developerModeData = {
      ws_seq_id: null,
      frame_seq_id: this.frame.apps_page_frame_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.frame
      }
    });
    return await modal.present();
  }

  searchAllData() {
    this.processData.searchAllData(this.frame);
    this.frame.page_no = 1;
    this.processData.afterTableRows(this.frame);

    if (this.frame.searchableData) {
      delete this.frame['active_row'];
      if (this.frame.searchableData && this.frame.searchableData.length > 0) {
        for (let itemGrp of this.frame.searchableData[0]) {
          if (itemGrp.Level5.length > 0) {
            this.frame.active_row = itemGrp.Level5[0].indexcount;
            break;
          }
        }
      }
    } else {
      if (this.frame.tableRows && this.frame.tableRows.length > 0) {
        for (let itemGrp of this.frame.tableRows[0]) {
          if (itemGrp.Level5.length > 0) {
            this.frame.active_row = itemGrp.Level5[0].indexcount;
            break;
          }
        }
      }
    }
  }



}
