import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
// import { Utils } from 'src/app/utils/locale-utils';
import * as d3 from 'd3';
import { FundingResults } from 'src/app/_api';
import { SimulationGraphComponent } from '../simulation-graph.component';
// import { BudgetResults, FundingResults } from 'src/app/api/models';

@Component({
  selector: 'app-costs-distribution-chart',
  template: `<div #pieChartContainer></div>`,
  styles: ['.axis { font-size: 20px; };'],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../simulation-graph.component.scss']
})
export class CostsDistributionChartComponent extends SimulationGraphComponent implements OnInit {

  @Input() results: FundingResults;

  @ViewChild('pieChartContainer') private pieChartContainer: ElementRef;

  constructor(private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.cdRef.detectChanges();

    const loansWithoutCharges = this.results.loans.filter( l => l.type !== 'SMOOTHABLE_CHARGE' );

    const { loansNormalized } = this.normalizeLoans(loansWithoutCharges);
    this.drawPieChart(loansNormalized);
  }

  rawPieChart() {
      return this.pieChartContainer.nativeElement.firstChild;
  }

  private drawPieChart(loansNormalized: any[]) {
      // General svg setup
      // Delete the SVG, if any
      const element = this.pieChartContainer.nativeElement;
      d3.select(element).select('svg').remove();
      const margin = { top: 40, right: 80, bottom: 60, left: 80 };

      // Create the SVG
      const outerWidth = 1000;
      const outerHeight = 500;

      const width = outerWidth - margin.left - margin.right;
      const height = outerHeight - margin.top - margin.bottom;

      const loansView = loansNormalized.map((loan, id) => {
          return {
              loan,
              id,
              arc: null,
              amounts: Object.keys(this.amountTypes).filter(
                  amountName => loan[amountName] !== null
              ).map(amountName => {
                  return {
                      loan,
                      amountName,
                      arc: null,
                      total: loan[amountName].reduce((a, b) => a + b, 0)
                  };
              })
          };
      }).map(loan => {
          return {
              ...loan,
              total: loan.amounts.map(a => a.total).reduce((a, b) => a + b, 0)
          };
      });

      d3.pie()
        .value(d => d.total)
        .sort(null)(loansView)
        .forEach(arc => {
          arc.middleAngle = (arc.endAngle + arc.startAngle) / 2;
          arc.isUpsideDown = 90 < arc.middleAngle * 180 / Math.PI && arc.middleAngle * 180 / Math.PI < 270;
          arc.data.arc = arc;
          arc.data = undefined;
        });
      d3.pie()
        .value(d => d.total)
        .sort(null)(loansView.flatMap(l => l.amounts))
        .forEach(arc => {
            arc.data.arc = arc;
            arc.data = undefined;
        });

      const total = loansView.map(l => l.total).reduce((a, b) => a + b, 0);

      // a circle chart needs a radius
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(element) // select element in the DOM with id 'chart'
        .append('svg') // append an svg element to the element we've selected
        .attr('preserveAspectRatio', 'xMidYMin meet')
        .attr('class', 'chart')
        .attr('viewBox', `0 0 ${outerWidth} ${outerHeight}`)
        .append('g') // append 'g' element to the svg element
        .attr('width', width) // set the width of the svg element we just added
        .attr('height', height) // set the height of the svg element we just added
        .attr('transform', 'translate(' + (outerWidth / 2) + ',' + ((outerHeight / 3) + Number(margin.top))  + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

      // draw pie chart data
      {
          const arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.8);

          svg
            .append('g')
            .selectAll('path')
            .data(loansView.flatMap(l => l.amounts))
            .enter()
            .append('path')
              .attr('d', d => arc(d.arc))
              .attr('fill', d => this.amountTypes[d.amountName].color(d.loan.color));

          const outerArc = d3.arc()
            .innerRadius(radius * 0.81)
            .outerRadius(radius * 0.86);

          svg
            .append('g')
            .selectAll('path')
            .data(loansView)
            .enter()
            .append('path')
              .attr('d', d => outerArc(d.arc))
              .attr('fill', d => d.loan.color);

          const loanTypeTextArc = d3.arc()
            .innerRadius(radius * 0.89)
            .outerRadius(radius * 0.89);

          svg
            .append('g')
            .selectAll('text')
            .data(loansView)
            .enter()
            .append('text')
              .attr('font-family', 'Roboto')
              .attr('font-size', '16px')
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'central')
              .attr('fill', d => d.loan.color)
            .append('textPath')
              .attr('path', d => loanTypeTextArc({
                  ...d.arc,
                  startAngle: d.arc.middleAngle - 3,
                  endAngle: d.arc.middleAngle + 3
              }))
              .attr('startOffset', d => d.arc.isUpsideDown ? '75%' : '25%')
              .text(d => this.loanViewToHuman(d.loan));

          const loanPercentTextArc = d3.arc()
            .innerRadius(radius * 0.835)
            .outerRadius(radius * 0.835);

          svg
            .append('g')
            .selectAll('text')
            .data(loansView)
            .enter()
            .append('text')
              .attr('font-family', 'Roboto')
              .attr('font-size', '16px')
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'central')
              .attr('fill', 'white')
            .append('textPath')
              .attr('path', d => loanPercentTextArc({
                  ...d.arc,
                  startAngle: d.arc.middleAngle - 3,
                  endAngle: d.arc.middleAngle + 3
              }))
              .attr('startOffset', d => d.arc.isUpsideDown ? '75%' : '25%')
              .text(d => `${this.toFixed(100 * d.total / total)} %`);

