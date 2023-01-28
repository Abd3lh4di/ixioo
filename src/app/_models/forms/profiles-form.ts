import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';

export class GrandiozProfileForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl('GRANDIOZ', Validators.required),
            initial_monthly_payment: new FormControl(null),
        });
    }
}


export class MonthlyVaryingProfileForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl('MONTHLY', Validators.required),
            initial_monthly_payment: new FormControl(null),
            variation: new FormControl(null),
        });
    }
}


export class YearlyVaryingProfileForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl('YEARLY', Validators.required),
            initial_monthly_payment: new FormControl(null),
            variation: new FormControl(null),
        });
    }
}

export class CustomProfileForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl('CUSTOM', Validators.required),
            steps: new StepsForm()
        });
    }
}


export class StepsForm extends TypedFormArray {
    constructor() {
        super(() => new FormGroup({
            monthly_payment: new FormControl(0, Validators.required),
            period_start: new FormControl(1, Validators.required),
            period_end: new FormControl(1, Validators.required)
        }));
    }
}
