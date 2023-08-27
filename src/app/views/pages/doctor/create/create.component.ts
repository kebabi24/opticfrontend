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

import { Doctor, DoctorService } from "../../../../core/erp"
@Component({
  selector: 'kt-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  doctor: Doctor
  doctorForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  constructor(
      config: NgbDropdownConfig,
      private doctorFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private doctorService: DoctorService
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

  this.doctor = new Doctor()
  this.doctorForm = this.doctorFB.group({
      dr_addr: [this.doctor.dr_addr, Validators.required],
      dr_desc: [
          { value: this.doctor.dr_desc, disabled: !this.isExist },
          Validators.required,
      ],
      
      dr_active: [{ value: this.doctor.dr_active, disabled: !this.isExist }],
      dr_iso_curr: [{ value: this.doctor.dr_iso_curr, disabled: !this.isExist }],
  })
}

onChangeCode() {
  const controls = this.doctorForm.controls
  this.doctorService
      .getBy({
            dr_addr: controls.dr_addr.value,
      })
      .subscribe((response: any) => {
          console.log(response.data)
          if (response.data) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.dr_desc.enable()
              controls.dr_rnd_mthd.enable()
              controls.dr_active.enable()
              controls.dr_iso_curr.enable()
          }
   })
}
//reste form
reset() {
  this.doctor = new Doctor()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.doctorForm.controls
  /** check form */
  if (this.doctorForm.invalid) {
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
    prepareCode(): Doctor {
      const controls = this.doctorForm.controls
      const _doctor = new Doctor()
      _doctor.dr_addr = controls.dr_addr.value
      _doctor.dr_desc = controls.dr_desc.value
     // _doctor.dr_rnd_mthd = controls.dr_rnd_mthd.value
      _doctor.dr_active = controls.dr_active.value
      //_doctor.dr_iso_curr = controls.dr_iso_curr.value
      return _doctor
  }
/**
     * Add code
     *
     * @param _doctor: DoctorModel
     */
    addCode(_doctor: Doctor) {
      this.loadingSubject.next(true)
      this.doctorService.add(_doctor).subscribe(
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
              this.router.navigateByUrl("/doctor/list")
          }
      )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/doctor/list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }



}
