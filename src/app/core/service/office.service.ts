/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { Office } from '../model/office.model';
import { Employee } from '../model/employee.model';
import { OfficeEditForm } from '../model/tasks/officeEdit.form';

import { EmployeeService } from './employee.service';

import { ArrayUtils } from '../utils/array.utils';
import { Env } from '../utils/env';
import { ErrorUtils } from '../utils/error.utils';
import { UriUtils } from '../utils/uri.utils';

// urls for model: create or update.
const saveUrl: string = "offices/save";

// urls for primary-key
const findUrl: string = "offices/find";
const destroyUrl: string = "offices/destroy";

// urls for conditions.
const countUrl: string = "offices/count";
const queryUrl: string = "offices/query";
const updateUrl: string = "offices/update";
const deleteUrl: string = "offices/delete";

@Injectable()
export class OfficeService {

    constructor (protected http: HttpClient) {}

    protected setDefaultValuesTo(office: Office) {
    }

    // methods for model Office -----------------------------------------------

    create(office: Office): Observable<Office> {
        return this.save(office);
    }

    updateRow(office: Office): Observable<Office> {
        return this.save(office);
    }

    save(office: Office): Observable<Office> {
        this.setDefaultValuesTo(office);
        return this.http.post<Office>(UriUtils.url(saveUrl), JSON.stringify(office))
            ;
    }

    // methods for primary key -----------------------------------------------

    find(officeCode: string): Observable<Office> {
        let rest: string = '/' + officeCode
        return this.http.get<Office>(UriUtils.url(findUrl + rest))
            .pipe(map(row => new Office(row)))
            ;
    }

    destroy(officeCode: string): Observable<any> {
        let rest: string = '/' + officeCode
        return this.http.delete(UriUtils.url(destroyUrl + rest))
            ;
    }

    // methods for conditions -----------------------------------------------

    count(params: any): Observable<number> {
        return this.http.get<{count: number}>(UriUtils.toUrlParams(countUrl, params))
            .pipe(map(resp => resp.count))
            ;
    }

    query(params: any): Observable<Office[]> {
        return this.http.get<Office[]>(UriUtils.toUrlParams(queryUrl, params))
            ;
    }

    update(columns: any, params: any): Observable<any> {
        return this.http.post<{state:string, message:string}>(UriUtils.toUrlParams(updateUrl, params), JSON.stringify(columns))
            .pipe(map(resp => {
                if (resp.state != "ok") {
                    return throwError("update fail: "+resp.message);
                } else {
                    return resp;
                }
            }))
            ;
    }

    delete(params: any): Observable<any> {
        return this.http.delete(UriUtils.toUrlParams(deleteUrl, params))
            ;
    }

    getOfficeList(params: any): Observable<Array<Office>> {
        let url = UriUtils.toUrlParams('offices/list', params);
        return this.http.get<Office[]>(url)
            .pipe(map(offices => offices.map(office => new Office(office))))
            ;
    }

    getOfficeListCount(params: any): Observable<number> {
        let url = UriUtils.toUrlParams('offices/list/count', params);
        return this.http.get<{count: number}>(url)
            .pipe(map(resp => resp.count))
            ;
    }

    getOfficeMap(params: any): Observable<Array<Office>> {
        let url = UriUtils.toUrlParams('offices/map', params);
        return this.http.get<Office[]>(url)
            .pipe(map(offices => offices.map(office => new Office(office))))
            ;
    }

    getOfficeShow(officeCode: string): Observable<Office> {
        let url = UriUtils.url('offices/show/' + officeCode);
        return this.http.get<Office>(url)
            .pipe(map(json => new Office(json)))
            ;
    }

    getNewOfficeEdit(): Observable<OfficeEditForm> {
        let ef: OfficeEditForm = new OfficeEditForm();
        ef.office = new Office();
        return this.getOfficeEdit(ef);
    }

    getOfficeEditBy(officeCode: string): Observable<OfficeEditForm> {
        return <Observable<OfficeEditForm>> this.find(officeCode)
            .pipe(flatMap(office => {
                let ef: OfficeEditForm = new OfficeEditForm();
                ef.office = office;
                return this.getOfficeEdit(ef);
            }))
            ;
    }

    getOfficeEdit(ef: OfficeEditForm): Observable<OfficeEditForm> {
        let oef: Observable<OfficeEditForm> = of(ef);
        return oef.pipe(
            tap(ef => console.log('init officeEdit...'))
            );
    }

    saveOfficeEdit(ef: OfficeEditForm): Observable<OfficeEditForm> {
        this.setDefaultValuesTo(ef.office);
        let data: string = JSON.stringify(ef);
    //console.log("data = "+data);
        return this.http.post<OfficeEditForm>(UriUtils.url("offices/edit"), data)
            ;
    }

}
