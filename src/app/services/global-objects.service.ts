import { Inject, Injectable, Injector, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular/standalone';
import { DatePipe, isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { from, throwError, EMPTY } from 'rxjs';
import { concatMap, timeout, catchError, first } from 'rxjs';
import { Geolocation as CapacitorGeolocation } from '@capacitor/geolocation';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { BatteryStatus } from '@awesome-cordova-plugins/battery-status/ngx';
import { BehaviorSubject, Observable, Subscription, fromEvent, of } from 'rxjs';
import { saveAs } from 'file-saver';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Events } from './events';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { JsonListingPage } from '../pages/json-listing/json-listing.page';
import { DateTimeModel } from 'src/app/services/date-time.modal';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateModel } from './date.model';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs';
(pdfMake as any).vfs = pdfFonts.vfs;
// var CryptoJS = require("crypto-js");

declare var google: any;
@Injectable({
  providedIn: 'root',
})
export class GlobalObjectsService {
  activeItems: any;
  tabindex: any = [];
  jdata: [];
  selectItemListframeEngine: any = [];
  setLocSessFlag: any = false;
  sendSMSurl = "https://fcm.googleapis.com/fcm/send";
  url: any;
  imageAddr: string;
  layoutObject: any;
  downloadSize: any; //bytes
  urlArr: any[];
  objectList: any[];
  loadingTimerNew: any;
  // public newLoader: boolean = false;
  public newLoader = signal(false)
    public clientLoginFlag = false;
  urlArrCount: any = 0;
  quicklinkPageFlag: boolean = false;
  networkStatus: boolean = true;
  applogo = "";
  loading: HTMLIonLoadingElement;
  latitude1: any;
  longitude1: any;
  framePopup: boolean = true;
  savingToOracle: boolean = false;
  savingToCloud: boolean = false;
  addressgenerate: any = "";
  usercodefromlogin: any;
  platformVal: string;
  loaderFlag: boolean = false;
  mydatavariable: any = [];
  tp_cnt: number = 0;
  appWorkingPara: any;
  
  current_page_parameter: any = {};
  loaderToShow: any;
  isLoading: boolean;
  public samePageNo;
  public appTheme: any = "theme-blue";
  // public fontSize
  public appLayout: any = "mordern-leagacy";
  public previousCallObj: any = "";
  public fontSize: number = 1;
  public fontWeight: any = 500;
  public dependFilterData = [];
  public uniqueKey = "";
  public fontype = "";
  public networkType: any;
  public networkSpeed: any;
    public dataEncryptFlag: boolean = false;
  isRecording: boolean = false;
  speechdata: string;
  countfortextband3d: number;
  countforsummarycard: number = 0;
  colorcount: number = 0;
  barcodeinputdata: any;
  clickedbutton: boolean = false;
  toggleNotification: boolean = false;
  toggleFab: boolean = true;
  fabMannualMode: boolean = false;
  notiBellMannualMode: boolean = false;
  public appPageName: any;
  public newaddress: any;
  public android_version_numeric = '2.0.1';
  public ios_version_numeric;
  public reloadObjectFlag = false
  public getLocalDBData: boolean = true;
  public approveStatus: boolean = false;
  letterObj = {
    to: 'MCPLLOCP',
    from: 'Lighthouse India Pvt.Ltd',
    text: ''
  }
  pdfObj = null;
  arr: any = [];
  public frameSeqId: any;
  public cartSummaryPlain: any = [];

  public plastoFrameSumm: any = [];
  public summaryCartdeatail: any = [];
  public summaryheadings: any = [];
  dbName: any;
  appKey: any;
  ssoflag: boolean = false;
  public callingPara: any = [];
  public presentImages: any = ['example1', 'example2', 'example3'];
  location_name: NativeGeocoderResult;
  batterySubscription: any;
  lvl: number;
  public toggleDevloperMode = signal(false);
  public refCursorMode: boolean = true;
  public noU2sFlag: boolean = false;
  urlencryptFlag: any = true;
  propertiesFlag: any = true;
  public toggleDevloperModePro: boolean = false;
  recordsFound: any;
  recordsFoundText: string;
  listTyle: string;
  toggleSound: boolean = false;
  toggleVibrate: boolean = false;
  toggleDrag: boolean = false;
  wmaBuilderFlag: any;
  audio: any = {
    id: 'assets/audio/click1.mp3',
    toggelSound: true,
    sound: 'assets/audio/click1.mp3',
    volume: 0.5
  };

  wmaDecodeFlag;
  userValueListfromglobal: any = [];

  globalVal: any = [];
  public builderFlag: boolean = true;
  summaryPlainData: any = [];
  attachmentArr: any = [];
  sidemenuDate: any;
  simpleLoginProcess: boolean = true; //(true)=> for Appkey login process && (false)=> jump to direct login page like ARS / jyoti
  // parentAppkey = "MIEPLESS";
  // parentAppkey = "MIEPLESS";
  // parentAppkey = "L.NOVAWMA";
  //  parentAppkey = "LHSBOOSTN";
  //  parentAppkey = "ICONS";
  // parentAppkey = "L.DTLWMA";
  //  parentAppkey = "L.WMAUAT";
  //  parentAppkey = "L.V7CERP";
  // parentAppkey = "NPPL";
  // parentAppkey = "NIPMHRA";
  //  parentAppkey = "NOVAWMA";
  // parentAppkey = "DTLV7WHM";
  // parentAppkey = "D.WMANAT";
  // parentAppkey = "NPPL"
  // parentAppkey = "NPPLT"
  // parentAppkey = "SBFSRMA";
  // parentAppkey = "RKPPLCRM";
  // parentAppkey = "KISCOESS";
  // parentAppkey = "NOVA";
  // parentAppkey ="VILV72";
  parentAppkey = "L.V7CERP";
  // parentAppkey = "TPCLCRM";
  //  parentAppkey = "METAERPPO";

  public encryptFlag = false;
  public homeButtonFlag = true;
  public moduleFlag = true;
  public refreshObj: any = [];
  public devItemName = {};
  public timerEvents = [];
  public newFormInstanceArr = [];
  public picture = "";
  devItemIcon: any;
  devItemEditFlag: boolean = true;
  public mobileFlag = false;
  public breadCrumpsArray: any = [];
  public breadCrumpsSameObjArray: any = [];
  public currentPageNo = 0;
  public breadCrumpsBackPageNo = 0;
  public navigateParam: boolean = false;
  public popoverFlag = "M";
  public mouseEvent;
  public date = '16-10-2024 10.00.00';
  isToBack: boolean = false;
  longitude: any;
  latitude: any;
  public timestamp: any = "";
  batteryLevel: any;
  message: any;
  interval: any;
  intervalTimeout: number = 60;

  public autoClickItem = [];
  // public object_mast: any = [];
  public lovObjData: any = [];
  public switchTableData = [];
  public switchSearchStr = "";
  public switchCardData = [];
  public lovType: any;
  public allFrameJsonData = [];
  public globleRightClickOption: any = false;
  public backObjectCode: any;
  public backObjectPageName: any;
  public callingParameter = [];
  public callingParameterBack = [];
  public global_Parameter;
  public refreshId = 0;
  public pageId = 0;
  public clickedWsdp: any = {};
  public lhsLoader: boolean = false;
  public loginBypass = false;
  public logout = false;
  public passDataArr = [];
  public copyDataArr = [];
  public refreshFlag: boolean = false;
  public focusArrow: boolean = true;
  public confirmFlag: boolean = false;

  public focusedItem: any;
  public alertFabFlag: boolean = false;
  public alertFabData = [];
  lookandfeelChange = false;
  public chartId = 1;
  public navigateIndex = null;
  public pageEventId = 0;
  public homeObjectCode = null;
  public rase: boolean = false;
  public isMsg: boolean = false;
  public timeData: any;
  public devJRes: any;
  public gajsFunctions = [];
  public excuted_events_logs = [];
  public logFlag: boolean = false;
  public events_log = [];


  loadingTimer: any;
  private visibilityState: Observable<boolean>;

  public isCheck = true;
  // private roleSource = new BehaviorSubject<string>('');

  public roleUser = "";

  public lazyLoading: boolean = true;

  // currentRole = this.roleSource.asObservable();

  public frameFlag = false;
  public itemFlag = false;
  public pagesFlag = false;
  public serviceFlag = false;
  public layoutFlag = false;

  public userDetails: any;

  public sysdateTime: any;

  public count = 0;

  public loading_on_demand = signal(false);
  pageNo: any
  public wscp_para: any;
  public loginUrl: any;
  public wmaAppName: any;
  public callingType: any;
  lwsdp = {};
  userValueList = []
  public log_event_slno: any = 0;
  public log_timestamp = 1.00;
  public developer_clickEvent: any
  public log_event_slno_check_array = []
  public islog_event_slnoincrement = true;
  public isChildslno = false;

