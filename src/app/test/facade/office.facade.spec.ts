/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { distinctUntilChanged, filter, flatMap, map, take, takeWhile, skip, tap } from 'rxjs/operators';

import {
    Employee,
    OfficeEditForm,
    OfficeService,
    Office,
    UriUtils,
    CoreModule
} from '../../core';

import { OfficeFacade } from '../../modules/office/state/office.facade';
import { OfficeState } from '../../modules/office/state/office.state';

describe("officeFacade test...", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([
                    OfficeState
                ]),
                //OfficeModule
                CoreModule
            ],
            providers: [
                OfficeFacade
            ]
        });
    });

    it("should return expectedOffices from OfficeFacade.getOfficeList()", async(
        inject([OfficeFacade, HttpTestingController], (officeFacade: OfficeFacade, backend: HttpTestingController) => {
            const expectedOffices: Office[] = [
                new Office({id:0, title: 'John'}),
                new Office({id:1, title: 'Doe'})
            ];

            const params = {};
            officeFacade.getOfficeList(params);
            officeFacade.officeList$.pipe(
                filter((offices: Array<Office>) => !!offices && offices.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                offices => expect(offices).toEqual(expectedOffices, 'expected offices'),
                fail
            );
            officeFacade.hasMoreOfficeList$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                hasMore => expect(hasMore).not.toBe(true),
                fail
            );

            let url = UriUtils.toUrlParams('offices/list', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOffices);
        })
    ));

    it("OfficeService.OfficeList() should throw exception for 401 Unauthorized", async(
        inject([OfficeFacade, HttpTestingController], (officeFacade: OfficeFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            officeFacade.getOfficeList(params);
            officeFacade.officeListError$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('offices/list', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return expectedOffices from OfficeFacade.getOfficeMap()", async(
        inject([OfficeFacade, HttpTestingController], (officeFacade: OfficeFacade, backend: HttpTestingController) => {
            const expectedOffices: Office[] = [
                new Office({id:0, title: 'John'}),
                new Office({id:1, title: 'Doe'})
            ];

            const params = {};
            officeFacade.getOfficeMap(params);
            officeFacade.officeMap$.pipe(
                filter((offices: Array<Office>) => !!offices && offices.length > 0),
                distinctUntilChanged()
            )
            .subscribe(
                offices => expect(offices).toEqual(expectedOffices, 'expected offices'),
                fail
            );

            let url = UriUtils.toUrlParams('offices/map', params);
//console.log("*** url: "+url);

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOffices);
        })
    ));

    it("OfficeService.OfficeMap() should throw exception for 401 Unauthorized", async(
        inject([OfficeFacade, HttpTestingController], (officeFacade: OfficeFacade, backend: HttpTestingController) => {
            const params = {title: 'abc'};

            officeFacade.getOfficeMap(params);
            officeFacade.officeMapError$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                error => {
                    console.log("catch error: ", error);
                    expect(error).toContain('Unauthorized');
                }
            );
            let url = UriUtils.toUrlParams('offices/map', params);
//console.log("*** url: "+url);
            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(null, { status: 401, statusText: 'Unauthorized' });
        })
    ));

    it("should return new OfficeEditForm from OfficeFacade.initOfficeEdit()", async(
        inject([OfficeFacade, HttpTestingController], (officeFacade: OfficeFacade, backend: HttpTestingController) => {
            officeFacade.initOfficeEditForm$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.office).not.toBeNull();
                },
                fail
            );

            officeFacade.initOfficeEdit();
        })
    ));

    it("should return expected OfficeEditForm from OfficeFacade.loadOfficeEdit()", async(
        inject([OfficeFacade, HttpTestingController], (officeFacade: OfficeFacade, backend: HttpTestingController) => {
            const expectedOffice: Office = new Office({
                officeCode: "1",
                city: "1",
                phone: "1",
                addressLine1: "1",
                addressLine2: "1",
                state: "1",
                country: "1",
                postalCode: "1",
                territory: "1",
            });

            officeFacade.loadOfficeEditForm$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.office).not.toBeNull();
                    expect(ef.office).toEqual(expectedOffice, 'expected Office');
                },
                fail
            );

            officeFacade.getOfficeEdit({
                officeCode: "1"
            });

            let url = UriUtils.url("offices/find/1");

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOffice);
        })
    ));

    it("should save edited OfficeEditForm with OfficeFacade.saveOfficeEdit()", async(
        inject([OfficeFacade, HttpTestingController], (officeFacade: OfficeFacade, backend: HttpTestingController) => {
            const expectedOffice: Office = new Office({
                officeCode: "1",
                city: "1",
                phone: "1",
                addressLine1: "1",
                addressLine2: "1",
                state: "1",
                country: "1",
                postalCode: "1",
                territory: "1",
            });
            const editedOffice: Office = new Office({
                officeCode: null,
                city: "1",
                phone: "1",
                addressLine1: "1",
                addressLine2: "1",
                state: "1",
                country: "1",
                postalCode: "1",
                territory: "1",
            });

            officeFacade.saveOfficeEditForm$.pipe(
                skip(1),
                distinctUntilChanged()
            )
            .subscribe(
                ef => {
                    expect(ef).not.toBeNull();
                    expect(ef.office).not.toBeNull();
                    expect(ef.office).toEqual(expectedOffice, 'expected Office');
                },
                fail
            );

            const ef: OfficeEditForm = new OfficeEditForm();
            ef.office = editedOffice;

            officeFacade.saveOfficeEdit(ef);

            const ef2: OfficeEditForm = new OfficeEditForm();
            ef2.office = expectedOffice;

            let url = UriUtils.url('offices/edit');

            backend.match({
                url: url,
                method: 'POST'
            })[0].flush(ef2);
        })
    ));

});
