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

import { FormBuilder, FormGroup, NgControlStatus, Validators } from "@angular/forms";
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
  Formatters,
  AngularGridInstance,
  FieldType,
  OnEventArgs,
  GridService,
} from "angular-slickgrid";

import {
  CodeService,
  Address,
  Provider,
  AddressService,
  Code,
  Glasses,
  GlassesService,
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
  BankService,
} from "../../../../core/erp";
import { _isNumberValue } from '@angular/cdk/coercion';
import { isNull } from "lodash";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from "@angular/cdk/overlay/overlay-directives";

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
  selector: 'kt-create-glasses',
  templateUrl: './create-glasses.component.html',
  styleUrls: ['./create-glasses.component.scss']
})
export class CreateGlassesComponent implements OnInit {

  glasses: Glasses;
  codemstr: Code;
  hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;
  hasFormErrors  = false;
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

  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  site: any;
  loc: any;
  
  datataxv: []
  columnDefinitionstaxv: Column[] = []
  gridOptionstaxv: GridOption = {}
  gridObjtaxv: any
  angularGridtaxv: AngularGridInstance


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
  valuecode;

  isExist = false;
  isExist2 = false;
  isExist3 = false;
  sct1: CostSimulation;
  sct2: CostSimulation;

  sctForm: FormGroup;
  sctForm1: FormGroup;
  seq: any;
  code: any;
  message: String;

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  address: Address
    addressForm: FormGroup
    provider: Provider
    providerForm: FormGroup
    hasFormErrors5 = false
    hasFormErrors6 = false
    hasProviderFormErrors = false

