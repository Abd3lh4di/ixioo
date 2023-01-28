import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { nationalities } from 'src/app/utils/nationalities';
import { countries } from 'src/app/utils/countries';
import { MatDialog } from '@angular/material/dialog';
import { FileCreationBankDialogComponent } from '../file-creation-bank-dialog/file-creation-bank-dialog.component';
import { MaritalStatusMap } from 'src/app/utils/strings';
import { AddressForm } from 'src/app/_models/forms/address-form';
import { BankInfoForm } from 'src/app/_models/forms/bankinfo-form';
import { CivilForm } from 'src/app/_models/forms/civil-form';
import { FamilySituationForm } from 'src/app/_models/forms/familysituation-form';
import { PersonForm } from 'src/app/_models/forms/person-form';

@Component({
  selector: 'app-file-creation-person',
  templateUrl: './file-creation-person.component.html',
  styleUrls: ['./file-creation-person.component.scss',
              './file-creation-person.component.small.scss']
})
export class FileCreationPersonComponent implements OnInit {

  @Input() person: PersonForm;
  @Input() personNames: string[];
  @Input() activeIndex: number;
  @Output() newPerson = new EventEmitter<void>();
  @Output() iAmInRelation = new EventEmitter<any>();
  @Output() resetRelation = new EventEmitter<number>();

  // profession

  // civil
  get civil() { return this.person.controls.civil as CivilForm; }
  get isMadam() { return this.civil.controls.courtesy.value === 'MRS'; }
  get nationality() { return this.civil.controls.nationality; }

  get residenceAddress() { return this.civil.controls.residency_address as AddressForm; }
  get contactAddressNeeded() { return this.civil.controls.contact_address_needed; }
  get contactAddress() { return this.civil.controls.contact_address as AddressForm; }
  get residenceCountry() { return this.residenceAddress.controls.country; }
  get contactCountry() { return this.contactAddress.controls.country; }

  get familySituation() { return this.civil.controls.family_situation as FamilySituationForm; }
  get maritalCountry() { return this.familySituation.controls.marital_country; }
  get maritalStatus() { return this.familySituation.controls.marital_status; }
  get maritalStatusSince() { return this.familySituation.controls.marital_status; }
  get inRelationWith() { return this.familySituation.controls.is_in_relation_with; }


  get bankInfo() { return this.civil.controls.bank_info as BankInfoForm; }

  nationalities = nationalities;
  countries = countries;
  needResidencePermitNumber = false;

  constructor(public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
  }
  ngOnInit(): void {
  }

  onNationalitySelected() {
    this.decideShowingResidencePermitNumber();
  }
  onResidenceCountrySelected() {
    this.decideShowingResidencePermitNumber();
  }

  decideShowingResidencePermitNumber() {
    if (this.nationality.value === 'Française' || (this.residenceCountry.value !== '' && this.residenceCountry.value !== 'France') ) {
      this.needResidencePermitNumber = false;
    } else {
      this.needResidencePermitNumber = true;
    }
  }

  isWithSomeone(): boolean {
    return this.maritalStatus.value === 'MARRIED' ||
           this.maritalStatus.value === 'PACSED' ||
           this.maritalStatus.value === 'DIVORCE_ONGOING' ||
           this.maritalStatus.value === 'LIVING_TOGETHER';
  }

  getMaritalStatusLabel(maritalStatus) {
    if(!maritalStatus) return '';
    return MaritalStatusMap.toString(this.civil.controls.courtesy.value, maritalStatus);
  }

  onCourtesyChange() {
    this.cdRef.detectChanges();
  }

  onRelationWithChanged(value) {
    console.log('> onRelationWithChanged: ', value)
    console.log('> this.inRelationWith.value: ', this.inRelationWith.value)
    if(value === 'NEW') {
      this.inRelationWith.setValue(this.personNames.length.toString());
      this.newPerson.emit();
    }
    this.updateRelation();
  }

  maritalStatusChanged(value) {
    if(this.isWithSomeone() ) {
      const inRelationWith = this.inRelationWith.value;
      this.familySituation.patchValue({
        marital_status: value,
        is_in_relation_with: inRelationWith
      });
      this.updateRelation();
    } else {
      console.log('> maritalStatusChanged')
      if(this.inRelationWith.value) {
        this.resetRelation.emit(Number(this.inRelationWith.value));
      }
      this.familySituation.reset();
      this.familySituation.patchValue({
        marital_status: value,
        is_in_relation_with: null
      });
    }

  }

  updateRelation() {
    console.log('> updateRelation: ' , this.inRelationWith.value)
    if(this.inRelationWith.value !== null) {
      this.iAmInRelation.emit({relationIdx: this.inRelationWith.value});
    }
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
