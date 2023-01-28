import { Component, Input, OnInit } from '@angular/core';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { FundingResults } from 'src/app/_api';
// import { FundingResults } from 'src/app/api/models';
// import { Utils } from 'src/app/utils/locale-utils';

@Component({
  selector: 'app-loans-and-burdens-summary',
  templateUrl: './loans-and-burdens-summary.component.html'
})
export class LoansAndBurdensSummaryComponent implements OnInit {

  @Input() fundingResults: FundingResults;
  summaryTableHeader = LoanUtils.summaryTableHeader;
  credits = [];
  constructor() { }

  ngOnInit(): void {
    this.credits = LoanUtils.generateLoanRecap(this.fundingResults.loans).loansRecap;
  }

}
