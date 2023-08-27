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
import { Taxe, AccountService, CodeService, TaxeService} from "../../../../core/erp"
@Component({
  selector: 'kt-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: ['./create-tax.component.scss'],
})
export class CreateTaxComponent implements OnInit {

  taxForm: FormGroup
  taxe: Taxe
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

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
    private taxService: TaxeService,
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
    this.loadingSubject.next(false)
    this.createForm()
  }
    //create form
    createForm() {
      this.loadingSubject.next(false)

      this.taxe = new Taxe()
      this.taxForm = this.taxFB.group({
          tx2_tax_type: [this.taxe.tx2_tax_type, Validators.required],
          tx2_tax_code: [this.taxe.tx2_tax_code, Validators.required],
          tx2_pt_taxc:  [{ value: this.taxe.tx2_pt_taxc, disabled: !this.isExist },Validators.required],
          tx2_desc:     [{ value: this.taxe.tx2_desc, disabled: !this.isExist },Validators.required],
          tx2_tax_pct:  [{ value: this.taxe.tx2_tax_pct, disabled: !this.isExist }],
          tx2_by_line:  [{ value: this.taxe.tx2_by_line, disabled: !this.isExist }],
          tx2_base:  [{ value: this.taxe.tx2_base, disabled: !this.isExist }],
          tx2_pct_recv:  [{ value: this.taxe.tx2_pct_recv, disabled: !this.isExist }],
          tx2_effdate:  [{ value: this.taxe.tx2_effdate, disabled: !this.isExist }],
          tx2_exp_date:  [{ value: this.taxe.tx2_exp_date, disabled: !this.isExist }],
          tx2_update_tax:  [{ value: this.taxe.tx2_update_tax, disabled: !this.isExist }],
          tx2_rcpt_tax_point:  [{ value: this.taxe.tx2_rcpt_tax_point, disabled: !this.isExist }],
          tx2_tax_in:  [{ value: this.taxe.tx2_tax_in, disabled: !this.isExist }],
          tx2_usage_tax_point:  [{ value: this.taxe.tx2_usage_tax_point, disabled: !this.isExist }],
          
          
      })
  }
  onChangeCode() {
    const controls = this.taxForm.controls
    this.taxService
        .getBy({
            tx2_tax_type: controls.tx2_tax_type.value,
            tx2_tax_code: controls.tx2_tax_code.value,
        })
        .subscribe((response: any) => {
            console.log(response)
            if (response.data) {
                this.isExist = true
                console.log(response.data.length)
            } else {
                
                controls.tx2_pt_taxc.enable() 
                controls.tx2_desc.enable() 
                controls.tx2_tax_pct.enable() 
                controls.tx2_by_line.enable() 
                controls.tx2_base.enable() 
                controls.tx2_pct_recv.enable() 
                controls.tx2_effdate.enable() 
                controls.tx2_exp_date.enable() 
                controls.tx2_update_tax.enable() 
                controls.tx2_rcpt_tax_point.enable() 
                controls.tx2_tax_in.enable() 
                controls.tx2_usage_tax_point.enable() 
            }
        })
  }
  //reste form
  reset() {
    this.taxe = new Taxe()
    this.createForm()
    this.hasFormErrors = false
  }
  // save data
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
/**
 * Returns object for saving
 */
prepareCode(): Taxe {
  const controls = this.taxForm.controls
  const _taxe = new Taxe()
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
     * @param _code: CodeModel
     */
    addCode(_taxe: Taxe) {
      this.loadingSubject.next(true)
      this.taxService.add(_taxe).subscribe(
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
