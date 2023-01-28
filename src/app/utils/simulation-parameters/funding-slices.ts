import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';
import { CustomFormValidator } from 'src/app/form-validator';
import { Container } from './container';
import { FundingSlices as FundingSlicesModel } from 'src/app/api/models';
import { Step } from 'src/app/api/models/step';

export class FundingSlices extends Container {
    get releasingOrder() { return this.getValue(this.formGroup.controls.releasingOrder); }
    get amounts() { return this.formGroup.controls.amounts as TypedFormArray; }

    constructor(private fb: FormBuilder) {
        super();
        this.formGroup = this.fb.group({
            amounts: new TypedFormArray(() => this.fb.group({
                month: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(420), CustomFormValidator.integer]),
                value: new FormControl({value: null, disabled: true}, Validators.required),
                percentage: new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
                reason: new FormControl('Premier débloquage', Validators.required),
              })
            ),
            releasingOrder: new FormControl('INCREASING_RATE', Validators.required),
        });
    }

    formatSlices() {
        let fundingSlices: FundingSlicesModel;
        if (this.amounts.length > 1) {
          const steps: Array<Step> = [];
          this.amounts.getRawValue().forEach(amount => {
            const date = Number(amount.month);
            const value = Number(amount.value);
            const reason = amount.reason;
            steps.push({date, amount: value, reason});
          });
          fundingSlices = {
            steps,
            type: this.releasingOrder
          };
        }
        return fundingSlices;
      }
}
