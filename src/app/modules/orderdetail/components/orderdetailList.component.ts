/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { OrderdetailFacade } from '../state/orderdetail.facade';
import {
    SERVER_HOST,
    Orderdetail,
    Order,
    Product,
    OrderdetailService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractListComponent } from '../../abstract.list.component';

@Component({
    selector: 'orderdetail-list',
    templateUrl: 'orderdetailList.component.html'
})
export class OrderdetailListComponent extends AbstractListComponent<Orderdetail> implements OnInit, OnDestroy {

    orderdetails: Orderdetail[];
    orderdetail: Orderdetail;
    orderdetailListTitles: Array<string> = [
        'quantityOrdered', 'priceEach', 'orderLineNumber'
    ];
    orderdetailListLabels: any = {
        quantityOrdered: 'quantityOrdered', priceEach: 'priceEach', orderLineNumber: 'orderLineNumber'
    };
    orderdetailListColumns: Array<string | any> = [
        'quantityOrdered', 'priceEach', 'orderLineNumber'
    ];

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private orderdetailFacade: OrderdetailFacade
    ) {
        super();

        orderdetailFacade.orderdetailList$.pipe(
                takeWhile(() => this.isAlived),
                filter(orderdetails => !!orderdetails && orderdetails.length > 0),
                distinctUntilChanged()
            )
            .subscribe(orderdetails => this.orderdetails = orderdetails);

        orderdetailFacade.hasMoreOrderdetailList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(hasMore => this.hasMoreRows = hasMore)
            ;
    }

    ngOnInit() {
        this.initLoadByParams(this.route);
    }

    protected setConditionsToObserver(conditions: any): void {
        this.orderdetailFacade.getOrderdetailList(conditions);
    }

    /**
    * this row just selected for edit task or for embedded tasks.
    */
    rowSelected(orderdetail: Orderdetail) : void {
        this.router.navigate(['orderdetails/show', {orderNumber: orderdetail.orderNumber, productCode: orderdetail.productCode}]);
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
     * @params: orderdetail
     */
    onClickToSpecificRow(orderdetail) {
        this.rowSelected(orderdetail);
    }

    /**
     * params: {row: orderdetail, button: string}
     */
    onClickButtonToRow(params) {
        const orderdetail = params.row;
        const button = params.button;
        if ('Show' === button) {
            this.router.navigate(['orderdetails/show', {orderNumber: orderdetail.orderNumber, productCode: orderdetail.productCode}]);
        }
        else if ('Edit' === button) {
            this.router.navigate(['orderdetails/edit', {orderNumber: orderdetail.orderNumber, productCode: orderdetail.productCode}]);
        }
        else if ('Delete' === button) {
            this.destroy(orderdetail);
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

    destroy(orderdetail:Orderdetail): void {
        let answer = confirm("CAUTION: Are you sure to delete this orderdetail?");
        if (answer != true) {
            return;
        }
        this.orderdetailFacade.destroy({orderNumber: orderdetail.orderNumber,productCode: orderdetail.productCode});
        this.orderdetailFacade.destroySuccess$
            .pipe(take(1))
            .subscribe(json => {
                console.log('destroy result: '+JSON.stringify(json));
                this.filtering(null);
            });
        this.orderdetailFacade.destroyFailure$
            .pipe(take(1))
            .subscribe(err => this.showError(err));
    }

}

