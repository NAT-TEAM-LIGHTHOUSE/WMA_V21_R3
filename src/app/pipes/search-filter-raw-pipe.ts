import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'searchFilterRaw'
})
export class SearchFilterRawPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) return value;

    args = args.toLowerCase();

    return value.filter(function (item) {
      let con = "";
      let multiCond = "";


      if (args.indexOf("%") > -1) {
        multiCond = args.split("%")[1];
        con = args.split("%")[0];

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

        // if (mlCon && flag) {
        //   return item;
        // }
        let argsArr = args.split("%");
        let regexPattern = argsArr.map(part => part.toLowerCase().replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&')).join('.*');  // Join each part with '.*'

        // Create a new RegExp object to match the entire string (case insensitive)
        let regex = new RegExp(`^${regexPattern}$`, 'i');  // 'i' flag for case-insensitive matching
        for (let x in item) {
          i++;
          let b=item[x]
          let c=`${b}`
          // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
          if (c.toLowerCase().match(regex)) {
            // flag = true;
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

      } else {
        con = args;
        for (let x in item) {
          if (JSON.stringify(item[x]).toLowerCase().includes(con)) {
            return item;
          }
        }
      }

    });
  }

}
