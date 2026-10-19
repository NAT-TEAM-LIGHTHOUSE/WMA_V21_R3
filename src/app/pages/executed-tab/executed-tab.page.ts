import { Component, OnInit } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-executed-tab',
  templateUrl: './executed-tab.page.html',
  styleUrls: ['./executed-tab.page.scss'],
})
export class ExecutedTabPage implements OnInit {
  executedData :any = [];
  data :any = [];
  constructor(private sqlServ: SqlLiteService, private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"executed-tab-page")
    }
  }

  ngOnInit() {
    this.getAllData();
  }

  getAllData() {
    this.sqlServ.getAllExecutedEntery().then((res:any) => {
      if (res.resStatus == "Success") {
        this.data = res.resData
        for (let a of this.data) {
          let enteryData = JSON.parse(a.enteryData);
          for (let b of enteryData.wsdp) {
            this.executedData.push(b);
          }
        }
      } 
    }).catch(e => {
     // alert(JSON.stringify(e));
    })
  }


  deleteCard(i) {
    let id;
    id = this.data[i].id;
    this.sqlServ.deleteCard(id).then(res => {
      this.executedData = [];
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
