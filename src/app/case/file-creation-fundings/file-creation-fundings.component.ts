import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Loan, Simulation, SimulationResource, SimulationResourcePaginatedListResponse, SimulationResourceResponse } from 'src/app/_api';
import { TypedFormArray } from 'src/app/typed-form-array';
import { CaseFormService } from 'src/app/_services/case-form.service';
import { FileCreationFundingsDialogComponent } from './file-creation-fundings-dialog/file-creation-fundings-dialog.component';
import { FileCreationFundingsBanksDialogComponent } from './file-creation-fundings-banks-dialog/file-creation-fundings-banks-dialog.component';
import { SimulationService } from 'src/app/_services/simulation.service';
import { merge, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDisplayService, Error } from 'src/app/_services/error-display.service';
import { LoanTypeMap, ProfileTypeMap } from 'src/app/utils/strings';
import { SimulationResultsComponent } from 'src/app/simulation/simulation-results/simulation-results.component';
import { BossLoanForm, BridgeLoanForm, FreeLoanForm, PtzLoanForm, SmoothableChargeForm } from 'src/app/_models/forms/loans-form';
import { CaseService } from 'src/app/_services';
import { PlanParametersService } from 'src/app/_services/plan-parameters.service';
import { LocaleUtils } from '../../utils/locale-utils';
import { LoaderService } from 'src/app/_services/loader.service';
import { FileCreationFundingsGrandiozProfileDialogComponent } from './file-creation-fundings-profiles-dialog/file-creation-fundings-grandioz-profile-dialog.component';
import { CustomProfileForm, GrandiozProfileForm, MonthlyVaryingProfileForm, YearlyVaryingProfileForm } from 'src/app/_models/forms/profiles-form';
import { FileCreationFundingsYearlyProfileDialogComponent } from './file-creation-fundings-profiles-dialog/file-creation-fundings-yearly-profile-dialog.component';
import { FileCreationFundingsMonthlyProfileDialogComponent } from './file-creation-fundings-profiles-dialog/file-creation-fundings-monthly-profile-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { FileCreationFundingsCustomProfileDialogComponent } from './file-creation-fundings-profiles-dialog/file-creation-fundings-custom-profile-dialog.component';


@Component({
  selector: 'app-file-creation-fundings',
  templateUrl: './file-creation-fundings.component.html',
  styleUrls: ['./file-creation-fundings.component.scss']
})
export class FileCreationFundingsComponent implements OnInit, OnChanges {

  @Input() totalFunding: number;
  @Input() totalRevenues: number;
  @Input() totalCharges: number;
  @Input() totalPersonalFunding: number;
  @Input() fundingsResources: TypedFormArray;
  @Input() project: FormGroup;
  @Input() actor: FormGroup;
  @Input() personNames: string[];

  @Output() simulationResultsAvailable = new EventEmitter<boolean>();
  @Output() saveAndRun = new EventEmitter<number>();

  @ViewChild('appSimulationResults')
  private appSimulationResults: SimulationResultsComponent;

  candidateSimulationCheckedForm = new FormGroup({
    candidateSimulationChecked: new FormControl(false)
  })



  localTotalFunding = 0;
  remainingFunding: number;

  simulationData: SimulationResource[] = [];
  simulationData$: Observable<SimulationResource[]>;
  errorPopupTrigger$: Observable<Error>;
  simulationLaunched = false;

  currentFunding: FormGroup;
  activeFunding = 0;

  totalIncomes = 0;

  subscriptions = [];
  fundingSubscriptions = [];

  get currentLoans() { return this.currentFunding?.controls.loans as TypedFormArray; }
  get fundingFees() { return this.currentFunding?.controls.funding_fees as FormGroup; }
  get profiles() { return this.currentFunding?.controls.profile as FormGroup; }
  get projectType() { return this.project?.get('type')?.value; }
  get isBudget() { return this.projectType === 'BUDGET'; }
  get isPinel() { return this.projectType === 'PINEL'; }
  get isDebt() { return this.projectType === 'DEBT_CONSOLIDATION'; }
  get currentBrokerFees() { return this.currentFunding?.get('funding_fees')?.get('broker_fees').value ?? 0 }
  get currentFileManagementFees() { return this.currentFunding?.get('funding_fees')?.get('file_management_fees').value ?? 0 }

