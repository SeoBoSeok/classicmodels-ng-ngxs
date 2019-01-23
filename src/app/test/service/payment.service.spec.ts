/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
    Customer,
    PaymentEditForm,
    PaymentService,
    CustomerService,
    Payment,
    UriUtils
} from '../../core';

describe("paymentService test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                PaymentService,
                CustomerService,
            ]
        });
    });

    it("should return expectedPayments from PaymentService.getPaymentList()", async(
        inject([PaymentService, HttpTestingController], (service: PaymentService, backend: HttpTestingController) => {
            const expectedPayments: Payment[] = [
                new Payment({id:0, title: 'John'}),
                new Payment({id:1, title: 'Doe'})
            ];

            const params = {};
            service.getPaymentList(params).subscribe(rows => {
                expect(rows.length).toBe(expectedPayments.length);
                expect(rows).toEqual(expectedPayments);
            });

            let url = UriUtils.toUrlParams('payments/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedPayments);
        })
    ));

    it("PaymentService.PaymentList() should throw exception for 401 Unauthorized", async(
        inject([PaymentService, HttpTestingController], (service: PaymentService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getPaymentList(params).subscribe(
                rows => fail('expected an error, not payments'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('payments/list', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

});
