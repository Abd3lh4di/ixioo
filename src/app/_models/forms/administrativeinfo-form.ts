import { FormControl, FormGroup } from '@angular/forms';
import { AddressForm } from './address-form';
import { ProjectDatesForm } from './projectdates-form';
export class AdministrativeInfoForm extends FormGroup {
    constructor() {
        super({
          nature: new FormControl(),
          state: new FormControl(),
          destination: new FormControl(),
          address: new AddressForm(),
          project_dates: new ProjectDatesForm(),
          land_register_reference: new FormControl(),
          description: new FormControl(),
        });
    }
}
