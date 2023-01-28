import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { TypedFormArray } from 'src/app/typed-form-array';
import { HouseholdForm } from 'src/app/_models/forms/household-form';
import { MatDialog } from '@angular/material/dialog';
import { FileCreationBankDialogComponent } from '../file-creation-bank-dialog/file-creation-bank-dialog.component';
import { BankInfoForm } from 'src/app/_models/forms/bankinfo-form';

@Component({
  selector: 'app-file-creation-menage',
  templateUrl: './file-creation-menage.component.html',
  styleUrls: ['./file-creation-menage.component.scss', './file-creation-menage.component.small.scss']
})
export class FileCreationMenageComponent implements OnInit {

  @Input() household: HouseholdForm;

  get peopleInCharge() { return this.household.controls.dependent_persons_count; }
  get peopleInHousing() { return this.household.controls.people_count; }
  get childrenInCharge() { return this.household.controls.children_count; }
  get children() { return this.household.controls.children as TypedFormArray; }

  get bankInfo() { return this.household.controls.bank_info as BankInfoForm; }


  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.childrenInCharge.valueChanges.pipe(
      map(value => Number(value))
    ).subscribe(
      value => {
        if (value > this.peopleInCharge.value) {
          this.peopleInCharge.setValue(value);
        }
        while (value > this.children.length) {
          this.addChild();
        }
        while (value < this.children.length) {
          this.removeLastChild();
        }
      }
    );
  }

  addChild() {
    this.children.pushValue();
    const lastChild = this.children.at(this.children.length - 1);
    lastChild.get('birth_date').valueChanges.subscribe(
      date => {
        const localBirthDate = new Date(Date.parse(date));
        const timeDiff = Math.abs(Date.now() - localBirthDate.getTime());
        const localAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        lastChild.get('age').setValue(localAge);
      }
    );
  }
  removeLastChild() {
    this.children.removeAt(this.children.length - 1);
  }

  addBankInformation() {
    const dialogRef = this.dialog.open(FileCreationBankDialogComponent, { data: this.bankInfo });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        console.log('Closed: ', data);
      }
    });
  }

}