  public isOpenPageLoading = false
  public groupFilterLoadingTable = false
  public isMicrosftLogin = false;
  public patch_flag = false;
  public isGetObjectConfig = signal(false);
  public bgappTheme: any = "bgtheme-default";
public isNotOpenTab=signal(false);
  public toggle_shortcutkey_tooltip=signal(false)
  constructor(public http: HttpClient, public loadingController: LoadingController,
    private barScanner: BarcodeScanner,
    public modalController: ModalController, private photoViewer: PhotoViewer,
    private nativeGeocoder: NativeGeocoder, public geoLocation: Geolocation,
    private toastCtrl: ToastController, public device: Device,
    private speechRecognition: SpeechRecognition,
    private file: File,
    private filePath: FilePath, private androidPermissions: AndroidPermissions,
    private documents: DocumentViewer, private events: Events, private injector: Injector,
    private socialSharing: SocialSharing, private network: Network,
    private batteryStatus: BatteryStatus, private platform: Platform,
    private nativeAudio: NativeAudio, private locationAccuracy: LocationAccuracy,
    private emailComposer: EmailComposer, @Inject(PLATFORM_ID) private platformId: Object,
    private alertController: AlertController

  ) {


    if (isPlatformServer(this.platformId)) return;
    if (typeof document !== 'undefined') {
      this.visibilityState = fromEvent(document, 'visibilitychange').pipe(
        map(() => !document.hidden)
      );
    } else {
      this.visibilityState = of(true); // fallback for SSR
    }

    this.ios_version_numeric = this.android_version_numeric;
    this.appKey = this.getLocallData("appKey");

    this.speechRecognition.requestPermission()
      .then(() => {
        this.speechRecognition.hasPermission()
          .then((hasPermission: boolean) => {
            if (!hasPermission) {
              this.speechRecognition.requestPermission();
            }
          });
      })

    let theme = this.getLocallData('theme');
    if (theme) {
      this.appTheme = theme;
    }
    let bgtheme = this.getLocallData('bgtheme');
    if (bgtheme) {
      this.bgappTheme = bgtheme;
    }


    let layoutNew = this.getLocallData('layoutNew');
    if (layoutNew) {

      this.appLayout = layoutNew;
    }

    if (this.platform.is('android') || this.platform.is('ios')) {
      this.setLocSessFlag = true;

    } else {
      this.platformVal = 'browser';
    }

    let permission: boolean;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.STORAGE).then(
      result => permission = result.hasPermission),
      (err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.STORAGE).then(
        result => permission = result.hasPermission)
      );

    if (!permission) {
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.STORAGE, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
    }

    this.url = this.getLocallData("scopeUrl");
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission();
      }
    });

    this.events.subscribe("checkToggle", () => {
      this.userDetails = this.getLocallData("userDetails")
      if (!this.fabMannualMode) {
        if (this.userDetails.fab_ball_default_flag == 'T') {
          this.toggleFab = true;
          this.events.publish("toggleFab", true);

        } else if (this.userDetails.fab_ball_default_flag == 'F') {
          this.toggleFab = false;
          this.events.publish("toggleFab", false);
        } else {
          this.toggleFab = true;
          this.events.publish("toggleFab", true);
        }
      }


      if (!this.notiBellMannualMode) {
        if ((this.userDetails.notification_bell_default_flag) && this.userDetails.notification_bell_default_flag == 'T') {
          this.toggleNotification = true;
          this.events.publish("toggleNotification", true);
        } else {
          this.toggleNotification = false;
          this.events.publish("toggleNotification", false);
        }
      }
    })


    this.events.subscribe("fabMannualMode", (res) => {
      this.fabMannualMode = res;
    })
    this.events.subscribe("notiBellMannualMode", (res) => {
      this.notiBellMannualMode = res;
    })
    this.events.subscribe("toggleFab", (res) => {
      this.toggleFab = res;
    })
    this.events.subscribe("toggleNotification", (res) => {
      this.toggleNotification = res;
    })
    if (this.serviceFlag) {
      // return applyLoggingDecorator(this,"global-objects-service")
    }
  }


  getVisibilityState(): Observable<boolean> {
    return this.visibilityState;
  }


  ngOnInit() {
    this.getLocation();
    let a = this.getLocallData("icon_img");
    alert(a);

  }


  setsidemenudetail() {
    let userDetails = this.getLocallData('userDetails');

    for (let y of this.userValueListfromglobal) {
      if (y.item_name in userDetails) {
        if ((y.item_name1 && y.item_name1 != "") || (y.valueforlov && y.valueforlov != "")) {

          if (y.item_name1 && y.item_name1 != "") {
            if (y.item_name1 && y.item_type == 'D' && this.platformVal == 'browser') {
              let val = JSON.parse(JSON.stringify(y.item_name1));
              userDetails[y.item_name] = val;
              let d = this.formatDate(y.item_name1, 'yyyy-MM-dd');
              y.item_name2 = { isRange: false, singleDate: { jsDate: new Date(d) } };
            } else {
              userDetails[y.item_name] = y.item_name1

            }
          } else if (y.valueforlov && y.valueforlov != "") {
            userDetails[y.item_name] = y.valueforlov
          }

        } else {
          userDetails[y.item_name] = "";
        }
      } else {
        if (y.result) {
          if (y.result.length == 1) {
            userDetails[y.item_name] = y.result[0].CODE
          } else {
            userDetails[y.item_name] = "";
          }
        }
        else {
          userDetails[y.item_name] = "";
        }

      }
    }
    this.setDataLocally('userDetails', userDetails)

  }

  checkBattery() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.batterySubscription = this.batteryStatus.onChange().subscribe(status => {
        this.lvl = status.level;
      });
    }
    return of(this.lvl);
  }



  setDataLocallyUnEncrypt(key, value) {
    if (isPlatformServer(this.platformId) || !isPlatformBrowser(this.platformId)) return;
    try {
      if (this.setLocSessFlag) {
        return localStorage.setItem(key, JSON.stringify(value));
      } else {
        return sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('setDataLocallyUnEncrypt error:', error);
      return null;
    }
  }


  setDataLocally(key, value) {
    if (isPlatformServer(this.platformId) || !isPlatformBrowser(this.platformId)) return;
    try {
      if (this.encryptFlag) {
        let ciphertext = "";
        if (this.setLocSessFlag) {
          ciphertext = localStorage.getItem("lhsKey");
        } else {
          ciphertext = sessionStorage.getItem("lhsKey");
        }

        let dataArr = [];
        if (ciphertext) {
          let bytes = CryptoJS.AES.decrypt(ciphertext, 'V7C2023');
          let originalText = bytes.toString(CryptoJS.enc.Utf8);
          dataArr = JSON.parse(originalText);
          let data = dataArr.find(x => x.key == key);
          if (data) {
            data.value = value
          } else {
            dataArr.push({ key, value });
          }
        } else {
          dataArr.push({ key, value });
        }

        let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(dataArr), 'V7C2023').toString();
        if (this.setLocSessFlag) {
          let val = localStorage.setItem("lhsKey", encryptedData);
          if (key == 'userDetails') {
            this.userDetails = this.getLocallData(key);
          }
          return val;

        } else {
          let val = sessionStorage.setItem("lhsKey", encryptedData);
          if (key == 'userDetails') {
            this.userDetails = this.getLocallData(key);
          }
          return val;
        }

      } else {
        let val = this.setDataLocallyUnEncrypt(key, value);
        if (key == 'userDetails') {
          this.userDetails = this.getLocallData(key);
        }
        return val;
      }
    } catch (error) {
      console.error('setDataLocally error:', error);
      return null;
    }
  }

  getLocallData(key) {
    if (isPlatformServer(this.platformId) || !isPlatformBrowser(this.platformId)) return null;
    try {
      if (this.encryptFlag) {
        let ciphertext = "";

        if (this.setLocSessFlag) {
          ciphertext = localStorage.getItem("lhsKey");
        } else {
          ciphertext = sessionStorage.getItem("lhsKey");
        }

        let data = null;
        if (ciphertext) {
          let bytes = CryptoJS.AES.decrypt(ciphertext, 'V7C2023');
          let originalText = bytes.toString(CryptoJS.enc.Utf8);
          let dataArr = JSON.parse(originalText);
          data = dataArr.find(x => x.key == key);
          console.log(data);
        }

        return data ? data.value : null;

      } else {
        return this.getLocallUnEncryptData(key);
      }
    } catch (error) {
      console.error('getLocallData error:', error);
      return null;
    }
  }

  getLocallUnEncryptData(key) {
    if (isPlatformServer(this.platformId) || !isPlatformBrowser(this.platformId)) return null;
    try {
      if (this.setLocSessFlag) {
        return JSON.parse(localStorage.getItem(key));
      } else {
        return JSON.parse(sessionStorage.getItem(key));
      }
    } catch (error) {
      console.error('getLocallUnEncryptData error:', error);
      return null;
    }
  }


  destroyUnEncryptLocalData(key: string) {
    if (isPlatformServer(this.platformId) || !isPlatformBrowser(this.platformId)) return;
    try {
      if (this.setLocSessFlag) {
        return localStorage.removeItem(key);
      } else {
        return sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error('destroyUnEncryptLocalData error:', error);
      return null;
    }
  }

  destroyLocalData(key: string) {
    if (isPlatformServer(this.platformId)) return;
    try {
      if (this.encryptFlag) {
        let ciphertext = "";
        if (this.setLocSessFlag) {
          ciphertext = localStorage.getItem("lhsKey");
        } else {
          ciphertext = sessionStorage.getItem("lhsKey");
        }

        let data = null;
        if (ciphertext) {
          let bytes = CryptoJS.AES.decrypt(ciphertext, 'V7C2023');
          let originalText = bytes.toString(CryptoJS.enc.Utf8);
          let dataArr = JSON.parse(originalText);
          let newArr = [];

          for (let d of dataArr) {
            if (d.key != key) {
              newArr.push(d);
            }
          }

          let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(newArr), 'V7C2023').toString();
          if (this.setLocSessFlag) {
            return localStorage.setItem("lhsKey", encryptedData);
          } else {
            return sessionStorage.setItem("lhsKey", encryptedData);
          }
        }
        return data;
      } else {
        return this.destroyUnEncryptLocalData(key);
      }
    } catch (error) {
      console.error('destroyLocalData error:', error);
      return null;
    }
  }

  clearLocalStorage() {
    if (isPlatformServer(this.platformId)) return;
    try {
      if (this.setLocSessFlag) {
        localStorage.clear();
      } else {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('clearLocalStorage error:', error);
    }
  }

  async displayCordovaToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'bottom'
    });
    await toast.present();
  }

  async displayOfflineToast() {
    let toast = await this.toastCtrl.create({
      message: "Oops no internet connection!",
      duration: 5000,
      position: 'bottom'
    });
    await toast.present();
  }

  setScopeUrl(url) {
    this.url = (url);
  }

  getScopeUrl() {
    return this.url;
  }

  checkAndSetScopeUrl() {
    return new Promise((resolve, reject) => {
      this.urlArr = [];
      this.urlArr.push(this.getLocallData("server_url1"));
      this.urlArr.push(this.getLocallData("server_url2"));
      this.urlArr.push(this.getLocallData("server_url3"));
      this.urlArr.push(this.getLocallData("server_url4"));

      if (this.networkStatus) {
        let errCount = 0;

        this.errCountCheck(1).then(() => {
          resolve("")
        }, err => {
          reject();
        })
      } else {
        this.setDataLocally("appkeyTryCount", 1);
        this.displayOfflineToast();
        reject();
      }
    })
  }


  errCountCheck(errCount) {
    return new Promise((resolve, reject) => {

      this.check(errCount).then(data => {
        resolve("");
      }, err => {
        errCount = err
        if (err == 3) {
          this.MeasureConnectionSpeed().then(res => {
            this.presentToastWithOptions(
              `Registered client server is not Available...(Tip:
               1) Please check your Internet Connection.
               2) Check tomcat server is running, 
               3) Check port access on public ip. ),
               4) Internet speed :- ${res} Mbps,
               5) Network type :- ${this.networkType}`,
              "errorClass");
            this.setDataLocally("appkeyTryCount", 1);
            reject();
          })
        } else {
          this.errCountCheck(errCount + 1);
        }
      });
    });
  }

  check(attempt: number): Promise<any> {

    this.loaderFlag = true;

    return new Promise((resolve, reject) => {

      from(this.urlArr).pipe(

        concatMap((baseUrl) =>
          this.http.get(baseUrl + 'checkServerStatus').pipe(
            timeout(5000),
            map(() => baseUrl),
            catchError(() => EMPTY)
          )
        ),

        first()

      ).subscribe({

        next: (baseUrl) => {

          let finalUrl = this.urlencryptFlag
            ? baseUrl + 'T/'
            : baseUrl;

          this.setDataLocally("scopeUrl", finalUrl);
          this.setScopeUrl(finalUrl);

          this.loaderFlag = false;
          resolve("");

        },

        error: () => {
          this.loaderFlag = false;
          reject(attempt);
        }

      });

    });
  }
  // check(attempt) {
  //   return new Promise((resolve, reject) => {
  //     let errorCount = 0;
  //     let status = true;
  //     let http1 = new Subscription();
  //     let http2 = new Subscription();
  //     let http3 = new Subscription();
  //     let http4 = new Subscription();
  //     let flag = false;
  //     let timeOut = 5000;

  //     http1 = this.http.get(this.urlArr[0] + 'checkServerStatus').subscribe((data: HttpResponse<any>) => {
  //       console.log(data);
  //       let url = this.urlArr[0];
  //       if (this.urlencryptFlag) {
  //         // url = this.urlArr[0].replaceAll("/lhsws_wma/", "/lhsws_wma_enc/") + 'T/';
  //         console.log(this.urlArr[0])
  //         url = this.urlArr[0] + 'T/';
  //       }

  //       this.setDataLocally("scopeUrl", url);
  //       this.setScopeUrl(url);
  //       status = false;
  //       http1.unsubscribe();
  //       http2.unsubscribe();
  //       http3.unsubscribe();
  //       http4.unsubscribe();
  //       resolve("");
  //     }, (err) => {
  //       errorCount++;
  //       if (errorCount == 4) {
  //         reject(attempt);
  //       }
  //     });


  //     setTimeout(() => {
  //       if (status) {
  //         http1.unsubscribe();
  //         http2 = this.http.get(this.urlArr[1] + 'checkServerStatus').subscribe(data => {

  //           let url = this.urlArr[1];
  //           if (this.urlencryptFlag) {
  //             // url = this.urlArr[1].replaceAll("/lhsws_wma/", "/lhsws_wma_enc/") + 'T/';
  //             url = this.urlArr[1] + 'T/';

  //           }
  //           this.setDataLocally("scopeUrl", url);
  //           this.setScopeUrl(url);
  //           status = false;
  //           http1.unsubscribe();
  //           http2.unsubscribe();
  //           http3.unsubscribe();
  //           http4.unsubscribe();
  //           resolve("");
  //           this.loaderFlag = false;
  //         }, (err) => {
  //           errorCount++;
  //           if (errorCount == 4) {
  //             reject(attempt);
  //           }
  //         });
  //       }
  //     }, timeOut * 2);


  //     setTimeout(() => {
  //       if (status) {
  //         http2.unsubscribe();
  //         http3 = this.http.get(this.urlArr[2] + 'checkServerStatus').subscribe(data => {

  //           let url = this.urlArr[2];
  //           if (this.urlencryptFlag) {
  //             // url = this.urlArr[2].replaceAll("/lhsws_wma/", "/lhsws_wma_enc/") + 'T/';
  //             url = this.urlArr[2] + 'T/';

  //           }

  //           this.setDataLocally("scopeUrl", url);
  //           this.setScopeUrl(url);
  //           status = false;
  //           http1.unsubscribe();
  //           http2.unsubscribe();
  //           http3.unsubscribe();
  //           http4.unsubscribe();
  //           resolve("");
  //         }, (err) => {
  //           errorCount++;
  //           if (errorCount == 4) {
  //             reject(attempt);
  //           }
  //         });
  //       }
  //     }, timeOut * 3);

  //     setTimeout(() => {
  //       if (status) {
  //         http3.unsubscribe();
  //         http4 = this.http.get(this.urlArr[3] + 'checkServerStatus').subscribe(data => {
  //           // let url = this.urlArr[3].replaceAll("/lhsws_wma/", "/lhsws_wma_enc/") + 'T/';

  //           let url = this.urlArr[3];
  //           if (this.urlencryptFlag) {
  //             // url = this.urlArr[3].replaceAll("/lhsws_wma/", "/lhsws_wma_enc/") + 'T/';
  //             url = this.urlArr[3] + 'T/';

  //           }

  //           this.setDataLocally("scopeUrl", url);
  //           this.setScopeUrl(url);
  //           status = false;
  //           http1.unsubscribe();
  //           http2.unsubscribe();
  //           http3.unsubscribe();
  //           http4.unsubscribe();
  //           resolve("");
  //         }, (err) => {
  //           errorCount++;
  //           if (errorCount == 4) {
  //             reject(attempt);
  //           }
  //         });
  //       }
  //     }, timeOut * 4);

  //     setTimeout(() => {
  //       http4.unsubscribe();
  //       reject(attempt);
  //     }, timeOut * 5);
  //   });
  // }

  checkUrl(url) {
    return new Promise((resolve, reject) => {
      let req = this.http.get(url + 'checkServerStatus').subscribe((data: any) => {
        resolve("success");
      }, (error) => {
        reject(error);
      })
    })
  }


  // after IOS changes

