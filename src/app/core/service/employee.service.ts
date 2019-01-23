/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { map, flatMap, last, tap } from 'rxjs/operators';

import { Employee } from '../model/employee.model';
import { Office } from '../model/office.model';
import { Customer } from '../model/customer.model';
import { EmployeeEditForm } from '../model/tasks/employeeEdit.form';

import { OfficeService } from './office.service';
import { CustomerService } from './customer.service';

import { ArrayUtils } from '../utils/array.utils';
import { Env } from '../utils/env';
import { ErrorUtils } from '../utils/error.utils';
import { UriUtils } from '../utils/uri.utils';

// urls for model: create or update.
const saveUrl: string = "employees/save";

// urls for primary-key
const findUrl: string = "employees/find";
const destroyUrl: string = "employees/destroy";

// urls for conditions.
const countUrl: string = "employees/count";
const queryUrl: string = "employees/query";
const updateUrl: string = "employees/update";
const deleteUrl: string = "employees/delete";

@Injectable()
export class EmployeeService {

    constructor (
        protected officeService: OfficeService,
        protected http: HttpClient) {
    }

    protected setDefaultValuesTo(employee: Employee) {
    }

    // methods for model Employee -----------------------------------------------

    create(employee: Employee): Observable<Employee> {
        return this.save(employee);
    }

    updateRow(employee: Employee): Observable<Employee> {
        return this.save(employee);
    }

    save(employee: Employee): Observable<Employee> {
        this.setDefaultValuesTo(employee);
        return this.http.post<Employee>(UriUtils.url(saveUrl), JSON.stringify(employee))
            ;
    }

    // methods for primary key -----------------------------------------------

    find(employeeNumber: number): Observable<Employee> {
        let rest: string = '/' + employeeNumber
        return this.http.get<Employee>(UriUtils.url(findUrl + rest))
            .pipe(map(row => new Employee(row)))
            ;
    }

    destroy(employeeNumber: number): Observable<any> {
        let rest: string = '/' + employeeNumber
        return this.http.delete(UriUtils.url(destroyUrl + rest))
            ;
    }

    // methods for conditions -----------------------------------------------

    count(params: any): Observable<number> {
        return this.http.get<{count: number}>(UriUtils.toUrlParams(countUrl, params))
            .pipe(map(resp => resp.count))
            ;
    }

    query(params: any): Observable<Employee[]> {
        return this.http.get<Employee[]>(UriUtils.toUrlParams(queryUrl, params))
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

    getEmployeeList(params: any): Observable<Array<Employee>> {
        let url = UriUtils.toUrlParams('employees/list', params);
        return this.http.get<Employee[]>(url)
            .pipe(map(employees => employees.map(employee => new Employee(employee))))
            ;
    }

    getEmployeeListCount(params: any): Observable<number> {
        let url = UriUtils.toUrlParams('employees/list/count', params);
        return this.http.get<{count: number}>(url)
            .pipe(map(resp => resp.count))
            ;
    }

    getEmployeeShow(employeeNumber: number): Observable<Employee> {
        let url = UriUtils.url('employees/show/' + employeeNumber);
        return this.http.get<Employee>(url)
            .pipe(map(json => new Employee(json)))
            ;
    }

    getNewEmployeeEdit(): Observable<EmployeeEditForm> {
        let ef: EmployeeEditForm = new EmployeeEditForm();
        ef.employee = new Employee();
        return this.getEmployeeEdit(ef);
    }

    getEmployeeEditBy(employeeNumber: number): Observable<EmployeeEditForm> {
        return <Observable<EmployeeEditForm>> this.find(employeeNumber)
            .pipe(flatMap(employee => {
                let ef: EmployeeEditForm = new EmployeeEditForm();
                ef.employee = employee;
                return this.getEmployeeEdit(ef);
            }))
            ;
    }

    getEmployeeEdit(ef: EmployeeEditForm): Observable<EmployeeEditForm> {
        let oef: Observable<EmployeeEditForm> = of(ef);
        return oef.pipe(
            tap(ef => console.log('init employeeEdit...'))
            // load all offices to be able to select.
            ,flatMap(ef => {
                return this.officeService.query({}).pipe(
                    tap(offices => ef.offices = offices)
                    ,flatMap(x => oef)
                    );
            })
            );
    }

    saveEmployeeEdit(ef: EmployeeEditForm): Observable<EmployeeEditForm> {
        this.setDefaultValuesTo(ef.employee);
        let data: string = JSON.stringify(ef);
    //console.log("data = "+data);
        return this.http.post<EmployeeEditForm>(UriUtils.url("employees/edit"), data)
            ;
    }

}
