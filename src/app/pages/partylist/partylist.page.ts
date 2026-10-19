import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-partylist',
  templateUrl: './partylist.page.html',
  styleUrls: ['./partylist.page.scss'],
})
export class PartylistPage implements OnInit {

  partyList: any[];

  constructor(private modalCtrl: ModalController, public navParams: NavParams,
    public dataService: DataService, private globalObjects: GlobalObjectsService, private events: Events) { 
      if(this.globalObjects.pagesFlag){
        return applyLoggingDecorator(this,"partylist-page")
      }
    }

  ngOnInit() {
    this.getPartyList();
  }

  closeLov() {
    this.modalCtrl.dismiss();
  }

  getPartyList() {
    let userDetails = this.globalObjects.getLocallData("userDetails");
    var data = {
      "parameters": userDetails
    }
    let url = "getPartyList";
    this.dataService.postData(url, data).then(res => {
      let data: any = res;
      this.partyList = [];
      if (data.responseStatus == "success") {
        this.partyList = data.responseData;
      }
    })
  }

  selectParty(party) {
    let partyCode = party.partyCode ? party.partyCode : "";
    this.globalObjects.setDataLocally("partyName", party.partyName);
    this.globalObjects.setDataLocally("partyCode", partyCode);
    this.modalCtrl.dismiss(party);
  }
}
