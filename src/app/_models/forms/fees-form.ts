import { FormGroup, FormControl } from '@angular/forms';

export class FeesForm extends FormGroup {
  constructor() {
    super({
      agency_fees: new FormControl(null),
      notary_fees: new FormControl(null),
    });
  }
}


