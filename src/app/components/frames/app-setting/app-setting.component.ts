import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular/standalone';
import { ChangePasswordPage } from 'src/app/pages/change-password/change-password.page';
import { LookAndFeelPage } from 'src/app/pages/look-and-feel/look-and-feel.page';
import { SettingPage } from 'src/app/pages/setting/setting.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { UserauthenticationService } from 'src/app/services/userauthentication.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-app-setting',
  templateUrl: './app-setting.component.html',
  styleUrls: ['./app-setting.component.scss'],
  imports: [STANDALONE_IMPORTS]
})
export class AppSettingComponent implements OnInit {

  userDetails: any;

  showFlag: boolean = false;
  connectionSpeed: any;

  constructor(public globalObjects: GlobalObjectsService,
    private navCtrl: NavController, public lhs_lib: LhsLibService,
    private sqlServ: SqlLiteService, public platform: Platform,
    public modalCtrl: ModalController, private events: Events,
    private router: Router, private popoverController: PopoverController,
    private userServ: UserauthenticationService) {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if (this.globalObjects.frameFlag) {
      return applyLoggingDecorator(this, "app-setting-frame")
    }
  }

  ngOnInit() {
    this.globalObjects.MeasureConnectionSpeed().then(res => {
      this.connectionSpeed = res;
    })
    this.globalObjects.connectionType();
  }

  openObj() {
    this.events.publish("open_object");
    this.dismissModal();
  }
  signalRefresh() {
    this.globalObjects.checkAndSetScopeUrl().then(() => {
      this.globalObjects.displayCordovaToast("Connected..");
    }, () => { })
    this.dismissModal();
  }

  async settings() {
    const modal = await this.modalCtrl.create({
      component: SettingPage,
    });
    this.dismissModal();
    return await modal.present();
  }


  async lookfeel() {
    const modal = await this.modalCtrl.create({
      component: LookAndFeelPage,
    });
    this.dismissModal();
    return await modal.present();

  }


  switchToCollection() {
    this.globalObjects.fabMannualMode = false;
    this.globalObjects.notiBellMannualMode = false;
    this.globalObjects.destroyLocalData("apptype");
    this.globalObjects.destroyLocalData("scopeUrl");
    this.globalObjects.destroyLocalData("valueFormat");
    this.globalObjects.destroyLocalData("partyName");
    this.globalObjects.destroyLocalData("partyCode");
    this.globalObjects.destroyLocalData("tabParam");
    this.globalObjects.destroyLocalData("localNotif");
    this.globalObjects.destroyLocalData("archieve_Data");
    this.globalObjects.destroyLocalData("LoginUserAccCode");
    this.globalObjects.destroyLocalData("app-theme");
    this.globalObjects.destroyLocalData("");
    this.navCtrl.navigateRoot('appkey-collection');
    this.sqlServ.deleteAllObject();
  }


  proceedLogin() {
    var responseData = null;
    let parentAppkey = this.globalObjects.parentAppkey;

    let userDetails = this.globalObjects.getLocallData("userDetails");
    if (userDetails) {
      this.router.navigate(['super']);
    } else if (this.globalObjects.simpleLoginProcess) {
      this.router.navigate(['appkey-validation']);
    } else {
      this.userServ.getParentAppkeyCollection(parentAppkey.toUpperCase()).then(() => {
        let appdata = this.globalObjects.getLocallData("appDataMain");
        for (let data of appdata) {
          if (data.appkey.toLowerCase() == parentAppkey.toLowerCase()) {
            responseData = data.resData;
            if (responseData.server_url && responseData.server_url.indexOf('http') > -1) {

              var server_url = responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            } else {
              var server_url = "http://" + responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            }

            this.globalObjects.setDataLocally("appKey", responseData.appkey.toUpperCase());
            this.globalObjects.setDataLocally("app_name", responseData.app_name);
            this.globalObjects.setDataLocally("appCode", "");
            if (responseData.server_url2 && responseData.server_url2.indexOf('http') > -1) {
              var server_url2 = responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            } else {
              var server_url2 = "http://" + responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            }
            if (responseData.server_url3 && responseData.server_url3.indexOf('http') > -1) {
              var server_url3 = responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            } else {
              var server_url3 = "http://" + responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            }
            if (responseData.server_url3 && responseData.server_url3.indexOf('http') > -1) {
              var server_url4 = responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            } else {
              var server_url4 = "http://" + responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
            }
            this.globalObjects.setDataLocally("parentAppkey", responseData.appkey);
            this.globalObjects.setDataLocally("isAppLaunch", true);

            this.globalObjects.setDataLocally("server_url1", server_url);
            this.globalObjects.setDataLocally("server_url2", server_url2);
            this.globalObjects.setDataLocally("server_url3", server_url3);
            this.globalObjects.setDataLocally("server_url4", server_url4);
            this.globalObjects.setDataLocally("dbName", responseData.dbName);
            this.globalObjects.setDataLocally("webapplink", responseData.webapplink);
            this.globalObjects.applogo = responseData.icon_img;
            this.globalObjects.checkAndSetScopeUrl().then(() => {

            })

            this.globalObjects.setDataLocally("device_validation", "");
          }
        }
      }, (err) => {
        alert("Unable to get appkey details. Please contact to administrator.")
      })

    }

  }

  logout() {
    this.globalObjects.callingPara = [];
    this.globalObjects.fabMannualMode = false;
    this.globalObjects.notiBellMannualMode = false;
    this.globalObjects.destroyLocalData("userDetails");
    this.globalObjects.destroyLocalData("sidemenulov");
    this.globalObjects.destroyLocalData("webapplink");
    this.globalObjects.destroyLocalData("item_history");
    this.globalObjects.destroyLocalData("refreshedObj");
    this.globalObjects.destroyLocalData("clickedItem");
    this.globalObjects.destroyLocalData("iudLocal");
    this.globalObjects.destroyLocalData("loginFlag");
    this.globalObjects.destroyLocalData("roleUser");
    if (!this.globalObjects.simpleLoginProcess) {
      this.globalObjects.clearLocalStorage();
      this.proceedLogin();
      this.navCtrl.navigateRoot('').then(() => {
      });
    } else {
      this.navCtrl.navigateRoot('appkey-validation').then(() => {
      });
    }
    this.sqlServ.deleteAllObject();
    this.dismissModal();
  }
  popupClose(event) {

    let obj = {
      role: event
    }
    console.log(obj)

    this.popoverController.dismiss(obj);
    this.dismissModal();

  }

  dismissModal() {
    this.popoverController.dismiss();
  }


  async openChangePassword() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordPage,
    });
    modal.onDidDismiss().then(() => {
    });
    return await modal.present();
  }

}
