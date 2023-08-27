import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ListProjectComponent } from './list-project/list-project.component';
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

import {ProjectService, TaskService, ItemService,ProviderService, CustomerService,BomService, CostSimulationService,
  LocationDetailService,InventoryStatusService,MesureService, SiteService, LocationService, InventoryTransactionService,
        PsService,SaleOrderService, RequisitionService, EmployeService,AddReportService, SequenceService, DeviseService} 
from '../../../core/erp';


import { ListPmComponent } from './list-pm/list-pm.component';
import { AddReportComponent } from './add-report/add-report.component';

const routes: Routes = [
  {
    path: 'create-project',
    component: CreateProjectComponent
  },
  {
    path: 'list-project',
    component: ListProjectComponent
  },
  {
    path: 'list-pm',
    component: ListPmComponent
  },
  {
    path: 'add-report',
    component: AddReportComponent
  },
  
] 


@NgModule({
  declarations: [ProjectComponent, CreateProjectComponent, ListProjectComponent, ListPmComponent, AddReportComponent],
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
  ProjectService,
  TaskService,
  ItemService,
  CustomerService,
  ProviderService,
  BomService,
  PsService,
  EmployeService,
  AddReportService,
  SaleOrderService,
  SequenceService,
  RequisitionService,
  CostSimulationService,
  LocationDetailService,
  InventoryStatusService,
  LocationService,
  MesureService, 
  SiteService,
  DeviseService,
  InventoryTransactionService,
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
export class ProjectModule { }
