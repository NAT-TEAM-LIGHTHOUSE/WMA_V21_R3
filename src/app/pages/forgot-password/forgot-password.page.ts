import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformServer,Location } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { IonContent, IonHeader, IonInput, IonTitle, IonToolbar, Platform, PopoverController } from '@ionic/angular/standalone';
import { EncryptionService } from 'src/app/services/encryption.service';
import { BackgroundService } from 'src/app/services/background.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMsgBoxesPage } from '../alert-msg-boxes/alert-msg-boxes.page';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [STANDALONE_IMPORTS,NgOtpInputModule]
})
export class ForgotPasswordPage implements OnInit {

  @ViewChild('popover') popover!: HTMLIonPopoverElement;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  otp_value = '';
  mobile_value = '';
  email_value = '';
    isSendingOtp: boolean = false;
  openPassword: boolean = false;
isFetchingUserId: boolean = false;
  otpSent: boolean = false;       // show/hide OTP input
  otpVerified: boolean = false;   // show/hide password reset section

  passwordFlag: boolean = false;
  otpFlag: boolean = false;
  loginCredentials: any = {};
  // urlendpoint: any;
  otp: string;
  usernameFlag: boolean = false;
  @ViewChild('autofocus') searchbar: IonInput;
  @ViewChild('mobileRef') mobileRef: NgModel;
  @ViewChild('emailRef') emailRef: NgModel;

  // loginCredentials: any = {};
  flagForDisableLoginButton = 0;
  public loginValid: any = {};
  online: boolean = true;
  isProcessing: boolean = false;
  public shouldHeight: any
  logoentity: any;
  upd_flag: any;
  OTPCode: any;
  passwordComplexity: 'complex' | 'simple' = 'complex'; // default, set this based on response
  userprofile: any = null;
  userDetails: any;
  appDataArr = [];
  otp_verify_flag = false;
  public userCode: any;
  userdetail: any;
  // otpSent: boolean = false;
  login_value = '';
  type: any;
  selectedaccount = 'mobile';
  usrOtp;
  message: any = "";

  mobile_otp_flag = false;
  email_otp_flag = false;
  mobile_resend_flag = false;
  email_resend_flag = false;

  otp_disable_flag = false;


