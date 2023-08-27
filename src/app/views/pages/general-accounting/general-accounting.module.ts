import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from "@angular/material/tabs"
//bootsrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from "../../../../environments/environment"
import {
    NgbProgressbarModule,
    NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap"
import { NgxPermissionsModule } from "ngx-permissions"
import { AngularSlickgridModule } from 'angular-slickgrid'
import { GeneralAccountingComponent } from './general-accounting.component';
import { AffectFrpComponent } from './affect-frp/affect-frp.component';
import { AccountPayableService,FraisService, PurchaseReceiveService, GeneralLedgerService, DeviseService,
         AccountService,SubaccountService,CostcenterService, DaybookService, ProjectService, EntityService } from '../../../core/erp';
import { CreateGlComponent } from './create-gl/create-gl.component';
import { EditGlComponent } from './edit-gl/edit-gl.component';
import { ListGlComponent } from './list-gl/list-gl.component';

const routes: Routes = [
  {
    path: 'affect-frp',
    component: AffectFrpComponent
  },
  {
    path: 'create-gl',
    component: CreateGlComponent
  },
  {
    path: 'list-gl',
    component: ListGlComponent
  },
  {
    path: 'edit-gl/:id',
    component: EditGlComponent
  },
  
] 



@NgModule({
  declarations: [GeneralAccountingComponent, AffectFrpComponent, CreateGlComponent, EditGlComponent, ListGlComponent],
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

    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    AccountPayableService,
    FraisService,
    PurchaseReceiveService,
    GeneralLedgerService,
    AccountService,
    DeviseService,
    SubaccountService,
    CostcenterService,
    DaybookService,
    ProjectService,
    EntityService,
    TypesUtilsService,
    LayoutUtilsService,
],
entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
],
})
export class GeneralAccountingModule { }