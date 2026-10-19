import { Component, OnInit } from '@angular/core';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { applyLoggingDecorator } from 'src/app/services/decorator-application';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
  selector: 'app-user-role-component',
  templateUrl: './user-role-component.component.html',
  styleUrls: ['./user-role-component.component.scss'],
   imports :[STANDALONE_IMPORTS]
})
export class UserRoleComponentComponent implements OnInit {
  userDetails: any;
  frame: any;
  constructor(public globalObjects: GlobalObjectsService, private modalServ: CanvasModalService) { 
    if(this.globalObjects.layoutFlag){
      return applyLoggingDecorator(this,"user-role-component")
    }
  }

  ngOnInit() {
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    if (this.globalObjects.layoutObject) {
      for (let pageData of this.globalObjects.layoutObject) {
        for (let page of pageData.Level2) {
          for (let frame of page.Level3) {
            if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'ROLE') {
              console.log(frame);
              this.frame = frame;

           
            }
          }
        }
      }
    }
    console.log(this.frame.tableData)
  }

  itemClicked(itmRole) {
    if (this.frame) {
      let item = this.frame.Level4[0].Level5[0];

      let keys = Object.keys(itmRole);
      console.log("the item role of user " + itmRole.role);
      this.globalObjects.roleUser = itmRole.role;
      for (let k of keys) {
        if (item.hasOwnProperty(k.toLowerCase())) {
          item[k.toLowerCase()] = itmRole[k];
        }
      }

      if (item.calling_object_code) {
        item.object_code = (item.calling_object_code).split("~")[1].split("$$")[0]
        item.calling_object_code = item.object_code;
        item.click_events_str = "get_object_config_new";
        this.modalServ.popDismiss(item);
      }

    }
  }
  userRole() {
    let role = this.userDetails.G_ROLE_NAME;
  }
  ngOnDestroy(){
    console.clear()
   }
}
