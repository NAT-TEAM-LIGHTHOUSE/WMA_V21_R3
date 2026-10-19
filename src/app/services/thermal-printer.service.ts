import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Injectable({
  providedIn: 'root'
})
export class ThermalPrinterService {

  constructor(private bluetoothSerial: BluetoothSerial) { }


  connect(address: string) {
    return this.bluetoothSerial.connect(address);
  }

  print(data: string) {
    return this.bluetoothSerial.write(data);
  }

  disconnect() {
    return this.bluetoothSerial.disconnect();
  }
}