  countdown: number = 30;
  isTimeUp: boolean = false;
  private intervalId: any;
  constructor(private encryption : EncryptionService, private backgroundService: BackgroundService, public popOverCtrl: PopoverController, public location: Location, private route: ActivatedRoute, private router: Router, private dataService: DataService, private globalObjects: GlobalObjectsService, private platform: Platform,@Inject(PLATFORM_ID) private platformId: Object) {

if (isPlatformServer(this.platformId)) return;
    this.shouldHeight = document.body.clientHeight + 'px';
    this.userdetail = this.globalObjects.getLocallData("userDetails");
    if (this.platform.is('ios') || this.platform.is('android')) {

      // this.start();
    }
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "forgot-password")
    }
  }

  ngOnInit() {
    this.mobile_otp_flag = false;
    this.email_otp_flag = false;
    this.mobile_resend_flag = false;
    this.email_resend_flag = false;
    this.otp_disable_flag = false;
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.userDetails = this.globalObjects.getLocallData("userDetails");
    });
  }



  setMedium(medium: any) {

    this.login_value = "";
    this.email_value = "";
    this.mobile_value = "";
    this.otp_value = "";
    this.mobile_otp_flag = false;
    this.email_otp_flag = false;
    this.mobile_resend_flag = false;
    this.email_resend_flag = false;
    this.countdown = 30;
    this.otp_disable_flag = false;
    clearInterval(this.intervalId);


  }



  //   otpSent = false;
  // otpVerified = false;
  // countdown = 0;
  newPassword = '';
  confirmPassword = '';
  // mobile_value = '';
  // email_value = '';
  // selectedaccount = 'mobile';



  getOtp() {
         if (this.isSendingOtp) {
    return;
  }

  this.isSendingOtp = true;
    this.otp_disable_flag = true;
    clearInterval(this.intervalId);
    this.countdown = 30;

    this.otp_verify_flag = false;
    this.validateUser();
  }





  verifyOtp() {
    if (this.otp_value.length !== 6) {
      console.log('Please enter complete OTP');
      return;
    }

    this.otp_verify_flag = true;
    this.sendPassword();
  }



  validateUser() {
    let url;
    //  let deviceValidation = this.globalObjects.getLocallData("device_validation");
    //   let token = this.globalObjects.getLocallData("device_token");
    //    let latitude: any = this.backgroundService.latitude;
    //   let longitude: any = this.backgroundService.longitude;
    //   let loc_address: any;
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



    // var loginFlag: any = "";
    // let entityCodeStr = "";
    console.log(this.email_value, "email value");
    console.log(this.mobile_value)

    let value = this.email_value ? this.email_value : this.mobile_value;
    // let appKey = this.globalObjects.getLocallData("appKey");;
    url = 'validateUserID?userId=' + value + '&appKey=' + appKey;

    this.dataService.getData(url).then(async (data: any) => {
      this.loginValid = data;
      console.log(data);

      if (data.responseStatus == "success") {
        if (data.responseMsg.includes("#PC")) {
          this.passwordComplexity = 'complex';
        } else if (data.responseMsg.includes("#PS")) {
          this.passwordComplexity = 'simple';
        }

        this.sendPassword();
      }else{
       
        let resArr = data.responseMsg;
        if (data.responseMsg.startsWith('Q#')) {
          resArr = data.responseMsg.split('#')[1]
        }
           
        // if (resArr[0] == "Q") {
        // this.globalObjects.presentAlert(resArr[1]);
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
 this.isSendingOtp = false;
        await popUp.onDidDismiss().then(res => {
        }).catch((err) => {

    this.isSendingOtp = false;
    console.log(err);

  });
      }
    });

  }
