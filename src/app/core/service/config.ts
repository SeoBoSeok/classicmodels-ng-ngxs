import { HttpHeaders } from '@angular/common/http';

export const SERVER_HOST = "http://localhost:8080";
export const FRONTEND_HOST = window.location.href.replace(window.location.pathname, "");
export const UPLOAD_URL = SERVER_HOST + "/upload/file";
export const UUID = "808fc8726f94499c846f8745d8ab9565";

export const defaultJsonHeaders = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    }) 
};
