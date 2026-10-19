
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-download-popover',
  templateUrl: './download-popover.component.html',
  styleUrls: ['./download-popover.component.scss'],
  imports : [STANDALONE_IMPORTS]
})
export class DownloadPopoverComponent implements OnInit {

  local_id:any;
  loading:boolean = false;
  localData = [];

  constructor(private sqlServ : SqlLiteService,public popOver: PopoverController,private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-download-popover")
    }
  }

  ngOnInit() {
    this.loading = true
    this.sqlServ.getLocalById(this.local_id,'local_saved_object').then(res => {
      this.localData = res;
      this.loading = false;
    }).catch(err => {
      this.loading = false;
    })
  }

  uploadLocal(data){
    if(data.doc){
      this.popOver.dismiss(data.doc.objData,"upload");
    }else{
      this.popOver.dismiss(data.objData,"upload");
    }
  }

  deleteLocal(id){
    this.sqlServ.deleteObjMast(id,'local_saved_object');
    this.popOver.dismiss("","delete");
  }

}
