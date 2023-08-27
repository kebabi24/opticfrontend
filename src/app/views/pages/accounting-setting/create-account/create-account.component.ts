// Angular
import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"

import { Account, AccountService } from "../../../../core/erp"

@Component({
    selector: "kt-create-account",
    templateUrl: "./create-account.component.html",
    styleUrls: ["./create-account.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class CreateAccountComponent implements OnInit {
    account: Account
    accountForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>

   
        constructor(
            config: NgbDropdownConfig,
            private accountFB: FormBuilder,
            private activatedRoute: ActivatedRoute,
            private router: Router,
            public dialog: MatDialog,
            private layoutUtilsService: LayoutUtilsService,
            private accountService: AccountService
        ) {
            config.autoClose = true
        }

        ngOnInit(): void {
            this.loading$ = this.loadingSubject.asObservable()
            this.loadingSubject.next(false)
            this.createForm()
        }
        //create form
        createForm() {
            this.loadingSubject.next(false)
        
            this.account = new Account()
            this.accountForm = this.accountFB.group({
                ac_code: [this.account.ac_code, Validators.required],
                ac_desc: [
                    { value: this.account.ac_desc, disabled: !this.isExist },
                    Validators.required,
                ],
                ac_type: [{ value: this.account.ac_type, disabled: !this.isExist }],
                ac_curr: [{ value: this.account.ac_curr, disabled: !this.isExist }],
                ac_stat_acc: [{ value: this.account.ac_stat_acc, disabled: !this.isExist }],
                ac_active: [{ value: this.account.ac_active, disabled: !this.isExist }],
                
            })
        }
        
        onChangeCode() {
            const controls = this.accountForm.controls
            this.accountService
                .getBy({
                      ac_code: controls.ac_code.value,
                })
                .subscribe((response: any) => {
                    console.log(response.data)
                    if (response.data) {
                        this.isExist = true
                        console.log(response.data.length)
                    } else {
                        controls.ac_desc.enable()
                        controls.ac_type.enable()
                        controls.ac_curr.enable()
                        controls.ac_stat_acc.enable()
                        controls.ac_active.enable()
                    }
             })
        }

        //reste form
        reset() {
            this.account = new Account()
            this.createForm()
            this.hasFormErrors = false
        }
        // save data
        onSubmit() {
            this.hasFormErrors = false
            const controls = this.accountForm.controls
            /** check form */
            if (this.accountForm.invalid) {
                Object.keys(controls).forEach((controlName) =>
                    controls[controlName].markAsTouched()
                )
        
                this.hasFormErrors = true
                return
            }
        
            // tslint:disable-next-line:prefer-const
            let address = this.prepareCode()
            this.addCode(address)
        }
        
            /**
         * Returns object for saving
         */
        prepareCode(): Account {
            const controls = this.accountForm.controls
            const _account = new Account()
            _account.ac_code = controls.ac_code.value
            _account.ac_desc = controls.ac_desc.value
            _account.ac_type = controls.ac_type.value
            _account.ac_curr = controls.ac_curr.value
            _account.ac_stat_acc = controls.ac_stat_acc.value
            _account.ac_active = controls.ac_active.value
            return _account
        }
    /**
/**
     * Add Account
     *
     * @param _account: AccountModel
     */
    addCode(_account: Account) {
        this.loadingSubject.next(true)
        this.accountService.add(_account).subscribe(
            (reponse) => console.log("response", Response),
            (error) => {
                this.layoutUtilsService.showActionNotification(
                    "Erreur verifier les informations",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
            },
            () => {
                this.layoutUtilsService.showActionNotification(
                    "Ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                this.router.navigateByUrl("/accounting-setting/account-list")
            }
        )
    }
  
  
   /**
       * Go back to the list
       *
       */
      goBack() {
        this.loadingSubject.next(false)
        const url = `/accounting-setting/account-list`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
  
  
  
  }
  