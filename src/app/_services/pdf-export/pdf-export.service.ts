import { Injectable } from '@angular/core';
import { Person, ResidencePermit, LegalPerson, BankInfo, Address, Case, ActivePartner, Individual, AvailableLoan, BudgetParameters, FundingParameters, FundingResults, Loan, Taeg, BridgeLoan, SmoothableCharge, PinelParameters, DebtConsolidationParameters, BudgetResults, Contact, CallForFunds, SelfEmployed, Employee, ProfessionDetails, Partner, Surfaces, ProjectDates } from '../../_api/model/models';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { LoanTypeMap, RoleTypeMap,CourtesyTypeMap, DivorceProcedureTypeMap, HousingStatusTypeMap, SubContractTypeTypeMap, ContractTypeTypeMap } from 'src/app/utils/strings';
import { IconsSvg } from './icons-svg';
import { Objective, LoansType, LoanFutureType, RevenueTypeMap, BreakupTypeMap, ChargeTypeMap, PartnerTypeMap, MaritalStatusMap, WorkerStatus, LegalPersonTypeMap, DependentPersonTypeMap, MatrimonialRegime, PatrimonyType, HousingStatus, AcquisitionDestinationMap, AcquisitionStateMap, AcquisitionNatureMap, CategorySocioProfessionnal, GroupeSocioProfessionnal } from 'src/app/utils/strings';


@Injectable({
    providedIn: 'root'
})

export class PDFExportService {

    aCase: any;
    aParams: any;
    aResults: any;
    caseId = '';
    caseName = '';
    aPartners: any;
    headerTableColor = '#D5D8DC';
    iconsColor = '#519cb8';

    formatDateAsString(aDateAsString) {
      if (aDateAsString) {
        const parsedDate = Date.parse(aDateAsString);
        const date = new Date(parsedDate);
        if (date instanceof Date && !isNaN(date.valueOf())) {
          return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric'});
        }
      }
      return '';
    }

    formatFldAsString(aField) {
      return (aField !== null && aField !== undefined) ? aField : '';
    }

    formatNbr(aNbrField) {
      return (aNbrField !== null && aNbrField !== undefined) ? aNbrField : '';
    }

    formatMonetaryNbr(aNbrField) {
      return (aNbrField !== null && aNbrField !== undefined) ? LocaleUtils.toLocale(aNbrField, 'EUR') : ''
    }

    getIndividualAddressToUse(anIndividual: Individual) {
      if (anIndividual) {
        return (anIndividual.contact_address && anIndividual.contact_address.address) ? anIndividual.contact_address : anIndividual.residency_address;
      }
      return null;
    }

    formatLocation(aLoc: Address) {
      const aLocation = {address: '', postal_code: '', city: '', country: '', insee_code: ''};
      if (aLoc) {
        aLocation.address = this.formatFldAsString(aLoc.address);
        aLocation.postal_code = this.formatFldAsString(aLoc.postal_code);
        aLocation.city = this.formatFldAsString(aLoc.city);
        aLocation.country = this.formatFldAsString(aLoc.country);
        aLocation.insee_code = this.formatFldAsString(aLoc.insee_code);
      }
      return aLocation;
    }

    formatPostalCodeAndCity(postalCode, city) {
      return {text: postalCode + ((city && postalCode) ? ', ' : '') + city + ((city || postalCode) ? '.' : '')};
    }

    formatPartnerPostalCodeAndCity(aPartner) {
      if (aPartner && aPartner.address) {
        return this.formatPostalCodeAndCity(aPartner.address.postal_code, aPartner.address.city);
      }
      return {text: ''};
    }

    formatBank(aBank: BankInfo) {
      const aTempBank = {bank: '', agency: '', iban: '', bic: '', customer_since: ''};
      if (aBank) {
        aTempBank.bank = this.formatFldAsString(aBank.current_bank);
        aTempBank.agency = this.formatFldAsString(aBank.current_agency);
        aTempBank.iban = this.formatFldAsString(aBank.rib?.iban);
        aTempBank.bic = this.formatFldAsString(aBank.rib?.bic);
        aTempBank.customer_since = this.formatDateAsString(aBank.customer_since);
      }
      return aTempBank;
    }

    formatResidencePermit(aResidencePermit: ResidencePermit) {
      const aTempResidencePermit = {number: '', delivery_date: '', expiry_date: ''};
      if (aResidencePermit) {
        aTempResidencePermit.number = this.formatFldAsString(aResidencePermit.number);
        aTempResidencePermit.delivery_date = this.formatDateAsString(aResidencePermit.delivery_date);
        aTempResidencePermit.expiry_date = this.formatDateAsString(aResidencePermit.expiry_date);
      }
      return aTempResidencePermit;
    }

    formatSurfaces(aSurfaces: Surfaces) {
      const aTempSurfaces = {surface: '', additional_surface: '', land_surface: ''};
      if (aSurfaces) {
        aTempSurfaces.surface = aSurfaces.surface ? (this.formatNbr(aSurfaces.surface) + ' m²') : '';
        aTempSurfaces.additional_surface = aSurfaces.additional_surface ? (this.formatNbr(aSurfaces.additional_surface) + ' m²') : '';
        aTempSurfaces.land_surface = aSurfaces.land_surface ? (this.formatNbr(aSurfaces.land_surface) + ' m²') : '';      }
      return aTempSurfaces;
    }

    formatProjectDates(aProjectDates: ProjectDates) {
      const aTempProjectDates = {sales_agreement_date: '', conditions_precedent_end_date: '', signature_date: ''};
      if (aProjectDates) {
        aTempProjectDates.sales_agreement_date = this.formatDateAsString(aProjectDates.sales_agreement_date);
        aTempProjectDates.conditions_precedent_end_date = this.formatDateAsString(aProjectDates.conditions_precedent_end_date);
        aTempProjectDates.signature_date = this.formatDateAsString(aProjectDates.signature_date);
      }
      return aTempProjectDates;
    }

