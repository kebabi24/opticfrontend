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
  PurchaseOrderService,
  ProviderService,
  ItemService,
  AddressService,
  TaxeService,
  DeviseService,
  PurchaseOrder,
  LocationService,
  SiteService,
  CodeService,
  printBc,
} from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { round } from 'lodash';
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";

@Component({
  selector: 'kt-print-po',
  templateUrl: './print-po.component.html',
  styleUrls: ['./print-po.component.scss']
})
export class PrintPoComponent implements OnInit {

  purchaseOrder: PurchaseOrder;
  poForm: FormGroup;
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
  
 curr;
  
  pos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;


  

  row_number;
  message = "";
  prhServer;
  datasetPrint = [];
  user;
  prhnbr: String;
  prov;
  constructor(
    config: NgbDropdownConfig,
    private poFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private providersService: ProviderService,
    private purchaseOrderService: PurchaseOrderService,
    private poService: PurchaseOrderService,
    private addressService: AddressService,
    private itemsService: ItemService,
    private providerService: ProviderService,
    private siteService: SiteService,
    private deviseService: DeviseService,
    private taxService: TaxeService,
    private locationService: LocationService,
  ) {
    config.autoClose = true;
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
        id: "podg_line",
        name: "Ligne",
        field: "podg_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "podg_part",
        name: "Article",
        field: "podg_part",
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
        id: "podg_qty_ord",
        name: "QTE",
        field: "podg_qty_ord",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        
      },
      {
        id: "podg_sph",
        name: "SPH",
        field: "podg_sph",
        sortable: true,
        width: 40,
        filterable: false,
        
      },
      {
        id: "podg_cyl",
        name: "CYL",
        field: "podg_cyl",
        sortable: true,
        width: 40,
        filterable: false,
        
      },
      {
        id: "podg_add",
        name: "ADD",
        field: "podg_add",
        sortable: true,
        width: 40,
        filterable: false,
        
      },
      {
        id: "podg_price",
        name: "Prix unitaire",
        field: "podg_price",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
        formatter: Formatters.decimal,
       
      },
      {
        id: "podg_taxable",
        name: "A Taxer",
        field: "podg_taxable",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: Formatters.checkbox,
      },
      
      {
        id: "podg_taxc",
        name: "Taux Taxe",
        field: "podg_taxc",
        sortable: true,
        width: 80,
        filterable: false,
      
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
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.reset();
    this.createForm();
    this.createtotForm();
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.purchaseOrder = new PurchaseOrder()
    const date = new Date()
    this.poForm = this.poFB.group({
      po_nbr: [this.purchaseOrder.po_nbr],
      po_vend: [{ value: this.purchaseOrder.po_vend, disabled: true }],
      name: [{value: '', disabled: true}],
      po_ord_date: [{ value: this.purchaseOrder.po_ord_date, disabled: true }],
      po_curr: [{ value: this.purchaseOrder.po_curr, disabled: true }],
      po_ex_rate: [{ value: this.purchaseOrder.po_ex_rate, disabled: true }],
      po_ex_rate2: [{ value: this.purchaseOrder.po_ex_rate2, disabled: true }],
      po_taxable: [this.purchaseOrder.po_taxable],
      po_taxc: [this.purchaseOrder.po_taxc],
      po_rmks: [{ value: this.purchaseOrder.po_rmks, disabled: true }],
      po_cr_terms: [this.purchaseOrder.po_cr_terms],
     
    });
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
    this.createForm();
    this.dataset=[];
    this.hasFormErrors = false;

  }
  // save data
  onSubmit() {
    this.hasFormErrors = false
    const controls = this.poForm.controls
    const controlsht = this.totForm.controls

    /** check form */
    if (this.poForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )
        this.message =
            "Modifiez quelques éléments et réessayez de soumettre."
        this.hasFormErrors = true

        return
    }

