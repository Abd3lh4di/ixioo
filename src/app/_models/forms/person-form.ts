import { FormGroup, FormControl } from '@angular/forms';
import { CivilForm } from './civil-form';
import { FinanceForm } from './finance-form';
import { ProfessionForm } from './profession-form';

export class PersonForm extends FormGroup {
  constructor() {
    super({
      is_borrower: new FormControl(true),
      finance: new FinanceForm(),
      profession: new ProfessionForm(),
      civil: new CivilForm(),
    });
  }
}
