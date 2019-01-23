/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import 'hammerjs';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { AuthModule } from './auth';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([
    {path: 'customers',
     loadChildren: 'app/modules/customer/customer.module#CustomerModule',
    },
    {path: 'employees',
     loadChildren: 'app/modules/employee/employee.module#EmployeeModule',
    },
    {path: 'offices',
     loadChildren: 'app/modules/office/office.module#OfficeModule',
    },
    {path: 'orderdetails',
     loadChildren: 'app/modules/orderdetail/orderdetail.module#OrderdetailModule',
    },
    {path: 'orders',
     loadChildren: 'app/modules/order/order.module#OrderModule',
    },
    {path: 'payments',
     loadChildren: 'app/modules/payment/payment.module#PaymentModule',
    },
    {path: 'productlines',
     loadChildren: 'app/modules/productline/productline.module#ProductlineModule',
    },
    {path: 'products',
     loadChildren: 'app/modules/product/product.module#ProductModule',
    },
]);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    HttpModule,

    NgxsModule.forRoot([], { developmentMode: !environment.production }),

    AuthModule,
    HomeModule,
    SharedModule,

    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),

    rootRouting
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
