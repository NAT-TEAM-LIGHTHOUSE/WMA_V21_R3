import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle,IonFooter, IonToolbar } from '@ionic/angular/standalone';
import { MyTabsComponent } from './my-tabs/my-tabs.component';
import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import {  ModalController, PopoverController,ToastController } from '@ionic/angular/standalone';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserLoginComponent } from 'src/app/components/frames/user-login/user-login.component';
import { QuickActionModalComponent } from 'src/app/components/layout/quick-action-modal/quick-action-modal.component';
import { RightBarComponent } from 'src/app/components/layout/right-bar/right-bar.component';
import { UserRoleComponentComponent } from 'src/app/components/layout/user-role-component/user-role-component.component';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { DevObjectMastEditorPage } from '../dev-object-mast-editor/dev-object-mast-editor.page';
import { PopoverPage } from '../popover/popover.page';
import { SuperPage } from '../super/super.page';
import { AiAssistentComponent } from 'src/app/components/layout/ai-assistent/ai-assistent.component';
import { MyTabComponent } from './my-tab/my-tab.component';
import { SuperHeaderBarComponent } from 'src/app/components/layout/super-header-bar/super-header-bar.component';
import { LeftBarComponent } from 'src/app/components/layout/left-bar/left-bar.component';
import { TabSectionComponent } from 'src/app/components/layout/tab-section/tab-section.component';

