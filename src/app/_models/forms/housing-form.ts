import { FormGroup, FormControl } from '@angular/forms';

export class HousingForm extends FormGroup {
  constructor() {
    super({
      housing_status: new FormControl(null),
      housing_status_since: new FormControl(null)
    });
  }
}

