import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appResultsTabsHost]',
})
export class ResultsTabsDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
