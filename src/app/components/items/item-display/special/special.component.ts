import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { DomSanitizer} from '@angular/platform-browser';
import { Platform } from '@ionic/angular/standalone';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-special',
  templateUrl: './special.component.html',
  styleUrls: ['./special.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class SpecialComponent implements OnInit {


  marqueeText= "Welcome To Lighthouse Info Systems Pvt. Ltd";
  date = new Date();

  @Input() specialinput: any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();

  toggleMode:boolean = false;
  current_page_parameter: any = {};
  stars = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"];
  numStars: any = 5;
  ratingValue: any;
  baseImg: any;



  constructor(public globalObjects: GlobalObjectsService, private cdr: ChangeDetectorRef,
    private barScanner: BarcodeScanner, private sqlServ: SqlLiteService, public sanitizer: DomSanitizer, private platform: Platform) { 
      if(this.globalObjects.itemFlag){
        return applyLoggingDecorator(this,"special")
      }
    }

  ngOnInit() {


    if (this.specialinput.item_sub_type == 'RT' || this.specialinput.item_sub_type == 'FAVOURITE') {
      this.current_page_parameter = this.globalObjects.current_page_parameter;
      this.calc(this.specialinput.value);
    }

    else {


      if (this.specialinput.item_sub_type == 'TOGGLE') {
        if (this.specialinput.value) {
          if (this.specialinput.value.toUpperCase() === 'Y' || this.specialinput.value.toUpperCase() === '1') {
            this.toggleMode = true;
          } else {
            this.specialinput.value = this.specialinput.datatype && (this.specialinput.datatype.toLowerCase() == 'number') ? "0" : 'N';
            this.toggleMode = false;
          }
        }
      }

      var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.specialinput.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme;

      this.sqlServ.getImageFromLocal(this.specialinput, val).then((res: any) => {
        this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
      });


    }
  }


  ngAfterViewChecked() {
    if (this.specialinput.display_setting_str && this.specialinput.item_sub_type == 'TOGGLE') {
      let keys = Object.keys(this.specialinput.display_setting_str);
      let b = document.getElementById(this.specialinput.apps_item_seqid);
      if (b) {

        for (let k of keys) {
          if (k.toLocaleLowerCase() == 'active') {
            b.style.setProperty('--background-checked', this.specialinput.display_setting_str[k]);
            b.style.setProperty('--handle-background-checked', this.specialinput.display_setting_str[k]);
            // this.cdr.detectChanges();
          } else if (k.toLocaleLowerCase() == 'inactive') {
            b.style.setProperty('--background', this.specialinput.display_setting_str[k]);
            b.style.setProperty('--handle-background', this.specialinput.display_setting_str[k]);
            // this.cdr.detectChanges();
          } else {
            b.style.setProperty('--' + k, this.specialinput.display_setting_str[k])
            // this.cdr.detectChanges();
          }
        }

      }
    }

  }

  itemClick(event) {


    if (this.specialinput.item_sub_type == 'TOGGLE') {

      if (this.specialinput.initialVal) {
        delete this.specialinput['initialVal'];
        return;
      }

      if (event) {
        this.specialinput.value = this.specialinput.datatype && (this.specialinput.datatype.toLowerCase() == 'number') ? "1" : 'Y';
        this.specialinput.item_default_value = "";
        this.emitPass.emit(this.specialinput);
      } else {
        this.specialinput.value = this.specialinput.datatype && (this.specialinput.datatype.toLowerCase() == 'number') ? "0" : 'N';
        this.specialinput.item_default_value = "";
        this.emitPass.emit(this.specialinput);
      }
    } else {
      this.emitPass.emit(this.specialinput);
    }

  }

  img() {
    var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.specialinput.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme;
    return val

  }

  onImgError(event) {
    event.target.src = './assets/imgs/no_image.png'
  }
  ishover(e) {
    if (e.click_events_str) {
      return true;
    } else {
      return false;
    }
  }
  buttonClick(event) {
    console.log('vijay buttonClick this.specialinput.prompt_name ', this.specialinput.prompt_name);
    this.specialinput.rightClickFlag = false;
    this.emitPass.emit(this.specialinput);
  }

  onRightClick(event) {
    console.log(this.specialinput);
    event.preventDefault();
    this.specialinput.rightClickFlag = true;
    this.emitPass.emit(this.specialinput);
  }

  barcodescanner(event) {

    return new Promise((resolve) => {
      if (this.platform.is('android') || this.platform.is('ios')) {

        let options: BarcodeScannerOptions = {
          torchOn: false,
          showTorchButton: true,
          prompt: "Point the camera at the barcode"
        };
        this.barScanner.scan(options).then(barcodeData => {
          this.specialinput.value = barcodeData.text;
          this.specialinput.isValid = true;

          if (this.specialinput.value) {
            this.specialinput.itemClicked = 'post';
            this.emitOnChange.emit(this.specialinput);
            resolve("sucess");
          }

        }).catch(err => {

        });
      } else {


        let person = prompt("Please enter your code here:", "");
        if (person == null || person == "") {
        } else {
          this.specialinput.value = person;
          this.specialinput.isValid = true;

          if (this.specialinput.value) {
            this.specialinput.itemClicked = 'post';
            this.emitOnChange.emit(this.specialinput);
            resolve("sucess");
          }
        }
      }


    }).catch(err => {
      alert(err);
    })

  }

  calc(value) {

    if (value != undefined) {
      let tmp = value;
      if (this.specialinput.item_sub_type == 'FAVOURITE') {
        this.stars[tmp] = this.stars[tmp] == "star" ? "star-outline" : "star";
      } else {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++, tmp--) {
          if (tmp >= 1)
            this.stars[i] = "star";
          else
            this.stars[i] = "star-outline";
        }
      }
    }
  }


  setRating(value, itemDbName) {
    this.specialinput.value = value;
    if (this.specialinput.tool_tip) {
      if (this.specialinput.tool_tip.indexOf("#") > -1) {
        let ratingMsg: any = this.specialinput.tool_tip.split("#");
        this.ratingValue = ratingMsg[this.specialinput.value - 1];
      }
    }
    this.calc(value);
  }

}
