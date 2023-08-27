import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    GridService,
    Formatters,
    FieldType,
    OnEventArgs,
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
import {
    NgbModal,
    NgbActiveModal,
    ModalDismissReasons,
    NgbModalOptions,
  } from "@ng-bootstrap/ng-bootstrap"
import { Taxe, TaxeService, CodeService,AccountService } from "../../../../core/erp"

@Component({
  selector: 'kt-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrls: ['./edit-tax.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class EditTaxComponent implements OnInit {
    taxe: Taxe
    taxForm: FormGroup
    hasFormErrors = false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    title: String = 'Modifier taxe - '
    taxeEdit: any
    // selects
  tx2_tax_type: any[] = []
  tx2_pt_taxc: any[] = []

  angularGrid: AngularGridInstance
  grid: any
  gridService: GridService
  dataView: any
  columnDefinitions: Column[]
  gridOptions: GridOption
  dataset: any[]

accounts: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance

  row_number

    constructor(
        config: NgbDropdownConfig,
        private taxFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private modalService: NgbModal,
        private taxeService: TaxeService,
        private codeService: CodeService,
        private accountsService: AccountService
    ) {
        config.autoClose = true
        this.codeService
        .getBy({ code_fldname: "tx2_tax_type" })
        .subscribe((response: any) => (this.tx2_tax_type = response.data))
    this.codeService
        .getBy({ code_fldname: "tx2_pt_taxc" })
        .subscribe((response: any) => (this.tx2_pt_taxc = response.data))
    }
    ngOnInit(): void {
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(true)
      this.activatedRoute.params.subscribe((params) => {
          const id = params.id
          this.taxeService.getOne(id).subscribe((response: any)=>{
            this.taxeEdit = response.data
            this.initCode()
            this.loadingSubject.next(false)
            this.title = this.title + this.taxeEdit.tx2_tax_code
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
      this.taxe = new Taxe()
      this.taxForm = this.taxFB.group({
          tx2_tax_type: [this.taxeEdit.tx2_tax_type, Validators.required],
          tx2_tax_code: [this.taxeEdit.tx2_tax_code, Validators.required],
          tx2_pt_taxc:  [this.taxeEdit.tx2_pt_taxc,  Validators.required],
          tx2_desc:     [this.taxeEdit.tx2_desc,Validators.required],
          tx2_tax_pct:  [this.taxeEdit.tx2_tax_pct],
          tx2_by_line:  [this.taxeEdit.tx2_by_line],
          tx2_base:  [this.taxeEdit.tx2_base],
          tx2_pct_recv:  [this.taxeEdit.tx2_pct_recv],
          tx2_effdate:  [this.taxeEdit.tx2_effdate],
          tx2_exp_date:  [this.taxeEdit.tx2_exp_date],
          tx2_update_tax:  [this.taxeEdit.tx2_update_tax],
          tx2_rcpt_tax_point:  [this.taxeEdit.tx2_rcpt_tax_point],
          tx2_tax_in:  [this.taxeEdit.tx2_tax_in],
          tx2_usage_tax_point:  [this.taxeEdit.tx2_usage_tax_point],
        
        })
    }
    //reste form
    reset() {
        this.taxe = new Taxe()
        this.createForm()
        this.hasFormErrors = false
    }




    // save data
    
    /**
     * Returns object for saving
     */


    onSubmit() {
        this.hasFormErrors = false
        const controls = this.taxForm.controls
        /** check form */
        if (this.taxForm.invalid) {
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


    prepareCode(): Taxe {
        const controls = this.taxForm.controls
        const _taxe = new Taxe()
        _taxe.id = this.taxeEdit.id
        _taxe.tx2_tax_type = controls.tx2_tax_type.value
        _taxe.tx2_tax_code = controls.tx2_tax_code.value
       
        _taxe.tx2_pt_taxc = controls.tx2_pt_taxc.value
        _taxe.tx2_desc = controls.tx2_desc.value
        _taxe.tx2_tax_pct = controls.tx2_tax_pct.value
        _taxe.tx2_by_line = controls.tx2_by_line.value
        _taxe.tx2_base = controls.tx2_base.value
        _taxe.tx2_pct_recv = controls.tx2_pct_recv.value
      
        _taxe.tx2_effdate = controls.tx2_effdate.value
          ? `${controls.tx2_effdate.value.year}/${controls.tx2_effdate.value.month}/${controls.tx2_effdate.value.day}`
        : null
         _taxe.tx2_exp_date = controls.tx2_exp_date.value
           ? `${controls.tx2_exp_date.value.year}/${controls.tx2_exp_date.value.month}/${controls.tx2_exp_date.value.day}`
         : null
      
        _taxe.tx2_update_tax = controls.tx2_update_tax.value
        _taxe.tx2_rcpt_tax_point = controls.tx2_rcpt_tax_point.value
        _taxe.tx2_tax_in = controls.tx2_tax_in.value
        _taxe.tx2_usage_tax_point = controls.tx2_usage_tax_point.value
      return _taxe
    }
    /**
     * Add code
     *
     * @param _taxe: TaxeModel
     */
    addCode(_taxe: Taxe) {
        this.loadingSubject.next(true)
        this.taxeService.update(this.taxeEdit.id, _taxe).subscribe(
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
                this.router.navigateByUrl("/accounting-setting/taxes-list")
            }
        )
    }

    /**
     * Go back to the list
     *
     */
    goBack() {
        this.loadingSubject.next(false)
        const url = `/accounting-setting/taxes-list`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
    
}
