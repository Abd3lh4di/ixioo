import { FormControl, FormGroup } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';
import { BalancingAdjustment, Budget, CallsForFunds, CallForFunds, DebtConsolidation, HouseConstruction, Land, LMNP, LMNPSimulation, NewProperty, OldProperty, Pinel, ProjectState, Works } from 'src/app/_api';
import { AdministrativeInfoForm } from './administrativeinfo-form';
import { ContactForm } from './contact-form';
import { LoanToConsolidateForm } from './loan-to-consolidate-form';
import { ProjectDatesForm } from './projectdates-form';
import { SurfacesForm } from './surface-form';
import { FeesForm } from './fees-form';
import { UndividedPersonForm } from './undivided-person-form';

export class BudgetProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(Budget.TypeEnum.Budget),
            comment: new FormControl(null),
            administrative_information: new AdministrativeInfoForm(),
            dpe_rate: new FormControl(null),
            expenses: new FormGroup({
                other_expenses: new FormControl(null),
            }),
        });
    }

    computeExpenses(): number {
        const expenses = this.get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('other_expenses').value) ?? 0);
    }
}

export class LandProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(Land.TypeEnum.Land),
            surface: new FormControl(null),
            project_state: new FormControl(ProjectState.BeforeCompromis),
            administrative_information: new AdministrativeInfoForm(),
            expenses: new FormGroup({
                price: new FormControl(null),
                other_expenses: new FormControl(null),
                fees: new FeesForm(),
            }),
            seller: new ContactForm()
        })
    }

    computeExpenses(): number {
        const expenses = this.get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('price').value) ?? 0)
            + (Number(expenses.get('other_expenses').value) ?? 0)
            + (Number(fees.get('agency_fees').value) ?? 0)
            + (Number(fees.get('notary_fees').value) ?? 0);
    }
}


export class OldPropertyProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(OldProperty.TypeEnum.OldProperty),
            project_state: new FormControl(ProjectState.BeforeCompromis),
            surfaces: new SurfacesForm(),
            administrative_information: new AdministrativeInfoForm(),
            dpe_rate: new FormControl(null),
            seller: new ContactForm(),
            construction_date: new FormControl(null),
            construction_norm: new FormControl(null),
            lot_number: new FormControl(null),
            rooms_count: new FormControl(null),
            expenses: new FormGroup({
                price: new FormControl(null),
                works_price: new FormControl(null),
                furnitures_price: new FormControl(null),
                other_expenses: new FormControl(null),
                fees: new FeesForm(),
            })
        })
    }
    computeExpenses(): number {
        const expenses = this.get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('price').value) ?? 0)
            + (Number(expenses.get('furnitures_price').value) ?? 0)
            + (Number(expenses.get('works_price').value) ?? 0)
            + (Number(expenses.get('other_expenses').value) ?? 0)
            + (Number(fees.get('agency_fees').value) ?? 0)
            + (Number(fees.get('notary_fees').value) ?? 0);
    }
}


export class NewPropertyProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(NewProperty.TypeEnum.NewProperty),
            project_state: new FormControl(ProjectState.BeforeCompromis),
            administrative_information: new AdministrativeInfoForm(),
            surfaces: new SurfacesForm(),
            dpe_rate: new FormControl(null),
            delivery_date: new FormControl(null),
            calls_for_funds: new CallsForFundsForm(),
            construction_norm: new FormControl(null),
            lot_number: new FormControl(null),
            rooms_count: new FormControl(null),
            program: new FormControl(null),
            expenses: new FormGroup({
                price: new FormControl(null),
                other_expenses: new FormControl(null),
                vat: new FormControl(null),
                other_taxes: new FormControl(null),
                fees: new FeesForm(),
            })
        })
    }

    computeExpenses(): number {
        const expenses = this.get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('price').value) ?? 0)
            + (Number(expenses.get('other_expenses').value) ?? 0)
            + (Number(expenses.get('vat').value) ?? 0)
            + (Number(expenses.get('other_taxes').value) ?? 0)
            + (Number(fees.get('agency_fees').value) ?? 0)
            + (Number(fees.get('notary_fees').value) ?? 0);
    }
}

