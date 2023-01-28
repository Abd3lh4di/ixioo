import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TypedFormArray } from 'src/app/typed-form-array';
import { DebtConsolidationProjectForm } from 'src/app/_models/forms/project-form';
import { Project } from '../project';


@Component({
  selector: 'app-file-creation-project-debt-consolidation',
  templateUrl: './file-creation-project-debt-consolidation.component.html',
  styleUrls: ['./file-creation-debt-consolidation.component.scss', '../file-creation-project.component.scss', '../file-creation-project.component.small.scss']
})
export class FileCreationProjectDebtConsolidationComponent extends Project implements OnInit {

  @Input() debtConsolidation: DebtConsolidationProjectForm;
  @Input() personNames: string[];

  constructor() { super(); }


  panelOpenedById = {};

  get loans_to_consolidate() { return this.debtConsolidation.controls.loans_to_consolidate as TypedFormArray; }
  get firstLoan() { return this.loans_to_consolidate.at(0)  as FormGroup; }
  get ira() { return this.firstLoan.controls.ira  as FormGroup; }
  get grace_period() { return this.firstLoan.controls.grace_period  as FormGroup; }
  get insurances() { return this.firstLoan.controls.insurances  as TypedFormArray; }
  get smoothable_elements() { return this.firstLoan.controls.smoothable_elements  as TypedFormArray; }


  ngOnInit(): void {
    this.addLoanToConsolidate();
  }

  addLoanToConsolidate() {
    this.loans_to_consolidate.pushValue();
  }

  removeLine(index: number) {
    this.loans_to_consolidate.removeAt(index);
    if (this.loans_to_consolidate.length === 0) {
      this.addLoanToConsolidate();
    }
  }

  removeGrid(index: number) {
    this.loans_to_consolidate.removeAt(index);
  }

  onLineInsuranceChanged(value, line) {
    if (value) {
      line.controls.yearlyInsuranceRate.enable();
    } else {
      line.controls.yearlyInsuranceRate.disable();
    }
  }

  addInsurance() {
    this.insurances.pushValue();
  }
  removeInsurrance(idx) {
    this.insurances.removeAt(idx);
  }

  addSmoothableElement() {
    this.smoothable_elements.pushValue();
  }
  removeSmoothableElement(idx) {
    this.smoothable_elements.removeAt(idx);
  }



}
