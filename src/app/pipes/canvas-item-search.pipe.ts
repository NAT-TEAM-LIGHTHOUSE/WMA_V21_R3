import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canvasItemSearch'
})
export class CanvasItemSearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (!args) return value;

    args = args.toLowerCase();

    return value.filter(function (item) {

      for (let x of item.Level5) {

        if (x.containerRowss) {

          for (let grp of x.containerRowss) {
            for (let it of grp.Level5) {
              if (JSON.stringify(it.prompt_name).toLowerCase().includes(args) ||
                (it.value ? JSON.stringify(it.value).toLowerCase().includes(args) : "")) {
                return item;
              }
            }
          }
        } else {
          if (JSON.stringify(x.prompt_name).toLowerCase().includes(args) ||
            (x.value ? JSON.stringify(x.value).toLowerCase().includes(args) : "")) {
            return item;
          }
        }
      }

    });
  }

}
