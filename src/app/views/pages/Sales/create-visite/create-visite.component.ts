import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  Filters,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { round } from 'lodash';

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
import { MatDialogRef } from '@angular/material/dialog';
import {
  SaleOrderService,
  QuoteService,
  SequenceService,
  CustomerService,
  UsersService,
  ItemService,
  SaleOrder,
  TaxeService,
  DeviseService,
  CodeService,
  SiteService,
  Address,
  AddressService,
  Customer,
  AccessoireService,
  LocationService,
  MesureService,
  PricelistService,
  DoctorService,
  printSO,
  Visite,
  GlassesService,
  VisiteService,
  PenicheService,
  ConfigService,
  PayMethService,
  LocationDetailService,
  LocationGlassesService,
  LocationAccessoireService,
} from "../../../../core/erp";
import { numberFilterCondition } from "angular-slickgrid/app/modules/angular-slickgrid/filter-conditions/numberFilterCondition";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import { CustomerCreateComponent } from '../../customers/customer-create/customer-create.component';
import { environment } from "../../../../../environments/environment"
import { HttpUtilsService } from "../../../../core/_base/crud"
import { HttpClient } from '@angular/common/http';
const API_URL = environment.apiUrl + "/codes"
  
@Component({
  selector: 'kt-create-visite',
  templateUrl: './create-visite.component.html',
  styleUrls: ['./create-visite.component.scss']
})


export class CreateVisiteComponent implements OnInit {

  saleOrder: SaleOrder;
  visite: Visite;
  soForm: FormGroup;
  glsForm: FormGroup;
  customerForm: FormGroup;
  addressForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors  = false;
  hasFormErrors2 = false;
  
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

  angularGridgls: AngularGridInstance;
  gridgls: any;
  gridServicegls: GridService;
  dataViewgls: any;
  columnDefinitionsgls: Column[];
  gridOptionsgls: GridOption;
  datasetgls: any[];

  angularGridacs: AngularGridInstance;
  gridacs: any;
  gridServiceacs: GridService;
  dataViewacs: any;
  columnDefinitionsacs: Column[];
  gridOptionsacs: GridOption;
  datasetacs: any[];
  gls_rev: any[] = [];
  address;
  customer;
  codecli;
  sequences: []
  columnDefinitions1: Column[] = []
  gridOptions1: GridOption = {}
  gridObj1: any
  angularGrid1: AngularGridInstance

  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  peniches: [];
  columnDefinitionsfob: Column[] = [];
  gridOptionsfob: GridOption = {};
  gridObjfob: any;
  angularGridfob: AngularGridInstance;


  users: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;

  quotes: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  accessoires: [];
  columnDefinitions9: Column[] = [];
  gridOptions9: GridOption = {};
  gridObj9: any;
  angularGrid9: AngularGridInstance;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;


  datatax: [];
  columnDefinitionstax: Column[] = [];
  gridOptionstax: GridOption = {};
  gridObjtax: any;
  angularGridtax: AngularGridInstance;

  glasses: [];
  columnDefinitions8: Column[] = [];
  gridOptions8: GridOption = {};
  gridObj8: any;
  dataView8: any;
  angularGrid8: AngularGridInstance;

  doctors: [];
  columnDefinitionspo: Column[] = [];
  gridOptionspo: GridOption = {};
  gridObjpo: any;
  angularGridpo: AngularGridInstance;

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
  seq;
  user;
  row_number;
  message = "";
  quoteServer;
  qoServer;
  oeil;
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

selectedField = ""
datacode: [];
columnDefinitionscr: Column[] = [];
gridOptionscr: GridOption = {};
gridObjcr: any;
angularGridcr: AngularGridInstance;

  datasetPrint = [];
  type: String;
  date: String;
  so_cr_terms: any[] = [];
  price: Number;
  disc: Number;
  taxable: Boolean;
  cfg : any;
  hascustomerFormErrors = false
    selectedTab = 0
  po
  oeils:any
  timb = false
  constructor(
    
    config: NgbDropdownConfig,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private soFB: FormBuilder,
    private glsFB: FormBuilder,
    private totFB: FormBuilder,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private quoteService: QuoteService,
    private penicheService: PenicheService,
    private customersService: CustomerService,
    private userService: UsersService,
    private sequencesService: SequenceService,
    private sequenceService: SequenceService,
    private saleOrderService: SaleOrderService,
    private addressService: AddressService,
    private glassesService: GlassesService,
    private itemsService: ItemService,
    private accessoiresService: AccessoireService,
    private locationDetailService: LocationDetailService,
    private locationGlassesService: LocationGlassesService,
    private locationAccessoireService: LocationAccessoireService,
    private codeService: CodeService,
    private mesureService: MesureService,
    private deviseService: DeviseService,
    private doctorService: DoctorService,
    private visiteService: VisiteService,
    private siteService: SiteService,
    private locationService: LocationService,
    private taxService: TaxeService,
    private pricelistService: PricelistService,
    private configService: ConfigService,
    private payMethService: PayMethService,
  ) {
    config.autoClose = true;
    this.codeService
      .getBy({ code_fldname: "alg_timbre" , code_value: "timbre"})
      .subscribe((response: any) => (this.timb = response.data[0].bool01));  
    this.codeService
      .getBy({ code_fldname: "gls_rev" })
      .subscribe((response: any) => (this.gls_rev = response.data));
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

    this.configService.getOne( 1 ).subscribe(
      (resp: any) => {
        console.log("hhhhhhhhhhhhhhhhh",  resp.data.cfg_pay_multiple)
        if (resp.data.cfg_pay_multiple != null) {
        this.cfg = resp.data.cfg_pay_multiple; } else { this.cfg = false }
      
      console.log("cfg", this.cfg)
    if(this.cfg) {
      
        this.payMethService
         .getAll()
         .subscribe((response: any) => { 
           
          var data = []
          for (let code of response.data){
              data.push({code_value:  code.ct_code, code_cmmt: code.ct_desc})
          }
          console.log(data)
          

          


          
          this.so_cr_terms = data});
      console.log(this.so_cr_terms)


    } else {
             this.codeService
              .getBy({ code_fldname: "cm_cr_terms" })
              .subscribe((response: any) => (this.so_cr_terms = response.data));
              console.log(this.so_cr_terms)
           }
    })
    this.reset();
    this.initGrid();
    this.initGridGls();
    this.initGridAcs();
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
        id: "sod_line",
        name: "Ligne",
        field: "sod_line",
        minWidth: 30,
        maxWidth: 30,
        selectable: true,
      },
      {
        id: "sod_part",
        name: "Monture",
        field: "sod_part",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.sod_part)
          const controls = this.soForm.controls 
          this.itemsService.getByOne({pt_part: args.dataContext.sod_part }).subscribe((resp:any)=>{

            if (resp.data) {
              console.log(resp.data)
                          
              if (resp.data.pt_phantom) {
                this.type = 'M'
              
              } else {
                this.type = null
              }            

              if (controls.so_taxable.value == false) {this.taxable = false} else { this.taxable = resp.data.pt_taxable}
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , sod_site:resp.data.pt_site, sod_loc: resp.data.pt_loc,
                sod_um:resp.data.pt_um, sod_um_conv:1, sod_price: resp.data.pt_price, sod_disc_pct:0, sod_type: this.type , sod_tax_code:resp.data.pt_taxc, sod_taxc: resp.data.taxe.tx2_tax_pct, sod_taxable: this.taxable})
               
               
                              
      
         }  else {
            alert("Article Nexiste pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_part: null })
         }
          
          });

           
         
         
        }
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
        id: "sod_desc",
        name: "Description",
        field: "sod_desc",
        sortable: true,
        width: 180,
        filterable: false,
      },
      {
        id: "sod_um",
        name: "UM",
        field: "sod_um",
        sortable: true,
        width: 30,
        filterable: false,
        editor: {
          model: Editors.text,
        },

      
      },
      {
        id: "sod_serial",
        name: "Lot",
        field: "sod_serial",
        sortable: true,
        width: 40,
        filterable: false,
      
      },
      {
        id: "sod_ref",
        name: "Ref",
        field: "sod_ref",
        sortable: true,
        width: 30,
        filterable: false,
      
      },
      {
        id: "sod_qty_ord",
        name: "QTE",
        field: "sod_qty_ord",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.soForm.controls
          console.log(args.dataContext.sod_part)
          console.log(controls.so_cust.value)
          let pricebefore = args.dataContext.sod_price
          
        //    this.dataset[this.row_number].sod_price = this.price
            //console.log(this.row_number,this.dataset[this.row_number].sod_price)
            this.calculatetot();
         
      }
      
      },
     /* {
        id: "sod_price",
        name: "Prix unitaire",
        field: "sod_price",
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

          console.log(args.dataContext.sod_price)
          this.calculatetot();
        }
      },*/
      {
        id: "sod_sales_price",
        name: "Prix TTC",
        field: "sod_sales_price",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
        // editor: {
        //   model: Editors.float,
        //   params: { decimalPlaces: 2 }
        // },
        formatter: Formatters.decimal,
        // onCellChange: (e: Event, args: OnEventArgs) => {

        //   console.log(args.dataContext.sod_price)
        //   this.calculatetot();
        // }
      },
      {
          id: "sod_disc_pct",
          name: "Remise",
          field: "sod_disc_pct",
          sortable: true,
          width: 50,
          filterable: false,
          //type: FieldType.float,
          editor: {
            model: Editors.float,
            params: { decimalPlaces: 2 }
          },
          formatter: Formatters.decimal,
          onCellChange: (e: Event, args: OnEventArgs) => {

            console.log(args.dataContext.sod_disc_pct)
            this.calculatetot();
          }   
      },
        
        
    
      // {
      //   id: "sod_type",
      //   name: "Type",
      //   field: "sod_type",
      //   sortable: true,
      //   width: 30,
      //   filterable: false,
      //   editor: {
      //     model: Editors.text,
      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {

      //     if (args.dataContext.sod_type != "M") {
      //       alert("Type doit etre M ou NULL")
      //       this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , sod_type: null});
            
      //     }
      //   }
      // },
      {
        id: "sod_taxable",
        name: "Taxable",
        field: "sod_taxable",
        sortable: true,
        width: 30,
        filterable: false,
        editor: {
          model: Editors.checkbox
        },
        formatter: Formatters.checkmark,
        cannotTriggerInsert: true,
      },
      {
        id: "sod_taxc",
        name: "taux de taxe",
        field: "sod_taxc",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        formatter: Formatters.percentComplete,
      
      onCellChange: (e: Event, args: OnEventArgs) => {

        this.calculatetot(); 
      }
    },
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
 
 /*********************grid glasses********************/
 gridReadygls(angularGrid: AngularGridInstance) {
  this.angularGridgls = angularGrid;
  this.dataViewgls = angularGrid.dataView;
  this.gridgls = angularGrid.slickGrid;
  this.gridServicegls = angularGrid.gridService;
}

initGridGls() {
  this.columnDefinitionsgls = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.angularGridgls.gridService.deleteItem(args.dataContext);
        }
      },
    },

    {
      id: "sodg_line",
      name: "Ligne",
      field: "sodg_line",
      minWidth: 30,
      maxWidth: 30,
      selectable: true,
    },
    {
      id: "sodg_contr_id",
      name: "Oeil",
      field: "sodg_contr_id",
      minWidth: 30,
      maxWidth: 30,
      selectable: true,
      editor: {
        // display checkmark icon when True
        //enableRenderHtml: true,
        collection: [ { value: 'OD' , label: 'OD', }, { value: 'OG', label: 'OG' }],
        model: Editors.singleSelect
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        const controls = this.soForm.controls
        console.log(args.dataContext.sodg_contr_id)
        if (args.dataContext.sodg_contr_id == 'OD'){

          this.oeil = "OD"
        //  if(Number(controls.vis_rcyl.value) <= 0) {
         //   this.gridServicegls.updateItemById(args.dataContext.id,{...args.dataContext , sodg_cyl: Number(controls.vis_rcyl.value),sodg_sph: Number(controls.vis_rsph.value), sodg_add: Number(controls.vis_radd.value) })
      /*
          } else {
            this.gridServicegls.updateItemById(args.dataContext.id,{...args.dataContext , sodg_cyl: - Number(controls.vis_rcyl.value),sodg_sph: Number(controls.vis_rsph.value) + Number(controls.vis_rcyl.value), sodg_add: Number(controls.vis_radd.value) })
      
          }
*/
        } else {
          this.oeil = "OG"
//          if(Number(controls.vis_lcyl.value) <= 0) {
          //  this.gridServicegls.updateItemById(args.dataContext.id,{...args.dataContext , sodg_cyl: Number(controls.vis_lcyl.value),sodg_sph: Number(controls.vis_lsph.value), sodg_add: Number(controls.vis_ladd.value) })
      
  //        } else {
    //        this.gridServicegls.updateItemById(args.dataContext.id,{...args.dataContext , sodg_cyl: - Number(controls.vis_lcyl.value),sodg_sph: Number(controls.vis_lsph.value) + Number(controls.vis_lcyl.value), sodg_add: Number(controls.vis_ladd.value) })
      
      //    }

        }
      }
    },
    {
      id: "sodg_part",
      name: "Verre",
      field: "sodg_part",
      sortable: true,
      width: 50,
      filterable: false,
      editor: {
        model: Editors.text,
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        console.log(args.dataContext.sodg_part)
        const controls = this.soForm.controls 
        this.glassesService.getByOne({gls_part: args.dataContext.sodg_part }).subscribe((resp:any)=>{

          if (resp.data) {
            console.log(resp.data)
                        
            if (resp.data.gls_phantom) {
              this.type = 'M'
            
            } else {
              this.type = null
            }            
                            
    
       }  else {
          alert("Article Nexiste pas")
          this.gridServicegls.updateItemById(args.dataContext.id,{...args.dataContext , sodg_part: null })
       }
        
        });

         
       
       
      }
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
          "openItemsGridgls"
        ) as HTMLElement;
        element.click();
      },
    },
    {
      id: "sodg_desc",
      name: "Description",
      field: "sodg_desc",
      sortable: true,
      width: 180,
      filterable: false,
    },
    {
      id: "sodg_um",
      name: "UM",
      field: "sodg_um",
      sortable: true,
      width: 30,
      filterable: false,
      editor: {
        model: Editors.text,
      },

    
    },/*
    {
      id: "sodg_sph",
      name: "Sphere",
      field: "sodg_sph",
      sortable: true,
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      filterable: false,
      type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
    },
    {
      id: "sodg_cyl",
      name: "Cylindre",
      field: "sodg_cyl",
      sortable: true,
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      filterable: false,
      type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
    },
    {
      id: "sodg_add",
      name: "Addition",
      field: "sodg_add",
      sortable: true,
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      filterable: false,
      type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
    },*/
    {
      id: "qtyoh",
      name: "QTE STK",
      field: "qtyoh",
      sortable: true,
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      filterable: false,
      type: FieldType.float,
    },
    {
      id: "sodg_qty_ord",
      name: "QTE",
      field: "sodg_qty_ord",
      sortable: true,
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      filterable: false,
      type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        const controls = this.soForm.controls
        console.log(args.dataContext.sodg_part)
        console.log(controls.so_cust.value)
        let pricebefore = args.dataContext.sodg_price
        
      //    this.dataset[this.row_number].sod_price = this.price
          //console.log(this.row_number,this.dataset[this.row_number].sod_price)
          this.calculatetot();
       
    }
    
    },
    {
      id: "sodg_price",
      name: "Prix unitaire",
      field: "sodg_price",
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

        console.log(args.dataContext.sod_price)
        this.calculatetot();
      }
    },
    {
      id: "sodg_sales_price",
      name: "Prix TTC",
      field: "sodg_sales_price",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      // editor: {
      //   model: Editors.float,
      //   params: { decimalPlaces: 2 }
      // },
      formatter: Formatters.decimal,
      // onCellChange: (e: Event, args: OnEventArgs) => {

      //   console.log(args.dataContext.sod_price)
      //   this.calculatetot();
      // }
    },
    {
        id: "sodg_xcomm_pct",
        name: "Assurence",
        field: "sodg_xcomm_pct",
        sortable: true,
        width: 50,
        filterable: false,
        //type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        formatter: Formatters.decimal,
        onCellChange: (e: Event, args: OnEventArgs) => {

          //console.log(args.dataContext.sod_disc_pct)
          this.calculatetot();
        }   
    },
      
      
  
    // {
    //   id: "sodg_type",
    //   name: "Type",
    //   field: "sodg_type",
    //   sortable: true,
    //   width: 30,
    //   filterable: false,
    //   editor: {
    //     model: Editors.text,
    //   },
    //   onCellChange: (e: Event, args: OnEventArgs) => {

    //     if (args.dataContext.sodg_type != "M") {
    //       alert("Type doit etre M ou NULL")
    //       this.gridServicegls.updateItemById(args.dataContext.id,{...args.dataContext  , sodg_type: null});
          
    //     }
    //   }
    // },
    {
      id: "sodg_taxable",
      name: "Taxable",
      field: "sodg_taxable",
      sortable: true,
      width: 30,
      filterable: false,
      editor: {
        model: Editors.checkbox
      },
      formatter: Formatters.checkmark,
      cannotTriggerInsert: true,
    },
    {
      id: "sodg_taxc",
      name: "taux de taxe",
      field: "sodg_taxc",
      sortable: true,
      width: 50,
      filterable: false,
      editor: {
        model: Editors.text,
      },
      formatter: Formatters.percentComplete,
    
    onCellChange: (e: Event, args: OnEventArgs) => {

      this.calculatetot(); 
    }
  },
  ];

  this.gridOptionsgls = {
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

  this.datasetgls = [];
}

 /*****************************************************/
 

 /***********************grid accessoire***********************/
 gridReadyacs(angularGrid: AngularGridInstance) {
  this.angularGridacs = angularGrid;
  this.dataViewacs = angularGrid.dataView;
  this.gridacs = angularGrid.slickGrid;
  this.gridServiceacs = angularGrid.gridService;
}

