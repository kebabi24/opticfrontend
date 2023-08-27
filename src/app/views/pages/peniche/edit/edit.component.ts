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

import { Peniche, PenicheService } from "../../../../core/erp"
@Component({
  selector: 'kt-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  peniche: Peniche
  penForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  penicheEdit: any
  title: String = 'Modifier Peniche - '

  data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""
   
    fieldcode = "";
    error = false;

   


  constructor(
      config: NgbDropdownConfig,
      private penFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
     
      private modalService: NgbModal, 
      private layoutUtilsService: LayoutUtilsService,
      private penicheService: PenicheService
  ) {
      config.autoClose = true
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.penicheService.getOne(id).subscribe((response: any)=>{
          console.log(response.data)
          this.penicheEdit = response.data
          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.penicheEdit.pen_pen
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
    
    this.penForm = this.penFB.group({

      pen_pen: [{value: this.penicheEdit.pen_pen, disable:true}],
      pen_desc: [this.penicheEdit.pen_desc,  Validators.required ],
   

    })
  }
    
  //reste form
 reset() {
  this.peniche = new Peniche()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.penForm.controls
  /** check form */
  if (this.penForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let address = this.preparePeniche()
  this.addPeniche(address)
}
/**
* Returns object for saving
*/

preparePeniche(): Peniche {
  const controls = this.penForm.controls
  const _peniche = new Peniche()
  _peniche.id = this.penicheEdit.id
  _peniche.pen_pen = controls.pen_pen.value
        _peniche.pen_desc= controls.pen_desc.value
        return _peniche
}
/**
* Add code
*
* @param _peniche: PenicheModel
*/
addPeniche(_peniche: Peniche) {
  this.loadingSubject.next(true)
  this.penicheService.update(this.penicheEdit.id, _peniche).subscribe(
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
          this.router.navigateByUrl("/inventory-settings/list-loc")
      }
  )
}

goBack() {
  this.loadingSubject.next(false)
  const url = `/`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}


}
