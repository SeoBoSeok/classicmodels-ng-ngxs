/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { Observable, of } from 'rxjs';
import { startWith, flatMap, map } from 'rxjs/operators';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../../../shared/shared.module';

import { 
    Employee,
    Office, OfficeEditForm, OfficeService, 
    UriUtils 
} from '../../../core';

import { OfficeEditComponent } from '../../../modules/office/components/officeEdit.component';
import { OfficeState } from '../../../modules/office/state/office.state';

import { OfficeFacade } from '../../../modules/office/state/office.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create OfficeEditComponent', () => {
    let comp: OfficeEditComponent;
    let fixture: ComponentFixture<OfficeEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
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

    // asynchronous beforeEach
    beforeEach(async(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                SharedModule,
                HttpClientModule,
                HttpClientTestingModule,
                NgxsModule.forRoot([], { developmentMode: true }),
                NgxsModule.forFeature([
                    OfficeState
                ]),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                })
            ],
            declarations: [OfficeEditComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                OfficeFacade
            ],
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(OfficeEditComponent);
        comp = fixture.componentInstance;
    });

    it('should instantiate OfficeEditComponent', () => {
        expect(comp != null).toBe(true);
    });

    it("should return expected OfficeEditForm", async(
        inject([HttpTestingController], (backend: HttpTestingController) => {
            comp.officeCode = '1';
            fixture.detectChanges();
            fixture.whenStable()  
                .then(() => {
                    expect(comp.ef).toBeTruthy();
                    if (comp.ef) {
                        expect(comp.ef.office).toBeTruthy();
                        expect(comp.ef.office).toEqual(expectedOffice, 'expected Office');
                    }
                });

            let url = UriUtils.url('offices/find/1');

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedOffice);
        })
    ));

    it("should exists all columns for OfficeEdit in template", (done) => {
        const ef = new OfficeEditForm();
        ef.office = expectedOffice;
        comp.ef = ef;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.query(By.css('#officeCode'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#city'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#phone'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#addressLine1'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#addressLine2'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#state'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#country'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#postalCode'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#territory'));
            expect(de).toBeTruthy();

            done();
        });
    });

});
