import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GrandiozProfileForm } from 'src/app/_models/forms/profiles-form';

export interface GrandiozDialogData {
  custom_data :{
    type: 'GRANDIOZ',
    initial_monthly_payment: 0
  }
  objective: string
}

@Component({
  selector: 'app-file-creation-fundings-grandioz-profile-dialog',
  templateUrl: './file-creation-fundings-grandioz-profile-dialog.component.html'
})
export class FileCreationFundingsGrandiozProfileDialogComponent {

  constructor(public dialogRef: MatDialogRef<FileCreationFundingsGrandiozProfileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public profile: GrandiozDialogData ) {
  }

  get objective() { return this.profile.objective; }
  get customData() { return this.profile.custom_data; }
  get initialMonthlyPayment() { return this.customData.initial_monthly_payment; }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isValid() {
    if (this.objective === 'MINIMIZE_COST' || this.objective === 'MAXIMIZE_BUDGET') {
      return (this.initialMonthlyPayment !== undefined && this.initialMonthlyPayment !== null && this.initialMonthlyPayment !== 0);
    }
    return true;
  }

}