import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

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
} from "angular-slickgrid"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
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
import {
    NgbModal,
    NgbActiveModal,
    ModalDismissReasons,
    NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import {
    SaleOrder,
    SaleOrderService,
    CustomerService,
    UsersService,
    AddressService,
    ItemService,
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
} from "../../../../core/erp"
import { round } from 'lodash';
@Component({
  selector: 'kt-undo-so',
  templateUrl: './undo-so.component.html',
  styleUrls: ['./undo-so.component.scss']
})
export class UndoSoComponent implements OnInit {

  
  saleOrder: SaleOrder
  soForm: FormGroup
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

 
  sos: []
  columnDefinitions5: Column[] = []
  gridOptions5: GridOption = {}
  gridObj5: any
  angularGrid5: AngularGridInstance

  items: []
  columnDefinitions4: Column[] = []
  gridOptions4: GridOption = {}
  gridObj4: any
  angularGrid4: AngularGridInstance

  row_number
  message = ""
  soServer
 customer: any
  res : any
  user;

  totForm: FormGroup;

  oeil;
  fldname;

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
      private soFB: FormBuilder,
      private totFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private saleOrderService: SaleOrderService,
      private customersService: CustomerService,
      private userService: UsersService,
      private addressService: AddressService,
      private glassesService: GlassesService,
      private itemsService: ItemService,
      private accessoiresService: AccessoireService,
      private locationDetailService: LocationDetailService,
      private locationGlassesService: LocationGlassesService,
      private locationAccessoireService: LocationAccessoireService,
      private mesureService: MesureService,
      private doctorService: DoctorService,
      private visiteService: VisiteService,
      private locationService: LocationService,
      private pricelistService: PricelistService,
      private configService: ConfigService,
      private payMethService: PayMethService,
    
  ) {
      config.autoClose = true
    this.initGrid()
    this.initGridGls();
    this.initGridAcs();
 
      this.user = JSON.parse(localStorage.getItem('user'))
  }
  gridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid
      this.dataView = angularGrid.dataView
      this.grid = angularGrid.slickGrid
      this.gridService = angularGrid.gridService
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
              },
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
                  formatter: Formatters.decimal,
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
                formatter: Formatters.percentComplete,
            },
        ]

        this.gridOptions = {
          asyncEditorLoading: false,
          enableColumnPicker: true,
          autoHeight: true,
          enableCellNavigation: true,
          enableRowSelection: true,
      }

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
      },
      {
        id: "sodg_part",
        name: "Verre",
        field: "sodg_part",
        sortable: true,
        width: 50,
        filterable: false,
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
      },
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
      
      },
      {
        id: "sodg_price",
        name: "Prix unitaire",
        field: "sodg_price",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
        formatter: Formatters.decimal,
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
          formatter: Formatters.decimal,
      },
        
        
    
      {
        id: "sodg_type",
        name: "Type",
        field: "sodg_type",
        sortable: true,
        width: 30,
        filterable: false,
      },
      {
        id: "sodg_taxable",
        name: "Taxable",
        field: "sodg_taxable",
        sortable: true,
        width: 30,
        filterable: false,
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
        formatter: Formatters.percentComplete,
      
    },
    ];
  
    this.gridOptionsgls = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      autoHeight: true,
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
      },
      
      {
        id: "soda_qty_ord",
        name: "QTE",
        field: "soda_qty_ord",
        sortable: true,
        width: 60,
        filterable: false,
        type: FieldType.float,
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
          formatter: Formatters.decimal,
            
      },
        
        
    
      {
        id: "soda_taxable",
        name: "Taxable",
        field: "soda_taxable",
        sortable: true,
        width: 30,
        filterable: false,
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
        formatter: Formatters.percentComplete,
      
      },
    ];
  
    this.gridOptionsacs = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      autoHeight: true,
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
       if(this.soServer.so_taxable == true) tva += round((this.dataset[i].sod_price * ((100 - this.dataset[i].sod_disc_pct) / 100 ) *  this.dataset[i].sod_qty_ord) * (this.dataset[i].sod_taxc ? this.dataset[i].sod_taxc / 100 : 0),2)
      
    
       
  
       
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
      if(this.soServer.so_taxable == true) tvag += round((this.datasetgls[i].sodg_price * ((100 - this.datasetgls[i].sodg_disc_pct) / 100 ) *  this.datasetgls[i].sodg_qty_ord) * (this.datasetgls[i].sodg_taxc ? this.datasetgls[i].sodg_taxc / 100 : 0),2)
     
   console.log(thtg)
      
 if (this.soServer.assuractiv == true){
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
     if(this.soServer.so_taxable == true) tvaa += round((this.datasetacs[i].soda_price * ((100 - this.datasetacs[i].soda_disc_pct) / 100 ) *  this.datasetacs[i].soda_qty_ord) * (this.datasetacs[i].soda_taxc ? this.datasetacs[i].soda_taxc / 100 : 0),2)
    
     

     
   //  if(controlsso.so_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
     //  if (timbre > 10000) { timbre = 10000} } 
  
  }
   console.log(thtg)
   console.log(tht)
   
   tht = tht + thtg + thta
   tva = tva + tvag + tvaa
   if(this.timb) {
   if(this.soServer.so_cr_terms == "ES") { timbre = round((tht + tva) / 100,2);
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

  
  ngOnInit(): void {
      
      this.loading$ = this.loadingSubject.asObservable()
      this.loadingSubject.next(false)
      this.createForm()
      this.createtotForm();
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
  //create form
  createForm() {
      this.loadingSubject.next(false)
      this.saleOrder = new SaleOrder()
      
      this.soForm = this.soFB.group({
          so_nbr: [this.saleOrder.so_nbr],
          so_cust: [{ value: this.saleOrder.so_cust, disabled: true }],
          name: [{value: '', disabled: true}],
          prename: [{value: '', disabled: true}],
          so_ord_date: [
              { value: this.saleOrder.so_ord_date, disabled: true },
          ],
         
          
      })
  }
  //reste form
  reset() {
      this.saleOrder = new SaleOrder()
      this.createForm()
      this.hasFormErrors = false
  }

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
    
  

  // tslint:disable-next-line:prefer-const

    let so = this.prepareSo();
    console.log(this.hasFormErrors)
    if (this.hasFormErrors == false ) {
    this.addSo(so, this.dataset, this.datasetgls, this.datasetacs); }
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
    _so.so_cust = this.soServer.so_cust;
    _so.so_fob = this.soServer.so_fob;
    _so.so_po = this.soServer.so_nbr;
    
    _so.so_ord_date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : null;
    _so.so_due_date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : null;
      _so.so_taxable = this.soServer.so_taxable

    
    
    //_so.so_rmks = controls.so_rmks.value;
    _so.so_curr = "DA";
    _so.so_ex_rate = Number(1);
    _so.so_ex_rate2 = Number(1);
    _so.so_cr_terms = this.soServer.so_cr_terms;
   
    _so.so_amt = - Number(this.soServer.so_amt)
  _so.so_tax_amt = - Number(this.soServer.so_tax_amt)
  _so.so_trl1_amt =  - Number(this.soServer.so_trl1_amt)
  _so.so_trl2_amt = - Number(this.soServer.so_trl2_amt)
  _so.so__dec01 = - Number(this.soServer.so__dec01)
  
   // if(Number(this.customer.cm_balance) + Number(controls1.ttc.value) > Number(this.customer.cm_cr_limit)) { _so.so_stat = "HD"}   
    return _so;
  
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
      .addAvoir({ saleOrder: _so, saleOrderDetail: detail,saleOrderGlasses: detailgls, saleOrderAccessoire: detailacs })
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
         // this.printpdf(so.so_nbr , so.so_fob) //printSO(this.customer, this.dataset, so);
         // this.printcustpdf(so.so_nbr , so.so_fob) //printSO(this.customer, this.dataset, so);
          this.reset();
          this.router.navigateByUrl("/Sales/undo-so");
          this.reset();
        }
      );
  }
  /**
   * Go back to the list
   *
   */
  goBack() {
      this.loadingSubject.next(false)
      const url = `/`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }

  
  onAlertClose($event) {
      this.hasFormErrors = false
  }

  onChangePoNbr() {
      const controls = this.soForm.controls
      const so_nbr = controls.so_nbr.value
      this.saleOrderService.getBy({ so_nbr }).subscribe(
          (res: any) => {
              const { saleOrder, details } = res.data
              this.soServer = saleOrder
              
              this.dataset = details
              const ad_addr = this.soServer.so_cust;
              console.log(ad_addr)
              this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                          
                          
                    this.customer = response.data
          
                    controls.name.setValue(this.customer.ad_name);
                
                    controls.so_cust.setValue(saleOrder.so_cust)
                    const date = new Date(saleOrder.so_ord_date)
                    date.setDate(date.getDate() )

                    controls.so_ord_date.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                    })
                  
                    controls.so_stat.setValue(saleOrder.so_stat)
                  
              })
            },
          
            (error) => {
              this.message = `BC avec ce numero ${so_nbr} n'existe pas`
              this.hasFormErrors = true
          },
          () => {}
      )
  }
  
  

  handleSelectedRowsChanged5(e, args) {
      const controls = this.soForm.controls
     
      if (Array.isArray(args.rows) && this.gridObj5) {
          args.rows.map((idx) => {
              const item = this.gridObj5.getDataItem(idx)
              
              
              controls.so_nbr.setValue(item.so_nbr || "")

              //const controls = this.soForm.controls
              const so_nbr = item.id
              console.log(so_nbr)
              this.saleOrderService.getOne(so_nbr).subscribe(
                  (res: any) => {
                    
                      const { saleOrder, details,detailsgls, detailsacs } = res.data
                      this.soServer = saleOrder
                      console.log(this.soServer.id, "soserver")
                      this.dataset = details
                      this.datasetacs = detailsacs
                      this.datasetgls = detailsgls
                      const ad_addr = this.soServer.so_cust;
                      console.log(ad_addr)
                      this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                                  
                                  
                            this.customer = response.data
                  
                            controls.name.setValue(this.customer.ad_name);
                            controls.prename.setValue(this.customer.ad_name_control);
                      
                      controls.so_cust.setValue(saleOrder.so_cust)
                    

                    const date = new Date()
                     
                    controls.so_ord_date.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                    })
                  
                     
                    })
                    this.calculatetot()
                  },
                  (error) => {
                      this.message = `BC avec ce numero ${so_nbr} n'existe pas`
                      this.hasFormErrors = true
                  },
                  () => {}
              )





