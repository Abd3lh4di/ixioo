import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BossLoan, BridgeLoan, FreeLoan, PtzLoan, SmoothableCharge } from 'src/app/_api';
import { InsuranceForm } from './insurance-form';
import { GuarantyForm } from './guaranty-form';
import { GracePeriodForm } from './grace-period-form';


export class SmoothableChargeForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(SmoothableCharge.TypeEnum.SmoothableCharge, Validators.required),
            start_month: new FormControl(null, Validators.required),
            end_month: new FormControl(null, Validators.required),
            monthly_payment: new FormControl(null, Validators.required),
            charge_name: new FormControl(null, Validators.required)
        });
    }
}

export class FreeLoanForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(FreeLoan.TypeEnum.FreeLoan, Validators.required),
            yearly_rate: new FormControl(null, Validators.required),
            max_duration_months: new FormControl(null, Validators.required),
            insurances: new InsuranceForm(),
            guaranty: new GuarantyForm(),
            grace_period: new GracePeriodForm(),
            max_amortization: new FormControl(null),
            max_amount: new FormControl(null),
            // min_amortization: new FormControl(null),
            min_amount: new FormControl(null),
            loan_name: new FormControl(null),
        });
    }
}

export class BridgeLoanForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(BridgeLoan.TypeEnum.BridgeLoan, Validators.required),
            amount: new FormControl(null, Validators.required),
            yearly_rate: new FormControl(null, Validators.required),
            duration_months: new FormControl(null, Validators.required),
            grace_period_type: new FormControl(null),
            insurances: new InsuranceForm(),
            guaranty: new GuarantyForm(),
            loan_name: new FormControl(null),
        });
    }
}

export class PtzLoanForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(PtzLoan.TypeEnum.PtzLoan, Validators.required),
            insurances: new InsuranceForm(),
            guaranty: new GuarantyForm(),
        });
    }
}

export class BossLoanForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(BossLoan.TypeEnum.BossLoan, Validators.required),
            insurances: new InsuranceForm(),
            guaranty: new GuarantyForm(),
        });
    }
}