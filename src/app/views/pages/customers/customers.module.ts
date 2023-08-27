import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { CustomersComponent } from './customers.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

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
import { AngularSlickgridModule } from 'angular-slickgrid';

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

//Service 
import {AccountReceivableService,SaleOrderService, AddressService, CodeService, CustomerService, AccountService, TaxeService, SiteService, DeviseService, BankService, SequenceService } from '../../../core/erp';
import { CustomerSoldelistComponent } from './customer-soldelist/customer-soldelist.component';
import { CustomerCAlistComponent } from './customer-calist/customer-calist.component';
import { CustomerCAbyItemlistComponent } from './customer-caby-itemlist/customer-caby-itemlist.component';
import { CustomerActivitylistComponent } from './customer-activitylist/customer-activitylist.component'
const routes: Routes = [
  {
      path: "",
      component: CustomersComponent,
      // canActivate: [ModuleGuard],
      // data: { moduleName: 'ecommerce' },
      children: [
          {
              path: "customer-list",
              component: CustomerListComponent,
          },
          {
              path: "customer-create",
              component: CustomerCreateComponent,
          },
          {
              path: "edit/:id",
              component: CustomerEditComponent,
          },
          {
	          path: "caby-itemlist",
	          component: CustomerCAbyItemlistComponent,
          },
          {
	          path: "Customer-activitylist",
	          component: CustomerActivitylistComponent,
          },
          {
              path: "Customer-calist",
              component: CustomerCAlistComponent,
          },
          { 
              path: "Customer-soldelist",
              component: CustomerSoldelistComponent,
          },
      ],
  },
]

@NgModule({
    declarations: [
        CustomersComponent,
        CustomerListComponent,
        CustomerEditComponent,
        CustomerCreateComponent,
        CustomerSoldelistComponent,
        CustomerCAlistComponent,
        CustomerCAbyItemlistComponent,
        CustomerActivitylistComponent,
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
        AddressService,
        TaxeService,
        CodeService,
        DeviseService,
        SiteService,
        AccountService,
        CustomerService,
        BankService,
        SaleOrderService,
        SequenceService,
        AccountReceivableService,
    ],
    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
    ],
})

export class CustomersModule { }
