import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorDisplayService } from '.';
import { NotaryFeesParameters, NotaryFeesResponse, NotaryService } from '../_api';

@Injectable({
  providedIn: 'root'
})
export class NotaryFeesService {

  constructor(private apiService: NotaryService,
              private errorService: ErrorDisplayService) { }

  computeFees(params: NotaryFeesParameters): Observable<NotaryFeesResponse> {
    return this.apiService.postNotaryFees(params).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }
}
