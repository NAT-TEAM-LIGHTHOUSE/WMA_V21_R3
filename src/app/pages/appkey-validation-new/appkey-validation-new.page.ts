import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { Events } from 'src/app/services/events';
import { Router } from '@angular/router';
import { catchError, filter, merge, of, Subject, take, takeUntil, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { environment } from 'src/environments/environment';
import { AlertMsgBoxesPage } from '../alert-msg-boxes/alert-msg-boxes.page';
import { IonInput, MenuController,  Platform, PopoverController } from '@ionic/angular/standalone';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
  selector: 'app-appkey-validation-new',
  templateUrl: './appkey-validation-new.page.html',
  styleUrls: ['./appkey-validation-new.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,STANDALONE_IMPORTS]
})
export class AppkeyValidationNewPage implements OnInit {
  @ViewChild('autofocus') searchbar: IonInput;
  appkey: any;
  resStatus: boolean = false;
  disableFlag: boolean = false;
  autocompleteItems = [];
  showAuto: boolean = false;
  searchedAppKey = [];
  serverName = "lhs";
  private destroy$ = new Subject<void>();
  constructor(private router: Router, public events: Events, public globalObjects: GlobalObjectsService, public popOverCtrl: PopoverController, private encryption: EncryptionService,
    public menuCtrl: MenuController, public httpClient: HttpClient, private device: Device, private plt: Platform) {
    if (!this.globalObjects.getLocallData("isAppLaunch")) {
      this.menuCtrl.enable(false);
    }
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "appkey-validation")
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      if (this.searchbar) { this.searchbar.setFocus() }
    }, 300);
  }
  ngOnInit() {
    this.globalObjects.loaderFlag = false;
    this.menuCtrl.enable(false)
    this.globalObjects.simpleLoginProcess = true;
    this.plt.ready().then(() => {
      let appkeyGpsFlag = this.globalObjects.getLocallData("appkeyGpsFlag");
      if ((this.plt.is('android') || this.plt.is('ios')) && !appkeyGpsFlag) {
        this.globalObjects.checkGPSPermission();
        this.globalObjects.setDataLocally("appkeyGpsFlag", "T");
      } else {
        this.globalObjects.getLocation();
      }
    })

    this.searchedAppKey = this.globalObjects.getLocallData("autoAppKey") ? this.globalObjects.getLocallData("autoAppKey") : [];
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
    //  if (this.focusTimeout) {
    //   clearTimeout(this.focusTimeout);
    // }
    this.destroy$.next();
    this.destroy$.complete();
  }


  save(appkey) {
    appkey = appkey.trim();
    this.globalObjects.loaderFlag = true;
    this.disableFlag = true;
    this.resStatus = true;
    this.globalObjects.breadCrumpsArray = [];
    // var url = "http://192.168.100.195:8080/DynamicAppWS/webService/getServerDetails?appKey=" + appkey +
    // var url = "http://203.193.167.118:8888/DynamicAppWSV3/webService/getServerDetails?appKey=" + appkey +
    //   "&device_id=" + this.device.uuid + "&device_name=" + this.device.model;

    let appkeyTryCount = this.globalObjects.getLocallData("appkeyTryCount");
    this.globalObjects.setDataLocally("appkeyTryCount", appkeyTryCount + 1);
    let lockTime = this.globalObjects.getLocallData("appkeyLockTime");
    let expiryTime: any;
    if (lockTime != null && lockTime != "") {
      let lockTime1: any = new Date(lockTime);
      let now: any = new Date();
      expiryTime = Math.abs((lockTime1.getTime() - now.getTime()) / 60000);
    }

    if (appkeyTryCount < 3) {
      if (appkeyTryCount == 2) {
        this.globalObjects.setDataLocally("appkeyLockTime", new Date());
      }
      this.precessRequest(appkey, 1);
    } else if (expiryTime > 10) {
      this.globalObjects.destroyLocalData("appkeyTryCount");
      this.globalObjects.destroyLocalData("appkeyLockTime");
      this.precessRequest(appkey, 1);
    } else {
      this.disableFlag = false;
      this.globalObjects.loaderFlag = false;
      this.globalObjects.presentToastWithOptions(`You have exceeded unsuccessful attempt. Please try after ${Math.round(10 - expiryTime)} minutes.`, "errorClass");
    }
  }


  precessRequest(appkey, attempt) {

    let base_url = "getServerDetails";
    // let base_url = "http://192.168.100.149:8888/lhsws/getServerDetails";
    // let base_url = "http://192.168.100.233/lhsws/getServerDetails";
    // let base_url = "http://ars-alb-338143226.ap-south-1.elb.amazonaws.com:8080/lhsws/getServerDetails";
    // if (this.globalObjects.getOnlineStatus) {
    let platform;
    if (this.plt.is("android")) {
      platform = "android";
    } else if (this.plt.is("ios")) {
      platform = "ios";
    } else {
      platform = "browser";
    }
    var data = {
      "parameters": {
        "appKey": appkey,
        "device_id": this.device.uuid,
        "device_name": this.device.model,
        "platform": platform,
        "urlencryptFlag": this.globalObjects.urlencryptFlag ? "T" : "F",
        // "local_app_key" : this.globalObjects.propertiesFlag ? "T" : "F"

      }
    }

    this.getAppkeyData(base_url, data, attempt).then(async data => {
      var resData: any = data;
      this.resStatus = false;
      var responseData = resData.responseData;
      var responseMsg = resData.responseMsg;
      if (resData.responseStatus == "success") {
        var msg = responseMsg.split("#");

        let existKey = this.searchedAppKey.find(x => x == appkey);
        if (existKey) { } else {
          this.searchedAppKey.push(appkey);
        }

        this.globalObjects.setDataLocally("autoAppKey", this.searchedAppKey);
        this.globalObjects.parentAppkey = appkey;
        this.globalObjects.setDataLocally("parentAppkey", appkey);
        if (this.plt.is('android') || this.plt.is('ios')) {
          this.events.publish('generateToken');
        }

        if ((msg[0] == "T") || (msg[0] == "F") || (responseMsg.charAt(1) != "#")) {


          var server_url = "";
          var server_url2 = "";
          var server_url3 = "";
          var server_url4 = "";

          // let checkenrypt=this.encryption.decryptData(responseData.entity)
          // if(checkenrypt && checkenrypt.error=="Decryption failed"){
          //   this.globalObjects.urlencryptFlag=false;
          // }
          // responseData.serverUrl="http://192.168.100.156:8888"
          if (responseData.serverUrl && responseData.serverUrl.indexOf('http') > -1) {
            server_url = responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          } else {
            server_url = "http://" + responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }

          if (responseData.server_url2 && responseData.server_url2.indexOf('http') > -1) {
            server_url2 = responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          } else {
            server_url2 = "http://" + responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }
          if (responseData.server_url3 && responseData.server_url3.indexOf('http') > -1) {
            server_url3 = responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          } else {
            server_url3 = "http://" + responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }
          if (responseData.server_url4 && responseData.server_url4.indexOf('http') > -1) {
            server_url4 = responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          } else {
            server_url4 = "http://" + responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/";
          }
          var appData: any = {};
          appData.app_name = resData.responseData.app_name;
          let icon_image = this.globalObjects.setDataLocally("icon_img", resData.responseData.icon_img);
          appData.appkey = appkey.toUpperCase();
          appData.loginFlag = resData.responseData.loginFlag;
          appData.resData = resData.responseData;

          this.globalObjects.setDataLocally("app_type", resData.responseData.app_type ?? '');
          var appArr: any = this.globalObjects.getLocallData("appData");
          if (appArr) {
            let isExsist = false;
            for (let app of appArr) {
              if (app.appkey.toUpperCase() == appkey.toUpperCase()) {
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
          //=----------------------------------------------
          this.globalObjects.setDataLocally("appKey", appkey.toUpperCase());
          this.globalObjects.setDataLocally("app_name", responseData.app_name);
          this.globalObjects.setDataLocally("appCode", responseData.appcode);
          this.globalObjects.setDataLocally("g_group_code", responseData.g_group_code);
          this.globalObjects.setDataLocally("webapplink", responseData.webapplink);
          if (responseData.tenantId) {
            this.globalObjects.setDataLocally("tenantId", responseData.tenantId);
          } else {
            this.globalObjects.setDataLocally("tenantId", responseData.dbName);
          }

          if (responseData.default_theme) {
            this.globalObjects.appTheme = responseData.default_theme;
            this.globalObjects.setDataLocally("theme", responseData.default_theme);
          }

          this.globalObjects.setDataLocally("isAppLaunch", true);
          this.globalObjects.setDataLocally("scopeUrl", server_url);
          this.globalObjects.setDataLocally("server_url1", server_url);
          this.globalObjects.setDataLocally("server_url2", server_url2);
          this.globalObjects.setDataLocally("server_url3", server_url3);
          this.globalObjects.setDataLocally("server_url4", server_url4);
          this.globalObjects.setDataLocally("dbName", responseData.dbName);
          this.globalObjects.setScopeUrl(server_url);
          this.globalObjects.setDataLocally("entity_code_str_appkey", responseData.entity_code_str);
          this.globalObjects.setDataLocally("entity_code_appkey", responseData.entity);
          let dbinitdetails = "?minIdel=" + (responseData.minIdel ? responseData.minIdel : null)
            + "&maxIdel=" + (responseData.maxIdel ? responseData.maxIdel : null)
            + "&maxTotal=" + (responseData.maxTotal ? responseData.maxTotal : null);
          this.globalObjects.setDataLocally("dbinitdetails", dbinitdetails);
          if (msg[0] == "F") {
            this.globalObjects.presentAlert(msg[1]);
          }
          this.globalObjects.applogo = responseData.icon_img;
          this.globalObjects.checkAndSetScopeUrl().then(data => {
            this.globalObjects.loaderFlag = false;
            this.disableFlag = false;
            this.resStatus = false;
            this.router.navigate(['login']);

            this.globalObjects.destroyLocalData("appkeyTryCount");
            this.globalObjects.destroyLocalData("appkeyLockTime");
          }, err => {
            this.globalObjects.loaderFlag = false;
            this.disableFlag = false;
            this.resStatus = false;
          })
        }
        else {
          this.globalObjects.loaderFlag = false;
          this.disableFlag = false;
          this.resStatus = false;
          this.globalObjects.presentAlert(msg[1]);
        }
        this.globalObjects.setDataLocally("device_validation", responseData.device_validation);
      } else {
        this.globalObjects.loaderFlag = false;
        this.disableFlag = false;
        this.resStatus = false;
        // this.globalObjects.presentToastWithOptions(resData.responseMsg, "errorClass");
        let alertmessage = {
          para_type: "JMS",
          para_value: resData.responseMsg
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
    }, err => {

      if (err == 3) {
        this.globalObjects.loaderFlag = false;
        this.disableFlag = false;
        this.resStatus = false;
        if (!this.globalObjects.networkStatus && (this.plt.is('android') || this.plt.is("ios"))) {
          this.globalObjects.presentAlert("You are offline now.");
        }
        this.globalObjects.destroyLocalData("appkeyTryCount");
        this.globalObjects.presentAlert("Connectivity issue. Please try again");
      } else {
        this.precessRequest(appkey, err + 1)
      }

    });


  }

 getAppkeyData(url, data, attempt?) {
    // return new Promise((resolve, reject) => {
    //   let lhsMainUrl = environment.lhsServerUrl[0] + url;
    //   let awsUrl = environment.lhsServerUrl[1] + url;
    //   let lhsUrl = environment.lhsServerUrl[2] + url;
    //   let lhsUrlNew = environment.lhsServerUrl[3] + url;
    //   let localUrl = window.location.origin + '/lhsws_wma/' + url;
    //   // let localUrl = 'http://192.168.100.143:8888'+ '/lhsws_wma/' + url;
    //   let reqStatus = true;
    //   let errorCount = 0;


    //   this.httpClient.post(lhsMainUrl, data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       sessionStorage.setItem("success_url", lhsMainUrl);
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 5) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 5) {
    //       reject(attempt);
    //     }
    //   });

    //   this.httpClient.post(lhsUrl, data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       sessionStorage.setItem("success_url", lhsUrl);
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 5) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 5) {
    //       reject(attempt);
    //     }
    //   });

    //   this.httpClient.post(awsUrl, data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       sessionStorage.setItem("success_url", awsUrl);
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 5) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 5) {
    //       reject(attempt);
    //     }
    //   });


    //   this.httpClient.post(lhsUrlNew, data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       sessionStorage.setItem("success_url", lhsUrlNew);
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 5) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 5) {
    //       reject(attempt);
    //     }
    //   });


    //   let localData = {
    //     ...data,
    //     parameters: {
    //       ...data.parameters,
    //       local_app_key: this.globalObjects.propertiesFlag ? "T" : "F"
    //     }
    //   };
    //   this.httpClient.post(localUrl, localData).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
    //     if (reqStatus && res.responseStatus == 'success') {
    //       sessionStorage.setItem("success_url", localUrl);
    //       resolve(res);
    //       reqStatus = false;
    //     } else {
    //       errorCount++;
    //       if (errorCount == 5) {
    //         resolve(res);
    //       }
    //     }
    //   }, (error) => {
    //     errorCount++;
    //     if (errorCount == 5) {
    //       reject(attempt);
    //     }
    //   });
    // })
    console.log("getAppkeyData - appkeyvalidata")

      let lhsMainUrl = environment.lhsServerUrl[0] + url;
      let awsUrl = environment.lhsServerUrl[1] + url;
      let lhsUrl = environment.lhsServerUrl[2] + url;
      let lhsUrlNew = environment.lhsServerUrl[3] + url;
      let localUrl = window.location.origin + '/lhsws_wma2/' + url;
      const urls = [lhsMainUrl, lhsUrl, awsUrl, lhsUrlNew, localUrl];
      let localData = {
          ...data,
          parameters: {
            ...data.parameters,
            local_app_key: this.globalObjects.propertiesFlag ? "T" : "F"
          }
      };
      let datapost="";
      return merge(
        ...urls.map(url =>(
        url===localUrl ? datapost=localData : datapost=data,
         this.httpClient.post(url, datapost).pipe(
            catchError(() => of(null)), // ignore errors
            filter((res: any) => res?.responseStatus === 'success' || res?.responseStatus === 'error'), // only consider success or failure responses
            tap((res) =>res?.responseStatus === 'success' && sessionStorage.setItem("success_url", url))
          ))
        )
      ).pipe(take(1)).toPromise();
  }






  validateObjects(serverUrl, appkey) {
    return new Promise((resolve, reject) => {
      // let url =  "http://192.168.100.60:8888/lhsws/LW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA10G/" + 'validateObjects?appkey=' + appkey;
      let url = encodeURI(serverUrl + 'validateObjects?appkey=' + appkey);
      this.httpClient.get(encodeURI(url)).subscribe((res: any) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    })
  }



  UpdateSearchResults(s) {
    this.autocompleteItems = [];
    let query = s.toLowerCase();
    let items = this.searchedAppKey.filter(item => item.toLowerCase().indexOf(query) >= 0);

    if (items.length > 0) {

      for (let b of items) {
        let exist = this.autocompleteItems.find(x => x == b);

        if (exist) { } else {
          this.autocompleteItems.push(b);

        }
      }
    }
  }

  SelectSearchResult(item) {
    this.appkey = item;
    this.showAuto = false;
  }

  onFocus() {
  }

  onBlur() {
  }



  camera() {

  }
}
