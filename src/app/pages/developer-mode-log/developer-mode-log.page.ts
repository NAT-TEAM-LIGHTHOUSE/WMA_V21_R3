import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { format } from 'cl-sql-formatter';
import copy from 'copy-to-clipboard';

import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { JsonListingPage } from '../json-listing/json-listing.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { ItemclickComponent } from 'src/app/components/layout/itemclick/itemclick.component';
import { DataService } from 'src/app/services/data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { HighlightModule } from 'ngx-highlightjs';
import { isPlatformServer } from '@angular/common';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS,HighlightModule],
  selector: 'app-developer-mode-log',
  templateUrl: './developer-mode-log.page.html',
  styleUrls: ['./developer-mode-log.page.scss'],
})
export class DeveloperModeLogPage implements OnInit {
  plsql: boolean = true;
  formatSql: any = [];
  sqlData: any;
  @Input() requestData: any;
  @Input() data: any;
  @Input() frame: any;
  @Input() runEvents: any;
  @ViewChild('tableBody') table2Body: ElementRef;
  @ViewChild("parentDiv") parentDiv: ElementRef;
  framesArrayNew: any = [];
  rowCount: number = 0;
  page = 1
  logData: any = [];
  beautifyflag: Boolean = false;
  num: number = -1;
  userDetails: any;

  reqData2 = []

  appLogData = [];
  codeFlag: boolean = false;

  reqData = [];

  itmLog = true;

