import { Injectable } from '@angular/core';
import { Case, Land, AdministrativeInformation, NewProperty, Works, HouseConstruction, OldProperty, FundingParameters, FundingResults, Individual, LegalPerson, Partner, ActivePartner, Taeg, SmoothableCharge, BridgeLoan, AvailableLoan, Loan, PinelParameters, BalancingAdjustment, UndividedPerson } from '../../_api/model/models';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { IconsSvg } from './icons-svg';
import { PDFExportService } from './pdf-export.service';
import { CallsForFundsTypeStringMap, ConstructionNormStringMap, ProjectStringMap, RelationshipMap } from 'src/app/utils/strings';
import { CourtesyTypeMap, ProjectStateMap } from 'src/app/utils/strings';
import { AcquisitionNatureMap, AcquisitionStateMap, AcquisitionDestinationMap,  } from 'src/app/utils/strings';
import * as palette from 'google-palette';



@Injectable({
    providedIn: 'root'
})
export class FundingPDFExportService extends PDFExportService {

    currentDate = new Date();
    summary: any;
    iconUser: any;

    // Colors for the table
    colormap = palette(['tol-rainbow'], 10);
    yellowCell = '#' + this.colormap[7];
    blueCell = '#' + this.colormap[2];
    greenCell = '#' + this.colormap[4];
    purpleCell = '#' + this.colormap[0];

