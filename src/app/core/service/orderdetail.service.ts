/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { Orderdetail } from '../model/orderdetail.model';
import { Order } from '../model/order.model';
import { Product } from '../model/product.model';
import { OrderdetailEditForm } from '../model/tasks/orderdetailEdit.form';

import { OrderService } from './order.service';
import { ProductService } from './product.service';

import { ArrayUtils } from '../utils/array.utils';
import { Env } from '../utils/env';
import { ErrorUtils } from '../utils/error.utils';
import { UriUtils } from '../utils/uri.utils';

// urls for model: create or update.
const saveUrl: string = "orderdetails/save";

// urls for primary-key
const findUrl: string = "orderdetails/find";
const destroyUrl: string = "orderdetails/destroy";

// urls for conditions.
const countUrl: string = "orderdetails/count";
const queryUrl: string = "orderdetails/query";
const updateUrl: string = "orderdetails/update";
const deleteUrl: string = "orderdetails/delete";

@Injectable()
export class OrderdetailService {

    constructor (
        protected orderService: OrderService,
        protected productService: ProductService,
        protected http: HttpClient) {
    }

    protected setDefaultValuesTo(orderdetail: Orderdetail) {
    }

    // methods for model Orderdetail -----------------------------------------------

    create(orderdetail: Orderdetail): Observable<Orderdetail> {
        return this.save(orderdetail);
    }

    updateRow(orderdetail: Orderdetail): Observable<Orderdetail> {
        return this.save(orderdetail);
    }

    save(orderdetail: Orderdetail): Observable<Orderdetail> {
        this.setDefaultValuesTo(orderdetail);
        return this.http.post<Orderdetail>(UriUtils.url(saveUrl), JSON.stringify(orderdetail))
            ;
    }

    // methods for primary key -----------------------------------------------

    find(orderNumber: number, productCode: string): Observable<Orderdetail> {
        let rest: string = '/' + orderNumber+ '/' +productCode
        return this.http.get<Orderdetail>(UriUtils.url(findUrl + rest))
            .pipe(map(row => new Orderdetail(row)))
            ;
    }

    destroy(orderNumber: number, productCode: string): Observable<any> {
        let rest: string = '/' + orderNumber+ '/' +productCode
        return this.http.delete(UriUtils.url(destroyUrl + rest))
            ;
    }

    // methods for conditions -----------------------------------------------

    count(params: any): Observable<number> {
        return this.http.get<{count: number}>(UriUtils.toUrlParams(countUrl, params))
            .pipe(map(resp => resp.count))
            ;
    }

    query(params: any): Observable<Orderdetail[]> {
        return this.http.get<Orderdetail[]>(UriUtils.toUrlParams(queryUrl, params))
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

    getOrderdetailList(params: any): Observable<Array<Orderdetail>> {
        let url = UriUtils.toUrlParams('orderdetails/list', params);
        return this.http.get<Orderdetail[]>(url)
            .pipe(map(orderdetails => orderdetails.map(orderdetail => new Orderdetail(orderdetail))))
            ;
    }

    getOrderdetailListCount(params: any): Observable<number> {
        let url = UriUtils.toUrlParams('orderdetails/list/count', params);
        return this.http.get<{count: number}>(url)
            .pipe(map(resp => resp.count))
            ;
    }

    getOrderdetailShow(orderNumber: number, productCode: string): Observable<Orderdetail> {
        let url = UriUtils.url('orderdetails/show/' + orderNumber+'/'+productCode);
        return this.http.get<Orderdetail>(url)
            .pipe(map(json => new Orderdetail(json)))
            ;
    }

    getNewOrderdetailEdit(): Observable<OrderdetailEditForm> {
        let ef: OrderdetailEditForm = new OrderdetailEditForm();
        ef.orderdetail = new Orderdetail();
        return this.getOrderdetailEdit(ef);
    }

    getOrderdetailEditBy(orderNumber: number, productCode: string): Observable<OrderdetailEditForm> {
        return <Observable<OrderdetailEditForm>> this.find(orderNumber, productCode)
            .pipe(flatMap(orderdetail => {
                let ef: OrderdetailEditForm = new OrderdetailEditForm();
                ef.orderdetail = orderdetail;
                return this.getOrderdetailEdit(ef);
            }))
            ;
    }

    getOrderdetailEdit(ef: OrderdetailEditForm): Observable<OrderdetailEditForm> {
        let oef: Observable<OrderdetailEditForm> = of(ef);
        return oef.pipe(
            tap(ef => console.log('init orderdetailEdit...'))
            // load all orders to be able to select.
            ,flatMap(ef => {
                return this.orderService.query({}).pipe(
                    tap(orders => ef.orders = orders)
                    ,flatMap(x => oef)
                    );
            })
            // load all products to be able to select.
            ,flatMap(ef => {
                return this.productService.query({}).pipe(
                    tap(products => ef.products = products)
                    ,flatMap(x => oef)
                    );
            })
            );
    }

    saveOrderdetailEdit(ef: OrderdetailEditForm): Observable<OrderdetailEditForm> {
        this.setDefaultValuesTo(ef.orderdetail);
        let data: string = JSON.stringify(ef);
    //console.log("data = "+data);
        return this.http.post<OrderdetailEditForm>(UriUtils.url("orderdetails/edit"), data)
            ;
    }

}
