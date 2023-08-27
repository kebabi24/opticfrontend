import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
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
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  PurchaseOrderService,
  ProviderService,
  GlassesService,
  AccountPayableService,
  Code,
  AddressService,
  TaxeService,
  DeviseService,
  VendorProposal,
  CostSimulation,
  InventoryTransaction,
  PurchaseReceive,
  InventoryTransactionService,
  PurchaseReceiveService,
  LocationService,
  SiteService,
  MesureService,
  SequenceService,
  LocationGlassesService,
  CodeService,
  InventoryStatusService,
  printReceive,
  AccountPayable,
  Glasses,
  CostSimulationService,
} from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
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
const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } 
  return { valid: true, msg: '' };
};
import { round } from 'lodash';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from "@angular/cdk/overlay/overlay-directives";
import { S } from "@angular/cdk/keycodes";

@Component({
  selector: 'kt-gls-receip',
  templateUrl: './gls-receip.component.html',
  styleUrls: ['./gls-receip.component.scss']
})
export class GlsReceipComponent implements OnInit {

  purchaseReceive: PurchaseReceive;
  inventoryTransaction: InventoryTransaction;
  prhForm: FormGroup;
  totForm: FormGroup;
  codeForm: FormGroup;
  form1: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  provider: any;
  
 
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  pos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;


  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

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

  datalocdet: [];
  columnDefinitionslocdet: Column[] = [];
  gridOptionslocdet: GridOption = {};
  gridObjlocdet: any;
  angularGridlocdet: AngularGridInstance;
  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;

  providers: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;

  row_number;
  message = "";
  prhServer;
  location: any;
  datasetPrint = [];
  seq: any;
  user;
  prhnbr: String;
  stat: String;
  lddet: any;
curr;
date: String;
prh_cr_terms: any[] = [];


/**********************************GLS******************************************* */
hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;
  
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  dataset2: any[] = [];

codemstr: Code;
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


  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

  site: any;
  loc: any;
  

  providerss: [];
  columnDefinitionsprov: Column[] = [];
  gridOptionsprov: GridOption = {};
  gridObjprov: any;
  angularGridprov: AngularGridInstance;

  datastatus: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;
 // row_number;
  // error = false;
  msg: String;

  isExist = false;
  isExist2 = false;
  isExist3 = false;
  sct1: CostSimulation;
  sct2: CostSimulation;

  sctForm: FormGroup;
  sctForm1: FormGroup;
  seqgls: any;
  code: any;
  
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

    providerForm: FormGroup
    hasFormErrors5 = false
    hasFormErrors6 = false
    hasProviderFormErrors = false

    datacode: [];
    columnDefinitionscode: Column[] = [];
    gridOptionscode: GridOption = {};
    gridObjcode: any;
    angularGridcode: AngularGridInstance;
    fldname;
    codevalue;
    taux_taxe = 0;
    glasses: Glasses;
    valuecode;
    /***********************************************GLS************************************* */
  constructor(
    config: NgbDropdownConfig,
    private prhFB: FormBuilder,
    private totFB: FormBuilder,
    private codeFB: FormBuilder,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private providersService: ProviderService,
    private purchaseReceiveService: PurchaseReceiveService,
    private inventoryTransactionService: InventoryTransactionService,
    private purchaseOrderService: PurchaseOrderService,
    private poService: PurchaseOrderService,
    private addressService: AddressService,
    private glassessService: GlassesService,
    private sctService: CostSimulationService,
    private codeService: CodeService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private locationGlassesService: LocationGlassesService,
    private deviseService: DeviseService,
    private glassesService: GlassesService,
    private taxService: TaxeService,
    private accountPayableService: AccountPayableService,
    private sequenceService: SequenceService,
    private inventoryStatusService: InventoryStatusService,
    private locationService: LocationService,
  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "vd_cr_terms" })
    .subscribe((response: any) => (this.prh_cr_terms = response.data));
