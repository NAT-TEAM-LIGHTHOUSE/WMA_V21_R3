import { Component, OnInit,Input } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { Events } from 'src/app/services/events';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports : [...STANDALONE_IMPORTS],
  selector: 'app-frame-otp',
  templateUrl: './frame-otp.component.html',
  styleUrls: ['./frame-otp.component.scss'],
})
export class FrameOtpComponent implements OnInit {
 @Input() frame: any = {};
 constructor(public globalObjects:GlobalObjectsService,private modal:PopoverController) { 
  if(this.globalObjects.frameFlag){
    return applyLoggingDecorator(this,"frame-otp")
  }
 }

 ngOnInit() {}

 verifyOtp(){
   let res = {
     object_code:this.frame,
     verifiedFlag:"T"
   }
   this.modal.dismiss(res);
 }

}
