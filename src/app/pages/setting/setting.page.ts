import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit,PLATFORM_ID,ViewChild } from '@angular/core';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { ModalController, Platform, PopoverController } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { ExecuteQueryPage } from '../execute-query/execute-query.page';
import { ImageIconMasterPage } from '../image-icon-master/image-icon-master.page';
import { OfflineEntryTabsPage } from '../offline-entry-tabs/offline-entry-tabs.page';
import { SqlLightTranPage } from '../sql-light-tran/sql-light-tran.page';
import { TreeCallpagePage } from '../tree-callpage/tree-callpage.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { EncryptionService } from 'src/app/services/encryption.service';
import { AlertMsgBoxesPage } from '../alert-msg-boxes/alert-msg-boxes.page';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { isPlatformServer } from '@angular/common';
import { DebugService } from 'src/app/services/debug-service';
import { NgOtpInputModule } from 'ng-otp-input';

declare var google;
declare var OurCodeWorldpreventscreenshots;

@Component({
standalone: true,
imports : [STANDALONE_IMPORTS,NgOtpInputModule],
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit, OnDestroy {

 
serverAppBuildDate:any;
 serverAppBuildVersion:any;
   @ViewChild('authenticatorToggle', { static: false }) authenticatorToggle: any;
  fontArray = ['Roboto (default)', 'Helvetica', 'Helvetica Monospaced', 'Arial', 'open sans', 'poppin', 'monospace', 'serif', 'cursive'];
  fontoption: boolean = false;
  toggleVibrate: boolean = false;
  toggleScreenshot: boolean = false;
  toggleSound: boolean = false;
  toggleNotification: boolean = false;
  toggleFab: boolean = false;
  toggleDevloperMode: boolean = false;
  loginExpiry: any;
  soundOption: boolean = false;
  fontOptions: boolean = false;
  kpiTextBand: boolean = false;
  inputField: boolean = false;
  menuTab: boolean = false;
  fontRange: number;
  volumeRange: number = 0.1;
  otherlist: boolean = false;
  toggleDragMode: boolean;
  executeQueryflag: boolean = true;
  imageIconFlag: boolean = true;
  showuserdetails: boolean = false;
  showdetails: boolean = false;
  inputFields: boolean = true;
  local: boolean = false;

  audio: any = {
    toggelSound: true,
    id: 'assets/audio/click1.mp3',
    sound: 'assets/audio/click1.mp3',
    volume: 0.5
  };
  sound: any = 'assets/audio/click1.mp3';
  fontName: any = "select font";
  fontSize: any = "select font size";
  fontSizeArray = ['4', '6', '8 (default)', '10', '12', '14'];
  fontType: any;

  tabImgHeight: any;
  tabFontWeight: any;
  tabFontSize: any;
  tabPadding: any;
  tabStyle: any;
  kpiPadd: any;
  kpiHeadFont: any;
  kpiValueFont: any;
  kpiWeight: any;
  kpiHeadWeight: any;
  kpiValWeight: any;
  autoAppKey: any;
  logFlag: boolean = false;
  userDetails: any;

  constructor(public events: Events, public platform: Platform, private encrypt: EncryptionService, private nativeAudio: NativeAudio, public globalObjects: GlobalObjectsService, public dataService: DataService, private cdr: ChangeDetectorRef, public modalController: ModalController, private sqlServ: SqlLiteService, private popOverCtrl: PopoverController,@Inject(PLATFORM_ID) private platformId: Object,public debugService: DebugService) {
    this.fontRange = globalObjects.fontSize;
    this.fontName = "select font";
    this.fontSize = "select font size";
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "setting-page")
    }
  }
  googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
  }

  ngOnInit() {


    this.getServerAppInfo();
    //     import CryptoJS from 'crypto-js';

    const secretKey = 'mySecretKey123'; // your encryption key123
    const textToEncrypt = this.globalObjects.dbName;
    let decrypted_txt = this.encrypt.decryptData("g9qMJ_MenfFGZbnC_Rd8sg==")
    // const encrypted = CryptoJS.AES.encrypt(textToEncrypt, secretKey).toString();+

    console.log('Encrypted text:', textToEncrypt);
    console.log('Decrypted text:', decrypted_txt);

    this.autoAppKey = this.globalObjects.getLocallData("userDetails");


    this.toggleDragMode = this.globalObjects.toggleDrag;
    this.toggleFab = this.globalObjects.toggleFab;
    this.toggleNotification = this.globalObjects.toggleNotification;
    this.toggleVibrate = this.globalObjects.toggleVibrate;
    this.toggleSound = this.globalObjects.toggleSound;
    this.audio = this.globalObjects.audio;
    this.sound = this.audio.sound;
    this.volumeRange = this.audio.volume;
    this.toggleDevloperMode = this.globalObjects.toggleDevloperMode();
    this.executeQueryflag = this.globalObjects.toggleDevloperMode();
    this.imageIconFlag = this.globalObjects.toggleDevloperMode();



    this.fontType = this.globalObjects.getLocallData('fonttype');

    if (this.fontType == 'var(--ion-font-family,inherit)') {
      this.fontType = 'Robot (default)';
    } else if (!this.fontType) {
      this.fontType = this.fontArray[0];

    }
    this.fontSize = this.globalObjects.getLocallData('fontSize');
    if (this.fontSize == '0.875') {
      this.fontSize = '8 (default)';
    } else if (!this.fontSize) {
      this.fontSize = '8 (default)'
    }
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.checkAuthFactor()
  }

  hideOtherlist() {
    if (this.otherlist) {
      this.otherlist = false;
    } else {
      this.otherlist = true;
    }
  }

  vibrateFunc(flag) {

    if (flag) {
      navigator.vibrate(500)
      this.globalObjects.toggleVibrate = true;
    } else {
      this.globalObjects.toggleVibrate = false;
    }
  }

  successCallback(result) {
    alert(JSON.stringify(result)); // true - enabled, false - disabled
  }

  errorCallback(error) {
    alert(JSON.stringify(error));
  }

  screenshotFunc(flag) {

    if (flag) {
      alert(flag + "2");

      document.addEventListener("deviceready", function () {
        var successCallback = function () {
          alert("The screenshots are allowed now again.");
        };

        var errorCallback = function (err) {
          alert("An error ocurred : " + err);
        };

        OurCodeWorldpreventscreenshots.enable(successCallback, errorCallback);
      }, false);
    } else {
      alert(flag + "3");

      document.addEventListener("deviceready", function () {
        var successCallback = function () {
          alert("The screenshots are not allowed now.");
        };

        var errorCallback = function (err) {
          alert("An error ocurred : " + err);
        };

        OurCodeWorldpreventscreenshots.disable(successCallback, errorCallback);
      }, false);
    }
  }

  dragToggle(ev) {
    if (ev) {
      this.globalObjects.toggleDrag = true;
    } else {
      this.globalObjects.toggleDrag = false;
    }
  }

  resetDrag() {
    this.globalObjects.destroyLocalData('dragabledata');
    this.globalObjects.toggleDrag = false;
    this.toggleDragMode = false
  }

  soundFunc(flag) {

    if (flag) {
      this.globalObjects.audio.toggelSound = flag;
      this.globalObjects.toggleSound = true;
    } else {
      this.globalObjects.toggleSound = false;
      this.nativeAudio.unload(this.globalObjects.audio.id).then(() => {
        this.globalObjects.audio = {
          toggelSound: false,
          id: 'assets/audio/click1.mp3',
          sound: 'assets/audio/click1.mp3',
          volume: 0.5
        };
        this.sound = 'assets/audio/click1.mp3';
        this.volumeRange = 0.5;


        this.nativeAudio.preloadComplex(this.sound, this.sound, this.volumeRange, 1, 1).then(() => {
        }, err => {

        })
      }, (err) => {
      });

    }

  }


  volumeChange(range) {
    if (this.globalObjects.toggleSound) {
      this.volumeRange = range;
      this.globalObjects.audio.volume = range;
      this.nativeAudio.setVolumeForComplexAsset(this.sound, range).then((res) => {
        this.nativeAudio.play(this.sound).then(() => {

        }, (err) => {
        });
      })
    }
  }

  selectSound(sound) {
    if (this.globalObjects.toggleSound) {
      this.nativeAudio.unload(this.globalObjects.audio.id).then(() => {

      }, (err) => {
      });
      this.sound = sound;
      this.globalObjects.audio.id = sound;
      this.globalObjects.audio.sound = sound;

      this.nativeAudio.preloadComplex(sound, sound, this.volumeRange, 1, 1).then(() => {
        this.nativeAudio.play(sound).then(() => {

        }, (err) => {
        });

      }, (err) => {
      });
    }
  }

  resetLocalDb() {
    this.sqlServ.deleteAllObject();
  }


  logout() {
    this.globalObjects.fabMannualMode = false;
    this.globalObjects.notiBellMannualMode = false;
    this.events.publish("logOut");
    this.modalController.dismiss();
  }

  openBrowsserBuild() {
     if (isPlatformServer(this.platformId)) return;
    window.open("http://203.193.167.118:9003/LHSAPP/", "_blank");
  }

  //Show and hide notification icon
  toggleNotiFunc(toggleNotification) {
    this.globalObjects.toggleNotification = toggleNotification;
    this.globalObjects.notiBellMannualMode = toggleNotification;
  }

  //Show and hide notification icon
  toggleFabFunc(toggleFab) {
    this.globalObjects.toggleFab = toggleFab;
    this.events.publish("fabMannualMode", true);
  }

  refreshBlob() {
    let lockTime = this.globalObjects.getLocallData("resetBlobDataTime");
    let resetBlobDataCount = this.globalObjects.getLocallData('resetBlobDataCount');
    let expiryTime: any;
    if (lockTime != null && lockTime != "") {
      let lockTime1: any = new Date(lockTime);
      let now: any = new Date();
      expiryTime = Math.abs((lockTime1.getTime() - now.getTime()) / 60000);
    }
    if (resetBlobDataCount) {
      if (resetBlobDataCount > 2) {
        if (expiryTime <= 1) {
          let url = "resetBlobObject";
          this.dataService.getData(url).then((res: any) => {
            let status = res.responseStatus;
            if (status == "success") {
              this.globalObjects.presentAlert("Data refreshed..!!");
              this.globalObjects.destroyLocalData('resetBlobDataCount');
              this.globalObjects.destroyLocalData('resetBlobDataTime');
            }
          })
        } else {
          this.globalObjects.setDataLocally('resetBlobDataCount', 2);
          this.globalObjects.setDataLocally('resetBlobDataTime', new Date());
          this.globalObjects.presentAlert("You have not privilages to refresh object data?");
        }
      } else {
        resetBlobDataCount = resetBlobDataCount + 1;
        this.globalObjects.setDataLocally('resetBlobDataCount', resetBlobDataCount);
        this.globalObjects.presentAlert("You have not privilages to refresh object data?");
      }
    } else {
      this.globalObjects.setDataLocally('resetBlobDataCount', 2);
      this.globalObjects.setDataLocally('resetBlobDataTime', new Date());
      this.globalObjects.presentAlert("You have not privilages to refresh object data?");
    }
  }

  fontZoom2(e) {

    if (e.detail.value == "8 (default)") {
      e.detail.value = 0.875;
      this.globalObjects.setDataLocally("fontSize", 0.875);
      this.globalObjects.increFontsize(0.875);
    }
    else {

      this.globalObjects.fontSize = (e.detail.value) / 10;
      this.globalObjects.setDataLocally("fontSize", this.globalObjects.fontSize);
      this.globalObjects.increFontsize(this.globalObjects.fontSize);
    }

    // this.cdr.detectChanges();

  }
  resetFontandSize() {

    this.globalObjects.destroyLocalData("fontSize");
    this.globalObjects.destroyLocalData("fonttype");
    location.reload();
    this.modalController.dismiss();
  }
  selectFont(event) {
    if (event.detail.value == "Robot (default)") {
      event.detail.value = "var(--ion-font-family,inherit)";
    }
    this.globalObjects.fontype = event.detail.value;
    this.globalObjects.setDataLocally("fonttype", this.globalObjects.fontype);
    this.globalObjects.changeFont(event.detail.value);
    // this.cdr.detectChanges();
  }

  resetFont() {
    this.fontRange = 0.9;
  }

  toggleDevloperModeFunc(event: CustomEvent<{ checked: boolean }>) {
    const enabled = event.detail.checked;
    const toggle = event.target as HTMLIonToggleElement;

    if (!enabled) {
      this.applyDeveloperMode(false);
      return;
    }

    toggle.checked = this.globalObjects.toggleDevloperMode();
    this.globalObjects.approveStatus = false;
    this.globalObjects.getUserRights(() => {
      this.applyDeveloperMode(true);
      toggle.checked = true;
      this.cdr.detectChanges();
    });
  }

  private applyDeveloperMode(enabled: boolean) {
    this.globalObjects.toggleDevloperMode.set(enabled);
    this.globalObjects.getLocalDBData = !enabled;
    this.toggleDevloperMode = enabled;
    this.executeQueryflag = enabled;
    this.imageIconFlag = enabled;
  }

  closePage() {
    this.modalController.dismiss();
  }

  async openChangePassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage,
    });
    modal.onDidDismiss().then(() => {
    });
    return await modal.present();
  }
  async openSqLiteTran() {
    const modal = await this.modalController.create({
      component: SqlLightTranPage,
    });
    return await modal.present();
  }

  async openExecuteQuery() {
    const modal = await this.modalController.create({
      component: ExecuteQueryPage,
    });
    return await modal.present();
  }

  async openIconMaster() {
    const modal = await this.modalController.create({
      component: ImageIconMasterPage,
    });
    return await modal.present();
  }

  async openOfflineEntryTab() {
    const modal = await this.modalController.create({
      component: OfflineEntryTabsPage,
    });
    return await modal.present();
  }
  async opentree() {

    const modal = await this.modalController.create({
      component: TreeCallpagePage,
      componentProps: { paramValue: true },
    });
    modal.onDidDismiss().then(() => {
    });
    return await modal.present();
  }




  changeStyle(item) {
    if (item == 'TAB') {
      if (this.tabImgHeight) {
        let per = ((this.tabImgHeight / 100) * 40);
        let val = 40 + per;
        let str = `height:${val}px;width:${val}px;`;
        let tab: any = document.getElementsByClassName('thumbnail-container');
        if (tab) {
          for (let t of tab) {
            t.setAttribute('style', str);
          }
        }
      }
      if (this.tabFontSize || this.tabFontWeight) {
        let str = "";
        if (this.tabFontSize) {
          let per = ((this.tabFontSize / 100) * 14);
          let val = 14 + per;
          str = str + `font-size:${val}px;`
        } if (this.tabFontWeight) {
          let per = ((this.tabFontWeight / 100) * 500);
          let val = 500 + per;
          str = str + `font-weight:${val};`
        }
        let tab: any = document.getElementsByClassName('new-menu-list');
        if (tab) {
          for (let t of tab) {
            t.getElementsByTagName('h2')[0].setAttribute('style', str);
          }
        }
      }

      if (this.tabPadding) {
        let str = "";
        let tab: any = document.getElementsByClassName('new-menu-list');
        if (tab) {
          let per = ((this.tabPadding / 100) * 1);
          let val = 1 + per;
          str = str + `margin-bottom:${val}px;`
          for (let t of tab) {
            t.setAttribute('style', str);
          }
        }
      }

      if (this.tabStyle) {
        let tab: any = document.getElementsByClassName('new-menu-list');
        if (tab) {
          for (let t of tab) {
            t.classList.add(this.tabStyle);
          }
        }
      }

    }

    if (item == 'KPI') {
      if (this.kpiPadd) {
        let per = ((this.kpiPadd / 100) * 5);
        let val = 5 + per;
        let str = `padding-top:${val}px;padding-bottom:${val}px;`;
        let tab: any = document.getElementsByClassName('inner-textband');
        if (tab) {
          for (let t of tab) {
            t.setAttribute('style', str);
          }
        }
      }

      if (this.kpiHeadFont || this.kpiHeadWeight) {
        let str = "";
        if (this.kpiHeadFont) {
          let per = ((this.kpiHeadFont / 100) * 20);
          let val = 20 + per;
          str = str + `font-size:${val}px;`
        } if (this.kpiHeadWeight) {
          let per = ((this.kpiHeadWeight / 100) * 400);
          let val = 400 + per;
          str = str + `font-weight:${val};`
        }
        let tab: any = document.getElementsByClassName('inner-textband');
        if (tab) {
          for (let t of tab) {
            t.getElementsByTagName('h4')[0].setAttribute('style', str);
          }
        }
      }

      if (this.kpiValueFont || this.kpiValWeight) {
        let str = "";
        if (this.kpiValueFont) {
          let per = ((this.kpiValueFont / 100) * 14);
          let val = 14 + per;
          str = str + `font-size:${val}px;`
        } if (this.kpiValWeight) {
          let per = ((this.kpiValWeight / 100) * 300);
          let val = 300 + per;
          str = str + `font-weight:${val};`
        }
        let tab: any = document.getElementsByClassName('inner-textband');
        if (tab) {
          for (let t of tab) {
            t.getElementsByTagName('h5')[0].setAttribute('style', str);
          }
        }
      }
    }
  }

  resetStyle() {
    location.reload();
  }

  downloadAgentSetup() {
    if (!(this.platform.is('android') || this.platform.is('ios'))) {
       if (isPlatformServer(this.platformId)) return;
      if (window.location.href.toString().includes("192.168.100.21") || window.location.href.toString().includes("localhost")) {
        let url = "http://192.168.100.16:8888/lhsws/NI/T1/1111/NNNN/AAA/OJJJG/downloadAnyFile?file=C:/lhs-app-agent/Setup.exe";
        window.open(url, "_blank");
      } else {
        let url = "http://203.193.167.118:9003/lhsws/NI/T1/1111/NNNN/AAA/OJJJG/downloadAnyFile?file=C:/lhs-app-agent/Setup.exe";
        window.open(url, "_blank");
      }
    }
  }

  ngOnDestroy() {
    this.userDetails=null;
    console.clear()
  }


   qrImageUrl=""
  showOtpModal=false
  authData:any=""
  isCallStatusChange=false
  checkAuthFactor(){
    
    let url='auth/2fa/status?userCode=' + this.userDetails.user_code
    this.dataService.getData(url).then(async(res:any)=>{
      if(res.responseStatus=="success" ){
     this.authData= structuredClone(res.responseData) ?? {};

        if (Object.keys(this.authData).length === 0 || this.authData.two_fa_flag=="P" || this.authData.two_fa_flag=="F") {
          this.isFactorEnable=false
        } else if(this.authData.two_fa_flag=="T") {
          this.isFactorEnable=true
          // this.isCallStatusChange=true
          if(this.authenticatorToggle){
            this.authenticatorToggle.checked = true;
          }
        }

      }else{
         await this.msgShow(res.responseMsg,"JMS")
      }
    })
  }
