import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-agentic-chatbot',
  templateUrl: './agentic-chatbot.component.html',
  styleUrls: ['./agentic-chatbot.component.scss'],
})
export class AgenticChatbotComponent  implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }
  item:any
  url:any
  ngOnInit() {
    if(this.item){
      let url=''
      if(!this.item.value){
        url=this.item.item_default_value ? this.item.item_default_value :''
      }else{
        url =this.item.value ? this.item.value  :''
      }
      this.url=this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

}
