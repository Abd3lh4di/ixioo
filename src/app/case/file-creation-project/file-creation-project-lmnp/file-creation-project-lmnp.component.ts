import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { InseeCodeToCounty } from 'src/app/utils/insee-code-to-county';
import { TaxModeMap } from 'src/app/utils/strings';
import { AcquisitionNature, AcquisitionState, NotaryFeesResponse, NotaryFeesState } from 'src/app/_api';
import { LMNPProjectForm, PinelProjectForm } from 'src/app/_models/forms/project-form';
import { NotaryFeesService } from 'src/app/_services/notary-fees.service';
import { Project } from '../project';

@Component({
  selector: 'app-file-creation-project-lmnp',
  templateUrl: './file-creation-project-lmnp.component.html',
  styleUrls: ['../file-creation-project.component.scss', '../file-creation-project.component.small.scss']
})
export class FileCreationProjectLMNPComponent extends Project implements OnInit {

  @Input() lmnp: LMNPProjectForm;

  get property() { return this.lmnp.controls.property as FormGroup; }
  get administrative_information() { return this.property.controls.administrative_information as FormGroup; }

  get expenses() { return this.property.controls.expenses as FormGroup; }
  get price() { return this.expenses.controls.price; }
  get fees() { return this.expenses.controls.fees as FormGroup; }
  get notaryFees() { return this.fees.controls.notary_fees; }

  get address() { return this.administrative_information.controls.address as FormGroup; }
  get inseeCode() { return this.address.controls.insee_code; }

  constructor(private notaryService: NotaryFeesService) { super(); }

  ngOnInit(): void {
    merge(
      this.price.valueChanges,
      this.inseeCode.valueChanges,
    ).pipe(
      debounceTime(200),
      filter(_ => this.inseeCode.value ),
      filter(_ => this.price.value ),
      map(_ => {
        this.notaryService.computeFees({
          price: this.price.value,
          state: NotaryFeesState.New,
          department: InseeCodeToCounty.ConvertToCounty(this.inseeCode.value)
        }).pipe(take(1)).subscribe( (res: NotaryFeesResponse) => {
          this.notaryFees.setValue(res.data.fees);
        })
      })
    ).subscribe();
  }

  toTaxModeMap(taxMode) {
    return TaxModeMap.toString(taxMode);
  }

}
