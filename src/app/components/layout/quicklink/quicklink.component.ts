
import {ScrollingModule } from '@angular/cdk/scrolling';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController, ModalController, Platform, PopoverController } from '@ionic/angular/standalone';
import { SuperPage } from 'src/app/pages/super/super.page';

import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS,forwardRef(() => SuperPage)],
  selector: 'app-quicklink',
  templateUrl: './quicklink.component.html',
  styleUrls: ['./quicklink.component.scss'],
})
export class QuicklinkComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPasscheck: EventEmitter<any> = new EventEmitter<any>();

@ViewChild('superpage') superpage:SuperPage;


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

  constructor(public globalObjects: GlobalObjectsService, public lhs_lib: LhsLibService, public platform: Platform,
    public loadingController: LoadingController, public modalController: ModalController, public popoverController: PopoverController, 
    private sqlServ: SqlLiteService, public sanitizer: DomSanitizer, private canvasmodal:CanvasModalService,private dataService: DataService, private processData: ProcessDataService) {
      if(this.globalObjects.layoutFlag){
        return applyLoggingDecorator(this,"quicklink")
      }
     }

  ngOnInit() {
    this.refreshing = false;
    let frameLevel4;
    if(this.frame){
      this.getRefData(this.frame);
    }
  }


  getRefData(frame) {

    if (frame.on_frame_load_str) {

      let parseValue = this.getParse(frame.on_frame_load_str);

      let url = 'getRefCursor?Procname=' + encodeURIComponent(parseValue);
       this.dataService.getData(url).then((data: any) => {
        frame.loading = false;
        if (data.responseStatus && data.responseStatus.includes("success")) {

          frame.tableData = this.globalObjects.setPageInfoNoS2U(data.responseData);

          // this.processData.populateRows(frame.apps_page_frame_seqid,frame.tableData);
          console.log(frame.tableData);
        }

       

      }).catch(error => {
        console.error(error);
        frame.loading = false;
   
      });
    }
  }

  getParse(proc) {
    var bindVarLogic = proc.match(/:(.*?)[=,*,>,<,+,/,%,-,(,;]/g);
    let userDetails = this.globalObjects.getLocallData('userDetails');
    let bindData = "";
    if (bindVarLogic && bindVarLogic.length > 0) {
      for (var b = 0; b < bindVarLogic.length; b++) {
        let d = bindVarLogic[b].replaceAll(":", "").trim();
        if (d && d !== "") {
          let v = d.match(/[a-z_.0-9]+/gi)[0];

          if (v) {
            for (let u in userDetails) {
              if (u.toLowerCase() == v.toLowerCase()) {
                let val = userDetails[u];
                bindData = d.replace(v, val);

                proc = proc.replaceAll(bindVarLogic[b], bindData);
                break;
              }
            }
          }
        }
      }

    }
    return proc;
  }
 
  itemClicked(event, i) {


      if (this.frame) {
        let item = this.frame.Level4[0].Level5[0];
  
        let keys = Object.keys(event);
  
        for (let k of keys) {
          if (item.hasOwnProperty(k.toLowerCase())) {
            item[k.toLowerCase()] = event[k];

            if(k.toLowerCase() == "apps_item_seqid"){
              item["orignal_apps_item_seqid"] = event[k];
            } else if(k.toLowerCase() == "apps_page_frame_seqid"){
              item["orignal_apps_page_frame_seqid"] = event[k];
            }
          }
        }
  
        if (item.calling_object_code) {
          item.object_code = item.calling_object_code;
          item.click_events_str = "get_object_config_new;";
  
          this.canvasmodal.dismiss(item);
        }
  
      }
    }


  async openFooter(ev) {
    const popover = await this.popoverController.create({
      component: QuicklinkComponent,
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
        this.itemClicked(res.data.data, 0)
      }
    })
  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
  }


  checkClickedlink(value){
    this.emitPasscheck.emit(value);
  }

  ngOnDestroy(){
    console.clear()
   }
  openObject(){
    let event={
      seqid:this.frame ? this.frame.apps_page_frame_seqid : 'WEMU0048-F-1',
      openObject:true,
      item_seqid : 'WMABLD36-I-234255',
      
      object_code:"WEMU0048"
    }
    this.canvasmodal.dismiss(event);
  }
}

