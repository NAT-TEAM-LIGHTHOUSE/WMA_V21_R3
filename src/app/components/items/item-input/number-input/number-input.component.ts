import { Component, OnInit, Input, Output,EventEmitter,ChangeDetectorRef } from '@angular/core';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS],
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent implements OnInit {

  @Input() numberinput: any;
  @Input() frame_type: any;
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  col1 = 3;
  col2 = 9;
  current_page_parameter: any = {};
  hasFired = false;
  constructor(public globalObjects: GlobalObjectsService,private cdr: ChangeDetectorRef) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"number-input")
    }
  }

  ngOnInit() {
    this.current_page_parameter = this.globalObjects.current_page_parameter;
    if(this.numberinput.position && (this.numberinput.position.indexOf("column") > -1)){
      let arr = this.numberinput.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    }else if(this.numberinput.promptCol){
      this.col1 = this.numberinput.promptCol;
      this.col2 = (12 - parseFloat(this.numberinput.promptCol) );
    }


    if(this.numberinput.item_enable_flag == 'F'){
      if(this.numberinput.item_sub_type == 'BROWSER1'){
        let obj:any = this.getParsedJson(this.numberinput.display_setting_str);
        obj.border = "1px solid";
        obj["box-shadow"] = "rgb(228 240 255) 5px 6px 20px inset";
        this.numberinput.display_setting_str = obj;
      }else{
        let obj = this.getParsedJson(this.numberinput.display_setting_str);
        obj["background-color"] = "rgb(243, 243, 243)";
        this.numberinput.display_setting_str = obj;
      }
    }
  }

  onBlur(onChange, numberInputname) {
    if(!this.hasFired){
      this.hasFired =true;
      this.numberinput.blurValue = this.numberinput.value;
      this.numberinput.itemClicked = 'post';
      this.emitOnChange.emit(this.numberinput)
    }
  }

  itemClicked(){
      this.numberinput.itemClicked = 'pre';
      this.emitPass.emit(this.numberinput)
  }

  onChange(item){
    if(this.numberinput.msgError){
      this.numberinput.msgError = "";
    }
    this.hasFired = false;
    if(item.item_size ){
      // this.cdr.detectChanges();
      let val = item.value.toString();
      if(val.indexOf(".") > -1){
        let decVal = val.split(".")[0];
        if(decVal.length > item.item_size){
          decVal = decVal.slice(0, item.item_size);
          val = decVal + '.' + val.split(".")[1]
        }
      }else{
        if(val.length > item.item_size){
          val = val.slice(0, item.item_size);
        }
      }
      item.value = parseFloat(val);
    }
    
  }


  cleardata() {
    this.numberinput.value = "";
  }

  validateNumber(beforeDecimal: any, afterDecimal: any, itemValue) {
    if (itemValue) {
      beforeDecimal = beforeDecimal ? beforeDecimal : 0;
      afterDecimal = afterDecimal ? afterDecimal : 0;
      let preDecimal = itemValue.toString().split(".")[0];
      let postDecimal = itemValue.toString().split(".")[1];
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
  showDeveloperData(){}
}
