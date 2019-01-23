/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

import { ProductlineFacade } from '../state/productline.facade';
import {
    SERVER_HOST,
    Productline,
    Product,
    ProductlineService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
  selector: 'productline-show',
  templateUrl: 'productlineShow.component.table.html',
  styleUrls: ['./datashow.css']
})
export class ProductlineShowComponent extends AbstractTaskComponent<Productline> implements OnInit, OnDestroy {

    @Input() productLine: string;
    @Input() productline: Productline;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private productlineFacade: ProductlineFacade
    ) {
        super();

        productlineFacade.productlineShow$
            .pipe(
                takeWhile(() => this.isAlived),
                filter(productline => !!productline),
                distinctUntilChanged(),
                tap(productline => console.log('productline loaded.', productline))
            )
            .subscribe(productline => this.productline = productline);
    }

    ngOnInit() {
        if (this.productline) {
        } else {
            if (this.productLine) {
                this.loadBy(this.productLine);
            } else {
                this.route.params.subscribe(params => {
                    this.productLine = params['productLine'];
                    if (this.productLine) {
                        this.loadBy(this.productLine);
                    }
                });
            }
        }
    }

    loadBy(productLine: string) {
        this.productlineFacade
            .getProductlineShow({productLine})
                ;
    }

}

