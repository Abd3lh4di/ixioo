import { Component, Input, OnInit } from '@angular/core';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { AcquisitionStateMap, Objective } from 'src/app/utils/strings';
// import { getDepartmentName } from 'src/app/utils/departments';
// import { Utils } from 'src/app/utils/locale-utils';
// import { LoanUtils } from 'src/app/utils/loan-utils';
// import { TimelinePoint } from '../../funding-slices-timeline/single-dot/single-dot.component';
import { FundingParameters, FundingResults } from 'src/app/_api';
import { Summary } from '../../summary';

@Component({
  selector: 'app-funding-summary',
  templateUrl: './funding-summary.component.html',
  styleUrls: ['./funding-summary.component.scss']
})
export class FundingSummaryComponent extends Summary implements OnInit {
  @Input() results: FundingResults;
  @Input() parameters: FundingParameters;

  objective: string;
  acquisitionState: string;
  isEligiblePtz: boolean;
  ptzRequested: boolean;
  isEligibleBossLoan: boolean;
  bossLoanRequested: boolean;
  profileRequested: boolean;
  profileString: string;
  maxLoanDuration: number;
  maxInstalement: number;
  freeTaeg: number;
  freeTaegAboveWearRate: boolean;
  bridgeTaeg: number;
  bridgeTaegAboveWearRate: boolean;
  fundingSummary: any;


  constructor() {
    super();
  }

  ngOnInit(): void {
    this.objective = Objective.toString(this.parameters.objective);
    this.acquisitionState = AcquisitionStateMap.toString(this.parameters.project.administrative_information.state);

    this.fundingSummary = LoanUtils.generateFundingSummary(this.parameters, this.results);
    this.isEligiblePtz = LoanUtils.isEligiblePtz(this.results.loans);
    this.ptzRequested = LoanUtils.hasPtz(this.parameters.loans);
    this.isEligibleBossLoan = LoanUtils.isEligibleBossLoan(this.results.loans);
    this.bossLoanRequested = LoanUtils.hasBossLoan(this.parameters.loans);
    this.profileRequested = this.parameters.profile?.type ? true : false;

    this.profileString = LocaleUtils.getProfileString(this.parameters);
    this.maxLoanDuration = this.results.summary.duration_months;
    this.maxInstalement = this.results.summary.effective_maximal_monthly_payment;

    this.freeTaeg = this.results.taegs.free_taeg;
    this.freeTaegAboveWearRate = this.results.taegs.free_taeg_above_wear_rate;
    this.bridgeTaeg = this.results.taegs.bridge_taeg;
    this.bridgeTaegAboveWearRate = this.results.taegs.bridge_taeg_above_wear_rate;

  }

}
