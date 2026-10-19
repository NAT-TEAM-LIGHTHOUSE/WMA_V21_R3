import { Component, ElementRef, Input, Output, EventEmitter, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import WebDataRocks from 'webdatarocks';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
@Component({
    selector: 'ion-wbr-pivot',
    // template: `<ion-item><ion-item class='wbr-ng-wrapper'></ion-item></ion-item>`
    templateUrl: './webdatarocks.component.html',
    imports:[CommonModule]
})
export class WebdatarocksComponent implements OnInit{
    @ViewChild('postForm', { static: false }) postForm: ElementRef;
    // params
    @Input() toolbar: boolean;
    @Input() width: string | number;
    @Input() height: string | number;
    @Input() report: WebDataRocks.Report | string;
    @Input() global: WebDataRocks.Report;
    @Input() frame:any;
    @Input() isnew:boolean=false;
    // @Input() customizeCell: (cell: WebDataRocks.CellBuilder, data: WebDataRocks.CellData) => void;
    @Output() cellclick: EventEmitter<WebDataRocks.CellData> = new EventEmitter();
    @Output() celldoubleclick: EventEmitter<WebDataRocks.CellData> = new EventEmitter();
    @Output() dataerror: EventEmitter<object> = new EventEmitter();
    @Output() datafilecancelled: EventEmitter<object> = new EventEmitter();
    @Output() dataloaded: EventEmitter<object> = new EventEmitter();
    @Output() datachanged: EventEmitter<object> = new EventEmitter();
    @Output() fieldslistclose: EventEmitter<object> = new EventEmitter();
    @Output() fieldslistopen: EventEmitter<object> = new EventEmitter();
    @Output() filteropen: EventEmitter<object> = new EventEmitter();
    @Output() fullscreen: EventEmitter<object> = new EventEmitter();
    @Output() loadingdata: EventEmitter<object> = new EventEmitter();
    @Output() loadinglocalization: EventEmitter<object> = new EventEmitter();
    @Output() loadingreportfile: EventEmitter<object> = new EventEmitter();
    @Output() localizationerror: EventEmitter<object> = new EventEmitter();
    @Output() localizationloaded: EventEmitter<object> = new EventEmitter();
    @Output() openingreportfile: EventEmitter<object> = new EventEmitter();
    @Output() querycomplete: EventEmitter<object> = new EventEmitter();
    @Output() queryerror: EventEmitter<object> = new EventEmitter();
    @Output() ready: EventEmitter<WebDataRocks.Pivot> = new EventEmitter();
    @Output() reportchange: EventEmitter<object> = new EventEmitter();
    @Output() reportcomplete: EventEmitter<object> = new EventEmitter();
    @Output() reportfilecancelled: EventEmitter<object> = new EventEmitter();
    @Output() reportfileerror: EventEmitter<object> = new EventEmitter();
    @Output() reportfileloaded: EventEmitter<object> = new EventEmitter();
    @Output() runningquery: EventEmitter<object> = new EventEmitter();
    @Output() update: EventEmitter<object> = new EventEmitter();
    @Output() beforetoolbarcreated: EventEmitter<object> = new EventEmitter();
    @Output() aftergriddraw: EventEmitter<object> = new EventEmitter();
    @Output() beforegriddraw: EventEmitter<object> = new EventEmitter();
    loaderFlag : boolean = false;
    // api
    public webDataRocks: WebDataRocks.Pivot;
    visibleHeader: string[] = [];
  private root: HTMLElement;

userDetails:any;
    constructor(private el: ElementRef, private http: HttpClient,private globalObjects : GlobalObjectsService,@Inject(PLATFORM_ID) private platformId: Object) {  }

   
 ngOnInit(){
    // Prepare POST body with payload structure
    this.userDetails = this.globalObjects.userDetails;
    console.log(this.frame)
   this.getHeader();
    
    // Generate unique reference number
    const uniqueRefNo = this.generateUniqueRefNo();
    
    const postBody = {
      payload_identifier: {
        user_ref_no: uniqueRefNo,
        calling_app_name: this.frame.apps_page_frame_name ,
        group_code: this.userDetails.G_DIV_GROUP_NAME,
        appkey: this.userDetails.appkey,
        user_code: this.userDetails.user_code,
        client_ip: this.userDetails.client_address,
        client_hostname: this.userDetails.client_host_name,
        client_browser: this.userDetails.client_browser
      },
      payload_data: {
        table_name: this.frame.apps_page_frame_name ? this.frame.apps_page_frame_name :"PIVOT_TABLE",
        table_data: this.frame?.tableData || [],
        table_header : this.visibleHeader || []
      }
      
    };

    // Send POST request and load response URL in iframe
    //   'http://192.168.101.88:8000/web/genai/tool_utility/pivot_table',
    this.sendPostAndLoadIframe(this.userDetails.g_pivot_table_url,
      postBody
    );
    console.log(this.isnew)
console.log(this.frame.tableData);
// let data1:any= [
//     { 1: '', product: 'Apples', sales: 150, Cost: 75 },
//     { 1: 'North', product: 'Oranges', sales: 150, Cost: 130 },
//     { 1: '', product: 'Apples', sales: 0, Cost: 0 }, // Example where sales is zero
//     { 1: 'South', product: 'Oranges', sales: 180, Cost: 150 }
//   ]
//   console.log(data1);
    // new WebDataRocks({
    //     container: "#wdr-component",
    //     toolbar: true,
    // //   branding:false,
    //     report: {
    //         dataSource: {
    //             data:this.frame.tableData
    //           },
    //     },
    //           global: this.global,
    //     //   customizeCell: this.customizeCell,
    //       cellclick: (cell: WebDataRocks.CellData) => this.cellclick.next(cell),
    //       celldoubleclick: (cell: WebDataRocks.CellData) => this.celldoubleclick.next(cell),
    //       dataerror: (event: object) => this.dataerror.next(event),
    //       datafilecancelled: () => this.datafilecancelled.next(),
    //       dataloaded: () => this.dataloaded.next(),
    //       datachanged: (event: object) => this.datachanged.next(event),
    //       fieldslistclose: () => this.fieldslistclose.next(),
    //       fieldslistopen: () => this.fieldslistopen.next(),
    //       filteropen: () => this.filteropen.next(),
    //       loadingdata: () => this.loadingdata.next(),
    //       loadinglocalization: () => this.loadinglocalization.next(),
    //       loadingreportfile: () => this.loadingreportfile.next(),
    //       localizationerror: () => this.localizationerror.next(),
    //       localizationloaded: () => this.localizationloaded.next(),
    //       openingreportfile: () => this.openingreportfile.next(),
    //       querycomplete: () => this.querycomplete.next(),
    //       queryerror: () => this.queryerror.next(),
    //       ready: () => this.ready.next(this.webDataRocks),
    //       reportchange: () => this.reportchange.next(),
    //       reportcomplete: () => this.reportcomplete.next(),
    //       reportfilecancelled: () => this.reportfilecancelled.next(),
    //       reportfileerror: () => this.reportfileerror.next(),
    //       reportfileloaded: () => this.reportfileloaded.next(),
    //       runningquery: () => this.runningquery.next(),
    //       update: () => this.update.next(),
    //     //   beforetoolbarcreated: (toolbar: object) => customizeToolbar,
    //       beforetoolbarcreated: (toolbar: object) => this.beforetoolbarcreated.next(toolbar),
    //       aftergriddraw: (event: object) => this.aftergriddraw.next(event),
    //       beforegriddraw: (event: object) => this.beforegriddraw.next(event)
    //   }  
    // );
}

async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

  const WebDataRocksModule: any = await import('webdatarocks');
  const WebDataRocks = WebDataRocksModule.default || WebDataRocksModule;
   new WebDataRocks({
        container: "#wdr-component",
        toolbar: true,
    //   branding:false,
        report: {
            dataSource: {
                data:this.frame.tableData
              },
        },
              global: this.global,
        //   customizeCell: this.customizeCell,
          cellclick: (cell: WebDataRocks.CellData) => this.cellclick.next(cell),
          celldoubleclick: (cell: WebDataRocks.CellData) => this.celldoubleclick.next(cell),
          dataerror: (event: object) => this.dataerror.next(event),
          datafilecancelled: () => this.datafilecancelled.next({}),
          dataloaded: () => this.dataloaded.next({}),
          datachanged: (event: object) => this.datachanged.next(event),
          fieldslistclose: () => this.fieldslistclose.next({}),
          fieldslistopen: () => this.fieldslistopen.next({}),
          filteropen: () => this.filteropen.next({}),
          loadingdata: () => this.loadingdata.next({}),
          loadinglocalization: () => this.loadinglocalization.next({}),
          loadingreportfile: () => this.loadingreportfile.next({}),
          localizationerror: () => this.localizationerror.next({}),
          localizationloaded: () => this.localizationloaded.next({}),
          openingreportfile: () => this.openingreportfile.next({}),
          querycomplete: () => this.querycomplete.next({}),
          queryerror: () => this.queryerror.next({}),
          ready: () => this.ready.next(this.webDataRocks),
          reportchange: () => this.reportchange.next({}),
          reportcomplete: () => this.reportcomplete.next({}),
          reportfilecancelled: () => this.reportfilecancelled.next({}),
          reportfileerror: () => this.reportfileerror.next({}),
          reportfileloaded: () => this.reportfileloaded.next({}),
          runningquery: () => this.runningquery.next({}),
          update: () => this.update.next({}),
        //   beforetoolbarcreated: (toolbar: object) => customizeToolbar,
          beforetoolbarcreated: (toolbar: object) => this.beforetoolbarcreated.next(toolbar),
          aftergriddraw: (event: object) => this.aftergriddraw.next(event),
          beforegriddraw: (event: object) => this.beforegriddraw.next(event)
      }  
    );

}
// const pivot = new WebDataRocks({
//     container: "#pivot-container",
//     beforetoolbarcreated: customizeToolbar,
//     report: "https://cdn.webdatarocks.com/reports/report.json",
//     toolbar: true
//   });
   
    /**
     * Send POST request and load response URL in iframe
     * @param url - The URL to send POST request to
     * @param body - Request body
     */
    sendPostAndLoadIframe(url: string, body: any) {
        this.loaderFlag = true;
      const headers = new HttpHeaders({
        
        'Content-Type': 'application/json'
      });

      this.http.post<any>(url, body, { headers }).subscribe({
        next: (response) => {
        
          console.log('POST response:', response);
          console.log('Message:', response.message);
          
          // Extract pivot_url from response
          const iframeUrl = response.pivot_url;
          
          if (iframeUrl) {
            // Load the URL in iframe
            const iframe = document.getElementById('wdr-component') as HTMLIFrameElement;
            if (iframe) {
              iframe.src = iframeUrl;
              this.loaderFlag = false;
              console.log('Loading iframe with pivot URL:', iframeUrl);
            }
          } else {
            console.error('No pivot_url found in response');
          }
        },
        error: (error) => {
          console.error('POST request failed:', error);
        }
      });
    }

    /**
     * Submit POST request to iframe
     * @param url - The URL to send POST request to
     * @param params - Object containing POST parameters
     */
    submitPostToIframe(url: string, params: { [key: string]: any }) {
      const form = document.getElementById('iframeForm') as HTMLFormElement;
      if (!form) return;

      // Set form action to the target URL
      form.action = url;

      // Clear existing inputs
      form.innerHTML = '';

      // Create hidden input fields for each parameter
      Object.keys(params).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      });

      // Submit the form
      form.submit();
    }

    /**
     * Generate unique reference number
     * @returns Unique identifier string
     */
    generateUniqueRefNo(): string {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      return `${this.userDetails?.user_code || 'USER'}_${timestamp}_${random}`;
    }


    



  getHeader() {
    let frameLevel4 = this.frame.apexFrameLevel4 ? this.frame.apexFrameLevel4 : this.frame.Level4;
    for (let itemGroup of frameLevel4) {
      for (let itemMast of itemGroup.Level5) {
        if (itemMast.item_type.indexOf('WHERE') > -1 || itemMast.item_visible_flag == 'F') { } else {
          if (itemMast.item_type == 'BT' || itemMast.item_type == 'DISPLAY_PHOTO' || itemMast.item_type == 'DOWNLOAD_DOC' || itemMast.item_type == 'BUTTON_ICON' || itemMast.item_type == 'FRAME_SEPARATOR' || itemMast.item_type == 'FRAME_BUTTON_ICON' || itemMast.item_name.toLowerCase().includes("wma_") || itemMast.item_visible_flag != 'T' || itemMast.item_type == 'RIGHT_CLICK') {
          } else {
            // if (!itemMast.prompt_name) {
            //   this.visibleHeader.push(itemMast.tool_tip);
            // } else {
              this.visibleHeader.push(itemMast.item_name);
            // }
            console.log(this.visibleHeader)
          }
        }
      }
    }

  }
}


