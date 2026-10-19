import { Component, Input, OnInit,EventEmitter, Output} from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-two-d-kpi',
  templateUrl: './two-d-kpi.component.html',
  styleUrls: ['./two-d-kpi.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class TwoDKpiComponent implements OnInit {
  @Input() dKpi: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  flag:boolean = false;

  constructor(public globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"two-d-kpi")
    }
   }

  ngOnInit() {
    
    if(this.dKpi.css_class){}else{
      this.dKpi.css_class = 'blue';
    }
    if (this.dKpi.value) {
      this.dKpi.value = this.dKpi.value.split("@");
    } else {
      this.dKpi.value = [];
    }
  }

  itemClick(event) {
    this.emitPass.emit(this.dKpi);
  }


}
