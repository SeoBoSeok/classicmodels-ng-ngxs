/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

import { OfficeFacade } from '../state/office.facade';
import {
    SERVER_HOST,
    Office,
    Employee,
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
  selector: 'office-show',
  templateUrl: 'officeShow.component.table.html',
  styleUrls: ['./datashow.css']
})
export class OfficeShowComponent extends AbstractTaskComponent<Office> implements OnInit, OnDestroy {

    @Input() officeCode: string;
    @Input() office: Office;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private officeFacade: OfficeFacade
    ) {
        super();

        officeFacade.officeShow$
            .pipe(
                takeWhile(() => this.isAlived),
                filter(office => !!office),
                distinctUntilChanged(),
                tap(office => console.log('office loaded.', office))
            )
            .subscribe(office => this.office = office);
    }

    ngOnInit() {
        if (this.office) {
        } else {
            if (this.officeCode) {
                this.loadBy(this.officeCode);
            } else {
                this.route.params.subscribe(params => {
                    this.officeCode = params['officeCode'];
                    if (this.officeCode) {
                        this.loadBy(this.officeCode);
                    }
                });
            }
        }
    }

    loadBy(officeCode: string) {
        this.officeFacade
            .getOfficeShow({officeCode})
                ;
    }

}

