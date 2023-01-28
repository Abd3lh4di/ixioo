import { Injectable } from '@angular/core';
import { Subject, from, Observable, of, forkJoin } from 'rxjs';
import { share, switchMap, catchError, map, tap, take } from 'rxjs/operators';
import { SimulationResource, SimulationResourcePaginatedListResponse, SimulationResourceResponse, SimulationService as InternalSimulationService } from '../_api';
import { ErrorDisplayService } from './error-display.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  private simulationSubject: Subject<{caseId: string, planId: string}> = new Subject<{caseId: string, planId: string}>();
  private simulationResultsSubject: Subject<{caseId: string, plansId: string[]}> = new Subject<{caseId: string, plansId: string[]}>();
  public simulation$: Observable<SimulationResourceResponse>;
  public simulationResults$: Observable<{planId: string;resources: SimulationResource[];}[]>;

  constructor(private apiService: InternalSimulationService,
              private errorService: ErrorDisplayService) {
    this.simulation$ = this.simulationSubject.pipe(
      switchMap( (parameters) =>
      this.apiService.postSimulation(parameters.caseId, parameters.planId).pipe(
          tap( (response: SimulationResourceResponse) => {
            if(!this.errorService.isOptimal(response.data)) {
              this.errorService.logError(response);
              return of();
            }
          }),
          catchError( (err) => {
            this.errorService.logError(err);
            return of();
          })
        )
      ),
      share()
    );
    this.simulationResults$ = this.simulationResultsSubject.pipe(
      switchMap( (parameters) => {
        const obs: Observable<{ planId: string; resources: SimulationResource[];}>[] = [];
        parameters.plansId.forEach( planId => {
          obs.push(this.apiService.getSimulations(parameters.caseId, planId).pipe( map(r => ({ planId, resources: r.data }) )));
        });
        return forkJoin(obs).pipe(
          take(1),
          catchError(error => {
            this.errorService.logError(error);
            return of([]);
          })
        );
      }),
      share()
    );
  }


  listSimulations(caseId: string, planId: string): Observable<SimulationResourcePaginatedListResponse> {
    return this.apiService.getSimulations(caseId, planId).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  retrieveSimulations(caseId: string, plansId: string[]) {
    this.simulationResultsSubject.next({caseId, plansId});
  }

  launchSimulation(caseId: string, planId: string) {
    this.simulationSubject.next({caseId, planId});
  }
}
