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
import { round } from 'lodash';
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import {  Observable, BehaviorSubject, Subscription, of } from "rxjs";
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
  AddressService,
  TaxeService,
  DeviseService,
  InventoryTransaction,
  ProductLineService,
  InventoryStatusService,
  PurchaseReceiveService,
  LocationService,
  SiteService,
  MesureService,
  SequenceService,
  LocationDetailService,
  CodeService,
  VoucherOrderService,
  VoucherOrder,
  EntityService,
  Item,
} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
import * as _ from 'lodash';

@Component({
  selector: 'kt-create-vh',
  templateUrl: './create-vh.component.html',
  styleUrls: ['./create-vh.component.scss']
})
export class CreateVhComponent implements OnInit {

  voucherOrder: VoucherOrder;
  inventoryTransaction: InventoryTransaction;
  ihForm: FormGroup;
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

  angularGridih: AngularGridInstance; 
  gridih: any;
  gridServiceih: GridService;
  dataViewih: any;
  columnDefinitionsih: Column[];
  gridOptionsih: GridOption;
  ihdataset : any[];

 /* angularGridcf: AngularGridInstance;
  gridcf: any;
  gridServicecf: GridService;
  dataViewcf: any;
  columnDefinitionscf: Column[];
  gridOptionscf: GridOption;
  cfdataset: any[];
  */
  provider: any;
  
  customers: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;
  
  bills: [];
    columnDefinitionsbill: Column[] = [];
    gridOptionsbill: GridOption = {};
    gridObjbill: any;
    angularGridbill: AngularGridInstance;
    
 
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  sos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  dataentity: []
  columnDefinitionsentity: Column[] = []
  gridOptionsentity: GridOption = {}
  gridObjentity: any
  angularGridentity: AngularGridInstance


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

  statuss: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;

  liste;
  sequences: []
    columnDefinitions1: Column[] = []
    gridOptions1: GridOption = {}
    gridObj1: any
    angularGrid1: AngularGridInstance

entity;

    groupedData: any = [];


  row_number;
  message = "";
  pshServer;
  location: any;
  details: any;
  datasetPrint = [];
  cfpl = [];
  stat: String;
  status: any;
  qty: Number;
  qtyship: Number;
  expire: Date;
  seq: any;
  vh_cr_terms: any[] = [];
  date: String;
  detail: any;
  curr: any;  
  user;
  vhnbr: String;
  total: Number;
  constructor(
    config: NgbDropdownConfig,
    private ihFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private providersService: ProviderService,
    private purchaseReceiveService: PurchaseReceiveService,
    private entityService: EntityService,
    private voucherOrderService: VoucherOrderService,
    
    private sequenceService: SequenceService,
    private codeService: CodeService,
    private addressService: AddressService,
    private itemsService: ItemService,
    private deviseService: DeviseService,
    private productLineService: ProductLineService,
    private taxService: TaxeService,
    private siteService: SiteService,
    private locationService: LocationService,
    private locationDetailService: LocationDetailService,
  ) {
    config.autoClose = true;
      this.codeService
        .getBy({ code_fldname: "vd_cr_terms" })
        .subscribe((response: any) => (this.vh_cr_terms = response.data));
      this.initGrid();
      this.initGridih();
      //this.initGridcf();
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
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
    {
      id: "invoice",
      name: "Facturé",
      field: "invoice",
      sortable: true,
      minWidth: 100,
      maxWidth: 100,
      filterable: false,
      editor: {
        model: Editors.checkbox
      },
      formatter: Formatters.checkmark,
      cannotTriggerInsert: false,
    },
      
      {
        id: "prh_receiver",
        name: "N° RC",
        field: "prh_receiver",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
        
      },
      {
        id: "prh_rcp_date",
        name: "Date",
        field: "prh_rcp_date",
        sortable: true,
        minWidth: 250,
        maxWidth: 250,
        filterable: false,
        formatter: Formatters.dateIso,
        type: FieldType.dateIso,
      },
      
      
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: false,
    
      
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
     /* presets: {
        sorters: [
          { columnId: 'prh_line', direction: 'ASC' }
        ],
      },*/
    };

