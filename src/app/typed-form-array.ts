import { FormArray, AbstractControl } from '@angular/forms';

export class TypedFormArray extends FormArray {
    constructor(private defaultControlFactory: () => AbstractControl) {
        super([]);
    }

    pushValue(value?: any, options: {onlySelf?: boolean, emitEvent?: boolean} = {}): AbstractControl {
        const newControls = this.defaultControlFactory();
        if (value) {
            newControls.patchValue(value, options);
        }
        this.push(newControls);
        return newControls;
    }

    setValue(value: any[], options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
        this.clear();
        value.forEach(_ => this.pushValue() );
        super.setValue(value, options);
    }

    patchValue(value: any[], options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
        for (let i = this.length; i < value.length; i++) {
            this.pushValue();
        }
        value.forEach((v, i) => this.at(i).patchValue(v, options));
    }
}
