import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmountCalculatorService {
  mensualIncomes$ = new BehaviorSubject(0);
  allowedDebt$ = new BehaviorSubject(33);
  maxInstallment$ = new BehaviorSubject(0);

  price$ = new BehaviorSubject(0);
  fees$ = new BehaviorSubject(0);
  contribution$ = new BehaviorSubject(0);
  totalAmount$ = new BehaviorSubject(0);
  renewalWorksAmount$ = new BehaviorSubject(0);
  constructionPrice$ = new BehaviorSubject(0);

  constructor() {
  }

  reset() {
    this.mensualIncomes$ = new BehaviorSubject(0);
    this.allowedDebt$ = new BehaviorSubject(33);
    this.maxInstallment$ = new BehaviorSubject(0);
    this.price$ = new BehaviorSubject(0);
    this.fees$ = new BehaviorSubject(0);
    this.contribution$ = new BehaviorSubject(0);
    this.totalAmount$ = new BehaviorSubject(0);
    this.renewalWorksAmount$ = new BehaviorSubject(0);
    this.constructionPrice$ = new BehaviorSubject(0);
  }

  setMensualIncomes(incomes: number): void {
    this.mensualIncomes$.next(incomes);
    this._updateTotals();
  }

  setAllowedDebt(allowedDebt: number): void {
    this.allowedDebt$.next(allowedDebt);
    this._updateTotals();
  }

  setFees(fees: number) {
    this.fees$.next(fees);
    this._updateTotals();
  }

  setContribution(contribution: number) {
    this.contribution$.next(contribution);
    this._updateTotals();
  }

  setPrice(price: number) {
    this.price$.next(price);
    this._updateTotals();
  }

  setRenewalWorksAmount(renewalWorksAmount: number) {
    this.renewalWorksAmount$.next(renewalWorksAmount);
    this._updateTotals();
  }

  setConstructionPrice(constructionPrice: number) {
    this.constructionPrice$.next(constructionPrice);
    this._updateTotals();
  }

  setTotalAmount(totalAmount: number): void {
    this.totalAmount$.next(totalAmount);
  }

  setMaxInstallment(maxInstallment: any) {
    this.maxInstallment$.next(maxInstallment);
  }

  private _updateTotals() {
    const tempTotal = Math.max(0, Number(this.price$.value) + Number(this.constructionPrice$.value) + Number(this.fees$.value) + Number(this.renewalWorksAmount$.value) - Number(this.contribution$.value));
    const tempMaxInstallment = Math.max(0, Number(this.mensualIncomes$.value) * Number(this.allowedDebt$.value) / 100);

    this.totalAmount$.next(Math.round(tempTotal * 100 ) / 100);
    this.maxInstallment$.next(Math.round(tempMaxInstallment * 100) / 100);
  }

}
