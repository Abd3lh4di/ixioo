import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { merge } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { CallsForFundsDialogComponent } from 'src/app/utils/calls-for-funds/calls-for-funds.component';
import { InseeCodeToCounty } from 'src/app/utils/insee-code-to-county';
import { NotaryFeesState, NotaryFeesResponse } from 'src/app/_api';
import { HouseConstructionProjectForm } from 'src/app/_models/forms/project-form';
import { NotaryFeesService } from 'src/app/_services/notary-fees.service';
import { Project } from '../project';

@Component({
  selector: 'app-file-creation-project-houseconstruction',
  templateUrl: './file-creation-project-houseconstruction.component.html',
  styleUrls: ['../file-creation-project.component.scss', '../file-creation-project.component.small.scss']
})
export class FileCreationProjectHouseconstructionComponent extends Project implements OnInit {

  @Input() houseConstruction: HouseConstructionProjectForm;

  get expenses() { return this.houseConstruction.controls.expenses as FormGroup; }
  get land_price() { return this.expenses.controls.land_price; }
  get fees() { return this.expenses.controls.fees as FormGroup; }
  get notaryFees() { return this.fees.controls.notary_fees; }

  get administrative_information() { return this.houseConstruction.controls.administrative_information as FormGroup; }

  get address() { return this.administrative_information.controls.address as FormGroup; }
  get inseeCode() { return this.address.controls.insee_code; }

  constructor(private notaryService: NotaryFeesService, public dialog: MatDialog) { super(); }

  ngOnInit(): void {
    merge(
      this.land_price.valueChanges,
      this.inseeCode.valueChanges,
    ).pipe(
      debounceTime(200),
      filter(_ => this.inseeCode.value ),
      filter(_ => this.land_price.value ),
      map(_ => {
        this.notaryService.computeFees({
          price: this.land_price.value,
          state: NotaryFeesState.Land,
          department: InseeCodeToCounty.ConvertToCounty(this.inseeCode.value)
        }).pipe(take(1)).subscribe( (res: NotaryFeesResponse) => {
          this.notaryFees.setValue(res.data.fees);
        })
      })
    ).subscribe();
  }


  createCallsForFunds() {
    const callsForFunds = this.houseConstruction.controls.calls_for_funds;
    const dialogRef = this.dialog.open(CallsForFundsDialogComponent, { height: '80%', width: '60%', data: { callsForFunds } });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        console.log(data)
        this.houseConstruction.get('calls_for_funds').patchValue(data);
      }
    });
  }

}
