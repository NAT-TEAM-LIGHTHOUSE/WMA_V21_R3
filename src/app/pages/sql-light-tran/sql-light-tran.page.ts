import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { ExecutedTabPage } from '../executed-tab/executed-tab.page';
import { PendingTabPage } from '../pending-tab/pending-tab.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-sql-light-tran',
  templateUrl: './sql-light-tran.page.html',
  styleUrls: ['./sql-light-tran.page.scss'],
})
export class SqlLightTranPage implements OnInit {

  pendingTab = PendingTabPage;
  executedTab =ExecutedTabPage;
  activeTab:any = 'PENDING-TAB';
  
  constructor(public modalController: ModalController, public platform:Platform,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"sql-light-tran-page")
    }
  }

  ngOnInit() {
  }

  navigatePage(tab) {
    this.activeTab = tab;
  }

  
  closePage(){
    this.modalController.dismiss();
  }


}

