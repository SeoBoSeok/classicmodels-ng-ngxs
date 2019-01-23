/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { 
    Order, OrderService,
    OrderEditForm,
    HttpFacade,
    CoreModule
} from '../../../core';

const NUM_ROWS = 10;

@Injectable()
export class OrderFacade {
    createdOrder$ = new Subject<Order>();
    order$ = new Subject<Order>();	// result of find
    orders$ = new Subject<Array<Order>>();	// result of query

    updateSuccess$ = new Subject<string>();
    updateFailure$ = new Subject<string>();
    destroySuccess$ = new Subject<string>();
    destroyFailure$ = new Subject<string>();

    orderList$ = new Subject<Array<Order>>();
    orderListError$ = new Subject<string>();
    orderList = [];
    hasMoreOrderList$ = new Subject<boolean>();
    orderShow$ = new Subject<Order>();

    initOrderEditForm$ = new Subject<OrderEditForm>();
    loadOrderEditForm$ = new Subject<OrderEditForm>();
    saveOrderEditForm$ = new Subject<OrderEditForm>();

    initOrderEditFail$ = new Subject<string>();
    loadOrderEditFail$ = new Subject<string>();
    saveOrderEditFail$ = new Subject<string>();

    constructor(private orderService: OrderService, private httpFacade: HttpFacade) {}

    create(row: Order) {
        this.orderService.create(row)
            .subscribe(
                res => this.createdOrder$.next(res),
                err => console.log("Error on create Order: ", err)
            );
    }

    find(conditions: any) {
        this.orderService.find(conditions.orderNumber)
            .subscribe(
                res => this.order$.next(res),
                err => console.log("Error on find Order: ", err)
            );
    }

    query(conditions: any) {
        this.orderService.query(conditions)
            .subscribe(
                res => this.orders$.next(res),
                err => console.log("Error on query Order: ", err)
            );
    }

    update(columns: any, conditions: any) {
        this.orderService.update(columns, conditions)
            .subscribe(
                res => this.updateSuccess$.next(res),
                err => this.updateFailure$.next(err)
            );
    }

    destroy(conditions: any) {
        this.orderService.delete(conditions)
            .subscribe(
                res => this.destroySuccess$.next(res),
                err => this.destroyFailure$.next(err)
            );
    }

    getOrderList(conditions: any) {
        const pageSize: number = conditions["num-rows"] || NUM_ROWS;
        const pageNo = conditions['page-no'];
        this.orderService.getOrderList(conditions)
            .subscribe(
                rows => {
                    if (!pageNo || pageNo === 1) {
                        this.orderList = [...rows];
                    } else {
                        this.orderList = [...this.orderList, ...rows];
                    }
                    this.orderList$.next(this.orderList);
                    this.hasMoreOrderList$.next((rows.length >= pageSize));
                },
                err => {
                    console.log("Error on OrderList: ", err);
                    this.orderListError$.next(JSON.stringify(err));
                }
            );
    }

    getOrderShow(conditions: any) {
        this.orderService.getOrderShow(conditions.orderNumber)
            .subscribe(
                res => this.orderShow$.next(res),
                err => console.log("Error on OrderShow: ", err)
            );
    }

    initOrderEdit(ef?: OrderEditForm) {
        this.orderService.getNewOrderEdit()
            .subscribe(
                res => this.initOrderEditForm$.next(res),
                err => this.initOrderEditFail$.next(JSON.stringify(err))
            );
    }
    initOrderEditByEditForm(ef: OrderEditForm) {
        this.orderService.getOrderEdit(ef)
            .subscribe(
                res => this.initOrderEditForm$.next(res),
                err => this.initOrderEditFail$.next(JSON.stringify(err))
            );
    }
    getOrderEdit(conditions: any) {
        this.orderService.getOrderEditBy(conditions.orderNumber)
            .subscribe(
                res => this.loadOrderEditForm$.next(res),
                err => this.loadOrderEditFail$.next(JSON.stringify(err))
            );
    }
    saveOrderEdit(ef: OrderEditForm) {
        this.orderService.saveOrderEdit(ef)
            .subscribe(
                res => this.saveOrderEditForm$.next(res),
                err => this.saveOrderEditFail$.next(JSON.stringify(err))
            );
    }

    newOrderAdded() {
        // FIXME: //this.store.dispatch(new orderActions.NewOrderAddedAction());
    }
}
