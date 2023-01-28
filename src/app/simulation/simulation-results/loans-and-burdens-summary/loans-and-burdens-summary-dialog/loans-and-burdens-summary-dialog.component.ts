import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FundingResults } from 'src/app/_api';

@Component({
  selector: 'app-loans-and-burdens-summary-dialog',
  templateUrl: './loans-and-burdens-summary-dialog.component.html'
})
export class LoansAndBurdensSummaryDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoansAndBurdensSummaryDialogComponent>,
             @Inject(MAT_DIALOG_DATA) public data: FundingResults) {}

  ngOnInit(): void {
  }

}

