/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
    Productline,
    Orderdetail,
    ProductEditForm,
    ProductService,
    ProductlineService,
    Product,
    UriUtils
} from '../../core';

describe("productService test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                ProductService,
                ProductlineService,
            ]
        });
    });

    it("should return expectedProducts from ProductService.getProductList()", async(
        inject([ProductService, HttpTestingController], (service: ProductService, backend: HttpTestingController) => {
            const expectedProducts: Product[] = [
                new Product({id:0, title: 'John'}),
                new Product({id:1, title: 'Doe'})
            ];

            const params = {};
            service.getProductList(params).subscribe(rows => {
                expect(rows.length).toBe(expectedProducts.length);
                expect(rows).toEqual(expectedProducts);
            });

            let url = UriUtils.toUrlParams('products/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedProducts);
        })
    ));

    it("ProductService.ProductList() should throw exception for 401 Unauthorized", async(
        inject([ProductService, HttpTestingController], (service: ProductService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getProductList(params).subscribe(
                rows => fail('expected an error, not products'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('products/list', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

});
