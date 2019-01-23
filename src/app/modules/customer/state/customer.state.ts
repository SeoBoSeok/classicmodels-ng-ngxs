/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { State, Action, StateContext, Selector, Store, NgxsOnInit } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, tap, take  } from 'rxjs/operators';

import {
    ModelState, ListState, ShowState, EditState, MapState, StatisticsState,
    CustomerEditForm,
    CustomerService,
    Customer
} from '../../../core';

import * as customerActions from './customer.actions';

const NUM_ROWS = 10;

class CreateState extends ModelState.CreateState<Customer> {}
const initCreateState = ModelState.initialCreateState<Customer>(null);
class FindState extends ModelState.FindState<Customer> {}
const initFindState = ModelState.initialFindState<Customer>(null);
class QueryState extends ModelState.QueryState<Customer> {}
const initQueryState = ModelState.initialQueryState<Customer>(null);
class UpdateState extends ModelState.UpdateState {}
const initUpdateState = ModelState.initialUpdateState;

export class CustomerListState extends ListState.State<Customer> {
    selectedCustomerInCustomerList: Customer;
}

const initCustomerListState = ListState.initialListState<Customer>([]);
export class CustomerPaymentStatisticState extends StatisticsState.State<Customer> {
}

const initCustomerPaymentStatisticState = StatisticsState.initialStatisticsState<Customer>([]);

export class CustomerShowState extends ShowState.State<Customer> {
}
const initCustomerShowState = ShowState.initialShowState<Customer>(null);

export class CustomerEditState extends EditState.State<CustomerEditForm> {}
const initCustomerEditState = EditState.initialEditState<CustomerEditForm>();

export class CustomerStateModel {
    create: CreateState;
    find: FindState;
    query: QueryState;
    update: UpdateState;
    customerList: CustomerListState;
    customerShow: CustomerShowState;
    customerEdit: CustomerEditState;
    customerPaymentStatistic: CustomerPaymentStatisticState;
}

@State<CustomerStateModel>({
    name: 'customer',
    defaults: {
        create: { ...initCreateState },
        find: { ...initFindState },
        query: { ...initQueryState },
        update: { ...initUpdateState },
        customerList: { ...initCustomerListState, selectedCustomerInCustomerList: null },
        customerShow: { ...initCustomerShowState },
        customerEdit: { ...initCustomerEditState },
        customerPaymentStatistic: { ...initCustomerPaymentStatisticState },
    }
})

export class CustomerState implements NgxsOnInit {

    // selectors(state consumers)...

    @Selector()
    static getCreatedCustomer(state: CustomerStateModel) {
        return state.create.row;
    }

    @Selector()
    static getCreateCustomerError(state: CustomerStateModel) {
        return state.create.err;
    }

    @Selector()
    static getFindedCustomer(state: CustomerStateModel) {
        return state.find.row;
    }

    @Selector()
    static getFindCustomerError(state: CustomerStateModel) {
        return state.find.err;
    }

    @Selector()
    static getQueryCustomer(state: CustomerStateModel) {
        return state.query.rows;
    }

    @Selector()
    static getQueryCustomerError(state: CustomerStateModel) {
        return state.query.err;
    }

    @Selector()
    static getUpdateSuccess(state: CustomerStateModel) {
        return state.update.resultMsg;
    }

    @Selector()
    static getUpdateFailure(state: CustomerStateModel) {
        return state.update.err;
    }

    @Selector()
    static getCustomerList(state: CustomerStateModel) {
        return state.customerList.rows;
    }

    @Selector()
    static getCustomerListError(state: CustomerStateModel) {
        return state.customerList.err;
    }

    @Selector()
    static countOfCustomerList(state: CustomerStateModel) {
        return state.customerList.totalRows;
    }

    @Selector()
    static getSelectedCustomerInCustomerList(state: CustomerStateModel) {
        return state.customerList.selectedCustomerInCustomerList;
    }

    @Selector()
    static getCustomerPaymentStatistic(state: CustomerStateModel) {
        return state.customerPaymentStatistic.rows;
    }

    @Selector()
    static getCustomerPaymentStatisticError(state: CustomerStateModel) {
        return state.customerPaymentStatistic.err;
    }

    @Selector()
    static getCustomerShow(state: CustomerStateModel) {
        return state.customerShow.row;
    }

    @Selector()
    static getCustomerShowError(state: CustomerStateModel) {
        return state.customerShow.err;
    }

    @Selector()
    static initCustomerEdit(state: CustomerStateModel) {
        return state.customerEdit.init;
    }

    @Selector()
    static loadCustomerEdit(state: CustomerStateModel) {
        return state.customerEdit.load;
    }

    @Selector()
    static saveCustomerEdit(state: CustomerStateModel) {
        return state.customerEdit.save;
    }

    @Selector()
    static initCustomerEditFail(state: CustomerStateModel) {
        return state.customerEdit.initFail;
    }

    @Selector()
    static loadCustomerEditFail(state: CustomerStateModel) {
        return state.customerEdit.loadFail;
    }

    @Selector()
    static saveCustomerEditFail(state: CustomerStateModel) {
        return state.customerEdit.saveFail;
    }

    constructor(private store: Store, private customerService: CustomerService) {}

    ngxsOnInit(ctx: StateContext<CustomerStateModel>) {
        // dispatch on start
        //ctx.dispatch(new xxxAction());
    }

    // reducers(state producers)...

