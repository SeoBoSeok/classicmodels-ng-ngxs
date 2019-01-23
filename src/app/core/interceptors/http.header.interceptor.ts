/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, flatMap } from 'rxjs/operators';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (req.body && req.body.constructor.name === 'FormData') {
            return next.handle(req)
        } else {
            const request = req.clone({setHeaders: headersConfig});
            return next.handle(request)
        }
    }
}
