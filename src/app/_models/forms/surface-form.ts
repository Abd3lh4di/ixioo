import { FormControl, FormGroup } from '@angular/forms';

export class SurfacesForm extends FormGroup {
    constructor() {
        super({
            surface: new FormControl(),
            additional_surface: new FormControl(),
            land_surface: new FormControl(),
        })
    }
}
