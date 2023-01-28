import { TestBed } from '@angular/core/testing';
import { AdvicePDFExportService } from './advice-pdf-export.service';

import { Case } from '../../_api/model/case';
import { ActivePartner } from '../../_api/model/activePartner';
import { ChargeItem, RevenueItem, PatrimonyItem, FinanceDetails, CurrentLoan, FundingResults, FundingParameters } from 'src/app/_api';
import { HouseConstruction } from '../../_api/model/houseConstruction';
import { AdministrativeInformation } from '../../_api/model/administrativeInformation';
import { Contact } from '../../_api/model/contact';
import { CaseFormService, CaseService } from '../../_services';

import { IconsSvg } from './icons-svg';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

describe('AdvicePDFExportService', () => {

  let aAdvicePDFExportService: AdvicePDFExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    aAdvicePDFExportService = TestBed.inject(AdvicePDFExportService);
  });


  it('Header must be correctly formatted', () => {
    const aResult = aAdvicePDFExportService.encodeAdviceHeader('title', IconsSvg.voidSvg);
    // console.log(JSON.stringify(aResult));
    const expectedResult = [{columns:[{svg:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"></svg>',width:75,alignment:'center'},{style:'title',text:'title'}]},{style:'bigLineBreak',text:''},{text:''},{style:'smallLineBreak',text:''},{text:[{text:'Conseiller: ',style:'bold'},{text:' '}]},{text:[{text:'Téléphone: ',style:'bold'},{text:''}]},{text:[{text:'eMail: ',style:'bold'},{text:''}]},{style:'bigLineBreak',text:''},{text:[{text:'Référence du dossier: ',style:'bold'},{text:''}]},{style:'bigLineBreak',text:''},{canvas:[{type:'line',x1:0,y1:5,x2:515,y2:5,lineWidth:3}]},{style:'bigLineBreak',text:''},{style:'h3bold',text:'Le(s) Emprunteur(s):'},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{text:'Ci-après indifféremment dénommés conjointement le Client ou Mandant.',style:'bold'},{style:'bigLineBreak',text:''},{style:'h3bold',text:'Votre Mandataire:'},{text:'courtier en opérations de banque et services de paiement, courtier en assurances, dont le siège social est situé au , inscrit à l\'ORIAS sous le numéro , représenté par  ,'},{style:'bigLineBreak',text:''},{text:'Ci-après dénommé le Mandataire.',style:'bold'},{style:'bigLineBreak',text:''},{text:'Le fichier des intermédiaires en opérations de banque et en services de paiement est consultable sur le site de l\'Orias, www.orias.fr.'},{style:'bigLineBreak',text:''},{canvas:[{type:'line',x1:0,y1:5,x2:515,y2:5,lineWidth:3}]}];
    expect(JSON.stringify(aResult)).toBe(JSON.stringify(expectedResult));
  });


  it('Finance before/after must be correctly formatted', () => {
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

    aAdvicePDFExportService.aCase = aCaseHousehold;
    const aResult = aAdvicePDFExportService.encodeChargesBeforeAfter();
    // console.log(JSON.stringify(aResult));
    const expectedResult = [{style:'bigLineBreak',text:''},{style:'h3',text:'Charges financière du Ménage avant projet: '},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['20%','20%','20%','20%','20%'],body:[[{style:'thead',text:'Type de charge',alignment:'center'},{style:'thead',text:'Avant/après projet',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'20%',text:'Loyer'},{width:'20%',text:'Charge après projet'},{width:'20%',text:'3 000,00 €'},{width:'20%',text:'80%'},{width:'20%',text:'Un loyer'}]]}},{style:'bigLineBreak',text:''},{style:'h3',text:'Charges financières de Mme. Céline Pignon avant projet:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['20%','20%','20%','20%','20%'],body:[[{style:'thead',text:'Type de charge',alignment:'center'},{style:'thead',text:'Avant/après projet',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'20%',text:'Loyer'},{width:'20%',text:'Charge après projet'},{width:'20%',text:'3 000,00 €'},{width:'20%',text:'80%'},{width:'20%',text:'Un loyer'}]]}},{style:'bigLineBreak',text:''},{style:'h3',text:'Charges financières de M. Jean Pignon avant projet:'},{style:'smallLineBreak',text:''},{table:{style:'table',headerRows:1,widths:['20%','20%','20%','20%','20%'],body:[[{style:'thead',text:'Type de charge',alignment:'center'},{style:'thead',text:'Avant/après projet',alignment:'center'},{style:'thead',text:'Montant mensuel',alignment:'center'},{style:'thead',text:'Pondération éventuelle',alignment:'center'},{style:'thead',text:'Commentaire',alignment:'center'}],[{width:'20%',text:'Loyer'},{width:'20%',text:'Charge après projet'},{width:'20%',text:'3 000,00 €'},{width:'20%',text:'80%'},{width:'20%',text:'Un loyer'}]]}},{style:'bigLineBreak',text:''}];
    expect(JSON.stringify(aResult)).toBe(JSON.stringify(expectedResult));
  });



  it('Broker fees must be correctly formatted', () => {
    const aResult = aAdvicePDFExportService.encodeBrokerFees();
    // console.log(JSON.stringify(aResult));
    const expectedResult = [{text:'',pageOrientation:'portrait',pageBreak:'after'},{style:'h3bold',text:'Rémunération du mandataire'},{style:'bigLineBreak',text:''},{text:'Le Mandant reconnaît devoir au Mandataire, en rémunération de sa mission, la somme de _______________ euros sous forme de frais de dossier. Cette somme ne devra être versée au Mandataire qu\'après le déblocage des fonds conformément à la réglementation en vigueur (frais de dossier exonérés de TVA).',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Loi MURCEF : Article L 321-2 de la loi n°2001-1168 du 11 Décembre 2001: "Aucun versement, de quelque nature que ce soit, ne peut être exigé d\'un particulier, avant l\'obtention d\'un ou plusieurs prêts d\'argent"',alignment:'justify'},{text:'Par ailleurs la banque versera au Mandataire une commission bancaire fixée suivant la convention de partenariat signée.',alignment:'justify'}];
    expect(JSON.stringify(aResult)).toBe(JSON.stringify(expectedResult));
  });



  it('Charge recap must be correctly formatted', () => {
    const aFundingParameters: FundingParameters = { loans: [],  };
    const aFundingResults: FundingResults = { status: 'OPTIMAL', summary: { min_remaining_for_living: 20, total_revenues: 1000, max_total_charges: 100, effective_maximal_monthly_payment: 300 } };

    aAdvicePDFExportService.aParams = aFundingParameters;
    aAdvicePDFExportService.aResults = aFundingResults;
    aAdvicePDFExportService.summary = aFundingResults.summary;

    const aResult = aAdvicePDFExportService.encodeChargesRecap();
    // console.log(JSON.stringify(aResult));
    const expectedResult = [{style:'h3bold',text:'Récapitulatif des dépenses mensuelles du (ou des) emprunteur(s)'},{style:'bigLineBreak',text:''},{style:'h3',text:'Auxquelles s\'ajoute après projet une mensualité maximale de: 300,00 €, à répartir entre les différents emprunteurs.'},{style:'smallLineBreak',text:''},{style:'h3',text:'Pour un reste à vivre minimal de: 20,00 €, à partager entre les différents emprunteurs.'}];
    expect(JSON.stringify(aResult)).toBe(JSON.stringify(expectedResult));
  });


  it('Client agreement must be correctly formatted', () => {
    const aResult = aAdvicePDFExportService.encodeClientAgreement();
    // console.log(JSON.stringify(aResult));
    const expectedResult = [{style:'h3bold',text:'Accord du Mandant sur la proposition obtenue'},{style:'bigLineBreak',text:''},{style:'h3',text:'Le Mandant reconnaît que le Mandataire lui a fourni toutes les informations nécessaires à la compréhension et la comparaison des différents types de contrats disponibles sur le marché.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Le Mandant certifie qu\'un nombre suffisant de simulations lui ont été présentées pour fonder un choix éclairé.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Le Mandant reconnaît avoir disposé de toutes les informations nécessaires pour faire son choix de financement et déclare connaître et accepter les caractéristiques de l\'accord de prêt(s) obtenu.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Le Mandant reconnaît avoir été informé des règles applicables aux opérations de banque et de l\'étendue de ses devoirs et obligations en tant qu\'emprunteur(s).',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Le Mandant autorise le Mandataire à informer le vendeur ou son intermédiaire de l\'accord de prêt obtenu.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Les impayés afférents au(x) crédit(s) sollicité(s) peuvent avoir de graves conséquences sur votre patrimoine et vous pourriez être redevable(s), à l\'égard de la banque, du capital restant dû, majoré d\'intérêts de retard, ainsi que d\'une indemnité.',alignment:'justify'}];
    expect(JSON.stringify(aResult)).toBe(JSON.stringify(expectedResult));
  });


  it('Insurance annex must be correctly formatted', () => {
    const aResult = aAdvicePDFExportService.encodeInsuranceAnnex('1');
    // console.log(JSON.stringify(aResult));
    const expectedResult = [{text:'',pageOrientation:'portrait',pageBreak:'after'},{style:'h3centerbold',text:'Annexe 1: ASSURANCES'},{style:'bigLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Le Client n\'a pas recours au service d\'intermédiation en assurances qui lui a été proposé. Il fait le choix de prendre en charge seul la recherche d\'une solution d\'assurance. Il est informé que l\'établissement de crédit est tenu de lui remettre une fiche standardisée d\'information portant sur les critères de couverture exigés par l\'établissement de crédit, le taux annuel effectif de l\'assurance (TAEA) applicable, le montant de la cotisation et le coût total de la protection, lui permettant ainsi de comparer les différentes offres du marché.',alignment:'justify',width:'95%',margin:[5,0,0,0]}]},{style:'bigLineBreak',text:''},{style:'table',width:'100%',alignment:'center',table:{body:[[{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du (des) Mandant(s) \n',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du(des) signataire(s): \n \n \n \n \n \n \n']],widths:'100%'}},{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du Mandataire \n',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du signataire: \n \n \n \n \n \n \n']],widths:'100%'}}]],widths:['*','*']},layout:'noBorders'},{style:'bigLineBreak',text:''},{style:'bold',text:'La solution d\'assurance que vous envisagez :',alignment:'justify'},{style:'bigLineBreak',text:''},{text:'Compte tenu des besoins exprimés par le Client, nous vous proposons le contrat d\'Assurance avec les caractéristiques suivantes :',alignment:'justify'},{style:'smallLineBreak',text:''},{columns:[null]},{text:'',pageOrientation:'portrait',pageBreak:'after'},{text:'Le Client reconnaît avoir reçu et pris connaissance d\'une fiche standardisée d\'information portant sur les critères de couverture exigés par l\'établissement de crédit, le taux annuel effectif de l\'assurance (TAEA) applicable, le montant de la cotisation et le coût total de la protection, lui permettant ainsi de comparer les différentes offres du marché.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Aussi précis que soient les informations et les conseils donnés, il est très important que vous lisiez attentivement la notice de votre contrat d\'assurance emprunteur qui vous sera remise au moment de votre adhésion/souscription. Cette notice constitue le document juridique contractuel exprimant les droits et obligations de l\'assuré et de l\'assureur.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Nous attirons votre attention sur les paragraphes de la notice consacrés notamment aux risques exclus, à la durée d\'adhésion/souscription de votre contrat, aux délais de carence (période durant laquelle l\'assuré ne peut pas demander la mise en œuvre de la garantie), de franchise (période durant laquelle le sinistre reste à la charge de l\'assuré), aux définitions des garanties, les risques assurés et les dates d\'expirations de ces garanties date d\'expiration.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Nous insistons sur l\'importance de la précision et de la sincérité des réponses apportées au questionnaire d\'adhésion/ souscription au contrat d\'assurance emprunteur, y compris la partie questionnaire médical. Une fausse déclaration intentionnelle entraînerait la nullité du contrat et la déchéance de la garantie.',alignment:'justify'},{style:'smallLineBreak',text:''},{style:'bold',text:'La cotisation de(s) l\'assurance(s) est:',alignment:'justify',decoration:'underline'},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Constante',alignment:'justify',width:'20%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Non constante',alignment:'justify',width:'20%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Dégressive',alignment:'justify',width:'20%',margin:[5,0,0,0]},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Progressive',alignment:'justify',width:'20%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Garantie sur toute la durée du prêt',alignment:'justify',width:'95%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Révisable dans les conditions suivantes',alignment:'justify',width:'95%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'15%'},{text:'Suite à une reprise de la consommation du tabac',alignment:'justify',width:'75%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'15%'},{text:'Suite à un changement de situation',alignment:'justify',width:'75%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'15%'},{text:'Suite à un changement de domicile',alignment:'justify',width:'75%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'15%'},{text:'Suite à la pratique de nouvelles activités (professionelles ou sportives)',alignment:'justify',width:'75%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'15%'},{text:'En cas de déficit du contrat groupe (réajustement tarifaire)',alignment:'justify',width:'75%',margin:[5,0,0,0]}]},{style:'smallLineBreak',text:''},{text:'Le coût total de l\'assurance emprunteur sur la durée du prêt est précisé ci-dessus. Il inclue le montant des éventuels frais annexes liés à l\'assurance (frais de dossier, …). Il s\'agit d\'un tarif indicatif avant examen du dossier et du questionnaire médical par le service médical de l\'assureur et hors cas de surprime. Lorsqu\'une personne présente un risque aggravé de santé, les garanties et le tarif doivent être adaptés. Dans ce cas, les dispositions de la convention AERAS, s\'Assurer et Emprunter avec un Risque Aggravé de Santé, sont appliquées (cf. www.aeras-infos.fr)',alignment:'justify'},{text:'',pageOrientation:'portrait',pageBreak:'after'},{style:'bold',text:'Le Client déclare et reconnaît: ',alignment:'justify',decoration:'underline'},{style:'smallLineBreak',text:''},{ul:[{text:'Que la prestation d\'assurance proposée correspond à ses exigences et besoins au regard des informations reçues et fournies,'},{style:'smallLineBreak',text:''},{text:'Avoir reçue une information sur l\'étendue et la définition des garanties proposées,'},{style:'smallLineBreak',text:''},{text:'Avoir pris connaissance et être en possession des conditions générales d\'assurance de prêt.'}]},{style:'bigLineBreak',text:''},{text:'Il reconnaît avoir pris connaissance du contenu du présent document préalablement à la signature du contrat d\'assurance proposé ci-dessus et en avoir reçu un exemplaire.'},{style:'table',width:'100%',alignment:'center',table:{body:[[{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du (des) Mandant(s) \nPrécédée de la mention "Bon pour accord"',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du(des) signataire(s): \n \n \n \n \n \n \n']],widths:'100%'}},{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du Mandataire \nPrécédée de la mention "Bon pour accord"',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du signataire: \n \n \n \n \n \n \n']],widths:'100%'}}]],widths:['*','*']},layout:'noBorders'}];
    expect(JSON.stringify(aResult)).toBe(JSON.stringify(expectedResult));
  });



  it('Body must be correctly formatted', () => {
    const aFundingParameters: FundingParameters = { loans: [],  };
    const aFundingResults: FundingResults = { status: 'OPTIMAL', loans: [], summary: { min_remaining_for_living: 20, total_revenues: 1000, max_total_charges: 100, effective_maximal_monthly_payment: 300 } };

    aAdvicePDFExportService.aParams = aFundingParameters;
    aAdvicePDFExportService.aResults = aFundingResults;
    aAdvicePDFExportService.summary = aFundingResults.summary;

    const aResult = aAdvicePDFExportService.encodeBody();
    // console.log(JSON.stringify(aResult));
    const expectedResult = [{text:'',pageOrientation:'landscape',pageBreak:'after'},{style:'h3centerbold',text:'Proposition de financement obtenue'},{style:'smallLineBreak',text:''},{text:'Le Mandant reconnaît avoir obtenu par l\'intermédiaire du Mandataire l\'accord de principe de la banque «BanqueRaison» pour la réalisation du plan de financement suivant: '},{style:'bigLineBreak',text:''},{columns:[{width:'15%',text:''},{style:'table',margin:[0,0,0,0],headerRows:1,widths:['auto'],table:{body:[[{style:'thead',text:'Numéro du prêt',alignment:'center'},{style:'thead',text:'Type',alignment:'center'},{style:'thead',text:'Montant',alignment:'center'},{style:'thead',text:'Durée',alignment:'center'},{style:'thead',text:'Taux',alignment:'center'},{style:'thead',text:'Total intérêts',alignment:'center'},{style:'thead',text:'Type de différé',alignment:'center'},{style:'thead',text:'Durée du différé',alignment:'center'},{style:'thead',text:'Caution',alignment:'center'},{style:'thead',text:'Montant de la caution',alignment:'center'},{style:'thead',text:'Total assurance(s)',alignment:'center'}],['TOTAL','','0,00 €','','','0,00 €','','','','0,00 €','0,00 €']]}},{width:'*',text:''}]},{style:'smallLineBreak',text:''},{text:'Note: la caution (ou garantie) permet au prêteur d\'obtenir le remboursement partiel ou complet du montant du crédit en cas de défaut de paiement de l\'emprunteur.'},{style:'bigLineBreak',text:''},{columns:[{width:'20%',text:''},null,{width:'*',text:''}]},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{text:'Les éléments indiqués sont susceptibles d\'être modifiés par l\'établissement bancaire. Ils seront mentionnés de manière définitive dans l\'offre de prêt.'},{text:'',pageOrientation:'portrait',pageBreak:'after'},{style:'h3bold',text:'Conditions de validité de l\'accord de principe de la banque'},{style:'smallLineBreak',text:''},{text:'L\'accord de principe de la banque a été émis pour une durée de _________ jours et sous réserve de satisfaire les conditions suivantes :'},{style:'smallLineBreak',text:''},{columns:[{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Ouverture de compte',alignment:'center',width:'25%'},{canvas:[{type:'rect',x:0,y:0,w:10,h:10,lineWidth:1,lineColor:'black'}],alignment:'right',width:'5%'},{text:'Domiciliation des revenus',alignment:'center',width:'25%'}]},{style:'smallLineBreak',text:''},{ul:[{text:'_______________________________________________________________________________________________________________'},{style:'smallLineBreak',text:''},{text:'_______________________________________________________________________________________________________________'},{style:'smallLineBreak',text:''},{text:'_______________________________________________________________________________________________________________'},{style:'smallLineBreak',text:''},{text:'_______________________________________________________________________________________________________________'}]},{style:'bigLineBreak',text:''},{text:'En cas de remboursement anticipé du ou des crédit(s) sollicité(s), le Mandant pourra être redevable à l\'égard de la banque, d\'une indemnité décrite dans l\'offre de prêt(s).'},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3bold',text:'Récapitulatif des dépenses mensuelles du (ou des) emprunteur(s)'},{style:'bigLineBreak',text:''},{style:'h3',text:'Auxquelles s\'ajoute après projet une mensualité maximale de: 300,00 €, à répartir entre les différents emprunteurs.'},{style:'smallLineBreak',text:''},{style:'h3',text:'Pour un reste à vivre minimal de: 20,00 €, à partager entre les différents emprunteurs.'},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{text:'',pageOrientation:'portrait',pageBreak:'after'},{style:'h3bold',text:'Rémunération du mandataire'},{style:'bigLineBreak',text:''},{text:'Le Mandant reconnaît devoir au Mandataire, en rémunération de sa mission, la somme de _______________ euros sous forme de frais de dossier. Cette somme ne devra être versée au Mandataire qu\'après le déblocage des fonds conformément à la réglementation en vigueur (frais de dossier exonérés de TVA).',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Loi MURCEF : Article L 321-2 de la loi n°2001-1168 du 11 Décembre 2001: "Aucun versement, de quelque nature que ce soit, ne peut être exigé d\'un particulier, avant l\'obtention d\'un ou plusieurs prêts d\'argent"',alignment:'justify'},{text:'Par ailleurs la banque versera au Mandataire une commission bancaire fixée suivant la convention de partenariat signée.',alignment:'justify'},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'h3bold',text:'Accord du Mandant sur la proposition obtenue'},{style:'bigLineBreak',text:''},{style:'h3',text:'Le Mandant reconnaît que le Mandataire lui a fourni toutes les informations nécessaires à la compréhension et la comparaison des différents types de contrats disponibles sur le marché.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Le Mandant certifie qu\'un nombre suffisant de simulations lui ont été présentées pour fonder un choix éclairé.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Le Mandant reconnaît avoir disposé de toutes les informations nécessaires pour faire son choix de financement et déclare connaître et accepter les caractéristiques de l\'accord de prêt(s) obtenu.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Le Mandant reconnaît avoir été informé des règles applicables aux opérations de banque et de l\'étendue de ses devoirs et obligations en tant qu\'emprunteur(s).',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Le Mandant autorise le Mandataire à informer le vendeur ou son intermédiaire de l\'accord de prêt obtenu.',alignment:'justify'},{style:'smallLineBreak',text:''},{text:'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Les impayés afférents au(x) crédit(s) sollicité(s) peuvent avoir de graves conséquences sur votre patrimoine et vous pourriez être redevable(s), à l\'égard de la banque, du capital restant dû, majoré d\'intérêts de retard, ainsi que d\'une indemnité.',alignment:'justify'},{style:'bigLineBreak',text:''},{style:'bigLineBreak',text:''},{style:'table',width:'100%',alignment:'center',table:{body:[[{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du (des) Mandant(s) \nPrécédée de la mention "Bon pour accord"',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du(des) signataire(s): \n \n \n \n \n \n \n']],widths:'100%'}},{style:'tableleft',widths:'100%',table:{headerRows:1,body:[[{text:'Signature du Mandataire \nPrécédée de la mention "Bon pour accord"',style:'thead',alignment:'center'}],['\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du signataire: \n \n \n \n \n \n \n']],widths:'100%'}}]],widths:['*','*']},layout:'noBorders'}];
    expect(JSON.stringify(aResult)).toBe(JSON.stringify(expectedResult));
  });

});
