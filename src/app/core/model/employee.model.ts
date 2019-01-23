/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Office } from './office.model';
import { Customer } from './customer.model';

/**
*/
export class Employee {

    employeeNumber: number;
    lastName: string;
    firstName: string;
    extension: string;
    email: string;
    officeCode: string;
    reportsTo: number;
    jobTitle: string;

    reportsToEmployee: Employee;
    office: Office;
    customers: Customer[];
    employeeNumberEmployees: Employee[];
    __xtra__: any = {};

    constructor (values: Object = {}) {
        Object.assign(this, values);

        if (this.customers) {
            const customerArr: Array<Customer> = [];
            this.customers.forEach(customer => customerArr.push(new Customer(customer)));
            this.customers = customerArr;
        }
        if (this.employeeNumberEmployees) {
            const employeeNumberEmployeeArr: Array<Employee> = [];
            this.employeeNumberEmployees.forEach(employeeNumberEmployee => employeeNumberEmployeeArr.push(new Employee(employeeNumberEmployee)));
            this.employeeNumberEmployees = employeeNumberEmployeeArr;
        }
    }

    isPersisted(): boolean {
        // CAUTION: 
        return (!!this.employeeNumber);
    }
    /**
    * To select each row in list.
    */
    isSelected(): boolean {
        if (!this.__xtra__["selected"]) {
            this.__xtra__["selected"] = false;
        }
        return this.__xtra__.selected;
    }
    setSelected(val: boolean): void {
        this.__xtra__["selected"] = val;
    }

}
