/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
    Order,
    Product,
    OrderdetailEditForm,
    OrderdetailService,
    OrderService,
    CustomerService,
    ProductService,
    ProductlineService,
    Orderdetail,
    UriUtils
} from '../../core';

describe("orderdetailService test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                OrderdetailService,
                OrderService,
                CustomerService,
                ProductService,
                ProductlineService,
            ]
        });
    });

    it("should return expectedOrderdetails from OrderdetailService.getOrderdetailList()", async(
        inject([OrderdetailService, HttpTestingController], (service: OrderdetailService, backend: HttpTestingController) => {
            const expectedOrderdetails: Orderdetail[] = [
                new Orderdetail({id:0, title: 'John'}),
                new Orderdetail({id:1, title: 'Doe'})
            ];

            const params = {};
            service.getOrderdetailList(params).subscribe(rows => {
                expect(rows.length).toBe(expectedOrderdetails.length);
                expect(rows).toEqual(expectedOrderdetails);
            });

            let url = UriUtils.toUrlParams('orderdetails/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOrderdetails);
        })
    ));

    it("OrderdetailService.OrderdetailList() should throw exception for 401 Unauthorized", async(
        inject([OrderdetailService, HttpTestingController], (service: OrderdetailService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getOrderdetailList(params).subscribe(
                rows => fail('expected an error, not orderdetails'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('orderdetails/list', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

});
