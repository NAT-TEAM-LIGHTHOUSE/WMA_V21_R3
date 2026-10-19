import { Component, EventEmitter, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import { ChatAiService } from 'src/app/services/chat-ai.service';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { LhsLibService } from 'src/app/services/lhs-lib.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { DeveloperModeLogPage } from 'src/app/pages/developer-mode-log/developer-mode-log.page';
import { v4 as uuidv4 } from 'uuid';
import { fromEvent, Subscription, throttleTime, timer } from 'rxjs';
import { ModalController } from '@ionic/angular/standalone';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { CdEngineService } from 'src/app/services/cd-engine-service.service';
@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-ai-data',
  templateUrl: './frame-ai-data.component.html',
  styleUrls: ['./frame-ai-data.component.scss'],
})
export class FrameAiDataComponent implements OnInit, OnChanges, OnDestroy  {
  chatContainerActive: boolean = false;
  @Input() selectedText: string = '';
  @Input() context: string = '';
  complete_context: any;
  isFirstMessage: boolean = true;
  @Input() frame: any;
  chatMode: string = '';
  chatMessages: { sender: 'user' | 'ai', text: string }[] = [];
  suggestions: any = [];
  getSuggestionsData:any;
  resSugeestionsData:any=[];
  lastUserRefNo: any = null;
isFirstCall: boolean = true;
  suggestionflag=false;
  suggestionStored:any=[];
  answerflag=false;
  tableidAi = "";
  isAIUsed = false;
  isSelecting: any;
  iframeUrl: SafeResourceUrl;
  inputaiValue = "";
  session_id: any; 
  loaderFlag: boolean = false;
  // showAll = false; 
  suggestion_active_flag:any;
  previousQuestion_active_flag:any;
  showAll = false; 
  shwowelcome_flag=false;
  chat_loader_flag=false;
  previous= false;
  objData:any;
  
  @Output() emitpassai = new EventEmitter<any>();
  excpan_table=false;

  suggestionActive:any=false;

  dbData:any;
tableHtmls:any
  user_ref_no:any;

userDetailsNew:any;


  // code for 5 min timer to reset session
  private idleTimeoutMs = 5 * 60 * 1000; // 5 minutes
private idleSubscription: Subscription | null = null;
private activitySubscription: Subscription | null = null;
  

  rawHtml: SafeHtml;
    @Input() aiInputData:any;
  constructor(private dataService : DataService,private sanitizer: DomSanitizer,public chatAiService: ChatAiService,public events: Events,public lhs_lib: LhsLibService,public globalObject:GlobalObjectsService,private modalController: ModalController,@Inject(PLATFORM_ID) private platformId: Object,private cdengine:CdEngineService) { }
  // ngAfterViewChecked(): void {
  //   throw new Error('Method not implemented.');
  // }
    table_context_data:any;
 developerModeData :any

  ngOnInit() {
    this.userDetailsNew = this.globalObject.getLocallData('userDetails');
this.postAndOpenInIframe();
     this.resetIdleTimer();
      if (isPlatformServer(this.platformId)) return;
  // Listen to user activity (optimized)
  this.activitySubscription = fromEvent(window, 'mousemove')
    .pipe(throttleTime(1000))
    .subscribe(() => this.resetIdleTimer());

    
    console.log(this.context+"  context in ai component");
        this.user_ref_no=this.get_sessionid_wsseqid();
if(this.frame?.apps_page_frame_name){
this.table_context_data=this.frame.apps_page_frame_name;
}
    this.get_db_Data();
    this.chat_loader_flag=false;
    this.excpan_table=false;
    // this.chatMessages.push({ sender: 'ai', text: '"Welcome to TableGPT! Explore table' });
    this.shwowelcome_flag=true;
    this.session_id = Math.random();
    // console.log("table data", this.frame);
    this.suggestionStored=[];
    this.setFrameData(this.frame);
    this.setObjData();

    // const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="none";
    // }
    this.getSuggestions();
    this.insertLog();
     this.developerModeData = {
      ws_seq_id: "",
      frame_seq_id: this.frame.apps_page_frame_seqid
    };
   
  }

  ngOnChanges(changes: any) {
    if (changes.frame && changes.frame.currentValue) {
      this.frame = changes.frame.currentValue;
      this.setFrameData(this.frame);
      this.setObjData();
    }
  }
  
  toggleShowAll() {
    this.showAll = !this.showAll; 
  }


