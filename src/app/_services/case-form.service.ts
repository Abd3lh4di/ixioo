import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AvailableLoan, BalancingAdjustment, Budget, Case, CaseResource, CaseStatus, CurrentLoan, DebtConsolidation, GracePeriod, Guaranty, HouseConstruction, HouseholdDetails, Land, LegalPerson, LMNP, LoanToConsolidate, NewProperty, OldProperty, Pinel, PlanParametersResource, Works } from '../_api';
import { TypedFormArray } from '../typed-form-array';
import { HouseholdForm } from '../_models/forms/household-form';
import { LegalPersonForm } from '../_models/forms/legalperson-form';
import { AmountForm } from '../_models/forms/amount-form';
import { BalancingAdjustmentProjectForm, BudgetProjectForm, DebtConsolidationProjectForm, HouseConstructionProjectForm, LandProjectForm, LMNPProjectForm, NewPropertyProjectForm, OldPropertyProjectForm, PinelProjectForm, WorksProjectForm } from '../_models/forms/project-form';
import { BudgetPlanParametersForm, DebtConsolidationPlanParametersForm, FundingPlanParametersForm, LMNPPlanParametersForm, PinelPlanParametersForm } from '../_models/forms/planparameters-form';
import { ResourceMetaForm } from '../_models/forms/resourcemeta-form';
import * as moment from 'moment';
import { LocaleUtils } from '../utils/locale-utils';
import { PartnerForm } from '../_models/forms/partner-form';
import { ActivePartnerForm } from '../_models/forms/activepartner-form';


@Injectable({
  providedIn: 'root'
})
export class CaseFormService {
  caseResource: FormGroup;
  fundingsResources: TypedFormArray;

  get case() {return this.caseResource.controls.attributes as FormGroup; }
  get caseType() {return this.case.controls.attributes as FormGroup; }


  get id() {return this.caseResource.controls.id; }

  get meta() {return this.caseResource.controls.meta as FormGroup; }
  get name() {return this.case.controls.name; }
  get owner() {return this.case.controls.owner; }
  get status() {return this.case.controls.status; }
  get copied_from() {return this.case.controls.copied_from; }
  get comments() {return this.case.controls.comments; }
  get candidate_simulations() {return this.case.controls.candidate_simulations as TypedFormArray; }
  get creation_date() {return this.meta.controls.created_at; }
  get etag() {return this.meta.controls.etag; }
  get actor() {return this.case.controls.actor as FormGroup; }
  get partners() {return this.case.controls.partners as TypedFormArray; }
  get persons() { return this.actor.controls.persons as TypedFormArray; }

  get project() {return this.case.controls.project; }

  get isLegalPerson() { return this.actor.controls.type.value === LegalPerson.TypeEnum.LegalPerson; }

  constructor() {
  }

  patchAndValidateCase(caseResource: CaseResource): boolean {
    const oldCase: CaseResource = this.caseResource.value;
    this.caseResource.patchValue(caseResource);
    const newCase: CaseResource = this.caseResource.value;
    if( (oldCase.id && oldCase.id !== newCase.id) ||
      (oldCase.meta.created_at && oldCase.meta.created_at !== newCase.meta.created_at) ||
      JSON.stringify(oldCase.attributes) !== JSON.stringify(newCase.attributes) ) {
      console.error('Case created from saved data is different from the created one.')
      console.error('oldCase: ', oldCase);
      console.error('newCase: ', newCase);
      return false;
    }
    return true;
  }

  patchAndValidatePlans(planResources: PlanParametersResource[]): boolean {

    const oldFundings: PlanParametersResource[] = this.fundingsResources.value;
    this.fundingsResources.patchValue(planResources);
    const newFundings: PlanParametersResource[] = this.fundingsResources.value;
    let hasErrors = false;
    if(oldFundings.length !== newFundings.length) {
      hasErrors = true;
    }
    oldFundings.forEach( (oldFunding, idx) => {
      const newFunding = newFundings[idx];
      if( (oldFunding.id && oldFunding.id !== newFunding.id) ||
        (oldFunding.meta.created_at && oldFunding.meta.created_at !== newFunding.meta.created_at) ||
        JSON.stringify(oldFunding.attributes) !== JSON.stringify(newFunding.attributes)) {
          hasErrors = true;
      }
    })


    if(hasErrors) {
      console.error('Fundings created from saved data are different from the created one.')
      console.error('oldFundings: ', oldFundings);
      console.error('newFundings: ', newFundings);
      return false;
    }
    return true;
  }

