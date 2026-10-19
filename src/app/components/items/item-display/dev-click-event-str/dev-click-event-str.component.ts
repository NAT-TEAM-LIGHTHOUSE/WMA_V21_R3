import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core';
import { DevClickEventsPage } from 'src/app/pages/dev-click-events/dev-click-events.page';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-dev-click-event-str',
  templateUrl: './dev-click-event-str.component.html',
  styleUrls: ['./dev-click-event-str.component.scss'],
    imports : [STANDALONE_IMPORTS]
})
export class DevClickEventStrComponent implements OnInit {

  @Input() textEvent: any;
  objectCode:any;

  constructor(private popOverCtrl: PopoverController,private globalObjects:GlobalObjectsService) { 
    if(this.globalObjects.itemFlag){
      return applyLoggingDecorator(this,"dev-click-ebent-str")
    }
  }

  ngOnInit() {
    this.objectCode = this.textEvent.apps_page_frame_seqid.split("-")[0];
  }

  async itemClicked(){
    var data = {
    objectCode :this.objectCode,
    clickEventString:this.textEvent.value == 'get_object_config' || this.textEvent.value == undefined ? '' : this.textEvent.value
    }
    let popUp = await this.popOverCtrl.create({
      component: DevClickEventsPage,
      componentProps: {value:data},
      backdropDismiss: false
    });

    popUp.onDidDismiss().then((res:OverlayEventDetail) =>{
      if(res.role == "backdrop"){}else{
        if(res.data){
          this.textEvent.value = res.data;
        }else{
          this.textEvent.value = 'get_object_config';
        }
      }
  })

    return await popUp.present();
    }

}
