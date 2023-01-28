import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, merge, Subject } from 'rxjs';
import { catchError, share, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InseeCodeService {

  public nameSearchResponseSubject: Subject<any> = new Subject<any>();
  public departmentSearchResponseSubject: Subject<any> = new Subject<any>();
  public postCodeSearchResponseSubject: Subject<any> = new Subject<any>();

  public inseeSearchResponse$ = merge(
    this.departmentSearchResponseSubject.pipe(
      switchMap( (departmentCode) =>
        this.http.get<any>(`https://geo.api.gouv.fr/communes?codeDepartement=${departmentCode}&fields=code,nom,codesPostaux`).pipe(
          catchError( (err) => {
            console.error('InseeCodeService::DepartmentSearch error: ', err);
            return from([err]);
          })
        )
      ),
      share()
    ),
    this.nameSearchResponseSubject.pipe(
      switchMap( (name) =>
        this.http.get<any>(`https://geo.api.gouv.fr/communes?nom=${name}&fields=code,nom,codesPostaux`).pipe(
          catchError( (err) => {
            console.error('InseeCodeService::NameSearch error: ', err);
            return from([err]);
          })
        )
      ),
      share()
    ),
    this.postCodeSearchResponseSubject.pipe(
      switchMap( (postCode) =>
        this.http.get<any>(`https://geo.api.gouv.fr/communes?codePostal=${postCode}&fields=code,nom,codesPostaux`).pipe(
          catchError( (err) => {
            console.error('InseeCodeService::PostCodeSearch error: ', err);
            return from([err]);
          })
        )
      ),
      share()
    )
  );

  constructor(private http: HttpClient) { }

  searchName(name: string) {
    this.nameSearchResponseSubject.next(name);
  }
  searchDepartment(departmentCode: string) {
    this.departmentSearchResponseSubject.next(departmentCode);
  }
  searchPostCode(postCode: string) {
    this.postCodeSearchResponseSubject.next(postCode);
  }
}

