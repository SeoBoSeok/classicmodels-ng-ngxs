/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

import { 
    Customer,
    CustomerService,
    ArrayUtils,
    DateUtils,
    StringUtils,
    CoreModule
} from '../../../core';

@Component({
    selector: 'customer-list-filter',
    templateUrl: 'customerList.filter.component.html',
    styleUrls: ['customerList.filter.css']
})
export class CustomerListFilterComponent implements OnInit {

    city: string;
    state: string;

    @Input() params: any;
    @Output() filtering = new EventEmitter();

    constructor () {
    }

    ngOnInit() {
        if (!!this.params) {
            Object.assign(this, this.params);
        }
    }

    onSubmit() {
        const keys: any = {};
        if (this.city) {
            keys.city = this.city;
        }
        if (this.state) {
            keys.state = this.state;
        }
        if (!ArrayUtils.isEmpty(keys)) {
            this.filtering.emit(keys);
        }
    }
}
