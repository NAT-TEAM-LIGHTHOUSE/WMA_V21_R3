import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-barcode-input',
  templateUrl: './barcode-input.component.html',
  styleUrls: ['./barcode-input.component.scss'],
})
export class BarcodeInputComponent implements OnInit {

  @Input() barcodeinput: any = {};
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
  current_page_parameter: any = {};
  public isToggled: boolean = false;

  constructor(private barScanner: BarcodeScanner,
    private globalObjects: GlobalObjectsService) {
      if(this.globalObjects.itemFlag){
        return applyLoggingDecorator(this,"barcode-input")
      }
  }

  ngOnInit() {

    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }


  onChange(onChange) {
    if(this.barcodeinput.msgError){
      this.barcodeinput.msgError = "";
    }
      this.emitOnChange.emit(this.barcodeinput)
  }

  barcodescanner() {
    let options: BarcodeScannerOptions = {
      torchOn: false,
      showTorchButton: true,
      prompt: "Point the camera at the barcode"
    };
    this.barScanner.scan(options).then(barcodeData => {
      this.barcodeinput.value = barcodeData.text;
      this.barcodeinput.isValid = true;
      this.onChange('ionChange');
    }).catch(err => {

    });
  }

  notify() {
    this.barcodescanner();
    this.isToggled = !this.isToggled;
  }

  cleardata() {
    this.isToggled = false;
    this.barcodeinput.value = "";
  }
}