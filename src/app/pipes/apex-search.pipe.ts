import { Injectable, Pipe, PipeTransform } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'apexSearch'
})
export class ApexSearchPipe implements PipeTransform {

  transform(items: any[], searchText: string, itemName: string) {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      for (let array of it) {
        if (array.Level5) {
          for (let array2 of array.Level5) {
            if (array2.prompt_name == itemName) {
              if (array2.value && array2.value.toLowerCase().includes(searchText)) {
                return array2;
              }
            }
          }
        }
        else {
          for (let array2 of array) {
            if(itemName){
              if (array2.prompt_name == itemName) {
            if (array2.value && array2.value.toLowerCase().includes(searchText)) {
              return array2
              ;
            }
          }}else{
            if (array2.value && array2.value.toLowerCase().includes(searchText)) {
              return array2
              ;
            }
          }
          }
        }

      }
    });
  }

}

