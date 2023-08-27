// Angular
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
    Provider,
    ProviderService,
    AccountService,
    TaxeService,
    BankService,
} from "../../../../core/erp"

@Component({
  selector: 'kt-providers-edit',
  templateUrl: './providers-edit.component.html',
  styleUrls: ['./providers-edit.component.scss']
})
export class ProvidersEditComponent implements OnInit {

  private componentSubscriptions: Subscription
    // sticky portlet header margin
    private headerMargin: number

    // properties
    address: Address
    addressForm: FormGroup
    provider: Provider
    providerForm: FormGroup
    hasFormErrors = false
    hasProviderFormErrors = false
    selectedTab = 0
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    addressId$: Observable<Number>
    providerEdit: any
    addressEdit: any
    isExist = false


    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""
  
    banks: [];
    columnDefinitionsbank: Column[] = [];
    gridOptionsbank: GridOption = {};
    gridObjbank: any;
    angularGridbank: AngularGridInstance;
    
    error = false

    datatax: []
    columnDefinitionstax: Column[] = []
    gridOptionstax: GridOption = {}
    gridObjtax: any
    angularGridtax: AngularGridInstance

  datacode: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  fieldcode = "";
  title: String = 'Modifier Fournisseur - '
  fldname;  
  // selects
    ad_city: any[] = []
    ad_state: any[] = []
    ad_county: any[] = []
    vd_type: any[] = []
    vd_shipvia: any[] = []
    vd_promo: any[] = []
    vd_lang: any[] = []
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
        private providerService: ProviderService,
        private taxService: TaxeService,
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
            .getBy({ code_fldname: "vd_type" })
            .subscribe((response: any) => (this.vd_type = response.data))
        this.codeService
            .getBy({ code_fldname: "vd_shipvia" })
            .subscribe((response: any) => (this.vd_shipvia = response.data))
        this.codeService
            .getBy({ code_fldname: "vd_promo" })
            .subscribe((response: any) => (this.vd_promo = response.data))
        this.codeService
            .getBy({ code_fldname: "vd_lang" })
            .subscribe((response: any) => (this.vd_lang = response.data))
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
          this.providerService.getOne(id).subscribe((response: any)=>{
            this.providerEdit = response.data
              this.addressEdit = response.data.address
              console.log(this.providerEdit)
              console.log(this.addressEdit)
            this.initCode()
            window.onload = () => {
              const style = getComputedStyle(document.getElementById("kt_header"))
              this.headerMargin = parseInt(style.height, 0)
          }
            this.loadingSubject.next(false)
            this.title = this.title + this.providerEdit.vd_addr
            })

          })
    
    }

    initCode() {
      this.createAddressForm()
     // this.createProviderForm()
      
      this.loadingSubject.next(false)
    }
     
      createAddressForm() {
        this.loadingSubject.next(false)
       
        this.addressForm = this.formBuilder.group({
            ad_addr: [{ value: this.addressEdit.ad_addr, disabled: true }],
            ad_name: [this.addressEdit.ad_name ,Validators.required],
            ad_line1:  [this.addressEdit.ad_line1 ,Validators.required],
            ad_city: [this.addressEdit.ad_city ],
            ad_state: [this.addressEdit.ad_state ],
            ad_zip: [this.addressEdit.ad_zip ],
           // ad_format: [this.addressEdit.ad_format ],
           // ad_county: [this.addressEdit.ad_county ],
           // ad_country: [this.addressEdit.ad_country ],
           // ad_temp: [this.addressEdit.ad_temp ],
            ad_phone: [this.addressEdit.ad_phone , Validators.required],
            //ad_phone2: [this.addressEdit.ad_phone ],
            //ad_ext: [this.addressEdit.ad_ext ],
            //ad_ext2: [this.addressEdit.ad_ext2 ],
            //ad_fax: [this.addressEdit.ad_fax ],
            //ad_fax2: [this.addressEdit.ad_fax2 ],
            ad_attn: [this.addressEdit.ad_attn ],
            //ad_attn2: [this.addressEdit.ad_attn2],
            ad_taxable: [this.addressEdit.ad_taxable],
            //ad_tax_zone: [this.addressEdit.ad_tax_zone ],
            ad_taxc: [this.addressEdit.ad_taxc ],
            //ad_tax_usage: [this.addressEdit.ad_tax_usage ],
            //ad_tax_in: [this.addressEdit.ad_tax_in ],
            ad_gst_id: [this.addressEdit.ad_gst_id ],
            ad_pst_id: [this.addressEdit.ad_pst_id ],
            ad_misc1_id: [this.addressEdit.ad_misc1_id ],
            ad_misc2_id: [this.addressEdit.ad_misc2_id ],
            vd_type: [this.providerEdit.vd_type ],
            vd_bank: [this.providerEdit.vd_bank ],
            vd_cr_terms: [this.providerEdit.vd_cr_terms ],
            
        })
    }
    // createProviderForm() {
    //   this.loadingSubject.next(false)
     
    //     this.providerForm = this.formBuilder.group({
    //        // vd_sort: [this.providerEdit.vd_sort ],
    //         vd_type: [this.providerEdit.vd_type ],
           
    //         //vd_shipvia: [this.providerEdit.vd_shipvia],
    //         vd_bank: [this.providerEdit.vd_bank ],
    //         //vd_ckfrm: [this.providerEdit.vd_ckfrm ],
    //         //vd_curr: [this.providerEdit.vd_curr ],
    //         //vd_lang: [this.providerEdit.vd_lang ],
    //         //vd_pur_cntct: [this.providerEdit.vd_pur_cntct],
    //         //vd_ap_cntct: [this.providerEdit.vd_ap_cntct ],
    //         //vd_misc_cr: [this.providerEdit.vd_misc_cr ],
    //         // vd_kanban_supplier: [this.providerEdit.vd_kanban_supplier],
    //         vd_cr_terms: [this.providerEdit.vd_cr_terms ],
    //         // vd_disc_pct: [this.providerEdit.vd_disc_pct ],
    //         // vd_prepay: [this.providerEdit.vd_prepay ],
    //         // vd_debtor: [this.providerEdit.vd_debtor ],
    //         // vd_partial: [this.providerEdit.vd_partial],
    //         // vd_hold: [this.providerEdit.vd_hold ],
    //         // vd_pay_spec: [this.providerEdit.vd_pay_spec],
    //         // vd_db: [this.providerEdit.vd_db ],
    //     })
    // }




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
    goBack(id) {
      this.loadingSubject.next(false)
      const url = `/providers-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  goBackWithoutId() {
      this.router.navigateByUrl("/providers-list", {
          relativeTo: this.activatedRoute,
      })
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
      this.provider = new Provider()
      this.createAddressForm()
//      this.createProviderForm()
      this.hasFormErrors = false
      this.hasProviderFormErrors = false
  }
/**
     * Save data
     *
     * @param withBack: boolean
     */
    onSubmit() {
      this.hasFormErrors = false
      const controls = this.addressForm.controls
  //    const controls_ = this.providerForm.controls
      /** check form */
      if (this.addressForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          this.selectedTab = 0
          return
      }
    
      let address = this.prepareAddress()
      this.addAddress(address)
  }

  /**
     * Add product
     *
     * @param _provider: ProductModel
     */
    addProvider(_provider: Provider) {
      this.loadingSubject.next(true)
      this.providerService.update(this.providerEdit.id,_provider).subscribe(
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
              this.router.navigateByUrl("/providers-list")
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
              let provider = this.prepareProvider()
              this.addProvider(provider)
          }
      )
  }

  prepareProvider(): Provider {
    const controls = this.addressForm.controls
    const _provider = new Provider()
   // _provider.vd_addr = this.address.ad_addr
   // _provider.vd_sort = controls.vd_sort.value
    _provider.vd_type = controls.vd_type.value
    
//    _provider.vd_shipvia = controls.vd_shipvia.value
    // _provider.vd_rmks = controls.vd_rmks.value
    _provider.vd_bank = controls.vd_bank.value
    // _provider.vd_ckfrm = controls.vd_ckfrm.value
    // _provider.vd_curr = controls.vd_curr.value
    // _provider.vd_lang = controls.vd_lang.value
    // _provider.vd_pur_cntct = controls.vd_pur_cntct.value
    // _provider.vd_misc_cr = controls.vd_misc_cr.value
    // _provider.vd_ap_cntct = controls.vd_ap_cntct.value
    // _provider.vd_carrier_id = controls.vd_carrier_id.value
    // _provider.vd_promo = controls.vd_promo.value
    // _provider.vd_kanban_supplier = controls.vd_kanban_supplier.value
     _provider.vd_cr_terms = controls.vd_cr_terms.value
    // _provider.vd_disc_pct = controls.vd_disc_pct.value
    // _provider.vd_prepay = controls.vd_prepay.value
    // _provider.vd_debtor = controls.vd_debtor.value
    // _provider.vd_partial = controls.vd_partial.value
    // _provider.vd_hold = controls.vd_hold.value
    // _provider.vd_pay_spec = controls.vd_pay_spec.value
    // _provider.vd_db = controls.vd_db.value
    return _provider
}

prepareAddress(): Address {
  const controls = this.addressForm.controls
 // const controls1 = this.providerForm.controls

  const _address = new Address()
  
  _address.ad_addr = controls.ad_addr.value
  _address.ad_name = controls.ad_name.value
  _address.ad_line1 = controls.ad_line1.value
  _address.ad_city = controls.ad_city.value
  _address.ad_state = controls.ad_state.value
  _address.ad_zip = controls.ad_zip.value
//  _address.ad_country = controls.ad_country.value
 // _address.ad_temp = controls.ad_temp.value
  _address.ad_phone = controls.ad_phone.value
  //_address.ad_phone2 = controls.ad_phone2.value
  //_address.ad_ext = controls.ad_ext.value
  //_address.ad_ext2 = controls.ad_ext2.value
  _address.ad_type = "vendor"
  //_address.ad_fax = controls.ad_fax.value
  //_address.ad_fax2 = controls.ad_fax2.value
  _address.ad_attn = controls.ad_attn.value
  //_address.ad_attn2 = controls.ad_attn2.value
  _address.ad_taxable = controls.ad_taxable.value
  //_address.ad_tax_zone = controls.ad_tax_zone.value
  _address.ad_taxc = controls.ad_taxc.value
  //_address.ad_tax_usage = controls.ad_tax_usage.value
  //_address.ad_tax_in = controls.ad_tax_in.value
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
  const controls1 = this.providerForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "vd_cr_terms": {
          controls1.vd_cr_terms.setValue(item.code_value || "");
          break;
        }
        case "vd_ckfrm": {
          controls1.vd_ckfrm.setValue(item.code_value || "");
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

  if (this.selectedField == "vd_ckfrm") {

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

handleSelectedRowsChangedbank(e, args) {
  const controls = this.providerForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbank) {
    args.rows.map((idx) => {
      const item = this.gridObjbank.getDataItem(idx);
      controls.vd_bank.setValue(item.bk_code || "");
          
    });
  }
}

angularGridReadybank(angularGrid: AngularGridInstance) {
  this.angularGridbank = angularGrid;
  this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {};
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
      name: "code",
      field: "bk_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "address.ad_name",
      name: "Designation",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "bk_curr",
      name: "Devise",
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
      type: FieldType.boolean,
    },
  ];

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
    dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
      var val = undefined;
      try {
        val = eval("item." + column.field);
      } catch (e) {
        // ignore
      }
      return val;
    },
  };

  // fill the dataset with your data
  this.bankService
    .getAll()
    .subscribe((response: any) => (this.banks = response.data));
}
openbank(content) {
  this.prepareGridbank();
  this.modalService.open(content, { size: "lg" });
}

}
