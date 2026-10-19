import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { TextAreaPage } from 'src/app/pages/text-area/text-area.page';
import { BackgroundService } from 'src/app/services/background.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class SearchItemComponent implements OnInit {
  @Input() searchinput: any;
  @Input() frame_type: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  show = true;
  autoPolulateText: any[] = [];
  autoPolulateText1 = ['tte', 'ttr', 'ttw'];
  current_page_parameter: any = {};
  itemval: any;
  hasFired = false;
  col1 = 3;
  col2 = 9;

  

  constructor(private globalObjects: GlobalObjectsService, public popOverCtrl: PopoverController,public events: Events , private backgroundservice: BackgroundService) {

    this.backgroundservice.latitude
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"search-item")
    }
  }
  ishover(e) {
    if (e.click_events_str) {
      return true;
    } else {
      return false;
    }
  }


  ngOnInit() {
  
    if(this.searchinput.position && (this.searchinput.position.indexOf("column") > -1)){
      let arr = this.searchinput.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    }else if(this.searchinput.promptCol){
      this.col1 = this.searchinput.promptCol;
      this.col2 = (12 - parseFloat(this.searchinput.promptCol) );
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if (this.searchinput.item_sub_type_child == 'UPPER') {
      let val = new RegExp(/^[A-Z]+$/);
      this.searchinput.input_pattern = val;
      this.searchinput.tool_tip = "Only Uppercase";
    }
    if (this.searchinput.item_sub_type_child == 'LOWER') {
      let val = new RegExp(/^[a-z]+$/);
      this.searchinput.input_pattern = val;
      this.searchinput.tool_tip = "Only Lowercase Allowed";
    }
    if (this.searchinput.item_sub_type_child == 'PHONE') {
      let val = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
      this.searchinput.input_pattern = val;
      this.searchinput.tool_tip = "Invalid phone number";
    }
    if (this.searchinput.item_sub_type_child == 'EMAIL') {
      let val = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      this.searchinput.input_pattern = val;
      this.searchinput.tool_tip = "Invalid Email address";
    }
    if (this.searchinput.item_sub_type == 'TEXT_BOX') {
      this.itemval = this.searchinput.value;
      setTimeout(() => {
        document.getElementById("mailbody").addEventListener("keyup", () => {
          this.searchinput.value = document.getElementById("mailbody").innerHTML;
        });
      }, 1000)
    }
  }

  onBlur(onChange) {
    if(!this.searchinput.value){
      this.show = true;
    }
    if (!this.hasFired) {
      this.hasFired = true;
      var changeValue = this.getParsedJson(this.searchinput.display_setting_str);
      if (changeValue["text-transform"]) {
        if (changeValue["text-transform"] == 'uppercase') {
          this.searchinput.value = (this.searchinput.value).toUpperCase();
        } 
        if (changeValue["text-transform"] == 'lowercase') {
          this.searchinput.value = (this.searchinput.value).toLowerCase();
        }
        if(changeValue["text-transform"] == 'capitalize'){
          if(this.searchinput.value){
            let text = "";
            let valarr = this.searchinput.value.split(" ");
            for(let o of valarr){
              text = text + " " + o.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            }
            this.searchinput.value = text.replace(" ", "");
          }
        
        }
      }

      let item_history = this.globalObjects.getLocallData("item_history");
      let key = this.searchinput.item_name;
      if (item_history) {

        if (item_history[key]) {
          let data: any[] = item_history[key];
          let item = data.filter(item => {
            if (this.searchinput.value && this.searchinput.value.toLowerCase() === item.toLowerCase()) {
              return item;
            }
          });

          if (this.searchinput.value != "" && this.searchinput.value != null && item[0] == null || item[0] == "") {
            data.push(this.searchinput.value);
          }
          item_history[key] = data;
          this.globalObjects.setDataLocally("item_history", item_history);
        }
        else {
          let data: any[] = [];
          if (this.searchinput.value != "" && this.searchinput.value != null) {
            data.push(this.searchinput.value);
          }
          item_history[key] = data;
          this.globalObjects.setDataLocally("item_history", item_history);
        }

      } else {
        if (this.searchinput.value != "" && this.searchinput.value != null) {
          let itemHistory = {};
          let data: any[] = [];
          data.push(this.searchinput.value);
          itemHistory[key] = data;
          this.globalObjects.setDataLocally("item_history", itemHistory);
        }
      }


      this.searchinput.blurValue = this.searchinput.value;
      this.searchinput.itemClicked = 'post';
      this.emitOnChange.emit(this.searchinput)
    }
  }

  onChange() {
    if(this.searchinput.msgError){
      this.searchinput.msgError = "";
    }
    this.hasFired = false;
  }

  itemClicked(){
    this.show = false;
    if(this.searchinput.click_event_str){
      this.searchinput.itemClicked = 'pre';
      this.emitPass.emit(this.searchinput)
    }
  }
  autoPopulate(event) {
    let item_history = this.globalObjects.getLocallData("item_history");
    let key = this.searchinput.item_name;
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
  inputType = 'password';
  iconName = 'eye-off';

  hideShowPassword() {
    this.inputType = this.inputType === 'text' ? 'password' : 'text';
    this.iconName = this.iconName === 'eye-off' ? 'eye' : 'eye-off';
  }

  doubleClickFun(event) {
    
    if(this.searchinput.lov_code){
      this.searchinput.lovEvent ={
        tempClickEntStr : JSON.stringify(this.searchinput.click_event_str)
      }
      this.searchinput.click_events_str = 'open_lov';
      this.searchinput.itemClicked = 'pre';
      this.emitOnChange.emit(this.searchinput)
    }

  }

  async openPop(ev: any) {
    const popover = await this.popOverCtrl.create({
      component: TextAreaPage,
      cssClass: 'my-custom-class',
      componentProps: { value: this.searchinput.value },

      backdropDismiss: false,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then(res => {
      this.searchinput.value = res.data.value;
    })

  }

  checkKey(event){
    if(event.keyCode == 120 && this.searchinput.lov_code){
      this.searchinput.eventCode = 120
      this.searchinput.lovEvent ={
        tempClickEntStr : JSON.stringify(this.searchinput.click_event_str)
      }
      this.searchinput.click_events_str = 'open_lov';
      this.searchinput.itemClicked = 'pre';
      this.emitOnChange.emit(this.searchinput)
    }else if(event.keyCode == 121){
      this.searchinput.eventCode = 121
      this.searchinput.itemClicked = 'pre';
    }

    
  }

}
