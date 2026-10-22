import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FramesModule } from '../frames/frames.module';


@Component({
standalone : true,
  selector: 'app-frame-selector',
  templateUrl: './frame-selector.component.html',
  styleUrls: ['./frame-selector.component.scss'],
  imports: [STANDALONE_IMPORTS,FramesModule]
})
export class FrameSelectorComponent implements OnInit {
 @Input() frame:any={}
 @Input() wsdp:any={}
 @Input() sessionObj:any
 @Input() wscp:any={}
 @Input() wsdpcl:any={}
 @Input() page_no:any=0
 @Input()  object_mast:any
 @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
 @Output() personalize: EventEmitter<any> = new EventEmitter<any>();
 @Output() quickLinksemit: EventEmitter<any> = new EventEmitter<any>();
  constructor(private globalObjects:GlobalObjectsService,private events:Events) { 
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-selector-frame")
    }
  }

  ngOnInit() {
    console.log('Frame Selector',this.frame);
    // console.log('object_mast',this.object_mast);
  }

  itemClicked(event){
    // console.log(this.frame);
  this.emitPass.emit(event)
  }

  personalizeclick(event){
    this.personalize.emit(event)

  }
     quickLinks() {
    // if(this.isLeftBarOnMobile){
      // this.canvasModal.popDismiss("","quickLinks")
    // }else{
      this.quickLinksemit.emit();
    // }
}
}
