import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectDatesForm } from './projectdates-form';

export class PatrimonyForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl(Validators.required),
      category: new FormControl(),
      description: new FormControl(),
      comment: new FormControl(),
      value: new FormControl(),
      remaining_capital: new FormControl(),
      buying_or_opening_date: new FormControl(),
      breakup: new FormGroup({
        type: new FormControl(),
        portion: new FormControl(),
      }),
      is_for_sale: new FormControl(false),
      for_sale: new FormGroup({
        since: new FormControl(),
        price: new FormControl(),
        agency_fees: new FormControl(),
        taxes: new FormControl(),
        dates: new ProjectDatesForm(),
        // agencies: new FormControl(),
        // notaries: new FormControl(),
      })
    });
  }
}
