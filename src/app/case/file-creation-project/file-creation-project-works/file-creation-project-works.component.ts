import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorksProjectForm } from 'src/app/_models/forms/project-form';
import { Project } from '../project';

@Component({
  selector: 'app-file-creation-project-works',
  templateUrl: './file-creation-project-works.component.html',
  styleUrls: ['../file-creation-project.component.scss', '../file-creation-project.component.small.scss']
})
export class FileCreationProjectWorksComponent extends Project implements OnInit {

  @Input() works: WorksProjectForm;
  get administrative_information() { return this.works.controls.administrative_information as FormGroup; }

  constructor() { super(); }

  ngOnInit(): void {
  }

}
