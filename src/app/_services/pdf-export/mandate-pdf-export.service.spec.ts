import { TestBed } from '@angular/core/testing';
import { MandatePDFExportService } from './mandate-pdf-export.service';

import { Case } from '../../_api/model/case';
import { ActivePartner } from '../../_api/model/activePartner';
import { ChargeItem, RevenueItem, PatrimonyItem, FinanceDetails, CurrentLoan, HouseholdDetails } from 'src/app/_api';
import { HouseConstruction } from '../../_api/model/houseConstruction';
import { AdministrativeInformation } from '../../_api/model/administrativeInformation';
import { Contact } from '../../_api/model/contact';
import { CaseFormService, CaseService } from '../../_services';

import { IconsSvg } from './icons-svg';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

describe('MandatePDFExportService', () => {

  let aMandatePDFExportService: MandatePDFExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    aMandatePDFExportService = TestBed.inject(MandatePDFExportService);
  });


  it('Square must be correctly formatted', () => {
    const aSquare = aMandatePDFExportService.generateSquare('b');

    // console.log(JSON.stringify(aSquare));
    const expectedResult = {canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'b'}]};
    expect(JSON.stringify(aSquare)).toBe(JSON.stringify(expectedResult));
  });


  it('Signature section must be correctly formatted', () => {
    const aSignatureSection = aMandatePDFExportService.generateSignatureSection(true, 'Bon pour acceptation du mandat');

    // console.log(JSON.stringify(aSignatureSection));
    const expectedResult = {style:'table',width:'100%',alignment:'center',table:{body:[[{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du (des) Mandant(s) \nPrécédée de la mention "Bon pour acceptation du mandat"',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du(des) signataire(s): \n \n \n \n \n \n \n']],widths:'100%'}},{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du Mandataire \nPrécédée de la mention "Bon pour acceptation du mandat"',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du signataire: \n \n \n \n \n \n \n']],widths:'100%'}}]],widths:['*','*']},layout:'noBorders'};
    expect(JSON.stringify(aSignatureSection)).toBe(JSON.stringify(expectedResult));
  });


  it('Definition must be correctly formatted', () => {
    const aDefinition = aMandatePDFExportService.generateDefinition('toDefine', 'definition');

    // console.log(JSON.stringify(aDefinition));
    const expectedResult = {text:[{text:'toDefine',style:'h4bold',decoration:'underline'},{text:' definition',style:'h4'}]};
    expect(JSON.stringify(aDefinition)).toBe(JSON.stringify(expectedResult));
  });


  it('Household Bank info must be retrieved', () => {
    const aCaseHousehold: Case = { actor: {
        type: 'HOUSEHOLD',
        bank_info: {current_bank: 'BPMED', current_agency: 'Agence du centre'},
        persons: [
          {
            is_borrower: true,
            civil: {
              courtesy: 'MRS',
              first_name: 'Céline',
              last_name: 'Pignon',
              email: 'celine.pignon@email.com',
              phone_number: '06.05.04.03.01',
              contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP1', current_agency: 'Agence du port1'}
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
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP2', current_agency: 'Agence du port2'}
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
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP3', current_agency: 'Agence du port3'}
            }
          }
        ]
      }
    };

    aMandatePDFExportService.aCase = aCaseHousehold;
    const aBankInfo = aMandatePDFExportService.retrieveBankInfo();

    console.log(JSON.stringify(aBankInfo));
    const expectedResult = [{text:'BPMED Agence du centre'}, {text:'BNP1 Agence du port1'}, {text:'BNP2 Agence du port2'}];
    expect(JSON.stringify(aBankInfo)).toBe(JSON.stringify(expectedResult));
  });


