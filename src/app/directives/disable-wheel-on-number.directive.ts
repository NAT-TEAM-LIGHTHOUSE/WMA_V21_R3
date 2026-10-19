import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableWheelOnNumber]'
})
export class DisableWheelOnNumberDirective  {

   constructor(private el: ElementRef) {}
  // ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  // }
   @HostListener('wheel', ['$event'])
 onWheel(event: Event) {
    event.preventDefault();
  }

  ngAfterViewInit(): void {
    // Wait for dynamic [type] bindings to apply
    // setTimeout(() => {
      let inputEl: HTMLInputElement | null = null;
      const nativeEl = this.el.nativeElement;

      
      if (nativeEl.tagName === 'INPUT') {
        inputEl = nativeEl;
      }
      else if (nativeEl.tagName === 'ION-INPUT') {
        inputEl = nativeEl.shadowRoot?.querySelector('input');
      }

  
      if (inputEl && inputEl.type === 'number') {
        inputEl.addEventListener('wheel', (event: WheelEvent) => {
          event.preventDefault();
          // inputEl.blur(); // optional
        });

      
        inputEl.addEventListener('keydown', (event: KeyboardEvent) => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
          }
        });
      }
    // }, 0);
  }
}