initGridAcs() {
  this.columnDefinitionsacs = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.angularGridacs.gridService.deleteItem(args.dataContext);
        }
      },
    },

    {
      id: "soda_line",
      name: "Ligne",
      field: "soda_line",
      minWidth: 30,
      maxWidth: 30,
      selectable: true,
    },
    {
      id: "soda_part",
      name: "Accessoire",
      field: "soda_part",
      sortable: true,
      width: 50,
      filterable: false,
      editor: {
        model: Editors.text,
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        console.log(args.dataContext.sod_part)
        const controls = this.soForm.controls 
        this.itemsService.getByOne({pt_part: args.dataContext.soda_part }).subscribe((resp:any)=>{

          if (resp.data) {
            console.log(resp.data)
                        
            if (resp.data.acs_phantom) {
              this.type = 'M'
            
            } else {
              this.type = null
            }            

            if (controls.so_taxable.value == false) {this.taxable = false} else { this.taxable = resp.data.acs_taxable}
            this.gridServiceacs.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.acs_desc1 , soda_site:resp.data.acs_site, soda_loc: resp.data.acs_loc,
              soda_um:resp.data.acs_um, soda_um_conv:1, soda_price: resp.data.acs_price, soda_disc_pct:0, soda_type: this.type , soda_tax_code:resp.data.acs_taxc, soda_taxc: resp.data.taxe.tx2_tax_pct, soda_taxable: this.taxable})
             
             
                            
    
       }  else {
          alert("Article Nexiste pas")
          this.gridServiceacs.updateItemById(args.dataContext.id,{...args.dataContext , soda_part: null })
       }
        
        });

         
       
       
      }
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
          "openItemsGridAcs"
        ) as HTMLElement;
        element.click();
      },
    },
    {
      id: "soda_desc",
      name: "Description",
      field: "soda_desc",
      sortable: true,
      width: 180,
      filterable: false,
    },
    {
      id: "soda_um",
      name: "UM",
      field: "soda_um",
      sortable: true,
      width: 30,
      filterable: false,
      editor: {
        model: Editors.text,
      },

    
    },
    
    {
      id: "soda_qty_ord",
      name: "QTE",
      field: "soda_qty_ord",
      sortable: true,
      width: 60,
      filterable: false,
      type: FieldType.float,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        const controls = this.soForm.controls
        console.log(args.dataContext.soda_part)
        console.log(controls.so_cust.value)
        let pricebefore = args.dataContext.soda_price
        
      //    this.dataset[this.row_number].sod_price = this.price
          //console.log(this.row_number,this.dataset[this.row_number].sod_price)
          this.calculatetot();
       
    }
    
    },
    /*{
      id: "soda_price",
      name: "Prix unitaire",
      field: "soda_price",
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

        console.log(args.dataContext.soda_price)
        this.calculatetot();
      }
    },*/
    {
      id: "soda_sales_price",
      name: "Prix TTC",
      field: "soda_sales_price",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      // editor: {
      //   model: Editors.float,
      //   params: { decimalPlaces: 2 }
      // },
      formatter: Formatters.decimal,
      // onCellChange: (e: Event, args: OnEventArgs) => {

      //   console.log(args.dataContext.soda_price)
      //   this.calculatetot();
      // }
    },
    {
        id: "soda_disc_pct",
        name: "Remise",
        field: "soda_disc_pct",
        sortable: true,
        width: 50,
        filterable: false,
        //type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        formatter: Formatters.decimal,
        onCellChange: (e: Event, args: OnEventArgs) => {

          console.log(args.dataContext.sod_disc_pct)
          this.calculatetot();
        }   
    },
      
      
  
    // {
    //   id: "soda_type",
    //   name: "Type",
    //   field: "soda_type",
    //   sortable: true,
    //   width: 30,
    //   filterable: false,
    //   editor: {
    //     model: Editors.text,
    //   },
    //   onCellChange: (e: Event, args: OnEventArgs) => {

    //     if (args.dataContext.soda_type != "M") {
    //       alert("Type doit etre M ou NULL")
    //       this.gridServiceacs.updateItemById(args.dataContext.id,{...args.dataContext  , soda_type: null});
          
    //     }
    //   }
    // },
    {
      id: "soda_taxable",
      name: "Taxable",
      field: "soda_taxable",
      sortable: true,
      width: 30,
      filterable: false,
      editor: {
        model: Editors.checkbox
      },
      formatter: Formatters.checkmark,
      cannotTriggerInsert: true,
    },
    {
      id: "soda_taxc",
      name: "taux de taxe",
      field: "soda_taxc",
      sortable: true,
      width: 50,
      filterable: false,
      editor: {
        model: Editors.text,
      },
      formatter: Formatters.percentComplete,
    
    onCellChange: (e: Event, args: OnEventArgs) => {

      this.calculatetot(); 
    }
  },
  ];

  this.gridOptionsacs = {
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

  this.datasetacs = [];
}

 /***********************grid accessoire***********************/
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    
    this.createForm();
    this.createtotForm();
    
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      if (id) {
        const controls = this.soForm.controls;

        this.quoteService.findByOne({ id }).subscribe(
          (res: any) => {
            console.log("aa", res.data);
            const { quote, details } = res.data;
            this.qoServer = quote;

            controls.so_cust.setValue(this.qoServer.qo_cust);
            controls.so_po.setValue(this.qoServer.qo_nbr);
            controls.so_curr.setValue(this.qoServer.qo_curr);
            this.customersService
                  .getBy({ cm_addr: this.qoServer.qo_cust })
                  .subscribe((res: any) => (this.customer = res.data));
            for (const object in details) {
              const detail = details[object];
              this.gridService.addItem(
                {
                  id: this.dataset.length + 1,
                  sod_line: this.dataset.length + 1,
                 
                  sod_part: detail.qod_part,
                  cmvid: "",
                  sod_desc: detail.item.pt_desc1,
                  sod_qty_ord: detail.qod_qty_ord,
                  sod_um: detail.qod_um,
                  sod_price: detail.qod_price,
                  sod_disc_pct: detail.qod_disc_pct,
                  sod_site: detail.item.pt_site,
                  sod_loc: detail.item.pt_loc,
                  sod_type: detail.item.pt_type,
                  sod_cc: "",
                  sod_taxable: detail.item.pt_taxable,
                  sod_taxc: detail.item.taxe.tx2_tax_pct,
                },
                { position: "bottom" }
              );
              this.datasetPrint.push({
                id: this.dataset.length + 1,
                sod_line: this.dataset.length + 1,
               
                sod_part: detail.qod_part,
                cmvid: "",
                sod_desc: detail.item.pt_desc1,
                sod_qty_ord: detail.qod_qty_ord,
                sod_um: detail.qod_um,
                sod_price: detail.qod_price,
                sod_disc_pct: detail.qod_disc_pct,
                sod_site: detail.item.pt_site,
                sod_loc: detail.item.pt_loc,
                sod_type: detail.item.pt_type,
                sod_cc: "",
                sod_taxable: detail.item.pt_taxable,
                sod_taxc: detail.item.taxe.tx2_tax_pct,
                taxe: detail.item.taxe.tx2_tax_pct,
              });
            }
          },
          (error) => {
            this.message = ` ce numero ${id} n'existe pas`;
            this.hasFormErrors = true;
          },
          () => {}
        );
      }
    });
  }

  createFormGls() {
    this.loadingSubject.next(false);
    this.glsForm = this.glsFB.group({
      sph: [0],
      cyl: [0],
      add: [0],
      rev: "M",
    })
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.saleOrder = new SaleOrder();
    this.visite = new Visite();
    const date = new Date;
    
    this.soForm = this.soFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      //so_category: [this.saleOrder.so_category , Validators.required],
      so_cust: [this.saleOrder.so_cust],
      so_fob: [this.saleOrder.so_fob],
      name: [{value:"", disabled: true}],
      prenom: [{value:"", disabled: true}],
      sexe: [{value:"", disabled: true}],
      assurence: [{value:"", disabled: true}],
      ssnum: [{value:"", disabled: true}],
      so_ord_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      /*so_due_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      */
      so_taxable: [this.saleOrder.so_taxable],
     
      so_po: [this.saleOrder.so_po],
      //so_rmks: [this.saleOrder.so_rmks],
      //so_curr: [this.saleOrder.so_curr],
      vis_rsph: [this.visite.vis_rsph],
      vis_rcyl: [this.visite.vis_rcyl],
      vis_radd: [this.visite.vis_radd],
      vis_rprisme: [this.visite.vis_rprisme],
      vis_rbase: [this.visite.vis_rbase],
      vis_recart: [this.visite.vis_recart],
      vis_rhauteur: [this.visite.vis_rhauteur],

      vis_raxe: [this.visite.vis_raxe],
      vis_lsph: [this.visite.vis_rsph],
      vis_lcyl: [this.visite.vis_rcyl],
      vis_ladd: [this.visite.vis_radd],
      vis_lprisme: [this.visite.vis_lprisme],
      vis_lbase: [this.visite.vis_lbase],
      vis_lecart: [this.visite.vis_lecart],
      vis_lhauteur: [this.visite.vis_lhauteur],
      vis_laxe: [this.visite.vis_laxe],
     // so_ex_rate: [this.saleOrder.so_ex_rate],
     // so_ex_rate2: [this.saleOrder.so_ex_rate2],
      so_cr_terms: [this.saleOrder.so_cr_terms],
      assuractiv:[false]
    });

   
    

  }
  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
   // const date = new Date;
    
    this.totForm = this.totFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tremb: [{value: 0.00 , disabled: true}],
      
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    
    });

    
    

  }
  
  //reste form
  reset() {
    this.saleOrder = new SaleOrder();
    this.createForm();
    this.createtotForm();
    this.dataset    = [];
    this.datasetgls = [];
    this.datasetacs = [];
    
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.soForm.controls;
   
    
    /** check form */
    if (this.soForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

         
    if (!this.dataset.length && !this.datasetgls.length && !this.datasetacs.length ) {
      this.message = "La liste des article ne peut pas etre vide";
      this.hasFormErrors = true;

      return;
    }
    if (this.dataset.length >= 1) {
      for (var i = 0; i < this.dataset.length; i++) {
        if (this.dataset[i].sod_part == "" || this.dataset[i].sod_part == null  ) {
          this.message = "L' article ne peut pas etre vide";
          this.hasFormErrors = true;
          return;
  
        }
      }
    }
    if (this.datasetacs.length >= 1) {
      for (var i = 0; i < this.datasetacs.length; i++) {
        if (this.datasetacs[i].soda_part == "" || this.datasetacs[i].soda_part == null  ) {
          this.message = "L' article ne peut pas etre vide";
          this.hasFormErrors = true;
          return;
  
        }
      }
    }
    if (this.datasetgls.length >= 1) {
      for (var i = 0; i < this.datasetgls.length; i++) {
        if (this.datasetgls[i].sodg_part == "" || this.datasetgls[i].sodg_part == null  ) {
          this.message = "L' article ne peut pas etre vide";
          this.hasFormErrors = true;
          return;
  
        }
      }
    }
    
    this.penicheService
    .getBy({pen_used: false})
    .subscribe((res:any)=>{
   //   const {data} = res
     // console.log(data)
      if (res.data.length == 0){
      this.message = "Veuillez liberer un peniche";
      this.hasFormErrors = true;
      return;
    }
 

  // tslint:disable-next-line:prefer-const

    let so = this.prepareSo();
    console.log(this.hasFormErrors)
    if (this.hasFormErrors == false ) {
    this.addSo(so, this.dataset, this.datasetgls, this.datasetacs); }
  })
  }

  /**
   *
   * Returns object for saving
   */
  prepareSo(): any {
    const controls = this.soForm.controls;
    const controls1 = this.totForm.controls;
    const _so = new SaleOrder();
    _so.so_category =  "SO"
    _so.so_cust = controls.so_cust.value;
    _so.so_fob = controls.so_fob.value;
    _so.so_ord_date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : null;
    _so.so_due_date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : null;
      if (controls.so_taxable.value == null || controls.so_taxable.value == "" ) { _so.so_taxable = false} else { _so.so_taxable = controls.so_taxable.value}

    
    _so.so_po = controls.so_po.value;
    
    //_so.so_rmks = controls.so_rmks.value;
    _so.so_curr = "DA";
    _so.so_ex_rate = Number(1);
    _so.so_ex_rate2 = Number(1);
    _so.so_cr_terms = controls.so_cr_terms.value;
   
    _so.so_amt = controls1.tht.value
  _so.so_tax_amt = controls1.tva.value
  _so.so_trl1_amt = controls1.timbre.value
  _so.so_trl2_amt = controls1.tremb.value
  _so.so__dec01 = controls1.ttc.value
  
   // if(Number(this.customer.cm_balance) + Number(controls1.ttc.value) > Number(this.customer.cm_cr_limit)) { _so.so_stat = "HD"}   
    return _so;
  
  }
  prepareVis(): any {
    const controls = this.soForm.controls;
    const controls1 = this.totForm.controls;
    const _vis = new Visite();
    _vis.vis_category =  "VI"
    _vis.vis_cust = controls.so_cust.value;
    _vis.vis_ord_date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : null;
    _vis.vis_due_date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : null;
     
    
    _vis.vis_po = controls.so_po.value;
    _vis.vis_rsph = controls.vis_rsph.value;
    _vis.vis_rcyl = controls.vis_rcyl.value;
    _vis.vis_radd = controls.vis_radd.value;
    _vis.vis_rprisme = controls.vis_rprisme.value;
    _vis.vis_rbase = controls.vis_rbase.value;
    _vis.vis_recart = controls.vis_recart.value;
    _vis.vis_rhauteur = controls.vis_rhauteur.value;
    _vis.vis_raxe = controls.vis_raxe.value;
    _vis.vis_lsph = controls.vis_lsph.value;
    _vis.vis_lcyl = controls.vis_lcyl.value;
    _vis.vis_ladd = controls.vis_ladd.value;
    
    _vis.vis_lprisme = controls.vis_lprisme.value;
    _vis.vis_lbase = controls.vis_lbase.value;
    _vis.vis_lecart = controls.vis_lecart.value;
    _vis.vis_lhauteur = controls.vis_lhauteur.value;
    _vis.vis_laxe = controls.vis_laxe.value;


   // _vis.vis_rmks = controls.so_rmks.value;
    _vis.vis_curr = "DA";
    _vis.vis_ex_rate = Number(1);
    _vis.vis_ex_rate2 = Number(1);
    //_vis.vis_cr_terms = "ES";
   
    _vis.vis_amt = controls1.tht.value
  _vis.vis_tax_amt = controls1.tva.value
  _vis.vis_trl1_amt = controls1.timbre.value
  _vis.vis_trl2_amt = controls1.tremb.value
    
   // if(Number(this.customer.cm_balance) + Number(controls1.ttc.value) > Number(this.customer.cm_cr_limit)) { _vis.vis_stat = "HD"}   
    return _vis;
  
  }
 
  /**
   * Add po
   *
   * @param _so: so
   */
  addSo(_so: any, detail: any, detailgls:any, detailacs: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    for (let data of detailgls) {
      delete data.id;
      delete data.cmvid;
     
    }
    for (let data of detailacs) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    let so = null;
    const controls = this.soForm.controls;

    this.saleOrderService
      .add({ saleOrder: _so, saleOrderDetail: detail,saleOrderGlasses: detailgls, saleOrderAccessoire: detailacs })
      .subscribe(
        (reponse: any) => (so = reponse.data),
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
          console.log(this.dataset);
          let vis = this.prepareVis();
    
          this.addVis(vis, so.so_nbr);
         // this.printpdf(so.so_nbr , so.so_fob) //printSO(this.customer, this.dataset, so);
         // this.printcustpdf(so.so_nbr , so.so_fob) //printSO(this.customer, this.dataset, so);
          this.reset();
          this.router.navigateByUrl("/Sales/create-visite");
          this.reset();
        }
      );
  }
  addVis(_vis: any, sonbr: any) {
    
    this.loadingSubject.next(true);
    let vis = null;
    const controls = this.soForm.controls;

    this.visiteService
      .add({ visite: _vis, soNbr: sonbr })
      .subscribe(
        (reponse: any) => (vis = reponse.data),
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
          console.log(this.dataset);
          let vis = this.prepareVis();
    
         
        }
      );
  }

  /*
  onChangeOC() {
    const controls = this.soForm.controls;
    const qo_nbr = controls.so_po.value;
   
    this.quoteService.findByOne({ qo_nbr: qo_nbr }).subscribe(
      (res: any) => {
        const { quoteOrder, details } = res.data;
        console.log(quoteOrder)
        controls.so_cust.setValue(quoteOrder.qo_cust)
        controls.so_curr.setValue(quoteOrder.qo_curr)
        controls.so_cr_terms.setValue(quoteOrder.qo_cr_terms)
        controls.so_taxable.setValue(quoteOrder.qo_taxable)
        this.customersService.getBy({ cm_addr: quoteOrder.qo_cust }).subscribe(
          (res: any) => {
            //console.log(res);
            const { data } = res;
            this.customer = res.data;

          })
                for (const object in details) {
                  const detail = details[object];
                  console.log(detail.item);
                  this.gridService.addItem(
                    {
                      id: this.dataset.length + 1,
                      sod_line: this.dataset.length + 1,
                      
                      sod_part: detail.qod_part,
                      cmvid: "",
                      desc: detail.item.pt_desc1,
                      sod_qty_ord: detail.qod_qty_ord,
                      sod_um: detail.qod_um,
                      sod_price: detail.qod_price,
                      sod_disc_pct: detail.qod_disc_pct,
                      sod_site: detail.item.pt_site,
                      sod_loc: detail.item.pt_loc,
                      sod_type: detail.item.pt_type,
                      sod_cc: "",
                      sod_taxable: detail.item.pt_taxable,
                      sod_tax_code: detail.item.pt_taxc,
                      sod_taxc: detail.item.taxe.tx2_tax_pct,
                    },
                    { position: "bottom" }
                  );
                  this.datasetPrint.push({
                    id: this.dataset.length + 1,
                    sod_line: this.dataset.length + 1,
                   
                    sod_part: detail.qod_part,
                    cmvid: "",
                    desc: detail.item.pt_desc1,
                    sod_qty_ord: detail.qod_qty_ord,
                    sod_um: detail.qod_um,
                    sod_price: detail.qod_price,
                    sod_disc_pct: detail.qod_disc_pct,
                    sod_site: detail.item.pt_site,
                    sod_loc: detail.item.pt_loc,
                    sod_type: detail.item.pt_type,
                    sod_cc: "",
                    sod_taxable: detail.item.pt_taxable,
                    sod_tax_code: detail.item.pt_taxc,
                    sod_taxc: detail.item.taxe.tx2_tax_pct,
                   // taxe: detail.item.taxe.tx2_tax_pct,
                  });
                }
              
             // }
          //);
      }),
      (error) => {
        this.message = `Demande avec ce numero ${qo_nbr} n'existe pas`;
        this.hasFormErrors = true;
      },
      () => {}        
}*/
  
