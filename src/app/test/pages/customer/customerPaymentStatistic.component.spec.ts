/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../../../shared/shared.module';

import { Customer, CustomerService } from '../../../core';
import { CustomerPaymentStatisticComponent } from '../../../modules/customer/components/customerPaymentStatistic.component';
import { CustomerState } from '../../../modules/customer/state/customer.state';
import { CustomerFacade } from '../../../modules/customer/state/customer.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create CustomerPaymentStatisticComponent', () => {

    let comp: CustomerPaymentStatisticComponent;
    let fixture: ComponentFixture<CustomerPaymentStatisticComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    // asynchronous beforeEach
    beforeEach(async(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [
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
            declarations: [CustomerPaymentStatisticComponent],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                CustomerFacade
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerPaymentStatisticComponent);
        comp = fixture.componentInstance;
    });

    it('should instantiate CustomerPaymentStatisticComponent', () => {
        expect(comp != null).toBe(true);
    });
});
