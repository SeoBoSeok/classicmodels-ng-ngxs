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

import { Orderdetail, OrderdetailService } from '../../../core';
import { OrderdetailListComponent } from '../../../modules/orderdetail/components/orderdetailList.component';
import { OrderdetailFacade } from '../../../modules/orderdetail/state/orderdetail.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create OrderdetailListComponent', () => {

    let comp: OrderdetailListComponent;
    let fixture: ComponentFixture<OrderdetailListComponent>;
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
            declarations: [OrderdetailListComponent],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                OrderdetailFacade
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(OrderdetailListComponent);
        comp = fixture.componentInstance;
    });

    it('should instantiate OrderdetailListComponent', () => {
        expect(comp != null).toBe(true);
    });
});
