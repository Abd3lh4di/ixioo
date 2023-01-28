import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TypedFormArray } from 'src/app/typed-form-array';
import { IncomeType } from 'src/app/utils/strings';
import { FileCreationRevenueDialogComponent } from './file-creation-revenue-dialog/file-creation-revenue-dialog.component';

@Component({
  selector: 'app-file-creation-revenue',
  templateUrl: './file-creation-revenue.component.html',
  styleUrls: ['./file-creation-revenue.component.scss', './file-creation-revenue.component.small.scss']
})
export class FileCreationRevenueComponent implements OnInit {

  @Input() finance: FormGroup;
  get incomes() { return this.finance.controls.revenues as TypedFormArray; }
  get incomeTax() { return this.finance.controls.income_tax; }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addIncomes() {
    const dialogRef = this.dialog.open(FileCreationRevenueDialogComponent);
    dialogRef.afterClosed().subscribe(type => {
      if (type) {
        this.incomes.pushValue({ type });
      }
    });
  }

  removeIncome(i) {
    this.incomes.removeAt(i);
  }

  incomeToString(type) {
    return IncomeType.toString(type);
  }

}
