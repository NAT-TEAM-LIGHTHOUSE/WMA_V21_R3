import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-ion-badges',
  templateUrl: './ion-badges.component.html',
  styleUrls: ['./ion-badges.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class IonBadgesComponent implements OnInit {

  @Input() labelInput: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  constructor(public globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"ion-badges")
    }
  }

  ngOnInit() {
    if (this.labelInput.value) {
      this.labelInput.value = this.labelInput.value.split('@');
    }
  }

  itemClicked() {
    this.emitPass.emit(this.labelInput);
  }
}

