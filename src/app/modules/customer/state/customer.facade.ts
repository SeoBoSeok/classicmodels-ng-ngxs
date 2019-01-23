/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { 
    Customer, CustomerService,
    CustomerEditForm,
    HttpFacade,
    CoreModule
} from '../../../core';

import { CustomerState } from './customer.state';
import * as customerActions from './customer.actions';

@Injectable()
export class CustomerFacade {
    @Select(CustomerState.getCreatedCustomer)
    createdCustomer$: Observable<Customer>;

    @Select(CustomerState.getFindedCustomer)
    customer$: Observable<Customer>;	// result of find

    @Select(CustomerState.getQueryCustomer)
    customers$: Observable<Array<Customer>>;	// result of query

    @Select(CustomerState.getUpdateSuccess)
    updateSuccess$: Observable<string>;
    @Select(CustomerState.getUpdateFailure)
    updateFailure$: Observable<string>;

    @Select(CustomerState.getCustomerList)
    customerList$: Observable<Array<Customer>>;
    @Select(CustomerState.getCustomerListError)
    customerListError$: Observable<string>;
    @Select(CustomerState.countOfCustomerList)
    countOfCustomerList$: Observable<number>;
    @Select(CustomerState.getSelectedCustomerInCustomerList)
    selectedCustomerInCustomerList$: Observable<Customer>;
    @Select(CustomerState.getCustomerPaymentStatistic)
    customerPaymentStatistic$: Observable<Array<Customer>>;
    @Select(CustomerState.getCustomerPaymentStatisticError)
    customerPaymentStatisticError$: Observable<string>;
    @Select(CustomerState.getCustomerShow)
    customerShow$: Observable<Customer>;
    @Select(CustomerState.getCustomerShowError)
    customerShowError$: Observable<string>;

    @Select(CustomerState.initCustomerEdit)
    initCustomerEditForm$: Observable<CustomerEditForm>;
    @Select(CustomerState.loadCustomerEdit)
    loadCustomerEditForm$: Observable<CustomerEditForm>;
    @Select(CustomerState.saveCustomerEdit)
    saveCustomerEditForm$: Observable<CustomerEditForm>;

    @Select(CustomerState.initCustomerEditFail)
    initCustomerEditFail$: Observable<string>;
    @Select(CustomerState.loadCustomerEditFail)
    loadCustomerEditFail$: Observable<string>;
    @Select(CustomerState.saveCustomerEditFail)
    saveCustomerEditFail$: Observable<string>;

    constructor(private store: Store, private httpFacade: HttpFacade) {}

    create(row: Customer) {
        this.store.dispatch(new customerActions.CreateCustomerAction(row));
    }

    find(conditions: any) {
        this.store.dispatch(new customerActions.FindCustomerAction(conditions.customerNumber));
    }

    query(conditions: any) {
        this.store.dispatch(new customerActions.QueryCustomerAction(conditions));
    }

    update(columns: any, conditions: any) {
        this.store.dispatch(new customerActions.UpdateCustomerAction(columns, conditions));
    }

    getCustomerList(conditions: any) {
        this.store.dispatch(new customerActions.LoadCustomerListAction(conditions));
    }

    getCountOfCustomerList(conditions: any) {
        this.store.dispatch(new customerActions.CountCustomerListAction(conditions));
    }

    selectedCustomerInCustomerList(customer: Customer) {
        this.store.dispatch(new customerActions.SelectedCustomerInCustomerListAction(customer));
    }

    getCustomerShow(conditions: any) {
        this.store.dispatch(new customerActions.LoadCustomerShowAction(conditions));
    }

    getCustomerEdit(conditions: any) {
        this.store.dispatch(new customerActions.LoadCustomerEditAction(conditions));
    }

    initCustomerEdit(ef?: CustomerEditForm) {
        this.store.dispatch(new customerActions.InitCustomerEditAction(ef));
    }
    initCustomerEditByEditForm(ef: CustomerEditForm) {
        this.store.dispatch(new customerActions.InitCustomerEditAction(ef));
    }
    saveCustomerEdit(ef: CustomerEditForm) {
        this.store.dispatch(new customerActions.SaveCustomerEditAction(ef));
    }

    getCustomerPaymentStatistic(conditions: any) {
        this.store.dispatch(new customerActions.LoadCustomerPaymentStatisticAction(conditions));
    }

    newCustomerAdded() {
        // FIXME: this.store.dispatch(new customerActions.NewCustomerAddedAction());
    }
}
