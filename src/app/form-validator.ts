import { AbstractControl } from '@angular/forms';


export class CustomFormValidator {
    // Number only validation
    static integer(control: AbstractControl) {
        const val = control.value;
        if (val === null || val === '') {
            return null;
        }
        if ( (parseFloat(val) === parseInt(val, 10)) && !isNaN(val) ) {
            return null;
        }
        return { notInteger: true };
    }
}

