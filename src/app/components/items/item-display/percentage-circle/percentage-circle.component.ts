import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-percentage-circle',
  templateUrl: './percentage-circle.component.html',
  styleUrls: ['./percentage-circle.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class PercentageCircleComponent implements OnInit {

  @Input() pcircleinput: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  classPercentageVar: any;
  colorOfRing:string;
  constructor(private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"percentage-circle")
    }
  }

  ngOnInit() {
    this.classPercentageVar = Math.floor(this.pcircleinput.value);
   
    if(this.classPercentageVar>=70){
       this.colorOfRing="green";
    }else if(this.classPercentageVar<70 && this.classPercentageVar>50){
      this.colorOfRing="orange";
    }else if(this.classPercentageVar<50){
      this.colorOfRing="red";
    }
  }

  itemClick() {
    this.emitPass.emit(this.pcircleinput);
  }


}
