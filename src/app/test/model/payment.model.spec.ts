/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Payment, Customer } from '../../core';

describe('test to create payment model', () => {
  it('payment created', () => {
    let now: Date = new Date();
    let payment: Payment = new Payment({
        customerNumber: parseInt('0'),
        checkNumber: '0',
        paymentDate: now,
        amount: parseInt('0'),
    });

    expect(payment.customerNumber === parseInt('0')).toBe(true);
    expect(payment.checkNumber === '0').toBe(true);
    expect(payment.paymentDate === now).toBe(true);
    expect(payment.amount === parseInt('0')).toBe(true);
  });
});
