/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { 
    Product, ProductService,
    ProductEditForm,
    HttpFacade,
    CoreModule
} from '../../../core';

const NUM_ROWS = 10;

@Injectable()
export class ProductFacade {
    createdProduct$ = new Subject<Product>();
    product$ = new Subject<Product>();	// result of find
    products$ = new Subject<Array<Product>>();	// result of query

    updateSuccess$ = new Subject<string>();
    updateFailure$ = new Subject<string>();
    destroySuccess$ = new Subject<string>();
    destroyFailure$ = new Subject<string>();

    productList$ = new Subject<Array<Product>>();
    productListError$ = new Subject<string>();
    productList = [];
    hasMoreProductList$ = new Subject<boolean>();
    productShow$ = new Subject<Product>();

    initProductEditForm$ = new Subject<ProductEditForm>();
    loadProductEditForm$ = new Subject<ProductEditForm>();
    saveProductEditForm$ = new Subject<ProductEditForm>();

    initProductEditFail$ = new Subject<string>();
    loadProductEditFail$ = new Subject<string>();
    saveProductEditFail$ = new Subject<string>();

    constructor(private productService: ProductService, private httpFacade: HttpFacade) {}

    create(row: Product) {
        this.productService.create(row)
            .subscribe(
                res => this.createdProduct$.next(res),
                err => console.log("Error on create Product: ", err)
            );
    }

    find(conditions: any) {
        this.productService.find(conditions.productCode)
            .subscribe(
                res => this.product$.next(res),
                err => console.log("Error on find Product: ", err)
            );
    }

    query(conditions: any) {
        this.productService.query(conditions)
            .subscribe(
                res => this.products$.next(res),
                err => console.log("Error on query Product: ", err)
            );
    }

    update(columns: any, conditions: any) {
        this.productService.update(columns, conditions)
            .subscribe(
                res => this.updateSuccess$.next(res),
                err => this.updateFailure$.next(err)
            );
    }

    destroy(conditions: any) {
        this.productService.delete(conditions)
            .subscribe(
                res => this.destroySuccess$.next(res),
                err => this.destroyFailure$.next(err)
            );
    }

    getProductList(conditions: any) {
        const pageSize: number = conditions["num-rows"] || NUM_ROWS;
        const pageNo = conditions['page-no'];
        this.productService.getProductList(conditions)
            .subscribe(
                rows => {
                    if (!pageNo || pageNo === 1) {
                        this.productList = [...rows];
                    } else {
                        this.productList = [...this.productList, ...rows];
                    }
                    this.productList$.next(this.productList);
                    this.hasMoreProductList$.next((rows.length >= pageSize));
                },
                err => {
                    console.log("Error on ProductList: ", err);
                    this.productListError$.next(JSON.stringify(err));
                }
            );
    }

    getProductShow(conditions: any) {
        this.productService.getProductShow(conditions.productCode)
            .subscribe(
                res => this.productShow$.next(res),
                err => console.log("Error on ProductShow: ", err)
            );
    }

    initProductEdit(ef?: ProductEditForm) {
        this.productService.getNewProductEdit()
            .subscribe(
                res => this.initProductEditForm$.next(res),
                err => this.initProductEditFail$.next(JSON.stringify(err))
            );
    }
    initProductEditByEditForm(ef: ProductEditForm) {
        this.productService.getProductEdit(ef)
            .subscribe(
                res => this.initProductEditForm$.next(res),
                err => this.initProductEditFail$.next(JSON.stringify(err))
            );
    }
    getProductEdit(conditions: any) {
        this.productService.getProductEditBy(conditions.productCode)
            .subscribe(
                res => this.loadProductEditForm$.next(res),
                err => this.loadProductEditFail$.next(JSON.stringify(err))
            );
    }
    saveProductEdit(ef: ProductEditForm) {
        this.productService.saveProductEdit(ef)
            .subscribe(
                res => this.saveProductEditForm$.next(res),
                err => this.saveProductEditFail$.next(JSON.stringify(err))
            );
    }

    newProductAdded() {
        // FIXME: //this.store.dispatch(new productActions.NewProductAddedAction());
    }
}
