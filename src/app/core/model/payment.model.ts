/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Customer } from './customer.model';

/**
*/
export class Payment {

    customerNumber: number;
    checkNumber: string;
    paymentDate: Date;
    amount: number;

    customer: Customer;
    __xtra__: any = {};

    constructor (values: Object = {}) {
        Object.assign(this, values);

    }

    isPersisted(): boolean {
        // CAUTION: 
        return (!!this.customerNumber && !!this.checkNumber);
    }
    /**
    * To select each row in list.
    */
    isSelected(): boolean {
        if (!this.__xtra__["selected"]) {
            this.__xtra__["selected"] = false;
        }
        return this.__xtra__.selected;
    }
    setSelected(val: boolean): void {
        this.__xtra__["selected"] = val;
    }

}