  constructor(public dialog: MatDialog,
              private simulationService: SimulationService,
              private snackBar: MatSnackBar,
              private errorDisplayService: ErrorDisplayService,
              private caseFormService: CaseFormService,
              public caseService: CaseService,
              private loaderService: LoaderService,
              private planService: PlanParametersService) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges')
    this.totalIncomes = this.totalRevenues - this.totalCharges;

    this.fundingsResources.controls.forEach( fundingResources => {
      if(this.totalIncomes > 0) {
        this.currentFunding.get('maximal_debt_ratio').enable();
      } else {
        this.currentFunding.get('maximal_debt_ratio').disable();
        this.currentFunding.get('maximal_debt_ratio').reset();
      }

      this.currentFunding.updateValueAndValidity();
      this.remainingFunding = this.totalFunding - this.totalPersonalFunding;
      const funding = fundingResources.get('attributes');

      // In case of changes:
      // 1. We take the values of maximal_monthly_payment and maximal_debt_ratio
      const maximalMonthlyPayment = funding.get('maximal_monthly_payment').value;
      const maximalDebtRatio = funding.get('maximal_debt_ratio').value;
      // 2. We synchronise both values
      this.updateMaximalDebtRatio(maximalMonthlyPayment);
      this.updateMaximalMonthlyPayment(maximalDebtRatio);

      // 3. We impact the fees amounts
      this.updateToBeFundedFromFees(this.currentBrokerFees, this.currentFileManagementFees);

      if (funding.get('objective').value === 'MINIMIZE_INSTALMENT') {
        funding.get('bypass_instalment_constraints').patchValue(true);
      }
      else {
        funding.get('bypass_instalment_constraints').patchValue(false);
      }

    });
  }


  ngOnInit(): void {
    if (this.fundingsResources.length === 0) {
      this.addFunding();
    }
    this.simulationData$ = merge(
      this.simulationService.simulation$.pipe(
        map( (response: SimulationResourceResponse) => {
          if(!this.errorDisplayService.isOptimal(response.data)) {
            this.simulationLaunched = false;
            return;
          }
          this.setResultData(this.activeFunding, response.data);
          this.simulationResultsAvailable.emit(true);
          this.simulationLaunched = false;
          return this.simulationData;
        }),
      ),
      this.simulationService.simulationResults$.pipe(
        map( (planResults) => {
          this.fundingsResources.value.forEach( (fundingResource, idx) => {
            const result = planResults.find( v => v.planId === fundingResource.id)
            let latestResults;
            let latestDate;
            result.resources.forEach( res => {
              if(!latestDate || res.meta.last_updated_at > latestDate) {
                if(this.errorDisplayService.isOptimal(res)) {
                  latestDate = res.meta.last_updated_at;
                  latestResults = res;
                }
              }
            });
            this.setResultData(idx, latestResults);
          });
          this.simulationResultsAvailable.emit(true);

          const planId = this.fundingsResources.at(this.activeFunding).get('id').value;
          const simulationIdId = this.simulationData[this.activeFunding]?.id;

          if(this.caseFormService.findCandidateSimulation(planId, simulationIdId) !== undefined) {
            this.candidateSimulationCheckedForm.get('candidateSimulationChecked').setValue(true);
          } else {
            this.candidateSimulationCheckedForm.get('candidateSimulationChecked').setValue(false);
          }

          this.simulationLaunched = false;
          return this.simulationData;
        })
      )
    );
  }

  setResultData(idx: any, latestResults: SimulationResource) {
    if(this.simulationData.length === idx) {
      this.simulationData.push(latestResults);
    } else {
      this.simulationData[idx] = latestResults;
    }
  }

  addFunding() {
    const computedMaximalMonthlyPayment = LocaleUtils.roundFloat(this.totalRevenues * (1 - 35/100) - this.totalCharges);
    const computedCorrectedMaximalMonthlyPayment = (computedMaximalMonthlyPayment !== 0) ? computedMaximalMonthlyPayment : undefined;
    this.fundingsResources.pushValue({
      attributes: {
        maximal_monthly_payment: computedCorrectedMaximalMonthlyPayment,
        maximal_debt_ratio: 35, // HCSF recommendation
        bypass_instalment_constraints: true,
        profile: null
      }
    })
    this.selectFunding(this.fundingsResources.length - 1);
  }
  removeCurrentFunding() {
    this.loaderService.setLoading(true);
    this.planService.remove(this.caseFormService.id.value, this.caseFormService.getPlan(this.activeFunding)).pipe(
      take(1)
    ).subscribe( _ => {
      this.loaderService.setLoading(false);
      this.fundingsResources.removeAt(this.activeFunding);
      this.activeFunding = this.fundingsResources.length - 1;
      if (this.activeFunding < 0) {
        this.addFunding();
        // No more simulation results to export
        this.simulationResultsAvailable.emit(false);
      } else {
        this.selectFunding(this.activeFunding);
      }
    });
  }

  updateToBeFundedFromFees(brokerFees, fileManagementFees) {
    this.localTotalFunding = this.totalFunding + brokerFees + fileManagementFees;
    this.remainingFunding = this.totalFunding + brokerFees + fileManagementFees - this.totalPersonalFunding;
  }

  updateMaximalMonthlyPayment(maximalDebtRatio) {
    if(this.totalIncomes > 0 && maximalDebtRatio !== null && maximalDebtRatio !== undefined) {
      const maximalMonthlyPayment = Math.max(0, maximalDebtRatio / 100 * this.totalRevenues - this.totalCharges);
      this.currentFunding.get('maximal_monthly_payment').setValue(LocaleUtils.roundFloat(maximalMonthlyPayment), { emitEvent: false });
    }
    // If maximalDebtRatio is null or undef, we set maximal_monthly_payment to undef
    if (maximalDebtRatio === null || maximalDebtRatio === undefined) {
      this.currentFunding.get('maximal_monthly_payment').setValue(undefined);
    }
  }
  updateMaximalDebtRatio(maximalMonthlyPayment) {
    if(this.totalIncomes > 0 && maximalMonthlyPayment !== null && maximalMonthlyPayment !== undefined) {
      const maximalDebtRatio = LocaleUtils.roundFloat(Math.max(0, 100 * (this.totalCharges + maximalMonthlyPayment) / this.totalRevenues));
      this.currentFunding.get('maximal_debt_ratio').setValue(maximalDebtRatio, { emitEvent: false });
    }
    // If maximalMonthlyPayment is null or undef, we set maximal_debt_ratio to undef
    if (maximalMonthlyPayment === null || maximalMonthlyPayment === undefined) {
      this.currentFunding.get('maximal_debt_ratio').setValue(undefined);
    }
  }

  onMaximalMonthlyPaymentInput() {
    const currentMaximalMonthlyPayment = this.currentFunding.get('maximal_monthly_payment').value;
    this.updateMaximalDebtRatio(currentMaximalMonthlyPayment);
  }
  onMaximalDebtRatioInput() {
    const currentMaximalDebtRatio = this.currentFunding.get('maximal_debt_ratio').value;
    this.updateMaximalMonthlyPayment(currentMaximalDebtRatio);
  }

  fundingChecked(event) {
    const planId = this.fundingsResources.at(this.activeFunding).get('id').value;
    const simulationIdId = this.simulationData[this.activeFunding].id;
    if(event.checked) {
      this.caseFormService.addCandidateSimulation(planId, simulationIdId);
    } else {
      this.caseFormService.removeCandidateSimulation(planId, simulationIdId);
    }
  }

  selectFunding(idx) {
    this.currentFunding = this.fundingsResources.at(idx).get('attributes') as FormGroup;
    this.activeFunding = idx;

    const planId = this.fundingsResources.at(this.activeFunding).get('id').value;
    const simulationIdId = this.simulationData[this.activeFunding]?.id;
    if(this.caseFormService.findCandidateSimulation(planId, simulationIdId) !== undefined) {
      this.candidateSimulationCheckedForm.get('candidateSimulationChecked').setValue(true);
    } else {
      this.candidateSimulationCheckedForm.get('candidateSimulationChecked').setValue(false);
    }

    if(this.simulationData[this.activeFunding]) {
      this.simulationResultsAvailable.emit(true);
    } else {
      this.simulationResultsAvailable.emit(false);
    }

    this.fundingSubscriptions.forEach( sub => sub.unsubscribe() );

    if(this.totalIncomes > 0) {
      this.currentFunding.get('maximal_debt_ratio').enable();
    } else {
      this.currentFunding.get('maximal_debt_ratio').disable();
      this.currentFunding.get('maximal_debt_ratio').reset();
    }

    this.fundingSubscriptions.push(this.currentFunding.get('funding_fees')?.get('broker_fees').valueChanges.subscribe( brokerFees => {
      this.updateToBeFundedFromFees(brokerFees, this.currentFileManagementFees);
    }));

    this.fundingSubscriptions.push(this.currentFunding.get('funding_fees')?.get('file_management_fees').valueChanges.subscribe( fileManagementFees => {
      this.updateToBeFundedFromFees(this.currentBrokerFees, fileManagementFees);
    }));

    this.updateToBeFundedFromFees(this.currentBrokerFees, this.currentFileManagementFees);
  }

  pickBank() {
    const bank = this.currentFunding.get('bank').value;
    const dialogRef = this.dialog.open(FileCreationFundingsBanksDialogComponent, { width: '80%', data: bank });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.addBank(data);
      }
    });
  }

  addBank(bank) {
    this.currentFunding.get('bank').patchValue(bank);
  }

  getProfileType() {
    const type = this.currentFunding.get('profile')?.value?.type;
    let variation = 0;
    if (type && type === 'MONTHLY' || type === 'YEARLY') {
      variation = LocaleUtils.roundFloat(100*Number(this.currentFunding.get('profile')?.value?.variation)) ?? 0;
    }
    if (type && variation !== 0) {
      return ProfileTypeMap.toString(type) + ' (' + variation + '%)';
    }
    if (type) {
      return ProfileTypeMap.toString(type);
    }
    return 'Aucun';
  }

  pickProfile(type) {
    let profileComponent;
    let customData;
    let width = '40%';
    switch(type) {
      case 'GRANDIOZ':
        profileComponent = FileCreationFundingsGrandiozProfileDialogComponent;
        customData = { type: 'GRANDIOZ', initial_monthly_payment: 0 };
      break;
      case 'YEARLY_VARIATION':
        profileComponent = FileCreationFundingsYearlyProfileDialogComponent;
        customData = { type: 'YEARLY', initial_monthly_payment: 0, variation: null };
      break;
      case 'MONTHLY_VARIATION':
        profileComponent = FileCreationFundingsMonthlyProfileDialogComponent;
        customData = { type: 'MONTHLY', initial_monthly_payment: 0, variation: null };
      break;
      case 'CUSTOM':
        profileComponent = FileCreationFundingsCustomProfileDialogComponent;
        width = '80%';
        if(this.currentFunding.get('profile')?.value?.type === 'CUSTOM') {
          // if(this.currentFunding.get('profile').value.type === 'CUSTOM') {
          customData = this.currentFunding.get('profile').value;
        } else {
          customData = { type: 'CUSTOM', steps: [] };
        }
      break;
    }

    const objective = this.currentFunding.get('objective')?.value ?? 'MAXIMIZE_BUDGET';

    const dialogRef = this.dialog.open(profileComponent, { width, data: { custom_data: customData, objective } } );
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if(data.custom_data) {
          this.addProfile(type, data.custom_data);
        } else {
          this.addProfile(data.type, data);
        }
      }
    });
  }

  addProfile(type, profile) {
    this.currentFunding.removeControl('profile');
    switch(type) {
      case 'GRANDIOZ':
        this.currentFunding.addControl('profile', new GrandiozProfileForm());
      break;
      case 'YEARLY_VARIATION':
        this.currentFunding.addControl('profile', new YearlyVaryingProfileForm());
        profile.variation = profile.variation / 100;
      break;
      case 'MONTHLY_VARIATION':
        this.currentFunding.addControl('profile', new MonthlyVaryingProfileForm());
        profile.variation = profile.variation / 100;
      break;
      case 'CUSTOM':
        this.currentFunding.addControl('profile', new CustomProfileForm());
        profile.steps.forEach(step => {
          (this.profiles.get('steps') as TypedFormArray).pushValue(step);
        });
      break;
    }
    this.currentFunding.get('profile').patchValue(profile);
  }

  removeProfile() {
    this.currentFunding.removeControl('profile');
  }


  addLoan(type: Loan.TypeEnum) {
    let loan;
    switch(type) {
      case Loan.TypeEnum.BossLoan:
        loan = new BossLoanForm();
      break;
      case Loan.TypeEnum.FreeLoan:
        loan = new FreeLoanForm();
      break;
      case Loan.TypeEnum.BridgeLoan:
        loan = new BridgeLoanForm();
      break;
      case Loan.TypeEnum.PtzLoan:
        loan = new PtzLoanForm();
      break;
      case Loan.TypeEnum.SmoothableCharge:
        loan = new SmoothableChargeForm();
      break;
    }
    this.currentLoans.push(loan);
    return loan;
  }

  editLoan(idx) {
    const loan = this.currentLoans.at(idx);
    const dialogRef = this.dialog.open(FileCreationFundingsDialogComponent,
      { width: '80%', data: { loan, personNames: this.personNames, currentLoans: this.currentLoans} } );
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        loan.patchValue(data.value);
      }
    });
  }
  deleteLoan(idx) {
    this.currentLoans.removeAt(idx);
  }

  getLoanColor(type: Loan.TypeEnum) {
    switch (type) {
      case Loan.TypeEnum.FreeLoan: return '#e1f5fe';
      case Loan.TypeEnum.BridgeLoan: return '#ede7f6';
      case Loan.TypeEnum.PtzLoan: return '#e0f2f1';
      case Loan.TypeEnum.BossLoan: return '#e8f5e9';
      case Loan.TypeEnum.SmoothableCharge: return '#f48fb1';
    }
  }

  getLoanName(type) {
    return LoanTypeMap.toString(type);
  }

  saveAndAskForRun() {
    if(this.invalid()) {
      return;
    }
    if (!this.project?.value) {
      this.snackBar.open('Vous devez selectionner un projet', 'Ok', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }
    this.saveAndRun.emit(this.activeFunding);
  }

  runSimulation(planId: string) {
    this.simulationLaunched = true;
    this.simulationService.launchSimulation(this.caseFormService.id.value, planId);
  }

  invalid() {
    if(this.currentFunding.invalid) {
      return true;
    }
    const loans = this.currentFunding.get('loans').value;
    if(loans.length === 0) {
      return true;
    }

    // Grace period must be properly filled: length if type is filled, or type if length is filled
    const gracePeriodInvalid = loans.some( (loan: any) => ( loan.grace_period?.length !== null && loan.grace_period?.type === null || loan.grace_period?.length === null && loan.grace_period?.type !== null) );
    if(gracePeriodInvalid) {
      return true;
    }

    // Permitting to run a simulation if one of these values is 0 has no sense
    const objective = this.currentFunding.get('objective')?.value;
    const maximalDebtRatioEnabledAndEqualZero = this.currentFunding.get('maximal_debt_ratio').enabled && this.currentFunding.get('maximal_debt_ratio').value === 0;
    const maximalMonthlyPaymentEqualZero = this.currentFunding.get('maximal_monthly_payment').value === 0;
    const projectIsNotBudgetNeitherDebtConsolidationAndTotalAmountToFundIsZeroNullOrUndefined = this.projectType !== 'BUDGET' && this.projectType !== 'DEBT_CONSOLIDATION' && (this.localTotalFunding === null || this.localTotalFunding === undefined || this.localTotalFunding === 0);
    const objectiveIsMinimizeCostAndMaximalMonthlyPaymentIsNullOrUndef = objective === 'MINIMIZE_COST' && (this.currentFunding.get('maximal_monthly_payment').value === undefined || this.currentFunding.get('maximal_monthly_payment').value === null);

    if(maximalDebtRatioEnabledAndEqualZero ||
       maximalMonthlyPaymentEqualZero ||
       projectIsNotBudgetNeitherDebtConsolidationAndTotalAmountToFundIsZeroNullOrUndefined ||
       objectiveIsMinimizeCostAndMaximalMonthlyPaymentIsNullOrUndef) {
      return true;
    }

    // For Pinel, we ensure that minimal info is filled in the case
    if (this.isPinel) {
      const pinelDuration = this.project.get('pinel_duration').value;
      const monthlyRentValue = this.project.get('monthly_rent_value').value;
      const property = this.project.get('property');
      const surfaces = property?.get('surfaces');
      const surface = surfaces?.get('surface')?.value;

      const administrativeInformation = property?.get('administrative_information');
      const address = administrativeInformation?.get('address');
      const inseeCode = address?.get('insee_code');

      // In Pinel, we estimate the income tax. In order to do this, either we extrapolate revenue of year N using the 12 * revenus,
      // Either we use fiscal_reference_revenue_Nminus1
      const revenues = this.caseFormService.computeRevenues();
      const fiscalNminus1 = this.caseFormService.computeTotalFiscal('fiscal_reference_revenue_Nminus1');

      return !(pinelDuration && monthlyRentValue && surface && inseeCode && (revenues || fiscalNminus1))
    }

    return false;
  }

  getCurrentResults(): Simulation {
    return this.simulationData[this.activeFunding].attributes;
  }
  getCurrentSimulationId(): string {
    return this.simulationData[this.activeFunding].id;
  }
  getCurrentPlanId(): string {
    return this.fundingsResources.at(this.activeFunding).get('id').value;
  }

  getGraphs() {
    return this.appSimulationResults.getCharts();
  }

  getName() {
    return this.currentFunding.get('name').value;
  }
}
