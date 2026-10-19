import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-text-area',
  templateUrl: './text-area.page.html',
  styleUrls: ['./text-area.page.scss'],
})
export class TextAreaPage implements OnInit {

  @Input() value;
  
  constructor( public popOverCtrl: PopoverController, private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"textarea-page")
    }
  }

  ngOnInit() {
  }

  dismiss(){
    this.popOverCtrl.dismiss({value : this.value});
  }

}
