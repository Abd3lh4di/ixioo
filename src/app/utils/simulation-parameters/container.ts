import { FormGroup, AbstractControl } from '@angular/forms';

export class Container {
    formGroup: FormGroup;
    get form() { return this.formGroup; }
    getValue(key: AbstractControl) {
        return (key && key.value) ? key.value : undefined;
    }
    getNumber(key: AbstractControl) {
        if (!key || !key.value) { return undefined; }
        return this.stringAsNumber(key.value);
    }
    stringAsNumber(value) {
        const numberDot = (typeof value === 'string') ? value.replace(/,/g, '.') : value;
        if ( isNaN(Number(numberDot)) ) { return value; }
        return Number(numberDot);
    }
    invalid() {
        this.formGroup.markAllAsTouched();
        return this.formGroup.invalid;
    }
    serialize() {
        return this.formGroup.getRawValue();
    }
}
