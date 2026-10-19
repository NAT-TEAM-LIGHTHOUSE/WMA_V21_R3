import { Component, Input, OnInit } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[STANDALONE_IMPORTS],
  selector: 'app-bluetooth-device',
  templateUrl: './bluetooth-device.component.html',
  styleUrls: ['./bluetooth-device.component.scss'],
})
export class BluetoothDeviceComponent implements OnInit {

  @Input() bluetooth: any;

  scanData: any;
  bytes: any;

  constructor(private bluetoothSerial: BluetoothSerial,private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"bluetooth-device")
    }
   }

  ngOnInit() {}


  getScanData() {
    this.bluetoothSerial.subscribe('kg').subscribe((data: any) => {
      let d = 'val' + data;
      let enteredText = d;
      let lineBreaks = (enteredText.match(/\n/g) || [])
      let numberOfLineBreaks = (enteredText.match(/\n/g) || []).length;
      console.log(lineBreaks);
      let breakS = JSON.stringify(lineBreaks);
      if(lineBreaks[0] == "\n"){
        let vall: any = d;
        this.bluetooth.value = vall.replaceAll('val', '');
      }
      this.bluetoothSerial.clear();
    });
  }


  

}
