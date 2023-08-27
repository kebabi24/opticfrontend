import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobComponent } from './job.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { ListJobComponent } from './list-job/list-job.component';
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

import {JobService} 
from '../../../core/erp';
import { EditJobComponent } from './edit-job/edit-job.component';

const routes: Routes = [
  {
    path: 'create-job',
    component: CreateJobComponent
  },
  {
    path: 'list-job',
    component: ListJobComponent
  },
  
] 
@NgModule({
  declarations: [JobComponent, CreateJobComponent, ListJobComponent, EditJobComponent],
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
  JobService,
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
export class JobModule { }
