/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { PaymentFacade } from '../state/payment.facade';
import {
    SERVER_HOST,
    Payment,
    Customer,
    PaymentService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractListComponent } from '../../abstract.list.component';

@Component({
    selector: 'payment-list',
    templateUrl: 'paymentList.component.html'
})
export class PaymentListComponent extends AbstractListComponent<Payment> implements OnInit, OnDestroy {

    payments: Payment[];
    payment: Payment;
    paymentListTitles: Array<string> = [
        'checkNumber', 'paymentDate', 'amount'
    ];
    paymentListLabels: any = {
        checkNumber: 'checkNumber', paymentDate: 'paymentDate', amount: 'amount'
    };
    paymentListColumns: Array<string | any> = [
        'checkNumber', {name: 'paymentDate', type: 'date-type'}, 'amount'
    ];

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private paymentFacade: PaymentFacade
    ) {
        super();

        paymentFacade.paymentList$.pipe(
                takeWhile(() => this.isAlived),
                filter(payments => !!payments && payments.length > 0),
                distinctUntilChanged()
            )
            .subscribe(payments => this.payments = payments);

        paymentFacade.hasMorePaymentList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(hasMore => this.hasMoreRows = hasMore)
            ;
    }

    ngOnInit() {
        this.initLoadByParams(this.route);
    }

    protected setConditionsToObserver(conditions: any): void {
        this.paymentFacade.getPaymentList(conditions);
    }

    /**
    * this row just selected for edit task or for embedded tasks.
    */
    rowSelected(payment: Payment) : void {
        this.router.navigate(['payments/show', {customerNumber: payment.customerNumber, checkNumber: payment.checkNumber}]);
    }
    buttonsToEachRows(): Array<string> | undefined {
        const arr: Array<string> = [];
        if (this.isShowable()) {
            arr.push('Show');
        }
        if (this.isEditable()) {
            arr.push('Edit');
            arr.push('Delete');
        }
        return arr.length === 0 ? undefined : arr;
    }

    /**
     * @params: payment
     */
    onClickToSpecificRow(payment) {
        this.rowSelected(payment);
    }

    /**
     * params: {row: payment, button: string}
     */
    onClickButtonToRow(params) {
        const payment = params.row;
        const button = params.button;
        if ('Show' === button) {
            this.router.navigate(['payments/show', {customerNumber: payment.customerNumber, checkNumber: payment.checkNumber}]);
        }
        else if ('Edit' === button) {
            this.router.navigate(['payments/edit', {customerNumber: payment.customerNumber, checkNumber: payment.checkNumber}]);
        }
        else if ('Delete' === button) {
            this.destroy(payment);
        }
    }

    isShowable() : boolean {
        return this.isNotEmbedded();
    }

    isEditable() : boolean  {
        return this.isNotEmbedded();
    }

    isDeletable() : boolean  {
        return this.isEditable();
    }

    destroy(payment:Payment): void {
        let answer = confirm("CAUTION: Are you sure to delete this payment?");
        if (answer != true) {
            return;
        }
        this.paymentFacade.destroy({customerNumber: payment.customerNumber,checkNumber: payment.checkNumber});
        this.paymentFacade.destroySuccess$
            .pipe(take(1))
            .subscribe(json => {
                console.log('destroy result: '+JSON.stringify(json));
                this.filtering(null);
            });
        this.paymentFacade.destroyFailure$
            .pipe(take(1))
            .subscribe(err => this.showError(err));
    }

}

