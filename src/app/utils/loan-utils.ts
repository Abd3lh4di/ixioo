import { Breakpoints } from '@angular/cdk/layout';
import { AvailableLoan, Loan, BudgetParameters, BudgetResults, FundingParameters, FundingResults, HouseConstructionExpensesFees, LandExpenses, NewPropertyExpenses, PinelParameters, DebtConsolidationParameters, LoanToConsolidate, LightLegalPerson, LightHouseholdDetails, CurrentLoan } from '../_api';
import { LocaleUtils } from './locale-utils';
import { ChargeTypeMapShort, GracePeriodTypeMap, GuarantyTypeMap, InsuranceTypeMap, LoansTypeShort, LoanTypeMap } from './strings';


// export type SimulationDetails = BudgetSimulationDetails | FundingSimulationDetails | PinelSimulationDetails | DebtConsolidationDetails;

export class LoanUtils {

    static readonly amortizationTableHeader = ['Numéro d\'échance', 'Amortissement', 'Intérêts', 'Assurance', 'Capital restant dû', 'Échéance', 'Montant débloqué'];
    static readonly amortizationTableHeader2Insurances = ['Numéro d\'échance', 'Amortissement', 'Intérêts', '', '', 'Capital restant dû', 'Échéance', 'Montant débloqué'];
    static readonly amortizationTableHeader3Insurances = ['Numéro d\'échance', 'Amortissement', 'Intérêts', '', '', '', 'Capital restant dû', 'Échéance', 'Montant débloqué'];
    static readonly amortizationTableHeader4Insurances = ['Numéro d\'échance', 'Amortissement', 'Intérêts', '', '', '', '', 'Capital restant dû', 'Échéance', 'Montant débloqué'];
    static readonly amortizationTableHeader5Insurances = ['Numéro d\'échance', 'Amortissement', 'Intérêts', '', '', '', '', '', 'Capital restant dû', 'Échéance', 'Montant débloqué'];
    static readonly amortizationTableHeader6Insurances = ['Numéro d\'échance', 'Amortissement', 'Intérêts', '', '', '', '', '', '', 'Capital restant dû', 'Échéance', 'Montant débloqué'];

    static readonly summaryTableHeader = ['Numéro du prêt', 'Type', 'Montant', 'Durée', 'Taux', 'Total intérêts', 'Type de différé', 'Durée du différé', 'Caution', 'Montant de la caution', 'Total assurance(s)'];
    static readonly summaryInsuranceTableHeader = ['Numéro du prêt', 'Type de prêt', 'Type d\'assurance', 'Taux', 'Quotité', 'Obligatoire ?', 'Risques couverts', 'Emprunteur', 'Assureur'];


    // For recap of the funding plan
    static readonly totalCostStr = 'Le coût total du plan de financement est de:';
    static readonly totalInterestsStr = 'Le coût total des intérêts est de:';
    static readonly totalInsurancesStr = 'Le coût total des assurances est de:';
    static readonly totalGuarantiesStr = 'Le coût total des garanties est de:';
    static readonly totalCapitalizedInterestsStr = 'Le coût total des intérêts capitalisées est de:';
    static readonly totalInterestsCounterStr = 'Le coût total des intérêts non-encore capitalisés est de:';
    static readonly fileManagementFeesStr = 'Les frais de dossier sont estimés à:';
    static readonly brokerFeesStr = 'Les frais de courtage sont estimés à:';
    static readonly otherExpensesStr = 'Des dépenses ou frais annexes sont estimés à:';
    static readonly notaryFeesStr = 'Les frais de notaire sont estimés à:';
    static readonly maximalInstalementStr = 'La mensualité maximale est de:';
    static readonly planLengthStr = 'La durée de remboursement est de:';
    static readonly debtRatioStr = 'L\'endettement est de:';
    static readonly jumpChargeStr = 'Le saut de charge est de:';
    static readonly personalFundingPercentageStr = 'L\'apport est de ';
    static readonly personalFundingAbsoluteStr = ' rapporté au total du projet, soit:';
    static readonly remainingForLivingStr = 'Le reste à vivre est de:';

    // For budget balancing table recap
    static readonly balancingMaximalPriceStr = 'Prix maximal envisageable';
    static readonly balancingLandPriceStr = 'Prix du terrain';
    static readonly balancingConstructionPriceStr = 'Prix de la construction';
    static readonly balancingInfrastructurePriceStr = 'Prix de la viabilisation';
    static readonly balancingInsurancePriceStr = 'Assurance dommage-ouvrage';
    static readonly balancingWorkPriceStr = 'Prix des travaux';
    static readonly balancingBalancingAdjustmentPriceStr = 'Montant total de la soulte';
    static readonly balancingFurnituresPriceStr = 'Prix du mobilier';
    static readonly balancingPriceStr = 'Prix du bien';
    static readonly balancingVatStr = 'TVA';
    static readonly balancingOtherTaxesStr = 'Autre taxes';
    static readonly balancingOtherExpensesStr = 'Dépense ou frais annexes';
    static readonly balancingBrokerFeesStr = 'Frais de courtage';
    static readonly balancingFileManagementFeesStr = 'Frais de dossier';
    static readonly balancingNotaryFeesStr = 'Frais de notaire';
    static readonly balancingAgencyFeesStr = 'Frais d\'agence';
    static readonly balancingGuarantiesStr = 'Frais de garanties';
    static readonly balancingPersonalFundingStr = 'Apport personnel';
    static readonly balancingMaximalBorrowableStr = 'Montant maximal empruntable';
    static readonly balancingBorrowedAmountStr = 'Montant financé';
    static readonly totalCapitalToBuy = 'Capital racheté';
    static readonly iraValue = 'Montant des IRA';

