import { Component, Input, OnInit } from '@angular/core';
import { FundingFees, FundingParameters, FundingResults, NewPropertyExpenses, HouseConstructionExpensesFees } from 'src/app/_api';
import { Summary } from '../../../summary';

@Component({
  selector: 'app-newproperty-summary',
  templateUrl: './newproperty-summary.component.html',
  styleUrls: ['../funding-summary.component.scss']
})
export class NewpropertySummaryComponent extends Summary implements OnInit {

  @Input() results: FundingResults;
  @Input() parameters: FundingParameters;

  expenses: NewPropertyExpenses;
  fees: HouseConstructionExpensesFees;
  fundingFees: FundingFees;
  totalFees: number;
  totalProject: number;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.expenses = this.parameters.project.expenses as NewPropertyExpenses;
    this.fees = this.expenses.fees as HouseConstructionExpensesFees;
    this.fundingFees = this.parameters.funding_fees as FundingFees;

    this.totalFees = (this.fundingFees?.broker_fees?? 0)
                    + (this.fundingFees?.file_management_fees?? 0)
                    + (this.fees?.agency_fees?? 0)
                    + (this.fees?.notary_fees?? 0)
                    + (this.results?.summary?.total_guaranty?? 0);
    this.totalProject = (this.expenses.price?? 0)
                      + (this.expenses.vat?? 0)
                      + (this.expenses.other_taxes?? 0)
                      + (this.expenses.other_expenses?? 0);
  }

}
