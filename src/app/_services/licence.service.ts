import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LicenseMembersResponse, LicenseResponse, LicenseService as InternalLicenseService } from '../_api';
import { ErrorDisplayService } from './error-display.service';


@Injectable({
  providedIn: 'root'
})
export class LicenceService {
  constructor(private apiService: InternalLicenseService,
              private errorService: ErrorDisplayService) {
  }

  getLicenseMembers(): Observable<LicenseMembersResponse> {
    return this.apiService.getLicenseMembers().pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  getLicense(): Observable<LicenseResponse> {
    return this.apiService.getLicense().pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

}
