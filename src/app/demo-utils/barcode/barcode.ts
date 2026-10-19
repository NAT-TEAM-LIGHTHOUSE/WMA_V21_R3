/*
* Copyright (C) 2018 Zebra Technologies Corp
* All rights reserved.
*/

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EventScannerService } from 'src/app/services/event-scanner.service';
import { Platform } from '@ionic/angular/standalone';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class BarcodeProvider {

  private requestResultCodes = "false";

  constructor(public events: EventScannerService, private platform: Platform,@Inject(PLATFORM_ID) private platformId: Object) {
    

  }

  prepareScanner(itemSeq){
      if (isPlatformServer(this.platformId)) return;
    this.platform.ready().then((readySource) => {

      //   alert("inside barcode service")
        let constructorInstance = this;
  
        //  The Datawedge service will respond via implicit broadcasts intents.  
        //  Responses may be the result of calling the Datawedge API or may be because a barcode was scanned
        //  Set up a broadcast receiver to listen for incoming scans
        (<any>window).plugins.intentShim.registerBroadcastReceiver({
          filterActions: [
            'com.zebra.ionicdemo.ACTION',           //  Response from scan (needs to match value in output plugin)
            'com.symbol.datawedge.api.RESULT_ACTION'//  Response from DataWedge service (as defined by API)
          ],
          filterCategories: [
            'android.intent.category.DEFAULT'
          ]
        },
          function (intent) {
            //  Broadcast received
            console.log('Received Intent: ' + JSON.stringify(intent.extras));
  
            //  Emit a separate event for the result associated with this scan.  This will only be present in response to
            //  API calls which included a SEND_RESULT extra
            if (intent.extras.hasOwnProperty('RESULT_INFO')) {
              let commandResult = intent.extras.RESULT + " (" +
                intent.extras.COMMAND.substring(intent.extras.COMMAND.lastIndexOf('.') + 1, intent.extras.COMMAND.length) + ")";  // + JSON.stringify(intent.extras.RESULT_INFO);
              constructorInstance.events.publish('data:commandResult', commandResult.toLowerCase());
              console.log("RESULT_INFO")
            }
  
            if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_VERSION_INFO')) {
              // alert("com.symbol.datawedge.api.RESULT_GET_VERSION_INFO")
              //  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX  
              var versionInfo = intent.extras['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO'];
              console.log('Version Info: ' + JSON.stringify(versionInfo));
              let datawedgeVersion = versionInfo['DATAWEDGE'];
              console.log("Datawedge version: " + datawedgeVersion);
  
              //  Fire events sequentially so the application can gracefully degrade the functionality available on earlier DW versions
              if (datawedgeVersion >= "6.3") {
                constructorInstance.events.publish('status:dw63ApisAvailable', true);
              } else if (datawedgeVersion >= "6.4") {
                constructorInstance.events.publish('status:dw64ApisAvailable', true);
              } else if (datawedgeVersion >= "6.5") {
                console.log(">6.5");
                constructorInstance.events.publish('status:dw65ApisAvailable', true);
              }
            }
            else if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS')) {
              //  Return from our request to enumerate the available scanners
              // alert("'com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'")
              let enumeratedScanners = intent.extras['com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'];
              constructorInstance.events.publish('data:enumeratedScanners', enumeratedScanners);
              // alert("constructorInstance.events.publish('data:enumeratedScanners', enumeratedScanners)" + constructorInstance.events.publish('data:enumeratedScanners', enumeratedScanners))
            }
            else if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE')) {
              //  Return from our request to obtain the active profile
              // alert("intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'" + intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'))
              let activeProfile = intent.extras['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'];
              // alert("activeProfile" + activeProfile)
              constructorInstance.events.publish('data:activeProfile', activeProfile);
            }
            else if (!intent.extras.hasOwnProperty('RESULT_INFO')) {
              //  A barcode has been scanned
              // alert("scanData: intent, time: new Date().toLocaleTimeString()" + { scanData: intent, time: new Date().toLocaleTimeString() })
              let key = 'data:scan' + itemSeq;
              constructorInstance.events.publish(key, { scanData: intent, time: new Date().toLocaleTimeString() });
            }
          }
        );
  
      });
  }
  //  Control whether or not to include the SEND_RESULT extra in our commands to request DW send the
  //  result back to us.  Only available in DW6.5+
  requestResult(requestCodes: boolean) {
    this.requestResultCodes = "" + requestCodes;
  }

  //  Send a broadcast intent to the DW service which is present on all Zebra devcies.
  //  This functionality requires DW6.3+ as that is the version where the com.symbol.datawedge.api.ACTION
  //  was introduced.
  //  extraValue may be a String or a Bundle
  sendCommand(extraName: string, extraValue) {
    console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
    (<any>window).plugins.intentShim.sendBroadcast({
      action: 'com.symbol.datawedge.api.ACTION',
      extras: {
        [extraName]: extraValue,
        "SEND_RESULT": this.requestResultCodes
      }
    },
      function () { },  //  Success in sending the intent, not success of DW to process the intent.
      function () { }   //  Failure in sending the intent, not failure of DW to process the intent.
    );
  }

}

