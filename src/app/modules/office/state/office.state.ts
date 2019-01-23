/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { State, Action, StateContext, Selector, Store, NgxsOnInit } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, tap, take  } from 'rxjs/operators';

import {
    ModelState, ListState, ShowState, EditState, MapState, StatisticsState,
    OfficeEditForm,
    OfficeService,
    Office
} from '../../../core';

import * as officeActions from './office.actions';

const NUM_ROWS = 10;

class CreateState extends ModelState.CreateState<Office> {}
const initCreateState = ModelState.initialCreateState<Office>(null);
class FindState extends ModelState.FindState<Office> {}
const initFindState = ModelState.initialFindState<Office>(null);
class QueryState extends ModelState.QueryState<Office> {}
const initQueryState = ModelState.initialQueryState<Office>(null);
class UpdateState extends ModelState.UpdateState {}
const initUpdateState = ModelState.initialUpdateState;

export class OfficeListState extends ListState.State<Office> {
    selectedOfficeInOfficeList: Office;
    selectedOfficeParamsToEmployeeListInOfficeList: any;
}

const initOfficeListState = ListState.initialListState<Office>([]);
export class OfficeMapState extends MapState.State<Office> {
    selectedOfficeInOfficeMap: Office;
    selectedOfficeParamsToEmployeeListInOfficeMap: any;
}

const initOfficeMapState = MapState.initialMapState<Office>([]);

export class OfficeShowState extends ShowState.State<Office> {
}
const initOfficeShowState = ShowState.initialShowState<Office>(null);

export class OfficeEditState extends EditState.State<OfficeEditForm> {}
const initOfficeEditState = EditState.initialEditState<OfficeEditForm>();

export class OfficeStateModel {
    create: CreateState;
    find: FindState;
    query: QueryState;
    update: UpdateState;
    officeList: OfficeListState;
    officeShow: OfficeShowState;
    officeEdit: OfficeEditState;
    officeMap: OfficeMapState;
}

@State<OfficeStateModel>({
    name: 'office',
    defaults: {
        create: { ...initCreateState },
        find: { ...initFindState },
        query: { ...initQueryState },
        update: { ...initUpdateState },
        officeList: { ...initOfficeListState, selectedOfficeInOfficeList: null, selectedOfficeParamsToEmployeeListInOfficeList: null },
        officeShow: { ...initOfficeShowState },
        officeEdit: { ...initOfficeEditState },
        officeMap: { ...initOfficeMapState, selectedOfficeInOfficeMap: null, selectedOfficeParamsToEmployeeListInOfficeMap: null },
    }
})

export class OfficeState implements NgxsOnInit {

    // selectors(state consumers)...

    @Selector()
    static getCreatedOffice(state: OfficeStateModel) {
        return state.create.row;
    }

    @Selector()
    static getCreateOfficeError(state: OfficeStateModel) {
        return state.create.err;
    }

    @Selector()
    static getFindedOffice(state: OfficeStateModel) {
        return state.find.row;
    }

    @Selector()
    static getFindOfficeError(state: OfficeStateModel) {
        return state.find.err;
    }

    @Selector()
    static getQueryOffice(state: OfficeStateModel) {
        return state.query.rows;
    }

    @Selector()
    static getQueryOfficeError(state: OfficeStateModel) {
        return state.query.err;
    }

    @Selector()
    static getUpdateSuccess(state: OfficeStateModel) {
        return state.update.resultMsg;
    }

    @Selector()
    static getUpdateFailure(state: OfficeStateModel) {
        return state.update.err;
    }

    @Selector()
    static getOfficeList(state: OfficeStateModel) {
        return state.officeList.rows;
    }

    @Selector()
    static getOfficeListError(state: OfficeStateModel) {
        return state.officeList.err;
    }

    @Selector()
    static hasMoreOfficeList(state: OfficeStateModel) {
        return state.officeList.hasMoreRows;
    }

    @Selector()
    static getSelectedOfficeInOfficeList(state: OfficeStateModel) {
        return state.officeList.selectedOfficeInOfficeList;
    }

    @Selector()
    static getOfficeMap(state: OfficeStateModel) {
        return state.officeMap.rows;
    }

    @Selector()
    static getOfficeMapError(state: OfficeStateModel) {
        return state.officeMap.err;
    }

    @Selector()
    static getSelectedOfficeInOfficeMap(state: OfficeStateModel) {
        return state.officeMap.selectedOfficeInOfficeMap;
    }

