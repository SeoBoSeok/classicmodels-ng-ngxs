/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

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
import { AbstractListComponent } from '../../abstract.list.component';

@Component({
    selector: 'productline-list',
    templateUrl: 'productlineList.component.html'
})
export class ProductlineListComponent extends AbstractListComponent<Productline> implements OnInit, OnDestroy {

    productlines: Productline[];
    productline: Productline;
    productlineListTitles: Array<string> = [
        'productLine', 'textDescription', 'htmlDescription', 'image'
    ];
    productlineListLabels: any = {
        productLine: 'productLine', textDescription: 'textDescription', htmlDescription: 'htmlDescription', image: 'image'
    };
    productlineListColumns: Array<string | any> = [
        'productLine', 'textDescription', 'htmlDescription', 'image'
    ];

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private productlineFacade: ProductlineFacade
    ) {
        super();

        productlineFacade.productlineList$.pipe(
                takeWhile(() => this.isAlived),
                filter(productlines => !!productlines && productlines.length > 0),
                distinctUntilChanged()
            )
            .subscribe(productlines => this.productlines = productlines);

        productlineFacade.hasMoreProductlineList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(hasMore => this.hasMoreRows = hasMore)
            ;
    }

    ngOnInit() {
        this.initLoadByParams(this.route);
    }

    protected setConditionsToObserver(conditions: any): void {
        this.productlineFacade.getProductlineList(conditions);
    }

    /**
    * this row just selected for edit task or for embedded tasks.
    */
    rowSelected(productline: Productline) : void {
        this.router.navigate(['productlines/show', {productLine: productline.productLine}]);
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
     * @params: productline
     */
    onClickToSpecificRow(productline) {
        this.rowSelected(productline);
    }

    /**
     * params: {row: productline, button: string}
     */
    onClickButtonToRow(params) {
        const productline = params.row;
        const button = params.button;
        if ('Show' === button) {
            this.router.navigate(['productlines/show', {productLine: productline.productLine}]);
        }
        else if ('Edit' === button) {
            this.router.navigate(['productlines/edit', {productLine: productline.productLine}]);
        }
        else if ('Delete' === button) {
            this.destroy(productline);
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

    destroy(productline:Productline): void {
        let answer = confirm("CAUTION: Are you sure to delete this productline?");
        if (answer != true) {
            return;
        }
        this.productlineFacade.destroy({productLine: productline.productLine});
        this.productlineFacade.destroySuccess$
            .pipe(take(1))
            .subscribe(json => {
                console.log('destroy result: '+JSON.stringify(json));
                this.filtering(null);
            });
        this.productlineFacade.destroyFailure$
            .pipe(take(1))
            .subscribe(err => this.showError(err));
    }

}

