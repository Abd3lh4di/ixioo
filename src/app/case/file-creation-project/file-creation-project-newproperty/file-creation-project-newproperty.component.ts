import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { merge } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { CallsForFundsDialogComponent } from 'src/app/utils/calls-for-funds/calls-for-funds.component';
import { InseeCodeToCounty } from 'src/app/utils/insee-code-to-county';
import { NotaryFeesState, NotaryFeesResponse } from 'src/app/_api';
import { NewPropertyProjectForm } from 'src/app/_models/forms/project-form';
import { NotaryFeesService } from 'src/app/_services/notary-fees.service';
import { Project } from '../project';

@Component({
  selector: 'app-file-creation-project-newproperty',
  templateUrl: './file-creation-project-newproperty.component.html',
  styleUrls: ['../file-creation-project.component.scss', '../file-creation-project.component.small.scss']
})
export class FileCreationProjectNewpropertyComponent extends Project implements OnInit {

  @Input() newProperty: NewPropertyProjectForm;

  get expenses() { return this.newProperty.controls.expenses as FormGroup; }
  get price() { return this.expenses.controls.price; }
  get fees() { return this.expenses.controls.fees as FormGroup; }
  get notaryFees() { return this.fees.controls.notary_fees; }

  get administrative_information() { return this.newProperty.controls.administrative_information as FormGroup; }

  get address() { return this.administrative_information.controls.address as FormGroup; }
  get inseeCode() { return this.address.controls.insee_code; }

  constructor(private notaryService: NotaryFeesService, public dialog: MatDialog) { super(); }

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

  createCallsForFunds() {
    const callsForFunds = this.newProperty.controls.calls_for_funds;
    const dialogRef = this.dialog.open(CallsForFundsDialogComponent, { height: '80%', width: '60%', data: { callsForFunds } });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        console.log(data)
        this.newProperty.get('calls_for_funds').patchValue(data);
      }
    });
  }

}
