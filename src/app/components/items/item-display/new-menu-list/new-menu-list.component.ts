import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-new-menu-list',
  templateUrl: './new-menu-list.component.html',
  styleUrls: ['./new-menu-list.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class NewMenuListComponent implements OnInit {

  @Input() menulistNEW: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  baseImg: any;
  childFlag: boolean = false;


  constructor(public globalObjects: GlobalObjectsService, private sqlServ: SqlLiteService, private sanitizer: DomSanitizer) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"new-menu-list")
    }
  }

  ngOnInit() {

    if (this.menulistNEW.apps_icon_name) {
      var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.menulistNEW.apps_icon_name + '&appTheme=' + this.globalObjects.appTheme

      this.sqlServ.getImageFromLocal(this.menulistNEW, val).then((res: any) => {
        this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
      });
    }

  }

  buttonClick(event) {
    this.menulistNEW.rightClickFlag = false;
    this.emitPass.emit(this.menulistNEW);
  }

  onRightClick(event) {
    event.preventDefault();
    this.menulistNEW.rightClickFlag = true;
    this.emitPass.emit(this.menulistNEW);
  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
  }

  img() {
    var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.menulistNEW.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme
    return val
  }

}
