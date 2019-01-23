/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { 
    Employee, EmployeeService,
    EmployeeEditForm,
    HttpFacade,
    CoreModule
} from '../../../core';

const NUM_ROWS = 10;

@Injectable()
export class EmployeeFacade {
    createdEmployee$ = new Subject<Employee>();
    employee$ = new Subject<Employee>();	// result of find
    employees$ = new Subject<Array<Employee>>();	// result of query

    updateSuccess$ = new Subject<string>();
    updateFailure$ = new Subject<string>();

    employeeList$ = new Subject<Array<Employee>>();
    employeeListError$ = new Subject<string>();
    employeeList = [];
    hasMoreEmployeeList$ = new Subject<boolean>();
    selectedEmployeeInEmployeeList$ = new Subject<Employee>();
    employeeShow$ = new Subject<Employee>();

    initEmployeeEditForm$ = new Subject<EmployeeEditForm>();
    loadEmployeeEditForm$ = new Subject<EmployeeEditForm>();
    saveEmployeeEditForm$ = new Subject<EmployeeEditForm>();

    initEmployeeEditFail$ = new Subject<string>();
    loadEmployeeEditFail$ = new Subject<string>();
    saveEmployeeEditFail$ = new Subject<string>();

    constructor(private employeeService: EmployeeService, private httpFacade: HttpFacade) {}

    create(row: Employee) {
        this.employeeService.create(row)
            .subscribe(
                res => this.createdEmployee$.next(res),
                err => console.log("Error on create Employee: ", err)
            );
    }

    find(conditions: any) {
        this.employeeService.find(conditions.employeeNumber)
            .subscribe(
                res => this.employee$.next(res),
                err => console.log("Error on find Employee: ", err)
            );
    }

    query(conditions: any) {
        this.employeeService.query(conditions)
            .subscribe(
                res => this.employees$.next(res),
                err => console.log("Error on query Employee: ", err)
            );
    }

    update(columns: any, conditions: any) {
        this.employeeService.update(columns, conditions)
            .subscribe(
                res => this.updateSuccess$.next(res),
                err => this.updateFailure$.next(err)
            );
    }

    getEmployeeList(conditions: any) {
        const pageSize: number = conditions["num-rows"] || NUM_ROWS;
        const pageNo = conditions['page-no'];
        this.employeeService.getEmployeeList(conditions)
            .subscribe(
                rows => {
                    if (!pageNo || pageNo === 1) {
                        this.employeeList = [...rows];
                    } else {
                        this.employeeList = [...this.employeeList, ...rows];
                    }
                    this.employeeList$.next(this.employeeList);
                    this.hasMoreEmployeeList$.next((rows.length >= pageSize));
                },
                err => {
                    console.log("Error on EmployeeList: ", err);
                    this.employeeListError$.next(JSON.stringify(err));
                }
            );
    }
    selectedEmployeeInEmployeeList(employee: Employee) {
        this.selectedEmployeeInEmployeeList$.next(employee);
    }

    getEmployeeShow(conditions: any) {
        this.employeeService.getEmployeeShow(conditions.employeeNumber)
            .subscribe(
                res => this.employeeShow$.next(res),
                err => console.log("Error on EmployeeShow: ", err)
            );
    }

    initEmployeeEdit(ef?: EmployeeEditForm) {
        this.employeeService.getNewEmployeeEdit()
            .subscribe(
                res => this.initEmployeeEditForm$.next(res),
                err => this.initEmployeeEditFail$.next(JSON.stringify(err))
            );
    }
    initEmployeeEditByEditForm(ef: EmployeeEditForm) {
        this.employeeService.getEmployeeEdit(ef)
            .subscribe(
                res => this.initEmployeeEditForm$.next(res),
                err => this.initEmployeeEditFail$.next(JSON.stringify(err))
            );
    }
    getEmployeeEdit(conditions: any) {
        this.employeeService.getEmployeeEditBy(conditions.employeeNumber)
            .subscribe(
                res => this.loadEmployeeEditForm$.next(res),
                err => this.loadEmployeeEditFail$.next(JSON.stringify(err))
            );
    }
    saveEmployeeEdit(ef: EmployeeEditForm) {
        this.employeeService.saveEmployeeEdit(ef)
            .subscribe(
                res => this.saveEmployeeEditForm$.next(res),
                err => this.saveEmployeeEditFail$.next(JSON.stringify(err))
            );
    }

    newEmployeeAdded() {
        // FIXME: //this.store.dispatch(new employeeActions.NewEmployeeAddedAction());
    }
}