otp=""
 isFactorEnable=false
  verifyAuth(){
    
    this.globalObjects.loading_on_demand.update(() => true);
    if(this.isGettingOtp){
      this.verifyotp()
    }
    else{

 
    let url=`auth/2fa/verify-otp?userCode=${this.userDetails.user_code}&otp=${this.otp}`
    this.dataService.getData(url).then(async(res:any)=>{
        this.globalObjects.loading_on_demand.update(() => false);
      if(res.responseStatus=="success"){
       await this.msgShow(res.responseMsg,"JMI")
        this.isFactorEnable=true
        this.showOtpModal=false
      } else if(res.responseStatus=="error" && res.responseMsg=="Invalid OTP"){
         await this.msgShow(res.responseMsg,"JMS")
             this.setVal("")
         return false;
      }else{
       await this.msgShow(res.responseMsg,"JMS")
        this.setVal("")
        return false;
      }
    })
       }
  }
  statusChangeOfFactor(mfa_flag){
      let data={
      user_code:this.userDetails.user_code,
      app_code:this.userDetails.app_code_str,
      app_name:"",
      twoFA_flag:mfa_flag}
       let url=`auth/2fa/update-status?userCode=${this.userDetails.user_code}&twoFAFlag=${mfa_flag}`
    this.dataService.getData(url).then(async (res:any)=>{
      // this.isFactorEnable=true
      if(res.responseStatus=="success"){
       
      } else if(res.responseStatus=="error" && res.responseMsg=="Invalid OTP"){
        //  this.globalObjects.displayCordovaToast("Please enter valid OTP");
        await this.msgShow(res.responseMsg,"JMS")
         return false;
      }else{
        //  this.globalObjects.displayCordovaToast("Please enter valid OTP");
        await this.msgShow(res.responseMsg,"JMS")
         return false;
      }
    })
  }

   authchange(event){
    if(this.isCallStatusChange){
      this.isCallStatusChange=false
    }else{
      if (Object.keys(this.authData).length === 0 || this.authData.two_fa_flag=="P") {
        if(event.detail.checked==true){
            this.getOtp()
          }else{
            this.isFactorEnable=false
            this.showOtpModal=false
            if(this.authenticatorToggle){
              this.authenticatorToggle.checked = false;
            }
            
          }
        } else {
          if(event.detail.checked==true){
            this.statusChangeOfFactor("T")
          }else{
            this.statusChangeOfFactor("F")
          }
          
        }
    }
     
  }



 showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
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

  toggleDisable(){
    if(this.ngOtpInput.otpForm){
      if(this.ngOtpInput.otpForm.disabled){
        this.ngOtpInput.otpForm.enable();
      }else{
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
 
  closeotpPopup(){
    this.showOtpModal=false;
    this.setVal("")
    this.isFactorEnable=false
    if(this.authenticatorToggle){
      this.authenticatorToggle.checked = false;
    }
  }

  async msgShow(resArr: any,paratype) {
    let alertmessage = {
      para_type:paratype,
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

  messageShow=""
  isGettingOtp=false
   getOtp() {
    let urlendpoint;
      urlendpoint = "getOtp";
    this.globalObjects.logout = false;
    let deviceValidation = this.globalObjects.getLocallData("device_validation");
    let token = this.globalObjects.getLocallData("device_token");
    let appKey = "";
    if (this.globalObjects.simpleLoginProcess) {
      appKey = this.globalObjects.getLocallData("appKey");
    } else {
      appKey = this.globalObjects.getLocallData("parentAppkey");
    }
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
 url = 'getOtp?userId=' + (this.userDetails.user_code) + '&password=' + "" +
      '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
      + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&OTPFlag="
      + "" + + "&entityCodeStr="
      + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
      + "&latitude=" + "" + "&longitude=" +"" + "&platform=" + encodeURIComponent(platform)
      + "&location=" + encodeURIComponent(JSON.stringify(loc_address)) + "&otp_medium=" + "GM_2FA" + "&action_type=''";

this.globalObjects.loading_on_demand.update(() => true);
    this.dataService.getData(url).then(async (res: any) => {
    
      this.globalObjects.loading_on_demand.update(() => false);
      if (res.responseStatus == "success") {
        if(res.responseData && res.responseData.email != null){
        this.messageShow = `A 6-digit verification code has been sent to your registered email ${res.responseData.email}`;
        this.showOtpModal= true;
        this.isGettingOtp = true;
          this.countdown = 30; // start 30-sec timer
          this.startCountdown();
        }

      }
      else {
        await this.msgShow(res.responseMsg, "JMS")
        this.isFactorEnable = false
        if (this.authenticatorToggle) {
          this.authenticatorToggle.checked = false;
        }
      }

    });
 
  }
    verifyotp(){ 
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

    // this.appDataArr = this.globalObjects.getLocallData("appData");
    // if (this.appDataArr) {
    //   this.globalObjects.destroyLocalData("appData")
    // }
    // let latitude: any = this.backgroundService.latitude;
    // let longitude: any = this.backgroundService.longitude;
    // let loc_address: any;


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
    let login_value = ""
      url = urlendpoint + '?userId=' + (this.userDetails.user_code) + '&password=' + null +
        '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
        + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + appKey + "&appkeyValidationFlag=" + deviceValidation + "&entityCodeStr="
        + encodeURIComponent(entityCodeStr) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
        + "&latitude=" + null+ "&longitude=" + null + "&platform=" + encodeURIComponent(platform)
        + "&location=" +null + "&otp_medium=" +"GM_2FA" + "&login_value=" + null + "&otp_value=" + encodeURIComponent(this.otp)+"&action_type=null";
   
 
   
        this.dataService.getData(url).then(async (res: any) => {
        this.globalObjects.loading_on_demand.update(() => false);
       if(res.responseStatus=="success"){
        this.isGettingOtp=false;
        this.setVal("") 
        this.registerAuthenticator()
      } else if(res.responseStatus=="error" && res.responseMsg=="Invalid OTP"){
         await this.msgShow(res.responseMsg,"JMS")
         this.ngOtpInput.setValue("");
         this.otp="";
         return false;
      }else{
        //  this.globalObjects.displayCordovaToast("Please enter valid OTP");
       await this.msgShow(res.responseMsg,"JMS")
        this.ngOtpInput.setValue("");
        this.otp="";
        return false;
      }

    });
  }
countdown=0
    startCountdown() {
    const timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }
  resendOtp(){
     this.setVal("") 
    if(this.isGettingOtp){
      this.getOtp()
    }
    // else{
    //   this.registerAuthenticator()
    // }
  }

  registerAuthenticator(){
      this.globalObjects.loading_on_demand.update(() => true);
    let app_name=this.globalObjects.getLocallData("app_name")??"";
          const payload = {
            user_code: this.userDetails.user_code,
            app_code: this.userDetails.app_code_str,
            app_name: app_name,
            next:"",
            wma_user_name: this.userDetails.wma_user_name,
          user_type:this.userDetails.user_type
          }
            this.dataService.authFactor("auth/2fa/register",payload).then(async(res:any)=>{
                    this.globalObjects.loading_on_demand.update(() => false);
              if(res.responseStatus== 'success' && res.responseData.qr != null){
                                        const base64Qr = res.responseData.qr;
                      this.qrImageUrl = `data:image/png;base64,${base64Qr}`;
                      this.showOtpModal = true
          //              this.countdown = 30; // start 30-sec timer
          // this.startCountdown();
              }else{
                await this.msgShow(res.responseMsg,"JMS")
                this.isFactorEnable=false
                if(this.authenticatorToggle){
                  this.authenticatorToggle.checked = false;
                }
               
              }
            })
  }
    getServerAppInfo(){
  let url = 'getbuildInfo';
    this.dataService.getVersionData1(url)
      .then(res => {
        var data: any = res;
        let resData:any=data.responseMsg.split("#");
        if(resData.length>1){
        this.serverAppBuildDate=resData[0];
        this.serverAppBuildVersion=resData[1];}
      }, err => {
        console.log("server status not get build information of app server.");
        // this.imgData = null;
      })
  
    }
    viewLogs(){
    let url = window.location.origin + "/LOGS";
    window.open(url, "_blank");
  }
  
  toggleConsole(event) {
    if (this.debugService.consoleEnabled) {
      this.debugService.enableConsole();
    } else {
      this.debugService.disableConsole();
    }
  }
}