    // For DebtConsolidation
    static readonly gainStr = 'Gain';
    static readonly deficitStr = 'Déficit';
    static readonly remainingInterestsStr = 'Intérêts restants sur le prêt racheté';
    static readonly remainingInsuranceStr = 'Assurance(s) restante(s) sur le prêt racheté';
    static readonly interestsNewPlanStr = 'Intérets du nouveau plan';
    static readonly insuranceNewPlanStr = 'Assurance(s) du nouveau plan';
    static readonly iraStr = 'Indemnités de remboursement anticipées';
    static readonly newGuarantyStr = 'Nouvelle garantie';

    // For Pinel
    static readonly pinelDurationStr = 'Durée du dispositif:';
    static readonly monthlyRentValueStr = 'Loyer mensuel:';
    static readonly monthlyRentEvolutionStr = 'Évolution annuelle du loyer:';
    static readonly priceEvolutionStr = 'Évolution annuelle du prix:';
    static readonly rentChargesStr = 'Charges locatives (en % du loyer):';
    static readonly taxRegimeStr = 'Régime d\'imposition:';
    static readonly zoneStr = 'Zone:';
    static readonly rentThresholdStr = 'Limite de loyer:';

    static getBurdens(loans: Loan[]): any[] {

        return loans.filter( l => l.type === Loan.TypeEnum.SmoothableCharge.toString())
                    .map( burden => {
                        let startMonth = 0;
                        let endMonth = 0;
                        let burdenValue = 0;
                        burden.amortizations.forEach(
                            (value, index) => {
                            if (startMonth === 0 && value !== 0) {
                                startMonth = index + 1;
                                burdenValue = value;
                            }
                            if (value !== 0) {
                                endMonth = index + 1;
                            }
                            }
                        );
                        return { startMonth, endMonth, burdenValue };
                    });
    }

    static isEligiblePtz(loans: Loan[]): boolean {
        return loans.filter( l => l.type === Loan.TypeEnum.PtzLoan.toString()).length !== 0;
    }
    static hasPtz(loans: AvailableLoan[]): boolean {
        return loans.filter( l => l.type === Loan.TypeEnum.PtzLoan.toString()).length !== 0;
    }

    static isEligibleBossLoan(loans: Loan[]): boolean {
        return loans.filter( l => l.type === Loan.TypeEnum.BossLoan.toString()).length !== 0;
    }
    static hasBossLoan(loans: AvailableLoan[]): boolean {
        return loans.filter( l => l.type === Loan.TypeEnum.BossLoan.toString()).length !== 0;
    }

