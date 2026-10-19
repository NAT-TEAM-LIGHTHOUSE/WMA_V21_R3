import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-developer-mode',
  templateUrl: './developer-mode.page.html',
  styleUrls: ['./developer-mode.page.scss'],
})
export class DeveloperModePage implements OnInit {

  user=
  {'appkey':"l.v7cerp",
    'developer_mode':"Y ",
    'iud_seqid':"291606829",
    'object_code':"WEGH0001",
    'platform':"browser",
    'service_type':"get_object_config"
  }

  clickedEventData:any;

  constructor(private globbalObject:GlobalObjectsService, private popOverCtrl: PopoverController) { 
    if(this.globbalObject.pagesFlag){
      return applyLoggingDecorator(this,"developer-mode-page")
    }
  }

  ngOnInit() {
    this.clickedEventData =  this.globbalObject.getLocallData("clickedItem")? this.globbalObject.getLocallData("clickedItem") : "";
    if(this.clickedEventData == ""){
      this.globbalObject.presentAlert("There is no data in developer mode right now...");
    }
  }
  closePopover(){
    this.popOverCtrl.dismiss();
  }

  clearData(){
    this.globbalObject.destroyLocalData('clickedItem');
    this.clickedEventData=[];
  }
  }