formatDate(date: any, format: string) {
  const datePipe = new DatePipe('en-US');

  try {
    console.log('check date', date);

    // { value: '2026-10-08T00:30:44.044' }
    if (date && typeof date === 'object' && date.value) {
      console.log('check date object value', date.value);
      date = date.value;
    }

    let date1: Date;

    if (date instanceof Date) {
      date1 = date;
    }

    // String date
    else if (typeof date === 'string') {

      console.log('check date intry', date);

      // YYYY-MM-DDTHH:mm:ss
      if (/^\d{4}-\d{2}-\d{2}T/.test(date)) {

        // IMPORTANT:
        // Do not remove the time portion
        date1 = new Date(date);

      }

      // YYYY-MM-DD
      else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {

        const [year, month, day] = date.split('-');

        date1 = new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );

      }

      // DD-MMM-YYYY
      else if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(date)) {

        const [day, monthName, year] = date.split('-');

        const month = new Date(
          `${monthName} 1, 2000`
        ).getMonth();

        date1 = new Date(
          Number(year),
          month,
          Number(day)
        );

      }

      // MMM-DD-YYYY
      else if (/^[A-Za-z]{3}-\d{2}-\d{4}$/.test(date)) {

        const [monthName, day, year] = date.split('-');

        const month = new Date(
          `${monthName} 1, 2000`
        ).getMonth();

        date1 = new Date(
          Number(year),
          month,
          Number(day)
        );

      }

      // Other supported date strings
      else {
        date1 = new Date(date);
      }

    } else {
      date1 = new Date(date);
    }

    console.log('check date after conversion', date1);

    if (isNaN(date1.getTime())) {
      console.error('Invalid date:', date);
      return null;
    }

    return datePipe.transform(date1, format);

  } catch (err) {

    console.error('Date parsing error:', err);

    return null;
  }
}


  async presentToast(message) {
    if (!message) {
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async s2uToast(message, cssclass) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      animated: true,
      position: "middle",

      cssClass: cssclass
    });
    await toast.present();
  }

  async stopToast() {
    this.toastCtrl.dismiss();
  }

  async presentToastWithOptions(message, cssclass) {
    this.presentAlert(message);
  }

  geoCoderLocation(lat, lon) {
    return new Promise((resolve, reject) => {
      this.latitude1 = lat;
      this.longitude1 = lon;
      3
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(lat, lon)
        .then((result: NativeGeocoderResult[]) => {
          this.location_name = result[0];
          this.generateAddress(result[0]).then((res: any) => {

            var data: any = res;
            return resolve(data);
          });
        })
        .catch((error: any) => {
        });

    });
  }

  generateAddress(result) {
    return new Promise((resolve, reject) => {
      let obj1 = [];
      let add = "";
      if (result.subLocality) {
        add += result.subLocality + ", ";
      }
      if (result.areasOfInterest) {
        add += result.areasOfInterest[0] + ", ";
      }
      if (result.subAdministrative) {
        add += result.subAdministrative + ", ";
      }
      if (result.administrativeArea) {
        add += result.administrativeArea + ", ";
      }
      if (result.countryName) {
        add += result.countryName + ", ";
      }
      if (result.throughfare) {
        add += result.throughfare + ", ";
      }
      if (result.postalCode) {
        add += result.postalCode + ".";
      }
      this.addressgenerate = add;

      return resolve(this.addressgenerate);
    });
  }


  transpose(temp) {
    var tempLength = temp.length ? temp.length : 0,
      arrLength = temp[0] instanceof Array ? temp[0].length : 0;
    if (arrLength === 0 || tempLength === 0) {
      return [];
    }
    var i, j, tempArray = [];
    for (i = 0; i < arrLength; i++) {
      tempArray[i] = [];
      for (j = 0; j < tempLength; j++) {
        tempArray[i][j] = temp[j][i];
      }
    }
    return tempArray;
  }

  setPageInfoNoS2U(data) {
    let arrData = [];

    // let jFlag = data[0].find(x => x.toUpperCase() == 'STATUS');


    if (data && data.length > 0) {
      for (let value of data[1]) {
        let obj = {}
        let index = 0
        for (let key of data[0]) {
          obj[key] = value[index]
          index++
        }
        arrData.push(obj)
      }
    }
    return arrData;
  }


  setPageInfo(object_arr) {

    let object_mast: any = {};
    object_mast.Level1 = [];
    if (object_arr && object_arr.Values) {
      for (let level1 of object_arr.Values) {

        let level1Obj: any = {}
        let levelKyIndex = 0;
        for (let level1Values of level1) {
          level1Obj[object_arr.Level1_Keys[levelKyIndex]] = level1Values
          levelKyIndex++;
        }
        //level2-----
        if (level1Obj.Level2) {
          let level2Arr: any = []
          for (let level2 of level1Obj.Level2) {
            let level2Obj: any = {}
            let level2KeyIndex = 0;
            for (let level2Values of level2) {
              level2Obj[object_arr.Level2_Keys[level2KeyIndex]] = level2Values
              level2KeyIndex++;
            }
            //level3-------
            if (level2Obj.Level3) {
              let level3Arr: any = []
              for (let Level3 of level2Obj.Level3) {
                let level3Obj: any = {}
                let level3KeyIndex = 0;
                for (let level3Values of Level3) {
                  level3Obj[object_arr.Level3_Keys[level3KeyIndex]] = level3Values;
                  level3KeyIndex++;
                }
                //level4-------
                if (level3Obj.Level4) {
                  let level4Arr: any = []
                  for (let Level4 of level3Obj.Level4) {
                    let level4Obj: any = {}
                    let level4KeyIndex = 0;
                    for (let level4Values of Level4) {
                      level4Obj[object_arr.Level4_Keys[level4KeyIndex]] = level4Values;
                      level4KeyIndex++;
                    }
                    //level5---
                    if (level4Obj.Level5) {
                      let level5Arr: any = []
                      for (let Level5 of level4Obj.Level5) {
                        let level5Obj: any = {}
                        let level5KeyIndex = 0;
                        for (let level5Values of Level5) {
                          level5Obj[object_arr.Level5_Keys[level5KeyIndex]] = level5Values;
                          level5KeyIndex++;
                        }
                        //level6---
                        if (level5Obj.Level6) {
                          let level6Arr: any = []
                          for (let Level6 of level5Obj.Level6) {
                            let level6Obj: any = {}
                            let level6KeyIndex = 0;
                            for (let level6Values of Level6) {
                              level6Obj[object_arr.Level6_Keys[level6KeyIndex]] = level6Values;
                              level6KeyIndex++;
                            }
                            level6Arr.push(level6Obj)
                          }
                          level5Obj.Level6 = level6Arr
                        }
                        //---level6 end
                        level5Arr.push(level5Obj)
                      }
                      level4Obj.Level5 = level5Arr
                    }
                    //---level5 end
                    level4Arr.push(level4Obj)
                  }
                  level3Obj.Level4 = level4Arr
                }
                //level4 End-------
                level3Arr.push(level3Obj)
              }
              level2Obj.Level3 = level3Arr
            }
            //level3 End-------
            level2Arr.push(level2Obj);
          }
          level1Obj.Level2 = level2Arr
        }
        //level2 end----
        object_mast.Level1.push(level1Obj)

      }
    }
    return object_mast
  }

  setPlatformValue(platformVal) {
    this.platformVal = platformVal;
  }

  getPlatformValue() {
    return this.platformVal;
  }

  getNetworkInfo() {
    let jsonNetwork: any = {};
    if (this.networkStatus) {
      var connectivity_mode;
      var network_speed = this.network.downlinkMax;
      setTimeout(() => {
        if (this.network.type == 'wifi') {
          connectivity_mode = 'wifi'
        } else if (this.network.type == '3g') {
          connectivity_mode = '3g';
        } else if (this.network.type == '4g') {
          connectivity_mode = '4g';
        } else if (this.network.type == '5g') {
          connectivity_mode = '5g';
        } else if (this.network.type == 'ethernet') {
          connectivity_mode = 'ethernet';
        }
        else {
          connectivity_mode = 'cellular';
        }
        jsonNetwork.connection = connectivity_mode;
        jsonNetwork.network_speed = network_speed;
      }, 5000);
    }
    return jsonNetwork;
  }


  autoCalculation(formulaStr: any, frame: any): any {
    try {
      let formulaStrArr = formulaStr.split("#");
      let formulaArr = [];

      for (let f of formulaStrArr) {
        if (f) {
          formulaArr.push(f);
        }
      }
      let flag: boolean = false;
      for (let itemGroup of frame) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if ((formulaArr.indexOf(item.item_name) > -1)) {
              let val;
              if (item.value) {
                val = JSON.parse(JSON.stringify(item.value));
              } else {
                val = 0;
              }
              formulaArr[formulaArr.indexOf(item.item_name)] = val;
              flag = true;
            }
          }
        }
      }
      if (flag) {
        let temp = formulaArr.join('');
        if ((temp.indexOf("null") > -1) && formulaArr.length <= 3) {
          return null;
        } else {
          let num = eval(temp)
          let nVal = num.toString();
          if (nVal.indexOf('.') > -1) {
            num = parseFloat(nVal).toFixed(3);
          }
          return num
        }
      } else {
        return null;
      }

    } catch (err) {
      return null;
    }
  }

  onBlurEvent(item, formulaStr: any, frame: any) {
    try {
      let formulaArr = formulaStr.split("[");
      for (let f of formulaArr) {
        if (f) {
          let resultArr = f.split("{");
          let conditionsArr;
          let formula;
          let forValue

          if (resultArr[1].indexOf("?") > -1) {
            conditionsArr = resultArr[1].split("?");
            formula = conditionsArr[0].split("~");

            for (let itemGroup of frame) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  for (let fr of formula) {
                    if (fr == item.item_name) {
                      let val;
                      if (item.blurValue != undefined || item.value != undefined) {
                        if (item.blurValue) {
                          val = item.blurValue
                        } else {
                          val = item.value
                        }
                      } else {
                        val = "'null'";
                      }
                      formula[formula.indexOf(fr)] = val;
                    }
                  }
                }
              }
            }
            if ((formula.indexOf('SYSDATE') > -1)) {
              let date = new Date()
              formula[formula.indexOf('SYSDATE')] = date.getTime();
            }
            forValue = formula.join('');
          }
          let evalCond;
          try {
            evalCond = eval(forValue);
          } catch (e) {
            evalCond = eval("'" + forValue + "'");
          }
          if (resultArr[0] == 'alert') {
            if (evalCond) {
              let i = 0;
              i++
              if (conditionsArr[1].split(":")[0].indexOf("}") > -1) {
                alert(conditionsArr[1].split(":")[0].split("}")[0]);
              } else {
                alert(conditionsArr[1].split(":")[0]);
              }
            } else {
              let i = 0;
              i++
              if (conditionsArr[1].indexOf(":") > -1) {
                alert(conditionsArr[1].split(":")[1].split("}")[0]);
              }
            }
          }

          if (resultArr[0] == 'error') {
            if (evalCond) {
              item.blurError = conditionsArr[1].split(":")[0].split("}")[0];
              item.isValid = false;
            } else {
              item.blurError = "";
            }
          }

          if (resultArr[0] == 'assign') {
            let formulae = [];
            let itmName;

            if (resultArr[1].indexOf("?") > -1) {

              if (evalCond) {
                itmName = conditionsArr[1].split(":")[0].split("=")[0];
                let formula_Str = conditionsArr[1].split(":")[0].split("=")[1];
                if (formula_Str.indexOf("~") > -1) {
                  formulae = formula_Str.split("~");
                } else {
                  formulae[0] = formula_Str
                }
              } else {
                itmName = conditionsArr[1].split(":")[1].split("=")[0];
                let formula_Str = conditionsArr[1].split(":")[1].split("=")[1].split("}")[0];
                if (formula_Str.indexOf("~") > -1) {
                  formulae = formula_Str.split("~");
                } else {
                  formulae[0] = formula_Str
                }
              }

            } else {

              itmName = resultArr[1].split("=")[0];
              let formula_Str = resultArr[1].split("=")[1].split("}")[0];
              if (formula_Str.indexOf("~") > -1) {
                formulae = formula_Str.split("~");
              } else {
                formulae[0] = formula_Str
              }

            }
            let dateTimeFlag = false;
            let dateFlag = false;
            for (let itemGroup of frame) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if ((formulae.indexOf(item.item_name) > -1)) {
                    let val;
                    if (item.item_sub_type == 'D') {
                      dateFlag = true;
                    } if (item.item_sub_type == 'DT') {
                      dateTimeFlag = true;
                    }
                    if (item.blurValue) {
                      val = item.blurValue
                    } else {
                      if (item.value) {
                        val = item.value
                      } else {
                        val = "0";
                      }
                    }
                    formulae[formulae.indexOf(item.item_name)] = val;
                  }
                }
              }
            }
            let temp = formulae.join('');
            for (let itemGroup of frame) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.item_name && (itmName.toLowerCase() == item.item_name.toLowerCase())) {
                    let value = eval(temp);
                    let finVal = value;
                    if (dateFlag && !dateTimeFlag) {
                      finVal = value / (1000 * 60 * 60 * 24)
                    } if (dateTimeFlag) {
                      finVal = (value / 1000);
                    }
                    item.value = finVal;

                    let nVal = finVal.toString();
                    if (nVal.indexOf('.') > -1) {
                      item.value = parseFloat(nVal).toFixed(3);
                    }
                  }
                }
              }
            }
          }

        }
      }

      return null;
    } catch (err) {
      return null;
    }
  }


  setValueOnCondition(conditionStr: any, frame: any): any {
    try {
      let conditionsArr = conditionStr.split("IF");
      for (let c of conditionsArr) {
        if (c) {
          let condition = c.split("THEN");
          let formulaArr = condition[0].split("#");

          let flag: boolean = false;
          for (let itemGroup of frame) {
            if (itemGroup.Level5) {
              for (let item of itemGroup.Level5) {
                if ((formulaArr.indexOf(item.item_name) > -1) && item.value) {
                  formulaArr[formulaArr.indexOf(item.item_name)] = "'" + item.value + "'";
                  flag = true;
                }
              }
            }
          }
          if (flag) {
            let temp = formulaArr.join('');
            let ifCon = condition[1];
            let elseCon: any;
            if (condition[1].indexOf("ELSE") > -1) {
              ifCon = condition[1].split("ELSE")[0];
              elseCon = condition[1].split("ELSE")[1];
            }
            if (eval(temp)) {
              let thenCon = ifCon.split("#");
              for (let itemGroup of frame) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    for (let t of thenCon) {
                      let con = t.split("~");
                      if (con[0] == item.item_name) {
                        let str = con[1].split("=");
                        item[str[0]] = str[1];

                      }
                    }
                  }
                }
              }
            } else {
              let thenCon = elseCon.split("#");
              for (let itemGroup of frame) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {
                    for (let t of thenCon) {
                      let con = t.split("~");
                      if (con[0] == item.item_name) {
                        let str = con[1].split("=");
                        item[str[0]] = str[1];

                      }
                    }
                  }
                }
              }
            }
          } else {
            return null;
          }
        }
      }

    } catch (err) {
      return null;
    }
  }

  async shareViaWhatsAppWeb(mobileNo, message) {
    try {
      let url = "https://api.whatsapp.com/send?phone=" + encodeURIComponent(mobileNo) + "&amp;text=" + encodeURIComponent(message);
      this.presentAlert(url);
      if (isPlatformServer(this.platformId)) return;
      if (typeof window !== 'undefined') {
        window.open(url);
      }
    } catch (error) {
    }
  }

  async shareViaWhatsApp(mobileNo, message) {
    this.presentAlert(mobileNo + ":" + message);
    await this.socialSharing.shareViaWhatsAppToReceiver(mobileNo, message);
  }

  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }


  startListening() {
    return new Promise((resolve, reject) => {
      this.speechRecognition.isRecognitionAvailable()
        .then((available: boolean) => {
        })
      this.speechRecognition.getSupportedLanguages()
        .then(
          (languages: string[]) => {
          },
          (error) => {
          }
        )
      let options = {
        language: 'en-US'
      }
      this.speechRecognition.startListening(options)
        .subscribe(
          (matches: string[]) => {
            this.speechdata = matches[0],
              resolve(this.speechdata);
          },
          (onerror) => {
            this.speechRecognition.requestPermission()
          }
        )
    })
  }

  barcodescanner() {

    let options: BarcodeScannerOptions = {
      torchOn: true,
      showTorchButton: true,
      prompt: "Point the camera at the barcode"
    };
    return new Promise((resolve, reject) => {

      this.barScanner.scan(options).then(barcodeData => {
        this.barcodeinputdata = barcodeData.text;
        resolve(this.barcodeinputdata);

      }).catch(err => {
      }).finally(function () {
      });
    })
  }

  downloadPdf(shareType, data, title, footer, printData?) {

    let pagesize = 'A4'
    let pagemode = 'portrait';
    if (data[0].length > 8) {
      pagemode = 'landscape';
    }
    if (data[0].length > 12) {
      pagesize = 'A3'
    }

    if (data[0].length > 18) {
      pagesize = 'A2'
    }

    if (footer) {
      data.push(footer);
    }
    let printFilter = {}
    if (printData && printData.length > 0) {
      printFilter = {
        table: {
          body: printData
        }, fontSize: 8, layout: {
          // Remove all horizontal and vertical lines
          hLineWidth: function () { return 0; },
          vLineWidth: function () { return 0; },

        }
      }
    }

    var today = new Date();
    let date = this.formatDate(today, "dd-MMM-yyyy")
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ', ' + time;
    var dateenow = `Print on : ${dateTime}`;

    var docDefinition = {
      pageSize: pagesize,
      pageOrientation: pagemode,
      pageMargins: [30, 20, 30, 20],
      content: [
        { text: title, style: 'title', alignment: 'center' },
        { text: '', style: 'subheader' },
        { text: dateenow, style: 'dating', alignment: 'right' },
        printFilter,
        {
          table: {
            headerRows: 1, fontSize: 20,
            body: data, style: 'body',
          },
          style: 'table',
          layout: {

            orientation: 'landscape',
            hLineStyle: function (rowIndex, node) {
              return { dash: { length: 1, space: 1 } };
            },
            vLineStyle: function (rowIndex, node) {
              return { dash: { length: 1 } };
            },

            fillColor: function (rowIndex, node, columnIndex) {
              if (rowIndex == 0) {
                return '#ffff99';
              } else {

              }
            },
          }
        }
      ],
      styles: {
        title: {
          fontSize: 16,
          alignment: 'auto',
          bold: true,
          background: '#c2f0f0',
          padding: [0, 0, 10, 10],

        },
        table: {
          orientation: 'landscape',
          fontSize: 8,
          alignment: 'auto',
          width: 'auto'
        },

        body: {

          alignment: 'auto',
          width: 'auto'
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'green',
          width: 'auto'
        },
        dating: {
          bold: true,
          fontSize: 8,
          color: 'grey'
        }
      },
    }

    this.downloadPdf2(shareType, docDefinition, title);
    this.arr = [];
  }

  get_dummy_item() {
    let obj = {
      aliases: null,
      apps_frame_seqno: null,
      apps_icon_name: "COMPANYSTOCK",
      apps_item_seqid: "WMGH0008-I-3333",
      apps_page_frame_seqid: "WMGH0008-F-6",
      apps_page_no: "1",
      callingObjectArr: [],
      calling_frame_seqid_str: null,
      calling_object_code: "WMGT0029",
      calling_pageno: null,
      calling_parameter_str: null,
      click_events_str: "get_object_config",
      column_width: null,
      css_class: null,
      data_required_flag: "F",
      datatype: "VARCHAR2",
      db_table_name: null,
      dependent_column_sql: null,
      dependent_column_str: null,
      design_control_type: null,
      design_control_type_auto_card: null,
      display_setting_str: null,
      display_setting_str_auto_card: null,
      flag: "P",
      flag_auto_card: null,
      format_mask: null,
      formula_str: null,
      from_value: null,
      group_no_str: null,
      indexcount: 0,
      input_pattern: null,
      itemIndex: 0,
      item_db_name: null,
      item_default_value: null,
      item_enable_flag: "T",
      item_filter_flag: null,
      item_name: "DUMMY_ITEM",
      item_position_divider: null,
      item_seqno: "12",
      item_size: null,
      item_sub_type: null,
      item_sub_type_auto_card: null,
      item_sub_type_child: null,
      item_type: "TABV2",
      item_type_auto_card: null,
      item_visible_flag: "T",
      lov_code: null,
      lov_return_column_str: null,
      mirror_item_seqid: null,
      object_code: "WMGH0008",
      on_blur: null,
      orignal_apps_item_seqid: "WMGH0008-I-3333",
      orignal_apps_page_frame_seqid: "WMGH0008-F-6",
      orignal_object_code: "WMGH0008",
      parent_item_seqid: null,
      popup_parent_item_seqid: null,
      position: null,
      post_text_validate_plsql: null,
      prompt_name: "Dummy Item",
      sessionObj: undefined,
      session_hold_flag: null,
      summary_flag: null,
      to_value: null,
      tool_tip: null,
      wsdp: []
    }

    return obj;
  }

  downloadPdf2(shareType, docDefinition, title) {

    if (this.platform.is("ios")) {
      let directoryPath = this.file.documentsDirectory;
      this.savePdf(shareType, docDefinition, directoryPath, title);
    }

    else if (this.platform.is("android")) {
      let directoryPath = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/";
      this.checkStoragePermission().then((res) => {
        if (res == 'success') {
          directoryPath = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/";

          this.savePdf(shareType, docDefinition, directoryPath, title);
        } else {
          this.presentAlert("Please grant storage permission to download file.")
        }
      }, (error) => {
        this.presentAlert(JSON.stringify(error));
      })
    } else {
      this.pdfObj = pdfMake.createPdf(docDefinition);
      this.pdfObj.download(title);

      this.displayCordovaToast("Download complete...");


    }
  }

  savePdf(shareType, docDefinition, directoryPath, title) {
    let type = 'application/pdf';
    let ext = '.pdf';
    pdfMake.createPdf(docDefinition).getBuffer(buffer => {
      if (this.platform.is("android")) {
        this.saveFile(buffer, directoryPath, title, type, ext)
      } else {
        this.pdfObj = pdfMake.createPdf(docDefinition);
        this.pdfObj.download(title);

        this.displayCordovaToast("Download complete...");
      }

    })

  }

  downloadExcel(buffer, fileName) {
    let directoryPath = '';
    let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    let ext = '.xlsx';
    if (this.platform.is("ios")) {
      this.lhsLoader = false;
      directoryPath = this.file.documentsDirectory;
      alert(directoryPath);
      this.saveFile(buffer, directoryPath, fileName, type, ext);
    }
    else if (this.platform.is("android")) {
      this.lhsLoader = false;
      this.checkStoragePermission().then((res) => {
        if (res == 'success') {
          directoryPath = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/";
          this.saveFile(buffer, directoryPath, 'file', type, ext);
        } else {
          this.presentAlert("Please grant storage permission to download file.")
        }
      })
    } else {
      this.lhsLoader = false;
      saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fileName);
      this.displayCordovaToast("Download complete...");

    }
  }

  saveFile(buffer, directoryPath, fileName, typee, ext) {
    this.displayCordovaToast("Please wait download started...");
    let files = fileName + JSON.stringify((Math.floor(Math.random() * (999999 - 100000)) + 100000)) + ext;

    let type = typee;
    var blob = new Blob([buffer], { type: type });

    this.downloadFile(directoryPath, files, blob, type, buffer)

  }


  downloadFile(directoryPath, fileName, blob, type, buffer) {
    console.log(blob)
    if (this.platform.is("android") || this.platform.is("ios")) {
      this.file.createFile(directoryPath, fileName, true)
        .then(() => {
          this.file.writeFile(directoryPath, fileName, blob, { replace: true })
            .then(fileEntry => {
              if (fileEntry) {
                console.log(fileEntry)
                if (fileEntry.isFile) {
                  console.log(fileEntry.isFile)
                  this.displayCordovaToast("File Generated");
                }

                this.file.checkFile(directoryPath, fileName).then((exist => {
                  this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {
                  }));
                  if (this.platform.is("ios")) {
                    this.documents.viewDocument(directoryPath + fileName, type, {});
                  } else {
                  }
                })
                ).catch(err => {
                  this.presentAlert('Directory' + JSON.stringify(err));
                });
                this.displayCordovaToast("Download complete...");
              }
            })

        })
        .catch(err => {
          this.presentAlert('Directory' + JSON.stringify(err));

        });

    }

    else {
    }
  }


  viewPhoto(imgData) {
    this.photoViewer.show(imgData, '', { share: true });
  }

  increFont(font) {
    if (font) {
      let elementTagArr = [];
      if (isPlatformServer(this.platformId)) return;
      if (typeof document !== 'undefined') {
        const labeln = document.getElementsByTagName('label');
        const a = document.getElementsByTagName('a');
        const h1 = document.getElementsByTagName('h1');
        const h2 = document.getElementsByTagName('h2');
        const h3 = document.getElementsByTagName('h3');
        const h4 = document.getElementsByTagName('h4');
        const h5 = document.getElementsByTagName('h5');
        const h6 = document.getElementsByTagName('h6');
        const p = document.getElementsByTagName('p');
        const caption = document.getElementsByTagName('caption');
        const td = document.getElementsByTagName('td');
        const th = document.getElementsByTagName('th');
        const body = document.getElementsByTagName('body');
        const label = document.getElementsByTagName('ion-label');
        const button = document.getElementsByTagName('ion-button');
        const marquee = document.getElementsByTagName('marquee');
        const title = document.getElementsByTagName('ion-title');

        elementTagArr.push(body);
        elementTagArr.push(a);
        elementTagArr.push(h1);
        elementTagArr.push(h2);
        elementTagArr.push(h3);
        elementTagArr.push(h4);
        elementTagArr.push(h5);
        elementTagArr.push(h6);
        elementTagArr.push(p);
        elementTagArr.push(caption);
        elementTagArr.push(td);
        elementTagArr.push(th);
        elementTagArr.push(label);
        elementTagArr.push(labeln);
        elementTagArr.push(button);
        elementTagArr.push(marquee);
        elementTagArr.push(title);

        for (let z = 0; z <= elementTagArr.length; z++) {
          try {
            for (let i = 0; elementTagArr[z].length > i; i++) {
              elementTagArr[z][i].setAttribute('style', `font-family: ${font} !important;`);
            }
          } catch (error) {
            // ...existing code...
          }
        }
      }
    }
  }
  changeFont(font) {
    if (font) {
      this.fontype = font;
      if (isPlatformServer(this.platformId)) return;
      let elementTagArr = [];

      const labeln = document.getElementsByTagName('label');
      const a = document.getElementsByTagName('a');
      const h1 = document.getElementsByTagName('h1');
      const h2 = document.getElementsByTagName('h2');
      const h3 = document.getElementsByTagName('h3');
      const h4 = document.getElementsByTagName('h4');
      const h5 = document.getElementsByTagName('h5');
      const h6 = document.getElementsByTagName('h6');
      const p = document.getElementsByTagName('p');
      const caption = document.getElementsByTagName('caption');
      const td = document.getElementsByTagName('td');
      const th = document.getElementsByTagName('th');
      const body = document.getElementsByTagName('body');
      const label = document.getElementsByTagName('ion-label');
      const button = document.getElementsByTagName('ion-button');
      const marquee = document.getElementsByTagName('marquee');
      const title = document.getElementsByTagName('ion-title');

      elementTagArr.push(body);
      elementTagArr.push(a);
      elementTagArr.push(h1);
      elementTagArr.push(h2);
      elementTagArr.push(h3);
      elementTagArr.push(h4);
      elementTagArr.push(h5);
      elementTagArr.push(h6);
      elementTagArr.push(p);
      elementTagArr.push(caption);
      elementTagArr.push(td);
      elementTagArr.push(th);
      elementTagArr.push(label);
      elementTagArr.push(labeln);
      elementTagArr.push(button);
      elementTagArr.push(marquee);
      elementTagArr.push(title);

      for (let z = 0; z <= elementTagArr.length; z++) {
        try {
          for (let i = 0; elementTagArr[z].length > i; i++) {
            elementTagArr[z][i].setAttribute('style', `font-family: ${this.fontype} !important;`);
          }
        } catch (error) {
        }
      }
    }
  }
  increFontsize(size) {

    let fonstoge = this.getLocallData("fontSize");
    // console.log(fonstoge);



    if (size) {
      this.fontSize = size;

      const tags = [
        'body', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'caption', 'td', 'th', 'ion-label', 'label', 'marquee'
      ];

      let elementTagArr = tags.map(tag => document.getElementsByTagName(tag) as HTMLCollectionOf<HTMLElement>);

      let baseFontSize = this.getLocallData('fontSize') || this.fontSize;
      let fontWeight = this.getLocallData('fontWeight');

      for (let z = 0; z < elementTagArr.length; z++) {
        try {
          const tagName = tags[z];

          for (let i = 0; i < elementTagArr[z].length; i++) {
            let element = elementTagArr[z][i];

            let finalSize = baseFontSize;

            // ✅ your conditions here
            if (tagName === 'p') {
              finalSize = baseFontSize + 0.1;
            }
            else if (tagName === 'h1') {
              finalSize = baseFontSize + 0.3;
            }
            else if (tagName === 'h2') {
              finalSize = baseFontSize + 0.2;
            }
            else if (tagName === 'h3') {
              finalSize = baseFontSize + 0.2;
            }
            else if (tagName === 'h4') {
              finalSize = baseFontSize + 0.1;
            }
            else if (tagName === 'h5') {
              finalSize = baseFontSize + 0.1;
            }
            else if (tagName === 'h6') {
              finalSize = baseFontSize + 0.2;
            }
            else if (tagName === 'td' || tagName === 'caption') {
              finalSize = baseFontSize - 0.2;
            }

            // ✅ apply styles (no overwrite issue)
            element.style.setProperty('font-size', finalSize + 'rem', 'important');
            // element.style.fontSize = finalSize + 'rem !important';

            if (fontWeight) {
              element.style.fontWeight = fontWeight;
            }
          }
        } catch (error) { }
      }
    }


    // if (size) {
    //   this.fontSize = size;

    //   let elementTagArr = [
    //     document.getElementsByTagName('body'),
    //     document.getElementsByTagName('a'),
    //     document.getElementsByTagName('h1'),
    //     document.getElementsByTagName('h2'),
    //     document.getElementsByTagName('h3'),
    //     document.getElementsByTagName('h4'),
    //     document.getElementsByTagName('h5'),
    //     document.getElementsByTagName('h6'),
    //     document.getElementsByTagName('p'),
    //     document.getElementsByTagName('caption'),
    //     document.getElementsByTagName('td'),
    //     document.getElementsByTagName('th'),
    //     document.getElementsByTagName('ion-label'),
    //     document.getElementsByTagName('label'),
    //     document.getElementsByTagName('marquee')
    //   ];
    //   let fontSize = this.getLocallData('fontSize');
    //   let fontWeigt = this.getLocallData('fontWeight');
    //   let str = fontSize ? ("font-size : " + fontSize + 'rem !important' + (fontWeigt ? ';font-weight:' + fontWeigt + ' !important' : "")) : fontWeigt ? 'font-weight:' + fontWeigt + ' !important' : "";

    //   for (let z = 0; z < elementTagArr.length; z++) {
    //     try {
    //       for (let i = 0; i < elementTagArr[z].length; i++) {
    //         let element = elementTagArr[z][i];
    //         // let currentStyle = element.getAttribute('style') || '';
    //         // currentStyle = currentStyle.replace(/font-size\s*:\s*[^;]+;?/gi, '');
    //         // let newStyle = currentStyle + `font-size: ${this.fontSize}rem !important; `;
    //         element.setAttribute('style', str);
    //         // console.log(str)
    //       }
    //     } catch (error) {
    //     }
    //   }
    // }
  }













  // Getting callingObjectObjectStr from frame SQL
  getCallingObjectCodeArr(objData) {
    let callingObjectCodeArr = []
    if (objData) {
      for (let obj of objData) {
        let key = "CALLING_OBJECT_CODE";
        for (let keySet in obj) {
          if (key == keySet) {
            let callingObjectSet: any = {};
            callingObjectSet.key = obj.ROWNUMBER;
            callingObjectSet.value = obj.CALLING_OBJECT_CODE;
            callingObjectCodeArr.push(callingObjectSet);
          }
        }
      }
    }
    return callingObjectCodeArr;
  } // End Method
  // Getting callingObjectObjectStr from frame SQL End


  // ----------Getting Code-Value pair from String (code~value$$code~value)
  getCodeValueJsonArr(codeValueStr) {
    if (codeValueStr) {
      let codeValueJsonArr: any = [];
      if (codeValueStr.indexOf("$$") > -1) {
        let codeValuePairArr: any = codeValueStr.split("$$");
        if (codeValuePairArr) {
          for (let codeValuePair of codeValuePairArr) {
            if (codeValuePair.indexOf("~")) {
              let codeValueData: any = {}
              let codeValue: any = codeValuePair.split("~");
              codeValueData.head = codeValue[0];
              codeValueData.objectCode = codeValue[1];
              codeValueJsonArr.push(codeValueData);
            }
          }
        }
      }
      return codeValueJsonArr;
    }
  }// End Method


  setAudioParam(param) {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.nativeAudio.unload(this.audio.id);
      this.nativeAudio.preloadComplex(param.id, param.sound, 1, param.volume, 1).then(() => {

      })
    }
  }

  logEvents(obj, ex_ws_seq_no, ws_seq_no, status, message) {

    let today = new Date();
    let timeStamp = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear() + " | " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
    let clickeItems = this.getLocallData("clickedItem") ? this.getLocallData("clickedItem") : [];
    let resObj = { "ex_ws_seq_no": ex_ws_seq_no, "ws_seq_no": ws_seq_no, "status": status, "message": message };
    obj["timeStamp"] = timeStamp;
    obj["response"] = resObj;

    if (typeof (clickeItems) == "string") {
      clickeItems = JSON.parse(clickeItems);
    }
    clickeItems.unshift(obj);
    if (clickeItems.length > 50) {
      clickeItems.splice(50, clickeItems.length - 50);
    }
    if (this.toggleDevloperMode()) {
      this.setDataLocally("clickedItem", clickeItems);
    }
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'mp3': 'audio/mpeg',
      'mpeg': 'video/mpeg',
      'wav': 'audio/wav',
      'weba': 'audio/webm',
      'webm': 'video/webm',
      'wmv': 'video/x-ms-wmv',
      'mp4': 'video/mp4',
      'apk': 'application/vnd.android.package-archive',
      'csv': 'text/csv'
    }
    return MIMETypes[ext];
  }

