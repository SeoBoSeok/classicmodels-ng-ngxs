/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnChanges, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

import { CustomerFacade } from '../state/customer.facade';
import {
    SERVER_HOST,
    Customer,
    Employee,
    Order,
    Payment,
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
  selector: 'customer-show',
  templateUrl: 'customerShow.component.table.html',
  styleUrls: ['./datashow.css']
})
export class CustomerShowComponent extends AbstractTaskComponent<Customer> implements OnInit, OnDestroy, OnChanges {

    @Input() customerNumber: number;
    @Input() customer: Customer;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private customerFacade: CustomerFacade
    ) {
        super();

        customerFacade.customerShow$
            .pipe(
                takeWhile(() => this.isAlived),
                filter(customer => !!customer),
                distinctUntilChanged(),
                tap(customer => console.log('customer loaded.', customer))
            )
            .subscribe(customer => this.customer = customer);
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.customer) {
        } else {
            if (this.customerNumber) {
                this.loadBy(this.customerNumber);
            } else {
                this.route.params.subscribe(params => {
                    this.customerNumber = +params['customerNumber'];
                    if (this.customerNumber) {
                        this.loadBy(this.customerNumber);
                    }
                });
            }
        }
    }

    loadBy(customerNumber: number) {
        this.customerFacade
            .getCustomerShow({customerNumber})
                ;
    }

}

