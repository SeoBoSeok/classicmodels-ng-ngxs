/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable } from '@angular/core';
import { SERVER_HOST } from '../service/config';

//@Injectable()
export class UriUtils {

    constructor() {}

    /**
    * serialize a string to a specific type T.
    */
    static fromJSON<T>(model: any): T {
        return <T>JSON.parse(JSON.stringify(model));
    }

    static toJSON(model: any): string {
        return JSON.stringify(model);
    }

    static toRestParams(params: Object): string {
        let arr = [];
        Object.keys(params).forEach(key => {
            arr.push(encodeURIComponent(key)+"="+encodeURIComponent(params[key]));
        });
        return arr.join("&");
    }

    static toUrlParams(url: string, params: Object): string {
        const uri = UriUtils.url(url);
        if (Object.keys(params).length === 0) {
            return uri;
        }
        return uri + "?" + UriUtils.toRestParams(params);
    }

    static url(url: string): string {
        return SERVER_HOST + "/" + url;
    }
}
