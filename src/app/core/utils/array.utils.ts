/*
 Copyright(c) 2009-2019 by GGoons.
*/
export class ArrayUtils {

    constructor() {}

    static minus(a: Array<any>, b: Array<any>): Array<any> {
        return a.filter(x => b.indexOf(x) < 0);
    }

    static isEmpty(obj: any): boolean {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    static safeGet(first: any, firstName: string, chain: string): any {
        try {
            let cmd: string = chain.replace(firstName, "first");
            return eval(cmd);
        } catch(e) {
            return "Unavailable"
        }
    }
}
