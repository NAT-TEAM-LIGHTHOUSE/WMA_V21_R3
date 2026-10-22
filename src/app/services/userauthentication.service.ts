import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular/standalone';
// import { UsersettingPage } from '../pages/usersetting_old/usersetting.page';
import { BackgroundService } from './background.service';
import { DataService } from './data.service';
import { Events } from './events';
import { GlobalObjectsService } from './global-objects.service';
import { applyLoggingDecorator } from './decorator-application';
// import { EncryptDecryptService } from './encrypt-decrypt.service';
import { EncryptionService } from './encryption.service';
import { UsersettingPage } from '../pages/usersetting/usersetting.page';
import { ResetPasswordComponent } from '../components/layout/reset-password/reset-password.component';

@Injectable({
  providedIn: 'root'
})
export class UserauthenticationService {
  appData: any = [];
  isProcessing: boolean = false;
  loginCredentials: any;
  online: boolean = true;
  public loginValid: any = {};
  OTPCode: any;
  isProcessingLogin: boolean = false;

  constructor(private globalObjects: GlobalObjectsService, private dataService: DataService, private platform: Platform, private popOverCtrl: PopoverController,
    private backgroundService: BackgroundService, private encryption: EncryptionService, private navCtrl: NavController, private router: Router, private modalCtrl: ModalController,
    private events: Events) {
    if (this.globalObjects.serviceFlag) {
      return applyLoggingDecorator(this, "userauthentication-service")
    }
  }

  selectAppkey(app) {
    return new Promise((resolve, reject) => {
      if (app && !this.isProcessing) {
        this.isProcessing = true;
       this.globalObjects.setDataLocally("appKey", app.appkey.toUpperCase());
        this.globalObjects.setDataLocally("app_name", app.app_name);
        this.globalObjects.setDataLocally("appCode", app.resData.appcode);
        if (app.resData.tenantId) {
          this.globalObjects.setDataLocally("tenantId", app.resData.tenantId);
        } else {
          this.globalObjects.setDataLocally("tenantId", app.resData.dbName);
        }
        if (app.resData.default_theme) {
          this.globalObjects.appTheme = app.resData.default_theme;
          this.globalObjects.setDataLocally("theme", app.resData.default_theme);
        }
        if (app.resData.serverUrl && app.resData.serverUrl.indexOf('http') > -1) {
          var server_url = app.resData.serverUrl + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
        } else {
          var server_url = "http://" + app.resData.serverUrl + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
        }
        if (app.resData.server_url2 && app.resData.server_url2.indexOf('http') > -1) {
          var server_url2 = app.resData.server_url2 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
        } else {
          var server_url2 = "http://" + app.resData.server_url2 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
        }
        if (app.resData.server_url3 && app.resData.server_url3.indexOf('http') > -1) {
          var server_url3 = app.resData.server_url3 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
        } else {
          var server_url3 = "http://" + app.resData.server_url3 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
        }
        if (app.resData.server_url4 && app.resData.server_url4.indexOf('http') > -1) {
          var server_url4 = app.resData.server_url4 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
        } else {
          var server_url4 = "http://" + app.resData.server_url4 + "/" + app.resData.war_name + "/" + app.resData.entity + "/" + app.resData.dbUrl + "/" + app.resData.portNo + "/" + app.resData.dbName + "/" + encodeURIComponent(app.resData.dbPassword) + "/" + app.resData.dbSid + "/";
        }
        this.globalObjects.setDataLocally("isAppLaunch", true);
        this.globalObjects.setDataLocally("scopeUrl", server_url);
        this.globalObjects.setDataLocally("server_url1", server_url);
        this.globalObjects.setDataLocally("server_url2", server_url2);
        this.globalObjects.setDataLocally("server_url3", server_url3);
        this.globalObjects.setDataLocally("server_url4", server_url4);
        this.globalObjects.setDataLocally("dbName", app.resData.dbName);
        this.globalObjects.setDataLocally("webapplink", app.resData.webapplink);
        this.globalObjects.setScopeUrl(server_url);
        this.globalObjects.setDataLocally("entity_code_str_appkey", app.resData.entity_code_str);
        this.globalObjects.setDataLocally("entity_code_appkey", app.resData.entity);

        this.globalObjects.checkAndSetScopeUrl().then(data => {
          this.doLogin().then(() => {
            resolve("");
          }, (err) => {
            reject();
          });
        }, err => {
          this.isProcessing = false;
          if(this.isProcessingLogin){
             this.isProcessingLogin = false;
          }
          reject();
        })
        this.globalObjects.setDataLocally("device_validation", app.resData.device_validation);
      }
    })
  }

