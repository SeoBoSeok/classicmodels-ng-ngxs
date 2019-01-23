/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

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
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
  selector: 'payment-show',
  templateUrl: 'paymentShow.component.table.html',
  styleUrls: ['./datashow.css']
})
export class PaymentShowComponent extends AbstractTaskComponent<Payment> implements OnInit, OnDestroy {

    @Input() customerNumber: number;
    @Input() checkNumber: string;
    @Input() payment: Payment;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private paymentFacade: PaymentFacade
    ) {
        super();

        paymentFacade.paymentShow$
            .pipe(
                takeWhile(() => this.isAlived),
                filter(payment => !!payment),
                distinctUntilChanged(),
                tap(payment => console.log('payment loaded.', payment))
            )
            .subscribe(payment => this.payment = payment);
    }

    ngOnInit() {
        if (this.payment) {
        } else {
            if (this.customerNumber && this.checkNumber) {
                this.loadBy(this.customerNumber, this.checkNumber);
            } else {
                this.route.params.subscribe(params => {
                    this.customerNumber = +params['customerNumber'];
                    this.checkNumber = params['checkNumber'];
                    if (this.customerNumber && this.checkNumber) {
                        this.loadBy(this.customerNumber, this.checkNumber);
                    }
                });
            }
        }
    }

    loadBy(customerNumber: number, checkNumber: string) {
        this.paymentFacade
            .getPaymentShow({customerNumber, checkNumber})
                ;
    }

}

