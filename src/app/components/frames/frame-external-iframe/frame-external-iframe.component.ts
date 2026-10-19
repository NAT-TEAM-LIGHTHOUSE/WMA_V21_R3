import { Measure } from '@amcharts/amcharts5/stock';
import { isPlatformServer } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-external-iframe',
  templateUrl: './frame-external-iframe.component.html',
  styleUrls: ['./frame-external-iframe.component.scss'],
})
export class FrameExternalIframeComponent { 
  @Input() frame: any = {};
  @Input() object_mast: any = {};
  @Input() page_no: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('childFrame') childFrameRef!: ElementRef<HTMLIFrameElement>;
  data = {};
  clickItem: any;
  url: any;
  newUrl :any;
  frameUrl: any;
  scopeUrl: any;
  title = 'parent-app';
  messageFromChild: string = 'No messages yet';
  messageToSend: string = '';
  private messageListener: any;
  sanitizedUrl: SafeResourceUrl;
  para : any;
  constructor(private sanitizer: DomSanitizer, public globalObjects: GlobalObjectsService,private processData : ProcessDataService,private lhs_lib : LhsLibService,@Inject(PLATFORM_ID) private platformId: Object) {

  }

  ngOnInit() {
    this.scopeUrl = this.globalObjects.getLocallData('scopeUrl');
    console.log('scopeurl', this.globalObjects.getLocallData('scopeUrl'));
    let frameName = this.frame.object_code + "-PARA";
    this.para = this.lhs_lib.get_frame_config(frameName);
    console.log(this.para);
    this.paraFrameRows();
   this.getData();
  this.globalObjects.getLocallData('scopeurl');
  // alert('scopeurl' + this.globalObjects.getLocallData('scopeUrl'));
  //    this.messageListener = (event: MessageEvent) => {
  //   const message = event.data;
  //   if (!message) return;
  //     const receivedData = message;
  //        if (message.DATA && message.FRAME_ALIAS) {
  //     this.processData.populateRows(message.FRAME_ALIAS, message.DATA);
  //   }
  // if (message.FRAME_ALIAS === 'Q ' || message.FRAME_ALIAS === 'B' || message.FRAME_ALIAS ==='HB') {
  //   const childClickItemName = message.CLICK_ITEM;

  //    for (let items of this.frame.tableRows[0]) {
  //       // for (let items of itemGroup) {
  //         for (let item of items.Level5) {
  //           if (item.item_name === childClickItemName) {
  //             this.clickItem = item;
  //             console.log('Matched clickItem from child:', item);
  //             this.itemClicked(); 
  //             break;
  //           // }
  //         }
  //       }
  //     }
  //     console.log('Triggering itemClicked()');
  //     // this.itemClicked(); 
  //   }

  //     // console.log('Parent received data from child:', receivedData);
  //     // this.emitPass.emit(this.clickItem);
      
  //     // let data=message.DATA;
  //     //   this.processData.populateRows(message.FRAME_ALIAS,data);
  //   }



 this.messageListener = this.handleMessageEvent.bind(this);
 if (isPlatformServer(this.platformId)) return;
  window.addEventListener('message', this.messageListener);

  // window.addEventListener('message', this.messageListener);
  }

ngAfterViewInit() {
  const iframe = this.childFrameRef?.nativeElement;

  if (iframe) {
    iframe.onload = () => {
      // Send message after iframe loads
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'DATA_FROM_PARENT',
          payload: this.data
        }, '*');


          iframe.contentWindow.postMessage(
          { type: 'SCOPE_URL', payload: this.scopeUrl },
          '*'
        );
        console.log('Sent data to iframe (onload):', this.data);
      }
    };
  } else {
    console.error('Iframe not found');
  }
}

  ngOnDestroy() {
    if (this.messageListener) {
      if (isPlatformServer(this.platformId)) return;
      window.removeEventListener('message', this.messageListener);
    }
  }



async handleMessageEvent(event: MessageEvent) {
  const message = event.data;
  if (!message) return;

 
  if (message.DATA && message.FRAME_ALIAS) {
    await this.processData.populateRows(message.FRAME_ALIAS, message.DATA);
  }

  if (
    message.FRAME_ALIAS === 'Q' ||message.FRAME_ALIAS === 'B' ||
    message.FRAME_ALIAS === 'HB'
  ) {
    const childClickItemName = message.CLICK_ITEM;

    for (let itemgroup of this.frame.tableRows) {
      for(let items of itemgroup){

        for (let item of items.Level5) {
          if (item.item_name === childClickItemName) {
            this.clickItem = item;
            console.log('Matched clickItem from child:', item);
            this.itemClicked();
            break;
          }
        }
      }
    }

    console.log('Triggering itemClicked()');
  }
}





  // sendMessageToChild(payload: any) {
  //   alert('Received JSON: ' + JSON.stringify(payload));
  //   this.emitPass.emit(this.clickItem);
  // }


  // getSafeUrl(url: string): SafeResourceUrl {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }

