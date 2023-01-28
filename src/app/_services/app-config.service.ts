import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export class ServerConfig {
  apiServerUrl: string;
  logoutUrl: string;
  issuer: string;
  clientId: string;
  allowedUrls: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  static serverConfig: ServerConfig = {
      apiServerUrl: 'APISERVER',
      logoutUrl: 'LOGOUT',
      issuer: 'ISSUER',
      clientId: 'CLIENTID',
      allowedUrls:  []
  };

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    if (environment.production) {
      return this.http.get('URL')
      .toPromise()
      .then((data: ServerConfig) => {
        AppConfigService.serverConfig = data;
      });
    } else {
      const data: ServerConfig = {
        apiServerUrl: 'http://localhost:4400',
        logoutUrl: 'http://localhost:4400/logout',
        issuer: '',
        clientId: '',
        allowedUrls:  ['http://localhost:4400']
      };
      AppConfigService.serverConfig = data;
    }
  }

}
