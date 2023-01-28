import { TestBed } from '@angular/core/testing';
import { PDFExportService } from './pdf-export.service';

import { Case } from '../../_api/model/case';
import { PtzLoan } from '../../_api/model/ptzLoan';
import { BossLoan } from '../../_api/model/bossLoan';
import { ActivePartner } from '../../_api/model/activePartner';
import { BudgetParameters } from '../../_api/model/budgetParameters';
import { BudgetResults } from '../../_api/model/budgetResults';
import { Loan } from '../../_api/model/loan';

import { IconsSvg } from './icons-svg';
import { Individual, Person, Employee, SelfEmployed, SocioProfessionalGroupEmployes, ProfessionDetails, ChargeItem, RevenueItem, PatrimonyItem, FinanceDetails } from 'src/app/_api';
import { Child, DependentPerson, HouseholdDetails, CurrentLoan }  from 'src/app/_api';
import { LoanUtils } from 'src/app/utils/loan-utils';

describe('PDFExportService', () => {

  let aPDFExportService: PDFExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    aPDFExportService = TestBed.inject(PDFExportService);
  });

  ////////////////////// Utility methods //////////////////////

  it('Fields are encoded as void when null or undefined', () => {
    expect(aPDFExportService.formatDateAsString(null)).toBe('');
    expect(aPDFExportService.formatDateAsString(undefined)).toBe('');

    expect(aPDFExportService.formatFldAsString(null)).toBe('');
    expect(aPDFExportService.formatFldAsString(undefined)).toBe('');

    expect(aPDFExportService.formatNbr(null)).toBe('');
    expect(aPDFExportService.formatNbr(undefined)).toBe('');

    expect(aPDFExportService.formatMonetaryNbr(null)).toBe('');
    expect(aPDFExportService.formatMonetaryNbr(undefined)).toBe('');

    expect(JSON.stringify(aPDFExportService.formatLocation(null))).toBe(JSON.stringify({address: '', postal_code: '', city: '', country: '', insee_code: ''}));
    expect(JSON.stringify(aPDFExportService.formatLocation(undefined))).toBe(JSON.stringify({address: '', postal_code: '', city: '', country: '', insee_code: ''}));

    expect(JSON.stringify(aPDFExportService.formatBank(null))).toBe(JSON.stringify({bank: '', agency: '', iban: '', bic: '', customer_since: ''}));
    expect(JSON.stringify(aPDFExportService.formatBank(undefined))).toBe(JSON.stringify({bank: '', agency:'', iban: '', bic: '', customer_since: ''}));

    expect(JSON.stringify(aPDFExportService.formatResidencePermit(null))).toBe(JSON.stringify({number: '', delivery_date: '', expiry_date: ''}));
    expect(JSON.stringify(aPDFExportService.formatResidencePermit(undefined))).toBe(JSON.stringify({number: '', delivery_date: '', expiry_date: ''}));

    expect(JSON.stringify(aPDFExportService.formatSurfaces(null))).toBe(JSON.stringify({surface: '', additional_surface: '', land_surface: ''}));
    expect(JSON.stringify(aPDFExportService.formatSurfaces(undefined))).toBe(JSON.stringify({surface: '', additional_surface: '', land_surface: ''}));

    expect(JSON.stringify(aPDFExportService.getIndividualAddressToUse(null))).toBe(JSON.stringify(null));
    expect(JSON.stringify(aPDFExportService.getIndividualAddressToUse(undefined))).toBe(JSON.stringify(null));

    expect(JSON.stringify(aPDFExportService.formatSeller(null))).toBe(JSON.stringify([]));
    expect(JSON.stringify(aPDFExportService.formatSeller(undefined))).toBe(JSON.stringify([]));

    expect(JSON.stringify(aPDFExportService.formatProjectDates(null))).toBe(JSON.stringify({sales_agreement_date: '', conditions_precedent_end_date: '', signature_date: ''}));
    expect(JSON.stringify(aPDFExportService.formatProjectDates(undefined))).toBe(JSON.stringify({sales_agreement_date: '', conditions_precedent_end_date: '', signature_date: ''}));

  });