checkGPSPermission() {
   return new Promise((resolve, reject) => {
     if (this.platform.is('ios')) {
       CapacitorGeolocation.checkPermissions()
         .then(async (permissions) => {
           const locationPermission = permissions.location === 'prompt'
             ? (await CapacitorGeolocation.requestPermissions({ permissions: ['location'] })).location
             : permissions.location;


           if (locationPermission === 'granted') {
             resolve('success');
           } else {
             reject('location permission denied');
           }
         })
         .catch(error => reject(error));
       return;
     }


     this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
       result => {
         console.log('Has permission?', result.hasPermission);
         if (result.hasPermission) {
           console.log("Has permission");
           //If having permission show 'Turn On GPS' dialogue
           this.askToTurnOnGPS().then(res => {
             resolve(res);
           }, err => reject(err));


         } else {
           //If not having permission ask for permission
           this.requestGPSPermission().then((res) => {
             resolve(res);
           }, err => reject(err));
         }
       },
       err => {
         reject(err);
       }
     );
   })
 }





  // checkStoragePermission() {  new 
  //   return new Promise((resolve, reject) => {
  //     this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
  //       .then(status => {
  //         this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((writeStatus) => {
  //           if (writeStatus.hasPermission) {
  //             if (status.hasPermission) {
  //               this.file.checkDir(this.file.externalRootDirectory, "Download").then((res) => {
  //                 resolve("success")
  //               }, (error) => {
  //                 this.file.createDir(this.file.externalRootDirectory, "Download", true).then(() => {
  //                   resolve("success");
  //                 }, (error) => {
  //                   reject(error)
  //                 });
  //               })
  //             }
  //             else {
  //               this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
  //                 .then(status => {
  //                   if (status.hasPermission) {
  //                     this.file.checkDir(this.file.externalRootDirectory, "Download").then(() => {
  //                       resolve("success")
  //                     }, (error) => {
  //                       this.file.createDir(this.file.externalRootDirectory, "Download", true).then(() => {
  //                         resolve("success");
  //                       }, (error) => {
  //                         reject(error)
  //                       });
  //                     })
  //                   }
  //                 }, (err) => reject(err));
  //             }
  //           } else {
  //             this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((writeStatus1) => {
  //               if (writeStatus1.hasPermission) {
  //                 if (status.hasPermission) {
  //                   this.file.checkDir(this.file.externalRootDirectory, "Download").then((res) => {
  //                     resolve("success")
  //                   }, (error) => {
  //                     this.file.createDir(this.file.externalRootDirectory, "Download", true).then(() => {
  //                       resolve("success");
  //                     }, (error) => {
  //                       reject(error)
  //                     });
  //                   })
  //                 }
  //                 else {
  //                   this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
  //                     .then(status => {
  //                       if (status.hasPermission) {
  //                         this.file.checkDir(this.file.externalRootDirectory, "Download").then(() => {
  //                           resolve("success")
  //                         }, (error) => {
  //                           this.file.createDir(this.file.externalRootDirectory, "Download", true).then(() => {
  //                             resolve("success");
  //                           }, (error) => {
  //                             reject(error)
  //                           });
  //                         })
  //                       }
  //                     }, (err) => reject(err));
  //                 }
  //               }
  //             }, (error) => reject(error))
  //           }
  //         }, (error) => reject(error))
  //       }, err => reject(err));
  //   })
  // }
  checkStoragePermission() {
    return new Promise((resolve, reject) => {

      this.file.checkDir(this.file.externalRootDirectory, "Download").then((res) => {
        // alert("this.file.externalRootDirectory")
        resolve("success")
      }
      )
    })
  }
  requestGPSPermission() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          resolve('success');
        } else {
          //Show 'GPS Permission Request' dialogue
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              (res) => {
                // call method to turn on GPS
                if (res.hasPermission) {
                  this.askToTurnOnGPS().then(res => {
                    resolve(res);
                  }, err => reject(err));
                }
                else {
                  reject('error');
                }
              },
              error => {
                //Show alert if user click on 'No Thanks'
                reject(error);
              }
            );
        }
      }, (error) => {
        reject(error);
      });
    })
  }

  askToTurnOnGPS() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.isRequesting().then((requesting: boolean) => {
        if (requesting) {
          resolve('success');
        } else {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              // When GPS Turned ON call method to get Accurate location coordinates
              console.log("GPS is turned on!");
              this.getLocation();
              resolve('success');
            },
            (error) => {
              reject(error)
            }
          );
        }
      })
    })
  }





