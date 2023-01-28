import { FormGroup, FormControl } from '@angular/forms';

export class ResourceMetaForm extends FormGroup {
  constructor() {
    super({
        etag: new FormControl(null),
        created_at: new FormControl(null),
        last_updated_at: new FormControl(null),
    });
  }
}
