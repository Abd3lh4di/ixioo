import { FormGroup, FormControl } from '@angular/forms';
import { AddressForm } from './address-form';

export class ProfessionForm extends FormGroup {
  constructor() {
    super({
      status: new FormControl()
    });
  }

  get groupSocioPro() { return this.controls.socio_professional_group as FormGroup; }
  get type() { return this.groupSocioPro?.controls.type; }
  get category() { return this.groupSocioPro?.controls.category; }

  setGroup(typeValue) {
    if(!this.controls.socio_professional_group) {
      this.addControl('socio_professional_group', new SocioProfessionalForm(typeValue));
    } else {
      this.type.setValue(typeValue);
    }
  }

  patchWorker(status: any) {
    this.removeControl('worker');
    switch (status) {
      case 'EMPLOYEE':
        this.addControl('worker', new EmployeeForm());
        this.setGroup('EMPLOYES');
        // this.category.setValue('EMPLOYES_ADMINISTRATIFS_ENTREPRISE');
        break;
      case 'SELFEMPLOYED':
        this.addControl('worker', new IndependantForm());
        this.setGroup('ARTISANS_COMMERCANTS_CHEFS_DENTREPRISE');
        // this.category.setValue('COMMERCANTS_ET_ASSIMILES');
        break;
      case 'RETIRED':
      case 'EARLY_RETIREMENT':
        this.setGroup('RETRAITES');
        // this.category.setValue('ANCIENS_EMPLOYES');
        break;
      case 'STUDENT':
        this.setGroup('AUTRES_PERSONNES_SANS_ACTIVITE_PROFESSIONNELLE');
        this.category.setValue('ELEVES_ETUDIANTS');
        break;
      case 'UNEMPLOYED':
        this.setGroup('AUTRES_PERSONNES_SANS_ACTIVITE_PROFESSIONNELLE');
        // this.category.setValue('CHOMEURS_AYANT_JAMAIS_TRAVAILLE');
        break;
      case 'ANNUITANT':
        this.setGroup('AUTRES_PERSONNES_SANS_ACTIVITE_PROFESSIONNELLE');
        // this.category.setValue('SANS_ACTIVITE_MOINS_60');
        // if ( this.age < 60 ) {
        //   this.category.setValue('SANS_ACTIVITE_MOINS_60');
        // } else {
        //   this.category.setValue('SANS_ACTIVITE_PLUS_60');
        // }
        break;
      default:
        this.type?.setValue(null);
        this.category?.setValue(null);
    }
  }
}

export class SocioProfessionalForm extends FormGroup {
  constructor(typeValue: string) {
    super({
      type: new FormControl(typeValue),
      category: new FormControl(),
    });
  }
}

export class EmployeeForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl('EMPLOYEE'),
      contract_type: new FormControl(),
      sub_contract_type: new FormControl(),
      profession: new FormControl(),
      employer: new FormControl(),
      employer_address: new AddressForm(),
      hiring_date: new FormControl(),
      employees_number: new FormControl(),
      end_contract_date: new FormControl(),
      end_trial_date: new FormControl()
    });
  }
}

export class IndependantForm extends FormGroup {
  constructor() {
    super({
      type: new FormControl('SELFEMPLOYED'),
      activity_nature: new FormControl(),
      activity_start_date: new FormControl(),
      ape_code: new FormControl(),
      business_assets_owner: new FormControl(),
      business_assets_value: new FormControl(),
      collateral: new FormControl(),
      commercial_lease_start_date: new FormControl(),
      commercial_lease_end_date: new FormControl(),
      company_name: new FormControl(),
      employees_number: new FormControl(),
      identification: new FormControl(),
      legal_status: new FormControl(),
      remaining_capital: new FormControl(),
      rent_amount: new FormControl(),
      workplace_address: new AddressForm()
    });
  }
}
