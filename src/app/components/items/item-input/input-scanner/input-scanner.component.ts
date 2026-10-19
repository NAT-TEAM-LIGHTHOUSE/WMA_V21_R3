import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
// import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular/standalone';
import { BarcodeProvider } from 'src/app/demo-utils/barcode/barcode';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { EventScannerService } from 'src/app/services/event-scanner.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [STANDALONE_IMPORTS],
  selector: 'app-input-scanner',
  templateUrl: './input-scanner.component.html',
  styleUrls: ['./input-scanner.component.scss'],
})
export class InputScannerComponent implements OnInit {

  @Input() inputScanner: any;
  @Input() frame_type: any;
  @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();

  current_page_parameter: any = {};
  public isToggled: boolean = false;
  col1 = 3;
  col2 = 9;
  plt: any;

  public scans = [];
  public scanners = [{ "SCANNER_NAME": "Please Wait...", "SCANNER_INDEX": 0, "SCANNER_CONNECTION_STATE": true }];
  public selectedScanner = "Please Select...";
  public selectedScannerId = -1;
  public ean8Decoder = true;   //  Model for decoder
  public ean13Decoder = true;  //  Model for decoder
  public code39Decoder = true; //  Model for decoder
  public code128Decoder = true;//  Model for decoder
  public dataWedgeVersion = "Pre 6.3. Please create & configure profile manually.  See the ReadMe for more details.";
  public availableScannersText = "Requires Datawedge 6.3+"
  public activeProfileText = "Requires Datawedge 6.3+";
  public commandResultText = "Messages from DataWedge will go here";
  public uiHideDecoders = true;
  public uiDatawedgeVersionAttention = true;
  public uiHideSelectScanner = true;
  public uiHideShowAvailableScanners = false;
  public uiHideCommandMessages = true;
  public uiHideFloatingActionButton = true;

  public constructor(public barcodeProvider: BarcodeProvider, private ngZone: NgZone,
    public events: EventScannerService, public changeDetectorRef: ChangeDetectorRef, public device: Device,
    public alertController: AlertController, public platform: Platform, public toastController: ToastController, private Cusevents: Events,
    private globalObjects: GlobalObjectsService,private lhs_lib: LhsLibService) {
      if(this.globalObjects.itemFlag){
        return applyLoggingDecorator(this,"input-scanner")
      }
  }


