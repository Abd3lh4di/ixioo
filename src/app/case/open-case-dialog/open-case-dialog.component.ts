import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-open-case-dialog',
  templateUrl: './open-case-dialog.component.html'
})
export class OpenCaseDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OpenCaseDialogComponent>) { }

  ngOnInit(): void {
    console.log('oninit')
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
