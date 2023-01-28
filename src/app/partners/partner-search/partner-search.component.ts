import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { CourtesyTypeMap, PartnerTypeMap } from 'src/app/utils/strings';
import { PartnerResourcePaginatedListResponse, Partner, PartnerResource, ActivePartner, PartnerType } from '../../_api';
import { ActivePartnerForm } from '../../_models/forms/activepartner-form';
import { PartnersService } from '../../_services/partners.service';


export interface PartnerElement {
  id: string;
  name: string;
  type: string;
  creationDate: string;
  modificationDate: string;
}

@Component({
  selector: 'app-partner-search-confirm-delete-dialog',
  template: `<h1 mat-dialog-title>Voulez vous vraiment supprimer le partenaire ?</h1>
  <div mat-dialog-content>
    <p>
      Identifiant du partenaire: {{data.id}} <br>
      Nom: {{ data.name }} <br>
      Type: {{ typeToString(data.type) }} <br>
    </p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">Non merci</button>
    <button mat-button color="accent" [mat-dialog-close]="data.id" cdkFocusInitial>Oui</button>
  </div>

  `,
})
export class ConfirmDeletePatnerDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeletePatnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PartnerElement) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  typeToString(type) {
    return PartnerTypeMap.toString(type);
  }

}



@Component({
  selector: 'app-partner-search',
  templateUrl: './partner-search.component.html',
  styleUrls: ['./partner-search.component.scss']
})
export class PartnerSearchComponent implements OnInit, AfterViewInit {

  @Input() selectedPartner: ActivePartnerForm;
  @Input() hideDeleteOption: boolean;
  @Output() partnerSelected = new EventEmitter<Partner>();

  displayedColumns: string[] = ['type', 'name', 'sub_entity', 'city', 'contact', 'actions'];
  dataSource: Partner[] = [];

  currentCursor = undefined;
  currentPageIndex = 0;
  cursorHistory = [];

  pageSize = 10;
  dataLength = this.pageSize;
  loading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private partnerService: PartnersService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadPage();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe( next => {
      this.currentPageIndex = next.pageIndex;
      this.loadPage();
    });
  }

  loadPage() {
    this.loading = true;
    this.currentCursor = this.cursorHistory[this.currentPageIndex - 1];
    this.partnerService.search(this.pageSize, this.currentCursor).pipe(take(1)).subscribe(
      (resp: PartnerResourcePaginatedListResponse) => {
        if(resp.meta?.page?.cursor && this.paginator.pageIndex === this.cursorHistory.length) {
          this.cursorHistory.push(resp.meta?.page?.cursor);
          this.dataLength += this.pageSize;
        }
        this.dataSource = resp.data.map( data => ({ id: data.id, ...data.attributes }) );
        this.loading = false;
      }
    );
  }

  typeToString(type) {
    return PartnerTypeMap.toString(type);
  }

  courtesyToString(type) {
    return CourtesyTypeMap.toString(type);
  }

  selectPartner(row: Partner) {
    this.partnerSelected.emit(row);
  }

  deletePartner(partnerObject, event) {

    const dialogRef = this.dialog.open(ConfirmDeletePatnerDialogComponent, { data: partnerObject });
    dialogRef.afterClosed().subscribe(idx => {
      if(idx) {
        this.loading = true;
        this.partnerService.delete(idx).pipe(take(1)).subscribe( _ => {
          this.snackBar.open('Partenaire supprimé', 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.cursorHistory = this.cursorHistory.slice(0, this.currentPageIndex);
          this.loadPage();
        });
      }
    });

    event.preventDefault();
    event.stopPropagation();
    return;
  }

}
