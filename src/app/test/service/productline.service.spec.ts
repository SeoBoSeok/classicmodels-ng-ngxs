/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
    Product,
    ProductlineEditForm,
    ProductlineService,
    Productline,
    UriUtils
} from '../../core';

describe("productlineService test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                ProductlineService,
            ]
        });
    });

    it("should return expectedProductlines from ProductlineService.getProductlineList()", async(
        inject([ProductlineService, HttpTestingController], (service: ProductlineService, backend: HttpTestingController) => {
            const expectedProductlines: Productline[] = [
                new Productline({id:0, title: 'John'}),
                new Productline({id:1, title: 'Doe'})
            ];

            const params = {};
            service.getProductlineList(params).subscribe(rows => {
                expect(rows.length).toBe(expectedProductlines.length);
                expect(rows).toEqual(expectedProductlines);
            });

            let url = UriUtils.toUrlParams('productlines/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedProductlines);
        })
    ));

    it("ProductlineService.ProductlineList() should throw exception for 401 Unauthorized", async(
        inject([ProductlineService, HttpTestingController], (service: ProductlineService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getProductlineList(params).subscribe(
                rows => fail('expected an error, not productlines'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('productlines/list', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

});
