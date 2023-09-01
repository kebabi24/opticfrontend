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
    DeviseService,
    SequenceService,
} from "../../../../core/erp"


@Component({
    selector: "kt-providers-create",
    templateUrl: "./providers-create.component.html",
    styleUrls: ["./providers-create.component.scss"],
    providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class ProvidersCreateComponent implements OnInit {
    // Private password
    private componentSubscriptions: Subscription
    // sticky portlet header margin
    private headerMargin: number

    // properties
    address: Address
    addressForm: FormGroup
    provider: Provider
    providerForm: FormGroup
    hasFormErrors = false
    hasFormErrors1 = false
    hasProviderFormErrors = false
    selectedTab = 0
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    addressId$: Observable<Number>

    isExist = false

    banks: [];
    columnDefinitionsbank: Column[] = [];
    gridOptionsbank: GridOption = {};
    gridObjbank: any;
    angularGridbank: AngularGridInstance;

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

    devises: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;


  datacode: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  fieldcode = "";
fldname;
seq: any;
  code: any;
  message: String;  
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
    ad_country: any[] = []
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
        private deviseService: DeviseService,
        private sequenceService: SequenceService,
        config: NgbDropdownConfig
    ) {
        config.autoClose = true
        
        this.codeService
            .getBy({ code_fldname: "ad_state" })
            .subscribe((response: any) => (this.ad_state = response.data))
            this.codeService
            .getBy({ code_fldname: "ad_country" })
            .subscribe((response: any) => (this.ad_country = response.data))
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

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit() {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.init()
        // sticky portlet header
        window.onload = () => {
            const style = getComputedStyle(document.getElementById("kt_header"))
            this.headerMargin = parseInt(style.height, 0)
        }
    }

    // loadProduct(_product, fromService: boolean = false) {
    //     if (!_product) {
    //         this.goBack("")
    //     }
    //     this.product = _product
    //     this.productId$ = of(_product.id)
    //     this.oldProduct = Object.assign({}, _product)
    //     this.initProduct()
    //     if (fromService) {
    //         this.cdr.detectChanges()
    //     }
    // }

    // // If product didn't find in store
    // loadProductFromService(productId) {
    //     this.productService.getProductById(productId).subscribe((res) => {
    //         this.loadProduct(res, true)
    //     })
    // }

    /**
     * On destroy
     */
    ngOnDestroy() {
        if (this.componentSubscriptions) {
            this.componentSubscriptions.unsubscribe()
        }
    }

    /**
     * Init product
     */
    init() {
        this.createAddressForm()
        // this.createProviderForm()
        this.loadingSubject.next(false)
        // if (!this.product.id) {
        //     this.subheaderService.setBreadcrumbs([
        //         { title: "eCommerce", page: `/ecommerce` },
        //         { title: "Products", page: `/ecommerce/products` },
        //         { title: "Create product", page: `/ecommerce/products/add` },
        //     ])
        //     return
        // }
        // this.subheaderService.setTitle("Edit product")
        // this.subheaderService.setBreadcrumbs([
        //     { title: "eCommerce", page: `/ecommerce` },
        //     { title: "Products", page: `/ecommerce/products` },
        //     {
        //         title: "Edit product",
        //         page: `/ecommerce/products/edit`,
        //         queryParams: { id: this.product.id },
        //     },
        // ])
    }

    /**
     * Create form
     */
    createAddressForm() {
        this.address = new Address()
        this.provider = new Provider()
        this.addressForm = this.formBuilder.group({
           // ad_addr: [this.address.ad_addr, Validators.required],
            ad_name: [this.address.ad_name ,Validators.required],
            ad_line1:  [{ value: this.address.ad_line1, disabled: !this.isExist },Validators.required],
            ad_city: [{ value: this.address.ad_city, disabled: !this.isExist }],
            ad_state: [{ value: this.address.ad_state, disabled: !this.isExist }],
            ad_zip: [{ value: this.address.ad_zip, disabled: !this.isExist }],
            //ad_county: [{ value: this.address.ad_county, disabled: !this.isExist }],
           // ad_country: [{ value: this.address.ad_country, disabled: !this.isExist }],
            ad_phone: [{ value: this.address.ad_phone, disabled: !this.isExist }, Validators.required],
            ad_ext: [{ value: this.address.ad_ext, disabled: !this.isExist }],
            ad_fax: [{ value: this.address.ad_fax, disabled: !this.isExist }],
            ad_attn: [{ value: this.address.ad_attn, disabled: !this.isExist }],
            ad_taxable: [{ value: this.address.ad_taxable, disabled: !this.isExist }],
            ad_taxc: [{ value: this.address.ad_taxc, disabled: !this.isExist }],
            ad_gst_id: [{ value: this.address.ad_gst_id, disabled: !this.isExist }],
            ad_pst_id: [{ value: this.address.ad_pst_id, disabled: !this.isExist }],
            ad_misc1_id: [{ value: this.address.ad_misc1_id, disabled: !this.isExist }],
            ad_misc2_id: [{ value: this.address.ad_misc2_id, disabled: !this.isExist }],
          //  vd_sort: [{ value: this.provider.vd_sort, disabled: !this.isExist }],
            vd_type: [{ value: this.provider.vd_type, disabled: !this.isExist }],
            vd_bank: [{ value: this.provider.vd_bank, disabled: !this.isExist }],
            vd_cr_terms: [{ value: this.provider.vd_cr_terms, disabled: !this.isExist }],
        })
    }
    // createProviderForm() {
    //     this.provider = new Provider()
    //     this.providerForm = this.formBuilder.group({
    //         vd_sort: [{ value: this.provider.vd_sort, disabled: !this.isExist }],
    //         vd_type: [{ value: this.provider.vd_type, disabled: !this.isExist }],
    //         vd_bank: [{ value: this.provider.vd_bank, disabled: !this.isExist }],
    //         vd_cr_terms: [{ value: this.provider.vd_cr_terms, disabled: !this.isExist }],
    //           })
    // }

    onChangeState() {
        const controls  = this.addressForm.controls
       console.log(controls.ad_state.value)
        this.codeService
            .getBy({ code_fldname: "ad_city", chr01: controls.ad_state.value.substring(0, 2) })
            .subscribe((response: any) => {(this.ad_city = response.data)
            console.log(response.data)})    
    }

    onChangeCode() {
        const controls  = this.addressForm.controls
       // const controls1 = this.providerForm.controls
        this.addressService
            .getBy({
                  ad_name: controls.ad_name.value,
            })
            .subscribe((response: any) => {
                
                if (response.data) {
                    this.isExist = true
                    console.log(response.data)
                   
                } else {
                    
                   // controls.ad_name.enable()
                    controls.ad_line1.enable()
                   
                   // controls.ad_country.enable()
                    controls.ad_state.enable()
                    controls.ad_city.enable()
                    controls.ad_zip.enable()
                    
                    
                    controls.ad_phone.enable()
                    controls.ad_ext.enable()
                    controls.ad_fax.enable()
                    controls.ad_attn.enable()
                    controls.ad_taxable.enable()
                    controls.ad_taxc.enable()
                    controls.ad_gst_id.enable()
                    controls.ad_pst_id.enable()
                    controls.ad_misc1_id.enable()
                    controls.ad_misc2_id.enable()
                    controls.vd_type.enable()
                    controls.vd_bank.enable()
                    controls.vd_cr_terms.enable()
                }
                
         })
      }
    /**
     * Go back to the list
     *
     * @param id: any
     */
    goBack(id) {
        this.loadingSubject.next(false)
        const url = `/providers`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }

    goBackWithoutId() {
        this.router.navigateByUrl("/providers", {
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
        // this.createProviderForm()
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
      //  const controls_ = this.providerForm.controls
        /** check form */
        if (this.addressForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            this.selectedTab = 0
            return
        }
        
       
        this.sequenceService.getByOne({ seq_type: "FR" }).subscribe(
          (response: any) => {
        this.seq = response.data 
            
            if (this.seq) {
             this.code = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
    
             this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
              (reponse) => console.log("response", Response),
              (error) => {
                this.message = "Erreur modification Sequence";
                this.hasFormErrors1 = true;
                return;
           
              
              },
              )
              
            
              let address = this.prepareAddress()
              this.addAddress(address)
          
      }else {
        this.message = "Parametrage Monquant pour la sequence";
        this.hasFormErrors1 = true;
        return;
    
       }
    
    
    })
    }

    /**
     * Returns object for saving
     */
    prepareAddress(): Address {
        const controls = this.addressForm.controls
       // const controls1 = this.providerForm.controls

        const _address = new Address()
       // console.log(controls.ad_temp.value)
        _address.ad_addr = this.code
        _address.ad_name = controls.ad_name.value
        _address.ad_line1 = controls.ad_line1.value
        _address.ad_city = controls.ad_city.value
        _address.ad_state = controls.ad_state.value
        _address.ad_zip = controls.ad_zip.value
      //  _address.ad_country = controls.ad_country.value
        _address.ad_phone = controls.ad_phone.value
        //_address.ad_ext = controls.ad_ext.value
        _address.ad_type = "vendor"
        _address.ad_fax = controls.ad_fax.value
        _address.ad_attn = controls.ad_attn.value
        _address.ad_taxable = controls.ad_taxable.value
        _address.ad_taxc = controls.ad_taxc.value
        _address.ad_gst_id = controls.ad_gst_id.value
        _address.ad_pst_id = controls.ad_pst_id.value
        _address.ad_misc1_id = controls.ad_misc1_id.value
        _address.ad_misc2_id = controls.ad_misc2_id.value
        _address.ad_date = new Date()
        this.address = _address
        return _address
    }

    /**
     * Add product
     *
     * @param _product: ProductModel
     */
    addAddress(_address: Address) {
        this.loadingSubject.next(true)
        this.addressService.addAddress(_address).subscribe(
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

    /**
     * Returns object for saving
     */
    prepareProvider(): Provider {
        const controls = this.addressForm.controls
        const _provider = new Provider()
        _provider.vd_addr = this.code
        _provider.vd_type = controls.vd_type.value
        // _provider.vd_rmks = controls.vd_rmks.value
        _provider.vd_bank = controls.vd_bank.value
        _provider.vd_curr = "DA"
        _provider.vd_cr_terms = controls.vd_cr_terms.value
        return _provider
    }

    /**
     * Add product
     *
     * @param _product: ProductModel
     */
    addProvider(_provider: Provider) {
        this.loadingSubject.next(true)
        this.providerService.add(_provider).subscribe(
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
                this.router.navigateByUrl("/providers")
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

    // /**
    //  * Update product
    //  *
    //  * @param _product: ProductModel
    //  * @param withBack: boolean
    //  */
    // updateProduct(_product: ProductModel, withBack: boolean = false) {
    //     this.loadingSubject.next(true)

    //     const updateProduct: Update<ProductModel> = {
    //         id: _product.id,
    //         changes: _product,
    //     }

    //     this.store.dispatch(
    //         new ProductUpdated({
    //             partialProduct: updateProduct,
    //             product: _product,
    //         })
    //     )

    //     of(undefined)
    //         .pipe(delay(3000))
    //         .subscribe(() => {
    //             // Remove this line
    //             if (withBack) {
    //                 this.goBack(_product.id)
    //             } else {
    //                 const message = `Product successfully has been saved.`
    //                 this.layoutUtilsService.showActionNotification(
    //                     message,
    //                     MessageType.Update,
    //                     10000,
    //                     true,
    //                     true
    //                 )
    //                 this.refreshProduct(false)
    //             }
    //         }) // Remove this line
    // }

    /**
     * Returns component title
     */
    getComponentTitle() {
        let result = "Ajouter Fournisseur"
        // if (!this.product || !this.product.id) {
        //     return result
        // }

        // result = `Modifier Fournisseur - `
        return result
    }

    /**
     * Close alert
     *
     * @param $event
     */
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
        const controls1 = this.addressForm.controls;
        
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
        const controls = this.addressForm.controls;
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
      handleSelectedRowsChanged2(e, args) {
        const controls = this.providerForm.controls;
        if (Array.isArray(args.rows) && this.gridObj2) {
          args.rows.map((idx) => {
            const item = this.gridObj2.getDataItem(idx);
            controls.vd_curr.setValue(item.cu_curr || "");
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
    
  
}
