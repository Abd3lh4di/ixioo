import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscriptions = [];

  constructor(private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.subscriptions.push(this.authService.loggedIn$.subscribe(
      (loggedIn) => {
        if (loggedIn.loggedIn) {
          this.router.navigateByUrl(decodeURIComponent(loggedIn.state).replace(window.location.origin, ''));
        }
      }
    ));

    const isLoggedin = this.authService.isLoggedIn;
    if (isLoggedin) {
      this.router.navigate(['home']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
