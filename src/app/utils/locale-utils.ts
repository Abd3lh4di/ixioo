// import { Loan, BudgetSimulationDetails, DebtConsolidationDetails, FundingSimulationDetails, PinelSimulationDetails } from '../api/models';

// export type SimulationDetails = BudgetSimulationDetails | FundingSimulationDetails | PinelSimulationDetails | DebtConsolidationDetails;

import { TypedFormArray } from '../typed-form-array';
import { Case, DebtConsolidationParameters, DebtConsolidationResults, Loan, LoanToConsolidate } from '../_api';
import { LoanTypeMap, GracePeriodTypeMap, GuarantyTypeMap, InsuranceTypeMap, IraTypeMap, ProfileTypeMap } from './strings';


export class LocaleUtils {

    static readonly patrimonyTableHeader = ['Référence', 'Type', 'Valeur', 'Démembrement éventuel', 'Date d\'achat ou d\'ouverture', 'Capital restant du', 'Commentaire', 'Est à vendre ?'];
    static readonly patrimonyForSaleTableHeader = ['Référence', 'Prix', 'Frais', 'Impôt', 'Date de signature du compromis', 'Date de levée des conditions suspensives', 'Date de signature'];
    static readonly partnersTableHeader = ['Type', 'Nom', 'Agence ou filiale', 'Adresse', 'Nom du contact', 'Téléphone', 'Email', 'Numéro d\'agrément', 'Role (acheteur, vendeur, commun)'];
    static readonly amortizationTableHeader = ['Numéro d\'échance', 'Amortissement', 'Intérêts', 'Assurance', 'Capital restant dû', 'Échéance', 'Montant débloqué'];
    static readonly chargesTableHeader = ['Type de charge', 'Avant/après projet', 'Montant mensuel', 'Pondération éventuelle', 'Commentaire'];
    static readonly revenuesTableHeader = ['Type de revenu', 'Montant mensuel', 'Pondération éventuelle', 'Commentaire'];
    static readonly currentLoansTableHeader = ['Type de prêt', 'Futur du prêt', 'Mensualité', 'Pondération éventuelle', 'Capital restant dû', 'Date de début', 'Date de fin', 'Organisme préteur'];
    static readonly callsForFundsTableHeader = ['Raison du déblocage', 'Mois de déblocage', 'Pourcentage'];

    static readonly pinelTableHeader = ['Année', 'Évolution du prix', 'Évolution du loyer', 'Loyer perçus', 'Intérêt d\'emprunt', 'Charges locatives', 'Résultat locatif', 'Impôts sur le résultat locatif', 'Impact Pinel sur l\'impot', 'Réduction d\'impot', 'Besoin de trésorerie'];
    static readonly loansToConsolidateTableHeader = ['Numéro du prêt', 'Durée', 'Taux', 'Capital initial', 'Capital restant dû', 'Intérets restants', 'Assurance restante', 'Date de début', 'Type d\'IRA', 'Montant des IRA'];

