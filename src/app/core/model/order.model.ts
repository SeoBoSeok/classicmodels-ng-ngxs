/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Customer } from './customer.model';
import { Orderdetail } from './orderdetail.model';

/**
*/
export class Order {

    orderNumber: number;
    orderDate: Date;
    requiredDate: Date;
    shippedDate: Date;
    status: string;
    comments: string;
    customerNumber: number;

    customer: Customer;
    orderdetails: Orderdetail[];
    __xtra__: any = {};

    constructor (values: Object = {}) {
        Object.assign(this, values);

        if (this.orderdetails) {
            const orderdetailArr: Array<Orderdetail> = [];
            this.orderdetails.forEach(orderdetail => orderdetailArr.push(new Orderdetail(orderdetail)));
            this.orderdetails = orderdetailArr;
        }
    }

    isPersisted(): boolean {
        // CAUTION: 
        return (!!this.orderNumber);
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
