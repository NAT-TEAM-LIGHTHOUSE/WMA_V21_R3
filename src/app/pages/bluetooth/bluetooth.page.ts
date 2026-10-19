import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController, PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit {

  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: any;
  inputData: any;
  data: any;
  bytes: any;
  debug: string;

  constructor(private bluetoothSerial: BluetoothSerial,private alertController: AlertController, private cdr: ChangeDetectorRef,
    private popOver: PopoverController,private globalObjects:GlobalObjectsService) { 
      if(this.globalObjects.pagesFlag){
        return applyLoggingDecorator(this,"bluetooth")
      }
    }

  ngOnInit() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    const unPair: any[] = [];
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      success.forEach((value: { id: string; }, key: any) => {
        var exists = false;
        unPair.forEach((val2, i) => {
          if (value.id === val2.id) {
            exists = true;
          }
        });
        if (exists === false && value.id !== '') {
          unPair.push(value);
        }
      });
      this.unpairedDevices = unPair;
      this.gettingDevices = false;
    },
      (err) => {
        console.log(err);
      });

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    },
      (err) => {

      });
  }

  success = (data: any) => {
    this.deviceConnected();
  }
  fail = (error: any) => {
    alert(error);
  }

  async selectDevices(id: any) {
    const alert = await this.alertController.create({
      header: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.popOver.dismiss();
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(id).subscribe(this.success, this.fail);
            this.bluetoothSerial.available().then(data => {
              console.log("Available " + (data));
              this.bluetoothSerial.read().then(data => {
                console.log("Read " + (data));
                this.data = this.inputData;
                this.popOver.dismiss();
              });
            });
          }

        }
      ]
    });
    await alert.present();
  }

  deviceConnected() {
    this.bluetoothSerial.isConnected().then(success => {
      alert('Connected Successfullly');
    }, error => {
      alert('error' + JSON.stringify(error));
    });
  }

  async disconnect() {
    const alert = await this.alertController.create({
      header: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    await alert.present();
  }

  gettData() {

    let datas = [];
    this.bluetoothSerial.subscribe('kg').subscribe((data: any) => {
      let d = 'val' + data;
      console.log(d)

      let dd = new RegExp('\r?\n', 'g')

      let enteredText = d;
      let lineBreaks = (enteredText.match(/\n/g) || [])
      let numberOfLineBreaks = (enteredText.match(/\n/g) || []).length;
      let characterCount = enteredText.length + numberOfLineBreaks;
      console.log(lineBreaks);
      let breakS = JSON.stringify(lineBreaks)
      console.log(breakS)
      console.log(characterCount);
      console.log(lineBreaks)
      if(lineBreaks[0] == "\n"){
        let vall: any = d;

        this.bytes = vall.replaceAll('val', '');
        console.log(this.bytes)

      }

      console.log(this.bytes);

      this.bluetoothSerial.clear();
      // setTimeout(() => {
      //   this.cdr.detectChanges();
      // }, 100)
      console.log(this.bytes);
    });
  }

  getRawData(){
      this.bluetoothSerial.read().then((dd) => {
        this.debug += "\n" + JSON.stringify(dd);
        console.log(this.debug)
        this.bluetoothSerial.clear().then(data => {
          console.log("Is buffer clear before reciving new messages?:", data);
      });
       });
  }
}
