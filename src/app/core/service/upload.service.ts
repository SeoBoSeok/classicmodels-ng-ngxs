/*
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable()
export class UploadService {

    constructor(private http: HttpClient) { }

    upload(url: string, files: FileList): Observable<HttpEvent<any>> {
        if (!files || files.length == 0) {
            throw Observable.throw("No file(s) to upload.");
        }

        const file: File = files[0];
        const formData = new FormData();
        formData.append('upload', file, file.name);

        const req = new HttpRequest('POST', url, formData, {
            params: new HttpParams(),
            reportProgress: true
        });

        return this.http.request(req);
    }
}
