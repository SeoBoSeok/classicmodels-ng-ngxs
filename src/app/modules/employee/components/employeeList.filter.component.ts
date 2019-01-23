/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map, takeWhile, skip, tap } from 'rxjs/operators';

import { 
    Employee,
    EmployeeService,
    ArrayUtils,
    DateUtils,
    StringUtils,
    CoreModule
} from '../../../core';

@Component({
    selector: 'employee-list-filter',
    templateUrl: 'employeeList.filter.component.html',
    styleUrls: ['employeeList.filter.css']
})
export class EmployeeListFilterComponent implements OnInit {

    lastName: string;

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
        if (this.lastName) {
            keys.lastName = this.lastName;
        }
        if (!ArrayUtils.isEmpty(keys)) {
            this.filtering.emit(keys);
        }
    }
}
