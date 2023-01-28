import { FormGroup, FormControl } from '@angular/forms';

export class FamilySituationForm extends FormGroup {
  constructor() {
    super({
      marital_status: new FormControl('SINGLE'),
      marital_status_since: new FormControl(null),
      matrimony_regime: new FormControl(null),
      divorce_procedure: new FormControl(null),
      marital_country: new FormControl(null),
      is_in_relation_with: new FormControl(null),
    });
  }
}