    // static generateAmortizationTable(loan: Loan) {
    //     const insurances: number[] = loan.insurances.length > 0 ? loan.insurances[0].monthly_values : null;
    //     return loan.amortizations.map((am, i) => ({
    //         echeanceNumber: i + 1,
    //         amortissement: LocaleUtils.toLocale(am),
    //         interets: LocaleUtils.toLocale(loan.interests[i]),
    //         assurance: LocaleUtils.toLocale(insurances ? insurances[i] : 0),
    //         capitalRestantDu: LocaleUtils.toLocale(loan.remaining_capital[i]),
    //         echeance: LocaleUtils.toLocale(am + loan.interests[i] + (insurances ? insurances[i] : 0)),
    //         montant: LocaleUtils.toLocale(loan.released_amounts[i])
    //     }));
    // }
    static generateAmortizationTable(loans: Loan[]) {
        return loans.filter( l => l.type !== Loan.TypeEnum.SmoothableCharge.toString())
                    .map( loan => {
                        if (loan.insurances.length <= 1) {
                            const insurances: number[] = loan.insurances.length > 0 ? loan.insurances[0].monthly_values : null;
                            return loan.amortizations.map((am, i) => ({
                                echeanceNumber: i + 1,
                                amortissement: LocaleUtils.toLocale(am),
                                interets: LocaleUtils.toLocale(loan.interests[i] + loan.preamortizations[i]),
                                assurance: LocaleUtils.toLocale(insurances ? insurances[i] : 0),
                                capitalRestantDu: LocaleUtils.toLocale(loan.remaining_capital[i]),
                                echeance: LocaleUtils.toLocale(am + loan.interests[i] + (insurances ? insurances[i] : 0)),
                                montant: LocaleUtils.toLocale(loan.released_amounts[i])
                            }));
                        }
                        if (loan.insurances.length === 2) {
                            const insurance1: number[] = loan.insurances[0].monthly_values;
                            const insurance2: number[] = loan.insurances[1].monthly_values;
                            return loan.amortizations.map((am, i) => ({
                                echeanceNumber: i + 1,
                                amortissement: LocaleUtils.toLocale(am),
                                interets: LocaleUtils.toLocale(loan.interests[i] + loan.preamortizations[i]),
                                assurance1: LocaleUtils.toLocale(insurance1[i]),
                                assurance2: LocaleUtils.toLocale(insurance2[i]),
                                capitalRestantDu: LocaleUtils.toLocale(loan.remaining_capital[i]),
                                echeance: LocaleUtils.toLocale(am + loan.interests[i] + (insurance1[i] + insurance2[i])),
                                montant: LocaleUtils.toLocale(loan.released_amounts[i])
                            }));
                        }
                        if (loan.insurances.length === 3) {
                            const insurance1: number[] = loan.insurances[0].monthly_values;
                            const insurance2: number[] = loan.insurances[1].monthly_values;
                            const insurance3: number[] = loan.insurances[2].monthly_values;
                            return loan.amortizations.map((am, i) => ({
                                echeanceNumber: i + 1,
                                amortissement: LocaleUtils.toLocale(am),
                                interets: LocaleUtils.toLocale(loan.interests[i] + loan.preamortizations[i]),
                                assurance1: LocaleUtils.toLocale(insurance1[i]),
                                assurance2: LocaleUtils.toLocale(insurance2[i]),
                                assurance3: LocaleUtils.toLocale(insurance3[i]),
                                capitalRestantDu: LocaleUtils.toLocale(loan.remaining_capital[i]),
                                echeance: LocaleUtils.toLocale(am + loan.interests[i] + (insurance1[i] + insurance2[i] + insurance3[i])),
                                montant: LocaleUtils.toLocale(loan.released_amounts[i])
                            }));
                        }
                        if (loan.insurances.length === 4) {
                            const insurance1: number[] = loan.insurances[0].monthly_values;
                            const insurance2: number[] = loan.insurances[1].monthly_values;
                            const insurance3: number[] = loan.insurances[2].monthly_values;
                            const insurance4: number[] = loan.insurances[3].monthly_values;
                            return loan.amortizations.map((am, i) => ({
                                echeanceNumber: i + 1,
                                amortissement: LocaleUtils.toLocale(am),
                                interets: LocaleUtils.toLocale(loan.interests[i] + loan.preamortizations[i]),
                                assurance1: LocaleUtils.toLocale(insurance1[i]),
                                assurance2: LocaleUtils.toLocale(insurance2[i]),
                                assurance3: LocaleUtils.toLocale(insurance3[i]),
                                assurance4: LocaleUtils.toLocale(insurance4[i]),
                                capitalRestantDu: LocaleUtils.toLocale(loan.remaining_capital[i]),
                                echeance: LocaleUtils.toLocale(am + loan.interests[i] + (insurance1[i] + insurance2[i] + insurance3[i] + insurance4[i])),
                                montant: LocaleUtils.toLocale(loan.released_amounts[i])
                            }));
                        }
                        if (loan.insurances.length === 5) {
                            const insurance1: number[] = loan.insurances[0].monthly_values;
                            const insurance2: number[] = loan.insurances[1].monthly_values;
                            const insurance3: number[] = loan.insurances[2].monthly_values;
                            const insurance4: number[] = loan.insurances[3].monthly_values;
                            const insurance5: number[] = loan.insurances[4].monthly_values;
                            return loan.amortizations.map((am, i) => ({
                                echeanceNumber: i + 1,
                                amortissement: LocaleUtils.toLocale(am),
                                interets: LocaleUtils.toLocale(loan.interests[i] + loan.preamortizations[i]),
                                assurance1: LocaleUtils.toLocale(insurance1[i]),
                                assurance2: LocaleUtils.toLocale(insurance2[i]),
                                assurance3: LocaleUtils.toLocale(insurance3[i]),
                                assurance4: LocaleUtils.toLocale(insurance4[i]),
                                assurance5: LocaleUtils.toLocale(insurance5[i]),
                                capitalRestantDu: LocaleUtils.toLocale(loan.remaining_capital[i]),
                                echeance: LocaleUtils.toLocale(am + loan.interests[i] + (insurance1[i] + insurance2[i] + insurance3[i] + insurance4[i] + insurance5[i])),
                                montant: LocaleUtils.toLocale(loan.released_amounts[i])
                            }));
                        }
                        if (loan.insurances.length === 6) {
                            const insurance1: number[] = loan.insurances[0].monthly_values;
                            const insurance2: number[] = loan.insurances[1].monthly_values;
                            const insurance3: number[] = loan.insurances[2].monthly_values;
                            const insurance4: number[] = loan.insurances[3].monthly_values;
                            const insurance5: number[] = loan.insurances[4].monthly_values;
                            const insurance6: number[] = loan.insurances[5].monthly_values;
                            return loan.amortizations.map((am, i) => ({
                                echeanceNumber: i + 1,
                                amortissement: LocaleUtils.toLocale(am),
                                interets: LocaleUtils.toLocale(loan.interests[i] + loan.preamortizations[i]),
                                assurance1: LocaleUtils.toLocale(insurance1[i]),
                                assurance2: LocaleUtils.toLocale(insurance2[i]),
                                assurance3: LocaleUtils.toLocale(insurance3[i]),
                                assurance4: LocaleUtils.toLocale(insurance4[i]),
                                assurance5: LocaleUtils.toLocale(insurance5[i]),
                                assurance6: LocaleUtils.toLocale(insurance6[i]),
                                capitalRestantDu: LocaleUtils.toLocale(loan.remaining_capital[i]),
                                echeance: LocaleUtils.toLocale(am + loan.interests[i] + (insurance1[i] + insurance2[i] + insurance3[i] + insurance4[i] + insurance5[i] + insurance6[i])),
                                montant: LocaleUtils.toLocale(loan.released_amounts[i])
                            }));
                        }
                    });
    }


