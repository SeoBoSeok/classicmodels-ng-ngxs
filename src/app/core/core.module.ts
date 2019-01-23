/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HttpHeaderInterceptor } from './interceptors/http.header.interceptor';
import { HttpFacade } from './state/facade/http.facade';
import { 
    CustomerService,
    EmployeeService,
    OfficeService,
    OrderdetailService,
    OrderService,
    PaymentService,
    ProductlineService,
    ProductService,
    UploadService,
    ConfirmService
} from './service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    RouterModule,
    TranslateModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    RouterModule,
    TranslateModule
  ],
  providers: [
    { provide: COMPOSITION_BUFFER_MODE, useValue: false },
    HttpHeaderInterceptor,
    { provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true },
    CustomerService,
    EmployeeService,
    OfficeService,
    OrderdetailService,
    OrderService,
    PaymentService,
    ProductlineService,
    ProductService,
    UploadService,
    HttpFacade
  ]
})
export class CoreModule {}
