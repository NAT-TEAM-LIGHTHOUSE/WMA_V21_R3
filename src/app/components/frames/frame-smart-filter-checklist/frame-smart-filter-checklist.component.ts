import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-smart-filter-checklist',
  templateUrl: './frame-smart-filter-checklist.component.html',
  styleUrls: ['./frame-smart-filter-checklist.component.scss'],
})
export class FrameSmartFilterChecklistComponent implements OnInit {

  constructor(private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-smart-filter-checklist")
    }
  }

  ngOnInit() {}

}
