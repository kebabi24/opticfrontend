// Angular
import { Component, ChangeDetectorRef, OnInit } from "@angular/core"
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    SiteService,
    Customer,
    CustomerService,
    AccountService,
    TaxeService,
    DeviseService,
    SequenceService,
    BankService,
} from "../../../../core/erp"
@Component({
  selector: 'kt-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit {
    // Private password
    private componentSubscriptions: Subscription
    // sticky portlet header margin
    private headerMargin: number

    // properties
    address: Address
    addressForm: FormGroup
    customer: Customer
    customerForm: FormGroup
    hasFormErrors = false
    hascustomerFormErrors = false
    selectedTab = 0
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    addressId$: Observable<Number>

    isExist = false

    devises: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;



    customers: [];
    columnDefinitions5: Column[] = [];
    gridOptions5: GridOption = {};
    gridObj5: any;
    angularGrid5: AngularGridInstance;

    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""

    error = false

    
    fieldcode = "";

    datasite: [];
    columnDefinitionssite: Column[] = [];
    gridOptionssite: GridOption = {};
    gridObjsite: any;
    angularGridsite: AngularGridInstance;

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

    datacode: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;
    seq;
    codecli;
    message: String;
    user;
fldname;
    // selects
    ad_city: any[] = []
    ad_state: any[] = []
    ad_country: any[] = []
    cm_type: any[] = []
    cm_class: any[] = []
    cm_region: any[] = []
    
    cm_shipvia: any[] = []
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
      * @param customerService: CustomerService
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
        private siteService: SiteService,
        private taxService: TaxeService,
        private bankService: BankService,
        private sequenceService: SequenceService,
        private deviseService: DeviseService,
        private cdr: ChangeDetectorRef,
        config: NgbDropdownConfig
    ) {
        
        config.autoClose = true
        
        this.codeService
            .getBy({ code_fldname: "ad_country" })
            .subscribe((response: any) => (this.ad_country = response.data))
        this.codeService
            .getBy({ code_fldname: "ad_state" })
            .subscribe((response: any) => (this.ad_state = response.data))
     //   this.codeService
       //     .getBy({ code_fldname: "ad_city" })
         //   .subscribe((response: any) => (this.ad_city = response.data))    
            
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
        this.user =  JSON.parse(localStorage.getItem('user'))
        this.init()
        
        // sticky portlet header
        window.onload = () => {
            const style = getComputedStyle(document.getElementById("kt_header"))
            this.headerMargin = parseInt(style.height, 0)
        /*  const lang = "fr"
          if ( lang == "fr") {
            this.onchangelabel() } else {

            }*/
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
       // this.createCustomerForm()
        
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


      
       // document.getElementById("bill").focus();
        this.address = new Address()
        this.customer = new Customer()
        this.addressForm = this.formBuilder.group({
            ad_addr: [this.address.ad_addr, Validators.required],
            ad_name: [ this.address.ad_name,  Validators.required],
            
            cm_type: [this.customer.cm_type,  Validators.required],
            cm_mod_date: [this.customer.cm_mod_date,  ],
            ad_line1:  [ this.address.ad_line1, Validators.required],
            ad_city: [ this.address.ad_city],
            ad_state: [ this.address.ad_state],
            ad_zip: [ this.address.ad_zip],
            ad_country: [this.address.ad_country],
            ad_temp: [this.address.ad_temp],
            ad_phone: [this.address.ad_phone, Validators.required],
        //    ad_phone2: [{ value: this.address.ad_phone,  }],
        //    ad_ext: [{ value: this.address.ad_ext,  }],
        //    ad_ext2: [{ value: this.address.ad_ext2,  }],
        //    ad_fax: [{ value: this.address.ad_fax,  }],
        //    ad_fax2: [{ value: this.address.ad_fax2,  }],
            ad_attn: [this.address.ad_attn],
        //    ad_attn2: [{ value: this.address.ad_attn2,  }],
            ad_taxable: [true],
        //    ad_tax_zone: [{ value: this.address.ad_tax_zone,  }],
            ad_taxc: [this.address.ad_taxc],
       //     ad_tax_usage: [{ value: this.address.ad_tax_usage,  }],
       //     ad_tax_in: [{ value: this.address.ad_tax_in,  }],
            ad_gst_id: [this.address.ad_gst_id],
            ad_pst_id: [this.address.ad_pst_id],
            ad_misc1_id: [ this.address.ad_misc1_id],
            ad_misc2_id: [this.address.ad_misc2_id],
            cm_sort: [this.customer.cm_sort],
            //cm_type: [{ value: this.customer.cm_type,  }],
            cm_slspn: [this.customer.cm_slspn],
            cm_region: [this.customer.cm_region],
            cm_cr_terms: ["ES"],
           // cm_mod_date: [ this.customer.cm_mod_date],
          //  cm_shipvia: [{ value: this.customer.cm_shipvia,  }],
          //  cm_site: [{ value: this.customer.cm_site,  }],
          //  cm_lang: [{ value: this.customer.cm_lang,  }],
            
          //  cm_bank: [{ value: this.customer.cm_bank,  }],
            cm_curr: [  "DA"  ],
            cm_class: [this.customer.cm_class],
          //  cm_resale: [{ value: this.customer.cm_resale,  }],
            cm_sic: [this.customer.cm_sic],
            
        })


        this.sequenceService.getByOne({ seq_type: "CL", seq_profile: this.user.usrd_profile }).subscribe(
          (response: any) => {
        this.seq = response.data
        console.log(this.seq)   
            if (this.seq) {
             this.codecli = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
             console.log(this.seq.seq_prefix)
             console.log(this.seq.seq_curr_val)
             
            console.log(this.codecli)
             const id = Number(this.seq.id)
          let obj = { }
          obj = {
            seq_curr_val: Number(this.seq.seq_curr_val )+1
          }
          this.sequenceService.update(id , obj ).subscribe(
            (reponse) => console.log("response", Response),
            (error) => {
              this.message = "Erreur modification Sequence";
              this.hasFormErrors = true;
              return;
         
            
            },
            )
          }else {
            this.message = "Parametrage Monquant pour la sequence";
            this.hasFormErrors = true;
            return;
       
           }
           const controls = this.addressForm.controls
           controls.ad_addr.setValue(this.codecli)
          })
    }
   /* createCustomerForm() {
       // this.customer = new Customer()
        this.customerForm = this.formBuilder.group({
            cm_sort: [this.customer.cm_sort],
            //cm_type: [{ value: this.customer.cm_type,  }],
            cm_slspn: [this.customer.cm_slspn],
            cm_region: [this.customer.cm_region],
            cm_mod_date: [ this.customer.cm_mod_date],
          //  cm_shipvia: [{ value: this.customer.cm_shipvia,  }],
          //  cm_site: [{ value: this.customer.cm_site,  }],
          //  cm_lang: [{ value: this.customer.cm_lang,  }],
            
          //  cm_bank: [{ value: this.customer.cm_bank,  }],
            cm_curr: [  "DA"  ],
            cm_class: [this.customer.cm_class],
          //  cm_resale: [{ value: this.customer.cm_resale,  }],
            cm_sic: [this.customer.cm_sic],
            
            cm_pay_method: [{ value: this.customer.cm_pay_method,  }],
            cm_fix_pr: [{ value: this.customer.cm_fix_pr,  }],
            cm_inv_auto: [{ value: this.customer.cm_inv_auto,  }],
            cm_cr_limit: [{ value: this.customer.cm_cr_limit,  }],
            cm_disc_pct: [{ value: this.customer.cm_disc_pct,  }],
            cm_bill: [{ value: this.customer.cm_bill,  }],
            cm_cr_terms: [{ value: this.customer.cm_cr_terms,  }],
            cm_fin: [{ value: this.customer.cm_fin,  }],
            cm_stmt: [{ value: this.customer.cm_stmt,  }],
            cm_po_reqd: [{ value: this.customer.cm_po_reqd,  }],
            cm_partial: [{ value: this.customer.cm_partial,  }],
            cm_hold: [{ value: this.customer.cm_hold,  }],
            cm_dun: [{ value: this.customer.cm_dun,  }],
            cm_db: [{ value: this.customer.cm_db,  }],
            cm_stmt_cyc: [{ value: this.customer.cm_stmt_cyc,  }],
            cm_cr_review: [{ value: this.customer.cm_cr_review,  }],
            cm_cr_update: [{ value: this.customer.cm_cr_update,  }],
  
        })
    }
*/
    onChangeState() {
        const controls  = this.addressForm.controls
       console.log(controls.ad_state.value)
        this.codeService
            .getBy({ code_fldname: "ad_city", chr01: controls.ad_state.value.substring(0, 2) })
            .subscribe((response: any) => {(this.ad_city = response.data)
            console.log(response.data)})    
    }

   /* onchangelabel(){
console.log("hhhhhhhhhhhhhhhlllllllllllllllllllllllllllllll")
      document.getElementById('code').innerHTML = 'Couuuude';
    }*/
    onChangeCode() {
        const controls  = this.addressForm.controls
        //const controls1 = this.customerForm.controls
      
        this.addressService
            .getBy({
                  ad_addr: controls.ad_addr.value,
            })
            .subscribe((response: any) => {
                
                if (response.data) {
                    this.isExist = true
                    console.log(response.data)
                    
                } else {
                    
                    controls.ad_name.enable()
                    controls.ad_line1.enable()
                    controls.ad_city.enable()
                    controls.ad_state.enable()
                    controls.ad_zip.enable()
                    controls.ad_country.enable()
                    controls.ad_temp.enable()
                    controls.ad_phone.enable()
                    controls.cm_mod_date.enable()
                //    controls.ad_phone2.enable()
                //    controls.ad_ext.enable()
                //    controls.ad_ext2.enable()
                //    controls.ad_fax.enable()
                //    controls.ad_fax2.enable()
                    controls.ad_attn.enable()
                //    controls.ad_attn2.enable()
                    controls.ad_taxable.enable()
                //    controls.ad_tax_zone.enable()
                    controls.ad_taxc.enable()
                //    controls.ad_tax_usage.enable()
                //    controls.ad_tax_in.enable()
                    controls.ad_gst_id.enable()
                    controls.ad_pst_id.enable()
                    controls.ad_misc1_id.enable()
                    controls.ad_misc2_id.enable()
                  
                    
                    controls.cm_sort.enable()
                    controls.cm_type.enable()
                    controls.cm_slspn.enable()
                    controls.cm_region.enable()
                    
                    
                    
                  //  controls1.cm_shipvia.enable()
                    controls.cm_curr.enable()
                   
                    
                  //  controls1.cm_resale.enable()
                  //  controls1.cm_site.enable()
                  //  controls1.cm_lang.enable()
                    controls.cm_class.enable()
                    controls.cm_sic.enable()
                    controls.cm_cr_terms.enable()
                  /*  controls1.cm_bank.enable()
                    controls1.cm_pay_method.enable()
                    controls1.cm_fix_pr.enable()
                    controls1.cm_inv_auto.enable()
                    controls1.cm_partial.enable()
                    controls1.cm_cr_limit.enable()
                    controls1.cm_disc_pct.enable()
                    controls1.cm_bill.enable()
                    controls1.cm_cr_terms.enable()
                    controls1.cm_hold.enable()
                    controls1.cm_fin.enable()
                    controls1.cm_stmt.enable()
                    controls1.cm_cr_review.enable()
                    controls1.cm_cr_update.enable()
                    controls1.cm_db.enable()
                    controls1.cm_po_reqd.enable()
                    controls1.cm_stmt_cyc.enable()
                    controls1.cm_dun.enable()
                   */
                  }
                
          })
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

    goBackWithoutId() {
        this.router.navigateByUrl("/customers", {
            relativeTo: this.activatedRoute,
        })
    }

    
    /**
      * Reset
      */
    reset() {
        this.address = new Address()
        this.customer = new Customer()
        this.createAddressForm()
       // this.createCustomerForm()
        this.hasFormErrors = false
        this.hascustomerFormErrors = false
    }

    /**
      * Save data
      *
      * @param withBack: boolean
      */
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.addressForm.controls
      //  const controls_ = this.customerForm.controls
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
      * Returns object for saving
      */
    prepareAddress(): Address {
        const controls = this.addressForm.controls
       // const controls1 = this.customerForm.controls

        const _address = new Address()
        console.log(controls.ad_temp.value)
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
      //  _address.ad_phone2 = controls.ad_phone2.value
      //  _address.ad_ext = controls.ad_ext.value
      //  _address.ad_ext2 = controls.ad_ext2.value
      //  _address.ad_fax = controls.ad_fax.value
      //  _address.ad_fax2 = controls.ad_fax2.value
        _address.ad_attn = controls.ad_attn.value
      //  _address.ad_attn2 = controls.ad_attn2.value
        _address.ad_taxable = controls.ad_taxable.value
      //  _address.ad_tax_zone = controls.ad_tax_zone.value
        _address.ad_taxc = controls.ad_taxc.value
      //  _address.ad_tax_usage = controls.ad_tax_usage.value
      //  _address.ad_tax_in = controls.ad_tax_in.value
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
                let customer = this.prepareCustomer()
                this.addCustomer(customer)
            }
        )
    }

    /**
      * Returns object for saving
      */
    prepareCustomer(): Customer {
        //const controls = this.customerForm.controls
        const controls = this.addressForm.controls
        const _customer = new Customer()
        _customer.cm_addr = this.address.ad_addr
        _customer.cm_sort = controls.cm_sort.value
        _customer.cm_type = controls.cm_type.value
    
        _customer.cm_slspn = controls.cm_slspn.value
        _customer.cm_region = controls.cm_region.value
    
       
       // _customer.cm_shipvia = controls.cm_shipvia.value
      //  _customer.cm_bank = controls.cm_bank.value
     //   _customer.cm_lang = controls.cm_lang.value
        _customer.cm_curr = controls.cm_curr.value
     //   _customer.cm_site = controls.cm_site.value
     //   _customer.cm_resale = controls.cm_resale.value
        _customer.cm_class = controls.cm_class.value
        
       
      //  _customer.cm_fix_pr = controls.cm_fix_pr.value
      //  _customer.cm_inv_auto = controls.cm_inv_auto.value
        
     //   _customer.cm_cr_limit = controls.cm_cr_limit.value
     //   _customer.cm_bill = controls.cm_bill.value

     //   _customer.cm_fin = controls.cm_fin.value
     //   _customer.cm_stmt = controls.cm_stmt.value
        _customer.cm_sic = controls.cm_sic.value
        _customer.cm_cr_terms = controls.cm_cr_terms.value
       // _customer.cm_bank = controls.cm_bank.value
        
       // _customer.cm_pay_method = controls.cm_pay_method.value
       // _customer.cm_hold = controls.cm_hold.value
       /* _customer.cm_cr_terms = controls.cm_cr_terms.value
        _customer.cm_disc_pct = controls.cm_disc_pct.value
        _customer.cm_po_reqd = controls.cm_po_reqd.value
        _customer.cm_partial = controls.cm_partial.value
        _customer.cm_hold = controls.cm_hold.value

        
        _customer.cm_db = controls.cm_db.value
        _customer.cm_dun = controls.cm_dun.value
        _customer.cm_stmt_cyc = controls.cm_stmt_cyc.value*/
        _customer.cm_mod_date = controls.cm_mod_date.value
        ? `${controls.cm_mod_date.value.year}/${controls.cm_mod_date.value.month}/${controls.cm_mod_date.value.day}`
        : null
/*
        _customer.cm_cr_review = controls.cm_cr_review.value
            ? `${controls.cm_cr_review.value.year}/${controls.cm_cr_review.value.month}/${controls.cm_cr_review.value.day}`
            : null
        _customer.cm_cr_update = controls.cm_cr_update.value
            ? `${controls.cm_cr_update.value.year}/${controls.cm_cr_update.value.month}/${controls.cm_cr_update.value.day}`
            : null*/
        return _customer
    }

    /**
      * Add product
      *
      * @param _product: ProductModel
      */
    addCustomer(_customer: Customer) {
        this.loadingSubject.next(true)
        this.customerService.add(_customer).subscribe(
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
                this.router.navigateByUrl("/customers/customer-list")
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
    
    
    
    

      handleSelectedRowsChanged2(e, args) {
        const controls = this.addressForm.controls;
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
    
    
}
