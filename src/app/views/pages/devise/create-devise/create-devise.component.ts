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

import { Devise, DeviseService } from "../../../../core/erp"


@Component({
  selector: 'kt-create-devise',
  templateUrl: './create-devise.component.html',
  styleUrls: ['./create-devise.component.scss']
})
export class CreateDeviseComponent implements OnInit {
  devise: Devise
  deviseForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  constructor(
      config: NgbDropdownConfig,
      private deviseFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private deviseService: DeviseService
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

  this.devise = new Devise()
  this.deviseForm = this.deviseFB.group({
      cu_curr: [this.devise.cu_curr, Validators.required],
      cu_desc: [
          { value: this.devise.cu_desc, disabled: !this.isExist },
          Validators.required,
      ],
      cu_rnd_mthd: [{ value: this.devise.cu_rnd_mthd, disabled: !this.isExist }],
      cu_active: [{ value: this.devise.cu_active, disabled: !this.isExist }],
      cu_iso_curr: [{ value: this.devise.cu_iso_curr, disabled: !this.isExist }],
  })
}

onChangeCode() {
  const controls = this.deviseForm.controls
  this.deviseService
      .getBy({
            cu_curr: controls.cu_curr.value,
      })
      .subscribe((response: any) => {
          console.log(response.data)
          if (response.data) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.cu_desc.enable()
              controls.cu_rnd_mthd.enable()
              controls.cu_active.enable()
              controls.cu_iso_curr.enable()
          }
   })
}
//reste form
reset() {
  this.devise = new Devise()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.deviseForm.controls
  /** check form */
  if (this.deviseForm.invalid) {
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
    prepareCode(): Devise {
      const controls = this.deviseForm.controls
      const _devise = new Devise()
      _devise.cu_curr = controls.cu_curr.value
      _devise.cu_desc = controls.cu_desc.value
      _devise.cu_rnd_mthd = controls.cu_rnd_mthd.value
      _devise.cu_active = controls.cu_active.value
      _devise.cu_iso_curr = controls.cu_iso_curr.value
      return _devise
  }
/**
     * Add code
     *
     * @param _devise: DeviseModel
     */
    addCode(_devise: Devise) {
      this.loadingSubject.next(true)
      this.deviseService.add(_devise).subscribe(
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
              this.router.navigateByUrl("/devise/list-devise")
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
