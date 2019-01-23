/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

export class ErrorUtils {

    constructor() {}

    /**
    */
    static handleError(error) {
        let msg: string;
        if (typeof error.status == "number" && error.status !== 200) {
            msg = "Server error: "+error._body;
        } else {
            msg = error.toString();
        }
        alert(msg);
        console.log(msg);
        return Observable.throw(msg);
    }
}
