import { Injectable } from '@angular/core';
import { Case, Budget, BudgetParameters, BudgetResults, Individual, LegalPerson, Partner, ActivePartner, FundingResults, Taeg, SmoothableCharge, BridgeLoan, AvailableLoan, Loan } from '../../_api/model/models';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { IconsSvg } from './icons-svg';
import { PDFExportService } from './pdf-export.service';
import { LegalPersonTypeMap } from 'src/app/utils/strings';
import { CourtesyTypeMap } from 'src/app/utils/strings';
import { AcquisitionNatureMap, AcquisitionStateMap, AcquisitionDestinationMap,  } from 'src/app/utils/strings';
import * as palette from 'google-palette';


@Injectable({
    providedIn: 'root'
})
export class BudgetPDFExportService extends PDFExportService {

    currentDate = new Date();
    summary: any;
    iconUser: any;

    // Colors for the table
    colormap = palette(['tol-rainbow'], 10);
    yellowCell = '#' + this.colormap[7];
    blueCell = '#' + this.colormap[2];
    greenCell = '#' + this.colormap[4];
    purpleCell = '#' + this.colormap[0];


    exportToPDF(caseId: string, caseName: string, aCase: Case, aPartners: ActivePartner[], budgetSummary, params: BudgetParameters, results: BudgetResults, profileChart: any, pieChart: any, iconUser: any): any {

        this.summary = budgetSummary;
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


    content(params: BudgetParameters, results: BudgetResults, profileChart: any, pieChart: any): any {
        return [
            ...this.encodeContact('Estimation de budget', this.iconUser, this.currentDate),
            ...this.summaryBudget(params, results),
            ...this.encodeProject(this.aCase.project),
            ...this.encodePartnersTable(this.aPartners),
            ...this.encodeCase(this.aCase),
            ...this.graph(results.funding_plan, profileChart, pieChart),
            ...this.loanTables(results.funding_plan)
        ];
    }

    // Generate the table that recap all budgets of the projets
    generateBudgetTable(aResults: BudgetResults, yellowCell, blueCell, greenCell, purpleCell) {
      const maximalPrice = LocaleUtils.toLocale(aResults.budgets.maximal_price, 'EUR');
      const otherExpenses = LocaleUtils.toLocale(aResults.budgets.other_expenses, 'EUR');
      const brokerFees = LocaleUtils.toLocale(aResults.budgets.broker_fees, 'EUR');
      const fileManagementFees = LocaleUtils.toLocale(aResults.budgets.file_management_fees, 'EUR');
      const notaryFees = LocaleUtils.toLocale(aResults.budgets.notary_fees, 'EUR');
      const guarantiesFees = LocaleUtils.toLocale(aResults.budgets.guaranties_fees, 'EUR');
      const totalPersonalFunding = LocaleUtils.toLocale(aResults.funding_plan.summary.total_personal_funding, 'EUR');
      const totalBudget = LocaleUtils.toLocale(aResults.budgets.total_budget, 'EUR');
      const totalProject = LocaleUtils.toLocale(aResults.budgets.maximal_price + aResults.budgets.other_expenses, 'EUR');
      const totalFees = LocaleUtils.toLocale(aResults.budgets.broker_fees + aResults.budgets.file_management_fees + aResults.budgets.notary_fees + aResults.budgets.guaranties_fees, 'EUR');

      return [{
        table: {
          widths: [20, 170, 'auto', 100, 'auto'],
          headerRows: 2,
          body: [
            [{text: '', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingMaximalPriceStr, fillColor: yellowCell, color: 'white'}, {text: maximalPrice, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: 'Total projet', rowSpan: 2, fillColor: yellowCell, color: 'white'}, {text: totalProject, rowSpan: 2, fillColor: yellowCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: yellowCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingOtherExpensesStr, fillColor: yellowCell, color: 'white'}, {text: otherExpenses, fillColor: yellowCell, alignment: 'right', color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}, {text: '', fillColor: yellowCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingBrokerFeesStr, fillColor: blueCell, color: 'white'}, {text: brokerFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: 'Total frais', rowSpan: 4, fillColor: blueCell, color: 'white'}, {text: totalFees, rowSpan: 4, fillColor: blueCell, alignment: 'right', color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingFileManagementFeesStr, fillColor: blueCell, color: 'white'}, {text: fileManagementFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingNotaryFeesStr, fillColor: blueCell, color: 'white'}, {text: notaryFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '+', fillColor: blueCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingGuarantiesStr, fillColor: blueCell, color: 'white'}, {text: guarantiesFees, fillColor: blueCell, alignment: 'right', color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}, {text: '', fillColor: blueCell, color: 'white'}],
            [{text: '-', fillColor: greenCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingPersonalFundingStr, fillColor: greenCell, color: 'white'}, {text: totalPersonalFunding, fillColor: greenCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}],
            [{text: '=', fillColor: purpleCell, alignment: 'center', color: 'white'}, {text: LoanUtils.balancingMaximalBorrowableStr, fillColor: purpleCell, color: 'white'}, {text: totalBudget, fillColor: purpleCell, alignment: 'right', color: 'white'}, {text: ''}, {text: ''}]
          ]
        },
        layout: 'noBorders'
      }]
    }

    encodeBudgetSummary(params: BudgetParameters, results: BudgetResults) {
      const budgetSummary = LoanUtils.generateBudgetSummary(params, results);
      return [
        {columns: [{width: '50%', text: LoanUtils.totalCostStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.total_cost, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.totalInterestsStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.interests_cost, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.totalInsurancesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.insurances_cost, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.totalGuarantiesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.guaranties_cost, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.fileManagementFeesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.file_management_fees, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.brokerFeesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.broker_fees, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.otherExpensesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.notary_fees, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.maximalInstalementStr},  {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.effective_maximal_monthly_payment, 'EUR'),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.notaryFeesStr}, {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.other_expenses, 'EUR'), alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.planLengthStr},  {width: '25%', style: 'caseStyleBold', text: budgetSummary.plan_length + ' mois',  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.personalFundingPercentageStr + budgetSummary.personal_funding_ratio + '%' + LoanUtils.personalFundingAbsoluteStr},  {width: '25%', style: 'caseStyleBold', text: LocaleUtils.toLocale(budgetSummary.personal_funding, 'EUR'),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.debtRatioStr},  {width: '25%', style: 'caseStyleBold', text: this.formatNbr(LocaleUtils.roundFloat(budgetSummary.normal_debt_ratio)) + '%',  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.jumpChargeStr},  {width: '25%', style: 'caseStyleBold', text: this.formatNbr(LocaleUtils.toLocale(budgetSummary.jump_charge, 'EUR')),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: LoanUtils.remainingForLivingStr},  {width: '25%', style: 'caseStyleBold', text: this.formatMonetaryNbr(budgetSummary.remaining_for_living),  alignment: 'right'}, {width: '25%', style: 'caseStyleBold', text: ''}]}
      ];
    }

    encodeProject(aBudget: Budget) {
      const nature = (aBudget && aBudget.administrative_information && aBudget.administrative_information.nature) ? AcquisitionNatureMap.toString(aBudget.administrative_information.nature) : '';
      const state = (aBudget && aBudget.administrative_information && aBudget.administrative_information.state) ? AcquisitionStateMap.toString(aBudget.administrative_information.state) : '';
      const destination = (aBudget && aBudget.administrative_information && aBudget.administrative_information.destination) ? AcquisitionDestinationMap.toString(aBudget.administrative_information.destination) : '';
      const address = (aBudget && aBudget.administrative_information && aBudget.administrative_information.address) ? this.formatLocation(aBudget.administrative_information.address).address : '';
      const postalCode = (aBudget && aBudget.administrative_information && aBudget.administrative_information.address) ? this.formatLocation(aBudget.administrative_information.address).postal_code : '';
      const city = (aBudget && aBudget.administrative_information && aBudget.administrative_information.address) ? this.formatLocation(aBudget.administrative_information.address).city : '';
      const country = (aBudget && aBudget.administrative_information && aBudget.administrative_information.address) ? this.formatLocation(aBudget.administrative_information.address).country : '';
      const inseeCode = (aBudget && aBudget.administrative_information && aBudget.administrative_information.address) ? this.formatLocation(aBudget.administrative_information.address).insee_code : '';
      const landRegisterReference = (aBudget && aBudget.administrative_information && aBudget.administrative_information.land_register_reference) ? aBudget.administrative_information.land_register_reference : '';
      const description = (aBudget && aBudget.administrative_information && aBudget.administrative_information.description) ? aBudget.administrative_information.description : '';
      const targetDpe = (aBudget && aBudget.dpe_rate) ? aBudget.dpe_rate : '';
      const comment = (aBudget && aBudget.comment) ? aBudget.comment : '';

      return [
        {style: 'h2', text: 'Informations relatives au projet'},
        {columns: [{width: '50%', text: 'Nature de l\'acquisition:'}, {width: '25%', style: 'caseStyleBold', text: nature, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Etat de l\'acquisition:'}, {width: '25%', style: 'caseStyleBold', text: state, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Destination de l\'acquisition:'}, {width: '25%', style: 'caseStyleBold', text: destination, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Ville d\'acquisition (si celle-ci est déjà connue):'}, {width: '25%', style: 'caseStyleBold', text: city, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'INSEE code de la zone d\'acquisition (si celui-ci est déjà connu):'}, {width: '25%', style: 'caseStyleBold', text: inseeCode, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'DPE (après travaux éventuels), si celui-ci est connu:'}, {width: '25%', style: 'caseStyleBold', text: targetDpe, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Description:'}, {width: '25%', style: 'caseStyleBold', text: description, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
        {columns: [{width: '50%', text: 'Commentaire:'}, {width: '25%', style: 'caseStyleBold', text: comment, alignment: 'left'}, {width: '25%', style: 'caseStyleBold', text: ''}]},
      ];

    }


    summaryBudget(params: BudgetParameters, results: BudgetResults): any {

        const bridgeList = this.generateBridgeSection(params.loans);
        const burdensList = this.generateSmoothableChargesSection(params.loans);
        const taegs = this.generateTaegSection(results.funding_plan.taegs);
        const resultSummary = this.encodeBudgetSummary(params, results);


        const listSummary = [
         {style: 'smallLineBreak', text: '', pageBreak: 'after'},
          {style: 'h2', text: 'Résumé du plan de financement'},
          ...resultSummary,
          {style: 'bigLineBreak', text: ''},
          {style: 'h2', text: 'Décomposition du budget pour ce projet'},
          ...this.generateBudgetTable(this.aResults, this.yellowCell, this.blueCell, this.greenCell, this.purpleCell),
          {style: 'bigLineBreak', text: ''},
          {columns: [{style: 'icons', width: 15, svg: this.encodePTZSection(params.loans, results.funding_plan.loans)[0]}, {style: 'iconsText', width: 'auto', text: this.encodePTZSection(params.loans, results.funding_plan.loans)[1]}] },
          {columns: [{style: 'icons', width: 15, svg: this.encodeBossLoanSection(params.loans, results.funding_plan.loans)[0]}, {style: 'iconsText', width: 'auto', text: this.encodeBossLoanSection(params.loans, results.funding_plan.loans)[1]}] },
          {columns: [{style: 'icons', width: 15, svg: this.encodeProfileSection(params)[0]}, {style: 'iconsText', width: 'auto', text: this.encodeProfileSection(params)[1]}] },
          ...bridgeList,
          ...burdensList,
          ...taegs,
          {style: 'smallLineBreak', text: '', pageBreak: 'after'},
        ];

        return listSummary;
    }
}
