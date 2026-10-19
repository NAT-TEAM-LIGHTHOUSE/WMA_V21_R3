import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-frame-smart-filter-range',
  templateUrl: './frame-smart-filter-range.component.html',
  styleUrls: ['./frame-smart-filter-range.component.scss'],
})
export class FrameSmartFilterRangeComponent implements OnInit {

  range = 10;
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-smart-filter-range")
    }
   }

  ngOnInit() {}

}
