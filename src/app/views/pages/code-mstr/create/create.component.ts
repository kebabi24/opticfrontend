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

import { Code, CodeService } from "../../../../core/erp"

@Component({
    selector: "kt-create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class CreateComponent implements OnInit {
    code: Code
    codeForm: FormGroup
    hasFormErrors = false
    isExist = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>

    constructor(
        config: NgbDropdownConfig,
        private codeFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private codeService: CodeService
    ) {
        config.autoClose = true
    }
    ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
       /* window.onload = () => {
          const lang = "fr"
          if ( lang == "fr") {
            this.onchangelabel() } else {
              
            }
        }*/
    }
   /* onchangelabel(){
        console.log("hhhhhhhhhhhhhhhlllllllllllllllllllllllllllllll")
              document.getElementById('fld').innerHTML = 'Couuuude';
            }*/
    //create form
    createForm() {
        this.loadingSubject.next(false)

        this.code = new Code()
        this.codeForm = this.codeFB.group({
            code_fldname: [this.code.code_fldname, Validators.required],
            code_value: [this.code.code_value, Validators.required],
            code_cmmt: [
                { value: this.code.code_cmmt, disabled: !this.isExist },
                Validators.required,
            ],
            code_chr01: [{ value: this.code.chr01, disabled: !this.isExist }],
            code_chr02: [{ value: this.code.chr02, disabled: !this.isExist }],
            code_dec01: [{ value: this.code.dec01, disabled: !this.isExist }],
            code_dec02: [{ value: this.code.dec02, disabled: !this.isExist }],
            code_date01: [{ value: this.code.date01, disabled: !this.isExist }],
            code_date02: [{ value: this.code.date02, disabled: !this.isExist }],
            code_bool01: [{ value: this.code.bool01, disabled: !this.isExist }],
            code_bool02: [{ value: this.code.bool02, disabled: !this.isExist }],
        })
    }
    onChangeCode() {
        const controls = this.codeForm.controls
        this.codeService
            .getBy({
                code_value: controls.code_value.value,
                code_fldname: controls.code_fldname.value,
            })
            .subscribe((response: any) => {
                if (response.data.length) {
                    this.isExist = true
                    console.log(response.data.length)
                } else {
                    controls.code_value.enable()
                    controls.code_cmmt.enable()
                    controls.code_chr01.enable()
                    controls.code_chr02.enable()
                    controls.code_dec01.enable()
                    controls.code_dec02.enable()
                    controls.code_date01.enable()
                    controls.code_date02.enable()
                    controls.code_bool01.enable()
                    controls.code_bool02.enable()
                }
            })
    }
    //reste form
    reset() {
        this.code = new Code()
        this.createForm()
        this.hasFormErrors = false
    }
    // save data
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.codeForm.controls
        /** check form */
        if (this.codeForm.invalid) {
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
    prepareCode(): Code {
        const controls = this.codeForm.controls
        const _code = new Code()
        _code.code_fldname = controls.code_fldname.value
        _code.code_value = controls.code_value.value
       
        _code.code_cmmt = controls.code_cmmt.value
        _code.chr01 = controls.code_chr01.value
        _code.chr02 = controls.code_chr02.value
        _code.dec01 = controls.code_dec01.value
        _code.dec02 = controls.code_dec02.value
        _code.date01 = controls.code_date01.value
            ? `${controls.code_date01.value.year}/${controls.code_date01.value.month}/${controls.code_date01.value.day}`
            : null
        _code.date02 = controls.code_date02.value
            ? `${controls.code_date02.value.year}/${controls.code_date02.value.month}/${controls.code_date02.value.day}`
            : null
        _code.bool01 = controls.code_bool01.value
        _code.bool02 = controls.code_bool02.value

        return _code
    }
    /**
     * Add code
     *
     * @param _code: CodeModel
     */
    addCode(_code: Code) {
        this.loadingSubject.next(true)
        this.codeService.add(_code).subscribe(
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
                // this.router.navigateByUrl("/code-mstr/codes-list")
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
        const url = `/code-mstr/codes-list`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
}
