/*
 Copyright(c) 2009-2019 by GGoons.
*/
import {
    CustomerEditForm,
    Customer
} from '../../../core';

// actions...

export class CreateCustomerAction {
    static readonly type = "[Customer] Create";
    constructor(public payload: Customer) { }
}

export class FindCustomerAction {
    static readonly type = "[Customer] Find";
    constructor(public customerNumber: number) {}
}

export class QueryCustomerAction {
    static readonly type = "[Customer] Query";
    constructor(public conditions: any) { }
}

export class UpdateCustomerAction {
    static readonly type = "[Customer] Updates";
    constructor(public columns: any, public conditions: any) { }
}

export class DestroyCustomerAction {
    static readonly type = "[Customer] Destroy";
    constructor(public customerNumber: number) {}
}

export class DeleteCustomerAction {
    static readonly type = "[Customer] Delete";
    constructor(public conditions: any) { }
}

export class LoadCustomerListAction {
    static readonly type = "[Customer] LoadCustomerList";
    constructor(public conditions: any) { }
}

export class CountCustomerListAction {
    static readonly type = "[Customer] CountCustomerList";
    constructor(public conditions: any) { }
}

export class SelectedCustomerInCustomerListAction {
    static readonly type = "[Customer] SelectedCustomerInCustomerList";
    constructor(public payload: Customer) { }
}

export class LoadCustomerShowAction {
    static readonly type = "[Customer] LoadCustomerShow";
    constructor(public conditions: any) { }
}

export class LoadCustomerEditAction {
    static readonly type = "[Customer] LoadCustomerEdit";
    constructor(public conditions: any) { }
}

export class InitCustomerEditAction {
    static readonly type = "[Customer] InitCustomerEdit";
    constructor(public payload?: CustomerEditForm) { }
}

export class SaveCustomerEditAction {
    static readonly type = "[Customer] SaveCustomerEdit";
    constructor(public payload?: CustomerEditForm) { }
}

export class LoadCustomerPaymentStatisticAction {
    static readonly type = "[Customer] LoadCustomerPaymentStatistic";
    constructor(public conditions: any) { }
}

