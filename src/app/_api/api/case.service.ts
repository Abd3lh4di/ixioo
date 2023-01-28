/**
 * Toaztr API
 * # Introduction  Les API **Toaztr** sont documentées au format [OpenAPI](https://www.openapis.org/). Elles sont **accessibles depuis n\'importe quel site ou serveur**, toutes les réponses incluant un header Cross-Origin Resource Sharing adapté, comme spécifié sur la [spécification W3C](https://fetch.spec.whatwg.org/).
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { Case } from '../model/models';
import { CaseResourcePaginatedListResponse } from '../model/models';
import { CaseResourceResponse } from '../model/models';
import { ErrorResponse } from '../model/models';
import { SetAssignedToParameters } from '../model/models';
import { SetCaseStatusParameters } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class CaseService {

    protected basePath = 'https://api.toaztr.com';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Supprime un dossier par ID
     * Supprime un dossier par ID
     * @param id ID unique de la ressource
     * @param ifMatch ETag de la ressource
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteCase(id: string, ifMatch?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<any>;
    public deleteCase(id: string, ifMatch?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<any>>;
    public deleteCase(id: string, ifMatch?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<any>>;
    public deleteCase(id: string, ifMatch?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteCase.');
        }

        let headers = this.defaultHeaders;
        if (ifMatch !== undefined && ifMatch !== null) {
            headers = headers.set('If-Match', String(ifMatch));
        }

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.delete<any>(`${this.configuration.basePath}/v1/cases/${encodeURIComponent(String(id))}`,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retourne un dossier par ID
     * Retourne un dossier par ID
     * @param id ID unique de la ressource
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCaseById(id: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CaseResourceResponse>;
    public getCaseById(id: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CaseResourceResponse>>;
    public getCaseById(id: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CaseResourceResponse>>;
    public getCaseById(id: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getCaseById.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<CaseResourceResponse>(`${this.configuration.basePath}/v1/cases/${encodeURIComponent(String(id))}`,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Liste les dossiers
     * Liste les dossiers
     * @param pageSize Taille de la page à retourner
     * @param pageCursor Curseur à partir duquel la prochaine page débute
     * @param ordering Sens de parcours de la liste
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCases(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CaseResourcePaginatedListResponse>;
    public getCases(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CaseResourcePaginatedListResponse>>;
    public getCases(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CaseResourcePaginatedListResponse>>;
    public getCases(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pageSize !== undefined && pageSize !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageSize, 'page[size]');
        }
        if (pageCursor !== undefined && pageCursor !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageCursor, 'page[cursor]');
        }
        if (ordering !== undefined && ordering !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>ordering, 'ordering');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<CaseResourcePaginatedListResponse>(`${this.configuration.basePath}/v1/cases`,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Liste les dossiers par leur categorie
     * Liste les dossiers par leur categorie, la recherche n\&#39;est pas sensible à la casse
     * @param pageSize Taille de la page à retourner
     * @param pageCursor Curseur à partir duquel la prochaine page débute
     * @param ordering Sens de parcours de la liste
     * @param filterCategory Statut du dossier à filtrer
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCasesByCategory(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', filterCategory?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CaseResourcePaginatedListResponse>;
    public getCasesByCategory(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', filterCategory?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CaseResourcePaginatedListResponse>>;
    public getCasesByCategory(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', filterCategory?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CaseResourcePaginatedListResponse>>;
    public getCasesByCategory(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', filterCategory?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pageSize !== undefined && pageSize !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageSize, 'page[size]');
        }
        if (pageCursor !== undefined && pageCursor !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageCursor, 'page[cursor]');
        }
        if (ordering !== undefined && ordering !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>ordering, 'ordering');
        }
        if (filterCategory !== undefined && filterCategory !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>filterCategory, 'filter[category]');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<CaseResourcePaginatedListResponse>(`${this.configuration.basePath}/v1/cases/by-category`,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Liste les dossiers par leur nom
     * Liste les dossiers par leur nom, la recherche n\&#39;est pas sensible à la casse
     * @param pageSize Taille de la page à retourner
     * @param pageCursor Curseur à partir duquel la prochaine page débute
     * @param ordering Sens de parcours de la liste
     * @param filterName Début du nom du dossier
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCasesByName(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', filterName?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CaseResourcePaginatedListResponse>;
    public getCasesByName(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', filterName?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CaseResourcePaginatedListResponse>>;
    public getCasesByName(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', filterName?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CaseResourcePaginatedListResponse>>;
    public getCasesByName(pageSize?: number, pageCursor?: string, ordering?: 'asc' | 'desc', filterName?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pageSize !== undefined && pageSize !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageSize, 'page[size]');
        }
        if (pageCursor !== undefined && pageCursor !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageCursor, 'page[cursor]');
        }
        if (ordering !== undefined && ordering !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>ordering, 'ordering');
        }
        if (filterName !== undefined && filterName !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>filterName, 'filter[name]');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<CaseResourcePaginatedListResponse>(`${this.configuration.basePath}/v1/cases/by-name`,
            {
                params: queryParameters,
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Crée un dossier
     * Crée un dossier
     * @param _case 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public postCase(_case?: Case, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CaseResourceResponse>;
    public postCase(_case?: Case, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CaseResourceResponse>>;
    public postCase(_case?: Case, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CaseResourceResponse>>;
    public postCase(_case?: Case, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.post<CaseResourceResponse>(`${this.configuration.basePath}/v1/cases`,
            _case,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Mets à jour un dossier par ID
     * Mets à jour un dossier par ID
     * @param id ID unique de la ressource
     * @param ifMatch ETag de la ressource
     * @param _case 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public putCase(id: string, ifMatch?: string, _case?: Case, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CaseResourceResponse>;
    public putCase(id: string, ifMatch?: string, _case?: Case, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CaseResourceResponse>>;
    public putCase(id: string, ifMatch?: string, _case?: Case, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CaseResourceResponse>>;
    public putCase(id: string, ifMatch?: string, _case?: Case, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling putCase.');
        }

        let headers = this.defaultHeaders;
        if (ifMatch !== undefined && ifMatch !== null) {
            headers = headers.set('If-Match', String(ifMatch));
        }

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.put<CaseResourceResponse>(`${this.configuration.basePath}/v1/cases/${encodeURIComponent(String(id))}`,
            _case,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Mets à jour le status d\&#39;un dossier par ID
     * Mets à jour l\&#39;ID de l\&#39;utilisateur à qui est assigné le dossier
     * @param id ID unique de la ressource
     * @param ifMatch ETag de la ressource
     * @param setAssignedToParameters 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public putCaseAssignee(id: string, ifMatch?: string, setAssignedToParameters?: SetAssignedToParameters, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CaseResourceResponse>;
    public putCaseAssignee(id: string, ifMatch?: string, setAssignedToParameters?: SetAssignedToParameters, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CaseResourceResponse>>;
    public putCaseAssignee(id: string, ifMatch?: string, setAssignedToParameters?: SetAssignedToParameters, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CaseResourceResponse>>;
    public putCaseAssignee(id: string, ifMatch?: string, setAssignedToParameters?: SetAssignedToParameters, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling putCaseAssignee.');
        }

        let headers = this.defaultHeaders;
        if (ifMatch !== undefined && ifMatch !== null) {
            headers = headers.set('If-Match', String(ifMatch));
        }

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.put<CaseResourceResponse>(`${this.configuration.basePath}/v1/cases/${encodeURIComponent(String(id))}/assigned-to`,
            setAssignedToParameters,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Mets à jour le statut d\&#39;un dossier par ID
     * Mets à jour le statut d\&#39;un dossier par ID
     * @param id ID unique de la ressource
     * @param ifMatch ETag de la ressource
     * @param setCaseStatusParameters 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public putCaseStatus(id: string, ifMatch?: string, setCaseStatusParameters?: SetCaseStatusParameters, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CaseResourceResponse>;
    public putCaseStatus(id: string, ifMatch?: string, setCaseStatusParameters?: SetCaseStatusParameters, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CaseResourceResponse>>;
    public putCaseStatus(id: string, ifMatch?: string, setCaseStatusParameters?: SetCaseStatusParameters, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CaseResourceResponse>>;
    public putCaseStatus(id: string, ifMatch?: string, setCaseStatusParameters?: SetCaseStatusParameters, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling putCaseStatus.');
        }

        let headers = this.defaultHeaders;
        if (ifMatch !== undefined && ifMatch !== null) {
            headers = headers.set('If-Match', String(ifMatch));
        }

        let credential: string | undefined;
        // authentication (toaztr_auth) required
        credential = this.configuration.lookupCredential('toaztr_auth');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.put<CaseResourceResponse>(`${this.configuration.basePath}/v1/cases/${encodeURIComponent(String(id))}/status`,
            setCaseStatusParameters,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
