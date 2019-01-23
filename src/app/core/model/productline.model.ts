/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Product } from './product.model';

/**
*/
export class Productline {

    productLine: string;
    textDescription: string;
    htmlDescription: string;
    image: string;
    imageUrl: string;

    products: Product[];
    __xtra__: any = {};

    constructor (values: Object = {}) {
        Object.assign(this, values);

        if (this.products) {
            const productArr: Array<Product> = [];
            this.products.forEach(product => productArr.push(new Product(product)));
            this.products = productArr;
        }
    }

    isPersisted(): boolean {
        // CAUTION: 
        return (!!this.productLine);
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
