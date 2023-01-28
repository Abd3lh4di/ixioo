import { FormGroup, FormControl } from '@angular/forms';

export class ChildForm extends FormGroup {
  constructor() {
    super({
      birth_date: new FormControl(null),
      age: new FormControl({value: '', disabled: true}),
      shared_custody: new FormControl(false)
    });
  }
}
