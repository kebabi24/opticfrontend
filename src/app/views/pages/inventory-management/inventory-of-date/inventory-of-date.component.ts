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

import { InventoryManagementService, printInventory } from "../../../../core/erp"

@Component({
  selector: 'kt-inventory-of-date',
  templateUrl: './inventory-of-date.component.html',
  styleUrls: ['./inventory-of-date.component.scss']
})
export class InventoryOfDateComponent implements OnInit {

  mForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  part1: String;
  part2: String;
  prod1: String;
  prod2: String;
  type1: String;
  type2: String;
  site1: String;
  site2: String;
  loc1: String;
  loc2: String;
  abc1: String;
  abc2: String;

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

      this.mForm = this.tagFB.group({
         pt_part_1:[''],
         pt_part_2:[''],
      
         pt_site_1:[''],
         pt_site_2:[''],
         pt_loc_1:[''],
         pt_loc_2:[''],
        date:['']

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
      const controls = this.mForm.controls
      /** check form */
      if (this.mForm.invalid) {
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
      const controls = this.mForm.controls
      if (controls.pt_part_1.value == null || controls.pt_part_1.value == "" ) { this.part1 = "0" } else {this.part1 = controls.pt_part_1.value}
      if (controls.pt_part_2.value == null || controls.pt_part_2.value == "" ) { this.part2 = "ZZZZZZZZZZZZZ" } else {this.part2 = controls.pt_part_2.value}
 
      if (controls.pt_site_1.value == null || controls.pt_site_1.value == "") { this.site1 = "0" } else {this.site1 = controls.pt_site_1.value}
      if (controls.pt_site_2.value == null || controls.pt_site_2.value == "") { this.site2 = "ZZZZZZZZZZZZZ" } else {this.site2 = controls.pt_site_2.value}
 
      if (controls.pt_loc_1.value == null || controls.pt_loc_1.value == "") { this.loc1 = "0" } else {this.loc1 = controls.pt_loc_1.value}
      if (controls.pt_loc_2.value == null || controls.pt_loc_2.value == "") { this.loc2 = "ZZZZZZZZZZZZZ" } else {this.loc2 = controls.pt_loc_2.value}
 
      
      const obj = {
        pt_part_1: this.part1,
        pt_part_2: this.part2,
        pt_site_1: this.site1,
        pt_site_2: this.site2,
        pt_loc_1: this.loc1,
        pt_loc_2: this.loc2,
        date: controls.date.value
        ? `${controls.date.value.year}-${controls.date.value.month}-${controls.date.value.day}`
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
  getReport(obj:any) {
      let res
      this.loadingSubject.next(true)
      this.inventoryManagementService.inventoryOfDate(obj).subscribe(
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
              printInventory(res, obj.date )
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
