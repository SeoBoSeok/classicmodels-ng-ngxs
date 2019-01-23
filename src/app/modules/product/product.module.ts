/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProductFacade } from './state/product.facade';

import { ProductListComponent } from './components/productList.component';
import { ProductShowComponent } from './components/productShow.component';
import { ProductEditComponent } from './components/productEdit.component';

import { SharedModule } from '../../shared';
import { CommonComponentsModule } from '../../common_components';

const productRouting: ModuleWithProviders = RouterModule.forChild([
  { path: 'list', component: ProductListComponent },
  { path: 'show', component: ProductShowComponent },
  { path: 'show/:productCode', component: ProductShowComponent },
  { path: 'edit', component: ProductEditComponent },
  { path: 'edit/:productCode', component: ProductEditComponent },
]);

@NgModule({
  imports: [
    productRouting,

    CommonComponentsModule,
    SharedModule
  ],
  providers: [
    ProductFacade
  ],
  declarations: [
    ProductListComponent,
    ProductShowComponent,
    ProductEditComponent,
  ],
  exports: [
    ProductListComponent,
    ProductShowComponent,
    ProductEditComponent,
  ]
})
export class ProductModule {}