  getSuggestions() {
    // this.showAll = true; 
    if(!this.frame.tableData){
       return;
    }
    if(this.suggestion_active_flag!=this.suggestionflag){

      this.suggestionflag= this.suggestion_active_flag;
    }


    this.previousQuestion_active_flag=this.previousflag;
    this.suggestion_active_flag=this.suggestionflag;
    // let previouselement = document.getElementById("get_prev_id");
    this.previousQuestion_active_flag=false;
    // previouselement.classList.remove("active");
    this.previousflag=this.suggestionflag;
    this.suggestionflag=!this.suggestionflag;
    if(!this.suggestionflag){
      this.resSugeestionsData=[];

      // let suggestionelement = document.getElementById("get_sugg_id");
      this.suggestion_active_flag=false;
      // suggestionelement.classList.remove("active"); 
      this.shwowelcome_flag=false;
      // this.chatMessages=this.chatMessages;
      if(this.chatMessages.length<1){
        this.shwowelcome_flag=true;
      }
      // this.ngZone.run(() => {
      //   this.chatMessages=this.chatMessages;
      // });
    //   const suggestiodiv1=document.getElementById("suggestiodiv");
    // if(suggestiodiv1){
    //   suggestiodiv1.style.display="none";
    // }
      return;
    }

// if(this.chatMessages.length>0){
  // this.chatMessages = this.chatMessages.slice();
// }

    this.shwowelcome_flag=true;
    // let suggestionelement = document.getElementById("get_sugg_id");
    this.suggestion_active_flag=true;

    // suggestionelement.classList.add("active"); 

    // this.resSugeestionsData=[];

    // // this.getSuggestionsData;
    // if(this.suggestionActive){
    //   this.suggestionActive=false;
    //   // alert(this.suggestionActive);
    //   // this.resSugeestionsData=[];
    // }else{
    //   this.suggestionActive=true;
      // alert(this.suggestionActive);
      // const suggestiondiv=document.getElementById("suggestiodiv");
    
    // if(suggestiondiv){
    //   suggestiondiv.style.display="block";
    // }
    // const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="flex";
    // }



    if(this.suggestionStored.length>0){
      // tthis.resSugeestionsData;
      // const loaderdiv=document.getElementById("loader_ai_id");
      // if(loaderdiv){
      //   loaderdiv.style.display="flex";
      // }
      this.resSugeestionsData=this.suggestionStored
      // if(loaderdiv){
      //   loaderdiv.style.display="none";
      // }
     }else{

    //  }

    this.setFrameSuggestions();
    let prompt: any = {
      context: this.getSuggestionsData,
      objData:this.objData,
      dbData:this.dbData
    }
//////////////////////////////new data suggesstion start ////////////////////
let reqDataSuggestion:any;
// prompt.table_context='SALES DATA';
// let table_context_data:any;
// if(this.frame?.apps_page_frame_name){
// table_context_data=this.frame.apps_page_frame_name;
// }
let prompt_data:any={
  table_data:this.getSuggestionsData,
  table_context:this.table_context_data
}
reqDataSuggestion={
  payload_identifier:this.getpayload_identifier(),
  payload_data:prompt_data
}
console.log('new table context ',reqDataSuggestion);

this.chatAiService.getListVal(reqDataSuggestion, this.chatMode,"/suggestions").subscribe({
      next: (response) => {
        console.log(response);
        this.resSugeestionsData=response.data;
        this.suggestionStored =this.resSugeestionsData;
        // const loaderdiv=document.getElementById("loader_ai_id");
        // if(loaderdiv){
        //   loaderdiv.style.display="none";
        // }
      },
      error: () => {
        alert("error in url not called");
    //     const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="none";
    // }
      },
    });
/////////////////////////////////////////////new data suggestion end//////
    // this.chatAiService.getListVal(prompt, this.chatMode,"/suggestions").subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.resSugeestionsData=response.data;
    //     this.suggestionStored =this.resSugeestionsData;
    //     const loaderdiv=document.getElementById("loader_ai_id");
    //     if(loaderdiv){
    //       loaderdiv.style.display="none";
    //     }
    //   },
    //   error: () => {
    //     alert("error in url not called");
    //     const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="none";
    // }
    //   },
    // });












    // }

    // const suggestiondiv=document.getElementById("suggestiodiv");
    
    // if(suggestiondiv){
    //   suggestiondiv.style.display="block";
    // }
    // const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="flex";
    // }
    // this.setFrameSuggestions();
    // let prompt: any = {
    //   context: this.getSuggestionsData,
    //   objData:this.objData
    // }
    // this.chatAiService.getListVal(prompt, this.chatMode,"/suggestions").subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.resSugeestionsData=response.data;
    //     // if(this.resSugeestionsData){
    //     //   alert(this.suggestionActive);
    //     // }
    //     // console.log("resSugeestionsData ",this.resSugeestionsData);
    //     // for(let suggestion of this.resSugeestionsData){
    //     //   console.log(suggestion);
    //     // }
    //     const loaderdiv=document.getElementById("loader_ai_id");
    //     if(loaderdiv){
    //       loaderdiv.style.display="none";
    //     }
    //     // const answer = response.answer || 'No response from GPT.';
    //     // this.chatMessages.push({ sender: 'ai', text: answer });
    //     // inputelem.value = ""
    //     // this.inputaiValue = ""
    //   },
    //   error: () => {
    //     alert("error in url not called");
    //     const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="none";
    // }
    //     // inputelem.value = ""
    //     // this.inputaiValue = ""
    //     // this.chatMessages.push({ sender: 'ai', text: 'Sorry, there was an error processing your request.' });
    //   },
    // });
  }
  }

  setFrameData(frame: any) {
    let headervalue = ""

    let bodyValue = ""
    let bodysuggestionsvalue = ""
    if (frame.apps_frame_type == "ENTRY_TABLE") {
      let Alldata: any = [];
      let headerRow: string[] = [];
      console.log(frame);
      for (let rows of frame.tableRows) {
        let rowMap: any = {};
        let headerCandidate: string[] = [];
        for (let itemData of rows) {
          for (let item of itemData.Level5) {
            // console.log("item data : ",item.item_name);
            const headerName = item.prompt_name ? item.prompt_name : item.item_name;
            if (!headerName) {
              continue;
            }
            if (headerRow.length === 0) {
              headerCandidate.push(headerName);
            }
            rowMap[headerName] = item.value;
          }
        }
        if (headerRow.length === 0 && headerCandidate.length > 0) {
          headerRow = headerCandidate;
        }
        if (headerRow.length > 0) {
          Alldata.push(headerRow.map((header) => rowMap[header] ?? ""));
        }
      }
      if (headerRow.length > 0) {
        Alldata.unshift(headerRow);
      }
      this.complete_context = Alldata;
      if (this.complete_context) {
        if (this.complete_context.length > 3) {
          this.getSuggestionsData = this.complete_context.slice(0, 3);
        } else {
          this.getSuggestionsData = this.complete_context;
        }
      }
    } else {
      if(!this.frame.tableData){
        return;
     }
      let count = 0;
      let Alldata: any = [];
      let headerrow=[];

      for (let itemGroup of frame.headers) {
        // if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_visible_flag == 'T') {
                  if (itemGroup.Level5 && itemGroup.Level5.length > 0 ) {

          for (let itm of itemGroup.Level5) {
            // if (itm.item_visible_flag == 'T' && itm.item_type != 'FRAME_BUTTON_ICON') {
                          if ( itm.item_type != 'FRAME_BUTTON_ICON') {

              let itemheaderPromptname = !itm.prompt_name ? ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' ? itm.tool_tip : itm.prompt_name) : itm.prompt_name
              // headervalue = headervalue + itemheaderPromptname + ",";
              headerrow.push(itemheaderPromptname);
            }
          }
        }
      }
      Alldata.push(headerrow);
      for (let tbldata of frame.tableData) {
        let row:any=[];
        for (let itemGroup of frame.headers) {
          // if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_visible_flag == 'T') {
                      if (itemGroup.Level5 && itemGroup.Level5.length > 0 ) {

            for (let itm of itemGroup.Level5) {
              // if (itm.item_visible_flag == 'T' && itm.item_type != 'FRAME_BUTTON_ICON') {
                              if (itm.item_type != 'FRAME_BUTTON_ICON') {
                //  let itemheaderPromptname = !itm.prompt_name ? ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' ? itm.tool_tip : itm.prompt_name)  : itm.prompt_name
                // bodyValue = bodyValue + tbldata[itm.item_name] + ",";
let key = Object.keys(tbldata).find(
  k => k.toLowerCase() === itm.item_name.toLowerCase()
);

let value = key ? tbldata[key] : undefined;
 row.push(value);
                // console.log(value);


                // row.push(tbldata[itm.item_name]);
                // console.log(tbldata[itm.item_name]);

                // console.log(itm);
              }
            }
          }
        }
        Alldata.push(row);
        bodyValue = bodyValue.substring(0, bodyValue.length - 1);
        bodyValue = bodyValue + "\n";
        if (count < 4) {
          bodysuggestionsvalue = bodyValue;
        }
        count++
      }
      // console.log("all data : ",Alldata);
      // let contextData={
      //   tableData:Alldata
      // }
      // this.complete_context = headervalue + "\n" + bodyValue;
      this.complete_context=Alldata;
      // this.getSuggestionsData = "header : " + headervalue + " body : " + bodysuggestionsvalue;
    }
  }



