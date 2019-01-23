/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Order, Customer, Orderdetail } from '../../core';

describe('test to create order model', () => {
  it('order created', () => {
    let now: Date = new Date();
    let order: Order = new Order({
        orderNumber: parseInt('0'),
        orderDate: now,
        requiredDate: now,
        shippedDate: now,
        status: '0',
        comments: '0',
        customerNumber: parseInt('0'),
    });

    expect(order.orderNumber === parseInt('0')).toBe(true);
    expect(order.orderDate === now).toBe(true);
    expect(order.requiredDate === now).toBe(true);
    expect(order.shippedDate === now).toBe(true);
    expect(order.status === '0').toBe(true);
    expect(order.comments === '0').toBe(true);
    expect(order.customerNumber === parseInt('0')).toBe(true);
  });
});
