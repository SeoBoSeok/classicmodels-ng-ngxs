/*
 Copyright(c) 2009-2019 by GGoons.
*/
import {
    OfficeEditForm,
    Office
} from '../../../core';

// actions...

export class CreateOfficeAction {
    static readonly type = "[Office] Create";
    constructor(public payload: Office) { }
}

export class FindOfficeAction {
    static readonly type = "[Office] Find";
    constructor(public officeCode: string) {}
}

export class QueryOfficeAction {
    static readonly type = "[Office] Query";
    constructor(public conditions: any) { }
}

export class UpdateOfficeAction {
    static readonly type = "[Office] Updates";
    constructor(public columns: any, public conditions: any) { }
}

export class DestroyOfficeAction {
    static readonly type = "[Office] Destroy";
    constructor(public officeCode: string) {}
}

export class DeleteOfficeAction {
    static readonly type = "[Office] Delete";
    constructor(public conditions: any) { }
}

export class LoadOfficeListAction {
    static readonly type = "[Office] LoadOfficeList";
    constructor(public conditions: any) { }
}

    //LoadMoreOfficeListSuccess: // FIXME
export class SelectedOfficeInOfficeListAction {
    static readonly type = "[Office] SelectedOfficeInOfficeList";
    constructor(public payload: Office) { }
}

export class SelectedOfficeParamsToEmployeeListInOfficeListAction {
    static readonly type = "[Office] SelectedOfficeParamsToEmployeeListInOfficeList";
    constructor(public payload: Office) { }
}

export class LoadOfficeShowAction {
    static readonly type = "[Office] LoadOfficeShow";
    constructor(public conditions: any) { }
}

export class LoadOfficeEditAction {
    static readonly type = "[Office] LoadOfficeEdit";
    constructor(public conditions: any) { }
}

export class InitOfficeEditAction {
    static readonly type = "[Office] InitOfficeEdit";
    constructor(public payload?: OfficeEditForm) { }
}

export class SaveOfficeEditAction {
    static readonly type = "[Office] SaveOfficeEdit";
    constructor(public payload?: OfficeEditForm) { }
}

export class LoadOfficeMapAction {
    static readonly type = "[Office] LoadOfficeMap";
    constructor(public conditions: any) { }
}

export class SelectedOfficeInOfficeMapAction {
    static readonly type = "[Office] SelectedOfficeInOfficeMap";
    constructor(public payload: Office) { }
}

export class SelectedOfficeParamsToEmployeeListInOfficeMapAction {
    static readonly type = "[Office] SelectedOfficeParamsToEmployeeListInOfficeMap";
    constructor(public payload: Office) { }
}
