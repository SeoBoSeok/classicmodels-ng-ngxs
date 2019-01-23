/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Product } from '../product.model';
import { Productline } from '../productline.model';
import { Orderdetail } from '../orderdetail.model';

/**
*/
export class ProductEditForm {

    product: Product;
    productCode: string;
    productlines: Array<Productline>;
    errors: any;

    constructor () {}
}
