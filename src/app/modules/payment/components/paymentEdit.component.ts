/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { PaymentFacade } from '../state/payment.facade';
import {
    SERVER_HOST,
    Env,
    UPLOAD_URL,
    Payment,
    Customer,
    PaymentEditForm,
    UploadService,
    PaymentService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
    selector: 'payment-edit',
    templateUrl: 'paymentEdit.component.html',
    styleUrls: ['paymentEdit.css']
})
export class PaymentEditComponent extends AbstractTaskComponent<Payment> implements OnInit, OnDestroy {

    ef: PaymentEditForm;
    percentToUploaded: number = 0;

    @Input() customerNumber: number;
    @Input() checkNumber: string;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private uploadService: UploadService,
        private paymentFacade: PaymentFacade
    ) {
        super();

        paymentFacade.initPaymentEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(
                ef => this.setEditForm(ef),
                err=> this.showError(err)
            );

        paymentFacade.loadPaymentEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => this.ef = ef)
            ;

        paymentFacade.payment$.pipe(
            takeWhile(() => this.isAlived)
            ,map(payment => {
                const ef: PaymentEditForm = new PaymentEditForm();
                ef.payment = payment;
                return ef;
            })
            ).subscribe(
                ef => this.paymentFacade.initPaymentEditByEditForm(ef),
                err=> this.showError(err)
            );

        paymentFacade.savePaymentEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(ef => {
                if (ef.errors && !ArrayUtils.isEmpty(ef.errors)) {
                    console.log('validation fail: '+JSON.stringify(ef.errors));
                    this.ef = ef;
                } else {
                    const payment = ef.payment;
                    this.router.navigate(["payments/list"])
                }
            }, err => alert('Error: ' + err))
            ;

        paymentFacade.loadPaymentEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

        paymentFacade.savePaymentEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

    }

    ngOnInit() {
        this.initLoadByParams();
    }

    protected initForNewEdit() {
        const ef: PaymentEditForm = new PaymentEditForm();
        ef.payment = new Payment();
        this.paymentFacade.initPaymentEditByEditForm(ef);
    }

    protected initLoadByParams() {
        let ef: PaymentEditForm = new PaymentEditForm();
        // for arguments with attributes in tag.
        if (this.customerNumber && this.checkNumber) {
            this.paymentFacade.find({customerNumber: this.customerNumber, checkNumber: this.checkNumber});
            return;
        }
        // for arguments with url
        this.route.params.subscribe(params => {
            let customerNumber = +params['customerNumber'];
            let checkNumber = params['checkNumber'];
            if (customerNumber && checkNumber) {
                this.paymentFacade.find({customerNumber: customerNumber, checkNumber: checkNumber});

                return;
            }
            ef.payment = new Payment();
            this.paymentFacade.initPaymentEditByEditForm(ef);
        });
    }

    get selectedCustomer() {
        return this.ef.payment.customer;
    }

    set selectedCustomer(customer: Customer) {
        this.ef.payment.customer = customer;
        this.ef.payment.customerNumber = customer.customerNumber
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
        this.ef.checkNumber = this.checkNumber;
        this.paymentFacade.savePaymentEdit(this.ef);
    }

    protected setEditForm(ef: PaymentEditForm): void {
        const ef2 = Object.assign({}, ef);
        ef2.payment = new Payment(ef.payment);
        this.ef = ef2;
    }

}

