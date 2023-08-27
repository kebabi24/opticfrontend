import { Component, OnInit } from "@angular/core"
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap"
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
import { Reason, ReasonService } from "../../../../core/erp"
@Component({
  selector: 'kt-edit-rsn',
  templateUrl: './edit-rsn.component.html',
  styleUrls: ['./edit-rsn.component.scss']
})
export class EditRsnComponent implements OnInit {

  reason: Reason
  reasonForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  reasonEdit: any
  title: String = 'Modifier Code Cause - '

  constructor(
      config: NgbDropdownConfig,
      private reasonFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private reasonService: ReasonService
  ) {
      config.autoClose = true
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.reasonService.getOne(id).subscribe((response: any)=>{
          this.reasonEdit = response.data
          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.reasonEdit.rsn_ref
        })
    })
  }

  // init code
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
    createForm() {
      this.loadingSubject.next(false)
      
      this.reasonForm = this.reasonFB.group({
  
        rsn_ref: [{ value: this.reasonEdit.rsn_ref , disabled: true} ],
        rsn_type: [this.reasonEdit.rsn_type, Validators.required],
       
        rsn_desc: [this.reasonEdit.rsn_desc, Validators.required],
       
       
  
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
  _reason.id = this.reasonEdit.id
  _reason.rsn_ref = controls.rsn_ref.value
  _reason.rsn_desc = controls.rsn_desc.value
  _reason.rsn_type = controls.rsn_type.value


  return _reason
}
/**
* Add code
*
* @param _site: SiteModel
*/
addReason(_reason: Reason) {
  this.loadingSubject.next(true)
  this.reasonService.update(this.reasonEdit.id, _reason).subscribe(
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
          this.router.navigateByUrl("/manufacturing/list-rsn")
      }
  )
}

goBack() {
  this.loadingSubject.next(false)
  const url = `/`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}





}