    exportToPDF(caseId: string, caseName: string, aCase: Case, aPartners: ActivePartner[], planSummary, params: FundingParameters, results: FundingResults, profileChart: any, pieChart: any, iconUser: any): any {

        this.summary = planSummary;
        this.aCase = aCase;
        this.aPartners = aPartners;
        this.caseId = caseId;
        this.caseName = caseName;
        this.aParams = params;
        this.aResults = results;
        this.iconUser = iconUser;

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
            content: this.content(params, results, profileChart, pieChart)
        };
    }


    content(params: FundingParameters, results: FundingResults, profileChart: any, pieChart: any): any {
        return [
            ...this.encodeContact('Demande de financement (' + ProjectStringMap.toString(this.aCase.project.type).toLowerCase() + ')', this.iconUser, this.currentDate),
            ...this.summaryFunding(params, results),
            ...this.encodeProject(this.aCase.project),
            ...this.encodePartnersTable(this.aPartners),
            ...this.encodeCase(this.aCase),
            ...this.graph(results, profileChart, pieChart),
            ...this.loanTables(results)
        ];
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

    generateLandTable(aProject: Land, aResults: FundingResults, yellowCell, blueCell, greenCell, purpleCell) {

      const priceAmount = aProject.expenses.price ? aProject.expenses.price : 0;
      const price = LocaleUtils.toLocale(priceAmount, 'EUR');

      const otherExpensesAmount = aProject.expenses.other_expenses ? aProject.expenses.other_expenses : 0
      const otherExpenses = LocaleUtils.toLocale(otherExpensesAmount, 'EUR');

      const brokerFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.broker_fees) ? this.aParams.funding_fees.broker_fees : 0;
      const brokerFees = LocaleUtils.toLocale(brokerFeesAmount, 'EUR');

      const fileManagementFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.file_management_fees) ? this.aParams.funding_fees.file_management_fees : 0;
      const fileManagementFees = LocaleUtils.toLocale(fileManagementFeesAmount, 'EUR');

      const agencyFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.agency_fees) ? aProject.expenses.fees.agency_fees : 0;
      const agencyFees = LocaleUtils.toLocale(agencyFeesAmount, 'EUR');

      const notaryFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.notary_fees) ? aProject.expenses.fees.notary_fees : 0;
      const notaryFees = LocaleUtils.toLocale(notaryFeesAmount, 'EUR');

      const guarantiesFeesAmount = (aResults.summary && aResults.summary.total_guaranty) ? aResults.summary.total_guaranty : 0;
      const guarantiesFees = LocaleUtils.toLocale(guarantiesFeesAmount, 'EUR');

      const totalPersonalFundingAmount = (aResults.summary && aResults.summary.total_personal_funding) ? aResults.summary.total_personal_funding : 0;
      const totalPersonalFunding = LocaleUtils.toLocale(totalPersonalFundingAmount, 'EUR');


      const totalProjectAmount = priceAmount + otherExpensesAmount;
      const totalProject = LocaleUtils.toLocale(totalProjectAmount, 'EUR');
      const totalFeesAmount = brokerFeesAmount + fileManagementFeesAmount + agencyFeesAmount + notaryFeesAmount + guarantiesFeesAmount;
      const totalFees = LocaleUtils.toLocale(totalFeesAmount, 'EUR');
      const totalFundedAmount = LocaleUtils.toLocale(totalProjectAmount + totalFeesAmount - totalPersonalFundingAmount, 'EUR');

      return [{
        table: {
          widths: [20, 170, 'auto', 100, 'auto'],
          headerRows: 2,
          body: [
            [{text: '', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingLandPriceStr, fillColor: yellowCell, color: 'white'}, {text: price, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: 'Total projet', rowSpan: 2, fillColor: yellowCell, color: 'white'}, {text: totalProject, rowSpan: 2, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: blueCell, color: 'white'}, {text: brokerFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: 'Total frais', rowSpan: 4, fillColor: blueCell, color: 'white'}, {text: totalFees, rowSpan: 4, fillColor: blueCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: blueCell, color: 'white'}, {text: fileManagementFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingNotaryFeesStr, fillColor: blueCell, color: 'white'}, {text: notaryFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingAgencyFeesStr, fillColor: blueCell, color: 'white'}, {text: agencyFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingGuarantiesStr, fillColor: blueCell, color: 'white'}, {text: guarantiesFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '-', fillColor: greenCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: greenCell, color: 'white'}, {text: totalPersonalFunding, fillColor: greenCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}],
            [{text: '=', fillColor: purpleCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBorrowedAmountStr, fillColor: purpleCell, color: 'white'}, {text: totalFundedAmount, fillColor: purpleCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}]
          ]
        },
        layout: 'noBorders'
      }]
    }

    generateNewPropertyTable(aProject: NewProperty, aResults: FundingResults, yellowCell, blueCell, greenCell, purpleCell) {

      const priceAmount = aProject.expenses.price ? aProject.expenses.price : 0;
      const price = LocaleUtils.toLocale(priceAmount, 'EUR');

      const otherExpensesAmount = aProject.expenses.other_expenses ? aProject.expenses.other_expenses : 0;
      const otherExpenses = LocaleUtils.toLocale(otherExpensesAmount, 'EUR');

      const vatAmount = aProject.expenses.vat ? aProject.expenses.vat : 0;
      const vat = LocaleUtils.toLocale(vatAmount, 'EUR');

      const otherTaxesAmount = aProject.expenses.other_taxes ? aProject.expenses.other_taxes : 0;
      const otherTaxes = LocaleUtils.toLocale(otherTaxesAmount, 'EUR');

      const brokerFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.broker_fees) ? this.aParams.funding_fees.broker_fees : 0;
      const brokerFees = LocaleUtils.toLocale(brokerFeesAmount, 'EUR');

      const fileManagementFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.file_management_fees) ? this.aParams.funding_fees.file_management_fees : 0;
      const fileManagementFees = LocaleUtils.toLocale(fileManagementFeesAmount, 'EUR');

      const agencyFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.agency_fees) ? aProject.expenses.fees.agency_fees : 0;
      const agencyFees = LocaleUtils.toLocale(agencyFeesAmount, 'EUR');

      const notaryFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.notary_fees) ? aProject.expenses.fees.notary_fees : 0;
      const notaryFees = LocaleUtils.toLocale(notaryFeesAmount, 'EUR');

      const guarantiesFeesAmount = (aResults.summary && aResults.summary.total_guaranty) ? aResults.summary.total_guaranty : 0;
      const guarantiesFees = LocaleUtils.toLocale(guarantiesFeesAmount, 'EUR');

      const totalPersonalFundingAmount = (aResults.summary && aResults.summary.total_personal_funding) ? aResults.summary.total_personal_funding : 0;
      const totalPersonalFunding = LocaleUtils.toLocale(totalPersonalFundingAmount, 'EUR');


      const totalProjectAmount = priceAmount + otherExpensesAmount + vatAmount + otherTaxesAmount;
      const totalProject = LocaleUtils.toLocale(totalProjectAmount, 'EUR');
      const totalFeesAmount = brokerFeesAmount + fileManagementFeesAmount + agencyFeesAmount + notaryFeesAmount + guarantiesFeesAmount;
      const totalFees = LocaleUtils.toLocale(totalFeesAmount, 'EUR');
      const totalFundedAmount = LocaleUtils.toLocale(totalProjectAmount + totalFeesAmount - totalPersonalFundingAmount, 'EUR');

      return [{
        table: {
          widths: [20, 170, 'auto', 100, 'auto'],
          headerRows: 2,
          body: [
            [{text: '', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPriceStr, fillColor: yellowCell, color: 'white'}, {text: price, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: 'Total projet', rowSpan: 4, fillColor: yellowCell, color: 'white'}, {text: totalProject, rowSpan: 4, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingVatStr, fillColor: yellowCell, color: 'white'}, {text: vat, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherTaxesStr, fillColor: yellowCell, color: 'white'}, {text: otherTaxes, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: blueCell, color: 'white'}, {text: brokerFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: 'Total frais', rowSpan: 4, fillColor: blueCell, color: 'white'}, {text: totalFees, rowSpan: 4, fillColor: blueCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: blueCell, color: 'white'}, {text: fileManagementFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingNotaryFeesStr, fillColor: blueCell, color: 'white'}, {text: notaryFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingAgencyFeesStr, fillColor: blueCell, color: 'white'}, {text: agencyFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingGuarantiesStr, fillColor: blueCell, color: 'white'}, {text: guarantiesFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '-', fillColor: greenCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: greenCell, color: 'white'}, {text: totalPersonalFunding, fillColor: greenCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}],
            [{text: '=', fillColor: purpleCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBorrowedAmountStr, fillColor: purpleCell, color: 'white'}, {text: totalFundedAmount, fillColor: purpleCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}]
          ]
        },
        layout: 'noBorders'
      }]
    }


    generateOldPropertyTable(aProject: OldProperty, aResults: FundingResults, yellowCell, blueCell, greenCell, purpleCell) {
      const priceAmount = aProject.expenses.price ? aProject.expenses.price : 0;
      const price = LocaleUtils.toLocale(priceAmount, 'EUR');

      const otherExpensesAmount = aProject.expenses.other_expenses ? aProject.expenses.other_expenses : 0
      const otherExpenses = LocaleUtils.toLocale(otherExpensesAmount, 'EUR');

      const worksAmount = aProject.expenses.works_price ? aProject.expenses.works_price : 0;
      const works = LocaleUtils.toLocale(worksAmount, 'EUR');

      const brokerFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.broker_fees) ? this.aParams.funding_fees.broker_fees : 0;
      const brokerFees = LocaleUtils.toLocale(brokerFeesAmount, 'EUR');

      const fileManagementFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.file_management_fees) ? this.aParams.funding_fees.file_management_fees : 0;
      const fileManagementFees = LocaleUtils.toLocale(fileManagementFeesAmount, 'EUR');

      const agencyFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.agency_fees) ? aProject.expenses.fees.agency_fees : 0;
      const agencyFees = LocaleUtils.toLocale(agencyFeesAmount, 'EUR');

      const notaryFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.notary_fees) ? aProject.expenses.fees.notary_fees : 0;
      const notaryFees = LocaleUtils.toLocale(notaryFeesAmount, 'EUR');

      const guarantiesFeesAmount = (aResults.summary && aResults.summary.total_guaranty) ? aResults.summary.total_guaranty : 0;
      const guarantiesFees = LocaleUtils.toLocale(guarantiesFeesAmount, 'EUR');

      const totalPersonalFundingAmount = (aResults.summary && aResults.summary.total_personal_funding) ? aResults.summary.total_personal_funding : 0;
      const totalPersonalFunding = LocaleUtils.toLocale(totalPersonalFundingAmount, 'EUR');


      const totalProjectAmount = priceAmount + otherExpensesAmount + worksAmount;
      const totalProject = LocaleUtils.toLocale(totalProjectAmount, 'EUR');
      const totalFeesAmount = brokerFeesAmount + fileManagementFeesAmount + agencyFeesAmount + notaryFeesAmount + guarantiesFeesAmount;
      const totalFees = LocaleUtils.toLocale(totalFeesAmount, 'EUR');
      const totalFundedAmount = LocaleUtils.toLocale(totalProjectAmount + totalFeesAmount - totalPersonalFundingAmount, 'EUR');

      return [{
        table: {
          widths: [20, 170, 'auto', 100, 'auto'],
          headerRows: 2,
          body: [
            [{text: '', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPriceStr, fillColor: yellowCell, color: 'white'}, {text: price, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: 'Total projet', rowSpan: 3, fillColor: yellowCell, color: 'white'}, {text: totalProject, rowSpan: 3, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingWorkPriceStr, fillColor: yellowCell, color: 'white'}, {text: works, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: blueCell, color: 'white'}, {text: brokerFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: 'Total frais', rowSpan: 5, fillColor: blueCell, color: 'white'}, {text: totalFees, rowSpan: 5, fillColor: blueCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: blueCell, color: 'white'}, {text: fileManagementFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingNotaryFeesStr, fillColor: blueCell, color: 'white'}, {text: notaryFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingAgencyFeesStr, fillColor: blueCell, color: 'white'}, {text: agencyFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingGuarantiesStr, fillColor: blueCell, color: 'white'}, {text: guarantiesFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '-', fillColor: greenCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: greenCell, color: 'white'}, {text: totalPersonalFunding, fillColor: greenCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}],
            [{text: '=', fillColor: purpleCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBorrowedAmountStr, fillColor: purpleCell, color: 'white'}, {text: totalFundedAmount, fillColor: purpleCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}]
          ]
        },
        layout: 'noBorders'
      }]
    }


    generateHouseConstructionTable(aProject: HouseConstruction, aResults: FundingResults, yellowCell, blueCell, greenCell, purpleCell) {
      const landPriceAmount = aProject.expenses.land_price ? aProject.expenses.land_price : 0;
      const landPrice = LocaleUtils.toLocale(landPriceAmount, 'EUR');

      const constructionPriceAmount = aProject.expenses.construction_price ? aProject.expenses.construction_price : 0;
      const constructionPrice = LocaleUtils.toLocale(constructionPriceAmount, 'EUR');

      const infrastructurePriceAmount = aProject.expenses.infrastructure_price ? aProject.expenses.infrastructure_price : 0;
      const infrastructurePrice = LocaleUtils.toLocale(infrastructurePriceAmount, 'EUR');

      const buildingInsuranceAmount = aProject.expenses.building_insurance ? aProject.expenses.building_insurance : 0;
      const buildingInsurance = LocaleUtils.toLocale(buildingInsuranceAmount, 'EUR');

      const otherExpensesAmount = aProject.expenses.other_expenses ? aProject.expenses.other_expenses : 0
      const otherExpenses = LocaleUtils.toLocale(otherExpensesAmount, 'EUR');

      const vatAmount = aProject.expenses.vat ? aProject.expenses.vat : 0;
      const vat = LocaleUtils.toLocale(vatAmount, 'EUR');

      const otherTaxesAmount = aProject.expenses.other_taxes ? aProject.expenses.other_taxes : 0;
      const otherTaxes = LocaleUtils.toLocale(otherTaxesAmount, 'EUR');

      const brokerFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.broker_fees) ? this.aParams.funding_fees.broker_fees : 0;
      const brokerFees = LocaleUtils.toLocale(brokerFeesAmount, 'EUR');

      const fileManagementFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.file_management_fees) ? this.aParams.funding_fees.file_management_fees : 0;
      const fileManagementFees = LocaleUtils.toLocale(fileManagementFeesAmount, 'EUR');

      const agencyFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.agency_fees) ? aProject.expenses.fees.agency_fees : 0;
      const agencyFees = LocaleUtils.toLocale(agencyFeesAmount, 'EUR');

      const notaryFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.notary_fees) ? aProject.expenses.fees.notary_fees : 0;
      const notaryFees = LocaleUtils.toLocale(notaryFeesAmount, 'EUR');

      const guarantiesFeesAmount = (aResults.summary && aResults.summary.total_guaranty) ? aResults.summary.total_guaranty : 0;
      const guarantiesFees = LocaleUtils.toLocale(guarantiesFeesAmount, 'EUR');

      const totalPersonalFundingAmount = (aResults.summary && aResults.summary.total_personal_funding) ? aResults.summary.total_personal_funding : 0;
      const totalPersonalFunding = LocaleUtils.toLocale(totalPersonalFundingAmount, 'EUR');


      const totalProjectAmount = landPriceAmount + constructionPriceAmount + infrastructurePriceAmount + buildingInsuranceAmount + otherExpensesAmount + vatAmount + otherTaxesAmount;
      const totalProject = LocaleUtils.toLocale(totalProjectAmount, 'EUR');
      const totalFeesAmount = brokerFeesAmount + fileManagementFeesAmount + agencyFeesAmount + notaryFeesAmount + guarantiesFeesAmount;
      const totalFees = LocaleUtils.toLocale(totalFeesAmount, 'EUR');
      const totalFundedAmount = LocaleUtils.toLocale(totalProjectAmount + totalFeesAmount - totalPersonalFundingAmount, 'EUR');

      return [{
        table: {
          widths: [20, 170, 'auto', 100, 'auto'],
          headerRows: 2,
          body: [
            [{text: '', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingLandPriceStr, fillColor: yellowCell, color: 'white'}, {text: landPrice, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: 'Total projet', rowSpan: 7, fillColor: yellowCell, color: 'white'}, {text: totalProject, rowSpan: 7, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingConstructionPriceStr, fillColor: yellowCell, color: 'white'}, {text: constructionPrice, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingInfrastructurePriceStr, fillColor: yellowCell, color: 'white'}, {text: infrastructurePrice, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: totalProject, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingInsurancePriceStr, fillColor: yellowCell, color: 'white'}, {text: buildingInsurance, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: totalProject, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingVatStr, fillColor: yellowCell, color: 'white'}, {text: vat, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: totalProject, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherTaxesStr, fillColor: yellowCell, color: 'white'}, {text: otherTaxes, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: totalProject, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: totalProject, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: blueCell, color: 'white'}, {text: brokerFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: 'Total frais', rowSpan: 4, fillColor: blueCell, color: 'white'}, {text: totalFees, rowSpan: 4, fillColor: blueCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: blueCell, color: 'white'}, {text: fileManagementFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingNotaryFeesStr, fillColor: blueCell, color: 'white'}, {text: notaryFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingAgencyFeesStr, fillColor: blueCell, color: 'white'}, {text: agencyFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingGuarantiesStr, fillColor: blueCell, color: 'white'}, {text: guarantiesFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '-', fillColor: greenCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: greenCell, color: 'white'}, {text: totalPersonalFunding, fillColor: greenCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}],
            [{text: '=', fillColor: purpleCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBorrowedAmountStr, fillColor: purpleCell, color: 'white'}, {text: totalFundedAmount, fillColor: purpleCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}]
          ]
        },
        layout: 'noBorders'
      }]
    }


    generateWorksTable(aProject: Works, aResults: FundingResults, yellowCell, blueCell, greenCell, purpleCell) {
      const priceAmount = aProject.expenses.price ? aProject.expenses.price : 0;
      const price = LocaleUtils.toLocale(priceAmount, 'EUR');

      const otherExpensesAmount = aProject.expenses.other_expenses ? aProject.expenses.other_expenses : 0
      const otherExpenses = LocaleUtils.toLocale(otherExpensesAmount, 'EUR');

      const brokerFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.broker_fees) ? this.aParams.funding_fees.broker_fees : 0;
      const brokerFees = LocaleUtils.toLocale(brokerFeesAmount, 'EUR');

      const fileManagementFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.file_management_fees) ? this.aParams.funding_fees.file_management_fees : 0;
      const fileManagementFees = LocaleUtils.toLocale(fileManagementFeesAmount, 'EUR');

      const guarantiesFeesAmount = (aResults.summary && aResults.summary.total_guaranty) ? aResults.summary.total_guaranty : 0;
      const guarantiesFees = LocaleUtils.toLocale(guarantiesFeesAmount, 'EUR');

      const totalPersonalFundingAmount = (aResults.summary && aResults.summary.total_personal_funding) ? aResults.summary.total_personal_funding : 0;
      const totalPersonalFunding = LocaleUtils.toLocale(totalPersonalFundingAmount, 'EUR');


      const totalProjectAmount = priceAmount + otherExpensesAmount;
      const totalProject = LocaleUtils.toLocale(totalProjectAmount, 'EUR');
      const totalFeesAmount = brokerFeesAmount + fileManagementFeesAmount + guarantiesFeesAmount;
      const totalFees = LocaleUtils.toLocale(totalFeesAmount, 'EUR');
      const totalFundedAmount = LocaleUtils.toLocale(totalProjectAmount + totalFeesAmount - totalPersonalFundingAmount, 'EUR');

      return [{
        table: {
          widths: [20, 170, 'auto', 100, 'auto'],
          headerRows: 2,
          body: [
            [{text: '', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingWorkPriceStr, fillColor: yellowCell, color: 'white'}, {text: price, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: 'Total projet', rowSpan: 2, fillColor: yellowCell, color: 'white'}, {text: totalProject, rowSpan: 2, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: blueCell, color: 'white'}, {text: brokerFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: 'Total frais', rowSpan: 4, fillColor: blueCell, color: 'white'}, {text: totalFees, rowSpan: 4, fillColor: blueCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: blueCell, color: 'white'}, {text: fileManagementFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingGuarantiesStr, fillColor: blueCell, color: 'white'}, {text: guarantiesFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '-', fillColor: greenCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: greenCell, color: 'white'}, {text: totalPersonalFunding, fillColor: greenCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}],
            [{text: '=', fillColor: purpleCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBorrowedAmountStr, fillColor: purpleCell, color: 'white'}, {text: totalFundedAmount, fillColor: purpleCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}]
          ]
        },
        layout: 'noBorders'
      }]
    }


    generateBalancingAdjustmentTable(aProject: BalancingAdjustment, aResults: FundingResults, yellowCell, blueCell, greenCell, purpleCell) {
      const priceAmount = aProject.expenses.total_balancing_adjustment_value ? aProject.expenses.total_balancing_adjustment_value : 0;
      const price = LocaleUtils.toLocale(priceAmount, 'EUR');

      const otherExpensesAmount = aProject.expenses.other_expenses ? aProject.expenses.other_expenses : 0
      const otherExpenses = LocaleUtils.toLocale(otherExpensesAmount, 'EUR');

      const worksAmount = aProject.expenses.works_price ? aProject.expenses.works_price : 0;
      const works = LocaleUtils.toLocale(worksAmount, 'EUR');

      const brokerFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.broker_fees) ? this.aParams.funding_fees.broker_fees : 0;
      const brokerFees = LocaleUtils.toLocale(brokerFeesAmount, 'EUR');

      const fileManagementFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.file_management_fees) ? this.aParams.funding_fees.file_management_fees : 0;
      const fileManagementFees = LocaleUtils.toLocale(fileManagementFeesAmount, 'EUR');

      const notaryFeesAmount = (aProject.expenses.fees && aProject.expenses.fees.notary_fees) ? aProject.expenses.fees.notary_fees : 0;
      const notaryFees = LocaleUtils.toLocale(notaryFeesAmount, 'EUR');

      const guarantiesFeesAmount = (aResults.summary && aResults.summary.total_guaranty) ? aResults.summary.total_guaranty : 0;
      const guarantiesFees = LocaleUtils.toLocale(guarantiesFeesAmount, 'EUR');

      const totalPersonalFundingAmount = (aResults.summary && aResults.summary.total_personal_funding) ? aResults.summary.total_personal_funding : 0;
      const totalPersonalFunding = LocaleUtils.toLocale(totalPersonalFundingAmount, 'EUR');


      const totalProjectAmount = priceAmount + otherExpensesAmount + worksAmount;
      const totalProject = LocaleUtils.toLocale(totalProjectAmount, 'EUR');
      const totalFeesAmount = brokerFeesAmount + fileManagementFeesAmount + notaryFeesAmount + guarantiesFeesAmount;
      const totalFees = LocaleUtils.toLocale(totalFeesAmount, 'EUR');
      const totalFundedAmount = LocaleUtils.toLocale(totalProjectAmount + totalFeesAmount - totalPersonalFundingAmount, 'EUR');

      return [{
        table: {
          widths: [20, 170, 'auto', 100, 'auto'],
          headerRows: 2,
          body: [
            [{text: '', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBalancingAdjustmentPriceStr, fillColor: yellowCell, color: 'white'}, {text: price, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: 'Total projet', rowSpan: 3, fillColor: yellowCell, color: 'white'}, {text: totalProject, rowSpan: 3, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingWorkPriceStr, fillColor: yellowCell, color: 'white'}, {text: works, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: blueCell, color: 'white'}, {text: brokerFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: 'Total frais', rowSpan: 4, fillColor: blueCell, color: 'white'}, {text: totalFees, rowSpan: 4, fillColor: blueCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: blueCell, color: 'white'}, {text: fileManagementFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingNotaryFeesStr, fillColor: blueCell, color: 'white'}, {text: notaryFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingGuarantiesStr, fillColor: blueCell, color: 'white'}, {text: guarantiesFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '-', fillColor: greenCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: greenCell, color: 'white'}, {text: totalPersonalFunding, fillColor: greenCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}],
            [{text: '=', fillColor: purpleCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBorrowedAmountStr, fillColor: purpleCell, color: 'white'}, {text: totalFundedAmount, fillColor: purpleCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}]
          ]
        },
        layout: 'noBorders'
      }]
    }

    generateBalanceTable(aProject: any, aResults: FundingResults, yellowCell, blueCell, greenCell, purpleCell) {

      if (!(aProject.expenses)) {
        return [];
      }

      switch(aProject.type) {
        case 'HOUSE_CONSTRUCTION':
          return this.generateHouseConstructionTable(aProject, aResults, yellowCell, blueCell, greenCell, purpleCell);
        case 'LAND':
          return this.generateLandTable(aProject, aResults, yellowCell, blueCell, greenCell, purpleCell);
        case 'OLD_PROPERTY':
          return this.generateOldPropertyTable(aProject, aResults, yellowCell, blueCell, greenCell, purpleCell);
        case 'NEW_PROPERTY':
          return this.generateNewPropertyTable(aProject, aResults, yellowCell, blueCell, greenCell, purpleCell);
        case 'WORKS':
          return this.generateWorksTable(aProject, aResults, yellowCell, blueCell, greenCell, purpleCell);
        case 'BALANCING_ADJUSTMENT':
          return this.generateBalancingAdjustmentTable(aProject, aResults, yellowCell, blueCell, greenCell, purpleCell);
        }
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////


    encodeAdministrativeInformation(aAdministrativeInformation: AdministrativeInformation) {
      if (aAdministrativeInformation) {
        const nature = aAdministrativeInformation.nature ? AcquisitionNatureMap.toString(aAdministrativeInformation.nature) : '';
        const state = aAdministrativeInformation.state ? AcquisitionStateMap.toString(aAdministrativeInformation.state) : '';
        const destination = aAdministrativeInformation.destination ? AcquisitionDestinationMap.toString(aAdministrativeInformation.destination) : '';
        const aFormattedAddress = this.formatLocation(aAdministrativeInformation.address);
        const address = aFormattedAddress.address;
        const postalCode = aFormattedAddress.postal_code;
        const city = aFormattedAddress.city;
        const country = aFormattedAddress.country;
        const inseeCode = aFormattedAddress.insee_code;
        const aProjectDates = this.formatProjectDates(aAdministrativeInformation.project_dates);
        const landRegisterReference = this.formatFldAsString(aAdministrativeInformation.land_register_reference);
        const description = this.formatFldAsString(aAdministrativeInformation.description);

        return [
            {columns: [{width: '50%', text: 'Nature de l\'acquisition:'}, {width: '25%', style: 'caseStyleBold', text: nature, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Etat de l\'acquisition:'}, {width: '25%', style: 'caseStyleBold', text: state, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Destination de l\'acquisition:'}, {width: '25%', style: 'caseStyleBold', text: destination, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Adresse d\'acquisition:'}, {width: '25%', style: 'caseStyleBold', text: this.formatAddress(address, postalCode, city, country), alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Code INSEE de la zone d\'acquisition:'}, {width: '25%', style: 'caseStyleBold', text: inseeCode, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Date de signature du compromis:'}, {width: '25%', style: 'caseStyleBold', text: aProjectDates.sales_agreement_date, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Date de levée des conditions suspensives:'}, {width: '25%', style: 'caseStyleBold', text: aProjectDates.conditions_precedent_end_date, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Date de signature:'}, {width: '25%', style: 'caseStyleBold', text: aProjectDates.signature_date, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Parcelle cadastrale:'}, {width: '25%', style: 'caseStyleBold', text: landRegisterReference, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
            {columns: [{width: '50%', text: 'Description:'}, {width: '25%', style: 'caseStyleBold', text: description, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        ];
      }

      return [];
    }

    encodeLandProject(aProject: Land) {
      // Project progression
      const projectState = (aProject.project_state) ? ProjectStateMap.toString(aProject.project_state) : '';

      // Specific
      const surface = this.formatNbr(aProject.surface);

      return [
        {style: 'h2', text: 'Informations relatives au projet'},
        {columns: [{width: '50%', text: 'Etat d\'avancement du projet:'}, {width: '25%', style: 'caseStyleBold', text: projectState, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},

        ...this.encodeAdministrativeInformation(aProject.administrative_information),

        {columns: [{width: '50%', text: 'Surface:'}, {width: '25%', style: 'caseStyleBold', text: surface + ' m²', alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},        {style: 'bigLineBreak', text: ''},

        {style: 'bigLineBreak', text: ''},
        ...this.formatSeller(aProject.seller)
      ];
    }


    encodeWorksProject(aProject: Works) {
      // Specific
      const surfaces = this.formatSurfaces(aProject.surfaces);
      const surface = surfaces.surface;
      const additionalSurface = surfaces.additional_surface;
      const landSurface = surfaces.land_surface;
      const constructionDate = this.formatDateAsString(aProject.construction_date);
      const constructionNorm = this.formatFldAsString(ConstructionNormStringMap.toString(aProject.construction_norm));
      const deliveryDate = this.formatDateAsString(aProject.delivery_date);
      const lotNumber = this.formatFldAsString(aProject.lot_number);
      const roomCount = this.formatNbr(aProject.rooms_count);
      const dpeRate = this.formatFldAsString(aProject.dpe_rate);

      return [
        {style: 'h2', text: 'Informations relatives au projet'},

        ...this.encodeAdministrativeInformation(aProject.administrative_information),

        {columns: [{width: '50%', text: 'Surface:'}, {width: '25%', style: 'caseStyleBold', text: surface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface des annexes:'}, {width: '25%', style: 'caseStyleBold', text: additionalSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface du terrain:'}, {width: '25%', style: 'caseStyleBold', text: landSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Date de construction:'}, {width: '25%', style: 'caseStyleBold', text: constructionDate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Norme de construction:'}, {width: '25%', style: 'caseStyleBold', text: constructionNorm, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Date de livraison:'}, {width: '25%', style: 'caseStyleBold', text: deliveryDate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Numéro de lot:'}, {width: '25%', style: 'caseStyleBold', text: lotNumber, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Nombre de pièces:'}, {width: '25%', style: 'caseStyleBold', text: roomCount, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'DPE:'}, {width: '25%', style: 'caseStyleBold', text: dpeRate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
      ];
    }

    encodeOldPropertyProject(aProject: OldProperty) {
      // Project progression
      const projectState = (aProject.project_state) ? ProjectStateMap.toString(aProject.project_state) : '';

      // Specific
      const surfaces = this.formatSurfaces(aProject.surfaces);
      const surface = surfaces.surface;
      const additionalSurface = surfaces.additional_surface;
      const landSurface = surfaces.land_surface;
      const constructionDate = this.formatDateAsString(aProject.construction_date);
      const constructionNorm = this.formatFldAsString(ConstructionNormStringMap.toString(aProject.construction_norm));
      const lotNumber = this.formatFldAsString(aProject.lot_number);
      const roomCount = this.formatNbr(aProject.rooms_count);
      const dpeRate = this.formatFldAsString(aProject.dpe_rate);

      return [
        {style: 'h2', text: 'Informations relatives au projet'},
        {columns: [{width: '50%', text: 'Etat d\'avancement du projet:'}, {width: '25%', style: 'caseStyleBold', text: projectState, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},

        ...this.encodeAdministrativeInformation(aProject.administrative_information),

        {columns: [{width: '50%', text: 'Surface:'}, {width: '25%', style: 'caseStyleBold', text: surface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface des annexes:'}, {width: '25%', style: 'caseStyleBold', text: additionalSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface du terrain:'}, {width: '25%', style: 'caseStyleBold', text: landSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Date de construction:'}, {width: '25%', style: 'caseStyleBold', text: constructionDate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Norme de construction:'}, {width: '25%', style: 'caseStyleBold', text: constructionNorm, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Numéro de lot:'}, {width: '25%', style: 'caseStyleBold', text: lotNumber, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Nombre de pièces:'}, {width: '25%', style: 'caseStyleBold', text: roomCount, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'DPE:'}, {width: '25%', style: 'caseStyleBold', text: dpeRate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},

        {style: 'bigLineBreak', text: ''},
        ...this.formatSeller(aProject.seller)
      ];
    }

    formatUndividedPersons(iUndividedPersons: UndividedPerson []) {
      const undividedPersons = [];
      iUndividedPersons.forEach(iUndividedPerson => {
        const sharePercentage = this.formatFldAsString(iUndividedPerson.share_percentage) + '%';
        const relationship = RelationshipMap.toString(iUndividedPerson.relationship);
        const firstName = iUndividedPerson.contact?.first_name ?? '';
        const lastName = iUndividedPerson.contact?.last_name ?? '';
        undividedPersons.push([{width: '20%', text: sharePercentage}, {width: '25%', text: relationship}, {width: '25%', text: firstName}, {width: '25%', text: lastName}]);
      });

      const undividedPersonsTable = undividedPersons.length ? {
          table: {
            style: 'table',
            headerRows: 1,
            widths: ['20%', '25%', '27.5%', '27.5%'],
            body: [
              [{width: '20%', style: 'thead', text: 'Part'}, {width: '25%', style: 'thead', text: 'Relation'}, {width: '27.5%', style: 'thead', text: 'Nom'}, {width: '27.5%', style: 'thead', text: 'Prénom'}],
              ...undividedPersons
            ]
          }
        } : {};

      return undividedPersonsTable;
    }

    encodeBalancingAdjustmentProject(aProject: BalancingAdjustment) {
      // Project progression
      const projectState = (aProject.project_state) ? ProjectStateMap.toString(aProject.project_state) : '';

      // Specific
      const surfaces = this.formatSurfaces(aProject.surfaces);
      const surface = surfaces.surface;
      const additionalSurface = surfaces.additional_surface;
      const landSurface = surfaces.land_surface;
      const constructionDate = this.formatDateAsString(aProject.construction_date);
      const constructionNorm = this.formatFldAsString(ConstructionNormStringMap.toString(aProject.construction_norm));
      const lotNumber = this.formatFldAsString(aProject.lot_number);
      const roomCount = this.formatNbr(aProject.rooms_count);
      const dpeRate = this.formatFldAsString(aProject.dpe_rate);

      const undividedPersonsTable = this.formatUndividedPersons(aProject.undivided_persons);

      return [
        {style: 'h2', text: 'Informations relatives au projet'},
        {columns: [{width: '50%', text: 'Etat d\'avancement du projet:'}, {width: '25%', style: 'caseStyleBold', text: projectState, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},

        ...this.encodeAdministrativeInformation(aProject.administrative_information),

        {columns: [{width: '50%', text: 'Surface:'}, {width: '25%', style: 'caseStyleBold', text: surface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface des annexes:'}, {width: '25%', style: 'caseStyleBold', text: additionalSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface du terrain:'}, {width: '25%', style: 'caseStyleBold', text: landSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Date de construction:'}, {width: '25%', style: 'caseStyleBold', text: constructionDate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Norme de construction:'}, {width: '25%', style: 'caseStyleBold', text: constructionNorm, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Numéro de lot:'}, {width: '25%', style: 'caseStyleBold', text: lotNumber, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Nombre de pièces:'}, {width: '25%', style: 'caseStyleBold', text: roomCount, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'DPE:'}, {width: '25%', style: 'caseStyleBold', text: dpeRate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},

        {style: 'bigLineBreak', text: ''},
        {style: 'h2', text: 'Indivisaires'},
        undividedPersonsTable
      ];
    }


    encodeNewPropertyProject(aProject: NewProperty) {
      // Project progression
      const projectState = (aProject.project_state) ? ProjectStateMap.toString(aProject.project_state) : '';

      const callsForFundsTable = this.formatCallsForFundsTable(aProject.calls_for_funds);
      const callsForFundsType = aProject.calls_for_funds ? {columns: [{width: '50%', text: 'Mode de déblocage des appels de fonds:'}, {width: '50%', style: 'caseStyleBold', text: CallsForFundsTypeStringMap.toString(aProject.calls_for_funds.type), alignment: 'left'} ]} : {};


      // Specific
      const surfaces = this.formatSurfaces(aProject.surfaces);
      const surface = surfaces.surface;
      const additionalSurface = surfaces.additional_surface;
      const landSurface = surfaces.land_surface;
      const aProjectDates = (aProject.administrative_information) ? this.formatProjectDates(aProject.administrative_information.project_dates) : this.formatProjectDates(null);
      const dpeRate = this.formatFldAsString(aProject.dpe_rate);
      const deliveryDate = this.formatDateAsString(aProject.delivery_date);
      const constructionNorm = this.formatFldAsString(ConstructionNormStringMap.toString(aProject.construction_norm));
      const lotNumber = this.formatFldAsString(aProject.lot_number);
      const programm = this.formatFldAsString(aProject.program);
      const roomCount = this.formatNbr(aProject.rooms_count);

      return [
        {style: 'h2', text: 'Informations relatives au projet'},
        {columns: [{width: '50%', text: 'Etat d\'avancement du projet:'}, {width: '25%', style: 'caseStyleBold', text: projectState, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {style: 'bigLineBreak', text: ''},
        callsForFundsType,
        callsForFundsTable,
        {style: 'bigLineBreak', text: ''},
        ...this.encodeAdministrativeInformation(aProject.administrative_information),

        {columns: [{width: '50%', text: 'Surface:'}, {width: '25%', style: 'caseStyleBold', text: surface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface des annexes:'}, {width: '25%', style: 'caseStyleBold', text: additionalSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface du terrain:'}, {width: '25%', style: 'caseStyleBold', text: landSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Norme de construction:'}, {width: '25%', style: 'caseStyleBold', text: constructionNorm, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Date de livraison:'}, {width: '25%', style: 'caseStyleBold', text: deliveryDate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Numéro de lot:'}, {width: '25%', style: 'caseStyleBold', text: lotNumber, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Nombre de pièces:'}, {width: '25%', style: 'caseStyleBold', text: roomCount, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Programme:'}, {width: '25%', style: 'caseStyleBold', text: programm, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'DPE:'}, {width: '25%', style: 'caseStyleBold', text: dpeRate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
      ];
    }


    encodeHouseConstructionProject(aProject: HouseConstruction) {
      // Project progression
      const projectState = (aProject.project_state) ? ProjectStateMap.toString(aProject.project_state) : '';

      // Specific
      const surfaces = this.formatSurfaces(aProject.surfaces);
      const surface = surfaces.surface;
      const additionalSurface = surfaces.additional_surface;
      const landSurface = surfaces.land_surface;
      const dpeRate = this.formatFldAsString(aProject.dpe_rate);
      const deliveryDate = this.formatDateAsString(aProject.delivery_date);
      const constructionNorm = this.formatFldAsString(ConstructionNormStringMap.toString(aProject.construction_norm));
      const lotNumber = this.formatFldAsString(aProject.lot_number);
      const roomCount = this.formatNbr(aProject.rooms_count);

      const callsForFundsTable = this.formatCallsForFundsTable(aProject.calls_for_funds);
      const callsForFundsType = aProject.calls_for_funds ? {columns: [{width: '50%', text: 'Mode de déblocage des appels de fonds:'}, {width: '50%', style: 'caseStyleBold', text: CallsForFundsTypeStringMap.toString(aProject.calls_for_funds.type), alignment: 'left'} ]} : {};

      return [
        {style: 'h2', text: 'Informations relatives au projet'},
        {columns: [{width: '50%', text: 'Etat d\'avancement du projet:'}, {width: '25%', style: 'caseStyleBold', text: projectState, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {style: 'bigLineBreak', text: ''},
        callsForFundsType,
        callsForFundsTable,
        {style: 'bigLineBreak', text: ''},
        ...this.encodeAdministrativeInformation(aProject.administrative_information),
        {columns: [{width: '50%', text: 'Surface:'}, {width: '25%', style: 'caseStyleBold', text: surface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface des annexes:'}, {width: '25%', style: 'caseStyleBold', text: additionalSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Surface du terrain:'}, {width: '25%', style: 'caseStyleBold', text: landSurface, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Date de livraison:'}, {width: '25%', style: 'caseStyleBold', text: deliveryDate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Norme de construction:'}, {width: '25%', style: 'caseStyleBold', text: constructionNorm, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Numéro de lot:'}, {width: '25%', style: 'caseStyleBold', text: lotNumber, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Nombre de pièces:'}, {width: '25%', style: 'caseStyleBold', text: roomCount, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'DPE:'}, {width: '25%', style: 'caseStyleBold', text: dpeRate, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},

        {style: 'bigLineBreak', text: ''},
        ...this.formatSeller(aProject.seller)
      ];
    }

    encodeProject(aProject: any) {
      switch(aProject.type) {
        case 'HOUSE_CONSTRUCTION':
          return this.encodeHouseConstructionProject(aProject);
        case 'LAND':
          return this.encodeLandProject(aProject);
        case 'OLD_PROPERTY':
          return this.encodeOldPropertyProject(aProject);
        case 'NEW_PROPERTY':
          return this.encodeNewPropertyProject(aProject);
        case 'WORKS':
          return this.encodeWorksProject(aProject);
        case 'BALANCING_ADJUSTMENT':
          return this.encodeBalancingAdjustmentProject(aProject);
        }
    }


    summaryFunding(params: FundingParameters, results: FundingResults): any {

        const bridgeList = this.generateBridgeSection(params.loans);
        const burdensList = this.generateSmoothableChargesSection(params.loans);
        const taegs = this.generateTaegSection(results.taegs);
        const resultSummary = this.encodeFundingSummary(params, results);

        const listSummary = [
          {style: 'smallLineBreak', text: '', pageBreak: 'after'},
          {style: 'h2', text: 'Résumé du plan de financement'},
          ...resultSummary,
          {style: 'bigLineBreak', text: ''},
          {style: 'h2', text: 'Décomposition du financement pour ce projet'},
          ...this.generateBalanceTable(this.aCase.project, results, this.yellowCell, this.blueCell, this.greenCell, this.purpleCell),
          {style: 'bigLineBreak', text: ''},
          {columns: [{style: 'icons', width: 15, svg: this.encodePTZSection(params.loans, results.loans)[0]}, {style: 'iconsText', width: 'auto', text: this.encodePTZSection(params.loans, results.loans)[1]}] },
          {columns: [{style: 'icons', width: 15, svg: this.encodeBossLoanSection(params.loans, results.loans)[0]}, {style: 'iconsText', width: 'auto', text: this.encodeBossLoanSection(params.loans, results.loans)[1]}] },
          {columns: [{style: 'icons', width: 15, svg: this.encodeProfileSection(params)[0]}, {style: 'iconsText', width: 'auto', text: this.encodeProfileSection(params)[1]}] },
          ...bridgeList,
          ...burdensList,
          ...taegs,
          {style: 'smallLineBreak', text: '', pageBreak: 'after'},
        ];

        return listSummary;
    }

}
