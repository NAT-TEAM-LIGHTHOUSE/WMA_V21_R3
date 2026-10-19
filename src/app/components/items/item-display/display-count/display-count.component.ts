import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-display-count',
  templateUrl: './display-count.component.html',
  styleUrls: ['./display-count.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class DisplayCountComponent implements OnInit {

  @Input() dispCount: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor(public globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"display-count")
    }
   }

  ngOnInit() {}

  itemClick(event) {
    this.emitPass.emit(this.dispCount);
  }
}
