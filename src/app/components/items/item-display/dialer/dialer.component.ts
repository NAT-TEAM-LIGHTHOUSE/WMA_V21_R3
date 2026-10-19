import { Component, OnInit ,EventEmitter, Input, Output} from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-dialer',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class DialerComponent implements OnInit {

  @Input() dialer : any;
  @Input() frame_type:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};

  constructor(private globalObjects: GlobalObjectsService) { 
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"dialer")
    }
  }

  ngOnInit() {}
  
  itemClick(event) {
    this.emitPass.emit(this.dialer);
  }
}