  setFrameSuggestions() {
    let frame = JSON.parse(JSON.stringify(this.frame));
    let headers = []
    let rows = [];
    this.getSuggestionsData=[];

    let bodyValue = ""
    let bodysuggestionsvalue = ""
    if (frame.apps_frame_type == "ENTRY_TABLE") {
      if(frame.headers){
        for (let itemGroup of frame.headers) {
          if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_visible_flag == 'T') {
            for (let itm of itemGroup.Level5) {
              if (itm.item_visible_flag == 'T' && itm.item_type != 'FRAME_BUTTON_ICON') {
                let itemheaderPromptname = !itm.prompt_name ? ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' ? itm.tool_tip : itm.prompt_name) : itm.prompt_name
                headers.push(itemheaderPromptname);
              }
            }
          }
        }
      }
      



      let Alldata: any = [];
      let data = {};
      console.log(frame);
      if(frame.tableRows && frame.tableRows.length>3){
            frame.tableRows=frame.tableRows.splice(0,3);
      }
      for (let tblrows of frame.tableRows) {
        // data = {};
        let row ={};

        for (let itemData of tblrows) {
          for (let item of itemData.Level5) {
            
            for (let itemGroup of frame.headers) {
              if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_visible_flag == 'T') {
                for (let itm of itemGroup.Level5) {
                  if (itm.item_visible_flag == 'T' && itm.item_type != 'FRAME_BUTTON_ICON') {
                    let itemheaderPromptname = !itm.prompt_name ? ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' ? itm.tool_tip : itm.prompt_name) : itm.prompt_name
                    if(item.prompt_name==itm.prompt_name){
                      // console.log(" key "+item.prompt_name+" value : "+item.value);
                      row[item.prompt_name]=item.value;
                    }
                  }
                }
              }
            }



          }
        }
        if(row){
          // console.log(row);
          rows.push(row);
        }
        // Alldata.push(data);
      }
      // console.log(Alldata);
      this.complete_context = Alldata;
      // if (this.complete_context) {
      //   if (this.complete_context.length > 3) {
      //     this.getSuggestionsData = this.complete_context.slice(0, 3);
      //   } else {
      //     this.getSuggestionsData = this.complete_context;
      //   }
      // }
    } else {
      let count = 0;
      for (let itemGroup of frame.headers) {
        if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_visible_flag == 'T') {
          for (let itm of itemGroup.Level5) {
            if (itm.item_visible_flag == 'T' && itm.item_type != 'FRAME_BUTTON_ICON') {
              let itemheaderPromptname = !itm.prompt_name ? ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' ? itm.tool_tip : itm.prompt_name) : itm.prompt_name
              headers.push(itemheaderPromptname);
            }
          }
        }
      }


      if(frame.tableData && frame.tableData.length>3){
        frame.tableData=frame.tableData.splice(0,3);
  }
      for (let tbldata of frame.tableData) {
        let row = {};
        for (let itemGroup of frame.headers) {
          if (itemGroup.Level5 && itemGroup.Level5.length > 0 && itemGroup.Level5[0].item_visible_flag == 'T') {
            for (let itm of itemGroup.Level5) {
              if (itm.item_visible_flag == 'T' && itm.item_type != 'FRAME_BUTTON_ICON') {
                //  let itemheaderPromptname = !itm.prompt_name ? ((frame.apps_page_frame_seqid).charAt((frame.apps_page_frame_seqid).length - 1) == 'A' ? itm.tool_tip : itm.prompt_name)  : itm.prompt_name
                // bodyValue=bodyValue+tbldata[itm.item_name]+",";
                for (let key of Object.keys(tbldata)) {
                  if (key == itm.item_name) {
                    // console.log("key: " + itm.prompt_name, " value " + tbldata[key]);
                    row[itm.prompt_name] = tbldata[key];
                  }
                }
              }
            }
          }
        }
        rows.push(row);
      }
      // console.log(headers+" headers value");
      // console.log(rows," rows")
    }
    let suggestedValue={
      headers:headers,
      rows:rows
    }
    this.getSuggestionsData=suggestedValue;
    // this.getSuggestionsData.push(rows);
    console.log(this.getSuggestionsData);
  }

  ngOnDestroy(): void {
      if (this.idleSubscription) {
    this.idleSubscription.unsubscribe();
  }

  if (this.activitySubscription) {
    this.activitySubscription.unsubscribe();
  }

    this.session_id = "";
    this.chatContainerActive = false;
    this.chatMessages = [];
  }
  sendMessage(userInput: string): void {
     this.resetIdleTimer();
    if(!this.frame.tableData){
      return;
   }
    if(userInput.trim().length<1){
      return;
    }

           this.chat_loader_flag=true;







        // const chatHistoryElement = document.getElementById("chatHistory");
// function scrollToBottom() {
//   chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
// }
// setTimeout(scrollToBottom, 100);




    // let previouselement = document.getElementById("get_prev_id");
    this.previousQuestion_active_flag=false;

    // previouselement.classList.remove("active");
    // let suggestionelement = document.getElementById("get_sugg_id");
    this.suggestion_active_flag=false;

    // suggestionelement.classList.remove("active"); 

    if(userInput.length<1){
      return;
    }
    // this.suggestionActive=false;
    this.shwowelcome_flag=false;
 /////////////disabling selected data////////////
 this.selectedText="";
 ///////////////////////////////////////////////


    // const suggestiondiv=document.getElementById("suggestiodiv");
    // if(suggestiondiv){
    //   suggestiondiv.style.display="none";
    // }
    if (this.frame.apps_frame_type == "ENTRY_TABLE") {
      let frame = this.lhs_lib.get_frame_config(this.frame.frame_alias);
      this.setFrameData(frame);
    }

    if (!this.selectedText || this.selectedText.trim() == "") {
      this.context = this.complete_context;
      console.log("complete ", this.context);
    } else {
      this.context = this.selectedText;
    }

    if (!userInput.trim()) return;
    // const inputelem: any = document.getElementById('userInput');
    this.chatMessages.push({ sender: 'user', text: userInput });
    const prompt: any = {
      "text": userInput,
      "session_id": this.session_id,
      "context": this.context,
      "objData":this.objData,
      "dbData":this.dbData
    }
    



    // const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="flex";
    // }


//  if(response.answer){
        // let reqData={
        //   "prompt": userInput,
        //   "session_id": this.session_id,
        // }
        
        // let postDataLog=JSON.parse(JSON.stringify(this.objData));
        // postDataLog.prompt=userInput;
        // this.chatAiService.posthistoryData(postDataLog).subscribe({
        //   next: (res) => {
        //     console.log("history response",res);
        //   }
        // });
      //  }










      /////////////////////////////////new chat start ///
      /////////////////////////////////////chat new update start////////
let chatReqData:any={};

let payload_data: any = {
  user_query: userInput,
  custom_prompt: 'You are a helpful assistant...',
  aiInputData:this.aiInputData
};

// ✅ FIRST CALL → always send data
if (this.isFirstCall) {
  payload_data.table_context = this.table_context_data;
  payload_data.table_data = this.context;

  this.lastUserRefNo = this.user_ref_no;
  this.isFirstCall = false;
} 
// ✅ NEXT CALLS → check session
else if (this.lastUserRefNo === this.user_ref_no) {
  payload_data.table_context = null;
  payload_data.table_data = null;
  payload_data.user_ref_no = this.user_ref_no;
} 
// ✅ NEW SESSION (changed user_ref_no)
else {
  payload_data.table_context = this.table_context_data;
  payload_data.table_data = this.context;

  this.lastUserRefNo = this.user_ref_no;
}
chatReqData={
payload_data:payload_data,
payload_identifier:this.getpayload_identifier()
}

        let reqData={
          "prompt": userInput,
          "session_id": this.session_id,
        }
        
        let postDataLog=JSON.parse(JSON.stringify(this.objData));
        postDataLog.prompt=userInput;
        postDataLog.timestamp=this.get_timestamp();
        postDataLog.wsseqid=this.user_ref_no;
        let postReqData:any={
          payload_data:postDataLog,
          payload_identifier: this.getpayload_identifier()
        }
        this.chatAiService.posthistoryData(postReqData).subscribe({
          next: (res) => {
            console.log("history response",res);
          }
        });
   
// ------------------------------------------------------------------------------------------
// this.chatAiService.sendChatRequest(chatReqData, this.chatMode,"/chat").subscribe({
//       next: (response) => {
//         const answer = response.answer || 'No response from GPT.';
//         this.chatMessages.push({ sender: 'ai', text: answer });
//         inputelem.value = ""
//         this.inputaiValue = ""
//         console.log("answer",answer)
//         const chatHistoryElement1 = document.getElementById("chatHistory");
//           this.chat_loader_flag=false;
// function scrollToBottom1() {
// this.chat_loader_flag=false;
//   chatHistoryElement1.scrollTop = chatHistoryElement1.scrollHeight;
// }
// // Call this function after adding a new message
// setTimeout(scrollToBottom1, 100);
//       },
//       error: () => {
//         inputelem.value = ""
//         this.inputaiValue = ""
//         this.chatMessages.push({ sender: 'ai', text: 'Sorry, there was an error processing your request.' });
//         this.chat_loader_flag=false;
//       },
//     });
    // -----------------------------------------------------------------------------------------------

// this.chatAiService.sendChatRequest(chatReqData, this.chatMode,"/chat").subscribe({
//       next: (response) => {
//         let answer = response.answer || 'No response from GPT.';
// if(answer.includes('thead')){
//   this.splitContentAndTables(answer);
// }
// this.chatMessages.push({ sender: 'ai', text: answer });
//         inputelem.value = ""
//         this.inputaiValue = ""
//         console.log("answer",answer)
//         const chatHistoryElement1 = document.getElementById("chatHistory");
//           this.chat_loader_flag=false;
// function scrollToBottom1() {
// this.chat_loader_flag=false;
//   chatHistoryElement1.scrollTop = chatHistoryElement1.scrollHeight;
// }
// setTimeout(scrollToBottom1, 100);
//       },
//       error: () => {
//         inputelem.value = ""
//         this.inputaiValue = ""
//         this.chatMessages.push({ sender: 'ai', text: 'Sorry, there was an error processing your request.' });
//         this.chat_loader_flag=false;
//       },
//     });
    this.chatAiService.sendChatRequest(chatReqData, this.chatMode, "/chat").subscribe({
      next: (response) => {
        // ✅ HANDLE SESSION EXPIRED CASE
        if (response?.status === 'error' && response?.error?.includes('No stored dataset')) {
          console.log('⚠️ Session expired → Resending full data...');
          // Force resend with full table data
          // this.retryWithFullData(userInput);
          this.inputaiValue = '';
          return;
        }
        // ✅ NORMAL FLOW
        this.handleSuccessResponse(response, userInput);
        this.inputaiValue = '';
      },
      error: () => {
        this.handleError();
        this.inputaiValue = '';
      }
    });

    // --------------------------------------------------------------------------------------+++++++++++++++++++++++++++++++++
      /////////////////////////////////new chat end

//     this.chatAiService.sendChatRequest(prompt, this.chatMode,"/chat").subscribe({
//       next: (response) => {

//       //  if(response.answer){
//       //   let reqData={
//       //     "text": userInput,
//       // "session_id": this.session_id,
//       // "context": this.context,
//       // "objData":this.objData,
//       //   }
//       //   this.chatAiService.posthistoryData(reqData).subscribe({
//       //     next: (res) => {
//       //       console.log("history response",res);
//       //     }
//       //   });
//       //  }

//         let answer = response.answer || 'No response from GPT.';

// if(answer.includes('thead')){
//   // this.splitTablesFromRawHtml(answer);
//   this.splitContentAndTables(answer);
// }




// this.chatMessages.push({ sender: 'ai', text: answer });




//         inputelem.value = ""
//         this.inputaiValue = ""
//         console.log("answer",answer)
//         const chatHistoryElement1 = document.getElementById("chatHistory");
//           this.chat_loader_flag=false;
// function scrollToBottom1() {
//   // if (loader && chatHistoryElementdiv.contains(loader)) {
//     // chatHistoryElementdiv.removeChild(loader);
// // }
// this.chat_loader_flag=false;
//   chatHistoryElement1.scrollTop = chatHistoryElement1.scrollHeight;
// }

// // Call this function after adding a new message
// setTimeout(scrollToBottom1, 100);
//         // const printhtmlelement=document.getElementById("printhtml_id");
//         // if(printhtmlelement){
//         //   printhtmlelement.innerHTML=answer;
//         //   console.log(printhtmlelement);
          
//         // }
//         // if(loaderdiv){
//         //   loaderdiv.style.display="none";
//         // }
//       },
//       error: () => {
//         inputelem.value = ""
//         this.inputaiValue = ""
//         this.chatMessages.push({ sender: 'ai', text: 'Sorry, there was an error processing your request.' });
//         // if(loaderdiv){
//         //   loaderdiv.style.display="none";
//         // }
//         this.chat_loader_flag=false;

//       },
//     });
    
  }

  closeChat(): void {
    this.chatContainerActive = false;
    this.chatMessages = [];
  }


  ClearAi() {

    // let previouselement = document.getElementById("get_prev_id");
    this.previousQuestion_active_flag=false;

    // previouselement.classList.remove("active");
    // let suggestionelement = document.getElementById("get_sugg_id");
    this.suggestion_active_flag=false;

    // suggestionelement.classList.remove("active"); 
    

    // this.suggestionActive=false;
    this.resSugeestionsData=[];
    // const suggestiondiv=document.getElementById("suggestiodiv");
    // if(suggestiondiv){
    //   suggestiondiv.style.display="none";
    // }
    this.chatMessages = [];
    // this.chatMessages.push({ sender: 'ai', text: '"Welcome to TableGPT! Explore table' });
    // this.chatMessages=this.chatMessages;
    // if(this.chatMessages.length<1){
    //   this.shwowelcome_flag=true;
    // }
    this.session_id = Math.random();
    this.selectedText = "";
    this.shwowelcome_flag=true;
    // const suggestiondiv=document.getElementById("suggestiodiv");
    // if(suggestiondiv){
    //   suggestiondiv.style.display="block";
    // }
  }



  selectedSuggestion(suggestion:any){
 this.resetIdleTimer();
    // const suggestiondiv=document.getElementById("suggestiodiv");
    // if(suggestiondiv){
    //   suggestiondiv.style.display="none";
    // }
    
    this.selectedText="";
    if(!this.chat_loader_flag){
      this.sendMessage(suggestion);
    }

    console.log(suggestion);
  }
  






  setObjData(){


    console.log("frame dta : ",this.frame);
    // console.log("object dta : ",this.globalObject.object_mast);
    let userDetails=JSON.parse(JSON.stringify(this.globalObject.getLocallData("userDetails")));
    let wma_user_code=userDetails.wma_user_code;

   this.objData={
      wma_user_code:wma_user_code,
      wma_object_code:this.frame.object_code,
      apps_page_frame_seqid:this.frame.apps_page_frame_seqid,
      apps_item_seq_id:"",
      iud_seqid:this.lhs_lib.object_mast.iud_seqid    
     }
  }
  previousflag=false;
  getPrevioiusQues(){
    if(!this.frame.tableData){
      return;
   }
    if(this.previousQuestion_active_flag!=this.previousflag){

      this.previousflag= this.previousQuestion_active_flag;
    }
    this.previousQuestion_active_flag=this.previousflag;
    this.suggestion_active_flag=this.suggestionflag;
    // let suggestionelement = document.getElementById("get_sugg_id");
    this.suggestion_active_flag=false;

      // suggestionelement.classList.remove("active"); 
      this.suggestionflag=this.previousflag
    this.previousflag=!this.previousflag;
    if(!this.previousflag){
      this.resSugeestionsData=[];
      // let previouslement = document.getElementById("get_prev_id");
      this.previousQuestion_active_flag=false;

      // previouslement.classList.remove("active"); 
      this.chatMessages=this.chatMessages;
      if(this.chatMessages.length<1){
        this.shwowelcome_flag=true;
      }

    //   const suggestiodiv1=document.getElementById("suggestiodiv");
    // if(suggestiodiv1){
    //   suggestiodiv1.style.display="none";
    // }
      return;
    }
//     this.showAll=true;
//     this.previous = !this.previous;
// //     console.log(this.previous);
    this.shwowelcome_flag=false;
    // let previouslement = document.getElementById("get_prev_id");
    this.previousQuestion_active_flag=true;
    // previouslement.classList.add("active"); 
// // this.getSuggestionsData;
// // if(this.previous){
// //   this.suggestionActive=false;
// // }else{
// //   this.suggestionActive=true;
// // }
// if(!this.previous){
//   this.resSugeestionsData=[];
//   // this.suggestionActive=false;
//   return;
// }
// else{
//   this.suggestionActive=true;
// }




    // this.suggestionActive=false;
    // const suggestiondiv=document.getElementById("suggestiodiv");
    // if(suggestiondiv){
    //   suggestiondiv.style.display="block";
    // }
    
    // const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="flex";
    // }
    this.setFrameSuggestions();
    let prompt: any = {
      objData:this.objData,
      dbData:this.dbData
    }


  // if(response.answer){
        // let reqData={
        //   prompt:prompt
        // }
        // this.chatAiService.gethistoryData(this.objData).subscribe({
        //   next: (res) => {
        //     console.log("history response",res);
        //   }
        // });
      //  }





////////////////////////////previouse java question api  start/////////
// let reqData={
//           reqData:this.objData
//         }
//         this.chatAiService.gethistoryData(reqData).subscribe({
//           next: (response) => {
//             console.log("history response",response);
//             console.log(response);
//         const loaderdiv=document.getElementById("loader_ai_id");
//     if(loaderdiv){
//       loaderdiv.style.display="none";
//     }
//         if(response?.responseData){
//           this.resSugeestionsData=response.responseData;
//         }
//         console.log("resSugeestionsData ",this.resSugeestionsData);
//         for(let suggestion of this.resSugeestionsData){
//           console.log(suggestion);
//         }
//           },
//       error: () => {
//         alert("error in url not called");
//         const loaderdiv=document.getElementById("loader_ai_id");
//     if(loaderdiv){
//       loaderdiv.style.display="none";
//     }
//       },
//         });


////////////////////////////previouse quesiton api end java/////
    //   this.chatAiService.getListVal(prompt, this.chatMode,"/pre_questions").subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="none";
    // }
    //     this.resSugeestionsData=response.data;
    //     console.log("resSugeestionsData ",this.resSugeestionsData);
    //     for(let suggestion of this.resSugeestionsData){
    //       console.log(suggestion);
    //     }
        
    //   },
    //   error: () => {
    //     alert("error in url not called");
    //     const loaderdiv=document.getElementById("loader_ai_id");
    // if(loaderdiv){
    //   loaderdiv.style.display="none";
    // }
    //   },
    // });

  }
  // getAllSuggestions(){
  //   this.suggestionActive=false;
  //   const suggestiondiv=document.getElementById("suggestiodiv");
  //   if(suggestiondiv){
  //     suggestiondiv.style.display="block";
  //   }
  //   const loaderdiv=document.getElementById("loader_ai_id");
  //   if(loaderdiv){
  //     loaderdiv.style.display="flex";
  //   }
  //   this.setFrameSuggestions();
  //   let prompt: any = {
  //     objData:this.objData
  //   }
  //   this.chatAiService.getListVal(prompt, this.chatMode,"/all_suggestions").subscribe({
  //     next: (response) => {
  //       console.log(response);
  //       const loaderdiv=document.getElementById("loader_ai_id");
  //   if(loaderdiv){
  //     loaderdiv.style.display="none";
  //   }
  //       this.resSugeestionsData=response.data;
  //       console.log("resSugeestionsData ",this.resSugeestionsData);
  //       for(let suggestion of this.resSugeestionsData){
  //         console.log(suggestion);
  //       }
        
  //     },
  //     error: () => {
  //       alert("error in url not called");
  //       const loaderdiv=document.getElementById("loader_ai_id");
  //       if(loaderdiv){
  //         loaderdiv.style.display="none";
  //       }
  //     },
  //   });
  // }

  closeaiGpt(){
    this.excpan_table=true;
    this.expandGpt();
    // console.log(this.frame.apps_page_frame_seqid+"ai");
    this.events.publish(this.frame.apps_page_frame_seqid+"ai");
    this.sessionDelete();

  }
  

  expandGpt(){
    this.excpan_table=!this.excpan_table;
    let ev:any={
      expand_flag:this.excpan_table
    }
    if(this.excpan_table == true){
      let ev=document.getElementById('expandGpt');
      ev.classList.add('active');
    }else{
      let ev=document.getElementById('expandGpt');
      ev.classList.remove('active');
    }
    this.emitpassai.emit(ev);
  }
  get_db_Data(){
    let temurl:any=this.globalObject.getScopeUrl().split("/");
    // const url = this.globalObject.getScopeUrl().split(String(temurl[3]))[1];
    this.dbData={
        entity:String(temurl[4]),
        dbUrl:String(temurl[5]),
        portNo:String(temurl[6]),
        dbName:String(temurl[7]),
        password:String(temurl[8]),
        dbVersion:String(temurl[9])
    }
    console.log("dbData",this.dbData);
    // entity}/{dburl}/{portNo}/{dbName}/{password}/{dbVersion}
    // let urlfinal=temurl[0]+"//"+this.fetchUrl+url+this.fetchUrlend;
    // let urlfinal=this.fetchUrl+url+this.fetchUrlend;
  }
