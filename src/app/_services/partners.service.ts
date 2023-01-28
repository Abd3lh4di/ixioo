import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorDisplayService } from '.';
import { Partner, PartnerResource, PartnerResourceResponse, PartnerService } from '../_api';

@Injectable({
  providedIn: 'root'
})
export class PartnersService {

  constructor(private apiService: PartnerService,
              private errorService: ErrorDisplayService) { }

  post(parameters: Partner) {
    return this.apiService.postPartner(parameters).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  update(id: string, updatedPartner: Partner, etag?: string) {
    return this.apiService.putPartner(id, etag, updatedPartner).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  retrieve(partnerId: string): Observable<PartnerResourceResponse> {
    return this.apiService.getPartnerById(partnerId).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  search(pageSize: number, cursor: string) {
    return this.apiService.getPartenaires(pageSize, cursor, 'desc').pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  delete(id: string) {
    return this.apiService.deletePartner(id).pipe(
      catchError(error => {
        this.errorService.logError(error);
        return of();
      })
    );
  }

  // save(partnerData: Partner, partnerId?: string, etag?: string) {
  //   let obs: Observable<PartnerResource>;
  //   if (partnerId) {
  //     obs = this.update(partnerId, partnerData, etag)
  //               .pipe(take(1), map((resp:any) => resp.data));
  //   } else {
  //     obs = this.save(partnerData).pipe(take(1), map((resp:any) => resp.data));
  //   }
  //   return obs.pipe(
  //     catchError(error => {
  //       this.errorService.logError(error);
  //       return of();
  //     })
  //   );
  // }
}
