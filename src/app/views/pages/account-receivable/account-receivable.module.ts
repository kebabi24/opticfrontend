import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountReceivableComponent } from './account-receivable.component';
import { CreateAccountReceivableComponent } from './create-account-receivable/create-account-receivable.component';

import { RouterModule, Routes } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api"
// Translate Module
import { TranslateModule } from "@ngx-translate/core"
// NGRX
import { StoreModule } from "@ngrx/store"
import { EffectsModule } from "@ngrx/effects"
// UI
import { PartialsModule } from "../../partials/partials.module"
// Core
import { FakeApiService } from "../../../core/_base/layout"
// Auth
import { ModuleGuard } from "../../../core/auth"

// Core => Utils
import {
    HttpUtilsService,
    TypesUtilsService,
    InterceptService,
    LayoutUtilsService,
} from "../../../core/_base/crud"
// Shared
import {
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
} from "../../partials/content/crud"

// Material
import { MatMenuModule } from "@angular/material/menu"
import { MatButtonModule } from "@angular/material/button"
import { MatTabsModule } from "@angular/material/tabs"
//bootsrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"

import { environment } from "../../../../environments/environment"
import {
    NgbProgressbarModule,
    NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap"

import { NgxPermissionsModule } from "ngx-permissions"
import { AngularSlickgridModule } from "angular-slickgrid"
import { UsersService, CodeService, TaxeService, CustomerService, SequenceService, 
  DeviseService,  InvoiceOrderService, BankService, AccountReceivableService,} from '../../../core/erp';
import { CreateNoteComponent } from './create-note/create-note.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { ListPaymentRapComponent } from './list-payment-rap/list-payment-rap.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';

  const routes: Routes = [
    {
        path: "",
        component: AccountReceivableComponent,
        // canActivate: [ModuleGuard],
        // data: { moduleName: 'ecommerce' },
        children: [
       
            {
                path: "create-account-receivable",
                component: CreateAccountReceivableComponent,
            },
            {
                path: "create-note",
                component: CreateNoteComponent,
            },
            {
                path: "list-payment-rap",
                component: ListPaymentRapComponent,
              },
              {
                path: "list-payment",
                component: ListPaymentComponent,
              },
              {
                path: "edit-payment/:id",
                component: EditPaymentComponent,
              },
          
        ],
    },
]

@NgModule({
  declarations: [AccountReceivableComponent, CreateAccountReceivableComponent, CreateNoteComponent, EditPaymentComponent, ListPaymentRapComponent, ListPaymentComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AngularSlickgridModule.forRoot(),
    MatMenuModule,
    MatTabsModule,
    MatButtonModule,
    NgbModule,
    environment.isMockEnabled
        ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
              passThruUnknownUrl: true,
              dataEncapsulation: false,
          })
        : [],
],
providers: [
    ModuleGuard,
    InterceptService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: InterceptService,
        multi: true,
    },
    UsersService,
    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
    CodeService,
    SequenceService,
    CustomerService,
    TaxeService,
    DeviseService,
    BankService,
    AccountReceivableService,
    InvoiceOrderService,
],

entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
],
})
export class AccountReceivableModule { }
