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
import { CustomerService, SaleOrderService, printCustomerCAList } from "../../../../core/erp"
@Component({
  selector: 'kt-customer-calist',
  templateUrl: './customer-calist.component.html',
  styleUrls: ['./customer-calist.component.scss']
})
export class CustomerCAlistComponent implements OnInit {

  tagForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  class1: String;
  class2: String;
  customer1: String;
  customer2: String;
  
  
  constructor(config: NgbDropdownConfig,
      private tagFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private saleorderService: SaleOrderService) { config.autoClose = true}

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
      this.createForm()

}



createForm() {
  this.loadingSubject.next(false)

  this.tagForm = this.tagFB.group({
     cm_class_1:[''],
     cm_class_2:[''],
     cm_addr_1:[''],
     cm_addr_2:[''],
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
    if (controls.cm_class_1.value == null || controls.cm_class_1.value == "" ) { this.class1 = "0" } else {this.class1 = controls.cm_class_1.value}
    if (controls.cm_class_2.value == null || controls.cm_class_2.value == "" ) { this.class2 = "ZZZZZZZZZZZZZ" } else {this.class2 = controls.cm_class_2.value}

    if (controls.cm_addr_1.value == null || controls.cm_addr_1.value == "") { this.customer1 = "0" } else {this.customer1 = controls.cm_addr_1.value}
    if (controls.cm_addr_2.value == null || controls.cm_addr_2.value == "" ) { this.customer2 = "ZZZZZZZZZZZZZ" } else {this.customer2 = controls.cm_addr_2.value}

    
    const obj = {
      cm_class_1: this.class1,
      cm_class_2: this.class2,
      cm_addr_1: this.customer1,
      cm_addr_2: this.customer2,
  
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
    this.saleorderService.getCustomerCA(obj).subscribe(
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
            printCustomerCAList(res)
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