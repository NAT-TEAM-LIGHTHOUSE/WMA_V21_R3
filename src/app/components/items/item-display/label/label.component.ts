import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class LabelComponent implements OnInit {

  @Input() labelInput: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  displysettingstr:any;
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"label")
    }
   }

  ngOnInit() {}

  itemClick(event) {
    this.emitPass.emit(this.labelInput);
  }
}
