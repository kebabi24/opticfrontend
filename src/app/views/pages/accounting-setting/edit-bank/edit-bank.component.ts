import { Component, ChangeDetectorRef, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http"
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
    Bank,
    BankService,
    AccountService,
    DeviseService,
    EntityService,
    TaxeService,
} from "../../../../core/erp"
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
const API_URL = environment.apiUrl + "/codes"

@Component({
  selector: 'kt-edit-bank',
  templateUrl: './edit-bank.component.html',
  styleUrls: ['./edit-bank.component.scss']
})
export class EditBankComponent implements OnInit {

  private componentSubscriptions: Subscription
  // sticky portlet header margin
  private headerMargin: number

  // properties
  address: Address
  addressForm: FormGroup
  bank: Bank
  bankForm: FormGroup
  hasFormErrors = false
  hasbankFormErrors = false
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

  data: []
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  gridObj3: any
  angularGrid3: AngularGridInstance
  selectedField = ""

  error = false

  bankEdit: any;
  addressEdit: any
  fieldcode = "";

  dataentity: []
  columnDefinitionsentity: Column[] = []
  gridOptionsentity: GridOption = {}
  gridObjentity: any
  angularGridentity: AngularGridInstance

  datacode: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  
   // grid options
   mvangularGrid: AngularGridInstance;
   mvgrid: any;
   mvgridService: GridService;
   mvdataView: any;
   mvcolumnDefinitions: Column[];
   mvgridOptions: GridOption;
   mvdataset: any[];

  // selects
  ad_city: any[] = []
  ad_state: any[] = []
  ad_country: any[] = []
  bk_type: any[] = []
  bk_shipvia: any[] = []
  bk_promo: any[] = []
  bk_lang: any[] = []
  ad_tax_zone: any[] = []
  ad_tax_usage: any[] = []
  row_number;
  title: String = 'Modifier Fournisseur - '
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
    * @param bankService: bankService
    * @param cdr: ChangeDetectorRef
    * 

    */
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
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
      private bankService: BankService,
      private entityService: EntityService,
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
          
      
     
  }

  /**
    * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
    */

  /**
    * On init
    */
   mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.bankService.getOne(id).subscribe((response: any)=>{
         console.log(response.data)
          this.bankEdit = response.data.bank
            this.addressEdit = response.data.bank.address
            this.mvdataset = response.data.details;
            console.log(this.bankEdit)
            console.log(this.addressEdit)
          this.init()
          window.onload = () => {
            const style = getComputedStyle(document.getElementById("kt_header"))
            this.headerMargin = parseInt(style.height, 0)
        }
          this.loadingSubject.next(false)
          this.title = this.title + this.bankEdit.bk_code
          })

        })
        this.initmvGrid()
  
  }

  init() {
    this.createAddressForm()
    this.createBankForm()
    this.loadingSubject.next(false)
}

