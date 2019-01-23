/*
 Copyright(c) 2009-2019 by GGoons.
*/

export class State<T> {
    constructor(public row: T, public err: string, public onWorking: boolean) {
    }
}

export const initialShowState = <T>(row: T): State<T> => new State<T>(row, null, false);
