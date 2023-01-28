import { Injectable } from '@angular/core';
import { forkJoin, from, merge, Observable, of, Subject } from 'rxjs';
import { catchError, combineAll, map, mergeMap, share, switchMap, take } from 'rxjs/operators';
import { PlanParameters, PlanParametersResource, PlanParametersResourcePaginatedListResponse, PlanParametersResourceResponse, PlanParametersService as InternalPlanParametersService } from '../_api';
import { CaseFormService } from './case-form.service';
import { ErrorDisplayService } from './error-display.service';

@Injectable({
  providedIn: 'root'
})
export class PlanParametersService {

  constructor(private apiService: InternalPlanParametersService,
              private caseForm: CaseFormService,
              private errorService: ErrorDisplayService) {
  }

  remove(caseId: string, plan: PlanParametersResource) {
    if(!plan.id) {
      return of({});
    }
    return this.apiService.deletePlansParameters(plan.id, caseId).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  removeAll(caseId: string, plans: PlanParametersResource[]) {
    const planRemoved = new Observable((observer) => {
      const obs: Observable<PlanParametersResourceResponse>[] = [];
      plans.forEach( plan => {
        if(plan.id) {
          obs.push(this.apiService.deletePlansParameters(plan.id, caseId));
        } else {
          obs.push(of({}));
        }
      });
      forkJoin(obs).pipe(
        take(1)
      ).subscribe( _ => {
        observer.next(true);
      },
      err => observer.error(err) );
    });
    return planRemoved.pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  save(caseId: string, plan: PlanParametersResource, planIdx: number) {
    const planSaved = new Observable<string>((observer) => {
      let obs: Observable<PlanParametersResourceResponse>;
      if(plan.id && plan.meta.etag) {
        obs = this.apiService.putPlansParameters(plan.id, caseId, plan.meta.etag, plan.attributes);
      } else {
        obs = this.apiService.postPlansParameters(caseId, plan.attributes);
      }
      obs.pipe(
        take(1),
        map(res => res.data)
      ).subscribe( (planResources: PlanParametersResource) => {
        console.log('> planResources');
        if( this.caseForm.patchAndValidatePlan(planResources, planIdx) ) {
          console.log(planResources);
          observer.next(planResources.id);
        } else {
          observer.error('Cannot patch and validate plans');
        }
      },
      err => observer.error(err) );
    });
    return planSaved.pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  saveAll(caseId: string, plans: PlanParametersResource[]) {
    const planSaved = new Observable((observer) => {
      const obs: Observable<PlanParametersResourceResponse>[] = [];
      plans.forEach( plan => {
        if(plan.id && plan.meta.etag) {
          obs.push(this.apiService.putPlansParameters(plan.id, caseId, plan.meta.etag, plan.attributes))
        } else {
          obs.push(this.apiService.postPlansParameters(caseId, plan.attributes))
        }
      });
      forkJoin(obs).pipe(
        take(1),
        map(responses => responses.map( resp => resp.data ))
      ).subscribe( (planResources: PlanParametersResource[]) => {
        console.log('> planResources');
        if( this.caseForm.patchAndValidatePlans(planResources) ) {
          observer.next(true);
        } else {
          observer.error('Cannot patch and validate plans');
        }
      },
      err => observer.error(err) );
    });
    return planSaved.pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }


  listPlans(caseId: string): Observable<PlanParametersResourcePaginatedListResponse> {
    return this.apiService.getPlansParameters(caseId).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  retrievePlans(caseId: string, plans: PlanParametersResource[]) {
    const obs: Observable<PlanParametersResourceResponse>[] = [];
    plans.forEach( p => obs.push(this.apiService.getPlansParametersById(p.id, caseId)) );
    return forkJoin(obs).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }


}
