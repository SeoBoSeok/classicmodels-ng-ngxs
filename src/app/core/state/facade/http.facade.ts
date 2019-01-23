/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, Observer, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { UriUtils } from '../../utils/uri.utils';

@Injectable()
export class HttpFacade {

    constructor (protected http: HttpClient) {
    }

    get<T>(url0: string, params: any, successObs: Observer<T>, failureObs: Observer<string>): void {
        const url = UriUtils.toUrlParams(url0, params);
        this.http.get<T>(UriUtils.url(url))
            .subscribe(
                (rows: T) => {
                    successObs.next(rows);
                },
                err => {
                    failureObs.next("Error on get "+url+": "+err);
                }
            );
    }

    post<T>(url: string, data: T, successObs: Observer<T>, failureObs: Observer<string>): void {
        this.http.post<T>(UriUtils.url(url), data)
            .subscribe(
                (rows: T) => {
                    successObs.next(rows);
                },
                err => {
                    failureObs.next("Error on post "+url+": "+err);
                }
            );
    }
}
