/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';

import { ArrayUtils, ObjectUtils, UriUtils } from '../../core';
import { SelectableRow } from './selectableRow';
import { ColumnType } from './columnType';
import { CallableObject } from './callable.object';

@Component({
    selector: 'data-table',
    templateUrl: 'data.table.component.html'
})
/**
 */
export class DataTableComponent implements OnInit {

    @ViewChild(MatPaginator) paginate: MatPaginator;

    hasOrderingHandler: boolean = false;
    hasSelectedRowsHandler: boolean = false;
    hasRowClickHandler: boolean = false;
    hasButtonToEachRowHandler: boolean = false;
    hasReadMoreHandler: boolean = false;

    private allRowSelected: boolean = false;
    private orderToColumns: any = {};
    private orderableColumns: Array<string>;

    // title, data, orderBy, buttonsToSelectedRows, buttonsToEachRows
    @Input() titles: Array<string>;					// required
    @Input() labels: any;							// required
    @Input() columns: Array<string | ColumnType>;	// required
    @Input() totalRows: number;						// required
    @Input() rows: Array<SelectableRow>;			// required
    @Input() orderable: Array<string>;				// optional: for all columns if given ['*']
    @Input() disableControl: boolean;				// optional: disable controls to select rows and buttons to each rows, default is false.
    @Input() pagingType: string;					// optional
    @Input() hasMoreRows: boolean;					// optional
    @Input() buttonsToSelectedRows: Array<string>;	// optional
    @Input() buttonsToEachRows: Array<string>;		// optional: show, edit or delete or something.
    @Input() callable: CallableObject;				// optional: to call methods in parent components.

    @Output() onOrdering = new EventEmitter();			// optional
    @Output() onClickToSelectedRows = new EventEmitter();// optional
    @Output() onClickToSpecificRow = new EventEmitter();// optional: 
    @Output() onClickButtonToRow = new EventEmitter();	// optional: with currentely selected row.
    @Output() onReadMore = new EventEmitter();			// optional
    @Output() onPaginate = new EventEmitter();

    // methods.................................................................

    thumb(url: string): string {
        if (url) {
            const val = url + "_thumb";	// see uploadUtils.(js | java) in backend server.
            return UriUtils.url(val);
        } else {
            return "";
        }
    }

    toDataURL(col): string { 
        if (!!col) {
            return "data:image/jpg;base64,"+col;
        } else {
            return "";
        }
    }

    // query methods...........................................................

    isString(x): boolean {
        return typeof x === "string";
    }

    isImagePathColumn(column): boolean {
        return column.hasOwnProperty("type") && column.type === "image-path";
    }

    isImageTypeColumn(column): boolean {
        return column.hasOwnProperty("type") && column.type === "image-type";
    }

    isAudioColumn(column): boolean {
        return column.hasOwnProperty("type") && (column.type === "audio-path" || column.type === "audio-type");
    }

    isVideoColumn(column): boolean {
        return column.hasOwnProperty("type") && (column.type === "video-path" || column.type === "audio-type");
    }

    isTimestampColumn(column): boolean {
        return column.hasOwnProperty("type") && column.type === "timestamp-type";
    }

    isTimeColumn(column): boolean {
        return column.hasOwnProperty("type") && column.type === "time-type";
    }

    isDateColumn(column): boolean {
        return column.hasOwnProperty("type") && column.type === "date-type";
    }

    isFormulaColumn(column): boolean {
        return column.hasOwnProperty("type") && column.type === "formula";
    }

    isChainColumn(column): boolean {
        return column.hasOwnProperty("type") && column.type === "chain";
    }

    isCallColumn(column): boolean {
        return column.hasOwnProperty("type") && column.type === "call";
    }

    isRegularColumn(column): boolean {
        return typeof column === "string";
    }

    chain(row, chain) {
        const names = chain.split(".");
        let val = row;
        names.forEach(name => val = val[name]);
        return val;
    }

    call(row, methodName) {
        if (this.callable) {
            return this.callable.call(methodName, row);
        }
        return '';
    }

    isExistsSelectedRows(): boolean {
        return !!this.rows.find(row => row.isSelected());
    }

    fireSelectedRows(label: string): boolean {
        if (this.hasSelectedRowsHandler) {
            this.onClickToSelectedRows.emit({
                rows: this.rows.filter(row => row.isSelected()),
                button: label
            });
        }
        return false;
    }

