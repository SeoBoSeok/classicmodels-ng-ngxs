/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import { OfficeFacade } from '../state/office.facade';
import {
    SERVER_HOST,
    Env,
    UPLOAD_URL,
    Office,
    Employee,
    OfficeEditForm,
    UploadService,
    OfficeService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractTaskComponent } from '../../abstract.task.component';

@Component({
    selector: 'office-edit',
    templateUrl: 'officeEdit.component.html',
    styleUrls: ['officeEdit.css']
})
export class OfficeEditComponent extends AbstractTaskComponent<Office> implements OnInit, OnDestroy {

    ef: OfficeEditForm;
    percentToUploaded: number = 0;

    @Input() officeCode: string;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private uploadService: UploadService,
        private officeFacade: OfficeFacade
    ) {
        super();

        officeFacade.initOfficeEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(
                ef => this.setEditForm(ef),
                err=> this.showError(err)
            );

        officeFacade.loadOfficeEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => this.ef = ef)
            ;

        officeFacade.office$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ,map(office => {
                const ef: OfficeEditForm = new OfficeEditForm();
                ef.office = office;
                return ef;
            })
            ).subscribe(
                ef => this.officeFacade.initOfficeEditByEditForm(ef),
                err=> this.showError(err)
            );

        officeFacade.saveOfficeEditForm$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(ef => {
                if (ef.errors && !ArrayUtils.isEmpty(ef.errors)) {
                    console.log('validation fail: '+JSON.stringify(ef.errors));
                    this.ef = ef;
                } else {
                    const office = ef.office;
                    this.router.navigate(["offices/list"])
                }
            }, err => alert('Error: ' + err))
            ;

        officeFacade.loadOfficeEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(err => this.showError(err))
            ;

        officeFacade.saveOfficeEditFail$.pipe(
            takeWhile(() => this.isAlived)
            ,skip(1)
            ).subscribe(err => this.showError(err))
            ;

    }

    ngOnInit() {
        this.initLoadByParams();
    }

    protected initForNewEdit() {
        const ef: OfficeEditForm = new OfficeEditForm();
        ef.office = new Office();
        this.officeFacade.initOfficeEditByEditForm(ef);
    }

    protected initLoadByParams() {
        let ef: OfficeEditForm = new OfficeEditForm();
        // for arguments with attributes in tag.
        if (this.officeCode) {
            this.officeFacade.find({officeCode: this.officeCode});
            return;
        }
        // for arguments with url
        this.route.params.subscribe(params => {
            let officeCode = params['officeCode'];
            if (officeCode) {
                this.officeFacade.find({officeCode: officeCode});

                return;
            }
            ef.office = new Office();
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

    onSubmit(): void {
        this.ef.officeCode = this.officeCode;
        this.officeFacade.saveOfficeEdit(this.ef);
    }

    protected setEditForm(ef: OfficeEditForm): void {
        const ef2 = Object.assign({}, ef);
        ef2.office = new Office(ef.office);
        this.ef = ef2;
    }

}

