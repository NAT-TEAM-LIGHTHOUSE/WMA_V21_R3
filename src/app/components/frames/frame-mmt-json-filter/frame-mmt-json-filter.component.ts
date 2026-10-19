import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-mmt-json-filter',
  templateUrl: './frame-mmt-json-filter.component.html',
  styleUrls: ['./frame-mmt-json-filter.component.scss'],
})
export class FrameMmtJsonFilterComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-mmt-json-filter")
    }
   }

  ngOnInit(
    
  ) {
    console.log(this.frame);

  }

}
