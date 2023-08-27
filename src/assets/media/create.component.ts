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
  Item,
  ItemService,
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
  selector: "kt-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
  providers: [NgbDropdownConfig, NgbTabsetConfig],
})
export class CreateComponent implements OnInit {
  item: Item;
  hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;

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
  pt_part_type: any[] = [];
  pt_draw: any[] = [];
  pt_rev: any[] = [];
  pt_group: any[] = [];
  pt_drwg_loc: any[] = [];
  pt_drwg_size: any[] = [];
  pt_abc: any[] = [];
  pt_loc_type: any[] = [];
  pt_ship_wt_um: any[] = [];
  pt_net_wt_um: any[] = [];
  pt_fr_class: any[] = [];
  pt_size_um: any[] = [];

  pt_pm_code: any[] = [];
  pt_run_seq1: any[] = [];
  pt_run_seq2: any[] = [];
  pt_promo: any[] = [];

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

  isExist = false;

  sct1: CostSimulation;
  sct2: CostSimulation;

  sctForm: FormGroup;
  sctForm1: FormGroup;

  constructor(
    config: NgbDropdownConfig,
    private formBuilder: FormBuilder,
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
    private itemService: ItemService,
    private sequenceService: SequenceService,
    private mesureService: MesureService,
    private taxService: TaxeService,
    private inventoryStatusService: InventoryStatusService
  ) {
    config.autoClose = true;
    this.prepareGrid();
    this.prepareGrid2();
    this.codeService
      .getBy({ code_fldname: "pt_part_type" })
      .subscribe((response: any) => (this.pt_part_type = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (this.pt_draw = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_rev" })
      .subscribe((response: any) => (this.pt_rev = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_group" })
      .subscribe((response: any) => (this.pt_group = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_drwg_loc" })
      .subscribe((response: any) => (this.pt_drwg_loc = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_drwg_size" })
      .subscribe((response: any) => (this.pt_drwg_size = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_abc" })
      .subscribe((response: any) => (this.pt_abc = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_loc_type" })
      .subscribe((response: any) => (this.pt_loc_type = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_ship_wt_um" })
      .subscribe((response: any) => (this.pt_ship_wt_um = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_net_wt_um" })
      .subscribe((response: any) => (this.pt_net_wt_um = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_fr_class" })
      .subscribe((response: any) => (this.pt_fr_class = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_size_um" })
      .subscribe((response: any) => (this.pt_size_um = response.data));

    this.codeService
      .getBy({ code_fldname: "pt_pm_code" })
      .subscribe((response: any) => (this.pt_pm_code = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_run_seq1" })
      .subscribe((response: any) => (this.pt_run_seq1 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_run_seq2" })
      .subscribe((response: any) => (this.pt_run_seq2 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_promo" })
      .subscribe((response: any) => (this.pt_promo = response.data));
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
    this.item = new Item();
    this.form1 = this.formBuilder.group({
      pt_part: [this.item.pt_part,Validators.required],
      pt_desc1: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
      pt_um: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
      pt_prod_line: [{ value: this.item.pt_prod_line, disabled: !this.isExist },Validators.required],
      pt_part_type: [{ value: this.item.pt_part_type, disabled: !this.isExist },Validators.required],
      pt_draw: [{ value: this.item.pt_draw, disabled: !this.isExist },Validators.required],
      pt_status: [{ value: this.item.pt_status, disabled: !this.isExist },Validators.required],
      pt_rev: [{ value: this.item.pt_rev, disabled: !this.isExist }],
      pt_dsgn_grp: [{ value: this.item.pt_dsgn_grp, disabled: !this.isExist }],
      pt_group: [{ value: this.item.pt_group, disabled: !this.isExist }],
      pt_drwg_loc: [{ value: this.item.pt_drwg_loc, disabled: !this.isExist }],
      pt_drwg_size: [{ value: this.item.pt_drwg_size, disabled: !this.isExist }],
      pt_promo: [{ value: this.item.pt_promo, disabled: !this.isExist }],
      pt_break_cat: [{ value: this.item.pt_break_cat, disabled: !this.isExist }],
      pt_abc: [{ value: this.item.pt_abc, disabled: !this.isExist },Validators.required],
      pt_avg_int: [{ value: this.item.pt_avg_int, disabled: !this.isExist }],
      pt_lot_ser: [{ value: this.item.pt_lot_ser, disabled: !this.isExist }],
      pt_cyc_int: [{ value: this.item.pt_cyc_int, disabled: !this.isExist }],
      pt_site: [{ value: this.item.pt_site, disabled: !this.isExist },Validators.required],
      pt_shelflife: [{ value: this.item.pt_shelflife, disabled: !this.isExist }],
      pt_loc: [{ value: this.item.pt_loc, disabled: !this.isExist },Validators.required],
      pt_sngl_lot: [{ value: this.item.pt_sngl_lot, disabled: !this.isExist }],
      pt_loc_type: [{ value: this.item.pt_loc_type, disabled: !this.isExist }],
      pt_critical: [{ value: this.item.pt_critical, disabled: !this.isExist }],
      pt_auto_lot: [{ value: this.item.pt_auto_lot, disabled: !this.isExist }],
      pt_rctpo_status: [{ value: this.item.pt_rctpo_status, disabled: !this.isExist }],
      pt_rctpo_active: [{ value: this.item.pt_rctpo_active, disabled: !this.isExist }],
      pt_lot_grp: [{ value: this.item.pt_lot_grp, disabled: !this.isExist }],
      pt_rctwo_status: [{ value: this.item.pt_rctwo_status, disabled: !this.isExist }],
      pt_rctwo_active: [{ value: this.item.pt_rctwo_active, disabled: !this.isExist }],
      pt_article: [{ value: this.item.pt_article, disabled: !this.isExist }],
    });
    this.form2 = this.formBuilder.group({
      pt_ship_wt: [{ value: this.item.pt_ship_wt, disabled: !this.isExist }],
      pt_ship_wt_um: [{ value: this.item.pt_ship_wt_um, disabled: !this.isExist }],
      pt_net_wt: [{ value: this.item.pt_net_wt, disabled: !this.isExist }],
      pt_net_wt_um: [{ value: this.item.pt_net_wt_um, disabled: !this.isExist }],
      pt_fr_class: [{ value: this.item.pt_fr_class, disabled: !this.isExist }],
      pt_size: [{ value: this.item.pt_size, disabled: !this.isExist }],
      pt_size_um: [{ value: this.item.pt_size_um, disabled: !this.isExist }],
    });
    this.form3 = this.formBuilder.group({
      pt_ms: [{ value: this.item.pt_ms, disabled: !this.isExist }],
      pt_buyer: [{ value: this.item.pt_buyer, disabled: !this.isExist }],
      pt_phantom: [{ value: this.item.pt_phantom, disabled: !this.isExist }],
      pt_plan_ord: [{ value: this.item.pt_plan_ord, disabled: !this.isExist }],
      pt_vend: [{ value: this.item.pt_vend, disabled: !this.isExist }],

      pt_ord_min: [{ value: this.item.pt_ord_min, disabled: !this.isExist }],
      pt_timefence: [{ value: this.item.pt_timefence, disabled: !this.isExist }],
      pt_po_site: [{ value: this.item.pt_po_site, disabled: !this.isExist }],
      pt_ord_max: [{ value: this.item.pt_ord_max, disabled: !this.isExist }],
      pt_pm_code: [{ value: this.item.pt_pm_code, disabled: !this.isExist }],
      pt_ord_mult: [{ value: this.item.pt_ord_mult, disabled: !this.isExist }],
      pt_ord_pol: [{ value: this.item.pt_ord_pol, disabled: !this.isExist }],
      pt_cfg_type: [{ value: this.item.pt_cfg_type, disabled: !this.isExist }],
      pt_op_yield: [{ value: this.item.pt_op_yield, disabled: !this.isExist }],
      pt_ord_qty: [{ value: this.item.pt_ord_qty, disabled: !this.isExist }],
      pt_insp_rqd: [{ value: this.item.pt_insp_rqd, disabled: !this.isExist }],
      pt_yield_pct: [{ value: this.item.pt_yield_pct, disabled: !this.isExist }],
      pt_insp_lead: [{ value: this.item.pt_insp_lead, disabled: !this.isExist }],
      pt_run: [{ value: this.item.pt_run, disabled: !this.isExist }],
      pt_ord_per: [{ value: this.item.pt_ord_per, disabled: !this.isExist }],
      pt_mfg_lead: [{ value: this.item.pt_mfg_lead, disabled: !this.isExist }],
      pt_pur_lead: [{ value: this.item.pt_pur_lead, disabled: !this.isExist }],
      pt_setup: [{ value: this.item.pt_setup, disabled: !this.isExist }],
      pt_sfty_stk: [{ value: this.item.pt_sfty_stk, disabled: !this.isExist }],
      pt_sfty_time: [{ value: this.item.pt_sfty_time, disabled: !this.isExist }],
      pt_rop: [{ value: this.item.pt_rop, disabled: !this.isExist }],
      pt_atp_family: [{ value: this.item.pt_atp_family, disabled: !this.isExist }],
      pt_network: [{ value: this.item.pt_network, disabled: !this.isExist }],
      pt_run_seq1: [{ value: this.item.pt_run_seq1, disabled: !this.isExist }],
      pt_routing: [{ value: this.item.pt_routing, disabled: !this.isExist }],
      pt_iss_pol: [{ value: this.item.pt_iss_pol, disabled: !this.isExist }],
      pt_run_seq2: [{ value: this.item.pt_run_seq2, disabled: !this.isExist }],
      pt_bom_code: [{ value: this.item.pt_bom_code, disabled: !this.isExist }],
    });
    this.form4 = this.formBuilder.group({
      pt_price: [{ value: this.item.pt_price, disabled: !this.isExist }],
      pt_taxable: [{ value: this.item.pt_taxable, disabled: !this.isExist }],
      pt_taxc: [{ value: this.item.pt_taxc, disabled: !this.isExist },Validators.required],
    });

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
    const controls2 = this.form2.controls
    const controls3 = this.form3.controls
    const controls4 = this.form4.controls

    this.itemService
        .getByOne({
            pt_part: controls1.pt_part.value,
        })
        .subscribe((response: any) => {
        
            if (response.data) {
                this.isExist = true
                console.log(response.data)
            } else {
             
              controls1.pt_desc1.enable()
              controls1.pt_um.enable()
              controls1.pt_prod_line.enable()
              controls1.pt_part_type.enable()
              controls1.pt_draw.enable()
              controls1.pt_status.enable()
              controls1.pt_rev.enable()
              controls1.pt_dsgn_grp.enable()
              controls1.pt_group.enable()
              controls1.pt_drwg_loc.enable()
              controls1.pt_drwg_size.enable()
              controls1.pt_promo.enable()
              controls1.pt_break_cat.enable()
              controls1.pt_abc.enable()
              controls1.pt_avg_int.enable()
              controls1.pt_lot_ser.enable()
              controls1.pt_cyc_int.enable()
              controls1.pt_site.enable()
              controls1.pt_shelflife.enable()
              controls1.pt_loc.enable()
              controls1.pt_sngl_lot.enable()
              controls1.pt_loc_type.enable()
              controls1.pt_critical.enable()
              controls1.pt_auto_lot.enable()
              controls1.pt_rctpo_status.enable()
              controls1.pt_rctpo_active.enable()
              controls1.pt_lot_grp.enable()
              controls1.pt_rctwo_status.enable()
              controls1.pt_rctwo_active.enable()
              controls1.pt_article.enable()
              controls2.pt_ship_wt.enable()
              controls2.pt_ship_wt_um.enable()
              controls2.pt_net_wt.enable()
              controls2.pt_net_wt_um.enable()
              controls2.pt_fr_class.enable()
              controls2.pt_size.enable()
              controls2.pt_size_um.enable()
              controls3.pt_ms.enable()
              controls3.pt_buyer.enable()
              controls3.pt_phantom.enable()
              controls3.pt_plan_ord.enable()
              controls3.pt_vend.enable()
              controls3.pt_ord_min.enable()
              controls3.pt_timefence.enable()
              controls3.pt_po_site.enable()
              controls3.pt_ord_max.enable()
              controls3.pt_pm_code.enable()
              controls3.pt_ord_mult.enable()
              controls3.pt_ord_pol.enable()
              controls3.pt_cfg_type.enable()
              controls3.pt_op_yield.enable()
              controls3.pt_ord_qty.enable()
              controls3.pt_insp_rqd.enable()
              controls3.pt_yield_pct.enable()
              controls3.pt_insp_lead.enable()
              controls3.pt_run.enable()
              controls3.pt_ord_per.enable()
              controls3.pt_mfg_lead.enable()
              controls3.pt_pur_lead.enable()
              controls3.pt_setup.enable()
              controls3.pt_sfty_stk.enable()
              controls3.pt_sfty_time.enable()
              controls3.pt_rop.enable()
              controls3.pt_atp_family.enable()
              controls3.pt_network.enable()
              controls3.pt_run_seq1.enable()
              controls3.pt_routing.enable()
              controls3.pt_iss_pol.enable()
              controls3.pt_run_seq2.enable()
              controls3.pt_bom_code.enable()
              controls4.pt_price.enable()
              controls4.pt_taxable.enable()
              controls4.pt_taxc.enable()
        

            }
        })
}
//reste form
  //reste form
  reset() {
    this.item = new Item();
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
    const controls2 = this.form2.controls;
    const controls3 = this.form3.controls;
    const controls4 = this.form4.controls;

    /** check form */
    if (this.form1.invalid) {
      Object.keys(controls1).forEach((controlName) =>
        controls1[controlName].markAsTouched()
      );

      this.hasFormErrors1 = true;
      return;
    }
    if (this.form2.invalid) {
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
    }
    if (this.error) {
      this.hasFormErrors1 = true;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let item = this.prepareItem();
    let sct1 = this.prepareSct1();
    let sct2 = this.prepareSct2()
    this.addItem(item, sct1, sct2);
  }
  /**
   *
   * Returns object for saving
   */
  prepareItem(): Item {
    const controls1 = this.form1.controls;
    const controls2 = this.form2.controls;
    const controls3 = this.form3.controls;
    const controls4 = this.form4.controls;

    const _item = new Item();
    _item.pt_part = controls1.pt_part.value;
    _item.pt_desc1 = controls1.pt_desc1.value;
    _item.pt_um = controls1.pt_um.value;
    _item.pt_prod_line = controls1.pt_prod_line.value;
    _item.pt_part_type = controls1.pt_part_type.value;
    _item.pt_draw = controls1.pt_draw.value;
    _item.pt_status = controls1.pt_status.value;
    _item.pt_rev = controls1.pt_rev.value;
    _item.pt_dsgn_grp = controls1.pt_dsgn_grp.value;
    _item.pt_group = controls1.pt_group.value;
    _item.pt_drwg_loc = controls1.pt_drwg_loc.value;
    _item.pt_drwg_size = controls1.pt_drwg_size.value;
    _item.pt_promo = controls1.pt_promo.value;
    _item.pt_break_cat = controls1.pt_break_cat.value;
    _item.pt_abc = controls1.pt_abc.value;
    _item.pt_avg_int = controls1.pt_avg_int.value;
    _item.pt_lot_ser = controls1.pt_lot_ser.value;
    _item.pt_cyc_int = controls1.pt_cyc_int.value;
    _item.pt_site = controls1.pt_site.value;
    _item.pt_shelflife = controls1.pt_shelflife.value;
    _item.pt_loc = controls1.pt_loc.value;
    _item.pt_sngl_lot = controls1.pt_sngl_lot.value;
    _item.pt_loc_type = controls1.pt_loc_type.value;
    _item.pt_critical = controls1.pt_critical.value;
    _item.pt_auto_lot = controls1.pt_auto_lot.value;
    _item.pt_rctpo_status = controls1.pt_rctpo_status.value;
    _item.pt_rctpo_active = controls1.pt_rctpo_active.value;
    _item.pt_lot_grp = controls1.pt_lot_grp.value;
    _item.pt_rctwo_status = controls1.pt_rctwo_status.value;
    _item.pt_rctwo_active = controls1.pt_rctwo_active.value;
    _item.pt_article = controls1.pt_article.value;

    _item.pt_ship_wt = controls2.pt_ship_wt.value;
    _item.pt_ship_wt_um = controls2.pt_ship_wt_um.value;
    _item.pt_net_wt = controls2.pt_net_wt.value;
    _item.pt_net_wt_um = controls2.pt_net_wt_um.value;
    _item.pt_fr_class = controls2.pt_fr_class.value;
    _item.pt_size = controls2.pt_size.value;
    _item.pt_size_um = controls2.pt_size_um.value;

    _item.pt_ms = controls3.pt_ms.value;
    _item.pt_buyer = controls3.pt_buyer.value;
    _item.pt_phantom = controls3.pt_phantom.value;
    _item.pt_plan_ord = controls3.pt_plan_ord.value;
    _item.pt_vend = controls3.pt_vend.value;

    _item.pt_ord_min = controls3.pt_ord_min.value;
    _item.pt_timefence = controls3.pt_timefence.value;
    _item.pt_po_site = controls3.pt_po_site.value;
    _item.pt_ord_max = controls3.pt_ord_max.value;
    _item.pt_pm_code = controls3.pt_pm_code.value;
    _item.pt_ord_mult = controls3.pt_ord_mult.value;
    _item.pt_ord_pol = controls3.pt_ord_pol.value;
    _item.pt_cfg_type = controls3.pt_cfg_type.value;
    _item.pt_op_yield = controls3.pt_op_yield.value;
    _item.pt_ord_qty = controls3.pt_ord_qty.value;
    _item.pt_insp_rqd = controls3.pt_insp_rqd.value;
    _item.pt_yield_pct = controls3.pt_yield_pct.value;
    _item.pt_insp_lead = controls3.pt_insp_lead.value;
    _item.pt_run = controls3.pt_run.value;
    _item.pt_ord_per = controls3.pt_ord_per.value;
    _item.pt_mfg_lead = controls3.pt_mfg_lead.value;
    _item.pt_pur_lead = controls3.pt_pur_lead.value;
    _item.pt_setup = controls3.pt_setup.value;
    _item.pt_sfty_stk = controls3.pt_sfty_stk.value;
    _item.pt_sfty_time = controls3.pt_sfty_time.value;
    _item.pt_rop = controls3.pt_rop.value;
    _item.pt_atp_family = controls3.pt_atp_family.value;
    _item.pt_network = controls3.pt_network.value;
    _item.pt_run_seq1 = controls3.pt_run_seq1.value;
    _item.pt_routing = controls3.pt_routing.value;
    _item.pt_iss_pol = controls3.pt_iss_pol.value;
    _item.pt_run_seq2 = controls3.pt_run_seq2.value;
    _item.pt_bom_code = controls3.pt_bom_code.value;

    _item.pt_price = controls4.pt_price.value;
    _item.pt_taxable = controls4.pt_taxable.value;
    _item.pt_taxc = controls4.pt_taxc.value;

    return _item;
  }
  /**
   * Add item
   *
   * @param _item: ItemModel
   */
  addItem(item: Item, sct1: CostSimulation, sct2: CostSimulation) {
    this.loadingSubject.next(true);
    this.itemService.add(item).subscribe(
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
                this.router.navigateByUrl("/articles/list");
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
    _sct.sct_part = control1.pt_part.value;
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
    _sct.sct_site = control1.pt_site.value;

    return _sct;
  }

  prepareSct2(): CostSimulation {
    const controls = this.sctForm1.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    _sct.sct_sim = 'STDCR'
    _sct.sct_part = control1.pt_part.value
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
    _sct.sct_site = control1.pt_site.value;
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
    const um_um = controls.pt_um.value;
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
    const seq_seq = controls.pt_buyer.value;
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

  changePl() {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah
    const pl_prod_line = controls.pt_prod_line.value;
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
  }
  changeCode(field) {
    const controls = this.form1.controls; // chof le champs hada wesh men form rah

    let obj = {};
    if (field == "pt_status") {
      this.msg = " Status ";
      const code_value = controls.pt_status.value;
      obj = {
        code_value,
        code_fldname: field,
      };
    }
    if (field == "pt_dsgn_grp") {
      this.msg = " Groupe Etude ";
      const code_value = controls.pt_dsgn_grp.value;
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
    if (field == "pt_rctpo_status") {
      this.msg = " Status reception OA ";
       is_status = controls.pt_rctpo_status.value;
      
    }
    if (field == "pt_rctwo_status") {
      this.msg = " Status Reception WO ";
       is_status = controls.pt_rctwo_status.value;
      
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
    const si_site = controls.pt_site.value;
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
    const vd_addr = controls.pt_vend.value;
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
    const loc_loc = controls.pt_loc.value;
    const loc_site = controls.pt_site.value;

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
          case "pt_status": {
            controls1.pt_status.setValue(item.code_value || "");
            break;
          }
          case "pt_dsgn_grp": {
            controls1.pt_dsgn_grp.setValue(item.code_value || "");
            break;
          }
          case "pt_um": {
            controls1.pt_um.setValue(item.code_value || "");
            break;
          }
          case "pt_network": {
            controls3.pt_network.setValue(item.code_value || "");
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
          case "pt_rctpo_status": {
            controls1.pt_rctpo_status.setValue(item.is_status || "");
            break;
          }
          case "pt_rctwo_status": {
            controls1.pt_rctwo_status.setValue(item.is_status || "");
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
    const controls2 = this.form2.controls;
    const controls3 = this.form3.controls;
    const controls4 = this.form4.controls;

    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "pt_site": {
            controls1.pt_site.setValue(item.si_site || "");
            break;
          }
          case "pt_po_site": {
            controls3.pt_po_site.setValue(item.si_site || "");
            break;
          }
          default:
            break;
        }
      });
    }
  }
  handleSelectedRowsChangedpl(e, args) {
    const controls1 = this.form1.controls;
    if (Array.isArray(args.rows) && this.gridObjpl) {
      args.rows.map((idx) => {
        const item = this.gridObjpl.getDataItem(idx);
        controls1.pt_prod_line.setValue(item.pl_prod_line || "");
      });
    }
  }
  handleSelectedRowsChangedloc(e, args) {
    const controls1 = this.form1.controls;

    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedField) {
          case "pt_loc": {
            controls1.pt_loc.setValue(item.loc_loc || "");
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
      .getBy({ loc_site: controls1.pt_site.value })
      .subscribe((response: any) => (this.dataloc = response.data));
  }
  openloc(contentloc, field) {
    this.selectedField = field;
    this.prepareGridloc();
    this.modalService.open(contentloc, { size: "lg" });
  }

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

  handleSelectedRowsChangedprov(e, args) {
    const controls = this.form3.controls;
    if (Array.isArray(args.rows) && this.gridObjprov) {
      args.rows.map((idx) => {
        const item = this.gridObjprov.getDataItem(idx);
        controls.pt_vend.setValue(item.vd_addr || "");
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
        controls.pt_buyer.setValue(item.seq_seq || "");
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
    const controls = this.form4.controls
    if (Array.isArray(args.rows) && this.gridObjtax) {
        args.rows.map((idx) => {
            const item = this.gridObjtax.getDataItem(idx)
            controls.pt_taxc.setValue(item.tx2_tax_code || "")
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
