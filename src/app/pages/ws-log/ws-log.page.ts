import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import {IonContent } from '@ionic/angular/standalone';

@Component({
standalone: true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-ws-log',
  templateUrl: './ws-log.page.html',
  styleUrls: ['./ws-log.page.scss'],
})
export class WsLogPage implements OnInit {

  constructor(private dataService:DataService,private lhslib : LhsLibService) { }



  // tablelogdata: any[] = [];
  ngOnInit() {
    this.runQuery();
  }
runQuery() {
  let obj={
    "iud_seqid": this.lhslib.object_mast.iud_seqid,
    // "query":"SELECT * FROM LHSSYS_RFID_TRAN WHERE ROWNUM <= 10"
    // "query":"SELECT * FROM lhswma_app_log WHERE ROWNUM <= 10"

    }
    this.dataService.executeSelectQuery(obj, "quickDbSelectCall").subscribe((data) => {
      console.log("select data : ", data.responseData);
      this.makeTableData(data.responseData);

    },
      (error) => {
        console.error('Error executing query', error);
      }
    );
  }

  thead: any = [];
  tablelogdata: any[] = [];

  makeTableData(data: any[][]): void {
    if (!data || data.length < 2) {
      this.tablelogdata = [];
      return;
    }

    const keys = data[0];
    const values = data.slice(1);

    this.tablelogdata = values.map(row =>
      keys.reduce((obj, key, index) => {
        obj[key] = row[index];
        return obj;
      }, {} as { [key: string]: any })
    );
    console.log(Object.keys(this.tablelogdata[0]));
    this.thead = Object.keys(this.tablelogdata[0]);
    console.log('Parsed Table Data:', this.tablelogdata);
  }
  // console.log(this.thead)
}
