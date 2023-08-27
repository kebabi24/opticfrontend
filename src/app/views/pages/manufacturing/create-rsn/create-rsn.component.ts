import { Component, OnInit } from "@angular/core"
import {
    NgbDropdownConfig,
    NgbTabChangeEvent,
    NgbTabsetConfig,
    NgbModal,
} from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    FieldType, GridService
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

import { Reason, ReasonService} from "../../../../core/erp"

@Component({
  selector: 'kt-create-rsn',
  templateUrl: './create-rsn.component.html',
  styleUrls: ['./create-rsn.component.scss']
})
export class CreateRsnComponent implements OnInit {
  reason: Reason
  reasonForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  isExist = false
  error = false;
  msg: String;
  selectedField = ""
 
  fieldcode = "";


  constructor(
      config: NgbDropdownConfig,
      private reasonFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private reasonService: ReasonService
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
      this.reason = new Reason()
      this.reasonForm = this.reasonFB.group({
        rsn_type: [this.reason.rsn_type, Validators.required],
          rsn_ref: [this.reason.rsn_ref, Validators.required],
          rsn_desc: [{ value: this.reason.rsn_desc, disabled: !this.isExist },  Validators.required ],
         

      })
  }
  
  onChangeCode() {
      const controls = this.reasonForm.controls
      this.reasonService
          .getBy({
                rsn_type: controls.rsn_type.value,
                rsn_ref: controls.rsn_ref.value,
                

          })
          .subscribe((response: any) => {
            console.log(response.data)
              if (response.data.length) {
                  this.isExist = true
                  console.log(response.data.length)
              } else {
                  controls.rsn_desc.enable()
                  
              }
             
       })
     
    }


    
  //reste form
  reset() {
      this.reason = new Reason()
      this.createForm()
      this.hasFormErrors = false
  }
  // save data
  onSubmit() {
      this.hasFormErrors = false
      const controls = this.reasonForm.controls
      /** check form */
      if (this.reasonForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          return
      }

      // tslint:disable-next-line:prefer-const
      let reason = this.prepareReason()
      this.addReason(reason)
  }
  /**
   * Returns object for saving
   */
  prepareReason(): Reason {
      const controls = this.reasonForm.controls
      const _reason = new Reason()
      _reason.rsn_type = controls.rsn_type.value
      _reason.rsn_ref = controls.rsn_ref.value
      _reason.rsn_desc= controls.rsn_desc.value
      return _reason
  }
  /**
   * Add code
   *
   * @param _code: CodeModel
   */
  addReason(_reason: Reason) {
      this.loadingSubject.next(true)
      this.reasonService.add(_reason).subscribe(
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
              this.router.navigateByUrl("/")
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