//   copy(copyData:any){
// alert(copyData);
//   }  


 downloaddata(id: string): void {
  id=id.replace('"',"");
this.downloadExcelFromRawHtml(id);
 console.log(id);
// let htmldatatable=this.extractTableOnly(id);
// const blob = new Blob(
//     [id],
//     { type: 'application/vnd.ms-excel' }
//   );
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = 'output.xls';
//   link.click();
//   window.URL.revokeObjectURL(url);

  // const table = document.getElementById(id);
  // if (!table) {
  //   console.error(`Table with ID '${id}' not found.`);
  //   return;
  // }

  // // Create a range and select the table element
  // const range = document.createRange();
  // range.selectNode(table);

  // // Get current selection and clear it
  // const selection = window.getSelection();
  // if (selection) {
  //   selection.removeAllRanges();
  //   selection.addRange(range);
  // }

  // try {
  //   const success = document.execCommand('copy');
  //   if (success) {
  //     alert('Table copied to clipboard!');
  //   } else {
  //     alert('Failed to copy the table.');
  //   }
  // } catch (err) {
  //   console.error('Copy command failed', err);
  //   alert('Copy not supported in this browser.');
  // }

  // // Clear selection
  // selection?.removeAllRanges();
}

// extractTableOnly(htmlString: string): string | null {
//   const match = htmlString.match(/<table[\s\S]*?<\/table>/);
//   return match ? match[0] : null;
// }
downloadExcelFromRawHtml(htmlString: string) {
  const tableHtml = this.extractTableHtml(htmlString);
  if (!tableHtml) return;
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const table = doc.querySelector('table');
  if (!table) return;

  const worksheet = XLSX.utils.table_to_sheet(table);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'data.xlsx');
}
extractTableHtml(text: string): string | null {
  const match = text.match(/<table[\s\S]*?<\/table>/i);
  return match ? match[0] : null;
}


