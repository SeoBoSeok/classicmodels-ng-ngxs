/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import { CustomerFacade } from '../state/customer.facade';
import {
    SERVER_HOST,
    Customer,
    Employee,
    Order,
    Payment,
    CustomerService,
    ArrayUtils,
    ChartUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractFilterableComponent } from '../../abstract.filterable.component';

@Component({
    selector: 'customer-payment-statistics',
    templateUrl: 'customerPaymentStatistic.component.table.html'
})
export class CustomerPaymentStatisticComponent extends AbstractFilterableComponent<Customer> implements OnInit, OnDestroy {

    customers: Customer[];
    customer: Customer;
    @ViewChildren(BaseChartDirective) charts !: QueryList<BaseChartDirective>;
    lineChartDatas: Array<any> = [
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
        {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
    ];
    lineChartLabels: Array<any> = [
        'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    ];
    lineChartChartOptions = {
        responsive: true, 
        spanGaps: true
    };
    lineChartLegend:boolean = true;
    barChartDatas: Array<any> = [
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
        {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
    ];
    barChartLabels: Array<any> = [
        'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    ];
    barChartChartOptions = {
        responsive: true, 
        spanGaps: true
    };
    barChartLegend:boolean = true;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private customerFacade: CustomerFacade
    ) {
        super();

        customerFacade.customerPaymentStatistic$.pipe(
                takeWhile(() => this.isAlived),
                filter(customers => !!customers && customers.length > 0),
                distinctUntilChanged()
            ,tap(customers => {
                this.setupLineChartData(customers);
                this.setupBarChartData(customers);
            })
            )
            .subscribe(customers => this.customers = customers);

    }
    ngOnInit() {
        this.initLoadByParams(this.route);
    }

    protected setConditionsToObserver(conditions: any): void {
        this.customerFacade.getCustomerPaymentStatistic(conditions);
    }

    protected setupLineChartData(customers: Array<Customer>) {
        let map: any = {};
        let series: Array<string> = [];
        let labels: Array<string> = [];
        customers.forEach(customer => {
            if (!customer.payments[0].paymentDate) {
                return;
            }
            let z: string = customer.customerNumber.toString();
            let x: string = customer.payments[0].paymentDate.toLocaleString();
            let y: number = customer.__xtra__['Amount'];
            map[x] = (map[x] || {});
            map[x][z] = y;
            if (!series.find(e => e == z)) {
                series.push(z);
            }
            if (!labels.find(e => e == x)) {
                labels.push(x);
            }
        });

        labels.sort();
        const chartDatas0 = ChartUtils.ng2ChartsDatasTo(map, series, labels);
        const chartDatas1 = ChartUtils.applyColors(chartDatas0, []);
        this.refreshChart(this.charts.toArray()[0], labels, chartDatas1);
    }

    protected setupBarChartData(customers: Array<Customer>) {
        let map: any = {};
        let series: Array<string> = [];
        let labels: Array<string> = [];
        customers.forEach(customer => {
            if (!customer.payments[0].paymentDate) {
                return;
            }
            let z: string = customer.customerNumber.toString();
            let x: string = customer.payments[0].paymentDate.toLocaleString();
            let y: number = customer.__xtra__['Amount'];
            map[x] = (map[x] || {});
            map[x][z] = y;
            if (!series.find(e => e == z)) {
                series.push(z);
            }
            if (!labels.find(e => e == x)) {
                labels.push(x);
            }
        });

        labels.sort();
        const chartDatas0 = ChartUtils.ng2ChartsDatasTo(map, series, labels);
        const chartDatas1 = ChartUtils.applyColors(chartDatas0, []);
        this.refreshChart(this.charts.toArray()[1], labels, chartDatas1);
    }

    private refreshChart(chart, labels, datas) {
        setTimeout(() => {
            if (chart && chart.chart && chart.chart.config) {
                chart.chart.config.data.labels = labels;
                chart.chart.config.data.datasets = datas;
                chart.chart.update();
            }
        });
    }

}
