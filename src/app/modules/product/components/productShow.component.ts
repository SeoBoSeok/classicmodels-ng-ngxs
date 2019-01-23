/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

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
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
  selector: 'product-show',
  templateUrl: 'productShow.component.table.html',
  styleUrls: ['./datashow.css']
})
export class ProductShowComponent extends AbstractTaskComponent<Product> implements OnInit, OnDestroy {

    @Input() productCode: string;
    @Input() product: Product;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private productFacade: ProductFacade
    ) {
        super();

        productFacade.productShow$
            .pipe(
                takeWhile(() => this.isAlived),
                filter(product => !!product),
                distinctUntilChanged(),
                tap(product => console.log('product loaded.', product))
            )
            .subscribe(product => this.product = product);
    }

    ngOnInit() {
        if (this.product) {
        } else {
            if (this.productCode) {
                this.loadBy(this.productCode);
            } else {
                this.route.params.subscribe(params => {
                    this.productCode = params['productCode'];
                    if (this.productCode) {
                        this.loadBy(this.productCode);
                    }
                });
            }
        }
    }

    loadBy(productCode: string) {
        this.productFacade
            .getProductShow({productCode})
                ;
    }

}
