import { Component, ChangeDetectorRef, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms"
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
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  FieldType, GridService
} from "angular-slickgrid"

import {
  CodeService,
  Accessoire,
  AccessoireService,
  LocationService,
  SiteService,
  SequenceService,
  ProductLineService,
  ProviderService,
  MesureService,
  CostSimulation,
  CostSimulationService,
  BankService,
  Code,
  TaxeService,
  Address,
  Provider,
  AddressService,

} from "../../../../core/erp";
import { _isNumberValue } from '@angular/cdk/coercion';

// create my custom Formatter with the Formatter type
const myCustomCheckmarkFormatter: Formatter = (
  row,
  cell,
  value,
  columnDef,
  dataContext
) => {
  // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
  return `
	<div class="form-group row">
        <div class="col-8">
            <span class="switch switch-icon">
                <label>
                    <input type="checkbox"
                        class="form-control form-control-sm form-control-solid"
                        name="select" />
                    <span></span>
                </label>
            </span>
        </div>
    </div>
	`;
};

@Component({
  selector: 'kt-edit-acs',
  templateUrl: './edit-acs.component.html',
  styleUrls: ['./edit-acs.component.scss']
})
export class EditAcsComponent implements OnInit {

  accessoire: Accessoire;
  codemstr: Code;
  hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;
  hasFormErrors = false
  acssesoireEdit: any
  seq;
 isExist2 = false;
 isExist3 = false;
 tauxtaxe:Number;
  form1: FormGroup;
  codeForm: FormGroup;
  // form3: FormGroup;
  // form4: FormGroup;
  title: String = 'Modifier Accessoire - '
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
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

  // selects
  acs_part_type: any[] = [];
  acs_draw: any[] = [];
  acs_rev: any[] = [];
  acs_group: any[] = [];
  acs_dsgn_grp: any[] = [];
  acs_upc: any[] = [];
  acs_abc: any[] = [];
  acs_loc_type: any[] = [];
  acs_ship_wt_um: any[] = [];
  acs_net_wt_um: any[] = [];
  acs_fr_class: any[] = [];
  acs_size_um: any[] = [];

  acs_pm_code: any[] = [];
  acs_run_seq1: any[] = [];
  acs_run_seq2: any[] = [];
  acs_promo: any[] = [];

  data: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;
  selectedField = "";
  fieldcode = "";

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  dataloc: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;

  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  datapl: [];
  columnDefinitionspl: Column[] = [];
  gridOptionspl: GridOption = {};
  gridObjpl: any;
  gridServicepl: GridService;
  angularGridpl: AngularGridInstance;
  row_number;
  error = false;
  msg: String;

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

  isExist = false;

  sct1: CostSimulation;
  sct2: CostSimulation;

  sctForm: FormGroup;
  sctForm1: FormGroup;
  banks: [];
  columnDefinitionsbank: Column[] = [];
  gridOptionsbank: GridOption = {};
  gridObjbank: any;
  angularGridbank: AngularGridInstance;

  address: Address
  addressForm: FormGroup
  provider: Provider
  providerForm: FormGroup
  hasFormErrors5 = false
  hasFormErrors6 = false
  hasProviderFormErrors = false
codevalue;
  datacode: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;
  fldname;
  datataxv: []
  columnDefinitionstaxv: Column[] = []
  gridOptionstaxv: GridOption = {}
  gridObjtaxv: any
  angularGridtaxv: AngularGridInstance
  code;
  message: String;

