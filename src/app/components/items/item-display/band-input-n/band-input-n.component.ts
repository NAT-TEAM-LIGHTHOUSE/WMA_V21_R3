import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { SqlLiteService } from 'src/app/services/sql-lite.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-band-input-n',
  templateUrl: './band-input-n.component.html',
  styleUrls: ['./band-input-n.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class BandInputNComponent implements OnInit {

  @Input() bandinput: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  baseImg: any;
  num: number;

  constructor(public globalObjects: GlobalObjectsService, private  barScanner: BarcodeScanner, private sqlServ: SqlLiteService, public sanitizer: DomSanitizer) {
    this.num = this.globalObjects.colorcount;
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"band-input-n")
    }
  }

  ngOnInit() {
    if (this.bandinput.value) {
      this.bandinput.value = this.bandinput.value.split('@');
    }

    if (this.bandinput.apps_icon_name) {
      var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.bandinput.apps_icon_name + '&appTheme=' + this.globalObjects.appTheme;

      this.sqlServ.getImageFromLocal(this.bandinput, val).then((res: any) => {
        this.baseImg = this.sanitizer.bypassSecurityTrustUrl(res);
      });
    }
  }

  img() {
    var val = this.globalObjects.getScopeUrl() + 'getImage?id=' + this.bandinput.apps_item_seqid + '&appTheme=' + this.globalObjects.appTheme;
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
  itemClicked(event) {
    this.bandinput.rightClickFlag = false;
    this.emitPass.emit(this.bandinput);
  }

  onRightClick(event) {
    event.preventDefault();
    this.bandinput.rightClickFlag = true;
    this.emitPass.emit(this.bandinput);
  }

  barcodescanner(event) {

    return new Promise((resolve) => {

      let options: BarcodeScannerOptions = {
        torchOn: false,
        showTorchButton: true,
        prompt: "Point the camera at the barcode"
      };
      this.barScanner.scan(options).then(barcodeData => {
        this.bandinput.value = barcodeData.text;
        this.bandinput.isValid = true;

        if (this.bandinput.value) {


          this.emitPass.emit(this.bandinput);
          resolve("sucess");
        }

      }).catch(err => {

      });

    }).catch(err => {
      alert(err);
    })

  }

}
