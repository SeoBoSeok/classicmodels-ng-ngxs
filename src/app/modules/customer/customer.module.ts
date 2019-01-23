/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgxsModule } from '@ngxs/store';
import { CustomerState } from './state/customer.state';
import { CustomerFacade } from './state/customer.facade';

import { CustomerListComponent } from './components/customerList.component';
import { CustomerListFilterComponent } from './components/customerList.filter.component';
import { CustomerShowComponent } from './components/customerShow.component';
import { CustomerEditComponent } from './components/customerEdit.component';
import { CustomerPaymentStatisticComponent } from './components/customerPaymentStatistic.component';
import { CustomerPaymentStatisticFilterComponent } from './components/customerPaymentStatistic.filter.component';

import { SharedModule } from '../../shared';
import { CommonComponentsModule } from '../../common_components';

const customerRouting: ModuleWithProviders = RouterModule.forChild([
  { path: 'list', component: CustomerListComponent },
  { path: 'show', component: CustomerShowComponent },
  { path: 'show/:customerNumber', component: CustomerShowComponent },
  { path: 'edit', component: CustomerEditComponent },
  { path: 'edit/:customerNumber', component: CustomerEditComponent },
  { path: 'statistics', component: CustomerPaymentStatisticComponent },
]);

@NgModule({
  imports: [
    customerRouting,
    NgxsModule.forFeature([
        CustomerState
    ]),

    CommonComponentsModule,
    SharedModule
  ],
  providers: [
    CustomerFacade
  ],
  declarations: [
    CustomerListComponent,
    CustomerListFilterComponent,
    CustomerShowComponent,
    CustomerEditComponent,
    CustomerPaymentStatisticComponent,
    CustomerPaymentStatisticFilterComponent,
  ],
  exports: [
    CustomerListComponent,
    CustomerShowComponent,
    CustomerEditComponent,
    CustomerPaymentStatisticComponent,
  ]
})
export class CustomerModule {}
