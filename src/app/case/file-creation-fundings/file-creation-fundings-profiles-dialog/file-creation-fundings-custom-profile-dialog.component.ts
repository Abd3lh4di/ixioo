import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomProfileForm, StepsForm } from 'src/app/_models/forms/profiles-form';

export interface CustomDialogData {
  custom_data : {
    type: 'CUSTOM',
    steps: []
  };
  objective: string;
}



@Component({
  selector: 'app-file-creation-fundings-custom-profile-dialog',
  templateUrl: './file-creation-fundings-custom-profile-dialog.component.html'
})
export class FileCreationFundingsCustomProfileDialogComponent implements OnInit {

  profileForm: CustomProfileForm = new CustomProfileForm();
  get steps() { return (this.profileForm.get('steps') as StepsForm); }

  constructor(public dialogRef: MatDialogRef<FileCreationFundingsCustomProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public profile: CustomDialogData ) {
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;

    if(this.profile.custom_data.steps.length > 0) {
      this.profile.custom_data.steps.forEach(step => {
        this.steps.pushValue(step);
      });
      this.profileForm.patchValue(this.profile.custom_data);
    } else {
      this.addStep();
    }
  }

  addStep() {
    this.steps.pushValue();
  }
  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
