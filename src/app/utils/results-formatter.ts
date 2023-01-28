import { BudgetParameters, BudgetResults, DebtConsolidationParameters, DebtConsolidationResults, FundingParameters, FundingResults, Loan, PinelParameters, PinelResults } from '../api/models';
import { LoanType, SimulationDetails, LocaleUtils } from './locale-utils';
import { LoanUtils } from './loan-utils';

export abstract class AbstractFormatter {
  formatFinancialPlanSummary(): string {
    const totalAmount = this.computeTotalAmount();
    // Fomat the data to display them in D3JS
    return 'Proposition de plan de financement pour un besoin de ' +
    LocaleUtils.toLocale(totalAmount, 'EUR') + ', incluant:';
  }
  abstract computeTotalAmount(): number;
  abstract formatFinancialRecap();
  abstract computeFees();
  abstract extractTaegs();
  abstract formatTotalCapital();
  abstract formatObjective(): string;
  abstract getLoans(): Array<Loan>;
}

export class BudgetResultsFormatter extends AbstractFormatter {
  private parameters: BudgetParameters;
  private results: BudgetResults;
  constructor(details: SimulationDetails) {
    super();
    this.parameters = details.parameters as BudgetParameters;
    this.results = details.results as BudgetResults;
  }
  formatObjective(): string {
    return '';
  }
  computeTotalAmount(): number {
    return this.results.budgets.total_budget;
  }
  formatFinancialRecap() {
    return LoanUtils.generateLoanRecap(this.results.funding_plan.loans);
  }
  computeFees() {
    const brokerFees = this.parameters.broker_fees ? this.parameters.broker_fees : 0.0;
    const fileManagementFees = this.parameters.file_management_fees ? this.parameters.file_management_fees : 0.0;
    return brokerFees + fileManagementFees;
  }
  extractTaegs() {
    return {
      freeTaeg: this.results.funding_plan.taegs.free_taeg,
      freeTaegAboveWearRate: this.results.funding_plan.taegs.free_taeg_above_wear_rate,
      bridgeTaeg: this.results.funding_plan.taegs.bridge_taeg,
      freeTbridgeTaegAboveWearRateaeg: this.results.funding_plan.taegs.bridge_taeg_above_wear_rate,
    };
  }
  formatTotalCapital() {
    const loans = this.results.funding_plan.loans;
    // Compute total borrowed capital: useful when we are in budget aka envelope mode
    let tempTotalCapital = 0;
    for (const loan of loans) {
      if (loan.type !== LoanType.CHARGE) {
        tempTotalCapital += loan.amount;
      }
    }
    tempTotalCapital += this.parameters.personal_funding;
    return tempTotalCapital;
  }
  getLoans(): Array<Loan> {
    return this.results.funding_plan.loans;
  }
}


export class FundingResultsFormatter extends AbstractFormatter {
  private parameters: FundingParameters;
  private results: FundingResults;
  constructor(details: SimulationDetails) {
    super();
    this.parameters = details.parameters as FundingParameters;
    this.results = details.results as FundingResults;
  }
  formatObjective(): string {
    return this.parameters.objective;
  }
  computeTotalAmount(): number {
    return this.parameters.total_amount;
  }
  formatFinancialRecap() {
    return LoanUtils.generateLoanRecap(this.results.loans);
  }
  computeFees() {
    const brokerFees = this.parameters.broker_fees ? this.parameters.broker_fees : 0.0;
    const fileManagementFees = this.parameters.file_management_fees ? this.parameters.file_management_fees : 0.0;
    return brokerFees + fileManagementFees;
  }
  extractTaegs() {
    return {
      freeTaeg: this.results.taegs.free_taeg,
      freeTaegAboveWearRate: this.results.taegs.free_taeg_above_wear_rate,
      bridgeTaeg: this.results.taegs.bridge_taeg,
      freeTbridgeTaegAboveWearRateaeg: this.results.taegs.bridge_taeg_above_wear_rate,
    };
  }
  formatTotalCapital() {
    const loans = this.results.loans;
    // Compute total borrowed capital: useful when we are in budget aka envelope mode
    let tempTotalCapital = 0;
    for (const loan of loans) {
      if (loan.type !== LoanType.CHARGE) {
        tempTotalCapital += loan.amount;
      }
    }
    tempTotalCapital += this.parameters.personal_funding;
    return tempTotalCapital;
  }
  getLoans(): Array<Loan> {
    return this.results.loans;
  }
}


