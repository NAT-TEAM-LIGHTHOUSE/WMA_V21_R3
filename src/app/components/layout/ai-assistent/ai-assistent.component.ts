import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';
import { HelpVideoComponent } from '../help-video/help-video.component';
import { HelpFaqComponent } from '../help-faq/help-faq.component';
import { HelpChatComponent } from '../help-chat/help-chat.component';
import { HelpDocumentComponent } from '../help-document/help-document.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { DataService } from 'src/app/services/data.service';
@Component({
standalone : true,
imports:[STANDALONE_IMPORTS,HelpVideoComponent,HelpFaqComponent,HelpChatComponent,HelpDocumentComponent],
  selector: 'app-ai-assistent',
  templateUrl: './ai-assistent.component.html',
  styleUrls: ['./ai-assistent.component.scss'],
})
export class AiAssistentComponent implements OnInit {
activeTab:any = '';
  menuData = [];
    helpFrame: any;
    helpVideo: any;
selectedDocument: any = null;
isBrowser: boolean = false;
  helpChat: any;
  helpDoc: any;
  helpFaq: any;
  helpSupport: any;
  iframeUrl: SafeResourceUrl;
  activeFrame: any;
   userdetails : any;
   loaderFlag: boolean = false;
 constructor(private sanitizer: DomSanitizer ,private http : HttpClient,@Inject(PLATFORM_ID) platformId: object,private globalObjects : GlobalObjectsService,private dataService: DataService) {
  this.isBrowser = isPlatformBrowser(platformId);
}

  ngOnInit() {
this.userdetails = this.globalObjects.getLocallData('userDetails');
    console.log("layoutttttt", this.userdetails);
    if (this.globalObjects.layoutObject) {
      for (let pageData of this.globalObjects.layoutObject) {
        for (let page of pageData.Level2) {
          for (let frame of page.Level3) {
            if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'HELP_VIDEO') {
              this.helpFrame = frame;
              this.helpVideo = frame;
              console.log("helpFrame",this.helpFrame);
            }

            if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'HELP_DOCUMENT') {
              this.helpDoc = frame;
            }
             if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'HELP_FAQ') {
              this.helpFaq = frame;
            }
             if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'HELP_CHAT') {
              this.helpChat = frame;
              // this.postAndOpenInIframe();

             console.log("helpChat",this.helpChat);
            }
          }
        }
      }
    }

    // this.http.post("https://lighthouseerp.com/faq.html").then((data: any) => {
    //   console.log("dataaaaaa", data);
    // });
    

  }

//  tabclick(tab: string) {
// if(tab=="document"){
//   this.activeTab ="document";
// }

//  if(tab=="video"){
//   this.activeTab="video";
// }

// if(tab=="faq"){
//   this.activeTab="faq";
// }

//  if(tab=="aichat"){
//   this.activeTab="aichat";
// } 

// }

tabclick(tab: 'document' | 'video' | 'faq' | 'aichat' | 'helpsupport') {
  this.activeTab = tab;
  switch(tab) {
    case 'document':
      this.activeFrame = this.helpDoc;
      break;
    case 'video':
      this.activeFrame = this.helpVideo || this.helpFrame; 
      break;
    case 'faq':
      this.activeFrame = this.helpFaq;
      break;
    case 'aichat':
      this.activeFrame = this.helpChat;
      this.postAndOpenInIframe();
      break;
    case 'helpsupport':
      this.activeFrame = this.helpSupport;
      break;  
  }
}

goBack() {
  this.activeTab = '';
  this.activeFrame = null;
  this.loaderFlag = false;  
}


get_sessionid_wsseqid(): string {
  return uuidv4();
}

postAndOpenInIframe() {
  this.loaderFlag = true;
  // const url = 'http://192.168.101.172:8080/api/genai/helpdoc/chatbot/embed';
 const url = this.userdetails.g_help_ai_url? this.userdetails.g_help_ai_url : this.userdetails.G_HELP_AI_URL;
  const data = {
    payload_identifier: {
      user_ref_no: this.get_sessionid_wsseqid(),
      calling_app_name: "LIGHTHOUSE_ERP HELP DOC",
      group_code: this.userdetails.G_DIV_CODE,
      appkey: this.userdetails.appkey,
      user_code: this.userdetails.user_code,
      wma_user_name: this.userdetails.wma_user_name,
    },
    payload_data: {
      // gpt_name: "LHS_GPT",
      // gpt_id: "81c3a0cb-c10a-4573-9b7f-4a8c4dcb0f92",
      // bucket_id: "d6c701d9-878c-4fe6-9b4b-c4ccb59ef9e1"
        "gpt_name": "LHS_GPT",
        "gpt_id": "913e3171-e81e-4132-8e46-042e95a09e4d",
        "bucket_id": "634767ac-010b-4667-bd16-e6656019db45"

    }
  };
 this.http.post(url, data).subscribe((res: any) => {
    try {
        if (res && res.embed_url) {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.embed_url);
      this.loaderFlag = false;
    }
      console.log("resposne from chatbot api", res);
     } catch (error) {
      this.loaderFlag = false;
      console.error("Error parsing response:", error);
    }
  
  // this.dataService.postData(url, data).then((res: any) => {
  //   if (res && res.url) {
  //     this.iframeUrl = res.url;
  //   }
  });
}

getHeaderTitle() {
  switch(this.activeTab) {
    case 'document': return 'Documents';
    case 'video': return 'Videos';
    case 'faq': return 'FAQ';
    case 'aichat': return 'AI Chat';
    case 'helpsupport': return 'Help & Support';
    default: return ' ';
  }
}

getHeaderSubtitle() {
  switch(this.activeTab) {
    case 'document': return 'Browse PDF guides & manuals';
    case 'video': return 'Watch tutorial videos';
    case 'faq': return 'Find quick answers';
    case 'aichat': return 'Ask anything';
    case 'helpsupport': return 'Get help and support';
    default: return ' ';
  }
}
}

