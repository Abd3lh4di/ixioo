import { Component, Input, OnInit } from '@angular/core';
import { FundingFees, FundingResults, FundingParameters, OldPropertyExpenses, HouseConstructionExpensesFees, BalancingAdjustmentExpenses, BalancingAdjustmentExpensesFees } from 'src/app/_api';
import { Summary } from '../../../summary';

@Component({
  selector: 'app-balancingadjustment-summary',
  templateUrl: './balancingadjustment-summary.component.html',
  styleUrls: ['../funding-summary.component.scss']
})
export class BalancingAdjustmentSummaryComponent extends Summary implements OnInit {

  @Input() results: FundingResults;
  @Input() parameters: FundingParameters;

  expenses: BalancingAdjustmentExpenses;
  fees: BalancingAdjustmentExpensesFees;
  fundingFees: FundingFees;
  totalFees: number;
  totalProject: number;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.expenses = this.parameters.project.expenses as OldPropertyExpenses;
    this.fees = this.expenses.fees as HouseConstructionExpensesFees;
    this.fundingFees = this.parameters.funding_fees as FundingFees;

    this.totalFees = (this.fundingFees?.broker_fees?? 0)
                    + (this.fundingFees?.file_management_fees?? 0)
                    + (this.fees?.notary_fees?? 0)
                    + (this.results?.summary?.total_guaranty?? 0);
    this.totalProject = (this.expenses.total_balancing_adjustment_value?? 0)
                      + (this.expenses.works_price?? 0)
                      + (this.expenses.other_expenses?? 0);
  }



}
