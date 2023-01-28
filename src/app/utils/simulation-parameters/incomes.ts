import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Container } from './container';

export class Incomes extends Container {
    get mensualIncomes() { return this.getValue(this.formGroup.controls.mensualIncomes); }
    get allowedDebt() { return this.getValue(this.formGroup.controls.allowedDebt); }
    get contribution() { return this.getValue(this.formGroup.controls.contribution); }
    get yearlyIncome() { return this.getValue(this.formGroup.controls.yearlyIncome); }
    get peopleInHousehold() { return this.getValue(this.formGroup.controls.peopleInHousehold); }
    constructor(private fb: FormBuilder) {
        super();
        this.formGroup = this.fb.group({
            mensualIncomes: new FormControl(null, [Validators.required, Validators.min(0)]),
            allowedDebt: new FormControl(33, [Validators.required, Validators.min(0), Validators.max(100)]),
            contribution: new FormControl(0, [Validators.required, Validators.min(0)]),
            yearlyIncome: new FormControl(null, [Validators.min(1)]),
            peopleInHousehold: new FormControl(1, [Validators.min(0)]),
        });
    }
}
