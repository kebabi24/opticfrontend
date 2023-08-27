import { Component, ChangeDetectorRef, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

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
  } from "angular-slickgrid";
  
import { ActivatedRoute, Router } from "@angular/router"
import {
    NgbTabChangeEvent,
} from "@ng-bootstrap/ng-bootstrap"

import { FormBuilder, FormGroup, Validators } from "@angular/forms"
// Material
import { MatDialog } from "@angular/material/dialog"
// RxJS
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { map, startWith, delay, first } from "rxjs/operators"
// NGRX
import { Store, select } from "@ngrx/store"
import { Dictionary, Update } from "@ngrx/entity"
import { AppState } from "../../../../core/reducers"
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
// Services and Models
import {
    selectLastCreatedProductId,
    selectProductById,
    SPECIFICATIONS_DICTIONARY,
    ProductModel,
    ProductOnServerCreated,
    ProductUpdated,
    ProductsService,
} from "../../../../core/e-commerce"

import {
    Address,
    AddressService,
    CodeService,
    Customer,
    CustomerService,
    AccountService,
    DeviseService,
    SiteService,
    TaxeService,
    BankService,
} from "../../../../core/erp"
@Component({
  selector: 'kt-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit {
  private componentSubscriptions: Subscription
  // sticky portlet header margin
  private headerMargin: number

  // properties
  address: Address
  addressForm: FormGroup
  customer: Customer
  customerForm: FormGroup
  hasFormErrors = false
  hasCustomerFormErrors = false
  selectedTab = 0
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  addressId$: Observable<Number>
  customerEdit: any
  addressEdit: any
  isExist = false


  data: []
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  gridObj3: any
  angularGrid3: AngularGridInstance
  selectedField = ""
 
  error = false

  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  databank: []
  columnDefinitionsbank: Column[] = []
  gridOptionsbank: GridOption = {}
  gridObjbank: any
  angularGridbank: AngularGridInstance

  devises: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;
  datasite: [];
    columnDefinitionssite: Column[] = [];
    gridOptionssite: GridOption = {};
    gridObjsite: any;
    angularGridsite: AngularGridInstance;

    dateup: any;
    daterv: any;
datacode: [];
columnDefinitions4: Column[] = [];
gridOptions4: GridOption = {};
gridObj4: any;
angularGrid4: AngularGridInstance;
fieldcode = "";
fldname;
title: String = 'Modifier Fournisseur - '
  // selects
  ad_city: any[] = []
  ad_state: any[] = []
  ad_county: any[] = []
  cm_type: any[] = []
  cm_shipvia: any[] = []
  cm_region: any[] = []
  cm_class: any[] = []
  cm_promo: any[] = []
  cm_lang: any[] = []
  ad_tax_zone: any[] = []
  ad_tax_usage: any[] = []
  /**
   * Component constructor
   *
   * @param activatedRoute: ActivatedRoute
   * @param router: Router
   * @param typesUtilsService: TypesUtilsService
   * @param FB: FormBuilder
   * @param dialog: MatDialog
   * @param subheaderService: SubheaderService
   * @param layoutUtilsService: SubheaderService
   * @param layoutConfigService: LayoutConfigService
   * @param addressService: AddressService
   * @param codeService: CodeService
   * @param providerService: ProviderService
   * @param cdr: ChangeDetectorRef
   * 
 
   */
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private typesUtilsService: TypesUtilsService,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private subheaderService: SubheaderService,
      private layoutUtilsService: LayoutUtilsService,
      private layoutConfigService: LayoutConfigService,
      private addressService: AddressService,
      private codeService: CodeService,
      private modalService: NgbModal,
      private accountService: AccountService,
      private customerService: CustomerService,
      private taxService: TaxeService,
      private deviseService: DeviseService,
      private siteService: SiteService,
      private bankService: BankService,
      private cdr: ChangeDetectorRef,
      config: NgbDropdownConfig
  ) {
      config.autoClose = true
      
      this.codeService
          .getBy({ code_fldname: "ad_state" })
          .subscribe((response: any) => (this.ad_state = response.data))
      this.codeService
          .getBy({ code_fldname: "ad_county" })
          .subscribe((response: any) => (this.ad_county = response.data))
          this.codeService
          .getBy({ code_fldname: "cm_type" })
          .subscribe((response: any) => (this.cm_type = response.data))
      this.codeService
          .getBy({ code_fldname: "cm_class" })
          .subscribe((response: any) => (this.cm_class = response.data))
          this.codeService
          .getBy({ code_fldname: "cm_region" })
          .subscribe((response: any) => (this.cm_region = response.data))
      this.codeService
          .getBy({ code_fldname: "cm_shipvia" })
          .subscribe((response: any) => (this.cm_shipvia = response.data))
     
      this.codeService
          .getBy({ code_fldname: "cm_lang" })
          .subscribe((response: any) => (this.cm_lang = response.data))
      this.codeService
          .getBy({ code_fldname: "ad_tax_zone" })
          .subscribe((response: any) => (this.ad_tax_zone = response.data))
      
      this.codeService
          .getBy({ code_fldname: "ad_tax_usage" })
          .subscribe((response: any) => (this.ad_tax_usage = response.data))   
      this.codeService
          .getBy({ code_fldname: "ad_tax_zone" })
          .subscribe((response: any) => (this.ad_tax_zone = response.data))
      this.codeService
          .getBy({ code_fldname: "ad_tax_zone" })
          .subscribe((response: any) => (this.ad_tax_zone = response.data))
      this.codeService
          .getBy({ code_fldname: "ad_tax_usage" })
          .subscribe((response: any) => (this.ad_tax_usage = response.data))        
  }


  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.customerService.getOne(id).subscribe((response: any)=>{
          this.customerEdit = response.data
            this.addressEdit = response.data.address
            this.dateup = new Date(this.customerEdit.cm_cr_update)
            this.daterv = new Date(this.customerEdit.cm_cr_review)
            this.daterv.setDate(this.daterv.getDate() )
            this.dateup.setDate(this.dateup.getDate() )
            
          this.initCode()
          window.onload = () => {
            const style = getComputedStyle(document.getElementById("kt_header"))
            this.headerMargin = parseInt(style.height, 0)
        }
          this.loadingSubject.next(false)
          this.title = this.title + this.customerEdit.cm_addr
          })

        })
  
  }

  initCode() {
    this.createAddressForm()
    this.createCustomerForm()
    
    this.loadingSubject.next(false)
  }
   
  createAddressForm() {
    this.loadingSubject.next(false)
   
    this.addressForm = this.formBuilder.group({
      ad_addr: [this.addressEdit.ad_addr, Validators.required],
      ad_name: [this.addressEdit.ad_name ,Validators.required],
      ad_line1:  [this.addressEdit.ad_line1 ,Validators.required],
      ad_city: [this.addressEdit.ad_city ],
      ad_state: [this.addressEdit.ad_state ],
      ad_zip: [this.addressEdit.ad_zip ],
      ad_country: [this.addressEdit.ad_country ],
      ad_temp: [this.addressEdit.ad_temp ],
      ad_phone: [this.addressEdit.ad_phone , Validators.required],
      ad_phone2: [this.addressEdit.ad_phone ],
      ad_ext: [this.addressEdit.ad_ext ],
      ad_ext2: [this.addressEdit.ad_ext2 ],
      ad_fax: [this.addressEdit.ad_fax ],
      ad_fax2: [this.addressEdit.ad_fax2 ],
      ad_attn: [this.addressEdit.ad_attn ],
      ad_attn2: [this.addressEdit.ad_attn2 ],
      ad_taxable: [this.addressEdit.ad_taxable ],
      ad_tax_zone: [this.addressEdit.ad_tax_zone ],
      ad_taxc: [this.addressEdit.ad_taxc ],
      ad_tax_usage: [this.addressEdit.ad_tax_usage ],
      ad_tax_in: [this.addressEdit.ad_tax_in ],
      ad_gst_id: [this.addressEdit.ad_gst_id ],
      ad_pst_id: [this.addressEdit.ad_pst_id ],
      ad_misc1_id: [this.addressEdit.ad_misc1_id ],
      ad_misc2_id: [this.addressEdit.ad_misc2_id ],
  
    })
}
createCustomerForm() {
  
 // this.customer = new Customer()
 const controls  = this.addressForm.controls
  this.customerForm = this.formBuilder.group({
      cm_sort: [this.customerEdit.cm_sort],
      cm_type: [this.customerEdit.cm_type],
      cm_slspn: [this.customerEdit.cm_slspn],
      cm_region: [this.customerEdit.cm_region],
     
      cm_shipvia: [this.customerEdit.cm_shipvia],
      cm_site: [this.customerEdit.cm_site],
      cm_lang: [this.customerEdit.cm_lang],
      
      cm_bank: [this.customerEdit.cm_bank],
      cm_curr: [this.customerEdit.cm_curr],
      cm_class: [this.customerEdit.cm_class],
      cm_resale: [this.customerEdit.cm_resale],
      cm_sic: [this.customerEdit.cm_sic],
      cm_pay_method: [this.customerEdit.cm_pay_method],
      cm_fix_pr: [this.customerEdit.cm_fix_pr],
      cm_inv_auto: [this.customerEdit.cm_inv_auto],
      cm_cr_limit: [this.customerEdit.cm_cr_limit],
      cm_disc_pct: [this.customerEdit.cm_disc_pct],
      cm_bill: [this.customerEdit.cm_bill],
      cm_cr_terms: [this.customerEdit.cm_cr_terms],
      cm_fin: [this.customerEdit.cm_fin],
      cm_stmt: [this.customerEdit.cm_stmt],
      cm_po_reqd: [this.customerEdit.cm_po_reqd],
      cm_partial: [this.customerEdit.cm_partial],
      cm_hold: [this.customerEdit.cm_hold],
      cm_dun: [this.customerEdit.cm_dun],
      cm_db: [this.customerEdit.cm_db],
      cm_stmt_cyc: [this.customerEdit.cm_stmt_cyc],
      //cm_cr_review: [this.customerEdit.cm_cr_review],
      
      cm_cr_review: [{
        year: this.daterv.getFullYear(),
        month: this.daterv.getMonth()+1,
        day: this.daterv.getDate()
      }],
      cm_cr_update: [{
        year: this.dateup.getFullYear(),
        month: this.dateup.getMonth()+1,
        day: this.dateup.getDate()
      }],
     
  })
  /*
  const d = new Date(this.customerEdit.cm_cr_update)
  controls.cm_cr_update.setValue({
    year: d.getFullYear(),
    month: d.getMonth()+1,
    day: d.getDate()
  }|| null); 
*/
}




  onChangeState() {
    const controls  = this.addressForm.controls
   console.log(controls.ad_state.value)
    this.codeService
        .getBy({ code_fldname: "ad_city", chr01: controls.ad_state.value.substring(0, 2) })
        .subscribe((response: any) => {(this.ad_city = response.data)
        console.log(response.data)})    
}

 /**
   * Go back to the list
   *
   * @param id: any
   */
  goBack() {
    this.loadingSubject.next(false)
    const url = `/customers`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}