export class HouseConstructionProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(HouseConstruction.TypeEnum.HouseConstruction),
            project_state: new FormControl(ProjectState.BeforeCompromis),
            administrative_information: new AdministrativeInfoForm(),
            surfaces: new SurfacesForm(),
            delivery_date: new FormControl(null),
            seller: new ContactForm(),
            calls_for_funds: new CallsForFundsForm(),
            dpe_rate: new FormControl(null),
            construction_norm: new FormControl(null),
            lot_number: new FormControl(null),
            rooms_count: new FormControl(null),
            expenses: new FormGroup({
                land_price: new FormControl(null),
                construction_price: new FormControl(null),
                infrastructure_price: new FormControl(null),
                building_insurance: new FormControl(null),
                other_expenses: new FormControl(null),
                vat: new FormControl(null),
                other_taxes: new FormControl(null),
                fees: new FeesForm(),
            })
        })
    }

    computeExpenses(): number {
        const expenses = this.get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('land_price').value) ?? 0)
            + (Number(expenses.get('construction_price').value) ?? 0)
            + (Number(expenses.get('infrastructure_price').value) ?? 0)
            + (Number(expenses.get('building_insurance').value) ?? 0)
            + (Number(expenses.get('other_expenses').value) ?? 0)
            + (Number(expenses.get('vat').value) ?? 0)
            + (Number(expenses.get('other_taxes').value) ?? 0)
            + (Number(fees.get('agency_fees').value) ?? 0)
            + (Number(fees.get('notary_fees').value) ?? 0);
    }
}

export class WorksProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(Works.TypeEnum.Works),
            administrative_information: new AdministrativeInfoForm(),
            surfaces: new SurfacesForm(),
            construction_date: new FormControl(null),
            construction_norm: new FormControl(null),
            delivery_date: new FormControl(null),
            lot_number: new FormControl(null),
            rooms_count: new FormControl(null),
            dpe_rate: new FormControl(null),
            expenses: new FormGroup({
                price: new FormControl(null),
                other_expenses: new FormControl(null),
            })
        })
    }

    computeExpenses(): number {
        const expenses = this.get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('price').value) ?? 0)
            + (Number(expenses.get('other_expenses').value) ?? 0);
    }
}


export class PinelProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(Pinel.TypeEnum.Pinel),
            pinel_duration: new FormControl(null),
            tax_mode: new FormControl(null),
            monthly_rent_value: new FormControl(null),
            monthly_rent_value_yearly_evolution_rate: new FormControl(0),
            price_yearly_evolution_rate: new FormControl(0),
            renting_charges_rate: new FormControl(0),
            property: new FormGroup({
                type: new FormControl(NewProperty.TypeEnum.NewProperty),
                administrative_information: new AdministrativeInfoForm(),
                project_state: new FormControl(ProjectState.BeforeCompromis),
                surfaces: new SurfacesForm(),
                dpe_rate: new FormControl(null),
                calls_for_funds: new CallsForFundsForm(),
                delivery_date: new FormControl(null),
                construction_norm: new FormControl(null),
                lot_number: new FormControl(null),
                rooms_count: new FormControl(null),
                program: new FormControl(null),
                expenses: new FormGroup({
                    price: new FormControl(null),
                    other_expenses: new FormControl(null),
                    vat: new FormControl(null),
                    other_taxes: new FormControl(null),
                    fees: new FeesForm(),
                })
            })
        })
    }

    computeExpenses(): number {
        const expenses = this.get('property').get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('price').value) ?? 0)
            + (Number(expenses.get('other_expenses').value) ?? 0)
            + (Number(expenses.get('vat').value) ?? 0)
            + (Number(expenses.get('other_taxes').value) ?? 0)
            + (Number(fees.get('agency_fees').value) ?? 0)
            + (Number(fees.get('notary_fees').value) ?? 0);
    }
}


export class DebtConsolidationProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(DebtConsolidation.TypeEnum.DebtConsolidation),
            loans_to_consolidate: new TypedFormArray(() => new LoanToConsolidateForm()),
            expenses: new FormGroup({
                other_expenses: new FormControl(null),
            })
        })
    }

    computeExpenses(): number {
        const expenses = this.get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('other_expenses').value) ?? 0);
    }

}


