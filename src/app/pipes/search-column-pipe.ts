import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchColumn'
})
export class SearchColumnPipe implements PipeTransform {

   transform(data: any[], searchText: string, key: string): any[] {

    if (!data || !searchText) {
      return data;
    }

    const search = searchText.toLowerCase().trim();

    return data.filter((item: any) =>
      String(item[key] ?? '').toLowerCase().includes(search)
    );
  }

}
