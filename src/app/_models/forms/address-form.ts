import { FormGroup, FormControl, Validators } from '@angular/forms';

export class AddressForm extends FormGroup {
  constructor() {
    super({
      address: new FormControl(''),
      postal_code: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
      insee_code: new FormControl({value: '', disabled: true})
    });
  }
}

      // legalPerson: this.fb.group({
      //   name: new FormControl(null, Validators.required),
      //   type: new FormControl(null, Validators.required),
      //   residenceAddress: new AddressForm(),
      //   contactAddressNeeded: new FormControl(false),
      //   contactAddress: new AddressForm(),
      //   bank: new FormControl(null),
      //   bankDepartment: new FormControl(''),
      //   bankAgency: new FormControl(''),
      //   bic: new FormControl(null),
      //   iban: new FormControl(null),
      //   incomes: new IncomesGroup(),
      //   burdens: new BurdensGroup(),
      //   patrimony: new TypedFormArray(() => new PatrimonyGroup())
      // }),
