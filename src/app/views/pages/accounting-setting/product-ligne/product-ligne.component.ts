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
import { ProductLine,  AccountService, CodeService, ProductLineService,TaxeService} from "../../../../core/erp"
@Component({
  selector: 'kt-product-ligne',
  templateUrl: './product-ligne.component.html',
  styleUrls: ['./product-ligne.component.scss'],
  providers: [NgbDropdownConfig, NgbTabsetConfig],

})
export class ProductLigneComponent implements OnInit {


  productligneForm: FormGroup;
 
  productLine: ProductLine
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  angularGrid: AngularGridInstance
  grid: any
  gridService: GridService
  dataView: any
  columnDefinitions: Column[]
  gridOptions: GridOption
  dataset: any[]
  
  selectedField = ""

accounts: []
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  gridObj3: any
  angularGrid3: AngularGridInstance

  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  row_number


  constructor(
    config: NgbDropdownConfig,
    private productlineFB: FormBuilder,
    private stockFB: FormBuilder,
    private achatFB: FormBuilder,
    private venteFB: FormBuilder,
    private prodFB: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private productlineService: ProductLineService,
    private codeService: CodeService,
    private accountService: AccountService,
    private taxService: TaxeService
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

      this.productLine = new ProductLine()
      this.productligneForm = this.productlineFB.group({
        pl_prod_line: [this.productLine.pl_prod_line, Validators.required],
        pl_desc:      [{ value: this.productLine.pl_desc, disabled: !this.isExist },Validators.required],
       
        pl_taxable:    [{ value: this.productLine.pl_taxable, disabled: !this.isExist }],
        pl_taxc:       [{ value: this.productLine.pl_taxc, disabled: !this.isExist }],
        
      })
        }
  onChangeCode() {
    const controls = this.productligneForm.controls
   
    this.productlineService
        .getBy({
           pl_prod_line: controls.pl_prod_line.value,
            
        })
        .subscribe((response: any) => {
            if (response.data.length) {
                this.isExist = true
                console.log(response.data.length)
            } else {
                
                controls.pl_desc.enable() 
                controls. pl_taxable.enable() 
                controls. pl_taxc.enable() 
                
            }
        })
  }


   //reste form
   reset() {
    this.productLine = new ProductLine()
    this.createForm()
    this.hasFormErrors = false
 
}
onSubmit() {
  this.hasFormErrors = false
  const controls = this.productligneForm.controls
  /** check form */
  if (this.productligneForm.invalid) {
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

prepareCode(): ProductLine {
  const controls = this.productligneForm.controls
  
  const _productLine = new ProductLine()
  _productLine.pl_prod_line = controls.pl_prod_line.value
  _productLine.pl_desc = controls.pl_desc.value
  _productLine.pl_taxable = controls.pl_taxable.value
  _productLine.pl_taxc = controls.pl_taxc.value
  return _productLine
}

/**
     * Add code
     *
     * @param _code: CodeModel
     */
    addCode(_productLine: ProductLine) {
      this.loadingSubject.next(true)
      this.productlineService.add(_productLine).subscribe(
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
      const url = `/accounting-setting/taxes-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  handleSelectedRowsChangedtax(e, args) {
    const controls = this.productligneForm.controls
    if (Array.isArray(args.rows) && this.gridObjtax) {
        args.rows.map((idx) => {
            const item = this.gridObjtax.getDataItem(idx)
            controls.pl_taxc.setValue(item.tx2_tax_code || "")
        })
    }
}

  angularGridReadytax(angularGrid: AngularGridInstance) {
    this.angularGridtax = angularGrid
    this.gridObjtax = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridtax() {
    this.columnDefinitionstax = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "tx2_tax_code",
            name: "code ",
            field: "tx2_tax_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "tx2_tax_pct",
          name: "Taux Taxe ",
          field: "tx2_tax_pct",
          sortable: true,
          filterable: true,
          type: FieldType.float,
      },
        {
            id: "tx2_desc",
            name: "Designation",
            field: "tx2_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "tx2_tax_type",
            name: "Type Taxe",
            field: "tx2_tax_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
    ]

    this.gridOptionstax = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        autoHeight: false,
        frozenColumn: 0,
        frozenBottom: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        checkboxSelector: {
            // optionally change the column index position of the icon (defaults to 0)
            // columnIndexPosition: 1,

            // remove the unnecessary "Select All" checkbox in header when in single selection mode
            hideSelectAllCheckbox: true,

            // you can override the logic for showing (or not) the expand icon
            // for example, display the expand icon only on every 2nd row
            // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
        },
        multiSelect: false,
        rowSelectionOptions: {
            // True (Single Selection), False (Multiple Selections)
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.taxService
        .getAll()
        .subscribe((response: any) => (this.datatax = response.data))
}
opentax(contenttax) {
    this.prepareGridtax()
    this.modalService.open(contenttax, { size: "lg" })
}






}