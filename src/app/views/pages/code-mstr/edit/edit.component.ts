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
    selector: "kt-edit",
    templateUrl: "./edit.component.html",
    styleUrls: ["./edit.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class EditComponent implements OnInit {
    code: Code
    codeForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    title: String = 'Modifier Code - '
    codeEdit: any
date1: any;
date2: any;
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
        this.loadingSubject.next(true)
        this.activatedRoute.params.subscribe((params) => {
            const id = params.id
            this.codeService.getOne(id).subscribe((response: any)=>{
              this.codeEdit = response.data

                this.date1 = new Date(this.codeEdit.date01) 
                this.date1.setDate(this.date1.getDate() )
             
              
                this.date2 = new Date(this.codeEdit.date02)
                this.date2.setDate(this.date2.getDate() )
            
               // console.log(this.codeEdit.date01, this.date2)
             
              this.initCode()
              this.loadingSubject.next(false)
              this.title = this.title + this.codeEdit.code_value
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
    
        this.codeForm = this.codeFB.group({
            code_value: [this.codeEdit.code_value, Validators.required],
            code_cmmt: [this.codeEdit.code_cmmt, Validators.required],
            code_fldname: [this.codeEdit.code_fldname, Validators.required],
            chr01: [ this.codeEdit.chr01],
            chr02: [this.codeEdit.chr02],
            dec01: [this.codeEdit.dec01],
            dec02: [this.codeEdit.dec02],
           
            bool01: [this.codeEdit.bool01],
            bool02: [this.codeEdit.bool02],

            date01: [{
                year: this.date1.getFullYear(),
                month: this.date1.getMonth()+1,
                day: this.date1.getDate()
              }],
              date02: [{
                year: this.date2.getFullYear(),
                month: this.date2.getMonth()+1,
                day: this.date2.getDate()
              }],
        })
        
        const controls = this.codeForm.controls
      
        console.log(this.date1)

        if(this.codeEdit.date01 == null) {
                controls.date01.setValue(null); 
            } 
        if (this.codeEdit.date02 == null) { controls.date02.setValue(null); } 
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
        _code.id = this.codeEdit.id
        _code.code_fldname = controls.code_fldname.value
        _code.code_value = controls.code_value.value
        _code.code_cmmt = controls.code_cmmt.value
        _code.chr01 = controls.chr01.value
        _code.chr02 = controls.chr02.value
        _code.dec01 = controls.dec01.value
        _code.dec02 = controls.dec02.value
        _code.date01 = controls.date01.value
            ? `${controls.date01.value.year}/${controls.date01.value.month}/${controls.date01.value.day}`
            : null
        _code.date02 = controls.date02.value
            ? `${controls.date02.value.year}/${controls.date02.value.month}/${controls.date02.value.day}`
            : null
        _code.bool01 = controls.bool01.value
        _code.bool02 = controls.bool02.value
        return _code
    }
    /**
     * Add code
     *
     * @param _code: CodeModel
     */
    addCode(_code: Code) {
        this.loadingSubject.next(true)
        this.codeService.update(this.codeEdit.id, _code).subscribe(
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
                this.router.navigateByUrl("/code-mstr/codes-list")
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
