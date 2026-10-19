import { Component, Input, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-partition-item',
  templateUrl: './partition-item.component.html',
  styleUrls: ['./partition-item.component.scss'],
  imports : [STANDALONE_IMPORTS]
})
export class PartitionItemComponent implements OnInit {

  @Input() separator:any;

  constructor(public globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"partition-item")
    }
  }

  ngOnInit() {}


  toggleFrame() { }
}