simplePasswordValidation() {
  this.passwordErrors = { new: '', confirm: '' };
  if (!this.newPassword) {
    this.passwordErrors.new = 'New password is required.';
  }
  if (!this.confirmPassword) {
    this.passwordErrors.confirm = 'Confirm password is required.';
  } else if (this.newPassword !== this.confirmPassword) {
    this.passwordErrors.confirm = 'Passwords do not match.';
  }
}

  sendPassword() {
    let urlendpoint;
    if (this.otp_verify_flag) {
      urlendpoint = "verifyOtp";
    } else {
      urlendpoint = "getOtp";
    }
    // this.urlendpoint = "getOtp";
    // mobile=8552902454&email=
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
    this.login_value = this.mobile_value ? this.mobile_value : this.email_value;
    if(urlendpoint == "getOtp"){
 url = urlendpoint + '?userId=' + (this.loginCredentials.user_code) + '&password=' + encodeURIComponent(this.loginCredentials.password) +
      '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
      + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&entityCodeStr="
      + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
      + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
      + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&otp_medium=" + this.selectedaccount + "&login_value=" + this.login_value + "&otp_value=" + encodeURIComponent(this.otp_value)+ "&action_type=FRGT_PWD";
    }else{
      url = urlendpoint + '?userId=' + (this.loginCredentials.user_code) + '&password=' + encodeURIComponent(this.loginCredentials.password) +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&entityCodeStr="
        + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
        + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&otp_medium=" + this.selectedaccount + "&login_value=" + this.login_value + "&otp_value=" + encodeURIComponent(this.otp_value);

    }


    // "&mobile=" + encodeURIComponent(this.mobile_value) + "&email=" + encodeURIComponent(this.email_value) + "&password="
    // + encodeURIComponent(this.confirmPassword);
    this.dataService.getData(url).then(async (data: any) => {
      this.loginValid = data;
      console.log(data);

      if (data.responseStatus == "success") {
        if(urlendpoint=="getOtp"){
            let resArr = this.loginValid;
        // if (resArr[0] == "Q") {
        // this.globalObjects.presentAlert(resArr[1]);
        let alertmessage = {
          para_type: "OTPSENT",
          para_value: resArr.responseStatus,
          para_value1: resArr.responseData.email,
          para_value2: resArr.responseData.mobile
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

        await popUp.onDidDismiss().then( () => {
        
            this.otpSent = true;
          this.isSendingOtp = false;
          
        })

        }
        // this.globalObjects.presentAlert(data.responseMsg);
        if (urlendpoint == "verifyOtp") {
             let resArr = this.loginValid;
        // if (resArr[0] == "Q") {
        // this.globalObjects.presentAlert(resArr[1]);
        let alertmessage = {
          para_type: "OTPSENT",
          // para_value: resArr.responseStatus,
          para_head :'otpSent',
          para_value: resArr.responseMsg,
          // para_value2: resArr.responseData.mobi
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

        await popUp.onDidDismiss().then(() => {
           this.isSendingOtp = false;
        })
          this.openPassword = true;
        }

      }
      else {
        let resArr = this.loginValid.responseMsg;
        // if (resArr[0] == "Q") {
        // this.globalObjects.presentAlert(resArr[1]);
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
        // }
      }

    });
    if ((this.selectedaccount === 'mobile' && this.mobile_value) ||
      (this.selectedaccount === 'email' && this.email_value)) {
      // this.otpSent = true;
      this.countdown = 30; // start 30-sec timer
      this.startCountdown();
    } else {
      // alert('Please enter your ' + this.selectedaccount);
    }
  }

  // verifyOtp1() {
  //   // simulate OTP verification success
  //   this.otpVerified = true;
  //   this.otpSent = false;
  // }

  startCountdown() {
    const timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }

  // savePassword() {
  //   if (this.newPassword && this.confirmPassword && this.newPassword === this.confirmPassword) {
  //     alert('Password changed successfully!');
  //     // You can call API here
  //   } else {
  //     alert('Passwords do not match!');
  //   }
  // }


  // sendOtp() {
  //   this.message = ""
  //   this.dataService.getData("sendOTP?loginId=" + encodeURIComponent(this.userCode)).then(res => {
  //     let data: any = res;
  //     if (data.otpStatus) {
  //       this.otpSent = data.otpStatus;
  //       this.otp = data.otp;
  //       this.message = data.otpSuccessMessage
  //     } else {
  //       alert(data.otpErrorMessage);
  //     }
  //   }).catch(e => { })
  // }

  closePage() {
    this.location.back();
    // this.location
  }

  // verifyOtp() {
  //   this.message = ""
  //   if (this.usrOtp == this.otp) {
  //     this.router.navigate(['reset-password', this.userCode]);
  //   } else {
  //     alert("Please enter valid OTP value.")
  //   }
  // }







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





  sendUserName() {
      if (this.isFetchingUserId) {
    return;
    
  }
  this.isFetchingUserId = true;
    let urlendpoint;
    this.usernameFlag = true;
    urlendpoint = "getUserName";
    // mobile=8552902454&email=
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

    url = urlendpoint + '?userId=' + (this.loginCredentials.user_code) + '&password=' + encodeURIComponent(this.loginCredentials.password) +
      '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
      + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&entityCodeStr="
      + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
      + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
      + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&mobile=" + encodeURIComponent(this.mobile_value) + "&email=" + this.email_value;
    this.dataService.getData(url).then(async (data: any) => {
            this.isFetchingUserId = false;
      this.loginValid = data;
      console.log(data);

      if (data.responseStatus == "success") {
        // this.globalObjects.presentAlert(data.responseMsg);
        this.presentPopover(data);
        //   let alertmessage = {
        //   para_type: "JMI",
        //   para_value: data.responseMsg
        // }
        // let popUp = await this.popOverCtrl.create({
        //   component: AlertMsgBoxesPage,
        //   id: "msgPopover",
        //   backdropDismiss: false,
        //   componentProps: {
        //     alertMessage: alertmessage,
        //     type: "info"
        //   },
        // });
        // await popUp.present();

        // await popUp.onDidDismiss().then(res => {
        // })
      }
      else {
        let resArr = this.loginValid.responseMsg;
        // if (resArr[0] == "Q") {
        // this.globalObjects.presentAlert(resArr[1]);
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
        }).catch((err) => {

    this.isFetchingUserId = false;
    console.log(err);

  });
        // }
      }

    });

  }



  sendOtpNew() {
    this.passwordFlag = true;
    this.otpFlag = true;


  }

  allowOnlyNumbers(event: any) {
    const input = event.target as HTMLInputElement;
    // Replace any non-digit character with ''
    // input.value = input.value.replace(/[^0-9]/g, '');
    // Update your ngModel manually if needed
    this.mobile_value = input.value;
  }



