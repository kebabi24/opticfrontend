// Angular
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// Material
import { MatDialog } from "@angular/material/dialog";
// RxJS
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { map, startWith, delay, first } from "rxjs/operators";
// NGRX
import { Store, select } from "@ngrx/store";
import { Dictionary, Update } from "@ngrx/entity";
import { AppState } from "../../../../core/reducers";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
// Services and Models
import {
  selectLastCreatedProductId,
  selectProductById,
  SPECIFICATIONS_DICTIONARY,
  ProductModel,
  ProductOnServerCreated,
  ProductUpdated,
  ProductsService,
} from "../../../../core/e-commerce";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  FieldType,
  GridService,
} from "angular-slickgrid";

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
  InventoryStatusService,
  TaxeService,
  Code,
  BankService,
  Provider,
  Address,
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
  selector: 'kt-create-acs',
  templateUrl: './create-acs.component.html',
  styleUrls: ['./create-acs.component.scss']
})
export class CreateAcsComponent implements OnInit {
  accessoire: Accessoire;
  codemstr: Code;
  hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;
  hasFormErrors = false;
  fieldcode = "";
  codeForm: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;

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
  acs_drwg_loc: any[] = [];
  acs_drwg_size: any[] = [];
  acs_abc: any[] = [];
  acs_loc_type: any[] = [];
  acs_ship_wt_um: any[] = [];
  acs_net_wt_um: any[] = [];
  acs_fr_class: any[] = [];
  acs_size_um: any[] = [];
  acs_upc: any[] = [];
  acs_dsgn_grp: any[] = [];
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

site: any;
loc: any;
  dataloc: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;

  datastatus: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;

  datapl: [];
  columnDefinitionspl: Column[] = [];
  gridOptionspl: GridOption = {};
  gridObjpl: any;
  gridServicepl: GridService;
  angularGridpl: AngularGridInstance;
  row_number;
  error = false;
  msg: String;
  tauxtaxe: Number;
  isExist  = false;
  isExist2 = false;
  isExist3 = false;
  
  sct1: CostSimulation;
  sct2: CostSimulation;

