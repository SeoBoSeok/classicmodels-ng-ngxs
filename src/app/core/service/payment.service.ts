/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { Payment } from '../model/payment.model';
import { Customer } from '../model/customer.model';
import { PaymentEditForm } from '../model/tasks/paymentEdit.form';

import { CustomerService } from './customer.service';

import { ArrayUtils } from '../utils/array.utils';
import { Env } from '../utils/env';
import { ErrorUtils } from '../utils/error.utils';
import { UriUtils } from '../utils/uri.utils';

// urls for model: create or update.
const saveUrl: string = "payments/save";

// urls for primary-key
const findUrl: string = "payments/find";
const destroyUrl: string = "payments/destroy";

// urls for conditions.
const countUrl: string = "payments/count";
const queryUrl: string = "payments/query";
const updateUrl: string = "payments/update";
const deleteUrl: string = "payments/delete";

@Injectable()
export class PaymentService {

    constructor (
        protected customerService: CustomerService,
        protected http: HttpClient) {
    }

    protected setDefaultValuesTo(payment: Payment) {
    }

    // methods for model Payment -----------------------------------------------

    create(payment: Payment): Observable<Payment> {
        return this.save(payment);
    }

    updateRow(payment: Payment): Observable<Payment> {
        return this.save(payment);
    }

    save(payment: Payment): Observable<Payment> {
        this.setDefaultValuesTo(payment);
        return this.http.post<Payment>(UriUtils.url(saveUrl), JSON.stringify(payment))
            ;
    }

    // methods for primary key -----------------------------------------------

    find(customerNumber: number, checkNumber: string): Observable<Payment> {
        let rest: string = '/' + customerNumber+ '/' +checkNumber
        return this.http.get<Payment>(UriUtils.url(findUrl + rest))
            .pipe(map(row => new Payment(row)))
            ;
    }

    destroy(customerNumber: number, checkNumber: string): Observable<any> {
        let rest: string = '/' + customerNumber+ '/' +checkNumber
        return this.http.delete(UriUtils.url(destroyUrl + rest))
            ;
    }

    // methods for conditions -----------------------------------------------

    count(params: any): Observable<number> {
        return this.http.get<{count: number}>(UriUtils.toUrlParams(countUrl, params))
            .pipe(map(resp => resp.count))
            ;
    }

    query(params: any): Observable<Payment[]> {
        return this.http.get<Payment[]>(UriUtils.toUrlParams(queryUrl, params))
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

    getPaymentList(params: any): Observable<Array<Payment>> {
        let url = UriUtils.toUrlParams('payments/list', params);
        return this.http.get<Payment[]>(url)
            .pipe(map(payments => payments.map(payment => new Payment(payment))))
            ;
    }

    getPaymentListCount(params: any): Observable<number> {
        let url = UriUtils.toUrlParams('payments/list/count', params);
        return this.http.get<{count: number}>(url)
            .pipe(map(resp => resp.count))
            ;
    }

    getPaymentShow(customerNumber: number, checkNumber: string): Observable<Payment> {
        let url = UriUtils.url('payments/show/' + customerNumber+'/'+checkNumber);
        return this.http.get<Payment>(url)
            .pipe(map(json => new Payment(json)))
            ;
    }

    getNewPaymentEdit(): Observable<PaymentEditForm> {
        let ef: PaymentEditForm = new PaymentEditForm();
        ef.payment = new Payment();
        return this.getPaymentEdit(ef);
    }

    getPaymentEditBy(customerNumber: number, checkNumber: string): Observable<PaymentEditForm> {
        return <Observable<PaymentEditForm>> this.find(customerNumber, checkNumber)
            .pipe(flatMap(payment => {
                let ef: PaymentEditForm = new PaymentEditForm();
                ef.payment = payment;
                return this.getPaymentEdit(ef);
            }))
            ;
    }

    getPaymentEdit(ef: PaymentEditForm): Observable<PaymentEditForm> {
        let oef: Observable<PaymentEditForm> = of(ef);
        return oef.pipe(
            tap(ef => console.log('init paymentEdit...'))
            // load all customers to be able to select.
            ,flatMap(ef => {
                return this.customerService.query({}).pipe(
                    tap(customers => ef.customers = customers)
                    ,flatMap(x => oef)
                    );
            })
            );
    }

    savePaymentEdit(ef: PaymentEditForm): Observable<PaymentEditForm> {
        this.setDefaultValuesTo(ef.payment);
        let data: string = JSON.stringify(ef);
    //console.log("data = "+data);
        return this.http.post<PaymentEditForm>(UriUtils.url("payments/edit"), data)
            ;
    }

}