    static generateLoanRecap(loans: Array<Loan>) {
        const loansRecap = [];
        let totalInterests = 0.0;
        let totalGuaranty = 0.0;
        let totalInsurance = 0.0;
        let totalAmount = 0.0;
        let humanLoanId = 0;
        loans.forEach((loan, loanId) => {
            if (loan.type !== Loan.TypeEnum.SmoothableCharge.toString()) {
                const insurance = loan.insurances.length > 0 ? loan.insurances[0].insurance : null;
                humanLoanId = humanLoanId + 1;
                const loanType =    LoanTypeMap.toString(loan.type);
                const loanAmount = LocaleUtils.toLocale(loan.amount, 'EUR');
                totalAmount += loan.amount;
                const loanDuration = loan.duration_months;
                const loanRate = LocaleUtils.toLocale(loan.yearly_rate);
                const localTotalInterests = LocaleUtils.toLocale(loan.interests_cost, 'EUR');
                totalInterests += loan.interests_cost;
                const gracePeriodType = loan.grace_period ? GracePeriodTypeMap.toString(loan.grace_period.type) : 'Aucun';
                const gracePeriodLength = loan.grace_period ? loan.grace_period.length : 0;
                const guarantyType = loan.guaranty ? GuarantyTypeMap.toString(loan.guaranty.type) : 'Aucune';
                const guarantyCost = LocaleUtils.toLocale(loan.guaranty ? loan.guaranty.guaranty_commission + loan.guaranty.mutualized_guaranty_contribution : 0, 'EUR');
                totalGuaranty += loan.guaranty ? loan.guaranty.guaranty_commission + loan.guaranty.mutualized_guaranty_contribution : 0;
                // const insuranceType = insurance ? InsuranceTypeMap.toString(insurance.type) : 'Aucune';
                // const insuranceRate = insurance ? LocaleUtils.toLocale(insurance.rate) : LocaleUtils.toLocale(0);
                const localTotalInsurance = LocaleUtils.toLocale(loan.insurance_cost, 'EUR');
                totalInsurance += loan.insurance_cost;
                loansRecap.push([humanLoanId, loanType, loanAmount, loanDuration, loanRate + '%', localTotalInterests, gracePeriodType, gracePeriodLength, guarantyType, guarantyCost, localTotalInsurance]);
            }
        });
        loansRecap.push([
            'TOTAL', '', LocaleUtils.toLocale(totalAmount, 'EUR'), '', '',
            LocaleUtils.toLocale(totalInterests, 'EUR'), '', '', '',
            LocaleUtils.toLocale(totalGuaranty, 'EUR'),
            LocaleUtils.toLocale(totalInsurance, 'EUR')
        ]);
        return {loansRecap, totalInterests, totalGuaranty, totalInsurance};
    }

    static generateInsurancesRecap(loans: Array<Loan>) {
        const insurancesRecap = [];
        loans.forEach((loan, loanId) => {
            if (loan.type !== Loan.TypeEnum.SmoothableCharge.toString()) {
                if (loan.insurances) {
                    const loanInsurances = loan.insurances;
                    loanInsurances.forEach((computedInsurance, insuranceId) => {
                        if (computedInsurance.insurance) {
                            const aLoanId = loanId+1;
                            const loanType = LoanTypeMap.toString(loan.type);
                            const type = InsuranceTypeMap.toString(computedInsurance.insurance.type);
                            const rate = computedInsurance.insurance.rate;
                            const company = computedInsurance.insurance.company ? computedInsurance.insurance.company : '';
                            const person = computedInsurance.insurance.person ? computedInsurance.insurance.person : '';
                            const quota = computedInsurance.insurance.quota;
                            const mandatory = computedInsurance.insurance.mandatory ? 'Oui' : 'Non';
                            const risks = computedInsurance.insurance.risks_covered ? computedInsurance.insurance.risks_covered.join(', ') : '';
                            const comment = ''; // computedInsurance.insurance.comment;
                            insurancesRecap.push([aLoanId, loanType, type, rate, quota, mandatory, risks, person, company]);
                        }
                    });
                }
            }
        });
        return insurancesRecap;
    }


    static generateInsurancesRecapForLoansToConsolidate(loans: Array<LoanToConsolidate>) {
        const insurancesRecap = [];
        if (loans) {
            loans.forEach((loan, loanId) => {
                if (loan.insurances) {
                    const loanInsurances = loan.insurances;
                    loanInsurances.forEach((insurance, insuranceId) => {
                        if (insurance) {
                            const aLoanId = loanId+1;
                            const loanType = 'Prêt racheté';
                            const type = InsuranceTypeMap.toString(insurance.type);
                            const rate = insurance.rate;
                            const company = insurance.company ? insurance.company : '';
                            const person = insurance.person ? insurance.person : '';
                            const quota = insurance.quota;
                            const mandatory = insurance.mandatory ? 'Oui' : 'Non';
                            const risks = insurance.risks_covered ? insurance.risks_covered.join(', ') : '';
                            const comment = ''; // computedInsurance.insurance.comment;
                            insurancesRecap.push([aLoanId, loanType, type, rate, quota, mandatory, risks, person, company]);
                        }
                    });
                }
            });
        }
        return insurancesRecap;
    }


    static loanTypeEnumToHuman(loan) {
        switch (loan.type) {
            case 'FREE_LOAN':
                return 'Prêt libre';
            case 'PTZ_LOAN':
                return 'PTZ';
            case 'SMOOTHABLE_CHARGE':
                return 'Charge';
            case 'BRIDGE_LOAN':
                return 'Prêt relais';
        }
    }