export class BalancingAdjustmentProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(BalancingAdjustment.TypeEnum.BalancingAdjustment),
            project_state: new FormControl(ProjectState.BeforeCompromis),
            surfaces: new SurfacesForm(),
            administrative_information: new AdministrativeInfoForm(),
            dpe_rate: new FormControl(null),
            undivided_persons: new TypedFormArray(() => new UndividedPersonForm()),
            construction_date: new FormControl(null),
            construction_norm: new FormControl(null),
            lot_number: new FormControl(null),
            rooms_count: new FormControl(null),
            expenses: new FormGroup({
                total_balancing_adjustment_value: new FormControl(null),
                works_price: new FormControl(null),
                furnitures_price: new FormControl(null),
                other_expenses: new FormControl(null),
                fees: new FormGroup({
                    notary_fees: new FormControl(null),
                })
            })
        })
    }
    computeExpenses(): number {
        const expenses = this.get('expenses');
        const fees = expenses.get('fees');
        return  (Number(expenses.get('total_balancing_adjustment_value').value) ?? 0)
            + (Number(expenses.get('works_price').value) ?? 0)
            + (Number(expenses.get('furnitures_price').value) ?? 0)
            + (Number(expenses.get('other_expenses').value) ?? 0)
            + (Number(fees.get('notary_fees').value) ?? 0);
    }
}



export class LMNPProjectForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(LMNP.TypeEnum.Lmnp),
            tax_mode: new FormControl(null),
            guestroom_or_classified: new FormControl(null),
            monthly_rent_value: new FormControl(null),
            monthly_rent_value_yearly_evolution_rate: new FormControl(0),
            price_yearly_evolution_rate: new FormControl(0),
            renting_charges_rate: new FormControl(0),
            duration: new FormControl(null),
            property: new FormControl(null),
        })
    }

    computeExpenses(): number {
        const expenses = this.get('property').get('expenses');
        const fees = expenses.get('fees');
        if (this.get('property').get('type').value === NewProperty.TypeEnum.NewProperty) {
            return  (Number(expenses.get('price').value) ?? 0)
                + (Number(expenses.get('furnitures_price').value) ?? 0)
                + (Number(expenses.get('other_expenses').value) ?? 0)
                + (Number(expenses.get('vat').value) ?? 0)
                + (Number(expenses.get('other_taxes').value) ?? 0)
                + (Number(fees.get('agency_fees').value) ?? 0)
                + (Number(fees.get('notary_fees').value) ?? 0);
        }
        if (this.get('property').get('type').value === OldProperty.TypeEnum.OldProperty) {
            return  (Number(expenses.get('price').value) ?? 0)
                + (Number(expenses.get('works_price').value) ?? 0)
                + (Number(expenses.get('furnitures_price').value) ?? 0)
                + (Number(expenses.get('other_expenses').value) ?? 0)
                + (Number(fees.get('agency_fees').value) ?? 0)
                + (Number(fees.get('notary_fees').value) ?? 0);
        }
        if (this.get('property').get('type').value === HouseConstruction.TypeEnum.HouseConstruction) {
            return  (Number(expenses.get('land_price').value) ?? 0)
                + (Number(expenses.get('construction_price').value) ?? 0)
                + (Number(expenses.get('infrastructure_price').value) ?? 0)
                + (Number(expenses.get('building_insurance').value) ?? 0)
                + (Number(expenses.get('furnitures_price').value) ?? 0)
                + (Number(expenses.get('other_expenses').value) ?? 0)
                + (Number(expenses.get('vat').value) ?? 0)
                + (Number(expenses.get('other_taxes').value) ?? 0)
                + (Number(fees.get('agency_fees').value) ?? 0)
                + (Number(fees.get('notary_fees').value) ?? 0);
        }

    }
}

export class CallForFundsForm extends FormGroup {
    constructor() {
        super({
            percentage: new FormControl(null),
            date: new FormControl(null),
            reason: new FormControl(null),
        })
    }
}


export class CallsForFundsForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(CallsForFunds.TypeEnum.IncreasingRate),
            calls: new TypedFormArray(() => new CallForFundsForm()),
        })
    }
}