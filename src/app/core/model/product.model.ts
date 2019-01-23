/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Productline } from './productline.model';
import { Orderdetail } from './orderdetail.model';

/**
*/
export class Product {

    productCode: string;
    productName: string;
    productLine: string;
    productScale: string;
    productVendor: string;
    productDescription: string;
    quantityInStock: number;
    buyPrice: number;
    msrp: number;

    productline: Productline;
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
        return (!!this.productCode);
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

    set MSRP(val: number) {
        this.msrp = val;
    }
}
