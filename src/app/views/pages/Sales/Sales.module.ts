import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { SalesComponent } from "./Sales.component"
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
import { AngularSlickgridModule } from "angular-slickgrid"
import { QuoteService, UsersService, ItemService, CodeService, TaxeService, SaleOrderService, ProductLineService,
         SaleShiperService,CustomerService,SequenceService, SiteService,LocationService, MesureService,
         LocationDetailService, InventoryTransactionService, DeviseService, InventoryStatusService,
         PricelistService,InvoiceOrderService,AccountShiperService, BankService, ProjectService, 
         ConfigService, PayMethService, InvoiceOrderTempService, GlassesService, AccessoireService, 
         LocationAccessoireService, LocationGlassesService, DoctorService, VisiteService,PenicheService,
         ProviderService, DailySalesService} from '../../../core/erp';
import { CreateQuoteComponent } from './create-quote/create-quote.component';
import { CreatesaleorderComponent } from './create-so/create-so.component';
import { CreatePshComponent } from './create-psh/create-psh.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { CreateDirectInvoiceComponent } from './create-direct-invoice/create-direct-invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { PaymentPshComponent } from './payment-psh/payment-psh.component';
import { UnblockSoComponent } from './unblock-so/unblock-so.component';
import { SoListComponent } from './so-list/so-list.component';
import { ConfirmSoComponent } from './confirm-so/confirm-so.component';
import { EditSoComponent } from './edit-so/edit-so.component';
import { CreateProjectInvoiceComponent } from './create-project-invoice/create-project-invoice.component';
import { InputInvoiceComponent } from './input-invoice/input-invoice.component';
import { CreateVisiteComponent } from './create-visite/create-visite.component';
import { CustomerCreateComponent } from '../customers/customer-create/customer-create.component';
import { LibPenComponent } from './lib-pen/lib-pen.component';
import { ListSoComponent } from './list-so/list-so.component';
import { PaymentSoComponent } from './payment-so/payment-so.component';
import { SopurchaseComponent } from './sopurchase/sopurchase.component';
import { UserComponent } from './user/user.component';
import { CustHistComponent } from './cust-hist/cust-hist.component';
import { ListSoUserComponent } from './list-so-user/list-so-user.component';
import { ListCaComponent } from './list-ca/list-ca.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { SalesGlsComponent } from './sales-gls/sales-gls.component';
import { UndoSoComponent } from './undo-so/undo-so.component';
//import { BrowserModule }    from '@angular/platform-browser';  

const routes: Routes = [
    {
        path: "",
        component: SalesComponent,
        // canActivate: [ModuleGuard],
        // data: { moduleName: 'ecommerce' },
        children: [
       
            {
                path: "create-quote",
                component: CreateQuoteComponent,
            },
            {
              path: "sopurchase",
              component: SopurchaseComponent,
            },
            {
              path: "user",
              component: UserComponent,
            },
            {
              path: "cust-hist",
              component: CustHistComponent,
            },
            {
              path: "lib-pen",
              component: LibPenComponent,
            },
            {
              path: "payment-so/:id",
              component: PaymentSoComponent,
            },
            {
                  path: "create-so",
                component: CreatesaleorderComponent,
            },
            {
              path: "create-visite",
              component: CreateVisiteComponent,
            },
            {
              path: "undo-so",
              component: UndoSoComponent,
            },
            {
                path: "so-list",
              component: SoListComponent,
            },
            {
              path: "list-so",
              component: ListSoComponent,
            },
            {
              path: "edit-so/:id",
              component: EditSoComponent,
            },
            {
                path: "unblock-so",
              component: UnblockSoComponent,
            },
            {
                path: "confirm-so",
              component: ConfirmSoComponent,
            },
            {
                path: "create-psh",
              component: CreatePshComponent,
            },
            {
                path: "payment-psh",
              component: PaymentPshComponent,
            },
        
            {
                path: "create-invoice",
              component: CreateInvoiceComponent,
            },

            {
                path: "create-direct-invoice",
              component: CreateDirectInvoiceComponent,
            },
            {
              path: "create-project-invoice",
              component: CreateProjectInvoiceComponent,
            },
          
            {
                path: "print-invoice",
              component: PrintInvoiceComponent,
            },
            {
              path: "input-invoice",
            component: InputInvoiceComponent,
            },
            {
              path: "list-so-user",
              component: ListSoUserComponent,
            },
            {
              path: "list-ca",
              component: ListCaComponent,
            },
            {
              path: "list-payment",
              component: ListPaymentComponent,
            }, 
            {
              path: "sales-gls",
              component: SalesGlsComponent,
            },
          
        ],
    },
]

@NgModule({
    declarations: [SalesComponent, CreateQuoteComponent, CreatesaleorderComponent, CreatesaleorderComponent, CreatePshComponent, 
      CreateInvoiceComponent, CreateDirectInvoiceComponent, PrintInvoiceComponent, PaymentPshComponent,
       UnblockSoComponent, SoListComponent, ConfirmSoComponent, EditSoComponent,
        CreateProjectInvoiceComponent, InputInvoiceComponent, CreateVisiteComponent, LibPenComponent, ListSoComponent, PaymentSoComponent, SopurchaseComponent, UserComponent, CustHistComponent, ListSoUserComponent, ListCaComponent, ListPaymentComponent, SalesGlsComponent, UndoSoComponent],
    imports: [
        CommonModule,
       
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
        //BrowserModule, 
// import HttpClientModule after BrowserModule. 
        HttpClientModule,  
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
        UsersService,
        TypesUtilsService,
        LayoutUtilsService,
        HttpUtilsService,
        TypesUtilsService,
        LayoutUtilsService,
        QuoteService,
        ItemService,
        CodeService,
        SequenceService,
        CustomerService,
        TaxeService,
        DeviseService,
        SaleOrderService,
        SaleShiperService,
        InventoryTransactionService,
        SiteService,
        LocationService,
        InventoryStatusService,
        LocationDetailService,
        AccountShiperService,
        MesureService,
        PricelistService,
        InvoiceOrderService,
        BankService,
        ProviderService,
        ConfigService,
        ProjectService,
        PayMethService,
        GlassesService,
        DoctorService,
        AccessoireService,
        LocationAccessoireService,
        LocationGlassesService,
        ProductLineService,
        InvoiceOrderTempService,
        VisiteService,
        PenicheService,
        DailySalesService
    ],

    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
    ],
})
export class SalesModule {}
