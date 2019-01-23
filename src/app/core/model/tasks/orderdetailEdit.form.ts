/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Orderdetail } from '../orderdetail.model';
import { Order } from '../order.model';
import { Product } from '../product.model';

/**
*/
export class OrderdetailEditForm {

    orderdetail: Orderdetail;
    orderNumber: number;
    productCode: string;
    orders: Array<Order>;
    products: Array<Product>;
    errors: any;

    constructor () {}
}