    static generateBudgetSummary(params: BudgetParameters, results: BudgetResults) {
        const interestsCost = results.funding_plan.summary.total_interests ?? 0;
        const insurancesCost = results.funding_plan.summary.total_insurances ?? 0;
        const guarantiesCost = results.funding_plan.summary.total_guaranty ?? 0;
        const preamortizationsCost = results.funding_plan.summary.total_preamortizations ?? 0;
        const capitalizedInterests = results.funding_plan.summary.total_capitalized_interests ?? 0;
        const brokerFees = params.funding_fees?.broker_fees ?? 0;
        const fileManagementFees = params.funding_fees?.file_management_fees ?? 0;
        const notaryFees = results.budgets.notary_fees ?? 0;
        const otherExpenses = results.budgets.other_expenses ?? 0;

        const totalCost = guarantiesCost + insurancesCost + interestsCost + preamortizationsCost + capitalizedInterests + brokerFees + fileManagementFees;

        const jumpCharge = results.funding_plan.summary.jump_charge;
        const normalDebtRatio = results.funding_plan.summary.total_revenues ? LocaleUtils.roundFloat((results.funding_plan.summary.effective_maximal_monthly_payment + results.funding_plan.summary.max_total_charges) / results.funding_plan.summary.total_revenues * 100) : '-';

        const total_budget = results.budgets.total_budget;
        const personalFunding = results.funding_plan.summary.total_personal_funding;
        const personalFundingRatio = personalFunding / total_budget * 100;
        const personalFundingRatioRounded = LocaleUtils.roundFloat(personalFundingRatio);
        const remainingForLiving = results.funding_plan.summary.min_remaining_for_living;


        return {total_cost: totalCost, interests_cost: interestsCost, insurances_cost: insurancesCost, guaranties_cost: guarantiesCost, notary_fees: notaryFees,
                file_management_fees: fileManagementFees, broker_fees: brokerFees, preamortization_cost: preamortizationsCost, capitalized_interests: capitalizedInterests, other_expenses: otherExpenses,
                effective_maximal_monthly_payment: results.funding_plan.summary.effective_maximal_monthly_payment, plan_length: results.funding_plan.summary.duration_months,
                 personal_funding: personalFunding, personal_funding_ratio: personalFundingRatioRounded, normal_debt_ratio: normalDebtRatio,
                 jump_charge: jumpCharge, remaining_for_living: remainingForLiving}
      }


      static generateFundingSummary(params: BudgetParameters|FundingParameters|PinelParameters|DebtConsolidationParameters, results: FundingResults) {
        let fees: any;
        let otherExpenses = 0;

        let totalLoanAmount = 0.0;
        if (results.loans) {
            results.loans.forEach((loan, loanId) => {
                if (loan.type !== Loan.TypeEnum.SmoothableCharge.toString()) {
                    totalLoanAmount += loan.amount;
                }
            });
        }

        if(params.project) {
            switch(params.project.type) {
                case 'BUDGET':
                    // fees = params.project?.expenses?.fees as BudgetExpensesFees;
                    otherExpenses = params.project?.expenses?.other_expenses ?? 0;
                break;
                case 'HOUSE_CONSTRUCTION':
                    fees = params.project?.expenses?.fees as HouseConstructionExpensesFees;
                    otherExpenses = params.project?.expenses?.other_expenses ?? 0;
                break;
                case 'LAND':
                    fees = params.project?.expenses?.fees as HouseConstructionExpensesFees;
                    otherExpenses = params.project?.expenses?.other_expenses ?? 0;
                break;
                case 'OLD_PROPERTY':
                    fees = params.project?.expenses?.fees as HouseConstructionExpensesFees;
                    otherExpenses = params.project?.expenses?.other_expenses ?? 0;
                break;
                case 'NEW_PROPERTY':
                    fees = params.project?.expenses?.fees as HouseConstructionExpensesFees;
                    otherExpenses = params.project?.expenses?.other_expenses ?? 0;
                break;
                case 'WORKS':
                    // fees = params.project?.expenses?.fees as BudgetExpensesFees;
                    otherExpenses = params.project?.expenses?.other_expenses ?? 0;
                break;
                case 'PINEL':
                    fees = params.project?.property?.expenses?.fees as HouseConstructionExpensesFees;
                    otherExpenses = params.project?.property?.expenses?.other_expenses ?? 0;
                break;
                case 'DEBT_CONSOLIDATION':
                    // fees = params.project?.expenses?.fees as BudgetExpensesFees;
                    otherExpenses = params.project?.expenses?.other_expenses ?? 0;
                break;
            }
        }
        const interestsCost = results.summary.total_interests ?? 0;
        const insurancesCost = results.summary.total_insurances ?? 0;
        const guarantiesCost = results.summary.total_guaranty ?? 0;
        const preamortizationsCost = results.summary.total_preamortizations ?? 0;
        const capitalizedInterests = results.summary.total_capitalized_interests ?? 0;

        const brokerFees = params.funding_fees?.broker_fees ?? 0;
        const fileManagementFees = params.funding_fees?.file_management_fees ?? 0;
        const notaryFees = fees?.notary_fees ?? 0;

        const totalCost = guarantiesCost + insurancesCost + interestsCost + preamortizationsCost + capitalizedInterests + brokerFees + fileManagementFees;


        const jumpCharge = results.summary.jump_charge;
        const normalDebtRatio = results.summary.final_debt_ratio ? results.summary.final_debt_ratio :  '-';

        const personalFunding = results.summary.total_personal_funding;
        const totalProject = totalLoanAmount + personalFunding;
        const personalFundingRatio = personalFunding / totalProject * 100;
        const personalFundingRatioRounded = LocaleUtils.roundFloat(personalFundingRatio);
        const remainingForLiving = results.summary.min_remaining_for_living;


        return {total_cost: totalCost, interests_cost: interestsCost, insurances_cost: insurancesCost, guaranties_cost: guarantiesCost, notary_fees: notaryFees,
                file_management_fees: fileManagementFees, broker_fees: brokerFees, preamortization_cost: preamortizationsCost, capitalized_interests: capitalizedInterests, other_expenses: otherExpenses,
                effective_maximal_monthly_payment: results.summary.effective_maximal_monthly_payment, plan_length: results.summary.duration_months,
                 personal_funding: personalFunding, personal_funding_ratio: personalFundingRatioRounded, normal_debt_ratio: normalDebtRatio,
                 jump_charge: jumpCharge, remaining_for_living: remainingForLiving}
      }


