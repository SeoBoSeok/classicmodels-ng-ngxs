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
    Orderdetail,
    Order, OrderEditForm, OrderService, 
    UriUtils 
} from '../../../core';

import { OrderEditComponent } from '../../../modules/order/components/orderEdit.component';

import { OrderFacade } from '../../../modules/order/state/order.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create OrderEditComponent', () => {
    let comp: OrderEditComponent;
    let fixture: ComponentFixture<OrderEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const expectedOrder: Order = new Order({
        orderNumber: 1,
        orderDate: new Date(),
        requiredDate: new Date(),
        shippedDate: new Date(),
        status: "1",
        comments: "1",
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
            declarations: [OrderEditComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                OrderFacade
            ],
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(OrderEditComponent);
        comp = fixture.componentInstance;
        const ef = new OrderEditForm();
        ef.order = expectedOrder;
        ef.customers = [];
        const orderService = TestBed.get(OrderService);
        expect(orderService).toBeTruthy();
        spyOn(orderService, 'getOrderEdit').and.returnValue(of(ef));
    });

    it('should instantiate OrderEditComponent', () => {
        expect(comp != null).toBe(true);
    });

    it("should return expected OrderEditForm", async(
        inject([HttpTestingController], (backend: HttpTestingController) => {
            comp.orderNumber = 1;
            fixture.detectChanges();
            fixture.whenStable()  
                .then(() => {
                    expect(comp.ef).toBeTruthy();
                    if (comp.ef) {
                        expect(comp.ef.order).toBeTruthy();
                        expect(comp.ef.order).toEqual(expectedOrder, 'expected Order');
                    }
                });

            let url = UriUtils.url('orders/find/1');

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOrder);
        })
    ));

    it("should exists all columns for OrderEdit in template", (done) => {
        const ef = new OrderEditForm();
        ef.order = expectedOrder;
        comp.ef = ef;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.query(By.css('#orderNumber'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#orderDate'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#requiredDate'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#shippedDate'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#status'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#comments'));
            expect(de).toBeTruthy();

            done();
        });
    });

});
