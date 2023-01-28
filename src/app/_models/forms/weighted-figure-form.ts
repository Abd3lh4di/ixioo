import { FormGroup, FormControl } from '@angular/forms';

export class WeightedPositiveFigureForm extends FormGroup {
  constructor() {
    super({
      figure: new FormControl(0),
      weight: new FormControl(100)
    });
  }
}

export class WeightedFigureForm extends FormGroup {
  constructor() {
    super({
      figure: new FormControl(0),
      weight: new FormControl(100)
    });
  }
}