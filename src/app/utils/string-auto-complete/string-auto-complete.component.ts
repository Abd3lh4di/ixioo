import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-string-auto-complete',
  templateUrl: './string-auto-complete.component.html'
})
export class StringAutoCompleteComponent implements OnInit {

  @Input() inputLabel: string;
  @Input() control: FormControl;
  @Input() autoCompleteList: string[];

  @Output() optionSelected = new EventEmitter<any>();

  filtered$;

  constructor() { }

  ngOnInit(): void {
    this.filtered$ = this.control.valueChanges.pipe(
      startWith(''),
      map(control => control ? this._filter(control) : this.autoCompleteList.slice())
    );
  }

  onOptionSelected(value) {
    this.optionSelected.emit(value.option.value);
  }

  private _filter(value: string): string[] {
    if (typeof value !== 'string') { return; }
    const filterValue = value.toLowerCase();
    return this.autoCompleteList.filter(country => country.toLowerCase().indexOf(filterValue) === 0 );
  }
}
