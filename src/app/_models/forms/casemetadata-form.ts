import { FormGroup, FormControl, Validators } from '@angular/forms';

export class CaseMetaDataForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl('', Validators.required),
      state: new FormControl('NEW', Validators.required),
      creation_date: new FormControl(new Date(), Validators.required),
      last_update_date: new FormControl(new Date(), Validators.required),
    });
  }
}
