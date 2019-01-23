/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrderdetailFacade } from './state/orderdetail.facade';

import { OrderdetailListComponent } from './components/orderdetailList.component';
import { OrderdetailShowComponent } from './components/orderdetailShow.component';
import { OrderdetailEditComponent } from './components/orderdetailEdit.component';

import { SharedModule } from '../../shared';
import { CommonComponentsModule } from '../../common_components';

const orderdetailRouting: ModuleWithProviders = RouterModule.forChild([
  { path: 'list', component: OrderdetailListComponent },
  { path: 'show', component: OrderdetailShowComponent },
  { path: 'show/:orderNumber/:productCode', component: OrderdetailShowComponent },
  { path: 'edit', component: OrderdetailEditComponent },
  { path: 'edit/:orderNumber/:productCode', component: OrderdetailEditComponent },
]);

@NgModule({
  imports: [
    orderdetailRouting,

    CommonComponentsModule,
    SharedModule
  ],
  providers: [
    OrderdetailFacade
  ],
  declarations: [
    OrderdetailListComponent,
    OrderdetailShowComponent,
    OrderdetailEditComponent,
  ],
  exports: [
    OrderdetailListComponent,
    OrderdetailShowComponent,
    OrderdetailEditComponent,
  ]
})
export class OrderdetailModule {}