////////////////////////////////////////////////////without border//////////////////
copyHtmlTableAsPlainText(rawText: string) {
  // Step 1: Extract only <table>...</table>
  const match = rawText.match(/<table[\s\S]*?<\/table>/i);
  if (!match) {
    console.warn('No table found in the input');
    return;
  }

  const tableHtml = match[0];

  // Step 2: Parse the HTML table
  const parser = new DOMParser();
  const doc = parser.parseFromString(tableHtml, 'text/html');
  const table:any = doc.querySelector('table');
  if (!table) {
    console.warn('Table tag could not be parsed');
    return;
  }

  // Step 3: Extract rows and cell values
  const rows: string[][] = [];
  for (const row of table.rows) {
    const rowData: string[] = [];
    for (const cell of row.cells) {
      rowData.push(cell.textContent?.trim() || '');
    }
    rows.push(rowData);
  }

  // Step 4: Calculate column widths for alignment
  const colWidths = rows[0]?.map((_, i) =>
    Math.max(...rows.map(row => (row[i] || '').length))
  ) || [];

  // Step 5: Create plain-text table with spacing
  const plainText = rows.map(row =>
    row.map((cell, i) => cell.padEnd(colWidths[i])).join('  ')
  ).join('\n');

  // Step 6: Copy to clipboard
  navigator.clipboard.writeText(plainText).then(() => {
    console.log('Table copied to clipboard:\n' + plainText);
    alert('✅ Table copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy table:', err);
  });
}