    //this.dataset = [];
  }
  gridReadyih(angularGrid: AngularGridInstance) {
    this.angularGridih = angularGrid;
    this.dataViewih = angularGrid.dataView;
    this.gridih = angularGrid.slickGrid;
    this.gridServiceih = angularGrid.gridService;
  }
  initGridih() {
    this.columnDefinitionsih = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 30,
        maxWidth: 30,
    },
      
  /*  {
      id: "vdh_line",
      name: "Ligne",
      field: "vdh_line",
      minWidth: 50,
      maxWidth: 50,
      selectable: true,
      sortable: true,
    
    },*/
    {
      id: "vdh_sad_line",
      name: "Ligne RC",
      field: "vdh_sad_line",
      minWidth: 50,
      maxWidth: 50,
      selectable: true,
      sortable: true,
    },
    {
      id: "vdh_nbr",
      name: "N° OA",
      field: "vdh_nbr",
      sortable: true,
      width: 60,
      filterable: false,
      
    },
    {
      id: "vdh_ship",
      name: "RC",
      field: "vdh_ship",
      sortable: true,
      width: 60,
      filterable: false,
      
    },
    
    {
      id: "vdh_part",
      name: "Article",
      field: "vdh_part",
      sortable: true,
      width: 50,
      filterable: false,
      editor: {
        model: Editors.text,
        
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
console.log(args.dataContext.product)
var prod = args.dataContext.product;
        if (args.dataContext.vdh_ship  != "") { 

          this.gridServiceih.updateItemById(args.dataContext.id,{...args.dataContext , vdh_part: prod })
         alert("Vous ne pouvez pas modifier une ligne de reception")
                    
        } else 
        {


          this.itemsService.getByOne({pt_part: args.dataContext.vdh_part }).subscribe((resp:any)=>{
            console.log(resp.data)
                        if (resp.data) {
            
                          this.gridServiceih.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , /*prod_line: resp.data.pt_prod_line,*/ 
                            vdh_site:resp.data.pt_site, vdh_loc: resp.data.pt_loc,
                            vdh_um:resp.data.pt_um, vdh_tax_code: resp.data.pt_taxc, vdh_taxc: resp.data.taxe.tx2_tax_pct, pod_taxable: resp.data.pt_taxable})
            
                        
                  
                     }  else {
                        alert("Article Nexiste pas")
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , pod_part: null })
                     }
                      
             });
            






        }
        //this.calculatetot();
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
        console.log("kkkkkk2",this.row_number)
        if (this.ihdataset[this.row_number].vdh_ship != "") {

          alert( " vous ne pouvez pas changer de ligne de reception")
        } 
        else {
        let element: HTMLElement = document.getElementById(
          "openItemsGrid"
        ) as HTMLElement;
        element.click();
        }
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
  /*  {
      id: "prod_line",
      name: "Ligne Produit",
      field: "prod_line",
      sortable: true,
      width: 50,
      filterable: false,
    },*/
    {
      id: "vdh_um",
      name: "UM",
      field: "vdh_um",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    {
      id: "qty_inv",
      name: "Qte ",
      field: "qty_inv",
      sortable: true,
      width: 80,
      filterable: false,
      
    },
    {
      id: "price",
      name: "Prix unitaire",
      field: "price",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
      
    },
    {
      id: "vdh_qty_inv",
      name: "Qte Facturé",
      field: "vdh_qty_inv",
      sortable: true,
      width: 80,
      filterable: false,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        this.calculatetot();
         
      }   
      
    },
    {
      id: "vdh_price",
      name: "PU Facturé",
      field: "vdh_price",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        this.calculatetot();
        
      }   
    },
    {
      id: "vdh_disc_pct",
      name: "Remise",
      field: "vdh_disc_pct",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
      editor: {
        model: Editors.float,
        params: { decimalPlaces: 2 }
      },

      onCellChange: (e: Event, args: OnEventArgs) => {

        this.calculatetot();
         }   
     
    },
    {
      id: "vdh_taxable",
      name: "A Taxer",
      field: "vdh_taxable",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.checkbox,
     
    },
    {
      id: "vdh_tax_code",
      name: "Code de Taxe",
      field: "vdh_tax_code",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
     
     
    },
    {
      id: "vdh_taxc",
      name: "Taux Taxe",
      field: "vdh_taxc",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
     
    },
      
    ];

    this.gridOptionsih = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
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
     /* presets: {
        sorters: [
          { columnId: 'prh_line', direction: 'ASC' }
        ],
      },*/
    };

    //this.dataset = [];
  }

