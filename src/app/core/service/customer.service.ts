/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { Customer } from '../model/customer.model';
import { Employee } from '../model/employee.model';
import { Order } from '../model/order.model';
import { Payment } from '../model/payment.model';
import { CustomerEditForm } from '../model/tasks/customerEdit.form';

import { EmployeeService } from './employee.service';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';

import { ArrayUtils } from '../utils/array.utils';
import { Env } from '../utils/env';
import { ErrorUtils } from '../utils/error.utils';
import { UriUtils } from '../utils/uri.utils';

// urls for model: create or update.
const saveUrl: string = "customers/save";

// urls for primary-key
const findUrl: string = "customers/find";
const destroyUrl: string = "customers/destroy";

// urls for conditions.
const countUrl: string = "customers/count";
const queryUrl: string = "customers/query";
const updateUrl: string = "customers/update";
const deleteUrl: string = "customers/delete";

@Injectable()
export class CustomerService {

    constructor (protected http: HttpClient) {}

    protected setDefaultValuesTo(customer: Customer) {
    }

    // methods for model Customer -----------------------------------------------

    create(customer: Customer): Observable<Customer> {
        return this.save(customer);
    }

    updateRow(customer: Customer): Observable<Customer> {
        return this.save(customer);
    }

    save(customer: Customer): Observable<Customer> {
        this.setDefaultValuesTo(customer);
        return this.http.post<Customer>(UriUtils.url(saveUrl), JSON.stringify(customer))
            ;
    }

    // methods for primary key -----------------------------------------------

    find(customerNumber: number): Observable<Customer> {
        let rest: string = '/' + customerNumber
        return this.http.get<Customer>(UriUtils.url(findUrl + rest))
            .pipe(map(row => new Customer(row)))
            ;
    }

    destroy(customerNumber: number): Observable<any> {
        let rest: string = '/' + customerNumber
        return this.http.delete(UriUtils.url(destroyUrl + rest))
            ;
    }

    // methods for conditions -----------------------------------------------

    count(params: any): Observable<number> {
        return this.http.get<{count: number}>(UriUtils.toUrlParams(countUrl, params))
            .pipe(map(resp => resp.count))
            ;
    }

    query(params: any): Observable<Customer[]> {
        return this.http.get<Customer[]>(UriUtils.toUrlParams(queryUrl, params))
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

    getCustomerList(params: any): Observable<Array<Customer>> {
        let url = UriUtils.toUrlParams('customers/list', params);
        return this.http.get<Customer[]>(url)
            .pipe(map(customers => customers.map(customer => new Customer(customer))))
            ;
    }

    getCustomerListCount(params: any): Observable<number> {
        let url = UriUtils.toUrlParams('customers/list/count', params);
        return this.http.get<{count: number}>(url)
            .pipe(map(resp => resp.count))
            ;
    }

    getCustomerPaymentStatistic(params: any): Observable<Array<Customer>> {
        let url = UriUtils.toUrlParams('customers/statistics', params);
        return this.http.get<Customer[]>(url)
            .pipe(map(customers => customers.map(customer => new Customer(customer))))
            ;
    }

    getCustomerShow(customerNumber: number): Observable<Customer> {
        let url = UriUtils.url('customers/show/' + customerNumber);
        return this.http.get<Customer>(url)
            .pipe(map(json => new Customer(json)))
            ;
    }

    getNewCustomerEdit(): Observable<CustomerEditForm> {
        let ef: CustomerEditForm = new CustomerEditForm();
        ef.customer = new Customer();
        return this.getCustomerEdit(ef);
    }

    getCustomerEditBy(customerNumber: number): Observable<CustomerEditForm> {
        return <Observable<CustomerEditForm>> this.find(customerNumber)
            .pipe(flatMap(customer => {
                let ef: CustomerEditForm = new CustomerEditForm();
                ef.customer = customer;
                return this.getCustomerEdit(ef);
            }))
            ;
    }

    getCustomerEdit(ef: CustomerEditForm): Observable<CustomerEditForm> {
        let oef: Observable<CustomerEditForm> = of(ef);
        return oef.pipe(
            tap(ef => console.log('init customerEdit...'))
            );
    }

    saveCustomerEdit(ef: CustomerEditForm): Observable<CustomerEditForm> {
        this.setDefaultValuesTo(ef.customer);
        let data: string = JSON.stringify(ef);
    //console.log("data = "+data);
        return this.http.post<CustomerEditForm>(UriUtils.url("customers/edit"), data)
            ;
    }

}
