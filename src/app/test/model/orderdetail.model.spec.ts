/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Orderdetail, Order, Product } from '../../core';

describe('test to create orderdetail model', () => {
  it('orderdetail created', () => {
    let orderdetail: Orderdetail = new Orderdetail({
        orderNumber: parseInt('0'),
        productCode: '0',
        quantityOrdered: parseInt('0'),
        priceEach: parseInt('0'),
        orderLineNumber: parseInt('0'),
    });

    expect(orderdetail.orderNumber === parseInt('0')).toBe(true);
    expect(orderdetail.productCode === '0').toBe(true);
    expect(orderdetail.quantityOrdered === parseInt('0')).toBe(true);
    expect(orderdetail.priceEach === parseInt('0')).toBe(true);
    expect(orderdetail.orderLineNumber === parseInt('0')).toBe(true);
  });
});
