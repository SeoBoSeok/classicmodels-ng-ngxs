/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnChanges, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

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
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
  selector: 'employee-show',
  templateUrl: 'employeeShow.component.table.html',
  styleUrls: ['./datashow.css']
})
export class EmployeeShowComponent extends AbstractTaskComponent<Employee> implements OnInit, OnDestroy, OnChanges {

    @Input() employeeNumber: number;
    @Input() employee: Employee;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private employeeFacade: EmployeeFacade
    ) {
        super();

        employeeFacade.employeeShow$
            .pipe(
                takeWhile(() => this.isAlived),
                filter(employee => !!employee),
                distinctUntilChanged(),
                tap(employee => console.log('employee loaded.', employee))
            )
            .subscribe(employee => this.employee = employee);
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.employee) {
        } else {
            if (this.employeeNumber) {
                this.loadBy(this.employeeNumber);
            } else {
                this.route.params.subscribe(params => {
                    this.employeeNumber = +params['employeeNumber'];
                    if (this.employeeNumber) {
                        this.loadBy(this.employeeNumber);
                    }
                });
            }
        }
    }

    loadBy(employeeNumber: number) {
        this.employeeFacade
            .getEmployeeShow({employeeNumber})
                ;
    }

}

