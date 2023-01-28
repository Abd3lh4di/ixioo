import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService, InfinitePaginatorComponent, SortType } from '@toaztr/ui-components';
import { take, tap } from 'rxjs/operators';
import { ActorStringMap, ProjectStringMap } from 'src/app/utils/strings';
import { CaseResource, CaseResourcePaginatedListResponse, HouseholdDetails, LegalPerson } from 'src/app/_api';
import { LegalPersonForm } from 'src/app/_models/forms/legalperson-form';
import { CaseService, LoaderService } from 'src/app/_services';

export interface CaseElement {
  id: string;
  name: string;
  type: string;
  creationDate: string;
  modificationDate: string;
}

@Component({
  selector: 'app-case-search-confirm-delete-dialog',
  template: `<h1 mat-dialog-title>Voulez vous vraiment supprimer le dossier ?</h1>
  <div mat-dialog-content>
    <p>
      Numéro du dossier: {{data.id}} <br>
      Nom: {{ data.name }} <br>
      Projet: {{ data.type }} <br>
      Date de création: {{ data.creationDate | date:'medium' }} <br>
      Date de modification: {{ data.modificationDate | date:'medium' }} <br>
    </p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">Non merci</button>
    <button mat-button color="accent" [mat-dialog-close]="data.id" cdkFocusInitial>Oui</button>
  </div>

  `,
})
export class ConfirmDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CaseElement) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-case-search',
  templateUrl: './case-search.component.html',
  styleUrls: ['./case-search.component.scss']
})
export class CaseSearchComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'actor', 'creationDate', 'modificationDate', 'actions'];
  dataService?: DataService<CaseResource>;

  pageSize = 8;
  filterCaseName: string;
  loading = false;

  @ViewChild(InfinitePaginatorComponent) paginator: InfinitePaginatorComponent<CaseResource>;

  constructor(private caseService: CaseService,
              private router: Router,
              public dialog: MatDialog,
              public loaderService: LoaderService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    const self = this;
    self.loading = true;
    this.dataService = {
      async fetch(cursor?: string, sort?: SortType) {
        self.loading = true;
        return self.caseService.search(self.pageSize, cursor, self.filterCaseName).pipe(
          take(1),
          tap( () => { self.loading = false; } )
        ).toPromise()
      }
    }
  }

  searchCase() {
    if(this.loading) return;
    this.paginator.refresh();
  }

  loadCase(row) {
    if(this.loading) return;
    const aActor = (row.attributes && row.attributes.actor && row.attributes.actor.type) ? row.attributes.actor.type : undefined;
    const actorType = (aActor === LegalPerson.TypeEnum.LegalPerson) ? 'legalperson' : 'household';
    this.router.navigate(['/case/' + actorType, row.id]);
  }


  convertProjectType(projectType) {
    return ProjectStringMap.toString(projectType) ?? 'Pas de projet'
  }

  convertActor(actor) {
    return ActorStringMap.toString(actor) ?? 'Pas d\'acteur';
  }

  deleteCase(caseObject, event) {
    if(this.loading) return;
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, { data: caseObject });
    dialogRef.afterClosed().subscribe(idx => {
      if(idx) {
        this.loading = true;
        this.caseService.delete(idx).pipe(take(1)).subscribe( _ => {
          this.snackBar.open('Dossier supprimé', 'Ok', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.paginator.refresh();
        });
      }
    });

    event.preventDefault();
    event.stopPropagation();
    return;
  }

}
