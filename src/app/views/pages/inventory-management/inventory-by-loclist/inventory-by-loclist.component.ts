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

import { InventoryManagementService, printInventoryByLoc } from "../../../../core/erp"
@Component({
  selector: 'kt-inventory-by-loclist',
  templateUrl: './inventory-by-loclist.component.html',
  styleUrls: ['./inventory-by-loclist.component.scss']
})
export class InventoryByLoclistComponent implements OnInit {

  tagForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  part1: String;
  part2: String;
  
  loc1: String;
  loc2: String;
  
  constructor(
      config: NgbDropdownConfig,
      private tagFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private inventoryManagementService: InventoryManagementService
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

  this.tagForm = this.tagFB.group({
     pt_part_1:[''],
     pt_part_2:[''],
  
     ld_loc_1:[''],
     ld_loc_2:['']
    
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
 this.getReport(object)
}
/**
* Returns object for saving
*/
prepare(): any {
  const controls = this.tagForm.controls
  if (controls.pt_part_1.value == null || controls.pt_part_1.value == "" ) { this.part1 = "0" } else {this.part1 = controls.pt_part_1.value}
  if (controls.pt_part_2.value == null || controls.pt_part_2.value == "" ) { this.part2 = "ZZZZZZZZZZZZZ" } else {this.part2 = controls.pt_part_2.value}

  if (controls.ld_loc_1.value == null || controls.ld_loc_1.value == "") { this.loc1 = "0" } else {this.loc1 = controls.ld_loc_1.value}
  if (controls.ld_loc_2.value == null || controls.ld_loc_2.value == "") { this.loc2 = "ZZZZZZZZZZZZZ" } else {this.loc2 = controls.ld_loc_2.value}

  
  const obj = {
    pt_part_1: this.part1,
    pt_part_2: this.part2,
  
    ld_loc_1: this.loc1,
    ld_loc_2: this.loc2,
    

  }
  
console.log(obj)
  return obj
}
/**
* Add code
*
* @param _code: CodeModel
*/
getReport(obj:any) {
  let res
  this.loadingSubject.next(true)
  this.inventoryManagementService.inventoryByLoc(obj).subscribe(
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
              "succès",
              MessageType.Create,
              10000,
              true,
              true
          )
          this.loadingSubject.next(false)
          printInventoryByLoc(res)
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
