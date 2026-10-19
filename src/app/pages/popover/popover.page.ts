import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular/standalone';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone: true,
imports : [STANDALONE_IMPORTS ],
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  heading: any;
  previous_val :any;
  comment = { val: '' };
  isClosePopup=false
  constructor(public popOverCtrl: PopoverController, private globalObjects:GlobalObjectsService,private canvasModal:CanvasModalService) {
    // this.previous_val = this.navParams.get('data1');
    // this.heading = this.navParams.get('heading');
    // this.comment.val = this.previous_val;
    if(this.globalObjects.pagesFlag){
      return applyLoggingDecorator(this,"popover-page")
    }
   }
  
  ngOnInit() {

  }
  save() {
    let text_data = this.comment.val;
    this.popOverCtrl.dismiss(text_data);
    
  }
  cancelModal() {
    let mydata=this.comment.val
    this.popOverCtrl.dismiss(mydata);
  }

  ClosePopup(value){
    this.canvasModal.popDismiss(value)
  }
}
