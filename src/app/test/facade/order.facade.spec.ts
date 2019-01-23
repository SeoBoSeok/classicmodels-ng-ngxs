/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import {
    Customer,
    Orderdetail,
    OrderEditForm,
    OrderService,
    CustomerService,
    Order,
    UriUtils,
    CoreModule
} from '../../core';

import { OrderFacade } from '../../modules/order/state/order.facade';

describe("orderFacade test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                //OrderModule
                CoreModule
            ],
            providers: [
                OrderFacade
            ]
        });
    });

    it("should return expectedOrders from OrderFacade.getOrderList()", async(
        inject([OrderFacade, HttpTestingController], (orderFacade: OrderFacade, backend: HttpTestingController) => {
            const expectedOrders: Order[] = [
                new Order({id:0, title: 'John'}),
                new Order({id:1, title: 'Doe'})
            ];

            const params = {};
            orderFacade.getOrderList(params);
            orderFacade.orderList$.pipe(
                filter((orders: Array<Order>) => !!orders && orders.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                orders => expect(orders).toEqual(expectedOrders, 'expected orders'),
                fail
            );
            orderFacade.hasMoreOrderList$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                hasMore => expect(hasMore).not.toBe(true),
                fail
            );

            let url = UriUtils.toUrlParams('orders/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOrders);
        })
    ));

    it("OrderService.OrderList() should throw exception for 401 Unauthorized", async(
        inject([OrderFacade, HttpTestingController], (orderFacade: OrderFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            orderFacade.getOrderList(params);
            orderFacade.orderListError$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('orders/list', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return new OrderEditForm from OrderFacade.initOrderEdit()", async(
        inject([OrderFacade, HttpTestingController], (orderFacade: OrderFacade, backend: HttpTestingController) => {
            orderFacade.initOrderEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.order).not.toBeNull();
                },
                fail
            );

            orderFacade.initOrderEdit();
        })
    ));

    it("should return expected OrderEditForm from OrderFacade.loadOrderEdit()", async(
        inject([OrderFacade, HttpTestingController], (orderFacade: OrderFacade, backend: HttpTestingController) => {
            const expectedOrder: Order = new Order({
                orderNumber: 1,
                orderDate: new Date(),
                requiredDate: new Date(),
                shippedDate: new Date(),
                status: "1",
                comments: "1",
            });

            orderFacade.loadOrderEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.order).not.toBeNull();
                    expect(ef.order).toEqual(expectedOrder, 'expected Order');
                },
                fail
            );

            orderFacade.getOrderEdit({
                orderNumber: 1
            });

            let url = UriUtils.url("orders/find/1");

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOrder);
        })
    ));

    it("should save edited OrderEditForm with OrderFacade.saveOrderEdit()", async(
        inject([OrderFacade, HttpTestingController], (orderFacade: OrderFacade, backend: HttpTestingController) => {
            const expectedOrder: Order = new Order({
                orderNumber: 1,
                orderDate: new Date(),
                requiredDate: new Date(),
                shippedDate: new Date(),
                status: "1",
                comments: "1",
            });
            const editedOrder: Order = new Order({
                orderNumber: null,
                orderDate: new Date(),
                requiredDate: new Date(),
                shippedDate: new Date(),
                status: "1",
                comments: "1",
            });

            orderFacade.saveOrderEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.order).not.toBeNull();
                    expect(ef.order).toEqual(expectedOrder, 'expected Order');
                },
                fail
            );

            const ef: OrderEditForm = new OrderEditForm();
            ef.order = editedOrder;

            orderFacade.saveOrderEdit(ef);

            const ef2: OrderEditForm = new OrderEditForm();
            ef2.order = expectedOrder;

            let url = UriUtils.url('orders/edit');

            backend.match({
                url: url,
                method: 'POST'
            })[0].flush(ef2);
        })
    ));

});
