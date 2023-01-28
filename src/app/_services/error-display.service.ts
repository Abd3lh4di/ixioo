import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BudgetResults, BudgetSimulation, DebtConsolidationResults, DebtConsolidationSimulation, FundingResults, FundingSimulation, PinelResults, PinelSimulation, SimulationResource } from '../_api';

export class Error {
  text: string;
  header: string;
  class: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorDisplayService {

  public errors$: BehaviorSubject<Error>;

  constructor() {
    this.errors$ = new BehaviorSubject<Error>(null);
  }

  logError(error: any) {
    console.error('ERROR: ', error);
    this.errors$.next(this.getError(error));
  }

  hasError(response): boolean {
    if (!response.status) { return false; }
    if (response.status === 500 || response.status === 400) { return true; }
    return false;
  }

  isOptimal(data: SimulationResource) {
    if (data.attributes.type === BudgetSimulation.TypeEnum.Budget) {
      return (data.attributes.results as BudgetResults).funding_plan.status === 'OPTIMAL';
    } else if (data.attributes.type === FundingSimulation.TypeEnum.Funding) {
      return (data.attributes.results as FundingResults).status === 'OPTIMAL';
    } else if (data.attributes.type === DebtConsolidationSimulation.TypeEnum.DebtConsolidation) {
      return (data.attributes.results as DebtConsolidationResults).funding_plan.status === 'OPTIMAL';
    } else if (data.attributes.type === PinelSimulation.TypeEnum.Pinel) {
      return (data.attributes.results as PinelResults).funding_plan.status === 'OPTIMAL';
    }
    return true;
  }

  getError(response: any): Error {
    const error: Error = {
      text: JSON.stringify(response),
      header: 'Unknown error',
      class: 'text-danger'
    };
    if (response.status) {
      switch (response.status) {
        case 403:
          error.header = 'Erreur 403 - ' + response.statusText;
          error.text = `Votre utilisateur n'est pas authorisé.
            Vérifiez que vous avez bien une souscription. Ou essayez de vous identifier à nouveau.`;
          break;
        case 404:
          error.header = 'Erreur 404 - Serveur indisponible';
          error.text = 'Le serveur est indisponible. Veuillez réessayer plus tard. Contactez le service technique si l\'erreur persiste.';
          break;
        case 400:
          error.header = 'Erreur 400 - Mauvaise requête';
          if(response.error?.errors?.[0]?.detail) {
            error.text = 'Détails: ' + response.error.errors[0].detail;
          } else {
            error.text = 'Erreur. Contactez le support technique.';
          }
          break;
        default:
          error.header = response.status + ' - ' + response.statusText;
          error.text = response.message;
          break;
      }
    } else if (response.data) {
      if (!this.isOptimal(response.data)) {
        error.header = 'Simulation infaisable';
        error.text = 'Les paramètres ne permettent pas d\'obtenir un plan de financement (capacité de remboursement trop faible ou apport insuffisant en général).';
      } else {
        error.header = response.details.results.status;
        error.text = response.details.results.status;
      }
    }
    return error;
  }

}
