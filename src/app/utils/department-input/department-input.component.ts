import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { departments, getDepartmentName } from '../departments';

@Component({
  selector: 'app-department-input',
  templateUrl: './department-input.component.html'
})
export class DepartmentInputComponent implements OnInit {

  @Input() department: FormControl;
  filteredDepartments$;

  constructor() { }

  ngOnInit(): void {
    this.filteredDepartments$ = this.department.valueChanges.pipe(
      startWith(''),
      map(dept => dept ? this._filterDepartments(dept) : departments.slice())
    );
  }

  getDepartmentOptionText(option) {
    return option ? getDepartmentName(option) + ' (' + option + ')' : null;
  }


  private _filterDepartments(value: string): { name: string; number: string; }[] {
    if (typeof value !== 'string') { return; }
    const filterValue = value.toLowerCase();
    return departments.filter(dept =>
      dept.name.toLowerCase().indexOf(filterValue) === 0 ||
      dept.number.toLowerCase().indexOf(filterValue) === 0);
  }

}