it('Fields are encoded correctly when filled', () => {
    expect(JSON.stringify(aPDFExportService.formatLocation({
      address: '5, rue des roses',
      city: 'Annot',
      country: null,
      insee_code: '123456'
    }))).toBe(JSON.stringify({address: '5, rue des roses', postal_code: '', city: 'Annot', country: '', insee_code: '123456'}));

    expect(JSON.stringify(aPDFExportService.formatBank({
      rib: {bic: '123', iban: '456'},
      current_agency: 'aAgency',
      current_bank: 'BNP',
      customer_since: '2019-08-24T14:15:22Z',
      departement: '06'
    }))).toBe(JSON.stringify({bank: 'BNP', agency: 'aAgency', iban: '456', bic: '123', customer_since: '24 août 2019'}));

    expect(JSON.stringify(aPDFExportService.formatBank({
      rib: {bic: '123', iban: '456'},
      current_agency: 'aAgency',
      current_bank: 'BNP',
      customer_since: '2019-85-24T14:15:22Z',
      departement: '06'
    }))).toBe(JSON.stringify({bank: 'BNP', agency: 'aAgency', iban: '456', bic: '123', customer_since: ''}));

    expect(JSON.stringify(aPDFExportService.formatResidencePermit({
      number: '123',
      delivery_date: '2019-06-24T14:15:22Z',
      expiry_date: '2019-85-24T14:15:22Z'
    }))).toBe(JSON.stringify({number: '123', delivery_date: '24 juin 2019', expiry_date: ''}));

    expect(JSON.stringify(aPDFExportService.formatSurfaces({
      surface: 1,
      additional_surface: 2,
      land_surface: undefined
    }))).toBe(JSON.stringify({surface: '1 m²', additional_surface: '2 m²', land_surface: ''}));

    expect(JSON.stringify(aPDFExportService.getIndividualAddressToUse({
      contact_address: {address: 'rue des fleurs'},
      residency_address: {address: 'rue des roses'}
    }))).toBe(JSON.stringify({address: 'rue des fleurs'}));

    expect(JSON.stringify(aPDFExportService.getIndividualAddressToUse({
      contact_address: null,
      residency_address: {address: 'rue des roses'}
    }))).toBe(JSON.stringify({address: 'rue des roses'}));

    expect(aPDFExportService.formatAddress('9, rue des fleurs', '', '', '')).toBe('9, rue des fleurs');
    expect(aPDFExportService.formatAddress('9, rue des fleurs', '06200', '', '')).toBe('9, rue des fleurs, 06200');
    expect(aPDFExportService.formatAddress('9, rue des fleurs', '06200', 'Nice', '')).toBe('9, rue des fleurs, 06200, Nice');
    expect(aPDFExportService.formatAddress('9, rue des fleurs', '06200', 'Nice', 'France')).toBe('9, rue des fleurs, 06200, Nice, France');
    expect(aPDFExportService.formatAddress('', '06200', '', 'France')).toBe('06200, France');
    expect(aPDFExportService.formatAddress('9, rue des fleurs', null, 'Nice', 'France')).toBe('9, rue des fleurs, Nice, France');
    expect(aPDFExportService.formatAddress('9, rue des fleurs', null, 'Nice', undefined)).toEqual('9, rue des fleurs, Nice');

    expect(JSON.stringify(aPDFExportService.formatProjectDates({sales_agreement_date: '2019-06-24T14:15:22Z',
                                                                conditions_precedent_end_date: '2019-06-25T14:15:22Z',
                                                                signature_date: '2019-06-26T14:15:22Z'}))).toBe(JSON.stringify({sales_agreement_date: '24 juin 2019', conditions_precedent_end_date: '25 juin 2019', signature_date: '26 juin 2019'}));


    expect(JSON.stringify(aPDFExportService.formatSeller({
      courtesy: 'MR',
      first_name: 'Jean',
      last_name: 'LeVendeur',
      email: 'jean:@levendeur.com',
      phone_number: '123456789',
      comment: 'Un bon vendeur'
    }))).toBe(JSON.stringify([{style:'h2',text:'Vendeur:'},{columns:[{width:'50%',text:'Civilité:'},{width:'25%',style:'caseStyleBold',text:'M.',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Nom:'},{width:'25%',style:'caseStyleBold',text:'Jean',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Prénom:'},{width:'25%',style:'caseStyleBold',text:'LeVendeur',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Email:'},{width:'25%',style:'caseStyleBold',text:'jean:@levendeur.com',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Téléphone:'},{width:'25%',style:'caseStyleBold',text:'123456789',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]},{columns:[{width:'50%',text:'Commentaire:'},{width:'25%',style:'caseStyleBold',text:'Un bon vendeur',alignment:'left'},{width:'25%',style:'caseStyleBold',text:''}]}]));


  });


  ////////////////////// Header, footer and styles //////////////////////

  it('Header must be correctly formatted', () => {
    expect(JSON.stringify(aPDFExportService.header('123', IconsSvg.voidSvg))).toBe(JSON.stringify({columns:[{text:'Référence du dossier: 123',fontSize:8,alignment:'left',margin:[10,10,0,0]},{text:'Powered by www.toaztr.com',fontSize:8,alignment:'right',margin:[0,10,20,0]},{svg:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"></svg>',width:22,alignment:'right',margin:[10,5,0,0]}]}));
  });

  it('Footer must be correctly formatted', () => {
    expect(JSON.stringify(aPDFExportService.footerFormatter(1, 2))).toBe(JSON.stringify({columns:[{text:'À l\'exception des besoins du dossier, toute reproduction interdite. © Toaztr',fontSize:8,alignment:'left',margin:[10,40,0,0]},{text:'page 1 / 2',fontSize:8,alignment:'right',margin:[0,40,10,0]}]}));
  });

  it('Styles must be correctly formatted', () => {
    // console.log(JSON.stringify(aPDFExportService.styles()));
    const expectedResults = JSON.stringify({title:{fontSize:22,bold:true,alignment:'center',margin:[0,0,0,20]},h2:{fontSize:16,alignment:'center',bold:true,margin:[0,10,0,5]},h2bold:{fontSize:16,alignment:'left',bold:true},h3margin:{fontSize:12,alignment:'left',margin:[10,0,0,0]},h3centerbold:{fontSize:12,alignment:'center',bold:true},h3bold:{fontSize:12,alignment:'left',bold:true},h4:{fontSize:10,alignment:'left'},h4bold:{fontSize:10,alignment:'left',bold:true},bold:{alignment:'left',bold:true},bolditalics:{alignment:'left',bold:true,italics:true},bigLineBreak:{fontSize:16,alignment:'center',margin:[0,12,0,0]},smallLineBreak:{fontSize:14,alignment:'center',margin:[0,8,0,0]},verySmallLineBreak:{fontSize:8,alignment:'center',margin:[0,6,0,0]},caseStyle:{fontSize:10},caseStyleBold:{fontSize:10,alignment:'left',bold:true},table:{alignment:'right',margin:[0,5,0,15]},tableleft:{alignment:'left',margin:[0,5,0,15]},tablecenter:{alignment:'center',margin:[0,5,0,15]},tablejustify:{alignment:'justify',margin:[0,5,0,15]},thead:{bold:true,color:'black',fillColor:'#D5D8DC'},iconsTop:{alignment:'right',margin:[0,0,2,0]},iconsTextTop:{fontSize:12,alignment:'left',bold:true,color:'#519cb8',margin:[10,0,0,0]},icons:{width:20},iconsText:{fontSize:12,margin:[10,0,0,0],width:'auto'}});
    expect(JSON.stringify(aPDFExportService.styles())).toBe(expectedResults);
  });


  ////////////////////// Encoding methods //////////////////////


  it('Household contact must be correctly formatted', () => {
    const generationDate = new Date('2020-12-16T23:28:06');
    aPDFExportService.caseName = 'FRW20201211-8796';

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

    const aCaseHousehold: Case = { actor: {
        type: 'HOUSEHOLD',
        persons: [
          {
            is_borrower: true,
            civil: {
              courtesy: 'MRS',
              first_name: 'Céline',
              last_name: 'Pignon',
              email: 'celine.pignon@email.com',
              phone_number: '06.05.04.03.01',
              contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'}
            }
          },
          {
            is_borrower: true,
            civil: {
              courtesy: 'MR',
              first_name: 'Jean',
              last_name: 'Pignon',
              email: 'jean.pignon@email.com',
              phone_number: '06.05.04.03.02',
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'}
            }
          },
          {
            is_borrower: false,
            civil: {
              courtesy: 'MR',
              first_name: 'Jean',
              last_name: 'Pignon',
              email: 'jean.pignon@email.com',
              phone_number: '06.05.04.03.02',
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'}
            }
          }
        ]
      }
    };

    aPDFExportService.aPartners = aPartners;
    aPDFExportService.aCase = aCaseHousehold;

    // console.log(JSON.stringify(aPDFExportService.encodeContact('Estimation de budget', IconsSvg.voidSvg, generationDate)));
    const expectedResults = JSON.stringify([{columns:[{svg:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"></svg>',width:75,alignment:'center'},{style:'title',text:'Estimation de budget'}]},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{table:{widths:['50%','50%'],body:[[[{style:'h3bold',decoration:'underline',text:'Réalisée par:'},{text:'Hypo'},{text:'36-38, Route de Rennes,'},{text:'44300, Nantes.'},{text:'06.12.19.35.70'},{text:'fabrice.hamon@lowtaux.fr'},{text:'Agrément ORIAS: 09051593'},{style:'smallLineBreak',text:''},{style:'h3bold',decoration:'underline',text:'Votre interlocuteur:'},{text:'Fabrice Hamon'},{text:'06.12.19.35.70'},{text:'fabrice.hamon@lowtaux.fr'}],[{style:'h3bold',decoration:'underline',text:'À la demande de:'},{text:'Mme. Céline Pignon'},{text:'1, Rue des Fleurs'},{text:'06100, Nice.'},{text:'06.05.04.03.01'},{text:'celine.pignon@email.com'},{style:'smallLineBreak',text:''},{text:'M. Jean Pignon'},{text:'2, Rue des Fleurs'},{text:'06100, Nice.'},{text:'06.05.04.03.02'},{text:'jean.pignon@email.com'},{style:'smallLineBreak',text:''}]]]}},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{columns:[{text:[{text:[{style:'caseStyle',text:'Dossier: '},{style:'caseStyleBold',text:'FRW20201211-8796'}]}]},{text:'16 décembre 2020 à 23:28:06',alignment:'right'}]},{canvas:[{type:'line',x1:0,y1:5,x2:515,y2:5,lineWidth:3}]},{style:'bigLineBreak',text:''}]);
    expect(JSON.stringify(aPDFExportService.encodeContact('Estimation de budget', IconsSvg.voidSvg, generationDate))).toBe(expectedResults);
  });



it('Legal person contact must be correctly formatted', () => {
    const generationDate = new Date('2020-12-16T23:28:06');
    aPDFExportService.caseName = 'FRW20201211-8796';

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

    const aCaseLegalPerson: Case = { actor: {
            type: 'LEGAL_PERSON',
            name: 'Toaztr',
            structure_type: 'COMPANY',
            legal_status: 'SAS',
            email: 'celine@toaztr.com',
            phone_number: '06.05.04.03.00',
            contact_address: {address: '0, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
            persons: [
              {
                civil: {
                  courtesy: 'MRS',
                  first_name: 'Céline',
                  last_name: 'Pignon',
                  email: 'celine.pignon@toaztr.com',
                  phone_number: '06.05.04.03.01',
                  contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'}
                }
              },
              {
                civil: {
                  courtesy: 'MR',
                  first_name: 'Jean',
                  last_name: 'Pignon',
                  email: 'jean.pignon@toaztr.com',
                  phone_number: '06.05.04.03.02',
                  contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'}
                }
              }
            ]
          }
        };

    aPDFExportService.aPartners = aPartners;
    aPDFExportService.aCase = aCaseLegalPerson;

    // console.log(JSON.stringify(aPDFExportService.encodeContact('Estimation de budget', IconsSvg.voidSvg, generationDate)));
    const expectedResults = JSON.stringify([{columns:[{svg:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"></svg>',width:75,alignment:'center'},{style:'title',text:'Estimation de budget'}]},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{table:{widths:['50%','50%'],body:[[[{style:'h3bold',decoration:'underline',text:'Réalisée par:'},{text:'Hypo'},{text:'36-38, Route de Rennes,'},{text:'44300, Nantes.'},{text:'06.12.19.35.70'},{text:'fabrice.hamon@lowtaux.fr'},{text:'Agrément ORIAS: 09051593'},{style:'smallLineBreak',text:''},{style:'h3bold',decoration:'underline',text:'Votre interlocuteur:'},{text:'Fabrice Hamon'},{text:'06.12.19.35.70'},{text:'fabrice.hamon@lowtaux.fr'}],[{style:'h3bold',decoration:'underline',text:'À la demande de:'},{text:'Entreprise Toaztr'},{text:'SAS'},{text:'0, Rue des Fleurs'},{text:'06100, Nice.'},{text:'06.05.04.03.00'},{text:'celine@toaztr.com'},{style:'smallLineBreak',text:''},{text:'représenté(e) par:'},{style:'smallLineBreak',text:''},{text:'Mme. Céline Pignon'},{text:'1, Rue des Fleurs'},{text:'06100, Nice.'},{text:'06.05.04.03.01'},{text:'celine.pignon@toaztr.com'},{style:'smallLineBreak',text:''},{text:'M. Jean Pignon'},{text:'2, Rue des Fleurs'},{text:'06100, Nice.'},{text:'06.05.04.03.02'},{text:'jean.pignon@toaztr.com'},{style:'smallLineBreak',text:''}]]]}},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{columns:[{text:[{text:[{style:'caseStyle',text:'Dossier: '},{style:'caseStyleBold',text:'FRW20201211-8796'}]}]},{text:'16 décembre 2020 à 23:28:06',alignment:'right'}]},{canvas:[{type:'line',x1:0,y1:5,x2:515,y2:5,lineWidth:3}]},{style:'bigLineBreak',text:''}]);
    expect(JSON.stringify(aPDFExportService.encodeContact('Estimation de budget', IconsSvg.voidSvg, generationDate))).toBe(expectedResults);
  });


  it('Extracted partner must be correctly formatted', () => {
    const aPartners: ActivePartner[] = [{type: 'NOTARY'}, {type: 'ESTATE_AGENT', name: 'In Pierre We Trust'},
             {type: 'BROKER', name: 'Hypo', phone_number: '09.78.350.700', email: 'contact@lowtaux.com',
              address: {address: '36-38, Route de Rennes', postal_code: '44300', city: 'Nantes'}, agreement_number: '09051593',
              contact: {courtesy: 'MR', first_name: 'Fabrice', last_name: 'Hamon',  phone_number: '06.12.19.35.70', email: 'fabrice.hamon@lowtaux.fr'}}];
    expect(JSON.stringify(aPDFExportService.extractPartnerContact('BROKER', aPartners))).toBe(JSON.stringify({type:'BROKER',name:'Hypo',logo_uri:'',address:{address:'36-38, Route de Rennes',postal_code:'44300',city:'Nantes',country:'',insee_code:''},contact:{contact_courtesy:'M.',contact_first_name:'Fabrice',contact_last_name:'Hamon',contact_email:'fabrice.hamon@lowtaux.fr',contact_phone_number:'06.12.19.35.70',comment:''},email:'contact@lowtaux.com',phone_number:'09.78.350.700',role:'',sub_entity:'',agreement_number:'09051593',comment:''}));
  });


  it('Individual must be correctly formatted', () => {

    const anIndividual: Individual = {
      courtesy: 'MR',
      first_name: 'Jean',
      last_name: 'Albert',
      birth_name: 'Albert',
      birth_date: '1979-01-31T14:00:00.000Z',
      birth_place: 'Nice',
      email: 'jean@prets.com',
      phone_number: '06.12.34.56.78',
      nationality: 'Française',
      residency_address: {
          address: '7, rue des roses',
          postal_code: '06100',
          city: 'Nice',
          country: 'France',
          insee_code: ''
      },
      family_situation: {
          marital_status: 'MARRIED',
          marital_status_since: '2000-03-04T14:00:00.000Z',
          matrimony_regime: 'COMMUNAUTE_REDUITE_AUX_ACQUETS',
          divorce_procedure: 'MUTUAL_CONSENT',
          marital_country: 'France',
          is_in_relation_with: '1'
      },
      housing: {
          housing_status: 'TENANT',
          housing_status_since: '2018-01-05T14:00:00.000Z'
      },
      bank_info: {
          rib: {bic: '123', iban: '456'},
          current_agency: 'Agence du port',
          current_bank: 'BNP',
          customer_since: null,
          departement: null
      },
      residence_permit: {
          number: '321',
          delivery_date: '2015-01-05T14:00:00.000Z',
          expiry_date: '2025-15-06T14:00:00.000Z'
      }
    };

    const somePerons: Person[] = [{civil: anIndividual}, {civil: {courtesy: 'MRS', first_name: 'Claudia', last_name: 'Dupont', family_situation: {is_in_relation_with: '0'}}}];
    const expectedAnswer = JSON.stringify([{columns:[{width:'35%',text:'Civilité:'},{width:'65%',style:'caseStyleBold',text:'MR'}]},{columns:[{width:'35%',text:'Nom:'},{width:'65%',style:'caseStyleBold',text:'Albert'}]},{columns:[{width:'35%',text:'Prénom:'},{width:'65%',style:'caseStyleBold',text:'Jean'}]},{columns:[{width:'35%',text:'Nom de naissance:'},{width:'65%',style:'caseStyleBold',text:'Albert'}]},{columns:[{width:'35%',text:'Téléphone:'},{width:'65%',style:'caseStyleBold',text:'06.12.34.56.78'}]},{columns:[{width:'35%',text:'Email:'},{width:'65%',style:'caseStyleBold',text:'jean@prets.com'}]},{columns:[{width:'35%',text:'Adresse:'},{width:'65%',style:'caseStyleBold',text:'7, rue des roses'}]},{columns:[{width:'35%',text:'Code postal:'},{width:'65%',style:'caseStyleBold',text:'06100'}]},{columns:[{width:'35%',text:'Ville:'},{width:'65%',style:'caseStyleBold',text:'Nice'}]},{columns:[{width:'35%',text:'Pays:'},{width:'65%',style:'caseStyleBold',text:'France'}]},{style:'smallLineBreak',text:''},{columns:[{width:'35%',text:'Date de naissance:'},{width:'65%',style:'caseStyleBold',text:'31 janvier 1979'}]},{columns:[{width:'35%',text:'Lieu de naissance:'},{width:'65%',style:'caseStyleBold',text:'Nice'}]},{columns:[{width:'35%',text:'Status marital:'},{width:'65%',style:'caseStyleBold',text:'Marié'}]},{columns:[{width:'35%',text:'Depuis le:'},{width:'65%',style:'caseStyleBold',text:'4 mars 2000'}]},{columns:[{width:'35%',text:'Est lié à l\'emprunteur:'},{width:'65%',style:'caseStyleBold',text:'Claudia Dupont'}]},{columns:[{width:'35%',text:'Procédure de divorce:'},{width:'65%',style:'caseStyleBold',text:'Consentement mutuel'}]},{columns:[{width:'35%',text:'Régime matrimonial:'},{width:'65%',style:'caseStyleBold',text:'Communauté réduite aux acquets'}]},{columns:[{width:'35%',text:'Pays de mariage:'},{width:'65%',style:'caseStyleBold',text:'France'}]},{columns:[{width:'35%',text:'Statut d\'habitation:'},{width:'65%',style:'caseStyleBold',text:'Locataire'}]},{columns:[{width:'35%',text:'Depuis le:'},{width:'65%',style:'caseStyleBold',text:'5 janvier 2018'}]},{columns:[{width:'35%',text:'Nationalité:'},{width:'65%',style:'caseStyleBold',text:'Française'}]},{columns:[{width:'35%',text:'Titre de séjour N°:'},{width:'65%',style:'caseStyleBold',text:'321'}]},{columns:[{width:'35%',text:'Délivré le:'},{width:'65%',style:'caseStyleBold',text:'5 janvier 2015'}]},{columns:[{width:'35%',text:'Expirant le:'},{width:'65%',style:'caseStyleBold',text:''}]},{style:'smallLineBreak',text:''},{columns:[{width:'35%',text:'Banque actuelle:'},{width:'65%',style:'caseStyleBold',text:'BNP'}]},{columns:[{width:'35%',text:'Agence:'},{width:'65%',style:'caseStyleBold',text:'Agence du port'}]},{columns:[{width:'35%',text:'Client depuis le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'BIC:'},{width:'65%',style:'caseStyleBold',text:'123'}]},{columns:[{width:'35%',text:'IBAN:'},{width:'65%',style:'caseStyleBold',text:'456'}]}]);
    expect(JSON.stringify(aPDFExportService.preparePhysicalPersonDetails(anIndividual, somePerons))).toBe(expectedAnswer);
  });


  it('Employee must be correctly formatted', () => {
    const anEmployee: Employee = {type: 'EMPLOYEE',
                                  contract_type: 'CDD',
                                  sub_contract_type: 'VACATAIRE_CIVIL_SERVANT',
                                  profession: 'Employée de mairie',
                                  employer: 'Mairies d\'Antibes',
                                  employer_address: {address: 'Place de la mairie', postal_code:'06700', city:'Antibes', country:'FRANCE'},
                                  hiring_date:'2020-01-05T14:00:00.000Z',
                                  employees_number: 79,
                                  end_contract_date:'2022-08-05T14:00:00.000Z'};
    expect(JSON.stringify(aPDFExportService.prepareEmployeeDetails(anEmployee))).toBe(JSON.stringify([{columns:[{width:'45%',text:'Profession:'},{width:'55%',style:'caseStyleBold',text:'Employée de mairie'}]},{columns:[{width:'45%',text:'Type de contrat:'},{width:'55%',style:'caseStyleBold',text:'CDD'}]},{columns:[{width:'45%',text:'Spécificité du contrat:'},{width:'55%',style:'caseStyleBold',text:'Fonctionnaire vacataire'}]},{columns:[{width:'45%',text:'Employeur:'},{width:'55%',style:'caseStyleBold',text:'Mairies d\'Antibes'}]},{columns:[{width:'45%',text:'Adresse:'},{width:'55%',style:'caseStyleBold',text:'Place de la mairie'}]},{columns:[{width:'45%',text:'Code postal:'},{width:'55%',style:'caseStyleBold',text:'06700'}]},{columns:[{width:'45%',text:'Ville:'},{width:'55%',style:'caseStyleBold',text:'Antibes'}]},{columns:[{width:'45%',text:'Pays:'},{width:'55%',style:'caseStyleBold',text:'FRANCE'}]},{style:'smallLineBreak',text:''},{columns:[{width:'45%',text:'Nombre d\'employé(s):'},{width:'55%',style:'caseStyleBold',text:79}]},{columns:[{width:'45%',text:'Date d\'embauche:'},{width:'55%',style:'caseStyleBold',text:'5 janvier 2020'}]},{columns:[{width:'45%',text:'Date de fin de contrat:'},{width:'55%',style:'caseStyleBold',text:'5 août 2022'}]},{columns:[{width:'45%',text:'Date de fin de période d\'essai:'},{width:'55%',style:'caseStyleBold',text:''}]}]));
  });


  it('SELFEMPLOYED must be correctly formatted', () => {
    const anSELFEMPLOYED: SelfEmployed = {type: 'SELFEMPLOYED',
                                        name: 'Profession médicale',
                                        profession: 'Médecin généraliste',
                                        activity_start_date:'2007-09-05T14:00:00.000Z',
                                        ape_code: '123',
                                        business_assets_owner: true,
                                        business_assets_value: 589632,
                                        collateral: false,
                                        commercial_lease_start_date: '2007-09-06T14:00:00.000Z',
                                        commercial_lease_end_date: '2027-09-06T14:00:00.000Z',
                                        company_name: 'TOP Santé',
                                        employees_number: 1,
                                        rcs_number: '456',
                                        legal_status: 'SARL',
                                        remaining_capital: 125600,
                                        rent_amount: 0,
                                        workplace_address: {address: 'Place de la gare', postal_code:'06800', city:'Nice'}};

    const expectedAnswer = JSON.stringify([{columns:[{width:'45%',text:'Nom de l\'entreprise:'},{width:'55%',style:'caseStyleBold',text:'TOP Santé'}]},{columns:[{width:'45%',text:'Profession:'},{width:'55%',style:'caseStyleBold',text:'Médecin généraliste'}]},{columns:[{width:'45%',text:'Forme juridique:'},{width:'55%',style:'caseStyleBold',text:'SARL'}]},{columns:[{width:'45%',text:'Code APE:'},{width:'55%',style:'caseStyleBold',text:'123'}]},{columns:[{width:'45%',text:'Numéro RCS:'},{width:'55%',style:'caseStyleBold',text:'456'}]},{columns:[{width:'45%',text:'Numéro de SIRET:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Date début d\'activité:'},{width:'55%',style:'caseStyleBold',text:'5 septembre 2007'}]},{columns:[{width:'45%',text:'Date de début du bail:'},{width:'55%',style:'caseStyleBold',text:'6 septembre 2007'}]},{columns:[{width:'45%',text:'Date de fin du bail:'},{width:'55%',style:'caseStyleBold',text:'6 septembre 2027'}]},{columns:[{width:'45%',text:'Montant du loyer:'},{width:'55%',style:'caseStyleBold',text:'0,00 €'}]},{columns:[{width:'45%',text:'Nombre d\'employé(s):'},{width:'55%',style:'caseStyleBold',text:1}]},{columns:[{width:'45%',text:'Propriétaire du fond ?'},{width:'55%',style:'caseStyleBold',text:'Oui'}]},{columns:[{width:'45%',text:'Valeur des actifs:'},{width:'55%',style:'caseStyleBold',text:'589 632,00 €'}]},{columns:[{width:'45%',text:'Nantissement ?'},{width:'55%',style:'caseStyleBold',text:'Non'}]},{columns:[{width:'45%',text:'Capital restant dû (si le fond est acquis via un crédit):'},{width:'55%',style:'caseStyleBold',text:'125 600,00 €'}]},{columns:[{width:'45%',text:'Adresse:'},{width:'55%',style:'caseStyleBold',text:'Place de la gare'}]},{columns:[{width:'45%',text:'Code postal:'},{width:'55%',style:'caseStyleBold',text:'06800'}]},{columns:[{width:'45%',text:'Ville:'},{width:'55%',style:'caseStyleBold',text:'Nice'}]},{columns:[{width:'45%',text:'Pays:'},{width:'55%',style:'caseStyleBold',text:''}]}]);
    // console.log(expectedAnswer);
    // console.log(JSON.stringify(aPDFExportService.prepareIndependantDetails(anSELFEMPLOYED)));
    expect(JSON.stringify(aPDFExportService.prepareIndependantDetails(anSELFEMPLOYED))).toBe(expectedAnswer);
  });

  it('Profession details must be correctly formatted', () => {
    const spGroup: SocioProfessionalGroupEmployes = {type: 'EMPLOYES', category: 'EMPLOYES_DE_COMMERCE'};
    const anEmployee: Employee = {type: 'EMPLOYEE', profession: 'Employée de mairie'};
    const aProfession: ProfessionDetails = {socio_professional_group: spGroup, status: 'EMPLOYEE', worker: anEmployee};
    expect(JSON.stringify(aPDFExportService.prepareProfessionDetails(aProfession))).toBe(JSON.stringify([{columns:[{width:'45%',text:'Groupe SP:'},{width:'55%',style:'caseStyleBold',text:'Employés'}]},{columns:[{width:'45%',text:'Catégorie SP:'},{width:'55%',style:'caseStyleBold',text:'Employés de commerce'}]},{columns:[{width:'45%',text:'Status:'},{width:'55%',style:'caseStyleBold',text:'Employé(e)'}]},{style:'bigLineBreak',text:''},{columns:[{width:'45%',text:'Profession:'},{width:'55%',style:'caseStyleBold',text:'Employée de mairie'}]},{columns:[{width:'45%',text:'Type de contrat:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Spécificité du contrat:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Employeur:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Adresse:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Code postal:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Ville:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Pays:'},{width:'55%',style:'caseStyleBold',text:''}]},{style:'smallLineBreak',text:''},{columns:[{width:'45%',text:'Nombre d\'employé(s):'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Date d\'embauche:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Date de fin de contrat:'},{width:'55%',style:'caseStyleBold',text:''}]},{columns:[{width:'45%',text:'Date de fin de période d\'essai:'},{width:'55%',style:'caseStyleBold',text:''}]}]));
  });


  it('Revenues table must be correctly formatted', () => {
    const aRevenueItem1: RevenueItem = {type: 'SALARY', monthly_amount: {figure: 3000, weight: 80}, comment: 'Un salaire' };
    const aRevenueItem2: RevenueItem = {type: 'RENTAL_INCOMES', monthly_amount: {figure: 750, weight: 75}, comment: 'Un revenus locatif' };
    const aRevenuesList: RevenueItem[] = [aRevenueItem1, aRevenueItem2];

    expect(JSON.stringify(aPDFExportService.formatRevenuesTable(aRevenuesList))).toBe(JSON.stringify({table:{style:'table',headerRows:1,widths:['25%','25%','25%','25%'],body:[[{style:'thead',text:'Type de revenu',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'25%',text:'Salaire'},{width:'25%',text:'3 000,00 €'},{width:'25%',text:'80%'},{width:'25%',text:'Un salaire'}],[{width:'25%',text:'Revenus locatifs'},{width:'25%',text:'750,00 €'},{width:'25%',text:'75%'},{width:'25%',text:'Un revenus locatif'}]]}}));
  });


  it('Charges table must be correctly formatted', () => {
    const aChargeItem1: ChargeItem = {type: 'RENT', monthly_amount: {figure: 3000, weight: 80}, comment: 'Un loyer' };
    const aChargeItem2: ChargeItem = {type: 'LOA', monthly_amount: {figure: 750, weight: 75}, continue_after_project: true, comment: 'Une LOA' };
    const aChargesList: ChargeItem[] = [aChargeItem1, aChargeItem2];

    // console.log(JSON.stringify(aPDFExportService.formatChargesTable(aChargesList)));
    expect(JSON.stringify(aPDFExportService.formatChargesTable(aChargesList))).toBe(JSON.stringify({table:{style:'table',headerRows:1,widths:['20%','20%','20%','20%','20%'],body:[[{style:'thead',text:'Type de charge',alignment:'center'},{style:'thead',text:'Avant/après projet',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'20%',text:'Loyer'},{width:'20%',text:'Charge après projet'},{width:'20%',text:'3 000,00 €'},{width:'20%',text:'80%'},{width:'20%',text:'Un loyer'}],[{width:'20%',text:'Location avec option d\'achat'},{width:'20%',text:'Charge avant projet'},{width:'20%',text:'750,00 €'},{width:'20%',text:'75%'},{width:'20%',text:'Une LOA'}]]}}));
  });


  it('Patrimony table must be correctly formatted', () => {
    const aPatrominyItem1: PatrimonyItem = {type: 'LEP', breakup: {type: 'USUFRUIT', portion: 30}, for_sale: undefined, value: 14000, buying_or_opening_date: '2017-09-06T14:00:00.000Z', comment: 'Un LEP' };
    const aPatrominyItem2: PatrimonyItem = {type: 'COLLECTION', breakup: null, value: 6500.5, buying_or_opening_date: '2017-10-06T14:00:00.000Z', comment: 'Une Collection' };
    const aPatrominyItem3: PatrimonyItem = {type: 'REAL_ESTATE_SECONDARY_PROPERTY', for_sale: {price: 100000, agency_fees: 2500, taxes: 25000, since: '2017-10-06T14:00:00.000Z', dates: {sales_agreement_date: '2017-09-06T14:00:00.000Z', conditions_precedent_end_date:'2018-10-06T14:00:00.000Z', signature_date:'2019-10-06T14:00:00.000Z'}}, breakup: null, value: 6500.5, buying_or_opening_date: '2017-10-06T14:00:00.000Z', comment: 'Une résidence secondaire' };
    const aPatrimonyList: PatrimonyItem[] = [aPatrominyItem1, aPatrominyItem2, aPatrominyItem3];

    const expectedAnswer1 = JSON.stringify({table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Type',alignment:'center'},{style:'thead',text:'Valeur',alignment:'center'},{style:'thead',text:'Démembrement éventuel',alignment:'center'},{style:'thead',text:'Date d\'achat ou d\'ouverture',alignment:'center'},{style:'thead',text:'Capital restant du',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'},{style:'thead',text:'Est à vendre ?',alignment:'center'}],[1,'LEP','14 000,00 €','Usufruit à hauteur de 30%','6 septembre 2017','','Un LEP','Non'],[2,'Collection','6 500,50 €','Pleine propriété','6 octobre 2017','','Une Collection','Non'],[3,'Résidence secondaire','6 500,50 €','Pleine propriété','6 octobre 2017','','Une résidence secondaire','Non']]}});
    const expectedAnswer2 = JSON.stringify({table:{style:'table',headerRows:1,widths:['14.285%','14.285%','14.285%','14.285%','14.285%','14.285%','14.285%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Prix',alignment:'center'},{style:'thead',text:'Frais',alignment:'center'},{style:'thead',text:'Impôt',alignment:'center'},{style:'thead',text:'Date de signature du compromis',alignment:'center'},{style:'thead',text:'Date de levée des conditions suspensives',alignment:'center'},{style:'thead',text:'Date de signature',alignment:'center'}],[3,'100 000,00 €','2 500,00 €','25 000,00 €','6 septembre 2017','6 octobre 2018','6 octobre 2019']]}});

    expect(JSON.stringify(aPDFExportService.formatPatrimonyTable(aPatrimonyList))).toBe(expectedAnswer1);
    expect(JSON.stringify(aPDFExportService.formatPatrimonyForSaleTable(aPatrimonyList))).toBe(expectedAnswer2);
  });


  it('Finance table must be correctly formatted', () => {
    const aRevenueItem: RevenueItem = {type: 'SALARY', monthly_amount: {figure: 3000, weight: 80}, comment: 'Un salaire' };
    const aChargeItem: ChargeItem = {type: 'RENT', monthly_amount: {figure: 3000, weight: 80}, comment: 'Un loyer' };
    const aPatrominyItem: PatrimonyItem = {type: 'REAL_ESTATE_SECONDARY_PROPERTY', for_sale: {price: 100000, agency_fees: 2500, taxes: 25000, since: '2017-10-06T14:00:00.000Z', dates: {sales_agreement_date: '2017-09-06T14:00:00.000Z', conditions_precedent_end_date:'2018-10-06T14:00:00.000Z', signature_date:'2019-10-06T14:00:00.000Z'}}, breakup: null, value: 6500.5, buying_or_opening_date: '2017-10-06T14:00:00.000Z', comment: 'Une résidence secondaire' };
    const aCurrentLoanItem: CurrentLoan = {type: 'MORTGAGE', future: 'CONTINUE_AFTER_PROJECT', monthly_payment: {figure: 120, weight: 80}, remaining_capital: 1500, start_date: '2017-10-06T14:00:00.000Z', end_date: '2027-10-06T14:00:00.000Z', lender: 'BNP' };

    const aFinanceDetails: FinanceDetails = {personal_funding: 15000, income_tax: {fiscal_reference_revenue_Nminus1: 1500, fiscal_reference_revenue_Nminus2: 1700}, current_loans: [aCurrentLoanItem], revenues: [aRevenueItem], charges: [aChargeItem], patrimony: [aPatrominyItem]};

    const expectedAnswer = JSON.stringify([{columns:[{width:'55%',text:'Apport au projet:'},{width:'45%',style:'caseStyleBold',text:'15 000,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-1:'},{width:'45%',style:'caseStyleBold',text:'1 500,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-2:'},{width:'45%',style:'caseStyleBold',text:'1 700,00 €'}]},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Revenus mensuels nets avant impôt:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['25%','25%','25%','25%'],body:[[{style:'thead',text:'Type de revenu',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'25%',text:'Salaire'},{width:'25%',text:'3 000,00 €'},{width:'25%',text:'80%'},{width:'25%',text:'Un salaire'}]]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Charges mensuelles:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['20%','20%','20%','20%','20%'],body:[[{style:'thead',text:'Type de charge',alignment:'center'},{style:'thead',text:'Avant/après projet',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'20%',text:'Loyer'},{width:'20%',text:'Charge après projet'},{width:'20%',text:'3 000,00 €'},{width:'20%',text:'80%'},{width:'20%',text:'Un loyer'}]]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Patrimoine:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Type',alignment:'center'},{style:'thead',text:'Valeur',alignment:'center'},{style:'thead',text:'Démembrement éventuel',alignment:'center'},{style:'thead',text:'Date d\'achat ou d\'ouverture',alignment:'center'},{style:'thead',text:'Capital restant du',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'},{style:'thead',text:'Est à vendre ?',alignment:'center'}],[1,'Résidence secondaire','6 500,50 €','Pleine propriété','6 octobre 2017','','Une résidence secondaire','Non']]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Éléments du patrimoine en vente:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['14.285%','14.285%','14.285%','14.285%','14.285%','14.285%','14.285%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Prix',alignment:'center'},{style:'thead',text:'Frais',alignment:'center'},{style:'thead',text:'Impôt',alignment:'center'},{style:'thead',text:'Date de signature du compromis',alignment:'center'},{style:'thead',text:'Date de levée des conditions suspensives',alignment:'center'},{style:'thead',text:'Date de signature',alignment:'center'}],[1,'100 000,00 €','2 500,00 €','25 000,00 €','6 septembre 2017','6 octobre 2018','6 octobre 2019']]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Crédit en cours:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Type de prêt',alignment:'center'},{style:'thead',text:'Futur du prêt',alignment:'center'},{style:'thead',text:'Mensualité',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Capital restant dû',alignment:'center'},{style:'thead',text:'Date de début',alignment:'center'},{style:'thead',text:'Date de fin',alignment:'center'},{style:'thead',text:'Organisme préteur',alignment:'center'}],['Crédit immobilier','Continue après le projet','120,00 €','80%','1 500,00 €','6 octobre 2017','6 octobre 2027','BNP']]}}]);
    // console.log(expectedAnswer);
    // console.log(JSON.stringify(aPDFExportService.prepareFinanceDetails(aFinanceDetails)));
    expect(JSON.stringify(aPDFExportService.prepareFinanceDetails(aFinanceDetails))).toBe(expectedAnswer);
  });


  it('Household details must be correctly formatted', () => {
    const aChildrenList: Child[] = [{birth_date: '2015-10-06T14:00:00.000Z', shared_custody: true}, {birth_date: '2010-10-06T14:00:00.000Z', shared_custody: false}];
    const aDependentPersonsList: DependentPerson[] = [{type: 'MOTHER', comment: 'Parent dépendant'}, {type: 'OTHER', comment: 'Autre parent dépendant'}];
    const aFinanceDetails: FinanceDetails = {personal_funding: 15000, income_tax: {fiscal_reference_revenue_Nminus1: 1500, fiscal_reference_revenue_Nminus2: 1700}};
    const anHouseholdDetails: HouseholdDetails = {type: 'HOUSEHOLD', finance: aFinanceDetails, children: aChildrenList, dependent_persons: aDependentPersonsList, first_time_buyer: true, people_count: 5, children_count: 2, dependent_persons_count: 2 };

    // console.log(JSON.stringify(aPDFExportService.prepareHouseholdDetails(anHouseholdDetails)));
    const expectedResults = JSON.stringify([{columns:[{width:'95%',text:'Le ménage est primo-accédant.'},{width:'5%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Nombre de personne(s):'},{width:'65%',style:'caseStyleBold',text:5}]},{columns:[{width:'35%',text:'Dont nombre d\'enfant(s):'},{width:'65%',style:'caseStyleBold',text:2}]},{columns:[{width:'35%',text:'Dont nombre de personne(s) à charge:'},{width:'65%',style:'caseStyleBold',text:2}]},{style:'smallLineBreak',text:''},{style:'h3bold',width:'100%',text:'Enfants: 2'},{table:{style:'table',headerRows:1,widths:['20%','20%'],body:[[{width:'35%',style:'thead',text:'Age'},{width:'65%',style:'thead',text:'Garde alternée'}],[{width:'35%',text:6},{width:'65%',text:'Oui'}],[{width:'35%',text:11},{width:'65%',text:'Non'}]]}},{style:'h3bold',width:'100%',text:'Personnes dépendantes:'},{table:{style:'table',headerRows:1,widths:['20%','40%'],body:[[{width:'35%',style:'thead',text:'Relation'},{width:'65%',style:'thead',text:'Commentaire'}],[{width:'35%',text:'Mère'},{width:'65%',text:'Parent dépendant'}],[{width:'35%',text:'Non ascendant'},{width:'65%',text:'Autre parent dépendant'}]]}},{style:'smallLineBreak',text:''},{style:'h2bold',width:'100%',text:'Apport, revenus, charges et patrimoine:'},[{columns:[{width:'55%',text:'Apport au projet:'},{width:'45%',style:'caseStyleBold',text:'15 000,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-1:'},{width:'45%',style:'caseStyleBold',text:'1 500,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-2:'},{width:'45%',style:'caseStyleBold',text:'1 700,00 €'}]},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Revenus mensuels nets avant impôt: aucun.'},{style:'smallLineBreak',text:''},null,{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Charges mensuelles: aucunes.'},{style:'smallLineBreak',text:''},null,{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Patrimoine: aucun.'},{style:'smallLineBreak',text:''},null,{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Éléments du patrimoine en vente: aucun.'},{style:'smallLineBreak',text:''},null,{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Crédit en cours: aucun.'},{style:'smallLineBreak',text:''},null]]);
    // console.log(expectedResults);
    expect(JSON.stringify(aPDFExportService.prepareHouseholdDetails(anHouseholdDetails))).toBe(expectedResults);
  });


  it('Partners must be correctly formatted', () => {
    const aPartners: ActivePartner[] = [{type: 'NOTARY', name: 'Michel, Martin et associés', phone_number: '04.93.33.22.12', email: 'contact@michelmartinassociates.fr',
              address: {address: '2, rue des fleurs', postal_code: '06300', city: 'Nice'},
              contact: {courtesy:'MRS', first_name: 'Jean', last_name: 'Martin', phone_number: '04.93.33.22.11', email: 'martin@michelmartinassociates.fr'},
              comment: 'La clerc, Mme Dupond, est trés disponible.'},
             {type: 'BROKER', name: 'Hypo', phone_number: '09.78.350.700', email: 'contact@lowtaux.com',
              address: {address: '36-38, Route de Rennes', postal_code: '44300', city: 'Nantes'}, agreement_number: '09051593',
              contact: {courtesy: 'MR', first_name: 'Fabrice', last_name: 'Hamon',  phone_number: '06.12.19.35.70', email: 'fabrice.hamon@lowtaux.fr'}},
             {type: 'ESTATE_AGENT', name: 'In Pierre We Trust', sub_entity: 'Agence du Port', phone_number: '05.56.56.56.89', email: 'contact@alabellepierre.com',
              address: {address: '12, Avenue des Pierres qui roulent n\'amassent pas mousse', postal_code: '44300', city: 'Nantes'},
              contact: {first_name: 'Jean-Pierre', last_name: 'Pierre', phone_number: '06.78.78.78.78', email: 'jpp@alabellepierre.fr'} }];

    const expectedResults = JSON.stringify([{style:'bigLineBreak',text:'',pageOrientation:'landscape',pageBreak:'before'},{style:'bigLineBreak',text:''},{style:'h2',text:'Intervenants sur le projet'},{style:'bigLineBreak',text:''},{table:{style:'table',headerRows:1,body:[[{style:'thead',text:'Type',alignment:'center'},{style:'thead',text:'Nom',alignment:'center'},{style:'thead',text:'Agence ou filiale',alignment:'center'},{style:'thead',text:'Adresse',alignment:'center'},{style:'thead',text:'Nom du contact',alignment:'center'},{style:'thead',text:'Téléphone',alignment:'center'},{style:'thead',text:'Email',alignment:'center'},{style:'thead',text:'Numéro d\'agrément',alignment:'center'},{style:'thead',text:'Role (acheteur, vendeur, commun)',alignment:'center'}],['Notaire','Michel, Martin et associés','','2, rue des fleurs, 06300, Nice','Mme. Jean Martin','04.93.33.22.11','martin@michelmartinassociates.fr','',''],['Courtier','Hypo','','36-38, Route de Rennes, 44300, Nantes','M. Fabrice Hamon','06.12.19.35.70','fabrice.hamon@lowtaux.fr','09051593',''],['Agent immobilier','In Pierre We Trust','Agence du Port','12, Avenue des Pierres qui roulent n\'amassent pas mousse, 44300, Nantes','Jean-Pierre Pierre','06.78.78.78.78','jpp@alabellepierre.fr','','']]}},{text:'',pageOrientation:'landscape',pageBreak:'before'}]);
    // console.log(JSON.stringify(aPDFExportService.encodePartnersTable(aPartners)));
    // console.log(expectedResults);
    expect(JSON.stringify(aPDFExportService.encodePartnersTable(aPartners))).toBe(expectedResults);
  });


it('Case must be correctly formatted', () => {
    const aCaseHousehold: Case = { actor: {
        type: 'HOUSEHOLD',
        first_time_buyer: true,
        persons: [
          {
            is_borrower: true,
            civil: {
              first_name: 'Céline',
            }
          },
          {
            is_borrower: true,
            civil: {
              first_name: 'Jean',
            }
          },
          {
            is_borrower: false,
            civil: {
              first_name: 'Albert',
            }
          }
        ]
      }
    };

    aPDFExportService.aCase = aCaseHousehold;

    // console.log(JSON.stringify(aPDFExportService.encodeCase(aCaseHousehold)));
    const expectedResults = JSON.stringify([{style:'h2',text:'Informations relatives aux emprunteurs'},{style:'bigLineBreak',text:''},{style:'h2',text:'Informations relatives au ménage'},{style:'bigLineBreak',text:''},{columns:[{width:'95%',text:'Le ménage est primo-accédant.'},{width:'5%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Nombre de personne(s):'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Dont nombre d\'enfant(s):'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Dont nombre de personne(s) à charge:'},{width:'65%',style:'caseStyleBold',text:''}]},{style:'smallLineBreak',text:''},{style:'h3bold',width:'100%',text:'Enfants: 0'},{},{style:'h3bold',width:'100%',text:''},{},{style:'smallLineBreak',text:''},{style:'h2bold',width:'100%',text:'Apport, revenus, charges et patrimoine:'},[],{style:'smallLineBreak',text:''},{text:'Fin des informations relatives au ménage'},{canvas:[{type:'line',x1:0,y1:5,x2:762,y2:5,lineWidth:3}]},{text:'',pageOrientation:'landscape',pageBreak:'before'},{style:'h2',text:'Informations emprunteur 1: Céline '},{style:'bigLineBreak',text:''},{table:{widths:['50%','50%'],body:[[[{style:'h3bold',text:'Etat civil'}],[{style:'h3bold',text:'Profession'}]],[[{columns:[{width:'35%',text:'Civilité:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Nom:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Prénom:'},{width:'65%',style:'caseStyleBold',text:'Céline'}]},{columns:[{width:'35%',text:'Nom de naissance:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Téléphone:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Email:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Adresse:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Code postal:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Ville:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Pays:'},{width:'65%',style:'caseStyleBold',text:''}]},{style:'smallLineBreak',text:''},{columns:[{width:'35%',text:'Date de naissance:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Lieu de naissance:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Status marital:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Depuis le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Est lié à l\'emprunteur:'},{width:'65%',style:'caseStyleBold',text:'Aucun'}]},{columns:[{width:'35%',text:'Procédure de divorce:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Régime matrimonial:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Pays de mariage:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Statut d\'habitation:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Depuis le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Nationalité:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Titre de séjour N°:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Délivré le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Expirant le:'},{width:'65%',style:'caseStyleBold',text:''}]},{style:'smallLineBreak',text:''},{columns:[{width:'35%',text:'Banque actuelle:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Agence:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Client depuis le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'BIC:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'IBAN:'},{width:'65%',style:'caseStyleBold',text:''}]}],[]]]},layout:'noBorders'},{style:'bigLineBreak',text:''},{style:'h2bold',text:'Apport, revenus, charges et patrimoine'},{style:'smallLineBreak',text:''},{text:'Fin des informations relatives à l\'emprunteur 1: Céline '},{canvas:[{type:'line',x1:0,y1:5,x2:762,y2:5,lineWidth:3}]},{text:'',pageOrientation:'landscape',pageBreak:'before'},{style:'h2',text:'Informations emprunteur 2: Jean '},{style:'bigLineBreak',text:''},{table:{widths:['50%','50%'],body:[[[{style:'h3bold',text:'Etat civil'}],[{style:'h3bold',text:'Profession'}]],[[{columns:[{width:'35%',text:'Civilité:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Nom:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Prénom:'},{width:'65%',style:'caseStyleBold',text:'Jean'}]},{columns:[{width:'35%',text:'Nom de naissance:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Téléphone:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Email:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Adresse:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Code postal:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Ville:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Pays:'},{width:'65%',style:'caseStyleBold',text:''}]},{style:'smallLineBreak',text:''},{columns:[{width:'35%',text:'Date de naissance:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Lieu de naissance:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Status marital:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Depuis le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Est lié à l\'emprunteur:'},{width:'65%',style:'caseStyleBold',text:'Aucun'}]},{columns:[{width:'35%',text:'Procédure de divorce:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Régime matrimonial:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Pays de mariage:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Statut d\'habitation:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Depuis le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Nationalité:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Titre de séjour N°:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Délivré le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Expirant le:'},{width:'65%',style:'caseStyleBold',text:''}]},{style:'smallLineBreak',text:''},{columns:[{width:'35%',text:'Banque actuelle:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Agence:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'Client depuis le:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'BIC:'},{width:'65%',style:'caseStyleBold',text:''}]},{columns:[{width:'35%',text:'IBAN:'},{width:'65%',style:'caseStyleBold',text:''}]}],[]]]},layout:'noBorders'},{style:'bigLineBreak',text:''},{style:'h2bold',text:'Apport, revenus, charges et patrimoine'},{style:'smallLineBreak',text:''},{text:'Fin des informations relatives à l\'emprunteur 2: Jean '},{canvas:[{type:'line',x1:0,y1:5,x2:762,y2:5,lineWidth:3}]},{text:'',pageOrientation:'landscape',pageBreak:'before'}]);
    // console.log(expectedResults);
    expect(JSON.stringify(aPDFExportService.encodeCase(aCaseHousehold))).toBe(expectedResults);
  });


  it('Summary table must be correctly formatted', () => {
    const aBudgetResults: BudgetResults = {budgets: {broker_fees: 0, file_management_fees: 0, guaranties_fees: 2235.65, maximal_price: 311396.26, notary_fees: 7745.54, other_expenses: 0, total_budget: 321377.45}, funding_plan: {status: 'OPTIMAL', loans: [{type: 'PTZ_LOAN', yearly_rate: 0.0, duration_months: 300, amount: 115686.17, grace_period: {type: 'PARTIAL', length: 180}, amortizations: [964.05, 964.05, 964.05, 964.05, 964.05], interests: [0.0, 0.0, 0.0, 0.0, 0.0], insurances: [], released_amounts: [0.0, 0.0, 0.0, 0.0, 0.0], remaining_capital: [4820.26, 3856.21, 2892.15, 1928.1, 964.05], preamortizations: [0.0, 0.0, 0.0, 0.0, 0.0], interests_cost: 0.0, insurance_cost: 0.0, preamortization_cost: 0.0}, {type: 'FREE_LOAN', yearly_rate: 1.0, duration_months: 180, amount: 155691.28, guaranty: {type: 'CREDIT_LOGEMENT_CLASSIC', guaranty_commission: 620.0, mutualized_guaranty_contribution: 1615.65}, grace_period: {type: 'PARTIAL', length: 6}, amortizations: [960.04, 960.84, 961.65, 962.45, 963.25], interests: [4.01, 3.21, 2.41, 1.6, 0.8], insurances: [{insurance: {type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100.0, mandatory: true}, monthly_values: [25.95, 25.95, 25.95, 25.95, 25.95]}], released_amounts: [0.0, 0.0, 0.0, 0.0, 0.0], remaining_capital: [4808.23, 3848.19, 2887.34, 1925.7, 963.25], preamortizations: [0.0, 0.0, 0.0, 0.0, 0.0], interests_cost: 12432.13, insurance_cost: 4670.74, preamortization_cost: 0.0}, {type: 'BRIDGE_LOAN', yearly_rate: 1.2, duration_months: 12, amount: 50000.0, grace_period: {type: 'PARTIAL', length: 11}, amortizations: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 50000.0], interests: [50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0], insurances: [{insurance: {type: 'INITIAL_CAPITAL', rate: 0.4, quota: 100.0, mandatory: true}, monthly_values: [16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67]}], released_amounts: [50000.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], remaining_capital: [50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0], preamortizations: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], interests_cost: 600.0, insurance_cost: 200.0, preamortization_cost: 0.0}], taegs: {free_taeg: 0.55, free_taeg_above_wear_rate: false, bridge_taeg: 1.61, bridge_taeg_above_wear_rate: false}, summary: {effective_maximal_monthly_payment: 990.0, duration_months: 300, total_interests: 13032.13, total_insurances: 4870.74, total_guaranty: 2235.65, total_preamortizations: 0.0, final_debt_ratio: 33.0, total_personal_funding: 0, total_revenues: 3000.0, max_total_charges: 0, max_total_persistant_loans: 0, zone: 'A'}}};
    const aBudgetSummaryTable = aPDFExportService.graph(aBudgetResults.funding_plan, IconsSvg.voidSvg, IconsSvg.voidSvg);

    const expectedResults = JSON.stringify([{style:'h2',text:'Récapitulatif des lignes de crédit, assurances et visualisation graphique',alignment:'center',pageOrientation:'landscape',pageBreak:'before'},{columns:[{width:'15%',text:''},{style:'table',margin:[0,0,0,0],headerRows:1,widths:['auto'],table:{body:[[{style:'thead',text:'Numéro du prêt',alignment:'center'},{style:'thead',text:'Type',alignment:'center'},{style:'thead',text:'Montant',alignment:'center'},{style:'thead',text:'Durée',alignment:'center'},{style:'thead',text:'Taux',alignment:'center'},{style:'thead',text:'Total intérêts',alignment:'center'},{style:'thead',text:'Type de différé',alignment:'center'},{style:'thead',text:'Durée du différé',alignment:'center'},{style:'thead',text:'Caution',alignment:'center'},{style:'thead',text:'Montant de la caution',alignment:'center'},{style:'thead',text:'Total assurance(s)',alignment:'center'}],[1,'Prêt à Taux Zéro','115 686,17 €',300,'0,00%','0,00 €','Partiel',180,'Aucune','0,00 €','0,00 €'],[2,'Prêt Amortissable','155 691,28 €',180,'1,00%','12 432,13 €','Partiel',6,'Crédit Logement Classic','2 235,65 €','4 670,74 €'],[3,'Prêt Relais','50 000,00 €',12,'1,20%','600,00 €','Partiel',11,'Aucune','0,00 €','200,00 €'],['TOTAL','','321 377,45 €','','','13 032,13 €','','','','2 235,65 €','4 870,74 €']]}},{width:'*',text:''}]},{style:'bigLineBreak',text:''},{columns:[{width:'20%',text:''},{style:'table',margin:[0,0,0,0],headerRows:1,widths:['auto'],table:{body:[[{style:'thead',text:'Numéro du prêt',alignment:'center'},{style:'thead',text:'Type de prêt',alignment:'center'},{style:'thead',text:'Type d\'assurance',alignment:'center'},{style:'thead',text:'Taux',alignment:'center'},{style:'thead',text:'Quotité',alignment:'center'},{style:'thead',text:'Obligatoire ?',alignment:'center'},{style:'thead',text:'Risques couverts',alignment:'center'},{style:'thead',text:'Emprunteur',alignment:'center'},{style:'thead',text:'Assureur',alignment:'center'}],[2,'Prêt Amortissable','Capital initial',0.2,100,'Oui','','',''],[3,'Prêt Relais','Capital initial',0.4,100,'Oui','','','']]}},{width:'*',text:''}]},{style:'bigLineBreak',text:''},{width:'450',alignment:'center'},{style:'h2',text:'Profil de remboursement',pageOrientation:'landscape',pageBreak:'before'},{width:'800'}]);
    expect(JSON.stringify(aBudgetSummaryTable)).toBe(expectedResults);
  });


  it('Amortization tables must be correctly formatted', () => {
    const aBudgetResults: BudgetResults = {funding_plan: {status: 'OPTIMAL', loans: [{type: 'SMOOTHABLE_CHARGE', yearly_rate: 0.0, duration_months: 60, amount: 7200.0, amortizations: [120.0, 120.0, 120.0, 120.0, 120.0], interests: [0.0, 0.0, 0.0, 0.0, 0.0], preamortizations: [0.0, 0.0, 0.0, 0.0, 0.0], insurances: [], released_amounts: [0.0, 0.0, 0.0, 0.0, 0.0], remaining_capital: [0.0, 0.0, 0.0, 0.0, 0.0], interests_cost: 0.0, insurance_cost: 0.0, preamortization_cost: 0.0}, {type: 'PTZ_LOAN', yearly_rate: 0.0, duration_months: 300, amount: 115686.17, grace_period: {type: 'PARTIAL', length: 180}, amortizations: [964.05, 964.05, 964.05, 964.05, 964.05], interests: [0.0, 0.0, 0.0, 0.0, 0.0], insurances: [], released_amounts: [0.0, 0.0, 0.0, 0.0, 0.0], remaining_capital: [4820.26, 3856.21, 2892.15, 1928.1, 964.05], preamortizations: [0.0, 0.0, 0.0, 0.0, 0.0], interests_cost: 0.0, insurance_cost: 0.0, preamortization_cost: 0.0}, {type: 'FREE_LOAN', yearly_rate: 1.0, duration_months: 180, amount: 155691.28, guaranty: {type: 'CREDIT_LOGEMENT_CLASSIC', guaranty_commission: 620.0, mutualized_guaranty_contribution: 1615.65}, grace_period: {type: 'PARTIAL', length: 6}, amortizations: [960.04, 960.84, 961.65, 962.45, 963.25], interests: [4.01, 3.21, 2.41, 1.6, 0.8], insurances: [{insurance: {type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100.0, mandatory: true}, monthly_values: [25.95, 25.95, 25.95, 25.95, 25.95]}], released_amounts: [0.0, 0.0, 0.0, 0.0, 0.0], remaining_capital: [4808.23, 3848.19, 2887.34, 1925.7, 963.25], preamortizations: [0.0, 0.0, 0.0, 0.0, 0.0], interests_cost: 12432.13, insurance_cost: 4670.74, preamortization_cost: 0.0}, {type: 'BRIDGE_LOAN', yearly_rate: 1.2, duration_months: 12, amount: 50000.0, grace_period: {type: 'PARTIAL', length: 11}, amortizations: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 50000.0], interests: [50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0, 50.0], insurances: [{insurance: {type: 'INITIAL_CAPITAL', rate: 0.4, quota: 100.0, mandatory: true}, monthly_values: [16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67, 16.67]}], released_amounts: [50000.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], remaining_capital: [50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0, 50000.0], preamortizations: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], interests_cost: 600.0, insurance_cost: 200.0, preamortization_cost: 0.0}], taegs: {free_taeg: 0.55, free_taeg_above_wear_rate: false, bridge_taeg: 1.61, bridge_taeg_above_wear_rate: false}, summary: {effective_maximal_monthly_payment: 990.0, duration_months: 300, total_interests: 13032.13, total_insurances: 4870.74, total_guaranty: 2235.65, total_preamortizations: 0.0, final_debt_ratio: 33.0, total_personal_funding: 0, total_revenues: 3000.0, max_total_charges: 0, max_total_persistant_loans: 0, zone: 'A'}}};
    const anAmortizationTable = aPDFExportService.loanTables(aBudgetResults.funding_plan);

    expect(JSON.stringify(anAmortizationTable)).toBe('[[{"style":"h2","text":"Prêt à Taux Zéro, 0%: ","pageOrientation":"portrait","pageBreak":"before"},{"columns":[{"width":"10%","text":""},{"style":"table","headerRows":1,"widths":"100%","table":{"body":[[{"style":"thead","text":"Numéro d\'échance","alignment":"center"},{"style":"thead","text":"Amortissement","alignment":"center"},{"style":"thead","text":"Intérêts","alignment":"center"},{"style":"thead","text":"Assurance","alignment":"center"},{"style":"thead","text":"Capital restant dû","alignment":"center"},{"style":"thead","text":"Échéance","alignment":"center"},{"style":"thead","text":"Montant débloqué","alignment":"center"}],[1,"964,05","0,00","0,00","4 820,26","964,05","0,00"],[2,"964,05","0,00","0,00","3 856,21","964,05","0,00"],[3,"964,05","0,00","0,00","2 892,15","964,05","0,00"],[4,"964,05","0,00","0,00","1 928,10","964,05","0,00"],[5,"964,05","0,00","0,00","964,05","964,05","0,00"]]}},{"width":"*","text":""}]}],[{"style":"h2","text":"Prêt Amortissable, 1%: ","pageOrientation":"portrait","pageBreak":"before"},{"columns":[{"width":"10%","text":""},{"style":"table","headerRows":1,"widths":"100%","table":{"body":[[{"style":"thead","text":"Numéro d\'échance","alignment":"center"},{"style":"thead","text":"Amortissement","alignment":"center"},{"style":"thead","text":"Intérêts","alignment":"center"},{"style":"thead","text":"Assurance","alignment":"center"},{"style":"thead","text":"Capital restant dû","alignment":"center"},{"style":"thead","text":"Échéance","alignment":"center"},{"style":"thead","text":"Montant débloqué","alignment":"center"}],[1,"960,04","4,01","25,95","4 808,23","990,00","0,00"],[2,"960,84","3,21","25,95","3 848,19","990,00","0,00"],[3,"961,65","2,41","25,95","2 887,34","990,01","0,00"],[4,"962,45","1,60","25,95","1 925,70","990,00","0,00"],[5,"963,25","0,80","25,95","963,25","990,00","0,00"]]}},{"width":"*","text":""}]}],[{"style":"h2","text":"Prêt Relais, 1.2%: ","pageOrientation":"portrait","pageBreak":"before"},{"columns":[{"width":"10%","text":""},{"style":"table","headerRows":1,"widths":"100%","table":{"body":[[{"style":"thead","text":"Numéro d\'échance","alignment":"center"},{"style":"thead","text":"Amortissement","alignment":"center"},{"style":"thead","text":"Intérêts","alignment":"center"},{"style":"thead","text":"Assurance","alignment":"center"},{"style":"thead","text":"Capital restant dû","alignment":"center"},{"style":"thead","text":"Échéance","alignment":"center"},{"style":"thead","text":"Montant débloqué","alignment":"center"}],[1,"0,00","50,00","16,67","50 000,00","66,67","50 000,00"],[2,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[3,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[4,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[5,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[6,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[7,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[8,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[9,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[10,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[11,"0,00","50,00","16,67","50 000,00","66,67","0,00"],[12,"50 000,00","50,00","16,67","50 000,00","50 066,67","0,00"]]}},{"width":"*","text":""}]}]]');
  });


  it('TAEGS section must be correctly formatted', () => {
    const aBudgetResults: BudgetResults = { funding_plan: {status: 'OPTIMAL', taegs: {free_taeg: 0.55, free_taeg_above_wear_rate: false, bridge_taeg: 5.61, bridge_taeg_above_wear_rate: true} }};
    const aTaegSection = aPDFExportService.generateTaegSection(aBudgetResults.funding_plan.taegs);

    expect(JSON.stringify(aTaegSection)).toBe('[{"style":"bigLineBreak","text":""},{"style":{"fontSize":12,"bold":true,"color":"green"},"alignment":"center","text":"Taux Annuel Effectif Global (TAEG) de cette proposition: 0.55 %"},{"style":"bigLineBreak","text":""},{"style":{"fontSize":12,"bold":true,"color":"red"},"alignment":"center","text":"Taux Annuel Effectif Global (TAEG) du (ou des) prêt(s) relais de cette proposition: 5.61 %"}]');
  });


});
