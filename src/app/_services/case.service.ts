import { Injectable } from '@angular/core';
import { Subject, from, Observable, merge, of } from 'rxjs';
import { share, switchMap, catchError, take, map } from 'rxjs/operators';

// import { CaseResponse, CasesService } from '../_api';
import { CaseResource, CaseResourcePaginatedListResponse, CaseResourceResponse, CaseService as InternalCaseService, CaseStatus } from '../_api';
import { Case } from '../_api';
import { CaseFormService } from './case-form.service';
import { ErrorDisplayService } from './error-display.service';


@Injectable({
  providedIn: 'root'
})
export class CaseService {
  public caseSaved: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: InternalCaseService,
              private caseForm: CaseFormService,
              private errorService: ErrorDisplayService) {
  }

  save(parameters: Case) {
    return this.apiService.postCase(parameters).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }
  update(id: string, updatedCase: Case, etag: string) {
    return this.apiService.putCase(id, etag, updatedCase).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  delete(id: string) {
    return this.apiService.deleteCase(id).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  retrieve(caseId: string): Observable<CaseResourceResponse> {
    return this.apiService.getCaseById(caseId).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }
  search(pageSize: number, cursor: string, filterName?: string) {
    let obs: Observable<CaseResourcePaginatedListResponse>;
    if(filterName) {
      obs = this.apiService.getCasesByName(pageSize, cursor, 'desc', filterName);
    } else {
      obs = this.apiService.getCases(pageSize, cursor, 'desc');
    }
    return obs.pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  retrieveByCategory(pageSize: number, pageCursor: string, filterCategory: string) {
    return this.apiService.getCasesByCategory(pageSize, pageCursor, 'asc', filterCategory).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  saveCase(caseData: Case, caseId?: string, etag?: string) {
    const caseSaved = new Observable((observer) => {
      let obs: Observable<CaseResource>;
      if (caseId) {
        obs = this.update(caseId, caseData, etag)
                  .pipe(take(1), map((resp:any) => resp.data));
      } else {
        obs = this.save(caseData).pipe(take(1), map((resp:any) => resp.data));
      }
      obs.subscribe( (caseResource: CaseResource) => {
        if( this.caseForm.patchAndValidateCase(caseResource) ) {
          observer.next(true);
        } else {
          observer.error('Cannot patch and validate case');
        }
      })

    });
    return caseSaved.pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  updateStatus(caseId: string, status: CaseStatus ) {
    return this.apiService.putCaseStatus(caseId, undefined, { status } ).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }
  updateAssignedTo(caseId: string, assignedTo: string ) {
    return this.apiService.putCaseAssignee(caseId, undefined, { assigned_to: assignedTo } ).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

}
