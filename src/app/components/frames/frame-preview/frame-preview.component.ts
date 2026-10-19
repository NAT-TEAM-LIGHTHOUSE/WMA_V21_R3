import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FrameSelectorComponent } from '../../frame-selector/frame-selector.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,FrameSelectorComponent],
  selector: 'app-frame-preview',
  templateUrl: './frame-preview.component.html',
  styleUrls: ['./frame-preview.component.scss'],
})
export class FramePreviewComponent implements OnInit {
  frame
  wsdp
  sessionObj
  wscp
  object_mast
  page_no
  wsdpcl
  constructor(private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-preview")
    }
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    console.clear()
   }
   
}
