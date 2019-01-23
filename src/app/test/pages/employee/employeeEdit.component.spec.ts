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

import { SharedModule } from '../../../shared/shared.module';

import { 
    Office,
    Customer,
    Employee, EmployeeEditForm, EmployeeService, 
    UriUtils 
} from '../../../core';

import { EmployeeEditComponent } from '../../../modules/employee/components/employeeEdit.component';

import { EmployeeFacade } from '../../../modules/employee/state/employee.facade';

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

describe('create EmployeeEditComponent', () => {
    let comp: EmployeeEditComponent;
    let fixture: ComponentFixture<EmployeeEditComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const expectedEmployee: Employee = new Employee({
        employeeNumber: 1,
        lastName: "1",
        firstName: "1",
        extension: "1",
        email: "1",
        jobTitle: "1",
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
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                })
            ],
            declarations: [EmployeeEditComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ActivatedRoute, useValue: {params: of({})} },
                { provide: Router, useValue: routerSpy },
                EmployeeFacade
            ],
        }).compileComponents();
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeeEditComponent);
        comp = fixture.componentInstance;
        const ef = new EmployeeEditForm();
        ef.employee = expectedEmployee;
        ef.offices = [];
        const employeeService = TestBed.get(EmployeeService);
        expect(employeeService).toBeTruthy();
        spyOn(employeeService, 'getEmployeeEdit').and.returnValue(of(ef));
    });

    it('should instantiate EmployeeEditComponent', () => {
        expect(comp != null).toBe(true);
    });

    it("should return expected EmployeeEditForm", async(
        inject([HttpTestingController], (backend: HttpTestingController) => {
            comp.employeeNumber = 1;
            fixture.detectChanges();
            fixture.whenStable()  
                .then(() => {
                    expect(comp.ef).toBeTruthy();
                    if (comp.ef) {
                        expect(comp.ef.employee).toBeTruthy();
                        expect(comp.ef.employee).toEqual(expectedEmployee, 'expected Employee');
                    }
                });

            let url = UriUtils.url('employees/find/1');

            backend.match({
                url: url,
                method: 'GET'
            })[0].flush(expectedEmployee);
        })
    ));

    it("should exists all columns for EmployeeEdit in template", (done) => {
        const ef = new EmployeeEditForm();
        ef.employee = expectedEmployee;
        comp.ef = ef;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            de = fixture.debugElement.query(By.css('#employeeNumber'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#lastName'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#firstName'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#extension'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#email'));
            expect(de).toBeTruthy();
            de = fixture.debugElement.query(By.css('#jobTitle'));
            expect(de).toBeTruthy();

            done();
        });
    });

});