copyStyledTableWithColors(rawText: string) {
  // 1. Extract <table>...</table> from input string
  const match = rawText.match(/<table[\s\S]*?<\/table>/i);
  if (!match) {
    console.warn('No table found in input');
    return;
  }

  // 2. Parse using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(match[0], 'text/html');
  const table = doc.querySelector('table');
  if (!table) {
    console.warn('Table could not be parsed');
    return;
  }

  // 3. Clone table safely
  const styledTable = table.cloneNode(true) as HTMLTableElement;

  // 4. Apply background colors manually (alternating rows, for example)
  Array.from(styledTable.rows).forEach((row, index) => {
    // Example: alternate row colors
    row.style.backgroundColor = index % 2 === 0 ? '#f0f8ff' : '#e6f7ff'; // light blue shades
  });

  // 5. Wrap in a <div> for clipboard copy
  const wrapper = document.createElement('div');
  wrapper.appendChild(styledTable);

  // 6. Create clipboard item with HTML
  const blob = new Blob([wrapper.outerHTML], { type: 'text/html' });
  const clipboardItem = new ClipboardItem({ 'text/html': blob });

  // navigator.clipboard.write([clipboardItem])
  //   .then(() => alert('✅ Colored table copied to clipboard!'))
  //   .catch(err => console.error('Clipboard error:', err));
  navigator.clipboard.write([clipboardItem])
  .then(() => {
    // alert('✅ Colored table copied to clipboard!');
    this.iscopy = true;
    setTimeout(() => {
      this.iscopy = false;
    }, 3000);
  })
  .catch(err => {
    console.error('❌ Failed to copy:', err);
  });
}
////////////////////////////////////with border////////