    static toLocale(aNumber, displayCurrency = '') {
        let aIntl = new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2, minimumFractionDigits: 2});
        if (displayCurrency) {
            aIntl = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: displayCurrency, currencyDisplay: 'symbol'});
        }
        // We replace narrow non-breaking spaces (String.fromCharCode(0x202F)), that are not recognized in the PDF file,
        // by standard non-breaking spaces ('\xa0')
        return aIntl.format(parseFloat(aNumber)).replace(new RegExp(String.fromCharCode(0x202F), 'g'), '\xa0');
    }

    static computeAgeFromBirthDate(aBirthDate) {
      if (aBirthDate !== null && aBirthDate !== undefined) {
        const localBirthDate = new Date(Date.parse(aBirthDate));
        const timeDiff = Math.abs(Date.now() - localBirthDate.getTime());
        const localAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        return localAge
      }
      return 'Non renseigné'
    }

    static roundFloat(aFloat) {
         return Math.round((aFloat + Number.EPSILON) * 100) / 100;
    }


  static monthDiff(d1, d2) {
      let months;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth();
      months += d2.getMonth();
      return months <= 0 ? 0 : months;
  }


  static buildLoansToConsolidateTable(simulationParameters: DebtConsolidationParameters, simulationResults: DebtConsolidationResults) {
    const aLoansToConsolidateTable = [];
    const sums = [0, 0, 0, 0]; // sumCRD, sumInterest, sumInsurance, sumIRA

    for ( const loanToConsolidate of simulationParameters.project?.loans_to_consolidate?? [] ) {
      aLoansToConsolidateTable.push(
        this.formatLoanToConsolidate(simulationResults, aLoansToConsolidateTable.length, loanToConsolidate, sums)
      );
    }

    // Will be uncommented when we will manage more than 1 loan to consolidate
    /*aLoansToConsolidateTable.push(
        ['TOTAL', '', '', '', LocaleUtils.toLocale(sums[0], 'EUR'), LocaleUtils.toLocale(sums[1], 'EUR'), LocaleUtils.toLocale(sums[2], 'EUR'), '', '', LocaleUtils.toLocale(sums[3], 'EUR')]
      );*/

    return aLoansToConsolidateTable;
  }

  static formatLoanToConsolidate(simulationResults: DebtConsolidationResults, aIndex, aLoanToConsolidate: LoanToConsolidate, sums) {
    const firstInstalementDate = new Date(Date.parse(aLoanToConsolidate.first_monthly_payment_date));
    // const insuranceType = aLoanToConsolidate.insurance ? InsuranceType[aLoanToConsolidate.insurance[0].type] : 'Aucune';
    // const insuranceRate = aLoanToConsolidate.insurance ? aLoanToConsolidate.insurance[0].rate : 'N/A';

    sums[0] += simulationResults.loans_remaining_costs[aIndex].capital;
    sums[1] += simulationResults.loans_remaining_costs[aIndex].interest_cost;
    sums[2] += simulationResults.loans_remaining_costs[aIndex].insurance_cost;
    sums[3] += simulationResults.loans_remaining_costs[aIndex].ira.value;

    return [aIndex + 1,
            aLoanToConsolidate.duration_months,
            LocaleUtils.toLocale(aLoanToConsolidate.yearly_rate) + '%',
            LocaleUtils.toLocale(aLoanToConsolidate.initial_capital, 'EUR'),
            LocaleUtils.toLocale(simulationResults.loans_remaining_costs[aIndex].capital, 'EUR'),
            LocaleUtils.toLocale(simulationResults.loans_remaining_costs[aIndex].interest_cost, 'EUR'),
            LocaleUtils.toLocale(simulationResults.loans_remaining_costs[aIndex].insurance_cost, 'EUR'),
            firstInstalementDate.toLocaleDateString('fr-FR', {year: 'numeric', month: 'long', day: 'numeric' }),
            IraTypeMap.toString(aLoanToConsolidate.ira.type),
            LocaleUtils.toLocale(simulationResults.loans_remaining_costs[aIndex].ira.value, 'EUR')];
  }


  static computeDebtConsolidationSummary(simulationParameters: DebtConsolidationParameters, simulationResults: DebtConsolidationResults) {

    let totalRemainingInterests = 0;
    let totalRemainingInsurance = 0;
    let totalIRA = 0;
    let totalCapital = 0;

    simulationResults.loans_remaining_costs.forEach( cost => {
      totalRemainingInterests += cost.interest_cost;
      totalRemainingInsurance += cost.insurance_cost;
      totalIRA += cost.ira.value;
      totalCapital += cost.capital;
    });

    const totalNewInterests = simulationResults.funding_plan.summary.total_interests;
    const totalNewInsurance = simulationResults.funding_plan.summary.total_insurances;
    const totalNewGuaranty = simulationResults.funding_plan.summary.total_guaranty;
    const totalPersonalFunding = simulationResults.funding_plan.summary.total_personal_funding;

    const otherExpenses = (simulationParameters?.project?.expenses?.other_expenses ?? 0);
    const fileManagementFees = (simulationParameters?.funding_fees?.file_management_fees ?? 0);
    const brokerFees = (simulationParameters?.funding_fees?.broker_fees ?? 0);


    const totalGain = totalRemainingInterests
                    + totalRemainingInsurance
                    - totalNewInterests
                    - totalNewInsurance
                    - totalNewGuaranty
                    - otherExpenses
                    - fileManagementFees
                    - brokerFees
                    - totalIRA;
                    // - totalPersonalFunding;

  return {total_gain: totalGain, total_capital: totalCapital, total_remaining_interests: totalRemainingInterests, total_remaining_insurance: totalRemainingInsurance, total_new_interests: totalNewInterests,
          total_new_insurance: totalNewInsurance, total_ira: totalIRA, total_new_guaranty: totalNewGuaranty, other_expenses: otherExpenses, file_management_fees: fileManagementFees,
          broker_fees: brokerFees}


  }


  static buildPinelTable(pinelPlanTable) {

    const pinelTable = [];

    let sumRent = 0;
    let sumLoanInterest = 0;
    let sumRentalCharges = 0;
    let sumRentalResult = 0;
    let sumTaxesOnRentalIncome = 0;
    let sumPinelImpactOnTax = 0;
    let sumResultingTaxReduction = 0;
    let sumCashRequirement = 0;

    for (let year = 0; year < pinelPlanTable.interests.length; year++ ) {
      sumRent += pinelPlanTable.renting_received[year];
      sumLoanInterest += pinelPlanTable.interests[year];
      sumRentalCharges += pinelPlanTable.deductible_charges[year];
      sumRentalResult += pinelPlanTable.renting_result[year];
      sumTaxesOnRentalIncome += pinelPlanTable.tax_on_renting_result[year];
      sumPinelImpactOnTax += pinelPlanTable.tax_reduction[year];
      sumResultingTaxReduction += pinelPlanTable.resulting_tax_impact[year];
      sumCashRequirement += pinelPlanTable.treasury[year];

      pinelTable.push([
        year+1,
        LocaleUtils.toLocale(pinelPlanTable.price_evolution[year]),
        LocaleUtils.toLocale(pinelPlanTable.renting_evolution[year]),
        LocaleUtils.toLocale(pinelPlanTable.renting_received[year]), // sum
        LocaleUtils.toLocale(pinelPlanTable.interests[year]), // sum
        LocaleUtils.toLocale(pinelPlanTable.deductible_charges[year]), // sum
        LocaleUtils.toLocale(pinelPlanTable.renting_result[year]), // sum
        LocaleUtils.toLocale(pinelPlanTable.tax_on_renting_result[year]), // sum
        LocaleUtils.toLocale(pinelPlanTable.tax_reduction[year]), // sum
        LocaleUtils.toLocale(pinelPlanTable.resulting_tax_impact[year]), // sum
        LocaleUtils.toLocale(pinelPlanTable.treasury[year]) // sum
      ]);
    }
    pinelTable.push([
      'TOTAL',
      '',
      '',
      LocaleUtils.toLocale(sumRent),
      LocaleUtils.toLocale(sumLoanInterest),
      LocaleUtils.toLocale(sumRentalCharges),
      LocaleUtils.toLocale(sumRentalResult),
      LocaleUtils.toLocale(sumTaxesOnRentalIncome),
      LocaleUtils.toLocale(sumPinelImpactOnTax),
      LocaleUtils.toLocale(sumResultingTaxReduction),
      LocaleUtils.toLocale(sumCashRequirement)
    ]);
    return pinelTable;
  }

  static getProfileString(parameters) {
    const type = parameters?.profile?.type
    let variation = 0;
    if (type && type === 'MONTHLY' || type === 'YEARLY') {
      variation = LocaleUtils.roundFloat(100 * Number(parameters?.profile?.variation)) ?? 0;
    }
    if (type && variation !== 0) {
      return ProfileTypeMap.toString(type) + ' (' + variation + '%)';
    }
    if (type) {
      return ProfileTypeMap.toString(type);
    }
    return 'Aucun';
  }

  static getMaxLoanDuration(loans: Loan[]): number {
    return Math.max.apply(Math, loans.map( l => l.duration_months ));
  }


