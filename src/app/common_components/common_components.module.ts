/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../shared';

import { EmployeeListComponent } from '../modules/employee/components/employeeList.component';
import { EmployeeListFilterComponent } from '../modules/employee/components/employeeList.filter.component';
import { EmployeeShowComponent } from '../modules/employee/components/employeeShow.component';
import { EmployeeFacade } from '../modules/employee/state/employee.facade';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    EmployeeListComponent,
    EmployeeListFilterComponent,
    EmployeeShowComponent,
  ],
  entryComponents: [

  ],
  exports: [
    EmployeeListComponent,
    EmployeeListFilterComponent,
    EmployeeShowComponent,
  ],
  providers: [
    EmployeeFacade,
  ]
})
export class CommonComponentsModule {}