    @Selector()
    static getOfficeShow(state: OfficeStateModel) {
        return state.officeShow.row;
    }

    @Selector()
    static getOfficeShowError(state: OfficeStateModel) {
        return state.officeShow.err;
    }

    @Selector()
    static initOfficeEdit(state: OfficeStateModel) {
        return state.officeEdit.init;
    }

    @Selector()
    static loadOfficeEdit(state: OfficeStateModel) {
        return state.officeEdit.load;
    }

    @Selector()
    static saveOfficeEdit(state: OfficeStateModel) {
        return state.officeEdit.save;
    }

    @Selector()
    static initOfficeEditFail(state: OfficeStateModel) {
        return state.officeEdit.initFail;
    }

    @Selector()
    static loadOfficeEditFail(state: OfficeStateModel) {
        return state.officeEdit.loadFail;
    }

    @Selector()
    static saveOfficeEditFail(state: OfficeStateModel) {
        return state.officeEdit.saveFail;
    }

    @Selector()
    static getSelectedOfficeParamsToEmployeeListInOfficeList(state: OfficeStateModel) {
        return state.officeList.selectedOfficeParamsToEmployeeListInOfficeList;
    }

    @Selector()
    static getSelectedOfficeParamsToEmployeeListInOfficeMap(state: OfficeStateModel) {
        return state.officeMap.selectedOfficeParamsToEmployeeListInOfficeMap;
    }

    constructor(private store: Store, private officeService: OfficeService) {}

    ngxsOnInit(ctx: StateContext<OfficeStateModel>) {
        // dispatch on start
        //ctx.dispatch(new xxxAction());
    }

    // reducers(state producers)...

