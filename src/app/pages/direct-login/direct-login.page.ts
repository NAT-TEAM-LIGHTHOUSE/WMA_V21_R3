import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-direct-login',
  templateUrl: './direct-login.page.html',
  styleUrls: ['./direct-login.page.scss'],
})
export class DirectLoginPage implements OnInit {

  constructor(private platform: Platform,public navCtrl: NavController, private lhs_lib: LhsLibService, private sqlLiteServ: SqlLiteService, private encryptData: EncryptionService, private dataService: DataService, private route: ActivatedRoute, private globalObjects: GlobalObjectsService) { }
  id: any;
  userValueList: any = [];
  userDetails: any;

  ngOnInit() {
    this.userDetails = this.globalObjects.getLocallData('userDetails');
    // alert("Direct Login in progress...");
    this.globalObjects.destroyLocalData("ssoAppFlag");
    this.globalObjects.ssoflag = true;
    this.globalObjects.setDataLocally("ssoAppHeaderFlag", "true");
    let loginDetails: any;
    this.route.paramMap.subscribe(params => {
      loginDetails = params.get('name');
      this.userValueList = this.globalObjects.getLocallData('userValueList')


      let urlencryptFlag = this.globalObjects.urlencryptFlag;
      let urlencryptedFlag = urlencryptFlag ? "T" : "F";

       let url = `https://wma.lighthouseindia.com/lhsws_wma/getOpoDetails/${urlencryptedFlag}/${loginDetails}`
     // let url = `http://192.168.100.234:8282/lhsws_wma/getOpoDetails/${urlencryptedFlag}/${loginDetails}`

      if (loginDetails && loginDetails.includes("template")) {
        let dbtype: any = "";
        if (loginDetails.includes("-LIVE")) {
          loginDetails = loginDetails.replace("-LIVE", "");
          dbtype = "-LIVE";

        } else if (loginDetails.includes("-TEST")) {
          loginDetails = loginDetails.replace("-TEST", "");
          dbtype = "-TEST";
        } else if (loginDetails.includes("-DEV")) {
          loginDetails = loginDetails.replace("-DEV", "");
          dbtype = "-DEV";
        } else {
          dbtype = "";
        }

        let decryptUrlData = atob(loginDetails.replace("template", ""));






        // let decryptUrlData=(loginDetails.replace("template",""));

        // let templateObj:any=JSON.parse(decryptUrlData);




        let decryptUrl = this.encryptData.decryptData(decryptUrlData);
        console.log("decrypted data : " + decryptUrl);
        let loginData: any = JSON.parse(decryptUrl);
        let loginTemplateUrl = loginData.loginURL;

        // let loginTemplateUrl=  this.encryptData.decryptData(templateObj.loginURL);
        console.log("login template url : ", loginTemplateUrl);
        this.globalObjects.setDataLocally("gettemplateDetails", loginTemplateUrl);
        let bypassAppkey = loginData.appKey + dbtype;

        let appUrl = loginData.appUrl;



        // url=`http://192.168.100.143:8888/lhsws_wma/getOpoDetails/${bypassAppkey}`;
        // url=`http://192.168.100.101:8282/lhsws_wma/getOpoDetails/${bypassAppkey}`;
        if (urlencryptFlag) {
          url = `${appUrl}lhsws_wma/getOpoDetails/${urlencryptedFlag}/${bypassAppkey}`;

        } else {
          url = `${appUrl}lhsws_wma/getOpoDetails/${bypassAppkey}`;

        }

        // "{"loginURL":"C:\\Users\\tejas.mendhule\\Downloads","appKey":"TDJiVlpobWlwbklNeVV1UXdxZVZtUT09"}"
      }




      this.getDirLogin(url);

    });
  }


