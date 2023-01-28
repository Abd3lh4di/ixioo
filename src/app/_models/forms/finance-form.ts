import { FormGroup, FormControl } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';
import { CurrentLoanForm } from './current_loan-form';
import { IncomeTaxForm } from './incometax-form';
import { PatrimonyForm } from './patrimony-form';
import { AmountForm } from './amount-form';
import { ChargeForm } from './charge-form';

export class FinanceForm extends FormGroup {
  constructor() {
    super({
      personal_funding: new FormControl(0),
      acquisition_percentage: new FormControl(0),
      income_tax: new IncomeTaxForm(),
      revenues: new TypedFormArray(() => new AmountForm()),
      charges: new TypedFormArray(() => new ChargeForm()),
      current_loans: new TypedFormArray(() => new CurrentLoanForm()),
      patrimony: new TypedFormArray(() => new PatrimonyForm())
    });
  }
}