    static formatRisks(loan, insuranceIndex) {
        if (loan && loan.insurances && loan.insurances.length > insuranceIndex && loan.insurances[insuranceIndex].insurance && loan.insurances[insuranceIndex].insurance.risks_covered) {
        return loan.insurances[insuranceIndex].insurance.risks_covered.join(', ')
        }
        return null;
    }


    static formatInsuranceInfo(loan, insuranceIndex) {
        if (loan.type !== 'SMOOTHABLE_CHARGE') {
            const risksStrFormatted = this.formatRisks(loan, insuranceIndex);
            const personStrFormatted = loan.insurances[insuranceIndex].insurance.person;

            if (personStrFormatted && risksStrFormatted) {
            return [personStrFormatted, risksStrFormatted].join(', ');
            }
            if(personStrFormatted) {
            return personStrFormatted;
            }
            if(risksStrFormatted) {
            return risksStrFormatted;
            }
        }
        return '';
    }


    static formatAmortizationTablesHeaders(loans, amortizationTableData: any, amortizationTableHeaders: any, displayedColumns: any) {
        // Loop on the loans to determine the headers to use (depending on the number of insurances),
        // Decision is based on the structure of the first instalement
        amortizationTableData.forEach( (loan, index) => {
            // 1 insurance
            if (Object.keys(loan[0]).length === 7) {
            amortizationTableHeaders.push(LoanUtils.amortizationTableHeader);
            displayedColumns.push(['echeanceNumber', 'amortissement', 'interets', 'assurance', 'capitalRestantDu', 'echeance', 'montant']);
            }
            // 2 insurances
            else if (Object.keys(loan[0]).length === 8) {
            amortizationTableHeaders.push(LoanUtils.amortizationTableHeader2Insurances);
            amortizationTableHeaders[amortizationTableHeaders.length-1][3] = (LoanUtils.formatInsuranceInfo(loans[index], 0) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 0) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][4] = (LoanUtils.formatInsuranceInfo(loans[index], 1) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 1) + ')' : 'Assu.';
            displayedColumns.push(['echeanceNumber', 'amortissement', 'interets', 'assurance1', 'assurance2', 'capitalRestantDu', 'echeance', 'montant']);
            }
            // 3 insurances
            else if (Object.keys(loan[0]).length === 9) {
            amortizationTableHeaders.push(LoanUtils.amortizationTableHeader3Insurances);
            amortizationTableHeaders[amortizationTableHeaders.length-1][3] = (LoanUtils.formatInsuranceInfo(loans[index], 0) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 0) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][4] = (LoanUtils.formatInsuranceInfo(loans[index], 1) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 1) + ')' : 'Assu.Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][5] = (LoanUtils.formatInsuranceInfo(loans[index], 2) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 2) + ')' : '';
            displayedColumns.push(['echeanceNumber', 'amortissement', 'interets', 'assurance1', 'assurance2', 'assurance3', 'capitalRestantDu', 'echeance', 'montant']);
            }
            // 4 insurances
            else if (Object.keys(loan[0]).length === 10) {
            amortizationTableHeaders.push(LoanUtils.amortizationTableHeader4Insurances);
            amortizationTableHeaders[amortizationTableHeaders.length-1][3] = (LoanUtils.formatInsuranceInfo(loans[index], 0) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 0) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][4] = (LoanUtils.formatInsuranceInfo(loans[index], 1) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 1) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][5] = (LoanUtils.formatInsuranceInfo(loans[index], 2) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 2) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][6] = (LoanUtils.formatInsuranceInfo(loans[index], 3) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 3) + ')' : 'Assu.';
            displayedColumns.push(['echeanceNumber', 'amortissement', 'interets', 'assurance1', 'assurance2', 'assurance3', 'assurance4', 'capitalRestantDu', 'echeance', 'montant']);
            }
            // 5 insurances
            else if (Object.keys(loan[0]).length === 11) {
            amortizationTableHeaders.push(LoanUtils.amortizationTableHeader5Insurances);
            amortizationTableHeaders[amortizationTableHeaders.length-1][3] = (LoanUtils.formatInsuranceInfo(loans[index], 0) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 0) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][4] = (LoanUtils.formatInsuranceInfo(loans[index], 1) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 1) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][5] = (LoanUtils.formatInsuranceInfo(loans[index], 2) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 2) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][6] = (LoanUtils.formatInsuranceInfo(loans[index], 3) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 3) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][7] = (LoanUtils.formatInsuranceInfo(loans[index], 4) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 4) + ')' : 'Assu.';
            displayedColumns.push(['echeanceNumber', 'amortissement', 'interets', 'assurance1', 'assurance2', 'assurance3', 'assurance4', 'assurance5', 'capitalRestantDu', 'echeance', 'montant']);
            }
            // 6 insurances
            else if (Object.keys(loan[0]).length === 12) {
            amortizationTableHeaders.push(LoanUtils.amortizationTableHeader5Insurances);
            amortizationTableHeaders[amortizationTableHeaders.length-1][3] = (LoanUtils.formatInsuranceInfo(loans[index], 0) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 0) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][4] = (LoanUtils.formatInsuranceInfo(loans[index], 1) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 1) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][5] = (LoanUtils.formatInsuranceInfo(loans[index], 2) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 2) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][6] = (LoanUtils.formatInsuranceInfo(loans[index], 3) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 3) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][7] = (LoanUtils.formatInsuranceInfo(loans[index], 4) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 4) + ')' : 'Assu.';
            amortizationTableHeaders[amortizationTableHeaders.length-1][8] = (LoanUtils.formatInsuranceInfo(loans[index], 5) !== '') ? 'Assu. (' + LoanUtils.formatInsuranceInfo(loans[index], 5) + ')' : 'Assu.';
            displayedColumns.push(['echeanceNumber', 'amortissement', 'interets', 'assurance1', 'assurance2', 'assurance3', 'assurance4', 'assurance5', 'assurance6', 'capitalRestantDu', 'echeance', 'montant']);
            }
        });
    }



  static chargeConvertor(charge, chargesIntoLoan, longestLoan) {
    if (charge.smoothable !== true) {
      const monthlyAmount = charge.monthly_amount;
      if (monthlyAmount && charge.continue_after_project === true) {
        const weight = monthlyAmount.weight ?? 100;
        const figure = monthlyAmount.figure ?? 0;
        const startMonth = charge.start_month ? charge.start_month : 0;
        const endMonth = charge.end_month ? charge.end_month : longestLoan-1;
        const values: Array<number> = [];
        for (let month = 0; month < startMonth; month++){
          values[month] = 0;
        }
        for (let month = startMonth; month <= endMonth; month++){
          values[month] = (weight / 100) * figure;
        }
        const aCharge: Loan = {type: Loan.TypeEnum.SmoothableCharge, loan_name: ChargeTypeMapShort.toString(charge.type), yearly_rate: 0, amount: 0, duration_months: values.length, amortizations: values, interests: [], insurances: [], preamortizations: [], released_amounts: [], remaining_capital: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0, capitalized_interests_cost: 0};
        chargesIntoLoan.push(aCharge);
      }
    }
  }

  // const dateNow = new Date()
  static loanConvertor(loan, chargesIntoLoan, iDateNow, longestLoan) {
    if (loan?.smoothable !== true) {
      const dateNow = iDateNow;
      const endDateRaw = loan?.end_date ?? '2100-10-06T14:00:00.000Z';
      const endDate = new Date(endDateRaw);
      const endInMonths = Math.min(longestLoan-1, LocaleUtils.monthDiff(dateNow, endDate));
      const monthlyPayment = loan.monthly_payment;
      if (monthlyPayment) {
        const weight = monthlyPayment.weight ?? 100;
        const figure = monthlyPayment.figure ?? 0;
        const values: Array<number> = [];
        for (let month = 0; month <= endInMonths; month++){
          values[month] = (weight / 100) * figure;
        }
        const aCharge: Loan = {type: Loan.TypeEnum.SmoothableCharge, loan_name: LoansTypeShort.toString(loan.type) ,yearly_rate: 0, amount: 0, duration_months: values.length, amortizations: values, interests: [], insurances: [], preamortizations: [], released_amounts: [], remaining_capital: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0, capitalized_interests_cost: 0};
        chargesIntoLoan.push(aCharge);
      }
    }
  }

  static fromNonSmoothablePersistingChargeToLoan(iDateNow, iActor: LightLegalPerson|LightHouseholdDetails, iResults: FundingResults) {
    const chargesIntoLoan = [];

    const longestLoan = LocaleUtils.getMaxLoanDuration(iResults.loans);

    // Persons charges and persisting loans
    iActor?.persons?.forEach(person => {
      // Person Charges
      if(person.is_borrower === true) {
        const charges = person.finance?.charges;
        charges?.forEach(charge => {
          this.chargeConvertor(charge, chargesIntoLoan, longestLoan);
        });

        // Person Loans
        const loans = person.finance?.current_loans;
        const persistingLoans = loans?.filter( l => l.future === CurrentLoan.FutureEnum.ContinueAfterProject );
        persistingLoans?.forEach(persistingLoan => {
          this.loanConvertor(persistingLoan, chargesIntoLoan, iDateNow, longestLoan);
        });
      }
    });

    // Actor Charges
    const actorCharges = iActor?.finance?.charges;
    actorCharges?.forEach(charge => {
      if (charge.smoothable === false) {
        this.chargeConvertor(charge, chargesIntoLoan, longestLoan);
      }
    });

    // Actor Loans
    const actorLoans = iActor?.finance?.current_loans;
    const actorPersistingLoans = actorLoans?.filter( l => l.future === CurrentLoan.FutureEnum.ContinueAfterProject );
    actorPersistingLoans?.forEach(persistingLoan => {
      if (persistingLoan.smoothable === false) {
        this.loanConvertor(persistingLoan, chargesIntoLoan, iDateNow, longestLoan);
      }
    });

    // console.log(chargesIntoLoan);
    return chargesIntoLoan;

  }



}

