import { Injectable } from '@angular/core';
import { Case, Budget, BudgetParameters, BudgetResults, Individual, LegalPerson, Partner, ActivePartner, FundingResults, Taeg, SmoothableCharge, BridgeLoan, AvailableLoan, Loan } from '../../_api/model/models';
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
export class MandatePDFExportService extends PDFExportService {

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


    exportToPDF(caseId: string, caseName: string, aCaseForm: CaseFormService, totalCost, loansAmountToFund, aPartners: ActivePartner[], iconUser: any): any {

        this.aCase = aCaseForm.asCase();
        this.aCaseForm = aCaseForm;
        this.caseId = caseId;
        this.caseName = caseName;
        this.iconUser = iconUser;
        this.aPartners = aPartners;
        this.totalCost = totalCost;
        this.loansAmountToFund = loansAmountToFund;

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


    retrieveBankInfo() {
      const decodedPersons = this.decodePersons(this.aCase);
      const aBankInfo = [];
      // Actor level
      if (this.aCase && this.aCase.actor && this.aCase.actor.type === 'HOUSEHOLD' &&  this.aCase.actor.bank_info && (this.aCase.actor.bank_info.current_bank || this.aCase.actor.bank_info.current_agency)) {
        aBankInfo.push({text : this.formatFldAsString(this.aCase.actor.bank_info.current_bank) + ' ' + this.formatFldAsString(this.aCase.actor.bank_info.current_agency) });
      }
      // Persons level
      decodedPersons.forEach( (decodedPerson) => {
          if (decodedPerson && decodedPerson.bank_info && (decodedPerson.bank_info.bank || decodedPerson.bank_info.agency)) {
            aBankInfo.push({text : this.formatFldAsString(decodedPerson.bank_info.bank) + ' ' + this.formatFldAsString(decodedPerson.bank_info.agency) });
          }
        }
      )
      if (aBankInfo.length === 0)
      {
         aBankInfo.push({text : 'Banque actuelle non renseignée' });
      }
      return aBankInfo;
    }


    // Encode the contact section into PDF format
    encodeMandateHeader(title: any, iconUser: any) {
      const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners, false);
      const aBrokerRepresenting = this.extractPartnerContact('BROKER', this.aPartners, true);
      const aDestinationContact = this.generateDestinationContact()

      // Format broker name depending if we have or not the courtesy
      const brokerName = this.formatContactName(aBrokerPartner);
      // Format broker name depending if we have or not the courtesy
      const representantName = this.formatContactName(aBrokerRepresenting);

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
        {text: 'Le(s) sousigné(s):'},
        {style: 'bigLineBreak', text: ''},
        ...aDestinationContact,
        {style: 'bigLineBreak', text: ''},
        {text: 'Ci-après indifféremment dénommés conjointement le Client ou Mandant,', style: 'bold'},
        {style: 'bigLineBreak', text: ''},
        {text: 'Donne(nt) mandat à:', style: 'bold'},
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


    encodePreliminary() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Préambule'},
            {style: 'smallLineBreak', text: ''},

            {text: 'En qualité d\'Intermédiaire en Opérations de Banque et Services de Paiement, le Mandataire :', style: 'bold'},
            {
              ul: [
                { text: 'Est régi par les articles L519-1 à L519-6 du Code monétaire et financier et les décrets et arrêtés subséquents qui sont liés,' },
                { text: 'Respecte les dispositions du Code Monétaire et Financier, issues du décret n°2012-101, relatif au statut des IOBSP, notamment quant à l\'ensemble des informations à fournir au Mandant ; fait l\'objet d\'une supervision de l\'Autorité de Contrôle Prudentiel et de Résolution (ACPR) dont l\'adresse est la suivante : 4 place de Budapest CS 92459 75436 PARIS CEDEX 09 - site : www.acpr.banque-france.fr, tel : 01.49.95.40.00,' },
                { text: 'Certifie n\'être soumis à aucune obligation contractuelle de travailler avec un ou plusieurs établissements de crédits, et déclare ne pas être détenu et ne pas détenir de droit de vote ou du capital d\'un établissement de crédits,' },
                { text: 'Déclare qu\'aucun établissement de crédit ou de paiement ne détient plus de 10% de son capital ou de droits de vote,' },
                { text: 'Déclare qu\'il ne détient pas plus de 10% du capital ou des droits de vote d\'un établissement de crédit ou de paiement,' },
                { text: 'Déclare ne pas avoir enregistré, avec un établissement de crédits, au cours de l\'année précédente, une part supérieure au tiers de son chiffre d\'affaires au titre de l\'activité d\'intermédiation,' },
                { text: 'Met à disposition la liste des établissements de crédits ou de paiement avec lesquels il travaille, ainsi que les conditions de sa rémunération.' },
              ]
            },
        ];

