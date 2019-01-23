/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Product, Productline, Orderdetail } from '../../core';

describe('test to create product model', () => {
  it('product created', () => {
    let product: Product = new Product({
        productCode: '0',
        productName: '0',
        productLine: '0',
        productScale: '0',
        productVendor: '0',
        productDescription: '0',
        quantityInStock: parseInt('0'),
        buyPrice: parseInt('0'),
        msrp: parseInt('0'),
    });

    expect(product.productCode === '0').toBe(true);
    expect(product.productName === '0').toBe(true);
    expect(product.productLine === '0').toBe(true);
    expect(product.productScale === '0').toBe(true);
    expect(product.productVendor === '0').toBe(true);
    expect(product.productDescription === '0').toBe(true);
    expect(product.quantityInStock === parseInt('0')).toBe(true);
    expect(product.buyPrice === parseInt('0')).toBe(true);
    expect(product.msrp === parseInt('0')).toBe(true);
  });
});
