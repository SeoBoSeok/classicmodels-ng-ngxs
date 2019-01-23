/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import {
    Office,
    Customer,
    EmployeeEditForm,
    EmployeeService,
    OfficeService,
    Employee,
    UriUtils,
    CoreModule
} from '../../core';

import { EmployeeFacade } from '../../modules/employee/state/employee.facade';

describe("employeeFacade test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                //EmployeeModule
                CoreModule
            ],
            providers: [
                EmployeeFacade
            ]
        });
    });

    it("should return expectedEmployees from EmployeeFacade.getEmployeeList()", async(
        inject([EmployeeFacade, HttpTestingController], (employeeFacade: EmployeeFacade, backend: HttpTestingController) => {
            const expectedEmployees: Employee[] = [
                new Employee({id:0, title: 'John'}),
                new Employee({id:1, title: 'Doe'})
            ];

            const params = {
                lastName: "1",
            };
            employeeFacade.getEmployeeList(params);
            employeeFacade.employeeList$.pipe(
                filter((employees: Array<Employee>) => !!employees && employees.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                employees => expect(employees).toEqual(expectedEmployees, 'expected employees'),
                fail
            );
            employeeFacade.hasMoreEmployeeList$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                hasMore => expect(hasMore).not.toBe(true),
                fail
            );

            let url = UriUtils.toUrlParams('employees/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedEmployees);
        })
    ));

    it("EmployeeService.EmployeeList() should throw exception for 401 Unauthorized", async(
        inject([EmployeeFacade, HttpTestingController], (employeeFacade: EmployeeFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            employeeFacade.getEmployeeList(params);
            employeeFacade.employeeListError$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('employees/list', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return new EmployeeEditForm from EmployeeFacade.initEmployeeEdit()", async(
        inject([EmployeeFacade, HttpTestingController], (employeeFacade: EmployeeFacade, backend: HttpTestingController) => {
            employeeFacade.initEmployeeEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.employee).not.toBeNull();
                },
                fail
            );

            employeeFacade.initEmployeeEdit();
        })
    ));

    it("should return expected EmployeeEditForm from EmployeeFacade.loadEmployeeEdit()", async(
        inject([EmployeeFacade, HttpTestingController], (employeeFacade: EmployeeFacade, backend: HttpTestingController) => {
            const expectedEmployee: Employee = new Employee({
                employeeNumber: 1,
                lastName: "1",
                firstName: "1",
                extension: "1",
                email: "1",
                jobTitle: "1",
            });

            employeeFacade.loadEmployeeEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.employee).not.toBeNull();
                    expect(ef.employee).toEqual(expectedEmployee, 'expected Employee');
                },
                fail
            );

            employeeFacade.getEmployeeEdit({
                employeeNumber: 1
            });

            let url = UriUtils.url("employees/find/1");

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedEmployee);
        })
    ));

    it("should save edited EmployeeEditForm with EmployeeFacade.saveEmployeeEdit()", async(
        inject([EmployeeFacade, HttpTestingController], (employeeFacade: EmployeeFacade, backend: HttpTestingController) => {
            const expectedEmployee: Employee = new Employee({
                employeeNumber: 1,
                lastName: "1",
                firstName: "1",
                extension: "1",
                email: "1",
                jobTitle: "1",
            });
            const editedEmployee: Employee = new Employee({
                employeeNumber: null,
                lastName: "1",
                firstName: "1",
                extension: "1",
                email: "1",
                jobTitle: "1",
            });

            employeeFacade.saveEmployeeEditForm$.pipe(
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.employee).not.toBeNull();
                    expect(ef.employee).toEqual(expectedEmployee, 'expected Employee');
                },
                fail
            );

            const ef: EmployeeEditForm = new EmployeeEditForm();
            ef.employee = editedEmployee;

            employeeFacade.saveEmployeeEdit(ef);

            const ef2: EmployeeEditForm = new EmployeeEditForm();
            ef2.employee = expectedEmployee;

            let url = UriUtils.url('employees/edit');

            backend.match({
                url: url,
                method: 'POST'
            })[0].flush(ef2);
        })
    ));

});
