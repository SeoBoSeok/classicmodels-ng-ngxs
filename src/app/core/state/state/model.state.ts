/*
 Copyright(c) 2009-2019 by GGoons.
*/

export class CreateState<T> {
    constructor(public row: T, public err: string, public created: boolean) {}
}
export class FindState<T> {
    constructor(public row: T, public err: string, public loaded: boolean) {}
}
export class QueryState<T> {
    constructor(public rows: T[], public err: string, public loaded: boolean) {}
}
export class UpdateState {
    constructor(public resultMsg: string, public err: string, public updated: boolean) {}
}
export class DestroyState {
    constructor(public resultMsg: string, public err: string, public destroyed: boolean) {}
}

export class CheckDuplicateState {
    constructor(public result: boolean, public err: string) {}
}
export class FailState {
    constructor(public payload: string) {}
}
export class AnyState {
    constructor(public payload: any) {}
}

// default states...

export const initialCreateState = <T>(row: T): CreateState<T> => new CreateState<T>(row, null, false);

export const initialFindState = <T>(row: T): FindState<T> => new FindState<T>(row, null, false);

export const initialQueryState = <T>(rows: T[]): QueryState<T> => new QueryState<T>(rows, null, false);

export const initialUpdateState = new UpdateState(null, null, false);

export const initialDestroyState = new DestroyState(null, null, false);

export const initialCheckDuplicateState = new CheckDuplicateState(true, null);
