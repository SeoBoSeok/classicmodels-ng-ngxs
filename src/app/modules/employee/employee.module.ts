/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmployeeFacade } from './state/employee.facade';

import { EmployeeListComponent } from './components/employeeList.component';
import { EmployeeListFilterComponent } from './components/employeeList.filter.component';
import { EmployeeShowComponent } from './components/employeeShow.component';
import { EmployeeEditComponent } from './components/employeeEdit.component';

import { SharedModule } from '../../shared';
import { CommonComponentsModule } from '../../common_components';

const employeeRouting: ModuleWithProviders = RouterModule.forChild([
  { path: 'list', component: EmployeeListComponent },
  { path: 'show', component: EmployeeShowComponent },
  { path: 'show/:employeeNumber', component: EmployeeShowComponent },
  { path: 'edit', component: EmployeeEditComponent },
  { path: 'edit/:employeeNumber', component: EmployeeEditComponent },
]);

@NgModule({
  imports: [
    employeeRouting,

    CommonComponentsModule,
    SharedModule
  ],
  providers: [
    EmployeeFacade
  ],
  declarations: [
    EmployeeEditComponent,
  ],
  exports: [
    EmployeeEditComponent,
  ]
})
export class EmployeeModule {}
