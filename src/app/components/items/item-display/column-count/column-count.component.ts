import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-column-count',
  templateUrl: './column-count.component.html',
  styleUrls: ['./column-count.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class ColumnCountComponent implements OnInit {

  @Input() colCount: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor(public globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"column-count")
    }
   }

  ngOnInit() {}

 
  itemClick(event) {
    this.emitPass.emit(this.colCount);
  }

}
