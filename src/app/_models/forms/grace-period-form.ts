import { FormControl, FormGroup, Validators } from '@angular/forms';


export class GracePeriodForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl(null),
            length: new FormControl(null)
        });
    }
}