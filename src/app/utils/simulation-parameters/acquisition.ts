import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Container } from './container';

export class Acquisition extends Container {
    get price() { return this.getValue(this.formGroup.controls.price); }
    get constructionPrice() { return this.getValue(this.formGroup.controls.constructionPrice); }
    get acquisitionState() { return this.getValue(this.formGroup.controls.acquisitionState); }
    get renewalWorksAmount() { return this.getValue(this.formGroup.controls.renewalWorksAmount); }
    get department() { return this.getValue(this.formGroup.controls.department); }
    get city() { return this.getValue(this.formGroup.controls.city); }
    get zone() { return this.getValue(this.formGroup.controls.zone); }

    constructor(private fb: FormBuilder) {
        super();
        this.formGroup = this.fb.group({
            price: new FormControl(null, [Validators.required, Validators.min(0)]),
            constructionPrice: new FormControl(null, [Validators.min(0)]),
            acquisitionState: new FormControl('NEW', Validators.required),
            renewalWorksAmount: new FormControl(null),
            department: new FormControl(null, [Validators.required, Validators.min(0)]),
            city: new FormControl(null),
            zone: new FormControl('A', Validators.required),
        });
    }
}
