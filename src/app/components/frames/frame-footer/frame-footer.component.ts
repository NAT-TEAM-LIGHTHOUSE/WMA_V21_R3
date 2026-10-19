import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-frame-footer',
  templateUrl: './frame-footer.component.html',
  styleUrls: ['./frame-footer.component.scss'],
})
export class FrameFooterComponent implements OnInit {

  @Input() item: any = {};
  @Input() frame_type: any = {};
  @Input() frame: any = {};
  @Input() wscp: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-footer")
    }
   }

  ngOnInit() {
  }

  itemClicked(event) {
    this.emitPass.emit(event);
  }

}
