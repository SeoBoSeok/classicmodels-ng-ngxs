/*
 Copyright(c) 2009-2019 by GGoons.
*/

export class State<T> {

    constructor(
    	public init: T, 
    	public load: T, 
    	public save: T, 
    	public initFail: string, 
    	public loadFail: string, 
    	public saveFail: string, 
    	public onWorking: boolean) {
    }

}

export const initialEditState = <T>(): State<T> => new State<T>(
    null, null, null, null, null, null, false
);