//  isToastOpen = false;
iscopy=false;
copyHtmlTableWithBorders(rawText: string) {
  // Step 1: Extract <table>...</table>
  



 const tableHtml1 = this.extractTableHtml(rawText);
  if (!tableHtml1) return;

  const match = tableHtml1.match(/<table[\s\S]*?<\/table>/i);
  if (!match) {
    console.warn('No table found in input');
    return;
  }
  const tableHtml = match[0];

  // Step 2: Parse HTML table
  const parser = new DOMParser();
  const doc = parser.parseFromString(tableHtml, 'text/html');
  const table:any = doc.querySelector('table');
  if (!table) {
    console.warn('Table could not be parsed');
    return;
  }

  // Step 3: Extract rows
  const rows: string[][] = [];
  for (const row of table.rows) {
    const rowData: string[] = [];
    for (const cell of row.cells) {
      rowData.push(cell.textContent?.trim() || '');
    }
    rows.push(rowData);
  }

  if (rows.length === 0) return;

  // Step 4: Compute column widths
  const colWidths = rows[0].map((_, i) =>
    Math.max(...rows.map(row => (row[i] || '').length))
  );

  // Step 5: Helper functions to draw lines
  const drawLine = () =>
    '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';

  const formatRow = (row: string[]) =>
    '| ' + row.map((cell, i) => cell.padEnd(colWidths[i])).join(' | ') + ' |';

  // Step 6: Build bordered table text
  const lines: string[] = [];
  lines.push(drawLine());                    // Top border
  lines.push(formatRow(rows[0]));            // Header row
  lines.push(drawLine());                    // Header separator
  for (let i = 1; i < rows.length; i++) {
    lines.push(formatRow(rows[i]));          // Data rows
  }
  lines.push(drawLine());                    // Bottom border

  const borderedTable = lines.join('\n');

  // Step 7: Copy to clipboard
  navigator.clipboard.writeText(borderedTable).then(() => {
    console.log('✅ Table copied with borders:\n' + borderedTable);
    // alert('✅ Table copied to clipboard with borders!');
    //  this.isToastOpen = isOpen;
    this.iscopy=true;
    setTimeout((a)=>{
    this.iscopy=false;
    },3000)
  }).catch(err => {
    console.error('❌ Failed to copy:', err);
  });





}



// splitTablesFromRawHtml(raw: string) {
//   const matches = raw.match(/<table[\s\S]*?<\/table>/gi);
//   if (matches) {
//     this.tableHtmls = matches;
//   }}

 
public contentSections: { html: string, isTable: boolean }[] = [];
  splitContentAndTables(raw: string) {
  this.contentSections = [];

  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  let lastIndex = 0;

  const matches = [...raw.matchAll(tableRegex)];
  for (const match of matches) {
    const table = match[0];
    const start = match.index!;
    
    const before = raw.substring(lastIndex, start);
    if (before.trim()) {
      this.contentSections.push({ html: before, isTable: false });
    }

    this.contentSections.push({ html: table, isTable: true });
    lastIndex = start + table.length;
  }

  const after = raw.substring(lastIndex);
  if (after.trim()) {
    this.contentSections.push({ html: after, isTable: false });
  }
}


// sessionDelete(){
  
//   let sessionDel={"user_ref_no": this.user_ref_no};
//   this.chatAiService.deleteSession(sessionDel).subscribe({
//     next: (response) => {
//       console.log("session deleted successfully");
//     },
//     error: () => {
//       console.error("error deleting session");
//     },
//   });
// }
sessionDelete(){
  let sessionDel = { "user_ref_no": this.user_ref_no };

  this.chatAiService.deleteSession(sessionDel).subscribe({
    next: () => {
      console.log("session deleted successfully");

      // ✅ RESET FLAGS
      this.isFirstCall = true;
      this.lastUserRefNo = null;
    },
    error: () => {
      console.error("error deleting session");
    },
  });
}
getpayload_identifier(){
  // let payload_identifier:any={
  //    "user_ref_no": "884f545-778ii",
  //       "calling_app_name": "TABLE-GPT_TEST",
  //       "group_code": "LHS",
  //       "appkey": "lhsboost",
  //       "user_code": "RO10",
  //       "user_timestamp": "24-04-2025 18:14:24",
  //       "client_ip": "192.128.100.172",
  //       "client_hostname": "prathameshp",
  //       "client_browser": "chrome"
  // }

let payload_identifier:any={};
// payload_identifier.user_ref_no=this.user_ref_no;
let user_details=JSON.parse(JSON.stringify(this.globalObject.getLocallData('userDetails')));
if(user_details){
let group_code=user_details.G_ENTITY_CODE;
let appkey=user_details.appkey;
let user_code=user_details.g_user_code ;
let user_timestamp=this.get_timestamp();
let client_ip=user_details.client_address;
let client_hostname=user_details.client_host_name;
let client_browser=user_details.client_browser;
let user_ref_no=this.user_ref_no;
let calling_app_name=user_details.app_code_str;

payload_identifier={
  "user_ref_no": user_ref_no,
        "calling_app_name": calling_app_name,
        "group_code": group_code,
        "appkey": appkey,
        "user_code": user_code,
        "user_timestamp": user_timestamp,
        "client_ip": client_ip,
        "client_hostname": client_hostname,
        "client_browser": client_browser
}
}

return payload_identifier;
}
// get_sessionid_wsseqid(){
//   let wsseqid='1234'
//   return wsseqid;
// }
get_sessionid_wsseqid(): string {
  return uuidv4();
}
get_timestamp(){
  // let timestmp;
let timestmp = new Date().toISOString().slice(0, 19).replace('T', ' ');
console.log(timestmp);

  return timestmp;
}
insertLog(){
  let reqData:any={};
  reqData.payload_identifier=this.getpayload_identifier();
   this.chatAiService.insertLog(reqData).subscribe({
          next: (response) => {
            console.log("tagle gpt log inserted for initiated");
      },
        });
}