        return aContent;
    }


    encodeArticle1() {
        const projectType = (this.aCase && this.aCase.project && this.aCase.project.type) ? ProjectStringMap.toString(this.aCase.project.type).toLowerCase() : '';
        const projectAddress = (this.aCase && this.aCase.project && this.aCase.project.administrative_information && this.aCase.project.administrative_information.address) ? this.formatAddress(this.aCase.project.administrative_information.address.address, this.aCase.project.administrative_information.address.postal_code, this.aCase.project.administrative_information.address.city, this.aCase.project.administrative_information.address.country) : '';
        const borrowerBanks = this.retrieveBankInfo();

        const totalAskedLoans = (this.aCase && this.aCase.project && this.aCase.project.type && this.aCase.project.type !== 'BUDGET') ? { text: 'Montant total du (des) crédit(s) demandé(s): ' + LocaleUtils.toLocale(this.loansAmountToFund, 'EUR')} : {};
        const acquisitionCost = (this.aCase && this.aCase.project && this.aCase.project.type && this.aCase.project.type !== 'BUDGET') ? { text: 'Coût d\'acquisition (frais éventuels d\'agence et de notaire inclus): ' + LocaleUtils.toLocale(this.totalCost, 'EUR') } : {};

        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 1: Objet du mandat'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant confère au Mandataire pouvoir de rechercher, au nom et pour le compte du Mandant, un financement bancaire dont les caractéristiques sont les suivantes: '},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Opération à financer: ' + projectType},
                { text: 'Adresse du bien: ' + projectAddress },
                acquisitionCost,
                totalAskedLoans,
              ]
            },
            {style: 'smallLineBreak', text: ''},
            {text: 'Le montant et les caractéristiques exactes du (des) crédit(s) proposés pourront varier selon l\'établissement bancaire sollicité ou en cas de besoin.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'La demande de prêt est conforme aux volontés du Client. Elle est formulée sous sa seule responsabilité.'},
            {text: 'Aux vues des négociations, le Mandataire pourra proposer de modifier les caractéristiques du prêt envisagé afin de répondre au mieux au besoin de financement, et ce en diminuant ou augmentant le montant et/ou la durée du prêt sans qu\'il soit nécessaire, d\'établir une nouvelle convention de recherche en capitaux.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandant mandate le Mandataire pour solliciter toutes les banques, y compris la ou les propre(s) banque(s) du Mandant, à savoir:'},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                ...borrowerBanks
              ]
            },
            {style: 'smallLineBreak', text: ''},
            {text: 'Origine du dossier: ' , style: 'h3bold'},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Direct', alignment: 'left', width:'25%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Publicité', alignment: 'left', width:'25%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Internet', alignment: 'left', width:'25%', margin: [ 5, 0, 0, 0 ] }
            ]},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Parrainage', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Nom:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Prénom:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
            ]},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Apporteur', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Nom:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Prénom:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Société:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
            ]},
            {style: 'smallLineBreak', text: ''},
            { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Autre', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },
                         {...this.generateSquare('white'), alignment: 'right', width:'5%'}, {text: 'Source:', alignment: 'left', width:'18%', margin: [ 5, 0, 0, 0 ] },

            ]},
        ];
        return aContent;
    }


    encodeArticle2() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 2: Obligation du Mandant'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant déclare que rien, dans sa situation juridique et dans sa capacité bancaire, ne s\'oppose à sa demande de financement.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Afin de permettre au Mandataire de mener à bien la mission confiée aux termes du présent mandat, le Mandant s\'engage à :'},

            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Fournir au Mandataire toutes les pièces et tous les renseignements nécessaires à l\'instruction de son dossier, portant notamment sur ses ressources, ses charges, ses crédits en cours et son patrimoine existant au jour de la demande de financement, et ce aux fins de réalisation de l\'étude de solvabilité,'},
                { text: 'Communiquer au Mandataire pendant toute la durée du mandat, toutes informations complémentaires et l\'informer de toute modification susceptible d\'affecter sa situation financière,'},
                { text: 'garantir l\'exactitude, la conformité et l\'authenticité des documents et renseignements confiés,'},
                { text: 'Autoriser l\'établissement de crédit - partenaire du Mandataire - à communiquer toutes les informations le concernant et couvertes par le secret professionnel bancaire au Mandataire, dans le cadre de l\'exécution du présent mandat et de la convention entre l\'établissement et le Mandataire, et que l\'ensemble des informations constituant son dossier puisse être transmis d\'un service à un autre au sein de l\'établissement de crédit,'},
                { text: 'Autoriser le Mandataire à informer le vendeur, l\'agence immobilière et le notaire, du dépôt de demande(s) de prêt(s) et de l\'obtention du ou des accord(s) de financement,'},
                { text: 'Informer le Mandataire s\'il est inscrit dans le Fichier National des Incidents de Remboursement des Crédits aux Particuliers (FICP).'},
              ]
            },
        ];
        return aContent;
    }


    encodeArticle3() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 3: Obligation du Mandataire'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Dans le cadre de son obligation de moyens, le Mandataire s\'engage à :'},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Etudier avec sincérité et loyauté la demande du Mandant et agir au mieux de ses intérêts,'},
                { text: 'Sélectionner l\'établissement de crédit le plus approprié en fonction des intérêts et des attentes exprimés par le Mandant,'},
                { text: 'Déposer le dossier de demande de prêt, auprès d\'au moins un établissement de crédit, dans un délai de 7 jours suivant sa complète constitution.'},
              ]
            },
            {style: 'smallLineBreak', text: ''},
            {text: 'La liste des établissements partenaires du Mandataire est disponible sur demande.'},

        ];
        return aContent;
    }


    encodeArticle4() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 4: Rémunération du mandataire'},
            {style: 'smallLineBreak', text: ''},

            {text: 'En rémunération de la mission confiée, le Mandant s\'engage à verser au Mandataire, la somme de ____________ euros sous forme de frais de dossier.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Cette somme est exigible le jour où l\'opération objet du présent mandat sera effectivement réalisée. Toutefois, conformément aux dispositions de l\'article L.519-6 du Code monétaire et financier, le Mandataire ne pourra la percevoir avant le déblocage effectif des fonds par l\'organisme préteur.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Loi MURCEF : Article L 321-2 de la loi n°2001-1168 du 11 Décembre 2001 : « Aucun versement, de quelque nature que ce soit, ne peut être exigé d\'un particulier, avant l\'obtention d\'un ou plusieurs prêts d\'argent ».'},
        ];
        return aContent;
    }


    encodeArticle5() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 5: Durée du mandat'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le présent mandat prend effet à compter du jour de sa signature pour une durée indéterminée. Il prend fin dès l\'acceptation par le Mandant d\'une offre de prêt émise par l\'un des établissements bancaires ou financiers sollicités par le Mandataire. Il peut être dénoncé par l\'une ou l\'autre des parties avec un préavis de quinze jours donné par lettre recommandée avec accusé de réception.'},
        ];
        return aContent;
    }


    encodeArticle6() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 6: Informations au Mandant'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandataire informe le Mandant qu\'aucune demande de crédit ne pourra être transmise si toutes les pièces nécessaires à la constitution du dossier ne lui sont pas remises. A ce titre, le Mandant certifie avoir reçu du Mandataire la liste des pièces nécessaires à la constitution de la demande de financement.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'L\'activité d\'intermédiaire en crédit n\'est constitutive que d\'une obligation de moyen. Seuls les établissements bancaires sollicités peuvent décider de l\'octroi du ou des crédit(s) sollicité(s) et des conditions afférentes, qui peuvent varier selon leur seule volonté. Le mandataire ne garantit pas les délais d\'étude et de réponse des établissements bancaires. Le Mandataire n\'est pas tenu par les délais imposés au mandant dans le cadre d\'une promesse d\'achat.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandataire ne saurait être déclaré responsable de la différence entre le montant inscrit dans le compromis de vente et les conditions du présent mandat.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'L\'obtention du crédit suppose de contracter une assurance liée au crédit.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Les impayés afférents au(x) crédit(s) sollicité(s) peuvent avoir de graves conséquences sur votre patrimoine et vous pourriez être redevable(s), à l\'égard de la banque, du capital restant dû, majoré d\'intérêts de retard, ainsi que d\'une indemnité.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'En application des articles L 333-4 et L 333-5 du code de la consommation, les incidents de paiement caractérisés font l\'objet d\'une inscription au fichier des incidents de remboursement des crédits aux particuliers (FICP) géré par la Banque de France.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'En matière de crédit immobilier, l\'emprunteur dispose d\'un délai de réflexion de 10 jours après réception de l\'offre de prêt émise par l\'établissement bancaire pour donner son accord.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'En matière de crédit à la consommation, l\'emprunteur dispose d\'un délai de 14 jours calendaires pour revenir sur son engagement vis-à-vis du contrat de crédit. La mise à disposition des fonds peut être demandée à partir du 8ème jour sans que cela ne réduise le délai de rétractation.' },
        ];
        return aContent;
    }


    encodeArticle7() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 7: Traitement des données à caractère personnel - Informations et libertés'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Les données personnelles concernant le Mandant, recueillies pour les besoins dont la finalité est liée à l\'exécution du Mandat, font l\'objet d\'un traitement informatique destiné à remplir les obligations issues du présent Mandat. Le destinataire direct de ces données est le Mandataire, notamment tenu de répondre sincèrement aux demandes des établissements de crédit contactés.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Ces données font l\'objet de communication extérieure par le seul Mandataire, pour les seules nécessités d\'exécution du présent contrat ou d\'exigences légales et réglementaires (art. L. 561-1 et suivants du Code monétaire et financier, en particulier), dans le respect du Règlement (UE) 2016/679 du Parlement Européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l\'égard du traitement des données à caractère personnel et à la libre circulation de ces données (Règlement Général sur la Protection des Données ou « RGPD »).'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant, justifiant de son identité, bénéficie d\'un droit permanent d\'accès, de rectification, d\'effacement (droit à l\'oubli), d\'opposition, de limitation du traitement, à la portabilité de ses données personnelles (art. 39, Loi n°78-17 du 6 janvier 1978, modifiée). Le Mandant souhaitant exercer ce droit et obtenir communication des informations le concernant, s\'adresse au Mandataire, soit par simple courrier à l\'adresse postale figurant au début de ce document, soit par email, à l\'adresse email figurant au début de ce document.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Conformément aux dispositions régissant la conservation des données à caractère personnel et en regard de la nature des opérations de banque, ces données personnelles sont conservées dix (10) années à compter de la date de signature du contrat (articles L. 213-1, R. 213-2 du Code de la consommation).' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Vous pouvez également définir des directives relatives à la conservation, à l\'effacement et à la communication de vos données à caractère personnel après votre décès.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Le Mandant peut, pour des motifs légitimes, s\'opposer au traitement des données le concernant.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'Sous réserve d\'un manquement aux dispositions ci-dessus, le mandant a le droit d\'introduire une réclamation auprès de la CNIL.' },
            {style: 'smallLineBreak', text: ''},

            {text: 'En exprimant son accord au Mandat, le Mandant autorise le Mandataire, à collecter, à utiliser et à conserver les données personnelles transmises par lui, à communiquer à tout établissement de crédit toutes les informations et données personnelles le concernant, même celles couvertes par le secret professionnel bancaire, conformément aux prévisions de l\'article L. 511-33 du Code monétaire et financier et dans le cadre de l\'exécution du présent Mandat.' },
        ];
        return aContent;
    }


    encodeArticle8() {
        const aContent = [
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 8: Réclamations, contentieux et attribution de compétence'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Pour toute réclamation, le Mandant peut s\'adresser par courrier à l\'adresse postale figurant au début de ce document, soit par email, à l\'adresse email figurant au début de ce document.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Sauf difficulté particulière liée à la réclamation, le Mandataire s\'engage à répondre au Mandant :'},
            {style: 'smallLineBreak', text: ''},
            {
              ul: [
                { text: 'Dans les dix jours ouvrables à compter de la réception de la réclamation, pour en accuser réception, sauf si la réponse elle même est apportée au client dans ce délai,'},
                { text: 'Dans les deux mois entre la date de réception de la réclamation et la date d\'envoi de la réponse au client.'},
              ]
            },
            {style: 'smallLineBreak', text: ''},
            {text: 'Sans réponse satisfaisante, le Mandant pourra avoir recours au Médiateur du crédit via le site internet suivant : www.anm-conso.com/, par voie postale : ANM Conso – 62, rue Tiquetonne – 75002 PARIS, par téléphone au 01.42.33.81.03, par mail contact@ANM-MEDIATION.COM. La médiation est une procédure gratuite pour le Mandant.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Le présent mandat est soumis au droit français.'},
            {style: 'smallLineBreak', text: ''},

            {text: 'En cas de litige à l\'occasion de l\'interprétation ou de l\'exécution du présent mandat, les parties s\'efforceront de le régler à l\'amiable préalablement à toute action en justice.'},
        ];

        return aContent;
    }


    encodeArticle9() {
        const question1 = 'Avez-vous déjà souscrit un crédit immobilier dans votre vie ?';
        const question2 = 'Avez-vous déjà souscrit un autre crédit dans votre vie ?';
        const question3 = 'Connaissez-vous la signification de T.A.E.G ?';
        const question4 = 'Connaissez-vous la différence entre un crédit à taux fixe et à taux révisable ?';
        const question5 = 'Savez-vous à quoi sert l\'assurance emprunteur ?';
        const question6 = 'Selon vous, votre connaissance en matière de crédit est plutôt :';

        const yesNo = 'Oui   Non';
        const lowMediumHigh = 'Faible   Moyenne   Haute';

        const aAnswersVector = [];

        const decodedPersons = this.decodePersons(this.aCase, false);
        decodedPersons.forEach( (decodedPerson) => {
            if (decodedPerson) {
              aAnswersVector.push([decodedPerson.courtesy + ' ' + decodedPerson.firstName + ' ' + decodedPerson.lastName, yesNo, yesNo, yesNo, yesNo, yesNo, lowMediumHigh]);
            }
        });

        const aContent = [
            {style: 'bigLineBreak', text: '', pageOrientation: 'landscape', pageBreak: 'before'},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 9: Evaluation de vos connaissances en matière de crédit'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Entourez la réponse que vous choisissez pour chacune des questions.'},
            {style: 'smallLineBreak', text: ''},
            {
              style: 'tablecenter',
              table: {
                body: [
                  ['', question1, question2, question3, question4, question5, question6],
                  ...aAnswersVector
                ]
              }
            },

        ];

        return aContent;
    }



    encodeArticle10(generationDate) {

        const aContent = [
            {style: 'bigLineBreak', text: '', pageOrientation: 'portrait', pageBreak: 'before'},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {style: 'h3centerbold', text: 'Article 10: Liste des annexes'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Annexe 1: Informations générales sur les contrats de crédit'},
            {text: 'Annexe 2: Liste des pièces à fournir par le Mandant'},
            {text: 'Annexe 3: Léxique du crédit'},
            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},
            {text: 'Fait en deux exemplaires à __________________________________________________________________, le ' + generationDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(',', ' à') + '.'},
            {style: 'bigLineBreak', text: ''},
            this.generateSignatureSection(true, 'Bon pour acceptation du mandat')
        ];

        return aContent;
    }

    encodeMainFirstPart() {
        const aContent = [
          ...this.encodePreliminary(),
          ...this.encodeArticle1(),
          ...this.encodeArticle2(),
          ...this.encodeArticle3(),
          ...this.encodeArticle4(),
          ...this.encodeArticle5(),
          ...this.encodeArticle6(),
          ...this.encodeArticle7(),
          ...this.encodeArticle8(),
          ...this.encodeArticle9(),
          ...this.encodeArticle10(this.currentDate),
        ];

        return aContent;
    }


    generateDefinition(toDefine: any, definition: any) {
        const aDefinition = { text: [
            { text: toDefine, style: 'h4bold', decoration: 'underline' },
            { text: ' ' + definition, style: 'h4'},
        ] };
        return aDefinition;
    }


    encodeCreditLexic(annexNumber) {
        const definitions = [];
        const toDefine1 = 'Amortissement (du capital):';
        const definition1 = 'Pour un emprunt, l\'amortissement est le capital qui est remboursé à chaque échéance. Par extension, on parle de période d\'amortissement (par exemple après une période de différé) quand le capital du crédit commence réellement à être remboursé.';
        definitions.push([toDefine1, definition1]);

        const toDefine2 = 'Amortissement constant:';
        const definition2 = 'Sur un crédit à amortissement constant, la même somme de capital est remboursée à chaque échéance. Le montant des échéances (capital + intérêts) diminue donc avec le temps. Au contraire, si le montant de l\'échéance est fixe, il s\'agit d\'un crédit à échéances constantes.';
        definitions.push([toDefine2, definition2]);

        const toDefine3 = 'Amortissement négatif:';
        const definition3 = 'Se dit lorsque les intérêts calculés sont supérieurs au montant de l\'échéance payée. aucun capital n\'est remboursé. Au contraire, la différence entre le montant des intérêts et le montant de l\'échéance s\'ajoute au capital restant dû.';
        definitions.push([toDefine3, definition3]);

        const toDefine4 = 'Amortissement in fine:';
        const definition4 = 'crédit dont le remboursement du capital est effectué seulement sur la dernière échéance.';
        definitions.push([toDefine4, definition4]);

        const toDefine5 = 'Assurance emprunteur (ou assurance crédit):';
        const definition5 = 'Cette assurance, dont le prêteur est le bénéficiaire, a pour but de garantir le prêteur en cas de décès ou d\'invalidité de l\'emprunteur. Les garanties « décès » et « invalidité totale » sont pratiquement toujours exigées par les banques pour un crédit immobilier. La garantie « invalidité partielle temporaire » est fortement recommandée si le prêt vise l\'acquisition de la résidence principale. La « garantie chômage », optionnelle, couvre le remboursement total des échéances (pour les meilleurs contrats), ou partiel et progressif eu égard à la dégressivité des ASSEDIC.';
        definitions.push([toDefine5, definition5]);

        const toDefine6 = 'Cap de taux:';
        const definition6 = 'Plafonnement de la hausse du taux d\'intérêt en cas de crédit à taux variable. Ce plafonnement peut être exprimé en valeur absolue (par exemple 4,50 %), ou en valeur relative (par exemple taux initial + 2 %]. Les conditions de ce plafonnement (indice, niveau, durée et modalités) sont définies par le contrat et peuvent inclure également un taux plancher (« floor » ou taux minimum) limitant la variation du taux à la baisse. La combinaison d\'un taux plancher et un taux plafond donne un tunnel d\'évolution du taux.';
        definitions.push([toDefine6, definition6]);

        const toDefine7 = 'Capital:';
        const definition7 = 'Montant du crédit consenti par le prêteur. Le capital peut être versé en une ou plusieurs fois.';
        definitions.push([toDefine7, definition7]);

        const toDefine8 = 'Capital restant dû:';
        const definition8 = 'Montant du capital restant à rembourser par l\'emprunteur à une date donnée. Il sert de base au calcul des intérêts de l\'échéance à venir. Dans un contrat à taux variable, le prêteur est tenu, une fois par an, de porter à la connaissance de l\'emprunteur le montant du capital restant à rembourser.';
        definitions.push([toDefine8, definition8]);

        const toDefine9 = 'Charges financières:';
        const definition9 = 'Elles comprennent les échéances de remboursement de prêts, les primes d\'assurance obligatoirement liés, les loyers et les pensions versées.';
        definitions.push([toDefine9, definition9]);

        const toDefine10 = 'Crédit- relais:';
        const definition10 = 'Crédit généralement in fine accordé dans l\'attente d\'une rentrée certaine d\'argent, notamment, lors de la vente d\'un bien immobilier. La banque peut demander ou pas le paiement des intérêts pendant la durée du crédit.';
        definitions.push([toDefine10, definition10]);

        const toDefine11 = 'Différé partiel (d\'amortissement):';
        const definition11 = 'Période pendant laquelle l\'emprunteur ne rembourse aucun capital. Il ne paie que les intérêts du prêt. Les cotisations d\'assurances sont généralement perçues pendant la période de différé d\'amortissement.';
        definitions.push([toDefine11, definition11]);

        const toDefine12 = 'Différé total (d\'amortissement):';
        const definition12 = 'Période pendant laquelle l\'emprunteur ne rembourse ni capital ni intérêts. Ces intérêts seront ajoutés au capital restant dû. Seules les cotisations d\'assurances sont généralement perçues pendant la période de différé total.';
        definitions.push([toDefine12, definition12]);

        const toDefine13 = 'Durée d\'amortissement:';
        const definition13 = 'Durée pendant laquelle le crédit est remboursé en capital. Cette durée peut être différente de la durée du crédit si celui-ci comprend une période de différé.';
        definitions.push([toDefine13, definition13]);

        const toDefine14 = 'Echéance:';
        const definition14 = 'C\'est le nom de l\'opération financière consistant à rembourser périodiquement le crédit. Elle est caractérisée par sa date et sa périodicité.';
        definitions.push([toDefine14, definition14]);

        const toDefine15 = 'Euribor:';
        const definition15 = 'Taux des dépôts interbancaires entre les 57 Banques Européennes les plus représentatives.';
        definitions.push([toDefine15, definition15]);

        const toDefine16 = 'Garantie du prêt immobilier:';
        const definition16 = 'En cas de défaillance de paiement des mensualités du prêt immobilier, cette garantie protège la banque qui se fait rembourser le capital restant dû. Les types de garanties les plus fréquents sont : caution, hypothèque, privilège de prêteur de deniers (PPD) et nantissement.';
        definitions.push([toDefine16, definition16]);

        const toDefine17 = 'Intérêts intercalaires:';
        const definition17 = 'On parle d\'intérêts intercalaires par opposition aux intérêts d\'une échéance régulière lorsque ces intérêts sont produits, en cas de déblocage progressifs des fonds, durant la période de déblocage sur les fonds déjà débloqués. Des intérêts intercalaires sont également calculés lorsque la durée de la première échéance ne correspond pas exactement à la durée prévue par la périodicité de remboursement.';
        definitions.push([toDefine17, definition17]);

        const toDefine18 = 'I.R.A. (Indemnités de remboursement par anticipation):';
        const definition18 = 'Indemnités versées à la banque, lorsque le crédit est remboursé par l\'emprunteur avant la date prévue sur le tableau d\'amortissement, et correspondant à 6 mois d\'intérêts dus avec un plafond de 3% du capital restant dû en matière de crédit immobilier, et 1% en matière de crédit à la consommation.';
        definitions.push([toDefine18, definition18]);

        const toDefine19 = 'Principal:';
        const definition19 = 'Le principal est la partie du capital qui est remboursée dans une échéance. C\'est un synonyme peu usité de l\'amortissement.';
        definitions.push([toDefine19, definition19]);

        const toDefine20 = 'Remboursement anticipé:';
        const definition20 = 'Possibilité pour le client de rembourser partiellement ou totalement un crédit avant la fin prévue du contrat. Cette possibilité peut donner lieu à la perception par la banque d\'indemnités de remboursement anticipé (I.R.A).';
        definitions.push([toDefine20, definition20]);

        const toDefine21 = 'Revenus globaux:';
        const definition21 = 'Ils regroupent les revenus salariés ou assimilés, les pensions perçues, les allocations ou revenus sociaux, les revenus locatifs et financiers.';
        definitions.push([toDefine21, definition21]);

        const toDefine22 = 'Tableau d\'amortissement:';
        const definition22 = 'Tableau indiquant le montant dû par l\'emprunteur à chaque échéance du crédit en détaillant la répartition du remboursement entre : le capital, les intérêts, la prime relative aux assurances (lorsque celles-ci sont obligatoires) et le capital restant dû après chaque échéance.';
        definitions.push([toDefine22, definition22]);

        const toDefine23 = 'Taux capé:';
        const definition23 = 'Taux bénéficiant d\'un mécanisme de plafonnement d\'évolution (voir cap de taux).';
        definitions.push([toDefine23, definition23]);

        const toDefine24 = 'Taux actuariel:';
        const definition24 = 'C\'est la technique de taux selon un modèle actuariel, utilisée pour transformer le taux annuel en un taux périodique.';
        definitions.push([toDefine24, definition24]);

        const toDefine25 = 'Taux annuel effectif global (TAEG):';
        const definition25 = 'Taux annuel actuariel englobant les intérêts et l\'ensemble des frais liés à l\'octroi d\'un crédit : frais de dossier, de garantie, d\'assurance. Il permet de mesurer le coût total du crédit. Il ne doit jamais dépasser le taux d\'usure en vigueur à la date d\'émission de l\'offre de prêt. Le TEG, à la différence du TAEG, est exprimé en taux annuel proportionnel et s\'applique principalement aux prêts professionnels.';
        definitions.push([toDefine25, definition25]);

        const toDefine26 = 'Taux d\'usure:';
        const definition26 = 'Il correspond au taux maximum que tous les prêteurs sont autorisés à pratiquer lorsqu\'ils accordent un crédit, ces seuils sont fixés chaque trimestre par la Banque de France.';
        definitions.push([toDefine26, definition26]);

        const toDefine27 = 'Taux d\'endettement:';
        const definition27 = 'Taux exprimant le rapport des charges financières sur les revenus globaux.';
        definitions.push([toDefine27, definition27]);

        const toDefine28 = 'Taux proportionnel:';
        const definition28 = 'Technique du taux consistant à diviser le taux annuel par le nombre d\'échéances dans l\'année pour obtenir le taux périodique.';
        definitions.push([toDefine28, definition28]);

        const toDefine29 = 'Taux périodique:';
        const definition29 = 'Taux utilisé sur le capital restant dû pour calculer les intérêts d\'une échéance. Le taux périodique dépend de la périodicité du crédit (mensuel, annuel, ...).';
        definitions.push([toDefine29, definition29]);

        const toDefine30 = 'Taux d\'intérêt (annuel):';
        const definition30 = 'Pourcentage permettant de calculer la rémunération annuelle de la banque sur une somme d\'argent prêté à l\'emprunteur.';
        definitions.push([toDefine30, definition30]);

        const toDefine31 = 'Taux nominal ou taux débiteur (annuel):';
        const definition31 = 'C\'est le taux (annuel) du crédit quand celui-ci est calculé au taux proportionnel.';
        definitions.push([toDefine31, definition31]);

        const toDefine32 = 'Taux révisable (ou Taux variable):';
        const definition32 = 'Taux qui peut évoluer à la hausse comme à la baisse sur la durée du prêt selon les modalités prévues dans le contrat de prêt. L\'évolution du taux dépend de la variation d\'un ou plusieurs indices et elle peut être mensuelle, trimestrielle, annuelle ou pluriannuelle. Le prêt à taux variable peut comprendre une période à taux fixe et des limites de variation.';
        definitions.push([toDefine32, definition32]);

        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': le lexique du crédit'},
            {style: 'smallLineBreak', text: ''},
        ];

        const allDefinitions = [];
        definitions.forEach(elem => {
            allDefinitions.push(this.generateDefinition(elem[0], elem[1]));
            allDefinitions.push({style: 'verySmallLineBreak', text: ''});
        })

        aContent.push(...allDefinitions);

        return aContent;
    }


    encodeOfficialDocumentsList(annexNumber) {
        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': listes des pièces à fournir'},
            {style: 'smallLineBreak', text: ''},

            {text: 'Justificatifs d\'identité et de domicile:', style: 'h3bold'},
            {
              ul: [
                'Carte d\'identité, passeport, titre de séjour en cours de validité',
                'Livret de famille et contrat de mariage (éventuellement jugement de divorce + pension alimentaire)',
                'Dernière quittance de loyer ou attestation hébergement à titre gratuit',
                'Justificatif EDF ou téléphone fixe (moins de 3 mois)'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Si vous êtes salarié:', style: 'h3bold'},
            {
              ul: [
                '3 derniers bulletins de salaire et bulletin de salaire de décembre N-1',
                'Contrat de travail ou attestation de l\'employeur',
                'Justificatif de prime ou bonus sur 3 ans'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Si vous êtes non salarié:', style: 'h3bold'},
            {
              ul: [
                'Relevés de comptes bancaires professionnels sur les 3 derniers mois',
                'Bilans et comptes de résultat sur les 3 derniers exercices',
                'Extrait K-bis de moins de 3 mois',
                'Statuts de la société et compte de résultat prévisionnel'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Justificatifs de votre situation financière:', style: 'h3bold'},
            {
              ul: [
                'Avis d\'imposition ou de non imposition N-1 et N-2',
                'Relevés de comptes bancaires personnels (tous comptes) sur les 3 derniers mois',
                'Si vous avez des crédits en cours, tableaux d\'amortissement de l\'offre de prêt initiale',
                'Tous documents pouvant justifier de votre apport (relevés de compte-épargne, etc.)'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Justificatifs relatifs au bien à financer:', style: 'h3bold'},
            {
              ul: [
                'Promesse ou compromis de vente, devis travaux éventuels, titre de propriété',
                'En cas d\'acquisition d\'un bien neuf, contrat de réservation, devis, plan, permis de construire, assurance',
                'En cas d\'acquisition d\'un bien locatif, estimation des revenus locatifs à venir',
                'En cas de constitution d\'une SCI ou d\'achat par une SCI, statuts de la SCI'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Si vous êtes propriétaire:', style: 'h3bold'},
            {
              ul: [
                'Dernier Avis d\'imposition à la Taxe Foncière',
                'Estimation de la valeur du bien par une agence immobilière',
                'En cas de bien locatif, bail de location existant et déclaration 2044 ou 2072 (SCI) relative aux revenus fonciers'
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Justificatif de non propriété en cas de Prêt à Taux Zéro (PTZ):', style: 'h3bold'},
            {
              ul: [
                'Si vous êtes locataire, bail + une quittance par semestre des 2 dernières années + dernière quittance',
                'Si vous êtes hébergé à titre gratuit par le locataire des lieux : attestation d\'hébergement + pièce d\'identité du locataire + justificatif personnel de domicile + copie du bail',
                'Si vous êtes hébergé à titre gratuit par le propriétaire des lieux : attestation d\'hébergement + pièce d\'identité du propriétaire + justificatif personnel de domicile + Extrait cadastral en mairie'
              ]
            },

            {style: 'bigLineBreak', text: ''},
            {style: 'bigLineBreak', text: ''},

            {text: 'Cette liste est non exhaustive. Les établissements bancaires peuvent demander des pièces complémentaires. Si vous estimez que certaines pièces non visées dans cette liste, sont nécessaires à la compréhension de votre projet, merci de les communiquer au mandataire.', style: 'h3'},


        ];

        return aContent;
    }



    encodeCreditInformation(annexNumber) {
        const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners);

        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': Informations générale sur les contrats de crédit'},
            {style: 'smallLineBreak', text: ''},

            {text: 'L\'Intermédiaire doit assurer la disponibilité permanente des informations générales, claires et compréhensibles, sur les contrats de crédit. Ces dernières sont délivrées sur papier, sur tout autre support durable ou sous forme électronique. Elles sont facilement accessibles et sont fournies gratuitement à l\'emprunteur.', style: 'bolditalics'},

            {style: 'bigLineBreak', text: ''},

            {text: 'Les informations sur l\'intermédiaire de crédit sont fournies par la société ' + aBrokerPartner.name + ', courtier en opérations de banque et assurance dont le numéro ORIAS est ' + aBrokerPartner.agreement_number + ', située à l\'adresse suivante: ' + this.formatAddress(aBrokerPartner.address.address, aBrokerPartner.address.postal_code, aBrokerPartner.address.city, aBrokerPartner.address.country) + '.'},

            {style: 'bigLineBreak', text: ''},

            {text: 'Ces informations sont générales et ne s\'appliquent pas forcément à votre cas particulier. Il s\'agit simplement de vous informer sur ce qui existe en matière de crédit.', style: 'bold', decoration: 'underline' },

            {style: 'bigLineBreak', text: ''},

            {text: '1. Voici les différents types de crédits existants:'},

            {
              style: 'tablecenter',
              table: {
                body: [
                  ['Prêt libre', 'Résidence principale ou secondaire ou investissement locatif', ],
                  ['Prêt 0 % Ministère du Logement (PTZ+)', 'Résidence principale \n Neuf ou logements HLM achetés par leur locataire'],
                  ['Prêt à l\'accession sociale (PAS)', 'Résidence principale \n Neuf ou ancien'],
                  ['Prêt Action Logement (Ex. 1% logement)', 'Résidence principale (location provisoire possible dans certaines conditions) \n Neuf ou ancien'],
                  ['Prêt conventionné', 'Résidence principale ou investissement locatif (si logement neuf devenant résidence principale du locataire) \n Neuf ou ancien'],
                  ['Prêt 0 % des collectivités locales', 'Résidence principale'],
                  ['Prêt fonctionnaire', 'Résidence principale ou investissement locatif \n Neuf ou ancien'],
                  ['Plan d\'épargne logement', 'Résidence principale neuve ou ancienne \n Résidence secondaire neuve'],
                ]
              }
            },

            {style: 'bigLineBreak', text: ''},

            { text: [{text: '2. Il est possible de souscrire un crédit pour financer '}, {text: 'une résidence principale ou secondaire, avec ou sans travaux ; un investissement locatif ; un rachat de prêt immobilier ; un crédit relais ; une restructuration de crédits en cours.', style: 'bold'}] },

            {style: 'smallLineBreak', text: ''},

            {text: 'Un crédit peut être souscrit sur une durée de 5 à 30 ans. Le remboursement s\'effectuera mensuellement.'},

            {style: 'bigLineBreak', text: ''},

            {text: '3. Les taux peuvent être fixe, variable ou révisable:'},
            {
              ul: [
                { text: [{text: 'Un taux fixe ', style: 'bold'}, {text: 'est un taux dont le montant reste inchangé pendant toute la durée d\'un prêt.'}] },
                { text: [{text: 'Un taux révisable ou variable ', style: 'bold'}, {text: 'peut évoluer à la hausse comme à la baisse sur la durée du prêt selon les modalités prévues dans l\'offre de prêt. L\'évolution du taux dépend de la variation d\'un indice et elle peut être mensuelle, trimestrielle, annuelle ou pluriannuelle. Le prêt à taux variable peut comprendre une période à taux fixe et des limites de variation.'}] },
              ]
            },

            {style: 'smallLineBreak', text: ''},

            { text: [{text: 'Les prêts en devise ', style: 'bold'}, {text: 'c\'est-à-dire consenti dans une autre monnaie que l\'euro doivent faire l\'objet d\'avertissement particulier par l\'intermédiaire et la banque'}] },

            {style: 'bigLineBreak', text: ''},

            { text: [{text: '4. Il existe plusieurs formes de '}, {text: 'sûreté réelle ou personnelle possibles pour garantir le contrat de crédit: ', style: 'bold'}] },

            {
              ul: [
                { text: [{text: 'Caution prêteur ', style: 'bold'}, {text: '(ex. Crédit Logement, SACCEF) : Société de cautionnement qui s\'engage auprès du prêteur à lui régler sa créance en cas de défaillance de l\'emprunteur et prend en charge la procédure de recouvrement contre l\'emprunteur. L\'emprunteur doit verser une commission au garant avant la signature du contrat de crédit.'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Caution Mutuelle: ', style: 'bold'}, {text: 'Mutuelle d\'assurance ou de prévoyance qui propose un service de cautionnement à leurs bénéficiaires. Elle s\'engage auprès du prêteur à lui régler sa créance en cas de défaillance de l\'emprunteur et prend en charge la procédure de recouvrement contre l\'emprunteur. L\'emprunteur doit verser une commission au garant avant la signature du contrat de crédit.'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Caution personnelle: ', style: 'bold'}, {text: 'La banque demande la signature d\'un acte sous seing privé (acte de caution) par l\'emprunteur et le coemprunteur aux termes duquel ils acceptent que leurs biens personnels soient saisis et vendus en cas de défaillance dans le remboursement du prêt aux échéances convenues (Principal, frais et accessoires).'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Hypothèque: ', style: 'bold'}, {text: 'Il s\'agit d\'une garantie immobilière matérialisée par un acte notarié par lequel l\'emprunteur et le co-emprunteur acceptent qu\'un bien immobilier soit saisi et vendu par la banque en cas de défaillance dans le remboursement du prêt aux échéances convenues (principale, frais, accessoires).'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Privilège de prêteur de deniers (PPD): ', style: 'bold'}, {text: 'Proche de l\'hypothèque, il est pourtant à différencier de celle-ci. Il s\'agit d\'une garantie qui s\'applique sur la partie du financement débloqué au même moment que la signature de l\'acte authentique de vente, lorsque le vendeur a reçu le prix d\'achat. Il fait l\'objet d\'une inscription à la conservation des hypothèques après la vente et prend rang à la date de la vente. Cela signifie que la banque devient prioritaire sur toutes les garanties prises sur le bien immobilier.'}] },

                {style: 'verySmallLineBreak', text: ''},

                { text: [{text: 'Nantissement: ', style: 'bold'}, {text: 'Contrat par lequel un débiteur remet une chose à son créancier afin de garantir la dette. Il peut s\'agir d\'assurancesvie ou de placements. La banque a alors la possibilité de vendre ces valeurs pour se faire rembourser en cas de défaillance de l\'emprunteur au paiement des échéances convenues du crédit.'}] },
              ]
            },

            {style: 'bigLineBreak', text: ''},

            {text: 'Le CLIENT certifie avoir été informé de la nécessité de fournir des éléments exacts et complets afin qu\'il puisse être procédé à une évaluation appropriée de sa solvabilité. Un crédit ne peut pas être accordé lorsque la banque ne peut procéder à l\'évaluation de solvabilité du fait du refus de l\'emprunteur de communiquer ces informations.', style: 'bold'},

            {style: 'bigLineBreak', text: ''},

            { text: [{text: 'Le CLIENT est informé que: '}, {text: 'au plus tard lors de l\'émission de l\'offre de crédit, la banque lui communiquera, par écrit ou sur un autre support durable, sous la forme d\'une fiche d\'information standardisée européenne (FISE), les informations personnalisées lui permettant de comparer les différentes offres de crédit disponibles sur le marché, d\'évaluer leurs implications et de se déterminer en toute connaissance de cause sur l\'opportunité de conclure un contrat de crédit.', style: 'bold'}] },
        ];

        return aContent;
    }


    encodeFinancialDeclaration(annexNumber) {
        const decodedPersons = this.decodePersons(this.aCase, false);

        const financialInfo = []
        if (this.aCase && this.aCase.actor) {

          // ACTOR
          if (this.aCase.actor && this.aCase.actor.type === 'LEGAL_PERSON') {
            financialInfo.push({style: 'h2bold', text: 'Personne morale: apport, revenus, charges et patrimoine'});
            financialInfo.push(...this.prepareFinanceDetails(this.aCase.actor.finance));
          }

          if (this.aCase.actor && this.aCase.actor.type === 'HOUSEHOLD') {
            financialInfo.push({style: 'h2bold', text: 'Ménage: apport, revenus, charges et patrimoine'});
            financialInfo.push(...this.prepareFinanceDetails(this.aCase.actor.finance));
          }

          financialInfo.push({style: 'bigLineBreak', text: ''});

          // PERSONS
          this.aCase.actor.persons.forEach( (person, index) => {
              if (this.aCase.actor.type === 'LEGAL_PERSON' || (this.aCase.actor.type === 'HOUSEHOLD' && person.is_borrower === true)) {
                financialInfo.push({style: 'h2bold', text: decodedPersons[index].courtesy + ' ' + decodedPersons[index].firstName + ' ' + decodedPersons[index].lastName + ': apport, revenus, charges et patrimoine'});
                financialInfo.push(...this.prepareFinanceDetails(person.finance));
                financialInfo.push({style: 'bigLineBreak', text: ''});
              }
            });

          const totalRevenues = this.aCaseForm.computeRevenues();
          const totalCharges = this.aCaseForm.computeCharges();
          financialInfo.push({style: 'h3bold', text: 'Revenus mensuels totaux: ' + LocaleUtils.toLocale(totalRevenues, 'EUR')});
          financialInfo.push({style: 'h3bold', text: 'Charges mensuelles totales: ' + LocaleUtils.toLocale(totalCharges, 'EUR')});
        }

        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': Déclaration de situation financière'},
            {style: 'smallLineBreak', text: ''},
            ...financialInfo,
            {style: 'smallLineBreak', text: ''},
            {style: '', text: 'Je certifie exacts, sincères et exhaustifs les renseignements ci-dessus portant sur mes revenus, charges et crédits en cours. Je reconnais avoir été informé(e) qu\'en cas de fausse déclaration, je serais constitué(e) débiteur/débitrice de mauvaise foi et serais susceptible en conséquence, sous réserve de l\'appréciation des tribunaux, d\'être déchu(e/s/es) du bénéfice des articles L331-1 à L333-8 du Code de la consommation, relatifs au règlement des situations de surendettement des particuliers et des familles.'},
            {style: 'bigLineBreak', text: ''},
            this.generateSignatureSection(false)
        ];

        return aContent;
    }


    encodeInsuranceQuestions() {
        const question1 = 'Décès';
        const question2 = 'PTIA';
        const question3 = 'IPT';
        const question4 = 'IPP';
        const question5 = 'ITT';
        const question6 = 'Perte d\'emploi';

        const aAnswersVector = [];

        const decodedPersons = this.decodePersons(this.aCase, false);
        decodedPersons.forEach( (decodedPerson) => {
            if (decodedPerson) {
              aAnswersVector.push([decodedPerson.courtesy + ' ' + decodedPerson.firstName + ' ' + decodedPerson.lastName + ' (indiquez la quotité)', '', '', '', '', '', '']);
            }
        });

        const aContent = [
            {style: 'h3', text: 'Compte tenu de votre situation, vous envisagez de souscrire les garanties suivantes:'},
            {style: 'smallLineBreak', text: ''},
            {
              style: 'tablecenter',
              width: '80%',
              table: {
                body: [
                  ['', question1, question2, question3, question4, question5, question6],
                  ...aAnswersVector
                ],
                widths: ['20%', '10%', '10%', '10%', '10%', '10%', '10%',],
              }
            },

        ];

        return aContent;
    }


    encodeInsuranceInformation(annexNumber) {

        const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners);
        const yesNo = 'Oui   Non';

        const cellTopLeft = [
          { text: [ { text: 'La'}, {text: ' garantie Décès', style: 'bold' }, { text: ' intervient en cas de décès de la personne assurée. Dans le ou les contrat(s) qui ser(ont) proposé(s), elle cesse à une date d\'anniversaire définie. La prestation est le remboursement au prêteur du capital assuré.'} ] },
          {style: 'bigLineBreak', text: ''},
           { text: [ { text: 'La'}, {text: ' garantie Perte totale et irréversible d\'autonomie (PTIA)', style: 'bold'}, {text: ' intervient lorsque l\'assuré se trouve dans un état particulièrement grave, nécessitant le recours permanent à une tierce personne pour exercer les actes ordinaires de la vie. Dans le ou les contrat(s) proposé(s), la garantie PTIA cesse à une date d\'anniversaire définie. La prestation est le remboursement au prêteur du capital assuré.'} ] },

          {style: 'bigLineBreak', text: ''},

          { text: [ { text: 'La'}, {text: ' garantie Perte d\'emploi', style: 'bold' }, { text: ' intervient en cas de chômage et lorsque l\'assuré perçoit une allocation de chômage versée par le Pôle Emploi (ex Assedic) ou un organisme assimilé. Elle est accordée, après une période de franchise, pour une durée totale maximale cumulée qui sera définie dans le contrat, quelle que soit la durée totale du prêt. La garantie Perte d\'emploi prend fin en fonction de la date d\'anniversaire prévu.'} ] },
          {style: 'bigLineBreak', text: ''},
          {text: 'Vous souhaitez que la prestation soit:', decoration: 'underline'},
          {style: 'bigLineBreak', text: ''},
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Forfaitaire (le montant qui vous sera versé correspond à un pourcentage de l\'échéance du prêt)', alignment: 'left', width:'95%', margin: [ 5, 0, 0, 0 ]} ] },
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Indemnitaire (le montant qui vous sera versé complète tout ou partie de votre perte de rémunération)', alignment: 'left', width:'95%', margin: [ 5, 0, 0, 0 ]} ] },
        ];

        const cellTopRight = [
          { text: [ {text: 'ITT: ', style: 'bold' }, { text:'Incapacité Temporaire de Travail. Par suite de maladie ou d\'accident survenant pendant la période de garantie, l\'assuré se trouve dans l\'impossibilité complète d\'exercer une quelconque activité professionnelle. Cet état peut être constaté par expertise médicale de l\'Assureur. La prise en charge au titre de cette garantie est limitée à un nombre de jours défini dans le contrat à compter de la date d\'arrêt total de travail.'} ] },
          {style: 'bigLineBreak', text: ''},
          { text: [ {text: 'IPP/IPT: ', style: 'bold' }, { text: 'Invalidité Permanente Partielle ou Invalidité Permanente Totale. L\'assuré est considéré en état d\'IPP ou d\'ITT lorsque par suite d\'accident ou de maladie son taux d\'invalidité est correspond à un certain pourcentage permettant de définir l\'invalidité partielle ou totale'} ] },
          {style: 'bigLineBreak', text: ''},
          {text: 'Vous souhaitez que la prestation ITT soit:', decoration: 'underline'},
          {style: 'bigLineBreak', text: ''},
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Forfaitaire (le montant qui vous sera versé correspond à un pourcentage de l\'échéance du prêt)', alignment: 'left', width:'95%', margin: [ 5, 0, 0, 0 ]} ] },
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Indemnitaire (le montant qui vous sera versé complète tout ou partie de votre perte de rémunération)', alignment: 'left', width:'95%', margin: [ 5, 0, 0, 0 ]} ] },
        ];

        const cellBottomLeft = [
          {text: 'Les garanties sont détaillées dans la notice du contrat d\'assurance emprunteur qui seule a valeur contractuelle. Lors de nos échanges, nous avons évoqué les risques liés au non-remboursement total ou partiel de votre prêt, en cas de décès/perte totale et irréversible d\'autonomie (PTIA), ou en cas de problème de santé vous privant de l\'exercice de votre activité:'},
          {style: 'smallLineBreak', text: ''},
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Oui', alignment: 'center', width:'15%'}, {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Non', alignment: 'center', width:'15%'} ] },
        ];

        const cellBottomRight = [
          {text: 'Les garanties proposées, les modalités de paiement des cotisations et leur évolution éventuelle ont également été évoquées:'},
          {style: 'smallLineBreak', text: ''},
          { columns: [ {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Oui', alignment: 'center', width:'15%'}, {...this.generateSquare('black'), alignment: 'right', width:'5%'}, {text: 'Non', alignment: 'center', width:'15%'} ] },
        ];


        const aQuestionSection1 = {
          style: 'tablejustify',
          width: '100%',
          alignment: 'justify',
          table: {
            body: [
              [cellTopLeft, cellTopRight]
            ],
            widths: ['*', '*'],
          },
        };

        const aQuestionSection2 = {
          style: 'tablejustify',
          width: '100%',
          alignment: 'justify',
          table: {
            body: [
              [cellBottomLeft, cellBottomRight]
            ],
            widths: ['*', '*'],
          },
        };


        const aContent = [
            {style: 'smallLineBreak', text: '', pageBreak: 'after'},
            {style: 'h2', text: 'Annexe ' + annexNumber + ': Assurance emprunteur'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandataire, dont l\'adresse est ' + this.formatAddress(aBrokerPartner.address.address, aBrokerPartner.address.postal_code, aBrokerPartner.address.city, aBrokerPartner.address.country)  + ', agit en tant que courtier/mandataire en assurance immatriculé à l\'ORIAS sous le numéro ' + aBrokerPartner.agreement_number + '.' },
            {style: 'smallLineBreak', text: ''},
            {text: 'Pour toute réclamation, vous pouvez vous adresser au Mandataire, par courier, à l\'adresse figurant ci-dessus.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'L\'assurance emprunteur constitue une garantie à la fois pour le prêteur et l\'emprunteur. Elle est un élément déterminant de l\'obtention de votre crédit pour certains établissements de crédits.'},
            {style: 'smallLineBreak', text: ''},
            {text: 'Le Mandataire ne travaille pas exclusivement avec un ou plusieurs assureurs. Le Client peut obtenir la liste des partenaires assureurs auprès du Mandataire et sur demande.'},
            {style: 'bigLineBreak', text: ''},

            {style: 'bolditalics', text: 'Possibilités de garanties d\'assurance:', decoration: 'underline'},
            aQuestionSection1,
            {style: 'bigLineBreak', text: ''},
            aQuestionSection2,
            {style: 'bigLineBreak', text: ''},
            this.encodeInsuranceQuestions(),
            {style: 'bigLineBreak', text: ''},
            this.generateSignatureSection(false)
        ];

        return aContent;
    }


    content(): any {
        return [
            ...this.encodeMandateHeader('Mandat d\'intermédiation en opérations de banque et services de paiement', this.iconUser),
            ...this.encodeMainFirstPart(),
            ...this.encodeCreditInformation('1'),
            ...this.encodeFinancialDeclaration('2'),
            ...this.encodeInsuranceInformation('3'),
            ...this.encodeOfficialDocumentsList('4'),
            ...this.encodeCreditLexic('5'),
        ];
    }



}