//     static readonly pinelTableHeader = ['Année', 'Évolution du prix', 'Évolution du loyer', 'Loyer perçus', 'Intérêt d\'emprunt', 'Charges locatives', 'Résultat locatif', 'Impôts sur le résultat locatif', 'Impact Pinel sur l\'impot', 'Réduction d\'impot', 'Besoin de trésorerie'];
//     static readonly loansToConsolidateTableHeader = ['Numéro du prêt', 'Durée', 'Taux', 'Capital initial', 'Capital restant dû', 'Intérets restants', 'Assurance restante', 'Mensualité globale', 'Date de début', 'Type d\'assurance', 'Taux d\'assurance', 'Type d\'IRA', 'Montant des IRA'];

//     // Used for PDF generation
//     static readonly partnersTableHeader = ['Type', 'Nom', 'Adresse', 'Téléphone', 'Email', 'Numéro d\'agrément', 'Nom contact', 'Téléphone contact', 'Email contact'];

//     static getBurdens(loans: Loan[]): any[] {
//         return loans.filter( l => l.type === 'CHARGE')
//                     .map( burden => {
//                         let startMonth = 0;
//                         let endMonth = 0;
//                         let burdenValue = 0;
//                         burden.amortizations.forEach(
//                             (value, index) => {
//                             if (startMonth === 0 && value !== 0) {
//                                 startMonth = index + 1;
//                                 burdenValue = value;
//                             }
//                             if (value !== 0) {
//                                 endMonth = index + 1;
//                             }
//                             }
//                         );
//                         return { startMonth, endMonth, burdenValue };
//                     });
//     }

//     static getBridges(loans: Loan[]): any[] {
//         return loans.filter( l => l.type === 'BRIDGE')
//                     .map( bridge => ({ duration: bridge.duration_months, amount: bridge.amount }) );
//     }


