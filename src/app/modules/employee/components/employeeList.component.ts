/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnChanges, OnDestroy, 
         EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { EmployeeFacade } from '../state/employee.facade';
import {
    SERVER_HOST,
    Employee,
    Office,
    Customer,
    EmployeeService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractListComponent } from '../../abstract.list.component';

@Component({
    selector: 'employee-list',
    templateUrl: 'employeeList.component.html'
})
export class EmployeeListComponent extends AbstractListComponent<Employee> implements OnInit, OnDestroy, OnChanges {

    employees: Employee[];
    employee: Employee;
    employeeListTitles: Array<string> = [
        'employeeNumber', 'lastName', 'firstName', 'extension', 'email', 'jobTitle'
    ];
    employeeListLabels: any = {
        employeeNumber: 'employeeNumber', lastName: 'lastName', firstName: 'firstName', extension: 'extension', email: 'email', jobTitle: 'jobTitle'
    };
    employeeListColumns: Array<string | any> = [
        'employeeNumber', 'lastName', 'firstName', 'extension', 'email', 'jobTitle'
    ];

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private employeeFacade: EmployeeFacade
    ) {
        super();

        employeeFacade.employeeList$.pipe(
                takeWhile(() => this.isAlived),
                filter(employees => !!employees && employees.length > 0),
                distinctUntilChanged()
            )
            .subscribe(employees => this.employees = employees);

        this.employeeFacade.selectedEmployeeInEmployeeList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(employee => this.employee = employee)
            ;

        employeeFacade.hasMoreEmployeeList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(hasMore => this.hasMoreRows = hasMore)
            ;
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.initLoadByParams(this.route);
    }

    createFilterToEmbeddedTasks(employee: Employee) {
        this.employeeFacade.selectedEmployeeInEmployeeList(employee);
    }

    protected setConditionsToObserver(conditions: any): void {
        this.employeeFacade.getEmployeeList(conditions);
    }

    /**
    * this row just selected for edit task or for embedded tasks.
    */
    rowSelected(employee: Employee) : void {
        this.createFilterToEmbeddedTasks(employee);
    }

    /**
     * @params: employee
     */
    onClickToSpecificRow(employee) {
        this.rowSelected(employee);
    }

}