  ngOnInit(): void {

    if ((this.platform.is('android'))) {
      this.platform.ready().then((readySource) => {
        //  Check manufacturer.  Exit if this app is not running on a Zebra device
        // alert("Device manufacturer is: " + this.device.manufacturer);
        if (!(this.device.manufacturer.toLowerCase().includes("zebra") || this.device.manufacturer.toLowerCase().includes("motorola solutions"))) {
          this.presentAlert();
        }

        // alert("sendCommand")
        this.barcodeProvider.prepareScanner(this.inputScanner.item_name);
        //  Determine the version.  We can add additional functionality if a more recent version of the DW API is present
        this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");

        ////////////////////////////
        //  EVENT HANDLING
        ////////////////////////////

        //  6.3 DataWedge APIs are available\
        this.events.destroy('status:dw63ApisAvailable');
        // alert("events.destroy('status:dw63ApisAvailable')"+this.events.destroy('status:dw63ApisAvailable'))
        this.events.subscribe('status:dw63ApisAvailable', (isAvailable) => {
          // alert("available" + isAvailable)
          // alert("DataWedge 6.3 APIs are available ++++++++++++++++++++++++++++++");
          //  We are able to create the profile under 6.3.  If no further version events are received, notify the user
          //  they will need to create the profile manually
          this.barcodeProvider.sendCommand("com.symbol.datawedge.api.CREATE_PROFILE", "LHSAPP");
          this.dataWedgeVersion = "6.3.  Please configure profile manually.  See the ReadMe for more details.";

          //  Although we created the profile we can only configure it with DW 6.4.
          this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");

          //  Enumerate the available scanners on the device
          this.barcodeProvider.sendCommand("com.symbol.datawedge.api.ENUMERATE_SCANNERS", "");

          //  Functionality of the FAB is available so display the button
          this.uiHideFloatingActionButton = false;

          // this.changeDetectorRef.detectChanges();
        });

        //  6.4 Datawedge APIs are available
        this.events.destroy('status:dw64ApisAvailable');
        this.events.subscribe('status:dw64ApisAvailable', (isAvailable) => {
          // alert("DataWedge 6.4 APIs are  ---------------------------------------");

          //  Documentation states the ability to set a profile config is only available from DW 6.4.
          //  For our purposes, this includes setting the decoders and configuring the associated app / output params of the profile.
          this.dataWedgeVersion = "6.4";
          this.uiDatawedgeVersionAttention = false;
          this.uiHideDecoders = !isAvailable;

          //  Configure the created profile (associated app and keyboard plugin)
          let profileConfig = {
            "PROFILE_NAME": "LHSAPP",
            "PROFILE_ENABLED": "true",
            "CONFIG_MODE": "UPDATE",
            "PLUGIN_CONFIG": {
              "PLUGIN_NAME": "BARCODE",
              "RESET_CONFIG": "true",
              "PARAM_LIST": {}
            },
            "APP_LIST": [{
              "PACKAGE_NAME": "",
              "ACTIVITY_LIST": ["*"]
            }]
          };
          this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);

          //  Configure the created profile (intent plugin)
          let profileConfig2 = {
            "PROFILE_NAME": "LHSAPP",
            "PROFILE_ENABLED": "true",
            "CONFIG_MODE": "UPDATE",
            "PLUGIN_CONFIG": {
              "PLUGIN_NAME": "INTENT",
              "RESET_CONFIG": "true",
              "PARAM_LIST": {
                "intent_output_enabled": "true",
                "intent_action": "com.zebra.ionicdemo.ACTION",
                "intent_delivery": "2"
              }
            }
          };
          this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig2);
          alert("this is profileconfig2"+ profileConfig2);

          //  Give some time for the profile to settle then query its value
          setTimeout(function () {
            this.barcodeProvider.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");
          }, 1000);

          // this.changeDetectorRef.detectChanges();
        });

        //  6.5 Datawedge APIs are available
        this.events.destroy('status:dw65ApisAvailable');
        console.log("dw65ApisAvailable");
        this.events.subscribe('status:dw65ApisAvailable', (isAvailable) => {
          console.log("isAvailable");
          // alert("DataWedge 6.5 APIs are available  ===============================");

          //  The ability to switch to a new scanner is only available from DW 6.5 onwards
          //  Reconfigure UI so the user can choose the desired scanner
          this.uiHideSelectScanner = false;
          this.uiHideShowAvailableScanners = true;

          //  6.5 also introduced messages which are received from the API to indicate success / failure
          this.uiHideCommandMessages = false;
          this.barcodeProvider.requestResult(true);
          this.dataWedgeVersion = "6.5 or higher";
          // this.changeDetectorRef.detectChanges();
        });

        //  Response to our request to find out the active DW profile
        this.events.destroy('data:activeProfile');
        this.events.subscribe('data:activeProfile', (activeProfile) => {
          // alert("Active profile: " + activeProfile);

          //  Update the UI
          this.activeProfileText = activeProfile;

          // this.changeDetectorRef.detectChanges();
        });

        //  The result (success / failure) of our last API call along with additional information
        this.events.destroy('data:commandResult');
        this.events.subscribe('data:commandResult', (commandResult) => {
          this.commandResultText = commandResult;
          // this.changeDetectorRef.detectChanges();
        });

        //  Response to our requet to enumerte the scanners
        this.events.destroy('data:enumeratedScanners');
        this.events.subscribe('data:enumeratedScanners', (enumeratedScanners) => {
          //  Maintain two lists, the first for devices which support DW 6.5+ and shows a combo box to select
          //  the scanner to use.  The second will just display the available scanners in a list and be available
          //  for 6.4 and below
          this.scanners = enumeratedScanners;
          let humanReadableScannerList = "";
          enumeratedScanners.forEach((scanner, index) => {
            console.log("Scanner found: name= " + scanner.SCANNER_NAME + ", id=" + scanner.SCANNER_INDEX + ", connected=" + scanner.SCANNER_CONNECTION_STATE);
            humanReadableScannerList += scanner.SCANNER_NAME;
            if (index < enumeratedScanners.length - 1)
              humanReadableScannerList += ", ";
          });
          this.availableScannersText = humanReadableScannerList;
          this.scanners.unshift({ "SCANNER_NAME": "Please Select...", "SCANNER_INDEX": -1, "SCANNER_CONNECTION_STATE": false });
          // this.changeDetectorRef.detectChanges();
        });

        //  A scan has been received
        let key = 'data:scan' + this.inputScanner.item_name;
        this.events.destroy(key);
        console.log(`destroy(${key})`)
        this.events.subscribe(key, (data: any) => {

          console.log(`subscribe(${key})`)
          // console.log(data);
          //  Update the list of scanned barcodes
          // let scannedData = data.scanData.extras["com.symbol.datawedge.data_string"];

          // let val1=scannedData

          if (document.activeElement instanceof HTMLElement) {
            if (document.activeElement.offsetParent && (document.activeElement.offsetParent.id == this.inputScanner.item_name) || (document.activeElement.id == this.inputScanner.item_name)) {
              let scannedData = JSON.parse(JSON.stringify(data));
              let scannedType = data.scanData.extras["com.symbol.datawedge.label_type"];

              let val1 = scannedData.scanData.extras["com.symbol.datawedge.data_string"];
              this.inputScanner.value = val1;
              this.inputScanner.isValid = true;
              this.onChange(val1);
              document.activeElement?.blur();
            }
          }


          //  alert("from data:scan   " + JSON.stringify(scannedData))
          // this.onChange(val1);

          // this.scans.unshift({ "data": scannedData, "type": scannedType, "timeAtDecode": data.time });

          //  On older devices, if a scan is received we can assume the profile was correctly configured manually
          //  so remove the yellow highlight.
          this.uiDatawedgeVersionAttention = false;

          // this.changeDetectorRef.detectChanges();
        });
      });
    }


    if (this.platform.is('android') || this.platform.is('android')) {
      this.plt = 'android';
    } else {
      this.plt = 'browser';
    }


    if (this.inputScanner.position && (this.inputScanner.position.indexOf("column") > -1)) {
      let arr = this.inputScanner.position.split("column(");
      this.col1 = arr[1].split("-")[0];
      this.col2 = arr[1].split("-")[1].split(")")[0];
    } else if (this.inputScanner.promptCol) {
      this.col1 = this.inputScanner.promptCol;
      this.col2 = (12 - parseFloat(this.inputScanner.promptCol));
    }

    this.current_page_parameter = this.globalObjects.current_page_parameter;
  }

  //  Function to handle changes in the decoder checkboxes.  
  //  Note: SET_CONFIG only available on DW 6.4+ per the docs
  public setDecoders() {
    var paramList = {
      "scanner_selection": "auto",
      "decoder_ean8": "" + this.ean8Decoder,
      "decoder_ean13": "" + this.ean13Decoder,
      "decoder_code128": "" + this.code128Decoder,
      "decoder_code39": "" + this.code39Decoder
    }
    //  The "scanner_selection" parameter supports "auto" to apply to the default scanner.
    //  If we have selected a different scanner we need to ensure the settings are applied
    //  to the correct scanner by specifying "current-device-id".  See http://techdocs.zebra.com/datawedge/6-7/guide/api/setconfig/
    //  for more information.  selectedScannerId will be >-1 if the user has chosen a specific scanner.
    if (this.selectedScannerId > -1) {
      paramList["current-device-id"] = "" + this.selectedScannerId;
      delete paramList["scanner_selection"];
    }
    //  Set the new configuration
    let profileConfig = {
      "PROFILE_NAME": "LHSAPP",
      "PROFILE_ENABLED": "true",
      "CONFIG_MODE": "UPDATE",
      "PLUGIN_CONFIG": {
        "PLUGIN_NAME": "BARCODE",
        "PARAM_LIST": paramList
      }
    };
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);
  }

  public async presentAlert() {
    let alert = await this.alertController.create({
      subHeader: 'Requires Zebra device',
      message: 'This application requires a Zebra mobile device in order to run',
      cssClass: 'nonZebraAlert',
      buttons: [{
        text: 'Close app',
        handler: data => {
          console.log('Closing application since we are not running on a Zebra device');
          navigator['app'].exitApp();
        }
      }]
    });
    await alert.present();
  }

  //  Function to handle the user selecting a new scanner
  //  Note: SWITCH_SCANNER only available on DW 6.5+
  public async scannerSelected() {
    // alert("Requested scanner is: " + this.selectedScanner);
    let localScannerIndex = 0;
    let localScannerName = "";
    for (let scanner of this.scanners) {
      //  The current scanner will be returned as SCANNER_CONNECTION_STATE
      if (scanner.SCANNER_NAME == this.selectedScanner) {
        localScannerIndex = scanner.SCANNER_INDEX;
        localScannerName = scanner.SCANNER_NAME;
      }
    }
    if (this.selectedScannerId == localScannerIndex || localScannerIndex < 0) {
      // alert("Not switching scanner, new scanner ID == old scanner ID");
      let toast = await this.toastController.create({
        message: 'Invalid scanner selection',
        position: 'bottom',
        duration: 3000
      });
      await toast.present();
      return;
    }
    this.selectedScanner = localScannerName;
    this.selectedScannerId = localScannerIndex;
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SWITCH_SCANNER", localScannerIndex + "");
    //  Enumerate the scanner - this will update the actual scanner in use so we do not have to worry about whether SWITCH_SCANNER succeeded
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.ENUMERATE_SCANNERS", "");
  }

  //  Function to handle the floating action button onDown.  Start a soft scan.
  public fabDown() {
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");
  }

  //  Function to handle the floating action button onUp.  Cancel any soft scan in progress.
  public fabUp() {
    this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "STOP_SCANNING");
  }

  // onChange() {
  //   this.inputScanner.isValid = true;
  //   // alert(JSON.stringify(this.inputScanner));
  //   if (this.inputScanner.value) {
  //     // alert(this.inputScanner.value);
  //     this.emitPass.emit(this.inputScanner);
  //     // alert(this.inputScanner.value);

  //   }
  // }

  onChange(val1) {
    // setTimeout(() => {



    console.count()
    if (this.inputScanner.value) {
      console.log("inside if =>>>> " + this.inputScanner.value);
      this.inputScanner.isValid = true;
      this.get_regex(this.inputScanner.input_pattern);
      console.log("after regex =>>>> " + this.inputScanner.value);
    }
    if (this.inputScanner.isValid) {
      this.inputScanner.blurValue = this.inputScanner.value;
      console.log("inside blurValue =>>>> " + this.inputScanner.value);
    }

    this.inputScanner.itemClicked = 'post';
    console.log("send post insput scanner =>>>> " + this.inputScanner.value);

    this.emitOnChange.emit(this.inputScanner);
    if (this.inputScanner.msgError) {
      this.inputScanner.msgError = "";
    }
    // this.ngZone.run(() => {
    //   this.changeDetectorRef.detectChanges();
    // })

    // }, 5);
  }

  get_regex(type) {
    if (type) {
      if (type.toUpperCase() == 'CAPS') {
        this.inputScanner.value = (this.inputScanner.value).toUpperCase();
        // return "/^[A-Z]*$/";
        return true;
      } else if (type.toUpperCase() == 'INITCAPS') {
        if (this.inputScanner.value) {
          let text = "";
          let valarr = this.inputScanner.value.split(" ");
          for (let i = 0; i < valarr.length; i++) {
            // if(i == 0){
            text = text + " " + valarr[i].toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            // } else {
            //   text = text + " " + valarr[i];
            // }
          }
          this.inputScanner.value = text.replace(" ", "");
        }
        // return "/^[A-Z][a-z0-9_-]{3,19}$/";
        return true;
      } else if (type.toUpperCase() == 'LOWER') {
        this.inputScanner.value = (this.inputScanner.value).toLowerCase();
        // return "/^[a-z]*$/";
        return true;
      } else if (type.toUpperCase() == 'NUMBER') {
        this.inputScanner.value = (this.inputScanner.value);
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
        this.inputScanner.value = (this.inputScanner.value).toUpperCase();
        return `/^[A0-Z0\\.\\-]+$/`;
        return true;
      } else {
        return type;
      }
    }
  }

  itemClicked(item) {

    if (item.value) {
      this.inputScanner.oldValue = item.value;
      console.log("item.value if =>>>> " + item.value);

    }
    this.inputScanner.itemClicked = 'pre';
    this.emitPass.emit(this.inputScanner)
    console.log("inputscanner.value if =>>>> " + this.inputScanner.value);
  }

  barcodescanner() {

    console.log("inside barcodescanner =>>>> " + this.inputScanner.value);
    BarcodeScanner.isSupported().then(({ supported }) => {
      if (!supported) {
        throw new Error('Barcode scanning is not supported on this device');
      }
      return BarcodeScanner.requestPermissions();
    }).then(({ camera }) => {
      if (camera !== 'granted') {
        throw new Error(`Camera permission was not granted: ${camera}`);
      }
      return BarcodeScanner.scan({ autoZoom: true });
    }).then(({ barcodes }) => {
      const barcodeData = barcodes[0];
      if (!barcodeData?.rawValue) {
        return;
      }

      this.inputScanner.value = barcodeData.rawValue;
      console.log("barcodescanner ====>>>>> " + barcodeData.rawValue);
      this.inputScanner.isValid = true;
      this.onChange(barcodeData.rawValue);
    }).catch(err => {
      console.error('Barcode scanner error:', err);
    });
  }

  cleardata() {
    this.isToggled = false;
    console.log("incleardata" + this.inputScanner.value)
    this.inputScanner.value = "";
    this.inputScanner.blurValue = "";

    console.log("incleardata" + this.inputScanner.value)

    this.globalObjects.focusArrow = true;
    delete this.inputScanner['forcedFocus'];
    this.Cusevents.publish("clearEvent");
    this.lhs_lib.go_item(this.inputScanner.apps_page_frame_seqid + "." + this.inputScanner.item_name, this.inputScanner.indexcount, true);

// FOR RESTART ZEBRA DEVICE AFTER CLEARING THE INPUT DATA
    // this.barcodeProvider.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", "START_SCANNING");

    this.barcodeProvider.prepareScanner(this.inputScanner.item_name);
  }
}