/*****************************************GLS****************************************/
    
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
  /*************************************GLS****************************************** */


    this.initGrid();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
    
    this.columnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.angularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },
      {
        id: "add",
        field: "add",
        excludeFromHeaderMenu: true,
        formatter: Formatters.icon, params: { formatterIcon: 'fa fa-plus' },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          //if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //  this.angularGrid.gridService.deleteItem(args.dataContext);
         // }
         this.addsameItem(args.dataContext.id)
        
        },
      },

      {
        id: "prh_line",
        name: "Ligne",
        field: "prh_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "prh_part",
        name: "Article",
        field: "prh_part",
        sortable: true,
        width: 50,
        filterable: false,
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
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.icon, params: { formatterIcon: 'fa fa-plus' },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openGlssGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 180,
        filterable: false,
      },
      {
        id: "qty_received",
        name: "QTE OA Récept",
        field: "qty_received",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        
      },
      {
        id: "prh_rcvd",
        name: "QTE A Récep",
        field: "prh_rcvd",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
  
        

          this.calculatetot();
      }
      },
      {
        id: "prh_sph",
        name: "Sphere",
        field: "prh_sph",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
        },
      },
      {
        id: "prh_cyl",
        name: "Cylindre",
        field: "prh_cyl",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
  
       /*kamel*/
       let obj = {};
       obj = {
           cyl: args.dataContext.prh_cyl,
           sph: args.dataContext.prh_sph,
           part: args.dataContext.prh_part,
       }
        this.glassessService.getByPrice({obj }).subscribe((resp:any)=>{
            
          console.log(resp.data)
          if (resp.data.length > 0) {
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_pur_cost: resp.data[0].glsd_pur_price })
            
          } else {
            alert(" Sphere et cylindre ne corespond pas au verre choisis")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_cyl:null })
          
          }
          this.calculatetot()
        })
       
      }
      },
      {
        id: "prh_add",
        name: "Addition",
        field: "prh_add",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
        },
      },
      
      {
        id: "prh_um",
        name: "UM",
        field: "prh_um",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.prh_um)
          this.glassessService.getBy({gls_part: args.dataContext.prh_part }).subscribe((resp:any)=>{
            
          if   (args.dataContext.prh_um == resp.data.gls_um )  {
            
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_um_conv: 1 })
          } else { 
            //console.log(resp.data.gls_um)



              this.mesureService.getBy({um_um: args.dataContext.prh_um, um_alt_um: resp.data.gls_um, um_part: args.dataContext.prh_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
    
            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_um_conv: res.data.um_conv })
              this.angularGrid.gridService.highlightRow(1, 1500);
            } else {
              this.mesureService.getBy({um_um: resp.data.gls_um, um_alt_um: args.dataContext.prh_um, um_part: args.dataContext.prh_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_um_conv: res.data.um_conv })
                  
                } else {
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_um_conv: "1" , prh_um: null});
           
                  alert("UM conversion manquante")
                  
                }  
              })

            }
              })

            }
            })
  
          }
        
      },

      {
        id: "mvidlot",
        field: "cmvidlot",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
            "openUmsGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      // {
      //   id: "prh_um_conv",
      //   name: "Conv UM",
      //   field: "prh_um_conv",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //  // editor: {
      //  //     model: Editors.float,
      //   //},
        
      // },

      {
        id: "prh_pur_cost",
        name: "Prix unitaire",
        field: "prh_pur_cost",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        formatter: Formatters.decimal,
        onCellChange: (e: Event, args: OnEventArgs) => {
  
        

          this.calculatetot();
      }
      },
      {
        id: "prh_disc_pct",
        name: "Remise",
        field: "prh_disc_pct",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        formatter: Formatters.decimal,
        onCellChange: (e: Event, args: OnEventArgs) => {
  
        

          this.calculatetot();
      }
      },
      
      {
        id: "prh_taxable",
        name: "Taxable",
        field: "prh_taxable",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.checkbox
        },
        formatter: Formatters.checkmark,
        cannotTriggerInsert: true,
        onCellChange: (e: Event, args: OnEventArgs) => {
  
        

          this.calculatetot();
      }
      },
      // {
      //   id: "prh_tax_code",
      //   name: "Code de Taxe",
      //   field: "prh_tax_code",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
        
      // },  
      {
        id: "prh_taxc",
        name: "taux de taxe",
        field: "prh_taxc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        formatter: Formatters.percentComplete,
        onCellChange: (e: Event, args: OnEventArgs) => {
  
        

          this.calculatetot();
      }
      },
      /*{
        id: "prh_site",
        name: "Site",
        field: "prh_site",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {

          this.siteService.getByOne({ si_site: args.dataContext.prh_site,}).subscribe(
            (response: any) => {
              
          console.log(response.data)

                if (response.data) {
                  
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_site: response.data.si_site})
                }
                else {
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , prh_site: null});
    
                     // this.gridService.onItemUpdated;
                      alert("Site N'existe pas")
                }
          });     
      }

      },
      {
          id: "mvids",
          field: "cmvids",
          excludeFromHeaderMenu: true,
          formatter: Formatters.infoIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
              this.row_number = args.row;
              let element: HTMLElement = document.getElementById(
              "openSitesGrid"
              ) as HTMLElement;
              element.click();
          },
      },
      */
      /*{
        id: "prh_loc",
        name: "Emplacement",
        field: "prh_loc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },


        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.prh_loc)
          
          const controls = this.prhForm.controls
            this.locationService.getByOne({ loc_loc: args.dataContext.prh_loc, loc_site: controls.prh_site.value }).subscribe(
              (response: any) => {
                this.location = response.data
                if (response.data) {

                    this.locationDetailService.getBy({ lda_site: controls.prh_site.value, lda_loc: args.dataContext.prh_loc, lda_part: args.dataContext.prh_part, lda_lot: null }).subscribe(
                      (response: any) => {
                        this.lddet = response.data
                        console.log(this.lddet[0].lda_qty_oh)
               
                        this.inventoryStatusService.getAllDetails({isd_status: this.location.loc_status, isd_prh_type: "RCT-PO" }).subscribe((resstat:any)=>{
                          console.log(resstat)
                          const { data } = resstat;
  
                          if (data) {
                            this.stat = null
                          } else {
                            this.stat = this.location.loc_status
                          }
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   prh_status: this.stat})
                        });     
     
                      });     
                    }
                    else {
                      alert("Emplacement Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_loc: null, qty_oh: 0, prh_status: null })
                    }
                     
        });

      }



      },
      {
          id: "mvidl",
          field: "cmvidl",
          excludeFromHeaderMenu: true,
          formatter: Formatters.infoIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
              this.row_number = args.row;
              let element: HTMLElement = document.getElementById(
              "openLocsGrid"
              ) as HTMLElement;
              element.click();
          },
      },       
      *//*
      {
        id: "prh_serial",
        name: "Lot/Serie",
        field: "prh_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.prhForm.controls
            this.locationGlassesService.getBy({ lda_site: controls.prh_site.value, lda_loc: args.dataContext.prh_loc, lda_part: args.dataContext.prh_part, lda_lot: args.dataContext.prh_serial }).subscribe(
              (response: any) => {
                this.lddet = response.data
                
        console.log(response.data.length)
                  if (response.data.length != 0) {
                    
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: this.lddet[0].lda_status, tr_expire: this.lddet[0].tr_expire})
                  }
                  
            });     
        }

      },
      {
          id: "mvidlot",
          field: "cmvidlot",
          excludeFromHeaderMenu: true,
          formatter: Formatters.infoIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => {
              this.row_number = args.row;
              let element: HTMLElement = document.getElementById(
              "openLocdetsGrid"
              ) as HTMLElement;
              element.click();
          },
      },*/
      /*{
        id: "prh_vend_lot",
        name: "Lot Fournisseur",
        field: "prh_vend_lot",
        sortable: true,
        width: 80,
        filterable: false,
        
        editor: {
          model: Editors.text,
        },
      },
      */
     /* {
        id: "tr_status",
        name: "Status",
        field: "tr_status",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },*/
      {
        id: "tr_expire",
        name: "Expire",
        field: "tr_expire",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
  
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_serial: String(args.dataContext.tr_expire)})
             

         
      }
      }
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
    };

    this.dataset = [];
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
    this.createtotForm();
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.inventoryTransaction = new InventoryTransaction();
    this.purchaseReceive = new PurchaseReceive()
    const date = new Date()
    this.prhForm = this.prhFB.group({
      prh_nbr: [this.purchaseReceive.prh_nbr],
      prh_vend: [this.purchaseReceive.prh_vend],
      name: "",
      prh_rcp_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      prh_xinvoice: [this.purchaseReceive.prh_xinvoice],
      prh_curr: [this.purchaseReceive.prh_curr],
      prh_site: [this.purchaseReceive.prh_site, Validators.required],
    //  prh_ex_rate: [this.purchaseReceive.prh_ex_rate],
     // prh_ex_rate2: [this.purchaseReceive.prh_ex_rate2],
      taxable: [this.purchaseReceive.prh_taxable],
      //prh_taxc: [this.purchaseReceive.prh_taxc],      
      prh_rmks: [this.purchaseReceive.prh_rmks],
      prh_cr_terms: [this.purchaseReceive.prh_cr_terms],
      print:[true]
    });
    const controls = this.prhForm.controls;
    this.siteService.getByOne({ si_default: true  }).subscribe(
      (res: any) => {
    //  this.site = res.data.si_site
      
      controls.prh_site.setValue(res.data.si_site );
      
  
    })
  
  }
  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
   // const date = new Date;
    
    this.totForm = this.totFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    });

  }  
  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.createtotForm();
    this.dataset=[]
    this.datasetPrint= []
    this.hasFormErrors = false;

  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.prhForm.controls;
    /** check form */
    if (this.prhForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }

    for (var i = 0; i < this.dataset.length; i++) {
      console.log(this.dataset[i]  )
     if (this.dataset[i].prh_sph == null || this.dataset[i].prh_cyl == null  ) {
      this.message = "Sphere ou Cylindree ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].prh_sph == "" || this.dataset[i].prh_cyl == ""  ) {
      this.message = "Sphere ou Cylindree ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
    }
    this.sequenceService.getByOne({ seq_type: "PR", seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data
    console.log(this.seq)   
        if (this.seq) {
         this.prhnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
         console.log(this.seq.seq_prefix)
         console.log(this.seq.seq_curr_val)
         
        console.log(this.prhnbr)
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

      
      
    // tslint:disable-next-line:prefer-const
    let ap = this.prepareAp()
    console.log("hhhhhh", ap)
    this.addAp(ap,this.prhnbr);
    let pr = this.prepare()
    this.addIt( this.dataset,pr, this.prhnbr);
    
  })



    // tslint:disable-next-line:prefer-const
   // let pr = this.prepare()
    //this.addIt( this.dataset,pr);
  }

  prepare(){
    const controls = this.prhForm.controls;
    const controls1 = this.totForm.controls;
    const _pr = new PurchaseReceive();
    _pr.prh_nbr = controls.prh_nbr.value
    _pr.prh_vend = controls.prh_vend.value
    _pr.prh_rcp_date = controls.prh_rcp_date.value
    ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}`
    : null
    _pr.prh_xinvoice = controls.prh_xinvoice.value
    _pr.prh_curr = controls.prh_curr.value
    _pr.prh_site = controls.prh_site.value
    _pr.prh_taxable = controls.taxable.value
    //_pr.prh_taxc = controls.prh_taxc.value
    _pr.prh_ex_rate = 1
    _pr.prh_ex_rate2 = 1
    _pr.prh_rmks = controls.prh_rmks.value
    _pr.prh_cr_terms = controls.prh_cr_terms.value;
    _pr.prh_amt = controls1.tht.value
    _pr.prh_tax_amt = controls1.tva.value
    _pr.prh_trl1_amt = controls1.timbre.value
    return _pr
  }

  prepareAp(){
    const controls = this.prhForm.controls;
    const controls1 = this.totForm.controls;
   
    const _ap = new AccountPayable();
    _ap.ap_nbr = controls.prh_nbr.value
    _ap.ap_vend = controls.prh_vend.value
    _ap.ap_effdate = controls.prh_rcp_date.value
    ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}`
    : null
    _ap.ap_type = "I"
    _ap.ap_curr = controls.prh_curr.value
    _ap.ap_cr_terms  = controls.prh_cr_terms.value
    _ap.ap_ex_rate  = 1
    _ap.ap_ex_rate2 = 1
    _ap.ap_xinvoice = controls.prh_xinvoice.value
    _ap.ap_po_nbr = controls.prh_nbr.value
    _ap.ap_po = controls.prh_rmks.value
    _ap.ap_amt = controls1.ttc.value
    _ap.ap_base_amt = Number(controls1.ttc.value) * Number(1) /  Number(1)

    return _ap
  }
  addAp( ap, prhnbr) {
    this.loadingSubject.next(true);
    
    const controls = this.prhForm.controls
    
    this.accountPayableService
      .addPrh({ap,prhnbr})
      .subscribe(
       (reponse: any) => console.log(reponse),
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
        }
      );
  }
  

  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _it: it
   */
  addIt( detail: any, pr,prhnbr) {
    for (let data in detail) {
      delete this.dataset[data].id;
      delete this.dataset[data].cmvid;
    }
    this.loadingSubject.next(true);
    
    const controls = this.prhForm.controls
    let poNbr = 0
    this.purchaseReceiveService
      .addGls({detail, pr,prhnbr})
      .subscribe(
       (reponse: any) => (poNbr = reponse.data),
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
         console.log(this.provider, poNbr, this.dataset);
          if(controls.print.value == true) this.printpdf(poNbr);
          this.router.navigateByUrl("/");
        }
      );
  }
  onChangesite() {
    const controls = this.prhForm.controls;
    const si_site = controls.prh_site.value;
    
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            alert("Site n'existe pas  ")
            controls.prh_site.setValue(null);
            document.getElementById("prh_site").focus();
          }
      
      });
  }
  
  onChangeTAX() {
    const controls = this.prhForm.controls;
    const tax = controls.taxable.value;
  
      for (var i = 0; i < this.dataset.length; i++) {
        let updateItem = this.gridService.getDataItemByRowIndex(i);
      //  console.log(this.dataset[i].qty_oh)
            updateItem.prh_taxable = tax ;
        
            this.gridService.updateItem(updateItem);
         
      };
    
    
   
    this.calculatetot();
  }
  onChangeOA() {
    this.dataset=[]
    const controls = this.prhForm.controls;
    const po_nbr = controls.prh_nbr.value;
    
    this.purchaseOrderService.findBy({ po_nbr }).subscribe(
      (res: any) => {
        const { purchaseOrder, details } = res.data;
        const det1 = details;
        this.prhServer = purchaseOrder;
        

       

        controls.prh_vend.setValue(this.prhServer.po_vend);
        controls.prh_curr.setValue(this.prhServer.po_curr);
        // controls.prh_ex_rate.setValue(this.prhServer.po_ex_rate);
        // controls.prh_ex_rate2.setValue(this.prhServer.po_ex_rate2);
        const ad_addr = this.prhServer.po_vend;
        console.log(ad_addr)
        this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                
                
          this.provider = response.data

        controls.name.setValue(this.provider.ad_name);
      

        for (const object in det1) {
          console.log(details[object]);
          const detail = details[object];
          this.locationService.getByOne({ loc_loc: detail.glass.gls_loc, loc_site: detail.glass.gls_site }).subscribe(
            (response: any) => {
              this.location = response.data
              console.log( this.location)
if (this.location == null) {this.stat = null} else {this.stat = this.location.loc_status}

          this.gridService.addItem(
            {

              
              id: this.dataset.length + 1,
              prh_line: this.dataset.length + 1,
              prh_part: detail.podg_part,
              cmvid: "",
              desc: detail.glass.gls_desc1,
              qty_received: detail.podg_qty_rcvd,
              prh_rcvd: detail.podg_qty_ord - detail.podg_qty_rcvd ,
              prh_um: detail.glass.gls_um,
              prh_sph: detail.podg_sph,
              prh_cyl: detail.podg_cyl,
              prh_add: detail.podg_add,

              prh_taxable: detail.podg_taxable,
              prh_taxc: detail.podg_taxc,
              prh_tax_code: detail.podg_tax_code,
              prh_um_conv: 1,
              prh_pur_cost: detail.podg_price,
              
              //prh_site: detail.glass.gls_site,
              prh_loc: detail.glass.gls_loc,
              prh_serial: "",
              tr_status: this.stat,
              prh_vend_lot: "",
              tr_expire: null,
            },
            { position: "bottom" }
          );
          this.datasetPrint.push({
            id: this.dataset.length + 1,
            prh_line: this.dataset.length + 1,
            prh_part: detail.podg_part,
            cmvid: "",
            desc: detail.glass.gls_desc1,
            qty_received: detail.podg_qty_rcvd,
            prh_rcvd: detail.podg_qty_ord,
            prh_taxable: detail.podg_taxable,
            prh_taxc: detail.podg_taxc,
            prh_tax_code: detail.podg_tax_code,
            prh_sph: detail.podg_sph,
            prh_cyl: detail.podg_cyl,
            prh_add: detail.podg_add,

            prh_um: detail.glass.gls_um,
            prh_um_conv: 1,
            prh_pur_cost: detail.podg_price,
            //prh_site: detail.glass.gls_site,
            prh_loc: detail.glass.gls_loc,
            prh_serial: "",
            tr_status: this.stat,
            prh_vend_lot: "",
            tr_expire: null,
        });
      });
        }
      })
     
      }

        
    );
  }

  
  changeCurr(){
    const controls = this.prhForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.po_curr.value
    this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "cette devise n'existe pas",
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
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // add new Item to Datatable
 
  addNewItem() {
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        prh_line: this.dataset.length + 1,
        prh_part: "",
        cmvid: "",
        desc: "",
        qty_received:0,
        prh_rcvd: 0,
        prh_um: "",
        prh_pur_cost: 0,
        prh_add: null,
        prh_cyl:null,
        prh_sph: null,
        prh_disc_pct: 0,
       // prh_site: "",
        prh_loc: "",
        prh_serial: null,
        tr_status: "",
        prh_vend_lot: "",
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  addsameItem(i ) {
    console.log(i)
    console.log(this.dataset)
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        prh_line: this.dataset.length + 1,
        prh_part: this.dataset[i - 1].prh_part,
        cmvid: "",
        desc: this.dataset[i - 1].desc,
        qty_received: this.dataset[i-1].qty_received,
        prh_rcvd: 0,
        prh_taxable: this.dataset[i - 1].prh_taxable,
        prh_taxc: this.dataset[i - 1].prh_taxc,
        prh_tax_code: this.dataset[i - 1].prh_tax_code,
              
        prh_um: this.dataset[i - 1].prh_um,
        prh_pur_cost: this.dataset[i - 1].prh_pur_cost,
       // prh_site: this.dataset[i - 1].prh_site,
        prh_loc: this.dataset[i - 1].prh_loc,
        prh_serial: "",
        tr_status: "",
        prh_vend_lot: "",
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  
  handleSelectedRowsChanged4(e, args) {
    const controls = this.prhForm.controls;
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

        this.locationService.getByOne({ loc_loc: item.gls_loc, loc_site: controls.prh_site.value }).subscribe(
          (response: any) => {
            this.location = response.data
            console.log( this.location.loc_status)
        updateItem.prh_part = item.gls_part;
        updateItem.desc = item.gls_desc1;
        updateItem.prh_um = item.gls_um;
        updateItem.prh_um_conv = 1;
        updateItem.prh_pur_cost = item.gls_pur_price;
        //updateItem.prh_site = item.gls_site;
        updateItem.prh_loc = item.gls_loc;
        updateItem.tr_status =  this.location.loc_status;
      if(controls.taxable.value == false) {
        updateItem.prh_taxable = false
      } else {  
        updateItem.prh_taxable = item.gls_taxable}
        updateItem.prh_tax_code = item.gls_taxc
        
        updateItem.prh_taxc = item.taxe.tx2_tax_pct
        this.gridService.updateItem(updateItem);
      });  
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
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "gls_part",
        name: "code ",
        field: "gls_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "gls_desc1",
        name: "desc",
        field: "gls_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "gls_um",
        name: "UM",
        field: "gls_um",
        sortable: true,
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
    this.glassessService
      .getAll()
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.prhForm.controls;

    this.dataset=[]
    
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.prh_nbr.setValue(item.po_nbr || "");
        const po_nbr = controls.prh_nbr.value;
        this.purchaseOrderService.findBy({ po_nbr: item.po.po_nbr }).subscribe(
          (res: any) => {
            const { purchaseOrder, details } = res.data;
            const det1 = details;
            this.prhServer = purchaseOrder;
            
            controls.prh_nbr.setValue(this.prhServer.po_nbr)
            controls.prh_vend.setValue(this.prhServer.po_vend);
            controls.prh_curr.setValue(this.prhServer.po_curr);
            // controls.prh_ex_rate.setValue(this.prhServer.po_ex_rate);
            // controls.prh_ex_rate2.setValue(this.prhServer.po_ex_rate2);
            controls.prh_cr_terms.setValue(this.prhServer.po_cr_terms);
            const ad_addr = this.prhServer.po_vend;
            console.log(ad_addr)
            this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                    
                    
              this.provider = response.data
    
            controls.name.setValue(this.provider.ad_name);
          
            for (const object in det1) {
              console.log(details[object]);
              const detail = details[object];
              this.locationService.getByOne({ loc_loc: detail.glass.gls_loc, loc_site: detail.glass.gls_site }).subscribe(
                (response: any) => {
                  this.location = response.data
                 // console.log( this.location.loc_status)
                  if (this.location == null) {this.stat = null} else {this.stat = this.location.loc_status}
              this.gridService.addItem(
                {
                  id: this.dataset.length + 1,
                  prh_line: this.dataset.length + 1,
                  prh_part: detail.podg_part,
                  cmvid: "",
                  desc: detail.glass.gls_desc1,
                  qty_received: detail.podg_qty_rcvd,
                  prh_rcvd: detail.podg_qty_ord - detail.podg_qty_rcvd,
                  prh_um: detail.glass.gls_um,
                  prh_um_conv: 1,
                  prh_sph: detail.podg_sph,
                  prh_cyl: detail.podg_cyl,
                  prh_add: detail.podg_add,
                  prh_pur_cost: detail.podg_price,
                  prh_disc_pct: detail.podg_disc_pct,
                  prh_taxable: detail.podg_taxable,
                  prh_taxc: detail.podg_taxc,
                  prh_tax_code: detail.podg_tax_code,
                  //prh_site: detail.item.gls_site,
                  prh_loc: detail.glass.gls_loc,
                  prh_serial: "",
                  tr_status:  this.stat,
                  prh_vend_lot: "",
                  tr_expire: null,
                },
                { position: "bottom" }
              );
              this.datasetPrint.push({
                id: this.dataset.length + 1,
                prh_line: this.dataset.length + 1,
                prh_part: detail.podg_part,
                cmvid: "",
                desc: detail.glass.gls_desc1,
                qty_received: detail.podg_qty_rcvd,
                prh_rcvd: detail.podg_qty_ord,
                prh_um: detail.glass.gls_um,
                prh_um_conv: 1,
                prh_sph: detail.podg_sph,
                prh_cyl: detail.podg_cyl,
                prh_add: detail.podg_add,

                prh_pur_cost: detail.podg_price,
                prh_disc_pct: detail.podg_disc_pct,
                prh_taxable: detail.podg_taxable,
                prh_taxc: detail.podg_taxc,
                prh_tax_code: detail.podg_tax_code,
                //prh_site: detail.glass.gls_site,
                prh_loc: detail.glass.gls_loc,
                prh_serial: "",
                tr_status:  this.stat,
                prh_vend_lot: "",
                tr_expire: null,
            });
            this.calculatetot();
          });
         
          }
        }
        );
        
          }
        );



      });
    }
  }

  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid;
    this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid5() {
    this.columnDefinitions5 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "po_nbr",
        name: "N° BC",
        field: "po.po_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "po_ord_date",
        name: "Date",
        field: "po.po_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "po_vend",
        name: "Fournisseur",
        field: "po.po_vend",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "po_status",
        name: "status",
        field: "po.po_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions5 = {
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
    this.purchaseOrderService
      .getAll()
      .subscribe((response: any) => {
        console.log(response.data)
        this.pos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  
  handleSelectedRowsChangedcurr(e, args) {
    const controls = this.prhForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcurr) {
      args.rows.map((idx) => {
        const item = this.gridObjcurr.getDataItem(idx);
        controls.prh_curr.setValue(item.cu_curr || "");
        if(item.cu_curr != 'DA'){
          const date = new Date()
          this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}).subscribe((res:any)=>{
          //  controls.prh_ex_rate.setValue(res.data.exr_rate)
          //  controls.prh_ex_rate2.setValue(res.data.exr_rate2)
          })
        }
      });
    }
  }

  angularGridReadycurr(angularGrid: AngularGridInstance) {
    this.angularGridcurr = angularGrid;
    this.gridObjcurr = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridcurr() {
    this.columnDefinitionscurr = [
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

    this.gridOptionscurr = {
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
  opencurr(content) {
    this.prepareGridcurr();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.prhForm.controls;
      if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);
        
       controls.prh_site.setValue(item.si_site);
        
    
     
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
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data));
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }
 

  handleSelectedRowsChangedloc(e, args) {
    const controls = this.prhForm.controls;
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        console.log(item);

            

      
               this.stat = null
           
                    this.inventoryStatusService.getAllDetails({isd_status: item.loc_status, isd_tr_type: "RCT-PO" }).subscribe((resstat:any)=>{
                      console.log(resstat)
                      const { data } = resstat;

                      if (data) {
                        this.stat = null
                      } else {
                        this.stat = item.loc_status
                      }
                    updateItem.prh_loc = item.loc_loc; 
                    updateItem.tr_status = this.stat
                    this.gridService.updateItem(updateItem);


                  });     
 
                });     
            }               
  
}
  angularGridReadyloc(angularGrid: AngularGridInstance) {
    this.angularGridloc = angularGrid;
    this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridloc() {
    const controls = this.prhForm.controls;
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
        id: "loc_site",
        name: "Site",
        field: "loc_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_loc",
        name: "Emplacement",
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
      {
        id: "loc_status",
        name: "Status",
        field: "loc_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "loc_perm",
        name: "Permanent",
        field: "loc_perm",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
        formatter: Formatters.yesNo,
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
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    
    // fill the dataset with your data
    this.locationService
      .getBy({ loc_site:  controls.prh_site.value })
      .subscribe((response: any) => (this.dataloc = response.data));
  }
  openloc(contentloc) {
    this.prepareGridloc();
    this.modalService.open(contentloc, { size: "lg" });
  }
 

  handleSelectedRowsChangedlocdet(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjlocdet) {
      args.rows.map((idx) => {
        const item = this.gridObjlocdet.getDataItem(idx);
        console.log(item);

            

        this.inventoryStatusService.getAllDetails({isd_status: item.lda_status, isd_tr_type: "ISS-SO" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          alert ("Mouvement Interdit Pour ce Status")
          updateItem.prh_serial = null;
          updateItem.tr_status = null;
          
          updateItem.tr_expire = null;
          updateItem.qty_oh = 0;
          this.gridService.updateItem(updateItem);

        }else {
          updateItem.prh_serial = item.lda_lot;
          updateItem.tr_status = item.lda_status;
          updateItem.tr_expire = item.lda_expire;
          updateItem.qty_oh = item.lda_qty_oh;
          
          this.gridService.updateItem(updateItem);

        }
          
        })

  


        
        
        
  });

    }
  }
  angularGridReadylocdet(angularGrid: AngularGridInstance) {
    this.angularGridlocdet = angularGrid;
    this.gridObjlocdet = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridlocdet() {
    const controls = this.prhForm.controls;
    this.columnDefinitionslocdet = [
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
        id: "lda_site",
        name: "Site",
        field: "lda_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "lda_loc",
        name: "Emplacement",
        field: "lda_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "lda_part",
        name: "Article",
        field: "lda_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "lda_lot",
        name: "Lot",
        field: "lda_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "lda_qty_oh",
        name: "Qte",
        field: "lda_qty_oh",
        sortable: true,
        filterable: true,
        type: FieldType.float,
      },
      {
        id: "lda_status",
        name: "Status",
        field: "lda_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "lda_expire",
        name: "Expire",
        field: "lda_expire",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionslocdet = {
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
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    
    // fill the dataset with your data
    this.locationGlassesService
      .getBy({ lda_site:  controls.prh_site.value , lda_loc:  updateItem.prh_loc, lda_part:  updateItem.prh_part })
      .subscribe((response: any) => (this.datalocdet = response.data));
  }
  openlocdet(contentlocdet) {
    this.prepareGridlocdet();
    this.modalService.open(contentlocdet, { size: "lg" });
  }

  handleSelectedRowsChangedum(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjum) {
      args.rows.map((idx) => {
        const item = this.gridObjum.getDataItem(idx);
        updateItem.prh_um = item.code_value;
     
        this.gridService.updateItem(updateItem);

/*********/
console.log(updateItem.prh_part)

      this.glassessService.getBy({gls_part: updateItem.prh_part }).subscribe((resp:any)=>{
                      
        if   (updateItem.prh_um == resp.data.gls_um )  {
          
          updateItem.prh_um_conv = 1
        } else { 
          //console.log(resp.data.gls_um)



            this.mesureService.getBy({um_um: updateItem.prh_um, um_alt_um: resp.data.gls_um, um_part: updateItem.prh_part  }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;

          if (data) {
            //alert ("Mouvement Interdit Pour ce Status")
            updateItem.prh_um_conv = res.data.um_conv 
            this.angularGrid.gridService.highlightRow(1, 1500);
          } else {
            this.mesureService.getBy({um_um: resp.data.gls_um, um_alt_um: updateItem.prh_um, um_part: updateItem.prh_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                updateItem.prh_um_conv = res.data.um_conv
                
              } else {
                updateItem.prh_um_conv = 1
                updateItem.prh_um = null
        
                alert("UM conversion manquante")
                
              }  
            })

          }
            })

          }
          })


/***********/








      });
    }
  }
