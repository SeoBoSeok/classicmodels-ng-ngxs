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

import {
        MatButtonModule, 
        MatCardModule, MatCheckboxModule, 
        MatDatepickerModule, MatDialogModule, 
        MatIconModule, MatInputModule, 
        MatListModule,
        MatMenuModule,
        MatRadioModule,
        MatSelectModule, MatSidenavModule, 
        MatTableModule, MatPaginatorModule, MatSortModule,
        MatTabsModule, MatToolbarModule, MatTooltipModule 
} from '@angular/material';

import { NgxsModule } from '@ngxs/store';

import { ChartsModule } from 'ng2-charts';

import { CoreModule } from '../core';

import { AutoTabDirective } from './directives/autotab.directive';
import { IntegerOnlyDirective } from './directives/integer.only.directive';
import { NumberOnlyDirective } from './directives/number.only.directive';
import { PositiveIntOnlyDirective } from './directives/positive.int.only.directive';

import { DataTableComponent } from './dataTable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    ChartsModule,
    RouterModule,
    MatButtonModule, 
    MatCardModule, MatCheckboxModule, 
    MatDatepickerModule, MatDialogModule, 
    MatIconModule, MatInputModule, 
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule, MatSidenavModule, 
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatTabsModule, MatToolbarModule, MatTooltipModule,
    TranslateModule,
    CoreModule
  ],
  declarations: [
    AutoTabDirective,
    IntegerOnlyDirective,
    NumberOnlyDirective,
    PositiveIntOnlyDirective,
    DataTableComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule, 
    MatCardModule, MatCheckboxModule, 
    MatDatepickerModule, MatDialogModule, 
    MatIconModule, MatInputModule, 
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule, MatSidenavModule, 
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatTabsModule, MatToolbarModule, MatTooltipModule,
    ChartsModule,
    CoreModule,
    AutoTabDirective,
    IntegerOnlyDirective,
    NumberOnlyDirective,
    PositiveIntOnlyDirective,
    DataTableComponent,
    TranslateModule
  ],
  providers: [
  ]
})
export class SharedModule {}
