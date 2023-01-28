import { FormGroup, FormControl } from '@angular/forms';
import { RibForm } from './rib-form';

export class BankInfoForm extends FormGroup {
  constructor() {
    super({
      current_agency: new FormControl(null),
      current_bank: new FormControl(null),
      customer_since: new FormControl(null),
      departement: new FormControl(null),
      rib: new RibForm(),
    });
  }
}
