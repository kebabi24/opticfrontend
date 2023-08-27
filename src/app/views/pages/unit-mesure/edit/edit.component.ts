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

import { Mesure, MesureService } from "../../../../core/erp"

@Component({
    selector: "kt-edit",
    templateUrl: "./edit.component.html",
    styleUrls: ["./edit.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class EditComponent implements OnInit {
    mesure: Mesure
    mesureForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    title: String = 'Modifier Unité Mesure - '
    mesureEdit: any

    constructor(
        config: NgbDropdownConfig,
        private mesureFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private mesureService: MesureService
    ) {
        config.autoClose = true
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(true)
        this.activatedRoute.params.subscribe((params) => {
            const id = params.id
            this.mesureService.getOne(id).subscribe((response: any)=>{
              this.mesureEdit = response.data
              this.initCode()
              this.loadingSubject.next(false)
              this.title = this.title + this.mesureEdit.um_um
            })
        })
    }
    // init code
    initCode() {
        this.createForm()
        this.loadingSubject.next(false)
    }
    //create form
    createForm() {
        this.mesure = new Mesure()
        this.mesureForm = this.mesureFB.group({
            um_um: [this.mesureEdit.um_um, Validators.required],
            um_alt_um: [this.mesureEdit.um_alt_um, Validators.required],
            um_part:  [this.mesureEdit.um_part],
            um_conv:  [this.mesureEdit.um_conv],

        })
    }
    //reste form
    reset() {
        this.mesure = new Mesure()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.mesureForm.controls
        /** check form */
        if (this.mesureForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            return
        }

        // tslint:disable-next-line:prefer-const
        let address = this.prepareCode()
        this.addCode(address)
    }
    /**
     * Returns object for saving
     */
    prepareCode(): Mesure {
        const controls = this.mesureForm.controls
        const _mesure = new Mesure()
        _mesure.id = this.mesureEdit.id
        _mesure.um_um = controls.um_um.value
        _mesure.um_alt_um = controls.um_alt_um.value
        _mesure.um_part = controls.um_part.value
        _mesure.um_conv = controls.um_conv.value
        return _mesure
    }
    /**
     * Add code
     *
     * @param _mesure: MesureModel
     */
    addCode(_mesure: Mesure) {
        this.loadingSubject.next(true)
        this.mesureService.update(this.mesureEdit.id, _mesure).subscribe(
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
                this.router.navigateByUrl("/unit-mesure/units-list")
            }
        )
    }

    /**
     * Go back to the list
     *
     */
    goBack() {
        this.loadingSubject.next(false)
        const url = `/unit-mesure/units-list`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
}