    @Action(officeActions.CreateOfficeAction)
    create(context: StateContext<OfficeStateModel>, action: officeActions.CreateOfficeAction) {
        const officeState = context.getState();
        return this.officeService.create(action.payload).pipe(
            take(1),
            tap((office: Office) => {
                context.patchState({
                    ...officeState,
                    create: {...officeState.create, row: office}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    create: {...officeState.create, err: err.message}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.FindOfficeAction)
    find(context: StateContext<OfficeStateModel>, action: officeActions.FindOfficeAction) {
        const officeState = context.getState();
        return this.officeService.find(action.officeCode).pipe(
            take(1),
            tap((office: Office) => {
                context.patchState({
                    ...officeState,
                    find: {...officeState.find, row: office}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    find: {...officeState.find, err: err.message}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.QueryOfficeAction)
    query(context: StateContext<OfficeStateModel>, action: officeActions.QueryOfficeAction) {
        const officeState = context.getState();
        return this.officeService.query(action.conditions).pipe(
            take(1),
            tap((offices: Office[]) => {
                context.patchState({
                    ...officeState,
                    query: {...officeState.query, rows: offices}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    query: {...officeState.query, err: err.message}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.UpdateOfficeAction)
    update(context: StateContext<OfficeStateModel>, action: officeActions.UpdateOfficeAction) {
        const officeState = context.getState();
        return this.officeService.update(action.columns, action.conditions).pipe(
            take(1),
            tap(result => {
                context.patchState({
                    ...officeState,
                    update: {...officeState.update, resultMsg: result}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    update: {...officeState.update, err: err.message}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.LoadOfficeListAction)
    officeList(context: StateContext<OfficeStateModel>, action: officeActions.LoadOfficeListAction) {
        const officeState = context.getState();
        const conditions = action.conditions;
        const pageSize: number = conditions['num-rows'] || NUM_ROWS;
        const pageNo = conditions['page-no'];
        return this.officeService.getOfficeList(action.conditions).pipe(
            take(1),
            tap((offices: Office[]) => {
                const prevRows = (!pageNo || pageNo === 1) ? [] : officeState.officeList.rows;
                context.patchState({
                    ...officeState,
                    officeList: {
                        ...officeState.officeList,
                        rows: [...prevRows, ...offices],
                        hasMoreRows: (offices.length >= pageSize)
                    }
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    officeList: {...officeState.officeList, err: err.message}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.SelectedOfficeInOfficeListAction)
    selectedOfficeInOfficeList(context: StateContext<OfficeStateModel>, action: officeActions.SelectedOfficeInOfficeListAction) {
        const officeState = context.getState();
        context.patchState({
            ...officeState,
            officeList: {
                ...officeState.officeList, selectedOfficeInOfficeList: action.payload
            }
        });
    }

    @Action(officeActions.LoadOfficeMapAction)
    officeMap(context: StateContext<OfficeStateModel>, action: officeActions.LoadOfficeMapAction) {
        const officeState = context.getState();
        const conditions = action.conditions;
        return this.officeService.getOfficeMap(action.conditions).pipe(
            take(1),
            tap((offices: Office[]) => {
                context.patchState({
                    ...officeState,
                    officeMap: {...officeState.officeMap, rows: offices}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    officeMap: {...officeState.officeMap, err: err.message}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.SelectedOfficeInOfficeMapAction)
    selectedOfficeInOfficeMap(context: StateContext<OfficeStateModel>, action: officeActions.SelectedOfficeInOfficeMapAction) {
        const officeState = context.getState();
        context.patchState({
            ...officeState,
            officeMap: {
                ...officeState.officeMap, selectedOfficeInOfficeMap: action.payload
            }
        });
    }

    @Action(officeActions.LoadOfficeShowAction)
    officeShow(context: StateContext<OfficeStateModel>, action: officeActions.LoadOfficeShowAction) {
        const officeState = context.getState();
        const keys = action.conditions;
        return this.officeService.getOfficeShow(keys.officeCode).pipe(
            take(1),
            tap((office: Office) => {
                context.patchState({
                    ...officeState,
                    officeShow: {...officeState.officeShow, row: office}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    officeShow: {...officeState.officeShow, err: err.message}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.SelectedOfficeParamsToEmployeeListInOfficeListAction)
    officeParamsToEmployeeListInOfficeList(context: StateContext<OfficeStateModel>, 
            action: officeActions.SelectedOfficeParamsToEmployeeListInOfficeListAction) {
        const officeState = context.getState();
        context.patchState({
            ...officeState,
            officeList: {
                ...officeState.officeList, selectedOfficeParamsToEmployeeListInOfficeList: action.payload
            }
        });
    }

    @Action(officeActions.SelectedOfficeParamsToEmployeeListInOfficeMapAction)
    officeParamsToEmployeeListInOfficeMap(context: StateContext<OfficeStateModel>, 
            action: officeActions.SelectedOfficeParamsToEmployeeListInOfficeMapAction) {
        const officeState = context.getState();
        context.patchState({
            ...officeState,
            officeMap: {
                ...officeState.officeMap, selectedOfficeParamsToEmployeeListInOfficeMap: action.payload
            }
        });
    }

    @Action(officeActions.InitOfficeEditAction)
    initOfficeEdit(context: StateContext<OfficeStateModel>, action: officeActions.InitOfficeEditAction) {
        const officeState = context.getState();
        const editForm = action.payload;
        let oef: Observable<OfficeEditForm>;
        if (editForm) {
            oef = this.officeService.getOfficeEdit(editForm);
        } else {
            oef = this.officeService.getNewOfficeEdit();
        }
        return oef.pipe(
            take(1),
            tap((ef: OfficeEditForm) => {
                context.patchState({
                    ...officeState,
                    officeEdit: {...officeState.officeEdit, init: ef}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    officeEdit: {...officeState.officeEdit, initFail: err}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.LoadOfficeEditAction)
    loadOfficeEdit(context: StateContext<OfficeStateModel>, action: officeActions.LoadOfficeEditAction) {
        const officeState = context.getState();
        const keys = action.conditions;
        return this.officeService.getOfficeEditBy(keys.officeCode).pipe(
            take(1),
            tap((ef: OfficeEditForm) => {
                context.patchState({
                    ...officeState,
                    officeEdit: {...officeState.officeEdit, load: ef}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    officeEdit: {...officeState.officeEdit, loadFail: err}
                });
                return of(officeState);
            })
        );
    }

    @Action(officeActions.SaveOfficeEditAction)
    saveOfficeEdit(context: StateContext<OfficeStateModel>, action: officeActions.SaveOfficeEditAction) {
        const officeState = context.getState();
        return this.officeService.saveOfficeEdit(action.payload).pipe(
            take(1),
            tap((ef: OfficeEditForm) => {
                context.patchState({
                    ...officeState,
                    officeEdit: {...officeState.officeEdit, save: ef}
                });
            }),
            catchError(err => {
                context.patchState({
                    ...officeState,
                    officeEdit: {...officeState.officeEdit, saveFail: err}
                });
                return of(officeState);
            })
        );
    }

}
