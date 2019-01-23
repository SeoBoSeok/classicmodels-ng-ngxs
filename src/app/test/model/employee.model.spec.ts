/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Employee, Office, Customer } from '../../core';

describe('test to create employee model', () => {
  it('employee created', () => {
    let employee: Employee = new Employee({
        employeeNumber: parseInt('0'),
        lastName: '0',
        firstName: '0',
        extension: '0',
        email: '0',
        officeCode: '0',
        reportsTo: parseInt('0'),
        jobTitle: '0',
    });

    expect(employee.employeeNumber === parseInt('0')).toBe(true);
    expect(employee.lastName === '0').toBe(true);
    expect(employee.firstName === '0').toBe(true);
    expect(employee.extension === '0').toBe(true);
    expect(employee.email === '0').toBe(true);
    expect(employee.officeCode === '0').toBe(true);
    expect(employee.reportsTo === parseInt('0')).toBe(true);
    expect(employee.jobTitle === '0').toBe(true);
  });
});
