import { FormControl, FormGroup, Validators } from '@angular/forms';

export class GuarantyForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(null),
            value: new FormControl(null),
        });
    }
}