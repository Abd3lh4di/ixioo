import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, ChangeDetectorRef, ViewChildren, OnChanges, SimpleChanges, Renderer2  } from '@angular/core';
import * as d3 from 'd3';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { BudgetParameters, CaseResource, FundingParameters, FundingResults, HouseholdDetails, LegalPerson, LightHouseholdDetails, LightLegalPerson, Loan, SmoothableCharge } from 'src/app/_api';
import { CaseFormService } from 'src/app/_services';
import { SimulationGraphComponent } from '../simulation-graph.component';

@Component({
  selector: 'app-profile-chart',
  template: `<div #profileChartContainer></div>`,
  styles: ['.axis { font-size: 20px; };'],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../simulation-graph.component.scss']
})
export class ProfileChartComponent extends SimulationGraphComponent implements OnInit {

  @Input() results: FundingResults;
  @Input() params: FundingParameters|BudgetParameters;
  @ViewChild('profileChartContainer') private profileChartContainer: ElementRef;

  constructor(private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();
    const chargeIntoLoans = LoanUtils.fromNonSmoothablePersistingChargeToLoan(new Date(), this.params?.actor, this.results);
    const { loansNormalized, maxDurationMonths } = this.normalizeLoans(this.results.loans.concat(chargeIntoLoans));
    this.drawProfileChart(loansNormalized, maxDurationMonths);
  }


  rawProfileChart() {
      // this.renderer.setStyle(this.profileChartContainer.nativeElement.firstChild, 'transform', 'rotate(-90deg) translate(-700px, 0px)'); // Used for vertical printing
      return this.profileChartContainer.nativeElement.firstChild;
  }


  private computeMaxOfCharges(maxTargetInstalment) {
      // Compute properly the max of all charges
      const actor = (this.params.actor.type === LegalPerson.TypeEnum.LegalPerson) ? this.params.actor as LegalPerson : this.params.actor as HouseholdDetails;
      const aCaseResource: CaseResource = { attributes: { actor } };
      const aCaseFormService = new CaseFormService();
      aCaseFormService.newCase(this.params.actor.type, '');
      aCaseFormService.caseResource.patchValue(aCaseResource);
      const maxInstalementWithChargesAndPersistantLoans = maxTargetInstalment + aCaseFormService.computeCharges();
      return maxInstalementWithChargesAndPersistantLoans;
  }


  private drawProfileChart(loansNormalized: any[], maxDurationMonths: number) {

      // General svg setup
      // Delete the SVG, if any
      const element = this.profileChartContainer.nativeElement;
      d3.select(element).select('svg').remove();

      const margin = { top: 50, right: 40, bottom: 60, left: 100 };

      // Create the SVG
      const outerWidth = 1480;
      const outerHeight = 800;

      const width = outerWidth - margin.left - margin.right;
      const height = outerHeight - margin.top - margin.bottom;

      const svg = d3.select(element)
          .append('svg')
          .attr('preserveAspectRatio', 'xMidYMin meet')
          .attr('class', 'chart')
          .attr('viewBox', `0 0 ${outerWidth} ${outerHeight}`);
      const graph = svg.append('g')
          .attr('width', width)
          .attr('height', height)
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Add attributes to loans
      const eventsView = this.computeEventsView(loansNormalized, maxDurationMonths);
      const { loansView, maxAmount } = this.computeLoansView(loansNormalized, maxDurationMonths);
      const eventsHeight = 40;


      const maxDebtRatio = this.params?.maximal_debt_ratio;
      const maxTargetInstalment = this.params?.maximal_monthly_payment ? this.params?.maximal_monthly_payment : 0;
      const maxInstalementWithChargesAndPersistantLoans = this.computeMaxOfCharges(maxTargetInstalment);

      const x = this.drawXAxis(graph, maxDurationMonths, width, height);
      const y = this.drawYAxis(graph, Math.max(maxInstalementWithChargesAndPersistantLoans ?? 0, maxAmount), height, eventsHeight);

      this.drawData(graph, x, y, loansView);

      this.drawLimits(graph, x, y, maxDurationMonths, maxInstalementWithChargesAndPersistantLoans, maxDebtRatio);
      this.drawEvents(graph, x, maxDurationMonths, height, eventsHeight, eventsView);
      this.drawLegend(graph, x, y, loansView);
      this.drawOverlay(graph, x, y, maxDurationMonths, eventsHeight, loansView, eventsView);
  }
}
