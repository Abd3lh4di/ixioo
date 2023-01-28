import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MonthlyVaryingProfileForm } from 'src/app/_models/forms/profiles-form';

export interface MonthlyDialogData {
  custom_data: {
    type: 'MONTHLY',
    initial_monthly_payment: 0,
    variation: number
  },
  objective: string
}

@Component({
  selector: 'app-file-creation-fundings-monthly-profile-dialog',
  templateUrl: './file-creation-fundings-monthly-profile-dialog.component.html'
})
export class FileCreationFundingsMonthlyProfileDialogComponent {

  constructor(public dialogRef: MatDialogRef<FileCreationFundingsMonthlyProfileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public profile: MonthlyDialogData ) {
  }

  get objective() { return this.profile.objective; }
  get customData() { return this.profile.custom_data; }
  get initialMonthlyPayment() { return this.customData.initial_monthly_payment; }
  get variation() { return this.customData.variation; }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isValid() {
    if (this.objective === 'MINIMIZE_COST' || this.objective === 'MAXIMIZE_BUDGET') {
      return (this.variation !== undefined && this.variation !== null && this.variation !== 0) &&
             (this.initialMonthlyPayment !== undefined && this.initialMonthlyPayment !== null && this.initialMonthlyPayment !== 0);
    }
    return (this.variation !== undefined && this.variation !== null && this.variation !== 0);
  }

}
