/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { EmployeeFacade } from '../state/employee.facade';
import {
    SERVER_HOST,
    Env,
    UPLOAD_URL,
    Employee,
    Office,
    Customer,
    EmployeeEditForm,
    UploadService,
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
    selector: 'employee-edit',
    templateUrl: 'employeeEdit.component.html',
    styleUrls: ['employeeEdit.css']
})
export class EmployeeEditComponent extends AbstractTaskComponent<Employee> implements OnInit, OnDestroy {

    ef: EmployeeEditForm;
    percentToUploaded: number = 0;

    @Input() employeeNumber: number;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private uploadService: UploadService,
        private employeeFacade: EmployeeFacade
    ) {
        super();

        employeeFacade.initEmployeeEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(
                ef => this.setEditForm(ef),
                err=> this.showError(err)
            );

        employeeFacade.loadEmployeeEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => this.ef = ef)
            ;

        employeeFacade.employee$.pipe(
            takeWhile(() => this.isAlived)
            ,map(employee => {
                const ef: EmployeeEditForm = new EmployeeEditForm();
                ef.employee = employee;
                return ef;
            })
            ).subscribe(
                ef => this.employeeFacade.initEmployeeEditByEditForm(ef),
                err=> this.showError(err)
            );

        employeeFacade.saveEmployeeEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(ef => {
                if (ef.errors && !ArrayUtils.isEmpty(ef.errors)) {
                    console.log('validation fail: '+JSON.stringify(ef.errors));
                    this.ef = ef;
                } else {
                    const employee = ef.employee;
                    this.router.navigate(["employees/list"])
                }
            }, err => alert('Error: ' + err))
            ;

        employeeFacade.loadEmployeeEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

        employeeFacade.saveEmployeeEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

    }

    ngOnInit() {
        this.initLoadByParams();
    }

    protected initForNewEdit() {
        const ef: EmployeeEditForm = new EmployeeEditForm();
        ef.employee = new Employee();
        this.employeeFacade.initEmployeeEditByEditForm(ef);
    }

    protected initLoadByParams() {
        let ef: EmployeeEditForm = new EmployeeEditForm();
        // for arguments with attributes in tag.
        if (this.employeeNumber) {
            this.employeeFacade.find({employeeNumber: this.employeeNumber});
            return;
        }
        // for arguments with url
        this.route.params.subscribe(params => {
            let employeeNumber = +params['employeeNumber'];
            if (employeeNumber) {
                this.employeeFacade.find({employeeNumber: employeeNumber});

                return;
            }
            ef.employee = new Employee();
            this.employeeFacade.initEmployeeEditByEditForm(ef);
        });
    }

    get selectedOffice() {
        return this.ef.employee.office;
    }

    set selectedOffice(office: Office) {
        this.ef.employee.office = office;
        this.ef.employee.officeCode = office.officeCode
    }

    uploadFile(event, callback: (url: string) => void): void {
        this.percentToUploaded = 0;
        this.uploadService.upload(UPLOAD_URL, event.target.files)
            .subscribe(
                res => {
                    if (res.type == HttpEventType.UploadProgress) {
                        this.percentToUploaded = Math.round(100 * res.loaded / res.total);
                    } else if (res instanceof HttpResponse) {
                        console.log('res.body: '+res.body);
                        callback(res.body.url);	//server should return '{"url": "xxx"}'
                    }
                },
                err => {
                    const str = 'Fail to upload: '+err;
                    console.log(str);
                    alert(str);
                }
            );
    }

    onSubmit(): void {
        this.ef.employeeNumber = this.employeeNumber;
        this.employeeFacade.saveEmployeeEdit(this.ef);
    }

    protected setEditForm(ef: EmployeeEditForm): void {
        const ef2 = Object.assign({}, ef);
        ef2.employee = new Employee(ef.employee);
        this.ef = ef2;
    }

}

