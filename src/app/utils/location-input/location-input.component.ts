import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';
import { InseeCodeService } from 'src/app/_services/insee-code.service';
import { departments } from '../departments';
import { InseeCodeToCounty } from '../insee-code-to-county';

@Component({
  selector: 'app-location-input',
  templateUrl: './location-input.component.html'
})
export class LocationInputComponent implements OnInit, OnDestroy {

  @Input() department: FormControl;
  @Input() city: FormControl;
  @Input() postalCode: FormControl;
  @Input() inseeCode: FormControl;
  @Input() zone: FormControl;


  subscriptions = [];
  zones$;
  cities$;
  filteredDepartments$;

  constructor(private inseeService: InseeCodeService) {

    this.cities$ = this.inseeService.inseeSearchResponse$.pipe(
      map( (response) => {
        const finalArray = [];
        response.forEach(elt => {
          elt.codesPostaux.forEach(postCode => {
            finalArray.push({
              name: elt.nom,
              postal_code: postCode,
              insee_code: elt.code
            });
          });
        });
        return finalArray;
      } )
    )
  }

  ngOnInit(): void {
    this.filteredDepartments$ = this.department?.valueChanges.pipe(
      startWith(''),
      map(dept => dept ? this._filterDepartments(dept) : departments.slice())
    );
    this.subscriptions.push(
      this.city?.valueChanges.pipe(
        debounceTime(200),
        filter( value => !!value && typeof value === 'string'),
        map(value => this.inseeService.searchName(value) )
      ).subscribe()
    );
    this.subscriptions.push(
      this.postalCode?.valueChanges.pipe(
        debounceTime(200),
        filter( value => !!value && typeof value === 'string'),
        map(value => this.inseeService.searchPostCode(value) )
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( sub => sub.unsubscribe() );
  }

  getDepartmentOptionText(option) {
    return option ? option.name + ' (' + option.number + ')' : null;
  }
  getCityOptionText(option) {
    return option ? option : null;
  }
  getPostCodeOptionText(option) {
    return option ? option : null;
  }

  private _filterDepartments(value: string): { name: string; number: string; }[] {
    if (typeof value !== 'string') { return; }
    const filterValue = value.toLowerCase();
    return departments.filter(dept =>
      dept.name.toLowerCase().indexOf(filterValue) === 0 ||
      dept.number.toLowerCase().indexOf(filterValue) === 0);
  }

  onDepartmentSelected(value) {
    this.city?.reset();
  }
  onCitySelected(event) {
    this.postalCode?.patchValue(event.option.value.postal_code);
    this.city?.patchValue(event.option.value.name);
    this.inseeCode?.patchValue(event.option.value.insee_code.replace(' ', ''));
    this.selectDepartment(event.option.value.insee_code);
  }
  onPostCodeSelected(event) {
    this.postalCode?.patchValue(event.option.value.postal_code);
    this.city?.patchValue(event.option.value.name);
    this.inseeCode?.patchValue(event.option.value.insee_code.replace(' ', ''));
    this.selectDepartment(event.option.value.insee_code);
  }

  selectDepartment(inseeCode) {
    if (inseeCode) {
      const dept = InseeCodeToCounty.ConvertToCounty(inseeCode);
      this.department?.setValue(this._filterDepartments(dept).shift());
    }
  }

}
