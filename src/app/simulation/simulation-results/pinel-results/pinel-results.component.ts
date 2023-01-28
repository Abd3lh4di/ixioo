import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PinelParameters, PinelResults, Simulation } from 'src/app/_api';
import { LoansAndBurdensSummaryDialogComponent } from '../loans-and-burdens-summary/loans-and-burdens-summary-dialog/loans-and-burdens-summary-dialog.component';
import { ResultsComponent } from '../results.component';
import { CostsDistributionChartComponent } from '../simulation-graph/costs-distribution-chart/costs-distribution-chart.component';
import { ProfileChartDialogComponent } from '../simulation-graph/profile-chart-dialog/profile-chart-dialog.component';
import { PinelSummaryComponent } from './pinel-summary/pinel-summary.component';
import { ProfileChartComponent } from '../simulation-graph/profile-chart/profile-chart.component';


@Component({
  selector: 'app-pinel-results',
  templateUrl: './pinel-results.component.html',
  styleUrls: ['./pinel-results.component.scss']
})
export class PinelResultsComponent implements OnInit, ResultsComponent {

  constructor(public dialog: MatDialog) { }

  @ViewChild('pinelSummary') pinelSummary: PinelSummaryComponent;
  @ViewChild('profileChart') profileChart: ProfileChartComponent;
  @ViewChild('costsDistributionChart') costsDistributionChart: CostsDistributionChartComponent;

  simulationData: Simulation;
  simulationResults: PinelResults;
  simulationParameters: PinelParameters;

  ngOnInit(): void {
    this.simulationResults = this.simulationData.results as PinelResults;
    this.simulationParameters = this.simulationData.parameters as PinelParameters;
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
