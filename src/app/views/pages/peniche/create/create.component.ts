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
  selector: 'kt-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  peniche: Peniche
    penicheForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    isExist = false

        selectedField = ""

    
    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    error = false;

    constructor(
        config: NgbDropdownConfig,
        private penicheFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private penicheService: PenicheService,
       
        private modalService: NgbModal,
        ) {
        config.autoClose = true
        this.reset()
      }

    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.reset()
        this.createForm()
    }
    //create form
    createForm() {
        this.loadingSubject.next(false)
        this.peniche = new Peniche()
        this.penicheForm = this.penicheFB.group({
           
            pen_pen: [this.peniche.pen_pen, Validators.required],
            pen_desc: [{ value: this.peniche.pen_desc, disabled: !this.isExist },  Validators.required ],
              })
    }

    onChangeCode() {
        const controls = this.penicheForm.controls
        this.penicheService
            .getBy({
                
                  pen_pen: controls.pen_pen.value,

            })
            .subscribe((response: any) => {
                if (response.data.length) {
                    this.isExist = true
                    console.log(response.data.length)
                } else {
                    controls.pen_desc.enable()
                   
                }
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
        const controls = this.penicheForm.controls
        /** check form */
        if (this.penicheForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let peniche = this.prepatePeniche()
        this.addPeniche(peniche)
    }
    /**
     * Returns object for saving
     */
    prepatePeniche(): Peniche {
        const controls = this.penicheForm.controls
        const _peniche = new Peniche()
         _peniche.pen_pen = controls.pen_pen.value
        _peniche.pen_desc = controls.pen_desc.value
       
        return _peniche
    }
    /**
     * Add code
     *
     * @param _code: PenicheModel
     */
    addPeniche(_peniche: Peniche) {
        this.loadingSubject.next(true)
        this.penicheService.add(_peniche).subscribe(
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
                this.reset()
                this.router.navigateByUrl("/peniche/create")
                this.reset()
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

