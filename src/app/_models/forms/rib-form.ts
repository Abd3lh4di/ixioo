import { FormGroup, FormControl } from '@angular/forms';

export class RibForm extends FormGroup {
  constructor() {
    super({
      iban: new FormControl(null),
      bic: new FormControl(null),
      bank_code: new FormControl(null),
      agency_code: new FormControl(null),
      account_number: new FormControl(null),
      key: new FormControl(null),
      bank_name: new FormControl(null)
    });
  }
}
