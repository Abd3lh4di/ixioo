import { FormGroup, FormControl } from '@angular/forms';

export class IncomeTaxForm extends FormGroup {
  constructor() {
    super({
      fiscal_reference_revenue_Nminus1: new FormControl(),
      fiscal_reference_revenue_Nminus2: new FormControl(),
      income_tax_Nminus1: new FormControl(),
      income_tax_Nminus2: new FormControl()
    });
  }
}
