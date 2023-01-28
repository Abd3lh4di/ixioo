import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DebtConsolidationParameters, DebtConsolidationResults, Simulation, LoanToConsolidate } from 'src/app/_api';
import { LoansAndBurdensSummaryDialogComponent } from '../loans-and-burdens-summary/loans-and-burdens-summary-dialog/loans-and-burdens-summary-dialog.component';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { IraTypeMap } from 'src/app/utils/strings';
import { ResultsComponent } from '../results.component';
import { CostsDistributionChartComponent } from '../simulation-graph/costs-distribution-chart/costs-distribution-chart.component';
import { ProfileChartDialogComponent } from '../simulation-graph/profile-chart-dialog/profile-chart-dialog.component';
import { ProfileChartComponent } from '../simulation-graph/profile-chart/profile-chart.component';
import { DebtConsolidationSummaryComponent } from './debt-consolidation-summary/debt-consolidation-summary.component';


@Component({
  selector: 'app-debt-results',
  templateUrl: './debt-results.component.html',
  styleUrls: ['./debt-results.component.scss']
})
export class DebtResultsComponent implements OnInit, ResultsComponent {

  constructor(public dialog: MatDialog) { }

  @ViewChild('debtSummary') debtSummary: DebtConsolidationSummaryComponent;
  @ViewChild('profileChart') profileChart: ProfileChartComponent;
  @ViewChild('costsDistributionChart') costsDistributionChart: CostsDistributionChartComponent;

  simulationData: Simulation;
  simulationResults: DebtConsolidationResults;
  simulationParameters: DebtConsolidationParameters;


  ngOnInit(): void {
    this.simulationResults = this.simulationData.results as DebtConsolidationResults;
    this.simulationParameters = this.simulationData.parameters as DebtConsolidationParameters;
  }

  getCharts() {
    return {
      profileChart: this.profileChart.rawProfileChart(),
      costsDistributionChart: this.costsDistributionChart.rawPieChart()
    }
  }

  popupProfileChart() {
    this.dialog.open(ProfileChartDialogComponent, {
      width: '80vw',
      maxWidth: '80vw',
      data: { params: this.simulationParameters, results: this.simulationResults.funding_plan }
    });
  }

  popupLoanBurdenSummary() {
    this.dialog.open(LoansAndBurdensSummaryDialogComponent, {
      width: '80vw',
      maxWidth: '80vw',
      data: this.simulationResults.funding_plan
    });
  }


}
