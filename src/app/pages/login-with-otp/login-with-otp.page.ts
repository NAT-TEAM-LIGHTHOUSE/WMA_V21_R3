import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';



import { AlertController, IonInput, IonRadio, IonRadioGroup, MenuController, Platform, PopoverController } from '@ionic/angular/standalone';
import { BackgroundService } from 'src/app/services/background.service';
import { DataService } from 'src/app/services/data.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { AlertMsgBoxesPage } from '../alert-msg-boxes/alert-msg-boxes.page';
import { Router } from '@angular/router';
// import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppBrowser,InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { UserauthenticationService } from 'src/app/services/userauthentication.service';
import { NgModel } from '@angular/forms';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { NgOtpInputModule } from 'ng-otp-input';
@Component({
  selector: 'app-login-with-otp',
  templateUrl: './login-with-otp.page.html',
  styleUrls: ['./login-with-otp.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,STANDALONE_IMPORTS,NgOtpInputModule]
})
export class LoginWithOtpPage implements OnInit {
  loginCredentials: any = {};
  // appDataArr = [];
  // flagForDisableLoginButton = 0;
  otp: string;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  @ViewChild('autofocus') searchbar: IonInput;
  @ViewChild('mobileRef') mobileRef:NgModel;
  @ViewChild('emailRef') emailRef:NgModel;
  
  // loginCredentials: any = {};
  flagForDisableLoginButton = 0;
  public loginValid: any = {};
  online: boolean = true;
  isProcessing: boolean = false;
  public shouldHeight: any
  logoentity: any;
  upd_flag: any;
  OTPCode: any;
  userprofile: any = null;
  userDetails: any;
  appDataArr = [];
  otp_verify_flag=false;
    // public loginValid: any = {};
  


  



    mobile_otp_flag=false;
    email_otp_flag=false;
    mobile_resend_flag=false;
    email_resend_flag=false;
    
    otp_disable_flag=false;

    
    countdown: number = 30;
  isTimeUp: boolean = false;
  private intervalId: any;

  constructor(private alertCtrl: AlertController,
      private router: Router, public globalObjects: GlobalObjectsService, public backgroundService: BackgroundService,public popOverCtrl:PopoverController,
      public userAuth: UserauthenticationService,public dataService: DataService, private iab: InAppBrowser,
      public menuCtrl: MenuController, public platform: Platform) { }
   selectedaccount  ='mobile';
   login_value='';
   otp_value='';
    //  isProcessing: boolean = false;

  // ngOnInit() {
  // }
ngOnInit() {
   this.mobile_otp_flag=false;
    this.email_otp_flag=false;
     this.mobile_resend_flag=false;
    this.email_resend_flag=false;
        this.otp_disable_flag=false;

    // let applogo = this.globalObjects.getLocallData("icon_img");
    this.globalObjects.logout = false;
    this.menuCtrl.enable(false)
    this.checkForgetPasswordConf();
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }
  getOtp(){
    // if(this.selectedaccount=="mobile"){
    // this.mobile_otp_flag=true;
    // if(this.login_value){
    //   return;
    // }
        this.otp_disable_flag=true;
        clearInterval(this.intervalId);


this.countdown=30;




    // }else{
    //       this.email_otp_flag=true;
    // }
    
  this.otp_verify_flag=false;
  this.doLogin();
  }





  verifyOtp(){
      if (this.otp_value.length !== 6) {
    console.log('Please enter complete OTP');
    return;
  }

  this.otp_verify_flag=true;
  this.doLogin();
  }
  setMedium(medium:any){

    this.login_value="";
    this.otp_value="";
    this.mobile_otp_flag=false;
    this.email_otp_flag=false;
    this.mobile_resend_flag=false;
    this.email_resend_flag=false;
this.countdown=30;
    this.otp_disable_flag=false;
        clearInterval(this.intervalId);


  }



   startResendCountdown() {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        console.log("counter ",this.countdown);
      } else {
        this.isTimeUp = true;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  
  /////////////////////////////////////////////////////////////////////////





ionViewWillEnter() {
    this.loginCredentials = {};
    setTimeout(() => {
      if (this.searchbar) { this.searchbar.setFocus() }
    }, 300);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  

  doLogin() {


    // alert(this.selectedaccount);

    
    
    
    
    
    
  if(this.selectedaccount=="mobile"){
   this.mobileRef.control.markAsTouched();

       if(!this.login_value ||  this.mobileRef.invalid){
            this.otp_disable_flag=false;
            this.otp_verify_flag=false;
            console.log("mobile is invalid")
         return;
       }
}
if(this.selectedaccount=="email"){
     this.emailRef.control.markAsTouched();
       if(!this.login_value ||  this.emailRef.invalid){
            this.otp_disable_flag=false;
            this.otp_verify_flag=false;
            console.log("email is invalid")
         return;
       }
}
    
    let urlendpoint:any;
    if(this.otp_verify_flag){
      urlendpoint="verifyOtp";
    }else{
urlendpoint="getOtp";
    }
    this.globalObjects.logout = false;
    this.isProcessing = true;
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
    if(urlendpoint=="getOtp"){
    // if (this.globalObjects.simpleLoginProcess) {
        url = urlendpoint+'?userId=' + (this.loginCredentials.user_code) + '&password=' + encodeURIComponent(this.loginCredentials.password) +
          '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
          + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
          + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
          + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
          + "&location=" + encodeURIComponent(JSON.stringify(loc_address))+"&otp_medium=" + this.selectedaccount+"&login_value="  + this.login_value+"&action_type=login";
      // } else {
      //   url = 'validateUser?userId=' + (this.loginCredentials.user_code) + '&password=' + encodeURIComponent(this.loginCredentials.password) +
      //     '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
      //     + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
      //     + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
      //     + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
      //     + "&location=" + encodeURIComponent(JSON.stringify(loc_address))+"&otp_medium=" + encodeURIComponent(this.selectedaccount)+
      //     "&login_value=" + encodeURIComponent(this.login_value)+"&action_type=login";
      // }
    }
      else{
        //  if (this.globalObjects.simpleLoginProcess) {
        url = urlendpoint+'?userId=' + (this.loginCredentials.user_code) + '&password=' + encodeURIComponent(this.loginCredentials.password) +
          '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
          + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
          + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
          + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
          + "&location=" + encodeURIComponent(JSON.stringify(loc_address))+"&otp_medium=" + this.selectedaccount+"&login_value=" + encodeURIComponent(this.login_value) +"&otp_value=" + this.otp_value + "&action_type=login";
      // } else {
      //   url = 'validateUser?userId=' + (this.loginCredentials.user_code) + '&password=' + encodeURIComponent(this.loginCredentials.password) +
      //     '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
      //     + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag=" + loginFlag
      //     + "&entityCodeStr=" + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
      //     + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
      //     + "&location=" + encodeURIComponent(JSON.stringify(loc_address))+"&otp_medium=" + encodeURIComponent(this.selectedaccount)+"&login_value=" + encodeURIComponent(this.login_value)+"&otp_value=" + encodeURIComponent(this.otp_value)+ "&action_type=login";
      // }
      }





    if (this.online) {
      this.dataService.getData(url).then(async (data: any) => {
        this.otp_disable_flag=false;




        
        this.loginValid = data;


        if (this.globalObjects.simpleLoginProcess && this.otp_verify_flag) {
          if (this.loginValid.responseMsg === "User is authenticated") {
            // if (this.loginValid.responseStatus === "success") {

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
              // this.globalObjects.presentAlert(resArr[1]);
              let alertmessage={
                para_type:"JMS",
                para_value:resArr[1]
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
          }




        }
        else if (data.responseStatus == 'success') {
//////////////////////////////////////////////flags logic////////
          this.mobile_otp_flag=true;
    this.email_otp_flag=true;
  this.startResendCountdown();
  ///////////////////////////////////////flag logic///////////////

        if(this.otp_verify_flag){
          this.flagForDisableLoginButton = 0;
          let resArr = data.responseMsg.split('#')
          if (resArr[0] == "Q") {
            this.globalObjects.presentAlert(resArr[1]);
          }
          else {
            let user = {
              user_code: (this.loginCredentials.user_code).trim(),
              password: this.loginCredentials.password
            }
            this.globalObjects.setDataLocally("tempUser", user);
            this.getAppkeyCollection();
          }
        }
          // this.flagForDisableLoginButton = 0;
          // let resArr = data.responseMsg.split('#')
          // if (resArr[0] == "Q") {
          //   this.globalObjects.presentAlert(resArr[1]);
          // }
          // else {
          //   let user = {
          //     user_code: (this.loginCredentials.user_code).trim(),
          //     password: this.loginCredentials.password
          //   }
          //   this.globalObjects.setDataLocally("tempUser", user);
          //   this.getAppkeyCollection();
          // }


        } else {
          this.flagForDisableLoginButton = 0;
          let resArr = data.responseMsg.split('#')
          if (resArr[0] == "Q") {
            // this.globalObjects.presentAlert(resArr[1]);
                        this.presentToastMsg(resArr);
            this.mobile_otp_flag=false;
            this.email_otp_flag=false;
          } else {
            this.globalObjects.presentAlert(data.responseMsg);
            this.mobile_otp_flag=false;
            this.email_otp_flag=false;
          }
        }
        this.isProcessing = false;
      }, err => {
        this.globalObjects.presentAlert("Server error, URl not found....");
        this.otp_disable_flag=false;
            this.otp_verify_flag=false;
        this.isProcessing = false;
      })
    } else {
      this.isProcessing = false;
      this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
      this.otp_disable_flag=false;
            this.otp_verify_flag=false;
    }
  }

  getAppkeyCollection() {
    this.isProcessing = true;
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
              alert("Parent appkey not configured for " + this.loginCredentials.user_code)
            }
            else if (appData.length == 1) {
              for (let appkey of appKeyColl) {
                if (appData[0].appkey.toLowerCase() == appkey.toLowerCase()) {
                  this.userAuth.selectAppkey(appData[0]);
                }
              }
            }
            else {
              this.router.navigate(['appkey-collection']);
            }
          }
          i++;
        }
      } else {
        this.globalObjects.presentAlert(data.responseMsg);
      }
    }, (error) => {
      this.isProcessing = false
    });
  }

  validatePlatform(loginFlag) {
    this.userAuth.loginValid = this.loginValid;
    this.userAuth.loginCredentials = this.loginCredentials;
    if (this.platform.is('android')) {
      if (this.loginValid.responseData.android_access != 'N' || this.loginValid.responseData.android_access == 'Y') {
        if (loginFlag == 'Y') {
          this.validateOTP("");

        } else if (loginFlag == 'M') {
          this.validateMobile();
        } else {
          this.userAuth.login();
        }
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an android device.");
      }
    }
    else if (this.platform.is('ios')) {
      if (this.loginValid.responseData.ios_access != 'N' || this.loginValid.responseData.ios_access == 'Y') {
        if (loginFlag == 'Y') {
          this.validateOTP("");

        } else if (loginFlag == 'M') {
          this.validateMobile();
        } else {
          this.userAuth.login();
        }
      }
      else {
        this.globalObjects.presentAlert("You do not have access rights for an ios device.");
      }
    } else {
      if (this.loginValid.responseData.web_access != 'N' || this.loginValid.responseData.web_access == 'Y') {
        if (loginFlag == 'Y') {
          this.validateOTP("");

        } else if (loginFlag == 'M') {
          this.validateMobile();
        } else {
          this.userAuth.login();
        }
      }
      else {
        this.globalObjects.presentAlert("You do not have rights to access web app.");
      }
    }
  }

  changeSetting() {
    this.router.navigate(['login']);
  }

  inputType = 'password';
  iconName = 'eye-off';

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }

  proceed(event){
    if(this.loginCredentials.user_code && this.loginCredentials.password){
      if(event.keyCode == 13){
        this.doLogin();
      }
    }
  }

  forgotPassword() {
    let url = "validateForgotPassword"
    this.dataService.getData(url).then(async (data:any)=>{
      if(data.status == 'success'){
        if(data.message.indexOf('Q') <= -1) {
          this.router.navigate(['forgot-password']);
        } else{
          alert(data.message.split('#')[1]);
        }
      }else{
        alert(data.message.split('#')[1]);
      }
    })
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
      window.open(link, '_system', 'location=yes');
    } else {
      this.globalObjects.presentAlert("Webapp link not found...")
    }
  }

  checkForgetPasswordConf(){}

  onShow() {

    let link = this.globalObjects.getLocallData("webapplink");
    if (link) {
      const options: InAppBrowserOptions = {
        zoom: 'yes',
        toolbar: 'no',
        hideurlbar:'yes',
        location: 'no'

    };
    //  var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');
      // this.iab.create(link,'_self', options);
       this.iab.create(link,'_self', options);

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
//////////////////////////////////////////////////////
    interval: any;
    counter:any;
startCountdown() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.counter = 30;
    this.interval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }
async presentToastMsg(resArr:any){
   if (resArr[0] == "Q") {
              // this.globalObjects.presentAlert(resArr[1]);
              let alertmessage={
                para_type:"JMS",
                para_value:resArr[1]
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
}
allowOnlyNumbers(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
}






//  otpValue: string = '';
otpConfig = {
  length: 6,
  allowNumbersOnly: true,
  inputStyles: {
    'width': '40px',
    'height': '45px',
    'margin': '5px',
    // 'border': '1px solid #c92b2bff',
    'border-radius': '8px',
    'font-size': '20px',
    'color': '#000',
    'text-align': 'center'
  }
};

onOtpChange(otp: any) {
  this.otp_value = otp;
}

onOtpFilled(otp: any) {
  this.otp_value = otp;
  console.log('Full OTP entered:', otp);
}

 openPoweredSite() {
    window.open('https://www.lighthouseindia.com/', '_blank', 'noopener');
  }


} 
