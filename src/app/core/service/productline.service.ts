/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { Productline } from '../model/productline.model';
import { Product } from '../model/product.model';
import { ProductlineEditForm } from '../model/tasks/productlineEdit.form';

import { ProductService } from './product.service';

import { ArrayUtils } from '../utils/array.utils';
import { Env } from '../utils/env';
import { ErrorUtils } from '../utils/error.utils';
import { UriUtils } from '../utils/uri.utils';

// urls for model: create or update.
const saveUrl: string = "productlines/save";

// urls for primary-key
const findUrl: string = "productlines/find";
const destroyUrl: string = "productlines/destroy";

// urls for conditions.
const countUrl: string = "productlines/count";
const queryUrl: string = "productlines/query";
const updateUrl: string = "productlines/update";
const deleteUrl: string = "productlines/delete";

@Injectable()
export class ProductlineService {

    constructor (protected http: HttpClient) {}

    protected setDefaultValuesTo(productline: Productline) {
    }

    // methods for model Productline -----------------------------------------------

    create(productline: Productline): Observable<Productline> {
        return this.save(productline);
    }

    updateRow(productline: Productline): Observable<Productline> {
        return this.save(productline);
    }

    save(productline: Productline): Observable<Productline> {
        this.setDefaultValuesTo(productline);
        return this.http.post<Productline>(UriUtils.url(saveUrl), JSON.stringify(productline))
            ;
    }

    // methods for primary key -----------------------------------------------

    find(productLine: string): Observable<Productline> {
        let rest: string = '/' + productLine
        return this.http.get<Productline>(UriUtils.url(findUrl + rest))
            .pipe(map(row => new Productline(row)))
            ;
    }

    destroy(productLine: string): Observable<any> {
        let rest: string = '/' + productLine
        return this.http.delete(UriUtils.url(destroyUrl + rest))
            ;
    }

    // methods for conditions -----------------------------------------------

    count(params: any): Observable<number> {
        return this.http.get<{count: number}>(UriUtils.toUrlParams(countUrl, params))
            .pipe(map(resp => resp.count))
            ;
    }

    query(params: any): Observable<Productline[]> {
        return this.http.get<Productline[]>(UriUtils.toUrlParams(queryUrl, params))
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

    getProductlineList(params: any): Observable<Array<Productline>> {
        let url = UriUtils.toUrlParams('productlines/list', params);
        return this.http.get<Productline[]>(url)
            .pipe(map(productlines => productlines.map(productline => new Productline(productline))))
            ;
    }

    getProductlineListCount(params: any): Observable<number> {
        let url = UriUtils.toUrlParams('productlines/list/count', params);
        return this.http.get<{count: number}>(url)
            .pipe(map(resp => resp.count))
            ;
    }

    getProductlineShow(productLine: string): Observable<Productline> {
        let url = UriUtils.url('productlines/show/' + productLine);
        return this.http.get<Productline>(url)
            .pipe(map(json => new Productline(json)))
            ;
    }

    getNewProductlineEdit(): Observable<ProductlineEditForm> {
        let ef: ProductlineEditForm = new ProductlineEditForm();
        ef.productline = new Productline();
        return this.getProductlineEdit(ef);
    }

    getProductlineEditBy(productLine: string): Observable<ProductlineEditForm> {
        return <Observable<ProductlineEditForm>> this.find(productLine)
            .pipe(flatMap(productline => {
                let ef: ProductlineEditForm = new ProductlineEditForm();
                ef.productline = productline;
                return this.getProductlineEdit(ef);
            }))
            ;
    }

    getProductlineEdit(ef: ProductlineEditForm): Observable<ProductlineEditForm> {
        let oef: Observable<ProductlineEditForm> = of(ef);
        return oef.pipe(
            tap(ef => console.log('init productlineEdit...'))
            );
    }

    saveProductlineEdit(ef: ProductlineEditForm): Observable<ProductlineEditForm> {
        this.setDefaultValuesTo(ef.productline);
        let data: string = JSON.stringify(ef);
    //console.log("data = "+data);
        return this.http.post<ProductlineEditForm>(UriUtils.url("productlines/edit"), data)
            ;
    }

}
