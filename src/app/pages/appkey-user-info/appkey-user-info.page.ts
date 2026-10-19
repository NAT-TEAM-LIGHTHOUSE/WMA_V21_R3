import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { UserauthenticationService } from 'src/app/services/userauthentication.service';
// import { UsersettingPage } from '../usersetting_old/usersetting.page';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { UsersettingPage } from '../usersetting/usersetting.page';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-appkey-user-info',
  templateUrl: './appkey-user-info.page.html',
  styleUrls: ['./appkey-user-info.page.scss'],
})
export class AppkeyUserInfoPage implements OnInit {

  thead: any[];
  tablerows: any[];
  tablerowsres: any[];
  searchText: any;
  appKey: string;
  appCode: string;
  public loginValid: any = {};
  paswordToggle: any = "hidetext";
  object_code = "";

  @Input() resData: any;
  // urlArr = [
  //   "https://b2bsangam.com/lhsws/getServerDetails",
  //    "https://app.lighthouseerp.com/lhsws/getServerDetails",
  //   "http://203.193.167.118:8888/lhsws/getServerDetails",
  //   "http://192.168.100.21:8888/lhsws/getServerDetails"
  // ]
  

  urlArr = [
   "https://app.lighthouseerp.com/lhsws_wma/getServerDetails",
   "http://203.193.167.118:9003/lhsws_wma/getServerDetails",
   "http://192.168.100.21:8888/lhsws_wma/getServerDetails"
  ]
  count = 0;

  constructor(private el: ElementRef, navParam: NavParams, private navCtrl: NavController, private modalctrl: ModalController, private platform:Platform,
    public globalObjects: GlobalObjectsService, private device: Device, private httpClient: HttpClient, 
    private userService : UserauthenticationService, private dataService: DataService, private events: Events) {
    let res: any = navParam;
    this.thead = res.data.responseData.HEADING;
    this.tablerows = res.data.responseData.BODY;
    this.appKey = res.data.appKeyDetails.app_key;
    this.appCode = res.data.appKeyDetails.app_code;
    this.tablerowsres = res.data.responseData.BODY;
      this.object_code = res.data.appKeyDetails.calling_object_code;
    //console.log(this.tablerowsres);
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"appkey-user-info")
    }

  }

  ngOnInit() {
  }

  filterTable() {
    this.tablerows = this.tablerowsres.filter((item: any) => {

      if (item.user_code && item.user_code.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      } else if (item.client_name && item.client_name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
      else if (item.password && item.password.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
      else if (item.module && item.module.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
      else if (item.apps_name && item.apps_name.toLowerCase().includes(this.searchText.toLowerCase())) {
        return item;
      }
    })
  }

  closeModal() {
    this.modalctrl.dismiss({
      'dismissed': true
    });
  }

  showPassword(event) {
    let showCount = this.globalObjects.getLocallData("showCount");
    if (showCount) {
      if (showCount >= 2) {
        //event.srcElement.classList = "";
        this.paswordToggle = ""
        this.globalObjects.setDataLocally("showCount", 0);
      }
      else {
        this.globalObjects.setDataLocally("showCount", showCount + 1);
      }
    }
    else {
      this.globalObjects.setDataLocally("showCount", 1);
    }
    ////console.log("Event:", event);
  }

  loginByPass(rowData) {
    

    if (this.appKey) {
      // this.destroyLocalData();
      rowData.user_code;
      let user = {
        user_code: (rowData.user_code).trim(),
        password: rowData.password
      }
      this.globalObjects.setDataLocally("tempUser", user);
      let base_url = this.urlArr[0];
      var data = {
        "parameters": {
          "appKey": this.appKey,
          "device_id": this.device.uuid,
          "device_name": this.device.model,
          "platform": this.globalObjects.platformVal
        }
      }
      this.httpClient.post(encodeURI(base_url), data).subscribe((resData:any) => {

        var appData: any = {};
        appData.app_name = resData.responseData.app_name;
        appData.appkey = this.appKey.toUpperCase();
        appData.loginFlag = resData.responseData.loginFlag;
        appData.resData = resData.responseData;
        this.modalctrl.dismiss();
        this.modalctrl.dismiss();
        this.userService.selectAppkey(appData).then(()=>{
          this.globalObjects.loginBypass = true;
        })
      }, err => {
        this.count++;
        if(this.count ==3){
          this.globalObjects.presentAlert("LHS Server Connectivity Issue...");
        }else{
          this.ngOnInit();
        }
        
      })
    }

  }

  loginBypass(rowData, responseData){
    let token = this.globalObjects.getLocallData("device_token");

    let url = 'login?userId=' + (rowData.user_code).trim() + '&password=' + encodeURIComponent(rowData.password) +
    '&deviceId=' + encodeURIComponent(this.globalObjects.device.uuid) + '&deviceName=' + encodeURIComponent(this.globalObjects.device.model)
    + '&notificationToken=' + encodeURIComponent(token) + "&appKey=" + rowData.app_key + "&appkeyValidationFlag=" + responseData.device_validation + "&OTPFlag=" + ""
    + "&entityCodeStr=" + encodeURIComponent(responseData.entity_code_str) + "&appCode=" + encodeURIComponent(this.globalObjects.getLocallData('appCode'))
    + "&latitude=" + encodeURIComponent(this.globalObjects.latitude1) + "&longitude=" + encodeURIComponent(null) + "&platform=" + encodeURIComponent(this.globalObjects.platformVal)
    + "&location=" + encodeURIComponent(null);

    this.dataService.getData(url).then((data: any) => {
      this.loginValid = data;
     
        if (this.loginValid.responseMsg === "User is authenticated") {

          // if (this.loginValid.responseData.gps_mandatory_flag == 'Y' && (this.platform.is('ios') || this.platform.is('android'))) {
          //   this.globalObjects.checkGPSPermission().then(() => {
          //     this.validatePlatform(loginFlag);
          //   }, (err) => {
          //     this.globalObjects.presentAlert("You can not access app without location permission. Please allow location permission.");
          //   })
          // } else {
          //   this.validatePlatform(loginFlag);
          // }
          this.login(rowData)
          if (this.loginValid.responseData.massege) {
            this.globalObjects.presentAlert(this.loginValid.responseData.massege);
          }

        }
        else {
          this.globalObjects.presentAlert(this.loginValid.responseMsg);
        }
   
    }, err => {
      //console.log(err);
      this.globalObjects.presentAlert("Server error, URl not found....");
    })
  }


  destroyLocalData() {

    this.globalObjects.destroyLocalData("userDetails");
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
    this.globalObjects.destroyLocalData("clickedItem");
    this.globalObjects.destroyLocalData("sidemenulov");
  }

  login(rowData) {
    if (this.loginValid.responseStatus === "success") {
      this.loginValid.responseData.password = rowData.password
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
     
      if(parseInt(pcnt)>0){
        this.popoveruser().then(() => { 
        });
        this.modalctrl.dismiss();
      }else{
        setTimeout(() => {
          this.modalctrl.dismiss();
          this.navCtrl.navigateRoot('super');
          this.events.publish("refreshOnViewChangeBypass");
        }, 1000);
      }

    }
  }

  async popoveruser() {
    // this.router.navigate(["/usersetting",{userValueList: this.globalObjects.userValueListfromglobal}], );
    let popUp = await this.modalctrl.create({
      component: UsersettingPage,
      componentProps: {
        userValueList: this.globalObjects.userValueListfromglobal,
        flag:false
      },
      backdropDismiss: false
    });
    popUp.present();

    popUp.onDidDismiss().then(()=>{
      this.events.publish("refreshOnViewChangeBypass");
    })

  }
}
