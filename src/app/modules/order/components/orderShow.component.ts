/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

import { OrderFacade } from '../state/order.facade';
import {
    SERVER_HOST,
    Order,
    Customer,
    Orderdetail,
    OrderService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
  selector: 'order-show',
  templateUrl: 'orderShow.component.table.html',
  styleUrls: ['./datashow.css']
})
export class OrderShowComponent extends AbstractTaskComponent<Order> implements OnInit, OnDestroy {

    @Input() orderNumber: number;
    @Input() order: Order;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private orderFacade: OrderFacade
    ) {
        super();

        orderFacade.orderShow$
            .pipe(
                takeWhile(() => this.isAlived),
                filter(order => !!order),
                distinctUntilChanged(),
                tap(order => console.log('order loaded.', order))
            )
            .subscribe(order => this.order = order);
    }

    ngOnInit() {
        if (this.order) {
        } else {
            if (this.orderNumber) {
                this.loadBy(this.orderNumber);
            } else {
                this.route.params.subscribe(params => {
                    this.orderNumber = +params['orderNumber'];
                    if (this.orderNumber) {
                        this.loadBy(this.orderNumber);
                    }
                });
            }
        }
    }

    loadBy(orderNumber: number) {
        this.orderFacade
            .getOrderShow({orderNumber})
                ;
    }

}