changeTax(){
  const controls = this.soForm.controls // chof le champs hada wesh men form rah
  const tx2_tax_code  = controls.so_taxc.value
  this.taxService.getBy({tx2_tax_code}).subscribe((res:any)=>{
      const {data} = res
      console.log(res)
      if (!data){ this.layoutUtilsService.showActionNotification(
          "cette Taxe n'existe pas!",
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
        sod_line: this.dataset.length + 1,
 
        sod_part: "",
        cmvid: "",
        sod_desc: "",
        sod_qty_ord: 0,
        sod_um: "",
        sod_price: 0,
        sod_disc_pct: 0,
        sod_site: "",
        sod_loc: "",
        sod_type: "",
        sod_cc: "",
        sod_taxable: true,
        sod_tax_code:"",
        sod_taxc: "",
      },
      { position: "bottom" }
    );
  }
  addNewItemA() {
    this.gridServiceacs.addItem(
      {
        id: this.datasetacs.length + 1,
        soda_line: this.datasetacs.length + 1,
 
        soda_part: "",
        cmvid: "",
        soda_desc: "",
        soda_qty_ord: 0,
        soda_um: "",
        soda_price: 0,
        soda_sales_price:0,
        soda_disc_pct: 0,
        soda_site: "",
        soda_loc: "",
        soda_type: "",
        soda_cc: "",
        soda_taxable: true,
        soda_tax_code:"",
        soda_taxc: "",
      },
      { position: "bottom" }
    );
  }
  
  addNewItemG() {
    this.gridServicegls.addItem(
      {
        id: this.datasetgls.length + 1,
        sodg_line: this.datasetgls.length + 1,
 
        sodg_part: "",
        cmvid: "",
        sodg_desc: "",
        sodg_qty_ord: 0,
        sodg_um: "",
        sodg_price: 0,
        sodg_xcomm_pct: 0,
        sodg_site: "",
        sodg_loc: "",
        sodg_type: "",
        sodg_cc: "",
        sodg_taxable: true,
        sodg_tax_code:"",
        sodg_taxc: "",
      },
      { position: "bottom" }
    );
  }
  handleSelectedRowsChanged2(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        console.log(item)
        const date = new Date()

        this.date = controls.so_ord_date.value
        ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
        : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  

        this.customer = item;
        controls.so_cust.setValue(item.cm_addr || "");
        controls.name.setValue(item.address.ad_name)
        controls.prenom.setValue(item.address.ad_name_control)
        
        controls.sexe.setValue(item.cm_type || "");
        controls.assurence.setValue(item.cm_region || "");
        controls.ssnum.setValue(item.cm_sic || "");
        //controls.so_curr.setValue(item.cm_curr || "");
        controls.so_cr_terms.setValue(item.cm_cr_terms || "");

        controls.so_taxable.setValue(item.address.ad_taxable || "");
        console.log(item)

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
        id: "cm_addr",
        name: "code",
        field: "cm_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Nom",
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name_control",
        name: "Prénom",
        field: "address.ad_name_control",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
      {
        id: "cm_mod_date",
        name: "Date Naissance",
        field: "cm_mod_date",
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
    this.customersService
      .getByAll({ cm_hold: false })
      .subscribe((response: any) => (this.customers = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChanged3(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        console.log(item);
        controls.so_buyer.setValue(item.usrd_code || "");
        
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
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "usrd_code",
        name: "code user",
        field: "usrd_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "usrd_name",
        name: "nom",
        field: "usrd_name",
        sortable: true,
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
    this.userService
      .getAllUsers()
      .subscribe((response: any) => (this.users = response.data));
  }
  open3(content) {
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }



  handleSelectedRowsChangedfob(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObjfob) {
      args.rows.map((idx) => {
        const item = this.gridObjfob.getDataItem(idx);
        console.log(item);
        controls.so_fob.setValue(item.pen_pen || "");
        
      });
    }
  }

  angularGridReadyfob(angularGrid: AngularGridInstance) {
    this.angularGridfob = angularGrid;
    this.gridObjfob = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridfob() {
    this.columnDefinitionsfob = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "pen_pen",
        name: "Peniche",
        field: "pen_pen",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pen_desc",
        name: "Designation",
        field: "pen_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsfob = {
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
    this.penicheService
      .getBy({pen_used: false})
      .subscribe((response: any) => (this.peniches = response.data));
  }
  openfob(content) {
    this.prepareGridfob();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    const controls = this.soForm.controls;
    
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {

        
        const item = this.gridObj4.getDataItem(idx);
        console.log("hhhhhere",item);
        if (item.item.pt_phantom) {
          this.type = 'M'
         
        } else {
          this.type = null
        }         
        this.itemsService.getByOne({pt_part:item.ld_part }).subscribe((resp:any)=>{
          console.log(resp.data)
        updateItem.sod_part = item.ld_part;
        updateItem.sod_desc = item.item.pt_desc1;
        updateItem.sod_um = item.item.pt_um;
        updateItem.sod_um_conv = 1;
        updateItem.sod_qty_ord = 1;
        updateItem.sod_site = item.ld_site;
        updateItem.sod_loc = item.ld_loc
        updateItem.sod_serial = item.ld_lot
        updateItem.sod_ref = item.ld_ref
        updateItem.sod_expire = item.ld_expire
        
        updateItem.sod_taxable = item.item.pt_taxable
        updateItem.sod_tax_code = item.item.pt_taxc
        updateItem.sod_taxc = resp.data.taxe.tx2_tax_pct
        updateItem.sod_type = this.type
        updateItem.qty_oh = item.ld_qty_oh
        updateItem.sod_price = item.item.pt_price
        updateItem.sod_sales_price = item.item.pt_sales_price
        updateItem.sod_disc_pct = 0
        this.calculatetot();
        this.gridService.updateItem(updateItem);
        })
      }) 
      
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
        id: "ld_part",
        name: "code ",
        field: "ld_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "item.pt_desc1",
        name: "desc",
        field: "item.pt_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "item.pt_um",
        name: "UM",
        field: "item.pt_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_lot",
        name: "Lot/Serie ",
        field: "ld_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_Ref",
        name: "Ref ",
        field: "ld_ref",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ld_expire",
        name: "EXP ",
        field: "ld_expire",
        sortable: true,
        filterable: true,
        type: FieldType.dateIso,
      },
      
      {
        id: "ld_qty_oh",
        name: "QTE",
        field: "ld_qty_oh",
        sortable: true,
        filterable: true,
        type: FieldType.float,
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
    this.locationDetailService
      .getAll()
      .subscribe((response: any) => (this.items = response.data )
      
      
      );
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.soForm.controls;

    const qo_nbr = controls.so_po.value;
    const qo_cust = controls.so_cust.value;

    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.so_po.setValue(item.qo_nbr || "");
        controls.so_cust.setValue(item.qo_cust)
        controls.so_curr.setValue(item.qo_curr)
        //controls.so_cr_terms.setValue(item.qo_cr_terms)
        controls.so_taxable.setValue(item.qo_taxable)
    

        this.quoteService.findByOne({ qo_nbr: item.qo_nbr }).subscribe(
          (res: any) => {
            const { quoteOrder, details } = res.data;
            console.log(details)

            

            this.customersService.getBy({ cm_addr: item.qo_cust }).subscribe(
              (res: any) => {
                //console.log(res);
                ;
                this.customer = res.data;
  
              })
            
                    for (const object in details) {
                      const detail = details[object];
                      console.log(detail.item);
                      this.gridService.addItem(
                        {
                          id: this.dataset.length + 1,
                          sod_line: this.dataset.length + 1,
                          
                          sod_part: detail.qod_part,
                          cmvid: "",
                          sod_desc: detail.item.pt_desc1,
                          sod_qty_ord: detail.qod_qty_ord,
                          sod_um: detail.qod_um,
                          sod_price: detail.qod_price,
                          sod_disc_pct: detail.qod_disc_pct,
                          sod_site: detail.item.pt_site,
                          sod_loc: detail.item.pt_loc,
                          sod_type: detail.item.pt_type,
                          sod_cc: "",
                          sod_taxable: detail.item.pt_taxable,
                          sod_tax_code: detail.item.pt_taxc,
                          sod_taxc: detail.item.taxe.tx2_tax_pct,
                        },
                        { position: "bottom" }
                      );
                      this.datasetPrint.push({
                        id: this.dataset.length + 1,
                        sod_line: this.dataset.length + 1,
                       
                        sod_part: detail.qod_part,
                        cmvid: "",
                        sod_desc: detail.item.pt_desc1,
                        sod_qty_ord: detail.qod_qty_ord,
                        sod_um: detail.qod_um,
                        sod_price: detail.qod_price,
                        sod_disc_pct: detail.qod_disc_pct,
                        sod_site: detail.item.pt_site,
                        sod_loc: detail.item.pt_loc,
                        sod_type: detail.item.pt_type,
                        sod_cc: "",
                        sod_taxable: detail.item.pt_taxable,
                        sod_tax_code: detail.item.pt_taxc,
                        sod_taxc: detail.item.taxe.tx2_tax_pct,
                        
                      });
                    }
                  
                 // }
              //);
          },
          (error) => {
            this.message = `Demande avec ce numero ${qo_nbr} n'existe pas`;
            this.hasFormErrors = true;
          },
          () => {}
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
        id: "qo_nbr",
        name: "N° Offre",
        field: "qo_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "qo_ord_date",
        name: "Date",
        field: "qo_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "qo_cust",
        name: "Client",
        field: "qo_cust",
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
    };

    // fill the dataset with your data
    this.quoteService
      .getAll()
      .subscribe((response: any) => (this.quotes = response.data));
  }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedtax(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObjtax) {
      args.rows.map((idx) => {
        const item = this.gridObjtax.getDataItem(idx);
        controls.so_taxc.setValue(item.tx2_tax_code || "");
      });
    }
  }

  angularGridReadytax(angularGrid: AngularGridInstance) {
    this.angularGridtax = angularGrid;
    this.gridObjtax = (angularGrid && angularGrid.slickGrid) || {};
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
    ];

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
    };

    // fill the dataset with your data
    this.taxService
      .getAll()
      .subscribe((response: any) => (this.datatax = response.data));
  }
  opentax(contenttax) {
    this.prepareGridtax();
    this.modalService.open(contenttax, { size: "lg" });
  }


  handleSelectedRowsChangedpo(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObjpo) {
      args.rows.map((idx) => {
        const item = this.gridObjpo.getDataItem(idx);
        this.po = item
        controls.so_po.setValue(item.dr_addr || "");
        
      });
    }
  }

  angularGridReadypo(angularGrid: AngularGridInstance) {
    this.angularGridpo = angularGrid;
    this.gridObjpo = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridpo() {
    this.columnDefinitionspo = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "dr_addr",
        name: "code",
        field: "dr_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "dr_desc",
        name: "Nom",
        field: "dr_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "dr_active",
        name: "Actif",
        field: "dr_active",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
      },
    ];

    this.gridOptionspo = {
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
    this.doctorService
      .getAll()
      .subscribe((response: any) => (this.doctors = response.data));
  }
  openpo(content) {
    this.prepareGridpo();
    this.modalService.open(content, { size: "lg" });
  }




  handleSelectedRowsChangedum(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjum) {
      args.rows.map((idx) => {
        const item = this.gridObjum.getDataItem(idx);
        updateItem.sod_um = item.code_value;
     
        this.gridService.updateItem(updateItem);

/*********/
console.log(updateItem.sod_part)

      this.itemsService.getBy({pt_part: updateItem.sod_part }).subscribe((resp:any)=>{
                      
        if   (updateItem.sod_um == resp.data.pt_um )  {
          
          updateItem.sod_um_conv = 1
        } else { 
          //console.log(resp.data.pt_um)



            this.mesureService.getBy({um_um: updateItem.sod_um, um_alt_um: resp.data.pt_um, um_part: updateItem.sod_part  }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;

          if (data) {
            //alert ("Mouvement Interdit Pour ce Status")
            updateItem.sod_um_conv = res.data.um_conv 
            this.angularGrid.gridService.highlightRow(1, 1500);
          } else {
            this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.sod_um, um_part: updateItem.sod_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                updateItem.sod_um_conv = res.data.um_conv
                
              } else {
                updateItem.sod_um_conv = 1
                updateItem.sod_um = null
        
                alert("UM conversion manquante")
                
              }  
            })

          }
            })

          }
          })



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
handleSelectedRowsChangedsite(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjsite) {
    args.rows.map((idx) => {
      const item = this.gridObjsite.getDataItem(idx);
      console.log(item);

          
      updateItem.sod_site = item.si_site;
      
      this.gridService.updateItem(updateItem);
   
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
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjloc) {
    args.rows.map((idx) => {
      const item = this.gridObjloc.getDataItem(idx);
          
      updateItem.sod_loc = item.loc_loc;
      
      this.gridService.updateItem(updateItem);
   
});

  }
}
angularGridReadyloc(angularGrid: AngularGridInstance) {
  this.angularGridloc = angularGrid;
  this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridloc() {
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
    .getBy({ loc_site:  updateItem.sod_site })
    .subscribe((response: any) => (this.dataloc = response.data));
}
openloc(contentloc) {
  this.prepareGridloc();
  this.modalService.open(contentloc, { size: "lg" });
}

onChangeTAX() {
const controls = this.soForm.controls;
const tax = controls.so_taxable.value;

  for (var i = 0; i < this.dataset.length; i++) {
    let updateItem = this.gridService.getDataItemByRowIndex(i);
  //  console.log(this.dataset[i].qty_oh)
        updateItem.sod_taxable = tax ;
    
        this.gridService.updateItem(updateItem);
     
  };
  for (var i = 0; i < this.datasetgls.length; i++) {
    let updateItem = this.gridServicegls.getDataItemByRowIndex(i);
  //  console.log(this.dataset[i].qty_oh)
        updateItem.sodg_taxable = tax ;
    
        this.gridServicegls.updateItem(updateItem);
     
  };
  for (var i = 0; i < this.datasetacs.length; i++) {
    let updateItem = this.gridServiceacs.getDataItemByRowIndex(i);
  //  console.log(this.dataset[i].qty_oh)
        updateItem.sod_taxable = tax ;
    
        this.gridServiceacs.updateItem(updateItem);
     
  };

this.calculatetot();
}

calculatetot(){
         const controls = this.totForm.controls 
          const controlsso = this.soForm.controls 
          let tht = 0
          let tva = 0
          let timbre = 0
          let ttc = 0
          for (var i = 0; i < this.dataset.length; i++) {
            console.log("here here " ,this.dataset[i]  )
            tht += round((this.dataset[i].sod_price * ((100 - this.dataset[i].sod_disc_pct) / 100 ) *  this.dataset[i].sod_qty_ord),2)
            if(controlsso.so_taxable.value == true) tva += round((this.dataset[i].sod_price * ((100 - this.dataset[i].sod_disc_pct) / 100 ) *  this.dataset[i].sod_qty_ord) * (this.dataset[i].sod_taxc ? this.dataset[i].sod_taxc / 100 : 0),2)
           
         
            
       
            
          //  if(controlsso.so_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
            //  if (timbre > 10000) { timbre = 10000} } 
         
         }
         let thtg = 0
         let tvag = 0
         let timbreg = 0
         let ttcg = 0
         let tassur = 0
         for (var i = 0; i < this.datasetgls.length; i++) {
           console.log("here here " ,this.datasetgls[i].sodg_price,this.datasetgls[i].sodg_qty_ord, this.datasetgls[i].sodg_disc_pct  )
           thtg += round((Number(this.datasetgls[i].sodg_price) * ((100 - Number(this.datasetgls[i].sodg_disc_pct)) / 100 ) *  Number(this.datasetgls[i].sodg_qty_ord)) - Number(),2)
           if(controlsso.so_taxable.value == true) tvag += round((this.datasetgls[i].sodg_price * ((100 - this.datasetgls[i].sodg_disc_pct) / 100 ) *  this.datasetgls[i].sodg_qty_ord) * (this.datasetgls[i].sodg_taxc ? this.datasetgls[i].sodg_taxc / 100 : 0),2)
          
        console.log(thtg)
           
      if (controlsso.assuractiv.value == true){
          tassur += round(Number(this.datasetgls[i].sodg_xcomm_pct),2) 
              }
                      //  if(controlsso.so_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
           //  if (timbre > 10000) { timbre = 10000} } 
        
        }
        let thta = 0
        let tvaa = 0
        //let timbreg = 0
        let ttca = 0
        for (var i = 0; i < this.datasetacs.length; i++) {
         // console.log("here here " ,this.datasetacs[i].sodg_price,this.datasetgls[i].sodg_qty_ord, this.datasetgls[i].sodg_disc_pct  )
          thta += round((Number(this.datasetacs[i].soda_price) * ((100 - Number(this.datasetacs[i].soda_disc_pct)) / 100 ) *  Number(this.datasetacs[i].soda_qty_ord)),2)
          if(controlsso.so_taxable.value == true) tvaa += round((this.datasetacs[i].soda_price * ((100 - this.datasetacs[i].soda_disc_pct) / 100 ) *  this.datasetacs[i].soda_qty_ord) * (this.datasetacs[i].soda_taxc ? this.datasetacs[i].soda_taxc / 100 : 0),2)
         
          
     
          
        //  if(controlsso.so_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
          //  if (timbre > 10000) { timbre = 10000} } 
       
       }
        console.log(thtg)
        console.log(tht)
        
        tht = tht + thtg + thta
        tva = tva + tvag + tvaa
        if(this.timb) {
        if(controlsso.so_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
        if (timbre > 10000) { timbre = 10000} } 
        }
       ttc = round(tht +  tva + timbre ,2)
      //  ttc = round(tht + tva ,2)
      
      controls.tht.setValue(tht.toFixed(2));
      controls.tremb.setValue(tassur.toFixed(2));
      
      controls.tva.setValue(tva.toFixed(2));
      controls.timbre.setValue(timbre.toFixed(2));
      controls.ttc.setValue(ttc.toFixed(2));
      
}



printpdf(nbr,pen) {
const controls = this.totForm.controls 
const controlss = this.soForm.controls 
console.log("pdf")
var doc = new jsPDF({format: [148, 210]});

// doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
var img = new Image()
//img.src = "./assets/media/logos/company.png";
//doc.addImage(img, 'png', 5, 5, 210, 30)
doc.setFont('bold')
doc.setFontSize(10);

doc.text( 'Commande N° : ' + nbr  , 50, 35);

doc.setFont('normal')
doc.setFontSize(8);
doc.text( 'peniche N° : ' + pen  , 10, 40);
//console.log(this.customer.address.ad_misc2_id)
doc.text('Code Client : ' + this.customer.cm_addr, 10 , 45 )
doc.text('Nom             : ' + this.customer.address.ad_name + " " + this.customer.address.ad_name_control, 10 , 50)
doc.text('Adresse       : ' + this.customer.address.ad_line1, 10 , 55)
doc.text('Tel             : ' + this.customer.address.ad_phone, 10 , 60)
/*
if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
    if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
    if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
    if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
  */
    doc.setFont('bold')
    doc.setFontSize(10);
    
doc.text('Monture', 11 , 67);
doc.setFont('normal')
doc.setFontSize(8);
doc.line(10, 70, 145, 70);
doc.line(10, 75, 145, 75);
doc.line(10, 70, 10, 75);
doc.text('LN', 11 , 72.5);
doc.line(15, 70, 15, 75);
doc.text('Code Article', 20 , 72.5);
doc.line(40, 70, 40, 75);
doc.text('Désignation', 65 , 72.5);
doc.line(95, 70, 95, 75);
doc.text('QTE', 102 , 72.5);
doc.line(115, 70, 115, 75);
doc.text('UM', 120 , 72.5);
doc.line(125, 70, 125, 75);
doc.text('PU', 136 , 72.5);
doc.line(145, 70, 145, 75);
//doc.text('TVA', 152 , 88.5);
//doc.line(160, 85, 160, 90);
//doc.text('REM', 162 , 88.5);
//doc.line(170, 85, 170, 90);
//doc.text('THT', 181 , 88.5);
//doc.line(200, 85, 200, 90);
var i = 80;
doc.setFontSize(6);
for (let j = 0; j < this.dataset.length  ; j++) {
  
  if ((j % 30 == 0) && (j != 0) ) {
doc.addPage();
  //  doc.addImage(img, 'png', 5, 5, 210, 30)
  doc.setFontSize(10);
  doc.text( 'Commande N° : ' + nbr  , 50, 40);
  doc.setFontSize(8);
  console.log(this.customer.address.ad_misc2_id)
  doc.text('Code Client : ' + this.customer.cm_addr, 10 , 50 )
  doc.text('Nom             : ' + this.customer.address.ad_name, 10 , 55)
  doc.text('Adresse       : ' + this.customer.address.ad_line1, 10 , 60)
  doc.text('Tel             : ' + this.customer.address.ad_phone, 10 , 65)
  
//    if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
  //  if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
   // if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
    //if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
  
    doc.line(10, 70, 145, 70);
    doc.line(10, 75, 145, 75);
    doc.line(10, 70, 10, 75);
    doc.text('LN', 11 , 73.5);
    doc.line(15, 70, 15, 75);
    doc.text('Code Article', 20 , 73.5);
    doc.line(40, 70, 40, 75);
    doc.text('Désignation', 65 , 73.5);
    doc.line(95, 70, 95, 75);
    doc.text('QTE', 102 , 73.5);
    doc.line(115, 70, 115, 75);
    doc.text('UM', 120 , 73.5);
    doc.line(125, 70, 125, 75);
    doc.text('PU', 136 , 73.5);
    doc.line(145, 70, 145, 75);
            //doc.text('TVA', 152 , 88.5);
    //doc.line(160, 85, 160, 90);
    //doc.text('REM', 162 , 88.5);
    //doc.line(170, 85, 170, 90);
    //doc.text('THT', 181 , 88.5);
    //doc.line(200, 85, 200, 90);
    i = 80;
    doc.setFontSize(6);

  }



  if (this.dataset[j].desc.length > 35) {
    let desc1 = this.dataset[j].desc.substring(35)
    let ind = desc1.indexOf(' ')
    desc1 = this.dataset[j].desc.substring(0, 35  + ind)
    let desc2 = this.dataset[j].desc.substring(35+ind)

    doc.line(10, i - 5, 10, i );
    doc.text(String(("000"+ this.dataset[j].sod_line)).slice(-2), 10.5 , i - 2);
    doc.line(15, i - 5, 15, i);
    doc.text(this.dataset[j].sod_part, 20 , i - 2);
    doc.line(40, i - 5 , 40, i );
    doc.text(desc1, 42 , i - 2);
    doc.line(95, i - 5, 95, i );
    doc.text( String(this.dataset[j].sod_qty_ord.toFixed(2)), 113 , i - 2 , { align: 'right' });
    doc.line(115, i - 5 , 115, i );
    doc.text(this.dataset[j].sod_um, 120 , i - 2);
    doc.line(125, i - 5, 125, i );
    doc.text( String(Number(this.dataset[j].sod_price * this.dataset[j].sod_qty_ord * (1 + this.dataset[j].sod_taxc / 100) ).toFixed(2)  ), 143 , i - 2 , { align: 'right' });
    doc.line(145, i - 5, 145, i );
    //doc.text(String(this.dataset[j].sod_taxc) + "%" , 153 , i - 2);
    //doc.line(160, i - 5 , 160, i );
    //doc.text(String(this.dataset[j].sod_disc_pct) + "%" , 163 , i - 2);
    //doc.line(170, i - 5 , 170, i );
    //doc.text(String((this.dataset[j].sod_price *
    //        ((100 - this.dataset[j].sod_disc_pct) / 100) *
    //        this.dataset[j].sod_qty_ord).toFixed(2)), 198 , i - 2,{ align: 'right' });
    //doc.line(200, i-5 , 200, i );
    doc.line(10, i, 150, i );

    i = i + 5;

    doc.text(desc2, 47 , i - 2);
    
    doc.line(10, i - 5, 10, i );
    doc.line(15, i - 5, 15, i);
    doc.line(40, i - 5 , 40, i );
    doc.line(95, i - 5, 95, i );
    doc.line(115, i - 5 , 115, i );
    doc.line(125, i - 5, 125, i );
    doc.line(145, i - 5, 145, i );
    //doc.line(160, i - 5 , 160, i );
    //doc.line(170, i - 5 , 170, i );
    //doc.line(200, i-5 , 200, i );
    //doc.line(10, i, 200, i );

    i = i + 5 ;
    
  } else {


  
  doc.line(10, i - 5, 10, i );
  doc.text(String(("000"+ this.dataset[j].sod_line)).slice(-3), 10.5 , i - 2);
  doc.line(15, i - 5, 15, i);
  doc.text(this.dataset[j].sod_part, 20 , i - 2);
  doc.line(40, i - 5 , 40, i );
  doc.text(this.dataset[j].desc, 42 , i - 2);
  doc.line(95, i - 5, 95, i );
  doc.text( String(this.dataset[j].sod_qty_ord.toFixed(2)), 113 , i - 2 , { align: 'right' });
  doc.line(115, i - 5 , 115, i );
  doc.text(this.dataset[j].sod_um, 120 , i - 2);
  doc.line(125, i - 5, 125, i );
  doc.text( String(Number((this.dataset[j].sod_price * ((100 - this.dataset[j].sod_disc_pct) / 100)) * this.dataset[j].sod_qty_ord * (1 + this.dataset[j].sod_taxc / 100) ).toFixed(2)  ), 143 , i - 2 , { align: 'right' });
  doc.line(145, i - 5, 145, i );
  //doc.text(String(this.dataset[j].sod_taxc) + "%" , 153 , i - 2);
  //doc.line(160, i - 5 , 160, i );
  //doc.text(String(this.dataset[j].sod_disc_pct) + "%" , 163 , i - 2);
  //doc.line(170, i - 5 , 170, i );
  //doc.text(String((this.dataset[j].sod_price *
   // ((100 - this.dataset[j].sod_disc_pct) / 100) *
   // this.dataset[j].sod_qty_ord).toFixed(2)), 198 , i - 2,{ align: 'right' });
  //doc.line(200, i-5 , 200, i );
  doc.line(10, i, 145, i );
  i = i + 5;
  }
}



/**********************Verre***************** */
i = i + 10;
doc.setFont('bold')
doc.setFontSize(10);

doc.text('Verre / Lentille ', 11 , i - 8);


doc.setFont('normal')
doc.setFontSize(8);
doc.line(10, i, 145, i);
doc.line(10, i-5, 145, i-5);
doc.line(10, i-5, 10, i);
doc.text('Oeil', 11 , i - 2.5);
doc.line(20, i-5, 20, i);
doc.text('Sph', 22 , i - 2.5);
doc.line(30, i-5, 30, i);
doc.text('Cyl', 32 , i - 2.5);
doc.line(40, i-5, 40, i);
doc.text('Add', 42 , i - 2.5);
doc.line(50, i-5, 50, i);
doc.text('AXE', 52 , i - 2.5);
doc.line(60, i-5, 60, i);
doc.text('Base', 62 , i - 2.5);
doc.line(70, i-5, 70, i);
doc.text('Prisme', 72 , i - 2.5);
doc.line(80, i-5, 80, i);
doc.text('Ecart', 82 , i - 2.5);
doc.line(90, i-5, 90, i);
doc.text('Hteur', 92 , i - 2.5);
doc.line(100, i-5, 100, i);

doc.text('Designation', 108 , i - 2.5);
doc.line(130, i-5, 130, i);
doc.text('PU', 135 , i - 2.5);
doc.line(145, i-5, 145, i);

i = i + 5
doc.setFont('normal')
doc.setFontSize(8);
for (let j = 0; j < this.datasetgls.length  ; j++) {
  doc.line(10, i - 5, 145, i - 5);
  doc.line(10, i, 145, i );
  
  doc.line(10, i - 5, 10, i );
  //var oeil = "";
  //if(this.datasetgls[j].sodg_contr_id == 0){ oeil = "OD"} else { oeil = "OG"}
  doc.text( this.datasetgls[j].sodg_contr_id, 10.5 , i - 2);
  doc.line(20, i - 5, 20, i);
  if(this.datasetgls[j].sodg_contr_id == "OD") {
  doc.text(String(Number(controlss.vis_rsph.value)), 22 , i - 2);
  } else {
    doc.text(String(Number(controlss.vis_lsph.value)), 22 , i - 2);
 
  }
  doc.line(30, i - 5 , 30, i );
  if(this.datasetgls[j].sodg_contr_id == "OD") {
    doc.text(String(Number(controlss.vis_rcyl.value)), 32 , i - 2);
    } else {
      doc.text(String(Number(controlss.vis_lcyl.value)), 32 , i - 2);
   
    }
  //doc.text(this.datasetgls[j].desc, 42 , i - 2);
  doc.line(40, i - 5, 40, i );
  if(this.datasetgls[j].sodg_contr_id == "OD") {
    doc.text(String(Number(controlss.vis_radd.value)), 42 , i - 2);
    } else {
      doc.text(String(Number(controlss.vis_ladd.value)), 42 , i - 2);
   
    }
  //doc.text( String(this.datasetgls[j].sodg_qty_ord.toFixed(2)), 113 , i - 2 , { align: 'right' });
  doc.line(50, i - 5 , 50, i );
  if(this.datasetgls[j].sodg_contr_id == "OD") {
    doc.text(String(Number(controlss.vis_raxe.value)), 52 , i - 2);
    } else {
      doc.text(String(Number(controlss.vis_laxe.value)), 52 , i - 2);
   
    }
  doc.line(60, i - 5, 60, i );
  if(this.datasetgls[j].sodg_contr_id == "OD") {
    doc.text(String(Number(controlss.vis_rbase.value)), 62 , i - 2);
    } else {
      doc.text(String(Number(controlss.vis_lbase.value)), 62 , i - 2);
   
    }
  doc.line(70, i - 5, 70, i );
  if(this.datasetgls[j].sodg_contr_id == "OD") {
    doc.text(String(Number(controlss.vis_rprisme.value)), 72 , i - 2);
    } else {
      doc.text(String(Number(controlss.vis_lprisme.value)), 72 , i - 2);
   
    }
    doc.line(80, i - 5, 80, i );
  if(this.datasetgls[j].sodg_contr_id == "OD") {
    doc.text(String(Number(controlss.vis_recart.value)), 82 , i - 2);
    } else {
      doc.text(String(Number(controlss.vis_lecart.value)), 82 , i - 2);
   
    }
    doc.line(90, i - 5, 90, i );
    if(this.datasetgls[j].sodg_contr_id == "OD") {
      doc.text(String(Number(controlss.vis_rhauteur.value)), 92 , i - 2);
      } else {
        doc.text(String(Number(controlss.vis_lhauteur.value)), 92 , i - 2);
     
      }
      doc.line(100, i - 5, 100, i );
      doc.text( String(this.datasetgls[j].desc), 102 , i - 2 );
    
      doc.line(130, i - 5, 130, i );
  doc.text( String(Number(this.datasetgls[j].sodg_price).toFixed(2)), 142 , i - 2 , { align: 'right' });
  doc.line(145, i - 5, 145, i );
  i = i + 5 ;
}
/**********************Verre******************* */





/**********************accessoire***************** */
i = i + 10

doc.setFont('bold')
doc.setFontSize(10);

doc.text('Accessoire ', 11 , i - 5);
i = i + 5

doc.setFont('normal')
doc.setFontSize(8);
doc.line(10, i, 145, i);
doc.line(10, i-5, 145, i-5);
doc.line(10, i-5, 10, i);
doc.text('LN', 11 , i - 2.5);
doc.line(15, i-5, 15, i);
doc.text('Code Article', 20 , i - 2.5);
doc.line(40, i-5, 40, i);
doc.text('Désignation', 65 , i - 2.5);
doc.line(95, i-5, 95, i);
doc.text('QTE', 102 , i - 2.5);
doc.line(115, i-5, 115, i);
doc.text('UM', 120 , i - 2.5);
doc.line(125, i-5, 125, i);
doc.text('PU', 136 , i - 2.5);
doc.line(145, i-5, 145, i);

i = i + 5
doc.setFont('normal')
doc.setFontSize(8);
for (let j = 0; j < this.datasetacs.length  ; j++) {
  doc.line(10, i - 5, 145, i - 5);
  doc.line(10, i, 145, i );
  
  doc.line(10, i - 5, 10, i );
  //var oeil = "";
  //if(this.datasetgls[j].sodg_contr_id == 0){ oeil = "OD"} else { oeil = "OG"}
  doc.text(String(("000"+ this.datasetacs[j].soda_line)).slice(-3), 10.5 , i - 2);
  doc.line(15, i - 5, 15, i);
  doc.text(this.datasetacs[j].soda_part, 20 , i - 2);
  doc.line(40, i - 5 , 40, i );
  doc.text(this.datasetacs[j].desc, 42 , i - 2);
  doc.line(95, i - 5, 95, i );
  doc.text( String(this.datasetacs[j].soda_qty_ord.toFixed(2)), 113 , i - 2 , { align: 'right' });
  doc.line(115, i - 5 , 115, i );
  doc.text(this.datasetacs[j].soda_um, 120 , i - 2);
  doc.line(125, i - 5, 125, i );
  doc.text( String(Number((this.datasetacs[j].soda_price * ((100 - this.datasetacs[j].soda_disc_pct) / 100)) * this.datasetacs[j].soda_qty_ord * (1 + this.datasetacs[j].soda_taxc / 100) ).toFixed(2)  ), 143 , i - 2 , { align: 'right' });
  doc.line(145, i - 5, 145, i );
  i = i + 5 ;
}


/**********************accessoire***************** */
// doc.line(10, i - 5, 200, i - 5);
i = i + 20
//doc.line(80, i + 7,  145, i + 7  );
doc.line(80, i + 14, 145, i + 14 );
doc.line(80, i + 21, 145, i + 21 );
doc.line(80, i + 28, 145, i + 28 );
doc.line(80, i + 35, 145, i + 35 );
doc.line(80, i + 14,  80, i + 35  );
doc.line(110, i + 14,  110, i + 35  );
doc.line(145, i + 14,  145, i + 35  );
doc.setFontSize(10);

//doc.text('Total HT', 90 ,  i + 12 , { align: 'left' });
//doc.text('TVA', 90 ,  i + 19 , { align: 'left' });
doc.text('Total', 90 ,  i + 19 , { align: 'left' });
doc.text('Timbre', 90 ,  i + 26 , { align: 'left' });
doc.text('Total TC', 90 ,  i + 33 , { align: 'left' });


//doc.text(String(Number(controls.tht.value).toFixed(2)), 143 ,  i + 12 , { align: 'right' });
//doc.text(String(Number(controls.tva.value).toFixed(2)), 143 ,  i + 19 , { align: 'right' });
doc.text(String(Number(Number(controls.tva.value) + Number(controls.tht.value)).toFixed(2)), 143 ,  i + 19 , { align: 'right' });
doc.text(String(Number(controls.timbre.value).toFixed(2)), 143 ,  i + 26 , { align: 'right' });
doc.text(String(Number(controls.ttc.value).toFixed(2)), 143 ,  i + 33 , { align: 'right' });

doc.setFontSize(8);
  let mt = NumberToLetters(
    Number(controls.ttc.value).toFixed(2),"Dinars Algerien")

    if (mt.length > 70) {
      let mt1 = mt.substring(70)
      let ind = mt1.indexOf(' ')
     
      mt1 = mt.substring(0, 70  + ind)
      let mt2 = mt.substring(70+ind)
 
      doc.text( "Arretée la présente Commande a la somme de :" + mt1  , 20, i + 53)
      doc.text(  mt2  , 20, i + 60)
    } else {
      doc.text( "Arretée la présente Commande a la somme de :" + mt  , 20, i + 53)

    }
  // window.open(doc.output('bloburl'), '_blank');
  //window.open(doc.output('blobUrl'));  // will open a new tab
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));

}


