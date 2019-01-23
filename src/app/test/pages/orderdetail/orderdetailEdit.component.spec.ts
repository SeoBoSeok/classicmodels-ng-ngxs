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
    Order,
    Product,
    Orderdetail, OrderdetailEditForm, OrderdetailService, 
    UriUtils 
} from '../../../core';

import { OrderdetailEditComponent } from '../../../modules/orderdetail/components/orderdetailEdit.component';

import { OrderdetailFacade } from '../../../modules/orderdetail/state/orderdetail.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create OrderdetailEditComponent', () => {
    let comp: OrderdetailEditComponent;
    let fixture: ComponentFixture<OrderdetailEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const expectedOrderdetail: Orderdetail = new Orderdetail({
        orderNumber: 1,
        productCode: "1",
        quantityOrdered: 1,
        priceEach: 1,
        orderLineNumber: 1,
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
            declarations: [OrderdetailEditComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                OrderdetailFacade
            ],
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(OrderdetailEditComponent);
        comp = fixture.componentInstance;
        const ef = new OrderdetailEditForm();
        ef.orderdetail = expectedOrderdetail;
        ef.orders = [];
        ef.products = [];
        const orderdetailService = TestBed.get(OrderdetailService);
        expect(orderdetailService).toBeTruthy();
        spyOn(orderdetailService, 'getOrderdetailEdit').and.returnValue(of(ef));
    });

    it('should instantiate OrderdetailEditComponent', () => {
        expect(comp != null).toBe(true);
    });

    it("should return expected OrderdetailEditForm", async(
        inject([HttpTestingController], (backend: HttpTestingController) => {
            comp.orderNumber = 1;
            comp.productCode = '1';
            fixture.detectChanges();
            fixture.whenStable()  
                .then(() => {
                    expect(comp.ef).toBeTruthy();
                    if (comp.ef) {
                        expect(comp.ef.orderdetail).toBeTruthy();
                        expect(comp.ef.orderdetail).toEqual(expectedOrderdetail, 'expected Orderdetail');
                    }
                });

            let url = UriUtils.url('orderdetails/find/1/1');

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOrderdetail);
        })
    ));

    it("should exists all columns for OrderdetailEdit in template", (done) => {
        const ef = new OrderdetailEditForm();
        ef.orderdetail = expectedOrderdetail;
        comp.ef = ef;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.query(By.css('#quantityOrdered'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#priceEach'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#orderLineNumber'));
            expect(de).toBeTruthy();

            done();
        });
    });

});
