import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoanToConsolidate } from 'src/app/api/models';
import { TypedFormArray } from 'src/app/typed-form-array';
import { Container } from './container';

export class LoansToConsolidate extends Container {

    get loansToConsolidateArray() { return this.formGroup.controls.loansToConsolidateArray as TypedFormArray; }

    constructor(private fb: FormBuilder) {
        super();
        this.formGroup = this.fb.group({
            loansToConsolidateArray: new TypedFormArray(() => this.fb.group({
                name: new FormControl(null, Validators.required),
                loansToConsolidate: new TypedFormArray(() => this.fb.group({
                    duration: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(420)]),
                    yearlyRate: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
                    initialCapital: new FormControl(null, [Validators.required, Validators.min(0)]),
                    instalment: new FormControl(null, [Validators.required, Validators.min(0)]),
                    insuranceType: new FormControl(null),
                    yearlyInsuranceRate: new FormControl({value: null, disabled: true}, [Validators.required, Validators.min(0), Validators.max(100)]),
                    dateFirstInstalment: new FormControl(null, Validators.required),
                    iraType: new FormControl('LEGAL', Validators.required),
                    iraValue: new FormControl({value: null, disabled: true}, [Validators.required, Validators.min(0)])
                }))
            }))
        });
    }

    format(): Array<LoanToConsolidate> {
        const firstGrid = this.loansToConsolidateArray.value[0];
        if (firstGrid === undefined) { return []; }
        return firstGrid.loansToConsolidate.filter((line) => line.duration && line.yearlyRate)
        .map(line => {
            const firstInstalementDate = new Date(Date.parse(line.dateFirstInstalment));
            return {
                duration_months: this.stringAsNumber(line.duration),
                yearly_rate: this.stringAsNumber(line.yearlyRate),
                instalement: this.stringAsNumber(line.instalment),
                initial_capital: this.stringAsNumber(line.initialCapital),
                first_instalement_date: firstInstalementDate.toJSON(),
                insurance: (line.insuranceType && line.yearlyInsuranceRate) ? [{
                    type: line.insuranceType,
                    rate: this.stringAsNumber(line.yearlyInsuranceRate)
                }] : undefined,
                ira: {
                    type: line.iraType,
                    value: line.iraValue ? this.stringAsNumber(line.iraValue) : 0
                }
            };
        });
    }
}



