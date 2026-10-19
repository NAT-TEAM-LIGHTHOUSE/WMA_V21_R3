import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-dev-frame-item-list',
  templateUrl: './dev-frame-item-list.page.html',
  styleUrls: ['./dev-frame-item-list.page.scss'],
})
export class DevFrameItemListPage implements OnInit {
  baseImg:any;
  itemData:any = [];

  constructor(public popOverCtrl: PopoverController, private dataServ: DataService,private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"dev-frame-item-list-page")
    }
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.dataServ.getDataDev("devItemMast").then((res:any) => {
      if(res.responseStatus == 'success')
      this.itemData = res.responseData;
    })
  }

  popDismissN(data) {
    if(data && data.object_code){
      this.popOverCtrl.dismiss(data);
    }else{
      this.popOverCtrl.dismiss();
    }
  }

  popDismiss(){
    this.popOverCtrl.dismiss();
  }

  onImgError(event){
    event.target.src = './assets/imgs/no_image.png'
   }
}
