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
import { Devise, DeviseService } from "../../../../core/erp"

@Component({
  selector: 'kt-edit-devise',
  templateUrl: './edit-devise.component.html',
  styleUrls: ['./edit-devise.component.scss']
})
export class EditDeviseComponent implements OnInit {
  devise: Devise
  deviseForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  deviseEdit: any
  title: String = 'Modifier Devise - '

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
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.deviseService.getOne(id).subscribe((response: any)=>{
          this.deviseEdit = response.data
          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.deviseEdit.cu_curr
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
      
      this.deviseForm = this.deviseFB.group({
  
        cu_curr: [this.deviseEdit.cu_curr, Validators.required],
        cu_desc: [this.deviseEdit.cu_desc, Validators.required],
        cu_rnd_mthd: [this.deviseEdit.cu_rnd_mthd],
        cu_active: [this.deviseEdit.cu_active],
        cu_iso_curr: [this.deviseEdit.cu_iso_curr],
  
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
    let address = this.prepareDevise()
    this.addDevise(address)
  }
  /**
* Returns object for saving
*/

prepareDevise(): Devise {
  const controls = this.deviseForm.controls
  const _devise = new Devise()
  _devise.id = this.deviseEdit.id
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
* @param _site: SiteModel
*/
addDevise(_devise: Devise) {
  this.loadingSubject.next(true)
  this.deviseService.update(this.deviseEdit.id, _devise).subscribe(
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
          this.router.navigateByUrl("/devise/list-devise")
      }
  )
}

goBack() {
  this.loadingSubject.next(false)
  const url = `/`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}





}
