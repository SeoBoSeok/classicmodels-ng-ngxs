/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { OrderFacade } from '../state/order.facade';
import {
    SERVER_HOST,
    Env,
    UPLOAD_URL,
    Order,
    Customer,
    Orderdetail,
    OrderEditForm,
    UploadService,
    OrderService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
    selector: 'order-edit',
    templateUrl: 'orderEdit.component.html',
    styleUrls: ['orderEdit.css']
})
export class OrderEditComponent extends AbstractTaskComponent<Order> implements OnInit, OnDestroy {

    ef: OrderEditForm;
    percentToUploaded: number = 0;

    @Input() orderNumber: number;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private uploadService: UploadService,
        private orderFacade: OrderFacade
    ) {
        super();

        orderFacade.initOrderEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(
                ef => this.setEditForm(ef),
                err=> this.showError(err)
            );

        orderFacade.loadOrderEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => this.ef = ef)
            ;

        orderFacade.order$.pipe(
            takeWhile(() => this.isAlived)
            ,map(order => {
                const ef: OrderEditForm = new OrderEditForm();
                ef.order = order;
                return ef;
            })
            ).subscribe(
                ef => this.orderFacade.initOrderEditByEditForm(ef),
                err=> this.showError(err)
            );

        orderFacade.saveOrderEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(ef => {
                if (ef.errors && !ArrayUtils.isEmpty(ef.errors)) {
                    console.log('validation fail: '+JSON.stringify(ef.errors));
                    this.ef = ef;
                } else {
                    const order = ef.order;
                    this.router.navigate(["orders/list"])
                }
            }, err => alert('Error: ' + err))
            ;

        orderFacade.loadOrderEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

        orderFacade.saveOrderEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

    }

    ngOnInit() {
        this.initLoadByParams();
    }

    protected initForNewEdit() {
        const ef: OrderEditForm = new OrderEditForm();
        ef.order = new Order();
        this.orderFacade.initOrderEditByEditForm(ef);
    }

    protected initLoadByParams() {
        let ef: OrderEditForm = new OrderEditForm();
        // for arguments with attributes in tag.
        if (this.orderNumber) {
            this.orderFacade.find({orderNumber: this.orderNumber});
            return;
        }
        // for arguments with url
        this.route.params.subscribe(params => {
            let orderNumber = +params['orderNumber'];
            if (orderNumber) {
                this.orderFacade.find({orderNumber: orderNumber});

                return;
            }
            ef.order = new Order();
            this.orderFacade.initOrderEditByEditForm(ef);
        });
    }

    get selectedCustomer() {
        return this.ef.order.customer;
    }

    set selectedCustomer(customer: Customer) {
        this.ef.order.customer = customer;
        this.ef.order.customerNumber = customer.customerNumber
    }

    uploadFile(event, callback: (url: string) => void): void {
        this.percentToUploaded = 0;
        this.uploadService.upload(UPLOAD_URL, event.target.files)
            .subscribe(
                res => {
                    if (res.type == HttpEventType.UploadProgress) {
                        this.percentToUploaded = Math.round(100 * res.loaded / res.total);
                    } else if (res instanceof HttpResponse) {
                        console.log('res.body: '+res.body);
                        callback(res.body.url);	//server should return '{"url": "xxx"}'
                    }
                },
                err => {
                    const str = 'Fail to upload: '+err;
                    console.log(str);
                    alert(str);
                }
            );
    }

    onSubmit(): void {
        this.ef.orderNumber = this.orderNumber;
        this.orderFacade.saveOrderEdit(this.ef);
    }

    protected setEditForm(ef: OrderEditForm): void {
        const ef2 = Object.assign({}, ef);
        ef2.order = new Order(ef.order);
        this.ef = ef2;
    }

}

