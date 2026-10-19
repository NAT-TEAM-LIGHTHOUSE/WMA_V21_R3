import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-kpi-slider',
  templateUrl: './kpi-slider.component.html',
  styleUrls: ['./kpi-slider.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class KpiSliderComponent implements OnInit {

  @Input() sKpi:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor(public globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"kpi-slider")
    }
   }

  ngOnInit() {
    if (this.sKpi.value) {
      this.sKpi.value = this.sKpi.value.split("@");
    } else {
      this.sKpi.value = [];
    }
  }

  itemClick(event) {
    this.emitPass.emit(this.sKpi);
  }
}
