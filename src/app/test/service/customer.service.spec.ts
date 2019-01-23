/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
    Employee,
    Order,
    Payment,
    CustomerEditForm,
    CustomerService,
    Customer,
    UriUtils
} from '../../core';

describe("customerService test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                CustomerService,
            ]
        });
    });

    it("should return expectedCustomers from CustomerService.getCustomerList()", async(
        inject([CustomerService, HttpTestingController], (service: CustomerService, backend: HttpTestingController) => {
            const expectedCustomers: Customer[] = [
                new Customer({id:0, title: 'John'}),
                new Customer({id:1, title: 'Doe'})
            ];

            const params = {
                city: "1",
                state: "1",
            };
            service.getCustomerList(params).subscribe(rows => {
                expect(rows.length).toBe(expectedCustomers.length);
                expect(rows).toEqual(expectedCustomers);
            });

            let url = UriUtils.toUrlParams('customers/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedCustomers);
        })
    ));

    it("CustomerService.CustomerList() should throw exception for 401 Unauthorized", async(
        inject([CustomerService, HttpTestingController], (service: CustomerService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getCustomerList(params).subscribe(
                rows => fail('expected an error, not customers'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('customers/list', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return expectedCustomers from CustomerService.getCustomerPaymentStatistic()", async(
        inject([CustomerService, HttpTestingController], (service: CustomerService, backend: HttpTestingController) => {
            const expectedCustomers: Customer[] = [
                new Customer({id:0, title: 'John'}),
                new Customer({id:1, title: 'Doe'})
            ];

            const params = {
                customerNumber: 1,
                paymentDateFrom: new Date(),
                paymentDateTo: new Date(),
            };
            service.getCustomerPaymentStatistic(params).subscribe(rows => {
                expect(rows.length).toBe(expectedCustomers.length);
                expect(rows).toEqual(expectedCustomers);
            });

            let url = UriUtils.toUrlParams('customers/statistics', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedCustomers);
        })
    ));

    it("CustomerService.CustomerPaymentStatistic() should throw exception for 401 Unauthorized", async(
        inject([CustomerService, HttpTestingController], (service: CustomerService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getCustomerPaymentStatistic(params).subscribe(
                rows => fail('expected an error, not customers'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('customers/statistics', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

});
