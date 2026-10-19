import { Component, Directive, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { ItemsComponent } from '../../items/items.component';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,ItemsComponent],
  selector: 'app-frame-objectfilter',
  templateUrl: './frame-objectfilter.component.html',
  styleUrls: ['./frame-objectfilter.component.scss'],
})
export class FrameObjectfilterComponent implements OnInit {
  developerModeData: any;
  frame:any;
  grpByArr:any[];
  showGroup:any;
  curr_item_seqno:any;
  itemsContainer
   @ViewChildren('itemsContainer', { read: ElementRef }) activeItems!: QueryList<ElementRef>;
  constructor(private modalServ : CanvasModalService,private modalController : ModalController,public globalObjects : GlobalObjectsService) { 
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-objectFilter")
    }
  }

  ngOnInit() {
    console.log("frame object filter dta")
    // console.log(this.frame);
    // this.frame.showAllFlag=false;
    this.frame.showAllFlag=true; //change by arti
    if(this.frame.canvasRows){
              for(let framedata of this.frame.canvasRows){
                for(let itemGroup of framedata){
                  for(let item of itemGroup.Level5){
                     if(item.containerRowss){
                      this.frame.showAllFlag=false // add by arti
                    }
                    this.curr_item_seqno=item.item_seqno;
                    break;
                  }
                  break;
                }
                break;
              }
    }
    // console.log(this.frame);
  }
  

  setSeperateData(itm){}
  close(){
    this.modalServ.popDismiss();
  }

  itemClicked(event,role?){
    if(event.item_type == 'FILE_UPLOAD' || (role && role=='SYS_CLEAR')){
      this.itemValueChange(event,role);
    } else {
      this.modalServ.popDismiss(event,role);
    }
  }

  itemValueChange(event,role?){
    event.subScribeObjectCode=this.frame.subScribeCode
    this.modalServ.runEvents(event,role);
  }

  async showDeveloperData(item:any) {
    this.developerModeData = {
      ws_seq_id: '',
      frame_seq_id: item.apps_page_frame_seqid,
      item_seq_id: item.apps_item_seqid
    }
    const modal = await this.modalController.create({
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
  
  ngOnDestroy(){
    console.clear();
   }

  //  toggleItm(itm, index) {
  //   for (let i = 0; i < itm.Level5.length; i++) {
  //     if (i == index) {
  //       itm.Level5[i].sepFrame = 'SHOW';
  //     } else {
  //       itm.Level5[i].sepFrame = 'HIDE';
  //     }
  //   }
  // }
  // showAllFlag=false;
//   toggleItm(itm, index,allFlag?) {
//     if(allFlag=="all"){
//      this.frame.showAllFlag=true;
// for(let framedata of this.frame.canvasRows){
//   for(let itemGroup of framedata){
//     for (let i = 0; i < itemGroup.Level5.length; i++) {
//       // itemGroup.Level5[i].sepFrame = 'SHOW';
//       itemGroup.Level5[i].sepFrame = 'HIDE';
//   }
//   }
// }
//     }else{
//       this.frame.showAllFlag=false;
//       for (let i = 0; i < itm.Level5.length; i++) {
//         if (i == index) {
//           itm.Level5[i].sepFrame = 'SHOW';
//         } else {
//           itm.Level5[i].sepFrame = 'HIDE';
//         }
//       }
//     }
    
//   }




  toggleItemGroup(itm,item, index,allFlag?){
    if(allFlag=="all"){
      this.frame.showAllFlag=true;
     }else{
       this.frame.showAllFlag=false;
       this.curr_item_seqno=item.item_seqno;
      //  for (let i = 0; i < itm.Level5.length; i++) {
      //       if (i == index) {
      //         itm.Level5[i].sepFrame = 'SHOW';
      //       } else {
      //         itm.Level5[i].sepFrame = 'HIDE';
      //       }
      //     }
     }
  }

  toogleGrp(itm,index){
    // console.log(itm.groupname);
    this.showGroup=itm.groupname;
  }

  handleEnterKey() {
    // Use a tiny timeout to let Angular finish structural operations
    setTimeout(() => {
      let nextEl = this.findNextTabStop(document.activeElement);
      if (nextEl) {
        (nextEl as HTMLElement).focus();
      }
    }, 50);
  }

  findNextTabStop(el) {
    let universe = this.activeItems.first.nativeElement.querySelectorAll(
      "input,select,ion-button"
    );
    let list = Array.prototype.filter.call(universe, (item) => {
      return item.tabIndex >= "0";
    });
    let index = list.indexOf(el);
    index++;
    while (index < list.length) {
      if (!list[index].readOnly && !list[index].disabled && list[index].type != 'hidden') {
        return list[index];
      } else {
        index++;
      }
    }
    return list[0];
  }
}
