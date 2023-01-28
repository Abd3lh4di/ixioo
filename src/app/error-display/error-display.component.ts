import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Error } from '../_services/error-display.service';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html'
})
export class ErrorDisplayComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ErrorDisplayComponent>, @Inject(MAT_DIALOG_DATA) public data: Error) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
