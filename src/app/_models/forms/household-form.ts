import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';
import { ChildForm } from './child-form';
import { FinanceForm } from './finance-form';
import { BankInfoForm } from './bankinfo-form';
import { PersonForm } from './person-form';


export class HouseholdForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl('HOUSEHOLD', Validators.required),
      persons: new TypedFormArray(() => new PersonForm()),
      children: new TypedFormArray(() => new ChildForm()),
      dependent_persons: new FormControl(null),
      first_time_buyer: new FormControl(false),
      people_count: new FormControl(1),
      children_count: new FormControl(0),
      dependent_persons_count: new FormControl(0),
      finance: new FinanceForm(),
      bank_info: new BankInfoForm(),
    });
  }
}
