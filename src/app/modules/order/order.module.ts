/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrderFacade } from './state/order.facade';

import { OrderListComponent } from './components/orderList.component';
import { OrderShowComponent } from './components/orderShow.component';
import { OrderEditComponent } from './components/orderEdit.component';

import { SharedModule } from '../../shared';
import { CommonComponentsModule } from '../../common_components';

const orderRouting: ModuleWithProviders = RouterModule.forChild([
  { path: 'list', component: OrderListComponent },
  { path: 'show', component: OrderShowComponent },
  { path: 'show/:orderNumber', component: OrderShowComponent },
  { path: 'edit', component: OrderEditComponent },
  { path: 'edit/:orderNumber', component: OrderEditComponent },
]);

@NgModule({
  imports: [
    orderRouting,

    CommonComponentsModule,
    SharedModule
  ],
  providers: [
    OrderFacade
  ],
  declarations: [
    OrderListComponent,
    OrderShowComponent,
    OrderEditComponent,
  ],
  exports: [
    OrderListComponent,
    OrderShowComponent,
    OrderEditComponent,
  ]
})
export class OrderModule {}
