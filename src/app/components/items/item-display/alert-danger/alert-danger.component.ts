import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-alert-danger',
  templateUrl: './alert-danger.component.html',
  styleUrls: ['./alert-danger.component.scss'],
  imports : [STANDALONE_IMPORTS]
})
export class AlertDangerComponent implements OnInit {

  alertMessage: any;
  type: any;

  constructor(private pop: PopoverController, private events:Events, public globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"alert-danger")
    }
  }

  ngOnInit() {
  
  }

  closeAlert(){
    this.pop.dismiss();
  }

  goItem(p){

    let data = {
      statusType: p.para_type,
      value: p
    }
    this.pop.dismiss(data);
  }

}
