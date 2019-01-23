/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import {
    Productline,
    Orderdetail,
    ProductEditForm,
    ProductService,
    ProductlineService,
    Product,
    UriUtils,
    CoreModule
} from '../../core';

import { ProductFacade } from '../../modules/product/state/product.facade';

describe("productFacade test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                //ProductModule
                CoreModule
            ],
            providers: [
                ProductFacade
            ]
        });
    });

    it("should return expectedProducts from ProductFacade.getProductList()", async(
        inject([ProductFacade, HttpTestingController], (productFacade: ProductFacade, backend: HttpTestingController) => {
            const expectedProducts: Product[] = [
                new Product({id:0, title: 'John'}),
                new Product({id:1, title: 'Doe'})
            ];

            const params = {};
            productFacade.getProductList(params);
            productFacade.productList$.pipe(
                filter((products: Array<Product>) => !!products && products.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                products => expect(products).toEqual(expectedProducts, 'expected products'),
                fail
            );
            productFacade.hasMoreProductList$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                hasMore => expect(hasMore).not.toBe(true),
                fail
            );

            let url = UriUtils.toUrlParams('products/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedProducts);
        })
    ));

    it("ProductService.ProductList() should throw exception for 401 Unauthorized", async(
        inject([ProductFacade, HttpTestingController], (productFacade: ProductFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            productFacade.getProductList(params);
            productFacade.productListError$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('products/list', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return new ProductEditForm from ProductFacade.initProductEdit()", async(
        inject([ProductFacade, HttpTestingController], (productFacade: ProductFacade, backend: HttpTestingController) => {
            productFacade.initProductEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.product).not.toBeNull();
                },
                fail
            );

            productFacade.initProductEdit();
        })
    ));

    it("should return expected ProductEditForm from ProductFacade.loadProductEdit()", async(
        inject([ProductFacade, HttpTestingController], (productFacade: ProductFacade, backend: HttpTestingController) => {
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

            productFacade.loadProductEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.product).not.toBeNull();
                    expect(ef.product).toEqual(expectedProduct, 'expected Product');
                },
                fail
            );

            productFacade.getProductEdit({
                productCode: "1"
            });

            let url = UriUtils.url("products/find/1");

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedProduct);
        })
    ));

    it("should save edited ProductEditForm with ProductFacade.saveProductEdit()", async(
        inject([ProductFacade, HttpTestingController], (productFacade: ProductFacade, backend: HttpTestingController) => {
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
            const editedProduct: Product = new Product({
                productCode: null,
                productName: "1",
                productScale: "1",
                productVendor: "1",
                productDescription: "1",
                quantityInStock: 1,
                buyPrice: 1,
                msrp: 1,
            });

            productFacade.saveProductEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.product).not.toBeNull();
                    expect(ef.product).toEqual(expectedProduct, 'expected Product');
                },
                fail
            );

            const ef: ProductEditForm = new ProductEditForm();
            ef.product = editedProduct;

            productFacade.saveProductEdit(ef);

            const ef2: ProductEditForm = new ProductEditForm();
            ef2.product = expectedProduct;

            let url = UriUtils.url('products/edit');

            backend.match({
                url: url,
                method: 'POST'
            })[0].flush(ef2);
        })
    ));

});