it('Legal person Bank info must be retrieved', () => {
      const aCaseLegalPerson: Case = { actor: {
          type: 'LEGAL_PERSON',
          name: 'Toaztr',
          structure_type: 'COMPANY',
          legal_status: 'SAS',
          email: 'celine@toaztr.com',
          phone_number: '06.05.04.03.00',
          contact_address: {address: '0, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
          bank_info: {current_bank: 'BPMED', current_agency: 'Agence du centre'},
          persons: [
            {
              civil: {
                courtesy: 'MRS',
                first_name: 'Céline',
                last_name: 'Pignon',
                email: 'celine.pignon@toaztr.com',
                phone_number: '06.05.04.03.01',
                contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
                bank_info: {current_bank: 'BNP1', current_agency: 'Agence du port1'}
              }
            },
            {
              civil: {
                courtesy: 'MR',
                first_name: 'Jean',
                last_name: 'Pignon',
                email: 'jean.pignon@toaztr.com',
                phone_number: '06.05.04.03.02',
                contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
                bank_info: {current_bank: 'BNP2', current_agency: 'Agence du port2'}
              }
            }
          ]
        }
      };

    aMandatePDFExportService.aCase = aCaseLegalPerson;
    const aBankInfo = aMandatePDFExportService.retrieveBankInfo();

    // console.log(JSON.stringify(aBankInfo));
    const expectedResult = [{text:'BPMED Agence du centre'}, {text:'BNP1 Agence du port1'}, {text:'BNP2 Agence du port2'}];
    expect(JSON.stringify(aBankInfo)).toBe(JSON.stringify(expectedResult));
  });




  it('Household header info must be retrieved', () => {

    const aPartners: ActivePartner[] = [{type: 'NOTARY', name: 'Michel, Martin et associés', phone_number: '04.93.33.22.12', email: 'contact@michelmartinassociates.fr',
      address: {address: '2, rue des fleurs', postal_code: '06300', city: 'Nice'},
      contact: {courtesy:'MRS', first_name: 'Jean', last_name: 'Martin', phone_number: '04.93.33.22.11', email: 'martin@michelmartinassociates.fr'},
      comment: 'La clerc, Mme Dupond, est trés disponible.'},
      {type: 'BROKER', name: 'Hypo', phone_number: '09.78.350.700', email: 'contact@lowtaux.com',
      address: {address: '36-38, Route de Rennes', postal_code: '44300', city: 'Nantes'}, agreement_number: '09051593',
      contact: {first_name: 'Fabrice', last_name: 'Hamon', phone_number: '06.12.19.35.70', email: 'fabrice.hamon@lowtaux.fr'},
      main_contact: {first_name: 'Fabrice', last_name: 'Hamon', phone_number: '06.12.19.35.70', email: 'fabrice.hamon@lowtaux.fr'}},
      {type: 'ESTATE_AGENT', name: 'In Pierre We Trust', phone_number: '05.56.56.56.89', email: 'contact@alabellepierre.com',
      address: {address: '12, Avenue des Pierres qui roulent n\'amassent pas mousse', postal_code: '44300', city: 'Nantes'},
      contact: {first_name: 'Jean-Pierre', last_name: 'Pierre', phone_number: '06.78.78.78.78', email: 'jpp@alabellepierre.fr'} }];

    const aCaseHousehold: Case = { actor: {
        type: 'HOUSEHOLD',
        bank_info: {current_bank: 'BPMED', current_agency: 'Agence du centre'},
        persons: [
          {
            is_borrower: true,
            civil: {
              courtesy: 'MRS',
              first_name: 'Céline',
              last_name: 'Pignon',
              email: 'celine.pignon@email.com',
              phone_number: '06.05.04.03.01',
              contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP1', current_agency: 'Agence du port1'}
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
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP2', current_agency: 'Agence du port2'}
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
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP3', current_agency: 'Agence du port3'}
            }
          }
        ]
      }
    };

    aMandatePDFExportService.aCase = aCaseHousehold;
    aMandatePDFExportService.aPartners = aPartners;
    const aHeader = aMandatePDFExportService.encodeMandateHeader('Mandat d\'intermédiation en opérations de banque et services de paiement', IconsSvg.voidSvg);

    // console.log(JSON.stringify(aHeader));
    const expectedResult = [{columns:[{svg:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"></svg>',width:75,alignment:'center'},{style:'title',text:'Mandat d\'intermédiation en opérations de banque et services de paiement'}]},{style:'bigLineBreak',text:''},{text:'Hypo, 36-38, Route de Rennes, 44300, Nantes'},{style:'smallLineBreak',text:''},{text:[{text:'Conseiller: ',style:'bold'},{text:'Fabrice Hamon'}]},{text:[{text:'Téléphone: ',style:'bold'},{text:'06.12.19.35.70'}]},{text:[{text:'eMail: ',style:'bold'},{text:'fabrice.hamon@lowtaux.fr'}]},{style:'bigLineBreak',text:''},{text:[{text:'Référence du dossier: ',style:'bold'},{text:''}]},{style:'bigLineBreak',text:''},{canvas:[{type:'line',x1:0,y1:5,x2:515,y2:5,lineWidth:3}]},{style:'bigLineBreak',text:''},{text:'Le(s) sousigné(s):'},{style:'bigLineBreak',text:''},{text:'Mme. Céline Pignon,'},{text:'demeurant au: 1, Rue des Fleurs, 06100, Nice'},{style:'smallLineBreak',text:''},{text:'M. Jean Pignon,'},{text:'demeurant au: 2, Rue des Fleurs, 06100, Nice'},{style:'smallLineBreak',text:''},{style:'bigLineBreak',text:''},{text:'Ci-après indifféremment dénommés conjointement le Client ou Mandant,',style:'bold'},{style:'bigLineBreak',text:''},{text:'Donne(nt) mandat à:',style:'bold'},{text:'Hypo, courtier en opérations de banque et services de paiement, courtier en assurances, dont le siège social est situé au 36-38, Route de Rennes, 44300, Nantes, inscrit à l\'ORIAS sous le numéro 09051593, représenté par Fabrice Hamon,'},{style:'bigLineBreak',text:''},{text:'Ci-après dénommé le Mandataire.',style:'bold'},{style:'bigLineBreak',text:''},{text:'Le fichier des intermédiaires en opérations de banque et en services de paiement est consultable sur le site de l\'Orias, www.orias.fr.'},{style:'bigLineBreak',text:''},{canvas:[{type:'line',x1:0,y1:5,x2:515,y2:5,lineWidth:3}]}];
    expect(JSON.stringify(aHeader)).toBe(JSON.stringify(expectedResult));
  });


  it('Legal person header info must be retrieved', () => {

      const aPartners: ActivePartner[] = [{type: 'NOTARY', name: 'Michel, Martin et associés', phone_number: '04.93.33.22.12', email: 'contact@michelmartinassociates.fr',
      address: {address: '2, rue des fleurs', postal_code: '06300', city: 'Nice'},
      contact: {courtesy:'MRS', first_name: 'Jean', last_name: 'Martin', phone_number: '04.93.33.22.11', email: 'martin@michelmartinassociates.fr'},
      comment: 'La clerc, Mme Dupond, est trés disponible.'},
      {type: 'BROKER', name: 'Hypo', phone_number: '09.78.350.700', email: 'contact@lowtaux.com',
      address: {address: '36-38, Route de Rennes', postal_code: '44300', city: 'Nantes'}, agreement_number: '09051593',
      contact: {first_name: 'Fabrice', last_name: 'Hamon',  phone_number: '06.12.19.35.70', email: 'fabrice.hamon@lowtaux.fr'},
      main_contact: {first_name: 'Fabrice', last_name: 'Hamon', phone_number: '06.12.19.35.70', email: 'fabrice.hamon@lowtaux.fr'}},
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
          bank_info: {current_bank: 'BPMED', current_agency: 'Agence du centre'},
          persons: [
            {
              civil: {
                courtesy: 'MRS',
                first_name: 'Céline',
                last_name: 'Pignon',
                email: 'celine.pignon@toaztr.com',
                phone_number: '06.05.04.03.01',
                contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
                bank_info: {current_bank: 'BNP1', current_agency: 'Agence du port1'}
              }
            },
            {
              civil: {
                courtesy: 'MR',
                first_name: 'Jean',
                last_name: 'Pignon',
                email: 'jean.pignon@toaztr.com',
                phone_number: '06.05.04.03.02',
                contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
                bank_info: {current_bank: 'BNP2', current_agency: 'Agence du port2'}
              }
            }
          ]
        }
      };

    aMandatePDFExportService.aCase = aCaseLegalPerson;
    aMandatePDFExportService.aPartners = aPartners;
    const aHeader = aMandatePDFExportService.encodeMandateHeader('Mandat d\'intermédiation en opérations de banque et services de paiement', IconsSvg.voidSvg);

    // console.log(JSON.stringify(aHeader));
    const expectedResult = [{columns:[{svg:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"></svg>',width:75,alignment:'center'},{style:'title',text:'Mandat d\'intermédiation en opérations de banque et services de paiement'}]},{style:'bigLineBreak',text:''},{text:'Hypo, 36-38, Route de Rennes, 44300, Nantes'},{style:'smallLineBreak',text:''},{text:[{text:'Conseiller: ',style:'bold'},{text:'Fabrice Hamon'}]},{text:[{text:'Téléphone: ',style:'bold'},{text:'06.12.19.35.70'}]},{text:[{text:'eMail: ',style:'bold'},{text:'fabrice.hamon@lowtaux.fr'}]},{style:'bigLineBreak',text:''},{text:[{text:'Référence du dossier: ',style:'bold'},{text:''}]},{style:'bigLineBreak',text:''},{canvas:[{type:'line',x1:0,y1:5,x2:515,y2:5,lineWidth:3}]},{style:'bigLineBreak',text:''},{text:'Le(s) sousigné(s):'},{style:'bigLineBreak',text:''},{text:'Entreprise Toaztr'},{text:'SAS'},{text:'0, Rue des Fleurs'},{text:'06100, Nice.'},{text:'06.05.04.03.00'},{text:'celine@toaztr.com'},{style:'smallLineBreak',text:''},{text:'représenté(e) par:'},{style:'smallLineBreak',text:''},{text:'Mme. Céline Pignon,'},{text:'demeurant au: 1, Rue des Fleurs, 06100, Nice'},{style:'smallLineBreak',text:''},{text:'M. Jean Pignon,'},{text:'demeurant au: 2, Rue des Fleurs, 06100, Nice'},{style:'smallLineBreak',text:''},{style:'bigLineBreak',text:''},{text:'Ci-après indifféremment dénommés conjointement le Client ou Mandant,',style:'bold'},{style:'bigLineBreak',text:''},{text:'Donne(nt) mandat à:',style:'bold'},{text:'Hypo, courtier en opérations de banque et services de paiement, courtier en assurances, dont le siège social est situé au 36-38, Route de Rennes, 44300, Nantes, inscrit à l\'ORIAS sous le numéro 09051593, représenté par Fabrice Hamon,'},{style:'bigLineBreak',text:''},{text:'Ci-après dénommé le Mandataire.',style:'bold'},{style:'bigLineBreak',text:''},{text:'Le fichier des intermédiaires en opérations de banque et en services de paiement est consultable sur le site de l\'Orias, www.orias.fr.'},{style:'bigLineBreak',text:''},{canvas:[{type:'line',x1:0,y1:5,x2:515,y2:5,lineWidth:3}]}];
    expect(JSON.stringify(aHeader)).toBe(JSON.stringify(expectedResult));
  });


  it('Preliminary must be retrieved', () => {
    const aArticle = aMandatePDFExportService.encodePreliminary();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Préambule'},{style:'smallLineBreak',text:''},{text:'En qualité d\'Intermédiaire en Opérations de Banque et Services de Paiement, le Mandataire :',style:'bold'},{ul:[{text:'Est régi par les articles L519-1 à L519-6 du Code monétaire et financier et les décrets et arrêtés subséquents qui sont liés,'},{text:'Respecte les dispositions du Code Monétaire et Financier, issues du décret n°2012-101, relatif au statut des IOBSP, notamment quant à l\'ensemble des informations à fournir au Mandant ; fait l\'objet d\'une supervision de l\'Autorité de Contrôle Prudentiel et de Résolution (ACPR) dont l\'adresse est la suivante : 4 place de Budapest CS 92459 75436 PARIS CEDEX 09 - site : www.acpr.banque-france.fr, tel : 01.49.95.40.00,'},{text:'Certifie n\'être soumis à aucune obligation contractuelle de travailler avec un ou plusieurs établissements de crédits, et déclare ne pas être détenu et ne pas détenir de droit de vote ou du capital d\'un établissement de crédits,'},{text:'Déclare qu\'aucun établissement de crédit ou de paiement ne détient plus de 10% de son capital ou de droits de vote,'},{text:'Déclare qu\'il ne détient pas plus de 10% du capital ou des droits de vote d\'un établissement de crédit ou de paiement,'},{text:'Déclare ne pas avoir enregistré, avec un établissement de crédits, au cours de l\'année précédente, une part supérieure au tiers de son chiffre d\'affaires au titre de l\'activité d\'intermédiation,'},{text:'Met à disposition la liste des établissements de crédits ou de paiement avec lesquels il travaille, ainsi que les conditions de sa rémunération.'}]}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 1 must be generated', () => {
    const aAdministrativeInformation: AdministrativeInformation = { nature: 'LAND',
                                                                    state : 'NEW',
                                                                    destination: 'MAIN_PROPERTY',
                                                                    address: {address: '9, rue des roses', postal_code: '06200', city: 'Nice', country: 'France', insee_code: '06088'},
                                                                    project_dates: {sales_agreement_date: '2019-06-24T14:15:22Z', conditions_precedent_end_date: '2019-06-25T14:15:22Z',  signature_date: '2019-06-26T14:15:22Z'},
                                                                    land_register_reference: 'BT1458',
                                                                    description: 'Un beau bien'};

    const aCaseHousehold: Case = { actor: {
        type: 'HOUSEHOLD',
        bank_info: {current_bank: 'BPMED', current_agency: 'Agence du centre'},
        persons: [
          {
            is_borrower: true,
            civil: {
              courtesy: 'MRS',
              first_name: 'Céline',
              last_name: 'Pignon',
              email: 'celine.pignon@email.com',
              phone_number: '06.05.04.03.01',
              contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP1', current_agency: 'Agence du port1'}
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
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP2', current_agency: 'Agence du port2'}
            }
          },
          {
            is_borrower: false,
            civil: {
              courtesy: 'MR',
              first_name: 'Jean',
              last_name: 'Pignon2',
              email: 'jean.pignon@email.com',
              phone_number: '06.05.04.03.02',
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP3', current_agency: 'Agence du port3'}
            }
          }
        ]
      },
      project: {type: 'LAND', administrative_information: aAdministrativeInformation,  expenses: {price: 200000, fees: {agency_fees: 10000}}},
    };

    aMandatePDFExportService.aCase = aCaseHousehold;

    const aArticle = aMandatePDFExportService.encodeArticle1();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 1: Objet du mandat'},{style:'smallLineBreak',text:''},{text:'Le Mandant confère au Mandataire pouvoir de rechercher, au nom et pour le compte du Mandant, un financement bancaire dont les caractéristiques sont les suivantes: '},{style:'smallLineBreak',text:''},{ul:[{text:'Opération à financer: achat de terrain seul'},{text:'Adresse du bien: 9, rue des roses, 06200, Nice, France'},{text:'Coût d\'acquisition (frais éventuels d\'agence et de notaire inclus): NaN €'},{text:'Montant total du (des) crédit(s) demandé(s): NaN €'}]},{style:'smallLineBreak',text:''},{text:'Le montant et les caractéristiques exactes du (des) crédit(s) proposés pourront varier selon l\'établissement bancaire sollicité ou en cas de besoin.'},{style:'smallLineBreak',text:''},{text:'La demande de prêt est conforme aux volontés du Client. Elle est formulée sous sa seule responsabilité.'},{text:'Aux vues des négociations, le Mandataire pourra proposer de modifier les caractéristiques du prêt envisagé afin de répondre au mieux au besoin de financement, et ce en diminuant ou augmentant le montant et/ou la durée du prêt sans qu\'il soit nécessaire, d\'établir une nouvelle convention de recherche en capitaux.'},{style:'smallLineBreak',text:''},{text:'Le Mandant mandate le Mandataire pour solliciter toutes les banques, y compris la ou les propre(s) banque(s) du Mandant, à savoir:'},{style:'smallLineBreak',text:''},{ul:[{text:'BPMED Agence du centre'},{text:'BNP1 Agence du port1'},{text:'BNP2 Agence du port2'}]},{style:'smallLineBreak',text:''},{text:'Origine du dossier: ',style:'h3bold'},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Direct',alignment:'left',width:'25%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Publicité',alignment:'left',width:'25%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Internet',alignment:'left',width:'25%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Parrainage',alignment:'left',width:'18%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'white'}],alignment:'right',width:'5%'},{text:'Nom:',alignment:'left',width:'18%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'white'}],alignment:'right',width:'5%'},{text:'Prénom:',alignment:'left',width:'18%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Apporteur',alignment:'left',width:'18%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'white'}],alignment:'right',width:'5%'},{text:'Nom:',alignment:'left',width:'18%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'white'}],alignment:'right',width:'5%'},{text:'Prénom:',alignment:'left',width:'18%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'white'}],alignment:'right',width:'5%'},{text:'Société:',alignment:'left',width:'18%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Autre',alignment:'left',width:'18%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'white'}],alignment:'right',width:'5%'},{text:'Source:',alignment:'left',width:'18%',margin:[5,0,0,0]}]}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 2 must be generated', () => {
    const aArticle = aMandatePDFExportService.encodeArticle2();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 2: Obligation du Mandant'},{style:'smallLineBreak',text:''},{text:'Le Mandant déclare que rien, dans sa situation juridique et dans sa capacité bancaire, ne s\'oppose à sa demande de financement.'},{style:'smallLineBreak',text:''},{text:'Afin de permettre au Mandataire de mener à bien la mission confiée aux termes du présent mandat, le Mandant s\'engage à :'},{style:'smallLineBreak',text:''},{ul:[{text:'Fournir au Mandataire toutes les pièces et tous les renseignements nécessaires à l\'instruction de son dossier, portant notamment sur ses ressources, ses charges, ses crédits en cours et son patrimoine existant au jour de la demande de financement, et ce aux fins de réalisation de l\'étude de solvabilité,'},{text:'Communiquer au Mandataire pendant toute la durée du mandat, toutes informations complémentaires et l\'informer de toute modification susceptible d\'affecter sa situation financière,'},{text:'garantir l\'exactitude, la conformité et l\'authenticité des documents et renseignements confiés,'},{text:'Autoriser l\'établissement de crédit - partenaire du Mandataire - à communiquer toutes les informations le concernant et couvertes par le secret professionnel bancaire au Mandataire, dans le cadre de l\'exécution du présent mandat et de la convention entre l\'établissement et le Mandataire, et que l\'ensemble des informations constituant son dossier puisse être transmis d\'un service à un autre au sein de l\'établissement de crédit,'},{text:'Autoriser le Mandataire à informer le vendeur, l\'agence immobilière et le notaire, du dépôt de demande(s) de prêt(s) et de l\'obtention du ou des accord(s) de financement,'},{text:'Informer le Mandataire s\'il est inscrit dans le Fichier National des Incidents de Remboursement des Crédits aux Particuliers (FICP).'}]}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 3 must be generated', () => {
    const aArticle = aMandatePDFExportService.encodeArticle3();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 3: Obligation du Mandataire'},{style:'smallLineBreak',text:''},{text:'Dans le cadre de son obligation de moyens, le Mandataire s\'engage à :'},{style:'smallLineBreak',text:''},{ul:[{text:'Etudier avec sincérité et loyauté la demande du Mandant et agir au mieux de ses intérêts,'},{text:'Sélectionner l\'établissement de crédit le plus approprié en fonction des intérêts et des attentes exprimés par le Mandant,'},{text:'Déposer le dossier de demande de prêt, auprès d\'au moins un établissement de crédit, dans un délai de 7 jours suivant sa complète constitution.'}]},{style:'smallLineBreak',text:''},{text:'La liste des établissements partenaires du Mandataire est disponible sur demande.'}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 4 must be generated', () => {
    const aArticle = aMandatePDFExportService.encodeArticle4();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 4: Rémunération du mandataire'},{style:'smallLineBreak',text:''},{text:'En rémunération de la mission confiée, le Mandant s\'engage à verser au Mandataire, la somme de ____________ euros sous forme de frais de dossier.'},{style:'smallLineBreak',text:''},{text:'Cette somme est exigible le jour où l\'opération objet du présent mandat sera effectivement réalisée. Toutefois, conformément aux dispositions de l\'article L.519-6 du Code monétaire et financier, le Mandataire ne pourra la percevoir avant le déblocage effectif des fonds par l\'organisme préteur.'},{style:'smallLineBreak',text:''},{text:'Loi MURCEF : Article L 321-2 de la loi n°2001-1168 du 11 Décembre 2001 : « Aucun versement, de quelque nature que ce soit, ne peut être exigé d\'un particulier, avant l\'obtention d\'un ou plusieurs prêts d\'argent ».'}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 5 must be generated', () => {
    const aArticle = aMandatePDFExportService.encodeArticle5();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 5: Durée du mandat'},{style:'smallLineBreak',text:''},{text:'Le présent mandat prend effet à compter du jour de sa signature pour une durée indéterminée. Il prend fin dès l\'acceptation par le Mandant d\'une offre de prêt émise par l\'un des établissements bancaires ou financiers sollicités par le Mandataire. Il peut être dénoncé par l\'une ou l\'autre des parties avec un préavis de quinze jours donné par lettre recommandée avec accusé de réception.'}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 6 must be generated', () => {
    const aArticle = aMandatePDFExportService.encodeArticle6();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 6: Informations au Mandant'},{style:'smallLineBreak',text:''},{text:'Le Mandataire informe le Mandant qu\'aucune demande de crédit ne pourra être transmise si toutes les pièces nécessaires à la constitution du dossier ne lui sont pas remises. A ce titre, le Mandant certifie avoir reçu du Mandataire la liste des pièces nécessaires à la constitution de la demande de financement.'},{style:'smallLineBreak',text:''},{text:'L\'activité d\'intermédiaire en crédit n\'est constitutive que d\'une obligation de moyen. Seuls les établissements bancaires sollicités peuvent décider de l\'octroi du ou des crédit(s) sollicité(s) et des conditions afférentes, qui peuvent varier selon leur seule volonté. Le mandataire ne garantit pas les délais d\'étude et de réponse des établissements bancaires. Le Mandataire n\'est pas tenu par les délais imposés au mandant dans le cadre d\'une promesse d\'achat.'},{style:'smallLineBreak',text:''},{text:'Le Mandataire ne saurait être déclaré responsable de la différence entre le montant inscrit dans le compromis de vente et les conditions du présent mandat.'},{style:'smallLineBreak',text:''},{text:'L\'obtention du crédit suppose de contracter une assurance liée au crédit.'},{style:'smallLineBreak',text:''},{text:'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Les impayés afférents au(x) crédit(s) sollicité(s) peuvent avoir de graves conséquences sur votre patrimoine et vous pourriez être redevable(s), à l\'égard de la banque, du capital restant dû, majoré d\'intérêts de retard, ainsi que d\'une indemnité.'},{style:'smallLineBreak',text:''},{text:'En application des articles L 333-4 et L 333-5 du code de la consommation, les incidents de paiement caractérisés font l\'objet d\'une inscription au fichier des incidents de remboursement des crédits aux particuliers (FICP) géré par la Banque de France.'},{style:'smallLineBreak',text:''},{text:'En matière de crédit immobilier, l\'emprunteur dispose d\'un délai de réflexion de 10 jours après réception de l\'offre de prêt émise par l\'établissement bancaire pour donner son accord.'},{style:'smallLineBreak',text:''},{text:'En matière de crédit à la consommation, l\'emprunteur dispose d\'un délai de 14 jours calendaires pour revenir sur son engagement vis-à-vis du contrat de crédit. La mise à disposition des fonds peut être demandée à partir du 8ème jour sans que cela ne réduise le délai de rétractation.'}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 7 must be generated', () => {
    const aArticle = aMandatePDFExportService.encodeArticle7();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 7: Traitement des données à caractère personnel - Informations et libertés'},{style:'smallLineBreak',text:''},{text:'Les données personnelles concernant le Mandant, recueillies pour les besoins dont la finalité est liée à l\'exécution du Mandat, font l\'objet d\'un traitement informatique destiné à remplir les obligations issues du présent Mandat. Le destinataire direct de ces données est le Mandataire, notamment tenu de répondre sincèrement aux demandes des établissements de crédit contactés.'},{style:'smallLineBreak',text:''},{text:'Ces données font l\'objet de communication extérieure par le seul Mandataire, pour les seules nécessités d\'exécution du présent contrat ou d\'exigences légales et réglementaires (art. L. 561-1 et suivants du Code monétaire et financier, en particulier), dans le respect du Règlement (UE) 2016/679 du Parlement Européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l\'égard du traitement des données à caractère personnel et à la libre circulation de ces données (Règlement Général sur la Protection des Données ou « RGPD »).'},{style:'smallLineBreak',text:''},{text:'Le Mandant, justifiant de son identité, bénéficie d\'un droit permanent d\'accès, de rectification, d\'effacement (droit à l\'oubli), d\'opposition, de limitation du traitement, à la portabilité de ses données personnelles (art. 39, Loi n°78-17 du 6 janvier 1978, modifiée). Le Mandant souhaitant exercer ce droit et obtenir communication des informations le concernant, s\'adresse au Mandataire, soit par simple courrier à l\'adresse postale figurant au début de ce document, soit par email, à l\'adresse email figurant au début de ce document.'},{style:'smallLineBreak',text:''},{text:'Conformément aux dispositions régissant la conservation des données à caractère personnel et en regard de la nature des opérations de banque, ces données personnelles sont conservées dix (10) années à compter de la date de signature du contrat (articles L. 213-1, R. 213-2 du Code de la consommation).'},{style:'smallLineBreak',text:''},{text:'Vous pouvez également définir des directives relatives à la conservation, à l\'effacement et à la communication de vos données à caractère personnel après votre décès.'},{style:'smallLineBreak',text:''},{text:'Le Mandant peut, pour des motifs légitimes, s\'opposer au traitement des données le concernant.'},{style:'smallLineBreak',text:''},{text:'Sous réserve d\'un manquement aux dispositions ci-dessus, le mandant a le droit d\'introduire une réclamation auprès de la CNIL.'},{style:'smallLineBreak',text:''},{text:'En exprimant son accord au Mandat, le Mandant autorise le Mandataire, à collecter, à utiliser et à conserver les données personnelles transmises par lui, à communiquer à tout établissement de crédit toutes les informations et données personnelles le concernant, même celles couvertes par le secret professionnel bancaire, conformément aux prévisions de l\'article L. 511-33 du Code monétaire et financier et dans le cadre de l\'exécution du présent Mandat.'}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 8 must be generated', () => {
    const aArticle = aMandatePDFExportService.encodeArticle8();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 8: Réclamations, contentieux et attribution de compétence'},{style:'smallLineBreak',text:''},{text:'Pour toute réclamation, le Mandant peut s\'adresser par courrier à l\'adresse postale figurant au début de ce document, soit par email, à l\'adresse email figurant au début de ce document.'},{style:'smallLineBreak',text:''},{text:'Sauf difficulté particulière liée à la réclamation, le Mandataire s\'engage à répondre au Mandant :'},{style:'smallLineBreak',text:''},{ul:[{text:'Dans les dix jours ouvrables à compter de la réception de la réclamation, pour en accuser réception, sauf si la réponse elle même est apportée au client dans ce délai,'},{text:'Dans les deux mois entre la date de réception de la réclamation et la date d\'envoi de la réponse au client.'}]},{style:'smallLineBreak',text:''},{text:'Sans réponse satisfaisante, le Mandant pourra avoir recours au Médiateur du crédit via le site internet suivant : www.anm-conso.com/, par voie postale : ANM Conso – 62, rue Tiquetonne – 75002 PARIS, par téléphone au 01.42.33.81.03, par mail contact@ANM-MEDIATION.COM. La médiation est une procédure gratuite pour le Mandant.'},{style:'smallLineBreak',text:''},{text:'Le présent mandat est soumis au droit français.'},{style:'smallLineBreak',text:''},{text:'En cas de litige à l\'occasion de l\'interprétation ou de l\'exécution du présent mandat, les parties s\'efforceront de le régler à l\'amiable préalablement à toute action en justice.'}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 9 must be generated', () => {

    const aCaseHousehold: Case = { actor: {
        type: 'HOUSEHOLD',
        bank_info: {current_bank: 'BPMED', current_agency: 'Agence du centre'},
        persons: [
          {
            is_borrower: true,
            civil: {
              courtesy: 'MRS',
              first_name: 'Céline',
              last_name: 'Pignon',
              email: 'celine.pignon@email.com',
              phone_number: '06.05.04.03.01',
              contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP1', current_agency: 'Agence du port1'}
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
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP2', current_agency: 'Agence du port2'}
            }
          },
          {
            is_borrower: false,
            civil: {
              courtesy: 'MR',
              first_name: 'Jean',
              last_name: 'Pignon2',
              email: 'jean.pignon@email.com',
              phone_number: '06.05.04.03.02',
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP3', current_agency: 'Agence du port3'}
            }
          }
        ]
      }
    };

    aMandatePDFExportService.aCase = aCaseHousehold;

    const aArticle = aMandatePDFExportService.encodeArticle9();
    // console.log(JSON.stringify(aArticle));
    const expectedResult = [{style:'bigLineBreak',text:'',pageOrientation:'landscape',pageBreak:'before'},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 9: Evaluation de vos connaissances en matière de crédit'},{style:'smallLineBreak',text:''},{text:'Entourez la réponse que vous choisissez pour chacune des questions.'},{style:'smallLineBreak',text:''},{style:'tablecenter',table:{body:[['','Avez-vous déjà souscrit un crédit immobilier dans votre vie ?','Avez-vous déjà souscrit un autre crédit dans votre vie ?','Connaissez-vous la signification de T.A.E.G ?','Connaissez-vous la différence entre un crédit à taux fixe et à taux révisable ?','Savez-vous à quoi sert l\'assurance emprunteur ?','Selon vous, votre connaissance en matière de crédit est plutôt :'],['Mme. Céline Pignon','Oui   Non','Oui   Non','Oui   Non','Oui   Non','Oui   Non','Faible   Moyenne   Haute'],['M. Jean Pignon','Oui   Non','Oui   Non','Oui   Non','Oui   Non','Oui   Non','Faible   Moyenne   Haute']]}}];
    expect(JSON.stringify(aArticle)).toBe(JSON.stringify(expectedResult));
  });


  it('Article 10 must be generated', () => {
    const generationDate = new Date('2020-12-16T23:28:06');
    const aArticle = aMandatePDFExportService.encodeArticle10(generationDate);
    // console.log(JSON.stringify(aArticle));
    const expectedResult = JSON.stringify([{style:'bigLineBreak',text:'',pageOrientation:'portrait',pageBreak:'before'},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3centerbold',text:'Article 10: Liste des annexes'},{style:'smallLineBreak',text:''},{text:'Annexe 1: Informations générales sur les contrats de crédit'},{text:'Annexe 2: Liste des pièces à fournir par le Mandant'},{text:'Annexe 3: Léxique du crédit'},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{text:'Fait en deux exemplaires à __________________________________________________________________, le 16 décembre 2020 à 23:28:06.'},{style:'bigLineBreak',text:''},{style:'table',width:'100%',alignment:'center',table:{body:[[{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du (des) Mandant(s) \nPrécédée de la mention "Bon pour acceptation du mandat"',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du(des) signataire(s): \n \n \n \n \n \n \n']],widths:'100%'}},{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du Mandataire \nPrécédée de la mention "Bon pour acceptation du mandat"',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du signataire: \n \n \n \n \n \n \n']],widths:'100%'}}]],widths:['*','*']},layout:'noBorders'}]);
    // console.log(expectedResult);
    expect(JSON.stringify(aArticle)).toBe(expectedResult);
  });


  it('Annexe 1 must be generated', () => {
    const aAnnex = aMandatePDFExportService.encodeCreditInformation('1');
    // console.log(JSON.stringify(aAnnex));
    const expectedResult = [{style:'smallLineBreak',text:'',pageBreak:'after'},{style:'h2',text:'Annexe 1: Informations générale sur les contrats de crédit'},{style:'smallLineBreak',text:''},{text:'L\'Intermédiaire doit assurer la disponibilité permanente des informations générales, claires et compréhensibles, sur les contrats de crédit. Ces dernières sont délivrées sur papier, sur tout autre support durable ou sous forme électronique. Elles sont facilement accessibles et sont fournies gratuitement à l\'emprunteur.',style:'bolditalics'},{style:'bigLineBreak',text:''},{text:'Les informations sur l\'intermédiaire de crédit sont fournies par la société , courtier en opérations de banque et assurance dont le numéro ORIAS est , située à l\'adresse suivante: .'},{style:'bigLineBreak',text:''},{text:'Ces informations sont générales et ne s\'appliquent pas forcément à votre cas particulier. Il s\'agit simplement de vous informer sur ce qui existe en matière de crédit.',style:'bold',decoration:'underline'},{style:'bigLineBreak',text:''},{text:'1. Voici les différents types de crédits existants:'},{style:'tablecenter',table:{body:[['Prêt libre','Résidence principale ou secondaire ou investissement locatif'],['Prêt 0 % Ministère du Logement (PTZ+)','Résidence principale \n Neuf ou logements HLM achetés par leur locataire'],['Prêt à l\'accession sociale (PAS)','Résidence principale \n Neuf ou ancien'],['Prêt Action Logement (Ex. 1% logement)','Résidence principale (location provisoire possible dans certaines conditions) \n Neuf ou ancien'],['Prêt conventionné','Résidence principale ou investissement locatif (si logement neuf devenant résidence principale du locataire) \n Neuf ou ancien'],['Prêt 0 % des collectivités locales','Résidence principale'],['Prêt fonctionnaire','Résidence principale ou investissement locatif \n Neuf ou ancien'],['Plan d\'épargne logement','Résidence principale neuve ou ancienne \n Résidence secondaire neuve']]}},{style:'bigLineBreak',text:''},{text:[{text:'2. Il est possible de souscrire un crédit pour financer '},{text:'une résidence principale ou secondaire, avec ou sans travaux ; un investissement locatif ; un rachat de prêt immobilier ; un crédit relais ; une restructuration de crédits en cours.',style:'bold'}]},{style:'smallLineBreak',text:''},{text:'Un crédit peut être souscrit sur une durée de 5 à 30 ans. Le remboursement s\'effectuera mensuellement.'},{style:'bigLineBreak',text:''},{text:'3. Les taux peuvent être fixe, variable ou révisable:'},{ul:[{text:[{text:'Un taux fixe ',style:'bold'},{text:'est un taux dont le montant reste inchangé pendant toute la durée d\'un prêt.'}]},{text:[{text:'Un taux révisable ou variable ',style:'bold'},{text:'peut évoluer à la hausse comme à la baisse sur la durée du prêt selon les modalités prévues dans l\'offre de prêt. L\'évolution du taux dépend de la variation d\'un indice et elle peut être mensuelle, trimestrielle, annuelle ou pluriannuelle. Le prêt à taux variable peut comprendre une période à taux fixe et des limites de variation.'}]}]},{style:'smallLineBreak',text:''},{text:[{text:'Les prêts en devise ',style:'bold'},{text:'c\'est-à-dire consenti dans une autre monnaie que l\'euro doivent faire l\'objet d\'avertissement particulier par l\'intermédiaire et la banque'}]},{style:'bigLineBreak',text:''},{text:[{text:'4. Il existe plusieurs formes de '},{text:'sûreté réelle ou personnelle possibles pour garantir le contrat de crédit: ',style:'bold'}]},{ul:[{text:[{text:'Caution prêteur ',style:'bold'},{text:'(ex. Crédit Logement, SACCEF) : Société de cautionnement qui s\'engage auprès du prêteur à lui régler sa créance en cas de défaillance de l\'emprunteur et prend en charge la procédure de recouvrement contre l\'emprunteur. L\'emprunteur doit verser une commission au garant avant la signature du contrat de crédit.'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Caution Mutuelle: ',style:'bold'},{text:'Mutuelle d\'assurance ou de prévoyance qui propose un service de cautionnement à leurs bénéficiaires. Elle s\'engage auprès du prêteur à lui régler sa créance en cas de défaillance de l\'emprunteur et prend en charge la procédure de recouvrement contre l\'emprunteur. L\'emprunteur doit verser une commission au garant avant la signature du contrat de crédit.'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Caution personnelle: ',style:'bold'},{text:'La banque demande la signature d\'un acte sous seing privé (acte de caution) par l\'emprunteur et le coemprunteur aux termes duquel ils acceptent que leurs biens personnels soient saisis et vendus en cas de défaillance dans le remboursement du prêt aux échéances convenues (Principal, frais et accessoires).'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Hypothèque: ',style:'bold'},{text:'Il s\'agit d\'une garantie immobilière matérialisée par un acte notarié par lequel l\'emprunteur et le co-emprunteur acceptent qu\'un bien immobilier soit saisi et vendu par la banque en cas de défaillance dans le remboursement du prêt aux échéances convenues (principale, frais, accessoires).'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Privilège de prêteur de deniers (PPD): ',style:'bold'},{text:'Proche de l\'hypothèque, il est pourtant à différencier de celle-ci. Il s\'agit d\'une garantie qui s\'applique sur la partie du financement débloqué au même moment que la signature de l\'acte authentique de vente, lorsque le vendeur a reçu le prix d\'achat. Il fait l\'objet d\'une inscription à la conservation des hypothèques après la vente et prend rang à la date de la vente. Cela signifie que la banque devient prioritaire sur toutes les garanties prises sur le bien immobilier.'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Nantissement: ',style:'bold'},{text:'Contrat par lequel un débiteur remet une chose à son créancier afin de garantir la dette. Il peut s\'agir d\'assurancesvie ou de placements. La banque a alors la possibilité de vendre ces valeurs pour se faire rembourser en cas de défaillance de l\'emprunteur au paiement des échéances convenues du crédit.'}]}]},{style:'bigLineBreak',text:''},{text:'Le CLIENT certifie avoir été informé de la nécessité de fournir des éléments exacts et complets afin qu\'il puisse être procédé à une évaluation appropriée de sa solvabilité. Un crédit ne peut pas être accordé lorsque la banque ne peut procéder à l\'évaluation de solvabilité du fait du refus de l\'emprunteur de communiquer ces informations.',style:'bold'},{style:'bigLineBreak',text:''},{text:[{text:'Le CLIENT est informé que: '},{text:'au plus tard lors de l\'émission de l\'offre de crédit, la banque lui communiquera, par écrit ou sur un autre support durable, sous la forme d\'une fiche d\'information standardisée européenne (FISE), les informations personnalisées lui permettant de comparer les différentes offres de crédit disponibles sur le marché, d\'évaluer leurs implications et de se déterminer en toute connaissance de cause sur l\'opportunité de conclure un contrat de crédit.',style:'bold'}]}];
    expect(JSON.stringify(aAnnex)).toBe(JSON.stringify(expectedResult));
  });


  it('Annexe 2 must be generated', () => {

    const aAnnex = aMandatePDFExportService.encodeOfficialDocumentsList('2');
    // console.log(JSON.stringify(aAnnex));
    const expectedResult = [{style:'smallLineBreak',text:'',pageBreak:'after'},{style:'h2',text:'Annexe 2: listes des pièces à fournir'},{style:'smallLineBreak',text:''},{text:'Justificatifs d\'identité et de domicile:',style:'h3bold'},{ul:['Carte d\'identité, passeport, titre de séjour en cours de validité','Livret de famille et contrat de mariage (éventuellement jugement de divorce + pension alimentaire)','Dernière quittance de loyer ou attestation hébergement à titre gratuit','Justificatif EDF ou téléphone fixe (moins de 3 mois)']},{style:'bigLineBreak',text:''},{text:'Si vous êtes salarié:',style:'h3bold'},{ul:['3 derniers bulletins de salaire et bulletin de salaire de décembre N-1','Contrat de travail ou attestation de l\'employeur','Justificatif de prime ou bonus sur 3 ans']},{style:'bigLineBreak',text:''},{text:'Si vous êtes non salarié:',style:'h3bold'},{ul:['Relevés de comptes bancaires professionnels sur les 3 derniers mois','Bilans et comptes de résultat sur les 3 derniers exercices','Extrait K-bis de moins de 3 mois','Statuts de la société et compte de résultat prévisionnel']},{style:'bigLineBreak',text:''},{text:'Justificatifs de votre situation financière:',style:'h3bold'},{ul:['Avis d\'imposition ou de non imposition N-1 et N-2','Relevés de comptes bancaires personnels (tous comptes) sur les 3 derniers mois','Si vous avez des crédits en cours, tableaux d\'amortissement de l\'offre de prêt initiale','Tous documents pouvant justifier de votre apport (relevés de compte-épargne, etc.)']},{style:'bigLineBreak',text:''},{text:'Justificatifs relatifs au bien à financer:',style:'h3bold'},{ul:['Promesse ou compromis de vente, devis travaux éventuels, titre de propriété','En cas d\'acquisition d\'un bien neuf, contrat de réservation, devis, plan, permis de construire, assurance','En cas d\'acquisition d\'un bien locatif, estimation des revenus locatifs à venir','En cas de constitution d\'une SCI ou d\'achat par une SCI, statuts de la SCI']},{style:'bigLineBreak',text:''},{text:'Si vous êtes propriétaire:',style:'h3bold'},{ul:['Dernier Avis d\'imposition à la Taxe Foncière','Estimation de la valeur du bien par une agence immobilière','En cas de bien locatif, bail de location existant et déclaration 2044 ou 2072 (SCI) relative aux revenus fonciers']},{style:'bigLineBreak',text:''},{text:'Justificatif de non propriété en cas de Prêt à Taux Zéro (PTZ):',style:'h3bold'},{ul:['Si vous êtes locataire, bail + une quittance par semestre des 2 dernières années + dernière quittance','Si vous êtes hébergé à titre gratuit par le locataire des lieux : attestation d\'hébergement + pièce d\'identité du locataire + justificatif personnel de domicile + copie du bail','Si vous êtes hébergé à titre gratuit par le propriétaire des lieux : attestation d\'hébergement + pièce d\'identité du propriétaire + justificatif personnel de domicile + Extrait cadastral en mairie']},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{text:'Cette liste est non exhaustive. Les établissements bancaires peuvent demander des pièces complémentaires. Si vous estimez que certaines pièces non visées dans cette liste, sont nécessaires à la compréhension de votre projet, merci de les communiquer au mandataire.',style:'h3'}];
    expect(JSON.stringify(aAnnex)).toBe(JSON.stringify(expectedResult));
  });


  it('Annexe 3 must be generated', () => {
    const aAnnex = aMandatePDFExportService.encodeCreditLexic('3');
    // console.log(JSON.stringify(aAnnex));
    const expectedResult = [{style:'smallLineBreak',text:'',pageBreak:'after'},{style:'h2',text:'Annexe 3: le lexique du crédit'},{style:'smallLineBreak',text:''},{text:[{text:'Amortissement (du capital):',style:'h4bold',decoration:'underline'},{text:' Pour un emprunt, l\'amortissement est le capital qui est remboursé à chaque échéance. Par extension, on parle de période d\'amortissement (par exemple après une période de différé) quand le capital du crédit commence réellement à être remboursé.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Amortissement constant:',style:'h4bold',decoration:'underline'},{text:' Sur un crédit à amortissement constant, la même somme de capital est remboursée à chaque échéance. Le montant des échéances (capital + intérêts) diminue donc avec le temps. Au contraire, si le montant de l\'échéance est fixe, il s\'agit d\'un crédit à échéances constantes.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Amortissement négatif:',style:'h4bold',decoration:'underline'},{text:' Se dit lorsque les intérêts calculés sont supérieurs au montant de l\'échéance payée. aucun capital n\'est remboursé. Au contraire, la différence entre le montant des intérêts et le montant de l\'échéance s\'ajoute au capital restant dû.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Amortissement in fine:',style:'h4bold',decoration:'underline'},{text:' crédit dont le remboursement du capital est effectué seulement sur la dernière échéance.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Assurance emprunteur (ou assurance crédit):',style:'h4bold',decoration:'underline'},{text:' Cette assurance, dont le prêteur est le bénéficiaire, a pour but de garantir le prêteur en cas de décès ou d\'invalidité de l\'emprunteur. Les garanties « décès » et « invalidité totale » sont pratiquement toujours exigées par les banques pour un crédit immobilier. La garantie « invalidité partielle temporaire » est fortement recommandée si le prêt vise l\'acquisition de la résidence principale. La « garantie chômage », optionnelle, couvre le remboursement total des échéances (pour les meilleurs contrats), ou partiel et progressif eu égard à la dégressivité des ASSEDIC.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Cap de taux:',style:'h4bold',decoration:'underline'},{text:' Plafonnement de la hausse du taux d\'intérêt en cas de crédit à taux variable. Ce plafonnement peut être exprimé en valeur absolue (par exemple 4,50 %), ou en valeur relative (par exemple taux initial + 2 %]. Les conditions de ce plafonnement (indice, niveau, durée et modalités) sont définies par le contrat et peuvent inclure également un taux plancher (« floor » ou taux minimum) limitant la variation du taux à la baisse. La combinaison d\'un taux plancher et un taux plafond donne un tunnel d\'évolution du taux.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Capital:',style:'h4bold',decoration:'underline'},{text:' Montant du crédit consenti par le prêteur. Le capital peut être versé en une ou plusieurs fois.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Capital restant dû:',style:'h4bold',decoration:'underline'},{text:' Montant du capital restant à rembourser par l\'emprunteur à une date donnée. Il sert de base au calcul des intérêts de l\'échéance à venir. Dans un contrat à taux variable, le prêteur est tenu, une fois par an, de porter à la connaissance de l\'emprunteur le montant du capital restant à rembourser.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Charges financières:',style:'h4bold',decoration:'underline'},{text:' Elles comprennent les échéances de remboursement de prêts, les primes d\'assurance obligatoirement liés, les loyers et les pensions versées.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Crédit- relais:',style:'h4bold',decoration:'underline'},{text:' Crédit généralement in fine accordé dans l\'attente d\'une rentrée certaine d\'argent, notamment, lors de la vente d\'un bien immobilier. La banque peut demander ou pas le paiement des intérêts pendant la durée du crédit.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Différé partiel (d\'amortissement):',style:'h4bold',decoration:'underline'},{text:' Période pendant laquelle l\'emprunteur ne rembourse aucun capital. Il ne paie que les intérêts du prêt. Les cotisations d\'assurances sont généralement perçues pendant la période de différé d\'amortissement.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Différé total (d\'amortissement):',style:'h4bold',decoration:'underline'},{text:' Période pendant laquelle l\'emprunteur ne rembourse ni capital ni intérêts. Ces intérêts seront ajoutés au capital restant dû. Seules les cotisations d\'assurances sont généralement perçues pendant la période de différé total.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Durée d\'amortissement:',style:'h4bold',decoration:'underline'},{text:' Durée pendant laquelle le crédit est remboursé en capital. Cette durée peut être différente de la durée du crédit si celui-ci comprend une période de différé.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Echéance:',style:'h4bold',decoration:'underline'},{text:' C\'est le nom de l\'opération financière consistant à rembourser périodiquement le crédit. Elle est caractérisée par sa date et sa périodicité.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Euribor:',style:'h4bold',decoration:'underline'},{text:' Taux des dépôts interbancaires entre les 57 Banques Européennes les plus représentatives.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Garantie du prêt immobilier:',style:'h4bold',decoration:'underline'},{text:' En cas de défaillance de paiement des mensualités du prêt immobilier, cette garantie protège la banque qui se fait rembourser le capital restant dû. Les types de garanties les plus fréquents sont : caution, hypothèque, privilège de prêteur de deniers (PPD) et nantissement.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Intérêts intercalaires:',style:'h4bold',decoration:'underline'},{text:' On parle d\'intérêts intercalaires par opposition aux intérêts d\'une échéance régulière lorsque ces intérêts sont produits, en cas de déblocage progressifs des fonds, durant la période de déblocage sur les fonds déjà débloqués. Des intérêts intercalaires sont également calculés lorsque la durée de la première échéance ne correspond pas exactement à la durée prévue par la périodicité de remboursement.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'I.R.A. (Indemnités de remboursement par anticipation):',style:'h4bold',decoration:'underline'},{text:' Indemnités versées à la banque, lorsque le crédit est remboursé par l\'emprunteur avant la date prévue sur le tableau d\'amortissement, et correspondant à 6 mois d\'intérêts dus avec un plafond de 3% du capital restant dû en matière de crédit immobilier, et 1% en matière de crédit à la consommation.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Principal:',style:'h4bold',decoration:'underline'},{text:' Le principal est la partie du capital qui est remboursée dans une échéance. C\'est un synonyme peu usité de l\'amortissement.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Remboursement anticipé:',style:'h4bold',decoration:'underline'},{text:' Possibilité pour le client de rembourser partiellement ou totalement un crédit avant la fin prévue du contrat. Cette possibilité peut donner lieu à la perception par la banque d\'indemnités de remboursement anticipé (I.R.A).',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Revenus globaux:',style:'h4bold',decoration:'underline'},{text:' Ils regroupent les revenus salariés ou assimilés, les pensions perçues, les allocations ou revenus sociaux, les revenus locatifs et financiers.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Tableau d\'amortissement:',style:'h4bold',decoration:'underline'},{text:' Tableau indiquant le montant dû par l\'emprunteur à chaque échéance du crédit en détaillant la répartition du remboursement entre : le capital, les intérêts, la prime relative aux assurances (lorsque celles-ci sont obligatoires) et le capital restant dû après chaque échéance.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux capé:',style:'h4bold',decoration:'underline'},{text:' Taux bénéficiant d\'un mécanisme de plafonnement d\'évolution (voir cap de taux).',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux actuariel:',style:'h4bold',decoration:'underline'},{text:' C\'est la technique de taux selon un modèle actuariel, utilisée pour transformer le taux annuel en un taux périodique.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux annuel effectif global (TAEG):',style:'h4bold',decoration:'underline'},{text:' Taux annuel actuariel englobant les intérêts et l\'ensemble des frais liés à l\'octroi d\'un crédit : frais de dossier, de garantie, d\'assurance. Il permet de mesurer le coût total du crédit. Il ne doit jamais dépasser le taux d\'usure en vigueur à la date d\'émission de l\'offre de prêt. Le TEG, à la différence du TAEG, est exprimé en taux annuel proportionnel et s\'applique principalement aux prêts professionnels.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux d\'usure:',style:'h4bold',decoration:'underline'},{text:' Il correspond au taux maximum que tous les prêteurs sont autorisés à pratiquer lorsqu\'ils accordent un crédit, ces seuils sont fixés chaque trimestre par la Banque de France.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux d\'endettement:',style:'h4bold',decoration:'underline'},{text:' Taux exprimant le rapport des charges financières sur les revenus globaux.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux proportionnel:',style:'h4bold',decoration:'underline'},{text:' Technique du taux consistant à diviser le taux annuel par le nombre d\'échéances dans l\'année pour obtenir le taux périodique.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux périodique:',style:'h4bold',decoration:'underline'},{text:' Taux utilisé sur le capital restant dû pour calculer les intérêts d\'une échéance. Le taux périodique dépend de la périodicité du crédit (mensuel, annuel, ...).',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux d\'intérêt (annuel):',style:'h4bold',decoration:'underline'},{text:' Pourcentage permettant de calculer la rémunération annuelle de la banque sur une somme d\'argent prêté à l\'emprunteur.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux nominal ou taux débiteur (annuel):',style:'h4bold',decoration:'underline'},{text:' C\'est le taux (annuel) du crédit quand celui-ci est calculé au taux proportionnel.',style:'h4'}]},{style:'verySmallLineBreak',text:''},{text:[{text:'Taux révisable (ou Taux variable):',style:'h4bold',decoration:'underline'},{text:' Taux qui peut évoluer à la hausse comme à la baisse sur la durée du prêt selon les modalités prévues dans le contrat de prêt. L\'évolution du taux dépend de la variation d\'un ou plusieurs indices et elle peut être mensuelle, trimestrielle, annuelle ou pluriannuelle. Le prêt à taux variable peut comprendre une période à taux fixe et des limites de variation.',style:'h4'}]},{style:'verySmallLineBreak',text:''}];
    expect(JSON.stringify(aAnnex)).toBe(JSON.stringify(expectedResult));
  });


  it('Annexe 4 must be generated', () => {

    const aRevenueItem: RevenueItem = {type: 'SALARY', monthly_amount: {figure: 3000, weight: 80}, comment: 'Un salaire' };
    const aChargeItem: ChargeItem = {type: 'RENT', monthly_amount: {figure: 3000, weight: 80}, comment: 'Un loyer' };
    const aPatrominyItem: PatrimonyItem = {type: 'REAL_ESTATE_SECONDARY_PROPERTY', for_sale: {price: 100000, agency_fees: 2500, taxes: 25000, since: '2017-10-06T14:00:00.000Z', dates: {sales_agreement_date: '2017-09-06T14:00:00.000Z', conditions_precedent_end_date:'2018-10-06T14:00:00.000Z', signature_date:'2019-10-06T14:00:00.000Z'}}, breakup: null, value: 6500.5, buying_or_opening_date: '2017-10-06T14:00:00.000Z', comment: 'Une résidence secondaire' };
    const aCurrentLoanItem: CurrentLoan = {type: 'MORTGAGE', future: 'CONTINUE_AFTER_PROJECT', monthly_payment: {figure: 120, weight: 80}, remaining_capital: 1500, start_date: '2017-10-06T14:00:00.000Z', end_date: '2027-10-06T14:00:00.000Z', lender: 'BNP' };

    const aFinanceDetails: FinanceDetails = {personal_funding: 15000, income_tax: {fiscal_reference_revenue_Nminus1: 1500, fiscal_reference_revenue_Nminus2: 1700}, current_loans: [aCurrentLoanItem], revenues: [aRevenueItem], charges: [aChargeItem], patrimony: [aPatrominyItem]};

    const aCaseHousehold: Case = { actor: {
        type: 'HOUSEHOLD',
        bank_info: {current_bank: 'BPMED', current_agency: 'Agence du centre'},
        finance: aFinanceDetails,
        persons: [
          {
            is_borrower: true,
            finance: aFinanceDetails,
            civil: {
              courtesy: 'MRS',
              first_name: 'Céline',
              last_name: 'Pignon',
              email: 'celine.pignon@email.com',
              phone_number: '06.05.04.03.01',
              contact_address: {address: '1, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP1', current_agency: 'Agence du port1'}
            }
          },
          {
            is_borrower: true,
            finance: aFinanceDetails,
            civil: {
              courtesy: 'MR',
              first_name: 'Jean',
              last_name: 'Pignon',
              email: 'jean.pignon@email.com',
              phone_number: '06.05.04.03.02',
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP2', current_agency: 'Agence du port2'}
            }
          },
          {
            is_borrower: false,
            finance: aFinanceDetails,
            civil: {
              courtesy: 'MR',
              first_name: 'Jean',
              last_name: 'Pignon2',
              email: 'jean.pignon@email.com',
              phone_number: '06.05.04.03.02',
              contact_address: {address: '2, Rue des Fleurs', postal_code: '06100', city: 'Nice'},
              bank_info: {current_bank: 'BNP3', current_agency: 'Agence du port3'}
            }
          }
        ]
      }
    };

    aMandatePDFExportService.aCase = aCaseHousehold;
    const aCaseFormService = new CaseFormService();
    aCaseFormService.newCase(HouseholdDetails.TypeEnum.Household);

    aMandatePDFExportService.aCaseForm = aCaseFormService;


    const aAnnex = aMandatePDFExportService.encodeFinancialDeclaration('4');
    const expectedResult = [{style:'smallLineBreak',text:'',pageBreak:'after'},{style:'h2',text:'Annexe 4: Déclaration de situation financière'},{style:'smallLineBreak',text:''},{style:'h2bold',text:'Ménage: apport, revenus, charges et patrimoine'},{columns:[{width:'55%',text:'Apport au projet:'},{width:'45%',style:'caseStyleBold',text:'15 000,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-1:'},{width:'45%',style:'caseStyleBold',text:'1 500,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-2:'},{width:'45%',style:'caseStyleBold',text:'1 700,00 €'}]},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Revenus mensuels nets avant impôt:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['25%','25%','25%','25%'],body:[[{style:'thead',text:'Type de revenu',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'25%',text:'Salaire'},{width:'25%',text:'3 000,00 €'},{width:'25%',text:'80%'},{width:'25%',text:'Un salaire'}]]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Charges mensuelles:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['20%','20%','20%','20%','20%'],body:[[{style:'thead',text:'Type de charge',alignment:'center'},{style:'thead',text:'Avant/après projet',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'20%',text:'Loyer'},{width:'20%',text:'Charge après projet'},{width:'20%',text:'3 000,00 €'},{width:'20%',text:'80%'},{width:'20%',text:'Un loyer'}]]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Patrimoine:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Type',alignment:'center'},{style:'thead',text:'Valeur',alignment:'center'},{style:'thead',text:'Démembrement éventuel',alignment:'center'},{style:'thead',text:'Date d\'achat ou d\'ouverture',alignment:'center'},{style:'thead',text:'Capital restant du',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'},{style:'thead',text:'Est à vendre ?',alignment:'center'}],[1,'Résidence secondaire','6 500,50 €','Pleine propriété','6 octobre 2017','','Une résidence secondaire','Non']]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Éléments du patrimoine en vente:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['14.285%','14.285%','14.285%','14.285%','14.285%','14.285%','14.285%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Prix',alignment:'center'},{style:'thead',text:'Frais',alignment:'center'},{style:'thead',text:'Impôt',alignment:'center'},{style:'thead',text:'Date de signature du compromis',alignment:'center'},{style:'thead',text:'Date de levée des conditions suspensives',alignment:'center'},{style:'thead',text:'Date de signature',alignment:'center'}],[1,'100 000,00 €','2 500,00 €','25 000,00 €','6 septembre 2017','6 octobre 2018','6 octobre 2019']]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Crédit en cours:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Type de prêt',alignment:'center'},{style:'thead',text:'Futur du prêt',alignment:'center'},{style:'thead',text:'Mensualité',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Capital restant dû',alignment:'center'},{style:'thead',text:'Date de début',alignment:'center'},{style:'thead',text:'Date de fin',alignment:'center'},{style:'thead',text:'Organisme préteur',alignment:'center'}],['Crédit immobilier','Continue après le projet','120,00 €','80%','1 500,00 €','6 octobre 2017','6 octobre 2027','BNP']]}},{style:'bigLineBreak',text:''},{style:'h2bold',text:'Mme. Céline Pignon: apport, revenus, charges et patrimoine'},{columns:[{width:'55%',text:'Apport au projet:'},{width:'45%',style:'caseStyleBold',text:'15 000,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-1:'},{width:'45%',style:'caseStyleBold',text:'1 500,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-2:'},{width:'45%',style:'caseStyleBold',text:'1 700,00 €'}]},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Revenus mensuels nets avant impôt:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['25%','25%','25%','25%'],body:[[{style:'thead',text:'Type de revenu',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'25%',text:'Salaire'},{width:'25%',text:'3 000,00 €'},{width:'25%',text:'80%'},{width:'25%',text:'Un salaire'}]]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Charges mensuelles:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['20%','20%','20%','20%','20%'],body:[[{style:'thead',text:'Type de charge',alignment:'center'},{style:'thead',text:'Avant/après projet',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'20%',text:'Loyer'},{width:'20%',text:'Charge après projet'},{width:'20%',text:'3 000,00 €'},{width:'20%',text:'80%'},{width:'20%',text:'Un loyer'}]]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Patrimoine:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Type',alignment:'center'},{style:'thead',text:'Valeur',alignment:'center'},{style:'thead',text:'Démembrement éventuel',alignment:'center'},{style:'thead',text:'Date d\'achat ou d\'ouverture',alignment:'center'},{style:'thead',text:'Capital restant du',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'},{style:'thead',text:'Est à vendre ?',alignment:'center'}],[1,'Résidence secondaire','6 500,50 €','Pleine propriété','6 octobre 2017','','Une résidence secondaire','Non']]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Éléments du patrimoine en vente:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['14.285%','14.285%','14.285%','14.285%','14.285%','14.285%','14.285%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Prix',alignment:'center'},{style:'thead',text:'Frais',alignment:'center'},{style:'thead',text:'Impôt',alignment:'center'},{style:'thead',text:'Date de signature du compromis',alignment:'center'},{style:'thead',text:'Date de levée des conditions suspensives',alignment:'center'},{style:'thead',text:'Date de signature',alignment:'center'}],[1,'100 000,00 €','2 500,00 €','25 000,00 €','6 septembre 2017','6 octobre 2018','6 octobre 2019']]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Crédit en cours:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Type de prêt',alignment:'center'},{style:'thead',text:'Futur du prêt',alignment:'center'},{style:'thead',text:'Mensualité',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Capital restant dû',alignment:'center'},{style:'thead',text:'Date de début',alignment:'center'},{style:'thead',text:'Date de fin',alignment:'center'},{style:'thead',text:'Organisme préteur',alignment:'center'}],['Crédit immobilier','Continue après le projet','120,00 €','80%','1 500,00 €','6 octobre 2017','6 octobre 2027','BNP']]}},{style:'bigLineBreak',text:''},{style:'h2bold',text:'M. Jean Pignon: apport, revenus, charges et patrimoine'},{columns:[{width:'55%',text:'Apport au projet:'},{width:'45%',style:'caseStyleBold',text:'15 000,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-1:'},{width:'45%',style:'caseStyleBold',text:'1 500,00 €'}]},{columns:[{width:'55%',text:'Revenu fiscal de référence année N-2:'},{width:'45%',style:'caseStyleBold',text:'1 700,00 €'}]},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Revenus mensuels nets avant impôt:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['25%','25%','25%','25%'],body:[[{style:'thead',text:'Type de revenu',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'25%',text:'Salaire'},{width:'25%',text:'3 000,00 €'},{width:'25%',text:'80%'},{width:'25%',text:'Un salaire'}]]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Charges mensuelles:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['20%','20%','20%','20%','20%'],body:[[{style:'thead',text:'Type de charge',alignment:'center'},{style:'thead',text:'Avant/après projet',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'20%',text:'Loyer'},{width:'20%',text:'Charge après projet'},{width:'20%',text:'3 000,00 €'},{width:'20%',text:'80%'},{width:'20%',text:'Un loyer'}]]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Patrimoine:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Type',alignment:'center'},{style:'thead',text:'Valeur',alignment:'center'},{style:'thead',text:'Démembrement éventuel',alignment:'center'},{style:'thead',text:'Date d\'achat ou d\'ouverture',alignment:'center'},{style:'thead',text:'Capital restant du',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'},{style:'thead',text:'Est à vendre ?',alignment:'center'}],[1,'Résidence secondaire','6 500,50 €','Pleine propriété','6 octobre 2017','','Une résidence secondaire','Non']]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Éléments du patrimoine en vente:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['14.285%','14.285%','14.285%','14.285%','14.285%','14.285%','14.285%'],body:[[{style:'thead',text:'Référence',alignment:'center'},{style:'thead',text:'Prix',alignment:'center'},{style:'thead',text:'Frais',alignment:'center'},{style:'thead',text:'Impôt',alignment:'center'},{style:'thead',text:'Date de signature du compromis',alignment:'center'},{style:'thead',text:'Date de levée des conditions suspensives',alignment:'center'},{style:'thead',text:'Date de signature',alignment:'center'}],[1,'100 000,00 €','2 500,00 €','25 000,00 €','6 septembre 2017','6 octobre 2018','6 octobre 2019']]}},{style:'bigLineBreak',text:''},{style:'h3bold',width:'100%',text:'Crédit en cours:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%','12.5%'],body:[[{style:'thead',text:'Type de prêt',alignment:'center'},{style:'thead',text:'Futur du prêt',alignment:'center'},{style:'thead',text:'Mensualité',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Capital restant dû',alignment:'center'},{style:'thead',text:'Date de début',alignment:'center'},{style:'thead',text:'Date de fin',alignment:'center'},{style:'thead',text:'Organisme préteur',alignment:'center'}],['Crédit immobilier','Continue après le projet','120,00 €','80%','1 500,00 €','6 octobre 2017','6 octobre 2027','BNP']]}},{style:'bigLineBreak',text:''},{style:'h3bold',text:'Revenus mensuels totaux: 0,00 €'},{style:'h3bold',text:'Charges mensuelles totales: 0,00 €'},{style:'smallLineBreak',text:''},{style:'',text:'Je certifie exacts, sincères et exhaustifs les renseignements ci-dessus portant sur mes revenus, charges et crédits en cours. Je reconnais avoir été informé(e) qu\'en cas de fausse déclaration, je serais constitué(e) débiteur/débitrice de mauvaise foi et serais susceptible en conséquence, sous réserve de l\'appréciation des tribunaux, d\'être déchu(e/s/es) du bénéfice des articles L331-1 à L333-8 du Code de la consommation, relatifs au règlement des situations de surendettement des particuliers et des familles.'},{style:'bigLineBreak',text:''},{style:'table',width:'100%',alignment:'center',table:{body:[[{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du (des) Mandant(s) \n',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du(des) signataire(s): \n \n \n \n \n \n \n']],widths:'100%'}},{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du Mandataire \n',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du signataire: \n \n \n \n \n \n \n']],widths:'100%'}}]],widths:['*','*']},layout:'noBorders'}];

    // console.log(JSON.stringify(aAnnex));
    // console.log(JSON.stringify(expectedResult));
    expect(JSON.stringify(aAnnex)).toBe(JSON.stringify(expectedResult));
  });


  it('Annexe 5 must be generated', () => {
    const aAnnex = aMandatePDFExportService.encodeInsuranceInformation('5');
    // console.log(JSON.stringify(aAnnex));
    const expectedResult = [{style:'smallLineBreak',text:'',pageBreak:'after'},{style:'h2',text:'Annexe 5: Assurance emprunteur'},{style:'smallLineBreak',text:''},{text:'Le Mandataire, dont l\'adresse est , agit en tant que courtier/mandataire en assurance immatriculé à l\'ORIAS sous le numéro .'},{style:'smallLineBreak',text:''},{text:'Pour toute réclamation, vous pouvez vous adresser au Mandataire, par courier, à l\'adresse figurant ci-dessus.'},{style:'smallLineBreak',text:''},{text:'L\'assurance emprunteur constitue une garantie à la fois pour le prêteur et l\'emprunteur. Elle est un élément déterminant de l\'obtention de votre crédit pour certains établissements de crédits.'},{style:'smallLineBreak',text:''},{text:'Le Mandataire ne travaille pas exclusivement avec un ou plusieurs assureurs. Le Client peut obtenir la liste des partenaires assureurs auprès du Mandataire et sur demande.'},{style:'bigLineBreak',text:''},{style:'bolditalics',text:'Possibilités de garanties d\'assurance:',decoration:'underline'},{style:'tablejustify',width:'100%',alignment:'justify',table:{body:[[[{text:[{text:'La'},{text:' garantie Décès',style:'bold'},{text:' intervient en cas de décès de la personne assurée. Dans le ou les contrat(s) qui ser(ont) proposé(s), elle cesse à une date d\'anniversaire définie. La prestation est le remboursement au prêteur du capital assuré.'}]},{style:'bigLineBreak',text:''},{text:[{text:'La'},{text:' garantie Perte totale et irréversible d\'autonomie (PTIA)',style:'bold'},{text:' intervient lorsque l\'assuré se trouve dans un état particulièrement grave, nécessitant le recours permanent à une tierce personne pour exercer les actes ordinaires de la vie. Dans le ou les contrat(s) proposé(s), la garantie PTIA cesse à une date d\'anniversaire définie. La prestation est le remboursement au prêteur du capital assuré.'}]},{style:'bigLineBreak',text:''},{text:[{text:'La'},{text:' garantie Perte d\'emploi',style:'bold'},{text:' intervient en cas de chômage et lorsque l\'assuré perçoit une allocation de chômage versée par le Pôle Emploi (ex Assedic) ou un organisme assimilé. Elle est accordée, après une période de franchise, pour une durée totale maximale cumulée qui sera définie dans le contrat, quelle que soit la durée totale du prêt. La garantie Perte d\'emploi prend fin en fonction de la date d\'anniversaire prévu.'}]},{style:'bigLineBreak',text:''},{text:'Vous souhaitez que la prestation soit:',decoration:'underline'},{style:'bigLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Forfaitaire (le montant qui vous sera versé correspond à un pourcentage de l\'échéance du prêt)',alignment:'left',width:'95%',margin:[5,0,0,0]}]},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Indemnitaire (le montant qui vous sera versé complète tout ou partie de votre perte de rémunération)',alignment:'left',width:'95%',margin:[5,0,0,0]}]}],[{text:[{text:'ITT: ',style:'bold'},{text:'Incapacité Temporaire de Travail. Par suite de maladie ou d\'accident survenant pendant la période de garantie, l\'assuré se trouve dans l\'impossibilité complète d\'exercer une quelconque activité professionnelle. Cet état peut être constaté par expertise médicale de l\'Assureur. La prise en charge au titre de cette garantie est limitée à un nombre de jours défini dans le contrat à compter de la date d\'arrêt total de travail.'}]},{style:'bigLineBreak',text:''},{text:[{text:'IPP/IPT: ',style:'bold'},{text:'Invalidité Permanente Partielle ou Invalidité Permanente Totale. L\'assuré est considéré en état d\'IPP ou d\'ITT lorsque par suite d\'accident ou de maladie son taux d\'invalidité est correspond à un certain pourcentage permettant de définir l\'invalidité partielle ou totale'}]},{style:'bigLineBreak',text:''},{text:'Vous souhaitez que la prestation ITT soit:',decoration:'underline'},{style:'bigLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Forfaitaire (le montant qui vous sera versé correspond à un pourcentage de l\'échéance du prêt)',alignment:'left',width:'95%',margin:[5,0,0,0]}]},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Indemnitaire (le montant qui vous sera versé complète tout ou partie de votre perte de rémunération)',alignment:'left',width:'95%',margin:[5,0,0,0]}]}]]],widths:['*','*']}},{style:'bigLineBreak',text:''},{style:'tablejustify',width:'100%',alignment:'justify',table:{body:[[[{text:'Les garanties sont détaillées dans la notice du contrat d\'assurance emprunteur qui seule a valeur contractuelle. Lors de nos échanges, nous avons évoqué les risques liés au non-remboursement total ou partiel de votre prêt, en cas de décès/perte totale et irréversible d\'autonomie (PTIA), ou en cas de problème de santé vous privant de l\'exercice de votre activité:'},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Oui',alignment:'center',width:'15%'},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Non',alignment:'center',width:'15%'}]}],[{text:'Les garanties proposées, les modalités de paiement des cotisations et leur évolution éventuelle ont également été évoquées:'},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Oui',alignment:'center',width:'15%'},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Non',alignment:'center',width:'15%'}]}]]],widths:['*','*']}},{style:'bigLineBreak',text:''},[{style:'h3',text:'Compte tenu de votre situation, vous envisagez de souscrire les garanties suivantes:'},{style:'smallLineBreak',text:''},{style:'tablecenter',width:'80%',table:{body:[['','Décès','PTIA','IPT','IPP','ITT','Perte d\'emploi']],widths:['20%','10%','10%','10%','10%','10%','10%']}}],{style:'bigLineBreak',text:''},{style:'table',width:'100%',alignment:'center',table:{body:[[{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du (des) Mandant(s) \n',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du(des) signataire(s): \n \n \n \n \n \n \n']],widths:'100%'}},{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du Mandataire \n',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du signataire: \n \n \n \n \n \n \n']],widths:'100%'}}]],widths:['*','*']},layout:'noBorders'}];
    expect(JSON.stringify(aAnnex)).toBe(JSON.stringify(expectedResult));
  });

});
