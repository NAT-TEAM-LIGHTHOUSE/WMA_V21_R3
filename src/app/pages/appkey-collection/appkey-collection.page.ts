import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';



import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, MenuController, ModalController, NavController, Platform } from '@ionic/angular/standalone';
import { BackgroundService } from 'src/app/services/background.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { UserauthenticationService } from 'src/app/services/userauthentication.service';
// import { UsersettingPage } from '../usersetting_old/usersetting.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { UsersettingPage } from '../usersetting/usersetting.page';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
  selector: 'app-appkey-collection',
  templateUrl: './appkey-collection.page.html',
  styleUrls: ['./appkey-collection.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,STANDALONE_IMPORTS]
})
export class AppkeyCollectionPage implements OnInit {

  appData: any = [];
  isProcessing: boolean = false;
  loginCredentials: any;
  online: boolean = true;
  public loginValid: any = {};
  OTPCode: any;
  constructor(private navCtrl: NavController, public globalObjects: GlobalObjectsService, private modalCtrl: ModalController, public platform: Platform,
     private backgroundService: BackgroundService,
    public alertController: AlertController, private router: Router, public menuCtrl: MenuController, private location: Location, public dataService: DataService,
    private events: Events, public userAuth:UserauthenticationService) {
      if(this.globalObjects.pagesFlag){
        return applyLoggingDecorator(this,"appkey-collection")
      }
  }

  ngOnInit() {
    this.appData = this.globalObjects.getLocallData('appData');
    console.log(this.appData + "Appdata for Appkey")
    console.log("appdata ..>>", this.appData)
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  addApp() {
    this.router.navigate(['appkey-validation']);
  }

  goBack() {
    this.location.back();
  }
  async removeApp(i) {
    const alert = await this.alertController.create({
      header: 'Are you sure want to remove this App!',
      message: 'Remove App ?',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss(false);
          }
        }, {
          text: 'Yes',
          handler: (data) => {
            this.appData.splice(i, 1);
            this.globalObjects.setDataLocally('appData', this.appData);
            this.appData = this.globalObjects.getLocallData('appData')
          }
        }
      ]
    });
    await alert.present();
  }

  selectAppkey(app) {
    let userDetails = this.globalObjects.getLocallData("userDetails");
    if(userDetails){
      let user = {
        user_code : userDetails.user_code,
        password : userDetails.password
      }
      this.globalObjects.setDataLocally("tempUser",user);
    }
    this.userAuth.selectAppkey(app);
  }


  doLogin() {
    this.loginCredentials = this.globalObjects.getLocallData("tempUser");
    if (this.loginCredentials) {
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
      let url = 'login?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(this.loginCredentials.password) +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
        + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
        + "&location=" + encodeURIComponent(JSON.stringify(loc_address));
      this.isProcessing = true;
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
                console.log("GPS permission granted");
                this.validatePlatform(loginFlag);
              }, (err) => {
                this.globalObjects.presentAlert("You can not access app without location permission. Please allow location permission.");
              })
            } else {
              this.validatePlatform(loginFlag);
            }

            if (this.loginValid.responseData.massege) {
              this.globalObjects.presentAlert(this.loginValid.responseData.massege);
            }
            this.globalObjects.destroyLocalData("tempUser");
          }
          else {
            this.globalObjects.destroyLocalData("tempUser");
            this.globalObjects.presentAlert(this.loginValid.responseMsg);
          }

          this.isProcessing = false;
        }, err => {
          this.globalObjects.destroyLocalData("tempUser");
          this.globalObjects.presentAlert(JSON.stringify(err));
          this.isProcessing = false;
          this.globalObjects.displayCordovaToast("");
        })
      } else {

        this.isProcessing = false;
        this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
      }
    } else {
      this.router.navigate(['login']);
    }
  }

  getAppkeyCollection() {
    let platform;
    if (this.platform.is('ios')) {
      platform = "ios";

    } else if (this.platform.is('android')) {
      platform = "android";
    } else {
      platform = "browser"
    }
    let url = "getAppkeyCollection?userCode=" + this.loginCredentials.user_code;
    console.log("final url : "+url);
    this.dataService.getData(url).then((data: any) => {
      if (data.responseStatus == "success") {
        let appKeyColl = data.responseData;
        let url1 = "getListOfServerDetails"
        let reqData = {
          "parameters": {
            "appKey": appKeyColl,
            "device_id": this.globalObjects.device.uuid,
            "device_name": this.globalObjects.device.model,
            "platform": platform
          }
        }
        this.dataService.postDataLhsServer(url1, reqData).then((data1: any) => {
          if (data1.responseStatus == "success") {
            for (let resData of data1.responseData) {


              var appData: any = {};
              appData.app_name = resData.responseData.app_name;
              appData.appkey = resData.responseData.appkey;
              appData.loginFlag = resData.responseData.loginFlag;
              appData.resData = resData.responseData;
              var appArr: any = this.globalObjects.getLocallData("appData");
              if (appArr) {
                let isExsist = false;
                for (let app of appArr) {
                  if (app.appkey.toUpperCase() == resData.responseData.appkey) {
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
            }
            this.router.navigate(['appkey-collection']);
          }
        })
      } else {
        this.globalObjects.presentAlert(data.responseMsg);
      }
    })
  }

  validatePlatform(loginFlag) {
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

  changeSetting() {
    this.router.navigate(['ChangeServerSettingPage']);
  }

  updateApp() {
    this.globalObjects.presentAlert('Updating App');
  }

  inputType = 'password';
  iconName = 'eye-off';

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }
  forgotPassword() {
    this.router.navigate(['forgot-password']);
  }

  login() {
    if (this.loginValid.responseStatus === "success") {
      this.globalObjects.setDataLocally('licExp', 1);

      this.loginValid.responseData.password = this.loginCredentials.password


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
    

      this.globalObjects.setDataLocally("apptype", this.loginValid.responseData.module);
      this.events.publish("GET_SIDE_MENU_DATA", "LHS");

      let pcnt = this.loginValid.responseData.global_parameter_page_cnt ? this.loginValid.responseData.global_parameter_page_cnt : 0;
     
      if(parseInt(pcnt)>0){
         
          this.popoveruser().then(() => { 
            
          });
      }else{
       
        this.navCtrl.navigateRoot('super');
      
      }
    }
  }

  async popoveruser() {
    let popUp = await this.modalCtrl.create({
      component: UsersettingPage,
      componentProps: {
        userValueList: this.globalObjects.userValueListfromglobal
      },
      backdropDismiss: true
    });
    popUp.present();
   
  }
}