  doLogin() {
    return new Promise((resolve, reject) => {
      this.loginCredentials = this.globalObjects.getLocallData("tempUser");
      let deviceValidation = this.globalObjects.getLocallData("device_validation");
      let token = this.globalObjects.getLocallData("device_token");
      let appKey = this.globalObjects.getLocallData("appKey");
      let entityCodeStr = this.globalObjects.getLocallData("entityCodeStr");
      var appDataArr: any = this.globalObjects.getLocallData("appData");
      let platform;
      if (this.platform.is('ios')) {
        platform = "ios";

      } else if (this.platform.is('android')) {
        platform = "android";
      } else {
        platform = "browser"
      }
      let latitude: any = this.backgroundService.latitude;
      let longitude: any = this.backgroundService.longitude;
      let loc_address: any;
      this.globalObjects.geoCoderLocation(latitude, longitude).then(res => {
        loc_address = res;
      }, (err) => {
      });

      var loginFlag: any;

      if (appDataArr) {
        for (let app of appDataArr) {
          if (app.appkey.toUpperCase() == appKey.toUpperCase()) {
            loginFlag = app.loginFlag;
          }
        }
      }
      if (loginFlag) {
        loginFlag = loginFlag;
      }
      else {
        loginFlag = "";
      }
      entityCodeStr = entityCodeStr ? entityCodeStr : "";
      let encyprtPassword = this.loginCredentials.password;
         let appFrontAppName = window.location.pathname.split('/').pop();
    let loginFrontUrl = window.location.origin;
      if (this.loginCredentials.password) {
        if (this.globalObjects.urlencryptFlag) {
          encyprtPassword = this.encryption.encryptData(this.loginCredentials.password);
        }
      }
      let url = 'login?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(encyprtPassword) +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
        + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
        + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&appName=" + encodeURIComponent(appFrontAppName) + "&callingType=appkey_login" +"&loginUrl="+ loginFrontUrl;
      if (this.online) {
        this.dataService.getData(url).then(data => {
          this.loginValid = data;
          let otpCodeLoc;
          if (this.OTPCode) {
            otpCodeLoc = this.OTPCode;
          }
          else {
            otpCodeLoc = "";
          }
          if (this.loginValid.responseMsg === "User is authenticated") {

            if (this.loginValid.responseData.gps_mandatory_flag == 'Y' && (this.platform.is('ios') || this.platform.is('android'))) {
              this.globalObjects.checkGPSPermission().then(() => {
                this.validatePlatform();
              }, (err) => {
                this.globalObjects.presentAlert("You can not access app without location permission. Please allow location permission.");
              })
            } else {
              this.validatePlatform();
            }

            if (this.loginValid.responseData.massege) {
              this.globalObjects.presentAlert(this.loginValid.responseData.massege);
            }
            this.globalObjects.destroyLocalData("tempUser");
            resolve("");
          }
          else if (this.loginValid.responseMsg.includes("Q#")) {
            if (this.loginValid.responseMsg.includes("CHANGE_PASSWORD:")) {
              //  [, this.newMess] = resArr[1].split(":");
              const [type, message] = this.loginValid.responseMsg.split(':');
              let dataObj: any = {
                userCode: this.loginCredentials.user_code,
                message: message
              }

              this.presentPopover(dataObj);
            }
            else if (this.loginValid.responseMsg.includes("NEW_PASSWORD:")) {
               this.globalObjects.setDataLocally("User", this.loginCredentials.user_code);
              const [type, message] = this.loginValid.responseMsg.split(':');
              let dataObj: any = {
                userCode: this.loginCredentials.user_code,
                message: message,
                passFlag: 'T'
              }

              this.presentPopover(dataObj);
            }else{

              if (this.loginValid.responseStatus === "error") {
                const message = this.loginValid.responseMsg.replace(/^Q#/, '');
                this.globalObjects.presentAlert(message);
              } else {
                this.globalObjects.presentAlert(this.loginValid.responseMsg);
              }
            }
          }


          else {
            this.globalObjects.destroyLocalData("tempUser");
            this.globalObjects.presentAlert(this.loginValid.responseMsg);
            reject();
          }
           if(this.isProcessingLogin){
             this.isProcessingLogin = false;
          }
          this.isProcessing = false;
        }, err => {
          this.globalObjects.destroyLocalData("tempUser");
          this.globalObjects.presentAlert(JSON.stringify(err));
           if(this.isProcessingLogin){
             this.isProcessingLogin = false;
          }
          this.isProcessing = false;
          this.globalObjects.displayCordovaToast("");
          reject();
        })
      } else {

        this.isProcessing = false;
        if(this.isProcessingLogin){
          this.isProcessingLogin = false;
        }
        this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
        reject();
      }
    })
  }


  async presentPopover(dataObj: any) {
    const popover = await this.popOverCtrl.create({
      component: ResetPasswordComponent,
      componentProps: { dataObj: dataObj },
      // event: ev,
      id: 'resetPasswordNew',
      translucent: true,
      backdropDismiss: true // Allows dismiss by clicking outside
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log(`Popover dismissed with role: ${role}`);
  }
  validatePlatform() {
    if (this.platform.is('android')) {
      if (this.loginValid.responseData.android_access != 'N' || this.loginValid.responseData.android_access == 'Y') {
        this.login();
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an android device.");
      }
    }
    else if (this.platform.is('ios')) {
      if (this.loginValid.responseData.ios_access != 'N' || this.loginValid.responseData.ios_access == 'Y') {
        this.login();
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an ios device.");
      }
    } else {
      if (this.loginValid.responseData.web_access != 'N' || this.loginValid.responseData.web_access == 'Y') {
        this.login();
      }
      else {
        this.globalObjects.presentAlert("You do not have rights to access web app.");
      }
    }
  }

  login() {
    if (this.loginValid.responseStatus === "success") {
      this.globalObjects.setDataLocally('licExp', 1);
      // this.loginValid.responseData.password = this.loginCredentials.password
      this.loginValid.responseData.appkey = this.globalObjects.getLocallData("appKey");
      if (this.platform.is('ios')) {
        this.loginValid.responseData.platform = 'ios';
      }
      else if (this.platform.is('android')) {
        this.loginValid.responseData.platform = 'android';
      } else {
        this.loginValid.responseData.platform = 'browser';
      }
      this.loginValid.responseData.login_device_id = this.globalObjects.device.uuid;
      this.loginValid.responseData.login_device_model = this.globalObjects.device.model;
      this.loginValid.responseData.first_login_time = new Date().getTime();

      let scopeUrl = this.globalObjects.getLocallData("scopeUrl");
      this.loginValid.responseData.app_login_url = scopeUrl;
      this.loginValid.responseData.g_app_login_url = scopeUrl;
      this.globalObjects.setDataLocally("userDetails", this.loginValid.responseData);

      this.globalObjects.setDataLocally("apptype", this.loginValid.responseData.module);

      var appData: any = {};
      appData.app_name = this.loginValid.responseData.app_name ? this.loginValid.responseData.app_name : "";
      appData.appkey = this.loginValid.responseData.appkey ? this.loginValid.responseData.appkey : "";
      appData.loginFlag = this.loginValid.responseData.loginFlag ? this.loginValid.responseData.loginFlag : "";

      appData.resData = this.loginValid.responseData;
      var appArr: any = this.globalObjects.getLocallData("appData");
      if (appArr) {
        let isExsist = false;
        for (let app of appArr) {
          if (app.appkey.toUpperCase() == this.loginValid.responseData.appkey) {
            app = JSON.parse(JSON.stringify(appData));
            isExsist = true;
          }
        }
        if (!isExsist) {
          appArr.push(appData);
        }
        this.globalObjects.setDataLocally("appData", appArr);
      } else {
        appArr = [];
        appArr.push(appData);
        this.globalObjects.setDataLocally("appData", appArr);
      }

      this.events.publish("GET_SIDE_MENU_DATA", "LHS");
      let pcnt = this.loginValid.responseData.global_parameter_page_cnt ? this.loginValid.responseData.global_parameter_page_cnt : 0;

      if (parseInt(pcnt) > 0) {
        this.popoveruser().then(() => {
        });
      } else {
        this.globalObjects.setDataLocally("loginFlag", true);
        setTimeout(() => {
          this.getAppHeaderData().then(() => {
            this.navCtrl.navigateRoot('super');
          })
        }, 1000);
      }
    }
  }

  async popoveruser() {
    let popUp = await this.modalCtrl.create({
      component: UsersettingPage,
      id: 'Usersetting-deskmodel',
      componentProps: {
        userValueList: this.globalObjects.userValueListfromglobal,
        flag: false,
        comeFromLogin: true
      },
      backdropDismiss: false
    });
    popUp.present();

  }

  getParentAppkeyCollection(appkey) {
    return new Promise((resolve, reject) => {
      // let reqData = {
      //   "parentAppkey": appkey
      // }


      // new code 
      let urlencryptFlag = this.globalObjects.urlencryptFlag;
      let reqData = {
        "parentAppkey": appkey,
        "urlencryptFlag": urlencryptFlag ? "T" : "F"
      }
      // end code

      let url = "getParentAppkeyCollection";

      this.isProcessing = true;
      this.dataService.postDataLhsServer(url, reqData).then((data1: any) => {
        let isresolve = false;
        if (data1.responseStatus == "success") {
          if (data1.responseData) {
            this.isProcessing = false;
            isresolve = true;
            let i = 1;
            for (let resData of data1.responseData) {
              var appData: any = {};
              appData.app_name = resData.app_name ? resData.app_name : "";
              appData.appkey = resData.appkey ? resData.appkey : "";
              appData.loginFlag = resData.loginFlag ? resData.loginFlag : "";

              appData.resData = resData;
             let group_code = resData.g_group_code ? resData.g_group_code : "";
             this.globalObjects.setDataLocally("g_group_code", group_code);
              var appArr: any = this.globalObjects.getLocallData("appDataMain");
              if (appArr) {
                let isExsist = false;
                for (let app of appArr) {
                  if (app.appkey.toUpperCase() == resData.appkey) {
                    app = JSON.parse(JSON.stringify(appData));
                    isExsist = true;
                  }
                }
                if (!isExsist) {
                  appArr.push(appData);
                }
                this.globalObjects.setDataLocally("appDataMain", appArr);
              } else {
                appArr = [];
                appArr.push(appData);
                this.globalObjects.setDataLocally("appDataMain", appArr);
              }
              if (i == data1.responseData.length) {
                resolve("");
              }
              i++;
            }
          }
        } else {
          if(isresolve)
          alert(data1.responseMsg)
        }

      }, (error) => {
        this.isProcessing = false;
        this.globalObjects.presentAlert(error);
        reject();
      })
    })

  }

  getAppHeaderData() {
    return new Promise((resolve, reject) => {

      let url = 'getAppHeader';
      let resolveStatus = false;
      let userDetails = this.globalObjects.getLocallData("userDetails");
      let reqData = {
        "wslp": userDetails
      }
      this.dataService.postData(url, reqData).then((res: any) => {
        if (res.responseStatus == 'success') {
          if (res.responseMsg && res.responseMsg.indexOf('#') > -1) {
            let resArr = res.responseMsg.split('#')
            if (resArr[0] == "Q") {
              this.globalObjects.presentAlert(resArr[1]);
            } else if (resArr[0] == "F") {
              this.globalObjects.presentAlert(res.responseMsg);
            }
          }
          let app_disp_header = res.responseData.app_disp_header ? res.responseData.app_disp_header : "";
          userDetails.app_disp_header = app_disp_header;
          this.globalObjects.setDataLocally("userDetails", userDetails);
        }
        if (!resolveStatus) {
          resolveStatus = true;
          resolve("");
        }
      }, (err) => {
        if (!resolveStatus) {
          resolveStatus = true;
          resolve("");
        }
      })

      setTimeout(() => {
        if (!resolveStatus) {
          resolveStatus = true;
          resolve("");
        }
      }, 5000)
    })
  }
}
