import { FormGroup, FormControl } from '@angular/forms';
import { WeightedPositiveFigureForm } from './weighted-figure-form';

export class CurrentLoanForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl(),
      future: new FormControl(),
      comment: new FormControl(),
      monthly_payment: new WeightedPositiveFigureForm(),
      remaining_capital: new FormControl(),
      start_date: new FormControl(),
      end_date: new FormControl(),
      lender: new FormControl(),
      smoothable: new FormControl(),
    });
  }

  getAmount() {
    const amount = this.get('monthly_payment').value;
    return amount.figure * amount.weight / 100;
  }


}
