import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-super-header-bar',
  templateUrl: './super-header-bar.component.html',
  styleUrls: ['./super-header-bar.component.scss'],
})
export class SuperHeaderBarComponent implements OnInit {

  @Input() upArrowon: boolean = true;
  @Input() userDetails: any;
  @Input() toggleNotification: boolean;
  @Input() notificationCount: any;
  @Input() toggleSideMenu: boolean = true;
  platformFlag: any;
  @Input() object_mast: any;
  @Input() page_no: number = 0;
  @Output() offPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() openNotificationemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() AdminNewemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() AdminNewmobileemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onImgErroremit: EventEmitter<any> = new EventEmitter<any>();
  @Output() UserRoleemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() Moduleclickemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() openObjectEditorPageemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchGlobalemit: EventEmitter<any> = new EventEmitter<any>();

  search_item: any;
  search_frames = [];

  logoName = 'ERP';

  constructor(public globalObjects: GlobalObjectsService, public lhs_lib: LhsLibService, public dataService: DataService, private sqlLiteServ: SqlLiteService, public platform: Platform) {
    if (this.globalObjects.layoutFlag) {
      return applyLoggingDecorator(this, "super-header-bar")
    }
  }

  ngOnInit() {
  console.log(this.userDetails)
    if (!this.globalObjects.layoutObject) {
      this.sqlLiteServ.getById('layout_object_mast', 'object_master').then(data => {
        if (data.resStatus == 'Success') {
          this.globalObjects.layoutObject = JSON.parse(data.resData.objMast);
          this.getFrameData();
        }
      });
    } else {
      this.getFrameData();
    }
    if (this.platform.is('ios')) {
      this.platformFlag = 'ios';
    } else if (this.platform.is('android')) {
      this.platformFlag = 'android';
    } else {
      this.platformFlag = 'browser';
    }


    this.logoName = this.globalObjects.getLocallData('app_type');

  }

  getFrameData() {
    if (this.globalObjects.layoutObject) {
      for (let pageData of this.globalObjects.layoutObject) {
        for (let page of pageData.Level2) {
          for (let frame of page.Level3) {
            if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'LAYOUT_OPTION') {

              for (let itemGrp of frame.Level4) {
                for (let item of itemGrp.Level5) {
                  if (item.item_name == 'SYS_GLOBAL_SEARCH') {
                    item.object_code = item.calling_object_code;
                    this.search_item = item;
                    return;
                  }
                }
              }

            }
          }
        }
      }
    }
  }

  openNotification() {
    this.openNotificationemit.emit();
  }
  AdminNew(event) {
    this.AdminNewemit.emit(event);
  }
  AdminNewmobile() {
    this.AdminNewmobileemit.emit();
  }


  onImgError(event) {
    // this.onImgErroremit.emit(event);
  }
  openObjectEditorPage(event) {
    this.openObjectEditorPageemit.emit(event);
  }
  // UserRole(event) {
  //   this.UserRoleemit.emit(event);
  // }

  Moduleclick() {
    this.Moduleclickemit.emit();
  }


  @HostListener('window:keydown.alt.q', ['$event'])
  handleKeyShortcut(event: KeyboardEvent) {

    event.preventDefault();
    if (this.search_item) {
      this.searchGlobal(this.search_item);

    }
  }



  searchGlobal(event) {
    event.popup_class = 'global_search';

    this.searchGlobalemit.emit(event);
  }
  terminate() {
    this.dataService.terminateAllRequest()
    this.globalObjects.hideLoadingSide()
  }

  right_bar() {
    this.offPass.emit();
  }
}
