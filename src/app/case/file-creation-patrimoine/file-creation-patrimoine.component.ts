import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TypedFormArray } from 'src/app/typed-form-array';
import { PatrimonyType } from 'src/app/utils/strings';
import { categories, PatrimonyDialogData, FileCreationPatrimonyDialogComponent } from './file-creation-patrimony-dialog/file-creation-patrimony-dialog.component';

@Component({
  selector: 'app-file-creation-patrimoine',
  templateUrl: './file-creation-patrimoine.component.html',
  styleUrls: ['./file-creation-patrimoine.component.scss', './file-creation-patrimoine.component.small.scss']
})
export class FileCreationPatrimoineComponent implements OnInit {

  @Input() patrimony: TypedFormArray;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(category: categories) {
    const data: PatrimonyDialogData = {
      type: '',
      category,
      description: '',
      comment: '',
      value: 0,
      buying_or_opening_date: null,
      remaining_capital: 0,
      is_for_sale: false,
      breakup: {
        type: 'PLEINE_PROPRIETE',
        portion: 100
      },
      for_sale: {
        agency_fees: 0,
        dates: {
          conditions_precedent_end_date: null,
          sales_agreement_date: null,
          signature_date: null
        },
        price: 0,
        since: null,
        taxes: 0
      },
    };

    const dialogRef = this.dialog.open(FileCreationPatrimonyDialogComponent, {
      data
    } );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patrimony.pushValue(result);
      }
    });
  }

  addMovable() {
    this.openDialog('MOVABLE');
  }
  addRealEstate() {
    this.openDialog('REAL_ESTATE');
  }
  addSavings() {
    this.openDialog('SAVINGS');
  }
  addProfessional() {
    this.openDialog('PROFESSIONAL');
  }


  getTypeColor(category: categories) {
    switch (category) {
      case 'MOVABLE': return '#e6ab02';
      case 'REAL_ESTATE': return '#00796b';
      case 'SAVINGS': return '#386cb0';
      case 'PROFESSIONAL': return '#c2185b';
      default: return '#aa00ff';
    }
  }

  toString(type: string) {
    return PatrimonyType.toString(type);
  }

  // edit(patrimonyData: PatrimonyDialogData) {
  edit(index: number) {
    const patrimonyData = this.patrimony.at(index).value;
    console.log('EDIT: ' , patrimonyData);
    const dialogRef = this.dialog.open(FileCreationPatrimonyDialogComponent, { data: patrimonyData } );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('data ok ');
        this.patrimony.at(index).patchValue(result);
        // patrimonyData = result;
      }
    });
  }
  remove(index) {
    this.patrimony.removeAt(index);
  }

}
