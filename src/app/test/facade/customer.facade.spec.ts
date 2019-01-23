/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import {
    Employee,
    Order,
    Payment,
    CustomerEditForm,
    CustomerService,
    Customer,
    UriUtils,
    CoreModule
} from '../../core';

import { CustomerFacade } from '../../modules/customer/state/customer.facade';
import { CustomerState } from '../../modules/customer/state/customer.state';

describe("customerFacade test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([
                    CustomerState
                ]),
                //CustomerModule
                CoreModule
            ],
            providers: [
                CustomerFacade
            ]
        });
    });

    it("should return expectedCustomers from CustomerFacade.getCustomerList()", async(
        inject([CustomerFacade, HttpTestingController], (customerFacade: CustomerFacade, backend: HttpTestingController) => {
            const expectedCustomers: Customer[] = [
                new Customer({id:0, title: 'John'}),
                new Customer({id:1, title: 'Doe'})
            ];

            const params = {
                city: "1",
                state: "1",
            };
            customerFacade.getCustomerList(params);
            customerFacade.customerList$.pipe(
                filter((customers: Array<Customer>) => !!customers && customers.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                customers => expect(customers).toEqual(expectedCustomers, 'expected customers'),
                fail
            );

            let url = UriUtils.toUrlParams('customers/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedCustomers);
        })
    ));

    it("CustomerService.CustomerList() should throw exception for 401 Unauthorized", async(
        inject([CustomerFacade, HttpTestingController], (customerFacade: CustomerFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            customerFacade.getCustomerList(params);
            customerFacade.customerListError$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('customers/list', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return expectedCustomers from CustomerFacade.getCustomerPaymentStatistic()", async(
        inject([CustomerFacade, HttpTestingController], (customerFacade: CustomerFacade, backend: HttpTestingController) => {
            const expectedCustomers: Customer[] = [
                new Customer({id:0, title: 'John'}),
                new Customer({id:1, title: 'Doe'})
            ];

            const params = {
                customerNumber: 1,
                paymentDateFrom: new Date(),
                paymentDateTo: new Date(),
            };
            customerFacade.getCustomerPaymentStatistic(params);
            customerFacade.customerPaymentStatistic$.pipe(
                filter((customers: Array<Customer>) => !!customers && customers.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                customers => expect(customers).toEqual(expectedCustomers, 'expected customers'),
                fail
            );

            let url = UriUtils.toUrlParams('customers/statistics', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedCustomers);
        })
    ));

    it("CustomerService.CustomerPaymentStatistic() should throw exception for 401 Unauthorized", async(
        inject([CustomerFacade, HttpTestingController], (customerFacade: CustomerFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            customerFacade.getCustomerPaymentStatistic(params);
            customerFacade.customerPaymentStatisticError$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('customers/statistics', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return new CustomerEditForm from CustomerFacade.initCustomerEdit()", async(
        inject([CustomerFacade, HttpTestingController], (customerFacade: CustomerFacade, backend: HttpTestingController) => {
            customerFacade.initCustomerEditForm$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.customer).not.toBeNull();
                },
                fail
            );

            customerFacade.initCustomerEdit();
        })
    ));

    it("should return expected CustomerEditForm from CustomerFacade.loadCustomerEdit()", async(
        inject([CustomerFacade, HttpTestingController], (customerFacade: CustomerFacade, backend: HttpTestingController) => {
            const expectedCustomer: Customer = new Customer({
                customerNumber: 1,
                customerName: "1",
                contactLastName: "1",
                contactFirstName: "1",
                phone: "1",
                addressLine1: "1",
                addressLine2: "1",
                city: "1",
                state: "1",
                postalCode: "1",
                country: "1",
                creditLimit: 1,
            });

            customerFacade.loadCustomerEditForm$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.customer).not.toBeNull();
                    expect(ef.customer).toEqual(expectedCustomer, 'expected Customer');
                },
                fail
            );

            customerFacade.getCustomerEdit({
                customerNumber: 1
            });

            let url = UriUtils.url("customers/find/1");

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedCustomer);
        })
    ));

    it("should save edited CustomerEditForm with CustomerFacade.saveCustomerEdit()", async(
        inject([CustomerFacade, HttpTestingController], (customerFacade: CustomerFacade, backend: HttpTestingController) => {
            const expectedCustomer: Customer = new Customer({
                customerNumber: 1,
                customerName: "1",
                contactLastName: "1",
                contactFirstName: "1",
                phone: "1",
                addressLine1: "1",
                addressLine2: "1",
                city: "1",
                state: "1",
                postalCode: "1",
                country: "1",
                creditLimit: 1,
            });
            const editedCustomer: Customer = new Customer({
                customerNumber: null,
                customerName: "1",
                contactLastName: "1",
                contactFirstName: "1",
                phone: "1",
                addressLine1: "1",
                addressLine2: "1",
                city: "1",
                state: "1",
                postalCode: "1",
                country: "1",
                creditLimit: 1,
            });

            customerFacade.saveCustomerEditForm$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.customer).not.toBeNull();
                    expect(ef.customer).toEqual(expectedCustomer, 'expected Customer');
                },
                fail
            );

            const ef: CustomerEditForm = new CustomerEditForm();
            ef.customer = editedCustomer;

            customerFacade.saveCustomerEdit(ef);

            const ef2: CustomerEditForm = new CustomerEditForm();
            ef2.customer = expectedCustomer;

            let url = UriUtils.url('customers/edit');

            backend.match({
                url: url,
                method: 'POST'
            })[0].flush(ef2);
        })
    ));

});
