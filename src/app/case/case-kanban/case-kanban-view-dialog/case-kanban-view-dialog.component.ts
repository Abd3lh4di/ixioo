import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ActorStringMap, CaseStatusMap } from 'src/app/utils/strings';
import { CaseStatus, LegalPerson, LicenseMember, Simulation, SimulationResource } from 'src/app/_api';
import { PlanParametersService, SimulationService } from 'src/app/_services';
import { CaseItems, getClassFromStatus } from '../case-kanban.component';

@Component({
  selector: 'app-case-kanban-view-dialog',
  templateUrl: './case-kanban-view-dialog.component.html',
  styleUrls: ['../case-kanban.component.scss', './case-kanban-view-dialog.component.scss']
})
export class CaseKanbanViewDialogComponent implements OnInit {

  displayData: CaseItems;
  CaseStatus = CaseStatus;
  statuses = [CaseStatus.New,
      CaseStatus.Instruction,
      CaseStatus.SentToBank,
      CaseStatus.GrantedBank,
      CaseStatus.CustomerAccepted, CaseStatus.Completed, CaseStatus.Invoiced, CaseStatus.Closed, CaseStatus.Canceled]

  getClassFromStatus = getClassFromStatus;
  casePlans = [];
  selectedPlan;
  loadingPlans = false;
  displayedColumns: string[] = ['name', 'maximal_monthly_payment', 'maximal_debt_ratio', 'last_updated_at'];

  constructor(public dialogRef: MatDialogRef<CaseKanbanViewDialogComponent>,
              private router: Router,
              private planService: PlanParametersService,
              private simuService: SimulationService,
              @Inject(MAT_DIALOG_DATA) public inputData: {case: CaseItems, usersList: LicenseMember[]}) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(_ => {
      this.closeDialog();
    });

    // if(this.inputData.case.status === CaseStatus.New) {
    //   this.loadingPlans = true;
    //   this.planService.listPlans(this.inputData.case.id).pipe(
    //     take(1)
    //   ).subscribe( (resp) => {
    //     const casePlans = [];
    //     const planIds = [];
    //     resp.data.forEach( plan => {
    //       planIds.push(plan.id);
    //       casePlans.push( {
    //         name: plan.attributes.name,
    //         id: plan.id,
    //         last_updated_at: plan.meta.last_updated_at,
    //         maximal_debt_ratio: plan.attributes.maximal_debt_ratio,
    //         maximal_monthly_payment: plan.attributes.maximal_monthly_payment
    //       });
    //     })
    //     this.simuService.retrieveSimulations(this.inputData.case.id, planIds);
    //     this.casePlans = casePlans;
    //   });
    // }

    this.simuService.simulationResults$.pipe(take(1)).subscribe( plans => {
      plans.forEach( plan => {
        let latestResults: SimulationResource;
        let latestDate;
        plan.resources.forEach( res => {
          if(!latestDate || res.meta.last_updated_at > latestDate) {
            latestDate = res.meta.last_updated_at;
            latestResults = res;
          }
        });

        const casePlanIdx = this.casePlans.findIndex( p => p.id === plan.planId);
        if(casePlanIdx >= 0) {
          if(latestResults) {
            const casePlan = this.casePlans[casePlanIdx];
            casePlan.simulationId = latestResults.id;
            casePlan.last_updated_at = latestResults.meta.last_updated_at;
          } else {
            this.casePlans.splice(casePlanIdx, 1);
          }
        }
      });
      this.loadingPlans = false;
    })
  }

  onNoClick(): void {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close(this.inputData.case);
  }



  caseStatusToString(status) {
    return CaseStatusMap.toString(status);
  }

  actorToString(actor) {
    return ActorStringMap.toString(actor) ?? 'Pas d\'acteur';
  }

  getUserName(ref: string) {
    return this.inputData.usersList.find(element => element.ref === ref)?.name;
  }

  loadCase() {
    const actorType = (this.inputData.case.actor === LegalPerson.TypeEnum.LegalPerson) ? 'legalperson' : 'household';
    this.router.navigate(['/case/' + actorType, this.inputData.case.id]);
  }

  nextStatus() {
    switch(this.inputData.case.status) {
      case CaseStatus.New:
        this.inputData.case.status = CaseStatus.Instruction;
      break;
      case CaseStatus.Instruction:
        this.inputData.case.status = CaseStatus.SentToBank;
        // todo : action to send to bank ?
      break;
      case CaseStatus.SentToBank:
        this.inputData.case.status = CaseStatus.GrantedBank;
      break;
      case CaseStatus.GrantedBank:
        this.inputData.case.status = CaseStatus.CustomerAccepted;
      break;
      case CaseStatus.CustomerAccepted:
        this.inputData.case.status = CaseStatus.Invoiced;
      break;
      case CaseStatus.Invoiced:
        this.inputData.case.status = CaseStatus.Closed;
      break;
    }
    this.dialogRef.close(this.inputData.case);
  }

  selectPlan(element) {
    console.log(' ELEMENT : ' , element)
    this.selectedPlan = element;
  }
}
