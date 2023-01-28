import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridLevelProperties } from 'src/app/api/models';
import { CustomFormValidator } from 'src/app/form-validator';
import { TypedFormArray } from 'src/app/typed-form-array';
import { Container } from './container';


abstract class Grid extends Container {
    get type() { return this.gridType; }
    get gridsArray() { return this.formGroup.controls.gridsArray as TypedFormArray; }
    constructor(private fb: FormBuilder, private gridType: string) {
        super();
        this.formGroup = this.fb.group({
            gridsArray: new TypedFormArray(() => this.fb.group({
                name: new FormControl(null, Validators.required),
                loanType: new FormControl(this.gridType, Validators.required),
                guarantyType: new FormControl(null),
                insuranceType: new FormControl(null),
                gracePeriodType: new FormControl(null),
                lines: new TypedFormArray(() => this.fb.group({
                    duration: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(420), CustomFormValidator.integer]),
                    yearlyRate: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
                    amount: new FormControl(null, this.isFree() ? [Validators.min(1)] : [Validators.required, Validators.min(1)]),
                    guarantyType: new FormControl(null),
                    insuranceType: new FormControl(null),
                    yearlyInsuranceRate: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.min(0), Validators.max(100)]),
                    gracePeriodType: new FormControl(null),
                    gracePeriodLength: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.min(0), CustomFormValidator.integer])
                })
                )
            }))
        });
    }
    private isFree(): boolean {
        return this.gridType === 'FREE';
    }

    abstract computeGracePeriod(line: any);

    formatGrids(): Array<GridLevelProperties> {
        const firstGrid = this.gridsArray.value[0];
        if (firstGrid === undefined) { return []; }
        return firstGrid.lines.filter((line) => line.duration && line.yearlyRate)
            .map(line => {
                let amortization;
                const yearlyRate = Number(line.yearlyRate.replace(/,/g, '.'));
                const amount = line.amount ? Number(line.amount.replace(/,/g, '.')) : undefined;
                if (yearlyRate === 0 && amount) {
                    amortization = line.gracePeriodType ?
                        amount / (Number(line.duration) - Number(line.gracePeriodLength)) :
                        amount / Number(line.duration);
                }

                return {
                    loan_type: firstGrid.loanType,
                    min_amount: amount /* && !(this.isFree()) ? amount : undefined */,
                    max_amount: amount,
                    min_duration_month: Number(line.duration),
                    max_duration_month: Number(line.duration),
                    yearly_rate: yearlyRate,
                    insurance: line.insuranceType ? [{
                        type: line.insuranceType,
                        rate: Number(line.yearlyInsuranceRate.replace(/,/g, '.'))
                    }] : undefined,
                    guaranty_type: line.guarantyType,
                    grace_period: this.computeGracePeriod(line),
                    min_amortization: amortization,
                    max_amortization: amortization,
                };
            });
    }
}

export class FreeGrid extends Grid {
    constructor(fb: FormBuilder) {
        super(fb, 'FREE');
    }
    computeGracePeriod(line) {
        return line.gracePeriodType ? {
            type: line.gracePeriodType,
            length: Number(line.gracePeriodLength)
        } : undefined;
    }
}

export class BridgeGrid extends Grid {
    constructor(fb: FormBuilder) {
        super(fb, 'BRIDGE');
    }
    computeGracePeriod(line) {
        return {
            type: 'PARTIAL',
            length: Number(line.duration - 1)
        };
    }
}

