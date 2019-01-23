/*
 Copyright(c) 2009-2019 by GGoons.
*/

export class State<T> {
    constructor(
        public rows: T[],
        public err: string,
        public onWorking: boolean,
        public hasMoreRows: boolean=true,
        public totalRows: number=0
    ) {}
}

export const initialListState = <T>(initVal: T[]): State<T> => new State<T>(initVal, null, false);
