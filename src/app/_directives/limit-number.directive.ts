import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLimitNumber]'
})
export class LimitNumberDirective {

  @Input() minNumber?: number;
  @Input() maxNumber?: number;

  constructor(private elementRef: ElementRef, private formControl: NgControl) { }

  // warning: keypress will be deprecated, but no replacement so far
  @HostListener('keypress', ['$event']) public onKeypress(event: KeyboardEvent): void {
    // if(event.key === ',') {
    //   console.log("? > ", this.elementRef.nativeElement.value)
    //   //this.elementRef.nativeElement.value += '.';
    //   //event.preventDefault();
    //   //return;
    // }
    if(event.key !== ',' && event.key !== '.' && isNaN(+event.key)) {
      event.preventDefault();
      return;
    }
  }

  @HostListener('input',['$event'])
  onInput(event) {
    const abstractControl = this.formControl.control;
    const inputNumber = event.target.valueAsNumber;
    if(this.minNumber && inputNumber < this.minNumber) {
      event.target.value = 0;
      abstractControl.setValue(0);
      return;
    }
    if(this.maxNumber && inputNumber > this.maxNumber) {
      event.target.value = 100;
      abstractControl.setValue(100);
      return;
    }
  }

}
