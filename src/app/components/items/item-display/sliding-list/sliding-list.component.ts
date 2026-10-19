import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-sliding-list',
  templateUrl: './sliding-list.component.html',
  styleUrls: ['./sliding-list.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class SlidingListComponent implements OnInit {

  @Input() slidelist: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  wsdp: any = [{}];
  frame: any = {};
  newsData: any = [];
  constructor(private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"sliding-list")
    }
  }


  ngOnInit() {
    if (this.slidelist.value) {
      this.newsData = this.slidelist.value.split("~");
    }
  }
  itemClick(event) {
    this.emitPass.emit(this.slidelist);
  }

  buttonClick(event) {
    this.emitPass.emit(this.slidelist);
  }

}
