/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Productline, Product } from '../../core';

describe('test to create productline model', () => {
  it('productline created', () => {
    let productline: Productline = new Productline({
        productLine: '0',
        textDescription: '0',
        htmlDescription: '0',
        image: '0'.split('').map((char) => char.charCodeAt(0).toString(2)),
    });

    expect(productline.productLine === '0').toBe(true);
    expect(productline.textDescription === '0').toBe(true);
    expect(productline.htmlDescription === '0').toBe(true);
  });
});
