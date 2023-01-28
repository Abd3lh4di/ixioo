import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GridLevelProperties } from 'src/app/api/models';
import { TypedFormArray } from 'src/app/typed-form-array';
import { Container } from './container';


export class Burdens extends Container {
    get burdens() { return this.formGroup.controls.burdens as TypedFormArray; }
    constructor(private fb: FormBuilder) {
        super();
        this.formGroup = this.fb.group({
            totalBurden: new FormControl(0, Validators.required),
            burdens: new TypedFormArray(() => this.fb.group({
                name: new FormControl(null, Validators.required),
                value: new FormControl(0, [Validators.required, Validators.min(1)]),
                duration: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(420)]),
                startMonth: new FormControl(0, [Validators.required, Validators.min(0)]),
            }))
        });
    }
    format(): Array<GridLevelProperties> {
        const burdensGrid: Array<GridLevelProperties> = [];
        this.burdens.value.forEach(charge => {
          const duration = charge.duration ? Number(charge.duration.replace(/,/g, '.')) : 0;
          const value = charge.value ? Number(charge.value.replace(/,/g, '.')) : 0;
          burdensGrid.push({
              loan_type: 'CHARGE',
              min_duration_month: duration + Number(charge.startMonth),
              max_duration_month: duration + Number(charge.startMonth),
              min_amount: duration * value,
              max_amount: duration * value,
              min_amortization: value,
              max_amortization: value,
              yearly_rate: 0.0,
              grace_period: charge.startMonth === 0 ? undefined : {
                type: 'PARTIAL',
                length: Number(charge.startMonth)
              }
            }
          );
        });
        return burdensGrid;
      }
}
