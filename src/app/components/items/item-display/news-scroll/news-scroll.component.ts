import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-news-scroll',
  templateUrl: './news-scroll.component.html',
  styleUrls: ['./news-scroll.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class NewsScrollComponent implements OnInit {

  @Input() newsscroll:any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  marqueeText= "Welcome To Lighthouse Info Systems Pvt. Ltd";
  date = new Date();
  constructor(private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"news-scroll")
    }
   }

  ngOnInit(){}
  itemClick(event) {
    this.emitPass.emit(this.newsscroll);
  }

}
