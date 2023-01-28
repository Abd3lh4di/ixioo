import { FormGroup, FormControl } from '@angular/forms';
import { Contact } from 'src/app/_api';

export class ContactForm extends FormGroup {
  constructor() {
    super({
      courtesy: new FormControl(Contact.CourtesyEnum.Mrs),
      first_name: new FormControl(null),
      last_name: new FormControl(null),
      email: new FormControl(null),
      phone_number: new FormControl(null),
      comment: new FormControl(null),
    });
  }
}


