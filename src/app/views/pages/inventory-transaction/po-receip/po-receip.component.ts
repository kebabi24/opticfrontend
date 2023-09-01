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
  ItemService,
  AccountPayableService,
  
  AddressService,
  TaxeService,
  DeviseService,
  VendorProposal,
  InventoryTransaction,
  PurchaseReceive,
  InventoryTransactionService,
  PurchaseReceiveService,
  LocationService,
  SiteService,
  MesureService,
  SequenceService,
  LocationDetailService,
  CodeService,
  InventoryStatusService,
  printReceive,
  AccountPayable,




  Item,
  CostSimulation,
  CostSimulationService,
  Code,
  BankService,
  Provider,
  Address,
  
} from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
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


@Component({
  selector: 'kt-po-receip',
  templateUrl: './po-receip.component.html',
  styleUrls: ['./po-receip.component.scss']
})
export class PoReceipComponent implements OnInit {
  purchaseReceive: PurchaseReceive;
  inventoryTransaction: InventoryTransaction;
  prhForm: FormGroup;
  totForm: FormGroup;
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







item: Item;
  codemstr: Code;
  hasFormErrors1 = false;
  hasFormErrors2 = false;
  hasFormErrors3 = false;
  hasFormErrors4 = false;
  fieldcode = "";
  codeForm: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;


  sequences: [];
  columnDefinitionsseq: Column[] = [];
  gridOptionsseq: GridOption = {};
  gridObjseq: any;
  angularGridseq: AngularGridInstance;

  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  dataset2: any[] = [];

  providerss: [];
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
  pt_upc: any[] = [];
  pt_dsgn_grp: any[] = [];
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
  


  datatax: []
  columnDefinitionstax: Column[] = []
  gridOptionstax: GridOption = {}
  gridObjtax: any
  angularGridtax: AngularGridInstance

site: any;
loc: any;

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
  msg: String;
tauxtaxe:Number;
  isExist = false;
isExist2 = false;
isExist3 = false;
  sct1: CostSimulation;
  sct2: CostSimulation;

  sctForm: FormGroup;
  sctForm1: FormGroup;
  code: any;
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
  providerForm: FormGroup
  hasFormErrors5 = false
  hasFormErrors6 = false
  hasProviderFormErrors = false
codevalue;
  datacode: [];
  columnDefinitionscode: Column[] = [];
  gridOptionscode: GridOption = {};
  gridObjcode: any;
  angularGridcode: AngularGridInstance;
  fldname;
  datataxv: []
  columnDefinitionstaxv: Column[] = []
  gridOptionstaxv: GridOption = {}
  gridObjtaxv: any
  angularGridtaxv: AngularGridInstance
  
