import { Component, Input, OnInit } from '@angular/core';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-help-document',
  templateUrl: './help-document.component.html',
  styleUrls: ['./help-document.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class HelpDocumentComponent implements OnInit {

  @Input() frame: any;

  constructor() { }

  ngOnInit() {
    for(let doc of this.frame.Level4){
      for(let attr of doc.Level5){
        console.log("Item Name : " + attr.item_type);
    
      }
    }
   
  }

}
