import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LoanFutureType, LoansType } from 'src/app/utils/strings';

export interface LoanDialogData {
  type: 'MORTGAGE' | 'PERSONAL_LOAN' | 'SPECIFIC_LOAN' | 'REVOLVING_LOAN' | 'OTHER';
  monthly_payment: {
    figure: number;
    weight: number;
  };
  remaining_capital: number;
  start_date: Date;
  end_date: Date;
  lender: string;
  future: 'CONTINUE_AFTER_PROJECT' | 'REIMBURSED_DURING_PROJECT' | 'CONSOLIDATED_DURING_PROJECT';
  comment: string;
  smoothable: boolean;
  edit: boolean;
}

@Component({
  selector: 'app-file-creation-loans-dialog',
  templateUrl: './file-creation-loans-dialog.component.html'
})
export class FileCreationLoansDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FileCreationLoansDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: LoanDialogData) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loanToString(type) {
    return LoansType.toString(type);
  }

  futureToString(type) {
    return LoanFutureType.toString(type);
  }
}
