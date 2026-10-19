import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { FramePreviewComponent } from '../frame-preview/frame-preview.component';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { ProcessDataService } from 'src/app/services/process-data.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { FrameSelectorComponent } from '../../frame-selector/frame-selector.component';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS,forwardRef(() => FrameSelectorComponent)],
  selector: 'app-tab-table-new',
  templateUrl: './tab-table-new.component.html',
  styleUrls: ['./tab-table-new.component.scss'],
})
export class TabTableNewComponent implements OnInit {
  @Input() frame: any = {};
  @Input() wsdp: any = {};
  @Input() wscp: any = {};
  @Input() wscp_send_input: any = {};
  @Input() wsdpcl: any = {};
  @Input() object_mast: any = {};
  @Input() page_no: any = {};
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sessionObj: any = {};
  tabFrame:any={}
  constructor(private modalController: ModalController,public globalObjects : GlobalObjectsService,private modalGlobal: CanvasModalService,private processData:ProcessDataService) {
    if(this.globalObjects.frameFlag){
      return applyLoggingDecorator(this,"frame-tab-frame-new")
    }
   }

  ngOnInit() {
     if(this.frame.tabsArr.length>0){
      this.tabClick(this.frame.tabsArr[0])
    }
  }

  tabClick(tab){
    this.tabFrame=tab;
    let frame = JSON.parse(JSON.stringify(this.tabFrame));
    let str = frame.on_frame_load_str ? frame.on_frame_load_str.trim().replace(/[;]$/,'') : '';

      this.frame.active_child_frame = frame.apps_page_frame_seqid;
    if(str){


      let strArr = str.split(";");
      let st = "";
      for(let s of strArr){
        let value = s.trim();
        if (value.toLowerCase() == "itemwise_sql_populate_data" || value.toLowerCase() == "item_frame_sql_populate_data" ||
          value.toLowerCase() == "execute_query" || value.toLowerCase() == "frame_sql_populate_data" || 
          value.toLowerCase() == "execute_query_once" || value.toLowerCase().includes("populate_from_procedure(") || value.toLowerCase().includes("populate_from_procedure_rc(") || value.toLowerCase() == "all_itemwise_sql_populate_data"){

            st = st + `app_execute_frame('${frame.apps_page_frame_seqid}',"${value}");`;
          } else {
            st = st + value + ";"
          }
      }

      frame.click_events_str = st;
      this.itemClicked(frame);
    } else {
      if (tab && (!tab.tableRows || tab.tableRows.length < 1)) {
        tab.tableRows = [];
        tab.tableRows[0] = JSON.parse(JSON.stringify(tab.Level4));
        this.processData.afterTableRows(tab);
      } 
    }
  }

  itemClicked(event){
    this.emitPass.emit(event)
  }

  async showDeveloperData(tab) {
    let developerModeData = {
      frame_seq_id: tab.apps_page_frame_seqid
    }
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: "my-custom-class",
      componentProps: {
        data: developerModeData,
        requestData: tab
      }
    });
    return await modal.present();
  }

  preview(){
    // let component = FramePreviewComponent
    // let componentProps = {
    //   frame:this.tabFrame,
    //   wsdp:this.wsdp, 
    //   sessionObj:this.sessionObj,
    //   wscp:this.wscp,
    //   object_mast:this.object_mast,
    //   page_no:this.page_no,
    //   wsdpcl:this.wsdpcl
    // }
    // let id = "FramePreview"
    // let cssClass = ""
    // let event
    // this.modalGlobal.openModal(component, componentProps, id, event, cssClass).then((value) => {})
    let componentProps = {
      frame:this.tabFrame,
      wsdp:this.wsdp, 
      sessionObj:this.sessionObj,
      wscp:this.wscp,
      object_mast:this.object_mast,
      page_no:this.page_no,
      wsdpcl:this.wsdpcl,
      tablepreview:true
    }

     this.emitPass.emit(componentProps)
  }


  // fullScreen(fullscreen_id:any,status){
  //   if(status=='1'){
  //     let element = document.getElementById(fullscreen_id);
  //       // Add a class to the element
  //        element.classList.add("active_fullscreen");
  //         element.classList.remove("deactive_fullscreen");
  //        document.getElementById(fullscreen_id+"fullscreen_btn1").style.display = "none";
  //        document.getElementById(fullscreen_id+"fullscreen_btn2").style.display = "inherit";
  //        document.getElementById(fullscreen_id+"fullscreen_btn2").style.border = "2px solid #2e6adf";
  //        console.log('active');
  //   }else{
  //     let element = document.getElementById(fullscreen_id); 
      
  //      element.classList.remove("active_fullscreen");
  //      element.classList.add("deactive_fullscreen");

  //        document.getElementById(fullscreen_id+"fullscreen_btn1").style.display = "inherit";
  //        document.getElementById(fullscreen_id+"fullscreen_btn2").style.display = "none";
        
  //      console.log('active');
  //   } 
  //   }



    getLastById(id: string): HTMLElement | null {
  const elements = document.querySelectorAll(`#${id}`);
  if (elements.length === 0) return null;
  return elements[elements.length - 1] as HTMLElement;
}

fullScreen(fullscreen_id: any, status: any) {

  const element = this.getLastById(fullscreen_id);
  const btn1 = this.getLastById(fullscreen_id + "fullscreen_btn1");
  const btn2 = this.getLastById(fullscreen_id + "fullscreen_btn2");

  if (!element || !btn1 || !btn2) {
    console.log("Element not found");
    return;
  }

  if (status == '1') {

    element.classList.add("active_fullscreen");
    element.classList.remove("deactive_fullscreen");

    btn1.style.display = "none";
    btn2.style.display = "inherit";
    btn2.style.border = "2px solid #2e6adf";

    console.log('active');

  } else {

    element.classList.remove("active_fullscreen");
    element.classList.add("deactive_fullscreen");

    btn1.style.display = "inherit";
    btn2.style.display = "none";

    console.log('deactive');
  }
}

}