getData(){
  //  for (let itemGroup of this.frame.tableRows) {
  //     for (let items of itemGroup) {
  //       for (let item of items.Level5) {
  //         if (item.item_type == "IFRAME_URL") {
  //           this.url = item;
  //           // this.frameUrl = window.location+ '/' +  'QUOTATION';
  //           // this.frameUrl =this.sanitizer.bypassSecurityTrustResourceUrl(window.location+ '/' +  'QUOTATION');
  //           console.log('iframe url', this.frameUrl);
  //           // this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url.value);
  //           this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://192.168.100.234:8282/QUOTATION');
  //         }
      
  //       }
  //     }
  //   }

//   this.url = this.globalObjects.getLocallData('scopeUrl');
//   // let ipMatch = this.scopeUrl.match(/https?:\/\/([^/:]+)/);
//   // if (ipMatch && ipMatch[1]) {
//     this.newUrl = `${this.url.protocol}//${this.url.hostname}:${this.url.port}/QUOTATION`;;
//   // } else {
//     // this.url = '/QUOTATION'; 
//   // }
//    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.newUrl);
//   console.log('scopeurl', this.frameUrl);
// }


let fullUrl = this.globalObjects.getLocallData('scopeUrl');
// let fullUrl = 'http://192.168.100.21:8888';
// Example: http://192.168.100.21:8888/lhsws_wma/PM/192.168.100.7/1521/V7CERP/V7CERP/ORA11G/

try {
  let urlObj = new URL(fullUrl);
   this.url = `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port}/QUOTATION`;
  // this.url = `${fullUrl}/QUOTATION`;
  //this.url ="http://192.168.100.87:8102";
  
} catch (error) {
  console.error('Invalid URL:', error);
  this.url = '/QUOTATION';
}


this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
}

  // handleApproveTL(data: any) {
  //     data = data.DATA;
  // const frameAlias = data.FRAME_ALIAS;
  // const clickItem = data.CLICK_ITEM;

  // if (frameAlias && data) {
  //   this.processData.populateRows(frameAlias, data);
  // }
  //   this.emitPass.emit(data);
  // }

  // handleNegotiate(data: any) {
  //     this.itemClicked();
  //    this.emitPass.emit(data);
  // }
  // handleRevoke(data: any) {
  //    this.emitPass.emit(data);
  // }
  // handleDim(data: any) {
  //    this.emitPass.emit(data);
  // }
  // handleRejection(data: any) {
  //    this.emitPass.emit(data);
  // }
  // handleTL(data: any) {}

  itemClicked() {

    this.emitPass.emit(this.clickItem);
  }


  fullScreen(fullscreen_id: any, status) {
    if (status == '1') {
      let element = document.getElementById(fullscreen_id);
      element.classList.add("active_fullscreen");
      element.classList.remove("deactive_fullscreen");
      document.getElementById(fullscreen_id + "fullscreen_btn1").style.display = "none";
      document.getElementById(fullscreen_id + "fullscreen_btn2").style.display = "inherit";
      document.getElementById(fullscreen_id + "fullscreen_btn2").style.border = "2px solid #2e6adf";
      console.log('active');
    } else {
      let element = document.getElementById(fullscreen_id);

      element.classList.remove("active_fullscreen");
      element.classList.add("deactive_fullscreen");

      document.getElementById(fullscreen_id + "fullscreen_btn1").style.display = "inherit";
      document.getElementById(fullscreen_id + "fullscreen_btn2").style.display = "none";

      console.log('active');
    }
  }



paraFrameRows() {
  let tableRows = this.para.tableRows;
  let dataObj: { [key: string]: any } = {};

  tableRows.forEach(rowArray => {
    rowArray.forEach(row => {
      if (row.Level5 && Array.isArray(row.Level5)) {
        row.Level5.forEach(item => {
          if (item.item_name != null) {
            const key = item.item_name.toLowerCase();
            dataObj[key] = item.value !== "" && item.value !== undefined ? item.value : null;
          }
        });
      }
    });
  });

  console.log("data obj", dataObj);
  this.data = dataObj; // store for onload too

  const iframe = this.childFrameRef?.nativeElement;

  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ type: 'DATA_FROM_PARENT', payload: dataObj }, '*');
    console.log('Data sent to child via postMessage:', dataObj);
  } else {
    console.warn('Iframe not ready to receive message');
  }
}


}


