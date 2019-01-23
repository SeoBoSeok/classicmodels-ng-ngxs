/*
 Copyright(c) 2009-2019 by GGoons.
*/

export class State<T> {
    constructor(
        public rows: T[],
        public err: string,
        public onWorking: boolean,
    ) {}
}

export const initialStatisticsState = <T>(initVal: T[]): State<T> => new State<T>(initVal, null, false);