    hasButtonsToSelectRows(): boolean {
        return this.hasSelectedRowsHandler && (!!this.buttonsToSelectedRows);
    }

    hasButtonsToEachRows(): boolean {
        return this.hasButtonToEachRowHandler && (!!this.buttonsToEachRows);
    }

    /**
    * selected by check-box
    */
    checkThisRow(row: SelectableRow): void {
        row.setSelected(!row.isSelected());
        this.checkAllRowsSelected();
    }

    protected checkAllRowsSelected(): void {
        this.allRowSelected = !(this.rows.find(row => !row.isSelected()));
    }

    selectAllRows(): void {
        this.allRowSelected = !this.allRowSelected;
        this.rows.forEach(row => {
            row.setSelected(this.allRowSelected)
        });
    }

    /**
    * selected by click each rows.
    */
    clickThisRow(row: SelectableRow) : void {
        if (this.hasRowClickHandler) {
            this.onClickToSpecificRow.emit(row);
        }
    }

    doSomethingWithRow(row: SelectableRow, label: string): void {
        if (this.hasButtonToEachRowHandler) {
            this.onClickButtonToRow.emit({
                row: row,
                button: label
            });
        }
    }

    readMoreRows(): void {
        if (this.hasReadMoreHandler) {
            this.onReadMore.emit();
        }
    }

    pageChanged(e: PageEvent): void {
        this.onPaginate.emit(e);
    }

    firstPage(): void {
        if (this.paginate) {
            this.paginate.firstPage();
        }
    }

    isOrderableColumn(columnName: string): boolean {
        return this.hasOrderingHandler && this.orderableColumns.includes(columnName);
    }

    orderBy(columnName: string) {
        if (this.isOrderableColumn(columnName)) {
            const currentOrder = -(this.orderToColumns[columnName]);
            this.onOrdering.emit({
                name: columnName,
                order: currentOrder
            });
            this.orderToColumns[columnName] = currentOrder;
        }
    }

    columnName(col): string {
        return this.isRegularColumn(col) ? col : col.name;
    }

    columnLabel(col): string {
        const key = this.isRegularColumn(col) ? col : col.name;
        return this.labels ? this.labels[key] : key;
    }

    upOrDownTo(columnName: string): string {
        if (this.isOrderableColumn(columnName)) {
            let order: number = this.orderToColumns[columnName];
            return (order > 0 ? 'arrow_drop_down' : 'arrow_drop_up');
        } else {
            return "";
        }
    }

    private required(var0, err) {
        if (!var0) {
            throw new Error("missing required field: "+err);
        }
    }
    constructor() {
    }

    ngOnInit() {
        this.required(this.titles, "titles");
        this.required(this.columns, "columns");
        this.hasMoreRows = !!this.hasMoreRows;
        this.disableControl = !!this.disableControl;

        this.hasSelectedRowsHandler = 
            (!this.disableControl) && this.onClickToSelectedRows.observers.length > 0;
        this.hasButtonToEachRowHandler =
            (!this.disableControl) && this.onClickButtonToRow.observers.length > 0;

        this.hasRowClickHandler = this.onClickToSpecificRow.observers.length > 0;

        this.hasOrderingHandler = this.onOrdering.observers.length > 0;
        this.hasReadMoreHandler = this.onReadMore.observers.length > 0;

        this.orderToColumns = {};
        if (this.hasOrderingHandler) {
            if (this.orderable) {
                this.orderableColumns = [];
                if (this.orderable.length === 1 && (this.orderable[0] === '*')) {	// for all columns?
                    this.columns.forEach(column => {
                        // cname => string | {type: xxx, name: columnName}
                        if (typeof column !== "string") {
                            column = column.name
                        }
                        this.orderToColumns[column] = 1;	// for ASC
                        this.orderableColumns.push(column);
                    });
                }
                else {
                    this.orderable.forEach(cname => {
                        if (cname.startsWith("-")) {
                            const cname2 = cname.replace(/^-(.*)$/, '$1');
                            this.orderToColumns[cname] = -1		// for DESC
                            this.orderableColumns.push(cname2);
                        } else {
                            this.orderToColumns[cname] = 1		// for ASC
                            this.orderableColumns.push(cname);
                        }
                    });
                }
            }
        }

        // add check-box to each rows to select all if required.
        if (this.hasButtonsToSelectRows()) {
            this.titles.unshift("select");
        }
        // add button to each rows if required.
        if (this.hasButtonsToEachRows()) {
            this.titles.push("...");
        }
    }

}
