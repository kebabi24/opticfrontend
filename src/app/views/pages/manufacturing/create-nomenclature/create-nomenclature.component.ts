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

import { Bom, BomService } from "../../../../core/erp"

@Component({
  selector: 'kt-create-nomenclature',
  templateUrl: './create-nomenclature.component.html',
  styleUrls: ['./create-nomenclature.component.scss']
})
export class CreateNomenclatureComponent implements OnInit {

  bom: Bom
  bomForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  constructor(
      config: NgbDropdownConfig,
      private bomFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private bomService: BomService
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

  this.bom = new Bom()
  this.bomForm = this.bomFB.group({
      bom_parent: [this.bom.bom_parent, Validators.required],
      bom_desc: [
          { value: this.bom.bom_desc, disabled: !this.isExist },
         Validators.required,
      ],
      bom_batch: [{ value: this.bom.bom_batch, disabled: !this.isExist }],
      bom_batch_um: [{ value: this.bom.bom_batch_um, disabled: !this.isExist }],
      bom_formula: [{ value: this.bom.bom_formula, disabled: !this.isExist }],
      bom_rmks: [{ value: this.bom.bom_rmks, disabled: !this.isExist }],
  })
}

onChangeCode() {
  const controls = this.bomForm.controls
  this.bomService
      .getBy({
            bom_parent: controls.bom_parent.value,
      })
      .subscribe((response: any) => {
          console.log(response.data)
          if (response.data) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.bom_desc.enable()
              controls.bom_batch.enable()
              controls.bom_batch_um.enable()
              controls.bom_formula.enable()
              controls.bom_rmks.enable()

          }
   })
}
//reste form
reset() {
  this.bom = new Bom()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.bomForm.controls
  /** check form */
  if (this.bomForm.invalid) {
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
    prepareCode(): Bom {
      const controls = this.bomForm.controls
      const _bom = new Bom()
      _bom.bom_parent = controls.bom_parent.value
      _bom.bom_desc = controls.bom_desc.value
      _bom.bom_batch = controls.bom_batch.value
      _bom.bom_batch_um = controls.bom_batch_um.value
      _bom.bom_formula = controls.bom_formula.value
      _bom.bom_rmks = controls.bom_rmks.value
      return _bom
  }
/**
     * Add code
     *
     * @param _bom: DeviseModel
     */
    addCode(_bom: Bom) {
      this.loadingSubject.next(true)
      this.bomService.add(_bom).subscribe(
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
              this.router.navigateByUrl("/manufacturing/codes-list")
          }
      )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/manufacturing/codes-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }



}
