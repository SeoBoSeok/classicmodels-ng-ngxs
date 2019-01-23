/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Employee } from '../employee.model';
import { Office } from '../office.model';
import { Customer } from '../customer.model';

/**
*/
export class EmployeeEditForm {

    employee: Employee;
    employeeNumber: number;
    offices: Array<Office>;
    errors: any;

    constructor () {}
}
