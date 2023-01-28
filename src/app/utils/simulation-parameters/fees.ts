import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Container } from './container';

export class Fees extends Container {
    get notaryFees() { return this.getValue(this.formGroup.controls.notaryFees); }
    get agencyFees() { return this.getValue(this.formGroup.controls.agencyFees); }
    get agencyFeesPercentage() { return this.getValue(this.formGroup.controls.agencyFeesPercentage); }
    get fileManagementFee() { return this.getValue(this.formGroup.controls.fileManagementFee); }
    get brokerFee() { return this.getValue(this.formGroup.controls.brokerFee); }
    constructor(private fb: FormBuilder) {
        super();
        this.formGroup = this.fb.group({
            notaryFees: new FormControl(0, [Validators.required, Validators.min(0)]),
            agencyFees: new FormControl(0, [Validators.required, Validators.min(0)]),
            agencyFeesPercentage: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
            fileManagementFee: new FormControl(null, Validators.min(0)),
            brokerFee: new FormControl(null, Validators.min(0)),
        });
    }
}