    if (!this.dataset.length) {
        this.message = "La liste des article ne peut pas etre vide"
        this.hasFormErrors = true

        return
    }
  //  console.log(this.prov)
    //printBc(this.prov, this.dataset, this.prhServer, this.curr);
    this.printpdf(controls.po_nbr.value)
    this.purchaseOrderService
        .update({ po_stat: "I", po_amt: controlsht.tht.value, po_tax_amt: controlsht.tva.value, po_trl1_amt:controlsht.timbre.value }, this.prhServer.id)
        .subscribe( //(res) => {

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
                  "Impression BC avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              this.reset()
              this.router.navigateByUrl("/purchasing/print-po")
              this.reset()  
              
          }
      )


          //  const url = `/`
            //this.router.navigateByUrl(url, {
              //  relativeTo: this.activatedRoute,
            //})
       // })
}

  onChangeOA() {
    this.dataset=[]
    const controls = this.poForm.controls;
    const controlstot = this.totForm.controls;
    const po_nbr = controls.po_nbr.value;
    
    this.purchaseOrderService.findBy({ po_nbr }).subscribe(
      (res: any) => {
        const { purchaseOrder, details } = res.data;
        const det1 = details;
        this.prhServer = purchaseOrder;
        

       

        controls.po_vend.setValue(this.prhServer.po_vend);
        controls.po_curr.setValue(this.prhServer.po_curr);
        controls.po_taxable.setValue(this.prhServer.po_taxable);
        controls.po_taxc.setValue(this.prhServer.po_taxc);
        controls.po_cr_terms.setValue(this.prhServer.po_cr_terms);
        controls.po_ex_rate.setValue(this.prhServer.po_ex_rate);
        controls.po_ex_rate2.setValue(this.prhServer.po_ex_rate2);
        controls.po_ord_date.setValue({
          year: new Date(purchaseOrder.po_ord_date).getFullYear(),
          month: new Date(purchaseOrder.po_ord_date).getMonth() + 1,
          day: new Date(purchaseOrder.po_ord_date).getDate(),

             
      })

      
      controlstot.tht.setValue(this.prhServer.po_amt);
      controlstot.tva.setValue(this.prhServer.po_tax_amt);
      controlstot.timbre.setValue(this.prhServer.po_trl1_amt);
      controlstot.ttc.setValue(Number(this.prhServer.po_amt) + Number(this.prhServer.po_tax_amt) + Number(this.prhServer.po_trl1_amt));
      this.deviseService.getBy({cu_curr: this.prhServer.po_curr}).subscribe((resc:any)=>{  
        this.curr = resc.data
     })
        const ad_addr = this.prhServer.po_vend;
        //console.log(ad_addr)
        this.providerService.getBy({vd_addr: ad_addr}).subscribe((respo: any)=>{
                
                
          this.prov = respo.data
        })
        this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                
                
          this.provider = response.data

        controls.name.setValue(this.provider.ad_name);
      

        for (const object in det1) {
       //   console.log(details[object]);
          const detail = details[object];
      
          this.gridService.addItem(
            {

              
              id: this.dataset.length + 1,
              podg_line: this.dataset.length + 1,
              podg_part: detail.podg_part,
              cmvid: "",
              desc: detail.glass.gls_desc1,
              podg_qty_ord: detail.podg_qty_ord,
              podg_um: detail.glass.gls_um,
              podg_sph: detail.podg_sph,
              podg_cyl: detail.podg_cyl,
              podg_add: detail.podg_add,
              podg_disc_pct: detail.podg_disc_pct,  
              podg_price: detail.podg_price,
              podg_taxable: detail.podg_taxable,
              podg_taxc: detail.podg_taxc,
             
            },
            { position: "bottom" }
          );
          this.datasetPrint.push({
            id: this.dataset.length + 1,
            podg_line: this.dataset.length + 1,
            podg_part: detail.podg_part,
            cmvid: "",
            desc: detail.glass.gls_desc1,
            podg_qty_ord: detail.podg_qty_ord,
            podg_sph: detail.podg_sph,
            podg_cyl: detail.podg_cyl,
            podg_add: detail.podg_add,    
            podg_um: detail.glass.gls_um,
            podg_price: detail.podg_price,
            podg_taxable: detail.podg_taxable,
            podg_disc_pct: detail.podg_disc_pct,
            podg_taxc: detail.podg_taxc,
           
        });
        this.calculatetot();
        }
      })
     
      }

        
    );
  
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

  handleSelectedRowsChanged5(e, args) {
    const controls = this.poForm.controls;
    const controlstot = this.totForm.controls;

    this.dataset=[]
    
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.po_nbr.setValue(item.po_nbr || "");
        const po_nbr = controls.po_nbr.value;
        this.purchaseOrderService.findBy({ po_nbr: item.po.po_nbr }).subscribe(
          (res: any) => {
            const { purchaseOrder, details } = res.data;
            const det1 = details;
            this.prhServer = purchaseOrder;
            
            controls.po_nbr.setValue(this.prhServer.po_nbr)
            controls.po_vend.setValue(this.prhServer.po_vend);
            controls.po_curr.setValue(this.prhServer.po_curr);
            controls.po_taxable.setValue(this.prhServer.po_taxable);
            controls.po_taxc.setValue(this.prhServer.po_taxc);
            controls.po_cr_terms.setValue(this.prhServer.po_cr_terms);
            controls.po_ex_rate.setValue(this.prhServer.po_ex_rate);
            controls.po_ex_rate2.setValue(this.prhServer.po_ex_rate2);
            controls.po_ord_date.setValue({
              year: new Date(purchaseOrder.po_ord_date).getFullYear(),
              month: new Date(purchaseOrder.po_ord_date).getMonth() + 1,
              day: new Date(purchaseOrder.po_ord_date).getDate(),
          })
          controlstot.tht.setValue(this.prhServer.po_amt);
          controlstot.tva.setValue(this.prhServer.po_tax_amt);
          controlstot.timbre.setValue(this.prhServer.po_trl1_amt);
          controlstot.ttc.setValue(Number(this.prhServer.po_amt) + Number(this.prhServer.po_tax_amt) + Number(this.prhServer.po_trl1_amt));

          this.deviseService.getBy({cu_curr: this.prhServer.po_curr}).subscribe((resc:any)=>{  
            this.curr = resc.data
         })
            const ad_addr = this.prhServer.po_vend;
            this.providerService.getBy({vd_addr: ad_addr}).subscribe((respo: any)=>{
                 //   console.log(respo.data)
                    
              this.prov = respo.data
            })
           // console.log(ad_addr)
            this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                    
                    
              this.provider = response.data
    
            controls.name.setValue(this.provider.ad_name);
          
            for (const object in det1) {
             // console.log(details[object]);
              const detail = details[object];
              this.gridService.addItem(
                {
                  id: this.dataset.length + 1,
                  podg_line: this.dataset.length + 1,
                  podg_part: detail.podg_part,
                  cmvid: "",
                  desc: detail.glass.gls_desc1,
                  podg_qty_ord: detail.podg_qty_ord,
                  podg_sph: detail.podg_sph,
                  podg_cyl: detail.podg_cyl,
                  podg_add: detail.podg_add,  
                  podg_um: detail.glass.gls_um,
                  podg_price: detail.podg_price,
                  podg_disc_pct: detail.podg_disc_pct,
                  podg_taxable: detail.podg_taxable,
                  podg_taxc: detail.podg_taxc,
                 
                },
                { position: "bottom" }
              );
              this.datasetPrint.push({
                id: this.dataset.length + 1,
                podg_line: this.dataset.length + 1,
                podg_part: detail.podg_part,
                cmvid: "",
                desc: detail.glass.gls_desc1,
                podg_qty_ord: detail.podg_qty_ord,
                podg_sph: detail.podg_sph,
                podg_cyl: detail.podg_cyl,
                podg_add: detail.podg_add,
                podg_um: detail.glass.gls_um,
                podg_price: detail.podg_price,
                podg_disc_pct: detail.podg_disc_pct,
                podg_taxable: detail.podg_taxable,
                podg_taxc: detail.podg_taxc,
               
            });
            console.log("here", this.dataset.length)
            this.calculatetot();
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
        //console.log(response.data)
        this.pos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  calculatetot(){
    const controls = this.totForm.controls 
     const controlsso = this.poForm.controls 
     let tht = 0
     let tva = 0
     let timbre = 0
     let ttc = 0
     console.log(this.dataset, this.datasetPrint.length)
     for (var i = 0; i < this.dataset.length; i++) {
       console.log(this.dataset[i]  )
       tht += round((this.dataset[i].podg_price * ((100 - this.dataset[i].podg_disc_pct) / 100 ) *  this.dataset[i].podg_qty_ord),2)
       if(controlsso.po_taxable.value == true) tva += round((this.dataset[i].podg_price * ((100 - this.dataset[i].podg_disc_pct) / 100 ) *  this.dataset[i].podg_qty_ord) * (this.dataset[i].podg_taxc ? this.dataset[i].podg_taxc / 100 : 0),2)
      
    
       
  
       console.log(tva)
       if(controlsso.po_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
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
    const controlss = this.poForm.controls 
   // console.log("pdf")
    var doc = new jsPDF();
   
   // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image()
    img.src = "./assets/media/logos/company.png";
    //doc.addImage(img, 'png', 5, 5, 210, 30)
    doc.setFontSize(12);
    doc.text( 'Bon Commande N° : ' + nbr  , 70, 40);
    doc.setFontSize(8);
    
    doc.text('Code Fournisseur : ' + this.provider.ad_addr, 20 , 50 )
    doc.text('Nom             : ' + this.provider.ad_name, 20 , 55)
    doc.text('Adresse       : ' + this.provider.ad_line1, 20 , 60)
    if (this.provider.ad_misc2_id != null) {doc.text('MF          : ' + this.provider.ad_misc2_id, 20 , 65)}
        if (this.provider.ad_gst_id != null) {doc.text('RC          : ' + this.provider.ad_gst_id, 20 , 70)}
        if (this.provider.ad_pst_id) {doc.text('AI            : ' + this.provider.ad_pst_id, 20 , 75)}
        if (this.provider.ad_misc1_id != null) {doc.text('NIS         : ' + this.provider.ad_misc1_id, 20 , 80)}
      
    doc.line(10, 85, 205, 85);
    doc.line(10, 90, 205, 90);
    doc.line(10, 85, 10, 90);
    doc.text('LN', 12.5 , 88.5);
    doc.line(20, 85, 20, 90);
    doc.text('Code Article', 25 , 88.5);
    doc.line(45, 85, 45, 90);
    doc.text('Désignation', 67.5 , 88.5);
    doc.line(165, 85, 165, 90);
    doc.text('QTE', 167 , 88.5);
    doc.line(175, 85, 175, 90);
    
    doc.text('Sph', 178 , 88.5);
    doc.line(185, 85, 185, 90);
    doc.text('Cyl', 188 , 88.5);
    doc.line(195, 85, 195, 90);
    doc.text('Add', 198 , 88.5);
    doc.line(205, 85, 205, 90);
    
   /* doc.text('PU', 148 , 88.5);
    doc.line(160, 85, 160, 90);
    doc.text('TVA', 162 , 88.5);
    doc.line(170, 85, 170, 90);
    doc.text('REM', 172 , 88.5);
    doc.line(180, 85, 180, 90);
    doc.text('THT', 192 , 88.5);
    doc.line(205, 85, 205, 90);*/
    var i = 95;
    doc.setFontSize(6);
    for (let j = 0; j < this.dataset.length  ; j++) {
      
      if ((j % 30 == 0) && (j != 0) ) {
  doc.addPage();
      //  doc.addImage(img, 'png', 5, 5, 210, 30)
        doc.setFontSize(12);
        doc.text( 'Commande N° : ' + nbr  , 70, 40);
        doc.setFontSize(8);
        //console.log(this.provider.ad_misc2_id)
        doc.text('Code Fournisseur : ' + this.provider.ad_addr, 20 , 50 )
        doc.text('Nom             : ' + this.provider.ad_name, 20 , 55)
        doc.text('Adresse       : ' + this.provider.ad_line1, 20 , 60)
        if (this.provider.ad_misc2_id != null) {doc.text('MF          : ' + this.provider.ad_misc2_id, 20 , 65)}
        if (this.provider.ad_gst_id != null) {doc.text('RC          : ' + this.provider.ad_gst_id, 20 , 70)}
        if (this.provider.ad_pst_id) {doc.text('AI            : ' + this.provider.ad_pst_id, 20 , 75)}
        if (this.provider.ad_misc1_id != null) {doc.text('NIS         : ' + this.provider.ad_misc1_id, 20 , 80)}
      
        doc.line(10, 85, 205, 85);
        doc.line(10, 90, 205, 90);
        doc.line(10, 85, 10, 90);
        doc.text('LN', 12.5 , 88.5);
        doc.line(20, 85, 20, 90);
        doc.text('Code Article', 25 , 88.5);
        doc.line(45, 85, 45, 90);
        doc.text('Désignation', 67.5 , 88.5);
        doc.line(165, 85, 165, 90);
        doc.text('QTE', 167 , 88.5);
        doc.line(175, 85, 175, 90);
        
        doc.text('Sph', 178 , 88.5);
        doc.line(185, 85, 185, 90);
        doc.text('Cyl', 188 , 88.5);
        doc.line(195, 85, 195, 90);
        doc.text('Add', 198 , 88.5);
        doc.line(205, 85, 205, 90);
        
        // doc.text('PU', 148 , 88.5);
        // doc.line(160, 85, 160, 90);
        // doc.text('TVA', 162 , 88.5);
        // doc.line(170, 85, 170, 90);
        // doc.text('REM', 172 , 88.5);
        // doc.line(180, 85, 180, 90);
        // doc.text('THT', 192 , 88.5);
        // doc.line(205, 85, 205, 90);
            i = 95;
        doc.setFontSize(6);
  
      }
  
  
  
      if (this.dataset[j].desc.length > 35) {
        let desc1 = this.dataset[j].desc.substring(35)
        let ind = desc1.indexOf(' ')
        desc1 = this.dataset[j].desc.substring(0, 35  + ind)
        let desc2 = this.dataset[j].desc.substring(35+ind)
  
        doc.line(10, i - 5, 10, i );
        doc.text(String(("000"+ this.dataset[j].podg_line)).slice(-3), 12.5 , i  - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].podg_part, 25 , i  - 1);
        doc.line(45, i - 5 , 45, i );
        doc.text(desc1, 47 , i  - 1);
        doc.line(165, i - 5, 165, i );
        doc.text( String(Number(this.dataset[j].podg_qty_ord)), 173 , i  - 1 , { align: 'right' });
        doc.line(175, i - 5 , 175, i );
        doc.text(this.dataset[j].podg_sph, 178 , i  - 1);
        doc.line(185, i - 5 , 185, i );
        doc.text(this.dataset[j].podg_cyl, 188 , i  - 1);
        doc.line(195, i - 5 , 195, i );
        doc.text(this.dataset[j].podg_add, 198 , i  - 1);
        doc.line(205, i - 5, 205, i );
        // doc.text( String(Number(this.dataset[j].podg_price).toFixed(2)), 168 , i  - 1 , { align: 'right' });
        // doc.line(160, i - 5, 160, i );
        // doc.text(String(this.dataset[j].podg_taxc) + "%" , 163 , i  - 1);
        // doc.line(170, i - 5 , 170, i );
        // doc.text(String(this.dataset[j].podg_disc_pct) + "%" , 173 , i  - 1);
        // doc.line(180, i - 5 , 180, i );
        // doc.text(String((this.dataset[j].podg_price *
        //         ((100 - this.dataset[j].podg_disc_pct) / 100) *
        //         this.dataset[j].podg_qty_ord).toFixed(2)), 203 , i  - 1,{ align: 'right' });
        // doc.line(205, i-5 , 205, i );
       // doc.line(10, i, 200, i );
  
        i = i + 5;
  
        doc.text(desc2, 47 , i  - 1);
        
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(165, i - 5, 165, i );
        doc.line(175, i - 5 , 175, i );
        doc.line(185, i - 5, 185, i );
        doc.line(195, i - 5, 195, i );
        // doc.line(140, i - 5, 140, i );
        // doc.line(160, i - 5, 160, i );
        
        // doc.line(170, i - 5, 170, i );
        // doc.line(180, i - 5 , 180, i );
       
        doc.line(205, i-5 , 205, i );
        doc.line(10, i, 205, i );
  
        i = i + 5 ;
        
      } else {
  
  
      
      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.dataset[j].podg_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].podg_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(this.dataset[j].desc, 47 , i  - 1);
      doc.line(165, i - 5, 165, i );
        doc.text( String(Number(this.dataset[j].podg_qty_ord)), 173 , i  - 1 , { align: 'right' });
        doc.line(175, i - 5 , 175, i );
        doc.text(this.dataset[j].podg_sph, 178 , i  - 1);
        doc.line(185, i - 5 , 185, i );
        doc.text(this.dataset[j].podg_cyl, 188 , i  - 1);
        doc.line(195, i - 5 , 195, i );
        doc.text(this.dataset[j].podg_add, 198 , i  - 1);
        doc.line(205, i - 5, 205, i );
      //  doc.text( String(Number(this.dataset[j].podg_price).toFixed(2)), 158 , i  - 1 , { align: 'right' });
      // doc.line(160, i - 5, 160, i );
      // doc.text(String(this.dataset[j].podg_taxc) + "%" , 163 , i  - 1);
      // doc.line(170, i - 5 , 170, i );
      // doc.text(String(this.dataset[j].podg_disc_pct) + "%" , 173 , i  - 1);
      // doc.line(180, i - 5 , 180, i );
      // doc.text(String((this.dataset[j].podg_price *
      //         ((100 - this.dataset[j].podg_disc_pct) / 100) *
      //         this.dataset[j].podg_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
      // doc.line(205, i-5 , 205, i );
      doc.line(10, i, 205, i );
      i = i + 5;
      }
    }
    
   // doc.line(10, i - 5, 200, i - 5);
  
  //  doc.line(130, i + 7,  205, i + 7  );
  //  doc.line(130, i + 14, 205, i + 14 );
  //  doc.line(130, i + 21, 205, i + 21 );
  //  doc.line(130, i + 28, 205, i + 28 );
  //  doc.line(130, i + 35, 205, i + 35 );
  //  doc.line(130, i + 7,  130, i + 35  );
  //  doc.line(160, i + 7,  160, i + 35  );
  //  doc.line(205, i + 7,  205, i + 35  );
  //  doc.setFontSize(10);
   
  //  doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
  //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
  //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
  //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });
  
   
  //  doc.text(String(Number(controls.tht.value).toFixed(2)), 203 ,  i + 12 , { align: 'right' });
  //  doc.text(String(Number(controls.tva.value).toFixed(2)), 203 ,  i + 19 , { align: 'right' });
  //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 203 ,  i + 26 , { align: 'right' });
  //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 203 ,  i + 33 , { align: 'right' });
  
  //  doc.setFontSize(8);
  //     let mt = NumberToLetters(
  //       Number(controls.ttc.value).toFixed(2),this.curr.cu_desc)
  
  //       if (mt.length > 95) {
  //         let mt1 = mt.substring(90)
  //         let ind = mt1.indexOf(' ')
         
  //         mt1 = mt.substring(0, 90  + ind)
  //         let mt2 = mt.substring(90+ind)
     
  //         doc.text( "Arretée la présente Commande a la somme de :" + mt1  , 20, i + 53)
  //         doc.text(  mt2  , 20, i + 60)
  //       } else {
  //         doc.text( "Arretée la présente Commande a la somme de :" + mt  , 20, i + 53)
  
  //       }
      // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
  
    }
  

}
