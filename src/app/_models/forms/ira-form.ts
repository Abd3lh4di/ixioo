import { FormControl, FormGroup, Validators } from '@angular/forms';


export class IraForm extends FormGroup {
    constructor() {
        super({
            type: new FormControl('LEGAL', Validators.required),
            value: new FormControl(null, Validators.required),
        });
    }
}