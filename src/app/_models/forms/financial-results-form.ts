import { FormGroup, FormControl } from '@angular/forms';
import { WeightedFigureForm, WeightedPositiveFigureForm } from './weighted-figure-form';


export class FinancialResultsForm extends FormGroup {
  constructor() {
    super({
      // Profits is CA in French
      // Turnover is benefices in French
      profits_Nminus1: new WeightedFigureForm(),
      profits_Nminus2: new WeightedFigureForm(),
      profits_Nminus3: new WeightedFigureForm(),
      turnover_Nminus1: new WeightedPositiveFigureForm(),
      turnover_Nminus2: new WeightedPositiveFigureForm(),
      turnover_Nminus3: new WeightedPositiveFigureForm(),
    });
  }
}

