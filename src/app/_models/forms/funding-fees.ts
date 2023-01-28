import { FormGroup, FormControl } from '@angular/forms';

export class FundingFeesForm extends FormGroup {
  constructor() {
    super({
      broker_fees: new FormControl(null),
      file_management_fees: new FormControl(null),
    });
  }
}


