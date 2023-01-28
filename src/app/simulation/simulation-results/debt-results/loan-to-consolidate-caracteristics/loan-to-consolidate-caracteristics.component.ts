import { Component, Input, OnInit } from '@angular/core';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import * as palette from 'google-palette';
import {  DebtConsolidationParameters, DebtConsolidationResults,  } from 'src/app/_api';
import { Summary } from '../../summary';


@Component({
  selector: 'app-loan-to-consolidate-caracteristics',
  templateUrl: './loan-to-consolidate-caracteristics.component.html',
  styleUrls: ['./loan-to-consolidate-caracteristics.component.scss']
})
export class LoanToConsolidateCaracteristicsComponent extends Summary implements OnInit {

  @Input() results: DebtConsolidationResults;
  @Input() parameters: DebtConsolidationParameters;

  loansToConsolidateTableHeader = LocaleUtils.loansToConsolidateTableHeader;
  loansToConsolidateTable = null;

  colormap = palette(['tol-rainbow'], 10);
  objective: string;

  freeTaeg: number;
  freeTaegAboveWearRate: boolean;
  bridgeTaeg: number;
  bridgeTaegAboveWearRate: boolean;

  debtConsolidationSummary: any;


  constructor() {
    super();
  }

  ngOnInit(): void {

    this.loansToConsolidateTable = LocaleUtils.buildLoansToConsolidateTable(this.parameters, this.results);

    this.freeTaeg = this.results.funding_plan.taegs.free_taeg;
    this.freeTaegAboveWearRate = this.results.funding_plan.taegs.free_taeg_above_wear_rate;
    this.bridgeTaeg = this.results.funding_plan.taegs.bridge_taeg;
    this.bridgeTaegAboveWearRate = this.results.funding_plan.taegs.bridge_taeg_above_wear_rate;

    this.debtConsolidationSummary = LocaleUtils.computeDebtConsolidationSummary(this.parameters, this.results);

  }




}
