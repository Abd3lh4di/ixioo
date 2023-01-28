import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IncomeType } from 'src/app/utils/strings';

@Component({
  selector: 'app-file-creation-revenue-dialog',
  templateUrl: './file-creation-revenue-dialog.component.html'
})
export class FileCreationRevenueDialogComponent {
  type = 'SALARY';

  constructor(public dialogRef: MatDialogRef<FileCreationRevenueDialogComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toString(type) {
    return IncomeType.toString(type);
  }
}


