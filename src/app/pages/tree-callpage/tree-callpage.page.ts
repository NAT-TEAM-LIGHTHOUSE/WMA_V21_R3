import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { TreesetComponent } from 'src/app/components/items/item-display/treeset/treeset.component';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [STANDALONE_IMPORTS,TreesetComponent],
  selector: 'app-tree-callpage',
  templateUrl: './tree-callpage.page.html',
  styleUrls: ['./tree-callpage.page.scss'],
})
export class TreeCallpagePage implements OnInit {

  constructor(private modalctrl:ModalController, private globalObjects:GlobalObjectsService) {
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"tree-collpage")
    }
   }

  ngOnInit() {
  }
  closePage(){
    this.modalctrl.dismiss();
  }

}
