import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TypedFormArray } from 'src/app/typed-form-array';
import { BurdensType, LoanFutureType, LoansType } from 'src/app/utils/strings';
import { FileCreationBurdensDialogComponent } from './file-creation-burdens-dialog/file-creation-burdens-dialog.component';

@Component({
  selector: 'app-file-creation-burdens',
  templateUrl: './file-creation-burdens.component.html',
  styleUrls: ['./file-creation-burdens.component.scss',
              './file-creation-burdens.component.small.scss']
})
export class FileCreationBurdensComponent implements OnInit {

  @Input() finance: FormGroup;

  get charges() { return this.finance.controls.charges as TypedFormArray; }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addFinalCharge() {
    const dialogRef = this.dialog.open(FileCreationBurdensDialogComponent);
    dialogRef.afterClosed().subscribe(type => {
      if (type) {
        this.charges.pushValue({ type, continue_after_project: false });
      }
    });
  }

  addOnGoingCharge() {
    const dialogRef = this.dialog.open(FileCreationBurdensDialogComponent);
    dialogRef.afterClosed().subscribe(type => {
      if (type) {
        this.charges.pushValue({ type, continue_after_project: true });
      }
    });
  }
  removeUsual(i) {
    this.charges.removeAt(i);
  }

  burdenToString(type) {
    return BurdensType.toString(type);
  }
}
