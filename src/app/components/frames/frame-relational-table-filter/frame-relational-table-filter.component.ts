import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-relational-table-filter',
  templateUrl: './frame-relational-table-filter.component.html',
  styleUrls: ['./frame-relational-table-filter.component.scss'],
})
export class FrameRelationalTableFilterComponent implements OnInit {
  @Input() frame: any;
  @Input() wsdp: any;
@Output() emitPass :EventEmitter<any> = new EventEmitter<any>();
  constructor(private modalGlobal:CanvasModalService,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-relation-table")
    }
   }

  ngOnInit() {}
click(){
  this.modalGlobal.popDismiss()
}
}
