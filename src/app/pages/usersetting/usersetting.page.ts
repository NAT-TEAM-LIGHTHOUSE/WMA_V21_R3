import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core';
import { AngularMyDatePickerDirective, IAngularMyDpOptions, Year } from 'angular-mydatepicker';

import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { DynamicmodalPage } from '../dynamicmodal/dynamicmodal.page';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { AlertMsgBoxesPage } from '../alert-msg-boxes/alert-msg-boxes.page';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { IonIcon,IonButton,IonCol,IonItem,IonGrid,IonLabel } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformServer, TitleCasePipe } from '@angular/common';

@Component({
standalone: true,
imports : [STANDALONE_IMPORTS,TitleCasePipe],
  selector: 'app-usersetting',
  templateUrl: './usersetting.page.html',
  styleUrls: ['./usersetting.page.scss'],
})
export class UsersettingPage implements OnInit, OnDestroy {
  @ViewChild('dp') myDp: AngularMyDatePickerDirective;
  sideLovarray: any = [];
  refreshBtn: boolean = false;
  resStatus: boolean = false;
  otherlist: boolean = false;
  networkInfo: any;
  isAndroid: boolean = true;
  toggleNotification: boolean = false;
  toggleFab: boolean = false;
  selectText = "selectText";
  val: any;
  selectinputName: any;
  displayGif = "assets/video/gif1.gif";
  platformValue: any;
  month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sepr", "Oct", "Nov", "Dec"];
  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;
  myDatePickerOptions: IAngularMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    dateRange: false,
    minYear: 1992 as Year,
    maxYear: 2050 as Year,
  }
  public appPages = [
    {
      title: 'Location Tracker',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Super',
      url: '/super',
      icon: 'home'
    },
  ];

  userDetails: any;
  entity_name: any = "";
  default_entity: any;
  entityCodeStrValList: any = [];
  divCodeStrValList: any = [];
  geoOrgList: any = [];
  keys: any = [];
  notificationMenu: boolean = true;
  fabbuttonMenu: boolean = true;
  selectedPartyName: any;
  selectedPartyCode: any;
  divCode: any = "";
  entityCode: any = "";
  geoOrgCode: any = "";
  entityMap: any = {};
  userValueList: any = [];
  data: any = {};
  selectedModalVal
  appkeyInfo: any = 'N';
  selectedName: any;
  selectedCode: any;
  theme: any;
  refreshDetailsFirstTime: boolean = true;
  fontRange: number;
  appkey: any;
  appArr: any;
  dbName: any;
  dbPassword: any;
  count1: number = 0;
  count2: number = 0;
  loginExpiry: any;
  ddListFlag: boolean = false;
  sidelovarray: any = [];
  toggleSelectText: boolean = false;
  offlineEntrySaveFlag: boolean = false;
  disconnected: boolean = false;
  tempNetworkStatus: boolean = false;
  alertCount: number = 0;
  @Input() flag: boolean = false;
   @Input() comeFromLogin: boolean = false;
  disableButton = false;
  isCollapsed = false;
  changeLoginPara = false
  constructor(public modalCtrl: ModalController, public globalObjects: GlobalObjectsService, public popOverCtrl: PopoverController, private lhs_lib: LhsLibService,
    public navCtrl: NavController, private dataService: DataService, private sqlLiteServ: SqlLiteService, private platform: Platform, private cdr: ChangeDetectorRef, private events: Events, @Inject(PLATFORM_ID) private platformId: Object) {
    this.userDetails = this.globalObjects.getLocallData('userDetails');
    // console.log(this.userDetails.first_login_time);
    if (this.globalObjects.pagesFlag) {
      return applyLoggingDecorator(this, "userSetting-page")
    }
  }

  ngOnInit() {

    if (this.platform.is('android')) {
      this.platformValue = 'android';
    } else if (this.platform.is('ios')) {
      this.platformValue = 'ios';
    } else {
      this.platformValue = 'browser';
    }
    // this.userValueList = this.globalObjects.userValueListfromglobal;

    let userlist = this.globalObjects.getLocallData('userValueList')
    if (userlist && userlist.length > 0) {
      this.userValueList = userlist;
      this.changeLoginPara = true
    } else {
      this.getUserDetails('firstTime');
    }
    // console.log(this.userValueList)

    console.log("this.userValueList login", this.userValueList)
    this.refreshDetailsFirstTime = false;
    this.ddListFlag = false;
  }

  async closePage() {
    this.disableButton = true;
    this.resStatus = true;
    let flag: boolean = true;
    let str = "";
    this.globalObjects.setDataLocally('userValueList', this.userValueList);
    for (let data of this.userValueList) {
      if ((data.prompt_name[data.prompt_name.length - 1] == '*' || data.data_required_flag == 'T')
        && (data.item_name1 == undefined || data.item_name1 == null || !data.item_name1)) {
        flag = false;
        str += data.prompt_name + ',';
      }
    }
    if (flag) {
      if (!this.flag) {
        this.globalObjects.setDataLocally('loginFlag', true);
        this.getAppHeaderData().then(() => {
          this.disableButton = false;
          this.gotosuperNew();
          setTimeout(() => {
            if (this.globalObjects.loginBypass) {
              this.events.publish('refreshOnViewChangeBypass');
              this.globalObjects.loginBypass = false;
              this.gotosuper();
            } else {
            }
          }, 300);
        })
      } else {
        this.globalObjects.setDataLocally('loginFlag', true);
        this.getAppHeaderData().then(() => {
          this.disableButton = false;
          this.gotosuper();
        })
      }
    } else {
      // alert('Please enter ' + str);
      this.disableButton = false;
      this.resStatus = false;



      let alertmessage = {
        para_type: "JMS",
        para_value: 'Please enter ' + str
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

  async gotosuper() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      location.reload();
    }
    else {
      const url: any = location;
      if (isPlatformServer(this.platformId)) return;
      window.open(String(url).split('super')[0], '_self');
    }

  }
  changeSetting() {
    if (isPlatformServer(this.platformId)) return;
    window.location.reload();
  }
  getUserDetails(type) {

    this.sidelovarray = this.globalObjects.getLocallData('sidemenulov');
    if (!this.ddListFlag) {
      this.ddListFlag = true;

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
          this.navCtrl.navigateRoot('super');
          this.modalCtrl.dismiss();
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
                    this.dropdwnValChng(event, val.item_name, 'getdetails', type)
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
              this.setDefaultCode();
              this.findDefaultYear();
              this.globalObjects.userValueListfromglobal = this.userValueList;
              this.globalObjects.setsidemenudetail();
            }
          }
        }
      });
    }
  }

  dropdwnValChng(event, item_name, from, type) {
    let userDet = this.globalObjects.getLocallData('userDetails');
    let value = typeof event === 'string' ? event : ((event?.target?.value || "").trim());
    userDet[item_name] = value;

    // userDet[item_name] = ((event.target && event.target.value) ? event.target.value : "").trim();
    this.globalObjects.setDataLocally('userDetails', userDet);
    let userDetails = this.globalObjects.getLocallData('userDetails');
    let entityCodeStr = this.globalObjects.getLocallData("entity_code_str_appkey");
    let entityCode = this.globalObjects.getLocallData("entity_code_appkey");
    userDetails.entity_code_str_appkey = entityCodeStr;
    userDetails.entity_code_appkey = entityCode;
    userDetails.item_name = item_name;
    userDetails.apps_frame_seq_id = this.userValueList.length > 0 ? (this.userValueList[0].apps_frame_seq_id ? this.userValueList[0].apps_frame_seq_id : '0') : '0';
    let url = "getDependentValue";
    var data = {
      "parameters": userDetails
    }

    this.dataService.postData(url, data).then(response => {
      let data: any = response;
      let final_data = JSON.parse(JSON.stringify(data));
      if (final_data.responseStatus == 'Success') {
        let dependentVal: any = [];
        dependentVal = final_data.responseData;
        for (let obj of dependentVal) {
          if (obj.result == null) {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {
                // this.userValueList[i].item_name1 = "";      // code by arti 26-03-2026
                this.userValueList[i].valueforlov ? this.userValueList[i].valueforlov = "" : "";
                this.userValueList[i].codeforlov ? this.userValueList[i].codeforlov = "" : "";
                if (type != 'firstTime') {
                  this.sidelovarray ? this.sidelovarray[i] = null : "";
                  this.globalObjects.setDataLocally("sidemenulov", this.sidelovarray);
                }
                this.userValueList[i].result = [{}];
              }
            }
          }
          else if (obj.result.length == 1) {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {

                obj.result = obj.result.map(y => {
                  let code = y.CODE || "";
                  let value = y.VALUE || "";

                  if (code.includes("~T") || value.includes("~T")) {
                    // strip ~T and set default year
                    const cleanValue = value.replace("~T", "");
                    if (data) {
                      data.item_name1 = cleanValue;
                    }
                    return { ...y, CODE: code.replace("~T", ""), VALUE: cleanValue };
                  }

                  return { ...y, CODE: code, VALUE: value };
                })

                this.userValueList[i].item_name1 = obj.result[0].CODE;
                this.userValueList[i].result = obj.result;
              }
            }
          } else {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {
                this.userValueList[i].item_name1 = "";

                obj.result = obj.result.map(y => {
                  let code = y.CODE || "";
                  let value = y.VALUE || "";

                  if (code.includes("~T") || value.includes("~T")) {
                    // strip ~T and set default year
                    const cleanValue = value.replace("~T", "");
                    if (data) {
                      this.userValueList[i].item_name1 = cleanValue;
                    }
                    return { ...y, CODE: code.replace("~T", ""), VALUE: cleanValue };
                  }

                  return { ...y, CODE: code, VALUE: value };
                })


                this.userValueList[i].valueforlov ? this.userValueList[i].valueforlov = "" : "";
                this.userValueList[i].codeforlov ? this.userValueList[i].codeforlov = "" : "";
                if (type != 'firstTime') {
                  this.sidelovarray ? this.sidelovarray[i] = null : "";
                  this.globalObjects.setDataLocally("sidemenulov", this.sidelovarray);
                }
                this.userValueList[i].result = obj.result;
              }
            }
          }
        }
        if (this.userDetails[item_name] && from == 'getdetails') {
          for (let obj in this.userDetails) {
            for (let val of this.userValueList) {
              if (obj == val.item_name) {
                val.item_name1 = this.userDetails[obj];
              }
            }
          }
        }
      }
      this.globalObjects.userValueListfromglobal = this.userValueList;
      this.globalObjects.setsidemenudetail();
    });
  }

  calendarYear(event, item_name, from, type) {
    this.dropdwnValChng(event, item_name, from, type);
    this.data.isValid = true
  }

  async openDynamicModal(data) {
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: DynamicmodalPage,
        componentProps: {
          modalData: data
        }
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail) {
        let resData: any = detail.data;
        this.globalObjects.setsidemenudetail();
        this.sideLovarray = this.globalObjects.getLocallData("sidemenulov")


        if (this.userValueList.length > 0) {
          for (let i = 0; i < this.userValueList.length; i++) {
            if (this.userValueList[i].item_name == data.item_name) {
              this.userValueList[i].item_name1 = resData ? resData.CODE : "";
              this.userValueList[i].valueforlov = resData ? resData.VALUE : "";
              this.sideLovarray == null ? this.sideLovarray = [] : this.sideLovarray;
              this.sideLovarray[i] = this.userValueList[i].valueforlov;
              this.userValueList[i].codeforlov = resData ? resData.CODE : "";
            }
          }
        }

        this.globalObjects.setDataLocally('sidemenulov', this.sideLovarray);
        this.selectedName = resData ? resData.VALUE : "";
        this.selectedCode = resData ? resData.CODE : "";
        let userDetails = this.globalObjects.getLocallData("userDetails");
        userDetails.item_name = data.item_name;
        userDetails[data.item_name] = resData ? resData.CODE : "";

        this.globalObjects.setDataLocally('userDetails', userDetails);
        let url = "getDependentValue";
        var obj = {
          "parameters": userDetails
        }
        this.dataService.postData(url, obj).then(response => {
          let data: any = response;
          let final_data = JSON.parse(JSON.stringify(data));
          if (final_data.responseStatus == 'Success') {
            let dependentVal: any = [];
            dependentVal = final_data.responseData;
            for (let obj of dependentVal) {
              if (obj.result == null) {
                for (var i = 0; i < this.userValueList.length; i++) {
                  if (obj.prompt_name == this.userValueList[i].prompt_name) {
                    this.userValueList[i].item_name1 = "";
                    this.userValueList[i].result = [{}];
                  }
                }
              }
              else if (obj.result.length == 1) {
                for (var i = 0; i < this.userValueList.length; i++) {
                  if (obj.prompt_name == this.userValueList[i].prompt_name) {
                    this.userValueList[i].item_name1 = obj.result[0].CODE;
                    //  this.userValueList[i].result=[];
                    this.userValueList[i].result = obj.result;
                  }
                }
              } else {
                for (var i = 0; i < this.userValueList.length; i++) {
                  if (obj.prompt_name == this.userValueList[i].prompt_name) {
                    this.userValueList[i].item_name1 = "";
                    this.userValueList[i].result = obj.result;
                  }
                }
              }
            }
          }
        });
      }
    });
    await modal.present();
  }


  setDefaultLang(data, detail) {
    let resData: any = detail;
    this.globalObjects.setsidemenudetail();
    this.sideLovarray = this.globalObjects.getLocallData("sidemenulov")


    if (this.userValueList.length > 0) {
      for (let i = 0; i < this.userValueList.length; i++) {
        if (this.userValueList[i].item_name == data.item_name) {
          this.userValueList[i].item_name1 = resData ? resData.CODE : "";
          this.userValueList[i].valueforlov = resData ? resData.VALUE : "";
          this.sideLovarray == null ? this.sideLovarray = [] : this.sideLovarray;
          this.sideLovarray[i] = this.userValueList[i].valueforlov;
          this.userValueList[i].codeforlov = resData ? resData.CODE : "";
        }
      }
    }

    this.globalObjects.setDataLocally('sidemenulov', this.sideLovarray);
    this.selectedName = resData ? resData.VALUE : "";
    this.selectedCode = resData ? resData.CODE : "";
    let userDetails = this.globalObjects.getLocallData("userDetails");
    userDetails.item_name = data.item_name;
    userDetails[data.item_name] = resData ? resData.CODE : "";

    this.globalObjects.setDataLocally('userDetails', userDetails);
    let url = "getDependentValue";
    var obj = {
      "parameters": userDetails
    }
    this.dataService.postData(url, obj).then(response => {
      let data: any = response;
      let final_data = JSON.parse(JSON.stringify(data));
      if (final_data.responseStatus == 'Success') {
        let dependentVal: any = [];
        dependentVal = final_data.responseData;
        for (let obj of dependentVal) {
          if (obj.result == null) {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {
                this.userValueList[i].item_name1 = "";
                this.userValueList[i].result = [{}];
              }
            }
          }
          else if (obj.result.length == 1) {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {
                this.userValueList[i].item_name1 = obj.result[0].CODE;
                this.userValueList[i].result = obj.result;
              }
            }
          } else {
            for (var i = 0; i < this.userValueList.length; i++) {
              if (obj.prompt_name == this.userValueList[i].prompt_name) {
                this.userValueList[i].item_name1 = "";
                this.userValueList[i].result = obj.result;
              }
            }
          }
        }
      }
    });
  }

  onChange(dateinput) {
    if (dateinput.item_type == 'D' && this.platformValue == 'browser') {
      let datevalue;
      if (dateinput.item_name2) {
        datevalue = dateinput.item_name2.singleDate.date.day + "-" + this.month[dateinput.item_name2.singleDate.date.month - 1] + "-" + dateinput.item_name2.singleDate.date.year;
        dateinput.item_name1 = datevalue;
      }
    } else {
      dateinput.item_name1 = this.globalObjects.formatDate(dateinput.item_name1, "dd-MMM-yyyy");
    }

    if (dateinput.item_name1.indexOf('Sepr')) {
      dateinput.item_name1 = (dateinput.item_name1).replace('Sepr', 'Sep')

    }
    let event = {
      target: {
        value: dateinput.item_name1
      }
    }
    this.dropdwnValChng(event, dateinput.item_name, 'getdetails', null)
  }
  toggleCalendar(): void {
    // this.cdr.detectChanges();
    this.myDp.toggleCalendar();
  }

  getAppHeaderData() {
    return new Promise((resolve, reject) => {

      let url = 'getAppHeader';
      let userDetails = this.globalObjects.getLocallData("userDetails");
      let reqData = {
        "wslp": userDetails
      }
      this.dataService.postData(url, reqData).then((res: any) => {
       if (res.responseStatus !== 'success') {
          if (res.responseMsg && res.responseMsg.indexOf('#') > -1) {
            let resArr = res.responseMsg.split('#')
            if (resArr[0] == "Q") {
              this.globalObjects.presentAlert(resArr[1] );
              this.resStatus = false;
              this.disableButton = false;
              return reject(res);
            }
            else if (resArr[0] == "F") {
              this.globalObjects.presentAlert(res.responseMsg);
                this.resStatus = false;
                this.disableButton = false;
            }
          }
        }
        
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
          userDetails['g_group_code'] = this.globalObjects.getLocallData("g_group_code");
          userDetails['g_app_version'] = this.globalObjects.android_version_numeric;

          this.globalObjects.setDataLocally("userDetails", userDetails);
          if (userDetails.G_ROLE_NAME) {
            this.globalObjects.roleUser = userDetails.G_ROLE_NAME;
          }
        }
        resolve("");
      }, (err) => {
        // resolve("");
          let msg = err?.error?.responseMsg || err?.message || 'Server error';
          this.globalObjects.presentAlert(msg);
          reject(err);
          this.resStatus = false;
          this.disableButton = false;
      })
    })
  }

  ionViewDidEnter() {

    setTimeout(() => {
      this.displayGif = "assets/video/gif2.gif";
    }, 2800)
  }


  async gotosuperNew() {
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
    this.dataService.postData("S2U", reqData).then(async (res: any) => {
  
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
        this.globalObjects.layoutObject = objMast;
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

    this.resStatus = false;
        this.globalObjects.userValueListfromglobal = this.userValueList;
        this.navCtrl.navigateRoot('super');
        if (this.changeLoginPara) {
          this.changeSetting()
        } else {
          this.modalCtrl.dismiss();
        }

      } if (data.responseStatus == "error") {
        this.resStatus = false;
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
        this.resStatus = false;
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



  // icon toggle
  toggleIcon() {
    this.isCollapsed = !this.isCollapsed;
  }

  trackByFn(index: number, item: any): any {
    return item.VALUE;
  }


  //   onLanguageChange(selectedCode: string) {
  //   // this.getDependentValue('G_USER_LANGUAGE', selectedCode);
  //   // this.dropdwnValChng('G_USER_LANGUAGE', selectedCode, 'front', 'D');
  //   this.dropdwnValChng(selectedCode, 'G_USER_LANGUAGE','getdetails', null);
  // }


  onLanguageChange(value: string) {
    const langItem = this.userValueList.find(x => x.item_name === 'G_USER_LANGUAGE');
    if (langItem) {
      langItem.item_name1 = value;
      langItem.isValid = true;
      this.dropdwnValChng(value, langItem.item_name, 'front', langItem.item_type);
    }
  }


  // getDependentValue(itemName: string, value: string) {
  //   console.log(`Fetching dependent values for ${itemName} with ${value}`);
  //   // Your API logic or state update here
  // }


  setDefaultCode() {

    let userValueList1 = this.userValueList.map(data => {
      if (data.item_name === 'G_ACC_YEAR' || data.item_name === 'G_USER_LANGUAGE') {
        if (data.result) {
          data.result.forEach(a => {
            if (a.CODE.includes('~T')) {
              a.CODE = a.VALUE;
              a.codedefault = '~T';
            }
            if(a.VALUE.includes('~T')){
            // data.item_name1 = a.CODE;
            a.codedefault = '~T';
            }
          });
        }

      }else{
        //  code by arti 26-03-2026
        if (data.result) {
          data.result.forEach(a => {
            if (a.CODE?.includes('~T')) {
              a.codedefaultOn="code"
              a.codedefault = '~T';
            }else if(a.VALUE?.includes('~T')){
              a.codedefaultOn="value"
              a.codedefault = '~T';
            }
          });
        }
      }

      return data;
    });

    this.userValueList = userValueList1;

    // console.log("setdefault code");
    // console.log(this.userValueList);
  }

  // findDefaultYear() {
  //   for (let data of this.userValueList) {
  //     if (data.item_name === 'G_ACC_YEAR' || data.item_name == 'G_USER_LANGUAGE') {
  //       if(data.result){
  //         for (let dataValue of data.result) {
  //           if (dataValue.codedefault) {
  //             if (dataValue.codedefault.includes('~T')) {
  //               data.item_name1 = dataValue.VALUE;
  //               data.isValid = true;

  //               if (data.item_name == 'G_USER_LANGUAGE') {
  //                 data.item_name1 = dataValue.CODE;
  //                 delete(dataValue['codedefault']);

  //                 this.setDefaultLang(data, dataValue);
  //               } else {
  //                 let defaultevent: any;
  //                 defaultevent = {
  //                   target: {
  //                     value: dataValue.VALUE
  //                   }
  //                 }
  //                 this.dropdwnValChng(defaultevent, data.item_name, 'front', data.item_type)
  //               }
  //             }
  //           }

  //         }
  //       }


  //     }
  //   }
  // }
  // Modify the setDefaultCode function to handle all items, not just G_ACC_YEAR and G_USER_LANGUAGE
  // setDefaultCode() {
  //   this.userValueList = this.userValueList.map(data => {
  //     if (data.result && Array.isArray(data.result)) {
  //       data.result.forEach(a => {
  //         if (a.CODE && a.CODE.includes('~T')) {
  //           // Store the original code with ~T in codedefault
  //           a.codedefault = a.CODE;
  //           // Replace the code with the value for selection
  //           a.CODE = a.VALUE;
  //         }
  //       });
  //     }
  //     return data;
  //   });
  // }

  // // Update findDefaultYear to handle all items with default flag
  // findDefaultYear() {
  //   for (let data of this.userValueList) {
  //     if (data.result && Array.isArray(data.result)) {
  //       for (let dataValue of data.result) {
  //         if (dataValue.codedefault && dataValue.codedefault.includes('~T')) {
  //           // Set this as the default selected value
  //           data.item_name1 = dataValue.VALUE;
  //           data.isValid = true;

  //           // Different handling based on item type
  //           if (data.item_name == 'G_USER_LANGUAGE') {
  //             // Special handling for language
  //             this.setDefaultLang(data, dataValue);
  //           } else {
  //             // Trigger change event for other items
  //             let defaultEvent = {
  //               target: {
  //                 value: dataValue.VALUE
  //               }
  //             };
  //             this.dropdwnValChng(defaultEvent, data.item_name, 'front', data.item_type);
  //           }
  //           break; // Only set one default
  //         }
  //       }
  //     }
  //   }
  // }
  findDefaultYear() {
    for (let data of this.userValueList) {
      if (data.item_name === 'G_ACC_YEAR' || data.item_name === 'G_USER_LANGUAGE') {
        if (data.result && data.result.length > 0) {
          let defaultFound = false;

          // 1️⃣ Try to set based on ~T flag
          for (let dataValue of data.result) {
            if (dataValue.codedefault && dataValue.codedefault.includes('~T')) {
              defaultFound = true;
              if (data.item_name === 'G_USER_LANGUAGE') {
                data.item_name1 = dataValue.CODE;
                delete dataValue['codedefault'];
                this.setDefaultLang(data, dataValue);
              } else {
                let defaultevent: any = {
                  target: {
                    value: dataValue.VALUE
                  }
                };
               
                  data.item_name1 = dataValue.VALUE;
                
                
                this.dropdwnValChng(defaultevent, data.item_name, 'front', data.item_type);
              }
              break;
            }
          }

          // 2️⃣ If no default found → set first option as default
          if (!defaultFound) {
            const first = data.result[0];
            if (first) {
              data.item_name1 = data.item_name === 'G_USER_LANGUAGE' ? first.CODE : first.VALUE;
              if (data.item_name === 'G_USER_LANGUAGE') {
                this.setDefaultLang(data, first);
              } else {
                let firstEvent: any = {
                  target: {
                    value: first.VALUE
                  }
                };
                this.dropdwnValChng(firstEvent, data.item_name, 'front', data.item_type);
              }
            }
          }
        }
      }
      else{
            //  code by arti 26-03-2026
        if (data.result && data.result.length > 0) {
           for (let dataValue of data.result) {
            if (dataValue.codedefault && dataValue.codedefault.includes('~T')) {
                let defaultevent: any = {
                  target: {
                    value: dataValue.VALUE
                  }
                };
                if(dataValue.codedefaultOn="value"){
                  dataValue.VALUE=dataValue.VALUE.replace("~T", "");
                }else if(dataValue.codedefaultOn="code"){
                  dataValue.CODE=dataValue.CODE.replace("~T", "");
                }
                data.item_name1 = dataValue.CODE;
                this.dropdwnValChng(defaultevent, data.item_name, 'front', data.item_type);
             
              break;
            }
          }

        }
      }
    }
  }

  getSortedYears(years: any[], limit?: number, offset: number = 0, data?): any[] {
    // if(years){
    //   return years.sort((a, b) => parseInt(b.VALUE) - parseInt(a.VALUE))
    //   .slice(offset, limit ? offset + limit : undefined);
    // }else{
    //   return;
    // }
    if (!Array.isArray(years)) return [];

    return years

      .sort((a, b) => parseInt(b.VALUE) - parseInt(a.VALUE))
      .slice(offset, limit ? offset + limit : undefined);
  }

  selectYear(data: any, selectedYear: any) {
    data.item_name1 = selectedYear.VALUE;
    data.isValid = true;
    this.dropdwnValChng(selectedYear.CODE, data.item_name, 'front', data.item_type);
    // Assuming selectinputName is a form control
    // if(this.selectinputName){
    //   data.isValid = this.selectinputName.valid;
    // }else{
    //   data.isValid = this.selectinputName;
    // }
    console.log(this.userValueList)
    console.log(this.selectinputName)
    // this.cdr.detectChanges();
  }

  isDropdown: boolean = false;
  dropdownclick() {
    this.isDropdown = !this.isDropdown;
    setTimeout(() => {
      const popoverEl = document.querySelector('ion-popover.select-popover');
      if (popoverEl) {
        popoverEl.id = 'custom-usersetting-popover'; // Assign your unique ID here
      }
    }, 50);
  }
  ngOnDestroy() {
    this.popOverCtrl.dismiss(); // closes any open popover
  }

}
