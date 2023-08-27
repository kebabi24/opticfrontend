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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
  SaleOrderService,
  CustomerService,
  ItemService,
  AddressService,
  TaxeService,
  DeviseService,
  InventoryTransaction,
  SaleShiper,
  InventoryTransactionService,
  InventoryStatusService,
  SaleShiperService,
  LocationService,
  SiteService,
  MesureService,
  SequenceService,
  LocationDetailService,
  CodeService,
  InvoiceOrderTempService,
  InvoiceOrderTemp,
  printIH,
  Item,
} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";

@Component({
  selector: 'kt-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {

  invoiceOrder: InvoiceOrderTemp;
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

  customer: any;
  
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

  sequences: []
    columnDefinitions1: Column[] = []
    gridOptions1: GridOption = {}
    gridObj1: any
    angularGrid1: AngularGridInstance

  row_number;
  message = "";
  pshServer;
  location: any;
  details: any;
  datasetPrint = [];
  stat: String;
  status: any;
  qty: Number;
  qtyship: Number;
  expire: Date;
  seq: any;
  ith_cr_terms: any[] = [];
  detail: any;
  curr: any;  
  user;
  pshnbr: String;
  iharray = [] ;
  constructor(
    config: NgbDropdownConfig,
    private ihFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private customersService: CustomerService,
    private saleShiperService: SaleShiperService,
    private saleOrderService: SaleOrderService,
    private invoiceOrderService: InvoiceOrderTempService,
    
    private sequenceService: SequenceService,
    private codeService: CodeService,
    private addressService: AddressService,
    private itemsService: ItemService,
    private deviseService: DeviseService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private locationService: LocationService,
    private locationDetailService: LocationDetailService,
  ) {
    config.autoClose = true;
      this.codeService
        .getBy({ code_fldname: "cm_cr_terms" })
        .subscribe((response: any) => (this.ith_cr_terms = response.data));
      this.initGrid();
      this.initGridih();
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
        id: "psh_shiper",
        name: "N° BL",
        field: "psh_shiper",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
        
      },
      {
        id: "psh_ship_date",
        name: "Date",
        field: "psh_ship_date",
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
          { columnId: 'psh_line', direction: 'ASC' }
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
        minWidth: 80,
        maxWidth: 80,
    },
      
    {
      id: "itdh_line",
      name: "Ligne",
      field: "itdh_line",
      minWidth: 50,
      maxWidth: 50,
      selectable: true,
      sortable: true,
    },
    {
      id: "itdh_sad_line",
      name: "Ligne BL",
      field: "itdh_sad_line",
      minWidth: 50,
      maxWidth: 50,
      selectable: true,
      sortable: true,
    },
    {
      id: "itdh_nbr",
      name: "N° CC",
      field: "itdh_nbr",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    {
      id: "itdh_ship",
      name: "BL",
      field: "itdh_ship",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    
    {
      id: "itdh_part",
      name: "Article",
      field: "itdh_part",
      sortable: true,
      width: 50,
      filterable: false,
      
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
      id: "itdh_um",
      name: "UM",
      field: "itdh_um",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    {
      id: "itdh_qty_inv",
      name: "Qte",
      field: "itdh_qty_inv",
      sortable: true,
      width: 80,
      filterable: false,
      
    },
    {
      id: "itdh_price",
      name: "Prix unitaire",
      field: "itdh_price",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
     
    },
    {
      id: "itdh_disc_pct",
      name: "Remise",
      field: "itdh_disc_pct",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
     
    },
    {
      id: "itdh_taxable",
      name: "A Taxer",
      field: "itdh_taxable",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.checkbox,
     
    },
    {
      id: "itdh_tax_code",
      name: "Code de Taxe",
      field: "itdh_tax_code",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
     
     
    },
    {
      id: "itdh_taxc",
      name: "Taux Taxe",
      field: "itdh_taxc",
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
          { columnId: 'psh_line', direction: 'ASC' }
        ],
      },*/
    };

    //this.dataset = [];
  }
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
  //    so__chr01: [this.invoiceOrder.ith__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    });
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.invoiceOrder = new InvoiceOrderTemp();
      const date = new Date;
      
      this.ihForm = this.ihFB.group({
    //    so__chr01: [this.invoiceOrder.ith__chr01],
        ith_category: [this.invoiceOrder.ith_category , Validators.required],
        ith_cust: [this.invoiceOrder.ith_cust , Validators.required],
        name: [{value:"", disabled: true}],
        
        ith_bill: [this.invoiceOrder.ith_bill , Validators.required],
        namebill: [{value:"", disabled: true}],
        
        ith_inv_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        ith_taxable: [this.invoiceOrder.ith_taxable],
       
        ith_po: [this.invoiceOrder.ith_po],
        ith_rmks: [this.invoiceOrder.ith_rmks],
        ith_curr: [this.invoiceOrder.ith_curr, Validators.required],
        ith_ex_rate: [this.invoiceOrder.ith_ex_rate],
        ith_ex_rate2: [this.invoiceOrder.ith_ex_rate2],
        ith_cr_terms: [this.invoiceOrder.ith_cr_terms, Validators.required],
        print:[true]
      });
  
      
      
  
    }
  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.dataset = [];
    this.ihdataset = [];
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

    for (var i = 0; i < this.ihdataset.length; i++) {
      console.log(this.ihdataset[i]  )
     if (this.ihdataset[i].itdh_part == "" || this.ihdataset[i].itdh_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.ihdataset[i].itdh_um == "" || this.ihdataset[i].itdh_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.ihdataset[i].itdh_qty_inv == 0 ) {
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
    // tslint:disable-next-line:prefer-const
    let ih = this.prepareIh()
    this.addIh(ih, this.ihdataset);


  }

  prepareIh(): any {
    const controls = this.ihForm.controls;
    const controlstot = this.totForm.controls 
    const _ih = new InvoiceOrderTemp();
    _ih.ith_category =  controls.ith_category.value
    _ih.ith_cust = controls.ith_cust.value;
    _ih.ith_bill = controls.ith_bill.value;
    
    _ih.ith_inv_date = controls.ith_inv_date.value
      ? `${controls.ith_inv_date.value.year}/${controls.ith_inv_date.value.month}/${controls.ith_inv_date.value.day}`
      : null;
    
      if (controls.ith_taxable.value == null || controls.ith_taxable.value == "" ) { _ih.ith_taxable = false} else { _ih.ith_taxable = controls.ith_taxable.value}
    
   
    _ih.ith_rmks = controls.ith_rmks.value;
    
    _ih.ith_rmks = controls.ith_rmks.value;
    _ih.ith_curr = controls.ith_curr.value;
    _ih.ith_ex_rate = 1;
    _ih.ith_ex_rate2 = 1;
    _ih.ith_cr_terms = controls.ith_cr_terms.value;
    _ih.ith_amt = controlstot.tht.value;
    _ih.ith_tax_amt = controlstot.tva.value;
    _ih.ith_trl1_amt = controlstot.timbre.value;
    
    return _ih;
  
  }
  /**
   * Add po
   *
   * @param _ih: ih
   */
  addIh(_ih: any, detail: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    let ih = null;
    var array = []
    //var iharray = []
    const controls = this.ihForm.controls;

    this.invoiceOrderService
      .addIv({ invoiceOrderTemp: _ih, invoiceOrderTempDetail: detail })
      .subscribe(
        (reponse: any) => (ih = reponse.data),
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


          array = this.ihdataset;        
          var result = [];
  array.reduce(function(res, value) {
    //console.log('aaa',res[value.itdh_part])
    if (!res[value.itdh_part]) {
      res[value.itdh_part] = { itdh_part: value.itdh_part,  itdh_qty_inv: 0 };
      result.push(res[value.itdh_part])                                                                                                                                            
      
    }
    res[value.itdh_part].itdh_qty_inv += value.itdh_qty_inv; 
    return res;
  }, {});
  
  console.log('bbb',result)
  var bool = false
  for (var obj = 0; obj < result.length; obj++) {
    const det = result[obj];
    
this.iharray.push(det)
bool = false
var j = 0
   
    do {
  if (this.ihdataset[j].itdh_part = det.itdh_part ) {
    this.iharray[obj].itdh_line = obj + 1
    this.iharray[obj].desc =  this.ihdataset[j].desc
    this.iharray[obj].itdh_price =  this.ihdataset[j].itdh_price
    this.iharray[obj].itdh_taxable = this.ihdataset[j].itdh_taxable
    this.iharray[obj].itdh_tax_code = this.ihdataset[j].itdh_tax_code
    this.iharray[obj].itdh_taxc = this.ihdataset[j].itdh_taxc
    this.iharray[obj].itdh_disc_pct = this.ihdataset[j].itdh_disc_pct
    this.iharray[obj].itdh_um = this.ihdataset[j].itdh_um
    
    
  bool = true   
  }
  j++
  }while ( j < this.ihdataset.length || bool == false);


                         
  }
  console.log("hnahna", this.iharray)
          if(controls.print.value == true) this.printpdf(ih) //printIH(this.customer, iharray, ih,this.curr);
          this.router.navigateByUrl("/Sales/create-invoice");
          this.reset()
        }
      );
  }
 
  


  onChangeCust() {
    const controls = this.ihForm.controls;
    const cm_addr = controls.ith_cust.value;
    
    this.dataset = [];
    this.customersService.getBy({ cm_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce client n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          document.getElementById("cust").focus();
        } else {
          this.error = false;
          this.customer = res.data; 
          controls.ith_cust.setValue(data.cm_addr || "");
          controls.name.setValue(data.address.ad_name || "");
          controls.ith_bill.setValue(data.cm_bill || "");
          controls.ith_cr_terms.setValue(data.cm_cr_terms || "");
          controls.ith_curr.setValue(data.cm_curr || "");
          controls.ith_taxable.setValue(data.address.ad_taxable || "");
          this.addressService.getBy({ ad_addr:data.cm_bill  }).subscribe(
            (resadr: any) => {
              controls.namebill.setValue(resadr.data.ad_name || "");
              
            
            })
            this.deviseService.getBy({ cu_curr: data.cm_curr }).subscribe(
              (res: any) => {
                console.log(res);
                const { data } = res;
          if(data) {

            this.curr = data;
          }

              })

            

        }
         
      







       
        const distinct = cm_addr;
        console.log(distinct)
        this.saleShiperService.getAllDistinct( data,distinct ).subscribe(
          (res: any) => {
            //console.log(res.data)
            this.detail  = res.data;
           
          
            
            
            for (var object = 0; object < this.detail.length; object++) {
              this.gridService.addItem(
                    {
                      id: object + 1,
                      invoice: false,
                      psh_shiper: this.detail[object].psh_shiper,
                      psh_ship_date: this.detail[object].psh_ship_date,
                      
                    },
                    { position: "bottom" }
                  );
            }          
          }) 
        
     

      });    
    
  //  (error) => console.log(error)
  

    
    
  }

  onChangeBill() {
    const controls = this.ihForm.controls;
    const cm_addr = controls.ith_bill.value;
    
    //this.dataset = [];
    this.customersService.getBy({ cm_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce client n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          document.getElementById("bill").focus();
        } else {
          this.error = false;
          this.customer = res.data; 
          controls.ith_bill.setValue(data.cm_addr || "");
          controls.ith_cr_terms.setValue(data.cm_cr_terms || "");
          controls.ith_curr.setValue(data.cm_curr || "");
          controls.ith_taxable.setValue(data.address.ad_taxable || "");
          controls.namebill.setValue(data.address.ad_name || "");
              
            
            this.deviseService.getBy({ cu_curr: data.cm_curr }).subscribe(
              (res: any) => {
                console.log(res);
                const { data } = res;
          if(data) {

            this.curr = data;
          }

              })

            

        }
       
      });    
    
  //  (error) => console.log(error)
  

    
    
  }

  oncreateIH() {
    const controls = this.ihForm.controls;
    const cm_addr = controls.ith_cust.value;
    
    this.ihdataset = [];
    this.datasetPrint = [];
    var bl = []
    for (var i = 0; i < this.dataset.length; i++) {
      console.log(this.dataset[i]  )
     if (this.dataset[i].invoice == true  ) {
        bl.push(
           this.dataset[i].psh_shiper,
        ) 
      }
    }
    console.log(bl)
    const psh_shiper = bl ;
        this.saleShiperService.findBy({ psh_shiper }).subscribe(
          (res: any) => {
            this.details  = res.data;
           
            //console.log("here",res.data)
            
            for (var object = 0; object < this.details.length; object++) {
              const detail = this.details[object];
            // console.log(detail)
                  this.gridServiceih.addItem(
                    {
                      id: this.ihdataset.length + 1,
                      itdh_line: this.ihdataset.length + 1,
                      itdh_sad_line: detail.psh_line, 
                      itdh_nbr: detail.psh_nbr,
                      itdh_ship: detail.psh_shiper,
                      itdh_part: detail.psh_part,
                      desc: detail.item.pt_desc1,
                      itdh_qty_inv: detail.psh_qty_ship * detail.psh_um_conv,
                      itdh_site: detail.psh_site,
                      itdh_loc: detail.psh_loc,
                      itdh_um: detail.psh_um,
                      itdh_price: detail.psh_price / detail.psh_um_conv,
                      itdh_ex_rate: detail.psh_ex_rate,
                      itdh_ex_rate2: detail.psh_ex_rate2,
                      itdh_disc_pct: detail.psh_disc_pct,
                      itdh_taxable: detail.psh_so_taxable,
                      itdh_tax_code: detail.psh_tax_code,
                      itdh_taxc: detail.psh_taxc,
                      
                    },
                    { position: "bottom" }
                  );
          
            }          
     
              
          this.calculatetot();
          
        })

     
       
  }
  onChangeSeq() {
    const controls = this.ihForm.controls
    console.log(this.user.usrd_profile)
    this.sequenceService
        .getBy({seq_seq: controls.ith_category.value, seq_type: 'IV', seq_profile: this.user.usrd_profile})
        .subscribe((response: any) => {
            console.log(response)
            if (response.data.length == 0) {
                alert("Sequence nexiste pas")
                controls.ith_category.setValue("")
                //console.log(response.data.length)
                document.getElementById("SEQUENCE").focus();
            } 
        })
}

 
  changeCurr(){
    const controls = this.ihForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.so_curr.value
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
            this.curr = data 
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
/*addNewItem() {
    this.gridServiceih.addItem(
      {
        id: this.ihdataset.length + 1,
        itdh_line: this.ihdataset.length + 1,
        itdh_part: "",
        desc: "",
        itdh_qty_inv: 0,
        itdh_um: "",
        itdh_price: 0,
        itdh_disc_pct:0,
        itdh_taxable: false,
        itdh_taxc:0,
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
        psh_line: this.dataset.length + 1,
        psh_part: this.dataset[i - 1].psh_part,
        cmvid: "",
        desc: this.dataset[i - 1].desc,
        psh_qty_ship: 0,
        psh_um: this.dataset[i - 1].psh_um,
        psh_um_conv: this.dataset[i - 1].psh_um_conv,
        psh_price: this.dataset[i - 1].psh_price,
        psh_site: this.dataset[i - 1].psh_site,
        psh_loc: this.dataset[i - 1].psh_loc,
        psh_serial: "",
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
        controls.psh_curr.setValue(item.cu_curr || "");
        this.curr = item;
        if(item.cu_curr != 'DA'){

          const date = new Date()
          this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}).subscribe((res:any)=>{
            controls.psh_ex_rate.setValue(res.data.exr_rate)
            controls.psh_ex_rate2.setValue(res.data.exr_rate2)
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
  



calculatetot(){
  const controls = this.totForm.controls 
   const controlsso = this.ihForm.controls 
   console.log(this.ihdataset[0])
   let tht = 0
   let tva = 0
   let timbre = 0
   let ttc = 0
   console.log(this.ihdataset.length)
   
   for (var i = 0; i < this.ihdataset.length; i++) {
     console.log("here", this.ihdataset[i].itdh_price,this.ihdataset[i].itdh_qty_inv, this.ihdataset[i].itdh_disc_pct, this.ihdataset[i].itdh_taxc   )
     tht += round((this.ihdataset[i].itdh_price * ((100 - this.ihdataset[i].itdh_disc_pct) / 100 ) *  this.ihdataset[i].itdh_qty_inv),2)
     if(this.ihdataset[i].itdh_taxable == true) tva += round((this.ihdataset[i].itdh_price * ((100 - this.ihdataset[i].itdh_disc_pct) / 100 ) *  this.ihdataset[i].itdh_qty_inv) * (this.ihdataset[i].itdh_taxc ? this.ihdataset[i].itdh_taxc / 100 : 0),2)
    
  
     

     console.log(tva)
     if(controlsso.ith_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
       if (timbre > 10000) { timbre = 10000} } 
  
   }
 ttc = round(tht,2) + round(tva,2) + round(timbre,2)
console.log(tht,tva,timbre,ttc)
controls.tht.setValue(tht.toFixed(2));
controls.tva.setValue(tva.toFixed(2));
controls.timbre.setValue(timbre.toFixed(2));
controls.ttc.setValue(ttc.toFixed(2));

}


handleSelectedRowsChanged(e, args) {
  const controls = this.ihForm.controls
  if (Array.isArray(args.rows) && this.gridObj1) {
      args.rows.map((idx) => {
          const item = this.gridObj1.getDataItem(idx)
          controls.ith_category.setValue(item.seq_seq || "")
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
  const controls = this.ihForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
      console.log(item)
      
      this.customer = item;
      controls.ith_cust.setValue(item.cm_addr || "");
      controls.ith_bill.setValue(item.cm_bill || "");
      controls.name.setValue(item.address.ad_name || "");
      controls.ith_curr.setValue(item.cm_curr || "");
      controls.ith_cr_terms.setValue(item.cm_cr_terms || "");
      controls.ith_taxable.setValue(item.address.ad_taxable || "");
    
      
     
      const cm_addr = item.cm_addr;
      this.dataset = [];
    this.customersService.getBy({ cm_addr: item.cm_bill }).subscribe(
      (ressa: any) => {
        console.log(ressa);
        
          this.error = false;
          this.customer = ressa.data; 
          //controls.ith_bill.setValue(dataa.cm_addr || "");
          controls.namebill.setValue(ressa.data.address.ad_name || "");
          
          controls.ith_curr.setValue(ressa.data.cm_curr || "");
          controls.ith_taxable.setValue(ressa.data.address.ad_taxable || "");
        
      


      this.deviseService.getBy({ cu_curr: ressa.data.cm_curr }).subscribe(
        (res: any) => {
          console.log(res);
          const { data } = res;
            if(data) {

              this.curr = data;
            }

        })


      })  

        const data = item;    
        const distinct = cm_addr;
        console.log(distinct)
        this.saleShiperService.getAllDistinct( data,distinct ).subscribe(
          (res: any) => {
            //console.log(res.data)
            this.detail  = res.data;
           
          
            
            
            for (var object = 0; object < this.detail.length; object++) {
              this.gridService.addItem(
                    {
                      id: object + 1,
                      invoice: false,
                      psh_shiper: this.detail[object].psh_shiper,
                      psh_ship_date: this.detail[object].psh_ship_date,
                      
                    },
                    { position: "bottom" }
                  );
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
      id: "cm_addr",
      name: "code",
      field: "cm_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Client",
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
  this.customersService
    .getAll()
    .subscribe((response: any) => (this.customers = response.data));
}
open2(content) {
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedbill(e, args) {
  const controls = this.ihForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbill) {
    args.rows.map((idx) => {
      const item = this.gridObjbill.getDataItem(idx);
      console.log(item)
      
      this.customer = item;
      controls.ith_bill.setValue(item.cm_addr || "");
      controls.namebill.setValue(item.address.ad_name || "");
      controls.ith_curr.setValue(item.cm_curr || "");
      controls.ith_cr_terms.setValue(item.cm_cr_terms || "");
      controls.ith_taxable.setValue(item.address.ad_taxable || "");
      

      this.deviseService.getBy({ cu_curr: item.cm_curr }).subscribe(
        (res: any) => {
          console.log(res);
          const { data } = res;
            if(data) {

              this.curr = data;
            }

        })


    });
  }
}

angularGridReadybill(angularGrid: AngularGridInstance) {
  this.angularGridbill = angularGrid;
  this.gridObjbill = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridbill() {
  this.columnDefinitionsbill = [
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
      name: "Client",
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

  this.gridOptionsbill = {
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
    .getAll()
    .subscribe((response: any) => (this.bills = response.data));
}
openbill(content) {
  this.prepareGridbill();
  this.modalService.open(content, { size: "lg" });
}

printpdf(nbr) {
  const controls = this.totForm.controls 
  const controlss = this.ihForm.controls 
  console.log("pdf")
  var doc = new jsPDF();
 
 // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  img.src = "./assets/media/logos/company.png";
  doc.addImage(img, 'png', 5, 5, 210, 30)
  doc.setFontSize(12);
  doc.text( 'Facture N°: ' + nbr  , 70, 40);
  doc.setFontSize(8);
  console.log(this.customer.address.ad_misc2_id)
  doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
  doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
  doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
  if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
    
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
  doc.text('PU', 138 , 88.5);
  doc.line(150, 85, 150, 90);
  doc.text('TVA', 152 , 88.5);
  doc.line(160, 85, 160, 90);
  doc.text('REM', 162 , 88.5);
  doc.line(170, 85, 170, 90);
  doc.text('THT', 181 , 88.5);
  doc.line(200, 85, 200, 90);
  var i = 95;
  doc.setFontSize(6);
  for (let j = 0; j < this.iharray.length  ; j++) {
    
    if ((j % 30 == 0) && (j != 0) ) {
doc.addPage();
      doc.addImage(img, 'png', 5, 5, 210, 30)
      doc.setFontSize(12);
      doc.text( 'N° Facture : ' + nbr  , 70, 40);
      doc.setFontSize(8);
      console.log(this.customer.address.ad_misc2_id)
      doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
      doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
      doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
      if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
    
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
      doc.text('PU', 138 , 88.5);
      doc.line(150, 85, 150, 90);
      doc.text('TVA', 152 , 88.5);
      doc.line(160, 85, 160, 90);
      doc.text('REM', 162 , 88.5);
      doc.line(170, 85, 170, 90);
      doc.text('THT', 181 , 88.5);
      doc.line(200, 85, 200, 90);
      i = 95;
      doc.setFontSize(6);

    }



    if (this.iharray[j].desc.length > 35) {
      let desc1 = this.iharray[j].desc.substring(35)
      let ind = desc1.indexOf(' ')
      desc1 = this.iharray[j].desc.substring(0, 35  + ind)
      let desc2 = this.iharray[j].desc.substring(35+ind)

      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.iharray[j].itdh_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.iharray[j].itdh_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(desc1, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(this.iharray[j].itdh_qty_inv.toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.iharray[j].itdh_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String(Number(this.iharray[j].itdh_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.iharray[j].itdh_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(this.iharray[j].itdh_disc_pct) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.iharray[j].itdh_price *
              ((100 - this.iharray[j].itdh_disc_pct) / 100) *
              this.iharray[j].itdh_qty_inv).toFixed(2)), 198 , i  - 1,{ align: 'right' });
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
      doc.line(150, i - 5, 150, i );
      doc.line(160, i - 5 , 160, i );
      doc.line(170, i - 5 , 170, i );
      doc.line(200, i-5 , 200, i );
      doc.line(10, i, 200, i );

      i = i + 5 ;
      
    } else {


    
    doc.line(10, i - 5, 10, i );
    doc.text(String(("000"+ this.iharray[j].itdh_line)).slice(-3), 12.5 , i  - 1);
    doc.line(20, i - 5, 20, i);
    doc.text(this.iharray[j].itdh_part, 25 , i  - 1);
    doc.line(45, i - 5 , 45, i );
    doc.text(this.iharray[j].desc, 47 , i  - 1);
    doc.line(100, i - 5, 100, i );
    doc.text( String(this.iharray[j].itdh_qty_inv.toFixed(2)), 118 , i  - 1 , { align: 'right' });
    doc.line(120, i - 5 , 120, i );
    doc.text(this.iharray[j].itdh_um, 123 , i  - 1);
    doc.line(130, i - 5, 130, i );
    doc.text( String(Number(this.iharray[j].itdh_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
    doc.line(150, i - 5, 150, i );
    doc.text(String(this.iharray[j].itdh_taxc) + "%" , 153 , i  - 1);
    doc.line(160, i - 5 , 160, i );
    doc.text(String(this.iharray[j].itdh_disc_pct) + "%" , 163 , i  - 1);
    doc.line(170, i - 5 , 170, i );
    doc.text(String((this.iharray[j].itdh_price *
      ((100 - this.iharray[j].itdh_disc_pct) / 100) *
      this.iharray[j].itdh_qty_inv).toFixed(2)), 198 , i  - 1,{ align: 'right' });
    doc.line(200, i-5 , 200, i );
    doc.line(10, i, 200, i );
    i = i + 5;
    }
  }
  
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
   
        doc.text( "Arretée la présente facture a la somme de :" + mt1  , 20, i + 53)
        doc.text(  mt2  , 20, i + 60)
      } else {
        doc.text( "Arretée la présente facture a la somme de :" + mt  , 20, i + 53)

      }
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }
}


