import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BackgroundService } from 'src/app/services/background.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-wordpad-input',
  templateUrl: './wordpad-input.component.html',
  styleUrls: ['./wordpad-input.component.scss'],
})
export class WordpadInputComponent implements OnInit {

  @Input() wordpadInput: any;
  @Input() frame_type: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  autoPolulateText: any[] = [];
  autoPolulateText1 = ['tte', 'ttr', 'ttw'];
  current_page_parameter: any = {};
  itemval: any;
  hasFired = false;
  htmlContent = '';

editorConfig: AngularEditorConfig ={
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '0',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  sanitize:false,
  toolbarPosition: 'top',
  fonts: [
    {class: 'arial', name: 'Arial'},
    {class: 'times-new-roman', name: 'Times New Roman'},
    {class: 'calibri', name: 'Calibri'},
    {class: 'comic-sans-ms', name: 'Comic Sans MS'}
  ],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
}


  constructor(private globalObjects: GlobalObjectsService, public popOverCtrl: PopoverController,public events: Events , private backgroundservice: BackgroundService) {
    this.backgroundservice.latitude
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"wordpad-input")
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

    this.wordpadInput.isValid =true;
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if (this.wordpadInput.item_sub_type_child == 'UPPER') {
      let val = new RegExp(/^[A-Z]+$/);
      this.wordpadInput.input_pattern = val;
      this.wordpadInput.tool_tip = "Only Uppercase";
    }
    if (this.wordpadInput.item_sub_type_child == 'LOWER') {
      let val = new RegExp(/^[a-z]+$/);
      this.wordpadInput.input_pattern = val;
      this.wordpadInput.tool_tip = "Only Lowercase Allowed";
    }
    if (this.wordpadInput.item_sub_type_child == 'PHONE') {
      let val = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
      this.wordpadInput.input_pattern = val;
      this.wordpadInput.tool_tip = "Invalid phone number";
    }
    if (this.wordpadInput.item_sub_type_child == 'EMAIL') {
      let val = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      this.wordpadInput.input_pattern = val;
      this.wordpadInput.tool_tip = "Invalid Email address";
    }
    if (this.wordpadInput.item_sub_type == 'TEXT_BOX') {
      this.itemval = this.wordpadInput.value;
      setTimeout(() => {
        document.getElementById("mailbody").addEventListener("keyup", () => {
          this.wordpadInput.value = document.getElementById("mailbody").innerHTML;
        });
      }, 1000)
    }
  }



  onBlur() {
   
    if (!this.hasFired) {
      this.hasFired = true;
      var changeValue = this.getParsedJson(this.wordpadInput.display_setting_str);
      if (changeValue["text-transform"]) {
        if (changeValue["text-transform"] == 'uppercase') {
          this.wordpadInput.value = (this.wordpadInput.value).toUpperCase();
        } if (changeValue["text-transform"] == 'lowercase') {
          this.wordpadInput.value = (this.wordpadInput.value).toLowerCase();
        }
      }

      let item_history = this.globalObjects.getLocallData("item_history");
      let key = this.wordpadInput.item_name;
      if (item_history) {

        if (item_history[key]) {
          let data: any[] = item_history[key];
          let item = data.filter(item => {
            if (this.wordpadInput.value.toLowerCase() === item.toLowerCase()) {
              return item;
            }
          });

          if (this.wordpadInput.value != "" && this.wordpadInput.value != null && item[0] == null || item[0] == "") {
            data.push(this.wordpadInput.value);
          }
          item_history[key] = data;
          this.globalObjects.setDataLocally("item_history", item_history);
        }
        else {
          let data: any[] = [];
          if (this.wordpadInput.value != "" && this.wordpadInput.value != null) {
            data.push(this.wordpadInput.value);
          }
          item_history[key] = data;
          this.globalObjects.setDataLocally("item_history", item_history);
        }

      } else {
        if (this.wordpadInput.value != "" && this.wordpadInput.value != null) {
          let itemHistory = {};
          let data: any[] = [];
          data.push(this.wordpadInput.value);
          itemHistory[key] = data;
          this.globalObjects.setDataLocally("item_history", itemHistory);
        }
      }
      this.wordpadInput.blurValue = this.wordpadInput.value;
      this.wordpadInput.itemClicked = 'post';
      this.emitOnChange.emit(this.wordpadInput)
    }
  }

  onChange() {
    if(this.wordpadInput.msgError){
      this.wordpadInput.msgError = "";
    }
    this.hasFired = false;
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
}
