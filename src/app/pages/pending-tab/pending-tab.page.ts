import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-pending-tab',
  templateUrl: './pending-tab.page.html',
  styleUrls: ['./pending-tab.page.scss'],
})
export class PendingTabPage implements OnInit {

  pendingData :any = [];
  data :any = [];
  pendingCount : number = 0;
  constructor(private sqlServ: SqlLiteService,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"pending-tab-page")
    }
  }

  ngOnInit() {
    this.getAllData();
  }

  getAllData() {
    this.sqlServ.getAllPendingEntery().then(res => {
      if (res.resStatus == "Success") {
        this.data = res.resData
        for (let a of this.data) {
          let enteryData = JSON.parse(a.enteryData);
          for (let b of enteryData.wsdp) {
            this.pendingData.push(b);
          }
        }
        this.pendingCount = this.data.length;
      } 
    }).catch(e => {
    })
  }


  deleteCard(i) {
    let id;
    id = this.data[i].id;
    this.sqlServ.deleteCard(id).then(res => {
      this.pendingData = [];
      this.ngOnInit()
    }).catch(e => {
      alert(JSON.stringify(e));
    });
  }

  updateCard(object, i){
    let id;
    id =this.data[i].id;
  }
}
