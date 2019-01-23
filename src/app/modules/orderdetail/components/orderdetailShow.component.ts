/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

import { OrderdetailFacade } from '../state/orderdetail.facade';
import {
    SERVER_HOST,
    Orderdetail,
    Order,
    Product,
    OrderdetailService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
  selector: 'orderdetail-show',
  templateUrl: 'orderdetailShow.component.table.html',
  styleUrls: ['./datashow.css']
})
export class OrderdetailShowComponent extends AbstractTaskComponent<Orderdetail> implements OnInit, OnDestroy {

    @Input() orderNumber: number;
    @Input() productCode: string;
    @Input() orderdetail: Orderdetail;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private orderdetailFacade: OrderdetailFacade
    ) {
        super();

        orderdetailFacade.orderdetailShow$
            .pipe(
                takeWhile(() => this.isAlived),
                filter(orderdetail => !!orderdetail),
                distinctUntilChanged(),
                tap(orderdetail => console.log('orderdetail loaded.', orderdetail))
            )
            .subscribe(orderdetail => this.orderdetail = orderdetail);
    }

    ngOnInit() {
        if (this.orderdetail) {
        } else {
            if (this.orderNumber && this.productCode) {
                this.loadBy(this.orderNumber, this.productCode);
            } else {
                this.route.params.subscribe(params => {
                    this.orderNumber = +params['orderNumber'];
                    this.productCode = params['productCode'];
                    if (this.orderNumber && this.productCode) {
                        this.loadBy(this.orderNumber, this.productCode);
                    }
                });
            }
        }
    }

    loadBy(orderNumber: number, productCode: string) {
        this.orderdetailFacade
            .getOrderdetailShow({orderNumber, productCode})
                ;
    }

}

