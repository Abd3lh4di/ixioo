import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { countries } from '../countries';
import { AcquisitionDestinationMap, AcquisitionNatureMap, AcquisitionStateMap, ProjectStateMap } from '../strings';

@Component({
  selector: 'app-administrative-information',
  templateUrl: './administrative-information.component.html',
  styleUrls: ['./administrative-information.component.scss']
})
export class AdministrativeInformationComponent implements OnInit {

  @Input() administrativeInformation: FormGroup;

  countries = countries;

  get address() { return this.administrativeInformation.controls.address as FormGroup; }
  get city() { return this.address.controls.city; }
  get postal_code() { return this.address.controls.postal_code; }
  get insee_code() { return this.address.controls.insee_code; }
  get country() { return this.address.controls.country; }

  get nature() { return this.administrativeInformation.controls.nature; }
  get state() { return this.administrativeInformation.controls.state; }

  constructor() { }

  ngOnInit(): void {
  }

  destinationToString(type) {
    return AcquisitionDestinationMap.toString(type);
  }
  natureToString(nature) {
    return AcquisitionNatureMap.toString(nature);
  }
  stateToString(state) {
    return AcquisitionStateMap.toString(state);
  }
  projectStateToString(state) {
    return ProjectStateMap.toString(state);
  }

}
