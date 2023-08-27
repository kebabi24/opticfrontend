
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import { PartialsModule } from '../../partials/partials.module';
import { ManufacturingComponent } from './manufacturing.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { LaunchOrderComponent } from './launch-order/launch-order.component';
import { CreateWorkCenterComponent } from './create-work-center/create-work-center.component';
import { CreateGammeComponent } from './create-gamme/create-gamme.component';
import { MoEntriesComponent } from './mo-entries/mo-entries.component';
import { CreateNomenclatureComponent } from './create-nomenclature/create-nomenclature.component';
import {AngularSlickgridModule} from 'angular-slickgrid';
import { CreateCauseComponent } from './create-cause/create-cause.component';
import { WorctEntryComponent } from './worct-entry/worct-entry.component';
import { WoissEntryComponent } from './woiss-entry/woiss-entry.component';

// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// Translate Module
import { TranslateModule } from "@ngx-translate/core";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
// UI
// Core
import { FakeApiService } from "../../../core/_base/layout";
// Auth
import { ModuleGuard } from "../../../core/auth";

// Core => Utils
import {
  HttpUtilsService,
  TypesUtilsService,
  InterceptService,
  LayoutUtilsService,
} from "../../../core/_base/crud";
// Shared
import {
  ActionNotificationComponent,
  DeleteEntityDialogComponent,
  FetchEntityDialogComponent,
  UpdateStatusDialogComponent,
} from "../../partials/content/crud";

// Material
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
//bootsrap

import { environment } from "../../../../environments/environment";
import {
  NgbProgressbarModule,
  NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap";

import { NgxPermissionsModule } from "ngx-permissions";
import {BomService, PsService, ItemService,SiteService,WorkOrderService, SequenceService,
        LocationService, MesureService, LocationDetailService, WorkOrderDetailService,CostSimulationService,

        AddressService,InventoryTransactionService,InventoryStatusService,ReasonService,WorkCenterService,
        WorkRoutingService,OperationHistory, OperationHistoryService, WoroutingService,BomPartService} from '../../../core/erp';

        

import { CreatePsComponent } from './create-ps/create-ps.component';
import { ListWoComponent } from './list-wo/list-wo.component';
import { EditWoComponent } from './edit-wo/edit-wo.component';
import { CreateOpComponent } from './create-op/create-op.component';
import { CreateRsnComponent } from './create-rsn/create-rsn.component';
import { EditRsnComponent } from './edit-rsn/edit-rsn.component';
import { ListRsnComponent } from './list-rsn/list-rsn.component';
import { ListGammeComponent } from './list-gamme/list-gamme.component';
import { EditGammeComponent } from './edit-gamme/edit-gamme.component';
import { EditWorkCenterComponent } from './edit-work-center/edit-work-center.component';
import { ListWorkCenterComponent } from './list-work-center/list-work-center.component';
import { AffectBomComponent } from './affect-bom/affect-bom.component';
import { CreateProdComponent } from './create-prod/create-prod.component';





const routes: Routes = [
  {
    path: 'create-order',
    component: CreateOrderComponent
  },
  {
    path: 'create-prod',
    component: CreateProdComponent
  },
  {
    path: 'list-wo',
    component: ListWoComponent
  },
  {
    path: 'edit-wo',
    component: EditWoComponent
  },
  {
    path: 'launch-order',
    component: LaunchOrderComponent
  },
  {
    path: 'create-work-center',
    component: CreateWorkCenterComponent
  },
  {
    path: 'list-work-center',
    component: ListWorkCenterComponent
  },
  {
    path: 'create-gamme',
    component: CreateGammeComponent
  },
  {
    path: 'create-rsn',
    component: CreateRsnComponent
  },
  {
    path: 'list-rsn',
    component: ListRsnComponent
  },
  {
    path: 'create-op',
    component: CreateOpComponent
  },
  {
    path: 'create-nomenclature',
    component: CreateNomenclatureComponent
  },
  {
    path: 'create-ps',
    component: CreatePsComponent
  },
  {
    path: 'create-cause',
    component: CreateCauseComponent
  },
  {
    path: 'edit-rsn/:id',
    component: EditRsnComponent
  },
  {
    path: 'worct-entry',
    component: WorctEntryComponent
  },
  {
    path: 'woiss-entry',
    component: WoissEntryComponent
  },
  {
    path: 'affect-bom',
    component: AffectBomComponent
  },
]

  @NgModule({
    declarations: [
      ManufacturingComponent, 
      CreateOrderComponent, 
      LaunchOrderComponent, 
      CreateWorkCenterComponent, 
      CreateGammeComponent, 
      MoEntriesComponent,
      CreateNomenclatureComponent, 
      CreateCauseComponent, 
      WorctEntryComponent, 
      WoissEntryComponent, CreatePsComponent, ListWoComponent, EditWoComponent, CreateOpComponent, CreateRsnComponent, EditRsnComponent, ListRsnComponent, ListGammeComponent, EditGammeComponent, EditWorkCenterComponent, ListWorkCenterComponent, AffectBomComponent, CreateProdComponent
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
      BomService,
      ItemService,
      PsService,
      SiteService,
      WorkOrderService,
      WorkCenterService,
      WorkRoutingService,
      WoroutingService,
      SequenceService,
      SiteService,
      LocationService,
      MesureService,
      LocationDetailService,
      WorkOrderDetailService,
      CostSimulationService,
      AddressService,
      InventoryTransactionService,
      InventoryStatusService,
      OperationHistoryService,
      ReasonService,
      BomPartService,
  ],
  
    entryComponents: [
      ActionNotificationComponent,
      DeleteEntityDialogComponent,
      FetchEntityDialogComponent,
      UpdateStatusDialogComponent,

    ],  
  
})
export class ManufacturingModule { }