@Component({
  selector: 'app-super-parent',
  templateUrl: './super-parent.page.html',
  styleUrls: ['./super-parent.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader,IonFooter, IonTitle, IonToolbar, CommonModule, FormsModule,MyTabComponent,SuperHeaderBarComponent,LeftBarComponent,RightBarComponent,TabSectionComponent,AiAssistentComponent,SuperPage,MyTabsComponent,MyTabComponent],
  providers: [CanvasModalService]
})
export class SuperParentPage implements OnInit {

  model: boolean = true;

  // private _modalCtrl: ModalController | null = null;
  // private _popOverCtrl: PopoverController | null = null;
  // private _popoverController: PopoverController | null = null;
  // private _toastController: ToastController | null = null;

  // private get modalCtrl(): ModalController {
  //   if (!this._modalCtrl) {
  //     this._modalCtrl = this.injector.get(ModalController);
  //   }
  //   return this._modalCtrl;
  // }

  // private get popOverCtrl(): PopoverController {
  //   if (!this._popOverCtrl) {
  //     this._popOverCtrl = this.injector.get(PopoverController);
  //   }
  //   return this._popOverCtrl;
  // }

  // private get popoverController(): PopoverController {
  //   if (!this._popoverController) {
  //     this._popoverController = this.injector.get(PopoverController);
  //   }
  //   return this._popoverController;
  // }

  // private get toastController(): ToastController {
  //   if (!this._toastController) {
  //     this._toastController = this.injector.get(ToastController);
  //   }
  //   return this._toastController;
  // }

  @ViewChild('superTemplate') superTemplate;
  @ViewChild(MyTabsComponent) tabsComponent: MyTabsComponent;
  data: any;
  isModalOpen = false;
  wscp: any;
  wsdpcl: any;
  wsud: any = {};
  page_no: number = 0;
  object_mast: any;
  wsdp: any;
  isTab: any;
  superId: any;
  click_events_str: any
  isModal: any = "Menu";
  userDetails: any
  backdismiss: boolean = false;
  sessionObj: any;
  upArrowon: boolean = true;
  toggleSideMenu: boolean = true;
  notificationCount: any;
  toggleNotification: boolean;

  constructor(public globalobjects: GlobalObjectsService,
    public events: Events,
    public http: HttpClient, public platform: Platform,
    public lhs_lib: LhsLibService,
    public sanitizer: DomSanitizer,
    private canvasModal: CanvasModalService, private modalGlobal: CanvasModalService, private sqlLiteServ: SqlLiteService, private router: Router, private modalCtrl:ModalController) {
      if(!this.globalobjects.userDetails){
        this.globalobjects.userDetails = this.globalobjects.getLocallData("userDetails");
      }

      this.userDetails = this.globalobjects.userDetails;
      this.subscribeEvents();
      if(this.globalobjects.pagesFlag){
      return applyLoggingDecorator(this,"super-parent-page")
    }
  }

  ngAfterViewInit(): void {
    this.updateObjInFirst();
  }

  ngOnInit() {
    if (!this.globalobjects.layoutObject) {
      this.sqlLiteServ.getById('layout_object_mast', 'object_master').then(data => {
        if (data.resStatus == 'Success') {
          this.globalobjects.layoutObject = JSON.parse(data.resData.objMast);
        }
      });
    }

    this.wscp = this.wscp || {};
    this.wsdp = this.wsdp || [];
    this.wsdpcl = this.wsdpcl || [];
    if (this.data) {
      this.wscp = this.data.wscp;
      this.wsdpcl = this.data.wsdpcl;
      if (this.data.page_no) {
        this.page_no = this.data.page_no
      }
      this.object_mast = this.data.object_mast
      this.wsdp = this.data.wsdp
      this.click_events_str = this.data.click_events_str
      this.isModal = this.data.isModal;
    }
  }

  updateObjInFirst() {
    if (!this.object_mast || !this.tabsComponent) {
      return;
    }

    const tabs = this.tabsComponent.tabs;
    if (tabs && tabs.first) {
      tabs.first.object_data = this.object_mast;
      return;
    }

    if (typeof this.tabsComponent.updateTab === 'function') {
      this.tabsComponent.updateTab(this.object_mast);
    }
  }

    head=[]
  openObject(data) {
    this.tabsComponent.openTab('loading...', this.superTemplate, data, true);
    this.head=[]
    for(let tab of this.lhs_lib.dynamicTabs){
      this.head.push({active:tab.instance.active,title:tab.instance.title})
    }
  }
  selectTabParent(i){
    this.selectTab(this.lhs_lib.dynamicTabs[i].instance)
  }
  selectTab(data) {
    if(this.globalobjects.isNotOpenTab()){
      return;
    }
    this.tabsComponent.selectTab(data);
    if(data.tabIndex){
      for(let [index,tab] of this.head.entries()){
        if((data.tabIndex-1)==index){
          tab.active=true
        }else{
          tab.active=false
        }
      }
    }else{
      for(let tab of this.head){
          tab.active=false
      }
    }
  }

  closeTab(i,event?) {
    // this.events.publish(data.instance.superId,{ type: "tab_close_event", flag: "T" })
     this.closeTabData(this.lhs_lib.dynamicTabs[i],i+1)
     this.tabAfterClose()
     
  }

  closeAllTabs(){
    let component = PopoverPage
    let componentProps = { isClosePopup:true }
    let id = "closeAllPopup"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, "", cssClass).then((detail) => {
      if(detail && detail.data=="Y"){
        for (let i = this.lhs_lib.dynamicTabs.length - 1; i >= 0; i--) {
          const tab = this.lhs_lib.dynamicTabs[i];
          // this.events.publish(tab.instance.superId, { type: "tab_close_event", flag: "T" });
          this.closeTabData(tab,i+1)
        }
        this.tabAfterClose()
      }
    })
  }


   closeTabData(data, i){
    this.tabsComponent.closeTab(data, i);
    this.head=this.head.filter((v,ind)=>ind!=(i-1))
  }
  tabAfterClose(){
    if(this.head && this.head.length>0){
      for(let [index,tab] of this.head.entries()){
        if(index==(this.head.length-1)){
          tab.active=true
        }else{
          tab.active=false
        }
      }
    }
  }
  updateTab(data) {
    this.tabsComponent.updateTab(data);
  }

  /* start Open offcanvas and tab compoment*/
  async openNotification() {
    if (this.isModal == "M") {
      this.modalCtrl.dismiss();
    }
    let componentProps: any = {};
    let wslp: any = {};
    this.wscp = {};
    let wsdp: any = [];
    wslp = this.userDetails;
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
    modal.onDidDismiss().then((detail: any) => {
      // this.lhs_lib.object_mast = this.object_mast;
      // this.afterDestroy();
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
    });
    return await modal.present();
  }

  async AdminNew(ev: any) {
    let component = UserLoginComponent
    let componentProps = ""
    let id = "userLogin_menubar"
    let cssClass = ""
    let event = ev
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((detail) => { 
      if(detail.data=="ChangeLoginParameter"){
        // this.router.navigate(['usersetting'])
        //  this.router.navigateByUrl('usersetting')
        this.router.navigateByUrl('/usersetting', { replaceUrl: true });
      }else if(detail.data=="ChangepasswordLinks") {
         let id = 'offcanvasRightChangepasswordlink';
            let cssClass = 'offcanvasRight';
            let title = ""
            let componentProps = {
              test: "Change password"
            }
        this.canvasModal.openoffCanvas(ChangePasswordPage, componentProps, id, cssClass, title).then((detail)=>{

        })
      }else if(detail.data=="resetLocalDb"){
        this.tabSection("refreshObjFab")
      }else if(detail.data=="themeLinks"){
        this.tabSection('themeLinks');
      }
    })
  }

  async AdminNewmobile() {
    let id = 'offcanvasAdminNewmobile';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      test: "AdminNewmobile"
    }
    await this.canvasModal.openoffCanvas(UserLoginComponent, componentProps, id, cssClass, title).then((detail) => { 
      if(detail.data=="ChangeLoginParameter"){
        // this.router.navigateByUrl('usersetting')
        this.router.navigateByUrl('/usersetting', { replaceUrl: true });
      }else if(detail.data=="ChangepasswordLinks") {
         let id = 'offcanvasRightChangepasswordlink';
            let cssClass = 'offcanvasRight';
            let title = ""
            let componentProps = {
              test: "Change password"
            }
        this.canvasModal.openoffCanvas(ChangePasswordPage, componentProps, id, cssClass, title).then((detail)=>{

        })
      }else if(detail.data=="resetLocalDb"){
        this.tabSection("refreshObjFab")
      }else if(detail.data=="themeLinks"){
        this.tabSection('themeLinks');
      }
    })

  }

  UserRole(event: any) {
    let component = UserRoleComponentComponent
    let componentProps = ""
    let id = "userrole_menubar"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((value) => {
      if (value) {
        this.tabSection("optionSelect", value.data)
      }
    })
  }

  QuickActionModal(event, frame) {
    let component = QuickActionModalComponent
    let componentProps = { frame }
    let id = "quickactionmodel"
    let cssClass = ""
    this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((detail) => {})
  }

  searchGlobal(data) {
    this.tabSection('optionSelect',data);
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

  

  async right_bar() {
    let id = 'offcanvasleft_bar';
    let cssClass = 'offcanvasRight';
    let title = ""
    let componentProps = {
      isLeftBarOnMobile: true

    }
    await this.canvasModal.openoffCanvas(RightBarComponent, componentProps, id, cssClass, title).then((detail) => {
      if (detail) {
        this.tabSection(detail.role, detail.data)
      }
    }
    )
  }

  tabSection(type, item?) {
    let tab = this.lhs_lib.dynamicTabs.find(x => x.instance.active);
    if (tab) {
      if (tab.instance.superId) {
        this.events.publish(tab.instance.superId, { type: type, item: item ? item : '', flag: "T" });
      }
    }
    else {
      this.events.publish("homeTab", { type: type, item: item ? item : '', flag: "T" });
    }

  }

  /* end Open offcanvas and tab compoment*/
  ngOnDestroy() {
    this.events.unsubscribe("openTab");
    this.events.unsubscribe("selectTab");
  }
  subscribeEvents() {
    this.events.subscribe('openTab', res => {
      this.openObject(res)
    })
    this.events.subscribe('selectTab', res => {
      this.globalobjects.isNotOpenTab.set(false)
      this.selectTab(res)
    })
    this.events.subscribe('closeTab', res => {
      this.closeTabData(res.tab,res.index)
      this.tabAfterClose()
    })
  }
  // header collapse
  collapseHead() {
    this.upArrowon = !this.upArrowon
  }
 
}
