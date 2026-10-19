import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-freezecolumn',
  templateUrl: './freezecolumn.page.html',
  styleUrls: ['./freezecolumn.page.scss'],
})
export class FreezecolumnPage implements OnInit {
  getHeads:any;
  getheadFromDD:any;
    constructor(public navParams: NavParams, public popOverCtrl: PopoverController, private globalObjects:GlobalObjectsService) { 
      this.getHeads =JSON.parse(JSON.stringify(this.navParams.data['datahead'])) ;
      if(this.globalObjects.pagesFlag){
        return applyLoggingDecorator(this,"freezeColumn-page")
      }
    }
  
    ngOnInit() {
    }
  
    dropdwnfreezeVl(event){
     //console.log(event.detail);
    }
    sendChoosecolumn(){
      this.popOverCtrl.dismiss(JSON.parse(JSON.stringify(this.getheadFromDD)),"freeze");
    }
    cancel(){
      this.popOverCtrl.dismiss();
    }
  }
  