initmvGrid() {
  const httpHeaders = this.httpUtils.getHTTPHeaders()
  this.mvcolumnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.mvangularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    },
    {
      id: "bkd_pay_method",
      name: "Ré",
      field: "bkd_pay_method",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.singleSelect,

        // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
        enableRenderHtml: true,
        collectionAsync:  this.http.get(`${API_URL}/check`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
     /*   customStructure: {    
          value: 'code_value',
          label: 'code_cmmt',
          optionLabel: 'code_value', // if selected text is too long, we can use option labels instead
          //labelSuffix: 'text',
       },*/
        editorOptions: {
          maxHeight: 400
        }
      },
    },
    {
      id: "bkd_module",
      name: "MO",
      field: "bkd_module",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.singleSelect,

        // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
        enableRenderHtml: true,
        collectionAsync:  this.http.get(`${API_URL}/module`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
    
       
      },
    },
    {
      id: "bkd_from_ck",
      name: "DE",
      field: "bkd_from_ck",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.integer,
      editor: {
        model: Editors.integer,
      },
    },
    {
      id: "bkd_to_ck",
      name: "A",
      field: "bkd_to_ck",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.integer,
      editor: {
        model: Editors.integer,
      },
    },
    {
      id: "bkd_next_ck",
      name: "Suivant",
      field: "bkd_next_ck",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.integer,
      editor: {
        model: Editors.integer,
      },
    },
    {
      id: "bkd_draft",
      name: "Effet",
      field: "bkd_draft",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.boolean,
      editor: {
        model: Editors.checkbox
      },
      formatter: Formatters.checkmark,
      cannotTriggerInsert: false,
    },
    {
      id: "bkd_pip_acct",
      name: "PIP Acct",
      field: "bkd_pip_acct",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "mvid",
      field: "cmvid",
      excludeFromHeaderMenu: true,
      formatter: Formatters.infoIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        this.row_number = args.row;
        let element: HTMLElement = document.getElementById(
          "openItemsGrid"
        ) as HTMLElement;
        element.click();
      },
    },

    {
      id: "bkd_pip_sub",
      name: "PIP Sous CPT",
      field: "bkd_pip_sub",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "mvid",
      field: "cmvid",
      excludeFromHeaderMenu: true,
      formatter: Formatters.infoIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        this.row_number = args.row;
        let element: HTMLElement = document.getElementById(
          "openItemsGrid"
        ) as HTMLElement;
        element.click();
      },
    },
    {
      id: "bkd_pip_cc",
      name: "PIP CC",
      field: "bkd_pip_cc",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "mvid",
      field: "cmvid",
      excludeFromHeaderMenu: true,
      formatter: Formatters.infoIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        this.row_number = args.row;
        let element: HTMLElement = document.getElementById(
          "openItemsGrid"
        ) as HTMLElement;
        element.click();
      },
    },
    {
      id: "bkd_dy_code",
      name: "Journal",
      field: "bkd_dy_code",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "mvid",
      field: "cmvid",
      excludeFromHeaderMenu: true,
      formatter: Formatters.infoIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        this.row_number = args.row;
        let element: HTMLElement = document.getElementById(
          "openItemsGrid"
        ) as HTMLElement;
        element.click();
      },
    },

  ];

  this.mvgridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };

  
}
addNewItem() {
  const newId = this.mvdataset.length+1;

  const newItem = {
    id: newId,
    bkd_pay_method: "",
    bkd_module: "",
    bkd_from_ck: 0,
    bkd_to_ck: 0,
    bkd_next_ck: 0,
    bkd_draft: false,
    bkd_pip_acct: "",
    bkd_pip_sub: "",
    bkd_pip_cc: "",


  };
  this.mvgridService.addItem(newItem, { position: "bottom" });
}

