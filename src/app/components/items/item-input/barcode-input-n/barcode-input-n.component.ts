import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Platform } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-barcode-input-n',
  templateUrl: './barcode-input-n.component.html',
  styleUrls: ['./barcode-input-n.component.scss'],
})
export class BarcodeInputNComponent implements OnInit {

  @Input() barcodeinput: any = {};
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  public isToggled: boolean = false;
  col1 = 3;
  col2 = 9;
  plt:any;
  constructor(private events:Events,private platform : Platform,
    private globalObjects: GlobalObjectsService) {
      if(this.globalObjects.itemFlag){
        return applyLoggingDecorator(this,"barcode-input-n")
      }
  }

  ngOnInit() {
    if(this.platform.is('android') || this.platform.is('android')){
      this.plt = 'android';
    }else{
      this.plt = 'browser';
    }


    if (this.barcodeinput.position && (this.barcodeinput.position.indexOf("column") > -1)) {
      let arr = this.barcodeinput.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    } else if (this.barcodeinput.promptCol) {
      this.col1 = this.barcodeinput.promptCol;
      this.col2 = (12 - parseFloat(this.barcodeinput.promptCol));
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }

  onChange(item) {

    if(this.barcodeinput.value){
      console.log("inside if");
      this.barcodeinput.isValid = true;
      this.get_regex(this.barcodeinput.input_pattern);
    }
    if (this.barcodeinput.isValid) {
      this.barcodeinput.blurValue = this.barcodeinput.value;
    }

    this.barcodeinput.itemClicked = 'post';
    this.emitOnChange.emit(this.barcodeinput);
    if(this.barcodeinput.msgError){
      this.barcodeinput.msgError = "";
    }
  }

  async barcodescanner() {
    console.log("inside barcode scanner");
    try {
      const { supported } = await BarcodeScanner.isSupported();
      if (!supported) {
        console.error('Barcode scanning is not supported on this device');
        return;
      }

      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted') {
        console.error('Camera permission was not granted:', camera);
        return;
      }

      const { barcodes } = await BarcodeScanner.scan({ autoZoom: true });
      const barcodeData = barcodes[0];
      if (!barcodeData?.rawValue) {
        return;
      }

      console.log('Barcode data', barcodeData);
      this.barcodeinput.value = barcodeData.rawValue;
      this.barcodeinput.isValid = true;
      this.onChange('ionChange');
    } catch (err) {
      console.error('Barcode scanner error:', err);
    }
  }


  notify() {
    this.barcodescanner();
    this.isToggled = !this.isToggled;
  }

  cleardata() {
    this.isToggled = false;
    this.barcodeinput.value = "";
  }


  
  get_regex(type) {
    if(type){
    if (type.toUpperCase() == 'CAPS') {
      this.barcodeinput.value = (this.barcodeinput.value).toUpperCase();
      return true;
    } else if (type.toUpperCase() == 'INITCAPS') {
      if (this.barcodeinput.value) {
        let text = "";
        let valarr = this.barcodeinput.value.split(" ");
        for (let i = 0; i < valarr.length; i++) {
          text = text + " " + valarr[i].toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }
        this.barcodeinput.value = text.replace(" ", "");
      }
      return true;
    } else if (type.toUpperCase() == 'LOWER') {
      this.barcodeinput.value = (this.barcodeinput.value).toLowerCase();
      return true;
    } else if (type.toUpperCase() == 'NUMBER') {
      this.barcodeinput.value = (this.barcodeinput.value);
      return "/^-?[0-9]\\d*(\\.\\d+)?$/";
      return true;
    } else if (type.toUpperCase() == 'SENTENCE') {
      return "/^[A-Z][^\.:]*[\.]$/";
      return true;
    } else if (type.toUpperCase() == 'MOBILE') {
      return "/^[0-9]{10}$/";
      return true;
    } else if (type.toUpperCase() == 'EMAIL') {
      return `/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/`;
      return true;
    } else if (type.toUpperCase() == 'PNUMBER') {
      return `/^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$/`;
      return true;
    } else if (type.toUpperCase() == 'ALPHANUMERIC') {
      this.barcodeinput.value = (this.barcodeinput.value).toUpperCase();
      return `/^[A0-Z0\\.\\-]+$/`;
      return true;
    } else {
      return type;
    }
  }
  }

  itemClicked(item) {
    if (item.value) {
      this.barcodeinput.oldValue = item.value;
    }
    this.barcodeinput.itemClicked = 'pre';
    this.emitPass.emit(this.barcodeinput)
  }





  // New code for continue scan of barcode after first scan without closing the scanner
  
}
