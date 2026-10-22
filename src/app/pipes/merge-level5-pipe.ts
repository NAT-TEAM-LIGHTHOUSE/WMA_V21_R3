import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mergeLevel5',
  pure: true
})
export class MergeLevel5Pipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  // transform(
  //   smallLevel5: any[],
  //   originalLevel4: any[],
  //   value: any
  // ): any[] {



  //   if (!smallLevel5?.length || !originalLevel4?.length) {
  //     return smallLevel5;
  //   }

  //   let data = smallLevel5.map(item_mast => {

  //     for (const itemGroup of originalLevel4) {

  //       for (const item of itemGroup.Level5 ?? []) {

  //         if (item_mast.item_name === item.item_name) {
  //           // return Object.assign(item_mast, item);
  //          return {
  //            ...item_mast,
  //            ...item,
  //           };
  //         }
  //       }
  //     }

  //      return item_mast;
  //   });

  //   return data;
   
  // }

  //   transform(
  //   itemMast: any,
  //   originalLevel4: any[],
  //   value?: any,
  //  level4?: any[]
  // ): any {

  //   if (!itemMast || !originalLevel4?.length) {
  //     return itemMast;
  //   }
  //   // console.log(enable)
  //   for (const itemGroup of originalLevel4) {

  //     for (const item of itemGroup.Level5 ?? []) {

  //       if (itemMast.item_name === item.item_name) {
  //       //  return Object.assign(itemMast, item);
  //         return {
  //           ...item,
  //           ...itemMast
            
  //         };
  //       }
  //     }
  //   }

  //   return itemMast;
  // }

  // itemMerge(item_mast, originalLevel4) {
  //   // const newItem = {
  //   //   ...item_mast
  //   // };
  //   for (const itemGroup of originalLevel4) {
  //     for (const item of itemGroup.Level5 ?? []) {

  //       if (item_mast.item_name === item.item_name) {

  //         // Merge into EXISTING object
  //         // Object.assign(newItem, item);
  //        return Object.assign(item_mast, item);
  //         // return newItem; // Stop immediately after match
  //       }
  //     }
  //   }
  //   // return newItem;
  //   return item_mast;
  // }




private cache = new WeakMap<object, {
    snapshot: any;
    result: any;
  }>();

//   transform(
//     itemMast: any,
//     containerRows: any[],
//     value: any,
//     level4: any[]
//   ): any {

//     if (!itemMast) {
//       return itemMast;
//     }

//     const cached = this.cache.get(itemMast);

//     // --------------------------------
//     // FIRST TIME
//     // --------------------------------
//     if (!cached) {

//       const result = this.mergeLevel4(itemMast, containerRows);

//       this.cache.set(itemMast, {
//         snapshot: this.createSnapshot(itemMast),
//         result
//       });

//       return result;
//     }
//     else{
//       return itemMast;
//     }

//   }


//   private createSnapshot(obj: any): string {

//     return JSON.stringify(obj);
//   }


//   private isEqual(
//     oldSnapshot: string,
//     newSnapshot: string
//   ): boolean {

//     return oldSnapshot === newSnapshot;
//   }


//   private mergeLevel4(
//     itemMast: any,
//     source: any[]
//   ): any {

//     for (const group of source ?? []) {

//       for (const item of group?.Level5 ?? []) {

//         if (item?.item_name === itemMast?.item_name) {

//           // return {
           
//           //   ...itemMast,...item,
//           // };
//           return  Object.assign(itemMast,item)
//         }
//       }
//     }

//     return itemMast;
//   }

//   itemMerge(itemMast: any, level4: any[]): any {


//    const cached = this.cache.get(itemMast);

//     // --------------------------------
//     // FIRST TIME
//     // --------------------------------
//     if (!cached) {

//       const result = this.mergeLevel4(itemMast, level4);

//       this.cache.set(itemMast, {
//         snapshot: this.createSnapshot(itemMast),
//         result
//       });

//       return result;
//     }else{
//       return itemMast;
//     }
// }


  transform(
    itemMast: any,
    containerRows: any[],
    value: any,
    level4: any[]
  ): any {

    if (!itemMast) {
      return itemMast;
    }

    const length = Object.keys(itemMast).length;
    if (length < 40) {
      const result = this.mergeLevel4(itemMast, containerRows);
      return result
    } else {

      return itemMast;
    }

      

      
    

  }
   itemMerge(itemMast: any, level4: any[]): any {

    const length = Object.keys(itemMast).length;
    if (length < 40) {
      const result = this.mergeLevel4(itemMast, level4);
      return result
    } else {

      return itemMast;
    }

}

  private mergeLevel4(
    itemMast: any,
    source: any[]
  ): any {

    for (const group of source ?? []) {

      for (const item of group?.Level5 ?? []) {

        if (item?.item_name === itemMast?.item_name) {

          // return {
           
          //   ...itemMast,...item,
          // };
          return  Object.assign(itemMast,item)
        }
      }
    }

    return itemMast;
  }


}


