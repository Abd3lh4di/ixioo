import { FormControl, FormGroup } from '@angular/forms';
import { AddressForm } from './address-form';
import { ContactForm } from './contact-form';

export class ActivePartnerForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl(null),
      name: new FormControl(null),
      address: new AddressForm(),
      contact: new ContactForm(),
      main_contact: new ContactForm(),
      role: new FormControl(null),
      sub_entity: new FormControl(null),
      agreement_number: new FormControl(null),
      logo_uri: new FormControl(null),
      comment: new FormControl(null),
    });
  }
}
