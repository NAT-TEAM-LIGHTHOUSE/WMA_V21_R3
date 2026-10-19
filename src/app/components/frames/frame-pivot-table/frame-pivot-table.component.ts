import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {  ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Events } from 'src/app/services/events';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import WebDataRocks from 'webdatarocks';
@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-pivot-table',
  templateUrl: './frame-pivot-table.component.html',
  styleUrls: ['./frame-pivot-table.component.scss'],
})
export class FramePivotTableComponent implements OnInit {

  @Input() toolbar: boolean;
      @Input() width: string | number;
      @Input() height: string | number;
      @Input() report: WebDataRocks.Report | string;
      @Input() global: WebDataRocks.Report;
      @Input() frame:any;

      // @Input() frame: any = {};
      @Input() wsdp: any = {};
      @Input() wscp_send_input: any = {};
      @Input() wsdpcl: any = {};
      @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
      @Input() sessionObj: any = {};


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
      // api
      public webDataRocks: WebDataRocks.Pivot;
    private root: HTMLElement;
  
  
      constructor(private el: ElementRef,public event:Events,@Inject(PLATFORM_ID) private platformId: Object) {  }
  
      // ngOnInit() {
      //   this.root = this.el.nativeElement as HTMLElement;
      //   this.webDataRocks = new WebDataRocks({
      //       container: this.root.getElementsByClassName('wbr-ng-wrapper')[0],
      //       width: this.width,
      //       height: this.height,
      //       toolbar: this.toolbar,
      //       report: this.report,
      //       global: this.global,
      //       customizeCell: this.customizeCell,
      //       cellclick: (cell: WebDataRocks.CellData) => this.cellclick.next(cell),
      //       celldoubleclick: (cell: WebDataRocks.CellData) => this.celldoubleclick.next(cell),
      //       dataerror: (event: object) => this.dataerror.next(event),
      //       datafilecancelled: () => this.datafilecancelled.next(event),
      //       dataloaded: () => this.dataloaded.next(event),
      //       datachanged: (event: object) => this.datachanged.next(event),
      //       fieldslistclose: () => this.fieldslistclose.next(event),
      //       fieldslistopen: () => this.fieldslistopen.next(event),
      //       filteropen: () => this.filteropen.next(event),
      //       loadingdata: () => this.loadingdata.next(event),
      //       loadinglocalization: () => this.loadinglocalization.next(event),
      //       loadingreportfile: () => this.loadingreportfile.next(event),
      //       localizationerror: () => this.localizationerror.next(event),
      //       localizationloaded: () => this.localizationloaded.next(event),
      //       openingreportfile: () => this.openingreportfile.next(event),
      //       querycomplete: () => this.querycomplete.next(event),
      //       queryerror: () => this.queryerror.next(event),
      //       ready: () => this.ready.next(this.webDataRocks),
      //       reportchange: () => this.reportchange.next(event),
      //       reportcomplete: () => this.reportcomplete.next(event),
      //       reportfilecancelled: () => this.reportfilecancelled.next(event),
      //       reportfileerror: () => this.reportfileerror.next(event),
      //       reportfileloaded: () => this.reportfileloaded.next(event),
      //       runningquery: () => this.runningquery.next(event),
      //       update: () => this.update.next(event),
      //       beforetoolbarcreated: (toolbar: object) => this.beforetoolbarcreated.next(toolbar),
      //       aftergriddraw: (event: object) => this.aftergriddraw.next(event),
      //       beforegriddraw: (event: object) => this.beforegriddraw.next(event)
      //   });
      // }
  async ngOnInit(){
  console.log(this.frame.tableData);
  
  // let data1:any= [
  //     { 1: '', product: 'Apples', sales: 150, Cost: 75 },
  //     { 1: 'North', product: 'Oranges', sales: 150, Cost: 130 },
  //     { 1: '', product: 'Apples', sales: 0, Cost: 0 }, // Example where sales is zero
  //     { 1: 'South', product: 'Oranges', sales: 180, Cost: 150 }
  //   ]
  //   console.log(data1);
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
            datafilecancelled: () => this.datafilecancelled.next(event),
            dataloaded: () => this.dataloaded.next(event),
            datachanged: (event: object) => this.datachanged.next(event),
            fieldslistclose: () => this.fieldslistclose.next(event),
            fieldslistopen: () => this.fieldslistopen.next(event),
            filteropen: () => this.filteropen.next(event),
            loadingdata: () => this.loadingdata.next(event),
            loadinglocalization: () => this.loadinglocalization.next(event),
            loadingreportfile: () => this.loadingreportfile.next(event),
            localizationerror: () => this.localizationerror.next(event),
            localizationloaded: () => this.localizationloaded.next(event),
            openingreportfile: () => this.openingreportfile.next(event),
            querycomplete: () => this.querycomplete.next(event),
            queryerror: () => this.queryerror.next(event),
            ready: () => this.ready.next(this.webDataRocks),
            reportchange: () => this.reportchange.next(event),
            reportcomplete: () => this.reportcomplete.next(event),
            reportfilecancelled: () => this.reportfilecancelled.next(event),
            reportfileerror: () => this.reportfileerror.next(event),
            reportfileloaded: () => this.reportfileloaded.next(event),
            runningquery: () => this.runningquery.next(event),
            update: () => this.update.next(event),
          //   beforetoolbarcreated: (toolbar: object) => customizeToolbar,
            beforetoolbarcreated: (toolbar: object) => this.beforetoolbarcreated.next(toolbar),
            aftergriddraw: (event: object) => this.aftergriddraw.next(event),
            beforegriddraw: (event: object) => this.beforegriddraw.next(event)
        }  
      );
      this.event.unsubscribe(this.frame.apps_page_frame_seqid);
    this.event.subscribe(this.frame.apps_page_frame_seqid, () => {
      this.ngOnInit();
    })
  }

}
