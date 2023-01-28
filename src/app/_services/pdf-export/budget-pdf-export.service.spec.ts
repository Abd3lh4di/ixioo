import { TestBed } from '@angular/core/testing';
import { BudgetPDFExportService } from './budget-pdf-export.service';

import { Case } from '../../_api/model/case';
import { PtzLoan } from '../../_api/model/ptzLoan';
import { BossLoan } from '../../_api/model/bossLoan';
import { ActivePartner } from '../../_api/model/activePartner';
import { BudgetParameters } from '../../_api/model/budgetParameters';
import { BudgetResults } from '../../_api/model/budgetResults';

import { IconsSvg } from './icons-svg';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

describe('BudgetPDFExportService', () => {

  let aBudgetPDFExportService: BudgetPDFExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    aBudgetPDFExportService = TestBed.inject(BudgetPDFExportService);
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

    const anExtractedPartner = aBudgetPDFExportService.extractPartnerContact('BROKER', aPartners);

    expect(JSON.stringify(anExtractedPartner)).toBe(JSON.stringify({type: 'BROKER', name: 'Hypo', logo_uri: '', address: {address: '36-38, Route de Rennes', postal_code: '44300', city: 'Nantes', country: '', insee_code: ''}, contact: {contact_courtesy: '', contact_first_name: 'Fabrice', contact_last_name: 'Hamon', contact_email: 'fabrice.hamon@lowtaux.fr', contact_phone_number: '06.12.19.35.70', comment: ''}, email: 'contact@lowtaux.com', phone_number: '09.78.350.700', role: '', sub_entity: '', agreement_number: '09051593', comment: ''}));
  });


  it('PTZ and BossLoan info must be correctly encoded', () => {
    const generationDate = new Date('2020-12-16T23:28:06');

    const aPtzLoan: PtzLoan = {type: 'PTZ_LOAN'};
    const aBossLoan: BossLoan = {type: 'BOSS_LOAN'};
    const aLoans = [aPtzLoan, aBossLoan];
    const aBudgetParameters: BudgetParameters = { loans: aLoans };
    // BudgetResults whith no PTZ nor Boss loans
    const aBudgetResults: BudgetResults = { funding_plan: { status: 'OPTIMAL', loans: [] } };

    const aPtzSection = aBudgetPDFExportService.encodePTZSection(aBudgetParameters.loans, aBudgetResults.funding_plan.loans);
    const aBossLoanSection = aBudgetPDFExportService.encodeBossLoanSection(aBudgetParameters.loans, aBudgetResults.funding_plan.loans);

    expect(JSON.stringify(aPtzSection)).toBe(JSON.stringify(['<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M21.19,21.19L2.81,2.81L1.39,4.22l2.27,2.27C2.61,8.07,2,9.96,2,12c0,5.52,4.48,10,10,10c2.04,0,3.93-0.61,5.51-1.66 l2.27,2.27L21.19,21.19z M10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l0.18-0.18l1.41,1.41L10.59,16.6z M13.59,10.76l-7.1-7.1 C8.07,2.61,9.96,2,12,2c5.52,0,10,4.48,10,10c0,2.04-0.61,3.93-1.66,5.51l-5.34-5.34l2.65-2.65l-1.41-1.41L13.59,10.76z"/></svg>', 'Le projet n\'est pas éligible au PTZ.']));
    expect(JSON.stringify(aBossLoanSection)).toBe(JSON.stringify(['<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M21.19,21.19L2.81,2.81L1.39,4.22l2.27,2.27C2.61,8.07,2,9.96,2,12c0,5.52,4.48,10,10,10c2.04,0,3.93-0.61,5.51-1.66 l2.27,2.27L21.19,21.19z M10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l0.18-0.18l1.41,1.41L10.59,16.6z M13.59,10.76l-7.1-7.1 C8.07,2.61,9.96,2,12,2c5.52,0,10,4.48,10,10c0,2.04-0.61,3.93-1.66,5.51l-5.34-5.34l2.65-2.65l-1.41-1.41L13.59,10.76z"/></svg>', 'Le projet n\'est pas éligible au 1% patronal.']));

    // BudgetResults whith both PTZ and Boss loans
    const aSecondBudgetResults: BudgetResults = { funding_plan: { status: 'OPTIMAL', loans: [{ type: 'PTZ_LOAN', yearly_rate: 0, duration_months: 180, amount: 20000, amortizations: [], interests: [], insurances: [], released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0 }, { type: 'BOSS_LOAN', yearly_rate: 0, duration_months: 180, amount: 20000, amortizations: [], interests: [], insurances: [], released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0 }] } };
    const aSecondPtzSection = aBudgetPDFExportService.encodePTZSection(aBudgetParameters.loans, aSecondBudgetResults.funding_plan.loans);
    const aSecondBossLoanSection = aBudgetPDFExportService.encodeBossLoanSection(aBudgetParameters.loans, aSecondBudgetResults.funding_plan.loans);

    expect(JSON.stringify(aSecondPtzSection)).toBe(JSON.stringify(['<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>', 'Le projet est éligible au PTZ.']));
    expect(JSON.stringify(aSecondBossLoanSection)).toBe(JSON.stringify(['<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>', 'Le projet est éligible au 1% patronal.']));
  });


  it('Budgets table must be correctly formatted', () => {
    const aBudgetResults: BudgetResults = { funding_plan: { status: 'OPTIMAL', summary: { total_personal_funding: 0 } }, budgets: { broker_fees: 1, file_management_fees: 2, guaranties_fees: 3, maximal_price: 4, notary_fees: 5, other_expenses: 6, total_budget: 7, } };
    const aBudgetTable = aBudgetPDFExportService.generateBudgetTable(aBudgetResults, 'yellow', 'blue', 'green', 'purple');

    const expectedResult = JSON.stringify([{table:{widths:[20,170,'auto',100,'auto'],headerRows:2,body:[[{text:'',fillColor:'yellow',alignment:'center',color:'white'},{text:'Prix maximal envisageable',fillColor:'yellow',color:'white'},{text:'4,00 €',fillColor:'yellow',alignment:'right',color:'white'},{text:'Total projet',rowSpan:2,fillColor:'yellow',color:'white'},{text:'10,00 €',rowSpan:2,fillColor:'yellow',alignment:'right',color:'white'}],[{text:'+',fillColor:'yellow',alignment:'center',color:'white'},{text:'Dépense ou frais annexes',fillColor:'yellow',color:'white'},{text:'6,00 €',fillColor:'yellow',alignment:'right',color:'white'},{text:'',fillColor:'yellow',color:'white'},{text:'',fillColor:'yellow',color:'white'}],[{text:'+',fillColor:'blue',alignment:'center',color:'white'},{text:'Frais de courtage',fillColor:'blue',color:'white'},{text:'1,00 €',fillColor:'blue',alignment:'right',color:'white'},{text:'Total frais',rowSpan:4,fillColor:'blue',color:'white'},{text:'11,00 €',rowSpan:4,fillColor:'blue',alignment:'right',color:'white'}],[{text:'+',fillColor:'blue',alignment:'center',color:'white'},{text:'Frais de dossier',fillColor:'blue',color:'white'},{text:'2,00 €',fillColor:'blue',alignment:'right',color:'white'},{text:'',fillColor:'blue',color:'white'},{text:'',fillColor:'blue',color:'white'}],[{text:'+',fillColor:'blue',alignment:'center',color:'white'},{text:'Frais de notaire',fillColor:'blue',color:'white'},{text:'5,00 €',fillColor:'blue',alignment:'right',color:'white'},{text:'',fillColor:'blue',color:'white'},{text:'',fillColor:'blue',color:'white'}],[{text:'+',fillColor:'blue',alignment:'center',color:'white'},{text:'Frais de garanties',fillColor:'blue',color:'white'},{text:'3,00 €',fillColor:'blue',alignment:'right',color:'white'},{text:'',fillColor:'blue',color:'white'},{text:'',fillColor:'blue',color:'white'}],[{text:'-',fillColor:'green',alignment:'center',color:'white'},{text:'Apport personnel',fillColor:'green',color:'white'},{text:'0,00 €',fillColor:'green',alignment:'right',color:'white'},{text:''},{text:''}],[{text:'=',fillColor:'purple',alignment:'center',color:'white'},{text:'Montant maximal empruntable',fillColor:'purple',color:'white'},{text:'7,00 €',fillColor:'purple',alignment:'right',color:'white'},{text:''},{text:''}]]},layout:'noBorders'}]);
    expect(JSON.stringify(aBudgetTable)).toBe(expectedResult);
  });


  it('Budgets summary must be correctly formatted', () => {
    const aBudgetParameters: BudgetParameters = { funding_fees: { broker_fees: 100, file_management_fees: 200 }, loans: [] };
    const aBudgetResults: BudgetResults = {  budgets: { broker_fees: 10, file_management_fees: 20, guaranties_fees: 30, maximal_price: 40, notary_fees: 50, other_expenses: 60, total_budget: 70, }, funding_plan: { status: 'OPTIMAL', summary: { effective_maximal_monthly_payment: 1, duration_months: 240, total_interests: 2, total_insurances: 3, total_guaranty: 4, total_preamortizations: 5, final_debt_ratio: 33, total_personal_funding: 5000, jump_charge: 0 } } };
    const aBudgetSummary = aBudgetPDFExportService.encodeBudgetSummary(aBudgetParameters, aBudgetResults);

    const expectedResult = JSON.stringify([{columns:[{width:'50%',text:'Le coût total du plan de financement est de:'},{width:'25%',style:'caseStyleBold',text:'314,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le coût total des intérêts est de:'},{width:'25%',style:'caseStyleBold',text:'2,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le coût total des assurances est de:'},{width:'25%',style:'caseStyleBold',text:'3,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le coût total des garanties est de:'},{width:'25%',style:'caseStyleBold',text:'4,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Les frais de dossier sont estimés à:'},{width:'25%',style:'caseStyleBold',text:'200,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Les frais de courtage sont estimés à:'},{width:'25%',style:'caseStyleBold',text:'100,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Des dépenses ou frais annexes sont estimés à:'},{width:'25%',style:'caseStyleBold',text:'50,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'La mensualité maximale est de:'},{width:'25%',style:'caseStyleBold',text:'1,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Les frais de notaire sont estimés à:'},{width:'25%',style:'caseStyleBold',text:'60,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'La durée de remboursement est de:'},{width:'25%',style:'caseStyleBold',text:'240 mois',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'L\'apport est de 7142.86% rapporté au total du projet, soit:'},{width:'25%',style:'caseStyleBold',text:'5 000,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'L\'endettement est de:'},{width:'25%',style:'caseStyleBold',text:'0%',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le saut de charge est de:'},{width:'25%',style:'caseStyleBold',text:'0,00 €',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Le reste à vivre est de:'},{width:'25%',style:'caseStyleBold',text:'',alignment:'right'},{width:'25%',style:'caseStyleBold',text:''}]}]);

    // console.log(expectedResult);
    // console.log(JSON.stringify(aBudgetSummary));
    expect(JSON.stringify(aBudgetSummary)).toBe(expectedResult);
  });


});
