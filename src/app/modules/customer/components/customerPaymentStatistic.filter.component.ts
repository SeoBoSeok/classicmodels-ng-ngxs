/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

import { 
    Customer,
    CustomerService,
    ArrayUtils,
    DateUtils,
    StringUtils,
    CoreModule
} from '../../../core';

@Component({
    selector: 'customer-payment-statistics-filter',
    templateUrl: 'customerPaymentStatistic.filter.component.html',
    styleUrls: ['customerPaymentStatistic.filter.css']
})
export class CustomerPaymentStatisticFilterComponent implements OnInit {

    customerNumber: number;
    paymentDateFrom: Date;
    paymentDateTo: Date;

    @Input() params: any;
    @Output() filtering = new EventEmitter();

    constructor () {
    }

    get paymentDate() {
        return this.paymentDateFrom;
    }

    ngOnInit() {
        if (!!this.params) {
            Object.assign(this, this.params);
        }
    }

    onSubmit() {
        const keys: any = {};
        if (this.customerNumber) {
            keys.customerNumber = this.customerNumber;
        }
        if (this.paymentDateFrom) {
            keys.paymentDateFrom = this.paymentDateFrom;
        }
        if (this.paymentDateTo) {
            keys.paymentDateTo = this.paymentDateTo;
        }
        if (!ArrayUtils.isEmpty(keys)) {
            this.filtering.emit(keys);
        }
    }
}
