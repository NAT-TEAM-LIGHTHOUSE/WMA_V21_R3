import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { ImagePreviewPage } from '../image-preview/image-preview.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-execute-query',
  templateUrl: './execute-query.page.html',
  styleUrls: ['./execute-query.page.scss'],
})
export class ExecuteQueryPage implements OnInit {

  queryOrPro: string = "Query"
  loading: boolean = false;
  query: string;
  tableBody: any = [];
  jsonQuery = {};
  status: any = [];
  statusArray: any = [];
  colorVar: string;
  tableArr = [];
  isActive:boolean=false;
  constructor(private modalCtrl: ModalController, private dataService: DataService, public imagePreviewPage:ImagePreviewPage,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"execute-query-page")
    }
   }

  ngOnInit() {}

  closePage() {
    this.modalCtrl.dismiss();
  }

  enablePro(event){
     this.isActive =event;
     if(event){
      this.queryOrPro="Procedures"
     }else{
       this.queryOrPro="Query"
     }
  }

  executeQuery() {
    this.loading = true;
    this.statusArray = [];
    this.status = [];
    this.tableArr = [];
    this.tableBody = [];
    let url = 'executeQuery';

    var data = {
      "query": this.query == undefined ? this.query : (this.query).replace(/[\n\r]+/g, ''),
      "EnablePro": this.isActive
    }

    this.dataService.postData(url, data).then((res: any) => {
      this.loading = false;
      for (let resobj of res.responseData) {
        let head = [];
        let body = [];
        if (resobj[-1] != undefined) {
          this.status.push(resobj[-1]);
          this.colorVar = this.status[0][0];
          this.statusArray.push(this.status[0][1]);
        } else {
          for (let i of resobj[0]) {
            head.push(i);
          }
          for (let j in resobj) {
            body.push(resobj[j])
          }
          body.shift();
        }

        this.tableArr.push({ head: head, body: body });
      }
    }).catch(err => {
    })
  }

  async openPopUP(obj){
    const modal = await this.modalCtrl.create({
      component: ImagePreviewPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img: obj
      }
    });
    modal.present();
  }
  
}
