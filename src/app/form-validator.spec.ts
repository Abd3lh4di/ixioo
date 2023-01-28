import { FormControl } from '@angular/forms';
import { CustomFormValidator } from './form-validator';

describe('CustomFormValidator', () => {

    it('should validate integer by returning null', () => {
        expect(CustomFormValidator.integer(new FormControl('123456'))).toEqual(null);
        expect(CustomFormValidator.integer(new FormControl(123456))).toEqual(null);
    });

    it('should return null if empty', () => {
        expect(CustomFormValidator.integer(new FormControl(''))).toEqual(null);
        expect(CustomFormValidator.integer(new FormControl(null))).toEqual(null);
    });

    it('should return not integer', () => {
        expect(CustomFormValidator.integer(new FormControl('a'))).toEqual({ notInteger: true });
        expect(CustomFormValidator.integer(new FormControl(12.3))).toEqual({ notInteger: true });
        expect(CustomFormValidator.integer(new FormControl('12.3'))).toEqual({ notInteger: true });
    });

});
