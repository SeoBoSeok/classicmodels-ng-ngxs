/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Employee } from './employee.model';

/**
*/
export class Office {

    officeCode: string;
    city: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    country: string;
    postalCode: string;
    territory: string;

    employees: Employee[];
    __xtra__: any = {};

    constructor (values: Object = {}) {
        Object.assign(this, values);

        if (this.employees) {
            const employeeArr: Array<Employee> = [];
            this.employees.forEach(employee => employeeArr.push(new Employee(employee)));
            this.employees = employeeArr;
        }
    }

    isPersisted(): boolean {
        // CAUTION: 
        return (!!this.officeCode);
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
