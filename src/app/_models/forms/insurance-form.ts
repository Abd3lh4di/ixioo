import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';

export class InsuranceForm extends TypedFormArray {
    constructor() {
        super(() => new FormGroup({
            type: new FormControl(null, Validators.required),
            rate: new FormControl(null, Validators.required),
            company: new FormControl(null),
            person: new FormControl(null),
            quota: new FormControl(100, Validators.required),
            risks_covered: new FormControl(null),
            mandatory: new FormControl(true, Validators.required)
        }));
    }
}