  sctForm: FormGroup;
  sctForm1: FormGroup;
  seq: any;
  code: any;
  message: String;

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
valuecode;
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
codevalue;
  constructor(
    config: NgbDropdownConfig,
    private formBuilder: FormBuilder,
    private codeFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private codeService: CodeService,
    private sctService: CostSimulationService,
    private siteService: SiteService,
    private locationService: LocationService,
    private productLineService: ProductLineService,
    private providerService: ProviderService,
    private accessoireService: AccessoireService,
    private sequenceService: SequenceService,
    private mesureService: MesureService,
    private taxService: TaxeService,
    private inventoryStatusService: InventoryStatusService,
    private addressService: AddressService,
    private bankService: BankService,

  ) {
    config.autoClose = true;
    this.prepareGrid();
    this.prepareGrid2();
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
      .getBy({ code_fldname: "acs_drwg_loc" })
      .subscribe((response: any) => (this.acs_drwg_loc = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_drwg_size" })
      .subscribe((response: any) => (this.acs_drwg_size = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_abc" })
      .subscribe((response: any) => (this.acs_abc = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_loc_type" })
      .subscribe((response: any) => (this.acs_loc_type = response.data));
    this.codeService
      .getBy({ code_fldname: "acs_dsgn_grp" })
      .subscribe((response: any) => (this.acs_dsgn_grp = response.data));
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
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.createForm();
  }
  prepareGrid() {
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
    this.dataset = [
      // {
      //     id: 1,
      //     element: "aa",
      //     thisLevel: "0.0",
      //     infLevel: "1",
      //     total: "1",
      //     pri: "",
      //     category: "",
      //     sur: "",
      // },
    ];
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
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.accessoire = new Accessoire();
    this.form1 = this.formBuilder.group({
     
      acs_desc1: [ this.accessoire.acs_desc1,Validators.required],
      //acs_um: [{ value: this.accessoire.acs_desc1, disabled: !this.isExist },Validators.required],
      //acs_prod_line: [{ value: this.accessoire.acs_prod_line, disabled: !this.isExist },Validators.required],
      acs_part_type: [{ value: this.accessoire.acs_part_type, disabled: !this.isExist },Validators.required],
      acs_draw: [{ value: this.accessoire.acs_draw, disabled: !this.isExist },Validators.required],
      acs_rev: [{ value: this.accessoire.acs_rev, disabled: !this.isExist }],
      acs_dsgn_grp: [{ value: this.accessoire.acs_dsgn_grp, disabled: !this.isExist }],
      acs_group: [{ value: this.accessoire.acs_group, disabled: !this.isExist }],
     // acs_upc: [{ value: this.accessoire.acs_upc, disabled: !this.isExist }],
      //acs_break_cat: [{ value: this.accessoire.acs_break_cat, disabled: !this.isExist }],
      acs_abc: [{ value: this.accessoire.acs_abc, disabled: !this.isExist },Validators.required],
      //acs_avg_int: [{ value: this.accessoire.acs_avg_int, disabled: !this.isExist }],
      //acs_lot_ser: [{ value: this.accessoire.acs_lot_ser, disabled: !this.isExist }],
      //acs_cyc_int: [{ value: this.accessoire.acs_cyc_int, disabled: !this.isExist }],
      acs_site: [{ value: this.accessoire.acs_site, disabled: !this.isExist },Validators.required],
      //acs_shelflife: [{ value: this.accessoire.acs_shelflife, disabled: !this.isExist }],
      acs_loc: [{ value: this.accessoire.acs_loc, disabled: !this.isExist },Validators.required],
      //acs_sngl_lot: [{ value: this.accessoire.acs_sngl_lot, disabled: !this.isExist }],
      //acs_loc_type: [{ value: this.accessoire.acs_loc_type, disabled: !this.isExist }],
      //acs_critical: [{ value: this.accessoire.acs_critical, disabled: !this.isExist }],
      //acs_auto_lot: [{ value: this.accessoire.acs_auto_lot, disabled: !this.isExist }],
      //acs_rctpo_status: [{ value: this.accessoire.acs_rctpo_status, disabled: !this.isExist }],
      //acs_rctpo_active: [{ value: this.accessoire.acs_rctpo_active, disabled: !this.isExist }],
      //acs_lot_grp: [{ value: this.accessoire.acs_lot_grp, disabled: !this.isExist }],
      //acs_rctwo_status: [{ value: this.accessoire.acs_rctwo_status, disabled: !this.isExist }],
      //acs_rctwo_active: [{ value: this.accessoire.acs_rctwo_active, disabled: !this.isExist }],
       acs_vend: [{ value: this.accessoire.acs_vend, disabled: !this.isExist }],
       vendname: [{value: null, disabled:true}],
      acs_article: [{ value: this.accessoire.acs_article, disabled: !this.isExist }],
      acs_price: [{ value: this.accessoire.acs_price, disabled: !this.isExist }],
      acs_pur_price: [{ value: this.accessoire.acs_pur_price, disabled: !this.isExist }],
      acs_marge: [{ value: this.accessoire.acs_marge, disabled: !this.isExist }],
      acs_sales_price: [{ value: this.accessoire.acs_sales_price, disabled: !this.isExist }],
      acs_taxable: [{ value: this.accessoire.acs_taxable, disabled: !this.isExist }],
      acs_taxc: [{ value: this.accessoire.acs_taxc, disabled: !this.isExist },Validators.required],
    
    });
    const controls = this.form1.controls;
    this.siteService.getByOne({ si_default: true  }).subscribe(
      (res: any) => {
      this.site = res.data.si_site
      
      controls.acs_site.setValue(this.site );
     
    })
    this.locationService.getByOne({ loc_perm: true  }).subscribe(
      (res: any) => {
      this.loc = res.data.loc_loc
      
      controls.acs_loc.setValue(this.loc );
      controls.acs_abc.setValue("A" );
    })
    
    //this.form2 = this.formBuilder.group({
      // acs_ship_wt: [{ value: this.accessoire.acs_ship_wt, disabled: !this.isExist }],
      // acs_ship_wt_um: [{ value: this.accessoire.acs_ship_wt_um, disabled: !this.isExist }],
      // acs_net_wt: [{ value: this.accessoire.acs_net_wt, disabled: !this.isExist }],
      // acs_net_wt_um: [{ value: this.accessoire.acs_net_wt_um, disabled: !this.isExist }],
      // acs_fr_class: [{ value: this.accessoire.acs_fr_class, disabled: !this.isExist }],
      // acs_size: [{ value: this.accessoire.acs_size, disabled: !this.isExist }],
      // acs_size_um: [{ value: this.accessoire.acs_size_um, disabled: !this.isExist }],
    //});
    //this.form3 = this.formBuilder.group({
      // acs_ms: [{ value: this.accessoire.acs_ms, disabled: !this.isExist }],
      // acs_buyer: [{ value: this.accessoire.acs_buyer, disabled: !this.isExist }],
      // acs_phantom: [{ value: this.accessoire.acs_phantom, disabled: !this.isExist }],
      // acs_plan_ord: [{ value: this.accessoire.acs_plan_ord, disabled: !this.isExist }],
      // acs_vend: [{ value: this.accessoire.acs_vend, disabled: !this.isExist }],

      // acs_ord_min: [{ value: this.accessoire.acs_ord_min, disabled: !this.isExist }],
      // acs_timefence: [{ value: this.accessoire.acs_timefence, disabled: !this.isExist }],
      // acs_po_site: [{ value: this.accessoire.acs_po_site, disabled: !this.isExist }],
      // acs_ord_max: [{ value: this.accessoire.acs_ord_max, disabled: !this.isExist }],
      // acs_pm_code: [{ value: this.accessoire.acs_pm_code, disabled: !this.isExist }],
      // acs_ord_mult: [{ value: this.accessoire.acs_ord_mult, disabled: !this.isExist }],
      // acs_ord_pol: [{ value: this.accessoire.acs_ord_pol, disabled: !this.isExist }],
      // acs_cfg_type: [{ value: this.accessoire.acs_cfg_type, disabled: !this.isExist }],
      // acs_op_yield: [{ value: this.accessoire.acs_op_yield, disabled: !this.isExist }],
      // acs_ord_qty: [{ value: this.accessoire.acs_ord_qty, disabled: !this.isExist }],
      // acs_insp_rqd: [{ value: this.accessoire.acs_insp_rqd, disabled: !this.isExist }],
      // acs_yield_pct: [{ value: this.accessoire.acs_yield_pct, disabled: !this.isExist }],
      // acs_insp_lead: [{ value: this.accessoire.acs_insp_lead, disabled: !this.isExist }],
      // acs_run: [{ value: this.accessoire.acs_run, disabled: !this.isExist }],
      // acs_ord_per: [{ value: this.accessoire.acs_ord_per, disabled: !this.isExist }],
      // acs_mfg_lead: [{ value: this.accessoire.acs_mfg_lead, disabled: !this.isExist }],
      // acs_pur_lead: [{ value: this.accessoire.acs_pur_lead, disabled: !this.isExist }],
      // acs_setup: [{ value: this.accessoire.acs_setup, disabled: !this.isExist }],
      // acs_sfty_stk: [{ value: this.accessoire.acs_sfty_stk, disabled: !this.isExist }],
      // acs_sfty_time: [{ value: this.accessoire.acs_sfty_time, disabled: !this.isExist }],
      // acs_rop: [{ value: this.accessoire.acs_rop, disabled: !this.isExist }],
      // acs_atp_family: [{ value: this.accessoire.acs_atp_family, disabled: !this.isExist }],
      // acs_network: [{ value: this.accessoire.acs_network, disabled: !this.isExist }],
      // acs_run_seq1: [{ value: this.accessoire.acs_run_seq1, disabled: !this.isExist }],
      // acs_routing: [{ value: this.accessoire.acs_routing, disabled: !this.isExist }],
      // acs_iss_pol: [{ value: this.accessoire.acs_iss_pol, disabled: !this.isExist }],
      // acs_run_seq2: [{ value: this.accessoire.acs_run_seq2, disabled: !this.isExist }],
      // acs_bom_code: [{ value: this.accessoire.acs_bom_code, disabled: !this.isExist }],
   // });
    // this.form4 = this.formBuilder.group({
    //   acs_price: [{ value: this.accessoire.acs_price, disabled: !this.isExist }],
    //   acs_pur_price: [{ value: this.accessoire.acs_pur_price, disabled: !this.isExist }],
    //   acs_taxable: [{ value: this.accessoire.acs_taxable, disabled: !this.isExist }],
    //   acs_taxc: [{ value: this.accessoire.acs_taxc, disabled: !this.isExist },Validators.required],
    // });

    this.sct1 = new CostSimulation();
    this.sctForm = this.formBuilder.group({
      sct_mtl_tl: [0],
      sct_mtl_ll: [0],
      sct_lbr_tl: [0],
      sct_lbr_ll: [0],
      sct_bdn_tl: [0],
      sct_bdn_ll: [0],
      sct_ovh_tl: [0],
      sct_ovh_ll: [0],
      sct_sub_tl: [0],
      sct_sub_ll: [0],
    });
    this.sctForm1 = this.formBuilder.group({
      sct_mtl_tl: [0],
      sct_mtl_ll: [0],
      sct_lbr_tl: [0],
      sct_lbr_ll: [0],
      sct_bdn_tl: [0],
      sct_bdn_ll: [0],
      sct_ovh_tl: [0],
      sct_ovh_ll: [0],
      sct_sub_tl: [0],
      sct_sub_ll: [0],
    });
  }




  onChangeCode() {
    const controls1 = this.form1.controls
    // const controls2 = this.form2.controls
    // const controls3 = this.form3.controls
    // const controls4 = this.form4.controls

    this.accessoireService
        .getByOne({
            acs_desc1: controls1.acs_desc1.value,
        })
        .subscribe((response: any) => {
        
            if (response.data) {
                this.isExist3 = true
                console.log(response.data)
            } else {
             
            
              //controls1.acs_um.enable()
              //controls1.acs_prod_line.enable()
              controls1.acs_part_type.enable()
              controls1.acs_draw.enable()
              //controls1.acs_status.enable()
              controls1.acs_rev.enable()
              //controls1.acs_upc.enable()
              controls1.acs_dsgn_grp.enable()
              controls1.acs_group.enable()
              // controls1.acs_drwg_loc.enable()
              // controls1.acs_drwg_size.enable()
              // controls1.acs_promo.enable()
              // controls1.acs_break_cat.enable()
              controls1.acs_abc.enable()
              // controls1.acs_avg_int.enable()
              // controls1.acs_lot_ser.enable()
              // controls1.acs_cyc_int.enable()
              controls1.acs_site.enable()
              // controls1.acs_shelflife.enable()
              controls1.acs_loc.enable()
              // controls1.acs_sngl_lot.enable()
              // controls1.acs_loc_type.enable()
              // controls1.acs_critical.enable()
              // controls1.acs_auto_lot.enable()
              // controls1.acs_rctpo_status.enable()
              // controls1.acs_rctpo_active.enable()
              // controls1.acs_lot_grp.enable()
              // controls1.acs_rctwo_status.enable()
              // controls1.acs_rctwo_active.enable()
               controls1.acs_article.enable()
              // controls2.acs_ship_wt.enable()
              // controls2.acs_ship_wt_um.enable()
              // controls2.acs_net_wt.enable()
              // controls2.acs_net_wt_um.enable()
              // controls2.acs_fr_class.enable()
              // controls2.acs_size.enable()
              // controls2.acs_size_um.enable()
              // controls3.acs_ms.enable()
              // controls3.acs_buyer.enable()
              // controls3.acs_phantom.enable()
              // controls3.acs_plan_ord.enable()
              controls1.acs_vend.enable()
              // controls3.acs_ord_min.enable()
              // controls3.acs_timefence.enable()
              // controls3.acs_po_site.enable()
              // controls3.acs_ord_max.enable()
              // controls3.acs_pm_code.enable()
              // controls3.acs_ord_mult.enable()
              // controls3.acs_ord_pol.enable()
              // controls3.acs_cfg_type.enable()
              // controls3.acs_op_yield.enable()
              // controls3.acs_ord_qty.enable()
              // controls3.acs_insp_rqd.enable()
              // controls3.acs_yield_pct.enable()
              // controls3.acs_insp_lead.enable()
              // controls3.acs_run.enable()
              // controls3.acs_ord_per.enable()
              // controls3.acs_mfg_lead.enable()
              // controls3.acs_pur_lead.enable()
              // controls3.acs_setup.enable()
              // controls3.acs_sfty_stk.enable()
              // controls3.acs_sfty_time.enable()
              // controls3.acs_rop.enable()
              // controls3.acs_atp_family.enable()
              // controls3.acs_network.enable()
              // controls3.acs_run_seq1.enable()
              // controls3.acs_routing.enable()
              // controls3.acs_iss_pol.enable()
              // controls3.acs_run_seq2.enable()
              // controls3.acs_bom_code.enable()
              controls1.acs_price.enable()
              controls1.acs_pur_price.enable()
              controls1.acs_taxable.enable()
              controls1.acs_taxc.enable()
              controls1.acs_marge.enable()
              controls1.acs_sales_price.enable()
              

            }
        })
}
//reste form
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
   
    if (this.error) {
      this.hasFormErrors1 = true;
      return;
    }
    // tslint:disable-next-line:prefer-const
    this.sequenceService.getByOne({ seq_type: "AC" }).subscribe(
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
          
        
          let item = this.prepareItem();
          let sct1 = this.prepareSct1();
          let sct2 = this.prepareSct2()
          this.addItem(item, sct1, sct2);
      
  }else {
    this.message = "Parametrage Monquant pour la sequence";
    this.hasFormErrors1 = true;
    return;

   }


})


    // let item = this.prepareItem();
    // let sct1 = this.prepareSct1();
    // let sct2 = this.prepareSct2()
    // this.addItem(item, sct1, sct2);
  }
  /**
   *
   * Returns object for saving
   */
  prepareItem(): Accessoire {
    const controls1 = this.form1.controls;
    // const controls2 = this.form2.controls;
    // const controls3 = this.form3.controls;
    // const controls4 = this.form4.controls;

    const _item = new Accessoire();
    _item.acs_part = this.code;
  
    _item.acs_desc1 = controls1.acs_desc1.value;
    _item.acs_um = "UN";
   // _item.acs_prod_line = controls1.acs_prod_line.value;
    _item.acs_part_type = controls1.acs_part_type.value;
    _item.acs_draw = controls1.acs_draw.value;
    _item.acs_status = "pf-actif";
    _item.acs_rev = controls1.acs_rev.value;
   //_item.acs_upc = controls1.acs_upc.value;
   
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
    // _item.acs_shelflife = controls1.acs_shelflife.value;
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
    _item.acs_taxable = controls1.acs_taxable.value;
    _item.acs_taxc = controls1.acs_taxc.value;

    return _item;
  }
  /**
   * Add item
   *
   * @param _item: ItemModel
   */
  addItem(accessoire: Accessoire, sct1: CostSimulation, sct2: CostSimulation) {
    this.loadingSubject.next(true);
    this.accessoireService.add(accessoire).subscribe(
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

        this.sctService.add(sct1).subscribe(
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
            this.sctService.add(sct2).subscribe(
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
            );
          }
        );
      }
    );
  }

  prepareSct1(): CostSimulation {
    const controls = this.sctForm.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    
    _sct.sct_sim = 'STDCG'
    _sct.sct_part = this.code;
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
    _sct.sct_cst_tot  = (_sct.sct_mtl_tl + _sct.sct_mtl_ll +  _sct.sct_lbr_tl +  _sct.sct_lbr_ll + _sct.sct_bdn_tl + _sct.sct_bdn_ll + _sct.sct_ovh_tl + _sct.sct_ovh_ll + _sct.sct_sub_tl + _sct.sct_sub_ll)
    _sct.sct_site = control1.acs_site.value;

    return _sct;
  }

  prepareSct2(): CostSimulation {
    const controls = this.sctForm1.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    _sct.sct_sim = 'STDCR'
    _sct.sct_part = this.code;
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
    _sct.sct_cst_tot = (_sct.sct_mtl_tl + _sct.sct_mtl_ll +  _sct.sct_lbr_tl +  _sct.sct_lbr_ll + _sct.sct_bdn_tl + _sct.sct_bdn_ll +  _sct.sct_ovh_tl + _sct.sct_ovh_ll + _sct.sct_sub_tl + _sct.sct_sub_ll)
    _sct.sct_site = control1.acs_site.value;
    return _sct;
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/articles/list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
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

  
 /* changePl() {
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

  changeStatus(field) {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah

    let is_status: any;
    if (field == "acs_rctpo_status") {
      this.msg = " Status reception OA ";
       is_status = controls.acs_rctpo_status.value;
      
    }
    if (field == "acs_rctwo_status") {
      this.msg = " Status Reception WO ";
       is_status = controls.acs_rctwo_status.value;
      
    }

    this.inventoryStatusService.getBy({is_status}).subscribe(
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
    const controls2 = this.form2.controls;
    const controls3 = this.form3.controls;
    const controls4 = this.form4.controls;

    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "acs_status": {
            controls1.acs_status.setValue(item.code_value || "");
            break;
          }
          case "acs_dsgn_grp": {
            controls1.acs_dsgn_grp.setValue(item.code_value || "");
            break;
          }
          case "acs_um": {
            controls1.acs_um.setValue(item.code_value || "");
            break;
          }
          case "acs_network": {
            controls3.acs_network.setValue(item.code_value || "");
            break;
          }
          default:
            break;
        }
      });
    }
  }


  handleSelectedRowsChangedstatus(e, args) {
    const controls1 = this.form1.controls;
    
    if (Array.isArray(args.rows) && this.gridObjstatus) {
      args.rows.map((idx) => {
        const item = this.gridObjstatus.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "acs_rctpo_status": {
            controls1.acs_rctpo_status.setValue(item.is_status || "");
            break;
          }
          case "acs_rctwo_status": {
            controls1.acs_rctwo_status.setValue(item.is_status || "");
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
        const item = this.gridObjsite.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "acs_site": {
            controls1.acs_site.setValue(item.si_site || "");
            break;
          }
         
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
        controls1.acs_prod_line.setValue(item.pl_prod_line || "");
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
          case "acs_loc": {
            controls1.acs_loc.setValue(item.loc_loc || "");
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
        const item = this.gridObjprov.getDataItem(idx);
        controls.acs_vend.setValue(item.vd_addr || "");
        controls.vendname.setValue(item.address.ad_name || "");
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

  


  angularGridReadystatus(angularGrid: AngularGridInstance) {
    this.angularGridstatus = angularGrid;
    this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridstatus() {
    this.columnDefinitionsstatus = [
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
        id: "is_status",
        name: "Status",
        field: "is_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_desc",
        name: "Designation",
        field: "is_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_avail",
        name: "Disponible",
        field: "is_avail",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_nettable",
        name: "Gerer MRP",
        field: "is_nettable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_overissue",
        name: "Sortie Excedent",
        field: "is_overissue",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },


    ];

    this.gridOptionsstatus = {
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
    this.inventoryStatusService
      .getAll()
      .subscribe((response: any) => (this.datastatus = response.data));
  }
  openstatus(content, field) {
    this.selectedField = field;
    this.prepareGridstatus();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChangedtax(e, args) {
    const controls = this.form1.controls
    if (Array.isArray(args.rows) && this.gridObjtax) {
        args.rows.map((idx) => {
            const item = this.gridObjtax.getDataItem(idx)
            controls.acs_taxc.setValue(item.tx2_tax_code || "")
            this.tauxtaxe = item.tx2_tax_pct
           this.calculateprice()
          })
    }
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
calculateprice(){
  const controls = this.form1.controls
  if (controls.acs_taxable.value == true) {
    controls.acs_sales_price.setValue(Number(controls.acs_price.value) * (100 + Number(this.tauxtaxe)) / 100)
    }
    else {
      controls.acs_sales_price.setValue(Number(controls.acs_price.value) )
   

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
// onChangeCodemstr(field) {
//   const controls = this.codeForm.controls
//   this.codeService
//       .getBy({
//           code_value: controls.code_value.value,
//           code_fldname: field,
//       })
//       .subscribe((response: any) => {
//           if (response.data.length) {
//               this.isExist = true
//               console.log(response.data.length)
//           } else {
//               controls.code_cmmt.enable()
//            }
//       })
// }

onChangeCodemstr() {
  const controls1 = this.form1.controls

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

// opencode(content, field) {
//   this.createCodeForm()
//   this.selectedField = field;
// this.fieldcode = field;
//   this.modalService.open(content, { size: "lg" });
//}
opencode(content, field) {
  this.isExist3 = false
  this.createCodeForm()
  this.selectedField = field;
this.fieldcode = field;
const controls = this.codeForm.controls
this.sequenceService.getByOne({ seq_type: "CD" }).subscribe(
  (response: any) => {
this.seq = response.data
console.log(this.seq)   
    if (this.seq) {
     this.valuecode = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
     console.log(this.seq.seq_prefix)
     console.log(this.seq.seq_curr_val)
     
    console.log(this.valuecode)
    controls.code_value.setValue(this.valuecode)
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

   this.codeService
      .getBy({
          code_value: controls.code_value.value,
          code_fldname: this.fieldcode,
      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist3 = true
              console.log(response.data.length)
          } else {
              controls.code_cmmt.enable()
              document.getElementById("code_cmmt").focus();

           }
      })

  this.modalService.open(content, { size: "lg" });
  })
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
  this.onChangeCodemstr()

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
          this.listcode();
      }
     
  )
  
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


/******************************************************************* */
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
        controls1.acs_vend.setValue(this.code)
        controls1.vendname.setValue(controls.ad_name.value)
    
    
    
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

/******************************************************************* */
}