  patchAndValidatePlan(planResources: PlanParametersResource, planIdx: number): boolean {
    const oldFunding: PlanParametersResource = this.fundingsResources.at(planIdx).value;
    this.fundingsResources.at(planIdx).patchValue(planResources);
    const newFunding: PlanParametersResource = this.fundingsResources.at(planIdx).value;
    if( (oldFunding.id && oldFunding.id !== newFunding.id) ||
        (oldFunding.meta.created_at && oldFunding.meta.created_at !== newFunding.meta.created_at) ||
        JSON.stringify(oldFunding.attributes) !== JSON.stringify(newFunding.attributes)) {
          console.error('Fundings created from saved data are different from the created one.')
          console.error('oldFundings: ', oldFunding);
          console.error('newFundings: ', newFunding);
      return false;
    }
    return true;
  }

  createProject(scenario: string) {
    this.case.removeControl('project');
    delete this.fundingsResources;
    switch(scenario) {
      case Budget.TypeEnum.Budget: this.createBudgetProject();
      break;
      case Land.TypeEnum.Land: this.createFundingProject(new LandProjectForm());
      break;
      case OldProperty.TypeEnum.OldProperty: this.createFundingProject(new OldPropertyProjectForm());
      break;
      case NewProperty.TypeEnum.NewProperty: this.createFundingProject(new NewPropertyProjectForm());
      break;
      case HouseConstruction.TypeEnum.HouseConstruction: this.createFundingProject(new HouseConstructionProjectForm());
      break;
      case Works.TypeEnum.Works: this.createFundingProject(new WorksProjectForm());
      break;
      case Pinel.TypeEnum.Pinel: this.createPinelProject(new PinelProjectForm());
      break;
      case DebtConsolidation.TypeEnum.DebtConsolidation: this.createDebtConsolidationProject(new DebtConsolidationProjectForm());
      break;
      case BalancingAdjustment.TypeEnum.BalancingAdjustment: this.createFundingProject(new BalancingAdjustmentProjectForm());
      break;
      case LMNP.TypeEnum.Lmnp: this.createLMNPProject(new LMNPProjectForm());
      break;
    }
  }

  resetProject() {
    this.case.removeControl('project');
    delete this.fundingsResources;
  }

  createBudgetProject() {
    this.case.addControl('project', new BudgetProjectForm());
    this.fundingsResources = new TypedFormArray(() => new FormGroup({
      id: new FormControl(null),
      type: new FormControl('PLAN_PARAMETERS'),
      attributes: new BudgetPlanParametersForm(),
      meta: new ResourceMetaForm()
    }));
  }

  createFundingProject(projectForm: FormGroup) {
    this.case.addControl('project', projectForm);
    this.fundingsResources = new TypedFormArray(() => new FormGroup({
      id: new FormControl(null),
      type: new FormControl('PLAN_PARAMETERS'),
      attributes: new FundingPlanParametersForm(),
      meta: new ResourceMetaForm()
    }));
  }

  createPinelProject(projectForm: FormGroup) {
    this.case.addControl('project', projectForm);
    this.fundingsResources = new TypedFormArray(() => new FormGroup({
      id: new FormControl(null),
      type: new FormControl('PLAN_PARAMETERS'),
      attributes: new PinelPlanParametersForm(),
      meta: new ResourceMetaForm()
    }));
  }

  createDebtConsolidationProject(projectForm: FormGroup) {
    this.case.addControl('project', projectForm);
    this.fundingsResources = new TypedFormArray(() => new FormGroup({
      id: new FormControl(null),
      type: new FormControl('PLAN_PARAMETERS'),
      attributes: new DebtConsolidationPlanParametersForm(),
      meta: new ResourceMetaForm()
    }));
  }