          const innerArc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius * 0.7);

          const highlightOverlay = svg.append('g')
              .attr('opacity', 0)
              .on('mouseout', () => highlightOverlay.attr('opacity', '0'))
              .on('mouseover', () => highlightOverlay.attr('opacity', '1'));

          const highlightLoan = (() => {
              const highlightZones = loansView.map(loanView => {
                  const zone = highlightOverlay.append('g').attr('opacity', 0);

                  zone.append('g')
                    .selectAll('path')
                    .data(loanView.amounts)
                    .enter()
                    .append('path')
                      .attr('d', d => innerArc(d.arc))
                      .attr('fill', d => this.amountTypes[d.amountName].color(d.loan.color));

                  const selectedArc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius * 0.86);

                  zone.append('g')
                    .append('path')
                      .attr('d', selectedArc(loanView.arc))
                      .attr('fill-opacity', 0)
                      .style('stroke-dasharray', '1,3')
                      .attr('stroke-width', '1px')
                      .attr('stroke', 'black');

                  const eligibleAmounts = Object.keys(this.amountTypes).filter(
                      amountName => loanView.loan[amountName] !== null
                  );

                  const loanLegendContainer = zone.append('g')
                      .attr('transform', `translate(-80, -${(20 + 15 * eligibleAmounts.length) / 2})`);

                  eligibleAmounts.reverse().forEach(
                      (eligibleAmount, listIdx) => {
                          const actualIdx = eligibleAmounts.length - listIdx - 1;
                          const amountType = this.amountTypes[eligibleAmount];

                          loanLegendContainer.append('rect')
                              .attr('y', 15 + 15 * actualIdx)
                              .attr('height', 20)
                              .attr('width', 160)
                              .attr('rx', 5)
                              .attr('fill', amountType.color(loanView.loan.color));

                          loanLegendContainer.append('text')
                              .attr('font-family', 'Roboto')
                              .attr('font-size', '12px')
                              .attr('text-anchor', 'start')
                              .attr('dominant-baseline', 'central')
                              .attr('fill', 'white')
                              .attr('y', 27.5 + 15 * actualIdx)
                              .attr('x', 5)
                              .text(amountType.display);

                          loanLegendContainer.append('text')
                              .attr('font-family', 'Roboto')
                              .attr('font-size', '12px')
                              .attr('text-anchor', 'end')
                              .attr('dominant-baseline', 'central')
                              .attr('fill', 'white')
                              .attr('x', 155)
                              .attr('y', 27.5 + 15 * actualIdx)
                              .text(`${this.toFixed(loanView.amounts.filter(a => a.amountName === eligibleAmount)[0].total * 100 / total)} %`);
                      }
                  );

                  loanLegendContainer.append('rect')
                      .attr('height', 20)
                      .attr('width', 160)
                      .attr('rx', 5)
                      .attr('fill', loanView.loan.color);

                  loanLegendContainer.append('text')
                      .attr('font-family', 'Roboto')
                      .attr('font-size', '16px')
                      .attr('text-anchor', 'start')
                      .attr('dominant-baseline', 'central')
                      .attr('fill', 'white')
                      .attr('y', 10)
                      .attr('x', 5)
                      .text(this.loanViewToHuman(loanView.loan));

                  loanLegendContainer.append('text')
                      .attr('font-family', 'Roboto')
                      .attr('font-size', '16px')
                      .attr('text-anchor', 'end')
                      .attr('dominant-baseline', 'central')
                      .attr('fill', 'white')
                      .attr('y', 10)
                      .attr('x', 155)
                      .text(`${this.toFixed(100 * loanView.total / total)} %`);

                  return zone;
              });
              return loanId => {
                  highlightZones.forEach((zone, id) => {
                      zone.attr('opacity', id === loanId ? 1 : 0);
                  });
              };
          })();

          // overlay control
          const fullArc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

          highlightOverlay.append('g')
            .selectAll('path')
            .data(loansView)
            .enter()
            .append('path')
              .attr('d', d => fullArc(d.arc))
              .attr('opacity', 0)
              .on('mouseover', d => {
                  highlightLoan(d.id);
              });
      }
  }
}