printcustpdf(nbr,pen) {
  const controls = this.totForm.controls 
  const controlss = this.soForm.controls 
  console.log("pdf")
  var doc = new jsPDF({format: [100, 110]});
  
  // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  //img.src = "./assets/media/logos/company.png";
  //doc.addImage(img, 'png', 5, 5, 210, 30)
  doc.setFont('bold')
  doc.setFontSize(10);
  
  doc.text( 'Commande N° : ' + nbr  , 30, 35);
  
  doc.setFont('normal')
  doc.setFontSize(8);
  doc.text( 'peniche N° : ' + pen  , 10, 25);

  doc.text('Code Client : ' + this.customer.cm_addr, 10 , 50 )
  doc.text('Nom             : ' + this.customer.address.ad_name, 10 , 55)
  doc.text('Adresse        : ' + this.customer.address.ad_line1, 10 , 60)
  doc.text('Tel                : ' + this.customer.address.ad_phone, 10 , 65)

  doc.text('TTC              : ' + String(Number(controls.ttc.value).toFixed(2)), 10 ,  70);
 // doc.text('Acompte           :' + String(Number(controls.avance.value).toFixed(2)), 10 ,  75);
  doc.text('RESTE             :' + String((Number(controls.ttc.value) ).toFixed(2)), 10 ,  80);
  

  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));

}