//                controls.so_rqby_userid.setValue(item.so_rqby_userid || "")
//              controls.so_category.setValue(item.so_category || "")

  //            controls.so_ord_date.setValue({
   //               year: new Date(item.so_ord_date).getFullYear(),
    //              month: new Date(item.so_ord_date).getMonth() + 1,
    //             day: new Date(item.so_ord_date).getDate(),
     //        }|| "")
      //        controls.so_need_date.setValue({
      //            year: new Date(item.so_need_date).getFullYear(),
       //           month: new Date(item.so_need_date).getMonth() + 1,
       //           day: new Date(item.so_need_date).getDate(),
        //      }|| "")
              
       //       controls.so_reason.setValue(item.so_reason || "")
        //      controls.so_status.setValue(item.so_status || "")
         //     controls.so_rmks.setValue(item.so_rmks || "")
          



          })
      }
  }

  angularGridReady5(angularGrid: AngularGridInstance) {
      this.angularGrid5 = angularGrid
      this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {}
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
        id: "so_nbr",
        name: "N° BC",
        field: "so_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "so_ord_date",
        name: "Date",
        field: "so_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "so_cust",
        name: "Client",
        field: "so_cust",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "address.ad_name",
        name: "Nom",
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "address.ad_name_control",
        name: "Prénom",
        field: "address.ad_name_control",
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
    this.saleOrderService
      .getByAllAdr({so__qadl01: false})
      .subscribe((response: any) => {
        console.log(response.data)
        this.sos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  
  


}
