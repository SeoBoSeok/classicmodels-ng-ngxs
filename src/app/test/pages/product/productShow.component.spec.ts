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

import { Product, ProductService } from '../../../core';
import { ProductShowComponent } from '../../../modules/product/components/productShow.component';
import { ProductFacade } from '../../../modules/product/state/product.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create ProductShowComponent', () => {

    let comp: ProductShowComponent;
    let fixture: ComponentFixture<ProductShowComponent>;
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
            declarations: [ProductShowComponent],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                ProductFacade
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(ProductShowComponent);
        comp = fixture.componentInstance;
    });

    it('should instantiate ProductShowComponent', () => {
        expect(comp != null).toBe(true);
    });
});
