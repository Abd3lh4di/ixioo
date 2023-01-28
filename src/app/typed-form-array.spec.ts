import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TypedFormArray } from './typed-form-array';

describe('TypedFormArray', () => {
    let typedFormArray: TypedFormArray;
    beforeEach(() => {
        const fb = new FormBuilder();
        typedFormArray = new TypedFormArray(() => fb.group({
            hello: new FormControl('World'),
            foo: new FormControl('Bar'),
        }));
    });

    it('should create an instance', () => {
        expect(typedFormArray).toBeTruthy();
    });

    it('should set a new value', () => {
        typedFormArray.setValue([{
            hello: 'patchedWorld',
            foo: 'patchedBar'
        }, {
            hello: 'secondPatchedWorld',
            foo: 'secondPatchedBar'
        }]);
        expect(typedFormArray.length).toEqual(2);
        expect(typedFormArray.at(0).get('hello').value).toEqual('patchedWorld');
        expect(typedFormArray.at(0).get('foo').value).toEqual('patchedBar');
        expect(typedFormArray.at(1).get('hello').value).toEqual('secondPatchedWorld');
        expect(typedFormArray.at(1).get('foo').value).toEqual('secondPatchedBar');
    });

    it('should throw when setting incomplete new value', () => {
        expect(() => {
            typedFormArray.setValue([{hello: 'secondPatchedWorld'}]);
        }).toThrow();
    });

    it('should push a new value', () => {
        typedFormArray.pushValue();
        expect(typedFormArray.length).toEqual(1);
        expect(typedFormArray.at(0).get('hello').value).toEqual('World');
        expect(typedFormArray.at(0).get('foo').value).toEqual('Bar');

        typedFormArray.pushValue({
            hello: 'anotherWorld',
            foo: 'anotherBar'
        });
        expect(typedFormArray.length).toEqual(2);
        expect(typedFormArray.at(0).get('hello').value).toEqual('World');
        expect(typedFormArray.at(0).get('foo').value).toEqual('Bar');
        expect(typedFormArray.at(1).get('hello').value).toEqual('anotherWorld');
        expect(typedFormArray.at(1).get('foo').value).toEqual('anotherBar');
    });

    it('should patch a value', () => {
        typedFormArray.patchValue([{
            hello: 'patchedWorld',
            foo: 'patchedBar'
        }, {
            hello: 'secondPatchedWorld'
        }]);
        expect(typedFormArray.length).toEqual(2);
        expect(typedFormArray.at(0).get('hello').value).toEqual('patchedWorld');
        expect(typedFormArray.at(0).get('foo').value).toEqual('patchedBar');
        expect(typedFormArray.at(1).get('hello').value).toEqual('secondPatchedWorld');

        typedFormArray.patchValue([{
            hello: 'ppp',
            foo: 'fff'
        }, {
            hello: 'aaa'
        }]);
        expect(typedFormArray.length).toEqual(2);
        expect(typedFormArray.at(0).get('hello').value).toEqual('ppp');
        expect(typedFormArray.at(0).get('foo').value).toEqual('fff');
        expect(typedFormArray.at(1).get('hello').value).toEqual('aaa');
    });

});