private buildPayload(userInput: string, forceFullData: boolean = false) {
  let payload_data: any = {
    user_query: userInput,
    custom_prompt: 'You are a helpful assistant...'
  };

  if (forceFullData || this.lastUserRefNo !== this.user_ref_no) {
    payload_data.table_context = this.table_context_data;
    payload_data.table_data = this.context;

    this.lastUserRefNo = this.user_ref_no;
  } else {
    payload_data.user_ref_no = this.user_ref_no;
  }

  return payload_data;
}



handleSuccessResponse(response: any, userInput: string) {
  let answer = response.answer || 'No response from GPT.';
  
  if (answer.includes('thead')) {
    this.splitContentAndTables(answer);
  }

  this.chatMessages.push({ sender: 'ai', text: answer });
  this.chat_loader_flag = false;
}

handleError() {
  this.chatMessages.push({
    sender: 'ai',
    text: 'Sorry, there was an error processing your request.'
  });
  this.chat_loader_flag = false;
}

private resetIdleTimer() {
  // Clear previous timer
  if (this.idleSubscription) {
    this.idleSubscription.unsubscribe();
  }

  // Start new timer
  this.idleSubscription = timer(this.idleTimeoutMs).subscribe(() => {
    console.log('⏰ User inactive for 5 minutes → deleting session');
    this.sessionDelete();
  });
}

private retryWithFullData(userInput: string) {

  let payload_data: any = {
    user_query: userInput,
    custom_prompt: 'You are a helpful assistant...',
    table_context: this.table_context_data,
    table_data: this.context
  };

  let retryReq = {
    payload_data: payload_data,
    payload_identifier: this.getpayload_identifier()
  };

  this.chatAiService.sendChatRequest(
    JSON.stringify(retryReq),   // ✅ FIX HERE
    this.chatMode,
    "/chat"
  ).subscribe({
    next: (response) => {
      console.log('✅ Retry success');
      this.handleSuccessResponse(response, userInput);
    },
    error: () => {
      this.handleError();
    }
  });
}

  // Developer mode
  async showDeveloperData() {
    const modal = await this.modalController.create({
      component: DeveloperModeLogPage,
      cssClass: 'my-custom-class',
      componentProps: {
        data: this.developerModeData,
        requestData: this.frame
      }
    });
    return await modal.present();
  }




//   get_sessionid_wsseqid(): string {
//   return uuidv4();
// }
  postAndOpenInIframe() {
    let urlfinal;
    if (this.userDetailsNew && this.userDetailsNew["g_table_gpt_url_new"]) {
      urlfinal = this.userDetailsNew["g_table_gpt_url_new"];
    }


    const url =  urlfinal + '/chatbot/embed' ;
    console.log(this.userDetailsNew);
    //  const url = this.userdetails.g_help_ai_url? this.userdetails.g_help_ai_url : this.userdetails.G_HELP_AI_URL;
    console.log(this.aiInputData);
    const data = {


      "payload_identifier": {
        user_ref_no: this.get_sessionid_wsseqid(),
        calling_app_name: "TABLE GPT",
        "group_code": this.userDetailsNew.G_DIV_CODE,
        "appkey": this.userDetailsNew.appkey,
        "wma_object_code": this.frame.object_code,
        "app_page_frame_seqid": this.frame.apps_page_frame_seqid,
        "iud_seqid": this.lhs_lib.object_mast.iud_seqid,
        "user_code": this.userDetailsNew.wma_user_code,
        "user_timestamp": new Date().toISOString().slice(0, 19).replace('T', ' '),
        "client_ip": this.userDetailsNew.client_address,
        "client_hostname": this.userDetailsNew.client_host_name,
        "client_browser": this.userDetailsNew.client_browser
      },
      "payload_data": {
        "table_context": this.frame.apps_page_frame_name,
        "custom_prompt": "You are helpfull assistant",
        "aiInputData": this.aiInputData,
        // [
        //     {
        //         "DATA_DESCRIPTION": "THIS TABLE HAS COLUMNS OF ITEM MASTER."
        //     },
        //     {
        //         "HELP": "THIS TABLE HAS FILTERED ITEM MASTER DATA BASED ON THE SEARCH CRITERIA GIVEN BY USERS"
        //     },
        //     {
        //         "AI_PROMPT": "THIS IS ITEM MASTER DATA HAVING SPARES, RAW MATERIAL, CONSUMABLE ITEMS.. ITEM COLUMN IS FOR ITEM CODE. WE NEED TO FIND ITEMS FROM THIS LIST FOR GIVEN SEARCH TEXT. PRACTICAL SYNONYMS OF ITEM TYPE OR FAMILY OR NOUN WHICH ARE USED IN INDIAN OR REGIONAL CONTEXT SHOULD ALSO BE SEARCHED.. ALSO SIZE TYPE OF ATTRIBUTES HAVING VALUES IN DIFFERENT UOM SHOULD ALSO BE SEACHED. SPELLING MISTAKE IN NAMES OR IN SEARCH TEXT SHOULD BE CONSIDERED IN THE SEARCH."
        //     }
        // ],
        "table_data": this.frame.tableData

      }
    };
    this.dataService.postRequest(url, data).then((res: any) =>  {

      try {
        if (res && res.embed_url) {
          this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.embed_url);
          console.log("Iframe URL set successfully" + this.iframeUrl);
           this.cdengine.mark(this.frame.apps_page_frame_seqid)
          this.loaderFlag = false;
        }
      } catch (error) {
        console.error("Error processing response:", error);
        this.cdengine.mark(this.frame.apps_page_frame_seqid)
        this.loaderFlag = false;
        return;
      }


      // this.dataService.postData(url, data).then((res: any) => {
      //   if (res && res.url) {
      //     this.iframeUrl = res.url;
      //   }
    });
  }
}
