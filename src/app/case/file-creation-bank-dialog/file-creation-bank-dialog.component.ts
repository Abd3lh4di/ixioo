import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BankInfoForm } from 'src/app/_models/forms/bankinfo-form';


@Component({
  selector: 'app-file-creation-bank-dialog',
  templateUrl: './file-creation-bank-dialog.component.html'
})
export class FileCreationBankDialogComponent implements OnInit {


  get bankDepartment() { return this.bankInfo.controls.departement; }
  get rib() { return this.bankInfo.controls.rib; }

  constructor(public dialogRef: MatDialogRef<FileCreationBankDialogComponent>, @Inject(MAT_DIALOG_DATA) public bankInfo: BankInfoForm) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
