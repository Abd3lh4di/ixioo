import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CaseStatusMap, ProjectStringMap } from 'src/app/utils/strings';
import { Case, CaseResource, CaseResourcePaginatedListResponse, CaseStatus, LicenseMember, LicenseMembersResponse } from 'src/app/_api';
import { MatDialog } from '@angular/material/dialog';
import { CaseKanbanChangeStatusDialogComponent } from './case-kanban-change-status-dialog/case-kanban-change-status-dialog.component';
import { CaseKanbanViewDialogComponent } from './case-kanban-view-dialog/case-kanban-view-dialog.component';
import { CaseService } from 'src/app/_services';
import { take } from 'rxjs/operators';
import { LicenceService } from 'src/app/_services/licence.service';

export function getClassFromStatus(status) {
  switch(status) {
    case CaseStatus.New: return 'cyan';
    case CaseStatus.Instruction: return 'blue';
    case CaseStatus.SentToBank: return 'amber';
    case CaseStatus.GrantedBank: return 'yellow';
    case CaseStatus.CustomerAccepted: return 'orange';
    case CaseStatus.Completed: return 'lime';
    case CaseStatus.Invoiced: return 'green';
    case CaseStatus.Closed: return 'light-green';
    case CaseStatus.Canceled: return 'pink';
  }
}

export class CaseItems {
  id: string;
  status: CaseStatus;
  assignedTo: string;
  createdBy: string;
  name: string;
  type: string;
  actor: string;
  creationDate: string;
  modificationDate: string;
  modifiedBy: string;
}


@Component({
  selector: 'app-case-kanban',
  templateUrl: './case-kanban.component.html',
  styleUrls: ['./case-kanban.component.scss']
})
export class CaseKanbanComponent implements OnInit {

  getClassFromStatus = getClassFromStatus;
  cases: CaseItems[] = [];

  fetchNewCaseData = {
    nextCursor: undefined,
    hasDataToFetch: true,
    fetching: false
  };
  fetchOnGoingCaseData = {
    nextCursor: undefined,
    hasDataToFetch: true,
    fetching: false
  };
  fetchDoneCaseData = {
    nextCursor: undefined,
    hasDataToFetch: true,
    fetching: false
  };

  new = [];
  ongoing = [];
  done = [];
  archived = [];

  usersList: LicenseMember[] = [];
  userFilter: string;

  newStatuses = [CaseStatus.New, CaseStatus.Instruction];
  ongoingStatuses = [CaseStatus.SentToBank, CaseStatus.GrantedBank, CaseStatus.CustomerAccepted, CaseStatus.Completed];
  doneStatuses = [CaseStatus.Closed, CaseStatus.Invoiced, CaseStatus.Canceled];

  constructor(public dialog: MatDialog, private caseService: CaseService, private licenceService: LicenceService) { }

  ngOnInit(): void {
    this.loadNew();
    this.loadOnGoing();
    this.loadDone();
    this.loadUsers();
  }

  loadUsers() {
    this.licenceService.getLicenseMembers().pipe(take(1)).subscribe(
      (resp: LicenseMembersResponse) => {
        this.usersList = resp.data;
      }
    )
  }

  getUserName(ref: string) {
    return this.usersList.find(element => element.ref === ref)?.name;
  }

  loadNew() {
    this.loadCases(this.fetchNewCaseData, 'NEW');
  }
  loadOnGoing() {
    this.loadCases(this.fetchOnGoingCaseData, 'ONGOING');
  }
  loadDone() {
    this.loadCases(this.fetchDoneCaseData, 'DONE');
  }

  loadCases(fetchData, category: string) {
    if(!fetchData.hasDataToFetch || fetchData.fetching) {
      return;
    }
    fetchData.fetching = true;
    this.caseService.retrieveByCategory(20, fetchData.nextCursor, category).pipe(take(1)).subscribe(
      (resp: CaseResourcePaginatedListResponse) => {
        // We have data to fetch
        if(resp.meta?.page?.cursor) {
          fetchData.nextCursor = resp.meta?.page?.cursor;
        } else {
          fetchData.hasDataToFetch = false;
        }
        const newItems = resp.data.map( data => ({
          id: data.id,
          status: data.attributes.status ?? CaseStatus.New,
          assignedTo: data.attributes.assigned_to,
          createdBy: data.meta.created_by,
          name: data.attributes.name,
          type: ProjectStringMap.toString(data.attributes.project?.type) ?? 'Pas de projet',
          actor: data.attributes.actor?.type,
          creationDate: data.meta.created_at,
          modificationDate: data.meta.last_updated_at,
          modifiedBy: data.meta.last_updated_by,
        }));

        this.cases = [...this.cases, ...newItems];
        this.updateFilters();
        fetchData.fetching = false;
      }
    );
  }

  filterByUser(user) {
    this.userFilter = user;
    this.updateFilters();
  }

  updateFilters() {
    this.new = this.cases.filter(c => this.newStatuses.includes(c.status) && (!this.userFilter || c.assignedTo === this.userFilter) );
    this.ongoing = this.cases.filter(c => this.ongoingStatuses.includes(c.status) && (!this.userFilter || c.assignedTo === this.userFilter) );
    this.done = this.cases.filter(c => this.doneStatuses.includes(c.status) && (!this.userFilter || c.assignedTo === this.userFilter) );

    this.fetchNewCaseData.fetching = false;
    this.fetchOnGoingCaseData.fetching = false;
    this.fetchDoneCaseData.fetching = false;
  }


  caseStatusToString(status) {
    return CaseStatusMap.toString(status);
  }

  editCase(caseItem: CaseItems) {
    const dialogRef = this.dialog.open(CaseKanbanViewDialogComponent, { width: '100vh', data: { case: caseItem, usersList: this.usersList } } );
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        if(result.assignedTo) {
          caseItem.assignedTo = result.assignedTo;
          this.fetchNewCaseData.fetching = true;
          this.fetchOnGoingCaseData.fetching = true;
          this.fetchDoneCaseData.fetching = true;
          this.caseService.updateAssignedTo(caseItem.id , result.assignedTo).pipe(take(1)).subscribe( () => {
            this.updateFilters();
          })
        }
        if(result.status) {
          caseItem.status = result.status;
          this.fetchNewCaseData.fetching = true;
          this.fetchOnGoingCaseData.fetching = true;
          this.fetchDoneCaseData.fetching = true;
          this.caseService.updateStatus(caseItem.id , caseItem.status).pipe(take(1)).subscribe( () => {
            this.updateFilters();
          })
        }
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      const caseItem: CaseItems = event.container.data[event.currentIndex] as unknown as CaseItems;
      let statuses = this.newStatuses;
      switch(event.container.id) {
        case 'new':
          statuses = this.newStatuses;
          break;
        case 'ongoing':
          statuses = this.ongoingStatuses;
          break;
        case 'done':
          statuses = this.doneStatuses;
          break;
      }
      const dialogRef = this.dialog.open(CaseKanbanChangeStatusDialogComponent, { data: { name: caseItem.name, statuses } } );
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          caseItem.status = result;
        } else {
          caseItem.status = statuses[0];
        }
        this.caseService.updateStatus(caseItem.id , caseItem.status).pipe(take(1)).subscribe( res => {
          // TODO : loading
          console.log('RESP: ', res)
          this.loadNew();
          this.loadOnGoing();
          this.loadDone();
        })
      });
    }
  }

  onNewScrolled() {
    this.loadNew();
  }
  onOnGoingScrolled() {
    this.loadOnGoing();
  }
  onDoneScrolled() {
    this.loadDone();
  }

}
