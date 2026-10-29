import { HttpClient } from '@angular/common/http';
import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, Input, Injector, NgZone, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID, QueryList, Renderer2, ViewChild, ViewChildren, ɵɵtrustConstantResourceUrl, DoCheck, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { File } from '@awesome-cordova-plugins/file/ngx';
import copy from 'copy-to-clipboard';
import { MenuController, ModalController, NavController, Platform, PopoverController, ToastController } from '@ionic/angular/standalone';
import { BackgroundService } from 'src/app/services/background.service';
import { DataService } from 'src/app/services/data.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { MultiLevelTabPage } from '../multi-level-tab/multi-level-tab.page';
import { DeveloperModePage } from '../developer-mode/developer-mode.page';
import { DevFrameMastEditorPage } from '../dev-frame-mast-editor/dev-frame-mast-editor.page';
import { DevObjectMastEditorPage } from '../dev-object-mast-editor/dev-object-mast-editor.page';
import { SettingPage } from '../setting/setting.page';
import { DevFrameItemListPage } from '../dev-frame-item-list/dev-frame-item-list.page';

import { ParentMenuPage } from '../parent-menu/parent-menu.page';
import { AlertMsgBoxesPage } from '../alert-msg-boxes/alert-msg-boxes.page';
import { MultiAlertNotificationPage } from '../multi-alert-notification/multi-alert-notification.page';
import { SingleSelectLovPage } from '../single-select-lov/single-select-lov.page';
import { EntryListPage } from '../entry-list/entry-list.page';
import { OverlayEventDetail } from '@ionic/core/components';
import { AppSettingComponent } from 'src/app/components/frames/app-setting/app-setting.component';
import { DownloadPopoverComponent } from 'src/app/components/frames/download-popover/download-popover.component';
import { PlsqlToJsService } from 'src/app/demo-utils/plsqlToJs/plsql-to-js.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ProcessDataService } from 'src/app/services/process-data.service';
import { of, Subscription } from 'rxjs';
import { FrameTreeMenuComponent } from 'src/app/components/frames/frame-tree-menu/frame-tree-menu.component';
import { left, right } from '@popperjs/core';
import { UserLoginComponent } from 'src/app/components/frames/user-login/user-login.component';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { FrameObjectfilterComponent } from 'src/app/components/frames/frame-objectfilter/frame-objectfilter.component';
import { ThemelinkComponent } from 'src/app/components/layout/themelink/themelink.component';
import { UserRoleComponentComponent } from 'src/app/components/layout/user-role-component/user-role-component.component';
import { QuickActionModalComponent } from 'src/app/components/layout/quick-action-modal/quick-action-modal.component';
import { SerchNewGlobalComponent } from 'src/app/components/layout/serch-new-global/serch-new-global.component';
import { ModulelinkComponent } from 'src/app/components/layout/modulelink/modulelink.component';
import { QuicklinkComponent } from 'src/app/components/layout/quicklink/quicklink.component';
import { NoteslinkComponent } from 'src/app/components/layout/noteslink/noteslink.component';
import { HelplinkComponent } from 'src/app/components/layout/helplink/helplink.component';
import { AnnouncementlinkComponent } from 'src/app/components/layout/announcementlink/announcementlink.component';
import { GlobalSerachComponent } from 'src/app/components/frames/global-serach/global-serach.component';
import { NotificationlinkComponent } from 'src/app/components/layout/notificationlink/notificationlink.component';
import { ParameterframeComponent } from 'src/app/components/frames/parameterframe/parameterframe.component';
import { DeveloperModeLogPage } from '../developer-mode-log/developer-mode-log.page';


import { StatuslinkComponent } from 'src/app/components/layout/statuslink/statuslink.component';
import { SqlUtilsService } from 'src/app/demo-utils/plsqlToJs/sql-utils.service';
import { PersonalisationFilterComponent } from '../personalisation-filter/personalisation-filter.component';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { ReportEngineFormatViewComponent } from 'src/app/components/layout/report-engine-format-view/report-engine-format-view.component';
import { ChatAiService } from 'src/app/services/chat-ai.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PluginsService } from 'src/app/services/plugins.service';
import { ChatboatComponent } from 'src/app/components/layout/chatboat/chatboat.component';
import { DbCoordinatorService } from 'src/app/services/db-coordinator.service';
import { CommonMethodService } from 'src/app/services/common-method.service';
import { DoubleclickComponent } from 'src/app/components/layout/doubleclick/doubleclick.component';
import { AiAssistentComponent } from 'src/app/components/layout/ai-assistent/ai-assistent.component';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { NewAlertMsgBoxesPage } from '../new-alert-msg-boxes/new-alert-msg-boxes.page';
import { FrameOtpComponent } from 'src/app/components/frames/frame-otp/frame-otp.component';
import { FrameCanvasComponent } from 'src/app/components/frames/frame-canvas/frame-canvas.component';
import { FrameSelectorComponent } from 'src/app/components/frame-selector/frame-selector.component';
import { HeaderBarComponent } from 'src/app/components/frames/header-bar/header-bar.component';
import { NewLoaderComponent } from 'src/app/components/layout/new-loader/new-loader.component';
import { UsersettingPage } from '../usersetting/usersetting.page';
import { isPlatformServer } from '@angular/common';
import { DynamicEventEngine } from 'src/app/demo-utils/engine/dynamic-event-engine';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
import { CameraComponent } from 'src/app/components/layout/camera/camera.component';
import { ShortkeyComponent } from 'src/app/components/layout/shortkey/shortkey.component';
import { AgenticChatbotComponent } from 'src/app/components/layout/agentic-chatbot/agentic-chatbot.component';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { DynamicFunctionService } from 'src/app/services/dynamic-function-service';



type AOA = any[][];

// var CryptoJS = require("crypto-js");

// declare var supercomp: any;
// declare var utilvar: any;

@Component({
  standalone: true,
  imports: [STANDALONE_IMPORTS, FrameOtpComponent, FrameCanvasComponent, FrameSelectorComponent, HeaderBarComponent],
  // providers:[MultiLevelTabPage, DevFrameItemListPage, DevObjectMastEditorPage,TreeCallpagePage,
  //     DevFrameMastEditorPage, DevImageIconMastEditorPage,ParentMenuPage,DownloadPopoverComponent],
  selector: 'app-super',
  templateUrl: './super.page.html',
  styleUrls: ['./super.page.scss'],
})
export class SuperPage implements OnInit, OnDestroy {
  layoutNewMast: any;
  menuType: string = 'overlay';
  mainWindow;
  isModalOpen = false;
  testval = "";
  toggleSideMenu: boolean = true;
  off_canvas: any = false;
  safeCameraUrl: any;
  showCameraPopup = false;
  //@ViewChild(CalendarComponent) myCalendar!: CalendarComponent;
  @ViewChildren('popoverBtn') popovers!: QueryList<ElementRef>;
  @Output() openObject = new EventEmitter<any>();
  @Output() updateTab = new EventEmitter<any>();
  @Output() selectTab = new EventEmitter<any>();
  @Output() closeTab = new EventEmitter<any>();

  @Input() superId: any;
  @Input() wscpNav: any;
  @Input() frame: any = {};
  @Input() wscp_send_input: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Input() menuData: any = {};
  @Input() clicked_frame_seq: any;
  @Input() click_events_str: any
  @Input() wscp: any = {};
  @Input() wsdp: any = [];
  @Input() wsdpcl: any = [];

  no_back: any;
  // @Input() frame: any = {};
  plt: any;
  @ViewChild('popover') popover;

  @Input() isTab: boolean = false;

  isOpen = false;
  menu = [];
  imgUrl: any[];

  @Input() object_mast: any;
  // for info
  isClassAdded = false;
  // for info
  isSeeWidth: boolean = true;
  page_mast: any;
  breadCrumsuper: any;
  userDetails: any;
  developerModeData: any;
  flag = true;
  model: boolean = true;
  order_pageno: number;
  tabflag: boolean;
  tabflag2: boolean;
  fullsScreen: boolean = true;

  upArrowon: boolean = true;
  // wscp: any = {};
  // wsdp: any = [];
  // wsdpcl: any = [];
  wsud: any = {};
  obj: any;
  // type = "";
  @Input() page_no: number = 0;
  @Input() isModal: any = "Menu";


  private resizeHandler!: () => void;


  currentPageInfo: any = {};
  object_arr: any;
  levelbattery: any;

  // click_events_str: any;
  myExtObject: any;
  sessionObj: any;
  pageParameter: any = {};
  popoverdismiss: boolean = true;

  operation_mode: any;
  notificationCount: any;
  toggleNotification: boolean;
  toggleFab: boolean;
  eventOfadditem: any = {};
  id: any = 0;

  localAppData: any;
  appValideFlag: boolean = true;
  samePageNo: number;
  concatArr = [];
  showTree = false;

  refreshObj: boolean = false;

  lovFlag: boolean = false;
  item_slno_count = 1;

  lovEventFlag: boolean = true;

  // appPageName = "";
  roleMsg = '';
  smartBtn: boolean = true;
  @ViewChild('fab', { read: ElementRef }) private fabbtn: ElementRef;
  modalFlag: any;
  concatKey = [];
  otpFrame: boolean = true;
  dragPosition: any;
  screenWidth: number;
  dargMode: boolean = false;
  otpFlag: boolean = false;
  otpFrameObjCode: any;
  headExcelSheet: any = [];
  bodyExcelSheet: any = [];
  tableBodyExcelSheet: any = [];
  scriptLoading: boolean = false;
  checkGps: boolean = true;
  // layoutNew : any;
  deviceMode = [
    {
      name: "Desktop",
      class: "active",
      icon: "laptop"
    },
    {
      name: "Tab",
      class: "",
      icon: "tablet-portrait"
    },
    {
      name: "Mobile",
      class: "",
      icon: "phone-portrait"
    }
  ]
  formatSql: any = "Select * from sqlqurey;";
  sqlData: any;
  newFormInstance: any = {};
  backdismiss: boolean = false;

  clickEvent: any;

  functions = [];

  timerFunc: any;
  timerFlag: boolean = true;

  dateRange = [];
  fabBall = [];

  refreshFlag: boolean = false;
  scanData: any;
  scanDataa: any;
  debug: any;


  isPopoverOpen: boolean = false;

  popoverId = 1;
  popoverStates: boolean[] = [];
  popoverReferences: any[] = [];

  objRefreshFlag: boolean = false;

  holdWscp: any = {};
  // isRunning:boolean=false
  private visibilitySubscription = new Subscription();

  // private routeSub = new Subscription();

  logdata: any = [];
  shortcutkey_count: any = {}

  rowSize: any = 0;

  side_menu: any;


  @ViewChildren(NgSelectComponent) ngSelects!: QueryList<NgSelectComponent>;

  private _modalCtrl: ModalController | null = null;
  private _popOverCtrl: PopoverController | null = null;
  private _popoverController: PopoverController | null = null;
  private _toastController: ToastController | null = null;
  private _menuCtrl: MenuController | null = null;
  private _navCtrl: NavController | null = null;

  private destroyed = false;

  private get modalCtrl(): ModalController {
    if (!this._modalCtrl) {
      this._modalCtrl = this.injector.get(ModalController);
    }
    return this._modalCtrl;
  }

  private get popOverCtrl(): PopoverController {
    if (!this._popOverCtrl) {
      this._popOverCtrl = this.injector.get(PopoverController);
    }
    return this._popOverCtrl;
  }

  private get popoverController(): PopoverController {
    if (!this._popoverController) {
      this._popoverController = this.injector.get(PopoverController);
    }
    return this._popoverController;
  }

  private get toastController(): ToastController {
    if (!this._toastController) {
      this._toastController = this.injector.get(ToastController);
    }
    return this._toastController;
  }

  private get menuCtrl(): MenuController {
    if (!this._menuCtrl) {
      this._menuCtrl = this.injector.get(MenuController);
    }
    return this._menuCtrl;
  }

  private get navCtrl(): NavController {
    if (!this._navCtrl) {
      this._navCtrl = this.injector.get(NavController);
    }
    return this._navCtrl;
  }
  private eventEngine: DynamicEventEngine;

  private isEventRunning: boolean = false;

  private event_que_arr = [];


  constructor(
    private cdr: ChangeDetectorRef, private dataService: DataService, public globalobjects: GlobalObjectsService, public platform: Platform,
    public events: Events, private router: Router,
    private background: BackgroundService, private file: File, public http: HttpClient,
    private pluginService: PluginsService, private commonMethodService: CommonMethodService,
    private ngZone: NgZone, private sqlutilserv: SqlUtilsService,
    private sqlLiteServ: SqlLiteService, public lhs_lib: LhsLibService, private convert_plsq_js: PlsqlToJsService,
    public sanitizer: DomSanitizer, private processData: ProcessDataService, private el: ElementRef, private ren: Renderer2, private canvasModal: CanvasModalService, private modalGlobal: CanvasModalService,
    public chatAiService: ChatAiService, private appRef: ApplicationRef, private coord: DbCoordinatorService, @Inject(PLATFORM_ID) private platformId: Object, private injector: Injector, private cdEngine: CdEngineService,private dynamic_func:DynamicFunctionService
  ) {

    this.eventEngine = new DynamicEventEngine(this);

    // let appkey = this.globalobjects.getLocallData("appKey");
    // let appdata = this.globalObjects.getLocallData("appData");
    // if (appkey && appdata) {
    //   for (let data of appdata) {
    //     if (data.appkey.toLowerCase() == appkey.toLowerCase()) {
    //       this.globalObjects.applogo = data.resData.icon_img;
    //     }
    //   }
    // }
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.closePage();
    //   console.log('Back button pressed');
    // });

    const date = new Date();
    this.dateRange = [date, new Date(date.getFullYear(), date.getMonth(), date.getDate())];

    this.globalobjects.fontSize = this.globalobjects.getLocallData("fontSize");
    this.globalobjects.fontype = this.globalobjects.getLocallData("fonttype");
    // this.globalobjects.fontWeight = this.globalobjects.getLocallData("fontWeight");
    if (this.globalobjects.fontSize) {
      this.globalobjects.increFontsize(this.globalobjects.fontSize);
    }
    if (this.globalobjects.fontype) {
      this.globalobjects.changeFont(this.globalobjects.fontSize);
    }
    // if (this.globalobjects.fontWeight) {
    //   this.globalobjects.increFontweight(this.globalobjects.fontWeight);
    // }

    if (!this.globalobjects.userDetails) {

      this.globalobjects.userDetails = this.globalobjects.getLocallData("userDetails");
    }
    this.localAppData = this.globalobjects.getLocallData("appData");
    this.background.getLocation();
    this.subscribeEvents();
    if (this.globalobjects.pagesFlag) {
      return applyLoggingDecorator(this, "super-page")
    }
  }
  // ngDoCheck(): void {
  //   console.count('SuperPage checked');
  // }

  closeDropdowns() {
    this.ngSelects?.forEach(select => {
      select.close();
    });
  }

  // ngOnChanges(): void {
  //   console.log("on changes");
  // }


  // @HostListener('document:keydown.alt.h')
  onHome() {
    this.globalobjects.goToHomePage();
  }


  selectTabs(event) {
    // alert(this.page_no);

    this.selectTab.emit(event);
  }

  closeTabs(ins) {
    this.closeTab.emit(ins);
  }
  // selectTabs(ins, t, i) {
  //   this.globalobjects.activeItems= this.globalobjects.tabindex[i];
  //   this.selectTab.emit({ ins, t, i });
  // }

  // closeTabs(ins,i) {
  //   this.globalobjects.tabindex.splice(i,1);
  //   this.globalobjects.activeItems="";
  //   this.closeTab.emit(ins);
  // }

  @HostListener('document:keydown.alt.l')
  logOut() {
    this.globalobjects.goToHomePage();
    this.globalobjects.logout = true;
    this.events.publish("logOut");
    this.globalobjects.layoutObject = '';

    // this.globalobjects.resetToggle();
    // window.location.reload();


  }

  ngOnInit() {

    //  this.messageListener = (event: MessageEvent) => {


    //   // console.log('Parent received message:', event.data);

    //   if (event.data && event.data.type === 'CHILD_MESSAGE') {
    //     this.messageFromChild = event.data.payload;
    //     alert(window.location.href +"In the Parent Component")
    //   }
    // };

    // window.addEventListener('message', this.messageListener);



    console.log("superId", this.superId)
    console.log('this.openCanvas', this.openCanvas)
    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl)
    // })
    this.wscp = this.wscp || {};
    this.wsdp = this.wsdp || [];
    this.wsdpcl = this.wsdpcl || [];


    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl)
    // })



    // document.getElementById('sreenWidth').classList.add("shrinkMyscreen-main");
    // supercomp = this;
    // utilvar = this;
    this.events.unsubscribe('menuClick');
    this.events.subscribe('menuClick', (res) => {
      if (res.evFlag == 'T') {
        res.evFlag = 'F';
        this.itemClicked(res.data);

      }
    });
    // this.tp();
    // this.gajs_date_evaluate("(:sysdate + 1)-:sysdate",0);



    // this.frame_theme=this.lhs_lib.get_frame_config_layout("SYSTEM");

    this.coord.cleanupOrphans();

    if (this.globalobjects.userDetails.G_ROLE_NAME && !this.globalobjects.roleUser) {
      this.globalobjects.roleUser = this.globalobjects.userDetails.G_ROLE_NAME;
    }


    if (this.wscpNav) {
      this.wscp = JSON.parse(JSON.stringify(this.wscpNav));
      this.globalobjects.lovType = this.wscp.lovType
      this.lovFlag = true;
      this.globalobjects.lovObjData = this.wscp.lovObjData ? this.wscp.lovObjData : [];
    }

    // this.dataService.clicked_frame_seqid = this.clicked_frame_seq;

    //console.log("teghidghkhdaskfh======" + this.clicked_frame_seq)
    // this.globalobjects.lovObjData = [];

    if ((this.platform.is('ios') || this.platform.is('android'))) {
      this.plt = '';
      this.backdismiss = true;
    } else {
      this.plt = 'browser';
      this.backdismiss = false;
    }

    //console.log(this.otpFlag)
    this.screenWidth = document.getElementById('super').clientWidth;
    if (this.screenWidth > 779) {
      this.dragPosition = 'horizontal';
    } else {
      this.dragPosition = 'vertical';
    }
    this.globalobjects.checkToggle();

    this.toggleFab = this.globalobjects.toggleFab;
    this.toggleNotification = this.globalobjects.toggleNotification;
    if (!this.globalobjects.userDetails) {
      this.globalobjects.userDetails = this.globalobjects.getLocallData("userDetails");
    }

    if (this.globalobjects.userDetails.side_menu_bar_flag == 'T') {
      this.toggleSideMenu = true;
    } else if (this.globalobjects.userDetails.side_menu_bar_flag == 'F') {
      this.toggleSideMenu = false;
    } else {
      this.toggleSideMenu = true;
    }

    var appkey = this.globalobjects.getLocallData("appKey");
    var dbName = this.globalobjects.getLocallData("dbName");
    this.globalobjects.dbName = dbName;
    this.globalobjects.appKey = appkey;

    // this.dbPassword = obj.resData.dbPassword;
    if (this.globalobjects.userDetails) {
      //this.wsud.login_session_id= this.globalobjects.userDetails.login_session_id

      this.wsud.latitude = this.globalobjects.latitude;
      this.wsud.longitude = this.globalobjects.longitude;
      this.wsud.battery_level = this.globalobjects.getLocallData('battery_level');
      this.wsud.connection_type = this.globalobjects.getLocallData('connectivity_mode');
      this.wsud.downlinkmax = this.globalobjects.getLocallData('network_speed');
      this.wscp.appkey = appkey;
      // this.wscp.platform = this.globalobjects.getLocallData("platformValue");
    }
    else if (appkey) {
      this.navCtrl.navigateRoot('login');
    }
    else {
      this.navCtrl.navigateRoot('appkey-validation');
    }


    if (this.page_no > 0) {
      // console.log("Check object mast", this.object_mast)
      this.processObjectMast(this.object_mast);
    }


    this.globalobjects.countfortextband3d = 0;
    if (this.click_events_str && ((this.click_events_str.toLowerCase().indexOf("app_next_page") > -1) || (this.click_events_str.toLowerCase().indexOf("app_open_page") > -1) || this.click_events_str.toLowerCase().indexOf("app_append_next_page") > -1)) {
      if (this.no_back) {
        this.set_noBack_frame();
      }

      // this.holdWscp = JSON.parse(JSON.stringify(this.wscp));
      this.object_mast.Level2[this.page_no].Level3.popoverFlag = this.wscp.flag;
      this.wscp.flag = "M";
    } else if (this.click_events_str && this.click_events_str.toUpperCase().indexOf("LOAD_NEW_OBJECT") > -1) {
      // this.globalobjects.ShowLoadingSide();

      this.holdWscp = JSON.parse(JSON.stringify(this.wscp));

      this.afterPageLoad();
      // this.globalobjects.hideLoadingSide();
    }
    else {
      this.platform.ready().then(() => {

        if (this.globalobjects.userDetails.gps_mandatory_flag == 'Y' && (this.platform.is('ios') || this.platform.is('android')) && this.checkGps) {
          this.globalobjects.checkGPSPermission().then(() => {
            // this.validatePlatform(loginFlag);
          }, (err) => {
            this.globalobjects.presentAlert("You can not access app without location permission. Please allow location permission.");
            navigator['app'].exitApp();
          })
        }
        else if (!this.checkGps) {
          this.checkGps = true;
        }
      })


      this.getPageInfo();
    }
    this.globalobjects.current_page_parameter = this.pageParameter;

    if (!this.globalobjects.current_page_parameter.MODE) {
      this.globalobjects.current_page_parameter.MODE = '';
    }
    // //console.log(this.pageParameter);


    // this.lhs_lib.myTab = document.querySelectorAll('app-my-tab')
    this.subscribeSuperParent();
    let objCode = this.wscp.object_code;
    if (this.page_no > 0) {
      objCode = `${this.object_mast.object_code}#${this.page_no}`;
    }

    this.events.subscribe(`noDissmiss#${objCode}${this.superId ? '#' + this.superId : ''}`, (res) => {
      this.itemClicked(res);
    })
    this.events.subscribe(`developerEvent${objCode}${this.superId ? '#' + this.superId : ''}`, (res) => {
      this.globalobjects.developer_clickEvent = this.clickEvent;
    })


    this.resizeHandler = () => this.adjustScale();
    if (isPlatformServer(this.platformId)) return;
    window.addEventListener('resize', this.resizeHandler);


  }



  subscribeSuperParent() {

    if (!this.openCanvas) {
      if (this.superId) {
        this.events.subscribe(this.superId, (res) => {
          if (res.flag == "T") {
            res.flag = "F"
            this.tabsection(res)
          }
        })
      } else {
        console.log("resubscription done============>  ");
        this.events.subscribe("homeTab", (res) => {

          if (res.flag == "T") {
            res.flag = "F"
            this.tabsection(res)
          }
        })
      }
    }

    this.events.unsubscribe('clearEvent');
    this.events.subscribe('clearEvent', () => {
      this.clearQue();
    })
    this.events.unsubscribe('refreshFrame_cartSummaryPlain');
    this.events.subscribe('refreshFrame_cartSummaryPlain', (res) => {
      this.refreshFrame_cartSummaryPlain(res);
    })


    // this.events.subscribe(`noDissmiss#${this.wscp.object_code}${this.superId ? '#' + this.superId : ''}`, (res) => {
    //   this.itemClicked(res);
    // })
    // console.log(this.page_no)
    // // console.log(this.object_mast)
    // let objCode = this.wscp.object_code
    // if (this.page_no > 0) {
    //   objCode = `${this.object_mast.object_code}#${this.page_no}`
    // }
    // this.events.subscribe(`developerEvent${objCode}${this.superId ? '#' + this.superId : ''}`, (res) => {
    //   this.globalobjects.developer_clickEvent = this.clickEvent
    // })
  }

  tabsection(res) {
    if (res.type == "openParameter") {
      this.openParameterFrame()
    } else if (res.type == "refreshObjFab") {
      this.refreshObjFab()
    } else if (res.type == "setOpen") {
      this.setOpen(res.item)
    } else if (res.type == 'downloadObj') {
      this.downloadObj()

    } else if (res.type == 'aiassistant') {
      this.aiassistant()
    } else if (res.type == 'collapseHead') {
      this.collapseHead()
    } else if (res.type == 'showInfoPopup') {
      this.showInfoPopup()
    } else if (res.type == "openHomePop") {
      this.openHomePop(res.item)
    } else if (res.type == "openApplication") {
      this.openApplication(res.item)

    } else if (res.type == "optionSelect") {
      this.itemClicked(res.item);
    } else if (res.type == "pageClose") {
      if (res.item == "T") {
        this.triggerClickEvent()
      }
    } else if (res.type == "openoffCanvasObject") {
      this.openoffCanvasObject(res.item)
    } else if (res.type == "openoffLeftCanvasObject") {
      this.openoffLeftCanvasObject(res.item)
    } else if (res.type == "quickLinks") {
      this.quickLinks("O")
    } else if (res.type == "roleassign") {
      this.roleassign()

    } else if (res.type == "openoffRightCanvasObject") {
      this.openoffRightCanvasObject(res.item)
    } else if (res.type == "themeLinks") {
      this.themeLinks()
    } else if (res.type == "statuslink") {
      this.statuslink()
    } else if (res.type == "devloperMLinks") {
      this.devloperMLinks()
    } else if (res.type == "announceLinks") {
      this.announceLinks(res)
      //  this.openoffRightCanvasObject(res.item)
    } else if (res.type == "chatboat") {
      this.chatboat()
    } else if (res.type == "helpLinks") {
      this.helpLinks()
    }
    else if (res.type == "Moduleclick") {
      this.Moduleclick()
    } else if (res.type == "tab_close_event") {
      this.tab_close_event()
    } else if (res.type == "builderDismiss") {
      this.open_object_in_wma_builder();
    } else if (res.type == "shortcutLinks") {
      this.shortcutLinks()
    } else if (res.type == "pagedismisscallback") {
      let data = res.item;
      this.afterModalOnDismiss(data.detail, data.componentProps)
    } else if (res.type == 'agentic_Chatbot') {
      this.agentic_Chatbot(res.item)
    }else if(res.type=='quick_action_clicked'){
      this.quick_action_clicked(res.item);
    }else if(res.type=='set_bookmark'){
      this.set_bookmark(res.item);
    }
  }
  unSubscribeSuperParent() {

    if (!this.openCanvas) {
      if (this.superId) {
        this.events.unsubscribe(this.superId)
      } else {
        console.log("unSubscribeSuperParent done=============>  ");
        this.events.unsubscribe("homeTab")
      }
    }

  }
  isOffcanvasClose = false;
  // isTabClose = false
  subscribeEvents() {

    this.events.unsubscribe("verifyOtp");
    this.events.unsubscribe("pageName");
    this.events.unsubscribe("goToSuper");
    this.events.unsubscribe("checkGps");
    this.events.unsubscribe("jumptosuper");
    this.events.unsubscribe("refreshOnViewChange");
    //  this.events.unsubscribe("execute_item_events");
    this.events.unsubscribe("refreshOnViewChangeBypass");

    this.events.unsubscribe("verifyOtp");
    this.events.unsubscribe("pageName");
    this.events.unsubscribe("goToSuper");
    this.events.unsubscribe("checkGps");
    this.events.unsubscribe("noDissmiss");

    this.subFun();

    this.events.subscribe('verifyOtp', res => {
      if (this.object_mast.Level2[this.page_no].object_code == res.object_code) {
        this.popOverCtrl.dismiss(res);
      }
    });
    this.menuCtrl.swipeGesture(true);
    this.events.subscribe('pageName', res => {
      if (this.object_mast.Level2[this.page_no].object_code == res.object_code) {
        this.object_mast.Level2[this.page_no].apps_page_name = res.pageName
      }
    })

    this.events.subscribe("noDissmiss", (res) => {
      this.itemClicked(res);
    })
    this.events.subscribe("goToSuper", () => {
      this.refreshPage();
    })
    this.events.subscribe("checkGps", (res) => {
      this.checkGps = res;
    })



    this.events.subscribe("jumptosuper", () => {
      this.refreshPage();
    })

    this.events.subscribe("refreshOnViewChange", () => {
      this.globalobjects.userDetails = this.globalobjects.getLocallData("userDetails");
      this.refreshObjFab()
    })

    // this.events.unsubscribe("jsonData");
    // this.events.subscribe("jsonData" + this.globalobjects.pageEventId, res => {
    //   if (res.evFlag == "T") {
    //     this.generatAllFrameJson(res.data);
    //     res.evFlag = "F";
    //   }
    // })
    this.globalobjects.pageEventId++;


    this.events.unsubscribe("execute_item_events");
    this.events.subscribe("execute_item_events", res => {
      this.itemClicked(res);
    })

    this.events.unsubscribe("open_object");
    this.events.subscribe("open_object", res => {
      this.openHardcodeObject();
    })

    this.events.subscribe("refreshOnViewChangeBypass", () => {
      this.wscp = {};
      this.globalobjects.userDetails = this.globalobjects.getLocallData("userDetails");
      this.wscp.appkey = this.globalobjects.userDetails.appkey
      this.wscp.developer_mode = "N"
      this.wscp.object_code = ""
      // this.wscp.platform = "ios"
      this.wscp.service_type = "get_object_config"
      this.refreshObjFab()
    })
    this.globalobjects.pageId++;

    this.events.unsubscribe('menuClick');
    this.events.subscribe('menuClick', (res) => {
      if (res.evFlag == 'T') {
        res.evFlag = 'F';
        this.itemClicked(res.data);

      }
    });

    this.events.unsubscribe('clearEvent');
    this.events.subscribe('clearEvent', () => {
      this.clearQue();
    })
    if (this.globalobjects.userDetails) {
      this.events.publish("entity_name", this.globalobjects.userDetails.entity_name);
      this.events.publish("entity_code_str", this.globalobjects.userDetails.entity_code_str);
    }


    this.events.unsubscribe("openQueryParamObj");
    this.events.subscribe("openQueryParamObj", () => {
      this.openDevQueryParamObj()
    })

  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.object_mast.Level2[this.page_no].Level3, event.previousIndex, event.currentIndex);
    // //console.log(event.currentIndex);
    let prv: any = event.previousIndex + 1;
    let cur: any = event.currentIndex + 1;
    let localData = this.globalobjects.getLocallData('dragabledata');
    let dragableFrame = [];
    let localObj: any;
    let dragFrame = [];
    let flag1 = true;
    let flag2 = true;
    if (localData) {
      dragableFrame = localData;
      localObj = dragableFrame.find(x => x.objKey == this.object_mast.Level2[this.page_no].object_code);
    }

    if (localObj) {
      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (cur < prv) {
          if (parseInt(frame.apps_frame_seqno) == cur && flag1) {
            frame.apps_frame_seqno = JSON.stringify(prv);
            localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno
            flag1 = false;
          } if (parseInt(frame.apps_frame_seqno) == prv && flag2) {
            frame.apps_frame_seqno = JSON.stringify(cur);
            localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno;
            flag2 = false;
          }
        }
        else if (parseInt(frame.apps_frame_seqno) <= cur && parseInt(frame.apps_frame_seqno) > prv) {
          frame.apps_frame_seqno = JSON.stringify(parseFloat(frame.apps_frame_seqno) - 1);
          localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        }
        else if (parseInt(frame.apps_frame_seqno) == cur && parseInt(frame.apps_frame_seqno) < prv) {
          frame.apps_frame_seqno = JSON.stringify(parseFloat(frame.apps_frame_seqno) + 1);
          localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        } else if (parseInt(frame.apps_frame_seqno) == prv) {
          frame.apps_frame_seqno = JSON.stringify(cur);
          for (let x of localObj.frames) {
            localObj.frames[0][frame.apps_page_frame_seqid] = frame.apps_frame_seqno
          }
        }
      }
    }
    else {

      let frameId = {};
      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (parseInt(frame.apps_frame_seqno) <= cur && parseInt(frame.apps_frame_seqno) > prv) {
          frame.apps_frame_seqno = JSON.stringify(parseFloat(frame.apps_frame_seqno) - 1);
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
          //dragFrame.push(frameId);
        } else if (parseInt(frame.apps_frame_seqno) == cur && parseInt(frame.apps_frame_seqno) < prv) {
          frame.apps_frame_seqno = JSON.stringify(parseFloat(frame.apps_frame_seqno) + 1);
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
          //dragFrame.push(frameId);
        } else if (parseInt(frame.apps_frame_seqno) > cur && parseInt(frame.apps_frame_seqno) > prv) {
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        }
        else if (parseInt(frame.apps_frame_seqno) < cur && parseInt(frame.apps_frame_seqno) < prv) {
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        } else if (parseInt(frame.apps_frame_seqno) == prv) {
          frame.apps_frame_seqno = JSON.stringify(cur);
          frameId[frame.apps_page_frame_seqid] = frame.apps_frame_seqno
        }
      }
      dragFrame.push(frameId);
      let objCode = {
        objKey: this.object_mast.Level2[this.page_no].object_code,
        frames: dragFrame
      };
      dragableFrame.push(objCode);
    }
    this.globalobjects.setDataLocally("dragabledata", dragableFrame);
    // //console.log(dragFrame);
  }

  dragable(ev) {
    ev = !ev;
  }

  afterPageLoad() {

    let reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": this.wscp,
      "wsdp": this.wsdp,
      "wsdpcl": this.wsdpcl,
      "wsud": this.wsud
    }
    // if (this.globalobjects.userDetails.homeObjectCode == this.object_mast.object_code) {
    //   this.afterParaFunc(reqData, this.object_mast, 'I');
    // } else {
    this.afterGetObjectConfig(this.object_mast, reqData, 'I');

    // }
  }

  async getPageInfo(nextPageInfo?): Promise<any> {

    // this.globalobjects.loading_on_demand.update(() => true);
    this.clearQue();
    // let tabdata: any;
    // if (!this.tabflag2) {
    //   this.routeSub = this.routeactivate.queryParams.subscribe(params => {
    //     if (params && params.special) {
    //       tabdata = params.special;
    //     }
    //   });
    // }

    // this.wscp.service_type = this.wscp.service_type ? this.wscp.service_type : "get_object_config";

    this.wscp.service_type = "get_object_config";

    if (this.wscp.service_type == "get_object_config") {
      let validDateStr = this.localAppData[0].resData.app_valid_upto_date;

      if (validDateStr) {
        let validDate = new Date(validDateStr);
        let todayDate = new Date();

        if (validDate < todayDate) {
          this.appValideFlag = false;
        } else {
          this.appValideFlag = true;
        }
      }
    }

    if (this.appValideFlag) {

      // if (tabdata) {
      //   this.wscp = "";
      //   this.wscp = JSON.parse(tabdata);
      //   this.tabflag = true;
      // }
      let reqData: any = {};

      if (this.platform.is('ios')) {
        this.globalobjects.userDetails.ios_version_numeric = this.globalobjects.ios_version_numeric;
      }
      if (this.platform.is('android')) {
        this.globalobjects.userDetails.android_version_numeric = this.globalobjects.android_version_numeric;
      }
      this.screenWidth = document.getElementById('super').clientWidth;

      if (this.screenWidth == 0) {
        this.screenWidth = document.getElementById('sreenWidth').clientWidth;
      }
      this.globalobjects.userDetails.screen_width = this.screenWidth;


      if (this.object_mast && this.object_mast.calling_item_seqid) {
        this.wscp.apps_item_seqid = this.object_mast.calling_item_seqid;
      }

      reqData = {
        "wslp": this.globalobjects.userDetails,
        "wscp": this.wscp,
        "wsdp": this.wsdp,
        "wsdpcl": this.wsdpcl,
        "wsud": this.wsud
      }

      if (nextPageInfo) {

        reqData.wscp = nextPageInfo.wscp;
        reqData.wsdp = nextPageInfo.wsdp;
        reqData.wsdpcl = nextPageInfo.wsdpcl && nextPageInfo.wsdpcl.length > 0 ? nextPageInfo.wsdpcl : this.wsdpcl;
        reqData.wscp.service_type = "get_object_config";
      }

      if (reqData.wscp.object_code && reqData.wscp.object_code.toUpperCase() == 'FI_APPS_ITEM_SEQID') {
        reqData.wscp.object_code = this.lhs_lib.get_item_value(":FI_CALLING_OBJECT_CODE", 'current_record');
        reqData.wscp.apps_item_seqid = this.lhs_lib.get_item_value(":FI_APPS_ITEM_SEQID", 'current_record');
        reqData.wscp.orignal_apps_item_seqid = this.lhs_lib.get_item_value(":FI_ORIGNAL_APPS_ITEM_SEQID", 'current_record');
        reqData.wscp.apps_page_frame_seqid = this.lhs_lib.get_item_value(":FI_APPS_PAGE_FRAME_SEQID", 'current_record');
      }


      let iudId = this.globalobjects.getLocallData('iudLocal');
      if (iudId) {
        reqData.wscp.iud_seqid = this.globalobjects.userDetails.login_session_id + (iudId + 1);
        this.globalobjects.setDataLocally('iudLocal', (iudId + 1));
      } else {
        reqData.wscp.iud_seqid = this.globalobjects.userDetails.login_session_id + 1;
        this.globalobjects.setDataLocally('iudLocal', 1);
      }

      // if (reqData.wsdpcl && reqData.wsdpcl.length > 0) {
      //   const regex = /-WRI$/; // Example: Match keys ending with "Name"
      //   let matchingKey = Object.keys(reqData.wsdpcl[0]).find(key => regex.test(key));
      //   matchingKey = matchingKey + ";";
      //   let frame = this.lhs_lib.get_frame_config(matchingKey.replace('-WRI;',''));
      //   let cl = this.lhs_lib.getWsdpcl(frame.tableRows[frame.active_row],frame.active_row);
      //   reqData.wsdpcl[0] = cl;
      // }



      if (nextPageInfo && nextPageInfo.wscp.flag == 'P') {
        this.isModal == 'P'
      } else if (nextPageInfo && nextPageInfo.wscp.flag == 'O') {
        this.isModal == 'O'
      } else if (!this.wscp.object_code || this.wscp.object_code == "") {
        this.isModal = "Menu";
      }
      /*-------------------- Getting Data From Local DB ---------------------------------------*/

      if (this.globalobjects.getLocallData('openObjectNewTab')) {
        this.wscp.object_code = this.globalobjects.getLocallData('openObjectNewTab');
        this.globalobjects.destroyLocalData('openObjectNewTab');
      } else {
        if (this.wscp.object_code) { }
        else {
          this.wscp.object_code = this.globalobjects.userDetails.homeObjectCode;
        }
      }
      let objectKey = reqData.wscp.object_code;

      if (reqData.wscp.local_Item_Seq_Id) {
        objectKey = objectKey + '#' + reqData.wscp.local_Item_Seq_Id;
      } else {
        if (reqData.wscp.apps_item_seqid) {
          objectKey = objectKey + '#' + reqData.wscp.apps_item_seqid;
        }
      }

      console.log(objectKey);
      if ((!this.globalobjects.toggleDevloperMode() || !this.globalobjects.networkStatus) && reqData.wscp.object_code != 'WEMU0000' && !this.isRefresh) {
        return await this.sqlLiteServ.getById(objectKey, 'object_master').then(async (data: any) => {
          if (data.resStatus == 'Success') {

            let objMast = JSON.parse(data.resData.objMast);
            //------------------------ Replace_Parameter_value ---------------//


            if (((this.globalobjects.userDetails.homeObjectCode == objMast.object_code) && !this.isSameObject) || this.off_canvas || this.objRefreshFlag) {
              this.objRefreshFlag = false;
              this.afterParaFunc(reqData, objMast, 'I');
            }

            // else {
            //   this.afterGetObjectConfig(objMast, reqData, 'I');
            // }
            // this.processObjectMast(this.object_mast);
            //------------------------ Replace_Parameter_value ---------------//
            if (this.object_mast) {
              this.wscp.apps_working_mode = this.object_mast.apps_working_mode;
            }

            return objMast

          } else {
            return await this.proceedGetPageInfo(reqData).then(objMast => {
              // this.globalobjects.loading_on_demand.update(() => false);
              if (objMast) {
                return objMast;
              }
            });
          }
        }, async (err) => {
          return await this.proceedGetPageInfo(reqData).then(objMast => {
            // this.globalobjects.loading_on_demand.update(() => false);
            if (objMast) {
              return objMast;
            } else {
              alert("Error in get_object_config");
            }
          });
        })
      } else {
        return await this.proceedGetPageInfo(reqData).then(objMast => {
          // this.globalobjects.loading_on_demand.update(() => false);
          if (objMast) {
            return objMast;
          } else {
            alert("Error in get_object_config");
          }
        });
      }
    } else {
      // this.globalobjects.loading_on_demand.update(() => false);
      let validMessage = this.localAppData[0].resData.app_valid_upto_message;
      this.globalobjects.presentAlert(JSON.stringify(validMessage));
    }

    this.globalobjects.allFrameJsonData = [];
    this.wsdpcl = [];
  }

  async proceedGetPageInfo(reqData): Promise<any> {


    try {
      // delete reqData.wscp['ref_cursor_mode'];

      reqData.wscp.g_theme_name = (this.globalobjects.appLayout == 'mordern-leagacy' || this.globalobjects.appLayout == 'mordern-leagacy75') ? 'MODERN' : 'LEGACY';

      return new Promise((resolve, reject) => {
        this.dataService.postData("S2U", reqData).then((res: any) => {
          let data: any = res;
          if (data.responseStatus && data.responseStatus.includes("success")) {
            this.object_arr = data.responseData;
            // this.globalobjects.hideLoadingSide()
            //-------------------------------------------Pending for Session_HOLD_FLAG-----------wscp to wsdp-------------------------//
            let objData = this.globalobjects.setPageInfo(this.object_arr);

            if (objData.Level1.length > 0 && objData.Level1[0].status == "Q") {
              this.globalobjects.presentAlert(objData.Level1[0].message);
              reject("error");
            } else {
              let objMast = objData.Level1[0];

              if (objMast) {
                let user = this.globalobjects.userDetails;
                if (!user.homeObjectCode) {
                  user.homeObjectCode = objMast.object_code;
                  this.globalobjects.setDataLocally("userDetails", user);
                }

                // setting calling_item_seqid in objMast ///
                objMast.calling_item_seqid = reqData.wscp.apps_item_seqid;
                objMast.previousObj = reqData.wscp.previousObj;

                objMast.holdWscp = JSON.parse(JSON.stringify(reqData.wscp));

                let dbObjMast = JSON.parse(JSON.stringify(objMast));

                if (((this.globalobjects.userDetails.homeObjectCode == objMast.object_code) && !this.isSameObject) || this.off_canvas || this.objRefreshFlag || !this.globalobjects.lazyLoading) {
                  this.objRefreshFlag = false;
                  this.afterParaFunc(reqData, objMast, 'P');
                }
                // else {
                //   this.afterGetObjectConfig(objMast, reqData, 'P');
                // }


                let offlineObjectCode: any;
                this.wscp.apps_working_mode = objMast.apps_working_mode;

                if (objMast.local_storage_flag != "F") {
                  if (reqData.wscp) {
                    if (reqData.wscp.object_code) {
                      offlineObjectCode = reqData.wscp.object_code;
                    }
                    else {
                      offlineObjectCode = this.globalobjects.userDetails.homeObjectCode;
                    }
                  }
                  let pouchObjectKey = offlineObjectCode;
                  objData._id = pouchObjectKey;

                  var temp: any = {};
                  var id = pouchObjectKey;

                  if (reqData.wscp.local_Item_Seq_Id) {
                    id = id + '#' + reqData.wscp.local_Item_Seq_Id;
                  } else {
                    if (reqData.wscp.apps_item_seqid) {
                      id = id + '#' + reqData.wscp.apps_item_seqid;
                    }
                  }

                  temp = {
                    id: id,
                    objData: JSON.stringify(dbObjMast)
                  }


                  console.log(id);
                  this.sqlLiteServ.getById(id, 'object_master').then(data => {
                    if (data.resStatus == 'Success') {
                      temp.rev = data.resData._rev;
                      this.sqlLiteServ.updateObjMast(temp, 'object_master');
                      // this.ngZone.run(() => {
                      //   this.cdr.detectChanges()
                      // })
                    } else {
                      this.sqlLiteServ.postDataSql(temp, 'object_master');
                      // this.ngZone.run(() => {
                      //   this.cdr.detectChanges()
                      // })
                    }
                  });
                }
              }

              if (data.responseHead && data.responseHead.length > 0) {
                this.generatAllFrameJson(data.responseHead, event, true);
                objMast = {};
              }

              resolve(objMast);
            }
          }
          else {
            if (this.wscp.service_type == "get_object_config") {
              let resArr = data.responseMsg.split('#')
              if (resArr[0] == "V") {
                this.globalobjects.presentAlert(resArr[1]);
                this.pluginService.openMarket();
                // this.market.open('com.lhs.lhsess');
                this.globalobjects.hideLoadingSide()
              } else if (resArr[0] == "Q") {
                this.globalobjects.presentAlert(resArr[1]);
                // this.ngZone.run(() => {
                //   this.cdr.detectChanges()
                // })

                // this.globalobjects.hideLoadingSide()
              } else {
                this.globalobjects.presentAlert(data.responseMsg);
                this.globalobjects.hideLoadingSide()
              }
              // this.globalobjects.isGetObjectConfig = false;
              //   this.globalobjects.hide_event_loading();
            }
          }

          let localdata = this.globalobjects.getLocallData("dragabledata");
          let framedata = [];
          if (localdata) {
            for (let x of localdata) {
              if (x.objKey == this.object_mast.Level2[this.page_no].object_code) {
                for (let dragFrame of x.frames) {
                  for (let y in dragFrame) {
                    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                      if (frame.apps_page_frame_seqid == y) {
                        frame.apps_frame_seqno = dragFrame[y];
                        framedata[dragFrame[y] - 1] = frame;
                      }
                    }
                  }
                }
                this.object_mast.Level2[this.page_no].Level3 = framedata
              }
            }
          }

          let notificationObject = this.globalobjects.getLocallData("notiObjectCode");

          if (notificationObject) {
            this.wscp.object_code = notificationObject;
            this.globalobjects.destroyLocalData("notiObjectCode");


            let componentProps = {
              click_events_str: "get_object_config",
              object_mast: [],
              wscp: { object_code: notificationObject },
              wsdp: [],
              wsdpcl: []
            }

            this.ngZone.run(() => {
              this.openPage(componentProps)
              // this.cdr.detectChanges()
            })
          }
        }).catch(err => {
          this.globalobjects.presentToast("5 Something went wrong please try again later!");
          let msg = err
          msg.message = "Http failure response.";
          msg.url = msg.url ? msg.url.split("lhsws")[0] : null;
          if (msg.url) {
            alert(JSON.stringify(msg));
          }
          this.globalobjects.hideLoadingSide()
          this.globalobjects.isGetObjectConfig.set(false);
          this.globalobjects.hide_event_loading();
        })
      })
    } catch (error) {
      alert(error);
      console.log(error);
      this.globalobjects.isGetObjectConfig.set(false);
      this.globalobjects.hide_event_loading();
    }
  }

  afterGetObjectConfig(objMast, reqData, flag?) {
    try {

      if (this.globalobjects.logFlag) {
        let name = "processing get_object_config";
        let ws_type = "get_object_config"
        let log_name = `afterGetObjectConfig_${objMast.object_code}`;
        let status = "start";
        const seq = this.lhs_lib.start();
        // this.globalobjects.log_event_slno=parseFloat((this.globalobjects.log_event_slno + 0.1).toFixed(1));
        // let obj={
        //         name:log_name,
        //         slno:this.globalobjects.log_event_slno
        //       }
        // this.globalobjects.log_event_slno_check_array.push(obj)
        // this.lhs_lib.get_event_log_obj(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, objMast.object_code, "start",ws_type,this.globalobjects.log_event_slno);
        this.lhs_lib.get_event_log_objs(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, objMast.object_code, status, ws_type, log_name, seq);
      }

      let l_calling_para = "";
      let headerBar = [], footerBar = [], fabBall = [], sideBar, globalSearchArr = [], filterArr = [], tabs = [];


      let fI_glob = this.globalobjects.callingParameter.find(x => x.obj_code == "FI_APPS_ITEM_SEQID");
      if (fI_glob) {
        fI_glob.obj_code = objMast.object_code;
      }

      let str = ""
      if (this.globalobjects.callingParameter.length > 0) {
        let glob = this.globalobjects.callingParameter.find(x => x.obj_code == objMast.object_code && x.calling_item_seqid == objMast.calling_item_seqid);
        if (glob) {
          str = glob.str;
          l_calling_para = str;
        }
      }


      // objMast.distinctItemsArr = [];
      objMast.global_parameter_map = new Map<string, any>();

      for (let object of objMast.Level2) {
        for (let frame of object.Level3) {
          let i = -1;
          frame.mergeVersion ??= signal(0); // for level5 merge pipe by arti
          this.lhs_lib.seqSort(frame.Level4);
          this.lhs_lib.itemSeparation(frame);

          this.getFrameStyle(frame);

          switch (frame.apps_frame_type) {
            case 'FOOTER_BAR': footerBar.push(frame); break;
            case 'TOP_BAR': headerBar.push(frame); break;
            case 'FAB_BALL': fabBall.push(frame); break;
            case 'SIDE_BAR': sideBar = frame; break;

            case 'TAB_FRAMES': tabs.push(frame); break;
            case 'CANVAS': 
            switch (frame.apps_frame_sub_type) {
              case 'SIDE_MENU': this.side_menu = frame; break;
            }; break;
            case 'SYSTEM':
              switch (frame.apps_frame_sub_type) {
                case 'OBJECT_INFO': objMast.frame_object_info = frame; break;
                case 'FORM_TABS': objMast.frame_form_tabs = frame; break;
                case 'RELATED_LINKS': objMast.frame_related_links = frame; break;
                case 'ENGINE': filterArr.push(frame); break;

                case 'GLOBAL_SEARCH_HEAD':
                case 'GLOBAL_SEARCH_BODY': globalSearchArr.push(frame); break;
                case 'QUICK_ACTION_BUTTON': frame.isRunning = this.running(frame.Level4); break;
              }
              break;
          }


          if (frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) {

            let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
            for (let itemGroup of frameLevel4) {
              i++;
              for (let item of itemGroup.Level5) {

                item.item_name = item.item_name?.toUpperCase();

                if (str) {
                  if (item.item_name == "p_calling_parameter_str") {
                    item.value = str;
                    item.item_default_value = str;
                  }
                }
                if (item.item_default_value) {
                  item.value = item.item_default_value;
                }
              }
            }
            frame.tableRows = [];
            frame.tableRows[0] = frameLevel4;
            this.lhs_lib.getSepratorGrp(frame);
          }

          frame.frame_status = 'NEW';

          for (let itemGroup of frame.Level4) {
            i++;
            for (let itemMast of itemGroup.Level5) {

              if (itemMast.click_events_str && !itemMast.isclick_events_str) {
                itemMast.isclick_events_str = true
              }

              if (itemMast.item_name == "FRAME_RECORD_START") {
                let itemName = "'" + frame.apps_page_frame_seqid + '.FRAME_RECORD_START' + "'";
                for (let itemGroup of frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    if (item.item_name != "FRAME_RECORD_START" && item.item_name != "FRAME_RECORD_END" && item.item_name != "FRAME_RECORD_IF_NULL" && !item.item_name.toLowerCase().startsWith("sys_")) {
                      if (itemMast.click_events_str) {
                        if (item.click_events_str) {
                          item.isclick_events_str = true
                        }
                        item.orignal_click_events_str = item.orignal_click_events_str != undefined ? item.orignal_click_events_str : (item.click_events_str ? item.click_events_str : "");
                        item.click_events_str = item.click_events_str ?
                          `app_execute_item(${itemName} ,'click_events_str','current_record');` + item.click_events_str :
                          `app_execute_item(${itemName},'click_events_str','current_record');`;
                      }

                      if (itemMast.post_events_str) {
                        item.orignal_post_events_str = item.orignal_post_events_str ? item.orignal_post_events_str : (item.post_events_str ? item.post_events_str : "");
                        item.post_events_str = item.post_events_str ?
                          `app_execute_item(${itemName},'post_events_str','current_record');` + item.post_events_str :
                          `app_execute_item(${itemName},'post_events_str','current_record');`;
                      }

                      if (itemMast.on_load_events_str) {
                        item.orignal_on_load_events_str = item.orignal_on_load_events_str ? item.orignal_on_load_events_str : (item.on_load_events_str ? item.on_load_events_str : "");
                        item.on_load_events_str = item.on_load_events_str ?
                          `app_execute_item(${itemName},'on_load_events_str','current_record');` + item.on_load_events_str :
                          `app_execute_item(${itemName},'on_load_events_str','current_record');`;
                      }

                      if (itemMast.calling_object_load_events_str) {
                        item.orignal_calling_object_load_events_str = item.orignal_calling_object_load_events_str ? item.orignal_calling_object_load_events_str : (item.calling_object_load_events_str ? item.calling_object_load_events_str : "");
                        item.calling_object_load_events_str = item.calling_object_load_events_str ?
                          `app_execute_item(${itemName},'calling_object_load_events_str','current_record');` + item.calling_object_load_events_str :
                          `app_execute_item(${itemName},'calling_object_load_events_str','current_record');`;
                      }
                    }
                  }
                }
              }

              if (itemMast.item_name == "FRAME_RECORD_END") {
                let itemName = "'" + frame.apps_page_frame_seqid + '.FRAME_RECORD_END' + "'";
                for (let itemGroup of frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    if (item.item_name != "FRAME_RECORD_START" && item.item_name != "FRAME_RECORD_END" && item.item_name != "FRAME_RECORD_IF_NULL" && !item.item_name.toLowerCase().startsWith("sys_")) {
                      if (itemMast.click_events_str) {
                        if (item.click_events_str) {
                          item.isclick_events_str = true
                        }
                        item.orignal_click_events_str = item.orignal_click_events_str != undefined ? item.orignal_click_events_str : (item.click_events_str ? item.click_events_str : "");
                        item.click_events_str = item.click_events_str ? ((item.click_events_str.charAt(item.click_events_str.length - 1) == ';') ?
                          item.click_events_str + `app_execute_item(${itemName} ,'click_events_str','current_record');` :
                          (item.click_events_str + `;app_execute_item(${itemName} ,'click_events_str','current_record');`))
                          : `app_execute_item(${itemName},'click_events_str','current_record');`;
                      }

                      if (itemMast.post_events_str) {
                        item.orignal_post_events_str = item.orignal_post_events_str ? item.orignal_post_events_str : (item.post_events_str ? item.post_events_str : "");
                        item.post_events_str = item.post_events_str ? ((item.post_events_str.charAt(item.post_events_str.length - 1) == ';') ?
                          item.post_events_str + `app_execute_item(${itemName},'post_events_str','current_record');` :
                          (item.post_events_str + `;app_execute_item(${itemName},'post_events_str','current_record');`))
                          : `app_execute_item(${itemName},'post_events_str','current_record');`;
                      }

                      if (itemMast.on_load_events_str) {
                        item.orignal_on_load_events_str = item.orignal_on_load_events_str ? item.orignal_on_load_events_str : (item.on_load_events_str ? item.on_load_events_str : "");
                        item.on_load_events_str = item.on_load_events_str ? ((item.on_load_events_str.charAt(item.on_load_events_str.length - 1) == ';') ?
                          item.on_load_events_str + `app_execute_item(${itemName},'on_load_events_str','current_record');` :
                          (item.on_load_events_str + `;app_execute_item(${itemName},'on_load_events_str','current_record');`))
                          : `app_execute_item(${itemName},'on_load_events_str','current_record');`;
                      }

                      if (itemMast.calling_object_load_events_str) {
                        item.orignal_calling_object_load_events_str = item.orignal_calling_object_load_events_str ? item.orignal_calling_object_load_events_str : (item.calling_object_load_events_str ? item.calling_object_load_events_str : "");
                        item.calling_object_load_events_str = item.calling_object_load_events_str ? ((item.calling_object_load_events_str.charAt(item.calling_object_load_events_str.length - 1) == ';') ?
                          item.calling_object_load_events_str + `app_execute_item(${itemName},'calling_object_load_events_str','current_record');` :
                          (item.calling_object_load_events_str + `;app_execute_item(${itemName},'calling_object_load_events_str','current_record');`))
                          : `app_execute_item(${itemName},'calling_object_load_events_str','current_record');`;
                      }

                    }

                  }
                }
              }

              if (itemMast.item_name == "FRAME_RECORD_IF_NULL") {
                let itemName = "'" + frame.apps_page_frame_seqid + '.FRAME_RECORD_IF_NULL' + "'";
                for (let itemGroup of frame.Level4) {
                  for (let item of itemGroup.Level5) {
                    if (item.item_name != "FRAME_RECORD_START" && item.item_name != "FRAME_RECORD_END" && item.item_name != "FRAME_RECORD_IF_NULL" && !item.item_name.toLowerCase().startsWith("sys_")) {
                      if (itemMast.click_events_str) {
                        if (item.click_events_str) {
                          item.isclick_events_str = true
                        }
                        item.orignal_click_events_str = item.orignal_click_events_str != undefined ? item.orignal_click_events_str : (item.click_events_str ? item.click_events_str : "");
                        item.click_events_str = item.click_events_str ? item.click_events_str :
                          `app_execute_item(${itemName},'click_events_str','current_record');`;
                      }

                      if (itemMast.post_events_str) {
                        item.orignal_post_events_str = item.orignal_post_events_str ? item.orignal_post_events_str : (item.post_events_str ? item.post_events_str : "");
                        item.post_events_str = item.post_events_str ? item.post_events_str :
                          `app_execute_item(${itemName},'post_events_str','current_record');`;
                      }

                      if (itemMast.on_load_events_str) {
                        item.orignal_on_load_events_str = item.orignal_on_load_events_str ? item.orignal_on_load_events_str : (item.on_load_events_str ? item.on_load_events_str : "");
                        item.on_load_events_str = item.on_load_events_str ? item.on_load_events_str :
                          `app_execute_item(${itemName},'on_load_events_str','current_record');`;
                      }

                      if (itemMast.calling_object_load_events_str) {
                        item.orignal_calling_object_load_events_str = item.orignal_calling_object_load_events_str ? item.orignal_calling_object_load_events_str : (item.calling_object_load_events_str ? item.calling_object_load_events_str : "");
                        item.calling_object_load_events_str = item.calling_object_load_events_str ? item.calling_object_load_events_str :
                          `app_execute_item(${itemName},'calling_object_load_events_str','current_record');`;
                      } ''

                    }

                  }
                }
              }
              if (itemMast.mirror_item_seqid) {

                let flag = true;
                let name = itemMast.mirror_item_seqid;
                if (itemMast.mirror_item_seqid && itemMast.mirror_item_seqid.includes(".")) {
                  flag = false;
                  name = itemMast.mirror_item_seqid.split(".")[1];
                }
                for (let objectNxt of objMast.Level2) {
                  for (let frameNxt of objectNxt.Level3) {

                    if (flag || (itemMast.mirror_item_seqid && itemMast.mirror_item_seqid.includes(".") && ((frameNxt.frame_alias && itemMast.mirror_item_seqid.split(".")[0].toLowerCase() == frameNxt.frame_alias.toLowerCase()) || itemMast.mirror_item_seqid.split(".")[0].toLowerCase() == frameNxt.apps_page_frame_seqid.toLowerCase()))) {

                      for (let itemGroupNxt of frameNxt.Level4) {
                        for (let itemMastNxt of itemGroupNxt.Level5) {
                          if (itemMastNxt.apps_item_seqid.toLowerCase() == name.toLowerCase() || itemMastNxt.item_name.toLowerCase() == name.toLowerCase()) {
                            if (itemMastNxt.mirrored_items) {
                              itemMastNxt.mirrored_items = itemMastNxt.mirrored_items + ";" + itemMast.apps_item_seqid;
                            } else {
                              itemMastNxt.mirrored_items = itemMast.apps_item_seqid;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

        }
      }

      if (this.isTab) {
        this.pb_back_to_exit(objMast)
      }

      if (filterArr.length > 0) {
        console.log(filterArr);
        objMast.engine_filter_frames = filterArr;
        filterArr = [];
      }

      if (globalSearchArr.length > 0) {
        objMast.globalSearchArr = globalSearchArr;
        globalSearchArr = [];
      }

      for (let tab of tabs) {
        let tab_frame_data = []
        for (let object of objMast.Level2) {
          for (let frame of object.Level3) {

            if (frame.apps_frame_seqno && frame.apps_frame_seqno.includes('.')) {
              let seqno = frame.apps_frame_seqno.split('.')
              if (tab.apps_frame_seqno == seqno[0]) {
                tab_frame_data.push(frame)

              }

            }
          }
          tab.tabsArr = tab_frame_data
        }
      }



      console.log("tab_frame - ", tabs)
      // console.log("tab_frame data - ", tab_frame_data)
      let layoutNew = this.globalobjects.getLocallData('layoutNew');
      if (layoutNew == "mordern4") {
        objMast = this.setSsType(objMast);
      }
      if (layoutNew == "mordern5") {
        objMast = this.setSsType(objMast);
      }



      this.object_mast = objMast;
      // this.lhs_lib.object_mast=this.object_mast
      let iudId = this.globalobjects.getLocallData('iudLocal');
      this.object_mast.iud_seqid = this.globalobjects.userDetails.login_session_id + iudId;

      // this.chatAiService.object_mast = this.object_mast;
      // this.updateTab.emit({ ...this.object_mast, superId: this.superId });

      if (this.isTab) {
        this.object_mast.superId = this.superId
        this.updateTab.emit(this.object_mast);
        if (this.page_no != 0) {
          this.page_no = 0
        }
      } else {
        this.lhs_lib.object_mast = this.object_mast;
      }

      this.lhs_lib.object_mast._object_indexes = this.lhs_lib.buildItemIndexes(this.lhs_lib.object_mast);

      if (this.object_mast.after_get_object_config == "Y") {
        this.getLib(reqData, flag);
      }


      // this.afterDestroy();
      this.object_mast.headerBar = headerBar;
      this.object_mast.footerBar = footerBar;

      this.object_mast.Level2[this.page_no].Level3.popoverFlag = this.wscp.flag;
      this.wscp.flag = "M";



      if (this.no_back) {
        this.set_noBack_frame();
      }

      if (fabBall.length > 0) {
        let frameLevel4;

        let fabArr = [];
        frameLevel4 = JSON.parse(JSON.stringify(fabBall[0].Level4));
        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            fabArr.push(item);
          }
        }
        this.object_mast.fabBall = fabArr;
        this.getImg(0, fabArr);
      }

      if (sideBar) {
        let obj = {
          evFlag: "T",
          data: sideBar
        }
        this.events.publish("sideBarMenu", obj);
      }


      this.beforeObjectMast(this.object_mast);
      this.setParaCall(l_calling_para);

      if (this.object_mast.oAJSFunc) {
        for (let o of this.object_mast.oAJSFunc) {
          eval.call(null, o);
        }
      }

      if (this.object_mast) {
        if (this.object_mast.operation_mode_str && this.object_mast.operation_mode_str.indexOf("#") > -1) {
          this.object_mast.operation_mode_Arr = this.object_mast.operation_mode_str.split("#");
        }
      }



      this.processObjectMast(this.object_mast);
      // if(!this.plt){
      //   this.mobileViewQuickAction();
      // }
      

      // this.globalobjects.hideLoadingSide();

      if (this.object_mast.calling_parameter_str_cc) {

        this.wscp.calling_parameter_str_cc = this.object_mast.calling_parameter_str_cc;
        let str = this.object_mast.calling_parameter_str_cc.replace(/=/g, ":=");
        let callingStr = str.split('~');

        let obj = {
          itmData: callingStr,
          objectCode: this.object_mast.object_code,
          itemCode: this.wscp.apps_item_seqid
        }

        if (this.globalobjects.callingPara.length > 0) {
          let glob = this.globalobjects.callingPara.find(x => x.objectCode == this.object_mast.object_code && x.itemCode == this.wscp.apps_item_seqid);

          if (glob) {

            for (let c of obj.itmData) {
              for (let i of glob.itmData) {
                if (i.split(":=")[0] == c.split(":=")[0]) {
                  c = i
                }
              }
            }
            glob.itmData = obj.itmData
          } else {
            this.globalobjects.callingPara.push(obj);
          }
        } else {
          this.globalobjects.callingPara.push(obj);
        }
      }
      const tabGet: any = document.querySelectorAll('app-my-tab')
      if (!this.lhs_lib.isTab) {
        this.lhs_lib.isTab = true
        let a = {
          index: 0,
          object: this.lhs_lib.object_mast,
          breadcrumbBar: [],
          active: true
        }
        this.lhs_lib.adata.push(a)
      } else {
        if (this.isTab && !this.isRefresh) {
          let a = {
            index: tabGet.length - 1,
            object: this.lhs_lib.object_mast,
            breadcrumbBar: [],
            active: true
          }
          this.lhs_lib.adata.push(a)

        } else {
          this.isRefresh = false
          this.lhs_lib.setObjectMastTab()
        }
      }

      if (this.globalobjects.logFlag) {
        let name = "processing get_object_config";
        let ws_type = "get_object_config"
        let log_name = `afterGetObjectConfig_${objMast.object_code}`;
        let status = "end";
        this.lhs_lib.end();
        // let logsData=this.globalobjects.log_event_slno_check_array.find((arr)=>arr.name==log_name)
        // this.lhs_lib.get_event_log_obj(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, objMast.object_code, "end",ws_type,logsData.slno)
        this.lhs_lib.get_event_log_objs(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, objMast.object_code, status, ws_type, log_name);
      }
    } catch (error) {
      alert(error);
      console.log(error)
    }
  }


  getLib(reqData, flag?) {
    reqData.wscp.service_type = "after_get_object_config";
    reqData.wscp.apps_working_mode = flag;
    reqData.wsdp = [];
    reqData.wsdpcl = [];
    reqData.wscp.object_code = this.object_mast.object_code;

    reqData.wscp = this.generate_wscp({}, reqData.wscp);
    this.dataService.postData("S2U", reqData).then((res: any) => {
      let data = res;
      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
      if (data.responseStatus && data.responseStatus.includes("success")) {
        let objData = this.globalobjects.setPageInfo(data.responseData);
        if (objData.Level1 && objData.Level1.length > 0 && objData.Level1[0]['status'] == 'J') {
          this.generatAllFrameJson(objData.Level1, reqData.wscp);
          let data = objData.Level1;
          let isRep = data.find(x => x.para_type == 'RE');
          if (isRep) {
            this.getLib(reqData, flag);
          }
        }
      } else {
        alert(data.responseMsg);
      }
    });

  }


  goItemClicked(event, i) {
    this.globalobjects.breadCrumpsArray.splice(i, this.globalobjects.breadCrumpsArray.length);
    this.itemClicked(event);
  }


  isInAngularZone(): boolean {
    return !!NgZone.isInAngularZone();
  }

  isAngularEventQueueEmpty() {
    return this.ngZone.onMicrotaskEmpty && this.ngZone.onStable;
  }

  // isEventRunning(event): boolean {
  //   // if (this.clickEvent && this.clickEvent.click_events_arr) {
  //   //   if (((this.clickEvent.click_events_arr.length > (this.clickEvent.click_events_count + 1)) && !this.clickEvent.rase) || !this.isAngularEventQueueEmpty()) {

  //   //     if ((!event.itemClicked || (event.itemClicked && event.itemClicked == 'pre')) && event.click_events_str) {
  //   //       let strArr = event.click_events_str.trim().replace(/\n|\r/g, "").split(";");
  //   //       if (strArr && (strArr[0].toLowerCase() == 'get_object_config')) {
  //   //         return false;
  //   //       }
  //   //     }
  //   //     return true;
  //   //   } else if (this.clickEvent.opening_object) {
  //   //     return true;
  //   //   }
  //   //   else if (this.clickEvent?.isJsRunning) {
  //   //     return true;
  //   //   }
  //   //   else if (this.clickEvent.rase) {
  //   //     if (this.clickEvent.click_events_arr.length == 0) {
  //   //       delete this.clickEvent['rase'];
  //   //       return false;
  //   //     }
  //   //     return true;
  //   //   }
  //   //   // else if (!this.globalobjects.focusArrow) {
  //   //   //   return true;
  //   //   // }
  //   // }

  //   return false;
  // }


  async itemClicked(event) {
    console.log("itemClicked event", event);
    this.shortcutkey_count = {}
    // console.log(`comes in itemClicked of super component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,event.item_name);
    if (event.personalization) {
      console.log(event);
      // this.refreshObjFab();

      this.setPersonaliseDatafunc(event);
      return;
      // alert(event.pres);
    }

    // this.focusNextItem(event);
    // supercomp = this;
    // utilvar = this;

    if (!this.refreshFlag) {

      if (event.eventType && event.eventType == 'addRow') {
        this.processData.addData(event);
      }
      if (event.rightClickFlag) {
        if (event.calling_object_code) {
          this.openPop(event)
        }
      } else {



        if (this.isEventRunning && !event.Level4) {
          if (this.clickEvent?.opening_object) { return; }
          let type = "";
          let stArr = [];

          if (event.itemClicked && event.itemClicked == 'post') {
            // if (event.post_events_str) {
            //   type = "post_events_str";
            //   stArr = event.post_events_str.trim().replace(/\n|\r/g, "").split(";");
            // } else {
            //   return;
            // }


            if (event.some_post_events_str != undefined) {
              type = "post_events_str";
              stArr = event.some_post_events_str.trim().replace(/\n|\r/g, "");
              delete event['some_post_events_str'];
            } else if (event.post_events_str) {
              type = "post_events_str";
              stArr = event.post_events_str.trim().replace(/\n|\r/g, "").split(";");
            } else {
              return;
            }


          } else if (event.itemClicked && event.itemClicked == 'load' && event.on_load_events_str) {
            type = "on_load_events_str";
            stArr = event.on_load_events_str.trim().replace(/\n|\r/g, "").split(";");
          } else if (event.click_events_str) {
            type = "click_events_str";
            stArr = event.click_events_str.trim().replace(/\n|\r/g, "").split(";");
          } else {
            return;
          }
          // console.log("click_events_str");


          // if (!event.Level4) {

          let itemName = event.apps_page_frame_seqid + "." + event.item_name;

          let str = "";

          str = `app_itemClicked('${itemName}','${type}','${event.indexcount}')`;

          this.event_que_arr.push(str);
          // return;
          // }
        } else {
          let itmName = "";
          let frameName = "";
          let rowNum = "";

          let frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seqid);
          if (frame) {
            frameName = frame.apps_page_frame_seqid;
            itmName = event.item_name;
            rowNum = frame.active_row;

            this.lhs_lib.sys_last_rownumber = this.lhs_lib.sys_current_rownumber;
            this.lhs_lib.sys_current_rownumber = rowNum;
            if (frame.frame_alias) {
              frameName = frame.frame_alias;
              itmName = frame.frame_alias + "." + itmName;
            }
          }


          if (itmName != this.lhs_lib.sys_current_item) {
            this.lhs_lib.sys_last_item = this.lhs_lib.sys_current_item;
            this.lhs_lib.sys_last_frame = this.lhs_lib.sys_current_frame;

            this.lhs_lib.sys_current_frame = frameName;
            this.lhs_lib.sys_current_item = itmName;
          }


          if (event.lovData) {
            this.setLovData(event);
          }

          if (event.mirrored_items) {
            this.lhs_lib.set_mirror_values(event);
          }

          this.clicked_frame_seq = event.apps_page_frame_seqid;

          if (event.childItems) {
            this.openPop(event.childItems);
          } else {

            if (event.click_events_str || event.post_events_str || event.on_load_events_str || event.execute_evnts) {
              if (this.globalobjects.logFlag) {
                this.globalobjects.excuted_events_logs.push(`starting event for ${event.item_name} - ${event.apps_page_frame_seqid} :- ${event.itemClicked} , ${new Date().toString().split(" GMT")[0]}`);
              }

              let clickEventStr = "";
              if (event.itemClicked && event.itemClicked == 'pre' && event.click_events_str) {
                clickEventStr = event.click_events_str.trim().replace(/\n|\r/g, "");
                if (event.item_type != 'BUTTON' && event.item_type != 'BT' && event.item_type != 'BUTTON_ICON' && !event.isAssociate) {

                  if (!frame) {
                    frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seqid);
                  }

                  if (frame && (frame.apps_frame_sub_type == 'SINGLE_ROW' || frame.apps_frame_sub_type == 'SINGLE_ROW_BLANK' || frame.no_of_records == '1')) {

                    // let name = event.apps_page_frame_seqid + '.WMA_RECORD_STATUS'
                    // let itm = this.lhs_lib.get_item(name, 0);
                    // if (itm) {
                    //   itm.frame_status = 'dirty';
                    // }

                    if (frame) {
                      let tableRows = this.lhs_lib.get_rows(frame, 0);
                      if (tableRows) {
                        this.lhs_lib.make_row_dirty(event, tableRows);
                      }
                    }

                  } else {
                    // let name = event.apps_page_frame_seqid + '.WMA_RECORD_STATUS'
                    // let itm = this.lhs_lib.get_item(name, event.itemIndex);
                    // if (itm) {
                    //   itm.frame_status = 'dirty';
                    // }

                    if (event.frame_status != 'dirty') {
                      if (frame) {
                        let tableRows = this.lhs_lib.get_rows(frame, event.itemIndex);
                        if (tableRows) {
                          this.lhs_lib.make_row_dirty(event, tableRows);
                        }
                      }
                    }
                  }
                }

              } else if (event.itemClicked && event.itemClicked == 'post' && event.post_events_str) {
                if (event.some_post_events_str != undefined) {
                  clickEventStr = event.some_post_events_str.trim().replace(/\n|\r/g, "");
                  delete event['some_post_events_str'];
                } else {
                  clickEventStr = event.post_events_str.trim().replace(/\n|\r/g, "");
                }
              } else if (event.itemClicked && event.itemClicked == 'load' && event.on_load_events_str) {
                clickEventStr = event.on_load_events_str.trim().replace(/\n|\r/g, "");
              }
              // else if (event.itemClicked && event.itemClicked == 'executed_item' && event.execute_evnts) {
              //   clickEventStr = event.execute_evnts.replaceAll(" ", "").replace(/\n|\r/g, "");
              // } 
              else {
                if (event.click_events_str && event.itemClicked != 'post') {
                  clickEventStr = event.click_events_str.trim().replace(/\n|\r/g, "");
                }
              }

              if (clickEventStr && clickEventStr.indexOf(";") > -1) {
                event.click_events_arr = clickEventStr.split(";");
              } else {
                event.click_events_arr = clickEventStr ? clickEventStr.split("#") : [];
              }
              if (event.countZero && event.click_events_count) { } else {
                event.click_events_count = 0;
              }

              event.runEvents = [];
              event.eventType = event.itemClicked ? event.itemClicked : "click_event_str";
              event.click_events_arr ? (event.click_events_arr.length == 0 ? event.click_events_arr.filter(x => x) : []) : [];


              event.click_events_arr = event.click_events_arr.reduce((acc, cur) => {
                if (cur.trim()) {
                  acc.push(cur);
                }
                return acc;
              }, []);

              this.event_que_arr = event.click_events_arr;

              this.isEventRunning = true;
              this.globalobjects.isNotOpenTab.set(true)
              this.globalobjects.show_event_loading(event);
              // this.itemClicked1(event, clickEventStr, frame);
              await this.itemClicked_new(event, null, frame)
              // this.newItemClicked(event, clickEventStr);
              this.isEventRunning = false;
              this.globalobjects.isNotOpenTab.set(false)
              this.lhs_lib.refresh_frames();
              if (!this.globalobjects.isGetObjectConfig()) {
                this.globalobjects.hide_event_loading();
              }

              if (this.globalobjects.focusedItem) {

                this.lhs_lib.go_item(this.globalobjects.focusedItem.name, this.globalobjects.focusedItem.index != undefined ? this.globalobjects.focusedItem.index : event.itemIndex, true);
                this.globalobjects.focusedItem = '';
              }
            } else {
              this.lhs_lib.refresh_frames();
            }
          }
        }
      }
    } else {
      this.refreshFlag = false;
    }
  }

  async app_itemClicked(name, type, index) {
    let item = this.lhs_lib.get_item(name, index, true);
    if (item && item.item_enable_flag == 'T') {
      let eventStr = ""
      if (type.toLowerCase() == "click_events_str") {

        eventStr = item.click_events_str ? item.click_events_str.replaceAll(" ", "").replace(/\n|\r/g, "") : "";
        // item.itemClicked = "pre";
      } else if (type.toLowerCase() == "post_events_str") {
        eventStr = item.post_events_str ? item.post_events_str.replaceAll(" ", "").replace(/\n|\r/g, "") : "";
      } else if (type.toLowerCase() == "on_load_events_str") {
        eventStr = item.on_load_events_str ? item.on_load_events_str.replaceAll(" ", "").replace(/\n|\r/g, "") : "";
      }

      let eventArr = eventStr ? (eventStr.includes(";") ? eventStr.split(";") : [eventStr]) : [];

      // item.click_events_arr = eventArr;
      // item.click_events_count = 0;
      item.itemClicked = item.itemClicked ?? 'pre';

      eventArr = eventArr.reduce((acc, cur) => {
        if (cur.trim()) {
          acc.push(cur);
        }
        return acc;
      }, []);

      await this.itemClicked_new(item, eventArr);
    }
  }




  isSameObject = false
  get_object_config(event, objCode?, type?) {

    if (event.singleClicked) {
      delete event['singleClicked'];
      this.clearQue();
      return;
    }

    // event.calling_object_code
    let isNewTab = false
    let tabInstance: any
    let isObjectCall = false
    if (!event.menuClick) {
      for (let dt of this.lhs_lib.dynamicTabs) {
        if (event.calling_object_code == dt.instance.object_data.object_code && event.apps_item_seqid == dt.instance.object_data.calling_item_seqid) {
          isNewTab = true
          tabInstance = dt
        }
      }
    }

    if (isNewTab) {
      let text = "Do you want on new tab?";
      if (confirm(text) == true) {
        isObjectCall = false
      } else {
        this.clearQue();
        this.events.publish("selectTab", tabInstance.instance)
        isObjectCall = true
      }
    }
    if (!isObjectCall) {

      this.clickEvent = event;

      let nextPageInfo: any = {};

      if (this.globalobjects.userDetails.homeObjectCode == event.calling_object_code) {
        this.isSameObject = true
      }
      nextPageInfo.wscp = JSON.parse(JSON.stringify(this.wscp));
      nextPageInfo.wscp.previousObj = this.object_mast.object_code;
      // nextPageInfo.page_no = this.page_no;


      if (event.calling_parameter_str) {
        if (event.calling_parameter_str.toLowerCase().indexOf('no_back') > -1) {
          nextPageInfo.no_back = true;
        }

        if (event.calling_parameter_str.toLowerCase().indexOf('popup') > -1) {
          let callingArr = event.calling_parameter_str.split(';');
          for (let c of callingArr) {
            if (c.toLowerCase().indexOf('popup(') > -1) {
              nextPageInfo.popoverStyle = c;
            }
          }
          nextPageInfo.popup_class = event.popup_class ? event.popup_class : '';
          nextPageInfo.wscp.flag = 'P'
        } else if (event.calling_parameter_str.toLowerCase().indexOf('offcanvas') > -1) {
          let callingArr = event.calling_parameter_str.split(';');
          for (let c of callingArr) {
            if (c.toLowerCase().indexOf('offcanvas(') > -1) {
              nextPageInfo.popoverStyle = c;
            }
          }
          nextPageInfo.wscp.flag = 'O'
        }

      }
      if (event.isQuickSearch && this.plt != 'browser') {
        nextPageInfo.wscp.flag = 'M'
      } else if (this.isModal == 'P') {
        nextPageInfo.wscp.flag = 'P'
      }

      let itemName = event.apps_page_frame_seqid + '.' + event.item_name;
      let item = this.lhs_lib.get_item(itemName, event.indexcount, true);
      // event.calling_object_code = item.calling_object_code;
      let log_name = `get_object_config_${event.item_name}`;

      if (event.item_name == "SYS_GLOBAL_SEARCH") {
        nextPageInfo.noBreadcrumbAdd = true
      }
      if (item) {
        if (item.calling_object_code || objCode) {
          this.globalobjects.show_event_loading(event);
          this.globalobjects.isGetObjectConfig.set(true);
          if (nextPageInfo.wscp && item) {
            let keysArr = Object.keys(nextPageInfo.wscp);

            for (let k of keysArr) {
              if (item[k] && k.toLowerCase() != 'flag') {
                nextPageInfo.wscp[k] = item[k];
              }
            }
            nextPageInfo.wscp.object_code = item.calling_object_code;
          }


          if (objCode) {
            nextPageInfo.wscp.object_code = objCode.toUpperCase();
          }

          nextPageInfo.wscp.apps_page_frame_seqid = item.apps_page_frame_seqid;
          nextPageInfo.wscp.apps_item_seqid = item.apps_item_seqid;
          nextPageInfo.wscp.template_apps_item_seqid = item.template_apps_item_seqid;
          nextPageInfo.wscp.orignal_apps_page_frame_seqid = nextPageInfo.wscp.orignal_apps_page_frame_seqid != undefined ? nextPageInfo.wscp.orignal_apps_page_frame_seqid : event.apps_page_frame_seqid;
          nextPageInfo.wscp.orignal_apps_item_seqid = nextPageInfo.wscp.orignal_apps_item_seqid != undefined ? nextPageInfo.wscp.orignal_apps_item_seqid : event.apps_item_seqid;
          nextPageInfo.wscp.orignal_object_code = nextPageInfo.wscp.orignal_object_code != undefined ? nextPageInfo.wscp.orignal_object_code : event.object_code;
          nextPageInfo.wsdpcl = event.wsdpcl;
          nextPageInfo.isTab = false;


          if (this.globalobjects.logFlag) {
            let name = "get_object_config S2U";
            let ws_type = "get_object_config";
            let status = "start"
            const seq = this.lhs_lib.start();
            // this.globalobjects.log_event_slno=parseFloat((this.globalobjects.log_event_slno + 0.1).toFixed(1));
            // let obj={
            //   name:log_name,
            //   slno:this.globalobjects.log_event_slno
            // }
            // this.globalobjects.log_event_slno_check_array.push(obj)
            // this.lhs_lib.get_event_log_obj(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, "start",ws_type,this.globalobjects.log_event_slno);
            this.lhs_lib.get_event_log_objs(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, status, ws_type, log_name, seq);
          }
          // if (event && event && event.open_new_page) {
          //   delete event['open_new_page'];
          //   this.canvasModal.popDismiss(event);
          //   // this.get_object_config(detail.data)
          //   // this.openPage(detail.data);
          // }

          if (type && type.toLowerCase() == "tab" && this.plt) {
            this.clearQue();
            nextPageInfo.isTab = true;
            // this.openObject.emit(nextPageInfo);

            if (!this.globalobjects.lazyLoading) {
              this.events.publish("openTab", nextPageInfo);
            } else {
              this.globalobjects.ShowLoadingSide();
              this.getPageInfo(nextPageInfo).then((data) => {
                this.globalobjects.ShowLoadingTab()
                if (this.globalobjects.logFlag) {
                  let name = "get_object_config S2U";
                  let ws_type = "get_object_config";
                  let status = "end";
                  this.lhs_lib.end();
                  //  let logsData=this.globalobjects.log_event_slno_check_array.find((arr)=>arr.name==log_name)

                  //         this.lhs_lib.get_event_log_obj(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, "end",ws_type,logsData.slno)
                  this.lhs_lib.get_event_log_objs(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, status, ws_type, log_name);
                }
                if (this.isSameObject) {
                  this.isSameObject = false
                }
                if (this.isModal == 'P') {
                  this.modalClick()
                }
                this.globalobjects.hideLoadingSide();
                nextPageInfo.object_mast = data;
                nextPageInfo.click_events_str = "LOAD_NEW_OBJECT";
                // this.clickEvent = event;

                // this.openPage(nextPageInfo);
                // this.openObject.emit(nextPageInfo);
                if (event.menuClick) {
                  nextPageInfo.menuTabOpen = true
                  for (let [i, dt] of this.lhs_lib.dynamicTabs.entries()) {
                    if (dt.instance.menuTabOpen) {
                      let obj = {
                        tab: dt,
                        index: i + 1
                      }
                      this.events.publish("closeTab", obj);

                    }
                  }
                }
                this.events.publish("openTab", nextPageInfo);
              });
            }
          } else {

            nextPageInfo.activeTabIndex = this.lhs_lib.activeTabIndex()
            this.dataService.terminateAllRequest();
            this.unSubscribeSuperParent()
            // this.openPage(nextPageInfo);

            if (!this.globalobjects.lazyLoading) {
              this.openPage(nextPageInfo);
            } else {
              this.globalobjects.ShowLoadingSide();
              this.getPageInfo(nextPageInfo).then((data) => {
                this.globalobjects.ShowLoadingTab()
                if (this.globalobjects.logFlag) {
                  let name = "get_object_config S2U";
                  let ws_type = "get_object_config";
                  let status = "end";
                  this.lhs_lib.end();
                  //  let logsData=this.globalobjects.log_event_slno_check_array.find((arr)=>arr.name==log_name)

                  //         this.lhs_lib.get_event_log_obj(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, "end",ws_type,logsData.slno)
                  this.lhs_lib.get_event_log_objs(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, status, ws_type, log_name);
                }

                //         this.lhs_lib.get_event_log_obj(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, "end",ws_type,logsData.slno)

                if (this.isSameObject) {
                  this.isSameObject = false
                }
                if (event.isQuickSearch && this.plt != 'browser') {
                  this.modalClick();
                  delete event['isQuickSearch'];
                }
                this.globalobjects.hideLoadingSide();
                nextPageInfo.object_mast = data;
                nextPageInfo.click_events_str = "LOAD_NEW_OBJECT";
                // this.clickEvent = event;
                this.openPage(nextPageInfo);
              });
            }
            // console.log("");
          }


        } else {

        }
      } else {

        nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
        nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
        nextPageInfo.wscp.template_apps_item_seqid = event.template_apps_item_seqid ? event.template_apps_item_seqid : null;
        nextPageInfo.wscp.orignal_apps_page_frame_seqid = nextPageInfo.wscp.orignal_apps_page_frame_seqid != undefined ? nextPageInfo.wscp.orignal_apps_page_frame_seqid : event.apps_page_frame_seqid;
        nextPageInfo.wscp.orignal_apps_item_seqid = nextPageInfo.wscp.orignal_apps_item_seqid != undefined ? nextPageInfo.wscp.orignal_apps_item_seqid : event.apps_item_seqid;
        nextPageInfo.wscp.orignal_object_code = nextPageInfo.wscp.orignal_object_code != undefined ? nextPageInfo.wscp.orignal_object_code : event.object_code;
        nextPageInfo.wscp.object_code = event.object_code;

        nextPageInfo.wsdpcl = event.wsdpcl;
        nextPageInfo.isTab = false;
        this.globalobjects.show_event_loading(event);
        this.globalobjects.isGetObjectConfig.set(true);
        // if (event && event && event.open_new_page) {
        //   delete event['open_new_page'];
        //   this.canvasModal.popDismiss(event);
        //   // this.get_object_config(detail.data)
        //   // this.openPage(detail.data);
        // }

        if (this.globalobjects.logFlag) {
          let name = "get_object_config S2U";
          let ws_type = "get_object_config";
          let status = "start";
          const seq = this.lhs_lib.start();
          // this.globalobjects.log_event_slno=parseFloat((this.globalobjects.log_event_slno + 0.1).toFixed(1));
          //   let obj={
          //     name:log_name,
          //     slno:this.globalobjects.log_event_slno
          //   }
          //   this.globalobjects.log_event_slno_check_array.push(obj)
          // this.lhs_lib.get_event_log_obj(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, "start",ws_type)
          this.lhs_lib.get_event_log_objs(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, status, ws_type, log_name, seq);
        }

        if (type && type.toLowerCase() == "tab" && this.plt) {
          this.clearQue();
          nextPageInfo.isTab = true;
          // this.openObject.emit(nextPageInfo);


          if (!this.globalobjects.lazyLoading) {
            this.events.publish("openTab", nextPageInfo);
          } else {
            this.getPageInfo(nextPageInfo).then((data) => {
              this.globalobjects.ShowLoadingTab()
              if (this.globalobjects.logFlag) {
                let name = "get_object_config S2U";
                let ws_type = "get_object_config";
                let status = "end";
                this.lhs_lib.end();
                //  let logsData=this.globalobjects.log_event_slno_check_array.find((arr)=>arr.name==log_name)

                //       this.lhs_lib.get_event_log_obj(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, "end",ws_type,logsData.slno)
                this.lhs_lib.get_event_log_objs(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, status, ws_type, log_name);
              }

              if (this.isModal == 'P') {
                this.modalClick()
              }
              this.globalobjects.ShowLoadingSide();
              this.globalobjects.hideLoadingSide();
              nextPageInfo.object_mast = data;
              nextPageInfo.click_events_str = "LOAD_NEW_OBJECT";
              // this.clickEvent = event;
              // this.openPage(nextPageInfo);
              // this.openObject.emit(nextPageInfo);

              if (this.isSameObject) {
                this.isSameObject = false
              }
              if (event.menuClick) {
                nextPageInfo.menuTabOpen = true
                for (let [i, dt] of this.lhs_lib.dynamicTabs.entries()) {
                  if (dt.instance.menuTabOpen) {
                    let obj = {
                      tab: dt,
                      index: i + 1
                    }
                    this.events.publish("closeTab", obj);

                  }
                }
              }
              this.events.publish("openTab", nextPageInfo)

            });
          }
        } else {

          nextPageInfo.activeTabIndex = this.lhs_lib.activeTabIndex()
          this.dataService.terminateAllRequest();
          this.unSubscribeSuperParent()
          // this.openPage(nextPageInfo);

          if (!this.globalobjects.lazyLoading) {
            this.openPage(nextPageInfo);
          } else {

            this.globalobjects.ShowLoadingSide();
            this.getPageInfo(nextPageInfo).then((data) => {
              this.globalobjects.ShowLoadingTab()
              if (this.globalobjects.logFlag) {
                let name = "get_object_config S2U";
                let ws_type = "get_object_config";
                let status = "end";
                this.lhs_lib.end();
                //  let logsData=this.globalobjects.log_event_slno_check_array.find((arr)=>arr.name==log_name)

                //       this.lhs_lib.get_event_log_obj(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, "end",ws_type,logsData.slno)
                this.lhs_lib.get_event_log_objs(name, nextPageInfo.wscp.apps_page_frame_seqid, nextPageInfo.wscp.apps_item_seqid, nextPageInfo.wscp.object_code, status, ws_type, log_name);
              }
              if (this.isSameObject) {
                this.isSameObject = false
              }
              if (event.isQuickSearch && this.plt != 'browser') {
                this.modalClick();
                delete event['isQuickSearch'];
              }
              this.globalobjects.hideLoadingSide();
              nextPageInfo.object_mast = data;
              nextPageInfo.click_events_str = "LOAD_NEW_OBJECT";
              // this.clickEvent = event;
              this.openPage(nextPageInfo);
            });
          }
          // console.log("");
        }
      }
      // this.globalobjects.hideLoadingNew();
    }

  }



  appClearFrame(event, str) {

    let frameId = event.click_events_arr[event.click_events_count].split("(")[1].split(")")[0].replaceAll("'", "").replaceAll("\"", "");
    this.app_clear_frame(frameId);

    // if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, str);
    // }

  }



  app_clear_frame(frameName) {
    let frame = this.lhs_lib.get_frame_config(frameName);

    if (frame) {
      frame.tableRows = [];
      frame.canvasRows = [];
      if (frame.apps_frame_type != 'TABLE') {
        frame.headers = [];
      }
      if (frame && frame.frame_alias == "DISP_COL") {
        delete frame["iskeyFIlterFlagDataToggle"]
      }
      delete frame['new_record_index'];
      delete frame['indexStr'];
      delete frame['edit_record_index'];
      let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));

      if (this.sessionObj) {
        for (let itemGroup of frameLevel4) {
          for (let item of itemGroup.Level5) {
            if (item.session_hold_flag == 'T') {
              item.value = this.sessionObj[item.item_name];
              item.isValid = true;
            }
          }
        }
      }

      if (frame.apps_frame_type && frame.apps_frame_type.indexOf('CHART(') > -1) {
        frame.chartData = [];
      } else if (frame.apps_frame_type && frame.apps_frame_type == 'TIMELINE_GRAPH') {
        frame.tableRows = [];
      } else {
        if (frame.apps_frame_type && (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE')) {
          if (frame.display_no_of_records) {
            for (let i = 0; i < frame.display_no_of_records; i++) {
              frame.tableRows[i] = JSON.parse(JSON.stringify(frameLevel4));
            }
          } else if (frame.apps_frame_type != 'TABLE') {
            frame.tableRows = [];
            frame.tableRows[0] = frameLevel4;
          }
        } else {
          frame.tableRows[0] = frameLevel4;
        }
      }

      delete frame['edit_record_index'];
      delete frame['executing_index'];
      this.processData.afterTableRows(frame);
      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
    } else {
      alert("Frame not found");
    }
    // this.lhs_lib.getSepratorGrp(frame);
    // this.processData.setPromptColTableRows(frame);

    // this.events.publish("refreshContainer" + frame.apps_page_frame_seqid, { evFlag: "T" });
    // this.events.publish("refreshSummRow" + frame.apps_page_frame_seqid, { evFlag: "T" });
  }

  isAsyncFunction(func: Function): boolean {
    return func.constructor.name === "AsyncFunction";
  }

  async app_execute_item(event, name, str, index?, isTemp?, changeActiveRow?, initialParam = event): Promise<any> {

    let flag = true;
    // if (name && name.toLowerCase().includes("frame_record_")) {
    //   if(this.lhs_lib.sys_last_frame && this.lhs_lib.sys_last_item && (this.lhs_lib.sys_last_rownumber != undefined)){

    //   }
    // }

    if (flag) {

      if (!name) return;
      let leve4Item = this.lhs_lib.get_level4_item(name);

      let frameName;
      if (name.indexOf("::") > -1) {
        name = name.split("::")[1];
      } if (name.indexOf(":") > -1) {
        name = name.split(":")[1];
      }

      if (name.indexOf(".") > -1) {
        let nameArr = name.split(".");

        if (nameArr.length > 2) {
          frameName = nameArr[0];
          nameArr.splice(0, 1)
        } else {
          frameName = nameArr[0];
        }
      }

      if (leve4Item) {

        let frame = this.lhs_lib.get_frame_config(frameName ?? leve4Item.apps_page_frame_seqid);
        let flag;
        if (index == undefined) {
          if (frame.executing_index != undefined) {
            index = frame.executing_index;
          } else {
            index = frame.active_row ?? 0;
            flag = true;
          }
        } else {
          index = index && typeof (index) == 'string' && (index.toLowerCase().includes("current_record") || index.toLowerCase().includes("wma_record_index")) ? (frame.executing_index != undefined ? frame.executing_index : (frame.active_row ?? 0)) : index;
        }

        if (changeActiveRow) {
          frame.active_row = index;
        }

        let item = this.lhs_lib.get_item(name, index, flag, true);
        if (item) {
          let copyItem = JSON.parse(JSON.stringify(item));
          item.executed_item = true;
          delete item['rase'];
          if (!index || index == null || index == "null") {
            index = 0;
          }
          item.itemIndex = item.indexcount;
          item.click_events_arr = [];
          let eventArr = [];
          let eventStr = "";

          if (item && item.item_name.toUpperCase() == 'PB_NFI') {
            initialParam = item;
          }

          if (str.toLowerCase() == "click_events_str") {
            if (initialParam && initialParam.item_name?.toUpperCase() == 'PB_NFI' && item.orignal_click_events_str) {
              eventStr = item.orignal_click_events_str != undefined ? item.orignal_click_events_str.replaceAll(" ", "").replace(/\n|\r/g, "") : "";
            } else {
              eventStr = item.click_events_str ? item.click_events_str.replaceAll(" ", "").replace(/\n|\r/g, "") : "";
            }
            // item.itemClicked = "pre";
          } else if (str.toLowerCase() == "post_events_str") {
            eventStr = item.post_events_str ? item.post_events_str.replaceAll(" ", "").replace(/\n|\r/g, "") : "";
          } else if (str.toLowerCase() == "on_load_events_str") {
            eventStr = item.on_load_events_str ? item.on_load_events_str.replaceAll(" ", "").replace(/\n|\r/g, "") : "";
          } else {
            eventStr = str;
          }

          eventArr = eventStr ? (eventStr.includes(";") ? eventStr.split(";") : [eventStr]) : [];

          let i = 0;
          for await (let e of eventArr) {
            if (e && this.globalobjects.logFlag) {

              if (!this.object_mast.logdata) {
                this.object_mast.logdata = []
              }
              item.id = parseInt((Math.random() * 1000).toString());
              item.parentId = event.id ? event.id : null;
              let obj = this.lhs_lib.get_log_obj(item, e);
              this.object_mast.logdata.push(obj);
            }

            try {
              if (item.rase || event.rase) {
                this.clearQue();
                this.globalobjects.setFocus(true);
                throw new Error('Code Raised');
              } else {
                if (e.toLowerCase() == "execute_item_plsql" || e.toLowerCase() == "ora_plsql1_text" || e.toLowerCase() == "ora_plsql2_text" || e.toLowerCase() == "ora_plsql1_text_force" || e.toLowerCase() == "ora_plsql2_text_force") {
                  let nextPageInfo = {
                    wscp: {
                      apps_page_frame_seqid: item.apps_page_frame_seqid,
                      apps_item_seqid: item.apps_item_seqid,
                      apps_page_no: item.apps_page_no,
                      object_code: item.object_code,
                      service_type: e.replace("_force", "")
                    }
                  };

                  if (item.value || str.toLowerCase() != "post_events_str" || e.includes("_force")) {
                    let ret = await this.execute_plsql(nextPageInfo, item, "");
                    if (ret && ret.toLowerCase() == 'raise') { item.rase = true };
                  }

                } else if (e.toLowerCase() == "app_plsql1_clob" || e.toLowerCase() == "app_plsql2_clob" || e.toLowerCase() == "app_plsql1_text" ||
                  e.toLowerCase() == "app_plsql2_text" || e.toLowerCase() == "app_plsql1_text_force" || e.toLowerCase() == "app_plsql2_text_force") {


                  if (item.value || str.toLowerCase() != "post_events_str" || e.includes("_force")) {
                    let strs = item[e.toLowerCase().replace("_force", "")];
                    if (strs) {
                      let value = this.convert_plsq_js.getConvertedScript(strs);
                      await this.execute_js(value, item, e);
                    }
                  }

                } else if (e.toLowerCase() == "app_js1_text" || e.toLowerCase() == "app_js2_text"
                  || e.toLowerCase() == "app_js1_text_force" || e.toLowerCase() == "app_js2_text_force") {

                  if (item.value || str.toLowerCase() != "post_events_str" || e.includes("_force")) {
                    let strs = item[e.toLowerCase().replace("_force", "")];
                    if(strs.includes('ajs_')){
                      strs = strs.replaceAll("ajs_", "utilvar.dynamic_func.ajs_");;
                    }
                    await this.execute_js(strs, item, e);
                  }

                } else if (e.toLowerCase().includes("get_object_config") || e.toLowerCase().includes("app_next_page")
                  || e.toLowerCase().includes("app_open_page") || e.toLowerCase().includes("app_back_page")) {

                  if (e.includes("app_back_page")) {
                    console.log("app_execute_item app_back_page run ======>>>>>>>>>>>", name, str, event, item);
                  }
                  item.click_events_arr = [e];
                  item.click_events_count = 0;
                  // this.itemClicked1(item, e);
                  await this.itemClicked_new(item, item.click_events_arr)
                  return;
                } else {

                  let strs = this.lhs_lib_util(e, item);
                  if (e && e.toLowerCase().includes('validate_lov')) {
                    strs = 'this.validate_lov(item)';
                    if ((item.lovValue != undefined && item.value != undefined && item.lovValue.toLowerCase() == item.value.toLowerCase()) || (item.value == undefined || item.value == null || item.value == "") || (item.oldValue == item.value)) {
                      continue;
                    }
                  }
                  if (strs) {
                    const supercomp=this
                    strs = strs.replaceAll("await ", " ");
                    strs = strs.replaceAll("event,", "item,");
                    strs = strs.replaceAll("this.", "supercomp.");
                    if (strs.toLowerCase().includes("app_execute_item")) {
                      let evArr = strs.split(",");

                      if (evArr.length == 3) {
                        strs = strs.replace(")", `,undefined,undefined,undefined,initialParam)`);
                      } else if (evArr.length == 4) {
                        strs = strs.replace(")", `,undefined,undefined,initialParam)`);
                      } else if (evArr.length == 5) {
                        strs = strs.replace(")", `,undefined,initialParam)`);
                      } else if (evArr.length == 6) {
                        strs = strs.replace(")", `,initialParam)`);
                      }
                    }
                    // strs = strs.replaceAll("click_items_str", "click_events_str");
                    try {

                      // if(strs.includes("app_execute_item(") || strs==""){
                      //   ret= eval(strs);
                      // }else{
                      //   ret= await eval(strs);
                      // }
                      // this.ngZone.run(async () => {

                      try {


                        let ret = await eval(strs);
                        this.ngZone.run(() => {
                          if (ret && ret.toLowerCase() == 'raise') { item.rase = true };
                          // this.appRef.tick()
                        })
                      } catch (e) {
                        this.ngZone.run(() => {
                          console.log("eroorrrrrrrr ===>>" + e);
                          // this.appRef.tick()
                        })

                      }

                      // });
                    } catch (e) {
                      this.ngZone.run(() => {
                        console.log("eroorrrrrrrr ===>>" + e);
                        // this.appRef.tick()
                      })
                    }
                  }
                }
              }


            } catch (error) {
              if (error.message === 'Code Raised') {

                this.ngZone.run(() => {
                  console.log(error);
                  // this.appRef.tick()
                })
              } else {
                console.log(error);
                alert(error);
              }
            }
            i++;
          }


          // console.log(this.object_mast.logdata);
          item.click_events_arr = copyItem.click_events_arr;
          item.click_events_count = copyItem.click_events_count;
        }


        if (isTemp) {
          event.click_events_arr.splice(event.click_events_count, 1);
          event.click_events_count = event.click_events_count - 1;
        }

        if (item.rase) {
          event.rase = true;
          this.clearQue();
        } else {
          // if (event.click_events_arr) {
          //   if (event.click_events_arr.length > (event.click_events_count + 1)) {
          //     event.click_events_count = event.click_events_count + 1;
          //     this.itemClicked1(event, "");
          //   }
          // }
        }

      }
    } else {

      return;
      // if (event.click_events_arr) {
      //   if (event.click_events_arr.length > (event.click_events_count + 1)) {
      //     event.click_events_count = event.click_events_count + 1;
      //     this.itemClicked1(event, "");
      //   }
      // }
    }

    // return;

  }

  async app_execute_frame(nextPageInfo, frameName, value, clickEventStr?): Promise<any> {

    let frame = this.lhs_lib.get_frame_config(frameName);
    if (frame) {

      if (frame.object_code != this.object_mast.object_code) {
        this.object_mast = this.lhs_lib.object_mast;
      }

      delete frame["click_events_arr"];
      delete frame["click_events_count"];
      delete frame['indexStr'];
      delete frame['edit_record_index'];

      frame.isExecuting = true;
      if (value) {

        value = value.includes(";") ? value.split(";")[0] : value;
        // let parseFrame = JSON.parse(JSON.stringify(frame));

        // parseFrame.apps_page_frame_seqid = frame.apps_page_frame_seqid;
        let parseFrame = JSON.parse(JSON.stringify(nextPageInfo));
        parseFrame.executing_apps_page_frame_seqid = frame.apps_page_frame_seqid;
        parseFrame.click_events_arr = [];
        delete parseFrame["click_events_count"];

        if (frame.apps_frame_sub_type && (frame.apps_frame_sub_type.toUpperCase() == 'SINGLE_ROW' || frame.apps_frame_sub_type.toUpperCase() == 'SINGLE_ROW_BLANK' || frame.no_of_records == '1')) {
          let tempFrame = this.lhs_lib.get_frame_config(frame.apps_page_frame_seqid + 'A');
          if (tempFrame) {
            tempFrame.tableData = [];
            tempFrame.tableRows = [];
            tempFrame.canvasRows = [];
            if (!tempFrame.Level4 || tempFrame.Level4.length < 1) {
              tempFrame.Level4 = this.lhs_lib.get_ass_Level4(frame.apps_page_frame_seqid + 'A');
            }

            if (tempFrame.Level4 && tempFrame.Level4.length > 0) {
              tempFrame.tableRows[0] = JSON.parse(JSON.stringify(tempFrame.Level4));
              this.processData.afterTableRows(tempFrame);
            }
          }
        }

        if (value.toLowerCase() == "itemwise_sql_populate_data" || value.toLowerCase() == "item_frame_sql_populate_data" || value.toLowerCase() == "app_gsp_service()" ||
          value.toLowerCase() == "execute_query" || value.toLowerCase() == "frame_sql_populate_data" || value.toLowerCase() == "execute_query_once") {
          if (value.toLowerCase() == "execute_query_once") {
            if (parseFrame.executedQuery) {
              // if (nextPageInfo.click_events_arr) { } else {
              //   await this.getData(parseFrame, 'execute_query');
              //   delete parseFrame['executing_apps_page_frame_seqid'];
              // }
            } else {
              await this.getData(parseFrame, 'execute_query');
              delete parseFrame['executing_apps_page_frame_seqid'];
            }
          } else if (value.toLowerCase() == "app_gsp_service()") {
            await this.getData(parseFrame, "gsp_service");
            delete parseFrame['executing_apps_page_frame_seqid'];
          } else {
            await this.getData(parseFrame, value);
            delete parseFrame['executing_apps_page_frame_seqid'];
          }
        } else if (value.toLowerCase().includes("populate_from_procedure(")) {
          let service_type = value;

          var regex4 = new RegExp("populate_from_procedure", "ig");
          var replace = "populate_from_procedure(";

          let arr = service_type.match(regex4);
          for (let a of arr) {
            let fun = a + "("
            service_type = service_type.replaceAll(replace, fun).replaceAll(fun, replace);
          }

          let str = service_type.split("populate_from_procedure(")[1].split(")")[0];
          this.wscp.procedure_name = str + ")";
          await this.getData(parseFrame, 'populate_from_procedure');
          delete parseFrame['executing_apps_page_frame_seqid'];
        } else if (value.toLowerCase().includes("populate_from_procedure_rc(")) {
          let service_type = value;

          var regex4 = new RegExp("populate_from_procedure_rc", "ig");
          var replace = "populate_from_procedure_rc(";

          let arr = service_type.match(regex4);
          for (let a of arr) {
            let fun = a + "("
            service_type = service_type.replaceAll(replace, fun).replaceAll(fun, replace);
          }

          let str = service_type.split("populate_from_procedure_rc(")[1].split(")")[0];
          this.wscp.procedure_name = str + ")";
          await this.getData(parseFrame, 'populate_from_procedure_rc');
          delete parseFrame['executing_apps_page_frame_seqid'];
        } else if (value.toLowerCase() == "all_itemwise_sql_populate_data") {

          let frameName = parseFrame.executing_apps_page_frame_seqid ? parseFrame.executing_apps_page_frame_seqid : parseFrame.apps_page_frame_seqid;
          this.getItemwiseData(frameName, parseFrame);

        } else {
          this.parseBuiltins(frame);
        }

        // if (nextPageInfo.click_events_arr && !parseFrame.rase) {
        //   if (nextPageInfo.click_events_arr.length > (nextPageInfo.click_events_count + 1)) {
        //     nextPageInfo.click_events_count = nextPageInfo.click_events_count + 1;
        //     this.itemClicked1(nextPageInfo, clickEventStr);
        //   }
        // }

        if (parseFrame.rase || nextPageInfo.rase) {
          this.clearQue();
          this.globalobjects.setFocus(true);
          throw new Error('Code Raised');
        }

      }
    }

    return;
  }

  set_dp_for_cb(frameName, item, val) {
    let frame = this.lhs_lib.get_frame_config(frameName);
    frame.call_frame_CB = frameName;
    frame.callingItm_CB = item;
    frame.item_CB_value = val;
  }

  async execute_json(to, from, type, where?, having?) {
    let fromFrame = this.lhs_lib.get_frame_config(from);
    let toFrame = this.lhs_lib.get_frame_config(to);

    if (fromFrame && toFrame) {
      let data = [];
      if (fromFrame && fromFrame.searchableRawData && fromFrame.searchableRawData.length > 0) {
        data = this.lhs_lib.execute_json(fromFrame.searchableRawData, toFrame, where, having);

      } else {
        let frameData = fromFrame.tableData;
        if (fromFrame.tempRows && fromFrame.tempRows.length > 0) {
          frameData = this.lhs_lib.get_temp_data(fromFrame.tempRows);
        }
        data = this.lhs_lib.execute_json(frameData, toFrame, where, having);
      }

      toFrame.search_status = toFrame.search_status ? toFrame.search_status : 'N';
      toFrame.tableData = data;
      toFrame.executed_from = from;

      toFrame.loading = true;

      // toFrame.tableRows ? toFrame.tableRows = [] : '';
      // toFrame.canvasRows ? toFrame.canvasRows = [] : '';
      // toFrame.tableData ? toFrame.tableData = [] : '';
      // if (toFrame.searchableData) {
      //   toFrame.searchableData = []
      //   toFrame.searchableRawData = []
      // }
      await this.processData.populateRows(toFrame.apps_page_frame_seqid, data, null, null, null, 5);

      toFrame.loading = false;

      if (toFrame.apps_frame_type == 'CHART') {
        let name = "refreshGraph_" + toFrame.apps_page_frame_seqid;
        let obj = {
          evFlag: "T",
        }
        this.events.publish(name, obj);
      }

      if (type && type.toLowerCase() == 'relation') {
        let str = `execute_json('${to}','${from}','${type}'${where ? ",'" + where + "'" : ""}${having ? ",'" + having + "'" : ""});`;

        if (fromFrame.json_related_frames) {
          if (!fromFrame.json_related_frames.includes(str)) {
            fromFrame.json_related_frames = fromFrame.json_related_frames + str;
          }
        } else {
          fromFrame.json_related_frames = str;
        }
      }

      this.lhs_lib.refreshFrames[toFrame.apps_page_frame_seqid] = "Y";
      this.lhs_lib.refresh_frames();
      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
    }

  }

  async openOtpPop(componentProps) {
    let popUp = await this.popOverCtrl.create({
      component: SuperPage,
      animated: false,
      componentProps: {
        otpFlag: true,
        id: "globalPopover",
        otpFrameObjCode: this.object_mast.Level2[this.page_no].object_code
      },
      backdropDismiss: true
    });




    popUp.onDidDismiss().then((details: OverlayEventDetail) => {
      // this.lhs_lib.object_mast = this.object_mast;
      this.afterDestroy();
      if (details.data.verifiedFlag == "F") {
        this.globalobjects.presentAlert("Please Enter A Valid Otp");
      } else if (details.data.verifiedFlag == "T") {
        this.openPage(componentProps);
      }
        if(!this.plt){
        this.mobileViewQuickAction();
      }
    });
    return await popUp.present();
  }

  closeAllModal(nextPageInfo?) {
    if (nextPageInfo) {
      if (this.globalobjects.frameSeqId) {
        if (nextPageInfo.wscp.apps_page_frame_seqid == this.globalobjects.frameSeqId) {
          //  nextPageInfo.object_mast = [];
          this.globalobjects.frameSeqId = "";
          this.ngOnInit();
          //  this.openPage(nextPageInfo);
        } else {
          this.modalCtrl.dismiss();
        }
      }
    } else {
      this.modalCtrl.dismiss();
    }
  }

  openFileOnServer(event) {
    if (this.platform.is('android')) {
      this.globalobjects.checkStoragePermission().then((res) => {
        if (res == 'success') {
          // this.download(event);
          this.pluginService.download(event);
          // this.pluginService.download(event);
        } else {
          this.globalobjects.presentAlert("Please grant storage permission to download file.")
        }
      })
    } else {
      // this.download(event);
      this.pluginService.download(event);
    }
  }

  sendEmailJava(event, clickEventStr) {
    event.item_enable_flag = 'F'
    let a = this.object_mast;
    let ccMail = "";
    let toMail = "";
    let bccMail = "";
    let body = "";
    let mobile = "";
    let attachment = "";
    let subject = "";
    for (let obj of a.Level2) {
      for (let obj1 of obj.Level3) {
        if (event.apps_page_frame_seqid == obj1.apps_page_frame_seqid) {
          for (let obj2 of obj1.tableRows) {
            for (let obj3 of obj2) {
              for (let obj4 of obj3.Level5) {

                if (obj4.item_name == "CC_MAIL") {
                  ccMail = obj4.value;
                }
                else if (obj4.item_name == "BCC_MAIL") {
                  bccMail = obj4.value;
                }
                else if (obj4.item_name == "TO_MAIL") {
                  toMail = obj4.value;
                } else if (obj4.item_name == "MOBILENO" || obj4.item_name == "MOBILE_NUMBER") {
                  mobile = obj4.value;
                }
                else if (obj4.item_name == "ATTCH" || obj4.item_name == "ATTACHMENT") {
                  attachment = obj4.value;
                }
                else if (obj4.item_name == "EMAIL_BODY") {
                  body = obj4.value;
                }
                else if (obj4.item_name == "SUBJECT") {
                  subject = obj4.value;
                }
              }
            }
          }

        }
      }
    }
    let url = "sendEmail";
    let reqData = {
      "parameters": {
        "to_mail": toMail,
        "cc_mail": ccMail,
        "bcc_mail": bccMail,
        "subject": subject,
        "body": body
      }
    };
    this.dataService.postData(url, reqData).then((res: any) => {
      event.item_enable_flag = 'T'
      if (res.responseStatus == "success") {
        alert(res.responseMsg);
        this.popOverCtrl.dismiss();

      } else {
        alert(res.responseMsg)
      }
      // if (event.click_events_arr.length > (event.click_events_count + 1)) {
      //   event.click_events_count = event.click_events_count + 1;
      //   this.itemClicked1(event, clickEventStr);
      // }

    }, (err) => {
      alert("Server error...");
      event.item_enable_flag = 'T'
      // if (event.click_events_arr.length > (event.click_events_count + 1)) {
      //   event.click_events_count = event.click_events_count + 1;
      //   this.itemClicked1(event, clickEventStr);
      // }

    })
  }

  // download(event) {
  //   // if (event.item_name == "FILE_PATH") {

  //   let filePath = event.obj.value.replace(/\\/g, "/").replace(/'/g, '');
  //   let filename = filePath.split("/").reverse()[0];
  //   let fileExtn = filename.split('.').reverse()[0];
  //   let fileMIMEType = this.getMIMEtype(fileExtn);
  //   let downloadUrl = this.globalobjects.getScopeUrl() + 'downloadAnyFile?file=' + filePath;
  //   // let downloadUrl = "http://203.193.167.118:8888/lhsws/NW/192.168.100.173/1521/LWEBERP/LWEBERP/ORA10G/downloadFile?file=C:/ugk_w/house/invoice/NC20Y-00006.pdf";
  //   let path = "";
  //   if (this.platform.is("ios")) {
  //     path = this.file.documentsDirectory;
  //   }
  //   if (this.platform.is("android")) {
  //     path = this.file.externalRootDirectory;
  //   }


  //   this.globalobjects.displayCordovaToast("Please wait download started...");
  //   this.makeXmlHttpReq(downloadUrl).then((data: any) => {

  //     if (this.platform.is('ios') || this.platform.is('android')) {

  //       this.file.checkDir(path, 'LHSAPP').then((res) => {
  //         path = path + '/LHSAPP/'
  //         this.file.writeFile(path, filename, data, { replace: true }).then(data => {
  //           // alert("file saved..."+data);
  //           this.globalobjects.displayCordovaToast("Download complete...");
  //           if (this.platform.is('ios')) {
  //             this.document.viewDocument(path + filename, fileMIMEType, {});
  //           } else {

  //             // this.fileOpener.open(path + filename, fileMIMEType)
  //             //   .then(() => {
  //             //     //console.log('File is opened'))
  //             //   })
  //             //   .catch(e => {
  //             //     this.globalobjects.presentAlert("file is" + JSON.stringify(e))
  //             //   });
  //           }
  //         }, (error) => {
  //           alert('Error occured while saving file. Please check storage permission and try again.')
  //         });
  //       }, (err) => {
  //         this.file.createDir(path, 'LHSAPP', true).then((res) => {
  //           path = path + '/LHSAPP/'
  //           this.file.writeFile(path, filename, data, { replace: true }).then(data => {
  //             // alert("file saved..."+data);
  //             this.globalobjects.displayCordovaToast("Download complete...");
  //             if (this.platform.is('ios')) {
  //               this.document.viewDocument(path + filename, fileMIMEType, {});
  //             } else {

  //               // this.fileOpener.open(path + filename, fileMIMEType)
  //               //   .then(() => {
  //               //     //console.log('File is opened')
  //               //   })
  //               //   .catch(e => this.globalobjects.presentAlert("file is" + JSON.stringify(e)));
  //             }
  //           }, (error) => {
  //             alert('Error occured while saving file. Please check storage permission and try again.')
  //           });
  //         }, (err) => {
  //           // alert("Create err: "+JSON.stringify(err));
  //           path = this.file.dataDirectory;
  //           this.file.writeFile(path, filename, data, { replace: true }).then(data => {
  //             // alert("file saved..."+data);
  //             this.globalobjects.displayCordovaToast("Download complete...");
  //             if (this.platform.is('ios')) {
  //               this.document.viewDocument(path + filename, fileMIMEType, {});
  //             } else {

  //               // this.fileOpener.open(path + filename, fileMIMEType)
  //               //   .then(() => {
  //               //     //console.log('File is opened')
  //               //   })
  //               //   .catch(e => this.globalobjects.presentAlert("file is" + JSON.stringify(e)));
  //             }
  //           }, (error) => {
  //             alert('Error occured while saving file. Please check storage permission and try again.')
  //           });
  //         })
  //       });

  //     } else {

  //       const a = document.createElement('a')
  //       const objectUrl = URL.createObjectURL(data)
  //       a.href = objectUrl
  //       a.download = filename;
  //       a.click();
  //       URL.revokeObjectURL(objectUrl);
  //     }

  //   }, (err) => {
  //     this.globalobjects.presentAlert("File not found...");
  //   })
  //   // }
  // }

  // makeXmlHttpReq(downloadUrl) {
  //   return new Promise((resolve, reject) => {
  //     let oReq = new XMLHttpRequest();
  //     oReq.open("GET", downloadUrl, true);
  //     //console.log("ResStatus: " + oReq.status);
  //     oReq.responseType = "blob"; // blob pls


  //     oReq.onreadystatechange = (oEvent) => {
  //       if (oReq.readyState === 4) {
  //         if (oReq.status === 200) {
  //           oReq.onload = (oEvent) => {
  //             resolve(oReq.response);
  //           }
  //         } else {
  //           reject("Error");
  //         }
  //       }
  //     };
  //     oReq.send();
  //   })
  // }

  // getMIMEtype(extn) {
  //   let ext = extn.toLowerCase();
  //   let MIMETypes = {
  //     'txt': 'text/plain',
  //     'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //     'doc': 'application/msword',
  //     'pdf': 'application/pdf',
  //     'jpg': 'image/jpeg',
  //     'bmp': 'image/bmp',
  //     'png': 'image/png',
  //     'xls': 'application/vnd.ms-excel',
  //     'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     'rtf': 'application/rtf',
  //     'ppt': 'application/vnd.ms-powerpoint',
  //     'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  //     'mp3': 'audio/mpeg',
  //     'mpeg': 'video/mpeg',
  //     'wav': 'audio/wav',
  //     'weba': 'audio/webm',
  //     'webm': 'video/webm',
  //     'wmv': 'video/x-ms-wmv',
  //     'mp4': 'video/mp4'

  //   }
  //   return MIMETypes[ext];
  // }

  sendSmsThrought(l_sendby, event, clickEventStr) {
    var object_mast = this.object_mast.Level2
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let mobileNo;
        let message = "Please Input Proper Message..!";
        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let framedata of frame.tableRows) {
            for (let itemGroup of framedata) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO" || item.item_name == "mobileno") {
                    mobileNo = item.value
                  } else if (item.item_name == "SMS_TEXT") {
                    message = item.value
                  }
                }
              }
            }
          }
        }
        if (mobileNo && message && l_sendby == 'shareViaWhatsApp') {
          this.globalobjects.shareViaWhatsApp(mobileNo, message);
          // if (event.click_events_arr.length > (event.click_events_count + 1)) {
          //   event.click_events_count = event.click_events_count + 1;
          //   this.itemClicked1(event, clickEventStr);
          // }

        }
      }
    }
  }

  sendSms(event) {
    var object_mast = this.object_mast.Level2
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let mobileNo;
        let message;
        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let framedata of frame.tableRows) {
            for (let itemGroup of framedata) {
              if (frame.apps_frame_type == 'APPROVAL-TAB') {
                for (let itemp of itemGroup) {
                  if (itemp.Level5) {
                    for (let item of itemp.Level5) {
                      if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO") {
                        mobileNo = item.value
                      } else if (item.item_name == "SMS" || item.item_name == "SMS_TEXT") {
                        message = item.value
                      }
                    }
                  }
                }
              } else {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (event.apps_page_frame_seqid == itemGroup.apps_page_frame_seqid) {
                      if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO" || item.item_name == "MOBILE_NO") {
                        mobileNo = item.value
                      } else if (item.item_name == "SMS" || item.item_name == "SMS_TEXT" || item.item_name == "EMAIL_BODY") {
                        message = item.value
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (mobileNo && message) {
          this.wscp.service_type = "send_sms";
          let smsData: any = {};
          smsData.mobileNo = mobileNo;
          smsData.smsText = message;
          let wsdp: any = [];
          wsdp.push(smsData);
          let reqData: any = {};
          reqData = {
            "wslp": this.globalobjects.userDetails,
            "wscp": this.wscp,
            "wsdp": wsdp,
            "wsdpcl": this.wsdpcl,
            "wsud": this.wsud
          }

          this.dataService.postData("SEND_SMS", reqData).then(res => {
            let data: any = res;
            if (data.responseStatus == "success") {
              this.object_arr = data.responseData;
              let objData = this.globalobjects.setPageInfo(this.object_arr);
              this.object_mast = objData.Level1[0];
            }
          }).catch(err => {
            this.globalobjects.presentToast("785 Something went wrong please try again later!");
          })
        }
      }
    }
  }

  sendNotification(event, clickEventStr) {
    this.wscp.service_type = "SEND_NOTIFICATION";
    let smsData: any = {};
    let wsdp: any = [];
    wsdp.push(smsData);
    let reqData: any = {};
    reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": this.wscp,
      "wsdp": wsdp,
      "wsdpcl": this.wsdpcl,
      "wsud": this.wsud
    }

    this.dataService.postData("S2U", reqData).then(res => {
      let data: any = res;
      if (data.responseStatus == "success") {
        this.object_arr = data.responseData;
        let objData = this.globalobjects.setPageInfo(this.object_arr);
        this.object_mast = objData.Level1[0];
      }
    }).catch(err => {
      //console.log('super.page.ts Something went wrong :', err);
      this.globalobjects.presentToast("785 Something went wrong please try again later!");
      //console.log(err);
    });
    // if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, clickEventStr);
    // }

  }

  sendEmail(event: any, emailType, clickEventStr) {
    emailType = emailType.toUpperCase();
    let wsdp = [{

      "email_type": emailType
    }]
    let reqData = {
      "wsdp": wsdp
    };
    this.dataService.postData("SEND_HARDCODED_EMAIL", reqData).then((data: any) => {
      this.globalobjects.presentAlert(data.responseMsg);
      // if (event.click_events_arr.length > (event.click_events_count + 1)) {
      //   event.click_events_count = event.click_events_count + 1;
      //   this.itemClicked1(event, clickEventStr);
      // }

    }, (err) => {
      this.globalobjects.presentAlert(JSON.stringify(err))
      // if (event.click_events_arr.length > (event.click_events_count + 1)) {
      //   event.click_events_count = event.click_events_count + 1;
      //   this.itemClicked1(event, clickEventStr);
      // }

    })
  }

  editItem(event: any) {
    let seqId;
    if (event.click_events_str.indexOf("~") > -1) {
      seqId = event.click_events_str.split("~")[1];
    } else {
      seqId = event.apps_page_frame_seqid
    }
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (frame.apps_frame_type == 'CANVAS' && frame.apps_page_frame_seqid == seqId) {
        frame.tableRows = [];
        frame.tableRows.push(event.EDIT_ITEM);
      }
    }
  }

  mirrorItems(event) {

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if (frame.tableRows && frame.tableRows.length > 0) {
          if (this.eventOfadditem && this.eventOfadditem.frameSeq && (this.eventOfadditem.frameSeq == frame.apps_page_frame_seqid)) { }
          else {
            for (let tableData of frame.tableRows) {
              for (let itemGroup of tableData) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (item.mirror_item_seqid) {
                      if (!event.itemIndex) {
                        event.itemIndex = 0;
                      }
                      if (this.get_item_value(item.mirror_item_seqid, event.itemIndex)) {
                        item.value = this.get_item_value(item.mirror_item_seqid, event.itemIndex);
                      }

                    }
                  }
                } else {
                  if (itemGroup && itemGroup.length > 0) {
                    for (let item of itemGroup) {
                      if (item.mirror_item_seqid) {
                        if (!event.itemIndex) {
                          event.itemIndex = 0;
                        }
                        if (this.get_item_value(item.mirror_item_seqid, event.itemIndex)) {
                          item.value = this.get_item_value(item.mirror_item_seqid, event.itemIndex);
                        }

                      }
                    }
                  }
                }
              }
            }
          }
        }

        else {
          let tableRows = [];
          let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
          for (let itemGroup of frameLevel4) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if (item.mirror_item_seqid) {
                  for (let fromObj of this.object_mast.Level2) {
                    for (let fromFrame of fromObj.Level3) {

                      if (fromFrame.tableRows) {
                        let i = 0;
                        for (let frameLevel4 of fromFrame.tableRows) {
                          for (let fromItemGroup of frameLevel4) {
                            if (fromItemGroup.Level5) {
                              for (let fromItem of fromItemGroup.Level5) {
                                if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
                                  item.value = fromItem.value;
                                }
                              }
                            } else {
                              if (fromItemGroup) {
                                for (let fromItem of fromItemGroup) {
                                  if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
                                    item.value = fromItem.value;
                                  }
                                }
                              }
                            }
                          }
                          i++
                        }
                      }
                    }
                  }
                  tableRows[0] = frameLevel4;

                }
              }
            } else {
              if (itemGroup && itemGroup.length > 0) {
                for (let item of itemGroup) {
                  if (item.mirror_item_seqid) {
                    for (let fromObj of this.object_mast.Level2) {
                      for (let fromFrame of fromObj.Level3) {

                        if (fromFrame.tableRows) {
                          let i = 0;
                          for (let frameLevel4 of fromFrame.tableRows) {
                            for (let fromItemGroup of frameLevel4) {
                              if (fromItemGroup.Level5) {
                                for (let fromItem of fromItemGroup.Level5) {
                                  if ((item.mirror_item_seqid == fromItem.apps_item_seqid) && (i == event.itemIndex)) {
                                    if (fromItem.value) {
                                      item.value = fromItem.value;
                                    }
                                  }
                                }
                              } else {
                                if (fromItemGroup) {
                                  for (let fromItem of fromItemGroup) {
                                    if (item.mirror_item_seqid == fromItem.apps_item_seqid) {
                                      if (fromItem.value) {
                                        item.value = fromItem.value;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            i++
                          }
                        }


                      }
                    }
                    tableRows[0] = frameLevel4;
                  }
                }
              }
            }
          }
          if (tableRows.length > 0) {
            frame.tableRows = tableRows;
          }
        }
      }
    }


  }

  addCalender(event) {
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (frame.apps_frame_type == 'CALENDER') {
        if (frame.tableRows && frame.tableRows.length > 0) {
          frame.tableRows.push(event.ADD_ITEM);
        } else {
          frame.tableRows = [];
          frame.tableRows.push(event.ADD_ITEM);
        }
      }
    }
  }

  saveData(nextPageInfo, event, str, clickEventStr) {
    let wsdp = [];
    if (str == "DELETE_FRAME_PKEY") { } else {
      var object_mast = this.object_mast.Level2
      for (let object of object_mast) {
        for (let frame of object.Level3) {
          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let framedata of frame.tableRows) {
              let col = {};
              for (let itemGroup of framedata) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (item.codeOfValues) {
                      col[item.apps_item_seqid] = item.codeOfValues;
                    } else if (item.value) {
                      if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                        col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                      } else {
                        col[item.apps_item_seqid] = item.value;
                      }
                    } else {
                      col[item.apps_item_seqid] = "";
                    }
                  }
                } else if (itemGroup && itemGroup.length > 0) {
                  for (let item of itemGroup) {

                    if (item.codeOfValues) {
                      col[item.apps_item_seqid] = item.codeOfValues;
                    } else if (item.value) {
                      if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                        col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                      } else {
                        col[item.apps_item_seqid] = item.value;
                      }
                    } else {
                      col[item.apps_item_seqid] = "";
                    }
                  }
                }
              }
              wsdp.push(col)
            }
          } else {
            let col = {};
            for (let itemGroup of frame.Level4) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  // col[item.apps_item_seqid] = item.value
                  if (item.codeOfValues) {
                    col[item.apps_item_seqid] = item.codeOfValues;
                  } else if (item.value) {
                    if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                      col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                    } else {
                      col[item.apps_item_seqid] = item.value;
                    }
                  } else {
                    col[item.apps_item_seqid] = "";
                  }
                }
              }
            }
            wsdp.push(col)
          }
        }
      }
    }
    // //console.log(wsdp);
    //---------------------------------
    let reqData: any = {};
    reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": nextPageInfo.wscp,
      "wsdp": wsdp,
      "wsdpcl": nextPageInfo.wsdpcl,
      "wsud": this.wsud
    }
    // //console.log(reqData);
    // this.globalobjects.showLoading();


    if (!this.globalobjects.networkStatus) {
      this.dataService.saveEntryToLocalDB(reqData).then(res => {
        //console.log(reqData);
        if (res == "success") {
          this.globalobjects.displayCordovaToast("Entry Saved in Local Storage..!");
          this.closePage("", clickEventStr);
        } else {
          this.globalobjects.displayCordovaToast("Error in Save Offline.. !");
        }
      })
    } else {
      this.dataService.postData("S2U", reqData).then(res => {
        //
        let data: any = res;
        // //console.log(data);
        if (data.responseStatus == "success") {
          this.globalobjects.presentAlert("Data Saved Successfully");
          // this.globalobjects.s2uToast("Data Saved Successfully", "paymentSuccessToast");
          let object_arr = data.responseData
          // let objData = this.globalobjects.setPageInfo(object_arr);
          let keycount = 0;
          for (let obj of object_arr.Level1_Keys) {
            if (event.sessionObj) {
              event.sessionObj[obj] = object_arr.Values[0][keycount]
            } else {
              event.sessionObj = {};
              event.sessionObj[obj] = object_arr.Values[0][keycount]
            }
            keycount = keycount + 1;
          }
          // if (event.click_events_arr.length > (event.click_events_count + 1)) {
          //   event.click_events_count = event.click_events_count + 1;
          //   this.itemClicked1(event, clickEventStr);
          // }else
          if (str == "DELETE_FRAME_PKEY") {
            this.deleteRow(event);
          }
        } else {
          this.globalobjects.presentToastWithOptions(data.responseMsg, "errorclass")
        }

      }).catch(err => {
        this.globalobjects.presentToast("6 Something went wrong please try again later!");
        //console.log(err);
      })
    }
    //---------------------------------
  }

  deleteRow(event) {
    // var object_mast = this.object_mast.Level2
    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        frame.tableRows.splice(event.itemIndex, 1)
      }
    }
  }


  async execute_plsql(nextPageInfo, event, clickEventStr): Promise<any> {

    if (!event.executed_item) {
      event.item_enable_flag = 'F';
    }
    let wsdp = [];
    let wsdptp = [];
    let wsdpcl = [];

    var object_mast = this.object_mast.Level2;

    if (nextPageInfo.wsdpcl && nextPageInfo.wsdpcl.length > 0) {
      let frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seqid);
      if ((frame && frame.tempRows && frame.tempRows.length > 0)) {
        nextPageInfo.wsdpcl = [];
        event.wsdpcl = [];
      }
    }

    nextPageInfo.wsdpcl = [];
    event.wsdpcl = [];



    if (event.calling_frame_seqid_str) {
      let allWsdp = this.lhs_lib.getDp(event.calling_frame_seqid_str, this.globalobjects.noU2sFlag);
      wsdp = wsdp.concat(allWsdp);
      wsdpcl = this.lhs_lib.getDpcl(event.calling_frame_seqid_str, this.globalobjects.noU2sFlag);
    } else {
      wsdpcl = this.lhs_lib.getDpcl(event.calling_frame_seqid_str, this.globalobjects.noU2sFlag);
    }

    if (this.globalobjects.summaryCartdeatail.length > 0) {
      let qtyPre: boolean = false;
      let glob = this.globalobjects.summaryCartdeatail;
      wsdp = [];
      wsdptp = [];
      wsdpcl = nextPageInfo.wsdpcl;
      for (let framedata of object_mast[0].Level3[0].tableRows) {
        let col = {};
        let coltp = {};
        for (let itemGroup of framedata) {
          if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
            for (let item of itemGroup.Level5) {
              if (item.codeOfValues) {
                col[item.apps_item_seqid] = item.codeOfValues;
                coltp[item.item_name] = item.codeOfValues;
              } else if (item.value != undefined && item.value != null) {
                if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                  col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                  coltp[item.item_name] = item.value ? item.value.toString().replaceAll(',', '') : '';
                } else {
                  col[item.apps_item_seqid] = item.value;
                  coltp[item.item_name] = item.value;
                }
              } else {
                col[item.apps_item_seqid] = "";
                coltp[item.item_name] = "";
              }
            }
          }
        }
        wsdp.push(col);
        wsdptp.push(coltp);
      }
      let col = {};
      let coltp = {};
      for (let globArr of glob) {
        for (let globObj of globArr.items) {
          for (let itemGroup of globObj) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {
                if (item.codeOfValues) {
                  col[item.apps_item_seqid] = item.codeOfValues;
                  coltp[item.item_name] = item.codeOfValues;
                } else if (item.value != undefined && item.value != null) {
                  if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                    col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                    coltp[item.item_name] = item.value ? item.value.toString().replaceAll(',', '') : '';
                  } else {
                    col[item.apps_item_seqid] = item.value;
                    coltp[item.item_name] = item.value;
                  }
                } else {
                  col[item.apps_item_seqid] = "";
                  coltp[item.item_name] = "";
                } if (item.item_name == 'AQTYORDER' && item.value) {
                  qtyPre = true;
                }
              }
            }
          }
          if (qtyPre) {
            let col2 = JSON.parse(JSON.stringify(col));
            let col3 = JSON.parse(JSON.stringify(coltp));
            wsdp.push(col2);
            wsdptp.push(col3);
            qtyPre = false;
          }
        }
      }
    }


    if (Object.keys(this.newFormInstance).length > 0) {
      wsdp.push(this.newFormInstance);
    }



    // if (nextPageInfo.wscp != "execute_query_all_object" || event.calling_frame_seqid_arr || event.calling_frame_seqid_arr.length > 0 || this.concatKey.length > 0) {
    //   nextPageInfo.wscp.single_frame_wsdp = true;
    // }

    if (nextPageInfo.wscp.service_type == "execute_query_all_object") {
      nextPageInfo.wscp.apps_item_seqid = nextPageInfo.wscp.origin_apps_item_seqid;
    }

    // if ((event.calling_frame_seqid_arr && event.calling_frame_seqid_arr.length > 0) || this.concatKey.length > 0) {
    // } else {
    //   nextPageInfo.wscp.single_frame_wsdp = false;
    // }

    if (nextPageInfo.wscp.service_type == "execute_item_plsql" && event.item_name == 'PB_SAVE') {
      this.app_add_para_cp("commit_mode", "Y");
    }

    nextPageInfo.wscp.current_record_index = event.itemIndex ? event.itemIndex : 0;


    let wscp = this.generate_wscp(event, nextPageInfo.wscp);
    //---------------------------------
    let reqData: any = {};
    // alert(JSON.stringify(this.globalobjects.getDeviceInfo()));
    let tpFlag: boolean = false;
    let condArr = event.click_events_arr && event.click_events_arr[event.click_events_count] ? event.click_events_arr[event.click_events_count].split('~') : [];
    if (condArr[1] && condArr[1] == 'wsdptp') {
      tpFlag = true;
      wsdptp[0].apps_page_frame_seqid = event.apps_page_frame_seqid;
      wsdptp[0].apps_item_seqid = event.apps_item_seqid;
      reqData = {
        "wsdptp": wsdptp
      }
    } else {
      reqData = {
        "wslp": this.globalobjects.userDetails,
        "wscp": JSON.parse(JSON.stringify(wscp)),
        "wsdp": wsdp,
        "wsdpcl": wsdpcl,
        "wsud": this.wsud,
        "event": event
      }
      // let iudId = this.globalobjects.getLocallData('iudLocal');
      // if (iudId) {
      //   reqData.wscp.iud_seqid = this.globalobjects.userDetails.login_session_id + (iudId + 1);
      //   this.globalobjects.setDataLocally('iudLocal', (iudId + 1));
      // } else {
      //   reqData.wscp.iud_seqid = this.globalobjects.userDetails.login_session_id + 1;
      //   this.globalobjects.setDataLocally('iudLocal', 1);
      // }
    }

    let data = {
      reqData: JSON.stringify(reqData),
      status: "pending"
    }

    if (!this.globalobjects.networkStatus) {
      this.sqlLiteServ.saveEnterySql(data).then(res => {
        this.globalobjects.hideLoadingNew();
        if (res.resStatus == "success") {
          this.globalobjects.displayCordovaToast("Entry Saved in Local Storage..!");
          // console.log("executePlsql run ======>>>>>>>>>>>")
          this.closePage("", clickEventStr);
        } else {
          this.globalobjects.displayCordovaToast("Error in Save Offline.. !");
        }
      })

    } else {

      // this.globalobjects.ShowLoadingNew(event, this.clickEvent);
      let index = event.itemIndex ? event.itemIndex : (event.indexCount ? event.indexCount : event.indexcount);
      let itm = this.lhs_lib.get_item(event.apps_item_seqid, index);
      if (itm) {
        itm.requestData = reqData;
      }

      if (this.globalobjects.noU2sFlag) {
        reqData.wscp.g_no_u2s_flag = 'Y';
      }

      if (this.globalobjects.logFlag) {
        let name = `executing ${wscp.service_type} of item: ${wscp.apps_item_seqid} and frame: ${wscp.apps_page_frame_seqid}`;
        let ws_type = wscp.service_type;
        // this.lhs_lib.get_event_log_obj(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, "start",ws_type);
        let log_name = `execute_plsql ${wscp.service_type}_${wscp.apps_item_seqid}_${wscp.apps_page_frame_seqid}`;
        let status = "start";
        const seq = this.lhs_lib.start();
        this.lhs_lib.get_event_log_objs(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, status, ws_type, log_name, seq)
      }

      // delete reqData.wscp['ref_cursor_mode'];
      await this.dataService.postData("S2U", reqData).then(async res => {
        // this.globalobjects.hideLoadingNew();

        // this.ngZone.run(() => {
        //   this.cdr.detectChanges();
        // })

        let data: any = res;

        if (this.globalobjects.logFlag) {
          let name = `executing ${wscp.service_type} of item: ${wscp.apps_item_seqid} and frame: ${wscp.apps_page_frame_seqid}`;
          let ws_type = wscp.service_type;
          // this.lhs_lib.get_event_log_obj(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, "end",ws_type);
          let log_name = `execute_plsql ${wscp.service_type}_${wscp.apps_item_seqid}_${wscp.apps_page_frame_seqid}`;
          let status = "end";
          this.lhs_lib.end();
          this.lhs_lib.get_event_log_objs(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, status, ws_type, log_name)
        }
        if (tpFlag) {
          data.responseStatus == "success";
          // this.globalobjects.setFocus(true);

          this.globalobjects.clickedbutton = false;

          this.globalobjects.presentAlert(data.responseData.message).then(() => {
            // if (event.click_events_arr.length > (event.click_events_count + 1)) {
            //   event.click_events_count = event.click_events_count + 1;
            //   this.itemClicked1(event, clickEventStr);
            // }

          })
        } else {
          if (data.responseStatus && data.responseStatus.includes("success")) {

            try {

              let object_arr = data.responseData

              let objData: any = {};

              if (data.responseStatus.toLowerCase().includes("-rc")) {
                objData.Level1 = this.globalobjects.setPageInfoNoS2U(data.responseData);
              } else {
                objData = this.globalobjects.setPageInfo(object_arr);
              }

              let flag: boolean = true;

              if (data.responseHead && data.responseHead.length > 0) {
                this.generatAllFrameJson(data.responseHead, event, true);
              }

              if (objData.Level1 && objData.Level1.length > 0 && objData.Level1[0]['status'] == 'J') {

                if (!event.executed_item) {
                  event.item_enable_flag = 'T';
                }
                // this.cdEngine.detect(event.apps_item_seqid + '_' + event.indexcount + '#' + event.apps_page_frame_seqid);
                this.lhs_lib.refreshFrameItems[event.apps_item_seqid + '_' + (event.indexcount ?? 0) + '#' + event.apps_page_frame_seqid] = "Y";
                await this.generatAllFrameJson(objData.Level1, event);

                let data = objData.Level1;
                let isRep = data.find(x => x.para_type == 'RE');
                if (isRep) {
                  delete event['rase'];
                  await this.execute_plsql(nextPageInfo, event, clickEventStr).then(() => {
                    // this.excute_event(event);
                    return;
                  });
                }

              } else {

                let keycount = 0;
                for (let obj of object_arr.Level1_Keys) {
                  if (event.sessionObj) {
                    event.sessionObj[obj] = object_arr.Values[0][keycount]
                  } else {
                    event.sessionObj = {};
                    event.sessionObj[obj] = object_arr.Values[0][keycount]
                  }
                  keycount = keycount + 1;
                }

                keycount = 0;

                // this.globalobjects.setFocus(true);

                if (event.click_events_arr[event.click_events_count] == "when_new_form_instance") {
                  let newInst = {};
                  for (let obj of object_arr.Level1_Keys) {
                    if (event.sessionObj) {
                      newInst[obj] = object_arr.Values[0][keycount]
                    } else {
                      newInst = {};
                      newInst[obj] = object_arr.Values[0][keycount]
                    }
                    keycount = keycount + 1;
                  }
                  if (this.globalobjects.newFormInstanceArr.length > 0) {
                    let glob = this.globalobjects.newFormInstanceArr.find(x => x.objCode == event.calling_object_code);
                    if (glob) {
                      glob.newInst = newInst;
                    }
                  } else {
                    let data = {
                      objCode: event.calling_object_code,
                      newInst: newInst
                    }
                    this.globalobjects.newFormInstanceArr.push(data);
                  }
                  this.wsdp.push(this.newFormInstance);
                }

                //console.log('objData', objData);
                if (objData.Level1.length > 0 && objData.Level1[0].prev_ws_seqid) {
                  event.prev_ws_seqid = objData.Level1[0].prev_ws_seqid;
                }
                if (objData.Level1.length > 0 && objData.Level1[0].status == "F") {
                  this.globalobjects.clickedbutton = false;
                  flag = false;
                  this.globalobjects.presentAlert(objData.Level1[0].message).then(() => {
                    // if (event.click_events_arr.length > (event.click_events_count + 1) && (objData.Level1[0].status != "Q") && !flag) {
                    //   event.click_events_count = event.click_events_count + 1;
                    //   this.itemClicked1(event, clickEventStr);
                    // }
                  })
                }
                else if (objData.Level1.length > 0 && objData.Level1[0].status == "L") {
                  sessionStorage.setItem("PLSQL_L", objData.Level1[0].message);
                }


                else if (objData.Level1.length > 0 && objData.Level1[0].status == "Q") {
                  if (!event.executed_item) {
                    event.item_enable_flag = 'T';
                  }
                  // this.globalobjects.presentAlert(objData.Level1[0].message);
                  this.lhs_lib.msgbox(event, objData.Level1[0].message, 'raise')
                  this.globalobjects.clickedbutton = false;

                  for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                    if (frame.apps_frame_type === "CALENDER") {
                      this.events.publish('reloadCal');
                    }
                  }

                  this.globalobjects.uniqueKey = "";
                }
                else if (objData.Level1.length > 0 && objData.Level1[0].status == "T") {
                  if (!event.executed_item) {
                    event.item_enable_flag = 'T';
                  }
                  // if (event.click_events_arr.length > (event.click_events_count + 1)) {
                  //   event.click_events_count = event.click_events_count + 1;
                  //   this.itemClicked1(event, clickEventStr);
                  // }
                }
                else {
                  objData.Level1[0].status = "Q";
                  if (!event.executed_item) {
                    event.item_enable_flag = 'T';
                  }
                  this.globalobjects.uniqueKey = "";
                  flag = false;
                  this.globalobjects.presentAlert(objData.Level1[0].message).then(res => {
                    // if (event.click_events_arr.length > (event.click_events_count + 1) && (objData.Level1[0].status != "Q") && !flag) {
                    //   event.click_events_count = event.click_events_count + 1;
                    //   this.itemClicked1(event, clickEventStr);
                    // }
                  });
                  this.globalobjects.clickedbutton = false;
                }
                if (data.responseHead && data.responseHead.length > 0) {
                  this.generatAllFrameJson(data.responseHead, event, true);
                }
                // this.cdEngine.detect(event.apps_item_seqid + '_' + event.indexcount + '#' + event.apps_page_frame_seqid);
                this.lhs_lib.refreshFrameItems[event.apps_item_seqid + '_' + (event.indexcount ?? 0) + '#' + event.apps_page_frame_seqid] = "Y";
                // if (event.click_events_arr.length > (event.click_events_count + 1) && (objData.Level1[0].status != "Q") && flag) {
                //   event.click_events_count = event.click_events_count + 1;
                //   this.itemClicked1(event, clickEventStr);
                // }
                return;
              }

            } catch (error) {
              if (data.responseMsg) {
                alert(data.responseMsg);
                console.log(data.responseMsg);
              } else {
                console.log(error);
                alert(error);
              }

              this.clearQue();
            }

          } else if (data.responseMsg && data.responseMsg.includes("Q")) {
            this.lhs_lib.msgbox(event, data.responseMsg.split("#")[1], 'raise');
            this.globalobjects.setFocus(true);
            throw new Error('Code Raised');
          } else {
            // this.globalobjects.presentToast(data.responseMsg)
            // this.globalobjects.presentToastWithOptions(data.responseMsg,"errorclass")
            console.log(data);
            if (!event.executed_item) {
              event.item_enable_flag = 'T';
            }
            // this.cdEngine.detect(event.apps_item_seqid + '_' + event.indexcount + '#' + event.apps_page_frame_seqid);
            this.lhs_lib.refreshFrameItems[event.apps_item_seqid + '_' + (event.indexcount ?? 0) + '#' + event.apps_page_frame_seqid] = "Y";
            this.globalobjects.presentToastWithOptions(data.responseMsg, "errorclass");
            this.globalobjects.clickedbutton = false;
            for (let frame of this.object_mast.Level2[this.page_no].Level3) {
              if (frame.apps_frame_type === "CALENDER") {
                this.events.publish('reloadCal');
              }
            }
            this.globalobjects.uniqueKey = "";
            return;
          }
        }


      }).catch(err => {
        // this.globalobjects.setFocus(true);
        if (!event.executed_item) {
          event.item_enable_flag = 'T';
        }
        this.globalobjects.hideLoadingNew();

        this.globalobjects.presentToast("6 Something went wrong please try again later!");
        //console.log(err);
        return;
      })
    }
    //---------------------------------
  }

  calling_frame_seqid_str_concat(event) {
    let wsdp = [];
    var object_mast = this.object_mast.Level2;
    if (event.calling_frame_seqid_arr) {
      for (let call_frame of event.calling_frame_seqid_arr) {
        for (let object of object_mast) {

          for (let frame of object.Level3) {

            if (frame.apps_page_frame_seqid == call_frame) {
              let tableRows = [];
              tableRows = frame.tableRows;

              if (this.eventOfadditem && this.eventOfadditem.rows && this.eventOfadditem.rows.length > 0) {
                if (this.eventOfadditem.rows.length > 1) {
                  if (this.eventOfadditem.rows[1][0].apps_page_frame_seqid == frame.apps_page_frame_seqid) {
                    tableRows = this.eventOfadditem.rows;
                  }
                } else {
                  if (this.eventOfadditem.rows[0].length > 0) {
                    if (this.eventOfadditem.rows[0][0].apps_page_frame_seqid == frame.apps_page_frame_seqid) {
                      tableRows = this.eventOfadditem.rows;
                    }
                  }
                }
              }

              if (this.concatKey.length > 0) {
                for (let conKey of this.concatKey) {
                  if (frame.apps_page_frame_seqid == conKey) {
                    tableRows = this.concatArr;
                    this.concatArr = [];
                  }
                }
              }
              if (frame.tableRows && frame.tableRows.length > 0) {
                if (tableRows.length > 0) {
                  for (let framedata of tableRows) {
                    let col = {};
                    for (let itemGroup of framedata) {
                      if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                        for (let item of itemGroup.Level5) {
                          if (item.codeOfValues) {
                            col[item.apps_item_seqid] = item.codeOfValues;
                          } else if (item.value) {
                            if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                              col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                            } else {
                              col[item.apps_item_seqid] = item.value;
                            }
                          } else {
                            col[item.apps_item_seqid] = "";
                          }
                        }
                      }
                    }
                    wsdp.push(col)
                  }
                }
              } else {
                let col = {};
                for (let itemGroup of frame.Level4) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if (item.codeOfValues) {
                        col[item.apps_item_seqid] = item.codeOfValues;
                      } else if (item.value) {
                        if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                          col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
                        } else {
                          col[item.apps_item_seqid] = item.value;
                        }
                      } else {
                        col[item.apps_item_seqid] = "";
                      }

                    }
                  }
                }
                wsdp.push(col)
              }
            }
          }
        }
      }
      event.wsdp = wsdp
      this.openPage(event);
    } else {
      this.openPage(event);
    }

  }


  async app_required_frame(event, frmseqstr): Promise<any> {

    // let isValid = true;

    let res: any = {
      isValid: true
    };
    let error_itemsArr = [];
    // -----------------------------------
    let item_str = "";
    let validate_lov_str = "";
    let count = 0;
    let frmseq = frmseqstr ? (frmseqstr.includes(",") ? frmseqstr.split(",") : [frmseqstr]) : [];
    var object_mast = this.object_mast.Level2;
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let tempFrame;
        if (frmseq) {
          for (let chkframe of frmseq) {
            if (frame.apps_page_frame_seqid == chkframe || frame.frame_alias && frame.frame_alias.toLowerCase() == chkframe.toLowerCase()) {
              if ((frame.tableRows && frame.tableRows.length > 0) || frame.Level4.length > 0) {
                let checkFlag = true;
                if (frame.tempRows && frame.tempRows.length > 0) {
                  let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
                  tempFrame = this.lhs_lib.get_frame_config(frame.apps_page_frame_seqid + 'A');
                  let wmaRec = this.lhs_lib.get_item(name, 0);
                  if (wmaRec && wmaRec.frame_status && (wmaRec.frame_status).toLowerCase() == 'dirty') {
                    checkFlag = true;
                  } else {
                    checkFlag = false;
                  }
                } else {
                  checkFlag = true;
                }

                if (checkFlag) {

                  let arr = [];
                  if (frame.tableRows && frame.tableRows.length > 0) {

                    let dataRes = this.checkValidTemp(frame.apps_page_frame_seqid, frame.tableRows, "", count);
                    res.isValid = !res.isValid ? res.isValid : dataRes.isValid;
                    item_str = item_str ? item_str + dataRes.item_str : dataRes.item_str;
                    count = dataRes.count;
                    res.error_item = item_str;
                    res.item = dataRes.item;
                    validate_lov_str = validate_lov_str + dataRes.validate_lov_str;
                    error_itemsArr = [...error_itemsArr, dataRes.error_items_arr];
                  }

                  if (frame.tempRows && frame.tempRows.length > 0) {
                    let indexArr = [];

                    if (frame.indexStr) {
                      indexArr = frame.indexStr.split(";");
                    } else {
                      indexArr[0] = frame.edit_record_index;
                    }

                    if (tempFrame) {
                      let dataRes = this.checkValidTemp(tempFrame.apps_page_frame_seqid, tempFrame.tableRows, item_str, count, indexArr);
                      res.isValid = !res.isValid ? res.isValid : dataRes.isValid;
                      item_str = item_str ? item_str + dataRes.item_str : dataRes.item_str;
                      count = dataRes.count;
                      res.error_item = item_str;
                      res.item = dataRes.item;
                      validate_lov_str = validate_lov_str + dataRes.validate_lov_str;
                      error_itemsArr = [...error_itemsArr, dataRes.error_items_arr];
                    }
                  }
                } else {

                  if (tempFrame) {
                    let dataRes = this.checkValidTemp(tempFrame.apps_page_frame_seqid, tempFrame.tableRows, item_str, count);
                    res.isValid = !res.isValid ? res.isValid : dataRes.isValid;
                    item_str = item_str ? item_str + dataRes.item_str : dataRes.item_str;
                    count = dataRes.count;
                    res.error_item = item_str;
                    res.item = dataRes.item;
                    validate_lov_str = validate_lov_str + dataRes.validate_lov_str;
                    error_itemsArr = [...error_itemsArr, dataRes.error_items_arr];
                  }
                }

              } else {
                res.isValid = false;
                //  this.globalobjects.presentAlert("Data should not be null,please add items...");
                this.lhs_lib.msgbox({}, "Data should not be null,please add items...", null, null, null, null, error_itemsArr);
              }
            }
          }
        } else {
          if ((frame.tableRows && frame.tableRows.length > 0) || frame.Level4.length > 0) {
            if (frame.tableRows && frame.tableRows.length > 0) {
              for (let framedata of frame.tableRows) {
                for (let itemGroup of framedata) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if ((item.isValid !== undefined && !item.isValid)) {
                        res.isValid = item.isValid;
                        res.item = item;
                        item.touched = true;
                        error_itemsArr.push(item);
                        if (count < 2) {
                          item_str = item_str + "," + item.prompt_name.replace("*", '');;
                          res.error_item = item_str;
                        } else if (count == 2) {
                          item_str = item_str + " and more";
                          res.error_item = item_str;
                        }
                        count++;

                      }
                    }
                  }
                }
              }
            }
          } else {



            res.isValid = false;
            // this.globalobjects.presentAlert("Data should not be null,please add items...");
            this.lhs_lib.msgbox({}, "Data should not be null,please add items...", null, null, null, null, error_itemsArr);
          }
        }
      }
    }


    if (validate_lov_str) {

      let newEv = JSON.parse(JSON.stringify(event));
      newEv.validate_lov_str = validate_lov_str;
      this.validate_lov_all(event).then(() => {
        if (!res.isValid && !res.item) {
          this.globalobjects.clickedbutton = false;
          //  this.globalobjects.presentAlert("Please correct all the errors and enter valid input");
          event.rase = true;
          res.rase = true;
          // this.clearQue();

          this.lhs_lib.msgbox(event, "Please correct all the errors and enter valid input", null, null, null, null, error_itemsArr);
        } else if (!res.isValid && res.item) {
          this.globalobjects.clickedbutton = false;
          //  this.globalobjects.presentAlert("Please enter valid " + res.error_item);
          event.rase = true;
          res.rase = true;
          // this.clearQue();
          this.lhs_lib.msgbox(event, "Please enter valid " + res.error_item, null, null, null, null, error_itemsArr);
        } else {
          // this.clearQue();
        }

        return res;
      })

    } else {
      if (!res.isValid && !res.item) {
        this.globalobjects.clickedbutton = false;
        //  this.globalobjects.presentAlert("Please correct all the errors and enter valid input");
        // event.rase = true;
        if (event.item_type == 'RADIO_BUTTON') {
          event.value = event.oldValue
        }
        res.rase = true;
        // this.clearQue();
        this.lhs_lib.msgbox(event, "Please correct all the errors and enter valid input", null, null, null, null, error_itemsArr);
      } else if (!res.isValid && res.item) {
        this.globalobjects.clickedbutton = false;
        //  this.globalobjects.presentAlert("Please enter valid " + res.error_item);
        // event.rase = true;
        res.rase = true;
        // this.clearQue();
        await this.lhs_lib.msgbox(event, "Please enter valid " + res.error_item, null, null, null, null, error_itemsArr);

        if (event && event.item_type == 'RADIO_BUTTON' && event.value) {
          setTimeout(() => {
            event.value = event.oldValue;
            this.itemClicked(event);
          }, 0);

        }
      }
      // else {
      //   this.clearQue();
      // }

      return res;
    }


  }

  app_required_frame_loc(event, frmseqstr) {

    // let isValid = true;
    let res: any = {
      isValid: true
    };
    let error_itemsArr = [];

    let validate_lov_str = "";
    // -----------------------------------
    let item_str = "";
    let count = 0;
    let frmseq = frmseqstr ? (frmseqstr.includes(",") ? frmseqstr.split(",") : [frmseqstr]) : [];
    var object_mast = this.object_mast.Level2;
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let tempFrame;
        if (frmseq) {
          for (let chkframe of frmseq) {
            if (frame.apps_page_frame_seqid == chkframe || frame.frame_alias && frame.frame_alias.toLowerCase() == chkframe.toLowerCase()) {
              if ((frame.tableRows && frame.tableRows.length > 0) || frame.Level4.length > 0) {
                let checkFlag = true;
                if (frame.tempRows && frame.tempRows.length > 0) {
                  let name = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
                  tempFrame = this.lhs_lib.get_frame_config(frame.apps_page_frame_seqid + 'A');
                  let wmaRec = this.lhs_lib.get_item(name, 0);
                  if (wmaRec && wmaRec.frame_status && (wmaRec.frame_status).toLowerCase() == 'dirty') {
                    checkFlag = true;
                  } else {
                    checkFlag = false;
                  }
                } else {
                  checkFlag = true;
                }

                if (checkFlag) {

                  let arr = [];
                  if (frame.tableRows && frame.tableRows.length > 0) {
                    let dataRes = this.checkValidTemp(frame.apps_page_frame_seqid, frame.tableRows, "", count);
                    res.isValid = !res.isValid ? res.isValid : dataRes.isValid;
                    item_str = item_str ? item_str + dataRes.item_str : dataRes.item_str;
                    count = dataRes.count;
                    res.error_item = item_str;
                    res.item = dataRes.item;
                    error_itemsArr = [...error_itemsArr, dataRes.error_items_arr];
                    validate_lov_str = validate_lov_str + dataRes.validate_lov_str;
                  }

                  if (frame.tempRows && frame.tempRows.length > 0) {
                    let indexArr = [];

                    if (frame.indexStr) {
                      indexArr = frame.indexStr.split(";");
                    } else {
                      indexArr[0] = frame.edit_record_index;
                    }

                    if (tempFrame) {
                      let dataRes = this.checkValidTemp(tempFrame.apps_page_frame_seqid, tempFrame.tableRows, item_str, count, indexArr);
                      res.isValid = !res.isValid ? res.isValid : dataRes.isValid;
                      item_str = item_str ? item_str + dataRes.item_str : dataRes.item_str;
                      count = dataRes.count;
                      res.error_item = item_str;
                      res.item = dataRes.item;
                      error_itemsArr = [...error_itemsArr, dataRes.error_items_arr];
                      validate_lov_str = validate_lov_str + dataRes.validate_lov_str;
                    }
                  }
                } else {

                  if (tempFrame) {
                    let dataRes = this.checkValidTemp(tempFrame.apps_page_frame_seqid, tempFrame.tableRows, item_str, count);
                    res.isValid = !res.isValid ? res.isValid : dataRes.isValid;
                    item_str = item_str ? item_str + dataRes.item_str : dataRes.item_str;
                    count = dataRes.count;
                    res.error_item = item_str;
                    res.item = dataRes.item;
                    error_itemsArr = [...error_itemsArr, dataRes.error_items_arr];
                    validate_lov_str = validate_lov_str + dataRes.validate_lov_str;
                  }
                }

              } else {
                res.isValid = false;
                //  this.globalobjects.presentAlert("Data should not be null,please add items...");
                this.lhs_lib.msgbox({}, "Data should not be null,please add items...", null, null, null, null, error_itemsArr);
              }
            }
          }
        } else {
          if ((frame.tableRows && frame.tableRows.length > 0) || frame.Level4.length > 0) {
            if (frame.tableRows && frame.tableRows.length > 0) {
              for (let framedata of frame.tableRows) {
                for (let itemGroup of framedata) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if ((item.isValid !== undefined && !item.isValid)) {
                        res.isValid = item.isValid;
                        res.item = item;
                        item.touched = true;
                        error_itemsArr.push(item);
                        if (count < 2) {
                          item_str = item_str + "," + item.prompt_name.replace("*", '');;
                          res.error_item = item_str;
                        } else if (count == 2) {
                          item_str = item_str + " and more";
                          res.error_item = item_str;
                        }
                        count++;

                      }
                    }
                  }
                }
              }
            }
          } else {
            res.isValid = false;
            // this.globalobjects.presentAlert("Data should not be null,please add items...");
            this.lhs_lib.msgbox({}, "Data should not be null,please add items...", null, null, null, null, error_itemsArr);
          }
        }

      }
    }


    if (!res.isValid && !res.item) {
      this.globalobjects.clickedbutton = false;
      //  this.globalobjects.presentAlert("Please correct all the errors and enter valid input");
      res.rase = true;
      // this.clearQue();
      this.lhs_lib.msgbox(event, "Please correct all the errors and enter valid input");
    } else if (!res.isValid && res.item) {
      this.globalobjects.clickedbutton = false;
      //  this.globalobjects.presentAlert("Please enter valid " + res.error_item);
      res.rase = true;
      // this.clearQue();
      this.lhs_lib.msgbox(event, "Please enter valid " + res.error_item, null, null, null, null, error_itemsArr);
    }

    return res;
  }


  async app_required_record(event, fromFrame, index?): Promise<any> {


    let frame;
    if (fromFrame) {
      frame = await this.lhs_lib.get_frame_config(fromFrame);
    } else {
      frame = await this.lhs_lib.get_frame_config(event.apps_page_frame_seq_id);
    }


    let rowIndex = index;

    rowIndex = await this.lhs_lib.get_current_record(index, frame) ?? 0;

    if (!rowIndex) { rowIndex = 0; }
    let count = 0;
    let res: any = {
      isValid: true,
      item_str: ""
    };

    if (frame.tableRows && frame.tableRows[rowIndex]) {
      for (let itemGroup of frame.tableRows[rowIndex]) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if ((((item.data_required_flag == 'T' && (!item.isValid || item.value == undefined || item.value == null || item.value === "")) || item.forcedInvalid || item.forced_error_msg) && ((item.item_type != 'TEXT_DISPLAY') && (item.item_type != 'BUTTON') && (item.item_type != 'BUTTON_ICON')
              && (item.item_type != 'BAND') && (item.item_type != 'FRAME_SEPARATOR') && (item.item_type != 'SEPARATOR') && (item.item_type != 'IMAGE_SLIDER')) && (!item.item_name.includes('FRAME_RECORD_')) && (item.item_type != 'FRAME_BUTTON_ICON'))) {

              item.isValid = false;

              res.isValid = item.isValid;
              res.item = item;
              item.touched = true;
              item.vadidateMsg = item.tool_tip ? item.tool_tip : "Please enter valid " + (item.prompt_name ? item.prompt_name : item.item_name);
              // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
              this.lhs_lib.refreshFrameItems[event.apps_item_seqid + '_' + (event.indexcount ?? 0) + '#' + event.apps_page_frame_seqid] = "Y";
              if (count < 2) {
                res.item_str = res.item_str + "," + (item.prompt_name ? item.prompt_name : item.item_name);
                res.error_item = res.item_str;
              } else if (count == 2) {
                res.item_str = res.item_str + " and more";
                res.error_item = res.item_str;
              }
              count++;

            }
          }
        }
      }
    }

    if (!res.isValid && !res.item) {
      this.globalobjects.clickedbutton = false;
      //  this.globalobjects.presentAlert("Please correct all the errors and enter valid input");
      event.rase = true;
      res.rase = true;
      this.clearQue();
      // this.globalobjects.setFocus(true);
      this.lhs_lib.msgbox(event, "Please correct all the errors and enter valid input", "");
      // throw new Error('Code Raised');
      // throw new Error('Code Raised');
    } else if (!res.isValid && res.item) {
      this.globalobjects.clickedbutton = false;
      //  this.globalobjects.presentAlert("Please enter valid " + res.error_item);
      event.rase = true;
      res.rase = true;
      this.clearQue();
      // this.globalobjects.setFocus(true);
      this.lhs_lib.msgbox(event, "Please enter valid " + res.error_item, "");
      // throw new Error('Code Raised');
      // throw new Error('Code Raised');
    }

    return res;

  }

  app_required_record_loc(event, fromFrame, index?) {


    let frame;
    if (fromFrame) {
      frame = this.lhs_lib.get_frame_config(fromFrame);
    } else {
      frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seq_id);
    }


    let rowIndex = index;

    rowIndex = this.lhs_lib.get_current_record(index, frame) ?? 0;

    if (!rowIndex) { rowIndex = 0; }
    let count = 0;
    let res: any = {
      isValid: true,
      item_str: ""
    };

    if (frame.tableRows && frame.tableRows[rowIndex]) {
      for (let itemGroup of frame.tableRows[rowIndex]) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          for (let item of itemGroup.Level5) {
            if ((((item.data_required_flag == 'T' && (!item.isValid || item.value == undefined || item.value == null || item.value === "")) || item.forcedInvalid || item.forced_error_msg) && ((item.item_type != 'TEXT_DISPLAY') && (item.item_type != 'BUTTON') && (item.item_type != 'BUTTON_ICON')
              && (item.item_type != 'BAND') && (item.item_type != 'FRAME_SEPARATOR') && (item.item_type != 'SEPARATOR') && (item.item_type != 'IMAGE_SLIDER')) && (!item.item_name.includes('FRAME_RECORD_')) && (item.item_type != 'FRAME_BUTTON_ICON'))) {
              item.isValid = false;
              item.isValid = false;
              res.isValid = item.isValid;
              res.item = item;
              item.touched = true;
              item.vadidateMsg = item.tool_tip ? item.tool_tip : "Please enter valid " + (item.prompt_name ? item.prompt_name : item.item_name);
              // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frame.apps_page_frame_seqid);
              this.lhs_lib.refreshFrameItems[event.apps_item_seqid + '_' + (event.indexcount ?? 0) + '#' + event.apps_page_frame_seqid] = "Y";
              if (count < 2) {
                res.item_str = res.item_str + "," + (item.prompt_name ? item.prompt_name : item.item_name);
                res.error_item = res.item_str;
              } else if (count == 2) {
                res.item_str = res.item_str + " and more";
                res.error_item = res.item_str;
              }
              count++;

            }
          }
        }
      }
    }

    if (!res.isValid && !res.item) {
      this.globalobjects.clickedbutton = false;
      //  this.globalobjects.presentAlert("Please correct all the errors and enter valid input");
      event.rase = true;
      res.rase = true;
      this.clearQue();
      // this.globalobjects.setFocus(true);
      this.lhs_lib.msgbox(event, "Please correct all the errors and enter valid input", "");
      // throw new Error('Code Raised');
      // throw new Error('Code Raised');
    } else if (!res.isValid && res.item) {
      this.globalobjects.clickedbutton = false;
      //  this.globalobjects.presentAlert("Please enter valid " + res.error_item);
      event.rase = true;
      res.rase = true;
      this.clearQue();
      // this.globalobjects.setFocus(true);
      this.lhs_lib.msgbox(event, "Please enter valid " + res.error_item, "");
      // throw new Error('Code Raised');
      // throw new Error('Code Raised');
    }

    return res;

  }



  checkValidTemp(frameId, tableRows, item_str, count, editIndexArr?) {
    let res = {
      isValid: true,
      item_str: item_str,
      item: {},
      error_item: item_str,
      count: count,
      error_items_arr: [],
      validate_lov_str: ""
    }
    if (tableRows && tableRows.length > 0) {
      for (let i = 0; i < tableRows.length; i++) {

        if (editIndexArr && (editIndexArr.find(x => x == i) != undefined)) { } else {
          let deleteFlag = this.lhs_lib.get_rows_item(tableRows[i], 'WMA_RECORD_STATUS');

          if (deleteFlag && deleteFlag.value != 'D' && !deleteFlag.extra_record) {
            for (let itemGroup of tableRows[i]) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {

                  if (item.post_events_str && item.post_events_str.toLowerCase().includes("validate_lov") && (item.validate_flag == 'T')) {
                    res.validate_lov_str = res.validate_lov_str + item.apps_item_seqid + ",";
                  }
                  //if ((item.isValid !== undefined && !item.isValid && item.data_required_flag != 'F')) {
                  if ((((item.data_required_flag == 'T' && (!item.isValid || item.value == undefined || item.value == null || item.value === "")) || item.forcedInvalid || item.forced_error_msg) && ((item.item_type != 'TEXT_DISPLAY') && (item.item_type != 'BUTTON') && (item.item_type != 'BUTTON_ICON')
                    && (item.item_type != 'BAND') && (item.item_type != 'FRAME_SEPARATOR') && (item.item_type != 'SEPARATOR') && (item.item_type != 'IMAGE_SLIDER')) && (!item.item_name.includes('FRAME_RECORD_')) && (item.item_type != 'FRAME_BUTTON_ICON'))) {
                    item.isValid = false;
                    res.isValid = item.isValid;
                    res.item = item;
                    item.touched = true;
                    item.vadidateMsg = item.tool_tip ? item.tool_tip : "Please enter valid " + (item.prompt_name ? item.prompt_name : item.item_name);
                    // this.cdEngine.detect(item.apps_item_seqid + '_' + item.indexcount + '#' + frameId);
                    this.lhs_lib.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frameId] = "Y";
                    res.error_items_arr.push(item);
                    if (count < 2) {
                      res.item_str = res.item_str + "," + (item.prompt_name ? item.prompt_name : item.item_name);
                      res.error_item = res.item_str;
                    } else if (count == 2) {
                      res.item_str = res.item_str + " and more";
                      res.error_item = res.item_str;
                    }
                    count++;

                  }
                }
              }
            }
          }
        }
      }
    }
    res.count = count;
    return res
  }

  closeCanvas() {
    this.canvasModal.popDismiss();
  }

  openPage(componentProps) {

    // console.log(componentProps);
    // console.log('popover');

    if (this.globalobjects.currentPageNo < 0) {
      this.globalobjects.currentPageNo = 0;
    }
    // if (!this.globalobjects.breadCrumpsSameObjArray || this.globalobjects.currentPageNo == this.globalobjects.breadCrumpsSameObjArray.length) {
    //   this.globalobjects.navigateParam = false;
    // }
    if (!this.globalobjects.navigateParam && this.breadCrumsuper) {

      this.globalobjects.breadCrumpsArray.push({ ...this.breadCrumsuper, iud_seqid: this.object_mast.iud_seqid });

      if (this.breadCrumsuper && !this.breadCrumsuper.calling_object_code) {
        // this.breadCrumsuper.breadCrumpPageNo = this.globalobjects.breadCrumpsSameObjArray.length + 1;
        // this.globalobjects.breadCrumpsSameObjArray.push(this.breadCrumsuper);
      } else {
        // this.globalobjects.breadCrumpsSameObjArray = [];
        this.globalobjects.currentPageNo = 0;
        // this.breadCrumsuper.breadCrumpPageNo = this.globalobjects.breadCrumpsSameObjArray.length + 1;
        // this.globalobjects.breadCrumpsSameObjArray.push(this.breadCrumsuper);
      }
    }
    if (!componentProps.noBreadcrumbAdd) {
      const tabGet: any = document.querySelectorAll('app-my-tab')
      for (let [index, tabTag] of tabGet.entries()) {
        if (componentProps.activeTabIndex) {
          if (componentProps.activeTabIndex == index) {
            for (let dt of this.lhs_lib.adata) {
              if (index == dt.index) {
                dt.breadcrumbBar.push({ ...this.breadCrumsuper, iud_seqid: this.object_mast.iud_seqid })
              }
            }
          }
        } else if (!tabTag.childNodes[0].hasAttribute("hidden")) {
          for (let dt of this.lhs_lib.adata) {
            if (index == dt.index) {
              dt.breadcrumbBar.push({ ...this.breadCrumsuper, iud_seqid: this.object_mast.iud_seqid })
            }
          }
        }
      }
    }


    this.modalFlag = this.object_mast.Level2[this.page_no].Level3.popoverFlag;
    if (componentProps.wscp.flag != 'P') {
      this.globalobjects.mydatavariable = componentProps;
    }

    if (this.clicked_frame_seq) {
      componentProps.clicked_frame_seq = this.clicked_frame_seq;
    }
    //this.itemClicked(event);

    if (componentProps.wscp.object_code == "READ_NOTIFICATION") {
      this.modalCtrl.dismiss();
    }

    if (this.globalobjects.userDetails.homeObjectCode == this.object_mast.object_code) {
      this.dataService.terminateAllRequest().then((res) => {
        if (!res) {
          this.object_mast.resumeRequest = true;
        }
      });
    }



    if (componentProps.wscp.flag == 'O') {
      componentProps.superId = this.superId;
      componentProps.isModal = "O";

      // const modal1 = await this.popOverCtrl.create({
      //   component: SuperPage,
      //   animated: false,
      //   cssClass: 'pop-ion-content custom-form-popup',
      //   componentProps: componentProps,
      //   id: "globalPopover",
      //   backdropDismiss: false,
      // });
      let style: any = "";
      let cssClass = 'offcanvas-end';
      //  x/y/h/w
      // x bottom
      // componentProps.popoverStyle='#popover$x=5%$y=20%$h=100%$w=40%$#';
      // componentProps.popoverStyle = '#popover$h=100%$w=75%$#';
      if (componentProps.popoverStyle) {
        // let style = " top:12% !important; width:75% !important; height:55% !important;overflow:hidden !important;transform: translate(0, 0) !important;";

        // setTimeout(() => {
        // modal1.lastElementChild.setAttribute('style', 'display:none;');
        // await document.querySelector('#globalPopover').shadowRoot.querySelector('.popover-content').setAttribute('style', style)
        // })

        if (componentProps.popoverStyle.toLowerCase().indexOf('offcanvas') > -1) {

          let str = componentProps.popoverStyle.split("(")[1].split(")")[0];

          if (str) {
            let styleArr = str.split(',');
            let obj: any = {};
            for (let x of styleArr) {
              let key = x.split('=');
              if (key[1]) {
                key[1] = key[1].replaceAll("'", '');
              }
              if (key[0]) {
                key[0] = key[0].replaceAll("'", '');
              }
              if (key[0].toLowerCase() == 'w') {
                obj.width = key[1];
              }
              if (key[0].toLowerCase() == 's') {
                if (key[1] == 'L') {
                  cssClass = "offcanvas-start"
                }
              }
            }
            style = ""
            for (let x in obj) {
              style = `${x}:${obj[x]} !important`;
            }
          }
        }
      }

      let id = 'deskcardCanvas';

      let title = ""
      this.canvasModal.openoffCanvas(SuperPage, componentProps, id, cssClass, title, style, true).then(async (detail) => {
        this.breadCrumpClose()
        if (!this.lhs_lib.isTabclose) {
          this.afterModalOnDismiss(detail, componentProps)
          // this.subscribeSuperParent()
        } else {
          this.lhs_lib.isTabclose = false
        }
      })

      this.globalobjects.currentPageNo++;
    } else if (componentProps.wscp.flag == 'P') {
      componentProps.superId = this.superId;
      componentProps.isModal = "P";

      let id = 'globalNewModal';
      let cssClass = componentProps.popup_class ? componentProps.popup_class : '';
      let title = ""
      let style: any = "";
      let flag: boolean = false;
      if (componentProps.popoverStyle && !componentProps.popup_class) {
        if (componentProps.popoverStyle.toLowerCase().indexOf('popup') > -1) {

          let str = componentProps.popoverStyle.split("(")[1].split(")")[0];

          if (str) {
            let styleArr = str.split(',');
            let obj: any = {};
            for (let x of styleArr) {
              let key = x.split('=');
              if (key[1]) {
                key[1] = key[1].replaceAll("'", '');
              }
              if (key[0]) {
                key[0] = key[0].replaceAll("'", '');
              }
              if (key[0].toLowerCase() == 'x') {
                obj.left = key[1];
              }
              if (key[0].toLowerCase() == 'y') {
                obj.top = key[1];
              }
              if (key[0].toLowerCase() == 'w') {
                obj.width = key[1] + "!important";
              }
              if (key[0].toLowerCase() == 'h') {
                obj.height = key[1];
              }
              if (key[0].toLowerCase() == 'd') {
                if (key[1] == 'T') {
                  flag = true
                }
              }

            }

            style = "";
            let i = 0;
            for (let x in obj) {
              i++;
              if (i < Object.keys(obj).length) {
                style = style + x + ' : ' + obj[x] + ';';
              } else {
                style = style + x + ' : ' + obj[x] + ';';
              }
            }
            style = style + ";";
          }
        }
      }


      if (!cssClass) {
        cssClass = cssClass + 'no_css_popup';
      }
      this.canvasModal.openModal(SuperPage, componentProps, id, '', cssClass, flag, style, true).then((detail) => {
        this.breadCrumpClose()
        if (!this.lhs_lib.isTabclose) {
          this.afterModalOnDismiss(detail, componentProps)
          // this.subscribeSuperParent()
        } else {
          this.lhs_lib.isTabclose = false
        }
      })

      this.globalobjects.currentPageNo++;
    }

    else {

      let modal: any;
      // //console.log('vijay1111 ',componentProps.wscp.object_code);
      componentProps.superId = this.superId;
      componentProps.isModal = "M";
      // modal = await this.modalCtrl.create({
      //   // component: SuperParentPage,
      //   animated: false,
      //   // componentProps: { data: componentProps },
      //   component: SuperPage,
      //   componentProps: componentProps,
      //   backdropDismiss: this.backdismiss,
      //   id: JSON.stringify(componentProps.wscp.apps_item_seqid)
      // });


      // modal.onDidDismiss().then((detail: OverlayEventDetail) => {



      //   this.globalobjects.pageId--;
      //   this.globalobjects.pageEventId--;

      //   this.events.unsubscribe("jsonData" + this.globalobjects.pageEventId);

      //   if (this.object_mast.timerObj) {
      //     let timerEv = this.globalobjects.timerEvents.filter(x => x.object_code == this.object_mast.object_code);
      //     if (timerEv && timerEv.length > 0) {
      //       for (let t of timerEv) {
      //         if (t.runEvFlag == false) {
      //           //  t.runEvFlag = true;
      //         }
      //       }
      //     }
      //   }

      //   if (this.globalobjects.navigateIndex != null) {
      //     if (this.page_no > this.globalobjects.navigateIndex) {
      //       this.closePage();
      //     } else {
      //       this.globalobjects.navigateIndex = null;

      //     }
      //   }


      //   // this.lhs_lib.object_mast = this.object_mast;
      //   this.afterDestroy();

      //   this.setPassData(componentProps);


      //   if (this.globalobjects.currentPageNo == 0) {
      //     this.globalobjects.breadCrumpsSameObjArray = [];
      //   }


      //   if (this.order_pageno == 2) {
      //     this.globalobjects.cartSummaryPlain = [];
      //     //this.globalobjects.summaryCartdeatail
      //     this.order_pageno = 0;
      //   }hdekhekjdhehe




      //   if (detail) {
      //     if (detail.data) {
      //       let itm = detail.data.itmData;
      //       let errData = detail.data.errorData;
      //       if (errData) {
      //         if (itm && itm.apps_page_no < this.page_no + 1) {
      //           let obj = {
      //             errorData: errData,
      //             itmData: itm
      //           }
      //           this.modalCtrl.dismiss(obj);
      //         } else {
      //           // this.globalobjects.setFocus(true);
      //           this.go_to_error_item(errData, errData)
      //         }
      //       }
      //       // this.getNotificationCount();
      //     }

      //     ///**** for get_object_config_exit */

      //   }
      //   if (this.object_mast.operation_mode_Arr && this.page_no == 0) {
      //     for (let o of this.object_mast.operation_mode_Arr) {
      //       if (o && o.indexOf('BACK_REFRESH') > -1) {
      //         let str = o.toLowerCase().replaceAll("'", "").split("(")[1].split(")")[0];
      //         this.back_refresh(str);
      //       }
      //     }

      //   }
      //   this.closeAllModal(componentProps);


      //   if (detail && detail.data && detail.data.open_new_page) {
      //     delete detail.data['open_new_page'];

      //     this.openPage(detail.data);
      //   }
      //   // if (this.lhs_lib.dynamicTabs.length > 0) {
      //   //   let tabs: any = document.getElementsByTagName('app-my-tabs')
      //   //   const lastItem = tabs[tabs.length - 1];

      //   //   if (lastItem.childNodes[0].children[0].childNodes[0].hasAttribute("style")) {
      //   //     lastItem.childNodes[0].children[0].childNodes[0].style.display = "block";
      //   //   }
      //   //   for (let tab of this.lhs_lib.dynamicTabs) {

      //   //     const componentElement = tab.location.nativeElement as HTMLElement
      //   //     this.ren.appendChild(lastItem.childNodes[0], componentElement);
      //   //   }
      //   // }
      // });
      // this.globalobjects.currentPageNo++;
      // modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      //   this.afterModalOnDismiss(detail, componentProps)
      // })

      this.canvasModal.superModal(SuperPage, componentProps, JSON.stringify(componentProps.wscp.apps_item_seqid)).then((detail: OverlayEventDetail) => {

        if (!this.lhs_lib.isTabclose) {
          this.afterModalOnDismiss(detail, componentProps)
          // this.subscribeSuperParent()
        } else {
          this.lhs_lib.isTabclose = false
        }

      })

      // let a= await this.canvasModal.superModal(SuperPage,componentProps,JSON.stringify(componentProps.wscp.apps_item_seqid)).subscribe({
      //   next: (detail) => this.afterModalOnDismiss(detail, componentProps),
      //   error: (err) => console.error('Error:', err),
      //   complete: () => console.log('Completed'),
      // });
      //  a.unsubscribe()

      //  then((detail: OverlayEventDetail)=>this.afterModalOnDismiss(detail, componentProps))

      // this.globalobjects.currentPageNo++;
      // return await modal.present();
    }


    if (componentProps && componentProps.click_events_str && componentProps.click_events_str.includes("app_open_page")) {

    } else if (this.clickEvent) {
      this.clickEvent.opening_object = true;
    }


  }

  afterModalOnDismiss(detail, componentProps) {
    // modal.onDidDismiss().then((detail: OverlayEventDetail) => {

    // supercomp = this;
    // utilvar = this;

    this.globalobjects.pageId--;
    this.globalobjects.pageEventId--;

    this.events.unsubscribe("jsonData" + this.globalobjects.pageEventId);

    if (this.object_mast.timerObj) {
      let timerEv = this.globalobjects.timerEvents.filter(x => x.object_code == this.object_mast.object_code);
      if (timerEv && timerEv.length > 0) {
        for (let t of timerEv) {
          if (t.runEvFlag == false) {
            //  t.runEvFlag = true;
          }
        }
      }
    }

    if (this.globalobjects.navigateIndex != null) {
      if (this.page_no > this.globalobjects.navigateIndex) {
        this.closePage();
      } else {
        this.globalobjects.navigateIndex = null;

      }
    }


    // this.lhs_lib.object_mast = this.object_mast;
    this.afterDestroy();

    this.setPassData(componentProps);


    if (this.globalobjects.currentPageNo == 0) {
      this.globalobjects.breadCrumpsSameObjArray = [];
    }


    if (this.order_pageno == 2) {
      this.globalobjects.cartSummaryPlain = [];
      //this.globalobjects.summaryCartdeatail
      this.order_pageno = 0;
    }




    if (detail) {
      if (detail.data) {
        let itm = detail.data.itmData;
        let errData = detail.data.errorData;
        if (errData) {
          if (itm && itm.apps_page_no < this.page_no + 1) {
            let obj = {
              errorData: errData,
              itmData: itm
            }
            this.modalCtrl.dismiss(obj);
          } else {
            // this.globalobjects.setFocus(true);
            // this.go_to_error_item(errData, errData)
          }
        }
        // this.getNotificationCount();
      }

      ///**** for get_object_config_exit */

    }
    if (this.object_mast.operation_mode_Arr && this.page_no == 0 && componentProps.object_mast.object_code !== "WMABLD48") {
      for (let o of this.object_mast.operation_mode_Arr) {
        if (o && o.indexOf('BACK_REFRESH') > -1) {
          let str = o.toLowerCase().replaceAll("'", "").split("(")[1].split(")")[0];
          this.back_refresh(str);
        }
      }

    }
    this.closeAllModal(componentProps);


    if (detail && detail.data && detail.data.open_new_page) {

      console.log("open_new_page details get=============>  ", detail);
      delete detail.data['open_new_page'];
      this.get_object_config(detail.data)
      // this.openPage(detail.data);
    } else {
      console.log("resubscription call after dismiss============>  ", detail);
      if (this.plt != 'browser') {
        if (componentProps.object_mast.object_code !== "WMABLD48") {
          this.subscribeSuperParent();
        }
      } else {
        this.subscribeSuperParent();
      }

    }
      if(!this.plt){
        this.mobileViewQuickAction();
      }
    this.lhs_lib.setObjectMastTab()
    // if (this.lhs_lib.dynamicTabs.length > 0) {
    //   let tabs: any = document.getElementsByTagName('app-my-tabs')
    //   const lastItem = tabs[tabs.length - 1];

    //   if (lastItem.childNodes[0].children[0].childNodes[0].hasAttribute("style")) {
    //     lastItem.childNodes[0].children[0].childNodes[0].style.display = "block";
    //   }
    //   for (let tab of this.lhs_lib.dynamicTabs) {

    //     const componentElement = tab.location.nativeElement as HTMLElement
    //     this.ren.appendChild(lastItem.childNodes[0], componentElement);
    //   }
    // }
    // });
    // this.globalobjects.currentPageNo++;

    if (componentProps && componentProps.wscp) {
      let item = this.lhs_lib.get_item(componentProps.wscp.apps_page_frame_seqid + '.' + componentProps.wscp.apps_item_seqid, 'current_record');
      if (item) {
        this.lhs_lib.go_item(item.item_name, 'current_record', true);
      }
    }

  }
  async open_model_page(event, componentProps) {
    // //console.log(componentProps);
    // if()
    componentProps.isModal = "M";
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        // component: SuperPage,
        animated: false,
        component: EntryListPage,
        backdropDismiss: this.backdismiss,
        componentProps: componentProps
      });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail) {
        if (detail.data) {
          this.getPageInfo();
        }
      }
      if (this.object_mast.operation_mode_Arr && this.object_mast.operation_mode_Arr.indexOf('BACK_REFRESH') > -1) {
        // this.ngOnInit();
        this.back_refresh(event);
      }
    });
    return await modal.present();
  }

  async open_approval_page(componentProps) {

    this.openPage(componentProps);
    // //console.log(componentProps);
    /*  componentProps.isModal = "M";
     let modal: HTMLIonModalElement =
       await this.modalCtrl.create({
         component: SuperPage,
         // component: EntryListPage,
         componentProps: componentProps
       });
     //console.log(this.object_mast);
     modal.onDidDismiss().then((detail: OverlayEventDetail) => {

       if (detail) {
         if (detail.data) {
           this.getPageInfo();
         }
       }
       if (this.operation_mode && this.operation_mode.indexOf('BACK_REFRESH') > -1) {
         this.ngOnInit();
       }
     });
     return await modal.present(); */
  }

  app_add_para_back_process() {
    let arr = []
    if (this.globalobjects.callingParameterBack.length > 0) {
      for (let g of this.globalobjects.callingParameterBack) {
        if (!g.object_code || g.object_code == this.object_mast.object_code) {
          try {
            eval(g.str);
          } catch {
            console.log(g.str);
          }
        } else {
          arr.push(g);
        }
      }
    }
    this.globalobjects.callingParameterBack = arr;
  };

  async open_model_multilevel_page(componentProps) {
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        animated: false,
        component: MultiLevelTabPage,
        backdropDismiss: this.backdismiss,
        componentProps: componentProps
      });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {

      if (this.object_mast.operation_mode_Arr && this.object_mast.operation_mode_Arr.indexOf('BACK_REFRESH') > -1) {
        // this.ngOnInit();
        // this.back_refresh(event);
      }
    });
    return await modal.present();
  }

  // openMultiTabpage() {
  //   this.navCtrl.navigateForward("multi-level-tab");
  // }
  async openNotification() {
    if (this.isModal == "M") {
      this.modalCtrl.dismiss();
    }
    let componentProps: any = {};
    let wslp: any = {};
    this.wscp = {};
    let wsdp: any = [];
    wslp = this.globalobjects.userDetails;
    this.wscp.object_code = "READ_NOTIFICATION";
    this.wscp.pageno = "null";
    this.wscp.click_events_str = "get_object_config";
    this.wscp.service_type = "get_object_config";

    componentProps = {
      "wslp": wslp,
      "wscp": this.wscp,
      "wsdp": wsdp
    }

    componentProps.isModal = "M";
    // let componentProps = {
    //   "wslp": {
    //     "app_code_str": "EMP_DR"
    //   },
    //   "wscp": {
    //     "object_code": "APP_NOTIFICATION",
    //     "pageno": null,
    //     "click_events_str": "get_object_config",
    //     "service_type": "get_object_config"
    //   },
    //   "wsdp": [
    //     {}
    //   ]
    // }

    //console.log("componrnt....", componentProps)
    let modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        animated: false,
        component: SuperPage,
        backdropDismiss: this.backdismiss,
        componentProps: componentProps
      });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      // this.lhs_lib.object_mast = this.object_mast;
      this.afterDestroy();
      this.wscp = {};
      if (detail) {
        if (detail.data) {
          // this.getNotificationCount();
        }
        if (this.object_mast.operation_mode_Arr && this.object_mast.operation_mode_Arr.indexOf('BACK_REFRESH') > -1) {
          // this.ngOnInit();
          //  this.back_refresh();
        }
      }
        if(!this.plt){
        this.mobileViewQuickAction();
      }
    });
    return await modal.present();
  }

  opentoast() {
    this.globalobjects.presentToastWithOptions("Error in Handler", "errorclass");
  }

  popDismiss() {
    this.popoverdismiss = false;
    this.popOverCtrl.dismiss();
    // this.modalGlobal.popDismiss()
    this.breadCrumpClose()
    // this.openPage( this.globalobjects.mydatavariable);

  }



  //Back Button code fos shortcut key
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   // Check if a specific key combination is pressed
  //   if (event.altKey && event.key === 'b') {
  //     // Perform your action here, for example saving data
  //     this.closePage();
  //      console.log('Ctrl + B pressed');
  //   }
  // } 
  //-----------------------------------------------------------

  // @HostListener('document:keydown.alt.b', ['$event'])
  closePageKey(event: KeyboardEvent) {
    event.preventDefault();
    // this.closePage();
    // this.dismissObject();
    if (this.isModal == "M" || this.isModal == "Menu") {
      this.triggerClickEvent();
      this.breadCrumpClose();
    }
    else if (this.isModal == "O") {
      this.offCanvasClick()
    } else if (this.isModal == "P") {
      this.modalClick()
    }
  }


  closePage(event?, clickEventStr?) {

    clearInterval(this.timerFunc);
    this.dataService.terminateAllRequest();
    if (this.object_mast && this.object_mast.timerObj && this.page_no == 0) {
      let i = 0;
      let arr = JSON.parse(JSON.stringify(this.globalobjects.timerEvents));
      for (let x = 0; x < this.globalobjects.timerEvents.length; x++) {
        if (arr[i].object_code == this.object_mast.object_code && arr[i].runEvFlag == true) {
          arr.splice(i, 1);
          i--;
        }
        i++;
      }
    }
    this.globalobjects.breadCrumpsBackPageNo = this.globalobjects.currentPageNo - 1;
    // if (this.globalobjects.breadCrumpsSameObjArray && this.globalobjects.breadCrumpsSameObjArray.length > 1) {
    //   this.globalobjects.navigateParam = true;
    // }
    if (this.object_mast && this.object_mast.Level2) {
      let glob = this.globalobjects.refreshObj.find(x => x.refreshObj == this.object_mast.object_code);
      if (glob) {
        glob.refreshFlag = false
      }
      if (this.object_mast.Level2[this.page_no]) {
        for (let obj of this.object_mast.Level2[this.page_no].Level3) {
          let seqNo = obj.apps_page_frame_seqid.toLowerCase();
          let name = "refreshFrame" + seqNo.replace(/-/g, '_') + this.globalobjects.refreshId;
          let name2 = "refreshFrame" + (obj.frame_alias ? obj.frame_alias.replace(/-/g, '_') : '') + this.globalobjects.refreshId;
          this.events.unsubscribe(name);
          this.events.unsubscribe(name2);
        }
      }
      if (this.globalobjects.refreshId > 0) {
        this.globalobjects.refreshId--;
      }
    }

    try {

      if (this.object_mast.Level2[this.page_no].Level3.popoverFlag == "P") {
        this.canvasModal.popDismiss();
        // if (event && event.click_events_arr.length > (event.click_events_count + 1)) {
        //   event.click_events_count = event.click_events_count + 1;
        //   this.itemClicked1(event, clickEventStr);
        // }
      } else {
        // this.modalCtrl.dismiss();
        this.isPageBack = true
        this.canvasModal.popDismiss()
        this.breadCrumpClose()

        // if (event && event.click_events_arr.length > (event.click_events_count + 1)) {
        //   event.click_events_count = event.click_events_count + 1;
        //   this.itemClicked1(event, clickEventStr);
        // }
      }
    } catch (e) {

      // this.modalCtrl.dismiss();
      this.canvasModal.popDismiss()
      this.breadCrumpClose()
      // if (event && event.click_events_arr.length > (event.click_events_count + 1)) {
      //   event.click_events_count = event.click_events_count + 1;
      //   this.itemClicked1(event, clickEventStr);
      // }

    }
    this.removeFrameStyle()
  }
  breadCrumpClose() {

    console.log("breadCrumpClose page run ======>>>>>>>>>>>")
    // for (let [index, tabTag] of this.lhs_lib.myTab.entries()) {
    //   if (!tabTag.childNodes[0].hasAttribute("hidden")) {
    //     for (let dt of this.lhs_lib.adata) {
    //       if (index == dt.index) {
    //         dt.breadcrumbBar.pop()
    //         console.log(dt.breadcrumbBar)
    //       }
    //     }
    //   }
    // }
    for (let dt of this.lhs_lib.adata) {
      if (dt.active) {
        dt.breadcrumbBar.pop()
      }
    }
  }
  popupClosePage() {

    if (this.object_mast && this.object_mast.Level2) {
      let glob = this.globalobjects.refreshObj.find(x => x.refreshObj == this.object_mast.object_code);
      if (glob) {
        glob.refreshFlag = false
      }

      for (let obj of this.object_mast.Level2[this.page_no].Level3) {
        let seqNo = obj.apps_page_frame_seqid.toLowerCase();
        let name = "refreshFrame" + seqNo.replace(/-/g, '_') + this.globalobjects.refreshId;
        let name2 = "refreshFrame" + (obj.frame_alias ? obj.frame_alias.replace(/-/g, '_') : '') + this.globalobjects.refreshId;
        this.events.unsubscribe(name2);
        this.events.unsubscribe(name);
      }
    }
    if (this.object_mast.Level2[this.page_no].Level3.popoverFlag == "P") {
      // this.globalobjects.popoverFlag = 'M'
      this.popOverCtrl.dismiss();
      this.modalCtrl.dismiss();
    }
    // this.events.unsubscribe("refreshFrame");
    // }
  }

  getNotificationCount() {
    let userDetails = this.globalobjects.userDetails;
    var data = {
      "parameters": userDetails
    }
    let url = "getNotificationCount";
    try {
      //console.log("Notication: " + (userDetails))
      //console.log("Notication: " + url)

      this.dataService.postData(url, data).then(res => {
        let data: any = res;
        // this.notificationCount = [];
        if (data.responseStatus == "success") {
          this.notificationCount = data.responseData;
        }
      })
    } catch (error) {
      this.globalobjects.presentAlert("LHSSYS_PORTAL_NEWS DOESN'T EXIST !!");
    }
  }

  refreshObjFab() {
    if (this.page_no == 0) {
      // this.refreshFlag = true;
      this.globalobjects.plastoFrameSumm = [];
      this.globalobjects.cartSummaryPlain = [];
      this.globalobjects.focusedItem = "";
      // this.globalobjects.cartSummaryPlain = [];

      this.objRefreshFlag = true;
      this.click_events_str = "";
      if (this.globalobjects.networkStatus) {
        this.refreshObj = true;
      }
      // this.globalobjects.setFocus(true);

      this.dataService.terminateAllRequest();
      let offlineObjectCode: any;
      this.wscp.apps_working_mode = this.object_mast.apps_working_mode;

      if (this.object_mast.local_storage_flag != "F") {
        if (this.wscp) {
          if (this.wscp.object_code) {
            offlineObjectCode = this.wscp.object_code;
          }
          else {
            offlineObjectCode = this.globalobjects.userDetails.homeObjectCode;
          }
        }
        let pouchObjectKey = offlineObjectCode;
        this.object_mast._id = pouchObjectKey;

        var temp: any = {};
        var id = pouchObjectKey;

        if (this.wscp.local_Item_Seq_Id) {
          id = id + '#' + this.wscp.local_Item_Seq_Id;
        } else {
          if (this.wscp.apps_item_seqid) {
            id = id + '#' + this.wscp.apps_item_seqid;
          }
        }

        temp = {
          id: id,
          _id: id
          // objData: JSON.stringify(this.object_mast)
        }
      }

      this.sqlLiteServ.getById(id, 'object_master').then(data => {
        if (data.resStatus == 'Success') {
          // temp.rev = data.resData._rev;
          // this.events.publish("refreshLocal", data.resData);

          this.sqlLiteServ.deleteObjMast(data.resData, 'object_master').then(ress => {
            console.log("Sucess", ress);
          })
        }
      })



      if (this.object_mast && this.object_mast.Level2) {
        for (let obj of this.object_mast.Level2[0].Level3) {
          let seqNo = obj.apps_page_frame_seqid.toLowerCase();
          let name = "refreshFrame" + seqNo.replace(/-/g, '_') + this.globalobjects.refreshId;
          let name2 = "refreshFrame" + (obj.frame_alias ? obj.frame_alias.replace(/-/g, '_') : '') + this.globalobjects.refreshId;
          this.events.unsubscribe(name2);
          this.events.unsubscribe(name);
        }

        this.removeFrameStyle()
      }

      if (this.globalobjects.logFlag) {
        this.globalobjects.excuted_events_logs = [];
      }
      this.isRefresh = true;
      // this.object_mast = null;
      this.refreshPage();
    } else {
      this.globalobjects.reloadObjectFlag = true
      if (this.isModal == "M" || this.isModal == "Menu") {
        this.triggerClickEvent();
        this.breadCrumpClose();
      } else if (this.isModal == "O") {
        this.offCanvasClick()
      } else if (this.isModal == "P") {
        this.modalClick()
      }
    }

    // this.gotosuper();
  }

  removeFrameStyle() {
    for (let object_mast of this.object_mast.Level2) {
      for (let obj of object_mast.Level3) {
        let stylesheet: any = document.styleSheets[0];
        const rules = stylesheet.cssRules || stylesheet.rules; // use the appropriate property for your browser
        if (obj.frameStyle) {
          for (let st of obj.frameStyle) {
            for (let i = 0; i < rules.length; i++) {
              if (rules[i].selectorText === st) {
                stylesheet.deleteRule(i);
              }
            }
          }
        }
        if (obj.frameStyleFreeze) {
          for (let st of obj.frameStyleFreeze) {
            for (let i = 0; i < rules.length; i++) {
              if (rules[i].selectorText === st) {
                stylesheet.deleteRule(i);
              }
            }
          }
        }
      }
    }
  }
  isRefresh: boolean = false
  refreshPage() {

    if (this.object_mast) {
      delete this.object_mast['engine_filter_frames'];
    }

    this.wscp = JSON.parse(JSON.stringify(this.holdWscp));

    if (this.tabflag) {
      this.isModal = "Menu";
      this.tabflag2 = true;
      this.wscp = {};
      this.wsdp = [];
      this.wsdpcl = [];
      if (!this.globalobjects.userDetails) {

        this.globalobjects.userDetails = this.globalobjects.getLocallData("userDetails");
      }
      this.ngOnInit();
    } else {
      if (!this.wscp.object_code) {
        this.wscp.object_code = this.object_mast.Level2[this.page_no].object_code;
      }
      this.wsdp = [];
      this.wsdpcl = this.lhs_lib.getDpcl();
      this.wscp.service_type = null;
      this.ngOnInit();
    }
  }

  switchAppKey() {
    //  this.navCtrl.
    this.router.navigate(['appkey-collection']);
    console.log("switchappkey  in the superpage")
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }



  fabDrop() {
    let top = this.fabbtn.nativeElement.getBoundingClientRect().top;
    if (top < 48) {
      this.events.publish("setappkeyInfoVisibility", 'Y');
    } else {
      this.events.publish("setappkeyInfoVisibility", 'N');
    }
  }

  trackingEvent(type, event, clickEventStr) {
    if (type === 'START') {
      this.globalobjects.setDataLocally("locationStartTime", new Date());
      this.globalobjects.userDetails.interval_time = event.interval_time;
      this.globalobjects.setDataLocally("userDetails", this.globalobjects.userDetails);
      this.background.start(event.interval_time);
      // this.background.startgpsEntry();
    }
    else {
      this.globalobjects.destroyLocalData("locationStartTime");
      this.background.stop();
      // this.background.endgpsEntry();
    }
    // if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, clickEventStr);
    // }

  }

  ionViewWillLeave() {
    if (this.modalFlag == 'M') {
      this.modalCtrl.dismiss();
    }
  }

  concatFun(nextPageInfo, event, clickEventStr) {
    this.concatKey = nextPageInfo.concatKey;
    let newTableRows = [];
    for (let obj of this.object_mast.Level2) {
      for (let frame of obj.Level3) {
        for (let conKey of this.concatKey) {
          if (frame.apps_page_frame_seqid == conKey) {
            for (let tabData of frame.tableRows) {
              for (let itemGrp of tabData) {
                newTableRows.push(itemGrp);
              }
            }
          }
        }
      }
    }
    this.concatArr.push(newTableRows);
    // if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, clickEventStr);
    // }

  }

  app_append_next_page(event, newPage) {
    let newPageInfo = [];
    let mainPage = this.object_mast.Level2[this.page_no].Level3;
    let flag: boolean = false;

    if (newPage != undefined) {
      newPage = newPage;
    }
    newPageInfo = this.object_mast.Level2;

    let i = 0;
    for (let frame of newPageInfo) {
      if (frame.apps_page_no == newPage) {
        for (let obj of frame.Level3) {
          mainPage.push(obj);
          this.parseBuiltins(obj);
          flag = true;
        }
      }
      i++;
    }
    if (flag) {
      newPageInfo.splice(i, 1);
    }

    return;
  }

  samePageForm(nextPageInfo, event, clickEventStr) {
    this.wsdp = nextPageInfo.wsdp;
    this.wsdpcl = nextPageInfo.wsdpcl;
    this.wscp = nextPageInfo.wscp;

    let flag: boolean = false;

    if (!this.globalobjects.current_page_parameter.MODE) {
      this.globalobjects.current_page_parameter.MODE = '';
    }
    let mainPage = this.object_mast.Level2[0].Level3;
    let newPage;
    if (event.calling_pageno) {
      newPage = event.calling_pageno;
    }
    else {
      newPage = nextPageInfo.samePageNo + 1;
      if (this.globalobjects.samePageNo) {
        newPage = this.globalobjects.samePageNo + 1;
        this.globalobjects.samePageNo = this.globalobjects.samePageNo + 1;
      } else {
        this.globalobjects.samePageNo = newPage;
      }
    }

    let newPageInfo = []
    newPageInfo = this.object_mast.Level2

    for (let frame of newPageInfo) {
      if (frame.apps_page_no == newPage) {
        for (let obj of frame.Level3) {
          mainPage.push(obj);
          flag = true;
        }
      }
    }
    if (flag) {
      let length = newPageInfo[nextPageInfo.samePageNo].Level3.length;
      //console.log(length);
      newPageInfo.splice(nextPageInfo.samePageNo, 1);
      // newPageInfo[nextPageInfo.samePageNo].Level3.splice(0, length);
      this.events.publish("same_page", this.wsdp);
    }

    // if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, clickEventStr);
    // }

    /*
  let obj_mast = []
  obj_mast  = this.object_mast.Level2;
  let arr_page = obj_mast[0].Level3
  let newPage = obj_mast[nextPageInfo.page_no].Level3;

  for(let  i = 0; i < newPage.length ; i++){
    arr_page.push(newPage[i]);

  } */

  }

  shareViaWhatsApp(event, clickEventStr) {
    var object_mast = this.object_mast.Level2;
    let rowindex = 0;
    if (event.itemIndex) {
      rowindex = event.itemIndex;
    }
    for (let object of object_mast) {
      for (let frame of object.Level3) {
        let mobileNo;
        let message;

        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let itemGroup of frame.tableRows[rowindex]) {
            if (frame.apps_frame_type == 'APPROVAL-TAB') {
              for (let itemp of itemGroup) {
                if (itemp.Level5) {
                  for (let item of itemp.Level5) {
                    if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO") {
                      mobileNo = item.value
                    } else if (item.item_name == "SMS" || item.item_name == "SMS_TEXT") {
                      message = item.value
                    }
                  }
                }
              }
            } else {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (event.apps_page_frame_seqid == itemGroup.apps_page_frame_seqid) {
                    if (item.item_name == "MOBILE_NUMBER" || item.item_name == "MOBILENO" || item.item_name == "MOBILE_NO") {
                      mobileNo = item.value
                    } else if (item.item_name == "SMS" || item.item_name == "SMS_TEXT" || item.item_name == "EMAIL_BODY") {
                      message = item.value
                    }
                  }
                }
              }
            }
          }
        }
        try {
          if (mobileNo && message) {

            if (this.platform.is("android") || this.platform.is("ios")) {
              this.globalobjects.shareViaWhatsApp(mobileNo, message);
            } else {
              this.globalobjects.shareViaWhatsAppWeb(mobileNo, message);
            }
          }
        } catch (error) {
          //console.log(error.message);
          // if (event.click_events_arr.length > (event.click_events_count + 1)) {
          //   event.click_events_count = event.click_events_count + 1;
          //   this.itemClicked1(event, clickEventStr);
          // }

        }
        // if (event.click_events_arr.length > (event.click_events_count + 1)) {
        //   event.click_events_count = event.click_events_count + 1;
        //   this.itemClicked1(event, clickEventStr);
        // }

      }
    }
  }

  callLogs(nextPageInfo, event, clickEventStr) {
    this.globalobjects.getContactpermission();
    let callLog = this.globalobjects.recordsFound;
    let wsdp = [];
    let i = 0;
    this.globalobjects.presentAlert(JSON.stringify(callLog));
    for (let x of callLog) {
      let rownumber = i++;
      let date = this.globalobjects.formatDate(x.date, "dd-MMM-yyyy HH:mm:ss");

      let obj = {
        rownumber: rownumber,
        name: x.cachedName,
        duration: x.duration,
        type: x.type,
        number: x.number,
        date: date,
      }
      wsdp.push(obj);
    }

    let wsdpcl = [];
    let reqData: any = {};
    reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": nextPageInfo.wscp,
      "wsdp": wsdp,
      "wsdpcl": wsdpcl,

    }
    this.dataService.postData("S2U", reqData).then(res => {

      //
      let data: any = res;
      let object_arr = data.responseData
      let objData = this.globalobjects.setPageInfo(object_arr);
      // //console.log(data);
      // if (data.responseStatus == "success") {
      //   alert("sucess logs ")
      // }

      if (objData.Level1[0].status == "F") {
        this.globalobjects.presentAlert(objData.Level1[0].message);
      }
      else if (objData.Level1[0].status == "L") {
        sessionStorage.setItem("PLSQL_L", objData.Level1[0].message);
      }
      else if (objData.Level1[0].status == "Q") {
        this.globalobjects.presentAlert(objData.Level1[0].message);
      }
      // if (event.click_events_arr.length > (event.click_events_count + 1) && (objData.Level1[0].status != "Q")) {
      //   event.click_events_count = event.click_events_count + 1;
      //   this.itemClicked1(event, clickEventStr);
      // }

    })
  }

  gotosuper() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      location.reload();
    }
    else {
      let url: any = location;
      if (isPlatformServer(this.platformId)) return;

      window.open(String(url).split('super')[0], '_self');
    }

  }

  sendHtml(e) {

    let wsdpcl = [];
    let wscp: any = {};
    wscp.service_type = "SEND_HTML_MAIL"
    let reqData: any = {};
    let wsdp = [];
    reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": wsdpcl,

    }
    this.dataService.postData("S2U", reqData).then(res => {
      let data: any = res;

      if (data.responseStatus == "success") {
        this.globalobjects.presentAlert("Mail send sucessfull...");
      } else {
        this.globalobjects.presentAlert("Error occured while sending mail, Please try after some time.");
      }
    })
  }

  userStatus() {

    let wsdpcl = [];
    let wscp: any = {};
    wscp.service_type = "userStatus"
    let reqData: any = {};
    let wsdp = [];

    this.platform.ready().then(() => {
      wscp.app_status = 'appStart'
      reqData = {
        "wslp": this.globalobjects.userDetails,
        "wscp": wscp,
        "wsdp": wsdp,
        "wsdpcl": wsdpcl,
      }
      this.dataService.postData("S2U", reqData).then(res => {
      });

      this.platform.resume.subscribe((result) => {
        wscp.app_status = 'appStart'
        reqData = {
          "wslp": this.globalobjects.userDetails,
          "wscp": wscp,
          "wsdp": wsdp,
          "wsdpcl": wsdpcl,
        }
        this.dataService.postData("S2U", reqData).then(res => {
        });
      });

      this.platform.pause.subscribe((result) => {
        wscp.app_status = 'appPause'
        reqData = {
          "wslp": this.globalobjects.userDetails,
          "wscp": wscp,
          "wsdp": wsdp,
          "wsdpcl": wsdpcl,
        }
        this.dataService.postData("S2U", reqData).then(res => {
        });
      });
    })
  }

  addNewRow(event, frame_id) {

    let frame = this.lhs_lib.get_frame_config(frame_id);
    let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
    // let ind = event.itemIndex != undefined ? event.itemIndex : (event.indexcount ? event.indexcount : (event.indexCount ? event.indexCount : 0));
    // let ind = event.indexcount != undefined ? event.indexcount : (event.itemIndex ? event.itemIndex : (event.indexCount ? event.indexCount : 0));
    let ind = this.lhs_lib.getCurrentIndex(frame);
    let checkRecord = frame.new_record_index != undefined && frame.new_record_index > ind ? frame.new_record_index : ind
    let itm = this.lhs_lib.check_row_dirty(event, frame.tableRows[checkRecord]);

    this.lhs_lib.remove_extra_record(frame, true);

    if (itm && itm.frame_status == "dirty") {

      for (let itemGroup of frameLevel4) {
        for (let item of itemGroup.Level5) {
          // item.indexCount = frame.tableRows.length;

          if (item.session_hold_flag == 'T') {
            if (this.sessionObj) {
              item.value = this.sessionObj[item.item_name];
            }
          }
          if (item.item_default_value == 'INDEX') {
            frame.apps_frame_seq_id
            let name = frame.apps_page_frame_seqid + "." + item.apps_item_seqid;
            let val = this.get_item_value(name, frame.tableRows.length - 1);
            item.value = parseInt(val) + 1;
          }
        }
      }

      if (frame.tableRows && frame.tableRows.length > 0) {
        if (frame.tableRows.length <= ind + 1) {
          frame.tableRows.push(frameLevel4);

          if (frame.total_no_of_record + 1 >= frame.tableRows.length) {
            frame.extra_record_count = 0;
          }

        } else {
          frame.tableRows.splice(ind + 1, 0, frameLevel4);
          // let arr = [];
          // for (let i = 0; i < frame.tableRows.length; i++) {
          //   if (i == ind + 1) {
          //     arr.push(frameLevel4);
          //     arr.push(frame.tableRows[i])
          //   } else {
          //     arr.push(frame.tableRows[i])
          //   }
          // }
          // frame.tableRows = arr
        }
        // frame.tableRows.push(frameLevel4);

      } else {
        frame.tableRows[0] = frameLevel4;
      }

      frame.new_record_index = ind + 1;

      // this.remove_extra_record(frame);

      // this.lhs_lib.getSepratorGrp(frame);
      // this.lhs_lib.setItemCount(frame.tableRows);

      let level4 = [];
      if (frameLevel4 && frameLevel4.length > 0) {
        level4[0] = JSON.parse(JSON.stringify(frameLevel4))
        let sepdata = this.lhs_lib.seprateData(frame, level4)
        frame.headers = sepdata[0];
      }

      this.processData.afterTableRows(frame, null, null, null, true);
      // console.log(frame);
      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
      // if (event.click_events_arr) {
      //   if (event.click_events_arr.length > (event.click_events_count + 1)) {
      //     event.click_events_count = event.click_events_count + 1;
      //     this.itemClicked1(event, "");
      //   }
      // }
    } else {
      this.clearQue();
    }

  }

  async openDeveloperPage() {
    const popover = await this.popOverCtrl.create({
      component: DeveloperModePage,
      animated: false,
      cssClass: 'developer-popover',
      translucent: true,
      backdropDismiss: true
    });
    return await popover.present();
  }

  app_reload_frame(event, frames) {
    this.wsdp = event.wsdp;
    this.wsdpcl = event.wsdpcl;
    this.wscp.item_sub_type = event.wscp ? event.wscp.item_sub_type : event.wscp;
    let refreshKey = [];
    frames.includes(',') ? refreshKey = frames.replaceAll("'", "").split(',') : refreshKey[0] = frames.replaceAll("'", "");

    for (let x of refreshKey) {
      //  let name = "refreshFrame" + x.toLowerCase().replace(/-/g, '_') + this.globalobjects.refreshId;
      let frame = this.lhs_lib.get_frame_config(x.replaceAll('"', ""));
      // if (event.item_name == 'SYS_BACK_REFRESH') {
      //   frame.search = ''
      // }
      if (frame) {

        if (frame.apps_frame_sub_type && (frame.apps_frame_sub_type.toUpperCase() == 'SINGLE_ROW' || frame.apps_frame_sub_type.toUpperCase() == 'SINGLE_ROW_BLANK' || frame.no_of_records == '1')) {
          let tempFrame = this.lhs_lib.get_frame_config(frame.apps_page_frame_seqid + 'A');
          if (tempFrame) {
            tempFrame.tableData = [];
            tempFrame.tableRows = [];
            tempFrame.canvasRows = [];
            tempFrame.Level4 = [];
            tempFrame.headers = [];
          }
        }

        frame.tableRows = [];
        frame.deletedRows = [];
        frame.canvasRows = [];
        frame.headers = [];
        frame.summary_rows = [];
        frame.tableData = [];
        frame.runEvents = [];
        delete frame["click_events_arr"];
        delete frame["click_events_count"];
        delete frame['indexStr'];
        delete frame['edit_record_index'];
        delete frame['searchableData'];
        delete frame['searchableRawData'];
        //  frame.headers = JSON.parse(JSON.stringify(frame.Level4));
        frame.search = ''
        let level4 = [];
        if (frame.Level4 && frame.Level4.length > 0) {
          level4[0] = JSON.parse(JSON.stringify(frame.Level4))
          let sepdata = this.lhs_lib.seprateData(frame, level4)
          frame.headers = sepdata[0];
        }

        delete frame['relational_string'];
        delete frame['json_related_frames'];

        this.parseBuiltins(frame);
      }
    }

    // this.events.publish('refreshFrame', event);
    // if (event.click_events_arr) {
    //   if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //     event.click_events_count = event.click_events_count + 1;
    //     this.itemClicked1(event, "");
    //   }
    // }
    // this.cdr.detectChanges()

  }

  switchSmart(event) {
    if (this.smartBtn) {
      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (event.switchFrames.length > 0) {
          for (let sF of event.switchFrames) {
            if (sF == frame.apps_page_frame_seqid) {
              if (frame.tableRows && frame.tableRows.length > 0) {
                for (let framedata of frame.tableRows) {
                  for (let itemGroup of framedata) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                      for (let item of itemGroup.Level5) {
                        if ((item.data_required_flag == 'T' || item.prompt_name[item.prompt_name.length - 1] == "*")) {
                        } else {
                          item.item_visible_flag = 'F';
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let framedata of frame.tableRows) {
              for (let itemGroup of framedata) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if ((item.data_required_flag == 'T' || item.prompt_name[item.prompt_name.length - 1] == "*")) {
                    } else {
                      item.item_visible_flag = 'F';
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.smartBtn = false;
    } else {
      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (frame.tableRows && frame.tableRows.length > 0) {
          for (let framedata of frame.tableRows) {
            for (let itemGroup of framedata) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  for (let f of frame.Level4) {
                    for (let x of f.Level5) {
                      if (x.item_name == item.item_name && x.item_visible_flag == 'T') {
                        item.item_visible_flag = 'T';
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.smartBtn = true;
    }
  }

  openLocationTrackingPage() {
    let userDetails = this.globalobjects.userDetails;
    let reqData = {
      "wslp": userDetails,
    }
    this.dataService.postData("openLocationTrackingDashboard", reqData).then((res: any) => {
      if (res.responseStatus == 'success') {
        let data = res.responseData;
        let sessionId = data.sessionId;
        let tenantId = data.tenantId;
        let scopeUrl = this.globalobjects.getLocallData('scopeUrl');
        let arr = scopeUrl.split("/");
        let url = arr[0] + "//" + arr[2] + "/bridge?action=getLocationTrackingDashboard&sessionId=" + sessionId + "&tenantId=" + tenantId;
        if (isPlatformServer(this.platformId)) return;
        window.open(url, "_blank");
      } else {
        this.globalobjects.presentAlert("Error while creating session...")
      }
    }, error => this.globalobjects.presentAlert("Server Error..."));
  }



  async moveExceltoFrame(event, head, body) {
    let tiltseparate = event.populateFrame.split('~');
    await this.processData.populateRows(tiltseparate[1], body);
    // if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, "");
    // }
  }

  openWebLinks(data: any) {

    let userDetails = this.globalobjects.userDetails;
    userDetails.database_name = this.globalobjects.getLocallData('tenantId');
    this.wscp.service_type = 'open_java_url';
    this.wscp.menu_option_code = data.value;
    let reqData = {
      "wslp": userDetails,
      "wscp": this.wscp
    }

    this.dataService.postData("S2U", reqData).then((data: any) => {
      if (data.responseStatus == 'success') {
        let object_arr = data.responseData
        let objData = this.globalobjects.setPageInfo(object_arr);
        if (objData.Level1[0]) {
          if (objData.Level1[0].status == "Q") {
            this.globalobjects.presentAlert(objData.Level1[0].message);
          }
          else if (objData.Level1[0].java_url) {
            if (objData.Level1[0].status == "F") {
              this.globalobjects.presentAlert(objData.Level1[0].message);
            }
            if (isPlatformServer(this.platformId)) return;
            window.open(objData.Level1[0].java_url, "_blank");
          } else {
            this.globalobjects.presentAlert("Java Url not found from backend...");
          }
          //console.log(objData);
        } else {
          this.globalobjects.presentAlert("No data found...");
        }
      } else {
        this.globalobjects.presentAlert(data.responseMsg);
      }
    }, error => this.globalobjects.presentAlert("Server Error..."));

  }

  uploadFileToServer(event, data) {
    //console.log(event);
    let wsdp = [];
    wsdp = event.wsdp.filter((item) => {
      item[event.apps_item_seqid] = data;
      return item;
    })
    let reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": event.wscp,
      "wsdp": wsdp,
      "wsud": this.wsud
    }

    this.dataService.postData("S2U", reqData).then(res => {
      if (res == 'success') { } else { }
    }, (error) => {
      this.globalobjects.presentAlert("Server connectivity issue...");
    });
  }

  async openSettingPage() {
    const modal = await this.modalCtrl.create({
      component: SettingPage,
      animated: false,
      backdropDismiss: this.backdismiss
    });
    return await modal.present();
  }

  selectDevice(screen, i) {
    for (let f of this.deviceMode) {
      if (f.class == "active") {
        f.class = "inActive"
      }
    }

    this.deviceMode[i].class = "active";
    let x = document.getElementsByTagName("html");
    let s = document.getElementsByClassName("shrinkMyscreen")[0];

    if (screen == "Mobile") {
      this.globalobjects.mobileFlag = true;
      x[0].setAttribute("style", "width:440px;margin: auto;background: #eee;");
    }
    if (screen == "Desktop") {
      this.globalobjects.mobileFlag = false;
      x[0].setAttribute("style", "width:100%;margin: auto;");

    }
    if (screen == "Tab") {
      this.globalobjects.mobileFlag = false;
      x[0].setAttribute("style", "width:1024px;margin: auto;background: #eee;");
    }
    this.refreshObjFab();
  }

  async downloadScript(objectcode) {
    this.scriptLoading = true;
    let reqData = {
      objectcode: objectcode
    }
    if (!this.platform.is('ios') && !this.platform.is('android')) {
      this.dataService.postData("getObjectCodeScript", reqData).then((res: any) => {
        this.scriptLoading = false;
        if (res.responseStatus == 'success') {
          let text = res.responseData;
          var data = new Blob([text], { type: 'text/plain' });
          let textFile = null;
          if (textFile !== null) {
            if (isPlatformServer(this.platformId)) return;
            window.URL.revokeObjectURL(textFile);
          }
          let fileName = JSON.stringify(Math.floor(Math.random() * (999999 - 100000)) + 100000);
          const a = document.createElement('a')
          const objectUrl = URL.createObjectURL(data)
          a.href = objectUrl
          a.download = objectcode + ".txt";
          a.click();
          URL.revokeObjectURL(objectUrl);
        } else {
          this.globalobjects.presentAlert(res.responseMsg);
        }
      }, (err) => {
        this.scriptLoading = false;
        this.globalobjects.presentAlert("404 Url not found...");
      })
    } else {
      this.globalobjects.presentAlert("This feature is available for browser only...");
    }

  }

  async openObjectEditorPage(data) {
    const objModal = await this.modalCtrl.create({
      component: DevObjectMastEditorPage,
      animated: false,
      cssClass: 'my-custom-class',
      backdropDismiss: this.backdismiss,
      componentProps: {
        data: data
      }

    });
    return await objModal.present();

  }

  async openFrameEditorPage(data) {
    const objModal = await this.modalCtrl.create({
      component: DevFrameMastEditorPage,
      animated: false,
      cssClass: 'my-custom-class',
      backdropDismiss: this.backdismiss,
      componentProps: {
        data: data
      }

    });
    return await objModal.present();

  }

  async openItemAddPage(data) {


    let apps_page_frame_seqid = data.apps_page_frame_seqid;
    let apps_page_no = this.page_no;


    // this.globalobjects.popoverFlag = 'P';
    let popUp = await this.popOverCtrl.create({
      component: DevFrameItemListPage,
      animated: false,
      componentProps: data,
      id: "globalPopover",
      backdropDismiss: true
    });

    let devItemName: any = {};
    popUp.onDidDismiss().then((details: OverlayEventDetail) => {
      //console.log(details);
      // this.globalobjects.popoverFlag = 'M';

      if (details.data) {
        let nextPageInfo: any = {};
        nextPageInfo.wscp = {};
        nextPageInfo.wscp.click_events_str = "get_object_config";
        nextPageInfo.wscp.object_code = details.data.object_code;
        nextPageInfo.object_mast = [];
        nextPageInfo.devPara = {};

        devItemName.d_apps_page_frame_seqid = apps_page_frame_seqid;
        devItemName.d_apps_page_no = this.page_no + 1;
        devItemName.d_item_type = details.data.item_type_code;
        devItemName.d_item_sub_type = details.data.item_sub_type_code;

        this.globalobjects.devItemName = devItemName;
        this.globalobjects.devItemEditFlag = false;
        this.openPage(nextPageInfo)
      }
    });
    return await popUp.present();

  }

  devEditItem(event) {
    this.dataService.getData("devItemMast").then((res: any) => {
      if (res.responseStatus == 'success') {
        let data = res.responseData;
        let objCode = "";
        for (let d of data) {
          if (d.item_type_code == event.item_type) {
            objCode = d.object_code
          }
        }
        event.wscp.object_code = objCode;

        if (objCode == "" || objCode == null || objCode == undefined) {
          this.globalobjects.devItemEditFlag = true;
          alert("Object Code Not Present");
        } else {
          this.openPage(event);
        }
      }
    })
  }

  downloadFromJava(data) {
    let format = data.click_event.split("~");
    let reqData: any = {};
    debugger;

    reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": data.wscp,
      "wsdp": data.wsdp,
      "wsdpcl": this.wsdpcl,
      //  "extension":format[1]


    }
    this.dataService.postData("S2U", reqData).then((res: any) => {
      let data: any = res;
      if (data.responseStatus == "success") {

      }
    }).catch(error => {
      //console.log(error)
    })


  }

  async popoveruser() {
    // this.router.navigate(["/usersetting",{userValueList: this.globalobjects.userValueListfromglobal}], );
    this.sqlLiteServ.deleteAllObject();
    let popUp = await this.modalCtrl.create({
      component: UsersettingPage,
      animated: false,
      componentProps: {
        userValueList: this.globalobjects.userValueListfromglobal,
        id: "globalPopover",
        flag: true
      },
      backdropDismiss: this.backdismiss
    });
    popUp.present();
    popUp.onDidDismiss().then((details: OverlayEventDetail) => {
      //console.log("page");
      // this.navCtrl.navigateRoot('super');
    })

  }

  ngAfterViewChecked() {
    if (this.globalobjects.fontype == "") { } else {
      // //console.log("q")
      if (this.globalobjects.fontype) {

        this.globalobjects.changeFont(this.globalobjects.fontype);
      }



      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
    }
    if (this.globalobjects.fontSize > 0.9) {

      this.globalobjects.increFontsize(this.globalobjects.fontSize);

    }
  }

  setSessionValue(event) {
    if (event.tabRows) {
      for (let evFrame of event.tabRows) {
        if (evFrame.Level5) {
          for (let evItems of evFrame.Level5) {
            if (evItems.session_hold_flag) {

              for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                let heads = [];
                let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4))
                for (let itemdata of frameLevel4) {
                  if (itemdata.Level5) {
                    for (let item of itemdata.Level5) {
                      if (item.item_default_value == evItems.item_name) {
                        item.value = evItems.value
                      }
                      if (event.itemFlagForVisible) {
                        for (let x of event.itemFlagForVisible) {
                          if (item.item_name == x.key) {
                            item.item_visible_flag = x.value;
                          }
                        }
                        if (frame.tHead) {
                          if (item.item_visible_flag == 'T') {
                            if (item.item_type != "ADD_ROW_BT" && item.item_type != "DELETE_ROW_BT") {

                              heads.push(item.prompt_name);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (frame.tHead && heads.length > 0) {
                  frame.tHead = heads;
                }
              }

              for (let frame of this.object_mast.Level2[this.page_no].Level3) {
                let heads = [];
                if (frame.tableRows && frame.tableRows.length > 0) {
                  for (let tabledata of frame.tableRows) {
                    for (let rows of tabledata) {
                      if (rows.Level5) {
                        for (let items of rows.Level5) {
                          if (items.item_default_value == evItems.item_name) {
                            items.value = evItems.value;
                            //console.log(items);
                          }
                          if (event.itemFlagForVisible) {
                            for (let x of event.itemFlagForVisible) {
                              if (items.item_name == x.key) {
                                items.item_visible_flag = x.value;
                              }
                            }
                            if (event.itemFlagForVisible) {
                              for (let x of event.itemFlagForVisible) {
                                if (items.item_name == x.key) {
                                  items.item_visible_flag = x.value;
                                }
                              }
                              if (frame.tHead) {
                                if (items.item_visible_flag == 'T') {
                                  if (items.item_type != "ADD_ROW_BT" && items.item_type != "DELETE_ROW_BT") {
                                    heads.push(items.prompt_name);
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  openPop(comProps) {
    setTimeout(async () => {

      let event = this.globalobjects.mouseEvent;
      let copyValue= event.target.innerText;
      let popUp = await this.popOverCtrl.create({
        animated: false,
        component: ParentMenuPage,
        componentProps: { childItems: comProps, copyValue: copyValue },

        event: event,
        backdropDismiss: true
      });

      popUp.onDidDismiss().then(res => {
        //console.log(res)
        if (res.role == 'openTab') {
          this.itemClicked(res.data);
        }
        if (res.role == 'openNewTab') {
          this.globalobjects.setDataLocally("openObjectNewTab", res.data);
          if (isPlatformServer(this.platformId)) return;
          window.open(window.location.href.split('/super')[0], "_blank");
        }
      });


      // if((this.globalobjects.screenheight - 200) < this.globalobjects.top){

      //   popUp.style.top = this.globalobjects.top-250 + "px";
      //   popUp.style.left = this.globalobjects.left + "px";
      // }
      return await popUp.present();
    }, 5);
  }





  fullScreen(event) {

    let elem = document.documentElement;
    if (event == 'full') {
      let methodToBeInvoked = elem.requestFullscreen ||
        elem['mozRequestFullscreen']
        ||
        elem['msRequestFullscreen'];
      if (methodToBeInvoked) methodToBeInvoked.call(elem);
    }
    if (event == 'in') {
      document.exitFullscreen();
    }

  }

  setLovVal() {
    this.popOverCtrl.dismiss(this.globalobjects.lovObjData);
  }

  openDevQueryParamObj() {

    let obj = this.globalobjects.get_dummy_item();

    this.itemClicked(obj);
  }

  deleteLov(i) {
    this.globalobjects.lovObjData.splice(i, 1);
  }

  generateJtypeData() {
    if (this.object_mast && this.object_mast.Level2 && this.object_mast.Level2.length > 0) {
      let itemsData = [];
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          let tableRows = [];
          let eRows = [];
          let tableData = [];
          if (frame.tempRows && frame.tempRows.length > 0) {
            tableRows = frame.tempRows;
            eRows = JSON.parse(JSON.stringify(frame.tableRows));
          } else {
            tableRows = frame.tableRows;
          }

          if (tableRows && tableRows.length > 0) {
            let indexArr = frame.indexStr ? frame.indexStr.split(";") : (frame.executing_index != undefined ? [parseInt(frame.executing_index) + (frame.deletedRows && frame.deletedRows.length > 0 ? frame.deletedRows.length : 0)] :
              (frame.edit_record_index != undefined ? [parseInt(frame.edit_record_index) + (frame.deletedRows && frame.deletedRows.length > 0 ? frame.deletedRows.length : 0)] : []));
            for (let i = 0; i < tableRows.length; i++) {
              let col = {};
              let idEdited = indexArr.find(x => parseInt(x) == i);

              if (idEdited == undefined) {
                // let dirtyItem = this.lhs_lib.get_rows_item(tableRows[i], 'WMA_RECORD_STATUS');

                let dirtyItem = this.lhs_lib.check_row_dirty(null, tableRows[i]);
                if ((frame.apps_frame_sub_type == 'SINGLE_ROW' || frame.apps_frame_sub_type == 'SINGLE_ROW_BLANK' || frame.no_of_records == '1')) {
                  // dirtyItem = this.lhs_lib.get_rows_item(tableRows[0], 'WMA_RECORD_STATUS');
                  dirtyItem = this.lhs_lib.check_row_dirty(null, tableRows[0]);
                }
                if ((dirtyItem && dirtyItem.frame_status && (dirtyItem.frame_status).toLowerCase() == 'dirty')) {
                  for (let itemGroup of tableRows[i]) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {

                      for (let item of itemGroup.Level5) {
                        col[item.item_name] = item.value ? (typeof (item.value) != 'string' ? item.value.toString() : item.value) : "";
                      }
                    }
                  }
                }
              } else {
                // let dirtyItem = this.lhs_lib.get_rows_item(eRows[0], 'WMA_RECORD_STATUS');
                let dirtyItem = this.lhs_lib.check_row_dirty(null, eRows[0]);
                if ((dirtyItem && dirtyItem.frame_status && (dirtyItem.frame_status).toLowerCase() == 'dirty')) {
                  for (let itemGroup of eRows[0]) {
                    if (itemGroup.Level5 && itemGroup.Level5.length > 0) {

                      for (let item of itemGroup.Level5) {
                        col[item.item_name] = item.value ? (typeof (item.value) != 'string' ? item.value.toString() : item.value) : "";
                      }
                    }
                  }

                  eRows.shift();
                }
              }
              if (Object.keys(col).length > 0) {
                tableData.push(col);
              }
            }
          }

          // if (frame.tableRows && frame.tableRows.length > 0) {
          //   let tableRows = [];
          //   let index = 0;
          //   tableRows = frame.tableRows;

          //   // if (frame.tempRows) {
          //   //   tableRows = frame.tempRows;
          //   // }

          //   for (let framedata of tableRows) {
          //     for (let itemGroup of framedata) {
          //       if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
          //         for (let item of itemGroup.Level5) {
          //           // if (item.value || (frame.apps_page_frame_seqid == (this.object_mast.object_code + "-PARA"))) {
          //           let col: any = {};
          //           col.status = 'J';
          //           col.object_code = item.object_code;
          //           col.frame_name = frame.apps_page_frame_seqid;
          //           col.row_slno = index;
          //           col.item_name = item.item_name;
          //           col.para_type = "IV";
          //           col.para_value = item.codeOfValues ? item.codeOfValues : (item.value ? item.value : "");
          //           itemsData.push(col);
          //           // }
          //         }
          //       }
          //     }
          //     index++;
          //   }
          // }

          if (tableData && tableData.length > 0) {
            let tempframe = {
              apps_page_frame_seqid: frame.apps_page_frame_seqid,
              tableData: tableData
            }

            itemsData.push(tempframe);
          }
        }
      }
      return itemsData;
    }

  }

  setReqItems(item, event) {
    if (event) {
      if (event.required_items) {

        if (event.required_items.indexOf("#") > -1) {
          let itemsArr = event.required_items.split("#");
          for (let i of itemsArr) {
            // this.lhs_lib.set_item_config(i, 'data_required_flag', "F", this.globalobjects.jStatusData.itemIndex);
            // let getItem = this.lhs_lib.get_item(i, event.itemIndex);
            // if (getItem) {
            //   getItem.data_required_flag = "F";
            //   let name = getItem.prompt_name ? getItem.prompt_name : "";
            //   getItem.prompt_name = name.slice(0, (name.length - 1));
            // }
            if (i) {

              this.lhs_lib.set_item_config(i, 'required_item', "F", item.row_slno);
            }
          }
        } else {
          // this.lhs_lib.set_item_config(this.globalobjects.jStatusData.required_items, 'data_required_flag', "F", this.globalobjects.jStatusData.itemIndex);
          // let getItem = this.lhs_lib.get_item(event.required_items, event.itemIndex);
          // if (getItem) {
          //   getItem.data_required_flag = "F";
          //   let name = getItem.prompt_name ? getItem.prompt_name : "";
          //   getItem.prompt_name = name.slice(0, (name.length - 1));
          // }
          this.lhs_lib.set_item_config(event.required_items, 'required_item', "F", item.row_slno);
        }
        // this.lhs_lib.set_item_config(this.globalobjects.jStatusData.item_name, 'required_items', item.para_value, this.globalobjects.jStatusData.itemIndex);
      }

      if (item.para_value) {
        if (item.para_value.indexOf("#") > -1) {
          let itemsArr = item.para_value.split("#");
          for (let i of itemsArr) {
            // this.lhs_lib.set_item_config(i, 'data_required_flag', "T", this.globalobjects.jStatusData.itemIndex);
            // let getItem = this.lhs_lib.get_item(i, event.itemIndex);
            // if (getItem) {
            //   getItem.data_required_flag = "T";
            //   getItem.prompt_name = getItem.prompt_name ? ((getItem.prompt_name).charAt((getItem.prompt_name).length - 1) == "*" ? getItem.prompt_name : getItem.prompt_name + "*") : "";
            //   console.log(getItem);
            // }
            if (i) {

              this.lhs_lib.set_item_config(i, 'required_item', "T", item.row_slno);
            }
          }
        } else {
          // this.lhs_lib.set_item_config(item.para_value, 'data_required_flag', "T", this.globalobjects.jStatusData.itemIndex);
          // let getItem = this.lhs_lib.get_item(item.para_value, event.itemIndex);
          // if (getItem) {
          //   getItem.data_required_flag = "T";
          //   getItem.prompt_name = getItem.prompt_name ? ((getItem.prompt_name).charAt((getItem.prompt_name).length - 1) == "*" ? getItem.prompt_name : getItem.prompt_name + "*") : "";
          //   console.log(getItem);
          // }

          this.lhs_lib.set_item_config(event.required_items, 'required_item', "T", item.row_slno);
        }
      }

      this.lhs_lib.set_item_config(event.item_name, 'required_items', item.para_value, event.itemIndex);


    }
  }

  async generatAllFrameJson(objData, event, isHead?) {

    // this.globalobjects.jdata = objData;


    // if(event && event.apps_item_seqid){
    //   let obj = {
    //     item_seq_id:event.apps_item_seqid,
    //     data:objData
    //   }

    //   this.globalobjects.devJRes = obj;



    // }

    if (this.globalobjects.logFlag) {

      this.globalobjects.excuted_events_logs.push(`processing GD data for ${event.item_name ?? event.apps_item_seqid} - ${event.apps_page_frame_seqid} :- ${event && event.click_events_arr && event.click_events_arr[event.click_events_count] ? event.click_events_arr[event.click_events_count] : ''} , ${new Date().toString().split(" GMT")[0]}`);
    }


    // this.globalobjects.jdata = objData;

    if (objData && objData.length > 0) {
      let reqItems = objData.find(x => x.item_name && x.item_name.toUpperCase() == "P_REQUIRED_ITEMS");
      if (reqItems) {
        this.setReqItems(reqItems, event);
      }
    }

    let multiMessage = [];
    // let functions = [];

    let toastMsg: any = {};
    let singleMessage = {};

    let eventStr = "";

    let singleMsgFlag: boolean = false;
    let multiMsgFlag: boolean = false;
    let toastFlag: boolean = false;

    let jmwFlag: boolean = false;
    let jmwData: any = {};

    let cache_data = {};

    // let frameKeys = {};
    // this.ngZone.run(() => {
    //   this.cdr.detectChanges();
    // })

    // console.log(objData);

    for (let ob of objData) {

      // if (ob.para_type == 'IV') {
      //   let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;

      //   if (ob.frame_name) {
      //     let frame = this.lhs_lib.get_frame_config(ob.frame_name);
      //     if (frame) {
      //       let index = this.lhs_lib.get_record_index(frame, ob.row_slno)
      //       this.lhs_lib.set_item_value(event, name, index, ob.para_value);
      //     }
      //   } else {
      //     this.lhs_lib.set_item_value(event, name, ob.row_slno, ob.para_value);
      //   }
      // }

      if (ob.para_type == 'IV') {
        if (ob.frame_name && ob.row_slno != null) {
          let frame = this.lhs_lib.get_frame_config(ob.frame_name);
          if (frame) {
            let retData = this.lhs_lib.get_record_index(frame, ob.row_slno, cache_data);
            // cache_data = retData.cache_data;
            let obj = retData.data;
            if (obj.noRecord) {
              continue;
            }
            let name = obj.frame ? obj.frame + "." + ob.item_name : ob.item_name;
            this.lhs_lib.set_item_value(event, name, obj.index, ob.para_value, false, true);
          }
        } else {
          let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
          this.lhs_lib.set_item_value(event, name, ob.row_slno, ob.para_value, false, true);
        }
      }

      else if (ob.para_type == 'IVE') {
        if (ob.frame_name && ob.row_slno != null) {
          let frame = this.lhs_lib.get_frame_config(ob.frame_name);
          if (frame) {
            let retData = this.lhs_lib.get_record_index(frame, ob.row_slno, cache_data);
            // cache_data = retData.cache_data;
            let obj = retData.data;
            if (obj.noRecord) {
              continue;
            }
            let name = obj.frame ? obj.frame + "." + ob.item_name : ob.item_name;
            let data = this.lhs_lib.set_item_value(event, name, obj.index, ob.para_value, true, true);

            // if (data) {
            //   this.itemClicked(data.item, data.event_arr, frame, null, true);
            //   console.log(data);
            // }

            if (data && data.item) {
              data.item.itemClicked = 'post';
              data.item.some_post_events_str = data.event_arr.join(";");
              this.itemClicked(data.item);
              console.log(data);
            }
          }
        } else {
          let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
          let data = this.lhs_lib.set_item_value(event, name, ob.row_slno, ob.para_value, true, true);
          // if (data) {
          //   this.itemClicked_new(data.item, data.event_arr, null, null, true);
          //   console.log(data);
          // }

          if (data && data.item) {
            data.item.itemClicked = 'post';
            data.item.some_post_events_str = data.event_arr.join(";");
            this.itemClicked(data.item);
            console.log(data);
          }
        }
      }

      else if (ob.para_type == 'SC') {

        if (ob.frame_name && ob.row_slno != null) {
          let frame = this.lhs_lib.get_frame_config(ob.frame_name);
          if (frame) {
            let retData = this.lhs_lib.get_record_index(frame, ob.row_slno, cache_data);
            // cache_data = retData.cache_data;
            let obj = retData.data;
            if (obj.noRecord) {
              continue;
            }
            let name = obj.frame ? obj.frame + "." + ob.item_name : ob.item_name;
            this.lhs_lib.set_item_config(name, ob.para_name, ob.para_value, obj.index, true);
          }
        } else {
          let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
          this.lhs_lib.set_item_config(name, ob.para_name, ob.para_value, ob.row_slno, true);
        }
      }

      else if (ob.para_type == 'FSC') {
        this.lhs_lib.set_frame_config(ob.frame_name, ob.para_name, ob.para_value);
      }

      else if (ob.para_type == 'PV') {
        let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
        this.lhs_lib.set_item_value(event, name, ob.row_slno, ob.para_value);
      }

      else if (ob.para_type == 'CP') {
        this.app_add_para_cp(ob.item_name, ob.para_value);
      }

      else if (ob.para_type == 'LP') {
        this.app_add_para_lp(ob.item_name, ob.para_value);
      }

      else if (ob.para_type == "MD") {
        toastMsg = ob;
        toastFlag = true;
      }

      else if (ob.para_type == "MI" || ob.para_type == "JMI" || ob.para_type == "JMS" || ob.para_type == "MS" || ob.para_type == "MWY" || ob.para_type == "MWN" || ob.para_type == "JPMS") {
        singleMessage = ob;
        singleMsgFlag = true;
        if (ob.para_type == "MS" || ob.para_type == "JMS" || ob.para_type == "JPMS") {
          event.rase = true;
          this.clearQue();
        }

      } else if (ob.para_type == "JPMW") {
        jmwData = ob;
        jmwFlag = true;
      }

      else if (ob.para_type == "MMI" || ob.para_type == "MMS" || ob.para_type == "MMWY" || ob.para_type == "MMWN") {
        multiMessage.push(ob);
        multiMsgFlag = true;
        if (ob.para_type == "MMS") {
          event.rase = true;
          this.clearQue();
        }
      }

      else if (ob.para_type == "OAJS" || ob.para_type == "GAJS") {
        let func = ob.para_value ? ob.para_value.replaceAll("\"", "`") : "";

        let convertedVal = this.lhs_lib_util(func, { itemIndex: ob.row_slno });


        let conArr = convertedVal.split("(");
        let lstr = ""
        for (let c = 0; c < conArr.length; c++) {
          if (c > 0) {
            if (c == 1) {
              lstr = lstr + conArr[c];
            } else {
              lstr = lstr + "(" + conArr[c];
            }
          }
        }
        const supercomp=this;
        let evStr = conArr[1].trim().charAt(0) == ")" ? "(event,supercomp" : "(event,supercomp,";
        let newStr = conArr[0] + evStr + lstr;
        // alert(newStr);
        // console.log(newStr)

        newStr = newStr.replace("function", "async function");
        convertedVal = newStr;
        // functions.push(convertedVal);
        try {
          const supercomp=this;
          let c = convertedVal;
          // let ev = { ...event };
          event = { ...event };
          // c = c.replaceAll("event.", "ev.");
          c = c.replaceAll("this.", "supercomp.");
         let fun= this.dynamic_func.registerFunction(c)
         console.log(fun);
          //  c = c.replaceAll("oajs", "ajs");
          //   c = c.replaceAll("gajs", "ajs");
          // console.log(c);
          // const match = c.match(
          //   /^\s*(async\s+)?function\s+([a-zA-Z_$][\w$]*)\s*\(/
          // );

          // if (!match) {
          //   throw new Error('Unsupported function declaration');
          // }

          // const functionName = match[2];

          // const fn = new Function(
          //   `return (${c})`
          // )();

          // (this as any)[functionName] = fn;
          // console.log(functionName)
          // eval.call(this, c);

        } catch (err) {
          alert(err);
        }
      }

      else if (ob.para_type == "OAPL" || ob.para_type == "GAPL") {
        let func = ob.para_value.replaceAll(/\n|\r/g, "").replaceAll("\"", "`");
        let key = this.convert_plsq_js.getConvertedScript(func);
        let convertedVal = this.lhs_lib_util(key, { itemIndex: ob.row_slno });


        let conArr = convertedVal.split("(");
        let lstr = ""
        for (let c = 0; c < conArr.length; c++) {
          if (c > 0) {
            if (c == 1) {
              lstr = lstr + conArr[c];
            } else {
              lstr = lstr + "(" + conArr[c];
            }
          }
        }
        let evStr = conArr[1].trim().charAt(0) == ")" ? "(event" : "(event,";
        let newStr = conArr[0].toLowerCase() + evStr + lstr;
        // alert(newStr);
        // console.log(newStr)

        newStr = newStr.replace("function", "async function");

        if (newStr && newStr.toLowerCase().includes("gajs_dim_name_for_db_item")) {
          newStr = newStr.replace("async function", "function");
        }
        convertedVal = newStr;

        // functions.push(convertedVal);
        try {
          const supercomp=this;
          let c = convertedVal.toLowerCase();
          // let ev = { ...event };
          event = { ...event };
          // c = c.replaceAll("event.", "ev.");
          c = c.replaceAll("this.", "supercomp.");
          console.log(c);
            let fun= this.dynamic_func.registerFunction(c)
         console.log(fun);
          // eval.call(this, c);
        } catch (err) {
          alert(err);
        }
      }


      else if (ob.para_type == "EV") {
        eventStr = eventStr + ob.para_value;
      }

      else if (ob.para_type == "RE") {
        let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
        this.app_execute_item(event, name, ob.para_name, ob.row_slno);
        event.rase = true;
      }

      else if (ob.para_type == "DELO") {
        // let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
        // this.app_execute_item(event, name, ob.para_name, ob.row_slno);

        this.sqlLiteServ.deleteObject(ob.para_value);

      }

      else if (ob.para_type == "OUT" || ob.para_type == "MOUT") {
        // let name = ob.frame_name ? ob.frame_name + "." + ob.item_name : ob.item_name;
        // this.app_execute_item(event, name, ob.para_name, ob.row_slno);
        this.lhs_lib.msgbox(event, ob.para_value ?? "You have been logged out!", 'raise').then(() => {
          this.logOut();
        })

      }
    }

    if (this.globalobjects.logFlag) {
      this.globalobjects.excuted_events_logs.push(`complete GD data for ${event.item_name} - ${event.apps_page_frame_seqid} :- ${event && event.click_events_arr && event.click_events_arr[event.click_events_count] ? event.click_events_arr[event.click_events_count] : ''} , ${new Date().toString().split(" GMT")[0]}`);
    }

    if (jmwFlag) {

      let savedData = this.globalobjects.getLocallData('jmw_data');
      if (savedData) {
        // savedData.push(jmwData);
      } else {
        savedData = [];
        savedData.push(jmwData);
        this.showJmwMsg(jmwData);
      }
      this.globalobjects.patch_flag = true;
      this.globalobjects.setDataLocally('jmw_data', savedData);
    } else {
      if (isHead) {
        this.globalobjects.patch_flag = false;
        this.globalobjects.destroyLocalData('jmw_data');
      }
    }

    if (toastFlag && !singleMsgFlag && !multiMsgFlag) {
      // this.globalobjects.setFocus(true);
      this.presentToast(toastMsg.para_value).then(() => {
        if (!isHead) {
          this.exceute_remainig_event(eventStr, event);
        }
      })
    } else {

      if (singleMsgFlag) {
        await this.openSinglealert(singleMessage, eventStr, event);
      } else if (multiMsgFlag) {
        await this.openMultialert(multiMessage, eventStr, event);
      } else {
        return;
      }
    }

  }

  async showJmwMsg(message) {
    let popUp = await this.popOverCtrl.create({
      component: AlertMsgBoxesPage,
      id: "msgPopover",
      backdropDismiss: false,
      componentProps: {
        alertMessage: message,
        type: "info"
      },
    });
    await popUp.present();

    await popUp.onDidDismiss().then(res => { });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: 'my-custom-toast',
    });
    toast.present();
  }

  exceute_remainig_event(eventStr, event) {

    return;
    let jEvent = JSON.parse(JSON.stringify(event));

    if (jEvent && jEvent.click_events_arr) {
      if (jEvent.click_events_arr.length > jEvent.click_events_count + 1) {

        if (eventStr) {
          let arr = [];
          let str = eventStr.split(";");
          for (let e = 0; e <= jEvent.click_events_count; e++) {
            arr.push(jEvent.click_events_arr[e]);
          }
          for (let s of str) {
            if (s) {
              arr.push(s);
            }
          }
          for (let e = 0; e > jEvent.click_events_count && e < jEvent.click_events_arr.length; e++) {
            arr.push(jEvent.click_events_arr[e]);
          }
          jEvent.click_events_arr = arr;
        }

        jEvent.click_events_count = jEvent.click_events_count + 1;
        // this.itemClicked1(jEvent, "");

      } else {
        if (eventStr) {
          let strArr = eventStr.split(";");
          let arr = [];
          for (let e of jEvent.click_events_arr) {
            if (e) {
              arr.push(e);
            }
          }
          for (let s of strArr) {
            if (s) {
              arr.push(s);
            }
          }

          jEvent.click_events_arr = arr;
          jEvent.click_events_count = jEvent.click_events_count + 1;
          // this.itemClicked1(jEvent, arr.join(";"));

        }
      }
    }

  }

  groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      let obj = {
        key: JSON.parse(group),
        items: groups[group]
      }
      return obj;
    })
  }

  callingParaFunc(event) {
    this.wscp.calling_parameter_str = event.calling_parameter_str;

    let callingStr: any = [];
    if (event.calling_parameter_str.indexOf(";") > -1) {
      // New calling_parameter_str imp START
      let locCallingStr = event.calling_parameter_str.split(';');
      if (locCallingStr.length > 0) {
        locCallingStr[locCallingStr.length - 1] == "" ? locCallingStr.pop() : "";
      }
      for (let c of locCallingStr) {
        c = c;

        //// Regex to Replace Enter 
        c = c.replace(/\n|\r/g, "");
        //// Regex to Replace Enter 


        if (c.toLowerCase().indexOf("app_add_para(") > -1) {
          if (c.toLowerCase().indexOf("app_add_para(") > -1) {

            c = c.replaceAll("APP_ADD_PARA(", "app_add_para(");

            let strss = c.split("(");
            strss[0] = "app_add_para";

            c = strss.join("(");
            let func: any = "this." + c;
            let cArr = func.split(",");

            if (cArr[1].indexOf("::") > -1) {
              let strArr = cArr[1].split("::");
              if (strArr[0]) {

              } else {
                cArr[1] = "'" + cArr[1].replace(")", "')");
                func = cArr[0] + "," + cArr[1];
              }
            }
            try {
              func = func.replaceAll("app_add_para(true,", "app_add_para(").replaceAll("app_add_para(", "app_add_para(true,")
              eval(func);
            } catch (e) {
              console.log(e);
              alert("Please check parameter string :- " + c);
            }

          }
        }
        // else if (c.toLowerCase().indexOf("app_add_para_back(") > -1) {
        //   if (c.toLowerCase().indexOf("app_add_para_back(") > -1) {

        //     c = c.replaceAll("APP_ADD_PARA_BACK(", "app_add_para_back(")

        //     let strss = c.split("(");
        //     strss[0] = "app_add_para_back";

        //     c = strss.join("(");
        //     let func = "this." + c;
        //     let cArr = func.split(",");

        //     if (cArr[1].indexOf("::") > -1) {
        //       let strArr = cArr[1].split("::");
        //       if (strArr[0]) {

        //       } else {
        //         cArr[1] = "'" + cArr[1].replace(")", "')");
        //         func = cArr[0] + "," + cArr[1];
        //       }
        //     }
        //     try {
        //       eval(func);
        //     } catch (e) {
        //       alert("Please check parameter string :- " + c);
        //     }

        //   }
        // }
        else if (c.indexOf("app_button_click") > -1) {
          let fucVal = c.substring(c.indexOf('(') + 1, c.indexOf(')'));
          if (this.globalobjects.autoClickItem.length > 0) {
            if (this.globalobjects.autoClickItem.indexOf(fucVal) == -1) {
              this.globalobjects.autoClickItem.push(fucVal);
            }
          } else {
            this.globalobjects.autoClickItem.push(fucVal);
          }
        } else if (c.toLowerCase().indexOf("app_add_paras") > -1) {
          let values = c.split("(")[1];
          let valArr = values.split(":=");
          let getValues = this.lhs_lib.get_row_values(valArr[1], event.itemIndex);

          if (event.calling_object_code || event.apps_page_no != getValues.pageNo) {
            let str = valArr[0].split("[")[1].split("]")[0].replace(")", "");
            let setItemsArr
            if (str && str.indexOf(" ") > -1) {
              setItemsArr = str.replace(" ", "").split(",")
            } else {
              setItemsArr = str.split(",")
            }
            let i = 0;
            for (let item of setItemsArr) {
              let str = item + ":=" + getValues.rowData[i];
              callingStr.push(str);
              i++
            }
          } else {
            this.wscp.apps_item_seqid = event.apps_item_seqid;
            this.lhs_lib.set_row_values(valArr[0], getValues, 0);
          }

        } else if (c.toLowerCase().indexOf("app_add_para_cp") > -1) {
          let str = this.lhs_lib_util(c, event);
          eval(str.replaceAll("await ", ""));
        } else if (c.toLowerCase().indexOf("app_add_para_lp") > -1) {
          let str = this.lhs_lib_util(c, event);
          eval(str.replaceAll("await ", ""));
        }



      }
    }
    else {

      let str = event.calling_parameter_str.replace(/=/g, ":=");
      callingStr = str.split('~');

      for (let frame of this.object_mast.Level2[this.page_no].Level3) {
        if (event.indexcount && frame.tableRows && frame.tableRows.length > event.indexcount) {
          for (let itmGrp of frame.tableRows[event.indexcount]) {
            if (itmGrp.Level5) {

              for (let item of itmGrp.Level5) {
                let i = 0;
                for (let x of callingStr) {
                  if (x.indexOf(":=") > -1) {
                    let itmName = x.split(':=');
                    if (itmName[1] == item.item_name) {
                      let str = "";
                      if (item.value) {
                        itmName[1] = item.value;
                        str = itmName[0] + ':=' + item.value;
                      } else {
                        itmName[1] = "";
                        str = itmName[0] + ':=' + "";
                      }
                      callingStr.push(str);
                      callingStr.splice(i, 1);
                      //console.log(callingStr);
                    }
                  }
                  i++;
                }
              }
            }
          }
        } else {
          if (frame.tableRows && frame.tableRows.length > 0) {
            for (let rows of frame.tableRows) {
              for (let itmGrp of rows) {
                if (itmGrp.Level5) {
                  for (let item of itmGrp.Level5) {

                    let i = 0;
                    for (let x of callingStr) {
                      if (x.indexOf(":=") > -1) {
                        let itmName = x.split(':=');
                        if (itmName[1] == item.item_name) {
                          let str = "";
                          if (item.value) {
                            itmName[1] = item.value;
                            str = itmName[0] + ':=' + item.value;
                          } else {
                            itmName[1] = "";
                            str = itmName[0] + ':=' + "";
                          }
                          callingStr.push(str);
                          callingStr.splice(i, 1);
                          //console.log(callingStr);
                        }
                      }
                      i++;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let obj = {
      itmData: callingStr,
      objectCode: event.calling_object_code,
      parentCode: event.apps_page_frame_seqid.split("-")[0],
      itemCode: event.apps_item_seqid
    }

    if (callingStr.length > 0) {
      if (this.globalobjects.callingPara.length > 0) {
        let glob = this.globalobjects.callingPara.find(x => x.objectCode == event.calling_object_code && x.itemCode == event.apps_item_seqid);

        if (glob) {
          for (let i of callingStr) {
            let flag = true;
            let index = 0;
            for (let c of glob.itmData) {
              if (i.split(":=")[0] == c.split(":=")[0]) {
                flag = false;
                glob.itmData[index] = i;
              }
            }
            if (flag) {
              glob.itmData.push(i);
            }
          }

        } else {
          this.globalobjects.callingPara.push(obj);
        }
      } else {
        this.globalobjects.callingPara.push(obj);
      }
    }
  }



  // back_page_calling_para(event) {
  //   this.wscp.calling_parameter_str = event.calling_parameter_str;

  //   let callingStr = [];
  //   if (event && event.calling_parameter_str && event.calling_parameter_str.indexOf(";") > -1) {
  //     // New calling_parameter_str imp START
  //     let locCallingStr = event.calling_parameter_str.split(';');
  //     if (locCallingStr.length > 0) {
  //       locCallingStr[locCallingStr.length - 1] == "" ? locCallingStr.pop() : "";
  //     }
  //     for (let c of locCallingStr) {
  //       c = c;

  //       /// Regex to Replace Enter 
  //       c = c.replace(/\n|\r/g, "");
  //       /// Regex to Replace Enter 

  //       if (c.toLowerCase().indexOf("app_add_para_back(") > -1) {
  //         if (c.toLowerCase().indexOf("app_add_para_back(") > -1) {

  //           c = c.replaceAll("APP_ADD_PARA_BACK(", "app_add_para_back(")

  //           let strss = c.split("(");
  //           strss[0] = "app_add_para_back";

  //           c = strss.join("(");
  //           let func = "this." + c;
  //           let cArr = func.split(",");

  //           if (cArr[1].indexOf("::") > -1) {
  //             let strArr = cArr[1].split("::");
  //             if (strArr[0]) {

  //             } else {
  //               cArr[1] = "'" + cArr[1].replace(")", "')");
  //               func = cArr[0] + "," + cArr[1];
  //             }
  //           }
  //           // try {
  //           //   eval(func);
  //           // } catch (e) {
  //           //   alert("Please check parameter string :- " + c);
  //           // }

  //           let obj = {
  //             key: cArr[0],
  //             str: func
  //           }

  //           this.globalobjects.callingParameterBack.push(obj);

  //         }
  //       }
  //     }
  //   }



  //   // if (callingStr.length > 0) {
  //   //   if (this.globalobjects.callingParameterBack.length > 0) {
  //   //     let glob = this.globalobjects.callingParameterBack.find(x => x.objectCode == event.calling_object_code && x.itemCode == event.apps_item_seqid);

  //   //     if (glob) {
  //   //       for (let i of callingStr) {
  //   //         let flag = true;
  //   //         let index = 0;
  //   //         for (let c of glob.itmData) {
  //   //           if (i.split(":=")[0] == c.split(":=")[0]) {
  //   //             flag = false;
  //   //             glob.itmData[index] = i;
  //   //           }
  //   //         }
  //   //         if (flag) {
  //   //           glob.itmData.push(i);
  //   //         }
  //   //       }

  //   //     } else {
  //   //       this.globalobjects.callingParameterBack.push(obj);
  //   //     }
  //   //   } else {
  //   //     this.globalobjects.callingParameterBack.push(obj);
  //   //   }
  //   // }
  // }

  back_page_calling_para(event, object_code?) {


    object_code = object_code ?? '';
    this.wscp.calling_parameter_str = event.calling_parameter_str;

    let callingStr: any = [];
    if (event && event.calling_parameter_str && event.calling_parameter_str.indexOf(";") > -1) {
      // New calling_parameter_str imp START
      let locCallingStr = event.calling_parameter_str.split(';');
      if (locCallingStr.length > 0) {
        locCallingStr[locCallingStr.length - 1] == "" ? locCallingStr.pop() : "";
      }
      for (let c of locCallingStr) {
        c = c;

        /// Regex to Replace Enter 
        c = c.replace(/\n|\r/g, "");
        /// Regex to Replace Enter 

        if (c.toLowerCase().indexOf("app_add_para_back(") > -1) {
          if (c.toLowerCase().indexOf("app_add_para_back(") > -1) {

            c = c.replaceAll("APP_ADD_PARA_BACK(", "app_add_para_back(")

            let strss = c.split("(");
            strss[0] = "app_add_para_back";

            let paras = strss[1].split(")")[0].split(",");

            if (paras && paras.length < 3) {
              c = strss.join("(object_code,");
            } else {
              c = strss.join("(");
            }
            let func = "this." + c;
            let cArr = func.split(",");

            if (cArr[1].indexOf("::") > -1) {
              let strArr = cArr[1].split("::");
              if (strArr[0]) {

              } else {
                cArr[1] = "'" + cArr[1].replace(")", "')");
                func = cArr[0] + "," + cArr[1];
              }
            }
            try {
              eval(func);
            } catch (e) {
              alert("Please check parameter string :- " + c);
            }

          }
        }
      }
    }

    let obj = {
      itmData: callingStr,
      objectCode: event.calling_object_code,
      parentCode: event.apps_page_frame_seqid.split("-")[0],
      itemCode: event.apps_item_seqid
    }

    if (callingStr.length > 0) {
      if (this.globalobjects.callingPara.length > 0) {
        let glob = this.globalobjects.callingPara.find(x => x.objectCode == event.calling_object_code && x.itemCode == event.apps_item_seqid);

        if (glob) {
          for (let i of callingStr) {
            let flag = true;
            let index = 0;
            for (let c of glob.itmData) {
              if (i.split(":=")[0] == c.split(":=")[0]) {
                flag = false;
                glob.itmData[index] = i;
              }
            }
            if (flag) {
              glob.itmData.push(i);
            }
          }

        } else {
          this.globalobjects.callingPara.push(obj);
        }
      } else {
        this.globalobjects.callingPara.push(obj);
      }
    }
  }


  public get_item_value(name, rowIndex) {
    let frameName;
    let itemName;

    name = name.replaceAll("'", "");

    if (name.indexOf("::") > -1) {
      name = name.split("::")[1];
    } if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
      // if (name.indexOf("'") > -1) {
      //   itemName = name.split(".")[1].split("'")[0];
      // } else {

      // }

    } else {
      // if (name.indexOf("'") > -1) {
      //   itemName = name.split("'")[0];
      // } else {
      // }
      itemName = name
    }

    if (rowIndex) { } else { rowIndex = 0; }

    if (itemName.toLowerCase().substring(0, 2) == "g_") {
      // let userDetails = this.globalobjects.getLocallData("userDetails");

      for (let usr in this.globalobjects.userDetails) {
        if (usr.toLowerCase() == itemName.toLowerCase()) {
          return this.globalobjects.userDetails[usr];
        }
      }

    } else {

      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frameName ? (frame.apps_page_frame_seqid == frameName) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toUpperCase() : "") == frameName.toUpperCase() : true)) {

            rowIndex = rowIndex && typeof (rowIndex) == 'string' && (rowIndex.toLowerCase().includes("current_record") || rowIndex.toLowerCase().includes("wma_record_index")) ? frame.active_row : rowIndex;

            if (frame.tableRows && frame.tableRows.length > 0) {
              if (frame.tableRows && frame.tableRows[rowIndex]) {
                for (let itemGroup of frame.tableRows[rowIndex]) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                        let value;
                        if (item.datatype == "NUMBER") {
                          value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                          if (value) {
                            value = value.toString().replace(/,/g, "");
                            value = parseFloat(value);
                          } else {
                            value = "";
                          }
                        } else {
                          value = item.value ? item.value : "";
                        }

                        if (name.indexOf("'") > -1) {
                          return value + "'";
                        } else {
                          if (item.datatype == "NUMBER") {
                            if (value) {
                              return parseFloat(value);
                            } else {
                              return value;
                            }
                          } else {
                            return value;
                          }
                        }

                      }
                    }
                  }
                  else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {
                        if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                          let value;
                          if (item.datatype == "NUMBER") {
                            value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                            if (value) {
                              value = value.toString().replace(/,/g, "");
                              value = parseFloat(value);
                            } else {
                              value = "";
                            }
                          } else {
                            value = item.value ? item.value : "";
                          }
                          if (name.indexOf("'") > -1) {
                            return value + "'";
                          } else {
                            return value;
                          }
                        }
                      }
                    }
                  }
                }
              } else {

                for (let itemGroup of frame.tableRows[0]) {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                    for (let item of itemGroup.Level5) {
                      if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                        let value;
                        if (item.datatype == "NUMBER") {
                          value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                          if (value) {
                            value = value.toString().replace(/,/g, "");
                            value = parseFloat(value);
                          } else {
                            value = "";
                          }
                        } else {
                          value = item.value ? item.value : "";
                        }

                        if (name.indexOf("'") > -1) {
                          return value + "'";
                        } else {
                          if (item.datatype == "NUMBER") {
                            if (value) {
                              return parseFloat(value);
                            } else {
                              return value;
                            }
                          } else {
                            return value;
                          }
                        }

                      }
                    }
                  }
                  else {
                    if (itemGroup && itemGroup.length > 0) {
                      for (let item of itemGroup) {
                        if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                          let value;
                          if (item.datatype == "NUMBER") {
                            value = item.value ? JSON.parse(JSON.stringify(item.value)) : "";
                            if (value) {
                              value = value.toString().replace(/,/g, "");
                              value = parseFloat(value);
                            } else {
                              value = "";
                            }
                          } else {
                            value = item.value ? item.value : "";
                          }

                          if (name.indexOf("'") > -1) {
                            return value + "'";
                          } else {
                            return value;
                          }
                        }
                      }
                    }
                  }
                }

              }
            } else {
              for (let itemGroup of frame.Level4) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toUpperCase() == item.item_name.toUpperCase())))) {
                      return "";
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }


  set_item_value(name, rowIndex, value) {
    let frameName = '';
    let itemName;

    let addItem = true;
    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    let rowData = this.lhs_lib.get_name_index(itemName, frameName);

    if (itemName && itemName.trim().toLowerCase().startsWith("p_")) { } else {
      if (rowData) {
        frameName = rowData.frame_name;
        itemName = rowData.item_name;
        // itmIndex = rowData.item_index
      } else {
        return;
      }
    }

    if (rowIndex) { } else { rowIndex = 0; }

    for (let object of this.object_mast.Level2) {
      for (let frame of object.Level3) {
        if ((frameName ? (frame.apps_page_frame_seqid == frameName) : true) || (frameName ? (frame.frame_alias ? frame.frame_alias.toLowerCase() : "") == frameName.toLowerCase() : true)) {

          rowIndex = rowIndex && typeof (rowIndex) == 'string' && (rowIndex.toLowerCase().includes("current_record") || rowIndex.toLowerCase().includes("wma_record_index")) ? frame.active_row : rowIndex;

          if (frame.tableRows && frame.tableRows[rowIndex]) {

            for (let itemGroup of frame.tableRows[rowIndex]) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase())))) {

                    if (value) {
                      item.isValid = true;
                    }

                    if (frameName) {
                      return item.value = value
                    } else {
                      item.value = value
                    }

                    // let itm = this.lhs_lib.get_rows_item(frame.tableRows[rowIndex], 'WMA_RECORD_STATUS');
                    this.lhs_lib.make_row_dirty(item, frame.tableRows[rowIndex]);

                    addItem = false;
                  }
                }
              } else {
                if (itemGroup && itemGroup.length > 0) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {

                      if (value) {
                        item.isValid = true;
                      }

                      if (frameName) {
                        item.value = value
                      } else {
                        item.value = value
                      }

                      // let itm = this.lhs_lib.get_rows_item(frame.tableRows[rowIndex], 'WMA_RECORD_STATUS');
                      this.lhs_lib.make_row_dirty(item, frame.tableRows[rowIndex]);

                      addItem = false;
                    }
                  }
                }
              }
            }

            let frameLevel4 = frame.Level4;
            for (let itemGroup of frameLevel4) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                    if (value) {
                      item.isValid = true;
                    }
                    item.value = value
                  }
                }
              } else {
                if (itemGroup && itemGroup.length > 0) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {
                      if (value) {
                        item.isValid = true;
                      }
                      item.value = value;
                    }
                  }
                }
              }
            }

          } else {

            let newRecFlag: boolean = false;
            let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
            for (let itemGroup of frameLevel4) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {

                    if (value) {
                      item.isValid = true;
                    }

                    item.value = value
                    newRecFlag = true;
                    addItem = false;

                    // let itm = this.lhs_lib.get_rows_item(frameLevel4, 'WMA_RECORD_STATUS');
                    this.lhs_lib.make_row_dirty(item, frameLevel4);
                  }
                }
              } else {
                if (itemGroup && itemGroup.length > 0) {
                  for (let item of itemGroup) {
                    if ((itemName == item.apps_item_seqid) || (item.item_name && itemName && (itemName.toLowerCase() == item.item_name.toLowerCase()))) {

                      if (value) {
                        item.isValid = true;
                      }

                      item.value = value;
                      newRecFlag = true;
                      addItem = false;

                      // let itm = this.lhs_lib.get_rows_item(frameLevel4, 'WMA_RECORD_STATUS');
                      this.lhs_lib.make_row_dirty(item, frameLevel4);
                    }
                  }
                }
              }
            }

            if (newRecFlag) {
              if (frame.tableRows && frame.tableRows.length > 0) {
                frame.tableRows.push(frameLevel4);
              } else {
                frame.tableRows = [];
                frame.tableRows[0] = frameLevel4;
                this.processData.afterTableRows(frame);
              }
            }
          }

        }

      }
    }


    if (addItem) {
      for (let object of this.object_mast.Level2) {
        for (let frame of object.Level3) {
          if ((frame.apps_page_frame_seqid && frame.apps_page_frame_seqid.indexOf("PARA") > -1) && ((itemName.toUpperCase().indexOf("P_") > -1) || (frameName == this.object_mast.object_code + "-PARA"))) {

            let item = frame.tableRows && frame.tableRows.length > 0 ? this.lhs_lib.get_rows_item(frame.tableRows, itemName) : "";

            if (item) {
              this.lhs_lib.setValue(item, value, frame.apps_frame_type, frame.apps_page_frame_seqid);
              return;
            } else {

              if (frame.Level4 && frame.Level4.length > 0) {
                let itemGrp = JSON.parse(JSON.stringify(frame.Level4[0]));
                for (let item of itemGrp.Level5) {
                  item.item_default_value = "";
                  item.item_name = itemName?.toUpperCase();
                  item.prompt_name = itemName;
                  item.value = value;
                }

                if (frame.tableRows && frame.tableRows.length > 0) {
                  frame.tableRows[0].push(itemGrp);
                } else {
                  frame.tableRows = [];
                  frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4))

                  frame.tableRows[0].push(itemGrp);
                  this.lhs_lib.getSepratorGrp(frame);
                }
              }
            }
          }
        }
      }
    }

  }


  setGlobal(name, value, rowIndex) {

    let frameName = '';
    let itemName;

    if (name.indexOf(":") > -1) {
      name = name.split(":")[1];
    }

    if (name.indexOf(".") > -1) {
      frameName = name.split(".")[0];
      itemName = name.split(".")[1];
    } else {
      itemName = name;
    }

    if (this.clickEvent) {
      let callingStr = [];
      callingStr[0] = itemName + ":=" + value;
      let obj = {
        frameName: frameName,
        itmData: callingStr,
        objectCode: this.clickEvent.calling_object_code,
        itemCode: this.clickEvent.apps_item_seqid,
        rowIndex: rowIndex
      }

      if (callingStr.length > 0) {
        if (this.globalobjects.callingPara.length > 0) {
          let glob = this.globalobjects.callingPara.find(x => x.objectCode == obj.objectCode && x.itemCode == obj.itemCode);
          if (glob) {

            for (let c of callingStr) {
              let flag = true;
              for (let g of glob.itmData) {
                if (c == g) {
                  flag = false
                }
              }
              if (flag) {
                glob.itmData.push(c);
              }
            }

            //console.log(glob);
          } else {
            this.globalobjects.callingPara.push(obj);
          }
        } else {
          this.globalobjects.callingPara.push(obj);
        }
      }

    }
  }

  // setLovData(event) {
  //   let data = event.lovData;
  //   let lovCloseFlag: boolean = true;

  //   if (this.globalobjects.lovType && this.globalobjects.lovType == 'M') {
  //     lovCloseFlag = false;
  //   }

  //   if (lovCloseFlag) {
  //     let obj = {
  //       values: data[1].value,
  //       codeOfValues: data[0].value
  //     }
  //     let finObj = {
  //       value: obj,
  //       apps_item_seqid: this.wscpNav.apps_item_seqid
  //     }
  //     let glob = this.globalobjects.lovObjData.find(x => x.apps_item_seqid == this.wscpNav.apps_item_seqid && x.value.codeOfValues == data[0].value);

  //     if (glob) { } else {
  //       this.globalobjects.lovObjData.push(finObj);
  //     }
  //     this.popOverCtrl.dismiss(data);
  //   } else {
  //     let obj = {
  //       values: data[1].value,
  //       codeOfValues: data[0].value
  //     }
  //     let finObj = {
  //       value: obj,
  //       apps_item_seqid: this.wscpNav.apps_item_seqid
  //     }
  //     let glob = this.globalobjects.lovObjData.find(x => x.apps_item_seqid == this.wscpNav.apps_item_seqid && x.value.codeOfValues == data[0].value);
  //     // let glob = this.globalobjects.lovObjData.find(x => x.value.codeOfValues == data[0].value);

  //     if (glob) { } else {
  //       this.globalobjects.lovObjData.push(finObj);
  //     }
  //   }
  // }

  setLovData(event) {
    let data = event.lovData;
    let lovCloseFlag: boolean = true;

    if (this.globalobjects.lovType && this.globalobjects.lovType == 'M') {
      lovCloseFlag = false;
    }

    if (lovCloseFlag) {
      let obj = {
        values: data[1].value,
        codeOfValues: data[0].value
      }
      let finObj = {
        value: obj,
        apps_item_seqid: this.wscpNav.apps_item_seqid
      }
      let glob = this.globalobjects.lovObjData.find(x => x.apps_item_seqid == this.wscpNav.apps_item_seqid && x.value == data[0].value);

      if (glob) { } else {
        this.globalobjects.lovObjData.push(finObj);
      }
      this.popOverCtrl.dismiss(data);
    } else {
      // let obj = {
      //   values: data[1].value,
      //   codeOfValues: data[0].value
      // }
      let finObj = {
        value: data,
        apps_item_seqid: this.wscpNav.apps_item_seqid
      }
      let glob = this.globalobjects.lovObjData.find(x => x.apps_item_seqid == this.wscpNav.apps_item_seqid && JSON.stringify(x.value) == JSON.stringify(data));
      // let glob = this.globalobjects.lovObjData.find(x => x.value.codeOfValues == data[0].value);

      if (glob) { } else {
        this.globalobjects.lovObjData.push(finObj);
      }
    }
  }

  // app_add_para(isCalling, to, from) {

  //   if (isCalling) {
  //     let rowindex = 0;

  //     if (this.clickEvent && this.clickEvent.rowNumber != null && this.clickEvent.rowNumber != undefined) {
  //       rowindex = this.clickEvent.rowNumber;
  //     } else {
  //       let newInd = this.clickEvent ? (this.clickEvent.indexcount != undefined ? this.clickEvent.indexcount : (this.clickEvent.itemIndex ? this.clickEvent.itemIndex : (this.clickEvent.indexCount ? this.clickEvent.indexCount : 0))) : 0;
  //       let ind = this.clickEvent && this.clickEvent.max_record ? this.clickEvent.max_record + newInd : newInd;
  //       rowindex = ind;

  //       // if (this.clickEvent.itemIndex) {
  //       //   rowindex = this.clickEvent.itemIndex;
  //       // }
  //     }

  //     let str = ""
  //     let value;
  //     if (from.indexOf("::") > -1) {
  //       let fromArr = from.split("::");


  //       if ((fromArr[0] && ((fromArr[0] != "'") && (fromArr[0] != "\"'"))) || fromArr.length > 2) {

  //         for (let i = 0; i < fromArr.length; i++) {
  //           let val1 = "";
  //           let flag = false;
  //           if (i != 0) {


  //             if ((fromArr[i].indexOf(" ") > -1) || (fromArr[i].indexOf(",") > -1) || (fromArr[i].indexOf(")") > -1)) {


  //               let str = "";

  //               if (fromArr[i].indexOf(" ") > -1) {
  //                 let val = fromArr[i].split(" ");

  //                 let frame = this.lhs_lib.get_frame_config(val[0].split(".")[0]);
  //                 if (frame) {
  //                   rowindex = frame.active_row;
  //                 }

  //                 val1 = this.get_item_value(val[0], rowindex);

  //                 // val[0] = val1 ? "'"+ val1 +"'": val[0];
  //                 if (val1 == undefined) {
  //                   val[0] = val[0];
  //                 } else {
  //                   val[0] = "'" + val1 + "'";
  //                   flag = true;
  //                 }

  //                 fromArr[i] = val.join(" ");
  //                 // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
  //               } if (fromArr[i].indexOf(",") > -1) {

  //                 if (!flag) {

  //                   let val = fromArr[i].split(",");

  //                   let frame = this.lhs_lib.get_frame_config(val[0].split(".")[0]);
  //                   if (frame) {
  //                     rowindex = frame.active_row;
  //                   }

  //                   val1 = this.get_item_value(val[0], rowindex);

  //                   if (val1 == undefined) {
  //                     val[0] = val[0];
  //                   } else {
  //                     val[0] = "'" + val1 + "'";
  //                     flag = true;
  //                   }

  //                   fromArr[i] = val.join(",");
  //                 }

  //               } if (fromArr[i].indexOf(")") > -1) {

  //                 if (!flag) {

  //                   let val = fromArr[i].split(")");

  //                   let frame = this.lhs_lib.get_frame_config(val[0].split(".")[0]);
  //                   if (frame) {
  //                     rowindex = frame.active_row;
  //                   }

  //                   val1 = this.get_item_value(val[0], rowindex);

  //                   if (val1 == undefined) {
  //                     val[0] = val[0];
  //                   } else {
  //                     val[0] = "'" + val1 + "'";
  //                     flag = true;
  //                   }

  //                   fromArr[i] = val.join(")");

  //                 }
  //                 // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
  //               }
  //             }
  //             else {

  //               let frame = this.lhs_lib.get_frame_config(fromArr[i].split(".")[0]);
  //               if (frame) {
  //                 rowindex = frame.active_row;
  //               }

  //               val1 = this.get_item_value(fromArr[i], rowindex);
  //               // val1 ? fromArr[i] = "'" +val1 + "'" : fromArr[i] = "::"+ fromArr[i];
  //               (val1 == undefined) ? fromArr[i] = "::" + fromArr[i] : fromArr[i] = "'" + val1 + "'";
  //             }
  //           }
  //         }
  //       } else {

  //         let frame = this.lhs_lib.get_frame_config(fromArr[1].split(".")[0]);
  //         if (frame) {
  //           rowindex = frame.active_row;
  //         }


  //         let val1 = this.get_item_value(fromArr[1], rowindex);
  //         (val1 == undefined) ? fromArr[1] = "::" + fromArr[1] : fromArr[1] = val1;
  //       }

  //       value = fromArr.join("");
  //       value = (value == undefined) ? from : value.replace(/\n|\r/g, " ");
  //       if (to) {
  //         str = "app_add_para(false, \"" + to + "\",\"" + value + "\");";
  //       }
  //     } else {
  //       value = from ? from.toString().replace(/\n|\r/g, " ") : '';
  //       str = "app_add_para(false,\"" + to + "\",\"" + value + "\");";
  //     }

  //     if(this.clickEvent){
  //       let callObj = this.clickEvent.calling_object_code;
  //       let callItm = this.clickEvent.apps_item_seqid;
  //       if (this.clickEvent.calling_object_code && this.clickEvent.calling_object_code.toUpperCase() == 'FI_APPS_ITEM_SEQID') {
  //         callObj = this.lhs_lib.get_item_value(":FI_CALLING_OBJECT_CODE", 'current_record');
  //         callItm = this.lhs_lib.get_item_value(":FI_APPS_ITEM_SEQID", 'current_record');
  //       }


  //     let glob = this.globalobjects.callingParameter.find(x => x.obj_code == callObj && x.calling_item_seqid == callItm);

  //     if (glob) {
  //       glob.str = glob.str ? glob.str + str : "" + str;
  //     } else {

  //       let obj = {
  //         obj_code: callObj,
  //         calling_item_seqid: callItm,
  //         str: str
  //       }
  //       this.globalobjects.callingParameter.push(obj);
  //     }
  //   }

  //   } else {
  //     let value = from != undefined ? (typeof (from) == 'string' ? from.toString().replace(/\n|\r/g, " ") : from) : '';
  //     // value = value ? value : from;
  //     // let item = this.lhs_lib.get_item(to, 0);
  //     this.lhs_lib.set_item_value(null, to, 0, value, null, null);
  //   }

  // }
  app_add_para(isCalling, to, from) {

    if (isCalling) {
      let rowindex = 0;

      if (this.clickEvent && this.clickEvent.rowNumber != null && this.clickEvent.rowNumber != undefined) {
        rowindex = this.clickEvent.rowNumber;
      } else {
        let newInd = this.clickEvent ? (this.clickEvent.indexcount != undefined ? this.clickEvent.indexcount : (this.clickEvent.itemIndex ? this.clickEvent.itemIndex : (this.clickEvent.indexCount ? this.clickEvent.indexCount : 0))) : 0;
        let ind = this.clickEvent && this.clickEvent.max_record ? this.clickEvent.max_record + newInd : newInd;
        rowindex = ind;

        // if (this.clickEvent.itemIndex) {
        //   rowindex = this.clickEvent.itemIndex;
        // }
      }

      let str = ""
      let value;
      if (from.indexOf("::") > -1) {
        let fromArr = from.split("::");


        if ((fromArr[0] && ((fromArr[0] != "'") && (fromArr[0] != "\"'"))) || fromArr.length > 2) {

          for (let i = 0; i < fromArr.length; i++) {
            let val1 = "";
            let flag = false;
            if (i != 0) {


              if ((fromArr[i].indexOf(" ") > -1) || (fromArr[i].indexOf(",") > -1) || (fromArr[i].indexOf(")") > -1)) {


                let str = "";

                if (fromArr[i].indexOf(" ") > -1) {
                  let val = fromArr[i].split(" ");

                  let frame = this.lhs_lib.get_frame_config(val[0].split(".")[0]);
                  if (frame) {
                    rowindex = frame.active_row;
                  }

                  val1 = this.get_item_value(val[0], rowindex);

                  // val[0] = val1 ? "'"+ val1 +"'": val[0];
                  if (val1 == undefined) {
                    val[0] = val[0];
                  } else {
                    val[0] = "'" + val1 + "'";
                    flag = true;
                  }

                  fromArr[i] = val.join(" ");
                  // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
                } if (fromArr[i].indexOf(",") > -1) {

                  if (!flag) {

                    let val = fromArr[i].split(",");

                    let frame = this.lhs_lib.get_frame_config(val[0].split(".")[0]);
                    if (frame) {
                      rowindex = frame.active_row;
                    }

                    val1 = this.get_item_value(val[0], rowindex);

                    if (val1 == undefined) {
                      val[0] = val[0];
                    } else {
                      val[0] = "'" + val1 + "'";
                      flag = true;
                    }

                    fromArr[i] = val.join(",");
                  }

                } if (fromArr[i].indexOf(")") > -1) {

                  if (!flag) {

                    let val = fromArr[i].split(")");

                    let frame = this.lhs_lib.get_frame_config(val[0].split(".")[0]);
                    if (frame) {
                      rowindex = frame.active_row;
                    }

                    val1 = this.get_item_value(val[0], rowindex);

                    if (val1 == undefined) {
                      val[0] = val[0];
                    } else {
                      val[0] = "'" + val1 + "'";
                      flag = true;
                    }

                    fromArr[i] = val.join(")");

                  }
                  // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
                }
              }
              else {

                let frame = this.lhs_lib.get_frame_config(fromArr[i].split(".")[0]);
                if (frame) {
                  rowindex = frame.active_row;
                }

                val1 = this.get_item_value(fromArr[i], rowindex);
                // val1 ? fromArr[i] = "'" +val1 + "'" : fromArr[i] = "::"+ fromArr[i];
                (val1 == undefined) ? fromArr[i] = "::" + fromArr[i] : fromArr[i] = "'" + val1 + "'";
              }
            }
          }
        } else {

          let frame = this.lhs_lib.get_frame_config(fromArr[1].split(".")[0]);
          if (frame) {
            rowindex = frame.active_row;
          }


          let val1 = this.get_item_value(fromArr[1], rowindex);
          (val1 == undefined) ? fromArr[1] = "::" + fromArr[1] : fromArr[1] = val1;
        }

        value = fromArr.join("");
        value = (value == undefined) ? from : value.replace(/\n|\r/g, " ");
        if (to) {
          str = "app_add_para(false, \"" + to + "\",\"" + value + "\");";
        }
      } else {
        value = from ? from.toString().replace(/\n|\r/g, " ") : '';
        str = "app_add_para(false,\"" + to + "\",\"" + value + "\");";
      }

      if (this.clickEvent) {
        let callObj = this.clickEvent.calling_object_code;
        let callItm = this.clickEvent.apps_item_seqid;
        if (this.clickEvent.calling_object_code && this.clickEvent.calling_object_code.toUpperCase() == 'FI_APPS_ITEM_SEQID') {
          callObj = this.lhs_lib.get_item_value(":FI_CALLING_OBJECT_CODE", 'current_record');
          callItm = this.lhs_lib.get_item_value(":FI_APPS_ITEM_SEQID", 'current_record');
        }


        let glob = this.globalobjects.callingParameter.find(x => x.obj_code == callObj && x.calling_item_seqid == callItm);

        if (glob) {
          glob.str = glob.str ? glob.str + str : "" + str;
        } else {

          let obj = {
            obj_code: callObj,
            calling_item_seqid: callItm,
            str: str
          }
          this.globalobjects.callingParameter.push(obj);
        }
      }

    } else {
      let value = from != undefined ? (typeof (from) == 'string' ? from.toString().replace(/\n|\r/g, " ") : from) : '';
      // value = value ? value : from;
      // let item = this.lhs_lib.get_item(to, 0);
      this.lhs_lib.set_item_value(null, to, 0, value, null, null);
    }

  }

  // app_add_para_back(to, from) {

  //   if (to) {
  //     // if (this.clickEvent && this.clickEvent.calling_parameter_str) {
  //     //   let rowindex = 0;
  //     //   if (this.clickEvent.rowNumber != null && this.clickEvent.rowNumber != undefined) {
  //     //     rowindex = this.clickEvent.rowNumber;
  //     //   } else {
  //     //     // if (this.clickEvent.itemIndex) {
  //     //     //   rowindex = this.clickEvent.itemIndex;
  //     //     // }

  //     //     let newInd = this.clickEvent.indexcount != undefined ? this.clickEvent.indexcount : (this.clickEvent.itemIndex ? this.clickEvent.itemIndex : (this.clickEvent.indexCount ? this.clickEvent.indexCount : 0));
  //     //     let ind = this.clickEvent.max_record ? this.clickEvent.max_record + newInd : newInd;
  //     //     rowindex = ind;
  //     //   }

  //     //   let str = ""
  //     //   let value;
  //     //   if (from.indexOf("::") > -1) {

  //     //     let fromArr = from.split("::");

  //     //     if ((fromArr[0] && ((fromArr[0] != "'") && (fromArr[0] != "\"'"))) || fromArr.length > 2) {

  //     //       for (let i = 0; i < fromArr.length; i++) {
  //     //         let val1 = "";
  //     //         let flag = false;
  //     //         if (i != 0) {


  //     //           if ((fromArr[i].indexOf(" ") > -1) || (fromArr[i].indexOf(",") > -1) || (fromArr[i].indexOf(")") > -1)) {


  //     //             let str = "";

  //     //             if (fromArr[i].indexOf(" ") > -1) {
  //     //               let val = fromArr[i].split(" ");
  //     //               val1 = this.get_item_value(val[0], rowindex);

  //     //               // val[0] = val1 ? "'"+ val1 +"'": val[0];
  //     //               if (val1 == undefined) {
  //     //                 val[0] = val[0];
  //     //               } else {
  //     //                 val[0] = "'" + val1 + "'";
  //     //                 flag = true;
  //     //               }

  //     //               fromArr[i] = val.join(" ");
  //     //               // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
  //     //             } if (fromArr[i].indexOf(",") > -1) {

  //     //               if (!flag) {

  //     //                 let val = fromArr[i].split(",");
  //     //                 val1 = this.get_item_value(val[0], rowindex);

  //     //                 if (val1 == undefined) {
  //     //                   val[0] = val[0];
  //     //                 } else {
  //     //                   val[0] = "'" + val1 + "'";
  //     //                   flag = true;
  //     //                 }

  //     //                 fromArr[i] = val.join(",");
  //     //               }

  //     //             } if (fromArr[i].indexOf(")") > -1) {

  //     //               if (!flag) {

  //     //                 let val = fromArr[i].split(")");
  //     //                 val1 = this.get_item_value(val[0], rowindex);

  //     //                 if (val1 == undefined) {
  //     //                   val[0] = val[0];
  //     //                 } else {
  //     //                   val[0] = "'" + val1 + "'";
  //     //                   flag = true;
  //     //                 }

  //     //                 fromArr[i] = val.join(")");

  //     //               }
  //     //               // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
  //     //             }
  //     //           }
  //     //           else {
  //     //             val1 = this.get_item_value(fromArr[i], rowindex);
  //     //             // val1 ? fromArr[i] = "'" +val1 + "'" : fromArr[i] = "::"+ fromArr[i];
  //     //             (val1 == undefined) ? fromArr[i] = "::" + fromArr[i] : fromArr[i] = "'" + val1 + "'";
  //     //           }
  //     //         }
  //     //       }
  //     //     } else {
  //     //       let val1 = this.get_item_value(fromArr[1], rowindex);
  //     //       (val1 == undefined) ? fromArr[1] = "::" + fromArr[1] : fromArr[1] = val1;
  //     //     }

  //     //     value = fromArr.join("");
  //     //     value = (value == undefined) ? from : value;
  //     //     if (to) {
  //     //       str = "this.app_add_para_back(\'" + to + "\',\`" + value + "\`)";
  //     //     }
  //     //   } else {
  //     //     value = from;
  //     //     str = "this.app_add_para_back(\'" + to + "\',\`" + value + "\`)";
  //     //   }

  //     //   let glob = this.globalobjects.callingParameterBack.find(x => x.key == to);

  //     //   if (glob) {
  //     //     glob.str = str;
  //     //   } else {

  //     //     let obj = {
  //     //       key: to,
  //     //       str: str
  //     //     }
  //     //     this.globalobjects.callingParameterBack.push(obj);
  //     //   }

  //     // } else {
  //     //   let value = from;
  //     //   value = value ? value : from;
  //     //   this.set_item_value(to, 0, value);
  //     // }

  //     let value = from;
  //     value = value ? value : "";
  //     this.set_item_value(to, 0, value);
  //   }
  // }

  app_add_para_back(object_code, to, from) {

    if (!object_code) {
      object_code = this.object_mast.previousObj;
    }

    if (to) {
      if (this.clickEvent && this.clickEvent.calling_parameter_str) {
        let rowindex = 0;
        if (this.clickEvent.rowNumber != null && this.clickEvent.rowNumber != undefined) {
          rowindex = this.clickEvent.rowNumber;
        } else {
          // if (this.clickEvent.itemIndex) {
          //   rowindex = this.clickEvent.itemIndex;
          // }

          let newInd = this.clickEvent.indexcount != undefined ? this.clickEvent.indexcount : (this.clickEvent.itemIndex ? this.clickEvent.itemIndex : (this.clickEvent.indexCount ? this.clickEvent.indexCount : 0));
          let ind = this.clickEvent.max_record ? this.clickEvent.max_record + newInd : newInd;
          rowindex = ind;
        }

        let str = ""
        let value;
        if (from.indexOf("::") > -1) {

          let fromArr = from.split("::");

          if ((fromArr[0] && ((fromArr[0] != "'") && (fromArr[0] != "\"'"))) || fromArr.length > 2) {

            for (let i = 0; i < fromArr.length; i++) {
              let val1 = "";
              let flag = false;
              if (i != 0) {


                if ((fromArr[i].indexOf(" ") > -1) || (fromArr[i].indexOf(",") > -1) || (fromArr[i].indexOf(")") > -1)) {


                  let str = "";

                  if (fromArr[i].indexOf(" ") > -1) {
                    let val = fromArr[i].split(" ");
                    val1 = this.get_item_value(val[0], rowindex);

                    // val[0] = val1 ? "'"+ val1 +"'": val[0];
                    if (val1 == undefined) {
                      val[0] = val[0];
                    } else {
                      val[0] = "'" + val1 + "'";
                      flag = true;
                    }

                    fromArr[i] = val.join(" ");
                    // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
                  } if (fromArr[i].indexOf(",") > -1) {

                    if (!flag) {

                      let val = fromArr[i].split(",");
                      val1 = this.get_item_value(val[0], rowindex);

                      if (val1 == undefined) {
                        val[0] = val[0];
                      } else {
                        val[0] = "'" + val1 + "'";
                        flag = true;
                      }

                      fromArr[i] = val.join(",");
                    }

                  } if (fromArr[i].indexOf(")") > -1) {

                    if (!flag) {

                      let val = fromArr[i].split(")");
                      val1 = this.get_item_value(val[0], rowindex);

                      if (val1 == undefined) {
                        val[0] = val[0];
                      } else {
                        val[0] = "'" + val1 + "'";
                        flag = true;
                      }

                      fromArr[i] = val.join(")");

                    }
                    // val1 ? fromArr[i] =  val[0] + "'"+ val1 +"'" + val[1] : fromArr[i] = "::"+ fromArr[i] + val[1];
                  }
                }
                else {
                  val1 = this.get_item_value(fromArr[i], rowindex);
                  // val1 ? fromArr[i] = "'" +val1 + "'" : fromArr[i] = "::"+ fromArr[i];
                  (val1 == undefined) ? fromArr[i] = "::" + fromArr[i] : fromArr[i] = "'" + val1 + "'";
                }
              }
            }
          } else {
            let val1 = this.get_item_value(fromArr[1], rowindex);
            (val1 == undefined) ? fromArr[1] = "::" + fromArr[1] : fromArr[1] = val1;
          }

          value = fromArr.join("");
          value = (value == undefined) ? from : value;
          if (to) {
            str = `this.app_add_para_back('${object_code}', '${to}', '${value}')`;
          }
        } else {
          value = from;
          str = `this.app_add_para_back('${object_code}', '${to}', '${value}')`;
        }

        let glob = this.globalobjects.callingParameterBack.find(x => x.key == to && (!x.object_code || x.object_code == object_code));

        if (glob) {
          glob.str = str;
        } else {

          let obj = {
            key: to,
            str: str,
            object_code: object_code
          }
          this.globalobjects.callingParameterBack.push(obj);
        }

      } else {
        let value = from;
        value = value ? value : from;
        // this.set_item_value(to, 0, value);
        this.lhs_lib.set_item_value(null, to, 'current_record', value, null, null);
      }
    }
  }

  setParaCall(l_calling_para) {

    let str = "";

    let glob = this.globalobjects.callingParameter.find(x => x.obj_code == this.object_mast.object_code && x.calling_item_seqid == this.object_mast.calling_item_seqid);
    let g_str = this.globalobjects.global_Parameter;

    let userDetails = this.globalobjects.userDetails;
    let gstr = "";
    for (let usr in userDetails) {
      if (usr.substring(0, 2).toLowerCase() == "g_") {
        gstr = gstr + "app_add_para(false,\"" + usr.toLowerCase().replace("g_", "f_") + "\",\"" + userDetails[usr] + "\",true);";
      }
    }

    if (g_str) {
      if (gstr) {
        gstr = gstr + g_str;
      }
      str = g_str;
    } else {
      str = gstr ? gstr : "";
    }
    if (l_calling_para) {
      str = str + l_calling_para;
    }

    // if (g_str) {
    //   str = g_str;
    // } if (l_calling_para) {
    //   str = str + l_calling_para;
    // }

    if (str) {
      let valArr = [];
      if (str.indexOf(");") > -1) {
        valArr = str.split(");")
      } else {
        valArr[0] = str;
      }

      valArr.pop();

      // if (this.globalobjects.logFlag) {
      //   let name = "processing setPara called setpara";
      //   this.lhs_lib.get_event_log_obj(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, "start")
      // }

      for (let v of valArr) {
        //console.log(v);
        if (v.indexOf(");") > -1) { } else {
          v = v + ")";
        }
        let func = "this." + v;
        try {
          eval(func);
        } catch (e) {
          console.log(func);
          console.log(e);
        }
      }

      if (glob && glob.obj_load_str) {
        try {
          eval(glob.obj_load_str);
        } catch (e) {
          console.log(e);
        }

      }
    }

    // if (this.globalobjects.logFlag) {
    //   let name = "processing get_object_config called setpara";
    //   this.lhs_lib.get_event_log_obj(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, "end")
    // }

    //console.log("Done");
    let object_load_str = "";

    let sys_item = this.lhs_lib.get_item("sys_nfi", 0);
    if (sys_item) {
      object_load_str = sys_item.click_events_str;
    }
    this.lhs_lib.set_item_value({}, 'p_user_option_iud_seqid', 0, this.object_mast.iud_seqid);
    let p_item = this.lhs_lib.get_item("p_on_object_load_events_str", 0);
    if (p_item) {
      object_load_str = (object_load_str ?? '') + (p_item.value ?? '');
      if (!sys_item) {
        sys_item = p_item;
      }
    }
    if (this.globalobjects.isGetObjectConfig()) {
      this.globalobjects.isGetObjectConfig.set(false);
      if (!object_load_str) {
        this.globalobjects.hide_event_loading();
      }

    }

    if (object_load_str) {
      let event = JSON.parse(JSON.stringify(sys_item));
      event.itemClicked = "pre"
      event.click_events_str = object_load_str;

      this.itemClicked(event);
    }

  }

  async execute_js(value, item, type?) {
    // if(item.item_name == 'ACC_NAME') return;
    // console.log(`comes in execute_js of super component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,item.item_name);
    let event = JSON.parse(JSON.stringify(item));
    event.click_events_arr = [];
    delete event['click_events_count'];
    const supercomp=this;
    const utilvar = this;
    // supercomp = this;
    // utilvar = this;
    // this.globalobjects.setFocus(false);
    let convertedVal = this.lhs_lib_util(value, event);
    // this.globalobjects.rase = false;
    delete event['rase'];
    if (convertedVal.includes("ajs_")) {
      let arr = convertedVal.split("ajs_");
      let i = 0;
      for (let a of arr) {
        if (i > 0) {
          let evStr = a.split("(")[1].trim().charAt(0) == ")" ? "(event,supercomp" : "(event,supercomp,";
          let str = a.split("(")[0];
          let newStr = "utilvar.dynamic_func.oajs_" + str;
          // let noeval = new Function("return" + newStr)
          if (eval(newStr)) {
            //  console.log("oajs");
            str = "await utilvar.dynamic_func.oajs_" + str;
          } else {
            newStr = "utilvar.dynamic_func.gajs_" + str;
            if (eval(newStr)) {
              str = "await utilvar.dynamic_func.gajs_" + str;
            }
          }
          str = str + evStr;
          // let name = "await ajs_" + a.split("(")[0] + "(";
          let name = "utilvar.dynamic_func.ajs_" + a.split("(")[0] + "(";
          convertedVal = convertedVal.replaceAll(str, name);
          convertedVal = convertedVal.replaceAll(name, str);
        }
        i++;
      }

    }

    convertedVal = convertedVal.replaceAll(".app_required_frame(event,", ".app_required_frame(item,");
    convertedVal = convertedVal.replaceAll("this.", "supercomp?.") //.replaceAll("await", "");
    convertedVal = "try{  console.log('');" + convertedVal + " supercomp?.after_app_plsql(item,event);} catch(error) {if (error.message === 'Code Raised') {console.log(error);supercomp?.doAfterRaise(item);} else {console.error('Code Raised');supercomp?.doAfterRaise(item);await supercomp?.lhs_lib.msgbox(event,error,'raise');}}"
    // let func = new Function("(async () => {" + convertedVal + "})()");
    // try {
    //   let str = "(async () => {" + convertedVal + "})()";
    //   console.log(str);
    //   this.ngZone.run(async () => {
    //     await eval(str);
    //     this.cdr.detectChanges();
    //   });


    // } catch (e) {
    //   console.log(e);
    //   // this.globalobjects.setFocus(true);
    //   // alert("error function:- " + e);
    //   alert("error in parsing ajs:- " + convertedVal);
    // }
    try {

      if (this.clickEvent) {
        this.clickEvent.isJsRunning = true;
        console.log(this.clickEvent);
      }

      let str = "(async () => {" + convertedVal + "})()";
      console.log(str, `=======> ${item.item_name} --- ${type}`);
      // this.ngZone.run(async () => {
      try {

        // console.log(`evaluating in execute_js of super component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,item.item_name);
        if (this.globalobjects.logFlag) {
          let name = `executing ${type} of ${item.item_name}`;
          let ws_type = type;
          // this.lhs_lib.get_event_log_obj(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, "start",ws_type);
          let log_name = `execute_js ${type}_${item.item_name}`;
          let status = "start";
          const seq = this.lhs_lib.start();
          this.lhs_lib.get_event_log_objs(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, status, ws_type, log_name, seq)

        }

        await eval(str);
        this.ngZone.run(() => {

          // if (this.clickEvent) {
          //   console.log(this.clickEvent);
          //   delete this.clickEvent['isJsRunning'];
          // }
          // this.appRef.tick()
        })
        // console.log(`evaluating done in execute_js of super component ${new Date().getMinutes()} - ${new Date().getSeconds()} - ${new Date().getMilliseconds()}=====> `,item.item_name);
        if (this.globalobjects.logFlag) {
          let name = `executing ${type} of ${item.item_name}`;
          let ws_type = type;
          // this.lhs_lib.get_event_log_obj(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, "end",ws_type);
          let log_name = `execute_js ${type}_${item.item_name}`;
          let status = "end";
          this.lhs_lib.end();
          this.lhs_lib.get_event_log_objs(name, this.wscp.apps_page_frame_seqid, this.wscp.apps_item_seqid, this.object_mast.object_code, status, ws_type, log_name)
        }
      } catch (e) {
        await this.lhs_lib.msgbox(item, e, 'raise');
        this.ngZone.run(() => {
          this.doAfterRaise(item);
          // this.appRef.tick()
        })

      }
      // });
      // Use the function
      // const dynamicCode = "console.log('Hello, world!');";
      // this.executeAsyncCode("(async () => {" + convertedVal + "})()");

      // Create a new Function that returns an async function
      // const asyncFunc = new Function('return ' + str)();
      // return asyncFunc;
      // await func()

    } catch (e) {
      console.log(e);
      // // this.globalobjects.setFocus(true);
      this.doAfterRaise(item);
      // if (this.clickEvent) {
      //   this.clickEvent.isJsRunning = false;
      // }
      alert("error in parsing ajs:- " + convertedVal);
    }
    // const wrappedCode = `(async (item) => { ${convertedVal} })(); `;

    // // Use new Function to execute the code
    // const executeCode = new Function(wrappedCode);

    // // Run the code inside Angular's zone to trigger change detection
    // this.ngZone.run(async () => {
    //   try {
    //     await executeCode(item);
    //   } catch (error) {
    //     console.error('Error executing dynamic code:', error);
    //   }
    // });

    // this.ngZone.run(() => {
    //   this.cdr.detectChanges();
    // })
    return;
  }
  // Example function that takes dynamic code as a string
  executeAsyncCode(code: string) {
    try {
      // Create a new Function that returns an async function
      const asyncFunc = new Function('return ' + code)();
      return asyncFunc();
    } catch (error) {
      console.error('Error executing dynamic code:', error);
    }
  }



  after_app_plsql(event, item) {
    let frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seqid);

    // if (this.clickEvent) {
    //   delete this.clickEvent['isJsRunning'];
    //   console.log(this.clickEvent);
    // }

    event.rase = item.rase;
    if (!event.rase) {

    } else {
      this.clearQue();
      event.isValid = false;
      event.forcedInvalid = true;
      if (!this.globalobjects.isMsg) {
        // this.globalobjects.setFocus(true);
        if (!event.rase) {

        } else {
          this.clearQue();
        }
      }
    }

  }



  lhs_lib_util(value, event) {

    if (!value) return '';
    const supercomp=this;
    value = value.replaceAll("this.", "");
    value = value.replaceAll("supercomp.", "");
    value = value.replaceAll("event,", "");

    let doubMap = [];
    let singMap = [];
    let doubleQuote = value.match(/"(?:(?:\\"|[^"])*)"/g);
    if (doubleQuote && doubleQuote.length > 0) {
      for (let i = 0; i < doubleQuote.length; i++) {
        doubMap.push("@dob-" + i + "@####" + doubleQuote[i]);
        value = value.replaceAll(doubleQuote[i], "@dob-" + i + "@");
      }
    }

    let quotedStr = value.match(/'(?:(?:\\'|[^'])*)'/g);
    if (quotedStr && quotedStr.length > 0) {
      for (let i = 0; i < quotedStr.length; i++) {
        singMap.push("@SING-" + i + "@####" + quotedStr[i]);
        value = value.replaceAll(quotedStr[i], "@SING-" + i + "@");
      }
    }

    if (value.toLowerCase().indexOf("get_current_record(") > -1) {
      var regex4 = new RegExp("get_current_record", "ig");
      var replace = "this.lhs_lib.get_frame_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "get_current_record").replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("app_open_page(", "this.app_open_page(event,").replaceAll("APP_OPEN_PAGE(", "this.app_open_page(event,");
    }

    if (value.toLowerCase().indexOf("get_item_value(") > -1) {

      var regex4 = new RegExp("get_item_value", "ig");
      var replace = "this.lhs_lib.get_item_value(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }


    if (value.toLowerCase().indexOf("is_record_present(") > -1) {
      var regex4 = new RegExp("is_record_present", "ig");
      var replace = "await this.lhs_lib.is_record_present(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("set_lwsdp(") > -1) {

      var regex4 = new RegExp("set_lwsdp", "ig");
      var replace = "this.set_lwsdp(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }

    if (value.toLowerCase().indexOf("remove_lwsdp(") > -1) {

      var regex4 = new RegExp("remove_lwsdp", "ig");
      var replace = "this.remove_lwsdp(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }
    if (value.toLowerCase().indexOf("plsql_to_js(") > -1) {

      var regex4 = new RegExp("plsql_to_js", "ig");
      // var replace = "await this.set_dp_for_cb(";

      var replace = "this.plsql_to_js(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("clear_lwsdp(") > -1) {

      var regex4 = new RegExp("clear_lwsdp", "ig");
      var replace = "this.clear_lwsdp(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }

    if (value.toLowerCase().indexOf("app_backup_frame(") > -1) {

      var regex4 = new RegExp("app_backup_frame", "ig");
      var replace = "this.app_backup_frame(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }

    if (value.toLowerCase().indexOf("app_restore_frame(") > -1) {

      var regex4 = new RegExp("app_restore_frame", "ig");
      var replace = "this.app_restore_frame(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }

    if (value.toLowerCase().indexOf("copy_json(") > -1) {

      var regex4 = new RegExp("copy_json", "ig");
      var replace = "this.copy_json(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }

    if (value.toLowerCase().indexOf("app_open_advance_filter(") > -1) {

      var regex4 = new RegExp("app_open_advance_filter", "ig");
      var replace = "this.app_open_advance_filter(event";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("app_close_tab(") > -1) {

      var regex4 = new RegExp("app_close_tab", "ig");
      var replace = "this.app_close_tab(event";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("ws_open_url(") > -1) {

      var regex4 = new RegExp("ws_open_url", "ig");
      var replace = "this.ws_open_url(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("ws_call_url(") > -1) {

      var regex4 = new RegExp("ws_call_url", "ig");
      var replace = "await this.ws_call_url(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("ws_call_api(") > -1) {

      var regex4 = new RegExp("ws_call_api", "ig");
      var replace = "this.ws_call_api(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("app_execute_api(") > -1) {

      var regex4 = new RegExp("app_execute_api", "ig");
      var replace = "await this.getData(event,'app_execute_api'";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }



    if (value.toLowerCase().indexOf("app_show_frame(") > -1) {

      var regex4 = new RegExp("app_show_frame", "ig");
      var replace = "await this.app_show_frame(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("app_execute_batch(") > -1) {

      var regex4 = new RegExp("app_execute_batch", "ig");
      var replace = "await this.getData(event,'execute_batch'";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("app_gsp_service(") > -1) {

      var regex4 = new RegExp("app_gsp_service", "ig");
      var replace = "await this.getData(event,'gsp_service'";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }



    // if (value.toLowerCase().indexOf("next_iud_seqid(") > -1) {
    //   var regex4 = new RegExp("next_iud_seqid", "ig");
    //   var replace = "this.next_iud_seqid(";

    //   let str = "";
    //   let arr = value.match(regex4);
    //   for (let a of arr) {
    //     let fun = a + "("
    //     str = value.replaceAll(replace, fun).replaceAll(fun, replace);
    //   }
    //   value = str;
    // }

    if (value.toLowerCase().indexOf("get_item_search(") > -1) {

      var regex4 = new RegExp("get_item_search", "ig");
      // var replace = "await this.lhs_lib.get_item_search(";
      var replace = "this.lhs_lib.get_item_search(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }

    if (value.toLowerCase().indexOf("set_item_search(") > -1) {

      var regex4 = new RegExp("set_item_search", "ig");
      // var replace = "await this.set_item_search(event,";
      var replace = "this.set_item_search(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;


    }

    if (value.toLowerCase().indexOf("set_dp_for_cb(") > -1) {

      var regex4 = new RegExp("set_dp_for_cb", "ig");
      // var replace = "await this.set_dp_for_cb(";

      var replace = "this.set_dp_for_cb(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("plsql_to_js(") > -1) {

      var regex4 = new RegExp("plsql_to_js", "ig");
      // var replace = "await this.set_dp_for_cb(";

      var replace = "this.plsql_to_js(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("server_host(") > -1) {

      var regex4 = new RegExp("server_host", "ig");
      var replace = "this.server_host(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("timer(") > -1) {

      var regex4 = new RegExp("timer", "ig");
      var replace = "this.timer(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }


    if (value.toLowerCase().indexOf("stop_timer(") > -1) {

      var regex4 = new RegExp("timer", "ig");
      var replace = "this.stop_timer(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("app_itemclicked(") > -1) {

      var regex4 = new RegExp("app_itemclicked", "ig");
      var replace = "this.app_itemClicked(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }



    if (value.toLowerCase().indexOf("local_host(") > -1) {
      var regex4 = new RegExp("local_host", "ig");
      // var replace = "this.local_host(";
      var replace = "await this.localHostMethod(event";
      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("set_item_value(") > -1) {

      var regex4 = new RegExp("set_item_value", "ig");
      var replace = "this.lhs_lib.set_item_value(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("app_reload_frame(") > -1) {

      var regex4 = new RegExp("app_reload_frame", "ig");
      var replace = "this.app_reload_frame(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("populate_list(") > -1) {

      var regex4 = new RegExp("populate_list", "ig");
      var replace = "this.populate_list(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("populate_list_force(") > -1) {

      var regex4 = new RegExp("populate_list_force", "ig");
      var replace = "this.populate_list_force(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("set_row_values(") > -1) {
      var regex4 = new RegExp("set_row_values", "ig");
      var replace = "this.lhs_lib.set_row_values";

      value = value.replaceAll(replace, "set_row_values").replaceAll(regex4, replace);
      // value = value.replace(regex4, replace);
      //  value = value.replaceAll("set_row_values(", "this.lhs_lib.set_row_values(").replaceAll("SET_ROW_VALUES(", "this.lhs_lib.set_row_values(");
    }

    if (value.toLowerCase().indexOf("app_back_object(") > -1) {
      var regex4 = new RegExp("app_back_object", "ig");
      var replace = "this.app_back_object(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("app_clear_record(") > -1) {
      var regex4 = new RegExp("app_clear_record", "ig");
      var replace = "this.app_clear_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("async_a(") > -1) {
      var regex4 = new RegExp("async_a", "ig");
      var replace = "this.async_a(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("async_s(") > -1) {
      var regex4 = new RegExp("async_s", "ig");
      var replace = "await this.async_s(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }



    if (value.toLowerCase().indexOf("get_row_values(") > -1) {
      var regex4 = new RegExp("get_row_values", "ig");
      var replace = "this.lhs_lib.get_row_values";

      value = value.replaceAll(replace, "get_row_values").replaceAll(regex4, replace);
      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }
    if (value.toLowerCase().indexOf("app_required_item(") > -1) {
      var regex4 = new RegExp("app_required_item", "ig");
      var replace = "this.app_required_item";



      value = value.replaceAll(replace, "app_required_item").replaceAll(regex4, replace);
      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }

    // if (value.toLowerCase().indexOf("app_required_record(") > -1) {
    //   var regex4 = new RegExp("app_required_record", "ig");
    //   var replace = "this.lhs_lib.app_required_record(event,";

    //   let str = "";
    //   let arr = value.match(regex4);
    //   for (let a of arr) {
    //     let fun = a + "("
    //     str = value.replaceAll(replace, fun).replaceAll(fun, replace);
    //   }
    //   value = str;
    //   // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    // }


    if (value.toLowerCase().indexOf("app_required_record") > -1) {
      let specialStr = value.match(/app_required_record\(([^)]+)\)/g);

      if (specialStr && specialStr.length > 0) {
        for (let l of specialStr) {
          let str = "await new Promise(async (resolve) => {await " + l + ".then((res) => {if(res.rase){supercomp?.doAfterRaise(event);throw new Error('Code Raised');}resolve('')});})";
          //   let str = l + ";" + "this.globalobjects.alertTimer = false;await new Promise((resolve) => {let inter = setInterval(() => {if(this.globalobjects.alertTimer){clearInterval(inter);resolve('');}console.log('running');},1000)})";
          value = value.replace(l, str);
        }
      }

      // console.log(value);
      value = value.replaceAll('app_required_record(', 'this.app_required_record(event,');
    }

    if (value.toLowerCase().indexOf("app_required_frame") > -1) {
      let specialStr = value.match(/app_required_frame\(([^)]+)\)/g);

      if (specialStr && specialStr.length > 0) {
        for (let l of specialStr) {
          let str = `await new Promise(async (resolve) => {await  ${l} .then((res) => {
          if(res.rase){
            supercomp.globalobjects.setFocus(true);
            supercomp?.doAfterRaise(event);
               
            throw new Error('Code Raised');
          }resolve('')});})`;
          //   let str = l + ";" + "this.globalobjects.alertTimer = false;await new Promise((resolve) => {let inter = setInterval(() => {if(this.globalobjects.alertTimer){clearInterval(inter);resolve('');}console.log('running');},1000)})";
          value = value.replace(l, str);
        }
      }

      value = value.replaceAll('app_required_frame(', 'this.app_required_frame(event,');
    }

    // if (value.toLowerCase().indexOf("app_required_frame(") > -1) {
    //   var regex4 = new RegExp("app_required_frame", "ig");
    //   var replace = "this.app_required_frame(event,";

    //   let str = "";
    //   let arr = value.match(regex4);
    //   for (let a of arr) {
    //     let fun = a + "("
    //     str = value.replaceAll(replace, fun).replaceAll(fun, replace);
    //   }
    //   value = str;
    //   // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    // }

    if (value.toLowerCase().indexOf("app_copy_record(") > -1) {
      var regex4 = new RegExp("app_copy_record", "ig");
      var replace = "await this.lhs_lib.app_copy_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }

    if (value.toLowerCase().indexOf("app_paste_record(") > -1) {
      var regex4 = new RegExp("app_paste_record", "ig");
      var replace = "await this.lhs_lib.app_paste_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }

    if (value.toLowerCase().indexOf("app_back_page(") > -1) {

      console.log("lhs_lib_util app_back_page run ======>>>>>>>>>>>", event);
      var regex4 = new RegExp("app_back_page", "ig");
      var replace = "this.app_back_page(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }


    if (value.toLowerCase().indexOf("stop_time(") > -1) {
      var regex4 = new RegExp("stop_time", "ig");
      var replace = "this.stop_timer";

      value = value.replaceAll(replace, "stop_time").replaceAll(regex4, replace);
      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }

    if (value.toLowerCase().indexOf("app_copy_frame(") > -1) {
      var regex4 = new RegExp("app_copy_frame", "ig");
      var replace = "this.lhs_lib.app_copy_frame";

      value = value.replaceAll(replace, "app_copy_frame").replaceAll(regex4, replace);
      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }


    if (value.toLowerCase().indexOf("execute_json(") > -1) {
      var regex4 = new RegExp("execute_json", "ig");
      var replace = "this.execute_json";

      value = value.replaceAll(replace, "execute_json").replaceAll(regex4, replace);
      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }

    if (value.toLowerCase().indexOf("app_paste_frame(") > -1) {

      var regex4 = new RegExp("app_paste_frame", "ig");
      var replace = "this.app_paste_frame(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("get_row_values(", "this.lhs_lib.get_row_values(").replaceAll("GET_ROW_VALUES(", "this.lhs_lib.get_row_values(");
    }


    if (value.toLowerCase().indexOf("get_item_config(") > -1) {

      var regex4 = new RegExp("get_item_config", "ig");
      var replace = "this.lhs_lib.get_item_config";

      value = value.replaceAll(replace, "get_item_config").replaceAll(regex4, replace);

      //  value = value.replaceAll("get_item_config(", "this.lhs_lib.get_item_config(").replaceAll("GET_ITEM_CONFIG(", "this.lhs_lib.get_item_config(");
    }
    if (value.toLowerCase().indexOf("get_item(") > -1) {

      var regex4 = new RegExp("get_item", "ig");
      var replace = "this.lhs_lib.get_item";

      value = value.replaceAll(replace, "get_item").replaceAll(regex4, replace);

      // value = value.replaceAll("get_item(", "this.lhs_lib.get_item(").replaceAll("GET_ITEM_CONFIG(", "this.lhs_lib.get_item(");
    }
    if (value.toLowerCase().indexOf("set_item_config(") > -1) {

      var regex4 = new RegExp("set_item_config", "ig");
      var replace = "this.lhs_lib.set_item_config";

      value = value.replaceAll(replace, "set_item_config").replaceAll(regex4, replace);

    }
    if (value.toLowerCase().indexOf("set_visible_flag(") > -1) {

      var regex4 = new RegExp("set_visible_flag", "ig");
      var replace = "this.lhs_lib.set_visible_flag";

      value = value.replaceAll(replace, "set_visible_flag").replaceAll(regex4, replace);

    }

    if (value.toLowerCase().indexOf("set_enable_flag(") > -1) {

      var regex4 = new RegExp("set_enable_flag", "ig");
      var replace = "this.lhs_lib.set_enable_flag";

      value = value.replaceAll(replace, "set_enable_flag").replaceAll(regex4, replace);

    }


    if (value.toLowerCase().indexOf("set_matrix_item_config(") > -1) {

      var regex4 = new RegExp("set_matrix_item_config", "ig");
      var replace = "this.lhs_lib.set_matrix_item_config";

      value = value.replaceAll(replace, "set_matrix_item_config").replaceAll(regex4, replace);

    }


    if (value.toLowerCase().indexOf("set_rows_source_config(") > -1) {

      var regex4 = new RegExp("set_rows_source_config", "ig");
      var replace = "this.lhs_lib.set_rows_source_config";

      value = value.replaceAll(replace, "set_rows_source_config").replaceAll(regex4, replace);

      // value = value.replaceAll("set_rows_source_config(", "this.lhs_lib.set_rows_source_config(").replaceAll("SET_ROWS_SOURCE_CONFIG(", "this.lhs_lib.set_rows_source_config(");
    }
    if (value.toLowerCase().indexOf("get_frame_config(") > -1) {

      var regex4 = new RegExp("get_frame_config", "ig");
      var replace = "this.lhs_lib.get_frame_config";

      value = value.replaceAll(replace, "get_frame_config").replaceAll(regex4, replace);

      // value = value.replaceAll("get_frame_config(", "this.lhs_lib.get_frame_config(").replaceAll("GET_FRAME_CONFIG(", "this.lhs_lib.get_frame_config(");
    }
    if (value.toLowerCase().indexOf("set_frame_config(") > -1) {

      var regex4 = new RegExp("set_frame_config", "ig");
      var replace = "this.lhs_lib.set_frame_config";

      value = value.replaceAll(replace, "set_frame_config").replaceAll(regex4, replace);

      // let arr = value.match(regex4);
      // for (let a of arr) {
      //   value = value.replace(a + "(", replace)
      // }

      // value = value.replaceAll("set_frame_config(", "this.lhs_lib.set_frame_config(").replaceAll("SET_FRAME_CONFIG(", "this.lhs_lib.set_frame_config(");
    }
    if (value.toLowerCase().indexOf("get_page_config") > -1) {

      var regex4 = new RegExp("get_page_config", "ig");
      var replace = "this.lhs_lib.get_page_config";

      value = value.replaceAll(replace, "get_page_config").replaceAll(regex4, replace);

      //  value = value.replaceAll("get_page_config(", "this.lhs_lib.get_page_config(").replaceAll("GET_PAGE_CONFIG(", "this.lhs_lib.get_page_config(");
    }
    if (value.toLowerCase().indexOf("set_page_config(") > -1) {
      var regex4 = new RegExp("set_page_config", "ig");
      var replace = "this.lhs_lib.set_page_config";

      value = value.replaceAll(replace, "set_page_config").replaceAll(regex4, replace);

      // value = value.replaceAll("set_page_config(", "this.lhs_lib.set_page_config(").replaceAll("SET_PAGE_CONFIG(", "this.lhs_lib.set_page_config(");
    }
    if (value.toLowerCase().indexOf("sum(") > -1) {
      // var regex4 = new RegExp("sum", "ig");
      // var replace = "await this.lhs_lib.sum";

      // value = value.replaceAll(replace, "sum").replaceAll(regex4, replace);
      var regex4 = new RegExp("sum", "ig");
      var replace = "await this.lhs_lib.sum(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("sum(", "this.lhs_lib.sum(").replaceAll("SUM(", "this.lhs_lib.sum(");
    }
    if (value.toLowerCase().indexOf("count(") > -1) {
      // var regex4 = new RegExp("count", "ig");
      // var replace = "this.lhs_lib.count";

      // value = value.replaceAll(replace, "count").replaceAll(regex4, replace);

      var regex4 = new RegExp("count", "ig");
      var replace = "this.lhs_lib.count(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("count(", "this.lhs_lib.count(").replaceAll("COUNT(", "this.lhs_lib.count(");
    }
    if (value.toLowerCase().indexOf("count_d(") > -1) {
      // var regex4 = new RegExp("count_d", "ig");
      // var replace = "this.lhs_lib.count_d";

      // value = value.replaceAll(replace, "count").replaceAll(regex4, replace);


      var regex4 = new RegExp("count_d", "ig");
      var replace = "this.lhs_lib.count_d(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("count(", "this.lhs_lib.count(").replaceAll("COUNT(", "this.lhs_lib.count(");
    }
    if (value.toLowerCase().indexOf("avg(") > -1) {
      // var regex4 = new RegExp("avg", "ig");
      // var replace = "await this.lhs_lib.avg";

      // value = value.replaceAll(replace, "avg").replaceAll(regex4, replace);
      var regex4 = new RegExp("avg", "ig");
      var replace = "await this.lhs_lib.avg(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("avg(", "this.lhs_lib.avg(").replaceAll("AVG(", "this.lhs_lib.avg(");
    }
    if (value.toLowerCase().indexOf("min(") > -1) {
      // var regex4 = new RegExp("min", "ig");
      // var replace = "await this.lhs_lib.min";

      // value = value.replaceAll(replace, "min").replaceAll(regex4, replace);

      var regex4 = new RegExp("min", "ig");
      var replace = "await this.lhs_lib.min(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("min(", "this.lhs_lib.min(").replaceAll("MIN(", "this.lhs_lib.min(");
    }
    if (value.toLowerCase().indexOf("max(") > -1) {
      // var regex4 = new RegExp("max", "ig");
      // var replace = "await this.lhs_lib.max";

      // value = value.replaceAll(replace, "max").replaceAll(regex4, replace);

      var regex4 = new RegExp("max", "ig");
      var replace = "await this.lhs_lib.max(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("max(", "this.lhs_lib.max(").replaceAll("MAX(", "this.lhs_lib.max(");
    }
    if (value.toLowerCase().indexOf("find(") > -1) {
      // var regex4 = new RegExp("find", "ig");
      // var replace = "await this.lhs_lib.find";

      // value = value.replaceAll(replace, "find").replaceAll(regex4, replace);

      var regex4 = new RegExp("find", "ig");
      var replace = "this.lhs_lib.find(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("max(", "this.lhs_lib.max(").replaceAll("MAX(", "this.lhs_lib.max(");
    }

    // BY ARTI - 22-10-2026
    // if (value.toLowerCase().includes("ajs_") > -1) {
    //   value = value.replaceAll("ajs_", "utilvar.dynamic_func.ajs_");
    // }
    //END BY ARTI
    if (value.toLowerCase().indexOf("table_rows") > -1) {
      var regex4 = new RegExp("table_rows", "ig");
      var replace = "this.lhs_lib.table_rows";

      value = value.replaceAll(replace, regex4).replaceAll(regex4, replace);

      // value = value.replaceAll("table_rows", "tableRows").replaceAll("TABLE_ROWS", "tableRows");
    }
    if (value.toLowerCase().indexOf("app_add_para(") > -1) {

      var regex4 = new RegExp("app_add_para", "ig");
      var replace = "this.app_add_para(false,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;



      // var regex4 = new RegExp("app_add_para", "ig");
      // var replace = "this.app_add_para";

      // value = value.replaceAll(replace, "app_add_para").replaceAll(regex4, replace);

      //value = value.replaceAll("app_add_para(", "this.app_add_para(").replaceAll("APP_ADD_PARA(", "this.app_add_para(");
    }

    if (value.toLowerCase().indexOf("app_add_para_cp(") > -1) {

      var regex4 = new RegExp("app_add_para_cp", "ig");
      var replace = "this.app_add_para_cp(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("app_add_para_lp(") > -1) {

      var regex4 = new RegExp("app_add_para_lp", "ig");
      var replace = "this.app_add_para_lp(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }


    if (value.toLowerCase().indexOf("go_item(") > -1) {
      var regex4 = new RegExp("go_item", "ig");
      var replace = "this.lhs_lib.go_item";

      value = value.replaceAll(replace, "go_item").replaceAll(regex4, replace);

      // value = value.replaceAll("go_item(", "this.lhs_lib.go_item(").replaceAll("GO_ITEM(", "this.lhs_lib.go_item(");
    }
    if (value.toLowerCase().indexOf("app_duplicate_record(") > -1) {
      var regex4 = new RegExp("app_duplicate_record", "ig");
      let replace = "this.lhs_lib.app_duplicate_record(event,";
      if (value.includes(" ;") || value.includes(";")) {
        replace = "this.lhs_lib.app_duplicate_record(event,";
      }

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll(replace, "app_execute_item").replaceAll(regex4, replace);

      //value = value.replaceAll("this.app_execute_item(", "app_execute_item(").replaceAll("app_execute_item(", "this.app_execute_item(").replaceAll("APP_EXECUTE_ITEM(", "this.app_execute_item(");
    }
    if (value.toLowerCase().indexOf("app_execute_item(") > -1) {
      var regex4 = new RegExp("app_execute_item", "ig");
      let replace = "this.app_execute_item(event,";
      if (value.includes(" ;") || value.includes(";")) {
        replace = "await this.app_execute_item(event,";
      }

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll(replace, "app_execute_item").replaceAll(regex4, replace);

      //value = value.replaceAll("this.app_execute_item(", "app_execute_item(").replaceAll("app_execute_item(", "this.app_execute_item(").replaceAll("APP_EXECUTE_ITEM(", "this.app_execute_item(");
    }
    if (value.toLowerCase().indexOf("app_execute_frame(") > -1) {


      var regex4 = new RegExp("app_execute_frame", "ig");

      var replace = "await this.app_execute_frame(event,";

      // if(value.includes(" ;") || value.includes(";")){
      //   replace = "await this.app_execute_frame(event,";
      // }

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("open_lov(") > -1) {
      value = value.replaceAll("this.open_lov(event,", "open_lov(");
      value = value.replaceAll("supercomp.open_lov(event,", "open_lov(");

      var regex4 = new RegExp("open_lov", "ig");
      var replace = "await this.open_lov(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("open_lov(", "this.open_lov(event,").replaceAll("OPEN_LOV(", "this.open_lov(event,");
    }

    if (value.toLowerCase().indexOf("open_lov_wd(") > -1) {
      value = value.replaceAll("this.open_lov_wd(event,", "open_lov_wd(");
      value = value.replaceAll("supercomp.open_lov_wd(event,", "open_lov_wd(");

      var regex4 = new RegExp("open_lov_wd", "ig");
      var replace = "await this.open_lov_wd(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("open_lov(", "this.open_lov(event,").replaceAll("OPEN_LOV(", "this.open_lov(event,");
    }

    if (value.toLowerCase().indexOf("open_multi_lov(") > -1) {
      value = value.replaceAll("this.open_multi_lov(event,", "open_multi_lov(");
      value = value.replaceAll("supercomp.open_multi_lov(event,", "open_multi_lov(");

      var regex4 = new RegExp("open_multi_lov", "ig");
      var replace = "this.open_multi_lov(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("open_multi_lov(", "this.open_lov(event,").replaceAll("OPEN_MULTI_LOV(", "this.open_lov(event,");
    }
    if (value.toLowerCase().indexOf("app_clear_item") > -1) {
      var regex4 = new RegExp("app_clear_item", "ig");
      var replace = "this.lhs_lib.app_clear_item(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("search_item(", "this.lhs_lib.search_item(event,").replaceAll("SEARCH_ITEM(,", "this.lhs_lib.search_item(event,");
    }
    if (value.toLowerCase().indexOf("app_clear_frame(") > -1) {
      var regex4 = new RegExp("app_clear_frame", "ig");
      var replace = "this.app_clear_frame";

      value = value.replaceAll(replace, "app_clear_frame").replaceAll(regex4, replace);

      //value = value.replaceAll("app_clear_frame(", "this.app_clear_frame(").replaceAll("APP_CLEAR_FRAME(", "this.app_clear_frame(");
    }
    if (value.toLowerCase().indexOf("app_delete_record") > -1) {
      var regex4 = new RegExp("app_delete_record", "ig");
      var replace = "this.app_delete_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
      // value = value.replaceAll(replace, "app_delete_record").replaceAll(regex4, replace);

      //value = value.replaceAll("app_delete_record(", "this.lhs_lib.app_delete_record(").replaceAll("APP_DELETE_RECORD(", "this.lhs_lib.app_delete_record(");
    }
    if (value.toLowerCase().indexOf("search_item") > -1) {
      var regex4 = new RegExp("search_item", "ig");
      var replace = "this.search_item(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("search_item(", "this.lhs_lib.search_item(event,").replaceAll("SEARCH_ITEM(,", "this.lhs_lib.search_item(event,");
    }
    if (value.toLowerCase().indexOf("app_create_table_record(") > -1) {
      var regex4 = new RegExp("app_create_table_record", "ig");
      var replace = "await this.addNewRow(event,";
      //  var replace = "this.addNewRow(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll(replace, "app_create_table_record").replaceAll(regex4, replace);

      //value = value.replaceAll("app_create_table_record(", "this.addNewRow(").replaceAll("APP_CREATE_TABLE_RECORD(", "this.addNewRow(");
    }
    if (value.toLowerCase().indexOf("app_create_record(") > -1) {
      var regex4 = new RegExp("app_create_record", "ig");
      var replace = "await this.app_create_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("app_create_record(", "this.app_create_record(event,").replaceAll("APP_CREATE_RECORD(", "this.app_create_record(event,");
    }
    if (value.toLowerCase().indexOf("app_edit_record(") > -1) {
      var regex4 = new RegExp("app_edit_record", "ig");
      var replace = "await this.app_edit_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("app_edit_record(", "this.app_edit_record(event,").replaceAll("APP_EDIT_RECORD(", "this.app_edit_record(event,");
    }
    if (value.toLowerCase().indexOf("app_restore_record(") > -1) {
      var regex4 = new RegExp("app_restore_record", "ig");
      var replace = "this.lhs_lib.app_restore_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("app_restore_record(event,", "this.lhs_lib.app_restore_record(event,").replaceAll("APP_RESTORE_RECORD(", "this.lhs_lib.app_restore_record(event,");
    }
    if (value.toLowerCase().indexOf("app_selected_record(") > -1) {
      var regex4 = new RegExp("app_selected_record", "ig");
      var replace = "await this.lhs_lib.app_selected_record(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

      //value = value.replaceAll("app_create_record(", "this.app_create_record(event,").replaceAll("APP_CREATE_RECORD(", "this.app_create_record(event,");
    }
    if (value.toLowerCase().indexOf("pass_frame_data(") > -1) {
      var regex4 = new RegExp("pass_frame_data", "ig");
      var replace = "this.lhs_lib.pass_frame_data";

      value = value.replaceAll(replace, "pass_frame_data").replaceAll(regex4, replace);

    }
    if (value.toLowerCase().indexOf("go_home_page(") > -1) {
      var regex4 = new RegExp("go_home_page", "ig");
      var replace = "this.go_home_page";

      value = value.replaceAll(replace, "go_home_page").replaceAll(regex4, replace);

    }
    if (value.toLowerCase().indexOf("app_reload_object(") > -1) {
      var regex4 = new RegExp("app_reload_object", "ig");
      var replace = "this.app_reload_object";

      value = value.replaceAll(replace, "app_reload_object").replaceAll(regex4, replace);

    }

    if (value.toLowerCase().indexOf("app_delo(") > -1) {
      var regex4 = new RegExp("app_delo", "ig");
      var replace = "await this.app_delo";

      value = value.replaceAll(replace, "app_delo").replaceAll(regex4, replace);

    }

    if (value.toLowerCase().indexOf("app_open_page(") > -1) {
      var regex4 = new RegExp("app_open_page", "ig");
      var replace = "this.app_open_page(event,event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "app_open_page").replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("app_open_page(", "this.app_open_page(event,").replaceAll("APP_OPEN_PAGE(", "this.app_open_page(event,");
    }

    if (value.toLowerCase().indexOf("get_object_config(") > -1) {
      var regex4 = new RegExp("get_object_config", "ig");
      var replace = "this.get_object_config(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "get_object_config").replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("app_next_page(") > -1) {
      var regex4 = new RegExp("app_next_page", "ig");
      var replace = "this.app_open_page(event,event";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "app_next_page").replaceAll(fun, replace);
      }
      value = str;

    }
    if (value.toLowerCase().indexOf("app_append_next_page(") > -1) {
      var regex4 = new RegExp("app_append_next_page", "ig");
      var replace = "this.app_append_next_page(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "app_append_next_page").replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("get_ref_cursor(") > -1) {
      var regex4 = new RegExp("get_ref_cursor", "ig");
      var replace = "await this.get_ref_cursor(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "get_ref_cursor").replaceAll(fun, replace);
      }
      value = str;

    }

    if (value.toLowerCase().indexOf("download_text(") > -1) {
      var regex4 = new RegExp("download_text", "ig");
      var replace = "this.download_text(event,";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "download_text").replaceAll(fun, replace);
      }
      value = str;

      // value = value.replaceAll("app_open_page(", "this.app_open_page(event,").replaceAll("APP_OPEN_PAGE(", "this.app_open_page(event,");
    }

    if (value.toLowerCase().indexOf("set_error_msg(") > -1) {
      var regex4 = new RegExp("set_error_msg", "ig");
      var replace = "this.set_error_msg(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "set_error_msg").replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("remove_error_msg(") > -1) {
      var regex4 = new RegExp("remove_error_msg", "ig");
      var replace = "this.remove_error_msg(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, "remove_error_msg").replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("app_first_record(") > -1) {
      var regex4 = new RegExp("app_first_record", "ig");
      var replace = "await this.lhs_lib.app_first_record(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }
    if (value.toLowerCase().indexOf("app_last_record(") > -1) {
      var regex4 = new RegExp("app_last_record", "ig");
      var replace = "await this.lhs_lib.app_last_record(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }
    if (value.toLowerCase().indexOf("app_go_record(") > -1) {
      var regex4 = new RegExp("app_go_record", "ig");
      var replace = "await this.lhs_lib.app_go_record(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }
    if (value.toLowerCase().indexOf("app_previous_record(") > -1) {
      var regex4 = new RegExp("app_previous_record", "ig");
      var replace = "await this.lhs_lib.app_previous_record(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }
    if (value.toLowerCase().indexOf("app_next_record(") > -1) {
      var regex4 = new RegExp("app_next_record", "ig");
      var replace = "await this.lhs_lib.app_next_record(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("next_iud_seqid(") > -1) {
      var regex4 = new RegExp("next_iud_seqid", "ig");
      var replace = "await this.next_iud_seqid(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("parseint(") > -1) {
      var regex4 = new RegExp("parseint", "ig");
      var replace = "parseInt";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        str = value.replaceAll(replace, a).replaceAll(a, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("parsefloat(") > -1) {
      var regex4 = new RegExp("parsefloat", "ig");
      var replace = "parseFloat";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        str = value.replaceAll(replace, a).replaceAll(a, replace);
      }
      value = str;
    }
    if (value.toLowerCase().indexOf("app_collapse_frame(") > -1) {
      var regex4 = new RegExp("app_collapse_frame", "ig");
      var replace = "await this.lhs_lib.app_collapse_frame(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }
    if (value.toLowerCase().indexOf("app_uncollapse_frame(") > -1) {
      var regex4 = new RegExp("app_uncollapse_frame", "ig");
      var replace = "await this.lhs_lib.app_uncollapse_frame(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("app_collapse_item(") > -1) {
      var regex4 = new RegExp("app_collapse_item", "ig");
      var replace = "await this.lhs_lib.app_collapse_item(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }


    if (value.toLowerCase().indexOf("app_uncollapse_item(") > -1) {
      var regex4 = new RegExp("app_uncollapse_item", "ig");
      var replace = "await this.lhs_lib.app_uncollapse_item(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("set_row_config(") > -1) {
      var regex4 = new RegExp("set_row_config", "ig");
      var replace = "await this.lhs_lib.set_row_config(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("is_record_present(") > -1) {
      var regex4 = new RegExp("is_record_present", "ig");
      var replace = "await this.lhs_lib.is_record_present(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }

    if (value.toLowerCase().indexOf("app_frame_fullScreen(") > -1) {

      var regex4 = new RegExp("app_frame_fullScreen", "ig");
      var replace = "await this.app_frame_fullScreen(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }


    if (value.toLowerCase().includes("release_for_input(")) {
      var regex4 = new RegExp("release_for_input", "ig");
      var replace = "this.globalobjects.stop_loading_side(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }
    if (value.toLowerCase().indexOf("lock_for_input(") > -1) {
      var regex4 = new RegExp("lock_for_input", "ig");
      var replace = "this.globalobjects.start_loading_side(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }
    if (value.toLowerCase().indexOf("encrypt_value") > -1) {
      var regex4 = new RegExp("encrypt_value", "ig");
      var replace = "await this.lhs_lib.encrypt_value(";
      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;
    }


    let tempkey = "";
    for (let i = 0; i < doubMap.length; i++) {
      tempkey = doubMap[i].split("####");
      if (value.includes(tempkey[0].toLowerCase())) {
        value = value.replaceAll(tempkey[0] + "", tempkey[1]);
        //  alert("data=gdsfdff=?"+data)
      }
    }

    tempkey = "";
    for (let i = 0; i < singMap.length; i++) {
      tempkey = singMap[i].split("####");
      if (value.includes(tempkey[0])) {
        value = value.replaceAll(tempkey[0] + "", tempkey[1]);
        //  alert("data=gdsfdff=?"+data)
      }
    }

    if (value.toLowerCase().indexOf("alert(") > -1) {

      var regex4 = new RegExp("alert", "ig");
      var replace = "msgbox(";

      let str = "";
      let arr = value.match(regex4);
      for (let a of arr) {
        let fun = a + "("
        str = value.replaceAll(replace, fun).replaceAll(fun, replace);
      }
      value = str;

    }

    // if (value.toLowerCase().indexOf("alert") > -1) {
    //   var specialStr = value.match(/alert\(([^)]+)\)/g);

    //   if (specialStr && specialStr.length > 0) {
    //     for (let l of specialStr) {
    //       let str = l + ";" + "this.globalobjects.alertTimer = false;await new Promise((resolve) => {let inter = setInterval(() => {if(this.globalobjects.alertTimer){this.globalobjects.alertTimer = false;clearInterval(inter);resolve('');}},1000)})";
    //       value = value.replace(l, str);
    //     }
    //   }

    //   value = value.replaceAll('alert(', 'this.lhs_lib.msgbox(event,');
    // }



    if (value.toLowerCase().indexOf("msgbox(") > -1) {
      var specialStr: any = this.extractMsgboxArguments(value)
      if (specialStr && specialStr.length > 0) {
        for (let l of specialStr) {

          l = l.replace(";", " ")
          l = l.replace(/\n+/g, '');
          l = l.replace(/\)\s*$/, ')');
          let m = l;
          m = m.replace('msgbox(', 'AAmsgbox(AA')

          let str = "await new Promise(async (resolve) => {await " + m + ".then(() => {if(event.rase){ supercomp?.doAfterRaise(event);throw new Error('Code Raised');}resolve('')});})";


          //   let str = l + ";" + "this.globalobjects.alertTimer = false;await new Promise((resolve) => {let inter = setInterval(() => {if(this.globalobjects.alertTimer){clearInterval(inter);resolve('');}console.log('running');},1000)})";
          value = value.replace(l, str);
        }
      }
      value = value.replaceAll('AAmsgbox(AA', 'this.lhs_lib.msgbox(event,');
    }

    if (value.toLowerCase().indexOf("app_confirm_msg") > -1) {
      var specialStr = value.match(/app_confirm_msg\(([^)]+)\)/g);

      if (specialStr && specialStr.length > 0) {
        for (let l of specialStr) {
          // let str = `await new Promise((resolve) => {${l}.then(res => {resolve(res)});})`;
          let str = "await new Promise(async (resolve) => {await " + l + ".then(res => {resolve(res)});})";

          // let str = "await " + l + ";" + "this.globalobjects.confirmTimer = false;await new Promise((resolve) => {let interv = setInterval(() => {if(this.globalobjects.confirmTimer){this.globalobjects.confirmTimer = false;clearInterval(interv);resolve('');}console.log('interv')},1000)})";
          value = value.replace(l, str);
        }
      }

      value = value.replaceAll('app_confirm_msg(', 'this.lhs_lib.app_confirm_msg(event,');
    }


    if (value.toLowerCase().indexOf("sys_current_frame") > -1) {
      var regex4 = new RegExp("sys_current_frame", "ig");
      value = value.replaceAll(regex4, this.lhs_lib.sys_current_frame);
      // value = value.replaceAll("raise", "raise = true").replaceAll("RAISE", "raise = true");
    }

    if (value.toLowerCase().indexOf("sys_last_frame") > -1) {
      var regex4 = new RegExp("sys_last_frame", "ig");
      value = value.replaceAll(regex4, this.lhs_lib.sys_last_frame);
      // value = value.replaceAll("raise", "raise = true").replaceAll("RAISE", "raise = true");
    }

    if (value.toLowerCase().indexOf("sys_current_item") > -1) {
      var regex4 = new RegExp("sys_current_item", "ig");
      value = value.replaceAll(regex4, this.lhs_lib.sys_current_item);
      // value = value.replaceAll("raise", "raise = true").replaceAll("RAISE", "raise = true");
    }

    if (value.toLowerCase().indexOf("sys_last_item") > -1) {
      var regex4 = new RegExp("sys_last_item", "ig");
      value = value.replaceAll(regex4, this.lhs_lib.sys_last_item);
      // value = value.replaceAll("raise", "raise = true").replaceAll("RAISE", "raise = true");
    }

    if (value.toLowerCase().indexOf("sys_current_record") > -1) {
      var regex4 = new RegExp("sys_current_record", "ig");
      value = value.replaceAll(regex4, this.lhs_lib.sys_current_rownumber);
      // value = value.replaceAll("raise", "raise = true").replaceAll("RAISE", "raise = true");
    }


    if (value.toLowerCase().indexOf("raise;") > -1) {
      var regex4 = new RegExp("raise", "ig");
      value = value.replaceAll(regex4, "supercomp?.doAfterRaise(event);throw new Error('Code Raised');");
      // value = value.replaceAll("raise", "raise = true").replaceAll("RAISE", "raise = true");
    }


    // if (value.toLowerCase().indexOf("raise") > -1) {
    //   var regex4 = new RegExp("raise", "ig");
    //   value = value.replaceAll(regex4, "event.rase = true;");
    //   // value = value.replaceAll("raise", "raise = true").replaceAll("RAISE", "raise = true");
    // }
    //  value = value.replaceAll("current_record", ind).replaceAll("CURRENT_RECORD", ind);

    return value;
  }


  doAfterRaise(event) {
    // this.globalobjects.setFocus(true);
    event.isValid = false;
    event.forcedInvalid = true;
    if (this.clickEvent && this.clickEvent['isJsRunning']) {
      delete this.clickEvent['isJsRunning'];
    }
    this.clearQue()
  }

  refreshItem(itemName, event, type) {
    itemName = itemName.replaceAll("'", "");
    let name = "refreshItem_" + itemName + '_' + event.indexcount;
    let obj = {
      evFlag: "T",
      item_name: itemName

    }

    if (type.toLowerCase().includes('force')) {
      let item = this.lhs_lib.get_item(itemName, event.indexcount);
      if (item) {
        delete item['objectData'];
      }
    }

    this.events.publish(name, obj);
  }

  getParsStr(str, index?) {
    let strArr = [];
    let strg;
    if (str.indexOf("and") > -1) {

      strArr = str.split("and");
    } else {
      strArr[0] = str
    }

    for (let i = 0; i < strArr.length; i++) {
      let strNameArr = strArr[i].split("=");

      if (strNameArr[1].toLowerCase() == "slno") {
        strNameArr[1] = this.item_slno_count;
        this.item_slno_count = this.item_slno_count + 1;
      } else {
        let name = this.lhs_lib.get_item_value(strNameArr[1], index);
        strNameArr[1] = name;
      }

      strArr[i] = strNameArr.join("=");
    }
    strg = strArr.join(" && ");
    return strg;
  }



  app_create_record(event, to, from, itm_slno_name?, whereCond?) {

    // let itm_slno_name = whereCond;
    let fromFrame = from;
    let toFrame = to;
    let itm_slno;

    let frame = this.lhs_lib.get_frame_config(fromFrame, null, true);
    let tempFrame = this.lhs_lib.get_frame_config(toFrame, null, true);
    let index = frame.active_row != undefined ? frame.active_row : (event.itemIndex ?? 0);


    // let itemName = frame.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
    // let frameStatus = this.lhs_lib.get_item(itemName, index, true);

    let frameStatus;
    if (frame) {
      let tableRows = this.lhs_lib.get_rows(frame, index, true);
      if (tableRows) {
        frameStatus = this.lhs_lib.check_row_dirty(event, tableRows);
      }
    }

    if (frameStatus && frameStatus.frame_status && (frameStatus.frame_status).toLowerCase() == 'dirty') {

      this.lhs_lib.remove_extra_record(tempFrame);



      if (itm_slno_name) {

        // if (itm_slno_name.split("=")[1].replace(":", "").toLowerCase() == "slno") {
        //   itm_slno = this.item_slno_count;
        //   //  this.item_slno_count = this.item_slno_count + 1;
        // } else {
        // }
        itm_slno = this.lhs_lib.get_item_value(itm_slno_name.split("=")[1], 0, true);

        for (let i = 0; i < frame.tableRows.length; i++) {
          let frameLevel4 = JSON.parse(JSON.stringify(frame.tableRows[i]));
          let theaddata: any = [];

          for (let itemGroup of frameLevel4) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              for (let item of itemGroup.Level5) {

                let temp = item.design_control_type;
                item.design_control_type = item.design_control_type_auto_card;
                item.design_control_type_auto_card = temp;

                if (!item.noChange) {
                  if (!item.display_setting_str_auto_card && item.display_setting_str && (item.display_setting_str["dimension"] == 'T' || item.display_setting_str["DIMENSION"] == 'T')) {
                    temp = item.display_setting_str;
                    item.display_setting_str = { ...(item.display_setting_str || {}), dimension: "T" };
                    item.display_setting_str_auto_card = temp;
                  } else {
                    temp = item.display_setting_str;
                    item.display_setting_str = item.display_setting_str_auto_card;
                    item.display_setting_str_auto_card = temp;
                  }
                }

                temp = item.item_visible_flag;
                item.item_visible_flag = item.flag_auto_card;
                item.flag_auto_card = temp;



                item.isAssociate = true;

                item.prompt_name = item.prompt_name && item.prompt_name.includes("*") ? item.prompt_name.replace("*", "") : item.prompt_name;

                if (item.item_type == 'LIST_BOX' && item.item_default_value) {
                  item.temp_default_value = item.item_default_value;
                  item.item_default_value = "";
                }
                item.item_default_value = "";

                item.temp_item_type = item.item_type;


                item.temp_enable_flag = item.item_enable_flag;
                item.item_enable_flag = 'T';
                if (item.item_type != "BT" && item.item_type != "TOGGLE" && item.item_type != "BUTTON_ICON" && item.item_type != "BUTTON" && item.item_type != "FILE_UPLOAD"
                  && item.item_type != "FRAME_BUTTON_ICON" && item.item_type != "RIGHT_CLICK" && item.item_type != "CHECK_BOX" && item.item_type != "RADIO_BUTTON") {
                  item.item_type = "TEXT";
                  item.temp_sub_type = item.item_sub_type;
                  item.item_sub_type = 'TEXT_DISPLAY';

                  item.temp_click_events_str = item.click_events_str
                  item.click_events_str = item.orignal_click_events_str != undefined ? item.orignal_click_events_str : item.click_events_str;

                }

                if (item.item_name && item.item_name.toLowerCase() == itm_slno_name.split("=")[0].split(".")[1].toLowerCase().replace(" ", "") && !item.value) {
                  item.value = itm_slno;
                }

                if (item.value != undefined && item.value != null && item.value !== "") {
                  item.isValid = true;
                }

                // if (item.item_name == 'WMA_RECORD_STATUS') {
                item.frame_status = "dirty";
                // }

                if (item.session_hold_flag == 'T') {
                  if (this.sessionObj) {
                    this.sessionObj[item.item_name] = item.value
                  } else {
                    this.sessionObj = {};
                    this.sessionObj[item.item_name] = item.value
                  }
                }
                if (item.item_visible_flag == 'T') {
                  theaddata.push(item.prompt_name);
                }



                // this.lhs_lib.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + frameId] = "Y";
              }
            }
          }


          //Added Level4 for table head not showing

          if (tempFrame.tableRows) {

            if (frame.indexStr) {
              let indexArr = frame.indexStr.split(";");
              let str = "";
              indexArr = indexArr.filter(x => x)
              for (let i = 0; i < indexArr.length; i++) {
                if (i == 0) {
                  if (indexArr[i] && indexArr[i] <= tempFrame.tableRows.length) {
                    tempFrame.tableRows[indexArr[i]] = frameLevel4;

                  } else {
                    // str = str ? str + ir + ";" : ir + ";";
                    tempFrame.tableRows.push(frameLevel4);
                  }
                } else {
                  if (indexArr[i]) {
                    str = str ? str + indexArr[i] + ";" : indexArr[i] + ";";
                  }
                }
              }
              if (str) {
                frame.indexStr = str;
              } else {
                delete frame['indexStr'];
              }
            } else if (frame.edit_record_index != undefined) {
              tempFrame.tableRows[frame.edit_record_index] = frameLevel4;
              delete frame['edit_record_index'];
            } else {
              tempFrame.tableRows.push(frameLevel4);
            }

            frame.tempRows = tempFrame.tableRows;
            tempFrame.tHead = theaddata;

          } else {
            tempFrame.tableRows = [];
            tempFrame.tableRows[0] = frameLevel4;
            frame.tempRows = tempFrame.tableRows;
            tempFrame.tHead = theaddata;
          }

        }

      } else {

        let data = JSON.parse(JSON.stringify(frame.tableRows[(index ?? 0)]));
        let theaddata: any = [];
        let frameLevel4 = JSON.parse(JSON.stringify(data));
        for (let itemGroup of frameLevel4) {
          if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
            for (let item of itemGroup.Level5) {

              let temp = item.design_control_type;
              item.design_control_type = item.design_control_type_auto_card;
              item.design_control_type_auto_card = temp;
              if (!item.noChange) {
                if (!item.display_setting_str_auto_card && item.display_setting_str && (item.display_setting_str["dimension"] == 'T' || item.display_setting_str["DIMENSION"] == 'T')) {
                  temp = item.display_setting_str;
                  item.display_setting_str = { ...(item.display_setting_str || {}), dimension: "T" };
                  item.display_setting_str_auto_card = temp;
                } else {
                  temp = item.display_setting_str;
                  item.display_setting_str = item.display_setting_str_auto_card;
                  item.display_setting_str_auto_card = temp;
                }

              }

              temp = item.item_visible_flag;
              item.item_visible_flag = item.flag_auto_card;
              item.flag_auto_card = temp;

              item.isAssociate = true;

              item.prompt_name = item.prompt_name && item.prompt_name.includes("*") ? item.prompt_name.replace("*", "") : item.prompt_name;

              if (item.item_type == 'LIST_BOX' && item.item_default_value) {
                item.temp_default_value = item.item_default_value;
                item.item_default_value = "";
              }

              item.item_default_value = "";
              item.temp_item_type = item.item_type;
              item.temp_enable_flag = item.item_enable_flag;
              item.item_enable_flag = 'T';

              if (item.item_type != "BT" && item.item_type != "TOGGLE" && item.item_type != "BUTTON_ICON" && item.item_type != "BUTTON" && item.item_type != "FILE_UPLOAD"
                && item.item_type != "FRAME_BUTTON_ICON" && item.item_type != "RIGHT_CLICK" && item.item_type != "CHECK_BOX" && item.item_type != "RADIO_BUTTON") {
                item.item_type = "TEXT";
                item.temp_sub_type = item.item_sub_type;
                item.item_sub_type = 'TEXT_DISPLAY';
              }

              // if (item.item_name == "SLNO" && !item.value) {
              //   item.value = this.item_slno_count;
              //   this.item_slno_count = this.item_slno_count + 1;
              // }

              if (item.value != undefined && item.value != null && item.value !== "") {
                item.isValid = true;
              }

              // if (item.item_name == 'WMA_RECORD_STATUS') {
              item.frame_status = "dirty";
              // }

              if (item.session_hold_flag == 'T') {
                if (this.sessionObj) {
                  this.sessionObj[item.item_name] = item.value
                } else {
                  this.sessionObj = {};
                  this.sessionObj[item.item_name] = item.value
                }
              }
              if (item.item_visible_flag == 'T') {
                theaddata.push(item.prompt_name);
              }
            }
          }
        }

        //Added Level4 for table head not showing
        // if (!tempFrame.Level4 || tempFrame.Level4.length <= 1) {
        //   tempFrame.Level4 = JSON.parse(JSON.stringify(frameLevel4));
        //   //  tempFrame.headers = JSON.parse(JSON.stringify(frameLevel4));

        //   let level4 = [];
        //   if (frameLevel4 && frameLevel4 > 0) {
        //     level4[0] = JSON.parse(JSON.stringify(frameLevel4))
        //     let sepdata = this.lhs_lib.seprateData(tempFrame, level4)
        //     tempFrame.headers = sepdata[0];
        //   }
        // }
        //Added Level4 for table head not showing

        if (tempFrame.tableRows) {

          if ((frame.edit_record_index || frame.edit_record_index == 0) && (tempFrame.tableRows.length) > frame.edit_record_index) {
            tempFrame.tableRows[frame.edit_record_index] = frameLevel4;
            delete frame['edit_record_index'];
          } else {
            tempFrame.tableRows.push(frameLevel4);
          }

          //  tempFrame.tableRows.push(frameLevel4);
          frame.tempRows = tempFrame.tableRows;
          tempFrame.tHead = theaddata;
        } else {
          tempFrame.tableRows = [];
          tempFrame.tableRows[0] = frameLevel4;
          frame.tempRows = tempFrame.tableRows;
          tempFrame.tHead = theaddata;
        }

      }
      // this.lhs_lib.getSepratorGrp(tempFrame);
      // this.processData.setPromptColTableRows(tempFrame);
      // await this.processData.afterTableRows(tempFrame);
      this.app_clear_frame(fromFrame);
      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
      let frameLevel4 = this.lhs_lib.get_ass_Level4(tempFrame.apps_page_frame_seqid);
      // for (let itemGroup of frameLevel4) {
      //   for (let item of itemGroup.Level5) {

      //     // if (item.item_name == 'WMA_RECORD_STATUS') {
      //     item['frame_status'] = 'dirty';
      //     // }

      //     //  item.item_default_value = "";
      //     let temp = item.design_control_type;
      //     item.design_control_type = item.design_control_type_auto_card;
      //     item.design_control_type_auto_card = temp;

      //     temp = item.display_setting_str;
      //     item.display_setting_str = item.display_setting_str_auto_card;
      //     item.display_setting_str_auto_card = temp;

      //     temp = item.item_visible_flag;
      //     item.item_visible_flag = item.flag_auto_card;
      //     item.flag_auto_card = temp;

      //     if (item.item_type == 'LIST_BOX' && item.item_default_value) {
      //       item.temp_default_value = item.item_default_value;
      //       item.item_default_value = "";
      //     }
      //     item.item_default_value = "";

      //     item.temp_item_type = item.item_type;
      //     item.isAssociate = true;

      //     item.prompt_name = item.prompt_name && item.prompt_name.includes("*") ? item.prompt_name.replace("*", "") : item.prompt_name;

      //     item.temp_enable_flag = item.item_enable_flag;
      //     item.item_enable_flag = 'T';
      //     if (item.item_type != "BT" && item.item_type != "TOGGLE" && item.item_type != "BUTTON_ICON" && item.item_type != "BUTTON" && item.item_type != "FILE_UPLOAD" && item.item_type != "FRAME_BUTTON_ICON") {
      //       item.item_type = "TEXT";
      //       item.temp_sub_type = item.item_sub_type;
      //       item.item_sub_type = 'TEXT_DISPLAY';
      //     }
      //   }
      // }

      //Added Level4 for table head not showing
      if (!tempFrame.Level4 || tempFrame.Level4.length <= 1) {
        tempFrame.Level4 = JSON.parse(JSON.stringify(frameLevel4));

        let level4 = [];
        if (frameLevel4 && frameLevel4.length > 0) {
          level4[0] = JSON.parse(JSON.stringify(frameLevel4))
          let sepdata = this.lhs_lib.seprateData(tempFrame, level4)
          tempFrame.headers = sepdata[0];
        }
        //  tempFrame.headers = JSON.parse(JSON.stringify(frameLevel4));
      }

      // let tFrame = await this.lhs_lib.get_frame_config(frame.apps_page_frame_seqid + 'A');
      if (tempFrame) {
        if (tempFrame.tableData && tempFrame.tableData.length > 0) {
          delete tempFrame['tableData'];
        }
        tempFrame.canvasRows = [];

        if (tempFrame.searchableData) {
          this.processData.filterColumn(tempFrame, true);
        } else {
          this.processData.afterTableRows(tempFrame);
        }

        // this.processData.afterTableRows(tempFrame);
      }




      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
    } else {
      this.app_clear_frame(fromFrame);
    }

    // setTimeout(() => {
    //   if (event.click_events_arr && event.click_events_arr.length > (event.click_events_count + 1)) {
    //     event.click_events_count = event.click_events_count + 1;
    //     this.itemClicked1(event, event.click_event_str);
    //   }
    //   return;
    // }, 1);

  }



  app_edit_record(event, to, from, whereCond?, index?) {

    // let event_str = event.click_events_arr[event.click_events_count];
    // let strss = event_str.split(",");

    let fromFrame = from;
    let toFrame = to;
    let itm_slno_name = whereCond;
    let flag = index == undefined ? true : false;
    let foFrame = this.lhs_lib.get_frame_config(fromFrame);
    let tframe = this.lhs_lib.get_frame_config(toFrame);


    let itemName = tframe.apps_page_frame_seqid + '.WMA_RECORD_STATUS';
    let frameStatus = this.lhs_lib.get_item(itemName, 'current_record');

    let rowIndex = index != undefined ? index : (event.indexcount ?? 0);


    if ((frameStatus && frameStatus.frame_status && (frameStatus.frame_status).toLowerCase() == 'dirty') && tframe && tframe.frame_status.toUpperCase() != 'QUERY') {
      // tframe.active_row = tframe.old_active_row;
      // delete tframe['old_active_row'];
      alert("Please add or clear above record");
    } else {

      // this.remove_extra_record(tempFrame);
      // delete tframe['old_active_row'];

      if (foFrame.tableRows && foFrame.tableRows.length > 0) {
        if (itm_slno_name) {

          let tempRows = [];
          let frameRows = [];
          tframe.indexStr = "";
          // if (foFrame.tableRows) {

          if (itm_slno_name.indexOf("and") > -1) {
            let conArr = [];
            conArr = itm_slno_name.split("and");

            for (let c of conArr) {
              let cArr = c.split("=");
              let val1 = this.lhs_lib.get_item_value(cArr[1], 'current_record', flag);
              cArr[1] = val1 ? "'" + val1 + "'" : "''";
              c = cArr.join("=");
            }
            itm_slno_name = conArr.join("and");
          } else {
            let cArr = itm_slno_name.split("=");
            let val1 = this.lhs_lib.get_item_value(cArr[1], 'current_record', flag);
            cArr[1] = val1 ? "'" + val1 + "'" : "''";
            itm_slno_name = cArr.join("=");
          }


          for (let i = 0; i < foFrame.tableRows.length; i++) {

            let cond;
            if (itm_slno_name.indexOf("and") > -1) {
              let conArr = [];
              conArr = itm_slno_name.split("and");

              for (let c of conArr) {
                let cArr = c.split("=");
                let val0 = this.lhs_lib.get_item_value(cArr[0], i);
                cArr[0] = val0 ? "'" + val0 + "'" : "''";
                cond = cArr.join("==");
              }

              cond = conArr.join(" && ");

            } else {

              let cArr = itm_slno_name.split("=");
              let val0 = this.lhs_lib.get_item_value(cArr[0], i);
              cArr[0] = val0 ? "'" + val0 + "'" : "''";
              cond = cArr.join("==");

            }

            if (eval(cond)) {

              let frameLevel4 = JSON.parse(JSON.stringify(foFrame.tableRows[i]));

              for (let itemGroup of frameLevel4) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    let temp = item.design_control_type_auto_card;
                    item.design_control_type_auto_card = item.design_control_type;
                    item.design_control_type = temp ? temp : item.design_control_type;
                    temp = item.display_setting_str_auto_card;
                    item.display_setting_str_auto_card = item.display_setting_str;
                    item.display_setting_str = temp ? temp : item.display_setting_str;
                    temp = item.flag_auto_card;
                    item.flag_auto_card = item.item_visible_flag;
                    item.item_visible_flag = temp;
                    item.item_type = item.temp_item_type ? item.temp_item_type : item.item_type;
                    item.item_sub_type = item.temp_sub_type ? item.temp_sub_type : item.item_sub_type;

                    item.item_enable_flag = item.temp_enable_flag ? item.temp_enable_flag : item.item_enable_flag;
                    item.data_required_flag = item.temp_required_flag ? item.temp_required_flag : item.data_required_flag;

                    item.click_events_str = item.temp_click_events_str ? item.temp_click_events_str : item.click_events_str;

                    item.isAssociate = false;

                    if ((item.item_type == 'SPECIAL') && (item.value == 'Y' || item.value == '1')) {
                      item.initialVal = true;
                    }

                    if (item.temp_default_value) {
                      item.item_default_value = item.temp_default_value;
                    }
                    item.oldValue = item.value;

                    item.oldValue = item.value;

                  }
                }
              }
              frameRows.push(frameLevel4);
              tframe.indexStr = tframe.indexStr ? tframe.indexStr + (i) + ";" : (i) + ";";
            }
            tempRows.push(foFrame.tableRows[i]);
          }

          foFrame.tableRows = tempRows;


          if (frameRows.length > 0) {
            tframe.tableRows = frameRows;
            tframe.temp_on_load_str = tframe.on_frame_load_str ? tframe.on_frame_load_str : tframe.temp_on_load_str;
            tframe.on_frame_load_str = "";
          } else {
            if (tframe.temp_on_load_str) {
              tframe.on_frame_load_str = tframe.temp_on_load_str;
              tframe.temp_on_load_str = "";
            }
          }

          this.processData.afterTableRows(foFrame);
          this.processData.afterTableRows(tframe);


        } else {
          let frame_status = "";
          let frameLevel44 = JSON.parse(JSON.stringify(foFrame.tableRows[rowIndex]));
          //  foFrame.tableRows.splice(event.itemIndex, 1);
          let col = {};
          for (let itemGroup of frameLevel44) {
            if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
              if (itemGroup.Level5) {
                for (let item of itemGroup.Level5) {
                  if (item.flag_auto_card != "T") {
                    item.item_visible_flag = "F";
                  } else {
                    item.item_visible_flag = "T";
                  }
                  col[item.item_name] = item.value;

                  if (item.item_name == "WMA_RECORD_STATUS") {
                    frame_status = item.frame_status;
                  }
                }
              }
            }
          }

          let tabKeys = Object.keys(col);
          if (tframe.Level4.length > 0) {
            let flag = true;
            let frameLevel44 = [];
            if (tframe.tableRows && tframe.tableRows.length > 0) {
              flag = false;
              frameLevel44 = tframe.tableRows[0];
            } else {
              flag = true;
              frameLevel44 = JSON.parse(JSON.stringify(tframe.Level4));
            }
            //let col = {};
            for (let itemGroup of frameLevel44) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                if (itemGroup.Level5) {
                  for (let item of itemGroup.Level5) {

                    item.noChange = true;
                    item.value = "";
                    delete item['codeOfValues'];
                    delete item['displayChips'];
                    delete item['fromMulti'];
                    for (let c in col) {
                      //console.log(c);
                      if (item.item_name.toLowerCase() == c.toLowerCase()) {
                        item.value = (col[c] != undefined && col[c] != null) ? col[c] : "";
                        item.oldValue = item.value;
                        this.lhs_lib.refreshFrameItems[item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + tframe.apps_page_frame_seqid] = "Y";
                      }
                    }

                    if (item.lov_code && item.value && item.click_events_str && item.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) {
                      item.codeOfValues = item.value.split("^");
                      item.displayChips = item.codeOfValues;
                      item.fromMulti = true;
                    }

                    item.isAssociate = false;
                    // if (item.item_name == 'WMA_RECORD_STATUS') {
                    item.frame_status = "";
                    // }

                    if (item.value != undefined && item.value != null && item.value !== "") {
                      item.isValid = true;
                    } else {
                      item.isValid = false;
                    }

                    if (item.temp_default_value) {
                      item.item_default_value = item.temp_default_value;
                      delete item['temp_default_value'];
                    }

                    if ((item.item_type == 'SPECIAL') && (item.value == 'Y' || item.value == '1')) {
                      item.initialVal = true;
                    }
                    item.click_events_str = item.temp_click_events_str ? item.temp_click_events_str : item.click_events_str;


                  }
                } else {
                  for (let item of itemGroup) {
                    for (let c in col) {
                      if (item.item_name.toLowerCase() == c.toLowerCase()) {
                        item.value = col[c];
                        item.oldValue = item.value;
                      }
                    }

                    // if (item.item_name == 'WMA_RECORD_STATUS') {
                    item.frame_status = "";
                    // }

                    if (item.value != undefined && item.value != null && item.value != "") {
                      item.isValid = true;
                    } else {
                      item.isValid = false;
                    }


                    if (item.temp_default_value) {
                      item.item_default_value = item.temp_default_value;
                      delete item['temp_default_value'];
                    }


                    if ((item.item_type == 'SPECIAL') && (item.value == 'Y' || item.value == '1')) {
                      item.initialVal = true;
                    }
                    item.click_events_str = item.temp_click_events_str ? item.temp_click_events_str : item.click_events_str;
                  }
                }
              }
            }

            if (flag) {
              tframe.tableRows[0] = frameLevel44;
            }

          } else {
            tframe.Level4 = frameLevel44;
            tframe.tableRows[0] = frameLevel44;
          }


          tframe.edit_record_index = rowIndex;

          this.lhs_lib.refreshFrames[tframe.apps_page_frame_seqid] = "Y";
          // tframe.executing_index = tframe.edit_record_index;

          // this.ngZone.run(() => {
          //   this.cdr.detectChanges();
          // })

          // foFrame.tableRows.splice(event.itemIndex, 1);
          // tframe.tempRows = foFrame.tableRows;
        }

      }
      // this.lhs_lib.getSepratorGrp(foFrame);
      // this.processData.setPromptColTableRows(foFrame);
      // this.lhs_lib.getSepratorGrp(tframe);
      // this.processData.setPromptColTableRows(tframe);

      return;

      // if (tframe.apps_frame_type == "CANVAS") {
      //   this.events.publish("refreshContainer" + tframe.apps_page_frame_seqid, { evFlag: "T" });
      // }
    }


  }



  app_delete_record(event, frameName, items?, whereStr?, rownum?) {


    let frame = this.lhs_lib.get_frame_config(frameName);
    let tempFrame = this.lhs_lib.get_frame_config(frame.apps_page_frame_seqid + 'A');

    // if (items) {
    let deletedRows = [];
    let tableRows = [];
    let name = "";
    let tempFlag = false;

    if (rownum && (typeof (rownum) == 'string' && (rownum.toLowerCase() == 'current_record' || rownum.toLowerCase() == 'wma_record_index'))) {
      rownum = this.lhs_lib.get_current_record(rownum, frame);
    }


    if (tempFrame && tempFrame.tableRows && tempFrame.tableRows.length > 0) {

      if (rownum != undefined && frame.edit_record_index == undefined && rownum > tempFrame.tableRows.length - 1) {
        rownum = 0;
        name = frame.apps_page_frame_seqid + ".wma_record_status";
        tempFlag = true;
        tableRows = frame.tableRows ?? [];
      } else {
        rownum = rownum != undefined ? rownum : frame.edit_record_index;
        name = tempFrame.apps_page_frame_seqid + ".wma_record_status";
        tempFlag = true;
        tableRows = frame.tempRows ?? [];
      }
    } else {
      name = frame.apps_page_frame_seqid + ".wma_record_status";
      tableRows = frame.tableRows ?? [];
      rownum = (rownum == undefined || rownum == null) ? 'current_record' : rownum;
    }




    if (frame.deletedRows) {
      deletedRows = frame.deletedRows;
    }

    // if (rownum) { } else {
    //   rownum = 0;
    // }

    if (whereStr) {
      let newTableRows = [];
      let multiConFlag = false;
      // tableRows = JSON.parse(JSON.stringify(tableRows));

      if (whereStr.indexOf(" and ") > -1) {
        let conArr = [];
        conArr = whereStr.split(" and ");
        let condArr = [];
        for (let c of conArr) {

          let cArr = c.split("=");

          // let val0 = this.lhs_lib.get_rows_item(tableRows[i], cArr[0].trim().split(".")[1]);
          let val1 = this.lhs_lib.get_item_value(cArr[1].trim(), 'current_record');

          // cArr[0] = val0 ? (isNaN(val0.value) ? "'" + val0.value + "'" : parseFloat(val0.value)) : "''";
          cArr[1] = val1 ? (isNaN(val1) ? "'" + val1 + "'" : parseFloat(val1)) : "''";
          condArr.push(cArr.join("="));

        }

        whereStr = condArr.join(" and ");
        multiConFlag = true;

      } else {
        let cArr = whereStr.split("=");

        // let val0 = this.lhs_lib.get_rows_item(tableRows[i], cArr[0].split(".")[1]);
        let val1 = this.lhs_lib.get_item_value(cArr[1], 'current_record');

        if (val1 == '') return;
        // cArr[0] = val0 ? (isNaN(val0.value) ? "'" + val0.value + "'" : parseFloat(val0.value)) : "''";
        cArr[1] = val1 ? (isNaN(val1) ? "'" + val1 + "'" : parseFloat(val1)) : "''";
        whereStr = cArr.join("=");
      }

      for (let i = 0; i < tableRows.length; i++) {

        let cond;

        if (whereStr.indexOf(" and ") > -1) {
          let conArr = [];
          conArr = whereStr.split(" and ");
          let condArr = [];
          for (let c of conArr) {
            let cArr = c.split("=");
            let val0 = this.lhs_lib.get_rows_item(tableRows[i], cArr[0].trim().split(".")[1]);

            cArr[0] = val0 ? (isNaN(val0.value) ? "'" + val0.value + "'" : parseFloat(val0.value)) : "''";
            condArr.push(cArr.join("=="));
          }

          cond = condArr.join(" && ");
          multiConFlag = true;

        } else {
          let cArr = whereStr.split("=");
          let val0 = this.lhs_lib.get_rows_item(tableRows[i], cArr[0].split(".")[1]);
          cArr[0] = val0 ? (isNaN(val0.value) ? "'" + val0.value + "'" : parseFloat(val0.value)) : "''";
          cond = cArr.join("==");
        }

        if (eval(cond)) {
          let itemVal = this.lhs_lib.get_rows_item(tableRows[i], 'WMA_RECORD_STATUS');
          if (itemVal && (itemVal.value && itemVal.value.toUpperCase() == 'U')) {
            if (items) {
              let col = {};
              let itemsArr = items.split(",");

              for (let j of itemsArr) {
                let item = this.lhs_lib.get_rows_item(tableRows[i], j);
                if (item) {
                  col[item.item_name] = item.value;
                }
              }

              // let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
              let frameLevel4: any = this.lhs_lib.deepClone(frame.Level4);
              for (let itemGroup of frameLevel4) {
                if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                  for (let item of itemGroup.Level5) {
                    if (col[item.item_name] != undefined) {
                      item.value = col[item.item_name];
                      item.isValid = true;
                    }

                    if (item.item_name.toLowerCase() == 'wma_record_status') {
                      item.value = "D";
                    }
                    item.frame_status = 'dirty';
                  }
                }
              }
              frameLevel4.isDeleted = true;
              //  tableRows[i] = frameLevel4;
              deletedRows.push(frameLevel4);
            } else {
              itemVal.frame_status = 'dirty';
              itemVal.value = 'D';
              tableRows[i].isDeleted = true;
              deletedRows.push(tableRows[i]);
            }
            // delete frame['edit_record_index'];
            // this.processData.afterTableRows(frame);

          } else {
            // delete frame['edit_record_index'];
            // tableRows.splice(i, 1);

            if (!multiConFlag) {
              if (tempFlag) {
                this.app_clear_record(event, tempFrame, i, true);
              } else {
                // this.app_clear_record(event, frame, i, true);
              }
            }

          }
        } else {
          newTableRows.push(tableRows[i]);
        }
      }

      // tableRows = this.lhs_lib.setItemCount(newTableRows);
      tableRows = newTableRows;
      delete frame['tableData'];


      if (tempFrame && tempFrame.tableRows && tempFrame.tableRows.length > 0) {
        tempFrame.tableRows = tableRows;
        frame.tempRows = tableRows;
        this.processData.afterTableRows(frame);
        this.processData.afterTableRows(tempFrame);
      } else {

        frame.tableRows = tableRows;
        this.processData.afterTableRows(frame);
      }
      frame.deletedRows = deletedRows;
    } else {
      if (rownum != undefined) {
        let itemVal = this.lhs_lib.get_item(name, rownum);
        if (itemVal && (itemVal.value && itemVal.value.toUpperCase() == 'U')) {
          if (items) {
            let col = {};
            let itemsArr = items.split(",");

            for (let j of itemsArr) {
              let item = this.lhs_lib.get_rows_item(tableRows[rownum], j);
              if (item) {
                col[item.item_name] = item.value;
              }
            }

            let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));
            for (let itemGroup of frameLevel4) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0) {
                for (let item of itemGroup.Level5) {
                  if (col[item.item_name] != undefined) {
                    item.value = col[item.item_name];
                    item.isValid = true;
                  }

                  if (item.item_name.toLowerCase() == 'wma_record_status') {
                    item.value = "D";
                  }
                  item.frame_status = 'dirty';
                }
              }
            }
            frameLevel4.isDeleted = true;
            // tableRows[rownum] = frameLevel4;
            deletedRows.push(frameLevel4);
            tableRows.splice(rownum, 1);
          } else {
            itemVal.frame_status = 'dirty';
            itemVal.value = 'D';
            tableRows[rownum].isDeleted = true;
            deletedRows.push(tableRows[rownum]);
            tableRows.splice(rownum, 1);
          }
          delete frame['edit_record_index'];



          // tableRows = this.lhs_lib.setItemCount(tableRows);

          // this.lhs_lib.setItemCount(tableRows);

          if (tempFlag) {
            if (frame.edit_record_index == undefined || frame.edit_record_index == rownum) {
              this.app_clear_frame(frame.apps_page_frame_seqid);
            }
            frame.tempRows = tableRows;
            tempFrame.tableRows = frame.tempRows;

            if (tempFrame.searchableData || tempFrame.searchableRawData) {
              delete tempFrame['searchableData'];
              delete tempFrame['searchableRawData'];
              this.processData.filterColumn(tempFrame);
            }
          }

          frame.deletedRows = deletedRows;

          if (frame.searchableData || frame.searchableRawData) {
            delete frame['searchableData'];
            delete frame['searchableRawData'];
            this.processData.filterColumn(frame);
          }
          this.processData.afterTableRows(frame);

        } else {
          // delete frame['edit_record_index'];
          // tableRows.splice(rownum, 1);

          if (tempFlag) {
            if (frame.edit_record_index == undefined || frame.edit_record_index == rownum) {
              this.app_clear_frame(frame.apps_page_frame_seqid);
            }
            this.app_clear_record(event, tempFrame, rownum);
            frame.tempRows = tempFrame.tableRows;
          } else {
            this.app_clear_record(event, frame, rownum, null, true);
          }
        }
      }


      delete frame['executing_index'];
      if (frame.tableData && frame.tableData.length > 0) {
        delete frame['tableData'];
      }

      let tFrame = this.lhs_lib.get_frame_config(frame.apps_page_frame_seqid + 'A');
      if (tFrame) {
        if (tFrame.tableData && tFrame.tableData.length > 0) {
          delete tFrame['tableData'];
        }
        tFrame.canvasRows = [];
        this.processData.afterTableRows(tFrame);
      }

    }
  }



  app_clear_record(event, frame?, index?, dont_refresh_rows?, set_cd_key?) {

    let indexCnt;
    if (frame) {

      if (typeof (frame) == 'string') {
        frame = this.lhs_lib.get_frame_config(frame);
      }

      let ind = index && typeof (index) == 'string' && (index.toLowerCase().includes("current_record") || index.toLowerCase().includes("wma_record_index")) ? frame.active_row : index != undefined ? index : event.itemIndex;

      if (frame.tableRows.length > 1) {
        // let itm = this.lhs_lib.get_rows_item(frame.tableRows[ind], 'WMA_RECORD_STATUS');

        // indexCnt = itm?.indexcount;
        frame.tableRows.splice(ind, 1);
        let x = 0;


        for (let i = 0; i < frame.tableRows.length; i++) {
          let item = this.lhs_lib.get_rows_item(frame.tableRows[i], 'WMA_RECORD_STATUS');
          if (item && item.extra_record) {
            x++;
          }
        }

        if (x == frame.tableRows.length) {
          let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));

          if (this.sessionObj) {
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                if (item.session_hold_flag == 'T') {
                  item.value = this.sessionObj[item.item_name];
                }
              }
            }
          }
          frame.tableRows[0] = frameLevel4;
        }

      } else {

        if (frame.apps_page_frame_seqid.slice(-1) != "A") {
          delete frame['indexStr'];
          delete frame['edit_record_index'];
          let frameLevel4 = JSON.parse(JSON.stringify(frame.Level4));

          if (this.sessionObj) {
            for (let itemGroup of frameLevel4) {
              for (let item of itemGroup.Level5) {
                if (item.session_hold_flag == 'T') {
                  item.value = this.sessionObj[item.item_name];
                }
              }
            }
          }
          frame.tableRows[0] = frameLevel4;
          // this.processData.afterTableRows(frame);
        } else {
          delete frame['indexStr'];
          delete frame['edit_record_index'];
          delete frame['tableRows'];
          delete frame['canvasRows'];
        }
      }

      if (frame.new_record_index != undefined) {
        if (frame.new_record_index == ind) {
          delete frame['new_record_index'];
        } else {
          if (frame.new_record_index > frame.tableRows.length) {
            delete frame['new_record_index'];
          } else {
            frame.new_record_index = frame.new_record_index - 1;
          }
        }
      }
    }

    if (frame.tableData && frame.tableData.length > 0) {
      delete frame['tableData'];
    }

    if (set_cd_key) {
      const deletedRownum = event.indexcount;
      const frameSeqid = event.apps_page_frame_seqid;
      // setTimeout(() => {
      this.cdEngine.shiftKeysAfterDelete(frameSeqid, deletedRownum);
      // }, 100);
    }


    if (!dont_refresh_rows) {
      // this.lhs_lib.getSepratorGrp(frame);
      this.processData.afterTableRows(frame);
    }

    return indexCnt;
  }



  downloadObj() {
    let json = this.generateJtypeData();
    //console.log(json)

    let pouchObjectKey = this.object_mast.object_code;
    this.object_mast._id = pouchObjectKey;
    //this.object_mast._rev = "";
    var temp: any = {};
    var id = pouchObjectKey;

    id = "local#" + id + '~' + this.object_mast.Level2[this.page_no].origin_apps_item_seqid + "#" + new Date();
    let objMast = JSON.parse(JSON.stringify(this.object_mast));

    objMast.Level2 = json;
    temp = {
      id: id,
      _id: id,
      objData: JSON.stringify(objMast),
      lastUpdate: new Date()
    }

    this.sqlLiteServ.postLocalobj(temp, 'local_saved_object').then(res => {
      alert("Object Saved");
    }).catch((err) => {
      alert(err);
    })
  }

  async openSinglealert(message, eventStr, event) {

    let popUp = await this.popOverCtrl.create({
      component: AlertMsgBoxesPage,
      id: "msgPopover",
      backdropDismiss: false,
      componentProps: {
        alertMessage: message,
        type: "info"
      },
    });
    await popUp.present();

    await popUp.onDidDismiss().then(res => {

      let mwType = false;
      let reExecute = false;
      if (res.data.statusType == "MS") {

        let data = res.data.value;

        if (data.item_name) { } else {
          data.item_name = event.item_name;
          data.frame_name = data.frame_name ? data.frame_name : event.apps_page_frame_seqid;
        }

        let itemCon = this.lhs_lib.get_item(data.item_name, 0);
        if (itemCon) {
          itemCon.oldValue = "";
        }

      } else if (res.data.statusType == "MWY") {
        mwType = true;
        if (res.data.status == "Y") {
          reExecute = true;
        } else {
          reExecute = false;
          this.clearQue();
        }
      } else if (res.data.statusType == "MWN") {
        mwType = true;
        if (res.data.status == "N") {
          reExecute = false;
          this.clearQue();
        } else {
          reExecute = true;
        }
      }

      if (mwType) {

        this.lhs_lib.set_item_value(event, message.para_name, 0, res.data.status);

        // this.globalobjects.setFocus(true);
        let name = event.apps_page_frame_seqid + "." + event.item_name;
        let index = event.indexcount;

        if (event.returnId) {
          name = event.returnId;
          index = event.returnIndex;
          delete event['returnId'];
          delete event['returnIndex'];
        }
        // if (this.globalobjects.focusedItem) {
        //   this.lhs_lib.go_item(this.globalobjects.focusedItem.name, this.globalobjects.focusedItem.index != undefined ? this.globalobjects.focusedItem.index : index, true);
        //   this.globalobjects.focusedItem = '';
        // }
        if (reExecute) {
          // this.itemClicked1(event, "");
          this.itemClicked_new(event, null, null, null, true);
        }
      }
    })
  }

  async openMultialert(message, eventStr, event) {
    let popUp = await this.popOverCtrl.create({
      component: MultiAlertNotificationPage,
      id: "msgPopover",
      backdropDismiss: false,
      componentProps: {
        alertMessage: message,
        type: "info"
      },
    });
    await popUp.present();

    await popUp.onDidDismiss().then(res => {
      if (res.data && res.data.statusType == "MMS") {
        let data = res.data.value;
        if (data.item_name) { } else {
          data.item_name = event.item_name;
        }
        let itemCon = this.lhs_lib.get_item(data.item_name, data.row_slno);
        if (itemCon.oldValue) {
          itemCon.oldValue = "";
        }
      }
    })
  }

  go_to_error_item(data, event) {

    let item = this.lhs_lib.get_item(data.item_name, 0);
    let name = event.apps_page_frame_seqid ? `${event.apps_page_frame_seqid}.${event.item_name}` : event.item_name;
    let errorItem = this.lhs_lib.get_item(name, event.indexcount);
    if (errorItem && data && data.para_value) {
      errorItem.msgError = data.para_value;
      errorItem.forcedInvalid = true;
      errorItem.isValid = false;
      delete errorItem['oldValue'];
    }

    if (data.apps_page_frame_seqid) {
      data.frame_name = data.apps_page_frame_seqid;
    }

    let flag = false;
    if (item && item.item_type != 'BUTTON' && item.item_type != 'FRAME_BUTTON_ICON' && item.item_type != 'BUTTON_ICON') {
      if (item.apps_page_no < this.page_no + 1) {
        flag = true;
        let obj = {
          errorData: data,
          itmData: item
        }
        this.modalCtrl.dismiss(obj);
      }
    }

    if (!flag) {
      // this.globalobjects.setFocus(true);
      let itName = name;
      let index = event.indexcount;
      if (event.returnId) {
        itName = event.returnId;
        index = event.returnIndex;
        delete event['returnId'];
        delete event['returnIndex'];
      }
      this.lhs_lib.go_item(itName, index, true);
    }


  }

  async validate_lov(event) {

    return new Promise((resolve, reject) => {

      let wscp = this.wscp;
      wscp.lov_code = event.lov_code;
      event.touched = true;
      let rowindex;

      let wsdp = [];
      let wsdpcl = [];
      let col = {};
      if (event.indexcount) {
        rowindex = event.indexcount;
      } else {
        rowindex = 0;
      }

      if (event.calling_frame_seqid_str) {
        wsdp = this.lhs_lib.getDp(event.calling_frame_seqid_str, null, true);
        wsdpcl = this.lhs_lib.getDpcl(event.calling_frame_seqid_str, null, true);
      } else {
        wsdpcl = this.lhs_lib.getDpcl(event.calling_frame_seqid_str, null, true);
      }

      wscp.service_type = "validate_lov";
      wscp.apps_page_no = event.apps_page_no;
      wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      wscp.apps_item_seqid = event.apps_item_seqid;
      wscp.object_code = event.object_code;

      wscp = JSON.parse(JSON.stringify(wscp));

      if (event.assigned_value && (event.assigned_value == event.value && event.assigned_value != event.oldValue)) {
        wscp.validate_assigned = 'T';
      }

      wscp = this.generate_wscp(event, wscp);

      // this.globalobjects.userDetails["object_code"] = event.object_code;
      let reqData: any = {};
      reqData = {
        "wslp": this.globalobjects.userDetails,
        "wscp": wscp,
        "wsdp": wsdp,
        "wsdpcl": wsdpcl
      }

      // this.globalobjects.ShowLoadingNew(event);

      let index = event.itemIndex ? event.itemIndex : (event.indexCount ? event.indexCount : event.indexcount);
      let itm = this.lhs_lib.get_item(event.apps_page_frame_seqid + "." + event.item_name, index);
      if (itm) {
        itm.requestData = reqData;
      }

      // reqData.wscp.ref_cursor_mode = this.globalobjects.refCursorMode ? 'T' : 'F';
      this.dataService.postData("S2U", reqData).then(res => {

        // this.globalobjects.hideLoadingNew();
        // this.globalobjects.setFocus(false);
        let data: any = res;
        //console.log("data in lovpage", res);

        let flag = true;
        delete event['objLovData'];
        delete event['assigned_value'];
        if (data.responseStatus && data.responseStatus.includes("success")) {

          try {
            if (data.responseMsg && data.responseMsg.toUpperCase().includes("Q#")) {
              alert(data.responseMsg);

              if (!data.responseData) {
                this.clearQue();
              }
            }

            let objectList = [];

            if (data.responseStatus.toLowerCase().includes("-rc")) {
              let { tableData, p_head } = this.lhs_lib.generateDataForLov(event, data);
              objectList = tableData;
            } else {
              let objData = this.globalobjects.setPageInfo(data.responseData);
              objectList = objData.Level1;
            }

            //console.log(objectList);


            if (data.responseHead && data.responseHead.length > 0) {
              this.generatAllFrameJson(data.responseHead, event, true);
            }

            if (objectList && objectList.length > 0) {

              let objKey = Object.keys(objectList[0]);
              if (event.value && ((objectList[0][objKey[0]] && objectList[0][objKey[0]].toLowerCase().includes(event.value.toLowerCase())) ||
                objectList[0][objKey[1]] && objectList[0][objKey[1]].toLowerCase().includes(event.value.toLowerCase()))) {
                let datArr = [];
                for (let key of objKey) {
                  let orKey = key.split("#")[0].split("~")[1];
                  let obj: any = {};
                  obj.key = orKey;
                  obj.value = objectList[0][key]
                  datArr.push(obj);
                }

                event.objLovData = datArr;
                if (objectList.length < 2) {
                  flag = false;
                  event.codeOfValues = objectList[0][objKey[1]];
                  event.value = objectList[0][objKey[0]];
                  event.item = objectList[0];

                  event.DcodeOfValues = objectList[0][objKey[1]];
                  event.Dvalue = objectList[0][objKey[0]];
                  event.Ditems = objectList[0];

                  let itName = event.apps_page_frame_seqid + "." + event.item_name;
                  let index = event.itemIndex;
                  if (event.returnId) {
                    itName = event.returnId;
                    index = event.returnIndex;
                    delete event['returnId'];
                    delete event['returnIndex'];
                  }
                  // if (this.globalobjects.focusedItem) {
                  //   this.lhs_lib.go_item(this.globalobjects.focusedItem.name, this.globalobjects.focusedItem.index != undefined ? this.globalobjects.focusedItem.index : index, true);
                  //   this.globalobjects.focusedItem = '';
                  // }
                  // else {
                  //   this.focusNextItem(itName, index);
                  // }
                  this.onChange(event);

                  // return;
                }
              }
              if (flag) {
                event.objectList = objectList;
              }
            }

          } catch (error) {
            console.log(error);
            alert(error);

            this.clearQue();
          }
        } else {
          alert(data.responseMsg);
        }


        if (flag) {

          let itName = event.apps_page_frame_seqid + "." + event.item_name;
          let index = event.itemIndex;

          let itm = this.lhs_lib.get_item(itName, index);
          if (itm) {
            itm.oldValue = "";
          }
          event.oldValue = "";
          event.validateFlag = true;
          this.open_lov(event, "").then(res => {
            resolve(res);
          });
        } else {
          resolve('data');
        }

        //   } else {
        //     event.validateFlag = true;
        //     this.open_lov(event, "");
        //   }
        // } else {
        //   event.validateFlag = true;
        //   this.open_lov(event, "");
        // }
      }).catch(err => {
        // this.globalobjects.setFocus(true);
        if (event.returnId) {
          let name = event.returnId;
          let index = event.itemIndex;
          // delete event['returnId'];
          // delete event['returnIndex'];
          // if (this.globalobjects.focusedItem) {
          //   this.lhs_lib.go_item(this.globalobjects.focusedItem.name, this.globalobjects.focusedItem.index != undefined ? this.globalobjects.focusedItem.index : index, true);
          //   this.globalobjects.focusedItem = '';
          // }
          //  else {
          //   this.focusNextItem(name, index);
          // }
        }

        reject();
        this.globalobjects.hideLoadingNew();
      })

      delete wscp['lov_code'];


    })

  }


  async validate_lov_all(item): Promise<any> {



    let wscp: any = {};
    wscp = JSON.parse(JSON.stringify(this.wscp));

    wscp.service_type = "validate_lov_all";
    wscp.validate_lov_str = item.validate_lov_str ? item.validate_lov_str : '';
    wscp.apps_item_seqid = item.apps_item_seqid ? item.apps_item_seqid : (this.wscp.apps_item_seqid ? this.wscp.apps_item_seqid : "");
    wscp.apps_page_frame_seqid = item.apps_page_frame_seqid ? item.apps_page_frame_seqid : "";
    wscp.apps_working_mode = item.apps_working_mode ? item.apps_working_mode : "";
    wscp.item_sub_type = item.item_sub_type ? item.item_sub_type : "";
    // wscp.orignal_apps_item_seqid = item.apps_item_seqid;
    // wscp.origin_apps_item_seqid = item.apps_page_frame_seqid;
    // this.wscp = wscp;

    // let dataRes = this.lhs_lib.getWsdp("");
    let wsdp = [];
    let wsdpcl = [];

    if (item.calling_frame_seqid_str) {
      wsdp = this.lhs_lib.getDp(item.calling_frame_seqid_str, null, true);
      wsdpcl = this.lhs_lib.getDpcl(item.calling_frame_seqid_str, null, true);
    } else {
      wsdpcl = this.lhs_lib.getDpcl(item.calling_frame_seqid_str, null, true);
    }

    // if(this.wsdpcl && this.wsdpcl.length > 0){
    //   for(let w of this.wsdpcl){
    //     let find = wsdpcl.find(x => JSON.stringify(x) == JSON.stringify(w));
    //     if(!find){
    //       wsdpcl.push(w);
    //     }
    //   }
    //   this.wsdpcl && this.wsdpcl.length > 0 ? this.wsdpcl : dataRes.wsdpcl;
    // } 

    var reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": wsdpcl
    }

    let l_url = "S2U";
    let tableData: any;



    // reqData.wscp.ref_cursor_mode = this.globalobjects.refCursorMode ? 'T' : 'F';
    await this.dataService.postData(l_url, reqData).then(async (res) => {

      let data: any = res;

      if (data.responseStatus && data.responseStatus.includes("success")) {

        if (Array.isArray(data.responseData) && !data.responseHead) {
          let resData = [];
          let rD = data.responseData;
          for (let a of rD) {
            let objData = this.globalobjects.setPageInfo(a);
            for (let c of objData.Level1) {
              resData.push(c);
            }
          }
          this.generatAllFrameJson(resData, item, true);
          return;
        } else {
          if ((data.responseData.Level1_Keys && data.responseData.Level1_Keys.length > 0) || (Array.isArray(data.responseData) && data.responseData.length > 0)) {
            let objData: any = {};
            if (data.responseStatus.toLowerCase().includes("-rc")) {

              objData.Level1 = this.globalobjects.setPageInfoNoS2U(data.responseData);

            } else {
              objData = this.globalobjects.setPageInfo(data.responseData);

              let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
              let wsSewId = id ? data.responseData.Values[0][id] : "";

              if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
                this.globalobjects.presentAlert(objData.Level1[0].message);
              }
            }

            if (data.responseHead && data.responseHead.length > 0) {
              this.generatAllFrameJson(data.responseHead, item, true);
            }

            if ((objData.Level1 && objData.Level1.length > 0 && objData.Level1[0]['status'] == 'J')) {
              // this.ngZone.run(() => {
              //   this.cdr.detectChanges();
              // })
              await this.generatAllFrameJson(objData.Level1, item);
              return;
            }

          } else {
            return;
          }
        }
      } else {
        alert(data.responseMsg);
      }

      // return;
    }).catch(err => {
      // this.globalobjects.setFocus(true);
      // if (this.globalobjects.focusedItem) {

      //   this.lhs_lib.go_item(this.globalobjects.focusedItem.name, this.globalobjects.focusedItem.index != undefined ? this.globalobjects.focusedItem.index : item.itemIndex, true);
      //   this.globalobjects.focusedItem = '';
      // }
      return;
    })

  }

  async open_lov(event, str?) {

    return new Promise((resolve, reject) => {
      if (str) {
        let itm = this.lhs_lib.get_item(str, event.itemIndex);
        itm.lType = "S";
        delete itm['head'];
        delete itm['without_data'];
        this.openLov(itm).then((res) => {
          resolve('data');
        });
      } else {
        event.lType = "S";
        delete event['head'];
        delete event['without_data'];
        this.openLov(event).then((res) => {
          resolve('data');
        });
      }
    })
  }

  async open_lov_wd(event, str?) {
    return new Promise((resolve, reject) => {
      if (str) {
        let itm = this.lhs_lib.get_item(str, event.itemIndex);
        itm.lType = "S";
        itm.without_data = true;
        delete itm['head'];
        this.openLov(itm).then((res) => {
          resolve('data');
        });
      } else {
        event.lType = "S";
        event.without_data = true;
        delete event['head'];
        this.openLov(event).then((res) => {
          resolve('data');
        });
      }
    })
  }

  async open_multi_lov(event, str?) {
    return new Promise((resolve, reject) => {
      if (str) {
        let itm = this.lhs_lib.get_item(str, event.itemIndex);
        itm.lType = "M";
        this.openLov(itm).then((res) => {
          resolve('data');
        });
      } else {
        event.lType = "M";
        this.openLov(event).then((res) => {
          resolve('data');
        });
      }
    })
  }

  async openLov(event) {

    if (event.lovOpen) { return; }


    return new Promise((resolve, reject) => {
      let type = event.lType ? event.lType : "S";
      this.wscp.lov_code = event.lov_code;
      // this.wscp.single_frame_wsdp = true;
      let wscp = JSON.parse(JSON.stringify(this.wscp))
      if (event.engineLovType != undefined) {
        wscp.g_engine_lov_type = event.engineLovType
        delete event['engineLovType']
      }
      event.lovOpen = true;
      event.touched = true;
      let rowindex;
      let lovEvent;
      if (type == "M") {
        lovEvent = JSON.parse(JSON.stringify(event));
        lovEvent.item_sub_type = "M";
      } else {
        lovEvent = event;
      }

      let wsdp = [];
      let wsdpcl = [];
      let col = {};
      if (event.indexcount) {
        rowindex = event.indexcount;
      } else {
        rowindex = 0;
      }

      if (event.calling_frame_seqid_str) {
        wsdp = this.lhs_lib.getDp(event.calling_frame_seqid_str, null, true);
        wsdpcl = this.lhs_lib.getDpcl(event.calling_frame_seqid_str, null, true);
      } else {
        wsdpcl = this.lhs_lib.getDpcl(event.calling_frame_seqid_str, null, true);
      }

      // this.lovEventFlag = false;
      event.lovEventFlag = true;
      if (event.lov_type == "LP") {

      } else {

        let id = 'sigleMultiLov';
        let cssClass = 'offcanvas-end';
        let title = ""
        let componentProps = { paramValue: lovEvent, wsdp: wsdp, wsdpcl: wsdpcl, prompt_name: event.prompt_name, wscp: wscp }
        this.globalobjects.breadCrumpsArray.push(event);
        this.canvasModal.openLov(SingleSelectLovPage, componentProps, id, cssClass, title).then((detail) => {
          delete this.wscp['lov_code'];
          delete event['lovOpen'];
          this.lovEventFlag = true;
          this.globalobjects.breadCrumpsArray.pop();
          event.show = true;
          event.touched = true
          if (detail) {
            if (detail.data) {
              if (!event.lov_return_column_str) {
                event.codeOfValues = detail.data.codeOfValues;
                event.value = detail.data.value;


                if (event.validateFlag) {

                  let itName = event.apps_page_frame_seqid + "." + event.item_name;
                  let index = event.indexcount;

                  let itm = this.lhs_lib.get_item(itName, index);
                  if (itm) {
                    itm.oldValue = event.value;
                  }
                  event.oldValue = event.value;
                  event.validateFlag = false;
                }
              }
              event.item = detail.data.item;
              event.objLovData = detail.data.data;
              event.DcodeOfValues = detail.data.codeOfValues;
              event.Dvalue = detail.data.value;
              event.Ditems = detail.data.Ditems;

              if (event.click_events_str && event.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) {
                event.fromMulti = true;
                event.isValid = true;
                event.chips = detail.data.value;
                event.displayChips = detail.data.value;
                event.tempCodeOfValues = event.codeOfValues;
                event.value = "";
                event.codeOfValues = "";
                for (let item of detail.data.codeOfValues) {
                  event.codeOfValues = event.codeOfValues ? (event.codeOfValues + "," + item) : item;
                }
              }
            } else {
              if (event.value) {
              } else {
                event.codeOfValues = "";
                event.value = "";
                event.oldValue = "";
              }
              this.clearQue()
            }


            // commented code is to execute post event directly

            // if (detail.data) {

            //   this.lhs_lib.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.itemIndex, true);

            //   // let el = this.lhs_lib.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.itemIndex, true,true);
            //   // this.go_next_item(el);
            //   this.onChange(event);

            // } else {
            //   this.clearQue();
            //   this.lhs_lib.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.indexcount, true);
            //   // let el = this.lhs_lib.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.indexcount, true,true);
            //   // this.go_next_item(el);
            // }

            // comment end


            if (detail.data || event.itemClicked != 'post') {
              if (event.click_events_str && event.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) {
                event.click_events_count = -1;
                event.click_events_arr = event.post_events_str ? event.post_events_str.split(";") : [];
                this.onChange(event);

              } else {
                try {
                  this.globalobjects.focusedItem = {}
                  this.globalobjects.focusedItem.name = event.apps_page_frame_seqid + "." + event.item_name;
                  this.globalobjects.focusedItem.index = event.indexcount;
                  // this.lhs_lib.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.indexcount, true);
                  this.onChange(event);
                } catch (err) {
                  this.onChange(event);
                }
              }
            } else {
              this.clearQue();
              this.globalobjects.focusedItem = {}
              this.globalobjects.focusedItem.name = event.apps_page_frame_seqid + "." + event.item_name;
              this.globalobjects.focusedItem.index = event.indexcount;
              // this.lhs_lib.go_item(event.apps_page_frame_seqid + "." + event.item_name, event.indexcount, true);
            }
          }

          if (event.displayReportEngineFlag != undefined) {
            event.displayReportEngineFlag = true;
          }


          resolve('data');

        })
      }

    })
  }


  go_next_item(el) {
    var nextEl = this.findNextTabStop(el);
    nextEl.focus();
  }

  findNextTabStop(el) {
    var universe = document.querySelectorAll(
      "input,select,ion-button"
    );
    var list = Array.prototype.filter.call(universe, (item) => {
      return item.tabIndex >= "0";
    });
    var index = list.indexOf(el);
    index++;
    while (index < list.length) {
      if (!list[index].readOnly) {
        return list[index];
      } else {
        index++;
      }
    }
    return list[0];
  }


  onChange(event) {
    // this.globalobjects.setFocus(true);

    if (event.msgError) {
      event.msgError = "";
    }


    let itemFlag = [];
    let reqFlag = [];
    let enFlag = [];
    for (let l in event.item) {
      let coldata;
      if (l.indexOf("#") > -1) {
        coldata = l.split("#")[0];
      } else {
        coldata = l;
      }
      if (coldata.toLowerCase().split("~")[1] == 'item_visible_flag') {
        if (event.item[l]) {
          let item = event.item[l].split('~');
          for (let a of item) {
            let flag = a.split('=');
            let obj = {
              key: flag[0],
              value: flag[1]
            }
            itemFlag.push(obj);
          }
        }
      }
      if (coldata.toLowerCase().split("~")[1] == 'data_required_flag') {
        if (event.item[l]) {
          let item = event.item[l].split('~');
          for (let a of item) {
            let flag = a.split('=');
            let obj = {
              key: flag[0],
              value: flag[1]
            }
            reqFlag.push(obj);
          }
        }
      }
      if (coldata.toLowerCase().split("~")[1] == 'item_enable_flag') {
        if (event.item[l]) {
          let item = event.item[l].split('~');
          for (let a of item) {
            let flag = a.split('=');
            let obj = {
              key: flag[0],
              value: flag[1]
            }
            enFlag.push(obj);
          }
        }
      }
    }
    if (event.lov_return_column_str) {
      this.lhs_lib.setReturnData(event);
    } else {
      if (itemFlag.length > 0 || reqFlag.length > 0 || enFlag.length > 0) {
        for (let f of itemFlag) {
          this.lhs_lib.set_item_config(f.key.toUpperCase(), 'item_visible_flag', f.value, null);
        }
        for (let f of reqFlag) {
          this.lhs_lib.set_item_config(f.key.toUpperCase(), 'data_required_flag', f.value, null);
        }

        for (let f of enFlag) {
          this.lhs_lib.set_item_config(f.key.toUpperCase(), 'item_enable_flag', f.value, null);
        }
      }
    }

    event.lovValue = event.value;


    // commented code is for direct lov post event run

    // event.oldValue = event.value;
    // if (event.click_events_arr && event.click_events_arr.length > (event.click_events_count + 1)) {
    //   let itemName = event.apps_page_frame_seqid + "." + event.item_name;

    //   let str = `app_execute_item('${itemName}' ,'post_events_str',${event.indexcount},"true")`;
    //   event.click_events_arr = event.click_events_arr.filter(a => a !== undefined && a !== "");
    //   event.click_events_arr.push(str);
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, event.click_event_str);

    // } else {

    //   let postEv = JSON.parse(JSON.stringify(event));
    //   postEv.itemClicked = 'post'
    //   this.itemClicked(postEv);

    // }

    if (event.click_events_str && event.click_events_str.toLowerCase().indexOf('open_multi_lov') > -1) {
      if (event.post_events_str) {
        let postEv = JSON.parse(JSON.stringify(event));
        postEv.itemClicked = 'post'
        this.itemClicked(postEv);
      }
    }

    /// comment end

    if (event.mirrored_items) {
      this.lhs_lib.set_mirror_values(event);
    }

    // this.cdEngine.detect(event.apps_item_seqid + '_' + event.indexcount + '#' + event.apps_page_frame_seqid);
    this.lhs_lib.refreshFrameItems[event.apps_item_seqid + '_' + (event.indexcount ?? 0) + '#' + event.apps_page_frame_seqid] = "Y";
    // }
  }


  resizeFrame(frame) {
    if (!frame.resize) {
      if (frame.design_control_type && parseInt(frame.design_control_type) < 12) {
        frame.temp_design_control_type = frame.design_control_type;
        frame.design_control_type = 12;
        frame.resize = true;
      }
    } else {
      frame.design_control_type = frame.temp_design_control_type;
      frame.resize = false;
    }

  }

  async alertpop(nun) {
    let obj = {
      popoverPopup: nun
    }
    const popover = await this.popOverCtrl.create({
      component: AlertMsgBoxesPage,
      cssClass: 'my-custom-class',
      componentProps: obj,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  async dismissClick() {
    await this.popOverCtrl.dismiss();
  }


  async openHomePop(event) {

    let pouchObjectKey = this.object_mast.object_code;
    this.object_mast._id = pouchObjectKey;
    var temp: any = {};
    var id = pouchObjectKey;

    id = "local#" + id + '~' + this.object_mast.Level2[this.page_no].origin_apps_item_seqid + "#";


    let popUp = await this.popOverCtrl.create({
      component: DownloadPopoverComponent,
      componentProps: { local_id: id },
      id: "home-btn-pop",
      event: event,
      backdropDismiss: true
    });
    popUp.present()

    popUp.onDidDismiss().then((details: OverlayEventDetail) => {

      if (details.role == "upload") {
        let data = JSON.parse(details.data);
        if (data) {
          this.uploadDownloadData(data.Level2);
        }
      }

    })
  }

  uploadDownloadData(data) {
    for (let frameData of data) {
      let frame = this.lhs_lib.get_frame_config(frameData.apps_page_frame_seqid);
      if (frame.apps_frame_sub_type && (frame.apps_frame_sub_type.toUpperCase() == 'SINGLE_ROW' || frame.apps_frame_sub_type.toUpperCase() == 'SINGLE_ROW_BLANK' || frame.no_of_records == '1')) {
        this.processData.single_row(frame, frameData.tableData, frame.auto_populate_default_where);
      } else {
        this.processData.populateRows(frame.apps_page_frame_seqid, frameData.tableData);
      }
    }
  }



  clickFun(fontSuk) {
    var r = document.querySelector(':root');
    let rs = getComputedStyle(r);
    document.documentElement.style.setProperty('--minFontSize', fontSuk + 'px')
  }
  triggerClickEvent() {
    const event: any = new Event('click'); // Create a new 'click' event
    event.isBreadCrump = true
    // myDiv.dispatchEvent(event); // Dispatch the event on 'myDiv'
    // for (let [index, tabTag] of this.lhs_lib.myTab.entries()) {
    //   if (!tabTag.childNodes[0].hasAttribute("hidden")) {
    //     for (let dt of this.lhs_lib.adata) {
    //       if (index == dt.index) {
    //         tabTag.childNodes[0].lastElementChild.dispatchEvent(event)
    //       }
    //     }
    //   }
    // }
    let myTab: any = document.querySelectorAll('app-my-tab')
    for (let [index, tabTag] of myTab.entries()) {
      if (!tabTag.childNodes[0].hasAttribute("hidden")) {
        for (let dt of this.lhs_lib.adata) {
          if (index == dt.index) {
            tabTag.childNodes[0].lastElementChild.dispatchEvent(event)
          }
        }
      }
    }
  }
  offCanvasClick() {
    const canvas: any = document.querySelectorAll("#deskcardCanvas")
    const event: any = new Event('click');
    let dispatchCanvas = canvas[canvas.length - 1]
    event.isOffcanvasClose = true
    dispatchCanvas.dispatchEvent(event)
  }
  modalClick() {
    const canvas = document.querySelectorAll("#globalNewModal")
    const event: any = new Event('click');
    let dispatchCanvas = canvas[canvas.length - 1]
    event.isOffcanvasClose = true
    dispatchCanvas.dispatchEvent(event)
  }

  navigateBreadcrums(event, i) {

    // for (let [index, tabTag] of this.lhs_lib.myTab.entries()) {
    //   if (!tabTag.childNodes[0].hasAttribute("hidden")) {
    //     for (let dt of this.lhs_lib.adata) {
    //       if (index == dt.index) {
    //         if (i + 1 == dt.breadcrumbBar.length && event.calling_object_code == this.object_mast.Level2[this.page_no].object_code) {

    //         } else if (i + 1 < dt.breadcrumbBar.length) {
    //           // this.globalobjects.backObjectCode = event.calling_object_code ? event.calling_object_code : "";
    //           for (let a = dt.breadcrumbBar.length - 1; a > i; a--) {
    //             // if(a<=i){
    //             this.triggerClickEvent()
    //             dt.breadcrumbBar.pop()
    //             // }
    //           }
    //           // this.globalobjects.backObjectCode = event.object_code ? event.object_code : "";

    //           // this.globalobjects.backObjectPageName = null;
    //           // this.globalobjects.navigateParam = true;
    //           // this.canvasModal.popDismiss()
    //           // let a = dt.breadcrumbBar.filter((v, ind) => ind < i + 1)
    //           // dt.breadcrumbBar = a
    //         } else {

    //         }
    //       }
    //     }
    //   }
    // }
    // for(let [index,tabTag] of this.lhs_lib.myTab.entries()){
    //   if(!tabTag.childNodes[0].hasAttribute("hidden")){
    //     for(let dt of this.lhs_lib.adata){
    //       if(index==dt.index){
    //           let a=dt.breadcrumbBar.filter((v,ind)=>ind<index+1)
    //           dt.breadcrumbBar=a
    //           console.log(dt.breadcrumbBar)
    //       }
    //     }
    //   }
    // }
    for (let dt of this.lhs_lib.adata) {
      if (dt.active) {
        if (i + 1 == dt.breadcrumbBar.length && event.calling_object_code == this.object_mast.Level2[this.page_no].object_code) {

        } else if (i + 1 < dt.breadcrumbBar.length) {

          for (let a = dt.breadcrumbBar.length - 1; a > i; a--) {

            this.triggerClickEvent()
            dt.breadcrumbBar.pop()

          }

        } else {

        }
      }

    }

  }
  navigateBreadcrumsObj(event, i) {
    if (this.globalobjects.currentPageNo == i + 1) {
    }
    else if (this.globalobjects.currentPageNo > i + 1) {
      this.globalobjects.navigateParam = true;
      this.globalobjects.breadCrumpsBackPageNo = i + 1;
      this.modalCtrl.dismiss();
    } else {
      this.globalobjects.navigateParam = true;
      this.itemClicked(event);
    }

  }


  async execute_app_lib(str, event) {
    let supercomp = this;
    let fun = this.lhs_lib_util(str, event);
    fun = fun.replaceAll("await ", "");
    eval(fun.replaceAll("this.", "supercomp."));
    // if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, str);
    // }

  }

  openHardcodeObject() {
    let event = {
      apps_item_seqid: null,
      apps_page_frame_seqid: null,
      apps_page_no: "1",
      calling_object_code: "WMABLD32",
      click_events_str: "get_object_config",
      object_code: "WMABLD32",
      calling_parameter_str: `app_add_para('P_CP_OBJECT_CODE','${this.object_mast.object_code}')`,
      origin_apps_item_seqid: "",
      orignal_apps_item_seqid: null,
      orignal_apps_page_frame_seqid: null,
      orignal_object_code: "WMABLD32",
      wsdp: [],
      wscp: {
        flag: 'M',
        object_code: 'WMABLD32'
      },
      wsdpcl: this.lhs_lib.getWsdp(this.object_mast.object_code + "-PARA").wsdp
    }

    this.openPage(event)

  }
  // openHardcodeObjectPersonaliz(seqid) {
  //   let object_code="WERND418";
  //   let event = {
  //     apps_item_seqid: null,
  //     apps_page_frame_seqid: seqid,
  //     apps_page_no: "1",
  //     calling_object_code: object_code,
  //     click_events_str: "get_object_config_new",
  //     object_code: object_code,
  //     origin_apps_item_seqid: "",
  //     orignal_apps_item_seqid: null,
  //     orignal_apps_page_frame_seqid: seqid,
  //     orignal_object_code: object_code,
  //     wsdp: [],
  //     wscp: {
  //       flag: 'M',
  //       object_code: object_code
  //     },
  //     wsdpcl: this.lhs_lib.getWsdp(this.object_mast.object_code + "-PARA").wsdp
  //   }

  //   this.get_object_config(event, object_code, "tab")

  // }


  timer(event, name, duration) {

    let timerN = this.globalobjects.timerEvents.find(x => x.object_code == this.object_mast.object_code && x.timerName == name);

    if (timerN) {
      timerN.runEvFlag = true;
    } else {

      let obj = {
        object_code: this.object_mast.object_code,
        runEvFlag: true,
        timerName: name,
        timerFunc: "",
      }


      this.globalobjects.timerEvents.push(obj);
    }
    let duEvent = JSON.parse(JSON.stringify(this.lhs_lib.get_item(name, 0)));
    // duEvent.click_events_str = str;

    if (duEvent) {
      duEvent.itemClicked = "pre";
      let arr = duEvent.click_events_str ? duEvent.click_events_str.trim().replace(/\n|\r/g, "").split(";") : [];
      // delete duEvent.click_events_count;
      // delete duEvent.click_events_arr;

      arr = arr.reduce((acc, cur) => {
        if (cur.trim()) {
          acc.push(cur);
        }
        return acc;
      }, []);

      this.timerFunc = setInterval(() => {

        let timerEv = this.globalobjects.timerEvents.filter(x => x.object_code == this.object_mast.object_code);
        if ((timerEv.length > 0) && timerEv[timerEv.length - 1].runEvFlag) {
          // this.itemClicked(duEvent);
          this.call_async_clicked(duEvent, arr);
        }
      }, duration);
    }
  }


  stop_timer(name) {
    clearInterval(this.timerFunc);

    let arr = [];
    for (let x of this.globalobjects.timerEvents) {
      if (x.object_code == this.object_mast.object_code && x.timerName == name) { } else {
        arr.push(x);
      }
    }
    console.log("arr....", arr);
    this.globalobjects.timerEvents = arr;
  }

  navigateToPage(i) {
    if (this.page_no > i) {
      this.globalobjects.navigateIndex = i;
      console.log("navigateToPage run ======>>>>>>>>>>>")
      this.closePage();
    } else {
      let name = 'APPS_PAGE' + i + '_TAB';
      let item = this.lhs_lib.get_item(name, null);
      let navItem = JSON.parse(JSON.stringify(item));
      navItem.navigatePageNum = i;
      this.itemClicked(navItem);
    }
  }

  async more(ev: any) {
    const popover = await this.popoverController.create({
      component: AppSettingComponent,
      cssClass: 'my-header-popup',
      event: ev,
      translucent: true
    });
    popover.onDidDismiss().then((details: OverlayEventDetail) => {

      if (details && details.data) {
        if (details.data.role == "download") {
          this.downloadObj();
        }

        if (details.data.role == "upload") {
          this.openHomePop(ev);
        }

        if (details.data.role == "devMode") {
          this.openDeveloperPage();
        }

        if (details.data.role == "refreshObj") {
          this.refreshObjFab();
        }

        if (details.data.role == "deleteIcons") {
          this.events.publish("deleteLocal");
          this.refreshObjFab();
        }
      }

    })

    await popover.present();

    // const { role } = await popover.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }



  async treeclick(ev: any) {
    let datas;
    //     for (let frame of this.object_mast.Level2[this.page_no].Level3) {
    //   if (frame.tableData) {
    //     let data = JSON.parse(JSON.stringify(frame.tableData));
    //     data = data.map((x, i) => {
    //       datas = data;
    //       return { ...x, 'ROWNUMBER': i };
    //     });

    //   }
    // }

    const popover = await this.popoverController.create({
      component: FrameTreeMenuComponent,
      cssClass: 'my-treemenu-popup',
      event: ev,
      translucent: true,
      componentProps: { value: "nikhil_vaidya" }

    });


    // popover.onDidDismiss().then((details: OverlayEventDetail) => {

    //   if (details && details.data) {
    //     if (details.data.role == "download") {
    //       this.downloadObj();
    //     }

    //     if (details.data.role == "upload") {
    //       this.openHomePop(ev);
    //     }

    //     if (details.data.role == "devMode") {
    //       this.openDeveloperPage();
    //     }

    //     if (details.data.role == "refreshObj") {
    //       this.refreshObjFab();
    //     }

    //     if (details.data.role == "deleteIcons") {
    //       this.events.publish("deleteLocal");
    //       this.refreshObjFab();
    //     }
    //   }

    // })

    await popover.present();

    // const { role } = await popover.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }

  getImg(i, arr) {
    if (i >= arr.length) { } else {
      let item = arr[i];
      // var val = this.globalobjects.getScopeUrl() + 'getImage?id=' + item.apps_item_seqid + '&appTheme=' + this.globalobjects.appTheme;

      if (item.apps_icon_name) {
        var val = this.globalobjects.getScopeUrl() + 'getImage?id=' + item.apps_icon_name + '&appTheme=' + this.globalobjects.appTheme;

        this.sqlLiteServ.getImageFromLocal(item, val).then((res: any) => {
          item.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
          this.getImg(i + 1, arr);
        });
      } else {
        this.getImg(i + 1, arr);
      }

    }

  }




  onImgError(event) {
    event.target.src = ''
  }







  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.refreshObjFab();
      event.target.complete();
    }, 1000);
  }

  getFrameStyle(frame) {
    let str = frame.design_control_type;
    if (str && (str.toUpperCase().includes("X(") || str.toUpperCase().includes("Y(") || str.toUpperCase().includes("W(") || str.toUpperCase().includes("H("))) {
      let styleStr: any = {}
      let strArr = str.split(";");
      let size;
      for (let s of strArr) {
        let valStr = s.split("(")[1].split(")")[0];
        let valArr = valStr.replaceAll("%", "")
        // let val = eval("-" + valArr.join("+"));
        // let valArr = valStr.split(",");
        // let val = eval("-" + valStr.replaceAll("%", "").replace("," , "+"));

        if (s.toUpperCase().indexOf("X(") > -1) {
          styleStr.position = "absolute";
          styleStr.left = valArr + "%";
          // size = (val / 100) * 12;
          // size = valArr[1]
        } else if (s.toUpperCase().indexOf("Y(") > -1) {
          styleStr.position = "absolute";
          styleStr.top = valArr + "%";
          // styleStr.height = val + "%";
        } else if (s.toUpperCase().indexOf("H(") > -1) {
          styleStr.height = valArr + "%";
          styleStr['max-height'] = valArr + "%";
          styleStr['min-height'] = valArr + "%";
          styleStr.overflow = 'auto';
        } else if (s.toUpperCase().indexOf("MW(") > -1) {
          size = valArr;
          this.rowSize = size;
        } else if (s.toUpperCase().indexOf("W(") > -1) {
          size = valArr;
        }
      }
      frame.size = size;
      frame.style = styleStr;
    } else {
      frame.size = str;
      frame.style = {};
    }
    return;
  }


  signalRefresh() {
    this.globalobjects.checkAndSetScopeUrl().then(() => {
      this.globalobjects.displayCordovaToast("Connected..");
    }, () => { })
    this.dismissModal();
  }

  dismissModal() {
    this.popoverController.dismiss();
  }


  async afterParaFunc(reData, objMast, flag?) {
    let reqData = JSON.parse(JSON.stringify(reData));
    reqData.wscp.service_type = "after_para_form_global_functions";
    reqData.wsdp = [];
    reqData.wsdpcl = [];


    reqData.wscp = this.generate_wscp(null, reqData.wscp);

    if (reqData && reqData.wscp && !reqData.wscp.object_code) {
      reqData.wscp.object_code = objMast.object_code;
    }

    await this.dataService.postData("S2U", reqData).then((res: any) => {
      let data: any = res;
      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
      this.afterGetObjectConfig(objMast, reData, flag);
      if (data.responseStatus && data.responseStatus.includes("success")) {
        let objData: any = {};
        if (data.responseStatus.toLowerCase().includes("-rc")) {
          objData.Level1 = this.globalobjects.setPageInfoNoS2U(data.responseData);
        } else {
          objData = this.globalobjects.setPageInfo(data.responseData);
        }



        if (objData.Level1 && objData.Level1.length > 0 && objData.Level1[0]['status'] == 'J') {
          this.generatAllFrameJson(objData.Level1, reqData.wscp);
          let data = objData.Level1;
          let isRep = data.find(x => x.para_type == 'RE');
          if (isRep) {
            this.afterParaFunc(reqData, flag);
          }

        }

        if (data.responseHead && data.responseHead.length > 0) {
          this.generatAllFrameJson(data.responseHead, event, true);
        }

      }
      // this.ngZone.run(() => {
      //   this.cdr.detectChanges();
      // })
    });
  }


  set_noBack_frame() {
    for (let frame of this.object_mast.Level2[this.page_no].Level3) {
      if (frame.on_frame_load_str) {
        if (frame.on_frame_load_str.indexOf("take_tablerows_copy;") > -1) { } else {
          frame.on_frame_load_str = frame.on_frame_load_str + "take_tablerows_copy;";
        }
      } else {
        frame.on_frame_load_str = "take_tablerows_copy;";
      }
    }
  }



  take_tableRows_copy(event) {
    let frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seqid);
    let rows = []
    rows = frame.tableRows && frame.tableRows.length > 0 ? JSON.parse(JSON.stringify(frame.tableRows)) : [];

    if (frame) {
      frame.restored_record = JSON.parse(JSON.stringify(rows));
    }

    // if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //   event.click_events_count = event.click_events_count + 1;
    //   this.itemClicked1(event, "");
    // }
  }

  setPassData(event) {
    if (this.globalobjects.passDataArr.length > -1) {
      let arr = [];
      for (let d of this.globalobjects.passDataArr) {
        let frame = this.lhs_lib.get_frame_config(d.frameName);

        if (frame) {
          let setVal = JSON.parse(JSON.stringify(d.data));
          this.generatAllFrameJson(setVal, event);
        } else {
          arr.push(d);
        }
      }
      this.globalobjects.passDataArr = arr;
    }
  }



  app_open_page(item, data, page_no?) {


    if (item.singleClicked) {
      delete data['singleClicked'];

      // if (item.click_events_arr) {
      //   if (item.click_events_arr.length > (item.click_events_count + 1)) {
      //     item.click_events_count = item.click_events_count + 1;
      //     this.itemClicked1(item, "");
      //   }
      // }
      return;
    }

    let event = data;

    if (page_no) {
      event.page_no = page_no - 1;
    } else {
      event.page_no = this.page_no + 1;
    }

    if (data.apps_item_seqid) {
      event = JSON.parse(JSON.stringify(data));
      delete event["itemClicked"]
      event.click_events_str = "app_open_page";
      event.object_mast = this.object_mast;

      event.wscp = this.wscp;
      event.wsdp = this.wsdp;
      event.wsdpcl = this.wsdpcl;
      event.wscp.clicked_index = event.itemIndex;
    } else {
      event.click_events_str = event.wscp ? event.wscp.click_events_str : event.click_events_str;
      if (!event.click_events_str.includes('app_open_page')) {
        event.click_events_str = event.click_events_str + "app_open_page();"
      }
    }

    if (item.calling_parameter_str && item.calling_parameter_str.toLowerCase().indexOf('popup') > -1) {
      let callingArr = item.calling_parameter_str.split(';');
      for (let c of callingArr) {
        if (c.toLowerCase().indexOf('popup(') > -1) {
          event.popoverStyle = c;
        }
      }
      event.wscp.flag = 'P'
    } else if (item.calling_parameter_str && item.calling_parameter_str.toLowerCase().indexOf('offcanvas') > -1) {
      let callingArr = item.calling_parameter_str.split(';');
      for (let c of callingArr) {
        if (c.toLowerCase().indexOf('offcanvas(') > -1) {
          event.popoverStyle = c;
        }
      }
      event.wscp.flag = 'O'
    }
    if (this.isModal == 'P') {
      event.wscp.flag = 'P'
    }
    // event.click_events_arr=item.click_events_arr;
    // event.click_events_count=item.click_events_count

    // delete event['object_mast'];
    event.holdWscp = this.holdWscp;
    this.ngZone.run(() => {
      this.openPage(event);
    })

    // if (item.click_events_arr) {
    //   if (item.click_events_arr.length > (item.click_events_count + 1)) {
    //     item.click_events_count = item.click_events_count + 1;
    //     this.itemClicked1(item, "");
    //   }
    // }

  }



  async back_refresh(event, frames?) {

    if (this.object_mast.operation_mode_Arr && this.object_mast.operation_mode_Arr.join("#").indexOf('SYS_BACK_REFRESH(') > -1) {
      await this.app_execute_item(event, 'SYS_BACK_REFRESH', 'click_events_str');
      this.lhs_lib.refresh_frames();
    } else {
      this.wscp.object_code = this.object_mast.object_code;
      let nextPageInfo: any = {};
      nextPageInfo.wsdp = this.wsdp
      nextPageInfo.wsdpcl = this.wsdpcl
      nextPageInfo.wscp = this.wscp
      if (frames) {
        nextPageInfo.clickEvt = frames
      } else {
        let str = "";
        for (let frame of this.object_mast.Level2[this.page_no].Level3) {
          if (frame.apps_page_frame_seqid != this.object_mast.object_code + "-PARA") {
            str = str + frame.apps_page_frame_seqid + ",";
          }
        }
        nextPageInfo.clickEvt = str;
      }
      this.app_reload_frame(nextPageInfo, nextPageInfo.clickEvt);
    }
  }

  go_home_page() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      location.reload();
    }
    else {
      let url: any = location;
      if (isPlatformServer(this.platformId)) return;
      window.open(String(url).split('super')[0], '_self');
    }
  }

  app_reload_object() {
    this.wscp.service_type = ""
    this.refreshObjFab();
  }

  app_back_page(event, pageNo?) {

    console.log("back page run ======>>>>>>>>>>>")
    this.back_page_calling_para(event);
    if (pageNo) {
      this.globalobjects.pageNo = pageNo
    }
    if (this.plt && this.isTab && event.item_name == "PB_BACK" && event.prompt_name == "Exit") {
      this.tab_close_event()
    } else {
      if (this.isModal == "M" || this.isModal == "Menu") {
        this.triggerClickEvent();
        this.breadCrumpClose();
      } else if (this.isModal == "O") {
        this.offCanvasClick()
      } else if (this.isModal == "P") {
        this.modalClick()
      }
      else {
        console.log("app_back_page run ======>>>>>>>>>>>")
        this.closePage();
      }
    }
  }

  beforeObjectMast(objMast) {
    for (let obj of objMast.Level2) {
      for (let frame of obj.Level3) {
        if (frame.Level4 && frame.Level4.length > 0) {
          this.lhs_lib.setItemDefaultValue(frame);
        }
      }
    }
  }


  async processObjectMast(objMast) {
   
    if (this.globalobjects.layoutObject && this.globalobjects.layoutObject.length > 0 && !this.plt) {
      for (let object of this.globalobjects.layoutObject) {
        for (let obj of object.Level2) {
          for (let lFrame of obj.Level3) {
            if (lFrame.apps_frame_type == 'SYSTEM' && lFrame.apps_frame_sub_type == 'LAYOUT_OPTION') {
              if (lFrame.quick_buttons) {
                delete lFrame['quick_buttons'];
                 this.globalobjects.layoutObject = [...this.globalobjects.layoutObject];
              }

            }
          }
        }
      }
    }
  
    if (objMast && objMast.Level2 && objMast.Level2[this.page_no]) {
      for (let frame of objMast.Level2[this.page_no].Level3) {
        this.parseFrame(frame);
      }
    }

  }

    parseFrame(frame) {

    if (frame.Level4 && frame.Level4.length > 0 && frame.apps_frame_type != 'TABLE' && frame.apps_frame_type != 'ENTRY_TABLE' && frame.frame_alias != 'DISP_COL' &&
      frame.apps_frame_type != 'TREE_TABLE' && frame.apps_frame_type != 'TAB_FRAMES' && frame.apps_frame_sub_type != 'GLOBAL_SEARCH_BODY' && frame.frame_alias != 'ADV_FILTER') {
      if (!frame.tableRows || frame.tableRows.length < 1) {
        frame.tableRows = [];
        frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
        this.processData.afterTableRows(frame);
      } else {
        this.processData.afterTableRows(frame);
      }
    }

    if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE') {
      delete frame['searchableData'];
      delete frame['searchableRawData'];
      delete frame['search'];
      this.checkForDD(frame);
    } else if (frame.apps_frame_type == 'MAP' || frame.apps_frame_type == 'NEWCALENDER') {
    } else if (frame.apps_frame_type == 'DESKCALENDER') {

      // } else if (frame.apps_frame_type == 'TAB_FRAMES') {
      //   this.parseTabFrame(frame);
    } else {
      if(this.globalobjects.layoutObject && this.globalobjects.layoutObject.length>0 && !this.plt){
      if (frame.apps_frame_sub_type == 'QUICK_ACTION_BUTTON') {
        for (let object of this.globalobjects.layoutObject) {
          for (let obj of object.Level2) {
            for (let lFrame of obj.Level3) {
              // if(lFrame.quick_buttons){
              //   delete lFrame['quick_buttons'];
              // }
              if (lFrame.apps_frame_type == 'SYSTEM' && lFrame.apps_frame_sub_type == 'LAYOUT_OPTION') {
                // let arr = [...frame.tabelRows,...lFrame.tableRows];
                lFrame.quick_buttons = frame.tableRows;
                 this.globalobjects.layoutObject = [...this.globalobjects.layoutObject];
              }
            }
          }
        }

      }
    }

      if (frame.frame_alias != 'ADV_FILTER') {

        delete frame['searchableData'];
        delete frame['searchableRawData'];
        setTimeout(() => {
          this.parseBuiltins(frame);
        }, 1);
      }
    }
  }
  // parseFrame(frame) {

  //   if (frame.Level4 && frame.Level4.length > 0 && frame.apps_frame_type != 'TABLE' && frame.apps_frame_type != 'ENTRY_TABLE' && frame.frame_alias != 'DISP_COL' &&
  //     frame.apps_frame_type != 'TREE_TABLE' && frame.apps_frame_type != 'TAB_FRAMES' && frame.apps_frame_sub_type != 'GLOBAL_SEARCH_BODY' && frame.frame_alias != 'ADV_FILTER') {
  //     if (!frame.tableRows || frame.tableRows.length < 1) {
  //       frame.tableRows = [];
  //       frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
  //       this.processData.afterTableRows(frame);
  //     } else {
  //       this.processData.afterTableRows(frame);
  //     }
  //   }

  //   if (frame.apps_frame_type == 'ENTRY_TABLE' || frame.apps_frame_type == 'TABLE') {
  //     delete frame['searchableData'];
  //     delete frame['searchableRawData'];
  //     delete frame['search'];
  //     this.checkForDD(frame);
  //   } else if (frame.apps_frame_type == 'MAP' || frame.apps_frame_type == 'NEWCALENDER') {
  //   } else if (frame.apps_frame_type == 'DESKCALENDER') {

  //     // } else if (frame.apps_frame_type == 'TAB_FRAMES') {
  //     //   this.parseTabFrame(frame);
  //   } else {
  //     if (frame.frame_alias != 'ADV_FILTER') {

  //       delete frame['searchableData'];
  //       delete frame['searchableRawData'];
  //       setTimeout(() => {
  //         this.parseBuiltins(frame);
  //       }, 1);
  //     }
  //   }
  // }

  // parseTabFrame(tabFrame) {
  //   if (tabFrame.tabsArr) {
  //     for (let frame of tabFrame.tabsArr) {
  //       this.parseFrame(frame);
  //     }
  //   }
  // }


  parseBuiltins(frame) {

    if ((!frame.tableRows || frame.tableRows.length < 1) && frame.apps_frame_type != 'TABLE' && frame.apps_frame_type != 'CARD' && frame.frame_alias != 'DISP_COL' && frame.apps_frame_sub_type != 'GLOBAL_SEARCH_BODY') {

      if ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' && !(frame.apps_page_frame_seqid.includes("PARA"))) {
        frame.Level4 = this.lhs_lib.get_ass_Level4(frame.apps_page_frame_seqid);
      }

      if (frame.Level4 && frame.Level4.length > 0) {
        frame.tableRows = [];
        frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
        this.processData.afterTableRows(frame);
      }
    }

    let builtinsArr = [];

    if (frame.relational_string) {
      if (frame.relational_string && frame.relational_string.indexOf(";") > -1) {
        builtinsArr = frame.relational_string.split(";");
      } else {
        builtinsArr[0] = frame.relational_string;
      }

    } else {
      if (frame.on_frame_load_str) {
        if (frame.on_frame_load_str.indexOf(";") > -1) {
          builtinsArr = frame.on_frame_load_str.split(";");
        } else {
          builtinsArr[0] = frame.on_frame_load_str;
        }
      }
    }

    if (builtinsArr && builtinsArr.length > 0) {


      frame.runEvents = [];
      frame.eventType = "frame.on_frame_load_str";

      let parseFrame: any = {};

      for (let k in frame) {
        if (k != 'canvasRows' && k != 'tableRows' && k != 'headers' && k != 'tableData') {
          parseFrame[k] = frame[k];
        }
      }

      if (builtinsArr) {
        builtinsArr = builtinsArr.reduce((acc, cur) => {
          if (cur) {
            acc.push(cur);
          }
          return acc;
        }, []);
      }

      // parseFrame.click_events_arr = builtinsArr;
      // parseFrame.click_events_count = 0;
      // this.itemClicked1(parseFrame, "", frame, true);
      // this.itemClicked_new(parseFrame, builtinsArr, frame, true);
      // this.newItemClicked(parseFrame, "");

      this.call_async_clicked(parseFrame, builtinsArr, frame, true);
      frame.relational_string = "";
    } else {
      this.lhs_lib.refresh_frames();
    }

  }

  async getData(parseFrame, service_type): Promise<any> {

    // this.globalobjects.setFocus(false);
    let frameName = parseFrame.executing_apps_page_frame_seqid ? parseFrame.executing_apps_page_frame_seqid : parseFrame.apps_page_frame_seqid;
    let frame = this.lhs_lib.get_frame_config(frameName);
    if (frame && frame.frame_alias == "DISP_COL") {
      delete frame["iskeyFIlterFlagDataToggle"]
    }
    delete frame['new_record_index'];
    delete frame['deletedRows'];
    if (service_type && (service_type.toLowerCase() != 'execute_batch' && service_type.toLowerCase() != 'app_execute_api' && service_type.toLowerCase() != 'gsp_service')) {
      frame.loading = true;
      this.cdEngine.mark(frame.apps_page_frame_seqid);
    }

    if (this.globalobjects.logFlag) {
      let name = `${service_type} ${service_type == 'populate_from_procedure' ? this.wscp.procedure_name : ''}`;
      let ws_type = service_type;

      // this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, parseFrame.apps_item_seqid, frame.object_code, "start",ws_type)
      let log_name = `getData ${parseFrame.item_name} ${frame.apps_page_frame_seqid}_${ws_type}`;
      let status = "start";
      const seq = this.lhs_lib.start();
      this.lhs_lib.get_event_log_objs(name, frame.apps_page_frame_seqid, parseFrame.apps_item_seqid, frame.object_code, status, ws_type, log_name, seq)
    }

    let wscp: any = {};
    wscp = JSON.parse(JSON.stringify(this.wscp));
    wscp.object_code = frame.object_code ? frame.object_code : "";
    wscp.service_type = service_type;
    wscp.apps_item_seqid = parseFrame.apps_item_seqid ? parseFrame.apps_item_seqid : (this.wscp.apps_item_seqid ? this.wscp.apps_item_seqid : "");
    wscp.apps_page_frame_seqid = frame.apps_page_frame_seqid ? frame.apps_page_frame_seqid : "";
    wscp.apps_working_mode = this.wscp.apps_working_mode ? this.wscp.apps_working_mode : "";
    wscp.item_sub_type = this.wscp.item_sub_type ? this.wscp.item_sub_type : "";
    wscp.orignal_apps_item_seqid = this.wscp.orignal_apps_item_seqid ? this.wscp.orignal_apps_item_seqid : "";
    wscp.origin_apps_item_seqid = this.wscp.origin_apps_item_seqid ? this.wscp.origin_apps_item_seqid : "";
    // this.wscp = wscp;

    // let dataRes = this.lhs_lib.getWsdp("");
    let wsdp = [];
    let wsdpcl = [];

    if (parseFrame.calling_frame_seqid_str) {
      wsdp = this.lhs_lib.getDp(parseFrame.calling_frame_seqid_str);
      wsdpcl = this.lhs_lib.getDpcl(parseFrame.calling_frame_seqid_str);
    } else {
      wsdpcl = this.lhs_lib.getDpcl(parseFrame.calling_frame_seqid_str);
    }

    // if(this.wsdpcl && this.wsdpcl.length > 0){
    //   for(let w of this.wsdpcl){
    //     let find = wsdpcl.find(x => JSON.stringify(x) == JSON.stringify(w));
    //     if(!find){
    //       wsdpcl.push(w);
    //     }
    //   }
    //   this.wsdpcl && this.wsdpcl.length > 0 ? this.wsdpcl : dataRes.wsdpcl;
    // } 

    wscp = this.generate_wscp(parseFrame, wscp);

    var reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": wsdpcl
    }
    frame.requestData = reqData;
    let l_url = "S2U";
    let tableData: any;

    frame.frame_status = 'CHANGE';

    if (frame.runEvents) {
      frame.runEvents.push(service_type);
    }

    if (service_type == "execute_query_in_file" || (this.globalobjects.wscp_para && this.globalobjects.wscp_para['execute_query_in_file'] == 'Y')) {
      frame.loading = false;
      this.getDataDownload(frame, service_type, reqData);
      this.excute_event(parseFrame);
    } else if (service_type == "download_template") {
      this.downloadTemplateExcel(parseFrame, "execute_query", reqData);
      this.excute_event(parseFrame);
    }
    else {
      // if(service_type == 'populate_from_procedure' || service_type == 'execute_query'){
      //   frame.tableRows ? frame.tableRows = [] : '';
      //   frame.canvasRows ? frame.canvasRows = [] : '';
      //   frame.tableData ? frame.tableData = [] : '';
      //   if (frame.searchableData) {
      //     frame.searchableData = []
      //     frame.searchableRawData = []
      //   }
      // }

      await this.dataService.postData(l_url, reqData).then(async (res) => {

        if (this.destroyed) {
          frame.loading = true;
          return;
        }

        if (this.globalobjects.logFlag) {
          let name = `${service_type} ${service_type == 'populate_from_procedure' ? this.wscp.procedure_name : ''}`;
          let ws_type = service_type;
          // this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, parseFrame.apps_item_seqid, frame.object_code, "end",ws_type)
          let log_name = `getData ${parseFrame.item_name} ${frame.apps_page_frame_seqid}_${ws_type}`;
          let status = "end";
          this.lhs_lib.end();
          this.lhs_lib.get_event_log_objs(name, frame.apps_page_frame_seqid, parseFrame.apps_item_seqid, frame.object_code, status, ws_type, log_name)
        }

        frame.loading = false;
        let data: any = res;

        if (data.responseStatus && data.responseStatus.includes("success")) {

          try {

            if (data.responseStatus && data.responseStatus.toLowerCase().includes("large_data")) {
              this.displayMsg(reqData, parseFrame, data.responseStatus);
            } else {

              if (Array.isArray(data.responseData) && !data.responseHead) {
                let resData = [];
                let rD = data.responseData;
                for (let a of rD) {
                  let objData = this.globalobjects.setPageInfo(a);
                  for (let c of objData.Level1) {
                    resData.push(c);
                  }
                }
                this.generatAllFrameJson(resData, parseFrame, true);
                return;
              } else {
                if ((data.responseData.Level1_Keys && data.responseData.Level1_Keys.length > 0) || (Array.isArray(data.responseData) && data.responseData.length > 0)) {
                  let objData: any = {};
                  if (data.responseStatus.toLowerCase().includes("-rc")) {

                    objData.Level1 = this.globalobjects.setPageInfoNoS2U(data.responseData);

                  } else {

                    objData = this.globalobjects.setPageInfo(data.responseData);

                    let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
                    let wsSewId = id ? data.responseData.Values[0][id] : "";

                    if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
                      this.globalobjects.presentAlert(objData.Level1[0].message);
                    }

                  }


                  if (data.responseHead && data.responseHead.length > 0) {
                    this.generatAllFrameJson(data.responseHead, parseFrame, true);
                  }

                  tableData = objData.Level1;
                  // Developer Mode Loging

                  //Developer Mode Loging

                  ////    Jtype Data ////

                  if ((objData.Level1 && objData.Level1.length > 0 && objData.Level1[0]['status'] == 'J') || frame.tp == 2) {
                    // this.ngZone.run(() => {
                    //   this.cdr.detectChanges();
                    // })
                    this.generatAllFrameJson(objData.Level1, parseFrame);

                    let data = objData.Level1;
                    let isRep = data.find(x => x.para_type == 'RE');
                    if (isRep) {
                      await this.getData(parseFrame, service_type).then(() => {
                        delete parseFrame['rase']
                        this.excute_event(parseFrame);
                        return;
                      });
                    } else {
                      // this.excute_event(parseFrame);
                      return;
                    }

                  } else {

                    delete frame['searchableData'];
                    delete frame['searchableRawData'];

                    tableData = this.lhs_lib.remove_delete_null(frame, tableData);
                    frame.tableData = tableData;

                    if (frame.frame_alias && frame.frame_alias.toUpperCase() == 'DIM_HOLD') {
                      let dim_distinct_str = this.lhs_lib.get_distinct_str(tableData, 'HOLD_COLUMN_NAME');
                      if (dim_distinct_str) {
                        this.lhs_lib.set_item_value(parseFrame, "p_dim_distinct_str", 0, dim_distinct_str);
                      }
                    }
                    // For Getting *CALLING_OBJECT_CODE* from Frame //
                    frame.callingObjectArr = this.globalobjects.getCallingObjectCodeArr(objData.Level1);
                    // For Getting *CALLING_OBJECT_CODE* from Frame //
                    frame.executedQuery = true;

                    if (frame.apps_frame_type == 'TREE_TABLE' || frame.apps_frame_type == 'TREE_MENU' || frame.apps_frame_type == 'PIVOT' || frame.apps_frame_type == 'FULLCALENDAR' || frame.apps_frame_type == 'CUSTOM_CALENDAR' || frame.apps_frame_type == 'TERMS' || frame.apps_frame_type == 'ACCORIDION') {
                      this.events.publish(frame.apps_page_frame_seqid);

                    } else if (frame.apps_frame_type == 'ADDON') {
                      if (service_type == 'populate_from_procedure') {
                        this.events.publish(frame.apps_page_frame_seqid, 'refreshaddon');
                      } else {
                        this.events.publish(frame.apps_page_frame_seqid);
                      }
                    }

                    if (service_type != 'itemwise_sql_populate_data') {

                      if (this.globalobjects.logFlag) {

                        this.globalobjects.excuted_events_logs.push(`Processing data for ${frame.apps_page_frame_name} - ${frame.apps_page_frame_seqid},${reqData.wscp.service_type} , ${new Date().toString().split(" GMT")[0]}`);
                      }

                      if (frame.apps_frame_sub_type && (frame.apps_frame_sub_type.toUpperCase() == 'SINGLE_ROW' || frame.apps_frame_sub_type.toUpperCase() == 'SINGLE_ROW_BLANK' || frame.no_of_records == '1')) {
                        await this.processData.single_row(frame, tableData, frame.auto_populate_default_where);
                      } else {
                        if (frame.apps_frame_type != 'TERMS' && frame.apps_frame_type != 'ACCORIDION') {

                          if (frame.search) {
                            let data = this.processData.searchAllData(frame, true);
                            await this.processData.populateRows(frame.apps_page_frame_seqid, data);
                          } else {
                            await this.processData.populateRows(frame.apps_page_frame_seqid, tableData);
                          }

                        }
                      }

                      if (this.destroyed) {
                        return;
                      }
                      if (this.globalobjects.logFlag) {

                        this.globalobjects.excuted_events_logs.push(`complete data for ${frame.apps_page_frame_name} - ${frame.apps_page_frame_seqid},${reqData.wscp.service_type} , ${new Date().toString().split(" GMT")[0]}`);
                      }
                    }

                    // this.excute_event(parseFrame);


                    if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'APPLICATION') {
                      this.getImage(frame);
                    }

                    return;
                  }
                } else if (service_type != 'itemwise_sql_populate_data' && service_type != 'multi_itemwise_sql_populate_data' && service_type != 'all_itemwise_sql_populate_data') {
                  frame.loading = false;
                  frame.tableData = [];
                  frame.tableRows = [];
                  frame.canvasRows = [];
                  if ((!frame.tableRows || frame.tableRows.length < 1) && frame.apps_frame_type != 'TABLE' && frame.apps_frame_type != 'CARD') {
                    if (frame.Level4 && frame.Level4.length > 0) {
                      frame.tableRows = [];
                      frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));

                      this.processData.afterTableRows(frame);
                      // this.ngZone.run(() => {
                      //   this.cdr.detectChanges();
                      // })
                    }
                  }
                  // this.excute_event(parseFrame);

                  if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'APPLICATION') {
                    this.getImage(frame);
                  }
                  this.cdEngine.mark(frame.apps_page_frame_seqid);
                  return;
                }
              }
            }

          } catch (error) {

            if (data.responseMsg) {
              alert(data.responseMsg);
              console.log(data.responseMsg);
            } else {
              console.log(error);
              alert(error);
            }

            this.clearQue();
          }

        } else {
          alert(data.responseMsg);
          console.log(data.responseMsg);
          // this.excute_event(parseFrame);
          return;
        }


        // return;
      }).catch(err => {

        if (this.globalobjects.logFlag) {
          let name = `${service_type} ${service_type == 'populate_from_procedure' ? this.wscp.procedure_name : ''}`;
          let ws_type = service_type;
          // this.lhs_lib.get_event_log_obj(name, frame.apps_page_frame_seqid, parseFrame.apps_item_seqid, frame.object_code, "end",ws_type)
          let log_name = `getData ${parseFrame.item_name} ${frame.apps_page_frame_seqid}_${ws_type}`;
          let status = "end";
          this.lhs_lib.end();
          this.lhs_lib.get_event_log_objs(name, frame.apps_page_frame_seqid, parseFrame.apps_item_seqid, frame.object_code, status, ws_type, log_name)
        }
        frame.loading = false;
        frame.tableData = [];

        if ((!frame.tableRows || frame.tableRows.length < 1) && frame.apps_frame_type != 'TABLE') {
          if (frame.Level4 && frame.Level4.length > 0) {
            frame.tableRows = [];
            frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));

            this.processData.afterTableRows(frame);
          }
        }

        return;
      })

      if (wscp.procedure_name) {
        delete wscp['procedure_name'];
      }
    }
  }

  displayMsg(reqData: any, parseFrame, status) {
    let arr = status.split("#");
    let count = arr[arr.length - 1].split(":=")[1];

    let displayMessage = `Total record is ${count} do you want to download in file!`
    this.lhs_lib.app_confirm_msg(null, "JMI", "yes", "no", null, null, displayMessage).then((res: any) => {
      // alert(res);
      if (res == 1 || res == "1") {
        // alert("res download");
        this.getDataDownload(parseFrame, arr[0], reqData);
      } else {
        // alert("no");
      }
    });
  }
  async getDataDownload(parseFrame, status, reqData1?, isLargeValue?: any): Promise<any> {
    let reqData: any = JSON.parse(JSON.stringify(reqData1));
    // // this.globalobjects.setFocus(false);
    let frameName = parseFrame.apps_page_frame_name ? parseFrame.apps_page_frame_name : parseFrame.apps_page_frame_seqid;
    // let arr = status.split("-");
    // let wsSeq = arr[arr.length - 1];
    reqData.wscp.execute_query_in_file = 'Y';
    if (isLargeValue) {
      reqData.wscp.download_type = isLargeValue;
    } else {
      reqData.wscp.download_type = 'direct';
    }
    let wsdp = [];
    let wsdpcl = [];

    if (parseFrame.calling_frame_seqid_str) {
      wsdp = this.lhs_lib.getDp(parseFrame.calling_frame_seqid_str);
      wsdpcl = this.lhs_lib.getDpcl();
    } else {
      wsdpcl = this.lhs_lib.getDpcl();
    }

    reqData.wscp.ref_cursor_mode = this.globalobjects.refCursorMode ? 'T' : 'F';

    this.downloadCsvFromServer(reqData, frameName);

  }





  excute_event(event) {

    // this.globalobjects.setFocus(true);

    // if (this.globalobjects.focusedItem) {

    //   this.lhs_lib.go_item(this.globalobjects.focusedItem.name, this.globalobjects.focusedItem.index != undefined ? this.globalobjects.focusedItem.index : (event.itemIndex ?? 0), true);
    //   this.globalobjects.focusedItem = '';
    // }

    // if (event.click_events_arr) {
    //   if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //     event.click_events_count = event.click_events_count + 1;
    //     this.itemClicked1(event, "");
    //   }
    // }
  }

  set_item_search(event, to, val) {
    this.search_item(event, to, val, true);
  }

  search_item(event, to, from, flag) {
    console.log(event.singleClicked);
    let ind = event.indexcount != undefined ? event.indexcount : event.itemIndex;
    let searchVal: any;
    let fFrame: any;
    let sFlag: boolean = false;
    if (!flag) {
      let searchItem = this.lhs_lib.get_item(from, ind);
      searchVal = searchItem.value;
      fFrame = this.lhs_lib.get_frame_config(searchItem.apps_page_frame_seqid);
    } else {
      searchVal = from;
    }

    let to_val = this.lhs_lib.get_item_search(to);
    let val = to_val.search

    if (event != undefined && to != undefined && from != undefined) {

      let frame = this.lhs_lib.get_frame_config(to_val.apps_page_frame_seqid);
      frame.rowCount = 0
      let flag = this.delete_search_data(from, frame, fFrame);

      if (val == searchVal) {

        if (fFrame) {
          fFrame.search_status = 'N';
        }
        // this.lhs_lib.set_item_search(to, "%%");
        if (fFrame) {
          fFrame.active_row = null;
        }
      } else {
        sFlag = true;
        if (fFrame) {
          fFrame.search_status = 'Y';
        }
        this.lhs_lib.set_item_search(to, searchVal);
      }

      let data = this.processData.filterColumn(frame);
      // frame.searchableData = data;

      if (frame && fFrame) {

        if (sFlag) {
          this.add_search_data(to, from, searchVal, fFrame, frame, event);
        }

        if (frame.json_related_frames && (!event.singleClicked || flag)) {
          frame.relational_string = frame.json_related_frames
          this.parseBuiltins(frame);
        }

      }
    } else {
      alert("some parameters are missing in search_item()")
    }
  }

  delete_search_data(from, frame, fFrame) {
    let to;
    let flag = false;
    if (frame && frame.single_search) {
      to = frame.single_search.to;
      this.lhs_lib.set_item_search(to, "%%");
      delete frame['single_search'];
    }

    if (frame.linked_search) {
      let find = frame.linked_search.find(x => x.from == from);
      if (find) {
        to = find.to;
        flag = true;
      }

      let fil = frame.linked_search.filter(x => x.from != from);
      if (fil && fil.length > 0) {
        frame.linked_search = fil;
      } else {
        delete frame['linked_search'];
      }

      if (fFrame) {
        delete fFrame['json_linked'];
        delete fFrame['from_search'];
      }
    }

    if (to) {
      this.lhs_lib.set_item_search(to, "%%");
    }
    return flag;
  }

  add_search_data(to, from, searchVal, fFrame, frame, event) {
    let obj = {
      to,
      from,
      searchVal,
      name: fFrame ? fFrame.frame_alias : '',
      itmName: from.split(".")[1],
      frameName: fFrame ? fFrame.apps_page_frame_name : '',
      indexcount: event.indexcount
    }

    if (event.singleClicked || (fFrame.apps_frame_sub_type != 'JSON')) {
      frame.single_search = obj;
    } else {
      if (!frame.linked_search) {
        frame.linked_search = [];
      }
      fFrame.json_linked = true;
      frame.linked_search.push(obj);
      fFrame.from_search = obj;
    }
  }

  getItemwiseData(frameId, event) {

    let frame = JSON.parse(JSON.stringify(this.lhs_lib.get_frame_config(frameId)));

    if (frame) {
      if (frame.Level4 && frame.Level4.length > 0) {
        for (let itemData of frame.Level4) {
          if (itemData.Level5) {
            for (let item of itemData.Level5) {
              if (item.item_visible_flag == 'T') {
                this.wscp.apps_item_seqid = item.apps_item_seqid;
                this.wscp.apps_page_frame_seqid = item.apps_page_frame_seqid;
                this.wscp.item_sub_type = item.item_sub_type;
                let detectKey = item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#';
                this.getItemData(frame, "itemwise_sql_populate_data", detectKey);
              }
            }
          }
        }
        delete event['executing_apps_page_frame_seqid'];
      }
    }

    // if (event.click_events_arr) {
    //   if (event.click_events_arr.length > (event.click_events_count + 1)) {
    //     event.click_events_count = event.click_events_count + 1;
    //     this.itemClicked1(event, "");
    //   }
    // }

    return;
  }


  getItemData(parseFrame, service_type, detectKey) {

    // // this.globalobjects.setFocus(false);
    let frameName = parseFrame.executing_apps_page_frame_seqid ? parseFrame.executing_apps_page_frame_seqid : parseFrame.apps_page_frame_seqid;
    let frame = this.lhs_lib.get_frame_config(frameName);
    delete frame['new_record_index'];
    delete frame['deletedRows'];
    frame.loading = true;
    let wscp: any = {};
    wscp = JSON.parse(JSON.stringify(this.wscp));
    wscp.object_code = frame.object_code ? frame.object_code : "";
    wscp.service_type = service_type;
    wscp.apps_item_seqid = parseFrame.apps_item_seqid ? parseFrame.apps_item_seqid : (this.wscp.apps_item_seqid ? this.wscp.apps_item_seqid : "");
    wscp.apps_page_frame_seqid = frame.apps_page_frame_seqid ? frame.apps_page_frame_seqid : "";
    wscp.apps_working_mode = this.wscp.apps_working_mode ? this.wscp.apps_working_mode : "";
    wscp.item_sub_type = this.wscp.item_sub_type ? this.wscp.item_sub_type : "";
    wscp.orignal_apps_item_seqid = this.wscp.orignal_apps_item_seqid ? this.wscp.orignal_apps_item_seqid : "";
    wscp.origin_apps_item_seqid = this.wscp.origin_apps_item_seqid ? this.wscp.origin_apps_item_seqid : "";
    // this.wscp = wscp;

    // let dataRes = this.lhs_lib.getWsdp("");
    let wsdp = [];
    let wsdpcl = [];

    if (parseFrame.calling_frame_seqid_str) {
      wsdp = this.lhs_lib.getDp(parseFrame.calling_frame_seqid_str);
      wsdpcl = this.lhs_lib.getDpcl(parseFrame.calling_frame_seqid_str);
    } else {
      wsdpcl = this.lhs_lib.getDpcl(parseFrame.calling_frame_seqid_str);
    }

    wscp = this.generate_wscp(parseFrame, wscp);

    var reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": wsdp,
      "wsdpcl": wsdpcl
    }
    frame.requestData = reqData;
    let l_url = "S2U";
    let tableData: any;

    frame.frame_status = 'CHANGE';

    if (frame.runEvents) {
      frame.runEvents.push(service_type);
    }

    // reqData.wscp.ref_cursor_mode = this.globalobjects.refCursorMode ? 'T' : 'F';
    this.dataService.postData(l_url, reqData).then((res) => {
      frame.loading = false;
      let data: any = res;

      if (data.responseStatus && data.responseStatus.includes("success")) {

        try {

          if (Array.isArray(data.responseData) && !data.responseHead) {
            let resData = [];
            let rD = data.responseData;
            for (let a of rD) {
              let objData = this.globalobjects.setPageInfo(a);
              for (let c of objData.Level1) {
                resData.push(c);
              }
            }
            this.generatAllFrameJson(resData, parseFrame, true);
          } else {
            if ((data.responseData.Level1_Keys && data.responseData.Level1_Keys.length > 0) || (Array.isArray(data.responseData) && data.responseData.length > 0)) {
              let objData: any = {};

              if (data.responseStatus.toLowerCase().includes("-rc")) {

                objData.Level1 = this.globalobjects.setPageInfoNoS2U(data.responseData);

              } else {

                objData = this.globalobjects.setPageInfo(data.responseData);



                let id = data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") > -1 ? data.responseData.Level1_Keys.indexOf("SAME_WS_SEQID") : data.responseData.Level1_Keys.indexOf("same_ws_seqid");
                let wsSewId = id ? data.responseData.Values[0][id] : "";

                if (objData.Level1.length > 0 && objData.Level1[0].status && objData.Level1[0].status == "Q" && objData.Level1[0].message) {
                  this.globalobjects.presentAlert(objData.Level1[0].message);
                }

              }

              tableData = objData.Level1;
              // Developer Mode Loging

              //Developer Mode Loging

              ////    Jtype Data ////

              if ((objData.Level1 && objData.Level1.length > 0 && objData.Level1[0]['status'] == 'J') || frame.tp == 2) {
                // this.ngZone.run(() => {
                //   this.cdr.detectChanges();
                // })
                this.generatAllFrameJson(objData.Level1, parseFrame);

                let data = objData.Level1;
                let isRep = data.find(x => x.para_type == 'RE');
                if (isRep) {
                  this.getData(parseFrame, service_type).then(() => {
                    delete parseFrame['rase']
                    this.excute_event(parseFrame);
                    return;
                  });
                } else {
                  this.excute_event(parseFrame);
                  // return;
                }

              }
            }
          }
          this.cdEngine.detect(detectKey + frame.apps_page_frame_seqid)
          return;
        } catch (error) {
          if (data.responseMsg) {
            alert(data.responseMsg);
            console.log(data.responseMsg);
          } else {
            console.log(error);
            alert(error);
          }

          this.clearQue();
        }

      } else {
        alert(data.responseMsg);
        console.log(data.responseMsg);
        this.excute_event(parseFrame);
        return;
      }


      // return;
    }).catch(err => {
      // this.globalobjects.setFocus(true);

      // if (this.globalobjects.focusedItem) {

      //   this.lhs_lib.go_item(this.globalobjects.focusedItem.name, this.globalobjects.focusedItem.index != undefined ? this.globalobjects.focusedItem.index : (parseFrame.itemIndex ?? 0), true);
      //   this.globalobjects.focusedItem = '';
      // }

      frame.loading = false;
      frame.tableData = [];

      if ((!frame.tableRows || frame.tableRows.length < 1) && frame.apps_frame_type != 'TABLE') {
        if (frame.Level4 && frame.Level4.length > 0) {
          frame.tableRows = [];
          frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));

          this.processData.afterTableRows(frame);
        }
      }

      // if (parseFrame.click_events_arr) {
      //   if (parseFrame.click_events_arr.length > (parseFrame.click_events_count + 1)) {
      //     parseFrame.click_events_count = parseFrame.click_events_count + 1;
      //     this.itemClicked1(parseFrame, "");
      //   }
      // }

      return;
    })

    if (wscp.procedure_name) {
      delete wscp['procedure_name'];
    }

  }


  app_paste_frame(event, to, jsonName, toItems) {
    let data = this.lhs_lib.app_paste_frame(to, jsonName, toItems);
    // this.generatAllFrameJson(data, event);

    for (let d of data) {
      let name = d.frame_name ? d.frame_name + "." + d.item_name : d.item_name;
      this.lhs_lib.set_item_value(event, name, d.row_slno, d.para_value, "");
    }

  }


  checkForDD(frame) {
    if (frame) {
      frame.ddArrayList = [];
      if (frame.Level4 && frame.Level4.length > 0) {
        for (let itemData of frame.Level4) {
          if (itemData.Level5) {
            for (let item of itemData.Level5) {
              if (item.item_type == "LIST_BOX" && item.on_load_events_str && item.on_load_events_str.toLowerCase().includes('populate_list')) {
                frame.ddArrayList.push(item);
              }

              if (item.display_setting_str) {
                let obj = item.display_setting_str;
                try {
                  obj = JSON.parse(obj);
                } catch {
                  obj = obj;
                }

                if (obj && obj["width"]) {
                  obj["max-width"] = obj["width"];
                  obj["min-width"] = obj["width"];
                }
                item.display_setting_str = obj;
              }
            }
          }
        }
      }

      if (frame.frame_type == 'TABLE') {
        delete frame["ddArrayList"];
      }

      if (frame.ddArrayList && frame.ddArrayList.length > 0 && !frame.isExecuting) {
        this.getDataDD(frame, 0);
      } else {
        setTimeout(() => {
          this.parseBuiltins(frame);
        }, 1);
      }
    }
  }

  getDataDD(frame, count) {
    let event = frame.ddArrayList[count];
    let wscp = JSON.parse(JSON.stringify(this.wscp));
    wscp.service_type = "get_lov_data";
    wscp.apps_page_no = event.apps_page_no;
    wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    wscp.apps_item_seqid = event.apps_item_seqid;
    wscp.apps_working_mode = event.apps_working_mode;
    wscp.lov_code = event.lov_code;

    let wsdp = [];
    let col = {};
    let rowindex;
    if (event.indexcount) {
      rowindex = event.indexcount;
    } else {
      rowindex = 0;
    }

    if (frame.Level4 && frame.Level4.length > 0) {
      for (let itemGroup of frame.Level4) {
        if (itemGroup.Level5) {
          for (let item of itemGroup.Level5) {
            if (item.codeOfValues) {
              col[item.apps_item_seqid] = item.codeOfValues
            } else {
              if (item.datatype && item.datatype.toUpperCase() == 'NUMBER') {
                col[item.apps_item_seqid] = item.value ? item.value.toString().replaceAll(',', '') : '';
              } else {
                col[item.apps_item_seqid] = item.value;
              }
            }
          }
        }
      }
    }
    wsdp.push(col);

    wscp = this.generate_wscp(event, wscp);

    let reqData: any = {};
    reqData = {
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": wsdp
    }

    frame.requestData = reqData;
    this.dataService.postData("S2U", reqData).then((res: any) => {
      if (res.responseStatus && res.responseStatus.includes("success")) {
        let objData: any = {};
        if (res.responseStatus.toLowerCase().includes("-rc")) {

          objData.Level1 = this.globalobjects.setPageInfoNoS2U(res.responseData);

        } else {
          objData = this.globalobjects.setPageInfo(res.responseData);
        }
        event.objectData = objData;
      }
      if (frame.ddArrayList && frame.ddArrayList.length > 0 && frame.ddArrayList.length > (count + 1)) {
        count = count + 1;
        this.getDataDD(frame, count);
      } else {
        if (frame.Level4 && frame.Level4.length > 0 && !frame.isExecuting) {
          frame.tableRows = [];
          frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
          this.processData.afterTableRows(frame);
        }
        this.parseBuiltins(frame);
      }

    }).catch(err => {
      console.log(err);
      if (frame.ddArrayList && frame.ddArrayList.length > 0 && frame.ddArrayList.length > (count + 1)) {
        count = count + 1;
        this.getDataDD(frame, count);
      } else {
        if (frame.Level4 && frame.Level4.length > 0 && !frame.isExecuting) {
          frame.tableRows = [];
          frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
          this.processData.afterTableRows(frame);
        }
        this.parseBuiltins(frame);
      }
    })

  }


  multiItemwiseData(frameId, event) {
    let frame = JSON.parse(JSON.stringify(this.lhs_lib.get_frame_config(frameId)));

    let str = "";
    let itm = {}
    if (frame.Level4 && frame.Level4.length > 0) {
      for (let itemData of frame.Level4) {
        if (itemData.Level5) {
          for (let item of itemData.Level5) {
            itm = item;
            if (str) {
              str = str + "," + item.apps_item_seqid;
            } else {
              str = item.apps_item_seqid;
            }
          }
        } else {
          for (let item of itemData) {

            if (str) {
              str = str + "," + item.apps_item_seqid;
            } else {
              str = item.apps_item_seqid;
            }
          }
        }
      }
    }

    if (str) {
      let item = JSON.parse(JSON.stringify(itm));
      item.apps_item_seqid = str;

      this.wscp.apps_item_seqid = item.apps_item_seqid;
      this.wscp.apps_page_frame_seqid = item.apps_page_frame_seqid;
      this.wscp.item_sub_type = item.item_sub_type;
      this.wsdpcl = [];

      this.getData(item, "multi_itemwise_sql_populate_data");
    }
  }



  ora_plsql1_text(event, con) {
    return this.checkCond(con, event)
  }

  ora_plsql2_text(event, con) {
    return this.checkCond(con, event)
  }

  ora_plsql1_text_force(event, con) {
    return this.checkCond(con, event)
  }

  ora_plsql2_text_force(event, con) {
    return this.checkCond(con, event)
  }



  async showDeveloperData(item) {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: item.apps_page_frame_seqid,
      item_seq_id: item.apps_item_seqid
    }
    const modal = await this.modalCtrl.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: item,
        runEvents: item.runEvents
      }
    });
    return await modal.present();
  }
  async checkCond(con, event) {

    let str = "begin " + con + " end;";
    let forStr = this.convert_plsq_js.getConvertedScript(str);
    let convertedVal = this.lhs_lib_util(forStr, event);
    return eval(convertedVal);
  }

  populate_from_procedure(event, str) {
    this.wscp.procedure_name = str;
    this.getData(event, 'populate_from_procedure');
    delete event['executing_apps_page_frame_seqid'];
  }



  // gajs_date_evaluate(parseStr, wma_record_indx) {
  //   let str = parseStr;

  //   let aa = str.split(`:`);
  //   let result;
  //   for (let i = 0; i < aa.length; i++) {
  //     if (aa[i]) {
  //       let last = (aa[i].trim().split(/[*--+//() \t]/));
  //       let tempStr = aa[i];
  //       if (last && last.length > 0 && last[0]) {
  //         let date;
  //         if (last[0].toLowerCase() == 'sysdate') {
  //           date = new Date(new Date().setHours(0, 0, 0, 0));
  //         } else {
  //           let value = this.lhs_lib.get_item_value(last[0], wma_record_indx);
  //           date = new Date(value);
  //         }

  //         let flag = false;
  //         for (let x = 1; x < last.length; x++) {
  //           if (last[x]) {
  //             flag = true;
  //           }
  //         }

  //         if (flag) {
  //           let repVal;
  //           for (let i = last.length - 1; i >= 0; i--) {
  //             if(last[i]){
  //               repVal = last[i];
  //               break;
  //             }
  //           }

  //           if(repVal){
  //             // aa[i] = aa[i].replace(/1$/, 'World!')
  //             aa[i] = aa[i].replace(new RegExp(repVal+"([^"+repVal+"]*)$"), repVal + ")"+"$1");
  //             let s = "new Date('" + eval(date) + "')" + ".setDate(" + eval(date.getDate());
  //             aa[i] = aa[i].replace(last[0], s);
  //           }
  //         } else {
  //           aa[i] = aa[i].replace(last[0], date.getTime());
  //         }
  //       }
  //     }
  //   }
  //   let newStr = aa.join(' ');
  //   console.log(newStr);
  //   try {
  //     console.log(newStr);
  //     result = eval(newStr) / (1000 * 60 * 60 * 24);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   console.log(result);

  // }






  async presentPopover() {
    const popover = await this.popoverController.create({
      component: NewAlertMsgBoxesPage,
      cssClass: "modelalert-box"
    });

    await popover.present();
    const { role } = await popover.onDidDismiss();
    this.roleMsg = `Popover dismissed with role: ${role}`;
  }
  fakeValidateUserData() {
    return of({
      userDate1: 1,
      userData2: 2
    });
  }

  //

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  download_text(event, text: string, fileName: string) {
    console.log("Wrapper - text content:", text);
    console.log("Wrapper - filename:", fileName);
    this.pluginService.download_text(event, text, fileName);
  }

  // download_text(event, text: string, fileName: string) {
  //   // fileName = fileName.replaceAll(" ","_");

  //   fileName = 'file' + JSON.stringify((Math.floor(Math.random() * (999999 - 100000)) + 100000)) + ".txt";
  //   if (!this.setting.element.dynamicDownload) {
  //     this.setting.element.dynamicDownload = document.createElement('a');
  //   }
  //   const element = this.setting.element.dynamicDownload;
  //   const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
  //   element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`);
  //   element.setAttribute('download', fileName);



  //   let file = new Blob([text], { type: 'text/plain' });
  //   // alert(file);
  //   if (this.platform.is("android") || this.platform.is("ios")) {

  //     console.log(fileName);
  //     console.log(JSON.stringify(fileName))

  //     let directoryPath = "";
  //     if (this.platform.is("ios")) {
  //       directoryPath = this.file.documentsDirectory;
  //     }

  //     this.globalobjects.checkStoragePermission().then((res) => {
  //       if (this.platform.is("android")) {
  //         directoryPath = this.file.externalApplicationStorageDirectory.split("Android")[0] + "/Download/";
  //         // alert(directoryPath)
  //       }


  //       this.file.writeFile(directoryPath, fileName, file, { replace: true, append: false })
  //         .then(fileEntry => {
  //           // alert(fileName)
  //           // alert('file')
  //           this.globalobjects.displayCordovaToast("Download complete...");
  //           if (fileEntry) {
  //             // alert('directoryPath')
  //             // console.log('directoryPath')
  //             if (fileEntry.isFile) {
  //               this.globalobjects.displayCordovaToast("File Generated");
  //               // alert('file1')
  //             }

  //             this.file.checkFile(directoryPath, fileName).then((exist => {
  //               // alert(exist)
  //               this.filePath.resolveNativePath(directoryPath + fileName).then((pathIs => {
  //               }));
  //               if (this.plt.is("ios")) {
  //                 this.document.viewDocument(directoryPath + fileName, 'text/plain', {});
  //               } else {
  //                 // let mimetype = 'application/pdf';
  //                 // this.fileOpener.open(directoryPath + fileName, mimetype)
  //                 //   .then((exist) => console.log('File is opened' + JSON.stringify(exist)))
  //                 //   .catch(e => this.presentAlert("file is" + JSON.stringify(e)));
  //               }
  //             })
  //             ).catch(err => {
  //               // this.globalobjects.presentAlert('Directory' + JSON.stringify(err));
  //             });
  //           }
  //         })
  //         .catch(err => {
  //           this.globalobjects.presentAlert(JSON.stringify(err));
  //         });

  //     });
  //   } else {
  //     saveAs(file, fileName);
  //     var events = new MouseEvent("click");
  //     element.dispatchEvent(events);
  //   }
  // }




  // getexceldetail(event) {
  //   return new Promise((resolve, reject) => {
  //     let head = [];
  //     let body = [];
  //     let tableBody = [];
  //     let datas: any = {};

  //     let data = [];

  //     const target: DataTransfer = <DataTransfer>(event);
  //     if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  //     const reader: FileReader = new FileReader();
  //     // reader.readAsBinaryString(target.files[0]);
  //     reader.onload = (e: any) => {
  //       /* read workbook */
  //       const bstr: string = e.target.result;
  //       const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //       /* grab first sheet */
  //       const wsname: string = wb.SheetNames[0];
  //       const ws: XLSX.WorkSheet = wb.Sheets[wsname];

  //       /* save data */
  //       data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
  //       console.log(data);

  //       let rows = data

  //       for (let i of rows[0]) {
  //         head.push(i);
  //       }
  //       body = rows;
  //       body.shift();

  //       for (let b of body) {
  //         let obj = {};
  //         for (let j = 0; j < b.length; j++) {
  //           obj[head[j]] = b[j] != undefined ? b[j].toString() : "";
  //         }
  //         tableBody.push(obj);
  //       }
  //       if (tableBody) {
  //         datas.head = JSON.parse(JSON.stringify(head))
  //         datas.tableBody = JSON.parse(JSON.stringify(tableBody));
  //         resolve(datas);
  //       }
  //     };

  //     reader.readAsBinaryString(target.files[0]);
  //   });






  //   // let type = file.name.split(".")[1];

  //   // if (type == 'xlsx') {
  //   //   readXlsxFile(file).then((rows) => {
  //   //     for (let i of rows[0]) {
  //   //       head.push(i);
  //   //     }
  //   //     body = rows;
  //   //     body.shift();

  //   //     for (let j of body) {
  //   //       tableBody.push(j);
  //   //     }
  //   //     if (tableBody) {
  //   //       data.head = JSON.parse(JSON.stringify(head))
  //   //       data.tableBody = JSON.parse(JSON.stringify(tableBody));
  //   //       resolve(data);
  //   //     }
  //   //   }, error => {
  //   //     reject(error)
  //   //   });
  //   // } else {
  //   //   let linesR = [];
  //   //   let lines = [];
  //   //   let reader: FileReader = new FileReader();
  //   //   reader.readAsBinaryString(file);
  //   //   reader.onload = (e) => {
  //   //     let csv: any = reader.result;
  //   //     let allTextLines = [];
  //   //     let allTextLinesPre = [];
  //   //     allTextLinesPre = csv.split(/\r|\n|\r/);

  //   //     for (let a of allTextLinesPre) {
  //   //       if (a) {
  //   //         allTextLines.push(a);
  //   //       }
  //   //     }

  //   //     //Table Headings
  //   //     let headers = allTextLines[0].split(';');
  //   //     let data = headers;
  //   //     let arr2 = [];
  //   //     for (let j = 0; j < headers.length; j++) {
  //   //       let arr = data[j].split(",");
  //   //       arr2.push(arr);
  //   //     }
  //   //     lines = arr2[0];
  //   //     //Pusd headings to array variable

  //   //     // Table Rows
  //   //     let arrl = allTextLines.length;
  //   //     for (let i = 1; i < arrl; i++) {
  //   //       if (allTextLines[i]) {
  //   //         let str = allTextLines[i].split(';');
  //   //         for (let s of str) {
  //   //           linesR.push(s.split(","));
  //   //         }
  //   //       }
  //   //     }

  //   //     // for (let j = 0; j < arrl-1; j++) {
  //   //     //   tarrR.push(rows[j]);
  //   //     // }
  //   //     //Push rows to array variable
  //   //     let datas: any = {};
  //   //     datas.head = JSON.parse(JSON.stringify(lines))
  //   //     datas.tableBody = JSON.parse(JSON.stringify(linesR));
  //   //     resolve(datas);
  //   //   }
  //   // }



  // }

  clearLog() {
    this.globalobjects.excuted_events_logs = [];
  }



  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  isPageBack = false
  ngOnDestroy() {
    // if (this.messageListener) {
    //   window.removeEventListener('message', this.messageListener);
    // }
    // this.processData.stopProcessing();

    if (this.resizeHandler) {
      if (isPlatformServer(this.platformId)) return;
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }



    this.events.unsubscribe("verifyOtp");
    this.events.unsubscribe("pageName");
    this.events.unsubscribe("goToSuper");
    this.events.unsubscribe("checkGps");
    this.events.unsubscribe("jumptosuper");
    this.events.unsubscribe("refreshOnViewChange");
    this.events.unsubscribe("execute_item_events");
    this.events.unsubscribe("refreshOnViewChangeBypass");
    this.events.unsubscribe('menuClick');
    this.events.unsubscribe("openQueryParamObj");
    this.events.unsubscribe("");
    this.events.unsubscribe('clearEvent');
    this.events.unsubscribe("refresh_app");
    this.events.unsubscribe("open_object");

    // this.routeSub.unsubscribe();
    this.visibilitySubscription.unsubscribe();
    if (this.isModal != 'P') {
    } else {
      this.isModal = "Menu";
    }
    this.events.unsubscribe(`noDissmiss`);
    // this.events.unsubscribe(`noDissmiss#${this.wscp.object_code}${this.superId ? '#' + this.superId : ''}`);
    if (!this.openCanvas) {
      this.unSubscribeSuperParent()
    }
    this.events.unsubscribe("DISPLAY_PHOTO");
    this.events.unsubscribe("GET_SIDE_MENU_DATA");
    // this.events.unsubscribe("clearEvent");
    this.events.unsubscribe("checkToggle");

    this.events.unsubscribe("deleteLocal");
    this.events.unsubscribe("destroy");
    this.events.unsubscribe("entity_code_str");
    this.events.unsubscribe("entity_name");
    this.events.unsubscribe("execute_item_events");
    this.events.unsubscribe("fabMannualMode");
    this.events.unsubscribe("getsidmenulist");
    this.events.unsubscribe("goToSuper");
    // this.events.unsubscribe("logOut");
    this.events.unsubscribe("notiBellMannualMode");
    this.events.unsubscribe("openQueryParamObj");
    this.events.unsubscribe("refreshLocal");
    this.events.unsubscribe("setappkeyInfoVisibility");
    this.events.unsubscribe("sideBarMenu");
    this.events.unsubscribe("skipFilter");
    this.events.unsubscribe("toggleFab");
    this.events.unsubscribe("toggleNotification");
    this.events.unsubscribe("verifyOtp");
    if (isPlatformServer(this.platformId)) return
    // window.removeEventListener('resize', this.resizeHandler);
    this.events.unsubscribe('undefined')
    this.events.unsubscribe('refreshFrame_cartSummaryPlain');
    let objCode = this.wscp.object_code
    if (this.page_no > 0) {
      objCode = `${this.object_mast.object_code}#${this.page_no}`
    }
    this.events.unsubscribe(`noDissmiss#${objCode}${this.superId ? '#' + this.superId : ''}`);
    this.events.unsubscribe(`developerEvent${objCode}${this.superId ? '#' + this.superId : ''}`)
    // supercomp = null;
    // utilvar = null;

    // if(this.page_no == 0){
    //   this.object_mast=null;
    //  this.object_arr=null;
    // }

    if (!this.globalobjects.toggleDevloperMode()) {
      console.clear();
    }
    // For memory leak issue
    if (window['supercomp'] === this) {
      window['supercomp'] = null;
    }
    if (window['utilvar'] === this) {
      window['utilvar'] = null;
    }
  }

  afterDestroy() {
    this.lhs_lib.object_mast = this.object_mast;

    this.globalobjects.currentPageNo--;
    this.globalobjects.devItemEditFlag = true;
    this.globalobjects.clickedbutton = false;
    this.globalobjects.previousCallObj = "";
    this.globalobjects.summaryCartdeatail = [];
    this.wscp.local_Item_Seq_Id = null;
    this.wscp.apps_item_seqid = null;
    this.globalobjects.devItemName = {};
    this.globalobjects.devItemIcon = "";

    this.clearQue();


    this.globalobjects.breadCrumpsArray.pop();

    if (this.globalobjects.logout) {
      this.closeAllModal();
      this.globalobjects.backObjectCode = "";
    } else if (this.globalobjects.navigateParam && this.globalobjects.breadCrumpsBackPageNo < this.globalobjects.currentPageNo) {
      // this.modalCtrl.dismiss();
      // this.lhs_lib.closeBreadCrumb = true
      this.triggerClickEvent()
    } else {
      if (this.globalobjects.backObjectCode) {
        if (this.globalobjects.backObjectCode == this.object_mast.object_code) {
          this.globalobjects.backObjectCode = "";
          this.app_add_para_back_process();
        } else {
          try {

            if (this.page_no == 0) {
              this.destroyed = true;
              if (this.globalobjects.backObjectCode == this.object_mast.object_code || this.globalobjects.backObjectCode == "back") {
                this.globalobjects.backObjectCode = "";
              }
            }

            // this.modalCtrl.dismiss();
            // this.lhs_lib.closeBreadCrumb = true
            // this.triggerClickEvent()
            // this.breadCrumpClose();
            if (this.isModal == "M" || this.isModal == "Menu") {
              this.triggerClickEvent();
              this.breadCrumpClose();
            } else if (this.isModal == "O") {
              this.offCanvasClick()
            } else if (this.isModal == "P") {
              this.modalClick()
            }

          } catch (e) {
            this.globalobjects.callingParameterBack = [];
            this.globalobjects.backObjectCode = "";
          }
        }
      } else if (this.globalobjects.pageNo) {
        if (this.page_no == (this.globalobjects.pageNo - 1)) {
          this.globalobjects.pageNo = "";
        } else {
          if (this.page_no == 0) {
            this.globalobjects.pageNo = "";
          }

          if (this.isModal == "M" || this.isModal == "Menu") {
            this.triggerClickEvent();
            this.breadCrumpClose();
          } else if (this.isModal == "O") {
            this.offCanvasClick()
          } else if (this.isModal == "P") {
            this.modalClick()
          }
          //  this.triggerClickEvent()
          //   this.breadCrumpClose();
        }
      } else if (this.globalobjects.reloadObjectFlag) {
        if (this.page_no == 0) {
          this.globalobjects.reloadObjectFlag = false
        }
        this.refreshObjFab()
      } else {
        this.app_add_para_back_process();
      }
    }

    let name = "sys_back_page" + (this.page_no + 1);
    let item = this.lhs_lib.get_item(name, 0);
    if (item) {
      this.app_execute_item(item, name, "click_events_str");
    }
    // supercomp = this;
    // utilvar = this;
  }


  // async openMultiplePopovers() {
  //   for (let popoverData of this.popoverData) {
  //     const popover = await this.popoverController.create({
  //       component: MsgBoxPage,
  //       componentProps: {
  //         data: popoverData
  //       }
  //     });

  //     await popover.present();
  //   }
  // }

  openPopup() {
    let id = this.popoverId++;
    //  this.openPopover(id);
    //  this.closePopover(id);
  }


  // togglePopover(index: number) {
  //   this.popoverStates[index] = !this.popoverStates[index];
  // }

  // openPopover(index: number) {
  //   console.log(index)
  //   this.popoverStates[index] = true;
  // }

  // closePopover(index: number) {
  //   this.popoverStates[index] = false;
  // }


  openPopover(index: number) {
    this.popoverStates[index] = true;
    this.popoverReferences[index].present();
  }

  closePopover(index: number) {
    this.popoverStates[index] = false;
    this.popoverReferences[index].dismiss();

  }

  async_a(item, event_str) {

    const supercomp=this
    let eventArr = event_str ? (event_str.includes(";") ? event_str.trim().split(";") : [event_str]) : [];
    const pattern = /^"(.*)"$/;
    for (let e of eventArr) {
      if (e) {
        let event = JSON.parse(JSON.stringify(item));

        let str = e.replaceAll("#", ';').replaceAll("supercomp?.", "").replaceAll("supercomp.", "");
        // event.click_events_arr = [str];
        // event.click_events_count = 0;
        // this.itemClicked1(event, event_str);
        // this.itemClicked_new(event, [str],null,null,true);
        this.call_async_clicked(event, [str], null, null)
        // eval(str.replaceAll("await",""));
      }
    }

  }

  async async_s(item, event_str): Promise<any> {

    let eventArr = event_str ? (event_str.includes(";") ? event_str.trim().split(";") : [event_str]) : [];
    const pattern = /^"(.*)"$/;
    // for (let e of eventArr) {
    //   if (e) {
    //     let event = JSON.parse(JSON.stringify(item));
    //     let str = e.replaceAll("#", ';');
    //     event.click_events_arr = [str];
    //     event.click_events_count = 0;
    //     this.itemClicked1(event, event_str);
    //     // eval(str.replaceAll("await",""));
    //   }
    // }

    const promises = eventArr.map(call => {
      const supercomp=this
      let match = this.lhs_lib_util(call, item);
      if (match) {
        match = match.replaceAll("await", "").replaceAll("this.", 'supercomp.').trim(); // Extract frameId and action
        return eval(match); // Dynamically call the function
      } else {
        return Promise.reject(`Invalid function call: ${call}`);
      }
    });
    await Promise.allSettled(promises).then((res) => {
      console.log(res);
    })

  }

  app_back_object(event, objCode) {

    this.back_page_calling_para(event, objCode);
    if (objCode) {
      this.globalobjects.backObjectCode = objCode;

      // if (this.isModal == "M" || this.isModal == "Menu") {
      //   this.triggerClickEvent();
      //   this.breadCrumpClose();
      // }
      // else if (this.isModal == "O") {
      //   this.offCanvasClick()
      // } else if (this.isModal == "P") {
      //   this.modalClick()
      // }

    } else {
      // alert("Please give parameter object code");
      this.globalobjects.backObjectCode = "back";
      // this.canvasModal.popDismiss()
      // this.breadCrumpClose()

      // this.modalCtrl.dismiss();
    }
    this.dismissObject()

  }

  dismissObject() {
    clearInterval(this.timerFunc);
    this.dataService.terminateAllRequest();
    if (this.object_mast && this.object_mast.timerObj && this.page_no == 0) {
      let i = 0;
      let arr = JSON.parse(JSON.stringify(this.globalobjects.timerEvents));
      for (let x = 0; x < this.globalobjects.timerEvents.length; x++) {
        if (arr[i].object_code == this.object_mast.object_code && arr[i].runEvFlag == true) {
          arr.splice(i, 1);
          i--;
        }
        i++;
      }
    }
    if (this.isModal == "M" || this.isModal == "Menu") {
      this.triggerClickEvent();
      this.breadCrumpClose();
    }
    else if (this.isModal == "O") {
      this.offCanvasClick()
    } else if (this.isModal == "P") {
      this.modalClick()
    }
    this.removeFrameStyle()
  }

  demoPop() {
    id: "cwarning-new";
    //this.popover.event = e;
    this.isOpen = true;
  }

  presentPopoverOTP() {
    id: "new-otppopover";
    this.isOpen = true;
  }

  closePop(event, item) {
    this.isOpen = false;
  }

  populate_list(event, itemName) {
    let item;
    if (itemName) {
      this.lhs_lib.set_item_config(itemName, "on_load_events_str", "populate_list()", event.itemIndex);
      if (itemName.indexOf(".") > -1) {
        item = itemName.split(".")[1];
      } else {
        item = itemName;
      }
    } else {
      item = event.apps_item_seqid;
    }
    this.refreshItem(item, event, '');
  }

  populate_list_force(event, itemName) {

    let item;
    if (itemName) {
      this.lhs_lib.set_item_config(itemName, "on_load_events_str", "populate_list()", event.itemIndex);
      if (itemName.indexOf(".") > -1) {
        item = itemName.split(".")[1];
      } else {
        item = itemName;
      }
    } else {
      item = event.apps_item_seqid;
    }

    this.refreshItem(item, event, 'force');
  }





  openForm($tabs) {
    const targetElement = this.el.nativeElement.querySelector('#' + $tabs + '.frame-box-area-tabs');

    //const targetElement1 = this.el.nativeElement.querySelector('#'+$tabs +' > .app-frame-canvas');
    if (targetElement) {
      const allTabs = this.el.nativeElement.querySelectorAll('.frame-box-area-tabs');
      // const allTab = this.el.nativeElement.parent('.frame-head' );
      // const childDiv = parentDivElement.querySelector('#childDiv');
      allTabs.forEach(tab => {

        if (tab === targetElement) {
          this.ren.setStyle(tab, 'display', 'block');
          this.ren.setStyle(tab, 'position', 'absolute');
          //this.ren.setStyle(tab, 'height', '100%');
          //  this.ren.setStyle(tab, 'width', '100%');    
          this.ren.setStyle(tab, 'margin-top', '2%');


        } else {
          this.ren.setStyle(tab, 'display', 'none');
          // this.ren.setStyle(tab, 'height', '0');
          //this.ren.setStyle(tab, 'width', '0');
        }
      });
    }
  }
  server_host(param) {
    // let param = event.click_events_arr[event.click_events_count].split("(")[1].split(")")[0];
    var scopurl = this.globalobjects.getLocallData("scopeUrl");
    // var protocol = scopurl.split("//")[0];
    // var domain = scopurl.split("//")[1].split("/")[0].split(":")[0];

    const controller = new AbortController();

    // Obtain a reference to the AbortSignal
    const signal = controller.signal;
    var url = scopurl + "openCommandLineWithCommand?command=" + param;
    let data = fetch(encodeURI(url), { signal });
    setTimeout(() => {
      controller.abort();
    }, 2000);
    console.log(data);
  }

  local_host(param) {
    // let param = event.click_events_arr[event.click_events_count].split("(")[1].split(")")[0];
    let url = "http://localhost:8151/openCommandLineWithCommand?command=" + param;
    let data = fetch(encodeURI(url));
    console.log(data);
  }

  clearQue() {
    this.clickEvent ? delete this.clickEvent['isJsRunning'] : '';
    this.clickEvent ? delete this.clickEvent['opening_object'] : "";
    this.clickEvent = "";

    this.event_que_arr = [];
    this.isEventRunning = false;
    this.lhs_lib.refresh_frames();
    if (!this.globalobjects.isGetObjectConfig()) {
      this.globalobjects.hide_event_loading();
    }
    this.globalobjects.isNotOpenTab.set(false)
    if (this.globalobjects.loading_on_demand()) {
      this.globalobjects.stop_loading_side();
    }

  }

  // ws_open_url(event, param) {
  //   // let param = event.click_events_arr[event.click_events_count].split("(")[1].split(")")[0];
  //   let url = this.lhs_lib.get_item_value(param, 0);
  //   let windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
  //   if (isPlatformServer(this.platformId)) return;
  //   window.open(url, '_blank', windowFeatures);
  // }


  async ws_open_url(event: any, param: any) {


    const url = this.lhs_lib.get_item_value(param, 0);


    if (!url || isPlatformServer(this.platformId)) {
      return;
    }


    if (Capacitor.isNativePlatform()) {
      await Browser.open({
        url: url
      });
    } else {
      window.open(url, '_blank');
    }
  }





  async ws_call_url(event, param) {
    // let param = event.click_events_arr[event.click_events_count].split("(")[1].split(")")[0];
    let url = this.lhs_lib.get_item_value(param, 0);

    try {
      let data = await fetch(encodeURI(url));
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }



  //   toggleMenu(){
  // //     this.model = !this.model;
  // //    const container = document.getElementById('main1');
  // //    const container1 = document.getElementById('main2');
  // //         if(this.toggleMenucount%2==0){

  // //           this.shouldHideDiv=true;
  // //           this.toggleMenucount=1;
  // //            if(container?.classList){
  // //             container.classList.remove("main");
  // //            }
  // //            if(container1?.classList){
  // //             container1.classList.remove("shrinkMyscreen-main");
  // //            }
  // // this.toggleMenucount=1;
  // //         }else{
  // //           this.shouldHideDiv=false;
  // //           this.toggleMenucount=0;
  //           if(container?.classList){
  //             container.classList.add("main");
  //            }
  //            if(container1?.classList){
  //             container1.classList.add("shrinkMyscreen-main");

  //            }

  //         }
  // }

  toggleMenucount: any = 0;
  toggleCondition() {
    const container = document.getElementById('main1');
    const container1 = document.getElementById('sreenWidth');
    if (this.model = !this.model) {
      // this.shouldHideDiv=true;

      this.toggleMenucount = 0;
      //  if(container?.classList){
      //    container.classList.add("main");
      //   }
      if (container1?.classList) {
        container1.classList.add("shrinkMyscreen-main");

      }
      //  document.getElementById("main2").style.marginLeft= "350px";
      //  document.getElementById("main1").style.width= "351px";
    } else {
      //this.shouldHideDiv=false;
      this.toggleMenucount = 1;
      if (container?.classList) {
        // container.classList.remove("main");
        container.classList.add("leftmain");
      }
      if (container1?.classList) {
        container1.classList.remove("shrinkMyscreen-main");

      }
      //  document.getElementById("main2").style.marginLeft= "0px";
      //  document.getElementById("main1").style.width= "0px";
    }
  }


  toggleConditionln() {
    const container = document.getElementById('main1');
    const container1 = document.getElementById('sreenWidth');
    if (this.model = !this.model) {
      // this.shouldHideDiv=true;

      this.toggleMenucount = 0;
      //  if(container?.classList){
      //    container.classList.add("main");
      //   }
      if (container1?.classList) {
        container1.classList.add("shrinkMyscreen-main");

      }
      //  document.getElementById("main2").style.marginLeft= "350px";
      //  document.getElementById("main1").style.width= "351px";
    } else {
      //this.shouldHideDiv=false;
      this.toggleMenucount = 1;
      if (container?.classList) {
        // container.classList.remove("main");
        container.classList.add("leftmain");
      }
      if (container1?.classList) {
        container1.classList.remove("shrinkMyscreen-main");

      }
      //  document.getElementById("main2").style.marginLeft= "0px";
      //  document.getElementById("main1").style.width= "0px";
    }
  }

  setSsType(objMast) {
    for (let object of objMast.Level2) {
      for (let frame of object.Level3) {
        if (frame.apps_frame_type_ss) {
          frame.apps_frame_type = frame.apps_frame_type_ss;
        }

        if (frame.apps_frame_sub_type_ss) {
          frame.apps_frame_sub_type = frame.apps_frame_sub_type_ss
        }

        if (frame.design_control_type_ss) {
          frame.design_control_type = frame.design_control_type_ss;
        }
        for (let itemGroup of frame.Level4) {
          for (let item of itemGroup.Level5) {
            if (item.parent_item_seqid_ss) {
              item.parent_item_seqid = item.parent_item_seqid_ss
            }
            if (item.item_type_ss) {
              item.item_type = item.item_type_ss
            }

            if (item.item_sub_type_ss) {
              item.item_sub_type = item.item_sub_type_ss
            }

            if (item.design_control_type_ss) {
              item.design_control_type = item.design_control_type_ss;
            }
          }

        }
      }
    }

    return objMast;
  }


  locked($tabs) {
    var i: any;
    if ($tabs >= 1) {
      for (i = 1; i <= $tabs; i++) {
        const container = document.getElementById('thead' + i);

        console.log(container);
        container.classList.add("fixed-column");

        const targetElement1 = this.el.nativeElement.querySelector('#resizable-table table tbody > tr td:nth-child(' + i + ')');

        if (targetElement1) {
          container.classList.add("fixed-column");
          const allTabs = this.el.nativeElement.querySelectorAll('#resizable-table table tr td:nth-child(' + i + ')');
          console.log(allTabs);
          // const allTab = this.el.nativeElement.parent('.frame-head' );
          // const childDiv = parentDivElement.querySelector('#childDiv');
          allTabs.forEach(tab => {
            console.log(1);
            tab.classList.add("fixed-column");//important to fixed the class name of td
            // if (tab === targetElement1) {
            //   this.ren.setStyle(tab, 'position', 'sticky'); 
            //   this.ren.setStyle(tab, 'width', '200px'); 
            //   this.ren.setStyle(tab, 'z-index', '11'); 
            //   this.ren.setStyle(tab, 'left', '0'); 
            //   this.ren.setStyle(tab, 'background', '#949494'); 
            //   this.ren.setStyle(tab, 'position', 'absolute');
            //   //this.ren.setStyle(tab, 'height', '100%');
            // //  this.ren.setStyle(tab, 'width', '100%');    

            // } 
          });
        }
      }
    }

    var i: any;
    //$tabs=3;
    if ($tabs > '1') {


      for (i = 2; i <= $tabs; i++) {
        const container1 = document.getElementById('thead' + i);
        container1.classList.add("fixed-column");
        let $margin = 2 * (i - 1);//2*
        let value = container1.style.left = $margin + '00px';

        console.log($margin);
        const targetElement = this.el.nativeElement.querySelector('#resizable-table table tr td:nth-child(' + i + ')');
        if (targetElement) {
          container1.classList.add("fixed-column");
          const allTabs = this.el.nativeElement.querySelectorAll('#resizable-table table tr td:nth-child(' + i + ')');
          // const allTab = this.el.nativeElement.parent('.frame-head' );
          // const childDiv = parentDivElement.querySelector('#childDiv');
          allTabs.forEach(tab => {
            this.ren.setStyle(tab, 'left', value);
          });
        }

      }

    }

  }

  unlocked() {
    var i: any;
    var $tabs = 10;
    if ($tabs >= 1) {
      for (i = 1; i <= $tabs; i++) {
        const container = document.getElementById('thead' + i);

        console.log(container);
        container.classList.remove("fixed-column");

        const targetElement1 = this.el.nativeElement.querySelector('#resizable-table table tbody > tr td:nth-child(' + i + ')');

        if (targetElement1) {
          container.classList.remove("fixed-column");
          const allTabs = this.el.nativeElement.querySelectorAll('#resizable-table table tr td:nth-child(' + i + ')');
          console.log(allTabs);
          allTabs.forEach(tab => {
            console.log(1);
            tab.classList.remove("fixed-column");//important to fixed the class name of td
          });

        }

      }
    }
    var i: any;
    //$tabs=3;
    if ($tabs > 1) {


      for (i = 2; i <= $tabs; i++) {
        const container1 = document.getElementById('thead' + i);
        container1.classList.remove("fixed-column");
        let value = container1.style.left = 'auto';

        const targetElement = this.el.nativeElement.querySelector('td:nth-child(' + i + ')');
        if (targetElement) {
          container1.classList.remove("fixed-column");
          const allTabs = this.el.nativeElement.querySelectorAll('td:nth-child(' + i + ')');
          // const allTab = this.el.nativeElement.parent('.frame-head' );
          // const childDiv = parentDivElement.querySelector('#childDiv');
          allTabs.forEach(tab => {
            this.ren.setStyle(tab, 'left', value);
          });
        }

      }

    }



  }


  searchlistPopover() {
    this.isOpen = true;
  }

  search_listboxPopover() {
    this.isOpen = true;
  }


  async me1(ev: any) {
    let datas;
    console
    const popover = await this.popoverController.create({
      component: GlobalSerachComponent,
      //cssClass: 'search_list-bar-btn',
      id: 'search_list-bar',
      event: ev,
      translucent: true,
      side: right,
      componentProps: { value: 123, otherValue: 234 }

    });
    await popover.present();
  }

  async AdminNew(ev: any) {
    let datas;
    console
    const popover = await this.popoverController.create({
      component: UserLoginComponent,
      //cssClass: 'search_list-bar-btn',
      id: 'userLogin_menubar',
      event: ev,
      translucent: true,
      side: right,
      componentProps: { value: 123, otherValue: 234 }

    });
    await popover.present();
  }

  UserRole(event: any) {
    let component = UserRoleComponentComponent
    let componentProps = ""
    let id = "userrole_menubar"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((value) => {
      // alert("user role");
      if (value) {
        // this.wsdpcl=this.lhs_lib.getDpcl();
        this.itemClicked(value.data);
      }
    })
  }



  // shortCutKey(event: any) {
  //   let component = ShortcutKeyComponent
  //   let componentProps = ""
  //   let id = "shortcutkey"
  //   let cssClass = ""
  //   this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((value) => {
  //     // alert("user role");
  //     if (value) {
  //       // this.wsdpcl=this.lhs_lib.getDpcl();
  //       this.itemClicked(value.data);
  //     }
  //   })
  // }


  // async UserRole(ev: any) {
  //   let datas;
  //   console
  //   const popover = await this.popoverController.create({
  //     component: UserRoleComponentComponent,
  //     //cssClass: 'search_list-bar-btn',
  //     id: 'userrole_menubar',
  //     event: ev,
  //     translucent: true,
  //     side: right,
  //     componentProps: { value: 123, otherValue: 234 }

  //   });
  //   await popover.present();
  // }

  async Treemenu(ev: any) {
    let datas;
    const popover = await this.popoverController.create({
      component: FrameTreeMenuComponent,
      //cssClass: 'search_list-bar-btn',
      id: 'treemenu_menubar',
      event: ev,
      translucent: true,
      side: right,
      componentProps: { value: this.frame }

    });
    await popover.present();
  }

  async get_ref_cursor(event, type, proc, name): Promise<any> {
    let frame;
    if (type.toLowerCase() == 'frame') {
      frame = await this.lhs_lib.get_frame_config(name);
      frame.loading = true;
    }
    let str = "";

    if (type.toUpperCase() == 'LOV') {
      while (proc.includes(":")) {
        proc = proc.replaceAll("&", ":");
        proc = this.lhs_lib.bindColonValue(proc.replace(/\n/g, " "), 0, 100);
      }
      str = proc;
    } else {

      let from;
      let to;

      if (frame) {
        if (frame.to_record != undefined) {
          from = frame.to_record + 1;
          to = frame.to_record + 50;
        } else {
          from = 1;
          to = 50;
        }
      }
      str = this.lhs_lib.bindColonValue(proc, from, to);
    }

    let url = 'getRefCursor?Procname=' + encodeURIComponent(str);
    await this.dataService.getData(url).then(async (data: any) => {
      console.log(data.responseData);
      if (data.responseStatus == "success") {

        if (type.toUpperCase() == 'LOV') {
          let p_head = this.lhs_lib.get_item_value('P_LOV_HEADER', 0);
          data.responseData[0] = p_head ? p_head.split(",") : [];
          let tableData = this.globalobjects.setPageInfoNoS2U(data.responseData);
          let item = this.lhs_lib.get_item(name, 'current_index');



          let head = p_head ? p_head.split(",") : [];
          // tableData = tableData.slice(1, tableData.length);

          let headArr = [];
          for (let code of head) {
            let data = {
              th: code.split("~")[0],
              code: code
            }
            headArr.push(data)
          }

          item.head = head.reduce((a, v) => ({ ...a, [v]: "" }), {});
          item.objectList = tableData;
          this.open_lov(item);

        } else {

          frame.loading = false;
          let tableData = this.globalobjects.setPageInfoNoS2U(data.responseData);
          if (tableData && tableData.length > 0 && tableData[0].status == 'J') {
            await this.generatAllFrameJson(tableData, event);
            // return;
          } else {
            // let frame = this.lhs_lib.get_frame_config(name);
            frame.tableData = tableData
            await this.processData.populateRows(name, tableData);
            // this.ngZone.run(() => {
            //   this.cdr.detectChanges()
            // })
            // return;
          }

          // if (event.click_events_arr) {
          //   if (event.click_events_arr.length > (event.click_events_count + 1)) {
          //     event.click_events_count = event.click_events_count + 1;
          //     this.itemClicked1(event, "");
          //   }
          // }
        }

      } else if (!data.responseData) {
        frame.loading = false;
        frame.tableData = []
        await this.processData.populateRows(name, frame.tableData);
      }

    }).catch(error => {
      console.error(error);
      return;
    });
  }


  next_iud_seqid() {
    let iudId = this.globalobjects.getLocallData('iudLocal');
    if (iudId) {
      this.globalobjects.setDataLocally('iudLocal', (iudId + 1));
    } else {
      this.globalobjects.setDataLocally('iudLocal', 1);
    }
    iudId = this.globalobjects.getLocallData('iudLocal');
    this.object_mast.iud_seqid = this.globalobjects.userDetails.login_session_id + iudId;
    this.lhs_lib.set_item_value({}, 'p_user_option_iud_seqid', 0, this.object_mast.iud_seqid);
  }


  onCheckboxChange(event, position) {
    console.log(event.target.checked);
    console.log(position);

    var i: any = position;
    if (event.target.checked == true && position != '') {
      console.log("mai aaya");
      if (i > 1) {
        const targetElement1 = this.el.nativeElement.querySelector('#colposition table tbody > tr td:nth-child(' + i + ')');
        const targetElement2 = this.el.nativeElement.querySelector('#colposition table thead > tr th:nth-child(' + i + ')');
        if (targetElement1 && targetElement2) {
          const allTabs = this.el.nativeElement.querySelectorAll('#colposition table tr td:nth-child(' + i + ')');
          const allTabs1 = this.el.nativeElement.querySelectorAll('#colposition table tr th:nth-child(' + i + ')');

          allTabs.forEach(tab => {
            this.ren.setStyle(tab, 'display', 'none');
          });
          allTabs1.forEach(tab1 => {
            this.ren.setStyle(tab1, 'display', 'none');
          });
        }
      }

    }
    else {
      if (event.target.checked == false && position != '') {
        if (i > 1) {
          const targetElement1 = this.el.nativeElement.querySelector('#colposition table tbody > tr td:nth-child(' + i + ')');
          const targetElement2 = this.el.nativeElement.querySelector('#colposition table thead > tr th:nth-child(' + i + ')');
          if (targetElement1 && targetElement2) {
            const allTabs = this.el.nativeElement.querySelectorAll('#colposition table tr td:nth-child(' + i + ')');
            const allTabs1 = this.el.nativeElement.querySelectorAll('#colposition table tr th:nth-child(' + i + ')');

            allTabs.forEach(tab => {
              this.ren.setStyle(tab, 'display', 'revert');
            });
            allTabs1.forEach(tab1 => {
              this.ren.setStyle(tab1, 'display', 'revert');
            });
          }
        }
      }
    }
    // console.log('Checkbox value:', this.isChecked);
    // console.log('Checkbox Position:', $position);
    // You can perform additional actions based on the checkbox state her
  }



  // running(tabledata) {
  //   if (!tabledata) {
  //     return { big: 'none', small: 'none' };
  //   }
  //   let i = 1;

  //   for (let [index, framedata] of tabledata.entries()) {
  //     if (index != 0) {
  //       for (let itemGroup of framedata.Level5) {
  //         if (itemGroup.item_visible_flag == "T") {
  //           i++;
  //         }
  //       }
  //     }
  //   }
  //   if (i > 3) {
  //     return { big: 'inline-flex', small: 'inline-flex' };
  //   } else if (tabledata.length > 0) {
  //     return { big: 'none', small: 'inline-flex' };
  //   } else {
  //     return { big: 'none', small: 'none' };
  //   }
  // }


  running(tabledata) {
    if (!tabledata) {
      return { big: 'none', small: 'none' };
    }
    let i = 0;

    for (let [index, framedata] of tabledata.entries()) {
      if (index > 0) {
        for (let itemGroup of framedata.Level5) {
          if (itemGroup.item_visible_flag == "T") {
            i++;
          }
        }
      } else {
        for (let itemGroup of framedata.Level5) {
          if (itemGroup.item_visible_flag == "T") {
            i++;
            break;
          }
        }
      }
    }
    if (!this.plt) {
      if (i == 0) {
        return { small: 'none !important' }
      }
    }
    // if (i > 2) {
    //   return { big: 'inline-flex', small: 'inline-flex' };
    // } else if (tabledata.length > 0) {
    //   return { big: 'none', small: 'inline-flex' };
    // } else {
    //   return { big: 'none', small: 'none' };
    // }
  }

  QuickActionModal(event, frame?) {
    let component = QuickActionModalComponent
    let componentProps = { frame }
    let id = "quickactionmodel"
    let cssClass = "maction_modal"
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((detail) => {
      console.log(detail)
      console.log('1');
      this.itemClicked(detail.data)
    })
  }


  filterModal(event, frame) {
    let component = FrameObjectfilterComponent
    let code = `${this.wscp.object_code}${this.superId ? '#' + this.superId : ''}`
    frame.subScribeCode = code
    let componentProps = { frame }
    let id = "filter-frame-ln"
    let cssClass = ""

    this.modalGlobal.openModal(component, componentProps, id, '', cssClass).then((value) => {
      if (value && value.data) {
        this.itemClicked(value.data);
      }
    })
  }
  // searchGlobal() {
  //   let component = SerchNewGlobalComponent
  //   let componentProps = ""
  //   let id = "searchgmodel"
  //   let cssClass = ""
  //   this.modalGlobal.openModal(component, componentProps, id, "", cssClass)
  // }

  async searchGlobal(ev: any) {
    let datas;
    console
    const popover = await this.popoverController.create({
      component: SerchNewGlobalComponent,
      //cssClass: 'search_list-bar-btn',
      id: 'searchgmodel',
      event: ev,
      translucent: true,
      side: left,
      componentProps: { value: 123, otherValue: 234 }

    });
    await popover.present();
  }




  async Moduleclick() {
    let id = 'offcanvasmodule';
    let cssClass = 'offcanvas-start';
    let title = ""
    let componentProps = {
      test: "Recent"
    }
    // let leftbar: any = document.getElementById('main1')

    // leftbar.classList.add("left_panelhide");

    await this.canvasModal.openoffCanvas(ModulelinkComponent, componentProps, id, cssClass, title).then((item) => {
      // console.log(item);
      //  leftbar.classList.remove("left_panelhide");
      this.itemClicked(item);
    })
  }






  roleassign() {
    // let footerFrame;
    // let wscp: any = {};
    // for (let frame of this.object_mast.footerBar) {
    //   footerFrame = frame;
    // }



    let id = 'offcanvasRightqlink';
    let cssClass = 'offcanvasRight';
    let title = ""
    this.object_mast.footerBar
    let componentProps = {
      test: "Quick",
      //  frame: footerFrame,
      "wsdp": [],
      "wsdpcl": [],
      "openCanvas": true
    }
    this.globalobjects.quicklinkPageFlag = true;
    this.canvasModal.openoffCanvas(UserRoleComponentComponent, componentProps, id, cssClass, title).then((detail) => {
      if (detail.apps_item_seqid) {
        this.itemClicked(detail)
      } else if (detail.data) {
        this.itemClicked(detail.data)
      }

    }

    )
  }




  quickLinks(offcanvas?) {
    let footerFrame;
    let wscp: any = {};


    for (let object of this.globalobjects.layoutObject) {
      for (let obj of object.Level2) {
        for (let frame of obj.Level3) {
          if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'QUICK_ACTION_MENU') {
            footerFrame = frame;
            // for(let itemGroup of frame.Level4){
            //               for(let items of itemGroup.Level5){
            //               console.log(items.prompt_name);
            //               }
            //             }
            //         }
          }
        }
      }
    }




    this.globalobjects.quicklinkPageFlag = true;
    if (offcanvas) {
      let id = 'offcanvasRightqlink';
      let cssClass = 'offcanvasRight';
      let title = ""
      this.object_mast.footerBar
      let componentProps = {
        test: "Quick",
        frame: footerFrame,
        "wsdp": [],
        "wsdpcl": [],
        "openCanvas": true
      }
      this.canvasModal.openoffCanvas(QuicklinkComponent, componentProps, id, cssClass, title).then((detail) => {
        if (detail.apps_item_seqid) {
          this.itemClicked(detail)
        } else if (detail.openObject) {
          this.openHardcodeObjectNew(detail)
        }
      })
    } else {
      let id = 'globalNewModal';
      let componentProps = {
        test: "Quick",
        frame: footerFrame,
        "wsdp": [],
        "wsdpcl": [],
        "openCanvas": true
      }
      this.canvasModal.openModal(QuicklinkComponent, componentProps, id).then((detail) => {
        if (detail.apps_item_seqid) {
          this.itemClicked(detail)
        } else if (detail.openObject) {
          this.openHardcodeObjectNew(detail)
        }
      })
    }
  }

  themeLinks() {
    let id = 'offcanvasRightthemelink';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "theme"
    }
    this.canvasModal.openoffCanvas(ThemelinkComponent, componentProps, id, cssClass, title).then((detail: OverlayEventDetail) => {
      if (detail.data) {
        console.log(detail.data);
        this.setPersonaliseDatafuncdata(detail.data);

        // this.getdataFromcanvasApex(detail.data)
        // this.wsdpcl=this.lhs_lib.getDpcl();
        // this.itemClicked(value.data);
      }
    })
  }


  notesLinks() {
    let id = 'offcanvasRightnoteslink';
    let cssClass = 'offcanvas-start';
    // let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "Notes"
    }
    this.canvasModal.openoffCanvas(NoteslinkComponent, componentProps, id, cssClass, title)
  }

  helpLinks() {
    let id = 'offcanvasRighthelplink';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "Help"
    }
    this.canvasModal.openoffCanvas(HelplinkComponent, componentProps, id, cssClass, title)
  }

  releaseNoteLinks() {
    // let id = 'offcanvasRightrelnoteslink';
    // let cssClass = 'offcanvasRight';
    // let title = ""
    // let componentProps = {
    //   test: "Release Notes"
    // }
    // await this.canvasModal.openoffCanvas(ReleasenotesComponent, componentProps, id, cssClass, title)


    let id = 'offcanvasRightrelnoteslink';


    // let cssClass = 'offcanvas-start';
    let cssClass = 'offcanvasRight';
    let title = 'Release Notes';
    let wscp: any = {};
    wscp.service_type = "get_object_config";
    // wscp.object_code = item.calling_object_code;
    // wscp.object_code = 'WMABLD53'
    let componentProps = {
      test: "Release Notes",
      off_canvas: true,
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": [],
      "wsdpcl": [],
      "wsud": this.wsud
    }
    this.canvasModal.openoffCanvas(SuperPage, componentProps, id, cssClass, title).then((detail) => {
      this.lhs_lib.object_mast = this.object_mast;
        if(!this.plt){
        this.mobileViewQuickAction();
      }
    });
  }



  announceLinks(data) {
    let id = 'offcanvasRightannouncelink';
    let cssClass = 'offcanvasRight';
    let title = ""
    // let componentProps = {
    //   test: "new"
    // }
    let datas = data.item;
    let componentProps = {
      globalData: datas.globalData,
      localData: datas.localData
    }
    this.canvasModal.openoffCanvas(AnnouncementlinkComponent, componentProps, id, cssClass, title)
  }
  openCanvas = false
  openoffCanvasObject(item) {
    let id = item.id;

    let style = this.fromBackendStyle(item)
    let cssClass = 'offcanvas-start';
    // let cssClass = 'offcanvasRight';
    let title = item.title;
    let wscp: any = {};
    wscp.service_type = "get_object_config";
    wscp.object_code = item.calling_object_code;
    let componentProps = {
      test: "Reminder",
      off_canvas: true,
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": [],
      "wsdpcl": [],
      "wsud": this.wsud,
      "openCanvas": true

    }

    this.canvasModal.openoffCanvas(SuperPage, componentProps, id, cssClass, title, style).then((detail) => {

      this.lhs_lib.object_mast = this.object_mast
      this.lhs_lib.setObjectMastTab()
      this.openCanvas = false
        if(!this.plt){
        this.mobileViewQuickAction();
      }
    });
    // let myTag ; REMINDER
    // myTag = this.el.nativeElement.querySelector("div[role='tooltip']");
    // this.ren.removeClass(myTag, 'show');

  }
  openoffRightCanvasObject(item) {
    let id = item.id;

    let style = this.fromBackendStyle(item)
    let cssClass = 'offcanvasRight';
    // let cssClass = 'offcanvasRight';
    let title = item.title;
    let wscp: any = {};
    wscp.service_type = "get_object_config";
    wscp.object_code = item.calling_object_code;
    let componentProps = {
      test: "Reminder",
      off_canvas: true,
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": [],
      "wsdpcl": [],
      "wsud": this.wsud,
      "openCanvas": true

    }

    this.canvasModal.openoffCanvas(SuperPage, componentProps, id, cssClass, title, style).then((detail) => {

      this.lhs_lib.object_mast = this.object_mast
      this.lhs_lib.setObjectMastTab()
      this.openCanvas = false
        if(!this.plt){
        this.mobileViewQuickAction();
      }
    });
    // let myTag ; REMINDER
    // myTag = this.el.nativeElement.querySelector("div[role='tooltip']");
    // this.ren.removeClass(myTag, 'show');

  }

  openoffLeftCanvasObject(item) {


    let id = 'offcanvasLeftnotificationLink';

    let style = this.fromBackendStyle(item)
    let cssClass = 'offcanvasLeft';
    let title = "Notification";
    let wscp: any = {};
    wscp.service_type = "get_object_config";
    wscp.object_code = item.calling_object_code;
    let componentProps = {
      test: "notification",
      off_canvas: true,
      "wslp": this.globalobjects.userDetails,
      "wscp": wscp,
      "wsdp": [],
      "wsdpcl": [],
      "wsud": this.wsud,
      "openCanvas": true
    }
    this.canvasModal.openoffCanvas(SuperPage, componentProps, id, cssClass, title, style).then((detail) => {
      this.lhs_lib.object_mast = this.object_mast
      this.lhs_lib.setObjectMastTab()
      this.openCanvas = false
        if(!this.plt){
        this.mobileViewQuickAction();
      }
    });
    // let myTag ; 
    // myTag = this.el.nativeElement.querySelector("div[role='tooltip']");
    // this.ren.removeClass(myTag, 'show');

  }
  devloperMLinks() {
    let id = 'offcanvasRightdevloperMlink';
    let cssClass = 'offcanvasRight';
    let title = "Developer Setting"
    let componentProps = {
      test: "developer"
    }
    this.canvasModal.openoffCanvas(SettingPage, componentProps, id, cssClass, title)
  }

  singleselectLov() {
    let id = 'sigleMultiLov';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "developer"
    }
    this.canvasModal.openoffCanvas(SingleSelectLovPage, componentProps, id, cssClass, title)
  }

  singleselectLovRef() {
    let id = 'sigleMultiLov';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "developer"
    }
    this.canvasModal.openoffCanvas(SingleSelectLovPage, componentProps, id, cssClass, title)
  }

  settingLinks() {
    let id = 'offcanvasRightsettinglink';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "setting"
    }
    this.canvasModal.openoffCanvas(SettingPage, componentProps, id, cssClass, title)
  }
  // 30-04-24 start
  notificationLinks() {
    let id = 'offcanvasLeftnotificationLink';
    let cssClass = 'offcanvasLeft';
    let title = ""
    let componentProps = {
      test: "notification"
    }
    this.canvasModal.openoffCanvas(NotificationlinkComponent, componentProps, id, cssClass, title)
  }
  // 30-04-24 end

  // 01-07-24 start
  // async alertmsgLink() {
  //   let id = 'offcanvasRightalertmsgLink';
  //   let cssClass = 'offcanvasRight';
  //   let title = ""
  //   let componentProps = {
  //     test: "alertmsg"  
  //   }
  //   await this.canvasModal.openoffCanvas(NotificationlinkComponent, componentProps, id, cssClass, title)
  // }
  // 01-07-24 end


  themeheader() {
    let id = 'offcanvasRightthemelink';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "Theme"
    }
    this.canvasModal.openoffCanvas(ThemelinkComponent, componentProps, id, cssClass, title)



  }

  toggleMenuhead: any = 0;
  collapseHead() {
    // this.upArrowon = true;
    if (this.model = !this.model) {
      this.upArrowon = true;
      this.toggleMenuhead = 1;

    }
    else {

      //document.getElementById('multiCollapse1').classList.remove("collapse");
      this.toggleMenuhead = 0;
      this.upArrowon = false;


    }

  }


  getImage(frame) {
    for (let tableData of frame.tableRows) {
      for (let itemGrp of tableData) {
        for (let item of itemGrp.Level5) {
          if (item.item_name == 'PHOTO') {
            this.dowmImage(item)
          }
        }
      }
    }
  }

  dowmImage(item) {

    if (item.blobImg) {
      item.blobImg;
    } else if (item.value) {
      let url = 'getItemImage?query=' + encodeURIComponent(item.value);
      this.dataService.getData(url)
        .then(res => {
          //console.log(res);
          var data: any = res;
          if (data.status == 'success') {
            item.blobImg = 'data:image/png;base64,' + data.img;
          } else {
            item.blobImg = '/assets/imgs/no_image.png';
          }

        }, err => {
          //console.log("ImgDataErr " + JSON.stringify(err));
          item.blobImg = '/assets/imgs/no_image.png';

        })

    } else {
      item.blobImg = '/assets/imgs/no_image.png';
    }


  }

  //   openApplication(item,itemGroup) {
  //     // let itemGrp=JSON.parse(JSON.stringify(itemGroup));
  //     for(let object of this.globalobjects.layoutObject){
  //       for(let obj of object.Level2){
  //        for(let frame of obj.Level3){
  //         if(frame.apps_frame_type=='SYSTEM'&& frame.apps_frame_sub_type=='LAYOUT_OPTION'){
  //           for(let itemGroup of frame.Level4){
  //             for(let items of itemGroup.Level5){
  //               items.active_flag=false;
  //             }
  //           }
  //         }
  //        }
  //     }
  //   }
  // }

  openApplication = this.throttle((item) => {
    // if (this.globalobjects.focusArrow) {
    let tooltip = document.querySelector(".tooltip")
    if (tooltip) {
      tooltip.classList.remove("show")
    }
    this.globalobjects.activeItems = item.item_name;
    this.globalobjects.tabindex.push(item.item_name);

    // item.active_flag = true;
    item.object_code = item.calling_object_code
    // alert(JSON.stringify(reqData.wscp.object_code));
    // this.get_object_config(item, item.calling_object_code, 'TAB');
    this.itemClicked(item)
    // }
  })


  // document.getElementById('multiCollapse').classList.remove("collapse");
  checkClickedlink(value) {
    alert(value);
  }




  showInfoPopup() {
    this.isClassAdded = !this.isClassAdded;
  }


  // copyData(value: any, field: string) {
  //   this.pluginService.copyData(value, field);
  // }
  showCopied: any;

  copyData(data, type) {
    copy(data);
    this.showCopied = type;

    setTimeout(() => {
      this.showCopied = "";
    }, 1000);

  }



  showFavorite() {
    this.addFavorite = !this.addFavorite;
  }
  addFavoritemenu = false;
  showFavoritemenu() {
    this.addFavoritemenu = !this.addFavoritemenu;
  }

  addFavorite = false;

  toggleFavoriteMenu() {
    this.addFavorite = !this.addFavorite;
  }

  closeMenu() {
    this.addFavorite = false;
  }


  subFun() {
    // this.visibilitySubscription = this.globalobjects.getVisibilityState().pipe(distinctUntilChanged()).subscribe(
    //   (isVisible) => {
    //     if (this.object_mast.object_code == this.lhs_lib.get_active_object_mast()?.object_code) {
    //       if (isVisible) {
    //         // this.globalobjects.isCheck = true;
    //         console.log('Browser tab is visible');
    //         this.tabFocus();
    //       } else {
    //         // if (this.globalobjects.isCheck) {
    //         // console.log('Browser tab is minimized or hidden');
    //         this.globalobjects.isCheck = false;
    //         this.tabOutFocus();
    //       }
    //       // }
    //     }
    //   }
    // );

  }

  tabFocus() {
    // this.tabFlag=true;
    let event = this.lhs_lib.get_item('SYS_TAB_ACTIVE', 0);
    if (event) {
      this.app_execute_item(event, 'SYS_TAB_ACTIVE', 'click_events_str');
    }
  }


  tabOutFocus() {
    // this.tabFlag=false;
    console.log("tab out of focus");
    // alert("out")
    let event = this.lhs_lib.get_item('SYS_TAB_INACTIVE', 0);
    if (event) {
      this.app_execute_item(event, 'SYS_TAB_INACTIVE', 'click_events_str');
    }
  }
  // @HostListener('document:click', ['$event'])
  clickOutside(event: any) {

    // if (this.isClassAdded) {
    //   if (event.target.id != `info_icon`) {
    //     this.isClassAdded = false
    //   }
    // } else if (this.addFavorite) {
    //   if (event.target.name != `ellipsisiconSuper` && event.target.name != 'ellipsis-vertical-outline') {
    //     this.addFavorite = false
    //   }
    // }
  }
  overlayClick() {
    if (this.isClassAdded) {
      this.isClassAdded = false
    }
    if (this.addFavorite) {
      this.addFavorite = false
    }
  }
  openParameterFrame() {
    let id = 'offcanvasParameterFrame';
    let cssClass = 'offcanvasRight';
    let title = "Parameter Frame";

    let componentProps = {
      object_mast: this.object_mast,
      wsdp: this.wsdp,
      sessionObj: this.sessionObj,
      wscp: this.wscp,
      wsdpcl: this.wsdpcl,
      page_no: this.page_no
    }
    this.canvasModal.openoffCanvas(ParameterframeComponent, componentProps, id, cssClass, title).then((detail) => {
      this.lhs_lib.object_mast = this.object_mast
    });
  }


  checkPageTabnVisibility(): void {
    const pageTabn = document.getElementById('page-tabn');
    const breadcrumbHeader = document.querySelector('.breadcrumb-header') as HTMLElement | null;

    if (!pageTabn) {
      console.error('Element with id "page-tabn" not found');
      return;
    }

    if (!breadcrumbHeader) {
      console.error('Element with class "breadcrumb-header" not found');
      return;
    }
    if (isPlatformServer(this.platformId)) return;
    // Check if page-tabn is visible
    if (window.getComputedStyle(pageTabn).display !== 'none') {
      breadcrumbHeader.classList.add('new-class'); // Add class when page-tabn is visible
    } else {
      breadcrumbHeader.classList.remove('new-class'); // Remove class when page-tabn is not visible
    }
  }

  fromBackendStyle(item) {
    let popupStyle, style
    if (item.calling_parameter_str) {
      if (item.calling_parameter_str.toLowerCase().indexOf('popup') > -1) {
        let callingArr = item.calling_parameter_str.split(';');
        for (let c of callingArr) {
          if (c.toLowerCase().indexOf('popup(') > -1) {
            popupStyle = c;
          }
        }
      }

      let str = popupStyle && popupStyle.split("(")[1].split(")")[0];
      if (str) {
        let styleArr = str.split(',');
        let obj: any = {};
        for (let x of styleArr) {
          let key = x.split('=');
          if (key[1]) {
            key[1] = key[1].replaceAll("'", '');
          }
          if (key[0]) {
            key[0] = key[0].replaceAll("'", '');
          }
          if (key[0].toLowerCase() == 'w') {
            obj.width = key[1];
          }
        }
        style = ""
        for (let x in obj) {
          style = `${x}:${obj[x]} !important`;
        }
      }
    }
    return style
  }

  statuslink() {
    let id = 'offcanvasRightstatusMlink';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "developer"
    }
    this.canvasModal.openoffCanvas(StatuslinkComponent, componentProps, id, cssClass, title)
  }
  terminate() {
    this.dataService.terminateAllRequest();
    this.isEventRunning = false;
    this.globalobjects.isNotOpenTab.set(false)
    this.globalobjects.isGetObjectConfig.set(false);

    this.globalobjects.hide_event_loading();
    // this.globalobjects.count = 0;
    // this.globalobjects.hideLoadingSide();
    // this.globalobjects.stop_loading_side();
  }

  // stop_timer(name) {


  //   let arr = [];
  //   for (let x of this.globalobjects.timerEvents) {
  //     if (x.object_code == this.object_mast.object_code && x.timerName == name) { } else {
  //       arr.push(x);
  //     }
  //   }

  //   this.globalobjects.timerEvents = arr;
  //   clearInterval(this.timerFunc);
  // }


  personalisation_filter_dashboard(event: any) {
    // let component = FrameRelationalTableFilterComponent
    this.QuickActionModal;
    let component = PersonalisationFilterComponent
    console.log(this.object_mast.Level2[this.page_no].Level3);
    let componentProps = {
      frame: this.frame,
      object_mast_level3: JSON.parse(JSON.stringify(this.object_mast.Level2[this.page_no].Level3)),
      object_mast_level2: JSON.parse(JSON.stringify(this.object_mast.Level2)),
      theadData: this.frame.apextheads
    }
    let id = "globe_personalisation_filter"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((detail) => {
      // alert("user role"+detail.data);

      if (detail.data) {
        console.log(detail.data);
        this.setPersonaliseDatafuncdata(detail.data);

        // this.getdataFromcanvasApex(detail.data)
        // this.wsdpcl=this.lhs_lib.getDpcl();
        // this.itemClicked(value.data);
      }
    })
  }

  copy_json(to, from) {
    let toFrame = this.lhs_lib.get_frame_config(to);
    let fromFrame = this.lhs_lib.get_frame_config(from);

    if (toFrame && fromFrame && fromFrame.tableRows) {
      toFrame.tableRows = fromFrame.tableRows;
      this.processData.afterTableRows(toFrame);
    }
  }

  app_open_advance_filter(event) {

    let component = ReportEngineFormatViewComponent
    let id = "report_filter_column"
    let cssClass = ""

    this.modalGlobal.openModal(component, null, id, '', cssClass).then((value) => {
      console.log(value.data)
      // }

      // if (event.click_events_arr.length > (event.click_events_count + 1)) {
      //   event.click_events_count = event.click_events_count + 1;
      //   this.itemClicked1(event, "");
      // }
    })
  }

  // get_file_from_server(iud_Seqid: string, user_code: string, login_token: string) {
  //   // Construct the URL
  //   iud_Seqid = "login_token";
  //   user_code = "user_code";
  //   login_token = "login_token"
  //   const url = `${iud_Seqid}/${user_code}/${login_token}/get_file_from_server`;

  //   this.dataService.getfileData(url).then((response: HttpResponse<Blob>) => {
  //     const file = response.body;
  //     const contentDisposition = response.headers.get('Content-Disposition');
  //     console.log(contentDisposition);
  //     let fileName = 'downloaded_file';
  //     if (contentDisposition) {
  //       const matches = contentDisposition.match(/filename="(.+)"/);
  //       console.log(matches);
  //       if (matches && matches[1]) {
  //         fileName = matches[1];
  //       }
  //     }

  //     const fileURL = window.URL.createObjectURL(file);
  //     const a = document.createElement('a');
  //     a.href = fileURL;
  //     a.download = fileName;
  //     a.click();

  //     window.URL.revokeObjectURL(fileURL);

  //     alert('File downloaded successfully!');
  //   }).catch(err => {
  //     console.error('Error fetching file:', err);
  //     alert('Failed to download the file. Please try again.');
  //   });
  // }
  /* start Tab close functionality*/
  tab_close_event() {
    let item = this.lhs_lib.get_item('SYS_OBJECT_EXIT', 0);
    if (item) {
      let str = `${item.click_events_str}app_close_tab();`
      item.click_events_str = str
      item.itemClicked = 'pre';
      this.itemClicked(item)
    } else {
      this.app_close_tab()
    }
  }
  app_close_tab(event?) {
    if (event) {
      this.back_page_calling_para(event);
    }
    for (let [i, tab] of this.lhs_lib.dynamicTabs.entries()) {
      if (this.superId == tab.instance.superId) {
        let obj = {
          tab: tab,
          index: i + 1
        }
        this.events.publish("closeTab", obj);
      }
    }
  }
  /* End Tab close functionality*/

  openHardcodeObjectNew(item, service_type?) {

    let event = {
      apps_item_seqid: item.item_seqid ? item.item_seqid : null,
      origin_apps_item_seqid: item.item_seqid ? item.item_seqid : null,
      apps_page_frame_seqid: item.seqid,
      apps_page_no: "1",
      calling_object_code: item.object_code,
      click_events_str: service_type ? service_type : "get_object_config_new",
      calling_parameter_str: `app_add_para('P_CP_OBJECT_CODE','${this.object_mast.object_code}');app_add_para('P_CP_FRAME_SEQID','${item.seqid}');app_add_para('P_CP_IUD_SEQID','${this.object_mast.iud_seqid}');app_add_para('P_CP_TCODE',::p_tcode);app_add_para('P_CP_TNATURE',::P_TNATURE);`,
      // new_id : 
      object_code: item.object_code,
      // origin_apps_item_seqid: "",
      orignal_apps_item_seqid: null,
      orignal_apps_page_frame_seqid: item.seqid,
      orignal_object_code: item.object_code,
      calling_object_load_events_str: `app_execute_item('PB_NFI','click_events_str');`,
      wsdp: [],
      wscp: {
        flag: 'M',
        object_code: item.object_code
      },
      wsdpcl: this.lhs_lib.getWsdp(this.object_mast.object_code + "-PARA").wsdp
    }

    //this.get_object_config(event, object_code, "tab")
    this.itemClicked(event);
  }
  // }

  set_bookmark(item?) {
    // console.log("checkd set bookmark",this.object_mast);
    this.globalobjects.showLoading;
    this.wscp.service_type = "set_quick_menu";
    this.wscp.object_code = this.object_mast.object_code;
    // wscp: {
    //   ref_cursor_mode: this.globalobjects.refCursorMode,
    //   platform: this.globalobjects.getLocallData('platformValue'),
    //   object_code:this.object_mast.object_code,
    //   service_type: "set_quick_menu"
    // },


    let reqData = {
      wslp: this.globalobjects.getLocallData('userDetails'),
      wscp: this.wscp,
      wsdp: [],
      wsdpcl: []
    }
    this.dataService.postData("S2U", reqData).then((res: any) => {
      this.globalobjects.hideLoading;

      let data: any = res;
      if (data.responseStatus && data.responseStatus.includes("success")) {
         if(item){
          item.isFavorite=true;
        }
        console.log(data);
        this.afterGetS2uresp(reqData, data);
        // reject("error");
        // resolve(objMast);
      }
      else {
      }
    }).catch(err => {
      this.globalobjects.hideLoading;
    })
  }
  setPersonaliseDatafunc(event) {
    this.globalobjects.ShowLoadingSide();
    if (event.reqData) {
      // console.log(this.object_mast);
      event.reqData.wscp.object_code = this.object_mast.object_code
      this.dataService.postData("S2U", event.reqData).then((res: any) => {
        this.globalobjects.hideLoadingSide();

        let data: any = res;
        if (data.responseStatus && data.responseStatus.includes("success")) {
          console.log(data.responseStatus);
          // console.log(data);
          this.afterGetS2uresp(event.reqData, data);
          this.refreshObjFab();
          // reject("error");
          // resolve(objMast);
        }
        else {
        }
      }).catch(err => {
        this.globalobjects.hideLoadingSide();

      })
    }

  }



  setPersonaliseDatafuncdata(event) {
    this.globalobjects.ShowLoadingSide();
    // console.log("wscp",this.wscp);
    let wscpdata = this.generate_wscp(null, event.reqData.wscp);
    console.log("event wscp  : ", event.reqData.wscp);
    let datawscp: any = {};
    datawscp = {
      wscp: wscpdata,
      wslp: event.reqData.wslp,
      wsdp: [],
      wsdpcl: []
    }
    console.log("this data wscp : ", datawscp);

    // datawscp.delete["iud_seqid"];
    delete datawscp["iud_seqid"];


    if (event.reqData) {
      // console.log(this.object_mast);
      datawscp.wscp.object_code = this.object_mast.object_code

      //  event.reqData.wscp.appkey=this.wscp.appkey;
      //  event.reqData.wscp.flag=this.wscp.flag;
      //  event.reqData.wscp.g_theme_name=this.wscp.g_theme_name;




      this.dataService.postData("S2U", datawscp).then((res: any) => {
        this.globalobjects.hideLoadingSide();

        let data: any = res;
        if (data.responseStatus && data.responseStatus.includes("success")) {
          console.log(data.responseStatus);
          // console.log(data);
          this.afterGetS2uresp(event.reqData, data);
          this.refreshObjFab();
          // reject("error");
          // resolve(objMast);
        }
        else {
        }
      }).catch(err => {
        this.globalobjects.hideLoadingSide();

      })
    }

  }







  afterGetS2uresp(reqData: any, data: any) {
    if (data.responseStatus && data.responseStatus.includes("success")) {
      let objData: any = {};
      if (data.responseStatus.toLowerCase().includes("-rc")) {
        objData.Level1 = this.globalobjects.setPageInfoNoS2U(data.responseData);
      } else {
        objData = this.globalobjects.setPageInfo(data.responseData);
      }



      if (objData.Level1 && objData.Level1.length > 0 && objData.Level1[0]['status'] == 'J') {
        this.generatAllFrameJson(objData.Level1, reqData.wscp);
        // let data = objData.Level1;
        // let isRep = data.find(x => x.para_type == 'RE');
        // if (isRep) {
        //   this.afterParaFunc(reqData, flag);
        // }

      }

      if (data.responseHead && data.responseHead.length > 0) {
        this.generatAllFrameJson(data.responseHead, event, true);
      }

    }
    // this.refreshObjFab();
  }

  keyClicked(event) {
    event.itemClicked = "pre";

    if (!event.click_events_str) {
      event.click_events_str = "open_lov();"
    }
    this.itemClicked(event);
  }

  // onBlur(event) {
  //   event.itemClicked = "post";
  //   this.itemClicked(event);
  // }


  downloadCsvFromServer(requestData: any, filename): void {
    filename = filename + ".csv";
    const url =
      'get_file_from_server';
    this.dataService.downloadCsv(requestData, url, filename);

  }

  onBlur(event) {
    event.itemClicked = "post";
    this.itemClicked(event);
  }


  templateObject() {
    let event = {
      seqid: 'WEMU0080-F-1',
      openObject: true,
      object_code: "WEMU0080"
    }
    this.openHardcodeObjectNew(event);

  }

  templateObject1() {
    let event = {
      seqid: 'WEMU0139-F-1',
      openObject: true,
      object_code: "WEMU0139"
    }
    this.openHardcodeObjectNew(event);

  }


  templateObjectNew() {
    let event = {
      seqid: 'WEMU0161-F-1',
      openObject: true,
      object_code: "WEMU0161"
    }
    this.openHardcodeObjectNew(event);

  }

  templateObject2() {
    let event = {
      seqid: 'WEMU0140-F-1',
      openObject: true,
      object_code: "WEMU0140"
    }
    this.openHardcodeObjectNew(event, 'get_object_config');

  }

  templateObjectSave() {
    let event = {
      seqid: 'WEMU0085-F-1',
      openObject: true,
      object_code: "WEMU0085"
    }
    this.openHardcodeObjectNew(event);

  }

  app_add_para_cp(para_type, value) {
    if (!this.globalobjects.wscp_para) {
      this.globalobjects.wscp_para = {};
    }

    this.globalobjects.wscp_para[para_type.toLowerCase()] = value;
  }

  app_add_para_lp(para_type, value) {
    let userDetails = this.globalobjects.getLocallData('userDetails');
    if (userDetails) {
      userDetails[para_type.toLowerCase()] = value;
      this.globalobjects.setDataLocally('userDetails', userDetails);
    }
  }



  generate_wscp(event, oldWscp) {

    let wscp: any = {};
    wscp.orignal_apps_page_frame_seqid = this.holdWscp.orignal_apps_page_frame_seqid;
    wscp.orignal_apps_item_seqid = this.holdWscp.orignal_apps_item_seqid;
    wscp.orignal_object_code = this.holdWscp.orignal_object_code;

    wscp.iud_seqid = this.object_mast?.Level2[this.page_no].iud_seqid;
    wscp.apps_working_mode = this.object_mast?.apps_working_mode;

    wscp.origin_apps_item_seqid = this.object_mast?.Level2[this.page_no].origin_apps_item_seqid;

    if (event) {
      wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
      wscp.apps_item_seqid = event.apps_item_seqid;
      wscp.item_sub_type = event.item_sub_type;
      wscp.calling_parameter_str = event.calling_parameter_str;
    }

    if (oldWscp) {
      wscp = { ...wscp, ...oldWscp };
    }

    return wscp;
  }

  app_required_item(itemName, index?) {
    let item = this.lhs_lib.get_item(itemName, index ? index : 0);
    if (item) {
      if (item.value) {
        return true;
      }
      else {
        item.isValid = false;
        item.touched = true;
        item.rase = true;
        item.vadidateMsg = item.tool_tip ? item.tool_tip : "Please enter valid " + item.prompt_name;
        this.clearQue();
        this.lhs_lib.msgbox(item, "Please enter valid " + item.prompt_name, "raise");
        throw new Error('Code Raised');
        return false;
      }
    }
  }
  //
  // }
  downloadTemplateExcel(parseFrame, status?, reqData1?) {
    // this.dataService.startScanning();
    let reqData: any = JSON.parse(JSON.stringify(reqData1));
    // // this.globalobjects.setFocus(false);
    let frameName = parseFrame.apps_page_frame_name ? parseFrame.apps_page_frame_name : parseFrame.apps_page_frame_seqid;
    let arr = status.split("-");
    let wsSeq = arr[arr.length - 1];
    // reqData.wscp.execute_query_in_file = 'Y';

    let wsdp = [];
    let wsdpcl = [];

    if (parseFrame.calling_frame_seqid_str) {
      wsdp = this.lhs_lib.getDp(parseFrame.calling_frame_seqid_str);
      wsdpcl = this.lhs_lib.getDpcl();
    } else {
      wsdpcl = this.lhs_lib.getDpcl();
    }

    reqData.wscp.ref_cursor_mode = this.globalobjects.refCursorMode ? 'T' : 'F';

    let filename = "downlaodheader";
    // let requestData={
    //   //  somevlue:"somevalue"
    // }
    // let tempseqid:any=101;
    filename = filename + ".xls";
    // const url =
    //   '1500/getTemplateDownload';
    const url =
      // tempseqid+'/getTemplateDownload';
      'getTemplateDownload';

    this.dataService.downloadCsv(reqData, url, filename);
  }

  set_lwsdp(name, value) {
    this.globalobjects.lwsdp[name.toLowerCase()] = value;
  }

  remove_lwsdp(name) {
    delete this.globalobjects.lwsdp[name.toLowerCase()];
  }

  clear_lwsdp() {
    this.globalobjects.lwsdp = {};
  }
  /* pb_back by arti*/
  pb_back_to_exit(objMast) {
    if (objMast && objMast.Level2 && objMast.Level2[0]) {
      for (let frame of objMast.Level2[0].Level3) {
        for (let items of frame.Level4) {
          for (let item of items.Level5) {
            if (item.item_name == "PB_BACK") {
              item.prompt_name = "Exit"
              item.tool_tip = "Exit"
            }
          }
        }
      }
    };
  }
  /* for localHost run cmd command
  localHostMethod(event){
    let data={
      lwsdp:this.globalobjects.lwsdp
    }
 
    let command="notepad"
    let endpoint=`openCommandLineWithCommand?command=${command}`
    let url = "http://localhost:8151/"+endpoint;*/



  async localHostMethod(event): Promise<any> {

    let wsdpcl = this.lhs_lib.getDpcl(event.calling_frame_seqid_str);

    let data = {
      lwsdp: this.globalobjects.lwsdp
    }
    let command = "notepad"
    let endpoint = `openCommandLineWithCommand?command=${command}`
    // let url = "http://10.30.41.162:8151/EPA/";
    let url = "http://localhost:8151/EPA/";
    // let url = this.globalobjects.userDetails.client_address + ":8151/EPA/";
    this.globalobjects.ShowLoadingSide()
    await this.dataService.localHostPostMethod(url, data).then(async (res: any) => {
      this.globalobjects.hideLoadingSide()

      if (res) {
        res = JSON.parse(res);
      }
      if (res.responseStatus && res.responseStatus.includes("success")) {
        let objData: any = {};
        // if (res.responseStatus.toLowerCase().includes("-rc")) {
        objData.Level1 = this.globalobjects.setPageInfoNoS2U(res.responseData);
        // } else {
        //   objData = this.globalobjects.setPageInfo(res.responseData);
        // }

        if (objData.Level1 && objData.Level1.length > 0 && objData.Level1[0]['status'] == 'J') {
          await this.generatAllFrameJson(objData.Level1, event);  //generate & assign 
        }

        if (res.responseHead && res.responseHead.length > 0) {
          this.generatAllFrameJson(res.responseHead, event, true);
        }

        // if (event.click_events_arr) {
        //   if (event.click_events_arr.length > (event.click_events_count + 1)) {
        //     event.click_events_count = event.click_events_count + 1;
        //     this.itemClicked1(event, "");
        //   }
        // }
      }

      return;
      // let responce=`code#${res}`
    }).catch(err => {
      console.log(err)
      this.globalobjects.hideLoadingSide();
      return;
    })


  }


  plsql_to_js(event, to, from) {
    let fromItm = this.lhs_lib.get_item(from, 'current_record');
    let toItm = this.lhs_lib.get_item(to, 'current_record');
    if (fromItm && toItm && fromItm.value) {
      let parseCode = this.convert_plsq_js.getConvertedScript(fromItm.value);
      let convertedVal = this.lhs_lib_util(parseCode, event);
      toItm.value = convertedVal.replaceAll("await ", "");
    }


    // try{
    //   eval(toItm.value)
    // } catch(err){
    //   console.log(err.stack);
    // }


  }

  extractMsgboxArguments(code) {
    const regex = /msgbox\(/g;  // Look for "msgbox("
    let matches = [];
    let match;

    while ((match = regex.exec(code)) !== null) {
      let startIndex = match.index + match[0].length;  // Skip "msgbox("
      let parenthesesCount = 1;  // We’ve already encountered one "("
      let endIndex = startIndex;

      // Traverse through the string, counting parentheses
      while (parenthesesCount > 0 && endIndex < code.length) {
        if (code[endIndex] === '(') parenthesesCount++;
        if (code[endIndex] === ')') parenthesesCount--;
        endIndex++;
      }

      // Capture the argument inside msgbox (excluding the closing parenthesis)
      matches.push(code.slice(startIndex, endIndex - 1).trim());
    }
    let matchdata = []
    for (let matche of matches) {
      matche = "msgbox(" + matche + ")";
      matchdata.push(matche)
    }


    return matchdata;
  }

  globalRight() {
    this.isSeeWidth = !this.isSeeWidth
    //alert(this.isSeeMore);
  }
  //     if (iframe && iframe.contentWindow) {
  //       const message = {
  //         type: 'PARENT_MESSAGE',
  //         payload: this.messageToSend
  //       };
  //       iframe.contentWindow.postMessage(message, '*');
  //       this.messageToSend = ''; 
  //         // alert(window.location.href);
  //     }
  //   }

  toggle: boolean = false;
  paratoggle(event) {
    // if(!this.frame.collapse){
    this.toggle = !this.toggle
    // }else{

    // }
  }


  //  createmeno(){
  //  let component = CreateMemoComponent
  // let componentProps = ""
  // let id = "create_memo"
  // let cssClass = ""
  // this.modalGlobal.openModal(component, componentProps, id,'', cssClass).then((value) => {
  //   // alert("user role");
  //   if (value) {
  //     // this.wsdpcl=this.lhs_lib.getDpcl();

  //   }
  // })


  // }
  chatboat() {
    let id = 'offcanvaschat';
    let cssClass = 'offcanvasRight';
    let title = ""
    this.object_mast.footerBar
    let componentProps = {
      "openCanvas": true
    }
    this.canvasModal.openoffCanvas(ChatboatComponent, componentProps, id, cssClass, title).then((detail) => {
      if (detail.apps_item_seqid) {
        this.itemClicked(detail)
      } else if (detail.data) {
        this.itemClicked(detail.data)
      }

    }

    )
  }

  agentic_Chatbot(data) {
    let id = 'offcanvasassistant';
    let cssClass = 'offcanvasRight';
    let title = ""
    this.object_mast.footerBar
    let componentProps = {
      item: data
    }
    this.canvasModal.openoffCanvas(AgenticChatbotComponent, componentProps, id, cssClass, title).then((detail) => {
      if (detail.apps_item_seqid) {
        this.itemClicked(detail)
      } else if (detail.data) {
        this.itemClicked(detail.data)
      }

    }

    )
  }

  aiassistant() {
    let scrollPos = window.scrollY;
    let id = 'offcanvasassistant';
    let cssClass = 'offcanvasRight';
    let title = ""
    this.object_mast.footerBar
    let componentProps = {
      "openCanvas": true
    }
    this.canvasModal.openoffCanvas(AiAssistentComponent, componentProps, id, cssClass, title).then((detail) => {
      window.scrollTo(0, scrollPos);
      if (detail.apps_item_seqid) {
        this.itemClicked(detail)
      } else if (detail.data) {
        this.itemClicked(detail.data)
      }

    }

    )
  }
  app_backup_frame(frameName) {
    let frame = this.lhs_lib.get_frame_config(frameName);

    if (frame) {
      frame.backup_rows = frame.tableRows;
    }
  }

  app_restore_frame(frameName) {
    let frame = this.lhs_lib.get_frame_config(frameName);

    if (frame && frame.backup_rows) {
      frame.tableRows = frame.backup_rows;
      this.processData.afterTableRows(frame);
    }
  }





  open_object_in_wma_builder() {

    let object_code_builder = this.object_mast.object_code;
    // let base_url = 'http://192.168.100.101:8383/wma_builder_uat';
    let base_url = this.globalobjects.userDetails.g_wma_builder_url;


    const window_features = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=no,resizable=yes,width=1000,height=800,top=100,left=100";

    const params = {
      actionMode: "bypass",
      object_code: object_code_builder
    };

    const encoded_params = btoa(JSON.stringify(params));
    const final_url = `${base_url}/#/login?data=${encodeURIComponent(encoded_params)}`;

    console.log('Generated WMA Builder URL:', final_url);
    if (isPlatformServer(this.platformId)) return;
    window.open(final_url, '_blank', window_features);
  }


  downloadJson() {
    let eventQues = this.clickEvent;
    let eventLog = this.globalobjects.logFlag ? this.globalobjects.events_log : "App log off"
    // Download for Event Que
    this.downloadJsonFile(eventQues, "EventQue")
    // Download for Event Log
    this.downloadJsonFile(eventLog, "EventsLog")
  }

  downloadJsonFile(data: any, fileName: string): void {
    // Convert data to JSON string
    const json = JSON.stringify(data, null, 2);

    // Create a blob with MIME type
    const blob = new Blob([json], { type: 'application/json' });

    // Create a download link
    if (isPlatformServer(this.platformId)) return;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
    a.click();

    // Clean up the object URL
    window.URL.revokeObjectURL(url);
  }

  throttle(callback, delay = 500) {
    let timerFlag = null;
    let event = null;
    return (...args) => {
      if (timerFlag === null || (JSON.stringify(args[1] != event))) {
        event = JSON.stringify(args[1]);
        callback(...args);
        timerFlag = setTimeout(() => {
          timerFlag = null;
          event = null;
        }, delay);
      }
    };
  }


  quick_action_clicked = this.throttle((event) => {
    // if (this.globalobjects.focusArrow) {

    delete event['forcedInvalid'];
    delete event['rase'];
    this.itemClicked(event);
    // }
  });


  app_show_frame(frameName) {
    let frame = this.lhs_lib.get_frame_config(frameName);

    if (frame) {
      frame = JSON.parse(JSON.stringify(frame));
      delete frame['searchableData'];

      let component = DoubleclickComponent;
      let id = "table_model"
      let cssClass = "table_modal"
      let componentProps = {
        frame: frame,
        only_show: true
      }


      this.modalGlobal.openModal(component, componentProps, id, "", cssClass, "", "", "").then((detail) => {
        if (detail.data) {
          // this.getdataFromcanvasApex(detail.data)
        }

      })
    }
  }



  adjustScale() {
    if (isPlatformServer(this.platformId)) return;
    const width = window.innerWidth;

    let scale = 1;

    if (width < 480) {
      scale = 0.8;    // small mobile
    } else if (width < 768) {
      scale = 0.9;    // larger mobile
    } else if (width < 1024) {
      scale = 1.0;    // tablet
    } else if (width < 1366) {
      scale = 1.1;    // laptop
    } else {
      scale = 1.2;    // desktop
    }

    document.documentElement.style
      .setProperty('--scale-factor', scale.toString());
  }

  app_frame_fullScreen(frameName) {
    let frame = this.lhs_lib.get_frame_config(frameName);
    if (frame) {
      this.commonMethodService.fullScreen(frame, "1");
    }
  }

  refreshFrame_cartSummaryPlain(res) {

    let obj = {
      key: res, val: "T"
    }
    let refreshFrame = obj
    this.events.publish("refreshFrame_" + res, { refreshFrame: [{ key: res, val: "T" }] })

  }





  // async lookfeel() {
  //   const modal = await this.modalCtrl.create({
  //     component: NewLoaderComponent,
  //     id: 'new-loader-modal',
  //     cssClass: 'new-loader-modal'
  //   });
  //   return await modal.present();
  // }

  async lookfeel() {
    let component = NewLoaderComponent
    let componentProps = ""
    let id = "new-loader-modal"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, cssClass).then((detail) => {

    })
  }

  preItem_clicked(event, clickEventStr, frame?, itsFrame?) {
    this.breadCrumsuper = event;


    if (!frame) {
      frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seqid);
    }

    if (this.globalobjects.toggleSound) {
      // this.nativeAudio.play(this.globalobjects.audio.id).then(() => { }, (err) => {
      // });
      this.pluginService.playAudio(this.globalobjects.audio.id);
      // this.pluginService.playAudio(this.globalobjects.audio.id);

    }
    if (this.globalobjects.toggleVibrate) {
      navigator.vibrate(500);
    }

    if (event.calling_object_code && event.calling_object_code == this.object_mast.object_code) {
      this.globalobjects.refreshId++;
    }

    this.sessionObj = event.sessionObj;

    let nextPageInfo: any = {};
    nextPageInfo.click_events_str = clickEventStr ? clickEventStr : event.click_events_str;




    if (event.event_return_id) {
      nextPageInfo.event_return_id = event.event_return_id;
      nextPageInfo.keyIndex = event.keyIndex;
      nextPageInfo.eventStr = event.eventStr;
    }

    if (event.wsdp) {
      nextPageInfo.wsdp = event.wsdp;
    }
    nextPageInfo.wscp = {};


    if (event.calling_parameter_str) {
      if (event.calling_parameter_str.toLowerCase().indexOf('no_back') > -1) {
        nextPageInfo.no_back = true;
      }
    }

    if (this.object_mast.Level2[this.page_no].origin_apps_item_seqid) {
      nextPageInfo.wscp.origin_apps_item_seqid = this.object_mast.Level2[this.page_no].origin_apps_item_seqid;
    }

    this.wscp.orignal_apps_page_frame_seqid = event.orignal_apps_page_frame_seqi ? event.orignal_apps_page_frame_seqi : this.holdWscp.orignal_apps_page_frame_seqid;
    this.wscp.orignal_apps_item_seqid = event.orignal_apps_item_seqid ? event.orignal_apps_item_seqid : this.holdWscp.orignal_apps_item_seqid;
    this.wscp.orignal_object_code = this.holdWscp.orignal_object_code;

    nextPageInfo.wscp.calling_parameter_str = event.calling_parameter_str;
    nextPageInfo.wscp.orignal_apps_page_frame_seqid = this.wscp.orignal_apps_page_frame_seqid ? this.wscp.orignal_apps_page_frame_seqid : '';
    nextPageInfo.wscp.orignal_apps_item_seqid = this.wscp.orignal_apps_item_seqid ? this.wscp.orignal_apps_item_seqid : '';
    nextPageInfo.wscp.orignal_object_code = this.wscp.orignal_object_code ? this.wscp.orignal_object_code : '';

    // nextPageInfo.wscp.platform = this.globalobjects.getLocallData('platformValue');
    nextPageInfo.wscp.iud_seqid = this.object_mast.Level2[this.page_no].iud_seqid;
    nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
    nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
    nextPageInfo.wscp.local_Item_Seq_Id = event.local_Item_Seq_Id;
    this.wscp.local_Item_Seq_Id = event.local_Item_Seq_Id;
    if (event.wscp) {
      if (event.wscp.apps_item_seqid) {
        nextPageInfo.wscp.apps_item_seqid = event.wscp.apps_item_seqid;
      }
    }
    if (event.prev_ws_seqid) {
      nextPageInfo.wscp.prev_ws_seqid = event.prev_ws_seqid;
    }

    nextPageInfo.wscp.object_code = event.calling_object_code;

    nextPageInfo.wscp.apps_working_mode = this.object_mast.apps_working_mode;
    nextPageInfo.wscp.item_sub_type = event.item_sub_type;
    nextPageInfo.wscp.pageno = event.calling_pageno;
    nextPageInfo.wscp.click_events_str = clickEventStr ? clickEventStr : event.click_events_str;




    // if (this.sessionObj) {
    //   for (var key in this.sessionObj) {
    //     nextPageInfo.wscp[key] = this.sessionObj[key];
    //   }
    // }

    nextPageInfo.object_mast = this.object_mast;



    if (frame && frame.apps_frame_type != 'TREE_TABLE') {
      if (event.wsdpcl && event.wsdpcl.length > 0) {
        // let frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seqid);
        // let ind = event.itemIndex != undefined ? event.itemIndex : (event.indexcount ? event.indexcount : (event.indexCount ? event.indexCount : 0));
        // let ind = event.indexcount != undefined ? event.indexcount : (event.itemIndex ? event.itemIndex : (event.indexCount ? event.indexCount : 0));
        let newInd = event.indexcount != undefined ? event.indexcount : (event.itemIndex ? event.itemIndex : (event.indexCount ? event.indexCount : 0));
        let ind = event.max_record ? event.max_record + newInd : newInd;

        event.wsdpcl[0][event.apps_page_frame_seqid.toUpperCase() + '-WRI'] = ind;

      }
    }
    nextPageInfo.wsdpcl = event.wsdpcl;
    nextPageInfo.sessionObj = event.sessionObj;

    if (this.globalobjects.callingPara.length > 0) {
      let newglob = [];
      for (let glob of this.globalobjects.callingPara) {
        if ((glob.objectCode == event.apps_page_frame_seqid.split("-")[0]) && (glob.itemCode == event.apps_item_seqid)) {

        } else {
          newglob.push(glob);
        }
      }
      this.globalobjects.callingPara = newglob;
    }

    if (this.globalobjects.callingParameter.length > 0 && event.calling_object_code) {
      let index = 0;

      for (let glob of this.globalobjects.callingParameter) {
        if (glob.obj_code == event.calling_object_code && glob.calling_item_seqid == event.apps_item_seqid) {
          this.globalobjects.callingParameter.splice(index, 1);
        }
        index++
      }
    }

    if (!itsFrame && event.itemClicked != 'load') {
      this.lhs_lib.clickEvent = event;
      this.clickEvent = event;
    }

    if (event.calling_object_code) {

      if (this.object_mast.timerObj) {
        let timerEv = this.globalobjects.timerEvents.filter(x => x.object_code == this.object_mast.object_code);

        if (timerEv && timerEv.length > 0) {
          for (let t of timerEv) {
            t.runEvFlag = false;
          }
        }
      }

      if (event.calling_object_code == "FI_APPS_ITEM_SEQID") {
        let name = event.apps_page_frame_seqid + "." + "FI_CALLING_PARAMETER_STR";
        let value = this.lhs_lib.get_item_value(name, 'current_record');
        event.calling_parameter_str = value;
      }

      // let userDetails = this.globalobjects.getLocallData("userDetails");
      let str = "";
      for (let usr in this.globalobjects.userDetails) {
        if (usr.substring(0, 2).toLowerCase() == "g_") {
          str = str + "app_add_para(false,\"" + usr.toLowerCase().replace("g_", "f_") + "\",\"" + this.globalobjects.userDetails[usr] + "\",true);";
        }
      }

      let f_str = this.lhs_lib.get_f_items();
      str = str + f_str;

      if (event.calling_parameter_str && event.calling_parameter_str.toLowerCase().indexOf("g-to-f;") > -1) {
        let gToF = this.lhs_lib.get_item_value("F_TO_G", event.itemIndex);
        if (gToF == "Y") {
          for (let usr in this.globalobjects.userDetails) {
            if (usr.substring(0, 2).toLowerCase() == "g_") {
              str = str + "app_add_para(false,\"" + usr.toLowerCase().replace("g_", "f_") + "\",\"" + this.globalobjects.userDetails[usr] + "\",true);";
            }
          }
        }
      }




      let glob = this.globalobjects.callingParameter.find(x => x.obj_code == this.clickEvent.calling_object_code && x.calling_item_seqid == this.clickEvent.apps_item_seqid);
      let loadStr = "";
      let strr = "";
      if (event.calling_object_load_events_str) {
        if (event.calling_object_load_events_str.indexOf(";") > -1) {
          let strArr = event.calling_object_load_events_str.split(";");
          for (let s of strArr) {
            if (s) {
              strr += s + ";";
            }
          }

          loadStr += `this.app_add_para(false,'p_on_object_load_events_str', \`${strr}\`);`
        } else {
          loadStr = `app_add_para(false,"p_on_object_load_events_str", \`${event.calling_object_load_events_str.replaceAll("\"", "'")}\`);`
        }
      }

      if (event.calling_parameter_str && event.calling_parameter_str.toLowerCase().indexOf("r-to-r;") > -1) {

        let tCode = this.lhs_lib.get_item_value("para.p_tcode", 0);
        let tnature = this.lhs_lib.get_item_value("para.p_tnature", 0);


        if (tCode && tnature && event.calling_tcode && event.calling_tnature) {
          if (tCode == event.calling_tcode && tnature == event.calling_tnature) {
            let rToR = this.lhs_lib.get_rights_items_str(this.object_mast.object_code + '-PARA');
            if (rToR) {
              loadStr = loadStr + rToR;
            }
          }

        }


      }

      if (glob) {
        glob.g_str = str;

        if (loadStr) {
          glob.g_str = str;
          glob.obj_load_str = loadStr;
        }
      } else {


        let obj: any = {
          obj_code: this.clickEvent.calling_object_code,
          calling_item_seqid: this.clickEvent.apps_item_seqid,
          g_str: str
        }
        if (loadStr) {
          obj.g_str = str;
          obj.obj_load_str = loadStr;
        }

        this.globalobjects.global_Parameter = str;
        this.globalobjects.callingParameter.push(obj);
      }
    }

    if (event.calling_parameter_str) {
      this.callingParaFunc(event);
    }

    return { nextPageInfo, frame, itsFrame };
  }
  async itemClicked_new(event, click_event_arr = null, frame?, itsFrame?, async_event?) {

    let clickEventStr = "";
  const supercomp=this;
    let event_arr = click_event_arr ?? this.event_que_arr;

    for await (let ev of event_arr) {


      if (!this.isEventRunning && !async_event) {
        return;
      }

      const res = this.preItem_clicked(event, clickEventStr, frame, itsFrame);
      let nextPageInfo = res.nextPageInfo;

      ({ frame, itsFrame } = res);
      const evLower = (ev || '').toLowerCase().trim();
      if (ev && ev.toUpperCase() != "SAME_PAGE") {
        this.globalobjects.samePageNo = 1;
      }

      if (ev.toUpperCase() == "OPEN_URL" || ev.toLowerCase() == "ws_open_url") {
        let click_events_str_arr = ev.split('~~');
        let windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
        let url = "";
        let urlPrefix = ""
        let type = "O";

        if (click_events_str_arr[1].indexOf('http://') > -1) {
          urlPrefix = "http://";
          url = click_events_str_arr[1].split("http://")[1];
        } else {
          urlPrefix = "https://";
          url = click_events_str_arr[1].split("https://")[1];
        }

        if (url.indexOf("#") > -1) {
          type = '#'
        } else if (url.indexOf(":") > -1) {
          type = ':'
        }

        if (type != "O") {
          for (let x in this.globalobjects.userDetails) {
            if (type == "#") {
              let itemName = "#" + x.toLowerCase() + "#";
              url = url.replace(itemName, this.globalobjects.userDetails[x]);
            } else {
              let itemName = ":" + x.toLowerCase();
              url = url.replace(itemName, this.globalobjects.userDetails[x]);
            }
          }

          for (let frame of this.object_mast.Level2[this.page_no].Level3) {
            if (frame.tableRows && frame.tableRows.length > 0) {
              if (frame.apps_page_frame_seqid == event.apps_page_frame_seqid) {
                let data = frame.tableRows[event.itemIndex];
                for (let obj of data) {
                  if (frame.apps_frame_type == 'TABLE') {
                    if (type == "#") {
                      let itemName = obj[0].item_name.toLowerCase();
                      url = url.replace("#" + itemName + "#", obj[0].value);
                    } else {
                      let itemName = ":" + obj[0].item_name.toLowerCase();
                      url = url.replace(itemName, obj[0].value);
                    }
                  } else {
                    if (obj.Level5 && obj.Level5.length > 0) {
                      for (let item of obj.Level5) {
                        if (type == "#") {
                          let itemName = item.item_name.toLowerCase();
                          url = url.replace("#" + itemName + "#", item.value);
                        } else {
                          let itemName = item.item_name.toLowerCase();
                          url = url.replace(":" + itemName, item.value);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (isPlatformServer(this.platformId)) return;
          window.open(urlPrefix + url, '_system', windowFeatures);
        } else {
          if (isPlatformServer(this.platformId)) return;
          window.open(urlPrefix + url, '_system', windowFeatures);
        }

      }

      else if (ev.toLowerCase().indexOf('execute_app_lib') > -1) {
        let str = "";
        str = ev.replaceAll('EXECUTE_APP_LIB(', "execute_app_lib(");
        str = str.replace("execute_app_lib(", "");
        str = str.substr(0, str.length - 1);
        this.execute_app_lib(str, event)
      } else if (this.isEvent(evLower)) {
        if (evLower.includes('app_close_tab(')) {
          // if (!this.plt && !this.isTab) 
          if (this.plt && this.isTab) { }
          else {
            this.app_back_page(event);
            break;
          }

        }

        ev = ev.replaceAll("await", "").trim();
        await this.executeDynamicEvent(ev, event);

        if (
          evLower.includes('app_execute_item(') ||
          evLower.includes('app_create_record(') ||
          evLower.includes('app_edit_record(') ||
          evLower.includes('app_delete_record(') ||
          evLower.includes('app_create_table_record(') ||
          evLower.includes('set_item_value(') ||
          evLower.includes('app_clear_item(') ||
          evLower.includes('app_clear_record(') ||
          evLower.includes('populate_list(') ||
          evLower.includes('populate_list_force(')
        ) {
          // this.cdr.detectChanges();
        }
        if (evLower.includes("open_lov") || evLower.includes("open_multi_lov")) {
          if (event.lovEvent) {
            event.click_events_arr = [];
            event.eventCode = null;
            event.click_events_str = event.lovEvent.tempClickEntStr;
            delete event['lovEvent'];
          }
        }
        continue;
      }

      else if (((ev.toLowerCase().indexOf("app_open_page(") > -1) || ev.toUpperCase() == "NEXT_PAGE$$" || ev.toLowerCase().indexOf("app_next_page") > -1)) {
        if (ev.toLowerCase().indexOf("app_open_page(") > -1) {

          let str = this.lhs_lib_util(ev, nextPageInfo).replaceAll("event,", "nextPageInfo,");
          str = str.replace("nextPageInfo,", "event,");
          eval(str);
        } else {

          if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf("#") > -1) {
            if (event.page_no) {
              nextPageInfo.page_no = event.page_no;
              this.order_pageno = nextPageInfo.page_no;
            } else {
              nextPageInfo.page_no = this.page_no + 1;
            }
            let seqid_arr = event.calling_frame_seqid_str.split("#");
            let calling_frame_seqid_arr = [];
            for (let x of seqid_arr) {
              if (x) {
                calling_frame_seqid_arr.push(x);
              }
            }
            nextPageInfo.calling_frame_seqid_arr = calling_frame_seqid_arr;
            this.calling_frame_seqid_str_concat(nextPageInfo);
            this.openPage(nextPageInfo);
          } else {
            if (event.page_no) {
              nextPageInfo.page_no = event.page_no;
              this.order_pageno = nextPageInfo.page_no;
            } else {
              nextPageInfo.page_no = this.page_no + 1;
            }

            if (event.navigatePageNum != undefined && event.navigatePageNum != null) {
              nextPageInfo.page_no = event.navigatePageNum;
              nextPageInfo.wscp.clicked_index = event.itemIndex;
              this.app_open_page(event, nextPageInfo, event.navigatePageNum);
            } else {
              let str = this.lhs_lib_util(ev, event);
              eval(str);
            }
          }

        }

      }
      else if (ev.toUpperCase().indexOf("CONCAT") > -1) {
        let concatKey;

        if (ev.indexOf("(") > -1) {

          let str = ev.split("(")[1].split(")")[0].replaceAll("'", "");
          concatKey = str.split(",");

        } else {
          concatKey = ev.split('~');
        }
        nextPageInfo.concatKey = concatKey;
        this.concatFun(nextPageInfo, event, clickEventStr);

      } else if (ev.toLowerCase() == "execute_query_all_object") {
        ev = ev.toLowerCase();
        nextPageInfo.wscp.service_type = ev;
        await this.execute_plsql(nextPageInfo, event, clickEventStr);

      } else if (ev.toLowerCase() == 'app_plsql1_clob' || ev.toLowerCase() == 'app_plsql1_clob_force') {
        if (event.itemClicked != 'post' || (event.value || ev.toLowerCase().includes("_force")) || event.item_name.toLowerCase().includes("frame_record_")) {
          if (event.app_plsql1_clob) {
            let key = event.app_plsql1_clob;
            let value = this.convert_plsq_js.getConvertedScript(key);
            await this.execute_js(value, event, ev);
          } else {
            continue;
          }
        } else {
          continue;
        }

      } else if ((ev.toLowerCase() == 'app_plsql2_clob' || ev.toLowerCase() == 'app_plsql2_clob_force')) {
        if (event.itemClicked != 'post' || (event.value || ev.toLowerCase().includes("_force")) || event.item_name.toLowerCase().includes("frame_record_")) {
          if (event.app_plsql2_clob) {
            let key = event.app_plsql2_clob;
            let value = this.convert_plsq_js.getConvertedScript(key);
            await this.execute_js(value, event, ev);
          } else {
            continue;
          }
        } else {
          continue;
        }

      } else if (ev.toLowerCase() == 'app_plsql1_text' || ev.toLowerCase() == 'app_plsql1_text_force') {
        if (event.itemClicked != 'post' || (event.value || ev.toLowerCase().includes("_force")) || event.item_name.toLowerCase().includes("frame_record_")) {
          if (event.app_plsql1_text) {
            let key = event.app_plsql1_text;
            let value = this.convert_plsq_js.getConvertedScript(key);
            await this.execute_js(value, event, ev);
          } else {
            continue;
          }

        } else {
          continue;
        }

      } else if (ev.toLowerCase() == 'app_plsql2_text' || ev.toLowerCase() == 'app_plsql2_text_force') {
        if (event.itemClicked != 'post' || (event.value || ev.toLowerCase().includes("_force")) || event.item_name.toLowerCase().includes("frame_record_")) {
          if (event.app_plsql2_text) {
            let key = event.app_plsql2_text;
            let value = this.convert_plsq_js.getConvertedScript(key);
            await this.execute_js(value, event, ev);
          } else {
            continue;
          }
        } else {
          continue;
        }

      } else if (ev.toLowerCase() == 'app_js1_text' || ev.toLowerCase() == 'app_js2_text' ||
        ev.toLowerCase() == 'app_js1_text_force' || ev.toLowerCase() == 'app_js2_text_force') {
        if (event.itemClicked != 'post' || (event.value || ev.toLowerCase().includes("_force")) || event.item_name.toLowerCase().includes("frame_record_")) {
          let key = event[ev.toLowerCase().replaceAll("_force", "")];
          if (!key) {
            key = "";
          }
           if(key.includes('ajs_')){
            key = key.replaceAll("ajs_", "utilvar.dynamic_func.ajs_");;
           }
          await this.execute_js(key, event, ev);
        } else {
          continue;
        }
      }

      else if ((ev.toLowerCase().indexOf("app_required_frame") > -1)) {
        let service_type = ev;

        var regex4 = new RegExp("app_required_frame", "ig");
        var replace = "this.app_required_frame_loc(event,";

        let arr = service_type.match(regex4);
        for (let a of arr) {
          let fun = a + "("
          service_type = service_type.replaceAll(replace, fun).replaceAll(fun, replace);
        }

        let res = eval(service_type);

        if (res && res.rase) {
          this.clearQue();
        }
        continue;

      } else if (ev.toLowerCase().includes("app_required_record(")) {

        let service_type = ev;

        var regex4 = new RegExp("app_required_record", "ig");
        var replace = "this.app_required_record_loc(event,";

        let arr = service_type.match(regex4);
        for (let a of arr) {
          let fun = a + "("
          service_type = service_type.replaceAll(replace, fun).replaceAll(fun, replace);
        }

        let res = eval(service_type);

        if (res && res.rase) {
          this.clearQue();
        }

        // if (res.isValid && !res.rase && event.click_events_arr && event.click_events_arr.length > (event.click_events_count + 1)) {
        //   event.click_events_count = event.click_events_count + 1;
        //   this.itemClicked1(event, clickEventStr);
        // }
        continue;

      } else if (ev.toUpperCase() == "BACK_PAGE$$" || ev.toLowerCase() == "app_back_page") {
        console.log("app_back_page yaha se run ======>>>>>>>>>>>")
        this.app_back_page(event);
        break;
      } else if (ev.toUpperCase() == "POPUP_BACK_PAGE") {
        this.popupClosePage();
      } else if (ev.toLowerCase() == "go_home_page") {
        this.go_home_page();
        continue;
      } else if (ev == "UPDATE_IRFEILDS") {
        nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
        nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
        nextPageInfo.wscp.apps_page_no = event.apps_page_no;
        nextPageInfo.wscp.object_code = event.object_code;
        nextPageInfo.wscp.service_type = "UPDATE_IRFEILDS";
        this.saveData(nextPageInfo, event, ev, clickEventStr);
      } else if (ev.toLowerCase() == "when_new_form_instance" ||
        ev.toUpperCase() == "SAVE_FRAME_PKEY" ||
        ev.toLowerCase() == "execute_item_plsql" ||
        ev.toLowerCase() == "ora_plsql1_text" ||
        ev.toLowerCase() == "ora_plsql2_text" ||
        ev.toLowerCase() == "ora_plsql1_text_force" ||
        ev.toLowerCase() == "ora_plsql2_text_force" ||
        ev.toLowerCase() == "get_process_report_data") {

        nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
        nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
        nextPageInfo.wscp.apps_page_no = event.apps_page_no;
        nextPageInfo.wscp.object_code = event.object_code;
        nextPageInfo.wscp.service_type = ev.toLowerCase().replace("_force", "");

        /*  uncomment when calling_frame_seqid_str using . now this is done by plsql*/

        if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf("#") > -1) {
          let seqid_arr = event.calling_frame_seqid_str.split("#");
          let calling_frame_seqid_arr = [];
          for (let x of seqid_arr) {
            if (x) {
              calling_frame_seqid_arr.push(x);
            }
          }
          event.calling_frame_seqid_arr = calling_frame_seqid_arr;
        } else if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf(";") > -1) {
          let seqid_arr = event.calling_frame_seqid_str.split(";");
          let calling_frame_seqid_arr = [];
          for (let x of seqid_arr) {
            if (x) {
              calling_frame_seqid_arr.push(x);
            }
          }
          event.calling_frame_seqid_arr = calling_frame_seqid_arr;
        }
        //  calling_frame_seqid_arr.indexOf('#')

        if (event.itemClicked != 'post' || (event.value || ev.toLowerCase().includes("_force")) || event.item_name.toLowerCase().includes("frame_record_")) {
          await this.execute_plsql(nextPageInfo, event, clickEventStr);

          if (event.rase) {

            this.doAfterRaise(event);
            break;

          }
        } else {
          continue;
        }

      } else if (ev.toLowerCase().indexOf("execute_item_plsql") > -1) {
        let uniqKey = ev.split('~');
        let globKey = this.globalobjects.uniqueKey;
        if ((uniqKey[1] == 'unique') && (globKey == this.object_mast.Level2[this.page_no].iud_seqid)) {
          this.globalobjects.presentAlert('Your Transction is already in Queue.(message from app (unique))');
        } else {
          nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
          nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
          nextPageInfo.wscp.apps_page_no = event.apps_page_no;
          nextPageInfo.wscp.object_code = event.object_code;
          nextPageInfo.wscp.service_type = "execute_item_plsql";
          /*  uncomment when calling_frame_seqid_str using . now this is done by plsql*/
          if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf("#") > -1) {
            let seqid_arr = event.calling_frame_seqid_str.split("#");
            let calling_frame_seqid_arr = [];
            for (let x of seqid_arr) {
              if (x) {
                calling_frame_seqid_arr.push(x);
              }
            }
            event.calling_frame_seqid_arr = calling_frame_seqid_arr;
          } else if (event.calling_frame_seqid_str && event.calling_frame_seqid_str.indexOf(";") > -1) {
            let seqid_arr = event.calling_frame_seqid_str.split(";");
            let calling_frame_seqid_arr = [];
            for (let x of seqid_arr) {
              if (x) {
                calling_frame_seqid_arr.push(x);
              }
            }
            event.calling_frame_seqid_arr = calling_frame_seqid_arr;
          }
          this.globalobjects.uniqueKey = this.object_mast.Level2[this.page_no].iud_seqid;
          //  calling_frame_seqid_arr.indexOf('#')
          await this.execute_plsql(nextPageInfo, event, clickEventStr);
        }
      } else if (ev.toLowerCase().indexOf('go_approval_tab') > -1) {
        nextPageInfo.wscp.object_code = event.calling_object_code;
        nextPageInfo.wscp.item_sub_type = event.item_sub_type;
        nextPageInfo.wscp.pageno = event.calling_pageno;
        nextPageInfo.wscp.apps_page_frame_seqid = event.apps_page_frame_seqid;
        nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
        nextPageInfo.wscp.apps_page_no = event.apps_page_no;
        nextPageInfo.wscp.service_type = "APPROVAL_DETAIL";
        nextPageInfo.frame = this.object_mast.Level2[this.page_no].Level3;
        nextPageInfo.wslp = this.globalobjects.userDetails;
        this.open_model_page(event, nextPageInfo);
      } else if (ev.toLowerCase().indexOf('super_approval_tab') > -1 || ev.toLowerCase().indexOf('get_object_config_tab') > -1) {
        nextPageInfo.object_mast = [];
        nextPageInfo.wscp.object_code = event.calling_object_code;
        nextPageInfo.wscp.get_tab_count_pages = 'get_tab_count_pages';
        this.openPage(nextPageInfo);
      } else if (ev.toLowerCase() == 'go-multi-level-tab') {
        nextPageInfo.wscp.object_code = event.calling_object_code;
        nextPageInfo.wscp.item_sub_type = event.item_sub_type;
        nextPageInfo.wscp.pageno = event.calling_pageno;
        nextPageInfo.wscp.apps_page_frame_seqid = event.calling_frame_seqid_str;
        nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
        nextPageInfo.wscp.apps_page_no = event.apps_page_no;
        nextPageInfo.wscp.service_type = event.calling_object_code;
        nextPageInfo.frame = this.object_mast.Level2[this.page_no].Level3;
        nextPageInfo.wslp = this.globalobjects.userDetails;
        this.open_model_multilevel_page(nextPageInfo);
      } else if ((ev.toLowerCase().indexOf("populateExcel") > -1) || (ev.toLowerCase().indexOf("app_populate_excel") > -1)) {
        if (ev.indexOf("app_populate_excel") > -1) {
          let str = ev.replaceAll("'", "").replace("(", "~").split(")")[0];
          ev = str;
        }
        event.populateFrame = ev;
        this.pluginService.getexceldetail(event.target).then((data: any) => {
          this.moveExceltoFrame(event, data.head, data.tableBody);
        }, (error) => {
          this.globalobjects.presentAlert("Error while reading file. Please check required format and try again.");
        });

      } else if (ev.toLowerCase().includes("ws_file_upload(")) {
        let filePath = ev.split("(")[1].split(")")[0];
        //eval(filePath);
        if (!filePath) {
          this.globalobjects.presentAlert("Please specify filepath to upload...");
        } else if (event.files.length > 0) {
          event.value = null;
          if (event.files.length > 1) {
            this.clearQue();
            this.globalobjects.presentAlert("Only one file is allowed to upload...");
            return;
          } else {
            this.dataService.uploadFileToServer(event.files[0], eval(filePath));
          }
        } else {
          this.clearQue();
          this.globalobjects.presentAlert("Please select file to upload...");
          return;
        }
        continue;
      } else if (ev.toUpperCase().indexOf("FILE_UPLOAD") > -1) {
        if (event.files.length > 0) {
          event.value = null;
          for await (let file of event.files) {
            try {

              let data: any = await this.globalobjects.converToBase64(file);

              if (data) {
                // .then((data: any) => {
                if (file.name) {
                  let fileName = file.name.toLowerCase()
                  if (fileName.includes('.jpeg') || fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.gif')) {
                    event.imgData = this.sanitizer.bypassSecurityTrustUrl(data);
                  }
                }
                event.converToBase64imgData = data
                event.value = event.value ? (event.value + data.split(",")[1]) : data.split(",")[1];
                event.value = event.value + "~" + file.name.replace(/\s/g, '_') + "#";
              }
            } catch (error) {
              this.clearQue();
              this.globalobjects.presentAlert("Error while reading file...");
              return;
            }


          }

          this.lhs_lib.refreshFrameItems[event.apps_item_seqid + '_' + (event.indexcount ?? 0) + '#' + event.apps_page_frame_seqid] = "Y";
          this.lhs_lib.refreshFrameItems[event.apps_item_seqid + '_' + (event.indexcount ?? 0) + '#' + event.apps_page_frame_seqid + 'A'] = "Y";
        } else {
          this.clearQue();
          this.globalobjects.presentAlert("No file selected...");
          return;
        }

        continue;

      } else if (ev.toLowerCase() == "calender") {
        this.addCalender(event);
      } else if (ev.toLowerCase().indexOf("app_clear_object") > -1) {
        let objectMast = this.lhs_lib.get_object_config();
        for (let mast of objectMast.Level2) {
          for (let frame of mast.Level3) {
            if (frame.apps_page_frame_seqid != (objectMast.object_code + "-PARA")) {
              frame.tableRows = [];
              if (frame.Level4 && frame.Level4.length > 0) {
                frame.tableRows[0] = JSON.parse(JSON.stringify(frame.Level4));
              }
              this.processData.afterTableRows(frame);
            }
          }
        }
        continue;
      } else if (ev.toLowerCase().includes("ws_ora_file_upload(")) {
        let filePath = ev.split("(")[1].split(")")[0];
        if (!filePath) {
          this.globalobjects.presentAlert("Please specify doc_code to upload...");
        } else if (event.files.length > 0) {
          event.value = null;
          for (let file of event.files) {
            this.globalobjects.converToBase64(file).then((data: any) => {
              event.value = event.value ? (event.value + data.split(",")[1]) : data.split(",")[1];
              if (filePath.indexOf(".") > -1) {
                event.value = event.value + "~" + filePath + "#";
              } else {
                let filename = filePath + "." + file.name ? file.name.split(".")[1] : "";
                event.value = event.value + "~" + filename + "#";
              }

            }, (error) => {
              this.globalobjects.presentAlert("Error while reading file...");
            });
          }
        } else {
          this.globalobjects.presentAlert("No file selected...");
        }
      } else if (ev.toLowerCase().includes("ws_file_upload(")) {
        let filePath = ev.split("(")[1].split(")")[0];
        if (!filePath) {
          this.globalobjects.presentAlert("Please specify filepath to upload...");
        } else if (event.files.length > 0) {
          event.value = null;
          if (event.files.length > 1) {
            this.globalobjects.presentAlert("Only one file is allowed to upload...");
          } else {
            this.dataService.uploadFileToServer(event.files[0], eval(filePath));
          }
        } else {
          this.globalobjects.presentAlert("Please select file to upload...");
        }
      } else if (ev.toLowerCase().includes("ws_file_download(")) {
        let filePath = ev.split("(")[1].split(")")[0];
        if (!filePath) {
          this.globalobjects.presentAlert("Please specify filepath to upload...");
        } else {
          filePath = filePath.replace(/\\/g, "/").replace(/'/g, '');
          if (filePath.toLowerCase() == "file_path") {
            filePath = this.lhs_lib.get_item_value("FILE_PATH", event.itemIndex);
          }
          let obj = {
            obj: {
              value: filePath
            }
          }
          this.pluginService.download(obj);
        }
      } else if (ev.toUpperCase() == "SEND_SMS") {
        this.sendSms(event);
      } else if (ev.toLowerCase() == "send_hardcoded_email" || ev.toLowerCase() == "send_hardcoded_email_attch") {
        this.sendEmail(event, ev, clickEventStr);
      } else if (ev.toUpperCase() == "SEND_WHATSAPP") {
        this.shareViaWhatsApp(event, clickEventStr);
      } else if (ev.toLowerCase() == "call_logs") {
        nextPageInfo.wscp.object_code = event.calling_object_code;
        nextPageInfo.wscp.item_sub_type = event.item_sub_type;
        nextPageInfo.wscp.pageno = event.calling_pageno;
        nextPageInfo.wscp.apps_page_frame_seqid = event.calling_frame_seqid_str;
        nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
        nextPageInfo.wscp.apps_page_no = event.apps_page_no;
        nextPageInfo.wscp.service_type = "call_logs";
        this.callLogs(nextPageInfo, event, clickEventStr);
      } else if (ev.toUpperCase().indexOf("START_TRACKING") > -1) {
        let event_str = ev;
        let interval_time: any = 5;
        if (event_str.indexOf("~")) {
          interval_time = event_str.split("~")[1];
        }
        event.interval_time = interval_time;
        this.trackingEvent("START", event, clickEventStr);
      } else if (ev.toUpperCase() == "END_TRACKING") {
        this.background.bgmode = true;
        this.trackingEvent("END", event, clickEventStr);
      } else if (ev.toLowerCase().indexOf("exit_pages_refresh") > -1) {
        let event_str = ev;
        if (event_str.indexOf("~")) {
          this.globalobjects.frameSeqId = event_str.split("~")[1];
        }
        this.modalCtrl.dismiss();
      } else if (ev.toLowerCase() == "get_object_config_exit") {

        console.log("get_object_config exit called=============>  ", event);
        event.open_new_page = true;
        event.object_code = event.calling_object_code;

        this.wscp.orignal_apps_page_frame_seqid = event.apps_page_frame_seqid;
        this.wscp.orignal_apps_item_seqid = event.apps_item_seqid;
        this.wscp.orignal_object_code = event.object_code;

        this.canvasModal.popDismiss(event);
        if (this.isModal == "M" || this.isModal == "Menu") {
          this.triggerClickEvent();
          this.breadCrumpClose();
        } else if (this.isModal == "O") {
          const canvas: any = document.querySelectorAll("#deskcardCanvas")
          const event: any = new Event('click');
          let dispatchCanvas = canvas[canvas.length - 1]
          dispatchCanvas.dispatchEvent(event)
        } else if (this.isModal == "P") {
          const canvas = document.querySelectorAll("#globalNewModal")
          const event: any = new Event('click');
          let dispatchCanvas = canvas[canvas.length - 1]
          dispatchCanvas.dispatchEvent(event)
        }
      } else if (ev.toUpperCase() == "SEND_NOTIFICATION") {
        this.sendNotification(event, clickEventStr);
      }
      else if (ev.toUpperCase() == "SEND_HTML_MAIL") {
        this.sendHtml(event);
      }
      else if (ev.toUpperCase() == "SWITCH_SMART_VIEW") {
        this.switchSmart(event);
      }
      else if (ev.toLowerCase().indexOf("SWITCH_SMART_VIEW~") > -1) {
        let switchFrames = [];
        switchFrames = ev.split('~');
        event.switchFrames = switchFrames;
        this.switchSmart(event);
      }
      else if (ev.toLowerCase() == "get_object_config_all_exit") {
        location.reload();
      }

      else if (ev.toUpperCase().indexOf("REFRESH_FRAME$$") > -1 || ev.toLowerCase().indexOf("app_reload_frame") > -1) {

        if (ev.indexOf("REFRESH_FRAME") > -1) {
          nextPageInfo.clickEvt = ev;
        } else {
          let str = ev.split("(")[1].replace(")", "").replaceAll("'", "");
          nextPageInfo.clickEvt = str;
        }
        nextPageInfo.wscp.item_sub_type = event.item_sub_type;
        nextPageInfo.wscp.apps_item_seqid = event.apps_item_seqid;
        nextPageInfo.click_events_arr = event.click_events_arr
        nextPageInfo.click_events_count = event.click_events_count
        nextPageInfo.wscp.object_code = event.object_code;

        event.clickEvt = nextPageInfo.clickEvt;
        event.wscp = nextPageInfo.wscp;
        event.wsdp = nextPageInfo.wsdp;
        event.wsdpcl = nextPageInfo.wsdpcl;
        this.app_reload_frame(event, event.clickEvt);

      }

      else if (ev.toLowerCase() == "openfile") {
        this.openFileOnServer(event);
      } else if (ev.toUpperCase() == "SEND_EMAIL") {
        this.sendEmailJava(event, clickEventStr);
      } else if (ev.toLowerCase() == "open_in_browser") {
        if (this.platform.is('ios') || this.platform.is('android')) {
          this.globalobjects.presentAlert("This page can be open in browser only...")
        } else {
          nextPageInfo.object_mast = [];
          this.openPage(nextPageInfo);
        }
      } else if (clickEventStr == "devEditItem") {

        nextPageInfo.object_mast = [];
        nextPageInfo.item_type = event.item_type;
        nextPageInfo.item_sub_type = event.item_sub_type;

        this.devEditItem(nextPageInfo);

      } else if (ev.toLowerCase().indexOf("validate_lov") > -1) {
        if (((event.lovValue != undefined && event.value != undefined && event.lovValue.toLowerCase() == event.value.toLowerCase()) ||
          (event.value == undefined || event.value == null)) && (event.validate_flag != 'T')) {
          continue;
        } else {
          await this.validate_lov(event);
          console.log("validate");
          continue;
        }
      } else if (ev.toUpperCase() == "SAME_OBJECT_REFRESH$$" || ev.toLowerCase().includes("app_reload_object")) {
        this.app_reload_object();
        continue;
      } else if (ev.toLowerCase().indexOf("delete_record") > -1) {
        eval("this.lhs_lib." + ev);
      } else if (ev.toLowerCase().indexOf("take_tablerows_copy") > -1) {
        this.take_tableRows_copy(event);
      } else if (ev.toLowerCase() == "itemwise_sql_populate_data" ||
        ev.toLowerCase() == "item_frame_sql_populate_data" ||
        ev.toLowerCase() == "execute_query" ||
        ev.toLowerCase() == "frame_sql_populate_data" ||
        ev.toLowerCase() == "execute_query_once") {

        if (ev.toLowerCase() == "execute_query_once") {
          if (event.executedQuery) {
            continue;
          } else {
            await this.getData(event, 'execute_query');
            delete event['executing_apps_page_frame_seqid'];
          }
        } else {
          await this.getData(event, ev);
          delete event['executing_apps_page_frame_seqid'];
        }
      } else if (ev.toLowerCase() == "multi_itemwise_sql_populate_data") {
        this.multiItemwiseData(event.apps_page_frame_seqid, event);
      } else if (ev.toLowerCase().indexOf("populate_from_procedure(") > -1) {
        let service_type = ev;

        var regex4 = new RegExp("populate_from_procedure", "ig");
        var replace = "populate_from_procedure(";

        let arr = service_type.match(regex4);
        for (let a of arr) {
          let fun = a + "("
          service_type = service_type.replaceAll(replace, fun).replaceAll(fun, replace);
        }
        let str = service_type.split("populate_from_procedure(")[1].split(")")[0];
        this.wscp.procedure_name = str + ")";
        await this.getData(event, 'populate_from_procedure');
        delete event['executing_apps_page_frame_seqid'];
      } else if (ev.toLowerCase().indexOf("populate_from_procedure_rc(") > -1) {
        let service_type = ev;

        var regex4 = new RegExp("populate_from_procedure_rc", "ig");
        var replace = "populate_from_procedure_rc(";

        let arr = service_type.match(regex4);
        for (let a of arr) {
          let fun = a + "("
          service_type = service_type.replaceAll(replace, fun).replaceAll(fun, replace);
        }


        let str = service_type.split("populate_from_procedure_rc(")[1].split(")")[0];
        this.wscp.procedure_name = str + ")";
        await this.getData(event, 'populate_from_procedure_rc');
        delete event['executing_apps_page_frame_seqid'];

      } else if (ev.toLowerCase() == "execute_query_preserve") {
        let frame = this.lhs_lib.get_frame_config(event.apps_page_frame_seqid);

        if (frame && frame.tableData && frame.tableData.length > 0) {
          await this.processData.populateRows(event, event.tableData);
          continue;
        } else {
          await this.getData(event, "execute_query");
          delete event['executing_apps_page_frame_seqid'];
        }
      } else if (ev.toLowerCase() == "all_itemwise_sql_populate_data") {
        let frameName = event.executing_apps_page_frame_seqid ? event.executing_apps_page_frame_seqid : event.apps_page_frame_seqid;
        this.getItemwiseData(frameName, event);
      } else if (ev.toLowerCase() == "execute_query_in_file") {
        await this.getData(event, "execute_query_in_file");
      } else if (ev.toLowerCase() == "download_template") {
        await this.getData(event, "download_template");
      } else if (ev.toLowerCase().includes("app_execute_batch(")) {
        await this.getData(event, "execute_batch");
      } else if (ev.toLowerCase().includes("app_gsp_service(")) {
        await this.getData(event, "gsp_service");
      } else if (ev.toLowerCase().includes("app_execute_api(")) {
        await this.getData(event, "app_execute_api");
      } else if (ev == "get_object_config~OTP") {
        this.openOtpPop(nextPageInfo);
      } else if (ev.toLowerCase().includes("app_delo(")) {
        let str = this.lhs_lib_util(ev, event);
        eval(str);
      } else {
        if (event.object_code) {
          nextPageInfo.object_mast = [];
          if (ev == "get_object_config_new") {
            this.get_object_config(event, null, "tab");
          } else if (ev == "get_object_config") {
            this.get_object_config(event);

          } else if (ev != "get_object_config") {
            alert("Please check events str :- " + ev);
          }
        }
      }


    }

    return;
  }

  async executeDynamicEvent(ev: string, event: any): Promise<any> {
    const normalized = this.lhs_lib_util_new(ev, event);
    return await this.eventEngine.run(normalized, event);
  }


  lhs_lib_util_new(value: string, event?: any): string {
    if (!value) return '';
    const supercomp=this
    let output = value;

    output = output.replaceAll('this.', '');
    output = output.replaceAll('supercomp.', '');
    output = output.replaceAll('event,', '');

    // protect quoted strings
    const doubMap: string[] = [];
    const singMap: string[] = [];

    const doubleQuote = output.match(/"(?:(?:\\"|[^"])*)"/g);
    if (doubleQuote?.length) {
      for (let i = 0; i < doubleQuote.length; i++) {
        doubMap.push(`@DOB-${i}@####${doubleQuote[i]}`);
        output = output.replaceAll(doubleQuote[i], `@DOB-${i}@`);
      }
    }

    const quotedStr = output.match(/'(?:(?:\\'|[^'])*)'/g);
    if (quotedStr?.length) {
      for (let i = 0; i < quotedStr.length; i++) {
        singMap.push(`@SING-${i}@####${quotedStr[i]}`);
        output = output.replaceAll(quotedStr[i], `@SING-${i}@`);
      }
    }

    // standard cleanup
    output = output.replace(/\balert\s*\(/gi, 'msgbox(');
    output = output.replace(/\bparseint\s*\(/gi, 'parseInt(');
    output = output.replace(/\bparsefloat\s*\(/gi, 'parseFloat(');

    // keep lov calls normalized
    output = output.replaceAll('open_lov(event,', 'open_lov(');
    output = output.replaceAll('open_lov_wd(event,', 'open_lov_wd(');
    output = output.replaceAll('open_multi_lov(event,', 'open_multi_lov(');

    // restore quoted strings
    for (const item of doubMap) {
      const [key, original] = item.split('####');
      output = output.replaceAll(key, original);
    }

    for (const item of singMap) {
      const [key, original] = item.split('####');
      output = output.replaceAll(key, original);
    }

    return output.trim();
  }

  isEvent(evLower) {

    if (
      evLower.includes('get_current_record(') ||
      evLower.includes('get_item_value(') ||
      evLower.includes('is_record_present(') ||
      evLower.includes('set_lwsdp(') ||
      evLower.includes('remove_lwsdp(') ||
      evLower.includes('plsql_to_js(') ||
      evLower.includes('clear_lwsdp(') ||
      evLower.includes('app_backup_frame(') ||
      evLower.includes('app_restore_frame(') ||
      evLower.includes('copy_json(') ||
      evLower.includes('app_open_advance_filter(') ||
      evLower.includes('app_close_tab(') ||
      evLower.includes('ws_open_url(') ||
      evLower.includes('ws_call_url(') ||
      evLower.includes('ws_call_api(') ||
      evLower.includes('app_execute_api(') ||
      evLower.includes('app_show_frame(') ||
      evLower.includes('app_execute_batch(') ||
      evLower.includes('app_gsp_service(') ||
      evLower.includes('get_item_search(') ||
      evLower.includes('set_item_search(') ||
      evLower.includes('set_dp_for_cb(') ||
      evLower.includes('server_host(') ||
      evLower.includes('timer(') ||
      evLower.includes('stop_timer(') ||
      evLower.includes('app_itemclicked(') ||
      evLower.includes('local_host(') ||
      evLower.includes('set_item_value(') ||
      evLower.includes('app_reload_frame(') ||
      evLower.includes('populate_list(') ||
      evLower.includes('populate_list_force(') ||
      evLower.includes('set_row_values(') ||
      evLower.includes('app_back_object(') ||
      evLower.includes('app_clear_record(') ||
      evLower.includes('async_a(') ||
      evLower.includes('async_s(') ||
      evLower.includes('get_row_values(') ||
      evLower.includes('app_required_item(') ||
      evLower.includes('app_required_record(') ||
      evLower.includes('app_required_frame(') ||
      evLower.includes('app_copy_record(') ||
      evLower.includes('app_paste_record(') ||
      // evLower.includes('app_back_page(') ||
      evLower.includes('stop_time(') ||
      evLower.includes('app_copy_frame(') ||
      evLower.includes('execute_json(') ||
      evLower.includes('app_paste_frame(') ||
      evLower.includes('get_item_config(') ||
      evLower.includes('get_item(') ||
      evLower.includes('set_item_config(') ||
      evLower.includes('set_visible_flag(') ||
      evLower.includes('set_enable_flag(') ||
      evLower.includes('set_matrix_item_config(') ||
      evLower.includes('set_rows_source_config(') ||
      evLower.includes('get_frame_config(') ||
      evLower.includes('set_frame_config(') ||
      evLower.includes('get_page_config(') ||

      evLower.includes('sum(') ||
      evLower.includes('count(') ||
      evLower.includes('count_d(') ||
      evLower.includes('avg(') ||
      evLower.includes('min(') ||
      evLower.includes('max(') ||
      evLower.includes('find(') ||
      evLower.includes('table_rows') ||
      evLower.includes('app_add_para(') ||
      evLower.includes('app_add_para_cp(') ||
      evLower.includes('app_add_para_lp(') ||
      evLower.includes('go_item(') ||
      evLower.includes('app_duplicate_record(') ||
      evLower.includes('app_execute_item(') ||
      evLower.includes('app_execute_frame(') ||
      evLower.includes('open_lov(') ||
      evLower.includes('open_lov_wd(') ||
      evLower.includes('open_multi_lov(') ||
      evLower.includes('app_clear_item(') ||
      evLower.includes('app_clear_frame(') ||
      evLower.includes('app_delete_record(') ||
      evLower.includes('search_item(') ||
      evLower.includes('app_create_table_record(') ||
      evLower.includes('app_create_record(') ||
      evLower.includes('app_edit_record(') ||
      evLower.includes('app_restore_record(') ||
      evLower.includes('app_selected_record(') ||
      evLower.includes('pass_frame_data(') ||
      evLower.includes('go_home_page(') ||
      evLower.includes('app_reload_object(') ||

      evLower.includes('get_object_config(') ||
      evLower.includes('app_append_next_page(') ||
      evLower.includes('get_ref_cursor(') ||
      evLower.includes('download_text(') ||
      evLower.includes('app_first_record(') ||
      evLower.includes('app_last_record(') ||
      evLower.includes('app_go_record(') ||
      evLower.includes('app_previous_record(') ||
      evLower.includes('app_next_record(') ||
      evLower.includes('next_iud_seqid(') ||
      evLower.includes('parseint(') ||
      evLower.includes('parsefloat(') ||
      evLower.includes('app_collapse_frame(') ||
      evLower.includes('app_uncollapse_frame(') ||
      evLower.includes('app_collapse_item(') ||
      evLower.includes('app_uncollapse_item(') ||
      evLower.includes('set_row_config(') ||
      evLower.includes('app_frame_fullscreen(') ||
      evLower.includes('release_for_input(') ||
      evLower.includes('lock_for_input(') ||
      evLower.includes('encrypt_value(') ||
      evLower.includes('msgbox(') ||
      evLower.includes('app_confirm_msg(') ||
      evLower.includes('sys_current_frame') ||
      evLower.includes('sys_last_frame') ||
      evLower.includes('sys_current_item') ||
      evLower.includes('sys_last_item') ||
      evLower.includes('sys_current_record') ||
      evLower.includes('set_item_config(') ||
      evLower === 'raise' ||
      evLower.includes('raise;') ||
      evLower.includes(';')
    ) {
      return true;
    } else {
      return false;
    }
  }



  ws_call_api(ev, para) {
    let url = 'generate-url';
    let data = this.globalobjects.wscp_para;
    // let data =
    //     {
    //       "action": "camera",
    //     "wbNo":1,
    //     "rowseq_id": 123,
    //     "ocrText": "MH40CJ9096",
    //     "apprBy": "ADMIN",
    //     "ws_seqid": 123,
    //     "entity_name": "Lighthouse",
    //     "appkey":"l.v7cerp",
    //     "embedded_mode": true,
    //     "api_war_name": "lhsws_wma",
    //     "iud_seqid": 123456
    // }
    // {
    //   "action":"camera",
    //   "wbNo":"1",
    //   "rowseq_id":  "123",
    //   "ocrText":"MH40CJ9096",
    //   "apprBy":"ADMIN",
    //   "ws_seqid":"123",
    //   "entity_name":"Lighthouse",
    //   "appkey":"l.v7cerp",
    //   "embedded_mode":"true",
    //   "api_war_name":"lhsws_wma",
    //   "iud_seqid":"321"
    // }



    this.dataService.processRequest(url, data).then((res: any) => {
      if (res.responseStatus && res.responseStatus.includes("success")) {
        console.log("Camera URL : ", res.responseHead);
        let response = res.responseHead;

        let url = response.para_value;
        if (para == 'P') {
          this.presentPopoverNew(url);
        } else {
          this.openDmsPortal(url);
        }
        // this.showCameraPopup = true;
        // this.safeCameraUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        // console.log(  "Safe Camera URL : ",this.safeCameraUrl);
      }

    });
  }



  async presentPopoverNew(dataObj: any) {
    let component = CameraComponent
    let componentProps = { dataObj: dataObj }
    let id = "openCameraPopover"
    let cssClass = ""
    this.canvasModal.openModal(component, componentProps, id, cssClass).then((detail) => {

    })
  }

  // async presentPopoverNew(dataObj: any) {
  //     const popover = await this.popOverCtrl.create({
  //       component: CameraComponent,
  //       componentProps: { dataObj: dataObj },
  //       // event: ev,
  //       id: 'openCameraPopover',
  //       translucent: true,
  //       backdropDismiss: true // Allows dismiss by clicking outside
  //     });

  //     await popover.present();

  //     const { role } = await popover.onDidDismiss();
  //     console.log(`Popover dismissed with role: ${role}`);
  //   }

  shortcutLinks() {
    let id = 'offcanvasRightshortcutlink';
    let cssClass = 'offcanvasRight';
    let title = "";
    let componentProps = {
      test: "shortcut"
    }
    this.canvasModal.openoffCanvas(ShortkeyComponent, componentProps, id, cssClass, title).then((detail: OverlayEventDetail) => {
      if (detail.data) {
        console.log(detail.data);
        this.setPersonaliseDatafuncdata(detail.data);

        // this.getdataFromcanvasApex(detail.data)
        // this.wsdpcl=this.lhs_lib.getDpcl();
        // this.itemClicked(value.data);
      }
    })

  }

  call_async_clicked(event, click_event_arr = null, frame?, itsFrame?) {
    this.async_itemClicked_new(event, click_event_arr, frame, itsFrame).then(() => {
      this.lhs_lib.refresh_frames();
    })
  }

  async_itemClicked_new(event, click_event_arr = null, frame?, itsFrame?): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.itemClicked_new(event, click_event_arr, frame, itsFrame, true);

        resolve('sucess');

      } catch (err) {
        console.log(err);
        this.clearQue();
        resolve('error')
      }
    })
  }

  // openDmsPortal(url){
  // window.open(url, '_blank');
  // }
  dmsPortalTabRef: any = null;
  dmsPortalUrl: string = '';

  openDmsPortal(url: string) {


    if (this.dmsPortalTabRef && !this.dmsPortalTabRef.closed) {
      this.dmsPortalTabRef.focus();
      return;
    }


    const newTab = window.open('', '_blank');

    if (!newTab) {
      alert('Popup blocked! Please allow popups.');
      return;
    }

    this.dmsPortalTabRef = newTab;
    this.dmsPortalTabRef.document.write('<p>Loading DMS Portal...</p>');

    // ✅ CASE 3: Reuse cached URL
    // if (this.dmsPortalUrl) {
    //   this.dmsPortalTabRef.location.href = this.dmsPortalUrl;
    //   return;
    // }

    // ✅ CASE 4: Open provided URL
    this.dmsPortalUrl = url; // cache URL

    this.dmsPortalTabRef.location.href = url;
    this.dmsPortalTabRef.focus();
  }


  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: any) {
    //For show alt key highlight
    if (event.altKey) {
      // Prevents Chrome from moving focus to the browser window menu
      event.preventDefault();
      this.globalobjects.toggle_shortcutkey_tooltip.set(true); // code by arti
    }

    if (!(event.altKey || event.ctrlKey || event.shiftKey || /^F([13-8]|1[0-2])$/i.test(event.key))) return;// allow only function keys or combo keys, this is to avoid conflict with normal typing and also to avoid performance issue as this method will be called on every key press
    if (event.key === 'Control' || event.key === 'Alt' || event.key === 'Shift') return
    console.log("shortcut key after check : ", event);
    if (!this.getActiveobjectCode()) return;// check current object is active or not, if not active then return and do not process shortcut, this is to avoid shortcut conflict between different objects

    // 🚫 1. Skip browser / OS reserved shortcuts
    if (this.isReservedShortcut(event)) return;

    // 🚫 2. Allow only function keys or combo keys
    if (!this.isFunctionOrCombo(event)) return;

    // ✅ 3. Process ERP shortcut
    const combo = this.getPressedCombo(event);
    // const item = this.shortcutMap.get(combo);

    let name = this.lhs_lib.sys_current_frame ? this.lhs_lib.sys_current_frame + '.PB_' + combo : 'PB_' + combo;
    let item = this.lhs_lib.get_item(name, 'current_record');

    if (!item) {
      name = 'PB_' + combo;
      item = this.lhs_lib.get_item(name, 'current_record');
    }

    console.log(name);

    if (item) {
      console.log(combo);
      event.preventDefault();

      this.itemClicked(item);
      this.globalobjects.toggle_shortcutkey_tooltip.set(false);
    } else {
      this.alises_shortcutkey_Call(combo);  // code by arti
    }
    // this.btnClick(item);
  }

  isReservedShortcut(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();

    // Ctrl based browser shortcuts
    if (event.ctrlKey && !event.altKey) {
      const blocked = ['s', 'p', 'f', 'r', 'w', 't', 'n', 'h', 'j', 'k'];
      if (blocked.includes(key)) return true;
    }

    // Ctrl + Shift (Dev tools etc.)
    if (event.ctrlKey && event.shiftKey) {
      const blocked = ['i', 'j', 'c'];
      if (blocked.includes(key)) return true;
    }

    // Alt navigation keys
    if (event.altKey && !event.ctrlKey) {
      const blocked = ['arrowleft', 'arrowright', 'r', 'q', 'l'];
      if (blocked.includes(key)) return true;
    }

    // Function keys with strong browser behavior
    const blockedFn = ['f5', 'f11', 'f12'];
    if (blockedFn.includes(key)) return true;

    return false;
  }

  isFunctionOrCombo(event: KeyboardEvent): boolean {
    const isFunctionKey = /^F([1-9]|1[0-2])$/i.test(event.key);
    const hasModifier = event.ctrlKey || event.altKey || event.shiftKey;
    return isFunctionKey || hasModifier;
  }

  getPressedCombo(event: KeyboardEvent): string {
    const parts: string[] = [];

    if (event.ctrlKey) parts.push('CTRL');
    if (event.altKey) parts.push('ALT');
    if (event.shiftKey) parts.push('SHIFT');

    parts.push(event.key.toUpperCase());

    return parts.join('_');
  }
  getActiveobjectCode() {
    for (let dt of this.lhs_lib.adata) {
      if (dt.active && dt.object.object_code === this.object_mast.object_code) {
        if (dt.breadcrumbBar && dt.breadcrumbBar.length > 0) {
          if (dt.breadcrumbBar[dt.breadcrumbBar.length - 1].apps_page_no == (this.page_no + 1).toString()) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
    return false;
  }

  set_error_msg(name, msg, index) {
    let item = this.lhs_lib.get_item(name, index);

    if (item) {
      item.forced_error_msg = msg;
      this.cdEngine.detect(item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + item.apps_page_frame_seqid);
    }
  }

  remove_error_msg(name, index) {
    let item = this.lhs_lib.get_item(name, index);

    if (item) {
      delete item['forced_error_msg'];
      this.cdEngine.detect(item.apps_item_seqid + '_' + (item.indexcount ?? 0) + '#' + item.apps_page_frame_seqid);
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // Check if the key that was just released is the 'Alt' key itself
    // if (event.key === 'Alt') {
    this.globalobjects.toggle_shortcutkey_tooltip.set(false);  // code by arti
    // }
  }

  alises_shortcutkey_Call(combo) {
    let shortkey_name_list = this.lhs_lib.get_shortkey_name(combo);
    if (shortkey_name_list) {
      let shortkey_name = shortkey_name_list.find(list => list.page_no == (this.page_no + 1).toString());
      if (shortkey_name) {
        if (shortkey_name.value && shortkey_name.value.length > 0) {
          if (shortkey_name.value.length == 1) {
            let item = this.lhs_lib.get_item(shortkey_name.value[0].frameSeqid + "." + shortkey_name.value[0].itemName, 'current_record');
            this.globalobjects.toggle_shortcutkey_tooltip.set(false);
            this.itemClicked(item);
          } else {
            let value: any = {};
            if (this.shortcutkey_count && this.shortcutkey_count.key == combo) {
              this.shortcutkey_count.count = this.shortcutkey_count.count + 1;
              if (this.shortcutkey_count.count > (shortkey_name.value.length - 1)) {
                this.shortcutkey_count.count = 0;
              }
              value = shortkey_name.value[this.shortcutkey_count.count];
            } else {
              this.shortcutkey_count = {
                key: combo,
                count: 0
              };
              value = shortkey_name.value[0];
            }
            this.lhs_lib.go_item_from_alt(value.frameSeqid + "." + value.itemName, 'current_record', true);
          }
        } else {
          return;
        }
      } else {
        return;
      }
    } else {
      return;
    }
  }

  async app_delo(object_code) {
    await this.sqlLiteServ.deleteObject(object_code);
  }


  sidebar:boolean = true;

  toggleSideMenubar(){
    this.sidebar = !this.sidebar;
  }

  mobileViewQuickAction() {
    if (this.globalobjects.layoutObject && this.globalobjects.layoutObject.length > 0) {
      if (this.object_mast && this.object_mast.Level2 && this.object_mast.Level2[this.page_no]) {
        for (let frame of this.object_mast.Level2[this.page_no].Level3) {
          if (frame.apps_frame_sub_type == 'QUICK_ACTION_BUTTON') {
            for (let object of this.globalobjects.layoutObject) {
              for (let obj of object.Level2) {
                for (let lFrame of obj.Level3) {
                  if (lFrame.apps_frame_type == 'SYSTEM' && lFrame.apps_frame_sub_type == 'LAYOUT_OPTION') {
                    // let arr = [...frame.tabelRows,...lFrame.tableRows];
                    lFrame.quick_buttons = frame.tableRows;
                    this.globalobjects.layoutObject = [...this.globalobjects.layoutObject];
                    return;
                  }
                }
              }
            }

          }
        }

      }
      for (let object of this.globalobjects.layoutObject) {
        for (let obj of object.Level2) {
          for (let lFrame of obj.Level3) {
            if (lFrame.apps_frame_type == 'SYSTEM' && lFrame.apps_frame_sub_type == 'LAYOUT_OPTION') {
              if (lFrame.quick_buttons) {
                delete lFrame['quick_buttons'];
                this.globalobjects.layoutObject = [...this.globalobjects.layoutObject];
                return;
              }

            }
          }
        }
      }
    }
  }

}