  getDirLogin(url) {

    this.dataService.getDataDirect(url).then(async data => {

      console.log(data);
      let resData: any = data;
      // resData.responseData.user_details_flag="false"; 
      if (resData.responseData.appkey != "true") {
        this.navCtrl.navigateRoot('appkey-validation');
      }
      else if (resData.responseData.login != "true") {
        // this.loginPageNav(data)
        //    this.gotosuperNew();
        // this.globalObjects.parentAppkey = resData.responseData.server_details.appkey;
        // await this.setScopeUrlfunc();
        // this.navCtrl.navigateRoot('login');
        this.globalObjects.parentAppkey = resData.responseData.server_details.appkey;

        if (resData.responseData.user_details) {
          this.globalObjects.setDataLocally("userDetails", resData.responseData.user_details);
        }
        this.getAppHeaderData();
        this.getUserDetails('firstTime');
        await this.gotosuperNew();   // ✔ call AFTER saving userDetails
        await this.setScopeUrlfunc();
        this.navCtrl.navigateRoot('login');
      }
      else if (resData.responseData.user_details_flag != "true") {
        this.loginPageNav(data)
        this.getAppHeaderData();
        this.getUserDetails('firstTime');
        this.gotosuperNew();
        this.globalObjects.setDataLocally("userDetails", resData.responseData.user_details);
        this.navCtrl.navigateRoot('usersetting');
      }
      else {
        this.loginPageNav(data)

        this.globalObjects.setDataLocally("userDetails", resData.responseData.user_details);
        this.globalObjects.setDataLocally("loginFlag", true);
        await this.setScopeUrlfunc();
        this.getUserDetails('firstTime');
        this.getAppHeaderData()
        this.gotosuperNew();
        // this.navCtrl.navigateRoot('super');

      }
    }, err => {
      alert("error login, please check url!");
      this.globalObjects.ssoflag = false;

    })

  }


