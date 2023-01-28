import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { TypedFormArray } from 'src/app/typed-form-array';
import { InseeCodeToCounty } from 'src/app/utils/insee-code-to-county';
import { NotaryFeesState, NotaryFeesResponse } from 'src/app/_api';
import { BalancingAdjustmentProjectForm, OldPropertyProjectForm } from 'src/app/_models/forms/project-form';
import { NotaryFeesService } from 'src/app/_services/notary-fees.service';
import { Project } from '../project';


@Component({
  selector: 'app-file-creation-project-balancing-adjustment',
  templateUrl: './file-creation-project-balancing-adjustment.component.html',
  styleUrls: ['./file-creation-project-balancing-adjustment.component.scss', '../file-creation-project.component.scss', '../file-creation-project.component.small.scss']
})
export class FileCreationProjectBalancingAdjustmentComponent extends Project implements OnInit {

  @Input() balancingAdjustment: BalancingAdjustmentProjectForm;

  get expenses() { return this.balancingAdjustment.controls.expenses as FormGroup; }
  get totalBalancingAdjustmentValue() { return this.expenses.controls.total_balancing_adjustment_value; }
  get fees() { return this.expenses.controls.fees as FormGroup; }
  get notaryFees() { return this.fees.controls.notary_fees; }

  get administrative_information() { return this.balancingAdjustment.controls.administrative_information as FormGroup; }

  get address() { return this.administrative_information.controls.address as FormGroup; }
  get inseeCode() { return this.address.controls.insee_code; }

  get undivided_persons() { return this.balancingAdjustment.controls.undivided_persons as TypedFormArray; }

  getUndividedPerson(i) { return this.undivided_persons.at(i) as FormGroup; }
  getContact(i) { return this.getUndividedPerson(i).controls.contact as FormGroup; }


  constructor(private notaryService: NotaryFeesService) { super(); }

  ngOnInit(): void {

    merge(
      this.totalBalancingAdjustmentValue.valueChanges,
      this.inseeCode.valueChanges,
    ).pipe(
      debounceTime(200),
      filter(_ => this.inseeCode.value ),
      filter(_ => this.totalBalancingAdjustmentValue.value ),
      map(_ => {
        this.notaryService.computeFees({
          price: this.totalBalancingAdjustmentValue.value,
          state: NotaryFeesState.Old,
          department: InseeCodeToCounty.ConvertToCounty(this.inseeCode.value)
        }).pipe(take(1)).subscribe( (res: NotaryFeesResponse) => {
          this.notaryFees.setValue(res.data.fees);
        })
      })
    ).subscribe();
  }

  addUndividedPerson() {
    this.undivided_persons.pushValue();
  }
  removeUndividedPerson(idx) {
    this.undivided_persons.removeAt(idx);
  }

}
