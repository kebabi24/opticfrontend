import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AccountingSettingComponent } from "./accounting-setting.component"
import { AccountListComponent } from "./account-list/account-list.component"
import { AgregatComponent } from "./agregat/agregat.component"
import { CostCenterComponent } from "./cost-center/cost-center.component"
import { CreateAccountComponent } from "./create-account/create-account.component"
import { CreateDepartComponent } from "./create-depart/create-depart.component"
import { CreateEmployeeComponent } from "./create-employee/create-employee.component"
import { CreateEntityComponent } from "./create-entity/create-entity.component"
import { CreateTaxComponent } from "./create-tax/create-tax.component"
import { JournalComponent } from "./journal/journal.component"
import { JournalDefautComponent } from "./journal-defaut/journal-defaut.component"
import { ProductLigneComponent } from "./product-ligne/product-ligne.component"
import { SubAccountComponent } from "./sub-account/sub-account.component"

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
import {AccountService, SubaccountService, CostcenterService, BankService, ProductLineService,DaybookService, EmployeService, JobService,
        SiteService,AffectEmpService, ProviderService,ProjectService,TaskService, PayMethService} from '../../../core/erp';
import {TaxeService} from '../../../core/erp';
import {CodeService} from '../../../core/erp';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { TaxesListComponent } from './taxes-list/taxes-list.component';
import { EditTaxComponent } from './edit-tax/edit-tax.component'
import {EntityService} from '../../../core/erp';
import {DeviseService} from '../../../core/erp';
import {AccountdefaultService} from '../../../core/erp';
import { EntityListComponent } from './entity-list/entity-list.component';
import { EditEntityComponent } from './edit-entity/edit-entity.component';
import { CreateBankComponent } from './create-bank/create-bank.component';

import { EditBankComponent } from './edit-bank/edit-bank.component';
import { ListBankComponent } from './list-bank/list-bank.component';
import { EditJournalComponent } from './edit-journal/edit-journal.component';
import { ListJournalComponent } from './list-journal/list-journal.component';
import { CreateEmpAvailComponent } from './create-emp-avail/create-emp-avail.component';
import { ListEmployeComponent } from './list-employe/list-employe.component';
import { EditEmployeComponent } from './edit-employe/edit-employe.component';
import { AffectEmpComponent } from './affect-emp/affect-emp.component';
import { CreatePayMethComponent } from './create-pay-meth/create-pay-meth.component';
import { ListPayMethComponent } from './list-pay-meth/list-pay-meth.component';
import { ListSubaccountComponent } from './list-subaccount/list-subaccount.component';
import { EditSubaccountComponent } from './edit-subaccount/edit-subaccount.component';
import { ListCcComponent } from './list-cc/list-cc.component';
import { EditCcComponent } from './edit-cc/edit-cc.component';
const routes: Routes = [
    {
        path: "create-account",
        component: CreateAccountComponent,
    },
    {
        path: "account-list",
        component: AccountListComponent,
    },
    {
        path: "list-cc",
        component: ListCcComponent,
    },
    {
        path: "edit-cc/:id",
        component: EditCcComponent,
    },
    {
        path: "list-subaccount",
        component: ListSubaccountComponent,
    },
    {
        path: "edit-account/:id",
        component: EditAccountComponent,
    },
    {
        path: "sub-account",
        component: SubAccountComponent,
    },
    {
        path: "edit-subaccount/:id",
        component: EditSubaccountComponent,
    },
    {
        path: "cost-center",
        component: CostCenterComponent,
    },
    {
        path: "agregat",
        component: AgregatComponent,
    },
    {
        path: "journal",
        component: JournalComponent,
    },
    {
        path: "list-journal",
        component: ListJournalComponent,
    },
    {
        path: "edit-journal/:id",
        component: EditJournalComponent,
    },
    
    {
        path: "product-ligne",
        component: ProductLigneComponent,
    },
    {
        path: "create-tax",
        component: CreateTaxComponent,
    },
    {
        path: "taxes-list",
        component: TaxesListComponent,
    },
    {
        path: "edit-tax/:id",
        component: EditTaxComponent,
    },
    {
        path: "create-depart",
        component: CreateDepartComponent,
    },
    {
        path: "create-entity",
        component: CreateEntityComponent,
    },
    {
        path: "entity-list",
        component: EntityListComponent,
    },
    {
        path: "edit-entity/:id",
        component: EditEntityComponent,
    },
    {
        path: "create-employee",
        component: CreateEmployeeComponent,
    },
    {
        path: "create-emp-avail",
        component: CreateEmpAvailComponent,
    },
    {
        path: "create-bank",
        component: CreateBankComponent,
    },
    {
        path: "bank-list",
        component: ListBankComponent,
    },
    {
        path: "edit-bank/:id",
        component: EditBankComponent,
    },
    {
        path: "list-employe",
        component: ListEmployeComponent,
    },
    {
        path: "edit-employe/:id",
        component: EditEmployeComponent,
    },
    {
        path: "affect-emp",
        component: AffectEmpComponent,
    },
    {
        path: "create-pay-meth",
        component: CreatePayMethComponent,
    },
    {
        path: "list-pay-meth",
        component: ListPayMethComponent,
    },
]

@NgModule({
    declarations: [
        AccountingSettingComponent,
        AccountListComponent,
        AgregatComponent,
        CostCenterComponent,
        CreateAccountComponent,
        CreateDepartComponent,
        CreateEmployeeComponent,
        CreateEntityComponent,
        CreateTaxComponent,
        JournalComponent,
        JournalDefautComponent,
        ProductLigneComponent,
        SubAccountComponent,
        EditAccountComponent,
        TaxesListComponent,
        EditTaxComponent,
        EntityListComponent,
        EditEntityComponent,
        CreateBankComponent,
        EditBankComponent,
        ListBankComponent,
        EditJournalComponent,
        ListJournalComponent,
        CreateEmpAvailComponent,
        ListEmployeComponent,
        EditEmployeComponent,
        AffectEmpComponent,
        CreatePayMethComponent,
        ListPayMethComponent,
        ListSubaccountComponent,
        EditSubaccountComponent,
        ListCcComponent,
        EditCcComponent,
       
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
        AccountService,
        TaxeService,
        CodeService,
        EntityService,
        AccountdefaultService,
        DeviseService,
        BankService,
        EmployeService,
        DaybookService,
        JobService,
        SiteService,
        ProjectService,
        TaskService,
        SubaccountService,
        ProviderService,
        CostcenterService,
        AffectEmpService,
        PayMethService,
        TypesUtilsService,
        ProductLineService,
        LayoutUtilsService,
    ],
    entryComponents: [
        ActionNotificationComponent,
        DeleteEntityDialogComponent,
        FetchEntityDialogComponent,
        UpdateStatusDialogComponent,
    ],
    })
export class AccountingSettingModule {}
