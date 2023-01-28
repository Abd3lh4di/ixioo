import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Container } from './container';

export class Ptz extends Container {
    get guarantyType() { return this.getValue(this.formGroup.controls.guarantyType); }
    get insuranceType() { return this.getValue(this.formGroup.controls.insuranceType); }
    get yearlyInsuranceRate() { return this.getValue(this.formGroup.controls.yearlyInsuranceRate); }
    constructor(private fb: FormBuilder) {
        super();
        this.formGroup = this.fb.group({
            guarantyType: new FormControl(null),
            insuranceType: new FormControl(null),
            yearlyInsuranceRate: new FormControl({value: null, disabled: true}, [Validators.required, Validators.min(0), Validators.max(100)]),
        });
    }
}
