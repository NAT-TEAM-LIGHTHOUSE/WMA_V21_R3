import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableWheelOnNumber]',
  standalone: true
})
export class DisableWheelOnNumberDirective {

  constructor(private el: ElementRef) {}

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (this.isNumberInput()) {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.isNumberInput() && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
    }
  }

  private isNumberInput(): boolean {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const inputEl = nativeEl.tagName === 'INPUT'
      ? nativeEl as HTMLInputElement
      : nativeEl.shadowRoot?.querySelector('input');

    return inputEl?.type === 'number';
  }
}