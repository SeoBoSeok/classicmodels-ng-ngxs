/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {
    Employee,
    OfficeEditForm,
    OfficeService,
    Office,
    UriUtils
} from '../../core';

describe("officeService test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                OfficeService,
            ]
        });
    });

    it("should return expectedOffices from OfficeService.getOfficeList()", async(
        inject([OfficeService, HttpTestingController], (service: OfficeService, backend: HttpTestingController) => {
            const expectedOffices: Office[] = [
                new Office({id:0, title: 'John'}),
                new Office({id:1, title: 'Doe'})
            ];

            const params = {};
            service.getOfficeList(params).subscribe(rows => {
                expect(rows.length).toBe(expectedOffices.length);
                expect(rows).toEqual(expectedOffices);
            });

            let url = UriUtils.toUrlParams('offices/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOffices);
        })
    ));

    it("OfficeService.OfficeList() should throw exception for 401 Unauthorized", async(
        inject([OfficeService, HttpTestingController], (service: OfficeService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getOfficeList(params).subscribe(
                rows => fail('expected an error, not offices'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('offices/list', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return expectedOffices from OfficeService.getOfficeMap()", async(
        inject([OfficeService, HttpTestingController], (service: OfficeService, backend: HttpTestingController) => {
            const expectedOffices: Office[] = [
                new Office({id:0, title: 'John'}),
                new Office({id:1, title: 'Doe'})
            ];

            const params = {};
            service.getOfficeMap(params).subscribe(rows => {
                expect(rows.length).toBe(expectedOffices.length);
                expect(rows).toEqual(expectedOffices);
            });

            let url = UriUtils.toUrlParams('offices/map', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOffices);
        })
    ));

    it("OfficeService.OfficeMap() should throw exception for 401 Unauthorized", async(
        inject([OfficeService, HttpTestingController], (service: OfficeService, backend: HttpTestingController) => {
            const params = {title: 'abc'};
            service.getOfficeMap(params).subscribe(
                rows => fail('expected an error, not offices'),
                error  => {
                    console.log("catch error: ", error);
                    expect(error.status).toBe(401);
                    expect(error.statusText).toContain('Unauthorized');
                }
            );

            let url = UriUtils.toUrlParams('offices/map', params);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

});
