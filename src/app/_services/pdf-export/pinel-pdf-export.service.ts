import { Injectable } from '@angular/core';
import { Case, Land, AdministrativeInformation, NewProperty, Works, HouseConstruction, OldProperty, FundingParameters, FundingResults, Individual, LegalPerson, Partner, ActivePartner, Taeg, SmoothableCharge, BridgeLoan, AvailableLoan, Loan, PinelParameters, PinelResults } from '../../_api/model/models';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { IconsSvg } from './icons-svg';
import { PDFExportService } from './pdf-export.service';
import { FundingPDFExportService } from './funding-pdf-export.service';
import { ProjectStringMap, TaxModeMap } from 'src/app/utils/strings';
import { CourtesyTypeMap, ProjectStateMap } from 'src/app/utils/strings';
import { AcquisitionNatureMap, AcquisitionStateMap, AcquisitionDestinationMap,  } from 'src/app/utils/strings';
import * as palette from 'google-palette';



@Injectable({
    providedIn: 'root'
})
export class PinelPDFExportService extends PDFExportService {

    currentDate = new Date();
    summary: any;
    iconUser: any;
    aPinelResults: PinelResults;
    aFundingPDFExportService = new FundingPDFExportService();

    // Colors for the table
    colormap = palette(['tol-rainbow'], 10);
    yellowCell = '#' + this.colormap[7];
    blueCell = '#' + this.colormap[2];
    greenCell = '#' + this.colormap[4];
    purpleCell = '#' + this.colormap[0];


    exportToPDF(caseId: string, caseName: string, aCase: Case, aPartners: ActivePartner[], planSummary, params: PinelParameters, pinelResults: PinelResults, profileChart: any, pieChart: any, iconUser: any): any {

        this.summary = planSummary;
        this.aCase = aCase;
        this.aPartners = aPartners;
        this.caseId = caseId;
        this.caseName = caseName;
        this.aParams = params;
        this.aResults = pinelResults.funding_plan; // We put funding results here !
        this.aPinelResults = pinelResults;
        this.iconUser = iconUser;

        this.aFundingPDFExportService.aParams = params;

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
            content: this.content(this.aParams, this.aResults, profileChart, pieChart)
        };
    }


    content(params: PinelParameters, results: FundingResults, profileChart: any, pieChart: any): any {
        return [
            ...this.encodeContact('Demande de financement (Investissement Pinel)', this.iconUser, this.currentDate),
            ...this.summaryPinelFunding(params, results),
            ...this.encodeProject(this.aCase.project),
            ...this.summaryPinel(),
            ...this.encodePartnersTable(this.aPartners),
            ...this.encodeCase(this.aCase),
            ...this.graph(results, profileChart, pieChart),
            ...this.loanTables(results)
        ];
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

    generateBalanceTable(aProject: any, aResults: FundingResults, yellowCell, blueCell, greenCell, purpleCell) {
      if (!(aProject.property.expenses)) {
        return [];
      }
      return this.aFundingPDFExportService.generateNewPropertyTable(aProject.property, aResults, yellowCell, blueCell, greenCell, purpleCell);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

    encodeProject(aProject: any) {
        return this.aFundingPDFExportService.encodeNewPropertyProject(aProject.property);
    }

    encodePinelParameters(params: PinelParameters, results: PinelResults) {

      return [
        {columns: [{width: '50%', text: LoanUtils.pinelDurationStr}, {width: '25%', style: 'caseStyleBold', text: this.formatFldAsString(params.project.pinel_duration) + ' ans', alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.monthlyRentValueStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(params.project.monthly_rent_value, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.monthlyRentEvolutionStr}, {width: '25%', style: 'caseStyleBold', text: this.formatFldAsString(params.project.monthly_rent_value_yearly_evolution_rate) + '%', alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.priceEvolutionStr}, {width: '25%', style: 'caseStyleBold', text: this.formatFldAsString(params.project.price_yearly_evolution_rate) + '%', alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.rentChargesStr}, {width: '25%', style: 'caseStyleBold', text: this.formatFldAsString(params.project.renting_charges_rate) + '%', alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.taxRegimeStr}, {width: '25%', style: 'caseStyleBold', text: TaxModeMap.toString(params.project.tax_mode), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.rentThresholdStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(results.maximum_rent, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.zoneStr},  {width: '25%', style: 'caseStyleBold', text: this.formatFldAsString(results.funding_plan.summary.zone),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
      ];
    }

    summaryPinel() {
      const aPinelSummary = {
          style: 'table',
          // margin: [50, 0, 0, 0],
          headerRows: 1,
          widths: ['100%'],
          table: {
              body: [
                  LocaleUtils.pinelTableHeader.map(
                      v => ({style: 'thead', text: v, alignment: 'center'})
                  )
              ],
               widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
          }
      };
      const pinelTable = LocaleUtils.buildPinelTable(this.aPinelResults.pinel_table);
      aPinelSummary.table.body.push(...pinelTable);

      return [
        {style: 'h2', text: 'Paramètres du dispositif Pinel', alignment: 'center', pageOrientation: 'landscape', pageBreak: 'before'},
        this.encodePinelParameters(this.aParams, this.aPinelResults),
        {style: 'h2', text: 'Détail du dispositif Pinel année après année', alignment: 'center', pageOrientation: 'landscape'},
        aPinelSummary
      ];

    }


    summaryPinelFunding(params: PinelParameters, results: FundingResults): any {

        const bridgeList = this.generateBridgeSection(params.loans);
        const burdensList = this.generateSmoothableChargesSection(params.loans);
        const taegs = this.generateTaegSection(results.taegs);
        const resultSummary = this.aFundingPDFExportService.encodeFundingSummary(params, results);

        const listSummary = [
          {style: 'smallLineBreak', text: '', pageBreak: 'after'},
          {style: 'h2', text: 'Résumé du plan de financement'},
          ...resultSummary,
          {style: 'bigLineBreak', text: ''},
          {style: 'h2', text: 'Décomposition du financement pour ce projet'},
          ...this.generateBalanceTable(this.aCase.project, results, this.yellowCell, this.blueCell, this.greenCell, this.purpleCell),
          {style: 'bigLineBreak', text: ''},
          {columns: [{style: 'icons', width: 15, svg: this.encodeProfileSection(params)[0]}, {style: 'iconsText', width: 'auto', text: this.encodeProfileSection(params)[1]}] },
          {style: 'bigLineBreak', text: ''},
          ...bridgeList,
          ...burdensList,
          ...taegs,
          {style: 'smallLineBreak', text: '', pageBreak: 'after'},
        ];

        return listSummary;
    }

}
