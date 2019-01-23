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
    Productline,
    Orderdetail,
    Product, ProductEditForm, ProductService, 
    UriUtils 
} from '../../../core';

import { ProductEditComponent } from '../../../modules/product/components/productEdit.component';

import { ProductFacade } from '../../../modules/product/state/product.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create ProductEditComponent', () => {
    let comp: ProductEditComponent;
    let fixture: ComponentFixture<ProductEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const expectedProduct: Product = new Product({
        productCode: "1",
        productName: "1",
        productScale: "1",
        productVendor: "1",
        productDescription: "1",
        quantityInStock: 1,
        buyPrice: 1,
        msrp: 1,
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
            declarations: [ProductEditComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                ProductFacade
            ],
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(ProductEditComponent);
        comp = fixture.componentInstance;
        const ef = new ProductEditForm();
        ef.product = expectedProduct;
        ef.productlines = [];
        const productService = TestBed.get(ProductService);
        expect(productService).toBeTruthy();
        spyOn(productService, 'getProductEdit').and.returnValue(of(ef));
    });

    it('should instantiate ProductEditComponent', () => {
        expect(comp != null).toBe(true);
    });

    it("should return expected ProductEditForm", async(
        inject([HttpTestingController], (backend: HttpTestingController) => {
            comp.productCode = '1';
            fixture.detectChanges();
            fixture.whenStable()  
                .then(() => {
                    expect(comp.ef).toBeTruthy();
                    if (comp.ef) {
                        expect(comp.ef.product).toBeTruthy();
                        expect(comp.ef.product).toEqual(expectedProduct, 'expected Product');
                    }
                });

            let url = UriUtils.url('products/find/1');

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedProduct);
        })
    ));

    it("should exists all columns for ProductEdit in template", (done) => {
        const ef = new ProductEditForm();
        ef.product = expectedProduct;
        comp.ef = ef;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.query(By.css('#productCode'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#productName'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#productScale'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#productVendor'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#productDescription'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#quantityInStock'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#buyPrice'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#msrp'));
            expect(de).toBeTruthy();

            done();
        });
    });

});
