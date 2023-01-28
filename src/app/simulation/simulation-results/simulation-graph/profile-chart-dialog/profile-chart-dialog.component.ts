import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FundingParameters, FundingResults } from 'src/app/_api';

@Component({
  selector: 'app-profile-chart-dialog',
  templateUrl: './profile-chart-dialog.component.html'
})
export class ProfileChartDialogComponent implements OnInit {

  results: FundingResults;
  params: FundingParameters;

  constructor(public dialogRef: MatDialogRef<ProfileChartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { params: FundingParameters, results: FundingResults }) {}

  ngOnInit() {
    this.params = this.data.params;
    this.results = this.data.results;
  }

}
