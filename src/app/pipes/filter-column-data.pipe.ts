import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'filterColumnData'
})
export class FilterColumnDataPipe implements PipeTransform {

  // transform(value: any, name, args?: any): any {
  //   if (!args) return value;

  //   if (!value) return value;

  //   args = args.toLowerCase();


  //   return value.filter(function (item) {

  //     if (args.indexOf("%") > -1) {
  //       let argsArr = args.split("%");

  //       if (argsArr.length > 2) {
  //         for (let x in item) {
  //           if (item[name] && item[name].toLowerCase().includes(args.replaceAll("%", ""))) {
  //             return item;
  //           }
  //         }
  //       } else {

  //         if (argsArr[0]) {
  //           for (let x in item) {
  //             if (item[name] && item[name].toLowerCase().startsWith(args.replaceAll("%", ""))) {
  //               return item;
  //             }
  //           }
  //         } else {
  //           for (let x in item) {
  //             if (item[name] && item[name].toLowerCase().endsWith(args.replaceAll("%", ""))) {
  //               return item;
  //             }
  //           }
  //         }
  //       }

  //     } else {
  //       for (let x in item) {
  //         if (item[name] && item[name].toLowerCase() === args) {
  //           return item;
  //         }
  //       }
  //     }
  //   });
  // }
transform(value: any, name, args?: any): any {
    if (!args) return value;

    if (!value) return value;

    args = args.toLowerCase();


    return value.filter(function (item) {

      if (args.indexOf("%") > -1) {
        let argsArr = args.split("%");
        // Build the regex pattern dynamically based on the segments
        let regexPattern = argsArr.map(part => part.toLowerCase().replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&')).join('.*');  // Join each part with '.*'

        // Create a new RegExp object to match the entire string (case insensitive)
        let regex = new RegExp(`^${regexPattern}$`, 'i');  // 'i' flag for case-insensitive matching


        if (argsArr.length > 2) {
          for (let x in item) {
            // val.toLowerCase().match(regex)
            // if (item[name] && item[name].toLowerCase().includes(args.replaceAll("%", ""))) {
            //   return item;
            // }
            // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
            if (item[name] && item[name].toLowerCase().match(regex)) {
              return item;
            }
          }
        } else {

          if (argsArr[0]) {
            for (let x in item) {
              // if (item[name] && item[name].toLowerCase().startsWith(args.replaceAll("%", ""))) {
              //   return item;
              // }
              // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
              if (item[name] && item[name].toLowerCase().match(regex)) {
                return item;
              }
            }
          } else {
            for (let x in item) {
              // if (item[name] && item[name].toLowerCase().endsWith(args.replaceAll("%", ""))) {
              //   return item;
              // }
              
              // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
              if (item[name] && item[name].toLowerCase().match(regex)) {
                return item;
              }
            }
          }
        }

      } else {
        for (let x in item) {
          if (item[name] && item[name].toLowerCase() === args) {
            return item;
          }
        }
      }
    });
  }
}
