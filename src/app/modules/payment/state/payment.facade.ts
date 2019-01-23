/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { 
    Payment, PaymentService,
    PaymentEditForm,
    HttpFacade,
    CoreModule
} from '../../../core';

const NUM_ROWS = 10;

@Injectable()
export class PaymentFacade {
    createdPayment$ = new Subject<Payment>();
    payment$ = new Subject<Payment>();	// result of find
    payments$ = new Subject<Array<Payment>>();	// result of query

    updateSuccess$ = new Subject<string>();
    updateFailure$ = new Subject<string>();
    destroySuccess$ = new Subject<string>();
    destroyFailure$ = new Subject<string>();

    paymentList$ = new Subject<Array<Payment>>();
    paymentListError$ = new Subject<string>();
    paymentList = [];
    hasMorePaymentList$ = new Subject<boolean>();
    paymentShow$ = new Subject<Payment>();

    initPaymentEditForm$ = new Subject<PaymentEditForm>();
    loadPaymentEditForm$ = new Subject<PaymentEditForm>();
    savePaymentEditForm$ = new Subject<PaymentEditForm>();

    initPaymentEditFail$ = new Subject<string>();
    loadPaymentEditFail$ = new Subject<string>();
    savePaymentEditFail$ = new Subject<string>();

    constructor(private paymentService: PaymentService, private httpFacade: HttpFacade) {}

    create(row: Payment) {
        this.paymentService.create(row)
            .subscribe(
                res => this.createdPayment$.next(res),
                err => console.log("Error on create Payment: ", err)
            );
    }

    find(conditions: any) {
        this.paymentService.find(conditions.customerNumber, conditions.checkNumber)
            .subscribe(
                res => this.payment$.next(res),
                err => console.log("Error on find Payment: ", err)
            );
    }

    query(conditions: any) {
        this.paymentService.query(conditions)
            .subscribe(
                res => this.payments$.next(res),
                err => console.log("Error on query Payment: ", err)
            );
    }

    update(columns: any, conditions: any) {
        this.paymentService.update(columns, conditions)
            .subscribe(
                res => this.updateSuccess$.next(res),
                err => this.updateFailure$.next(err)
            );
    }

    destroy(conditions: any) {
        this.paymentService.delete(conditions)
            .subscribe(
                res => this.destroySuccess$.next(res),
                err => this.destroyFailure$.next(err)
            );
    }

    getPaymentList(conditions: any) {
        const pageSize: number = conditions["num-rows"] || NUM_ROWS;
        const pageNo = conditions['page-no'];
        this.paymentService.getPaymentList(conditions)
            .subscribe(
                rows => {
                    if (!pageNo || pageNo === 1) {
                        this.paymentList = [...rows];
                    } else {
                        this.paymentList = [...this.paymentList, ...rows];
                    }
                    this.paymentList$.next(this.paymentList);
                    this.hasMorePaymentList$.next((rows.length >= pageSize));
                },
                err => {
                    console.log("Error on PaymentList: ", err);
                    this.paymentListError$.next(JSON.stringify(err));
                }
            );
    }

    getPaymentShow(conditions: any) {
        this.paymentService.getPaymentShow(conditions.customerNumber, conditions.checkNumber)
            .subscribe(
                res => this.paymentShow$.next(res),
                err => console.log("Error on PaymentShow: ", err)
            );
    }

    initPaymentEdit(ef?: PaymentEditForm) {
        this.paymentService.getNewPaymentEdit()
            .subscribe(
                res => this.initPaymentEditForm$.next(res),
                err => this.initPaymentEditFail$.next(JSON.stringify(err))
            );
    }
    initPaymentEditByEditForm(ef: PaymentEditForm) {
        this.paymentService.getPaymentEdit(ef)
            .subscribe(
                res => this.initPaymentEditForm$.next(res),
                err => this.initPaymentEditFail$.next(JSON.stringify(err))
            );
    }
    getPaymentEdit(conditions: any) {
        this.paymentService.getPaymentEditBy(conditions.customerNumber, conditions.checkNumber)
            .subscribe(
                res => this.loadPaymentEditForm$.next(res),
                err => this.loadPaymentEditFail$.next(JSON.stringify(err))
            );
    }
    savePaymentEdit(ef: PaymentEditForm) {
        this.paymentService.savePaymentEdit(ef)
            .subscribe(
                res => this.savePaymentEditForm$.next(res),
                err => this.savePaymentEditFail$.next(JSON.stringify(err))
            );
    }

    newPaymentAdded() {
        // FIXME: //this.store.dispatch(new paymentActions.NewPaymentAddedAction());
    }
}
