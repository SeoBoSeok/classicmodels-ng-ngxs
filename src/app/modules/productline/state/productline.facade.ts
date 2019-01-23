/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { 
    Productline, ProductlineService,
    ProductlineEditForm,
    HttpFacade,
    CoreModule
} from '../../../core';

const NUM_ROWS = 10;

@Injectable()
export class ProductlineFacade {
    createdProductline$ = new Subject<Productline>();
    productline$ = new Subject<Productline>();	// result of find
    productlines$ = new Subject<Array<Productline>>();	// result of query

    updateSuccess$ = new Subject<string>();
    updateFailure$ = new Subject<string>();
    destroySuccess$ = new Subject<string>();
    destroyFailure$ = new Subject<string>();

    productlineList$ = new Subject<Array<Productline>>();
    productlineListError$ = new Subject<string>();
    productlineList = [];
    hasMoreProductlineList$ = new Subject<boolean>();
    productlineShow$ = new Subject<Productline>();

    initProductlineEditForm$ = new Subject<ProductlineEditForm>();
    loadProductlineEditForm$ = new Subject<ProductlineEditForm>();
    saveProductlineEditForm$ = new Subject<ProductlineEditForm>();

    initProductlineEditFail$ = new Subject<string>();
    loadProductlineEditFail$ = new Subject<string>();
    saveProductlineEditFail$ = new Subject<string>();

    constructor(private productlineService: ProductlineService, private httpFacade: HttpFacade) {}

    create(row: Productline) {
        this.productlineService.create(row)
            .subscribe(
                res => this.createdProductline$.next(res),
                err => console.log("Error on create Productline: ", err)
            );
    }

    find(conditions: any) {
        this.productlineService.find(conditions.productLine)
            .subscribe(
                res => this.productline$.next(res),
                err => console.log("Error on find Productline: ", err)
            );
    }

    query(conditions: any) {
        this.productlineService.query(conditions)
            .subscribe(
                res => this.productlines$.next(res),
                err => console.log("Error on query Productline: ", err)
            );
    }

    update(columns: any, conditions: any) {
        this.productlineService.update(columns, conditions)
            .subscribe(
                res => this.updateSuccess$.next(res),
                err => this.updateFailure$.next(err)
            );
    }

    destroy(conditions: any) {
        this.productlineService.delete(conditions)
            .subscribe(
                res => this.destroySuccess$.next(res),
                err => this.destroyFailure$.next(err)
            );
    }

    getProductlineList(conditions: any) {
        const pageSize: number = conditions["num-rows"] || NUM_ROWS;
        const pageNo = conditions['page-no'];
        this.productlineService.getProductlineList(conditions)
            .subscribe(
                rows => {
                    if (!pageNo || pageNo === 1) {
                        this.productlineList = [...rows];
                    } else {
                        this.productlineList = [...this.productlineList, ...rows];
                    }
                    this.productlineList$.next(this.productlineList);
                    this.hasMoreProductlineList$.next((rows.length >= pageSize));
                },
                err => {
                    console.log("Error on ProductlineList: ", err);
                    this.productlineListError$.next(JSON.stringify(err));
                }
            );
    }

    getProductlineShow(conditions: any) {
        this.productlineService.getProductlineShow(conditions.productLine)
            .subscribe(
                res => this.productlineShow$.next(res),
                err => console.log("Error on ProductlineShow: ", err)
            );
    }

    initProductlineEdit(ef?: ProductlineEditForm) {
        this.productlineService.getNewProductlineEdit()
            .subscribe(
                res => this.initProductlineEditForm$.next(res),
                err => this.initProductlineEditFail$.next(JSON.stringify(err))
            );
    }
    initProductlineEditByEditForm(ef: ProductlineEditForm) {
        this.productlineService.getProductlineEdit(ef)
            .subscribe(
                res => this.initProductlineEditForm$.next(res),
                err => this.initProductlineEditFail$.next(JSON.stringify(err))
            );
    }
    getProductlineEdit(conditions: any) {
        this.productlineService.getProductlineEditBy(conditions.productLine)
            .subscribe(
                res => this.loadProductlineEditForm$.next(res),
                err => this.loadProductlineEditFail$.next(JSON.stringify(err))
            );
    }
    saveProductlineEdit(ef: ProductlineEditForm) {
        this.productlineService.saveProductlineEdit(ef)
            .subscribe(
                res => this.saveProductlineEditForm$.next(res),
                err => this.saveProductlineEditFail$.next(JSON.stringify(err))
            );
    }

    newProductlineAdded() {
        // FIXME: //this.store.dispatch(new productlineActions.NewProductlineAddedAction());
    }
}