passwordErrors = {
  new: '',
  confirm: ''
};
validatePasswordFields() {
  const newPass = this.newPassword?.trim() || '';
  const confirmPass = this.confirmPassword?.trim() || '';

  this.passwordErrors = { new: '', confirm: '' };

  if (!newPass) {
    this.passwordErrors.new = 'New password is required.';
  } else if (newPass.length < 8) {
    this.passwordErrors.new = 'Password must be at least 8 characters long.';
  } else if (!/[\d\W]/.test(newPass)) {
    this.passwordErrors.new = 'Password must contain at least one number or special character.';
  }

  if (!confirmPass) {
    this.passwordErrors.confirm = 'Confirm password is required.';
  } else if (newPass !== confirmPass) {
    this.passwordErrors.confirm = 'Passwords do not match.';
  }
}

// validatePasswordFields() {
//   this.passwordErrors = { new: '', confirm: '' };

//   // --- New Password Validation ---
//   if (!this.newPassword) {
//     this.passwordErrors.new = 'New password is required.';
//   } else if (this.newPassword.length < 8) {
//     this.passwordErrors.new = 'Password must be at least 8 characters long.';
//   } else if (!/[\d\W]/.test(this.newPassword)) {
//     this.passwordErrors.new = 'Password must contain at least one number or special character.';
//   }

//   // --- Confirm Password Validation ---
//   if (!this.confirmPassword) {
//     this.passwordErrors.confirm = 'Confirm password is required.';
//   } else if (this.newPassword !== this.confirmPassword) {
//     this.passwordErrors.confirm = 'Passwords do not match.';
//   }
// }




onPasswordChange() {
  if (this.passwordComplexity === 'complex') {
    this.validatePasswordFields();
  } else {
    this.simplePasswordValidation();
  }
}

// by arti
  confirmPass() {
   
// this.validatePasswordFields();
 if (this.passwordErrors.new || this.passwordErrors.confirm) {
    return;
  }

   let encyprtPassword=this.confirmPassword;
     if(this.confirmPassword){
      if(this.globalObjects.urlencryptFlag){
        encyprtPassword=this.encryption.encryptData(this.confirmPassword);
      }
    }

  let val;
  if(this.selectedaccount == 'mobile'){
    val=this.mobile_value
  }else{
    val=this.email_value
  }
   let user:any={
    oldPassword:"",
    newPassword:this.encryption.encryptData(this.newPassword),
    cnfPassword:this.encryption.encryptData(this.confirmPassword),
    wma_user_code : val,
    actual_code : val,
   }


    const dataPara = { parameters: user };
    const url = "changePassword";

    this.dataService.postData(url, dataPara).then(async (data:any) => {
      this.loginValid = data;
      console.log(data);

      if (data.responseStatus == "success") {
        // this.globalObjects.presentAlert(data.responseMsg);
        this.presentPopover(data);
      }
      else {
        let resArr = this.loginValid.responseMsg;
        // if (resArr[0] == "Q") {
        // this.globalObjects.presentAlert(resArr[1]);
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
        // }
      }

    });


  }

