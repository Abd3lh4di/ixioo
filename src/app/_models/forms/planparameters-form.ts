import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { SimulationObjective, StandaloneBudgetPlanParameters, StandaloneFundingPlanParameters, StandalonePinelPlanParameters, StandaloneDebtConsolidationPlanParameters } from 'src/app/_api';
// import { TypedFormArray } from 'src/app/typed-form-array';
import { ActivePartnerForm } from './activepartner-form';
import { FundingFeesForm } from './funding-fees';


export class BudgetPlanParametersForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl(null),
      type: new FormControl(StandaloneBudgetPlanParameters.TypeEnum.BudgetPlanParameters),
      funding_fees: new FundingFeesForm(),
      maximal_monthly_payment: new FormControl(null),
      maximal_debt_ratio: new FormControl(null),
      profile: new FormControl(null),
      loans: new FormArray([]),
      bank: new ActivePartnerForm(),
    });
  }
}


export class FundingPlanParametersForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl(null),
      type: new FormControl(StandaloneFundingPlanParameters.TypeEnum.FundingPlanParameters),
      objective: new FormControl(SimulationObjective.Instalment),
      bypass_instalment_constraints: new FormControl(null),
      funding_fees: new FundingFeesForm(),
      maximal_monthly_payment: new FormControl(null),
      maximal_debt_ratio: new FormControl(null),
      profile: new FormControl(null),
      loans: new FormArray([]),
      bank: new ActivePartnerForm(),
    });
  }
}


export class PinelPlanParametersForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl(null),
      type: new FormControl(StandalonePinelPlanParameters.TypeEnum.PinelPlanParameters),
      objective: new FormControl(SimulationObjective.Instalment),
      bypass_instalment_constraints: new FormControl(null),
      funding_fees: new FundingFeesForm(),
      maximal_monthly_payment: new FormControl(null),
      maximal_debt_ratio: new FormControl(null),
      profile: new FormControl(null),
      loans: new FormArray([]),
      bank: new ActivePartnerForm(),
    });
  }
}


export class DebtConsolidationPlanParametersForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl(null),
      type: new FormControl(StandaloneDebtConsolidationPlanParameters.TypeEnum.DebtConsolidationPlanParameters),
      objective: new FormControl(SimulationObjective.Instalment),
      bypass_instalment_constraints: new FormControl(null),
      funding_fees: new FundingFeesForm(),
      maximal_monthly_payment: new FormControl(null),
      maximal_debt_ratio: new FormControl(null),
      profile: new FormControl(null),
      loans: new FormArray([]),
      bank: new ActivePartnerForm(),
    });
  }
}


export class LMNPPlanParametersForm extends FormGroup {
  constructor() {
    super({
      name: new FormControl(null),
      type: new FormControl(StandalonePinelPlanParameters.TypeEnum.PinelPlanParameters),
      objective: new FormControl(SimulationObjective.Instalment),
      bypass_instalment_constraints: new FormControl(null),
      funding_fees: new FundingFeesForm(),
      maximal_monthly_payment: new FormControl(null),
      maximal_debt_ratio: new FormControl(null),
      profile: new FormControl(null),
      loans: new FormArray([]),
      bank: new ActivePartnerForm(),
    });
  }
}