  createLMNPProject(projectForm: FormGroup) {
    this.case.addControl('project', projectForm);
    this.fundingsResources = new TypedFormArray(() => new FormGroup({
      id: new FormControl(null),
      type: new FormControl('PLAN_PARAMETERS'),
      attributes: new LMNPPlanParametersForm(),
      meta: new ResourceMetaForm()
    }));
  }

  newCase(type: string, userId?: string) {
    delete this.caseResource;
    delete this.fundingsResources;
    this.caseResource = new FormGroup({
      id: new FormControl(null, Validators.required),
      type: new FormControl('CASE', Validators.required),
      attributes: new FormGroup({
        name: new FormControl('Dossier sans nom'),
        copied_from: new FormControl(null),
        comments: new FormControl(null),
        status: new FormControl(CaseStatus.New),
        candidate_simulations: new TypedFormArray( () => new FormGroup({
          plan_id: new FormControl(),
          simulation_id: new FormControl(),
        })),
        owner: new FormControl(userId),
        partners: new TypedFormArray(() => new ActivePartnerForm()),
      }),
      meta: new ResourceMetaForm()
    });
    if (type === HouseholdDetails.TypeEnum.Household) {
      this.createHouseholdCase();
    } else if (type === LegalPerson.TypeEnum.LegalPerson) {
      this.createLegalPersonCase();
    } else {
      throw new Error(`Unknown case type: ${type}`);
    }
    this.addPerson();
  }

  createHouseholdCase() {
    this.case.addControl('actor', new HouseholdForm());
  }

  createLegalPersonCase() {
    this.case.addControl('actor', new LegalPersonForm());
  }

  computeTotalFiscal(year: string) {
    // Persons fiscal
    const fiscal = this.persons.controls.map( person => {
      return person.get('finance').get('income_tax')?.get(year);
    });

    const actorFiscal = this.actor.get('finance').get('income_tax')?.get(year);
    fiscal.push(actorFiscal);

    return fiscal.reduce( (sum, current) => sum + current.value, 0);
  }


  computeTotalPersonalFunding() {
    // Persons funding
    const fundings = this.persons.controls.map( person => {
      return person.get('finance').get('personal_funding');
    });

    const actorFunding = this.actor.get('finance').get('personal_funding');
    fundings.push(actorFunding);

    return fundings.reduce( (sum, current) => sum + current.value, 0);
  }


  consolidateCharge(charge, consolidatedChargesAndLoans: any) {
    const monthlyAmount = charge.get('monthly_amount');
    if (monthlyAmount && charge.get('continue_after_project').value === true) {
      const weight = monthlyAmount.value.weight ?? 100;
      const figure = monthlyAmount.value.figure ?? 0;
      const startMonth = (charge.get('start_month') && charge.get('start_month').value) ? charge.get('start_month').value : 0;
      const endMonth = (charge.get('end_month') && charge.get('end_month').value) ? charge.get('end_month').value : 999;
      for (let month = startMonth; month <= endMonth; month++){
        consolidatedChargesAndLoans[month] += (weight / 100) * figure;
      }
    }
  }

  consolidateLoan(persistingLoan, consolidatedChargesAndLoans: any, iDateNow: Date) {
    const dateNow = iDateNow;
    const endDateRaw = persistingLoan.get('end_date').value ?? '2100-10-06T14:00:00.000Z';
    const endDate = new Date(endDateRaw);
    const endInMonths = Math.min(999, LocaleUtils.monthDiff(dateNow, endDate));
    const monthlyPayment = persistingLoan.get('monthly_payment');
    if (monthlyPayment) {
      const weight = monthlyPayment.value.weight ?? 100;
      const figure = monthlyPayment.value.figure ?? 0;
      for (let month = 0; month <= endInMonths; month++){
        consolidatedChargesAndLoans[month] += (weight / 100) * figure;
      }
    }
  }