  datas = [

  ]
  ClickEvnetsQue: any
  constructor(private modalctrl: ModalController, private http: HttpClient, private modalGlobal: CanvasModalService, public globalObjects: GlobalObjectsService, public lhs_lib: LhsLibService, public events: Events,private dataService: DataService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "developer-mode-log-page")
    }
  }

  beautify(data, index, i) {
    this.logData[i][data.key] = format(data.value, {
      language: 'plsql',
      uppercase: true,
    });
  }

  copySql(data, i) {
    if (this.logData.length > 0) {
      var textCopy = this.logData[i][data.key];
      copy(textCopy);
      this.num = i;
    } else {
      var textCopy = data;
      copy(textCopy);
      this.num = i;
    }
  }

  ngOnInit() {
    this.reqData2 = this.globalObjects.jdata;

    console.log(this.requestData);
    console.log(JSON.stringify(this.data) + "Data to be printed for item_seq_id");

    /* Start For ClickEvnetsQue array*/
this.clickEventQue()
    /* End For ClickEvnets array */

   

    this.getItems();
    

    if (this.lhs_lib.object_mast && this.lhs_lib.object_mast.logdata) {
      console.log(this.lhs_lib.object_mast);
      // this.appLogData = this.getLog(this.lhs_lib.object_mast.logdata);
      this.appLogData = this.lhs_lib.object_mast.logdata;
      console.log(this.appLogData);
    }

    if (this.requestData) {
      this.reqData = this.requestData.requestData
    }
    this.getData(this.data).then((res) => {
      this.logData = res;
    });
    console.log("this is data" + JSON.stringify(this.runEvents));

  }


  clickEventQue(){
     /* Start For ClickEvnetsQue array*/
     if (isPlatformServer(this.platformId)) return;
    const tabGet: any = document.querySelectorAll('app-my-tab')
    for (let [index, tabTag] of tabGet.entries()) {
      if (!tabTag.childNodes[0].hasAttribute("hidden")) {
        let objCode
        if (+this.requestData.apps_page_no > 1) {
          let page = +this.requestData.apps_page_no - 1
          objCode = `${this.requestData.object_code}#${page}`;
        } else {
          objCode = `${this.requestData.object_code}`;
        }


        if (index != 0) {
          for (let [i, tab] of this.lhs_lib.dynamicTabs.entries()) {
            if (index - 1 == i) {
              // this.events.publish(`developerEvent${this.requestData.object_code}#${tab.instance.superId}`)
              this.events.publish(`developerEvent${objCode}#${tab.instance.superId}`)
            }
          }
        } else {
          // this.events.publish(`developerEvent${this.requestData.object_code}`)
           this.events.publish(`developerEvent${objCode}`)
        }
      }
    }
    this.ClickEvnetsQue = this.globalObjects.developer_clickEvent
  }
  closePage() {
    this.modalctrl.dismiss();
  }

  reCall(ev) {
    if (this.itmLog) {
      this.itmLog = false;

      let dt = JSON.parse(JSON.stringify(this.data));
      dt.iud_seqid = this.lhs_lib.object_mast.iud_seqid;
      this.logData = [];
      this.getData(dt).then((res) => {
        this.logData = res;
      });
    } else {
      console.log(this.data);
      this.itmLog = true;
      this.logData = [];
      this.getData(this.data).then((res) => {
        this.logData = res;
      });
    }
  }


  findAndOpenItem() {
    if (!this.data?.item_seq_id) {
      return;
    }
    for (let i = 0; i < this.framesArrayNew.length; i++) {
      let frame = this.framesArrayNew[i];

      if (frame.items && frame.items.length > 0) {
        let foundItem = frame.items.find(item => item.apps_item_seqid === this.data.item_seq_id);

        if (foundItem) {
          this.dbClickpopover(true, foundItem, i);
          return;
        }
      }
    }
  }

  findAndOpenFrame() {
    if (!this.data?.frame_seq_id) {
      return;
    }
    for (let i = 0; i < this.framesArrayNew.length; i++) {
      let frame = this.framesArrayNew[i];
      if (frame.apps_page_frame_seqid === this.data.frame_seq_id) {
        this.dbClickpopover(true, frame, i);
        return;
      }
    }
  }



  getData(reqData: any) {
    return new Promise((resolve, reject) => {
      let url = this.globalObjects.getScopeUrl() + "getDeveloperModeData"
      if (reqData) {
        this.http.post(url, reqData).subscribe((res: any) => {
          if (res.responseStatus == 'success') {
            resolve(res.responseData);
          } else {
            this.globalObjects.presentAlert(res.responseMsg);
            resolve(res.responseData);
          }
        }, (error) => {
          this.globalObjects.presentAlert("Error 404 url not available...");
          resolve(null);
        })
      }
      else {
        reject();
      }
    })
  }

  clearData() {
    this.appLogData = [];
    this.globalObjects.events_log = [];
    if (this.lhs_lib.object_mast) {
      this.lhs_lib.object_mast.logdata = [];
    }
    if (this.logData.length > 0) {
      let reqData = {
        frame_seq_id: this.logData[0].APPS_PAGE_FRAME_SEQID
      }
      let url = this.globalObjects.getScopeUrl() + "clearLogData"
      if (reqData.frame_seq_id) {
        this.http.post(url, reqData).subscribe((res: any) => {
          if (res.responseStatus == 'success') {
            this.logData = [];
            this.globalObjects.presentAlert(res.responseMsg);
          } else {
            this.globalObjects.presentAlert(res.responseMsg);
          }
        }, (error) => {
          this.globalObjects.presentAlert("Server error occured please try again later...");
        })
      }
    }
  }

  sql() {
    if (this.plsql) {
      this.plsql = false;
    }
    else {
      this.plsql = true;
    }
  }

  getframename(name) {
    var name2 = Object.keys(name)[0];
    let item = this.lhs_lib.get_item(name2, 0);


    if (item) {
      let frame = this.lhs_lib.get_frame_config(item.apps_page_frame_seqid);
      let cc = frame.apps_page_frame_name + " " + "[" + frame.apps_page_frame_seqid + "]"
      return cc;
    }

  }

  async clickme(reqData2) {
    const modal = await this.modalctrl.create({
      component: JsonListingPage,
      componentProps: { values: reqData2 }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  }


  getLog(items) {

    const itemMap = {};
    items.forEach(item => {
      itemMap[item.id] = { ...item, execute_items: [] };
    });

    // Assign children to their parents
    items.forEach(item => {
      if (item.parentId !== null && itemMap[item.parentId]) {
        itemMap[item.parentId].execute_items.push(itemMap[item.id]);
      }
    });

    // Extract the top-level items (where parentId is null)
    const nestedItems = Object.values(itemMap).filter((item: any) => item.parentId === null);

    // Nested loop example
    nestedItems.forEach((parent: any) => {
      console.log("Parent:", parent.item_name);
      parent.execute_items.forEach(child => {
        console.log("  Child:", child.item_name);
      });
    });

    return nestedItems;
  }


  toggleItems(frame) {
    frame.isExpanded = !frame.isExpanded;
  }

  getItems() {

    let frameRef = this.lhs_lib.object_mast;
    for (let frameDetail of frameRef.Level2) {
      for (let frame of frameDetail.Level3) {
        let framesArray = { ...frame };

        delete framesArray.tableRows;
        delete framesArray.summary_rows;
        delete framesArray.headers;
        delete framesArray.canvasRows;
        delete framesArray.tableData;
        framesArray.items = [];

        if (frame.Level4) {
          for (let itemDetail of frame.Level4) {
            if (itemDetail.Level5) {
              let itemsArrayNew = itemDetail.Level5.map(item => {
                let simpleItem = { ...item };
                delete simpleItem.Level5;
                return simpleItem;
              });
              framesArray.items.push(...itemsArrayNew);
            }
          }
        }
        this.framesArrayNew.push(framesArray);
      }
    }
    console.log('Frames:', this.framesArrayNew);

  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
  objectValues(obj: any): string[] {
    return obj ? Object.values(obj) : [];
  }
  ngOnDestroy() {
    this.globalObjects.developer_clickEvent = ""
  }
  eventColor = "#000000"

  statusCheck(i) {
    if (i < this.ClickEvnetsQue.click_events_count) {
      this.eventColor = '#008000'
      return { status: 'DONE', style: 'green' }
    } else if (i == this.ClickEvnetsQue.click_events_count && i + 1 < this.ClickEvnetsQue.click_events_arr.length) {
      this.eventColor = '#ffff00'
      return { status: 'RUNNIG', style: 'yellow' }
    } else if (i + 1 == this.ClickEvnetsQue.click_events_arr.length) {
      this.eventColor = '#008000'
      return { status: 'DONE', style: 'green' }
    } else {
      this.eventColor = '#ff0000'
      return { status: 'PENDING', style: 'red' }
    }
  }
  isApplog: boolean = false
  isObjectData: boolean = true
  isRequestData: boolean = false
  isEventQue: boolean = false
  isEventLog: boolean = false;

  tabActive(tab) {
    if (tab == 'applog') {
      this.isApplog = true
      this.isObjectData = false
      this.isRequestData = false
      this.isEventQue = false;
      this.isEventLog = false;
    } else if (tab == 'objectdata') {
      this.isApplog = false
      this.isObjectData = true
      this.isRequestData = false
      this.isEventQue = false;
      this.isEventLog = false;
    } else if (tab == 'requestdata') {
      this.isApplog = false
      this.isObjectData = false
      this.isRequestData = true
      this.isEventQue = false;
      this.isEventLog = false;
    } else if (tab == 'eventque') {
      this.isApplog = false
      this.isObjectData = false
      this.isRequestData = false
      this.isEventQue = true;
      this.isEventLog = false;
    } else {
      this.isApplog = false
      this.isObjectData = false
      this.isRequestData = false
      this.isEventQue = false;
      this.isEventLog = true;
    }
  }

  // dbClickpopover(isOpen: boolean, item, i) {
  //   // if (this.isSingleSelectRecord) {
  //     let component = ItemclickComponent
  //     let componentProps = {
  //       frame: this.framesArrayNew,
  //       isopen: isOpen,
  //       item: item,
  //       index: i,
  //       rowCount: this.rowCount,
  //       displayDataLen: this.framesArrayNew.displayDataLen,
  //       page: this.page,
  //       parentDiv: this.parentDiv,
  //       table2Body: this.table2Body
  //     }

  //     let id = "table_model"
  //     let cssClass = "table_modal"
  //     this.events.subscribe(`rowcountSubscribe#${this.framesArrayNew.apps_page_frame_seqid}`, res => {
  //       this.rowCount = res
  //     });
  //     this.events.subscribe(`PageNumberSubscribe#${this.framesArrayNew.apps_page_frame_seqid}`, res => {
  //       this.page = res
  //     });
  //     this.modalGlobal.openModal(component, componentProps, id, event, cssClass, "", "", "").then((detail) => {
  //       if (detail.data) {
  //         // this.getdataFromcanvasApex(detail.data)
  //       }
  //       this.events.unsubscribe(`rowcountSubscribe#${this.frame.apps_page_frame_seqid}`);
  //       this.events.unsubscribe(`PageNumberSubscribe#${this.frame.apps_page_frame_seqid}`);
  //     })

  // }


  async dbClickpopover(isOpen: boolean, item, i) {
    // let componentProps = {
    //   frame: this.framesArrayNew,
    //   isopen: isOpen,
    //   item: item,
    //   index: i,
    //   rowCount: this.rowCount,
    //   displayDataLen: this.framesArrayNew.displayDataLen,
    //   page: this.page,
    //   parentDiv: this.parentDiv,
    //   table2Body: this.table2Body
    // }
    // this.developerModeData = {
    //   ws_seq_id: '',
    //   frame_seq_id: this.textinput.apps_page_frame_seqid,
    //   item_seq_id: this.textinput.apps_item_seqid
    // }
    const modal = await this.modalctrl.create({
      component: ItemclickComponent,
      id: "table_model",
      cssClass: 'table_modal',
      componentProps: {
        frame: this.framesArrayNew,
        isopen: isOpen,
        item: item,
        index: i,
        parentDiv: this.parentDiv,
        table2Body: this.table2Body
      }
    });
    return await modal.present();
  }

  eventLogSend() {
    this.dataService.postLogData(this.globalObjects.events_log).subscribe(
      (res) => {
        if (res.responseStatus.includes('success')) {
          alert("browser log saved successfully")
        } else {
          alert("browser log not saved successfully")
        }
      },
      (err) => {
        alert("service not run")
      }
    );
  }
  eventLogClear(){
     this.globalObjects.events_log=[]
     this.globalObjects.log_event_slno=0;
  }
  downloadJson(){
      let eventQues=this.ClickEvnetsQue;
      let eventLog=this.globalObjects.logFlag ? this.globalObjects.events_log : "App log off"
      // Download for Event Que
      this.globalObjects.downloadJsonFile(eventQues, "EventQue")
          // Download for Event Log
      this.globalObjects.downloadJsonFile(eventLog, "EventsLog")
    }
  
}
