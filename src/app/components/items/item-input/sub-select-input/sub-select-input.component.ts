import { Component, OnInit,Input, Output, EventEmitter  } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-sub-select-input',
  templateUrl: './sub-select-input.component.html',
  styleUrls: ['./sub-select-input.component.scss'],
})
export class SubSelectInputComponent implements OnInit {

  @Input() subselect:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>(); 
    constructor(private globalObjects:GlobalObjectsService) {
      if(this.globalObjects.itemFlag){
        return applyLoggingDecorator(this,"sub-select-input")
      }
     }
    
      customActionSheetOptions: any = {  
        header: 'Select Options',  
        cssClass: 'my-custom-class',
      };  
    ngOnInit() {}
  
  }