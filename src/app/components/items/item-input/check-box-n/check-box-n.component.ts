import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-check-box-n',
  templateUrl: './check-box-n.component.html',
  styleUrls: ['./check-box-n.component.scss'],
})
export class CheckBoxNComponent implements OnInit {
  @Input() checkBox: any = {};
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  constructor(private globalobject:GlobalObjectsService) {
    if(this.globalobject.itemFlag){
      return applyLoggingDecorator(this,"check-box-n")
    }
   }

  ngOnInit() {}


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
