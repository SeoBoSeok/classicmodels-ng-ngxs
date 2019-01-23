/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PaymentFacade } from './state/payment.facade';

import { PaymentListComponent } from './components/paymentList.component';
import { PaymentShowComponent } from './components/paymentShow.component';
import { PaymentEditComponent } from './components/paymentEdit.component';

import { SharedModule } from '../../shared';
import { CommonComponentsModule } from '../../common_components';

const paymentRouting: ModuleWithProviders = RouterModule.forChild([
  { path: 'list', component: PaymentListComponent },
  { path: 'show', component: PaymentShowComponent },
  { path: 'show/:customerNumber/:checkNumber', component: PaymentShowComponent },
  { path: 'edit', component: PaymentEditComponent },
  { path: 'edit/:customerNumber/:checkNumber', component: PaymentEditComponent },
]);

@NgModule({
  imports: [
    paymentRouting,

    CommonComponentsModule,
    SharedModule
  ],
  providers: [
    PaymentFacade
  ],
  declarations: [
    PaymentListComponent,
    PaymentShowComponent,
    PaymentEditComponent,
  ],
  exports: [
    PaymentListComponent,
    PaymentShowComponent,
    PaymentEditComponent,
  ]
})
export class PaymentModule {}