  constructor(
    config: NgbDropdownConfig,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private form1FB: FormBuilder,
    private codeFB: FormBuilder,
    private form3FB: FormBuilder,
    private form4FB: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private codeService: CodeService,
    private addressService: AddressService,
    private siteService: SiteService,
    private locationService: LocationService,
    private productLineService: ProductLineService,
    private providerService: ProviderService,
    private bankService: BankService,
    private accessoireService: AccessoireService,
    private sequenceService: SequenceService,
    private mesureService: MesureService,
    private taxService: TaxeService,
  ) {
    config.autoClose = true;
    
    //this.prepareGrid();
    //this.prepareGrid2();

    this.codeService
      .getBy({ code_fldname: "acs_part_type" })
      .subscribe((response: any) => (this.acs_part_type = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_draw" })
      .subscribe((response: any) => (this.acs_draw = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_rev" })
      .subscribe((response: any) => (this.acs_rev = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_group" })
      .subscribe((response: any) => (this.acs_group = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_dsgn_grp" })
      .subscribe((response: any) => (this.acs_dsgn_grp = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_upc" })
      .subscribe((response: any) => (this.acs_upc = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_abc" })
      .subscribe((response: any) => (this.acs_abc = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_loc_type" })
      .subscribe((response: any) => (this.acs_loc_type = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_ship_wt_um" })
      .subscribe((response: any) => (this.acs_ship_wt_um = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_net_wt_um" })
      .subscribe((response: any) => (this.acs_net_wt_um = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_fr_class" })
      .subscribe((response: any) => (this.acs_fr_class = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_size_um" })
      .subscribe((response: any) => (this.acs_size_um = response.data));

    this.codeService
      .getBy({ code_fldname: "acs_pm_code" })
      .subscribe((response: any) => (this.acs_pm_code = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_run_seq1" })
      .subscribe((response: any) => (this.acs_run_seq1 = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_run_seq2" })
      .subscribe((response: any) => (this.acs_run_seq2 = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_promo" })
      .subscribe((response: any) => (this.acs_promo = response.data));
    /***************************************************** */
    this.codeService
        .getBy({ code_fldname: "ad_state" })
        .subscribe((response: any) => (this.ad_state = response.data))
        this.codeService
        .getBy({ code_fldname: "ad_country" })
        .subscribe((response: any) => (this.ad_country = response.data))
    this.codeService
        .getBy({ code_fldname: "ad_city" })
        .subscribe((response: any) => (this.ad_city = response.data))
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
        /****************************************************************** */  
    
  }

  ngOnInit(): void {
    // this.loading$ = this.loadingSubject.asObservable()
    // this.loadingSubject.next(true)
    // this.activatedRoute.params.subscribe((params) => {
    //     const id = params.id
    //     this.accessoireService.getOne(id).subscribe((response: any)=>{
    //       this.acssesoireEdit = response.data
    //               //console.log(this.acssesoireEdit.acs_promo)
    //               this.taxService
    //               .getBy({ tx2_tax_code: this.acssesoireEdit.acs_taxc })
    //               .subscribe((respo: any) => {this.tauxtaxe = respo.data.tx2_tax_pct  
    //               //this.sctService.getByOne({sct_part: this.acssesoireEdit.acs_part, sct_sim: 'STDCG'}).subscribe((response: any)=>{
    //         //this.sct1Edit = response.data
                
           
            
          
    //        // this.sctService.getByOne({sct_part: this.acs_.acs_part, sct_sim: 'STDCR'}).subscribe((response: any)=>{
    //        //       this.sct2Edit = response.data         
            
    //         this.initCode()
    //         this.loadingSubject.next(false)
    //         this.title = this.title + this.acssesoireEdit.acs_part
    //         console.log(this.title)
    //       })
        
    //     })
    // })
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.accessoireService.getOne(id).subscribe((response: any)=>{
          this.acssesoireEdit = response.data
          this.tauxtaxe = Number(this.acssesoireEdit.taxe.tx2_tax_pct)
          console.log("tax", this.tauxtaxe)
          this.initCode()
        //   window.onload = () => {
        //     const style = getComputedStyle(document.getElementById("kt_header"))
        //     this.headerMargin = parseInt(style.height, 0)
        // }
          this.loadingSubject.next(false)
          this.title = this.title + this.acssesoireEdit.acs_part
          })

        })
  }





 /* prepareGrid() {
  
    
    this.columnDefinitions = [
      {
        id: "elemet",
        name: "Element",
        field: "element",
        sortable: true,
        editor: {
          model: Editors.text,
          required: true,
        },
      },
      {
        id: "this_level",
        name: "Ce niveau",
        field: "thisLevel",
        sortable: true,
      },
      {
        id: "inf_level",
        name: "Niveau inf",
        field: "infLevel",
        sortable: true,
      },
      { id: "total", name: "Total", field: "Total" },
      {
        id: "pri",
        name: "Pri",
        field: "pri",
        formatter: myCustomCheckmarkFormatter,
      },
      { id: "cate", name: "Categorie", field: "category" },
      {
        id: "sur",
        name: "Sur",
        field: "sur",
        formatter: myCustomCheckmarkFormatter,
      },
    ];

    this.gridOptions = {
      enableSorting: true,
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: true,
    };

    // fill the dataset with your data
    this.dataset = [];
    
  }
  prepareGrid2() {
    
    this.columnDefinitions2 = [
      {
        id: "Matiere",
        name: "Matiere",
        field: "matiere",
        sortable: true,
        editor: {
          model: Editors.text,
          required: true,
        },
      },
      {
        id: "Main d'œuvre",
        name: "Main d'œuvre",
        field: "oeuvre",
        sortable: true,
      },
      {
        id: "FG variable",
        name: "FG variable",
        field: "fg_v",
        sortable: true,
      },
      { id: "FG Fixes", name: "FG Fixes", field: "fg_f" },
      {
        id: "SS-trail",
        name: "SS-trail",
        field: "SS-trail",
      },
    ];

    this.gridOptions2 = {
      enableSorting: true,
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: true,
    };

    // fill the dataset with your data
    this.dataset2 = [];

  }
  
*/


  // init code
  initCode() {
    this.createForm()
    this.loadingSubject.next(false)
  }
    createForm() {
      this.loadingSubject.next(false)
      
      this.form1 = this.form1FB.group({
  
        acs_part: [{value:this.acssesoireEdit.acs_part, disabled: true}],
        
        acs_desc1: [this.acssesoireEdit.acs_desc1,Validators.required],
       // acs_um: [this.acssesoireEdit.acs_um,Validators.required],
       // acs_prod_line: [this.acssesoireEdit.acs_prod_line,Validators.required],
        acs_part_type: [this.acssesoireEdit.acs_part_type,Validators.required],
        acs_draw: [this.acssesoireEdit.acs_draw,Validators.required],
       // acs_status: [this.acssesoireEdit.acs_status,Validators.required],
        acs_rev: [this.acssesoireEdit.acs_rev],
        acs_dsgn_grp: [this.acssesoireEdit.acs_dsgn_grp],
        acs_group: [this.acssesoireEdit.acs_group],
       // acs_drwg_loc: [this.acssesoireEdit.acs_drwg_loc],
       // acs_drwg_size: [this.acssesoireEdit.acs_drwg_size],
       // acs_promo: [this.acssesoireEdit.acs_promo],
       // acs_break_cat: [this.acssesoireEdit.acs_break_cat],
        acs_abc: [this.acssesoireEdit.acs_abc,Validators.required],
       // acs_avg_int: [this.acssesoireEdit.acs_avg_int],
        //acs_lot_ser: [this.acssesoireEdit.acs_lot_ser],
        //acs_cyc_int: [this.acssesoireEdit.acs_cyc_int],
        acs_site: [this.acssesoireEdit.acs_site,Validators.required],
        //acs_shelflife: [this.acssesoireEdit.acs_shelflife],
        acs_loc: [this.acssesoireEdit.acs_loc,Validators.required],
        //acs_sngl_lot: [this.acssesoireEdit.acs_sngl_lot],
        //acs_loc_type: [this.acssesoireEdit.acs_loc_type],
        //acs_critical: [this.acssesoireEdit.acs_critical],
       // acs_auto_lot: [this.acssesoireEdit.acs_auto_lot],
        //acs_rctpo_status: [this.acssesoireEdit.acs_rctpo_status],
        //acs_rctpo_active: [this.acssesoireEdit.acs_rctpo_active],
        //acs_lot_grp: [this.acssesoireEdit.acs_lot_grp],
        //acs_rctwo_status: [this.acssesoireEdit.acs_rctwo_status],
        //acs_rctwo_active: [this.acssesoireEdit.acs_rctwo_active],
        acs_article: [this.acssesoireEdit.acs_article],
        acs_vend: [this.acssesoireEdit.acs_vend],
        acs_price: [this.acssesoireEdit.acs_price],
        acs_pur_price: [this.acssesoireEdit.acs_pur_price],
        acs_marge: [this.acssesoireEdit.acs_marge],
        acs_sales_price: [this.acssesoireEdit.acs_sales_price],
        
        acs_taxable: [this.acssesoireEdit.acs_taxable],
        acs_taxc: [this.acssesoireEdit.acs_taxc],


      })
    //   const controls1 = this.form1.controls;
    //   console.log(this.acssesoireEdit.acs_part)
    // controls1.acs_part.setValue(this.acssesoireEdit.acs_part)


      // this.form2 = this.form2FB.group({
      //   acs_ship_wt: [this.acssesoireEdit.acs_ship_wt],
      //   acs_ship_wt_um: [this.acssesoireEdit.acs_ship_wt_um],
      //   acs_net_wt: [this.acssesoireEdit.acs_net_wt],
      //   acs_net_wt_um: [this.acssesoireEdit.acs_net_wt_um],
      //   acs_fr_class: [this.acssesoireEdit.acs_fr_class],
      //   acs_size: [this.acssesoireEdit.acs_size],
      //   acs_size_um: [this.acssesoireEdit.acs_size_um],


  
      // })

      // this.form3 = this.form3FB.group({

      // acs_ms: [this.acssesoireEdit.acs_ms],
      // acs_buyer: [this.acssesoireEdit.acs_buyer],
      // acs_phantom: [this.acssesoireEdit.acs_phantom],
      // acs_plan_ord: [this.acssesoireEdit.acs_plan_ord],
      // acs_vend: [this.acssesoireEdit.acs_vend],

      // acs_ord_min: [this.acssesoireEdit.acs_ord_min],
      // acs_timefence: [this.acssesoireEdit.acs_timefence],
      // acs_po_site: [this.acssesoireEdit.acs_po_site],
      // acs_ord_max: [this.acssesoireEdit.acs_ord_max],
      // acs_pm_code: [this.acssesoireEdit.acs_pm_code],
      // acs_ord_mult: [this.acssesoireEdit.acs_ord_mult],
      // acs_ord_pol: [this.acssesoireEdit.acs_ord_pol],
      // acs_cfg_type: [this.acssesoireEdit.acs_cfg_type],
      // acs_op_yield: [this.acssesoireEdit.acs_op_yield],
      // acs_ord_qty: [this.acssesoireEdit.acs_ord_qty],
      // acs_insp_rqd: [this.acssesoireEdit.acs_insp_rqd],
      // acs_yield_pct: [this.acssesoireEdit.acs_yield_pct],
      // acs_insp_lead: [this.acssesoireEdit.acs_insp_lead],
      // acs_run: [this.acssesoireEdit.acs_run],
      // acs_ord_per: [this.acssesoireEdit.acs_ord_per],
      // acs_mfg_lead: [this.acssesoireEdit.acs_mfg_lead],
      // acs_pur_lead: [this.acssesoireEdit.acs_pur_lead],
      // acs_setup: [this.acssesoireEdit.acs_setup],
      // acs_sfty_stk: [this.acssesoireEdit.acs_sfty_stk],
      // acs_sfty_time: [this.acssesoireEdit.acs_sfty_time],
      // acs_rop: [this.acssesoireEdit.acs_rop],
      // acs_atp_family: [this.acssesoireEdit.acs_atp_family],
      // acs_network: [this.acssesoireEdit.acs_network],
      // acs_run_seq1: [this.acssesoireEdit.acs_run_seq1],
      // acs_routing: [this.acssesoireEdit.acs_routing],
      // acs_iss_pol: [this.acssesoireEdit.acs_iss_pol],
      // acs_run_seq2: [this.acssesoireEdit.acs_run_seq2],
      // acs_bom_code: [this.acssesoireEdit.acs_bom_code],

      // })


      // this.form4 = this.form4FB.group({
      //   acs_price: [this.acssesoireEdit.acs_price],
      //   acs_pur_price: [this.acssesoireEdit.acs_pur_price],
      //   acs_taxable: [this.acssesoireEdit.acs_taxable],
      //   acs_taxc: [this.acssesoireEdit.acs_taxc],

      // })
  //    console.log(this.sct1Edit)
    //  console.log(this.sct2Edit)
                
/*
      this.sctForm = this.formBuilder.group({
        sct_mtl_tl: [this.sct1Edit.sct_mtl_tl],
        sct_mtl_ll: [this.sct1Edit.sct_mtl_ll],
        sct_lbr_tl: [this.sct1Edit.sct_lbr_tl],
        sct_lbr_ll: [this.sct1Edit.sct_lbr_ll],
        sct_bdn_tl: [this.sct1Edit.sct_bdn_tl],
        sct_bdn_ll: [this.sct1Edit.sct_bdn_ll],
        sct_ovh_tl: [this.sct1Edit.sct_ovh_tl],
        sct_ovh_ll: [this.sct1Edit.sct_ovh_ll],
        sct_sub_tl: [this.sct1Edit.sct_sub_tl],
        sct_sub_ll: [this.sct1Edit.sct_sub_ll],
      });
      this.sctForm1 = this.formBuilder.group({
        sct_mtl_tl: [this.sct2Edit.sct_mtl_tl],
        sct_mtl_ll: [this.sct2Edit.sct_mtl_ll],
        sct_lbr_tl: [this.sct2Edit.sct_lbr_tl],
        sct_lbr_ll: [this.sct2Edit.sct_lbr_ll],
        sct_bdn_tl: [this.sct2Edit.sct_bdn_tl],
        sct_bdn_ll: [this.sct2Edit.sct_bdn_ll],
        sct_ovh_tl: [this.sct2Edit.sct_ovh_tl],
        sct_ovh_ll: [this.sct2Edit.sct_ovh_ll],
        sct_sub_tl: [this.sct2Edit.sct_sub_tl],
        sct_sub_ll: [this.sct2Edit.sct_sub_ll],
      });
*/
    }
      
   //reste form
  reset() {
    this.accessoire = new Accessoire();
    this.createForm();
    this.hasFormErrors1 = false;
    this.hasFormErrors2 = false;
    this.hasFormErrors3 = false;
    this.hasFormErrors4 = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors1 = false;
    this.hasFormErrors2 = false;
    this.hasFormErrors3 = false;
    this.hasFormErrors4 = false;

    const controls1 = this.form1.controls;
    // const controls2 = this.form2.controls;
    // const controls3 = this.form3.controls;
    // const controls4 = this.form4.controls;

    /** check form */
    if (this.form1.invalid) {
      Object.keys(controls1).forEach((controlName) =>
        controls1[controlName].markAsTouched()
      );

      this.hasFormErrors1 = true;
      return;
    }
    // if (this.form2.invalid) {
    //   Object.keys(controls2).forEach((controlName) =>
    //     controls2[controlName].markAsTouched()
    //   );

    //   this.hasFormErrors2 = true;
    //   return;
    // }
    // if (this.form3.invalid) {
    //   Object.keys(controls3).forEach((controlName) =>
    //     controls3[controlName].markAsTouched()
    //   );

    //   this.hasFormErrors3 = true;
    //   return;
    // }
    // if (this.form4.invalid) {
    //   Object.keys(controls4).forEach((controlName) =>
    //     controls4[controlName].markAsTouched()
    //   );

    //   this.hasFormErrors4 = true;
    //   return;
    // }
    if (this.error) {
      this.hasFormErrors1 = true;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let accessoire = this.prepareItem();
  //  let sct1 = this.prepareSct1();
  //  let sct2 = this.prepareSct2()
    this.addItem(accessoire);
  }
  
  /**
* Returns object for saving
*/

prepareItem(): Accessoire {
  const controls1 = this.form1.controls;
  // const controls2 = this.form2.controls;
  // const controls3 = this.form3.controls;
  // const controls4 = this.form4.controls;

  const _item = new Accessoire();
    _item.id = this.acssesoireEdit.id;
    _item.acs_part = this.acssesoireEdit.acs_part;
    _item.acs_desc1 = controls1.acs_desc1.value;
  //  _item.acs_um = controls1.acs_um.value;
    //_item.acs_prod_line = controls1.acs_prod_line.value;
    _item.acs_part_type = controls1.acs_part_type.value;
    _item.acs_draw = controls1.acs_draw.value;
    //_item.acs_status = controls1.acs_status.value;
    _item.acs_rev = controls1.acs_rev.value;
    _item.acs_dsgn_grp = controls1.acs_dsgn_grp.value;
    _item.acs_group = controls1.acs_group.value;
    // _item.acs_drwg_loc = controls1.acs_drwg_loc.value;
    // _item.acs_drwg_size = controls1.acs_drwg_size.value;
    // _item.acs_promo = controls1.acs_promo.value;
    // _item.acs_break_cat = controls1.acs_break_cat.value;
    _item.acs_abc = controls1.acs_abc.value;
    // _item.acs_avg_int = controls1.acs_avg_int.value;
    // _item.acs_lot_ser = controls1.acs_lot_ser.value;
    // _item.acs_cyc_int = controls1.acs_cyc_int.value;
    _item.acs_site = controls1.acs_site.value;
    //_item.acs_shelflife = controls1.acs_shelflife.value;
    _item.acs_loc = controls1.acs_loc.value;
    // _item.acs_sngl_lot = controls1.acs_sngl_lot.value;
    // _item.acs_loc_type = controls1.acs_loc_type.value;
    // _item.acs_critical = controls1.acs_critical.value;
    // _item.acs_auto_lot = controls1.acs_auto_lot.value;
    // _item.acs_rctpo_status = controls1.acs_rctpo_status.value;
    // _item.acs_rctpo_active = controls1.acs_rctpo_active.value;
    // _item.acs_lot_grp = controls1.acs_lot_grp.value;
    // _item.acs_rctwo_status = controls1.acs_rctwo_status.value;
    // _item.acs_rctwo_active = controls1.acs_rctwo_active.value;
    _item.acs_article = controls1.acs_article.value;

    // _item.acs_ship_wt = controls2.acs_ship_wt.value;
    // _item.acs_ship_wt_um = controls2.acs_ship_wt_um.value;
    // _item.acs_net_wt = controls2.acs_net_wt.value;
    // _item.acs_net_wt_um = controls2.acs_net_wt_um.value;
    // _item.acs_fr_class = controls2.acs_fr_class.value;
    // _item.acs_size = controls2.acs_size.value;
    // _item.acs_size_um = controls2.acs_size_um.value;

    // _item.acs_ms = controls3.acs_ms.value;
    // _item.acs_buyer = controls3.acs_buyer.value;
    // _item.acs_phantom = controls3.acs_phantom.value;
    // _item.acs_plan_ord = controls3.acs_plan_ord.value;
    _item.acs_vend = controls1.acs_vend.value;

    // _item.acs_ord_min = controls3.acs_ord_min.value;
    // _item.acs_timefence = controls3.acs_timefence.value;
    // _item.acs_po_site = controls3.acs_po_site.value;
    // _item.acs_ord_max = controls3.acs_ord_max.value;
    // _item.acs_pm_code = controls3.acs_pm_code.value;
    // _item.acs_ord_mult = controls3.acs_ord_mult.value;
    // _item.acs_ord_pol = controls3.acs_ord_pol.value;
    // _item.acs_cfg_type = controls3.acs_cfg_type.value;
    // _item.acs_op_yield = controls3.acs_op_yield.value;
    // _item.acs_ord_qty = controls3.acs_ord_qty.value;
    // _item.acs_insp_rqd = controls3.acs_insp_rqd.value;
    // _item.acs_yield_pct = controls3.acs_yield_pct.value;
    // _item.acs_insp_lead = controls3.acs_insp_lead.value;
    // _item.acs_run = controls3.acs_run.value;
    // _item.acs_ord_per = controls3.acs_ord_per.value;
    // _item.acs_mfg_lead = controls3.acs_mfg_lead.value;
    // _item.acs_pur_lead = controls3.acs_pur_lead.value;
    // _item.acs_setup = controls3.acs_setup.value;
    // _item.acs_sfty_stk = controls3.acs_sfty_stk.value;
    // _item.acs_sfty_time = controls3.acs_sfty_time.value;
    // _item.acs_rop = controls3.acs_rop.value;
    // _item.acs_atp_family = controls3.acs_atp_family.value;
    // _item.acs_network = controls3.acs_network.value;
    // _item.acs_run_seq1 = controls3.acs_run_seq1.value;
    // _item.acs_routing = controls3.acs_routing.value;
    // _item.acs_iss_pol = controls3.acs_iss_pol.value;
    // _item.acs_run_seq2 = controls3.acs_run_seq2.value;
    // _item.acs_bom_code = controls3.acs_bom_code.value;

    _item.acs_price = controls1.acs_price.value;
    _item.acs_pur_price = controls1.acs_pur_price.value;
    _item.acs_marge = controls1.acs_marge.value;
    _item.acs_sales_price = controls1.acs_sales_price.value;

    _item.acs_taxable = controls1.acs_taxable.value;
    _item.acs_taxc = controls1.acs_taxc.value;

    return _item;
  }



  addItem(accessoire: Accessoire) {
    this.loadingSubject.next(true);
    this.accessoireService.update(this.acssesoireEdit.id, accessoire).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur verifier les informations",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      },
      () => {

               this.layoutUtilsService.showActionNotification(
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
                );
                this.loadingSubject.next(false);
                this.router.navigateByUrl("/articles/list-acs");
              }
            //);
    //      }
      );
      }
    //);
  
/*
  prepareSct1(): CostSimulation {
    const controls = this.sctForm.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    _sct.id = this.sct1Edit.id;
    _sct.sct_sim = 'STDCG';
    _sct.sct_part   = control1.acs_part.value;
    _sct.sct_mtl_tl = controls.sct_mtl_tl.value;
    _sct.sct_mtl_ll = controls.sct_mtl_ll.value;
    _sct.sct_lbr_tl = controls.sct_lbr_tl.value;
    _sct.sct_lbr_ll = controls.sct_lbr_ll.value;
    _sct.sct_bdn_tl = controls.sct_bdn_tl.value;
    _sct.sct_bdn_ll = controls.sct_bdn_ll.value;
    _sct.sct_ovh_tl = controls.sct_ovh_tl.value;
    _sct.sct_ovh_ll = controls.sct_ovh_ll.value;
    _sct.sct_sub_tl = controls.sct_sub_tl.value;
    _sct.sct_sub_ll = controls.sct_sub_ll.value;
    _sct.sct_cst_tot  =   Number(_sct.sct_mtl_tl) +  Number(_sct.sct_mtl_ll) + Number(_sct.sct_lbr_tl)  + Number(_sct.sct_lbr_ll)  + Number(_sct.sct_bdn_tl)  + Number(_sct.sct_bdn_ll)  + Number(_sct.sct_ovh_tl) + Number(_sct.sct_ovh_ll) + Number(_sct.sct_sub_tl) + Number(_sct.sct_sub_ll) ;
    _sct.sct_site = this.sct1Edit.sct_site;

    return _sct;
  }

  prepareSct2(): CostSimulation {
    const controls = this.sctForm1.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    _sct.id = this.sct2Edit.id;
    _sct.sct_sim = 'STDCR';
    _sct.sct_part = control1.acs_part.value
    _sct.sct_mtl_tl = controls.sct_mtl_tl.value;
    _sct.sct_mtl_ll = controls.sct_mtl_ll.value;
    _sct.sct_lbr_tl = controls.sct_lbr_tl.value;
    _sct.sct_lbr_ll = controls.sct_lbr_ll.value;
    _sct.sct_bdn_tl = controls.sct_bdn_tl.value;
    _sct.sct_bdn_ll = controls.sct_bdn_ll.value;
    _sct.sct_ovh_tl = controls.sct_ovh_tl.value;
    _sct.sct_ovh_ll = controls.sct_ovh_ll.value;
    _sct.sct_sub_tl = controls.sct_sub_tl.value;
    _sct.sct_sub_ll = controls.sct_sub_ll.value;
    _sct.sct_cst_tot = Number(_sct.sct_mtl_tl) +  Number(_sct.sct_mtl_ll) + Number(_sct.sct_lbr_tl)  + Number(_sct.sct_lbr_ll)  + Number(_sct.sct_bdn_tl)  + Number(_sct.sct_bdn_ll)  + Number(_sct.sct_ovh_tl) + Number(_sct.sct_ovh_ll) + Number(_sct.sct_sub_tl) + Number(_sct.sct_sub_ll) ;
    _sct.sct_site = this.sct2Edit.sct_site;
    return _sct;
  }


*/


goBack() {
  this.loadingSubject.next(false)
  const url = `/`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

changeUm() {
  const controls = this.form1.controls; // chof le champs hada wesh men form rah
  const um_um = controls.acs_um.value;
  this.mesureService.getBy({ um_um }).subscribe(
    (res: any) => {
      const { data } = res;
      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "cette unite de mesure n'existe pas!",
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


/*changePl() {
  const controls = this.form1.controls; // chof le champs hada wesh men form rah
  const pl_prod_line = controls.acs_prod_line.value;
  this.productLineService.getBy({ pl_prod_line }).subscribe(
    (res: any) => {
      const { data } = res;
      if (!data) {
        this.layoutUtilsService.showActionNotification(
          "cette Ligne de Produit n'existe pas!",
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
}*/
changeCode(field) {
  const controls = this.form1.controls; // chof le champs hada wesh men form rah

  let obj = {};
  if (field == "acs_status") {
    this.msg = " Status ";
    const code_value = controls.acs_status.value;
    obj = {
      code_value,
      code_fldname: field,
    };
  }
  if (field == "acs_dsgn_grp") {
    this.msg = " Groupe Etude ";
    const code_value = controls.acs_dsgn_grp.value;
    obj = {
      code_value,
      code_fldname: field,
    };
  }

  this.codeService.getBy(obj).subscribe(
    (res: any) => {
      const { data } = res;
      const message = "Ce code" + this.msg + " n'existe pas!";
      if (!data.length) {
        this.layoutUtilsService.showActionNotification(
          message,
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
changeSite() {
  const controls = this.form1.controls; // chof le champs hada wesh men form rah
  const si_site = controls.acs_site.value;
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
  const controls = this.form1.controls; // chof le champs hada wesh men form rah
  const vd_addr = controls.acs_vend.value;
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
  const loc_loc = controls.acs_loc.value;
  const loc_site = controls.acs_site.value;

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

handleSelectedRowsChanged3(e, args) {
  const controls1 = this.form1.controls;
  // const controls2 = this.form2.controls;
  // const controls3 = this.form3.controls;
  // const controls4 = this.form4.controls;

  if (Array.isArray(args.rows) && this.gridObj3) {
    args.rows.map((idx) => {
      const accessoire = this.gridObj3.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "acs_status": {
          controls1.acs_status.setValue(accessoire.code_value || "");
          break;
        }
        case "acs_dsgn_grp": {
          controls1.acs_dsgn_grp.setValue(accessoire.code_value || "");
          break;
        }
        case "acs_um": {
          controls1.acs_um.setValue(accessoire.code_value || "");
          break;
        }
        case "acs_network": {
          controls1.acs_network.setValue(accessoire.code_value || "");
          break;
        }
        default:
          break;
      }
    });
  }
}
handleSelectedRowsChangedsite(e, args) {
  const controls1 = this.form1.controls;
  // const controls2 = this.form2.controls;
  // const controls3 = this.form3.controls;
  // const controls4 = this.form4.controls;

  if (Array.isArray(args.rows) && this.gridObjsite) {
    args.rows.map((idx) => {
      const accessoire = this.gridObjsite.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "acs_site": {
          controls1.acs_site.setValue(accessoire.si_site || "");
          break;
        }
        default:
          break;
      }
    });
  }
}
/*handleSelectedRowsChangedpl(e, args) {
  const controls1 = this.form1.controls;
  if (Array.isArray(args.rows) && this.gridObjpl) {
    args.rows.map((idx) => {
      const accessoire = this.gridObjpl.getDataItem(idx);
      controls1.acs_prod_line.setValue(accessoire.pl_prod_line || "");
    });
  }
}*/
handleSelectedRowsChangedloc(e, args) {
  const controls1 = this.form1.controls;

  if (Array.isArray(args.rows) && this.gridObjloc) {
    args.rows.map((idx) => {
      const accessoire = this.gridObjloc.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "acs_loc": {
          controls1.acs_loc.setValue(accessoire.loc_loc || "");
          break;
        }
        default:
          break;
      }
    });
  }
}
angularGridReady3(angularGrid: AngularGridInstance) {
  this.angularGrid3 = angularGrid;
  this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
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
    checkboxSelector: {},
    multiSelect: false,
    rowSelectionOptions: {
      selectActiveRow: true,
    },
  };

  // fill the dataset with your data
  this.codeService
    .getBy({ code_fldname: this.selectedField })
    .subscribe((response: any) => (this.data = response.data));
}
open3(content, field) {
  this.selectedField = field;
  this.prepareGrid3();
  this.modalService.open(content, { size: "lg" });
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
    .getBy({ loc_site: controls1.acs_site.value })
    .subscribe((response: any) => (this.dataloc = response.data));
}
openloc(contentloc, field) {
  this.selectedField = field;
  this.prepareGridloc();
  this.modalService.open(contentloc, { size: "lg" });
}

/*
angularGridReadypl(angularGrid: AngularGridInstance) {
  this.angularGridpl = angularGrid;
  this.gridObjpl = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridpl() {
  this.columnDefinitionspl = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "pl_prod_line",
      name: "code ",
      field: "pl_prod_line",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pl_desc",
      name: "desc",
      field: "pl_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pl_taxc",
      name: "Taxe",
      field: "pl_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionspl = {
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
  this.productLineService
    .getAll()
    .subscribe((response: any) => (this.datapl = response.data));
}
openpl(contentpl) {
  this.prepareGridpl();
  this.modalService.open(contentpl, { size: "lg" });
}
*/
handleSelectedRowsChangedprov(e, args) {
  const controls = this.form1.controls;
  if (Array.isArray(args.rows) && this.gridObjprov) {
    args.rows.map((idx) => {
      const accessoire = this.gridObjprov.getDataItem(idx);
      controls.acs_vend.setValue(accessoire.vd_addr || "");
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
    dataItemColumnValueExtractor: function getItemColumnValue(accessoire, column) {
      var val = undefined;
      try {
        val = eval("accessoire." + column.field);
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

handleSelectedRowsChangedseq(e, args) {
  const controls = this.form1.controls;
  if (Array.isArray(args.rows) && this.gridObjseq) {
    args.rows.map((idx) => {
      const accessoire = this.gridObjseq.getDataItem(idx);
      controls.acs_buyer.setValue(accessoire.seq_seq || "");
    });
  }
}

angularGridReadyseq(angularGrid: AngularGridInstance) {
  this.angularGridseq = angularGrid;
  this.gridObjseq = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridseq() {
  this.columnDefinitionsseq = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "seq_seq",
      name: "code sequence",
      field: "seq_seq",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "seq_desc",
      name: "description",
      field: "seq_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "seq_appr1",
      name: "approbateur 1",
      field: "seq_appr1",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "seq_appr2",
      name: "approbateur 2",
      field: "seq_appr2",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "seq_appr3",
      name: "approbateur 3",
      field: "seq_appr3",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsseq = {
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
  this.sequenceService
    .getAll()
    .subscribe((response: any) => (this.sequences = response.data));
}
openseq(content) {
  this.prepareGridseq();
  this.modalService.open(content, { size: "lg" });
}
handleSelectedRowsChangedtax(e, args) {
  const controls = this.form1.controls
  if (Array.isArray(args.rows) && this.gridObjtax) {
      args.rows.map((idx) => {
          const accessoire = this.gridObjtax.getDataItem(idx)
          controls.acs_taxc.setValue(accessoire.tx2_tax_code || "")
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


createCodeForm() {
  this.loadingSubject.next(false)

  this.codemstr = new Code()
  this.codeForm = this.codeFB.group({
      code_value: [this.codemstr.code_value, Validators.required],
      code_cmmt: [
          { value: this.codemstr.code_cmmt, disabled: !this.isExist },
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

changeMarge(){
  const controls = this.form1.controls
let prix =  Number(controls.acs_pur_price.value) * (100 + Number(controls.acs_marge.value)) / 100
  controls.acs_price.setValue(prix );
  if (controls.acs_taxable.value == true) {
    controls.acs_sales_price.setValue(Number(controls.acs_price.value) * (100 + Number(this.tauxtaxe)) / 100)
    }
    else {
      controls.acs_sales_price.setValue(Number(controls.acs_price.value) )
   

    }

}
onSubmitCode() {
  this.hasFormErrors = false
  const controls  = this.codeForm.controls
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
    case "acs_draw": {
      controls1.acs_draw.setValue(this.codevalue || "");
      break;
    }
    case "acs_dsgn_grp": {
      controls1.acs_dsgn_grp.setValue(this.codevalue || "");
      break;
    }
    case "acs_group": {
      controls1.acs_group.setValue(this.codevalue || "");
      break;
    }
    case "acs_rev": {
      controls1.acs_rev.setValue(this.codevalue || "");
      break;
    }

    case "acs_part_type": {
      controls1.acs_part_type.setValue(this.codevalue || "");
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
              10000,
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
  .getBy({ code_fldname: "acs_part_type" })
  .subscribe((response: any) => (this.acs_part_type = response.data));
  this.codeService
  .getBy({ code_fldname: "acs_upc" })
  .subscribe((response: any) => (this.acs_upc = response.data));  
  
  this.codeService
  .getBy({ code_fldname: "acs_dsgn_grp" })
  .subscribe((response: any) => (this.acs_dsgn_grp = response.data));

  this.codeService
  .getBy({ code_fldname: "acs_draw" })
  .subscribe((response: any) => (this.acs_draw = response.data));
this.codeService
  .getBy({ code_fldname: "acs_rev" })
  .subscribe((response: any) => (this.acs_rev = response.data));
this.codeService
  .getBy({ code_fldname: "acs_group" })
  .subscribe((response: any) => (this.acs_group = response.data));
this.codeService
  .getBy({ code_fldname: "acs_abc" })
  .subscribe((response: any) => (this.acs_abc = response.data));
this.codeService
  .getBy({ code_fldname: "acs_loc_type" })
  .subscribe((response: any) => (this.acs_loc_type = response.data));

}




/***************************provider*********************** 
newCust(content) {
  // this.is_list = false;
  this.modalService.dismissAll;
   this.createAddressForm();
   this.modalService.open(content, { size: "lg" });
 }
 
 onSubmitCust() {
   console.log("hhhhhhhhhhhhhhhhhhhhhhhhhh")
   this.hasFormErrors2= false
   const controls = this.addressForm.controls
 //  const controls_ = this.customerForm.controls
  
   if (this.addressForm.invalid) {
       Object.keys(controls).forEach((controlName) =>
           controls[controlName].markAsTouched()
       )
 
       this.hasFormErrors2 = true
       this.selectedTab = 0
       return
   }
   
 
   let address = this.prepareAddress()
   this.addAddress(address)
   
 }
 
 
 prepareAddress(): Address {
   const controls = this.addressForm.controls
   //const controls1 = this.customerForm.controls
 
   const _address = new Address()
   console.log(controls.ad_temp.value)
   _address.ad_addr = controls.ad_addr.value
   _address.ad_name = controls.ad_name.value
   _address.ad_name_control = controls.ad_name_control.value
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
   _customer.cm_stmt_cyc = controls.cm_stmt_cyc.value
   console.log(controls.cm_mod_date)
   _customer.cm_mod_date = controls.cm_mod_date.value
   ? `${controls.cm_mod_date.value.year}/${controls.cm_mod_date.value.month}/${controls.cm_mod_date.value.day}`
   : null
 
   console.log(_customer)
   return _customer
   console.log(_customer)
 }
 
 addCustomer(_customer: Customer) {
   this.loadingSubject.next(true)
   this.customersService.add(_customer).subscribe(
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
           const controls = this.soForm.controls 
           controls.so_cust.setValue(this.codecli)
           this.customersService.getBy({cm_addr: this.codecli }).subscribe(
             (res: any) => {
               console.log(res);
               const { data } = res;
           controls.name.setValue(data.address.ad_name || "");
           controls.prenom.setValue(data.address.ad_name_control || "");
           controls.sexe.setValue(data.cm_type || "");
           controls.assurence.setValue(data.cm_region || "");
         controls.ssnum.setValue(data.cm_sic || "");
           
 
             }
           )
           this.modalService.dismissAll()
           
           this.closeModal()
           // this.router.navigateByUrl("/customers/customer-list")
       }
   )
  
 }
 

**************************provider*********************** */
handleSelectedRowsChangedtaxv(e, args) {
  const controls = this.addressForm.controls
  if (Array.isArray(args.rows) && this.gridObjtaxv) {
      args.rows.map((idx) => {
          const accessoire = this.gridObjtaxv.getDataItem(idx)
          controls.ad_taxc.setValue(accessoire.tx2_tax_code || "")
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

/******************************************************************* */
openvendor(content) {
  this.createAddressForm()
  this.modalService.open(content, { size: "lg" });
}


onSubmitVendor() {
  this.hasFormErrors5 = false
  const controls = this.addressForm.controls
  const controls1 = this.form1.controls
//  const controls_ = this.providerForm.controls
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
        controls1.acs_vend.setValue(this.code)
    
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
      const accessoire = this.gridObjbank.getDataItem(idx);
      controls.vd_bank.setValue(accessoire.bk_code || "");
          
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
    dataItemColumnValueExtractor: function getItemColumnValue(accessoire, column) {
      var val = undefined;
      try {
        val = eval("accessoire." + column.field);
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
