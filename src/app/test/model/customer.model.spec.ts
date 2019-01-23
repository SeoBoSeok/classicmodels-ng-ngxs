/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Customer, Employee, Order, Payment } from '../../core';

describe('test to create customer model', () => {
  it('customer created', () => {
    let customer: Customer = new Customer({
        customerNumber: parseInt('0'),
        customerName: '0',
        contactLastName: '0',
        contactFirstName: '0',
        phone: '0',
        addressLine1: '0',
        addressLine2: '0',
        city: '0',
        state: '0',
        postalCode: '0',
        country: '0',
        salesRepEmployeeNumber: parseInt('0'),
        creditLimit: parseInt('0'),
    });

    expect(customer.customerNumber === parseInt('0')).toBe(true);
    expect(customer.customerName === '0').toBe(true);
    expect(customer.contactLastName === '0').toBe(true);
    expect(customer.contactFirstName === '0').toBe(true);
    expect(customer.phone === '0').toBe(true);
    expect(customer.addressLine1 === '0').toBe(true);
    expect(customer.addressLine2 === '0').toBe(true);
    expect(customer.city === '0').toBe(true);
    expect(customer.state === '0').toBe(true);
    expect(customer.postalCode === '0').toBe(true);
    expect(customer.country === '0').toBe(true);
    expect(customer.salesRepEmployeeNumber === parseInt('0')).toBe(true);
    expect(customer.creditLimit === parseInt('0')).toBe(true);
  });
});
