import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TypedFormArray } from 'src/app/typed-form-array';
import { countries } from 'src/app/utils/countries';
import { PartnerTypeMap } from 'src/app/utils/strings';
import { Partner, PartnerResource, PartnerResourceResponse, PartnerType } from 'src/app/_api';
import { AddressForm } from 'src/app/_models/forms/address-form';
import { PartnerForm } from 'src/app/_models/forms/partner-form';
import { LoaderService } from 'src/app/_services';
import { PartnersService } from 'src/app/_services/partners.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {

  partnerId: string;
  partner: PartnerForm;
  countries = countries;
  loading = false;

  get type() { return this.partner.controls.type; }
  get address() { return this.partner.controls.address as AddressForm; }
  get country() { return this.address.controls.country; }
  get contacts() { return this.partner.controls.contacts as TypedFormArray; }

  partnerTypes = ['NOTARY', 'ESTATE_AGENT', 'BANK', 'BROKER', 'COLLECTOR_ONE_PERCENT_EMPLOYER', 'HOUSE_BUILDER', 'DPE_CHECKER', 'LAND_SURVEYOR', 'BUSINESS_PROVIDER', 'ARCHITECT', 'LAWYER', 'OTHER'];
  constructor(private partnerService: PartnersService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.init();
    this.route.params.subscribe(params => {
      this.partnerId = params.id;
      if(this.partnerId) {
        this.loadPartner(this.partnerId);
        // this.cdRef.detectChanges();
      }
    });
  }

  init() {
    this.partner = new PartnerForm();
    this.addContact();
    this.partner.get('main_contact').valueChanges.subscribe( val => {
      this.contacts.at(0).patchValue(val);
    });
  }

  typeToString(type) {
    return PartnerTypeMap.toString(type);
  }

  addContact() {
    this.contacts.pushValue();
  }

  deleteContact(index) {
    this.contacts.removeAt(index);
  }

  save() {
    const partner: Partner = this.partner.getRawValue();
    let obs: Observable<PartnerResourceResponse>;
    if(this.partnerId) {
      obs = this.partnerService.update(this.partnerId, partner);
    } else {
      obs = this.partnerService.post(partner);
    }
    obs.pipe(take(1)).subscribe(res => {
      console.log('result: ', res);
      this.snackBar.open('Sauvé', 'Ok', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    })
  }

  loadPartner(partnerId) {
    this.loading = true;
    this.partnerService.retrieve(partnerId).pipe(take(1)).subscribe( (response: PartnerResourceResponse) => {
      console.log('received: ', response);
      this.partner.patchValue(response.data.attributes);
      this.loading = false;
    });
  }

  new() {
    this.partnerId = undefined;
    this.partner.reset();
    delete this.partner;
    this.init();
  }

}
