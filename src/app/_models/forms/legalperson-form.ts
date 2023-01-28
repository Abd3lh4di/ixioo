import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';
import { AddressForm } from './address-form';
import { BankInfoForm } from './bankinfo-form';
import { FinanceForm } from './finance-form';
import { FinancialResultsForm } from './financial-results-form';
import { PersonForm } from './person-form';

export class LegalPersonForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl('LEGAL_PERSON', Validators.required),
      name: new FormControl(null, Validators.required),
      email: new FormControl(null),
      phone_number: new FormControl(null),
      address: new AddressForm(),
      contact_address: new AddressForm(),
      bank_info: new BankInfoForm(),
      structure_type: new FormControl(null),
      legal_status: new FormControl(null),
      persons: new TypedFormArray(() => new PersonForm()),
      finance: new FinanceForm(),
      financial_results: new FinancialResultsForm(),
    });
  }
}
