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
    Glasses,
    GlassesService,
    TaxeService,
    BankService,
    SequenceService,
    Code,
    LocationService,
    SiteService,
} from "../../../../core/erp"

@Component({
  selector: 'kt-edit-glasses',
  templateUrl: './edit-glasses.component.html',
  styleUrls: ['./edit-glasses.component.scss']
})
export class EditGlassesComponent implements OnInit {

  
  private componentSubscriptions: Subscription
    // sticky portlet header margin
    private headerMargin: number

    // properties
    glasses: Glasses;
    address: Address
    addressForm: FormGroup
    form1: FormGroup
    
    provider: Provider
    codemstr: Code
    providerForm: FormGroup
    hasFormErrors = false
    hasProviderFormErrors = false
    selectedTab = 0
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    addressId$: Observable<Number>
    glassesEdit: any
    
    isExist = false
    isExist2 = false;
    isExist3 = false;

    dataloc: [];
    columnDefinitionsloc: Column[] = [];
    gridOptionsloc: GridOption = {};
    gridObjloc: any;
    angularGridloc: AngularGridInstance;

    datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

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
  title: String = 'Modifier Verre - '
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

    gls_part_type: any[] = [];
  gls_draw: any[] = [];
  gls_upc: any[] = [];
  gls_group: any[] = [];
  gls_drwg_loc: any[] = [];
  gls_drwg_size: any[] = [];
  gls_abc: any[] = [];
  gls_loc_type: any[] = [];
  gls_ship_wt_um: any[] = [];
  gls_net_wt_um: any[] = [];
  gls_fr_class: any[] = [];
  gls_size_um: any[] = [];
  gls_dsgn_grp: any[] = [];
  gls_pm_code: any[] = [];
  gls_run_seq1: any[] = [];
  gls_run_seq2: any[] = [];
  gls_promo: any[] = [];
  gls_rev: any[] = [];

