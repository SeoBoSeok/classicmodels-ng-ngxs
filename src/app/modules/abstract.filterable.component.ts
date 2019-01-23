/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, Subject } from 'rxjs';

import { AbstractTaskComponent } from './abstract.task.component';

import {
    SERVER_HOST,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../core';

export abstract class AbstractFilterableComponent<T> extends AbstractTaskComponent<T> {

    @Input() query: any;

    protected initConditions: any;
    protected filter: any = {};

    protected abstract setConditionsToObserver(conditions: any): void;

    constructor() {
        super();
    }

    protected initLoadByParams(route: ActivatedRoute) {
        this.initConditions = {};
        if (this.query) {
            this.initLoad(this.query);
        } else {
            route.params
                .subscribe(params => this.initLoad(params['query'] || {}));
        }
    }

    protected initLoad(query) {
        if (typeof query === "string") {
            query = JSON.parse(query);
        }
        // every query in this component will use this basic query value.
        // @see getReadConditions().
        this.initConditions = query;
        this.loadFirstPage();
    }

    protected filtering(conditions: any) {
        if (!!conditions) {
            this.filter = conditions;
        }
//console.log("filtering with: "+JSON.stringify(this.filter));
        this.loadFirstPage();
    }

    protected getReadConditions(xtraConditions={}): any {
        return Object.assign(xtraConditions,
            this.initConditions,
            this.filter);
    }

    protected loadFirstPage(): void {
        this.loadPage();
    }

    protected loadPage(xtraConditions={}): void {
        this.setConditionsToObserver(this.getReadConditions(xtraConditions));
    }

}
/*
*/
