/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

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
import { AbstractListComponent } from '../../abstract.list.component';

@Component({
    selector: 'office-list',
    templateUrl: 'officeList.component.html'
})
export class OfficeListComponent extends AbstractListComponent<Office> implements OnInit, OnDestroy {

    offices: Office[];
    office: Office;
    employeeListFilter: any;
    officeListTitles: Array<string> = [
        'officeCode', 'city', 'phone', 'addressLine1', 'addressLine2', 'state', 'country', 'postalCode', 'territory'
    ];
    officeListLabels: any = {
        officeCode: 'officeCode', city: 'city', phone: 'phone', addressLine1: 'addressLine1', addressLine2: 'addressLine2', state: 'state', country: 'country', postalCode: 'postalCode', territory: 'territory'
    };
    officeListColumns: Array<string | any> = [
        'officeCode', 'city', 'phone', 'addressLine1', 'addressLine2', 'state', 'country', 'postalCode', 'territory'
    ];

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private officeFacade: OfficeFacade
    ) {
        super();

        officeFacade.officeList$.pipe(
                takeWhile(() => this.isAlived),
                filter(offices => !!offices && offices.length > 0),
                distinctUntilChanged()
            )
            .subscribe(offices => this.offices = offices);

        this.officeFacade.selectedOfficeInOfficeList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(office => this.office = office)
            ;

        officeFacade.hasMoreOfficeList$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(hasMore => this.hasMoreRows = hasMore)
            ;

        officeFacade.selectedOfficeParamsToEmployeeListInOfficeList$
            .pipe(takeWhile(() => this.isAlived))
            .pipe(
                takeWhile(() => this.isAlived),
                filter(value => !!value),
                distinctUntilChanged()
            )
            .subscribe(employeeListFilter => this.employeeListFilter = employeeListFilter)
            ;
    }

    ngOnInit() {
        this.initLoadByParams(this.route);
    }

    createFilterToEmbeddedTasks(office: Office) {
        this.officeFacade.selectedOfficeInOfficeList(office);
        this.officeFacade.selectedOfficeParamsToEmployeeListInOfficeList({
            "officeCode": office.officeCode
        });
    }

    protected setConditionsToObserver(conditions: any): void {
        this.officeFacade.getOfficeList(conditions);
    }

    /**
    * this row just selected for edit task or for embedded tasks.
    */
    rowSelected(office: Office) : void {
        this.createFilterToEmbeddedTasks(office);
    }

    /**
     * @params: office
     */
    onClickToSpecificRow(office) {
        this.rowSelected(office);
    }

}