/*
  gridReadycf(angularGrid: AngularGridInstance) {
    this.angularGridcf = angularGrid;
    this.dataViewcf = angularGrid.dataView;
    this.gridcf = angularGrid.slickGrid;
    this.gridServicecf = angularGrid.gridService;
  }

  initGridcf() {
    this.columnDefinitionscf = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
      
    {
      id: "apd_ref",
      name: "PL",
      field: "apd_ref",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    }, 
    {
      id: "apd_desc",
      name: "Description",
      field: "apd_desc",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "apd_acct",
      name: "Compte",
      field: "apd_acct",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },

    {
      id: "apd_sub",
      name: "Sous Compte",
      field: "apd_sub",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "apd_cc",
      name: "Centre de Cout",
      field: "apd_cc",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "apd_cur_amt",
      name: "Montant Devise",
      field: "apd_cur_amt",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "apd_amt",
      name: "Montant ",
      field: "apd_amt",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
      
    ];

    this.gridOptionscf = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: false,
    
      
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
     presets: {
        sorters: [
          { columnId: 'prh_line', direction: 'ASC' }
        ],
      },
    };

    //this.dataset = [];
  }
  */
  ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
   
  
    this.createForm();
    this.createtotForm();
  
  }

  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
    //const date = new Date;
    
    this.totForm = this.totFB.group({
  //    so__chr01: [this.voucherOrder.vh__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    });
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.voucherOrder = new VoucherOrder();
      const date = new Date;
      
      this.ihForm = this.ihFB.group({
    //    so__chr01: [this.voucherOrder.vh__chr01],
        vh_po: [this.voucherOrder.vh_po , Validators.required],
        vh_vend: [this.voucherOrder.vh_vend , Validators.required],
        name: [{value:"", disabled: true}],
        
        vh_inv_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        vh_due_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        vh_taxable: [this.voucherOrder.vh_taxable],
       
        //vh_rmks: [this.voucherOrder.vh_po],
        vh_rmks: [this.voucherOrder.vh_rmks],
        vh_curr: [this.voucherOrder.vh_curr, Validators.required],
        vh_entity: [this.entity,Validators.required],
        vh_ex_rate: [this.voucherOrder.vh_ex_rate],
        vh_ex_rate2: [this.voucherOrder.vh_ex_rate2],
        vh_cr_terms: [this.voucherOrder.vh_cr_terms, Validators.required],
        print:[true]
      });
  const controls = this.ihForm.controls
      
      this.entityService.getBy({en_primary: true }).subscribe((resp:any)=>{

        console.log(resp.data)
       
       this.entity = resp.data[0].en_entity;
      
       controls.vh_entity.setValue(this.entity)
      console.log(this.entity)
    
      })
  
    }
    onChangeEntity() {
      this.dataset = []
      this.ihdataset = []
      //this.cfdataset = []
      const controls = this.ihForm.controls; // chof le champs hada wesh men form rah
    
      controls.vh_vend.setValue(null);
      controls.name.setValue(null);
      controls.vh_curr.setValue(null);
      controls.vh_cr_terms.setValue(null);
      controls.vh_taxable.setValue(false);
    
       
      const   en_entity = controls.vh_entity.value;
        
      
    
      this.entityService.getBy({en_entity}).subscribe(
        (res: any) => {
          const { data } = res;
          const message = "Cette Entitee n'existe pas!";
          if (!data.length) {
            alert (" Entité n'existe pas ")
            controls.vh_entity.setValue(null);
            
            document.getElementById("vh_entity").focus();
          } 
        },
      );
    }
    

  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.createtotForm();
    this.dataset = [];
    this.ihdataset = [];
  //  this.cfdataset = [];
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.ihForm.controls;
    /** check form */
    if (this.ihForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.ihdataset.length) {
      this.message = "La liste des article ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }
  /*  if (!this.cfdataset.length) {
      this.message = "Le Detail comptablité ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }
*/
    for (var i = 0; i < this.ihdataset.length; i++) {
      console.log(this.ihdataset[i]  )
     if (this.ihdataset[i].vdh_part == "" || this.ihdataset[i].vdh_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.ihdataset[i].vdh_um == "" || this.ihdataset[i].vdh_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.ihdataset[i].vdh_qty_inv == 0 ) {
      this.message = "La Quantite ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }

    }
/*
    this.sequenceService.getByOne({ seq_type: "IV", seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data
    console.log(this.seq)   
        if (this.seq) {
         this.pshnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
         console.log(this.seq.seq_prefix)
         console.log(this.seq.seq_curr_val)
         
        console.log(this.pshnbr)
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

      })
      */
      this.sequenceService.getByOne({ seq_type: "AP" }).subscribe(
        (response: any) => {
      this.seq = response.data
      console.log(this.seq)   
          if (this.seq) {
           this.vhnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
           console.log(this.seq.seq_prefix)
           console.log(this.seq.seq_curr_val)
           
          console.log(this.vhnbr)
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
      //let ps = this.prepare()
      //this.addIt( this.dataset,ps, this.pshnbr);
      //let as = this.prepareAs()
     // console.log("hhhhhh", as)
      //this.addAs(as,this.pshnbr);
      let ih = this.prepareIh()
      this.addIh(ih, this.vhnbr,this.ihdataset); //, this.cfdataset);
     
    })
    // tslint:disable-next-line:prefer-const
    

  }

  prepareIh(): any {
    const controls = this.ihForm.controls;
    const controlstot = this.totForm.controls 
    const _vh = new VoucherOrder();
    _vh.vh_po =  controls.vh_po.value
   
    _vh.vh_vend = controls.vh_vend.value;
    
    _vh.vh_inv_date = controls.vh_inv_date.value
      ? `${controls.vh_inv_date.value.year}/${controls.vh_inv_date.value.month}/${controls.vh_inv_date.value.day}`
      : null;

      _vh.vh_due_date = controls.vh_due_date.value
      ? `${controls.vh_due_date.value.year}/${controls.vh_due_date.value.month}/${controls.vh_due_date.value.day}`
      : null;  
    
      if (controls.vh_taxable.value == null || controls.vh_taxable.value == "" ) { _vh.vh_taxable = false} else { _vh.vh_taxable = controls.vh_taxable.value}
    
    _vh.vh_rmks = controls.vh_rmks.value;
    _vh.vh_curr = controls.vh_curr.value;
    _vh.vh_ex_rate = controls.vh_ex_rate.value;
    _vh.vh_ex_rate2 = controls.vh_ex_rate2.value;
    _vh.vh_cr_terms = controls.vh_cr_terms.value;
    _vh.vh_amt = controlstot.tht.value;
    _vh.vh_tax_amt = controlstot.tva.value;
    _vh.vh_trl1_amt = controlstot.timbre.value;
    _vh.vh_entity = controls.vh_entity.value;
    return _vh;
  
  }
  /**
   * Add po
   *
   * @param _ih: ih
   */
  addIh(_vh: any,vhnbr:any, detail: any ) {   //, apdetail: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    /*for (let dat of apdetail) {
      delete dat.id;
      
    }*/
    this.loadingSubject.next(true);
    let vh = null;
    const controls = this.ihForm.controls;

    this.voucherOrderService
      .add({ voucherOrder: _vh, vh_inv_nbr:vhnbr, voucherOrderDetail: detail }) //, apDetail: apdetail })
      .subscribe(
        (reponse: any) => (vh = reponse.data),
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
        //  console.log(this.dataset);
          this.router.navigateByUrl("/account-payable/create-vh");
          this.reset()
        }
      );
  }
 
  addNewItem() {
    const controls = this.ihForm.controls;

    if (this.dataset.length == 0 ) {
    this.gridServiceih.addItem(
      {
        id: this.ihdataset.length + 1,
        vdh_line: this.ihdataset.length + 1,
        vdh_sad_line: this.ihdataset.length + 1, 
        vdh_nbr: "",
        vdh_ship: "",
        vdh_part: "",

        desc: "",
       // prod_line: "", 
        vdh_qty_inv: "",
        qty_inv: 0,
        price: 0,
        vdh_site: "",
        vdh_loc: "",
        vdh_um: "",
        vdh_price: 0,
        vdh_ex_rate: controls.vh_ex_rate.value,
        vdh_ex_rate2: controls.vh_ex_rate2.value,
        vdh_disc_pct: 0,
        vdh_taxable: controls.vh_taxable.value,
        vdh_tax_code: "",
        vdh_taxc: "",
        total_line: 0,
        tax_line:    0, 
      },
      { position: "bottom" }
    );
  } else { 
alert("vous ne pouvez pas ajouter de ligne")

  }
  }

  onChangeCust() {
    this.ihdataset = []
    this.dataset = []
   // this.cfdataset = []
    const controls = this.ihForm.controls;
    const vd_addr = controls.vh_vend.value;
    const date = new Date()
    this.date = controls.vh_inv_date.value
    ? `${controls.vh_inv_date.value.year}/${controls.vh_inv_date.value.month}/${controls.vh_inv_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    this.dataset = [];

this.voucherOrderService.getByOne({ vh_po : controls.vh_po.value, vh_vend: controls.vh_vend.value}).subscribe(
  (response: any) => {
console.log(response.data)
const { data } = response
console.log(data)
if (!data) { 




    this.providersService.getBy({ vd_addr }).subscribe(
      (res: any) => {
      //  console.log(res);
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce Fournisseur n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          document.getElementById("vend").focus();
        } else {
          this.error = false;
          this.provider = res.data; 
          controls.vh_vend.setValue(data.vd_addr || "");
          controls.name.setValue(data.address.ad_name || "");
          controls.vh_cr_terms.setValue(data.vd_cr_terms || "");
          controls.vh_curr.setValue(data.vd_curr || "");
          controls.vh_taxable.setValue(data.address.ad_taxable || "");
         
            this.deviseService.getBy({ cu_curr: data.vd_curr }).subscribe(
              (res: any) => {
               // console.log(res);
                const { data } = res;
          if(data) {

            this.curr = data;
          }

              })

              if (data.vd_curr == 'DA'){
                controls.vh_ex_rate.setValue(1)
                controls.vh_ex_rate2.setValue(1)
  
              } else {
  
              this.deviseService.getExRate({exr_curr1:data.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 controls.vh_ex_rate.setValue(res.data.exr_rate)
                 controls.vh_ex_rate2.setValue(res.data.exr_rate2)
                })
  
                }
            

        }
         
      






        this.siteService.getBy({ si_entity : controls.vh_entity.value }).subscribe(
          (res: any) => {
      
            this.liste = res.data;
          
            for (let data1 of this.liste) {

            
            

        const distinct = vd_addr;
        const liste = data1.si_site
        console.log(liste)
        //console.log(distinct)

       
        this.purchaseReceiveService.getAllDistinct( data,liste,distinct ).subscribe(
          (res: any) => {
            //console.log(res.data)
            this.detail  = res.data;
           
          
            
            
            for (var object = 0; object < this.detail.length; object++) {
              this.gridService.addItem(
                    {
                      id: object + 1,
                      invoice: false,
                      prh_receiver: this.detail[object].prh_receiver,
                      prh_rcp_date: this.detail[object].prh_rcp_date,
                      
                    },
                    { position: "bottom" }
                  );
            }   
            //console.log("houhouna", this.dataset)       
          }) 
            }
          })
     

      });    
    } else {

      alert (" Facture existe deja pour ce fournisseur")
      controls.vh_po.setValue(null);
      controls.vh_vend.setValue(null);
      document.getElementById("vh_po").focus();
    }
  })

  //  (error) => console.log(error)
  

    
    
  }

  
  oncreateVH() {
    const controls = this.ihForm.controls;
    const vd_addr = controls.vh_vend.value;
    
    this.ihdataset = [];
    this.cfpl = [];
   // this.cfdataset = [];
    var array = [];
    var rc = []
    for (var i = 0; i < this.dataset.length; i++) {
     // console.log(this.dataset[i]  )
     if (this.dataset[i].invoice == true  ) {
        rc.push(
           this.dataset[i].prh_receiver,
        ) 
      }
    }
    const prh_receiver = rc ;
        this.purchaseReceiveService.findBy({ prh_receiver }).subscribe(
          (res: any) => {
           
            this.details  = res.data;
           
            
            for (var object = 0; object < this.details.length; object++) {
              const detail = this.details[object];
                  this.gridServiceih.addItem(
                    {
                      id: object + 1,
                      vdh_line: this.ihdataset.length + 1,
                      vdh_sad_line: detail.prh_line, 
                      vdh_nbr: detail.prh_nbr,
                      vdh_ship: detail.prh_receiver,
                      vdh_part: detail.prh_part,
                      product: detail.prh_part,

                      desc: detail.item.pt_desc1,
                     // prod_line:detail.item.pt_prod_line, 
                      vdh_qty_inv: detail.prh_rcvd * detail.prh_um_conv,
                      qty_inv: detail.prh_rcvd * detail.prh_um_conv,
                      price: detail.prh_pur_cost / detail.prh_um_conv,
                      vdh_site: detail.prh_site,
                      vdh_loc: detail.prh_loc,
                      vdh_um: detail.prh_um,
                      vdh_price: detail.prh_pur_cost / detail.prh_um_conv,
                      vdh_ex_rate: detail.prh_ex_rate,
                      vdh_ex_rate2: detail.prh_ex_rate2,
                      vdh_disc_pct: detail.prh_disc_pct,
                      vdh_taxable: detail.prh_taxable,
                      vdh_tax_code: detail.prh_tax_code,
                      vdh_taxc: detail.prh_taxc,
                      total_line:    (detail.prh_pur_cost / detail.prh_um_conv) *   (detail.prh_rcvd * detail.prh_um_conv)       ,
                      tax_line:        (detail.prh_pur_cost / detail.prh_um_conv) *   (detail.prh_rcvd * detail.prh_um_conv)  *     detail.prh_taxc / 100, 
                    },
                    { position: "bottom" }
                  );
                    // console.log("hnahna",this.ihdataset)
          // console.log("cfpl",this.cfpl)

          
            this.calculatetot();
            }

            console.log(array)
          

            
        })
       
        
  }
  

 
  changeCurr(){
    const controls = this.ihForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.vh_curr.value
    const date = new Date()
    this.date = controls.vh_inv_date.value
    ? `${controls.vh_inv_date.value.year}/${controls.vh_inv_date.value.month}/${controls.vh_inv_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
        const {data} = res
        //console.log(res)
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
            this.curr = data 
            if (cu_curr == 'DA'){
              controls.vh_ex_rate.setValue(1)
              controls.vh_ex_rate2.setValue(1)

            } else {

              //console.log(this.date)
            this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
            // console.log("here")
             //console.log(res.data)
              controls.vh_ex_rate.setValue(res.data.exr_rate)
               controls.vh_ex_rate2.setValue(res.data.exr_rate2)
              })
     
              }
        }


    },error=>console.log(error))
}
changeRateCurr(){
  const controls = this.ihForm.controls // chof le champs hada wesh men form rah
  const cu_curr  = controls.vh_curr.value

  const date = new Date()

  this.date = controls.vh_inv_date.value
    ? `${controls.vh_inv_date.value.year}/${controls.vh_inv_date.value.month}/${controls.vh_inv_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    if (cu_curr == 'DA'){
      controls.vh_ex_rate.setValue(1)
      controls.vh_ex_rate2.setValue(1)

    } else {
          this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
            

             controls.vh_ex_rate.setValue(res.data.exr_rate)
             controls.vh_ex_rate2.setValue(res.data.exr_rate2)
            })
   
    }
           
          
  
}
onChangeTAX() {
  const controls = this.ihForm.controls;
  const tax = controls.vh_taxable.value;
  
    for (var i = 0; i < this.ihdataset.length; i++) {
      let updateItem = this.gridServiceih.getDataItemByRowIndex(i);
    //  console.log(this.dataset[i].qty_oh)
          updateItem.vdh_taxable = tax ;
          if (tax == false) { updateItem.vdh_taxc = 0}
      
          this.gridServiceih.updateItem(updateItem);
       
    };
  
  
  
  this.calculatetot();
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
/*addNewItem() {
    this.gridServiceih.addItem(
      {
        id: this.ihdataset.length + 1,
        vdh_line: this.ihdataset.length + 1,
        vdh_part: "",
        desc: "",
        vdh_qty_inv: 0,
        vdh_um: "",
        vdh_price: 0,
        vdh_disc_pct:0,
        vdh_taxable: false,
        vdh_taxc:0,
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
        prh_qty_ship: 0,
        prh_um: this.dataset[i - 1].prh_um,
        prh_um_conv: this.dataset[i - 1].prh_um_conv,
        prh_price: this.dataset[i - 1].prh_price,
        prh_site: this.dataset[i - 1].prh_site,
        prh_loc: this.dataset[i - 1].prh_loc,
        prh_serial: "",
        tr_status: "",
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
  handleSelectedRowsChangedcurr(e, args) {
    const controls = this.ihForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcurr) {
      args.rows.map((idx) => {
        const item = this.gridObjcurr.getDataItem(idx);
        const date = new Date()
        this.date = controls.vh_inv_date.value
    ? `${controls.vh_inv_date.value.year}/${controls.vh_inv_date.value.month}/${controls.vh_inv_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

        controls.vh_curr.setValue(item.cu_curr || "");
        this.curr = item;
        if(item.cu_curr != 'DA'){

          const date = new Date()
          this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
            controls.vh_ex_rate.setValue(res.data.exr_rate)
            controls.vh_ex_rate2.setValue(res.data.exr_rate2)
          })
        }
        else {
          controls.vh_ex_rate.setValue(1)
            controls.vh_ex_rate2.setValue(1)

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
  



calculatetot(){
  const controls = this.totForm.controls 
   const controlsso = this.ihForm.controls 
  // console.log(this.ihdataset[0])
   let tht = 0
   let tva = 0
   let timbre = 0
   let ttc = 0
   //console.log(this.ihdataset.length)
   
   for (var i = 0; i < this.ihdataset.length; i++) {
   //  console.log("here", this.ihdataset[i].vdh_price,this.ihdataset[i].vdh_qty_inv, this.ihdataset[i].vdh_disc_pct, this.ihdataset[i].vdh_taxc   )
     tht += round((this.ihdataset[i].vdh_price * ((100 - this.ihdataset[i].vdh_disc_pct) / 100 ) *  this.ihdataset[i].vdh_qty_inv),2)
     if(this.ihdataset[i].vdh_taxable == true) tva += round((this.ihdataset[i].vdh_price * ((100 - this.ihdataset[i].vdh_disc_pct) / 100 ) *  this.ihdataset[i].vdh_qty_inv) * (this.ihdataset[i].vdh_taxc ? this.ihdataset[i].vdh_taxc / 100 : 0),2)
    
  
     

    // console.log(tva)
    // if(controlsso.vh_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
      // if (timbre > 10000) { timbre = 10000} } 
  
   }
 ttc = round(tht,2) + round(tva,2) + round(timbre,2)
//console.log(tht,tva,timbre,ttc)
controls.tht.setValue(tht.toFixed(2));
controls.tva.setValue(tva.toFixed(2));
controls.timbre.setValue(timbre.toFixed(2));
controls.ttc.setValue(ttc.toFixed(2));
this.total = Number(ttc.toFixed(2));


}

/*calculatepl(){
  
  const controls = this.ihForm.controls 
  var array = this.ihdataset
  var cf = this.cfdataset 
  this.cfdataset = [];
    
    var val = 0
    var result = [];
    array.reduce(function(res, value) {
    //console.log('aaa',res[value.prod_line])
    if (!res[value.prod_line]) {
      res[value.prod_line] = { prod_line: value.prod_line, price: 0 };
      result.push(res[value.prod_line])
    }
    res[value.prod_line].price += value.price;
    return res;
    }, {});
    
    for (var obj = 0; obj < result.length; obj++) {
    console.log("here" , obj) 
      for (var j = 0; j < cf.length; j++) {
  console.log("here" , j)
            
            cf[j].apd_cur_amt = result[obj].price
            cf[j].apd_amt =  result[obj].price * ((controls.vh_ex_rate2.value) / (controls.vh_ex_rate.value))
            
      }
    }
console.log(cf)


for (var k = 0; k < cf.length; k++) {
     const cfp = cf[k]
console.log(cfp)
let object = 
  {
    id: this.cfdataset.length + 1,
    apd_ref: cf[k].prod_line,

    apd_desc: cf[k].pl_desc,
    apd_acct: cf[k].pl_pur_acct,
    apd_sub: cf[k].pl_pur_sub,
    apd_cc: cf[k].pl_pur_cc,
    apd_cur_amt: cf[k].price,
    apd_amt:  cf[k].price * ((controls.vh_ex_rate2.value) / (controls.vh_ex_rate.value)),
    

  } 

  this.cfpl.push (object)
}      


}
   */

handleSelectedRowsChanged(e, args) {
  const controls = this.ihForm.controls
  if (Array.isArray(args.rows) && this.gridObj1) {
      args.rows.map((idx) => {
          const item = this.gridObj1.getDataItem(idx)
          controls.vh_category.setValue(item.seq_seq || "")
      })
  }
}

angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid1 = angularGrid
  this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid1() {
  this.columnDefinitions1 = [
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
  ]

  this.gridOptions1 = {
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
 
  this.sequenceService
      .getBy({seq_type: 'IV', seq_profile: this.user.usrd_profile})
      .subscribe((response: any) => (this.sequences = response.data))
     
}
open(content) {
  this.prepareGrid1()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChanged2(e, args) {
 // this.cfdataset = [];
  this.dataset = [] 
  this.ihdataset = []
  const controls = this.ihForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
     
      const date = new Date()

  this.date = controls.vh_inv_date.value
    ? `${controls.vh_inv_date.value.year}/${controls.vh_inv_date.value.month}/${controls.vh_inv_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;


    this.voucherOrderService.getByOne({ vh_po : controls.vh_po.value, vh_vend: item.vd_addr}).subscribe(
      (response: any) => {
    const { data } = response
    if (!data) { 
    
      this.provider = item;
      controls.vh_vend.setValue(item.vd_addr || "");
      controls.name.setValue(item.address.ad_name || "");
      controls.vh_curr.setValue(item.vd_curr || "");
      controls.vh_cr_terms.setValue(item.vd_cr_terms || "");
      controls.vh_taxable.setValue(item.address.ad_taxable || "");
    
      
     
        
      


      this.deviseService.getBy({ cu_curr: item.vd_curr }).subscribe(
        (res: any) => {
          //console.log(res);
          const { data } = res;
    if(data) {

      this.curr = data;
    }

        })

        if (item.vd_curr == 'DA'){
          controls.vh_ex_rate.setValue(1)
          controls.vh_ex_rate2.setValue(1)

        } else {

        this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
    
          
         // console.log(res.data)
           controls.vh_ex_rate.setValue(res.data.exr_rate)
           controls.vh_ex_rate2.setValue(res.data.exr_rate2)
          })

          }

      

        const data = item;    

        this.siteService.getBy({ si_entity : controls.vh_entity.value }).subscribe(
          (res: any) => {
      
            this.liste = res.data;
          
            for (let data1 of this.liste) {

            
            

        const distinct = item.vd_addr;
        const liste = data1.si_site
        console.log(liste)
        //console.log(distinct)
        this.purchaseReceiveService.getAllDistinct( data,liste, distinct ).subscribe(
          (res: any) => {
//            console.log(res.data)
            this.detail  = res.data;
           
          
            
            
            for (var object = 0; object < this.detail.length; object++) {
              this.gridService.addItem(
                    {
                      id: object + 1,
                      invoice: false,
                      prh_receiver: this.detail[object].prh_receiver,
                      prh_rcp_date: this.detail[object].prh_rcp_date,
                      
                    },
                    { position: "bottom" }
                  );
            }
  //          console.log("houhouna", this.dataset)          
          })
        } 
        });
        } else {

          alert (" Facture existe deja pour ce fournisseur")
          controls.vh_po.setValue(null);
          controls.vh_vend.setValue(null);
          document.getElementById("vh_po").focus();
        }
      })
    

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
  this.providersService
    .getAll()
    .subscribe((response: any) => (this.customers = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}


handleSelectedRowsChanged4(e, args) {
  let updateItem = this.gridServiceih.getDataItemByRowIndex(this.row_number);
  const controls = this.ihForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {

      
      const item = this.gridObj4.getDataItem(idx);
      console.log(this.row_number);
      
      
      updateItem.vdh_part = item.pt_part;
      updateItem.desc = item.pt_desc1;
      updateItem.vdh_um = item.pt_um;
      updateItem.vdh_site = item.pt_site;
     // updateItem.prod_line = item.pt_prod_line;
      
      updateItem.vdh_loc = item.pt_loc
      updateItem.vdh_taxable = item.pt_taxable
      updateItem.vdh_tax_code = item.pt_taxc
      
      updateItem.vdh_taxc = item.taxe.tx2_tax_pct
      this.gridServiceih.updateItem(updateItem);
    
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
      name: "desc",
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



/*
oncreateCF() {
  const controls = this.ihForm.controls;
  
  this.cfpl = [];
  //this.cfdataset = [];
  var array = [];
  var tax = [];

  console.log("Number(this.total),", Number(this.total))
  console.log(this.provider)

//this.gridServicecf.addItem(
this.cfdataset.push(  
{
    id: 1,
    apd_ref: this.provider.vd_addr,

    apd_desc: this.provider.address.ad_name,
    apd_acct: this.provider.vd_ap_acct,
    apd_sub: this.provider.vd_ap_sub,
    apd_cc: this.provider.vd_ap_cc,
    apd_cur_amt: Number(this.total.toFixed(2)),
    apd_amt:  (Number(this.total)  * ((controls.vh_ex_rate2.value) / (controls.vh_ex_rate.value))).toFixed(2),
    

  } ,
  { position: "bottom" }
);

   
          for (var j = 0; j < this.ihdataset.length; j++) {
         console.log("jjjjjjjjjjjj")
            this.ihdataset[j].total_line = this.ihdataset[j].vdh_price * this.ihdataset[j].vdh_qty_inv;
            this.ihdataset[j].tax_line = this.ihdataset[j].vdh_price * this.ihdataset[j].vdh_qty_inv * this.ihdataset[j].vdh_taxc / 100;


          }


  array = this.ihdataset;        
          var result = [];
  array.reduce(function(res, value) {
    //console.log('aaa',res[value.prod_line])
    if (!res[value.prod_line]) {
      res[value.prod_line] = { prod_line: value.prod_line, total_line: 0 };
      result.push(res[value.prod_line])
    }
    res[value.prod_line].total_line += value.total_line;
    return res;
  }, {});
  
  console.log('bbb',result)
 
  for (var obj = 0; obj < result.length; obj++) {
    const det = result[obj];
    console.log(obj, "obj",det)
         
  this.productLineService.getByOne({ pl_prod_line: det.prod_line  }).subscribe(
    (res: any) => {
  
      var prodline = det.prod_line
      console.log(prodline)

      this.gridServicecf.addItem(
        {
          id: this.cfdataset.length + 1,
          apd_ref: det.prod_line,

          apd_desc: res.data.pl_desc,
          apd_acct: res.data.pl_pur_acct,
          apd_sub: res.data.pl_pur_sub,
          apd_cc: res.data.pl_pur_cc,
          apd_cur_amt: - det.total_line.toFixed(2),
          apd_amt:  (- det.total_line * ((controls.vh_ex_rate2.value) / (controls.vh_ex_rate.value))).toFixed(2),
          
    
        } ,
        { position: "bottom" }
      );
  
})

  }




  tax = this.ihdataset;        
          var result = [];
  tax.reduce(function(res, value) {
    //console.log('aaa',res[value.prod_line])
    if (!res[value.vdh_tax_code]) {
      res[value.vdh_tax_code] = { vdh_tax_code: value.vdh_tax_code, tax_line: 0 };
      result.push(res[value.vdh_tax_code])
    }
    res[value.vdh_tax_code].tax_line += value.tax_line;
    return res;
  }, {});
  
  console.log('bbb',result)
 
  for (var o = 0; o < result.length; o++) {
    const det = result[o];
         console.log(det.vdh_tax_code)
  this.taxService.getBy({ tx2_tax_code: det.vdh_tax_code  }).subscribe(
    (res: any) => {
  console.log(res.data)
      var taxline = det.vdh_tax_code
      console.log(taxline)

      this.gridServicecf.addItem(
        {
          id: this.cfdataset.length + 1,
          apd_ref: det.vdh_tax_code,

          apd_desc: res.data.tx2_desc,
          apd_acct: res.data.tx2_ar_acct,
          apd_sub: res.data.tx2_ar_sub,
          apd_cc: res.data.tx2_ar_cc,
          apd_cur_amt: - det.tax_line.toFixed(2),
          apd_amt:  (- det.tax_line * ((controls.vh_ex_rate2.value) / (controls.vh_ex_rate.value))).toFixed(2),
          
    
        } ,
        { position: "bottom" }
      );
  
})

  }


          
     console.log(this.cfdataset)
      
}
*/
handleSelectedRowsChangedentity(e, args) {
  const controls = this.ihForm.controls
  this.dataset = []
  this.ihdataset = []
  //this.cfdataset = []
      controls.vh_vend.setValue(null);
      controls.name.setValue(null);
      controls.vh_curr.setValue(null);
      controls.vh_cr_terms.setValue(null);
      controls.vh_taxable.setValue(false);
    
 
  if (Array.isArray(args.rows) && this.gridObjentity) {
      args.rows.map((idx) => {
          const item = this.gridObjentity.getDataItem(idx)
          controls.vh_entity.setValue(item.en_entity || "")
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


}
