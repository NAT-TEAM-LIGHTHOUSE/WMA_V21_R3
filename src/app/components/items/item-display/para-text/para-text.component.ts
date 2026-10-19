import { style } from '@angular/animations';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { FormatMaskPipe } from 'src/app/pipes/format-mask-pipe';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
// import { FormatMaskPipe } from 'src/app/pipes/format-mask.pipe';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-para-text',
  templateUrl: './para-text.component.html',
  styleUrls: ['./para-text.component.scss'],
   imports :[FormatMaskPipe,STANDALONE_IMPORTS]
})
export class ParaTextComponent implements OnInit {

  @Input() itemInput: any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() frameSeqId:any

  obj: any = { "text-align": "right" };
  obj2: any = { "text-align": "center" };
  hyperlink: any;
  tableValue: any;
  dimensionItem: any;

  constructor(public globalObjects: GlobalObjectsService,private cdEngine: CdEngineService, private cdr: ChangeDetectorRef) {
    if (this.globalObjects.itemFlag) {
      return applyLoggingDecorator(this, "para-text")
    }
  }
  ismasked_field = false
  ngOnInit() {
    this.cdEngineCall(true);
    if (this.itemInput.display_setting_str) {
      let str = typeof (this.itemInput.display_setting_str) == 'string' ? JSON.stringify(this.itemInput.display_setting_str) : this.itemInput.display_setting_str;

      if ((str["dimension"] == 'T' || str["DIMENSION"] == 'T') && this.itemInput.calling_object_code) {
        this.dimensionItem = JSON.parse(JSON.stringify(this.itemInput));
        this.dimensionItem.item_enable_flag = "T"
        this.dimensionItem.click_events_str = this.itemInput.orignal_click_events_str ? this.itemInput.orignal_click_events_str : this.itemInput.click_events_str;

        if (!this.itemInput.display_setting_str) {
          this.itemInput.display_setting_str = {};
        }
        // console.log('dimensionItem', this.dimensionItem);
        // this.itemInput.display_setting_str['text-decoration'] = 'underline';
        // this.hyperlink = this.dimensionItem;
      }
      this.itemInput.display_setting_str = { ...this.itemInput.display_setting_str };
      // delete this.itemInput.display_setting_str['dimension'];
      // delete this.itemInput.display_setting_str['DIMENSION'];
      //  if (this.frame_type == 'TABLE' || this.frame_type == 'ENTRY_TABLE') {
        this.itemInput.dimensionItem = this.dimensionItem;
      // }
    }
    
    if ((this.itemInput.data_required_flag && this.itemInput.data_required_flag == 'T')) {
      if (this.itemInput.value !== "" && this.itemInput.value != null && this.itemInput.value != undefined) {
        this.itemInput.isValid = true;
      } else {
        this.itemInput.isValid = false;
      }
    } else {
      this.itemInput.isValid = true;
    }

    this.tableValue = this.itemInput.value;
    let obj = this.itemInput.display_setting_str;
    try {
      obj = JSON.parse(obj);
    } catch {
      obj = obj;
    }
    if (this.itemInput.datatype == 'NUMBER') {
      if (this.itemInput.value && this.itemInput.format_mask && !isNaN(parseFloat(this.itemInput.value))) {
        if (false && this.itemInput.format_mask.toLowerCase().indexOf('currency') > -1) {
          // let type = this.itemInput.format_mask.split("=")[1].split(".")[0];
          // if()
          this.itemInput.value = parseFloat(this.itemInput.value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        } else
          if (false) {
            let mask = this.itemInput.format_mask.split(",");
            let str = "";
            let val = "";
            let i = 0;
            let value = this.itemInput.value;
            if (value && value.indexOf(".") > -1) {
              value = value.split(".")[0];
            }
            let itmLen = value.length;
            for (let m of mask) {
              i++
              if (itmLen > 0) {
                let num = mask[mask.length - i].length;
                if (itmLen < mask[mask.length - i].length) {
                  num = itmLen;
                }
                str = "(\\d{" + num + "})" + str;
                if (val == "") {
                  val = val + '$' + i;
                } else {
                  val = val + ',' + '$' + i;
                }
                itmLen = itmLen - mask[mask.length - i].length;
              }

            }
            let finalStr = '/' + str + '/'

            if (this.itemInput.value.indexOf(".") > -1) {
              let temp = value.replace(eval(finalStr), val);
              this.tableValue = temp + '.' + this.itemInput.value.split(".")[1];
            } else {
              this.tableValue = this.itemInput.value.replace(eval(finalStr), val);
            }
            this.itemInput.value = this.tableValue;
          }
      }

      if (obj && obj["text-align"]) {
      } else {
        if (obj) {
          obj["text-align"] = "right";
        } else {
          obj = this.obj;
        }
      }

     

      this.itemInput.display_setting_str = obj;
    }
    if (this.itemInput.datatype == 'DATETIME') {
      if (obj && obj["text-align"]) {
      } else {
        if (obj) {
          obj["text-align"] = "center";
        } else {
          obj = this.obj2;
        }
      }
      this.itemInput.display_setting_str = obj;
    }
    if (this.itemInput.input_pattern && this.itemInput.input_pattern.toLowerCase().includes("masked_field")) {
      this.ismasked_field = true
    }
  }

  itemClick(event) {
    if (this.frame_type != 'ENTRY_TABLE') {
      this.emitPass.emit({ item: this.itemInput });
    }
  }
  valueChange(event) {
    this.emitOnChange.emit(this.itemInput);
  }



  openDimension(event) {
    if(this.itemInput.value){
    event.itemClicked = 'pre';
    delete event['singleClicked'];
    this.emitPass.emit(event);
    }

  }
  // openDimension(item: any) {
  //   this.emitPass.emit({
  //     item,  
  //     singleClick: true
  //   });
  // }


  getMaskedValue(value) {
    if (!value) return '';
    return '*'.repeat(value.length);
  }

  cdEngineCall(isRegister: boolean) {
    let id = this.itemInput.apps_item_seqid + '_' + this.itemInput.indexcount+'#'+this.frameSeqId;
    if(isRegister){
      this.cdEngine.register(id, this.cdr);
    }else{
      this.cdEngine.unregister(id,this.cdr);
    }
  }
   ngOnDestroy(): void {
     this.cdEngineCall(false);
  }
}