createAddressForm() {
  this.loadingSubject.next(false)
  this.addressForm = this.formBuilder.group({
      ad_addr: [{ value: this.addressEdit.ad_addr,  disabled: !this.isExist}],
      ad_name: [ this.addressEdit.ad_name, Validators.required],
      ad_line1:  [ this.addressEdit.ad_line1, Validators.required],
      ad_city: [ this.addressEdit.ad_city ],
      ad_state: [ this.addressEdit.ad_state ],
      ad_zip: [ this.addressEdit.ad_zip ],
      ad_country: [ this.addressEdit.ad_country ],
      ad_temp: [ this.addressEdit.ad_temp ],
      ad_phone: [ this.addressEdit.ad_phone ],
      ad_phone2: [ this.addressEdit.ad_phone ],
      ad_ext: [ this.addressEdit.ad_ext ],
      ad_ext2: [ this.addressEdit.ad_ext2 ],
      ad_fax: [ this.addressEdit.ad_fax ],
      ad_fax2: [ this.addressEdit.ad_fax2 ],
      ad_attn: [ this.addressEdit.ad_attn ],
      ad_attn2: [ this.addressEdit.ad_attn2 ],
      
     
  })
}
createBankForm() {
  this.loadingSubject.next(false)
  this.bankForm = this.formBuilder.group({
    
    bk_check: [ this.bankEdit.bk_check ],
    bk_curr: [ this.bankEdit.bk_curr ],
    bk_entity: [ this.bankEdit.bk_entity ],
  
    bk_bk_acct1: [ this.bankEdit.bk_bk_acct1 ],
    bk_bk_acct2: [ this.bankEdit.bk_bk_acct2 ],
    bk_acct: [ this.bankEdit.bk_acct ],
    bk_sub: [ this.bankEdit.bk_sub ],
    bk_cc: [ this.bankEdit.bk_cc ],
   
    bk_pip_acct: [ this.bankEdit.bk_pip_acct ],
    bk_pip_sub: [ this.bankEdit.bk_pip_sub ],
    bk_pip_cc: [ this.bankEdit.bk_pip_cc ],

    


    bk_dftar_acct: [ this.bankEdit.bk_dftar_acct ],
    bk_dftar_sub: [ this.bankEdit.bk_dftar_sub ],
    bk_dftar_cc: [ this.bankEdit.bk_dftar_cc ],
    
    bk_bkchg_acct: [ this.bankEdit.bk_bkchg_acct ],
    bk_bkchg_sub: [ this.bankEdit.bk_bkchg_sub ],
    bk_bkchg_cc: [ this.bankEdit.bk_bkchg_cc ],

    bk_disc_acct: [ this.bankEdit.bk_disc_acct ],
    bk_disc_sub: [ this.bankEdit.bk_disc_sub ],
    bk_disc_cc: [ this.bankEdit.bk_disc_cc ],

    bk_ddft_acct: [ this.bankEdit.bk_ddft_acct ],
    bk_ddft_sub: [ this.bankEdit.bk_ddft_sub ],
    bk_ddft_cc: [ this.bankEdit.bk_ddft_cc ],

    bk_dftap_acct: [ this.bankEdit.bk_dftap_acct ],
    bk_dftap_sub: [ this.bankEdit.bk_dftap_sub ],
    bk_dftap_cc: [ this.bankEdit.bk_dftap_cc ],
    
    bk_bktx_acct: [ this.bankEdit.bk_bktx_acct ],
    bk_bktx_sub: [ this.bankEdit.bk_bktx_sub ],
    bk_bktx_cc: [ this.bankEdit.bk_bktx_cc ],
    

    bk_cdft_acct: [ this.bankEdit.bk_cdft_acct ],
    bk_cdft_sub: [ this.bankEdit.bk_cdft_sub ],
    bk_cdft_cc: [ this.bankEdit.bk_cdft_cc ],
     

    bk_edft_acct: [ this.bankEdit.bk_edft_acct ],
    bk_edft_sub: [ this.bankEdit.bk_edft_sub ],
    bk_edft_cc: [ this.bankEdit.bk_edft_cc ],
     


  })
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
  const url = `/banks`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

goBackWithoutId() {
  this.router.navigateByUrl("/banks", {
      relativeTo: this.activatedRoute,
  })
}


/**
* Reset
*/
reset() {
  this.address = new Address()
  this.bank = new Bank()
  this.createAddressForm()
  this.createBankForm()
  this.hasFormErrors = false
  this.hasbankFormErrors = false
}

/**
* Save data
*
* @param withBack: boolean
*/
onSubmit() {
  this.hasFormErrors = false
  const controls = this.addressForm.controls
  const controls_ = this.bankForm.controls
  /** check form */
  if (this.addressForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      this.selectedTab = 0
      return
  }
  if (this.bankForm.invalid) {
      Object.keys(controls_).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasbankFormErrors = true
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
  const controls1 = this.bankForm.controls

  const _address = new Address()
  
  _address.ad_addr = controls.ad_addr.value
  _address.ad_name = controls.ad_name.value
  _address.ad_line1 = controls.ad_line1.value
  _address.ad_city = controls.ad_city.value
  _address.ad_state = controls.ad_state.value
  _address.ad_zip = controls.ad_zip.value
  _address.ad_country = controls.ad_country.value
  _address.ad_type = "bank"
  _address.ad_phone = controls.ad_phone.value
  _address.ad_phone2 = controls.ad_phone2.value
  _address.ad_ext = controls.ad_ext.value
  _address.ad_ext2 = controls.ad_ext2.value
  _address.ad_fax = controls.ad_fax.value
  _address.ad_fax2 = controls.ad_fax2.value
  _address.ad_attn = controls.ad_attn.value
  _address.ad_attn2 = controls.ad_attn2.value
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
          let bank = this.prepareBank()
          for (let data of this.mvdataset) {
            delete data.id;
            delete data.cmvid;
          }
          this.addBank(bank, this.mvdataset)
      }
  )
}

