import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceSettingComponent } from './price-setting.component';
import { CreatePriceComponent } from './create-price/create-price.component';
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
import { ListPriceComponent } from './list-price/list-price.component';
import { EditPriceComponent } from './edit-price/edit-price.component';
import { ItemService, CodeService, 
  CustomerService, DeviseService, PricelistService} from '../../../core/erp';

const routes: Routes = [
  {
    path: 'create-price',
    component: CreatePriceComponent
  },
  {
    path: 'list-price',
    component: ListPriceComponent
  },
  {
    path: 'edit-price/:id',
    component: EditPriceComponent
  },
] 

@NgModule({
  declarations: [PriceSettingComponent, CreatePriceComponent, ListPriceComponent, EditPriceComponent],
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
  TypesUtilsService,
  LayoutUtilsService,
  CodeService,
  ItemService,
  CustomerService,
  DeviseService,
  PricelistService,
],
})

export class PriceSettingModule { }
