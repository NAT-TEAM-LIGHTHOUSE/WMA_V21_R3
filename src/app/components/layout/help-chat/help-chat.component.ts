import { Component, Input, OnInit } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-help-chat',
  templateUrl: './help-chat.component.html',
  styleUrls: ['./help-chat.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class HelpChatComponent implements OnInit {

  @Input() frame: any;

  constructor() { }

  ngOnInit(
   
  ) { 
    console.log("help chat frame",this.frame)}

}