/**
* Returns object for saving
*/
prepareBank(): Bank {
  const controls = this.bankForm.controls
  const controls1 = this.addressForm.controls
  const _bank = new Bank()
  _bank.bk_code = controls1.ad_addr.value
  _bank.bk_desc = controls1.ad_name.value
  _bank.bk_curr = controls.bk_curr.value
  _bank.bk_entity = controls.bk_entity.value
  _bank.bk_check = controls.bk_check.value
  
  _bank.bk_bk_acct1 = controls.bk_bk_acct1.value
  _bank.bk_bk_acct2 = controls.bk_bk_acct2.value

  _bank.bk_acct = controls.bk_acct.value
  _bank.bk_sub  = controls.bk_sub.value
  _bank.bk_cc   = controls.bk_cc.value

  _bank.bk_pip_acct = controls.bk_pip_acct.value
  _bank.bk_pip_sub  = controls.bk_pip_sub.value
  _bank.bk_pip_cc   = controls.bk_pip_cc.value

  _bank.bk_dftar_acct =  controls.bk_dftar_acct.value
  _bank.bk_dftar_sub =  controls.bk_dftar_sub.value
  _bank.bk_dftar_cc =  controls.bk_dftar_cc.value
  _bank.bk_bkchg_acct = controls.bk_bkchg_acct.value
  _bank.bk_bkchg_sub = controls.bk_bkchg_sub.value
  _bank.bk_bkchg_cc = controls.bk_bkchg_cc.value
  _bank.bk_disc_acct = controls.bk_disc_acct.value
  _bank.bk_disc_sub = controls.bk_disc_sub.value
  _bank.bk_disc_cc = controls.bk_disc_cc.value
  _bank.bk_ddft_acct = controls.bk_ddft_acct.value
  _bank.bk_ddft_sub = controls.bk_ddft_sub.value
  _bank.bk_ddft_cc = controls.bk_ddft_cc.value
  _bank.bk_dftap_acct = controls.bk_dftap_acct.value
  _bank.bk_dftap_sub = controls.bk_dftap_sub.value
  _bank.bk_dftap_cc = controls.bk_dftap_cc.value
  _bank.bk_bktx_acct = controls.bk_bktx_acct.value
  _bank.bk_bktx_sub = controls.bk_bktx_sub.value
  _bank.bk_bktx_cc = controls.bk_bktx_cc.value
  _bank.bk_cdft_acct = controls.bk_cdft_acct.value
  _bank.bk_cdft_sub = controls.bk_cdft_sub.value
  _bank.bk_cdft_cc = controls.bk_cdft_cc.value
  _bank.bk_edft_acct = controls.bk_edft_acct.value
  _bank.bk_edft_sub = controls.bk_edft_sub.value
  _bank.bk_edft_cc = controls.bk_edft_cc.value

  return _bank
}

/**
* Add product
*
* @param _product: ProductModel
*/
addBank(_bank: Bank, details: any) {
  this.loadingSubject.next(true)
  this.bankService.update({bank: _bank, details: details}, this.bankEdit.id).subscribe(
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
          this.router.navigateByUrl("/accounting-setting/bank-list")
      }
  )
}

