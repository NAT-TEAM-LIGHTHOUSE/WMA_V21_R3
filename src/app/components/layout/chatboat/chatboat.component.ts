import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-chatboat',
  templateUrl: './chatboat.component.html',
  styleUrls: ['./chatboat.component.scss'],
})
export class ChatboatComponent implements OnInit {
  chatbotUrl!: SafeResourceUrl;
  constructor(private globalObjects: GlobalObjectsService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    let url = this.globalObjects.userDetails.g_wma_chatbot_url;
    this.chatbotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
