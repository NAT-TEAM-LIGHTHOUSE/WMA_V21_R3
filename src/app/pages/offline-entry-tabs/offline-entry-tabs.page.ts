import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { PouchDBService } from 'src/app/services/pouch-db.service';
import { OfflineEntryListPage } from '../offline-entry-list/offline-entry-list.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-offline-entry-tabs',
  templateUrl: './offline-entry-tabs.page.html',
  styleUrls: ['./offline-entry-tabs.page.scss'],
})
export class OfflineEntryTabsPage implements OnInit {

 
  objectMast: any = [];

  constructor(private pouchDb: PouchDBService, private modalCtrl: ModalController, private globalObjects: GlobalObjectsService) { 
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"offline-entry-tabs-page")
    }
  }

  ngOnInit() {
    this.pouchDb.getAll().then(res => {
      this.objectMast = res;
    });
  }
  closePage() {
    this.modalCtrl.dismiss();
  }

  doAction(event) {
    if (event.entryList.length > 0) {
      this.showUserModal(event)
    } else {
      this.globalObjects.presentAlert('No Offline Data..');
    }
  }

  async showUserModal(data: any) {
    const modal = await this.modalCtrl.create({
      component: OfflineEntryListPage,
      componentProps: data
    });
    return await modal.present();
  }
}
