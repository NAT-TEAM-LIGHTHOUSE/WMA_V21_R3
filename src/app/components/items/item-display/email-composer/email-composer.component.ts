import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-email-composer',
  templateUrl: './email-composer.component.html',
  styleUrls: ['./email-composer.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class EmailComposerComponent implements OnInit {

  @Input() email : any;
  @Input() frame_type:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"button-n")
    }
   }

  ngOnInit() {}

  itemClick(event) {
    this.emitPass.emit(this.email);
  }
}