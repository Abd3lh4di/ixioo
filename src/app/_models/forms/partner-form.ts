import { FormControl, FormGroup } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';
import { AddressForm } from './address-form';
import { ContactForm } from './contact-form';

export class PartnerForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl(null),
      name: new FormControl(null),
      address: new AddressForm(),
      sub_entity: new FormControl(null),
      agreement_number: new FormControl(null),
      main_contact: new ContactForm(),
      contacts: new TypedFormArray(() => new ContactForm()),
      logo_uri: new FormControl(null),
      comment: new FormControl(null),
    });
  }
}