//     static readonly summaryTableHeader = ['Numéro du prêt', 'Type', 'Montant', 'Durée', 'Taux', 'Total intérêts', 'Type de différé', 'Durée du différé', 'Caution', 'Montant de la caution', 'Type d\'assurance', 'Taux d\'assurance', 'Total assurance'];
//     static readonly pinelTableHeader = ['Année', 'Évolution du prix', 'Évolution du loyer', 'Loyer perçus', 'Intérêt d\'emprunt', 'Charges locatives', 'Résultat locatif', 'Impôts sur le résultat locatif', 'Impact Pinel sur l\'impot', 'Réduction d\'impot', 'Besoin de trésorerie'];
//     static readonly loansToConsolidateTableHeader = ['Numéro du prêt', 'Durée', 'Taux', 'Capital initial', 'Capital restant dû', 'Intérets restants', 'Assurance restante', 'Mensualité globale', 'Date de début', 'Type d\'assurance', 'Taux d\'assurance', 'Type d\'IRA', 'Montant des IRA'];

//     // Used for PDF generation
//     static readonly patrimonyTableHeader = ['Type', 'Valeur', 'Date d\'ouverture', 'Date d\'achat', 'Capital restant du', 'Commentaire'];
//     static readonly partnersTableHeader = ['Type', 'Nom', 'Adresse', 'Téléphone', 'Email', 'Numéro d\'agrément', 'Nom contact', 'Téléphone contact', 'Email contact'];



