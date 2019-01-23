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
    Product,
    Productline, ProductlineEditForm, ProductlineService, 
    UriUtils 
} from '../../../core';

import { ProductlineEditComponent } from '../../../modules/productline/components/productlineEdit.component';

import { ProductlineFacade } from '../../../modules/productline/state/productline.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create ProductlineEditComponent', () => {
    let comp: ProductlineEditComponent;
    let fixture: ComponentFixture<ProductlineEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const expectedProductline: Productline = new Productline({
        productLine: "1",
        textDescription: "1",
        htmlDescription: "1",
        image: [1,2,3],
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
            declarations: [ProductlineEditComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                ProductlineFacade
            ],
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(ProductlineEditComponent);
        comp = fixture.componentInstance;
    });

    it('should instantiate ProductlineEditComponent', () => {
        expect(comp != null).toBe(true);
    });

    it("should return expected ProductlineEditForm", async(
        inject([HttpTestingController], (backend: HttpTestingController) => {
            comp.productLine = '1';
            fixture.detectChanges();
            fixture.whenStable()  
                .then(() => {
                    expect(comp.ef).toBeTruthy();
                    if (comp.ef) {
                        expect(comp.ef.productline).toBeTruthy();
                        expect(comp.ef.productline).toEqual(expectedProductline, 'expected Productline');
                    }
                });

            let url = UriUtils.url('productlines/find/1');

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedProductline);
        })
    ));

    it("should exists all columns for ProductlineEdit in template", (done) => {
        const ef = new ProductlineEditForm();
        ef.productline = expectedProductline;
        comp.ef = ef;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.query(By.css('#productLine'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#textDescription'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#htmlDescription'));
            expect(de).toBeTruthy();

            done();
        });
    });

});
