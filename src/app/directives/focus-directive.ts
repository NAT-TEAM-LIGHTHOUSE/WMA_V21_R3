import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appFocusDirective]'
})
export class FocusDirective {

  constructor() { }
  @HostListener("keyup.enter")
  onKeyupEnter(event) {
    let nextEl = this.findNextTabStop(document.activeElement);
    nextEl.focus();
  }

  findNextTabStop(el) {
    let universe = document.querySelectorAll(
      "input,select,ion-button"
    );
    let list = Array.prototype.filter.call(universe, (item) => {
      return item.tabIndex >= "0";
    });
    let index = list.indexOf(el);
    index++;
    while (index < list.length) {
      if (!list[index].readOnly && !list[index].disabled && list[index].type != 'hidden') {
        return list[index];
      } else {
        index++;
      }
    }
    return list[0];
  }
}