//     static getBridges(loans: Loan[]): any[] {
//         return loans.filter( l => l.type === 'BRIDGE')
//                     .map( bridge => ({ duration: bridge.duration_months, amount: bridge.amount }) );
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


//     static generateLoanRecap(loans: Array<Loan>) {
//         const loansRecap = [];
//         let totalInterests = 0.0;
//         let totalGuaranty = 0.0;
//         let totalInsurance = 0.0;
//         let totalAmount = 0.0;
//         let humanLoanId = 0;
//         loans.forEach((loan, loanId) => {
//             if (loan.type !== 'CHARGE') {
//                 const insurance = loan.insurances[0].insurance;
//                 humanLoanId = humanLoanId + 1;
//                 const loanType = Utils.loanTypeEnumToHuman(loan);
//                 const loanAmount = Utils.toLocale(loan.amount, 'EUR');
//                 totalAmount += loan.amount;
//                 const loanDuration = loan.duration_months;
//                 const loanRate = Utils.toLocale(loan.yearly_rate);
//                 const localTotalInterests = Utils.toLocale(loan.interests_cost, 'EUR');
//                 totalInterests += loan.interests_cost;
//                 const gracePeriodType = loan.grace_period ? GracePeriodType[loan.grace_period.type] : 'Aucun';
//                 const gracePeriodLength = loan.grace_period ? loan.grace_period.length : 0;
//                 const guarantyType = loan.guaranty ? GuarantyType[loan.guaranty.type] : 'Aucune';
//                 const guarantyCost = Utils.toLocale(loan.guaranty ? loan.guaranty.guaranty_commission + loan.guaranty.mutualized_guaranty_contribution : 0, 'EUR');
//                 totalGuaranty += loan.guaranty ? loan.guaranty.guaranty_commission + loan.guaranty.mutualized_guaranty_contribution : 0;
//                 const insuranceType = insurance ? InsuranceType[insurance.type] : 'Aucune';
//                 const insuranceRate = insurance ? Utils.toLocale(insurance.rate) : Utils.toLocale(0);
//                 const localTotalInsurance = Utils.toLocale(loan.insurance_cost, 'EUR');
//                 totalInsurance += loan.insurance_cost;
//                 loansRecap.push([humanLoanId, loanType, loanAmount, loanDuration, loanRate + '%', localTotalInterests, gracePeriodType, gracePeriodLength, guarantyType, guarantyCost, insuranceType, insuranceRate + '%', localTotalInsurance]);
//             }
//         });
//         loansRecap.push(['TOTAL', '', Utils.toLocale(totalAmount, 'EUR'), '', '', Utils.toLocale(totalInterests, 'EUR'), '', '', '', Utils.toLocale(totalGuaranty, 'EUR'), '', '', Utils.toLocale(totalInsurance, 'EUR')]);
//         return {loansRecap, totalInterests, totalGuaranty, totalInsurance};
//     }

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

//     static roundFloat(aFloat) {
//         return Math.round((aFloat + Number.EPSILON) * 100) / 100;
//     }


//     static buildPinelTable(pinelPlanTable) {
//       const pinelTable = [];

//       let sumRent = 0;
//       let sumLoanInterest = 0;
//       let sumRentalCharges = 0;
//       let sumRentalResult = 0;
//       let sumTaxesOnRentalIncome = 0;
//       let sumPinelImpactOnTax = 0;
//       let sumTaxReduction = 0;
//       let sumCashRequirement = 0;

//       for (let year = 1; year < pinelPlanTable[0].length; year++ ) {
//         sumRent += pinelPlanTable[2][year];
//         sumLoanInterest += pinelPlanTable[3][year];
//         sumRentalCharges += pinelPlanTable[4][year];
//         sumRentalResult += pinelPlanTable[5][year];
//         sumTaxesOnRentalIncome += pinelPlanTable[6][year];
//         sumPinelImpactOnTax += pinelPlanTable[7][year];
//         sumTaxReduction += pinelPlanTable[8][year];
//         sumCashRequirement += pinelPlanTable[9][year];

//         pinelTable.push([
//           year,
//           Utils.toLocale(pinelPlanTable[0][year]),
//           Utils.toLocale(pinelPlanTable[1][year]),
//           Utils.toLocale(pinelPlanTable[2][year]), // sum
//           Utils.toLocale(pinelPlanTable[3][year]), // sum
//           Utils.toLocale(pinelPlanTable[4][year]), // sum
//           Utils.toLocale(pinelPlanTable[5][year]), // sum
//           Utils.toLocale(pinelPlanTable[6][year]), // sum
//           Utils.toLocale(pinelPlanTable[7][year]), // sum
//           Utils.toLocale(pinelPlanTable[8][year]), // sum
//           Utils.toLocale(pinelPlanTable[9][year]) // sum
//         ]);
//       }
//       pinelTable.push([
//         'TOTAL',
//         '',
//         '',
//         Utils.toLocale(sumRent),
//         Utils.toLocale(sumLoanInterest),
//         Utils.toLocale(sumRentalCharges),
//         Utils.toLocale(sumRentalResult),
//         Utils.toLocale(sumTaxesOnRentalIncome),
//         Utils.toLocale(sumPinelImpactOnTax),
//         Utils.toLocale(sumTaxReduction),
//         Utils.toLocale(sumCashRequirement)
//       ]);

//       return pinelTable;

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