angularGridReadyum(angularGrid: AngularGridInstance) {
    this.angularGridum = angularGrid
    this.gridObjum = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridum() {
    this.columnDefinitionsum = [
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
    ]

    this.gridOptionsum = {
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
    this.codeService
        .getBy({ code_fldname: "gls_um" })
        .subscribe((response: any) => (this.ums = response.data))
}
openum(content) {
    this.prepareGridum()
    this.modalService.open(content, { size: "lg" })
}



handleSelectedRowsChangedvend(e, args) {
  const controls = this.prhForm.controls;
  if (Array.isArray(args.rows) && this.gridObjvend) {
    args.rows.map((idx) => {
      const item = this.gridObjvend.getDataItem(idx);
      console.log(item)
      const date = new Date()

      this.date = controls.prh_rcp_date.value
      ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}`
      : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

      
      this.provider = item;
      this.addressService.getBy({ad_addr: item.vd_addr}).subscribe((response: any)=>{
                
                
        this.provider = response.data

     
      controls.prh_vend.setValue(item.vd_addr || "");
      controls.name.setValue(item.address.ad_name || "");
      controls.prh_curr.setValue(item.vd_curr || "");
      controls.taxable.setValue(item.address.ad_taxable || "");
      //controls.prh_taxc.setValue(item.address.ad_taxc || "");
      this.deviseService.getBy({cu_curr:item.vd_curr}).subscribe((res:any)=>{  
        this.curr = res.data
     })
    
      if (item.vd_curr == 'DA'){
        // controls.prh_ex_rate.setValue(1)
        // controls.prh_ex_rate2.setValue(1)
        console.log("heeeerrrrrrrrrre")

      } else {
       
        this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{  
        //  controls.prh_ex_rate.setValue(res.data.exr_rate)
        //  controls.prh_ex_rate2.setValue(res.data.exr_rate2)
        
      })
          }

          this.provider = response.data

        });
      });
  }
}

angularGridReadyvend(angularGrid: AngularGridInstance) {
  this.angularGridvend = angularGrid;
  this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridvend() {
  this.columnDefinitionsvend = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
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
      id: "ad_phone",
      name: "Numero telephone",
      field: "address.ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsvend = {
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
  this.providersService
    .getAll()
    .subscribe((response: any) => (this.providers = response.data));
}
openvend(content) {
  this.prepareGridvend();
  this.modalService.open(content, { size: "lg" });
}

calculatetot(){
  const controls = this.totForm.controls 
   const controlsso = this.prhForm.controls 
   let tht = 0
   let tva = 0
   let timbre = 0
   let ttc = 0
   console.log(this.dataset.length)
   for (var i = 0; i < this.dataset.length; i++) {
     console.log(this.dataset[i]  )
     tht += round((this.dataset[i].prh_pur_cost *  this.dataset[i].prh_rcvd),2)
     if(this.dataset[i].prh_taxable == true) tva += round((this.dataset[i].prh_pur_cost *  this.dataset[i].prh_rcvd) * (this.dataset[i].prh_taxc ? this.dataset[i].prh_taxc / 100 : 0),2)
    
  
     

     console.log(tva)
     if(controlsso.prh_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
       if (timbre > 10000) { timbre = 10000} } 
  
   }
 ttc = round(tht + tva + timbre,2)
console.log(tht,tva,timbre,ttc)
controls.tht.setValue(tht.toFixed(2));
controls.tva.setValue(tva.toFixed(2));
controls.timbre.setValue(timbre.toFixed(2));
controls.ttc.setValue(ttc.toFixed(2));

}


printpdf(nbr) {
  
  const controls = this.totForm.controls 
  const controlss = this.prhForm.controls 
  console.log("pdf")
  var doc = new jsPDF();
 
 // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  img.src = "./assets/media/logos/company.png";
 // doc.addImage(img, 'png', 5, 5, 210, 30)
  doc.setFontSize(12);
  doc.text( 'RC N° : ' + nbr  , 70, 40);
  doc.setFontSize(8);
  
  doc.text('Code Fournisseur : ' + this.provider.ad_addr, 20 , 50 )
  doc.text('Nom             : ' + this.provider.ad_name, 20 , 55)
  doc.text('Adresse       : ' + this.provider.ad_line1, 20 , 60)
  if (this.provider.ad_misc2_id != null) {doc.text('MF          : ' + this.provider.ad_misc2_id, 20 , 65)}
      if (this.provider.ad_gst_id != null) {doc.text('RC          : ' + this.provider.ad_gst_id, 20 , 70)}
      if (this.provider.ad_pst_id) {doc.text('AI            : ' + this.provider.ad_pst_id, 20 , 75)}
      if (this.provider.ad_misc1_id != null) {doc.text('NIS         : ' + this.provider.ad_misc1_id, 20 , 80)}
     // doc.text('Site        : ' + controls.prh_site.value, 180 , 50)

     doc.line(10, 85, 205, 85);
     doc.line(10, 90, 205, 90);
     doc.line(10, 85, 10, 90);
     doc.text('LN', 12.5 , 88.5);
     doc.line(20, 85, 20, 90);
     doc.text('Code Article', 25 , 88.5);
     doc.line(45, 85, 45, 90);
     doc.text('Désignation', 67.5 , 88.5);
     doc.line(100, 85, 100, 90);
     doc.text('QTE', 102 , 88.5);
     doc.line(110, 85, 110, 90);
     
     doc.text('Sph', 113 , 88.5);
     doc.line(120, 85, 120, 90);
     doc.text('Cyl', 123 , 88.5);
     doc.line(130, 85, 130, 90);
     doc.text('Add', 133 , 88.5);
     doc.line(140, 85, 140, 90);
     
     doc.text('PU', 148 , 88.5);
     doc.line(160, 85, 160, 90);
     doc.text('TVA', 162 , 88.5);
     doc.line(170, 85, 170, 90);
     doc.text('REM', 172 , 88.5);
     doc.line(180, 85, 180, 90);
     doc.text('THT', 192 , 88.5);
     doc.line(205, 85, 205, 90);
  var i = 95;
  doc.setFontSize(6);
  for (let j = 0; j < this.dataset.length  ; j++) {
    console.log(this.dataset[j].prh_pur_cost, this.dataset[j].prh_disc_pct, this.dataset[j].prh_rcvd)
    console.log("hnhnhnhnhnh")
    let amt = Number(this.dataset[j].prh_pur_cost) *
    ((100 - Number(this.dataset[j].prh_disc_pct)) / 100) *
    Number(this.dataset[j].prh_rcvd)
    console.log(amt, "amt")
    if ((j % 35 == 0) && (j != 0) ) {
doc.addPage();
    //  doc.addImage(img, 'png', 5, 5, 210, 30)
      doc.setFontSize(12);
      doc.text( 'RC N° : ' + nbr  , 70, 40);
      doc.setFontSize(8);
   
      doc.text('Code Fournisseur : ' + this.provider.vd_addr, 20 , 50 )
  doc.text('Nom             : ' + this.provider.ad_name, 20 , 55)
  doc.text('Adresse       : ' + this.provider.ad_line1, 20 , 60)
  if (this.provider.ad_misc2_id != null) {doc.text('MF          : ' + this.provider.ad_misc2_id, 20 , 65)}
      if (this.provider.ad_gst_id != null) {doc.text('RC          : ' + this.provider.ad_gst_id, 20 , 70)}
      if (this.provider.ad_pst_id) {doc.text('AI            : ' + this.provider.ad_pst_id, 20 , 75)}
      if (this.provider.ad_misc1_id != null) {doc.text('NIS         : ' + this.provider.ad_misc1_id, 20 , 80)}
      //doc.text('Site        : ' + controlss.prh_site.value, 180 , 50)


    


      doc.line(10, 85, 205, 85);
      doc.line(10, 90, 205, 90);
    doc.line(10, 85, 10, 90);
    doc.text('LN', 12.5 , 88.5);
    doc.line(20, 85, 20, 90);
    doc.text('Code Article', 25 , 88.5);
    doc.line(45, 85, 45, 90);
    doc.text('Désignation', 67.5 , 88.5);
    doc.line(100, 85, 100, 90);
    doc.text('QTE', 102 , 88.5);
    doc.line(110, 85, 110, 90);
    
    doc.text('Sph', 113 , 88.5);
    doc.line(120, 85, 120, 90);
    doc.text('Cyl', 123 , 88.5);
    doc.line(130, 85, 130, 90);
    doc.text('Add', 133 , 88.5);
    doc.line(140, 85, 140, 90);
    
    doc.text('PU', 148 , 88.5);
    doc.line(160, 85, 160, 90);
    doc.text('TVA', 162 , 88.5);
    doc.line(170, 85, 170, 90);
    doc.text('REM', 172 , 88.5);
    doc.line(180, 85, 180, 90);
    doc.text('THT', 192 , 88.5);
    doc.line(205, 85, 205, 90);
      i = 95;
      doc.setFontSize(6);

    }



    if (this.dataset[j].desc.length > 35) {
      let desc1 = this.dataset[j].desc.substring(35)
      let ind = desc1.indexOf(' ')
      desc1 = this.dataset[j].desc.substring(0, 35  + ind)
      let desc2 = this.dataset[j].desc.substring(35+ind)

    //   doc.line(10, i - 5, 10, i );
    //   doc.text(String(("000"+ this.dataset[j].prh_line)).slice(-3), 12.5 , i  - 1);
    //   doc.line(20, i - 5, 20, i);
    //   doc.text(this.dataset[j].prh_part, 25 , i  - 1);
    //   doc.line(45, i - 5 , 45, i );
    //   doc.text(desc1, 47 , i  - 1);
    //   doc.line(100, i - 5, 100, i );
    //   doc.text( String(Number(this.dataset[j].prh_rcvd).toFixed(2)), 118 , i  - 1 , { align: 'right' });
    //   doc.line(120, i - 5 , 120, i );
    //   doc.text(this.dataset[j].prh_um, 123 , i  - 1);
    //   doc.line(130, i - 5, 130, i );
    //   doc.text( String((this.dataset[j].prh_pur_cost)), 132 , i  - 1 );
    //   doc.line(140, i - 5, 140, i );
    //   doc.text(String(this.dataset[j].prh_loc)  , 141 , i  - 1);
    //   doc.line(153, i - 5 , 153, i );
    //  if(this.dataset[j].prh_serial != null) { doc.text(String(this.dataset[j].prh_serial)  , 156 , i  - 1)};
    //   doc.line(180, i - 5 , 180, i );
    //   if(this.dataset[j].prh_ref != null) {doc.text(String(this.dataset[j].prh_ref ), 182 , i  - 1)};
    //   doc.line(200, i-5 , 200, i );
     // doc.line(10, i, 200, i );

     doc.line(10, i - 5, 10, i );
     doc.text(String(("000"+ this.dataset[j].prh_line)).slice(-3), 12.5 , i  - 1);
     doc.line(20, i - 5, 20, i);
     doc.text(this.dataset[j].prh_part, 25 , i  - 1);
     doc.line(45, i - 5 , 45, i );
     doc.text(desc1, 47 , i  - 1);
     doc.line(100, i - 5, 100, i );
     doc.text( String(Number(this.dataset[j].prh_rcvd)), 108 , i  - 1 , { align: 'right' });
     doc.line(110, i - 5 , 110, i );
     doc.text(String(Number(this.dataset[j].prh_sph)), 113 , i  - 1);
     doc.line(120, i - 5 , 120, i );
     doc.text(String(Number(this.dataset[j].prh_cyl)), 123 , i  - 1);
     doc.line(130, i - 5 , 130, i );
     doc.text(String(Number(this.dataset[j].prh_add)), 133 , i  - 1);
     doc.line(140, i - 5, 140, i );
     doc.text( String(Number(this.dataset[j].prh_pur_cost).toFixed(2)), 168 , i  - 1 , { align: 'right' });
     doc.line(160, i - 5, 160, i );
     doc.text(String(this.dataset[j].prh_taxc) + "%" , 163 , i  - 1);
     doc.line(170, i - 5 , 170, i );
     doc.text(String(this.dataset[j].prh_disc_pct) + "%" , 173 , i  - 1);
     doc.line(180, i - 5 , 180, i );
     let amt = Number(this.dataset[j].prh_pur_cost) *
     ((100 - Number(this.dataset[j].prh_disc_pct)) / 100) *
     Number(this.dataset[j].prh_rcvd)
     console.log(amt, "amt")
     doc.text(String((Number(this.dataset[j].prh_pur_cost) *
             ((100 - Number(this.dataset[j].prh_disc_pct)) / 100) *
             Number(this.dataset[j].prh_rcvd)).toFixed(2)), 203 , i  - 1,{ align: 'right' });
     doc.line(205, i-5 , 205, i );
    // doc.line(10, i, 200, i );
      i = i + 5;

      doc.text(desc2, 47 , i  - 1);
        
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(110, i - 5 , 110, i );
        doc.line(120, i - 5, 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(140, i - 5, 140, i );
        doc.line(160, i - 5, 160, i );
        
        doc.line(170, i - 5, 170, i );
        doc.line(180, i - 5 , 180, i );
       
        doc.line(205, i-5 , 205, i );
        doc.line(10, i, 205, i );
      i = i + 5 ;
      
    } else {

    
    // doc.line(10, i - 5, 10, i );
    // doc.text(String(("000"+ this.dataset[j].prh_line)).slice(-3), 12.5 , i  - 1);
    // doc.line(20, i - 5, 20, i);
    // doc.text(this.dataset[j].prh_part, 25 , i  - 1);
    // doc.line(45, i - 5 , 45, i );
    // doc.text(this.dataset[j].desc, 47 , i  - 1);
    // doc.line(100, i - 5, 100, i );
    // doc.text( String(Number(this.dataset[j].prh_rcvd).toFixed(2)), 118 , i  - 1 , { align: 'right' });
    // doc.line(120, i - 5 , 120, i );
    // doc.text(this.dataset[j].prh_um, 123 , i  - 1);
    // doc.line(130, i - 5, 130, i );
    // doc.text( String(this.dataset[j].prh_pur_cost), 132 , i  - 1 );
    // doc.line(140, i - 5, 140, i );
    // doc.text(String(this.dataset[j].prh_loc)  , 141 , i  - 1);
    // doc.line(153, i - 5 , 153, i );
    // if(this.dataset[j].prh_serial != null) {doc.text(String(this.dataset[j].prh_serial) , 156 , i  - 1)};
    // doc.line(180, i - 5 , 180, i );
    // if (this.dataset[j].prh_ref) {doc.text(String(this.dataset[j].prh_ref ), 182 , i  - 1)};
    // doc.line(200, i-5 , 200, i );
    // doc.line(10, i, 200, i );
    doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.dataset[j].prh_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].prh_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(this.dataset[j].desc, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(Number(this.dataset[j].prh_rcvd)), 108 , i  - 1 , { align: 'right' });
      doc.line(110, i - 5 , 110, i );
      doc.text(String(Number(this.dataset[j].prh_sph)), 113 , i  - 1);
     doc.line(120, i - 5 , 120, i );
     doc.text(String(Number(this.dataset[j].prh_cyl)), 123 , i  - 1);
     doc.line(130, i - 5 , 130, i );
     doc.text(String(Number(this.dataset[j].prh_add)), 133 , i  - 1);
      doc.line(140, i - 5, 140, i );
      doc.text( String(Number(this.dataset[j].prh_pur_cost).toFixed(2)), 158 , i  - 1 , { align: 'right' });
      doc.line(160, i - 5, 160, i );
      doc.text(String(this.dataset[j].prh_taxc) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String(this.dataset[j].prh_disc_pct) + "%" , 173 , i  - 1);
      doc.line(180, i - 5 , 180, i );
      
      doc.text(String((Number(this.dataset[j].prh_pur_cost) *
              ((100 - Number(this.dataset[j].prh_disc_pct)) / 100) *
              Number(this.dataset[j].prh_rcvd)).toFixed(2)), 198 , i  - 1,{ align: 'right' });
      doc.line(205, i-5 , 205, i );
      doc.line(10, i, 205, i );
      
    i = i + 5;
    }
  }
  
 // doc.line(10, i - 5, 200, i - 5);
// doc.line(10, i - 5, 200, i - 5);

doc.line(130, i + 7,  205, i + 7  );
doc.line(130, i + 14, 205, i + 14 );
doc.line(130, i + 21, 205, i + 21 );
doc.line(130, i + 28, 205, i + 28 );
doc.line(130, i + 35, 205, i + 35 );
doc.line(130, i + 7,  130, i + 35  );
doc.line(160, i + 7,  160, i + 35  );
doc.line(205, i + 7,  205, i + 35  );
doc.setFontSize(10);

doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });


doc.text(String(Number(controls.tht.value).toFixed(2)), 203 ,  i + 12 , { align: 'right' });
doc.text(String(Number(controls.tva.value).toFixed(2)), 203 ,  i + 19 , { align: 'right' });
doc.text(String(Number(controls.timbre.value).toFixed(2)), 203 ,  i + 26 , { align: 'right' });
doc.text(String(Number(controls.ttc.value).toFixed(2)), 203 ,  i + 33 , { align: 'right' });

doc.setFontSize(8);
   let mt = NumberToLetters(
     Number(controls.ttc.value).toFixed(2),"Dinars Algerien")

     if (mt.length > 95) {
       let mt1 = mt.substring(90)
       let ind = mt1.indexOf(' ')
      
       mt1 = mt.substring(0, 90  + ind)
       let mt2 = mt.substring(90+ind)
  
       doc.text( "Arretée la présente Commande a la somme de :" + mt1  , 20, i + 53)
       doc.text(  mt2  , 20, i + 60)
     } else {
       doc.text( "Arretée la présente Commande a la somme de :" + mt  , 20, i + 53)

     }
 doc.setFontSize(10);
 
 
       // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }








  /************************************************GLS****************************************** */

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
  addNewItemGls() {
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
  createGlsForm() {
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
  resetGls() {
    this.glasses = new Glasses();
    this.createForm();
    this.hasFormErrors1 = false;
    this.hasFormErrors2 = false;
    this.hasFormErrors3 = false;
    this.hasFormErrors4 = false;
  }
  // save data
  onSubmitGls() {
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
    _sct.sct_site = "1000";
   
    
    return _sct;
  }

  prepareSct2(): CostSimulation {
    const controls = this.sctForm1.controls;
    const control1 = this.form1.controls;
    const _sct = new CostSimulation();
    _sct.sct_sim = 'STDCR'
    _sct.sct_part = this.code
    _sct.sct_site = "1000";
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
    this.providersService
      .getAll()
      .subscribe((response: any) => (this.providerss = response.data));
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

newGls(content) {
    this.initmvGrid();
  this.createGlsForm()
  this.modalService.open(content, { size: 'xl' });
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

  /************************************************GLS****************************************** */
}
