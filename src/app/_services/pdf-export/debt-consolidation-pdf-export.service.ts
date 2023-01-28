import { Injectable } from '@angular/core';
import { Case, FundingParameters, FundingResults, ActivePartner, DebtConsolidationResults, DebtConsolidationParameters } from '../../_api/model/models';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { IconsSvg } from './icons-svg';
import { PDFExportService } from './pdf-export.service';
import { FundingPDFExportService } from './funding-pdf-export.service';
import { ProjectStringMap } from 'src/app/utils/strings';
import { CourtesyTypeMap, ProjectStateMap } from 'src/app/utils/strings';
import { AcquisitionNatureMap, AcquisitionStateMap, AcquisitionDestinationMap,  } from 'src/app/utils/strings';
import * as palette from 'google-palette';

@Injectable({
    providedIn: 'root'
})
export class DebtConsolidationPDFExportService extends PDFExportService {

    currentDate = new Date();
    summary: any;
    iconUser: any;
    aDebtConsolidationResults: DebtConsolidationResults;
    aFundingPDFExportService = new FundingPDFExportService();

    // Colors for the table
    colormap = palette(['tol-rainbow'], 10);
    yellowCell = '#' + this.colormap[7];
    blueCell = '#' + this.colormap[2];
    greenCell = '#' + this.colormap[4];
    purpleCell = '#' + this.colormap[0];
    redCell = '#' + this.colormap[9];