    datacode: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;
    fldname;
    codevalue;
    taux_taxe = 0;
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
    private addressService: AddressService,
    private glassesService: GlassesService,
    private sequenceService: SequenceService,
    private mesureService: MesureService,
    private taxService: TaxeService,
    private bankService: BankService,
    private inventoryStatusService: InventoryStatusService
  ) {
    config.autoClose = true;
    this.prepareGrid();
    this.prepareGrid2();
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
    this.initmvGrid();
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
          this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , glsd_price: args.dataContext.glsd_pur_price * (100 + args.dataContext.glsd_marge) / 100 , glsd_sales_price: ( args.dataContext.glsd_pur_price * (100 + args.dataContext.glsd_marge) / 100)* (100+ this.taux_taxe)/ 100 })

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
          this.mvgridService.updateItemById(args.dataContext.id,{...args.dataContext , glsd_price: args.dataContext.glsd_pur_price * (100 + args.dataContext.glsd_marge) / 100, glsd_sales_price: ( args.dataContext.glsd_pur_price * (100 + args.dataContext.glsd_marge) / 100)* (100+ this.taux_taxe)/ 100 })

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
    this.glasses = new Glasses();
    this.form1 = this.formBuilder.group({
    //  gls_part: [this.glasses.gls_part,Validators.required],
      gls_desc1: [this.glasses.gls_desc1 ,Validators.required],
   //   gls_um: [{ value: this.glasses.gls_desc1, disabled: !this.isExist },Validators.required],
      //gls_prod_line: [{ value: this.glasses.gls_prod_line, disabled: !this.isExist },Validators.required],
      gls_part_type: [ this.glasses.gls_part_type ,Validators.required],
      gls_upc: [ this.glasses.gls_upc ,Validators.required],
      gls_draw: [ this.glasses.gls_draw ,Validators.required],
      gls_dsgn_grp: [ this.glasses.gls_dsgn_grp ],
      gls_group: [ this.glasses.gls_group ],
      gls_rev: [ this.glasses.gls_rev,Validators.required ],
      gls_promo: [ this.glasses.gls_promo,Validators.required ],

      // gls_status: [ this.glasses.gls_status },Validators.required],
    
      gls_vend: [ this.glasses.gls_vend ],
      vendname: [{value: null, disabled:true}],
    
      gls_abc: [ this.glasses.gls_abc ,Validators.required],
      gls_avg_int: [ this.glasses.gls_avg_int ],
      gls_lot_ser: [ this.glasses.gls_lot_ser ],
      gls_cyc_int: [ this.glasses.gls_cyc_int ],
      gls_site: [ this.glasses.gls_site ,Validators.required],
      gls_shelflife: [ this.glasses.gls_shelflife ],
      gls_loc: [ this.glasses.gls_loc ,Validators.required],
      gls_sngl_lot: [ this.glasses.gls_sngl_lot ],
      gls_loc_type: [ this.glasses.gls_loc_type ],
      gls_critical: [ this.glasses.gls_critical ],
      gls_auto_lot: [ this.glasses.gls_auto_lot ],
      gls_rctpo_status: [ this.glasses.gls_rctpo_status ],
      gls_rctpo_active: [ this.glasses.gls_rctpo_active ],
      gls_lot_grp: [ this.glasses.gls_lot_grp ],
      gls_rctwo_status: [ this.glasses.gls_rctwo_status ],
      gls_rctwo_active: [ this.glasses.gls_rctwo_active ],
      gls_article: [ this.glasses.gls_article ],
     /* gls_sph_beging: [ this.glasses.gls_sph_beging }],
      gls_sph_end: [ this.glasses.gls_sph_end }],
      gls_cyl_beging: [ this.glasses.gls_cyl_beging }],
      gls_cyl_end: [ this.glasses.gls_cyl_end }],
      gls_add_beging: [ this.glasses.gls_add_beging }],
      gls_add_end: [ this.glasses.gls_add_end }],
      gls_prisme: [ this.glasses.gls_prisme }],
      gls_base: [ this.glasses.gls_base }],
      gls_price: [ this.glasses.gls_price }],
      gls_pur_price: [ this.glasses.gls_pur_price }],*/
      gls_taxable: [ this.glasses.gls_taxable ],
      gls_taxc: [ this.glasses.gls_taxc ,Validators.required],
      gls_net_wt: [ this.glasses.gls_net_wt ,Validators.required],
      gls_size: [ this.glasses.gls_size ],
    });

        const controls = this.form1.controls;
    this.siteService.getByOne({ si_default: true  }).subscribe(
      (res: any) => {
      this.site = res.data.si_site
      
      controls.gls_site.setValue(this.site );
     
    })

    const controls1 = this.form1.controls;
    this.locationService.getByOne({ loc_perm: true  }).subscribe(
      (res: any) => {
      this.loc = res.data.loc_loc
      
      controls.gls_loc.setValue(this.loc );
     
    })
    controls.gls_abc.setValue("A" );
    controls.gls_taxable.setValue(true );
   
    
    /*this.form2 = this.formBuilder.group({
      gls_ship_wt: [ this.glasses.gls_ship_wt, disabled: !this.isExist }],
      gls_ship_wt_um: [ this.glasses.gls_ship_wt_um, disabled: !this.isExist }],
     // gls_net_wt: [ this.glasses.gls_net_wt, disabled: !this.isExist }],
     // gls_net_wt_um: [ this.glasses.gls_net_wt_um, disabled: !this.isExist }],
     // gls_fr_class: [ this.glasses.gls_fr_class, disabled: !this.isExist }],
     // gls_size: [ this.glasses.gls_size, disabled: !this.isExist }],
     // gls_size_um: [ this.glasses.gls_size_um, disabled: !this.isExist }],
     

    });*/
    /*this.form3 = this.formBuilder.group({
      gls_ms: [{ value: this.glasses.gls_ms, disabled: !this.isExist }],
      gls_buyer: [{ value: this.glasses.gls_buyer, disabled: !this.isExist }],
      gls_rev: [{ value: this.glasses.gls_rev, disabled: !this.isExist }],
      gls_plan_ord: [{ value: this.glasses.gls_plan_ord, disabled: !this.isExist }],
      
      gls_ord_min: [{ value: this.glasses.gls_ord_min, disabled: !this.isExist }],
      gls_timefence: [{ value: this.glasses.gls_timefence, disabled: !this.isExist }],
      gls_po_site: [{ value: this.glasses.gls_po_site, disabled: !this.isExist }],
      gls_ord_max: [{ value: this.glasses.gls_ord_max, disabled: !this.isExist }],
      gls_pm_code: [{ value: this.glasses.gls_pm_code, disabled: !this.isExist }],
      gls_ord_mult: [{ value: this.glasses.gls_ord_mult, disabled: !this.isExist }],
      gls_ord_pol: [{ value: this.glasses.gls_ord_pol, disabled: !this.isExist }],
      gls_cfg_type: [{ value: this.glasses.gls_cfg_type, disabled: !this.isExist }],
      gls_op_yield: [{ value: this.glasses.gls_op_yield, disabled: !this.isExist }],
      gls_ord_qty: [{ value: this.glasses.gls_ord_qty, disabled: !this.isExist }],
      gls_insp_rqd: [{ value: this.glasses.gls_insp_rqd, disabled: !this.isExist }],
      gls_yield_pct: [{ value: this.glasses.gls_yield_pct, disabled: !this.isExist }],
      gls_insp_lead: [{ value: this.glasses.gls_insp_lead, disabled: !this.isExist }],
      gls_run: [{ value: this.glasses.gls_run, disabled: !this.isExist }],
      gls_ord_per: [{ value: this.glasses.gls_ord_per, disabled: !this.isExist }],
      gls_mfg_lead: [{ value: this.glasses.gls_mfg_lead, disabled: !this.isExist }],
      gls_pur_lead: [{ value: this.glasses.gls_pur_lead, disabled: !this.isExist }],
      gls_setup: [{ value: this.glasses.gls_setup, disabled: !this.isExist }],
      gls_sfty_stk: [{ value: this.glasses.gls_sfty_stk, disabled: !this.isExist }],
      gls_sfty_time: [{ value: this.glasses.gls_sfty_time, disabled: !this.isExist }],
      gls_rop: [{ value: this.glasses.gls_rop, disabled: !this.isExist }],
      gls_atp_family: [{ value: this.glasses.gls_atp_family, disabled: !this.isExist }],
      gls_network: [{ value: this.glasses.gls_network, disabled: !this.isExist }],
      gls_run_seq1: [{ value: this.glasses.gls_run_seq1, disabled: !this.isExist }],
      gls_routing: [{ value: this.glasses.gls_routing, disabled: !this.isExist }],
      gls_iss_pol: [{ value: this.glasses.gls_iss_pol, disabled: !this.isExist }],
      gls_run_seq2: [{ value: this.glasses.gls_run_seq2, disabled: !this.isExist }],
      gls_bom_code: [{ value: this.glasses.gls_bom_code, disabled: !this.isExist }],
    });*/
  /*  this.form4 = this.formBuilder.group({
      gls_price: [{ value: this.glasses.gls_price, disabled: !this.isExist }],
      gls_pur_price: [{ value: this.glasses.gls_pur_price, disabled: !this.isExist }],
      gls_taxable: [{ value: this.glasses.gls_taxable, disabled: !this.isExist }],
      gls_taxc: [{ value: this.glasses.gls_taxc, disabled: !this.isExist },Validators.required],
    });
*/
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
    //const controls3 = this.form3.controls
    //const controls4 = this.form4.controls

    this.glassesService
        .getByOne({
            gls_desc1: controls1.gls_desc1.value,
        })
        .subscribe((response: any) => {
        console.log("here", response.data)
            if (response.data) {
                this.isExist = true
                console.log(response.data)
            } else {
             
            //  controls1.gls_um.enable()
              //controls1.gls_prod_line.enable()
              controls1.gls_part_type.enable()
              controls1.gls_draw.enable()
            //  controls1.gls_status.enable()
              controls1.gls_upc.enable()
              controls1.gls_dsgn_grp.enable()
              controls1.gls_group.enable()
              controls1.gls_vend.enable()
              //controls1.gls_drwg_size.enable()
              //controls1.gls_promo.enable()
              //controls1.gls_break_cat.enable()
              controls1.gls_abc.enable()
              controls1.gls_avg_int.enable()
              controls1.gls_lot_ser.enable()
              controls1.gls_cyc_int.enable()
              controls1.gls_site.enable()
              controls1.gls_shelflife.enable()
              controls1.gls_loc.enable()
              controls1.gls_sngl_lot.enable()
              controls1.gls_loc_type.enable()
              controls1.gls_critical.enable()
              controls1.gls_auto_lot.enable()
              controls1.gls_rctpo_status.enable()
              controls1.gls_rctpo_active.enable()
              controls1.gls_lot_grp.enable()
              controls1.gls_rctwo_status.enable()
              controls1.gls_rctwo_active.enable()
              controls1.gls_article.enable()
     //         controls2.gls_ship_wt.enable()
       //       controls2.gls_ship_wt_um.enable()
              controls1.gls_net_wt.enable()
              //controls2.gls_net_wt_um.enable()
              //controls2.gls_fr_class.enable()
              controls1.gls_size.enable()
              //controls2.gls_size_um.enable()
              
          /*    controls1.gls_sph_beging.enable()
              controls1.gls_sph_end.enable()
              controls1.gls_cyl_beging.enable()
              controls1.gls_cyl_end.enable()
              controls1.gls_add_beging.enable()
              controls1.gls_add_end.enable()
              controls1.gls_prisme.enable()
              controls1.gls_base.enable()
              controls1.gls_price.enable()
              controls1.gls_pur_price.enable()*/
              controls1.gls_taxable.enable()
              controls1.gls_taxc.enable()
        

            }
        })
}
//reste form
  //reste form
  reset() {
    this.glasses = new Glasses();
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
    //const controls2 = this.form2.controls;
    //const controls3 = this.form3.controls;
    //const controls4 = this.form4.controls;

    /** check form */
    if (this.form1.invalid) {
      Object.keys(controls1).forEach((controlName) =>
        controls1[controlName].markAsTouched()
      );

      this.hasFormErrors1 = true;
      return;
    }
    console.log("submit",controls1.gls_rev.value )
   /* if(controls1.gls_rev.value == "" ||   isNull(controls1.gls_rev.value) ) {
      this.hasFormErrors1 = true;
      return;
      
    }*/
    /*if (this.form2.invalid) {
      Object.keys(controls2).forEach((controlName) =>
        controls2[controlName].markAsTouched()
      );

      this.hasFormErrors2 = true;
      return;
    }
    if (this.form3.invalid) {
      Object.keys(controls3).forEach((controlName) =>
        controls3[controlName].markAsTouched()
      );

      this.hasFormErrors3 = true;
      return;
    }
    if (this.form4.invalid) {
      Object.keys(controls4).forEach((controlName) =>
        controls4[controlName].markAsTouched()
      );

      this.hasFormErrors4 = true;
      return;
    }*/
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhh",controls1.gls_rev.value )

    if (this.error) {
      this.hasFormErrors1 = true;
      return;
    }

    this.sequenceService.getByOne({ seq_type: "VR" }).subscribe(
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
          for (let data of this.mvdataset) {
            delete data.id;
           // delete data.cmvid;
            if( data.glsd_add_min == ""){
              data.glsd_add_min = null
            }
            if( data.glsd_add_max == ""){
              data.glsd_add_max = null
            }
          }
          console.log(this.mvdataset)
          let item = this.prepareItem();
          let sct1 = this.prepareSct1();
          let sct2 = this.prepareSct2()
          this.addItem(item,this.mvdataset, sct1, sct2);
      
  }else {
    this.message = "Parametrage Monquant pour la sequence";
    this.hasFormErrors1 = true;
    return;

   }


})

    // tslint:disable-next-line:prefer-const
  }
  /**
   *
   * Returns object for saving
   */
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
     var descgroup = ""
  
     for (let dat of this.gls_group) {
      if (dat.code_value == controls1.gls_group.value) {
        descgroup = dat.code_cmmt
      }

     }
     var descdsgn = ""
  
     for (let dat of this.gls_dsgn_grp) {
      if (dat.code_value == controls1.gls_dsgn_grp.value) {
        descdsgn = dat.code_cmmt
      }

     }