  loginPageNav(data) {
    var resData: any = data;
    var responseData = resData.responseData.server_details;
    var responseMsg = resData.responseMsg;
    let userDetails = resData.responseData.user_details;
    this.globalObjects.setDataLocally("parentAppkey", responseData.appkey);
    var server_url = "";
    var server_url2 = "";
    var server_url3 = "";
    var server_url4 = "";
    /////////////////////////////////////////////
    // responseData.serverUrl="192.168.100.101:8282";
    // responseData.serverUrl="192.168.100.143:8888";

    ////////////////////////////////////////////

    let urlencryptFlag = this.globalObjects.urlencryptFlag;
    // let urlencryptedFlag = urlencryptFlag ? "T" : "F";

    // if (urlencryptFlag) {

    //   if (responseData.serverUrl && responseData.serverUrl.indexOf('http') > -1) {
    //     server_url = responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/" + urlencryptedFlag + "/";
    //   } else {
    //     server_url = "http://" + responseData.serverUrl + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/" + urlencryptedFlag + "/";
    //   }

    //   if (responseData.server_url2 && responseData.server_url2.indexOf('http') > -1) {
    //     server_url2 = responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/" + urlencryptedFlag + "/";
    //   } else {
    //     server_url2 = "http://" + responseData.server_url2 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/" + urlencryptedFlag + "/";
    //   }
    //   if (responseData.server_url3 && responseData.server_url3.indexOf('http') > -1) {
    //     server_url3 = responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/" + urlencryptedFlag + "/";
    //   } else {
    //     server_url3 = "http://" + responseData.server_url3 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/" + urlencryptedFlag + "/";
    //   }
    //   if (responseData.server_url4 && responseData.server_url4.indexOf('http') > -1) {
    //     server_url4 = responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/" + urlencryptedFlag + "/";
    //   } else {
    //     server_url4 = "http://" + responseData.server_url4 + "/" + responseData.war_name + "/" + responseData.entity + "/" + responseData.dbUrl + "/" + responseData.portNo + "/" + responseData.dbName + "/" + encodeURIComponent(responseData.dbPassword) + "/" + responseData.dbSid + "/" + urlencryptedFlag + "/";
    //   }

    // } else {
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
    // }
    var appData: any = {};
    appData.app_name = resData.responseData.server_details.app_name;
    appData.appkey = resData.responseData.server_details.appkey.toUpperCase();
    appData.loginFlag = resData.responseData.server_details.loginFlag;

    appData.resData = resData.responseData.server_details;
    var appArr: any = this.globalObjects.getLocallData("appData");
    if (appArr) {
      let isExsist = false;

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
    this.globalObjects.setDataLocally("appKey", responseData.appkey);
    this.globalObjects.setDataLocally("app_name", responseData.app_name);

    this.globalObjects.setDataLocally("appCode", responseData.appcode);
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
    // this.globalObjects.setDataLocally("scopeUrl", server_url);
    this.globalObjects.setDataLocally("server_url1", server_url);
    this.globalObjects.setDataLocally("server_url2", server_url2);
    this.globalObjects.setDataLocally("server_url3", server_url3);
    this.globalObjects.setDataLocally("server_url4", server_url4);
    this.globalObjects.setDataLocally("dbName", responseData.dbName);
    // this.globalObjects.setScopeUrl(server_url);
    this.globalObjects.setDataLocally("entity_code_str_appkey", responseData.entity_code_str);
    this.globalObjects.setDataLocally("entity_code_appkey", responseData.entity);
    let dbinitdetails = "?minIdel=" + (responseData.minIdel ? responseData.minIdel : null)
      + "&maxIdel=" + (responseData.maxIdel ? responseData.maxIdel : null)
      + "&maxTotal=" + (responseData.maxTotal ? responseData.maxTotal : null);
    this.globalObjects.setDataLocally("dbinitdetails", dbinitdetails);
    this.globalObjects.applogo = responseData.icon_img;

    this.globalObjects.setDataLocally("device_validation", responseData.device_validation);
    //    this.globalObjects.checkAndSetScopeUrl().then(()=>{

    // })

    // this.globalObjects.setDataLocally("userDetails", userDetails);
    // this.navCtrl.navigateRoot('login');

    // this.globalObjects.checkAndSetScopeUrl().then(()=>{

    // })
  }


  async gotosuperNew() {
    if (!this.userDetails) {
      this.userDetails = this.globalObjects.getLocallData('userDetails');
    }

    const url: any = location;
    let object_arr: any;

    let wscp: any = {};
    wscp.service_type = "get_object_config";
    wscp.object_code = "WMABLD36";

    let reqData: any = {};
    reqData = {
      "wslp": this.userDetails,
      "wscp": wscp,
      "wsdp": [],
      "wsdpcl": [],
      "wsud": {
      },
    }

    reqData.wscp.g_theme_name = (this.globalObjects.appLayout == 'mordern-leagacy' || this.globalObjects.appLayout == 'mordern-leagacy75') ? 'MODERN' : 'LEGACY';
    await this.dataService.postData("S2U", reqData).then(async (res: any) => {
      // this.resStatus = false;
      let data: any = res;

      if (data.responseStatus && data.responseStatus.includes("success")) {
        object_arr = data.responseData;
        let objData = this.globalObjects.setPageInfo(object_arr);
        let objMast = objData.Level1

        if (objMast && objMast) {
          for await (let pageData of objMast) {
            for await (let page of pageData.Level2) {
              for await (let frame of page.Level3) {
                if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'MENU') {
                  await this.getRefData(frame);
                  if (frame.tableData) {
                    frame.tableData = await this.lhs_lib.treeMenu(frame.tableData);
                  }
                }
                else if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'ROLE') {
                  await this.getRefData(frame);
                }
              }
            }
          }
        }

        let id = "layout_object_mast";
        // this.globalObjects.layoutObject = objMast
        let temp = {
          id: id,
          objData: JSON.stringify(objMast)
        }

        this.sqlLiteServ.getById(id, 'object_master').then(data => {
          if (data.resStatus == 'Success') {
            this.sqlLiteServ.updateObjMast(temp, 'object_master');
          } else {
            this.sqlLiteServ.postDataSql(temp, 'object_master');
          }
        });

        ////////////////////////////////////////////////


        this.globalObjects.userValueListfromglobal = this.userValueList;
        this.navCtrl.navigateRoot('super');
        // if (this.changeLoginPara) {
        //   this.changeSetting()
        // } else {
        //   this.modalCtrl.dismiss();
        // }

      } if (data.responseStatus == "error") {

      }
    });

  }


  async getRefData(frame) {

    if (frame.on_frame_load_str) {

      let parseValue = this.getParse(frame.on_frame_load_str);

      let url = 'getRefCursor?Procname=' + encodeURIComponent(parseValue);
      await this.dataService.getData(url).then(async (data: any) => {
        frame.loading = false;
        if (data.responseStatus && data.responseStatus.includes("success")) {
          return frame.tableData = await this.globalObjects.setPageInfoNoS2U(data.responseData);
        }

        return;

      }).catch(error => {
        console.error(error);
        frame.loading = false;
        return;
      });
    }
  }

  getParse(proc) {
    var bindVarLogic = proc.match(/:(.*?)[=,*,>,<,+,/,%,-,(,;]/g);
    let userDetails = this.globalObjects.getLocallData('userDetails');
    let bindData = "";
    if (bindVarLogic && bindVarLogic.length > 0) {
      for (var b = 0; b < bindVarLogic.length; b++) {
        let d = bindVarLogic[b].replaceAll(":", "").trim();
        if (d && d !== "") {
          let v = d.match(/[a-z_.0-9]+/gi)[0];

          if (v) {
            for (let u in userDetails) {
              if (u.toLowerCase() == v.toLowerCase()) {
                let val = userDetails[u];
                bindData = d.replace(v, val);

                proc = proc.replaceAll(bindVarLogic[b], bindData);
                break;
              }
            }
          }
        }
      }

    }
    return proc;
  }



  async setScopeUrlfunc() {
    try {
      await this.globalObjects.checkAndSetScopeUrl();
      // Do something after the promise resolves
    } catch (error) {
      // Handle the error if checkAndSetScopeUrl fails
      console.error("Error in checkAndSetScopeUrl:", error);
    }
  }




  getAppHeaderData() {
    return new Promise((resolve, reject) => {

      let url = 'getAppHeader';
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

          if (res.responseData) {
            for (let k in res.responseData) {
              userDetails[k] = res.responseData[k];
            }
          }

          userDetails['g_user_platform'] = this.platform.is('android') ? 'android' : (this.platform.is('ios') ? 'ios' : 'browser');

          this.globalObjects.setDataLocally("userDetails", userDetails);
          if (userDetails.G_ROLE_NAME) {
            this.globalObjects.roleUser = userDetails.G_ROLE_NAME;
          }
        }
        resolve("");
      }, (err) => {
        resolve("");
      })
    })
  }



  getUserDetails(type) {

    // this.sidelovarray = this.globalObjects.getLocallData('sidemenulov');
    // if (!this.ddListFlag) {
    //   this.ddListFlag = true;

    let url = "getUserParams";
    let userDetails = this.globalObjects.getLocallData('userDetails');
    let entityCodeStr = this.globalObjects.getLocallData('entity_code_str_appkey');
    let entityCode = this.globalObjects.getLocallData('entity_code_appkey');
    userDetails.entity_code_str_appkey = entityCodeStr;
    userDetails.entity_code_appkey = entityCode;
    this.userDetails = userDetails;
    const data = {
      parameters: userDetails
    };
    this.dataService.postData(url, data).then(res => {
      let response: any = res;
      if (response.responseData.length <= 0) {
        // this.navCtrl.navigateRoot('super');
        // this.modalCtrl.dismiss();
      } else {
        if (response) {
          this.userValueList = response.responseData;
          if (this.userValueList.length > 0) {

            for (let obj in this.userDetails) {
              for (let val of this.userValueList) {
                if (obj == val.item_name) {
                  val.item_name1 = this.userDetails[obj];
                  let event = {
                    target: {
                      value: val.item_name1
                    }
                  }
                  // this.dropdwnValChng(event, val.item_name, 'getdetails', type)
                }
                if (val.result && val.result.length <= 1 && !val.item_name1) {
                  val.item_name1 = val.result[0].CODE
                }

              }
            }
            for (let val of this.userValueList) {
              if (val.error != null) {
                this.globalObjects.presentAlert(JSON.stringify(val.item_name).toUpperCase() + " : " + JSON.stringify(val.error.errMsg));
              }
            }
            // this.setDefaultCode();
            // this.findDefaultYear();
            this.globalObjects.userValueListfromglobal = this.userValueList;
            this.globalObjects.setsidemenudetail();
          }
        }
      }
    });
    // }
  }
}
