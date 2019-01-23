/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

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
    UriUtils,
    CoreModule
} from '../../core';

import { OrderdetailFacade } from '../../modules/orderdetail/state/orderdetail.facade';

describe("orderdetailFacade test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                //OrderdetailModule
                CoreModule
            ],
            providers: [
                OrderdetailFacade
            ]
        });
    });

    it("should return expectedOrderdetails from OrderdetailFacade.getOrderdetailList()", async(
        inject([OrderdetailFacade, HttpTestingController], (orderdetailFacade: OrderdetailFacade, backend: HttpTestingController) => {
            const expectedOrderdetails: Orderdetail[] = [
                new Orderdetail({id:0, title: 'John'}),
                new Orderdetail({id:1, title: 'Doe'})
            ];

            const params = {};
            orderdetailFacade.getOrderdetailList(params);
            orderdetailFacade.orderdetailList$.pipe(
                filter((orderdetails: Array<Orderdetail>) => !!orderdetails && orderdetails.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                orderdetails => expect(orderdetails).toEqual(expectedOrderdetails, 'expected orderdetails'),
                fail
            );
            orderdetailFacade.hasMoreOrderdetailList$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                hasMore => expect(hasMore).not.toBe(true),
                fail
            );

            let url = UriUtils.toUrlParams('orderdetails/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOrderdetails);
        })
    ));

    it("OrderdetailService.OrderdetailList() should throw exception for 401 Unauthorized", async(
        inject([OrderdetailFacade, HttpTestingController], (orderdetailFacade: OrderdetailFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            orderdetailFacade.getOrderdetailList(params);
            orderdetailFacade.orderdetailListError$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('orderdetails/list', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return new OrderdetailEditForm from OrderdetailFacade.initOrderdetailEdit()", async(
        inject([OrderdetailFacade, HttpTestingController], (orderdetailFacade: OrderdetailFacade, backend: HttpTestingController) => {
            orderdetailFacade.initOrderdetailEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.orderdetail).not.toBeNull();
                },
                fail
            );

            orderdetailFacade.initOrderdetailEdit();
        })
    ));

    it("should return expected OrderdetailEditForm from OrderdetailFacade.loadOrderdetailEdit()", async(
        inject([OrderdetailFacade, HttpTestingController], (orderdetailFacade: OrderdetailFacade, backend: HttpTestingController) => {
            const expectedOrderdetail: Orderdetail = new Orderdetail({
                orderNumber: 1,
                productCode: "1",
                quantityOrdered: 1,
                priceEach: 1,
                orderLineNumber: 1,
            });

            orderdetailFacade.loadOrderdetailEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.orderdetail).not.toBeNull();
                    expect(ef.orderdetail).toEqual(expectedOrderdetail, 'expected Orderdetail');
                },
                fail
            );

            orderdetailFacade.getOrderdetailEdit({
                orderNumber: 1, productCode: "1"
            });

            let url = UriUtils.url("orderdetails/find/1/1");

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOrderdetail);
        })
    ));

    it("should save edited OrderdetailEditForm with OrderdetailFacade.saveOrderdetailEdit()", async(
        inject([OrderdetailFacade, HttpTestingController], (orderdetailFacade: OrderdetailFacade, backend: HttpTestingController) => {
            const expectedOrderdetail: Orderdetail = new Orderdetail({
                orderNumber: 1,
                productCode: "1",
                quantityOrdered: 1,
                priceEach: 1,
                orderLineNumber: 1,
            });
            const editedOrderdetail: Orderdetail = new Orderdetail({
                orderNumber: null,
                productCode: null,
                quantityOrdered: 1,
                priceEach: 1,
                orderLineNumber: 1,
            });

            orderdetailFacade.saveOrderdetailEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.orderdetail).not.toBeNull();
                    expect(ef.orderdetail).toEqual(expectedOrderdetail, 'expected Orderdetail');
                },
                fail
            );

            const ef: OrderdetailEditForm = new OrderdetailEditForm();
            ef.orderdetail = editedOrderdetail;

            orderdetailFacade.saveOrderdetailEdit(ef);

            const ef2: OrderdetailEditForm = new OrderdetailEditForm();
            ef2.orderdetail = expectedOrderdetail;

            let url = UriUtils.url('orderdetails/edit');

            backend.match({
                url: url,
                method: 'POST'
            })[0].flush(ef2);
        })
    ));

});
