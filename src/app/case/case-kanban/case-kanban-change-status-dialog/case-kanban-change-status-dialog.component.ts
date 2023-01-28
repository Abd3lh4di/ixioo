import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaseStatusMap } from 'src/app/utils/strings';
import { Case, CaseStatus } from 'src/app/_api';
import { getClassFromStatus } from '../case-kanban.component';

@Component({
  selector: 'app-case-kanban-change-status-dialog',
  templateUrl: './case-kanban-change-status-dialog.component.html',
  styleUrls: ['../case-kanban.component.scss']
})
export class CaseKanbanChangeStatusDialogComponent implements OnInit {

  getClassFromStatus = getClassFromStatus;

  constructor(public dialogRef: MatDialogRef<CaseKanbanChangeStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: { name: string, statuses: CaseStatus[] }) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  caseStatusToString(status) {
    return CaseStatusMap.toString(status);
  }
}
