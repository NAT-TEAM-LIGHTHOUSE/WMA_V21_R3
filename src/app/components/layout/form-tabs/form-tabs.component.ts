import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-form-tabs',
  templateUrl: './form-tabs.component.html',
  styleUrls: ['./form-tabs.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class FormTabsComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  tableRows = [];
  selectedIndex: number = -1;
  
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.layoutFlag){
      return applyLoggingDecorator(this,"layout-column-filter")
    }
  }

  ngOnInit() {}

  itemClicked(event,i){
    this.emitPass.emit(event)
    this.selectedIndex = i;
  }
}
