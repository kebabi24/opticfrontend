import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ArticlesComponent } from "./articles.component"
import { ListComponent } from "./list/list.component"
import { CreateComponent } from "./create/create.component"
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
import { EditComponent } from "./edit/edit.component"
import { AngularSlickgridModule } from 'angular-slickgrid';

import {CodeService,
         ItemService,
         SiteService, 
         SequenceService,
         LocationService, 
         ProviderService ,
         ProductLineService, 
         MesureService, 
         CostSimulationService, 
         InventoryStatusService,
         TaxeService,
         AccessoireService,
         GlassesService
        } from '../../../core/erp';
import { EditCostComponent } from './edit-cost/edit-cost.component';
import { CreateGlassesComponent } from './create-glasses/create-glasses.component';
import { EditGlassesComponent } from './edit-glasses/edit-glasses.component';
import { ListGlassesComponent } from './list-glasses/list-glasses.component';
import { CreateAcsComponent } from './create-acs/create-acs.component';
import { EditAcsComponent } from './edit-acs/edit-acs.component';
import { ListAcsComponent } from './list-acs/list-acs.component'


const routes: Routes = [
    {
        path: "",
        component: ArticlesComponent,
        // canActivate: [ModuleGuard],
        // data: { moduleName: 'ecommerce' },
        children: [
            {
                path: "list",
                component: ListComponent,
            },
            {
                path: "add",
                component: CreateComponent,
            },
            {
                path: "edit/:id",
                component: EditComponent,
            },
            {
                path: "edit-cost",
                component: EditCostComponent,
            },
            {
                path: "list-acs",
                component: ListAcsComponent,
            },
            {
                path: "create-acs",
                component: CreateAcsComponent,
            },
            {
                path: "edit-acs/:id",
                component: EditAcsComponent,
            },
            {
                path: "list-glasses",
                component: ListGlassesComponent,
            },
            {
                path: "create-glasses",
                component: CreateGlassesComponent,
            },
            {
                path: "edit-glasses/:id",
                component: EditGlassesComponent,
            },
            
            
        ],
    },
]

@NgModule({
    declarations: [
        ArticlesComponent,
        ListComponent,
        CreateComponent,
        EditComponent,
        EditCostComponent,
        CreateGlassesComponent,
        EditGlassesComponent,
        ListGlassesComponent,
        CreateAcsComponent,
        EditAcsComponent,
        ListAcsComponent,
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
        CodeService,
        SiteService,
        LocationService,
        ProductLineService,
        SequenceService,
        ProviderService,
        ItemService,
        MesureService,
        TaxeService,
        GlassesService,
        AccessoireService,
        InventoryStatusService,
        CostSimulationService
    ],

    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
    ],
})
export class ArticlesModule {}
