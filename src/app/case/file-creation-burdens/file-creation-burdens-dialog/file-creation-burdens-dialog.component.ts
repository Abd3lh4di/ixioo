import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BurdensType } from 'src/app/utils/strings';


@Component({
  selector: 'app-file-creation-burdens-dialog',
  templateUrl: './file-creation-burdens-dialog.component.html'
})
export class FileCreationBurdensDialogComponent {

  type = 'RENT';

  constructor(public dialogRef: MatDialogRef<FileCreationBurdensDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  toString(type) {
    return BurdensType.toString(type);
  }
}
