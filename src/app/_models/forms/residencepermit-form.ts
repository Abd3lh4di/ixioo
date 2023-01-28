import { FormGroup, FormControl } from '@angular/forms';

export class ResidencePermitForm extends FormGroup {
  constructor() {
    super({
      number: new FormControl(null),
      delivery_date: new FormControl(null),
      expiry_date: new FormControl(null),
    });
  }
}

