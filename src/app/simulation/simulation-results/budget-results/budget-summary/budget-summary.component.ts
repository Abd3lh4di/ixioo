import { Component, Input, OnInit } from '@angular/core';
import * as palette from 'google-palette';
import { AcquisitionStateMap } from 'src/app/utils/strings';
import { getDepartmentName } from 'src/app/utils/departments';
import { BudgetParameters, BudgetResults } from 'src/app/_api';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { LocaleUtils } from 'src/app/utils/locale-utils';

@Component({
  selector: 'app-budget-summary',
  templateUrl: './budget-summary.component.html',
  styleUrls: ['./budget-summary.component.scss']
})
export class BudgetSummaryComponent implements OnInit {
  @Input() results: BudgetResults;
  @Input() parameters: BudgetParameters;

  colormap = palette(['tol-rainbow'], 10);
  acquisitionState: string;
  // burdens: any[];
  bridges: any[];
  isEligiblePtz: boolean;
  ptzRequested: boolean;
  isEligibleBossLoan: boolean;
  bossLoanRequested: boolean;
  freeTaeg: number;
  freeTaegAboveWearRate: boolean;
  bridgeTaeg: number;
  bridgeTaegAboveWearRate: boolean;
  maxLoanDuration: number;
  maxInstalement: number;
  totalCostDetailed: any;
  totalFees: number;
  totalProject: number;
  // otherExpenses: number;
  budgetSummary: any;


  // String for display
  totalCostStr = LoanUtils.totalCostStr;
  totalInterestsStr = LoanUtils.totalInterestsStr;
  totalInsurancesStr = LoanUtils.totalInsurancesStr;
  totalGuarantiesStr = LoanUtils.totalGuarantiesStr;
  totalCapitalizedInterestsStr = LoanUtils.totalCapitalizedInterestsStr;
  totalInterestsCounterStr = LoanUtils.totalInterestsCounterStr;
  fileManagementFeesStr = LoanUtils.fileManagementFeesStr;
  brokerFeesStr = LoanUtils.brokerFeesStr;
  otherExpensesStr = LoanUtils.otherExpensesStr;
  notaryFeesStr = LoanUtils.notaryFeesStr;
  maximalInstalementStr = LoanUtils.maximalInstalementStr;
  planLengthStr = LoanUtils.planLengthStr;
  debtRatioStr = LoanUtils.debtRatioStr;
  jumpChargeStr = LoanUtils.jumpChargeStr;
  personalFundingPercentageStr = LoanUtils.personalFundingPercentageStr;
  personalFundingAbsoluteStr = LoanUtils.personalFundingAbsoluteStr;
  remainingForLivingStr = LoanUtils.remainingForLivingStr;


  // String for balancing table table
  balancingMaximalPriceStr = LoanUtils.balancingMaximalPriceStr;
  balancingOtherExpensesStr = LoanUtils.balancingOtherExpensesStr;
  balancingBrokerFeesStr = LoanUtils.balancingBrokerFeesStr;
  balancingFileManagementFeesStr = LoanUtils.balancingFileManagementFeesStr;
  balancingNotaryFeesStr = LoanUtils.balancingNotaryFeesStr;
  balancingGuarantiesStr = LoanUtils.balancingGuarantiesStr;
  balancingPersonalFundingStr = LoanUtils.balancingPersonalFundingStr;
  balancingMaximalBorrowableStr = LoanUtils.balancingMaximalBorrowableStr;

  constructor() {
  }

  ngOnInit(): void {

    this.acquisitionState = AcquisitionStateMap.toString(this.parameters.project.administrative_information.state);

    this.budgetSummary = LoanUtils.generateBudgetSummary(this.parameters, this.results);
    // this.burdens = LoanUtils.getBurdens(this.results.funding_plan.loans);
    this.isEligiblePtz = LoanUtils.isEligiblePtz(this.results.funding_plan.loans);
    this.ptzRequested = LoanUtils.hasPtz(this.parameters.loans);
    this.isEligibleBossLoan = LoanUtils.isEligibleBossLoan(this.results.funding_plan.loans);
    this.bossLoanRequested = LoanUtils.hasBossLoan(this.parameters.loans);
    this.maxLoanDuration = this.results.funding_plan.summary.duration_months;
    this.maxInstalement = this.results.funding_plan.summary.effective_maximal_monthly_payment;

    // this.otherExpenses = this.results.budgets.other_expenses ? this.results.budgets.other_expenses : 0;
    this.totalFees = this.results.budgets.broker_fees
                    + this.results.budgets.file_management_fees
                    + this.results.budgets.notary_fees
                    + this.results.budgets.guaranties_fees;
    this.totalProject = this.results.budgets.maximal_price + this.results.budgets.other_expenses;

    this.freeTaeg = this.results.funding_plan.taegs.free_taeg;
    this.freeTaegAboveWearRate = this.results.funding_plan.taegs.free_taeg_above_wear_rate;
    this.bridgeTaeg = this.results.funding_plan.taegs.bridge_taeg;
    this.bridgeTaegAboveWearRate = this.results.funding_plan.taegs.bridge_taeg_above_wear_rate;
  }

}
