import { Component, Input, OnInit } from '@angular/core';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { Objective } from 'src/app/utils/strings';
import { NewPropertyExpenses, DebtConsolidationParameters, DebtConsolidationResults, BudgetExpenses, FundingFees } from 'src/app/_api';
import { Summary } from '../../summary';


@Component({
  selector: 'app-debt-consolidation-summary',
  templateUrl: './debt-consolidation-summary.component.html',
  styleUrls: ['./debt-consolidation-summary.component.scss']
})
export class DebtConsolidationSummaryComponent extends Summary implements OnInit {

  @Input() results: DebtConsolidationResults;
  @Input() parameters: DebtConsolidationParameters;

  objective: string;

  freeTaeg: number;
  freeTaegAboveWearRate: boolean;
  bridgeTaeg: number;
  bridgeTaegAboveWearRate: boolean;
  fundingSummary: any;

  expenses: BudgetExpenses;
  fundingFees: FundingFees;

  capitalToBuy: number;
  iraValue: number;
  totalFees: number;
  totalProject: number;

  constructor() {
    super();
  }

  ngOnInit(): void {

    this.objective = Objective.toString(this.parameters.objective);
    this.fundingSummary = LoanUtils.generateFundingSummary(this.parameters, this.results.funding_plan);

    this.freeTaeg = this.results.funding_plan?.taegs.free_taeg;
    this.freeTaegAboveWearRate = this.results.funding_plan?.taegs.free_taeg_above_wear_rate;
    this.bridgeTaeg = this.results.funding_plan?.taegs.bridge_taeg;
    this.bridgeTaegAboveWearRate = this.results.funding_plan?.taegs.bridge_taeg_above_wear_rate;

    this.expenses = this.parameters.project?.expenses as BudgetExpenses;
    this.fundingFees = this.parameters?.funding_fees as FundingFees;
    this.iraValue = this.results?.loans_remaining_costs?.[0].ira.value;

    this.capitalToBuy = this.results?.loans_remaining_costs?.[0].capital;

    this.totalFees = (this.fundingFees?.broker_fees?? 0)
                    + (this.fundingFees?.file_management_fees?? 0)
                    + (this.iraValue?? 0)
                    + (this.results?.funding_plan?.summary?.total_guaranty?? 0);
    this.totalProject = (this.capitalToBuy?? 0)
                      + (this.expenses.other_expenses?? 0);
  }

}
