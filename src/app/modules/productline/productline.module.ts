/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProductlineFacade } from './state/productline.facade';

import { ProductlineListComponent } from './components/productlineList.component';
import { ProductlineShowComponent } from './components/productlineShow.component';
import { ProductlineEditComponent } from './components/productlineEdit.component';

import { SharedModule } from '../../shared';
import { CommonComponentsModule } from '../../common_components';

const productlineRouting: ModuleWithProviders = RouterModule.forChild([
  { path: 'list', component: ProductlineListComponent },
  { path: 'show', component: ProductlineShowComponent },
  { path: 'show/:productLine', component: ProductlineShowComponent },
  { path: 'edit', component: ProductlineEditComponent },
  { path: 'edit/:productLine', component: ProductlineEditComponent },
]);

@NgModule({
  imports: [
    productlineRouting,

    CommonComponentsModule,
    SharedModule
  ],
  providers: [
    ProductlineFacade
  ],
  declarations: [
    ProductlineListComponent,
    ProductlineShowComponent,
    ProductlineEditComponent,
  ],
  exports: [
    ProductlineListComponent,
    ProductlineShowComponent,
    ProductlineEditComponent,
  ]
})
export class ProductlineModule {}
