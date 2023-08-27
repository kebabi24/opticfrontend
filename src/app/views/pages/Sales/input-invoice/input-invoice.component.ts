import { Component, OnInit , ViewChild,  ElementRef} from "@angular/core";
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
  InvoiceOrderService,
  InvoiceOrderTempService,
  AccountService,
  InvoiceOrder,
  ConfigService,
  PayMethService,
  printIH,
  Item,
  ProductLineService,
} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: 'kt-input-invoice',
  templateUrl: './input-invoice.component.html',
  styleUrls: ['./input-invoice.component.scss']
})
export class InputInvoiceComponent implements OnInit {
  //@ViewChild('closebutton', {static: true}) 
 //closebutton: ElementRef;
  //@ViewChild('closebutton') closebutton;

 
  invoiceOrder: InvoiceOrder;
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

  angularGridcf: AngularGridInstance;
  gridcf: any;
  gridServicecf: GridService;
  dataViewcf: any;
  columnDefinitionscf: Column[];
  gridOptionscf: GridOption;
  //cfdataset: any[];

  customer: any;
  
  
  
  
    invoices: []
    columnDefinitions1: Column[] = []
    gridOptions1: GridOption = {}
    gridObj1: any
    angularGrid1: AngularGridInstance

  row_number;
  message = "";
  soServer;
  location: any;
  details: any;
  datasetPrint = [];
  stat: String;
  status: any;
  qty: Number;
  qtyship: Number;
  expire: Date;
  seq: any;
  ih_cr_terms: any[] = [];
  detail: any;
  curr: any;  
  user;
  invoiceTemp: any;
  pshnbr: String;
  cfg:any;
  total: Number;
  cfpl = [];
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
    private invoiceOrderService: InvoiceOrderService,
    
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
    private invoiceOrderTempService: InvoiceOrderTempService,
    private productLineService: ProductLineService,
    private taxService: TaxeService,
    private accountService: AccountService,
    private configService: ConfigService,
    private payMethService: PayMethService,
   
  ) {
    config.autoClose = true;
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
          

          


          
          this.ih_cr_terms = data});
      console.log(this.ih_cr_terms)


    } else {
             this.codeService
              .getBy({ code_fldname: "cm_cr_terms" })
              .subscribe((response: any) => (this.ih_cr_terms = response.data));
              console.log(this.ih_cr_terms)
           }
    })
      
      this.initGridih();
     // this.initGridcf();
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
      id: "idh_line",
      name: "Ligne",
      field: "idh_line",
      minWidth: 50,
      maxWidth: 50,
      selectable: true,
      sortable: true,
    },
    {
      id: "idh_nbr",
      name: "Commande",
      field: "idh_nbr",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    
    {
      id: "idh_part",
      name: "Article",
      field: "idh_part",
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
      id: "prod_line",
      name: "Ligne Produit",
      field: "prod_line",
      sortable: true,
      width: 50,
      filterable: false,
    },
    {
      id: "idh_um",
      name: "UM",
      field: "idh_um",
      sortable: true,
      width: 50,
      filterable: false,
      
    },
    {
      id: "idh_qty_inv",
      name: "Qte",
      field: "idh_qty_inv",
      sortable: true,
      width: 80,
      filterable: false,
      
    },
    {
      id: "idh_price",
      name: "Prix unitaire",
      field: "idh_price",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
     
    },
    {
      id: "idh_disc_pct",
      name: "Remise",
      field: "idh_disc_pct",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.decimal,
     
    },
    {
      id: "idh_taxable",
      name: "A Taxer",
      field: "idh_taxable",
      sortable: true,
      width: 80,
      filterable: false,
      //type: FieldType.float,
      formatter: Formatters.checkbox,
     
    },
    {
      id: "idh_taxc",
      name: "Taux Taxe",
      field: "idh_taxc",
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

    this.dataset = [];
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
      id: "glt_line",
      name: "Ligne",
      field: "glt_line",
      sortable: true,
      minWidth: 50,
      maxWidth: 50,
  },
    {
      id: "glt_ref",
      name: "PL",
      field: "glt_ref",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    }, 
    {
      id: "glt_desc",
      name: "Description",
      field: "glt_desc",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "glt_acct",
      name: "Compte",
      field: "glt_acct",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },

    {
      id: "glt_sub",
      name: "Sous Compte",
      field: "glt_sub",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "glt_cc",
      name: "Centre de Cout",
      field: "glt_cc",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "glt_curr_amt",
      name: "Montant Devise",
      field: "glt_curr_amt",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "glt_amt",
      name: "Montant ",
      field: "glt_amt",
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
  //    so__chr01: [this.invoiceOrder.ih__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    });
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.invoiceOrder = new InvoiceOrder();
      const date = new Date;
      
      this.ihForm = this.ihFB.group({
    //    so__chr01: [this.invoiceOrder.ih__chr01],
        ih_inv_nbr: [this.invoiceOrder.ih_inv_nbr , Validators.required],
        ih_nbr: [{value: this.invoiceOrder.ih_nbr , disabled: true}],
        ih_bill: [{value: this.invoiceOrder.ih_bill , disabled: true}],
        name: [{value:"", disabled: true}],
        
     
        ih_inv_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        ih_taxable: [{value: this.invoiceOrder.ih_taxable, disabled: true}],
       
        ih_po: [{value:this.invoiceOrder.ih_po, disabled: true}],
        ih_rmks: [this.invoiceOrder.ih_rmks],
        ih_curr: [{value:this.invoiceOrder.ih_curr, disabled: true}],
        ih_ex_rate: [{value:this.invoiceOrder.ih_ex_rate, disabled: true}],
        ih_ex_rate2: [{value:this.invoiceOrder.ih_ex_rate2, disabled: true}],
        ih_cr_terms: [this.invoiceOrder.ih_cr_terms, Validators.required],
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
     if (this.ihdataset[i].idh_part == "" || this.ihdataset[i].idh_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.ihdataset[i].idh_um == "" || this.ihdataset[i].idh_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.ihdataset[i].idh_qty_inv == 0 ) {
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
    this.addIh(ih, this.ihdataset /*,this.cfdataset*/);


  }

  prepareIh(): any {
    const controls = this.ihForm.controls;
    const controlstot = this.totForm.controls 
    const _ih = new InvoiceOrder();
    console.log("temp", this.invoiceTemp)
    _ih.ih_category =  this.invoiceTemp.ith_category
    _ih.ih_cust = this.invoiceTemp.ith_cust;
    _ih.ih_bill = this.invoiceTemp.ith_bill;
    _ih.ih_nbr = this.invoiceTemp.ith_nbr;
    
    _ih.ih_inv_date = controls.ih_inv_date.value
    ? `${controls.ih_inv_date.value.year}/${controls.ih_inv_date.value.month}/${controls.ih_inv_date.value.day}`
    : null;
  
    
      if (this.invoiceTemp.ith_taxable == null || this.invoiceTemp.ith_taxable == "" ) { _ih.ih_taxable = false} else { _ih.ih_taxable = this.invoiceTemp.ith_taxable}
    
   
    _ih.ih_rmks = this.invoiceTemp.ith_rmks;
    
    _ih.ih_rmks = this.invoiceTemp.ith_rmks;
    _ih.ih_curr = this.invoiceTemp.ith_curr;
    _ih.ih_ex_rate = this.invoiceTemp.ith_ex_rate;
    _ih.ih_ex_rate2 = this.invoiceTemp.ith_ex_rate2;


    _ih.ih_inv_nbr =  controls.ih_inv_nbr.value
    
    _ih.ih_cr_terms = controls.ih_cr_terms.value;
    _ih.ih_amt = controlstot.tht.value;
    _ih.ih_tax_amt = controlstot.tva.value;
    _ih.ih_trl3_amt = controlstot.timbre.value;


    
    return _ih;
  
  }
  /**
   * Add po
   *
   * @param _ih: ih
   */
  addIh(_ih: any, detail: any /*, cfdetail:any*/ ) {
    var array = []
    var iharray = []
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    /*
    for (let data of cfdetail) {
      delete data.id;
      delete data.cmvid;
     
    }*/
    this.loadingSubject.next(true);
    let ih = null;
    const controls = this.ihForm.controls;

    this.invoiceOrderTempService
      .imput({ invoiceOrder: _ih, invoiceOrderDetail: detail /*, gldetail: cfdetail*/ })
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
    //console.log('aaa',res[value.idh_part])
    if (!res[value.idh_part]) {
      res[value.idh_part] = { idh_part: value.idh_part,  idh_qty_inv: 0 };
      result.push(res[value.idh_part])
      
    }
    res[value.idh_part].idh_qty_inv += value.idh_qty_inv; 
    return res;
  }, {});
  
  console.log('bbb',result)
  var bool = false
  for (var obj = 0; obj < result.length; obj++) {
    const det = result[obj];
    
iharray.push(det)
bool = false
var j = 0
   
    do {
  if (this.ihdataset[j].idh_part = det.idh_part ) {
    iharray[obj].idh_line = obj + 1
    iharray[obj].desc =  this.ihdataset[j].desc
    iharray[obj].idh_price =  this.ihdataset[j].idh_price
    iharray[obj].idh_taxable = this.ihdataset[j].idh_taxable
    iharray[obj].idh_tax_code = this.ihdataset[j].idh_tax_code
    iharray[obj].idh_taxc = this.ihdataset[j].idh_taxc
    iharray[obj].idh_disc_pct = this.ihdataset[j].idh_disc_pct
    iharray[obj].idh_um = this.ihdataset[j].idh_um
    
    
  bool = true   
  }
  j++
  }while ( j < this.ihdataset.length || bool == false);


                         
  }
  console.log("hnahna", iharray)
  

         // if(controls.print.value == true) printIH(this.customer, iharray, ih,this.curr);
          this.reset()
          this.router.navigateByUrl("/Sales/input-invoice");
          this.reset()
        }
      );
  }
 
  


 

  

  onChangeInv() {
    const controls = this.ihForm.controls
    const controlst = this.totForm.controls
    this.dataset = []
    this.ihdataset = []
   // this.cfdataset = []
    this.invoiceOrderTempService
        .findBy({ith_inv_nbr: controls.ih_inv_nbr.value, ith_invoiced: false})
        .subscribe((response: any) => {
            console.log(response.data.invoiceOrderTemp)
            if (response.data.invoiceOrderTemp == null) {
                alert("Facture nexiste pas ou bien Imputé")
                controls.ih_inv_nbr.setValue(null)
                //console.log(response.data.length)
                document.getElementById("invoice").focus();
            }  else {

              this.invoiceTemp = response.data.invoiceOrderTemp;
              const det1 = response.data.details;
              controls.ih_inv_nbr.setValue (this.invoiceTemp.ith_inv_nbr)
              controls.ih_nbr.setValue(this.invoiceTemp.ith_nbr )
              controls.ih_bill.setValue(this.invoiceTemp.ith_bill)
              controlst.tht.setValue(Number(this.invoiceTemp.ith_amt).toFixed(2));
              controlst.tva.setValue(Number(this.invoiceTemp.ith_tax_amt).toFixed(2));
              controlst.timbre.setValue(Number(this.invoiceTemp.ith_trl3_amt).toFixed(2));
              let ttc = Number(this.invoiceTemp.ith_amt) + Number(this.invoiceTemp.ith_tax_amt) + Number(this.invoiceTemp.ith_trl3_amt)
              controlst.ttc.setValue(ttc.toFixed(2));
              
              
              
              this.customersService.getBy({ cm_addr: this.invoiceTemp.ith_bill }).subscribe(
                (ressa: any) => {
                  console.log(ressa);
                  this.customer  = ressa.data
                  
                    controls.name.setValue(ressa.data.address.ad_name || "");
                })
              
              const dateinv = new Date(this.invoiceTemp.ith_inv_date)
                        dateinv.setDate(dateinv.getDate() )
                        
                        controls.ih_inv_date.setValue({
                            year: dateinv.getFullYear(),
                            month: dateinv.getMonth() + 1,
                            day: dateinv.getDate(),
                        })
              

              controls.ih_taxable.setValue(this.invoiceTemp.ith_taxable)
             
              controls.ih_po.setValue(this.invoiceTemp.ith_po)
              controls.ih_rmks.setValue(this.invoiceTemp.ith_rmks)
              controls.ih_curr.setValue(this.invoiceTemp.ith_curr)
              controls.ih_ex_rate.setValue(this.invoiceTemp.ith_ex_rate)
              controls.ih_ex_rate2.setValue(this.invoiceTemp.ith_ex_rate2)
              controls.ih_cr_terms.setValue(this.invoiceTemp.ith_cr_terms)
              for (var object = 0; object < det1.length; object++) {
                const detail = det1[object];

               console.log(detail)
               this.itemsService.getByOne({pt_part: detail.itdh_part }).subscribe((resp:any)=>{
                console.log(resp.data)
              
                    this.gridServiceih.addItem(
                      {
                        id: detail.itdh_line, //this.dataset.length + 1,
                        idh_line: detail.itdh_line,   //this.dataset.length + 1,
                        idh_nbr: detail.itdh_nbr,
                       
                        idh_part: detail.itdh_part,
                        prod_line: resp.data.pt_prod_line,
                        cmvid: "",
                        desc: detail.item.pt_desc1,
                        idh_qty_inv: detail.itdh_qty_inv ,
                        idh_um: detail.itdh_um,
                        idh_um_conv: detail.itdh_um_conv,
                        idh_type: detail.itdh_type,
                        idh_price: detail.itdh_price,
                        idh_disc_pct: detail.itdh_disc_pct,
                        idh_taxable: detail.itdh_taxable,
                        idh_taxc: detail.itdh_taxc,
                        idh_tax_code: detail.itdh_tax_code,
                        idh_site: detail.itdh_site,
                        idh_loc: detail.itdh_loc,
                        idh_serial: detail.itdh_serial,
                        idh_status: detail.itdh_status,
                        idh_expire: detail.itdh_expire,
                      },
                      { position: "bottom" }
                    );
                    })
          }
  
          //this.calculatetot();
            }
        })
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

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
  
  


calculatetot(){
  const controls = this.totForm.controls 
   const controlsso = this.ihForm.controls 
   
   
   console.log(this.ihdataset.length)
   let tht = 0
   let tva = 0
   let timbre = 0
   let ttc = 0
   console.log(this.ihdataset)
   for (var i = 0; i < this.ihdataset.length; i++) {
     console.log("here",this.ihdataset[i].idh_price)
     console.log("here", this.ihdataset[i].idh_price,this.ihdataset[i].idh_qty_inv, this.ihdataset[i].idh_disc_pct, this.ihdataset[i].idh_taxc   )
     tht += round((this.ihdataset[i].idh_price * ((100 - this.ihdataset[i].idh_disc_pct) / 100 ) *  this.ihdataset[i].idh_qty_inv),2)
     if(this.ihdataset[i].idh_taxable == true) tva += round((this.ihdataset[i].idh_price * ((100 - this.ihdataset[i].idh_disc_pct) / 100 ) *  this.ihdataset[i].idh_qty_inv) * (this.ihdataset[i].idh_taxc ? this.ihdataset[i].idh_taxc / 100 : 0),2)
    
  
     

     console.log(tva)
     if(controlsso.ih_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
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
  this.dataset = []
  this.ihdataset = []
  //this.cfdataset = []  
  
  const controls = this.ihForm.controls
  const controlst = this.totForm.controls
  if (Array.isArray(args.rows) && this.gridObj1) {
      args.rows.map((idx) => {
          const item = this.gridObj1.getDataItem(idx)
          console.log(item)
          this.invoiceTemp = item
          controls.ih_inv_nbr.setValue (item.ith_inv_nbr)
              controls.ih_nbr.setValue(item.ith_nbr )
              controls.ih_bill.setValue(item.ith_bill)
              controlst.tht.setValue(Number(item.ith_amt).toFixed(2));
              controlst.tva.setValue(Number(item.ith_tax_amt).toFixed(2));
              controlst.timbre.setValue(Number(item.ith_trl3_amt).toFixed(2));
              let ttc = Number(item.ith_amt) + Number(item.ith_tax_amt) + Number(item.ith_trl3_amt)
              controlst.ttc.setValue(ttc.toFixed(2));
              
              
             
             
              const dateinv = new Date(item.ith_inv_date)
                        dateinv.setDate(dateinv.getDate() )
                        
                        controls.ih_inv_date.setValue({
                            year: dateinv.getFullYear(),
                            month: dateinv.getMonth() + 1,
                            day: dateinv.getDate(),
                        })
              
              
              controls.ih_taxable.setValue(item.ith_taxable)
             
              controls.ih_po.setValue(item.ith_po)
              controls.ih_rmks.setValue(item.ith_rmks)
              controls.ih_curr.setValue(item.ith_curr)
              controls.ih_ex_rate.setValue(item.ith_ex_rate)
              controls.ih_ex_rate2.setValue(item.ith_ex_rate2)
              controls.ih_cr_terms.setValue(item.ith_cr_terms)
              this.customersService.getBy({ cm_addr: item.ith_bill }).subscribe(
                (ressa: any) => {
               //   console.log(item.ith_bill);
                  this.customer  = ressa.data
                    controls.name.setValue(ressa.data.address.ad_name || "");
                })
              this.invoiceOrderTempService
              .findBy({ith_inv_nbr: item.ith_inv_nbr})
              .subscribe((response: any) => {
                //  console.log(response.data.invoiceOrderTemp)

              const det1 = response.data.details

              for (var object = 0; object < det1.length; object++) {
                const detail = det1[object];
              // console.log(detail)
               this.itemsService.getByOne({pt_part: detail.itdh_part }).subscribe((resp:any)=>{
                //console.log(resp.data)
              
                    this.gridServiceih.addItem(
                      {
                        id: detail.itdh_line, //this.dataset.length + 1,
                        idh_line: detail.itdh_line,   //this.dataset.length + 1,
                        idh_nbr: detail.itdh_nbr,
                       
                        idh_part: detail.itdh_part,
                        prod_line: resp.data.pt_prod_line,
                        cmvid: "",
                        desc: detail.item.pt_desc1,
                        idh_qty_inv: detail.itdh_qty_inv ,
                        idh_um: detail.itdh_um,
                        idh_um_conv: detail.itdh_um_conv,
                        idh_type: detail.itdh_type,
                        idh_price: detail.itdh_price,
                        idh_disc_pct: detail.itdh_disc_pct,
                        idh_taxable: detail.itdh_taxable,
                        idh_taxc: detail.itdh_taxc,
                        idh_tax_code: detail.itdh_tax_code,
                        idh_site: detail.itdh_site,
                        idh_loc: detail.itdh_loc,
                        idh_serial: detail.itdh_serial,
                        idh_status: detail.itdh_status,
                        idh_expire: detail.itdh_expire,
                      },
                      { position: "bottom" }
                    );
                    })
          }
         // this.closebutton.nativeElement.click();
         console.log("hhhhhhhheeeerreeeeeeeeeeeeeeeeeeeeee")
       //   document.getElementById("closebutton").click
  
          //this.calculatetot();
        })
      })
     // this.modalService.dismissAll()
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
          id: "ith_inv_nbr",
          name: "N° Facture",
          field: "ith_inv_nbr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ith_cust",
          name: "Client",
          field: "ith_cust",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ith_po",
          name: "Code Projet",
          field: "ith_po",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ith_nbr",
          name: "N° Commande",
          field: "ith_nbr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "ith_inv_date",
          name: "Date Effet",
          field: "ith_inv_date",
          sortable: true,
          filterable: true,
          type: FieldType.dateIso,
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
 
  this.invoiceOrderTempService
      .getByAll({ith_invoiced: false})
      .subscribe((response: any) => (this.invoices = response.data))
     
}
open(content) {
  this.prepareGrid1()
  this.modalService.open(content, { size: "lg" })
   
}


/*
oncreateCF() {
  const controls = this.ihForm.controls;
  const controlst = this.totForm.controls;
  
  this.calculatetot();

  this.cfpl = [];
  //this.cfdataset = [];
  var array = [];
  var tax = [];

  console.log("Number(this.total),", Number(this.total))
  console.log(this.customer)

//this.gridServicecf.addItem(
this.cfdataset.push(  
{
    id: 1,
    glt_line: 1, 
    glt_ref: this.customer.cm_addr,

    glt_desc: this.customer.address.ad_name,
    glt_acct: this.customer.cm_ar_acct,
    glt_sub: this.customer.cm_ar_sub,
    glt_cc: this.customer.cm_ar_cc,
    glt_curr_amt: - Number(controlst.ttc.value),
    glt_amt: - Number(controlst.ttc.value)  * ((controls.ih_ex_rate2.value) / (controls.ih_ex_rate.value)),
    

  } ,
 
);

   
          for (var j = 0; j < this.ihdataset.length; j++) {
         console.log("jjjjjjjjjjjj")
            this.ihdataset[j].total_line = this.ihdataset[j].idh_price * this.ihdataset[j].idh_qty_inv;
            this.ihdataset[j].tax_line = this.ihdataset[j].idh_price * this.ihdataset[j].idh_qty_inv * this.ihdataset[j].idh_taxc / 100;


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
      console.log(res.data)

      this.gridServicecf.addItem(
        {
          id: this.cfdataset.length + 1,
          glt_line: this.cfdataset.length + 1,
          glt_ref: det.prod_line,

          glt_desc: res.data.pl_desc,
          glt_acct: res.data.pl_sls_acct,
          glt_sub: res.data.pl_sls_sub,
          glt_cc: res.data.pl_sls_cc,
          glt_curr_amt:  det.total_line,
          glt_amt:   det.total_line * ((controls.ih_ex_rate2.value) / (controls.ih_ex_rate.value)),
          
    
        } ,
        { position: "bottom" }
      );
  
})

  }




  tax = this.ihdataset;        
          var result = [];
  tax.reduce(function(res, value) {
    //console.log('aaa',res[value.prod_line])
    if (!res[value.idh_tax_code]) {
      res[value.idh_tax_code] = { idh_tax_code: value.idh_tax_code, tax_line: 0 };
      result.push(res[value.idh_tax_code])
    }
    res[value.idh_tax_code].tax_line += value.tax_line;
    return res;
  }, {});
  
  console.log('bbb',result)
 
  for (var o = 0; o < result.length; o++) {
    const det = result[o];
         console.log("taxcode",det.idh_tax_code)
  this.taxService.getBy({ tx2_tax_code: det.idh_tax_code  }).subscribe(
    (res: any) => {
  console.log(res.data)
      var taxline = det.idh_tax_code
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhheé",taxline)

      this.gridServicecf.addItem(
        {
          id: this.cfdataset.length + 1,
          glt_line: this.cfdataset.length + 1,
          glt_ref: det.idh_tax_code,

          glt_desc: res.data.tx2_desc,
          glt_acct: res.data.tx2_ar_acct,
          glt_sub: res.data.tx2_ar_sub,
          glt_cc: res.data.tx2_ar_cc,
          glt_curr_amt:  det.tax_line,
          glt_amt:   det.tax_line * ((controls.ih_ex_rate2.value) / (controls.ih_ex_rate.value)),
          
    
        } ,
        { position: "bottom" }
      );
  
})

  }
  console.log("timbre" ,this.invoiceOrder.ih_trl3_amt)
if(this.invoiceOrder.ih_trl3_amt != 0) {
  this.codeService.getBy({ code_fldname: "cm_cr_terms", code_value: "ES"  }).subscribe(
    (res: any) => {
  console.log(res.data)
  
  this.accountService.getBy({ ac_code: res.data[0].chr01  }).subscribe(
    (resp: any) => {
  console.log(resp.data)
  
  
  this.gridServicecf.addItem(
    {
      id: this.cfdataset.length + 1,
      glt_line: this.cfdataset.length + 1,
      glt_ref: "Espece",
      glt_desc: resp.data.ac_desc,
      glt_acct: resp.data.ac_code,
     // glt_sub: res.data.tx2_ar_sub,
     // glt_cc: res.data.tx2_ar_cc,
      glt_curr_amt:  -Number(controlst.timbre.value),
      glt_amt:   -Number(controlst.timbre.value) * ((controls.ih_ex_rate2.value) / (controls.ih_ex_rate.value)),
      

    } ,
    { position: "bottom" }
  );
  })

})  
     
}    
}
*/
}
