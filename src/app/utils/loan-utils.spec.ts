import { TestBed } from '@angular/core/testing';
import { LoanUtils } from './loan-utils';

import { Loan } from '../_api/model/loan';
import { Case, ChargeItem, CurrentLoan, FinanceDetails, FundingResults } from '../_api';

describe('Utils', () => {

  it('Risks must be correctly formatted', () => {
    const aLoan: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 240, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: [
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true, risks_covered: [ 'ITT', 'IPP'] }, monthly_values: [] },
        { insurance: { type: 'REMAINING_CAPITAL', rate: 0.1, quota: 80, mandatory: false, risks_covered: ['IPT'] }, monthly_values: [] },
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true, risks_covered: ['DC'] }, monthly_values: [] }
    ]};

    expect(LoanUtils.formatRisks(aLoan, 0)).toBe('ITT, IPP');
    expect(LoanUtils.formatRisks(aLoan, 1)).toBe('IPT');
    expect(LoanUtils.formatRisks(aLoan, 2)).toBe('DC');

    const aLoanWithoutRisks: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 240, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: [
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true }, monthly_values: [] }
    ]};

    expect(LoanUtils.formatRisks(aLoanWithoutRisks, 0)).toBe(null);
  });


  it('Insurance info must be correctly formatted', () => {
    const aLoan: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 240, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: [
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true, risks_covered: [ 'ITT', 'IPP'] }, monthly_values: [] },
        { insurance: { type: 'REMAINING_CAPITAL', rate: 0.1, quota: 80, mandatory: false, risks_covered: ['IPT'] }, monthly_values: [] },
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true, risks_covered: ['DC'] }, monthly_values: [] }
    ]};

    expect(LoanUtils.formatInsuranceInfo(aLoan, 0)).toBe('ITT, IPP');
    expect(LoanUtils.formatInsuranceInfo(aLoan, 1)).toBe('IPT');
    expect(LoanUtils.formatInsuranceInfo(aLoan, 2)).toBe('DC');

    const aLoanWithoutRisks: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 240, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: [
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true }, monthly_values: [] }
    ]};

    expect(LoanUtils.formatInsuranceInfo(aLoanWithoutRisks, 0)).toBe('');


    const aLoanWithPerson: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 240, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: [
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, person: 'Jean Verlaine', mandatory: true, risks_covered: [ 'ITT', 'IPP'] }, monthly_values: [] },
        { insurance: { type: 'REMAINING_CAPITAL', rate: 0.1, quota: 80, person: 'Jean Verlaine', mandatory: false, risks_covered: ['IPT'] }, monthly_values: [] },
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, person: 'Louise Verlaine', mandatory: true, risks_covered: ['DC'] }, monthly_values: [] }
    ]};

    expect(LoanUtils.formatInsuranceInfo(aLoanWithPerson, 0)).toBe('Jean Verlaine, ITT, IPP');
    expect(LoanUtils.formatInsuranceInfo(aLoanWithPerson, 1)).toBe('Jean Verlaine, IPT');
    expect(LoanUtils.formatInsuranceInfo(aLoanWithPerson, 2)).toBe('Louise Verlaine, DC');

  });


  it('Amortization table header must be correctly formatted', () => {
    const aLoan1: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 240, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: [
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true, risks_covered: [ 'ITT', 'IPP'] }, monthly_values: [] },
        { insurance: { type: 'REMAINING_CAPITAL', rate: 0.1, quota: 80, mandatory: false, risks_covered: ['IPT'] }, monthly_values: [] },
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true, risks_covered: ['DC'] }, monthly_values: [] }
    ]};

    const aLoan2: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 240, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: [
        { insurance: { type: 'INITIAL_CAPITAL', rate: 0.2, quota: 100, mandatory: true, risks_covered: [ 'ITT', 'IPP'] }, monthly_values: [] }
    ]};

    // Only the number of elements in the first instalement is relevant for the algorithm
    const fakeAmortizationTableData = [[ { key1: '', key2: '', key3: '', key4: '', key5: '', key6: '', key7: '', key8: '', key9: '' }],
                                       [ { key1: '', key2: '', key3: '', key4: '', key5: '', key6: '', key7: '' } ] ];

    const amortizationTableHeaders = [];
    const displayedColumns = [];
    LoanUtils.formatAmortizationTablesHeaders([aLoan1, aLoan2], fakeAmortizationTableData, amortizationTableHeaders, displayedColumns)

    expect(amortizationTableHeaders).toEqual([ [ 'Numéro d\'échance', 'Amortissement', 'Intérêts', 'Assu. (ITT, IPP)', 'Assu. (IPT)', 'Assu. (DC)', 'Capital restant dû', 'Échéance', 'Montant débloqué' ], [ 'Numéro d\'échance', 'Amortissement', 'Intérêts', 'Assurance', 'Capital restant dû', 'Échéance', 'Montant débloqué' ] ]);
  });



  it('Charges and loans are computed', () => {

    const aLoan1: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 10, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: []};

    const aLoan2: Loan = {type: Loan.TypeEnum.FreeLoan, yearly_rate: 0.1, duration_months: 20, amount: 10000, amortizations: [], interests: [],
       released_amounts: [], remaining_capital: [], preamortizations: [], interests_cost: 0,  insurance_cost: 0, preamortization_cost:0, insurances: []};

    const aFundingResults: FundingResults = { status: 'OPTIMAL', summary: { }, loans: [aLoan1, aLoan2] };

    const aChargeItem1: ChargeItem = {type: ChargeItem.TypeEnum.Loa, continue_after_project: true, smoothable: false, monthly_amount: {figure: 200} };
    const aChargeItem2: ChargeItem = {type: ChargeItem.TypeEnum.Other, continue_after_project: true, smoothable: true, start_month: 10, end_month: 15, monthly_amount: {figure: 100, weight: 50} };
    const charges = [aChargeItem1, aChargeItem2];

    const aCurrentLoanItem1: CurrentLoan = {type: CurrentLoan.TypeEnum.Mortgage, smoothable: false, future: CurrentLoan.FutureEnum.ContinueAfterProject, monthly_payment: {figure: 100}, remaining_capital: 1000, start_date: '2017-10-06T14:00:00.000Z', end_date: '2022-10-06T14:00:00.000Z' };
    const aCurrentLoanItem2: CurrentLoan = {type: CurrentLoan.TypeEnum.Other, future: CurrentLoan.FutureEnum.ContinueAfterProject, smoothable: true, monthly_payment: {figure: 200, weight: 50}, remaining_capital: 2000, start_date: '2017-10-06T14:00:00.000Z', end_date: '2023-01-06T14:00:00.000Z' };
    const currentLoans = [aCurrentLoanItem1, aCurrentLoanItem2];

    const aFinanceDetails: FinanceDetails = { current_loans: currentLoans, charges };

    const aCaseHousehold: Case = { actor: {
        type: 'HOUSEHOLD',
        finance: aFinanceDetails,
        persons: [
          {
            is_borrower: true,
            finance: aFinanceDetails
          },
          {
            is_borrower: false,
            finance: aFinanceDetails
          }
        ]
      }
    };

    const expectedCharge1 = {type: 'SMOOTHABLE_CHARGE', loan_name: 'LOA', yearly_rate: 0, amount: 0, duration_months: 20, amortizations: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200], interests: [], insurances: [], preamortizations: [], released_amounts: [], remaining_capital: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0, capitalized_interests_cost: 0};

    const expectedCharge2 = {type: 'SMOOTHABLE_CHARGE', loan_name: 'CREDIT IMMO', yearly_rate: 0, amount: 0, duration_months: 16, amortizations: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100], interests: [], insurances: [], preamortizations: [], released_amounts: [], remaining_capital: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0, capitalized_interests_cost: 0};

    const expectedCharge3 = {type: 'SMOOTHABLE_CHARGE', loan_name: 'LOA', yearly_rate: 0, amount: 0, duration_months: 20, amortizations: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200], interests: [], insurances: [], preamortizations: [], released_amounts: [], remaining_capital: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0, capitalized_interests_cost: 0};

    const expectedCharge4 = {type: 'SMOOTHABLE_CHARGE', loan_name: 'CREDIT IMMO', yearly_rate: 0, amount: 0, duration_months: 16, amortizations: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100], interests: [], insurances: [], preamortizations: [], released_amounts: [], remaining_capital: [], interests_cost: 0, insurance_cost: 0, preamortization_cost: 0, capitalized_interests_cost: 0};

    const expectedResult = [expectedCharge1, expectedCharge2, expectedCharge3, expectedCharge4];
    // console.log(JSON.stringify(LoanUtils.fromNonSmoothablePersistingChargeToLoan(new Date('2021-07-25T11:00:00.000Z'), aCaseHousehold.actor, aFundingResults)));
    // console.log(JSON.stringify(expectedResult));
    expect(JSON.stringify(LoanUtils.fromNonSmoothablePersistingChargeToLoan(new Date('2021-07-25T11:00:00.000Z'), aCaseHousehold.actor, aFundingResults))).toEqual(JSON.stringify(expectedResult));

  });

});