//   confirmPass() {
   
// this.validatePasswordFields();
//  if (this.passwordErrors.new || this.passwordErrors.confirm) {
//     return;
//   }

//    let encyprtPassword=this.confirmPassword;
//      if(this.confirmPassword){
//       if(this.globalObjects.urlencryptFlag){
//         encyprtPassword=this.encryption.encryptData(this.confirmPassword);
//       }
//     }
//     let urlendpoint;
//     this.usernameFlag = true;
//     urlendpoint = "forgotPassword";
//     // mobile=8552902454&email=
//     this.globalObjects.logout = false;
//     this.isProcessing = true;
//     let deviceValidation = this.globalObjects.getLocallData("device_validation");
//     let token = this.globalObjects.getLocallData("device_token");
//     let appKey = "";
//     if (this.globalObjects.simpleLoginProcess) {
//       appKey = this.globalObjects.getLocallData("appKey");
//     } else {
//       appKey = this.globalObjects.getLocallData("parentAppkey");
//     }

//     this.appDataArr = this.globalObjects.getLocallData("appData");
//     if (this.appDataArr) {
//       this.globalObjects.destroyLocalData("appData")
//     }
//     let latitude: any = this.backgroundService.latitude;
//     let longitude: any = this.backgroundService.longitude;
//     let loc_address: any;


//     var loginFlag: any = "";
//     let entityCodeStr = "";
//     let url = "";
//     let platform;
//     if (this.platform.is('ios')) {
//       platform = "ios";

//     } else if (this.platform.is('android')) {
//       platform = "android";
//     } else {
//       platform = "browser"
//     }
//  this.login_value = this.mobile_value ? this.mobile_value : this.email_value;
//     url = urlendpoint + '?userId=' + (this.loginCredentials.user_code) + '&password=' + encodeURIComponent(this.loginCredentials.password) +
//       '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
//       + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&entityCodeStr="
//       + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
//       + "&latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&platform=" + encodeURIComponent(platform)
//       + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&login_value=" + encodeURIComponent(this.login_value) + "&newPassword=" + encodeURIComponent(encyprtPassword)
//     this.dataService.getData(url).then(async (data: any) => {
//       this.loginValid = data;
//       console.log(data);

//       if (data.responseStatus == "success") {
//         // this.globalObjects.presentAlert(data.responseMsg);
//         this.presentPopover(data);
//       }
//       else {
//         let resArr = this.loginValid.responseMsg;
//         // if (resArr[0] == "Q") {
//         // this.globalObjects.presentAlert(resArr[1]);
//         let alertmessage = {
//           para_type: "JMS",
//           para_value: resArr
//         }
//         let popUp = await this.popOverCtrl.create({
//           component: AlertMsgBoxesPage,
//           id: "msgPopover",
//           backdropDismiss: false,
//           componentProps: {
//             alertMessage: alertmessage,
//             type: "info"
//           },
//         });
//         await popUp.present();

//         await popUp.onDidDismiss().then(res => {
//         })
//         // }
//       }

//     });
//   }


  isOpen: boolean = false;
  popoverMessage: string = '';
  successMes: string = '';

  presentPopover(message: any) {
    this.isOpen = true;
    this.popoverMessage = message.responseMsg;
    this.successMes = message.responseStatus;

  }


  closePopover() {
    this.isOpen = false;
    this.popOverCtrl.dismiss();
    this.router.navigate(['/login']);
  }


showConfirmPassword = false;
  toggleConfirmPassword() {
  this.showConfirmPassword = !this.showConfirmPassword;
}
changeSetting() {
  this.router.navigate(['appkey-validation']);
}
openPoweredSite() {
    window.open('https://www.lighthouseindia.com/', '_blank', 'noopener');
  
}
  showConfirmPasswordA=false
  toggleConfirmPassworda(){
    this.showConfirmPasswordA=!this.showConfirmPasswordA;
  }
}