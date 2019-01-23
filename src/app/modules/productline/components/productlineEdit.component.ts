/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { ProductlineFacade } from '../state/productline.facade';
import {
    SERVER_HOST,
    Env,
    UPLOAD_URL,
    Productline,
    Product,
    ProductlineEditForm,
    UploadService,
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
    selector: 'productline-edit',
    templateUrl: 'productlineEdit.component.html',
    styleUrls: ['productlineEdit.css']
})
export class ProductlineEditComponent extends AbstractTaskComponent<Productline> implements OnInit, OnDestroy {

    ef: ProductlineEditForm;
    percentToUploaded: number = 0;

    @Input() productLine: string;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private uploadService: UploadService,
        private productlineFacade: ProductlineFacade
    ) {
        super();

        productlineFacade.initProductlineEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(
                ef => this.setEditForm(ef),
                err=> this.showError(err)
            );

        productlineFacade.loadProductlineEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => this.ef = ef)
            ;

        productlineFacade.productline$.pipe(
            takeWhile(() => this.isAlived)
            ,map(productline => {
                const ef: ProductlineEditForm = new ProductlineEditForm();
                ef.productline = productline;
                return ef;
            })
            ).subscribe(
                ef => this.productlineFacade.initProductlineEditByEditForm(ef),
                err=> this.showError(err)
            );

        productlineFacade.saveProductlineEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(ef => {
                if (ef.errors && !ArrayUtils.isEmpty(ef.errors)) {
                    console.log('validation fail: '+JSON.stringify(ef.errors));
                    this.ef = ef;
                } else {
                    const productline = ef.productline;
                    this.router.navigate(["productlines/list"])
                }
            }, err => alert('Error: ' + err))
            ;

        productlineFacade.loadProductlineEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

        productlineFacade.saveProductlineEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ).subscribe(err => this.showError(err))
            ;

    }

    ngOnInit() {
        this.initLoadByParams();
    }

    protected initForNewEdit() {
        const ef: ProductlineEditForm = new ProductlineEditForm();
        ef.productline = new Productline();
        this.productlineFacade.initProductlineEditByEditForm(ef);
    }

    protected initLoadByParams() {
        let ef: ProductlineEditForm = new ProductlineEditForm();
        // for arguments with attributes in tag.
        if (this.productLine) {
            this.productlineFacade.find({productLine: this.productLine});
            return;
        }
        // for arguments with url
        this.route.params.subscribe(params => {
            let productLine = params['productLine'];
            if (productLine) {
                this.productlineFacade.find({productLine: productLine});

                return;
            }
            ef.productline = new Productline();
            this.setEditForm(ef);
        });
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

    selectImageFile($event): void {
        this.uploadFile($event, (url) => this.ef.image = url);
    }

    onSubmit(): void {
        this.ef.productLine = this.productLine;
        this.productlineFacade.saveProductlineEdit(this.ef);
    }

    protected setEditForm(ef: ProductlineEditForm): void {
        const ef2 = Object.assign({}, ef);
        ef2.productline = new Productline(ef.productline);
        this.ef = ef2;
    }

}

