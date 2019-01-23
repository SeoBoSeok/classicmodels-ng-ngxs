/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, Subject } from 'rxjs';

import {
    SERVER_HOST,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../core';

export abstract class AbstractTaskComponent<T> {

    @Input() embedded: boolean = false;
    @Input() exclude: Array<string>;

    protected isAlived: boolean = true;
    protected row: T;

    constructor() {}

    isEmbedded() : boolean   {
        return this.embedded;
    }

    isNotEmbedded() : boolean   {
        return !this.isEmbedded();
    }

    isExclude(taskName: string) : boolean {
        return this.exclude && this.exclude.indexOf(taskName) >= 0;
    }

    thumb(url:string): string {
        if (url) {
            const val = url + "_thumb";	// see uploadUtils.(js | java) in backend server.
            return UriUtils.url(val);
        } else {
            return '';
        }
    }

    serverUrl(url: string): string {
        if (!url) {
            return '';
        } else if (url.startsWith("http:") || url.startsWith("https:")) {
            return url;
        } else {
            return SERVER_HOST + url;
        }
    }

    imageDataUrl(value: Array<number>): string {
        return this.dataUrl("image/png", value);
    }

    audioDataUrl(value: Array<number>): string {
        return this.dataUrl("audio/mp3", value);
    }

    videoDataUrl(value: Array<number>): string {
        return this.dataUrl("video/mp4", value);
    }

    dataUrl(format: string, value: Array<number>): string {
        if (!value) {
            return '';
        } else {
            const base64 = value;
            const url = 'data:'+format+';base64,' + base64;
            //console.log("dataUrl: "+url);
            return url;
        }
    }

    stringify(obj: any): string {
        return JSON.stringify(obj);
    }

    showError(err: any): void {
        if (!!err) {
            const msg = "Error: "+((err instanceof String) ? err : this.stringify(err));
            console.log(msg);
            alert(msg);
        }
    }

    ngOnDestroy() {
        this.isAlived = false;
    }
}
