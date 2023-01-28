import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public loading$: BehaviorSubject<boolean>;

  constructor() {
    this.loading$ = new BehaviorSubject<boolean>(false);
  }

  setLoading(isLoading: boolean) {
    this.loading$.next(isLoading);
  }
}