getComponentTitle() {
  let result = "Ajouter Banque"
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


changeAcct (field){

  const controls1 = this.bankForm.controls 
  let ac_code : any
  if (field=="bk_acct") {
      ac_code  = controls1.bk_acct.value
  
  }
  if (field=="bk_bk_acct1") {
    ac_code  = controls1.bk_bk_acct1.value

  }
  if (field=="bk_bk_acct2") {
    ac_code  = controls1.bk_bk_acct2.value

  }
  if (field=="bk_pip_acct") {
    ac_code  = controls1.bk_pip_acct.value

  }
  if (field=="bk_dftar_acct") {
    ac_code  = controls1.bk_dftar_acct.value

  }
  if (field=="bk_bkchg_acct") {
    ac_code  = controls1.bk_bkchg_acct.value

  }
  if (field=="bk_disc_acct") {
    ac_code  = controls1.bk_disc_acct.value

  }
  if (field=="bk_ddft_acct") {
    ac_code  = controls1.bk_ddft_acct.value

  }
  if (field=="bk_dftap_acct") {
    ac_code  = controls1.bk_dftap_acct.value

  }
  if (field=="bk_bktx_acct") {
    ac_code  = controls1.bk_bktx_acct.value

  }
  if (field=="bk_cdft_acct") {
    ac_code  = controls1.bk_cdft_acct.value

  }
  if (field=="bk_edft_acct") {
    ac_code  = controls1.bk_edft_acct.value

  }
  
this.accountService.getBy({ac_code}).subscribe((res:any)=>{
    const {data} = res
    console.log(res)
    if (!data){ this.layoutUtilsService.showActionNotification(
        "ce compte n'existe pas!",
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



handleSelectedRowsChanged3(e, args) {
  const controls1 = this.bankForm.controls
  

  if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
          const item = this.gridObj3.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedField) {
              
            case "bk_acct": {
                controls1.bk_acct.setValue(item.ac_code || "")
                break
            }
            case "bk_bk_acct1": {
              controls1.bk_bk_acct1.setValue(item.ac_code || "")
              break
            }
            case "bk_bk_acct2": {
            controls1.bk_bk_acct2.setValue(item.ac_code || "")
            break
            }
            case "bk_pip_acct": {
              controls1.bk_pip_acct.setValue(item.ac_code || "")
              break
            }
            case "bk_pip_acct": {
              controls1.bk_pip_acct.setValue(item.ac_code || "")
              break
            }

            case "bk_dftar_acct": {
              controls1.bk_dftar_acct.setValue(item.ac_code || "")
              break
            }

            case "bk_bkchg_acct": {
              controls1.bk_bkchg_acct.setValue(item.ac_code || "")
              break
            }
            case "bk_disc_acct": {
              controls1.bk_disc_acct.setValue(item.ac_code || "")
              break
            }
            case "bk_ddft_acct": {
              controls1.bk_ddft_acct.setValue(item.ac_code || "")
              break
            }

            case "bk_dftap_acct": {
              controls1.bk_dftap_acct.setValue(item.ac_code || "")
              break
            }
            case "bk_bktx_acct": {
              controls1.bk_bktx_acct.setValue(item.ac_code || "")
              break
            }
            case "bk_cdft_acct": {
              controls1.bk_cdft_acct.setValue(item.ac_code || "")
              break
            }
            case "bk_edft_acct": {
              controls1.bk_edft_acct.setValue(item.ac_code || "")
              break
            }
            default:
            break
          }
      })
  }
}
angularGridReady3(angularGrid: AngularGridInstance) {
  this.angularGrid3 = angularGrid
  this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3() {
  this.columnDefinitions3 = [
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
          id: "ac_code",
          name: "Compte",
          field: "ac_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ac_desc",
          name: "Designation",
          field: "ac_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ac_type",
          name: "Type",
          field: "ac_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "ac_curr",
        name: "Devise",
        field: "ac_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ac_stat_acc",
        name: "Compte Statique",
        field: "ac_stat_acc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

  ]

  this.gridOptions3 = {
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
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.accountService
      .getAll()
      .subscribe((response: any) => (this.data = response.data))
}
open3(content, field) {
  this.selectedField = field
  this.prepareGrid3()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedentity(e, args) {
  const controls = this.bankForm.controls
  if (Array.isArray(args.rows) && this.gridObjentity) {
      args.rows.map((idx) => {
          const item = this.gridObjentity.getDataItem(idx)
          controls.bk_entity.setValue(item.en_entity || "")
      })
  }
}

angularGridReadyentity(angularGrid: AngularGridInstance) {
  this.angularGridentity = angularGrid
  this.gridObjentity = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridentity() {
  this.columnDefinitionsentity = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "en_entity",
          name: "code ",
          field: "en_entity",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "en_name",
        name: "Désignation ",
        field: "en_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
          id: "en_primary",
          name: "Principale",
          field: "en_primary",
          sortable: true,
          filterable: true,
          type: FieldType.boolean,
          formatter: Formatters.yesNo
      },
  ]

  this.gridOptionsentity = {
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
  this.entityService
      .getAll()
      .subscribe((response: any) => (this.dataentity = response.data))
}
openentity(contenttax) {
  this.prepareGridentity()
  this.modalService.open(contenttax, { size: "lg" })
}









handleSelectedRowsChanged2(e, args) {
  const controls = this.bankForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
      controls.bk_curr.setValue(item.cu_curr || "");
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

