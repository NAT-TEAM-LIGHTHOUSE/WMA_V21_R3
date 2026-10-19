import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'globalSearch',
  standalone : true
})
export class GlobalSearchPipe implements PipeTransform {

  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

  
    return items.filter(item => 
      // item.displayName.toLowerCase().includes(lowerCaseSearchTerm)
      (item.displayName && item.displayName.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.value && item.value.toLowerCase().includes(lowerCaseSearchTerm))
    );

    
    
  }
}
