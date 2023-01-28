import { Component, Input, OnInit } from '@angular/core';
import { FundingFees, FundingParameters, FundingResults, WorksExpenses } from 'src/app/_api';
import { Summary } from '../../../summary';

@Component({
  selector: 'app-works-summary',
  templateUrl: './works-summary.component.html',
  styleUrls: ['../funding-summary.component.scss']
})
export class WorksSummaryComponent extends Summary implements OnInit {

  @Input() results: FundingResults;
  @Input() parameters: FundingParameters;

  expenses: WorksExpenses;
  fundingFees: FundingFees;
  totalFees: number;
  totalProject: number;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.expenses = this.parameters.project.expenses as WorksExpenses;
    this.fundingFees = this.parameters.funding_fees as FundingFees;
    this.totalFees = (this.fundingFees?.broker_fees?? 0) + (this.fundingFees?.file_management_fees?? 0);
    this.totalProject = (this.expenses.price?? 0) + (this.expenses.other_expenses?? 0);
  }

}
