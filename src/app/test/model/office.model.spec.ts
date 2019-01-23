/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Office, Employee } from '../../core';

describe('test to create office model', () => {
  it('office created', () => {
    let office: Office = new Office({
        officeCode: '0',
        city: '0',
        phone: '0',
        addressLine1: '0',
        addressLine2: '0',
        state: '0',
        country: '0',
        postalCode: '0',
        territory: '0',
    });

    expect(office.officeCode === '0').toBe(true);
    expect(office.city === '0').toBe(true);
    expect(office.phone === '0').toBe(true);
    expect(office.addressLine1 === '0').toBe(true);
    expect(office.addressLine2 === '0').toBe(true);
    expect(office.state === '0').toBe(true);
    expect(office.country === '0').toBe(true);
    expect(office.postalCode === '0').toBe(true);
    expect(office.territory === '0').toBe(true);
  });
});
