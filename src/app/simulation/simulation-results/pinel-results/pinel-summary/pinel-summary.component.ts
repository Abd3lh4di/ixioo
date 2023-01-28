import { Component, Input, OnInit } from '@angular/core';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { Objective } from 'src/app/utils/strings';
import { NewPropertyExpenses, HouseConstructionExpensesFees, PinelParameters, PinelResults, FundingFees } from 'src/app/_api';
import { Summary } from '../../summary';


@Component({
  selector: 'app-pinel-summary',
  templateUrl: './pinel-summary.component.html',
  styleUrls: ['./pinel-summary.component.scss']
})
export class PinelSummaryComponent extends Summary implements OnInit {

  @Input() results: PinelResults;
  @Input() parameters: PinelParameters;

  objective: string;

  maxLoanDuration: number;
  maxInstalement: number;
  freeTaeg: number;
  freeTaegAboveWearRate: boolean;
  bridgeTaeg: number;
  bridgeTaegAboveWearRate: boolean;
  fundingSummary: any;

  expenses: NewPropertyExpenses;
  fundingFees: FundingFees;
  fees: HouseConstructionExpensesFees;
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

    this.expenses = this.parameters.project?.property?.expenses as NewPropertyExpenses;
    this.fees = this.expenses?.fees as HouseConstructionExpensesFees;
    this.fundingFees = this.parameters.funding_fees as FundingFees;

    this.totalFees = (this.fundingFees?.broker_fees?? 0)
                    + (this.fundingFees?.file_management_fees?? 0)
                    + (this.fees?.agency_fees?? 0)
                    + (this.fees?.notary_fees?? 0)
                    + (this.results?.funding_plan?.summary?.total_guaranty?? 0);
    this.totalProject = (this.expenses.price?? 0)
                      + (this.expenses.vat?? 0)
                      + (this.expenses.other_taxes?? 0)
                      + (this.expenses.other_expenses?? 0);
  }

}
