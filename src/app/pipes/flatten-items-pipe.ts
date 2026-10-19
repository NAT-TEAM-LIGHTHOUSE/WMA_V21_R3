import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flattenItems',
   pure: true,
  standalone: true
})
export class FlattenItemsPipe implements PipeTransform {

 transform(data: any[], datatype: string,istypeData:'allColLevel4' | 'grpByArr'): any[] {
  console.log('PIPE RUN => ', istypeData);
     if (!Array.isArray(data)) {
      return [];
    }
    
    const flatList: any[] = [];
    // =========================================
    // GROUP ARRAY
    // =========================================

    if(istypeData=="grpByArr"){
      for(let framedata of data){
        if (framedata.groupname==datatype) {
          for(let item of framedata.groupnameARR){
            // Move your *ngIf logic inside the pipe for better template performance
            if (item.prompt_name && !item.prompt_name.includes('WMA')) {
              flatList.push(item);
            }
          }
        }
      }
       return flatList;
    }
    // =========================================
    // LEVEL 4 ARRAY
    // =========================================

    for(let framedata of data){
        if (!framedata?.Level5) continue;
         for(let item of framedata.Level5) {
            // Move your *ngIf logic inside the pipe for better template performance
             const promptName = item?.prompt_name || '';
            const matchesDatatype = (item.datatype && item.datatype.includes(datatype)) || datatype === 'ALL';
            const isNotWma =!promptName.includes('WMA');
            const isVisible = item.item_visible_flag !== 'M';

            if (matchesDatatype && promptName && isNotWma && isVisible) {
              flatList.push(item);
            }
          }
        
      }
       return flatList; 


  //   if(istypeData=="allColLevel4"){
  //     for(let framedata of data){
  //       if (!framedata?.Level5) continue;
  //        for(let item of framedata.Level5) {
  //           // Move your *ngIf logic inside the pipe for better template performance
  //            const promptName = item?.prompt_name || '';
  //           const matchesDatatype = (item.datatype && item.datatype.includes(datatype)) || datatype === 'ALL';
  //           const isNotWma =!promptName.includes('WMA');
  //           const isVisible = item.item_visible_flag !== 'M';

  //           if (matchesDatatype && promptName && isNotWma && isVisible) {
  //             flatList.push(item);
  //           }
  //         }
  //     }
  //   }else if(istypeData=="grpByArr"){
  //     for(let framedata of data){
  //       if (framedata.groupname==datatype) {
  //         for(let item of framedata.groupnameARR){
  //           // Move your *ngIf logic inside the pipe for better template performance
  //           if (item.prompt_name && !item.prompt_name.includes('WMA')) {
  //             flatList.push(item);
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return flatList;
  }

}
