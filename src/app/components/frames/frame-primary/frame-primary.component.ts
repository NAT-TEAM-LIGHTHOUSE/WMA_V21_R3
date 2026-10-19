import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-primary',
  templateUrl: './frame-primary.component.html',
  styleUrls: ['./frame-primary.component.scss'],
})
export class FramePrimaryComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  flagtoruncanvasfilter: boolean;
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {}
  constructor(private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-primary")
    }
  }

  ngOnInit() {
    console.log(this.frame)

    for (let itemGroup of this.frame.Level4) {
      if (itemGroup.Level5) {
        for (let item of itemGroup.Level5) {


    itemGroup.groupCol = [];
    if (itemGroup.design_control_type) {
      itemGroup.groupCol = itemGroup.design_control_type.split('-');
    //  this.colSize = itemGroup.groupCol;
      let index = 0;
      for (let itm of itemGroup.Level5) {
        if (itm.item_visible_flag == 'T') {
          let col = itemGroup.groupCol[index];
          itm.promptCol = (1.5 * 12 / parseFloat(col));
          index++;
        }
      }
    }
  }
}
  }

}
}