/**
 * Refresh product
 *
 * @param isNew: boolean
 * @param id: number
 */
refreshProduct(isNew: boolean = false, id = 0) {
    this.loadingSubject.next(false)
    let url = this.router.url
    if (!isNew) {
        this.router.navigate([url], { relativeTo: this.activatedRoute })
        return
    }

    url = `/ecommerce/products/edit/${id}`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

/**
 * Reset
 */
reset() {
    this.address = new Address()
    this.customer = new Customer()
    this.createAddressForm()
    this.createCustomerForm()
    this.hasFormErrors = false
    this.hasCustomerFormErrors = false
}
/**
   * Save data
   *
   * @param withBack: boolean
   */
  onSubmit() {
    this.hasFormErrors = false
    const controls = this.addressForm.controls
    const controls_ = this.customerForm.controls
    /** check form */
    if (this.addressForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrors = true
        this.selectedTab = 0
        return
    }
    if (this.customerForm.invalid) {
        Object.keys(controls_).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasCustomerFormErrors = true
        return
    }

    let address = this.prepareAddress()
    this.addAddress(address)
}

/**
   * Add product
   *
   * @param _customer: ProductModel
   */
  addCustomer(_customer: Customer) {
    this.loadingSubject.next(true)
    this.customerService.update(this.customerEdit.id,_customer).subscribe(
        (reponse) => console.log("response", Response),
        (error) =>
            this.layoutUtilsService.showActionNotification(
                "Erreur verifier les informations",
                MessageType.Create,
                10000,
                true,
                true
            ),
        () => {
            this.layoutUtilsService.showActionNotification(
                "Ajout avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
            this.router.navigateByUrl("/cusomers/customer-list")
        }
    )
    // this.store.dispatch(new ProductOnServerCreated({ product: _product }))
    // this.componentSubscriptions = this.store
    //     .pipe(delay(1000), select(selectLastCreatedProductId))
    //     .subscribe((newId) => {
    //         if (!newId) {
    //             return
    //         }

    //         this.loadingSubject.next(false)
    //         if (withBack) {
    //             this.goBack(newId)
    //         } else {
    //             const message = `New product successfully has been added.`
    //             this.layoutUtilsService.showActionNotification(
    //                 message,
    //                 MessageType.Create,
    //                 10000,
    //                 true,
    //                 true
    //             )
    //             this.refreshProduct(true, newId)
    //         }
    //     })
}







/**
   * Add product
   *
   * @param _address: ProductModel
   */
  addAddress(_address: Address) {
    this.loadingSubject.next(true)
    this.addressService.update(this.addressEdit.id,_address).subscribe(
        (reponse: any) => console.log(reponse),
        (error) =>
            this.layoutUtilsService.showActionNotification(
                "Erreur verifier les informations",
                MessageType.Create,
                10000,
                true,
                true
            ),
        () => {
            let customer = this.prepareCustomer()
            this.addCustomer(customer)
        }
    )
}

prepareCustomer(): Customer {
  const controls = this.customerForm.controls
  const _customer = new Customer()
  _customer.cm_addr = this.address.ad_addr
  _customer.cm_sort = controls.cm_sort.value
  _customer.cm_type = controls.cm_type.value

  _customer.cm_slspn = controls.cm_slspn.value
  _customer.cm_region = controls.cm_region.value

 
  _customer.cm_shipvia = controls.cm_shipvia.value
  _customer.cm_bank = controls.cm_bank.value
  _customer.cm_lang = controls.cm_lang.value
  _customer.cm_curr = controls.cm_curr.value
  _customer.cm_site = controls.cm_site.value
  _customer.cm_resale = controls.cm_resale.value
  _customer.cm_class = controls.cm_class.value
  
 
  _customer.cm_fix_pr = controls.cm_fix_pr.value
  _customer.cm_inv_auto = controls.cm_inv_auto.value
  
  _customer.cm_cr_limit = controls.cm_cr_limit.value
  _customer.cm_bill = controls.cm_bill.value

  _customer.cm_fin = controls.cm_fin.value
  _customer.cm_stmt = controls.cm_stmt.value
  _customer.cm_sic = controls.cm_sic.value
  _customer.cm_pay_method = controls.cm_pay_method.value
  _customer.cm_hold = controls.cm_hold.value
  _customer.cm_cr_terms = controls.cm_cr_terms.value
  _customer.cm_disc_pct = controls.cm_disc_pct.value
  _customer.cm_po_reqd = controls.cm_po_reqd.value
  _customer.cm_partial = controls.cm_partial.value
  _customer.cm_hold = controls.cm_hold.value

  
  _customer.cm_db = controls.cm_db.value
  _customer.cm_dun = controls.cm_dun.value
  _customer.cm_stmt_cyc = controls.cm_stmt_cyc.value
  
  _customer.cm_cr_review = controls.cm_cr_review.value
      ? `${controls.cm_cr_review.value.year}/${controls.cm_cr_review.value.month}/${controls.cm_cr_review.value.day}`
      : null
  _customer.cm_cr_update = controls.cm_cr_update.value
      ? `${controls.cm_cr_update.value.year}/${controls.cm_cr_update.value.month}/${controls.cm_cr_update.value.day}`
      : null
  return _customer
}

prepareAddress(): Address {
  const controls = this.addressForm.controls
  const controls1 = this.customerForm.controls

  const _address = new Address()
  
  _address.ad_addr = controls.ad_addr.value
  _address.ad_name = controls.ad_name.value
  _address.ad_line1 = controls.ad_line1.value
  _address.ad_city = controls.ad_city.value
  _address.ad_state = controls.ad_state.value
  _address.ad_zip = controls.ad_zip.value
  _address.ad_country = controls.ad_country.value
  _address.ad_type = "customer"
  _address.ad_temp = controls.ad_temp.value
  _address.ad_phone = controls.ad_phone.value
  _address.ad_phone2 = controls.ad_phone2.value
  _address.ad_ext = controls.ad_ext.value
  _address.ad_ext2 = controls.ad_ext2.value
  _address.ad_fax = controls.ad_fax.value
  _address.ad_fax2 = controls.ad_fax2.value
  _address.ad_attn = controls.ad_attn.value
  _address.ad_attn2 = controls.ad_attn2.value
  _address.ad_taxable = controls.ad_taxable.value
  _address.ad_tax_zone = controls.ad_tax_zone.value
  _address.ad_taxc = controls.ad_taxc.value
  _address.ad_tax_usage = controls.ad_tax_usage.value
  _address.ad_tax_in = controls.ad_tax_in.value
  _address.ad_gst_id = controls.ad_gst_id.value
  _address.ad_pst_id = controls.ad_pst_id.value
  _address.ad_misc1_id = controls.ad_misc1_id.value
  _address.ad_misc2_id = controls.ad_misc2_id.value
  _address.ad_date = new Date()
  this.address = _address
  return _address
}


onAlertClose($event) {
this.hasFormErrors = false
}




changeBank (){

  const controls1 = this.customerForm.controls 
  const bk_code  = controls1.cm_bank.value
 
  
this.bankService.getBy({bk_code}).subscribe((res:any)=>{
    //const {data} = res.data.bank
    //console.log(res.data.bank)
    if (res.data.bank == null){ this.layoutUtilsService.showActionNotification(
        "cette banque n'existe pas!",
        MessageType.Create,
        10000,
        true,
        true
    )
    this.error = true}
    else {
        this.error = false
    }


},error=>console.log(error))
}


handleSelectedRowsChangedtax(e, args) {
  const controls = this.addressForm.controls
  if (Array.isArray(args.rows) && this.gridObjtax) {
      args.rows.map((idx) => {
          const item = this.gridObjtax.getDataItem(idx)
          controls.ad_taxc.setValue(item.tx2_tax_code || "")
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


handleSelectedRowsChanged4(e, args) {
  const controls1 = this.customerForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "cm_cr_terms": {
          controls1.cm_cr_terms.setValue(item.code_value || "");
          break;
        }
        case "cm_pay_method": {
          controls1.cm_pay_method.setValue(item.code_value || "");
          break;
        }
        
        default:
          break;
      }
    });
  }
}
angularGridReady4(angularGrid: AngularGridInstance) {
  this.angularGrid4 = angularGrid;
  this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid4() {
  this.columnDefinitions4 = [
    {
      id: "id",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,

      minWidth: 50,
      maxWidth: 50,
    },
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "code_fldname",
      name: "Champs",
      field: "code_fldname",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "code_value",
      name: "Code",
      field: "code_value",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "code_cmmt",
      name: "Description",
      field: "code_cmmt",
      sortable: true,
      width: 200,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptions4 = {
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
    checkboxSelector: {},
    multiSelect: false,
    rowSelectionOptions: {
      selectActiveRow: true,
    },
  };


if (this.selectedField == "cm_pay_method") {

          this.fldname = "check_form"
        }
        else {
          this.fldname = this.selectedField
        }
    
        // fill the dataset with your data
        this.codeService
          .getBy({ code_fldname: this.fldname })
    .subscribe((response: any) => (this.datacode = response.data));
}

open4(content, field) {
  this.selectedField = field;
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}





handleSelectedRowsChangedsite(e, args) {
  const controls1 = this.customerForm.controls;
 

  if (Array.isArray(args.rows) && this.gridObjsite) {
    args.rows.map((idx) => {
      const item = this.gridObjsite.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "cm_site": {
          controls1.cm_site.setValue(item.si_site || "");
          break;
        }
        
        default:
          break;
      }
    });
  }
}

angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid;
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridsite() {
  this.columnDefinitionssite = [
    {
      id: "id",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,

      minWidth: 50,
      maxWidth: 50,
    },
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "si_site",
      name: "Site",
      field: "si_site",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "si_desc",
      name: "Designation",
      field: "si_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionssite = {
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
    checkboxSelector: {},
    multiSelect: false,
    rowSelectionOptions: {
      selectActiveRow: true,
    },
  };

  // fill the dataset with your data
  this.siteService
    .getAll()
    .subscribe((response: any) => (this.datasite = response.data));
}
opensite(contentsite, field) {
  this.selectedField = field;
  this.prepareGridsite();
  this.modalService.open(contentsite, { size: "lg" });
}

handleSelectedRowsChanged2(e, args) {
  const controls = this.customerForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
      controls.cm_curr.setValue(item.cu_curr || "");
    });
  }
}

