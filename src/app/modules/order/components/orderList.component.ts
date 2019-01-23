/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

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
import { AbstractListComponent } from '../../abstract.list.component';

@Component({
    selector: 'order-list',
    templateUrl: 'orderList.component.html'
})
export class OrderListComponent extends AbstractListComponent<Order> implements OnInit, OnDestroy {

    orders: Order[];
    order: Order;
    orderListTitles: Array<string> = [
        'orderNumber', 'orderDate', 'requiredDate', 'shippedDate', 'status', 'comments'
    ];
    orderListLabels: any = {
        orderNumber: 'orderNumber', orderDate: 'orderDate', requiredDate: 'requiredDate', shippedDate: 'shippedDate', status: 'status', comments: 'comments'
    };
    orderListColumns: Array<string | any> = [
        'orderNumber', {name: 'orderDate', type: 'date-type'}, {name: 'requiredDate', type: 'date-type'}, {name: 'shippedDate', type: 'date-type'}, 'status', 'comments'
    ];

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private orderFacade: OrderFacade
    ) {
        super();

        orderFacade.orderList$.pipe(
                takeWhile(() => this.isAlived),
                filter(orders => !!orders && orders.length > 0),
                distinctUntilChanged()
            )
            .subscribe(orders => this.orders = orders);

        orderFacade.hasMoreOrderList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(hasMore => this.hasMoreRows = hasMore)
            ;
    }

    ngOnInit() {
        this.initLoadByParams(this.route);
    }

    protected setConditionsToObserver(conditions: any): void {
        this.orderFacade.getOrderList(conditions);
    }

    /**
    * this row just selected for edit task or for embedded tasks.
    */
    rowSelected(order: Order) : void {
        this.router.navigate(['orders/show', {orderNumber: order.orderNumber}]);
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
     * @params: order
     */
    onClickToSpecificRow(order) {
        this.rowSelected(order);
    }

    /**
     * params: {row: order, button: string}
     */
    onClickButtonToRow(params) {
        const order = params.row;
        const button = params.button;
        if ('Show' === button) {
            this.router.navigate(['orders/show', {orderNumber: order.orderNumber}]);
        }
        else if ('Edit' === button) {
            this.router.navigate(['orders/edit', {orderNumber: order.orderNumber}]);
        }
        else if ('Delete' === button) {
            this.destroy(order);
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

    destroy(order:Order): void {
        let answer = confirm("CAUTION: Are you sure to delete this order?");
        if (answer != true) {
            return;
        }
        this.orderFacade.destroy({orderNumber: order.orderNumber});
        this.orderFacade.destroySuccess$
            .pipe(take(1))
            .subscribe(json => {
                console.log('destroy result: '+JSON.stringify(json));
                this.filtering(null);
            });
        this.orderFacade.destroyFailure$
            .pipe(take(1))
            .subscribe(err => this.showError(err));
    }

}

