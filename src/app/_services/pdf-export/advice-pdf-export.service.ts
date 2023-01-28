import { Injectable } from '@angular/core';
import { Case, Budget, BudgetParameters, BudgetResults, Individual, LegalPerson, Partner, ActivePartner, FundingResults, Taeg, SmoothableCharge, BridgeLoan, AvailableLoan, Loan, FundingParameters } from '../../_api/model/models';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { IconsSvg } from './icons-svg';
import { PDFExportService } from './pdf-export.service';
import { LegalPersonTypeMap } from 'src/app/utils/strings';
import { CourtesyTypeMap } from 'src/app/utils/strings';
import { ProjectStringMap } from 'src/app/utils/strings';
import { CaseFormService, CaseService } from '../../_services';
import { AcquisitionNatureMap, AcquisitionStateMap, AcquisitionDestinationMap,  } from 'src/app/utils/strings';
import * as palette from 'google-palette';
import { isThisTypeNode } from 'typescript';


@Injectable({
    providedIn: 'root'
})
export class AdvicePDFExportService extends PDFExportService {

    currentDate = new Date();
    summary: any;
    iconUser: any;
    totalCost: any;
    loansAmountToFund: any;
    aCaseForm: CaseFormService;

    // Colors for the table
    colormap = palette(['tol-rainbow'], 10);
    yellowCell = '#' + this.colormap[7];
    blueCell = '#' + this.colormap[2];
    greenCell = '#' + this.colormap[4];
    purpleCell = '#' + this.colormap[0];


    exportToPDF(caseId: string, caseName: string, aCaseForm: CaseFormService, totalCost, loansAmountToFund, aPartners: ActivePartner[], params: any, results: FundingResults, iconUser: any): any {

        this.aCase = aCaseForm.asCase();
        this.aCaseForm = aCaseForm;
        this.caseId = caseId;
        this.caseName = caseName;
        this.iconUser = iconUser;
        this.aPartners = aPartners;
        this.totalCost = totalCost;
        this.loansAmountToFund = loansAmountToFund;
        this.summary = results.summary;
        this.aParams = params;
        this.aResults = results;

        return {
            pageMargins: [40, 60, 40, 60],
            pageSize: 'A4',
            pageOrientation: 'portrait',
            defaultStyle: {
                fontSize: 10
            },
            styles: this.styles(),
            header: this.header(this.caseId, IconsSvg.toaztrLogo),
            footer: this.footer(),
            content: this.content()
        };
    }


    // Encode the contact section into PDF format
    encodeAdviceHeader(title: any, iconUser: any) {
      const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners);
      const aBrokerRepresenting = this.extractPartnerContact('BROKER', this.aPartners, true);
      const aDestinationContact = this.generateDestinationContact()

      // Format broker name depending if we have or not the courtesy
      const brokerName = this.formatContactName(aBrokerPartner);;
      // Format broker name depending if we have or not the courtesy
      const representantName = this.formatContactName(aBrokerRepresenting);;