/** customer **/
createAddressForm() {


      
  // document.getElementById("bill").focus();
   this.address = new Address()
   this.customer = new Customer()
   this.addressForm = this.formBuilder.group({
       ad_addr: [this.address.ad_addr, Validators.required],
       ad_name: [ this.address.ad_name,  Validators.required],
       ad_name_control: [ this.address.ad_name_control,  Validators.required],
       
       cm_type: [this.customer.cm_type,  Validators.required],
       cm_mod_date: [this.customer.cm_mod_date],
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
      // cm_mod_date: [ this.customer.cm_mod_date],
     //  cm_shipvia: [{ value: this.customer.cm_shipvia,  }],
     //  cm_site: [{ value: this.customer.cm_site,  }],
     //  cm_lang: [{ value: this.customer.cm_lang,  }],
       
     //  cm_bank: [{ value: this.customer.cm_bank,  }],
       cm_curr: [  "DA"  ],
       cm_cr_terms: [  "ES"  ],
       cm_class: [this.customer.cm_class],
     //  cm_resale: [{ value: this.customer.cm_resale,  }],
       cm_sic: [this.customer.cm_sic],
       
   })


   this.sequenceService.getByOne({ seq_type: "CL", seq_profile: this.user.usrd_profile }).subscribe(
     (response: any) => {
   this.seq = response.data
  // console.log(this.seq)   
       if (this.seq) {
        this.codecli = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
      //  console.log(this.seq.seq_prefix)
        //console.log(this.seq.seq_curr_val)
        
    //   console.log(this.codecli)
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

newCust(content) {
 // this.is_list = false;
 this.modalService.dismissAll;
  this.createAddressForm();
  this.modalService.open(content, { size: "xl" });
}

onSubmitCust() {
  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhh")
  this.hasFormErrors2= false
  const controls = this.addressForm.controls
//  const controls_ = this.customerForm.controls
  /** check form */
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

/**
* Returns object for saving
*/
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
  console.log(controls.cm_mod_date)
  _customer.cm_mod_date = controls.cm_mod_date.value
  ? `${controls.cm_mod_date.value.year}/${controls.cm_mod_date.value.month}/${controls.cm_mod_date.value.day}`
  : null

  console.log(_customer)
/*
  _customer.cm_cr_review = controls.cm_cr_review.value
      ? `${controls.cm_cr_review.value.year}/${controls.cm_cr_review.value.month}/${controls.cm_cr_review.value.day}`
      : null
  _customer.cm_cr_update = controls.cm_cr_update.value
      ? `${controls.cm_cr_update.value.year}/${controls.cm_cr_update.value.month}/${controls.cm_cr_update.value.day}`
      : null*/
  return _customer
  console.log(_customer)
}

/**
* Add product
*
* @param _product: ProductModel
*/
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

handleSelectedRowsChanged8(e, args) {
  let updateItem = this.gridServicegls.getDataItemByRowIndex(this.row_number);
  const controls = this.soForm.controls;
  let sphere = 0
  let cylindre = 0 
  let addition = null
  if (Array.isArray(args.rows) && this.gridObj8) {
    args.rows.map((idx) => {

      
      const item = this.gridObj8.getDataItem(idx);
      console.log(item);
      if (item.rev == "M") {
      
      if (this.oeil == "OD") {
        sphere   = Number(controls.vis_rsph.value);
        cylindre = Number(controls.vis_rcyl.value);
      
      if(controls.vis_radd.value != null) { addition = (controls.vis_radd.value)};
      }
      else {
         sphere   = Number(controls.vis_lsph.value);
         cylindre = Number(controls.vis_lcyl.value);
        if (controls.vis_ladd.value != null) { addition = (controls.vis_ladd.value)};       
      }
      // let obj = {};
      // obj = {
      //   part: item.glass.gls_part,
      //   cyl: cylindre,
      //   sph: sphere,
      //   add : addition
      // };
      // console.log(obj)
//console.log(obj,Number(controls.vis_lsph.value))
        updateItem.sodg_part = item.part;
        updateItem.sodg_desc = item.desc;
        updateItem.sodg_um = item.um;
        updateItem.sodg_um_conv = 1;
        
        updateItem.sodg_site = item.site;
        updateItem.sodg_loc = item.loc
        updateItem.sodg_serial = item.lot
        updateItem.sodg_expire = item.expire;
        updateItem.sodg_ref = null
        updateItem.qtyoh = item.qty;
        updateItem.sodg_sph = item.sph;
        updateItem.sodg_cyl = item.cyl;
        updateItem.sodg_add = item.add;
        
        updateItem.sodg_qty_ord = 1;
        updateItem.sodg_taxable = item.taxable
        updateItem.sodg_tax_code = item.taxc
        updateItem.sodg_taxc = item.taux_taxe
        updateItem.sodg_type = null
        updateItem.sodg_price = item.uprice
        updateItem.sodg_sales_price = item.price
        updateItem.sodg_disc_pct = 0
        this.calculatetot();
        this.gridServicegls.updateItem(updateItem);

} else {

  updateItem.sodg_part = item.part;
  updateItem.sodg_desc = item.desc;
  updateItem.sodg_um = item.um;
  updateItem.sodg_um_conv = 1;
  
  updateItem.sodg_site = item.site;
  updateItem.sodg_loc = item.loc
  updateItem.sodg_serial = item.lot
  updateItem.sodg_ref = null
  updateItem.qtyoh = item.qty;
  updateItem.sodg_sph = item.sph;
  updateItem.sodg_cyl = item.cyl;
  updateItem.sodg_add = item.add;
  updateItem.sodg_expire = null;
  updateItem.sodg_qty_ord = 1;
  updateItem.sodg_taxable = item.taxable
  updateItem.sodg_tax_code = item.taxc
  updateItem.sodg_taxc = item.taux_taxe
  updateItem.sodg_type = "M"
  updateItem.sodg_price = item.uprice
  updateItem.sodg_sales_price = item.price
  updateItem.sodg_disc_pct = 0
  this.calculatetot();
  this.gridServicegls.updateItem(updateItem);



}
    }) 
    
  }
}
angularGridReady8(angularGrid: AngularGridInstance) {
  this.angularGrid8 = angularGrid;
  this.dataView8 = angularGrid.dataView;
  this.gridObj8 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid8() {
  this.columnDefinitions8 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 30,
      maxWidth: 30,
    },
   /* {
      id: "part",
      name: "code ",
      field: "part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },*/
    {
      id: "rc",
      name: "RC",
      field: "rc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "indice",
      name: "Indice",
      field: "indice",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "desc",
      name: "desc",
      field: "desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      width: 100,
    },
    
    {
      id: "vend",
      name: "Fournisseur",
      field: "vend",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "rev",
      name: "Type Stock",
      field: "rev",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      filter: {

              
        // collectionAsync: this.elem,
        collectionAsync:  this.http.get(`${API_URL}/rev`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
     
     
       
         model: Filters.multipleSelect,
        
       },
    },
    {
      id: "part_type",
      name: "Verre / Lentille",
      field: "part_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      filter: {

              
        // collectionAsync: this.elem,
        collectionAsync:  this.http.get(`${API_URL}/parttype`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
     
     
       
         model: Filters.multipleSelect,
        
       },
    },
    {
      id: "draw",
      name: "Famille",
      field: "draw",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      filter: {

              
        // collectionAsync: this.elem,
        collectionAsync:  this.http.get(`${API_URL}/draw`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
     
     
       
         model: Filters.multipleSelect,
        
       },
    },
    
    {
      id: "dsgn_grp",
      name: "Sous Famille",
      field: "dsgn_grp",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      filter: {

              
        // collectionAsync: this.elem,
        collectionAsync:  this.http.get(`${API_URL}/dsgngrp`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
     
     
       
         model: Filters.multipleSelect,
        
       },
    },
    {
      id: "promo",
      name: "Couleur",
      field: "promo",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      filter: {

              
        // collectionAsync: this.elem,
        collectionAsync:  this.http.get(`${API_URL}/promo`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
     
     
       
         model: Filters.multipleSelect,
        
       },
    },
    {
      id: "upc",
      name: "Traitement",
      field: "upc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      filter: {

              
        // collectionAsync: this.elem,
        collectionAsync:  this.http.get(`${API_URL}/upc`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
     
     
       
         model: Filters.multipleSelect,
        
       },
    },
    {
      id: "price",
      name: "Prix",
      field: "price",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "qty",
      name: "Qte STK",
      field: "qty",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "lot",
      name: "Lot/Serie",
      field: "lot",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
   
    /*
    {
      id: "ldg_sph",
      name: "Sphere",
      field: "ldg_sph",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "ldg_cyl",
      name: "Cylindre",
      field: "ldg_cyl",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "ldg_add",
      name: "Addition",
      field: "ldg_add",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "ldg_qty_oh",
      name: "Quantite",
      field: "ldg_qty_oh",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },*/
  ];

  this.gridOptions8 = {
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
  let updateItem = this.gridServicegls.getDataItemByRowIndex(this.row_number);
  const controls = this.soForm.controls;
  const controls1 = this.glsForm.controls;
  let sphere = 0
  let cylindre = 0 
  let addition = null
  if (this.oeil == "OD") {
    sphere   = Number(controls.vis_rsph.value);
    cylindre = Number(controls.vis_rcyl.value);
    
    if(controls.vis_radd.value != null ) {addition = Number(controls.vis_radd.value)} ;
  }
  else {
     sphere   = Number(controls.vis_lsph.value);
     cylindre = Number(controls.vis_lcyl.value);
    if (controls.vis_ladd.value != null) { addition = Number(controls.vis_ladd.value)};       
  }
  let obj = {};
  obj = {
   
    cyl: cylindre,
    sph: sphere,
    add : addition,
    rev: "M",
  };
console.log(obj,Number(controls.vis_lsph.value))
  
  this.glassesService.getByStk({obj })
    .subscribe((response: any) => {(this.glasses = response.data,
    console.log(response.data) )
    }    
    
    );
}
changeRadio(e) {
  console.log(e.target.value);
  console.log("here")
  this.glasses = []
  const controls = this.soForm.controls;
  const controls1 = this.glsForm.controls;
  let sphere = 0
  let cylindre = 0 
  let addition = null
  console.log(controls1.sph.value)
    sphere   = Number(controls1.sph.value);
    cylindre = Number(controls1.cyl.value);
    
    if(controls1.add.value != null ) {addition = Number(controls1.add.value)} ;
  let obj = {};
  obj = {
   
    cyl: cylindre,
    sph: sphere,
    add : addition,
    rev: controls1.rev.value,
  };
  console.log("houna taka3")
  this.glassesService.getByStk({obj })
    .subscribe((response: any) => {this.glasses = response.data,
      console.log(obj, "yyyyyyyyy")
     console.log(this.glasses)
    this.dataView8.setItems(this.glasses)    
    console.log("houna laaaaaaaaaaaa taka3")
    console.log(response.data) 
    }    
    
    );
}
open8(content) {
  this.createFormGls();
  const controls = this.soForm.controls;
  const controls1 = this.glsForm.controls;
  console.log(this.oeil)
  if (this.oeil == "OD") {
    controls1.sph.setValue(controls.vis_rsph.value);
    controls1.cyl.setValue(controls.vis_rcyl.value);
    controls1.add.setValue(controls.vis_radd.value);
  }
  else {
    controls1.sph.setValue(controls.vis_lsph.value);
    controls1.cyl.setValue(controls.vis_lcyl.value);
    controls1.add.setValue(controls.vis_ladd.value);
   
  }
  this.prepareGrid8();
  this.modalService.open(content, { size: "xl" });
}


handleSelectedRowsChanged9(e, args) {
  let updateItem = this.gridServiceacs.getDataItemByRowIndex(this.row_number);
  const controls = this.soForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObj9) {
    args.rows.map((idx) => {

      
      const item = this.gridObj9.getDataItem(idx);
      console.log(item);
      if (item.acs_phantom) {
        this.type = 'M'
       
      } else {
        this.type = null
      }         
      console.log(item)
      this.accessoiresService.getByOne({acs_part:item.lda_part }).subscribe((resp:any)=>{
        console.log(resp.data)
      updateItem.soda_part = item.lda_part;
      updateItem.soda_desc = item.accessoire.acs_desc1;
      updateItem.soda_um = item.accessoire.acs_um;
      updateItem.soda_um_conv = 1;
      updateItem.soda_qty_ord = 1;
      updateItem.soda_site = item.lda_site;
      updateItem.soda_loc = item.lda_loc
      updateItem.soda_serial = item.lda_lot
      updateItem.soda_ref = item.lda_ref
      updateItem.soda_expire = item.lda_expire
      
      updateItem.soda_taxable = item.accessoire.acs_taxable
      updateItem.soda_tax_code = item.accessoire.acs_taxc
      updateItem.soda_taxc = resp.data.taxe.tx2_tax_pct
      updateItem.soda_type = this.type
      updateItem.qty_oh = item.lda_qty_oh
      updateItem.soda_price = item.accessoire.acs_price
      updateItem.soda_sales_price = item.accessoire.acs_sales_price
      updateItem.soda_disc_pct = 0
      this.calculatetot();
 
      this.gridServiceacs.updateItem(updateItem);
    }) 
  })
    
  }
}
angularGridReady9(angularGrid: AngularGridInstance) {
  this.angularGrid9 = angularGrid;
  this.gridObj9 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid9() {
  this.columnDefinitions9 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "lda_part",
      name: "code ",
      field: "lda_part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "accessoire.acs_desc1",
      name: "desc",
      field: "accessoire.acs_desc1",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "accessoire.acs_um",
      name: "UM",
      field: "accessoire.acs_um",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "lda_lot",
      name: "Lot/Serie ",
      field: "lda_lot",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "lda_Ref",
      name: "Ref ",
      field: "lda_ref",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "lda_expire",
      name: "EXP ",
      field: "lda_expire",
      sortable: true,
      filterable: true,
      type: FieldType.dateIso,
    },
    
    {
      id: "lda_qty_oh",
      name: "QTE",
      field: "lda_qty_oh",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
  ];

  this.gridOptions9 = {
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
this.locationAccessoireService
  .getAll()
    .subscribe((response: any) => (this.accessoires = response.data )
    
    
    );
}
open9(content) {
  this.prepareGrid9();
  this.modalService.open(content, { size: "lg" });
}


closeModal() {
  this.modalService.dismissAll;
}
handleSelectedRowsChangedcr(e, args) {
  const controls1 = this.customerForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObjcr) {
    args.rows.map((idx) => {
      const item = this.gridObjcr.getDataItem(idx);
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
angularGridReadycr(angularGrid: AngularGridInstance) {
  this.angularGridcr = angularGrid;
  this.gridObjcr = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridcr() {
  this.columnDefinitionscr = [
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

  this.gridOptionscr = {
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

opencr(content, field) {
  this.selectedField = field;
  this.prepareGridcr();
  this.modalService.open(content, { size: "lg" });
}




/** customer **/



}
