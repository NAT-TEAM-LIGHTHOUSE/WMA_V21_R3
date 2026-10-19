import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FrameCanvasComponent } from '../frame-canvas/frame-canvas.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,FrameCanvasComponent],
  selector: 'app-parameterframe',
  templateUrl: './parameterframe.component.html',
  styleUrls: ['./parameterframe.component.scss'],
})
export class ParameterframeComponent implements OnInit {
  object_mast:any
  wsdp:any
  sessionObj:any
  wscp:any
  wsdpcl:any
  page_no:any
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"parameterFrame")
    }
   }

  ngOnInit() {
   console.log(this.object_mast);

  }

}
