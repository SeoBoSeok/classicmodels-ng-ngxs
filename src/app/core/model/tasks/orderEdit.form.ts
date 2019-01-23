/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Order } from '../order.model';
import { Customer } from '../customer.model';
import { Orderdetail } from '../orderdetail.model';

/**
*/
export class OrderEditForm {

    order: Order;
    orderNumber: number;
    customers: Array<Customer>;
    errors: any;

    constructor () {}
}
