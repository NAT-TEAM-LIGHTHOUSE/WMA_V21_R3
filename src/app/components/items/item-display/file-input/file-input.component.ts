import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {  ModalController, Platform } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class FileInputComponent implements OnInit,OnDestroy {
  acceptParameter :any ="*";
  @Input() fileInput :any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();  

  fileNames:any=[];

  constructor( public modalController: ModalController,
    public globalObjects: GlobalObjectsService, public platform: Platform, public events: Events) { 
      if(this.globalObjects.itemFlag){
        return applyLoggingDecorator(this,"file-input")
      }
    }

    ngOnDestroy(): void {
      let frSeq;
    let frAl;
    let frAlItemName;
    let itmSeq;
    let itmname;
    frSeq = "executeItem_" + this.fileInput.apps_page_frame_seqid.toLowerCase() + "." + this.fileInput.apps_item_seqid.toLowerCase();
    frAl = "executeItem_" + this.fileInput.frame_alias.toLowerCase() + "." + this.fileInput.apps_item_seqid.toLowerCase();
    frAlItemName = "executeItem_" + this.fileInput.frame_alias.toLowerCase() + "." + this.fileInput.item_name.toLowerCase();
    itmSeq = "executeItem_" + this.fileInput.apps_item_seqid.toLowerCase();
    itmname = "executeItem_" + this.fileInput.item_name.toLowerCase();
      this.events.unsubscribe(frAlItemName);
      this.events.unsubscribe(itmname);
      this.events.unsubscribe(frSeq);
      this.events.unsubscribe(frAl);
      this.events.unsubscribe(itmSeq);
    }

  ngOnInit() {
    let frSeq;
    let frAl;
    let frAlItemName;
    let itmSeq;
    let itmname;

    if (this.fileInput.apps_page_frame_seqid) {
      frSeq = "executeItem_" + this.fileInput.apps_page_frame_seqid.toLowerCase() + "." + this.fileInput.apps_item_seqid.toLowerCase();
    }
    if (this.fileInput.frame_alias){
      frAl = "executeItem_" + this.fileInput.frame_alias.toLowerCase() + "." + this.fileInput.apps_item_seqid.toLowerCase();
      frAlItemName = "executeItem_" + this.fileInput.frame_alias.toLowerCase() + "." + this.fileInput.item_name.toLowerCase();
    }
    itmSeq = "executeItem_" + this.fileInput.apps_item_seqid.toLowerCase();
    itmname = "executeItem_" + this.fileInput.item_name.toLowerCase();

    this.events.unsubscribe(frAlItemName);
    this.events.subscribe(frAlItemName, res => {
      if(res.evFlag == "T"){
        if(res.serv.toLowerCase() == "click_events_str"){
          this.fileInput.itemClicked = "pre";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "post_events_str"){
          this.fileInput.itemClicked = "post";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "on_load_events_str"){
          this.fileInput.itemClicked = "load";
          this.execute_events(this.fileInput);
        } else{
          this.fileInput.itemClicked = "executed_item";
          this.fileInput.execute_evnts = res.serv;
          this.execute_events(this.fileInput);
        }
      }
    });

    this.events.unsubscribe(itmname);
    this.events.subscribe(itmname, res => {
      if(res.evFlag == "T"){
        if(res.serv.toLowerCase() == "click_events_str"){
          this.fileInput.itemClicked = "pre";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "post_events_str"){
          this.fileInput.itemClicked = "post";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "on_load_events_str"){
          this.fileInput.itemClicked = "load";
          this.execute_events(this.fileInput);
        } else{
          this.fileInput.itemClicked = "executed_item";
          this.fileInput.execute_evnts = res.serv;
          this.execute_events(this.fileInput);
        }
      }
    });

    this.events.unsubscribe(frSeq);
    this.events.subscribe(frSeq, res => {
      if(res.evFlag == "T"){
        if(res.serv.toLowerCase() == "click_events_str"){
          this.fileInput.itemClicked = "pre";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "post_events_str"){
          this.fileInput.itemClicked = "post";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "on_load_events_str"){
          this.fileInput.itemClicked = "load";
          this.execute_events(this.fileInput);
        } else{
          this.fileInput.itemClicked = "executed_item";
          this.fileInput.execute_evnts = res.serv;
          this.execute_events(this.fileInput);
        }
      }
    });

    this.events.unsubscribe(frAl);
    this.events.subscribe(frAl, res => {
      if(res.evFlag == "T"){
        if(res.serv.toLowerCase() == "click_events_str"){
          this.fileInput.itemClicked = "pre";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "post_events_str"){
          this.fileInput.itemClicked = "post";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "on_load_events_str"){
          this.fileInput.itemClicked = "load";
          this.execute_events(this.fileInput);
        } else{
          this.fileInput.itemClicked = "executed_item";
          this.fileInput.execute_evnts = res.serv;
          this.execute_events(this.fileInput);
        }
      }
    })
    
    this.events.unsubscribe(itmSeq);
    this.events.subscribe(itmSeq, res => {
      if(res.evFlag == "T"){
        if(res.serv.toLowerCase() == "click_events_str"){
          this.fileInput.itemClicked = "pre";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "post_events_str"){
          this.fileInput.itemClicked = "post";
          this.execute_events(this.fileInput);
        } else if(res.serv.toLowerCase() == "on_load_events_str"){
          this.fileInput.itemClicked = "load";
          this.execute_events(this.fileInput);
        } else{
          this.fileInput.itemClicked = "executed_item";
          this.fileInput.execute_evnts = res.serv;
          this.execute_events(this.fileInput);
        }
      }
    })
  }

  execute_events(event){
    this.events.publish("execute_item_events",event);
  }

  itemClick(event) {
    this.emitPass.emit(this.fileInput);
  }
  readFile(event){
    this.fileInput.files = [];
    if(this.fileInput.item_sub_type == 'S'){
      this.fileNames = [];
    }
    for(let f of event.target.files){
     this.fileNames.push(f);
     this.converToBase64(f).then((res:any) =>{
       if(this.fileInput.value){
        this.fileInput.value = this.fileInput.value +"#"+res.split(",")[1] + '~' + f.name;
       }else{
        this.fileInput.value = res.split(",")[1] + '~' + f.name;
       }
     })
    }
   this.fileInput.files = this.fileNames;
   this.fileInput.itemClicked = "post"
   this.emitPass.emit(this.fileInput);
  }

  converToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  removeItem(index){
    this.fileNames.splice(index, 1);
    this.fileInput.files = this.fileNames;

    this.fileInput.value = "";
    for(let f of  this.fileNames){
      this.fileNames.push(f);
      this.converToBase64(f).then((res:any) =>{
        if(this.fileInput.value){
         this.fileInput.value = this.fileInput.value +"#"+res.split(",")[1] + '~' + f.name;
        }else{
         this.fileInput.value = res.split(",")[1] + '~' + f.name;
        }
      })
     }
  }
}



