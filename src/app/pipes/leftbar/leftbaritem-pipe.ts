import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leftbaritem',
  pure: true
})
export class LeftbaritemPipe implements PipeTransform {

  transform(value: any[], ...args: unknown[]): unknown {
    console.log("value",value)


   
    if(value && value.length>0){
      return this.visibleItems(value);
    } 
           
    return [];
  }
  visibleItems(layoutObject) {
    let count = 0;
    let item_length=5
    let visibleItems = [];
    for (let object of layoutObject) {
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
                        visibleItems.push(item);
                        if (count == item_length) {
                          return visibleItems;
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
                  visibleItems.push(item);
                  if (count == item_length) {
                    return visibleItems;
                  }
                }
                if (item.item_name == 'SYS_APPLICATION') {
                  count++;
                  item.isLayoutOption = true;
                  visibleItems.push(item);
                  if (count == item_length) {
                    return visibleItems;
                  }
                }
                if (item.item_name == 'SYS_NOTIFICATION') {
                  count++;
                  item.isLayoutOption = true;
                  visibleItems.push(item);
                  if (count == item_length) {
                    return visibleItems;
                  }
                }
                if (item.item_name == 'SYS_MEMO') {
                  count++;
                  item.isLayoutOption = true;
                  visibleItems.push(item);
                  if (count == item_length) {
                    return visibleItems;
                  }
                }
                if (item.item_name == 'SYS_NOTES') {
                  count++;
                  item.isLayoutOption = true;
                  visibleItems.push(item);
                  if (count == item_length) {
                    return visibleItems;
                  }
                }
                if (item.item_name == 'SYS_LHSCARE') {
                  count++;
                  item.isLayoutOption = true;
                  visibleItems.push(item);
                  if (count == item_length) {
                    return visibleItems;
                  }
                }
                if (item.item_name == 'SYS_MEMO') {
                  count++;
                  item.isLayoutOption = true;
                  visibleItems.push(item);
                  if (count == item_length) {
                    return visibleItems;
                  }
                }

              }
            }
          }
        }
      }

    }
    return visibleItems;
  }
}