  computeDetailedCharges(iDateNow: Date) {
    // Persons charges and persisting loans
    const consolidatedChargesAndLoans = new Array<number>(1000).fill(0);
    this.persons?.controls.forEach(person => {
      // Person Charges
      if(person.get('is_borrower').value === true) {
        const charges = person.get('finance')?.get('charges') as TypedFormArray;
        charges?.controls.forEach(charge => {
          this.consolidateCharge(charge, consolidatedChargesAndLoans);
        });

        // Person Loans
        const loans = person.get('finance')?.get('current_loans') as TypedFormArray;
        const persistingLoans = loans?.controls.filter( l => l.get('future').value === CurrentLoan.FutureEnum.ContinueAfterProject );
        persistingLoans?.forEach(persistingLoan => {
          this.consolidateLoan(persistingLoan, consolidatedChargesAndLoans, iDateNow);
        });
      }
    });

    // Actor Charges
    const actorCharges = this.actor.get('finance')?.get('charges') as TypedFormArray;
    actorCharges?.controls.forEach(charge => {
      this.consolidateCharge(charge, consolidatedChargesAndLoans);
    });

    // Actor Loans
    const actorLoans = this.actor.get('finance')?.get('current_loans') as TypedFormArray;
    const actorPersistingLoans = actorLoans?.controls.filter( l => l.get('future').value === CurrentLoan.FutureEnum.ContinueAfterProject );
    actorPersistingLoans?.forEach(persistingLoan => {
      this.consolidateLoan(persistingLoan, consolidatedChargesAndLoans, iDateNow);
    });
    return consolidatedChargesAndLoans;
  }

  computeCharges() {
    const dateNow = new Date();
    return Math.max(...this.computeDetailedCharges(dateNow));
  }


  computeRevenues() {
    // Persons revenues
    const revenues = this.persons?.controls.map( person => {
      if (person.get('is_borrower').value === true) {
        const rev = person.get('finance')?.get('revenues') as TypedFormArray;
        return rev.controls.reduce( (sum, current: AmountForm) => sum + current.getAmount(), 0);
      }
      return 0;
    });
    // Actor revenues
    const aRev = this.actor.get('finance').get('revenues') as TypedFormArray;
    const rActor = aRev.controls.reduce( (sum, current: AmountForm) => sum + current.getAmount(), 0);
    revenues.push(rActor);

    return revenues.reduce( (sum, current) => sum + current, 0)
  }

  computeIncomes() {
    // Persons revenues
    const totalRevenues = this.computeRevenues();
    // Persons charges and persisting loans
    const totalCharges = this.computeCharges();

    return totalRevenues - totalCharges;
  }

  computeTotalFunding() {
    let project;
    if(this.project?.value) {
      switch(this.project.value.type) {
        case NewProperty.TypeEnum.NewProperty:
          project = this.project as NewPropertyProjectForm;
        break;
        case OldProperty.TypeEnum.OldProperty:
          project = this.project as OldPropertyProjectForm;
        break;
        case Budget.TypeEnum.Budget:
          project = this.project as BudgetProjectForm;
        break;
        case Land.TypeEnum.Land:
          project = this.project as LandProjectForm;
        break;
        case HouseConstruction.TypeEnum.HouseConstruction:
          project = this.project as HouseConstructionProjectForm;
        break;
        case Works.TypeEnum.Works:
          project = this.project as WorksProjectForm;
        break;
        case Pinel.TypeEnum.Pinel:
          project = this.project as PinelProjectForm;
        break;
        case DebtConsolidation.TypeEnum.DebtConsolidation:
          project = this.project as DebtConsolidationProjectForm;
        break;
        case BalancingAdjustment.TypeEnum.BalancingAdjustment:
          project = this.project as BalancingAdjustmentProjectForm;
        break;
        case LMNP.TypeEnum.Lmnp:
          project = this.project as LMNPProjectForm;
        break;
      }
    }
    return project? project.computeExpenses() : 0;
  }

  addPerson() {
    this.persons.pushValue();
    const person = this.persons.at(this.persons.length - 1);
    this.watchAge(person);
  }

