import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TypedFormArray } from 'src/app/typed-form-array';
import { LoanFutureType, LoansType } from 'src/app/utils/strings';
import { FileCreationLoansDialogComponent } from './file-creation-loans-dialog/file-creation-loans-dialog.component';

@Component({
  selector: 'app-file-creation-loans',
  templateUrl: './file-creation-loans.component.html',
  styleUrls: ['./file-creation-loans.component.scss',
              './file-creation-loans.component.small.scss']
})
export class FileCreationLoansComponent implements OnInit {

  @Input() finance: FormGroup;

  get current_loans() { return this.finance.controls.current_loans as TypedFormArray; }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  loanToString(type) {
    return LoansType.toString(type);
  }
  loanFutureToString(type) {
    return LoanFutureType.toString(type);
  }

  getLoanColor(type: 'MORTGAGE' | 'PERSONAL_LOAN' | 'SPECIFIC_LOAN' | 'REVOLVING_LOAN' | 'OTHER') {
    switch (type) {
      case 'MORTGAGE': return '#c2185b';
      case 'PERSONAL_LOAN': return '#386cb0';
      case 'SPECIFIC_LOAN':  return '#aa00ff';
      case 'REVOLVING_LOAN':  return '#e6ab02';
      default: return '#00796b';
    }
  }

  addLoan() {
    const dialogRef = this.dialog.open(FileCreationLoansDialogComponent, { data: {
      type: 'MORTGAGE',
      monthly_payment: {
        figure: 0,
        weight: 100
      },
      remaining_capital: 0,
      start_date: undefined,
      end_date: undefined,
      lender: '',
      future: 'CONTINUE_AFTER_PROJECT',
      comment: '',
      smoothable: false,
      edit: false
    } } );

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.current_loans.pushValue({
          type: data.type,
          comment: data.comment,
          monthly_payment: data.monthly_payment,
          remaining_capital: data.remaining_capital,
          start_date: data.start_date,
          end_date: data.end_date,
          lender: data.lender,
          future: data.future,
          smoothable: data.smoothable
        });
      }
    });
  }

  editLoan(index) {
    console.log(this.current_loans.at(index));
    const loan = this.current_loans.at(index).value;
    const dialogRef = this.dialog.open(FileCreationLoansDialogComponent, { data: {
      type: loan.type,
      monthly_payment: loan.monthly_payment,
      remaining_capital: loan.remaining_capital,
      start_date: loan.start_date,
      end_date: loan.end_date,
      lender: loan.lender,
      future: loan.future,
      comment: loan.comment,
      smoothable: loan.smoothable,
      edit: true
    } } );

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.current_loans.at(index).patchValue(data);
      }
    });
  }

  removeLoan(index) {
    this.current_loans.removeAt(index);
  }

}
