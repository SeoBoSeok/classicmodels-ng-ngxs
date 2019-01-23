/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { ProductFacade } from '../state/product.facade';
import {
    SERVER_HOST,
    Product,
    Productline,
    Orderdetail,
    ProductService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractListComponent } from '../../abstract.list.component';

@Component({
    selector: 'product-list',
    templateUrl: 'productList.component.html'
})
export class ProductListComponent extends AbstractListComponent<Product> implements OnInit, OnDestroy {

    products: Product[];
    product: Product;
    productListTitles: Array<string> = [
        'productCode', 'productName', 'productScale', 'productVendor', 'productDescription', 'quantityInStock', 'buyPrice', 'msrp'
    ];
    productListLabels: any = {
        productCode: 'productCode', productName: 'productName', productScale: 'productScale', productVendor: 'productVendor', productDescription: 'productDescription', quantityInStock: 'quantityInStock', buyPrice: 'buyPrice', msrp: 'MSRP'
    };
    productListColumns: Array<string | any> = [
        'productCode', 'productName', 'productScale', 'productVendor', 'productDescription', 'quantityInStock', 'buyPrice', 'msrp'
    ];

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private productFacade: ProductFacade
    ) {
        super();

        productFacade.productList$.pipe(
                takeWhile(() => this.isAlived),
                filter(products => !!products && products.length > 0),
                distinctUntilChanged()
            )
            .subscribe(products => this.products = products);

        productFacade.hasMoreProductList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(hasMore => this.hasMoreRows = hasMore)
            ;
    }

    ngOnInit() {
        this.initLoadByParams(this.route);
    }

    protected setConditionsToObserver(conditions: any): void {
        this.productFacade.getProductList(conditions);
    }

    /**
    * this row just selected for edit task or for embedded tasks.
    */
    rowSelected(product: Product) : void {
        this.router.navigate(['products/show', {productCode: product.productCode}]);
    }
    buttonsToEachRows(): Array<string> | undefined {
        const arr: Array<string> = [];
        if (this.isShowable()) {
            arr.push('Show');
        }
        if (this.isEditable()) {
            arr.push('Edit');
            arr.push('Delete');
        }
        return arr.length === 0 ? undefined : arr;
    }

    /**
     * @params: product
     */
    onClickToSpecificRow(product) {
        this.rowSelected(product);
    }

    /**
     * params: {row: product, button: string}
     */
    onClickButtonToRow(params) {
        const product = params.row;
        const button = params.button;
        if ('Show' === button) {
            this.router.navigate(['products/show', {productCode: product.productCode}]);
        }
        else if ('Edit' === button) {
            this.router.navigate(['products/edit', {productCode: product.productCode}]);
        }
        else if ('Delete' === button) {
            this.destroy(product);
        }
    }

    isShowable() : boolean {
        return this.isNotEmbedded();
    }

    isEditable() : boolean  {
        return this.isNotEmbedded();
    }

    isDeletable() : boolean  {
        return this.isEditable();
    }

    destroy(product:Product): void {
        let answer = confirm("CAUTION: Are you sure to delete this product?");
        if (answer != true) {
            return;
        }
        this.productFacade.destroy({productCode: product.productCode});
        this.productFacade.destroySuccess$
            .pipe(take(1))
            .subscribe(json => {
                console.log('destroy result: '+JSON.stringify(json));
                this.filtering(null);
            });
        this.productFacade.destroyFailure$
            .pipe(take(1))
            .subscribe(err => this.showError(err));
    }

}
