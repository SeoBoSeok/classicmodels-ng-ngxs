/**
 Copyright(c) 2009-2019 by GGoons.
*/

/**
*/
export class StringUtils {

    constructor() {
    }

    static isBlank = (s:string):boolean => {
        return !s || s.length == 0 || s.match(/^\s*$/) != null;
    };

}
