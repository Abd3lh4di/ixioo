import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { countries } from 'src/app/utils/countries';
import { EmployeeForm, IndependantForm, ProfessionForm, SocioProfessionalForm } from 'src/app/_models/forms/profession-form';

@Component({
  selector: 'app-file-creation-profession',
  templateUrl: './file-creation-profession.component.html',
  styleUrls: ['./file-creation-profession.component.scss', './file-creation-profession.component.small.scss']
})
export class FileCreationProfessionComponent implements OnInit {

  @Input() profession: ProfessionForm;
  @Input() age: number;

  get status() { return this.profession.controls.status; }
  get groupSocioPro() { return this.profession.controls.socio_professional_group as FormGroup; }
  get type() { return this.groupSocioPro?.controls.type; }
  get category() { return this.groupSocioPro?.controls.category; }

  get worker() { return this.profession.controls.worker as FormGroup; }
  get contractType()  { return this.worker.controls.contract_type; }
  get subContractType()  { return this.worker.controls.sub_contract_type; }

  get employerAddress()  { return this.worker.controls.employer_address as FormGroup; }
  get employerCountry()  { return this.employerAddress.controls.country as FormGroup; }
  get workplaceAddress()  { return this.worker.controls.workplace_address as FormGroup; }
  get companyCountry()  { return this.workplaceAddress.controls.country; }

  countries = countries;

  constructor() {
  }

  ngOnInit(): void {
  }

  onStatusChanged() {
    this.profession.patchWorker(this.status.value);
  }

  setGroup(typeValue) {
    console.log(this.profession.controls.socio_professional_group)
    console.log(typeValue)
    if(!this.profession.controls.socio_professional_group) {
      this.profession.addControl('socio_professional_group', new SocioProfessionalForm(typeValue));
    } else {
      this.type.setValue(typeValue);
    }
  }

  onSocioProGroupTypeChanged() {
    this.category.setValue(null);
  }

  onContractTypeChanged() {
    this.subContractType.setValue(null);
  }

  onSubContractTypeChanged() {
    if (this.subContractType.value === '') {
      this.subContractType.setValue(null);
    }
  }

}
