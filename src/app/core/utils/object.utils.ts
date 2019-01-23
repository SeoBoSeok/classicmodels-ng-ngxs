/*
 Copyright(c) 2009-2019 by GGoons.
*/

export class ObjectUtils {

    constructor() {}

    static safeGet(first: any, firstName: string, chain: string, defaultValue:any): any {
        try {
            let cmd: string = chain.replace(firstName, "first");
            return eval(cmd);
        }
        catch(e) {
            return defaultValue;
        }
    }

}
