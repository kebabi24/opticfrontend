import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InventoryManagementComponent } from "./inventory-management.component";
import { PhysicalInventoryTagComponent } from "./physical-inventory-tag/physical-inventory-tag.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
// Translate Module
import { TranslateModule } from "@ngx-translate/core";
// NGRX
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
// UI
import { PartialsModule } from "../../partials/partials.module";
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
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { environment } from "../../../../environments/environment";
import {
  NgbProgressbarModule,
  NgbProgressbarConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxPermissionsModule } from "ngx-permissions";
import { AngularSlickgridModule } from "angular-slickgrid";

import {
  SiteService,
  LocationService,
  CodeService,
  InventoryStatusService,
  ItemService,
  AccountService,
  EntityService,
  InventoryManagementService
} from "../../../core/erp";
import { PhysicalInventoryTagEntryComponent } from './physical-inventory-tag-entry/physical-inventory-tag-entry.component';
import { TagGapAnalysisComponent } from './tag-gap-analysis/tag-gap-analysis.component';
import { PhysicalInventoryTagReentryComponent } from './physical-inventory-tag-reentry/physical-inventory-tag-reentry.component';
import { FreezeInventoryComponent } from './freeze-inventory/freeze-inventory.component';
import { ValidateTagComponent } from './validate-tag/validate-tag.component';
import { InventoryOfDateComponent } from './inventory-of-date/inventory-of-date.component';
import { InventoryActivitylistComponent } from './inventory-activitylist/inventory-activitylist.component';
import { InventoryByLoclistComponent } from './inventory-by-loclist/inventory-by-loclist.component';
import { OutOFStocklistComponent } from './out-ofstocklist/out-ofstocklist.component';
import { InventoryByStatuslistComponent } from './inventory-by-statuslist/inventory-by-statuslist.component';

const routes: Routes = [
  {
    path: "physical-inventory-tag",
    component: PhysicalInventoryTagComponent,
  },
  {
    path: "freeze-inventory",
    component: FreezeInventoryComponent,
  },
  {
    path: "physical-inventory-tag-entry",
    component: PhysicalInventoryTagEntryComponent,
  },
  {
    path: "tag-gap-analysis",
    component: TagGapAnalysisComponent,
  },
  {
    path: "physical-inventory-tag-reentry",
    component: PhysicalInventoryTagReentryComponent,
  },
  {
    path: "validate-tag",
    component: ValidateTagComponent,
  },
  {
    path: "inventory-of-date",
    component: InventoryOfDateComponent,
  },
  {
    path: "inventory-activitylist",
    component: InventoryActivitylistComponent,
  },
  {
    path: "inventory-bystatuslist",
    component:  InventoryByStatuslistComponent,
  },
  {
    path: "inventory-byloclist",
    component: InventoryByLoclistComponent, 
  },
  {
    path: "out-of-stocklist",
    component: OutOFStocklistComponent,
  },
];

@NgModule({
  declarations: [InventoryManagementComponent, PhysicalInventoryTagComponent, PhysicalInventoryTagEntryComponent, TagGapAnalysisComponent, PhysicalInventoryTagReentryComponent, FreezeInventoryComponent, ValidateTagComponent, InventoryOfDateComponent, InventoryActivitylistComponent, InventoryByLoclistComponent, OutOFStocklistComponent, InventoryByStatuslistComponent],
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
    InventoryManagementService,
    ItemService,
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
  ],
})
export class InventoryManagementModule {}
