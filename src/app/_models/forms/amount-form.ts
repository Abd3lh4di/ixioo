import { FormGroup, FormControl } from '@angular/forms';
import { WeightedPositiveFigureForm } from './weighted-figure-form';

export class AmountForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl(),
      monthly_amount: new WeightedPositiveFigureForm(),
      comment: new FormControl()
    });
  }

  getAmount() {
    const amount = this.get('monthly_amount').value.figure ?? 0;
    const weight = this.get('monthly_amount').value.weight ?? 100;
    return weight / 100 * amount;
  }
}
