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

import { InventoryManagementService, printTag } from "../../../../core/erp"
@Component({
  selector: 'kt-physical-inventory-tag',
  templateUrl: './physical-inventory-tag.component.html',
  styleUrls: ['./physical-inventory-tag.component.scss']
})
export class PhysicalInventoryTagComponent implements OnInit {

  tagForm: FormGroup
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

      this.tagForm = this.tagFB.group({
         pt_part_1:[''],
         pt_part_2:[''],
         pt_prod_line_1:[''],
         pt_prod_line_2:[''],
         pt_type_1:[''],
         pt_type_2:[''],
         pt_site_1:[''],
         pt_site_2:[''],
         pt_loc_1:[''],
         pt_loc_2:[''],
         pt_abc_1:[''],
         pt_abc_2:[''],

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
      this.createPhysicalInventoryTag(object)
  }
  /**
   * Returns object for saving
   */
  prepare(): any {
      const controls = this.tagForm.controls
      if (controls.pt_part_1.value == null || controls.pt_part_1.value == "" ) { this.part1 = "0" } else {this.part1 = controls.pt_part_1.value}
      if (controls.pt_part_2.value == null || controls.pt_part_2.value == "" ) { this.part2 = "ZZZZZZZZZZZZZ" } else {this.part2 = controls.pt_part_2.value}
 
      if (controls.pt_prod_line_1.value == null || controls.pt_prod_line_1.value == "") { this.prod1 = "0" } else {this.prod1 = controls.pt_prod_line_1.value}
      if (controls.pt_prod_line_2.value == null || controls.pt_prod_line_2.value == "" ) { this.prod2 = "ZZZZZZZZZZZZZ" } else {this.prod2 = controls.pt_prod_line_2.value}
 
      if (controls.pt_type_1.value == null || controls.pt_type_1.value == "") { this.type1 = "0" } else {this.type1 = controls.pt_type_1.value}
      if (controls.pt_type_2.value == null || controls.pt_type_2.value == "") { this.type2 = "ZZZZZZZZZZZZZ" } else {this.type2 = controls.pt_type_2.value}

      if (controls.pt_site_1.value == null || controls.pt_site_1.value == "") { this.site1 = "0" } else {this.site1 = controls.pt_site_1.value}
      if (controls.pt_site_2.value == null || controls.pt_site_2.value == "") { this.site2 = "ZZZZZZZZZZZZZ" } else {this.site2 = controls.pt_site_2.value}
 
      if (controls.pt_loc_1.value == null || controls.pt_loc_1.value == "") { this.loc1 = "0" } else {this.loc1 = controls.pt_loc_1.value}
      if (controls.pt_loc_2.value == null || controls.pt_loc_2.value == "") { this.loc2 = "ZZZZZZZZZZZZZ" } else {this.loc2 = controls.pt_loc_2.value}
 
      if (controls.pt_abc_1.value == null || controls.pt_abc_1.value == "" ) { this.abc1 = "a" } else {this.abc1 = controls.pt_abc_1.value}
      if (controls.pt_abc_2.value == null || controls.pt_abc_2.value == "") { this.abc2 = "C" } else {this.abc2 = controls.pt_abc_2.value}
 
      
      const obj = {
        pt_part_1: this.part1,
        pt_part_2: this.part2,
        pt_prod_line_1: this.prod1,
        pt_prod_line_2: this.prod2,
        pt_type_1: this.type1,
        pt_type_2: this.type2,
        pt_site_1: this.site1,
        pt_site_2: this.site2,
        pt_loc_1: this.loc1,
        pt_loc_2: this.loc2,
        pt_abc_1: this.abc1,
        pt_abc_2: this.abc2,

      }
      
console.log(obj)
      return obj
  }
  /**
   * Add code
   *
   * @param _code: CodeModel
   */
  createPhysicalInventoryTag(obj:any) {
      let res
      this.loadingSubject.next(true)
      this.inventoryManagementService.createPhysicalInventoryTag(obj).subscribe(
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
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              printTag(res)
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
