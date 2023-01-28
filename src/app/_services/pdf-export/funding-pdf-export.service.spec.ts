import { TestBed } from '@angular/core/testing';
import { FundingPDFExportService } from './funding-pdf-export.service';

import { Case } from '../../_api/model/case';
import { PtzLoan } from '../../_api/model/ptzLoan';
import { BossLoan } from '../../_api/model/bossLoan';
import { ActivePartner } from '../../_api/model/activePartner';
import { FundingParameters } from '../../_api/model/fundingParameters';
import { FundingResults } from '../../_api/model/fundingResults';
import { Land } from '../../_api/model/land';
import { Works } from '../../_api/model/works';
import { OldProperty } from '../../_api/model/oldProperty';
import { NewProperty } from '../../_api/model/newProperty';
import { HouseConstruction } from '../../_api/model/houseConstruction';
import { AdministrativeInformation } from '../../_api/model/administrativeInformation';
import { Contact } from '../../_api/model/contact';
import { Surfaces } from '../../_api/model/surfaces';

import { IconsSvg } from './icons-svg';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { BalancingAdjustment } from 'src/app/_api';

describe('FundingPDFExportService', () => {

  let aFundingPDFExportService: FundingPDFExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    aFundingPDFExportService = TestBed.inject(FundingPDFExportService);
  });


  it('Partner must be correctly extracted', () => {
    const generationDate = new Date('2020-12-16T23:28:06');

    const aPartners: ActivePartner[] = [{type: 'NOTARY', name: 'Michel, Martin et associés', phone_number: '04.93.33.22.12', email: 'contact@michelmartinassociates.fr',
      address: {address: '2, rue des fleurs', postal_code: '06300', city: 'Nice'},
      contact: {courtesy:'MRS', first_name: 'Jean', last_name: 'Martin', phone_number: '04.93.33.22.11', email: 'martin@michelmartinassociates.fr'},
      comment: 'La clerc, Mme Dupond, est trés disponible.'},
      {type: 'BROKER', name: 'Hypo', phone_number: '09.78.350.700', email: 'contact@lowtaux.com',
      address: {address: '36-38, Route de Rennes', postal_code: '44300', city: 'Nantes'}, agreement_number: '09051593',
      contact: {first_name: 'Fabrice', last_name: 'Hamon',  phone_number: '06.12.19.35.70', email: 'fabrice.hamon@lowtaux.fr'}},
      {type: 'ESTATE_AGENT', name: 'In Pierre We Trust', phone_number: '05.56.56.56.89', email: 'contact@alabellepierre.com',
      address: {address: '12, Avenue des Pierres qui roulent n\'amassent pas mousse', postal_code: '44300', city: 'Nantes'},
      contact: {first_name: 'Jean-Pierre', last_name: 'Pierre', phone_number: '06.78.78.78.78', email: 'jpp@alabellepierre.fr'} }];

    const anExtractedPartner = aFundingPDFExportService.extractPartnerContact('BROKER', aPartners);
    const expectedResult = JSON.stringify({type: 'BROKER', name: 'Hypo', logo_uri: '', address: {address: '36-38, Route de Rennes', postal_code: '44300', city: 'Nantes', country: '', insee_code: ''}, contact: {contact_courtesy: '', contact_first_name: 'Fabrice', contact_last_name: 'Hamon', contact_email: 'fabrice.hamon@lowtaux.fr', contact_phone_number: '06.12.19.35.70', comment: ''}, email: 'contact@lowtaux.com', phone_number: '09.78.350.700', role: '', sub_entity: '', agreement_number: '09051593', comment: ''});
    // console.log(JSON.stringify(anExtractedPartner));
    // console.log(expectedResult);
    expect(JSON.stringify(anExtractedPartner)).toBe(expectedResult);
  });


  it('PTZ and BossLoan info must be correctly encoded', () => {
    const generationDate = new Date('2020-12-16T23:28:06');

    const aPtzLoan: PtzLoan = {type: 'PTZ_LOAN'};
    const aBossLoan: BossLoan = {type: 'BOSS_LOAN'};
    const aLoans = [aPtzLoan, aBossLoan];
    const aFundingParameters: FundingParameters = { loans: aLoans };
    // FundingResults whith no PTZ nor Boss loans
    const aFundingResults: FundingResults = { status: 'OPTIMAL', loans: [] };

    const aPtzSection = aFundingPDFExportService.encodePTZSection(aFundingParameters.loans, aFundingResults.loans);
    const aBossLoanSection = aFundingPDFExportService.encodeBossLoanSection(aFundingParameters.loans, aFundingResults.loans);

    expect(JSON.stringify(aPtzSection)).toBe(JSON.stringify(['<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M21.19,21.19L2.81,2.81L1.39,4.22l2.27,2.27C2.61,8.07,2,9.96,2,12c0,5.52,4.48,10,10,10c2.04,0,3.93-0.61,5.51-1.66 l2.27,2.27L21.19,21.19z M10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l0.18-0.18l1.41,1.41L10.59,16.6z M13.59,10.76l-7.1-7.1 C8.07,2.61,9.96,2,12,2c5.52,0,10,4.48,10,10c0,2.04-0.61,3.93-1.66,5.51l-5.34-5.34l2.65-2.65l-1.41-1.41L13.59,10.76z"/></svg>', 'Le projet n\'est pas éligible au PTZ.']));
    expect(JSON.stringify(aBossLoanSection)).toBe(JSON.stringify(['<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M21.19,21.19L2.81,2.81L1.39,4.22l2.27,2.27C2.61,8.07,2,9.96,2,12c0,5.52,4.48,10,10,10c2.04,0,3.93-0.61,5.51-1.66 l2.27,2.27L21.19,21.19z M10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l0.18-0.18l1.41,1.41L10.59,16.6z M13.59,10.76l-7.1-7.1 C8.07,2.61,9.96,2,12,2c5.52,0,10,4.48,10,10c0,2.04-0.61,3.93-1.66,5.51l-5.34-5.34l2.65-2.65l-1.41-1.41L13.59,10.76z"/></svg>', 'Le projet n\'est pas éligible au 1% patronal.']));

    // FundingResults whith both PTZ and Boss loans
    const aSecondFundingResults: FundingResults = { status: 'OPTIMAL', loans: [{ type: 'PTZ_LOAN', yearly_rate: 0, duration_months: 180, amount: 20000, amortizations: [], interests: [], insurances: [], released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0 }, { type: 'BOSS_LOAN', yearly_rate: 0, duration_months: 180, amount: 20000, amortizations: [], interests: [], insurances: [], released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0 }] };
    const aSecondPtzSection = aFundingPDFExportService.encodePTZSection(aFundingParameters.loans, aSecondFundingResults.loans);
    const aSecondBossLoanSection = aFundingPDFExportService.encodeBossLoanSection(aFundingParameters.loans, aSecondFundingResults.loans);

    expect(JSON.stringify(aSecondPtzSection)).toBe(JSON.stringify(['<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>', 'Le projet est éligible au PTZ.']));
    expect(JSON.stringify(aSecondBossLoanSection)).toBe(JSON.stringify(['<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>', 'Le projet est éligible au 1% patronal.']));
  });


  it('Fundings balance Land table must be correctly formatted', () => {
    const aFundingResults: FundingResults = { status: 'OPTIMAL', summary: { total_personal_funding: 0, total_guaranty: 10 } };
    const aLandProject: Land = { type: 'LAND', expenses: { price: 1, other_expenses: 2, fees: {agency_fees: 3, notary_fees: 6 } } };
    const aFundingParameters: FundingParameters = { loans: [], funding_fees: { broker_fees: 4, file_management_fees:5 }};
    aFundingPDFExportService.aParams = aFundingParameters;
    const aFundingTable = aFundingPDFExportService.generateBalanceTable(aLandProject, aFundingResults, 'y', 'b', 'g', 'p');

    const expectedResult = JSON.stringify([{table:{widths:[20,170,'auto',100,'auto'],headerRows:2,body:[[{text:'',fillColor:'y',alignment:'center',color:'white'},{text:'Prix du terrain',fillColor:'y',color:'white'},{text:'1,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'Total projet',rowSpan:2,fillColor:'y',color:'white'},{text:'3,00 €',rowSpan:2,fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Dépense ou frais annexes',fillColor:'y',color:'white'},{text:'2,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de courtage',fillColor:'b',color:'white'},{text:'4,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'Total frais',rowSpan:4,fillColor:'b',color:'white'},{text:'28,00 €',rowSpan:4,fillColor:'b',alignment:'right',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de dossier',fillColor:'b',color:'white'},{text:'5,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de notaire',fillColor:'b',color:'white'},{text:'6,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais d\'agence',fillColor:'b',color:'white'},{text:'3,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de garanties',fillColor:'b',color:'white'},{text:'10,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'-',fillColor:'g',alignment:'center',color:'white'},{text:'Apport personnel',fillColor:'g',color:'white'},{text:'0,00 €',fillColor:'g',alignment:'right',color:'white'},{text:''},{text:''}],[{text:'=',fillColor:'p',alignment:'center',color:'white'},{text:'Montant financé',fillColor:'p',color:'white'},{text:'31,00 €',fillColor:'p',alignment:'right',color:'white'},{text:''},{text:''}]]},layout:'noBorders'}]);
     expect(JSON.stringify(aFundingTable)).toBe(expectedResult);
  });

  it('Fundings balance Works table must be correctly formatted', () => {
    const aFundingResults: FundingResults = { status: 'OPTIMAL', summary: { total_personal_funding: 0, total_guaranty: 10 } };
    const aWorksProject: Works = { type: 'WORKS', expenses: { price: 1, other_expenses: 2 } };
    const aFundingParameters: FundingParameters = { loans: [], funding_fees: { broker_fees: 4, file_management_fees:5 }};
    aFundingPDFExportService.aParams = aFundingParameters;
    const aFundingTable = aFundingPDFExportService.generateBalanceTable(aWorksProject, aFundingResults, 'y', 'b', 'g', 'p');

    const expectedResult = JSON.stringify([{table:{widths:[20,170,'auto',100,'auto'],headerRows:2,body:[[{text:'',fillColor:'y',alignment:'center',color:'white'},{text:'Prix des travaux',fillColor:'y',color:'white'},{text:'1,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'Total projet',rowSpan:2,fillColor:'y',color:'white'},{text:'3,00 €',rowSpan:2,fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Dépense ou frais annexes',fillColor:'y',color:'white'},{text:'2,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de courtage',fillColor:'b',color:'white'},{text:'4,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'Total frais',rowSpan:4,fillColor:'b',color:'white'},{text:'19,00 €',rowSpan:4,fillColor:'b',alignment:'right',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de dossier',fillColor:'b',color:'white'},{text:'5,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de garanties',fillColor:'b',color:'white'},{text:'10,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'-',fillColor:'g',alignment:'center',color:'white'},{text:'Apport personnel',fillColor:'g',color:'white'},{text:'0,00 €',fillColor:'g',alignment:'right',color:'white'},{text:''},{text:''}],[{text:'=',fillColor:'p',alignment:'center',color:'white'},{text:'Montant financé',fillColor:'p',color:'white'},{text:'22,00 €',fillColor:'p',alignment:'right',color:'white'},{text:''},{text:''}]]},layout:'noBorders'}]);

    // console.log(expectedResult);
    // console.log(JSON.stringify(aFundingTable));

    expect(JSON.stringify(aFundingTable)).toBe(expectedResult);
  });

  it('Fundings balance OldProperty table must be correctly formatted', () => {
    const aFundingResults: FundingResults = { status: 'OPTIMAL', summary: { total_personal_funding: 0, total_guaranty: 10 } };
    const aOldPropertyProject: OldProperty = { type: 'OLD_PROPERTY', expenses: { price: 1, other_expenses: 2, works_price: 11, furnitures_price: 12, fees: { agency_fees: 3, notary_fees: 6  } } };
    const aFundingParameters: FundingParameters = { loans: [], funding_fees: { broker_fees: 4, file_management_fees:5 }};
    aFundingPDFExportService.aParams = aFundingParameters;
    const aFundingTable = aFundingPDFExportService.generateBalanceTable(aOldPropertyProject, aFundingResults, 'y', 'b', 'g', 'p');

    const expectedResult = JSON.stringify([{table:{widths:[20,170,'auto',100,'auto'],headerRows:2,body:[[{text:'',fillColor:'y',alignment:'center',color:'white'},{text:'Prix du bien',fillColor:'y',color:'white'},{text:'1,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'Total projet',rowSpan:3,fillColor:'y',color:'white'},{text:'14,00 €',rowSpan:3,fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Prix des travaux',fillColor:'y',color:'white'},{text:'11,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Dépense ou frais annexes',fillColor:'y',color:'white'},{text:'2,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de courtage',fillColor:'b',color:'white'},{text:'4,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'Total frais',rowSpan:5,fillColor:'b',color:'white'},{text:'28,00 €',rowSpan:5,fillColor:'b',alignment:'right',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de dossier',fillColor:'b',color:'white'},{text:'5,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de notaire',fillColor:'b',color:'white'},{text:'6,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais d\'agence',fillColor:'b',color:'white'},{text:'3,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de garanties',fillColor:'b',color:'white'},{text:'10,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'-',fillColor:'g',alignment:'center',color:'white'},{text:'Apport personnel',fillColor:'g',color:'white'},{text:'0,00 €',fillColor:'g',alignment:'right',color:'white'},{text:''},{text:''}],[{text:'=',fillColor:'p',alignment:'center',color:'white'},{text:'Montant financé',fillColor:'p',color:'white'},{text:'42,00 €',fillColor:'p',alignment:'right',color:'white'},{text:''},{text:''}]]},layout:'noBorders'}]);
    expect(JSON.stringify(aFundingTable)).toBe(expectedResult);
  });

  it('Fundings balance BalancingAdjustment table must be correctly formatted', () => {
    const aFundingResults: FundingResults = { status: 'OPTIMAL', summary: { total_personal_funding: 0, total_guaranty: 10 } };
    const aBalancingAdjustmentProject: BalancingAdjustment = { type: 'BALANCING_ADJUSTMENT', expenses: { total_balancing_adjustment_value: 1, other_expenses: 2, works_price: 11, furnitures_price: 12, fees: { notary_fees: 6  } } };
    const aFundingParameters: FundingParameters = { loans: [], funding_fees: { broker_fees: 4, file_management_fees:5 }};
    aFundingPDFExportService.aParams = aFundingParameters;
    const aFundingTable = aFundingPDFExportService.generateBalanceTable(aBalancingAdjustmentProject, aFundingResults, 'y', 'b', 'g', 'p');

    // console.log(JSON.stringify(aFundingTable));
    const expectedResult = JSON.stringify([{table:{widths:[20,170,'auto',100,'auto'],headerRows:2,body:[[{text:'',fillColor:'y',alignment:'center',color:'white'},{text:'Montant total de la soulte',fillColor:'y',color:'white'},{text:'1,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'Total projet',rowSpan:3,fillColor:'y',color:'white'},{text:'14,00 €',rowSpan:3,fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Prix des travaux',fillColor:'y',color:'white'},{text:'11,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Dépense ou frais annexes',fillColor:'y',color:'white'},{text:'2,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de courtage',fillColor:'b',color:'white'},{text:'4,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'Total frais',rowSpan:4,fillColor:'b',color:'white'},{text:'25,00 €',rowSpan:4,fillColor:'b',alignment:'right',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de dossier',fillColor:'b',color:'white'},{text:'5,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de notaire',fillColor:'b',color:'white'},{text:'6,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de garanties',fillColor:'b',color:'white'},{text:'10,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'-',fillColor:'g',alignment:'center',color:'white'},{text:'Apport personnel',fillColor:'g',color:'white'},{text:'0,00 €',fillColor:'g',alignment:'right',color:'white'},{text:''},{text:''}],[{text:'=',fillColor:'p',alignment:'center',color:'white'},{text:'Montant financé',fillColor:'p',color:'white'},{text:'39,00 €',fillColor:'p',alignment:'right',color:'white'},{text:''},{text:''}]]},layout:'noBorders'}]);
    expect(JSON.stringify(aFundingTable)).toBe(expectedResult);
  });

  it('Fundings balance NewProperty table must be correctly formatted', () => {
    const aFundingResults: FundingResults = { status: 'OPTIMAL', summary: { total_personal_funding: 0, total_guaranty: 10  } };
    const aNewPropertysProject: NewProperty = { type: 'NEW_PROPERTY', expenses: { price: 1, other_expenses: 2, vat: 11, other_taxes: 12, fees: { agency_fees: 3, notary_fees: 6  } } };
    const aFundingParameters: FundingParameters = { loans: [], funding_fees: { broker_fees: 4, file_management_fees:5 }};
    aFundingPDFExportService.aParams = aFundingParameters;
    const aFundingTable = aFundingPDFExportService.generateBalanceTable(aNewPropertysProject, aFundingResults, 'y', 'b', 'g', 'p');

    const expectedResult = JSON.stringify([{table:{widths:[20,170,'auto',100,'auto'],headerRows:2,body:[[{text:'',fillColor:'y',alignment:'center',color:'white'},{text:'Prix du bien',fillColor:'y',color:'white'},{text:'1,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'Total projet',rowSpan:4,fillColor:'y',color:'white'},{text:'26,00 €',rowSpan:4,fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'TVA',fillColor:'y',color:'white'},{text:'11,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Autre taxes',fillColor:'y',color:'white'},{text:'12,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Dépense ou frais annexes',fillColor:'y',color:'white'},{text:'2,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de courtage',fillColor:'b',color:'white'},{text:'4,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'Total frais',rowSpan:4,fillColor:'b',color:'white'},{text:'28,00 €',rowSpan:4,fillColor:'b',alignment:'right',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de dossier',fillColor:'b',color:'white'},{text:'5,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de notaire',fillColor:'b',color:'white'},{text:'6,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais d\'agence',fillColor:'b',color:'white'},{text:'3,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de garanties',fillColor:'b',color:'white'},{text:'10,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'-',fillColor:'g',alignment:'center',color:'white'},{text:'Apport personnel',fillColor:'g',color:'white'},{text:'0,00 €',fillColor:'g',alignment:'right',color:'white'},{text:''},{text:''}],[{text:'=',fillColor:'p',alignment:'center',color:'white'},{text:'Montant financé',fillColor:'p',color:'white'},{text:'54,00 €',fillColor:'p',alignment:'right',color:'white'},{text:''},{text:''}]]},layout:'noBorders'}]);
    expect(JSON.stringify(aFundingTable)).toBe(expectedResult);
  });

  it('Fundings balance HouseConstruction table must be correctly formatted', () => {
    const aFundingResults: FundingResults = { status: 'OPTIMAL', summary: { total_personal_funding: 0, total_guaranty: 10  } };
    const aHouseConstructionProject: HouseConstruction = { type: 'HOUSE_CONSTRUCTION', expenses: { land_price: 1, construction_price: 21, infrastructure_price: 22, building_insurance: 23, vat: 24, other_taxes: 25, other_expenses: 2, fees: { agency_fees: 3, notary_fees: 6  } } };
    const aFundingParameters: FundingParameters = { loans: [], funding_fees: { broker_fees: 4, file_management_fees:5 }};
    aFundingPDFExportService.aParams = aFundingParameters;
    const aFundingTable = aFundingPDFExportService.generateBalanceTable(aHouseConstructionProject, aFundingResults, 'y', 'b', 'g', 'p');

    const expectedResult = JSON.stringify([{table:{widths:[20,170,'auto',100,'auto'],headerRows:2,body:[[{text:'',fillColor:'y',alignment:'center',color:'white'},{text:'Prix du terrain',fillColor:'y',color:'white'},{text:'1,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'Total projet',rowSpan:7,fillColor:'y',color:'white'},{text:'118,00 €',rowSpan:7,fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Prix de la construction',fillColor:'y',color:'white'},{text:'21,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'',fillColor:'y',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Prix de la viabilisation',fillColor:'y',color:'white'},{text:'22,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'118,00 €',fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Assurance dommage-ouvrage',fillColor:'y',color:'white'},{text:'23,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'118,00 €',fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'TVA',fillColor:'y',color:'white'},{text:'24,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'118,00 €',fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Autre taxes',fillColor:'y',color:'white'},{text:'25,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'118,00 €',fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'y',alignment:'center',color:'white'},{text:'Dépense ou frais annexes',fillColor:'y',color:'white'},{text:'2,00 €',fillColor:'y',alignment:'right',color:'white'},{text:'',fillColor:'y',color:'white'},{text:'118,00 €',fillColor:'y',alignment:'right',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de courtage',fillColor:'b',color:'white'},{text:'4,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'Total frais',rowSpan:4,fillColor:'b',color:'white'},{text:'28,00 €',rowSpan:4,fillColor:'b',alignment:'right',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de dossier',fillColor:'b',color:'white'},{text:'5,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de notaire',fillColor:'b',color:'white'},{text:'6,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais d\'agence',fillColor:'b',color:'white'},{text:'3,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'+',fillColor:'b',alignment:'center',color:'white'},{text:'Frais de garanties',fillColor:'b',color:'white'},{text:'10,00 €',fillColor:'b',alignment:'right',color:'white'},{text:'',fillColor:'b',color:'white'},{text:'',fillColor:'b',color:'white'}],[{text:'-',fillColor:'g',alignment:'center',color:'white'},{text:'Apport personnel',fillColor:'g',color:'white'},{text:'0,00 €',fillColor:'g',alignment:'right',color:'white'},{text:''},{text:''}],[{text:'=',fillColor:'p',alignment:'center',color:'white'},{text:'Montant financé',fillColor:'p',color:'white'},{text:'146,00 €',fillColor:'p',alignment:'right',color:'white'},{text:''},{text:''}]]},layout:'noBorders'}]);
    expect(JSON.stringify(aFundingTable)).toBe(expectedResult);
  });


  it('AdministrativeInformation must be correctly formatted', () => {
    const aAdministrativeInformation: AdministrativeInformation = { nature: 'FLAT',
                                                                    state : 'NEW',
                                                                    destination: 'MAIN_PROPERTY',
                                                                    address: {address: '9, rue des roses', postal_code: '06200', city: 'Nice', country: 'France', insee_code: '06088'},
                                                                    project_dates: {sales_agreement_date: '2019-06-24T14:15:22Z', conditions_precedent_end_date: '2019-06-25T14:15:22Z',  signature_date: '2019-06-26T14:15:22Z'},
                                                                    land_register_reference: 'BT1458',
                                                                    description: 'Un beau bien'};
    const aEncodedAdministrativeInformation = aFundingPDFExportService.encodeAdministrativeInformation(aAdministrativeInformation);

    const expectedResult = JSON.stringify([{columns:[{width:'50%',text:'Nature de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Appartement',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Etat de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Neuf',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Destination de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Résidence principale',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Adresse d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'9, rue des roses, 06200, Nice, France',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Code INSEE de la zone d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'06088',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature du compromis:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de levée des conditions suspensives:'},{width:'25%',style:'caseStyleBold',text:'25 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature:'},{width:'25%',style:'caseStyleBold',text:'26 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Parcelle cadastrale:'},{width:'25%',style:'caseStyleBold',text:'BT1458',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Description:'},{width:'25%',style:'caseStyleBold',text:'Un beau bien',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]}]);
    expect(JSON.stringify(aEncodedAdministrativeInformation)).toBe(expectedResult);
  });


  it('Land project must be correctly formatted', () => {
    const aAdministrativeInformation: AdministrativeInformation = { nature: 'LAND',
                                                                    state : 'RAW_LAND',
                                                                    destination: 'MAIN_PROPERTY',
                                                                    address: {address: '9, rue des roses', postal_code: '06200', city: 'Nice', country: 'France', insee_code: '06088'},
                                                                    project_dates: {sales_agreement_date: '2019-06-24T14:15:22Z', conditions_precedent_end_date: '2019-06-25T14:15:22Z',  signature_date: '2019-06-26T14:15:22Z'},
                                                                    land_register_reference: 'BT1458',
                                                                    description: 'Un beau bien'};

    const aSeller: Contact = {courtesy: 'MR', first_name: 'Jean', last_name: 'LeVendeur', email: 'jean:@levendeur.com', phone_number: '123456789', comment: 'Un bon vendeur'};

    const aProject: Land = { type: 'LAND', project_state: 'BEFORE_COMPROMIS', administrative_information: aAdministrativeInformation, seller: aSeller };

    const aEncodedProject = aFundingPDFExportService.encodeProject(aProject);

    const expectedResult = JSON.stringify([{style:'h2',text:'Informations relatives au projet'},{columns:[{width:'50%',text:'Etat d\'avancement du projet:'},{width:'25%',style:'caseStyleBold',text:'Avant compromis',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nature de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Terrain',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Etat de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Terrain',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Destination de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Résidence principale',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Adresse d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'9, rue des roses, 06200, Nice, France',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Code INSEE de la zone d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'06088',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature du compromis:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de levée des conditions suspensives:'},{width:'25%',style:'caseStyleBold',text:'25 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature:'},{width:'25%',style:'caseStyleBold',text:'26 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Parcelle cadastrale:'},{width:'25%',style:'caseStyleBold',text:'BT1458',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Description:'},{width:'25%',style:'caseStyleBold',text:'Un beau bien',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface:'},{width:'25%',style:'caseStyleBold',text:' m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h2',text:'Vendeur:'},{columns:[{width:'50%',text:'Civilité:'},{width:'25%',style:'caseStyleBold',text:'M.',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nom:'},{width:'25%',style:'caseStyleBold',text:'Jean',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Prénom:'},{width:'25%',style:'caseStyleBold',text:'LeVendeur',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Email:'},{width:'25%',style:'caseStyleBold',text:'jean:@levendeur.com',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Téléphone:'},{width:'25%',style:'caseStyleBold',text:'123456789',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Commentaire:'},{width:'25%',style:'caseStyleBold',text:'Un bon vendeur',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]}]);
    expect(JSON.stringify(aEncodedProject)).toBe(expectedResult);
  });


  it('Works project must be correctly formatted', () => {
    const aAdministrativeInformation: AdministrativeInformation = { nature: 'LAND',
                                                                    state : 'WORKS',
                                                                    destination: 'MAIN_PROPERTY',
                                                                    address: {address: '9, rue des roses', postal_code: '06200', city: 'Nice', country: 'France', insee_code: '06088'},
                                                                    project_dates: {sales_agreement_date: '2019-06-24T14:15:22Z', conditions_precedent_end_date: '2019-06-25T14:15:22Z',  signature_date: '2019-06-26T14:15:22Z'},
                                                                    land_register_reference: 'BT1458',
                                                                    description: 'Un beau bien'};

    const aSurfaces: Surfaces = {surface: 1, additional_surface: 2, land_surface: 0};
    const aProject: Works = { type: 'WORKS',
                              administrative_information: aAdministrativeInformation,
                              surfaces: aSurfaces,
                              construction_date: '2019-06-24T14:15:22Z',
                              construction_norm: 'RT_2012',
                              delivery_date: '2023-06-24T14:15:22Z',
                              lot_number: '45',
                              rooms_count: 4,
                              dpe_rate: 'C' };

    const aEncodedProject = aFundingPDFExportService.encodeProject(aProject);

    const expectedResult = JSON.stringify([{style:'h2',text:'Informations relatives au projet'},{columns:[{width:'50%',text:'Nature de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Terrain',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Etat de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Travaux seuls',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Destination de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Résidence principale',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Adresse d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'9, rue des roses, 06200, Nice, France',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Code INSEE de la zone d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'06088',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature du compromis:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de levée des conditions suspensives:'},{width:'25%',style:'caseStyleBold',text:'25 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature:'},{width:'25%',style:'caseStyleBold',text:'26 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Parcelle cadastrale:'},{width:'25%',style:'caseStyleBold',text:'BT1458',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Description:'},{width:'25%',style:'caseStyleBold',text:'Un beau bien',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface:'},{width:'25%',style:'caseStyleBold',text:'1 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface des annexes:'},{width:'25%',style:'caseStyleBold',text:'2 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface du terrain:'},{width:'25%',style:'caseStyleBold',text:'',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de construction:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Norme de construction:'},{width:'25%',style:'caseStyleBold',text:'RT 2012',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de livraison:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2023',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Numéro de lot:'},{width:'25%',style:'caseStyleBold',text:'45',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nombre de pièces:'},{width:'25%',style:'caseStyleBold',text:4,alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'DPE:'},{width:'25%',style:'caseStyleBold',text:'C',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]}]);
    expect(JSON.stringify(aEncodedProject)).toBe(expectedResult);
  });


  it('OldProperty project must be correctly formatted', () => {
    const aAdministrativeInformation: AdministrativeInformation = { nature: 'FLAT',
                                                                    state : 'OLD',
                                                                    destination: 'MAIN_PROPERTY',
                                                                    address: {address: '9, rue des roses', postal_code: '06200', city: 'Nice', country: 'France', insee_code: '06088'},
                                                                    project_dates: {sales_agreement_date: '2019-06-24T14:15:22Z', conditions_precedent_end_date: '2019-06-25T14:15:22Z',  signature_date: '2019-06-26T14:15:22Z'},
                                                                    land_register_reference: 'BT1458',
                                                                    description: 'Un beau bien'};

    const aSeller: Contact = {courtesy: 'MR', first_name: 'Jean', last_name: 'LeVendeur', email: 'jean:@levendeur.com', phone_number: '123456789', comment: 'Un bon vendeur'};

    const aSurfaces: Surfaces = {surface: 1, additional_surface: 2, land_surface: 0};

    const aProject: OldProperty = { type: 'OLD_PROPERTY',
                                    project_state: 'BEFORE_COMPROMIS',
                                    administrative_information: aAdministrativeInformation,
                                    seller: aSeller,
                                    surfaces: aSurfaces,
                                    construction_date: '2019-06-24T14:15:22Z',
                                    construction_norm: 'RT_2012',
                                    lot_number: '45',
                                    rooms_count: 4,
                                    dpe_rate: 'C'  };

    const aEncodedProject = aFundingPDFExportService.encodeProject(aProject);

    const expectedResult = JSON.stringify([{style:'h2',text:'Informations relatives au projet'},{columns:[{width:'50%',text:'Etat d\'avancement du projet:'},{width:'25%',style:'caseStyleBold',text:'Avant compromis',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nature de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Appartement',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Etat de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Ancien sans travaux',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Destination de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Résidence principale',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Adresse d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'9, rue des roses, 06200, Nice, France',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Code INSEE de la zone d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'06088',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature du compromis:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de levée des conditions suspensives:'},{width:'25%',style:'caseStyleBold',text:'25 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature:'},{width:'25%',style:'caseStyleBold',text:'26 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Parcelle cadastrale:'},{width:'25%',style:'caseStyleBold',text:'BT1458',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Description:'},{width:'25%',style:'caseStyleBold',text:'Un beau bien',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface:'},{width:'25%',style:'caseStyleBold',text:'1 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface des annexes:'},{width:'25%',style:'caseStyleBold',text:'2 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface du terrain:'},{width:'25%',style:'caseStyleBold',text:'',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de construction:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Norme de construction:'},{width:'25%',style:'caseStyleBold',text:'RT 2012',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Numéro de lot:'},{width:'25%',style:'caseStyleBold',text:'45',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nombre de pièces:'},{width:'25%',style:'caseStyleBold',text:4,alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'DPE:'},{width:'25%',style:'caseStyleBold',text:'C',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{style:'bigLineBreak',text:''},{style:'h2',text:'Vendeur:'},{columns:[{width:'50%',text:'Civilité:'},{width:'25%',style:'caseStyleBold',text:'M.',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nom:'},{width:'25%',style:'caseStyleBold',text:'Jean',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Prénom:'},{width:'25%',style:'caseStyleBold',text:'LeVendeur',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Email:'},{width:'25%',style:'caseStyleBold',text:'jean:@levendeur.com',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Téléphone:'},{width:'25%',style:'caseStyleBold',text:'123456789',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Commentaire:'},{width:'25%',style:'caseStyleBold',text:'Un bon vendeur',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]}]);
    expect(JSON.stringify(aEncodedProject)).toBe(expectedResult);
  });


  it('NewProperty project must be correctly formatted', () => {
    const aAdministrativeInformation: AdministrativeInformation = { nature: 'FLAT',
                                                                    state : 'NEW',
                                                                    destination: 'MAIN_PROPERTY',
                                                                    address: {address: '9, rue des roses', postal_code: '06200', city: 'Nice', country: 'France', insee_code: '06088'},
                                                                    project_dates: {sales_agreement_date: '2019-06-24T14:15:22Z', conditions_precedent_end_date: '2019-06-25T14:15:22Z',  signature_date: '2019-06-26T14:15:22Z'},
                                                                    land_register_reference: 'BT1458',
                                                                    description: 'Un beau bien'};

    const aSurfaces: Surfaces = {surface: 1, additional_surface: 2, land_surface: 0};

    const aProject: NewProperty = { type: 'NEW_PROPERTY',
                                    // project_state: 'BEFORE_COMPROMIS',
                                    administrative_information: aAdministrativeInformation,
                                    surfaces: aSurfaces,
                                    delivery_date: '2019-06-24T14:15:22Z',
                                    construction_norm: 'RT_2012',
                                    lot_number: '45',
                                    rooms_count: 4,
                                    program: 'Promogim',
                                    dpe_rate: 'C'  };

    const aEncodedProject = aFundingPDFExportService.encodeProject(aProject);

    const expectedResult = JSON.stringify([{style:'h2',text:'Informations relatives au projet'},{columns:[{width:'50%',text:'Etat d\'avancement du projet:'},{width:'25%',style:'caseStyleBold',text:'',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{style:'bigLineBreak',text:''},{},null,{style:'bigLineBreak',text:''},{columns:[{width:'50%',text:'Nature de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Appartement',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Etat de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Neuf',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Destination de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Résidence principale',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Adresse d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'9, rue des roses, 06200, Nice, France',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Code INSEE de la zone d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'06088',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature du compromis:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de levée des conditions suspensives:'},{width:'25%',style:'caseStyleBold',text:'25 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature:'},{width:'25%',style:'caseStyleBold',text:'26 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Parcelle cadastrale:'},{width:'25%',style:'caseStyleBold',text:'BT1458',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Description:'},{width:'25%',style:'caseStyleBold',text:'Un beau bien',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface:'},{width:'25%',style:'caseStyleBold',text:'1 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface des annexes:'},{width:'25%',style:'caseStyleBold',text:'2 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface du terrain:'},{width:'25%',style:'caseStyleBold',text:'',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Norme de construction:'},{width:'25%',style:'caseStyleBold',text:'RT 2012',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de livraison:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Numéro de lot:'},{width:'25%',style:'caseStyleBold',text:'45',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nombre de pièces:'},{width:'25%',style:'caseStyleBold',text:4,alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Programme:'},{width:'25%',style:'caseStyleBold',text:'Promogim',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'DPE:'},{width:'25%',style:'caseStyleBold',text:'C',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]}]);
    // console.log(expectedResult);
    // console.log(JSON.stringify(aEncodedProject));
    expect(JSON.stringify(aEncodedProject)).toBe(expectedResult);
  });

  it('HouseConstruction project must be correctly formatted', () => {
    const aAdministrativeInformation: AdministrativeInformation = { nature: 'HOUSE',
                                                                    state : 'VEFA',
                                                                    destination: 'RENTAL_PROPERTY',
                                                                    address: {address: '9, rue des roses', postal_code: '06200', city: 'Nice', country: 'France', insee_code: '06088'},
                                                                    project_dates: {sales_agreement_date: '2019-06-24T14:15:22Z', conditions_precedent_end_date: '2019-06-25T14:15:22Z',  signature_date: '2019-06-26T14:15:22Z'},
                                                                    land_register_reference: 'BT1458',
                                                                    description: 'Un beau bien'};

    const aSurfaces: Surfaces = {surface: 1, additional_surface: 2, land_surface: 0};

    const aSeller: Contact = {courtesy: 'MR', first_name: 'Jean', last_name: 'LeVendeur', email: 'jean:@levendeur.com', phone_number: '123456789', comment: 'Un bon vendeur'};

    const aProject: HouseConstruction = { type: 'HOUSE_CONSTRUCTION',
                                          calls_for_funds: { type: 'INCREASING_RATE', calls: [ { reason: 'Raison1', date: 0, percentage: 50 },  { reason: 'Raison2', date: 6, percentage: 50 }] },
                                          project_state: 'BEFORE_COMPROMIS',
                                          administrative_information: aAdministrativeInformation,
                                          surfaces: aSurfaces,
                                          seller: aSeller,
                                          delivery_date: '2019-06-24T14:15:22Z',
                                          construction_norm: 'RT_2012',
                                          lot_number: '45',
                                          rooms_count: 4,
                                          dpe_rate: 'C'  };

    const aEncodedProject = aFundingPDFExportService.encodeProject(aProject);

    const expectedResult = JSON.stringify([{style:'h2',text:'Informations relatives au projet'},{columns:[{width:'50%',text:'Etat d\'avancement du projet:'},{width:'25%',style:'caseStyleBold',text:'Avant compromis',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{style:'bigLineBreak',text:''},{columns:[{width:'50%',text:'Mode de déblocage des appels de fonds:'},{width:'50%',style:'caseStyleBold',text:'Déblocage des fonds sur les prêts les moins chers en priorité',alignment:'left'}]},{table:{style:'table',headerRows:1,widths:['50%','25%','25%'],body:[[{style:'thead',text:'Raison du déblocage',alignment:'center'},{style:'thead',text:'Mois de déblocage',alignment:'center'},{style:'thead',text:'Pourcentage',alignment:'center'}],['Raison1',0,'50%'],['Raison2',6,'50%']]}},{style:'bigLineBreak',text:''},{columns:[{width:'50%',text:'Nature de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Maison',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Etat de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'VEFA',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Destination de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Investissement locatif',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Adresse d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'9, rue des roses, 06200, Nice, France',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Code INSEE de la zone d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'06088',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature du compromis:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de levée des conditions suspensives:'},{width:'25%',style:'caseStyleBold',text:'25 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature:'},{width:'25%',style:'caseStyleBold',text:'26 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Parcelle cadastrale:'},{width:'25%',style:'caseStyleBold',text:'BT1458',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Description:'},{width:'25%',style:'caseStyleBold',text:'Un beau bien',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface:'},{width:'25%',style:'caseStyleBold',text:'1 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface des annexes:'},{width:'25%',style:'caseStyleBold',text:'2 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface du terrain:'},{width:'25%',style:'caseStyleBold',text:'',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de livraison:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Norme de construction:'},{width:'25%',style:'caseStyleBold',text:'RT 2012',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Numéro de lot:'},{width:'25%',style:'caseStyleBold',text:'45',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nombre de pièces:'},{width:'25%',style:'caseStyleBold',text:4,alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'DPE:'},{width:'25%',style:'caseStyleBold',text:'C',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{style:'bigLineBreak',text:''},{style:'h2',text:'Vendeur:'},{columns:[{width:'50%',text:'Civilité:'},{width:'25%',style:'caseStyleBold',text:'M.',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nom:'},{width:'25%',style:'caseStyleBold',text:'Jean',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Prénom:'},{width:'25%',style:'caseStyleBold',text:'LeVendeur',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Email:'},{width:'25%',style:'caseStyleBold',text:'jean:@levendeur.com',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Téléphone:'},{width:'25%',style:'caseStyleBold',text:'123456789',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Commentaire:'},{width:'25%',style:'caseStyleBold',text:'Un bon vendeur',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]}]);
    // console.log(expectedResult);
    // console.log(JSON.stringify(aEncodedProject));
    expect(JSON.stringify(aEncodedProject)).toBe(expectedResult);
  });


it('BalancingAdjustment project must be correctly formatted', () => {
    const aAdministrativeInformation: AdministrativeInformation = { nature: 'FLAT',
                                                                    state : 'OLD',
                                                                    destination: 'MAIN_PROPERTY',
                                                                    address: {address: '9, rue des roses', postal_code: '06200', city: 'Nice', country: 'France', insee_code: '06088'},
                                                                    project_dates: {sales_agreement_date: '2019-06-24T14:15:22Z', conditions_precedent_end_date: '2019-06-25T14:15:22Z',  signature_date: '2019-06-26T14:15:22Z'},
                                                                    land_register_reference: 'BT1458',
                                                                    description: 'Un beau bien'};

    const aSeller: Contact = {courtesy: 'MR', first_name: 'Jean', last_name: 'LeVendeur', email: 'jean:@levendeur.com', phone_number: '123456789', comment: 'Un bon vendeur'};

    const aSurfaces: Surfaces = {surface: 1, additional_surface: 2, land_surface: 0};

    const aProject: BalancingAdjustment = { type: 'BALANCING_ADJUSTMENT',
                                    project_state: 'BEFORE_COMPROMIS',
                                    administrative_information: aAdministrativeInformation,
                                    undivided_persons: [ {share_percentage: 10, relationship: 'EX-HUSBAND', contact: {first_name: 'Jean', last_name: 'Pierre'} }, {share_percentage: 20, relationship: 'OTHER', contact: {first_name: 'Jean2', last_name: 'Pierre2'} } ],
                                    surfaces: aSurfaces,
                                    construction_date: '2019-06-24T14:15:22Z',
                                    construction_norm: 'RT_2012',
                                    lot_number: '45',
                                    rooms_count: 4,
                                    dpe_rate: 'C'  };

    const aEncodedProject = aFundingPDFExportService.encodeProject(aProject);
    // console.log(JSON.stringify(aEncodedProject));

    const expectedResult = JSON.stringify([{style:'h2',text:'Informations relatives au projet'},{columns:[{width:'50%',text:'Etat d\'avancement du projet:'},{width:'25%',style:'caseStyleBold',text:'Avant compromis',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nature de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Appartement',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Etat de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Ancien sans travaux',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Destination de l\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'Résidence principale',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Adresse d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'9, rue des roses, 06200, Nice, France',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Code INSEE de la zone d\'acquisition:'},{width:'25%',style:'caseStyleBold',text:'06088',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature du compromis:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de levée des conditions suspensives:'},{width:'25%',style:'caseStyleBold',text:'25 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de signature:'},{width:'25%',style:'caseStyleBold',text:'26 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Parcelle cadastrale:'},{width:'25%',style:'caseStyleBold',text:'BT1458',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Description:'},{width:'25%',style:'caseStyleBold',text:'Un beau bien',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface:'},{width:'25%',style:'caseStyleBold',text:'1 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface des annexes:'},{width:'25%',style:'caseStyleBold',text:'2 m²',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Surface du terrain:'},{width:'25%',style:'caseStyleBold',text:'',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Date de construction:'},{width:'25%',style:'caseStyleBold',text:'24 juin 2019',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Norme de construction:'},{width:'25%',style:'caseStyleBold',text:'RT 2012',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Numéro de lot:'},{width:'25%',style:'caseStyleBold',text:'45',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nombre de pièces:'},{width:'25%',style:'caseStyleBold',text:4,alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'DPE:'},{width:'25%',style:'caseStyleBold',text:'C',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{style:'bigLineBreak',text:''},{style:'h2',text:'Indivisaires'},{table:{style:'table',headerRows:1,widths:['20%','25%','27.5%','27.5%'],body:[[{width:'20%',style:'thead',text:'Part'},{width:'25%',style:'thead',text:'Relation'},{width:'27.5%',style:'thead',text:'Nom'},{width:'27.5%',style:'thead',text:'Prénom'}],[{width:'20%',text:'10%'},{width:'25%',text:'Ex-mari'},{width:'25%',text:'Jean'},{width:'25%',text:'Pierre'}],[{width:'20%',text:'20%'},{width:'25%',text:'Autre'},{width:'25%',text:'Jean2'},{width:'25%',text:'Pierre2'}]]}}]);
    expect(JSON.stringify(aEncodedProject)).toBe(expectedResult);
  });


  it('Fundings summary must be correctly formatted', () => {
    const aFundingParameters: FundingParameters = { project: { type: 'OLD_PROPERTY' }, funding_fees: { broker_fees: 100, file_management_fees: 200 }, loans: [] };
    const aFundingResults: FundingResults = { status: 'OPTIMAL', loans: [{ type: 'FREE_LOAN', yearly_rate: 0, duration_months: 180, amount: 200000, amortizations: [], interests: [], insurances: [], released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0 } ], summary: { effective_maximal_monthly_payment: 1, duration_months: 240, total_interests: 2, total_insurances: 3, total_guaranty: 4, total_preamortizations: 5, final_debt_ratio: 33, total_personal_funding: 5000, jump_charge: 100} };
    const aFundingSummary = aFundingPDFExportService.encodeFundingSummary(aFundingParameters, aFundingResults);

    const expectedResult = JSON.stringify([{columns:[{width:'50%',text:'Le coût total du plan de financement est de:'},{width:'25%',style:'caseStyleBold',text:'314,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le coût total des intérêts est de:'},{width:'25%',style:'caseStyleBold',text:'2,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le coût total des assurances est de:'},{width:'25%',style:'caseStyleBold',text:'3,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le coût total des garanties est de:'},{width:'25%',style:'caseStyleBold',text:'4,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Les frais de dossier sont estimés à:'},{width:'25%',style:'caseStyleBold',text:'200,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Les frais de courtage sont estimés à:'},{width:'25%',style:'caseStyleBold',text:'100,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Des dépenses ou frais annexes sont estimés à:'},{width:'25%',style:'caseStyleBold',text:'0,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'La mensualité maximale est de:'},{width:'25%',style:'caseStyleBold',text:'1,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Les frais de notaire sont estimés à:'},{width:'25%',style:'caseStyleBold',text:'0,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'La durée de remboursement est de:'},{width:'25%',style:'caseStyleBold',text:'240 mois',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'L\'apport est de 2.44% rapporté au total du projet, soit:'},{width:'25%',style:'caseStyleBold',text:'5 000,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'L\'endettement est de:'},{width:'25%',style:'caseStyleBold',text:'33%',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le saut de charge est de:'},{width:'25%',style:'caseStyleBold',text:'100,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le reste à vivre est de:'},{width:'25%',style:'caseStyleBold',text:'',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]}]);
    // console.log(expectedResult);
    // console.log(JSON.stringify(aFundingSummary));
    expect(JSON.stringify(aFundingSummary)).toBe(expectedResult);
  });


});
