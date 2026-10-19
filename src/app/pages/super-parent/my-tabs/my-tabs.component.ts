import { isPlatformServer } from '@angular/common';
import { Component, ContentChildren, Inject, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { MyTabComponent } from '../my-tab/my-tab.component';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
  selector: 'app-my-tabs',
  templateUrl: './my-tabs.component.html',
  styleUrls: ['./my-tabs.component.scss'],
  standalone: true,
  imports: [STANDALONE_IMPORTS]
})
export class MyTabsComponent   {

 userDetails: any;
  dynamicTabs: any[] = [];
  model: boolean = true;
  istabClose = false
  tabA = 0
  tabsA = []
  @ContentChildren(MyTabComponent) tabs: QueryList<MyTabComponent>;

  // @ViewChild(DynamicTabsDirective) dynamicTabPlaceholder: DynamicTabsDirective;

  /*
    Alternative approach of using an anchor directive
    would be to simply get hold of a template variable
    as follows
  */
  @ViewChild('container', { read: ViewContainerRef }) dynamicTabPlaceholder: ViewContainerRef;

  constructor(private lhs_lib: LhsLibService, public events: Events, private globalObjects:GlobalObjectsService,@Inject(PLATFORM_ID) private platformId: Object) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"my-tabs-page")
    }
  }

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    const activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first, "openTab");
    }
    this.lhs_lib.tabs = this.tabs;
  }

  openTab(title: string, template, data, isCloseable = false) {
    this.tabA = this.tabA + 1;
    let id = `${data.wscp.object_code}#${data.wscp.apps_item_seqid}#${Math.random()}`
    // console.log(this.lhs_lib.dynamicTabs)
    for (let tabid of this.lhs_lib.dynamicTabs) {
      if (tabid.instance.superId == id) {
        
        return
      }
    }
    // fetch the view container reference from our anchor directive
    const viewContainerRef = this.dynamicTabPlaceholder;

    // create a component instance
    let componentRef = viewContainerRef.createComponent(MyTabComponent);

    data.superId = new Date().getTime();


    // set the according properties on our component instance
    const instance: MyTabComponent = componentRef.instance as MyTabComponent;
    // instance.title = title;
    instance.title = data.object_mast.object_name;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;
    instance.superId = id;
    instance.object_data = template._declarationLView[template._declarationLView.length - 1].object_mast;
    instance.tabs = this.tabs;
    instance.dynamicTabs = this.lhs_lib.dynamicTabs;
    instance.template = template;
    instance.tabIndex = this.tabA;
    instance.breadcrumb = []
    if(data.menuTabOpen){
      instance.menuTabOpen=true
    }
    this.lhs_lib.dynamicTabs.push(componentRef);

    // set it active
    this.selectTab(this.lhs_lib.dynamicTabs[this.lhs_lib.dynamicTabs.length - 1].instance, "openTab");
  }

  selectTab(tab: MyTabComponent, t?, i?) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab) => (tab.active = false));
    this.lhs_lib.dynamicTabs.forEach((tab) => (tab.instance.active = false));
    // set object mast if open tab
    if (t == 'openTab') {
      for (let [i,a] of this.lhs_lib.adata.entries()){
          a.active=false;
      }
      if (tab && tab.object_data) {
        this.lhs_lib.object_mast = tab.object_data;
      }
    }
    // set object mast if select tab
    if (t != 'openTab') {
      for (let a of this.lhs_lib.adata) {
        if (!tab.tabIndex) {
          if (a.index == 0) {
            this.lhs_lib.object_mast = a.object
            a.active=true
          }else{
            a.active=false
          }
        } else if (a.index == tab.tabIndex) {
          this.lhs_lib.object_mast = a.object
          a.active=true
        }else{
          a.active=false
        }
      }
    }

    // activate the tab the user has clicked on.
    tab.active = true;

  }
  
closeTab(tab, i?) {
   if (isPlatformServer(this.platformId)) return;
    const tabGet: any = document.querySelectorAll('app-my-tab')
    let a = this.lhs_lib.adata.find((t: any) => t.index == i)
    let tabs = this.lhs_lib.dynamicTabs.find(x => x.instance.active);
    if (tabs) {
      if (a.breadcrumbBar.length > 0) {
        for (let ab of a.breadcrumbBar) {
          this.lhs_lib.isTabclose = true
          this.events.publish(tab.instance.superId, { type: 'pageClose', item: 'T', flag: "T" })
        }
      }
    }
    let dTab = this.lhs_lib.dynamicTabs.filter((t: any, ind: any) => ind != i - 1)
    this.lhs_lib.dynamicTabs = dTab
    for (let dt of this.lhs_lib.dynamicTabs) {
      if (i < dt.instance.tabIndex) {
        dt.instance.tabIndex = dt.instance.tabIndex - 1
      }
    }
    for (let [index, tabTag] of tabGet.entries()) {
      if (index == i) {
        tabTag.remove()
        tab.destroy()
        
        if(this.lhs_lib.dynamicTabs.length>0){
          let tabOpen=this.lhs_lib.dynamicTabs[this.lhs_lib.dynamicTabs.length-1]
          this.selectTab(tabOpen.instance);
           let data={
           detail:"",
            componentProps:tabOpen.instance.dataContext
          }
          this.events.publish(tabOpen.instance.superId, { type: "pagedismisscallback", item: data, flag: "T" });
        }else{
          this.selectTab(this.tabs.first);
        }
        
        break;
      }
    }
    let tabData = this.lhs_lib.adata.filter((t: any) => t.index != i)
    this.lhs_lib.adata = tabData
    for (let a of this.lhs_lib.adata) {
      if (i < a.index) {
        a.index = a.index - 1
      }
    }
    this.tabA = this.tabA - 1
    // console.clear()
  }

  closeActiveTab() {
    const activeTabs = this.lhs_lib.dynamicTabs.filter((tab) => tab.instance.active);
    if (activeTabs.length > 0) {
      // close the 1st active tab (should only be one at a time)
      this.closeTab(activeTabs[0]);
    }
  }

  updateTab(data) {

    if (this.lhs_lib.dynamicTabs.length > 0) {
      for (let i = 0; i < this.lhs_lib.dynamicTabs.length; i++) {
        if (this.lhs_lib.dynamicTabs[i].instance.superId == data.superId) {
          // updatedTabs = { tab: this.lhs_lib.dynamicTabs[i], index: i };

          this.lhs_lib.dynamicTabs[i].instance.object_data = data;
          // this.lhs_lib.dynamicTabs[i].instance.title = data.object_name;
          if (this.lhs_lib.dynamicTabs[i].instance.active) {
            this.lhs_lib.object_mast = data;
          }
        }
      }


    } else {
      this.tabs.toArray()[0].object_data = data;
      this.lhs_lib.object_mast = data;
    }
  }
  goToHome() {
    this.selectTab(this.tabs.first);
  }
  ngOnDestroy() {
    // Clean up dynamic components
    this.dynamicTabPlaceholder.clear();
  }
}
