import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { countries } from 'src/app/utils/countries';
import { BudgetProjectForm } from 'src/app/_models/forms/project-form';
import { Project } from '../project';

@Component({
  selector: 'app-file-creation-project-budget',
  templateUrl: './file-creation-project-budget.component.html',
  styleUrls: ['../file-creation-project.component.scss', '../file-creation-project.component.small.scss']
})
export class FileCreationProjectBudgetComponent extends Project implements OnInit {

  @Input() budget: BudgetProjectForm;
  get administrative_information() { return this.budget.controls.administrative_information as FormGroup; }

  constructor() { super(); }

  ngOnInit(): void {
  }
}
