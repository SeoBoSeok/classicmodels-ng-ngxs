/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { Order } from '../model/order.model';
import { Customer } from '../model/customer.model';
import { Orderdetail } from '../model/orderdetail.model';
import { OrderEditForm } from '../model/tasks/orderEdit.form';

import { CustomerService } from './customer.service';
import { OrderdetailService } from './orderdetail.service';

import { ArrayUtils } from '../utils/array.utils';
import { Env } from '../utils/env';
import { ErrorUtils } from '../utils/error.utils';
import { UriUtils } from '../utils/uri.utils';

// urls for model: create or update.
const saveUrl: string = "orders/save";

// urls for primary-key
const findUrl: string = "orders/find";
const destroyUrl: string = "orders/destroy";

// urls for conditions.
const countUrl: string = "orders/count";
const queryUrl: string = "orders/query";
const updateUrl: string = "orders/update";
const deleteUrl: string = "orders/delete";

@Injectable()
export class OrderService {

    constructor (
        protected customerService: CustomerService,
        protected http: HttpClient) {
    }

    protected setDefaultValuesTo(order: Order) {
    }

    // methods for model Order -----------------------------------------------

    create(order: Order): Observable<Order> {
        return this.save(order);
    }

    updateRow(order: Order): Observable<Order> {
        return this.save(order);
    }

    save(order: Order): Observable<Order> {
        this.setDefaultValuesTo(order);
        return this.http.post<Order>(UriUtils.url(saveUrl), JSON.stringify(order))
            ;
    }

    // methods for primary key -----------------------------------------------

    find(orderNumber: number): Observable<Order> {
        let rest: string = '/' + orderNumber
        return this.http.get<Order>(UriUtils.url(findUrl + rest))
            .pipe(map(row => new Order(row)))
            ;
    }

    destroy(orderNumber: number): Observable<any> {
        let rest: string = '/' + orderNumber
        return this.http.delete(UriUtils.url(destroyUrl + rest))
            ;
    }

    // methods for conditions -----------------------------------------------

    count(params: any): Observable<number> {
        return this.http.get<{count: number}>(UriUtils.toUrlParams(countUrl, params))
            .pipe(map(resp => resp.count))
            ;
    }

    query(params: any): Observable<Order[]> {
        return this.http.get<Order[]>(UriUtils.toUrlParams(queryUrl, params))
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

    getOrderList(params: any): Observable<Array<Order>> {
        let url = UriUtils.toUrlParams('orders/list', params);
        return this.http.get<Order[]>(url)
            .pipe(map(orders => orders.map(order => new Order(order))))
            ;
    }

    getOrderListCount(params: any): Observable<number> {
        let url = UriUtils.toUrlParams('orders/list/count', params);
        return this.http.get<{count: number}>(url)
            .pipe(map(resp => resp.count))
            ;
    }

    getOrderShow(orderNumber: number): Observable<Order> {
        let url = UriUtils.url('orders/show/' + orderNumber);
        return this.http.get<Order>(url)
            .pipe(map(json => new Order(json)))
            ;
    }

    getNewOrderEdit(): Observable<OrderEditForm> {
        let ef: OrderEditForm = new OrderEditForm();
        ef.order = new Order();
        return this.getOrderEdit(ef);
    }

    getOrderEditBy(orderNumber: number): Observable<OrderEditForm> {
        return <Observable<OrderEditForm>> this.find(orderNumber)
            .pipe(flatMap(order => {
                let ef: OrderEditForm = new OrderEditForm();
                ef.order = order;
                return this.getOrderEdit(ef);
            }))
            ;
    }

    getOrderEdit(ef: OrderEditForm): Observable<OrderEditForm> {
        let oef: Observable<OrderEditForm> = of(ef);
        return oef.pipe(
            tap(ef => console.log('init orderEdit...'))
            // load all customers to be able to select.
            ,flatMap(ef => {
                return this.customerService.query({}).pipe(
                    tap(customers => ef.customers = customers)
                    ,flatMap(x => oef)
                    );
            })
            );
    }

    saveOrderEdit(ef: OrderEditForm): Observable<OrderEditForm> {
        this.setDefaultValuesTo(ef.order);
        let data: string = JSON.stringify(ef);
    //console.log("data = "+data);
        return this.http.post<OrderEditForm>(UriUtils.url("orders/edit"), data)
            ;
    }

}
