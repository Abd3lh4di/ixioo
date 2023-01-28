import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddressForm } from 'src/app/_models/forms/address-form';
import { BankInfoForm } from 'src/app/_models/forms/bankinfo-form';
import { FinancialResultsForm } from 'src/app/_models/forms/financial-results-form';
import { LegalPersonForm } from 'src/app/_models/forms/legalperson-form';
import { FileCreationBankDialogComponent } from '../file-creation-bank-dialog/file-creation-bank-dialog.component';
import { countries } from 'src/app/utils/countries';
import { WeightedFigureForm, WeightedPositiveFigureForm } from 'src/app/_models/forms/weighted-figure-form';

@Component({
  selector: 'app-file-creation-legal-person',
  templateUrl: './file-creation-legal-person.component.html'
})
export class FileCreationLegalPersonComponent implements OnInit {

  @Input() legalPerson: LegalPersonForm;

  get name() { return this.legalPerson.controls.name; }
  get email() { return this.legalPerson.controls.email; }
  get phone_number() { return this.legalPerson.controls.phone_number; }
  get address() { return this.legalPerson.controls.address as AddressForm; }
  get locationCountry() { return this.address.controls.country; }
  get contactAddress() { return this.legalPerson.controls.contact_address as AddressForm; }
  get bankInfo() { return this.legalPerson.controls.bank_info as BankInfoForm; }
  get structure_type() { return this.legalPerson.controls.structure_type; }
  get legal_status() { return this.legalPerson.controls.legal_status; }
  get financial_results() { return this.legalPerson.controls.financial_results as FinancialResultsForm; }
  get profits_Nminus1() { return this.financial_results.controls.profits_Nminus1 as WeightedFigureForm; }
  get profits_Nminus2() { return this.financial_results.controls.profits_Nminus2 as WeightedFigureForm; }
  get profits_Nminus3() { return this.financial_results.controls.profits_Nminus3 as WeightedFigureForm; }
  get turnover_Nminus1() { return this.financial_results.controls.turnover_Nminus1 as WeightedPositiveFigureForm; }
  get turnover_Nminus2() { return this.financial_results.controls.turnover_Nminus2 as WeightedPositiveFigureForm; }
  get turnover_Nminus3() { return this.financial_results.controls.turnover_Nminus3 as WeightedPositiveFigureForm; }


  countries = countries;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
