/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { Observable, of } from 'rxjs';
import { startWith, flatMap, map } from 'rxjs/operators';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../../../shared/shared.module';

import { 
    Customer,
    Payment, PaymentEditForm, PaymentService, 
    UriUtils 
} from '../../../core';

import { PaymentEditComponent } from '../../../modules/payment/components/paymentEdit.component';

import { PaymentFacade } from '../../../modules/payment/state/payment.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create PaymentEditComponent', () => {
    let comp: PaymentEditComponent;
    let fixture: ComponentFixture<PaymentEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const expectedPayment: Payment = new Payment({
        customerNumber: 1,
        checkNumber: "1",
        paymentDate: new Date(),
        amount: 1,
    });

    // asynchronous beforeEach
    beforeEach(async(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                SharedModule,
                HttpClientModule,
                HttpClientTestingModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                })
            ],
            declarations: [PaymentEditComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                PaymentFacade
            ],
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentEditComponent);
        comp = fixture.componentInstance;
        const ef = new PaymentEditForm();
        ef.payment = expectedPayment;
        ef.customers = [];
        const paymentService = TestBed.get(PaymentService);
        expect(paymentService).toBeTruthy();
        spyOn(paymentService, 'getPaymentEdit').and.returnValue(of(ef));
    });

    it('should instantiate PaymentEditComponent', () => {
        expect(comp != null).toBe(true);
    });

    it("should return expected PaymentEditForm", async(
        inject([HttpTestingController], (backend: HttpTestingController) => {
            comp.customerNumber = 1;
            comp.checkNumber = '1';
            fixture.detectChanges();
            fixture.whenStable()  
                .then(() => {
                    expect(comp.ef).toBeTruthy();
                    if (comp.ef) {
                        expect(comp.ef.payment).toBeTruthy();
                        expect(comp.ef.payment).toEqual(expectedPayment, 'expected Payment');
                    }
                });

            let url = UriUtils.url('payments/find/1/1');

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedPayment);
        })
    ));

    it("should exists all columns for PaymentEdit in template", (done) => {
        const ef = new PaymentEditForm();
        ef.payment = expectedPayment;
        comp.ef = ef;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.query(By.css('#checkNumber'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#paymentDate'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#amount'));
            expect(de).toBeTruthy();

            done();
        });
    });

});