async converToBase64(file: any): Promise<string> {
  try {
    console.log('file:', file);
    console.log('file type:', typeof file);
    console.log('is Blob:', file instanceof Blob);
    console.log('file size:', file.size);
    console.log('file name:', file.name);
    console.log('file type:', file.type);

    const arrayBuffer = await file.arrayBuffer();

    console.log('arrayBuffer size:', arrayBuffer.byteLength);

    const bytes = new Uint8Array(arrayBuffer);

    let binary = '';

    const chunkSize = 8192;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);

      binary += String.fromCharCode(...chunk);
    }

    const base64 = btoa(binary);

    const result =
      `data:${file.type || 'application/pdf'};base64,${base64}`;

    console.log('Base64 created');
    console.log('Base64 length:', result.length);

    return result;

  } catch (error) {
    console.error('Base64 conversion error:', error);
    throw error;
  }
}




  // converToBase64(file) {
  //   console.log("file", file);
  //   return new Promise((resolve, reject) => {
  //     const reader:any = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader._result);
  //     reader.onerror = error => reject(error);
  //   });
  // }

  // presentAlert(msg) {
  //   return new Promise(async (resolve, reject) => {
  //     alert(msg);
  //     resolve("");
  //   })

  // }

  // async presentAlert(
  //   msg: string,
  //   header: string = 'ⓘ Alert'
  // ) {

  //   const alert = await this.alertController.create({
  //     header: header,
  //     message: msg,
  //     buttons: ['OK'],
  //     backdropDismiss: false
  //   });

  //   await alert.present();

  //   const result = await alert.onDidDismiss();

  //   return result;

  // }

  async presentAlert(
    msg: string,
    header: string = 'Alert'
  ) {

    const alert = await this.alertController.create({

      header: '',

      message: `
    
      <div class="custom-alert-container">

        <div class="custom-alert-header">

          <div class="alert-icon">
            !
          </div>

          <div class="alert-title">
            ${header}
          </div>

        </div>

        <div class="custom-alert-message">
          ${msg}
        </div>

      </div>

    `,

      buttons: [
        {
          text: 'OK',
          cssClass: 'alert-ok-btn'
        }
      ],

      cssClass: 'custom-alert-design',

      backdropDismiss: false

    });

    await alert.present();
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      this.converToBase64(blob).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  emailSendOfTableData(shareType, headerdata, pdfHeading, footer, perintData?) {
    this.downloadPdf(shareType, headerdata, pdfHeading, footer, perintData);
  }


  pdfFilesend(docDefinition, directoryPath) {
    if (this.platform.is("android") || this.platform.is("ios")) {
      pdfMake.createPdf(docDefinition).getBuffer((buffer => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        let fileName = "";
        fileName = JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
        fileName = fileName + ".pdf";
        this.file.writeFile(directoryPath, fileName, blob, { replace: true })
          .then(fileEntry => {
            this.displayCordovaToast("Download complete...");
            if (fileEntry) {

              if (fileEntry.isFile) {
                this.displayCordovaToast("File Generated");
              }

              this.file.checkFile(directoryPath, fileName).then((exist => {
                this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {
                }));
                let email = {
                  to: '',
                  cc: '',
                  attachments: [
                    directoryPath + fileName
                  ],
                  subject: '',
                  body: '',
                  isHtml: true
                };
                this.emailComposer.open(email);

              })
              ).catch(err => {
                this.presentAlert('Directory' + JSON.stringify(err));
              });
            }
          })
          .catch(err => {
            this.presentAlert('Directory does not exist');
          })
      }));
    }
    this.displayCordovaToast("File Generated");
  }


  bulitinsEvent(service_type, key, frame_id, eventStr) {
    let obj = {
      apps_page_frame_seqid: frame_id,
      click_events_str: service_type,
      keyIndex: key,
      event_return_id: frame_id,
      eventStr: eventStr,
      evFlag: "T"
    }
    let name = "wmaBultins";
    this.events.publish(name, obj);

  }


  async startLoading(loadingCount) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      backdropDismiss: false,
      duration: (loadingCount * 130)
    });
    await loading.present();
  }

  navigateBreadcrumsObj(event, i) {
    for (let j = this.breadCrumpsSameObjArray.length; j > i; j--) {
      setTimeout(() => {
        this.modalController.dismiss();
      }, 2000);
    }
  }

  goToHomePage() {
    // this.activeItems="";
    // let user = this.getLocallData("userDetails");
    // this.backObjectCode = user.homeObjectCode;
    // this.backObjectPageName = null;
    // this.navigateParam = true;
    // if (this.breadCrumpsArray && this.breadCrumpsArray.length > 0) {
    //   try {
    // this.modalController.dismiss();

    // const canvasModal=this.injector.get(CanvasModalService)
    // canvasModal.popDismiss();
    // } catch (e) {
    //   this.breadCrumpsArray = [];
    // this.events.publish("logOut");
    // }
    // } else {
    // this.events.publish("logOut");
    // }

  }

  getContactpermission() {
  }
  showLoading() {
  }
  hideLoading() {
  }


  showLhsLoader() {
    this.lhsLoader = !this.lhsLoader;
    return this.lhsLoader;
  }



  public async openModal(val) {
    const modal = await this.modalController.create({
      component: JsonListingPage,
      componentProps: { value: val }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();

  }

  //Network Speed & Type
  ShowProgressMessage(msg) {
    if (console) {
      if (typeof msg == "string") {
        console.log(msg);
      } else {
        for (var i = 0; i < msg.length; i++) {
          console.log(msg[i]);
        }
      }
    }
    let actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
    alert(actualHTML);
    console.log(actualHTML);
  }


  InitiateSpeedDetection() {
    if (isPlatformServer(this.platformId)) return;
    if (typeof window !== 'undefined') {
      window.setTimeout(this.MeasureConnectionSpeed, 1);
    }
  }



  MeasureConnectionSpeed() {
    return new Promise((resolve, reject) => {

      var startTime, endTime;
      var download = new Image();
      let totalSize: any = 0;
      this.networkSpeed = download.onload = function () {
        endTime = new Date().getTime();
        for (let i = 0; i <= 5; i++) {
          let speed = showResults();
          totalSize = totalSize + speed;
        }

        resolve((totalSize / 5).toFixed(2));
      };

      download.onerror = function (err, msg) {
        this.ShowProgressMessage("Invalid image, or error downloading");
      };
      let image = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg";
      this.imageAddr = image;
      this.downloadSize = 7300000
      startTime = new Date().getTime();
      var cacheBuster = "?nnn=" + startTime;
      download.src = this.imageAddr + cacheBuster;

      function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = 7300000 * 8;
        let speedBps: any = (bitsLoaded / duration).toFixed(2);
        let speedKbps: any = (speedBps / 1024).toFixed(2);
        let speedMbps: any = (speedKbps / 1024).toFixed(2);

        return parseFloat(speedMbps);
      }
    })
  }
  //Network Type
  connectionType() {
    if (typeof navigator !== 'undefined') {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      //     // Fallback for unknown network types
      this.networkType = connection.type;
    }

  }


  getLocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: (this.intervalTimeout * 60 * 1000 / 2) / 2,
    };
    this.geoLocation.getCurrentPosition(options).then((pos) => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      this.timestamp = pos.timestamp;
      this.message = "geoLocation";

      this.latitude1 = pos.coords.latitude;
      this.longitude1 = pos.coords.longitude;
      console.log("Latitude: " + this.latitude + "\nLongitude: " + this.longitude + "\nTimestamp: " + this.timestamp);
    }).catch((error) => {

      this.latitude = "";
      this.longitude = "";
      this.timestamp = "";
      this.message = error.message;
      this.latitude1 = "";
      this.longitude1 = "";
      this.getNavigator();
    });
  }

  getNavigator() {
    var options = {
      enableHighAccuracy: true,
      timeout: ((this.intervalTimeout * 60 * 1000 / 2) - 5),
      maximumAge: 36000
    };
    console.log("navigator.geolocation.getCurrentPosition")
    if (isPlatformServer(this.platformId)) return;
    console.log("navigator.geolocation.getCurrentPosition aftre platform id"+ this.platformId)
    navigator.geolocation.getCurrentPosition(position => {
console.log("navigator.geolocation.getCurrentPosition after position")
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.timestamp = position.timestamp;
      this.message = "navigator.geolocation"

    }, () => { }, options)
  }

  // after changes in IOS


  //time split
  splitToTwoDigits(num: number): number[] {
    const str = num.toString();
    const chunks = str.match(/.{1,2}/g) || [];
    return chunks.map(Number);
  }


  async formatDate2(value, dateinput): Promise<any> {

    let symbolArr = [",", ".", "~", " ", "-", "=", ":", "/"];
    let monthArr = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    let formatMask = "DD-MM-YYYY";
    let formatSymbol = "-";
    let formatMaskArr = ["DD", "MM", "YYYY"]
    let timeMask = "";
    let timeMeridiemMain = " AM";
    let dateModel: DateModel = new DateModel();
    let dateModel1: NgbDateStruct;

    let datetimeModel: DateTimeModel = new DateTimeModel();

    if (dateinput.format_mask) {
      dateinput.format_mask = dateinput.format_mask.replaceAll("R", "Y");
      dateinput.format_mask = dateinput.format_mask.replaceAll("r", "Y");
      dateinput.format_mask = dateinput.format_mask.replaceAll("MON", "MMM");
      dateinput.format_mask = dateinput.format_mask.replaceAll("mon", "MMM");

      dateinput.format_mask = dateinput.format_mask.replaceAll("d", "D");
      dateinput.format_mask = dateinput.format_mask.replaceAll("m", "M");
      if (dateinput.datatype == 'DATETIME') {
        formatMask = dateinput.format_mask.split(" ")[0];
        timeMask = dateinput.format_mask.split(" ")[1];
      } else {
        formatMask = dateinput.format_mask;
      }
      for (let s of symbolArr) {
        if (formatMask.indexOf(s) > -1) {
          formatSymbol = s;
          break;
        }
      }

      formatMask = formatMask.toUpperCase();
      formatMaskArr = formatMask.split(formatSymbol);
    }


    dateinput.vadidateMsg = "";
    let dateVal = value
    let timeMeridiem = value.split(' ')[1]
    let timeString = "";
    if (dateVal) {

      if (dateinput.datatype == 'TIME') {

        if (value.split(' ')[1]) {
          let values = value.replace(value.split(' ')[1], "");
          value = values.replace(' ', '');
          dateVal = dateVal.replace(value.split(' ')[1], "");
        }

        let time = value
        if (time) {

          let timeSeparator = "";
          for (let s of symbolArr) {
            if (time.indexOf(s) > -1) {
              timeSeparator = s;
              break;
            }
          }
          if (timeSeparator == "") {
            let timevalue = this.splitToTwoDigits(time)
            time = timevalue.join(".")
            timeSeparator = "."
          }
          if (timeSeparator) {
            let tArr = time.split(timeSeparator);
            let tempVal = "";
            let index = 0;
            for (let t of tArr) {
              if (isNaN(t)) {
                dateinput.isValid = false;
                dateinput.forcedInvalid = true;
                dateinput.vadidateMsg = "Please enter valid time.";
                return false;
              } if (index == 0 && parseInt(t) >= 24) {

                dateinput.isValid = false;
                dateinput.forcedInvalid = true;
                dateinput.vadidateMsg = "Please enter valid time.";
                return false;
                // }
              } else if (parseInt(t) >= 60) {
                dateinput.isValid = false;
                dateinput.forcedInvalid = true;
                dateinput.vadidateMsg = "Please enter valid time.";
                return false;
              } else {
                tempVal = tempVal ? tempVal + ":" + t : t;
                dateinput.isValid = true;
              }
              index++;
            }

            let i = tArr.length;
            while (i < 3) {
              tempVal += ":00"
              i++;
            }

            if (!datetimeModel.hour) {
              let setTime = tempVal.split(timeSeparator);
              datetimeModel.hour = parseFloat(setTime[0]);
              datetimeModel.minute = parseFloat(setTime[1]);
              datetimeModel.second = parseFloat(setTime[2]);
            }


            if (timeMask) {
              if (timeMask.toLowerCase() == 'hh:mm:ss' || timeMask.toLowerCase() == 'hh:mi:ss') {
                let hh = tempVal.slice(0, tempVal.indexOf(":"))//tempVal.slice(tempVal.indexOf(":") + 1);
                if (parseInt(hh) > 12) {
                  hh = (parseInt(hh) - 12).toString();
                  tempVal = hh + tempVal.slice(tempVal.indexOf(":"));
                  timeMeridiemMain = " PM"
                } else {
                  timeMeridiemMain = " AM"
                }

              } else if (timeMask.toLowerCase() == 'hh:mm' || timeMask.toLowerCase() == 'hh:mi') {
                let hh = tempVal.slice(0, tempVal.indexOf(":"))//tempVal.slice(tempVal.indexOf(":") + 1);
                if (parseInt(hh) > 12) {
                  hh = (parseInt(hh) - 12).toString();
                  tempVal = hh + tempVal.slice(tempVal.indexOf(":"));
                  timeMeridiemMain = " PM"
                } else {
                  timeMeridiemMain = " AM"
                }
              } else if (timeMask.toLowerCase() == 'hh24:mm:ss' || timeMask.toLowerCase() == 'hh24:mi:ss') {
                let hh = tempVal.slice(0, tempVal.indexOf(":"));
                if (parseInt(hh) >= 12) {
                  timeMeridiemMain = ""
                } else {
                  timeMeridiemMain = ""
                }
              } else if (timeMask.toLowerCase() == 'hh24:mm' || timeMask.toLowerCase() == 'hh24:mi') {
                let hh = tempVal.slice(0, tempVal.indexOf(":"));
                if (parseInt(hh) >= 12) {
                  timeMeridiemMain = ""
                } else {
                  timeMeridiemMain = ""
                }
                tempVal = tempVal.slice(0, tempVal.lastIndexOf(":"));
              }
            } else {
              if ((datetimeModel.hour) > 12) {
                timeMeridiemMain = ""
              } else {
                timeMeridiemMain = ""
              }
            }

            timeString = tempVal;
          } else {
            if (isNaN(time)) {
              dateinput.isValid = false;
              dateinput.forcedInvalid = true;
              dateinput.vadidateMsg = "Please enter valid date and time.";
              return false;
            } else if (parseInt(time) >= 60) {
              dateinput.isValid = false;
              dateinput.forcedInvalid = true;
              dateinput.vadidateMsg = "Please enter valid date and time.";
              return false;
            } else {
              timeString = time
              let i = 1;
              while (i < 3) {
                timeString += ":00"
                i++;
              }
            }
          }
        } else {
          timeString = '00:00:00'
        }
        if (timeMeridiem) {
          timeString = timeString + ' ' + timeMeridiem
        }

        dateinput.value = timeString;
        dateinput.displayDate = timeString;

      } else {
        try {


          if (dateinput.datatype == 'DATETIME') {
            if (timeMeridiemMain) {
              value = value.replace(timeMeridiemMain, "");
              dateVal = dateVal.replace(timeMeridiemMain, "");
            }

            let timeArray = value.split(" ");
            if (timeArray.length <= 2) {
              let time = value.split(" ")[1];
              if (time) {
                dateVal = value.split(" ")[0];
                let timeSeparator = "";
                for (let s of symbolArr) {
                  if (time.indexOf(s) > -1) {
                    timeSeparator = s;
                    break;
                  }
                }
                if (timeSeparator == "") {
                  let timevalue = this.splitToTwoDigits(time)
                  time = timevalue.join(".")
                  timeSeparator = "."
                }
                if (timeSeparator) {
                  let tArr = time.split(timeSeparator);
                  let tempVal = "";
                  let index = 0;
                  for (let t of tArr) {
                    if (isNaN(t)) {
                      dateinput.isValid = false;
                      dateinput.forcedInvalid = true;
                      dateinput.vadidateMsg = "Please enter valid  time.";
                      return false;
                    } if (index == 0 && parseInt(t) >= 24) {
                      if (tArr[0] == 24) {
                        dateinput.isValid = false;
                        dateinput.forcedInvalid = true;
                        dateinput.vadidateMsg = "Please enter valid  time.";
                        return false;
                      }
                    } else if (parseInt(t) >= 60) {
                      dateinput.isValid = false;
                      dateinput.forcedInvalid = true;
                      dateinput.vadidateMsg = "Please enter valid  time.";
                      return false;
                    } else {
                      tempVal = tempVal ? tempVal + ":" + t : t;
                    }
                    index++;
                  }

                  let i = tArr.length;
                  while (i < 3) {
                    tempVal += ":00"
                    i++;
                  }

                  if (!datetimeModel.hour) {
                    let setTime = tempVal.split(timeSeparator);
                    datetimeModel.hour = parseFloat(setTime[0]);
                    datetimeModel.minute = parseFloat(setTime[1]);
                    datetimeModel.second = parseFloat(setTime[2]);
                  }


                  if (timeMask) {
                    if (timeMask.toLowerCase() == 'hh:mm:ss' || timeMask.toLowerCase() == 'hh:mi:ss') {
                      let hh = tempVal.slice(0, tempVal.indexOf(":"))//tempVal.slice(tempVal.indexOf(":") + 1);
                      if (parseInt(hh) > 12) {
                        hh = (parseInt(hh) - 12).toString();
                        tempVal = hh + tempVal.slice(tempVal.indexOf(":"));
                        timeMeridiemMain = " PM"
                      } else {
                        timeMeridiemMain = " AM"
                      }

                    } else if (timeMask.toLowerCase() == 'hh:mm' || timeMask.toLowerCase() == 'hh:mi') {
                      let hh = tempVal.slice(0, tempVal.indexOf(":"))//tempVal.slice(tempVal.indexOf(":") + 1);
                      if (parseInt(hh) > 12) {
                        hh = (parseInt(hh) - 12).toString();
                        tempVal = hh + tempVal.slice(tempVal.indexOf(":"));
                        timeMeridiemMain = " PM"
                      } else {
                        timeMeridiemMain = " AM"
                      }
                    } else if (timeMask.toLowerCase() == 'hh24:mm:ss' || timeMask.toLowerCase() == 'hh24:mi:ss') {
                      let hh = tempVal.slice(0, tempVal.indexOf(":"));
                      if (parseInt(hh) >= 12) {
                        timeMeridiemMain = ""
                      } else {
                        timeMeridiemMain = ""
                      }
                    } else if (timeMask.toLowerCase() == 'hh24:mm' || timeMask.toLowerCase() == 'hh24:mi') {
                      let hh = tempVal.slice(0, tempVal.indexOf(":"));
                      if (parseInt(hh) >= 12) {
                        timeMeridiemMain = ""
                      } else {
                        timeMeridiemMain = ""
                      }
                      tempVal = tempVal.slice(0, tempVal.lastIndexOf(":"));
                    }
                  } else {
                    if ((datetimeModel.hour) > 12) {
                      timeMeridiemMain = ""
                    } else {
                      timeMeridiemMain = ""
                    }
                  }

                  timeString = tempVal;
                } else {
                  if (isNaN(time)) {
                    dateinput.isValid = false;
                    dateinput.forcedInvalid = true;
                    dateinput.vadidateMsg = "Please enter valid date and time.";
                    return false;
                  } else if (parseInt(time) > 60) {
                    dateinput.isValid = false;
                    dateinput.forcedInvalid = true;
                    dateinput.vadidateMsg = "Please enter valid date and time.";
                    return false;
                  } else {
                    timeString = time
                    let i = 1;
                    while (i < 3) {
                      timeString += ":00"
                      i++;
                    }
                  }
                }
              } else {
                timeString = '00:00:00'
              }
            } else {
              dateinput.isValid = false;
              dateinput.forcedInvalid = true;
              dateinput.vadidateMsg = "Please enter valid date and time.";
              return false;
            }
          }

          let dateValFormatSym = "";
          for (let s of symbolArr) {
            if (dateVal.indexOf(s) > -1) {
              dateValFormatSym = s;
              break;
            }
          }

          let dateValArr = [];

          if (dateValFormatSym) {
            dateValArr = dateVal.split(dateValFormatSym);
          }

          for (let i = 0; i < dateValArr.length; i++) {
            dateValArr[i] = dateValArr[i].trim();
            let val1 = dateValArr[i].length;
            let val2 = formatMaskArr[i].length;

            if (val1 > val2) {

              if (formatMaskArr[i].indexOf('M') > -1) {
                if (isNaN(dateValArr[i])) {
                  if (monthArr.indexOf(dateValArr[i].toLowerCase()) > -1) {
                    let m = monthArr.indexOf(dateValArr[i].toLowerCase()) + 1;
                    dateValArr[i] = (m > 9 ? m.toString() : "0" + m);
                  } else {
                    dateinput.isValid = false;
                    dateinput.forcedInvalid = true;
                    dateinput.vadidateMsg = "Please enter valid month.";
                    return false;
                  }

                } else {
                  dateinput.isValid = false;
                  dateinput.forcedInvalid = true;
                  dateinput.vadidateMsg = "Date format must be " + formatMask;
                  return false;
                }
              } else {
                dateinput.isValid = false;
                dateinput.forcedInvalid = true;
                dateinput.vadidateMsg = "Date format must be " + formatMask;
                return false;
              }

            }

            if ((formatMaskArr[i].indexOf('Y') > -1) || (formatMaskArr[i].indexOf('R') > -1)) {
              let year = dateValArr[i];

              if (val1 < val2) {
                year = new Date("01-01-" + year).getFullYear();
                dateValArr[i] = year;
              } else {
                dateValArr[i] = year;
              }
            }


            if (val2 == 3) {
              try {

                if (isNaN(dateValArr[i])) {
                  if (monthArr.indexOf(dateValArr[i].toLowerCase()) > -1) {
                    dateValArr[i] = dateValArr[i];
                  } else {
                    dateinput.isValid = false;
                    dateinput.forcedInvalid = true;
                    dateinput.vadidateMsg = "Please enter valid month.";
                    return false;
                  }

                } else {
                  let m = parseInt(dateValArr[i]);
                  dateValArr[i] = monthArr[m - 1];
                }

              } catch {
                if (isNaN(dateValArr[i])) {
                  dateValArr[i] = dateValArr[i];
                } else {
                  dateinput.isValid = false;
                  dateinput.forcedInvalid = true;
                  dateinput.vadidateMsg = "Please enter valid month.";
                  return false;
                }
              }

            }


            if (val2 > val1) {
              if (val2 == 2) {
                dateValArr[i] = "0" + dateValArr[i];
              }
            }

          }

          if (dateValFormatSym) {
            dateVal = dateValArr.join("");
          }

          let finalDate = [];

          for (let d of formatMaskArr) {

            if (dateVal) {
              if (d.indexOf('D') > -1) {
                let date = dateVal.slice(0, d.length);
                dateVal = dateVal.substr(d.length, dateVal.length);
                if (isNaN(date)) {
                  dateinput.isValid = false;
                  dateinput.forcedInvalid = true;
                  dateinput.vadidateMsg = "Please enter valid date.";
                  return false;
                } else {
                  if (date > 31) {
                    dateinput.isValid = false;
                    dateinput.forcedInvalid = true;
                    dateinput.vadidateMsg = "Please enter valid date.";
                    return false;
                  } else {
                    finalDate.push(date);
                  }
                }
              } else if (d.indexOf('M') > -1) {

                let month = dateVal.slice(0, d.length);
                if (d.length == 3 && isNaN(month)) {
                  dateVal = dateVal.substr(d.length, dateVal.length);
                } else {
                  month = dateVal.slice(0, 2);
                  dateVal = dateVal.substr(2, dateVal.length);
                }
                if (d.length < 3 && isNaN(month)) {
                  dateinput.isValid = false;
                  dateinput.forcedInvalid = true;
                  dateinput.vadidateMsg = "Please enter valid month."
                  return false;
                } else if (d.length == 3) {

                  if (isNaN(month)) {
                    if (monthArr.indexOf(month.toLowerCase()) > -1) {
                      month = month;
                    } else {
                      dateinput.isValid = false;
                      dateinput.forcedInvalid = true;
                      dateinput.vadidateMsg = "Please enter valid month.";
                      return false;
                    }

                  } else {
                    if (month > 12) {
                      dateinput.isValid = false;
                      dateinput.forcedInvalid = true;
                      dateinput.vadidateMsg = "Please enter valid month."
                      return false;
                    } else {
                      let m = parseInt(month);
                      month = monthArr[m - 1];
                    }
                  }
                  finalDate.push(month);
                }
                else if (d.length < 3 && month > 12) {
                  dateinput.isValid = false;
                  dateinput.forcedInvalid = true;
                  dateinput.vadidateMsg = "Please enter valid month."
                  return false;
                } else {
                  finalDate.push(month);
                }


              } else if ((d.indexOf('Y') > -1) || (d.indexOf('R') > -1)) {
                let len1 = d.length;
                let year = dateVal.slice(0, d.length);
                if (isNaN(year)) {
                  dateinput.isValid = false;
                  dateinput.forcedInvalid = true;
                  dateinput.vadidateMsg = "Please enter valid year."
                  return false;
                } else {
                  if (dateVal.length < len1) {
                    year = new Date("01-01-" + year).getFullYear();
                  }
                  dateVal = dateVal.substr(d.length, dateVal.length);
                  finalDate.push(year);
                }

                if (year < "1900") {
                  dateinput.isValid = false;
                  dateinput.forcedInvalid = true;
                  dateinput.vadidateMsg = "Please enter valid year."
                  return false;
                }
              }
            } else {
              dateinput.isValid = false;
              dateinput.forcedInvalid = true;
              dateinput.vadidateMsg = "Please enter valid date."
              return false;
            }

          }

          let f = [];

          for (let i = 0; i < formatMaskArr.length; i++) {
            if (formatMaskArr[i].indexOf('D') > -1) {
              f[1] = finalDate[i];
            } else if (formatMaskArr[i].indexOf('M') > -1) {
              f[0] = finalDate[i];
            } else if ((formatMaskArr[i].indexOf('Y') > -1) || (formatMaskArr[i].indexOf('R') > -1)) {
              f[2] = finalDate[i];
            }
          }
          let isValid = false
          for (let v of finalDate) {
            if (v) {
              isValid = true;;
            }
            else {
              isValid = false;
            }
          }
          if (isValid) {

            dateinput.isValid = true;
            if (dateinput.datatype == 'DATETIME') {
              dateinput.displayDate = "";
              dateinput.value = "";
              let hr24 = timeString;
              if (timeMask) {
                if (timeMask.toLowerCase() == 'hh:mm:ss') {

                } else if (timeMask.toLowerCase() == 'hh:mm') {
                  if (timeString.indexOf(":") != timeString.lastIndexOf(":")) {
                    timeString = timeString.slice(0, timeString.lastIndexOf(":"));
                  }
                } else if (timeMask.toLowerCase() == 'mm:ss') {
                  if (timeString.indexOf(":") != timeString.lastIndexOf(":")) {
                    timeString = timeString.slice(timeString.indexOf(":") + 1, timeString.length);
                  }
                }
              }
              dateinput.displayDate = (finalDate.join(formatSymbol) + " " + timeString + timeMeridiemMain).toUpperCase();
              dateinput.value = this.formatDate((f.join("-") + " " + hr24), 'dd-MMM-yyyy HH:mm:ss');
            } else if (dateinput.datatype == 'TIME') {

            } else {
              dateinput.displayDate = "";
              dateinput.value = "";
              dateinput.displayDate = finalDate.join(formatSymbol).toUpperCase();

              dateinput.value = this.formatDate(f.join("-"), 'dd-MMM-yyyy');
            }

            await this.validateInput(dateinput);

            const date = new DateModel();

            if (!dateModel) {
              dateModel = date;
            }

            if (dateinput.datatype != 'TIME') {
              dateModel1 = {
                "year": parseInt(dateinput.value.split("-")[2]),
                "month": monthArr.indexOf(dateinput.value.split("-")[1].toLowerCase()) + 1,
                "day": parseInt(dateinput.value.split("-")[0]),
              }
            }
          }
          else {
            dateinput.isValid = false;
            dateinput.forcedInvalid = true;
            dateinput.vadidateMsg = "Please enter valid date."
            return false;
          }


        } catch {
          dateinput.isValid = false;
          dateinput.forcedInvalid = true;
          dateinput.vadidateMsg = "Please enter valid date."
          return false;
        }
      }
    }

    return;
  }


  validateInput(dateinput) {
    if ((dateinput.data_required_flag && (dateinput.data_required_flag == 'T' || (dateinput.prompt_name && dateinput.prompt_name[dateinput.prompt_name.length - 1]) == '*'))) {
      if (dateinput.value || dateinput.from_value || dateinput.to_value) {
        dateinput.from_value
        if (dateinput.input_pattern) {
        } else {
          dateinput.isValid = true;
        }
      } else {
        dateinput.isValid = false;
        dateinput.vadidateMsg = "Please enter " + dateinput.prompt_name;
      }
    } else {
      dateinput.isValid = true;
    }

    delete dateinput['forcedInvalid'];
    delete dateinput['rase'];

    let dateFromVal = new Date(dateinput.from_value).getDate();
    let monthFromVAl = (new Date(dateinput.from_value).getMonth() + 1);
    let d1 = ((dateFromVal > 10) ? dateFromVal : '0' + dateFromVal);
    let m1 = ((monthFromVAl > 10) ? monthFromVAl : '0' + monthFromVAl);
    let dateToVal = new Date(dateinput.to_value).getDate()
    let monthToVAl = (new Date(dateinput.to_value).getMonth() + 1);
    let d2 = ((dateToVal > 10) ? dateToVal : '0' + dateToVal);
    let m2 = ((monthToVAl > 10) ? monthToVAl : '0' + monthToVAl);

    let dateValid = true;
    if (dateinput.from_value && dateinput.to_value) {
      let currentDate: any = "";
      let fromDate: any = "";
      let toDate: any = "";
      if (dateinput.value) {
        currentDate = new Date(dateinput.value).getTime();
        fromDate = new Date(dateinput.from_value).getTime();
        toDate = new Date(dateinput.to_value).getTime();
        if (currentDate < fromDate) {
          dateValid = false;
          dateinput.forcedInvalid = true;
          dateinput.vadidateMsg = dateinput.prompt_name + " Should not be less than " + d1
            + '-' + m1 + '-' + new Date(dateinput.from_value).getFullYear() + ".";
        }

        if (currentDate > toDate) {
          dateValid = false;
          dateinput.forcedInvalid = true;
          dateinput.vadidateMsg = dateinput.prompt_name + " Should not be greater than " + d2
            + '-' + m2 + '-' + new Date(dateinput.to_value).getFullYear() + ".";
        }
      }
    } else if (dateinput.from_value) {
      let currentDate: any = "";
      let fromDate: any = "";
      if (dateinput.value) {
        currentDate = new Date(dateinput.value).getTime();
        fromDate = new Date(dateinput.from_value).getTime();
        if (currentDate < fromDate) {
          dateValid = false;
          dateinput.forcedInvalid = true;
          dateinput.vadidateMsg = dateinput.prompt_name + " Should not be less than " + d1
            + '-' + m1 + '-' + new Date(dateinput.from_value).getFullYear() + ".";
        }
      }
    } else if (dateinput.to_value) {
      let currentDate: any = "";
      let toDate: any = "";
      if (dateinput.value) {
        currentDate = new Date(dateinput.value).getTime();
        toDate = new Date(dateinput.to_value).getTime();
        if (currentDate > toDate) {
          dateValid = false;
          dateinput.forcedInvalid = true;
          dateinput.vadidateMsg = dateinput.prompt_name + " Should not be greater than " + d2
            + '-' + m2 + '-' + new Date(dateinput.to_value).getFullYear() + ".";
        }
      }
    }
    if (!dateValid) {
      dateinput.isValid = false;
      return;
    } else {
      dateinput.isValid = true;
      return;
    }
  }


  show_event_loading(item) {

    //   if (isPlatformServer(this.platformId)) return;
    if (typeof document !== 'undefined') {

      this.setFocus(false);
      const elements = document.querySelectorAll('.shrinkMyscreen');
      elements.forEach(el => {
        (el as HTMLElement).classList.add('wait_cursor'); // to add
      });

      if (document.activeElement instanceof HTMLElement) {
        if (document.activeElement) {
          let el: any = document.activeElement;

          if (["input", "select", "textarea"].includes(el.type)) {
            // your code
            el?.blur();

            if (item && item.item_name != 'PB_NFI' && item.item_visible_flag == 'T' && item.item_enable_flag == 'T') {
              this.focusedItem = {}
              this.focusedItem.name = item.apps_page_frame_seqid + '.' + item.item_name;
              this.focusedItem.index = item.indexcount;
            }
          }
        }
      }

      this.setFocus(false);

      this.loadingTimerNew = setTimeout(() => {
        if (this.loadingTimerNew) {
          this.newLoader.set(true);
        }
      }, 300);
    }
    console.log("show event loading");
  }

  hide_event_loading() {

    if (isPlatformServer(this.platformId)) return;

    this.setFocus(true);
    const elements = document.querySelectorAll('.shrinkMyscreen');
    elements.forEach(el => {
      (el as HTMLElement).classList.remove('wait_cursor');
    });

    clearTimeout(this.loadingTimerNew);
    this.loadingTimerNew = null;
    this.newLoader.set(false);

    // setTimeout(() => {
    //   if (this.loadingTimerNew) {
    //     clearTimeout(this.loadingTimerNew);
    //     this.loadingTimerNew = null;
    //     this.newLoader.set(false);
    //   }
    // }, 300);


    console.log("hide event loading");
  }

  ShowLoadingNew(event?, click_event?) {
    // this.focusArrow = false;
    // this.loadingTimer = setTimeout(() => {
    //   this.lhsLoader = true;
    // }, 1);

    // if (event) {
    //   if (isPlatformServer(this.platformId)) return;
    //   if (typeof document !== 'undefined') {
    //     if (document.activeElement instanceof HTMLElement) {
    //       if (document.activeElement) {
    //         let el = document.activeElement;
    //         el?.blur();
    //         if (click_event && click_event.item_name == 'PB_NFI') { } else {
    //           // this.focusedItem = event.apps_page_frame_seqid + '.' + el.id;
    //         }
    //       }
    //     }

    //     const elements = document.querySelectorAll('.shrinkMyscreen');
    //     elements.forEach(el => {
    //       (el as HTMLElement).classList.add('wait_cursor'); // to add
    //       // OR
    //       // (el as HTMLElement).style.removeProperty('cursor'); // to remove
    //     });
    //   }
    // }

    // this.ShowLoadingSide();
  }

  hideLoadingNew() {
    // clearTimeout(this.loadingTimer);
    // this.lhsLoader = false;

    this.hideLoadingSide();
  }

  setFocus(val) {
    this.focusArrow = val;


  }

  ShowLoadingSide() {
    // if (!this.loading_on_demand) {
    //   this.focusArrow = false;
    //   // if (document.activeElement instanceof HTMLElement) {
    //   //   document.activeElement?.blur();
    //   // }
    //   this.count++;
    //   this.loadingTimerNew = setTimeout(() => {
    //     if (this.loadingTimerNew) {
    //       this.newLoader = true;
    //     }
    //   }, 300);
    //   console.log("ShowLoading");
    // }
  }
  ShowLoadingTab() {
    // if (!this.loading_on_demand) {
    //   this.focusArrow = false;
    //   this.count++;
    //   // this.loadingTimerNew = setTimeout(() => {
    //   //   if(!this.focusArrow){
    //   //     this.newLoader = true;
    //   //   }
    //   // }, 300);
    //   if (!this.focusArrow) {
    //     this.newLoader = true;
    //   }
    //   console.log("ShowLoading");
    // }
  }
  hideLoadingSide() {


    // if (!this.loading_on_demand) {
    //   this.count--;
    //   // if (this.count < 1) {
    //   this.count = 0;
    //   this.setFocus(true);
    //   clearTimeout(this.loadingTimerNew);
    //   this.loadingTimerNew = null;
    //   this.newLoader = false;
    //   // }
    // }
    // if (isPlatformServer(this.platformId)) return;
    // const elements = document.querySelectorAll('.shrinkMyscreen');
    // elements.forEach(el => {
    //   (el as HTMLElement).classList.remove('wait_cursor');
    //   // (el as HTMLElement).style.cursor = 'pointer'; // to add
    //   // OR
    //   // (el as HTMLElement).style.removeProperty('cursor'); // to remove
    // });



  }


  start_loading_side() {
    // this.focusArrow = false;
    // // this.loadingTimerNew = setTimeout(() => {
    // // this.count++;
    // this.newLoader = false;
    // this.loading_on_demand = true;
    // // }, 300);
    // console.log("ShowLoading");

    this.loading_on_demand.update(() => true);
  }

  stop_loading_side() {
    // this.count--;
    // if (this.count < 1) {
    // this.newLoader = false;
    // this.count = 0;
    // this.setFocus(true);
    // if (this.loadingTimerNew) {
    //   clearTimeout(this.loadingTimerNew);
    // }
    // this.loadingTimerNew = null;
    // this.loading_on_demand = false;
    // }

    this.loading_on_demand.update(() => false);
  }


  checkToggle() {
    this.userDetails = this.getLocallData("userDetails")
    if (!this.fabMannualMode) {
      if (this.userDetails.fab_ball_default_flag == 'T') {
        this.toggleFab = true;

      } else if (this.userDetails.fab_ball_default_flag == 'F') {
        this.toggleFab = false;
      } else {
        this.toggleFab = true;
      }
    }

    if (!this.notiBellMannualMode) {
      if ((this.userDetails.notification_bell_default_flag) && this.userDetails.notification_bell_default_flag == 'T') {
        this.toggleNotification = true;
        this.toggleNotification = true;
      } else {
        this.toggleNotification = false;
        this.toggleNotification = false;
      }
    }
  }

  resetToggle() {
    this.toggleDevloperMode.set(false);
    this.toggleDevloperModePro = false;
    this.toggleFab = true;
    this.toggleNotification = false;
    this.toggleDrag = false;
    this.notiBellMannualMode = false;
  }

  async openFullscreenForCurrentScreen(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const screenWidth = window.screen.width;
    // if (screenWidth > 1440) {
    //   return false;
    // }

    const element = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    const requestFullscreen = element.requestFullscreen ?? element.webkitRequestFullscreen;
    if (!requestFullscreen) {
      console.warn('Fullscreen mode is not supported by this browser.');
      return false;
    }

    try {
      await requestFullscreen.call(element);
      return true;
    } catch (error) {
      console.warn('Unable to enter fullscreen mode.', error);
      return false;
    }
  }

  getParsedJson(json) {
    if (!json) {
      return {}
    }
    try {
      if (typeof (json) == "string") {
        return JSON.parse(json);
      }
      if (typeof (json) == 'object' && json != null) {
        return json;
      }
    } catch (err) {
      console.error("error violation", err)
      return
    }
  }
  getParsedA(json) {
    if (!json) {
      return {}
    }
    try {
      if (typeof (json) == "string") {
        return JSON.parse(json);
      }
      if (typeof (json) == 'object' && json != null) {
        return json;
      }
    } catch (err) {
      console.error("error violation", err)
      return
    }
  }

  // changeRole(role: string) {
  //   this.roleSource.next(role);
  // }

  downloadJsonFile(data: any, fileName: string): void {
    // Convert data to JSON string
    const json = JSON.stringify(data, null, 2);
    if (isPlatformServer(this.platformId)) return;
    // Create a blob with MIME type
    const blob = new Blob([json], { type: 'application/json' });

    // Create a download link
    if (isPlatformServer(this.platformId)) return;
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
      a.click();

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    }
  }

  downloadCsv(buffer: any, fileName: string) {
    let directoryPath = '';
    let type = 'text/csv;charset=utf-8';
    let ext = '.csv';
    if (this.platform.is("ios")) {
      this.lhsLoader = false;
      directoryPath = this.file.documentsDirectory;
      alert(directoryPath);
      this.saveFile(buffer, directoryPath, fileName, type, ext);
    }
    else if (this.platform.is("android")) {
      this.lhsLoader = false;
      this.checkStoragePermission().then((res) => {
        if (res == 'success') {
          directoryPath = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/";
          this.saveFile(buffer, directoryPath, 'file', type, ext);
        } else {
          this.presentAlert("Please grant storage permission to download file.")
        }
      })
    } else {
      this.lhsLoader = false;
      const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });

      // Ensure the file name ends with .csv
      const finalFileName = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;

      saveAs(blob, finalFileName);
      this.displayCordovaToast("Download complete...");

    }

  }



  getUserRights(onApproved?: () => void) {
    this.approveStatus = false;
    let server_url = this.getLocallData("server_url1");
    let data = {
      "user_code": this.userDetails.g_user_code,
      "user_session_id": this.userDetails.session_id,
      "user_login_session_id": this.userDetails.login_session_id,
      "appkey": this.getLocallData("appKey"),
      "group_code": this.getLocallData("g_group_code"),
      "req_reason": "FOR TESING THE QUERIES"
    };
    this.http.post(server_url + 'api/developerMode/create', data).subscribe((res: any) => {
      if (res && res.responseStatus === 'success') {
        // this.setLocallData("userRights", res.data);
        this.presentAlert(res.responseMsg);
      } else if (res && res.responseStatus === 'pending') {
        this.presentAlert(res.responseMsg);
      } else if (res && res.responseStatus === 'approved') {
        this.approveStatus = true;
        this.presentAlert(res.responseMsg);
        onApproved?.();
      } else {
        this.presentAlert(res.responseMsg);
      }
    });
  }
}
