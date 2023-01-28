import { Component, OnInit, Input } from '@angular/core';
import { LoanUtils } from 'src/app/utils/loan-utils';
import { FundingResults } from 'src/app/_api';

export interface BankElement {
  echeanceNumber: number;
  amortissement: string;
  interets: string;
  assurance: string;
  capitalRestantDu: string;
  echeance: string;
  montant: string;
}

// const ELEMENT_DATA: BankElement[] = [
//   { name: 'BNP', agency: 'Sud', department: '13', contact: 'Mr BenZemour'},
//   { name: 'LCL', agency: 'Sud', department: '13', contact: 'Mr Lavigne'},
//   { name: 'La banque postale', agency: 'Sud', department: '13', contact: 'Mr Robini'},
//   { name: 'La Caisse d\'Epargne', agency: 'Sud', department: '13', contact: 'Mr Rouget'},
//   { name: 'HSBC', agency: 'Sud', department: '13', contact: 'Mr Testoune'},
//   { name: 'Boursorama', agency: '', department: '13', contact: 'Mr Cassecouille'},
//   { name: 'Société Générale', agency: 'Sud', department: '13', contact: 'Mr Robert'},
//   { name: 'Crédit Agricole', agency: 'Sud', department: '13', contact: 'Mr Paysan'},
//   { name: 'Crédit Agricole', agency: 'Sud', department: '13', contact: 'Mr Paysan'},
// ];



@Component({
  selector: 'app-amortization-table',
  templateUrl: './amortization-table.component.html',
  styleUrls: ['./amortization-table.component.scss']
})
export class AmortizationTableComponent implements OnInit {

  @Input() fundingResults: FundingResults;

  displayedColumns = [];
  dataSource = [];

  amortizationTableData = [];
  amortizationTableHeaders = [];
  loansTitles = [];

  constructor() {
  }

  ngOnInit(): void {
    this.computeAmortizationTable();
  }

  computeAmortizationTable() {
    const loans = this.fundingResults.loans;
    this.buildAmortizationTable(loans);
    const financialRecap = LoanUtils.generateLoanRecap(loans);
    this.loansTitles = financialRecap.loansRecap.slice(0, financialRecap.loansRecap.length - 1);
  }

  buildAmortizationTable(loans) {
    this.amortizationTableData = LoanUtils.generateAmortizationTable(loans);
    LoanUtils.formatAmortizationTablesHeaders(loans, this.amortizationTableData, this.amortizationTableHeaders, this.displayedColumns);
  }

}
