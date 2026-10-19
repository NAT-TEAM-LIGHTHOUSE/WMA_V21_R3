import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-dev-object-mast-editor',
  templateUrl: './dev-object-mast-editor.page.html',
  styleUrls: ['./dev-object-mast-editor.page.scss'],
})
export class DevObjectMastEditorPage implements OnInit {

  @Input() data:any ;

  constructor(private modalctrl: ModalController,private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"dev-object-mast-editor-page")
    }
  }

  ngOnInit() {}

  itemClick(event){}
  closePage(){
    this.modalctrl.dismiss();
  }

 

}