    exportToPDF(caseId: string, caseName: string, aCase: Case, aPartners: ActivePartner[], planSummary, params: DebtConsolidationParameters, debtConsolidationResults: DebtConsolidationResults, profileChart: any, pieChart: any, iconUser: any): any {

        this.summary = planSummary;
        this.aCase = aCase;
        this.aPartners = aPartners;
        this.caseId = caseId;
        this.caseName = caseName;
        this.aParams = params;
        this.aResults = debtConsolidationResults.funding_plan; // We put funding results here !
        this.aDebtConsolidationResults = debtConsolidationResults;
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
            content: this.content(this.aParams, this.aDebtConsolidationResults, profileChart, pieChart)
        };
    }


    content(params: DebtConsolidationParameters, results: DebtConsolidationResults, profileChart: any, pieChart: any): any {
        return [
            ...this.encodeContact('Demande de financement (Rachat de crédit)', this.iconUser, this.currentDate),
            ...this.summaryDebtConsolidationFunding(params, results),
            ...this.summaryDebtConsolidation(),
            ...this.encodePartnersTable(this.aPartners),
            ...this.encodeCase(this.aCase),
            ...this.graph(results.funding_plan, profileChart, pieChart),
            ...this.loanTables(results.funding_plan)
        ];
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

    generateBalanceTable(aProject: any, aResults: DebtConsolidationResults, yellowCell, blueCell, greenCell, purpleCell) {
      const capitalToBuyAmount = aResults?.loans_remaining_costs?.[0].capital;
      const capitalToBuy = LocaleUtils.toLocale(capitalToBuyAmount, 'EUR');

      const iraValueAmount = aResults?.loans_remaining_costs?.[0].ira?.value;
      const iraValue = LocaleUtils.toLocale(iraValueAmount, 'EUR');

      const otherExpensesAmount = aProject.expenses.other_expenses ? aProject.expenses.other_expenses : 0
      const otherExpenses = LocaleUtils.toLocale(otherExpensesAmount, 'EUR');

      const brokerFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.broker_fees) ? this.aParams.funding_fees.broker_fees : 0;
      const brokerFees = LocaleUtils.toLocale(brokerFeesAmount, 'EUR');

      const fileManagementFeesAmount = (this.aParams.funding_fees && this.aParams.funding_fees.file_management_fees) ? this.aParams.funding_fees.file_management_fees : 0;
      const fileManagementFees = LocaleUtils.toLocale(fileManagementFeesAmount, 'EUR');

      const guarantiesFeesAmount = (aResults.funding_plan.summary && aResults.funding_plan.summary.total_guaranty) ? aResults.funding_plan.summary.total_guaranty : 0;
      const guarantiesFees = LocaleUtils.toLocale(guarantiesFeesAmount, 'EUR');

      const totalPersonalFundingAmount = (aResults.funding_plan.summary && aResults.funding_plan.summary.total_personal_funding) ? aResults.funding_plan.summary.total_personal_funding : 0;
      const totalPersonalFunding = LocaleUtils.toLocale(totalPersonalFundingAmount, 'EUR');

      const totalProjectAmount = (capitalToBuyAmount?? 0)
                               + (otherExpensesAmount?? 0);
      const totalProject = LocaleUtils.toLocale(totalProjectAmount, 'EUR');

      const totalFeesAmount = brokerFeesAmount + fileManagementFeesAmount + iraValueAmount + guarantiesFeesAmount;
      const totalFees = LocaleUtils.toLocale(totalFeesAmount, 'EUR');

      const totalFundedAmount = LocaleUtils.toLocale(totalProjectAmount + totalFeesAmount - totalPersonalFundingAmount, 'EUR');

      return [{
        table: {
          widths: [20, 170, 'auto', 100, 'auto'],
          headerRows: 2,
          body: [
            [{text: '', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.totalCapitalToBuy, fillColor: yellowCell, color: 'white'}, {text: capitalToBuy, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: 'Total projet', rowSpan: 2, fillColor: yellowCell, color: 'white'}, {text: totalProject, rowSpan: 2, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: blueCell, color: 'white'}, {text: brokerFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: 'Total frais', rowSpan: 4, fillColor: blueCell, color: 'white'}, {text: totalFees, rowSpan: 4, fillColor: blueCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: blueCell, color: 'white'}, {text: fileManagementFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.iraValue, fillColor: blueCell, color: 'white'}, {text: iraValue, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingGuarantiesStr, fillColor: blueCell, color: 'white'}, {text: guarantiesFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '-', fillColor: greenCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: greenCell, color: 'white'}, {text: totalPersonalFunding, fillColor: greenCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}],
            [{text: '=', fillColor: purpleCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBorrowedAmountStr, fillColor: purpleCell, color: 'white'}, {text: totalFundedAmount, fillColor: purpleCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}]
          ]
        },
        layout: 'noBorders'
      }]
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////



    generateGainDefinitTable(yellowCell, greenCell, redCell, blueCell) {
      const debtConsolidationSummary = LocaleUtils.computeDebtConsolidationSummary(this.aParams, this.aDebtConsolidationResults);
      const totalGain = LocaleUtils.toLocale(debtConsolidationSummary.total_gain, 'EUR');
      const totalRemainingInterests = LocaleUtils.toLocale(debtConsolidationSummary.total_remaining_interests, 'EUR');
      const totalRemainingInsurance = LocaleUtils.toLocale(debtConsolidationSummary.total_remaining_insurance, 'EUR');
      const totalNewInterests = LocaleUtils.toLocale(debtConsolidationSummary.total_new_interests, 'EUR');
      const totalNewInsurance = LocaleUtils.toLocale(debtConsolidationSummary.total_new_insurance, 'EUR');
      const totalIra = LocaleUtils.toLocale(debtConsolidationSummary.total_ira, 'EUR');
      const totalNewGuaranty = LocaleUtils.toLocale(debtConsolidationSummary.total_new_guaranty, 'EUR');
      const otherExpenses = LocaleUtils.toLocale(debtConsolidationSummary.other_expenses, 'EUR');
      const fileManagementFees = LocaleUtils.toLocale(debtConsolidationSummary.file_management_fees, 'EUR');
      const brokerFees = LocaleUtils.toLocale(debtConsolidationSummary.broker_fees, 'EUR');
      const totalPersonalFunding = LocaleUtils.toLocale(this.aDebtConsolidationResults.funding_plan.summary.total_personal_funding, 'EUR');

      const bilanColor = debtConsolidationSummary.total_gain > 0 ? greenCell : redCell;
      const bilanText = debtConsolidationSummary.total_gain > 0 ? LoanUtils.gainStr : LoanUtils.deficitStr;

      return [{
        table: {
          widths: [ 25, 250, 100],
          body: [
            [{text: '', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.remainingInterestsStr, fillColor: blueCell, color: 'white'}, {text: totalRemainingInterests, fillColor: blueCell, alignment: 'right', color: 'white'}],

            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.remainingInsuranceStr, fillColor: blueCell, color: 'white'}, {text: totalRemainingInsurance, fillColor: blueCell, alignment: 'right', color: 'white'}],

            [{text: '-', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.interestsNewPlanStr, fillColor: yellowCell, color: 'white'}, {text: totalNewInterests, fillColor: yellowCell, alignment: 'right', color: 'white'}],

            [{text: '-', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.insuranceNewPlanStr, fillColor: yellowCell, color: 'white'}, {text: totalNewInsurance, fillColor: yellowCell, alignment: 'right', color: 'white'}],

            [{text: '-', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.iraStr, fillColor: yellowCell, color: 'white'}, {text: totalIra, fillColor: yellowCell, alignment: 'right', color: 'white'}],

            [{text: '-', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.newGuarantyStr, fillColor: yellowCell, color: 'white'}, {text: totalNewGuaranty, fillColor: yellowCell, alignment: 'right', color: 'white'}],

            [{text: '-', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}],

            [{text: '-', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: yellowCell, color: 'white'}, {text: fileManagementFees, fillColor: yellowCell, alignment: 'right', color: 'white'}],

            [{text: '-', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: yellowCell, color: 'white'}, {text: brokerFees, fillColor: yellowCell, alignment: 'right', color: 'white'}],

            // [{text: '-', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: yellowCell, color: 'white'}, {text: totalPersonalFunding, fillColor: yellowCell, alignment: 'right', color: 'white'}],

            [{text: '=', fillColor: bilanColor, alignment: 'center', color: 'white'}, {text: bilanText, fillColor: bilanColor, color: 'white'}, {text: totalGain, fillColor: bilanColor, alignment: 'right', color: 'white'}],
          ]
        },
        layout: 'noBorders',
      }]
    }


    summaryDebtConsolidation() {
      const aDebtSummary = {
          style: 'table',
          // margin: [50, 0, 0, 0],
          headerRows: 1,
          widths: ['100%'],
          table: {
              body: [
                  LocaleUtils.loansToConsolidateTableHeader.map(
                      v => ({style: 'thead', text: v, alignment: 'center'})
                  )
              ],
               widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
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

      const insurancesRecap = LoanUtils.generateInsurancesRecapForLoansToConsolidate(this.aParams.project.loans_to_consolidate);
      let aInsuranceSummary = null;
      if (insurancesRecap.length) {
        aInsuranceSummary = aPreparedInsuranceSummary;
        aInsuranceSummary.table.body.push(...insurancesRecap);
      }

      const debtConsolidationTable = LocaleUtils.buildLoansToConsolidateTable(this.aParams, this.aDebtConsolidationResults);
      aDebtSummary.table.body.push(...debtConsolidationTable);
      return [
        {style: 'h2', text: 'Détail de l\'opération de rachat', alignment: 'center', pageOrientation: 'landscape', pageBreak: 'before'},
        {style: 'bigLineBreak', text: ''},
        {style: 'bigLineBreak', text: ''},
        {style: 'h3centerbold', width: '100%', text: 'Caractéristiques du prêt racheté et assurance(s) associée(s)'},
        aDebtSummary,
        { columns: [ { width: '20%', text: '' }, aInsuranceSummary, { width: '*', text: '' } ] },
        {style: 'bigLineBreak', text: ''},
        {style: 'bigLineBreak', text: ''},
        {style: 'bigLineBreak', text: ''},
        {style: 'h3centerbold', width: '100%', text: 'Bilan de l\'opération de rachat'},
        {style: 'bigLineBreak', text: ''},
        {style: 'bigLineBreak', text: ''},
        { columns: [{ width: 175, text: '' }, ...this.generateGainDefinitTable(this.yellowCell, this.greenCell, this.redCell, this.blueCell), { width: '*', text: '' } ] }
      ];

    }


    summaryDebtConsolidationFunding(params: DebtConsolidationParameters, results: DebtConsolidationResults): any {

        const bridgeList = this.generateBridgeSection(params.loans);
        const burdensList = this.generateSmoothableChargesSection(params.loans);
        const taegs = this.generateTaegSection(results.funding_plan.taegs);
        const resultSummary = this.aFundingPDFExportService.encodeFundingSummary(params, results.funding_plan);

        const listSummary = [
          {style: 'smallLineBreak', text: '', pageBreak: 'after'},
          {style: 'h2', text: 'Résumé du plan de financement'},
          ...resultSummary,
          {style: 'bigLineBreak', text: ''},
          {style: 'h2', text: 'Décomposition du financement pour ce projet'},
          ...this.generateBalanceTable(this.aCase.project, this.aDebtConsolidationResults, this.yellowCell, this.blueCell, this.greenCell, this.purpleCell),
          {style: 'bigLineBreak', text: ''},
          {columns: [{style: 'icons', width: 15, svg: this.encodeProfileSection(params)[0]}, {style: 'iconsText', width: 'auto', text: this.encodeProfileSection(params)[1]}] },
          {style: 'bigLineBreak', text: ''},
          ...bridgeList,
          ...burdensList,
          ...taegs,
          // {style: 'smallLineBreak', text: '', pageBreak: 'after'},
        ];

        return listSummary;
    }

}