    formatSeller(aSeller: Contact) {
      const aTempSeller = {contact_courtesy: '', contact_first_name: '', contact_last_name: '', contact_email: '', contact_phone_number: '', comment: ''};
      if (aSeller) {
        aTempSeller.contact_courtesy = this.formatFldAsString(CourtesyTypeMap.toString(aSeller.courtesy));
        aTempSeller.contact_first_name = this.formatFldAsString(aSeller.first_name);
        aTempSeller.contact_last_name = this.formatFldAsString(aSeller.last_name);
        aTempSeller.contact_email = this.formatFldAsString(aSeller.email);
        aTempSeller.contact_phone_number = this.formatFldAsString(aSeller.phone_number);
        aTempSeller.comment = this.formatFldAsString(aSeller.comment);

        if (aTempSeller.contact_first_name === '' && aTempSeller.contact_last_name === '') {
          aTempSeller.contact_courtesy = '';
        }

        return [
          {style: 'h2', text: 'Vendeur:'},
          {columns: [{width: '50%', text: 'Civilité:'}, {width: '25%', style: 'caseStyleBold', text: aTempSeller.contact_courtesy, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
          {columns: [{width: '50%', text: 'Nom:'}, {width: '25%', style: 'caseStyleBold', text: aTempSeller.contact_first_name, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
          {columns: [{width: '50%', text: 'Prénom:'}, {width: '25%', style: 'caseStyleBold', text: aTempSeller.contact_last_name, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
          {columns: [{width: '50%', text: 'Email:'}, {width: '25%', style: 'caseStyleBold', text: aTempSeller.contact_email, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
          {columns: [{width: '50%', text: 'Téléphone:'}, {width: '25%', style: 'caseStyleBold', text: aTempSeller.contact_phone_number, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
          {columns: [{width: '50%', text: 'Commentaire:'}, {width: '25%', style: 'caseStyleBold', text: aTempSeller.comment, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        ];

      }

      return [];
    }

    formatAddress(address, postalCode, city, country) {
      let aAddress = '';
      if (address) {
        aAddress += address
      }
      if (postalCode && postalCode !== '') {
        aAddress += (aAddress && aAddress !== '') ? ', ' + postalCode : postalCode;
      }
      if (city && city !== '') {
        aAddress += (aAddress && aAddress !== '') ? ', ' + city : city;
      }
      if (country && country !== '') {
        aAddress += (aAddress && aAddress !== '') ? ', ' + country: country;
      }
      return aAddress;
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    header(caseId, svgLogo): any {
        return {
            columns: [
              { text: 'Référence du dossier: ' + caseId, fontSize: 8, alignment: 'left', margin: [10, 10, 0, 0] },
              { text: 'Powered by www.toaztr.com', fontSize: 8, alignment: 'right', margin: [0, 10, 20, 0] },
              { svg: svgLogo, width: 22, alignment: 'right', margin: [10, 5, 0, 0] },
            ]
        };
    }


    footerFormatter(currentPage, pageCount) {
      return {
        columns: [
          {
            text: 'À l\'exception des besoins du dossier, toute reproduction interdite. © Toaztr',
            fontSize: 8,
            alignment: 'left',
            margin: [10, 40, 0, 0]
          },
          {
            text: 'page ' + currentPage.toString() + ' / ' + pageCount,
            fontSize: 8,
            alignment: 'right',
            margin: [0, 40, 10, 0]
          }
        ]
      };
    }


    footer(): any {
        return (currentPage, pageCount) => {
            return this.footerFormatter(currentPage, pageCount);
        };
    }


    generateSquare(color) {
      return { canvas: [{
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 10,
                    h: 10,
                    lineWidth: 1,
                    lineColor: color}]}
    }


  generateSignatureSection(withPrecede, mention = '') {
      const precede = withPrecede ? 'Précédée de la mention "' + mention + '"' : '';

      const aMandantTable = {
                    style: 'tableleft',
                    widths: '100%',
                    table: {
                      headerRows: 1,
                      body: [
                        [{text: 'Signature du (des) Mandant(s) \n' + precede, style: 'thead', alignment: 'center'}],
                        [
                          '\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du(des) signataire(s): \n \n \n \n \n \n \n',
                        ]
                      ],
                      widths: '100%',
                    }
                  };

      const aMandataireTable = {
                    style: 'tableleft',
                    widths: '100%',
                    table: {
                      headerRows: 1,
                      body: [
                        [{text: 'Signature du Mandataire \n' + precede, style: 'thead', alignment: 'center'}],
                        [
                          '\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Nom du signataire: \n \n \n \n \n \n \n',
                        ]
                      ],
                      widths: '100%',
                    }
                  };

      const aSignatureSection = {
        style: 'table',
        width: '100%',
        alignment: 'center',
        table: {
          body: [
            [aMandantTable, aMandataireTable],
          ],
          widths: ['*', '*'],
        },
        layout: 'noBorders'
      };

      return aSignatureSection;

    }


    styles(): any {
        return {
            title: {
                fontSize: 22,
                bold: true,
                alignment: 'center',
                // [left, top, right, bottom]
                margin: [0, 0, 0, 20]
            },
            h2: {
                fontSize: 16,
                alignment: 'center',
                bold: true,
                margin: [0, 10, 0, 5]
            },
            h2bold: {
                fontSize: 16,
                alignment: 'left',
                bold: true,
            },
            h3margin: {
                fontSize: 12,
                alignment: 'left',
                margin: [10, 0, 0, 0]
            },
            h3centerbold: {
                fontSize: 12,
                alignment: 'center',
                bold: true
            },
            h3bold: {
                fontSize: 12,
                alignment: 'left',
                bold: true,
            },
            h4: {
                fontSize: 10,
                alignment: 'left'
            },
            h4bold: {
                fontSize: 10,
                alignment: 'left',
                bold: true,
            },
            bold: {
                alignment: 'left',
                bold: true,
            },
            bolditalics: {
                alignment: 'left',
                bold: true,
                italics: true
            },
            bigLineBreak: {
                fontSize: 16,
                alignment: 'center',
                margin: [0, 12, 0, 0]
            },
            smallLineBreak: {
                fontSize: 14,
                alignment: 'center',
                margin: [0, 8, 0, 0]
            },
            verySmallLineBreak: {
                fontSize: 8,
                alignment: 'center',
                margin: [0, 6, 0, 0]
            },
            caseStyle: {
                fontSize: 10
            },
            caseStyleBold: {
                fontSize: 10,
                alignment: 'left',
                bold: true
            },
            table: {
                alignment: 'right',
                margin: [0, 5, 0, 15]
            },
            tableleft: {
                alignment: 'left',
                margin: [0, 5, 0, 15]
            },
            tablecenter: {
                alignment: 'center',
                margin: [0, 5, 0, 15]
            },
            tablejustify: {
                alignment: 'justify',
                margin: [0, 5, 0, 15]
            },
            thead: {
                bold: true,
                color: 'black',
                fillColor: this.headerTableColor
            },
            iconsTop: {
                alignment: 'right',
                margin: [0, 0, 2, 0]
            },
            iconsTextTop: {
                fontSize: 12,
                alignment: 'left',
                bold: true,
                color: this.iconsColor,
                margin: [10, 0, 0, 0]
            },
            icons: {
                width: 20
            },
            iconsText: {
                fontSize: 12,
                margin: [10, 0, 0, 0],
                width: 'auto',
            }
        };
    }

    // Extract and format relevant info from physical person civil details
    formatPersonCivilDetails(aIndividual: Individual) {
      const addressToUSe = this.getIndividualAddressToUse(aIndividual);
      return {courtesy: CourtesyTypeMap.toString(this.formatFldAsString(aIndividual.courtesy)),
              firstName: this.formatFldAsString(aIndividual.first_name),
              lastName: this.formatFldAsString(aIndividual.last_name),
              address: this.formatLocation(addressToUSe).address,
              postalCode: this.formatLocation(addressToUSe).postal_code,
              city: this.formatLocation(addressToUSe).city,
              country: this.formatLocation(addressToUSe).country,
              phone: this.formatFldAsString(aIndividual.phone_number),
              email: this.formatFldAsString(aIndividual.email),
              bank_info: this.formatBank(aIndividual.bank_info)
              }
    }


    // Extract and format relevant info from legal person details
    formatLegalPersonDetails(aLegalPerson: LegalPerson) {
      const addressToUSe = (aLegalPerson.contact_address && aLegalPerson.contact_address.address) ? aLegalPerson.contact_address : aLegalPerson.address;
      return {name: this.formatFldAsString(aLegalPerson.name),
              structureType: LegalPersonTypeMap.toString(this.formatFldAsString(aLegalPerson.structure_type)),
              legalStatus: this.formatFldAsString(aLegalPerson.legal_status),
              address: this.formatLocation(addressToUSe).address,
              postalCode: this.formatLocation(addressToUSe).postal_code,
              city: this.formatLocation(addressToUSe).city,
              country: this.formatLocation(addressToUSe).country,
              phone: this.formatFldAsString(aLegalPerson.phone_number),
              email: this.formatFldAsString(aLegalPerson.email),
              bank_info: this.formatBank(aLegalPerson.bank_info)
              }
    }

    // Decode relevant info from legal and physical persons. Consider only borrowers in case of HOUSEHOLD
    decodePersons(aCase: Case, decodeLegalPerson = true) {
      const decodedPersons = [];
      if (aCase && aCase.actor) {
        if (aCase.actor.type === 'LEGAL_PERSON' && decodeLegalPerson) {
          decodedPersons.push(this.formatLegalPersonDetails(aCase.actor))
        }
        aCase.actor.persons.forEach( (person) => {
            if (aCase.actor.type === 'LEGAL_PERSON' || (aCase.actor.type === 'HOUSEHOLD' && person.is_borrower === true)) {
              decodedPersons.push(this.formatPersonCivilDetails(person.civil));
            }
          }
        )
      }
      return decodedPersons
    }


    generateDestinationContact() {
      const aDestinationContact = [];
      const decodedPersons = this.decodePersons(this.aCase);

      if (this.aCase && this.aCase.actor && this.aCase.actor.type === 'LEGAL_PERSON') {
        aDestinationContact.push({text : decodedPersons[0].structureType + ' ' + decodedPersons[0].name });
        aDestinationContact.push({text : decodedPersons[0].legalStatus });
        aDestinationContact.push({text : decodedPersons[0].address });
        const aCodePostalAndCityCode = this.formatPostalCodeAndCity(decodedPersons[0].postalCode, decodedPersons[0].city);
        aDestinationContact.push(aCodePostalAndCityCode);
        aDestinationContact.push({text : decodedPersons[0].phone });
        aDestinationContact.push({text : decodedPersons[0].email });
        aDestinationContact.push({style: 'smallLineBreak', text: ''});
        aDestinationContact.push({text : 'représenté(e) par:'});
        aDestinationContact.push({style: 'smallLineBreak', text: ''});
        decodedPersons.shift();
      }

      decodedPersons.forEach( (decodedPerson) => {
          if (decodedPerson) {
            aDestinationContact.push({text : decodedPerson.courtesy + ' ' + decodedPerson.firstName + ' ' + decodedPerson.lastName + ','});
            aDestinationContact.push({text : 'demeurant au: ' + this.formatAddress(decodedPerson.address, decodedPerson.postalCode, decodedPerson.city, decodedPerson.country)});
            aDestinationContact.push({style: 'smallLineBreak', text: ''});
          }
        }
      )
      return aDestinationContact;
    }


    // Encode the contact section into PDF format
    encodeContact(title: any, iconUser: any, currentDate: any) {
      const aBrokerPartner = this.extractPartnerContact('BROKER', this.aPartners);
      const decodedPersons = this.decodePersons(this.aCase);
      const aDestinationContact = [];

      if (this.aCase && this.aCase.actor && this.aCase.actor.type === 'LEGAL_PERSON') {
        aDestinationContact.push({text : decodedPersons[0].structureType + ' ' + decodedPersons[0].name });
        aDestinationContact.push({text : decodedPersons[0].legalStatus });
        aDestinationContact.push({text : decodedPersons[0].address });
        const aCodePostalAndCityCode = this.formatPostalCodeAndCity(decodedPersons[0].postalCode, decodedPersons[0].city);
        aDestinationContact.push(aCodePostalAndCityCode);
        aDestinationContact.push({text : decodedPersons[0].phone });
        aDestinationContact.push({text : decodedPersons[0].email });
        aDestinationContact.push({style: 'smallLineBreak', text: ''});
        aDestinationContact.push({text : 'représenté(e) par:'});
        aDestinationContact.push({style: 'smallLineBreak', text: ''});
        decodedPersons.shift();
      }

      decodedPersons.forEach( (decodedPerson) => {
          aDestinationContact.push({text : decodedPerson.courtesy + ' ' + decodedPerson.firstName + ' ' + decodedPerson.lastName});
          aDestinationContact.push({text : decodedPerson.address});
          const aCodePostalAndCityCode = this.formatPostalCodeAndCity(decodedPerson.postalCode, decodedPerson.city);
          aDestinationContact.push(aCodePostalAndCityCode);
          aDestinationContact.push({text : decodedPerson.phone});
          aDestinationContact.push({text : decodedPerson.email});
          aDestinationContact.push({style: 'smallLineBreak', text: ''});
        }
      )

      // Format broker name depending if we have or not the courtesy
      let brokerName = '';
      if (aBrokerPartner.contact.contact_courtesy === '') {
        brokerName = aBrokerPartner.contact.contact_first_name + ' ' + aBrokerPartner.contact.contact_last_name;
      }
      else {
        brokerName = aBrokerPartner.contact.contact_courtesy + ' ' + aBrokerPartner.contact.contact_first_name + ' ' + aBrokerPartner.contact.contact_last_name;
      }

      let logoFormatted = [];
      if (JSON.stringify(iconUser).includes('png') || JSON.stringify(iconUser).includes('jpeg') || JSON.stringify(iconUser).includes('jpg')) {
        logoFormatted = [{columns: [{ image: iconUser, width: 75, alignment: 'center'}, {style: 'title', text: title }] }];
      }
      else {
        logoFormatted = [{columns: [{ svg: iconUser, width: 75, alignment: 'center'}, {style: 'title', text: title }] }];;
      }

      const aContact = [
        ...logoFormatted,
        {style: 'bigLineBreak', text: ''},
        {style: 'bigLineBreak', text: ''},
        {style: 'bigLineBreak', text: ''},
        {style: 'bigLineBreak', text: ''},
        {style: 'bigLineBreak', text: ''},

        {
          table: {
            widths: [ '50%', '50%'],
            body: [
                    [
                      [ {style: 'h3bold', decoration: 'underline', text : 'Réalisée par:'},
                        {text: aBrokerPartner.name},
                        {text: aBrokerPartner.address.address ? (aBrokerPartner.address.address + ',') : ''},
                        this.formatPartnerPostalCodeAndCity(aBrokerPartner),
                        {text: aBrokerPartner.contact.contact_phone_number},
                        {text: aBrokerPartner.contact.contact_email},
                        {text: 'Agrément ORIAS: ' + aBrokerPartner.agreement_number},

                        {style: 'smallLineBreak', text: ''},

                        {style: 'h3bold', decoration: 'underline', text: 'Votre interlocuteur:'},
                        {text : brokerName},
                        {text : aBrokerPartner.contact.contact_phone_number},
                        {text : aBrokerPartner.contact.contact_email},
                      ],

                      [ {style: 'h3bold', decoration: 'underline', text: 'À la demande de:'},
                        ...aDestinationContact
                      ]
                    ]
                ]
            }
          },

          {style: 'bigLineBreak', text: ''},
          {style: 'bigLineBreak', text: ''},
          {style: 'bigLineBreak', text: ''},
          {style: 'bigLineBreak', text: ''},
          {columns: [{text: [{text: [{style: 'caseStyle', text: 'Dossier: '}, {style: 'caseStyleBold', text: this.caseName}]}]},  { text: currentDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(',', ' à'), alignment: 'right' } ]},
          {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 }]},
          {style: 'bigLineBreak', text: ''},
        ];
      return aContact;
    }

    formatContactName(aContact) {
      // Format broker name depending if we have or not the courtesy
      let representantName = '';
      if (aContact.contact.contact_courtesy === '') {
        representantName = aContact.contact.contact_first_name + ' ' + aContact.contact.contact_last_name;
      }
      else {
        representantName = aContact.contact.contact_courtesy + ' ' + aContact.contact.contact_first_name + ' ' + aContact.contact.contact_last_name;
      }
      return representantName;
    }

    extractPartnerContact(aPartnerType: string, aPartners: ActivePartner[], mainContact = false) {
      const aPartner = { type: '', name: '', logo_uri: '',
                         address: { address: '', postal_code: '', city: '', country: '', insee_code: ''},
                         contact: { contact_courtesy: '', contact_first_name: '', contact_last_name: '', contact_email: '', contact_phone_number: '', comment: ''},
                         email: '', phone_number: '', role: '', sub_entity: '', agreement_number: '',  comment: ''};

      if (aPartners && aPartners.length) {
            aPartners.forEach( (partnerItem) => {
              if (partnerItem && partnerItem.type === aPartnerType) {
                const aContactToMap = mainContact ? partnerItem.main_contact : partnerItem.contact;
                aPartner.type = this.formatFldAsString(partnerItem.type);
                aPartner.name = this.formatFldAsString(partnerItem.name);
                aPartner.logo_uri = this.formatFldAsString(partnerItem.logo_uri);
                const aFormattedAddress = this.formatLocation(partnerItem.address);
                aPartner.address.address = aFormattedAddress.address;
                aPartner.address.postal_code = aFormattedAddress.postal_code;
                aPartner.address.city = aFormattedAddress.city;
                aPartner.address.country = aFormattedAddress.country;
                aPartner.address.insee_code = aFormattedAddress.insee_code;
                aPartner.contact.contact_courtesy = (aContactToMap && aContactToMap.courtesy) ? CourtesyTypeMap.toString(this.formatFldAsString(aContactToMap.courtesy)) : '';
                aPartner.contact.contact_first_name = aContactToMap ? this.formatFldAsString(aContactToMap.first_name) : '';
                aPartner.contact.contact_last_name = aContactToMap ? this.formatFldAsString(aContactToMap.last_name) : '';
                aPartner.contact.contact_email = aContactToMap ? this.formatFldAsString(partnerItem.contact.email) : '';
                aPartner.contact.contact_phone_number = aContactToMap ?  this.formatFldAsString(aContactToMap.phone_number) : '';
                aPartner.email = this.formatFldAsString(partnerItem.email);
                aPartner.phone_number = this.formatFldAsString(partnerItem.phone_number);
                aPartner.role = this.formatFldAsString(partnerItem.role);
                aPartner.sub_entity = this.formatFldAsString(partnerItem.sub_entity);
                aPartner.agreement_number = this.formatFldAsString(partnerItem.agreement_number);
                aPartner.comment = this.formatFldAsString(partnerItem.comment);
              }
            });
        }
      return aPartner;
    }


    preparePhysicalPersonDetails(physicalPersonDetails: Individual, persons: Person[]) {
      const courtesy = this.formatFldAsString(physicalPersonDetails.courtesy);
      const firstName = this.formatFldAsString(physicalPersonDetails.first_name);
      const lastName = this.formatFldAsString(physicalPersonDetails.last_name);
      const birthName = this.formatFldAsString(physicalPersonDetails.birth_name);
      const birthDate = this.formatDateAsString(physicalPersonDetails.birth_date);
      const birthPlace = this.formatFldAsString(physicalPersonDetails.birth_place);
      const email = this.formatFldAsString(physicalPersonDetails.email);
      const phoneNumber = this.formatFldAsString(physicalPersonDetails.phone_number);

      const addressToUSe = this.getIndividualAddressToUse(physicalPersonDetails);
      const aFormattedAddress = this.formatLocation(addressToUSe);
      const address = aFormattedAddress.address;
      const postalCode = aFormattedAddress.postal_code;
      const city = aFormattedAddress.city;
      const country = aFormattedAddress.country;

      const maritalStatus = (physicalPersonDetails.family_situation && physicalPersonDetails.family_situation.marital_status) ? MaritalStatusMap.toString(physicalPersonDetails.courtesy, physicalPersonDetails.family_situation.marital_status) : '';
      const maritalStatusSince = physicalPersonDetails.family_situation ? this.formatDateAsString(physicalPersonDetails.family_situation.marital_status_since) : '';
      const isInRelationWith = (physicalPersonDetails.family_situation && physicalPersonDetails.family_situation.is_in_relation_with !== null && physicalPersonDetails.family_situation.is_in_relation_with !== undefined) ? Number(physicalPersonDetails.family_situation.is_in_relation_with) : null;
      const relationship = (isInRelationWith !== null && isInRelationWith !== undefined && isInRelationWith < persons.length && persons[isInRelationWith].civil) ? this.formatFldAsString(persons[isInRelationWith].civil.first_name) + ' ' + this.formatFldAsString(persons[isInRelationWith].civil.last_name) : 'Aucun';
      const matrimonyRegime = (physicalPersonDetails.family_situation && physicalPersonDetails.family_situation.matrimony_regime) ? this.formatFldAsString(MatrimonialRegime.toString(physicalPersonDetails.family_situation.matrimony_regime)): '';
      const divorceProcedure = (physicalPersonDetails.family_situation && physicalPersonDetails.family_situation.divorce_procedure) ? this.formatFldAsString(DivorceProcedureTypeMap.toString(physicalPersonDetails.family_situation.divorce_procedure)): '';
      const maritalCountry = physicalPersonDetails.family_situation ? this.formatFldAsString(physicalPersonDetails.family_situation.marital_country): '';

      const housingStatus = (physicalPersonDetails.housing && physicalPersonDetails.housing.housing_status) ? this.formatFldAsString(HousingStatusTypeMap.toString(physicalPersonDetails.housing.housing_status)): '';
      const housingStatusSince = physicalPersonDetails.housing ? this.formatDateAsString(physicalPersonDetails.housing.housing_status_since): '';


      const nationality = this.formatFldAsString(physicalPersonDetails.nationality);
      const aFormattedResidencePermit = this.formatResidencePermit(physicalPersonDetails.residence_permit);
      const residencePermitNumber = aFormattedResidencePermit.number;
      const residencePermitNumberDeliveryDate = aFormattedResidencePermit.delivery_date;
      const residencePermitNumberExpiryDate = aFormattedResidencePermit.expiry_date;

      const aFormattedBank = this.formatBank(physicalPersonDetails.bank_info);
      const currentBank = aFormattedBank.bank;
      const bankAgency = aFormattedBank.agency;
      const bic = aFormattedBank.bic;
      const iban = aFormattedBank.iban;
      const customerSince = aFormattedBank.customer_since;

      const aPhysicalBorrowerDetails = [
        {columns: [{width: '35%', text: 'Civilité:'}, {width: '65%', style: 'caseStyleBold', text: courtesy}]},
        {columns: [{width: '35%', text: 'Nom:'}, {width: '65%', style: 'caseStyleBold', text: lastName}]},
        {columns: [{width: '35%', text: 'Prénom:'}, {width: '65%', style: 'caseStyleBold', text: firstName}]},
        {columns: [{width: '35%', text: 'Nom de naissance:'}, {width: '65%', style: 'caseStyleBold', text: birthName}]},
        {columns: [{width: '35%', text: 'Téléphone:'}, {width: '65%', style: 'caseStyleBold', text: phoneNumber}]},
        {columns: [{width: '35%', text: 'Email:'}, {width: '65%', style: 'caseStyleBold', text: email}]},
        {columns: [{width: '35%', text: 'Adresse:'}, {width: '65%', style: 'caseStyleBold', text: address}]},
        {columns: [{width: '35%', text: 'Code postal:'}, {width: '65%', style: 'caseStyleBold', text: postalCode}]},
        {columns: [{width: '35%', text: 'Ville:'}, {width: '65%', style: 'caseStyleBold', text: city}]},
        {columns: [{width: '35%', text: 'Pays:'}, {width: '65%', style: 'caseStyleBold', text: country}]},

        {style: 'smallLineBreak', text: ''},

        {columns: [{width: '35%', text: 'Date de naissance:'}, {width: '65%', style: 'caseStyleBold', text: birthDate}]},
        {columns: [{width: '35%', text: 'Lieu de naissance:'}, {width: '65%', style: 'caseStyleBold', text: birthPlace}]},
        {columns: [{width: '35%', text: 'Status marital:'}, {width: '65%', style: 'caseStyleBold', text: maritalStatus}]},
        {columns: [{width: '35%', text: 'Depuis le:'}, {width: '65%', style: 'caseStyleBold', text: maritalStatusSince}]},
        {columns: [{width: '35%', text: 'Est lié à l\'emprunteur:'}, {width: '65%', style: 'caseStyleBold', text: relationship}]},
        {columns: [{width: '35%', text: 'Procédure de divorce:'}, {width: '65%', style: 'caseStyleBold', text: divorceProcedure}]},
        {columns: [{width: '35%', text: 'Régime matrimonial:'}, {width: '65%', style: 'caseStyleBold', text: matrimonyRegime}]},
        {columns: [{width: '35%', text: 'Pays de mariage:'}, {width: '65%', style: 'caseStyleBold', text: maritalCountry}]},
        {columns: [{width: '35%', text: 'Statut d\'habitation:'}, {width: '65%', style: 'caseStyleBold', text: housingStatus}]},
        {columns: [{width: '35%', text: 'Depuis le:'}, {width: '65%', style: 'caseStyleBold', text: housingStatusSince}]},
        {columns: [{width: '35%', text: 'Nationalité:'}, {width: '65%', style: 'caseStyleBold', text: nationality}]},
        {columns: [{width: '35%', text: 'Titre de séjour N°:'}, {width: '65%', style: 'caseStyleBold', text: residencePermitNumber}]},
        {columns: [{width: '35%', text: 'Délivré le:'}, {width: '65%', style: 'caseStyleBold', text: residencePermitNumberDeliveryDate}]},
        {columns: [{width: '35%', text: 'Expirant le:'}, {width: '65%', style: 'caseStyleBold', text: residencePermitNumberExpiryDate}]},

        {style: 'smallLineBreak', text: ''},

        {columns: [{width: '35%', text: 'Banque actuelle:'}, {width: '65%', style: 'caseStyleBold', text: currentBank}]},
        {columns: [{width: '35%', text: 'Agence:'}, {width: '65%', style: 'caseStyleBold', text: bankAgency}]},
        {columns: [{width: '35%', text: 'Client depuis le:'}, {width: '65%', style: 'caseStyleBold', text: customerSince}]},
        {columns: [{width: '35%', text: 'BIC:'}, {width: '65%', style: 'caseStyleBold', text: bic}]},
        {columns: [{width: '35%', text: 'IBAN:'}, {width: '65%', style: 'caseStyleBold', text: iban}]}
      ];
      return aPhysicalBorrowerDetails;
    }


    prepareLegalPersonPersonDetails(legalPersonDetails: LegalPerson) {
      const name = this.formatFldAsString(legalPersonDetails.name);
      const type = legalPersonDetails.type ? LegalPersonTypeMap.toString(legalPersonDetails.structure_type) : '';
      const legalStatus = this.formatFldAsString(legalPersonDetails.legal_status);
      const phoneNumber = this.formatFldAsString(legalPersonDetails.phone_number);
      const email = this.formatFldAsString(legalPersonDetails.email);

      const aFormattedAddress = this.formatLocation(legalPersonDetails.address);
      const address = aFormattedAddress.address;
      const postalCode = aFormattedAddress.postal_code;
      const city = aFormattedAddress.city;
      const country = aFormattedAddress.country;

      const aFormattedBank = this.formatBank(legalPersonDetails.bank_info);
      const currentBank = aFormattedBank.bank;
      const bankAgency = aFormattedBank.agency;
      const bic = aFormattedBank.bic;
      const iban = aFormattedBank.iban;
      const customerSince = aFormattedBank.customer_since;

      const aLegalPersonBorrowerDetails = [
        {columns: [{width: '35%', text: 'Nom:'}, {width: '65%', style: 'caseStyleBold', text: name}]},
        {columns: [{width: '35%', text: 'Nature:'}, {width: '65%', style: 'caseStyleBold', text: type}]},
        {columns: [{width: '35%', text: 'Forme juridique:'}, {width: '65%', style: 'caseStyleBold', text: legalStatus}]},
        {columns: [{width: '35%', text: 'Téléphone:'}, {width: '65%', style: 'caseStyleBold', text: phoneNumber}]},
        {columns: [{width: '35%', text: 'Email:'}, {width: '65%', style: 'caseStyleBold', text: email}]},
        {columns: [{width: '35%', text: 'Adresse:'}, {width: '65%', style: 'caseStyleBold', text: address}]},
        {columns: [{width: '35%', text: 'Code postal:'}, {width: '65%', style: 'caseStyleBold', text: postalCode}]},
        {columns: [{width: '35%', text: 'Ville:'}, {width: '65%', style: 'caseStyleBold', text: city}]},
        {columns: [{width: '35%', text: 'Pays:'}, {width: '65%', style: 'caseStyleBold', text: country}]},

        {style: 'smallLineBreak', text: ''},

        {columns: [{width: '35%', text: 'Banque actuelle:'}, {width: '65%', style: 'caseStyleBold', text: currentBank}]},
        {columns: [{width: '35%', text: 'Agence:'}, {width: '65%', style: 'caseStyleBold', text: bankAgency}]},
        {columns: [{width: '35%', text: 'Client depuis le:'}, {width: '65%', style: 'caseStyleBold', text: customerSince}]},
        {columns: [{width: '35%', text: 'BIC:'}, {width: '65%', style: 'caseStyleBold', text: bic}]},
        {columns: [{width: '35%', text: 'IBAN:'}, {width: '65%', style: 'caseStyleBold', text: iban}]}
      ];
      return aLegalPersonBorrowerDetails;
    }


    prepareEmployeeDetails(employeeDetails: Employee) {
      const profession = this.formatFldAsString(employeeDetails.profession);
      const contractType = employeeDetails.contract_type ? this.formatFldAsString(ContractTypeTypeMap.toString(employeeDetails.contract_type)) : '';
      const contractSubType = employeeDetails.sub_contract_type ? this.formatFldAsString(SubContractTypeTypeMap.toString(employeeDetails.sub_contract_type)) : '';
      const employer = this.formatFldAsString(employeeDetails.employer);

      const aFormattedAddress = this.formatLocation(employeeDetails.employer_address);
      const address = aFormattedAddress.address;
      const postalCode = aFormattedAddress.postal_code;
      const city = aFormattedAddress.city;
      const country = aFormattedAddress.country;

      const employeesNumber = this.formatFldAsString(employeeDetails.employees_number);

      const hiringDate = this.formatDateAsString(employeeDetails.hiring_date);
      const endContractDate = this.formatDateAsString(employeeDetails.end_contract_date);
      const endTrialPeriod = this.formatDateAsString(employeeDetails.end_trial_date);

      const aEmployeeDetails = [
        {columns: [{width: '45%', text: 'Profession:'}, {width: '55%', style: 'caseStyleBold', text: profession}]},
        {columns: [{width: '45%', text: 'Type de contrat:'}, {width: '55%', style: 'caseStyleBold', text: contractType}]},
        {columns: [{width: '45%', text: 'Spécificité du contrat:'}, {width: '55%', style: 'caseStyleBold', text: contractSubType}]},
        {columns: [{width: '45%', text: 'Employeur:'}, {width: '55%', style: 'caseStyleBold', text: employer}]},
        {columns: [{width: '45%', text: 'Adresse:'}, {width: '55%', style: 'caseStyleBold', text: address}]},
        {columns: [{width: '45%', text: 'Code postal:'}, {width: '55%', style: 'caseStyleBold', text: postalCode}]},
        {columns: [{width: '45%', text: 'Ville:'}, {width: '55%', style: 'caseStyleBold', text: city}]},
        {columns: [{width: '45%', text: 'Pays:'}, {width: '55%', style: 'caseStyleBold', text: country}]},

        {style: 'smallLineBreak', text: ''},

        {columns: [{width: '45%', text: 'Nombre d\'employé(s):'}, {width: '55%', style: 'caseStyleBold', text: employeesNumber}]},
        {columns: [{width: '45%', text: 'Date d\'embauche:'}, {width: '55%', style: 'caseStyleBold', text: hiringDate}]},
        {columns: [{width: '45%', text: 'Date de fin de contrat:'}, {width: '55%', style: 'caseStyleBold', text: endContractDate}]},
        {columns: [{width: '45%', text: 'Date de fin de période d\'essai:'}, {width: '55%', style: 'caseStyleBold', text: endTrialPeriod}]},
      ];
      return aEmployeeDetails;
    }


    prepareIndependantDetails(independantDetails: SelfEmployed) {
      const name = this.formatFldAsString(independantDetails.company_name);
      const profession = this.formatFldAsString(independantDetails.profession);

      const legalStatus = this.formatFldAsString(independantDetails.legal_status);
      const apeCode = this.formatFldAsString(independantDetails.ape_code);
      const rcsNumber = this.formatFldAsString(independantDetails.rcs_number);
      const siret = this.formatFldAsString(independantDetails.siret);
      const activityStartDate = this.formatDateAsString(independantDetails.activity_start_date);
      const bailStartDate = this.formatDateAsString(independantDetails.commercial_lease_start_date);
      const bailEndDate = this.formatDateAsString(independantDetails.commercial_lease_end_date);
      const rentAmount = this.formatMonetaryNbr(independantDetails.rent_amount);
      const employeesNumber = this.formatNbr(independantDetails.employees_number);
      const businessAssetsOwner = (independantDetails.business_assets_owner !== null && independantDetails.business_assets_owner !== undefined) ? (independantDetails.business_assets_owner ? 'Oui' : 'Non') : '';
      const businessAssetsValue = this.formatMonetaryNbr(independantDetails.business_assets_value);
      const collateral = (independantDetails.collateral !== null && independantDetails.collateral !== undefined) ? (independantDetails.collateral ? 'Oui' : 'Non') : '';
      const remainingCapital = this.formatMonetaryNbr(independantDetails.remaining_capital);

      const aFormattedAddress = this.formatLocation(independantDetails.workplace_address);
      const workplaceAddress = aFormattedAddress.address;
      const workplacePostalCode = aFormattedAddress.postal_code;
      const workplaceCity = aFormattedAddress.city;
      const workplaceCountry = aFormattedAddress.country;

      const aIndependantDetails = [
        {columns: [{width: '45%', text: 'Nom de l\'entreprise:'}, {width: '55%', style: 'caseStyleBold', text: name}]},
        {columns: [{width: '45%', text: 'Profession:'}, {width: '55%', style: 'caseStyleBold', text: profession}]},
        {columns: [{width: '45%', text: 'Forme juridique:'}, {width: '55%', style: 'caseStyleBold', text: legalStatus}]},
        {columns: [{width: '45%', text: 'Code APE:'}, {width: '55%', style: 'caseStyleBold', text: apeCode}]},
        {columns: [{width: '45%', text: 'Numéro RCS:'}, {width: '55%', style: 'caseStyleBold', text: rcsNumber}]},
        {columns: [{width: '45%', text: 'Numéro de SIRET:'}, {width: '55%', style: 'caseStyleBold', text: siret}]},
        {columns: [{width: '45%', text: 'Date début d\'activité:'}, {width: '55%', style: 'caseStyleBold', text: activityStartDate}]},
        {columns: [{width: '45%', text: 'Date de début du bail:'}, {width: '55%', style: 'caseStyleBold', text: bailStartDate}]},
        {columns: [{width: '45%', text: 'Date de fin du bail:'}, {width: '55%', style: 'caseStyleBold', text: bailEndDate}]},
        {columns: [{width: '45%', text: 'Montant du loyer:'}, {width: '55%', style: 'caseStyleBold', text: rentAmount}]},
        {columns: [{width: '45%', text: 'Nombre d\'employé(s):'}, {width: '55%', style: 'caseStyleBold', text: employeesNumber}]},
        {columns: [{width: '45%', text: 'Propriétaire du fond ?'}, {width: '55%', style: 'caseStyleBold', text: businessAssetsOwner}]},
        {columns: [{width: '45%', text: 'Valeur des actifs:'}, {width: '55%', style: 'caseStyleBold', text: businessAssetsValue}]},
        {columns: [{width: '45%', text: 'Nantissement ?'}, {width: '55%', style: 'caseStyleBold', text: collateral}]},
        {columns: [{width: '45%', text: 'Capital restant dû (si le fond est acquis via un crédit):'}, {width: '55%', style: 'caseStyleBold', text: remainingCapital}]},
        {columns: [{width: '45%', text: 'Adresse:'}, {width: '55%', style: 'caseStyleBold', text: workplaceAddress}]},
        {columns: [{width: '45%', text: 'Code postal:'}, {width: '55%', style: 'caseStyleBold', text: workplacePostalCode}]},
        {columns: [{width: '45%', text: 'Ville:'}, {width: '55%', style: 'caseStyleBold', text: workplaceCity}]},
        {columns: [{width: '45%', text: 'Pays:'}, {width: '55%', style: 'caseStyleBold', text: workplaceCountry}]},
      ];
      return aIndependantDetails;
    }


    prepareProfessionDetails(professionDetails: ProfessionDetails) {
      if(professionDetails) {
        const socioProfessionalGroup = (professionDetails.socio_professional_group && professionDetails.socio_professional_group.type) ? GroupeSocioProfessionnal.toString(professionDetails.socio_professional_group.type) : '';
        const socioProfessionalCategory = (professionDetails.socio_professional_group && professionDetails.socio_professional_group.category) ? CategorySocioProfessionnal.toString(professionDetails.socio_professional_group.category) : '';

        const aStatus = professionDetails.status ? WorkerStatus.toString(professionDetails.status) : '';
        const worker = professionDetails.worker ? professionDetails.worker : undefined;

        let workerDetails = [];
        if (worker && worker.type === 'EMPLOYEE') {
          workerDetails = this.prepareEmployeeDetails(worker);
        } else if (worker && worker.type === 'SELFEMPLOYED') {
          workerDetails = this.prepareIndependantDetails(worker);
        }

        const aProfessionDetails = [
          {columns: [{width: '45%', text: 'Groupe SP:'}, {width: '55%', style: 'caseStyleBold', text: socioProfessionalGroup}]},
          {columns: [{width: '45%', text: 'Catégorie SP:'}, {width: '55%', style: 'caseStyleBold', text: socioProfessionalCategory}]},
          {columns: [{width: '45%', text: 'Status:'}, {width: '55%', style: 'caseStyleBold', text: aStatus}]},
          {style: 'bigLineBreak', text: ''},
          ...workerDetails
        ];
        return aProfessionDetails;
      }
      return [];
    }


    formatRevenuesTable(revenuesList) {
      let revenuesTable = null;
      if (revenuesList) {
        const revenues = [];
        revenuesList.forEach(revenue => {
          const revenueType = revenue.type ? RevenueTypeMap.toString(revenue.type) : '';
          const monthlyAmount = revenue.monthly_amount ? this.formatMonetaryNbr(revenue.monthly_amount.figure) : this.formatMonetaryNbr(0);
          const weight = revenue.monthly_amount ? this.formatNbr(revenue.monthly_amount.weight) : this.formatNbr(100);
          const comment = revenue.comment ? revenue.comment : '';
          revenues.push([{width: '25%', text: revenueType}, {width: '25%', text: monthlyAmount}, {width: '25%', text: weight + '%'}, {width: '25%', text: comment}]);
        });

        revenuesTable = revenues.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['25%', '25%', '25%', '25%'],
            body: [
              LocaleUtils.revenuesTableHeader.map(v => ({style: 'thead', text: v, alignment: 'center'})),
              ...revenues
            ]
          }
        } : null;
      }
      return revenuesTable;
    }


    formatChargesTable(chargesList) {
      let chargesTable = null;
      if (chargesList) {
        const charges = [];
        chargesList.forEach(charge => {
          const chargeType = charge.type ? ChargeTypeMap.toString(charge.type) : '';
          const continueAfterProject = charge.continue_after_project ? 'Charge avant projet' : 'Charge après projet';
          const monthlyAmount = (charge.monthly_amount && charge.monthly_amount.figure) ? this.formatMonetaryNbr(charge.monthly_amount.figure) : this.formatMonetaryNbr(0);
          const weight = (charge.monthly_amount && charge.monthly_amount.weight) ? this.formatNbr(charge.monthly_amount.weight) : this.formatNbr(100);
          const comment = charge.comment ? charge.comment : '';
          charges.push([{width: '20%', text: chargeType}, {width: '20%', text: continueAfterProject}, {width: '20%', text: monthlyAmount}, {width: '20%', text: weight + '%'}, {width: '20%', text: comment}]);
        });

        chargesTable = charges.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['20%', '20%', '20%', '20%', '20%'],
            body: [
              LocaleUtils.chargesTableHeader.map(v => ({style: 'thead', text: v, alignment: 'center'})),
              ...charges
            ]
          }
        } : null;
      }
      return chargesTable;
    }


    formatPatrimonyItem(patrimonyItem, index) {
      const type = patrimonyItem.type ? PatrimonyType.toString(patrimonyItem.type) : '';
      const value = this.formatMonetaryNbr(patrimonyItem.value);
      const isForSale = patrimonyItem.isForSale ? 'Oui' : 'Non';
      let breakup = 'Pleine propriété';
      if(patrimonyItem.breakup !== null && patrimonyItem.breakup !== undefined && patrimonyItem.breakup.type !== null && patrimonyItem.breakup.type !== undefined) {
        breakup = BreakupTypeMap.toString(patrimonyItem.breakup.type);
        if(patrimonyItem.breakup.type !== 'PLEINE_PROPRIETE' && patrimonyItem.breakup.portion !== null && patrimonyItem.breakup.portion !== undefined) {
          breakup += ' à hauteur de ' + this.formatNbr(patrimonyItem.breakup.portion) + '%';
        }
      }
      const buyingOrOpeningDate = this.formatDateAsString(patrimonyItem.buying_or_opening_date);
      const remainingCapital = this.formatMonetaryNbr(patrimonyItem.remaining_capital);
      const comment = this.formatFldAsString(patrimonyItem.comment);

      return [index, type, value, breakup, buyingOrOpeningDate, remainingCapital, comment, isForSale];
    }


    formatPatrimonyForSaleItem(aForSaleItem, index) {
      const price = this.formatMonetaryNbr(aForSaleItem.price);
      const agencyFees = this.formatMonetaryNbr(aForSaleItem.agency_fees);
      const taxes = this.formatMonetaryNbr(aForSaleItem.taxes);
      const salesAgreementDate = aForSaleItem.dates ? this.formatDateAsString(aForSaleItem.dates.sales_agreement_date) : '';
      const conditionsPrecedentEndDate = aForSaleItem.dates ? this.formatDateAsString(aForSaleItem.dates.conditions_precedent_end_date) : '';
      const signatureDate = aForSaleItem.dates ? this.formatDateAsString(aForSaleItem.dates.signature_date) : '';
      const agencies = [];
      if (aForSaleItem.agencies) {
        aForSaleItem.agencies.forEach(agency => {
          agencies.push(this.extractPartnerContact('AGENCY', agency));
        });
      }
      const notaries = [];
      if (aForSaleItem.notaries) {
        aForSaleItem.notaries.forEach(notary => {
          notaries.push(this.extractPartnerContact('NOTARY', notary));
        });
      }
      return [index, price, agencyFees, taxes, salesAgreementDate, conditionsPrecedentEndDate, signatureDate];
    }


    formatPatrimonyTable(patrimonyList) {
      let patrimonyTable = null;
      if (patrimonyList) {
        const aPatrimony = [];
        patrimonyList.forEach((patrimonyItem, index) => {
          aPatrimony.push(this.formatPatrimonyItem(patrimonyItem, index+1));
        });
        patrimonyTable = aPatrimony.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['12.5%', '12.5%', '12.5%', '12.5%', '12.5%', '12.5%', '12.5%', '12.5%'],
            body: [
              LocaleUtils.patrimonyTableHeader.map(v => ({style: 'thead', text: v, alignment: 'center'})),
              ...aPatrimony,
            ]
          }
        } : null;
      }
      return patrimonyTable;
    }


    formatPatrimonyForSaleTable(patrimonyList) {
      let patrimonyForSaleTable = null;
      if (patrimonyList) {
        const aPatrimonyForSaleInfo = [];
        patrimonyList.forEach((patrimonyItem, index) => {
          if (patrimonyItem.for_sale !== null && patrimonyItem.for_sale !== undefined && patrimonyItem.for_sale.price) {
            aPatrimonyForSaleInfo.push(this.formatPatrimonyForSaleItem(patrimonyItem.for_sale, index+1));
          }
        });
        patrimonyForSaleTable = aPatrimonyForSaleInfo.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['14.285%', '14.285%', '14.285%', '14.285%', '14.285%', '14.285%', '14.285%'],
            body: [
              LocaleUtils.patrimonyForSaleTableHeader.map(v => ({style: 'thead', text: v, alignment: 'center'})),
              ...aPatrimonyForSaleInfo,
            ]
          }
        } : null;
      }
      return patrimonyForSaleTable;
    }

    formatCurrentLoanItem(aCurrentLoanItem) {
      const type = this.formatFldAsString(LoansType.toString(aCurrentLoanItem.type));
      const future = this.formatFldAsString(LoanFutureType.toString(aCurrentLoanItem.future));
      const figure = aCurrentLoanItem.monthly_payment ? this.formatMonetaryNbr(aCurrentLoanItem.monthly_payment.figure) : this.formatMonetaryNbr(0);
      const weight = aCurrentLoanItem.monthly_payment ? this.formatNbr(aCurrentLoanItem.monthly_payment.weight) + '%' : this.formatNbr(100) + '%';
      const remainingCapital = this.formatMonetaryNbr(aCurrentLoanItem.remaining_capital);
      const startDate = this.formatDateAsString(aCurrentLoanItem.start_date);
      const endDate = this.formatDateAsString(aCurrentLoanItem.end_date);
      const lender = this.formatFldAsString(aCurrentLoanItem.lender);
      return [type, future, figure, weight, remainingCapital, startDate, endDate, lender];
    }

    formatCallItem(aCall: CallForFunds) {
      const reason = this.formatFldAsString(aCall.reason);
      const date = this.formatFldAsString(aCall.date);
      const percentage = this.formatFldAsString(aCall.percentage) + '%';
      return [reason, date, percentage];
    }

    formatCallsForFundsTable(callsForFunds) {
      let callsForFundsTable = null;
      if (callsForFunds) {
        const aCallsForFundsList = [];
        callsForFunds?.calls?.forEach((callForFunds) => {
          aCallsForFundsList.push(this.formatCallItem(callForFunds));
        });
        callsForFundsTable = aCallsForFundsList.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['50%', '25%', '25%'],
            body: [
              LocaleUtils.callsForFundsTableHeader.map(v => ({style: 'thead', text: v, alignment: 'center'})),
              ...aCallsForFundsList,
            ]
          }
        } : null;
      }
      return callsForFundsTable;
    }

    formatCurrentLoansTable(currentLoansList) {
      let currentLoansTable = null;
      if (currentLoansList) {
        const aCurrentLoanInfo = [];
        currentLoansList.forEach((currentLoan) => {
          aCurrentLoanInfo.push(this.formatCurrentLoanItem(currentLoan));
        });
        currentLoansTable = aCurrentLoanInfo.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['12.5%', '12.5%', '12.5%', '12.5%', '12.5%', '12.5%', '12.5%', '12.5%'],
            body: [
              LocaleUtils.currentLoansTableHeader.map(v => ({style: 'thead', text: v, alignment: 'center'})),
              ...aCurrentLoanInfo,
            ]
          }
        } : null;
      }
      return currentLoansTable;
    }


    prepareFinanceDetails(financeDetails) {
      if (financeDetails) {
        let personalFunding = '';
        let revenuesTitle = 'Revenus mensuels nets avant impôt:';
        let revenuesTable = null;
        let chargesTitle = 'Charges mensuelles:';
        let chargesTable = null;
        let patrimonyTitle = 'Patrimoine:';
        let patrimonyTable = null;
        let patrimonyForSaleTable = null;
        let patrimonyForSaleTitle = 'Éléments du patrimoine en vente:';
        let creditTitle = 'Crédit en cours:';
        let creditTable = null;

        personalFunding = this.formatMonetaryNbr(financeDetails.personal_funding);
        revenuesTable = this.formatRevenuesTable(financeDetails.revenues);
        revenuesTitle = (revenuesTable === null) ? revenuesTitle + ' aucun.' : revenuesTitle;
        chargesTable = this.formatChargesTable(financeDetails.charges);
        chargesTitle = (chargesTable === null) ? chargesTitle + ' aucunes.' : chargesTitle;
        patrimonyTable = this.formatPatrimonyTable(financeDetails.patrimony);
        patrimonyTitle = (patrimonyTable === null) ? patrimonyTitle + ' aucun.' : patrimonyTitle;
        patrimonyForSaleTable = this.formatPatrimonyForSaleTable(financeDetails.patrimony);
        patrimonyForSaleTitle = (patrimonyForSaleTable === null) ? patrimonyForSaleTitle + ' aucun.' : patrimonyForSaleTitle;
        creditTable = this.formatCurrentLoansTable(financeDetails.current_loans);
        creditTitle = (creditTable === null) ? creditTitle + ' aucun.' : creditTitle;

        let fiscalReferenceRevenueNminus1 = '';
        let fiscalReferenceRevenueNminus2 = '';
        if (financeDetails.income_tax) {
          fiscalReferenceRevenueNminus1 = this.formatMonetaryNbr(financeDetails.income_tax.fiscal_reference_revenue_Nminus1);
          fiscalReferenceRevenueNminus2 = this.formatMonetaryNbr(financeDetails.income_tax.fiscal_reference_revenue_Nminus2);
        }

        const aFinanceDetails = [
          {columns: [{width: '55%', text: 'Apport au projet:'}, {width: '45%', style: 'caseStyleBold', text: personalFunding}]},
          {columns: [{width: '55%', text: 'Revenu fiscal de référence année N-1:'}, {width: '45%', style: 'caseStyleBold', text: fiscalReferenceRevenueNminus1}]},
          {columns: [{width: '55%', text: 'Revenu fiscal de référence année N-2:'}, {width: '45%', style: 'caseStyleBold', text: fiscalReferenceRevenueNminus2}]},
          {style: 'bigLineBreak', text: ''},
          {style: 'h3bold', width: '100%', text: revenuesTitle},
          {style: 'smallLineBreak', text: ''},
          revenuesTable,
          {style: 'bigLineBreak', text: ''},
          {style: 'h3bold', width: '100%', text: chargesTitle},
          {style: 'smallLineBreak', text: ''},
          chargesTable,
          {style: 'bigLineBreak', text: ''},
          {style: 'h3bold', width: '100%', text: patrimonyTitle},
          {style: 'smallLineBreak', text: ''},
          patrimonyTable,
          {style: 'bigLineBreak', text: ''},
          {style: 'h3bold', width: '100%', text: patrimonyForSaleTitle},
          {style: 'smallLineBreak', text: ''},
          patrimonyForSaleTable,
          {style: 'bigLineBreak', text: ''},
          {style: 'h3bold', width: '100%', text: creditTitle},
          {style: 'smallLineBreak', text: ''},
          creditTable,
        ];
        return aFinanceDetails;
      }
      return [];
    }


    prepareHouseholdDetails(householdDetails) {
      const peopleCount = this.formatNbr(householdDetails.people_count);
      const dependentPersonsCount = this.formatNbr(householdDetails.dependent_persons_count);
      const childrenCount = this.formatNbr(householdDetails.children_count);
      const firstTimeBuyer = householdDetails.first_time_buyer ? 'Le ménage est primo-accédant.' : 'Le ménage n\'est pas primo-accédant.';

      const children = [];
      if (householdDetails.children) {
        householdDetails.children.forEach(child => {
          const isSharedCustody = child.shared_custody ? 'Oui' : 'Non';
          children.push([{width: '35%', text: LocaleUtils.computeAgeFromBirthDate(child.birth_date)}, {width: '65%', text: isSharedCustody}]);
        });
      }

      const childrenTable = children.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['20%', '20%'],
            body: [
              [{width: '35%', style: 'thead', text: 'Age'}, {width: '65%', style: 'thead', text: 'Garde alternée'}],
              ...children
            ]
          }
        } : {};

      const childrenTitle = 'Enfants: ' + children.length;


      const dependentPersons = [];
      if (householdDetails.dependent_persons) {
        householdDetails.dependent_persons.forEach(dependentPerson => {
          const typeOfDependentPerson = DependentPersonTypeMap.toString(dependentPerson.type);
          const comment = dependentPerson.comment;
          dependentPersons.push([{width: '35%', text: typeOfDependentPerson}, {width: '65%', text: comment}]);
        });
      }

      const dependentPersonTable = dependentPersons.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['20%', '40%'],
            body: [
              [{width: '35%', style: 'thead', text: 'Relation'}, {width: '65%', style: 'thead', text: 'Commentaire'}],
              ...dependentPersons
            ]
          }
        } : {};

      const dependentPersonsTitle = dependentPersons.length ? 'Personnes dépendantes:' : '';

      const financeHouseholdLevel = this.prepareFinanceDetails(householdDetails.finance);

      const aHouseholdDetails = [
        {columns: [{width: '95%', text: firstTimeBuyer}, {width: '5%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '35%', text: 'Nombre de personne(s):'}, {width: '65%', style: 'caseStyleBold', text: peopleCount}]},
        {columns: [{width: '35%', text: 'Dont nombre d\'enfant(s):'}, {width: '65%', style: 'caseStyleBold', text: childrenCount}]},
        {columns: [{width: '35%', text: 'Dont nombre de personne(s) à charge:'}, {width: '65%', style: 'caseStyleBold', text: dependentPersonsCount}]},

        {style: 'smallLineBreak', text: ''},
        {style: 'h3bold', width: '100%', text: childrenTitle},
        childrenTable,
        {style: 'h3bold', width: '100%', text: dependentPersonsTitle},
        dependentPersonTable,
        {style: 'smallLineBreak', text: ''},
        {style: 'h2bold', width: '100%', text: 'Apport, revenus, charges et patrimoine:'},
        financeHouseholdLevel
      ];

      return aHouseholdDetails;
    }



    formatPartnerItem(partnerItem: ActivePartner) {
      let type = '';
      let name = '';
      let address = '';
      let postalCode = '';
      let city = '';
      let country = '';
      const phoneNumber = '';
      const email = '';
      let agreementNumber = '';
      let contactCourtesy = '';
      let contactFirstName = '';
      let contactLastName = '';
      let contactPhoneNumber = '';
      let contactEmail = '';
      let role = '';
      let subEntity = '';
      let comment = '';

      if (partnerItem) {
        type = partnerItem.type ? PartnerTypeMap.toString(partnerItem.type) : '';
        name = this.formatFldAsString(partnerItem.name);
        subEntity = this.formatFldAsString(partnerItem.sub_entity);
        const aFormattedAddress = this.formatLocation(partnerItem.address);
        address = aFormattedAddress.address;
        postalCode = aFormattedAddress.postal_code;
        city = aFormattedAddress.city;
        country = aFormattedAddress.country;
        contactCourtesy = (partnerItem.contact && partnerItem.contact.courtesy) ? this.formatFldAsString(CourtesyTypeMap.toString(partnerItem.contact.courtesy)) : '';
        contactFirstName = (partnerItem.contact && partnerItem.contact.first_name) ? this.formatFldAsString(partnerItem.contact.first_name) : '';
        contactLastName = (partnerItem.contact && partnerItem.contact.last_name) ? this.formatFldAsString(partnerItem.contact.last_name) : '';
        contactPhoneNumber = (partnerItem.contact && partnerItem.contact.phone_number) ? this.formatFldAsString(partnerItem.contact.phone_number) : '';
        contactEmail = (partnerItem.contact && partnerItem.contact.email) ? this.formatFldAsString(partnerItem.contact.email) : '';
        agreementNumber = this.formatFldAsString(partnerItem.agreement_number);
        role = this.formatFldAsString(RoleTypeMap.toString(partnerItem.role));
        comment = this.formatFldAsString(partnerItem.comment);
      }

      // Format address correctly even if incomplete
      address = (address && postalCode) ? address + ', ' + postalCode : address + postalCode;
      address = (address && city) ? address + ', ' + city : address + city;
      address = (address && country) ? address + ', ' + country : address + country;

      contactCourtesy = contactCourtesy ? contactCourtesy + ' ' : '';
      const contactName = contactCourtesy + contactFirstName + ' ' + contactLastName;

      return [type, name, subEntity, address, contactName, contactPhoneNumber, contactEmail, agreementNumber, role];
    }


    preparePartnersList(partnersList) {
      const partnersItemsProcessed = [];
      if (partnersList && partnersList.length) {
          partnersList.forEach( function(partnerItem) {
            partnersItemsProcessed.push(this.formatPartnerItem(partnerItem));
          }, this);
      }

      return partnersItemsProcessed;
    }


    encodePartnersTable(aPartners: ActivePartner[]) {
      let aPreparedPartnersList = [];
      const aPreparedFullPartnersList = [];
      aPreparedPartnersList = this.preparePartnersList(aPartners);

      if (aPreparedPartnersList.length) {
        aPreparedFullPartnersList.push({style: 'bigLineBreak', text: '', pageOrientation: 'landscape', pageBreak: 'before'});
        aPreparedFullPartnersList.push({style: 'bigLineBreak', text: ''});
        aPreparedFullPartnersList.push({style: 'h2', text: 'Intervenants sur le projet'});
        aPreparedFullPartnersList.push({style: 'bigLineBreak', text: ''});
        aPreparedFullPartnersList.push({
          table: {
            style: 'table',
            headerRows: 1,
            // widths: '100%',
            body: [
              LocaleUtils.partnersTableHeader.map(v => ({style: 'thead', text: v, alignment: 'center'})),
              ...aPreparedPartnersList
            ]
          },
        });
      aPreparedFullPartnersList.push({text: '', pageOrientation: 'landscape', pageBreak: 'before'});
      }
      return aPreparedFullPartnersList;
    }


    encodeCase(aCase: Case) {
      let legalPerson = null;
      const aBody = [];
      if (aCase && aCase.actor) {
        if (aCase.actor.type === 'LEGAL_PERSON') {
          legalPerson = this.prepareLegalPersonPersonDetails(aCase.actor);
          aBody.push({style: 'h2', text: 'Personne morale'});
          aBody.push(...legalPerson);
        }

        // HOUSEHOLD
        if (aCase && aCase.actor && aCase.actor.type === 'HOUSEHOLD') {
          const aPreparedHouseholdDetails = [];
          aPreparedHouseholdDetails.push({style: 'h2', text: 'Informations relatives au ménage'});
          aPreparedHouseholdDetails.push({style: 'bigLineBreak', text: ''});
          aPreparedHouseholdDetails.push(...this.prepareHouseholdDetails(this.aCase.actor));
          aPreparedHouseholdDetails.push({style: 'smallLineBreak', text: ''});
          aPreparedHouseholdDetails.push({text: 'Fin des informations relatives au ménage'});
          aPreparedHouseholdDetails.push({canvas: [{ type: 'line', x1: 0, y1: 5, x2: 842 - 2 * 40, y2: 5, lineWidth: 3 }]}),
          aPreparedHouseholdDetails.push({text: '', pageOrientation: 'landscape', pageBreak: 'before'});
          aBody.push(...aPreparedHouseholdDetails);
        }

        // PERSONS
        aCase.actor.persons.forEach( (person, index) => {
            if (aCase.actor.type === 'LEGAL_PERSON' || (aCase.actor.type === 'HOUSEHOLD' && person.is_borrower === true)) {
              const formattedCivilDetails = this.preparePhysicalPersonDetails(person.civil, aCase.actor.persons);
              const formattedProfessionDetails = this.prepareProfessionDetails(person.profession);

              const firstName = this.formatFldAsString(person.civil?.first_name);
              const lastName = this.formatFldAsString(person.civil?.last_name);
              aBody.push({style: 'h2', text: 'Informations emprunteur ' + (index+1).toString() + ': ' + firstName + ' ' + lastName });
              aBody.push({style: 'bigLineBreak', text: ''});
              const aTable = [];
              aTable.push([ [{style: 'h3bold', text: 'Etat civil'}], [{style: 'h3bold', text: 'Profession'}] ]);
              aTable.push([ [...formattedCivilDetails], [...formattedProfessionDetails]]);
              aBody.push({ table: {widths: [ '50%', '50%'], body: [...aTable] }, layout: 'noBorders' });

              aBody.push({style: 'bigLineBreak', text: ''});
              aBody.push({style: 'h2bold', text: 'Apport, revenus, charges et patrimoine'});
              aBody.push(...this.prepareFinanceDetails(person.finance));
              aBody.push({style: 'smallLineBreak', text: ''});
              aBody.push({text: 'Fin des informations relatives à l\'emprunteur ' + (index+1).toString() + ': ' + firstName + ' ' + lastName});
              aBody.push({canvas: [{ type: 'line', x1: 0, y1: 5, x2: 842 - 2 * 40, y2: 5, lineWidth: 3 }]});
              // Do not jump line after last borrower
              if (index !== (aCase.actor.persons.length-1)) {
                aBody.push({text: '', pageOrientation: 'landscape', pageBreak: 'before'});
              }
            }
          }
        )
      }

      const anEncodedCase = [
          {style: 'h2', text: 'Informations relatives aux emprunteurs'},
          {style: 'bigLineBreak', text: ''},
          ...aBody
        ];
        return anEncodedCase;
    }


    loanTables(results: FundingResults): any {
        const amortizationTable = LoanUtils.generateAmortizationTable(results.loans);

        const amortizationTableHeaders = [];
        LoanUtils.formatAmortizationTablesHeaders(results.loans, amortizationTable, amortizationTableHeaders, []);

        const amortizationTableFormatted = [];
        // Loop on the loans
        Object.values(amortizationTable).forEach( (loan, index) => {
          // Loop on the instalements
          const tempArray = [];
          for (const instalement of loan) {
            // Convert JSON/Object formatted instalement into array
            const tempObject = Object.keys(instalement).map(key => instalement[key]);
            tempArray.push(tempObject);
          }
          amortizationTableFormatted.push(this.loanTable(tempArray, results.loans.filter( l => l.type !== 'SMOOTHABLE_CHARGE')[index], amortizationTableHeaders[index]));
        });
        return amortizationTableFormatted;
    }


    loanTable(loan: any, rawLoan: any, aHeader: any): any {
        const loanType = LoanTypeMap.toString(rawLoan.type);
        const yearlyRate = rawLoan.yearly_rate;
        const loanName = rawLoan.loan_name ? rawLoan.loan_name : '';
        return [
            {style: 'h2', text: `${loanType}, ${yearlyRate}%: ${loanName}`, pageOrientation: 'portrait', pageBreak: 'before'},
            {
                columns: [
                    { width: '10%', text: '' },
                    {
                        style: 'table',
                        headerRows: 1,
                        widths: '100%',
                        table: {
                            body: [
                                aHeader.map(
                                    v => ({style: 'thead', text: v, alignment: 'center'})
                                ),
                                ...loan
                            ]
                        }
                    },
                    { width: '*', text: '' }
                ]
            }
        ];
    }


    graph(fundingResults: FundingResults, profileChart: any, pieChart: any): any {

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

        const loansRecap = LoanUtils.generateLoanRecap(fundingResults.loans).loansRecap;
        const insurancesRecap = LoanUtils.generateInsurancesRecap(fundingResults.loans);
        aSummary.table.body.push(...loansRecap);

        let aInsuranceSummary = null;
        if (insurancesRecap.length) {
          aInsuranceSummary = aPreparedInsuranceSummary;
          aInsuranceSummary.table.body.push(...insurancesRecap);
        }


        return [
            {style: 'h2', text: 'Récapitulatif des lignes de crédit, assurances et visualisation graphique', alignment: 'center', pageOrientation: 'landscape', pageBreak: 'before'},
            { columns: [ { width: '15%', text: '' }, aSummary, { width: '*', text: '' } ] },
            {style: 'bigLineBreak', text: ''},
            { columns: [ { width: '20%', text: '' }, aInsuranceSummary, { width: '*', text: '' } ] },
            {style: 'bigLineBreak', text: ''},
            {svg: pieChart.outerHTML, width: '450', alignment: 'center'},
            {style: 'h2', text: 'Profil de remboursement', pageOrientation: 'landscape', pageBreak: 'before'},
            // {svg: profileChart.outerHTML, width: '670', height: '570', margin: [50, -20, -20, 50] } // Used for vertical printing
            {svg: profileChart.outerHTML, width: '800' }
        ];
    }


    generateTaegSection(aTaeg: Taeg) {
      if(aTaeg) {
        const taegColor = aTaeg.free_taeg_above_wear_rate ? 'red' : 'green';
        const taegBridgeColor = aTaeg.bridge_taeg_above_wear_rate ? 'red' : 'green';

        const taegs = [{style: 'bigLineBreak', text: ''}, {style: {fontSize: 12, bold: true, color: taegColor}, alignment: 'center', text: 'Taux Annuel Effectif Global (TAEG) de cette proposition: ' + aTaeg.free_taeg.toFixed(2) + ' %'}];
        if (aTaeg.bridge_taeg) {
          taegs.push({style: 'bigLineBreak', text: ''});
          taegs.push({style: {fontSize: 12, bold: true, color: taegBridgeColor}, alignment: 'center', text: 'Taux Annuel Effectif Global (TAEG) du (ou des) prêt(s) relais de cette proposition: ' + aTaeg.bridge_taeg.toFixed(2) + ' %'});
        }
        return taegs;
      }
      return [];
    }


    generateBridgeSection(loans: AvailableLoan[]) {
      const bridgeList = [];
      const bridges = loans.filter( l => l.type === 'BRIDGE_LOAN');
      bridges.forEach( (bridge) => {
        const convertedBridge = bridge as BridgeLoan;
        const bridgeName = convertedBridge.loan_name ? convertedBridge.loan_name : '';
        bridgeList.push({columns: [{style: 'icons', width: 15, svg: IconsSvg.alink}, {style: 'iconsText', width: 'auto', text: `Ce projet fait intervenir un prêt relais "${bridgeName}" d\'un montant de ` + LocaleUtils.toLocale(convertedBridge.amount, 'EUR') + ', qui doit être remboursé sous ' +  convertedBridge.duration_months + ' mois.'}] });
      });
      return bridgeList;
    }


    generateSmoothableChargesSection(loans: AvailableLoan[]) {
      const burdensList = [];
      const burdens = loans.filter( l => l.type === 'SMOOTHABLE_CHARGE');
      burdens.forEach( (burden) => {
        const convertedBurden = burden as SmoothableCharge;
        const chargeName = convertedBurden.charge_name ? convertedBurden.charge_name : '';
        burdensList.push({columns: [{style: 'icons', width: 15, svg: IconsSvg.charge}, {style: 'iconsText', width: 'auto', text: `Le client conserve une charge financière "${chargeName}": ` + LocaleUtils.toLocale(convertedBurden.monthly_payment, 'EUR') + '/mois (du mois ' + convertedBurden.start_month + ' au mois ' + convertedBurden.end_month + ').'}] });
      });
      return burdensList;
    }


    // Encode the PTZ elligibility section
    encodePTZSection(aAvailableLoans: AvailableLoan[], aLoans: Loan[]) {
      if (LoanUtils.hasPtz(aAvailableLoans) && LoanUtils.isEligiblePtz(aLoans)) {
        return [IconsSvg.checkCircle, 'Le projet est éligible au PTZ.'];
      }
      if (LoanUtils.hasPtz(aAvailableLoans) && !LoanUtils.isEligiblePtz(aLoans)) {
        return [IconsSvg.unpublished, 'Le projet n\'est pas éligible au PTZ.'];
      }
      return [IconsSvg.voidSvg, ''];
    }


    // Encode the BossLoan elligibility section
    encodeBossLoanSection(aAvailableLoans: AvailableLoan[], aLoans: Loan[]) {
      if (LoanUtils.hasBossLoan(aAvailableLoans) && LoanUtils.isEligibleBossLoan(aLoans)) {
        return [IconsSvg.checkCircle, 'Le projet est éligible au 1% patronal.'];
      }
      if (LoanUtils.hasBossLoan(aAvailableLoans) && !LoanUtils.isEligibleBossLoan(aLoans)) {
        return [IconsSvg.unpublished, 'Le projet n\'est pas éligible au 1% patronal.'];
      }
      return [IconsSvg.voidSvg, ''];
    }

    encodeProfileSection(params: BudgetParameters|FundingParameters|PinelParameters|DebtConsolidationParameters) {
      if (params.profile?.type) {
        const profileText = LocaleUtils.getProfileString(params);
        return [IconsSvg.profile, 'Le projet possède un profile de remboursement particulier: ' + profileText];
      }
      return [IconsSvg.voidSvg, ''];
    }


    encodeFundingSummary(params: FundingParameters|PinelParameters|DebtConsolidationParameters, results: FundingResults) {
      const fundingSummary = LoanUtils.generateFundingSummary(params, results);
      return [
        {columns: [{width: '50%', text: LoanUtils.totalCostStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.total_cost, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.totalInterestsStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.interests_cost, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.totalInsurancesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.insurances_cost, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.totalGuarantiesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.guaranties_cost, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.fileManagementFeesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.file_management_fees, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.brokerFeesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.broker_fees, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.otherExpensesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.notary_fees, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.maximalInstalementStr},  {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.effective_maximal_monthly_payment, 'EUR'),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.notaryFeesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.other_expenses, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.planLengthStr},  {width: '25%', style: 'caseStyleBold', text: fundingSummary.plan_length + ' mois',  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.personalFundingPercentageStr + fundingSummary.personal_funding_ratio + '%' + LoanUtils.personalFundingAbsoluteStr},  {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(fundingSummary.personal_funding, 'EUR'),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.debtRatioStr},  {width: '25%', style: 'caseStyleBold', text: this.formatNbr(LocaleUtils.roundFloat(fundingSummary.normal_debt_ratio)) + '%',  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.jumpChargeStr},  {width: '25%', style: 'caseStyleBold', text: this.formatNbr(LocaleUtils.toLocale(fundingSummary.jump_charge, 'EUR')),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.remainingForLivingStr},  {width: '25%', style: 'caseStyleBold', text: this.formatMonetaryNbr(fundingSummary.remaining_for_living),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]}
      ];
    }

}
