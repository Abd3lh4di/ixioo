import { FormGroup, FormControl } from '@angular/forms';

export class ProjectDatesForm extends FormGroup {
  constructor() {
    super({
      sales_agreement_date: new FormControl(),
      conditions_precedent_end_date: new FormControl(),
      signature_date: new FormControl(),
    });
  }
}
