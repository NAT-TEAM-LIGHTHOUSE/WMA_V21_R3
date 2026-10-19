import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';

@Component({
standalone : true,
  selector: 'app-rf-id-code',
  templateUrl: './rf-id-code.component.html',
  styleUrls: ['./rf-id-code.component.scss'],
})
export class RfIdCodeComponent   {

//  @Input() rfidcodeinput: any = {};
//   @Output() emitOnChange: EventEmitter<any> = new EventEmitter<any>();
//   @Output() emitPass: EventEmitter<any> = new EventEmitter<any>();
//   current_page_parameter: any = {};
//   public isToggled: boolean = false;
//   col1 = 3;
//   col2 = 9;
//   plt:any;
//   rfid_value="";
//   constructor( private platform : Platform,private http : HttpClient,
//     private globalObjects: GlobalObjectsService) {
//       if(this.globalObjects.itemFlag){
//         return applyLoggingDecorator(this,"barcode-input-n")
//       }
//   }

//   ngOnInit() {
//     if(this.platform.is('android') || this.platform.is('android')){
//       this.plt = 'android';
      
//     }else{
//       this.plt = 'browser';
//       this.openWebSocket('3');
//     }

//     if (this.rfidcodeinput.position && (this.rfidcodeinput.position.indexOf("column") > -1)) {
//       let arr = this.rfidcodeinput.position.split("column(");
//       this.col1 = arr[1].split("-")[0];
//       this.col2 = arr[1].split("-")[1].split(")")[0];
//     } else if (this.rfidcodeinput.promptCol) {
//       this.col1 = this.rfidcodeinput.promptCol;
//       this.col2 = (12 - parseFloat(this.rfidcodeinput.promptCol));
//     }

//     this.current_page_parameter = this.globalObjects.current_page_parameter;
//   }



//   ngOnDestroy():void {
// this.closeWebSocket('3')
//   }
  



//   getClosedSession() {
//     this.http.get('http://localhost:9006/closedSession', { responseType: 'text' })
//       .subscribe(
//         data => console.log('Response:', data),
//         error => console.error('Error:', error)
//       ).unsubscribe();
//   }

  
//   onChange(item) {
//      console.log(this.rfidcodeinput.value)
//     if(this.rfidcodeinput.value){
//       console.log("inside if");
//       this.rfidcodeinput.isValid = true;
//       this.get_regex(this.rfidcodeinput.input_pattern);
//     }
//     if (this.rfidcodeinput.isValid) {
//       this.rfidcodeinput.blurValue = this.rfidcodeinput.value;
//     }

//     this.rfidcodeinput.itemClicked = 'post';
//     this.emitOnChange.emit(this.rfidcodeinput);
//     if(this.rfidcodeinput.msgError){
//       this.rfidcodeinput.msgError = "";
//     }
//   }
//   rfidscanner() {
//   //  this.rfidcodeinput.value ="";
//       this.rfidcodeinput.isValid = true;
//       // this.checkMonoCall();
//       this.openWebSocket('1')

//       // setTimeout(() => {
//       //   this.onChange('ionChange');
//       // }, 100)

  
//       console.log("rf id input ", this.rfidcodeinput.value)
//       // this.onChange('ionChange'); 
//   }







//   notify() {
//     // this.barcodescanner();
//     this.isToggled = !this.isToggled;
//   }

//   cleardata() {
//     this.isToggled = false;
//     this.rfidcodeinput.value = "";
//   }


  
//   get_regex(type) {
//     if(type){
//     if (type.toUpperCase() == 'CAPS') {
//       this.rfidcodeinput.value = (this.rfidcodeinput.value).toUpperCase();
//       return true;
//     } else if (type.toUpperCase() == 'INITCAPS') {
//       if (this.rfidcodeinput.value) {
//         let text = "";
//         let valarr = this.rfidcodeinput.value.split(" ");
//         for (let i = 0; i < valarr.length; i++) {
//           text = text + " " + valarr[i].toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
//         }
//         this.rfidcodeinput.value = text.replace(" ", "");
//       }
//       return true;
//     } else if (type.toUpperCase() == 'LOWER') {
//       this.rfidcodeinput.value = (this.rfidcodeinput.value).toLowerCase();
//       return true;
//     } else if (type.toUpperCase() == 'NUMBER') {
//       this.rfidcodeinput.value = (this.rfidcodeinput.value);
//       return "/^-?[0-9]\\d*(\\.\\d+)?$/";
//       return true;
//     } else if (type.toUpperCase() == 'SENTENCE') {
//       return "/^[A-Z][^\.:]*[\.]$/";
//       return true;
//     } else if (type.toUpperCase() == 'MOBILE') {
//       return "/^[0-9]{10}$/";
//       return true;
//     } else if (type.toUpperCase() == 'EMAIL') {
//       return `/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/`;
//       return true;
//     } else if (type.toUpperCase() == 'PNUMBER') {
//       return `/^[+]?([0-9]+(?:[\\.][0-9]*)?|\\.[0-9]+)$/`;
//       return true;
//     } else if (type.toUpperCase() == 'ALPHANUMERIC') {
//       this.rfidcodeinput.value = (this.rfidcodeinput.value).toUpperCase();
//       return `/^[A0-Z0\\.\\-]+$/`;
//       return true;
//     } else {
//       return type;
//     }
//   }
//   }

//   itemClicked(item) {
//     this.rfidscanner();
//     if (item.value) {
//       this.rfidcodeinput.oldValue = item.value;
//     }
//     this.rfidcodeinput.itemClicked = 'pre';
//     this.emitPass.emit(this.rfidcodeinput)
//   }





//   // new integration of RFid

//   logs: string = '';
// private webSocket: WebSocket;
// // checkMonoCall(){
// //   this.webSocket = new WebSocket('ws://localhost:8080/stocks');
// //   this.webSocket.onmessage = (event) => {
 
// //     let  datavalue:any=JSON.parse(event.data)
// //     console.log(JSON.parse(event.data));
// //     // this.rfidcodeinput.value =datavalue["icon"];
// //    this.rfid_value=datavalue["icon"];

// //   if(this.rfid_value && this.rfid_value.length>0){
// //     this.rfidcodeinput.value=this.rfid_value;
// //     alert(this.rfidcodeinput.value);
// //   }
// //   };
// //   console.log("rfid value : ",this.rfidcodeinput.value);

// // }



// async checkMonoCall() {
//   this.webSocket = new WebSocket('ws://localhost:9006/stocks');

//   this.webSocket.onmessage = async (event) => {
//     try {
//       let datavalue: any = JSON.parse(event.data);
//       console.log("Received WebSocket message:", datavalue);
      
//       this.rfid_value = datavalue["rfidValue"];

//       if (this.rfid_value) {
//         this.rfidcodeinput.value = this.rfid_value;

//         // Simulating an async operation (e.g., API call, database write)
//         // await this.someAsyncFunction(this.rfid_value);

//         // alert(this.rfidcodeinput.value);

//         // Log after async operation
//         console.log("Updated rfid value:", this.rfidcodeinput.value);
//         this.onChange('ionChange');
//       }
//     } catch (error) {
//       console.error("Error processing WebSocket message:", error);
//     }
//   };
// }



// checkMonoCalstopl(){
//   this.logs=""
//   // this.dataService.stopScanning();
// }





// // //////////////////////////////////////////////////New RFID CODE////////////////////////////
// private webSockets: Map<string, any> = new Map();

// // openWebSocket(userId: string) {
// //   const webSocket = new WebSocket(`ws://192.168.100.143:8080/rfid`);
// //    let sessionIdData:any;
// //   webSocket.onopen = () => {
// //     console.log(`WebSocket connection established for User: ${userId}`);
// //     webSocket.send(userId); // Send user ID to server
// //   };

// //   // webSocket.onmessage = (event) => {
// //   //   console.log(`Message received for ${userId}:`, event.data);
// //   //   // sessionIdData=event.data;
// //   //   //
// //   //   if(event.data.includes("Session started:")){
// //   //   sessionIdData=event.data;
// //   //   if(sessionIdData){
// //   //     sessionIdData=sessionIdData.replace("Session started:","").trim();
// //   //     let sessionDataObj:any={
// //   //       "websocket":webSocket,
// //   //       "sessionid":sessionIdData
        
// //   //      }
// //   //     // this.webSockets.set(userId, webSocket);
// //   //     this.webSockets.set(userId, sessionDataObj);
// //   //   }
// //   //   }
// //   // };
// //   webSocket.onmessage = (event) => {
// //     console.log(`Message received for ${userId}:`, event.data);
  
// //     if (event.data.includes("Session started:")) {
// //       sessionIdData = event.data.replace("Session started:", "").trim();
// //       let sessionDataObj: any = {
// //         websocket: webSocket,
// //         sessionid: sessionIdData,
// //       };
// //       this.webSockets.set(userId, sessionDataObj);
// //     } else {
// //       // Assign the received data to the input field
// //       this.rfidcodeinput.value = event.data; 
// //     }
// //   };
// //   webSocket.onclose = (event) => {
// //     console.log(`WebSocket closed for User: ${userId}. Code: ${event.code}, Reason: ${event.reason}`);
// //     this.webSockets.delete(userId); // Remove from active sessions
// //     console.log(this.webSockets);
// //   };


// //   // if( sessionIdData){
// //   //   sessionIdData=sessionIdData.replace("Session started:","").trim();
// //   //   let sessionDataObj:any={
// //   //     "websocket":webSocket,
// //   //     "sessionid":sessionIdData
      
// //   //    }
// //   //   // this.webSockets.set(userId, webSocket);
// //   //   this.webSockets.set(userId, sessionDataObj);
// //   // }
// //   // let sessionDataObj:any={
// //   //   "websocket":webSocket,
// //   //   "sessionid":sessionIdData
    
// //   //  }
// //   // // this.webSockets.set(userId, webSocket);
// //   // this.webSockets.set(userId, sessionDataObj);

  
// // }

// // closeWebSocket(userId: string) {
// //   const webSocketObj = this.webSockets.get(userId);
// //   const webSocket=webSocketObj['websocket'];
// //   const sessionId=webSocketObj['sessionid'];
// //   if (webSocket) {
// //     const closeMessage = `closeSession:${userId}`;
// //     // const closeMessage = `closeSession:${sessionId}`;

    
// //     webSocket.send(closeMessage); // Request server to close this session
// //     webSocket.close(1000, "Client requested closure");
// //     console.log(`Requested closure for User: ${userId}`);
// //     console.log(`Requested closure for User: ${sessionId}`);

// //   } else {
// //     console.log(`No active WebSocket found for User: ${userId}`);
// //   }
// // }




// private g_webSocketData:any;
// openWebSocket(userId: string) {
//   const webSocket = new WebSocket(`ws://192.168.100.87:8080/rfid`);
//    let sessionIdData:any;
//   webSocket.onopen = () => {
//     console.log(`WebSocket connection established for User: ${userId}`);
//     webSocket.send(userId); // Send user ID to server
//   };

//   webSocket.onmessage = (event) => {
//     console.log(`Message received for ${userId}:`, event.data);
  
//     if (event.data.includes("Session started:")) {
//       sessionIdData = event.data.replace("Session started:", "").trim();
//       let sessionDataObj: any = {
//         websocket: webSocket,
//         sessionid: sessionIdData,
//       };
//       // this.webSockets.set(userId, sessionDataObj);
//       console.log("session value "+event.data);
//     this.g_webSocketData=sessionDataObj;
//     } else {
//       // Assign the received data to the input field
//       this.rfidcodeinput.value = event.data; 
//     }
//   };
//   webSocket.onclose = (event) => {
//     console.log(`WebSocket closed for User: ${userId}. Code: ${event.code}, Reason: ${event.reason}`);
//   };

// }

// saveAndReadNext(userId:any){
//   const webSocket=this.g_webSocketData['websocket'];
//   webSocket.send(userId+"#"+"ok"+"#"+"true");
// }


// closeAllWebSockets() {
//   this.webSockets.forEach((webSocket, userId) => {
//     webSocket.close(1000, "Client closing all connections");
//   });
//   this.webSockets.clear();
//   console.log("All WebSocket connections closed.");
// }

// // //////////////new code//////////////////////////////
// closeWebSocket(userId: string) {
//   // const webSocketObj = this.webSockets.get(userId);
//   // const webSocket=webSocketObj['websocket'];
//   // const sessionId=webSocketObj['sessionid'];
//   const webSocket=this.g_webSocketData['websocket'];
//   const sessionId=this.g_webSocketData['sessionid'];
//   if (webSocket) {
//     const closeMessage = `closeSession:${userId}`;
//     // const closeMessage = `closeSession:${sessionId}`;
//     webSocket.send(closeMessage); // Request server to close this session
//     webSocket.close(1000, "Client requested closure");
//     console.log(`Requested closure for User: ${userId}`);
//     console.log(`Requested closure for User: ${sessionId}`);
//   } else {
//     console.log(`No active WebSocket found for User: ${userId}`);
//   }
// }


// }
}