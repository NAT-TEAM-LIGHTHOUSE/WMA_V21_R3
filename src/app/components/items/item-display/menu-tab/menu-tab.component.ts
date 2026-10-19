import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class MenuTabComponent implements OnInit {

  @Input() menutab: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  imgUrl: any;
  baseImg: any;
  constructor(public globalObjects: GlobalObjectsService, private sqlServ: SqlLiteService, private sanitizer: DomSanitizer, private events: Events) {
    if (this.globalObjects.itemFlag) {
      return applyLoggingDecorator(this, "menu-tab")
    }
  }

  ngOnInit() {
    if (this.menutab.apps_icon_name) {

      if (this.menutab.apps_icon_name.toLowerCase() == 'sys_icon') {
        this.baseImg = './assets/imgs/no_image.png';
      } else {
        this.imgUrl = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.menutab.apps_icon_name + '&appTheme=' + this.globalObjects.appTheme;

        this.sqlServ.getImageFromLocal(this.menutab, this.imgUrl).then((res: any) => {
          this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
        });
      }
    }
  }


  img() {
    var val = this.imgUrl;
    return val
  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
  }

  buttonClick(event) {
    this.menutab.rightClickFlag = false;
    this.emitPass.emit(this.menutab);
  }

  onRightClick(event) {
    event.preventDefault();
    this.menutab.rightClickFlag = true;
    this.emitPass.emit(this.menutab);
  }
}
