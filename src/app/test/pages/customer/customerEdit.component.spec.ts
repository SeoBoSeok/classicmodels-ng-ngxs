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

import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../../../shared/shared.module';

import { 
    Employee,
    Order,
    Payment,
    Customer, CustomerEditForm, CustomerService, 
    UriUtils 
} from '../../../core';

import { CustomerEditComponent } from '../../../modules/customer/components/customerEdit.component';
import { CustomerState } from '../../../modules/customer/state/customer.state';

import { CustomerFacade } from '../../../modules/customer/state/customer.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create CustomerEditComponent', () => {
    let comp: CustomerEditComponent;
    let fixture: ComponentFixture<CustomerEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
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

    // asynchronous beforeEach
    beforeEach(async(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                SharedModule,
                HttpClientModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([], { developmentMode: true }),
                NgxsModule.forFeature([
                    CustomerState
                ]),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                })
            ],
            declarations: [CustomerEditComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                CustomerFacade
            ],
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerEditComponent);
        comp = fixture.componentInstance;
    });

    it('should instantiate CustomerEditComponent', () => {
        expect(comp != null).toBe(true);
    });

    it("should return expected CustomerEditForm", async(
        inject([HttpTestingController], (backend: HttpTestingController) => {
            comp.customerNumber = 1;
            fixture.detectChanges();
            fixture.whenStable()  
                .then(() => {
                    expect(comp.ef).toBeTruthy();
                    if (comp.ef) {
                        expect(comp.ef.customer).toBeTruthy();
                        expect(comp.ef.customer).toEqual(expectedCustomer, 'expected Customer');
                    }
                });

            let url = UriUtils.url('customers/find/1');

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedCustomer);
        })
    ));

    it("should exists all columns for CustomerEdit in template", (done) => {
        const ef = new CustomerEditForm();
        ef.customer = expectedCustomer;
        comp.ef = ef;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.query(By.css('#customerNumber'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#customerName'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#contactLastName'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#contactFirstName'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#phone'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#addressLine1'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#addressLine2'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#city'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#state'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#postalCode'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#country'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#creditLimit'));
            expect(de).toBeTruthy();

            done();
        });
    });

});
