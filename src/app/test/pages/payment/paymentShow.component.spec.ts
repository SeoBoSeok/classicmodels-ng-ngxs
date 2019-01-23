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

import { SharedModule } from '../../../shared/shared.module';

import { Payment, PaymentService } from '../../../core';
import { PaymentShowComponent } from '../../../modules/payment/components/paymentShow.component';
import { PaymentFacade } from '../../../modules/payment/state/payment.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create PaymentShowComponent', () => {

    let comp: PaymentShowComponent;
    let fixture: ComponentFixture<PaymentShowComponent>;
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
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                })
            ],
            declarations: [PaymentShowComponent],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                PaymentFacade
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(PaymentShowComponent);
        comp = fixture.componentInstance;
    });

    it('should instantiate PaymentShowComponent', () => {
        expect(comp != null).toBe(true);
    });
});
