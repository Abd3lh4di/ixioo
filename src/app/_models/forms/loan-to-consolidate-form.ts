import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { InsuranceForm } from './insurance-form';
import { IraForm } from './ira-form';
import { GracePeriodForm } from './grace-period-form';
import { TypedFormArray } from 'src/app/typed-form-array';
import { SmoothableChargeForm } from './loans-form';



export class LoanToConsolidateForm extends FormGroup {
    constructor() {
        super({
            yearly_rate: new FormControl(null, Validators.required),
            duration_months: new FormControl(null, Validators.required),
            initial_capital: new FormControl(null),
            insurances: new InsuranceForm(),
            grace_period: new GracePeriodForm(),
            first_monthly_payment_date: new FormControl(null),
            smoothable_elements: new TypedFormArray(() => new SmoothableChargeForm()),
            ira:  new IraForm(),
        });
    }
}