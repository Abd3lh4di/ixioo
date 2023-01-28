import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BudgetParameters, FundingParameters, FundingResults, Simulation } from 'src/app/_api';
import { LoansAndBurdensSummaryDialogComponent } from '../loans-and-burdens-summary/loans-and-burdens-summary-dialog/loans-and-burdens-summary-dialog.component';
import { ResultsComponent } from '../results.component';
import { CostsDistributionChartComponent } from '../simulation-graph/costs-distribution-chart/costs-distribution-chart.component';
import { ProfileChartDialogComponent } from '../simulation-graph/profile-chart-dialog/profile-chart-dialog.component';
import { ProfileChartComponent } from '../simulation-graph/profile-chart/profile-chart.component';


@Component({
  selector: 'app-funding-results',
  templateUrl: './funding-results.component.html',
  styleUrls: ['./funding-results.component.scss']
})
export class FundingResultsComponent implements OnInit, ResultsComponent {

  @ViewChild('profileChart') profileChart: ProfileChartComponent;
  @ViewChild('costsDistributionChart') costsDistributionChart: CostsDistributionChartComponent;

  simulationData: Simulation;
  simulationResults: FundingResults;
  simulationParameters: FundingParameters;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.simulationResults = this.simulationData.results as FundingResults;
    this.simulationParameters = this.simulationData.parameters as FundingParameters;
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
      data: { params: this.simulationParameters, results: this.simulationResults }
    });
  }

  popupLoanBurdenSummary() {
    this.dialog.open(LoansAndBurdensSummaryDialogComponent, {
      width: '80vw',
      maxWidth: '80vw',
      data: this.simulationResults
    });
  }
}
