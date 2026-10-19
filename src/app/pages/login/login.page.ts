import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';



import {  Directive, HostListener, Inject,  PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput, MenuController, Platform, PopoverController } from '@ionic/angular/standalone';
import { BackgroundService } from 'src/app/services/background.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { UserauthenticationService } from 'src/app/services/userauthentication.service';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { AlertMsgBoxesPage } from '../alert-msg-boxes/alert-msg-boxes.page';
import { ResetPasswordComponent } from 'src/app/components/layout/reset-password/reset-password.component';
import { EncryptionService } from 'src/app/services/encryption.service';
import { isPlatformServer } from '@angular/common';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { FormatMaskPipe } from 'src/app/pipes/format-mask-pipe';
import { InputFormatMaskPipe } from 'src/app/pipes/input-format-mask.pipe';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { ColumnfilterPipe } from 'src/app/pipes/column-filter';
import { FilterColumnDataPipe } from 'src/app/pipes/filter-column-data.pipe';
import { LoadingController, ToastController,  ModalController } from '@ionic/angular/standalone';
// import { IonicModule } from '@ionic/angular/standalone';
import { NgOtpInputModule } from 'ng-otp-input';
@Directive({
  selector: "[focusDir]"
})
export class FocusDirectiveLogin {

  dataService: DataService;
  constructor(private globalObjects: GlobalObjectsService,@Inject(PLATFORM_ID) private platformId: Object) {
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "login-page")
     
    }
     
  }

  @HostListener("keyup.enter") onKeyupEnter() {
      if (isPlatformServer(this.platformId)) return;
    var nextEl = this.findNextTabStop(document.activeElement);
    nextEl.focus();
  }

  findNextTabStop(el) {
      if (isPlatformServer(this.platformId)) return;
    var universe = document.querySelectorAll(
      "input,select"
    );
    var list = Array.prototype.filter.call(universe, function (item) {
      return item.tabIndex >= "0";
    });
    var index = list.indexOf(el);
    return list[index + 1] || list[0];
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [STANDALONE_IMPORTS,NgOtpInputModule],
  providers: [ModalController,UserauthenticationService,PopoverController,FocusDirectiveLogin,BackgroundService,FormatMaskPipe,InputFormatMaskPipe,SearchfilterPipe,ColumnfilterPipe,FilterColumnDataPipe]
})
export class LoginPage implements OnInit {
  @ViewChild('autofocus') searchbar: IonInput;
  loginCredentials: any = {};
  flagForDisableLoginButton = 0;
  appkeyFlag: any;
  public loginValid: any = {};

