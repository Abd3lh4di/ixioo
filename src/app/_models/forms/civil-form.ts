import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddressForm } from './address-form';
import { BankInfoForm } from './bankinfo-form';
import { FamilySituationForm } from './familysituation-form';
import { HousingForm } from './housing-form';
import { ResidencePermitForm } from './residencepermit-form';

export class CivilForm extends FormGroup {
  constructor() {
    super({
      courtesy: new FormControl('MRS'),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      birth_name: new FormControl(''),
      birth_date: new FormControl(null),
      age: new FormControl({value: null, disabled: true}),
      birth_place: new FormControl(null),
      email: new FormControl(null),
      phone_number: new FormControl(null),
      nationality: new FormControl(null),
      residency_address: new AddressForm(),
      contact_address_needed: new FormControl(false),
      contact_address: new AddressForm(),
      family_situation: new FamilySituationForm(),
      housing: new HousingForm(),
      bank_info: new BankInfoForm(),
      residence_permit: new ResidencePermitForm(),
    });
  }
}

