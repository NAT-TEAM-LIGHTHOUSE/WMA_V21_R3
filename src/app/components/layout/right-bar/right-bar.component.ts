import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { DataService } from 'src/app/services/data.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';


@Component({
  standalone : true,
  imports:[...STANDALONE_IMPORTS],
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss'],
})
export class RightBarComponent implements OnInit {
  @Output() releaseNoteLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() helpLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() chatboatemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() aiassistantemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() announceLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() devloperMLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() statuslinkemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() quickLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() roleassignemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() themeLinksemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() ticketOutlineemit: EventEmitter<any> = new EventEmitter<any>();
  @Output() shortcutLinksemit: EventEmitter<any> = new EventEmitter<any>();
 @Output() agentic_Chatbot_emit: EventEmitter<any> = new EventEmitter<any>();
 
  plt :any;
  isLeftBarOnMobile:boolean=false
  constructor(public globalobjects: GlobalObjectsService,private canvasModal:CanvasModalService,public platform : Platform,private dataService:DataService) { 
    if(this.globalobjects.layoutFlag){
      return applyLoggingDecorator(this,"right-bar")
    }
  }
  @Output() sliderOutlineemit: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {


        if ( this.platform.is('android')) {
      this.plt = 'android';
    } else if (this.platform.is('ios')) {
      this.plt = 'ios';
    }else{
      this.plt = 'browser';
    }

   }

  releaseNoteLinks(item) {
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss(item,"openoffRightCanvasObject")
    }else{
      this.releaseNoteLinksemit.emit(item);
    }
    
  }
  helpLinks() {
    
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss("","helpLinks")
    }else{
      this.helpLinksemit.emit();
    }
   
  }

chatboat(){
  
  this.chatboatemit.emit();
    
}
aiassistant(){
  this.aiassistantemit.emit();
}

Agentic_Chatbot(item){
  this.agentic_Chatbot_emit.emit(item);
}

 announceLinks(item,title) {
    item.title = title;
    item.id = "offcanvasRightannouncelink";
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss("","announceLinks")
    }else{
      // this.announceLinksemit.emit(item);
      this.getDataForUpdate();
    }
  }
  ticketOutline(item,title) {
    item.title = title;
    item.id = "offcanvasRightticketslink";
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss(item,"openApplication")
    }else{
      this.ticketOutlineemit.emit(item);
    }
    
  }


  sliderOutline(item,title) {
    item.title = title;
    item.id = "offcanvasRightticketslink";
    
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss(item,"openoffRightCanvasObject")
    }else{
      this.sliderOutlineemit.emit(item);
    }
  }
  devloperMLinks() {
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss("","devloperMLinks")
    }else{
      this.devloperMLinksemit.emit();
    }
    
  }
  statuslink() {
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss("","statuslink")
    }else{
      this.statuslinkemit.emit();
    }
    
  }

  quickLinks() {
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss("","quickLinks")
    }else{
      this.quickLinksemit.emit();
    }
   
  }

  roleassign(event) {
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss("","roleassign")
    }else{
      this.roleassignemit.emit(event);
    }
   
  }


  

  themeLinks() {
    if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss("","themeLinks")
    }else{
      this.themeLinksemit.emit();
    }
    
  }

shortcutLinks(){
  if(this.isLeftBarOnMobile){
      this.canvasModal.popDismiss("","shortcutLinks")
    }else{
      this.shortcutLinksemit.emit();
    }
}

  // getDataForUpdate() {
  //    for(let object of this.globalobjects.layoutObject){
  //     for(let obj of object.Level2){
  //       for(let frame of obj.Level3){
  //         if(frame.apps_frame_type=='SYSTEM'&& frame.apps_frame_sub_type=='GLOBAL_UPDATES'){

  //           this.getRefData(frame);
  //         }
  //       }


  //     }
  //   }
  // }

async getDataForUpdate() {

  let finalData = {
    globalData: [],
    localData: []
  };

  for (let object of this.globalobjects.layoutObject) {

    for (let obj of object.Level2) {

      for (let frame of obj.Level3) {

        if (
          frame.apps_frame_type == 'SYSTEM' &&
          frame.apps_frame_sub_type == 'GLOBAL_UPDATES'
        ) {

          let proc = this.getParse(frame.on_frame_load_str);

          let url =
            'getRefCursor?Procname=' +
            encodeURIComponent(proc);

          try {

            let response: any =
              await this.dataService.getData(url);

            if (
              response.responseStatus &&
              response.responseStatus.includes('success')
            ) {

              // CHECK DYNAMICALLY
              if (proc.includes("('G'")) {

                finalData.globalData =
                  response.responseData;

              } else if (proc.includes("('D'")) {

                finalData.localData =
                  response.responseData;
              }
            }

          } catch (error) {
            console.error(error);
          }

        }

      }

    }

  }

  // SEND BOTH DATA
  this.announceLinksemit.emit(finalData);
}

async getRefData(frame) {

    if (frame.on_frame_load_str) {

      let parseValue = this.getParse(frame.on_frame_load_str);

      let url = 'getRefCursor?Procname=' + encodeURIComponent(parseValue);
      await this.dataService.getData(url).then(async (data: any) => {
        frame.loading = false;
        if (data.responseStatus && data.responseStatus.includes("success")) {
          return frame.tableData = await this.globalobjects.setPageInfoNoS2U(data.responseData);
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
    let userDetails = this.globalobjects.getLocallData('userDetails');
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
  
}
