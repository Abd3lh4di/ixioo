import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  public zoneSearchResponseSubject: Subject<any> = new Subject<any>();

  constructor() {
  }

  searchZone(searchValue: string) {
    this.zoneSearchResponseSubject.next({
      search_text: searchValue,
      select: 'name,zone,code,postal_codes',
      suggester_name: 'default',
      top: 5
    });
  }

}