export class PinelResultsFormatter extends AbstractFormatter {
  private parameters: PinelParameters;
  private results: PinelResults;
  constructor(details: SimulationDetails) {
    super();
    this.parameters = details.parameters as PinelParameters;
    this.results = details.results as PinelResults;
  }
  formatObjective(): string {
    return '';
  }
  computeTotalAmount(): number {
    return 0;
  }
  formatFinancialRecap() {
    return LoanUtils.generateLoanRecap(this.results.funding_plan.loans);
  }
  computeFees() {
    const brokerFees = this.parameters.funding_parameters.broker_fees ? this.parameters.funding_parameters.broker_fees : 0.0;
    const fileManagementFees = this.parameters.funding_parameters.file_management_fees ? this.parameters.funding_parameters.file_management_fees : 0.0;
    return brokerFees + fileManagementFees;
  }
  extractTaegs() {
    return {
      freeTaeg: this.results.funding_plan.taegs.free_taeg,
      freeTaegAboveWearRate: this.results.funding_plan.taegs.free_taeg_above_wear_rate,
      bridgeTaeg: this.results.funding_plan.taegs.bridge_taeg,
      freeTbridgeTaegAboveWearRateaeg: this.results.funding_plan.taegs.bridge_taeg_above_wear_rate,
    };
  }
  formatTotalCapital() {
    const loans = this.results.funding_plan.loans;
    // Compute total borrowed capital: useful when we are in budget aka envelope mode
    let tempTotalCapital = 0;
    for (const loan of loans) {
      if (loan.type !== LoanType.CHARGE) {
        tempTotalCapital += loan.amount;
      }
    }
    tempTotalCapital += this.parameters.funding_parameters.personal_funding;
    return tempTotalCapital;
  }
  getLoans(): Array<Loan> {
    return this.results.funding_plan.loans;
  }
}


export class DebtResultsFormatter extends AbstractFormatter {
  private parameters: DebtConsolidationParameters;
  private results: DebtConsolidationResults;
  constructor(details: SimulationDetails) {
    super();
    this.parameters = details.parameters as DebtConsolidationParameters;
    this.results = details.results as DebtConsolidationResults;
  }
  formatObjective(): string {
    return '';
  }
  computeTotalAmount(): number {
    return this.results.total_gain;
  }
  formatFinancialRecap() {
    return LoanUtils.generateLoanRecap(this.results.funding_plan.loans);
  }
  computeFees() {
    const brokerFees = this.parameters.funding_parameters.broker_fees ? this.parameters.funding_parameters.broker_fees : 0.0;
    const fileManagementFees = this.parameters.funding_parameters.file_management_fees ? this.parameters.funding_parameters.file_management_fees : 0.0;
    return brokerFees + fileManagementFees;
  }
  extractTaegs() {
    return {
      freeTaeg: this.results.funding_plan.taegs.free_taeg,
      freeTaegAboveWearRate: this.results.funding_plan.taegs.free_taeg_above_wear_rate,
      bridgeTaeg: this.results.funding_plan.taegs.bridge_taeg,
      freeTbridgeTaegAboveWearRateaeg: this.results.funding_plan.taegs.bridge_taeg_above_wear_rate,
    };
  }
  formatTotalCapital() {
    const loans = this.results.funding_plan.loans;
    // Compute total borrowed capital: useful when we are in budget aka envelope mode
    let tempTotalCapital = 0;
    for (const loan of loans) {
      if (loan.type !== LoanType.CHARGE) {
        tempTotalCapital += loan.amount;
      }
    }
    tempTotalCapital += this.parameters.funding_parameters.personal_funding;
    return tempTotalCapital;
  }
  getLoans(): Array<Loan> {
    return this.results.funding_plan.loans;
  }
}

export class ResultsFormatterFactory {
  static GetFormatter(details: SimulationDetails) {
    switch (details.type) {
      case 'FUNDING':
        return new FundingResultsFormatter(details);
      case 'BUDGET':
        return new BudgetResultsFormatter(details);
      case 'PINEL':
        return new PinelResultsFormatter(details);
      case 'DEBT_CONSOLIDATION':
        return new PinelResultsFormatter(details);
    }
  }
}