  taux_taxe = 0;
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];
  
  hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;
  codeForm: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;

  datataxv: []
  columnDefinitionstaxv: Column[] = []
  gridOptionstaxv: GridOption = {}
  gridObjtaxv: any
  angularGridtaxv: AngularGridInstance

    codevalue;
  // slick grid
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];

  sequences: [];
  columnDefinitionsseq: Column[] = [];
  gridOptionsseq: GridOption = {};
  gridObjseq: any;
  angularGridseq: AngularGridInstance;

  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  dataset2: any[] = [];

  providers: [];
  columnDefinitionsprov: Column[] = [];
  gridOptionsprov: GridOption = {};
  gridObjprov: any;
  angularGridprov: AngularGridInstance;
  hasFormErrors5 = false
  hasFormErrors6 = false
  seq;
  code;
  message: String;
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
        private codeFB: FormBuilder,
        private form1FB: FormBuilder,
        public  dialog: MatDialog,
        private subheaderService: SubheaderService,
        private layoutUtilsService: LayoutUtilsService,
        private layoutConfigService: LayoutConfigService,
        private addressService: AddressService,
        private codeService: CodeService,
        private modalService: NgbModal,
        private glassesService: GlassesService,
        private providerService: ProviderService,
        private taxService: TaxeService,
        private bankService: BankService,
        private siteService: SiteService,
        private locationService: LocationService,
        
        private sequenceService: SequenceService,
        private cdr: ChangeDetectorRef,
        config: NgbDropdownConfig
    ) {
        config.autoClose = true
        
        this.codeService
        .getBy({ code_fldname: "gls_part_type" })
        .subscribe((response: any) => (this.gls_part_type = response.data));
        this.codeService
        .getBy({ code_fldname: "gls_upc" })
        .subscribe((response: any) => (this.gls_upc = response.data));  
        this.codeService
        .getBy({ code_fldname: "gls_promo" })
        .subscribe((response: any) => (this.gls_promo = response.data));  
        this.codeService
        .getBy({ code_fldname: "gls_dsgn_grp" })
        .subscribe((response: any) => (this.gls_dsgn_grp = response.data));
      
        this.codeService
        .getBy({ code_fldname: "gls_draw" })
        .subscribe((response: any) => (this.gls_draw = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_rev" })
        .subscribe((response: any) => (this.gls_rev = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_group" })
        .subscribe((response: any) => (this.gls_group = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_drwg_loc" })
        .subscribe((response: any) => (this.gls_drwg_loc = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_drwg_size" })
        .subscribe((response: any) => (this.gls_drwg_size = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_abc" })
        .subscribe((response: any) => (this.gls_abc = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_loc_type" })
        .subscribe((response: any) => (this.gls_loc_type = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_ship_wt_um" })
        .subscribe((response: any) => (this.gls_ship_wt_um = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_net_wt_um" })
        .subscribe((response: any) => (this.gls_net_wt_um = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_fr_class" })
        .subscribe((response: any) => (this.gls_fr_class = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_size_um" })
        .subscribe((response: any) => (this.gls_size_um = response.data));
  
      this.codeService
        .getBy({ code_fldname: "gls_pm_code" })
        .subscribe((response: any) => (this.gls_pm_code = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_run_seq1" })
        .subscribe((response: any) => (this.gls_run_seq1 = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_run_seq2" })
        .subscribe((response: any) => (this.gls_run_seq2 = response.data));
      this.codeService
        .getBy({ code_fldname: "gls_promo" })
        .subscribe((response: any) => (this.gls_promo = response.data));
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
          this.glassesService.getOne(id).subscribe((response: any)=>{
            this.glassesEdit = response.data.glasses
            this.taux_taxe = Number(this.glassesEdit.taxe.tx2_tax_pct)
            console.log("tax", this.taux_taxe)
            this.mvdataset = response.data.details
            console.log(this.glassesEdit)
            console.log(this.mvdataset)
            this.initCode()
          //   window.onload = () => {
          //     const style = getComputedStyle(document.getElementById("kt_header"))
          //     this.headerMargin = parseInt(style.height, 0)
          // }
            this.loadingSubject.next(false)
            this.title = this.title + this.glassesEdit.gls_part
            })

          })
          this.initmvGrid()
    }

    initCode() {
      this.createForm()
     // this.createProviderForm()
      
      this.loadingSubject.next(false)
    }
     
      createForm() {
        this.loadingSubject.next(false)
       
        this.form1 = this.form1FB.group({
         gls_part: [{value:this.glassesEdit.gls_part,disabled:true}],
         gls_desc1: [this.glassesEdit.gls_desc1 ,Validators.required],
         gls_part_type: [this.glassesEdit.gls_part_type,Validators.required],
         gls_upc: [this.glassesEdit.gls_upc],
         gls_promo: [this.glassesEdit.gls_promo],
         
         gls_draw: [this.glassesEdit.gls_draw,Validators.required],
         gls_vend: [this.glassesEdit.gls_vend],
         gls_rev: [ this.glassesEdit.gls_rev,Validators.required ], 
         gls_dsgn_grp: [this.glassesEdit.gls_dsgn_grp],
         gls_group: [this.glassesEdit.gls_group],
         gls_size: [this.glassesEdit.gls_size],
         gls_net_wt: [this.glassesEdit.gls_net_wt],
         gls_abc: [this.glassesEdit.gls_abc,Validators.required],
         gls_site: [this.glassesEdit.gls_site,Validators.required],
         gls_loc: [this.glassesEdit.gls_loc,Validators.required],
         gls_lot_ser: [this.glassesEdit.gls_lot_ser],
         gls_article: [this.glassesEdit.gls_article],
         gls_taxable: [this.glassesEdit.gls_taxable],
         gls_taxc: [this.glassesEdit.gls_taxc,Validators.required],
            
        })
    }
    // createProviderForm() {
    //   this.loadingSubject.next(false)
     
    //     this.providerForm = this.formBuilder.group({
    //        // vd_sort: [this.glassesEdit.vd_sort ],
    //         vd_type: [this.glassesEdit.vd_type ],
           
    //         //vd_shipvia: [this.glassesEdit.vd_shipvia],
    //         vd_bank: [this.glassesEdit.vd_bank ],
    //         //vd_ckfrm: [this.glassesEdit.vd_ckfrm ],
    //         //vd_curr: [this.glassesEdit.vd_curr ],
    //         //vd_lang: [this.glassesEdit.vd_lang ],
    //         //vd_pur_cntct: [this.glassesEdit.vd_pur_cntct],
    //         //vd_ap_cntct: [this.glassesEdit.vd_ap_cntct ],
    //         //vd_misc_cr: [this.glassesEdit.vd_misc_cr ],
    //         // vd_kanban_supplier: [this.glassesEdit.vd_kanban_supplier],
    //         vd_cr_terms: [this.glassesEdit.vd_cr_terms ],
    //         // vd_disc_pct: [this.glassesEdit.vd_disc_pct ],
    //         // vd_prepay: [this.glassesEdit.vd_prepay ],
    //         // vd_debtor: [this.glassesEdit.vd_debtor ],
    //         // vd_partial: [this.glassesEdit.vd_partial],
    //         // vd_hold: [this.glassesEdit.vd_hold ],
    //         // vd_pay_spec: [this.glassesEdit.vd_pay_spec],
    //         // vd_db: [this.glassesEdit.vd_db ],
    //     })
    // }
    changeRadio(e) {
      console.log(e.target.value);
      console.log("here")
    }
    mvGridReady(angularGrid: AngularGridInstance) {
      this.mvangularGrid = angularGrid;
      this.mvdataView = angularGrid.dataView;
      this.mvgrid = angularGrid.slickGrid;
      this.mvgridService = angularGrid.gridService;
    }
    initmvGrid() {
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
          id: "glsd_sph_min",
          name: "Sphere Min",
          field: "glsd_sph_min",
          sortable: true,
          width: 10,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.float,
          },
        },
        {
          id: "glsd_sph_max",
          name: "Sphere Max",
          field: "glsd_sph_max",
          sortable: true,
          width: 10,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.float,
          },
        },
        {
          id: "glsd_cyl_min",
          name: "Cylindre Min",
          field: "glsd_cyl_min",
          sortable: true,
          width: 10,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.float,
          },
        },
        {
          id: "glsd_cyl_max",
          name: "Cylindre Max",
          field: "glsd_cyl_max",
          sortable: true,
          width: 10,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.float,
          },
        },
        {
          id: "glsd_add_min",
          name: "Addition Min",
          field: "glsd_add_min",
          sortable: true,
          width: 10,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.float,
          },
        },
        {
          id: "glsd_add_max",
          name: "Addition Max",
          field: "glsd_add_max",
          sortable: true,
          width: 20,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.float,
          },
        },
        {
          id: "glsd_pur_price",
          name: "Prix d'achat",
          field: "glsd_pur_price",
          sortable: true,
          width: 30,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.float,
          },
          onCellChange: (e: Event, args: OnEventArgs) => {
            console.log(args.dataContext.glsd_marge)
            this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , glsd_price:Number(args.dataContext.glsd_pur_price) * (100 + Number(args.dataContext.glsd_marge)) / 100 , glsd_sales_price: ( Number(args.dataContext.glsd_pur_price) * (100 + Number(args.dataContext.glsd_marge)) / 100)* (100+ Number(this.taux_taxe)) / 100 })
  
          }
        },
        {
          id: "glsd_marge",
          name: "Marge",
          field: "glsd_marge",
          sortable: true,
          width: 30,
          filterable: false,
          type: FieldType.float,
          editor: {
            model: Editors.float,
          },
          onCellChange: (e: Event, args: OnEventArgs) => {
            console.log(args.dataContext.glsd_marge)
            this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , glsd_price:Number(args.dataContext.glsd_pur_price) * (100 + Number(args.dataContext.glsd_marge)) / 100 , glsd_sales_price: ( Number(args.dataContext.glsd_pur_price) * (100 + Number(args.dataContext.glsd_marge)) / 100)* (100+ Number(this.taux_taxe)) / 100 })
  
          }
        },
        {
          id: "glsd_price",
          name: "Prix ",
          field: "glsd_price",
          sortable: true,
          width: 30,
          filterable: false,
          type: FieldType.float,
          
        },
        {
          id: "glsd_sales_price",
          name: "Prix TTC",
          field: "glsd_sales_price",
          sortable: true,
          width: 30,
          filterable: false,
          type: FieldType.float,
          
        },
      ];
  
      this.mvgridOptions = {
       
        asyncEditorLoading: false,
        editable: true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        autoHeight: true,
        enableAutoResize:true,
        autoCommitEdit:true,
        autoEdit:true,
        formatterOptions: {
          
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: true,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
     
    };
  
      this.mvdataset = [];
    }
    addNewItem() {
      const newId = this.mvdataset.length+1;
  
      const newItem = {
        id: newId,
        glsd_sph_min: null,
        glsd_sph_max: null,
        glsd_cyl_min: null,
        glsd_cyl_max: null,
        glsd_add_min: null,
        glsd_add_max: null,
        glsd_pur_price: 0,
        glsd_marge: 0,
        glsd_price:0,
        glsd_sales_price: 0,
        
      };
      this.mvgridService.addItem(newItem, { position: "bottom" });
    }
  

    onChangeState() {
      const controls  = this.form1.controls
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
      const url = `/articles-list`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  changeSite() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const si_site = controls.gls_site.value;
    this.siteService.getBy({ si_site }).subscribe(
      (res: any) => {
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce Site n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  changeProvider() {
    const controls = this.form3.controls; // chof le champs hada wesh men form rah
    const vd_addr = controls.gls_vend.value;
    this.providerService.getBy({ vd_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce fournisseur n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  changeLoc() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const loc_loc = controls.gls_loc.value;
    const loc_site = controls.gls_site.value;

    this.locationService.getBy({ loc_loc, loc_site }).subscribe(
      (res: any) => {
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cet Emplacement n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  goBackWithoutId() {
      this.router.navigateByUrl("/articles-list", {
          relativeTo: this.activatedRoute,
      })
  }

  /**
   * Reset
   */
  reset() {
      this.glasses = new Glasses()
      this.createForm()
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
      const controls = this.form1.controls
  //    const controls_ = this.providerForm.controls
      /** check form */
      if (this.form1.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
       //   this.selectedTab = 0
          return
      }
    
      let item = this.prepareItem()
      for (let data of this.mvdataset) {
        delete data.id;
        delete data.cmvid;
      }
      console.log("herrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
      this.addItem(item, this.mvdataset)
  }

  /**
     * Add product
     *
     * @param _provider: ProductModel
     */
    



  /**
     * Add product
     *
     * @param _glasses: ProductModel
     */
   addItem(_glasses: Glasses, details: any) {
    this.loadingSubject.next(true)
    this.glassesService.update(this.glassesEdit.id,{glasses:_glasses, details}).subscribe(
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
            this.router.navigateByUrl("articles/list-glasses")
        }
    )
  }

  prepareItem(): Glasses {
    const controls1 = this.form1.controls;
    //const controls2 = this.form2.controls;
    //const controls3 = this.form3.controls;
    //const controls4 = this.form4.controls;
    const _glasses = new Glasses();
    
    _glasses.id = this.glassesEdit.id;
    _glasses.gls_part = this.glassesEdit.gls_part;
    _glasses.gls_desc1 = controls1.gls_desc1.value;
    _glasses.gls_um = "UN";
   // _glasses.gls_prod_line = controls1.gls_prod_line.value;
   //console.log(controls1.SM.value, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
   //if (controls1.SM.value == true) { rev = "M"} else { if(controls1.SF.value == true) { rev = "F"} else {rev = "RX"}}
    _glasses.gls_part_type = controls1.gls_part_type.value;
    _glasses.gls_draw = controls1.gls_draw.value;
    _glasses.gls_status = "pf-actif";
    
    _glasses.gls_vend = controls1.gls_vend.value;
    _glasses.gls_dsgn_grp = controls1.gls_dsgn_grp.value;
    _glasses.gls_group = controls1.gls_group.value;
    _glasses.gls_rev = controls1.gls_rev.value;
    _glasses.gls_promo = controls1.gls_promo.value;
    _glasses.gls_upc = controls1.gls_upc.value;
    _glasses.gls_abc = controls1.gls_abc.value;
    
    _glasses.gls_lot_ser = controls1.gls_lot_ser.value;
    _glasses.gls_site = controls1.gls_site.value;
    _glasses.gls_loc = controls1.gls_loc.value;
    _glasses.gls_article = controls1.gls_article.value;
    _glasses.gls_net_wt = controls1.gls_net_wt.value;
    _glasses.gls_size = controls1.gls_size.value;
    _glasses.gls_taxable = controls1.gls_taxable.value;
    _glasses.gls_taxc = controls1.gls_taxc.value;

    return _glasses;
  }


onAlertClose($event) {
  this.hasFormErrors = false
}

changedesc(){
  const controls1 = this.form1.controls;
 var descpromo = ""
  for(let data of this.gls_promo) {
   if (data.code_value == controls1.gls_promo.value) {
     descpromo = data.code_cmmt
   }
   var descupc = ""

   for (let dat of this.gls_upc) {
    if (dat.code_value == controls1.gls_upc.value) {
      descupc = dat.code_cmmt
    }

   }
var ind = ""
   if(controls1.gls_net_wt.value != null) {ind = String(controls1.gls_net_wt.value) }
  var  desc = ind + " " + descpromo + " " + descupc
  controls1.gls_desc1.setValue(desc)
 } 

  controls1.gls_desc1.setValue(controls1.gls_desc1.value + " " +  descpromo)


}


handleSelectedRowsChangedtax(e, args) {
  const controls = this.form1.controls
  if (Array.isArray(args.rows) && this.gridObjtax) {
      args.rows.map((idx) => {
          const item = this.gridObjtax.getDataItem(idx)
          controls.gls_taxc.setValue(item.tx2_tax_code || "")
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


handleSelectedRowsChangedprov(e, args) {
  const controls = this.form1.controls;
  if (Array.isArray(args.rows) && this.gridObjprov) {
    args.rows.map((idx) => {
      const item = this.gridObjprov.getDataItem(idx);
      controls.gls_vend.setValue(item.vd_addr || "");
    });
  }
}

angularGridReadyprov(angularGrid: AngularGridInstance) {
  this.angularGridprov = angularGrid;
  this.gridObjprov = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridprov() {
  this.columnDefinitionsprov = [
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
      id: "vd_addr",
      name: "code",
      field: "vd_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Fournisseur",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "vd_type",
      name: "Type",
      field: "vd_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsprov = {
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
  this.providerService
    .getAll()
    .subscribe((response: any) => (this.providers = response.data));
}
openprov(content) {
  this.prepareGridprov();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedtaxv(e, args) {
  const controls = this.addressForm.controls
  if (Array.isArray(args.rows) && this.gridObjtaxv) {
      args.rows.map((idx) => {
          const item = this.gridObjtaxv.getDataItem(idx)
          controls.ad_taxc.setValue(item.tx2_tax_code || "")
      })
  }
}

angularGridReadytaxv(angularGrid: AngularGridInstance) {
  this.angularGridtaxv = angularGrid
  this.gridObjtaxv = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridtaxv() {
  this.columnDefinitionstaxv = [
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

  this.gridOptionstaxv = {
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
      .subscribe((response: any) => (this.datataxv = response.data))
}
opentaxv(contenttax) {
  this.prepareGridtaxv()
  this.modalService.open(contenttax, { size: "lg" })
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
angularGridReadyloc(angularGrid: AngularGridInstance) {
  this.angularGridloc = angularGrid;
  this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridloc() {
  const controls1 = this.form1.controls;
  this.columnDefinitionsloc = [
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
      id: "loc_loc",
      name: "loc",
      field: "loc_loc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "loc_desc",
      name: "Designation",
      field: "loc_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsloc = {
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
  this.locationService
    .getBy({ loc_site: controls1.gls_site.value })
    .subscribe((response: any) => (this.dataloc = response.data));
}
openloc(contentloc, field) {
  this.selectedField = field;
  this.prepareGridloc();
  this.modalService.open(contentloc, { size: "lg" });
}
handleSelectedRowsChangedsite(e, args) {
  const controls1 = this.form1.controls;
 // const controls2 = this.form2.controls;
 // const controls3 = this.form3.controls;
 // const controls4 = this.form4.controls;

  if (Array.isArray(args.rows) && this.gridObjsite) {
    args.rows.map((idx) => {
      const item = this.gridObjsite.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "gls_site": {
          controls1.gls_site.setValue(item.si_site || "");
          break;
        }
   /*     case "gls_po_site": {
          controls3.gls_po_site.setValue(item.si_site || "");
          break;
        }*/
        default:
          break;
      }
    });
  }
}
/* handleSelectedRowsChangedpl(e, args) {
  const controls1 = this.form1.controls;
  if (Array.isArray(args.rows) && this.gridObjpl) {
    args.rows.map((idx) => {
      const item = this.gridObjpl.getDataItem(idx);
      controls1.gls_prod_line.setValue(item.pl_prod_line || "");
    });
  }
}*/
handleSelectedRowsChangedloc(e, args) {
  const controls1 = this.form1.controls;

  if (Array.isArray(args.rows) && this.gridObjloc) {
    args.rows.map((idx) => {
      const item = this.gridObjloc.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "gls_loc": {
          controls1.gls_loc.setValue(item.loc_loc || "");
          break;
        }
        default:
          break;
      }
    });
  }
}

createCodeForm() {
  this.loadingSubject.next(false)

  this.codemstr = new Code()
  this.codeForm = this.codeFB.group({
      code_value: [this.codemstr.code_value, Validators.required],
      code_cmmt: [
          { value: this.codemstr.code_cmmt, disabled: !this.isExist3 },
          Validators.required,
      ],
     })
}
onChangeCodemstr(field) {
  const controls = this.codeForm.controls
  this.codeService
      .getBy({
          code_value: controls.code_value.value,
          code_fldname: field,
      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist3 = true
              console.log(response.data.length)
          } else {
              controls.code_cmmt.enable()
           }
      })
}

opencode(content, field) {
  this.createCodeForm()
  this.selectedField = field;
this.fieldcode = field;
  this.modalService.open(content, { size: "lg" });
}


onSubmitCode() {
  this.hasFormErrors = false
  const controls = this.codeForm.controls
  const controls1 = this.form1.controls
  /** check form */
  if (this.codeForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let codemstr = this.prepareCode()
  this.addCode(codemstr)
  switch (this.selectedField) {
    case "gls_draw": {
      controls1.gls_draw.setValue(this.codevalue || "");
      break;
    }
    case "gls_dsgn_grp": {
      controls1.gls_dsgn_grp.setValue(this.codevalue || "");
      break;
    }
    case "gls_group": {
      controls1.gls_group.setValue(this.codevalue || "");
      break;
    }
    case "gls_upc": {
      controls1.gls_upc.setValue(this.codevalue || "");
      break;
    }
    default:
      break;
  }

}
/**
* Returns object for saving
*/
prepareCode(): Code {
  const controls = this.codeForm.controls
  this.codevalue = controls.code_value.value
  const _code = new Code()
  console.log(this.fieldcode)
  _code.code_fldname = this.fieldcode
  _code.code_value = controls.code_value.value
 
  _code.code_cmmt = controls.code_cmmt.value
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
              500,
              true,
              true
          )
          this.loadingSubject.next(false)
          // this.router.navigateByUrl("/code-mstr/codes-list")
         
      }
     
  )
  this.listcode();
}
listcode (){
  this.codeService
  .getBy({ code_fldname: "gls_part_type" })
  .subscribe((response: any) => (this.gls_part_type = response.data));
  this.codeService
  .getBy({ code_fldname: "gls_upc" })
  .subscribe((response: any) => (this.gls_upc = response.data));  
  
  this.codeService
  .getBy({ code_fldname: "gls_dsgn_grp" })
  .subscribe((response: any) => (this.gls_dsgn_grp = response.data));

  this.codeService
  .getBy({ code_fldname: "gls_draw" })
  .subscribe((response: any) => (this.gls_draw = response.data));
this.codeService
  .getBy({ code_fldname: "gls_rev" })
  .subscribe((response: any) => (this.gls_rev = response.data));
this.codeService
  .getBy({ code_fldname: "gls_group" })
  .subscribe((response: any) => (this.gls_group = response.data));
this.codeService
  .getBy({ code_fldname: "gls_drwg_loc" })
  .subscribe((response: any) => (this.gls_drwg_loc = response.data));
this.codeService
  .getBy({ code_fldname: "gls_drwg_size" })
  .subscribe((response: any) => (this.gls_drwg_size = response.data));
this.codeService
  .getBy({ code_fldname: "gls_abc" })
  .subscribe((response: any) => (this.gls_abc = response.data));
this.codeService
  .getBy({ code_fldname: "gls_loc_type" })
  .subscribe((response: any) => (this.gls_loc_type = response.data));
this.codeService
  .getBy({ code_fldname: "gls_ship_wt_um" })
  .subscribe((response: any) => (this.gls_ship_wt_um = response.data));
this.codeService
  .getBy({ code_fldname: "gls_net_wt_um" })
  .subscribe((response: any) => (this.gls_net_wt_um = response.data));
this.codeService
  .getBy({ code_fldname: "gls_fr_class" })
  .subscribe((response: any) => (this.gls_fr_class = response.data));
this.codeService
  .getBy({ code_fldname: "gls_size_um" })
  .subscribe((response: any) => (this.gls_size_um = response.data));

this.codeService
  .getBy({ code_fldname: "gls_pm_code" })
  .subscribe((response: any) => (this.gls_pm_code = response.data));
this.codeService
  .getBy({ code_fldname: "gls_run_seq1" })
  .subscribe((response: any) => (this.gls_run_seq1 = response.data));
this.codeService
  .getBy({ code_fldname: "gls_run_seq2" })
  .subscribe((response: any) => (this.gls_run_seq2 = response.data));
this.codeService
  .getBy({ code_fldname: "gls_promo" })
  .subscribe((response: any) => (this.gls_promo = response.data));

}


openvendor(content) {
  this.createAddressForm()
  this.modalService.open(content, { size: "lg" });
}


onSubmitVendor() {
  this.hasFormErrors5 = false
  const controls = this.addressForm.controls
  const controls1 = this.form1.controls
  /** check form */
  if (this.addressForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors5 = true
     
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
          this.hasFormErrors6 = true;
          return;
     
        
        },
        )
        
      
        let address = this.prepareAddress()
        this.addAddress(address)
        controls1.gls_vend.setValue(this.code)
    
    
}else {
  this.message = "Parametrage Monquant pour la sequence";
  this.hasFormErrors6 = true;
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
      }
  )
}

createAddressForm() {
  this.address = new Address()
  this.provider = new Provider()
  this.addressForm = this.formBuilder.group({
     // ad_addr: [this.address.ad_addr, Validators.required],
      ad_name: [this.address.ad_name,Validators.required],
      ad_line1:  [{ value: this.address.ad_line1, disabled: !this.isExist2 },Validators.required],
      ad_city: [{ value: this.address.ad_city, disabled: !this.isExist2 }],
      ad_state: [{ value: this.address.ad_state, disabled: !this.isExist2 }],
      ad_zip: [{ value: this.address.ad_zip, disabled: !this.isExist2 }],
      //ad_county: [{ value: this.address.ad_county, disabled: !this.isExist }],
     // ad_country: [{ value: this.address.ad_country, disabled: !this.isExist }],
      ad_phone: [{ value: this.address.ad_phone, disabled: !this.isExist2 }, Validators.required],
      ad_ext: [{ value: this.address.ad_ext, disabled: !this.isExist2 }],
      ad_fax: [{ value: this.address.ad_fax, disabled: !this.isExist2 }],
      ad_attn: [{ value: this.address.ad_attn, disabled: !this.isExist2 }],
      ad_taxable: [{ value: this.address.ad_taxable, disabled: !this.isExist2 }],
      ad_taxc: [{ value: this.address.ad_taxc, disabled: !this.isExist2 }],
      ad_gst_id: [{ value: this.address.ad_gst_id, disabled: !this.isExist2 }],
      ad_pst_id: [{ value: this.address.ad_pst_id, disabled: !this.isExist2 }],
      ad_misc1_id: [{ value: this.address.ad_misc1_id, disabled: !this.isExist2 }],
      ad_misc2_id: [{ value: this.address.ad_misc2_id, disabled: !this.isExist2 }],
    //  vd_sort: [{ value: this.provider.vd_sort, disabled: !this.isExist }],
      vd_type: [{ value: this.provider.vd_type, disabled: !this.isExist2 }],
      vd_bank: [{ value: this.provider.vd_bank, disabled: !this.isExist2 }],
      vd_cr_terms: [{ value: this.provider.vd_cr_terms, disabled: !this.isExist2 }],
  })
}

onChangeCodeVendor() {
  const controls  = this.addressForm.controls
 // const controls1 = this.providerForm.controls
  this.addressService
      .getBy({
            ad_name: controls.ad_name.value,
      })
      .subscribe((response: any) => {
          
          if (response.data) {
              this.isExist2 = true
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
}

