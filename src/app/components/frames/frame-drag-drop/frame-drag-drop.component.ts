import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';


@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,DragDropModule],
  selector: 'app-frame-drag-drop',
  templateUrl: './frame-drag-drop.component.html',
  styleUrls: ['./frame-drag-drop.component.scss'],
})
export class FrameDragDropComponent implements OnInit {
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  userDetails: any;
  @Input() frame: any = {};
  @Output() passdataToframetable: EventEmitter<any> = new EventEmitter<any>();
  @Output() passdataToframeDepen: EventEmitter<any> = new EventEmitter<any>();
  @Input() wsdp: any = {};
  @Input() wscp_send_input: any = {};

  itemList:any = [];
  wscp: any;
  developerModeData: { ws_seq_id: any; frame_seq_id: any; };
  callingObjectArr: any[];
  tableData: any;
  tableRows: any=[];
  l_where_str: any;
  constructor(public globalObjects: GlobalObjectsService, private dataService: DataService,) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-drag-drop")
    }
  }

  ngOnInit() {
    this.getData();
  }
 
  group1 = [];
  group2 = [];
  group3 = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  getData() {
    this.globalObjects.showLoading();
    let wscp: any = {};
    wscp.service_type = this.frame.on_frame_load_str;
    wscp.object_code = this.frame.object_code;
    wscp.apps_page_frame_seqid = this.frame.apps_page_frame_seqid;

    if (this.l_where_str) {
      wscp.where_str = this.l_where_str.join(" ");
    } else {
      wscp.where_str = null;
    }
    var data = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": this.wsdp
    }
    let l_url = "S2U";
    this.dataService.postData(l_url, data).then(res => {
      

      let data: any = res;
      if (data.responseStatus == "success") {
        let objData = this.globalObjects.setPageInfo(data.responseData);
        let tableData = objData.Level1;
        if (tableData && tableData.length > 0) {
          let tableKey = Object.keys(tableData[0])
          for (let table of tableData) {
            let frameLevel4 = JSON.parse(JSON.stringify(this.frame.Level4))
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                for (let key of tableKey) {
                  if (item.item_name.toUpperCase() == key.toUpperCase()) {
                    item.value = table[key]
                    this.itemList.push(table[key]);
                  }
                }
              }
            }
            this.tableRows.push(frameLevel4);
          }
        
        }
        this.frame.tableRows = this.tableRows;
      }
    }).catch(err => {
      this.globalObjects.presentToast("2 Something went wrong please try again later!");
    })
  }
 }
