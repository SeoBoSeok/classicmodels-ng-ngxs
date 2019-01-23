/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { Product } from '../model/product.model';
import { Productline } from '../model/productline.model';
import { Orderdetail } from '../model/orderdetail.model';
import { ProductEditForm } from '../model/tasks/productEdit.form';

import { ProductlineService } from './productline.service';
import { OrderdetailService } from './orderdetail.service';

import { ArrayUtils } from '../utils/array.utils';
import { Env } from '../utils/env';
import { ErrorUtils } from '../utils/error.utils';
import { UriUtils } from '../utils/uri.utils';

// urls for model: create or update.
const saveUrl: string = "products/save";

// urls for primary-key
const findUrl: string = "products/find";
const destroyUrl: string = "products/destroy";

// urls for conditions.
const countUrl: string = "products/count";
const queryUrl: string = "products/query";
const updateUrl: string = "products/update";
const deleteUrl: string = "products/delete";

@Injectable()
export class ProductService {

    constructor (
        protected productlineService: ProductlineService,
        protected http: HttpClient) {
    }

    protected setDefaultValuesTo(product: Product) {
    }

    // methods for model Product -----------------------------------------------

    create(product: Product): Observable<Product> {
        return this.save(product);
    }

    updateRow(product: Product): Observable<Product> {
        return this.save(product);
    }

    save(product: Product): Observable<Product> {
        this.setDefaultValuesTo(product);
        return this.http.post<Product>(UriUtils.url(saveUrl), JSON.stringify(product))
            ;
    }

    // methods for primary key -----------------------------------------------

    find(productCode: string): Observable<Product> {
        let rest: string = '/' + productCode
        return this.http.get<Product>(UriUtils.url(findUrl + rest))
            .pipe(map(row => new Product(row)))
            ;
    }

    destroy(productCode: string): Observable<any> {
        let rest: string = '/' + productCode
        return this.http.delete(UriUtils.url(destroyUrl + rest))
            ;
    }

    // methods for conditions -----------------------------------------------

    count(params: any): Observable<number> {
        return this.http.get<{count: number}>(UriUtils.toUrlParams(countUrl, params))
            .pipe(map(resp => resp.count))
            ;
    }

    query(params: any): Observable<Product[]> {
        return this.http.get<Product[]>(UriUtils.toUrlParams(queryUrl, params))
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

    getProductList(params: any): Observable<Array<Product>> {
        let url = UriUtils.toUrlParams('products/list', params);
        return this.http.get<Product[]>(url)
            .pipe(map(products => products.map(product => new Product(product))))
            ;
    }

    getProductListCount(params: any): Observable<number> {
        let url = UriUtils.toUrlParams('products/list/count', params);
        return this.http.get<{count: number}>(url)
            .pipe(map(resp => resp.count))
            ;
    }

    getProductShow(productCode: string): Observable<Product> {
        let url = UriUtils.url('products/show/' + productCode);
        return this.http.get<Product>(url)
            .pipe(map(json => new Product(json)))
            ;
    }

    getNewProductEdit(): Observable<ProductEditForm> {
        let ef: ProductEditForm = new ProductEditForm();
        ef.product = new Product();
        return this.getProductEdit(ef);
    }

    getProductEditBy(productCode: string): Observable<ProductEditForm> {
        return <Observable<ProductEditForm>> this.find(productCode)
            .pipe(flatMap(product => {
                let ef: ProductEditForm = new ProductEditForm();
                ef.product = product;
                return this.getProductEdit(ef);
            }))
            ;
    }

    getProductEdit(ef: ProductEditForm): Observable<ProductEditForm> {
        let oef: Observable<ProductEditForm> = of(ef);
        return oef.pipe(
            tap(ef => console.log('init productEdit...'))
            // load all productlines to be able to select.
            ,flatMap(ef => {
                return this.productlineService.query({}).pipe(
                    tap(productlines => ef.productlines = productlines)
                    ,flatMap(x => oef)
                    );
            })
            );
    }

    saveProductEdit(ef: ProductEditForm): Observable<ProductEditForm> {
        this.setDefaultValuesTo(ef.product);
        let data: string = JSON.stringify(ef);
    //console.log("data = "+data);
        return this.http.post<ProductEditForm>(UriUtils.url("products/edit"), data)
            ;
    }

}
