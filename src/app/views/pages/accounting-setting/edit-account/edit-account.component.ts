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
  selector: 'kt-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {

  account: Account
  accountForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  title: String = 'Modifier Code - '
  accountEdit: any

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
      this.loadingSubject.next(true)
      this.activatedRoute.params.subscribe((params) => {
          const id = params.id
          this.accountService.getOne(id).subscribe((response: any)=>{
            this.accountEdit = response.data
            this.initCode()
            this.loadingSubject.next(false)
            this.title = this.title + this.accountEdit.ac_code
          })
      })
  }
  // init code
  initCode() {
      this.createForm()
      this.loadingSubject.next(false)
  }
  //create form
  createForm() {
        this.account = new Account()
        this.accountForm = this.accountFB.group({
            ac_code: [{value: this.accountEdit.ac_code, disabled: true}, Validators.required],
            ac_desc: [this.accountEdit.ac_desc, Validators.required ],
            ac_type: [this.accountEdit.ac_type],
            ac_curr: [this.accountEdit.ac_curr],
            ac_stat_acc: [this.accountEdit.ac_stat_acc],
            ac_active: [this.accountEdit.ac_active],

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
    _account.id = this.accountEdit.id
    _account.ac_code = controls.ac_code.value
    _account.ac_desc = controls.ac_desc.value
    _account.ac_type = controls.ac_type.value
    _account.ac_curr = controls.ac_curr.value
    _account.ac_stat_acc = controls.ac_stat_acc.value
    _account.ac_active = controls.ac_active.value
    return _account
}
  /**
   * Add code
   *
   * @param _account: AccountModel
   */
  addCode(_account: Account) {
      this.loadingSubject.next(true)
      this.accountService.update(this.accountEdit.id, _account).subscribe(
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
                  "Modification avec succès",
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
      const url = `/code-mstr/codes-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
}
