import { Component, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';
import * as palette from 'google-palette';
import { chargesTypeShortList, ChargeTypeMapShort, loansTypeShortList } from 'src/app/utils/strings';
import { Loan } from 'src/app/_api';


@Component({
    selector: 'app-simulation-graph',
    template: `
        <div class="d-flex justify-content-between">
            <div>
                <h1>Profil de remboursement</h1>
                <div #profileChartContainer></div>
            </div>
            <div>
                <h1>Distribution des coûts et des amortissements</h1>
                <div #pieChartContainer></div>
            </div>
        </div>`,
    styles: ['.axis { font-size: 20px; };'],
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./simulation-graph.component.scss']
})

export class SimulationGraphComponent {

    protected amountTypes = {
        amortizations: {
            display: 'AMORTISSEMENT',
            sumOf: ['amortizations'],
            color: (c) => this.hexToRGB(c, '99')
        },
        interests: {
            display: 'INTERETS',
            sumOf: ['interests', 'preamortizations'],
            color: (c) => this.hexToRGB(c, 'CC')
        },
        insurances: {
            display: 'ASSURANCE',
            sumOf: ['insurances'],
            color: (c) => this.hexToRGB(c, 'FF')
        }
    };

    constructor() {
    }

    private range(start: number, end?: number): number[] {
        if (!end) {
            end = start;
            start = 0;
        }
        return Array.from({ length: end - start }, (_, i) => start + i);
    }

    protected toFixed(num: number): string {
        return parseFloat(num.toFixed(2)).toString();
    }

    private drawSticker(root: any, length: number, pointingLeft: boolean) {
        root.append('path')
            .attr('transform', `rotate(${pointingLeft ? -90 : 90}) translate(0, 5)`)
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(50));

        const width = 14 + length * 8;

        root.append('rect')
            .attr('x', pointingLeft ? 5 : -(width + 5))
            .attr('y', -10)
            .attr('height', 20)
            .attr('width', width)
            .attr('rx', 5);

        return root.append('text')
            .attr('font-family', 'Roboto')
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('fill', 'white')
            .attr('x', (pointingLeft ? 1 : -1) * (width / 2 + 5));
    }

    protected drawXAxis(graph: any, maxDurationMonths: number, width: number, height: number) {
        const x = d3.scaleBand()
            .rangeRound([0, width])
            .align(0.1)
            .domain(this.range(maxDurationMonths));

        const xAxis = graph.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickValues([
                0,
                ...this.range(Math.floor((maxDurationMonths - 10) / 24)).map(v => 24 * (v + 1)),
                maxDurationMonths - 1
            ]).tickSizeOuter(0));

        xAxis.selectAll('text')
            .attr('font-family', 'Roboto')
            .attr('fill', '#000');

        xAxis.selectAll('line,path')
            .attr('stroke', '#000');

        xAxis.append('text')
            .attr('x', width / 2)
            .attr('y', 45)
            .attr('fill', '#000')
            .attr('font-family', 'Roboto')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('font-size', '20px')
            .text('Mois');

        return x;
    }

    protected drawYAxis(graph: any, maxAmount: number, height: number, eventsHeight: number) {
        const y = d3.scaleLinear()
            .rangeRound([height, eventsHeight])
            .domain([0, maxAmount]);

        const yAxis = graph.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(y).ticks(10));

        yAxis.selectAll('text')
            .attr('fill', '#000')
            .attr('font-family', 'Roboto');

        yAxis.selectAll('line,path')
            .attr('stroke', '#000');

        yAxis.append('text')
            .attr('x', -60)
            .attr('y', - 30)
            .attr('fill', '#000')
            .attr('font-family', 'Roboto')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'start')
            .attr('font-size', '20px')
            .text('Mensualité (euros)');

        return y;
    }

    protected drawLimits(graph: any, x: any, y: any, maxDurationMonths: number, debtLimitAmount: number, debtLimitPercentage: number) {
        const limitsContainer = graph.append('g');

        if (debtLimitAmount && debtLimitPercentage) {
            limitsContainer.append('line')
                .style('stroke-width', '1px')
                .style('stroke', 'black')
                .style('stroke-dasharray', '5,5')
                .attr('x1', x(0))
                .attr('y1', y(debtLimitAmount))
                .attr('x2', x(maxDurationMonths - 1))
                .attr('y2', y(debtLimitAmount));

            limitsContainer.append('text')
                .attr('font-family', 'Roboto')
                .attr('font-size', '16px')
                .attr('text-anchor', 'start')
                .attr('dominant-baseline', 'central')
                .attr('fill', 'black')
                .attr('x', x(maxDurationMonths - 1) + 10)
                .attr('y', y(debtLimitAmount))
                .text(debtLimitPercentage + '%');
        }
    }

    protected drawData(graph: any, x: any, y: any, loansView: any[]) {
        // loan container
        const loanNodes = graph.append('g')
            .selectAll('g')
            .data(loansView)
            .enter().append('g');

        // (loan, amountName) container
        const loanAmountNodes = loanNodes.selectAll('g')
            .data(d => d.amounts)
            .enter().append('g')
            .attr('fill', d => this.amountTypes[d.amountName].color(d.loan.color));

        // data point container
        const dataNodes = loanAmountNodes.selectAll('rect')
            .data(d => d.data)
            .enter().append('rect')
            .attr('x', d => x(d.month))
            .attr('y', d => y(d.offset + d.value))
            .attr('height', d => y(d.offset) - y(d.offset + d.value))
            .attr('width', x.bandwidth());

        // Commented as this produce an issue in ther PDF generation
        // animation of datapoints at start
        // dataNodes.attr('opacity', '0')
        //    .transition()
        //    .delay(d => 5 * d.month)
        //    .attr('opacity', '1');
    }

    protected drawEvents(graph: any, x: any, maxDurationMonths: number, height: number, eventsHeight: number, eventsView: any) {
        this.range(maxDurationMonths).forEach(month => {
            const container = graph.append('g')
                .attr('transform', `translate(${x(month) + x.bandwidth() / 2}, ${eventsHeight / 2 - 5})`);

            if (eventsView.releasedAmounts[month] !== '0') {
                container.append('path')
                    .attr('fill', 'green')
                    .attr('d', d3.symbol().type(d3.symbolCircle).size(50));

                container.append('line')
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('y1', height - eventsHeight / 2 + 5)
                    .attr('y2', 0)
                    .style('stroke-dasharray', '1,3')
                    .style('stroke-width', '1px')
                    .style('stroke-opacity', '0.5')
                    .style('stroke', 'green');
            }

            if (eventsView.reimbursedAmounts[month].length !== 0) {
                container.append('path')
                    .attr('fill', eventsView.reimbursedAmounts[month][0].color)
                    .attr('d', d3.symbol().type(d3.symbolCircle).size(50));

                container.append('line')
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('y1', height - eventsHeight / 2 + 5)
                    .attr('y2', 0)
                    .style('stroke-dasharray', '1,3')
                    .style('stroke-width', '1px')
                    .style('stroke-opacity', '0.5')
                    .style('stroke', eventsView.reimbursedAmounts[month][0].color);
            }
        });
    }

    private createEventsOverlay(highlightOverlay: any, x: any, eventsHeight: number, eventsView: any) {
        const container = highlightOverlay.append('g')
            .attr('transform', `translate(0, ${eventsHeight / 2 - 5})`);

        const releasedAmountsContainer = container.append('g')
            .attr('fill', 'green');

        const releasedPrefix = 'Déblocage: ';

        const releasedAmountText = this.drawSticker(
            releasedAmountsContainer,
            releasedPrefix.length + Math.max(...eventsView.releasedAmounts.map(v => v.length + 2)),
            true
        );

        const reimbursedAmountsContainer = container.append('g')
            .attr('fill', 'red');

        const reimbursedPrefix = 'Remboursement prêt relais: ';

        const reimbursedAmountText = this.drawSticker(
            reimbursedAmountsContainer,
            reimbursedPrefix.length + Math.max(...eventsView.reimbursedAmounts.map(
                v => v.length !== 0 ? v[0].amount.length + 2 : 0
            )),
            true
        );

        return {
            update: (month) => {
                const releasedAmount = eventsView.releasedAmounts[month];
                if (releasedAmount !== '0') {
                    releasedAmountText.text(`${releasedPrefix} +${releasedAmount}€`);
                    releasedAmountsContainer
                        .attr('transform', `translate(${
                            x(month) + x.bandwidth() / 2
                            }, 0)`)
                        .attr('opacity', 1);
                } else {
                    releasedAmountsContainer.attr('opacity', 0);
                }
                const reimbursedAmount = eventsView.reimbursedAmounts[month];
                if (reimbursedAmount.length !== 0) {
                    reimbursedAmountText.text(`${reimbursedPrefix} -${reimbursedAmount[0].amount}€`);
                    reimbursedAmountsContainer
                        .attr('transform', `translate(${
                            x(month) + x.bandwidth() / 2
                            }, 0)`)
                        .attr('fill', reimbursedAmount[0].color)
                        .attr('opacity', 1);
                } else {
                    reimbursedAmountsContainer.attr('opacity', 0);
                }
            }
        };
    }

    private drawLoanLegend(graph: any, x: any, y: any, idx: number, loanView: any) {
        const loanLegendContainer = graph.append('g');

        const eligibleAmounts = Object.keys(this.amountTypes).filter(
            amountName => loanView.loan[amountName] !== null
        );

        eligibleAmounts.reverse().forEach(
            (eligibleAmount, listIdx) => {
                const actualIdx = eligibleAmounts.length - listIdx - 1;
                const amountType = this.amountTypes[eligibleAmount];

                loanLegendContainer.append('rect')
                    .attr('x', 130 + (110 * idx))
                    .attr('y', -40 + 10 * actualIdx)
                    .attr('height', 20)
                    .attr('width', 100)
                    .attr('rx', 5)
                    .attr('fill', amountType.color(loanView.loan.color));

                let textDisplay = amountType.display;
                if (loanView.loan.type === Loan.TypeEnum.SmoothableCharge) {
                    if (chargesTypeShortList.includes(loanView.loan.loan_name) || loansTypeShortList.includes(loanView.loan.loan_name)) {
                      textDisplay = loanView.loan.loan_name
                    }
                    else {
                      textDisplay = ChargeTypeMapShort.toString(loanView.loan.loan_name)
                    }
                }

                loanLegendContainer.append('text')
                    .attr('font-family', 'Roboto')
                    .attr('font-size', '8px')
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('fill', 'white')
                    .attr('x', 180 + (110 * idx))
                    .attr('y', -25 + 10 * actualIdx)
                    .text(textDisplay);
            }
        );

        loanLegendContainer.append('rect')
            .attr('x', 130 + (110 * idx))
            .attr('y', -50)
            .attr('height', 20)
            .attr('width', 100)
            .attr('rx', 5)
            .attr('fill', loanView.loan.color);

        loanLegendContainer.append('text')
            .attr('font-family', 'Roboto')
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('fill', 'white')
            .attr('x', 180 + (110 * idx))
            .attr('y', -40)
            .text(this.loanViewToHuman(loanView.loan));
    }

    protected drawLegend(graph: any, x: any, y: any, loansView: any[]) {
        loansView.forEach((loanView, idx) => this.drawLoanLegend(graph, x, y, idx, loanView));
    }

    private createGlobalValuesOverlay(highlightOverlay: any, x: any, y: any, maxDurationMonths: number, loansView: any[]) {
        const height = y(0);

        const horizontalContainer = highlightOverlay.append('g');

        horizontalContainer.append('line')
            .attr('x1', 0)
            .attr('x2', x(maxDurationMonths - 1))
            .attr('y1', 0)
            .attr('y2', 0)
            .style('stroke-dasharray', '5,5')
            .style('stroke-width', '1px')
            .style('stroke', 'black');

        const maxValuePerMonth = (() => {
            const lastLoan = loansView[loansView.length - 1];
            const lastAmountData = lastLoan.amounts[lastLoan.amounts.length - 1].data;
            return this.range(maxDurationMonths).map(
                month => this.toFixed(lastAmountData[month].offset + lastAmountData[month].value)
            );
        })();

        const maxAmountText = this.drawSticker(horizontalContainer, Math.max(...maxValuePerMonth.map(v => v.length)), false);

        const verticalContainer = highlightOverlay.append('g');

        verticalContainer.append('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height)
            .style('stroke-dasharray', '5,5')
            .style('stroke-width', '1px')
            .style('stroke', 'black');

        verticalContainer.append('path')
            .attr('transform', `translate(0, ${height + 5})`)
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(50));

        verticalContainer.append('rect')
            .attr('x', -20)
            .attr('y', height + 5)
            .attr('height', 20)
            .attr('width', 40)
            .attr('rx', 5);

        const monthText = verticalContainer.append('text')
            .attr('font-family', 'Roboto')
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('x', 0)
            .attr('y', height + 22)
            .text('0');

        return {
            update: (month) => {
                verticalContainer.attr('transform', `translate(${x(month) + x.bandwidth() / 2}, 0)`);
                monthText.text(month);
                horizontalContainer.attr('transform', `translate(0, ${y(maxValuePerMonth[month])})`);
                maxAmountText.text(maxValuePerMonth[month]);
            }
        };
    }

    private createLoanOverlay(root: any, x: any, y: any, maxDurationMonths: number, loanView: any) {
        const container = root.append('g')
            .attr('fill', loanView.loan.color);

        const valuePerMonth = (() => {
            return this.range(maxDurationMonths).map(
                month => this.toFixed(loanView.amounts.map(
                    amount => amount.data[month].value
                ).reduce((a, b) => a + b, 0))
            );
        })();

        const offsetPerMonth = (() => {
            return this.range(maxDurationMonths).map(
                month => {
                    const lastAmountData = loanView.amounts[loanView.amounts.length - 1].data[month];
                    return lastAmountData.value + lastAmountData.offset;
                }
            );
        })();

        const loanValueText = this.drawSticker(container, Math.max(...valuePerMonth.map(v => v.length)), true);

        return {
            update: (month) => {
                const value = valuePerMonth[month];
                if (value !== '0') {
                    loanValueText.text(value);
                    container
                        .attr('transform', `translate(${
                            x(month) + x.bandwidth() / 2
                            },${
                            y(offsetPerMonth[month])
                            })`)
                        .attr('opacity', 1);
                } else {
                    container.attr('opacity', 0);
                }
            }
        };
    }

    private createLoanValuesOverlay(highlightOverlay: any, x: any, y: any, maxDurationMonths: number, loansView: any[]) {
        const loanValueHighlights = loansView.map(
            vloan => this.createLoanOverlay(highlightOverlay, x, y, maxDurationMonths, vloan)
        );

        return {
            update: (month) => {
                loanValueHighlights.forEach(lvh => lvh.update(month));
            }
        };
    }

    protected drawOverlay(graph: any, x: any, y: any, maxDurationMonths: number, eventsHeight: number, loansView: any[], eventsView: any) {
        // highlight layer on top of loan bars
        const highlightOverlay = graph.append('g')
            .attr('opacity', 0)
            .on('mouseout', () => highlightOverlay.attr('opacity', '0'))
            .on('mouseover', () => highlightOverlay.attr('opacity', '1'));


        const globalValuesOverlay = this.createGlobalValuesOverlay(highlightOverlay, x, y, maxDurationMonths, loansView);
        const loanValuesOverlay = this.createLoanValuesOverlay(highlightOverlay, x, y, maxDurationMonths, loansView);
        const eventsOverlay = this.createEventsOverlay(highlightOverlay, x, eventsHeight, eventsView);

        const highlightZones = highlightOverlay.append('g')
            .selectAll('rect')
            .data(this.range(maxDurationMonths))
            .enter().append('rect')
            .attr('x', d => x(d))
            .attr('y', 0)
            .attr('height', y(0))
            .attr('width', x.bandwidth())
            .attr('opacity', '0')
            .on('mouseover', d => {
                globalValuesOverlay.update(d);
                loanValuesOverlay.update(d);
                eventsOverlay.update(d);
            });
    }


    protected computeEventsView(loansNormalized, maxDurationMonths) {
        const bridgeLoans = loansNormalized.filter(l => l.type === Loan.TypeEnum.BridgeLoan);
        const reimbursedAmounts = this.range(maxDurationMonths).map(month => {
            return bridgeLoans.flatMap(
                l => l.amortizations[month] ? [{ color: l.color.base, amount: this.toFixed(l.amortizations[month]) }] : []
            );
        });

        bridgeLoans.forEach(l => l.amortizations = null);

        const releasedAmounts = this.range(maxDurationMonths).map(month => {
            return this.toFixed(loansNormalized.map(
                l => l.released_amounts[month] || 0
            ).reduce((a, b) => a + b, 0));
        });

        return { releasedAmounts, reimbursedAmounts };
    }

    protected computeLoansView(loansNormalized, maxDurationMonths) {
        // Re-organization of data for displaying
        // [ { loan, amounts: [ { loan, amountName, data: [ { month, loan, amountName, value, offset } ] } ] } ]
        const loansView = loansNormalized.map(loan => {
            return {
                loan,
                amounts: Object.keys(this.amountTypes).filter(
                    amountName => loan[amountName] !== null
                ).map(amountName => {
                    return {
                        loan,
                        amountName,
                        data: this.range(maxDurationMonths).map(month => {
                            return {
                                loan,
                                amountName,
                                month,
                                value: loan[amountName][month],
                                offset: null
                            };
                        })
                    };
                })
            };
        });

        let maxAmount = 0;

        // Compute offsets
        this.range(maxDurationMonths).map(month => {
            let offset = 0;
            loansView.forEach(loan => {
                loan.amounts.forEach(amount => {
                    amount.data[month].offset = offset;
                    offset += amount.data[month].value;
                    maxAmount = Math.max(maxAmount, offset);
                });
            });
        });

        return { loansView, maxAmount };
    }

    private hexToRGB(hex: string, alpha: string) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const a = parseInt(alpha, 16) / 255;

        return `rgb(${
            Math.floor((1 - a) * 255 + a * r)
            },${
            Math.floor((1 - a) * 255 + a * g)
            },${
            Math.floor((1 - a) * 255 + a * b)
            })`;
    }

    private addvector(a ,b){
        return a.map((e, i) => e + b[i]);
    }

    protected loanNormalizer(loan) {

        // Sum all insurances of the loan into a single list
        let mergedInsurances = [];
        if (loan && loan.insurances && loan.insurances[0] && loan.insurances[0].monthly_values) {
            (mergedInsurances = []).length = loan.insurances[0].monthly_values.length; mergedInsurances.fill(0);
            loan.insurances.forEach(insurance => {
                mergedInsurances = this.addvector(mergedInsurances, insurance.monthly_values);
            });
        }

        const normalizedLoan = {
            ...loan,
            insurances: mergedInsurances,
            firstPaymentMonth: loan.duration_months + 1,
            lastPaymentMonth: 0
        };

        for (const [amountName, amountType] of Object.entries(this.amountTypes)) {
            // Refining first and last month of payment
            normalizedLoan[amountName] = this.range(Math.max(...amountType.sumOf.map(s => normalizedLoan[s].length))).map(
                i => amountType.sumOf.map(s => normalizedLoan[s][i] || 0).reduce((a, b) => a + b, 0)
            );

            const arr = normalizedLoan[amountName];
            arr.unshift(0);

            const startIndex = arr.findIndex(x => x > 0);
            const endIndex = arr.slice().reverse().findIndex(x => x > 0);

            if (startIndex === -1 || endIndex === -1) {
                normalizedLoan[amountName] = null;
            } else {
                normalizedLoan.firstPaymentMonth = Math.min(startIndex, normalizedLoan.firstPaymentMonth);
                normalizedLoan.lastPaymentMonth = Math.max(arr.length - 1 - endIndex, normalizedLoan.lastPaymentMonth);
            }
        }
        return normalizedLoan;
    }

    protected normalizeLoans(loans) {
        const loansNormalized = loans.map(loan => this.loanNormalizer(loan));

        // Get the maximum duration across all loans
        const maxDurationMonths = Math.max(...loansNormalized.map(loan => loan.lastPaymentMonth)) + 1;

        // Normalize data
        loansNormalized.forEach(loan => {
            for (const amountName of Object.keys(this.amountTypes)) {
                // Normalize data array
                const arr = loan[amountName];
                if (arr) {
                    this.range(maxDurationMonths - arr.length).forEach(
                        i => arr.push(0)
                    );
                }
            }
        });

        // Sort loans, first by the firstPaymentMonth, then by the durationMonths
        loansNormalized.sort((a, b) => {
            const [valA, valB] = [a, b].map(loan => {
                return loan.type !== Loan.TypeEnum.FreeLoan ?
                    [0, -loan.lastPaymentMonth, 0] :
                    [1, loan.firstPaymentMonth, loan.lastPaymentMonth];
            });
            return (
                valA[0] < valB[0] || (
                    valA[0] === valB[0] && (
                        valA[1] < valB[1] || (
                            valA[1] === valB[1] && valA[2] < valB[2]
                        )
                    )
                )
            ) ? -1 : 1;
        });

        const colormap = palette(['tol-rainbow'], loans.length);
        return {
            loansNormalized: loansNormalized.map((loan, idx) => {
                return {
                    ...loan,
                    color: `#${colormap[idx]}`
                };
            }),
            maxDurationMonths
        };
    }

    protected loanViewToHuman(loanView) {
        switch (loanView.type) {
            case Loan.TypeEnum.FreeLoan:
                return `Prêt ${loanView.yearly_rate}%`;
            case Loan.TypeEnum.PtzLoan:
                return 'PTZ';
            case Loan.TypeEnum.SmoothableCharge:
                return 'Charge';
            case Loan.TypeEnum.BridgeLoan:
                return `Relais ${loanView.yearly_rate}%`;
            case Loan.TypeEnum.BossLoan:
                return 'Patronal';
        }
    }
}
