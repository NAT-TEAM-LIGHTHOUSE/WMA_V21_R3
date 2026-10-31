import { Component, EventEmitter, OnInit, Output, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { PatchMessagesComponent } from '../patch-messages/patch-messages.component';
import { isPlatformServer } from '@angular/common';
import { EncryptionService } from 'src/app/services/encryption.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { HttpClient } from '@angular/common/http';
import { LeftbaritemPipe } from 'src/app/pipes/leftbar/leftbaritem-pipe';
import { QuickActionModalComponent } from '../quick-action-modal/quick-action-modal.component';
import { SystemHealthPanelComponent } from '../system-health-panel/system-health-panel.component';

@Component({
  standalone: true,
  imports: [STANDALONE_IMPORTS, LeftbaritemPipe],
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss'],
})
export class LeftBarComponent implements OnInit {
  developerModeData: any;
  sqlStudionFlag: boolean = false;
  @Output() offPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() reminderLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() notesLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() quick_action_clicked: EventEmitter<any> = new EventEmitter<any>();
  isLeftBarOnMobile = false
  userDetails: any
  plt: any;
  constructor(private http: HttpClient, private encryptionService: EncryptionService, private dataservice: DataService, public globalobjects: GlobalObjectsService, private canvasModal: CanvasModalService, private platform: Platform, private iab: InAppBrowser, private modalCtrl: ModalController, private modalGlobal: CanvasModalService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    if (this.globalobjects.layoutFlag) {
      return applyLoggingDecorator(this, "left-bar")
    }
  }

  ngOnInit() {
    this.userDetails = this.globalobjects.getLocallData("userDetails");
    this.sqlStudionFlag = this.userDetails.G_SQL_STUDIO;
    console.log("layout code", this.globalobjects.layoutObject);
    if (this.platform.is('android')) {
      this.plt = 'android';
    } else if (this.platform.is('ios')) {
      this.plt = 'ios';
    } else {
      this.plt = 'browser';
    }
  }

  openApplication(item) {
    if (this.isLeftBarOnMobile) {
      this.canvasModal.popDismiss(item, "openApplication")
    } else {
      this.emitPass.emit(item);
    }
  }

  notificationLinks(item) {
    if (this.isLeftBarOnMobile) {
      this.canvasModal.popDismiss(item, "openoffLeftCanvasObject")
    } else {
      this.offPass.emit(item);
    }
  }

  reminderLinks(item) {
    item.title = "Reminder";
    item.id = "offcanvasRightreminderlink";
    if (this.isLeftBarOnMobile) {
      this.canvasModal.popDismiss(item, "openoffCanvasObject")
    } else {
      this.reminderLinksemit.emit(item);
    }
  }

  notesLinks(item) {
    item.title = "Notes";
    item.id = "offcanvasRightnoteslink";
    if (this.isLeftBarOnMobile) {
      this.canvasModal.popDismiss(item, "openoffCanvasObject")
    } else {
      this.notesLinksemit.emit(item);
    }
  }

  quick_action_button(item) {
    this.quick_action_clicked.emit(item);
  }
  async showDeveloperData(item) {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: item.apps_page_frame_seqid,
      item_seq_id: item.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: item,
        runEvents: item.runEventsa
      }
    });
    return await modal.present();
  }

  openLHSCARE(item, encodedString) {
    let defaultUrl = item.item_default_value;
    let g_acc_year = this.userDetails.g_acc_year;
    // let appKey = 'LHSCAREV7';
    // let user_code= this.userDetails.user_code;
    // let password = '';
    // let group_code = this.userDetails.g_group_code;

    // let lhscareString = appKey + '###'+ user_code + '###' + password + '###' + group_code;
    // const encodedString = this.encryptionService.encryptData(lhscareString);
    let newUrl = this.userDetails.g_lhscare_url ? this.userDetails.g_lhscare_url + '/#/SSONEW/' + encodeURIComponent(encodedString) : defaultUrl + '/#/SSONEW/' + encodeURIComponent(encodedString);
    // const url = "http://192.168.100.21:8888/WMAUAT";
    // const url = "http://192.168.100.87:8101";

    // let newUrl = url + '/#/SSONEW/' + encodeURIComponent(encodedString);
    // let newUrl = defaultUrl  ? defaultUrl + '/#/sso/'+ encodedString : this.userDetails.G_LHSCARE_URL + '/#/sso/'+ encodedString;
    // let newUrl = this.userDetails.lhscare_url + '/#/sso/'+ encodedString;

    // this.getToken();

    if (this.platform.is('android')) {
      this.iab.create(newUrl, '_blank', {
        location: 'yes',
        toolbar: 'yes',
        hideurlbar: 'yes',
        clearcache: 'yes',
        clearsessioncache: 'yes'
      });
    } else {
      // For browser / iOS fallback
      window.open(newUrl, '_blank');
      // window.open(newUrl, '_self');
    }
  }

  getToken(item) {
    let user_code = this.encryptionService.encryptData(this.userDetails.user_code);
    let user_pass = this.encryptionService.encryptData('');
    let code = this.globalobjects.getLocallData("g_group_code");
    let group_code = this.encryptionService.encryptData(code);
    let app_key = this.encryptionService.encryptData('LHSCAREV7TEST');
    let entity_code = this.encryptionService.encryptData('');
    let url = this.globalobjects.getLocallData("scopeUrl");
    // alert("Getting token from : "+code);
    // let finalUrl = `http://192.168.100.156:8888/lhsws_wma/${group_code}/${app_key}/${entity_code}/${user_code}/${user_pass}/T/sso/auth/token`;
    const domain = new URL(url).origin;
    console.log("Domain extracted from URL:", domain);
    let finalUrl = `${domain}/lhsws_wma2/${group_code}/${app_key}/${entity_code}/${user_code}/${user_pass}/T/sso/auth/token`;
    // let finalUrl = `${url}lhscare/gettoken/${group_code}/${appKey}/${user_code}/${password}`;
    let body = {
      G_ACC_YEAR: this.userDetails.G_ACC_YEAR,
      G_LY_YRBEGDATE: this.userDetails.G_LY_YRBEGDATE,
      G_LY_YRENDDATE: this.userDetails.G_LY_YRENDDATE,
      G_YRBEGDATE: this.userDetails.G_YRBEGDATE,
      G_YRENDDATE: this.userDetails.G_YRENDDATE,
      G_GROUP_CODE: this.globalobjects.getLocallData("g_group_code"),

    };
    this.http.post(finalUrl, body).subscribe(
      (response: any) => {
        console.log('Token retrieval successful:', response);
        const directLoginToken = response?.responseData?.token || response?.token || response?.data?.token;
        if (directLoginToken) {
          // this.router.navigate(['sso', directLoginToken]);
          this.openLHSCARE(item, directLoginToken);
        } else {
          console.error('Token not found in response object:', response);
        }
      },
      (error) => {
        console.error('Token retrieval failed:', error);
      }
    );
  }


  openPatchMessages() {
    let component = PatchMessagesComponent
    let componentProps = ""
    let id = "patch-messages-modal"
    let cssClass = ""
    let title = "Alerts"
    this.modalGlobal.openModal(component, componentProps, id, cssClass, "", "", "", title).then((detail) => {
    })

  }

  // async openSystemHealth() {
  //   const modal = await this.modalCtrl.create({
  //     component: SystemHealthPanelComponent,
  //     cssClass: 'offcanvasRight',
  //     breakpoints: [0, 0.75, 1],
  //     initialBreakpoint: 0.75,
  //     handle: true,
  //   });
  //   await modal.present();
  // }
  



  openSystemHealth() {
    let id = 'offcanvasLeftnotificationLink';
    let cssClass = 'offcanvasLeft';
    let title = ""
    let componentProps = {
      test: "notification"
    }
    this.canvasModal.openoffCanvas(SystemHealthPanelComponent, componentProps, id, cssClass, title)
  }
  sqlStudioTabRef: any = null;
  sqlStudioUrl: string = '';

  openSqlStudio() {

    const url = "getSQLStudioUrl";

    const dbDetails = this.globalobjects.getLocallData("scopeUrl");
    const userDetails = this.globalobjects.getLocallData("userDetails");

    const dbConfig = {
      scopeUrl: dbDetails,
      wma_user_code: userDetails.wma_user_code,
      g_emp_code: userDetails.g_user_code,
      user_type: userDetails.g_user_type,
      user_code: userDetails.user_code,
      login_session_id: userDetails.login_session_id,
      wma_user_name: userDetails.wma_user_name,
      mobile: userDetails.mobile,
      client_browser: userDetails.client_browser,
      client_address: userDetails.client_address,
      appkey: userDetails.appkey
    };

    // If we already have the URL
    if (this.sqlStudioUrl) {

      this.sqlStudioTabRef = window.open(
        this.sqlStudioUrl,
        'SQLStudioTab'
      );

      if (this.sqlStudioTabRef) {
        this.sqlStudioTabRef.focus();
      }

      return;
    }

    // Get SQL Studio URL
    this.dataservice.postData(url, dbConfig).then((res: any) => {

      if (res.responseStatus === 'success') {

        const link = res.responseData.embed_link;

        this.sqlStudioUrl = link;

        // IMPORTANT:
        // Use a fixed tab name instead of _blank
        this.sqlStudioTabRef = window.open(
          link,
          'SQLStudioTab'
        );

        if (this.sqlStudioTabRef) {
          this.sqlStudioTabRef.focus();
        }

        console.log("SQL Studio URL:", link);

      } else {
        console.error("Failed to load SQL Studio");
      }

    }).catch((err) => {
      console.error("Error loading SQL Studio:", err);
    });
  }

  QuickActionModal(event, frame?) {
    let component = QuickActionModalComponent
    let componentProps = { frame }
    let id = "quickactionmodel"
    let cssClass = "maction_modal"
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((detail) => {
      if (detail.data == 'sqlStudionFlag') {
        this.openSqlStudio();
      } else {
        if (detail.data.isQuickAction) {
          this.quick_action_button(detail.data)
        } else {
          let item = detail.data;
          if (item.item_name == 'SYS_CALENDAR' || item.item_name == 'SYS_APPLICATION') {
            this.openApplication(item);
          }
          else if (item.item_name == 'SYS_NOTIFICATION') {
            this.notificationLinks(item);
          }
          else if (item.item_name == 'SYS_MEMO' || item.item_name == 'SYS_NOTES') {
            this.notesLinks(item)
          }
          else if (item.item_name == 'SYS_LHSCARE') {
            this.getToken(item)
          }else{
            this.openApplication(item);
          }
        }
      }
    })
  }
}
