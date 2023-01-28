import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
// import { Acquisition } from 'src/app/api/models';

@Component({
  selector: 'app-file-creation-acquisition',
  templateUrl: './file-creation-acquisition.component.html',
  styleUrls: ['./file-creation-acquisition.component.scss']
})
export class FileCreationAcquisitionComponent implements OnInit {

  @Input() initValue: any;

  @ViewChild('expansionPanel')
  private expansionPanel: MatExpansionPanel;

  formGroup: FormGroup;

  get acquisitionDestination() { return this.formGroup.controls.acquisitionDestination; }
  get acquisitionNature() { return this.formGroup.controls.acquisitionNature; }
  get acquisitionState() { return this.formGroup.controls.acquisitionState; }
  get acquisitionPrice() { return this.formGroup.controls.acquisitionPrice; }
  get acquisitionPriceRenewalWork() { return this.formGroup.controls.acquisitionPriceRenewalWork; }
  get acquisitionDescription() { return this.formGroup.controls.acquisitionDescription; }
  get acquisitionAddress() { return this.formGroup.controls.acquisitionAddress; }
  get acquisitionPostalCode() { return this.formGroup.controls.acquisitionPostalCode; }
  get acquisitionCity() { return this.formGroup.controls.acquisitionCity; }
  get acquisitionSurface() { return this.formGroup.controls.acquisitionSurface; }
  get acquisitionLandSurface() { return this.formGroup.controls.acquisitionLandSurface; }
  get acquisitionFutureSurface() { return this.formGroup.controls.acquisitionFutureSurface; }
  get acquisitionAnnexesSurface() { return this.formGroup.controls.acquisitionAnnexesSurface; }
  get acquisitionRoomsNumber() { return this.formGroup.controls.acquisitionRoomsNumber; }
  get acquisitionDPE() { return this.formGroup.controls.acquisitionDPE; }
  get acquisitionCadastre() { return this.formGroup.controls.acquisitionCadastre; }

  get compromisDate() { return this.formGroup.controls.compromisDate; }
  get conditionsSuspensivesDate() { return this.formGroup.controls.conditionsSuspensivesDate; }
  get signatureActeDate() { return this.formGroup.controls.signatureActeDate; }
  get deliveryDate() { return this.formGroup.controls.deliveryDate; }

  constructor(private fb: FormBuilder) {
  }

  value(): any {
    return this.formGroup.getRawValue();
  }


  ngOnInit(): void {
    this.formGroup = this.fb.group({
      acquisitionDestination: new FormControl('MAIN_PROPERTY'),
      acquisitionNature: new FormControl('FLAT'),
      acquisitionState: new FormControl(''),
      acquisitionPrice: new FormControl(''),
      acquisitionPriceRenewalWork: new FormControl(''),
      acquisitionDescription: new FormControl(''),
      acquisitionAddress: new FormControl(''),
      acquisitionPostalCode: new FormControl(''),
      acquisitionCity: new FormControl(''),
      acquisitionSurface: new FormControl(''),
      acquisitionLandSurface: new FormControl(''),
      acquisitionFutureSurface: new FormControl(''),
      acquisitionAnnexesSurface: new FormControl(''),
      acquisitionRoomsNumber: new FormControl(''),
      acquisitionDPE: new FormControl(''),
      acquisitionCadastre: new FormControl(''),

      compromisDate: new FormControl(''),
      conditionsSuspensivesDate: new FormControl(''),
      signatureActeDate: new FormControl(''),
      deliveryDate: new FormControl(''),
    });
    if (this.initValue) {
        this.formGroup.patchValue(this.initValue);
    }

  }

  invalid() {
    this.formGroup.markAllAsTouched();
    return this.formGroup.invalid;
  }

  expand() {
    this.expansionPanel.open();
  }
  collapse() {
    this.expansionPanel.close();
  }

  formatLocation() {
    const acquisitionAddress = (this.acquisitionAddress && this.acquisitionAddress.value) ? this.acquisitionAddress.value : undefined;
    const acquisitionPostalCode = (this.acquisitionPostalCode && this.acquisitionPostalCode.value) ? this.acquisitionPostalCode.value : undefined;
    const acquisitionCity = (this.acquisitionCity && this.acquisitionCity.value) ? this.acquisitionCity.value : undefined;
    return { address: acquisitionAddress, postal_code: acquisitionPostalCode, city: acquisitionCity };
  }

  formatDates() {
    const compromisDate = (this.compromisDate && this.compromisDate.value) ? this.compromisDate.value : undefined;
    const conditionsSuspensivesDate = (this.conditionsSuspensivesDate && this.conditionsSuspensivesDate.value) ? this.conditionsSuspensivesDate.value : undefined;
    const signatureActeDate = (this.signatureActeDate && this.signatureActeDate.value) ? this.signatureActeDate.value : undefined;
    const deliveryDate = (this.deliveryDate && this.deliveryDate.value) ? this.deliveryDate.value : undefined;
    return { compromis_date: compromisDate, end_condition_suspensive_date: conditionsSuspensivesDate, signature_date: signatureActeDate, delivery_date: deliveryDate };
  }

  formatSurfaces() {
    const acquisitionSurface = (this.acquisitionSurface && this.acquisitionSurface.value) ? this.acquisitionSurface.value : undefined;
    const acquisitionAnnexesSurface = (this.acquisitionAnnexesSurface && this.acquisitionAnnexesSurface.value) ? this.acquisitionAnnexesSurface.value : undefined;
    const acquisitionLandSurface = (this.acquisitionLandSurface && this.acquisitionLandSurface.value) ? this.acquisitionLandSurface.value : undefined;
    const acquisitionFutureSurface = (this.acquisitionFutureSurface && this.acquisitionFutureSurface.value) ? this.acquisitionFutureSurface.value : undefined;
    return { surface: acquisitionSurface, additional_surface: acquisitionAnnexesSurface, land_surface: acquisitionLandSurface, future_surface: acquisitionFutureSurface };
  }

  formatAcquisition() {
      // const acquisition: Acquisition = {
      //       description: (this.acquisitionDescription && this.acquisitionDescription.value) ? this.acquisitionDescription.value : undefined,
      //       destination: (this.acquisitionDestination && this.acquisitionDestination.value) ? this.acquisitionDestination.value : undefined,
      //       dpe_rate: (this.acquisitionDPE && this.acquisitionDPE.value) ? this.acquisitionDPE.value : undefined,
      //       nature: (this.acquisitionNature && this.acquisitionNature.value) ? this.acquisitionNature.value : undefined,
      //       land_register_reference: (this.acquisitionCadastre && this.acquisitionCadastre.value) ? this.acquisitionCadastre.value : undefined,

      //       price: (this.acquisitionPrice && this.acquisitionPrice.value) ? this.acquisitionPrice.value : undefined,
      //       rooms: (this.acquisitionRoomsNumber && this.acquisitionRoomsNumber.value) ? this.acquisitionRoomsNumber.value : undefined,
      //       state: (this.acquisitionState && this.acquisitionState.value) ? this.acquisitionState.value : undefined,
      //       surfaces: this.formatSurfaces(),
      //       dates: this.formatDates(),
      //       location: this.formatLocation()
      //   };
      // return acquisition;
      return undefined;
  }

}
