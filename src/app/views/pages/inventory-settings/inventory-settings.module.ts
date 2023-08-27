import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { InventorySettingsComponent } from "./inventory-settings.component"
import { CreateLocComponent } from "./create-loc/create-loc.component"
import { CreateSiteComponent } from "./create-site/create-site.component"
import { CreateStatusStockComponent } from "./create-status-stock/create-status-stock.component"
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

import {SiteService, 
        LocationService,
        CodeService, 
        InventoryStatusService,
        AccountService,
        ProjectService,
      EntityService} 
from '../../../core/erp'
import { ListLocComponent } from './list-loc/list-loc.component';
import { EditLocComponent } from './edit-loc/edit-loc.component';
import { ListSiteComponent } from './list-site/list-site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { ListStatusComponent } from './list-status/list-status.component';
import { EditStatusComponent } from './edit-status/edit-status.component'
const routes: Routes = [
  {
    path: 'create-site',
    component: CreateSiteComponent
  },
  {
    path: 'list-site',
    component: ListSiteComponent
  },
  {
    path: 'edit-site/:id',
    component: EditSiteComponent
  },
  {
    path: 'create-loc',
    component: CreateLocComponent
  },
  {
    path: 'list-loc',
    component: ListLocComponent
  },
  {
    path: 'edit-loc/:id',
    component: EditLocComponent
  },
  {
    path: 'create-status-stock',
    component: CreateStatusStockComponent
  },
  {
    path: 'list-status',
    component: ListStatusComponent
  },
  {
    path: 'edit-status/:id',
    component: EditStatusComponent
  },
] 

@NgModule({
    declarations: [
        InventorySettingsComponent,
        CreateLocComponent,
        CreateSiteComponent,
        CreateStatusStockComponent,
        ListLocComponent,
        EditLocComponent,
        ListSiteComponent,
        EditSiteComponent,
        ListStatusComponent,
        EditStatusComponent,
    ],
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
        NgbModule,
        MatButtonModule,
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
        SiteService,
        LocationService,
        CodeService,
        AccountService,
        EntityService,
        TypesUtilsService,
        LayoutUtilsService,
        InventoryStatusService,
        ProjectService
    ],
    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
    ],
})
export class InventorySettingsModule {}
