import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CanvasModalService } from 'src/app/services/canvas-modal.service';
import { GlobalObjectsService } from 'src/app/services/global-objects.service';
import { STANDALONE_IMPORTS } from 'src/app/shared_modules/ionic.imports';

@Component({
standalone : true,
imports:[...STANDALONE_IMPORTS],
  selector: 'app-quick-action-modal',
  templateUrl: './quick-action-modal.component.html',
  styleUrls: ['./quick-action-modal.component.scss'],
})
export class QuickActionModalComponent implements OnInit {
  frame: any;
  constructor(private canvasModal: CanvasModalService,private platform : Platform,private globalobjects:GlobalObjectsService) { }
  plt="browser";
  sqlStudionFlag: boolean = false;
  visibleItems = [];
  ngOnInit() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      let userDetails = this.globalobjects.getLocallData("userDetails");
      this.sqlStudionFlag = userDetails.G_SQL_STUDIO;
      this.plt="mobile";
      let count = 0;
      let item_length = 5
      if (this.globalobjects.layoutObject && this.globalobjects.layoutObject.length > 0) {
        for (let object of this.globalobjects.layoutObject) {
          for (let obj of object.Level2) {
            for (let frame of obj.Level3) {
              if (frame.apps_frame_type == 'SYSTEM' && frame.apps_frame_sub_type == 'LAYOUT_OPTION') {
                if (frame.quick_buttons) {
                  for (let tableData of frame.quick_buttons) {
                    for (let itemGroups of tableData) {
                      for (let item of itemGroups.Level5) {
                        if (item.item_visible_flag == 'T') {
                          count++;
                          item.isQuickAction = true;
                          if (count >= item_length) {
                            this.visibleItems.push(item);
                          }


                        }
                      }
                    }
                  }
                }
                for (let itemGroup of frame.Level4) {

                  for (let item of itemGroup.Level5) {
                    if (item.item_name == 'SYS_CALENDAR') {
                      count++;
                      item.isLayoutOption = true;
                      if (count >= item_length) {
                        this.visibleItems.push(item);
                      }

                    }
                    if (item.item_name == 'SYS_APPLICATION') {
                      count++;
                      item.isLayoutOption = true;
                      if (count >= item_length) {
                        this.visibleItems.push(item);
                      }

                    }
                    if (item.item_name == 'SYS_NOTIFICATION') {
                      count++;
                      item.isLayoutOption = true;
                      if (count >= item_length) {
                        this.visibleItems.push(item);
                      }

                    }
                    if (item.item_name == 'SYS_MEMO') {
                      count++;
                      item.isLayoutOption = true;
                      if (count >= item_length) {
                        this.visibleItems.push(item);
                      }

                    }
                    if (item.item_name == 'SYS_NOTES') {
                      count++;
                      item.isLayoutOption = true;
                      if (count >= item_length) {
                        this.visibleItems.push(item);
                      }

                    }
                    if (item.item_name == 'SYS_LHSCARE') {
                      count++;
                      item.isLayoutOption = true;
                      if (count >= item_length) {
                        this.visibleItems.push(item);
                      }

                    }
                  }
                }
              }
            }
          }

        }
      }

    }
  }

  itemClicked(item) {
    if (item.item_enable_flag == 'T') {
      this.canvasModal.popDismiss(item)
    }
  }

  mobileViewItemClicked(flag: string, item?: any) {
    if(flag == 'sqlStudionFlag') {
      this.canvasModal.popDismiss(flag);
    }else{     
      this.canvasModal.popDismiss(item)
    }
   
  }
}
