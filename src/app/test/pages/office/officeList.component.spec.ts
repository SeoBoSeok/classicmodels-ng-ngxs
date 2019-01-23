/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../../../shared/shared.module';

import { Office, OfficeService } from '../../../core';
import { OfficeListComponent } from '../../../modules/office/components/officeList.component';
import { OfficeState } from '../../../modules/office/state/office.state';
import { OfficeFacade } from '../../../modules/office/state/office.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create OfficeListComponent', () => {

    let comp: OfficeListComponent;
    let fixture: ComponentFixture<OfficeListComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    // asynchronous beforeEach
    beforeEach(async(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [
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
            declarations: [OfficeListComponent],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                OfficeFacade
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(OfficeListComponent);
        comp = fixture.componentInstance;
    });

    it('should instantiate OfficeListComponent', () => {
        expect(comp != null).toBe(true);
    });
});
