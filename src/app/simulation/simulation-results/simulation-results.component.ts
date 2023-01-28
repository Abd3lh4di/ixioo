import { Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Simulation } from 'src/app/_api';
// import { ScenarioStoreService } from 'src/app/_services/scenario-store.service';
import { BudgetResultsComponent } from './budget-results/budget-results.component';
import { DebtResultsComponent } from './debt-results/debt-results.component';
import { FundingResultsComponent } from './funding-results/funding-results.component';
import { PinelResultsComponent } from './pinel-results/pinel-results.component';
import { ResultsTabsDirective } from './results-tabs.directive';
import { ResultsComponent } from './results.component';


@Component({
  selector: 'app-simulation-results',
  templateUrl: './simulation-results.component.html'
})
export class SimulationResultsComponent implements OnInit, OnChanges {

  @Input() simulationData: Simulation;
  @ViewChild(ResultsTabsDirective, { static: true }) appResultsTabsHost: ResultsTabsDirective;
  active = 1;
  componentRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadComponent();
  }


  loadComponent() {
    let componentFactory;
    const viewContainerRef = this.appResultsTabsHost.viewContainerRef;
    viewContainerRef.clear();
    if (this.simulationData) {
      switch (this.simulationData.type) {
        case 'FUNDING': {
          const component = FundingResultsComponent;
          componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        }
        break;
        case 'BUDGET': {
            const component = BudgetResultsComponent;
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        }
        break;
        case 'PINEL': {
            const component = PinelResultsComponent;
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        }
        break;
        case 'DEBT_CONSOLIDATION': {
            const component = DebtResultsComponent;
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        }
        break;
      }
      this.componentRef = viewContainerRef.createComponent<ResultsComponent>(componentFactory);
      this.componentRef.instance.simulationData = this.simulationData;
    }
  }

  getCharts() {
    return this.componentRef.instance.getCharts();
  }

}
