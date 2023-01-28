import { Simulation } from 'src/app/_api';

export interface ResultsComponent {
    simulationData: Simulation;
    getCharts();
    popupProfileChart();
    popupLoanBurdenSummary();
}
