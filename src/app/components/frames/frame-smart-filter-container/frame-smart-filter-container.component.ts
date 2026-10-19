import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-smart-filter-container',
  templateUrl: './frame-smart-filter-container.component.html',
  styleUrls: ['./frame-smart-filter-container.component.scss'],
})
export class FrameSmartFilterContainerComponent implements OnInit {

  constructor(private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-smart-filter-container")
    }
  }

  ngOnInit() {}

}
