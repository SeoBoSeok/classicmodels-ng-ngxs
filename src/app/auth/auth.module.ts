/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NgxsModule } from '@ngxs/store';

import {
    SessionService
} from './service';

import { SharedModule } from '../shared';

const authRouting: ModuleWithProviders = RouterModule.forChild([
]);

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    authRouting,
    TranslateModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    SessionService,
  ]
})
export class AuthModule {}
