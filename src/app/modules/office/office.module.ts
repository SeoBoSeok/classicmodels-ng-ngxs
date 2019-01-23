/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgxsModule } from '@ngxs/store';
import { OfficeState } from './state/office.state';
import { OfficeFacade } from './state/office.facade';

import { OfficeListComponent } from './components/officeList.component';
import { OfficeShowComponent } from './components/officeShow.component';
import { OfficeEditComponent } from './components/officeEdit.component';
import { OfficeMapComponent } from './components/officeMap.component';

import { SharedModule } from '../../shared';
import { CommonComponentsModule } from '../../common_components';

const officeRouting: ModuleWithProviders = RouterModule.forChild([
  { path: 'list', component: OfficeListComponent },
  { path: 'show', component: OfficeShowComponent },
  { path: 'show/:officeCode', component: OfficeShowComponent },
  { path: 'edit', component: OfficeEditComponent },
  { path: 'edit/:officeCode', component: OfficeEditComponent },
  { path: 'map', component: OfficeMapComponent },
]);

@NgModule({
  imports: [
    officeRouting,
    NgxsModule.forFeature([
        OfficeState
    ]),

    CommonComponentsModule,
    SharedModule
  ],
  providers: [
    OfficeFacade
  ],
  declarations: [
    OfficeListComponent,
    OfficeShowComponent,
    OfficeEditComponent,
    OfficeMapComponent,
  ],
  exports: [
    OfficeListComponent,
    OfficeShowComponent,
    OfficeEditComponent,
    OfficeMapComponent,
  ]
})
export class OfficeModule {}