  constructor(
    config: NgbDropdownConfig,
    private prhFB: FormBuilder,
    private totFB: FormBuilder,
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
    private itemsService: ItemService,
    private codeService: CodeService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private locationDetailService: LocationDetailService,
    private deviseService: DeviseService,
    private taxService: TaxeService,
    private accountPayableService: AccountPayableService,
    private sequenceService: SequenceService,
    private inventoryStatusService: InventoryStatusService,
    private locationService: LocationService,



    private formBuilder: FormBuilder,
    private codeFB: FormBuilder,
    private sctService: CostSimulationService,
    private providerService: ProviderService,
    private itemService: ItemService,
    private bankService: BankService,

  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "vd_cr_terms" })
    .subscribe((response: any) => (this.prh_cr_terms = response.data));
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
    .getBy({ code_fldname: "pt_dsgn_grp" })
    .subscribe((response: any) => (this.pt_dsgn_grp = response.data));
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
          this.itemsService.getBy({pt_part: args.dataContext.prh_part }).subscribe((resp:any)=>{
            
          if   (args.dataContext.prh_um == resp.data.pt_um )  {
            
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_um_conv: 1 })
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: args.dataContext.prh_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.prh_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
    
            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_um_conv: res.data.um_conv })
              this.angularGrid.gridService.highlightRow(1, 1500);
            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.prh_um, um_part: args.dataContext.prh_part  }).subscribe((res:any)=>{
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
      {
        id: "prh_um_conv",
        name: "Conv UM",
        field: "prh_um_conv",
        sortable: true,
        width: 80,
        filterable: false,
       // editor: {
       //     model: Editors.float,
        //},
        
      },
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
      {
        id: "prh_tax_code",
        name: "Code de Taxe",
        field: "prh_tax_code",
        sortable: true,
        width: 80,
        filterable: false,
        
      },  
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

                    this.locationDetailService.getBy({ ld_site: controls.prh_site.value, ld_loc: args.dataContext.prh_loc, ld_part: args.dataContext.prh_part, ld_lot: null }).subscribe(
                      (response: any) => {
                        this.lddet = response.data
                        console.log(this.lddet[0].ld_qty_oh)
               
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
      */
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
            this.locationDetailService.getBy({ ld_site: controls.prh_site.value, ld_loc: args.dataContext.prh_loc, ld_part: args.dataContext.prh_part, ld_lot: args.dataContext.prh_serial }).subscribe(
              (response: any) => {
                this.lddet = response.data
                
        console.log(response.data.length)
                  if (response.data.length != 0) {
                    
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: this.lddet[0].ld_status, tr_expire: this.lddet[0].tr_expire})
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
      },
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
      
      {
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
        id: "prh_ref",
        name: "N° Série",
        field: "prh_ref",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      /*{
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
      },*/
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
      prh_ex_rate: [this.purchaseReceive.prh_ex_rate],
      prh_ex_rate2: [this.purchaseReceive.prh_ex_rate2],
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
    _pr.prh_ex_rate = controls.prh_ex_rate.value
    _pr.prh_ex_rate2 = controls.prh_ex_rate2.value 
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
    _ap.ap_ex_rate  = controls.prh_ex_rate.value
    _ap.ap_ex_rate2 = controls.prh_ex_rate2.value
    _ap.ap_xinvoice = controls.prh_xinvoice.value
    _ap.ap_po_nbr = controls.prh_nbr.value
    _ap.ap_po = controls.prh_rmks.value
    _ap.ap_amt = controls1.ttc.value
    _ap.ap_base_amt = Number(controls1.ttc.value) * Number(controls.prh_ex_rate2.value) /  Number(controls.prh_ex_rate.value)

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
      .add({detail, pr,prhnbr})
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
        controls.prh_ex_rate.setValue(this.prhServer.po_ex_rate);
        controls.prh_ex_rate2.setValue(this.prhServer.po_ex_rate2);
        const ad_addr = this.prhServer.po_vend;
        console.log(ad_addr)
        this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                
                
          this.provider = response.data

        controls.name.setValue(this.provider.ad_name);
      

        for (const object in det1) {
          console.log(details[object]);
          const detail = details[object];
          this.locationService.getByOne({ loc_loc: detail.item.pt_loc, loc_site: detail.item.pt_site }).subscribe(
            (response: any) => {
              this.location = response.data
              console.log( this.location)
if (this.location == null) {this.stat = null} else {this.stat = this.location.loc_status}

          this.gridService.addItem(
            {

              
              id: this.dataset.length + 1,
              prh_line: this.dataset.length + 1,
              prh_part: detail.pod_part,
              cmvid: "",
              desc: detail.item.pt_desc1,
              qty_received: detail.pod_qty_rcvd,
              prh_rcvd: detail.pod_qty_ord - detail.pod_qty_rcvd ,
              prh_um: detail.item.pt_um,
              prh_taxable: detail.pod_taxable,
              prh_taxc: detail.pod_taxc,
              prh_tax_code: detail.pod_tax_code,
              prh_um_conv: 1,
              prh_pur_cost: detail.pod_price,
              
              //prh_site: detail.item.pt_site,
              prh_loc: detail.item.pt_loc,
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
            prh_part: detail.pod_part,
            cmvid: "",
            desc: detail.item.pt_desc1,
            qty_received: detail.pod_qty_rcvd,
            prh_rcvd: detail.pod_qty_ord,
            prh_taxable: detail.pod_taxable,
            prh_taxc: detail.pod_taxc,
            prh_tax_code: detail.pod_tax_code,
              
            prh_um: detail.item.pt_um,
            prh_um_conv: 1,
            prh_pur_cost: detail.pod_price,
            //prh_site: detail.item.pt_site,
            prh_loc: detail.item.pt_loc,
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
       // prh_site: "",
        prh_loc: "",
        prh_ref:null,
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
        prh_um_conv: this.dataset[i - 1].prh_um_conv,
        prh_pur_cost: this.dataset[i - 1].prh_pur_cost,
        prh_site: this.dataset[i - 1].prh_site,
        prh_loc: this.dataset[i - 1].prh_loc,
        prh_serial: this.dataset[i - 1].prh_serial,
        tr_status: this.dataset[i - 1].tr_serial,
        prh_ref: null,
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

        this.locationService.getByOne({ loc_loc: item.pt_loc, loc_site: controls.prh_site.value }).subscribe(
          (response: any) => {
            this.location = response.data
            console.log( this.location.loc_status)
        updateItem.prh_part = item.pt_part;
        updateItem.desc = item.pt_desc1;
        updateItem.prh_um = item.pt_um;
        updateItem.prh_um_conv = 1;
        updateItem.prh_pur_cost = item.pt_pur_price;
        //updateItem.prh_site = item.pt_site;
        updateItem.prh_loc = item.pt_loc;
        updateItem.tr_status =  this.location.loc_status;
      if(controls.taxable.value == false) {
        updateItem.prh_taxable = false
      } else {  
        updateItem.prh_taxable = item.pt_taxable}
        updateItem.prh_tax_code = item.pt_taxc
        
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
        id: "pt_part",
        name: "code ",
        field: "pt_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_desc1",
        name: "desc",
        field: "pt_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_um",
        name: "UM",
        field: "pt_um",
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
    this.itemsService
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
            controls.prh_ex_rate.setValue(this.prhServer.po_ex_rate);
            controls.prh_ex_rate2.setValue(this.prhServer.po_ex_rate2);
            const ad_addr = this.prhServer.po_vend;
            console.log(ad_addr)
            this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                    
                    
              this.provider = response.data
    
            controls.name.setValue(this.provider.ad_name);
          
            for (const object in det1) {
              console.log(details[object]);
              const detail = details[object];
              this.locationService.getByOne({ loc_loc: detail.item.pt_loc, loc_site: detail.item.pt_site }).subscribe(
                (response: any) => {
                  this.location = response.data
                 // console.log( this.location.loc_status)
                  if (this.location == null) {this.stat = null} else {this.stat = this.location.loc_status}
              this.gridService.addItem(
                {
                  id: this.dataset.length + 1,
                  prh_line: this.dataset.length + 1,
                  prh_part: detail.pod_part,
                  cmvid: "",
                  desc: detail.item.pt_desc1,
                  qty_received: detail.pod_qty_rcvd,
                  prh_rcvd: detail.pod_qty_ord - detail.pod_qty_rcvd,
                  prh_um: detail.item.pt_um,
                  prh_um_conv: 1,
                  prh_pur_cost: detail.pod_price,
                  prh_disc_pct: detail.pod_disc_pct,
                  prh_taxable: detail.pod_taxable,
                  prh_taxc: detail.pod_taxc,
                  prh_tax_code: detail.pod_tax_code,
                  //prh_site: detail.item.pt_site,
                  prh_loc: detail.item.pt_loc,
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
                prh_part: detail.pod_part,
                cmvid: "",
                desc: detail.item.pt_desc1,
                qty_received: detail.pod_qty_rcvd,
                prh_rcvd: detail.pod_qty_ord,
                prh_um: detail.item.pt_um,
                prh_um_conv: 1,
                prh_pur_cost: detail.pod_price,
                prh_disc_pct: detail.pod_disc_pct,
                prh_taxable: detail.pod_taxable,
                prh_taxc: detail.pod_taxc,
                prh_tax_code: detail.pod_tax_code,
                //prh_site: detail.item.pt_site,
                prh_loc: detail.item.pt_loc,
                prh_serial: "",
                tr_status:  this.stat,
                prh_vend_lot: "",
                tr_expire: null,
            });
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
            controls.prh_ex_rate.setValue(res.data.exr_rate)
            controls.prh_ex_rate2.setValue(res.data.exr_rate2)
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

            

        this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-SO" }).subscribe((res:any)=>{
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
          updateItem.prh_serial = item.ld_lot;
          updateItem.tr_status = item.ld_status;
          updateItem.tr_expire = item.ld_expire;
          updateItem.qty_oh = item.ld_qty_oh;
          
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
        id: "ld_site",
        name: "Site",
        field: "ld_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_loc",
        name: "Emplacement",
        field: "ld_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_part",
        name: "Article",
        field: "ld_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_lot",
        name: "Lot",
        field: "ld_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_qty_oh",
        name: "Qte",
        field: "ld_qty_oh",
        sortable: true,
        filterable: true,
        type: FieldType.float,
      },
      {
        id: "ld_status",
        name: "Status",
        field: "ld_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_expire",
        name: "Expire",
        field: "ld_expire",
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
    this.locationDetailService
      .getBy({ ld_site:  controls.prh_site.value , ld_loc:  updateItem.prh_loc, ld_part:  updateItem.prh_part })
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

      this.itemsService.getBy({pt_part: updateItem.prh_part }).subscribe((resp:any)=>{
                      
        if   (updateItem.prh_um == resp.data.pt_um )  {
          
          updateItem.prh_um_conv = 1
        } else { 
          //console.log(resp.data.pt_um)



            this.mesureService.getBy({um_um: updateItem.prh_um, um_alt_um: resp.data.pt_um, um_part: updateItem.prh_part  }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;

          if (data) {
            //alert ("Mouvement Interdit Pour ce Status")
            updateItem.prh_um_conv = res.data.um_conv 
            this.angularGrid.gridService.highlightRow(1, 1500);
          } else {
            this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.prh_um, um_part: updateItem.prh_part  }).subscribe((res:any)=>{
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
        .getBy({ code_fldname: "pt_um" })
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
        controls.prh_ex_rate.setValue(1)
        controls.prh_ex_rate2.setValue(1)
        console.log("heeeerrrrrrrrrre")

      } else {
       
        this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{  
         controls.prh_ex_rate.setValue(res.data.exr_rate)
         controls.prh_ex_rate2.setValue(res.data.exr_rate2)
        
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
  //doc.addImage(img, 'png', 5, 5, 210, 30)
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

    
  doc.line(10, 85, 200, 85);
  doc.line(10, 90, 200, 90);
  doc.line(10, 85, 10, 90);
  doc.text('LN', 12.5 , 88.5);
  doc.line(20, 85, 20, 90);
  doc.text('Code Article', 25 , 88.5);
  doc.line(45, 85, 45, 90);
  doc.text('Désignation', 67.5 , 88.5);
  doc.line(100, 85, 100, 90);
  doc.text('QTE', 107 , 88.5);
  doc.line(120, 85, 120, 90);
  doc.text('UM', 123 , 88.5);
  doc.line(130, 85, 130, 90);
  doc.text('Prix', 132 , 88.5);
  doc.line(140, 85, 140, 90);
  doc.text('Empl', 142 , 88.5);
  doc.line(153, 85, 153, 90);
  doc.text('Lot/Serie', 158 , 88.5);
  doc.line(180, 85, 180, 90);
  doc.text('Réference', 182 , 88.5);
  doc.line(200, 85, 200, 90);
  var i = 95;
  doc.setFontSize(6);
  for (let j = 0; j < this.dataset.length  ; j++) {
    
    if ((j % 35 == 0) && (j != 0) ) {
doc.addPage();
     // doc.addImage(img, 'png', 5, 5, 210, 30)
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


    



      doc.line(10, 85, 200, 85);
      doc.line(10, 90, 200, 90);
      doc.line(10, 85, 10, 90);
      doc.text('LN', 12.5 , 88.5);
      doc.line(20, 85, 20, 90);
      doc.text('Code Article', 25 , 88.5);
      doc.line(45, 85, 45, 90);
      doc.text('Désignation', 67.5 , 88.5);
      doc.line(100, 85, 100, 90);
      doc.text('QTE', 107 , 88.5);
      doc.line(120, 85, 120, 90);
      doc.text('UM', 123 , 88.5);
      doc.line(130, 85, 130, 90);
      doc.text('Prix', 132 , 88.5);
      doc.line(140, 85, 140, 90);
      doc.text('Empl', 142 , 88.5);
      doc.line(153, 85, 153, 90);
      doc.text('Lot/Série', 152 , 88.5);
      doc.line(180, 85, 180, 90);
      doc.text('Réf', 182 , 88.5);
      doc.line(200, 85, 200, 90);
      i = 95;
      doc.setFontSize(6);

    }



    if (this.dataset[j].desc.length > 35) {
      let desc1 = this.dataset[j].desc.substring(35)
      let ind = desc1.indexOf(' ')
      desc1 = this.dataset[j].desc.substring(0, 35  + ind)
      let desc2 = this.dataset[j].desc.substring(35+ind)

      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.dataset[j].prh_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].prh_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(desc1, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(Number(this.dataset[j].prh_rcvd).toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.dataset[j].prh_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String((this.dataset[j].prh_pur_cost)), 132 , i  - 1 );
      doc.line(140, i - 5, 140, i );
      doc.text(String(this.dataset[j].prh_loc)  , 141 , i  - 1);
      doc.line(153, i - 5 , 153, i );
     if(this.dataset[j].prh_serial != null) { doc.text(String(this.dataset[j].prh_serial)  , 156 , i  - 1)};
      doc.line(180, i - 5 , 180, i );
      if(this.dataset[j].prh_ref != null) {doc.text(String(this.dataset[j].prh_ref ), 182 , i  - 1)};
      doc.line(200, i-5 , 200, i );
     // doc.line(10, i, 200, i );

      i = i + 5;

      doc.text(desc2, 47 , i  - 1);
      
      doc.line(10, i - 5, 10, i );
      doc.line(20, i - 5, 20, i);
      doc.line(45, i - 5 , 45, i );
      doc.line(100, i - 5, 100, i );
      doc.line(120, i - 5 , 120, i );
      doc.line(130, i - 5, 130, i );
      doc.line(140, i - 5, 140, i );
      doc.line(153, i - 5 , 153, i );
      doc.line(180, i - 5 , 180, i );
      doc.line(200, i-5 , 200, i );
      doc.line(10, i, 200, i );

      i = i + 5 ;
      
    } else {


    
    doc.line(10, i - 5, 10, i );
    doc.text(String(("000"+ this.dataset[j].prh_line)).slice(-3), 12.5 , i  - 1);
    doc.line(20, i - 5, 20, i);
    doc.text(this.dataset[j].prh_part, 25 , i  - 1);
    doc.line(45, i - 5 , 45, i );
    doc.text(this.dataset[j].desc, 47 , i  - 1);
    doc.line(100, i - 5, 100, i );
    doc.text( String(Number(this.dataset[j].prh_rcvd).toFixed(2)), 118 , i  - 1 , { align: 'right' });
    doc.line(120, i - 5 , 120, i );
    doc.text(this.dataset[j].prh_um, 123 , i  - 1);
    doc.line(130, i - 5, 130, i );
    doc.text( String(this.dataset[j].prh_pur_cost), 132 , i  - 1 );
    doc.line(140, i - 5, 140, i );
    doc.text(String(this.dataset[j].prh_loc)  , 141 , i  - 1);
    doc.line(153, i - 5 , 153, i );
    if(this.dataset[j].prh_serial != null) {doc.text(String(this.dataset[j].prh_serial) , 156 , i  - 1)};
    doc.line(180, i - 5 , 180, i );
    if (this.dataset[j].prh_ref) {doc.text(String(this.dataset[j].prh_ref ), 182 , i  - 1)};
    doc.line(200, i-5 , 200, i );
    doc.line(10, i, 200, i );
    i = i + 5;
    }
  }
  
 // doc.line(10, i - 5, 200, i - 5);
// doc.line(10, i - 5, 200, i - 5);

doc.line(130, i + 7,  200, i + 7  );
doc.line(130, i + 14, 200, i + 14 );
doc.line(130, i + 21, 200, i + 21 );
doc.line(130, i + 28, 200, i + 28 );
doc.line(130, i + 35, 200, i + 35 );
doc.line(130, i + 7,  130, i + 35  );
doc.line(160, i + 7,  160, i + 35  );
doc.line(200, i + 7,  200, i + 35  );
doc.setFontSize(10);

doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });


doc.text(String(Number(controls.tht.value).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

doc.setFontSize(8);
   let mt = NumberToLetters(
     Number(controls.ttc.value).toFixed(2),this.curr.cu_desc)

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






  /**************************************************MNT********************************* */
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
  createMNTForm() {
    this.loadingSubject.next(false);
    this.item = new Item();
    this.form1 = this.formBuilder.group({
     
      pt_desc1: [ this.item.pt_desc1,Validators.required],
      //pt_um: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
      //pt_prod_line: [{ value: this.item.pt_prod_line, disabled: !this.isExist },Validators.required],
      pt_part_type: [{ value: this.item.pt_part_type, disabled: !this.isExist },Validators.required],
      pt_draw: [{ value: this.item.pt_draw, disabled: !this.isExist },Validators.required],
      pt_rev: [{ value: this.item.pt_rev, disabled: !this.isExist }],
      pt_dsgn_grp: [{ value: this.item.pt_dsgn_grp, disabled: !this.isExist }],
      pt_group: [{ value: this.item.pt_group, disabled: !this.isExist }],
      //pt_upc: [{ value: this.item.pt_upc, disabled: !this.isExist }],
      //pt_break_cat: [{ value: this.item.pt_break_cat, disabled: !this.isExist }],
      pt_abc: [{ value: this.item.pt_abc, disabled: !this.isExist },Validators.required],
      //pt_avg_int: [{ value: this.item.pt_avg_int, disabled: !this.isExist }],
      //pt_lot_ser: [{ value: this.item.pt_lot_ser, disabled: !this.isExist }],
      //pt_cyc_int: [{ value: this.item.pt_cyc_int, disabled: !this.isExist }],
      pt_site: [{ value: this.item.pt_site, disabled: !this.isExist },Validators.required],
      //pt_shelflife: [{ value: this.item.pt_shelflife, disabled: !this.isExist }],
      pt_loc: [{ value: this.item.pt_loc, disabled: !this.isExist },Validators.required],
      //pt_sngl_lot: [{ value: this.item.pt_sngl_lot, disabled: !this.isExist }],
      //pt_loc_type: [{ value: this.item.pt_loc_type, disabled: !this.isExist }],
      //pt_critical: [{ value: this.item.pt_critical, disabled: !this.isExist }],
      //pt_auto_lot: [{ value: this.item.pt_auto_lot, disabled: !this.isExist }],
      //pt_rctpo_status: [{ value: this.item.pt_rctpo_status, disabled: !this.isExist }],
      //pt_rctpo_active: [{ value: this.item.pt_rctpo_active, disabled: !this.isExist }],
      //pt_lot_grp: [{ value: this.item.pt_lot_grp, disabled: !this.isExist }],
      //pt_rctwo_status: [{ value: this.item.pt_rctwo_status, disabled: !this.isExist }],
      //pt_rctwo_active: [{ value: this.item.pt_rctwo_active, disabled: !this.isExist }],
       pt_vend: [{ value: this.item.pt_vend, disabled: !this.isExist }],

      pt_article: [{ value: this.item.pt_article, disabled: !this.isExist }],
      pt_price: [{ value: this.item.pt_price, disabled: !this.isExist }],
      pt_pur_price: [{ value: this.item.pt_pur_price, disabled: !this.isExist }],
      pt_taxable: [{ value: this.item.pt_taxable, disabled: !this.isExist }],
      pt_taxc: [{ value: this.item.pt_taxc, disabled: !this.isExist },Validators.required],
      pt_sales_price: [{ value: this.item.pt_sales_price, disabled: !this.isExist }],
      pt_marge: [{ value: this.item.pt_marge, disabled: !this.isExist }],
      
    });
    const controls = this.form1.controls;
    this.siteService.getByOne({ si_default: true  }).subscribe(
      (res: any) => {
      this.site = res.data.si_site
      
      controls.pt_site.setValue(this.site );
     
    })
    this.locationService.getByOne({ loc_perm: true  }).subscribe(
      (res: any) => {
      this.loc = res.data.loc_loc
      
      controls.pt_loc.setValue(this.loc );
      controls.pt_abc.setValue("A" );
    })
    
    //this.form2 = this.formBuilder.group({
      // pt_ship_wt: [{ value: this.item.pt_ship_wt, disabled: !this.isExist }],
      // pt_ship_wt_um: [{ value: this.item.pt_ship_wt_um, disabled: !this.isExist }],
      // pt_net_wt: [{ value: this.item.pt_net_wt, disabled: !this.isExist }],
      // pt_net_wt_um: [{ value: this.item.pt_net_wt_um, disabled: !this.isExist }],
      // pt_fr_class: [{ value: this.item.pt_fr_class, disabled: !this.isExist }],
      // pt_size: [{ value: this.item.pt_size, disabled: !this.isExist }],
      // pt_size_um: [{ value: this.item.pt_size_um, disabled: !this.isExist }],
    //});
    //this.form3 = this.formBuilder.group({
      // pt_ms: [{ value: this.item.pt_ms, disabled: !this.isExist }],
      // pt_buyer: [{ value: this.item.pt_buyer, disabled: !this.isExist }],
      // pt_phantom: [{ value: this.item.pt_phantom, disabled: !this.isExist }],
      // pt_plan_ord: [{ value: this.item.pt_plan_ord, disabled: !this.isExist }],
      // pt_vend: [{ value: this.item.pt_vend, disabled: !this.isExist }],

      // pt_ord_min: [{ value: this.item.pt_ord_min, disabled: !this.isExist }],
      // pt_timefence: [{ value: this.item.pt_timefence, disabled: !this.isExist }],
      // pt_po_site: [{ value: this.item.pt_po_site, disabled: !this.isExist }],
      // pt_ord_max: [{ value: this.item.pt_ord_max, disabled: !this.isExist }],
      // pt_pm_code: [{ value: this.item.pt_pm_code, disabled: !this.isExist }],
      // pt_ord_mult: [{ value: this.item.pt_ord_mult, disabled: !this.isExist }],
      // pt_ord_pol: [{ value: this.item.pt_ord_pol, disabled: !this.isExist }],
      // pt_cfg_type: [{ value: this.item.pt_cfg_type, disabled: !this.isExist }],
      // pt_op_yield: [{ value: this.item.pt_op_yield, disabled: !this.isExist }],
      // pt_ord_qty: [{ value: this.item.pt_ord_qty, disabled: !this.isExist }],
      // pt_insp_rqd: [{ value: this.item.pt_insp_rqd, disabled: !this.isExist }],
      // pt_yield_pct: [{ value: this.item.pt_yield_pct, disabled: !this.isExist }],
      // pt_insp_lead: [{ value: this.item.pt_insp_lead, disabled: !this.isExist }],
      // pt_run: [{ value: this.item.pt_run, disabled: !this.isExist }],
      // pt_ord_per: [{ value: this.item.pt_ord_per, disabled: !this.isExist }],
      // pt_mfg_lead: [{ value: this.item.pt_mfg_lead, disabled: !this.isExist }],
      // pt_pur_lead: [{ value: this.item.pt_pur_lead, disabled: !this.isExist }],
      // pt_setup: [{ value: this.item.pt_setup, disabled: !this.isExist }],
      // pt_sfty_stk: [{ value: this.item.pt_sfty_stk, disabled: !this.isExist }],
      // pt_sfty_time: [{ value: this.item.pt_sfty_time, disabled: !this.isExist }],
      // pt_rop: [{ value: this.item.pt_rop, disabled: !this.isExist }],
      // pt_atp_family: [{ value: this.item.pt_atp_family, disabled: !this.isExist }],
      // pt_network: [{ value: this.item.pt_network, disabled: !this.isExist }],
      // pt_run_seq1: [{ value: this.item.pt_run_seq1, disabled: !this.isExist }],
      // pt_routing: [{ value: this.item.pt_routing, disabled: !this.isExist }],
      // pt_iss_pol: [{ value: this.item.pt_iss_pol, disabled: !this.isExist }],
      // pt_run_seq2: [{ value: this.item.pt_run_seq2, disabled: !this.isExist }],
      // pt_bom_code: [{ value: this.item.pt_bom_code, disabled: !this.isExist }],
   // });
    // this.form4 = this.formBuilder.group({
    //   pt_price: [{ value: this.item.pt_price, disabled: !this.isExist }],
    //   pt_pur_price: [{ value: this.item.pt_pur_price, disabled: !this.isExist }],
    //   pt_taxable: [{ value: this.item.pt_taxable, disabled: !this.isExist }],
    //   pt_taxc: [{ value: this.item.pt_taxc, disabled: !this.isExist },Validators.required],
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

    this.itemService
        .getByOne({
            pt_desc1: controls1.pt_desc1.value,
        })
        .subscribe((response: any) => {
        
            if (response.data) {
                this.isExist = true
                console.log(response.data)
            } else {
             
            
              //controls1.pt_um.enable()
              //controls1.pt_prod_line.enable()
              controls1.pt_part_type.enable()
              controls1.pt_draw.enable()
              //controls1.pt_status.enable()
              controls1.pt_rev.enable()
             // controls1.pt_upc.enable()
              controls1.pt_dsgn_grp.enable()
              controls1.pt_group.enable()
              // controls1.pt_drwg_loc.enable()
              // controls1.pt_drwg_size.enable()
              // controls1.pt_promo.enable()
              // controls1.pt_break_cat.enable()
              controls1.pt_abc.enable()
              // controls1.pt_avg_int.enable()
              // controls1.pt_lot_ser.enable()
              // controls1.pt_cyc_int.enable()
              controls1.pt_site.enable()
              // controls1.pt_shelflife.enable()
              controls1.pt_loc.enable()
              // controls1.pt_sngl_lot.enable()
              // controls1.pt_loc_type.enable()
              // controls1.pt_critical.enable()
              // controls1.pt_auto_lot.enable()
              // controls1.pt_rctpo_status.enable()
              // controls1.pt_rctpo_active.enable()
              // controls1.pt_lot_grp.enable()
              // controls1.pt_rctwo_status.enable()
              // controls1.pt_rctwo_active.enable()
               controls1.pt_article.enable()
              // controls2.pt_ship_wt.enable()
              // controls2.pt_ship_wt_um.enable()
              // controls2.pt_net_wt.enable()
              // controls2.pt_net_wt_um.enable()
              // controls2.pt_fr_class.enable()
              // controls2.pt_size.enable()
              // controls2.pt_size_um.enable()
              // controls3.pt_ms.enable()
              // controls3.pt_buyer.enable()
              // controls3.pt_phantom.enable()
              // controls3.pt_plan_ord.enable()
              controls1.pt_vend.enable()
              // controls3.pt_ord_min.enable()
              // controls3.pt_timefence.enable()
              // controls3.pt_po_site.enable()
              // controls3.pt_ord_max.enable()
              // controls3.pt_pm_code.enable()
              // controls3.pt_ord_mult.enable()
              // controls3.pt_ord_pol.enable()
              // controls3.pt_cfg_type.enable()
              // controls3.pt_op_yield.enable()
              // controls3.pt_ord_qty.enable()
              // controls3.pt_insp_rqd.enable()
              // controls3.pt_yield_pct.enable()
              // controls3.pt_insp_lead.enable()
              // controls3.pt_run.enable()
              // controls3.pt_ord_per.enable()
              // controls3.pt_mfg_lead.enable()
              // controls3.pt_pur_lead.enable()
              // controls3.pt_setup.enable()
              // controls3.pt_sfty_stk.enable()
              // controls3.pt_sfty_time.enable()
              // controls3.pt_rop.enable()
              // controls3.pt_atp_family.enable()
              // controls3.pt_network.enable()
              // controls3.pt_run_seq1.enable()
              // controls3.pt_routing.enable()
              // controls3.pt_iss_pol.enable()
              // controls3.pt_run_seq2.enable()
              // controls3.pt_bom_code.enable()
              controls1.pt_price.enable()
              controls1.pt_pur_price.enable()
              controls1.pt_marge.enable()
              controls1.pt_sales_price.enable()
              controls1.pt_taxable.enable()

              controls1.pt_taxc.enable()
        

            }
        })
}
//reste form
  //reste form
  resetMNT() {
    this.item = new Item();
    this.createMNTForm();
    this.hasFormErrors1 = false;
    this.hasFormErrors2 = false;
    this.hasFormErrors3 = false;
    this.hasFormErrors4 = false;
  }
  // save data
  onSubmitMnt() {
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
    this.sequenceService.getByOne({ seq_type: "MN" }).subscribe(
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
  prepareItem(): Item {
    const controls1 = this.form1.controls;
    // const controls2 = this.form2.controls;
    // const controls3 = this.form3.controls;
    // const controls4 = this.form4.controls;

    const _item = new Item();
    _item.pt_part = this.code;
  
    _item.pt_desc1 = controls1.pt_desc1.value;
    _item.pt_um = "UN";
   // _item.pt_prod_line = controls1.pt_prod_line.value;
    _item.pt_part_type = controls1.pt_part_type.value;
    _item.pt_draw = controls1.pt_draw.value;
    _item.pt_status = "pf-actif";
    _item.pt_rev = controls1.pt_rev.value;
    //_item.pt_rev = controls1.pt_upc.value;
   
    _item.pt_dsgn_grp = controls1.pt_dsgn_grp.value;
    _item.pt_group = controls1.pt_group.value;
    // _item.pt_drwg_loc = controls1.pt_drwg_loc.value;
    // _item.pt_drwg_size = controls1.pt_drwg_size.value;
    // _item.pt_promo = controls1.pt_promo.value;
    // _item.pt_break_cat = controls1.pt_break_cat.value;
    _item.pt_abc = controls1.pt_abc.value;
    // _item.pt_avg_int = controls1.pt_avg_int.value;
    // _item.pt_lot_ser = controls1.pt_lot_ser.value;
    // _item.pt_cyc_int = controls1.pt_cyc_int.value;
    _item.pt_site = controls1.pt_site.value;
    // _item.pt_shelflife = controls1.pt_shelflife.value;
    _item.pt_loc = controls1.pt_loc.value;
    // _item.pt_sngl_lot = controls1.pt_sngl_lot.value;
    // _item.pt_loc_type = controls1.pt_loc_type.value;
    // _item.pt_critical = controls1.pt_critical.value;
    // _item.pt_auto_lot = controls1.pt_auto_lot.value;
    // _item.pt_rctpo_status = controls1.pt_rctpo_status.value;
    // _item.pt_rctpo_active = controls1.pt_rctpo_active.value;
    // _item.pt_lot_grp = controls1.pt_lot_grp.value;
    // _item.pt_rctwo_status = controls1.pt_rctwo_status.value;
    // _item.pt_rctwo_active = controls1.pt_rctwo_active.value;
    _item.pt_article = controls1.pt_article.value;

    // _item.pt_ship_wt = controls2.pt_ship_wt.value;
    // _item.pt_ship_wt_um = controls2.pt_ship_wt_um.value;
    // _item.pt_net_wt = controls2.pt_net_wt.value;
    // _item.pt_net_wt_um = controls2.pt_net_wt_um.value;
    // _item.pt_fr_class = controls2.pt_fr_class.value;
    // _item.pt_size = controls2.pt_size.value;
    // _item.pt_size_um = controls2.pt_size_um.value;

    // _item.pt_ms = controls3.pt_ms.value;
    // _item.pt_buyer = controls3.pt_buyer.value;
    // _item.pt_phantom = controls3.pt_phantom.value;
    // _item.pt_plan_ord = controls3.pt_plan_ord.value;
    _item.pt_vend = controls1.pt_vend.value;

    // _item.pt_ord_min = controls3.pt_ord_min.value;
    // _item.pt_timefence = controls3.pt_timefence.value;
    // _item.pt_po_site = controls3.pt_po_site.value;
    // _item.pt_ord_max = controls3.pt_ord_max.value;
    // _item.pt_pm_code = controls3.pt_pm_code.value;
    // _item.pt_ord_mult = controls3.pt_ord_mult.value;
    // _item.pt_ord_pol = controls3.pt_ord_pol.value;
    // _item.pt_cfg_type = controls3.pt_cfg_type.value;
    // _item.pt_op_yield = controls3.pt_op_yield.value;
    // _item.pt_ord_qty = controls3.pt_ord_qty.value;
    // _item.pt_insp_rqd = controls3.pt_insp_rqd.value;
    // _item.pt_yield_pct = controls3.pt_yield_pct.value;
    // _item.pt_insp_lead = controls3.pt_insp_lead.value;
    // _item.pt_run = controls3.pt_run.value;
    // _item.pt_ord_per = controls3.pt_ord_per.value;
    // _item.pt_mfg_lead = controls3.pt_mfg_lead.value;
    // _item.pt_pur_lead = controls3.pt_pur_lead.value;
    // _item.pt_setup = controls3.pt_setup.value;
    // _item.pt_sfty_stk = controls3.pt_sfty_stk.value;
    // _item.pt_sfty_time = controls3.pt_sfty_time.value;
    // _item.pt_rop = controls3.pt_rop.value;
    // _item.pt_atp_family = controls3.pt_atp_family.value;
    // _item.pt_network = controls3.pt_network.value;
    // _item.pt_run_seq1 = controls3.pt_run_seq1.value;
    // _item.pt_routing = controls3.pt_routing.value;
    // _item.pt_iss_pol = controls3.pt_iss_pol.value;
    // _item.pt_run_seq2 = controls3.pt_run_seq2.value;
    // _item.pt_bom_code = controls3.pt_bom_code.value;

    _item.pt_price = controls1.pt_price.value;
    _item.pt_pur_price = controls1.pt_pur_price.value;
    _item.pt_taxable = controls1.pt_taxable.value;
    _item.pt_taxc = controls1.pt_taxc.value;
    _item.pt_sales_price = controls1.pt_sales_price.value;
    _item.pt_marge = controls1.pt_marge.value;
    
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
    _sct.sct_site = control1.pt_site.value;

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
    _sct.sct_site = control1.pt_site.value;
    return _sct;
  }

  /**
   * Go back to the list
   *
   */
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

  
 /* changePl() {
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
  }*/
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
            controls.pt_taxc.setValue(item.tx2_tax_code || "")
            this.tauxtaxe = item.tx2_tax_pct
           this.calculateprice()
          })
    }
}

calculateprice(){
  const controls = this.form1.controls
  if (controls.pt_taxable.value == true) {
    controls.pt_sales_price.setValue(Number(controls.pt_price.value) * (100 + Number(this.tauxtaxe)) / 100)
    }
    else {
      controls.pt_sales_price.setValue(Number(controls.pt_price.value) )
   

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
let prix =  Number(controls.pt_pur_price.value) * (100 + Number(controls.pt_marge.value)) / 100
  controls.pt_price.setValue(prix );
  if (controls.pt_taxable.value == true) {
    controls.pt_sales_price.setValue(Number(controls.pt_price.value) * (100 + Number(this.tauxtaxe)) / 100)
    }
    else {
      controls.pt_sales_price.setValue(Number(controls.pt_price.value) )
   

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
    case "pt_draw": {
      controls1.pt_draw.setValue(this.codevalue || "");
      break;
    }
    case "pt_dsgn_grp": {
      controls1.pt_dsgn_grp.setValue(this.codevalue || "");
      break;
    }
    case "pt_group": {
      controls1.pt_group.setValue(this.codevalue || "");
      break;
    }
    case "pt_rev": {
      controls1.pt_rev.setValue(this.codevalue || "");
      break;
    }

    case "pt_part_type": {
      controls1.pt_part_type.setValue(this.codevalue || "");
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
  .getBy({ code_fldname: "pt_part_type" })
  .subscribe((response: any) => (this.pt_part_type = response.data));
  this.codeService
  .getBy({ code_fldname: "pt_upc" })
  .subscribe((response: any) => (this.pt_upc = response.data));  
  
  this.codeService
  .getBy({ code_fldname: "pt_dsgn_grp" })
  .subscribe((response: any) => (this.pt_dsgn_grp = response.data));

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
  .getBy({ code_fldname: "pt_abc" })
  .subscribe((response: any) => (this.pt_abc = response.data));
this.codeService
  .getBy({ code_fldname: "pt_loc_type" })
  .subscribe((response: any) => (this.pt_loc_type = response.data));

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
        controls1.pt_vend.setValue(this.code)
    
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
newMnt(content) {
  
this.createMNTForm()
this.modalService.open(content, { size: "xl" });
}

  /**************************************************MNT********************************* */
}
