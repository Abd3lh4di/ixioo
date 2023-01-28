import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { CourtesyTypeMap } from 'src/app/utils/strings';
import { ActivePartner, Contact, Partner, PartnerType } from 'src/app/_api';
import { ActivePartnerForm } from 'src/app/_models/forms/activepartner-form';

@Component({
  selector: 'app-file-creation-fundings-banks-dialog',
  templateUrl: './file-creation-fundings-banks-dialog.component.html'
})
export class FileCreationFundingsBanksDialogComponent implements OnInit {

  @ViewChild('stepper')
  private stepper: MatStepper;

  selectedBank: Partner;

  constructor(public dialogRef: MatDialogRef<FileCreationFundingsBanksDialogComponent>, @Inject(MAT_DIALOG_DATA) public inputBank: ActivePartnerForm ) {}

  ngOnInit(): void {
  }

  bankSelected(bank) {
    this.selectedBank = bank;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  toCourtesyString(courtesy: any) {
    return CourtesyTypeMap.toString(courtesy);
  }

  contactSelected(change) {
    const activePartner: ActivePartner = {
      type: 'BANK',
      role: 'LEADER',
      name: this.selectedBank.name,
      sub_entity: this.selectedBank.sub_entity,
      address: this.selectedBank.address,
      agreement_number: this.selectedBank.agreement_number,
      comment: this.selectedBank.comment,
      contact: change.option.value,
      phone_number: this.selectedBank.main_contact.phone_number,
      email: this.selectedBank.main_contact.email
    };
    this.dialogRef.close(activePartner);
  }
}
