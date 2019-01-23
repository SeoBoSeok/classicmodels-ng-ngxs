/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { 
    Office, OfficeService,
    OfficeEditForm,
    HttpFacade,
    CoreModule
} from '../../../core';

import { OfficeState } from './office.state';
import * as officeActions from './office.actions';

@Injectable()
export class OfficeFacade {
    @Select(OfficeState.getCreatedOffice)
    createdOffice$: Observable<Office>;

    @Select(OfficeState.getFindedOffice)
    office$: Observable<Office>;	// result of find

    @Select(OfficeState.getQueryOffice)
    offices$: Observable<Array<Office>>;	// result of query

    @Select(OfficeState.getUpdateSuccess)
    updateSuccess$: Observable<string>;
    @Select(OfficeState.getUpdateFailure)
    updateFailure$: Observable<string>;

    @Select(OfficeState.getOfficeList)
    officeList$: Observable<Array<Office>>;
    @Select(OfficeState.getOfficeListError)
    officeListError$: Observable<string>;
    @Select(OfficeState.hasMoreOfficeList)
    hasMoreOfficeList$: Observable<boolean>;
    @Select(OfficeState.getSelectedOfficeInOfficeList)
    selectedOfficeInOfficeList$: Observable<Office>;
    @Select(OfficeState.getOfficeMap)
    officeMap$: Observable<Array<Office>>;
    @Select(OfficeState.getOfficeMapError)
    officeMapError$: Observable<string>;
    @Select(OfficeState.getSelectedOfficeInOfficeMap)
    selectedOfficeInOfficeMap$: Observable<Office>;
    @Select(OfficeState.getOfficeShow)
    officeShow$: Observable<Office>;
    @Select(OfficeState.getOfficeShowError)
    officeShowError$: Observable<string>;

    @Select(OfficeState.getSelectedOfficeParamsToEmployeeListInOfficeList)
    selectedOfficeParamsToEmployeeListInOfficeList$: Observable<any>;
    @Select(OfficeState.getSelectedOfficeParamsToEmployeeListInOfficeMap)
    selectedOfficeParamsToEmployeeListInOfficeMap$: Observable<any>;

    @Select(OfficeState.initOfficeEdit)
    initOfficeEditForm$: Observable<OfficeEditForm>;
    @Select(OfficeState.loadOfficeEdit)
    loadOfficeEditForm$: Observable<OfficeEditForm>;
    @Select(OfficeState.saveOfficeEdit)
    saveOfficeEditForm$: Observable<OfficeEditForm>;

    @Select(OfficeState.initOfficeEditFail)
    initOfficeEditFail$: Observable<string>;
    @Select(OfficeState.loadOfficeEditFail)
    loadOfficeEditFail$: Observable<string>;
    @Select(OfficeState.saveOfficeEditFail)
    saveOfficeEditFail$: Observable<string>;

    constructor(private store: Store, private httpFacade: HttpFacade) {}

    create(row: Office) {
        this.store.dispatch(new officeActions.CreateOfficeAction(row));
    }

    find(conditions: any) {
        this.store.dispatch(new officeActions.FindOfficeAction(conditions.officeCode));
    }

    query(conditions: any) {
        this.store.dispatch(new officeActions.QueryOfficeAction(conditions));
    }

    update(columns: any, conditions: any) {
        this.store.dispatch(new officeActions.UpdateOfficeAction(columns, conditions));
    }

    getOfficeList(conditions: any) {
        this.store.dispatch(new officeActions.LoadOfficeListAction(conditions));
    }

    selectedOfficeInOfficeList(office: Office) {
        this.store.dispatch(new officeActions.SelectedOfficeInOfficeListAction(office));
    }

    selectedOfficeParamsToEmployeeListInOfficeList(params: any) {
        this.store.dispatch(new officeActions.SelectedOfficeParamsToEmployeeListInOfficeListAction(params));
    }
    getOfficeShow(conditions: any) {
        this.store.dispatch(new officeActions.LoadOfficeShowAction(conditions));
    }

    getOfficeEdit(conditions: any) {
        this.store.dispatch(new officeActions.LoadOfficeEditAction(conditions));
    }

    initOfficeEdit(ef?: OfficeEditForm) {
        this.store.dispatch(new officeActions.InitOfficeEditAction(ef));
    }
    initOfficeEditByEditForm(ef: OfficeEditForm) {
        this.store.dispatch(new officeActions.InitOfficeEditAction(ef));
    }
    saveOfficeEdit(ef: OfficeEditForm) {
        this.store.dispatch(new officeActions.SaveOfficeEditAction(ef));
    }

    getOfficeMap(conditions: any) {
        this.store.dispatch(new officeActions.LoadOfficeMapAction(conditions));
    }

    selectedOfficeInOfficeMap(office: Office) {
        this.store.dispatch(new officeActions.SelectedOfficeInOfficeMapAction(office));
    }

    selectedOfficeParamsToEmployeeListInOfficeMap(params: any) {
        this.store.dispatch(new officeActions.SelectedOfficeParamsToEmployeeListInOfficeMapAction(params));
    }

    newOfficeAdded() {
        // FIXME: this.store.dispatch(new officeActions.NewOfficeAddedAction());
    }
}
