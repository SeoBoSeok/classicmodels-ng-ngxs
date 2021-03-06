/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
    Customer,
    Orderdetail,
    OrderEditForm,
    OrderService,
    CustomerService,
    Order,
    UriUtils
} from '../../core';

describe("orderService test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                OrderService,
                CustomerService,
            ]
        });
    });

    it("should return expectedOrders from OrderService.getOrderList()", async(
        inject([OrderService, HttpTestingController], (service: OrderService, backend: HttpTestingController) => {
            const expectedOrders: Order[] = [
                new Order({id:0, title: 'John'}),
                new Order({id:1, title: 'Doe'})
            ];

            const params = {};
            service.getOrderList(params).subscribe(rows => {
                expect(rows.length).toBe(expectedOrders.length);
                expect(rows).toEqual(expectedOrders);
            });

            let url = UriUtils.toUrlParams('orders/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOrders);
        })
    ));

    it("OrderService.OrderList() should throw exception for 401 Unauthorized", async(
        inject([OrderService, HttpTestingController], (service: OrderService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getOrderList(params).subscribe(
                rows => fail('expected an error, not orders'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('orders/list', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

});
