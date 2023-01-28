import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { InseeCodeToCounty } from 'src/app/utils/insee-code-to-county';
import { AcquisitionNature, AcquisitionState, NotaryFeesResponse, NotaryFeesState } from 'src/app/_api';
import { LandProjectForm } from 'src/app/_models/forms/project-form';
import { NotaryFeesService } from 'src/app/_services/notary-fees.service';
import { Project } from '../project';

@Component({
  selector: 'app-file-creation-project-land',
  templateUrl: './file-creation-project-land.component.html',
  styleUrls: ['../file-creation-project.component.scss', '../file-creation-project.component.small.scss']
})
export class FileCreationProjectLandComponent extends Project implements OnInit {

  @Input() land: LandProjectForm;

  get expenses() { return this.land.controls.expenses as FormGroup; }
  get price() { return this.expenses.controls.price; }
  get fees() { return this.expenses.controls.fees as FormGroup; }
  get notaryFees() { return this.fees.controls.notary_fees; }

  get administrative_information() { return this.land.controls.administrative_information as FormGroup; }
  get nature() { return this.administrative_information.controls.nature; }
  get state() { return this.administrative_information.controls.state; }
  get address() { return this.administrative_information.controls.address as FormGroup; }
  get inseeCode() { return this.address.controls.insee_code; }

  constructor(private notaryService: NotaryFeesService) { super(); }

  ngOnInit(): void {
    this.nature.setValue(AcquisitionNature.Land);
    this.state.setValue(AcquisitionState.RawLand);
    this.nature.disable();
    this.state.disable();

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
          state: NotaryFeesState.Land,
          department: InseeCodeToCounty.ConvertToCounty(this.inseeCode.value)
        }).pipe(take(1)).subscribe( (res: NotaryFeesResponse) => {
          this.notaryFees.setValue(res.data.fees);
        })
      })
    ).subscribe();
  }

}
