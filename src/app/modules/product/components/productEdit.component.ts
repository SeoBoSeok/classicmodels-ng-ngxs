/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { ProductFacade } from '../state/product.facade';
import {
    SERVER_HOST,
    Env,
    UPLOAD_URL,
    Product,
    Productline,
    Orderdetail,
    ProductEditForm,
    UploadService,
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
    selector: 'product-edit',
    templateUrl: 'productEdit.component.html',
    styleUrls: ['productEdit.css']
})
export class ProductEditComponent extends AbstractTaskComponent<Product> implements OnInit, OnDestroy {

    ef: ProductEditForm;
    percentToUploaded: number = 0;

    @Input() productCode: string;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private uploadService: UploadService,
        private productFacade: ProductFacade
    ) {
        super();

        productFacade.initProductEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(
                ef => this.setEditForm(ef),
                err=> this.showError(err)
            );

        productFacade.loadProductEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => this.ef = ef)
            ;

        productFacade.product$.pipe(
            takeWhile(() => this.isAlived)
            ,map(product => {
                const ef: ProductEditForm = new ProductEditForm();
                ef.product = product;
                return ef;
            })
            ).subscribe(
                ef => this.productFacade.initProductEditByEditForm(ef),
                err=> this.showError(err)
            );

        productFacade.saveProductEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(ef => {
                if (ef.errors && !ArrayUtils.isEmpty(ef.errors)) {
                    console.log('validation fail: '+JSON.stringify(ef.errors));
                    this.ef = ef;
                } else {
                    const product = ef.product;
                    this.router.navigate(["products/list"])
                }
            }, err => alert('Error: ' + err))
            ;

        productFacade.loadProductEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

        productFacade.saveProductEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

    }

    ngOnInit() {
        this.initLoadByParams();
    }

    protected initForNewEdit() {
        const ef: ProductEditForm = new ProductEditForm();
        ef.product = new Product();
        this.productFacade.initProductEditByEditForm(ef);
    }

    protected initLoadByParams() {
        let ef: ProductEditForm = new ProductEditForm();
        // for arguments with attributes in tag.
        if (this.productCode) {
            this.productFacade.find({productCode: this.productCode});
            return;
        }
        // for arguments with url
        this.route.params.subscribe(params => {
            let productCode = params['productCode'];
            if (productCode) {
                this.productFacade.find({productCode: productCode});

                return;
            }
            ef.product = new Product();
            this.productFacade.initProductEditByEditForm(ef);
        });
    }

    get selectedProductline() {
        return this.ef.product.productline;
    }

    set selectedProductline(productline: Productline) {
        this.ef.product.productline = productline;
        this.ef.product.productLine = productline.productLine
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
        this.ef.productCode = this.productCode;
        this.productFacade.saveProductEdit(this.ef);
    }

    protected setEditForm(ef: ProductEditForm): void {
        const ef2 = Object.assign({}, ef);
        ef2.product = new Product(ef.product);
        this.ef = ef2;
    }

}
