/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Payment } from '../payment.model';
import { Customer } from '../customer.model';

/**
*/
export class PaymentEditForm {

    payment: Payment;
    customerNumber: number;
    checkNumber: string;
    customers: Array<Customer>;
    errors: any;

    constructor () {}
}
