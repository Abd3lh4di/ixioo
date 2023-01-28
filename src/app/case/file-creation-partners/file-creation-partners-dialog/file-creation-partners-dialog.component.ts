import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { CourtesyTypeMap } from 'src/app/utils/strings';
import { Partner, ActivePartner } from 'src/app/_api';
import { ActivePartnerForm } from 'src/app/_models/forms/activepartner-form';

@Component({
  selector: 'app-file-creation-partners-dialog',
  templateUrl: './file-creation-partners-dialog.component.html'
})
export class FileCreationPartnersDialogComponent implements OnInit {

  @ViewChild('stepper')
  private stepper: MatStepper;

  selectedPartner: Partner;

  constructor(public dialogRef: MatDialogRef<FileCreationPartnersDialogComponent>, @Inject(MAT_DIALOG_DATA) public inputBank: ActivePartnerForm ) {}

  ngOnInit(): void {
  }

  partnerSelected(partner) {
    this.selectedPartner = partner;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  toCourtesyString(courtesy: any) {
    return CourtesyTypeMap.toString(courtesy);
  }

  contactSelected(change) {
    const activePartner: ActivePartner = {
      type: this.selectedPartner.type,
      role: 'LEADER',
      name: this.selectedPartner.name,
      sub_entity: this.selectedPartner.sub_entity,
      address: this.selectedPartner.address,
      agreement_number: this.selectedPartner.agreement_number,
      comment: this.selectedPartner.comment,
      logo_uri: this.selectedPartner.logo_uri,
      contact: change.option.value,
      main_contact: this.selectedPartner.main_contact,
      phone_number: this.selectedPartner.main_contact.phone_number,
      email: this.selectedPartner.main_contact.email
    };
    this.dialogRef.close(activePartner);
  }

}
