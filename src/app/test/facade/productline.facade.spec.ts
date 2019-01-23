/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import {
    Product,
    ProductlineEditForm,
    ProductlineService,
    Productline,
    UriUtils,
    CoreModule
} from '../../core';

import { ProductlineFacade } from '../../modules/productline/state/productline.facade';

describe("productlineFacade test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                //ProductlineModule
                CoreModule
            ],
            providers: [
                ProductlineFacade
            ]
        });
    });

    it("should return expectedProductlines from ProductlineFacade.getProductlineList()", async(
        inject([ProductlineFacade, HttpTestingController], (productlineFacade: ProductlineFacade, backend: HttpTestingController) => {
            const expectedProductlines: Productline[] = [
                new Productline({id:0, title: 'John'}),
                new Productline({id:1, title: 'Doe'})
            ];

            const params = {};
            productlineFacade.getProductlineList(params);
            productlineFacade.productlineList$.pipe(
                filter((productlines: Array<Productline>) => !!productlines && productlines.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                productlines => expect(productlines).toEqual(expectedProductlines, 'expected productlines'),
                fail
            );
            productlineFacade.hasMoreProductlineList$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                hasMore => expect(hasMore).not.toBe(true),
                fail
            );

            let url = UriUtils.toUrlParams('productlines/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedProductlines);
        })
    ));

    it("ProductlineService.ProductlineList() should throw exception for 401 Unauthorized", async(
        inject([ProductlineFacade, HttpTestingController], (productlineFacade: ProductlineFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            productlineFacade.getProductlineList(params);
            productlineFacade.productlineListError$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('productlines/list', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return new ProductlineEditForm from ProductlineFacade.initProductlineEdit()", async(
        inject([ProductlineFacade, HttpTestingController], (productlineFacade: ProductlineFacade, backend: HttpTestingController) => {
            productlineFacade.initProductlineEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.productline).not.toBeNull();
                },
                fail
            );

            productlineFacade.initProductlineEdit();
        })
    ));

    it("should return expected ProductlineEditForm from ProductlineFacade.loadProductlineEdit()", async(
        inject([ProductlineFacade, HttpTestingController], (productlineFacade: ProductlineFacade, backend: HttpTestingController) => {
            const expectedProductline: Productline = new Productline({
                productLine: "1",
                textDescription: "1",
                htmlDescription: "1",
                image: [1,2,3],
            });

            productlineFacade.loadProductlineEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.productline).not.toBeNull();
                    expect(ef.productline).toEqual(expectedProductline, 'expected Productline');
                },
                fail
            );

            productlineFacade.getProductlineEdit({
                productLine: "1"
            });

            let url = UriUtils.url("productlines/find/1");

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedProductline);
        })
    ));

    it("should save edited ProductlineEditForm with ProductlineFacade.saveProductlineEdit()", async(
        inject([ProductlineFacade, HttpTestingController], (productlineFacade: ProductlineFacade, backend: HttpTestingController) => {
            const expectedProductline: Productline = new Productline({
                productLine: "1",
                textDescription: "1",
                htmlDescription: "1",
                image: [1,2,3],
            });
            const editedProductline: Productline = new Productline({
                productLine: null,
                textDescription: "1",
                htmlDescription: "1",
                image: [1,2,3],
            });

            productlineFacade.saveProductlineEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.productline).not.toBeNull();
                    expect(ef.productline).toEqual(expectedProductline, 'expected Productline');
                },
                fail
            );

            const ef: ProductlineEditForm = new ProductlineEditForm();
            ef.productline = editedProductline;

            productlineFacade.saveProductlineEdit(ef);

            const ef2: ProductlineEditForm = new ProductlineEditForm();
            ef2.productline = expectedProductline;

            let url = UriUtils.url('productlines/edit');

            backend.match({
                url: url,
                method: 'POST'
            })[0].flush(ef2);
        })
    ));

});
