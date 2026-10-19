import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
    name: 'columnfilter'
})
export class ColumnfilterPipe implements PipeTransform {

    // transform(value: any, name, args?: any, cond?: any): any {
    //     if (!args) return value;

    //     if (!value) return value;

    //     args = args.toLowerCase();


    //     return value.filter(function (item) {

    //         if (args.indexOf("%") > -1) {
    //             let argsArr = args.split("%");

    //             if (argsArr.length > 2) {

    //                 for (let array of item) {
    //                     if (array.Level5) {
    //                         for (let array2 of array.Level5) {
    //                             let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
    //                             if (array2.item_name == name && val && val.toLowerCase().includes(args.replaceAll("%", ""))) {
    //                                 return array2;
    //                             }
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 if (argsArr[0]) {
    //                     for (let array of item) {
    //                         if (array.Level5) {
    //                             for (let array2 of array.Level5) {
    //                                 let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
    //                                 if (array2.item_name == name && val && val.toLowerCase().startsWith(args.replaceAll("%", ""))) {
    //                                     return array2;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 } else {

    //                     for (let array of item) {
    //                         if (array.Level5) {
    //                             for (let array2 of array.Level5) {
    //                                 let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
    //                                 if (array2.item_name == name && val && val.toLowerCase().endsWith(args.replaceAll("%", ""))) {
    //                                     return array2;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }

    //         } else if (cond) {
    //             for (let array of item) {
    //                 if (array.Level5) {
    //                     for (let array2 of array.Level5) {
    //                         let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
    //                         if (array2.item_name == name && eval(cond)) {
    //                             return array2;
    //                         }
    //                     }
    //                 }
    //             }
    //         } else {

    //             for (let array of item) {
    //                 if (array.Level5) {
    //                     for (let array2 of array.Level5) {
    //                         let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
    //                         if (array2.item_name == name && val && val.toLowerCase() === args) {
    //                             return array2;
    //                         }
    //                     }
    //                 }
    //             }
    //         }

    //     });
    // }
  transform(value: any, name, args?: any, cond?: any): any {
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

                    for (let array of item) {
                        if (array.Level5) {
                            for (let array2 of array.Level5) {
                                let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
                                // if (array2.item_name == name && val && val.toLowerCase().includes(args.replaceAll("%", ""))) {
                                //     return array2;
                                // }
                              
                                // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
                                if (array2.item_name == name && val && val.toLowerCase().match(regex)) { 
                                    return array2;
                                }
                            }
                        }
                    }
                } else {
                    if (argsArr[0]) {
                        for (let array of item) {
                            if (array.Level5) {
                                for (let array2 of array.Level5) {
                                    let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
                                    // if (array2.item_name == name && val && val.toLowerCase().startsWith(args.replaceAll("%", ""))) {
                                    //     return array2;
                                    // }
                                    // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
                                    if (array2.item_name == name && val && val.toLowerCase().match(regex)) {
                                        return array2;
                                    }
                                }
                            }
                        }
                    } else {

                        for (let array of item) {
                            if (array.Level5) {
                                for (let array2 of array.Level5) {
                                    let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
                                    // if (array2.item_name == name && val && val.toLowerCase().endsWith(args.replaceAll("%", ""))) {
                                    //     return array2;
                                    // }
                                    // match with RegExp and return item for ex. (t%5T%t)like oracle plsql
                                    if (array2.item_name == name && val && val.toLowerCase().match(regex)) {
                                        return array2;
                                    }
                                }
                            }
                        }
                    }
                }

            } else if (cond) {
                for (let array of item) {
                    if (array.Level5) {
                        for (let array2 of array.Level5) {
                            let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
                            if (array2.item_name == name && eval(cond)) {
                                return array2;
                            }
                        }
                    }
                }
            } else {

                for (let array of item) {
                    if (array.Level5) {
                        for (let array2 of array.Level5) {
                            let val = array2.value ? (typeof (array2.value) == 'string' ? array2.value : array2.value.toString()) : "";
                            if (array2.item_name == name && val && val.toLowerCase() === args) {
                                return array2;
                            }
                        }
                    }
                }
            }

        });
    }
}
