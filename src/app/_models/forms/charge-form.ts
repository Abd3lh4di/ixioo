import { FormGroup, FormControl } from '@angular/forms';
import { WeightedPositiveFigureForm } from './weighted-figure-form';

export class ChargeForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl(),
      monthly_amount: new WeightedPositiveFigureForm(),
      continue_after_project: new FormControl(false),
      start_month: new FormControl(),
      end_month: new FormControl(),
      smoothable: new FormControl(),
      comment: new FormControl()
    });
  }

  getAmount() {
    if( !this.get('continue_after_project').value ) return 0;
    const amount = this.get('monthly_amount').value;
    return amount.figure * amount.weight / 100;
  }
}


