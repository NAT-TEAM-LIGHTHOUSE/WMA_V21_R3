import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { isArray } from '@amcharts/amcharts4/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {
  // transform(value: any, args?: any): any {
  //   if (!args) return value;

  //   args = args.toLowerCase();

  //   return value.filter(function (item) {
  //     let con = "";
  //     let multiCond = "";
  //     con = args;
  //     if (isArray(item)) {
  //       for (let array of item) {
  //         if (array.Level5) {
  //           for (let array2 of array.Level5) {
  //             if (array2.item_visible_flag == 'T' && array2.value && array2.value.toString().toLowerCase().includes(con)) {
  //               return array2;
  //             }
  //           }
  //         }
  //       }
  //     } else {
  //       if (args.indexOf("%") > -1) {
  //         multiCond = args.split("%")[1];
  //         con = args.split("%")[0];

  //         let flag = false;
  //         let mlCon = false;
  //         let i = 0;
  //         for (let x in item) {
  //           i++;
  //           if (JSON.stringify(item[x]).toLowerCase().includes(con) && i == 1) {
  //             flag = true;
  //           } else {
  //             if (multiCond) {
  //               if (flag) {
  //                 if (JSON.stringify(item[x]).toLowerCase().includes(multiCond)) {
  //                   mlCon = true;
  //                 }
  //               }
  //             } else {
  //               mlCon = true;
  //             }
  //           }
  //         }

  //         for (let array of item) {
  //           if (array.Level5) {
  //             for (let array2 of array.Level5) {
  //               if (array2.item_visible_flag == 'T' && array2.value && array2.value.toLowerCase().includes(con)) {
  //                 return array2;
  //               }
  //             }
  //           }
  //         }

  //         if (mlCon && flag) {
  //           return item;
  //         }

  //       } else {
  //         con = args;
  //         for (let x in item) {
  //           if (item[x] && JSON.stringify(item[x]).toLowerCase().includes(con)) {
  //             return item;
  //           }
  //         }
  //       }
  //     }
  //   });
  // }
 transform(value: any, args?: any): any {
    if (!args) return value;

    args = args.toLowerCase();

 
    return value.filter(function (item) {
      let con = "";
      let multiCond = "";
      con = args;
    
     


      if (isArray(item)) {
        for (let array of item) {
          if (array.Level5) {
            for (let array2 of array.Level5) {
              if (args.indexOf("%") > -1) {
                let argsArr = args.split("%");
                let regexPattern = argsArr.map(part => part.toLowerCase().replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&')).join('.*');  // Join each part with '.*'

                // Create a new RegExp object to match the entire string (case insensitive)
                let regex = new RegExp(`^${regexPattern}$`, 'i');  // 'i' flag for case-insensitive matching
                // let regex = new RegExp(`^${argsArr[0].toLowerCase()}.*${argsArr[1].toLowerCase()}.*${argsArr[2].toLowerCase()}$`);

                // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
                if (array2.item_visible_flag == 'T' && array2.value && array2.value.toString().toLowerCase().match(regex)) {
                  return array2;
                }
              }
             else if (array2.item_visible_flag == 'T' && array2.value && array2.value.toString().toLowerCase().includes(con)) {
                return array2;
              }
            }
          }
        }
      } else {
        if (args.indexOf("%") > -1) {
          // multiCond = args.split("%")[1];
          // con = args.split("%")[0];

          let flag = false;
          let mlCon = false;
          let i = 0;
          // for (let x in item) {
          //   i++;
          //   if (JSON.stringify(item[x]).toLowerCase().includes(con) && i == 1) {
          //     flag = true;
          //   } else {
          //     if (multiCond) {
          //       if (flag) {
          //         if (JSON.stringify(item[x]).toLowerCase().includes(multiCond)) {
          //           mlCon = true;
          //         }
          //       }
          //     } else {
          //       mlCon = true;
          //     }
          //   }
          // }
          let argsArr = args.split("%");
          // let regexPattern = argsArr.map(part => part.toLowerCase()).join('.*');  // Join each part with '.*'
          let regexPattern = argsArr.map(part => part.toLowerCase().replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&')).join('.*'); // Join with '.*'
          // let regexPattern = argsArr.map(part => this.escapeRegExp(part.toLowerCase())).join('.*'); // Join with '.*'
          // Create a new RegExp object to match the entire string (case insensitive)
          let regex = new RegExp(`^${regexPattern}$`, 'i');  // 'i' flag for case-insensitive matching
          for (let x in item) {
            i++;
            let b=item[x]
            let c=`${b}`
            // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
            if (c.toLowerCase().match(regex)) {
              flag = true;
              return item;
            }
            //  else {
            //   if (multiCond) {
            //     if (flag) {
            //       if (JSON.stringify(item[x]).toLowerCase().includes(multiCond)) {
            //         mlCon = true;
            //       }
            //     }
            //   } else {
            //     mlCon = true;
            //   }
            // }
          }
          if (isArray(item)) {
            for (let array of item) {
              if (array.Level5) {
                for (let array2 of array.Level5) {
                  // if (array2.item_visible_flag == 'T' && array2.value && array2.value.toLowerCase().includes(con)) {
                  //   return array2;
                  // }
                  // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
                  if (array2.item_visible_flag == 'T' && array2.value && array2.value.toLowerCase().match(regex)) {
                    return array2;
                  }
                }
              }
            }
          }
          
          // if (mlCon && flag) {
          //   return item;
          // }
          // if (flag) {
          //   return item;
          // }

        } else {
          con = args;
          for (let x in item) {
            if (item[x] && JSON.stringify(item[x]).toLowerCase().includes(con)) {
              return item;
            }
          }
        }
      }
    });
  }
// Escape special regex characters in a string
escapeRegExp(string) {
  return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); // Escape special characters
}
}