  watchAge(person) {
    const civil = person.get('civil');
    civil.get('birth_date').valueChanges.subscribe(
      date => {
        const localBirthDate = new Date(Date.parse(date));
        const timeDiff = Math.abs(Date.now() - localBirthDate.getTime());
        const localAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        civil.get('age').setValue(localAge);
      }
    );
  }

  findCandidateSimulation(planId, simulationId) {
    let index;
    this.candidate_simulations.controls.forEach( (cSim, idx) => {
      if( planId === cSim.get('plan_id').value && simulationId === cSim.get('simulation_id').value ) {
        index = idx;
      }
    })
    return index;
  }

  addCandidateSimulation(planId, simulationId) {
    if(this.findCandidateSimulation(planId, simulationId) === undefined) {
      this.candidate_simulations.pushValue({ plan_id: planId, simulation_id: simulationId });
    }
  }

  removeCandidateSimulation(planId, simulationId) {
    const index = this.findCandidateSimulation(planId, simulationId);
    this.candidate_simulations.removeAt(index);
  }

  removeGracePeriodFromLoanToConsolidateIfEmpty(project: any) {
    if (project && project.type === 'DEBT_CONSOLIDATION') {
      const loansToConsolidate = project.loans_to_consolidate;
      loansToConsolidate.forEach( (loanToConsolidate: LoanToConsolidate) => {
        if(loanToConsolidate.hasOwnProperty('grace_period')) {
          const gracePeriodKey = 'grace_period';
          const gp: GracePeriod = loanToConsolidate[gracePeriodKey];
          if(gp.type === null && gp.length === null) {
            loanToConsolidate[gracePeriodKey] = undefined;
          }
        }
      })
    }
  }

  removeCallsForFundsIfEmpty(project: any) {
    if (project && project.type === 'PINEL' && project.property && project.property.calls_for_funds && project.property.calls_for_funds.calls && project.property.calls_for_funds.calls.length === 0) {
        project.property.calls_for_funds = undefined;
    }
    if (project && (project.type === 'NEW_PROPERTY' || project.type === 'HOUSE_CONSTRUCTION') && project.calls_for_funds && project.calls_for_funds.calls && project.calls_for_funds.calls.length === 0) {
        project.calls_for_funds = undefined;
    }
  }


  asCase(): Case {
    const aCase: Case = this.case.getRawValue();
    this.removeGracePeriodFromLoanToConsolidateIfEmpty(aCase.project);
    this.removeCallsForFundsIfEmpty(aCase.project);
    // console.log(aCase);
    return aCase;
  }

  removeGracePeriodIfEmpty(planParameter: PlanParametersResource) {
    planParameter.attributes.loans.forEach( (loan: AvailableLoan) => {
      if(loan.hasOwnProperty('grace_period')) {
        const gracePeriodKey = 'grace_period';
        const gp: GracePeriod = loan[gracePeriodKey];
        if(gp.type === null || gp.type === undefined || gp.length === null || gp.length === undefined) {
          loan[gracePeriodKey] = undefined;
        }
      }
    })
  }


  removeGuarantyIfEmpty(planParameter: PlanParametersResource) {
    planParameter.attributes.loans.forEach( (loan: AvailableLoan) => {
      if(loan.hasOwnProperty('guaranty')) {
        const guarantyKey = 'guaranty';
        const gua: Guaranty = loan[guarantyKey];
        if(gua.type === null || gua.type === undefined) {
          loan[guarantyKey] = undefined;
        }
      }
    })
  }


  asPlans(): PlanParametersResource[] {
    // console.log(this.fundingsResources.value)
    const plans: PlanParametersResource[] = JSON.parse(JSON.stringify(this.fundingsResources.value));
    plans.forEach( plan => this.removeGracePeriodIfEmpty(plan));
    plans.forEach( plan => this.removeGuarantyIfEmpty(plan));

    return plans;
  }

  getPlan(idx): PlanParametersResource {
    const plan: PlanParametersResource = JSON.parse(JSON.stringify(this.fundingsResources.at(idx).value));
    this.removeGracePeriodIfEmpty(plan);
    this.removeGuarantyIfEmpty(plan);
    return plan;
  }

}

