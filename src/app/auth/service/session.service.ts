/*
*/
import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {

    private storage() {
        return sessionStorage;	// localStorage
    }

    setItem(key: string, data: string): void {
        this.storage().setItem(key, data);
    }

    getItem(key: string): string {
        return this.storage().getItem(key);
    }

    removeItem(key: string): void {
        this.storage().removeItem(key);
    }
}
