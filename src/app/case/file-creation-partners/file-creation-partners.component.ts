import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TypedFormArray } from 'src/app/typed-form-array';
import { CourtesyTypeMap, PartnerTypeMap } from 'src/app/utils/strings';
import { FileCreationPartnersDialogComponent } from './file-creation-partners-dialog/file-creation-partners-dialog.component';

@Component({
  selector: 'app-file-creation-partners',
  templateUrl: './file-creation-partners.component.html',
  styleUrls: ['./file-creation-partners.component.scss']
})
export class FileCreationPartnersComponent implements OnInit {

  @Input() partners: TypedFormArray;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  toCourtesyString(courtesy: any) {
    return CourtesyTypeMap.toString(courtesy);
  }

  partnerTypeToString(type) {
    return PartnerTypeMap.toString(type);
  }

  addPartner() {
    const dialogRef = this.dialog.open(FileCreationPartnersDialogComponent, { width: '80%' });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        console.log(data)
        this.partners.pushValue(data);
      }
    });
  }

  deletePartner(idx) {
    this.partners.removeAt(idx);
  }
}
