import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-flip-kpi',
  templateUrl: './flip-kpi.component.html',
  styleUrls: ['./flip-kpi.component.scss'],
  imports :[STANDALONE_IMPORTS]
})
export class FlipKpiComponent implements OnInit {

  @Input() kpi:any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();

  values:any = [];
  baseImg:any = "";
  imgStyle:any = {};
  
  constructor(private globalObjects: GlobalObjectsService, public  events:Events) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"flip-kpi")
    }
  }

  ngOnInit() {

    this.baseImg = this.globalObjects.getScopeUrl()+'getImage?id='+this.kpi.apps_item_seqid+'&appTheme='+this.globalObjects.appTheme;
 
    if(this.kpi.value.indexOf("@") > -1){
      this.values = this.kpi.value.split("@");
    }else{
      this.values[0] = this.kpi.value;
    }
    this.globalObjects.getBase64ImageFromUrl(this.baseImg).then((image:any)=>{
      if(image){
        this.imgStyle = {
          "background-image": `url(${JSON.stringify(image)})`
        }
      }
    });

  }

  itemClick(event) {
    this.emitPass.emit(this.kpi);
  }

}
