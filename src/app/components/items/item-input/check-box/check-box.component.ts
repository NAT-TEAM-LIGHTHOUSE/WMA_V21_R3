import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
})
export class CheckBoxComponent implements OnInit {

  @Input() checkBox: any = {};
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private globalobject:GlobalObjectsService) {
    if(this.globalobject.itemFlag){
      return applyLoggingDecorator(this,"check-box")
    }
   }

  ngOnInit() {
  }

  itemClick(event) {

    this.checkBox.isValid = this.checkBox.isChecked;
    if (!this.checkBox.isChecked) {
      this.checkBox.isValid = true;
      this.checkBox.value = "Y";

    } else {
      this.checkBox.isValid = false;
      this.checkBox.value = "N";
    }

    this.emitPass.emit(this.checkBox);
  }
}
 