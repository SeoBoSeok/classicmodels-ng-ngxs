/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { CustomerFacade } from '../state/customer.facade';
import {
    SERVER_HOST,
    Customer,
    Employee,
    Order,
    Payment,
    CustomerService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { DataTableComponent } from '../../../shared';
import { AbstractListComponent } from '../../abstract.list.component';

@Component({
    selector: 'customer-list',
    templateUrl: 'customerList.component.html'
})
export class CustomerListComponent extends AbstractListComponent<Customer> implements OnInit, OnDestroy {

    @ViewChild(DataTableComponent) paginateDelegator: DataTableComponent;
    totalRows: number;
    customers: Customer[];
    customer: Customer;
    customerListTitles: Array<string> = [
        'customerName', 'city', 'country'
    ];
    customerListLabels: any = {
        customerName: 'customerName', city: 'city', country: 'country'
    };
    customerListColumns: Array<string | any> = [
        'customerName', 'city', 'country'
    ];
    customerListOrderableColumns: Array<string> = [
        'customerName', 'city'
    ];

    protected orderToColumns: any = {};

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private customerFacade: CustomerFacade
    ) {
        super();

        customerFacade.customerList$.pipe(
                takeWhile(() => this.isAlived),
                filter(customers => !!customers && customers.length > 0),
                distinctUntilChanged()
            )
            .subscribe(customers => this.customers = customers);

        this.customerFacade.selectedCustomerInCustomerList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(customer => this.customer = customer)
            ;

        customerFacade.countOfCustomerList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(totalRows => this.totalRows = totalRows)
            ;
    }

    ngOnInit() {
        this.orderToColumns['customerName'] = 'asc';
        this.orderToColumns['city'] = 'asc';
        this.initLoadByParams(this.route);
    }

    createFilterToEmbeddedTasks(customer: Customer) {
        this.customerFacade.selectedCustomerInCustomerList(customer);
    }

    protected setConditionsToObserver(conditions: any): void {
        this.customerFacade.getCustomerList(conditions);
    }

    /**
    * this row just selected for edit task or for embedded tasks.
    */
    rowSelected(customer: Customer) : void {
        this.createFilterToEmbeddedTasks(customer);
    }

    /**
     * params: {name: string, order: number}
     */
    onOrdering(params) {
        const order: string = (params.order > 0 ? 'asc' : 'desc');
        this.filter['order-by'] = params.name + ' ' + order;
        this.loadFirstPage();
    }

    /**
     * @params: customer
     */
    onClickToSpecificRow(customer) {
        this.rowSelected(customer);
    }

    protected loadFirstPage(): void {
        this.customerFacade.getCountOfCustomerList(this.getReadConditions());
        super.loadFirstPage();
        this.paginateDelegator.firstPage();
    }

    onPaginate(e: PageEvent) {
        //console.log(JSON.stringify(e));
        if (this.pageNo != (e.pageIndex+1) || this.pageSize != e.pageSize) {
            this.pageNo = (e.pageIndex+1);
            this.pageSize = e.pageSize;
            this.loadPage();
        }
    }

}

