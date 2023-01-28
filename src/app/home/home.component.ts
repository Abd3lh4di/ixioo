import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LicenseMember, LicenseResponse } from '../_api';
import { AuthenticationService } from '../_services';
import { LicenceService } from '../_services/licence.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  simulations$;
  licenceName: string;

  constructor(public authService: AuthenticationService, private router: Router, private licenceService: LicenceService) {
  }

  ngOnInit(): void {
    this.licenceService.getLicense().pipe(take(1)).subscribe(
      (resp: LicenseResponse)=> {
        this.licenceName = resp.data.name;
      }
    );
  }

  refresh() {
    this.authService.refreshToken();
  }
  logout() {
    this.authService.logout();
  }

  onSimulationSelected(event) {
    this.router.navigate(['simulation', JSON.stringify(event.option.value) ]);
  }

  getSimulationOptionText(option) {
    return option ? option.text : null;
  }

}
