import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatrimonyType } from 'src/app/utils/strings';

export type categories = 'SAVINGS' | 'MOVABLE' | 'REAL_ESTATE' | 'PROFESSIONAL';

export interface PatrimonyDialogData {
  type: string;
  category: categories;
  description: string;
  comment: string;
  value: number;
  buying_or_opening_date: Date;
  remaining_capital: number;
  is_for_sale: boolean;
  breakup: {
    type: string;
    portion: number;
  };
  for_sale: {
    since: Date;
    price: number;
    agency_fees: number;
    taxes: number;
    dates: {
      sales_agreement_date: Date;
      conditions_precedent_end_date: Date;
      signature_date: Date;
    };
  };
}

@Component({
  selector: 'app-file-creation-patrimony-dialog',
  templateUrl: './file-creation-patrimony-dialog.component.html'
})
export class FileCreationPatrimonyDialogComponent implements OnInit {

  savingsTypes = [ 'LIVRET_A', 'LDDS', 'LEP', 'LIVRET_JEUNE', 'LIFE_INSURANCE', 'PEL', 'CEL',
  'PEE', 'PEA', 'PER', 'CURRENT_ACCOUNT', 'FAMILY_DONATION' ];
  movableTypes = [ 'SHARES', 'SCI_SHARES', 'SOCIAL_SHARES', 'JEWELRY', 'ART_WORK', 'COLLECTION'];
  realEstateTypes = [ 'REAL_ESTATE_MAIN_PROPERTY', 'REAL_ESTATE_SECONDARY_PROPERTY', 'REAL_ESTATE_RENTING_PROPERTY',
  'LAND', 'PARKING', 'COMMERCIAL_PREMISES', 'BUILDING'];
  professionalTypes = [ 'PROFESSIONAL_REAL_ESTATE', 'CAPITAL_GOODS' ];

  breakupTypes = [ 'PLEINE_PROPRIETE', 'NUE_PROPRIETE', 'USUFRUIT' ];

  currentTypeList: string[];

  constructor(public dialogRef: MatDialogRef<FileCreationPatrimonyDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PatrimonyDialogData) { }

  ngOnInit(): void {
    switch (this.data.category) {
      case 'SAVINGS': { this.currentTypeList = this.savingsTypes; break; this.data.type = 'LIVRET_A';}
      case 'MOVABLE': this.currentTypeList = this.movableTypes; break;
      case 'REAL_ESTATE': this.currentTypeList = this.realEstateTypes; break;
      case 'PROFESSIONAL': this.currentTypeList = this.professionalTypes; break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toString(type: string) {
    return PatrimonyType.toString(type);
  }

}
