/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { CustomerFacade } from '../state/customer.facade';
import {
    SERVER_HOST,
    Env,
    UPLOAD_URL,
    Customer,
    Employee,
    Order,
    Payment,
    CustomerEditForm,
    UploadService,
    CustomerService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
    selector: 'customer-edit',
    templateUrl: 'customerEdit.component.html',
    styleUrls: ['customerEdit.css']
})
export class CustomerEditComponent extends AbstractTaskComponent<Customer> implements OnInit, OnDestroy {

    ef: CustomerEditForm;
    percentToUploaded: number = 0;

    @Input() customerNumber: number;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private uploadService: UploadService,
        private customerFacade: CustomerFacade
    ) {
        super();

        customerFacade.initCustomerEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(
                ef => this.setEditForm(ef),
                err=> this.showError(err)
            );

        customerFacade.loadCustomerEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => this.ef = ef)
            ;

        customerFacade.customer$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ,map(customer => {
                const ef: CustomerEditForm = new CustomerEditForm();
                ef.customer = customer;
                return ef;
            })
            ).subscribe(
                ef => this.customerFacade.initCustomerEditByEditForm(ef),
                err=> this.showError(err)
            );

        customerFacade.saveCustomerEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => {
                if (ef.errors && !ArrayUtils.isEmpty(ef.errors)) {
                    console.log('validation fail: '+JSON.stringify(ef.errors));
                    this.ef = ef;
                } else {
                    const customer = ef.customer;
                    this.router.navigate(["customers/list"])
                }
            }, err => alert('Error: ' + err))
            ;

        customerFacade.loadCustomerEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(err => this.showError(err))
            ;

        customerFacade.saveCustomerEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(err => this.showError(err))
            ;

    }

    ngOnInit() {
        this.initLoadByParams();
    }

    protected initForNewEdit() {
        const ef: CustomerEditForm = new CustomerEditForm();
        ef.customer = new Customer();
        this.customerFacade.initCustomerEditByEditForm(ef);
    }

    protected initLoadByParams() {
        let ef: CustomerEditForm = new CustomerEditForm();
        // for arguments with attributes in tag.
        if (this.customerNumber) {
            this.customerFacade.find({customerNumber: this.customerNumber});
            return;
        }
        // for arguments with url
        this.route.params.subscribe(params => {
            let customerNumber = +params['customerNumber'];
            if (customerNumber) {
                this.customerFacade.find({customerNumber: customerNumber});

                return;
            }
            ef.customer = new Customer();
            this.setEditForm(ef);
        });
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
        this.ef.customerNumber = this.customerNumber;
        this.customerFacade.saveCustomerEdit(this.ef);
    }

    protected setEditForm(ef: CustomerEditForm): void {
        const ef2 = Object.assign({}, ef);
        ef2.customer = new Customer(ef.customer);
        this.ef = ef2;
    }

}