      const brokerNameFormatted = aBrokerPartner.name ? aBrokerPartner.name + ', ' : '';
      const aContact = [
        {columns: [{ svg: iconUser, width: 75, alignment: 'center'}, {style: 'title', text: title }] },
        {style: 'bigLineBreak', text: ''},
        {text: brokerNameFormatted + this.formatAddress(aBrokerPartner.address.address, aBrokerPartner.address.postal_code, aBrokerPartner.address.city, aBrokerPartner.address.country) },
        {style: 'smallLineBreak', text: ''},
        {text: [ {text : 'Conseiller: ', style: 'bold'},  {text: brokerName}] },
        {text: [ {text : 'Téléphone: ', style: 'bold'},  {text: aBrokerPartner.contact.contact_phone_number}] },
        {text: [ {text : 'eMail: ', style: 'bold'},  {text: aBrokerPartner.contact.contact_email}] },
        {style: 'bigLineBreak', text: ''},
        {text: [ {text : 'Référence du dossier: ', style: 'bold'},  {text: this.caseId}] },
        {style: 'bigLineBreak', text: ''},

        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 }]},

        {style: 'bigLineBreak', text: ''},
        {style: 'h3bold', text: 'Le(s) Emprunteur(s):'},
        {style: 'bigLineBreak', text: ''},
        ...aDestinationContact,
        {style: 'bigLineBreak', text: ''},
        {text: 'Ci-après indifféremment dénommés conjointement le Client ou Mandant.', style: 'bold'},
        {style: 'bigLineBreak', text: ''},

        {style: 'h3bold', text: 'Votre Mandataire:'},
        {text: brokerNameFormatted + 'courtier en opérations de banque et services de paiement, courtier en assurances, dont le siège social est situé au ' +  this.formatAddress(aBrokerPartner.address.address, aBrokerPartner.address.postal_code, aBrokerPartner.address.city, aBrokerPartner.address.country) +  ', inscrit à l\'ORIAS sous le numéro ' + aBrokerPartner.agreement_number + ', représenté par ' + representantName + ','},
        {style: 'bigLineBreak', text: ''},
        {text: 'Ci-après dénommé le Mandataire.', style: 'bold'},

        {style: 'bigLineBreak', text: ''},

        {text: 'Le fichier des intermédiaires en opérations de banque et en services de paiement est consultable sur le site de l\'Orias, www.orias.fr.'},
        {style: 'bigLineBreak', text: ''},
        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 }]},
     ];
      return aContact;
    }


    encodeChargesBeforeAfter() {
        const decodedPersons = this.decodePersons(this.aCase, false);

        const chargesInfo = [];
        if (this.aCase && this.aCase.actor && this.aCase.actor.finance) {
            const charges = this.formatChargesTable(this.aCase.actor.finance.charges);
            const noCharges = charges ? '' : 'Aucunes';
            chargesInfo.push({style: 'bigLineBreak', text: ''});

            // ACTOR
            if (this.aCase.actor && this.aCase.actor.type === 'LEGAL_PERSON') {
              chargesInfo.push({style: 'h3', text: 'Charges financière de la Personne morale avant projet: ' + noCharges});
            }
            if (this.aCase.actor && this.aCase.actor.type === 'HOUSEHOLD') {
              chargesInfo.push({style: 'h3', text: 'Charges financière du Ménage avant projet: ' + noCharges});
            }

            chargesInfo.push({style: 'smallLineBreak', text: ''});
            if (charges) {
              chargesInfo.push(this.formatChargesTable(this.aCase.actor.finance.charges));
            }
            chargesInfo.push({style: 'bigLineBreak', text: ''});
          }

          // PERSONS
          if (this.aCase && this.aCase.actor && this.aCase.actor.persons) {
            this.aCase.actor.persons.forEach( (person, index) => {
                if (this.aCase.actor.type === 'LEGAL_PERSON' || (this.aCase.actor.type === 'HOUSEHOLD' && person.is_borrower === true && person.finance)) {
                  chargesInfo.push({style: 'h3', text: 'Charges financières de ' + decodedPersons[index].courtesy + ' ' + decodedPersons[index].firstName + ' ' + decodedPersons[index].lastName + ' avant projet:'});
                  chargesInfo.push({style: 'smallLineBreak', text: ''});
                  chargesInfo.push((this.formatChargesTable(person.finance.charges) === null ? {text: 'Aucune.'} : this.formatChargesTable(person.finance.charges)));
                  chargesInfo.push({style: 'bigLineBreak', text: ''});
                }
              });
          }

        return chargesInfo;
    }


    encodeBrokerFees() {
      const aContent = [
            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},
            {style: 'h3bold', text: 'Rémunération du mandataire'},
            {style: 'bigLineBreak', text: ''},
            {text: 'Le Mandant reconnaît devoir au Mandataire, en rémunération de sa mission, la somme de _______________ euros sous forme de frais de dossier. Cette somme ne devra être versée au Mandataire qu\'après le déblocage des fonds conformément à la réglementation en vigueur (frais de dossier exonérés de TVA).', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Loi MURCEF : Article L 321-2 de la loi n°2001-1168 du 11 Décembre 2001: "Aucun versement, de quelque nature que ce soit, ne peut être exigé d\'un particulier, avant l\'obtention d\'un ou plusieurs prêts d\'argent"', alignment: 'justify'},
            {text: 'Par ailleurs la banque versera au Mandataire une commission bancaire fixée suivant la convention de partenariat signée.', alignment: 'justify'}
       ];

       return aContent;
    }



    encodeChargesRecap() {
      const aPlanSummary = LoanUtils.generateFundingSummary(this.aParams, this.aResults);
      const aContent = [
            {style: 'h3bold', text: 'Récapitulatif des dépenses mensuelles du (ou des) emprunteur(s)'},
            ...this.encodeChargesBeforeAfter(),
            {style: 'bigLineBreak', text: ''},
            {style: 'h3', text: 'Auxquelles s\'ajoute après projet une mensualité maximale de: ' + this.formatMonetaryNbr(this.summary.effective_maximal_monthly_payment) + ', à répartir entre les différents emprunteurs.'},
            {style: 'smallLineBreak', text: ''},
            {style: 'h3', text: 'Pour un reste à vivre minimal de: ' + this.formatMonetaryNbr(aPlanSummary.remaining_for_living) + ', à partager entre les différents emprunteurs.'},
       ];

       return aContent;
    }


    encodeClientAgreement() {
      const aContent = [
            {style: 'h3bold', text: 'Accord du Mandant sur la proposition obtenue'},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3', text: 'Le Mandant reconnaît que le Mandataire lui a fourni toutes les informations nécessaires à la compréhension et la comparaison des différents types de contrats disponibles sur le marché.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant certifie qu\'un nombre suffisant de simulations lui ont été présentées pour fonder un choix éclairé.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant reconnaît avoir disposé de toutes les informations nécessaires pour faire son choix de financement et déclare connaître et accepter les caractéristiques de l\'accord de prêt(s) obtenu.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant reconnaît avoir été informé des règles applicables aux opérations de banque et de l\'étendue de ses devoirs et obligations en tant qu\'emprunteur(s).', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant autorise le Mandataire à informer le vendeur ou son intermédiaire de l\'accord de prêt obtenu.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Les impayés afférents au(x) crédit(s) sollicité(s) peuvent avoir de graves conséquences sur votre patrimoine et vous pourriez être redevable(s), à l\'égard de la banque, du capital restant dû, majoré d\'intérêts de retard, ainsi que d\'une indemnité.', alignment: 'justify'}
       ];
       return aContent;
    }


    encodeInsuranceAnnex(annex) {

        const aPreparedInsuranceSummary = {
            style: 'table',
            margin: [0, 0, 0, 0],
            headerRows: 1,
            widths: ['auto'],
            table: {
                body: [
                    LoanUtils.summaryInsuranceTableHeader.map(
                        v => ({style: 'thead', text: v, alignment: 'center'})
                    )
                ]
            }
        };

        const insurancesRecap = (this.aResults && this.aResults.loans) ? LoanUtils.generateInsurancesRecap(this.aResults.loans) : [];

        let aInsuranceSummary = null;
        if (insurancesRecap.length) {
          aInsuranceSummary = aPreparedInsuranceSummary;
          aInsuranceSummary.table.body.push(...insurancesRecap);
        }

      const aContent = [
            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},
            {style: 'h3centerbold', text: 'Annexe ' +  annex + ': ASSURANCES'},
            {style: 'bigLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Le Client n\'a pas recours au service d\'intermédiation en assurances qui lui a été proposé. Il fait le choix de prendre en charge seul la recherche d\'une solution d\'assurance. Il est informé que l\'établissement de crédit est tenu de lui remettre une fiche standardisée d\'information portant sur les critères de couverture exigés par l\'établissement de crédit, le taux annuel effectif de l\'assurance (TAEA) applicable, le montant de la cotisation et le coût total de la protection, lui permettant ainsi de comparer les différentes offres du marché.', alignment: 'justify', width:'95%', margin: [ 5, 0, 0, 0 ] } ] },
            {style: 'bigLineBreak', text: ''},
            this.generateSignatureSection(false),
            {style: 'bigLineBreak', text: ''},
            {style: 'bold', text: 'La solution d\'assurance que vous envisagez :', alignment: 'justify'},
            {style: 'bigLineBreak', text: ''},
            {text: 'Compte tenu des besoins exprimés par le Client, nous vous proposons le contrat d\'Assurance avec les caractéristiques suivantes :', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            { columns: [ aInsuranceSummary ] },

            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},

            {text: 'Le Client reconnaît avoir reçu et pris connaissance d\'une fiche standardisée d\'information portant sur les critères de couverture exigés par l\'établissement de crédit, le taux annuel effectif de l\'assurance (TAEA) applicable, le montant de la cotisation et le coût total de la protection, lui permettant ainsi de comparer les différentes offres du marché.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Aussi précis que soient les informations et les conseils donnés, il est très important que vous lisiez attentivement la notice de votre contrat d\'assurance emprunteur qui vous sera remise au moment de votre adhésion/souscription. Cette notice constitue le document juridique contractuel exprimant les droits et obligations de l\'assuré et de l\'assureur.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Nous attirons votre attention sur les paragraphes de la notice consacrés notamment aux risques exclus, à la durée d\'adhésion/souscription de votre contrat, aux délais de carence (période durant laquelle l\'assuré ne peut pas demander la mise en œuvre de la garantie), de franchise (période durant laquelle le sinistre reste à la charge de l\'assuré), aux définitions des garanties, les risques assurés et les dates d\'expirations de ces garanties date d\'expiration.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Nous insistons sur l\'importance de la précision et de la sincérité des réponses apportées au questionnaire d\'adhésion/ souscription au contrat d\'assurance emprunteur, y compris la partie questionnaire médical. Une fausse déclaration intentionnelle entraînerait la nullité du contrat et la déchéance de la garantie.', alignment: 'justify'},
            {style: 'smallLineBreak', text: ''},
            {style: 'bold', text: 'La cotisation de(s) l\'assurance(s) est:', alignment: 'justify', decoration: 'underline'},
            {style: 'smallLineBreak', text: ''},
            { columns: [
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Constante', alignment: 'justify', width:'20%', margin: [ 5, 0, 0, 0 ] },
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Non constante', alignment: 'justify', width:'20%', margin: [ 5, 0, 0, 0 ] },
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Dégressive', alignment: 'justify', width:'20%', margin: [ 5, 0, 0, 0 ] },
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Progressive', alignment: 'justify', width:'20%', margin: [ 5, 0, 0, 0 ] },
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Garantie sur toute la durée du prêt', alignment: 'justify', width:'95%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Révisable dans les conditions suivantes', alignment: 'justify', width:'95%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'Suite à une reprise de la consommation du tabac', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'Suite à un changement de situation', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'Suite à un changement de domicile', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'Suite à la pratique de nouvelles activités (professionelles ou sportives)', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            { columns:  [
              {...this.generateSquare('black'), alignment: 'right', width:'15%' }, {text: 'En cas de déficit du contrat groupe (réajustement tarifaire)', alignment: 'justify', width:'75%', margin: [ 5, 0, 0, 0 ] }
            ] },
            {style: 'smallLineBreak', text: ''},
            {text: 'Le coût total de l\'assurance emprunteur sur la durée du prêt est précisé ci-dessus. Il inclue le montant des éventuels frais annexes liés à l\'assurance (frais de dossier, …). Il s\'agit d\'un tarif indicatif avant examen du dossier et du questionnaire médical par le service médical de l\'assureur et hors cas de surprime. Lorsqu\'une personne présente un risque aggravé de santé, les garanties et le tarif doivent être adaptés. Dans ce cas, les dispositions de la convention AERAS, s\'Assurer et Emprunter avec un Risque Aggravé de Santé, sont appliquées (cf. www.aeras-infos.fr)', alignment: 'justify'},

            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},

            {style: 'bold', text: 'Le Client déclare et reconnaît: ', alignment: 'justify', decoration: 'underline'},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Que la prestation d\'assurance proposée correspond à ses exigences et besoins au regard des informations reçues et fournies,'},
                {style: 'smallLineBreak', text: ''},
                { text: 'Avoir reçue une information sur l\'étendue et la définition des garanties proposées,'},
                {style: 'smallLineBreak', text: ''},
                { text: 'Avoir pris connaissance et être en possession des conditions générales d\'assurance de prêt.'},
              ]
            },
            {style: 'bigLineBreak', text: ''},
            {text: 'Il reconnaît avoir pris connaissance du contenu du présent document préalablement à la signature du contrat d\'assurance proposé ci-dessus et en avoir reçu un exemplaire.'},
            this.generateSignatureSection(true, 'Bon pour accord'),
       ];
       return aContent;
    }


    encodeBody() {
        const aSummary = {
            style: 'table',
            margin: [0, 0, 0, 0],
            headerRows: 1,
            widths: ['auto'],
            table: {
                body: [
                    LoanUtils.summaryTableHeader.map(
                        v => ({style: 'thead', text: v, alignment: 'center'})
                    )
                ]
            }
        };

        const aPreparedInsuranceSummary = {
            style: 'table',
            margin: [0, 0, 0, 0],
            headerRows: 1,
            widths: ['auto'],
            table: {
                body: [
                    LoanUtils.summaryInsuranceTableHeader.map(
                        v => ({style: 'thead', text: v, alignment: 'center'})
                    )
                ]
            }
        };

        const loansRecap = LoanUtils.generateLoanRecap(this.aResults.loans).loansRecap;
        const insurancesRecap = LoanUtils.generateInsurancesRecap(this.aResults.loans);
        const taegs = this.generateTaegSection(this.aResults.taegs);


        aSummary.table.body.push(...loansRecap);

        let aInsuranceSummary = null;
        if (insurancesRecap.length) {
          aInsuranceSummary = aPreparedInsuranceSummary;
          aInsuranceSummary.table.body.push(...insurancesRecap);
        }

        const aContent = [
            {text: '', pageOrientation: 'landscape', pageBreak: 'after'},
            {style: 'h3centerbold', text: 'Proposition de financement obtenue'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant reconnaît avoir obtenu par l\'intermédiaire du Mandataire l\'accord de principe de la banque «BanqueRaison» pour la réalisation du plan de financement suivant: '},
            {style: 'bigLineBreak', text: ''},
            { columns: [ { width: '15%', text: '' }, aSummary, { width: '*', text: '' } ] },
            {style: 'smallLineBreak', text: ''},
            {text: 'Note: la caution (ou garantie) permet au prêteur d\'obtenir le remboursement partiel ou complet du montant du crédit en cas de défaut de paiement de l\'emprunteur.'},
            {style: 'bigLineBreak', text: ''},
            { columns: [ { width: '20%', text: '' }, aInsuranceSummary, { width: '*', text: '' } ] },
            {style: 'bigLineBreak', text: ''},
            ...taegs,
            {style: 'bigLineBreak', text: ''},
            {text: 'Les éléments indiqués sont susceptibles d\'être modifiés par l\'établissement bancaire. Ils seront mentionnés de manière définitive dans l\'offre de prêt.'},


            {text: '', pageOrientation: 'portrait', pageBreak: 'after'},
            {style: 'h3bold', text: 'Conditions de validité de l\'accord de principe de la banque'},
            {style: 'smallLineBreak', text: ''},

            {text: 'L\'accord de principe de la banque a été émis pour une durée de _________ jours et sous réserve de satisfaire les conditions suivantes :'},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Ouverture de compte', alignment: 'center', width:'25%'}, {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Domiciliation des revenus', alignment: 'center', width:'25%'} ] },
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: '_______________________________________________________________________________________________________________'},
                {style: 'smallLineBreak', text: ''},
                { text: '_______________________________________________________________________________________________________________'},
                {style: 'smallLineBreak', text: ''},
                { text: '_______________________________________________________________________________________________________________'},
                {style: 'smallLineBreak', text: ''},
                { text: '_______________________________________________________________________________________________________________'},
              ]
            },
            {style: 'bigLineBreak', text: ''},
            {text: 'En cas de remboursement anticipé du ou des crédit(s) sollicité(s), le Mandant pourra être redevable à l\'égard de la banque, d\'une indemnité décrite dans l\'offre de prêt(s).'},

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            ...this.encodeChargesRecap(),

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            ...this.encodeBrokerFees(),

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            ...this.encodeClientAgreement(),

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            this.generateSignatureSection(true, 'Bon pour accord')

        ];
        return aContent;
    }



    content(): any {
        return [
            ...this.encodeAdviceHeader('Fiche conseil', this.iconUser),
            ...this.encodeBody(),
            ...this.encodeInsuranceAnnex('1')
        ];
    }



}
