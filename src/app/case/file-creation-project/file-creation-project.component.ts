import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ProjectStringMap } from 'src/app/utils/strings';
import { Budget, HouseConstruction, Land, NewProperty, OldProperty, Works, Pinel, DebtConsolidation, BalancingAdjustment, LMNP } from 'src/app/_api';
import { CaseFormService } from 'src/app/_services';
import { LoaderService } from 'src/app/_services/loader.service';
import { PlanParametersService } from 'src/app/_services/plan-parameters.service';

@Component({
  selector: 'app-file-creation-project',
  templateUrl: './file-creation-project.component.html',
  styleUrls: ['./file-creation-project.component.scss', './file-creation-project.component.small.scss']
})
export class FileCreationProjectComponent implements OnInit {

  @Input() personNames: string[];

  scenario: string;
  project = undefined;
  inputProject: string;

  projectList = [
    Budget.TypeEnum.Budget,
    Land.TypeEnum.Land,
    OldProperty.TypeEnum.OldProperty,
    NewProperty.TypeEnum.NewProperty,
    HouseConstruction.TypeEnum.HouseConstruction,
    Works.TypeEnum.Works,
    Pinel.TypeEnum.Pinel,
    DebtConsolidation.TypeEnum.DebtConsolidation,
    BalancingAdjustment.TypeEnum.BalancingAdjustment,
    // LMNP.TypeEnum.Lmnp,
  ];
  projectListFilter: string[] = this.projectList;

  constructor(private cdRef: ChangeDetectorRef,
              private caseFormService: CaseFormService,
              private planService: PlanParametersService,
              private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.projectListFilter = this.projectList;
    this.scenario = null;
    this.caseFormService.resetProject();
    this.project = undefined;
  }

  filterProject(value) {
    this.projectListFilter = this.projectList.filter( project => {
      return project.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
      this.projectToString(project).toLowerCase().indexOf(value.toLowerCase()) >= 0
    });
  }

  selectScenario(scenario) {
    if(scenario) {
      this.projectListFilter = [scenario];
      this.scenario = scenario;
      this.caseFormService.createProject(scenario);
      this.project = this.caseFormService.project;
      this.cdRef.detectChanges();
    }
  }

  resetScenario() {
    this.loaderService.setLoading(true);
    this.planService.removeAll(this.caseFormService.id.value, this.caseFormService.asPlans()).pipe(
      take(1)
    ).subscribe( _ => {
      this.loaderService.setLoading(false);
      this.projectListFilter = this.projectList;
      this.scenario = null;
      this.caseFormService.resetProject();
      this.project = undefined;
    });
  }

  projectToString(project) {
    return ProjectStringMap.toString(project);
  }

}