  online: boolean = true;
  isProcessing: boolean = false;
  public shouldHeight: any
  logoentity: any;
  resStatus: boolean = false;
  upd_flag: any;
  OTPCode: any;
  userprofile: any = null;
  userDetails: any;
  appDataArr = [];
  resetPassFlag: boolean = false;
  newMess: any;
  rememberMe: boolean = false;
  isTwoFactorOtpVerify: boolean = false
  msgShowotp: any = ""
msgShowotpEM_2FA:boolean=false
  constructor(
    private alertCtrl: AlertController, private encryption: EncryptionService,
    private router: Router, public globalObjects: GlobalObjectsService, public backgroundService: BackgroundService, public popOverCtrl: PopoverController,
    public userAuth: UserauthenticationService, public dataService: DataService, private iab: InAppBrowser,
    public menuCtrl: MenuController, public platform: Platform, private route: ActivatedRoute,@Inject(PLATFORM_ID) private platformId: Object) {
      if (isPlatformServer(this.platformId)) return;
    this.shouldHeight = window.innerHeight + 'px';
  } 
  ionViewWillEnter() {
    this.loginCredentials = {};
    setTimeout(() => {
      if (this.searchbar) { this.searchbar.setFocus() }
    }, 300);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    // let applogo = this.globalObjects.getLocallData("icon_img");
    this.globalObjects.logout = false;
    this.menuCtrl.enable(false)
    this.checkForgetPasswordConf();
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.appkeyFlag = this.globalObjects.simpleLoginProcess;
    this.loadRememberedUser();
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.AfterloginProviderCall(token)
      }
    });

  }
  loadRememberedUser() {
    if (isPlatformServer(this.platformId)) return;
    const remember = localStorage.getItem('remember_me');

    if (remember === 'true') {
      this.rememberMe = true;
      if (isPlatformServer(this.platformId)) return;
      const data = localStorage.getItem('remember_user');
      if (data) {
        const parsed = JSON.parse(atob(data));
        this.loginCredentials.user_code = parsed.user_code;
        this.loginCredentials.password = parsed.password;
      }
    }
  }

  doLogin() {
    this.globalObjects.logout = false;
    this.userAuth.isProcessingLogin = true;
    this.resStatus = true;
    let deviceValidation = this.globalObjects.getLocallData("device_validation");
    let token = this.globalObjects.getLocallData("device_token");
    let appKey = "";
    if (this.globalObjects.simpleLoginProcess) {
      appKey = this.globalObjects.getLocallData("appKey");
    } else {
      appKey = this.globalObjects.getLocallData("parentAppkey");
    }

    this.appDataArr = this.globalObjects.getLocallData("appData");
    if (this.appDataArr) {
      this.globalObjects.destroyLocalData("appData")
    }
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


    var loginFlag: any = "";
    let entityCodeStr = "";
    let url = "";
     this.globalObjects.wmaAppName =  window.location.pathname.split('/').filter(Boolean).pop();
    this.globalObjects.loginUrl = window.location.href;
    console.log(this.globalObjects.loginUrl);
    console.log(this.globalObjects.wmaAppName);
    let encyprtPassword = this.loginCredentials.password;
    if (this.loginCredentials.password) {
      if (this.globalObjects.urlencryptFlag) {
        encyprtPassword = this.encryption.encryptData(this.loginCredentials.password);
      }
    }


     if (this.globalObjects.simpleLoginProcess) {
      url = 'login?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(encyprtPassword) +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
        + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
        + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&appName=" + encodeURIComponent(this.globalObjects.wmaAppName) + "&callingType=APPKEY_LOGIN" +"&loginUrl="+ (this.globalObjects.loginUrl);
    } else {
      url = 'validateUser?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(encyprtPassword) +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
        + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
        + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&appName=" + encodeURIComponent(this.globalObjects.wmaAppName) + "&callingType=PARENT_APPKEY_LOGIN" + "&loginUrl=" + (this.globalObjects.loginUrl);
    }



    // if (this.globalObjects.simpleLoginProcess) {
    //   url = 'login?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(this.loginCredentials.password) +
    //     '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
    //     + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
    //     + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
    //     + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
    //     + "&location=" + encodeURIComponent(JSON.stringify(loc_address));
    // } else {
    //   url = 'validateUser?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(this.loginCredentials.password) +
    //     '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
    //     + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
    //     + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
    //     + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
    //     + "&location=" + encodeURIComponent(JSON.stringify(loc_address));
    // }

            const currentHost = window.location.host;
        const  hostname = window.location.hostname;
        if(this.globalObjects.clientLoginFlag){
          const isLocalhost = ['localhost'].includes(hostname);

          
          if (!isLocalhost) {
        const isValidDomain = [
          this.globalObjects.getLocallData('server_url1'),
          this.globalObjects.getLocallData('server_url2'),
          this.globalObjects.getLocallData('server_url3'),
          this.globalObjects.getLocallData('server_url4')
        ]
        .filter(Boolean)
        .some(url => {
          try {
            return new URL(url).host === currentHost;
          } catch {
            return false;
          }
        });

        if (!isValidDomain) {
          this.userAuth.isProcessingLogin = false;
          this.globalObjects.presentAlert("Access denied: The App Key you are using is not mapped to this server URL or belongs to a different client. Please check your configuration..");
          return;
        }
          }
        }

    if (this.online) {
      this.dataService.getData(url).then(async (data: any) => {
        this.loginValid = data;
        this.resStatus = false;
        if (this.globalObjects.simpleLoginProcess) {
          if (this.loginValid.responseMsg === "User is authenticated") {
             const folderName = window.location.pathname.split('/')[1];
            sessionStorage.setItem('app_build_name', folderName);

            if (this.loginValid.responseData.gps_mandatory_flag == 'Y' && (this.platform.is('ios') || this.platform.is('android'))) {
              this.globalObjects.checkGPSPermission().then(() => {
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
            
          }
          else {
            this.flagForDisableLoginButton = 0;
            let resArr = this.loginValid.responseMsg.split('#')
            if (resArr[0] == "Q") {
              if (resArr[1].includes("CHANGE_PASSWORD:")) {
                //  [, this.newMess] = resArr[1].split(":");
                const [type, message] = resArr[1].split(':');
                let dataObj: any = {
                  userCode: this.loginCredentials.user_code,
                  message: message
                }

                this.presentPopover(dataObj);
              }
              else  if (resArr[1].includes("NEW_PASSWORD:")) {
                     const [type, message] = resArr[1].split(':');
                let dataObj: any = {
                  userCode: this.loginCredentials.user_code,
                  message: message,
                  passFlag : 'T'
                }

                this.presentPopover(dataObj);
              }

              else {
                let alertmessage = {
                  para_type: "JMS",
                  para_value: resArr[1]
                }
                let popUp = await this.popOverCtrl.create({
                  component: AlertMsgBoxesPage,
                  id: "msgPopover",
                  backdropDismiss: false,
                  componentProps: {
                    alertMessage: alertmessage,
                    type: "info"
                  },
                });
                await popUp.present();

                await popUp.onDidDismiss().then(res => {
                })
              }
              // this.globalObjects.presentAlert(resArr[1]);

            }
          }
          this.userAuth.isProcessingLogin = false;
        }
        else if (data.responseStatus == 'success') {
         const folderName = window.location.pathname.split('/')[1];
         console.log('folderName', folderName);
      sessionStorage.setItem('app_build_name', folderName);
          this.flagForDisableLoginButton = 0;
          let resArr = data.responseMsg.split('#')
          if (resArr[0] == "Q") {
            this.globalObjects.presentAlert(resArr[1]);
            this.userAuth.isProcessingLogin = false;
          }
          else {
            let user = {
              user_code: (this.loginCredentials.user_code).trim(),
              password: this.loginCredentials.password
            }
            this.globalObjects.setDataLocally("tempUser", user);
            this.getAppkeyCollection();
          }
          

        } else {
          this.flagForDisableLoginButton = 0;
          let resArr = data.responseMsg.split('#')
          if (resArr[0] == "Q") {
            this.globalObjects.presentAlert(resArr[1]);
          } else {
            this.globalObjects.presentAlert(data.responseMsg);
          }
          this.userAuth.isProcessingLogin = false;
        }
          
          
      }, err => {
        this.globalObjects.presentAlert("Server error, URl not found....");

        this.userAuth.isProcessingLogin = false;
      })
    } else {
      this.userAuth.isProcessingLogin = false;
      this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
    }
  }

  getAppkeyCollection() {
    this.userAuth.isProcessingLogin = true;
    let platform;
    if (this.platform.is('ios')) {
      platform = "ios";

    } else if (this.platform.is('android')) {
      platform = "android";
    } else {
      platform = "browser"
    }
    let url = "getAppkeyCollection?userCode=" + (this.loginCredentials.user_code).trim();
    this.dataService.getData(encodeURI(url)).then((data: any) => {
      if (data.responseStatus == "success") {
        let appKeyColl = data.responseData;
        console.log("appKeyColl", appKeyColl);
        let appDataMain = this.globalObjects.getLocallData("appDataMain")
        let appData = [];
        let i = 1;
        for (let appkey of appKeyColl) {
          for (let data of appDataMain) {
            if (data.appkey.toLowerCase() == appkey.toLowerCase()) {
              appData.push(data);
            }
          }
          if (i == appKeyColl.length) {
            this.globalObjects.setDataLocally("appData", appData);
            if (appData.length <= 0) {
              this.globalObjects.destroyLocalData("tempUser");
               this.globalObjects.presentAlert("Parent appkey not configured for " + this.loginCredentials.user_code);
               this.userAuth.isProcessingLogin = false;
            }
            else if (appData.length == 1) {
              for (let appkey of appKeyColl) {
                if (appData[0].appkey.toLowerCase() == appkey.toLowerCase()) {
                  this.userAuth.selectAppkey(appData[0]);
                }
              }
            }
            else {
              this.userAuth.isProcessingLogin = false;
              this.router.navigate(['appkey-collection']);
            }
          }
          i++;
        }
      } else {
        this.globalObjects.presentAlert(data.responseMsg);
      }
      }, (error) => {
        this.userAuth.isProcessingLogin = false;
    });
  }
  countdown = 0
  validatePlatform(loginFlag) {
    this.userAuth.loginValid = this.loginValid;
    this.userAuth.loginCredentials = this.loginCredentials;
    if (this.platform.is('android')) {
      if (this.loginValid.responseData.android_access != 'N' || this.loginValid.responseData.android_access == 'Y') {
         if(this.loginValid.responseData.two_fa){
          if(this.loginValid.responseData.two_fa=="EML_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.email} to continue.`
          }else if(this.loginValid.responseData.two_fa=="GM_2FA"){
            this.msgShowotp="Open your Authenticator app (Google or Microsoft) and enter the 6-digit verification code."
          }else if(this.loginValid.responseData.two_fa=="MOB_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.mobile} to continue.`
          }else if(this.loginValid.responseData.two_fa=="EM_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.email} to continue.`
            this.msgShowotpEM_2FA=true          }
          this.countdown = 30; // start 30-sec timer
          this.startCountdown();
          this.isTwoFactorOtpVerify = true
        } else {
          if (loginFlag == 'Y') {
            this.validateOTP("");

          } else if (loginFlag == 'M') {
            this.validateMobile();
          } else {
            this.userAuth.login();
            this.handleRememberMe();
          }
        }
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an android device.");
      }
    } else if (this.platform.is('ios')) {
      if (this.loginValid.responseData.ios_access != 'N' || this.loginValid.responseData.ios_access == 'Y') {
         if(this.loginValid.responseData.two_fa){
          if(this.loginValid.responseData.two_fa=="EML_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.email} to continue.`
          }else if(this.loginValid.responseData.two_fa=="GM_2FA"){
            this.msgShowotp="Open your Authenticator app (Google or Microsoft) and enter the 6-digit verification code."
          }else if(this.loginValid.responseData.two_fa=="MOB_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.mobile} to continue.`
          }else if(this.loginValid.responseData.two_fa=="EM_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.email} to continue.`
          this.msgShowotpEM_2FA=true
          }
          this.isTwoFactorOtpVerify = true
        } else {
          if (loginFlag == 'Y') {
            this.validateOTP("");

          } else if (loginFlag == 'M') {
            this.validateMobile();
          } else {
            this.userAuth.login();
          }
        }
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an ios device.");
      }
    } else {
      if (this.loginValid.responseData.web_access != 'N' || this.loginValid.responseData.web_access == 'Y') {
        if(this.loginValid.responseData.two_fa){
          if(this.loginValid.responseData.two_fa=="EML_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.email} to continue.`
          }else if(this.loginValid.responseData.two_fa=="GM_2FA"){
            this.msgShowotp="Open your Authenticator app (Google or Microsoft) and enter the 6-digit verification code."
          }else if(this.loginValid.responseData.two_fa=="MOB_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.mobile} to continue.`
          }else if(this.loginValid.responseData.two_fa=="EM_2FA"){
            this.msgShowotp=`Enter the 6-digit code sent to ${this.loginValid.responseData.email} to continue.`
            this.msgShowotpEM_2FA=true
          }
          this.isTwoFactorOtpVerify = true
        } else {
          if (loginFlag == 'Y') {
            this.validateOTP("");

          } else if (loginFlag == 'M') {
            this.validateMobile();
          } else {
            // if (this.resetPassFlag == true) {

            //   this.presentPopover(this.newMess);
            // } else {

            this.userAuth.login();
          }
        }
        // }

      }
      else {
        this.globalObjects.presentAlert("You do not have rights to access web app.");
      }
    }
  }

  changeSetting() {
    this.router.navigateByUrl('/appkey-validation', { replaceUrl: true });
  }

  inputType = 'password';
  iconName = 'eye-off';

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }

  proceed(event) {
    if (this.loginCredentials.user_code && this.loginCredentials.password) {
      if (event.keyCode == 13) {
        this.doLogin();
      }
    }
  }
  handleRememberMe() {
    if (this.rememberMe) {
      const payload = {
        user_code: this.loginCredentials.user_code,
        password: this.loginCredentials.password
      };

      localStorage.setItem('remember_me', 'true');
      localStorage.setItem(
        'remember_user',
        btoa(JSON.stringify(payload))
      );
    } else {
      localStorage.removeItem('remember_me');
      localStorage.removeItem('remember_user');
    }
  }

  forgotPassword(type) {
    // let url = "validateForgotPassword"
    // this.dataService.getData(url).then(async (data: any) => {
    //   if (data.status == 'success') {
    // if (data.message.indexOf('Q') <= -1) {
    this.router.navigate(['forgot-password'], {
      queryParams: { 'type': type }
    });
    // } else {
    //   alert(data.message.split('#')[1]);
    // }
    // } else {
    //   alert(data.message.split('#')[1]);
    // }
    // })  
  }



  openPoweredSite() {
     if (isPlatformServer(this.platformId)) return;
    window.open('https://www.lighthouseindia.com/', '_blank', 'noopener');
  }

  loginOtp() {
    // let url = "validateForgotPassword"
    // this.dataService.getData(url).then(async (data:any)=>{
    //   if(data.status == 'success'){
    //     if(data.message.indexOf('Q') <= -1) {
    //       this.router.navigate(['forgot-password']);
    //     } else{
    //       alert(data.message.split('#')[1]);
    //     }
    //   }else{
    //     alert(data.message.split('#')[1]);
    //   }
    // })
    this.router.navigate(['login-with-otp']);
  }




  async validateOTP(otpCode) {
    let alert = await this.alertCtrl.create({
      header: 'OTP Verification',
      message: 'We have sent you an OTP(one time password), please check and enter OTP)',
      inputs: [
        {
          name: 'user_otp',
          placeholder: 'Enter OTP ',
          value: otpCode
        }
      ],
      buttons: [
        {
          text: 'Resend OTP',
          handler: data => {
            this.userAuth.login();
          }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.user_otp == this.loginValid.responseData.otp.otp
            ) {
              this.userAuth.login();
            } else {
              this.globalObjects.displayCordovaToast("Please enter valid OTP");
              return false;
            }
          }
        },
      ]
    });
    await alert.present();

  }
  async validateMobile() {
    let alert = await this.alertCtrl.create({
      header: 'Mobile No Verification',
      message: 'Enter your mobile no for verification',
      inputs: [
        {
          name: 'user_no',
          placeholder: 'Enter Mobile No'
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: data => {

            if (this.loginValid.mobileNo != null && this.loginValid.mobileNo.indexOf(",")) {
              var mobarr = [];
              let countMob: number = 0;
              mobarr = this.loginValid.mobileNo.split(",");
              for (var i = 0; i < mobarr.length; i++) {
                if (mobarr[i] == data.user_no) {
                  countMob = 0;
                  this.userAuth.login();
                  break;
                } else {
                  countMob++;
                }

              }
              if (countMob > 0) {
                this.globalObjects.displayCordovaToast("Please enter valid Number");
              }

            } else {
              if (this.loginValid.mobileNo == data.user_no) {
                this.userAuth.login();
              } else {
                this.globalObjects.displayCordovaToast("Please enter valid Number");
                return false;
              }
            }
          }
        },
      ]
    });
    await alert.present();
  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
  }

  openWebapp() {
    let link = this.globalObjects.getLocallData("webapplink");
    if (link) {
       if (isPlatformServer(this.platformId)) return;
      window.open(link, '_system', 'location=yes');
    } else {
      this.globalObjects.presentAlert("Webapp link not found...")
    }
  }

  checkForgetPasswordConf() { }

  onShow() {

    let link = this.globalObjects.getLocallData("webapplink");
    if (link) {
      const options: InAppBrowserOptions = {
        zoom: 'yes',
        toolbar: 'no',
        hideurlbar: 'yes',
        location: 'no'

      };
      //  var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');
      this.iab.create(link, '_self', options);
    } else {
      this.globalObjects.presentAlert("Webapp link not found...")
    }

    // this.platform.ready().then(() => {

    //   const options: InAppBrowserOptions = {
    //     zoom: 'no',
    //     toolbar: 'no'
    // };
    //   this.iab.create('http://122.185.123.106:8888/A1Cust/register', '_self', options);

    // });


    // this.iab.create('https://google.com/').show();
    // this.iab.create('https://www.youtube.com/');
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

  // verify otp of authtype 2fa authentication
  verifyOtpOfauthType(){
   if(this.loginValid.responseData.two_fa=="EML_2FA" || this.loginValid.responseData.two_fa=="MOB_2FA" || this.loginValid.responseData.two_fa=="EM_2FA"){
    let medium=this.loginValid.responseData.two_fa
    if(medium=="EM_2FA"){
      if(!this.msgShowotpEM_2FA){       
        medium="MOB_2FA"
      }
    }
    this.verifyOtp(medium);
   }else{
  
    let url=`auth/2fa/verify-otp?userCode=${this.loginValid.responseData.user_code}&otp=${this.otp}`
    this.dataService.getData(url).then(async(res:any)=>{
      if(res.responseStatus=="success"){
        this.isTwoFactorOtpVerify=false
        this.userAuth.login();
      } else if(res.responseStatus=="error" && res.responseMsg=="Invalid OTP"){
         await this.msgShow(res.responseMsg)
         this.ngOtpInput.setValue("");
         this.otp="";
         return false;
      }else{
        //  this.globalObjects.displayCordovaToast("Please enter valid OTP");
       await this.msgShow(res.responseMsg)
        this.ngOtpInput.setValue("");
        this.otp="";
        return false;
      }
    })
  }
  }

  // method to login with microsoft and google
  loginWith(onlogin) {
    const qs = new URLSearchParams();
    const receiver = '#/login';
     if (isPlatformServer(this.platformId)) return;
    const next = window.location.origin + window.location.pathname +
      receiver + (qs.toString() ? `?${qs.toString()}` : '');

    // const target =
    //  `https://wma.lighthouseindia.com/lhsws_wma_auth/login/${onlogin}?next=` +
    //   encodeURIComponent(next) + '&token_delivery=redirect';
    const target =
      `https://wma.lighthouseindia.com/lhsws_wma2/login/${onlogin}?next=` +
      encodeURIComponent(next) + '&token_delivery=redirect';
       if (isPlatformServer(this.platformId)) return;
    window.location.href = target;
    this.globalObjects.setDataLocally('microsoftLoginInitiated', 'true')
  }

  AfterloginProviderCall(token: string) {
    this.globalObjects.destroyLocalData('microsoftLoginInitiated')
    this.globalObjects.logout = false;
    this.userAuth.isProcessingLogin = true;
    this.resStatus = true;
    let deviceValidation = this.globalObjects.getLocallData("device_validation");

    let appKey = "";
    if (this.globalObjects.simpleLoginProcess) {
      appKey = this.globalObjects.getLocallData("appKey");
    } else {
      appKey = this.globalObjects.getLocallData("parentAppkey");
    }

    this.appDataArr = this.globalObjects.getLocallData("appData");
    if (this.appDataArr) {
      this.globalObjects.destroyLocalData("appData")
    }
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


    var loginFlag: any = "";
    let entityCodeStr = "";
    let url = "";
    let encyprtPassword = this.loginCredentials.password;
    if (this.loginCredentials.password) {
      if (this.globalObjects.urlencryptFlag) {
        encyprtPassword = this.encryption.encryptData(this.loginCredentials.password);
      }
    }


    url = 'loginMs?deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
      + '&notificationToken=null' + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
      + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
      + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
      + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&loginToken=" + encodeURIComponent(token);


    if (this.online) {
      this.dataService.getData(url).then(async (data: any) => {
        if (data.responseStatus === 'success') {
          this.loginValid = data;
          this.resStatus = false;
          if (this.loginValid.responseMsg === "User is authenticated") {

            if (this.loginValid.responseData.gps_mandatory_flag == 'Y' && (this.platform.is('ios') || this.platform.is('android'))) {
              this.globalObjects.checkGPSPermission().then(() => {
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

          }
          else {
            this.flagForDisableLoginButton = 0;
            let resArr = this.loginValid.responseMsg.split('#')
            if (resArr[0] == "Q") {
              if (resArr[1].includes("CHANGE_PASSWORD:")) {
                //  [, this.newMess] = resArr[1].split(":");
                const [type, message] = resArr[1].split(':');
                let dataObj: any = {
                  userCode: this.loginCredentials.user_code,
                  message: message
                }

                this.presentPopover(dataObj);
              }
              else {
                await this.msgShow(resArr[1])
              }
              // this.globalObjects.presentAlert(resArr[1]);


            }
          }
        } else {
          console.error('SSO login failed', data.responseMsg)
          await this.msgShow(data.responseMsg)
          this.router.navigate(['login']);
          this.userAuth.isProcessingLogin = false;
        }
      }, err => {
        this.globalObjects.presentAlert("Server error, URl not found....");
        this.userAuth.isProcessingLogin = false;
      })
    } else {
      this.userAuth.isProcessingLogin = false;
      this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
    }
  }

  async msgShow(resArr: any) {
    let alertmessage = {
      para_type: "JMS",
      para_value: resArr
    }
    let popUp = await this.popOverCtrl.create({
      component: AlertMsgBoxesPage,
      id: "msgPopover",
      backdropDismiss: false,
      componentProps: {
        alertMessage: alertmessage,
        type: "info"
      },
    });
    await popUp.present();

    await popUp.onDidDismiss().then(res => {
    })
  }

  otp: string = "";
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '100%',
      'height': '55px'
    }
  };
  onOtpChange(otp) {
    this.otp = otp;
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }

  toggleDisable() {
    if (this.ngOtpInput.otpForm) {
      if (this.ngOtpInput.otpForm.disabled) {
        this.ngOtpInput.otpForm.enable();
      } else {
        this.ngOtpInput.otpForm.disable();
      }
    }
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }
  backToLogin() {
    this.isTwoFactorOtpVerify = false;
    this.otp = "";
    this.setVal("");
  }

  verifyOtp(medium) {
    let urlendpoint;
    urlendpoint = "verifyOtp";

    // this.urlendpoint = "getOtp";
    // mobile=8552902454&email=
    this.globalObjects.logout = false;
    let deviceValidation = this.globalObjects.getLocallData("device_validation");
    let token = this.globalObjects.getLocallData("device_token");
    let appKey = "";
    if (this.globalObjects.simpleLoginProcess) {
      appKey = this.globalObjects.getLocallData("appKey");
    } else {
      appKey = this.globalObjects.getLocallData("parentAppkey");
    }

    this.appDataArr = this.globalObjects.getLocallData("appData");
    if (this.appDataArr) {
      this.globalObjects.destroyLocalData("appData")
    }
    let latitude: any = this.backgroundService.latitude;
    let longitude: any = this.backgroundService.longitude;
    let loc_address: any;


    var loginFlag: any = "";
    let entityCodeStr = "";
    let url = "";
    let platform;
    if (this.platform.is('ios')) {
      platform = "ios";

    } else if (this.platform.is('android')) {
      platform = "android";
    } else {
      platform = "browser"
    }
    let action_type=this.msgShowotpEM_2FA ? "&action_type=null" : "&action_type=login"
    let encyprtPassword = this.loginCredentials.password;
     if (this.loginCredentials.password) {
      if (this.globalObjects.urlencryptFlag) {
        encyprtPassword = this.encryption.encryptData(this.loginCredentials.password);
      }
    }
    let login_value = ""
      url = urlendpoint + '?userId=' + (this.loginValid.responseData.user_code) + '&password=' + encodeURIComponent(encyprtPassword) +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&entityCodeStr="
        + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
        + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&otp_medium=" + medium + "&login_value=" + this.loginValid.responseData.email + "&otp_value=" + encodeURIComponent(this.otp)+action_type;
   
 
   
        this.dataService.getData(url).then(async (res: any) => {
     
       if(res.responseStatus=="success"){
        if(this.loginValid.responseData.two_fa=="EM_2FA"){
          if(this.msgShowotpEM_2FA){
            this.ngOtpInput.setValue("");
            this.otp="";
            this.msgShowotpEM_2FA=false;
            this.msgShowotp=`Enter the 6-digit code sent to ${res.responseData.mobile} to continue.`
          }else{
            this.isTwoFactorOtpVerify=false
            this.userAuth.login();
          }
         
        }else{
          this.isTwoFactorOtpVerify=false
          this.userAuth.login();
        }
       
      } else if(res.responseStatus=="error" && res.responseMsg=="Invalid OTP"){
         await this.msgShow(res.responseMsg)
        
         return false;
      }else{
        //  this.globalObjects.displayCordovaToast("Please enter valid OTP");
        await this.msgShow(res.responseMsg)
        this.ngOtpInput.setValue("");
        this.otp = "";
        return false;
      }

    });
  }
  startCountdown() {
    const timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }
  resendOtp() {
    this.setVal("")
    this.doLogin();
  }
  terminate()
  {
    this.userAuth.isProcessingLogin=false;
  }
}