/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Order } from './order.model';
import { Product } from './product.model';

/**
*/
export class Orderdetail {

    orderNumber: number;
    productCode: string;
    quantityOrdered: number;
    priceEach: number;
    orderLineNumber: number;

    order: Order;
    product: Product;
    __xtra__: any = {};

    constructor (values: Object = {}) {
        Object.assign(this, values);

    }

    isPersisted(): boolean {
        // CAUTION: 
        return (!!this.orderNumber && !!this.productCode);
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