var ind = ""
     if(controls1.gls_net_wt.value != null) {ind = String(controls1.gls_net_wt.value) }
    var  desc = descdsgn + " " + ind  + " " + descpromo + " " + descupc
    controls1.gls_desc1.setValue(desc)
   } 

  //  controls1.gls_desc1.setValue(controls1.gls_desc1.value + " " +  descpromo)

//sousfamille indice  couleur traitement
  }
  prepareItem(): Glasses {
    const controls1 = this.form1.controls;
    //const controls2 = this.form2.controls;
    //const controls3 = this.form3.controls;
    //const controls4 = this.form4.controls;
    const _glasses = new Glasses();
    _glasses.gls_part = this.code;
    _glasses.gls_desc1 = controls1.gls_desc1.value;
    _glasses.gls_um = "UN";
   // _glasses.gls_prod_line = controls1.gls_prod_line.value;
   //console.log(controls1.SM.value, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
   //if (controls1.SM.value == true) { rev = "M"} else { if(controls1.SF.value == true) { rev = "F"} else {rev = "RX"}}
    _glasses.gls_part_type = controls1.gls_part_type.value;
    _glasses.gls_draw = controls1.gls_draw.value;
    _glasses.gls_status = "pf-actif";
    _glasses.gls_promo = controls1.gls_promo.value;
    _glasses.gls_upc = controls1.gls_upc.value;
    _glasses.gls_vend = controls1.gls_vend.value;
    _glasses.gls_dsgn_grp = controls1.gls_dsgn_grp.value;
    _glasses.gls_group = controls1.gls_group.value;
    _glasses.gls_rev = controls1.gls_rev.value;
   // _glasses.gls_drwg_loc = controls1.gls_drwg_loc.value;
    //_glasses.gls_drwg_size = controls1.gls_drwg_size.value;
    //_glasses.gls_promo = controls1.gls_promo.value;
    //_glasses.gls_break_cat = controls1.gls_break_cat.value;
    _glasses.gls_abc = controls1.gls_abc.value;
    _glasses.gls_avg_int = controls1.gls_avg_int.value;
    _glasses.gls_lot_ser = controls1.gls_lot_ser.value;
    _glasses.gls_cyc_int = controls1.gls_cyc_int.value;
    _glasses.gls_site = controls1.gls_site.value;
   // _glasses.gls_shelflife = controls1.gls_shelflife.value;
    _glasses.gls_loc = controls1.gls_loc.value;
   // _glasses.gls_sngl_lot = controls1.gls_sngl_lot.value;
   // _glasses.gls_loc_type = controls1.gls_loc_type.value;
   // _glasses.gls_critical = controls1.gls_critical.value;
   // _glasses.gls_auto_lot = controls1.gls_auto_lot.value;
    //_glasses.gls_rctpo_status = controls1.gls_rctpo_status.value;
   // _glasses.gls_rctpo_active = controls1.gls_rctpo_active.value;
   // _glasses.gls_lot_grp = controls1.gls_lot_grp.value;
   // _glasses.gls_rctwo_status = controls1.gls_rctwo_status.value;
   // _glasses.gls_rctwo_active = controls1.gls_rctwo_active.value;
    _glasses.gls_article = controls1.gls_article.value;
    /*_glasses.gls_sph_beging = controls1.gls_sph_beging.value;
    _glasses.gls_sph_end    = controls1.gls_sph_end.value;
    _glasses.gls_cyl_beging = controls1.gls_cyl_beging.value;
    _glasses.gls_cyl_end    = controls1.gls_cyl_end.value;
    
   _glasses.gls_add_beging = controls1.gls_add_beging.value;
   _glasses.gls_add_end    = controls1.gls_add_end.value;
   _glasses.gls_prisme     = controls1.gls_prisme.value;
   _glasses.gls_base       = controls1.gls_base.value;*/
    //_glasses.gls_ship_wt = controls2.gls_ship_wt.value;
    //_glasses.gls_ship_wt_um = controls2.gls_ship_wt_um.value;
    

   // _glasses.gls_sph_beging = controls2.gls_sph_beging.value;
   // _glasses.gls_sph_end    = controls2.gls_sph_end.value;
   // _glasses.gls_cyl_beging = controls2.gls_cyl_beging.value;
   // _glasses.gls_cyl_end    = controls2.gls_cyl_end.value;
    
  //  _glasses.gls_add_beging = controls2.gls_add_beging.value;
   // _glasses.gls_add_end    = controls2.gls_add_end.value;
    _glasses.gls_net_wt = controls1.gls_net_wt.value;
    //_glasses.gls_net_wt_um = controls2.gls_net_wt_um.value;
    //_glasses.gls_fr_class = controls2.gls_fr_class.value;
    _glasses.gls_size = controls1.gls_size.value;
    //_glasses.gls_size_um = controls2.gls_size_um.value;
/*
    _glasses.gls_ms = controls3.gls_ms.value;
    _glasses.gls_buyer = controls3.gls_buyer.value;
    _glasses.gls_rev = controls3.gls_rev.value;
    _glasses.gls_plan_ord = controls3.gls_plan_ord.value;
   

    _glasses.gls_ord_min = controls3.gls_ord_min.value;
    _glasses.gls_timefence = controls3.gls_timefence.value;
    _glasses.gls_po_site = controls3.gls_po_site.value;
    _glasses.gls_ord_max = controls3.gls_ord_max.value;
    _glasses.gls_pm_code = controls3.gls_pm_code.value;
    _glasses.gls_ord_mult = controls3.gls_ord_mult.value;
    _glasses.gls_ord_pol = controls3.gls_ord_pol.value;
    _glasses.gls_cfg_type = controls3.gls_cfg_type.value;
    _glasses.gls_op_yield = controls3.gls_op_yield.value;
    _glasses.gls_ord_qty = controls3.gls_ord_qty.value;
    _glasses.gls_insp_rqd = controls3.gls_insp_rqd.value;
    _glasses.gls_yield_pct = controls3.gls_yield_pct.value;
    _glasses.gls_insp_lead = controls3.gls_insp_lead.value;
    _glasses.gls_run = controls3.gls_run.value;
    _glasses.gls_ord_per = controls3.gls_ord_per.value;
    _glasses.gls_mfg_lead = controls3.gls_mfg_lead.value;
    _glasses.gls_pur_lead = controls3.gls_pur_lead.value;
    _glasses.gls_setup = controls3.gls_setup.value;
    _glasses.gls_sfty_stk = controls3.gls_sfty_stk.value;
    _glasses.gls_sfty_time = controls3.gls_sfty_time.value;
    _glasses.gls_rop = controls3.gls_rop.value;
    _glasses.gls_atp_family = controls3.gls_atp_family.value;
    _glasses.gls_network = controls3.gls_network.value;
    _glasses.gls_run_seq1 = controls3.gls_run_seq1.value;
    _glasses.gls_routing = controls3.gls_routing.value;
    _glasses.gls_iss_pol = controls3.gls_iss_pol.value;
    _glasses.gls_run_seq2 = controls3.gls_run_seq2.value;
    _glasses.gls_bom_code = controls3.gls_bom_code.value;
*/
  /*  _glasses.gls_price = controls1.gls_price.value;
    _glasses.gls_pur_price = controls1.gls_pur_price.value;
   */
    _glasses.gls_taxable = controls1.gls_taxable.value;
    _glasses.gls_taxc = controls1.gls_taxc.value;

    return _glasses;
  }
  /**
   * Add item
   *
   * @param _glasses: GlassesModel
   */
  addItem(_glasses: Glasses, details: any,sct1: CostSimulation, sct2: CostSimulation) {
    this.loadingSubject.next(true);
    this.glassesService.add({Glasses:_glasses, GlassesDetail: details}).subscribe(
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
                this.router.navigateByUrl("/articles/list-glasses");
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
    _sct.sct_site = control1.gls_site.value;

    return _sct;
  }

  prepareSct2(): CostSimulation {
    const controls = this.sctForm1.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    _sct.sct_sim = 'STDCR'
    _sct.sct_part = this.code
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
    _sct.sct_site = control1.gls_site.value;
    return _sct;
  }
  changeRadio(e) {
    console.log(e.target.value);
    console.log("here")
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
    const um_um = controls.gls_um.value;
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

  changeSeq() {
    const controls = this.form3.controls; // chof le champs hada wesh men form rah
    const seq_seq = controls.gls_buyer.value;
    this.sequenceService.getBy({ seq_seq }).subscribe(
      (res: any) => {
        const { data } = res;
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cette sequence n'existe pas!",
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
    const pl_prod_line = controls.gls_prod_line.value;
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
    
    if (field == "gls_dsgn_grp") {
      this.msg = " Groupe Etude ";
      const code_value = controls.gls_dsgn_grp.value;
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
    if (field == "gls_rctpo_status") {
      this.msg = " Status reception OA ";
       is_status = controls.gls_rctpo_status.value;
      
    }
    if (field == "gls_rctwo_status") {
      this.msg = " Status Reception WO ";
       is_status = controls.gls_rctwo_status.value;
      
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

  handleSelectedRowsChanged3(e, args) {
    const controls1 = this.form1.controls;
   // const controls2 = this.form2.controls;
    //const controls3 = this.form3.controls;
    //const controls4 = this.form4.controls;

    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "gls_status": {
            controls1.gls_status.setValue(item.code_value || "");
            break;
          }
          case "gls_dsgn_grp": {
            controls1.gls_dsgn_grp.setValue(item.code_value || "");
            break;
          }
          case "gls_um": {
            controls1.gls_um.setValue(item.code_value || "");
            break;
          }
      //    case "gls_network": {
      //      controls3.gls_network.setValue(item.code_value || "");
      //      break;
       //   }
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
          case "gls_rctpo_status": {
            controls1.gls_rctpo_status.setValue(item.is_status || "");
            break;
          }
          case "gls_rctwo_status": {
            controls1.gls_rctwo_status.setValue(item.is_status || "");
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
      .getBy({ loc_site: controls1.gls_site.value })
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
        controls.gls_vend.setValue(item.vd_addr || "");
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

  handleSelectedRowsChangedseq(e, args) {
    const controls = this.form3.controls;
    if (Array.isArray(args.rows) && this.gridObjseq) {
      args.rows.map((idx) => {
        const item = this.gridObjseq.getDataItem(idx);
        controls.gls_buyer.setValue(item.seq_seq || "");
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
            controls.gls_taxc.setValue(item.tx2_tax_code || "")
            this.taux_taxe = Number(item.tx2_tax_pct)
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
onChangeCodemstr() {
  const controls1 = this.form1.controls

    console.log(this.codevalue,this.selectedField)
    let cvalue = this.codevalue
    switch (this.selectedField) {
      case "gls_draw": {
        controls1.gls_draw.setValue(cvalue);
              break;
      }
      case "gls_promo": {
        controls1.gls_promo.setValue(cvalue);
        break;
      }
      case "gls_dsgn_grp": {
        controls1.gls_dsgn_grp.setValue(cvalue);
        break;
      }
      case "gls_group": {
        controls1.gls_group.setValue(cvalue);
        break;
      }
      case "gls_upc": {
        controls1.gls_upc.setValue(cvalue);
        break;
      }
      default:
        break;
    }
  
}

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
 // this.modalService.dismissAll()
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
              200,
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
