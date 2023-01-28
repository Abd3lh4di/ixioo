import { FormGroup, FormControl } from '@angular/forms';
import { ContactForm } from './contact-form';

export class UndividedPersonForm extends FormGroup {
  constructor() {
    super({
      share_percentage: new FormControl(null),
      relationship: new FormControl(null),
      contact: new ContactForm()
    });
  }
}