    @Action(customerActions.CreateCustomerAction)
    create(context: StateContext<CustomerStateModel>, action: customerActions.CreateCustomerAction) {
        const customerState = context.getState();
        return this.customerService.create(action.payload).pipe(
            take(1),
            tap((customer: Customer) => {
                context.patchState({
                    ...customerState,
                    create: {...customerState.create, row: customer}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    create: {...customerState.create, err: err.message}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.FindCustomerAction)
    find(context: StateContext<CustomerStateModel>, action: customerActions.FindCustomerAction) {
        const customerState = context.getState();
        return this.customerService.find(action.customerNumber).pipe(
            take(1),
            tap((customer: Customer) => {
                context.patchState({
                    ...customerState,
                    find: {...customerState.find, row: customer}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    find: {...customerState.find, err: err.message}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.QueryCustomerAction)
    query(context: StateContext<CustomerStateModel>, action: customerActions.QueryCustomerAction) {
        const customerState = context.getState();
        return this.customerService.query(action.conditions).pipe(
            take(1),
            tap((customers: Customer[]) => {
                context.patchState({
                    ...customerState,
                    query: {...customerState.query, rows: customers}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    query: {...customerState.query, err: err.message}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.UpdateCustomerAction)
    update(context: StateContext<CustomerStateModel>, action: customerActions.UpdateCustomerAction) {
        const customerState = context.getState();
        return this.customerService.update(action.columns, action.conditions).pipe(
            take(1),
            tap(result => {
                context.patchState({
                    ...customerState,
                    update: {...customerState.update, resultMsg: result}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    update: {...customerState.update, err: err.message}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.LoadCustomerListAction)
    customerList(context: StateContext<CustomerStateModel>, action: customerActions.LoadCustomerListAction) {
        const customerState = context.getState();
        const conditions = action.conditions;
        return this.customerService.getCustomerList(action.conditions).pipe(
            take(1),
            tap((customers: Customer[]) => {
                context.patchState({
                    ...customerState,
                    customerList: {...customerState.customerList, rows: customers}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    customerList: {...customerState.customerList, err: err.message}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.CountCustomerListAction)
    countOfCustomerList(context: StateContext<CustomerStateModel>, action: customerActions.CountCustomerListAction) {
        const customerState = context.getState();
        return this.customerService.getCustomerListCount(action.conditions).pipe(
            take(1),
            tap((count: number) => {
                context.patchState({
                    ...customerState,
                    customerList: {...customerState.customerList, totalRows: count}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    customerList: {...customerState.customerList, err: err.message}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.SelectedCustomerInCustomerListAction)
    selectedCustomerInCustomerList(context: StateContext<CustomerStateModel>, action: customerActions.SelectedCustomerInCustomerListAction) {
        const customerState = context.getState();
        context.patchState({
            ...customerState,
            customerList: {
                ...customerState.customerList, selectedCustomerInCustomerList: action.payload
            }
        });
    }

    @Action(customerActions.LoadCustomerPaymentStatisticAction)
    customerPaymentStatistic(context: StateContext<CustomerStateModel>, action: customerActions.LoadCustomerPaymentStatisticAction) {
        const customerState = context.getState();
        const conditions = action.conditions;
        return this.customerService.getCustomerPaymentStatistic(action.conditions).pipe(
            take(1),
            tap((customers: Customer[]) => {
                context.patchState({
                    ...customerState,
                    customerPaymentStatistic: {...customerState.customerPaymentStatistic, rows: customers}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    customerPaymentStatistic: {...customerState.customerPaymentStatistic, err: err.message}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.LoadCustomerShowAction)
    customerShow(context: StateContext<CustomerStateModel>, action: customerActions.LoadCustomerShowAction) {
        const customerState = context.getState();
        const keys = action.conditions;
        return this.customerService.getCustomerShow(keys.customerNumber).pipe(
            take(1),
            tap((customer: Customer) => {
                context.patchState({
                    ...customerState,
                    customerShow: {...customerState.customerShow, row: customer}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    customerShow: {...customerState.customerShow, err: err.message}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.InitCustomerEditAction)
    initCustomerEdit(context: StateContext<CustomerStateModel>, action: customerActions.InitCustomerEditAction) {
        const customerState = context.getState();
        const editForm = action.payload;
        let oef: Observable<CustomerEditForm>;
        if (editForm) {
            oef = this.customerService.getCustomerEdit(editForm);
        } else {
            oef = this.customerService.getNewCustomerEdit();
        }
        return oef.pipe(
            take(1),
            tap((ef: CustomerEditForm) => {
                context.patchState({
                    ...customerState,
                    customerEdit: {...customerState.customerEdit, init: ef}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    customerEdit: {...customerState.customerEdit, initFail: err}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.LoadCustomerEditAction)
    loadCustomerEdit(context: StateContext<CustomerStateModel>, action: customerActions.LoadCustomerEditAction) {
        const customerState = context.getState();
        const keys = action.conditions;
        return this.customerService.getCustomerEditBy(keys.customerNumber).pipe(
            take(1),
            tap((ef: CustomerEditForm) => {
                context.patchState({
                    ...customerState,
                    customerEdit: {...customerState.customerEdit, load: ef}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    customerEdit: {...customerState.customerEdit, loadFail: err}
                });
                return of(customerState);
            })
        );
    }

    @Action(customerActions.SaveCustomerEditAction)
    saveCustomerEdit(context: StateContext<CustomerStateModel>, action: customerActions.SaveCustomerEditAction) {
        const customerState = context.getState();
        return this.customerService.saveCustomerEdit(action.payload).pipe(
            take(1),
            tap((ef: CustomerEditForm) => {
                context.patchState({
                    ...customerState,
                    customerEdit: {...customerState.customerEdit, save: ef}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...customerState,
                    customerEdit: {...customerState.customerEdit, saveFail: err}
                });
                return of(customerState);
            })
        );
    }

}

