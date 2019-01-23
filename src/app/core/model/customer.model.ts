/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Employee } from './employee.model';
import { Order } from './order.model';
import { Payment } from './payment.model';

/**
*/
export class Customer {

    customerNumber: number;
    customerName: string;
    contactLastName: string;
    contactFirstName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    salesRepEmployeeNumber: number;
    creditLimit: number;

    employee: Employee;
    orders: Order[];
    payments: Payment[];
    __xtra__: any = {};

    constructor (values: Object = {}) {
        Object.assign(this, values);

        if (this.orders) {
            const orderArr: Array<Order> = [];
            this.orders.forEach(order => orderArr.push(new Order(order)));
            this.orders = orderArr;
        }
        if (this.payments) {
            const paymentArr: Array<Payment> = [];
            this.payments.forEach(payment => paymentArr.push(new Payment(payment)));
            this.payments = paymentArr;
        }
    }

    isPersisted(): boolean {
        // CAUTION: 
        return (!!this.customerNumber);
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
