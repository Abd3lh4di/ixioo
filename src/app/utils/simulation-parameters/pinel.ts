import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Container } from './container';

export class Pinel extends Container {
    get maritalStatus() { return this.getValue(this.formGroup.controls.maritalStatus); }
    get childrenInCharge() { return this.getNumber(this.formGroup.controls.childrenInCharge); }
    get mensualIncomes() { return this.getNumber(this.formGroup.controls.mensualIncomes); }
    get debtThreshold() { return this.getNumber(this.formGroup.controls.debtThreshold); }
    get contribution() { return this.getNumber(this.formGroup.controls.contribution); }
    get zone() { return this.getValue(this.formGroup.controls.zone); }
    get cityControl() { return this.getValue(this.formGroup.controls.cityControl); }
    get price() { return this.getNumber(this.formGroup.controls.price); }
    get priceYearlyEvolution() { return this.getNumber(this.formGroup.controls.priceYearlyEvolution); }
    get renting() { return this.getNumber(this.formGroup.controls.renting); }
    get pinelThreshold() { return this.getNumber(this.formGroup.controls.pinelThreshold); }
    get rentingYearlyEvolution() { return this.getNumber(this.formGroup.controls.rentingYearlyEvolution); }
    get rentingCharges() { return this.getNumber(this.formGroup.controls.rentingCharges); }
    get department() { return this.getValue(this.formGroup.controls.department); }
    get surface() { return this.getNumber(this.formGroup.controls.surface); }
    get additionalSurface() { return this.getNumber(this.formGroup.controls.additionalSurface); }
    get pinelDuration() { return this.getValue(this.formGroup.controls.pinelDuration); }

    constructor(private fb: FormBuilder) {
        super();
        this.formGroup = this.fb.group({
            maritalStatus: new FormControl('SINGLE', Validators.required),
            childrenInCharge: new FormControl('0', Validators.required),
            mensualIncomes: new FormControl(0, [Validators.required, Validators.min(0)]),
            debtThreshold: new FormControl(33, [Validators.required, Validators.min(0)]),
            contribution: new FormControl(0, [Validators.required, Validators.min(0)]),
            department: new FormControl(null, [Validators.required, Validators.min(0)]),
            cityControl: new FormControl(null, Validators.required),
            price: new FormControl(null, [Validators.required, Validators.min(0)]),
            priceYearlyEvolution: new FormControl(0, [Validators.required, Validators.min(0)]),
            renting: new FormControl(null, [Validators.required, Validators.min(0)]),
            pinelThreshold: new FormControl({value: '', disabled: true}),
            rentingYearlyEvolution: new FormControl(0, [Validators.required, Validators.min(0)]),
            rentingCharges: new FormControl(0, [Validators.required, Validators.min(0)]),
            surface: new FormControl(0, [Validators.required, Validators.min(0)]),
            additionalSurface: new FormControl(0, [Validators.required, Validators.min(0)]),
            zone: new FormControl({value: 'A', disabled: true}, Validators.required),
            pinelDuration: new FormControl('SIX', Validators.required),
        });
    }
}


