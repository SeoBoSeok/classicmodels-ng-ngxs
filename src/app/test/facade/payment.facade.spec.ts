/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import {
    Customer,
    PaymentEditForm,
    PaymentService,
    CustomerService,
    Payment,
    UriUtils,
    CoreModule
} from '../../core';

import { PaymentFacade } from '../../modules/payment/state/payment.facade';

describe("paymentFacade test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                //PaymentModule
                CoreModule
            ],
            providers: [
                PaymentFacade
            ]
        });
    });

    it("should return expectedPayments from PaymentFacade.getPaymentList()", async(
        inject([PaymentFacade, HttpTestingController], (paymentFacade: PaymentFacade, backend: HttpTestingController) => {
            const expectedPayments: Payment[] = [
                new Payment({id:0, title: 'John'}),
                new Payment({id:1, title: 'Doe'})
            ];

            const params = {};
            paymentFacade.getPaymentList(params);
            paymentFacade.paymentList$.pipe(
                filter((payments: Array<Payment>) => !!payments && payments.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                payments => expect(payments).toEqual(expectedPayments, 'expected payments'),
                fail
            );
            paymentFacade.hasMorePaymentList$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                hasMore => expect(hasMore).not.toBe(true),
                fail
            );

            let url = UriUtils.toUrlParams('payments/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedPayments);
        })
    ));

    it("PaymentService.PaymentList() should throw exception for 401 Unauthorized", async(
        inject([PaymentFacade, HttpTestingController], (paymentFacade: PaymentFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            paymentFacade.getPaymentList(params);
            paymentFacade.paymentListError$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('payments/list', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return new PaymentEditForm from PaymentFacade.initPaymentEdit()", async(
        inject([PaymentFacade, HttpTestingController], (paymentFacade: PaymentFacade, backend: HttpTestingController) => {
            paymentFacade.initPaymentEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.payment).not.toBeNull();
                },
                fail
            );

            paymentFacade.initPaymentEdit();
        })
    ));

    it("should return expected PaymentEditForm from PaymentFacade.loadPaymentEdit()", async(
        inject([PaymentFacade, HttpTestingController], (paymentFacade: PaymentFacade, backend: HttpTestingController) => {
            const expectedPayment: Payment = new Payment({
                customerNumber: 1,
                checkNumber: "1",
                paymentDate: new Date(),
                amount: 1,
            });

            paymentFacade.loadPaymentEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.payment).not.toBeNull();
                    expect(ef.payment).toEqual(expectedPayment, 'expected Payment');
                },
                fail
            );

            paymentFacade.getPaymentEdit({
                customerNumber: 1, checkNumber: "1"
            });

            let url = UriUtils.url("payments/find/1/1");

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedPayment);
        })
    ));

    it("should save edited PaymentEditForm with PaymentFacade.savePaymentEdit()", async(
        inject([PaymentFacade, HttpTestingController], (paymentFacade: PaymentFacade, backend: HttpTestingController) => {
            const expectedPayment: Payment = new Payment({
                customerNumber: 1,
                checkNumber: "1",
                paymentDate: new Date(),
                amount: 1,
            });
            const editedPayment: Payment = new Payment({
                customerNumber: null,
                checkNumber: null,
                paymentDate: new Date(),
                amount: 1,
            });

            paymentFacade.savePaymentEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.payment).not.toBeNull();
                    expect(ef.payment).toEqual(expectedPayment, 'expected Payment');
                },
                fail
            );

            const ef: PaymentEditForm = new PaymentEditForm();
            ef.payment = editedPayment;

            paymentFacade.savePaymentEdit(ef);

            const ef2: PaymentEditForm = new PaymentEditForm();
            ef2.payment = expectedPayment;

            let url = UriUtils.url('payments/edit');

            backend.match({
                url: url,
                method: 'POST'
            })[0].flush(ef2);
        })
    ));

});