//     static isEligiblePtz(loans: Loan[]): boolean {
//         return loans.filter( l => l.type === 'PTZ').length !== 0;
//     }

//     static getMaxLoanDuration(loans: Loan[]): number {
//         return Math.max.apply(Math, loans.map( l => l.duration_months ));
//     }

//     static sumArrays(...arrays) {
//       const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
//       const result = Array.from({ length: n });
//       return result.map((_, i) => arrays.map(xs => xs[i] || 0).reduce((sum, x) => sum + x, 0));
//     }

//     static getMaxInstalement(loans: Loan[]) {
//         const allInstalements = [];
//         loans.forEach((loan) => {
//             const insurances: number[] = loan.insurances[0].monthly_values;
//             const instalements = [];
//             for (let i = 0; i < loan.amortizations.length; i++) {
//                 if (loan.type !== 'BRIDGE') {
//                 instalements.push(loan.amortizations[i] + loan.interests[i] + insurances[i]);
//                 } else {
//                 instalements.push(loan.interests[i] + insurances[i]);
//                 }
//             }
//             allInstalements.push(instalements);
//         });
//         return Math.max(...Utils.sumArrays(...allInstalements));
//     }

//     static toLocale(aNumber, displayCurrency = '') {
//         let aIntl = new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2, minimumFractionDigits: 2});
//         if (displayCurrency) {
//             aIntl = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: displayCurrency, currencyDisplay: 'symbol'});
//         }
//         // We replace narrow non-breaking spaces (String.fromCharCode(0x202F)), that are not recognized in the PDF file,
//         // by standard non-breaking spaces ('\xa0')
//         return aIntl.format(parseFloat(aNumber)).replace(new RegExp(String.fromCharCode(0x202F), 'g'), '\xa0');
//     }

//     static generateAmortizationTable(loan: Loan) {

//         const insurances: number[] = loan.insurances[0].monthly_values;
//         return loan.amortizations.map((am, i) => [
//             i + 1,
//             Utils.toLocale(am),
//             Utils.toLocale(loan.interests[i]),
//             Utils.toLocale(insurances[i]),
//             Utils.toLocale(loan.remaining_capital[i]),
//             Utils.toLocale(am + loan.interests[i] + insurances[i]),
//             Utils.toLocale(loan.released_amounts[i])
//         ]);
//     }

}

//     static computeLoansTotalCosts(loans: Array<Loan>) {
//         let totalInterests = 0.0;
//         let totalGuaranty = 0.0;
//         let totalInsurance = 0.0;
//         loans.forEach((loan, loanId) => {
//             if (loan.type !== 'CHARGE') {
//                 totalInterests += loan.interests_cost;
//                 totalGuaranty += loan.guaranty ? loan.guaranty.guaranty_commission + loan.guaranty.mutualized_guaranty_contribution : 0;
//                 totalInsurance += loan.insurance_cost;
//             }
//         });
//         return {totalInterests, totalGuaranty, totalInsurance};
//     }

//     static loanTypeToHuman(loan) {
//         switch (loan.type) {
//             case LoanType.FREE:
//                 return `Prêt ${loan.yearly_rate}%`;
//             case LoanType.PTZ:
//                 return 'PTZ';
//             case LoanType.CHARGE:
//                 return 'Charge';
//             case LoanType.BRIDGE:
//                 return `Relais ${loan.yearly_rate}%`;
//         }
//     }

//     static loanTypeEnumToHuman(loan) {
//         switch (loan.type) {
//             case LoanType.FREE:
//                 return `Prêt libre`;
//             case LoanType.PTZ:
//                 return 'PTZ';
//             case LoanType.CHARGE:
//                 return 'Charge';
//             case LoanType.BRIDGE:
//                 return `Prêt relais`;
//         }
//     }









// }

// export enum LoanType {
//   FREE = 'FREE',
//   PTZ = 'PTZ',
//   BRIDGE = 'BRIDGE',
//   CHARGE = 'CHARGE'
// }

// export enum GracePeriodType {
//   PARTIAL = 'Partiel',
//   TOTAL = 'Total'
// }

// export enum GuarantyType {
//   HYPOTHEQUE = 'Hypothèque',
//   IPPD = 'IPPD',
//   CASDEN = 'Casden',
//   CREDIT_LOGEMENT_CLASSIC = 'Crédit Logement Classic',
//   CREDIT_LOGEMENT_INITIO = 'Crédit Logement Initio',
//   MGEN = 'Mgen'
// }

// export enum InsuranceType {
//   INITIAL_CAPITAL = 'Capital initial',
//   REMAINING_CAPITAL = 'Capital restant'
// }

// export enum IraType {
//   LEGAL = 'Légales',
//   NEGOCIATED = 'Négociées'
// }

