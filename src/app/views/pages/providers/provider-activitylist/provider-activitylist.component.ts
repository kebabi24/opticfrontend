import { Component, OnInit } from '@angular/core';
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

import { ProviderService, PurchaseOrderService, printProviderActivity } from "../../../../core/erp"
@Component({
  selector: 'kt-provider-activitylist',
  templateUrl: './provider-activitylist.component.html',
  styleUrls: ['./provider-activitylist.component.scss']
})
export class ProviderActivitylistComponent implements OnInit {
  tagForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  part1: String;
  part2: String;
  provider1: String;
  provider2: String;
  
  
  constructor(config: NgbDropdownConfig,
      private tagFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private purcahseorderService: PurchaseOrderService) { config.autoClose = true}

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
      this.createForm()
}
//create form
createForm() {
  this.loadingSubject.next(false)

  this.tagForm = this.tagFB.group({
     pt_part_1:[''],
     pt_part_2:[''],
     vd_addr_1:[''],
     vd_addr_2:[''],
     date_1:[''],
     date_2:[''],
  })
}

//reste form
reset() {
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.tagForm.controls
  /** check form */
  if (this.tagForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let object = this.prepare()
  this.getbyall(object)
}
/**
* Returns object for saving
*/
prepare(): any {
  const controls = this.tagForm.controls
  if (controls.pt_part_1.value == null || controls.pt_part_1.value == "" ) { this.part1 = "0" } else {this.part1 = controls.pt_part_1.value}
  if (controls.pt_part_2.value == null || controls.pt_part_2.value == "" ) { this.part2 = "ZZZZZZZZZZZZZ" } else {this.part2 = controls.pt_part_2.value}

  if (controls.vd_addr_1.value == null || controls.vd_addr_1.value == "") { this.provider1 = "0" } else {this.provider1 = controls.vd_addr_1.value}
  if (controls.vd_addr_2.value == null || controls.vd_addr_2.value == "" ) { this.provider2 = "ZZZZZZZZZZZZZ" } else {this.provider2 = controls.vd_addr_2.value}

  
  const obj = {
    pt_part_1: this.part1,
    pt_part_2: this.part2,
    vd_addr_1: this.provider1,
    vd_addr_2: this.provider2,

    date_1: controls.date_1.value
    ? `${controls.date_1.value.year}-${controls.date_1.value.month}-${controls.date_1.value.day}`
    : null,
    date_2: controls.date_2.value
    ? `${controls.date_2.value.year}-${controls.date_2.value.month}-${controls.date_2.value.day}`
    : null


    
  }
  
console.log(obj)
  return obj
}
/**
* Add code
*
* @param _code: CodeModel
*/
getbyall(obj:any) {
  let res
  this.loadingSubject.next(true)
  this.purcahseorderService.getProviderActivity(obj).subscribe(
      (reponse:any) => res = reponse.data,
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
              "Ajout avec succ�s",
              MessageType.Create,
              10000,
              true,
              true
          )
          this.loadingSubject.next(false)
          console.log(res)
          printProviderActivity(res)
          const url = `/`
          this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })

      }
  )
}

/**
* Go back to the list
*
*/
goBack() {
  this.loadingSubject.next(false)
  const url = `/`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}


}
