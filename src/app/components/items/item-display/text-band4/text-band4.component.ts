import { Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-text-band4',
  templateUrl: './text-band4.component.html',
  styleUrls: ['./text-band4.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class TextBand4Component implements OnInit {

  @Input() itemInput: any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  num:number;
  textbandcolor:any;

  constructor(public globalobject:GlobalObjectsService) {
    this.num= this.globalobject.colorcount;
    if(this.globalobject.itemFlag){
      return applyLoggingDecorator(this,"text-band4")
    }
  }

  ngOnInit() { 
  }

  itemClick(event) {
    this.emitPass.emit(this.itemInput);
  }

}