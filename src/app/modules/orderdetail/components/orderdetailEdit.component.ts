/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { OrderdetailFacade } from '../state/orderdetail.facade';
import {
    SERVER_HOST,
    Env,
    UPLOAD_URL,
    Orderdetail,
    Order,
    Product,
    OrderdetailEditForm,
    UploadService,
    OrderdetailService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
    selector: 'orderdetail-edit',
    templateUrl: 'orderdetailEdit.component.html',
    styleUrls: ['orderdetailEdit.css']
})
export class OrderdetailEditComponent extends AbstractTaskComponent<Orderdetail> implements OnInit, OnDestroy {

    ef: OrderdetailEditForm;
    percentToUploaded: number = 0;

    @Input() orderNumber: number;
    @Input() productCode: string;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private uploadService: UploadService,
        private orderdetailFacade: OrderdetailFacade
    ) {
        super();

        orderdetailFacade.initOrderdetailEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(
                ef => this.setEditForm(ef),
                err=> this.showError(err)
            );

        orderdetailFacade.loadOrderdetailEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => this.ef = ef)
            ;

        orderdetailFacade.orderdetail$.pipe(
            takeWhile(() => this.isAlived)
            ,map(orderdetail => {
                const ef: OrderdetailEditForm = new OrderdetailEditForm();
                ef.orderdetail = orderdetail;
                return ef;
            })
            ).subscribe(
                ef => this.orderdetailFacade.initOrderdetailEditByEditForm(ef),
                err=> this.showError(err)
            );

        orderdetailFacade.saveOrderdetailEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(ef => {
                if (ef.errors && !ArrayUtils.isEmpty(ef.errors)) {
                    console.log('validation fail: '+JSON.stringify(ef.errors));
                    this.ef = ef;
                } else {
                    const orderdetail = ef.orderdetail;
                    this.router.navigate(["orderdetails/list"])
                }
            }, err => alert('Error: ' + err))
            ;

        orderdetailFacade.loadOrderdetailEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

        orderdetailFacade.saveOrderdetailEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

    }

    ngOnInit() {
        this.initLoadByParams();
    }

    protected initForNewEdit() {
        const ef: OrderdetailEditForm = new OrderdetailEditForm();
        ef.orderdetail = new Orderdetail();
        this.orderdetailFacade.initOrderdetailEditByEditForm(ef);
    }

    protected initLoadByParams() {
        let ef: OrderdetailEditForm = new OrderdetailEditForm();
        // for arguments with attributes in tag.
        if (this.orderNumber && this.productCode) {
            this.orderdetailFacade.find({orderNumber: this.orderNumber, productCode: this.productCode});
            return;
        }
        // for arguments with url
        this.route.params.subscribe(params => {
            let orderNumber = +params['orderNumber'];
            let productCode = params['productCode'];
            if (orderNumber && productCode) {
                this.orderdetailFacade.find({orderNumber: orderNumber, productCode: productCode});

                return;
            }
            ef.orderdetail = new Orderdetail();
            this.orderdetailFacade.initOrderdetailEditByEditForm(ef);
        });
    }

    get selectedOrder() {
        return this.ef.orderdetail.order;
    }

    set selectedOrder(order: Order) {
        this.ef.orderdetail.order = order;
        this.ef.orderdetail.orderNumber = order.orderNumber
    }

    get selectedProduct() {
        return this.ef.orderdetail.product;
    }

    set selectedProduct(product: Product) {
        this.ef.orderdetail.product = product;
        this.ef.orderdetail.productCode = product.productCode
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
        this.ef.productCode = this.productCode;
        this.orderdetailFacade.saveOrderdetailEdit(this.ef);
    }

    protected setEditForm(ef: OrderdetailEditForm): void {
        const ef2 = Object.assign({}, ef);
        ef2.orderdetail = new Orderdetail(ef.orderdetail);
        this.ef = ef2;
    }

}

