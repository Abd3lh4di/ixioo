import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CallsForFundsForm } from 'src/app/_models/forms/project-form';

@Component({
  selector: 'app-calls-for-funds',
  templateUrl: './calls-for-funds.component.html',
  styleUrls: ['./calls-for-funds.component.scss']
})
export class CallsForFundsDialogComponent {

  get type() { return this.data.callsForFunds.get('type'); }
  get calls() { return this.data.callsForFunds.get('calls') as TypedFormArray; }

  constructor(public dialogRef: MatDialogRef<CallsForFundsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { callsForFunds: FormGroup } ) {
  }


  addSlice() {
    this.calls.pushValue({
      date: 1,
      percentage: 0,
      reason: 'Déblocage ' + String(this.calls.controls.length + 1)
    });
  }
  removeSlice(index: number) {
    this.calls.removeAt(index);
    this.updateFirstSlice();
  }

  removeAll() {
    this.calls.clear();
    this.dialogRef.close();
  }

  totalPercentage()  {
    let total = 0;
    this.calls.controls.forEach((ctrl: FormGroup) => {
      total += Number(ctrl.controls.percentage.value);
    });
    return total;
  }

  updateFirstSlice() {
    let totalPercentage = 0;
    this.calls.controls.slice(1).forEach((ctrl: FormGroup) => {
      totalPercentage += Number(ctrl.controls.percentage.value);
    });
    const remainingPercentage = 100 - Number(totalPercentage.toFixed(2));
    this.calls.at(0).get('percentage').setValue(remainingPercentage.toFixed(2));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isValid() {
    if (this.totalPercentage() === 100) {
      return true;
    }
    return false;
  }

}