angularGridReady2(angularGrid: AngularGridInstance) {
  this.angularGrid2 = angularGrid;
  this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid2() {
  this.columnDefinitions2 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "cu_curr",
      name: "code",
      field: "cu_curr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cu_desc",
      name: "Designation",
      field: "cu_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cu_rnd_mthd",
      name: "Methode Arrondi",
      field: "cu_rnd_mthd",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cu_active",
      name: "Actif",
      field: "cu_active",
      sortable: true,
      filterable: true,
      type: FieldType.boolean,
    },
    {
      id: "cu_iso_curr",
      name: "Devise Iso",
      field: "cu_iso_curr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptions2 = {
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
  };

  // fill the dataset with your data
  this.deviseService
    .getAll()
    .subscribe((response: any) => (this.devises = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedbank(e, args) {
  const controls = this.customerForm.controls
  if (Array.isArray(args.rows) && this.gridObjbank) {
      args.rows.map((idx) => {
          const item = this.gridObjbank.getDataItem(idx)
          controls.cm_bank.setValue(item.bk_code || "")
      })
  }
}

angularGridReadybank(angularGrid: AngularGridInstance) {
  this.angularGridbank = angularGrid
  this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridbank() {
  this.columnDefinitionsbank = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "bk_code",
          name: "code ",
          field: "bk_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "bk_desc",
          name: "Designation",
          field: "bk_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "bk_curr",
          name: "devise",
          field: "bk_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "bk_entity",
        name: "Entité",
        field: "bk_entity",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },

  ]

  this.gridOptionsbank = {
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
  this.bankService
      .getAll()
      .subscribe((response: any) => (this.databank = response.data))
}
openbank(content) {
  this.prepareGridbank()
  this.modalService.open(content, { size: "lg" })
}
}
