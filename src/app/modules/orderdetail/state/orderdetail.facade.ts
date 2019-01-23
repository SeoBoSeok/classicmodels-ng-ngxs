/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { 
    Orderdetail, OrderdetailService,
    OrderdetailEditForm,
    HttpFacade,
    CoreModule
} from '../../../core';

const NUM_ROWS = 10;

@Injectable()
export class OrderdetailFacade {
    createdOrderdetail$ = new Subject<Orderdetail>();
    orderdetail$ = new Subject<Orderdetail>();	// result of find
    orderdetails$ = new Subject<Array<Orderdetail>>();	// result of query

    updateSuccess$ = new Subject<string>();
    updateFailure$ = new Subject<string>();
    destroySuccess$ = new Subject<string>();
    destroyFailure$ = new Subject<string>();

    orderdetailList$ = new Subject<Array<Orderdetail>>();
    orderdetailListError$ = new Subject<string>();
    orderdetailList = [];
    hasMoreOrderdetailList$ = new Subject<boolean>();
    orderdetailShow$ = new Subject<Orderdetail>();

    initOrderdetailEditForm$ = new Subject<OrderdetailEditForm>();
    loadOrderdetailEditForm$ = new Subject<OrderdetailEditForm>();
    saveOrderdetailEditForm$ = new Subject<OrderdetailEditForm>();

    initOrderdetailEditFail$ = new Subject<string>();
    loadOrderdetailEditFail$ = new Subject<string>();
    saveOrderdetailEditFail$ = new Subject<string>();

    constructor(private orderdetailService: OrderdetailService, private httpFacade: HttpFacade) {}

    create(row: Orderdetail) {
        this.orderdetailService.create(row)
            .subscribe(
                res => this.createdOrderdetail$.next(res),
                err => console.log("Error on create Orderdetail: ", err)
            );
    }

    find(conditions: any) {
        this.orderdetailService.find(conditions.orderNumber, conditions.productCode)
            .subscribe(
                res => this.orderdetail$.next(res),
                err => console.log("Error on find Orderdetail: ", err)
            );
    }

    query(conditions: any) {
        this.orderdetailService.query(conditions)
            .subscribe(
                res => this.orderdetails$.next(res),
                err => console.log("Error on query Orderdetail: ", err)
            );
    }

    update(columns: any, conditions: any) {
        this.orderdetailService.update(columns, conditions)
            .subscribe(
                res => this.updateSuccess$.next(res),
                err => this.updateFailure$.next(err)
            );
    }

    destroy(conditions: any) {
        this.orderdetailService.delete(conditions)
            .subscribe(
                res => this.destroySuccess$.next(res),
                err => this.destroyFailure$.next(err)
            );
    }

    getOrderdetailList(conditions: any) {
        const pageSize: number = conditions["num-rows"] || NUM_ROWS;
        const pageNo = conditions['page-no'];
        this.orderdetailService.getOrderdetailList(conditions)
            .subscribe(
                rows => {
                    if (!pageNo || pageNo === 1) {
                        this.orderdetailList = [...rows];
                    } else {
                        this.orderdetailList = [...this.orderdetailList, ...rows];
                    }
                    this.orderdetailList$.next(this.orderdetailList);
                    this.hasMoreOrderdetailList$.next((rows.length >= pageSize));
                },
                err => {
                    console.log("Error on OrderdetailList: ", err);
                    this.orderdetailListError$.next(JSON.stringify(err));
                }
            );
    }

    getOrderdetailShow(conditions: any) {
        this.orderdetailService.getOrderdetailShow(conditions.orderNumber, conditions.productCode)
            .subscribe(
                res => this.orderdetailShow$.next(res),
                err => console.log("Error on OrderdetailShow: ", err)
            );
    }

    initOrderdetailEdit(ef?: OrderdetailEditForm) {
        this.orderdetailService.getNewOrderdetailEdit()
            .subscribe(
                res => this.initOrderdetailEditForm$.next(res),
                err => this.initOrderdetailEditFail$.next(JSON.stringify(err))
            );
    }
    initOrderdetailEditByEditForm(ef: OrderdetailEditForm) {
        this.orderdetailService.getOrderdetailEdit(ef)
            .subscribe(
                res => this.initOrderdetailEditForm$.next(res),
                err => this.initOrderdetailEditFail$.next(JSON.stringify(err))
            );
    }
    getOrderdetailEdit(conditions: any) {
        this.orderdetailService.getOrderdetailEditBy(conditions.orderNumber, conditions.productCode)
            .subscribe(
                res => this.loadOrderdetailEditForm$.next(res),
                err => this.loadOrderdetailEditFail$.next(JSON.stringify(err))
            );
    }
    saveOrderdetailEdit(ef: OrderdetailEditForm) {
        this.orderdetailService.saveOrderdetailEdit(ef)
            .subscribe(
                res => this.saveOrderdetailEditForm$.next(res),
                err => this.saveOrderdetailEditFail$.next(JSON.stringify(err))
            );
    }

    newOrderdetailAdded() {
        // FIXME: //this.store.dispatch(new orderdetailActions.NewOrderdetailAddedAction());
    }
}
