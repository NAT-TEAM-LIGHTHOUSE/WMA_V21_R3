import { Component, DoCheck, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { WsLogPage } from 'src/app/pages/ws-log/ws-log.page';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { OverlayEventDetail } from '@ionic/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-tab-section',
  templateUrl: './tab-section.component.html',
  styleUrls: ['./tab-section.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class TabSectionComponent implements OnInit,DoCheck {
  @Input()  page_no: any ;
  @Input()  isModal: any= 'M' ;
  @Output() collapseHeademit: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshObjFabemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() openHomePopemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() downloadObjemit: EventEmitter<any> = new EventEmitter<any>();
  // @Output()  closeTabsemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectTabsemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() showInfoPopupemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() setOpenemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() popDismissemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() parameterFrame: EventEmitter<any> = new EventEmitter<any>();
  @Output() builderDismisemit: EventEmitter<any> = new EventEmitter<any>();
  item:any;

  constructor(public lhs_lib : LhsLibService,public globalobjects : GlobalObjectsService,private canvasModal : CanvasModalService) {
    if(this.globalobjects.layoutFlag){
      return applyLoggingDecorator(this,"tab-section")
    }
   }

   ngDoCheck(): void {
    // console.count('tab-section checked');
  }

  ngOnInit() {}
  collapseHead(item){
    this.collapseHeademit.emit(item);
  }

  @HostListener('window:keydown.alt.r')
  refreshObjFab(item){
    this.refreshObjFabemit.emit(item);
    this.toggleIcon();
  }
  openHomePop(item){
    this.openHomePopemit.emit(item);
  }
  downloadObj(item){
    this.downloadObjemit.emit(item);
  }
  // closeTabs(item,i){
  //   this.globalobjects.tabindex.splice(i,1);
  //   this.globalobjects.activeItems="";
  //   this.closeTabsemit.emit(item);
  // }
  selectTabs(tab,type,i){
    this.globalobjects.activeItems= this.globalobjects.tabindex[i];
    this.selectTabsemit.emit({tab,type,i});
  }

  showInfoPopup(){
    this.showInfoPopupemit.emit();
  }


  setOpen() {
    this.setOpenemit.emit();
  }

  popDismiss(){
    this.popDismissemit.emit();
  }



  openBuilder(){
    this.builderDismisemit.emit();
  }
  
  // loading image

  isIconVisible: boolean = true;
  showFirstIcon() {
    this.isIconVisible = true;  
  }
  toggleIcon() {
    this.isIconVisible = !this.isIconVisible;
    if (!this.isIconVisible) {
      // If the second icon is shown, after 10 seconds, show the first icon
      setTimeout(() => {
        this.showFirstIcon();
      }, 3000); // 10 seconds (10000 milliseconds)
    }
  }
  openParameterFreame(){
    this.parameterFrame.emit()
  }



  showLogInvoice(){
    let id = 'globalNewModal';
    let cssClass = '';
    let title = ""
    let style: any = "";
    let flag: boolean = false;
    let componentProps={
    }
    

  this.canvasModal.openModal(WsLogPage, componentProps,id, "").then((detail: OverlayEventDetail) => {
  })
}

}
