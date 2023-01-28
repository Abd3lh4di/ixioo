import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { SimulationService } from '../_services/simulation.service';
// import { PinelSimulationService } from '../_services/pinel.service';
// import { DebtConsolidationSimulationService } from '../_services/debt-consolidation.service';
// import { ErrorDisplayService, Error } from '../_services/error-display.service';
// import { PinelParameters, DebtConsolidationParameters, BudgetParameters, FundingParameters} from '../api/models';
import { Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import * as LZString from 'lz-string';
import { ScenarioStoreService } from '../_services/scenario-store.service';
import { AmountCalculatorService } from '../utils/amount-calculator.service';
import { SimulationDetails } from '../utils/locale-utils';
import { CostsDistributionChartComponent } from './simulation-results/simulation-graph/costs-distribution-chart/costs-distribution-chart.component';
import { ProfileChartComponent } from './simulation-results/simulation-graph/profile-chart/profile-chart.component';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, AfterViewInit {

  public initValue: any = {};

  simulationResultsReceived = false;
  simulationLaunched = false;

  pinelSimulationResultsReceived = false;
  pinelSimulationLaunched = false;

  debtConsolidationSimulationResultsReceived = false;
  debtConsolidationSimulationLaunched = false;

  simulationDetails$: Observable<SimulationDetails>;

  errorPopupTrigger$: Observable<Error>;
  pinelErrorPopupTrigger$: Observable<Error>;
  debtConsolidationErrorPopupTrigger$: Observable<Error>;

  currentSimulationResultsAndParameters: {
    simulation_results: any,
    simulation_params: any
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              public simulationService: SimulationService,
              // public pinelSimulationService: PinelSimulationService,
              // public debtConsolidationSimulationService: DebtConsolidationSimulationService,
              // private errorDisplayService: ErrorDisplayService,
              private amountCalculator: AmountCalculatorService,
              public scenarioStore: ScenarioStoreService) {
    this.resetObservables();
  }

  ngOnInit(): void {
    const data = this.route.snapshot.params.data;
    if (data) {
      try {
        const decodedData = JSON.parse(data);
        if (decodedData.hasOwnProperty('id') && decodedData.hasOwnProperty('text')) {
          this.retrieveSimulation(decodedData);
        }
      } catch (error) {
        try {
          this.initValue = JSON.parse(LZString.decompressFromEncodedURIComponent(data));
        } catch (error) {
          this.backToScenario();
        }
      }
    } else {
      if (this.scenarioStore.isEmpty()) {
        this.backToScenario();
      }
    }
  }

  ngAfterViewInit(): void {

  }

  backToScenario() {
    this.amountCalculator.reset();
    this.router.navigateByUrl('/scenario');
  }

  populateExistingSimulation(details: SimulationDetails) {
    if (details.type) {
      // TODO: Populate this in case of simulation retrieve
      this.initValue = {
        scenario: this.scenarioStore.fromType(details.type),
      };
    }
  }


  retrieveSimulation(params) {
    if (params === false) { return; }
    this.simulationLaunched = true;
    this.simulationService.retrieveSimulation(params.id);
  }

  // launchBudgetSimulation(params: BudgetParameters) {
  launchBudgetSimulation(params: any) {
    // this.simulationLaunched = true;
    // this.simulationService.launchBudgetSimulation(params);
  }
  launchFundingSimulation(params: any) {
  // launchFundingSimulation(params: FundingParameters) {
    // this.simulationLaunched = true;
    // this.simulationService.launchFundingSimulation(params);
  }
  launchPinelSimulation(params: any) {
  // launchPinelSimulation(params: PinelParameters) {
    // this.simulationLaunched = true;
    // this.simulationService.launchPinelSimulation(params);
  }
  launchDebtConsolidationSimulation(params: any) {
  // launchDebtConsolidationSimulation(params: DebtConsolidationParameters) {
    // this.simulationLaunched = true;
    // this.simulationService.launchDebtConsolidationSimulation(params);
  }

  resetObservables() {
    // this.simulationDetails$ = this.simulationService.simulation$.pipe(
    //   filter((response) => !!response && !!response.details && this.errorDisplayService.isOptimal(response.details) ),
    //   map((response) => (response.details)),
    //   tap((details) => {
    //     this.currentSimulationResultsAndParameters = {
    //       simulation_results: details.results,
    //       simulation_params: details.parameters
    //     };
    //     this.simulationResultsReceived = true;
    //     this.simulationLaunched = false;
    //     // this.populateExistingSimulation(data.simulation_params);
    //   })
    // );

    // this.errorPopupTrigger$ = this.simulationService.simulation$.pipe(
    //   filter((response) => !response || !response.details || !this.errorDisplayService.isOptimal(response.details)),
    //   map((response) => {
    //     this.simulationLaunched = false;
    //     return this.errorDisplayService.getError(response);
    //   })
    // );
  }

  backToParameters() {
    this.resetObservables();
    this.simulationResultsReceived = false;
    this.pinelSimulationResultsReceived = false;
    this.debtConsolidationSimulationResultsReceived = false;
  }

}

