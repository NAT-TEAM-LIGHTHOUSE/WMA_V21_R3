import { Component, OnInit,EventEmitter,Input, Output }  from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-item-merge-input',
  templateUrl: './item-merge-input.component.html',
  styleUrls: ['./item-merge-input.component.scss'],
})
export class ItemMergeInputComponent implements OnInit {

  @Input() mergeItemInput: any;
  @Input() frame_type: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  autoPolulateText: any[] = [];
  autoPolulateText1 = ['tte', 'ttr', 'ttw'];
  current_page_parameter: any = {};
  itemval: any;
  hasFired = false;
  col1 = 3;
  col2 = 9;
  lovObjFlag:boolean =false;
  constructor(public events: Events,public globalObjects: GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"item-merge-input")
    }
   }

  ngOnInit() {
    
    if(this.mergeItemInput.position && (this.mergeItemInput.position.indexOf("column") > -1)){
      let arr = this.mergeItemInput.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }


  onBlur(onChange) {
    if (!this.hasFired) {
      this.hasFired = true;
      var changeValue = this.getParsedJson(this.mergeItemInput.display_setting_str);
      if (changeValue["text-transform"]) {
        if (changeValue["text-transform"] == 'uppercase') {
          this.mergeItemInput.value = (this.mergeItemInput.value).toUpperCase();
        } 
        if (changeValue["text-transform"] == 'lowercase') {
          this.mergeItemInput.value = (this.mergeItemInput.value).toLowerCase();
        }
        if(changeValue["text-transform"] == 'capitalize'){
          if(this.mergeItemInput.value){
            let text = "";
            let valarr = this.mergeItemInput.value.split(" ");
            for(let o of valarr){
              text = text + " " + o.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            }
            this.mergeItemInput.value = text.replace(" ", "");
          }
        
        }
      }

      let item_history = this.globalObjects.getLocallData("item_history");
      let key = this.mergeItemInput.item_name;
      if (item_history) {

        if (item_history[key]) {
          let data: any[] = item_history[key];
          let item = data.filter(item => {
            if (this.mergeItemInput.value && this.mergeItemInput.value.toLowerCase() === item.toLowerCase()) {
              return item;
            }
          });

          if (this.mergeItemInput.value != "" && this.mergeItemInput.value != null && item[0] == null || item[0] == "") {
            data.push(this.mergeItemInput.value);
          }
          item_history[key] = data;
          this.globalObjects.setDataLocally("item_history", item_history);
        }
        else {
          let data: any[] = [];
          if (this.mergeItemInput.value != "" && this.mergeItemInput.value != null) {
            data.push(this.mergeItemInput.value);
          }
          item_history[key] = data;
          this.globalObjects.setDataLocally("item_history", item_history);
        }

      } else {
        if (this.mergeItemInput.value != "" && this.mergeItemInput.value != null) {
          let itemHistory = {};
          let data: any[] = [];
          data.push(this.mergeItemInput.value);
          itemHistory[key] = data;
          this.globalObjects.setDataLocally("item_history", itemHistory);
        }
      }


      this.mergeItemInput.blurValue = this.mergeItemInput.value;
      this.mergeItemInput.itemClicked = 'post';
      this.emitOnChange.emit(this.mergeItemInput)
    }
  }

  onChange() {
    if(this.mergeItemInput.msgError){
      this.mergeItemInput.msgError = "";
    }
    this.hasFired = false;
  }

  autoPopulate(event) {
    let item_history = this.globalObjects.getLocallData("item_history");
    let key = this.mergeItemInput.item_name;
    if (item_history) {

      if (item_history[key]) {
        this.autoPolulateText = item_history[key];
        this.autoPolulateText = this.autoPolulateText.filter(item => {
          if (item.toLowerCase().includes(event.target.value.toLowerCase())) {
            return item;
          }
        })
      }

    }
  }

  getParsedJson(json) {
    if(!json){
      return {}
    }
    try {
      if (typeof(json) == "string") {
        return JSON.parse(json);
      }
      if (typeof(json) == 'object' && json != null) {
        return json;
      }
    } catch (err) {
      console.error("error violation", err)
      return
    }
  }

  checkKey(event){
    if(event.keyCode == 120 && this.mergeItemInput.lov_code){
      this.mergeItemInput.eventCode = 120
      this.mergeItemInput.lovEvent ={
        tempClickEntStr : JSON.stringify(this.mergeItemInput.click_event_str)
      }
      this.mergeItemInput.click_events_str = 'open_lov';
      this.mergeItemInput.itemClicked = 'pre';
      this.emitOnChange.emit(this.mergeItemInput)
    }else if(event.keyCode == 121){
      this.mergeItemInput.eventCode = 121
      this.mergeItemInput.itemClicked = 'pre';
      //this.emitOnChange.emit(this.mergeItemInput)
    }
  }
  doubleClickFun(event){

  }
  itemClicked(event){
    
  }

}
