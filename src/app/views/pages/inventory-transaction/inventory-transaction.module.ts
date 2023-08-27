import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryTransactionComponent } from './inventory-transaction.component';
import { TransferComponent } from './transfer/transfer.component';
import { UnplanifiedIssueComponent } from './unplanified-issue/unplanified-issue.component';

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
import { UnplanifiedReceptComponent } from './unplanified-recept/unplanified-recept.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { AccessoireService, GlassesService, LocationAccessoireService, LocationDetailService, LocationGlassesService, SequenceService }  from '../../../core/erp';
import { PoReceipComponent } from './po-receip/po-receip.component';
import {PurchaseOrderService, 
        AccountPayableService,
        TransferService,
        PurchaseReceiveService,
        InventoryTransactionService,
        DeviseService,
        ProviderService,
        CostSimulationService,
        SiteService,
        LocationService,
        InventoryStatusService,
        RequisitionService,
        MesureService,
        ItemService} from '../../../core/erp';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { EditStatusComponent } from './edit-status/edit-status.component';
import { AcsReceipComponent } from './acs-receip/acs-receip.component';
import { GlsReceipComponent } from './gls-receip/gls-receip.component';
import { InvglsListComponent } from './invgls-list/invgls-list.component';
import { InvacsListComponent } from './invacs-list/invacs-list.component';
import { ListZakatComponent } from './list-zakat/list-zakat.component';
import { CreateGlsInvComponent } from './create-gls-inv/create-gls-inv.component';
import { CreateAcsInvComponent } from './create-acs-inv/create-acs-inv.component';
import { CreateMnInvComponent } from './create-mn-inv/create-mn-inv.component';

const routes: Routes = [
  {
    path: 'transfer',
    component: TransferComponent
  },
  {
    path: 'unplanified-issue',
    component: UnplanifiedIssueComponent
  },
  {
    path: 'unplanified-recept',
    component: UnplanifiedReceptComponent
  },
  {
    path: 'inventory-list',
    component: InventoryListComponent
  },
  {
    path: 'transaction-list',
    component: TransactionListComponent
  },
  {
    path: 'po-receip',
    component: PoReceipComponent
  },
  {
    path: 'acs-receip',
    component: AcsReceipComponent
  },
  {
    path: 'gls-receip',
    component: GlsReceipComponent
  },
  {
    path: 'edit-status',
    component: EditStatusComponent
  },
  {
    path: 'invgls-list',
    component: InvglsListComponent
  },
  {
    path: 'invacs-list',
    component: InvacsListComponent
  },
  {
    path: 'list-zakat',
    component: ListZakatComponent
  },
  {
    path: 'create-mn-inv',
    component: CreateMnInvComponent
  },
  {
    path: 'create-acs-inv',
    component: CreateAcsInvComponent
  },
  {
    path: 'create-gls-inv',
    component: CreateGlsInvComponent
  },
] 



@NgModule({
  declarations: [InventoryTransactionComponent, TransferComponent, UnplanifiedIssueComponent, UnplanifiedReceptComponent, InventoryListComponent, PoReceipComponent, TransactionListComponent, EditStatusComponent, AcsReceipComponent, GlsReceipComponent, InvglsListComponent, InvacsListComponent, ListZakatComponent, CreateGlsInvComponent, CreateAcsInvComponent, CreateMnInvComponent],
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
  TransferService,
  TypesUtilsService,
  LayoutUtilsService,
  LocationDetailService,
  PurchaseOrderService,
  InventoryTransactionService,
  PurchaseReceiveService,
  DeviseService,
  ProviderService,
  CostSimulationService,
  ItemService,
  SiteService,
  LocationService,
  MesureService,
  SequenceService,
  AccountPayableService,
  LocationDetailService,
  LocationGlassesService,
  LocationAccessoireService,
  InventoryStatusService,
  AccessoireService,
  GlassesService,
  LocationAccessoireService,
  RequisitionService,
],
})
export class InventoryTransactionModule { }
