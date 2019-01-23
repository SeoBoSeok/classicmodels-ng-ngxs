/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
    Office,
    Customer,
    EmployeeEditForm,
    EmployeeService,
    OfficeService,
    Employee,
    UriUtils
} from '../../core';

describe("employeeService test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                EmployeeService,
                OfficeService,
            ]
        });
    });

    it("should return expectedEmployees from EmployeeService.getEmployeeList()", async(
        inject([EmployeeService, HttpTestingController], (service: EmployeeService, backend: HttpTestingController) => {
            const expectedEmployees: Employee[] = [
                new Employee({id:0, title: 'John'}),
                new Employee({id:1, title: 'Doe'})
            ];

            const params = {
                lastName: "1",
            };
            service.getEmployeeList(params).subscribe(rows => {
                expect(rows.length).toBe(expectedEmployees.length);
                expect(rows).toEqual(expectedEmployees);
            });

            let url = UriUtils.toUrlParams('employees/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedEmployees);
        })
    ));

    it("EmployeeService.EmployeeList() should throw exception for 401 Unauthorized", async(
        inject([EmployeeService, HttpTestingController], (service: EmployeeService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getEmployeeList(params).subscribe(
                rows => fail('expected an error, not employees'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('employees/list', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

});
