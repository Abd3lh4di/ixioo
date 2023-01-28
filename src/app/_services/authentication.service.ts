import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthConfig, LoginOptions, OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './app-config.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public loggedIn$: BehaviorSubject<{loggedIn: boolean, state?: string}>;
    public userName$: BehaviorSubject<string>;
    public userId$: BehaviorSubject<string>;

    constructor(private oAuthService: OAuthService, private router: Router, ) {

        // clear tokens from storage if expired
        if(!this.oAuthService.hasValidAccessToken()) {
            sessionStorage.removeItem('access_token');
        }
        if(!this.oAuthService.hasValidIdToken()) {
            sessionStorage.removeItem('id_token');
        }

        this.loggedIn$ = new BehaviorSubject<{loggedIn: boolean, state?: string}>({loggedIn: false});
        this.userName$ = new BehaviorSubject<string>(undefined);
        this.userId$ = new BehaviorSubject<string>(undefined);
        const authCodeFlowConfig: AuthConfig = {
            issuer: AppConfigService.serverConfig.issuer,
            logoutUrl: AppConfigService.serverConfig.logoutUrl,
            redirectUri: window.location.origin,
            clientId: AppConfigService.serverConfig.clientId,
            responseType: 'code',
            scope: 'openid profile simulations/* bills/* cases/* license/read',
            useSilentRefresh: false,
            showDebugInformation: !environment.production,
            timeoutFactor: 0.01,
            clearHashAfterLogin: false,
            strictDiscoveryDocumentValidation: false,
            requestAccessToken: true,
        };
        this.oAuthService.configure(authCodeFlowConfig);
        this.oAuthService.loadDiscoveryDocumentAndLogin({ state: window.location.href} ).then(
            () => {
                if (this.oAuthService.hasValidAccessToken() && this.oAuthService.hasValidIdToken()) {
                    this.loggedIn$.next({loggedIn: true, state: this.oAuthService.state});
                    this.oAuthService.loadUserProfile();

                } else {
                    sessionStorage.removeItem('access_token');
                    sessionStorage.removeItem('id_token');
                }
            }
        );


        if(!environment.production) {
            this.userId$.next('test');
        }

        this.oAuthService.events
          .pipe(filter(e => e.type === 'user_profile_loaded'))
            .subscribe(_ => this._setUserName());
    }

    public get isLoggedIn(): boolean {
        if(!environment.production) {
            return true;
        }
        return this.oAuthService.hasValidAccessToken() && this.oAuthService.hasValidIdToken();
    }
    public get userId(): string {
        if(!environment.production) {
            return 'test';
        }
        return this.userId$.value;
    }
    login(redirectUrl?: string) {
        this.oAuthService.initLoginFlow(redirectUrl);
    }
    logout() {
        const logoutData = {
            client_id: this.oAuthService.clientId,
            redirect_uri: this.oAuthService.redirectUri,
            response_type: this.oAuthService.responseType
        };
        this.oAuthService.logOut(logoutData);
    }
    refreshToken() {
        this.oAuthService.refreshToken();
    }

    private _setUserName() {
        const claims = this.oAuthService.getIdentityClaims();
        /* tslint:disable:no-string-literal */
        this.userId$.next(claims['sub']);
        if (claims.hasOwnProperty('name')) {
            this.userName$.next(claims['name']);
        } else if (claims.hasOwnProperty('given_name')) {
            this.userName$.next(claims['given_name']);
        } else if (claims.hasOwnProperty('username')) {
            this.userName$.next(claims['username']);
        } else {
            this.userName$.next('Utilisateur inconnu');
        }
        /* tslint:enable:no-string-literal */
    }

}
